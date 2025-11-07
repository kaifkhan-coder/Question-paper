
import React, { useState } from 'react';
import type { SubjectInfo } from '../types';
import { SparklesIcon } from './icons';

interface SetupFormProps {
  onSubmit: (info: SubjectInfo) => void;
  isLoading: boolean;
  error: string | null;
}

const SetupForm: React.FC<SetupFormProps> = ({ onSubmit, isLoading, error }) => {
  const [scheme, setScheme] = useState('I-Scheme');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim()) {
      onSubmit({ scheme, subject });
    }
  };

  const schemes = ['I-Scheme', 'G-Scheme', 'K-Scheme', 'E-Scheme'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Prepare for Your Exam</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Enter your subject details to generate a practice paper.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="board" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Board Name</label>
            <input 
              id="board" 
              type="text" 
              value="MSBTE" 
              disabled 
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed" 
            />
          </div>
          <div>
            <label htmlFor="scheme" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Scheme</label>
            <select
              id="scheme"
              value={scheme}
              onChange={(e) => setScheme(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              {schemes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Name or Code</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., 'Programming in C' or '22226'"
              required
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading || !subject.trim()}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 dark:disabled:bg-sky-800 disabled:cursor-not-allowed disabled:text-slate-300 dark:disabled:text-slate-500 transition-colors"
            >
              <SparklesIcon />
              {isLoading ? 'Generating...' : 'Generate Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupForm;
