// ============================================================
// MISSILE DEFENSE — Background Music Player
// ============================================================
// Plays level-specific MP3 tracks during active gameplay.
// Supports fade-in/fade-out, volume control, and per-level tracks.
//
// Track naming convention (place in public/sounds/):
//   music-level-1.mp3, music-level-2.mp3, ... music-level-7.mp3
//
// If a level-specific track doesn't exist, falls back to
// music-default.mp3. If that's also missing, no music plays.
// ============================================================

const FADE_DURATION = 1.5; // seconds for fade in/out
const FADE_STEP = 50; // ms between volume steps

let currentAudio = null;
let currentLevel = null;
let targetVolume = 0.3;
let fadeInterval = null;
let enabled = true;

function getTrackUrl(level) {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}sounds/music-level-${level}.mp3`;
}

function getDefaultTrackUrl() {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}sounds/music-default.mp3`;
}

function clearFade() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
}

function fadeIn(audio, target, duration = FADE_DURATION) {
  clearFade();
  audio.volume = 0;
  const steps = (duration * 1000) / FADE_STEP;
  const increment = target / steps;
  let current = 0;
  fadeInterval = setInterval(() => {
    current += increment;
    if (current >= target) {
      audio.volume = target;
      clearFade();
    } else {
      audio.volume = current;
    }
  }, FADE_STEP);
}

function fadeOut(audio, duration = FADE_DURATION) {
  return new Promise((resolve) => {
    clearFade();
    if (!audio || audio.paused) { resolve(); return; }
    const startVol = audio.volume;
    const steps = (duration * 1000) / FADE_STEP;
    const decrement = startVol / steps;
    let current = startVol;
    fadeInterval = setInterval(() => {
      current -= decrement;
      if (current <= 0) {
        audio.volume = 0;
        audio.pause();
        clearFade();
        resolve();
      } else {
        audio.volume = current;
      }
    }, FADE_STEP);
  });
}

/**
 * Start playing music for a given level.
 * If music is already playing for this level, does nothing.
 * If a different level's music is playing, crossfades.
 */
export async function startMusic(level, volume = 0.3) {
  targetVolume = volume;
  if (!enabled) return;

  // Already playing this level's track
  if (currentAudio && currentLevel === level && !currentAudio.paused) {
    currentAudio.volume = targetVolume;
    return;
  }

  // Fade out current track if switching levels
  if (currentAudio && !currentAudio.paused) {
    await fadeOut(currentAudio, 0.8);
    currentAudio.src = '';
    currentAudio = null;
  }

  // Try level-specific track, fall back to default
  const audio = new Audio();
  audio.loop = true;
  audio.volume = 0;

  const levelUrl = getTrackUrl(level);
  const defaultUrl = getDefaultTrackUrl();

  try {
    audio.src = levelUrl;
    await audio.play();
  } catch {
    // Level-specific track failed, try default
    try {
      audio.src = defaultUrl;
      await audio.play();
    } catch {
      // No music available — that's fine
      return;
    }
  }

  currentAudio = audio;
  currentLevel = level;
  fadeIn(audio, targetVolume);
}

/**
 * Stop music with a fade-out.
 */
export async function stopMusic() {
  if (currentAudio) {
    await fadeOut(currentAudio);
    currentAudio.src = '';
    currentAudio = null;
    currentLevel = null;
  }
}

/**
 * Pause music (e.g., when game is paused). Keeps state for resume.
 */
export function pauseMusic() {
  clearFade();
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
  }
}

/**
 * Resume music after pause.
 */
export function resumeMusic() {
  if (!enabled) return;
  if (currentAudio && currentAudio.paused && currentAudio.src) {
    currentAudio.volume = targetVolume;
    currentAudio.play().catch(() => {});
  }
}

/**
 * Set music volume (0-1). Respects the global volume slider.
 */
export function setMusicVolume(vol) {
  targetVolume = vol;
  clearFade();
  if (currentAudio && !currentAudio.paused) {
    currentAudio.volume = vol;
  }
}

/**
 * Enable/disable music. Returns new enabled state.
 */
export function toggleMusicEnabled() {
  enabled = !enabled;
  if (!enabled) {
    stopMusic();
  }
  return enabled;
}

/**
 * Check if music is enabled.
 */
export function isMusicEnabled() {
  return enabled;
}
