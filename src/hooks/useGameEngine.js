import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getThreats,
  getLevelConfig,
  pickThreatVariant,
  TOTAL_LEVELS,
  IMPACT_POSITIONS,
  COMMAND_CENTER,
  INTERCEPTOR_COLORS,
} from '../config/threats.js';
import { getBatteryForLevel, getNearestBattery } from '../config/mapLayers.js';
import { getSpawnOrigin } from '../config/spawnOrigins.js';
import {
  playInterceptSound,
  playCityHitSound,
  playGroundImpactSound,
  playLaunchSound,
  playShieldBounceSound,
  playBeardZapSound,
} from '../utils/soundEffects.js';

export const GAME_STATES = {
  PRE_GAME: 'pre_game',
  SCORING_INTRO: 'scoring_intro',
  BRIEFING: 'briefing',
  LEVEL_INTRO: 'level_intro',
  ACTIVE: 'active',
  LEVEL_COMPLETE: 'level_complete',
  SUMMARY: 'summary',
};

// Leaderboard localStorage key
const LB_KEY = 'missile_defense_leaderboard';

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

export default function useGameEngine({ bonusLevelEnabled = false } = {}) {
  // When bonus is OFF, campaign ends after L6 (effectiveTotalLevels = 6)
  // When bonus is ON, L7 is included (effectiveTotalLevels = 7)
  const effectiveTotalLevels = bonusLevelEnabled ? TOTAL_LEVELS : TOTAL_LEVELS - 1;
  const effectiveTotalLevelsRef = useRef(effectiveTotalLevels);
  effectiveTotalLevelsRef.current = effectiveTotalLevels;

  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState(GAME_STATES.PRE_GAME);
  const [sessionTime, setSessionTime] = useState(0);
  const [ammo, setAmmo] = useState({ ...getLevelConfig(1).ammo });
  const [activeThreats, setActiveThreats] = useState([]);
  const [selectedThreatId, setSelectedThreatId] = useState(null);
  const [tzevaAdomActive, setTzevaAdomActive] = useState(false);
  const [tzevaAdomCity, setTzevaAdomCity] = useState(null);  // F5: which city was hit
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [resultLog, setResultLog] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [escapeRoomTime, setEscapeRoomTime] = useState(25 * 60);
  const [escapeRoomStartTime, setEscapeRoomStartTime] = useState(25 * 60);
  const [escapeRoomMode, setEscapeRoomMode] = useState(false);
  const [sirenCount, setSirenCount] = useState(0);
  const [wrongInterceptAttempts, setWrongInterceptAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [quizBonus, setQuizBonus] = useState(0);
  const [finalSalvoWarning, setFinalSalvoWarning] = useState(false);
  const [impactFlashes, setImpactFlashes] = useState([]);
  const [activeTrails, setActiveTrails] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  const [tzurActive, setTzurActive] = useState(false);
  const [sashaActive, setSashaActive] = useState(false);
  const sashaIntervalRef = useRef(null);
  const [dvirActive, setDvirActive] = useState(false);
  const dvirActiveRef = useRef(false);
  const [bouncingThreats, setBouncingThreats] = useState([]);
  const [sufrinActive, setSufrinActive] = useState(false);

  // Campaign-wide cheat uses (3 each, persist across levels, reset on campaign start)
  const CHEAT_MAX_USES = 3;
  const [cheatUses, setCheatUses] = useState({ tzur: CHEAT_MAX_USES, sasha: CHEAT_MAX_USES, dvir: CHEAT_MAX_USES, sufrin: CHEAT_MAX_USES });
  const cheatUsesRef = useRef({ tzur: CHEAT_MAX_USES, sasha: CHEAT_MAX_USES, dvir: CHEAT_MAX_USES, sufrin: CHEAT_MAX_USES });

  // Instant-effect cheat code refs (once per level)
  const hhUsedRef = useRef(false);  // "bh" — clear all threats
  const rlUsedRef = useRef(false);  // "bsd" — resupply ammo

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
  const sessionTimeRef = useRef(0);
  useEffect(() => { sessionTimeRef.current = sessionTime; }, [sessionTime]);

  const animFrameRef = useRef(null);
  const lastTickRef = useRef(null);
  const spawnedIdsRef = useRef(new Set());
  const feedbackTimerRef = useRef(null);
  const tzevaAdomTimerRef = useRef(null);
  const allSpawnedRef = useRef(false);
  const interceptedIdsRef = useRef(new Set());  // Synchronous guard against race conditions
  const lastInterceptTimeRef = useRef(0);  // For combo detection (F3)
  const [comboMessage, setComboMessage] = useState(null);  // "DOUBLE INTERCEPT!" overlay

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
    endedEarly: false,
  });

  // Audio refs
  const sirenRef = useRef(null);
  const pingRef = useRef(null);
  const successRef = useRef(null);
  const failRef = useRef(null);

  // Threat variant — picked once per level start, stable across re-renders
  const selectedThreatsRef = useRef(null);

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
  const addImpactFlash = useCallback((zone, type, threatType = 'ballistic', overridePos = null, scoreText = null) => {
    const flashId = Date.now() + Math.random();
    const pos = overridePos || IMPACT_POSITIONS[zone] || { x: 0.5, y: 0.5 };
    const cx = pos.x;
    const cy = pos.y;

    let particles = [];
    if (type === 'shield_deflect') {
      // Bounce particles — fly upward/outward like deflecting off a dome
      particles = Array.from({ length: 10 }, (_, i) => {
        const angle = -Math.PI * 0.15 + (i / 9) * Math.PI * 1.3 - Math.PI * 0.5;
        const dist = 6 + Math.random() * 5;
        return {
          endX: Math.cos(angle) * dist,
          endY: Math.sin(angle) * dist - 3,
          r: 0.3 + Math.random() * 0.2,
          delay: i * 0.02,
          color: i % 2 === 0 ? '#4CAF50' : '#81C784',
        };
      });
    } else if (type === 'intercept') {
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
      scoreText: scoreText || (type === 'city_hit' ? '-100' : null),
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
  const addTrail = useCallback((action, threat, impactType, scoreText = null) => {
    const { x: blipX, y: blipY } = getBlipPosition(threat);

    // Pick nearest battery to the threat's current position (blip on radar).
    // For L5-7 multi-battery: intercept from closest base to the incoming threat.
    const battery = getNearestBattery(currentLevelRef.current, blipX, blipY)
      || getBatteryForLevel(currentLevelRef.current)
      || COMMAND_CENTER;
    if (!battery) return;

    // Immediate launch sound feedback — distinct per interceptor type
    playLaunchSound(volumeRef.current, action);

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
        addImpactFlash(threat.impact_zone, impactType, threat.type, { x: blipX, y: blipY }, scoreText);
        if (impactType === 'intercept') playInterceptSound(volumeRef.current, threat.type);
      }, duration);
    }
  }, [addImpactFlash, getBlipPosition]);

  // === SUFRIN MODE — beard defense cheat code (once per level, sustained 15s defense) ===
  const sufrinIntervalRef = useRef(null);

  const triggerSufrinMode = useCallback(() => {
    if (cheatUsesRef.current.sufrin <= 0) return;
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;

    cheatUsesRef.current.sufrin--;
    setCheatUses(prev => ({ ...prev, sufrin: cheatUsesRef.current.sufrin }));
    setSufrinActive(true);

    // After 1s (portrait drops in), start zapping threats every 300ms
    setTimeout(() => {
      const zapThreat = () => {
        const threats = activeThreatsRef.current.filter(
          (t) => !t.intercepted && !t.held && !interceptedIdsRef.current.has(t.id)
        );
        if (threats.length === 0) return;

        // Zap the most urgent threat first
        const target = threats.sort((a, b) => a.timeLeft - b.timeLeft)[0];
        interceptedIdsRef.current.add(target.id);
        const { x: blipX, y: blipY } = getBlipPosition(target);

        // No trail needed — the SVG beard strands already show the visual
        // connection from beard to threat. Just flash + sound on impact.
        addImpactFlash(target.impact_zone, 'intercept', target.type, { x: blipX, y: blipY }, '+75');
        playBeardZapSound(volumeRef.current);

        // Mark intercepted
        setActiveThreats((prev) => prev.map((t) =>
          t.id === target.id ? { ...t, intercepted: true, frozenTimeLeft: t.timeLeft } : t
        ));

        // Log + streak
        setResultLog((prev) => [...prev, { ...target, result: 'correct_intercept', siren: false, cheatAssisted: true }]);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });

        // Remove threat after brief delay for visual feedback
        const tid = target.id;
        setTimeout(() => {
          setActiveThreats((prev) => prev.filter((t) => t.id !== tid));
        }, 500);
      };

      // Immediate first zap, then every 300ms
      zapThreat();
      sufrinIntervalRef.current = setInterval(zapThreat, 300);
    }, 1000);

    // Stop zapping at 14s
    setTimeout(() => {
      if (sufrinIntervalRef.current) {
        clearInterval(sufrinIntervalRef.current);
        sufrinIntervalRef.current = null;
      }
    }, 14000);

    // Portrait fades out after 15.5s
    setTimeout(() => setSufrinActive(false), 15500);
  }, [addImpactFlash, getBlipPosition]);

  // === TZUR MODE — teddy bear cheat code (once per level) ===
  const tzurIntervalRef = useRef(null);

  const triggerTzurMode = useCallback(() => {
    if (cheatUsesRef.current.tzur <= 0) return;
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;

    cheatUsesRef.current.tzur--;
    setCheatUses(prev => ({ ...prev, tzur: cheatUsesRef.current.tzur }));
    setTzurActive(true);

    // After 1.5s (bear drops in), start sustained zapping every 300ms
    setTimeout(() => {
      const zapThreat = () => {
        const threats = activeThreatsRef.current.filter(
          (t) => !t.intercepted && !t.held && !interceptedIdsRef.current.has(t.id)
        );
        if (threats.length === 0) return;

        // Zap the most urgent threat first
        const target = threats.sort((a, b) => a.timeLeft - b.timeLeft)[0];
        interceptedIdsRef.current.add(target.id);
        const { x: blipX, y: blipY } = getBlipPosition(target);

        // No trail needed — SVG bullet tracers from glock handle the visual
        addImpactFlash(target.impact_zone, 'intercept', target.type, { x: blipX, y: blipY }, '+75');
        playInterceptSound(volumeRef.current, target.type);

        // Mark intercepted
        setActiveThreats((prev) => prev.map((t) =>
          t.id === target.id ? { ...t, intercepted: true, frozenTimeLeft: t.timeLeft } : t
        ));

        // Log + streak
        setResultLog((prev) => [...prev, { ...target, result: 'correct_intercept', siren: false, cheatAssisted: true }]);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });

        // Remove threat after brief delay
        const tid = target.id;
        setTimeout(() => {
          setActiveThreats((prev) => prev.filter((t) => t.id !== tid));
        }, 500);
      };

      // Immediate first zap, then every 300ms
      zapThreat();
      tzurIntervalRef.current = setInterval(zapThreat, 300);
    }, 1500);

    // Stop zapping at 11s
    setTimeout(() => {
      if (tzurIntervalRef.current) {
        clearInterval(tzurIntervalRef.current);
        tzurIntervalRef.current = null;
      }
    }, 11000);

    // Bear fades out after 12s
    setTimeout(() => setTzurActive(false), 12000);
  }, [addImpactFlash, getBlipPosition]);

  // === SASHA MODE — laser cat cheat code (campaign-limited, sustained 8s defense) ===
  const triggerSashaMode = useCallback(() => {
    if (cheatUsesRef.current.sasha <= 0) return;
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;

    cheatUsesRef.current.sasha--;
    setCheatUses(prev => ({ ...prev, sasha: cheatUsesRef.current.sasha }));
    setSashaActive(true);

    // After 0.5s (cat lands), start zapping threats every 300ms
    setTimeout(() => {
      const zapThreat = () => {
        const threats = activeThreatsRef.current.filter(
          (t) => !t.intercepted && !t.held && !interceptedIdsRef.current.has(t.id)
        );
        if (threats.length === 0) return;

        // Zap the most urgent threat first
        const target = threats.sort((a, b) => a.timeLeft - b.timeLeft)[0];
        interceptedIdsRef.current.add(target.id);
        const { x: blipX, y: blipY } = getBlipPosition(target);

        // No trail needed — SVG laser beams from cat eyes handle the visual
        addImpactFlash(target.impact_zone, 'intercept', target.type, { x: blipX, y: blipY }, '+75');
        playInterceptSound(volumeRef.current, target.type);

        // Mark intercepted
        setActiveThreats((prev) => prev.map((t) =>
          t.id === target.id ? { ...t, intercepted: true, frozenTimeLeft: t.timeLeft } : t
        ));

        // Log + streak
        setResultLog((prev) => [...prev, { ...target, result: 'correct_intercept', siren: false, cheatAssisted: true }]);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });

        // Remove threat after brief delay
        const tid = target.id;
        setTimeout(() => {
          setActiveThreats((prev) => prev.filter((t) => t.id !== tid));
        }, 500);
      };

      // Immediate first zap, then every 300ms
      zapThreat();
      sashaIntervalRef.current = setInterval(zapThreat, 300);
    }, 500);

    // Stop zapping at 11s
    setTimeout(() => {
      if (sashaIntervalRef.current) {
        clearInterval(sashaIntervalRef.current);
        sashaIntervalRef.current = null;
      }
    }, 11000);

    // Cat fades out after 12s
    setTimeout(() => setSashaActive(false), 12000);
  }, [addImpactFlash, getBlipPosition]);

  // === DVIR MODE — turtle shield cheat code (campaign-limited, passive 12s city defense) ===
  const triggerDvirMode = useCallback(() => {
    if (cheatUsesRef.current.dvir <= 0) return;
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;

    cheatUsesRef.current.dvir--;
    setCheatUses(prev => ({ ...prev, dvir: cheatUsesRef.current.dvir }));
    setDvirActive(true);
    dvirActiveRef.current = true;

    // Shield lasts 12 seconds
    setTimeout(() => {
      dvirActiveRef.current = false;
    }, 12000);

    // Turtle fades out after 12.5s
    setTimeout(() => setDvirActive(false), 12500);
  }, []);

  // "hh" cheat — instantly intercept all active threats (once per level)
  const triggerHHMode = useCallback(() => {
    if (hhUsedRef.current) return;
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;
    hhUsedRef.current = true;

    const threats = activeThreatsRef.current.filter((t) => !t.intercepted);
    if (threats.length === 0) return;

    // Intercept every active threat with staggered flashes
    threats.forEach((threat, i) => {
      setTimeout(() => {
        interceptedIdsRef.current.add(threat.id);
        setActiveThreats((prev) => prev.map((t) =>
          t.id === threat.id ? { ...t, intercepted: true, frozenTimeLeft: t.timeLeft } : t
        ));
        // Impact flash at threat position
        if (threat.is_populated) {
          const pos = IMPACT_POSITIONS[threat.impact_zone];
          if (pos) {
            addImpactFlash(threat.impact_zone, 'intercept', threat.type, { x: pos.x, y: pos.y }, '+75');
          }
          setResultLog((prev) => [...prev, { ...threat, result: 'correct_intercept', siren: false, cheatAssisted: true }]);
          setStreak((s) => {
            const next = s + 1;
            setBestStreak((b) => Math.max(b, next));
            return next;
          });
        }
        playInterceptSound(volumeRef.current, threat.type);

        // Remove threat after flash
        setTimeout(() => {
          setActiveThreats((prev) => prev.filter((t) => t.id !== threat.id));
        }, 600);
      }, i * 80); // stagger 80ms apart for a satisfying cascade
    });
  }, [addImpactFlash]);

  // "rl" cheat — resupply +1 of each available interceptor type (once per level)
  const triggerRLMode = useCallback(() => {
    if (rlUsedRef.current) return;
    if (gameStateRef.current !== GAME_STATES.ACTIVE) return;
    rlUsedRef.current = true;

    const config = getLevelConfig(currentLevelRef.current);
    setAmmo((prev) => {
      const updated = { ...prev };
      for (const key of Object.keys(config.ammo)) {
        updated[key] = (updated[key] || 0) + 1;
      }
      return updated;
    });
  }, []);

  // Trigger tzeva adom — non-blocking, brief flash (no timer penalty — points-based only)
  const triggerTzevaAdom = useCallback((cityName = null) => {
    setSirenCount((c) => c + 1);
    setTzevaAdomCity(cityName);

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
      setTzevaAdomCity(null);
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

    // DVIR TURTLE SHIELD — if active and threat targets a populated area, auto-deflect with bounce
    if (dvirActiveRef.current && threat.is_populated) {
      interceptedIdsRef.current.add(threat.id);
      setResultLog((prev) => [...prev, { ...threat, result: 'correct_intercept', siren: false, cheatAssisted: true }]);
      addImpactFlash(threat.impact_zone, 'shield_deflect', threat.type, null, '+75');
      playShieldBounceSound(volumeRef.current);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
      // Add to bouncing threats for visual ricochet
      const impactPos = IMPACT_POSITIONS[threat.impact_zone] || { x: 0.5, y: 0.5 };
      const bounceId = Date.now() + Math.random();
      setBouncingThreats((prev) => [...prev, {
        id: bounceId,
        x: impactPos.x,
        y: impactPos.y,
        type: threat.type,
        originX: getSpawnOrigin(threat.type, threat.origin).x,
        originY: getSpawnOrigin(threat.type, threat.origin).y,
      }]);
      // Remove bouncing threat after animation completes
      setTimeout(() => {
        setBouncingThreats((prev) => prev.filter((b) => b.id !== bounceId));
      }, 800);
      return;
    }

    if (threat.is_populated) {
      // City hit — either player held fire (wrong) or didn't act in time
      const result = threat.held ? 'hold_populated' : 'timeout';
      setResultLog((prev) => [...prev, { ...threat, result, siren: true }]);
      playSound(failRef);
      addImpactFlash(threat.impact_zone, 'city_hit', threat.type);
      playCityHitSound(volumeRef.current);
      setStreak(0);
      triggerTzevaAdom(threat.impact_zone);
    } else if (threat.held) {
      // Correct hold — player let it through, lands harmlessly
      setResultLog((prev) => [...prev, { ...threat, result: 'correct_hold', siren: false }]);
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

    // Cross-compatibility: higher-tier systems CAN engage lower-tier threats (realistic physics)
    // David's Sling can intercept rockets & drones (upgraded for versatility, but wastes expensive ammo)
    // Arrow 3 can intercept ballistic missiles (both operate at high altitude/exoatmospheric)
    // Arrow 2 CANNOT engage low-altitude threats (operates at 15-80km, rockets/drones fly below 10km)
    // Arrow 3 CANNOT engage low-altitude threats (operates in space, 100km+)
    const CROSS_COMPATIBLE = {
      davids_sling: ['iron_dome'],   // David's Sling can also do Iron Dome's job
      arrow_3: ['arrow_2'],          // Arrow 3 can also do Arrow 2's job
    };
    const isExactMatch = action === threat.correct_action;
    const isCrossCompatible = !isExactMatch && (CROSS_COMPATIBLE[action] || []).includes(threat.correct_action);
    const isCorrect = isExactMatch || isCrossCompatible;

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

      // Cross-compatible intercept feedback: works but warns about wasted expensive ammo
      const SYSTEM_NAMES_FB = { iron_dome: 'Iron Dome', davids_sling: "David's Sling", arrow_2: 'Arrow 2', arrow_3: 'Arrow 3' };
      const crossWarning = isCrossCompatible
        ? ` — ${SYSTEM_NAMES_FB[action]} works but costs far more than ${SYSTEM_NAMES_FB[threat.correct_action]}!`
        : '';

      if (threat.is_populated) {
        // F3: Combo detection — 2 intercepts within 2 seconds
        const now = Date.now();
        const timeSinceLast = now - lastInterceptTimeRef.current;
        const isCombo = timeSinceLast < 2000 && lastInterceptTimeRef.current > 0;
        lastInterceptTimeRef.current = now;

        const comboPoints = isCombo ? 50 : 0;
        const pointLabel = isCombo ? '+150' : '+100';

        setResultLog((prev) => [...prev, { ...threat, result: isCrossCompatible ? 'cross_intercept' : 'correct_intercept', siren: false, comboBonus: comboPoints }]);
        addTrail(action, threat, 'intercept', pointLabel);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });

        // F2: Near-miss callout — intercepted with <2s remaining
        const isNearMiss = threat.timeLeft < 2;
        let msg = 'INTERCEPTION SUCCESSFUL';
        if (isCombo) {
          msg = '⚡ DOUBLE INTERCEPT! +150';
          setComboMessage('⚡ DOUBLE INTERCEPT!');
          setTimeout(() => setComboMessage(null), 1500);
        } else if (isNearMiss) {
          msg = '🎯 CLOSE CALL! Intercepted with less than 2s remaining';
        }
        if (isCrossCompatible) msg += crossWarning;

        showFeedback(msg, isCrossCompatible ? 'warning' : 'success');
      } else {
        setResultLog((prev) => [...prev, { ...threat, result: 'wasted_intercept', siren: false }]);
        addTrail(action, threat, 'intercept');
        showFeedback('INTERCEPTION SUCCESSFUL — but threat was headed for open ground. Interceptor wasted.', 'warning');
      }
    } else {
      setWrongInterceptAttempts((c) => c + 1);
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
    const threats = selectedThreatsRef.current || getThreats(currentLevel);

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
            impactRevealed: true,  // Always reveal target immediately on spawn
            _corrected: false,
          };
          const newThreats = [...prev, newThreat];
          // Auto-select when only 1 threat on screen (L3+ only — L1/L2 require manual targeting)
          if (currentLevel >= 3) {
            const selectable = newThreats.filter((t) => !t.intercepted && !t.held);
            if (selectable.length === 1) {
              setSelectedThreatId(selectable[0].id);
            }
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
      if (currentLevel >= effectiveTotalLevelsRef.current) {
        saveLevelToCampaign();
        setGameState(GAME_STATES.SUMMARY);
      } else {
        setGameState(GAME_STATES.LEVEL_COMPLETE);
      }
      stopSiren();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  }, [sessionTime, gameState, currentLevel, playSound, stopSiren]);

  // Auto-end level when all threats resolved
  // Ensures level never ends before its intended duration, even if threats are cleared early
  const autoEndTimerRef = useRef(null);
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE) return;
    const config = getLevelConfig(currentLevel);

    const unresolvedThreats = activeThreats.filter((t) => !t.intercepted);
    if (allSpawnedRef.current && unresolvedThreats.length === 0) {
      if (!autoEndTimerRef.current) {
        // Self-rescheduling end timer — never ends before the displayed clock hits 0:00.
        // Uses game clock (sessionTimeRef) not wall-clock, so rAF throttling can't cause early end.
        const scheduleEnd = () => {
          const remaining = config.duration - sessionTimeRef.current;
          if (remaining > 0.5) {
            // Game clock hasn't reached 0 yet — check again after remaining time
            autoEndTimerRef.current = setTimeout(scheduleEnd, Math.max(200, remaining * 1000));
            return;
          }
          // Game clock at 0:00 — apply auto_end_delay then end
          autoEndTimerRef.current = setTimeout(() => {
            if (gameStateRef.current === GAME_STATES.ACTIVE) {
              if (currentLevelRef.current >= effectiveTotalLevelsRef.current) {
                saveLevelToCampaign();
                setGameState(GAME_STATES.SUMMARY);
              } else {
                setGameState(GAME_STATES.LEVEL_COMPLETE);
              }
              stopSiren();
              if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            }
          }, config.auto_end_delay);
        };
        scheduleEnd();
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

        // DVIR SHELL DEFLECTION — intercept threats at the shell boundary (before they reach the city)
        if (dvirActiveRef.current) {
          const shellRadius = 0.025; // map-coordinate radius matching the shell visual
          updated.forEach((t) => {
            if (t.intercepted || t.held || interceptedIdsRef.current.has(t.id) || !t.is_populated) return;
            if (processedTimeouts.has(t.id)) return;
            const target = IMPACT_POSITIONS[t.impact_zone] || { x: 0.5, y: 0.5 };
            // Calculate current position
            const linearProgress = 1 - t.timeLeft / t.countdown;
            let progress = linearProgress;
            if (t.type === 'ballistic') progress = linearProgress ** 3;
            else if (t.type === 'hypersonic') progress = linearProgress ** 4;
            const start = getSpawnOrigin(t.type, t.origin);
            const cx = start.x + (target.x - start.x) * progress;
            const cy = start.y + (target.y - start.y) * progress;
            const dx = cx - target.x;
            const dy = cy - target.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < shellRadius) {
              // Threat has reached the shell edge — deflect!
              processedTimeouts.add(t.id);
              interceptedIdsRef.current.add(t.id);
              t.intercepted = true;
              t.frozenTimeLeft = t.timeLeft;
              setTimeout(() => {
                setActiveThreats((prev) => prev.filter((at) => at.id !== t.id));
                setResultLog((prev) => [...prev, { ...t, result: 'correct_intercept', siren: false, cheatAssisted: true }]);
                addImpactFlash(t.impact_zone, 'shield_deflect', t.type, null, '+75');
                playShieldBounceSound(volumeRef.current);
                setStreak((s) => {
                  const next = s + 1;
                  setBestStreak((b) => Math.max(b, next));
                  return next;
                });
                // Add bouncing threat at the SHELL EDGE position (not city center)
                const bounceId = Date.now() + Math.random();
                setBouncingThreats((prev) => [...prev, {
                  id: bounceId,
                  x: cx, y: cy, // position at shell edge
                  type: t.type,
                  originX: start.x,
                  originY: start.y,
                }]);
                setTimeout(() => {
                  setBouncingThreats((prev) => prev.filter((b) => b.id !== bounceId));
                }, 800);
              }, 0);
            }
          });
        }

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
  }, [gameState, paused, handleThreatTimeout, addImpactFlash]);

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
    const correctIntercepts = resultLog.filter((r) => r.result === 'correct_intercept' || r.result === 'cross_intercept').length;
    const regularIntercepts = resultLog.filter((r) => (r.result === 'correct_intercept' || r.result === 'cross_intercept') && !r.cheatAssisted).length;
    const cheatIntercepts = resultLog.filter((r) => (r.result === 'correct_intercept' || r.result === 'cross_intercept') && r.cheatAssisted).length;
    const populatedThreats = resultLog.filter((r) => r.is_populated).length;
    const correctHolds = resultLog.filter((r) => r.result === 'correct_hold').length;
    const openGroundThreats = resultLog.filter((r) => !r.is_populated).length;
    const timeouts = resultLog.filter((r) => r.result === 'timeout').length;
    const wastedIntercepts = resultLog.filter((r) => r.result === 'wasted_intercept').length;
    const holdOnPopulated = resultLog.filter((r) => r.result === 'hold_populated').length;

    // Ammo bonus — only credit "extra" interceptors beyond what's needed for perfect play
    const ammoRemaining = Object.values(ammo).reduce((sum, v) => sum + v, 0);
    const levelConfig = getLevelConfig(currentLevel);
    const startingAmmo = Object.values(levelConfig.ammo).reduce((sum, v) => sum + v, 0);
    const levelThreatCount = (selectedThreatsRef.current || []).length;
    const extraInterceptors = Math.max(0, startingAmmo - levelThreatCount);
    const creditableAmmo = Math.min(ammoRemaining, extraInterceptors);

    // F3: Combo bonuses from rapid double-intercepts
    const comboBonus = resultLog.reduce((sum, r) => sum + (r.comboBonus || 0), 0);

    const score = Math.max(0,
      quizBonus                          // briefing intel bonus
      + (regularIntercepts * 100)        // +100 per manual intercept
      + (cheatIntercepts * 75)           // +75 per cheat-assisted intercept (25% penalty)
      + comboBonus                       // +50 per double-intercept combo
      + (creditableAmmo * 250)           // efficiency bonus: only surplus interceptors count
      + (bestStreak * 25)
      - (sirenCount * 100)
    );

    // Perfect level: all populated threats intercepted, no wasted interceptors
    const isPerfect = sirenCount === 0 && wastedIntercepts === 0 && wrongInterceptAttempts === 0;

    let rating;
    if (isPerfect) rating = { label: 'PERFECT DEFENSE', stars: 5, perfect: true };
    else if (sirenCount === 0) rating = { label: 'IRON WALL', stars: 5 };
    else if (sirenCount === 1) rating = { label: 'STEEL DOME', stars: 4 };
    else if (sirenCount <= 2) rating = { label: 'SOLID DEFENSE', stars: 3 };
    else if (sirenCount <= 4) rating = { label: 'BATTERED BUT STANDING', stars: 2 };
    else rating = { label: 'BREACH', stars: 1 };

    return {
      level: currentLevel,
      totalThreats,
      correctIntercepts,
      regularIntercepts,
      cheatIntercepts,
      populatedThreats,
      correctHolds,
      openGroundThreats,
      wrongIntercepts: wrongInterceptAttempts,
      timeouts: timeouts + holdOnPopulated,
      wastedIntercepts,
      ammoRemaining: ammo,
      creditableAmmo,
      sirenCount,
      bestStreak,
      quizBonus,
      rating,
      score,
      isPerfect,
    };
  }, [resultLog, ammo, sirenCount, wrongInterceptAttempts, bestStreak, currentLevel, quizBonus]);

  // Running score — same formula as getLevelStats, usable during gameplay
  const getRunningScore = useCallback(() => {
    const regularIntercepts = resultLog.filter((r) => (r.result === 'correct_intercept' || r.result === 'cross_intercept') && !r.cheatAssisted).length;
    const cheatIntercepts = resultLog.filter((r) => (r.result === 'correct_intercept' || r.result === 'cross_intercept') && r.cheatAssisted).length;

    const ammoRemaining = Object.values(ammoRef.current).reduce((sum, v) => sum + v, 0);
    const levelConfig = getLevelConfig(currentLevelRef.current);
    const startingAmmo = Object.values(levelConfig.ammo).reduce((sum, v) => sum + v, 0);
    const levelThreatCount = (selectedThreatsRef.current || []).length;
    const extraInterceptors = Math.max(0, startingAmmo - levelThreatCount);
    const creditableAmmo = Math.min(ammoRemaining, extraInterceptors);

    const comboBonus = resultLog.reduce((sum, r) => sum + (r.comboBonus || 0), 0);

    return Math.max(0,
      quizBonus
      + (regularIntercepts * 100)
      + (cheatIntercepts * 75)
      + comboBonus
      + (creditableAmmo * 250)
      + (bestStreak * 25)
      - (sirenCount * 100)
    );
  }, [resultLog, sirenCount, wrongInterceptAttempts, bestStreak, quizBonus]);

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
      effectiveTotalLevels: effectiveTotalLevelsRef.current,
      endedEarly: campaign.endedEarly || false,
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
    c.quizPoints = (c.quizPoints || 0) + (stats.quizBonus || 0);
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
      endedEarly: false,
    };
    setCurrentLevel(1);
    setGameState(GAME_STATES.SCORING_INTRO);
    setSessionTime(0);
    setAmmo({ ...getLevelConfig(1).ammo });
    setActiveThreats([]);
    setSelectedThreatId(null);
    setResultLog([]);
    setFeedbackMessage(null);
    setEscapeRoomTime(escapeRoomStartTime);
    setTzevaAdomActive(false);
    setQuizBonus(0);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setBouncingThreats([]);
    setScreenShake(false);
    setTzurActive(false);
    setSashaActive(false);
    setDvirActive(false);
    dvirActiveRef.current = false;
    setSufrinActive(false);
    setPaused(false);
    setComboMessage(null);
    spawnedIdsRef.current = new Set();
    interceptedIdsRef.current.clear();
    lastInterceptTimeRef.current = 0;
    // Reset campaign-wide cheat uses
    cheatUsesRef.current = { tzur: CHEAT_MAX_USES, sasha: CHEAT_MAX_USES, dvir: CHEAT_MAX_USES, sufrin: CHEAT_MAX_USES };
    setCheatUses({ ...cheatUsesRef.current });
    hhUsedRef.current = false;
    rlUsedRef.current = false;
    if (tzurIntervalRef.current) { clearInterval(tzurIntervalRef.current); tzurIntervalRef.current = null; }
    if (sashaIntervalRef.current) { clearInterval(sashaIntervalRef.current); sashaIntervalRef.current = null; }
    if (sufrinIntervalRef.current) { clearInterval(sufrinIntervalRef.current); sufrinIntervalRef.current = null; }
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
    setQuizBonus(0);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setBouncingThreats([]);
    setScreenShake(false);
    setTzurActive(false);
    setSashaActive(false);
    setDvirActive(false);
    setSufrinActive(false);
    dvirActiveRef.current = false;
    setPaused(false);
    spawnedIdsRef.current = new Set();
    interceptedIdsRef.current.clear();
    // Note: cheat uses (tzur/sasha/dvir/sufrin) are campaign-wide — NOT reset per level
    hhUsedRef.current = false;
    rlUsedRef.current = false;
    if (tzurIntervalRef.current) { clearInterval(tzurIntervalRef.current); tzurIntervalRef.current = null; }
    if (sashaIntervalRef.current) { clearInterval(sashaIntervalRef.current); sashaIntervalRef.current = null; }
    if (sufrinIntervalRef.current) { clearInterval(sufrinIntervalRef.current); sufrinIntervalRef.current = null; }
    allSpawnedRef.current = false;
    lastTickRef.current = null;
    if (tzevaAdomTimerRef.current) clearTimeout(tzevaAdomTimerRef.current);

    if (autoEndTimerRef.current) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }

    // Pick a random threat variant for this level (stable until next level start)
    selectedThreatsRef.current = pickThreatVariant(level);

    setGameState(GAME_STATES.ACTIVE);
  }, []);

  // Advance to next level (called from LEVEL_COMPLETE screen)
  const advanceLevel = useCallback(() => {
    saveLevelToCampaign();
    const nextLevel = currentLevelRef.current + 1;
    if (nextLevel > effectiveTotalLevelsRef.current) {
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

  // End campaign early (called when escape room timer hits 0)
  const endCampaignEarly = useCallback(() => {
    stopSiren();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (tzevaAdomTimerRef.current) clearTimeout(tzevaAdomTimerRef.current);
    if (autoEndTimerRef.current) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }
    if (tzurIntervalRef.current) { clearInterval(tzurIntervalRef.current); tzurIntervalRef.current = null; }
    if (sashaIntervalRef.current) { clearInterval(sashaIntervalRef.current); sashaIntervalRef.current = null; }

    // Save current level stats if mid-gameplay or at level complete
    const state = gameStateRef.current;
    if (state === GAME_STATES.ACTIVE || state === GAME_STATES.LEVEL_COMPLETE) {
      saveLevelToCampaign();
    }

    campaignStatsRef.current.endedEarly = true;
    // Update ref synchronously to prevent double-firing from rapid timer ticks
    gameStateRef.current = GAME_STATES.SUMMARY;
    setGameState(GAME_STATES.SUMMARY);
  }, [stopSiren, saveLevelToCampaign]);

  // Add time to escape room countdown (facilitator control)
  const addEscapeTime = useCallback((seconds) => {
    setEscapeRoomTime((prev) => prev + seconds);
  }, []);

  const dismissScoringIntro = useCallback(() => {
    if (gameStateRef.current !== GAME_STATES.SCORING_INTRO) return;
    setGameState(GAME_STATES.BRIEFING);
  }, []);

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
      endedEarly: false,
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
    setQuizBonus(0);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setBouncingThreats([]);
    setScreenShake(false);
    setTzurActive(false);
    setSashaActive(false);
    setDvirActive(false);
    setSufrinActive(false);
    dvirActiveRef.current = false;
    setPaused(false);
    spawnedIdsRef.current = new Set();
    interceptedIdsRef.current.clear();
    if (tzurIntervalRef.current) { clearInterval(tzurIntervalRef.current); tzurIntervalRef.current = null; }
    if (sashaIntervalRef.current) { clearInterval(sashaIntervalRef.current); sashaIntervalRef.current = null; }
    if (sufrinIntervalRef.current) { clearInterval(sufrinIntervalRef.current); sufrinIntervalRef.current = null; }
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
    setQuizBonus(0);
    setSirenCount(0);
    setWrongInterceptAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setFinalSalvoWarning(false);
    setImpactFlashes([]);
    setActiveTrails([]);
    setBouncingThreats([]);
    setScreenShake(false);
    setTzurActive(false);
    setSashaActive(false);
    setDvirActive(false);
    setSufrinActive(false);
    dvirActiveRef.current = false;
    setPaused(false);
    spawnedIdsRef.current = new Set();
    interceptedIdsRef.current.clear();
    // Reset campaign-wide cheat uses on full game reset
    cheatUsesRef.current = { tzur: CHEAT_MAX_USES, sasha: CHEAT_MAX_USES, dvir: CHEAT_MAX_USES, sufrin: CHEAT_MAX_USES };
    setCheatUses({ ...cheatUsesRef.current });
    hhUsedRef.current = false;
    rlUsedRef.current = false;
    if (tzurIntervalRef.current) { clearInterval(tzurIntervalRef.current); tzurIntervalRef.current = null; }
    if (sashaIntervalRef.current) { clearInterval(sashaIntervalRef.current); sashaIntervalRef.current = null; }
    if (sufrinIntervalRef.current) { clearInterval(sufrinIntervalRef.current); sufrinIntervalRef.current = null; }
    allSpawnedRef.current = false;
    lastTickRef.current = null;
  }, [stopSiren, escapeRoomStartTime]);

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  // Escape room timer — ticks during ALL states except PRE_GAME and SUMMARY (only when escape room mode is ON)
  useEffect(() => {
    const shouldTick =
      escapeRoomMode &&
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
  }, [gameState, paused, escapeRoomMode]);

  // Auto-end campaign when escape room timer hits 0
  const endCampaignEarlyRef = useRef(endCampaignEarly);
  useEffect(() => { endCampaignEarlyRef.current = endCampaignEarly; }, [endCampaignEarly]);

  useEffect(() => {
    if (!escapeRoomMode) return;
    if (escapeRoomTime > 0) return;
    const state = gameStateRef.current;
    if (state === GAME_STATES.PRE_GAME || state === GAME_STATES.SUMMARY) return;
    endCampaignEarlyRef.current();
  }, [escapeRoomTime, escapeRoomMode]);

  // Add quiz points as level bonus (flows into level score automatically)
  const addQuizPoints = useCallback((points) => {
    setQuizBonus(points);
  }, []);

  return {
    gameState,
    currentLevel,
    sessionTime,
    ammo,
    activeThreats,
    selectedThreatId,
    tzevaAdomActive,
    tzevaAdomCity,
    paused,
    volume,
    resultLog,
    feedbackMessage,
    escapeRoomTime,
    escapeRoomStartTime,
    escapeRoomMode,
    sirenCount,
    streak,
    bestStreak,
    finalSalvoWarning,
    impactFlashes,
    activeTrails,
    screenShake,
    tzurActive,
    triggerTzurMode,
    sashaActive,
    triggerSashaMode,
    dvirActive,
    triggerDvirMode,
    sufrinActive,
    triggerSufrinMode,
    bouncingThreats,
    triggerHHMode,
    triggerRLMode,
    cheatUses,
    comboMessage,
    startCampaign,
    startLevel,
    advanceLevel,
    finishCampaign,
    resetGame,
    togglePause,
    dismissScoringIntro,
    skipBriefing,
    jumpToLevel,
    handleAction,
    setSelectedThreatId,
    setVolume,
    setEscapeRoomStartTime,
    setEscapeRoomMode,
    addEscapeTime,
    getLevelStats,
    getRunningScore,
    getCampaignStats,
    addQuizPoints,
    GAME_STATES,
  };
}
