export default function ScoringIntro({ onContinue }) {
  const basePath = import.meta.env.BASE_URL || '/missile-defense/';

  const rules = [
    { points: '+100', pointsClass: 'text-green-400', label: 'Correct intercept', desc: 'right system on a populated target' },
    { points: '+25×', pointsClass: 'text-yellow-400', label: 'Streak bonus', desc: 'consecutive correct decisions multiply your score' },
    { points: '+50', pointsClass: 'text-cyan-400', label: 'Double intercept', desc: 'two correct intercepts within 2 seconds' },
    { points: '+250', pointsClass: 'text-cyan-400', label: 'Quiz bonus', desc: 'per correct answer in readiness checks' },
    { points: '+250', pointsClass: 'text-blue-400', label: 'Ammo bonus', desc: 'per unused interceptor at level end' },
    { points: '−100', pointsClass: 'text-red-400', label: 'City hit', desc: 'siren sounds, streak resets, points deducted' },
  ];

  const accentColor = '#f97316';

  return (
    <div
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 100%, ${accentColor}18 0%, transparent 50%),
          radial-gradient(ellipse at 0% 0%, ${accentColor}10 0%, transparent 40%),
          radial-gradient(ellipse at 100% 50%, ${accentColor}08 0%, transparent 35%),
          linear-gradient(180deg, #0a0e1a 0%, #080c17 100%)
        `,
      }}
    >
      {/* Background photo with heavy overlay — cinematic but not distracting */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `url('${basePath}images/ID4.jpeg') center center / cover no-repeat` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom,
            rgba(10,14,26,0.45) 0%,
            rgba(10,14,26,0.6) 25%,
            rgba(10,14,26,0.85) 55%,
            #0a0e1a 100%
          )`,
        }} />

      {/* Accent glow bar at top — matches briefing */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }}
      />

      {/* Corner accent — matches briefing classification stamp */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10">
        <div
          className="font-mono text-[9px] tracking-[0.4em] px-2 py-0.5 rounded border"
          style={{
            color: `${accentColor}70`,
            borderColor: `${accentColor}35`,
            background: `${accentColor}12`,
          }}
        >
          SCORING RULES
        </div>
      </div>

      {/* Centered content block */}
      <div className="relative z-10 max-w-2xl w-full mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-xl lg:text-2xl font-bold font-mono tracking-wider"
            style={{ color: accentColor }}>
            HOW SCORING WORKS
          </h1>
          <div className="flex items-baseline justify-center gap-2 mt-0.5">
            <span className="text-xs lg:text-sm font-mono tracking-widest"
              style={{ color: `${accentColor}90` }}>
              MISSION BRIEFING
            </span>
            <span className="text-xs lg:text-sm font-bold"
              style={{ fontFamily: 'Arial, sans-serif', color: `${accentColor}70` }}>
              תדריך ניקוד
            </span>
          </div>
        </div>
          {/* Score rule cards — matches briefing fact card styling */}
          <div className="flex flex-col gap-1.5">
            {rules.map((rule) => (
              <div key={rule.label}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/55 border border-gray-800/80">
                <div className={`font-mono text-base font-black min-w-[48px] text-right flex-shrink-0 ${rule.pointsClass}`}>
                  {rule.points}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono font-bold text-sm tracking-wide" style={{ color: rule.pointsClass.includes('green') ? '#4ade80' : rule.pointsClass.includes('yellow') ? '#eab308' : rule.pointsClass.includes('cyan') ? '#22d3ee' : rule.pointsClass.includes('blue') ? '#60a5fa' : '#ef4444' }}>
                    {rule.label}
                  </span>
                  <span className="text-[13px] font-mono text-gray-400 ml-2">{rule.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Continue button — flows after content, same as briefing CONTINUE */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={onContinue}
              className="px-8 py-2.5 bg-green-900/30 border border-green-700 text-green-400
                font-mono text-sm tracking-widest rounded-lg
                hover:bg-green-900/50 hover:border-green-400
                transition-all active:scale-95 cursor-pointer"
            >
              UNDERSTOOD ▸
            </button>
          </div>
      </div>
    </div>
  );
}
