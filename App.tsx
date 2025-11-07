
import React, { useState, useCallback } from 'react';
import { AppStatus, type SubjectInfo, type Question, type Answers, type EvaluationResult } from './types';
import { generateQuestionPaper, evaluateAnswers } from './services/geminiService';
import SetupForm from './components/SetupForm';
import QuestionPaper from './components/QuestionPaper';
import ResultsDisplay from './components/ResultsDisplay';
import { BookIcon, CheckCircleIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.SETUP);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [subjectInfo, setSubjectInfo] = useState<SubjectInfo | null>(null);

  const handleGeneratePaper = useCallback(async (info: SubjectInfo) => {
    setStatus(AppStatus.GENERATING);
    setError(null);
    setSubjectInfo(info);
    try {
      const generatedQuestions = await generateQuestionPaper(info.scheme, info.subject);
      setQuestions(generatedQuestions);
      setStatus(AppStatus.TAKING_EXAM);
    } catch (e) {
      console.error(e);
      setError('Failed to generate the question paper. Please try again.');
      setStatus(AppStatus.SETUP);
    }
  }, []);

  const handleSubmitAnswers = useCallback(async (answers: Answers) => {
    setStatus(AppStatus.EVALUATING);
    setError(null);
    try {
      const result = await evaluateAnswers(questions, answers);
      setEvaluationResult(result);
      setStatus(AppStatus.RESULTS);
    } catch (e) {
      console.error(e);
      setError('Failed to evaluate the answers. Please try again.');
      setStatus(AppStatus.TAKING_EXAM);
    }
  }, [questions]);

  const handleRestart = useCallback(() => {
    setStatus(AppStatus.SETUP);
    setQuestions([]);
    setEvaluationResult(null);
    setError(null);
    setSubjectInfo(null);
  }, []);

  const renderContent = () => {
    switch (status) {
      case AppStatus.SETUP:
        return <SetupForm onSubmit={handleGeneratePaper} isLoading={false} error={error} />;
      case AppStatus.GENERATING:
        return <LoadingState icon={<SparklesIcon />} title="Generating Your Paper..." message="Our AI is crafting a unique question paper based on the MSBTE syllabus for you. This might take a moment." />;
      case AppStatus.TAKING_EXAM:
        return <QuestionPaper questions={questions} onSubmit={handleSubmitAnswers} isLoading={false} subjectInfo={subjectInfo!} />;
      case AppStatus.EVALUATING:
        return <LoadingState icon={<CheckCircleIcon />} title="Evaluating Your Answers..." message="Our AI examiner is carefully reviewing your answers, assigning marks, and writing feedback. Hang tight!" />;
      case AppStatus.RESULTS:
        return <ResultsDisplay result={evaluationResult!} onRestart={handleRestart} />;
      default:
        return <SetupForm onSubmit={handleGeneratePaper} isLoading={false} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-center space-x-3">
            <BookIcon />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                MSBTE AI Question Paper Generator
            </h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
       <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400">
          <p>Powered by Google Gemini. This is a tool for practice and may not reflect the actual board paper.</p>
      </footer>
    </div>
  );
};


interface LoadingStateProps {
    icon: React.ReactNode;
    title: string;
    message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ icon, title, message }) => (
    <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="animate-spin text-sky-500 mb-4 h-12 w-12">{icon}</div>
        <h2 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="max-w-md text-slate-600 dark:text-slate-400">{message}</p>
    </div>
);


export default App;
