
import React, { useState } from 'react';
import type { Question, Answers, SubjectInfo } from '../types';
import { CheckCircleIcon } from './icons';

interface QuestionPaperProps {
  questions: Question[];
  subjectInfo: SubjectInfo;
  onSubmit: (answers: Answers) => void;
  isLoading: boolean;
}

const QuestionPaper: React.FC<QuestionPaperProps> = ({ questions, subjectInfo, onSubmit, isLoading }) => {
  const [answers, setAnswers] = useState<Answers>(
    questions.reduce((acc, q) => ({ ...acc, [q.questionNumber]: '' }), {})
  );

  const handleAnswerChange = (questionNumber: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionNumber]: value }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subjectInfo.subject}</h2>
          <p className="text-slate-500 dark:text-slate-400">{subjectInfo.scheme}</p>
          <div className="mt-2 flex justify-between items-baseline">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Marks: 70</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Time: 3 Hrs</span>
          </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <p className="font-bold text-slate-800 dark:text-slate-100 pr-4">{q.questionText}</p>
              <span className="flex-shrink-0 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">{q.marks} Marks</span>
            </div>
            <textarea
              value={answers[q.questionNumber]}
              onChange={(e) => handleAnswerChange(q.questionNumber, e.target.value)}
              placeholder={`Your answer for Q. ${q.questionNumber}...`}
              rows={6}
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-8 border-t border-slate-200 dark:border-slate-700 rounded-t-lg">
          <div className="max-w-4xl mx-auto">
                <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 dark:disabled:bg-green-800 disabled:cursor-not-allowed"
                >
                <CheckCircleIcon/>
                {isLoading ? 'Evaluating...' : 'Submit for Evaluation'}
                </button>
          </div>
      </div>
    </div>
  );
};

export default QuestionPaper;
