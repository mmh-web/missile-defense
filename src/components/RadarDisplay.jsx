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

// Flash type → color mapping
const FLASH_COLORS = {
  intercept: 'rgba(34, 197, 94, 0.9)',       // green
  ground_impact: 'rgba(245, 158, 11, 0.7)',   // amber
  city_hit: 'rgba(239, 68, 68, 0.9)',          // red
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

function ShieldDeflectEffect({ flash, viewport }) {
  const { cx, cy, particles } = flash;
  const p = mapToSVG(cx, cy, viewport);
  return (
    <g>
      {/* Shell dome flash — green dome lights up on impact */}
      <circle cx={p.x} cy={p.y} r="4" fill="rgba(76, 175, 80, 0.5)" className="shield-dome-flash" />
      {/* Hexagonal crack pattern flash */}
      <circle cx={p.x} cy={p.y} r="3.5" fill="none" stroke="#81C784" strokeWidth="0.8" className="shield-crack-ring" />
      <circle cx={p.x} cy={p.y} r="5" fill="none" stroke="#4CAF50" strokeWidth="0.4" className="shield-ripple" />
      {/* Bounce particles — fly upward like deflecting off a dome */}
      {particles.map((pt, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={pt.r || 0.4} fill={pt.color || '#4CAF50'} className="shield-bounce-particle"
          style={{ '--end-x': `${pt.endX}px`, '--end-y': `${pt.endY}px`, animationDelay: `${pt.delay}s` }} />
      ))}
      {/* "DEFLECTED" sparks — small bright dots */}
      <circle cx={p.x - 1} cy={p.y - 2} r="0.3" fill="#A5D6A7" className="shield-spark" style={{ animationDelay: '0.05s' }} />
      <circle cx={p.x + 1.5} cy={p.y - 1.5} r="0.25" fill="#C8E6C9" className="shield-spark" style={{ animationDelay: '0.1s' }} />
      <circle cx={p.x} cy={p.y - 3} r="0.35" fill="#66BB6A" className="shield-spark" style={{ animationDelay: '0.15s' }} />
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
const ORIGIN_HEBREW = {
  Gaza: 'עַזָּה',
  Lebanon: 'לְבָנוֹן',
  Syria: 'סוּרְיָה',
  Iran: 'אִירָאן',
  Yemen: 'תֵּימָן',
};

function ThreatOriginArc({ origin, currentLevel }) {
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
    <g style={{ pointerEvents: 'none' }}>
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
        x={lx} y={currentLevel >= 4 && ORIGIN_HEBREW[origin.name] ? ly - 1.2 : ly}
        fill="rgba(255, 180, 80, 0.7)"
        fontSize="2.2" fontFamily="monospace"
        textAnchor="middle" dominantBaseline="middle"
        fontWeight="bold"
      >
        {origin.name}
      </text>
      {currentLevel >= 4 && ORIGIN_HEBREW[origin.name] && (
        <text
          x={lx} y={ly + 2}
          fill="rgba(255, 180, 80, 0.7)"
          fontSize="2.2" fontFamily="Arial, sans-serif"
          textAnchor="middle" dominantBaseline="middle"
          fontWeight="bold"
        >
          {ORIGIN_HEBREW[origin.name]}
        </text>
      )}
    </g>
  );
}

// ============================================
// Main Component
// ============================================
// ============================================
// Teddy Bear SVG — Tzur Cheat Code Easter Egg
// ============================================
function TeddyBearSVG({ cx, cy, rotation = 0 }) {
  // Bear is drawn at center (cx, cy) in SVG viewBox coords
  // Total size ~16 SVG units tall
  const s = 0.55; // scale factor
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${s})`}>
      {/* === Ears === */}
      <circle cx="-5.5" cy="-10" r="3.2" fill="#8B6914" stroke="#6B4F10" strokeWidth="0.4" />
      <circle cx="-5.5" cy="-10" r="1.8" fill="#D4A44C" />
      <circle cx="5.5" cy="-10" r="3.2" fill="#8B6914" stroke="#6B4F10" strokeWidth="0.4" />
      <circle cx="5.5" cy="-10" r="1.8" fill="#D4A44C" />

      {/* === Head === */}
      <circle cx="0" cy="-6" r="6.5" fill="#C4943C" stroke="#8B6914" strokeWidth="0.4" />
      {/* Muzzle */}
      <ellipse cx="0" cy="-4" rx="3.5" ry="2.8" fill="#E8C97C" />
      {/* Nose */}
      <ellipse cx="0" cy="-4.8" rx="1.2" ry="0.8" fill="#2a1a0a" />
      {/* Mouth */}
      <path d="M-1.2,-4 Q0,-2.8 1.2,-4" fill="none" stroke="#2a1a0a" strokeWidth="0.4" strokeLinecap="round" />
      {/* Smirk */}
      <path d="M1.2,-4 Q2,-3.5 2.5,-3.8" fill="none" stroke="#2a1a0a" strokeWidth="0.3" strokeLinecap="round" />

      {/* === Aviator Sunglasses === */}
      {/* Bridge */}
      <path d="M-1.5,-6.5 Q0,-5.8 1.5,-6.5" fill="none" stroke="#333" strokeWidth="0.5" />
      {/* Earpieces */}
      <line x1="-5" y1="-6.5" x2="-3.5" y2="-6.5" stroke="#333" strokeWidth="0.4" />
      <line x1="5" y1="-6.5" x2="3.5" y2="-6.5" stroke="#333" strokeWidth="0.4" />
      {/* Left lens */}
      <path d="M-1.5,-6.5 Q-1.8,-8.2 -3.2,-8 Q-5,-7.8 -5,-6.5 Q-5,-5 -3,-4.8 Q-1.5,-5 -1.5,-6.5Z" fill="rgba(50,50,50,0.85)" stroke="#555" strokeWidth="0.3" />
      {/* Right lens */}
      <path d="M1.5,-6.5 Q1.8,-8.2 3.2,-8 Q5,-7.8 5,-6.5 Q5,-5 3,-4.8 Q1.5,-5 1.5,-6.5Z" fill="rgba(50,50,50,0.85)" stroke="#555" strokeWidth="0.3" />
      {/* Glint on lenses */}
      <ellipse cx="-3" cy="-7" rx="0.6" ry="0.3" fill="rgba(255,255,255,0.25)" transform="rotate(-15,-3,-7)" />
      <ellipse cx="3.5" cy="-7" rx="0.6" ry="0.3" fill="rgba(255,255,255,0.25)" transform="rotate(-15,3.5,-7)" />

      {/* === Body === */}
      <ellipse cx="0" cy="4" rx="6" ry="7" fill="#C4943C" stroke="#8B6914" strokeWidth="0.4" />
      {/* Tummy */}
      <ellipse cx="0" cy="4.5" rx="3.8" ry="4.5" fill="#E8C97C" />

      {/* === Left arm (waving) === */}
      <path d="M-6,1 Q-10,-2 -9,-5" fill="none" stroke="#C4943C" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-9" cy="-5" r="1.8" fill="#C4943C" stroke="#8B6914" strokeWidth="0.3" />

      {/* === Right arm (holding glock) === */}
      <path d="M6,1 Q9,-1 10,-3" fill="none" stroke="#C4943C" strokeWidth="3" strokeLinecap="round" />
      <circle cx="10" cy="-3" r="1.8" fill="#C4943C" stroke="#8B6914" strokeWidth="0.3" />

      {/* === Glock in right paw === */}
      <g transform="translate(11.5,-4) rotate(-30)">
        {/* Slide */}
        <rect x="0" y="-1.2" width="6" height="2.2" rx="0.3" fill="#444" stroke="#222" strokeWidth="0.2" />
        {/* Barrel */}
        <rect x="5.5" y="-0.7" width="2" height="1.2" rx="0.2" fill="#555" stroke="#333" strokeWidth="0.15" />
        {/* Grip */}
        <rect x="0.5" y="1" width="2.2" height="3.5" rx="0.3" fill="#333" stroke="#222" strokeWidth="0.2" transform="rotate(10,1.5,1)" />
        {/* Trigger guard */}
        <path d="M2.5,1 Q3.5,2.5 2.5,3" fill="none" stroke="#444" strokeWidth="0.3" />
        {/* Muzzle flash when active */}
        <circle cx="8" cy="-0.1" r="1.5" fill="#f59e0b" opacity="0.6" className="tzur-muzzle-flash" />
        <circle cx="8.5" cy="-0.1" r="0.8" fill="white" opacity="0.8" className="tzur-muzzle-flash" />
      </g>

      {/* === Legs === */}
      <ellipse cx="-3" cy="10.5" rx="2.5" ry="1.8" fill="#C4943C" stroke="#8B6914" strokeWidth="0.3" />
      <ellipse cx="3" cy="10.5" rx="2.5" ry="1.8" fill="#C4943C" stroke="#8B6914" strokeWidth="0.3" />
      {/* Foot pads */}
      <ellipse cx="-3" cy="10.8" rx="1.5" ry="1" fill="#E8C97C" />
      <ellipse cx="3" cy="10.8" rx="1.5" ry="1" fill="#E8C97C" />
    </g>
  );
}

// ============================================
// Siamese Cat SVG — Sasha Cheat Code Easter Egg
// ============================================
function SiameseCatSVG({ cx, cy }) {
  const s = 0.5;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${s})`}>
      {/* === Tail — curving up behind === */}
      <path d="M-3,8 Q-8,4 -9,-2 Q-9.5,-5 -8,-6" fill="none" stroke="#6B5244" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="-8" cy="-6" r="0.8" fill="#3D2B1F" />

      {/* === Body — slender, elegant === */}
      <ellipse cx="0" cy="4" rx="5" ry="6.5" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="0.3" />
      {/* Chest lighter area */}
      <ellipse cx="0" cy="3" rx="3" ry="4" fill="#FAF0E6" />

      {/* === Back legs (sitting pose) === */}
      <ellipse cx="-3.5" cy="9.5" rx="2.8" ry="1.5" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="0.3" />
      <ellipse cx="3.5" cy="9.5" rx="2.8" ry="1.5" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="0.3" />
      {/* Dark paws */}
      <ellipse cx="-3.5" cy="10.2" rx="1.5" ry="0.8" fill="#3D2B1F" />
      <ellipse cx="3.5" cy="10.2" rx="1.5" ry="0.8" fill="#3D2B1F" />

      {/* === Front paws === */}
      <rect x="-2.5" y="7" width="2" height="4" rx="1" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="0.2" />
      <rect x="0.5" y="7" width="2" height="4" rx="1" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="0.2" />
      <ellipse cx="-1.5" cy="10.5" rx="1.2" ry="0.7" fill="#3D2B1F" />
      <ellipse cx="1.5" cy="10.5" rx="1.2" ry="0.7" fill="#3D2B1F" />

      {/* === Head — wedge-shaped === */}
      <ellipse cx="0" cy="-5" rx="5.5" ry="5" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="0.3" />

      {/* === Dark face mask (seal point) === */}
      <ellipse cx="0" cy="-3.5" rx="3.5" ry="3" fill="#6B5244" opacity="0.7" />
      <ellipse cx="0" cy="-4" rx="4" ry="2.5" fill="#3D2B1F" opacity="0.4" />

      {/* === Ears — large, pointed === */}
      <polygon points="-4.5,-8 -2,-14 0.5,-8" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="0.3" />
      <polygon points="4.5,-8 2,-14 -0.5,-8" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="0.3" />
      {/* Inner ears — dark */}
      <polygon points="-3.8,-8.5 -2,-12.5 -0.2,-8.5" fill="#3D2B1F" opacity="0.6" />
      <polygon points="3.8,-8.5 2,-12.5 0.2,-8.5" fill="#3D2B1F" opacity="0.6" />

      {/* === Nose — dark pink === */}
      <ellipse cx="0" cy="-3.2" rx="0.8" ry="0.5" fill="#8B5E5E" />

      {/* === Mouth === */}
      <path d="M-0.8,-2.8 Q0,-2 0.8,-2.8" fill="none" stroke="#3D2B1F" strokeWidth="0.3" strokeLinecap="round" />

      {/* === Whiskers === */}
      <line x1="-2" y1="-3" x2="-7" y2="-4" stroke="#D4C4B0" strokeWidth="0.2" opacity="0.6" />
      <line x1="-2" y1="-2.5" x2="-7" y2="-2.5" stroke="#D4C4B0" strokeWidth="0.2" opacity="0.6" />
      <line x1="-2" y1="-2" x2="-6.5" y2="-1" stroke="#D4C4B0" strokeWidth="0.2" opacity="0.6" />
      <line x1="2" y1="-3" x2="7" y2="-4" stroke="#D4C4B0" strokeWidth="0.2" opacity="0.6" />
      <line x1="2" y1="-2.5" x2="7" y2="-2.5" stroke="#D4C4B0" strokeWidth="0.2" opacity="0.6" />
      <line x1="2" y1="-2" x2="6.5" y2="-1" stroke="#D4C4B0" strokeWidth="0.2" opacity="0.6" />

      {/* === Eyes — bright blue with laser glow === */}
      {/* Eye sockets */}
      <ellipse cx="-2" cy="-5" rx="1.3" ry="1.1" fill="#1a1a2e" />
      <ellipse cx="2" cy="-5" rx="1.3" ry="1.1" fill="#1a1a2e" />
      {/* Blue irises */}
      <ellipse cx="-2" cy="-5" rx="1" ry="0.9" fill="#3B82F6" />
      <ellipse cx="2" cy="-5" rx="1" ry="0.9" fill="#3B82F6" />
      {/* Vertical slit pupils */}
      <ellipse cx="-2" cy="-5" rx="0.3" ry="0.8" fill="#0a0a1a" />
      <ellipse cx="2" cy="-5" rx="0.3" ry="0.8" fill="#0a0a1a" />
      {/* Laser glow around eyes */}
      <ellipse cx="-2" cy="-5" rx="1.8" ry="1.5" fill="none" stroke="#06b6d4" strokeWidth="0.3" opacity="0.7" className="sasha-eye-glow" />
      <ellipse cx="2" cy="-5" rx="1.8" ry="1.5" fill="none" stroke="#06b6d4" strokeWidth="0.3" opacity="0.7" className="sasha-eye-glow" />
      {/* Eye glints */}
      <circle cx="-1.5" cy="-5.3" r="0.3" fill="white" opacity="0.8" />
      <circle cx="2.5" cy="-5.3" r="0.3" fill="white" opacity="0.8" />
    </g>
  );
}

function TurtleShellDome({ cx, cy, r }) {
  // Realistic turtle shell from above — proper scute anatomy: 5 vertebral, 4 costal pairs, marginal rim
  const sw = Math.max(0.08, r * 0.03);
  const ry = r * 0.88; // slightly oval
  return (
    <g>
      {/* Marginal rim — dark border ring */}
      <ellipse cx={cx} cy={cy} rx={r} ry={ry}
        fill="#1B5E20" fillOpacity="0.6" stroke="#4CAF50" strokeWidth={sw * 3} />
      {/* Marginal scute segments — notches around the rim */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const ix = cx + Math.cos(a) * r * 0.82;
        const iy = cy + Math.sin(a) * ry * 0.82;
        const ox = cx + Math.cos(a) * r * 0.98;
        const oy = cy + Math.sin(a) * ry * 0.98;
        return <line key={i} x1={ix} y1={iy} x2={ox} y2={oy} stroke="#66BB6A" strokeWidth={sw} opacity="0.5" />;
      })}
      {/* Inner shell area */}
      <ellipse cx={cx} cy={cy} rx={r * 0.8} ry={ry * 0.8}
        fill="#2E7D32" fillOpacity="0.5" stroke="#388E3C" strokeWidth={sw * 1.5} />
      {/* === 5 Vertebral scutes (center column) === */}
      {[- 0.55, -0.27, 0, 0.27, 0.55].map((yOff, i) => (
        <ellipse key={`v${i}`} cx={cx} cy={cy + ry * yOff}
          rx={r * 0.18} ry={ry * (i === 2 ? 0.15 : 0.12)}
          fill="#388E3C" fillOpacity="0.5" stroke="#66BB6A" strokeWidth={sw * 1.2} />
      ))}
      {/* Vertebral ridge line */}
      <line x1={cx} y1={cy - ry * 0.68} x2={cx} y2={cy + ry * 0.68}
        stroke="#4CAF50" strokeWidth={sw} opacity="0.4" />
      {/* === 4 pairs of costal scutes (flanking vertebral) === */}
      {[-0.4, -0.13, 0.13, 0.4].map((yOff, i) => (
        <g key={`c${i}`}>
          <ellipse cx={cx - r * 0.42} cy={cy + ry * yOff}
            rx={r * 0.22} ry={ry * 0.12}
            fill="#43A047" fillOpacity="0.35" stroke="#66BB6A" strokeWidth={sw} />
          <ellipse cx={cx + r * 0.42} cy={cy + ry * yOff}
            rx={r * 0.22} ry={ry * 0.12}
            fill="#43A047" fillOpacity="0.35" stroke="#66BB6A" strokeWidth={sw} />
        </g>
      ))}
      {/* Radial growth lines from vertebral to costal */}
      {[-0.4, -0.13, 0.13, 0.4].map((yOff, i) => (
        <g key={`r${i}`}>
          <line x1={cx - r * 0.18} y1={cy + ry * yOff} x2={cx - r * 0.25} y2={cy + ry * yOff}
            stroke="#66BB6A" strokeWidth={sw * 0.8} opacity="0.4" />
          <line x1={cx + r * 0.18} y1={cy + ry * yOff} x2={cx + r * 0.25} y2={cy + ry * yOff}
            stroke="#66BB6A" strokeWidth={sw * 0.8} opacity="0.4" />
        </g>
      ))}
      {/* 3D highlight — top-left */}
      <ellipse cx={cx - r * 0.15} cy={cy - ry * 0.2} rx={r * 0.25} ry={ry * 0.15}
        fill="#81C784" opacity="0.25" />
    </g>
  );
}

function TurtleSVG({ cx, cy }) {
  const s = 0.55;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${s})`}>
      {/* === Flippers — sea turtle style, behind body === */}
      {/* Back left flipper */}
      <path d="M-6,-5 Q-11,-8 -13,-4 Q-12,-2 -8,-3 Z" fill="#6B9B37" stroke="#4A7A25" strokeWidth="0.4" />
      {/* Back right flipper */}
      <path d="M6,-5 Q11,-8 13,-4 Q12,-2 8,-3 Z" fill="#6B9B37" stroke="#4A7A25" strokeWidth="0.4" />
      {/* Front left flipper — large, paddle-shaped */}
      <path d="M-6,3 Q-14,6 -15,2 Q-14,-1 -12,0 Q-10,1 -7,1 Z" fill="#7CB342" stroke="#4A7A25" strokeWidth="0.4" className="dvir-flipper-l" />
      {/* Front right flipper */}
      <path d="M6,3 Q14,6 15,2 Q14,-1 12,0 Q10,1 7,1 Z" fill="#7CB342" stroke="#4A7A25" strokeWidth="0.4" className="dvir-flipper-r" />

      {/* === Tail — small triangular === */}
      <path d="M-1,-8 L0,-12 L1,-8" fill="#6B9B37" stroke="#4A7A25" strokeWidth="0.3" />

      {/* === Shell — detailed carapace from above === */}
      <ellipse cx="0" cy="0" rx="10" ry="8.5" fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.7" />

      {/* 5 Vertebral scutes — center column */}
      <ellipse cx="0" cy="-5" rx="2.5" ry="1.5" fill="#388E3C" stroke="#1B5E20" strokeWidth="0.35" />
      <ellipse cx="0" cy="-2.5" rx="2.8" ry="1.6" fill="#388E3C" stroke="#1B5E20" strokeWidth="0.35" />
      <ellipse cx="0" cy="0" rx="3" ry="1.8" fill="#388E3C" stroke="#1B5E20" strokeWidth="0.35" />
      <ellipse cx="0" cy="2.5" rx="2.8" ry="1.6" fill="#388E3C" stroke="#1B5E20" strokeWidth="0.35" />
      <ellipse cx="0" cy="5" rx="2.5" ry="1.5" fill="#388E3C" stroke="#1B5E20" strokeWidth="0.35" />

      {/* 4 Costal scute pairs — flanking sides */}
      <ellipse cx="-5.5" cy="-3.5" rx="2.8" ry="2" fill="#43A047" stroke="#1B5E20" strokeWidth="0.3" />
      <ellipse cx="5.5" cy="-3.5" rx="2.8" ry="2" fill="#43A047" stroke="#1B5E20" strokeWidth="0.3" />
      <ellipse cx="-5.5" cy="-0.5" rx="3" ry="2" fill="#43A047" stroke="#1B5E20" strokeWidth="0.3" />
      <ellipse cx="5.5" cy="-0.5" rx="3" ry="2" fill="#43A047" stroke="#1B5E20" strokeWidth="0.3" />
      <ellipse cx="-5.5" cy="2.5" rx="3" ry="2" fill="#43A047" stroke="#1B5E20" strokeWidth="0.3" />
      <ellipse cx="5.5" cy="2.5" rx="3" ry="2" fill="#43A047" stroke="#1B5E20" strokeWidth="0.3" />
      <ellipse cx="-5" cy="5" rx="2.5" ry="1.8" fill="#43A047" stroke="#1B5E20" strokeWidth="0.3" />
      <ellipse cx="5" cy="5" rx="2.5" ry="1.8" fill="#43A047" stroke="#1B5E20" strokeWidth="0.3" />

      {/* Marginal scutes — small rim notches */}
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const ix = Math.cos(a) * 8.2;
        const iy = Math.sin(a) * 7;
        const ox = Math.cos(a) * 9.8;
        const oy = Math.sin(a) * 8.3;
        return <line key={i} x1={ix} y1={iy} x2={ox} y2={oy} stroke="#1B5E20" strokeWidth="0.3" opacity="0.6" />;
      })}

      {/* Shell 3D highlight */}
      <ellipse cx="-2" cy="-2" rx="4" ry="3" fill="#4CAF50" opacity="0.15" />

      {/* === Military helmet/visor on head === */}
      {/* Head — poking out front */}
      <ellipse cx="0" cy="10.5" rx="4" ry="3.5" fill="#8BC34A" stroke="#558B2F" strokeWidth="0.4" />
      {/* Neck */}
      <ellipse cx="0" cy="9" rx="3.2" ry="2.2" fill="#8BC34A" />

      {/* Helmet — military green, sits on top of head */}
      <ellipse cx="0" cy="10" rx="4.2" ry="2.2" fill="#556B2F" stroke="#3B4F1E" strokeWidth="0.4" />
      {/* Helmet brim */}
      <path d="M-4.2,10 Q-4.5,9 -3.5,8.5 L3.5,8.5 Q4.5,9 4.2,10" fill="#4A5F28" stroke="#3B4F1E" strokeWidth="0.25" />
      {/* Helmet star emblem */}
      <polygon points="0,9.2 0.4,10 1.2,10 0.5,10.5 0.7,11.3 0,10.8 -0.7,11.3 -0.5,10.5 -1.2,10 -0.4,10" fill="#FFD54F" opacity="0.8" />
      {/* Chin strap */}
      <path d="M-3,10.5 Q-3.5,12 -2,12.5" fill="none" stroke="#3B4F1E" strokeWidth="0.3" />
      <path d="M3,10.5 Q3.5,12 2,12.5" fill="none" stroke="#3B4F1E" strokeWidth="0.3" />

      {/* Eyes — determined look, peeking under helmet */}
      <circle cx="-1.8" cy="11.5" r="1.1" fill="white" stroke="#33691E" strokeWidth="0.25" />
      <circle cx="1.8" cy="11.5" r="1.1" fill="white" stroke="#33691E" strokeWidth="0.25" />
      <circle cx="-1.8" cy="11.7" r="0.55" fill="#1B5E20" />
      <circle cx="1.8" cy="11.7" r="0.55" fill="#1B5E20" />
      {/* Eye glints */}
      <circle cx="-1.4" cy="11.3" r="0.2" fill="white" opacity="0.9" />
      <circle cx="2.2" cy="11.3" r="0.2" fill="white" opacity="0.9" />
      {/* Determined brow line under helmet */}
      <path d="M-3,10.8 L-0.8,11" fill="none" stroke="#33691E" strokeWidth="0.3" />
      <path d="M3,10.8 L0.8,11" fill="none" stroke="#33691E" strokeWidth="0.3" />

      {/* Nostrils */}
      <circle cx="-0.5" cy="13" r="0.2" fill="#33691E" />
      <circle cx="0.5" cy="13" r="0.2" fill="#33691E" />
      {/* Determined smile */}
      <path d="M-1.2,13.5 Q0,14.5 1.2,13.5" fill="none" stroke="#33691E" strokeWidth="0.35" strokeLinecap="round" />

      {/* === Shield energy aura === */}
      <ellipse cx="0" cy="0" rx="12" ry="10.5" fill="none" stroke="#4CAF50" strokeWidth="0.4" opacity="0.4" className="dvir-shell-glow" />
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
  currentLevel = 1,
  tzurActive = false,
  sashaActive = false,
  dvirActive = false,
  sufrinActive = false,
  bouncingThreats = [],
}) {
  const viewport = getViewportForLevel(currentLevel);
  const visibleCities = useMemo(() => getVisibleCities(currentLevel), [currentLevel]);
  const visibleRegions = useMemo(() => getVisibleRegions(currentLevel), [currentLevel]);
  const visibleOrigins = useMemo(() => getVisibleThreatOrigins(currentLevel), [currentLevel]);

  // Build set of cities currently targeted by active threats (for warning glow + label pop-up)
  const activeThreatTargets = useMemo(() => {
    const targets = new Set();
    activeThreats.forEach((t) => {
      if (!t.intercepted && !t.held) targets.add(t.impact_zone);
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
            {/* Dvir shield dome gradient */}
            <radialGradient id="dvirShieldGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#A5D6A7" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#4CAF50" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.08" />
            </radialGradient>
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
              // Stack multi-word region names vertically to save horizontal space
              if (region.name === 'Otef Aza' || region.name === 'Golan Heights') {
                const words = region.name.split(' ');
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
                    <tspan x={labelP.x} dy="0">{words[0]}</tspan>
                    <tspan x={labelP.x} dy="3.2">{words[1]}</tspan>
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

            {/* Cities & bases — progressive reveal with tier-based labels */}
            {(() => {
              // Scale dots and labels based on viewport zoom
              const dotRadius = viewport.scale >= 2.0 ? 1.2 : viewport.scale >= 1.5 ? 1.0 : 0.7;
              const labelSize = viewport.scale >= 2.0 ? 1.8 : viewport.scale >= 1.5 ? 1.5 : 1.2;
              // Bases get larger labels/dots when they're the focus (L4)
              const baseDotRadius = currentLevel === 4 ? 1.0 : dotRadius;
              const baseLabelSize = currentLevel === 4 ? 1.6 : labelSize;

              // Visibility filtering:
              // - Tier 1 cities: always shown
              // - Tier 2 cities: shown when zoomed in or actively targeted
              // - Key bases (keyBase): always shown at L5+ (Ramat David, Palmachim, Nevatim)
              // - Other bases at L5+: hidden unless actively targeted (prevent clutter)
              const citiesToRender = Object.entries(visibleCities).filter(([name, city]) => {
                // At L5+, hide non-key bases unless being targeted (clutter control)
                if (city.isBase && currentLevel >= 5 && !city.keyBase && !activeThreatTargets.has(name)) return false;
                if (city.tier === 1) return true;
                if (viewport.scale >= 1.5) return true; // zoomed in (L1/L2)
                if (activeThreatTargets.has(name)) return true; // being targeted
                return false;
              });

              return citiesToRender.map(([name, city]) => {
                const p = mapToSVG(city.x, city.y, viewport);
                const flash = impactFlashes.find((f) => f.zone === name);

                // Base-specific colors (amber/gold) vs city colors (green)
                const isBase = city.isBase;
                const r = isBase ? baseDotRadius : dotRadius;
                const fontSize = isBase ? baseLabelSize : labelSize;
                let dotColor = isBase ? 'rgba(234, 179, 8, 0.4)' : 'rgba(0, 255, 136, 0.3)';
                let strokeColor = isBase ? 'rgba(234, 179, 8, 0.8)' : 'rgba(0, 255, 136, 0.7)';
                let labelColor = isBase ? 'rgba(234, 179, 8, 0.85)' : 'rgba(0, 255, 136, 0.7)';

                // Targeted warning — lights up immediately when a threat is heading here
                const isTargeted = activeThreatTargets.has(name);
                if (isTargeted && !flash) {
                  dotColor = 'rgba(239, 68, 68, 0.6)';
                  strokeColor = 'rgba(239, 68, 68, 0.9)';
                  labelColor = 'rgba(239, 68, 68, 0.95)';
                }

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

                // Per-city label direction offset
                const offset = LABEL_OFFSETS[city.labelDir || 'e'];

                return (
                  <g key={name}>
                    {/* Pulsing danger ring when targeted */}
                    {isTargeted && !flash && (
                      <circle
                        cx={p.x} cy={p.y} r={r + 2.0}
                        fill="none" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="0.4"
                        className="radar-pulse"
                      />
                    )}
                    {isBase ? (
                      // Diamond marker for military bases
                      <rect
                        x={p.x - r} y={p.y - r}
                        width={r * 2} height={r * 2}
                        fill={dotColor}
                        stroke={strokeColor}
                        strokeWidth="0.4"
                        transform={`rotate(45, ${p.x}, ${p.y})`}
                      />
                    ) : (
                      // Circle marker for cities
                      <circle
                        cx={p.x} cy={p.y} r={r}
                        fill={dotColor}
                        stroke={strokeColor}
                        strokeWidth="0.3"
                      />
                    )}
                    <text
                      x={p.x + offset.dx} y={p.y + offset.dy}
                      fill={labelColor}
                      fontSize={fontSize}
                      fontFamily={currentLevel === 7 && city.he ? 'Arial, sans-serif' : 'monospace'}
                      textAnchor={offset.anchor}
                      fontWeight={isBase ? 'bold' : 'normal'}
                    >
                      {currentLevel === 7 && city.he ? city.he : (
                        currentLevel === 4 && isBase
                          ? (name.includes('AFB') ? name.replace('AFB', 'Base') : name + ' Base')
                          : name
                      )}
                    </text>
                  </g>
                );
              });
            })()}

            {/* Battery markers — single for L1-4, multiple for L5-7 */}
            {(() => {
              const entry = getBatteryForLevel(currentLevel);
              if (!entry) return null;
              const batteries = Array.isArray(entry) ? entry : [entry];
              return batteries.map((battery, i) => {
                const hq = mapToSVG(battery.x, battery.y, viewport);
                return (
                  <g key={`bat-${i}`}>
                    <rect
                      x={hq.x - 1.5} y={hq.y - 1.5}
                      width="3" height="3"
                      fill="none" stroke="#22c55e" strokeWidth="0.4" opacity="0.7"
                      transform={`rotate(45, ${hq.x}, ${hq.y})`}
                    />
                    {/* Battery label */}
                    <text
                      x={hq.x} y={hq.y + 3.5}
                      fill="#22c55e" fontSize={battery.label.length > 10 ? '1.6' : '2.2'} fontFamily="monospace"
                      textAnchor="middle" dominantBaseline="hanging"
                      opacity="0.7" fontWeight="bold"
                    >
                      {battery.label}
                    </text>
                  </g>
                );
              });
            })()}

            {/* === Impact Effects Layer === */}
            {impactFlashes.map((flash) => {
              if (flash.type === 'intercept' && flash.threatType === 'hypersonic') return <HypersonicInterceptEffect key={flash.id} flash={flash} viewport={viewport} />;
              if (flash.type === 'intercept') return <InterceptEffect key={flash.id} flash={flash} viewport={viewport} />;
              if (flash.type === 'city_hit') return <CityHitEffect key={flash.id} flash={flash} viewport={viewport} />;
              if (flash.type === 'ground_impact') return <GroundImpactEffect key={flash.id} flash={flash} viewport={viewport} />;
              if (flash.type === 'shield_deflect') return <ShieldDeflectEffect key={flash.id} flash={flash} viewport={viewport} />;
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
                  {/* Invisible hit target — large for easy clicking */}
                  {!threat.intercepted && !threat.held && (
                    <circle cx={svgPos.x} cy={svgPos.y} r="8" fill="transparent" stroke="none" />
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

            {/* === Teddy Bear + Bullet Tracers (Tzur Cheat Code) === */}
            {tzurActive && (() => {
              const urgentThreats = activeThreats.filter(t => !t.intercepted && !t.held);
              // Glock muzzle: ~11 SVG units from bear center at -24° in bear's local frame
              const GLOCK_AIM_RAD = -0.415; // -23.8° natural glock aim direction
              const MUZZLE_DIST = 11.04;

              let rotation = 0;
              let muzzleX = 50 + MUZZLE_DIST * Math.cos(GLOCK_AIM_RAD);
              let muzzleY = 50 + MUZZLE_DIST * Math.sin(GLOCK_AIM_RAD);

              if (urgentThreats.length > 0) {
                // Rotate bear so glock faces the most urgent threat
                const mostUrgent = [...urgentThreats].sort((a, b) => a.timeLeft - b.timeLeft)[0];
                const pos = getBlipPosition(mostUrgent);
                const svgPos = mapToSVG(pos.x, pos.y, viewport);
                const targetAngle = Math.atan2(svgPos.y - 50, svgPos.x - 50);
                rotation = (targetAngle - GLOCK_AIM_RAD) * 180 / Math.PI;
                muzzleX = 50 + MUZZLE_DIST * Math.cos(targetAngle);
                muzzleY = 50 + MUZZLE_DIST * Math.sin(targetAngle);
              }

              return (
                <g>
                  {/* Bullet tracers from glock muzzle to each active threat */}
                  {urgentThreats.map(threat => {
                    const tpos = getBlipPosition(threat);
                    const tsvg = mapToSVG(tpos.x, tpos.y, viewport);
                    return (
                      <g key={`bullet-${threat.id}`}>
                        {/* Glow trail (wide, faint) */}
                        <line x1={muzzleX} y1={muzzleY} x2={tsvg.x} y2={tsvg.y}
                          stroke="#f59e0b" strokeWidth="0.8" opacity="0.3" />
                        {/* Core trail (thin, bright) */}
                        <line x1={muzzleX} y1={muzzleY} x2={tsvg.x} y2={tsvg.y}
                          stroke="#fbbf24" strokeWidth="0.3" opacity="0.8" />
                        {/* Target dot */}
                        <circle cx={tsvg.x} cy={tsvg.y} r="1.5" fill="#f59e0b" opacity="0.5"
                          className="sasha-target-dot" />
                      </g>
                    );
                  })}
                  {/* Bear SVG on top of tracers */}
                  <g className="tzur-bear-sequence">
                    <TeddyBearSVG cx={50} cy={50} rotation={rotation} />
                  </g>
                </g>
              );
            })()}

            {/* === Siamese Cat + Laser Beams (Sasha Cheat Code) === */}
            {sashaActive && (
              <g>
                {/* Laser beams from cat's eyes to each active threat */}
                {activeThreats.filter((t) => !t.intercepted && !t.held).map((threat) => {
                  const pos = getBlipPosition(threat);
                  const svgPos = mapToSVG(pos.x, pos.y, viewport);
                  // Cat eye positions in SVG coords: center(50,50), scale 0.5, eyes at local (-2,-5) and (2,-5)
                  const leftEye = { x: 50 + (-2 * 0.5), y: 50 + (-5 * 0.5) };
                  const rightEye = { x: 50 + (2 * 0.5), y: 50 + (-5 * 0.5) };
                  return (
                    <g key={`laser-${threat.id}`} className="sasha-laser-beam">
                      {/* Glow beam (wide, faint) */}
                      <line x1={leftEye.x} y1={leftEye.y} x2={svgPos.x} y2={svgPos.y} stroke="#06b6d4" strokeWidth="0.8" opacity="0.3" />
                      <line x1={rightEye.x} y1={rightEye.y} x2={svgPos.x} y2={svgPos.y} stroke="#06b6d4" strokeWidth="0.8" opacity="0.3" />
                      {/* Core beam (thin, bright) */}
                      <line x1={leftEye.x} y1={leftEye.y} x2={svgPos.x} y2={svgPos.y} stroke="#22d3ee" strokeWidth="0.3" opacity="0.9" />
                      <line x1={rightEye.x} y1={rightEye.y} x2={svgPos.x} y2={svgPos.y} stroke="#22d3ee" strokeWidth="0.3" opacity="0.9" />
                      {/* Target dot */}
                      <circle cx={svgPos.x} cy={svgPos.y} r="1.5" fill="#06b6d4" opacity="0.5" className="sasha-target-dot" />
                    </g>
                  );
                })}
                {/* Cat SVG on top of beams */}
                <g className="sasha-cat-sequence">
                  <SiameseCatSVG cx={50} cy={50} />
                </g>
              </g>
            )}

            {/* === Turtle + Shield Domes (Dvir Cheat Code) === */}
            {dvirActive && (
              <g>
                {/* Turtle shell shields over each city */}
                {Object.entries(visibleCities).map(([name, city]) => {
                  const p = mapToSVG(city.x, city.y, viewport);
                  const r = viewport.scale >= 2.0 ? 2.2 : viewport.scale >= 1.5 ? 1.8 : 1.4;
                  return (
                    <g key={`shield-${name}`} className="dvir-shield-dome">
                      <TurtleShellDome cx={p.x} cy={p.y} r={r} />
                    </g>
                  );
                })}
                {/* Turtle SVG at center */}
                <g className="dvir-turtle-sequence">
                  <TurtleSVG cx={50} cy={50} />
                </g>
              </g>
            )}

            {/* === Sufrin Portrait + Beard Strands (Sufrin Cheat Code) === */}
            {sufrinActive && (
              <g>
                {/* Wiry beard hair strands from beard area to each active threat */}
                {activeThreats.filter((t) => !t.intercepted && !t.held).map((threat) => {
                  const { x, y } = getBlipPosition(threat);
                  const svgPos = mapToSVG(x, y, viewport);

                  // Hash threat id to a stable number for deterministic strand positions
                  const tid = typeof threat.id === 'number' ? Math.abs(threat.id) :
                    [...String(threat.id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) & 0x7fffffff, 0);

                  // Generate 7 beard hair strands per threat — rim-lit dark hair technique
                  // Wider warm-brown outer glow underneath, thin near-black hair on top
                  const strandPaths = [];

                  for (let s = 0; s < 7; s++) {
                    // Deterministic pseudo-random seeds per strand
                    const seed1 = Math.abs((tid * 2654435 + s * 40503) & 0x7fffffff) % 1000;
                    const seed2 = Math.abs((tid * 1597334 + s * 73856) & 0x7fffffff) % 1000;

                    // Origin: beard tip area at bottom of face image
                    // Image is 28x28 at (36,36). Beard tips: x 44-56, y 60-64
                    const beardX = 44 + (seed1 % 12);
                    const beardY = 60 + (seed2 % 4);

                    // Direction vector and perpendicular
                    const dx = svgPos.x - beardX;
                    const dy = svgPos.y - beardY;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const perpX = -dy / dist;
                    const perpY = dx / dist;

                    // Gentle wavy curls — fewer, wider curves for natural hair look
                    const numCurls = 5 + (seed1 % 3);
                    const curlSize = 1.2 + (seed2 % 15) / 10;
                    let pathD = `M ${beardX.toFixed(1)} ${beardY.toFixed(1)}`;

                    for (let w = 0; w < numCurls; w++) {
                      const tCtrl = (w + 0.5) / numCurls;
                      const tEnd = (w + 1) / numCurls;
                      const side = (w % 2 === 0) ? 1 : -1;
                      // Smooth envelope — gentle wave, not tight zigzag
                      const envelope = Math.sin(tCtrl * Math.PI) * 0.5 + 0.5;
                      const amp = curlSize * envelope;

                      const cpX = beardX + dx * tCtrl + perpX * side * amp;
                      const cpY = beardY + dy * tCtrl + perpY * side * amp;
                      const ptX = beardX + dx * tEnd;
                      const ptY = beardY + dy * tEnd;

                      pathD += ` Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${ptX.toFixed(1)} ${ptY.toFixed(1)}`;
                    }

                    strandPaths.push(pathD);
                  }

                  // Rim-lit colors: warm brown outer glow, near-black inner hair
                  const outerColors = ['#3d1c00', '#2a1a10', '#4a2800', '#3d1c00', '#2a1a10', '#4a2800', '#3d1c00'];
                  const innerColors = ['#0a0500', '#080300', '#0c0600', '#0a0500', '#080300', '#0c0600', '#0a0500'];
                  const outerWidths = [1.4, 1.2, 1.6, 1.5, 1.3, 1.2, 1.4];
                  const innerWidths = [0.5, 0.4, 0.6, 0.55, 0.45, 0.4, 0.5];

                  return (
                    <g key={`beard-${threat.id}`} className="sufrin-beard-strand">
                      {/* Outer glow layer — warm brown rim light */}
                      {strandPaths.map((pathD, i) => (
                        <path
                          key={`outer-${i}`}
                          d={pathD}
                          fill="none"
                          stroke={outerColors[i]}
                          strokeWidth={outerWidths[i]}
                          opacity={0.6}
                          strokeLinecap="round"
                        />
                      ))}
                      {/* Inner hair layer — near-black dark strands */}
                      {strandPaths.map((pathD, i) => (
                        <path
                          key={`inner-${i}`}
                          d={pathD}
                          fill="none"
                          stroke={innerColors[i]}
                          strokeWidth={innerWidths[i]}
                          opacity={0.9}
                          strokeLinecap="round"
                        />
                      ))}
                      <circle cx={svgPos.x} cy={svgPos.y} r="1.5" fill="#3d1c00" opacity="0.4" className="sufrin-target-dot" />
                    </g>
                  );
                })}
                {/* Portrait — raw image, no frame, 2x larger */}
                <g className="sufrin-portrait-sequence">
                  <image
                    href={`${import.meta.env.BASE_URL}images/sufrin.png`}
                    x={36} y={36} width={28} height={28}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>
              </g>
            )}

            {/* === Bouncing Threats (ricochet off turtle shells) === */}
            {bouncingThreats.map((bt) => {
              const impactSvg = mapToSVG(bt.x, bt.y, viewport);
              // Bounce direction: away from city (opposite of incoming direction)
              const dx = bt.x - bt.originX;
              const dy = bt.y - bt.originY;
              const len = Math.sqrt(dx * dx + dy * dy) || 1;
              // Bounce vector — reflect back along incoming path + upward bias
              const bounceX = (dx / len) * 15;
              const bounceY = (dy / len) * 15;
              const color = THREAT_COLORS[bt.type] || '#ef4444';
              return (
                <g key={bt.id} className="dvir-bounce-blip"
                  style={{ '--bounce-x': `${bounceX}px`, '--bounce-y': `${bounceY}px` }}>
                  {/* Bouncing blip — flies away from city */}
                  <circle cx={impactSvg.x} cy={impactSvg.y}
                    r={BLIP_RADIUS[bt.type] || 1.4}
                    fill={color} stroke="white" strokeWidth="0.3" />
                  {/* Bounce trail streak */}
                  <line x1={impactSvg.x} y1={impactSvg.y}
                    x2={impactSvg.x - bounceX * 0.3} y2={impactSvg.y - bounceY * 0.3}
                    stroke={color} strokeWidth="0.5" opacity="0.6" className="dvir-bounce-trail" />
                </g>
              );
            })}

          </g>
          {/* === End clipped map content === */}

          {/* Threat origin arcs — rendered ON TOP of clip, at the radar perimeter */}
          {visibleOrigins.map((origin) => (
            <ThreatOriginArc key={origin.name} origin={origin} viewport={viewport} currentLevel={currentLevel} />
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
