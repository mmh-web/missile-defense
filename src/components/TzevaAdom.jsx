export default function TzevaAdom({ city }) {
  return (
    <div className="fixed inset-0 z-30 pointer-events-none tzeva-adom-flash">
      {/* Translucent red overlay — player sees through it */}
      <div className="absolute inset-0 bg-red-900/40" />

      {/* Flashing red border */}
      <div className="absolute inset-0 border-[6px] border-red-500/60" />

      {/* Alert text */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-white font-mono tracking-[0.3em] drop-shadow-[0_0_40px_rgba(255,0,0,0.8)]">
            TZEVA ADOM
          </div>
          <div className="text-3xl md:text-5xl font-bold text-white/80 font-mono tracking-widest mt-2">
            RED ALERT
          </div>
          {city && (
            <div className="text-xl md:text-2xl font-bold text-red-300/90 font-mono tracking-wider mt-4 animate-pulse">
              {city} HIT
            </div>
          )}
        </div>
      </div>

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
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          <span className="text-red-500/80 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
            &#9888;
          </span>
        </div>
      ))}
    </div>
  );
}
