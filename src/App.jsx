import { useState, useEffect, useCallback, useRef } from 'react';
import useGameEngine from './hooks/useGameEngine.js';
import RadarDisplay from './components/RadarDisplay.jsx';
import ThreatPanel from './components/ThreatPanel.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import TzevaAdom from './components/TzevaAdom.jsx';
import Summary, { LeaderboardTable } from './components/Summary.jsx';
import Briefing from './components/Briefing.jsx';
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
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const hasSeenBriefingRef = useRef(false);

  const {
    gameState,
    currentLevel,
    sessionTime,
    ammo,
    activeThreats,
    selectedThreatId,
    tzevaAdomTimeLeft,
    paused,
    volume,
    feedbackMessage,
    totalPenaltyTime,
    streak,
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
  } = game;

  const config = getLevelConfig(currentLevel);

  // Auto-skip briefing on replay
  useEffect(() => {
    if (gameState === GAME_STATES.BRIEFING && hasSeenBriefingRef.current) {
      skipBriefing();
    }
  }, [gameState, skipBriefing, GAME_STATES]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC: toggle facilitator panel
      if (e.key === 'Escape') {
        if (gameState !== GAME_STATES.PRE_GAME && gameState !== GAME_STATES.BRIEFING &&
            gameState !== GAME_STATES.LEVEL_INTRO && gameState !== GAME_STATES.LEVEL_COMPLETE) {
          setShowFacilitator((prev) => {
            if (!prev) {
              if (!paused) togglePause();
            }
            return !prev;
          });
        }
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

        const sortedThreats = [...activeThreats].sort((a, b) => a.timeLeft - b.timeLeft);
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, paused, togglePause, handleAction, activeThreats, selectedThreatId, setSelectedThreatId, GAME_STATES, config]);

  const handleCloseFacilitator = useCallback(() => {
    setShowFacilitator(false);
  }, []);

  const handlePause = useCallback(() => {
    if (!paused) togglePause();
  }, [paused, togglePause]);

  const handleResume = useCallback(() => {
    if (paused) togglePause();
    setShowFacilitator(false);
  }, [paused, togglePause]);

  // ========================
  // PRE-GAME SCREEN
  // ========================
  if (gameState === GAME_STATES.PRE_GAME) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center relative">
        <button
          onClick={() => setShowFacilitator(true)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-400 transition-colors cursor-pointer text-2xl"
          title="Settings"
        >
          &#9881;
        </button>

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
            onClick={() => startCampaign()}
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

        {showFacilitator && (
          <FacilitatorControls
            onClose={handleCloseFacilitator}
            onPause={handlePause}
            onResume={handleResume}
            onReset={resetGame}
            paused={paused}
            volume={volume}
            onVolumeChange={setVolume}
            isPreGame
          />
        )}
      </div>
    );
  }

  // ========================
  // BRIEFING SCREEN (Level 1 only)
  // ========================
  if (gameState === GAME_STATES.BRIEFING) {
    return (
      <Briefing
        level={1}
        onReady={() => {
          hasSeenBriefingRef.current = true;
          skipBriefing();
        }}
      />
    );
  }

  // ========================
  // LEVEL INTRO (Levels 2-5)
  // ========================
  if (gameState === GAME_STATES.LEVEL_INTRO) {
    return (
      <LevelIntro
        level={currentLevel}
        onReady={() => startLevel(currentLevel)}
      />
    );
  }

  // ========================
  // LEVEL COMPLETE
  // ========================
  if (gameState === GAME_STATES.LEVEL_COMPLETE) {
    return (
      <LevelComplete
        levelStats={getLevelStats()}
        campaignStats={getCampaignStats()}
        onNextLevel={advanceLevel}
        onViewResults={finishCampaign}
      />
    );
  }

  // ========================
  // SUMMARY SCREEN (after all levels)
  // ========================
  if (gameState === GAME_STATES.SUMMARY) {
    return <Summary stats={getCampaignStats()} levelStats={getLevelStats()} onReset={resetGame} />;
  }

  // ========================
  // ACTIVE GAME / TZEVA ADOM
  // ========================
  return (
    <div className={`h-screen bg-[#0a0e1a] flex flex-col overflow-hidden relative ${screenShake ? 'screen-shake border-flash-red' : ''}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/50 bg-[#080c16]">
        <div className="flex items-center gap-4">
          <span className="text-green-500 font-mono text-xs tracking-widest">
            MISSILE DEFENSE
          </span>
          <span className="text-gray-700 font-mono text-xs">|</span>
          <span className="font-mono text-xs tracking-wider text-green-500">
            LEVEL {currentLevel}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-gray-500 tabular-nums">
            {formatCountdown(sessionTime)}
          </span>
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
          sessionTime={sessionTime}
          totalPenaltyTime={totalPenaltyTime}
          feedbackMessage={feedbackMessage}
          streak={streak}
          availableSystems={config?.available_systems}
        />
      </div>

      {/* FINAL SALVO WARNING overlay */}
      {finalSalvoWarning && (
        <div className="absolute inset-x-0 top-12 z-20 flex justify-center pointer-events-none">
          <div className="bg-red-950/90 border-2 border-red-600 rounded-lg px-8 py-4 text-center final-salvo-warning">
            <div className="text-red-400 font-mono text-xs tracking-[0.4em] mb-1">
              INCOMING
            </div>
            <div className="text-red-300 font-mono text-2xl font-bold tracking-wider">
              OPERATION IRON STORM
            </div>
            <div className="text-red-500 font-mono text-xs mt-1 tracking-widest animate-pulse">
              MASS SALVO DETECTED — BRACE FOR IMPACT
            </div>
          </div>
        </div>
      )}

      {/* PAUSE overlay */}
      {paused && gameState !== GAME_STATES.TZEVA_ADOM && (
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

      {/* TZEVA ADOM overlay */}
      {gameState === GAME_STATES.TZEVA_ADOM && (
        <TzevaAdom timeLeft={tzevaAdomTimeLeft} />
      )}

      {/* Facilitator Controls */}
      {showFacilitator && (
        <FacilitatorControls
          onClose={handleCloseFacilitator}
          onPause={handlePause}
          onResume={handleResume}
          onReset={resetGame}
          paused={paused}
          volume={volume}
          onVolumeChange={setVolume}
        />
      )}
    </div>
  );
}
