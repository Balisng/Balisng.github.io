import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameMode, GameState, SwitchSound, BotDifficulty, Racer, RaceStats } from './types';
import { getRandomText } from './utils/wordLists';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { RaceTrack } from './components/RaceTrack';
import { TelemetryHUD } from './components/TelemetryHUD';
import { TypingArea } from './components/TypingArea';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { ResultsModal } from './components/ResultsModal';

const INITIAL_STATS: RaceStats = {
  wpm: 0,
  rawWpm: 0,
  accuracy: 100,
  cpm: 0,
  totalKeystrokes: 0,
  correctKeystrokes: 0,
  mistakes: 0,
  streak: 0,
  maxStreak: 0,
  timeElapsed: 0,
  missedKeys: {},
};

export default function App() {
  // Game settings
  const [mode, setMode] = useState<GameMode>('race');
  const [difficulty, setDifficulty] = useState<BotDifficulty>('veteran');
  const [switchSound, setSwitchSound] = useState<SwitchSound>('thock');
  const [isMuted, setIsMuted] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(true);
  const [timeLimit, setTimeLimit] = useState<number>(30);

  // Game state
  const [gameState, setGameState] = useState<GameState>('idle');
  const [countdown, setCountdown] = useState<number>(3);
  const [targetText, setTargetText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [stats, setStats] = useState<RaceStats>(INITIAL_STATS);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);

  // Keyboard visualizer states
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Time tracking refs
  const startTimeRef = useRef<number | null>(null);
  const finishOrderRef = useRef<number>(1);

  // Racers state
  const [racers, setRacers] = useState<Racer[]>([
    {
      id: 'player',
      name: 'CYBER RACER',
      isPlayer: true,
      color: '#06b6d4',
      glowColor: '#38bdf8',
      targetWpm: 0,
      currentProgress: 0,
      currentWpm: 0,
      finished: false,
      carStyle: 'cyber',
    },
    {
      id: 'bot-1',
      name: 'APEX GHOST',
      isPlayer: false,
      color: '#d946ef',
      glowColor: '#f472b6',
      targetWpm: 75,
      currentProgress: 0,
      currentWpm: 0,
      finished: false,
      carStyle: 'stealth',
    },
    {
      id: 'bot-2',
      name: 'VOLT DRIFT',
      isPlayer: false,
      color: '#f59e0b',
      glowColor: '#fbbf24',
      targetWpm: 68,
      currentProgress: 0,
      currentWpm: 0,
      finished: false,
      carStyle: 'hyper',
    },
  ]);

  // Next target key to press for the keyboard visualizer
  const targetKey = targetText && userInput.length < targetText.length
    ? targetText[userInput.length]
    : null;

  // Initialize or reset text
  const setupGame = useCallback((currentMode: GameMode = mode) => {
    const text = getRandomText(currentMode, currentMode === 'time' ? 100 : 35);
    setTargetText(text);
    setUserInput('');
    setGameState('idle');
    setStats(INITIAL_STATS);
    setTimeRemaining(timeLimit);
    startTimeRef.current = null;
    finishOrderRef.current = 1;

    // Set bot speeds based on difficulty
    const bot1Speed = difficulty === 'rookie' ? 42 : difficulty === 'veteran' ? 74 : 108;
    const bot2Speed = difficulty === 'rookie' ? 36 : difficulty === 'veteran' ? 66 : 98;

    setRacers([
      {
        id: 'player',
        name: 'CYBER RACER',
        isPlayer: true,
        color: '#06b6d4',
        glowColor: '#38bdf8',
        targetWpm: 0,
        currentProgress: 0,
        currentWpm: 0,
        finished: false,
        carStyle: 'cyber',
      },
      {
        id: 'bot-1',
        name: 'APEX GHOST',
        isPlayer: false,
        color: '#d946ef',
        glowColor: '#f472b6',
        targetWpm: bot1Speed,
        currentProgress: 0,
        currentWpm: 0,
        finished: false,
        carStyle: 'stealth',
      },
      {
        id: 'bot-2',
        name: 'VOLT DRIFT',
        isPlayer: false,
        color: '#f59e0b',
        glowColor: '#fbbf24',
        targetWpm: bot2Speed,
        currentProgress: 0,
        currentWpm: 0,
        finished: false,
        carStyle: 'hyper',
      },
    ]);
  }, [mode, difficulty, timeLimit]);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  // Start race with 3-2-1 countdown
  const startRaceCountdown = () => {
    if (gameState === 'racing' || gameState === 'countdown') return;
    setGameState('countdown');
    setCountdown(3);
    sound.playCountdown(false);

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        sound.playCountdown(false);
      } else if (count === 0) {
        setCountdown(0);
        sound.playCountdown(true);
      } else {
        clearInterval(timer);
        setGameState('racing');
        startTimeRef.current = Date.now();
      }
    }, 800);
  };

  // Finish the race
  const finishRace = useCallback(() => {
    setGameState('finished');
    const finalElapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : stats.timeElapsed;
    sound.playVictory();

    setRacers((prev) =>
      prev.map((r) => {
        if (r.isPlayer && !r.finished) {
          return {
            ...r,
            currentProgress: 100,
            finished: true,
            finishTime: finalElapsed,
            placement: finishOrderRef.current++,
          };
        }
        return r;
      })
    );
  }, [stats.timeElapsed]);

  // Handle typing input
  const handleInputChange = (val: string) => {
    // If typing begins while idle, automatically start the race
    if (gameState === 'idle') {
      setGameState('racing');
      startTimeRef.current = Date.now();
    }

    if (gameState !== 'racing') return;

    // Check last character typed
    if (val.length > userInput.length) {
      const charIndex = val.length - 1;
      const expectedChar = targetText[charIndex];
      const typedChar = val[charIndex];
      const isSpace = typedChar === ' ';

      if (typedChar === expectedChar) {
        sound.playKeyClick(isSpace);
        const newStreak = stats.streak + 1;
        if (newStreak === 15 || newStreak === 30 || newStreak === 50) {
          sound.playNitroBoost();
        }

        setStats((prev) => ({
          ...prev,
          totalKeystrokes: prev.totalKeystrokes + 1,
          correctKeystrokes: prev.correctKeystrokes + 1,
          streak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak),
        }));
      } else {
        sound.playError();
        setStats((prev) => ({
          ...prev,
          totalKeystrokes: prev.totalKeystrokes + 1,
          mistakes: prev.mistakes + 1,
          streak: 0,
          missedKeys: {
            ...prev.missedKeys,
            [expectedChar || 'unknown']: (prev.missedKeys[expectedChar || 'unknown'] || 0) + 1,
          },
        }));
      }
    }

    setUserInput(val);

    // Check completion condition
    if (val.length >= targetText.length) {
      finishRace();
    }
  };

  // Main game telemetry loop (updates WPM, bot positions, time remaining)
  useEffect(() => {
    if (gameState !== 'racing') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = startTimeRef.current ? Math.max(0.1, (now - startTimeRef.current) / 1000) : 0.1;

      // Update time remaining in time mode
      if (mode === 'time') {
        const remaining = Math.max(0, Math.ceil(timeLimit - elapsed));
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          finishRace();
          return;
        }
      }

      // Calculate Player Telemetry
      const playerProgress = Math.min(100, (userInput.length / targetText.length) * 100);
      const minutes = elapsed / 60;
      const rawWpm = Math.max(0, Math.round((stats.totalKeystrokes / 5) / minutes));
      const wpm = Math.max(0, Math.round((stats.correctKeystrokes / 5) / minutes));
      const accuracy = stats.totalKeystrokes > 0
        ? Math.min(100, (stats.correctKeystrokes / stats.totalKeystrokes) * 100)
        : 100;
      const cpm = wpm * 5;

      setStats((prev) => ({
        ...prev,
        wpm,
        rawWpm,
        accuracy,
        cpm,
        timeElapsed: elapsed,
      }));

      // Update Racers progress & AI bot movement
      setRacers((prev) =>
        prev.map((racer) => {
          if (racer.isPlayer) {
            return {
              ...racer,
              currentProgress: playerProgress,
              currentWpm: wpm,
            };
          }

          if (racer.finished) return racer;

          // Realistic bot simulation: target WPM * elapsed time with subtle fluctuation
          const jitter = (Math.sin(elapsed * 2 + racer.targetWpm) * 3);
          const currentBotWpm = racer.targetWpm + jitter;
          const charsTyped = (currentBotWpm * 5) * (elapsed / 60);
          const botProgress = Math.min(100, (charsTyped / targetText.length) * 100);

          const isNowFinished = botProgress >= 100;

          return {
            ...racer,
            currentProgress: botProgress,
            currentWpm: currentBotWpm,
            finished: isNowFinished,
            finishTime: isNowFinished ? elapsed : undefined,
            placement: isNowFinished && !racer.placement ? finishOrderRef.current++ : racer.placement,
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, mode, timeLimit, userInput.length, targetText.length, stats.totalKeystrokes, stats.correctKeystrokes, finishRace]);

  // Global physical key listeners for virtual keyboard glow and instant restart shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Instant restart shortcut: Tab + Enter or Escape
      if (e.key === 'Escape' || (e.key === 'Enter' && gameState === 'finished')) {
        setupGame();
        return;
      }

      setActiveKey(e.key);
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, setupGame]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Cyber Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        {/* Fine grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col gap-5 flex-1">
        {/* Navigation & Settings Header */}
        <Header
          mode={mode}
          onSelectMode={(m) => {
            setMode(m);
            setupGame(m);
          }}
          difficulty={difficulty}
          onSelectDifficulty={(d) => {
            setDifficulty(d);
            setupGame(mode);
          }}
          switchSound={switchSound}
          onSelectSwitchSound={(s) => {
            setSwitchSound(s);
            sound.setSoundType(s);
          }}
          isMuted={isMuted}
          onToggleMute={() => {
            const muted = sound.toggleMute();
            setIsMuted(muted);
          }}
          keyboardVisible={keyboardVisible}
          onToggleKeyboard={() => setKeyboardVisible(!keyboardVisible)}
          timeLimit={timeLimit}
          onSelectTimeLimit={(t) => {
            setTimeLimit(t);
            setTimeRemaining(t);
          }}
        />

        {/* 1. Multi-Lane Race Highway Track (Shown in Race mode, or minimized in other modes) */}
        <RaceTrack racers={racers} playerStreak={stats.streak} />

        {/* 2. Live Speedometer & Telemetry Dashboard */}
        <TelemetryHUD
          stats={stats}
          timeRemaining={timeRemaining}
          isTimeMode={mode === 'time'}
        />

        {/* 3. High-Performance Typing Arena */}
        <TypingArea
          text={targetText}
          userInput={userInput}
          gameState={gameState}
          countdown={countdown}
          onInputChange={handleInputChange}
          onStartRace={startRaceCountdown}
          onReset={setupGame}
        />

        {/* 4. Interactive Mechanical Keyboard Visualizer */}
        <VirtualKeyboard
          activeKey={activeKey}
          targetKey={targetKey}
          visible={keyboardVisible}
          onToggleVisible={() => setKeyboardVisible(!keyboardVisible)}
        />
      </div>

      {/* Results Celebration Modal */}
      {gameState === 'finished' && (
        <ResultsModal
          stats={stats}
          racers={racers}
          onRestart={setupGame}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs font-mono text-slate-500 border-t border-slate-900">
        <p>
          VelocityType • Real-Time Mechanical Keyboard Speed & Telemetry Engine • Built with React & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
