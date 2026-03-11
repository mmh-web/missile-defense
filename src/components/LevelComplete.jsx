import { useState, useEffect, useRef } from 'react';
import { getLevelConfig, TOTAL_LEVELS } from '../config/threats.js';
import { playPerfectFanfare } from '../utils/soundEffects.js';
import { saveScore } from '../utils/leaderboard.js';

function ScoreRow({ label, stat, points, color = 'text-gray-300', pointsColor = 'text-green-400' }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-800/50">
      <span className="text-[11px] text-gray-500 font-mono tracking-wider">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-bold font-mono ${color}`}>{stat}</span>
        <span className={`text-xs font-mono ${pointsColor} w-14 text-right`}>{points > 0 ? `+${points}` : points}</span>
      </div>
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

export default function LevelComplete({ levelStats, campaignStats, effectiveTotalLevels, onNextLevel, onViewResults, teamName, onTeamNameChange }) {
  const config = getLevelConfig(levelStats.level);
  const nextConfig = getLevelConfig(levelStats.level + 1);
  const isLastLevel = levelStats.level >= (effectiveTotalLevels || TOTAL_LEVELS);
  const isPerfect = levelStats.rating?.perfect;

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const runningTotal = (campaignStats?.totalScore || 0) + levelStats.score;
  const canSave = teamName.length >= 1 && !saved && !saving;

  const handleSave = async () => {
    if (!canSave) return;
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
      <div className="max-w-2xl w-full py-3 lg:py-4 px-4 relative z-10">
        {/* Perfect Defense Banner */}
        {isPerfect && (
          <div className="text-center mb-2 animate-pulse">
            <div
              className="inline-block px-6 py-1.5 rounded-lg border-2 font-mono font-bold text-lg tracking-[0.3em]"
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

        {/* Header + Rating + Score — condensed into one block */}
        <div className="text-center mb-3">
          <div className={`font-mono text-xs tracking-[0.4em] mb-1 ${isPerfect ? 'text-yellow-400' : 'text-green-400'}`}>
            &#10003; LEVEL {levelStats.level} COMPLETE
          </div>
          <div className="flex items-center justify-center gap-4 mb-1">
            <h1 className={`text-2xl font-bold font-mono tracking-wider ${isPerfect ? 'text-yellow-400' : 'text-green-400'}`}>
              LEVEL {levelStats.level}
            </h1>
            <span className="text-gray-700">|</span>
            <span className="text-xl">
              <Stars count={levelStats.rating.stars} />
            </span>
            <span className={`text-xs font-mono tracking-widest ${isPerfect ? 'text-yellow-400' : 'text-gray-400'}`}>
              {levelStats.rating.label}
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-green-400 tabular-nums">
            +{levelStats.score}
          </div>
          <div className="text-[10px] text-gray-500 font-mono tracking-wider">
            LEVEL SCORE
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="border border-gray-800 rounded-lg p-3 mb-3 bg-gray-900/20">
          <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-gray-700">
            <span className="text-[10px] text-gray-600 font-mono tracking-widest">SCORE BREAKDOWN</span>
            <span className="text-[10px] text-gray-600 font-mono tracking-widest">PTS</span>
          </div>
          <ScoreRow label="THREATS INTERCEPTED"
            stat={`${levelStats.correctIntercepts} / ${levelStats.populatedThreats}`}
            points={levelStats.correctIntercepts * 100}
            color={levelStats.correctIntercepts === levelStats.populatedThreats ? 'text-green-400' : 'text-yellow-400'} />
          <ScoreRow label="INTERCEPTORS SAVED"
            stat={levelStats.creditableAmmo}
            points={levelStats.creditableAmmo * 250}
            color="text-cyan-400" />
          <ScoreRow label="BEST STREAK"
            stat={levelStats.bestStreak}
            points={levelStats.bestStreak * 25}
            color="text-yellow-400" />
          {levelStats.quizBonus > 0 && (
            <ScoreRow label="INTEL BONUS"
              stat={`${levelStats.quizBonus / 250}/2`}
              points={levelStats.quizBonus}
              color="text-cyan-300" />
          )}
          {levelStats.sirenCount > 0 && (
            <ScoreRow label="SIRENS"
              stat={levelStats.sirenCount}
              points={levelStats.sirenCount * -100}
              color="text-red-400"
              pointsColor="text-red-400" />
          )}
          {levelStats.sirenCount === 0 && (
            <ScoreRow label="SIRENS"
              stat="0"
              points={0}
              color="text-green-400"
              pointsColor="text-green-500" />
          )}
          {levelStats.wrongIntercepts > 0 && (
            <ScoreRow label="WRONG SYSTEM"
              stat={levelStats.wrongIntercepts}
              points={0}
              color="text-red-400"
              pointsColor="text-gray-600" />
          )}
          {levelStats.wastedIntercepts > 0 && (
            <ScoreRow label="WASTED ON OPEN GROUND"
              stat={levelStats.wastedIntercepts}
              points={0}
              color="text-yellow-500"
              pointsColor="text-gray-600" />
          )}
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
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
              {badges.map((badge, i) => (
                <div
                  key={badge.label}
                  className="achievement-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs tracking-wider"
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

        {/* ED2: Tactical Debrief — connect gameplay to real-world learning */}
        <div className="border border-gray-700/50 rounded-lg p-3 mb-3 bg-gray-900/30">
          <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1.5">TACTICAL DEBRIEF</div>
          <div className="space-y-1 text-xs font-mono text-gray-400">
            {levelStats.correctIntercepts > 0 && (
              <p>
                {levelStats.correctIntercepts === levelStats.populatedThreats
                  ? `All ${levelStats.correctIntercepts} incoming threats neutralized — Iron Dome's real-world success rate is 90%+.`
                  : `${levelStats.correctIntercepts} of ${levelStats.populatedThreats} threats intercepted.`}
              </p>
            )}
            {levelStats.correctHolds > 0 && (
              <p>
                {levelStats.correctHolds} correct hold-fire decision{levelStats.correctHolds !== 1 ? 's' : ''} — saved ~${(levelStats.correctHolds * 50).toLocaleString()}K in interceptor costs.
              </p>
            )}
            {levelStats.wastedIntercepts > 0 && (
              <p className="text-yellow-500/80">
                {levelStats.wastedIntercepts} interceptor{levelStats.wastedIntercepts !== 1 ? 's' : ''} wasted on open ground — each costs ~$50K.
              </p>
            )}
            {levelStats.wrongIntercepts > 0 && (
              <p className="text-red-400/80">
                {levelStats.wrongIntercepts} wrong system attempt{levelStats.wrongIntercepts !== 1 ? 's' : ''} — each interceptor type is designed for a specific altitude and speed envelope.
              </p>
            )}
            {levelStats.sirenCount > 0 && (
              <p className="text-red-400/80">
                {levelStats.sirenCount} civilian area{levelStats.sirenCount !== 1 ? 's' : ''} hit — each Tzeva Adom activates a 15-second warning siren.
              </p>
            )}
          </div>
        </div>

        {/* E3: Cheat code hint — subtle tease on L2 or L3 complete */}
        {(levelStats.level === 2 || levelStats.level === 3) && (
          <div className="text-center mb-2">
            <p className="text-[10px] font-mono text-gray-600 tracking-wider italic opacity-60">
              {levelStats.level === 2
                ? '[ CLASSIFIED: Field operators report unusual keyboard sequences activate emergency protocols... ]'
                : '[ CLASSIFIED: Type HACK during gameplay for available protocols ]'}
            </p>
          </div>
        )}

        {/* Campaign running total — always visible */}
        {campaignStats && (
          <div className="border border-green-900/50 rounded-lg p-3 mb-3 bg-green-950/20 text-center">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1">CAMPAIGN TOTAL</div>
            <div className="text-4xl font-bold font-mono text-green-400 tabular-nums">
              {campaignStats.totalScore + levelStats.score}
            </div>
          </div>
        )}

        {/* Save Score (mid-campaign) */}
        <div className="mb-3 p-3 border border-gray-800 rounded-lg bg-gray-900/20">
          <div className="flex items-center justify-center gap-3">
            <input
              type="text"
              maxLength={10}
              value={teamName}
              onChange={(e) => onTeamNameChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="NAME"
              disabled={saved}
              className="w-36 px-2 py-1.5 bg-gray-900 border border-green-800 rounded font-mono text-sm
                text-center text-green-400 tracking-widest uppercase
                focus:border-green-500 focus:outline-none
                disabled:opacity-50 disabled:cursor-not-allowed
                placeholder:text-gray-700"
            />
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`px-4 py-1.5 rounded font-mono text-xs font-bold tracking-wider border transition-all
                ${saved
                  ? 'border-green-700 bg-green-900/30 text-green-500 cursor-default'
                  : canSave
                    ? 'border-green-500 bg-green-900/30 text-green-400 cursor-pointer hover:bg-green-900/50 active:scale-95'
                    : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                }`}
            >
              {saved ? '✓ SAVED' : saving ? 'SAVING...' : 'SAVE SCORE'}
            </button>
          </div>
        </div>

        {/* Next Level Preview */}
        {!isLastLevel && nextConfig && (
          <div className="border border-gray-700 rounded-lg p-3 mb-3 bg-gray-900/20">
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
