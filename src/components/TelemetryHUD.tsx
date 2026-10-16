import React from 'react';
import type { RaceStats } from '../types';
import { Gauge, Target, Flame, Clock, AlertTriangle, Zap } from 'lucide-react';

interface TelemetryHUDProps {
  stats: RaceStats;
  maxWpm?: number;
  timeRemaining?: number;
  isTimeMode?: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  stats,
  maxWpm = 160,
  timeRemaining,
  isTimeMode = false,
}) => {
  // Speedometer rotation angle (-90deg to +90deg, 180deg arc)
  const clampedWpm = Math.min(stats.wpm, maxWpm);
  const needleRotation = -90 + (clampedWpm / maxWpm) * 180;
  const isNitro = stats.streak >= 15;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 w-full">
      {/* 1. Main Live Speedometer Card */}
      <div className="col-span-2 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden shadow-xl backdrop-blur-md">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>Velocity / WPM</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl sm:text-5xl font-black font-mono tracking-tight transition-all ${
                isNitro
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-pink-500 animate-pulse drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'text-white'
              }`}
            >
              {Math.round(stats.wpm)}
            </span>
            <span className="text-xs font-mono text-slate-400">
              RAW {Math.round(stats.rawWpm)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {isNitro ? (
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white animate-bounce flex items-center gap-1">
                <Zap className="w-3 h-3" /> NITRO ACTIVE!
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-500">
                TOP SPEED {Math.round(Math.max(stats.wpm, stats.rawWpm))} WPM
              </span>
            )}
          </div>
        </div>

        {/* Mini Speedometer Dial Graphic */}
        <div className="relative w-28 h-20 flex items-center justify-center">
          <svg className="w-28 h-28 transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
            {/* Background Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="8"
              strokeDasharray="125 250"
              strokeLinecap="round"
            />
            {/* Dynamic Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={isNitro ? '#f59e0b' : '#06b6d4'}
              strokeWidth="8"
              strokeDasharray={`${(clampedWpm / maxWpm) * 125} 250`}
              strokeLinecap="round"
              className="transition-all duration-150"
            />
          </svg>
          {/* Dial Center Needle */}
          <div
            className="absolute bottom-3 left-1/2 w-1.5 h-12 bg-gradient-to-t from-cyan-400 to-pink-500 rounded-full origin-bottom transform transition-transform duration-100 ease-out shadow-[0_0_8px_#06b6d4]"
            style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
          />
          <div className="absolute bottom-2 left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-md" />
        </div>
      </div>

      {/* 2. Accuracy Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" />
            Accuracy
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded font-mono">
            {stats.accuracy >= 98 ? 'PERFECT' : stats.accuracy >= 95 ? 'GREAT' : 'OK'}
          </span>
        </div>
        <div className="my-2">
          <span className="text-3xl font-black font-mono tracking-tight text-emerald-400">
            {stats.accuracy.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-200"
            style={{ width: `${Math.max(0, Math.min(100, stats.accuracy))}%` }}
          />
        </div>
      </div>

      {/* 3. Streak & Combo */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Flame className={`w-4 h-4 ${isNitro ? 'text-amber-400 animate-bounce' : 'text-orange-400'}`} />
            Streak Combo
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            MAX {stats.maxStreak}
          </span>
        </div>
        <div className="my-2 flex items-baseline gap-1.5">
          <span className={`text-3xl font-black font-mono tracking-tight ${isNitro ? 'text-amber-400 animate-pulse' : 'text-orange-400'}`}>
            {stats.streak}
          </span>
          <span className="text-xs font-mono text-slate-500">keys</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-150 ${
              isNitro ? 'bg-gradient-to-r from-amber-400 to-pink-500' : 'bg-orange-400'
            }`}
            style={{ width: `${Math.min(100, (stats.streak / 25) * 100)}%` }}
          />
        </div>
      </div>

      {/* 4. Timer / Elapsed */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-400" />
            {isTimeMode ? 'Remaining' : 'Time'}
          </span>
        </div>
        <div className="my-2">
          <span className="text-3xl font-black font-mono tracking-tight text-purple-300">
            {isTimeMode && timeRemaining !== undefined ? `${timeRemaining}s` : `${stats.timeElapsed.toFixed(1)}s`}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          CPM: {Math.round(stats.cpm)}
        </div>
      </div>

      {/* 5. Mistakes Counter */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Errors
          </span>
        </div>
        <div className="my-2">
          <span className="text-3xl font-black font-mono tracking-tight text-rose-400">
            {stats.mistakes}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 truncate">
          {Object.keys(stats.missedKeys).length > 0
            ? `Keys: ${Object.keys(stats.missedKeys).slice(0, 3).join(', ')}`
            : 'Flawless run'}
        </div>
      </div>
    </div>
  );
};
