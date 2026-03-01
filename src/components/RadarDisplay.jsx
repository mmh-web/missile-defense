import { useMemo } from 'react';
import { IMPACT_POSITIONS, THREAT_COLORS } from '../config/threats.js';
import {
  CITIES,
  ISRAEL_OUTLINE,
  KINNERET,
  GAZA_STRIP,
  getVisibleCities,
  getViewportForLevel,
  getBatteryForLevel,
  getVisibleRegions,
  getVisibleThreatOrigins,
  isGazaVisible,
  isKinneretVisible,
} from '../config/mapLayers.js';

// Per-city label offset directions
const LABEL_OFFSETS = {
  e:  { dx: 2.0, dy: 0.5, anchor: 'start' },
  w:  { dx: -2.0, dy: 0.5, anchor: 'end' },
  ne: { dx: 1.5, dy: -1.2, anchor: 'start' },
  nw: { dx: -1.5, dy: -1.2, anchor: 'end' },
  se: { dx: 1.5, dy: 2.0, anchor: 'start' },
  sw: { dx: -1.5, dy: 2.0, anchor: 'end' },
  n:  { dx: 0, dy: -1.5, anchor: 'middle' },
  s:  { dx: 0, dy: 2.5, anchor: 'middle' },
};

// --- Viewport Transform ---
// Converts 0-1 normalized map coordinates to SVG viewBox coordinates (0-100)
// through the current level's viewport (center + scale).
function mapToSVG(x, y, viewport) {
  const tx = (x - viewport.centerX) * viewport.scale + 0.5;
  const ty = (y - viewport.centerY) * viewport.scale + 0.5;
  return { x: tx * 100, y: ty * 100 };
}

// Easing: ballistic missiles start slow, accelerate on reentry
// Hypersonics accelerate even more aggressively
function easeProgress(linearProgress, type) {
  if (type === 'ballistic') return linearProgress ** 3;
  if (type === 'hypersonic') return linearProgress ** 4;
  return linearProgress;
}

// Entry direction vectors for threat origins (GPS-verified bearings)
// x = 0.48 * sin(bearing), y = -0.48 * cos(bearing) where 0°=north clockwise
const ENTRY_DIRS = {
  gaza:      { x: -0.48, y: 0.0 },    // due west (270°) — Gaza is west of Israel
  north:     { x: 0.13, y: -0.46 },    // NNE ~16° — Lebanon
  northeast: { x: 0.29, y: -0.38 },    // NNE ~37° — Syria
  east:      { x: 0.46, y: -0.12 },    // ENE ~76° — Iran
  southeast: { x: 0.24, y: 0.42 },     // SSE ~150° — Yemen
  south:     { x: 0.0, y: 0.48 },      // due south
  southwest: { x: -0.34, y: 0.34 },    // southwest
};

function getBlipPosition(threat) {
  const target = IMPACT_POSITIONS[threat.impact_zone] || { x: 0.5, y: 0.5 };
  const timeLeft = threat.intercepted ? threat.frozenTimeLeft : threat.timeLeft;
  const linearProgress = 1 - timeLeft / threat.countdown;
  const progress = easeProgress(linearProgress, threat.type);
  const cx = 0.5, cy = 0.5;
  const dir = ENTRY_DIRS[threat.origin] || ENTRY_DIRS.southeast;
  const startX = cx + dir.x;
  const startY = cy + dir.y;
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

function InterceptEffect({ flash, viewport }) {
  const { cx, cy, particles } = flash;
  const p = mapToSVG(cx, cy, viewport);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r="2" fill="white" className="intercept-flash-center" />
      <circle cx={p.x} cy={p.y} r="3" fill="none" stroke="#22c55e" strokeWidth="1" className="intercept-shockwave" />
      <circle cx={p.x} cy={p.y} r="3" fill="none" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="0.5" className="intercept-shockwave-secondary" />
      {particles.map((pt, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.6} fill="#22c55e" className="intercept-particle"
          style={{ '--end-x': `${pt.endX}px`, '--end-y': `${pt.endY}px`, animationDelay: `${pt.delay}s` }} />
      ))}
    </g>
  );
}

function CityHitEffect({ flash, viewport }) {
  const { cx, cy, particles } = flash;
  const p = mapToSVG(cx, cy, viewport);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r="3" fill="rgba(255,100,50,0.9)" className="city-hit-flash" />
      <circle cx={p.x} cy={p.y} r="3" fill="none" stroke="#ef4444" strokeWidth="1.2" className="city-hit-shockwave" />
      <circle cx={p.x} cy={p.y} r="3" fill="none" stroke="#f97316" strokeWidth="0.6" className="city-hit-shockwave-secondary" />
      <circle cx={p.x} cy={p.y} r="4" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="0.4" className="city-hit-damage-pulse" />
      <circle cx={p.x} cy={p.y} r="2" fill="none" stroke="#ef4444" strokeWidth="0.4" strokeDasharray="0.5 0.5" className="city-hit-crater" />
      {particles.map((pt, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.5} fill={pt.color || '#f97316'} className="city-hit-particle"
          style={{ '--end-x': `${pt.endX}px`, '--end-y': `${pt.endY}px`, animationDelay: `${pt.delay}s` }} />
      ))}
    </g>
  );
}

function GroundImpactEffect({ flash, viewport }) {
  const { cx, cy, particles } = flash;
  const p = mapToSVG(cx, cy, viewport);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r="2" fill="rgba(217, 169, 78, 0.5)" className="ground-puff" />
      <circle cx={p.x} cy={p.y} r="1.5" fill="none" stroke="#d9a94e" strokeWidth="0.5" className="ground-ring" />
      {particles.map((pt, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.5} fill="#d9a94e" className="ground-particle"
          style={{ '--end-x': `${pt.endX}px`, '--end-y': `${pt.endY}px`, animationDelay: `${pt.delay}s` }} />
      ))}
    </g>
  );
}

function HoldClearEffect({ flash, viewport }) {
  const { cx, cy } = flash;
  const p = mapToSVG(cx, cy, viewport);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r="3" fill="rgba(34, 197, 94, 0.4)" className="hold-clear-flash" />
      <circle cx={p.x} cy={p.y} r="2.5" fill="none" stroke="#22c55e" strokeWidth="0.6" className="hold-clear-ring" />
      <g className="hold-clear-check">
        <line x1={p.x - 1.5} y1={p.y + 0.3} x2={p.x - 0.3} y2={p.y + 1.5} stroke="#22c55e" strokeWidth="0.6" strokeLinecap="round" />
        <line x1={p.x - 0.3} y1={p.y + 1.5} x2={p.x + 2} y2={p.y - 1.5} stroke="#22c55e" strokeWidth="0.6" strokeLinecap="round" />
      </g>
      <text x={p.x} y={p.y - 3.5} fill="#22c55e" fontSize="2" fontFamily="monospace" textAnchor="middle" fontWeight="bold" className="hold-clear-label">
        CLEAR
      </text>
    </g>
  );
}

function TrailEffect({ trail, viewport }) {
  const s = mapToSVG(trail.startX, trail.startY, viewport);
  const e = mapToSVG(trail.endX, trail.endY, viewport);
  const { color, duration } = trail;
  return (
    <g>
      <line x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke={color} strokeWidth="0.4" opacity="0.6" className="trail-line"
        style={{ '--trail-duration': `${duration}ms` }} />
      <circle cx={s.x} cy={s.y} r="0.8" fill="white" className="trail-warhead"
        style={{ '--dx': `${e.x - s.x}px`, '--dy': `${e.y - s.y}px`, '--trail-duration': `${duration}ms` }} />
      <circle cx={s.x} cy={s.y} r="1.5" fill={color} opacity="0.5" className="trail-launch-flash" />
    </g>
  );
}

// ============================================
// Threat Origin Arc Renderer
// ============================================
function ThreatOriginArc({ origin, viewport }) {
  // Draw an arc segment at the radar perimeter
  const radius = 47; // just inside the radar border
  const cx = 50, cy = 50;
  const startAngle = (origin.angle - origin.arcSpan / 2) * Math.PI / 180;
  const endAngle = (origin.angle + origin.arcSpan / 2) * Math.PI / 180;
  const midAngle = origin.angle * Math.PI / 180;

  // SVG arc coordinates (in SVG space, not map space — these sit on the radar ring)
  const x1 = cx + radius * Math.sin(startAngle);
  const y1 = cy - radius * Math.cos(startAngle);
  const x2 = cx + radius * Math.sin(endAngle);
  const y2 = cy - radius * Math.cos(endAngle);

  // Label position — slightly inside the arc
  const labelR = radius - 3;
  const lx = cx + labelR * Math.sin(midAngle);
  const ly = cy - labelR * Math.cos(midAngle);

  const largeArcFlag = origin.arcSpan > 180 ? 1 : 0;

  return (
    <g>
      {/* Arc segment */}
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
        fill="none"
        stroke="rgba(255, 160, 60, 0.5)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Glow behind the arc */}
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
        fill="none"
        stroke="rgba(255, 80, 40, 0.15)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Label */}
      <text
        x={lx} y={ly}
        fill="rgba(255, 180, 80, 0.7)"
        fontSize="2.2" fontFamily="monospace"
        textAnchor="middle" dominantBaseline="middle"
        fontWeight="bold"
      >
        {origin.name}
      </text>
    </g>
  );
}

// ============================================
// Main Component
// ============================================
export default function RadarDisplay({
  activeThreats,
  selectedThreatId,
  onSelectThreat,
  sessionTime,
  showSweep = true,
  impactFlashes = [],
  activeTrails = [],
  currentLevel = 1,
}) {
  const viewport = getViewportForLevel(currentLevel);
  const visibleCities = useMemo(() => getVisibleCities(currentLevel), [currentLevel]);
  const visibleRegions = useMemo(() => getVisibleRegions(currentLevel), [currentLevel]);
  const visibleOrigins = useMemo(() => getVisibleThreatOrigins(currentLevel), [currentLevel]);
  const showKinneret = isKinneretVisible(currentLevel);

  // Build set of cities currently targeted by active threats (for tier-2 label pop-up)
  const activeThreatTargets = useMemo(() => {
    const targets = new Set();
    activeThreats.forEach((t) => {
      if (!t.intercepted && t.impactRevealed) targets.add(t.impact_zone);
    });
    return targets;
  }, [activeThreats]);

  // Transform Israel outline through viewport
  const israelPath = useMemo(() => {
    const points = ISRAEL_OUTLINE.map(([x, y]) => {
      const p = mapToSVG(x, y, viewport);
      return `${p.x},${p.y}`;
    });
    return `M ${points[0]} L ${points.slice(1).join(' L ')} Z`;
  }, [viewport]);

  const rings = useMemo(() => [20, 40, 60, 80, 100], []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative" style={{ width: '100%', maxWidth: '600px', aspectRatio: '1' }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.15))' }}
        >
          {/* Clip path for radar circle */}
          <defs>
            <clipPath id="radar-clip">
              <circle cx="50" cy="50" r="49" />
            </clipPath>
          </defs>

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

          {/* === All map content clipped to radar circle === */}
          <g clipPath="url(#radar-clip)">

            {/* Israel outline — viewport-transformed */}
            <path
              d={israelPath}
              fill="rgba(0, 255, 136, 0.05)"
              stroke="rgba(0, 255, 136, 0.3)"
              strokeWidth="0.4"
            />

            {/* Region outlines — filled polygons with dashed borders */}
            {visibleRegions.map((region) => {
              const points = region.polygon.map(([x, y]) => {
                const p = mapToSVG(x, y, viewport);
                return `${p.x},${p.y}`;
              }).join(' ');
              const labelP = mapToSVG(region.labelPos.x, region.labelPos.y, viewport);
              return (
                <g key={region.name}>
                  <polygon
                    points={points}
                    fill={region.color}
                    stroke={region.color.replace(/[\d.]+\)$/, '0.6)')}
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={labelP.x} y={labelP.y}
                    fill={region.color.replace(/[\d.]+\)$/, '0.7)')}
                    fontSize="2.2" fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}

            {/* Gaza Strip zone — hostile territory on the map */}
            {isGazaVisible(currentLevel) && (() => {
              const gazaPoints = GAZA_STRIP.polygon.map(([x, y]) => {
                const p = mapToSVG(x, y, viewport);
                return `${p.x},${p.y}`;
              }).join(' ');
              const gazaLabel = mapToSVG(GAZA_STRIP.labelPos.x, GAZA_STRIP.labelPos.y, viewport);
              return (
                <g>
                  <polygon
                    points={gazaPoints}
                    fill={GAZA_STRIP.color}
                    stroke={GAZA_STRIP.borderColor}
                    strokeWidth="0.5"
                  />
                  <text
                    x={gazaLabel.x} y={gazaLabel.y}
                    fill="rgba(255, 120, 60, 0.8)"
                    fontSize="2" fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    Gaza
                  </text>
                </g>
              );
            })()}

            {/* Kinneret (Sea of Galilee) */}
            {showKinneret && (() => {
              const kp = mapToSVG(KINNERET.cx, KINNERET.cy, viewport);
              const rx = KINNERET.rx * viewport.scale * 100;
              const ry = KINNERET.ry * viewport.scale * 100;
              return (
                <ellipse
                  cx={kp.x} cy={kp.y} rx={rx} ry={ry}
                  fill="rgba(60, 130, 246, 0.15)"
                  stroke="rgba(60, 130, 246, 0.4)"
                  strokeWidth="0.3"
                />
              );
            })()}

            {/* Cities — progressive reveal with tier-based labels */}
            {(() => {
              // Scale dots and labels based on viewport zoom
              const dotRadius = viewport.scale >= 2.0 ? 1.2 : viewport.scale >= 1.5 ? 1.0 : 0.7;
              const labelSize = viewport.scale >= 2.0 ? 1.8 : viewport.scale >= 1.5 ? 1.5 : 1.2;

              return Object.entries(visibleCities).map(([name, city]) => {
                const p = mapToSVG(city.x, city.y, viewport);
                const flash = impactFlashes.find((f) => f.zone === name);

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

                // Tier-based label visibility
                const showLabel = city.tier === 1
                  || viewport.scale >= 1.5
                  || activeThreatTargets.has(name);

                // Per-city label direction offset
                const offset = LABEL_OFFSETS[city.labelDir || 'e'];

                return (
                  <g key={name}>
                    <circle
                      cx={p.x} cy={p.y} r={dotRadius}
                      fill={dotColor}
                      stroke={strokeColor}
                      strokeWidth="0.3"
                    />
                    {showLabel && (
                      <text
                        x={p.x + offset.dx} y={p.y + offset.dy}
                        fill={labelColor}
                        fontSize={labelSize} fontFamily="monospace"
                        textAnchor={offset.anchor}
                      >
                        {name}
                      </text>
                    )}
                  </g>
                );
              });
            })()}

            {/* Battery/HQ marker — per-level position */}
            {(() => {
              const battery = getBatteryForLevel(currentLevel);
              if (!battery) return null;
              const hq = mapToSVG(battery.x, battery.y, viewport);
              return (
                <g>
                  <rect
                    x={hq.x - 1.5} y={hq.y - 1.5}
                    width="3" height="3"
                    fill="none" stroke="#22c55e" strokeWidth="0.4" opacity="0.7"
                    transform={`rotate(45, ${hq.x}, ${hq.y})`}
                  />
                  <text
                    x={hq.x} y={hq.y + 4}
                    fill="#22c55e" fontSize="1.4" fontFamily="monospace"
                    textAnchor="middle" opacity="0.6" fontWeight="bold"
                  >
                    {battery.label}
                  </text>
                </g>
              );
            })()}

            {/* === Impact Effects Layer === */}
            {impactFlashes.map((flash) => {
              if (flash.type === 'intercept') return <InterceptEffect key={flash.id} flash={flash} viewport={viewport} />;
              if (flash.type === 'city_hit') return <CityHitEffect key={flash.id} flash={flash} viewport={viewport} />;
              if (flash.type === 'ground_impact') return <GroundImpactEffect key={flash.id} flash={flash} viewport={viewport} />;
              if (flash.type === 'hold_clear') return <HoldClearEffect key={flash.id} flash={flash} viewport={viewport} />;
              return null;
            })}

            {/* Interceptor trails */}
            {activeTrails.map((trail) => (
              <TrailEffect key={trail.id} trail={trail} viewport={viewport} />
            ))}

            {/* Threat trajectory trail gradients */}
            <defs>
              {activeThreats.map((threat) => {
                const pos = getBlipPosition(threat);
                const color = THREAT_COLORS[threat.type] || '#ffffff';
                const svgOrigin = mapToSVG(pos.originX, pos.originY, viewport);
                const svgPos = mapToSVG(pos.x, pos.y, viewport);
                return (
                  <linearGradient
                    key={`trail-grad-${threat.id}`}
                    id={`trail-grad-${threat.id}`}
                    x1={svgOrigin.x} y1={svgOrigin.y}
                    x2={svgPos.x} y2={svgPos.y}
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
              const svgPos = mapToSVG(pos.x, pos.y, viewport);
              const svgOrigin = mapToSVG(pos.originX, pos.originY, viewport);
              const color = THREAT_COLORS[threat.type] || '#ffffff';
              const isSelected = threat.id === selectedThreatId;

              return (
                <g
                  key={threat.id}
                  onClick={() => !threat.intercepted && !threat.held && onSelectThreat(threat.id)}
                  style={{ cursor: (threat.intercepted || threat.held) ? 'default' : 'pointer' }}
                  className={`${threat.intercepted ? 'intercepted-blip-fade' : threat.held ? 'held-blip-fade' : 'blip-hover'}`}
                >
                  {/* Invisible hit target */}
                  {!threat.intercepted && !threat.held && (
                    <circle cx={svgPos.x} cy={svgPos.y} r="4.5" fill="transparent" stroke="none" />
                  )}
                  {/* Trajectory trail */}
                  <line
                    x1={svgOrigin.x} y1={svgOrigin.y}
                    x2={svgPos.x} y2={svgPos.y}
                    stroke={`url(#trail-grad-${threat.id})`}
                    strokeWidth="0.5"
                  />
                  {/* Selection ring */}
                  {isSelected && !threat.intercepted && (
                    <circle
                      cx={svgPos.x} cy={svgPos.y} r="4"
                      fill="none" stroke="#ffffff" strokeWidth="0.3" opacity="0.6"
                      strokeDasharray="1.5 1"
                      className="selection-ring-spin"
                    />
                  )}
                  {/* Pulse ring */}
                  <circle
                    cx={svgPos.x} cy={svgPos.y} r="2.5"
                    fill="none" stroke={color} strokeWidth="0.3" opacity="0.4"
                    className="radar-pulse"
                  />
                  {/* Blip */}
                  <circle
                    cx={svgPos.x} cy={svgPos.y}
                    r="1.8"
                    fill={color}
                    stroke={isSelected ? '#ffffff' : color}
                    strokeWidth={isSelected ? '0.6' : '0.3'}
                    opacity={1}
                    style={{ filter: `drop-shadow(0 0 ${isSelected ? '5' : '3'}px ${color})` }}
                  />
                  {/* Label */}
                  <text
                    x={svgPos.x} y={svgPos.y - 3.5}
                    fill={color} fontSize="2" fontFamily="monospace"
                    textAnchor="middle" fontWeight="bold"
                    opacity={0.9}
                  >
                    {`T${threat.id}`}
                  </text>
                </g>
              );
            })}

          </g>
          {/* === End clipped map content === */}

          {/* Threat origin arcs — rendered ON TOP of clip, at the radar perimeter */}
          {visibleOrigins.map((origin) => (
            <ThreatOriginArc key={origin.name} origin={origin} viewport={viewport} />
          ))}

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
