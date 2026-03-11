import { useEffect, useRef, memo } from 'react';

/**
 * VictoryAnimation — dramatic visual reward for zero-siren level completion.
 * Three variants rotated for variety:
 *   1: Iron Shield — expanding golden dome with shockwaves
 *   2: Skies Clear — radar transforms from dark to dawn sky
 *   3: Star Commander — constellation lines connect with starburst
 *
 * Renders as SVG <g> inside RadarDisplay's SVG.
 * Uses a ref-based approach to prevent React re-renders from resetting animations.
 * Key opacity values are set via JS setTimeout (CSS animation fill-mode unreliable
 * with Tailwind CSS 4's layer system for SVG elements).
 * Duration: ~6 seconds, then calls onComplete.
 */

const DURATION = 6000;

function getIronShieldSVG() {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15) * Math.PI / 180;
    const delay = 0.3 + i * 0.04;
    return `<circle cx="50" cy="50" r="0.8" fill="#fbbf24" class="victory-particle"
      style="animation-delay:${delay}s;--tx:${Math.cos(angle) * 52}px;--ty:${Math.sin(angle) * 52}px" />`;
  }).join('');

  const hexLines = [0, 60, 120, 180, 240, 300].map(angle =>
    `<line x1="50" y1="50" x2="${50 + Math.cos(angle * Math.PI / 180) * 48}" y2="${50 + Math.sin(angle * Math.PI / 180) * 48}"
      class="victory-hex-line" stroke="#fbbf24" stroke-width="0.15" />`
  ).join('');

  return `
    <circle cx="50" cy="50" r="3" class="victory-central-flash" fill="#fbbf24" />
    <circle cx="50" cy="50" r="8" class="victory-dome-ring victory-dome-ring-1" fill="none" stroke="#fbbf24" stroke-width="0.8" />
    <circle cx="50" cy="50" r="8" class="victory-dome-ring victory-dome-ring-2" fill="none" stroke="#f59e0b" stroke-width="0.5" />
    <circle cx="50" cy="50" r="8" class="victory-dome-ring victory-dome-ring-3" fill="none" stroke="#fcd34d" stroke-width="0.3" />
    ${hexLines}
    ${particles}
    <circle cx="50" cy="50" r="49" class="victory-golden-fill" fill="url(#victory-gold-gradient)" />
    <circle cx="50" cy="50" r="6" class="victory-starburst" fill="white" />
    <text x="50" y="47" text-anchor="middle" class="victory-text-main" fill="white" font-size="5" font-family="monospace" font-weight="bold" letter-spacing="0.5">IRON SHIELD</text>
    <text x="50" y="53" text-anchor="middle" class="victory-text-sub" fill="#fbbf24" font-size="2.5" font-family="monospace" font-weight="bold" letter-spacing="0.3">ALL THREATS NEUTRALIZED</text>
    <defs>
      <radialGradient id="victory-gold-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.4" />
        <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
      </radialGradient>
    </defs>
  `;
}

function getSkiesClearSVG() {
  const particles = Array.from({ length: 30 }, (_, i) => {
    const x = 10 + (i * 2.7) % 80;
    const delay = (i * 0.12) % 2;
    const size = 0.3 + (i % 3) * 0.2;
    const fill = i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#fbbf24' : '#86efac';
    return `<circle cx="${x}" cy="85" r="${size}" fill="${fill}" class="victory-rising-particle" style="animation-delay:${delay}s" />`;
  }).join('');

  const rays = [0, 30, 60, 90, 120, 150, 180].map(angle =>
    `<line x1="50" y1="15" x2="${50 + Math.cos((angle - 90) * Math.PI / 180) * 45}" y2="${15 + Math.sin((angle - 90) * Math.PI / 180) * 45}"
      class="victory-light-ray" stroke="#fbbf24" stroke-width="0.2" style="animation-delay:${angle * 0.005}s" />`
  ).join('');

  return `
    <circle cx="50" cy="50" r="49" class="victory-dawn-bg" fill="url(#victory-dawn-gradient)" />
    ${particles}
    <circle cx="50" cy="15" r="12" class="victory-sun-glow" fill="url(#victory-sun-gradient)" />
    ${rays}
    <text x="50" y="47" text-anchor="middle" class="victory-text-main" fill="white" font-size="5.5" font-family="monospace" font-weight="bold" letter-spacing="0.5">SKIES CLEAR</text>
    <text x="50" y="53" text-anchor="middle" class="victory-text-sub" fill="#86efac" font-size="2.5" font-family="monospace" font-weight="bold" letter-spacing="0.3">ZERO CIVILIAN ALERTS</text>
    <defs>
      <radialGradient id="victory-dawn-gradient" cx="50%" cy="20%" r="80%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35" />
        <stop offset="40%" stop-color="#ea580c" stop-opacity="0.15" />
        <stop offset="70%" stop-color="#1e3a5f" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#0a0e1a" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="victory-sun-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.7" />
        <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
      </radialGradient>
    </defs>
  `;
}

function getStarCommanderSVG() {
  const points = [
    [30, 25], [55, 20], [70, 30], [65, 50], [45, 55],
    [25, 45], [35, 35], [50, 40], [60, 65], [40, 70], [20, 60],
  ];
  const connections = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],
    [0,6],[6,7],[7,3],[4,9],[9,10],[10,5],
    [7,1],[8,3],[8,9],
  ];

  const lines = connections.map(([a, b], i) => {
    const [x1, y1] = points[a];
    const [x2, y2] = points[b];
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
      class="victory-constellation-line" stroke="#22c55e" stroke-width="0.3"
      stroke-dasharray="${len}" stroke-dashoffset="${len}"
      style="animation-delay:${i * 0.08}s;--line-len:${len}" />`;
  }).join('');

  const stars = points.map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="1.5" fill="#22c55e" class="victory-star-point" style="animation-delay:${0.3 + i * 0.1}s" />
     <circle cx="${x}" cy="${y}" r="3" fill="none" stroke="#22c55e" stroke-width="0.2" class="victory-star-ring" style="animation-delay:${0.5 + i * 0.1}s" />`
  ).join('');

  // Star polygon points
  const starPts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 8 : 4;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    starPts.push(`${50 + r * Math.cos(a)},${45 + r * Math.sin(a)}`);
  }

  return `
    ${lines}
    ${stars}
    <g class="victory-medal" style="opacity:0">
      <circle cx="50" cy="45" r="12" fill="url(#victory-medal-glow)" class="victory-medal-glow-circle" />
      <polygon points="${starPts.join(' ')}" fill="#fbbf24" stroke="#f59e0b" stroke-width="0.3" />
    </g>
    <text x="50" y="60" text-anchor="middle" class="victory-text-main" fill="white" font-size="4.5" font-family="monospace" font-weight="bold" letter-spacing="0.5">STAR COMMANDER</text>
    <text x="50" y="65" text-anchor="middle" class="victory-text-sub" fill="#22c55e" font-size="2.2" font-family="monospace" font-weight="bold" letter-spacing="0.3">FLAWLESS DEFENSE</text>
    <defs>
      <radialGradient id="victory-medal-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
      </radialGradient>
    </defs>
  `;
}

const ANIM_SVG = [getIronShieldSVG, getSkiesClearSVG, getStarCommanderSVG];

/**
 * JS-driven opacity timeline for key elements.
 * CSS animations handle decorative effects (particles, rings, etc).
 * Backdrop/text/medal use inline styles for reliable rendering.
 */
function applyJSTimeline(g) {
  const timers = [];
  const schedule = (ms, fn) => timers.push(setTimeout(fn, ms));

  // Backdrop: fade in over 600ms starting at 100ms
  const backdrop = g.querySelector('.victory-backdrop');
  if (backdrop) {
    backdrop.style.opacity = '0';
    backdrop.style.transition = 'opacity 0.6s ease-out';
    schedule(100, () => { backdrop.style.opacity = '0.95'; });
  }

  // Text: fade in with slight rise
  const textMain = g.querySelector('.victory-text-main');
  const textSub = g.querySelector('.victory-text-sub');
  if (textMain) {
    textMain.style.opacity = '0';
    textMain.style.transform = 'translateY(3px)';
    textMain.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    schedule(1500, () => { textMain.style.opacity = '1'; textMain.style.transform = 'translateY(0)'; });
  }
  if (textSub) {
    textSub.style.opacity = '0';
    textSub.style.transform = 'translateY(3px)';
    textSub.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    schedule(1800, () => { textSub.style.opacity = '1'; textSub.style.transform = 'translateY(0)'; });
  }

  // Medal (Star Commander): pop in at 1.2s
  const medal = g.querySelector('.victory-medal');
  if (medal) {
    medal.style.opacity = '0';
    medal.style.transform = 'scale(0) rotate(-30deg)';
    medal.style.transformBox = 'fill-box';
    medal.style.transformOrigin = 'center';
    medal.style.transition = 'opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    schedule(1200, () => { medal.style.opacity = '1'; medal.style.transform = 'scale(1) rotate(0deg)'; });
  }

  // Fade out entire group at end (delay matches DURATION - 1.5s)
  schedule(Math.max(4500, DURATION - 1500), () => {
    g.style.transition = 'opacity 0.8s ease-in';
    g.style.opacity = '0';
  });

  return timers;
}

const VictoryAnimation = memo(function VictoryAnimation({ variant = 1, onComplete }) {
  const gRef = useRef(null);

  // Store onComplete in a ref so the useEffect doesn't re-run when the callback changes
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!gRef.current) return;
    const getSVG = ANIM_SVG[(variant - 1) % 3] || ANIM_SVG[0];
    gRef.current.innerHTML = `
      <circle cx="50" cy="50" r="49" fill="black" class="victory-backdrop" />
      ${getSVG()}
    `;

    // Apply JS-driven timeline for reliable opacity control
    const timers = applyJSTimeline(gRef.current);

    // Play victory fanfare (variant-matched)
    const vIdx = ((variant - 1) % 3) + 1;
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/victory-${vIdx}.mp3`);
    audio.volume = 0.7;
    audio.play().catch(() => {}); // ignore autoplay restrictions

    // Complete callback
    const completeTimer = setTimeout(() => onCompleteRef.current?.(), DURATION);
    timers.push(completeTimer);

    return () => {
      timers.forEach(t => clearTimeout(t));
      audio.pause();
      audio.src = '';
    };
  }, [variant]); // only re-run if variant changes

  return <g ref={gRef} className="victory-animation-group" style={{ opacity: 1 }} />;
});

export default VictoryAnimation;
