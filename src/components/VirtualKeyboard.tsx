import React from 'react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  targetKey: string | null;
  visible: boolean;
  onToggleVisible: () => void;
}

const KEYBOARD_ROWS = [
  [
    { key: '`', shift: '~' },
    { key: '1', shift: '!' },
    { key: '2', shift: '@' },
    { key: '3', shift: '#' },
    { key: '4', shift: '$' },
    { key: '5', shift: '%' },
    { key: '6', shift: '^' },
    { key: '7', shift: '&' },
    { key: '8', shift: '*' },
    { key: '9', shift: '(' },
    { key: '0', shift: ')' },
    { key: '-', shift: '_' },
    { key: '=', shift: '+' },
    { key: 'Backspace', width: 'w-16 sm:w-20', label: '⌫' },
  ],
  [
    { key: 'Tab', width: 'w-14 sm:w-16', label: 'Tab' },
    { key: 'q', shift: 'Q' },
    { key: 'w', shift: 'W' },
    { key: 'e', shift: 'E' },
    { key: 'r', shift: 'R' },
    { key: 't', shift: 'T' },
    { key: 'y', shift: 'Y' },
    { key: 'u', shift: 'U' },
    { key: 'i', shift: 'I' },
    { key: 'o', shift: 'O' },
    { key: 'p', shift: 'P' },
    { key: '[', shift: '{' },
    { key: ']', shift: '}' },
    { key: '\\', shift: '|', width: 'w-12 sm:w-14' },
  ],
  [
    { key: 'CapsLock', width: 'w-16 sm:w-18', label: 'Caps' },
    { key: 'a', shift: 'A' },
    { key: 's', shift: 'S' },
    { key: 'd', shift: 'D' },
    { key: 'f', shift: 'F' },
    { key: 'g', shift: 'G' },
    { key: 'h', shift: 'H' },
    { key: 'j', shift: 'J' },
    { key: 'k', shift: 'K' },
    { key: 'l', shift: 'L' },
    { key: ';', shift: ':' },
    { key: "'", shift: '"' },
    { key: 'Enter', width: 'w-16 sm:w-22', label: 'Enter ↵' },
  ],
  [
    { key: 'Shift', width: 'w-20 sm:w-24', label: 'Shift' },
    { key: 'z', shift: 'Z' },
    { key: 'x', shift: 'X' },
    { key: 'c', shift: 'C' },
    { key: 'v', shift: 'V' },
    { key: 'b', shift: 'B' },
    { key: 'n', shift: 'N' },
    { key: 'm', shift: 'M' },
    { key: ',', shift: '<' },
    { key: '.', shift: '>' },
    { key: '/', shift: '?' },
    { key: 'ShiftRight', width: 'w-20 sm:w-24', label: 'Shift' },
  ],
  [
    { key: 'Control', width: 'w-14', label: 'Ctrl' },
    { key: 'Alt', width: 'w-14', label: 'Alt' },
    { key: ' ', width: 'flex-1 max-w-sm sm:max-w-md', label: 'SPACE' },
    { key: 'AltGraph', width: 'w-14', label: 'Alt' },
    { key: 'ControlRight', width: 'w-14', label: 'Ctrl' },
  ],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  targetKey,
  visible,
  onToggleVisible,
}) => {
  if (!visible) {
    return (
      <div className="w-full flex justify-center mt-2">
        <button
          onClick={onToggleVisible}
          className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
        >
          <span>⌨️ Show Mechanical Keyboard Visualizer</span>
        </button>
      </div>
    );
  }

  // Normalize key checking
  const isMatch = (defKey: string, shiftKey?: string, compare?: string | null) => {
    if (!compare) return false;
    if (defKey.toLowerCase() === compare.toLowerCase()) return true;
    if (shiftKey && shiftKey === compare) return true;
    if (defKey === ' ' && (compare === ' ' || compare === 'Space')) return true;
    return false;
  };

  return (
    <div className="w-full bg-slate-950/90 rounded-2xl border border-slate-800/80 p-3 sm:p-4 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all">
      {/* Visualizer header */}
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase">
            Live Keystroke Telemetry
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-amber-400/80 inline-block" /> Next Key
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-cyan-400 inline-block" /> Pressed
            </span>
          </div>
          <button
            onClick={onToggleVisible}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors underline"
          >
            Hide
          </button>
        </div>
      </div>

      {/* Keyboard Bed */}
      <div className="flex flex-col gap-1.5 sm:gap-2 items-center justify-center p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 sm:gap-1.5 w-full justify-center">
            {row.map((item, keyIdx) => {
              const isPressed = isMatch(item.key, item.shift, activeKey);
              const isNext = isMatch(item.key, item.shift, targetKey);
              const customWidth = item.width || 'w-8 sm:w-11';

              return (
                <div
                  key={keyIdx}
                  className={`h-9 sm:h-12 ${customWidth} rounded-md sm:rounded-lg flex flex-col items-center justify-center relative font-mono select-none transition-all duration-75 text-xs sm:text-sm font-semibold shadow-md ${
                    isPressed
                      ? 'bg-gradient-to-b from-cyan-400 to-cyan-600 text-slate-950 font-black shadow-[0_0_15px_#06b6d4] translate-y-0.5 border border-cyan-300'
                      : isNext
                      ? 'bg-slate-800 text-amber-300 border-2 border-amber-400/90 shadow-[0_0_10px_rgba(251,191,36,0.4)] animate-pulse'
                      : 'bg-gradient-to-b from-slate-850 to-slate-900 text-slate-300 border border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  {/* Subtle 3D keycap bevel top highlight */}
                  <div className="absolute inset-x-1 top-0.5 h-[1px] bg-white/10 rounded-t" />

                  {item.label ? (
                    <span className="text-[10px] sm:text-xs tracking-wider">{item.label}</span>
                  ) : (
                    <>
                      {item.shift && item.shift !== item.key.toUpperCase() && (
                        <span className="text-[8px] sm:text-[9px] text-slate-500 -mb-0.5">
                          {item.shift}
                        </span>
                      )}
                      <span>{item.key.toUpperCase()}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
