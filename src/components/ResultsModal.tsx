import React, { useEffect, useState } from 'react';
import type { Racer, RaceStats } from '../types';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Share2, Check, Medal, Zap, Target, Clock } from 'lucide-react';

interface ResultsModalProps {
  stats: RaceStats;
  racers: Racer[];
  onRestart: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ stats, racers, onRestart }) => {
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#06b6d4', '#f59e0b', '#ec4899', '#3b82f6'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  // Sort racers by placement
  const sortedRacers = [...racers].sort((a, b) => {
    if (a.placement && b.placement) return a.placement - b.placement;
    return b.currentProgress - a.currentProgress;
  });

  const player = racers.find((r) => r.isPlayer);
  const playerRank = player?.placement || sortedRacers.findIndex((r) => r.isPlayer) + 1;

  const handleCopyStats = () => {
    const text = `🏎️ VelocityType Race Results:
🏁 Placement: #${playerRank}
⚡ Speed: ${Math.round(stats.wpm)} WPM (Raw: ${Math.round(stats.rawWpm)})
🎯 Accuracy: ${stats.accuracy.toFixed(1)}%
🔥 Max Streak: ${stats.maxStreak}
⏱️ Time: ${stats.timeElapsed.toFixed(1)}s
Can you beat my speed?`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Glow ambient circle */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Podium Rank Icon */}
        <div className="relative inline-block mb-3">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
              playerRank === 1
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-amber-500/30'
                : playerRank === 2
                ? 'bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950'
                : 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white'
            }`}
          >
            {playerRank === 1 ? (
              <Trophy className="w-9 h-9" />
            ) : (
              <Medal className="w-9 h-9" />
            )}
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-300">
            #{playerRank} PLACE
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-3">
          {playerRank === 1
            ? '🏆 GRAND PRIX CHAMPION!'
            : playerRank === 2
            ? '🥈 SECOND PLACE FINISH!'
            : '🏁 RACE COMPLETED!'}
        </h2>
        <p className="text-xs font-mono text-slate-400 mt-1">
          High-performance keyboard telemetry recorded
        </p>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-slate-400 text-[10px] font-mono uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> WPM
            </span>
            <span className="text-3xl font-black font-mono text-cyan-400 mt-1">
              {Math.round(stats.wpm)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Raw: {Math.round(stats.rawWpm)}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-slate-400 text-[10px] font-mono uppercase flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" /> Accuracy
            </span>
            <span className="text-3xl font-black font-mono text-emerald-400 mt-1">
              {stats.accuracy.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {stats.mistakes} errors
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-slate-400 text-[10px] font-mono uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-400" /> Time
            </span>
            <span className="text-3xl font-black font-mono text-purple-300 mt-1">
              {stats.timeElapsed.toFixed(1)}s
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {Math.round(stats.cpm)} CPM
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-slate-400 text-[10px] font-mono uppercase flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Streak
            </span>
            <span className="text-3xl font-black font-mono text-amber-400 mt-1">
              {stats.maxStreak}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              max combo
            </span>
          </div>
        </div>

        {/* Competitor Standings Summary */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 mb-6 text-left">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block mb-2">
            Final Standings:
          </span>
          <div className="flex flex-col gap-1.5">
            {sortedRacers.map((r, i) => (
              <div
                key={r.id}
                className={`flex justify-between items-center px-3 py-1.5 rounded-lg text-xs font-mono ${
                  r.isPlayer
                    ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900/60 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">#{i + 1}</span>
                  <span style={{ color: r.color }} className="font-semibold">
                    {r.name} {r.isPlayer && '(YOU)'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{Math.round(r.currentWpm)} WPM</span>
                  <span className="text-slate-500">
                    {r.finishTime ? `${r.finishTime.toFixed(1)}s` : '100%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> RACE AGAIN (ENTER)
          </button>

          <button
            onClick={handleCopyStats}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Copied to Clipboard!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" /> Share Telemetry
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
