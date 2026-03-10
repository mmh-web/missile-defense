import { useState, useRef, useEffect } from 'react';

const FACILITATOR_CODE = '1948';
const TOTAL_LEVELS = 7;

export default function FacilitatorControls({
  onClose,
  onPause,
  onResume,
  onReset,
  onJumpToLevel,
  paused,
  volume,
  onVolumeChange,
  currentLevel,
  isPreGame,
  unlocked,
  onUnlock,
  escapeRoomStartTime,
  onSetEscapeTime,
  escapeRoomMode,
  onToggleEscapeRoomMode,
  onAddTime,
  skipBriefings,
  onToggleSkipBriefings,
  bonusLevelEnabled,
  onToggleBonusLevel,
}) {
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);
  const codeInputRef = useRef(null);

  // No autofocus — player must click on the input field manually

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (codeInput === FACILITATOR_CODE) {
      onUnlock();
      setCodeError(false);
    } else {
      setCodeError(true);
      setCodeInput('');
      setTimeout(() => setCodeError(false), 1500);
    }
  };

  const handleJump = (level) => {
    onJumpToLevel(level);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1525] border border-gray-700 rounded-xl p-6 w-96 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="font-mono text-sm text-green-500 tracking-widest">
            {unlocked ? 'FACILITATOR CONTROLS' : 'SETTINGS'}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl cursor-pointer"
          >
            &#x2715;
          </button>
        </div>

        {/* Volume — always visible */}
        <div className="mb-6">
          <label className="block text-xs text-gray-500 font-mono tracking-wider mb-2">
            VOLUME
          </label>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">&#128264;</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="flex-1 accent-green-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
            />
            <span className="text-gray-500 text-sm">&#128266;</span>
            <span className="text-xs text-gray-500 font-mono w-10 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Escape Room Mode toggle — unlocked only */}
        {unlocked && (
          <div className="mb-6">
            <div className="h-px bg-gray-800 mb-4" />
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-gray-500 font-mono tracking-wider">
                ESCAPE ROOM MODE
              </label>
              <button
                onClick={onToggleEscapeRoomMode}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  escapeRoomMode ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  escapeRoomMode ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
            <div className="text-[10px] text-gray-600 font-mono mb-3">
              {escapeRoomMode ? 'TIMER ACTIVE — CAMPAIGN AUTO-ENDS AT 0:00' : `NO TIMER — PLAY ALL ${bonusLevelEnabled ? 7 : 6} LEVELS`}
            </div>

            {/* Timer duration slider + add time — only when escape room mode ON */}
            {escapeRoomMode && (
              <>
                <label className="block text-xs text-gray-500 font-mono tracking-wider mb-2">
                  TIMER DURATION
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="1"
                    value={Math.round((escapeRoomStartTime || 1500) / 60)}
                    onChange={(e) => onSetEscapeTime(parseInt(e.target.value) * 60)}
                    className="flex-1 accent-purple-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 font-mono w-16 text-right">
                    {Math.round((escapeRoomStartTime || 1500) / 60)} MIN
                  </span>
                </div>
                <div className="text-[10px] text-gray-600 font-mono text-center mt-1">
                  RESETS ON NEW CAMPAIGN
                </div>

                {/* Add time button — only visible during active campaign */}
                {!isPreGame && (
                  <button
                    onClick={() => onAddTime(60)}
                    className="w-full mt-3 py-2 rounded-lg font-mono font-bold text-xs tracking-wider
                      bg-purple-900/30 border-2 border-purple-700 text-purple-400
                      hover:bg-purple-900/50 hover:border-purple-500 transition-all cursor-pointer"
                  >
                    +1 MIN
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Skip Briefings toggle — unlocked only */}
        {unlocked && (
          <div className="mb-6">
            <div className="h-px bg-gray-800 mb-4" />
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-500 font-mono tracking-wider">
                SKIP BRIEFINGS
              </label>
              <button
                onClick={onToggleSkipBriefings}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  skipBriefings ? 'bg-green-600' : 'bg-gray-700'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  skipBriefings ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
            <div className="text-[10px] text-gray-600 font-mono mt-1">
              {skipBriefings ? 'BRIEFINGS WILL BE SKIPPED' : 'ALL BRIEFINGS WILL PLAY'}
            </div>
          </div>
        )}

        {/* Bonus Level (L7) toggle — unlocked only */}
        {unlocked && (
          <div className="mb-6">
            <div className="h-px bg-gray-800 mb-4" />
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-500 font-mono tracking-wider">
                BONUS LEVEL (L7)
              </label>
              <button
                onClick={onToggleBonusLevel}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  bonusLevelEnabled ? 'bg-amber-600' : 'bg-gray-700'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  bonusLevelEnabled ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
            <div className="text-[10px] text-gray-600 font-mono mt-1">
              {bonusLevelEnabled ? 'L7 ENABLED — ZERO-MARGIN FINAL CHALLENGE' : 'CAMPAIGN ENDS AFTER L6'}
            </div>
          </div>
        )}

        {/* Game controls — pause/resume during active game, always behind unlock */}
        {unlocked && !isPreGame && (
          <div className="space-y-3 mb-6">
            <div className="h-px bg-gray-800" />

            {/* Pause/Resume */}
            <button
              onClick={paused ? onResume : onPause}
              className={`w-full py-3 rounded-lg font-mono font-bold tracking-wider transition-all cursor-pointer ${
                paused
                  ? 'bg-green-900/30 border-2 border-green-600 text-green-400 hover:bg-green-900/50'
                  : 'bg-yellow-900/30 border-2 border-yellow-600 text-yellow-400 hover:bg-yellow-900/50'
              }`}
            >
              {paused ? 'RESUME' : 'PAUSE'}
            </button>
          </div>
        )}

        {/* Level Jump — unlocked only */}
        {unlocked && (
          <div className="mb-6">
            <div className="h-px bg-gray-800 mb-4" />
            <label className="block text-xs text-gray-500 font-mono tracking-wider mb-3">
              JUMP TO LEVEL
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: bonusLevelEnabled ? TOTAL_LEVELS : TOTAL_LEVELS - 1 }, (_, i) => i + 1).map((level) => (
                <button
                  key={level}
                  onClick={() => handleJump(level)}
                  className={`py-3 rounded-lg font-mono font-bold text-sm tracking-wider transition-all cursor-pointer ${
                    level === currentLevel && !isPreGame
                      ? 'bg-green-900/40 border-2 border-green-500 text-green-400'
                      : 'bg-gray-800/50 border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-gray-600 font-mono text-center mt-2">
              JUMPS TO LEVEL BRIEFING / INTRO SCREEN
            </div>
          </div>
        )}

        {/* Reset — unlocked only */}
        {unlocked && (
          <div className="mb-4">
            <button
              onClick={() => { onReset(); onClose(); }}
              className="w-full py-3 rounded-lg font-mono font-bold tracking-wider
                bg-red-900/30 border-2 border-red-700 text-red-400
                hover:bg-red-900/50 hover:border-red-500 transition-all cursor-pointer"
            >
              RESET TO MAIN MENU
            </button>
          </div>
        )}

        {/* Facilitator code entry — shown when locked */}
        {!unlocked && (
          <div className="mb-4">
            <div className="h-px bg-gray-800 mb-4" />
            <form onSubmit={handleCodeSubmit}>
              <label className="block text-xs text-gray-600 font-mono tracking-wider mb-2">
                FACILITATOR ACCESS
              </label>
              <div className="flex gap-2">
                <input
                  ref={codeInputRef}
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter code"
                  className={`flex-1 bg-gray-900 border rounded px-3 py-2 text-sm font-mono text-gray-300
                    placeholder-gray-700 focus:outline-none focus:border-green-600 transition-colors ${
                    codeError ? 'border-red-600 animate-pulse' : 'border-gray-700'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-400
                    font-mono text-xs tracking-wider rounded
                    hover:border-gray-500 hover:text-gray-300 transition-all cursor-pointer"
                >
                  UNLOCK
                </button>
              </div>
              {codeError && (
                <div className="text-red-500 text-[10px] font-mono mt-1">
                  INVALID CODE
                </div>
              )}
            </form>
          </div>
        )}

        {/* Keyboard hint */}
        <div className="pt-4 border-t border-gray-800">
          <div className="text-[10px] text-gray-600 font-mono text-center">
            PRESS ESC TO TOGGLE THIS PANEL
          </div>
        </div>
      </div>
    </div>
  );
}
