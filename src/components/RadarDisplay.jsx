import { useMemo } from 'react';
import { IMPACT_POSITIONS, THREAT_COLORS } from '../config/threats.js';
import {
  CITIES,
  getVisibleCities,
  getViewportForLevel,
  getBatteryForLevel,
  getVisibleRegions,
  getVisibleThreatOrigins,
} from '../config/mapLayers.js';
import { getSpawnOrigin } from '../config/spawnOrigins.js';

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

// Blip dot radius by threat type — larger threats are more visible
const BLIP_RADIUS = {
  drone: 1.2,
  rocket: 1.4,
  cruise: 1.7,
  ballistic: 2.0,
  hypersonic: 2.2,
};

function getBlipPosition(threat) {
  const target = IMPACT_POSITIONS[threat.impact_zone] || { x: 0.5, y: 0.5 };
  const timeLeft = threat.intercepted ? threat.frozenTimeLeft : threat.timeLeft;
  const linearProgress = 1 - timeLeft / threat.countdown;
  const progress = easeProgress(linearProgress, threat.type);
  const start = getSpawnOrigin(threat.type, threat.origin);
  return {
    x: start.x + (target.x - start.x) * progress,
    y: start.y + (target.y - start.y) * progress,
    originX: start.x,
    originY: start.y,
  };
}

// ============================================
// Impact Effect Renderers
// ============================================

function InterceptEffect({ flash, viewport }) {
  const { cx, cy, particles, threatType } = flash;
  const p = mapToSVG(cx, cy, viewport);
  // Scale intercept effect by threat severity — bigger threats = more dramatic
  const scale = { drone: 0.6, rocket: 0.8, cruise: 1.0, ballistic: 1.3, hypersonic: 1.6 }[threatType] || 1.0;
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={2 * scale} fill="white" className="intercept-flash-center" />
      <circle cx={p.x} cy={p.y} r={3 * scale} fill="none" stroke="#22c55e" strokeWidth={Math.max(0.5, 1 * scale)} className="intercept-shockwave" />
      <circle cx={p.x} cy={p.y} r={3 * scale} fill="none" stroke="rgba(34, 197, 94, 0.5)" strokeWidth={Math.max(0.3, 0.5 * scale)} className="intercept-shockwave-secondary" />
      {particles.map((pt, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={Math.max(0.3, 0.6 * scale)} fill="#22c55e" className="intercept-particle"
          style={{ '--end-x': `${pt.endX * scale}px`, '--end-y': `${pt.endY * scale}px`, animationDelay: `${pt.delay}s` }} />
      ))}
    </g>
  );
}

function HypersonicInterceptEffect({ flash, viewport }) {
  const { cx, cy } = flash;
  const p = mapToSVG(cx, cy, viewport);
  // Electric arc directions — 6 lightning bolts radiating outward
  const arcs = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const len = 8 + Math.random() * 4;
    const midLen = len * 0.5;
    const jitter = (Math.random() - 0.5) * 3;
    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);
    return {
      x1: p.x + Math.cos(angle) * midLen + perpX * jitter,
      y1: p.y + Math.sin(angle) * midLen + perpY * jitter,
      x2: p.x + Math.cos(angle) * len,
      y2: p.y + Math.sin(angle) * len,
      delay: i * 0.04,
    };
  });
  // Particle ring — 12 particles in a burst pattern
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + (Math.random() * 0.3);
    const dist = 6 + Math.random() * 5;
    return {
      endX: Math.cos(angle) * dist,
      endY: Math.sin(angle) * dist,
      delay: i * 0.02,
    };
  });
  return (
    <g>
      {/* Core flash — bright white/cyan */}
      <circle cx={p.x} cy={p.y} r={3} fill="white" className="hyper-flash-core" />
      {/* Inner plasma glow — purple */}
      <circle cx={p.x} cy={p.y} r={4} fill="rgba(168, 85, 247, 0.6)" className="hyper-plasma-glow" />
      {/* Triple expanding shockwaves — cyan, purple, white at staggered timing */}
      <circle cx={p.x} cy={p.y} r={3} fill="none" stroke="#06b6d4" strokeWidth="1.2" className="hyper-shockwave-1" />
      <circle cx={p.x} cy={p.y} r={3} fill="none" stroke="#a855f7" strokeWidth="0.8" className="hyper-shockwave-2" />
      <circle cx={p.x} cy={p.y} r={3} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" className="hyper-shockwave-3" />
      {/* Electric arcs — lightning bolts radiating from center */}
      {arcs.map((arc, i) => (
        <g key={`arc-${i}`}>
          <line x1={p.x} y1={p.y} x2={arc.x1} y2={arc.y1}
            stroke="#06b6d4" strokeWidth="0.6" className="hyper-arc"
            style={{ animationDelay: `${arc.delay}s` }} />
          <line x1={arc.x1} y1={arc.y1} x2={arc.x2} y2={arc.y2}
            stroke="#a855f7" strokeWidth="0.4" className="hyper-arc"
            style={{ animationDelay: `${arc.delay + 0.02}s` }} />
        </g>
      ))}
      {/* Particle burst — cyan + purple alternating */}
      {particles.map((pt, i) => (
        <circle key={`pt-${i}`} cx={p.x} cy={p.y} r={0.5}
          fill={i % 2 === 0 ? '#06b6d4' : '#a855f7'}
          className="hyper-particle"
          style={{ '--end-x': `${pt.endX}px`, '--end-y': `${pt.endY}px`, animationDelay: `${pt.delay}s` }} />
      ))}
      {/* Energy dissipation ring — slow expanding outer ring */}
      <circle cx={p.x} cy={p.y} r={2} fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.3" className="hyper-dissipation" />
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
function ThreatOriginArc({ origin }) {
  // Draw a gradient wedge zone at the radar perimeter
  const cx = 50, cy = 50;
  const outerR = 49;
  const innerR = 36;  // gradient zone starts here
  const startAngle = (origin.angle - origin.arcSpan / 2) * Math.PI / 180;
  const endAngle = (origin.angle + origin.arcSpan / 2) * Math.PI / 180;
  const midAngle = origin.angle * Math.PI / 180;

  // Outer arc
  const x1o = cx + outerR * Math.sin(startAngle);
  const y1o = cy - outerR * Math.cos(startAngle);
  const x2o = cx + outerR * Math.sin(endAngle);
  const y2o = cy - outerR * Math.cos(endAngle);

  // Inner arc
  const x1i = cx + innerR * Math.sin(startAngle);
  const y1i = cy - innerR * Math.cos(startAngle);
  const x2i = cx + innerR * Math.sin(endAngle);
  const y2i = cy - innerR * Math.cos(endAngle);

  const largeArc = origin.arcSpan > 180 ? 1 : 0;

  // Annular sector (donut wedge) for the gradient zone
  const zonePath = `M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1i} ${y1i} Z`;

  // Label position
  const labelR = outerR - 4;
  const lx = cx + labelR * Math.sin(midAngle);
  const ly = cy - labelR * Math.cos(midAngle);

  return (
    <g>
      {/* Gradient zone — subtle fill indicating hostile territory */}
      <path d={zonePath} fill="rgba(255, 100, 50, 0.06)" stroke="none" />
      {/* Perimeter arc */}
      <path
        d={`M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`}
        fill="none" stroke="rgba(255, 160, 60, 0.4)" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Glow behind arc */}
      <path
        d={`M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`}
        fill="none" stroke="rgba(255, 80, 40, 0.1)" strokeWidth="4" strokeLinecap="round"
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

  // Build set of cities currently targeted by active threats (for tier-2 label pop-up)
  const activeThreatTargets = useMemo(() => {
    const targets = new Set();
    activeThreats.forEach((t) => {
      if (!t.intercepted && t.impactRevealed) targets.add(t.impact_zone);
    });
    return targets;
  }, [activeThreats]);

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

            {/* Region labels — subtle map-style annotations, no polygons */}
            {visibleRegions.map((region) => {
              const labelP = mapToSVG(region.labelPos.x, region.labelPos.y, viewport);
              const fillColor = 'rgba(0, 200, 255, 0.35)';
              // Stack "Otef Aza" vertically to save horizontal space
              if (region.name === 'Otef Aza') {
                return (
                  <text
                    key={region.name}
                    x={labelP.x} y={labelP.y}
                    fill={fillColor}
                    fontSize="2.8" fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                    letterSpacing="1.5"
                  >
                    <tspan x={labelP.x} dy="0">Otef</tspan>
                    <tspan x={labelP.x} dy="3.2">Aza</tspan>
                  </text>
                );
              }
              return (
                <text
                  key={region.name}
                  x={labelP.x} y={labelP.y}
                  fill={fillColor}
                  fontSize="2.8" fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                  letterSpacing="1.5"
                >
                  {region.name}
                </text>
              );
            })}

            {/* Cities — progressive reveal with tier-based labels */}
            {(() => {
              // Scale dots and labels based on viewport zoom
              const dotRadius = viewport.scale >= 2.0 ? 1.2 : viewport.scale >= 1.5 ? 1.0 : 0.7;
              const labelSize = viewport.scale >= 2.0 ? 1.8 : viewport.scale >= 1.5 ? 1.5 : 1.2;

              // At L3+ (zoomed out), hide tier 2 cities unless actively targeted
              const citiesToRender = Object.entries(visibleCities).filter(([name, city]) => {
                if (city.tier === 1) return true;
                if (viewport.scale >= 1.5) return true; // zoomed in (L1/L2)
                if (activeThreatTargets.has(name)) return true; // being targeted
                return false;
              });

              return citiesToRender.map(([name, city]) => {
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

                // Always show labels for visible cities (tier 2 already filtered above)
                const showLabel = true;

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
                  {/* Label removed — diamond icon is sufficient, reduces map clutter */}
                </g>
              );
            })()}

            {/* === Impact Effects Layer === */}
            {impactFlashes.map((flash) => {
              if (flash.type === 'intercept' && flash.threatType === 'hypersonic') return <HypersonicInterceptEffect key={flash.id} flash={flash} viewport={viewport} />;
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
                  {/* Pulse ring — scaled by threat type */}
                  <circle
                    cx={svgPos.x} cy={svgPos.y} r={(BLIP_RADIUS[threat.type] || 1.4) + 1.0}
                    fill="none" stroke={color} strokeWidth="0.3" opacity="0.4"
                    className="radar-pulse"
                  />
                  {/* Blip — sized by threat type (drones small, missiles large) */}
                  <circle
                    cx={svgPos.x} cy={svgPos.y}
                    r={BLIP_RADIUS[threat.type] || 1.4}
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
