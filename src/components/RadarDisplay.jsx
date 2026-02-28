import { useMemo } from 'react';
import { POPULATED_ZONES, IMPACT_POSITIONS } from '../config/threats.js';

const BLIP_COLOR = '#ffffff';     // Bright white — high contrast against green map
const DECOY_BLIP_COLOR = '#6b7280'; // Gray for unknown contacts

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
    originX: startX,
    originY: startY,
  };
}

// ============================================
// Impact Effect Renderers
// ============================================

function InterceptEffect({ flash }) {
  const { cx, cy, particles } = flash;
  return (
    <g>
      {/* Bright white center flash */}
      <circle cx={cx} cy={cy} r="2" fill="white" className="intercept-flash-center" />

      {/* Green shockwave ring */}
      <circle cx={cx} cy={cy} r="3"
        fill="none" stroke="#22c55e" strokeWidth="1"
        className="intercept-shockwave" />

      {/* Secondary ring (delayed) */}
      <circle cx={cx} cy={cy} r="3"
        fill="none" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="0.5"
        className="intercept-shockwave-secondary" />

      {/* Particle debris */}
      {particles.map((p, i) => (
        <circle key={i} cx={cx} cy={cy} r={0.6}
          fill="#22c55e"
          className="intercept-particle"
          style={{
            '--end-x': `${p.endX}px`,
            '--end-y': `${p.endY}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </g>
  );
}

function CityHitEffect({ flash }) {
  const { cx, cy, particles } = flash;
  return (
    <g>
      {/* Bright orange flash */}
      <circle cx={cx} cy={cy} r="3" fill="rgba(255,100,50,0.9)"
        className="city-hit-flash" />

      {/* Red shockwave (larger) */}
      <circle cx={cx} cy={cy} r="3"
        fill="none" stroke="#ef4444" strokeWidth="1.2"
        className="city-hit-shockwave" />

      {/* Secondary orange shockwave */}
      <circle cx={cx} cy={cy} r="3"
        fill="none" stroke="#f97316" strokeWidth="0.6"
        className="city-hit-shockwave-secondary" />

      {/* Pulsing damage indicator (lingers) */}
      <circle cx={cx} cy={cy} r="4"
        fill="rgba(239, 68, 68, 0.2)"
        stroke="#ef4444" strokeWidth="0.4"
        className="city-hit-damage-pulse" />

      {/* Crater marker */}
      <circle cx={cx} cy={cy} r="2"
        fill="none" stroke="#ef4444" strokeWidth="0.4"
        strokeDasharray="0.5 0.5"
        className="city-hit-crater" />

      {/* Debris particles */}
      {particles.map((p, i) => (
        <circle key={i} cx={cx} cy={cy}
          r={0.5}
          fill={p.color || '#f97316'}
          className="city-hit-particle"
          style={{
            '--end-x': `${p.endX}px`,
            '--end-y': `${p.endY}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </g>
  );
}

function GroundImpactEffect({ flash }) {
  const { cx, cy, particles } = flash;
  return (
    <g>
      {/* Amber puff */}
      <circle cx={cx} cy={cy} r="2"
        fill="rgba(217, 169, 78, 0.5)"
        className="ground-puff" />

      {/* Expanding ring */}
      <circle cx={cx} cy={cy} r="1.5"
        fill="none" stroke="#d9a94e" strokeWidth="0.5"
        className="ground-ring" />

      {/* Dust particles */}
      {particles.map((p, i) => (
        <circle key={i} cx={cx} cy={cy} r={0.5}
          fill="#d9a94e"
          className="ground-particle"
          style={{
            '--end-x': `${p.endX}px`,
            '--end-y': `${p.endY}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </g>
  );
}

function TrailEffect({ trail }) {
  const { startX, startY, endX, endY, color, duration } = trail;
  return (
    <g>
      {/* Trail line — draws from start to end */}
      <line
        x1={startX} y1={startY} x2={endX} y2={endY}
        stroke={color} strokeWidth="0.4" opacity="0.6"
        className="trail-line"
        style={{ '--trail-duration': `${duration}ms` }}
      />

      {/* Bright warhead dot — moves from start to end */}
      <circle
        cx={startX} cy={startY} r="0.8"
        fill="white"
        className="trail-warhead"
        style={{
          '--dx': `${endX - startX}px`,
          '--dy': `${endY - startY}px`,
          '--trail-duration': `${duration}ms`,
        }}
      />

      {/* Exhaust glow at launch point */}
      <circle
        cx={startX} cy={startY} r="1.5"
        fill={color} opacity="0.5"
        className="trail-launch-flash"
      />
    </g>
  );
}

export default function RadarDisplay({
  activeThreats,
  selectedThreatId,
  onSelectThreat,
  sessionTime,
  showSweep = true,
  impactFlashes = [],
  activeTrails = [],
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
            let dotColor = 'rgba(0, 255, 136, 0.3)';
            let strokeColor = 'rgba(0, 255, 136, 0.7)';
            let labelColor = 'rgba(0, 255, 136, 0.7)';

            if (flash) {
              if (flash.type === 'intercept') {
                dotColor = 'rgba(34, 197, 94, 0.8)';
                strokeColor = 'rgba(34, 197, 94, 1)';
                labelColor = 'rgba(34, 197, 94, 1)';
              } else if (flash.type === 'city_hit') {
                dotColor = 'rgba(239, 68, 68, 0.8)';
                strokeColor = 'rgba(239, 68, 68, 1)';
                labelColor = 'rgba(239, 68, 68, 1)';
              }
            }

            return (
              <g key={zone.name}>
                <circle
                  cx={zone.x * size} cy={zone.y * size} r="1.2"
                  fill={dotColor}
                  stroke={strokeColor}
                  strokeWidth="0.3"
                />
                <text
                  x={zone.x * size + 2} y={zone.y * size + 0.5}
                  fill={labelColor}
                  fontSize="1.8" fontFamily="monospace"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}

          {/* === Impact Effects Layer === */}
          {impactFlashes.map((flash) => {
            if (flash.type === 'intercept') {
              return <InterceptEffect key={flash.id} flash={flash} />;
            }
            if (flash.type === 'city_hit') {
              return <CityHitEffect key={flash.id} flash={flash} />;
            }
            if (flash.type === 'ground_impact') {
              return <GroundImpactEffect key={flash.id} flash={flash} />;
            }
            return null;
          })}

          {/* Interceptor trails */}
          {activeTrails.map((trail) => (
            <TrailEffect key={trail.id} trail={trail} />
          ))}

          {/* Threat trajectory trail gradients */}
          <defs>
            {activeThreats.map((threat) => {
              const pos = getBlipPosition(threat);
              const color = threat.is_decoy ? DECOY_BLIP_COLOR : BLIP_COLOR;
              return (
                <linearGradient
                  key={`trail-grad-${threat.id}`}
                  id={`trail-grad-${threat.id}`}
                  x1={pos.originX * size} y1={pos.originY * size}
                  x2={pos.x * size} y2={pos.y * size}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={color} stopOpacity="0" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Threat blips with trajectory trails */}
          {activeThreats.map((threat) => {
            const pos = getBlipPosition(threat);
            const isDecoy = threat.is_decoy;
            const color = isDecoy ? DECOY_BLIP_COLOR : BLIP_COLOR;
            const isSelected = threat.id === selectedThreatId;

            return (
              <g
                key={threat.id}
                onClick={() => onSelectThreat(threat.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Trajectory trail — fading line from entry point to current position */}
                <line
                  x1={pos.originX * size} y1={pos.originY * size}
                  x2={pos.x * size} y2={pos.y * size}
                  stroke={`url(#trail-grad-${threat.id})`}
                  strokeWidth={isDecoy ? '0.3' : '0.5'}
                  strokeDasharray={isDecoy ? '0.8 0.6' : 'none'}
                />
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
