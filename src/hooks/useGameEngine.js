import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getThreats,
  getLevelConfig,
  TOTAL_LEVELS,
  IMPACT_POSITIONS,
  COMMAND_CENTER,
  INTERCEPTOR_COLORS,
} from '../config/threats.js';
import { getBatteryForLevel } from '../config/mapLayers.js';
import { getSpawnOrigin } from '../config/spawnOrigins.js';
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
  LEVEL_COMPLETE: 'level_complete',
  SUMMARY: 'summary',
};

// Leaderboard localStorage key
const LB_KEY = 'missile_defense_leaderboard';

export function calculateScore(stats) {
  const base = (stats.correctIntercepts * 100) + (stats.correctHolds * 50);
  const penalties = (stats.sirenCount * -200) + (stats.wastedIntercepts * -30) + (stats.wrongIntercepts * -20);
  const ammoTotal = Object.values(stats.ammoRemaining).reduce((sum, v) => sum + v, 0);
  const bonuses = (stats.bestStreak * 25) + (ammoTotal * 10);
  return Math.max(0, base + penalties + bonuses);
}

export function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY)) || [];
  } catch { return []; }
}

export function saveToLeaderboard(entry) {
  const lb = getLeaderboard();
  lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem(LB_KEY, JSON.stringify(lb.slice(0, 50)));
  return lb;
}

export function clearLeaderboard() {
  localStorage.removeItem(LB_KEY);
}

export default function useGameEngine() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState(GAME_STATES.PRE_GAME);
  const [sessionTime, setSessionTime] = useState(0);
  const [ammo, setAmmo] = useState({ ...getLevelConfig(1).ammo });
  const [activeThreats, setActiveThreats] = useState([]);
  const [selectedThreatId, setSelectedThreatId] = useState(null);
  const [tzevaAdomActive, setTzevaAdomActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [resultLog, setResultLog] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [escapeRoomTime, setEscapeRoomTime] = useState(20 * 60);
  const [escapeRoomStartTime, setEscapeRoomStartTime] = useState(20 * 60);
  const [sirenCount, setSirenCount] = useState(0);
  const [wrongInterceptAttempts, setWrongInterceptAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finalSalvoWarning, setFinalSalvoWarning] = useState(false);
  const [impactFlashes, setImpactFlashes] = useState([]);
  const [activeTrails, setActiveTrails] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  const [tzurActive, setTzurActive] = useState(false);
  const tzurUsedRef = useRef(false);

  // Refs for stale closure avoidance
  const gameStateRef = useRef(gameState);
  const selectedThreatIdRef = useRef(selectedThreatId);
  const activeThreatsRef = useRef(activeThreats);
  const ammoRef = useRef(ammo);
  const volumeRef = useRef(volume);
  const currentLevelRef = useRef(currentLevel);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { selectedThreatIdRef.current = selectedThreatId; }, [selectedThreatId]);
  useEffect(() => { activeThreatsRef.current = activeThreats; }, [activeThreats]);
  useEffect(() => { ammoRef.current = ammo; }, [ammo]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { currentLevelRef.current = currentLevel; }, [currentLevel]);

  const animFrameRef = useRef(null);
  const lastTickRef = useRef(null);
  const spawnedIdsRef = useRef(new Set());
  const feedbackTimerRef = useRef(null);
  const tzevaAdomTimerRef = useRef(null);
  const allSpawnedRef = useRef(false);
  const interceptedIdsRef = useRef(new Set());  // Synchronous guard against race conditions

  // Campaign stats — accumulated across all levels
  const campaignStatsRef = useRef({
    totalScore: 0,
    levelScores: [],
    totalCorrectIntercepts: 0,
    totalCorrectHolds: 0,
    totalSirens: 0,
    totalWrongIntercepts: 0,
    totalWastedIntercepts: 0,
    overallBestStreak: 0,
  });

  // Audio refs
  const sirenRef = useRef(null);
  const pingRef = useRef(null);
  const successRef = useRef(null);
  const failRef = useRef(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    sirenRef.current = new Audio(`${base}sounds/siren.mp3`);
    sirenRef.current.loop = true;
    pingRef.current = new Audio(`${base}sounds/ping.wav`);
    successRef.current = new Audio(`${base}sounds/success.wav`);
    failRef.current = new Audio(`${base}sounds/fail.wav`);
  }, []);

  useEffect(() => {
    [sirenRef, pingRef, successRef, failRef].forEach((ref) => {
      if (ref.current) ref.current.volume = volume;
    });
  }, [volume]);

  const playSound = useCallback((ref, vol) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.volume = vol !== undefined ? vol : volumeRef.current;
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
  // Stores mapX/mapY in 0-1 normalized space (RadarDisplay transforms to SVG via mapToSVG)
  const addImpactFlash = useCallback((zone, type, threatType = 'ballistic', overridePos = null) => {
    const flashId = Date.now() + Math.random();
    const pos = overridePos || IMPACT_POSITIONS[zone] || { x: 0.5, y: 0.5 };
    const cx = pos.x;
    const cy = pos.y;

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

  // Compute where a threat blip currently IS on the radar
  // Uses shared spawn origin system from config/spawnOrigins.js
  const getBlipPosition = useCallback((threat) => {
    const target = IMPACT_POSITIONS[threat.impact_zone] || { x: 0.5, y: 0.5 };
    const linearProgress = 1 - threat.timeLeft / threat.countdown;
    let progress = linearProgress;
    if (threat.type === 'ballistic') progress = linearProgress ** 3;
    else if (threat.type === 'hypersonic') progress = linearProgress ** 4;
    const start = getSpawnOrigin(threat.type, threat.origin);
    return { x: start.x + (target.x - start.x) * progress, y: start.y + (target.y - start.y) * progress };
  }, []);

  // Launch interceptor trail with delayed impact flash
  const addTrail = useCallback((action, threat, impactType) => {
    const battery = getBatteryForLevel(currentLevelRef.current) || COMMAND_CENTER;
    if (!battery) return;

    const { x: blipX, y: blipY } = getBlipPosition(threat);

    // Immediate launch sound feedback
    playLaunchSound(volumeRef.current);

    const trailId = Date.now() + Math.random();
    const duration = 600;

    setActiveTrails((prev) => [...prev, {
      id: trailId,
      startX: battery.x,
      startY: battery.y,
      endX: blipX,
      endY: blipY,
      color: INTERCEPTOR_COLORS[action],
      duration,
    }]);

    setTimeout(() => {
      setActiveTrails((prev) => prev.filter((t) => t.id !== trailId));
    }, duration + 500);

    if (impactType) {
      setTimeout(() => {
        addImpactFlash(threat.impact_zone, impactType, threat.type, { x: blipX, y: blipY });
        if (impactType === 'intercept') playInterceptSound(volumeRef.current, threat.type);
      }, duration);
    }
  }, [addImpactFlash, getBlipPosition]);

  // === TZUR MODE — teddy bear cheat code (Level 1 only, once per campaign) ===
  const triggerTzurMode = useCallback(() => {
    if (tzurUsedRef.current) return;
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;
    if (currentLevelRef.current !== 1) return;

    tzurUsedRef.current = true;
    setTzurActive(true);

    // After 1.5s (bear drops + starts spinning), intercept all active threats
    setTimeout(() => {
      const battery = getBatteryForLevel(currentLevelRef.current) || COMMAND_CENTER;
      const threats = activeThreatsRef.current.filter((t) => !t.intercepted && !t.held);

      threats.forEach((threat, i) => {
        // Stagger trails slightly for visual effect
        setTimeout(() => {
          interceptedIdsRef.current.add(threat.id);
          const { x: blipX, y: blipY } = getBlipPosition(threat);

          // Fire trail from bear (battery position) to each threat
          const trailId = Date.now() + Math.random() + i;
          const duration = 400;
          setActiveTrails((prev) => [...prev, {
            id: trailId,
            startX: battery.x, startY: battery.y,
            endX: blipX, endY: blipY,
            color: '#f59e0b', // gold for teddy
            duration,
          }]);
          setTimeout(() => setActiveTrails((prev) => prev.filter((t) => t.id !== trailId)), duration + 500);

          // Intercept explosion at blip position
          setTimeout(() => {
            addImpactFlash(threat.impact_zone, 'intercept', threat.type, { x: blipX, y: blipY });
            playInterceptSound(volumeRef.current, threat.type);
          }, duration);
        }, i * 120); // 120ms stagger between each shot
      });

      // Mark all threats as intercepted
      setActiveThreats((prev) => prev.map((t) =>
        (!t.intercepted && !t.held) ? { ...t, intercepted: true, frozenTimeLeft: t.timeLeft } : t
      ));

      // Log as correct intercepts
      setResultLog((prev) => [
        ...prev,
        ...threats.map((t) => ({ ...t, result: 'correct_intercept', siren: false })),
      ]);

      // Update streak
      setStreak((s) => {
        const next = s + threats.length;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });

      // Remove intercepted threats after trails finish
      setTimeout(() => {
        setActiveThreats((prev) => prev.filter((t) => !t.intercepted));
      }, threats.length * 120 + 800);
    }, 1500);

    // Bear fades out after 4.5s
    setTimeout(() => setTzurActive(false), 4500);
  }, [addImpactFlash, getBlipPosition]);

  // Trigger tzeva adom — non-blocking, brief flash (no timer penalty — points-based only)
  const triggerTzevaAdom = useCallback(() => {
    setSirenCount((c) => c + 1);

    // Play siren briefly (non-looping, ~3s)
    if (sirenRef.current) {
      sirenRef.current.currentTime = 0;
      sirenRef.current.loop = false;
      sirenRef.current.volume = volumeRef.current;
      sirenRef.current.play().catch(() => {});
    }

    // Show translucent overlay (non-blocking)
    setTzevaAdomActive(true);

    // Auto-dismiss overlay after 3 seconds
    if (tzevaAdomTimerRef.current) clearTimeout(tzevaAdomTimerRef.current);
    tzevaAdomTimerRef.current = setTimeout(() => {
      setTzevaAdomActive(false);
      stopSiren();
    }, 3000);
  }, [stopSiren]);

  // Handle threat timeout (countdown reached 0) — covers both unactioned timeouts and held threats
  const handleThreatTimeout = useCallback((threat) => {
    // Guard: if threat was intercepted between timeout scheduling and execution, skip entirely.
    // This prevents the race condition where the countdown interval schedules a timeout
    // in the same frame that the player successfully intercepts.
    if (interceptedIdsRef.current.has(threat.id)) return;

    setActiveThreats((prev) => prev.filter((t) => t.id !== threat.id));
    if (selectedThreatIdRef.current === threat.id) {
      setSelectedThreatId(null);
    }

    if (threat.is_populated) {
      // City hit — either player held fire (wrong) or didn't act in time
      const result = threat.held ? 'hold_populated' : 'timeout';
      setResultLog((prev) => [...prev, { ...threat, result, siren: true }]);
      playSound(failRef);
      addImpactFlash(threat.impact_zone, 'city_hit', threat.type);
      playCityHitSound(volumeRef.current);
      setStreak(0);
      triggerTzevaAdom();
    } else if (threat.held) {
      // Correct hold — player let it through, lands harmlessly
      setResultLog((prev) => [...prev, { ...threat, result: 'correct_hold', siren: false }]);
      playSound(successRef);
      addImpactFlash(threat.impact_zone, 'ground_impact', threat.type);
      playGroundImpactSound(volumeRef.current);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
      showFeedback(`Threat landed in ${threat.impact_zone} — no damage. Ammunition conserved.`, 'success');
    } else {
      // Unactioned timeout — player didn't respond in time
      setResultLog((prev) => [...prev, { ...threat, result: 'timeout_open', siren: false }]);
      addImpactFlash(threat.impact_zone, 'ground_impact', threat.type);
      playGroundImpactSound(volumeRef.current);
      showFeedback(`Threat landed in ${threat.impact_zone} — no damage.`, 'neutral');
    }
  }, [triggerTzevaAdom, playSound, showFeedback, addImpactFlash]);

  // Handle player action
  const handleAction = useCallback((action) => {
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;

    const currentThreats = activeThreatsRef.current;
    const currentSelected = selectedThreatIdRef.current;
    const threat = currentThreats.find((t) => t.id === currentSelected);
    if (!threat) return;

    if (action === 'hold_fire') {
      // Mark threat as "held" — it continues on its trajectory to the city.
      // Effects (tzeva adom / success feedback) trigger when it actually impacts.
      setActiveThreats((prev) => prev.map((t) =>
        t.id === threat.id ? { ...t, held: true } : t
      ));
      setSelectedThreatId(null);
      return;
    }

    // Interceptor action — validate ammo before firing
    if (ammoRef.current[action] <= 0) return;
    setAmmo((prev) => ({ ...prev, [action]: prev[action] - 1 }));

    const isCorrect = action === threat.correct_action;

    if (isCorrect) {
      // Synchronously mark as intercepted BEFORE any async state updates
      // This guards against the race condition where the countdown interval
      // reaches timeLeft=0 and schedules handleThreatTimeout in the same frame
      interceptedIdsRef.current.add(threat.id);

      // Mark threat as intercepted (stays visible while trail animates) instead of removing immediately
      setActiveThreats((prev) => prev.map((t) =>
        t.id === threat.id ? { ...t, intercepted: true, frozenTimeLeft: t.timeLeft } : t
      ));
      setSelectedThreatId(null);

      // Remove after trail animation completes (600ms)
      const threatId = threat.id;
      setTimeout(() => {
        setActiveThreats((prev) => prev.filter((t) => t.id !== threatId));
      }, 650);

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
      const SYSTEM_NAMES = { iron_dome: 'Iron Dome', davids_sling: "David's Sling", arrow_2: 'Arrow 2', arrow_3: 'Arrow 3' };
      const correctName = SYSTEM_NAMES[threat.correct_action] || threat.correct_action;
      showFeedback(`INTERCEPTION FAILED — use ${correctName}!`, 'error');
    }
  }, [triggerTzevaAdom, playSound, showFeedback, addImpactFlash, addTrail, getBlipPosition]);

  // Main game loop — drives sessionTime via requestAnimationFrame (ACTIVE state only)
  const tick = useCallback((timestamp) => {
    // Safety guard: only tick during ACTIVE gameplay
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;

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

  // Spawn threats + salvo warnings + upcoming threats
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE) return;

    const config = getLevelConfig(currentLevel);
    const threats = getThreats(currentLevel);

    let spawned = false;
    let unspawnedCount = 0;
    const upcoming = [];

    threats.forEach((t) => {
      if (sessionTime >= t.appear_time && !spawnedIdsRef.current.has(t.id)) {
        spawnedIdsRef.current.add(t.id);
        spawned = true;
        setActiveThreats((prev) => {
          const newThreat = {
            ...t,
            timeLeft: t.countdown,
            impactRevealed: t.reveal_pct >= 1.0,
            _corrected: false,
          };
          const newThreats = [...prev, newThreat];
          const selectable = newThreats.filter((t) => !t.intercepted && !t.held);
          if (selectable.length === 1) {
            setSelectedThreatId(selectable[0].id);
          }
          return newThreats;
        });
        playSound(pingRef);
      }
      if (!spawnedIdsRef.current.has(t.id)) {
        unspawnedCount++;
        if (upcoming.length < 3) {
          upcoming.push({ ...t, timeUntil: t.appear_time - sessionTime });
        }
      }
    });

    allSpawnedRef.current = unspawnedCount === 0;

    // Salvo warnings
    const warnings = config.salvo_warnings || [];
    const active = warnings.find((w) => sessionTime >= w.time && sessionTime < w.end_time);
    setFinalSalvoWarning(active || null);

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

    const unresolvedThreats = activeThreats.filter((t) => !t.intercepted);
    if (allSpawnedRef.current && unresolvedThreats.length === 0) {
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

  // Tick active threat countdowns + progressive reveal
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE || paused) return;

    let lastTime = performance.now();
    const processedTimeouts = new Set();

    const interval = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setActiveThreats((prev) => {
        const updated = prev.map((t) => {
          // Don't tick intercepted threats — they're frozen, waiting for trail to arrive
          if (t.intercepted) return t;

          const newTimeLeft = Math.max(0, t.timeLeft - dt);
          const pctRemaining = newTimeLeft / t.countdown;
          let updatedThreat = { ...t, timeLeft: newTimeLeft };

          // Progressive reveal
          if (!t.impactRevealed && t.reveal_pct && pctRemaining <= t.reveal_pct) {
            updatedThreat.impactRevealed = true;
          }

          return updatedThreat;
        });

        const timedOut = updated.filter(
          (t) => t.timeLeft <= 0 && !t.intercepted && !processedTimeouts.has(t.id)
            && !interceptedIdsRef.current.has(t.id)
        );

        if (timedOut.length > 0) {
          timedOut.forEach((t) => processedTimeouts.add(t.id));
          setTimeout(() => {
            timedOut.forEach((t) => handleThreatTimeout(t));
          }, 0);
        }

        return updated.filter((t) => t.timeLeft > 0 || t.intercepted);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, paused, handleThreatTimeout]);

  // (Tzeva adom is now non-blocking — no countdown effect needed)

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
    const totalThreats = resultLog.length;
    const correctIntercepts = resultLog.filter((r) => r.result === 'correct_intercept').length;
    const populatedThreats = resultLog.filter((r) => r.is_populated).length;
    const correctHolds = resultLog.filter((r) => r.result === 'correct_hold').length;
    const openGroundThreats = resultLog.filter((r) => !r.is_populated).length;
    const timeouts = resultLog.filter((r) => r.result === 'timeout').length;
    const wastedIntercepts = resultLog.filter((r) => r.result === 'wasted_intercept').length;
    const holdOnPopulated = resultLog.filter((r) => r.result === 'hold_populated').length;

    const score = Math.max(0,
      (correctIntercepts * 100)
      + (correctHolds * 75)
      + (bestStreak * 25)
      + (totalThreats * 10)          // base engagement bonus
      - (sirenCount * 100)
      - (wrongInterceptAttempts * 50)
      - (wastedIntercepts * 25)
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
      sirenCount,
      bestStreak,
      rating,
      score,
    };
  }, [resultLog, ammo, sirenCount, wrongInterceptAttempts, bestStreak, currentLevel]);

  // Running score — same formula as getLevelStats, usable during gameplay
  const getRunningScore = useCallback(() => {
    const correctIntercepts = resultLog.filter((r) => r.result === 'correct_intercept').length;
    const correctHolds = resultLog.filter((r) => r.result === 'correct_hold').length;
    const wastedIntercepts = resultLog.filter((r) => r.result === 'wasted_intercept').length;
    const totalProcessed = resultLog.length;

    return Math.max(0,
      (correctIntercepts * 100)
      + (correctHolds * 75)
      + (bestStreak * 25)
      + (totalProcessed * 10)
      - (sirenCount * 100)
      - (wrongInterceptAttempts * 50)
      - (wastedIntercepts * 25)
    );
  }, [resultLog, sirenCount, wrongInterceptAttempts, bestStreak]);

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
    c.overallBestStreak = Math.max(c.overallBestStreak, stats.bestStreak);
  }, [getLevelStats]);

  // Start campaign from Level 1
  const startCampaign = useCallback(() => {
    campaignStatsRef.current = {
      totalScore: 0, levelScores: [],
      totalCorrectIntercepts: 0, totalCorrectHolds: 0,
      totalSirens: 0, totalWrongIntercepts: 0,
      totalWastedIntercepts: 0,
      overallBestStreak: 0,
      quizPoints: 0,
    };
    setCurrentLevel(1);
    setGameState(GAME_STATES.BRIEFING);
    setSessionTime(0);
    setAmmo({ ...getLevelConfig(1).ammo });
    setActiveThreats([]);
    setSelectedThreatId(null);
    setResultLog([]);
    setFeedbackMessage(null);
    setEscapeRoomTime(escapeRoomStartTime);
    setTzevaAdomActive(false);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setScreenShake(false);
    setTzurActive(false);
    setPaused(false);
    spawnedIdsRef.current = new Set();
    interceptedIdsRef.current.clear();
    tzurUsedRef.current = false;
    allSpawnedRef.current = false;
    lastTickRef.current = null;
    if (tzevaAdomTimerRef.current) clearTimeout(tzevaAdomTimerRef.current);

    if (autoEndTimerRef.current) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }
  }, [escapeRoomStartTime]);

  // Start a specific level (called after briefing/level intro)
  // Note: escape room timer is NOT reset between levels — it persists across the campaign
  const startLevel = useCallback((level) => {
    const config = getLevelConfig(level);
    setCurrentLevel(level);
    setSessionTime(0);
    setAmmo({ ...config.ammo });
    setActiveThreats([]);
    setSelectedThreatId(null);
    setResultLog([]);
    setFeedbackMessage(null);
    setTzevaAdomActive(false);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setScreenShake(false);
    setTzurActive(false);
    setPaused(false);
    spawnedIdsRef.current = new Set();
    interceptedIdsRef.current.clear();
    allSpawnedRef.current = false;
    lastTickRef.current = null;
    if (tzevaAdomTimerRef.current) clearTimeout(tzevaAdomTimerRef.current);

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
      setSessionTime(0); // Reset so timer shows full duration during intro
      setGameState(GAME_STATES.BRIEFING);
    }
  }, [saveLevelToCampaign]);

  // Called when final level completes and goes to summary
  const finishCampaign = useCallback(() => {
    saveLevelToCampaign();
    setGameState(GAME_STATES.SUMMARY);
  }, [saveLevelToCampaign]);

  const skipBriefing = useCallback(() => {
    if (gameStateRef.current !== GAME_STATES.BRIEFING) return;
    setGameState(GAME_STATES.LEVEL_INTRO);
  }, []);

  // Facilitator: jump to any level's intro/briefing screen
  const jumpToLevel = useCallback((level) => {
    stopSiren();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (tzevaAdomTimerRef.current) clearTimeout(tzevaAdomTimerRef.current);

    if (autoEndTimerRef.current) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }
    // Reset campaign stats fresh for the jump
    campaignStatsRef.current = {
      totalScore: 0, levelScores: [],
      totalCorrectIntercepts: 0, totalCorrectHolds: 0,
      totalSirens: 0, totalWrongIntercepts: 0,
      totalWastedIntercepts: 0,
      overallBestStreak: 0,
      quizPoints: 0,
    };
    setCurrentLevel(level);
    setSessionTime(0);
    setAmmo({ ...getLevelConfig(level).ammo });
    setActiveThreats([]);
    setSelectedThreatId(null);
    setResultLog([]);
    setFeedbackMessage(null);
    setEscapeRoomTime(escapeRoomStartTime);
    setTzevaAdomActive(false);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setScreenShake(false);
    setTzurActive(false);
    setPaused(false);
    spawnedIdsRef.current = new Set();
    interceptedIdsRef.current.clear();
    allSpawnedRef.current = false;
    lastTickRef.current = null;
    // All levels go through Briefing first
    setGameState(GAME_STATES.BRIEFING);
  }, [stopSiren, escapeRoomStartTime]);

  const resetGame = useCallback(() => {
    stopSiren();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (tzevaAdomTimerRef.current) clearTimeout(tzevaAdomTimerRef.current);

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
    setEscapeRoomTime(escapeRoomStartTime);
    setTzevaAdomActive(false);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setScreenShake(false);
    setTzurActive(false);
    setPaused(false);
    spawnedIdsRef.current = new Set();
    interceptedIdsRef.current.clear();
    tzurUsedRef.current = false;
    allSpawnedRef.current = false;
    lastTickRef.current = null;
  }, [stopSiren, escapeRoomStartTime]);

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  // Escape room timer — ticks during ALL states except PRE_GAME and SUMMARY
  useEffect(() => {
    const shouldTick =
      gameState !== GAME_STATES.PRE_GAME &&
      gameState !== GAME_STATES.SUMMARY &&
      !paused;
    if (!shouldTick) return;

    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setEscapeRoomTime((prev) => prev - delta);
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, paused]);

  // Add quiz points to campaign total
  const addQuizPoints = useCallback((points) => {
    campaignStatsRef.current.totalScore += points;
    if (!campaignStatsRef.current.quizPoints) {
      campaignStatsRef.current.quizPoints = 0;
    }
    campaignStatsRef.current.quizPoints += points;
  }, []);

  return {
    gameState,
    currentLevel,
    sessionTime,
    ammo,
    activeThreats,
    selectedThreatId,
    tzevaAdomActive,
    paused,
    volume,
    resultLog,
    feedbackMessage,
    escapeRoomTime,
    escapeRoomStartTime,
    sirenCount,
    streak,
    bestStreak,
    finalSalvoWarning,
    impactFlashes,
    activeTrails,
    screenShake,
    tzurActive,
    triggerTzurMode,
    startCampaign,
    startLevel,
    advanceLevel,
    finishCampaign,
    resetGame,
    togglePause,
    skipBriefing,
    jumpToLevel,
    handleAction,
    setSelectedThreatId,
    setVolume,
    setEscapeRoomStartTime,
    getLevelStats,
    getRunningScore,
    getCampaignStats,
    addQuizPoints,
    GAME_STATES,
  };
}
