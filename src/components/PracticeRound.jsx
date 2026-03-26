import { useState, useEffect, useCallback, useRef } from 'react';
import RadarDisplay, { mapToSVG, easeProgress } from './RadarDisplay';
import { IMPACT_POSITIONS } from '../config/threats';
import { getSpawnOrigin } from '../config/spawnOrigins';
import { LEVEL_VIEWPORTS } from '../config/mapLayers';

// ── Practice threats: 6 rockets, Iron Dome only ──────────────────
const PRACTICE_THREATS = [
  // T1-T3: Live rockets, sequential (guided interception)
  { id: 1, name: 'Qassam-1', type: 'rocket', speed_mach: 1.0, altitude_km: 5,
    trajectory: 'ballistic arc', impact_zone: 'Sderot', is_populated: true,
    correct_action: 'iron_dome', appear_time: 3, countdown: 8, intel: 'full',
    reveal_pct: 1.0, origin: 'gaza', priority: false, is_final_salvo: false },
  { id: 2, name: 'Qassam-2', type: 'rocket', speed_mach: 1.0, altitude_km: 5,
    trajectory: 'ballistic arc', impact_zone: 'Ashkelon', is_populated: true,
    correct_action: 'iron_dome', appear_time: 14, countdown: 8, intel: 'full',
    reveal_pct: 1.0, origin: 'gaza', priority: false, is_final_salvo: false },
  { id: 3, name: 'Qassam-3', type: 'rocket', speed_mach: 1.0, altitude_km: 5,
    trajectory: 'ballistic arc', impact_zone: 'Kfar Aza', is_populated: true,
    correct_action: 'iron_dome', appear_time: 25, countdown: 8, intel: 'full',
    reveal_pct: 1.0, origin: 'gaza', priority: false, is_final_salvo: false },
  // T4: Hold-fire (open ground)
  { id: 4, name: 'Qassam-4', type: 'rocket', speed_mach: 1.0, altitude_km: 5,
    trajectory: 'ballistic arc', impact_zone: 'Northern Negev', is_populated: false,
    correct_action: 'iron_dome', appear_time: 36, countdown: 8, intel: 'full',
    reveal_pct: 1.0, origin: 'gaza', priority: false, is_final_salvo: false },
  // T5-T6: Simultaneous live rockets (no hand-holding)
  { id: 5, name: 'Qassam-5', type: 'rocket', speed_mach: 1.0, altitude_km: 5,
    trajectory: 'ballistic arc', impact_zone: 'Netivot', is_populated: true,
    correct_action: 'iron_dome', appear_time: 47, countdown: 7, intel: 'full',
    reveal_pct: 1.0, origin: 'gaza', priority: false, is_final_salvo: false },
  { id: 6, name: 'Qassam-6', type: 'rocket', speed_mach: 1.0, altitude_km: 5,
    trajectory: 'ballistic arc', impact_zone: "Be'eri", is_populated: true,
    correct_action: 'iron_dome', appear_time: 47, countdown: 7, intel: 'full',
    reveal_pct: 1.0, origin: 'gaza', priority: false, is_final_salvo: false },
];

const PRACTICE_DURATION = 60; // seconds — enough for all threats + buffer
const PRACTICE_VIEWPORT = LEVEL_VIEWPORTS[1]; // L1: tight on Otef Aza

// ── Blip position calculation (mirrors RadarDisplay's getBlipPosition) ──
function getBlipMapPosition(threat) {
  const target = IMPACT_POSITIONS[threat.impact_zone] || { x: 0.5, y: 0.5 };
  const timeLeft = threat.intercepted ? threat.frozenTimeLeft : threat.timeLeft;
  const linearProgress = 1 - timeLeft / threat.countdown;
  const progress = easeProgress(linearProgress, threat.type);
  const baseStart = getSpawnOrigin(threat.type, threat.origin);
  // Simplified — no spread offset needed for 6 threats
  return {
    x: baseStart.x + (target.x - baseStart.x) * progress,
    y: baseStart.y + (target.y - baseStart.y) * progress,
  };
}

function getOverlayPosition(threat) {
  const mapPos = getBlipMapPosition(threat);
  const svgPos = mapToSVG(mapPos.x, mapPos.y, PRACTICE_VIEWPORT);
  return { left: `${svgPos.x}%`, top: `${svgPos.y}%` };
}

// ── Practice step definitions ──
const STEPS = {
  INTRO: 'intro',
  GUIDED_T1: 'guided_t1',       // auto-pause, "CLICK THIS THREAT"
  FIRE_T1: 'fire_t1',           // "PRESS 1 TO INTERCEPT"
  FREE_PLAY: 'free_play',       // T2-T3 with overlays, no pause
  GUIDED_T4: 'guided_t4',       // auto-pause, hold-fire instruction
  AFTER_T4: 'after_t4',         // continue after T4
  FINAL_WAVE: 'final_wave',     // T5+T6, no overlays
  COMPLETE: 'complete',
};

export default function PracticeRound({ onBack }) {
  // ── Game state ──
  const [sessionTime, setSessionTime] = useState(0);
  const [activeThreats, setActiveThreats] = useState([]);
  const [selectedThreatId, setSelectedThreatId] = useState(null);
  const [ammo, setAmmo] = useState(5);
  const [paused, setPaused] = useState(true); // start paused for intro
  const [step, setStep] = useState(STEPS.INTRO);
  const [feedback, setFeedback] = useState(null); // brief ✓ messages

  // Refs for tick loop
  const sessionTimeRef = useRef(0);
  const activeThreatsRef = useRef([]);
  const selectedThreatIdRef = useRef(null);
  const ammoRef = useRef(5);
  const spawnedIds = useRef(new Set());
  const resolvedIds = useRef(new Set());
  const pausedRef = useRef(true);
  const stepRef = useRef(STEPS.INTRO);

  // Keep refs in sync
  activeThreatsRef.current = activeThreats;
  selectedThreatIdRef.current = selectedThreatId;
  ammoRef.current = ammo;
  pausedRef.current = paused;
  stepRef.current = step;

  // ── Tick loop: spawn threats + countdown ──
  useEffect(() => {
    if (step === STEPS.INTRO || step === STEPS.COMPLETE) return;

    const interval = setInterval(() => {
      if (pausedRef.current) return;

      const dt = 0.1; // 100ms tick
      const newTime = sessionTimeRef.current + dt;
      sessionTimeRef.current = newTime;
      setSessionTime(newTime);

      // Spawn new threats
      PRACTICE_THREATS.forEach((t) => {
        if (newTime >= t.appear_time && !spawnedIds.current.has(t.id)) {
          spawnedIds.current.add(t.id);
          const newThreat = { ...t, timeLeft: t.countdown, impactRevealed: true };
          setActiveThreats((prev) => [...prev, newThreat]);

          // Auto-pause for guided steps
          if (t.id === 1 && stepRef.current !== STEPS.FIRE_T1) {
            setPaused(true);
            setStep(STEPS.GUIDED_T1);
          }
          if (t.id === 4) {
            setPaused(true);
            setStep(STEPS.GUIDED_T4);
          }
          if (t.id === 5) {
            setStep(STEPS.FINAL_WAVE);
          }
        }
      });

      // Decrement countdowns
      setActiveThreats((prev) => {
        const updated = prev.map((t) => {
          if (t.intercepted || t.held || resolvedIds.current.has(t.id)) return t;
          const newTimeLeft = Math.max(0, t.timeLeft - dt);
          return { ...t, timeLeft: newTimeLeft };
        });

        // Handle timeouts (timeLeft reached 0)
        updated.forEach((t) => {
          if (t.timeLeft <= 0 && !t.intercepted && !t.held && !resolvedIds.current.has(t.id)) {
            resolvedIds.current.add(t.id);
            // Threat hit — no penalty in practice, just mark it
          }
        });

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [step]);

  // ── Check for completion ──
  useEffect(() => {
    if (step === STEPS.COMPLETE || step === STEPS.INTRO) return;
    const allSpawned = spawnedIds.current.size === PRACTICE_THREATS.length;
    if (!allSpawned) return;

    const allResolved = activeThreats.every(
      (t) => t.intercepted || t.held || resolvedIds.current.has(t.id) || t.timeLeft <= 0
    );
    if (allResolved && activeThreats.length === PRACTICE_THREATS.length) {
      setTimeout(() => setStep(STEPS.COMPLETE), 800);
    }
  }, [activeThreats, step]);

  // ── Handle intercept / hold-fire ──
  const handleAction = useCallback((action) => {
    const threat = activeThreatsRef.current.find((t) => t.id === selectedThreatIdRef.current);
    if (!threat || threat.intercepted || threat.held) return;

    if (action === 'hold_fire') {
      setActiveThreats((prev) =>
        prev.map((t) => (t.id === threat.id ? { ...t, held: true } : t))
      );
      resolvedIds.current.add(threat.id);
      setSelectedThreatId(null);

      if (stepRef.current === STEPS.GUIDED_T4) {
        setFeedback({ text: '✓ SAVED YOUR AMMO!', color: '#22c55e' });
        setTimeout(() => setFeedback(null), 1500);
        setStep(STEPS.AFTER_T4);
      }
      return;
    }

    if (action === 'iron_dome') {
      if (ammoRef.current <= 0) return;
      setAmmo((prev) => prev - 1);
      setActiveThreats((prev) =>
        prev.map((t) =>
          t.id === threat.id ? { ...t, intercepted: true, frozenTimeLeft: t.timeLeft } : t
        )
      );
      resolvedIds.current.add(threat.id);
      setSelectedThreatId(null);

      // Step progression
      if (stepRef.current === STEPS.FIRE_T1) {
        setFeedback({ text: '✓ NICE!', color: '#22c55e' });
        setTimeout(() => setFeedback(null), 1500);
        setStep(STEPS.FREE_PLAY);
      } else if (stepRef.current === STEPS.GUIDED_T1) {
        // Shouldn't happen but handle gracefully
        setStep(STEPS.FREE_PLAY);
      }
    }
  }, []);

  // ── Handle threat selection ──
  const handleSelectThreat = useCallback((id) => {
    const threat = activeThreatsRef.current.find((t) => t.id === id);
    if (!threat || threat.intercepted || threat.held) return;

    setSelectedThreatId(id);

    // Step progression for T1
    if (id === 1 && stepRef.current === STEPS.GUIDED_T1) {
      setStep(STEPS.FIRE_T1);
      setPaused(false); // unpause after selecting T1
    }
  }, []);

  // ── Keyboard handler ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (step === STEPS.COMPLETE || step === STEPS.INTRO) return;

      if (e.key === '1') {
        e.preventDefault();
        handleAction('iron_dome');
      }
      if (e.key === ' ' || e.key === '5') {
        e.preventDefault();
        handleAction('hold_fire');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleAction]);

  // ── Start practice ──
  const startPractice = useCallback(() => {
    setPaused(false);
    setStep(STEPS.GUIDED_T1); // Will auto-pause when T1 spawns
  }, []);

  // ── Restart ──
  const restart = useCallback(() => {
    setSessionTime(0);
    sessionTimeRef.current = 0;
    setActiveThreats([]);
    setSelectedThreatId(null);
    setAmmo(5);
    setPaused(true);
    setStep(STEPS.INTRO);
    setFeedback(null);
    spawnedIds.current = new Set();
    resolvedIds.current = new Set();
  }, []);

  // ── Overlay text for each active threat ──
  function getOverlayForThreat(threat) {
    if (threat.intercepted || threat.held || resolvedIds.current.has(threat.id) || threat.timeLeft <= 0) {
      return null;
    }

    const isSelected = selectedThreatId === threat.id;

    // T1: Guided
    if (threat.id === 1) {
      if (step === STEPS.GUIDED_T1 && !isSelected) {
        return { text: '👆 CLICK THIS THREAT', color: '#f59e0b', pulse: true };
      }
      if ((step === STEPS.FIRE_T1 || step === STEPS.GUIDED_T1) && isSelected) {
        return { text: 'PRESS 1 TO INTERCEPT', color: '#22c55e', pulse: true };
      }
    }

    // T2-T3: Free play with tracking overlays
    if ((threat.id === 2 || threat.id === 3) && step === STEPS.FREE_PLAY) {
      if (isSelected) {
        return { text: 'PRESS 1', color: '#22c55e', pulse: false };
      }
      return { text: 'CLICK ME → PRESS 1', color: '#f59e0b', pulse: false };
    }

    // T4: Hold-fire guided
    if (threat.id === 4 && step === STEPS.GUIDED_T4) {
      return { text: '🚫 OPEN GROUND\nIGNORE ME — SAVE YOUR AMMO', color: '#ef4444', pulse: true };
    }
    if (threat.id === 4 && step === STEPS.AFTER_T4) {
      return { text: '🚫 IGNORE', color: '#ef4444', pulse: false };
    }

    return null;
  }

  // ── Render ──

  // Completion screen
  if (step === STEPS.COMPLETE) {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="text-5xl mb-4">🎯</div>
          <div className="font-mono text-2xl font-bold tracking-wider text-green-400 mb-2"
            style={{ textShadow: '0 0 20px rgba(34,197,94,0.4)' }}>
            NICE WORK!
          </div>
          <div className="font-mono text-sm text-gray-400 tracking-wider mb-8">
            YOU'RE READY FOR THE REAL THING
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={restart}
              className="px-6 py-3 bg-green-900/40 border border-green-500/50 rounded-lg
                         font-mono text-sm font-bold tracking-wider text-green-400
                         hover:bg-green-900/60 hover:border-green-400 transition-all">
              🔄 PLAY AGAIN
            </button>
            <button onClick={onBack}
              className="px-6 py-3 bg-gray-900/40 border border-gray-600/50 rounded-lg
                         font-mono text-sm tracking-wider text-gray-400
                         hover:bg-gray-800/60 hover:border-gray-400 transition-all">
              ← BACK TO LOBBY
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Intro screen
  if (step === STEPS.INTRO) {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="text-4xl mb-4">🎯</div>
          <div className="font-mono text-xl font-bold tracking-wider text-green-400 mb-2">
            PRACTICE ROUND
          </div>
          <div className="font-mono text-xs text-gray-400 tracking-wider mb-6 leading-relaxed">
            LEARN TO INTERCEPT ROCKETS<br />
            BEFORE THE TOURNAMENT BEGINS
          </div>
          <div className="space-y-3 text-left bg-black/40 border border-gray-700/50 rounded-lg p-4 mb-6">
            <div className="font-mono text-xs text-gray-300">
              <span className="text-yellow-400">①</span> Click a threat to select it
            </div>
            <div className="font-mono text-xs text-gray-300">
              <span className="text-green-400">②</span> Press <span className="text-white font-bold">1</span> to fire Iron Dome
            </div>
            <div className="font-mono text-xs text-gray-300">
              <span className="text-red-400">③</span> Some rockets miss — save your ammo!
            </div>
          </div>
          <button onClick={startPractice}
            className="w-full px-6 py-4 bg-green-900/50 border-2 border-green-400/60 rounded-xl
                       font-mono text-lg font-bold tracking-[0.2em] text-green-400
                       hover:bg-green-900/70 hover:border-green-400 transition-all
                       active:scale-95">
            START PRACTICE ▸
          </button>
          <button onClick={onBack}
            className="mt-3 font-mono text-xs text-gray-500 tracking-wider hover:text-gray-300 transition-colors">
            ← BACK TO LOBBY
          </button>
        </div>
      </div>
    );
  }

  // ── Gameplay screen ──
  const overlayThreats = activeThreats
    .map((t) => ({ threat: t, overlay: getOverlayForThreat(t) }))
    .filter((o) => o.overlay);

  return (
    <div className="h-screen bg-[#0a0e1a] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-3 py-2 bg-black/60 border-b border-green-500/20">
        <button onClick={onBack}
          className="font-mono text-xs text-gray-400 tracking-wider hover:text-white transition-colors px-2 py-1">
          ← BACK
        </button>
        <div className="font-mono text-xs font-bold tracking-[0.3em] text-green-400">
          PRACTICE ROUND
        </div>
        <div className="font-mono text-xs text-gray-500 tracking-wider">
          AMMO: <span className={`font-bold ${ammo <= 1 ? 'text-red-400' : 'text-yellow-400'}`}>{ammo}</span>
        </div>
      </div>

      {/* Radar area with overlay */}
      <div className="flex-1 flex items-center justify-center min-h-0 p-2 relative">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Radar */}
          <div className="relative" style={{ maxWidth: '700px', maxHeight: '100%', aspectRatio: '1', width: '100%' }}>
            <RadarDisplay
              activeThreats={activeThreats}
              selectedThreatId={selectedThreatId}
              onSelectThreat={handleSelectThreat}
              sessionTime={sessionTime}
              currentLevel={1}
              showSweep={true}
              paused={paused}
              impactFlashes={[]}
              activeTrails={[]}
            />

            {/* Tracking overlays — positioned over radar */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: '50%' }}>
              {overlayThreats.map(({ threat: t, overlay }) => {
                const pos = getOverlayPosition(t);
                const lines = overlay.text.split('\n');
                return (
                  <div
                    key={t.id}
                    className="absolute transition-all duration-100"
                    style={{
                      left: pos.left,
                      top: pos.top,
                      transform: 'translate(-50%, calc(-100% - 20px))',
                      zIndex: 25,
                    }}
                  >
                    <div
                      className={`bg-black/90 border rounded-lg px-3 py-1.5 text-center whitespace-nowrap ${overlay.pulse ? 'animate-pulse' : ''}`}
                      style={{
                        borderColor: overlay.color + '80',
                        boxShadow: `0 0 12px ${overlay.color}30`,
                        animationDuration: '1.5s',
                      }}
                    >
                      {lines.map((line, i) => (
                        <div key={i} className="font-mono text-[11px] font-bold tracking-wider"
                          style={{ color: overlay.color, textShadow: `0 0 8px ${overlay.color}40` }}>
                          {line}
                        </div>
                      ))}
                    </div>
                    {/* Arrow pointing down to blip */}
                    <div className="flex justify-center">
                      <div className="w-0 h-0"
                        style={{
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: `6px solid ${overlay.color}80`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-black/90 border rounded-lg px-4 py-2 font-mono text-sm font-bold tracking-wider"
              style={{ borderColor: feedback.color, color: feedback.color, boxShadow: `0 0 20px ${feedback.color}40` }}>
              {feedback.text}
            </div>
          </div>
        )}

        {/* Pause overlay */}
        {paused && step === STEPS.GUIDED_T1 && (
          <div className="absolute inset-0 flex items-end justify-center pb-24 z-20 pointer-events-none">
            <div className="bg-black/80 border border-yellow-500/50 rounded-lg px-5 py-3 text-center">
              <div className="font-mono text-xs text-yellow-400 tracking-wider font-bold">
                👆 CLICK THE BLIP ON THE RADAR
              </div>
            </div>
          </div>
        )}

        {paused && step === STEPS.GUIDED_T4 && (
          <div className="absolute inset-0 flex items-end justify-center pb-24 z-20 pointer-events-none">
            <div className="bg-black/80 border border-red-500/50 rounded-lg px-5 py-3 text-center max-w-xs">
              <div className="font-mono text-xs text-red-400 tracking-wider font-bold mb-1">
                THIS ROCKET IS HEADING FOR OPEN GROUND
              </div>
              <div className="font-mono text-xs text-gray-300 tracking-wider">
                Click it → press <span className="text-white font-bold">SPACE</span> to hold fire
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls (mobile) */}
      <div className="flex-none px-3 py-2 bg-black/60 border-t border-green-500/20">
        <div className="flex gap-2 max-w-md mx-auto">
          <button
            onClick={() => handleAction('iron_dome')}
            disabled={!selectedThreatId || ammo <= 0}
            className={`flex-1 py-3 rounded-lg font-mono text-sm font-bold tracking-wider transition-all
              ${selectedThreatId && ammo > 0
                ? 'bg-yellow-900/40 border border-yellow-500/60 text-yellow-400 active:scale-95'
                : 'bg-gray-900/40 border border-gray-700/40 text-gray-600'}`}
          >
            IRON DOME <span className="hidden sm:inline">[1]</span>
          </button>
          <button
            onClick={() => handleAction('hold_fire')}
            disabled={!selectedThreatId}
            className={`flex-1 py-3 rounded-lg font-mono text-sm font-bold tracking-wider transition-all
              ${selectedThreatId
                ? 'bg-gray-800/40 border border-gray-400/60 text-gray-300 active:scale-95'
                : 'bg-gray-900/40 border border-gray-700/40 text-gray-600'}`}
          >
            HOLD FIRE <span className="hidden sm:inline">[SPC]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
