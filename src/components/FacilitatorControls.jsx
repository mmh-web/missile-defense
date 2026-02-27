export default function FacilitatorControls({
  onClose,
  onPause,
  onResume,
  onReset,
  paused,
  volume,
  onVolumeChange,
  isPreGame,
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1525] border border-gray-700 rounded-xl p-6 w-96 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="font-mono text-sm text-green-500 tracking-widest">
            FACILITATOR CONTROLS
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl cursor-pointer"
          >
            &#x2715;
          </button>
        </div>

        {/* Volume */}
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

        {/* Game controls */}
        {!isPreGame && (
          <div className="space-y-3">
            <div className="h-px bg-gray-800 mb-4" />

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

            {/* Reset */}
            <button
              onClick={onReset}
              className="w-full py-3 rounded-lg font-mono font-bold tracking-wider
                bg-red-900/30 border-2 border-red-700 text-red-400
                hover:bg-red-900/50 hover:border-red-500 transition-all cursor-pointer"
            >
              RESET MISSION
            </button>
          </div>
        )}

        {/* Keyboard hint */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-[10px] text-gray-600 font-mono text-center">
            PRESS ESC TO TOGGLE THIS PANEL
          </div>
        </div>
      </div>
    </div>
  );
}
