// ============================================================
// TOURNAMENT V2 — Admin Dashboard (Wizard Flow)
// ============================================================
// Accessed via ?admin=CODE. PIN-protected (1881).
// Wizard-style: CREATE → START → CLOSE → ADVANCE → repeat.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  subscribeTournament,
  subscribeLeaderboard,
  createTournament,
  startRoundWithCountdown,
  closeRound,
  advanceToNextRound,
  finishTournament,
  resetTournament,
  pauseRound,
  resumeRound,
  kickTeam,
  updateAdvanceConfig,
  sanitizeTeamKey,
} from '../utils/leaderboard.js';
import { ROUND_CONFIGS } from '../hooks/useGameEngine.js';

const ADMIN_PIN = '1881';

// ── CSV Export Helper ────────────────────────────────────────
function downloadCSV(entries, eventCode, roundNumber) {
  const headers = ['Rank', 'Team', 'Score', 'Status', 'Correct Intercepts', 'Sirens', 'Best Streak', 'Quiz Correct', 'Quiz Total'];
  const rows = entries.map((e, i) => [
    i + 1,
    `"${e.name || ''}"`,
    e.score || 0,
    e.status || '',
    e.correctIntercepts || 0,
    e.sirenCount || 0,
    e.bestStreak || 0,
    e.quizCorrect || '',
    e.quizTotal || '',
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${eventCode}-R${roundNumber}-results.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminBoard({ eventCode }) {
  // PIN gate — persist in sessionStorage so admin doesn't re-enter on refresh
  const [pinInput, setPinInput] = useState('');
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('admin_unlocked') === 'true');
  const [pinError, setPinError] = useState(false);

  // Tournament state
  const [tournamentDoc, setTournamentDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null); // 'start' | 'close' | 'force_close' | 'advance' | 'reset'

  // Advancement config editing
  const [editingAdvance, setEditingAdvance] = useState(false);
  const [advanceType, setAdvanceType] = useState('percentage');
  const [advanceValue, setAdvanceValue] = useState(50);

  // Subscribe to tournament doc
  useEffect(() => {
    if (!unlocked) return;
    const unsub = subscribeTournament(eventCode, (doc) => {
      setTournamentDoc(doc);
      setLoading(false);
    });
    return unsub;
  }, [eventCode, unlocked]);

  // Subscribe to leaderboard for current round
  useEffect(() => {
    if (!unlocked || !tournamentDoc) return;
    const roundEventCode = `${eventCode}-R${tournamentDoc.currentRound}`;
    const unsub = subscribeLeaderboard('CAMPAIGN', (newEntries) => {
      setEntries(newEntries);
    }, roundEventCode);
    return unsub;
  }, [eventCode, unlocked, tournamentDoc?.currentRound]);

  // Load advancement config from doc
  useEffect(() => {
    if (!tournamentDoc) return;
    const config = tournamentDoc.advanceConfig?.[tournamentDoc.currentRound];
    if (config) {
      setAdvanceType(config.type || 'percentage');
      setAdvanceValue(config.value || 50);
    }
  }, [tournamentDoc?.currentRound, tournamentDoc?.advanceConfig]);

  // ── Auto-advance: close round automatically when all players finish ──
  const [autoCloseCountdown, setAutoCloseCountdown] = useState(null); // seconds remaining
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(null);
  const autoCloseRef = useRef(null);
  const autoAdvanceRef = useRef(null);

  // Detect when all players finish → start 30s auto-close countdown
  useEffect(() => {
    if (!tournamentDoc || tournamentDoc.roundStatus !== 'active') {
      if (autoCloseRef.current) { clearInterval(autoCloseRef.current); autoCloseRef.current = null; }
      setAutoCloseCountdown(null);
      return;
    }
    if (entries.length === 0) return; // No scores yet

    const allFinished = entries.length > 0 && entries.every(e => e.status === 'finished');
    if (allFinished && !autoCloseRef.current) {
      // Start 30s countdown to auto-close
      let remaining = 30;
      setAutoCloseCountdown(remaining);
      autoCloseRef.current = setInterval(() => {
        remaining--;
        setAutoCloseCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(autoCloseRef.current);
          autoCloseRef.current = null;
          // Auto-close the round
          const sorted = [...entries].sort((a, b) => (b.score || 0) - (a.score || 0));
          let cutoffIndex;
          if (advanceType === 'percentage') {
            cutoffIndex = Math.max(1, Math.ceil(sorted.length * (advanceValue / 100)));
          } else {
            cutoffIndex = Math.min(advanceValue, sorted.length);
          }
          const advancing = sorted.slice(0, cutoffIndex).map(e => sanitizeTeamKey(e.name));
          const cutoffScore = sorted[cutoffIndex - 1]?.score || 0;
          closeRound(eventCode, tournamentDoc.currentRound, advancing, cutoffScore).catch(() => {});
        }
      }, 1000);
    } else if (!allFinished && autoCloseRef.current) {
      // Players rejoined or status changed — cancel auto-close
      clearInterval(autoCloseRef.current);
      autoCloseRef.current = null;
      setAutoCloseCountdown(null);
    }

    return () => {
      if (autoCloseRef.current) { clearInterval(autoCloseRef.current); autoCloseRef.current = null; }
    };
  }, [entries, tournamentDoc?.roundStatus, advanceType, advanceValue, eventCode, tournamentDoc?.currentRound]);

  // After round closes → start 15s auto-advance countdown
  useEffect(() => {
    if (!tournamentDoc || tournamentDoc.roundStatus !== 'complete') {
      if (autoAdvanceRef.current) { clearInterval(autoAdvanceRef.current); autoAdvanceRef.current = null; }
      setAutoAdvanceCountdown(null);
      return;
    }

    if (!autoAdvanceRef.current) {
      let remaining = 15;
      setAutoAdvanceCountdown(remaining);
      autoAdvanceRef.current = setInterval(() => {
        remaining--;
        setAutoAdvanceCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(autoAdvanceRef.current);
          autoAdvanceRef.current = null;
          // Auto-advance
          const currentRound = tournamentDoc.currentRound || 1;
          if (currentRound >= 3) {
            finishTournament(eventCode).catch(() => {});
          } else {
            advanceToNextRound(eventCode, currentRound + 1).catch(() => {});
          }
        }
      }, 1000);
    }

    return () => {
      if (autoAdvanceRef.current) { clearInterval(autoAdvanceRef.current); autoAdvanceRef.current = null; }
    };
  }, [tournamentDoc?.roundStatus, eventCode, tournamentDoc?.currentRound]);

  // ── PIN Screen ──────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (pinInput === ADMIN_PIN) {
            setUnlocked(true);
            sessionStorage.setItem('admin_unlocked', 'true');
          } else {
            setPinError(true);
            setTimeout(() => setPinError(false), 1500);
          }
        }} className="text-center">
          <div className="font-mono text-xl font-bold tracking-[0.3em] text-green-400/60 mb-6">
            ADMIN ACCESS
          </div>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            autoFocus
            className={`w-40 px-4 py-3 bg-gray-900/80 border rounded-lg text-center
              font-mono text-lg tracking-[0.3em] focus:outline-none
              ${pinError ? 'border-red-500 text-red-400' : 'border-gray-700 text-green-400 focus:border-green-500'}`}
            placeholder="PIN"
          />
          <div className={`font-mono text-xs mt-2 h-4 tracking-wider ${pinError ? 'text-red-400' : 'text-transparent'}`}>
            WRONG PIN
          </div>
        </form>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="font-mono text-green-400/50 tracking-widest animate-pulse">CONNECTING...</div>
      </div>
    );
  }

  const currentRound = tournamentDoc?.currentRound || 1;
  const roundStatus = tournamentDoc?.roundStatus || 'lobby';
  const roundLabel = ROUND_CONFIGS[currentRound]?.label || `ROUND ${currentRound}`;
  const teams = tournamentDoc?.teams || {};
  const activeTeams = Object.entries(teams).filter(([_, t]) => !t.kicked);
  const teamCount = activeTeams.length;
  const finishedCount = entries.filter(e => e.status === 'finished').length;
  const playingCount = entries.filter(e => e.status === 'playing').length;
  const isPaused = tournamentDoc?.paused === true;

  // Compute advancing teams based on config
  const computeAdvancing = () => {
    const sorted = [...entries].sort((a, b) => (b.score || 0) - (a.score || 0));
    let cutoffIndex;
    if (advanceType === 'percentage') {
      cutoffIndex = Math.max(1, Math.ceil(sorted.length * (advanceValue / 100)));
    } else {
      cutoffIndex = Math.min(advanceValue, sorted.length);
    }
    const advancing = sorted.slice(0, cutoffIndex).map(e => sanitizeTeamKey(e.name));
    const cutoffScore = sorted[cutoffIndex - 1]?.score || 0;
    return { advancing, cutoffScore, cutoffIndex };
  };

  // ── Confirmation Dialog ──────────────────────────────────────
  const ConfirmDialog = ({ action, message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm mx-4 text-center">
        <div className="font-mono text-sm text-gray-300 mb-4">{message}</div>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm text-gray-400 hover:bg-gray-700 cursor-pointer">
            CANCEL
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 bg-green-900/50 border border-green-500/50 rounded-lg font-mono text-sm text-green-400 hover:bg-green-900/70 cursor-pointer">
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );

  // ── Action handlers ──────────────────────────────────────────
  const handleCreateTournament = async () => {
    await createTournament(eventCode);
  };

  const handleStartRound = async () => {
    await startRoundWithCountdown(eventCode, 5000);
    setConfirmAction(null);
  };

  const handleCloseRound = async () => {
    const { advancing, cutoffScore } = computeAdvancing();
    await closeRound(eventCode, currentRound, advancing, cutoffScore);
    setConfirmAction(null);
  };

  const handleAdvanceToNext = async () => {
    if (currentRound >= 3) {
      await finishTournament(eventCode);
    } else {
      await advanceToNextRound(eventCode, currentRound + 1);
    }
    setConfirmAction(null);
  };

  const handleReset = async () => {
    await resetTournament(eventCode);
    setConfirmAction(null);
  };

  const handlePauseToggle = async () => {
    if (isPaused) {
      await resumeRound(eventCode);
    } else {
      await pauseRound(eventCode);
    }
  };

  const handleKick = async (teamKey) => {
    await kickTeam(eventCode, teamKey);
  };

  // ── No Tournament Yet ────────────────────────────────────────
  if (!tournamentDoc) {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-2xl font-bold tracking-[0.2em] text-green-400 mb-2">
            IRON DOME COMMAND
          </div>
          <div className="font-mono text-sm text-gray-500 tracking-widest mb-8">
            {eventCode} TOURNAMENT
          </div>
          <button onClick={handleCreateTournament}
            className="px-8 py-4 bg-green-900/40 border-2 border-green-500/60 rounded-xl
              font-mono text-lg tracking-widest text-green-400 hover:bg-green-900/60
              transition-all cursor-pointer"
            style={{ textShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
            CREATE TOURNAMENT
          </button>
        </div>
      </div>
    );
  }

  // ── Main Admin Dashboard ─────────────────────────────────────
  return (
    <div className="h-screen bg-[#0a0e1a] flex flex-col overflow-hidden">
      {/* Confirmation dialog */}
      {confirmAction === 'start' && (
        <ConfirmDialog
          message={`Start ${roundLabel}? All ${teamCount} teams will begin the countdown.`}
          onConfirm={handleStartRound}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === 'close' && (
        <ConfirmDialog
          message={`Close ${roundLabel}? Top ${advanceType === 'percentage' ? `${advanceValue}%` : advanceValue} will advance.${playingCount > 0 ? ` WARNING: ${playingCount} teams still playing!` : ''}`}
          onConfirm={handleCloseRound}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === 'advance' && (
        <ConfirmDialog
          message={currentRound >= 3 ? 'End the tournament and show final results?' : `Advance to Round ${currentRound + 1}?`}
          onConfirm={handleAdvanceToNext}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === 'reset' && (
        <ConfirmDialog
          message="Reset tournament? All teams and scores will be cleared."
          onConfirm={handleReset}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50">
        <div>
          <div className="font-mono text-lg font-bold tracking-[0.2em] text-green-400">
            {eventCode} — ADMIN
          </div>
          <div className="font-mono text-xs text-gray-500 tracking-widest">
            {roundLabel} | {roundStatus.toUpperCase()}
            {isPaused && <span className="text-yellow-400 ml-2">PAUSED</span>}
          </div>
        </div>
        <div className="flex gap-2">
          {roundStatus === 'active' && (
            <button onClick={handlePauseToggle}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider cursor-pointer border
                ${isPaused
                  ? 'bg-green-900/30 border-green-500/50 text-green-400 hover:bg-green-900/50'
                  : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400 hover:bg-yellow-900/50'
                }`}>
              {isPaused ? 'RESUME' : 'PAUSE ALL'}
            </button>
          )}
          <button onClick={() => setConfirmAction('reset')}
            className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg
              font-mono text-xs tracking-wider text-gray-500 hover:text-gray-300 cursor-pointer">
            RESET
          </button>
        </div>
      </div>

      {/* Main Content — varies by phase */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* ── LOBBY PHASE ── */}
        {roundStatus === 'lobby' && (
          <div>
            {/* Team count */}
            <div className="text-center mb-6">
              <div className="font-mono text-5xl font-black text-green-400 mb-1"
                style={{ textShadow: '0 0 30px rgba(34,197,94,0.2)' }}>
                {teamCount}
              </div>
              <div className="font-mono text-sm text-gray-500 tracking-widest">TEAMS JOINED</div>
            </div>

            {/* Advancement config */}
            <div className="mb-6 p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="font-mono text-xs text-gray-500 tracking-wider mb-2">ADVANCEMENT</div>
              <div className="flex items-center gap-3">
                <select value={advanceType} onChange={(e) => {
                  setAdvanceType(e.target.value);
                  updateAdvanceConfig(eventCode, currentRound, { type: e.target.value, value: advanceValue });
                }}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 font-mono text-sm text-green-400 focus:outline-none">
                  <option value="percentage">TOP %</option>
                  <option value="count">TOP #</option>
                </select>
                <input type="number" value={advanceValue} onChange={(e) => {
                  const v = parseInt(e.target.value) || 1;
                  setAdvanceValue(v);
                  updateAdvanceConfig(eventCode, currentRound, { type: advanceType, value: v });
                }}
                  className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 font-mono text-sm text-green-400 text-center focus:outline-none"
                />
                <span className="font-mono text-xs text-gray-500">
                  {advanceType === 'percentage' ? `(${Math.ceil(teamCount * advanceValue / 100)} teams)` : `of ${teamCount}`}
                </span>
              </div>
            </div>

            {/* Team list */}
            <div className="mb-6">
              <div className="font-mono text-xs text-gray-500 tracking-wider mb-2">TEAMS</div>
              <div className="space-y-1">
                {activeTeams.map(([key, team]) => (
                  <div key={key} className="flex items-center justify-between py-1.5 px-3 bg-gray-900/30 rounded">
                    <span className="font-mono text-sm text-gray-300">
                      {team.emoji && <span className="mr-1">{team.emoji}</span>}
                      {team.name}
                    </span>
                    <button onClick={() => handleKick(key)}
                      className="font-mono text-[10px] text-gray-600 hover:text-red-400 cursor-pointer">
                      KICK
                    </button>
                  </div>
                ))}
                {teamCount === 0 && (
                  <div className="font-mono text-sm text-gray-600 text-center py-4">
                    Waiting for teams to join...
                  </div>
                )}
              </div>
            </div>

            {/* Start button */}
            <button onClick={() => setConfirmAction('start')}
              disabled={teamCount < 2}
              className={`w-full py-4 rounded-xl font-mono text-lg tracking-widest transition-all cursor-pointer
                ${teamCount < 2
                  ? 'bg-gray-800/50 border border-gray-700 text-gray-600'
                  : 'bg-green-900/40 border-2 border-green-500/60 text-green-400 hover:bg-green-900/60'
                }`}
              style={teamCount >= 2 ? { textShadow: '0 0 20px rgba(34,197,94,0.3)' } : {}}>
              START {roundLabel}
            </button>
          </div>
        )}

        {/* ── ACTIVE PHASE ── */}
        {roundStatus === 'active' && (
          <div>
            {/* Progress counter */}
            <div className="text-center mb-4">
              <div className="font-mono text-3xl font-bold text-green-400 mb-1">
                {finishedCount}/{entries.length || teamCount}
              </div>
              <div className="font-mono text-xs text-gray-500 tracking-widest">
                FINISHED {playingCount > 0 && `• ${playingCount} PLAYING`}
              </div>
              {autoCloseCountdown !== null && (
                <div className="font-mono text-xs text-orange-400 tracking-wider mt-2">
                  AUTO-CLOSING IN {autoCloseCountdown}s
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <div className="space-y-1 mb-6">
              {entries.map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between py-2 px-3 bg-gray-900/30 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500 w-6 text-right">{i + 1}</span>
                    <span className="font-mono text-sm text-gray-300">{entry.name}</span>
                    {entry.status === 'playing' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    )}
                    {entry.status === 'finished' && (
                      <span className="text-green-400 text-xs">✓</span>
                    )}
                  </div>
                  <span className="font-mono text-sm font-bold text-green-400 tabular-nums">
                    {(entry.score || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Close button */}
            <button onClick={() => setConfirmAction('close')}
              className="w-full py-4 rounded-xl font-mono text-lg tracking-widest
                bg-orange-900/30 border-2 border-orange-500/50 text-orange-400
                hover:bg-orange-900/50 transition-all cursor-pointer">
              CLOSE {roundLabel}
              {playingCount > 0 && (
                <div className="font-mono text-xs text-orange-400/60 mt-1">
                  {playingCount} still playing — their current scores will be used
                </div>
              )}
            </button>
          </div>
        )}

        {/* ── COMPLETE PHASE ── */}
        {roundStatus === 'complete' && (
          <div>
            <div className="text-center mb-4">
              <div className="font-mono text-lg font-bold tracking-[0.2em] text-green-400 mb-1">
                {roundLabel} COMPLETE
              </div>
            </div>

            {/* Results with cutoff line */}
            <div className="space-y-1 mb-4">
              {entries.map((entry, i) => {
                const isAdvancing = tournamentDoc.rounds?.[currentRound]?.advancingTeams?.includes(
                  sanitizeTeamKey(entry.name)
                );
                return (
                  <div key={entry.name}
                    className={`flex items-center justify-between py-2 px-3 rounded
                      ${isAdvancing ? 'bg-green-900/20 border border-green-500/30' : 'bg-gray-900/20 opacity-40'}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-500 w-6 text-right">{i + 1}</span>
                      <span className={`font-mono text-sm ${isAdvancing ? 'text-green-400' : 'text-gray-500'}`}>
                        {entry.name}
                      </span>
                    </div>
                    <span className={`font-mono text-sm font-bold tabular-nums ${isAdvancing ? 'text-green-400' : 'text-gray-600'}`}>
                      {(entry.score || 0).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Export */}
            <button onClick={() => downloadCSV(entries, eventCode, currentRound)}
              className="w-full py-2 mb-3 rounded-lg font-mono text-xs tracking-widest
                bg-gray-800/50 border border-gray-700 text-gray-400
                hover:bg-gray-700/50 transition-all cursor-pointer">
              EXPORT CSV
            </button>

            {/* Auto-advance countdown */}
            {autoAdvanceCountdown !== null && (
              <div className="text-center mb-3">
                <div className="font-mono text-xs text-orange-400 tracking-wider">
                  AUTO-ADVANCING IN {autoAdvanceCountdown}s
                </div>
              </div>
            )}

            {/* Advance / Finish button */}
            <button onClick={() => {
              // Cancel auto-advance timer and advance immediately
              if (autoAdvanceRef.current) { clearInterval(autoAdvanceRef.current); autoAdvanceRef.current = null; }
              setAutoAdvanceCountdown(null);
              setConfirmAction('advance');
            }}
              className="w-full py-4 rounded-xl font-mono text-lg tracking-widest
                bg-green-900/40 border-2 border-green-500/60 text-green-400
                hover:bg-green-900/60 transition-all cursor-pointer"
              style={{ textShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
              {currentRound >= 3 ? 'END TOURNAMENT' : `ADVANCE TO ROUND ${currentRound + 1}`}
            </button>
          </div>
        )}

        {/* ── FINISHED PHASE ── */}
        {roundStatus === 'finished' && (
          <div className="text-center">
            <div className="font-mono text-2xl font-bold tracking-[0.2em] text-green-400 mb-4">
              TOURNAMENT COMPLETE
            </div>

            {/* Final standings */}
            <div className="space-y-1 mb-6 text-left">
              {entries.slice(0, 5).map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between py-2 px-3 bg-gray-900/30 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-500">{i === 0 ? '★' : i + 1}</span>
                    <span className={`font-mono text-sm ${i === 0 ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
                      {entry.name}
                    </span>
                  </div>
                  <span className={`font-mono text-sm font-bold tabular-nums ${i === 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {(entry.score || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => downloadCSV(entries, eventCode, currentRound)}
              className="w-full py-2 mb-3 rounded-lg font-mono text-xs tracking-widest
                bg-gray-800/50 border border-gray-700 text-gray-400
                hover:bg-gray-700/50 transition-all cursor-pointer">
              EXPORT FINAL CSV
            </button>

            <button onClick={() => setConfirmAction('reset')}
              className="w-full py-3 rounded-xl font-mono text-sm tracking-widest
                bg-gray-800/50 border border-gray-700 text-gray-400
                hover:bg-gray-700/50 transition-all cursor-pointer">
              NEW TOURNAMENT
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-800/50">
        <div className="font-mono text-[10px] text-gray-700 tracking-wider">
          Spectator: kipat-barzel.org/?score={eventCode} | Players: kipat-barzel.org → code {eventCode}
        </div>
      </div>
    </div>
  );
}
