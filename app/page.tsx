'use client';

import { useState, useEffect } from 'react';
import { questions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isAlternateColor, setIsAlternateColor] = useState(false);

  // Timer State
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!finished) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [finished]);

  // Format Time Helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Derive current question
  const currentQuestion = questions[currentIndex];
  // Calculate progress percentage
  const progress = Math.round((answeredCount / questions.length) * 100);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setIsAlternateColor((prev) => !prev);
    } else {
      setFinished(true);
    }
  };

  const handleAnswered = () => {
    setAnsweredCount((prev) => Math.min(prev + 1, questions.length));
    handleNext();
  };

  if (finished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="w-24 h-24 bg-white dark:bg-surface-dark rounded-3xl flex items-center justify-center shadow-3d mb-6 mx-auto border-4 border-slate-100 dark:border-slate-700">
            <span className="material-icons-round text-primary text-6xl">emoji_events</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 dark:text-white mb-4">
            Spectacular!
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300">
            You've mastered all {questions.length} cards.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-primary text-slate-900 rounded-2xl font-bold shadow-3d-primary border-b-[6px] border-[#1e9e49] hover:brightness-105 active:shadow-none active:translate-y-1.5 active:border-b-0 transition-all"
          >
            Learn Again
          </button>
        </div>
      </div>
    )
  }

  const totalQuestions = questions.length;
  const formattedTime = formatTime(elapsedTime);
  const isActive = !finished; // Assuming timer is active if not finished

  return (
    <main className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-white relative">

      {/* Top Navigation Bar */}
      <header className="flex-none px-4 md:px-6 py-3 md:py-4 flex flex-wrap items-center justify-between w-full max-w-7xl mx-auto z-10 gap-y-3">
        {/* Left: Title */}
        <div className="flex items-center gap-2 md:gap-3 order-1 shrink-0">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-white dark:bg-surface-dark rounded-xl md:rounded-2xl flex items-center justify-center shadow-3d border-2 border-slate-100 dark:border-slate-700">
            <span className="material-icons-round text-primary text-xl md:text-3xl">school</span>
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-xl tracking-tight text-slate-800 dark:text-white leading-none">Sidang 24 Feb</h1>
            <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400">Skripsi</p>
          </div>
        </div>

        {/* Center: Chunky Progress Bar */}
        <div className="flex flex-col items-center w-full md:w-1/3 order-3 md:order-2 mt-1 md:mt-0">
          <div className="flex justify-between w-full text-[10px] md:text-xs font-bold text-slate-400 mb-1 md:mb-2 px-1 uppercase tracking-wide">
            <span>Progress</span>
            <span>{answeredCount} / {totalQuestions}</span>
          </div>
          <div className="h-3 md:h-5 w-full bg-slate-200 dark:bg-slate-700 rounded-full p-0.5 md:p-1 border border-slate-300 dark:border-slate-600 relative overflow-hidden">
            {/* Striped pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] opacity-30 z-10 pointer-events-none"></div>
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 relative z-0"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Right: Stats (Time & Left) */}
        <div className="flex items-center gap-4 order-2 md:order-3 shrink-0">
          <div className="flex items-center gap-2 md:gap-4 bg-white dark:bg-surface-dark px-2.5 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent-yellow"></span>
              <span className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span className="hidden sm:inline">Time: </span>
                <span className="text-slate-800 dark:text-slate-200">{formattedTime}</span>
              </span>
            </div>
            <div className="w-px h-3 md:h-4 bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"></span>
              <span className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span className="hidden sm:inline">Left: </span>
                <span className="text-slate-800 dark:text-slate-200">{totalQuestions - answeredCount}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-6 relative w-full max-w-7xl mx-auto gap-8 md:gap-12">

        {/* Background Decorations */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Flashcard Container */}
        <div className="w-full max-w-5xl">
          <QuestionCard
            question={currentQuestion.question}
            answer={currentQuestion.answer}
            hint={currentQuestion.hint}
            isFlipped={isFlipped}
            isAlternateColor={isAlternateColor}
            onClick={handleCardClick}
          />
        </div>

        {/* Controls Section */}
        <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 px-4 pb-8 md:pb-0">

          {/* Primary Assessment Actions */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:flex md:gap-4 w-full md:w-auto order-1">
            <button
              onClick={handleNext}
              className="w-full md:w-auto py-3 md:py-4 px-2 sm:px-4 md:px-8 bg-white dark:bg-surface-dark text-accent-red font-bold rounded-xl md:rounded-2xl shadow-3d-red border-b-[4px] md:border-b-[6px] border-red-200 active:shadow-none active:translate-y-1.5 active:border-b-0 transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 min-w-[30px] sm:min-w-[100px] md:min-w-[140px] hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              <span className="material-icons-round text-base sm:text-lg md:text-2xl">close</span>
              <span>Hard</span>
            </button>
            <button
              onClick={handleAnswered}
              className="w-full md:w-auto py-3 md:py-4 px-2 sm:px-4 md:px-8 bg-primary text-slate-900 font-extrabold rounded-xl md:rounded-2xl shadow-3d-primary border-b-[4px] md:border-b-[6px] border-[#1e9e49] active:shadow-none active:translate-y-1.5 active:border-b-0 transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 min-w-[30px] sm:min-w-[100px] md:min-w-[160px] hover:brightness-105 text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              <span className="material-icons-round text-base sm:text-lg md:text-2xl">check</span>
              <span>I Knew It!</span>
            </button>
          </div>

        </div>

      </div>
    </main>


  );
}
