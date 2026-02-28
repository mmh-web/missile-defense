import { useState, useEffect } from 'react';
import { getLeaderboard, saveScore, isHighScore } from '../utils/leaderboard.js';

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
    score,
    gameMode,
  } = stats;

  const [callsign, setCallsign] = useState('');
  const [saved, setSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [savedEntryTimestamp, setSavedEntryTimestamp] = useState(null);

  useEffect(() => {
    setLeaderboard(getLeaderboard(gameMode));
  }, [gameMode]);

  const stars = Array.from({ length: 5 }, (_, i) => i < rating.stars);
  const canSave = callsign.length >= 1 && !saved;
  const madeHighScore = isHighScore(score, gameMode);

  const handleSave = () => {
    if (!canSave) return;
    const entry = saveScore({
      name: callsign,
      score,
      stars: rating.stars,
      rating: rating.label,
      gameMode,
      correctIntercepts,
      sirenCount,
      bestStreak,
    });
    setSaved(true);
    setSavedEntryTimestamp(entry.timestamp);
    setLeaderboard(getLeaderboard(gameMode));
  };

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center overflow-y-auto">
      <div className="max-w-2xl w-full py-8 px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-green-500 font-mono text-sm tracking-[0.3em] mb-2">
            MISSION COMPLETE
          </div>
          <div className="text-4xl font-bold font-mono text-green-400 tracking-wider mb-2">
            ALL CLEAR
          </div>
          <div className="h-px bg-green-900 w-48 mx-auto" />
        </div>

        {/* Rating + Score */}
        <div className="text-center mb-6 py-5 border border-green-900/50 rounded-lg bg-green-950/20">
          <div className="text-3xl font-bold font-mono text-white tracking-wider mb-2">
            {rating.label}
          </div>
          <div className="text-3xl tracking-wider mb-3">
            {stars.map((filled, i) => (
              <span
                key={i}
                className={filled ? 'text-yellow-400' : 'text-gray-700'}
              >
                &#9733;
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-1">SCORE</div>
          <div className="text-4xl font-bold font-mono text-green-400 tabular-nums">
            {score}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
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
              value={`${bestStreak}`}
              good
            />
          )}
        </div>

        {/* Ammo remaining */}
        <div className="mb-6 p-4 border border-gray-800 rounded-lg bg-gray-900/30">
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

        {/* Save Score */}
        <div className="mb-6 p-5 border border-green-900/50 rounded-lg bg-green-950/10">
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-3 text-center">
            {madeHighScore && !saved ? 'HIGH SCORE — ENTER CALLSIGN' : 'ENTER CALLSIGN'}
          </div>
          <div className="flex items-center justify-center gap-3">
            <input
              type="text"
              maxLength={3}
              value={callsign}
              onChange={(e) => setCallsign(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="AAA"
              disabled={saved}
              className="w-24 px-3 py-2 bg-gray-900 border-2 border-green-800 rounded font-mono text-xl
                text-center text-green-400 tracking-[0.3em] uppercase
                focus:border-green-500 focus:outline-none
                disabled:opacity-50 disabled:cursor-not-allowed
                placeholder:text-gray-700"
            />
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`px-6 py-2 rounded font-mono text-sm font-bold tracking-wider border-2 transition-all
                ${saved
                  ? 'border-green-700 bg-green-900/30 text-green-500 cursor-default'
                  : canSave
                    ? 'border-green-500 bg-green-900/30 text-green-400 cursor-pointer hover:bg-green-900/50 active:scale-95'
                    : 'border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed'
                }`}
            >
              {saved ? 'SAVED' : 'SAVE SCORE'}
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <LeaderboardTable
          entries={leaderboard}
          gameMode={gameMode}
          highlightTimestamp={savedEntryTimestamp}
        />

        {/* Reset button */}
        <div className="text-center mt-6">
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

export function LeaderboardTable({ entries, gameMode, highlightTimestamp = null }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="p-4 border border-gray-800 rounded-lg bg-gray-900/20 text-center">
        <div className="text-xs text-gray-500 font-mono tracking-widest mb-2">
          LEADERBOARD — {gameMode} MISSION
        </div>
        <div className="text-gray-600 font-mono text-sm py-4">
          NO SCORES RECORDED
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-gray-900/20">
      <div className="text-xs text-gray-500 font-mono tracking-widest mb-3 text-center">
        LEADERBOARD — {gameMode} MISSION
      </div>
      <table className="w-full font-mono text-sm">
        <thead>
          <tr className="text-gray-600 text-xs tracking-wider">
            <th className="text-left py-1 px-2 w-8">#</th>
            <th className="text-left py-1 px-2">CALLSIGN</th>
            <th className="text-right py-1 px-2">SCORE</th>
            <th className="text-center py-1 px-2">RATING</th>
            <th className="text-center py-1 px-2">STARS</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const isHighlighted = highlightTimestamp && entry.timestamp === highlightTimestamp;
            return (
              <tr
                key={`${entry.timestamp}-${i}`}
                className={`border-t border-gray-800/50 ${
                  isHighlighted
                    ? 'bg-green-900/30 text-green-400'
                    : i === 0
                      ? 'text-yellow-400'
                      : 'text-gray-400'
                }`}
              >
                <td className="py-2 px-2 text-gray-600">{i + 1}</td>
                <td className="py-2 px-2 font-bold tracking-wider">{entry.name}</td>
                <td className="py-2 px-2 text-right tabular-nums">{entry.score}</td>
                <td className="py-2 px-2 text-center text-xs tracking-wider opacity-70">
                  {entry.rating}
                </td>
                <td className="py-2 px-2 text-center">
                  {Array.from({ length: entry.stars }, (_, j) => (
                    <span key={j} className="text-yellow-400 text-xs">&#9733;</span>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
