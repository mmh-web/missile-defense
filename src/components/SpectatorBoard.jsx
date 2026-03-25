import { useState, useEffect, useRef, useCallback } from 'react';
import { subscribeLeaderboard, subscribeTournament, sanitizeTeamKey } from '../utils/leaderboard.js';
import { ROUND_CONFIGS } from '../hooks/useGameEngine.js';

// Sound effects for spectator board
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

// ── Animated Score Component ───────────────────────────────────
function AnimatedScore({ value, color, className }) {
  const [displayValue, setDisplayValue] = useState(value);
  const animRef = useRef(null);
  const startRef = useRef(value);
  const targetRef = useRef(value);

  useEffect(() => {
    if (value === targetRef.current) return;
    const from = displayValue;
    const to = value;
    startRef.current = from;
    targetRef.current = to;
    const startTime = performance.now();
    const duration = 800;

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [value]);

  return (
    <span className={className} style={{ color }}>
      {displayValue.toLocaleString()}
    </span>
  );
}

// ── Auto-scaling config ────────────────────────────────────────
function getScaleConfig(count) {
  if (count <= 5) return { rowPy: 'py-5', nameSize: 'text-3xl', scoreSize: 'text-4xl', rankSize: 'text-3xl', gap: 'gap-3', statusSize: 'text-sm', levelSize: 'text-xs', rankW: 'w-16' };
  if (count <= 10) return { rowPy: 'py-3', nameSize: 'text-xl', scoreSize: 'text-2xl', rankSize: 'text-2xl', gap: 'gap-2', statusSize: 'text-xs', levelSize: 'text-[10px]', rankW: 'w-12' };
  if (count <= 15) return { rowPy: 'py-2', nameSize: 'text-lg', scoreSize: 'text-xl', rankSize: 'text-xl', gap: 'gap-1.5', statusSize: 'text-[10px]', levelSize: 'text-[9px]', rankW: 'w-10' };
  return { rowPy: 'py-1.5', nameSize: 'text-base', scoreSize: 'text-lg', rankSize: 'text-lg', gap: 'gap-1', statusSize: 'text-[9px]', levelSize: 'text-[8px]', rankW: 'w-9' };
}

// ── Radar Sweep Waiting Animation ──────────────────────────────
function RadarWaiting({ eventCode, currentRound }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        {/* Radar sweep SVG */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Concentric circles */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.15" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.1" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.08" />
            {/* Cross hairs */}
            <line x1="50" y1="5" x2="50" y2="95" stroke="#22c55e" strokeWidth="0.3" opacity="0.1" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="#22c55e" strokeWidth="0.3" opacity="0.1" />
            {/* Sweep line */}
            <line x1="50" y1="50" x2="50" y2="5" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"
              style={{ transformOrigin: '50px 50px', animation: 'radarSweep 3s linear infinite' }} />
            {/* Sweep gradient trail */}
            <path d="M50,50 L50,5 A45,45 0 0,1 81.8,18.2 Z" fill="url(#sweepGrad)"
              style={{ transformOrigin: '50px 50px', animation: 'radarSweep 3s linear infinite' }} />
            <defs>
              <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Center dot */}
            <circle cx="50" cy="50" r="2" fill="#22c55e" opacity="0.6" />
          </svg>
          <style>{`
            @keyframes radarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
        <div className="font-mono text-2xl text-green-500/50 tracking-[0.4em] mb-4"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          SCANNING FOR TEAMS
        </div>
        <div className="font-mono text-sm text-gray-700 tracking-wider">
          kipat-barzel.org?event={eventCode}&round={currentRound}
        </div>
      </div>
    </div>
  );
}

export default function SpectatorBoard({ eventCode }) {
  const [entries, setEntries] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [qualifyCount, setQualifyCount] = useState(5);
  const [roundClosed, setRoundClosed] = useState(false);
  const [offline, setOffline] = useState(false);
  const [recentChanges, setRecentChanges] = useState({}); // { teamName: { delta, time } }
  const prevTopRef = useRef(null);
  const prevCountRef = useRef(0);
  const prevScoresRef = useRef({}); // { teamName: score }
  const prevRanksRef = useRef({}); // { teamName: rankIndex }

  // Tournament V2 state
  const [tournamentDoc, setTournamentDoc] = useState(null);
  const [lobbyTeams, setLobbyTeams] = useState([]); // array of { name, emoji, joinedAt }
  const [revealPhase, setRevealPhase] = useState(null); // null | 'dimming' | 'revealing' | 'done'
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [championReveal, setChampionReveal] = useState(null); // null | 'runner_up' | 'champion' | 'hold'
  const prevTeamCountRef = useRef(0);
  const lobbyAudioRef = useRef(null);

  // Lobby music — play during lobby phase, stop when round starts
  useEffect(() => {
    const isLobby = tournamentDoc?.roundStatus === 'lobby';
    if (isLobby && !lobbyAudioRef.current) {
      const basePath = import.meta.env.BASE_URL || '/missile-defense/';
      const audio = new Audio(`${basePath}sounds/briefing-music.mp3`);
      audio.loop = true;
      audio.volume = 0.35;
      audio.play().catch(() => {}); // Autoplay may be blocked until user interaction
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

  // Subscribe to tournament doc (V2)
  useEffect(() => {
    const unsub = subscribeTournament(eventCode, (doc) => {
      setTournamentDoc(doc);
      if (doc) {
        // Sync round from tournament doc
        setCurrentRound(doc.currentRound || 1);

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

        // Play sound for new team joins
        if (teamList.length > prevTeamCountRef.current && prevTeamCountRef.current > 0) {
          playNewScoreSound();
          // Milestone chimes at 10, 20, 30, 40
          if (teamList.length % 10 === 0) {
            playNewLeaderSound();
          }
        }
        prevTeamCountRef.current = teamList.length;
        setLobbyTeams(teamList);

        // Auto-close round based on tournament doc
        if (doc.roundStatus === 'complete') {
          setRoundClosed(true);
        } else {
          setRoundClosed(false);
          // Reset reveal animation state when round changes (prevents re-triggering)
          setRevealPhase(null);
          setRevealedIndex(-1);
          setChampionReveal(null);
        }
      }
    });
    return unsub;
  }, [eventCode]);

  // Trigger reveal animation when round closes
  useEffect(() => {
    if (!roundClosed || tournamentDoc?.roundStatus !== 'complete') return;
    if (revealPhase) return; // Already revealing

    // Start reveal sequence
    setRevealPhase('dimming');
    setRevealedIndex(-1);

    // After 3s dim, start row-by-row reveal
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
      }, 300); // 300ms per row
    }, 3000);

    return () => clearTimeout(dimTimer);
  }, [roundClosed]);

  // Champion reveal after R3
  useEffect(() => {
    if (!tournamentDoc || tournamentDoc.roundStatus !== 'finished' || (tournamentDoc.currentRound || 1) < 3) return;
    if (championReveal) return;

    // Start champion reveal sequence
    setTimeout(() => setChampionReveal('runner_up'), 2000);
    setTimeout(() => setChampionReveal('champion'), 5000);
    setTimeout(() => setChampionReveal('hold'), 8000);
  }, [tournamentDoc?.roundStatus]);

  const isV2Tournament = !!tournamentDoc;
  const roundStatus = tournamentDoc?.roundStatus || 'lobby';

  const roundLabel = ROUND_CONFIGS[currentRound]?.label || `ROUND ${currentRound}`;
  const roundEventCode = `${eventCode}-R${currentRound}`;
  const scale = getScaleConfig(entries.length);

  // Subscribe to real-time leaderboard for current round
  useEffect(() => {
    setRoundClosed(false);
    setOffline(false);
    prevTopRef.current = null;
    prevCountRef.current = 0;
    prevScoresRef.current = {};
    prevRanksRef.current = {};
    setRecentChanges({});

    const unsub = subscribeLeaderboard('CAMPAIGN', (newEntries) => {
      setOffline(false);

      // Detect score changes for delta badges
      const changes = {};
      newEntries.forEach((entry) => {
        const prev = prevScoresRef.current[entry.name];
        if (prev !== undefined && entry.score > prev) {
          changes[entry.name] = { delta: entry.score - prev, time: Date.now() };
        }
      });

      // Update previous scores
      const newScores = {};
      newEntries.forEach((entry) => { newScores[entry.name] = entry.score || 0; });
      prevScoresRef.current = newScores;

      // Update previous ranks
      const newRanks = {};
      newEntries.forEach((entry, i) => { newRanks[entry.name] = i; });
      prevRanksRef.current = newRanks;

      if (Object.keys(changes).length > 0) {
        setRecentChanges(prev => ({ ...prev, ...changes }));
      }

      setEntries(prev => {
        // Detect new scores for sound effects
        if (newEntries.length > prevCountRef.current && prevCountRef.current > 0) {
          if (prevTopRef.current && newEntries[0]?.name !== prevTopRef.current) {
            playNewLeaderSound();
          } else {
            playNewScoreSound();
          }
        }
        prevCountRef.current = newEntries.length;
        prevTopRef.current = newEntries[0]?.name || null;
        return newEntries;
      });
    }, roundEventCode);

    return unsub;
  }, [currentRound, roundEventCode]);

  // Offline detection — if no data arrives in 30s while teams are playing, show warning
  const lastDataRef = useRef(Date.now());
  useEffect(() => {
    // Update last-data timestamp whenever entries change
    lastDataRef.current = Date.now();
  }, [entries]);
  useEffect(() => {
    const check = setInterval(() => {
      const hasPlayingTeams = entries.some(e => e.status === 'playing');
      if (hasPlayingTeams && Date.now() - lastDataRef.current > 30000) {
        setOffline(true);
      }
    }, 5000);
    return () => clearInterval(check);
  }, [entries]);

  // Clean up old delta badges
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRecentChanges(prev => {
        const next = {};
        let changed = false;
        for (const [name, info] of Object.entries(prev)) {
          if (now - info.time < 2500) {
            next[name] = info;
          } else {
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts for facilitator control
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key >= '1' && e.key <= '3') {
        setCurrentRound(parseInt(e.key, 10));
      }
      if (e.key === 'c' || e.key === 'C') {
        setRoundClosed(prev => !prev);
      }
      if (e.key === 'ArrowUp') { e.preventDefault(); setQualifyCount(prev => Math.min(prev + 1, 20)); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setQualifyCount(prev => Math.max(prev - 1, 1)); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="h-screen bg-[#0a0e1a] flex flex-col overflow-hidden relative"
      style={{ cursor: 'none' }}>
      {/* Accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #22c55e60, transparent)' }} />

      {/* Header */}
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
          </div>
        </div>
      </div>

      {/* Offline banner */}
      {offline && (
        <div className="mx-8 mb-2 px-4 py-2 rounded bg-yellow-950/80 border border-yellow-600 text-yellow-400 font-mono text-sm text-center tracking-wider">
          OFFLINE — scores may be delayed
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-8 pb-6 overflow-hidden">
        {/* V2 Tournament Lobby */}
        {isV2Tournament && roundStatus === 'lobby' ? (
          <div className="h-full flex flex-col items-center justify-center">
            {/* Game code + instructions */}
            <div className="text-center mb-8">
              <div className="font-mono text-lg text-gray-500 tracking-widest mb-2">
                GO TO kipat-barzel.org
              </div>
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

            {/* Team grid — names pop in */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
              {lobbyTeams.map((team, i) => (
                <div key={team.key}
                  className="px-4 py-2 bg-gray-900/60 border border-green-500/20 rounded-lg
                    flex items-center gap-2 lobby-team-enter"
                  style={{
                    animation: `lobbySlideIn 0.4s ease-out ${i * 0.05}s both`,
                  }}>
                  {team.emoji && <span className="text-lg">{team.emoji}</span>}
                  <span className="font-mono text-sm font-bold text-green-400 tracking-wider">{team.name}</span>
                </div>
              ))}
            </div>

            {lobbyTeams.length === 0 && (
              <div className="mt-8">
                <RadarWaiting eventCode={eventCode} currentRound={currentRound} />
              </div>
            )}

            <style>{`
              @keyframes lobbySlideIn {
                from { opacity: 0; transform: translateY(20px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>
        ) : /* V2 Champion reveal */
        isV2Tournament && roundStatus === 'finished' && championReveal ? (
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
        ) : /* Reveal ceremony overlay */
        revealPhase === 'dimming' ? (
          <div className="h-full flex items-center justify-center">
            <div className="font-mono text-3xl text-green-400/60 tracking-[0.4em] animate-pulse">
              RESULTS INCOMING...
            </div>
          </div>
        ) : /* Normal leaderboard (or reveal in progress) */
        entries.length === 0 ? (
          <RadarWaiting eventCode={eventCode} currentRound={currentRound} />
        ) : (
          <div className={`flex flex-col ${scale.gap} h-full overflow-y-auto`}>
            {entries.map((entry, i) => {
              const rank = i + 1;
              // V2 tournament: use advancingTeams from tournament doc if available
              const advancingTeams = tournamentDoc?.rounds?.[currentRound]?.advancingTeams;
              const isQualifying = advancingTeams
                ? advancingTeams.includes(sanitizeTeamKey(entry.name))
                : rank <= qualifyCount;
              const isClosed = roundClosed && revealPhase !== 'revealing';
              const isRevealing = revealPhase === 'revealing';
              const isRevealed = !isRevealing || i <= revealedIndex;
              const isAdvancing = isClosed && isQualifying;
              const isEliminated = isClosed && !isQualifying;

              // Hide unrevealed rows during reveal animation
              if (isRevealing && !isRevealed) return null;
              const hasRecentChange = recentChanges[entry.name] && (Date.now() - recentChanges[entry.name].time < 2500);
              const delta = hasRecentChange ? recentChanges[entry.name].delta : 0;
              const isLeader = rank === 1 && !isClosed;

              let bgColor = 'rgba(17,24,39,0.6)';
              let borderColor = '#1e2736';
              let nameColor = '#e5e7eb';
              let scoreColor = '#94a3b8';  // slate-400 — clean, not green
              let rankColor = '#6b7280';
              let rowGlow = 'none';

              if (isAdvancing) {
                bgColor = 'rgba(34,197,94,0.06)';
                borderColor = '#22c55e40';
                nameColor = '#e5e7eb';       // keep names white for readability
                scoreColor = '#67e8f9';      // cyan — distinct from green badges
                rankColor = '#22c55e';
              } else if (isEliminated) {
                bgColor = 'rgba(17,24,39,0.3)';
                borderColor = '#1e273640';
                nameColor = '#4b5563';
                scoreColor = '#4b5563';
                rankColor = '#374151';
              } else if (isLeader) {
                bgColor = 'rgba(234,179,8,0.08)';
                borderColor = '#eab30850';
                rankColor = '#eab308';
                nameColor = '#fbbf24';
                scoreColor = '#fbbf24';
                rowGlow = '0 0 30px rgba(234,179,8,0.1)';
              } else if (rank <= 3) {
                rankColor = '#9ca3af';
                scoreColor = '#cbd5e1';  // slightly brighter for top 3
              }

              // Flash border on score change
              if (hasRecentChange && !isEliminated) {
                borderColor = '#22c55e80';
                rowGlow = '0 0 20px rgba(34,197,94,0.15)';
              }

              const showCutoff = !isClosed && rank === qualifyCount && i < entries.length - 1;

              return (
                <div key={entry.name}>
                  <div
                    className={`flex items-center gap-4 px-6 ${scale.rowPy} rounded-xl ${
                      isEliminated ? 'opacity-40' : ''
                    }`}
                    style={{
                      background: bgColor,
                      border: `1px solid ${borderColor}`,
                      boxShadow: rowGlow,
                      transition: 'all 0.6s ease-out',
                    }}
                  >
                    {/* Rank */}
                    <div className={`${scale.rankW} text-center font-mono ${scale.rankSize} font-black`} style={{
                      color: rankColor,
                      textShadow: isLeader ? '0 0 20px rgba(234,179,8,0.4)' : 'none',
                    }}>
                      {isLeader ? '★' : rank}
                    </div>

                    {/* Name + live status */}
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <div className={`font-mono ${scale.nameSize} font-bold tracking-wider truncate`} style={{
                        color: nameColor,
                        textShadow: isLeader ? '0 0 15px rgba(251,191,36,0.3)' : 'none',
                      }}>
                        {entry.name}
                      </div>
                      {/* Live status indicator */}
                      {!isClosed && entry.status === 'playing' && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          {entry.currentLevel && (
                            <span className={`font-mono ${scale.levelSize} tracking-widest text-green-400/60`}>
                              L{entry.currentLevel}
                            </span>
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

                    {/* Status badge (round closed) */}
                    {isAdvancing && (
                      <div className={`px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 font-mono ${scale.statusSize} tracking-widest text-green-400 font-bold animate-pulse shrink-0`}>
                        ADVANCING
                      </div>
                    )}
                    {/* Eliminated rows just dim — no harsh "ELIMINATED" text */}

                    {/* Score + delta badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Delta badge */}
                      {hasRecentChange && delta > 0 && !isEliminated && (
                        <span className="font-mono text-sm font-bold text-green-400/80 tabular-nums"
                          style={{
                            animation: 'deltaFade 2.5s ease-out forwards',
                          }}>
                          +{delta.toLocaleString()}
                        </span>
                      )}
                      {/* Animated score */}
                      <AnimatedScore
                        value={entry.score || 0}
                        color={scoreColor}
                        className={`font-mono ${scale.scoreSize} font-black tabular-nums`}
                      />
                    </div>
                  </div>

                  {/* Qualifying cutoff line */}
                  {showCutoff && (
                    <div className="flex items-center gap-3 px-6 py-1">
                      <div className="flex-1 h-px bg-green-500/30" />
                      <span className="font-mono text-[10px] tracking-widest text-green-500/50">TOP {qualifyCount} ADVANCE</span>
                      <div className="flex-1 h-px bg-green-500/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delta fade animation */}
      <style>{`
        @keyframes deltaFade {
          0% { opacity: 0; transform: translateX(-10px); }
          15% { opacity: 1; transform: translateX(0); }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Bottom controls hint (visible to facilitator) */}
      <div className="px-8 py-3 border-t border-gray-800/50 flex items-center justify-between">
        <div className="font-mono text-[10px] text-gray-700 tracking-wider">
          KEYS: 1-3 switch round | C close/open round | Up/Down adjust qualifier count ({qualifyCount})
        </div>
        <div className="font-mono text-[10px] text-gray-700 tracking-wider">
          {entries.length} TEAMS | {entries.filter(e => e.status === 'playing').length} PLAYING | {entries.filter(e => e.status === 'finished').length} FINISHED | {roundClosed ? 'ROUND CLOSED' : 'ROUND OPEN'}
        </div>
      </div>
    </div>
  );
}
