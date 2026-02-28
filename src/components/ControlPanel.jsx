const INTERCEPTORS = [
  { key: 'iron_dome', label: 'IRON DOME', color: '#22c55e', shortcut: '1' },
  { key: 'davids_sling', label: "DAVID'S SLING", color: '#3b82f6', shortcut: '2' },
  { key: 'arrow_2', label: 'ARROW 2', color: '#a855f7', shortcut: '3' },
  { key: 'arrow_3', label: 'ARROW 3', color: '#ef4444', shortcut: '4' },
];

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ControlPanel({
  ammo,
  onAction,
  selectedThreatId,
  sessionTime,
  totalPenaltyTime,
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
          <div className="font-mono text-xs">
            <span className="text-gray-500">MISSION TIME </span>
            <span className="text-green-400 text-sm tabular-nums">{formatElapsed(sessionTime)}</span>
          </div>
          <div className="font-mono text-xs">
            <span className="text-gray-500">PENALTY </span>
            <span className={`text-sm tabular-nums ${totalPenaltyTime > 0 ? 'text-red-400' : 'text-gray-600'}`}>
              {totalPenaltyTime}s
            </span>
          </div>
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

      {/* Interceptor buttons */}
      <div className="flex gap-2">
        {visibleInterceptors.map(({ key, label, color, shortcut }) => {
          const count = ammo[key];
          const depleted = count <= 0;
          const disabled = depleted || !hasSelection;

          return (
            <button
              key={key}
              onClick={() => !disabled && onAction(key)}
              disabled={disabled}
              className={`
                flex-1 py-4 px-2 rounded-lg font-mono text-sm font-bold tracking-wider
                border-2 transition-all relative
                ${disabled
                  ? 'opacity-40 cursor-not-allowed border-gray-700 bg-gray-900 text-gray-600'
                  : 'cursor-pointer hover:scale-[1.02] active:scale-95'
                }
              `}
              style={
                !disabled
                  ? {
                      borderColor: color,
                      backgroundColor: `${color}15`,
                      color,
                      boxShadow: `0 0 15px ${color}20`,
                    }
                  : {}
              }
            >
              {/* Shortcut badge */}
              <div
                className="absolute top-1 right-1 w-5 h-5 rounded border flex items-center justify-center text-[10px] font-mono opacity-50"
                style={{ borderColor: disabled ? '#4b5563' : color, color: disabled ? '#4b5563' : color }}
              >
                {shortcut}
              </div>
              <div className="text-xs mb-1">{label}</div>
              <div className="text-lg tabular-nums">
                {depleted ? 'DEPLETED' : count}
              </div>
              {!depleted && (
                <div className="flex justify-center gap-1 mt-1">
                  {Array.from({ length: ammo[key] }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}

        {/* Hold Fire button */}
        <button
          onClick={() => hasSelection && onAction('hold_fire')}
          disabled={!hasSelection}
          className={`
            flex-1 py-4 px-2 rounded-lg font-mono text-sm font-bold tracking-wider
            border-2 transition-all relative
            ${!hasSelection
              ? 'opacity-40 cursor-not-allowed border-gray-700 bg-gray-900 text-gray-600'
              : 'cursor-pointer hover:scale-[1.02] active:scale-95 border-gray-400 bg-gray-800 text-gray-200 hover:bg-gray-700'
            }
          `}
        >
          {/* Shortcut badge */}
          <div className="absolute top-1 right-1 w-5 h-5 rounded border border-gray-500 flex items-center justify-center text-[10px] font-mono opacity-50 text-gray-400">
            5
          </div>
          <div className="text-xs mb-1">HOLD</div>
          <div className="text-lg">FIRE</div>
          <div className="text-[10px] mt-1 text-gray-500">NO INTERCEPT</div>
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="mt-2 text-center text-[10px] text-gray-600 font-mono tracking-wider">
        KEYS 1-5 SELECT ACTION &#x2022; TAB CYCLES THREATS &#x2022; SPACE = HOLD FIRE
      </div>
    </div>
  );
}
