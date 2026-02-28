// ============================================================
// MISSILE DEFENSE — Web Audio API Sound Effects
// ============================================================
// Synthesized impact sounds for interceptions, city hits,
// ground impacts, and interceptor launches.
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
// Interception: Sharp crack + satisfying pop + zing
// Duration: ~0.25s
// -------------------------------------------------------
export function playInterceptSound(volume = 0.7) {
  try {
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
  } catch (e) {
    // Silently fail if Web Audio not available
  }
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
