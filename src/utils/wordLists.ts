import type { GameMode } from '../types';

export const RACE_PASSAGES = [
  "Engines roar as the green lights flash down the drag strip. Tires grip asphalt with ferocious intensity while the turbo spools up, propelling the neon speedster into pure overdrive.",
  "In the dead of night, high-octane machines navigate neon-lit street corners, drifting seamlessly past steel barricades as nitrous oxide ignites with electric blue fire.",
  "Precision and rhythm are everything behind the wheel. Every gear shift must be instantaneous, every apex hit cleanly, and every split-second decision executed with razor-sharp focus.",
  "Speed is not merely about velocity, it is about staying perfectly calm in the eye of an aerodynamic hurricane, carving asphalt lines like lightning striking midnight glass.",
  "The checkered flag flutters in the distance through a haze of burning rubber. Heartbeats sync with the RPM redline as the finish line beckons for glory.",
  "Aerodynamics sculpt the airflow over the carbon fiber chassis. As speed climbs past two hundred miles per hour, the entire universe narrows into the tunnel of the road ahead.",
];

export const QUOTE_PASSAGES = [
  "Do not go gentle into that good night. Rage, rage against the dying of the light. Though wise men at their end know dark is right, their words had forked no lightning.",
  "The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle. As with all matters of the heart, you will know when you find it.",
  "It is not the critic who counts; not the man who points out how the strong man stumbles, but the one who is actually in the arena, whose face is marred by dust and sweat.",
  "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference in the journey toward the horizon.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit forged through thousands of deliberate repetitions in the shadows.",
];

export const COMMON_WORDS = [
  "time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand",
  "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government",
  "company", "number", "group", "problem", "fact", "system", "program", "question", "work",
  "speed", "racer", "engine", "turbo", "drift", "track", "boost", "flame", "cyber", "neon",
  "circuit", "hyper", "drive", "vector", "matrix", "future", "signal", "pulse", "focus", "flow",
  "streak", "velocity", "clutch", "throttle", "shift", "apex", "pedal", "finish", "crown", "trophy",
  "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "silent", "shadow", "rhythm",
  "mechanic", "switch", "click", "tactile", "linear", "chassis", "asphalt", "horizon", "champion"
];

export const CODE_SNIPPETS = [
  "const calculateWpm = (chars: number, seconds: number): number => Math.round((chars / 5) / (seconds / 60));",
  "const [racerSpeed, setRacerSpeed] = useState<number>(0);\nuseEffect(() => {\n  const interval = setInterval(updateTelemetry, 100);\n  return () => clearInterval(interval);\n}, []);",
  "function binarySearch(arr: number[], target: number): number {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
  "export async function fetchLeaderboard(): Promise<RacerStats[]> {\n  const response = await fetch('/api/leaderboard');\n  if (!response.ok) throw new Error('Failed to fetch telemetry');\n  return response.json();\n}",
  "const carStyle = {\n  transform: `translateX(${progress}%)`,\n  transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',\n  filter: isNitro ? 'drop-shadow(0 0 12px #00f2fe)' : 'none'\n};"
];

export function getRandomText(mode: GameMode, wordCount: number = 30): string {
  if (mode === 'race') {
    const idx = Math.floor(Math.random() * RACE_PASSAGES.length);
    return RACE_PASSAGES[idx];
  }
  if (mode === 'quotes') {
    const idx = Math.floor(Math.random() * QUOTE_PASSAGES.length);
    return QUOTE_PASSAGES[idx];
  }
  if (mode === 'code') {
    const idx = Math.floor(Math.random() * CODE_SNIPPETS.length);
    return CODE_SNIPPETS[idx];
  }
  // Default words or time mode: shuffle words
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const randWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    words.push(randWord);
  }
  return words.join(' ');
}
