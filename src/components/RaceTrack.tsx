import React from 'react';
import type { Racer } from '../types';
import { Flame, Trophy } from 'lucide-react';

interface RaceTrackProps {
  racers: Racer[];
  playerStreak: number;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ racers, playerStreak }) => {
  const isNitro = playerStreak >= 15;

  return (
    <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background neon ambient aura */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Track Header / Mile markers */}
      <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-3 px-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-300 uppercase">Grand Prix Highway</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-slate-500">START 0%</span>
          <span className="hidden sm:inline text-slate-500">50%</span>
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <Trophy className="w-3.5 h-3.5" /> FINISH 100%
          </span>
        </div>
      </div>

      {/* Racetrack Lanes Container */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-xl border border-slate-800 p-2 sm:p-3 overflow-hidden shadow-inner">
        {/* Animated road markers */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] bg-[length:40px_100%]" />
        
        {/* Checkered Finish Line Strip */}
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 flex flex-col justify-around border-l-2 border-amber-400/80 bg-slate-900/60 overflow-hidden">
          <div className="w-full h-full grid grid-cols-2 grid-rows-12 gap-0.5 opacity-80">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`${(Math.floor(i / 2) + (i % 2)) % 2 === 0 ? 'bg-white' : 'bg-black'} rounded-[1px]`}
              />
            ))}
          </div>
        </div>

        {/* Lanes */}
        <div className="flex flex-col gap-2.5 relative z-0">
          {racers.map((racer) => {
            const hasNitro = racer.isPlayer && isNitro;
            // Rank badge calculation
            const sortedByProgress = [...racers].sort((a, b) => b.currentProgress - a.currentProgress);
            const currentRank = sortedByProgress.findIndex((r) => r.id === racer.id) + 1;

            return (
              <div
                key={racer.id}
                className={`relative h-14 sm:h-16 rounded-lg flex items-center transition-all ${
                  racer.isPlayer
                    ? 'bg-slate-800/40 border border-cyan-500/30'
                    : 'bg-slate-900/40 border border-slate-800/60'
                }`}
              >
                {/* Lane road dash lines */}
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-dashed border-b border-dashed border-slate-700/40" />

                {/* Left lane racer info */}
                <div className="absolute left-2.5 z-20 flex items-center gap-2 pointer-events-none">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                      currentRank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : currentRank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : 'bg-amber-700/60 text-amber-200'
                    }`}
                  >
                    #{currentRank}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold tracking-wide flex items-center gap-1.5" style={{ color: racer.color }}>
                      {racer.name}
                      {racer.isPlayer && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-mono">
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {Math.round(racer.currentWpm)} WPM • {Math.round(racer.currentProgress)}%
                    </span>
                  </div>
                </div>

                {/* Moving Vehicle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-150 ease-out z-10"
                  style={{
                    left: `calc(130px + (100% - 190px) * ${racer.currentProgress / 100})`,
                  }}
                >
                  <div className="relative group">
                    {/* Nitro Flame Exhaust */}
                    {hasNitro && (
                      <div className="absolute -left-7 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <Flame className="w-5 h-5 text-amber-400 animate-pulse -rotate-90 filter drop-shadow-[0_0_8px_#f59e0b]" />
                        <div className="w-4 h-1.5 bg-gradient-to-r from-cyan-400 to-amber-500 rounded-full blur-[1px] animate-ping" />
                      </div>
                    )}

                    {/* Speed Tag Bubble */}
                    <div
                      className={`absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow-md border ${
                        racer.isPlayer
                          ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900/90 text-slate-300 border-slate-700'
                      }`}
                    >
                      {Math.round(racer.currentWpm)} WPM
                    </div>

                    {/* Futuristic Cyber Car Graphic */}
                    <svg
                      width="58"
                      height="26"
                      viewBox="0 0 58 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`filter transition-transform duration-100 ${
                        hasNitro ? 'scale-110 drop-shadow-[0_0_12px_#06b6d4]' : 'drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]'
                      }`}
                    >
                      {/* Car Body base */}
                      <path
                        d="M3 17L10 10H22L32 6H44L55 14L56 18H52L49 20H13L9 18H3V17Z"
                        fill="#0f172a"
                        stroke={racer.color}
                        strokeWidth="1.5"
                      />
                      {/* Neon Accents */}
                      <path
                        d="M12 11L22 11L33 8H43L50 14H16L12 11Z"
                        fill={racer.glowColor}
                        fillOpacity={racer.isPlayer ? "0.85" : "0.5"}
                      />
                      {/* Cockpit Window */}
                      <path
                        d="M24 10L32 7.5H41L47 12H26L24 10Z"
                        fill="#0284c7"
                        fillOpacity="0.8"
                        stroke="#38bdf8"
                        strokeWidth="0.8"
                      />
                      {/* Rear Spoiler */}
                      <path d="M2 12V8H8" stroke={racer.color} strokeWidth="2" strokeLinecap="round" />
                      {/* Wheels with neon rims */}
                      <circle cx="15" cy="19" r="4.5" fill="#020617" stroke={racer.color} strokeWidth="1.5" />
                      <circle cx="15" cy="19" r="2" fill="#38bdf8" />
                      <circle cx="46" cy="19" r="4.5" fill="#020617" stroke={racer.color} strokeWidth="1.5" />
                      <circle cx="46" cy="19" r="2" fill="#38bdf8" />
                      {/* Front Headlight Beam */}
                      <path
                        d="M55 15L58 15"
                        stroke="#fef08a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="filter drop-shadow-[0_0_4px_#fef08a]"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
