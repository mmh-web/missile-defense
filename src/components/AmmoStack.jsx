import { INTERCEPTOR_COLORS } from '../config/threats.js';

const ALL_INTERCEPTORS = [
  { key: 'iron_dome', label: 'IRON DOME', shortcut: '1' },
  { key: 'davids_sling', label: "DAVID'S SLING", shortcut: '2' },
  { key: 'arrow_2', label: 'ARROW 2', shortcut: '3' },
  { key: 'arrow_3', label: 'ARROW 3', shortcut: '4' },
];

export default function AmmoStack({
  ammo,
  onAction,
  selectedThreatId,
  streak,
  availableSystems,
}) {
  const hasSelection = selectedThreatId !== null;

  return (
    <div className="flex flex-col h-full gap-2.5 py-2 px-4">
      {/* Column header */}
      <div className="text-center mb-1 border-b border-gray-800/50 pb-2">
        <div className="text-xs text-gray-400 font-mono tracking-[0.25em] font-bold">INTERCEPTORS</div>
        <div className="text-[10px] text-gray-600 font-mono mt-1">Press 1–5 to activate</div>
      </div>
      {/* Interceptors */}
      {ALL_INTERCEPTORS.map(({ key, label, shortcut }) => {
        const color = INTERCEPTOR_COLORS[key];
        const isAvailable = availableSystems?.includes(key) ?? false;
        const count = ammo[key] || 0;
        const depleted = count <= 0;
        const disabled = depleted || !hasSelection || !isAvailable;
        const isLow = isAvailable && count === 1;

        return (
          <button
            key={key}
            onClick={() => !disabled && onAction(key)}
            disabled={disabled}
            className={`
              text-left px-2 py-1.5 rounded transition-all
              ${!isAvailable ? 'opacity-20 cursor-default' : ''}
              ${isAvailable && !hasSelection ? 'cursor-default' : ''}
              ${isAvailable && hasSelection && depleted ? 'opacity-50 cursor-not-allowed' : ''}
              ${isAvailable && !disabled ? 'cursor-pointer hover:bg-white/5 active:scale-[0.97]' : ''}
              ${isLow && !disabled ? 'ammo-low-flash' : ''}
            `}
            style={{
              borderLeft: `3px solid ${isAvailable ? color : '#374151'}`,
            }}
          >
            {/* Row 1: key badge + name + count */}
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded border-2 flex items-center justify-center text-sm font-bold font-mono flex-shrink-0"
                style={{
                  borderColor: isAvailable ? color : '#374151',
                  color: isAvailable ? color : '#374151',
                }}
              >
                {shortcut}
              </span>

              <span
                className="flex-1 min-w-0 text-sm font-mono font-bold tracking-wider truncate"
                style={{ color: isAvailable ? color : '#374151' }}
              >
                {label}
              </span>

              <span
                className="text-xl font-mono font-bold tabular-nums flex-shrink-0"
                style={{ color: isAvailable ? (depleted ? '#4b5563' : color) : '#1f2937' }}
              >
                {isAvailable ? (depleted ? '0' : count) : ''}
              </span>
            </div>

            {/* Row 2: ammo dots — all shown, wrap to 2 lines */}
            {isAvailable && !depleted && (
              <div className="flex gap-[3px] mt-1 pl-[26px] flex-wrap">
                {Array.from({ length: count }).map((_, i) => (
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

      {/* Divider */}
      <div className="border-t border-gray-800/50 mx-2 my-0.5" />

      {/* Hold Fire */}
      <button
        onClick={() => hasSelection && onAction('hold_fire')}
        disabled={!hasSelection}
        className={`
          text-left px-2 py-1.5 rounded transition-all
          ${!hasSelection ? 'cursor-default' : 'cursor-pointer hover:bg-white/5 active:scale-[0.97]'}
        `}
        style={{ borderLeft: '3px solid #6b7280' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded border-2 border-gray-500 flex items-center justify-center text-sm font-bold font-mono text-gray-400 flex-shrink-0">
            5
          </span>
          <span className="text-sm font-mono font-bold tracking-wider text-gray-400">
            HOLD FIRE
          </span>
        </div>
      </button>

      {/* Streak */}
      {streak >= 3 && (
        <div className="text-center font-mono text-sm mt-1">
          <span className="text-orange-400 font-bold">
            {'\uD83D\uDD25'} {streak}
          </span>
        </div>
      )}

    </div>
  );
}
