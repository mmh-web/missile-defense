import { THREAT_COLORS } from '../config/threats.js';

const TYPE_ABBR = {
  rocket: 'RKT',
  drone: 'DRN',
  cruise: 'CRS',
  ballistic: 'BAL',
  hypersonic: 'HYP',
};

function ThreatRow({ threat, isSelected, onSelect }) {
  const color = THREAT_COLORS[threat.type] || '#94a3b8';
  const isCritical = threat.timeLeft < 5;
  const isWarning = threat.timeLeft < 10 && !isCritical;
  const isHeld = threat.held;
  const timeStr = `${Math.max(0, Math.ceil(threat.timeLeft))}s`;

  const bgClass = isCritical
    ? 'bg-amber-950/25'
    : isWarning
      ? 'bg-yellow-950/15'
      : isSelected && !isHeld
        ? 'bg-white/10'
        : 'bg-transparent';

  return (
    <div
      onClick={() => !isHeld && onSelect(threat.id)}
      className={`
        flex items-center gap-1.5 px-2 py-1.5 rounded transition-all
        ${isHeld ? 'opacity-50 cursor-default' : 'cursor-pointer'}
        ${!isHeld && !isSelected && !isCritical && !isWarning ? 'hover:bg-white/5' : ''}
        ${isCritical ? 'animate-pulse' : ''}
        ${bgClass}
      `}
      style={{
        borderLeft: `3px solid ${isCritical ? '#f59e0b' : color}`,
        boxShadow: isSelected && !isHeld ? `0 0 10px ${color}30` : 'none',
      }}
    >
      {/* Threat ID */}
      <span
        className="w-7 text-xs font-mono font-bold flex-shrink-0 text-center"
        style={{ color }}
      >
        T{threat.id}{threat.priority ? '*' : ''}
      </span>

      {/* Type abbreviation */}
      <span
        className="w-9 text-[10px] font-mono font-bold uppercase tracking-wider flex-shrink-0"
        style={{ color }}
      >
        {TYPE_ABBR[threat.type] || '???'}
      </span>

      {/* Arrow separator */}
      <span className="text-gray-600 text-xs flex-shrink-0">▸</span>

      {/* Impact zone */}
      <span
        className={`flex-1 min-w-0 truncate text-xs font-mono font-bold ${
          isHeld
            ? 'text-gray-600'
            : !threat.impactRevealed
              ? 'text-yellow-600 animate-pulse'
              : threat.is_populated
                ? 'text-amber-500'
                : 'text-gray-500'
        }`}
      >
        {isHeld
          ? `${threat.impactRevealed ? threat.impact_zone.toUpperCase() : '—'} [HELD]`
          : threat.impactRevealed
            ? threat.impact_zone.toUpperCase()
            : 'CALCULATING...'}
      </span>

      {/* Countdown */}
      <span
        className={`w-9 text-right text-sm font-mono font-bold tabular-nums flex-shrink-0 ${
          isCritical ? 'text-amber-500' : isWarning ? 'text-yellow-500' : 'text-green-400'
        }`}
        style={
          isCritical
            ? { textShadow: '0 0 8px rgba(245, 158, 11, 0.5)' }
            : isWarning
              ? { textShadow: '0 0 6px rgba(234, 179, 8, 0.3)' }
              : {}
        }
      >
        {timeStr}
      </span>
    </div>
  );
}

export default function ThreatPanel({
  activeThreats,
  selectedThreatId,
  onSelectThreat,
}) {
  const live = activeThreats.filter((t) => !t.intercepted);

  if (live.length === 0) {
    return (
      <div className="flex items-center justify-center py-3">
        <div className="text-center">
          <div className="text-green-500/30 font-mono text-xs">NO ACTIVE THREATS</div>
          <div className="text-green-500/20 font-mono text-[10px] mt-0.5">MONITORING...</div>
        </div>
      </div>
    );
  }

  // Sort: unheld first (by urgency), then held (by urgency)
  const sorted = [...live].sort((a, b) => {
    if (a.held !== b.held) return a.held ? 1 : -1;
    return a.timeLeft - b.timeLeft;
  });

  return (
    <div className="flex flex-col">
      <div className="text-[10px] text-green-500/50 font-mono tracking-widest mb-1 px-2 uppercase">
        {live.filter(t => !t.held).length} ACTIVE
        {live.some(t => t.held) && <span className="text-gray-600"> · {live.filter(t => t.held).length} HELD</span>}
      </div>
      <div className="space-y-0.5">
        {sorted.map((threat) => (
          <ThreatRow
            key={threat.id}
            threat={threat}
            isSelected={threat.id === selectedThreatId}
            onSelect={onSelectThreat}
          />
        ))}
      </div>
    </div>
  );
}
