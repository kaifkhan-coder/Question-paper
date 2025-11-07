
export enum AppStatus {
  SETUP = 'SETUP',
  GENERATING = 'GENERATING',
  TAKING_EXAM = 'TAKING_EXAM',
  EVALUATING = 'EVALUATING',
  RESULTS = 'RESULTS',
}

export interface SubjectInfo {
  scheme: string;
  subject: string;
}

export interface Question {
  questionNumber: string;
  questionText: string;
  marks: number;
}

export interface Answers {
  [questionNumber: string]: string;
}

export interface EvaluationResultItem {
  questionNumber: string;
  questionText: string;
  marks: number;
  userAnswer: string;
  awardedMarks: number;
  feedback: string;
}

export interface EvaluationResult {
  totalMarksAwarded: number;
  totalPossibleMarks: number;
  results: EvaluationResultItem[];
}
