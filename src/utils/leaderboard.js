// ============================================================
// MISSILE DEFENSE — Persistent Leaderboard (localStorage)
// ============================================================

const STORAGE_KEY = 'missile-defense-leaderboard';
const MAX_ENTRIES = 10;

/**
 * Get the full leaderboard from localStorage.
 * Returns an object keyed by game mode.
 */
function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { CAMPAIGN: [] };
    const parsed = JSON.parse(raw);
    return {
      CAMPAIGN: Array.isArray(parsed.CAMPAIGN) ? parsed.CAMPAIGN : [],
      // Preserve old entries in case they exist
      SHORT: Array.isArray(parsed.SHORT) ? parsed.SHORT : [],
      FULL: Array.isArray(parsed.FULL) ? parsed.FULL : [],
    };
  } catch {
    return { CAMPAIGN: [] };
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/**
 * Get the leaderboard for a specific game mode, sorted by score desc.
 * @param {string} gameMode - 'CAMPAIGN' (or legacy 'SHORT'/'FULL')
 * @returns {Array} Top entries (max 10)
 */
export function getLeaderboard(gameMode = 'CAMPAIGN') {
  const all = getAll();
  return (all[gameMode] || [])
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
}

/**
 * Save a score entry to the leaderboard.
 * Keeps only top 10 per mode.
 * @param {Object} entry
 */
export function saveScore(entry) {
  const all = getAll();
  const mode = entry.gameMode || 'CAMPAIGN';

  const newEntry = {
    name: (entry.name || 'AAA').toUpperCase().slice(0, 3),
    score: entry.score || 0,
    stars: entry.stars || 0,
    rating: entry.rating || '',
    gameMode: mode,
    levelsCompleted: entry.levelsCompleted || 0,
    correctIntercepts: entry.correctIntercepts || 0,
    sirenCount: entry.sirenCount || 0,
    bestStreak: entry.bestStreak || 0,
    timestamp: Date.now(),
  };

  if (!all[mode]) all[mode] = [];
  all[mode].push(newEntry);
  all[mode].sort((a, b) => b.score - a.score);
  all[mode] = all[mode].slice(0, MAX_ENTRIES);

  saveAll(all);
  return newEntry;
}

/**
 * Check if a score would make the top 10 for a game mode.
 * @param {number} score
 * @param {string} gameMode
 * @returns {boolean}
 */
export function isHighScore(score, gameMode = 'CAMPAIGN') {
  const board = getLeaderboard(gameMode);
  if (board.length < MAX_ENTRIES) return true;
  return score > board[board.length - 1].score;
}
