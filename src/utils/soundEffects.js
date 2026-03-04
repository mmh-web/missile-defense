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
// Ground Impact: Muffled distant thud + crumbling debris
// Duration: ~0.7s — distinct "whump" with dirt/gravel scatter
// Designed to sound NOTHING like launch or intercept sounds:
//   - Uses mid-range (150-400Hz) thud, not sub-bass
//   - Descending "whump" envelope, not ascending whoosh
//   - Granular debris texture, not smooth noise
//   - Reverberant echo tail for distance feel
// -------------------------------------------------------
export function playGroundImpactSound(volume = 0.7) {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Layer 1: Mid-range thud — the "WHUMP" (150Hz → 80Hz, fast attack)
    // Sits in audible range unlike the old sub-bass version
    const thud = ctx.createOscillator();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(150, now);
    thud.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.001, now);
    thudGain.gain.linearRampToValueAtTime(volume * 0.45, now + 0.008); // snappy 8ms attack
    thudGain.gain.exponentialRampToValueAtTime(volume * 0.15, now + 0.06);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    // Lowpass muffle — makes it sound buried/distant
    const thudLPF = ctx.createBiquadFilter();
    thudLPF.type = 'lowpass';
    thudLPF.frequency.value = 350;
    thudLPF.Q.value = 1.0;

    thud.connect(thudLPF);
    thudLPF.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.25);

    // Layer 2: Crumbling debris — granular scattered noise
    // Unlike the smooth noise in launch sounds, this has "chunks"
    const debrisLen = Math.floor(ctx.sampleRate * 0.5);
    const debrisBuf = ctx.createBuffer(1, debrisLen, ctx.sampleRate);
    const debrisData = debrisBuf.getChannelData(0);
    for (let i = 0; i < debrisLen; i++) {
      const t = i / debrisLen;
      // Delayed onset (50ms after impact), then granular decay
      const onset = t < 0.1 ? t / 0.1 : 1;
      const decay = Math.pow(1 - t, 3);
      // Granular texture — random amplitude modulation for "chunks of dirt"
      const grain = Math.random() < 0.15 ? (Math.random() * 1.5 + 0.5) : 0.3;
      debrisData[i] = (Math.random() * 2 - 1) * onset * decay * grain * 0.5;
    }
    const debris = ctx.createBufferSource();
    debris.buffer = debrisBuf;

    // Bandpass centered at 1200Hz — gritty gravel/dirt texture
    // Much higher than launch sounds (which use 800Hz or lower)
    const debrisBPF = ctx.createBiquadFilter();
    debrisBPF.type = 'bandpass';
    debrisBPF.frequency.setValueAtTime(1800, now);
    debrisBPF.frequency.exponentialRampToValueAtTime(600, now + 0.4);
    debrisBPF.Q.value = 0.8;

    const debrisGain = ctx.createGain();
    debrisGain.gain.setValueAtTime(0.001, now);
    debrisGain.gain.linearRampToValueAtTime(volume * 0.22, now + 0.06);
    debrisGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    debris.connect(debrisBPF);
    debrisBPF.connect(debrisGain);
    debrisGain.connect(ctx.destination);
    debris.start(now);
    debris.stop(now + 0.5);

    // Layer 3: Echo tail — reverberant "thoom" that fades (200Hz → 100Hz)
    // Delayed 80ms to simulate sound bouncing off terrain
    const echo = ctx.createOscillator();
    echo.type = 'triangle';
    echo.frequency.setValueAtTime(200, now + 0.08);
    echo.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    const echoGain = ctx.createGain();
    echoGain.gain.setValueAtTime(0.001, now);
    echoGain.gain.linearRampToValueAtTime(volume * 0.12, now + 0.1);
    echoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    // Lowpass to keep it muffled and distant
    const echoLPF = ctx.createBiquadFilter();
    echoLPF.type = 'lowpass';
    echoLPF.frequency.value = 400;

    echo.connect(echoLPF);
    echoLPF.connect(echoGain);
    echoGain.connect(ctx.destination);
    echo.start(now + 0.08);
    echo.stop(now + 0.7);
  } catch (e) {
    // Silently fail
  }
}

// -------------------------------------------------------
// Shield Bounce: Hollow "bonk" + metallic ring when threat deflects off turtle shell
// Duration: ~0.35s — satisfying rubbery bounce with shell resonance
// -------------------------------------------------------
export function playShieldBounceSound(volume = 0.7) {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    // Hollow bonk — descending tone (800Hz → 200Hz, fast)
    const bonk = ctx.createOscillator();
    bonk.type = 'triangle';
    bonk.frequency.setValueAtTime(800, now);
    bonk.frequency.exponentialRampToValueAtTime(200, now + 0.12);

    const bonkGain = ctx.createGain();
    bonkGain.gain.setValueAtTime(volume * 0.7, now);
    bonkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    bonk.connect(bonkGain);
    bonkGain.connect(ctx.destination);
    bonk.start(now);
    bonk.stop(now + 0.15);

    // Shell resonance — ringing overtone (1200Hz → 600Hz)
    const ring = ctx.createOscillator();
    ring.type = 'sine';
    ring.frequency.setValueAtTime(1200, now);
    ring.frequency.exponentialRampToValueAtTime(600, now + 0.3);

    const ringGain = ctx.createGain();
    ringGain.gain.setValueAtTime(volume * 0.3, now + 0.02);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    ring.connect(ringGain);
    ringGain.connect(ctx.destination);
    ring.start(now + 0.02);
    ring.stop(now + 0.3);

    // Bouncy spring overtone (ascending 400Hz → 900Hz, quick)
    const spring = ctx.createOscillator();
    spring.type = 'sine';
    spring.frequency.setValueAtTime(400, now);
    spring.frequency.exponentialRampToValueAtTime(900, now + 0.08);

    const springGain = ctx.createGain();
    springGain.gain.setValueAtTime(volume * 0.25, now);
    springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    spring.connect(springGain);
    springGain.connect(ctx.destination);
    spring.start(now);
    spring.stop(now + 0.1);

    // Short noise tap — the "hit" texture
    const bufferSize = Math.floor(ctx.sampleRate * 0.03);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 2;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.05);
  } catch (e) {
    // Silently fail
  }
}

// -------------------------------------------------------
// Launch: Interceptor-specific launch sounds
// Each defense system has a distinct audio signature
// -------------------------------------------------------
export function playLaunchSound(volume = 0.7, systemKey = 'iron_dome') {
  try {
    const ctx = getContext();
    const now = ctx.currentTime;

    if (systemKey === 'iron_dome') {
      // Iron Dome — short, sharp whoosh (small Tamir missile)
      // Quick ascending sine + crisp noise burst
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
      const oscG = ctx.createGain();
      oscG.gain.setValueAtTime(volume * 0.3, now);
      oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(oscG); oscG.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.15);

      // Crisp high-frequency pop
      const bufLen = Math.floor(ctx.sampleRate * 0.06);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 4000;
      const nG = ctx.createGain();
      nG.gain.setValueAtTime(volume * 0.2, now);
      nG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      ns.connect(hp); hp.connect(nG); nG.connect(ctx.destination);
      ns.start(now); ns.stop(now + 0.08);

    } else if (systemKey === 'davids_sling') {
      // David's Sling — deeper, more powerful launch with sustained burn
      // Mid-frequency rising tone + rumbling noise
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
      const oscG = ctx.createGain();
      oscG.gain.setValueAtTime(volume * 0.2, now);
      oscG.gain.linearRampToValueAtTime(volume * 0.25, now + 0.08);
      oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(oscG); oscG.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.28);

      // Sub-bass thump on ignition
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(80, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      const subG = ctx.createGain();
      subG.gain.setValueAtTime(volume * 0.35, now);
      subG.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      sub.connect(subG); subG.connect(ctx.destination);
      sub.start(now); sub.stop(now + 0.18);

      // Broadband noise for rocket plume texture
      const bufLen = Math.floor(ctx.sampleRate * 0.2);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufLen) * 0.8;
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.5;
      const nG = ctx.createGain();
      nG.gain.setValueAtTime(volume * 0.15, now);
      nG.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      ns.connect(bp); bp.connect(nG); nG.connect(ctx.destination);
      ns.start(now); ns.stop(now + 0.22);

    } else if (systemKey === 'arrow_2') {
      // Arrow 2 — heavy, booming thrust with atmospheric rumble
      // Low powerful ignition + ascending roar
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.35);
      const oscG = ctx.createGain();
      oscG.gain.setValueAtTime(volume * 0.15, now);
      oscG.gain.linearRampToValueAtTime(volume * 0.22, now + 0.1);
      oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(oscG); oscG.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.38);

      // Deep boom on ignition
      const boom = ctx.createOscillator();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(60, now);
      boom.frequency.exponentialRampToValueAtTime(25, now + 0.2);
      const boomG = ctx.createGain();
      boomG.gain.setValueAtTime(volume * 0.4, now);
      boomG.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      boom.connect(boomG); boomG.connect(ctx.destination);
      boom.start(now); boom.stop(now + 0.25);

      // Rumbling noise — atmosphere shaking
      const bufLen = Math.floor(ctx.sampleRate * 0.3);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 0.5);
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2000;
      const nG = ctx.createGain();
      nG.gain.setValueAtTime(volume * 0.2, now);
      nG.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      ns.connect(lp); lp.connect(nG); nG.connect(ctx.destination);
      ns.start(now); ns.stop(now + 0.3);

    } else if (systemKey === 'arrow_3') {
      // Arrow 3 — intense, high-pitched rocket with space-bound ascending tone
      // Multi-stage: ignition thump → powerful ascending shriek → fading into space
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(2000, now + 0.4);
      const oscG = ctx.createGain();
      oscG.gain.setValueAtTime(volume * 0.1, now);
      oscG.gain.linearRampToValueAtTime(volume * 0.18, now + 0.05);
      oscG.gain.linearRampToValueAtTime(volume * 0.12, now + 0.2);
      oscG.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(oscG); oscG.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.45);

      // Deep ignition thump
      const boom = ctx.createOscillator();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(50, now);
      boom.frequency.exponentialRampToValueAtTime(20, now + 0.15);
      const boomG = ctx.createGain();
      boomG.gain.setValueAtTime(volume * 0.45, now);
      boomG.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      boom.connect(boomG); boomG.connect(ctx.destination);
      boom.start(now); boom.stop(now + 0.2);

      // High-frequency ascending whistle — leaving atmosphere
      const whistle = ctx.createOscillator();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(800, now + 0.1);
      whistle.frequency.exponentialRampToValueAtTime(4000, now + 0.4);
      const whistleG = ctx.createGain();
      whistleG.gain.setValueAtTime(0.001, now);
      whistleG.gain.linearRampToValueAtTime(volume * 0.1, now + 0.15);
      whistleG.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      whistle.connect(whistleG); whistleG.connect(ctx.destination);
      whistle.start(now + 0.1); whistle.stop(now + 0.42);

      // Intense broadband noise — rocket plume
      const bufLen = Math.floor(ctx.sampleRate * 0.35);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 0.3);
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 800; bp.Q.value = 0.3;
      const nG = ctx.createGain();
      nG.gain.setValueAtTime(volume * 0.2, now);
      nG.gain.linearRampToValueAtTime(volume * 0.15, now + 0.15);
      nG.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      ns.connect(bp); bp.connect(nG); nG.connect(ctx.destination);
      ns.start(now); ns.stop(now + 0.35);
    }
  } catch (e) {
    // Silently fail
  }
}
