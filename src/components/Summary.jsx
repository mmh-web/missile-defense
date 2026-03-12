import { useState, useEffect } from 'react';
import { getLeaderboard, saveScore, isHighScore, subscribeLeaderboard } from '../utils/leaderboard.js';

export default function Summary({ stats, onReset, teamName, onTeamNameChange }) {
  const {
    totalScore,
    levelScores,
    totalCorrectIntercepts,
    totalCorrectHolds,
    totalSirens,
    totalWrongIntercepts,
    totalWastedIntercepts,
    overallBestStreak,
    rating,
    levelsCompleted,
    effectiveTotalLevels = 7,
    endedEarly,
  } = stats;

  const isIncomplete = levelsCompleted < effectiveTotalLevels;

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [savedEntryTimestamp, setSavedEntryTimestamp] = useState(null);

  // Subscribe to real-time leaderboard updates
  useEffect(() => {
    // Load initial data
    getLeaderboard('CAMPAIGN').then(setLeaderboard);
    // Subscribe for live updates from other devices
    const unsub = subscribeLeaderboard('CAMPAIGN', setLeaderboard);
    return () => unsub();
  }, []);

  const stars = Array.from({ length: 5 }, (_, i) => i < rating.stars);
  const canSave = teamName.length >= 1 && !saved && !saving;
  const madeHighScore = isHighScore(totalScore, 'CAMPAIGN');

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const entry = await saveScore({
        name: teamName,
        score: totalScore,
        gameMode: 'CAMPAIGN',
      });
      setSaved(true);
      setSavedEntryTimestamp(entry.timestamp);
      // Leaderboard auto-updates via subscription
    } catch (err) {
      console.warn('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const basePath = import.meta.env.BASE_URL || '/missile-defense/';

  return (
    <div className="h-screen bg-[#0a0e1a] flex flex-col items-center overflow-y-auto relative">
      {/* Hero photo band */}
      <div className="absolute top-0 left-0 right-0 h-[260px] z-0"
        style={{ background: `url('${basePath}images/ID3.jpg') center 40% / cover no-repeat` }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(10,14,26,0.3) 0%, rgba(10,14,26,0.55) 40%, rgba(10,14,26,0.95) 80%, #0a0e1a 100%)'
        }} />
      </div>

      <div className="max-w-xl w-full py-6 px-5 relative z-10">
        {/* Header */}
        <div className="text-center mb-4">
          <div className={`font-mono text-sm font-bold tracking-[0.2em] mb-1 ${isIncomplete ? 'text-red-400' : 'text-green-400'}`}
            style={!isIncomplete ? { textShadow: '0 0 30px rgba(34,197,94,0.3)' } : undefined}>
            {isIncomplete ? 'CAMPAIGN INCOMPLETE' : 'CAMPAIGN COMPLETE'}
          </div>
          <div className="text-[10px] font-mono tracking-[0.15em]" style={{ color: isIncomplete ? '#ef444480' : '#22c55e70' }}>
            {isIncomplete
              ? (endedEarly ? "TIME'S UP" : 'MISSION ABORTED')
              : 'MISSION DEBRIEF · תדריך סיום'}
          </div>
          {isIncomplete && (
            <div className="text-sm font-mono text-gray-400 tracking-wider mt-1">
              {levelsCompleted} / {effectiveTotalLevels} LEVELS COMPLETED
            </div>
          )}
        </div>

        {/* Total Score — prominent */}
        <div className="text-center mb-4 py-4 rounded-xl bg-[#0a0e1a]/70 backdrop-blur-sm"
          style={{ border: '1px solid rgba(34,197,94,0.25)' }}>
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-2">TOTAL SCORE</div>
          <div className="text-6xl font-bold font-mono text-green-400 tabular-nums mb-4">
            {totalScore}
          </div>
          <div className="text-3xl font-bold font-mono text-white tracking-wider mb-2">
            {rating.label}
          </div>
          <div className="text-3xl tracking-wider mb-1">
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

        {/* Per-level score breakdown */}
        {levelScores && levelScores.length > 0 && (
          <div className="mb-5 p-4 border border-gray-800 rounded-lg bg-gray-900/20">
            <div className="text-xs text-gray-500 font-mono tracking-widest mb-3 text-center">
              LEVEL SCORES
            </div>
            <div className="space-y-2">
              {levelScores.map((ls) => {
                return (
                  <div key={ls.level} className="flex items-center justify-between p-2 bg-gray-900/30 rounded border border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <span className="text-green-500/50 font-mono text-xs w-4 text-right">{ls.level}</span>
                      <span className="text-gray-400 font-mono text-xs tracking-wider">LEVEL {ls.level}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-yellow-400 text-xs">
                        {'★'.repeat(ls.rating.stars)}{'☆'.repeat(5 - ls.rating.stars)}
                      </span>
                      {ls.sirenCount > 0 && (
                        <span className="text-red-400 font-mono text-[10px]">{ls.sirenCount} SIREN{ls.sirenCount > 1 ? 'S' : ''}</span>
                      )}
                      <span className="text-green-400 font-bold font-mono text-sm tabular-nums w-16 text-right">{ls.score}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Campaign stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatRow
            label="CORRECT INTERCEPTIONS"
            value={totalCorrectIntercepts}
            good
          />
          <StatRow
            label="CORRECT HOLDS"
            value={totalCorrectHolds}
            good
          />
          <StatRow
            label="WRONG INTERCEPTOR"
            value={totalWrongIntercepts}
            bad={totalWrongIntercepts > 0}
          />
          <StatRow
            label="WASTED INTERCEPTORS"
            value={totalWastedIntercepts}
            bad={totalWastedIntercepts > 0}
          />
          <StatRow
            label="TOTAL SIRENS"
            value={totalSirens}
            bad={totalSirens > 0}
          />
          {overallBestStreak > 0 && (
            <StatRow
              label="BEST STREAK"
              value={overallBestStreak}
              good
            />
          )}
        </div>

        {/* Save Score */}
        <div className="mb-6 p-5 border border-green-900/50 rounded-lg bg-green-950/10">
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-3 text-center">
            {madeHighScore && !saved ? 'HIGH SCORE — ENTER NAME' : 'ENTER NAME'}
          </div>
          <div className="flex items-center justify-center gap-3">
            <input
              type="text"
              maxLength={10}
              value={teamName}
              onChange={(e) => onTeamNameChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="NAME"
              disabled={saved}
              className="w-48 px-3 py-2 bg-gray-900 border-2 border-green-800 rounded font-mono text-lg
                text-center text-green-400 tracking-widest uppercase
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
              {saved ? 'SAVED' : saving ? 'SAVING...' : 'SAVE SCORE'}
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <LeaderboardTable
          entries={leaderboard}
          gameMode="CAMPAIGN"
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
            PLAY AGAIN
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

export function LeaderboardTable({ entries, gameMode = 'CAMPAIGN', highlightTimestamp = null }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="p-4 border border-gray-800 rounded-lg bg-gray-900/20 text-center">
        <div className="text-xs text-gray-500 font-mono tracking-widest mb-2">
          LEADERBOARD
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
        LEADERBOARD
      </div>
      <table className="w-full font-mono text-sm">
        <thead>
          <tr className="text-gray-600 text-xs tracking-wider">
            <th className="text-left py-1 px-2 w-8">#</th>
            <th className="text-left py-1 px-2">NAME</th>
            <th className="text-right py-1 px-2">SCORE</th>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
