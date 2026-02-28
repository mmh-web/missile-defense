import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getThreats,
  getLevelConfig,
  TOTAL_LEVELS,
  TZEVA_ADOM_DURATION,
  DIMONA_PENALTY_DURATION,
  IMPACT_POSITIONS,
  COMMAND_CENTER,
  INTERCEPTOR_COLORS,
} from '../config/threats.js';
import {
  playInterceptSound,
  playCityHitSound,
  playGroundImpactSound,
  playLaunchSound,
} from '../utils/soundEffects.js';

export const GAME_STATES = {
  PRE_GAME: 'pre_game',
  BRIEFING: 'briefing',
  LEVEL_INTRO: 'level_intro',
  ACTIVE: 'active',
  TZEVA_ADOM: 'tzeva_adom',
  LEVEL_COMPLETE: 'level_complete',
  SUMMARY: 'summary',
};

export default function useGameEngine() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState(GAME_STATES.PRE_GAME);
  const [sessionTime, setSessionTime] = useState(0);
  const [ammo, setAmmo] = useState({ ...getLevelConfig(1).ammo });
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
  const [impactFlashes, setImpactFlashes] = useState([]);
  const [activeTrails, setActiveTrails] = useState([]);
  const [screenShake, setScreenShake] = useState(false);

  // Refs to avoid stale closures in callbacks
  const gameStateRef = useRef(gameState);
  const selectedThreatIdRef = useRef(selectedThreatId);
  const activeThreatsRef = useRef(activeThreats);
  const volumeRef = useRef(volume);
  const currentLevelRef = useRef(currentLevel);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { selectedThreatIdRef.current = selectedThreatId; }, [selectedThreatId]);
  useEffect(() => { activeThreatsRef.current = activeThreats; }, [activeThreats]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { currentLevelRef.current = currentLevel; }, [currentLevel]);

  const animFrameRef = useRef(null);
  const lastTickRef = useRef(null);
  const spawnedIdsRef = useRef(new Set());
  const feedbackTimerRef = useRef(null);
  const tzevaAdomQueueRef = useRef([]);
  const allSpawnedRef = useRef(false);

  // Campaign stats — accumulated across all levels
  const campaignStatsRef = useRef({
    totalScore: 0,
    levelScores: [],
    totalCorrectIntercepts: 0,
    totalCorrectHolds: 0,
    totalSirens: 0,
    totalWrongIntercepts: 0,
    totalWastedIntercepts: 0,
    totalPenaltyTime: 0,
    overallBestStreak: 0,
  });

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
  // overridePos: optional { x, y } in 0-1 coords to place the flash at a custom position (e.g. blip location for intercepts)
  const addImpactFlash = useCallback((zone, type, threatType = 'ballistic', overridePos = null) => {
    const flashId = Date.now() + Math.random();
    const pos = overridePos || IMPACT_POSITIONS[zone] || { x: 0.5, y: 0.5 };
    const cx = pos.x * 100;
    const cy = pos.y * 100;

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
  const addTrail = useCallback((action, threat, impactType) => {
    const battery = COMMAND_CENTER;
    if (!battery) return;

    // Calculate where the threat currently IS on the radar (same easing as RadarDisplay)
    const target = IMPACT_POSITIONS[threat.impact_zone] || { x: 0.5, y: 0.5 };
    const linearProgress = 1 - threat.timeLeft / threat.countdown;
    // Apply easing: ballistic = cubic, hypersonic = quartic, others = linear
    let progress = linearProgress;
    if (threat.type === 'ballistic') progress = linearProgress ** 3;
    else if (threat.type === 'hypersonic') progress = linearProgress ** 4;

    const cx = 0.5, cy = 0.5;
    const dx = target.x - cx;
    const dy = target.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const norm = dist > 0 ? 1 / dist : 1;
    const startX = cx + (dx * norm * 0.48);
    const startY = cy + (dy * norm * 0.48);
    const blipX = startX + (target.x - startX) * progress;
    const blipY = startY + (target.y - startY) * progress;

    // Immediate launch sound feedback
    playLaunchSound(volumeRef.current);

    const trailId = Date.now() + Math.random();
    const duration = 600;

    setActiveTrails((prev) => [...prev, {
      id: trailId,
      startX: battery.x * 100,
      startY: battery.y * 100,
      endX: blipX * 100,
      endY: blipY * 100,
      color: INTERCEPTOR_COLORS[action],
      duration,
    }]);

    setTimeout(() => {
      setActiveTrails((prev) => prev.filter((t) => t.id !== trailId));
    }, duration + 500);

    if (impactType) {
      setTimeout(() => {
        addImpactFlash(threat.impact_zone, impactType, threat.type, { x: blipX, y: blipY });
        if (impactType === 'intercept') playInterceptSound(volumeRef.current);
      }, duration);
    }
  }, [addImpactFlash]);

  // Trigger tzeva adom
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

    if (threat.is_decoy) {
      showFeedback('Radar contact faded — false signature.', 'neutral');
      return;
    }

    const effectivePopulated = threat.is_populated;

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
        addTrail(action, threat, 'intercept');
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        showFeedback('INTERCEPTION SUCCESSFUL', 'success');
      } else {
        setResultLog((prev) => [...prev, { ...threat, result: 'wasted_intercept', siren: false }]);
        addTrail(action, threat, 'intercept');
        showFeedback('INTERCEPTION SUCCESSFUL — but threat was headed for open ground. Interceptor wasted.', 'warning');
      }
    } else {
      setWrongInterceptAttempts((c) => c + 1);
      playSound(failRef);
      setStreak(0);
      addTrail(action, threat, null);
      showFeedback('INTERCEPTION FAILED — wrong system!', 'error');
    }
  }, [triggerTzevaAdom, playSound, showFeedback, addImpactFlash, addTrail]);

  // Main game loop — drives sessionTime via requestAnimationFrame
  const tick = useCallback((timestamp) => {
    if (!lastTickRef.current) lastTickRef.current = timestamp;
    const delta = (timestamp - lastTickRef.current) / 1000;
    lastTickRef.current = timestamp;

    const config = getLevelConfig(currentLevelRef.current);

    setSessionTime((prev) => {
      const newTime = prev + delta;
      return newTime >= config.duration ? config.duration : newTime;
    });

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  // Spawn threats + progressive reveal + course correction
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE) return;

    const config = getLevelConfig(currentLevel);
    const threats = getThreats(currentLevel);

    let spawned = false;
    let unspawnedCount = 0;

    threats.forEach((threat) => {
      if (sessionTime >= threat.appear_time && !spawnedIdsRef.current.has(threat.id)) {
        spawnedIdsRef.current.add(threat.id);
        spawned = true;
        setActiveThreats((prev) => {
          const newThreat = {
            ...threat,
            timeLeft: threat.countdown,
            impactRevealed: threat.is_decoy ? true : (threat.reveal_pct >= 1.0),
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

    allSpawnedRef.current = unspawnedCount === 0;

    // Final salvo warning
    if (config.final_salvo_warning_time && sessionTime >= config.final_salvo_warning_time && sessionTime < config.final_salvo_start_time) {
      setFinalSalvoWarning(true);
    } else {
      setFinalSalvoWarning(false);
    }

    // End level — time ran out
    if (sessionTime >= config.duration) {
      if (currentLevel >= TOTAL_LEVELS) {
        setGameState(GAME_STATES.SUMMARY);
      } else {
        setGameState(GAME_STATES.LEVEL_COMPLETE);
      }
      stopSiren();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  }, [sessionTime, gameState, currentLevel, playSound, stopSiren]);

  // Auto-end level when all threats resolved
  const autoEndTimerRef = useRef(null);
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE) return;
    const config = getLevelConfig(currentLevel);

    if (allSpawnedRef.current && activeThreats.length === 0) {
      if (!autoEndTimerRef.current) {
        autoEndTimerRef.current = setTimeout(() => {
          if (gameStateRef.current === GAME_STATES.ACTIVE) {
            if (currentLevelRef.current >= TOTAL_LEVELS) {
              setGameState(GAME_STATES.SUMMARY);
            } else {
              setGameState(GAME_STATES.LEVEL_COMPLETE);
            }
            stopSiren();
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          }
        }, config.auto_end_delay);
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
  }, [gameState, activeThreats.length, currentLevel, stopSiren]);

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

          // Progressive reveal
          if (!t.impactRevealed && t.reveal_pct && pctRemaining <= t.reveal_pct) {
            updatedThreat.impactRevealed = true;
          }

          // Course correction
          if (t.course_correct && !t._corrected && pctRemaining <= t.course_correct.at_pct) {
            updatedThreat.impact_zone = t.course_correct.new_impact_zone;
            updatedThreat.is_populated = t.course_correct.new_is_populated;
            updatedThreat._corrected = true;
            updatedThreat.impactRevealed = false;
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
    if (gameState === GAME_STATES.ACTIVE && !paused) {
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

  // Get current level stats
  const getLevelStats = useCallback(() => {
    const nonDecoyLog = resultLog.filter((r) => !r.is_decoy);
    const totalThreats = nonDecoyLog.length;
    const correctIntercepts = nonDecoyLog.filter((r) => r.result === 'correct_intercept').length;
    const populatedThreats = nonDecoyLog.filter((r) => r.is_populated).length;
    const correctHolds = nonDecoyLog.filter((r) => r.result === 'correct_hold').length;
    const openGroundThreats = nonDecoyLog.filter((r) => !r.is_populated).length;
    const timeouts = nonDecoyLog.filter((r) => r.result === 'timeout').length;
    const wastedIntercepts = nonDecoyLog.filter((r) => r.result === 'wasted_intercept').length;
    const holdOnPopulated = nonDecoyLog.filter((r) => r.result === 'hold_populated').length;

    const score = Math.max(0,
      (correctIntercepts * 100)
      + (correctHolds * 50)
      + (bestStreak * 25)
      - (sirenCount * 200)
      - (wrongInterceptAttempts * 75)
      - (wastedIntercepts * 25)
      - (totalPenaltyTime * 2)
    );

    let rating;
    if (sirenCount === 0) rating = { label: 'IRON WALL', stars: 5 };
    else if (sirenCount === 1) rating = { label: 'STEEL DOME', stars: 4 };
    else if (sirenCount <= 2) rating = { label: 'SOLID DEFENSE', stars: 3 };
    else if (sirenCount <= 4) rating = { label: 'BATTERED BUT STANDING', stars: 2 };
    else rating = { label: 'BREACH', stars: 1 };

    return {
      level: currentLevel,
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
    };
  }, [resultLog, ammo, totalPenaltyTime, sirenCount, wrongInterceptAttempts, bestStreak, currentLevel]);

  // Get campaign summary (all levels combined)
  const getCampaignStats = useCallback(() => {
    const campaign = campaignStatsRef.current;
    const totalSirens = campaign.totalSirens;

    let rating;
    if (totalSirens === 0) rating = { label: 'IRON WALL', stars: 5 };
    else if (totalSirens <= 2) rating = { label: 'STEEL DOME', stars: 4 };
    else if (totalSirens <= 5) rating = { label: 'SOLID DEFENSE', stars: 3 };
    else if (totalSirens <= 8) rating = { label: 'BATTERED BUT STANDING', stars: 2 };
    else rating = { label: 'BREACH', stars: 1 };

    return {
      ...campaign,
      rating,
      levelsCompleted: campaign.levelScores.length,
    };
  }, []);

  // Save current level stats to campaign accumulator
  const saveLevelToCampaign = useCallback(() => {
    const stats = getLevelStats();
    const c = campaignStatsRef.current;
    c.totalScore += stats.score;
    c.levelScores.push({ level: stats.level, score: stats.score, rating: stats.rating, sirenCount: stats.sirenCount });
    c.totalCorrectIntercepts += stats.correctIntercepts;
    c.totalCorrectHolds += stats.correctHolds;
    c.totalSirens += stats.sirenCount;
    c.totalWrongIntercepts += stats.wrongIntercepts;
    c.totalWastedIntercepts += stats.wastedIntercepts;
    c.totalPenaltyTime += stats.totalPenaltyTime;
    c.overallBestStreak = Math.max(c.overallBestStreak, stats.bestStreak);
  }, [getLevelStats]);

  // Start campaign from Level 1
  const startCampaign = useCallback(() => {
    campaignStatsRef.current = {
      totalScore: 0, levelScores: [],
      totalCorrectIntercepts: 0, totalCorrectHolds: 0,
      totalSirens: 0, totalWrongIntercepts: 0,
      totalWastedIntercepts: 0, totalPenaltyTime: 0,
      overallBestStreak: 0,
    };
    setCurrentLevel(1);
    setGameState(GAME_STATES.BRIEFING);
    setSessionTime(0);
    setAmmo({ ...getLevelConfig(1).ammo });
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

  // Start a specific level (called after briefing/level intro)
  const startLevel = useCallback((level) => {
    const config = getLevelConfig(level);
    setCurrentLevel(level);
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
    setGameState(GAME_STATES.ACTIVE);
  }, []);

  // Advance to next level (called from LEVEL_COMPLETE screen)
  const advanceLevel = useCallback(() => {
    saveLevelToCampaign();
    const nextLevel = currentLevelRef.current + 1;
    if (nextLevel > TOTAL_LEVELS) {
      setGameState(GAME_STATES.SUMMARY);
    } else {
      setCurrentLevel(nextLevel);
      setGameState(GAME_STATES.LEVEL_INTRO);
    }
  }, [saveLevelToCampaign]);

  // Called when final level completes and goes to summary
  const finishCampaign = useCallback(() => {
    saveLevelToCampaign();
    setGameState(GAME_STATES.SUMMARY);
  }, [saveLevelToCampaign]);

  const skipBriefing = useCallback(() => {
    if (gameStateRef.current !== GAME_STATES.BRIEFING) return;
    startLevel(1);
  }, [startLevel]);

  const resetGame = useCallback(() => {
    stopSiren();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (autoEndTimerRef.current) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }
    setGameState(GAME_STATES.PRE_GAME);
    setCurrentLevel(1);
    setSessionTime(0);
    setAmmo({ ...getLevelConfig(1).ammo });
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

  return {
    gameState,
    currentLevel,
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
    startCampaign,
    startLevel,
    advanceLevel,
    finishCampaign,
    resetGame,
    togglePause,
    skipBriefing,
    handleAction,
    setSelectedThreatId,
    setVolume,
    getLevelStats,
    getCampaignStats,
    GAME_STATES,
  };
}
