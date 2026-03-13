import { useState, useEffect, useCallback, useRef } from 'react';
import useGameEngine from './hooks/useGameEngine.js';
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
import { getLevelConfig, LEVEL_ACCENT_COLORS } from './config/threats.js';
import { getLeaderboard } from './utils/leaderboard.js';
import {
  startMusic,
  stopMusic,
  pauseMusic,
  resumeMusic,
  setMusicVolume,
  toggleMusicEnabled,
  isMusicEnabled,
} from './utils/musicPlayer.js';

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [bonusLevelEnabled, setBonusLevelEnabled] = useState(false);
  const game = useGameEngine({ bonusLevelEnabled });
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
  const [facilitatorUnlocked, setFacilitatorUnlocked] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const openLeaderboard = useCallback(() => {
    setShowLeaderboard(true);
    getLeaderboard('CAMPAIGN').then(setLeaderboardEntries);
  }, []);
  const [campaignTeamName, setCampaignTeamName] = useState('');
  const [skipBriefings, setSkipBriefings] = useState(false);
  const seenBriefingsRef = useRef(new Set());
  const briefingMusicRef = useRef(null);
  const [musicMuted, setMusicMuted] = useState(false);
  const cheatBufferRef = useRef([]);
  const [cheatHints, setCheatHints] = useState(0);    // letters matched so far
  const [cheatMaxHints, setCheatMaxHints] = useState(4); // total letters in active code
  const [gameMusicOn, setGameMusicOn] = useState(true);
  const [hackOverlayVisible, setHackOverlayVisible] = useState(false);
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

  // Auto-skip briefing if facilitator toggle is on, or if this level's briefing was already seen
  useEffect(() => {
    if (gameState === GAME_STATES.BRIEFING && (skipBriefings || seenBriefingsRef.current.has(currentLevel))) {
      skipBriefing();
    }
  }, [gameState, currentLevel, skipBriefing, skipBriefings, GAME_STATES]);

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
      // Opens → auto-pause, Closes → auto-resume
      if (e.key === 'Escape') {
        const wasOpen = showFacilitatorRef.current;
        if (!wasOpen && gameState === GAME_STATES.ACTIVE && !paused) {
          // Opening panel — pause the game
          togglePause();
        } else if (wasOpen && gameState === GAME_STATES.ACTIVE && paused) {
          // Closing panel — resume the game
          togglePause();
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
        }
        return;
      }

      // 5 or Space for Hold Fire
      if (e.key === '5' || e.key === ' ') {
        e.preventDefault();
        handleAction('hold_fire');
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
    // Resume game if we auto-paused it
    if (paused && gameState === GAME_STATES.ACTIVE) togglePause();
  }, [paused, gameState, togglePause, GAME_STATES]);

  // Stable callback for EducationalBriefing — avoids re-creating on every render
  // which would cascade through useCallback deps and reset quiz answer colors
  const handleBriefingComplete = useCallback(({ quizPoints: pts }) => {
    seenBriefingsRef.current.add(currentLevel);
    if (pts > 0) addQuizPoints(pts);
    skipBriefing();
  }, [currentLevel, addQuizPoints, skipBriefing]);

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

          <button
            onClick={() => {
              seenBriefingsRef.current.clear();
              startCampaign();
            }}
            className="px-12 py-3.5 font-mono font-bold text-base tracking-[0.2em] rounded-lg
              cursor-pointer transition-all active:scale-95
              hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
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

          <div className="mt-3 text-[11px] font-mono text-gray-600 tracking-wider">
            EDUCATIONAL SIMULATION
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-4 left-5 z-10">
          <div className="text-[10px] font-mono tracking-[0.2em] px-2 py-0.5 rounded"
            style={{ color: '#f9731640', border: '1px solid #f9731625' }}>
            EDUCATIONAL SIMULATION
          </div>
        </div>
        <div className="absolute bottom-4 right-5 z-10 text-[10px] font-mono tracking-wider text-gray-700">
          v2.0
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
            />
          </div>
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
            paused={paused}
          />
        </div>

        {/* ZONE C: Ammo stack — desktop only, right of radar */}
        <div className="hidden lg:flex lg:flex-col lg:self-stretch order-3 lg:w-[230px] lg:flex-shrink-0 lg:border-l border-white/[0.03]">
          <AmmoStack
            ammo={ammo}
            onAction={handleAction}
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
          onAction={handleAction}
          selectedThreatId={selectedThreatId}
          feedbackMessage={feedbackMessage}
          streak={streak}
          availableSystems={config?.available_systems}
        />
      </div>

      {/* HUD hint — Pause & Explore — removed, now in AmmoStack */}

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
