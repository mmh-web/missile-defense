import { useEffect, useRef } from 'react';
import { getLevelConfig, TOTAL_LEVELS } from '../config/threats.js';
import { playPerfectFanfare } from '../utils/soundEffects.js';

function StatRow({ label, value, color = 'text-gray-300' }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-800/50">
      <span className="text-xs text-gray-500 font-mono tracking-wider">{label}</span>
      <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}

function Stars({ count }) {
  return (
    <span className="text-yellow-400 tracking-wider">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

// Gold shimmer particles for perfect defense
function PerfectParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: H + Math.random() * 40,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(1.5 + Math.random() * 2.5),
      size: 1.5 + Math.random() * 3,
      alpha: 0.5 + Math.random() * 0.5,
      hue: 40 + Math.random() * 20, // gold range
      decay: 0.003 + Math.random() * 0.005,
    }));

    let raf;
    function animate() {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01; // slight gravity
        p.alpha -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${Math.max(0, p.alpha)})`;
        ctx.fill();
      });
      if (alive) raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default function LevelComplete({ levelStats, campaignStats, onNextLevel, onViewResults }) {
  const config = getLevelConfig(levelStats.level);
  const nextConfig = getLevelConfig(levelStats.level + 1);
  const isLastLevel = levelStats.level >= TOTAL_LEVELS;
  const isPerfect = levelStats.rating?.perfect;

  // Play fanfare once on mount if perfect
  const fanfarePlayed = useRef(false);
  useEffect(() => {
    if (isPerfect && !fanfarePlayed.current) {
      fanfarePlayed.current = true;
      playPerfectFanfare(0.7);
    }
  }, [isPerfect]);

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-y-auto">
      {isPerfect && <PerfectParticles />}
      <div className="max-w-2xl w-full py-8 px-4 relative z-10">
        {/* Perfect Defense Banner */}
        {isPerfect && (
          <div className="text-center mb-4 animate-pulse">
            <div
              className="inline-block px-6 py-2 rounded-lg border-2 font-mono font-bold text-lg tracking-[0.3em]"
              style={{
                borderColor: '#fbbf24',
                color: '#fbbf24',
                background: 'rgba(251, 191, 36, 0.08)',
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.2), 0 0 60px rgba(251, 191, 36, 0.1)',
                textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
              }}
            >
              ★ PERFECT DEFENSE ★
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`font-mono text-xs tracking-[0.4em] mb-2 ${isPerfect ? 'text-yellow-400' : 'text-green-400'}`}>
            &#10003; LEVEL {levelStats.level} COMPLETE
          </div>
          <h1 className={`text-2xl font-bold font-mono tracking-wider mb-1 ${isPerfect ? 'text-yellow-400' : 'text-green-400'}`}>
            LEVEL {levelStats.level}
          </h1>
          <div className={`h-px w-48 mx-auto mt-3 ${isPerfect ? 'bg-yellow-700' : 'bg-green-900'}`} />
        </div>

        {/* Rating */}
        <div className="text-center mb-6">
          <div className="text-2xl mb-1">
            <Stars count={levelStats.rating.stars} />
          </div>
          <div className={`text-sm font-mono tracking-widest ${isPerfect ? 'text-yellow-400' : 'text-gray-400'}`}>
            {levelStats.rating.label}
          </div>
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold font-mono text-green-400 tabular-nums">
            +{levelStats.score}
          </div>
          <div className="text-xs text-gray-500 font-mono tracking-wider mt-1">
            LEVEL SCORE
          </div>
        </div>

        {/* Stats */}
        <div className="border border-gray-800 rounded-lg p-4 mb-6 bg-gray-900/20">
          <StatRow label="THREATS INTERCEPTED" value={`${levelStats.correctIntercepts} / ${levelStats.populatedThreats}`}
            color={levelStats.correctIntercepts === levelStats.populatedThreats ? 'text-green-400' : 'text-yellow-400'} />
          <StatRow label="INTERCEPTORS SAVED" value={Object.values(levelStats.ammoRemaining).reduce((s, v) => s + v, 0)}
            color="text-cyan-400" />
          <StatRow label="SIRENS" value={levelStats.sirenCount}
            color={levelStats.sirenCount === 0 ? 'text-green-400' : 'text-red-400'} />
          <StatRow label="BEST STREAK" value={levelStats.bestStreak} color="text-yellow-400" />
          {levelStats.quizBonus > 0 && (
            <StatRow label="INTEL BONUS" value={`+${levelStats.quizBonus}`} color="text-cyan-300" />
          )}
          {levelStats.wrongIntercepts > 0 && (
            <StatRow label="WRONG SYSTEM" value={levelStats.wrongIntercepts} color="text-red-400" />
          )}
          {levelStats.wastedIntercepts > 0 && (
            <StatRow label="WASTED ON OPEN GROUND" value={levelStats.wastedIntercepts} color="text-yellow-500" />
          )}
        </div>

        {/* Campaign running total — always visible */}
        {campaignStats && (
          <div className="border border-green-900/50 rounded-lg p-5 mb-6 bg-green-950/20 text-center">
            <div className="text-xs text-gray-500 font-mono tracking-widest mb-2">CAMPAIGN TOTAL</div>
            <div className="text-5xl font-bold font-mono text-green-400 tabular-nums">
              {campaignStats.totalScore + levelStats.score}
            </div>
          </div>
        )}

        {/* Next Level Preview */}
        {!isLastLevel && nextConfig && (
          <div className="border border-gray-700 rounded-lg p-4 mb-6 bg-gray-900/20">
            <div className="text-lg font-bold font-mono text-gray-200 tracking-wider">
              NEXT: LEVEL {nextConfig.id}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="text-center">
          {isLastLevel ? (
            <button
              onClick={onViewResults}
              className="px-12 py-4 bg-green-900/30 border-2 border-green-500 text-green-400
                font-mono font-bold text-lg tracking-widest rounded-lg
                hover:bg-green-900/50 hover:border-green-300 hover:text-green-300
                hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
                transition-all active:scale-95 cursor-pointer"
            >
              VIEW RESULTS
            </button>
          ) : (
            <button
              onClick={onNextLevel}
              className="px-12 py-4 bg-green-900/30 border-2 border-green-500 text-green-400
                font-mono font-bold text-lg tracking-widest rounded-lg
                hover:bg-green-900/50 hover:border-green-300 hover:text-green-300
                hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
                transition-all active:scale-95 cursor-pointer"
            >
              NEXT LEVEL &#8594;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
