import { getLevelConfig, THREAT_COLORS, INTERCEPTOR_COLORS, LEVEL_ACCENT_COLORS } from '../config/threats.js';

// Hero images for each level's intro screen
const LEVEL_INTRO_IMAGES = {
  1: 'ID1.jpg',
  2: 'ID2.jpg',
  3: 'ID4.jpeg',
  4: 'ID3.jpg',
  5: 'ID1.jpg',
  6: 'ID3.jpg',
  7: 'ID3.jpg',
};

// Level-specific subtitles
const LEVEL_TITLES = {
  1: 'SOUTHERN FRONT',
  2: 'NORTHERN FRONT',
  3: 'CENTRAL FRONT',
  4: 'STRATEGIC TARGETS',
  5: 'ARMY BASES',
  6: 'WAVE ASSAULT',
  7: 'APRIL 13',
};

const LEVEL_TITLES_HE = {
  1: 'חֲזִית הַדָּרוֹם',
  2: 'חֲזִית הַצָּפוֹן',
  3: 'חֲזִית הַמֶּרְכָּז',
  4: 'מַטָּרוֹת אִסְטְרָטֶגִיּוֹת',
  5: 'בְּסִיסֵי צָבָא',
  6: 'מִתְקֶפֶת גַּלִּים',
  7: 'שְׁלוֹשָׁה עָשָׂר בְּאַפְּרִיל',
};

export default function LevelIntro({ level, onReady }) {
  const config = getLevelConfig(level);
  if (!config) return null;

  const basePath = import.meta.env.BASE_URL || '/missile-defense/';
  const accentColor = LEVEL_ACCENT_COLORS[level] || '#22c55e';
  const heroImage = LEVEL_INTRO_IMAGES[level] || 'ID1.jpg';

  return (
    <div className="h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: '#0a0e1a' }}>
      {/* Full-bleed background photo */}
      <div className="absolute inset-0"
        style={{ background: `url('${basePath}images/${heroImage}') center 40% / cover no-repeat` }} />
      {/* Heavy gradient overlay — content reads clearly */}
      <div className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            rgba(10,14,26,0.5) 0%,
            rgba(10,14,26,0.35) 30%,
            rgba(10,14,26,0.6) 55%,
            rgba(10,14,26,0.92) 80%,
            #0a0e1a 100%
          )`,
        }} />
      {/* Vignette */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,14,26,0.5) 100%)' }} />

      <div className="relative z-10 w-full max-w-[520px] h-screen flex flex-col px-6 justify-end pb-6">
        {/* Level badge + title — movie poster style at bottom */}
        <div className="mb-4">
          {/* Level badge */}
          <div className="mb-3">
            <span className="inline-block font-mono text-sm font-bold tracking-[0.3em] px-3 py-1.5 rounded border-2"
              style={{
                color: accentColor,
                borderColor: accentColor,
                background: `${accentColor}15`,
              }}>
              LEVEL {config.id}
            </span>
          </div>

          {/* Title */}
          {LEVEL_TITLES[level] && (
            <div className="font-mono text-2xl font-black tracking-[0.2em] mb-1"
              style={{
                color: accentColor,
                textShadow: `0 0 40px ${accentColor}50`,
              }}>
              {LEVEL_TITLES[level]}
            </div>
          )}

          {/* Hebrew title */}
          {LEVEL_TITLES_HE[level] && (
            <div className="text-[22px] font-bold mb-3"
              style={{
                fontFamily: 'Arial, sans-serif',
                color: `${accentColor}BF`,
              }}>
              {LEVEL_TITLES_HE[level]}
            </div>
          )}

          {/* Accent line */}
          <div className="h-0.5 w-48 mb-4"
            style={{ background: `linear-gradient(90deg, ${accentColor}80, transparent)` }} />
        </div>

        {/* Level 1 — Your Weapon recap + gameplay reminder */}
        {level === 1 && (
          <>
            <div className="mb-3 rounded-xl p-3"
              style={{
                background: 'rgba(17,24,39,0.55)',
                border: '1px solid #1e2736',
              }}>
              <div className="text-xs font-mono tracking-widest mb-2" style={{ color: '#22c55e' }}>
                YOUR WEAPON
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded border-2 flex items-center justify-center font-mono font-bold text-xl"
                  style={{ borderColor: INTERCEPTOR_COLORS.iron_dome, color: INTERCEPTOR_COLORS.iron_dome }}>
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

            <div className="mb-3 rounded-xl p-3"
              style={{
                background: 'rgba(234,179,8,0.06)',
                border: '1px solid rgba(234,179,8,0.2)',
              }}>
              <div className="text-xs font-mono tracking-widest mb-2 text-yellow-500">
                REMEMBER
              </div>
              <div className="flex items-center gap-3 text-sm font-mono text-gray-300">
                <span className="text-yellow-400">1.</span>
                <span>Click a threat to select it</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-mono text-gray-300 mt-1.5">
                <span className="text-yellow-400">2.</span>
                <span>Press <span className="text-green-400 font-bold">1</span> to fire Iron Dome, or <span className="text-gray-400 font-bold">SPACE</span> to hold fire</span>
              </div>
            </div>
          </>
        )}

        {/* New Threat Card */}
        {config.new_threat && (() => {
          const threatColor = THREAT_COLORS[config.new_threat.type] || '#ef4444';
          return (
            <div className="mb-3 rounded-xl p-3"
              style={{
                background: `${threatColor}08`,
                border: `1px solid ${threatColor}40`,
              }}>
              <div className="text-xs font-mono tracking-widest mb-2 flex items-center gap-2"
                style={{ color: threatColor }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: threatColor }} />
                NEW THREAT DETECTED
              </div>
              <div className="text-xl font-bold font-mono tracking-wider mb-1" style={{ color: threatColor }}>
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
          );
        })()}

        {/* New System Card */}
        {config.new_system && (
          <div className="mb-3 rounded-xl p-3"
            style={{
              background: 'rgba(17,24,39,0.55)',
              border: `1px solid ${config.new_system.color}40`,
            }}>
            <div className="text-xs font-mono tracking-widest mb-2"
              style={{ color: config.new_system.color }}>
              NEW SYSTEM ONLINE
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded border-2 flex items-center justify-center font-mono font-bold text-xl"
                style={{ borderColor: config.new_system.color, color: config.new_system.color }}>
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

        {/* Levels 6-7: No new threat/system — challenge description */}
        {!config.new_threat && !config.new_system && level > 1 && (
          <div className="mb-3 rounded-xl p-3"
            style={{
              background: 'rgba(17,24,39,0.55)',
              border: '1px solid #1e2736',
            }}>
            <div className="text-xs font-mono tracking-widest mb-2 text-gray-400">
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
        <div className="rounded-xl p-3 mb-3"
          style={{
            background: 'rgba(17,24,39,0.55)',
            border: '1px solid #1e2736',
          }}>
          <div className="text-xs text-gray-500 font-mono tracking-widest mb-2">AMMUNITION</div>
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
                <div key={sys} className="flex items-center gap-2 px-3 py-1.5 rounded border"
                  style={{ background: 'rgba(17,24,39,0.5)', borderColor: '#1e2736' }}>
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
        <div className="flex justify-center">
          <button
            onClick={onReady}
            className="px-7 py-2.5 font-mono text-xs font-bold tracking-[0.15em] rounded-lg
              cursor-pointer transition-all active:scale-95
              hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
            style={{
              background: 'rgba(22,101,52,0.25)',
              border: '1px solid #15803d',
              color: '#4ade80',
            }}
          >
            BEGIN LEVEL {config.id} ▸
          </button>
        </div>
      </div>
    </div>
  );
}
