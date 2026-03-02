// ============================================================
// MISSILE DEFENSE — Web Audio API Sound Effects
// ============================================================
// Synthesized impact sounds for interceptions, city hits,
// ground impacts, and interceptor launches.
// Each threat type has a distinct intercept sound signature.
// No external audio files needed.
// ============================================================

let audioCtx = null;

function getContext() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// -------------------------------------------------------
// Interception: Type-specific sounds
// Dispatches to different sound signatures per threat type
// -------------------------------------------------------
export function playInterceptSound(volume = 0.7, threatType = 'rocket') {
  try {
    switch (threatType) {
      case 'cruise':     return playInterceptCruise(volume);
      case 'ballistic':  return playInterceptBallistic(volume);
      case 'hypersonic': return playInterceptHypersonic(volume);
      default:           return playInterceptIronDome(volume); // drone + rocket
    }
  } catch (e) {
    // Silently fail if Web Audio not available
  }
}

// -------------------------------------------------------
// Iron Dome Intercept (Drone/Rocket): Sharp crack + pop + zing
// Duration: ~0.25s — quick and snappy for small threats
// -------------------------------------------------------
function playInterceptIronDome(volume) {
  const ctx = getContext();
  const now = ctx.currentTime;

  // White noise burst (60ms) — the "crack"
  const bufferSize = Math.floor(ctx.sampleRate * 0.06);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 1.0, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.18);

  // Tonal pop (descending ~400Hz → 100Hz)
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(volume * 0.6, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);

  // High-frequency zing overtone (1200Hz → 600Hz, 0.1s)
  const zing = ctx.createOscillator();
  zing.type = 'sine';
  zing.frequency.setValueAtTime(1200, now);
  zing.frequency.exponentialRampToValueAtTime(600, now + 0.1);

  const zingGain = ctx.createGain();
  zingGain.gain.setValueAtTime(volume * 0.25, now);
  zingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  zing.connect(zingGain);
  zingGain.connect(ctx.destination);
  zing.start(now);
  zing.stop(now + 0.1);
}

// -------------------------------------------------------
// David's Sling Intercept (Cruise): Deep resonant boom + metallic ring
// Duration: ~0.4s — heavier and more resonant than Iron Dome
// -------------------------------------------------------
function playInterceptCruise(volume) {
  const ctx = getContext();
  const now = ctx.currentTime;

  // Deep bass impact (sawtooth 250Hz → 60Hz)
  const bass = ctx.createOscillator();
  bass.type = 'sawtooth';
  bass.frequency.setValueAtTime(250, now);
  bass.frequency.exponentialRampToValueAtTime(60, now + 0.35);

  const bassGain = ctx.createGain();
  bassGain.gain.setValueAtTime(volume * 0.7, now);
  bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  bass.connect(bassGain);
  bassGain.connect(ctx.destination);
  bass.start(now);
  bass.stop(now + 0.4);

  // Metallic ring (triangle wave 800Hz → 400Hz, slow decay)
  const ring = ctx.createOscillator();
  ring.type = 'triangle';
  ring.frequency.setValueAtTime(800, now);
  ring.frequency.exponentialRampToValueAtTime(400, now + 0.35);

  const ringGain = ctx.createGain();
  ringGain.gain.setValueAtTime(volume * 0.35, now);
  ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  ring.connect(ringGain);
  ringGain.connect(ctx.destination);
  ring.start(now);
  ring.stop(now + 0.35);

  // Noise burst (wider bandwidth, longer than Iron Dome)
  const bufferSize = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.7);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  filter.Q.value = 0.8;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.6, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.25);
}

// -------------------------------------------------------
// Arrow 2 Intercept (Ballistic): Massive boom + shockwave rumble
// Duration: ~0.6s — heavy, powerful, low-frequency dominant
// -------------------------------------------------------
function playInterceptBallistic(volume) {
  const ctx = getContext();
  const now = ctx.currentTime;

  // Primary detonation — deep sine sweep (180Hz → 30Hz)
  const det = ctx.createOscillator();
  det.type = 'sine';
  det.frequency.setValueAtTime(180, now);
  det.frequency.exponentialRampToValueAtTime(30, now + 0.5);

  const detGain = ctx.createGain();
  detGain.gain.setValueAtTime(volume * 0.9, now);
  detGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  det.connect(detGain);
  detGain.connect(ctx.destination);
  det.start(now);
  det.stop(now + 0.6);

  // Shockwave rumble (sawtooth 100Hz → 20Hz, slowly decaying)
  const rumble = ctx.createOscillator();
  rumble.type = 'sawtooth';
  rumble.frequency.setValueAtTime(100, now + 0.05);
  rumble.frequency.exponentialRampToValueAtTime(20, now + 0.5);

  const rumbleGain = ctx.createGain();
  rumbleGain.gain.setValueAtTime(0.001, now);
  rumbleGain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.05);
  rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

  rumble.connect(rumbleGain);
  rumbleGain.connect(ctx.destination);
  rumble.start(now);
  rumble.stop(now + 0.55);

  // Heavy noise burst (low-pass filtered, long)
  const bufferSize = Math.floor(ctx.sampleRate * 0.3);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.4);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.7, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.4);

  // Sub-bass thump (40Hz pulse)
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = 40;

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(volume * 0.6, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  sub.connect(subGain);
  subGain.connect(ctx.destination);
  sub.start(now);
  sub.stop(now + 0.25);
}

// -------------------------------------------------------
// Arrow 3 Intercept (Hypersonic): Electric crack + harmonic burst + plasma sizzle
// Duration: ~0.5s — unique sci-fi energy signature, unlike any other
// -------------------------------------------------------
function playInterceptHypersonic(volume) {
  const ctx = getContext();
  const now = ctx.currentTime;

  // Electric crack — very fast white noise with sharp bandpass
  const crackSize = Math.floor(ctx.sampleRate * 0.03);
  const crackBuf = ctx.createBuffer(1, crackSize, ctx.sampleRate);
  const crackData = crackBuf.getChannelData(0);
  for (let i = 0; i < crackSize; i++) {
    crackData[i] = (Math.random() * 2 - 1) * (1 - i / crackSize);
  }
  const crack = ctx.createBufferSource();
  crack.buffer = crackBuf;

  const crackFilter = ctx.createBiquadFilter();
  crackFilter.type = 'highpass';
  crackFilter.frequency.value = 4000;

  const crackGain = ctx.createGain();
  crackGain.gain.setValueAtTime(volume * 1.2, now);
  crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  crack.connect(crackFilter);
  crackFilter.connect(crackGain);
  crackGain.connect(ctx.destination);
  crack.start(now);
  crack.stop(now + 0.06);

  // Harmonic burst — three stacked sine oscillators (fundamental + octave + fifth)
  // Creates a distinctive "energy discharge" chord
  [600, 1200, 1800].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.3, now + 0.3);

    const g = ctx.createGain();
    g.gain.setValueAtTime(volume * (0.5 - i * 0.12), now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  });

  // Descending sweep — "energy dissipation" (2000Hz → 200Hz)
  const sweep = ctx.createOscillator();
  sweep.type = 'sawtooth';
  sweep.frequency.setValueAtTime(2000, now);
  sweep.frequency.exponentialRampToValueAtTime(200, now + 0.2);

  const sweepGain = ctx.createGain();
  sweepGain.gain.setValueAtTime(volume * 0.25, now);
  sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  sweep.connect(sweepGain);
  sweepGain.connect(ctx.destination);
  sweep.start(now);
  sweep.stop(now + 0.2);

  // Plasma sizzle — extended high-frequency noise (0.15s, bandpass 3000-6000Hz)
  const sizzleSize = Math.floor(ctx.sampleRate * 0.15);
  const sizzleBuf = ctx.createBuffer(1, sizzleSize, ctx.sampleRate);
  const sizzleData = sizzleBuf.getChannelData(0);
  for (let i = 0; i < sizzleSize; i++) {
    sizzleData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sizzleSize, 1.5);
  }
  const sizzle = ctx.createBufferSource();
  sizzle.buffer = sizzleBuf;

  const sizzleFilter = ctx.createBiquadFilter();
  sizzleFilter.type = 'bandpass';
  sizzleFilter.frequency.value = 4500;
  sizzleFilter.Q.value = 0.5;

  const sizzleGain = ctx.createGain();
  sizzleGain.gain.setValueAtTime(volume * 0.4, now + 0.03);
  sizzleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  sizzle.connect(sizzleFilter);
  sizzleFilter.connect(sizzleGain);
  sizzleGain.connect(ctx.destination);
  sizzle.start(now + 0.03);
  sizzle.stop(now + 0.4);

  // Sub-impact bass (deep thud underneath everything)
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(120, now);
  sub.frequency.exponentialRampToValueAtTime(35, now + 0.3);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(volume * 0.5, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  sub.connect(subGain);
  subGain.connect(ctx.destination);
  sub.start(now);
  sub.stop(now + 0.35);
}

// -------------------------------------------------------
// City Hit: Heavy explosion with low rumble
// Duration: ~0.8s
// -------------------------------------------------------
export function playCityHitSound(volume = 0.7) {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Low frequency rumble (sawtooth 80Hz → 20Hz)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.8);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(volume * 0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);

    // Noise burst (400ms, low-pass filtered)
    const bufferSize = Math.floor(ctx.sampleRate * 0.4);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.5);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.5);

    // Impact thud (sine 60Hz, fast decay)
    const thud = ctx.createOscillator();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(60, now);
    thud.frequency.exponentialRampToValueAtTime(25, now + 0.3);

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(volume * 0.8, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.3);
  } catch (e) {
    // Silently fail
  }
}

// -------------------------------------------------------
// Ground Impact: Audible thud + dust puff
// Duration: ~0.25s
// -------------------------------------------------------
export function playGroundImpactSound(volume = 0.7) {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Main thud (120Hz → 40Hz, extended)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    // Low bass thump (80Hz → 30Hz)
    const bass = ctx.createOscillator();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(80, now);
    bass.frequency.exponentialRampToValueAtTime(30, now + 0.2);

    const bassGain = ctx.createGain();
    bassGain.gain.setValueAtTime(volume * 0.4, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    bass.connect(bassGain);
    bassGain.connect(ctx.destination);
    bass.start(now);
    bass.stop(now + 0.2);

    // Noise puff (louder, longer)
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.12);
  } catch (e) {
    // Silently fail
  }
}

// -------------------------------------------------------
// Launch: Quick ascending whoosh when interceptor fires
// Duration: ~0.2s
// -------------------------------------------------------
export function playLaunchSound(volume = 0.7) {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Ascending whoosh (sine 200Hz → 800Hz)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(volume * 0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);

    // High-pass filtered noise burst for "rocket" texture
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.1);
  } catch (e) {
    // Silently fail
  }
}
