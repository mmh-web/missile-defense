const ALL_MATCHINGS = [
  {
    system: 'IRON DOME',
    systemColor: '#22c55e',
    shortcut: '1',
    threat: 'DRONES',
    description: 'Low altitude, slow moving',
  },
  {
    system: "DAVID'S SLING",
    systemColor: '#3b82f6',
    shortcut: '2',
    threat: 'CRUISE MISSILES',
    description: 'Low altitude, terrain-following',
  },
  {
    system: 'ARROW 2',
    systemColor: '#a855f7',
    shortcut: '3',
    threat: 'BALLISTIC MISSILES',
    description: 'High arc, fast reentry',
  },
  {
    system: 'ARROW 3',
    systemColor: '#ef4444',
    shortcut: '4',
    threat: 'HYPERSONIC MISSILES',
    description: 'Exo-atmospheric, extreme speed',
  },
];

export default function Briefing({ onReady, level = 1 }) {
  // For Level 1: only show Iron Dome
  const matchings = level === 1 ? ALL_MATCHINGS.slice(0, 1) : ALL_MATCHINGS;

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-y-auto">
      <div className="max-w-3xl w-full py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-green-900 font-mono text-xs tracking-[1em] mb-4">
            &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;
          </div>
          <div className="text-green-500/50 font-mono text-xs tracking-[0.4em] mb-2">
            MISSION BRIEFING
          </div>
          <h1 className="text-3xl font-bold font-mono text-green-400 tracking-wider mb-1">
            LEVEL {level}
          </h1>
          {level === 1 && (
            <div className="text-sm font-mono text-gray-500 tracking-wider mt-2">
              Drone swarm detected. You are Israel's last line of defense.
            </div>
          )}
          <div className="h-px bg-green-900 w-48 mx-auto mt-3" />
        </div>

        {/* System-Threat Matching Grid */}
        <div className="mb-8">
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-4 text-center">
            {level === 1 ? 'YOUR WEAPON' : 'INTERCEPTOR — THREAT MATCHING'}
          </div>

          <div className="space-y-3">
            {matchings.map(({ system, systemColor, shortcut, threat, description }) => (
              <div
                key={system}
                className="flex items-center gap-4 p-3 rounded-lg bg-gray-900/50 border border-gray-800"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded border-2 flex items-center justify-center font-mono font-bold text-sm"
                  style={{ borderColor: systemColor, color: systemColor }}
                >
                  {shortcut}
                </div>
                <div className="flex-1 text-right">
                  <div className="font-mono font-bold text-sm tracking-wider" style={{ color: systemColor }}>
                    {system}
                  </div>
                </div>
                <div className="flex-shrink-0 text-green-600 font-mono text-xl px-2">&#x2192;</div>
                <div className="flex-1">
                  <div className="font-mono font-bold text-sm tracking-wider text-gray-200">{threat}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hold Fire Doctrine */}
        <div className="border border-gray-700 rounded-lg p-5 mb-8 bg-gray-900/30">
          <div className="text-xs text-gray-400 font-mono tracking-widest mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded border border-gray-400 flex items-center justify-center text-gray-400 font-bold text-[10px]">5</span>
            HOLD FIRE DOCTRINE
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 rounded border border-red-900/50 bg-red-950/20">
              <div className="text-red-400 font-mono text-xs font-bold mb-1">&#x25CF; POPULATED AREA</div>
              <div className="text-xs text-gray-400 font-mono">
                City targeted &#x2192; <span className="text-green-400 font-bold">MUST INTERCEPT</span>
              </div>
            </div>
            <div className="p-3 rounded border border-gray-700 bg-gray-800/30">
              <div className="text-gray-400 font-mono text-xs font-bold mb-1">&#x25CB; OPEN GROUND</div>
              <div className="text-xs text-gray-400 font-mono">
                Desert / off-course &#x2192; <span className="text-gray-200 font-bold">HOLD FIRE</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-mono mt-3 text-center">
            Interceptors are limited. Conserve ammunition for threats targeting cities.
          </div>
        </div>

        {/* Controls Reference */}
        <div className="border border-gray-800 rounded-lg p-4 mb-8 bg-gray-900/20">
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-3">CONTROLS</div>
          <div className="flex gap-6 justify-center text-xs font-mono text-gray-400 flex-wrap">
            {level === 1 ? (
              <>
                <span><span className="text-green-400">1</span> Iron Dome</span>
                <span><span className="text-green-400">5 / Space</span> Hold Fire</span>
                <span><span className="text-green-400">Tab</span> Cycle Threats</span>
                <span><span className="text-green-400">ESC</span> Pause</span>
              </>
            ) : (
              <>
                <span><span className="text-green-400">1-4</span> Interceptors</span>
                <span><span className="text-green-400">5 / Space</span> Hold Fire</span>
                <span><span className="text-green-400">Tab</span> Cycle Threats</span>
                <span><span className="text-green-400">ESC</span> Pause</span>
              </>
            )}
          </div>
        </div>

        {/* Begin button */}
        <div className="text-center">
          <button
            onClick={onReady}
            className="px-12 py-5 bg-green-900/30 border-2 border-green-500 text-green-400
              font-mono font-bold text-xl tracking-widest rounded-lg
              hover:bg-green-900/50 hover:border-green-300 hover:text-green-300
              hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
              transition-all active:scale-95 cursor-pointer"
          >
            BEGIN MISSION
          </button>
        </div>

        <div className="text-green-900 font-mono text-xs tracking-[1em] mt-6 text-center">
          &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;
        </div>
      </div>
    </div>
  );
}
