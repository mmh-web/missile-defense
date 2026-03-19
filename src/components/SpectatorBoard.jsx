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

export default function SpectatorBoard({ eventCode }) {
  const [entries, setEntries] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [qualifyCount, setQualifyCount] = useState(5);
  const [roundClosed, setRoundClosed] = useState(false);
  const [offline, setOffline] = useState(false);
  const prevTopRef = useRef(null);
  const prevCountRef = useRef(0);

  const roundLabel = ROUND_CONFIGS[currentRound]?.label || `ROUND ${currentRound}`;
  const roundEventCode = `${eventCode}-R${currentRound}`;

  // Subscribe to real-time leaderboard for current round
  useEffect(() => {
    setRoundClosed(false);
    setOffline(false);
    prevTopRef.current = null;
    prevCountRef.current = 0;

    const unsub = subscribeLeaderboard('CAMPAIGN', (newEntries) => {
      setOffline(false);
      setEntries(prev => {
        // Detect new scores for sound effects
        if (newEntries.length > prevCountRef.current && prevCountRef.current > 0) {
          // New score added
          if (prevTopRef.current && newEntries[0]?.name !== prevTopRef.current) {
            playNewLeaderSound(); // New #1!
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

  // Keyboard shortcuts for facilitator control
  useEffect(() => {
    const handleKey = (e) => {
      // 1-3: switch round
      if (e.key >= '1' && e.key <= '3') {
        setCurrentRound(parseInt(e.key, 10));
      }
      // C: close/open round
      if (e.key === 'c' || e.key === 'C') {
        setRoundClosed(prev => !prev);
      }
      // Up/Down: adjust qualify count
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
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-2xl text-gray-600 tracking-widest mb-4">WAITING FOR SCORES</div>
              <div className="font-mono text-sm text-gray-700 tracking-wider">
                Players join at: ?event={eventCode}&round={currentRound}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {entries.map((entry, i) => {
              const rank = i + 1;
              const isQualifying = rank <= qualifyCount;
              const isClosed = roundClosed;
              const isAdvancing = isClosed && isQualifying;
              const isEliminated = isClosed && !isQualifying;

              let bgColor = 'rgba(17,24,39,0.6)';
              let borderColor = '#1e2736';
              let nameColor = '#e5e7eb';
              let scoreColor = '#22c55e';
              let rankColor = '#6b7280';

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
              } else if (rank === 1) {
                bgColor = 'rgba(234,179,8,0.08)';
                borderColor = '#eab30840';
                rankColor = '#eab308';
              } else if (rank <= 3) {
                rankColor = '#9ca3af';
              }

              // Qualifying cutoff line
              const showCutoff = !isClosed && rank === qualifyCount && i < entries.length - 1;

              return (
                <div key={`${entry.name}-${entry.timestamp || i}`}>
                  <div
                    className={`flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-500 ${
                      isEliminated ? 'opacity-40' : ''
                    }`}
                    style={{ background: bgColor, border: `1px solid ${borderColor}` }}
                  >
                    {/* Rank */}
                    <div className="w-12 text-center font-mono text-2xl font-black" style={{ color: rankColor }}>
                      {rank === 1 && !isClosed ? '#' : ''}{rank}
                    </div>

                    {/* Name */}
                    <div className="flex-1 font-mono text-xl font-bold tracking-wider" style={{ color: nameColor }}>
                      {entry.name}
                    </div>

                    {/* Status badge */}
                    {isAdvancing && (
                      <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 font-mono text-xs tracking-widest text-green-400 font-bold animate-pulse">
                        ADVANCING
                      </div>
                    )}
                    {isEliminated && (
                      <div className="px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/40 font-mono text-xs tracking-widest text-gray-600">
                        ELIMINATED
                      </div>
                    )}

                    {/* Score */}
                    <div className="font-mono text-2xl font-black tabular-nums" style={{ color: scoreColor }}>
                      {entry.score?.toLocaleString() || 0}
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

      {/* Bottom controls hint (visible to facilitator) */}
      <div className="px-8 py-3 border-t border-gray-800/50 flex items-center justify-between">
        <div className="font-mono text-[10px] text-gray-700 tracking-wider">
          KEYS: 1-3 switch round | C close/open round | Up/Down adjust qualifier count ({qualifyCount})
        </div>
        <div className="font-mono text-[10px] text-gray-700 tracking-wider">
          {entries.length} SCORES | {roundClosed ? 'ROUND CLOSED' : 'ROUND OPEN'}
        </div>
      </div>
    </div>
  );
}
