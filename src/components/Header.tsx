import React from 'react';
import type { GameMode, SwitchSound, BotDifficulty } from '../types';
import { Volume2, VolumeX, Keyboard, Zap, Flag, Timer, FileText, Code2, Quote } from 'lucide-react';

interface HeaderProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  difficulty: BotDifficulty;
  onSelectDifficulty: (diff: BotDifficulty) => void;
  switchSound: SwitchSound;
  onSelectSwitchSound: (s: SwitchSound) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  keyboardVisible: boolean;
  onToggleKeyboard: () => void;
  timeLimit: number;
  onSelectTimeLimit: (t: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSelectMode,
  difficulty,
  onSelectDifficulty,
  switchSound,
  onSelectSwitchSound,
  isMuted,
  onToggleMute,
  keyboardVisible,
  onToggleKeyboard,
  timeLimit,
  onSelectTimeLimit,
}) => {
  return (
    <header className="w-full flex flex-col gap-4 py-4 border-b border-slate-800/80">
      {/* Top row: Brand & Sound / Keyboard controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-1.5">
                VELOCITY<span className="text-cyan-400">TYPE</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold uppercase">
                PRO RACER
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              High-Octane Mechanical Keyboard WPM Speed Test
            </p>
          </div>
        </div>

        {/* Audio switch & Keyboard toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switch sound selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={onToggleMute}
              className={`p-1.5 rounded-lg transition-colors ${
                isMuted ? 'text-rose-400 bg-rose-950/40' : 'text-cyan-400 hover:text-cyan-300'
              }`}
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <select
              value={switchSound}
              onChange={(e) => onSelectSwitchSound(e.target.value as SwitchSound)}
              className="bg-transparent text-slate-300 text-xs font-mono outline-none cursor-pointer pr-1 pl-1"
            >
              <option value="thock" className="bg-slate-900">Holy Panda (Thock)</option>
              <option value="blue" className="bg-slate-900">Cherry Blue (Clicky)</option>
              <option value="linear" className="bg-slate-900">Linear (Clack)</option>
              <option value="silent" className="bg-slate-900">Silent (Mute)</option>
            </select>
          </div>

          {/* Virtual Keyboard toggle */}
          <button
            onClick={onToggleKeyboard}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              keyboardVisible
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">Keyboard</span>
          </button>
        </div>
      </div>

      {/* Mode navigation bar & Difficulty */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2 px-3 backdrop-blur-md">
        {/* Game Mode Pills */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => onSelectMode('race')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              mode === 'race'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Flag className="w-3.5 h-3.5" /> Race
          </button>

          <button
            onClick={() => onSelectMode('time')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              mode === 'time'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Timer className="w-3.5 h-3.5" /> Time
          </button>

          <button
            onClick={() => onSelectMode('words')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              mode === 'words'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Words
          </button>

          <button
            onClick={() => onSelectMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              mode === 'code'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Code
          </button>

          <button
            onClick={() => onSelectMode('quotes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              mode === 'quotes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Quote className="w-3.5 h-3.5" /> Quotes
          </button>
        </div>

        {/* Sub-selectors (Difficulty for Race, Duration for Time) */}
        <div className="flex items-center gap-2">
          {mode === 'race' && (
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">AI Bots:</span>
              {(['rookie', 'veteran', 'legend'] as BotDifficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => onSelectDifficulty(d)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    difficulty === d
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {mode === 'time' && (
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Seconds:</span>
              {[15, 30, 60].map((t) => (
                <button
                  key={t}
                  onClick={() => onSelectTimeLimit(t)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    timeLimit === t
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
