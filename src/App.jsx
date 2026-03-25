import { useState, useEffect, useCallback, useRef } from 'react';
import useGameEngine from './hooks/useGameEngine.js';
import useTournament, { TOURNAMENT_PHASES } from './hooks/useTournament.js';
import RadarDisplay from './components/RadarDisplay.jsx';
import ThreatPanel from './components/ThreatPanel.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import AmmoStack from './components/AmmoStack.jsx';
import TzevaAdom from './components/TzevaAdom.jsx';
import Summary, { LeaderboardTable } from './components/Summary.jsx';
import EducationalBriefing from './components/EducationalBriefing.jsx';
import EscapeRoomTimer from './components/EscapeRoomTimer.jsx';
import LevelIntro from './components/LevelIntro.jsx';
import LevelComplete from './components/LevelComplete.jsx';
import ScoringIntro from './components/ScoringIntro.jsx';
import FacilitatorControls from './components/FacilitatorControls.jsx';
import SpectatorBoard from './components/SpectatorBoard.jsx';
import AdminBoard from './components/AdminBoard.jsx';
import { getLevelConfig, LEVEL_ACCENT_COLORS } from './config/threats.js';
import { ROUND_CONFIGS } from './hooks/useGameEngine.js';
import { getLeaderboard, getEventCode, getRoundNumber, getSpectateCode, getAdminCode, getGameCode, getTournamentEventCode, updateLiveScore, markScoreFinished } from './utils/leaderboard.js';
import { containsProfanity } from './utils/nameFilter.js';
import {
  startMusic,
  stopMusic,
  pauseMusic,
  resumeMusic,
  setMusicVolume,
  toggleMusicEnabled,
  isMusicEnabled,
} from './utils/musicPlayer.js';

// ── Access Gate ──────────────────────────────────────────────
// Set to a string to require password, null to disable.
// Change this value and redeploy to rotate/remove the password.
const GATE_PASSWORD = null;

function AccessGate({ onUnlock }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  // Skip gate if already authenticated this session
  useEffect(() => {
    if (sessionStorage.getItem('gate_auth') === 'true') onUnlock();
  }, [onUnlock]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim().toUpperCase() === GATE_PASSWORD.toUpperCase()) {
      sessionStorage.setItem('gate_auth', 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="text-center">
        <div className="font-mono text-2xl font-black tracking-[0.3em] text-green-400/60 mb-8">
          IRON DOME COMMAND
        </div>
        <div className="font-mono text-sm text-gray-500 tracking-widest mb-6">
          ENTER ACCESS CODE
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          autoFocus
          className={`w-56 px-4 py-3 bg-gray-900/80 border rounded-lg text-center
            font-mono text-lg tracking-[0.3em] focus:outline-none
            ${error
              ? 'border-red-500 text-red-400 animate-pulse'
              : 'border-gray-700 text-green-400 focus:border-green-500'
            }`}
          placeholder="••••••••"
        />
        <div className={`font-mono text-xs mt-3 h-4 tracking-wider ${error ? 'text-red-400' : 'text-transparent'}`}>
          ACCESS DENIED
        </div>
      </form>
    </div>
  );
}

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Curated emoji icons for team avatars
const TEAM_EMOJIS = ['🦅','🐻','🦁','🐺','🦊','🐍','🦈','🦇','🐝','🦂','🐆','🦬','🦏','🐗','🦎','🦉','🎯','🛡️','⚔️','🔥'];

function EmojiPicker({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 max-w-[280px] mx-auto">
      {TEAM_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(selected === emoji ? '' : emoji)}
          className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer
            ${selected === emoji
              ? 'bg-green-900/60 border-2 border-green-400 scale-110'
              : 'bg-gray-800/60 border border-gray-700 hover:border-gray-500 hover:bg-gray-700/60'
            }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function AppInner({ tournamentConfig = null, isPracticeMode = false }) {
  const [bonusLevelEnabled, setBonusLevelEnabled] = useState(false);
  // Legacy V1 tournament mode (URL-based)
  const roundNumber = getRoundNumber();
  const legacyRoundConfig = roundNumber ? ROUND_CONFIGS[roundNumber] : null;
  // Use tournament V2 config if provided, else legacy, else null
  const roundConfig = tournamentConfig?.roundConfig || legacyRoundConfig || null;
  const spectateCode = getSpectateCode();
  const game = useGameEngine({ bonusLevelEnabled, roundConfig });
  // TEMP DEBUG: expose game to console for visual testing
  window.__game = game;
  const [victoryVariant, setVictoryVariant] = useState(null);
  const [victoryKey, setVictoryKey] = useState(0);
  const [pendingLevelComplete, setPendingLevelComplete] = useState(false);
  // Test hook: window.__testVictory(1), (2), or (3) to preview animations
  window.__testVictory = (v) => {
    if (!game.paused) game.togglePause();           // pause so level doesn't end
    setVictoryVariant(null);
    setTimeout(() => { setVictoryKey(k => k + 1); setVictoryVariant(v || 1); }, 50);
  };
  // Fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const [showFacilitator, setShowFacilitator] = useState(false);
  const showFacilitatorRef = useRef(false);
  useEffect(() => { showFacilitatorRef.current = showFacilitator; }, [showFacilitator]);
  const pausedByFacilitatorRef = useRef(false);
  const [facilitatorUnlocked, setFacilitatorUnlocked] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const openLeaderboard = useCallback(() => {
    setShowLeaderboard(true);
    getLeaderboard('CAMPAIGN').then(setLeaderboardEntries);
  }, []);
  const [campaignTeamName, setCampaignTeamName] = useState(tournamentConfig?.teamName || '');
  const [teamEmoji, setTeamEmoji] = useState(tournamentConfig?.teamEmoji || '');
  const [skipBriefings, setSkipBriefings] = useState(false);
  const seenBriefingsRef = useRef(new Set());
  const briefingMusicRef = useRef(null);
  const [musicMuted, setMusicMuted] = useState(false);
  const cheatBufferRef = useRef([]);
  const [cheatHints, setCheatHints] = useState(0);    // letters matched so far
  const [cheatMaxHints, setCheatMaxHints] = useState(4); // total letters in active code
  const [gameMusicOn, setGameMusicOn] = useState(true);
  const [hackOverlayVisible, setHackOverlayVisible] = useState(false);

  // Tutorial overlay — guides new players through first few threats
  // L1 steps: 'ready' → 'select' → 'holdfire' → 'pause' → 'done'
  // L3-L5 steps: 'new_weapon' → 'done' (introduces new system/key)
  const [tutorialStep, setTutorialStep] = useState(null);
  const tutorialStepRef = useRef(null);
  useEffect(() => { tutorialStepRef.current = tutorialStep; }, [tutorialStep]);
  // Track which levels have shown their new-weapon tutorial (don't repeat on replay)
  const shownWeaponTutorialRef = useRef(new Set());
  // Pause-to-explore reminder — brief overlay during respites, once per level
  const [showPauseReminder, setShowPauseReminder] = useState(false);
  const pauseReminderShownRef = useRef(new Set());
  const hackTimerRef = useRef(null);

  const showHackOverlay = useCallback(() => {
    setHackOverlayVisible(true);
    if (hackTimerRef.current) clearTimeout(hackTimerRef.current);
    hackTimerRef.current = setTimeout(() => setHackOverlayVisible(false), 5000);
  }, []);

  const {
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
    feedbackMessage,
    escapeRoomTime,
    escapeRoomStartTime,
    escapeRoomMode,
    streak,
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
    sirenCount,
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
  } = game;

  const config = getLevelConfig(currentLevel);

  // Victory animation — trigger on zero-siren level completion
  const prevGameStateRef = useRef(null);
  useEffect(() => {
    if (prevGameStateRef.current === GAME_STATES.ACTIVE &&
        (gameState === GAME_STATES.LEVEL_COMPLETE || gameState === GAME_STATES.SUMMARY) &&
        sirenCount === 0) {
      // Zero sirens — play victory animation before showing results
      const variant = ((currentLevel - 1) % 3) + 1; // cycle 1,2,3 per level
      setPendingLevelComplete(true);
      setVictoryKey(k => k + 1);
      setVictoryVariant(variant);
    }
    // Clean up if game state changes to something unexpected (e.g., reset/jump)
    if (gameState !== GAME_STATES.LEVEL_COMPLETE && gameState !== GAME_STATES.SUMMARY) {
      setPendingLevelComplete(false);
      setVictoryVariant(null);
    }
    prevGameStateRef.current = gameState;
  }, [gameState, sirenCount, currentLevel, GAME_STATES]);

  // When victory animation completes, show the level complete screen
  const handleVictoryComplete = useCallback(() => {
    setVictoryVariant(null);
    setPendingLevelComplete(false);
  }, []);

  // Safety: if victory animation gets stuck, force-dismiss after 8 seconds
  useEffect(() => {
    if (!pendingLevelComplete) return;
    const safety = setTimeout(() => {
      setPendingLevelComplete(false);
      setVictoryVariant(null);
    }, 8000);
    return () => clearTimeout(safety);
  }, [pendingLevelComplete]);

  // Briefing music — create once, play/pause based on game state
  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/briefing-music.mp3`);
    audio.loop = true;
    audio.volume = 0;
    briefingMusicRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  useEffect(() => {
    const audio = briefingMusicRef.current;
    if (!audio) return;
    const inBriefing = gameState === GAME_STATES.BRIEFING && !musicMuted;
    const sashaMusicActive = sashaActive && gameState === GAME_STATES.ACTIVE;
    const shouldPlay = inBriefing || sashaMusicActive;
    if (shouldPlay) {
      audio.volume = volume * 0.4;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      if (gameState !== GAME_STATES.BRIEFING) audio.currentTime = 0;
    }
  }, [gameState, GAME_STATES, musicMuted, sashaActive]);

  useEffect(() => {
    if (briefingMusicRef.current && !musicMuted) briefingMusicRef.current.volume = volume * 0.4;
  }, [volume, musicMuted]);

  // Game music — plays during ACTIVE gameplay, pauses/stops on other screens
  // Also yields to cheat-code music (e.g. Sasha mode plays briefing music)
  const cheatMusicActive = sashaActive; // add other cheat modes here if they get music
  useEffect(() => {
    if (!gameMusicOn) { stopMusic(); return; }
    if (gameState === GAME_STATES.ACTIVE && !paused) {
      if (cheatMusicActive) {
        // Cheat code has its own music — fade out background music
        stopMusic();
      } else {
        startMusic(currentLevel, volume * 0.3);
      }
    } else if (gameState === GAME_STATES.ACTIVE && paused) {
      pauseMusic();
    } else {
      stopMusic();
    }
  }, [gameState, GAME_STATES, currentLevel, paused, gameMusicOn, cheatMusicActive]);

  // Sync game music volume with global volume slider
  useEffect(() => {
    if (gameMusicOn) setMusicVolume(volume * 0.3);
  }, [volume, gameMusicOn]);

  // Tutorial — reset when entering ACTIVE for tutorial-enabled levels
  const prevLevelActiveRef = useRef(false);
  const prevActiveLevelRef = useRef(null);
  useEffect(() => {
    const isTutorialLevel = [1, 3, 4, 5].includes(currentLevel);
    const isActive = isTutorialLevel && gameState === GAME_STATES.ACTIVE;
    const wasActive = prevLevelActiveRef.current;
    if (isActive && (!wasActive || prevActiveLevelRef.current !== currentLevel)) {
      if (currentLevel === 1) {
        // L1: full tutorial — delay 2s
        setTimeout(() => setTutorialStep('ready'), 2000);
      } else {
        // L3-L5: reset tutorialStep so time-based trigger can fire
        // (handles case where previous level left tutorialStep as 'done')
        setTutorialStep(null);
      }
    } else if (!isActive && wasActive) {
      setTutorialStep(null);
      setShowPauseReminder(false);
    }
    // Reset tutorial tracking on new campaign (PRE_GAME)
    if (gameState === GAME_STATES.PRE_GAME) {
      shownWeaponTutorialRef.current.clear();
      pauseReminderShownRef.current.clear();
    }
    prevLevelActiveRef.current = isActive;
    prevActiveLevelRef.current = currentLevel;
  }, [currentLevel, gameState, GAME_STATES]);

  // Tutorial — time-based step progression
  useEffect(() => {
    if (gameState !== GAME_STATES.ACTIVE) return;

    // L1 tutorial progression
    if (currentLevel === 1 && tutorialStep && tutorialStep !== 'done') {
      // T1 spawns at t=8 (solo on-target, countdown 6s, clears by t=14)
      // T2 spawns at t=16 (solo hold-fire, countdown 7s, clears by t=23)
      // T3 spawns at t=24 (normal gameplay resumes)
      if (tutorialStep === 'ready' && sessionTime >= 8) {
        setTutorialStep('select');
      } else if (tutorialStep === 'select' && sessionTime >= 16) {
        setTutorialStep('holdfire');
      } else if (tutorialStep === 'wait_holdfire' && sessionTime >= 16) {
        setTutorialStep('holdfire');
      } else if (tutorialStep === 'holdfire' && sessionTime >= 24) {
        setTutorialStep('pause');
      } else if (tutorialStep === 'pause' && sessionTime >= 30) {
        setTutorialStep('done');
      }
    }

    // L3-L5 new weapon tutorials — trigger AFTER blip is visually on screen
    // Blips spawn at radar edge and need time to travel inward (especially with easing):
    //   Cruise (linear): visible ~2s after appear → trigger 3s after appear
    //   Ballistic (cubic easing): barely moves first 5s → trigger 5s after appear
    //   Hypersonic (quartic easing): barely moves first 4s → trigger 4s after appear
    // Tutorial dismisses on player action (interceptor key press), with 20s safety timeout
    const weaponTutorials = {
      3: { triggerTime: 27, key: '2', system: "DAVID'S SLING", threat: 'CRUISE MISSILE', threatType: 'cruise', color: '#3b82f6' },       // appear t=24 + 3s
      4: { triggerTime: 26, key: '3', system: 'ARROW 2', threat: 'BALLISTIC MISSILE', threatType: 'ballistic', color: '#ef4444' },           // appear t=21 + 5s
      5: { triggerTime: 28, key: '4', system: 'ARROW 3', threat: 'HYPERSONIC GLIDE VEHICLE', threatType: 'hypersonic', color: '#a855f7' },    // appear t=24 + 4s
    };
    const wt = weaponTutorials[currentLevel];
    if (wt && !shownWeaponTutorialRef.current.has(currentLevel) && !tutorialStep) {
      if (sessionTime >= wt.triggerTime) {
        shownWeaponTutorialRef.current.add(currentLevel);
        setTutorialStep('new_weapon');
        // Safety timeout — tutorial normally dismissed by player action (interceptor key press)
        setTimeout(() => {
          if (tutorialStepRef.current === 'new_weapon') setTutorialStep('done');
        }, 20000);
      }
    }
    // Auto-dismiss new weapon tutorial when the teaching threat is no longer on screen
    // (e.g., it hit the target, landed on open ground, or was intercepted with a different system)
    if (wt && tutorialStep === 'new_weapon') {
      const hasMatchingThreat = activeThreats.some(t => t.type === wt.threatType && !t.intercepted && !t.held);
      if (!hasMatchingThreat) setTutorialStep('done');
    }

    // Pause-to-explore reminder — brief overlay during designed respite gaps
    // Shows once per level during a quiet moment to remind players about P key
    const PAUSE_REMINDER_TIMES = { 2: 42, 3: 67, 4: 35, 5: 47, 6: 57 };
    const prTime = PAUSE_REMINDER_TIMES[currentLevel];
    if (prTime && !pauseReminderShownRef.current.has(currentLevel) && !tutorialStep && !showPauseReminder) {
      if (sessionTime >= prTime) {
        pauseReminderShownRef.current.add(currentLevel);
        setShowPauseReminder(true);
        setTimeout(() => setShowPauseReminder(false), 4000);
      }
    }
  }, [currentLevel, gameState, sessionTime, tutorialStep, showPauseReminder, activeThreats, GAME_STATES]);

  // ── Live score push interval (tournament mode only) ──
  // Pushes running score to Firestore every 5 seconds so spectator board updates live.
  // Uses refs to avoid stale closures — getRunningScore depends on resultLog/sirenCount/etc.
  // which change frequently during gameplay but aren't in the effect's dependency array.
  const liveScoreFinalizedRef = useRef(false);
  const getRunningScoreRef = useRef(getRunningScore);
  const getCampaignStatsRef = useRef(getCampaignStats);
  getRunningScoreRef.current = getRunningScore;
  getCampaignStatsRef.current = getCampaignStats;
  // Ref for tournament config to avoid unstable object reference in effect deps
  const tournamentConfigRef = useRef(tournamentConfig);
  tournamentConfigRef.current = tournamentConfig;

  useEffect(() => {
    if (!roundConfig || !campaignTeamName.trim()) return;
    if (gameState === GAME_STATES.PRE_GAME) return;

    // Tournament V2 event code takes priority over URL-based V1
    const tc = tournamentConfigRef.current;
    const eventCode = tc?.currentRoundEventCode || getTournamentEventCode();
    const cumulBase = tc?.cumulativeBase || 0;
    const multiplier = tc?.roundMultiplier || 1;
    const pushInterval = tc ? 10000 : 5000; // 10s for V2, 5s for V1

    // Auto-finalize when reaching SUMMARY (once)
    if (gameState === GAME_STATES.SUMMARY && !liveScoreFinalizedRef.current) {
      liveScoreFinalizedRef.current = true;
      const stats = getCampaignStatsRef.current();
      const rawScore = stats.totalScore || 0;
      const adjustedScore = Math.round(rawScore * multiplier);
      const totalScore = cumulBase + adjustedScore;
      const displayName = teamEmoji ? `${teamEmoji} ${campaignTeamName.trim()}` : campaignTeamName.trim();
      markScoreFinished({
        name: displayName,
        score: totalScore,
        event: eventCode,
        stats,
      }).catch(() => {});
      // Notify tournament hook of round completion
      if (tournamentConfigRef.current?.onRoundFinished) {
        tournamentConfigRef.current.onRoundFinished(rawScore);
      }
      return;
    }

    // During gameplay: push live score at interval
    const pushScore = () => {
      const stats = getCampaignStatsRef.current();
      const currentRunning = getRunningScoreRef.current();
      const rawScore = (stats.totalScore || 0) + currentRunning;
      const adjustedScore = Math.round(rawScore * multiplier);
      const totalScore = cumulBase + adjustedScore;
      const displayName = teamEmoji ? `${teamEmoji} ${campaignTeamName.trim()}` : campaignTeamName.trim();
      updateLiveScore({
        name: displayName,
        score: totalScore,
        event: eventCode,
        currentLevel,
        status: 'playing',
      }).catch(() => {});
    };

    pushScore(); // Push immediately on state change
    const interval = setInterval(pushScore, pushInterval);
    return () => clearInterval(interval);
  }, [roundConfig, campaignTeamName, teamEmoji, gameState, currentLevel, GAME_STATES]);

  // Wrap handleAction to advance tutorial on mobile taps (not just keyboard)
  const handleActionWithTutorial = useCallback((action) => {
    handleAction(action);
    if (tutorialStepRef.current === 'select' && action !== 'hold_fire') {
      setTutorialStep('wait_holdfire');
    } else if (tutorialStepRef.current === 'holdfire' && action === 'hold_fire') {
      setTutorialStep('pause');
    } else if (tutorialStepRef.current === 'new_weapon') {
      // Dismiss new weapon tutorial on any intercept action
      const weaponActions = { 3: 'davids_sling', 4: 'arrow_2', 5: 'arrow_3' };
      if (action === weaponActions[currentLevel]) {
        setTutorialStep('done');
      }
    }
  }, [handleAction, currentLevel]);

  // Auto-skip briefing if facilitator toggle is on, or if this level's briefing was already seen
  useEffect(() => {
    if (gameState === GAME_STATES.BRIEFING && (skipBriefings || seenBriefingsRef.current.has(currentLevel))) {
      // Skip directly to gameplay (bypass LevelIntro)
      seenBriefingsRef.current.add(currentLevel);
      startLevel(currentLevel);
    }
  }, [gameState, currentLevel, startLevel, skipBriefings, GAME_STATES]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // === Cheat code detection (multi-code: tzur, sasha, dvir, hack, etc.) ===
      const anyCheatActive = tzurActive || sashaActive || dvirActive || sufrinActive;
      const CHEAT_CODES = [
        { keys: ['t', 'z', 'u', 'r'], trigger: triggerTzurMode, blocked: anyCheatActive || cheatUses.tzur <= 0 },
        { keys: ['b', 'e', 'a', 'r'], trigger: triggerTzurMode, blocked: anyCheatActive || cheatUses.tzur <= 0 },
        { keys: ['s', 'a', 's', 'h', 'a'], trigger: triggerSashaMode, blocked: anyCheatActive || cheatUses.sasha <= 0 },
        { keys: ['c', 'a', 't'], trigger: triggerSashaMode, blocked: anyCheatActive || cheatUses.sasha <= 0 },
        { keys: ['s', 'u', 'f', 'r', 'i', 'n'], trigger: triggerSufrinMode, blocked: anyCheatActive || cheatUses.sufrin <= 0 },
        { keys: ['d', 'v', 'i', 'r'], trigger: triggerDvirMode, blocked: anyCheatActive || cheatUses.dvir <= 0 },
        { keys: ['t', 'u', 'r', 't', 'l', 'e'], trigger: triggerDvirMode, blocked: anyCheatActive || cheatUses.dvir <= 0 },
        { keys: ['h', 'a', 'c', 'k'], trigger: showHackOverlay, blocked: false, hackOnly: true },
        { keys: ['b', 'h'], trigger: triggerHHMode, blocked: false },
        { keys: ['b', 's', 'd'], trigger: triggerRLMode, blocked: false },
        // 'p' pause handled separately below (single key, not cheat buffer)
      ];
      // "hack" works on more screens (level start, level end, active); combat cheats only during ACTIVE
      const hackScreens = [GAME_STATES.ACTIVE, GAME_STATES.LEVEL_INTRO, GAME_STATES.LEVEL_COMPLETE];
      if (hackScreens.includes(gameState)) {
        const buf = cheatBufferRef.current;
        const key = e.key.toLowerCase();
        buf.push(key);

        // On non-ACTIVE screens, only hack command is available
        const availableCodes = gameState === GAME_STATES.ACTIVE
          ? CHEAT_CODES
          : CHEAT_CODES.filter(c => c.hackOnly);

        // Check if buffer matches any code completely
        const complete = availableCodes.find((c) => !c.blocked && c.keys.length === buf.length && c.keys.every((k, i) => k === buf[i]));
        if (complete) {
          cheatBufferRef.current = [];
          setCheatHints(0);
          setCheatMaxHints(4);
          complete.trigger();
          return;
        }

        // Check if buffer is a prefix of any code
        const prefixMatch = availableCodes.find((c) => !c.blocked && buf.length < c.keys.length && c.keys.slice(0, buf.length).every((k, i) => k === buf[i]));
        if (prefixMatch) {
          setCheatHints(buf.length);
          setCheatMaxHints(prefixMatch.keys.length);
        } else {
          // No prefix match — check if single key starts any code
          const restart = availableCodes.find((c) => !c.blocked && c.keys[0] === key);
          if (restart) {
            cheatBufferRef.current = [key];
            setCheatHints(1);
            setCheatMaxHints(restart.keys.length);
          } else {
            cheatBufferRef.current = [];
            setCheatHints(0);
          }
        }
      }

      // P: toggle pause (single key, during ACTIVE gameplay only)
      if ((e.key === 'p' || e.key === 'P') && gameState === GAME_STATES.ACTIVE) {
        // Don't trigger if cheat buffer has content beyond just 'p'
        if (cheatBufferRef.current.length <= 1) {
          cheatBufferRef.current = [];
          setCheatHints(0);
          togglePause();
          // Advance tutorial past 'pause' step
          if (tutorialStepRef.current === 'pause') setTutorialStep('done');
          return;
        }
      }

      // F: toggle fullscreen (available from any game state)
      if (e.key === 'f' || e.key === 'F') {
        // Don't trigger if typing in an input or cheat buffer has content
        if (cheatBufferRef.current.length === 0 || !hackScreens.includes(gameState)) {
          toggleFullscreen();
          return;
        }
      }

      // ESC: toggle facilitator panel (available from any game state)
      // Opens → auto-pause, Closes → only auto-resume if panel caused the pause
      if (e.key === 'Escape') {
        const wasOpen = showFacilitatorRef.current;
        if (!wasOpen && gameState === GAME_STATES.ACTIVE && !paused) {
          // Opening panel — pause the game
          togglePause();
          pausedByFacilitatorRef.current = true;
        } else if (wasOpen && gameState === GAME_STATES.ACTIVE && paused && pausedByFacilitatorRef.current) {
          // Closing panel — resume only if we caused the pause
          togglePause();
          pausedByFacilitatorRef.current = false;
        }
        setShowFacilitator((prev) => !prev);
        return;
      }

      // Keyboard shortcuts only during ACTIVE, not paused
      if (gameState !== GAME_STATES.ACTIVE || paused) return;

      // Number keys 1-4 for interceptors — filtered by available systems
      const allInterceptorKeys = {
        '1': 'iron_dome',
        '2': 'davids_sling',
        '3': 'arrow_2',
        '4': 'arrow_3',
      };

      if (allInterceptorKeys[e.key]) {
        const action = allInterceptorKeys[e.key];
        // Only allow if this system is available in the current level
        if (config?.available_systems?.includes(action)) {
          e.preventDefault();
          handleAction(action);
          // Advance tutorial past 'select' step on first intercept
          if (tutorialStepRef.current === 'select') setTutorialStep('wait_holdfire');
          // Dismiss new weapon tutorial when correct key pressed
          if (tutorialStepRef.current === 'new_weapon') {
            const weaponKeys = { 3: '2', 4: '3', 5: '4' };
            if (e.key === weaponKeys[currentLevel]) setTutorialStep('done');
          }
        }
        return;
      }

      // 5 or Space for Hold Fire
      if (e.key === '5' || e.key === ' ') {
        e.preventDefault();
        handleAction('hold_fire');
        // Advance tutorial past 'holdfire' step on first hold-fire
        if (tutorialStepRef.current === 'holdfire') setTutorialStep('pause');
        return;
      }

      // Tab / Shift+Tab to cycle through threats
      if (e.key === 'Tab') {
        e.preventDefault();
        if (activeThreats.length === 0) return;

        const sortedThreats = [...activeThreats].filter((t) => !t.intercepted && !t.held).sort((a, b) => a.timeLeft - b.timeLeft);
        const currentIndex = sortedThreats.findIndex((t) => t.id === selectedThreatId);

        let nextIndex;
        if (e.shiftKey) {
          nextIndex = currentIndex <= 0 ? sortedThreats.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex >= sortedThreats.length - 1 ? 0 : currentIndex + 1;
        }

        setSelectedThreatId(sortedThreats[nextIndex].id);
        return;
      }

      // Ctrl+R quick reset (prevent browser reload)
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, paused, togglePause, toggleFullscreen, handleAction, activeThreats, selectedThreatId, setSelectedThreatId, GAME_STATES, config, currentLevel, tzurActive, triggerTzurMode, sashaActive, triggerSashaMode, dvirActive, triggerDvirMode, sufrinActive, triggerSufrinMode, triggerHHMode, triggerRLMode, cheatUses, showHackOverlay]);

  const handleCloseFacilitator = useCallback(() => {
    setShowFacilitator(false);
    // Resume game only if the facilitator panel caused the pause
    if (paused && gameState === GAME_STATES.ACTIVE && pausedByFacilitatorRef.current) {
      togglePause();
      pausedByFacilitatorRef.current = false;
    }
  }, [paused, gameState, togglePause, GAME_STATES]);

  // Stable callback for EducationalBriefing — avoids re-creating on every render
  // which would cascade through useCallback deps and reset quiz answer colors
  const handleBriefingComplete = useCallback(({ quizPoints: pts }) => {
    seenBriefingsRef.current.add(currentLevel);
    if (pts > 0) addQuizPoints(pts);
    // Skip LevelIntro — go straight to gameplay after quiz
    startLevel(currentLevel);
  }, [currentLevel, addQuizPoints, startLevel]);

  const handlePause = useCallback(() => {
    if (!paused) togglePause();
  }, [paused, togglePause]);

  const handleResume = useCallback(() => {
    if (paused) togglePause();
    setShowFacilitator(false);
  }, [paused, togglePause]);

  // Facilitator overlay — reusable across all screens
  const facilitatorOverlay = showFacilitator && (
    <FacilitatorControls
      onClose={handleCloseFacilitator}
      onPause={handlePause}
      onResume={handleResume}
      onReset={() => {
        seenBriefingsRef.current.clear();
        liveScoreFinalizedRef.current = false;
        setCampaignTeamName('');
        setTeamEmoji('');
        pausedByFacilitatorRef.current = false;
        resetGame();
      }}
      onJumpToLevel={(level) => {
        seenBriefingsRef.current.clear();
        jumpToLevel(level);
      }}
      paused={paused}
      volume={volume}
      onVolumeChange={setVolume}
      currentLevel={currentLevel}
      isPreGame={gameState === GAME_STATES.PRE_GAME}
      unlocked={facilitatorUnlocked}
      onUnlock={() => setFacilitatorUnlocked(true)}
      escapeRoomStartTime={escapeRoomStartTime}
      onSetEscapeTime={setEscapeRoomStartTime}
      escapeRoomMode={escapeRoomMode}
      onToggleEscapeRoomMode={() => setEscapeRoomMode((prev) => !prev)}
      onAddTime={addEscapeTime}
      skipBriefings={skipBriefings}
      onToggleSkipBriefings={() => setSkipBriefings((prev) => !prev)}
      bonusLevelEnabled={bonusLevelEnabled}
      onToggleBonusLevel={() => setBonusLevelEnabled((prev) => !prev)}
    />
  );

  // Hack HUD overlay — reusable across gameplay, level intro, level complete
  const hackOverlay = hackOverlayVisible && (
    <div className="absolute inset-0 z-35 flex items-center justify-end pr-6 pointer-events-none hack-overlay-appear">
      <div className="bg-black/85 border border-green-500/60 rounded-lg px-8 py-6 font-mono max-w-sm w-full shadow-[0_0_40px_rgba(0,255,136,0.15)]">
        <div className="text-center mb-4">
          <div className="text-green-400 text-xs tracking-[0.5em] mb-1">★ ★ ★</div>
          <div className="text-green-300 text-lg font-bold tracking-widest">AVAILABLE HACKS</div>
          <div className="h-px bg-green-500/30 mt-3" />
        </div>
        {[
          { label: 'TEDDY PROTOCOL', key: 'tzur', icon: '🐻', code: 'TZUR' },
          { label: 'LASER CAT', key: 'sasha', icon: '🐱', code: 'SASHA' },
          { label: 'TURTLE SHELL', key: 'dvir', icon: '🐢', code: 'DVIR' },
          { label: 'BEARD DEFENSE', key: 'sufrin', icon: '🧔', code: 'SUFRIN' },
        ].map(({ label, key, icon, code }) => {
          const remaining = cheatUses[key];
          const exhausted = remaining <= 0;
          return (
            <div key={key} className={`flex items-center justify-between py-2 px-2 rounded ${exhausted ? 'opacity-30' : ''}`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs tracking-wider ${exhausted ? 'text-gray-600 line-through' : 'text-green-400'}`}>
                  {label}
                </span>
                <span className={`text-[10px] ${exhausted ? 'text-gray-700' : 'text-gray-500'}`}>
                  [{code}]
                </span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }, (_, i) => (
                  <span key={i} className={`text-lg transition-all ${i < remaining ? '' : 'opacity-15 grayscale'}`}>
                    {i < remaining ? icon : '·'}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        <div className="h-px bg-green-500/30 mt-3 mb-3" />
        <div className="text-center text-[10px] text-gray-500 tracking-widest">
          TYPE CODE TO ACTIVATE
        </div>
      </div>
    </div>
  );

  // ========================
  // PRE-GAME SCREEN
  // ========================
  if (gameState === GAME_STATES.PRE_GAME) {
    const basePath = import.meta.env.BASE_URL || '/missile-defense/';
    return (
      <div key="screen-pre-game" className="screen-fade-in h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-hidden">
        {/* Full-bleed hero background */}
        <div className="absolute inset-0" style={{ background: `url('${basePath}images/ID3.jpg') center 40% / cover no-repeat` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,14,26,0.5) 0%, rgba(10,14,26,0.35) 30%, rgba(10,14,26,0.35) 50%, rgba(10,14,26,0.6) 70%, rgba(10,14,26,0.92) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,14,26,0.5) 100%)' }} />

        {/* Top-right controls */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
          <button
            onClick={toggleFullscreen}
            className="hidden lg:block text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-lg"
            title="Fullscreen (F)"
          >
            {isFullscreen ? '⊡' : '⛶'}
          </button>
          <button
            onClick={openLeaderboard}
            className="text-gray-500 hover:text-yellow-400 transition-colors cursor-pointer text-2xl"
            title="Leaderboard"
          >
            &#127942;
          </button>
          <button
            onClick={() => setShowFacilitator(true)}
            className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-2xl"
            title="Settings"
          >
            &#9881;
          </button>
        </div>

        <div className="text-center relative z-10" style={{ marginTop: '40px' }}>
          {/* Accent line */}
          <div className="w-[60px] h-[2px] mx-auto mb-4" style={{ background: '#f97316', boxShadow: '0 0 12px rgba(249,115,22,0.4)' }} />

          <h1 className="text-3xl md:text-4xl font-black font-mono tracking-[0.2em] text-orange-500 leading-tight mb-1.5"
            style={{ textShadow: '0 0 40px rgba(249,115,22,0.3)' }}>
            IRON DOME{'\n'}COMMAND
          </h1>
          <div className="text-2xl md:text-3xl font-bold tracking-[0.1em] mb-8"
            style={{ fontFamily: 'Arial, sans-serif', color: '#f97316cc', textShadow: '0 0 30px rgba(249,115,22,0.2)' }}>
            פיקוד כיפת ברזל
          </div>

          {/* System badges */}
          <div className="flex justify-center gap-5 mb-10">
            {[
              { name: 'IRON DOME', color: '#eab308' },
              { name: "DAVID'S SLING", color: '#3b82f6' },
              { name: 'ARROW 2', color: '#ef4444' },
              { name: 'ARROW 3', color: '#a855f7' },
            ].map(sys => (
              <div key={sys.name} className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sys.color, boxShadow: `0 0 8px ${sys.color}` }} />
                <span className="text-[9px] font-mono tracking-[0.15em] text-gray-500">{sys.name}</span>
              </div>
            ))}
          </div>

          {/* Tournament mode: team name + emoji entry before start */}
          {roundConfig && (
            <div className="mb-6">
              <div className="font-mono text-xs tracking-[0.3em] text-orange-400/70 mb-4">
                {roundConfig.label} — {getEventCode()}
              </div>
              <div className="mb-3">
                <div className="font-mono text-[10px] text-gray-500 tracking-widest mb-2">CHOOSE YOUR ICON</div>
                <EmojiPicker selected={teamEmoji} onSelect={setTeamEmoji} />
              </div>
              <div className="mb-2">
                <div className="font-mono text-[10px] text-gray-500 tracking-widest mb-2">TEAM NAME</div>
                <input
                  type="text"
                  value={campaignTeamName}
                  onChange={(e) => setCampaignTeamName(e.target.value.toUpperCase().slice(0, 10))}
                  placeholder="ENTER NAME"
                  maxLength={10}
                  className="w-48 px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-center
                    font-mono text-lg text-orange-400 tracking-widest
                    focus:border-orange-500 focus:outline-none placeholder-gray-700"
                />
                {campaignTeamName && containsProfanity(campaignTeamName) && (
                  <div className="font-mono text-xs text-red-400 mt-1">CHOOSE A DIFFERENT NAME</div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              seenBriefingsRef.current.clear();
              startCampaign();
              // Tournament mode: push initial score to spectator board immediately
              if (roundConfig && campaignTeamName.trim()) {
                const displayName = teamEmoji ? `${teamEmoji} ${campaignTeamName.trim()}` : campaignTeamName.trim();
                updateLiveScore({
                  name: displayName,
                  score: 0,
                  event: getTournamentEventCode(),
                  currentLevel: roundConfig.startLevel,
                  status: 'playing',
                }).catch(() => {});
              }
            }}
            disabled={roundConfig && (!campaignTeamName.trim() || campaignTeamName.trim().length < 2 || containsProfanity(campaignTeamName))}
            className={`px-12 py-3.5 font-mono font-bold text-base tracking-[0.2em] rounded-lg
              transition-all active:scale-95
              ${roundConfig && (!campaignTeamName.trim() || campaignTeamName.trim().length < 2 || containsProfanity(campaignTeamName))
                ? 'opacity-30 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]'
              }`}
            style={{
              background: 'rgba(249,115,22,0.15)',
              border: '2px solid #f97316',
              color: '#f97316',
              textShadow: '0 0 20px rgba(249,115,22,0.3)',
              boxShadow: '0 0 30px rgba(249,115,22,0.1), inset 0 0 30px rgba(249,115,22,0.05)',
            }}
          >
            BEGIN MISSION ▸
          </button>

          <div className="mt-6 text-[11px] font-mono tracking-[0.15em] text-gray-500"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            © Hecht Studio 2026
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-4 right-5 z-10 text-[9px] font-mono tracking-wider text-gray-700">
          Built with Claude
        </div>

        {/* Leaderboard modal */}
        {showLeaderboard && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="max-w-lg w-full mx-4">
              <LeaderboardTable
                entries={leaderboardEntries}
                gameMode="CAMPAIGN"
              />
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="px-6 py-2 border border-gray-700 text-gray-400
                    font-mono text-xs tracking-widest rounded
                    hover:border-gray-500 hover:text-gray-300 transition-all
                    active:scale-95 cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

        {facilitatorOverlay}
      </div>
    );
  }

  // ========================
  // SCORING INTRO SCREEN (shown once before Level 1 briefing)
  // ========================
  if (gameState === GAME_STATES.SCORING_INTRO) {
    return (
      <div key="screen-scoring-intro" className="screen-fade-in relative">
        <ScoringIntro onContinue={dismissScoringIntro} />
        {facilitatorOverlay}
      </div>
    );
  }

  // ========================
  // BRIEFING SCREEN (Level 1 — Educational Briefing)
  // ========================
  if (gameState === GAME_STATES.BRIEFING) {
    // Auto-skip on replay is handled by the useEffect above
    return (
      <div key={`screen-briefing-${currentLevel}`} className="screen-fade-in relative">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <button
            onClick={() => setMusicMuted((m) => !m)}
            className={`px-3 py-1.5 rounded-full font-mono text-xs tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
              musicMuted
                ? 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                : 'border-green-700 bg-green-900/30 text-green-400 hover:border-green-500 hover:text-green-300'
            }`}
            title={musicMuted ? 'Unmute music' : 'Mute music'}
          >
            <span className="text-base leading-none">{musicMuted ? '\u266A' : '\u266A'}</span>
            {musicMuted ? 'OFF' : 'ON'}
          </button>
          {escapeRoomMode && <EscapeRoomTimer escapeRoomTime={escapeRoomTime} />}
        </div>
        <EducationalBriefing
          key={`briefing-${currentLevel}`}
          level={currentLevel}
          onComplete={handleBriefingComplete}
        />
        {facilitatorOverlay}
      </div>
    );
  }

  // ========================
  // LEVEL INTRO (Levels 2+)
  // ========================
  if (gameState === GAME_STATES.LEVEL_INTRO) {
    return (
      <div key={`screen-level-intro-${currentLevel}`} className="screen-fade-in relative">
        <div className="absolute top-4 right-4 z-10">
          {escapeRoomMode && <EscapeRoomTimer escapeRoomTime={escapeRoomTime} />}
        </div>
        <LevelIntro
          level={currentLevel}
          onReady={() => startLevel(currentLevel)}
        />
        {hackOverlay}
        {facilitatorOverlay}
      </div>
    );
  }

  // ========================
  // LEVEL COMPLETE (with optional victory animation)
  // ========================
  if (gameState === GAME_STATES.LEVEL_COMPLETE) {
    // If zero sirens, show victory animation on radar before level complete screen
    if (pendingLevelComplete) {
      return (
        <div key={`screen-victory-${currentLevel}`} className="relative h-[100dvh] flex items-center justify-center bg-[#0a0e1a]">
          <div className="w-full h-full max-w-[600px] max-h-[600px] aspect-square">
            <RadarDisplay
              activeThreats={[]}
              selectedThreatId={null}
              onSelectThreat={() => {}}
              currentLevel={currentLevel}
              victoryVariant={victoryVariant}
              victoryKey={victoryKey}
              onVictoryComplete={handleVictoryComplete}
              musicMuted={musicMuted}
            />
          </div>
        </div>
      );
    }
    return (
      <div key={`screen-level-complete-${currentLevel}`} className="screen-fade-in relative">
        <div className="absolute top-4 right-4 z-10">
          {escapeRoomMode && <EscapeRoomTimer escapeRoomTime={escapeRoomTime} />}
        </div>
        <LevelComplete
          levelStats={getLevelStats()}
          campaignStats={getCampaignStats()}
          effectiveTotalLevels={bonusLevelEnabled ? 7 : 6}
          onNextLevel={advanceLevel}
          onViewResults={finishCampaign}
          teamName={campaignTeamName}
          onTeamNameChange={setCampaignTeamName}
        />
        {hackOverlay}
        {facilitatorOverlay}
      </div>
    );
  }

  // ========================
  // SUMMARY SCREEN (after all levels, with optional victory animation)
  // ========================
  if (gameState === GAME_STATES.SUMMARY) {
    if (pendingLevelComplete) {
      return (
        <div key={`screen-victory-summary`} className="relative h-[100dvh] flex items-center justify-center bg-[#0a0e1a]">
          <div className="w-full h-full max-w-[600px] max-h-[600px] aspect-square">
            <RadarDisplay
              activeThreats={[]}
              selectedThreatId={null}
              onSelectThreat={() => {}}
              currentLevel={currentLevel}
              victoryVariant={victoryVariant}
              victoryKey={victoryKey}
              onVictoryComplete={handleVictoryComplete}
              musicMuted={musicMuted}
            />
          </div>
        </div>
      );
    }
    // Tournament mode — simplified round complete screen
    if (roundConfig) {
      const stats = getCampaignStats();
      const displayName = teamEmoji ? `${teamEmoji} ${campaignTeamName.trim()}` : campaignTeamName.trim();
      return (
        <div key="screen-tournament-summary" className="screen-fade-in h-screen bg-[#0a0e1a] flex items-center justify-center relative">
          <div className="text-center max-w-lg mx-auto px-6">
            <div className="font-mono text-xs tracking-[0.4em] text-green-500/60 mb-2">
              {roundConfig.label}
            </div>
            <div className="font-mono text-3xl font-black tracking-[0.2em] text-green-400 mb-2"
              style={{ textShadow: '0 0 30px rgba(34,197,94,0.3)' }}>
              ROUND COMPLETE
            </div>
            <div className="h-px w-32 mx-auto bg-green-500/30 mb-6" />

            {/* Score display */}
            <div className="mb-6">
              <div className="font-mono text-6xl font-black text-green-400 tabular-nums mb-1"
                style={{ textShadow: '0 0 40px rgba(34,197,94,0.3)' }}>
                {stats.totalScore?.toLocaleString() || 0}
              </div>
              <div className="font-mono text-sm text-gray-500 tracking-widest">TOTAL SCORE</div>
            </div>

            {/* Team name (read-only — entered at start) */}
            <div className="mb-6">
              <div className="font-mono text-xl font-bold text-green-400 tracking-wider">
                {displayName || 'TEAM'}
              </div>
            </div>

            {/* Score submitted confirmation */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <span className="text-green-400 text-lg">✓</span>
              <span className="font-mono text-sm text-green-400/80 tracking-widest">SCORE SUBMITTED</span>
            </div>

            {/* Watch the screen message */}
            <div className="py-4 px-6 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="font-mono text-sm text-gray-400 tracking-wider animate-pulse" style={{ animationDuration: '2s' }}>
                WATCH THE MAIN SCREEN FOR RESULTS
              </div>
            </div>
          </div>
          {facilitatorOverlay}
        </div>
      );
    }

    return (
      <div key="screen-summary" className="screen-fade-in">
        <Summary stats={getCampaignStats()}
          teamName={campaignTeamName}
          onTeamNameChange={setCampaignTeamName}
          onReset={() => {
          seenBriefingsRef.current.clear();
          liveScoreFinalizedRef.current = false;
          setCampaignTeamName('');
          resetGame();
        }} />
        {facilitatorOverlay}
      </div>
    );
  }

  // ========================
  // ACTIVE GAME / TZEVA ADOM
  // ========================
  return (
    <div key={`screen-active-${currentLevel}`} className={`screen-fade-in h-screen bg-[#0a0e1a] flex flex-col overflow-hidden relative ${screenShake ? 'screen-shake border-flash-red' : ''}`}>
      {/* Escape room timer — floats above top bar if active */}
      {escapeRoomMode && (
        <div className="absolute top-2 right-4 z-30">
          <EscapeRoomTimer escapeRoomTime={escapeRoomTime} />
        </div>
      )}

      {/* Top bar — level name centered prominently, score/timer on sides */}
      <div className="flex items-center justify-between px-2 md:px-4 py-2 md:py-2.5 lg:py-3 relative min-h-[44px] md:min-h-[56px] lg:min-h-[68px]"
        style={{
          background: 'rgba(8,12,22,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${LEVEL_ACCENT_COLORS[currentLevel] || '#22c55e'}40`,
          boxShadow: `0 1px 20px ${LEVEL_ACCENT_COLORS[currentLevel] || '#22c55e'}08`,
        }}>
        {/* Left: music + score + streak */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={() => {
              const nowEnabled = toggleMusicEnabled();
              setGameMusicOn(nowEnabled);
            }}
            className={`font-mono text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              gameMusicOn ? 'text-green-500 hover:text-green-300' : 'text-gray-600 hover:text-gray-400'
            }`}
            title={gameMusicOn ? 'Mute music' : 'Unmute music'}
          >
            <span className="text-sm leading-none">&#9834;</span>
            <span className="hidden sm:inline">{gameMusicOn ? 'ON' : 'OFF'}</span>
          </button>
          <span className="text-gray-700 font-mono text-xs hidden sm:inline">|</span>
          <div className="font-mono">
            <span className="text-gray-600 text-[10px] md:text-xs hidden sm:inline">SCORE </span>
            <span className="text-cyan-400 text-sm md:text-lg lg:text-xl font-bold tabular-nums">{getRunningScore()}</span>
          </div>
          {streak >= 3 && (
            <>
              <span className="text-gray-700 font-mono text-xs hidden sm:inline">|</span>
              <div className="font-mono text-sm md:text-base font-bold text-orange-400 flex items-center gap-1 streak-pulse">
                <span>🔥</span>
                <span className="tabular-nums">{streak}</span>
              </div>
            </>
          )}
        </div>

        {/* Center: level number + name (prominent) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="flex items-center gap-2 md:gap-3 justify-center">
              <span className="text-green-400 font-mono text-sm md:text-xl lg:text-2xl font-bold tracking-widest">
                L{currentLevel}
              </span>
              <span className="text-gray-600 font-mono text-sm md:text-lg hidden sm:inline">|</span>
              <span className="font-mono text-sm md:text-xl lg:text-2xl tracking-wider text-green-400 font-bold hidden sm:inline">
                {({ 1: 'SOUTHERN FRONT', 2: 'NORTHERN FRONT', 3: 'CENTRAL FRONT', 4: 'STRATEGIC TARGETS', 5: 'ARMY BASES', 6: 'WAVE ASSAULT', 7: 'APRIL 13' })[currentLevel] || ''}
              </span>
            </div>
            <span className="text-green-400/70 text-xs md:text-base lg:text-lg font-bold hidden md:inline-block tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>
              {({ 1: 'חֲזִית הַדָּרוֹם', 2: 'חֲזִית הַצָּפוֹן', 3: 'חֲזִית הַמֶּרְכָּז', 4: 'מַטָּרוֹת אִסְטְרָטֶגִיּוֹת', 5: 'בְּסִיסֵי צָבָא', 6: 'מִתְקֶפֶת גַּלִּים', 7: 'שְׁלוֹשָׁה עָשָׂר בְּאַפְּרִיל' })[currentLevel] || ''}
            </span>
          </div>
        </div>

        {/* Right: timer + fullscreen + settings */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="font-mono text-[10px] md:text-xs">
            <span className="text-green-400 text-xs md:text-sm font-bold tabular-nums">
              {formatCountdown(Math.max(0, (config?.duration || 0) - sessionTime))}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse hidden sm:block" />
          <span className="text-gray-700 font-mono text-xs hidden sm:inline">|</span>
          <button
            onClick={toggleFullscreen}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded border border-gray-700/60 text-gray-500 hover:text-green-400 hover:border-green-500/40 transition-all cursor-pointer font-mono text-xs font-bold"
            title="Fullscreen (F)"
          >
            {isFullscreen ? '⊡' : '⛶'}
          </button>
          <button
            onClick={() => {
              if (gameState === GAME_STATES.ACTIVE && !paused) togglePause();
              setShowFacilitator(true);
            }}
            className="flex items-center justify-center w-7 h-7 rounded border border-gray-700/60 text-gray-500 hover:text-green-400 hover:border-green-500/40 transition-all cursor-pointer text-base"
            title="Settings (ESC)"
          >
            &#9881;
          </button>
        </div>
        {/* Glow line accent under HUD */}
        <div className="absolute bottom-0 left-[15%] right-[15%] h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${LEVEL_ACCENT_COLORS[currentLevel] || '#22c55e'}30, transparent)` }} />
      </div>

      {/* Main content area — desktop: 3-column flex (threats | radar | ammo). Radar stretches full height; panels self-center. */}
      <div className={`flex-1 flex flex-col lg:flex-row lg:items-stretch min-h-0 overflow-hidden lg:mx-auto lg:w-full lg:gap-6 ${isFullscreen ? 'lg:max-w-none lg:px-8' : 'lg:max-w-[1200px]'}`}>
        {/* ZONE A: Threat panel — mobile: below radar (order-2); desktop: left of radar (order-1) */}
        <div className="flex-shrink-0 max-h-[240px] order-2 lg:order-1 lg:w-[260px] lg:max-h-none lg:self-stretch p-1 sm:p-2 md:p-3 lg:p-4 border-t lg:border-t-0 lg:border-r border-white/[0.03] flex flex-col overflow-hidden">
          <ThreatPanel
            activeThreats={activeThreats}
            selectedThreatId={selectedThreatId}
            onSelectThreat={setSelectedThreatId}
          />
        </div>

        {/* ZONE B: Radar — centered, fills remaining height (aspect-ratio constrains width) */}
        <div className="flex-1 min-h-0 min-w-0 order-1 lg:order-2 p-1 sm:p-2 md:p-3 flex items-center justify-center">
          <RadarDisplay
            activeThreats={activeThreats}
            selectedThreatId={selectedThreatId}
            onSelectThreat={setSelectedThreatId}
            sessionTime={sessionTime}
            impactFlashes={impactFlashes}
            activeTrails={activeTrails}
            currentLevel={currentLevel}
            tzurActive={tzurActive}
            sashaActive={sashaActive}
            dvirActive={dvirActive}
            sufrinActive={sufrinActive}
            bouncingThreats={bouncingThreats}
            victoryVariant={victoryVariant}
            victoryKey={victoryKey}
            onVictoryComplete={handleVictoryComplete}
            musicMuted={musicMuted}
            paused={paused}
          />
        </div>

        {/* ZONE C: Ammo stack — desktop only, right of radar */}
        <div className="hidden lg:flex lg:flex-col lg:self-stretch order-3 lg:w-[230px] lg:flex-shrink-0 lg:border-l border-white/[0.03]">
          <AmmoStack
            ammo={ammo}
            onAction={handleActionWithTutorial}
            selectedThreatId={selectedThreatId}
            streak={streak}
            availableSystems={config?.available_systems}
          />
        </div>
      </div>

      {/* ZONE D: Controls — mobile/tablet only, hidden on desktop (replaced by AmmoStack) */}
      <div className="flex-shrink-0 px-2 md:px-4 py-2 md:py-3 border-t border-gray-800/50 bg-[#080c16] lg:hidden">
        <ControlPanel
          ammo={ammo}
          onAction={handleActionWithTutorial}
          selectedThreatId={selectedThreatId}
          feedbackMessage={feedbackMessage}
          streak={streak}
          availableSystems={config?.available_systems}
        />
      </div>

      {/* HUD hint — Pause & Explore — removed, now in AmmoStack */}

      {/* TUTORIAL OVERLAY — step-by-step coaching */}
      {tutorialStep && tutorialStep !== 'done' && (() => {
        // L3-L5 new weapon tutorial data
        const weaponTutorials = {
          3: { key: '2', system: "DAVID'S SLING", threat: 'CRUISE MISSILE', color: '#3b82f6' },
          4: { key: '3', system: 'ARROW 2', threat: 'BALLISTIC MISSILE', color: '#ef4444' },
          5: { key: '4', system: 'ARROW 3', threat: 'HYPERSONIC GLIDE VEHICLE', color: '#a855f7' },
        };
        const wt = weaponTutorials[currentLevel];
        return (
          <div key={`${tutorialStep}-${currentLevel}`} className="absolute inset-x-0 top-16 md:top-20 z-20 flex justify-center pointer-events-none tutorial-enter">
            <div className="bg-black/90 border rounded-lg px-6 py-3 text-center max-w-sm mx-4"
              style={{
                borderColor: tutorialStep === 'new_weapon' && wt ? `${wt.color}80` : 'rgba(34,197,94,0.5)',
                boxShadow: tutorialStep === 'new_weapon' && wt ? `0 0 20px ${wt.color}25` : '0 0 20px rgba(34,197,94,0.15)',
              }}>
              {tutorialStep === 'ready' && (
                <>
                  <div className="text-green-400 font-mono text-xs tracking-[0.4em] mb-1 animate-pulse">TUTORIAL</div>
                  <div className="text-green-300 font-mono text-sm md:text-base font-bold tracking-wider">
                    INCOMING THREAT APPROACHING
                  </div>
                  <div className="text-gray-400 font-mono text-xs md:text-sm mt-1 tracking-wide">
                    Click the blip on the radar to select it
                  </div>
                </>
              )}
              {tutorialStep === 'select' && (
                <>
                  <div className="text-orange-400 font-mono text-xs tracking-[0.4em] mb-1 animate-pulse">ENGAGE</div>
                  <div className="text-orange-300 font-mono text-sm md:text-base font-bold tracking-wider">
                    SELECT THE BLIP — PRESS <span className="text-yellow-300 text-lg">1</span> TO FIRE
                  </div>
                  <div className="text-gray-400 font-mono text-xs md:text-sm mt-1 tracking-wide">
                    Iron Dome intercepts rockets heading for cities
                  </div>
                </>
              )}
              {tutorialStep === 'holdfire' && (
                <>
                  <div className="text-cyan-400 font-mono text-xs tracking-[0.4em] mb-1 animate-pulse">HOLD FIRE</div>
                  <div className="text-cyan-300 font-mono text-sm md:text-base font-bold tracking-wider">
                    THIS ROCKET IS OFF TARGET
                  </div>
                  <div className="text-gray-400 font-mono text-xs md:text-sm mt-1 tracking-wide">
                    Select the blip and press <span className="text-white font-bold">SPACE</span> to hold fire — save your ammo
                  </div>
                </>
              )}
              {tutorialStep === 'pause' && (
                <>
                  <div className="text-purple-400 font-mono text-xs tracking-[0.4em] mb-1 animate-pulse">EXPLORE</div>
                  <div className="text-purple-300 font-mono text-sm md:text-base font-bold tracking-wider">
                    PRESS <span className="text-white text-lg">P</span> TO PAUSE
                  </div>
                  <div className="text-gray-400 font-mono text-xs md:text-sm mt-1 tracking-wide">
                    Hover over locations on the map to learn about the region
                  </div>
                </>
              )}
              {tutorialStep === 'new_weapon' && wt && (
                <>
                  <div className="font-mono text-xs tracking-[0.4em] mb-1 animate-pulse" style={{ color: wt.color }}>NEW SYSTEM ONLINE</div>
                  <div className="font-mono text-sm md:text-base font-bold tracking-wider" style={{ color: wt.color }}>
                    {wt.threat} DETECTED
                  </div>
                  <div className="text-gray-300 font-mono text-xs md:text-sm mt-2 tracking-wide">
                    Select the blip — press <span className="font-bold text-lg" style={{ color: wt.color }}>{wt.key}</span> to fire <span className="font-bold" style={{ color: wt.color }}>{wt.system}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* PAUSE-TO-EXPLORE REMINDER — brief overlay during respite, once per level */}
      {showPauseReminder && !tutorialStep && (
        <div className="absolute inset-x-0 top-16 md:top-20 z-20 flex justify-center pointer-events-none tutorial-enter">
          <div className="bg-black/85 border rounded-lg px-6 py-3 text-center max-w-xs mx-4"
            style={{
              borderColor: 'rgba(6,182,212,0.5)',
              boxShadow: '0 0 20px rgba(6,182,212,0.15)',
            }}>
            <div className="text-cyan-400 font-mono text-xs tracking-[0.4em] mb-1">TIP</div>
            <div className="text-cyan-300 font-mono text-sm md:text-base font-bold tracking-wider">
              PRESS <span className="text-white text-lg">P</span> TO PAUSE & EXPLORE
            </div>
            <div className="text-gray-400 font-mono text-xs mt-1 tracking-wide">
              Hover locations on the map to learn about the region
            </div>
          </div>
        </div>
      )}

      {/* SALVO WARNING overlay — level-based intensity */}
      {finalSalvoWarning && (
        <div className="absolute inset-x-0 top-12 z-20 flex justify-center pointer-events-none">
          <div className="bg-red-950/90 border-2 border-red-600 rounded-lg px-8 py-4 text-center final-salvo-warning">
            <div className="text-red-400 font-mono text-xs tracking-[0.4em] mb-1">
              ⚠ WARNING
            </div>
            <div className="text-red-300 font-mono text-2xl font-bold tracking-wider">
              SALVO INCOMING
            </div>
            <div className="font-mono text-xs mt-1 tracking-widest animate-pulse text-amber-500">
              PREPARE DEFENSE SYSTEMS
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MESSAGE overlay — centered below top bar, visible near radar */}
      {feedbackMessage && (
        <div className="absolute inset-x-0 bottom-16 lg:bottom-auto lg:top-20 z-15 flex justify-center pointer-events-none">
          <div className={`rounded-lg px-5 py-2 text-center font-mono text-sm md:text-base font-bold tracking-wider feedback-flash ${
            feedbackMessage.type === 'success'
              ? 'bg-green-950/90 border border-green-500/50 text-green-400'
              : feedbackMessage.type === 'warning'
              ? 'bg-yellow-950/90 border border-yellow-500/50 text-yellow-400'
              : feedbackMessage.type === 'error'
              ? 'bg-red-950/90 border border-red-500/50 text-red-400'
              : 'bg-gray-900/90 border border-gray-500/50 text-gray-400'
          }`}>
            {feedbackMessage.text}
          </div>
        </div>
      )}

      {/* COMBO MESSAGE overlay (F3) */}
      {comboMessage && (
        <div className="absolute inset-x-0 top-24 z-20 flex justify-center pointer-events-none">
          <div className="bg-cyan-950/90 border-2 border-cyan-400 rounded-lg px-8 py-3 text-center combo-flash">
            <div className="text-cyan-300 font-mono text-xl font-bold tracking-wider">
              {comboMessage}
            </div>
          </div>
        </div>
      )}

      {/* TZUR MODE banner */}
      {tzurActive && (
        <div className="absolute inset-x-0 top-12 z-25 flex justify-center pointer-events-none tzur-banner-appear">
          <div className="bg-amber-950/90 border-2 border-yellow-500 rounded-lg px-8 py-4 text-center">
            <div className="text-yellow-300 font-mono text-2xl font-bold tracking-wider">
              TEDDY DEFENSE PROTOCOL
            </div>
            <div className="font-mono text-xs mt-1 tracking-widest text-yellow-500 animate-pulse">
              ENGAGED
            </div>
          </div>
        </div>
      )}

      {/* SASHA MODE banner */}
      {sashaActive && (
        <div className="absolute inset-x-0 top-12 z-25 flex justify-center pointer-events-none sasha-banner-appear">
          <div className="bg-cyan-950/90 border-2 border-cyan-400 rounded-lg px-8 py-4 text-center">
            <div className="text-cyan-300 font-mono text-2xl font-bold tracking-wider">
              LASER CAT PROTOCOL
            </div>
            <div className="font-mono text-xs mt-1 tracking-widest text-cyan-400 animate-pulse">
              ENGAGED
            </div>
          </div>
        </div>
      )}

      {/* DVIR MODE banner */}
      {dvirActive && (
        <div className="absolute inset-x-0 top-12 z-25 flex justify-center pointer-events-none dvir-banner-appear">
          <div className="bg-emerald-950/90 border-2 border-emerald-400 rounded-lg px-8 py-4 text-center">
            <div className="text-emerald-300 font-mono text-2xl font-bold tracking-wider">
              TURTLE DEFENSE PROTOCOL
            </div>
            <div className="font-mono text-xs mt-1 tracking-widest text-emerald-400 animate-pulse">
              SHIELDS ACTIVE
            </div>
          </div>
        </div>
      )}

      {/* SUFRIN MODE banner */}
      {sufrinActive && (
        <div className="absolute inset-x-0 top-12 z-25 flex justify-center pointer-events-none sufrin-banner-appear">
          <div className="bg-amber-950/90 border-2 border-amber-600 rounded-lg px-8 py-4 text-center">
            <div className="text-amber-300 font-mono text-2xl font-bold tracking-wider">
              BEARD DEFENSE PROTOCOL
            </div>
            <div className="font-mono text-xs mt-1 tracking-widest text-amber-400 animate-pulse">
              STRANDS DEPLOYED
            </div>
          </div>
        </div>
      )}

      {/* Cheat code hint paw prints — dynamic count based on active code */}
      {cheatHints > 0 && !tzurActive && !sashaActive && !dvirActive && !sufrinActive && (
        <div className="absolute bottom-16 left-4 z-20 flex gap-1 pointer-events-none">
          {Array.from({ length: cheatMaxHints }, (_, i) => (
            <span
              key={i}
              className={`text-lg transition-all duration-200 ${
                i < cheatHints ? 'opacity-80 scale-110' : 'opacity-15'
              }`}
            >
              🐾
            </span>
          ))}
        </div>
      )}

      {/* HACK HUD overlay — shows remaining cheat uses */}
      {hackOverlay}

      {/* PAUSE indicator — minimal banner so full game screen stays visible */}
      {paused && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center bg-black/90 border border-yellow-500/50 rounded-lg px-6 py-3">
          <div>
            <span className="font-bold font-mono text-yellow-500 tracking-[0.3em] text-lg animate-pulse">PAUSED</span>
            <span className="font-mono text-gray-500 text-xs ml-4">P or ESC to resume</span>
          </div>
          <div className="font-mono text-green-400 text-[13px] tracking-wide mt-2 font-semibold animate-pulse" style={{ animationDuration: '2s' }}>HOVER OVER LOCATIONS TO EXPLORE</div>
        </div>
      )}

      {/* TZEVA ADOM overlay — non-blocking, translucent */}
      {tzevaAdomActive && <TzevaAdom city={tzevaAdomCity} />}

      {/* Facilitator Controls */}
      {facilitatorOverlay}
    </div>
  );
}

// ── Tournament Player Screens ────────────────────────────────
// These are rendered when in tournament V2 mode (via game code entry or ?code= URL param)

function TournamentLobbyScreen({ tournament }) {
  const [nameInput, setNameInput] = useState('');
  const basePath = import.meta.env.BASE_URL || '/missile-defense/';

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: `url('${basePath}images/ID3.jpg') center 40% / cover no-repeat` }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,14,26,0.6) 0%, rgba(10,14,26,0.85) 50%, rgba(10,14,26,0.95) 100%)' }} />
      <div className="relative z-10 text-center max-w-sm mx-auto px-4">
        <div className="font-mono text-xs tracking-[0.4em] text-green-500/60 mb-2">
          {tournament.tournamentDoc?.eventCode || ''} TOURNAMENT
        </div>
        <div className="font-mono text-2xl font-black tracking-[0.2em] text-green-400 mb-6"
          style={{ textShadow: '0 0 30px rgba(34,197,94,0.2)' }}>
          JOIN THE MISSION
        </div>

        {/* Emoji picker */}
        <div className="mb-4">
          <EmojiPicker selected={tournament.teamEmoji} onSelect={tournament.setTeamEmoji} />
        </div>

        {/* Name input */}
        <input
          type="text"
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value.toUpperCase().slice(0, 10));
            tournament.setError(null);
          }}
          placeholder="ENTER TEAM NAME"
          maxLength={10}
          autoFocus
          className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg text-center
            font-mono text-lg text-orange-400 tracking-widest
            focus:border-green-500 focus:outline-none placeholder-gray-700 mb-2"
        />
        {nameInput && containsProfanity(nameInput) && (
          <div className="font-mono text-xs text-red-400 mb-2">CHOOSE A DIFFERENT NAME</div>
        )}
        {tournament.error && (
          <div className="font-mono text-xs text-red-400 mb-2">{tournament.error}</div>
        )}

        {/* Join button */}
        <button
          onClick={() => tournament.submitTeamName(nameInput, tournament.teamEmoji)}
          disabled={!nameInput.trim() || nameInput.trim().length < 2 || containsProfanity(nameInput)}
          className={`w-full py-3 mt-2 rounded-xl font-mono text-lg tracking-widest transition-all cursor-pointer
            ${!nameInput.trim() || nameInput.trim().length < 2
              ? 'bg-gray-800/50 border border-gray-700 text-gray-600'
              : 'bg-green-900/40 border-2 border-green-500/60 text-green-400 hover:bg-green-900/60'
            }`}>
          JOIN ▸
        </button>

        {/* Team count */}
        {tournament.tournamentDoc?.teams && (
          <div className="font-mono text-xs text-gray-500 tracking-wider mt-4">
            {Object.keys(tournament.tournamentDoc.teams).filter(k => !tournament.tournamentDoc.teams[k].kicked).length} teams joined
          </div>
        )}
      </div>
    </div>
  );
}

function TournamentWaitingScreen({ tournament }) {
  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        {/* Confirmed badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/40 rounded-full">
            <span className="text-green-400">✓</span>
            <span className="font-mono text-sm tracking-widest text-green-400">YOU'RE IN</span>
          </div>
        </div>

        {/* Team display */}
        <div className="mb-8">
          {tournament.teamEmoji && (
            <div className="text-4xl mb-2">{tournament.teamEmoji}</div>
          )}
          <div className="font-mono text-2xl font-bold tracking-wider text-green-400"
            style={{ textShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
            {tournament.teamName}
          </div>
        </div>

        {/* Look up message */}
        <div className="font-mono text-sm text-gray-400 tracking-wider animate-pulse"
          style={{ animationDuration: '2s' }}>
          LOOK AT THE MAIN SCREEN
        </div>

        {/* Team count */}
        <div className="font-mono text-xs text-gray-600 tracking-wider mt-6">
          {Object.keys(tournament.tournamentDoc?.teams || {}).filter(k => !tournament.tournamentDoc?.teams?.[k]?.kicked).length} teams ready
        </div>
      </div>
    </div>
  );
}

function TournamentTapReadyScreen({ tournament }) {
  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center cursor-pointer"
      onClick={tournament.tapReady}>
      <div className="text-center">
        <div className="font-mono text-xs tracking-[0.4em] text-green-500/60 mb-4">
          ROUND STARTING
        </div>
        <div className="font-mono text-3xl font-black tracking-[0.2em] text-green-400 mb-8 animate-pulse"
          style={{ textShadow: '0 0 30px rgba(34,197,94,0.3)' }}>
          TAP WHEN READY
        </div>
        <div className="font-mono text-sm text-gray-500 tracking-wider">
          TAP ANYWHERE TO BEGIN
        </div>
      </div>
    </div>
  );
}

function TournamentCountdownScreen({ tournament }) {
  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center">
        <div className="font-mono text-[120px] font-black text-green-400 tabular-nums"
          style={{
            textShadow: '0 0 60px rgba(34,197,94,0.4), 0 0 120px rgba(34,197,94,0.2)',
            animation: 'pulse 1s ease-in-out infinite',
          }}>
          {tournament.countdownValue || ''}
        </div>
        <div className="font-mono text-sm tracking-[0.4em] text-green-500/60">
          {ROUND_CONFIGS[tournament.tournamentDoc?.currentRound]?.label || 'GET READY'}
        </div>
      </div>
    </div>
  );
}

function TournamentRoundCompleteScreen({ tournament }) {
  const stats = tournament.roundLeaderboard;
  const rank = tournament.playerRank;
  const currentRound = tournament.tournamentDoc?.currentRound || 1;
  const roundLabel = ROUND_CONFIGS[currentRound]?.label || `ROUND ${currentRound}`;

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="font-mono text-xs tracking-[0.4em] text-green-500/60 mb-2">
          {roundLabel}
        </div>
        <div className="font-mono text-2xl font-black tracking-[0.2em] text-green-400 mb-6"
          style={{ textShadow: '0 0 30px rgba(34,197,94,0.2)' }}>
          ROUND COMPLETE
        </div>

        {/* Score */}
        <div className="mb-6">
          <div className="font-mono text-5xl font-black text-green-400 tabular-nums mb-1"
            style={{ textShadow: '0 0 40px rgba(34,197,94,0.3)' }}>
            {tournament.cumulativeBase.toLocaleString()}
          </div>
          <div className="font-mono text-sm text-gray-500 tracking-widest">TOTAL SCORE</div>
        </div>

        {/* Rank */}
        {rank > 0 && (
          <div className="mb-6">
            <div className="font-mono text-lg text-gray-400">
              RANK: <span className="text-green-400 font-bold">{rank}</span> of {stats.length}
            </div>
          </div>
        )}

        {/* Waiting */}
        <div className="py-4 px-6 rounded-xl bg-gray-900/50 border border-gray-800">
          <div className="font-mono text-sm text-gray-400 tracking-wider animate-pulse"
            style={{ animationDuration: '2s' }}>
            WAITING FOR RESULTS
          </div>
        </div>
      </div>
    </div>
  );
}

function TournamentAdvancingScreen({ tournament }) {
  const currentRound = tournament.tournamentDoc?.currentRound || 1;

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="font-mono text-xs tracking-[0.4em] text-green-500/60 mb-4">
          {ROUND_CONFIGS[currentRound]?.label || ''}
        </div>
        <div className="font-mono text-3xl font-black tracking-[0.2em] text-green-400 mb-4"
          style={{ textShadow: '0 0 40px rgba(34,197,94,0.4)' }}>
          YOU ADVANCE!
        </div>
        <div className="text-4xl mb-4">{tournament.teamEmoji || '🎯'}</div>
        <div className="font-mono text-xl font-bold text-green-400 tracking-wider mb-6">
          {tournament.teamName}
        </div>
        <div className="font-mono text-sm text-gray-400 tracking-wider">
          Score: <span className="text-green-400 font-bold">{tournament.cumulativeBase.toLocaleString()}</span>
        </div>
        <div className="font-mono text-xs text-gray-500 tracking-wider mt-6 animate-pulse">
          NEXT ROUND STARTING SOON
        </div>
      </div>
    </div>
  );
}

function TournamentEliminatedScreen({ tournament }) {
  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="font-mono text-2xl font-black tracking-[0.2em] text-gray-400 mb-4">
          GREAT RUN!
        </div>
        <div className="text-3xl mb-4">{tournament.teamEmoji || '🎯'}</div>
        <div className="font-mono text-lg font-bold text-gray-400 tracking-wider mb-2">
          {tournament.teamName}
        </div>
        <div className="font-mono text-sm text-gray-500 mb-6">
          Final Score: <span className="text-green-400 font-bold">{tournament.cumulativeBase.toLocaleString()}</span>
          {tournament.playerRank > 0 && <span className="text-gray-600"> • Rank {tournament.playerRank}</span>}
        </div>

        <button onClick={tournament.enterPractice}
          className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl
            font-mono text-sm tracking-widest text-gray-400
            hover:bg-gray-700/50 hover:text-gray-300 transition-all cursor-pointer">
          PRACTICE ANY LEVEL ▸
        </button>

        <div className="font-mono text-xs text-gray-600 tracking-wider mt-6">
          Watch the main screen for tournament results
        </div>
      </div>
    </div>
  );
}

function TournamentChampionScreen({ tournament }) {
  const entries = tournament.roundLeaderboard;
  const isChampion = tournament.playerRank === 1;

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="font-mono text-xs tracking-[0.4em] text-yellow-500/60 mb-4">
          TOURNAMENT COMPLETE
        </div>
        <div className="font-mono text-3xl font-black tracking-[0.2em] mb-4"
          style={{
            color: isChampion ? '#fbbf24' : '#9ca3af',
            textShadow: isChampion ? '0 0 40px rgba(251,191,36,0.4)' : 'none',
          }}>
          {isChampion ? 'CHAMPION!' : 'RUNNER-UP'}
        </div>
        <div className="text-4xl mb-2">{tournament.teamEmoji || '🏆'}</div>
        <div className="font-mono text-xl font-bold tracking-wider mb-2"
          style={{ color: isChampion ? '#fbbf24' : '#9ca3af' }}>
          {tournament.teamName}
        </div>
        <div className="font-mono text-3xl font-black text-green-400 tabular-nums mb-6"
          style={{ textShadow: '0 0 30px rgba(34,197,94,0.3)' }}>
          {tournament.cumulativeBase.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// ── Main App Router ──────────────────────────────────────────
export default function App() {
  // Check URL params for routing
  const adminCode = getAdminCode();
  const spectateCode = getSpectateCode();
  const gameCode = getGameCode();
  const legacyRound = getRoundNumber();
  const legacyEvent = getEventCode();

  // Admin dashboard — ?admin=CODE
  if (adminCode) {
    return <AdminBoard eventCode={adminCode} />;
  }

  // Spectator board — ?score=CODE
  if (spectateCode) {
    return <SpectatorBoard eventCode={spectateCode} />;
  }

  // Legacy V1 tournament — ?event=CODE&round=N (backward compat)
  if (legacyEvent && legacyRound) {
    return <AppInner />;
  }

  // Tournament V2 or solo mode
  return <TournamentRouter initialGameCode={gameCode} />;
}

// ── Tournament Router ────────────────────────────────────────
// Handles the title screen (game code + solo mission) and tournament flow
function TournamentRouter({ initialGameCode }) {
  const tournament = useTournament(initialGameCode);
  const [soloMode, setSoloMode] = useState(false);
  const [gateUnlocked, setGateUnlocked] = useState(!GATE_PASSWORD);

  // Wake lock — prevent screen dimming during tournament
  useEffect(() => {
    if (tournament.phase === TOURNAMENT_PHASES.TITLE || soloMode) return;
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        wakeLock = await navigator.wakeLock?.request('screen');
      } catch {}
    };
    requestWakeLock();
    // Re-acquire on visibility change (iOS releases on tab switch)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') requestWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      wakeLock?.release().catch(() => {});
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [tournament.phase, soloMode]);

  // If user chose solo mode, render the regular game
  if (soloMode) {
    return <AppInner />;
  }

  // Tournament phase screens
  const { phase } = tournament;

  // Title screen — game code input + solo mission
  if (phase === TOURNAMENT_PHASES.TITLE) {
    return <TitleScreen
      tournament={tournament}
      onSoloMission={() => {
        if (GATE_PASSWORD && !gateUnlocked) {
          // Show access gate for solo mode
          return;
        }
        setSoloMode(true);
      }}
      gatePassword={GATE_PASSWORD}
      gateUnlocked={gateUnlocked}
      onGateUnlock={() => {
        setGateUnlocked(true);
        setSoloMode(true);
      }}
    />;
  }

  if (phase === TOURNAMENT_PHASES.LOBBY) {
    return <TournamentLobbyScreen tournament={tournament} />;
  }

  if (phase === TOURNAMENT_PHASES.WAITING) {
    return <TournamentWaitingScreen tournament={tournament} />;
  }

  if (phase === TOURNAMENT_PHASES.TAP_READY) {
    return <TournamentTapReadyScreen tournament={tournament} />;
  }

  if (phase === TOURNAMENT_PHASES.COUNTDOWN) {
    return <TournamentCountdownScreen tournament={tournament} />;
  }

  if (phase === TOURNAMENT_PHASES.ROUND_COMPLETE) {
    return <TournamentRoundCompleteScreen tournament={tournament} />;
  }

  if (phase === TOURNAMENT_PHASES.ADVANCING) {
    return <TournamentAdvancingScreen tournament={tournament} />;
  }

  if (phase === TOURNAMENT_PHASES.ELIMINATED) {
    return <TournamentEliminatedScreen tournament={tournament} />;
  }

  if (phase === TOURNAMENT_PHASES.PRACTICE) {
    // Practice mode — render AppInner without tournament config (solo-like)
    return <AppInner isPracticeMode />;
  }

  if (phase === TOURNAMENT_PHASES.CHAMPION) {
    return <TournamentChampionScreen tournament={tournament} />;
  }

  // PLAYING phase — render the game with tournament config
  if (phase === TOURNAMENT_PHASES.PLAYING) {
    return <AppInner
      tournamentConfig={{
        roundConfig: tournament.currentRoundConfig,
        eventCode: tournament.eventCode,
        currentRound: tournament.tournamentDoc?.currentRound || 1,
        teamName: tournament.teamName,
        teamEmoji: tournament.teamEmoji,
        displayName: tournament.displayName,
        cumulativeBase: tournament.cumulativeBase,
        roundMultiplier: tournament.tournamentDoc?.roundMultipliers?.[tournament.tournamentDoc?.currentRound] || 1,
        currentRoundEventCode: tournament.currentRoundEventCode,
        onRoundFinished: tournament.onRoundFinished,
        isPaused: tournament.isPaused,
      }}
    />;
  }

  // Fallback
  return <TournamentWaitingScreen tournament={tournament} />;
}

// ── Title Screen (game code + solo mission) ──────────────────
function TitleScreen({ tournament, onSoloMission, gatePassword, gateUnlocked, onGateUnlock }) {
  const [screen, setScreen] = useState('main'); // 'main' | 'code' | 'gate'
  const [codeInput, setCodeInput] = useState('');
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);
  const basePath = import.meta.env.BASE_URL || '/missile-defense/';

  const handleSoloClick = () => {
    if (gatePassword && !gateUnlocked) {
      setScreen('gate');
    } else {
      onSoloMission();
    }
  };

  const handleGateSubmit = (e) => {
    e.preventDefault();
    if (gateInput.trim().toUpperCase() === gatePassword?.toUpperCase()) {
      onGateUnlock();
    } else {
      setGateError(true);
      setTimeout(() => setGateError(false), 1500);
    }
  };

  // Gate screen for solo mode
  if (screen === 'gate') {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
        <form onSubmit={handleGateSubmit} className="text-center">
          <div className="font-mono text-xl font-bold tracking-[0.3em] text-green-400/60 mb-6">
            ACCESS CODE
          </div>
          <input
            type="text"
            value={gateInput}
            onChange={(e) => setGateInput(e.target.value.toUpperCase())}
            autoFocus
            className={`w-48 px-4 py-3 bg-gray-900/80 border rounded-lg text-center
              font-mono text-lg tracking-[0.3em] focus:outline-none
              ${gateError ? 'border-red-500 text-red-400' : 'border-gray-700 text-green-400 focus:border-green-500'}`}
            placeholder="••••"
          />
          <div className={`font-mono text-xs mt-2 h-4 tracking-wider ${gateError ? 'text-red-400' : 'text-transparent'}`}>
            ACCESS DENIED
          </div>
          <button type="button" onClick={() => setScreen('main')}
            className="font-mono text-xs text-gray-500 tracking-wider mt-4 hover:text-gray-300 cursor-pointer">
            ← BACK
          </button>
        </form>
      </div>
    );
  }

  // Tournament code entry screen
  if (screen === 'code') {
    return (
      <div className="h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `url('${basePath}images/ID3.jpg') center 40% / cover no-repeat` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,14,26,0.7) 0%, rgba(10,14,26,0.85) 40%, rgba(10,14,26,0.95) 100%)' }} />

        <div className="relative z-10 text-center w-full max-w-sm mx-auto px-6">
          <div className="font-mono text-xs tracking-[0.4em] text-orange-400/70 mb-3">TOURNAMENT</div>
          <div className="font-mono text-2xl font-black tracking-[0.2em] text-white mb-8"
            style={{ textShadow: '0 2px 15px rgba(0,0,0,0.6)' }}>
            ENTER GAME CODE
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (codeInput.trim()) tournament.joinTournament(codeInput.trim());
          }}>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
                tournament.setError(null);
              }}
              placeholder="GAME CODE"
              maxLength={10}
              autoFocus
              className="w-full px-4 py-4 bg-gray-900/70 border-2 border-orange-500/50 rounded-xl text-center
                font-mono text-2xl text-orange-400 tracking-[0.3em]
                focus:border-orange-400 focus:outline-none placeholder-gray-700
                backdrop-blur-sm"
              style={{ boxShadow: '0 0 25px rgba(249,115,22,0.12), inset 0 0 20px rgba(0,0,0,0.3)' }}
            />
          </form>
          {tournament.error && (
            <div className="font-mono text-xs text-red-400 tracking-wider mt-2">{tournament.error}</div>
          )}
          <div className="font-mono text-[11px] text-gray-500 tracking-wider mt-3">
            Ask your instructor for the code
          </div>

          <button type="button" onClick={() => { setScreen('main'); tournament.setError(null); }}
            className="font-mono text-xs text-gray-500 tracking-wider mt-8 hover:text-gray-300 cursor-pointer">
            ← BACK
          </button>
        </div>
      </div>
    );
  }

  // Main title screen — two side-by-side options
  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0" style={{ background: `url('${basePath}images/ID3.jpg') center 40% / cover no-repeat` }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,14,26,0.5) 0%, rgba(10,14,26,0.35) 30%, rgba(10,14,26,0.35) 50%, rgba(10,14,26,0.6) 70%, rgba(10,14,26,0.92) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,14,26,0.5) 100%)' }} />

      <div className="relative z-10 text-center w-full max-w-md mx-auto px-6">
        {/* Title */}
        <div className="mb-2">
          <div className="h-px w-16 mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #f97316, transparent)' }} />
          <h1 className="font-mono text-3xl md:text-4xl font-black tracking-[0.15em] text-white"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            IRON DOME COMMAND
          </h1>
          <div className="font-mono text-lg md:text-xl text-gray-300 mt-1"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
            פיקוד כיפת ברזל
          </div>
        </div>

        {/* System badges */}
        <div className="flex justify-center gap-5 mt-4 mb-10">
          {[
            { name: 'IRON DOME', color: '#eab308' },
            { name: "DAVID'S SLING", color: '#3b82f6' },
            { name: 'ARROW 2', color: '#ef4444' },
            { name: 'ARROW 3', color: '#a855f7' },
          ].map(s => (
            <div key={s.name} className="text-center">
              <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: s.color }} />
              <div className="font-mono text-[9px] tracking-widest text-gray-400">{s.name}</div>
            </div>
          ))}
        </div>

        {/* Two side-by-side buttons */}
        <div className="flex gap-4">
          {/* Tournament */}
          <button onClick={() => setScreen('code')}
            className="flex-1 py-4 bg-orange-950/40 border-2 border-orange-500/50 rounded-xl
              font-mono tracking-widest text-orange-400
              hover:bg-orange-950/60 hover:border-orange-400/70
              transition-all cursor-pointer backdrop-blur-sm"
            style={{ boxShadow: '0 0 20px rgba(249,115,22,0.08)' }}>
            <div className="text-base font-bold">TOURNAMENT</div>
            <div className="text-[10px] text-orange-400/60 mt-0.5">MULTIPLAYER</div>
          </button>

          {/* Solo Mission */}
          <button onClick={handleSoloClick}
            className="flex-1 py-4 bg-cyan-950/30 border-2 border-cyan-500/40 rounded-xl
              font-mono tracking-widest text-cyan-400
              hover:bg-cyan-950/50 hover:border-cyan-400/60
              transition-all cursor-pointer backdrop-blur-sm"
            style={{ boxShadow: '0 0 20px rgba(6,182,212,0.06)' }}>
            <div className="text-base font-bold">SOLO MISSION</div>
            <div className="text-[10px] text-cyan-400/50 mt-0.5">SINGLE PLAYER</div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10">
          <div className="font-mono text-[10px] text-gray-500">© Hecht Studio 2026</div>
        </div>
      </div>
    </div>
  );
}
