
import { GoogleGenAI, Type } from "@google/genai";
import type { Question, Answers, EvaluationResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            questionNumber: {
                type: Type.STRING,
                description: "The number of the question, e.g., '1. a)' or '2. b)'"
            },
            questionText: {
                type: Type.STRING,
                description: "The full text of the question."
            },
            marks: {
                type: Type.NUMBER,
                description: "The marks allocated for this question."
            }
        },
        required: ["questionNumber", "questionText", "marks"]
    }
};

const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        totalMarksAwarded: {
            type: Type.NUMBER,
            description: "The sum of all marks awarded to the student."
        },
        totalPossibleMarks: {
            type: Type.NUMBER,
            description: "The sum of the maximum possible marks for all questions."
        },
        results: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    questionNumber: {
                        type: Type.STRING,
                    },
                    questionText: {
                        type: Type.STRING,
                    },
                    marks: {
                        type: Type.NUMBER,
                    },
                    userAnswer: {
                        type: Type.STRING,
                    },
                    awardedMarks: {
                        type: Type.NUMBER,
                        description: "Marks awarded for the student's answer."
                    },
                    feedback: {
                        type: Type.STRING,
                        description: "Constructive feedback on the student's answer, explaining the reasoning for the awarded marks."
                    }
                },
                required: ["questionNumber", "questionText", "marks", "userAnswer", "awardedMarks", "feedback"]
            }
        }
    },
    required: ["totalMarksAwarded", "totalPossibleMarks", "results"]
};

export async function generateQuestionPaper(scheme: string, subject: string): Promise<Question[]> {
    const prompt = `Act as an expert on the Maharashtra State Board of Technical Education (MSBTE) curriculum. Generate a comprehensive model question paper for the subject: "${subject}" under the "${scheme}" scheme. 
    The paper should strictly follow the official MSBTE format and marking scheme.
    - The total marks for the paper should be 70.
    - Include a variety of question types (e.g., short answer, long answer, diagrams if applicable).
    - Ensure questions are distributed across different cognitive levels (Remember, Understand, Apply).
    - Structure the questions with clear numbering (e.g., Q.1, Q.2 a), etc.).
    - Generate around 10-15 questions covering the syllabus.
    Return the result as a JSON array.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: questionSchema,
        },
    });
    
    const text = response.text.trim();
    try {
        const questions: Question[] = JSON.parse(text);
        return questions;
    } catch (e) {
        console.error("Failed to parse question paper JSON:", text);
        throw new Error("Received an invalid format from the AI for the question paper.");
    }
}

export async function evaluateAnswers(questions: Question[], answers: Answers): Promise<EvaluationResult> {
    const studentPaper = questions.map(q => ({
        ...q,
        userAnswer: answers[q.questionNumber] || "Not Answered"
    }));

    const prompt = `You are an expert MSBTE examiner. Evaluate the following student's answers for the given question paper.
    For each question, compare the student's answer with the expected correct answer based on the MSBTE syllabus.
    Provide marks for each answer based on its accuracy, completeness, and correctness, adhering to the marks allocated for the question. Also, provide brief, constructive feedback for each answer.
    Finally, calculate the total score.
    
    Here is the paper with student's answers:
    ${JSON.stringify(studentPaper, null, 2)}
    
    Return the complete evaluation in the specified JSON format. Ensure the feedback is encouraging and helpful for the student's improvement.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: evaluationSchema,
        },
    });

    const text = response.text.trim();
    try {
        const result: EvaluationResult = JSON.parse(text);
        return result;
    } catch (e) {
        console.error("Failed to parse evaluation result JSON:", text);
        throw new Error("Received an invalid format from the AI for the evaluation.");
    }
}
