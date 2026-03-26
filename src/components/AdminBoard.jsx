// ============================================================
// TOURNAMENT V2 — Unified Admin Host Screen
// ============================================================
// Kahoot-style: one screen the admin projects that shows both
// the spectator display AND admin controls. Replaces the old
// separate admin dashboard.
//
// Accessed via:
//   - ?admin=CODE (direct URL, PIN-protected)
//   - Title screen "HOST" button (PIN + create flow)
//
// The ?score=CODE spectator board still works for secondary displays.
// ============================================================

import { useState, useEffect, useRef } from 'react';
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

// ── Sound Effects ────────────────────────────────────────────
let _audioCtx = null;
const getAudioCtx = () => {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
};

function playNewScoreSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch(e) {}
}

function playNewLeaderSound() {
  try {
    const ctx = getAudioCtx();
    [0, 0.12, 0.24].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime([523, 659, 784][i], ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.2);
    });
  } catch(e) {}
}

// ── Animated Score ───────────────────────────────────────────
function AnimatedScore({ value, color, className }) {
  const [displayValue, setDisplayValue] = useState(value);
  const animRef = useRef(null);
  const targetRef = useRef(value);

  useEffect(() => {
    if (value === targetRef.current) return;
    const from = displayValue;
    const to = value;
    targetRef.current = to;
    const startTime = performance.now();
    const duration = 800;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplayValue(current);
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [value]);

  return <span className={className} style={{ color }}>{displayValue.toLocaleString()}</span>;
}

// ── Auto-scaling ─────────────────────────────────────────────
function getScaleConfig(count) {
  if (count <= 5) return { rowPy: 'py-5', nameSize: 'text-3xl', scoreSize: 'text-4xl', rankSize: 'text-3xl', gap: 'gap-3', statusSize: 'text-sm', levelSize: 'text-xs', rankW: 'w-16' };
  if (count <= 10) return { rowPy: 'py-3', nameSize: 'text-xl', scoreSize: 'text-2xl', rankSize: 'text-2xl', gap: 'gap-2', statusSize: 'text-xs', levelSize: 'text-[10px]', rankW: 'w-12' };
  if (count <= 15) return { rowPy: 'py-2', nameSize: 'text-lg', scoreSize: 'text-xl', rankSize: 'text-xl', gap: 'gap-1.5', statusSize: 'text-[10px]', levelSize: 'text-[9px]', rankW: 'w-10' };
  return { rowPy: 'py-1.5', nameSize: 'text-base', scoreSize: 'text-lg', rankSize: 'text-lg', gap: 'gap-1', statusSize: 'text-[9px]', levelSize: 'text-[8px]', rankW: 'w-9' };
}

// ── Radar Sweep Waiting Animation ────────────────────────────
function RadarWaiting({ eventCode }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.15" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.1" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.08" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="#22c55e" strokeWidth="0.3" opacity="0.1" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="#22c55e" strokeWidth="0.3" opacity="0.1" />
            <line x1="50" y1="50" x2="50" y2="5" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"
              style={{ transformOrigin: '50px 50px', animation: 'radarSweep 3s linear infinite' }} />
            <path d="M50,50 L50,5 A45,45 0 0,1 81.8,18.2 Z" fill="url(#sweepGradAdmin)"
              style={{ transformOrigin: '50px 50px', animation: 'radarSweep 3s linear infinite' }} />
            <defs>
              <linearGradient id="sweepGradAdmin" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="2" fill="#22c55e" opacity="0.6" />
          </svg>
        </div>
        <div className="font-mono text-2xl text-green-500/50 tracking-[0.4em] mb-4"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          SCANNING FOR TEAMS
        </div>
      </div>
    </div>
  );
}

// ── CSV Export Helper ────────────────────────────────────────
function downloadCSV(entries, eventCode, roundNumber) {
  const headers = ['Rank', 'Team', 'Score', 'Status', 'Correct Intercepts', 'Sirens', 'Best Streak', 'Quiz Correct', 'Quiz Total'];
  const rows = entries.map((e, i) => [
    i + 1, `"${e.name || ''}"`, e.score || 0, e.status || '',
    e.correctIntercepts || 0, e.sirenCount || 0, e.bestStreak || 0,
    e.quizCorrect || '', e.quizTotal || '',
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

// ── Confirmation Dialog ──────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
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
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AdminBoard({ eventCode, skipPin }) {
  // ── PIN gate ───────────────────────────────────────────────
  const [pinInput, setPinInput] = useState('');
  const [unlocked, setUnlocked] = useState(() => skipPin || sessionStorage.getItem('admin_unlocked') === 'true');
  const [pinError, setPinError] = useState(false);

  // ── Tournament state ───────────────────────────────────────
  const [tournamentDoc, setTournamentDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  // ── Advancement config ─────────────────────────────────────
  const [advanceType, setAdvanceType] = useState('percentage');
  const [advanceValue, setAdvanceValue] = useState(50);

  // ── Admin panel visibility ─────────────────────────────────
  const [panelOpen, setPanelOpen] = useState(false);

  // ── Spectator display state ────────────────────────────────
  const [lobbyTeams, setLobbyTeams] = useState([]);
  const [recentChanges, setRecentChanges] = useState({});
  const [revealPhase, setRevealPhase] = useState(null);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [championReveal, setChampionReveal] = useState(null);
  const [offline, setOffline] = useState(false);
  const [qualifyCount, setQualifyCount] = useState(5);

  // ── Refs ───────────────────────────────────────────────────
  const prevTopRef = useRef(null);
  const prevCountRef = useRef(0);
  const prevScoresRef = useRef({});
  const prevTeamCountRef = useRef(0);
  const lobbyAudioRef = useRef(null);
  const lastDataRef = useRef(Date.now());
  const autoCloseRef = useRef(null);
  const autoAdvanceRef = useRef(null);
  const isAdvancingRef = useRef(false);

  // ── Auto timers state ──────────────────────────────────────
  const [autoCloseCountdown, setAutoCloseCountdown] = useState(null);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(null);

  // ── Subscribe to tournament doc ────────────────────────────
  useEffect(() => {
    if (!unlocked) return;
    const unsub = subscribeTournament(eventCode, (doc) => {
      setTournamentDoc(doc);
      setLoading(false);
      if (doc) {
        // Extract lobby teams — for R2+, only show advancing teams
        const teams = doc.teams || {};
        const round = doc.currentRound || 1;
        let teamList = Object.entries(teams)
          .filter(([_, t]) => !t.kicked)
          .map(([key, t]) => ({ key, name: t.name, emoji: t.emoji || '', joinedAt: t.joinedAt }))
          .sort((a, b) => a.joinedAt - b.joinedAt);
        if (round > 1) {
          const advancingTeams = doc.rounds?.[round - 1]?.advancingTeams || [];
          if (advancingTeams.length > 0) {
            teamList = teamList.filter(t => advancingTeams.includes(t.key));
          }
        }

        // Sound for new team joins
        if (teamList.length > prevTeamCountRef.current && prevTeamCountRef.current > 0) {
          playNewScoreSound();
          if (teamList.length % 10 === 0) playNewLeaderSound();
        }
        prevTeamCountRef.current = teamList.length;
        setLobbyTeams(teamList);

        // Sync reveal state from round status
        if (doc.roundStatus === 'complete') {
          // Will be handled by reveal effect
        } else {
          setRevealPhase(null);
          setRevealedIndex(-1);
          setChampionReveal(null);
        }
      }
    });
    return unsub;
  }, [eventCode, unlocked]);

  // ── Subscribe to leaderboard ───────────────────────────────
  useEffect(() => {
    if (!unlocked || !tournamentDoc) return;
    const roundEventCode = `${eventCode}-R${tournamentDoc.currentRound}`;
    prevTopRef.current = null;
    prevCountRef.current = 0;
    prevScoresRef.current = {};
    setRecentChanges({});

    const unsub = subscribeLeaderboard('CAMPAIGN', (newEntries) => {
      setOffline(false);
      lastDataRef.current = Date.now();

      // Delta badges
      const changes = {};
      newEntries.forEach((entry) => {
        const prev = prevScoresRef.current[entry.name];
        if (prev !== undefined && entry.score > prev) {
          changes[entry.name] = { delta: entry.score - prev, time: Date.now() };
        }
      });
      const newScores = {};
      newEntries.forEach((entry) => { newScores[entry.name] = entry.score || 0; });
      prevScoresRef.current = newScores;

      if (Object.keys(changes).length > 0) {
        setRecentChanges(prev => ({ ...prev, ...changes }));
      }

      // Sound effects
      if (newEntries.length > prevCountRef.current && prevCountRef.current > 0) {
        if (prevTopRef.current && newEntries[0]?.name !== prevTopRef.current) {
          playNewLeaderSound();
        } else {
          playNewScoreSound();
        }
      }
      prevCountRef.current = newEntries.length;
      prevTopRef.current = newEntries[0]?.name || null;

      setEntries(newEntries);
    }, roundEventCode);
    return unsub;
  }, [eventCode, unlocked, tournamentDoc?.currentRound]);

  // ── Load advancement config from doc ───────────────────────
  useEffect(() => {
    if (!tournamentDoc) return;
    const config = tournamentDoc.advanceConfig?.[tournamentDoc.currentRound];
    if (config) {
      setAdvanceType(config.type || 'percentage');
      setAdvanceValue(config.value || 50);
    }
  }, [tournamentDoc?.currentRound, tournamentDoc?.advanceConfig]);

  // ── Lobby music ────────────────────────────────────────────
  useEffect(() => {
    const isLobby = tournamentDoc?.roundStatus === 'lobby';
    if (isLobby && !lobbyAudioRef.current) {
      const basePath = import.meta.env.BASE_URL || '/missile-defense/';
      const audio = new Audio(`${basePath}sounds/briefing-music.mp3`);
      audio.loop = true;
      audio.volume = 0.35;
      audio.play().catch(() => {});
      lobbyAudioRef.current = audio;
    } else if (!isLobby && lobbyAudioRef.current) {
      lobbyAudioRef.current.pause();
      lobbyAudioRef.current.src = '';
      lobbyAudioRef.current = null;
    }
    return () => {
      if (lobbyAudioRef.current) {
        lobbyAudioRef.current.pause();
        lobbyAudioRef.current.src = '';
        lobbyAudioRef.current = null;
      }
    };
  }, [tournamentDoc?.roundStatus]);

  // ── Periodic tick for disconnect detection ─────────────────
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!unlocked || !tournamentDoc || tournamentDoc.roundStatus !== 'active') return;
    const interval = setInterval(() => setTick(t => t + 1), 10000);
    return () => clearInterval(interval);
  }, [unlocked, tournamentDoc?.roundStatus]);

  // ── Clean up old delta badges ──────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRecentChanges(prev => {
        const next = {};
        let changed = false;
        for (const [name, info] of Object.entries(prev)) {
          if (now - info.time < 2500) { next[name] = info; } else { changed = true; }
        }
        return changed ? next : prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // ── Offline detection ──────────────────────────────────────
  useEffect(() => {
    const check = setInterval(() => {
      const hasPlaying = entries.some(e => e.status === 'playing');
      if (hasPlaying && Date.now() - lastDataRef.current > 30000) setOffline(true);
    }, 5000);
    return () => clearInterval(check);
  }, [entries]);

  // ── Auto-close: when all players finish → 30s countdown ───
  useEffect(() => {
    if (!tournamentDoc || tournamentDoc.roundStatus !== 'active') {
      if (autoCloseRef.current) { clearInterval(autoCloseRef.current); autoCloseRef.current = null; }
      setAutoCloseCountdown(null);
      return;
    }
    if (entries.length === 0) return;

    const allDone = entries.every(e =>
      e.status === 'finished' || (e.status === 'playing' && e.lastUpdate && (Date.now() - e.lastUpdate > 30000))
    );

    if (allDone && !autoCloseRef.current) {
      let remaining = 30;
      setAutoCloseCountdown(remaining);
      autoCloseRef.current = setInterval(() => {
        remaining--;
        setAutoCloseCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(autoCloseRef.current);
          autoCloseRef.current = null;
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
    } else if (!allDone && autoCloseRef.current) {
      clearInterval(autoCloseRef.current);
      autoCloseRef.current = null;
      setAutoCloseCountdown(null);
    }

    return () => {
      if (autoCloseRef.current) { clearInterval(autoCloseRef.current); autoCloseRef.current = null; }
    };
  }, [entries, tournamentDoc?.roundStatus, advanceType, advanceValue, eventCode, tournamentDoc?.currentRound]);

  // ── Auto-advance: after round closes → 15s countdown ──────
  useEffect(() => {
    if (!tournamentDoc || tournamentDoc.roundStatus !== 'complete') {
      if (autoAdvanceRef.current) { clearInterval(autoAdvanceRef.current); autoAdvanceRef.current = null; }
      setAutoAdvanceCountdown(null);
      isAdvancingRef.current = false;
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
          if (!isAdvancingRef.current) {
            isAdvancingRef.current = true;
            const cr = tournamentDoc.currentRound || 1;
            const advanceFn = cr >= 3
              ? finishTournament(eventCode)
              : advanceToNextRound(eventCode, cr + 1);
            advanceFn.catch(() => { isAdvancingRef.current = false; });
          }
        }
      }, 1000);
    }
    return () => {
      if (autoAdvanceRef.current) { clearInterval(autoAdvanceRef.current); autoAdvanceRef.current = null; }
    };
  }, [tournamentDoc?.roundStatus, eventCode, tournamentDoc?.currentRound]);

  // ── Reveal ceremony trigger ────────────────────────────────
  const roundClosed = tournamentDoc?.roundStatus === 'complete';
  useEffect(() => {
    if (!roundClosed || tournamentDoc?.roundStatus !== 'complete') return;
    if (revealPhase) return;
    setRevealPhase('dimming');
    setRevealedIndex(-1);
    const dimTimer = setTimeout(() => {
      setRevealPhase('revealing');
      let idx = 0;
      const revealInterval = setInterval(() => {
        if (idx >= entries.length) {
          clearInterval(revealInterval);
          setRevealPhase('done');
          return;
        }
        setRevealedIndex(idx);
        idx++;
      }, 300);
    }, 3000);
    return () => clearTimeout(dimTimer);
  }, [roundClosed]);

  // ── Champion reveal ────────────────────────────────────────
  useEffect(() => {
    if (!tournamentDoc || tournamentDoc.roundStatus !== 'finished' || (tournamentDoc.currentRound || 1) < 3) return;
    if (championReveal) return;
    setTimeout(() => setChampionReveal('runner_up'), 2000);
    setTimeout(() => setChampionReveal('champion'), 5000);
    setTimeout(() => setChampionReveal('hold'), 8000);
  }, [tournamentDoc?.roundStatus]);

  // ── Keyboard shortcuts ─────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'a' || e.key === 'A') setPanelOpen(prev => !prev);
      if (e.key >= '1' && e.key <= '3') {
        // Quick round switch (for viewing past rounds)
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── Derived state ──────────────────────────────────────────
  const currentRound = tournamentDoc?.currentRound || 1;
  const roundStatus = tournamentDoc?.roundStatus || 'lobby';
  const roundLabel = ROUND_CONFIGS[currentRound]?.label || `ROUND ${currentRound}`;
  const teams = tournamentDoc?.teams || {};
  const activeTeams = Object.entries(teams).filter(([_, t]) => !t.kicked);
  const teamCount = activeTeams.length;
  const now = Date.now();
  const DISCONNECT_THRESHOLD = 30000;
  const isDisconnected = (entry) => entry.status === 'playing' && entry.lastUpdate && (now - entry.lastUpdate > DISCONNECT_THRESHOLD);
  const finishedCount = entries.filter(e => e.status === 'finished').length;
  const disconnectedCount = entries.filter(e => isDisconnected(e)).length;
  const playingCount = entries.filter(e => e.status === 'playing' && !isDisconnected(e)).length;
  const isPaused = tournamentDoc?.paused === true;
  const scale = getScaleConfig(entries.length);

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

  // ── Action handlers ────────────────────────────────────────
  const handleCreateTournament = () => createTournament(eventCode);
  const handleStartRound = async () => { await startRoundWithCountdown(eventCode, 5000); setConfirmAction(null); };
  const handleCloseRound = async () => {
    const { advancing, cutoffScore } = computeAdvancing();
    await closeRound(eventCode, currentRound, advancing, cutoffScore);
    setConfirmAction(null);
  };
  const handleAdvanceToNext = async () => {
    if (isAdvancingRef.current) return; // Prevent double-advance
    isAdvancingRef.current = true;
    try {
      if (currentRound >= 3) await finishTournament(eventCode);
      else await advanceToNextRound(eventCode, currentRound + 1);
    } catch { isAdvancingRef.current = false; }
    setConfirmAction(null);
  };
  const handleReset = async () => { await resetTournament(eventCode); setConfirmAction(null); };
  const handlePauseToggle = () => isPaused ? resumeRound(eventCode) : pauseRound(eventCode);
  const handleKick = (teamKey) => kickTeam(eventCode, teamKey);

  // ══════════════════════════════════════════════════════════
  // PIN SCREEN
  // ══════════════════════════════════════════════════════════
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
          <div className="font-mono text-xl font-bold tracking-[0.3em] text-green-400/60 mb-6">ADMIN ACCESS</div>
          <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} autoFocus
            className={`w-40 px-4 py-3 bg-gray-900/80 border rounded-lg text-center font-mono text-lg tracking-[0.3em] focus:outline-none
              ${pinError ? 'border-red-500 text-red-400' : 'border-gray-700 text-green-400 focus:border-green-500'}`}
            placeholder="PIN" />
          <div className={`font-mono text-xs mt-2 h-4 tracking-wider ${pinError ? 'text-red-400' : 'text-transparent'}`}>WRONG PIN</div>
        </form>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // LOADING
  // ══════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="font-mono text-green-400/50 tracking-widest animate-pulse">CONNECTING...</div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // NO TOURNAMENT YET — CREATE
  // ══════════════════════════════════════════════════════════
  if (!tournamentDoc) {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-2xl font-bold tracking-[0.2em] text-green-400 mb-2">IRON DOME COMMAND</div>
          <div className="font-mono text-sm text-gray-500 tracking-widest mb-8">{eventCode} TOURNAMENT</div>
          <button onClick={handleCreateTournament}
            className="px-8 py-4 bg-green-900/40 border-2 border-green-500/60 rounded-xl font-mono text-lg tracking-widest text-green-400 hover:bg-green-900/60 transition-all cursor-pointer"
            style={{ textShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
            HOST TOURNAMENT
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // LEADERBOARD ROW RENDERER (shared between active/complete)
  // ══════════════════════════════════════════════════════════
  const renderLeaderboardRow = (entry, i) => {
    const rank = i + 1;
    const advancingTeams = tournamentDoc?.rounds?.[currentRound]?.advancingTeams;
    const isQualifying = advancingTeams
      ? advancingTeams.includes(sanitizeTeamKey(entry.name))
      : rank <= qualifyCount;
    const isClosed = roundClosed && revealPhase !== 'revealing';
    const isRevealing = revealPhase === 'revealing';
    const isRevealed = !isRevealing || i <= revealedIndex;
    const isAdvancing = isClosed && isQualifying;
    const isEliminated = isClosed && !isQualifying;

    if (isRevealing && !isRevealed) return null;

    const hasRecentChange = recentChanges[entry.name] && (Date.now() - recentChanges[entry.name].time < 2500);
    const delta = hasRecentChange ? recentChanges[entry.name].delta : 0;
    const isLeader = rank === 1 && !isClosed;

    let bgColor = 'rgba(17,24,39,0.6)';
    let borderColor = '#1e2736';
    let nameColor = '#e5e7eb';
    let scoreColor = '#94a3b8';
    let rankColor = '#6b7280';
    let rowGlow = 'none';

    if (isAdvancing) {
      bgColor = 'rgba(34,197,94,0.06)'; borderColor = '#22c55e40';
      nameColor = '#e5e7eb'; scoreColor = '#67e8f9'; rankColor = '#22c55e';
    } else if (isEliminated) {
      bgColor = 'rgba(17,24,39,0.3)'; borderColor = '#1e273640';
      nameColor = '#4b5563'; scoreColor = '#4b5563'; rankColor = '#374151';
    } else if (isLeader) {
      bgColor = 'rgba(234,179,8,0.08)'; borderColor = '#eab30850';
      rankColor = '#eab308'; nameColor = '#fbbf24'; scoreColor = '#fbbf24';
      rowGlow = '0 0 30px rgba(234,179,8,0.1)';
    } else if (rank <= 3) {
      rankColor = '#9ca3af'; scoreColor = '#cbd5e1';
    }

    if (hasRecentChange && !isEliminated) {
      borderColor = '#22c55e80'; rowGlow = '0 0 20px rgba(34,197,94,0.15)';
    }

    const showCutoff = !isClosed && rank === qualifyCount && i < entries.length - 1;

    return (
      <div key={entry.name}>
        <div className={`flex items-center gap-4 px-6 ${scale.rowPy} rounded-xl ${isEliminated ? 'opacity-40' : ''}`}
          style={{ background: bgColor, border: `1px solid ${borderColor}`, boxShadow: rowGlow, transition: 'all 0.6s ease-out' }}>
          <div className={`${scale.rankW} text-center font-mono ${scale.rankSize} font-black`}
            style={{ color: rankColor, textShadow: isLeader ? '0 0 20px rgba(234,179,8,0.4)' : 'none' }}>
            {isLeader ? '★' : rank}
          </div>
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className={`font-mono ${scale.nameSize} font-bold tracking-wider truncate`}
              style={{ color: nameColor, textShadow: isLeader ? '0 0 15px rgba(251,191,36,0.3)' : 'none' }}>
              {entry.name}
            </div>
            {!isClosed && entry.status === 'playing' && (
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {entry.currentLevel && (
                  <span className={`font-mono ${scale.levelSize} tracking-widest text-green-400/60`}>L{entry.currentLevel}</span>
                )}
              </div>
            )}
            {!isClosed && entry.status === 'finished' && (
              <div className="flex items-center gap-1 shrink-0">
                <span className={`text-green-400 ${scale.statusSize}`}>✓</span>
                <span className={`font-mono ${scale.levelSize} tracking-widest text-green-400/60`}>DONE</span>
              </div>
            )}
          </div>
          {isAdvancing && (
            <div className={`px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 font-mono ${scale.statusSize} tracking-widest text-green-400 font-bold animate-pulse shrink-0`}>
              ADVANCING
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {hasRecentChange && delta > 0 && !isEliminated && (
              <span className="font-mono text-sm font-bold text-green-400/80 tabular-nums"
                style={{ animation: 'deltaFade 2.5s ease-out forwards' }}>
                +{delta.toLocaleString()}
              </span>
            )}
            <AnimatedScore value={entry.score || 0} color={scoreColor}
              className={`font-mono ${scale.scoreSize} font-black tabular-nums`} />
          </div>
        </div>
        {showCutoff && (
          <div className="flex items-center gap-3 px-6 py-1">
            <div className="flex-1 h-px bg-green-500/30" />
            <span className="font-mono text-[10px] tracking-widest text-green-500/50">TOP {qualifyCount} ADVANCE</span>
            <div className="flex-1 h-px bg-green-500/30" />
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════
  // MAIN UNIFIED HOST SCREEN
  // ══════════════════════════════════════════════════════════
  return (
    <div className="h-screen bg-[#0a0e1a] flex flex-col overflow-hidden relative">
      {/* CSS Animations */}
      <style>{`
        @keyframes radarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes lobbySlideIn { from { opacity: 0; transform: translateY(20px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes deltaFade { 0% { opacity: 0; transform: translateX(-10px); } 15% { opacity: 1; transform: translateX(0); } 70% { opacity: 1; } 100% { opacity: 0; } }
      `}</style>

      {/* Confirmation dialogs */}
      {confirmAction === 'start' && (
        <ConfirmDialog message={`Start ${roundLabel}? All ${teamCount} teams will begin the countdown.`}
          onConfirm={handleStartRound} onCancel={() => setConfirmAction(null)} />
      )}
      {confirmAction === 'close' && (
        <ConfirmDialog message={`Close ${roundLabel}? Top ${advanceType === 'percentage' ? `${advanceValue}%` : advanceValue} will advance.${playingCount > 0 ? ` WARNING: ${playingCount} teams still playing!` : ''}`}
          onConfirm={handleCloseRound} onCancel={() => setConfirmAction(null)} />
      )}
      {confirmAction === 'advance' && (
        <ConfirmDialog message={currentRound >= 3 ? 'End the tournament and show final results?' : `Advance to Round ${currentRound + 1}?`}
          onConfirm={handleAdvanceToNext} onCancel={() => setConfirmAction(null)} />
      )}
      {confirmAction === 'reset' && (
        <ConfirmDialog message="Reset tournament? All teams and scores will be cleared."
          onConfirm={handleReset} onCancel={() => setConfirmAction(null)} />
      )}

      {/* Accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #22c55e60, transparent)' }} />

      {/* ── HEADER (spectator-style, large) ── */}
      <div className="flex items-center justify-between px-8 py-6">
        <div>
          <div className="font-mono text-3xl font-black tracking-[0.3em] text-green-400"
            style={{ textShadow: '0 0 40px rgba(34,197,94,0.3)' }}>
            IRON DOME COMMAND
          </div>
          <div className="font-mono text-lg tracking-[0.2em] text-gray-400 mt-1">
            {eventCode} TOURNAMENT
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-bold tracking-[0.25em]"
            style={{ color: currentRound === 3 ? '#f43f5e' : currentRound === 2 ? '#a855f7' : '#22c55e' }}>
            {roundLabel}
          </div>
          <div className="font-mono text-sm text-gray-500 tracking-widest mt-1">
            ROUND {currentRound} OF 3
            {isPaused && <span className="text-yellow-400 ml-3">⏸ PAUSED</span>}
          </div>
        </div>
      </div>

      {/* Offline banner */}
      {offline && (
        <div className="mx-8 mb-2 px-4 py-2 rounded bg-yellow-950/80 border border-yellow-600 text-yellow-400 font-mono text-sm text-center tracking-wider">
          OFFLINE — scores may be delayed
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 px-8 pb-6 overflow-hidden">

        {/* ══ LOBBY ══ */}
        {roundStatus === 'lobby' && (
          <div className="h-full flex flex-col items-center justify-center">
            {/* Game code */}
            <div className="text-center mb-6">
              <div className="font-mono text-lg text-gray-500 tracking-widest mb-2">GO TO kipat-barzel.org</div>
              <div className="font-mono text-sm text-gray-600 tracking-wider mb-1">ENTER CODE</div>
              <div className="font-mono text-5xl font-black text-green-400 tracking-[0.4em]"
                style={{ textShadow: '0 0 40px rgba(34,197,94,0.3)' }}>
                {eventCode}
              </div>
            </div>

            {/* Team count */}
            <div className="font-mono text-3xl font-bold text-green-400/80 mb-6 tabular-nums">
              {lobbyTeams.length} <span className="text-lg text-green-400/50 tracking-widest">TEAMS DEPLOYED</span>
            </div>

            {/* Team grid */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mb-8">
              {lobbyTeams.map((team, i) => (
                <div key={team.key}
                  className="px-4 py-2 bg-gray-900/60 border border-green-500/20 rounded-lg flex items-center gap-2"
                  style={{ animation: `lobbySlideIn 0.4s ease-out ${i * 0.05}s both` }}>
                  {team.emoji && <span className="text-lg">{team.emoji}</span>}
                  <span className="font-mono text-sm font-bold text-green-400 tracking-wider">{team.name}</span>
                </div>
              ))}
            </div>

            {lobbyTeams.length === 0 && (
              <div className="mt-4"><RadarWaiting eventCode={eventCode} /></div>
            )}

            {/* START ROUND button — integrated into display */}
            {teamCount >= 2 && (
              <button onClick={() => setConfirmAction('start')}
                className="mt-4 px-12 py-4 bg-green-900/40 border-2 border-green-500/60 rounded-xl
                  font-mono text-xl tracking-widest text-green-400 hover:bg-green-900/60
                  transition-all cursor-pointer"
                style={{ textShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
                START {roundLabel}
              </button>
            )}
          </div>
        )}

        {/* ══ CHAMPION REVEAL ══ */}
        {roundStatus === 'finished' && championReveal ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              {championReveal === 'runner_up' && entries.length >= 2 && (
                <div className="animate-pulse">
                  <div className="font-mono text-xs tracking-[0.4em] text-gray-400 mb-4">RUNNER-UP</div>
                  <div className="text-4xl mb-2">{entries[1]?.name?.match(/^[\p{Emoji}]/u)?.[0] || '🥈'}</div>
                  <div className="font-mono text-2xl font-bold text-gray-300 tracking-wider mb-2">{entries[1]?.name?.replace(/^[\p{Emoji}\s]+/u, '') || entries[1]?.name}</div>
                  <div className="font-mono text-xl text-gray-400 tabular-nums">{(entries[1]?.score || 0).toLocaleString()}</div>
                </div>
              )}
              {(championReveal === 'champion' || championReveal === 'hold') && entries.length >= 1 && (
                <div>
                  {entries.length >= 2 && (
                    <div className="mb-8 opacity-50">
                      <div className="font-mono text-xs tracking-[0.4em] text-gray-500 mb-1">RUNNER-UP</div>
                      <div className="font-mono text-lg text-gray-400">{entries[1]?.name} — {(entries[1]?.score || 0).toLocaleString()}</div>
                    </div>
                  )}
                  <div className="font-mono text-xs tracking-[0.4em] text-yellow-500 mb-4">CHAMPION</div>
                  <div className="text-6xl mb-3">🏆</div>
                  <div className="font-mono text-4xl font-black text-yellow-400 tracking-wider mb-3"
                    style={{ textShadow: '0 0 40px rgba(234,179,8,0.4)' }}>
                    {entries[0]?.name}
                  </div>
                  <div className="font-mono text-3xl font-bold text-yellow-400 tabular-nums"
                    style={{ textShadow: '0 0 30px rgba(234,179,8,0.3)' }}>
                    {(entries[0]?.score || 0).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : /* ══ REVEAL DIMMING ══ */
        revealPhase === 'dimming' ? (
          <div className="h-full flex items-center justify-center">
            <div className="font-mono text-3xl text-green-400/60 tracking-[0.4em] animate-pulse">
              RESULTS INCOMING...
            </div>
          </div>
        ) : /* ══ ACTIVE / COMPLETE LEADERBOARD ══ */
        (roundStatus === 'active' || roundStatus === 'complete' || roundStatus === 'finished') && entries.length > 0 ? (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Progress bar (active phase only) */}
            {roundStatus === 'active' && (
              <div className="text-center mb-4 shrink-0">
                <div className="font-mono text-lg text-gray-400 tracking-widest">
                  <span className="text-green-400 font-bold text-2xl">{finishedCount}</span>
                  <span className="text-gray-600 mx-1">/</span>
                  <span>{entries.length || teamCount}</span>
                  <span className="text-gray-600 ml-2 text-sm">FINISHED</span>
                  {playingCount > 0 && <span className="text-gray-500 ml-3 text-sm">• {playingCount} PLAYING</span>}
                  {disconnectedCount > 0 && <span className="text-red-400/70 ml-3 text-sm">• {disconnectedCount} DC</span>}
                </div>
                {autoCloseCountdown !== null && (
                  <div className="font-mono text-sm text-orange-400 tracking-wider mt-1">
                    AUTO-CLOSING IN {autoCloseCountdown}s
                  </div>
                )}
              </div>
            )}

            {/* Complete phase header */}
            {roundStatus === 'complete' && revealPhase === 'done' && (
              <div className="text-center mb-4 shrink-0">
                <div className="font-mono text-lg font-bold tracking-[0.2em] text-green-400">
                  {roundLabel} COMPLETE
                </div>
                {autoAdvanceCountdown !== null && (
                  <div className="font-mono text-sm text-orange-400 tracking-wider mt-1">
                    AUTO-ADVANCING IN {autoAdvanceCountdown}s
                  </div>
                )}
              </div>
            )}

            {/* Leaderboard rows */}
            <div className={`flex flex-col ${scale.gap} flex-1 overflow-y-auto`}>
              {entries.map((entry, i) => renderLeaderboardRow(entry, i))}
            </div>

            {/* Bottom action buttons (integrated into display) */}
            {roundStatus === 'active' && (
              <div className="shrink-0 mt-4 flex justify-center">
                <button onClick={() => setConfirmAction('close')}
                  className="px-8 py-3 rounded-xl font-mono text-base tracking-widest
                    bg-orange-900/30 border-2 border-orange-500/50 text-orange-400
                    hover:bg-orange-900/50 transition-all cursor-pointer">
                  CLOSE {roundLabel}
                </button>
              </div>
            )}

            {roundStatus === 'complete' && revealPhase === 'done' && (
              <div className="shrink-0 mt-4 flex justify-center gap-4">
                <button onClick={() => downloadCSV(entries, eventCode, currentRound)}
                  className="px-6 py-3 rounded-xl font-mono text-sm tracking-widest
                    bg-gray-800/50 border border-gray-700 text-gray-400
                    hover:bg-gray-700/50 transition-all cursor-pointer">
                  EXPORT CSV
                </button>
                <button onClick={() => {
                  if (autoAdvanceRef.current) { clearInterval(autoAdvanceRef.current); autoAdvanceRef.current = null; }
                  setAutoAdvanceCountdown(null);
                  setConfirmAction('advance');
                }}
                  className="px-8 py-3 rounded-xl font-mono text-base tracking-widest
                    bg-green-900/40 border-2 border-green-500/60 text-green-400
                    hover:bg-green-900/60 transition-all cursor-pointer"
                  style={{ textShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
                  {currentRound >= 3 ? 'END TOURNAMENT' : `ADVANCE TO ROUND ${currentRound + 1}`}
                </button>
              </div>
            )}

            {roundStatus === 'finished' && !championReveal && (
              <div className="shrink-0 mt-4 flex justify-center gap-4">
                <button onClick={() => downloadCSV(entries, eventCode, currentRound)}
                  className="px-6 py-3 rounded-xl font-mono text-sm tracking-widest
                    bg-gray-800/50 border border-gray-700 text-gray-400
                    hover:bg-gray-700/50 transition-all cursor-pointer">
                  EXPORT FINAL CSV
                </button>
                <button onClick={() => setConfirmAction('reset')}
                  className="px-8 py-3 rounded-xl font-mono text-sm tracking-widest
                    bg-gray-800/50 border border-gray-700 text-gray-400
                    hover:bg-gray-700/50 transition-all cursor-pointer">
                  NEW TOURNAMENT
                </button>
              </div>
            )}
          </div>
        ) : /* ══ WAITING FOR SCORES (active, no entries yet) ══ */
        roundStatus === 'active' ? (
          <RadarWaiting eventCode={eventCode} />
        ) : null}
      </div>

      {/* ── FLOATING ADMIN PANEL ── */}
      {panelOpen && (
        <div className="absolute bottom-16 right-4 w-80 max-h-[60vh] overflow-y-auto z-50
          bg-gray-900/95 backdrop-blur-md border border-gray-700/80 rounded-xl shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>

          <div className="px-4 py-3 border-b border-gray-800/50 flex items-center justify-between">
            <div className="font-mono text-xs text-green-400 tracking-widest font-bold">ADMIN CONTROLS</div>
            <button onClick={() => setPanelOpen(false)}
              className="font-mono text-xs text-gray-500 hover:text-gray-300 cursor-pointer">✕</button>
          </div>

          <div className="p-4 space-y-4">
            {/* Advancement config */}
            {(roundStatus === 'lobby' || roundStatus === 'active') && (
              <div>
                <div className="font-mono text-[10px] text-gray-500 tracking-wider mb-2">ADVANCEMENT</div>
                <div className="flex items-center gap-2">
                  <select value={advanceType} onChange={(e) => {
                    setAdvanceType(e.target.value);
                    updateAdvanceConfig(eventCode, currentRound, { type: e.target.value, value: advanceValue });
                  }}
                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1 font-mono text-xs text-green-400 focus:outline-none">
                    <option value="percentage">TOP %</option>
                    <option value="count">TOP #</option>
                  </select>
                  <input type="number" value={advanceValue} onChange={(e) => {
                    const v = parseInt(e.target.value) || 1;
                    setAdvanceValue(v);
                    updateAdvanceConfig(eventCode, currentRound, { type: advanceType, value: v });
                  }}
                    className="w-14 bg-gray-800 border border-gray-700 rounded px-2 py-1 font-mono text-xs text-green-400 text-center focus:outline-none" />
                  <span className="font-mono text-[10px] text-gray-500">
                    {advanceType === 'percentage' ? `(${Math.ceil(teamCount * advanceValue / 100)})` : `of ${teamCount}`}
                  </span>
                </div>
              </div>
            )}

            {/* Pause/Resume */}
            {roundStatus === 'active' && (
              <button onClick={handlePauseToggle}
                className={`w-full py-2 rounded-lg font-mono text-xs tracking-wider cursor-pointer border
                  ${isPaused
                    ? 'bg-green-900/30 border-green-500/50 text-green-400 hover:bg-green-900/50'
                    : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400 hover:bg-yellow-900/50'
                  }`}>
                {isPaused ? 'RESUME ALL' : 'PAUSE ALL'}
              </button>
            )}

            {/* Team list with kick (lobby) */}
            {roundStatus === 'lobby' && activeTeams.length > 0 && (
              <div>
                <div className="font-mono text-[10px] text-gray-500 tracking-wider mb-2">TEAMS ({teamCount})</div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {activeTeams.map(([key, team]) => (
                    <div key={key} className="flex items-center justify-between py-1 px-2 bg-gray-800/50 rounded">
                      <span className="font-mono text-xs text-gray-300 truncate">
                        {team.emoji && <span className="mr-1">{team.emoji}</span>}{team.name}
                      </span>
                      <button onClick={() => handleKick(key)}
                        className="font-mono text-[9px] text-gray-600 hover:text-red-400 cursor-pointer shrink-0 ml-2">
                        KICK
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reset */}
            <button onClick={() => setConfirmAction('reset')}
              className="w-full py-2 rounded-lg font-mono text-[10px] tracking-widest
                bg-gray-800/50 border border-gray-700 text-gray-500
                hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer">
              RESET TOURNAMENT
            </button>
          </div>
        </div>
      )}

      {/* ── BOTTOM BAR ── */}
      <div className="px-8 py-3 border-t border-gray-800/50 flex items-center justify-between">
        <div className="font-mono text-[10px] text-gray-600 tracking-wider">
          Players: kipat-barzel.org → code {eventCode}
          {roundStatus === 'active' && (
            <span className="ml-4">{finishedCount}/{entries.length} finished</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[10px] text-gray-700 tracking-wider">
            Press A for controls
          </div>
          <button onClick={() => setPanelOpen(prev => !prev)}
            className={`w-8 h-8 rounded-lg border font-mono text-sm flex items-center justify-center cursor-pointer transition-all
              ${panelOpen
                ? 'bg-green-900/40 border-green-500/50 text-green-400'
                : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:text-gray-300'
              }`}>
            ⚙
          </button>
        </div>
      </div>
    </div>
  );
}
