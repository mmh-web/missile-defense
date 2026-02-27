export default function Summary({ stats, onReset }) {
  const {
    totalThreats,
    correctIntercepts,
    populatedThreats,
    correctHolds,
    openGroundThreats,
    wrongIntercepts,
    timeouts,
    wastedIntercepts,
    ammoRemaining,
    totalPenaltyTime,
    sirenCount,
    bestStreak,
    rating,
  } = stats;

  const stars = Array.from({ length: 5 }, (_, i) => i < rating.stars);

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-green-500 font-mono text-sm tracking-[0.3em] mb-2">
            MISSION COMPLETE
          </div>
          <div className="text-4xl font-bold font-mono text-green-400 tracking-wider mb-2">
            ALL CLEAR
          </div>
          <div className="h-px bg-green-900 w-48 mx-auto" />
        </div>

        {/* Rating */}
        <div className="text-center mb-8 py-6 border border-green-900/50 rounded-lg bg-green-950/20">
          <div className="text-3xl font-bold font-mono text-white tracking-wider mb-2">
            {rating.label}
          </div>
          <div className="text-3xl tracking-wider">
            {stars.map((filled, i) => (
              <span
                key={i}
                className={filled ? 'text-yellow-400' : 'text-gray-700'}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatRow label="TOTAL THREATS FACED" value={totalThreats} />
          <StatRow
            label="CORRECT INTERCEPTIONS"
            value={`${correctIntercepts} / ${populatedThreats}`}
            good
          />
          <StatRow
            label="CORRECT HOLDS"
            value={`${correctHolds} / ${openGroundThreats}`}
            good
          />
          <StatRow
            label="WRONG INTERCEPTOR"
            value={wrongIntercepts}
            bad={wrongIntercepts > 0}
          />
          <StatRow
            label="TIMEOUTS (POPULATED)"
            value={timeouts}
            bad={timeouts > 0}
          />
          <StatRow
            label="WASTED INTERCEPTORS"
            value={wastedIntercepts}
            bad={wastedIntercepts > 0}
          />
          <StatRow
            label="TOTAL SIRENS"
            value={sirenCount}
            bad={sirenCount > 0}
          />
          <StatRow
            label="PENALTY TIME"
            value={`${totalPenaltyTime}s`}
            bad={totalPenaltyTime > 0}
          />
          {bestStreak > 0 && (
            <StatRow
              label="BEST STREAK"
              value={`🔥 ${bestStreak}`}
              good
            />
          )}
        </div>

        {/* Ammo remaining */}
        <div className="mb-8 p-4 border border-gray-800 rounded-lg bg-gray-900/30">
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-3">
            AMMUNITION REMAINING
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { key: 'iron_dome', label: 'IRON DOME', color: '#22c55e' },
              { key: 'davids_sling', label: "DAVID'S SLING", color: '#3b82f6' },
              { key: 'arrow_2', label: 'ARROW 2', color: '#a855f7' },
              { key: 'arrow_3', label: 'ARROW 3', color: '#ef4444' },
            ].map(({ key, label, color }) => (
              <div key={key} className="text-center">
                <div className="text-[10px] text-gray-500 font-mono mb-1">{label}</div>
                <div
                  className="text-2xl font-bold font-mono tabular-nums"
                  style={{ color }}
                >
                  {ammoRemaining[key]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset button */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-green-900/30 border-2 border-green-600 text-green-400
              font-mono font-bold tracking-wider rounded-lg
              hover:bg-green-900/50 hover:border-green-400 transition-all
              active:scale-95 cursor-pointer text-lg"
          >
            RESET MISSION
          </button>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, good, bad }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900/30 border border-gray-800 rounded">
      <span className="text-xs text-gray-500 font-mono tracking-wider">{label}</span>
      <span
        className={`text-lg font-bold font-mono tabular-nums ${
          bad ? 'text-red-400' : good ? 'text-green-400' : 'text-gray-300'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
