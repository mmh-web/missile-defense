import { useState, useEffect, useCallback, useRef } from 'react';
import useGameEngine from './hooks/useGameEngine.js';
import RadarDisplay from './components/RadarDisplay.jsx';
import ThreatPanel from './components/ThreatPanel.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import TzevaAdom from './components/TzevaAdom.jsx';
import Summary, { LeaderboardTable } from './components/Summary.jsx';
import EducationalBriefing from './components/EducationalBriefing.jsx';
import EscapeRoomTimer from './components/EscapeRoomTimer.jsx';
import LevelIntro from './components/LevelIntro.jsx';
import LevelComplete from './components/LevelComplete.jsx';
import FacilitatorControls from './components/FacilitatorControls.jsx';
import { getLevelConfig } from './config/threats.js';
import { getLeaderboard } from './utils/leaderboard.js';

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const game = useGameEngine();
  const [showFacilitator, setShowFacilitator] = useState(false);
  const showFacilitatorRef = useRef(false);
  useEffect(() => { showFacilitatorRef.current = showFacilitator; }, [showFacilitator]);
  const [facilitatorUnlocked, setFacilitatorUnlocked] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [skipBriefings, setSkipBriefings] = useState(false);
  const seenBriefingsRef = useRef(new Set());
  const briefingMusicRef = useRef(null);
  const [musicMuted, setMusicMuted] = useState(false);
  const cheatBufferRef = useRef([]);
  const [cheatHints, setCheatHints] = useState(0);    // letters matched so far
  const [cheatMaxHints, setCheatMaxHints] = useState(4); // total letters in active code

  const {
    gameState,
    currentLevel,
    sessionTime,
    ammo,
    activeThreats,
    selectedThreatId,
    tzevaAdomActive,
    paused,
    volume,
    feedbackMessage,
    escapeRoomTime,
    escapeRoomStartTime,
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
    bouncingThreats,
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
  } = game;

  const config = getLevelConfig(currentLevel);

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
    const shouldPlay = gameState === GAME_STATES.BRIEFING && !musicMuted;
    if (shouldPlay) {
      audio.volume = volume * 0.4;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      if (gameState !== GAME_STATES.BRIEFING) audio.currentTime = 0;
    }
  }, [gameState, GAME_STATES, musicMuted]);

  useEffect(() => {
    if (briefingMusicRef.current && !musicMuted) briefingMusicRef.current.volume = volume * 0.4;
  }, [volume, musicMuted]);

  // Auto-skip briefing if facilitator toggle is on, or if this level's briefing was already seen
  useEffect(() => {
    if (gameState === GAME_STATES.BRIEFING && (skipBriefings || seenBriefingsRef.current.has(currentLevel))) {
      skipBriefing();
    }
  }, [gameState, currentLevel, skipBriefing, skipBriefings, GAME_STATES]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // === Cheat code detection (multi-code: tzur, sasha, dvir) ===
      const CHEAT_CODES = [
        { keys: ['t', 'z', 'u', 'r'], trigger: triggerTzurMode, blocked: tzurActive },
        { keys: ['s', 'a', 's', 'h', 'a'], trigger: triggerSashaMode, blocked: sashaActive },
        { keys: ['d', 'v', 'i', 'r'], trigger: triggerDvirMode, blocked: dvirActive },
      ];
      if (gameState === GAME_STATES.ACTIVE && !tzurActive && !sashaActive && !dvirActive) {
        const buf = cheatBufferRef.current;
        const key = e.key.toLowerCase();
        buf.push(key);

        // Check if buffer matches any code completely
        const complete = CHEAT_CODES.find((c) => !c.blocked && c.keys.length === buf.length && c.keys.every((k, i) => k === buf[i]));
        if (complete) {
          cheatBufferRef.current = [];
          setCheatHints(0);
          setCheatMaxHints(4);
          complete.trigger();
          return;
        }

        // Check if buffer is a prefix of any code
        const prefixMatch = CHEAT_CODES.find((c) => !c.blocked && buf.length < c.keys.length && c.keys.slice(0, buf.length).every((k, i) => k === buf[i]));
        if (prefixMatch) {
          setCheatHints(buf.length);
          setCheatMaxHints(prefixMatch.keys.length);
        } else {
          // No prefix match — check if single key starts any code
          const restart = CHEAT_CODES.find((c) => !c.blocked && c.keys[0] === key);
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
  }, [gameState, paused, togglePause, handleAction, activeThreats, selectedThreatId, setSelectedThreatId, GAME_STATES, config, currentLevel, tzurActive, triggerTzurMode, sashaActive, triggerSashaMode, dvirActive, triggerDvirMode]);

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
      skipBriefings={skipBriefings}
      onToggleSkipBriefings={() => setSkipBriefings((prev) => !prev)}
    />
  );

  // ========================
  // PRE-GAME SCREEN
  // ========================
  if (gameState === GAME_STATES.PRE_GAME) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center relative">
        {/* Top-right controls */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="text-gray-600 hover:text-yellow-400 transition-colors cursor-pointer text-2xl"
            title="Leaderboard"
          >
            &#127942;
          </button>
          <button
            onClick={() => setShowFacilitator(true)}
            className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer text-2xl"
            title="Settings"
          >
            &#9881;
          </button>
        </div>

        <div className="text-center">
          <div className="text-green-900 font-mono text-xs tracking-[1em] mb-4">
            &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;
          </div>

          <div className="text-green-500/50 font-mono text-xs tracking-[0.4em] mb-2">
            ISRAEL DEFENSE FORCES
          </div>

          <h1 className="text-5xl md:text-6xl font-bold font-mono text-green-400 tracking-wider mb-2 drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]">
            MISSILE DEFENSE
          </h1>
          <div className="text-lg font-mono text-green-600 tracking-[0.3em] mb-10">
            AIR DEFENSE COMMAND
          </div>

          <button
            onClick={() => {
              seenBriefingsRef.current.clear();
              startCampaign();
            }}
            className="px-12 py-5 bg-green-900/30 border-2 border-green-500 text-green-400
              font-mono font-bold text-xl tracking-widest rounded-lg
              hover:bg-green-900/50 hover:border-green-300 hover:text-green-300
              hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
              transition-all active:scale-95 cursor-pointer"
          >
            START CAMPAIGN
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="mt-4 px-6 py-2 border border-gray-700 text-gray-500
              font-mono text-xs tracking-widest rounded
              hover:border-gray-500 hover:text-gray-400 transition-all
              active:scale-95 cursor-pointer block mx-auto"
          >
            LEADERBOARD
          </button>

          <div className="text-green-900 font-mono text-xs tracking-[1em] mt-8">
            &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;
          </div>
        </div>

        {/* Leaderboard modal */}
        {showLeaderboard && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="max-w-lg w-full mx-4">
              <LeaderboardTable
                entries={getLeaderboard('CAMPAIGN')}
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
  // BRIEFING SCREEN (Level 1 — Educational Briefing)
  // ========================
  if (gameState === GAME_STATES.BRIEFING) {
    // Auto-skip on replay is handled by the useEffect above
    return (
      <div className="relative">
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
          <EscapeRoomTimer escapeRoomTime={escapeRoomTime} />
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
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <EscapeRoomTimer escapeRoomTime={escapeRoomTime} />
        </div>
        <LevelIntro
          level={currentLevel}
          onReady={() => startLevel(currentLevel)}
        />
        {facilitatorOverlay}
      </div>
    );
  }

  // ========================
  // LEVEL COMPLETE
  // ========================
  if (gameState === GAME_STATES.LEVEL_COMPLETE) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <EscapeRoomTimer escapeRoomTime={escapeRoomTime} />
        </div>
        <LevelComplete
          levelStats={getLevelStats()}
          campaignStats={getCampaignStats()}
          onNextLevel={advanceLevel}
          onViewResults={finishCampaign}
        />
        {facilitatorOverlay}
      </div>
    );
  }

  // ========================
  // SUMMARY SCREEN (after all levels)
  // ========================
  if (gameState === GAME_STATES.SUMMARY) {
    return (
      <>
        <Summary stats={getCampaignStats()} levelStats={getLevelStats()} onReset={() => {
          seenBriefingsRef.current.clear();
          resetGame();
        }} />
        {facilitatorOverlay}
      </>
    );
  }

  // ========================
  // ACTIVE GAME / TZEVA ADOM
  // ========================
  return (
    <div className={`h-screen bg-[#0a0e1a] flex flex-col overflow-hidden relative ${screenShake ? 'screen-shake border-flash-red' : ''}`}>
      {/* Escape Room Timer — floating overlay, visually separate from game */}
      <div className="absolute top-2 right-4 z-30">
        <EscapeRoomTimer escapeRoomTime={escapeRoomTime} />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/50 bg-[#080c16]">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-green-500 font-mono text-xs tracking-widest">
            LEVEL {currentLevel}
          </span>
          <span className="text-gray-700 font-mono text-xs">|</span>
          <span className="font-mono text-xs tracking-wider text-green-500">
            {({ 1: 'SOUTHERN FRONT', 2: 'NORTHERN FRONT', 3: 'CENTRAL FRONT', 4: 'BALLISTIC ARC', 5: 'HYPERSONIC STRIKE', 6: 'WAVE ASSAULT', 7: 'FINAL STAND' })[currentLevel] || ''}
          </span>
        </div>

        {/* Score + Level timer — right (with padding-right for escape room pill) */}
        <div className="flex items-center gap-4 mr-52">
          <div className="font-mono text-xs">
            <span className="text-gray-600">SCORE </span>
            <span className="text-cyan-400 text-sm font-bold tabular-nums">{getRunningScore()}</span>
          </div>
          <span className="text-gray-700 font-mono text-xs">|</span>
          <div className="font-mono text-xs">
            <span className="text-gray-600">LVL {currentLevel} </span>
            <span className="text-green-400 text-sm font-bold tabular-nums">
              {formatCountdown(Math.max(0, (config?.duration || 0) - sessionTime))}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* ZONE A: Radar */}
        <div className="flex-[6] p-4 flex items-center justify-center border-r border-gray-800/30">
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
            bouncingThreats={bouncingThreats}
          />
        </div>

        {/* ZONE B: Threat Panel */}
        <div className="flex-[4] p-4 overflow-hidden">
          <ThreatPanel
            activeThreats={activeThreats}
            selectedThreatId={selectedThreatId}
            onSelectThreat={setSelectedThreatId}
          />
        </div>
      </div>

      {/* ZONE C: Controls */}
      <div className="px-4 py-3 border-t border-gray-800/50 bg-[#080c16]">
        <ControlPanel
          ammo={ammo}
          onAction={handleAction}
          selectedThreatId={selectedThreatId}
          feedbackMessage={feedbackMessage}
          streak={streak}
          availableSystems={config?.available_systems}
        />
      </div>

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

      {/* Cheat code hint paw prints — dynamic count based on active code */}
      {cheatHints > 0 && !tzurActive && !sashaActive && !dvirActive && (
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

      {/* PAUSE overlay */}
      {paused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-5xl font-bold font-mono text-yellow-500 tracking-[0.5em] animate-pulse">
              PAUSED
            </div>
            <div className="text-sm font-mono text-gray-500 mt-4">
              PRESS ESC TO RESUME
            </div>
          </div>
        </div>
      )}

      {/* TZEVA ADOM overlay — non-blocking, translucent */}
      {tzevaAdomActive && <TzevaAdom />}

      {/* Facilitator Controls */}
      {facilitatorOverlay}
    </div>
  );
}
