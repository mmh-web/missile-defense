export default function ScoringIntro({ onContinue }) {
  const basePath = import.meta.env.BASE_URL || '/missile-defense/';

  const rules = [
    { points: '+100', pointsClass: 'text-green-400', label: 'Correct intercept', desc: 'right system on a populated target' },
    { points: '+25×', pointsClass: 'text-yellow-400', label: 'Streak bonus', desc: 'consecutive correct decisions multiply your score' },
    { points: 'FREE', pointsClass: 'text-green-400', label: 'Hold fire on open ground', desc: 'builds streak, saves interceptors' },
    { points: '−100', pointsClass: 'text-red-400', label: 'City hit', desc: 'siren sounds, streak resets, points deducted' },
    { points: 'RESET', pointsClass: 'text-red-400', label: 'Wasted interceptor', desc: 'firing at open ground resets your streak' },
  ];

  return (
    <div className="h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: '#0a0e1a' }}>
      {/* Background photo */}
      <div className="absolute inset-0"
        style={{ background: `url('${basePath}images/ID4.jpeg') center center / cover no-repeat` }} />
      <div className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            rgba(10,14,26,0.5) 0%,
            rgba(10,14,26,0.65) 30%,
            rgba(10,14,26,0.85) 60%,
            #0a0e1a 100%
          )`,
        }} />

      <div className="relative z-10 w-full max-w-[520px] h-screen flex flex-col px-6">
        {/* Header */}
        <div className="text-center pt-4 pb-2 flex-shrink-0">
          <h1 className="font-mono text-lg font-black tracking-[0.2em]"
            style={{ color: '#f97316', textShadow: '0 0 30px rgba(249,115,22,0.3)' }}>
            HOW SCORING WORKS
          </h1>
          <div className="font-mono text-[10px] tracking-[0.15em]"
            style={{ color: 'rgba(249,115,22,0.44)' }}>
            MISSION BRIEFING · תדריך ניקוד
          </div>
        </div>

        {/* Score rule cards */}
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          {rules.map((rule) => (
            <div key={rule.label}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
              style={{
                background: 'rgba(17,24,39,0.55)',
                border: '1px solid #1e2736',
              }}>
              <div className={`font-mono text-lg font-black min-w-[50px] text-right flex-shrink-0 ${rule.pointsClass}`}>
                {rule.points}
              </div>
              <div className="w-px h-7 flex-shrink-0" style={{ background: '#374151' }} />
              <div className="font-mono text-xs text-gray-400 leading-snug">
                <strong className="text-gray-200">{rule.label}</strong> — {rule.desc}
              </div>
            </div>
          ))}

          {/* Key insight callout */}
          <div className="px-3.5 py-3 rounded-xl mt-0.5"
            style={{
              background: 'rgba(249,115,22,0.06)',
              border: '1px solid rgba(249,115,22,0.12)',
            }}>
            <div className="font-mono text-[9px] tracking-[0.25em] mb-1"
              style={{ color: 'rgba(249,115,22,0.44)' }}>
              KEY INSIGHT
            </div>
            <div className="font-mono text-[13px] text-gray-300 leading-relaxed">
              Real Iron Dome operators face this same dilemma — <strong style={{ color: '#f97316' }}>fire at everything</strong> and run out of interceptors, or <strong style={{ color: '#f97316' }}>hold fire</strong> on threats aimed at open ground and save ammo for what matters.
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="py-3 flex-shrink-0">
          <div className="flex justify-center">
            <button
              onClick={onContinue}
              className="px-7 py-2.5 font-mono text-xs font-bold tracking-[0.15em] rounded-lg
                cursor-pointer transition-all active:scale-95
                hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
              style={{
                background: 'rgba(22,101,52,0.25)',
                border: '1px solid #15803d',
                color: '#4ade80',
              }}
            >
              UNDERSTOOD ▸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
