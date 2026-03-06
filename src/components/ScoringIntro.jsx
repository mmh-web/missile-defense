export default function ScoringIntro({ onContinue }) {
  const rows = [
    {
      icon: '🎯',
      label: 'THREAT INTERCEPTS',
      points: '+100',
      desc: 'Correctly match the right defense system to each incoming threat',
      color: 'text-green-400',
    },
    {
      icon: '🧠',
      label: 'INTEL BONUS',
      points: '+250',
      desc: 'Answer quiz questions during the briefing — 2 per level, 250 pts each',
      color: 'text-cyan-400',
    },
    {
      icon: '🚀',
      label: 'INTERCEPTORS SAVED',
      points: '+250',
      desc: 'Every unused interceptor at end of level earns bonus points',
      color: 'text-cyan-400',
    },
    {
      icon: '🔥',
      label: 'BEST STREAK',
      points: '+25',
      desc: 'Consecutive correct intercepts without a miss — the longer, the better',
      color: 'text-yellow-400',
    },
    {
      icon: '🚨',
      label: 'CITY HIT',
      points: '−100',
      desc: 'Threats that reach a populated area cost you points',
      color: 'text-red-400',
    },
  ];

  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center overflow-y-auto">
      <div className="max-w-2xl w-full py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-mono text-xs tracking-[0.4em] text-gray-500 mb-2">
            CAMPAIGN OVERVIEW
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-wider text-green-400 mb-2">
            HOW SCORING WORKS
          </h1>
          <div className="h-px w-48 mx-auto bg-green-900" />
        </div>

        {/* Scoring rows */}
        <div className="space-y-3 mb-8">
          {rows.map((row) => (
            <div
              key={row.label}
              className="border border-gray-800/50 rounded-lg p-4 bg-gray-900/20
                flex items-start gap-4"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{row.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="font-mono text-sm font-bold text-gray-200 tracking-wider">
                    {row.label}
                  </span>
                  <span className={`font-mono text-sm font-bold ${row.color} flex-shrink-0`}>
                    {row.points}
                  </span>
                </div>
                <p className="font-mono text-xs text-gray-500 leading-relaxed">
                  {row.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="border border-cyan-900/40 rounded-lg p-4 mb-8 bg-cyan-950/10 text-center">
          <p className="font-mono text-xs text-cyan-400/80 tracking-wide leading-relaxed">
            <span className="text-cyan-300 font-bold">TIP:</span>{' '}
            Pay attention during briefings — intel quiz answers are worth big points.
            Skipping the briefing forfeits your quiz bonus.
          </p>
        </div>

        {/* Continue button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="px-12 py-4 bg-green-900/30 border-2 border-green-500 text-green-400
              font-mono font-bold text-lg tracking-widest rounded-lg
              hover:bg-green-900/50 hover:border-green-300 hover:text-green-300
              hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
              transition-all active:scale-95 cursor-pointer"
          >
            CONTINUE &#8594;
          </button>
        </div>
      </div>
    </div>
  );
}
