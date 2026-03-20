import { useState, useEffect, useRef, useCallback } from 'react';
import { subscribeLeaderboard } from '../utils/leaderboard.js';
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
      if (e.key === 'ArrowUp') setQualifyCount(prev => Math.min(prev + 1, 20));
      if (e.key === 'ArrowDown') setQualifyCount(prev => Math.max(prev - 1, 1));
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
          <div className="font-mono text-lg tracking-[0.2em] text-green-400/60 mt-1">
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

      {/* Leaderboard */}
      <div className="flex-1 px-8 pb-6 overflow-hidden">
        {entries.length === 0 ? (
          <RadarWaiting eventCode={eventCode} currentRound={currentRound} />
        ) : (
          <div className={`flex flex-col ${scale.gap} h-full overflow-y-auto`}>
            {entries.map((entry, i) => {
              const rank = i + 1;
              const isQualifying = rank <= qualifyCount;
              const isClosed = roundClosed;
              const isAdvancing = isClosed && isQualifying;
              const isEliminated = isClosed && !isQualifying;
              const hasRecentChange = recentChanges[entry.name] && (Date.now() - recentChanges[entry.name].time < 2500);
              const delta = hasRecentChange ? recentChanges[entry.name].delta : 0;
              const isLeader = rank === 1 && !isClosed;

              let bgColor = 'rgba(17,24,39,0.6)';
              let borderColor = '#1e2736';
              let nameColor = '#e5e7eb';
              let scoreColor = '#22c55e';
              let rankColor = '#6b7280';
              let rowGlow = 'none';

              if (isAdvancing) {
                bgColor = 'rgba(34,197,94,0.08)';
                borderColor = '#22c55e50';
                nameColor = '#22c55e';
                scoreColor = '#22c55e';
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
                    {isEliminated && (
                      <div className={`px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/40 font-mono ${scale.statusSize} tracking-widest text-gray-600 shrink-0`}>
                        ELIMINATED
                      </div>
                    )}

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
