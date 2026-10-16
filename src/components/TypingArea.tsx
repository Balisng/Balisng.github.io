import React, { useRef, useEffect } from 'react';
import type { GameState } from '../types';
import { RotateCcw, Play } from 'lucide-react';

interface TypingAreaProps {
  text: string;
  userInput: string;
  gameState: GameState;
  countdown: number;
  onInputChange: (val: string) => void;
  onStartRace: () => void;
  onReset: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  text,
  userInput,
  gameState,
  countdown,
  onInputChange,
  onStartRace,
  onReset,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Auto-focus input when racing starts or on click
  useEffect(() => {
    if (gameState === 'racing' || gameState === 'idle') {
      inputRef.current?.focus();
    }
  }, [gameState]);

  // Keep active character scrolled smoothly into view
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const charOffset = activeCharRef.current.offsetTop;
      const containerHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTop = Math.max(0, charOffset - containerHeight / 2 + 30);
    }
  }, [userInput]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={handleContainerClick}
      className="relative w-full bg-slate-950/85 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md cursor-text min-h-[180px] max-h-[260px] overflow-hidden flex flex-col justify-between group focus-within:border-cyan-500/50 transition-colors"
    >
      {/* Hidden input to capture physical keyboard events */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={gameState === 'countdown' || gameState === 'finished'}
        className="absolute opacity-0 -top-40 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Countdown overlay (3, 2, 1, GO!) */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 bg-slate-950/90 z-30 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="text-6xl sm:text-7xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-500 animate-ping">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-4">
            Revving engines... Hands on home row!
          </span>
        </div>
      )}

      {/* Idle state prompt */}
      {gameState === 'idle' && userInput.length === 0 && (
        <div className="absolute inset-0 bg-slate-950/60 z-20 flex flex-col items-center justify-center backdrop-blur-[2px] transition-all group-hover:bg-slate-950/40">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartRace();
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" /> START ENGINE / RACE
          </button>
          <p className="text-xs font-mono text-slate-400 mt-2.5">
            or just start typing to launch immediately
          </p>
        </div>
      )}

      {/* Word and Character Stream */}
      <div
        ref={containerRef}
        className="overflow-y-auto max-h-[160px] pr-2 select-none scrollbar-thin scrollbar-thumb-slate-800 scroll-smooth leading-relaxed"
      >
        <div className="text-lg sm:text-xl md:text-2xl font-mono tracking-wide flex flex-wrap gap-x-[0.55em] gap-y-2 items-center">
          {text.split(' ').map((word, wordIdx) => {
            // Calculate word start and end index in whole text
            const wordsBefore = text.split(' ').slice(0, wordIdx);
            const wordStartIndex = wordsBefore.join(' ').length + (wordIdx > 0 ? 1 : 0);
            const wordEndIndex = wordStartIndex + word.length;

            return (
              <span key={wordIdx} className="relative inline-flex whitespace-nowrap">
                {word.split('').map((char, charIdx) => {
                  const globalIdx = wordStartIndex + charIdx;
                  const isTyped = globalIdx < userInput.length;
                  const isCurrent = globalIdx === userInput.length;
                  const isCorrect = isTyped && userInput[globalIdx] === char;
                  const isIncorrect = isTyped && userInput[globalIdx] !== char;

                  return (
                    <span
                      key={charIdx}
                      ref={isCurrent ? activeCharRef : null}
                      className={`relative inline-block transition-colors duration-75 ${
                        isCorrect
                          ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                          : isIncorrect
                          ? 'text-rose-500 bg-rose-950/60 font-bold underline decoration-rose-500'
                          : 'text-slate-500'
                      }`}
                    >
                      {/* Smooth glowing Caret */}
                      {isCurrent && gameState === 'racing' && (
                        <span className="absolute -left-[1px] top-1 bottom-1 w-[2.5px] bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4] z-10" />
                      )}
                      {char}
                    </span>
                  );
                })}

                {/* Trailing space after word */}
                {wordIdx < text.split(' ').length - 1 && (
                  <span
                    className={`inline-block ml-1 ${
                      wordEndIndex < userInput.length
                        ? userInput[wordEndIndex] === ' '
                          ? 'text-cyan-400/30'
                          : 'text-rose-500 bg-rose-950/40'
                        : 'text-transparent'
                    }`}
                  >
                    {wordEndIndex === userInput.length && gameState === 'racing' && (
                      <span className="inline-block w-2 border-b-2 border-cyan-400 animate-pulse" />
                    )}
                    &nbsp;
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer controls inside typing arena */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 mt-2 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            Progress: {userInput.length} / {text.length} chars
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[11px] text-slate-500">
            [Tab + Enter to restart]
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all active:scale-95 text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
