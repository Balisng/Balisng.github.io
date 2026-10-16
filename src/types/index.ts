export type GameMode = 'race' | 'time' | 'words' | 'code' | 'quotes';

export type GameState = 'idle' | 'countdown' | 'racing' | 'finished';

export type SwitchSound = 'blue' | 'thock' | 'linear' | 'silent';

export type BotDifficulty = 'rookie' | 'veteran' | 'legend';

export interface Racer {
  id: string;
  name: string;
  isPlayer: boolean;
  color: string;
  glowColor: string;
  targetWpm: number;
  currentProgress: number; // 0 to 100
  currentWpm: number;
  finished: boolean;
  finishTime?: number;
  placement?: number;
  carStyle: 'cyber' | 'stealth' | 'hyper';
}

export interface CharState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect';
}

export interface RaceStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  cpm: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  mistakes: number;
  streak: number;
  maxStreak: number;
  timeElapsed: number; // seconds
  missedKeys: Record<string, number>;
}
