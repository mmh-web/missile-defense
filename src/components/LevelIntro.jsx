import { getLevelConfig, THREAT_COLORS, INTERCEPTOR_COLORS } from '../config/threats.js';

// ─── Threat Animation Components ───────────────────────────────────

function CruiseMissileAnimation() {
  return (
    <div className="mt-4 flex justify-center">
      <svg viewBox="0 0 300 90" width="300" height="90" className="overflow-visible">
        {/* Terrain — rolling hills */}
        <path
          d="M0,78 Q40,68 80,76 T160,72 T240,78 T300,74 L300,90 L0,90 Z"
          fill="#1a2e1a" opacity="0.5"
        />
        <path
          d="M0,78 Q40,68 80,76 T160,72 T240,78 T300,74"
          fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.25"
        />
        {/* Altitude line */}
        <line x1="0" y1="45" x2="300" y2="45" stroke="#3b82f6" strokeWidth="0.3" opacity="0.06" strokeDasharray="4,8" />
        <text x="6" y="43" fill="#3b82f6" fontSize="5" fontFamily="monospace" opacity="0.2">LOW ALT</text>

        {/* Exhaust trail */}
        <line x1="0" y1="45" x2="300" y2="45"
          stroke="#3b82f6" strokeWidth="0.8" opacity="0.12"
          strokeDasharray="2,5" className="cruise-trail"
        />

        {/* Cruise missile — side profile */}
        <g className="cruise-missile-fly">
          {/* Engine exhaust */}
          <ellipse cx="-16" cy="0" rx="4" ry="1.5" fill="#3b82f6" opacity="0.25" className="cruise-exhaust-pulse" />
          <ellipse cx="-18" cy="0" rx="3" ry="1" fill="#60a5fa" opacity="0.15" className="cruise-exhaust-pulse" />

          {/* Fuselage — long cylindrical body */}
          <path
            d="M18,0 L16,-1.8 L-12,-1.8 L-14,0 L-12,1.8 L16,1.8 Z"
            fill="#3b82f6" opacity="0.85"
          />

          {/* Mid-body wings — stubby swept */}
          <path d="M2,-1.8 L-1,-9 L-6,-8 L-4,-1.8" fill="#3b82f6" opacity="0.65" />
          <path d="M2,1.8 L-1,9 L-6,8 L-4,1.8" fill="#3b82f6" opacity="0.65" />

          {/* Tail fins — small cruciform */}
          <path d="M-11,-1.8 L-13,-5.5 L-12,-5 L-10,-1.8" fill="#3b82f6" opacity="0.55" />
          <path d="M-11,1.8 L-13,5.5 L-12,5 L-10,1.8" fill="#3b82f6" opacity="0.55" />

          {/* Intake scoop under fuselage */}
          <rect x="-4" y="1.8" width="6" height="2" rx="0.5" fill="#3b82f6" opacity="0.5" />

          {/* Nosecone — pointed */}
          <path d="M16,-1.5 L22,0 L16,1.5" fill="#60a5fa" opacity="0.9" />
          {/* Seeker window */}
          <circle cx="20" cy="0" r="0.8" fill="#bfdbfe" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

function BallisticMissileAnimation() {
  return (
    <div className="mt-4 flex justify-center">
      <svg viewBox="0 0 300 130" width="300" height="130" className="overflow-visible">
        {/* Ground */}
        <line x1="0" y1="118" x2="300" y2="118" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />

        {/* Arc path — ghost trail */}
        <path
          d="M35,116 Q75,10 150,6 Q225,4 270,116"
          fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.12"
          strokeDasharray="4,4"
        />

        {/* Labels */}
        <text x="150" y="4" fill="#ef4444" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">APOGEE</text>
        <circle cx="35" cy="116" r="2" fill="#ef4444" opacity="0.25" />
        <text x="35" y="126" fill="#ef4444" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">LAUNCH</text>
        <circle cx="270" cy="116" r="2" fill="#ef4444" opacity="0.35" className="ballistic-impact-pulse" />
        <text x="270" y="126" fill="#ef4444" fontSize="5" textAnchor="middle" opacity="0.35" fontFamily="monospace">IMPACT</text>

        {/* Missile following arc — drawn horizontally (nose pointing right, +X) */}
        <g className="ballistic-missile-arc">
          {/* Exhaust plume at rear */}
          <ellipse cx="-8" cy="0" rx="5" ry="2" fill="#ef4444" opacity="0.15" className="ballistic-glow" />

          {/* Missile body — horizontal rocket shape */}
          <path
            d="M-6,-2 L7,-2 L10,-1.5 L10,1.5 L7,2 L-6,2 L-8,1.5 L-8,-1.5 Z"
            fill="#ef4444" opacity="0.85"
          />

          {/* Nosecone — pointed warhead */}
          <path d="M7,-2 L14,0 L7,2" fill="#f87171" opacity="0.9" />

          {/* Fins at base (rear) */}
          <path d="M-6,-2 L-9,-5 L-7,-4 L-6,-2" fill="#ef4444" opacity="0.6" />
          <path d="M-6,2 L-9,5 L-7,4 L-6,2" fill="#ef4444" opacity="0.6" />

          {/* Body stripe */}
          <rect x="0" y="-1" width="1.5" height="2" rx="0.3" fill="#f87171" opacity="0.4" />

          {/* Reentry glow at nose */}
          <circle cx="12" cy="0" r="3" fill="#ef4444" opacity="0.15" className="ballistic-glow" />
        </g>
      </svg>
    </div>
  );
}

function HypersonicMissileAnimation() {
  return (
    <div className="mt-4 flex justify-center">
      <svg viewBox="0 0 300 130" width="300" height="130" className="overflow-visible">
        {/* Ground */}
        <line x1="0" y1="118" x2="300" y2="118" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />

        {/* Boost-glide trajectory — ghost path */}
        <path
          d="M280,8 Q200,10 150,40 Q120,65 90,116"
          fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.10"
          strokeDasharray="3,5"
        />

        {/* Speed streaks along the path */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <line
            key={i}
            x1={270 - i * 22} y1={6 + i * 12}
            x2={258 - i * 20} y2={14 + i * 14}
            stroke="#a855f7" strokeWidth={0.4 + i * 0.1}
            opacity={0.04 + i * 0.025}
            className="hypersonic-speed-line"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}

        {/* Labels */}
        <text x="275" y="6" fill="#a855f7" fontSize="5" textAnchor="end" opacity="0.3" fontFamily="monospace">REENTRY</text>
        <text x="150" y="30" fill="#a855f7" fontSize="4" textAnchor="middle" opacity="0.15" fontFamily="monospace">GLIDE PHASE</text>
        <circle cx="90" cy="116" r="3" fill="#a855f7" opacity="0.25" className="ballistic-impact-pulse" />
        <text x="90" y="126" fill="#a855f7" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">IMPACT</text>

        {/* Missile on boost-glide path — drawn horizontally, nose right */}
        <g className="hypersonic-missile-dive">
          {/* Long plasma wake trail — streams behind missile */}
          <ellipse cx="-20" cy="0" rx="18" ry="3" fill="#a855f7" opacity="0.08" className="hypersonic-plasma" />
          <ellipse cx="-14" cy="0" rx="12" ry="2.5" fill="#c084fc" opacity="0.10" className="hypersonic-plasma" />
          <ellipse cx="-8" cy="0" rx="6" ry="2" fill="#d8b4fe" opacity="0.12" />

          {/* Missile body — sleek horizontal waverider */}
          <path
            d="M-8,-1.8 L8,-1.8 L12,-1 L12,1 L8,1.8 L-8,1.8 L-10,1 L-10,-1 Z"
            fill="#a855f7" opacity="0.9"
          />

          {/* Sharp nosecone — wedge shape */}
          <path d="M8,-1.8 L18,0 L8,1.8" fill="#d8b4fe" opacity="0.9" />

          {/* Small swept fins */}
          <path d="M-7,-1.8 L-10,-4 L-8,-3.5 L-6,-1.8" fill="#a855f7" opacity="0.55" />
          <path d="M-7,1.8 L-10,4 L-8,3.5 L-6,1.8" fill="#a855f7" opacity="0.55" />

          {/* Bow shock wave — ahead of nose */}
          <path d="M16,-5 Q22,0 16,5" fill="none" stroke="#d8b4fe" strokeWidth="0.8" opacity="0.5" />
          <path d="M14,-7 Q23,0 14,7" fill="none" stroke="#a855f7" strokeWidth="0.4" opacity="0.2" />

          {/* Nosecone heating glow */}
          <circle cx="16" cy="0" r="4" fill="#a855f7" opacity="0.2" className="hypersonic-plasma" />
          <circle cx="16" cy="0" r="2" fill="#d8b4fe" opacity="0.4" />
          <circle cx="17" cy="0" r="1" fill="#f0e0ff" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

function RocketAnimation() {
  return (
    <div className="mt-4 flex justify-center">
      <svg viewBox="0 0 300 110" width="300" height="110" className="overflow-visible">
        {/* Ground */}
        <line x1="0" y1="100" x2="300" y2="100" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />

        {/* Arc path */}
        <path
          d="M40,98 Q100,20 260,98"
          fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.12"
          strokeDasharray="4,4"
        />

        {/* Labels */}
        <circle cx="40" cy="98" r="2" fill="#f97316" opacity="0.25" />
        <text x="40" y="108" fill="#f97316" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">LAUNCH</text>
        <circle cx="260" cy="98" r="2" fill="#f97316" opacity="0.35" className="ballistic-impact-pulse" />
        <text x="260" y="108" fill="#f97316" fontSize="5" textAnchor="middle" opacity="0.35" fontFamily="monospace">IMPACT</text>

        {/* Rocket on arc */}
        <g className="ballistic-missile-arc">
          <ellipse cx="-6" cy="0" rx="4" ry="1.5" fill="#f97316" opacity="0.2" className="ballistic-glow" />
          <path d="M-5,-1.5 L5,-1.5 L7,0 L5,1.5 L-5,1.5 L-6,0 Z" fill="#f97316" opacity="0.85" />
          <path d="M5,-1.5 L10,0 L5,1.5" fill="#fb923c" opacity="0.9" />
          <path d="M-5,-1.5 L-7,-3.5 L-6,-3 L-5,-1.5" fill="#f97316" opacity="0.6" />
          <path d="M-5,1.5 L-7,3.5 L-6,3 L-5,1.5" fill="#f97316" opacity="0.6" />
          <circle cx="8" cy="0" r="2" fill="#f97316" opacity="0.15" className="ballistic-glow" />
        </g>
      </svg>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────

// Level-specific subtitles
const LEVEL_TITLES = {
  1: 'SOUTHERN FRONT',
  2: 'NORTHERN FRONT',
  3: 'CRUISE THREAT',
  4: 'BALLISTIC ARC',
  5: 'HYPERSONIC STRIKE',
  6: 'WAVE ASSAULT',
  7: 'FINAL STAND',
};

export default function LevelIntro({ level, onReady }) {
  const config = getLevelConfig(level);
  if (!config) return null;

  // Pick the right animation for the level
  const ThreatAnimation = {
    rocket: RocketAnimation,
    cruise: CruiseMissileAnimation,
    ballistic: BallisticMissileAnimation,
    hypersonic: HypersonicMissileAnimation,
  }[config.new_threat?.type] || null;

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-y-auto">
      <div className="max-w-2xl w-full py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-green-500/30 font-mono text-xs tracking-[0.4em] mb-2">
            {level === 1 ? 'MISSION READY' : 'INTEL BRIEFING'}
          </div>
          <h1 className="text-3xl font-bold font-mono text-green-400 tracking-wider mb-1">
            LEVEL {config.id}
          </h1>
          {LEVEL_TITLES[level] && (
            <div className="text-lg font-mono text-green-600 tracking-[0.3em] mt-1">
              {LEVEL_TITLES[level]}
            </div>
          )}
          <div className="h-px bg-green-900 w-48 mx-auto mt-4" />
        </div>

        {/* Level 1 — Your Weapon recap + gameplay reminder */}
        {level === 1 && (
          <>
            <div className="mb-6 border rounded-lg p-5 bg-gray-900/30 border-green-900/50">
              <div className="text-xs font-mono tracking-widest mb-3 text-green-500">
                YOUR WEAPON
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded border-2 flex items-center justify-center font-mono font-bold text-xl"
                  style={{ borderColor: INTERCEPTOR_COLORS.iron_dome, color: INTERCEPTOR_COLORS.iron_dome }}
                >
                  1
                </div>
                <div>
                  <div className="text-lg font-bold font-mono tracking-wider" style={{ color: INTERCEPTOR_COLORS.iron_dome }}>
                    IRON DOME
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">
                    {config.ammo.iron_dome} Tamir interceptors ready
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 border border-yellow-900/40 rounded-lg p-4 bg-yellow-900/10">
              <div className="text-xs font-mono tracking-widest mb-2 text-yellow-500">
                REMEMBER
              </div>
              <div className="flex items-center gap-3 text-sm font-mono text-gray-300">
                <span className="text-yellow-400">1.</span>
                <span>Click a threat to select it</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-mono text-gray-300 mt-1.5">
                <span className="text-yellow-400">2.</span>
                <span>Press <span className="text-green-400 font-bold">1</span> to fire Iron Dome, or <span className="text-gray-400 font-bold">5</span> to hold fire</span>
              </div>
            </div>
          </>
        )}

        {/* New Threat Card */}
        {config.new_threat && (() => {
          const threatColor = THREAT_COLORS[config.new_threat.type] || '#ef4444';
          return (
          <div className="mb-6 border rounded-lg p-5" style={{
            borderColor: `${threatColor}40`,
            backgroundColor: `${threatColor}08`,
          }}>
            <div className="text-xs font-mono tracking-widest mb-3 flex items-center gap-2" style={{ color: threatColor }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: threatColor }} />
              NEW THREAT DETECTED
            </div>
            <div className="text-xl font-bold font-mono tracking-wider mb-2" style={{ color: threatColor }}>
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
            {/* Animated threat depiction */}
            {ThreatAnimation && <ThreatAnimation />}
          </div>
          );
        })()}

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

        {/* Levels 6-7: No new threat/system — show challenge description */}
        {!config.new_threat && !config.new_system && level > 1 && (
          <div className="mb-6 border rounded-lg p-5 bg-gray-900/30 border-gray-700/50">
            <div className="text-xs font-mono tracking-widest mb-3 text-gray-400">
              {level === 6 ? 'CHALLENGE MODE' : 'FINAL CHALLENGE'}
            </div>
            <div className="text-sm font-mono text-gray-300 leading-relaxed">
              {level === 6
                ? 'All threat types in coordinated waves. Identify each threat and match it to the correct interceptor.'
                : 'Massive salvos with severely limited ammunition. Every interceptor must count.'
              }
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
              const colors = INTERCEPTOR_COLORS;
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
