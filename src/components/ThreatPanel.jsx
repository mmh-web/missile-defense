import { THREAT_COLORS } from '../config/threats.js';

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${s}s`;
}

function ThreatCard({ threat, isSelected, onSelect }) {
  const color = THREAT_COLORS[threat.type] || '#ef4444';
  const urgency = threat.timeLeft < 5 ? 'animate-pulse' : '';
  const isDecoy = threat.is_decoy;
  const intel = threat.intel || 'full';

  return (
    <div
      onClick={() => onSelect(threat.id)}
      className={`
        relative cursor-pointer border rounded p-3 mb-2 transition-all
        ${isSelected
          ? 'border-white bg-white/10 shadow-lg shadow-white/10'
          : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
        }
        ${urgency}
      `}
      style={isSelected ? { borderColor: color, boxShadow: `0 0 15px ${color}40` } : {}}
    >
      {/* Type badge + Priority */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ backgroundColor: `${color}30`, color }}
          >
            {isDecoy ? 'UNKNOWN' : threat.type === 'hypersonic' ? 'HYPERSONIC' : threat.type.toUpperCase()}
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
        </div>
        <span className="text-xs text-gray-500 font-mono">T{threat.id}</span>
      </div>

      {/* Threat name */}
      <div className="text-sm font-bold font-mono text-green-400 mb-2 tracking-wide">
        {isDecoy ? 'UNIDENTIFIED CONTACT' : intel === 'minimal' ? 'UNKNOWN DESIGNATION' : threat.name.toUpperCase()}
      </div>

      {/* Stats — variable based on intel level */}
      {!isDecoy && (
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
      )}

      {isDecoy && (
        <div className="text-xs font-mono text-gray-600 italic">
          ANALYZING RADAR SIGNATURE...
        </div>
      )}

      {/* Impact zone — progressive reveal */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-500 font-mono">IMPACT:</span>
        {isDecoy ? (
          <span className="text-sm font-mono text-gray-600">UNKNOWN</span>
        ) : threat.impactRevealed ? (
          <span
            className={`text-sm font-bold font-mono ${
              threat.is_populated ? 'text-red-500' : 'text-gray-500'
            } ${threat._corrected ? 'impact-reveal-flash' : ''}`}
          >
            {threat.impact_zone.toUpperCase()}
            {threat._corrected && (
              <span className="text-xs text-yellow-500 ml-2">⚠ COURSE CHANGE</span>
            )}
          </span>
        ) : (
          <span className="text-sm font-mono text-yellow-600 animate-pulse tracking-wider">
            CALCULATING...
          </span>
        )}
      </div>

      {/* Countdown */}
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-gray-500 font-mono">TIME LEFT</div>
        <div
          className={`text-2xl font-bold font-mono tabular-nums ${
            threat.timeLeft < 5 ? 'text-red-500' : threat.timeLeft < 10 ? 'text-yellow-500' : 'text-green-400'
          }`}
        >
          {formatTime(threat.timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-1 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${(threat.timeLeft / threat.countdown) * 100}%`,
            backgroundColor: threat.timeLeft < 5 ? '#ef4444' : threat.timeLeft < 10 ? '#eab308' : '#22c55e',
          }}
        />
      </div>
    </div>
  );
}

export default function ThreatPanel({
  activeThreats,
  selectedThreatId,
  onSelectThreat,
}) {
  if (activeThreats.length === 0) {
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
      <div className="text-xs text-green-500/50 font-mono tracking-widest mb-3 uppercase">
        Threat Analysis — {activeThreats.length} Active
      </div>
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {[...activeThreats]
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
    </div>
  );
}
