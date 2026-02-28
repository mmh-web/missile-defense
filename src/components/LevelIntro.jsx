import { getLevelConfig } from '../config/threats.js';

export default function LevelIntro({ level, onReady }) {
  const config = getLevelConfig(level);
  if (!config) return null;

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-y-auto">
      <div className="max-w-2xl w-full py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-green-500/30 font-mono text-xs tracking-[0.4em] mb-2">
            INTEL BRIEFING
          </div>
          <div className="text-green-500/50 font-mono text-sm tracking-widest mb-1">
            LEVEL {config.id}
          </div>
          <h1 className="text-3xl font-bold font-mono text-green-400 tracking-wider mb-1">
            LEVEL {config.id}
          </h1>
          <div className="h-px bg-green-900 w-48 mx-auto mt-4" />
        </div>

        {/* New Threat Card */}
        {config.new_threat && (
          <div className="mb-6 border border-red-900/50 rounded-lg p-5 bg-red-950/20">
            <div className="text-xs text-red-400 font-mono tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              NEW THREAT DETECTED
            </div>
            <div className="text-xl font-bold font-mono text-gray-200 tracking-wider mb-2">
              {config.new_threat.name}
            </div>
            <div className="text-sm font-mono text-gray-400 mb-1">
              {config.new_threat.description}
            </div>
            {config.new_threat.speed && (
              <div className="text-xs font-mono text-gray-500">
                Speed: {config.new_threat.speed}
              </div>
            )}
          </div>
        )}

        {/* New System Card */}
        {config.new_system && (
          <div className="mb-6 border rounded-lg p-5 bg-gray-900/30"
            style={{ borderColor: `${config.new_system.color}40` }}>
            <div className="text-xs font-mono tracking-widest mb-3"
              style={{ color: config.new_system.color }}>
              NEW SYSTEM ONLINE
            </div>
            <div className="flex items-center gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded border-2 flex items-center justify-center font-mono font-bold text-xl"
                style={{ borderColor: config.new_system.color, color: config.new_system.color }}
              >
                {config.new_system.shortcut}
              </div>
              <div>
                <div className="text-lg font-bold font-mono tracking-wider"
                  style={{ color: config.new_system.color }}>
                  {config.new_system.name}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  Press <span style={{ color: config.new_system.color }} className="font-bold">{config.new_system.shortcut}</span> to intercept {config.new_threat?.name?.toLowerCase() || 'threats'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Mechanic Card (for Level 4 - Fog of War) */}
        {config.new_mechanic && (
          <div className="mb-6 border border-yellow-900/50 rounded-lg p-5 bg-yellow-950/20">
            <div className="text-xs text-yellow-400 font-mono tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              NEW CONDITION
            </div>
            <div className="text-xl font-bold font-mono text-yellow-400 tracking-wider mb-2">
              {config.new_mechanic.name}
            </div>
            <div className="text-sm font-mono text-gray-400 leading-relaxed">
              {config.new_mechanic.description}
            </div>
          </div>
        )}

        {/* Ammo for this level */}
        <div className="border border-gray-800 rounded-lg p-4 mb-8 bg-gray-900/20">
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-3">AMMUNITION</div>
          <div className="flex gap-3 justify-center flex-wrap">
            {config.available_systems.map((sys) => {
              const labels = {
                iron_dome: 'IRON DOME',
                davids_sling: "DAVID'S SLING",
                arrow_2: 'ARROW 2',
                arrow_3: 'ARROW 3',
              };
              const colors = {
                iron_dome: '#22c55e',
                davids_sling: '#3b82f6',
                arrow_2: '#a855f7',
                arrow_3: '#ef4444',
              };
              return (
                <div key={sys} className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 rounded border border-gray-800">
                  <span className="text-xs font-mono" style={{ color: colors[sys] }}>{labels[sys]}</span>
                  <span className="text-sm font-bold font-mono" style={{ color: colors[sys] }}>
                    {config.ammo[sys] || 0}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Begin button */}
        <div className="text-center">
          <button
            onClick={onReady}
            className="px-12 py-4 bg-green-900/30 border-2 border-green-500 text-green-400
              font-mono font-bold text-lg tracking-widest rounded-lg
              hover:bg-green-900/50 hover:border-green-300 hover:text-green-300
              hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
              transition-all active:scale-95 cursor-pointer"
          >
            BEGIN LEVEL {config.id}
          </button>
        </div>
      </div>
    </div>
  );
}
