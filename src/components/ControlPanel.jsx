import { INTERCEPTOR_COLORS } from '../config/threats.js';

const INTERCEPTORS = [
  { key: 'iron_dome', label: 'IRON DOME', hebrew: 'כִּפַּת בַּרְזֶל', color: INTERCEPTOR_COLORS.iron_dome, shortcut: '1' },
  { key: 'davids_sling', label: "DAVID'S SLING", hebrew: 'קֶלַע דָּוִד', color: INTERCEPTOR_COLORS.davids_sling, shortcut: '2' },
  { key: 'arrow_2', label: 'ARROW 2', hebrew: 'חֵץ 2', color: INTERCEPTOR_COLORS.arrow_2, shortcut: '3' },
  { key: 'arrow_3', label: 'ARROW 3', hebrew: 'חֵץ 3', color: INTERCEPTOR_COLORS.arrow_3, shortcut: '4' },
];

export default function ControlPanel({
  ammo,
  onAction,
  selectedThreatId,
  feedbackMessage,
  streak,
  availableSystems,
}) {
  const hasSelection = selectedThreatId !== null;
  const visibleInterceptors = availableSystems
    ? INTERCEPTORS.filter(({ key }) => availableSystems.includes(key))
    : INTERCEPTORS;

  return (
    <div className="w-full">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-6">
          {streak >= 3 && (
            <div className="font-mono text-xs">
              <span className="text-orange-400 text-sm font-bold">🔥 {streak} STREAK</span>
            </div>
          )}
        </div>
        <div className="font-mono text-xs text-gray-500 tracking-wider">
          {hasSelection ? 'SELECT INTERCEPTOR OR HOLD FIRE' : 'SELECT A THREAT FIRST'}
        </div>
      </div>

      {/* Feedback message */}
      {feedbackMessage && (
        <div
          className={`mb-3 px-4 py-2 rounded font-mono text-sm text-center font-bold tracking-wide ${
            feedbackMessage.type === 'success'
              ? 'bg-green-900/50 text-green-400 border border-green-700'
              : feedbackMessage.type === 'warning'
              ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
              : feedbackMessage.type === 'error'
              ? 'bg-red-900/50 text-red-400 border border-red-700'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700'
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      {/* Interceptor + Hold Fire buttons */}
      <div className="flex gap-2">
        {visibleInterceptors.map(({ key, label, hebrew, color, shortcut }) => {
          const count = ammo[key];
          const depleted = count <= 0;
          const isLow = count === 1;
          const disabled = depleted || !hasSelection;

          return (
            <button
              key={key}
              onClick={() => !disabled && onAction(key)}
              disabled={disabled}
              className={`
                flex-1 py-3 px-2 rounded-lg font-mono transition-all relative
                border-2
                ${disabled
                  ? 'opacity-40 cursor-not-allowed border-gray-800 bg-gray-900/50'
                  : 'cursor-pointer active:scale-95 border-gray-700 bg-gray-900/30 hover:border-gray-500'
                }
                ${isLow && !disabled ? 'ammo-low-flash' : ''}
              `}
            >
              {/* Shortcut badge + system name + Hebrew — centered together */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className="w-6 h-6 rounded border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ borderColor: depleted ? '#4b5563' : color, color: depleted ? '#4b5563' : color }}
                >
                  {shortcut}
                </span>
                <div className="text-center">
                  <div className="text-xs font-bold tracking-wider" style={{ color: depleted ? '#4b5563' : color }}>{label}</div>
                  <div className="text-xs font-bold" style={{ color: depleted ? '#4b5563' : color, fontFamily: 'Arial, sans-serif' }}>{hebrew}</div>
                </div>
              </div>
              {/* Ammo count + dots — centered */}
              <div className="text-center">
                <span className="text-2xl font-bold tabular-nums" style={{ color: depleted ? '#4b5563' : color }}>
                  {depleted ? '—' : count}
                </span>
                {!depleted && (
                  <div className="flex justify-center gap-0.5 mt-1">
                    {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Hold Fire button */}
        <button
          onClick={() => hasSelection && onAction('hold_fire')}
          disabled={!hasSelection}
          className={`
            flex-1 py-3 px-2 rounded-lg font-mono transition-all relative
            border-2
            ${!hasSelection
              ? 'opacity-40 cursor-not-allowed border-gray-800 bg-gray-900/50'
              : 'cursor-pointer active:scale-95 border-gray-500 bg-gray-800/50 hover:border-gray-300'
            }
          `}
        >
          {/* Shortcut badge + label — centered together */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-6 h-6 rounded border-2 border-gray-500 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
              5
            </span>
            <span className="text-xs font-bold tracking-wider text-gray-400">HOLD FIRE</span>
          </div>
          <div className="text-center text-gray-300 text-2xl font-bold tracking-wider">
            —
          </div>
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="mt-2 text-center text-[11px] text-gray-600 font-mono tracking-wider">
        CLICK TARGET &#x2022; PRESS 1-4 TO FIRE &#x2022; SPACE = HOLD FIRE
      </div>
    </div>
  );
}
