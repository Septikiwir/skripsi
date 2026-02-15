import React, { useState, useEffect } from 'react';

interface QuestionCardProps {
    question: string;
    answer: string;
    hint?: string;
    isFlipped: boolean;
    isAlternateColor?: boolean;
    onClick: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    answer,
    hint,
    isFlipped,
    isAlternateColor = false,
    onClick,
}) => {
    const [showHint, setShowHint] = useState(false);
    const [showQuestionFade, setShowQuestionFade] = useState(false);
    const [showAnswerFade, setShowAnswerFade] = useState(false);

    const questionRef = React.useRef<HTMLDivElement>(null);
    const answerRef = React.useRef<HTMLDivElement>(null);

    const checkOverflow = () => {
        if (questionRef.current) {
            const { scrollHeight, clientHeight } = questionRef.current;
            setShowQuestionFade(scrollHeight > clientHeight);
        }
        if (answerRef.current) {
            const { scrollHeight, clientHeight } = answerRef.current;
            setShowAnswerFade(scrollHeight > clientHeight);
        }
    };

    // Reset hint state when question changes
    useEffect(() => {
        setShowHint(false);
    }, [question]);

    // Check overflow on mount and when content changes
    useEffect(() => {
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [question, answer, hint, showHint]);

    return (
        <div
            className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10] perspective-1000 cursor-pointer group"
            onClick={onClick}
        >
            <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* Front Face */}
                <div
                    className={`absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl border-4 md:border-[6px] shadow-card flex flex-col items-center justify-center px-6 pt-6 pb-14 md:px-8 md:pt-8 md:pb-20 text-center backface-hidden z-20 overflow-hidden ${isAlternateColor
                        ? 'bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-blue-900'
                        : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-slate-700'
                        }`}
                    style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
                >


                    {/* Card Content */}
                    <div
                        ref={questionRef}
                        className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-[90%] flex-1 min-h-0 touch-pan-y overflow-y-auto custom-scrollbar z-10 py-4"
                        style={showQuestionFade ? { maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' } : undefined}
                    >
                        <div className="flex flex-col items-center justify-center min-h-full w-full">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm flex-none">
                                Pertanyaan
                            </span>
                            <h2 className={`${question.length > 150 ? 'text-lg md:text-xl' :
                                question.length > 100 ? 'text-xl md:text-2xl' :
                                    question.length > 50 ? 'text-2xl md:text-4xl' :
                                        'text-3xl md:text-5xl'
                                } font-extrabold text-slate-800 dark:text-white drop-shadow-sm leading-tight break-words`}>
                                {question}
                            </h2>

                            {/* Hint Section */}
                            {hint && (
                                <div className="mt-2 md:mt-4 flex-none flex flex-col items-center gap-2">
                                    {!showHint ? (
                                        <button
                                            className="text-slate-400 hover:text-primary dark:hover:text-primary font-semibold flex items-center gap-2 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm md:text-base cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                checkOverflow(); // Check again when hint shows
                                                setShowHint(true);
                                            }}
                                        >
                                            <span className="material-icons-round text-base md:text-lg">lightbulb</span>
                                            Show Hint
                                        </button>
                                    ) : (
                                        <div
                                            className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-sm max-w-xs border border-yellow-200 dark:border-yellow-800/50 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors group/hint relative"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                checkOverflow(); // Check again when hint hides
                                                setShowHint(false);
                                            }}
                                        >
                                            <div className="absolute top-1 right-1 opacity-0 group-hover/hint:opacity-100 transition-opacity">
                                                <span className="material-icons-round text-xs text-yellow-600 dark:text-yellow-400">close</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 font-bold mb-1">
                                                <span className="material-icons-round text-sm">lightbulb</span>
                                                <span>Hint</span>
                                            </div>
                                            <p className="opacity-90 leading-snug">{hint}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tap to flip indicator */}
                        <div className="absolute bottom-4 md:bottom-6 text-slate-300 dark:text-slate-600 font-medium text-xs md:text-sm flex items-center gap-1 animate-pulse z-10">
                            <span className="material-icons-round text-sm md:text-base">touch_app</span>
                            Tap to flip
                        </div>
                    </div>
                </div>

                {/* Back Face */}
                <div
                    className={`absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl border-4 rotate-y-180 backface-hidden flex flex-col items-center justify-center p-6 md:p-8 text-center overflow-hidden ${isAlternateColor
                        ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500'
                        : 'bg-primary/10 dark:bg-primary/5 border-primary'
                        }`}
                    style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}
                >
                    <div
                        ref={answerRef}
                        className="w-full flex-1 min-h-0 touch-pan-y overflow-y-auto custom-scrollbar px-2 py-4"
                        style={showAnswerFade ? { maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' } : undefined}
                    >
                        <div className="flex flex-col items-center justify-center min-h-full w-full">
                            <span className={`${isAlternateColor ? 'text-blue-600 dark:text-blue-400' : 'text-primary-dark'} font-bold uppercase tracking-widest text-xs md:text-sm mb-2 md:mb-4 flex-none`}>
                                Jawaban
                            </span>
                            <h2 className={`${answer.length > 500 ? 'text-base md:text-lg' :
                                answer.length > 300 ? 'text-lg md:text-xl' :
                                    answer.length > 150 ? 'text-xl md:text-2xl' :
                                        answer.length > 80 ? 'text-2xl md:text-3xl' :
                                            'text-3xl md:text-5xl'
                                } font-bold ${isAlternateColor ? 'text-blue-700 dark:text-blue-300' : 'text-primary-dark'} break-words max-w-full`}>
                                {answer}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
