import { getLevelConfig, TOTAL_LEVELS } from '../config/threats.js';

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

export default function LevelComplete({ levelStats, campaignStats, onNextLevel, onViewResults }) {
  const config = getLevelConfig(levelStats.level);
  const nextConfig = getLevelConfig(levelStats.level + 1);
  const isLastLevel = levelStats.level >= TOTAL_LEVELS;

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-y-auto">
      <div className="max-w-2xl w-full py-8 px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-green-400 font-mono text-xs tracking-[0.4em] mb-2">
            &#10003; LEVEL {levelStats.level} COMPLETE
          </div>
          <h1 className="text-2xl font-bold font-mono text-green-400 tracking-wider mb-1">
            LEVEL {levelStats.level}
          </h1>
          <div className="h-px bg-green-900 w-48 mx-auto mt-3" />
        </div>

        {/* Rating */}
        <div className="text-center mb-6">
          <div className="text-2xl mb-1">
            <Stars count={levelStats.rating.stars} />
          </div>
          <div className="text-sm font-mono text-gray-400 tracking-widest">
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
          <StatRow label="CORRECT HOLDS" value={`${levelStats.correctHolds} / ${levelStats.openGroundThreats}`}
            color={levelStats.correctHolds === levelStats.openGroundThreats ? 'text-green-400' : 'text-gray-300'} />
          <StatRow label="SIRENS" value={levelStats.sirenCount}
            color={levelStats.sirenCount === 0 ? 'text-green-400' : 'text-red-400'} />
          <StatRow label="BEST STREAK" value={levelStats.bestStreak} color="text-yellow-400" />
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
