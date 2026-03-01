import { useMemo } from 'react';
import { POPULATED_ZONES, IMPACT_POSITIONS, COMMAND_CENTER, THREAT_COLORS } from '../config/threats.js';

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

// Easing: ballistic missiles start slow, accelerate on reentry
// Hypersonics accelerate even more aggressively
function easeProgress(linearProgress, type) {
  if (type === 'ballistic') {
    // Slow launch, fast reentry — cubic ease-in
    return linearProgress * linearProgress * linearProgress;
  }
  if (type === 'hypersonic') {
    // Even more extreme acceleration
    return linearProgress * linearProgress * linearProgress * linearProgress;
  }
  return linearProgress; // drones + cruise: constant speed
}

// Entry direction vectors for threat origins
const ENTRY_DIRS = {
  south:     { x: 0.0, y: 0.48 },    // Yemen — from bottom
  southwest: { x: -0.34, y: 0.34 },  // Sinai — from bottom-left
  gaza:      { x: -0.15, y: 0.15 },  // Gaza — very close to coast (5km from Ashkelon)
  southeast: { x: 0.34, y: 0.34 },   // Yemen/Iran — from bottom-right
  east:      { x: 0.48, y: 0.0 },    // Iran/Iraq — from right
  north:     { x: 0.0, y: -0.48 },   // Hezbollah/Lebanon — from top
  northeast: { x: 0.34, y: -0.34 },  // Syria — from upper-right
};

function getBlipPosition(threat) {
  const target = IMPACT_POSITIONS[threat.impact_zone] || { x: 0.5, y: 0.5 };
  // Use frozen position for intercepted threats so they don't keep moving
  const timeLeft = threat.intercepted ? threat.frozenTimeLeft : threat.timeLeft;
  const linearProgress = 1 - timeLeft / threat.countdown;
  const progress = easeProgress(linearProgress, threat.type);

  const cx = 0.5, cy = 0.5;

  // Determine entry point — use threat's origin direction, default to southeast (Yemen)
  let startX, startY;
  const dir = ENTRY_DIRS[threat.origin] || ENTRY_DIRS.southeast;
  startX = cx + dir.x;
  startY = cy + dir.y;

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

function HoldClearEffect({ flash }) {
  const { cx, cy } = flash;
  return (
    <g>
      {/* Green celebration flash */}
      <circle cx={cx} cy={cy} r="3"
        fill="rgba(34, 197, 94, 0.4)"
        className="hold-clear-flash" />

      {/* Expanding green ring */}
      <circle cx={cx} cy={cy} r="2.5"
        fill="none" stroke="#22c55e" strokeWidth="0.6"
        className="hold-clear-ring" />

      {/* Checkmark — drawn as two lines forming a ✓ */}
      <g className="hold-clear-check">
        <line x1={cx - 1.5} y1={cy + 0.3} x2={cx - 0.3} y2={cy + 1.5}
          stroke="#22c55e" strokeWidth="0.6" strokeLinecap="round" />
        <line x1={cx - 0.3} y1={cy + 1.5} x2={cx + 2} y2={cy - 1.5}
          stroke="#22c55e" strokeWidth="0.6" strokeLinecap="round" />
      </g>

      {/* "CLEAR" label */}
      <text x={cx} y={cy - 3.5}
        fill="#22c55e" fontSize="2" fontFamily="monospace"
        textAnchor="middle" fontWeight="bold"
        className="hold-clear-label"
      >
        CLEAR
      </text>
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

          {/* Command Center HQ marker */}
          <g>
            <rect
              x={COMMAND_CENTER.x * size - 1.5}
              y={COMMAND_CENTER.y * size - 1.5}
              width="3" height="3"
              fill="none" stroke="#22c55e" strokeWidth="0.4" opacity="0.7"
              transform={`rotate(45, ${COMMAND_CENTER.x * size}, ${COMMAND_CENTER.y * size})`}
            />
            <text
              x={COMMAND_CENTER.x * size}
              y={COMMAND_CENTER.y * size + 4}
              fill="#22c55e" fontSize="1.6" fontFamily="monospace"
              textAnchor="middle" opacity="0.5" fontWeight="bold"
            >
              HQ
            </text>
          </g>

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
            if (flash.type === 'hold_clear') {
              return <HoldClearEffect key={flash.id} flash={flash} />;
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
              const color = THREAT_COLORS[threat.type] || '#ffffff';
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
            const color = THREAT_COLORS[threat.type] || '#ffffff';
            const isSelected = threat.id === selectedThreatId;

            return (
              <g
                key={threat.id}
                onClick={() => !threat.intercepted && onSelectThreat(threat.id)}
                style={{ cursor: threat.intercepted ? 'default' : 'pointer' }}
                className={`${threat.intercepted ? 'intercepted-blip-fade' : 'blip-hover'}`}
              >
                {/* Invisible hit target — larger radius for easier clicking */}
                {!threat.intercepted && (
                  <circle
                    cx={pos.x * size} cy={pos.y * size}
                    r="4.5" fill="transparent" stroke="none"
                  />
                )}
                {/* Trajectory trail — fading line from entry point to current position */}
                <line
                  x1={pos.originX * size} y1={pos.originY * size}
                  x2={pos.x * size} y2={pos.y * size}
                  stroke={`url(#trail-grad-${threat.id})`}
                  strokeWidth="0.5"
                  strokeDasharray="none"
                />
                {/* Selection ring — visible when selected */}
                {isSelected && !threat.intercepted && (
                  <circle
                    cx={pos.x * size} cy={pos.y * size} r="4"
                    fill="none" stroke="#ffffff" strokeWidth="0.3" opacity="0.6"
                    strokeDasharray="1.5 1"
                    className="selection-ring-spin"
                  />
                )}
                {/* Pulse ring */}
                <circle
                  cx={pos.x * size} cy={pos.y * size} r="2.5"
                  fill="none" stroke={color} strokeWidth="0.3" opacity="0.4"
                  className="radar-pulse"
                />
                {/* Blip */}
                <circle
                  cx={pos.x * size} cy={pos.y * size}
                  r="1.8"
                  fill={color}
                  stroke={isSelected ? '#ffffff' : color}
                  strokeWidth={isSelected ? '0.6' : '0.3'}
                  opacity={1}
                  style={{ filter: `drop-shadow(0 0 ${isSelected ? '5' : '3'}px ${color})` }}
                />
                {/* Label */}
                <text
                  x={pos.x * size} y={pos.y * size - 3.5}
                  fill={color} fontSize="2" fontFamily="monospace"
                  textAnchor="middle" fontWeight="bold"
                  opacity={0.9}
                >
                  {`T${threat.id}`}
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
