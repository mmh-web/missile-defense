export default function TzevaAdom({ timeLeft }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center tzeva-adom-overlay">
      <div className="absolute inset-0 bg-red-900/90 animate-pulse" />
      <div className="relative z-10 text-center">
        <div className="text-6xl md:text-8xl font-bold text-white mb-4 font-mono tracking-wider drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          TZEVA ADOM
        </div>
        <div className="text-3xl md:text-5xl font-bold text-white/90 mb-2 font-mono">
          RED ALERT
        </div>
        <div className="text-4xl md:text-6xl font-bold text-white mt-8 mb-4 font-mono animate-bounce">
          TAKE COVER
        </div>
        <div className="text-5xl md:text-7xl font-bold text-white font-mono tabular-nums mt-8">
          {Math.ceil(timeLeft)}
        </div>
        <div className="text-sm text-white/60 font-mono mt-4 tracking-widest">
          ALL SYSTEMS PAUSED
        </div>
      </div>

      {/* Flashing red border */}
      <div className="absolute inset-0 border-[8px] border-red-500 animate-pulse pointer-events-none" />

      {/* Corner warning triangles */}
      {[
        'top-4 left-4',
        'top-4 right-4',
        'bottom-4 left-4',
        'bottom-4 right-4',
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} text-4xl animate-pulse`}
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
            &#9888;
          </span>
        </div>
      ))}
    </div>
  );
}
