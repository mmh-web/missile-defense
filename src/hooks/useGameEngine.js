import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getThreats,
  getConfig,
  GAME_MODES,
  TZEVA_ADOM_DURATION,
  DIMONA_PENALTY_DURATION,
  IMPACT_POSITIONS,
  BATTERY_POSITIONS,
  INTERCEPTOR_COLORS,
} from '../config/threats.js';
import {
  playInterceptSound,
  playCityHitSound,
  playGroundImpactSound,
} from '../utils/soundEffects.js';

export const GAME_STATES = {
  PRE_GAME: 'pre_game',
  BRIEFING: 'briefing',
  STUDY: 'study',
  ACTIVE: 'active',
  TZEVA_ADOM: 'tzeva_adom',
  SUMMARY: 'summary',
};

export default function useGameEngine() {
  const [gameMode, setGameMode] = useState('SHORT'); // 'SHORT' or 'FULL'
  const [gameState, setGameState] = useState(GAME_STATES.PRE_GAME);
  const [sessionTime, setSessionTime] = useState(0);
  const [ammo, setAmmo] = useState({ ...GAME_MODES.SHORT.ammo });
  const [activeThreats, setActiveThreats] = useState([]);
  const [selectedThreatId, setSelectedThreatId] = useState(null);
  const [tzevaAdomTimeLeft, setTzevaAdomTimeLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [resultLog, setResultLog] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [totalPenaltyTime, setTotalPenaltyTime] = useState(0);
  const [sirenCount, setSirenCount] = useState(0);
  const [wrongInterceptAttempts, setWrongInterceptAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finalSalvoWarning, setFinalSalvoWarning] = useState(false);
  const [impactFlashes, setImpactFlashes] = useState([]); // { zone, type, id, cx, cy, particles[], threatType }
  const [activeTrails, setActiveTrails] = useState([]);   // { id, startX, startY, endX, endY, color, duration }
  const [screenShake, setScreenShake] = useState(false);

  // Refs to avoid stale closures in callbacks
  const gameStateRef = useRef(gameState);
  const selectedThreatIdRef = useRef(selectedThreatId);
  const activeThreatsRef = useRef(activeThreats);
  const volumeRef = useRef(volume);
  const gameModeRef = useRef(gameMode);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { selectedThreatIdRef.current = selectedThreatId; }, [selectedThreatId]);
  useEffect(() => { activeThreatsRef.current = activeThreats; }, [activeThreats]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);

  const animFrameRef = useRef(null);
  const lastTickRef = useRef(null);
  const spawnedIdsRef = useRef(new Set());
  const feedbackTimerRef = useRef(null);
  const tzevaAdomQueueRef = useRef([]);
  const allSpawnedRef = useRef(false);

  // Audio refs
  const sirenRef = useRef(null);
  const pingRef = useRef(null);
  const successRef = useRef(null);
  const failRef = useRef(null);

  useEffect(() => {
    sirenRef.current = new Audio('/sounds/siren.mp3');
    sirenRef.current.loop = true;
    pingRef.current = new Audio('/sounds/ping.wav');
    successRef.current = new Audio('/sounds/success.wav');
    failRef.current = new Audio('/sounds/fail.wav');
  }, []);

  useEffect(() => {
    [sirenRef, pingRef, successRef, failRef].forEach((ref) => {
      if (ref.current) ref.current.volume = volume;
    });
  }, [volume]);

  const playSound = useCallback((ref) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.volume = volumeRef.current;
      ref.current.play().catch(() => {});
    }
  }, []);

  const stopSiren = useCallback(() => {
    if (sirenRef.current) {
      sirenRef.current.pause();
      sirenRef.current.currentTime = 0;
    }
  }, []);

  const showFeedback = useCallback((text, type, duration = 3000) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedbackMessage({ text, type });
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackMessage(null);
    }, duration);
  }, []);

  // Add impact flash effect with pre-computed particles
  const addImpactFlash = useCallback((zone, type, threatType = 'ballistic') => {
    const flashId = Date.now() + Math.random();
    const pos = IMPACT_POSITIONS[zone] || { x: 0.5, y: 0.5 };
    const cx = pos.x * 100;
    const cy = pos.y * 100;

    // Pre-compute particle positions for render stability
    let particles = [];
    if (type === 'intercept') {
      particles = Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return { endX: Math.cos(angle) * 6, endY: Math.sin(angle) * 6, r: 0.4, delay: i * 0.02 };
      });
    } else if (type === 'city_hit') {
      particles = Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2 + (Math.random() * 0.3);
        const dist = 5 + Math.random() * 4;
        return {
          endX: Math.cos(angle) * dist,
          endY: Math.sin(angle) * dist,
          r: 0.3 + Math.random() * 0.3,
          delay: i * 0.015,
          color: i % 3 === 0 ? '#ef4444' : '#f97316',
        };
      });
    } else {
      particles = Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return { endX: Math.cos(angle) * 3, endY: Math.sin(angle) * 3, r: 0.3, delay: i * 0.03 };
      });
    }

    setImpactFlashes((prev) => [...prev, {
      zone, type, id: flashId, cx, cy, threatType, particles,
    }]);

    // Screen shake for city hits
    if (type === 'city_hit') {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
    }

    const duration = type === 'city_hit' ? 3000 : type === 'intercept' ? 2000 : 1500;
    setTimeout(() => {
      setImpactFlashes((prev) => prev.filter((f) => f.id !== flashId));
    }, duration);
  }, []);

  // Launch interceptor trail with delayed impact flash
  const addTrail = useCallback((action, targetZone, threatType, impactType) => {
    const battery = BATTERY_POSITIONS[action];
    if (!battery) return;
    const target = IMPACT_POSITIONS[targetZone] || { x: 0.5, y: 0.5 };
    const trailId = Date.now() + Math.random();
    const duration = 600;

    setActiveTrails((prev) => [...prev, {
      id: trailId,
      startX: battery.x * 100,
      startY: battery.y * 100,
      endX: target.x * 100,
      endY: target.y * 100,
      color: INTERCEPTOR_COLORS[action],
      duration,
    }]);

    // Auto-remove trail after animation + linger
    setTimeout(() => {
      setActiveTrails((prev) => prev.filter((t) => t.id !== trailId));
    }, duration + 500);

    // Delay impact flash + sound to sync with trail arrival
    if (impactType) {
      setTimeout(() => {
        addImpactFlash(targetZone, impactType, threatType);
        if (impactType === 'intercept') playInterceptSound(volumeRef.current);
      }, duration);
    }
  }, [addImpactFlash]);

  // Trigger tzeva adom — handles Dimona priority (longer siren)
  const triggerTzevaAdom = useCallback((isPriority = false) => {
    const duration = isPriority ? DIMONA_PENALTY_DURATION : TZEVA_ADOM_DURATION;
    setSirenCount((c) => c + 1);
    setTotalPenaltyTime((t) => t + duration);

    if (gameStateRef.current === GAME_STATES.TZEVA_ADOM) {
      tzevaAdomQueueRef.current.push(duration);
      return;
    }

    setGameState(GAME_STATES.TZEVA_ADOM);
    setTzevaAdomTimeLeft(duration);
    if (sirenRef.current) {
      sirenRef.current.currentTime = 0;
      sirenRef.current.loop = true;
      sirenRef.current.volume = volumeRef.current;
      sirenRef.current.play().catch(() => {});
    }
  }, []);

  // Handle threat timeout (countdown reached 0)
  const handleThreatTimeout = useCallback((threat) => {
    setActiveThreats((prev) => prev.filter((t) => t.id !== threat.id));

    if (selectedThreatIdRef.current === threat.id) {
      setSelectedThreatId(null);
    }

    // Decoys just disappear silently
    if (threat.is_decoy) {
      showFeedback('Radar contact faded — false signature.', 'neutral');
      return;
    }

    // Check effective populated status (after any course correction)
    const effectivePopulated = threat._corrected ? threat.is_populated : threat.is_populated;

    if (effectivePopulated) {
      setResultLog((prev) => [...prev, { ...threat, result: 'timeout', siren: true }]);
      playSound(failRef);
      addImpactFlash(threat.impact_zone, 'city_hit', threat.type);
      playCityHitSound(volumeRef.current);
      setStreak(0);
      triggerTzevaAdom(threat.priority);
    } else {
      setResultLog((prev) => [...prev, { ...threat, result: 'timeout_open', siren: false }]);
      addImpactFlash(threat.impact_zone, 'ground_impact', threat.type);
      playGroundImpactSound(volumeRef.current);
      showFeedback(`Threat landed in ${threat.impact_zone} — no damage.`, 'neutral');
    }
  }, [triggerTzevaAdom, playSound, showFeedback, addImpactFlash]);

  // Handle player action on selected threat
  const handleAction = useCallback((action) => {
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;

    const currentThreats = activeThreatsRef.current;
    const currentSelected = selectedThreatIdRef.current;
    const threat = currentThreats.find((t) => t.id === currentSelected);
    if (!threat) return;

    // Can't interact with decoys via interceptors
    if (threat.is_decoy && action !== 'hold_fire') {
      setAmmo((prev) => ({ ...prev, [action]: prev[action] - 1 }));
      playSound(failRef);
      showFeedback('TARGET LOST — False radar contact!', 'error');
      setStreak(0);
      // Remove the decoy since player engaged it
      setActiveThreats((prev) => prev.filter((t) => t.id !== threat.id));
      setSelectedThreatId(null);
      setResultLog((prev) => [...prev, { ...threat, result: 'wasted_on_decoy', siren: false }]);
      return;
    }

    if (threat.is_decoy && action === 'hold_fire') {
      setActiveThreats((prev) => prev.filter((t) => t.id !== threat.id));
      setSelectedThreatId(null);
      showFeedback('Radar contact dismissed — false signature confirmed.', 'success');
      setResultLog((prev) => [...prev, { ...threat, result: 'correct_hold_decoy', siren: false }]);
      return;
    }

    if (action === 'hold_fire') {
      setActiveThreats((prev) => prev.filter((t) => t.id !== threat.id));
      setSelectedThreatId(null);

      if (threat.is_populated) {
        setResultLog((prev) => [...prev, { ...threat, result: 'hold_populated', siren: true }]);
        playSound(failRef);
        addImpactFlash(threat.impact_zone, 'city_hit', threat.type);
        playCityHitSound(volumeRef.current);
        setStreak(0);
        triggerTzevaAdom(threat.priority);
      } else {
        setResultLog((prev) => [...prev, { ...threat, result: 'correct_hold', siren: false }]);
        playSound(successRef);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        showFeedback(`Threat landed in ${threat.impact_zone} — no damage. Ammunition conserved.`, 'success');
      }
      return;
    }

    // Interceptor action — consume ammo
    setAmmo((prev) => ({ ...prev, [action]: prev[action] - 1 }));

    const isCorrect = action === threat.correct_action;

    if (isCorrect) {
      setActiveThreats((prev) => prev.filter((t) => t.id !== threat.id));
      setSelectedThreatId(null);

      if (threat.is_populated) {
        setResultLog((prev) => [...prev, { ...threat, result: 'correct_intercept', siren: false }]);
        playSound(successRef);
        addTrail(action, threat.impact_zone, threat.type, 'intercept');
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        showFeedback('INTERCEPTION SUCCESSFUL', 'success');
      } else {
        setResultLog((prev) => [...prev, { ...threat, result: 'wasted_intercept', siren: false }]);
        addTrail(action, threat.impact_zone, threat.type, 'intercept');
        showFeedback('INTERCEPTION SUCCESSFUL — but threat was headed for open ground. Interceptor wasted.', 'warning');
        // Don't break streak for wasted but still correct
      }
    } else {
      setWrongInterceptAttempts((c) => c + 1);
      playSound(failRef);
      setStreak(0);
      addTrail(action, threat.impact_zone, threat.type, null);
      showFeedback('INTERCEPTION FAILED — wrong system!', 'error');
    }
  }, [triggerTzevaAdom, playSound, showFeedback, addImpactFlash, addTrail]);

  // Main game loop — drives sessionTime via requestAnimationFrame
  const tick = useCallback((timestamp) => {
    if (!lastTickRef.current) lastTickRef.current = timestamp;
    const delta = (timestamp - lastTickRef.current) / 1000;
    lastTickRef.current = timestamp;

    const config = getConfig(gameModeRef.current);

    setSessionTime((prev) => {
      const newTime = prev + delta;
      return newTime >= config.game_duration ? config.game_duration : newTime;
    });

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  // Spawn threats + progressive reveal + course correction
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE && gameState !== GAME_STATES.STUDY) return;

    const config = getConfig(gameMode);
    const threats = getThreats(gameMode);

    let spawned = false;
    let unspawnedCount = 0;

    threats.forEach((threat) => {
      if (sessionTime >= threat.appear_time && !spawnedIdsRef.current.has(threat.id)) {
        spawnedIdsRef.current.add(threat.id);
        spawned = true;
        setActiveThreats((prev) => {
          // Add with reveal state
          const newThreat = {
            ...threat,
            timeLeft: threat.countdown,
            impactRevealed: threat.is_decoy ? true : false,
            _corrected: false,
          };
          const newThreats = [...prev, newThreat];
          if (newThreats.length === 1) {
            setSelectedThreatId(newThreats[0].id);
          }
          return newThreats;
        });
        playSound(pingRef);
      }
      if (!spawnedIdsRef.current.has(threat.id)) {
        unspawnedCount++;
      }
    });

    // Track if all threats have been spawned
    allSpawnedRef.current = unspawnedCount === 0;

    // Final salvo warning
    if (config.final_salvo_warning_time && sessionTime >= config.final_salvo_warning_time && sessionTime < config.final_salvo_start_time) {
      setFinalSalvoWarning(true);
    } else {
      setFinalSalvoWarning(false);
    }

    // Transition study → active
    if (gameState === GAME_STATES.STUDY && (spawned || sessionTime >= config.study_duration)) {
      setGameState(GAME_STATES.ACTIVE);
    }

    // End game — either time ran out or all threats resolved
    if (sessionTime >= config.game_duration) {
      setGameState(GAME_STATES.SUMMARY);
      stopSiren();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  }, [sessionTime, gameState, gameMode, playSound, stopSiren]);

  // Auto-end game when all threats resolved (10s after last threat gone)
  const autoEndTimerRef = useRef(null);
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE) return;
    if (allSpawnedRef.current && activeThreats.length === 0) {
      if (!autoEndTimerRef.current) {
        autoEndTimerRef.current = setTimeout(() => {
          if (gameStateRef.current === GAME_STATES.ACTIVE) {
            setGameState(GAME_STATES.SUMMARY);
            stopSiren();
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          }
        }, 8000);
      }
    } else {
      if (autoEndTimerRef.current) {
        clearTimeout(autoEndTimerRef.current);
        autoEndTimerRef.current = null;
      }
    }
    return () => {
      if (autoEndTimerRef.current) {
        clearTimeout(autoEndTimerRef.current);
        autoEndTimerRef.current = null;
      }
    };
  }, [gameState, activeThreats.length, stopSiren]);

  // Tick active threat countdowns + progressive reveal + course correction
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE) return;

    let lastTime = performance.now();
    const processedTimeouts = new Set();

    const interval = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setActiveThreats((prev) => {
        const updated = prev.map((t) => {
          const newTimeLeft = Math.max(0, t.timeLeft - dt);
          const pctRemaining = newTimeLeft / t.countdown;
          let updatedThreat = { ...t, timeLeft: newTimeLeft };

          // Progressive reveal: show impact zone when pctRemaining drops below reveal_pct
          if (!t.impactRevealed && t.reveal_pct && pctRemaining <= t.reveal_pct) {
            updatedThreat.impactRevealed = true;
          }

          // Course correction: change target mid-flight
          if (t.course_correct && !t._corrected && pctRemaining <= t.course_correct.at_pct) {
            updatedThreat.impact_zone = t.course_correct.new_impact_zone;
            updatedThreat.is_populated = t.course_correct.new_is_populated;
            updatedThreat._corrected = true;
            updatedThreat.impactRevealed = false; // Hide again briefly after course change
            // Re-reveal after 1.5 seconds worth of countdown
            const revealDelay = 1.5 / t.countdown;
            updatedThreat.reveal_pct = Math.max(0, pctRemaining - revealDelay);
          }

          return updatedThreat;
        });

        const timedOut = updated.filter(
          (t) => t.timeLeft <= 0 && !processedTimeouts.has(t.id)
        );

        if (timedOut.length > 0) {
          timedOut.forEach((t) => processedTimeouts.add(t.id));
          setTimeout(() => {
            timedOut.forEach((t) => handleThreatTimeout(t));
          }, 0);
        }

        return updated.filter((t) => t.timeLeft > 0);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, handleThreatTimeout]);

  // Tzeva adom countdown
  useEffect(() => {
    if (gameState !== GAME_STATES.TZEVA_ADOM) return;

    let lastTime = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setTzevaAdomTimeLeft((prev) => {
        const newVal = prev - dt;
        if (newVal <= 0) {
          clearInterval(interval);
          stopSiren();

          if (tzevaAdomQueueRef.current.length > 0) {
            const nextDuration = tzevaAdomQueueRef.current.shift();
            setTimeout(() => {
              setTzevaAdomTimeLeft(nextDuration);
              if (sirenRef.current) {
                sirenRef.current.currentTime = 0;
                sirenRef.current.loop = true;
                sirenRef.current.volume = volumeRef.current;
                sirenRef.current.play().catch(() => {});
              }
            }, 0);
            return nextDuration;
          }

          setGameState(GAME_STATES.ACTIVE);
          return 0;
        }
        return newVal;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, stopSiren]);

  // Start/stop animation frame
  useEffect(() => {
    if (
      (gameState === GAME_STATES.STUDY || gameState === GAME_STATES.ACTIVE) &&
      !paused
    ) {
      lastTickRef.current = null;
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [gameState, paused, tick]);

  const startGame = useCallback((mode) => {
    const selectedMode = mode || gameModeRef.current;
    const config = getConfig(selectedMode);
    setGameMode(selectedMode);
    setGameState(GAME_STATES.BRIEFING);
    setSessionTime(0);
    setAmmo({ ...config.ammo });
    setActiveThreats([]);
    setSelectedThreatId(null);
    setResultLog([]);
    setFeedbackMessage(null);
    setTotalPenaltyTime(0);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setScreenShake(false);
    setPaused(false);
    spawnedIdsRef.current = new Set();
    tzevaAdomQueueRef.current = [];
    allSpawnedRef.current = false;
    lastTickRef.current = null;
    if (autoEndTimerRef.current) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }
  }, []);

  const skipBriefing = useCallback(() => {
    if (gameStateRef.current !== GAME_STATES.BRIEFING) return;
    setGameState(GAME_STATES.STUDY);
  }, []);

  const resetGame = useCallback(() => {
    stopSiren();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (autoEndTimerRef.current) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }
    setGameState(GAME_STATES.PRE_GAME);
    setSessionTime(0);
    setAmmo({ ...getConfig(gameModeRef.current).ammo });
    setActiveThreats([]);
    setSelectedThreatId(null);
    setResultLog([]);
    setFeedbackMessage(null);
    setTotalPenaltyTime(0);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setScreenShake(false);
    setPaused(false);
    spawnedIdsRef.current = new Set();
    tzevaAdomQueueRef.current = [];
    allSpawnedRef.current = false;
    lastTickRef.current = null;
  }, [stopSiren]);

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  const skipStudy = useCallback(() => {
    if (gameStateRef.current !== GAME_STATES.STUDY) return;
    const config = getConfig(gameModeRef.current);
    setSessionTime(config.study_duration);
  }, []);

  const getSummaryStats = useCallback(() => {
    const nonDecoyLog = resultLog.filter((r) => !r.is_decoy);
    const totalThreats = nonDecoyLog.length;
    const correctIntercepts = nonDecoyLog.filter((r) => r.result === 'correct_intercept').length;
    const populatedThreats = nonDecoyLog.filter((r) => r.is_populated).length;
    const correctHolds = nonDecoyLog.filter((r) => r.result === 'correct_hold').length;
    const openGroundThreats = nonDecoyLog.filter((r) => !r.is_populated).length;
    const timeouts = nonDecoyLog.filter((r) => r.result === 'timeout').length;
    const wastedIntercepts = nonDecoyLog.filter((r) => r.result === 'wasted_intercept').length;
    const holdOnPopulated = nonDecoyLog.filter((r) => r.result === 'hold_populated').length;

    let rating;
    if (sirenCount === 0) rating = { label: 'IRON WALL', stars: 5 };
    else if (sirenCount === 1) rating = { label: 'STEEL DOME', stars: 4 };
    else if (sirenCount <= 3) rating = { label: 'SOLID DEFENSE', stars: 3 };
    else if (sirenCount <= 5) rating = { label: 'BATTERED BUT STANDING', stars: 2 };
    else rating = { label: 'BREACH', stars: 1 };

    const score = Math.max(0,
      (correctIntercepts * 100)
      + (correctHolds * 50)
      + (bestStreak * 25)
      - (sirenCount * 200)
      - (wrongInterceptAttempts * 75)
      - (wastedIntercepts * 25)
      - (totalPenaltyTime * 2)
    );

    return {
      totalThreats,
      correctIntercepts,
      populatedThreats,
      correctHolds,
      openGroundThreats,
      wrongIntercepts: wrongInterceptAttempts,
      timeouts: timeouts + holdOnPopulated,
      wastedIntercepts,
      ammoRemaining: ammo,
      totalPenaltyTime,
      sirenCount,
      bestStreak,
      rating,
      score,
      gameMode,
    };
  }, [resultLog, ammo, totalPenaltyTime, sirenCount, wrongInterceptAttempts, bestStreak, gameMode]);

  return {
    gameState,
    gameMode,
    sessionTime,
    ammo,
    activeThreats,
    selectedThreatId,
    tzevaAdomTimeLeft,
    paused,
    volume,
    resultLog,
    feedbackMessage,
    totalPenaltyTime,
    sirenCount,
    streak,
    bestStreak,
    finalSalvoWarning,
    impactFlashes,
    activeTrails,
    screenShake,
    startGame,
    resetGame,
    togglePause,
    skipBriefing,
    skipStudy,
    handleAction,
    setSelectedThreatId,
    setVolume,
    setGameMode,
    getSummaryStats,
    GAME_STATES,
  };
}
