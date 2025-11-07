
import React from 'react';
import type { EvaluationResult } from '../types';
import { RefreshIcon } from './icons';

interface ResultsDisplayProps {
  result: EvaluationResult;
  onRestart: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onRestart }) => {
  
  const scorePercentage = (result.totalMarksAwarded / result.totalPossibleMarks) * 100;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (awarded: number, total: number) => {
    const percentage = (awarded/total) * 100;
    if (percentage >= 75) return 'bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-700';
    if (percentage >= 40) return 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700';
    return 'bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-700';
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8 text-center">
        <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Your Result</h2>
        <p className={`text-6xl font-bold ${getScoreColor(scorePercentage)}`}>
          {result.totalMarksAwarded} / {result.totalPossibleMarks}
        </p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
          <div className={`${getScoreColor(scorePercentage).replace('text', 'bg')} h-2.5 rounded-full`} style={{ width: `${scorePercentage}%` }}></div>
        </div>
      </div>

      <div className="space-y-6">
        {result.results.map((item, index) => (
          <div key={index} className={`p-6 rounded-lg shadow-md border ${getScoreBgColor(item.awardedMarks, item.marks)}`}>
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-slate-800 dark:text-slate-100 pr-4">{item.questionText}</p>
              <span className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold px-3 py-1 rounded-full">{item.awardedMarks} / {item.marks}</span>
            </div>
            
            <div className="mt-4 p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Your Answer:</h4>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{item.userAnswer || 'Not Answered'}</p>
            </div>
            
            <div className="mt-4 p-4 bg-sky-50/50 dark:bg-sky-900/20 rounded-md border border-sky-200 dark:border-sky-700">
                <h4 className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-1">AI Feedback:</h4>
                <p className="text-sky-900 dark:text-sky-200">{item.feedback}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <RefreshIcon />
          Try Another Paper
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
