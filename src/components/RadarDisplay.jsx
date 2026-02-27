import { useMemo } from 'react';
import { POPULATED_ZONES, THREAT_COLORS } from '../config/threats.js';

const ISRAEL_PATH = `
  M 0.35,0.10
  L 0.38,0.12 L 0.40,0.15 L 0.38,0.20 L 0.35,0.25
  L 0.33,0.30 L 0.30,0.35 L 0.28,0.42 L 0.30,0.48
  L 0.33,0.52 L 0.38,0.55 L 0.42,0.58 L 0.45,0.62
  L 0.48,0.68 L 0.46,0.75 L 0.44,0.82 L 0.45,0.90
  L 0.45,0.92 L 0.43,0.90 L 0.40,0.82 L 0.38,0.75
  L 0.35,0.68 L 0.33,0.60 L 0.30,0.55 L 0.28,0.50
  L 0.25,0.45 L 0.25,0.38 L 0.27,0.32 L 0.30,0.25
  L 0.32,0.18 L 0.35,0.10
  Z
`;

// Map all impact zone names to radar coordinates
const IMPACT_POSITIONS = {
  'Tel Aviv': { x: 0.35, y: 0.38 },
  'Jerusalem': { x: 0.45, y: 0.43 },
  'Haifa': { x: 0.35, y: 0.18 },
  'Ashdod': { x: 0.30, y: 0.48 },
  'Beersheba': { x: 0.40, y: 0.60 },
  'Eilat': { x: 0.45, y: 0.90 },
  'Dimona': { x: 0.48, y: 0.65 },
  'Netanya': { x: 0.33, y: 0.32 },
  'Ashkelon': { x: 0.28, y: 0.52 },
  'Teveriah': { x: 0.42, y: 0.22 },
  'Tzfat': { x: 0.40, y: 0.15 },
  'Kiryat Shmona': { x: 0.42, y: 0.08 },
  // Open ground areas
  'Negev Desert': { x: 0.38, y: 0.72 },
  'Northern Negev': { x: 0.35, y: 0.58 },
  'Central Negev': { x: 0.42, y: 0.70 },
  'Southern Negev': { x: 0.43, y: 0.80 },
  'Dead Sea Region': { x: 0.50, y: 0.50 },
  'Golan Heights': { x: 0.48, y: 0.15 },
  'Jordan Valley': { x: 0.52, y: 0.35 },
  'Judean Hills': { x: 0.42, y: 0.48 },
  'Judean Desert': { x: 0.50, y: 0.45 },
  'Arava Valley': { x: 0.50, y: 0.75 },
  'Mediterranean (off-coast)': { x: 0.18, y: 0.35 },
  'Western Galilee': { x: 0.28, y: 0.15 },
  'Upper Galilee': { x: 0.38, y: 0.10 },
  'Coastal Plain': { x: 0.25, y: 0.42 },
  'Sinai Border Region': { x: 0.32, y: 0.78 },
  'Off-course (Saudi Arabia)': { x: 0.80, y: 0.65 },
  'Off-course (Red Sea)': { x: 0.55, y: 0.85 },
  'Off-course (Jordan)': { x: 0.65, y: 0.45 },
};

function getBlipPosition(threat) {
  const target = IMPACT_POSITIONS[threat.impact_zone] || { x: 0.5, y: 0.5 };
  const progress = 1 - threat.timeLeft / threat.countdown;

  const cx = 0.5, cy = 0.5;
  const dx = target.x - cx;
  const dy = target.y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const norm = dist > 0 ? 1 / dist : 1;

  const startX = cx + (dx * norm * 0.48);
  const startY = cy + (dy * norm * 0.48);

  return {
    x: startX + (target.x - startX) * progress,
    y: startY + (target.y - startY) * progress,
  };
}

export default function RadarDisplay({
  activeThreats,
  selectedThreatId,
  onSelectThreat,
  sessionTime,
  showSweep = true,
  impactFlashes = [],
}) {
  const size = 100;
  const rings = useMemo(() => [20, 40, 60, 80, 100], []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative" style={{ width: '100%', maxWidth: '600px', aspectRatio: '1' }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.15))' }}
        >
          {/* Background */}
          <circle cx="50" cy="50" r="49" fill="#0a0e1a" stroke="#0f3d0f" strokeWidth="0.5" />

          {/* Range rings */}
          {rings.map((r, i) => (
            <circle key={i} cx="50" cy="50" r={r * 0.49}
              fill="none" stroke="#0f3d0f" strokeWidth="0.3" opacity="0.5" />
          ))}

          {/* Crosshairs */}
          <line x1="1" y1="50" x2="99" y2="50" stroke="#0f3d0f" strokeWidth="0.2" opacity="0.4" />
          <line x1="50" y1="1" x2="50" y2="99" stroke="#0f3d0f" strokeWidth="0.2" opacity="0.4" />
          <line x1="15" y1="15" x2="85" y2="85" stroke="#0f3d0f" strokeWidth="0.15" opacity="0.3" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="#0f3d0f" strokeWidth="0.15" opacity="0.3" />

          {/* Israel outline */}
          <path
            d={ISRAEL_PATH}
            fill="rgba(0, 255, 136, 0.05)"
            stroke="rgba(0, 255, 136, 0.3)"
            strokeWidth="0.4"
          />

          {/* Populated zones */}
          {POPULATED_ZONES.map((zone) => {
            // Check if any impact flash is active for this zone
            const flash = impactFlashes.find((f) => f.zone === zone.name);
            const flashColor = flash
              ? flash.type === 'success' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
              : null;

            return (
              <g key={zone.name}>
                {/* Flash ring effect */}
                {flashColor && (
                  <circle
                    cx={zone.x * size} cy={zone.y * size} r="4"
                    fill="none" stroke={flashColor} strokeWidth="0.5"
                    className="impact-flash-ring"
                  />
                )}
                <circle
                  cx={zone.x * size} cy={zone.y * size} r="1.2"
                  fill={flashColor || 'rgba(0, 255, 136, 0.3)'}
                  stroke={flashColor || 'rgba(0, 255, 136, 0.7)'}
                  strokeWidth="0.3"
                />
                <text
                  x={zone.x * size + 2} y={zone.y * size + 0.5}
                  fill={flashColor || 'rgba(0, 255, 136, 0.7)'}
                  fontSize="1.8" fontFamily="monospace"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}

          {/* Threat blips */}
          {activeThreats.map((threat) => {
            const pos = getBlipPosition(threat);
            const isDecoy = threat.is_decoy;
            const color = isDecoy ? THREAT_COLORS.decoy : (THREAT_COLORS[threat.type] || '#ef4444');
            const isSelected = threat.id === selectedThreatId;

            return (
              <g
                key={threat.id}
                onClick={() => onSelectThreat(threat.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse ring */}
                <circle
                  cx={pos.x * size} cy={pos.y * size} r="2.5"
                  fill="none" stroke={color} strokeWidth="0.3" opacity="0.4"
                  className={isDecoy ? 'decoy-pulse' : 'radar-pulse'}
                />
                {/* Blip */}
                <circle
                  cx={pos.x * size} cy={pos.y * size}
                  r={isDecoy ? '1' : '1.5'}
                  fill={color}
                  stroke={isSelected ? '#ffffff' : color}
                  strokeWidth={isSelected ? '0.6' : '0.3'}
                  opacity={isDecoy ? 0.5 : 1}
                  style={{ filter: `drop-shadow(0 0 3px ${color})` }}
                />
                {/* Label */}
                <text
                  x={pos.x * size} y={pos.y * size - 3}
                  fill={color} fontSize="1.8" fontFamily="monospace"
                  textAnchor="middle" fontWeight="bold"
                  opacity={isDecoy ? 0.5 : 1}
                >
                  {isDecoy ? '?' : `T${threat.id}`}
                </text>
              </g>
            );
          })}

          {/* Sweep line */}
          {showSweep && (
            <line
              x1="50" y1="50" x2="50" y2="1"
              stroke="rgba(0, 255, 136, 0.6)" strokeWidth="0.5"
              className="radar-sweep"
              style={{ transformOrigin: '50px 50px' }}
            />
          )}
        </svg>

        {/* Sweep overlay */}
        {showSweep && (
          <div className="absolute inset-0 rounded-full radar-sweep-overlay pointer-events-none" />
        )}
      </div>
    </div>
  );
}
