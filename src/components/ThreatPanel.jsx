import { THREAT_COLORS } from '../config/threats.js';

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${s}s`;
}

function formatTimeUntil(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  if (s >= 60) {
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}m ${rem}s`;
  }
  return `${s}s`;
}

function ThreatCard({ threat, isSelected, onSelect }) {
  const color = THREAT_COLORS[threat.type] || '#94a3b8';
  const isCritical = threat.timeLeft < 5;
  const isWarning = threat.timeLeft < 10 && !isCritical;
  const urgency = isCritical ? 'animate-pulse' : '';
  const intel = threat.intel || 'full';
  const isHeld = threat.held;

  // Urgency background tint — uses amber (not red) to avoid conflict with ballistic missile color
  const urgencyBg = isCritical
    ? 'bg-amber-950/30'
    : isWarning
      ? 'bg-yellow-950/20'
      : isSelected && !isHeld
        ? 'bg-white/10'
        : 'bg-gray-900/50';

  return (
    <div
      onClick={() => !isHeld && onSelect(threat.id)}
      className={`
        relative rounded p-2 md:p-3 mb-1 md:mb-2 transition-all flex gap-2 md:gap-3
        ${isHeld
          ? 'opacity-50 cursor-default'
          : 'cursor-pointer'
        }
        ${urgencyBg}
        ${!isSelected && !isHeld && !isCritical && !isWarning ? 'hover:border-gray-500' : ''}
        ${isSelected && !isHeld && !isCritical && !isWarning ? 'shadow-lg shadow-white/10' : ''}
        ${urgency}
      `}
      style={{
        borderTop: `2px solid ${isCritical ? '#f59e0b' : isSelected ? color : '#374151'}`,
        borderRight: `2px solid ${isCritical ? '#f59e0b' : isSelected ? color : '#374151'}`,
        borderBottom: `2px solid ${isCritical ? '#f59e0b' : isSelected ? color : '#374151'}`,
        borderLeft: `4px solid ${isCritical ? '#f59e0b' : color}`,
        boxShadow: isCritical ? '0 0 20px rgba(245, 158, 11, 0.3)' : isSelected ? `0 0 15px ${color}40` : 'none',
      }}
    >
      {/* Prominent Threat ID */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded font-mono font-bold text-sm md:text-lg"
        style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}50` }}
      >
        T{threat.id}
      </div>

      {/* Card content */}
      <div className="flex-1 min-w-0">
      {/* Type badge + Priority */}
      <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 flex-wrap">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ backgroundColor: `${color}30`, color }}
          >
            {threat.type === 'hypersonic' ? 'HYPERSONIC' : threat.type.toUpperCase()}
          </span>
          {threat.priority && (
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-900/50 text-red-400 border border-red-700 tracking-wider animate-pulse">
              ⚠ PRIORITY
            </span>
          )}
          {threat.is_final_salvo && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-orange-900/50 text-orange-400 border border-orange-700 tracking-wider">
              SALVO
            </span>
          )}
          {isHeld && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400 border border-gray-600 tracking-wider">
              HOLD
            </span>
          )}
      </div>

      {/* Threat name */}
      <div className="text-xs md:text-sm font-bold font-mono text-green-400 mb-1 md:mb-2 tracking-wide">
        {intel === 'minimal' ? 'UNKNOWN DESIGNATION' : threat.name.toUpperCase()}
      </div>

      {/* Stats — variable based on intel level, hidden on small screens */}
      <div className="hidden sm:block">
        <div className="text-xs font-mono space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">SPEED</span>
            <span className="text-gray-300">
              {intel === 'minimal' ? '---' : `Mach ${threat.speed_mach}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">ALTITUDE</span>
            <span className="text-gray-300">
              {intel === 'minimal' || intel === 'partial' ? '---' : `${threat.altitude_km} km`}
            </span>
          </div>
          {intel === 'full' && (
            <div>
              <span className="text-gray-500">TRAJECTORY: </span>
              <span className="text-gray-300">{threat.trajectory}</span>
            </div>
          )}
        </div>
      </div>

      {/* Impact zone — progressive reveal */}
      <div className="mt-1 md:mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-500 font-mono">IMPACT:</span>
        {threat.impactRevealed ? (
          <span
            className={`text-sm font-bold font-mono ${
              threat.is_populated ? 'text-amber-500' : 'text-gray-500'
            }`}
          >
            {threat.impact_zone.toUpperCase()}
          </span>
        ) : (
          <span className="text-sm font-mono text-yellow-600 animate-pulse tracking-wider">
            CALCULATING...
          </span>
        )}
      </div>

      {/* Countdown */}
      <div className="mt-1 md:mt-2 flex items-center justify-between">
        <div className={`text-[10px] md:text-xs font-mono ${isCritical ? 'text-amber-400 font-bold tracking-widest' : 'text-gray-500'}`}>
          {isCritical ? '⚠ TIME LEFT' : 'TIME LEFT'}
        </div>
        <div
          className={`text-xl md:text-2xl font-bold font-mono tabular-nums ${
            isCritical ? 'text-amber-500 animate-pulse' : isWarning ? 'text-yellow-500' : 'text-green-400'
          }`}
          style={isCritical ? { textShadow: '0 0 12px rgba(245, 158, 11, 0.6)' } : isWarning ? { textShadow: '0 0 8px rgba(234, 179, 8, 0.3)' } : {}}
        >
          {formatTime(threat.timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className={`mt-1 ${isCritical ? 'h-1.5' : 'h-1'} bg-gray-800 rounded-full overflow-hidden`}>
        <div
          className={`h-full transition-all duration-100 ${isCritical ? 'animate-pulse' : ''}`}
          style={{
            width: `${(threat.timeLeft / threat.countdown) * 100}%`,
            backgroundColor: isCritical ? '#ef4444' : isWarning ? '#eab308' : '#22c55e',
            boxShadow: isCritical ? '0 0 8px rgba(239, 68, 68, 0.5)' : 'none',
          }}
        />
      </div>
      </div>{/* end card content */}
    </div>
  );
}

export default function ThreatPanel({
  activeThreats,
  selectedThreatId,
  onSelectThreat,
  upcomingThreats = [],
}) {
  if (activeThreats.length === 0 && upcomingThreats.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="text-xs text-green-500/50 font-mono tracking-widest mb-4 uppercase">
          Threat Analysis
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-green-500/30 text-4xl mb-2">///</div>
            <div className="text-green-500/30 font-mono text-sm">NO ACTIVE THREATS</div>
            <div className="text-green-500/20 font-mono text-xs mt-1">MONITORING...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] md:text-xs text-green-500/50 font-mono tracking-widest mb-1 uppercase">
        Threats — {activeThreats.filter((t) => !t.intercepted).length} Active
      </div>
      <div className="hidden md:block text-xs text-cyan-400/80 font-mono mb-3 tracking-wide">
        ▸ Click a threat card or radar blip to select, then fire
      </div>
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {[...activeThreats]
          .filter((t) => !t.intercepted)
          .sort((a, b) => a.timeLeft - b.timeLeft)
          .map((threat) => (
            <ThreatCard
              key={threat.id}
              threat={threat}
              isSelected={threat.id === selectedThreatId}
              onSelect={onSelectThreat}
            />
          ))}
      </div>

      {/* Upcoming Threats Preview */}
      {upcomingThreats.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-800/50">
          <div className="text-[10px] text-gray-600 font-mono tracking-widest mb-2">
            INCOMING THREATS
          </div>
          {upcomingThreats.slice(0, 3).map((t) => {
            const color = THREAT_COLORS[t.type] || '#ef4444';
            return (
              <div
                key={t.id}
                className="flex items-center gap-2 py-1 px-2 mb-1 rounded bg-gray-900/30"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="text-[10px] font-bold font-mono uppercase tracking-wider"
                  style={{ color }}
                >
                  {t.type}
                </span>
                <span className="flex-1" />
                <span className="text-[10px] font-mono text-gray-600 tabular-nums">
                  {formatTimeUntil(t.timeUntil)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
