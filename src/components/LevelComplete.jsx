import { useState, useEffect, useRef } from 'react';
import { getLevelConfig, TOTAL_LEVELS } from '../config/threats.js';
import { playPerfectFanfare } from '../utils/soundEffects.js';
import { saveScore } from '../utils/leaderboard.js';

// Hero image per level for the victory screen
const LEVEL_HERO_IMAGES = {
  1: 'ID5.jpeg',
  2: 'ID6.webp',
  3: 'ID8.avif',
  4: 'ID7.jpeg',
  5: 'ID5.jpeg',
  6: 'ID6.webp',
  7: 'ID5.jpeg',
};

function Stars({ count }) {
  return (
    <span className="tracking-wider" style={{ letterSpacing: '4px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < count ? '#eab308' : '#374151', fontSize: '24px' }}>★</span>
      ))}
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
      hue: 40 + Math.random() * 20,
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
        p.vy += 0.01;
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
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default function LevelComplete({ levelStats, campaignStats, effectiveTotalLevels, onNextLevel, onViewResults, teamName, onTeamNameChange }) {
  const config = getLevelConfig(levelStats.level);
  const isLastLevel = levelStats.level >= (effectiveTotalLevels || TOTAL_LEVELS);
  const isPerfect = levelStats.rating?.perfect;
  const basePath = import.meta.env.BASE_URL || '/missile-defense/';
  const heroImage = LEVEL_HERO_IMAGES[levelStats.level] || 'ID5.jpeg';

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const runningTotal = (campaignStats?.totalScore || 0) + levelStats.score;
  const canSave = teamName.length >= 1 && !saved && !saving;

  const doSave = async () => {
    setSaving(true);
    try {
      await saveScore({
        name: teamName,
        score: runningTotal,
        stars: levelStats.rating.stars,
        rating: levelStats.rating.label,
        gameMode: 'CAMPAIGN',
        levelsCompleted: levelStats.level,
        correctIntercepts: (campaignStats?.totalCorrectIntercepts || 0) + levelStats.correctIntercepts,
        sirenCount: (campaignStats?.totalSirens || 0) + levelStats.sirenCount,
        bestStreak: Math.max(campaignStats?.overallBestStreak || 0, levelStats.bestStreak),
      });
      setSaved(true);
    } catch (err) {
      console.warn('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    doSave();
  };

  // Auto-save when team name already exists
  const autoSaved = useRef(false);
  useEffect(() => {
    if (teamName.length >= 1 && !autoSaved.current && !saved && !saving) {
      autoSaved.current = true;
      doSave();
    }
  }, []);

  // Play fanfare once on mount if perfect
  const fanfarePlayed = useRef(false);
  useEffect(() => {
    if (isPerfect && !fanfarePlayed.current) {
      fanfarePlayed.current = true;
      playPerfectFanfare(0.7);
    }
  }, [isPerfect]);

  return (
    <div className="h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: '#0a0e1a' }}>
      {isPerfect && <PerfectParticles />}

      {/* Hero photo — top band */}
      <div className="absolute top-0 left-0 right-0 h-[280px] z-0"
        style={{
          background: `url('${basePath}images/${heroImage}') center 30% / cover no-repeat`,
        }}>
        <div className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              rgba(10,14,26,0.2) 0%,
              rgba(10,14,26,0.4) 40%,
              rgba(10,14,26,0.9) 75%,
              #0a0e1a 100%
            )`,
          }} />
      </div>

      <div className="relative z-10 w-full max-w-[520px] h-screen flex flex-col px-6 overflow-y-auto">
        {/* Victory header — overlaid on photo */}
        <div className="text-center pt-5 mb-2 flex-shrink-0">
          {/* Perfect Defense Banner */}
          {isPerfect && (
            <div className="mb-2 animate-pulse">
              <span className="inline-block font-mono text-[9px] tracking-[0.3em] px-3 py-1 rounded border-2"
                style={{
                  borderColor: '#fbbf24',
                  color: '#fbbf24',
                  background: 'rgba(251, 191, 36, 0.08)',
                  boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)',
                  textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                }}>
                ★ PERFECT DEFENSE ★
              </span>
            </div>
          )}

          <div className="inline-block font-mono text-[9px] tracking-[0.3em] px-3 py-1 rounded border mb-2.5"
            style={{
              color: isPerfect ? '#fbbf24' : '#22c55e',
              borderColor: isPerfect ? 'rgba(251,191,36,0.25)' : 'rgba(34,197,94,0.25)',
            }}>
            LEVEL {levelStats.level} COMPLETE
          </div>
          <div className="font-mono text-2xl font-black tracking-[0.15em] leading-tight"
            style={{
              color: isPerfect ? '#fbbf24' : '#22c55e',
              textShadow: `0 0 40px ${isPerfect ? 'rgba(251,191,36,0.3)' : 'rgba(34,197,94,0.3)'}`,
            }}>
            ALL CLEAR
          </div>
          <div className="font-mono text-[11px] tracking-[0.15em] mt-1"
            style={{ color: isPerfect ? 'rgba(251,191,36,0.44)' : 'rgba(34,197,94,0.44)' }}>
            {config?.name?.toUpperCase() || `LEVEL ${levelStats.level}`}
          </div>
        </div>

        {/* Score + Stars */}
        <div className="text-center py-3 mb-2 flex-shrink-0">
          <div className="font-mono text-[52px] font-black leading-none"
            style={{
              color: isPerfect ? '#fbbf24' : '#22c55e',
              textShadow: `0 0 30px ${isPerfect ? 'rgba(251,191,36,0.25)' : 'rgba(34,197,94,0.25)'}`,
            }}>
            {levelStats.score}
          </div>
          <div className="font-mono text-[10px] text-gray-500 tracking-[0.2em] mt-1">LEVEL SCORE</div>
          <div className="mt-1.5">
            <Stars count={levelStats.rating.stars} />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5 flex-shrink-0">
          <div className="text-center py-2 rounded-lg"
            style={{ background: 'rgba(17,24,39,0.5)', border: '1px solid #1e2736' }}>
            <div className="font-mono text-xl font-black text-green-400">{levelStats.correctIntercepts}</div>
            <div className="font-mono text-[8px] text-gray-500 tracking-[0.15em] mt-1">INTERCEPTS</div>
          </div>
          <div className="text-center py-2 rounded-lg"
            style={{ background: 'rgba(17,24,39,0.5)', border: '1px solid #1e2736' }}>
            <div className="font-mono text-xl font-black text-green-400">{levelStats.correctHolds || 0}</div>
            <div className="font-mono text-[8px] text-gray-500 tracking-[0.15em] mt-1">CORRECT HOLDS</div>
          </div>
          <div className="text-center py-2 rounded-lg"
            style={{ background: 'rgba(17,24,39,0.5)', border: '1px solid #1e2736' }}>
            <div className={`font-mono text-xl font-black ${levelStats.sirenCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {levelStats.sirenCount}
            </div>
            <div className="font-mono text-[8px] text-gray-500 tracking-[0.15em] mt-1">SIRENS</div>
          </div>
          <div className="text-center py-2 rounded-lg"
            style={{ background: 'rgba(17,24,39,0.5)', border: '1px solid #1e2736' }}>
            <div className="font-mono text-xl font-black text-orange-400">{levelStats.bestStreak}</div>
            <div className="font-mono text-[8px] text-gray-500 tracking-[0.15em] mt-1">BEST STREAK</div>
          </div>
        </div>

        {/* Achievement Badges */}
        {(() => {
          const isIronWall = !isPerfect && levelStats.sirenCount === 0;
          const hasStreakBadge = levelStats.bestStreak >= 10;
          const isIntelMaster = levelStats.quizBonus >= 500;
          const totalAmmoRemaining = Object.values(levelStats.ammoRemaining).reduce((s, v) => s + v, 0);
          const totalAmmoStart = Object.values(config.ammo).reduce((s, v) => s + v, 0);
          const isEfficient = totalAmmoRemaining >= totalAmmoStart * 0.5;
          const badges = [];
          if (isIronWall) badges.push({ label: 'IRON WALL', icon: '\u{1F6E1}\uFE0F', border: '#3b82f6', text: '#60a5fa', bg: 'rgba(59, 130, 246, 0.08)' });
          if (hasStreakBadge) badges.push({ label: `${levelStats.bestStreak}x STREAK`, icon: '\u{1F525}', border: '#f97316', text: '#fb923c', bg: 'rgba(249, 115, 22, 0.08)' });
          if (isIntelMaster) badges.push({ label: 'INTEL MASTER', icon: '\u{1F4E1}', border: '#06b6d4', text: '#22d3ee', bg: 'rgba(6, 182, 212, 0.08)' });
          if (isEfficient) badges.push({ label: 'EFFICIENT', icon: '\u{1F3AF}', border: '#22c55e', text: '#4ade80', bg: 'rgba(34, 197, 94, 0.08)' });
          if (badges.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-2 mb-2.5 justify-center flex-shrink-0">
              {badges.map((badge, i) => (
                <div
                  key={badge.label}
                  className="achievement-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs tracking-wider"
                  style={{
                    borderColor: badge.border,
                    color: badge.text,
                    background: badge.bg,
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <span>{badge.icon}</span> {badge.label}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Tactical debrief */}
        <div className="px-3.5 py-2.5 rounded-lg mb-2.5 flex-shrink-0"
          style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.12)',
          }}>
          <div className="font-mono text-[9px] tracking-[0.2em] mb-1"
            style={{ color: 'rgba(34,197,94,0.38)' }}>
            TACTICAL DEBRIEF
          </div>
          <div className="font-mono text-xs text-gray-400 leading-relaxed space-y-0.5">
            {levelStats.correctIntercepts > 0 && (
              <p>
                {levelStats.correctIntercepts === levelStats.populatedThreats
                  ? <>Your <strong className="text-green-400">{levelStats.correctIntercepts} intercepts</strong> neutralized all incoming threats.</>
                  : <>{levelStats.correctIntercepts} of {levelStats.populatedThreats} threats intercepted.</>}
              </p>
            )}
            {levelStats.correctHolds > 0 && (
              <p>
                Your <strong className="text-green-400">{levelStats.correctHolds} correct holds</strong> saved ~${(levelStats.correctHolds * 50).toLocaleString()}K in interceptors — real Iron Dome operators make this same call dozens of times per hour.
              </p>
            )}
            {levelStats.sirenCount > 0 && (
              <p className="text-red-400/80">
                {levelStats.sirenCount} civilian area{levelStats.sirenCount !== 1 ? 's' : ''} hit.
              </p>
            )}
          </div>
        </div>

        {/* Cheat code hint — L2 or L3 */}
        {(levelStats.level === 2 || levelStats.level === 3) && (
          <div className="text-center mb-2 flex-shrink-0">
            <p className="text-[10px] font-mono text-gray-600 tracking-wider italic opacity-60">
              {levelStats.level === 2
                ? '[ CLASSIFIED: Field operators report unusual keyboard sequences activate emergency protocols... ]'
                : '[ CLASSIFIED: Type HACK during gameplay for available protocols ]'}
            </p>
          </div>
        )}

        {/* Campaign progress bar */}
        {campaignStats && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2.5 flex-shrink-0"
            style={{ background: 'rgba(17,24,39,0.5)', border: '1px solid #1e2736' }}>
            <span className="font-mono text-[10px] text-gray-500 tracking-[0.15em] whitespace-nowrap">CAMPAIGN</span>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: '#1f2937' }}>
              <div className="h-full rounded-full" style={{
                width: `${Math.min(100, (levelStats.level / (effectiveTotalLevels || TOTAL_LEVELS)) * 100)}%`,
                background: '#22c55e',
              }} />
            </div>
            <span className="font-mono text-xs text-green-400 font-bold whitespace-nowrap">
              {(campaignStats.totalScore + levelStats.score).toLocaleString()} PTS
            </span>
          </div>
        )}

        {/* Save Score */}
        <div className="mb-2.5 px-3 py-2 rounded-lg flex-shrink-0"
          style={{ background: 'rgba(17,24,39,0.5)', border: '1px solid #1e2736' }}>
          {saved ? (
            <div className="text-center font-mono text-xs text-green-500 tracking-wider">
              ✓ {teamName} — SCORE SAVED
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <input
                type="text"
                maxLength={10}
                value={teamName}
                onChange={(e) => onTeamNameChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="TEAM NAME"
                className="w-36 px-2 py-1.5 bg-gray-900 border border-green-800 rounded font-mono text-sm
                  text-center text-green-400 tracking-widest uppercase
                  focus:border-green-500 focus:outline-none
                  placeholder:text-gray-700"
              />
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`px-4 py-1.5 rounded font-mono text-xs font-bold tracking-wider border transition-all
                  ${canSave
                    ? 'border-green-500 bg-green-900/30 text-green-400 cursor-pointer hover:bg-green-900/50 active:scale-95'
                    : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                  }`}
              >
                {saving ? 'SAVING...' : 'SAVE SCORE'}
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-2.5 py-3 mt-auto flex-shrink-0">
          {isLastLevel ? (
            <button
              onClick={onViewResults}
              className="px-7 py-2.5 font-mono text-xs font-bold tracking-[0.15em] rounded-lg
                cursor-pointer transition-all active:scale-95
                hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
              style={{
                background: 'rgba(22,101,52,0.25)',
                border: '1px solid #15803d',
                color: '#4ade80',
              }}
            >
              VIEW RESULTS ▸
            </button>
          ) : (
            <>
              <button
                onClick={onNextLevel}
                className="px-7 py-2.5 font-mono text-xs font-bold tracking-[0.15em] rounded-lg
                  cursor-pointer transition-all active:scale-95
                  hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
                style={{
                  background: 'rgba(22,101,52,0.25)',
                  border: '1px solid #15803d',
                  color: '#4ade80',
                }}
              >
                NEXT LEVEL ▸
              </button>
              {isLastLevel === false && (
                <button
                  onClick={onViewResults}
                  className="px-7 py-2.5 font-mono text-xs font-bold tracking-[0.15em] rounded-lg
                    cursor-pointer transition-all active:scale-95"
                  style={{
                    background: 'rgba(55,65,81,0.2)',
                    border: '1px solid #4b5563',
                    color: '#9ca3af',
                  }}
                >
                  END CAMPAIGN
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
