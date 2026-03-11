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
  const intel = threat.intel || 'full';

  const bgClass = isSelected && !isHeld
    ? 'bg-white/10'
    : 'bg-transparent';

  const impactColor = isHeld
    ? 'text-gray-600'
    : !threat.impactRevealed
      ? 'text-gray-400 animate-pulse'
      : threat.is_populated
        ? 'text-white'
        : 'text-gray-500';

  const impactText = isHeld
    ? `${threat.impactRevealed ? threat.impact_zone.toUpperCase() : '—'} [HELD]`
    : threat.impactRevealed
      ? threat.impact_zone.toUpperCase()
      : 'CALCULATING...';

  const threatName = intel === 'minimal' ? 'UNKNOWN DESIGNATION' : threat.name.toUpperCase();

  return (
    <div
      onClick={() => !isHeld && onSelect(isSelected ? null : threat.id)}
      className={`
        px-2 py-1.5 lg:py-2 rounded transition-all
        ${isHeld ? 'opacity-50 cursor-default' : 'cursor-pointer'}
        ${!isHeld && !isSelected ? 'hover:bg-white/5' : ''}
        ${isCritical ? 'animate-pulse' : ''}
        ${bgClass}
      `}
      style={{
        borderLeft: `3px solid ${color}`,
        boxShadow: isSelected && !isHeld ? `0 0 10px ${color}30` : 'none',
        ...(isCritical && !isHeld ? { backgroundColor: `${color}15` } : {}),
      }}
    >
      {/* Line 1: ID, type, impact zone, countdown */}
      <div className="flex items-center gap-1.5">
        {/* Threat ID */}
        <span
          className="w-8 text-sm font-mono font-bold flex-shrink-0 text-center"
          style={{ color }}
        >
          T{threat.id}{threat.priority ? '*' : ''}
        </span>

        {/* Type abbreviation */}
        <span
          className="w-10 text-xs font-mono font-bold uppercase tracking-wider flex-shrink-0"
          style={{ color }}
        >
          {TYPE_ABBR[threat.type] || '???'}
        </span>

        {/* Arrow separator */}
        <span className="text-gray-600 text-sm flex-shrink-0">▸</span>

        {/* Impact zone */}
        <span className={`flex-1 min-w-0 truncate text-sm font-mono font-bold ${impactColor}`}>
          {impactText}
        </span>

        {/* Countdown */}
        <span
          className={`w-10 text-right text-base font-mono font-bold tabular-nums flex-shrink-0 ${
            isCritical ? 'text-white' : 'text-green-400'
          }`}
        >
          {timeStr}
        </span>
      </div>

      {/* Line 2 (desktop only): threat name + full type */}
      <div className="hidden lg:flex items-center gap-1.5 mt-0.5 pl-8">
        <span
          className="text-[11px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {threat.type === 'hypersonic' ? 'HYPERSONIC' : threat.type.toUpperCase()}
        </span>
        <span className="text-[11px] font-mono text-gray-500 truncate">
          {threatName}
        </span>
      </div>
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
      <div className="text-xs text-green-500/50 font-mono tracking-widest mb-1 px-2 uppercase">
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
