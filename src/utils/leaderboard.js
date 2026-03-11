// ============================================================
// MISSILE DEFENSE — Shared Leaderboard (Firestore + localStorage fallback)
// ============================================================
import { db } from './firebase.js';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

const STORAGE_KEY = 'missile-defense-leaderboard';
const MAX_ENTRIES = 10;
const COLLECTION = 'scores';

// ── localStorage helpers (fallback) ──────────────────────────

function getLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { CAMPAIGN: [] };
    const parsed = JSON.parse(raw);
    return {
      CAMPAIGN: Array.isArray(parsed.CAMPAIGN) ? parsed.CAMPAIGN : [],
      SHORT: Array.isArray(parsed.SHORT) ? parsed.SHORT : [],
      FULL: Array.isArray(parsed.FULL) ? parsed.FULL : [],
    };
  } catch {
    return { CAMPAIGN: [] };
  }
}

function saveLocal(entry) {
  try {
    const all = getLocal();
    const mode = entry.gameMode || 'CAMPAIGN';
    if (!all[mode]) all[mode] = [];
    all[mode].push(entry);
    all[mode].sort((a, b) => b.score - a.score);
    all[mode] = all[mode].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage full or unavailable
  }
}

function getLocalLeaderboard(gameMode = 'CAMPAIGN') {
  const all = getLocal();
  return (all[gameMode] || [])
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
}

// ── Firestore functions ──────────────────────────────────────

/**
 * Save a score to Firestore AND localStorage.
 * Returns the entry object (with timestamp).
 */
export async function saveScore(entry) {
  const mode = entry.gameMode || 'CAMPAIGN';
  const newEntry = {
    name: (entry.name || 'AAA').toUpperCase().slice(0, 10),
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

  // Always save locally as fallback
  saveLocal(newEntry);

  // Try to save to Firestore
  try {
    await addDoc(collection(db, COLLECTION), newEntry);
  } catch (err) {
    console.warn('Firestore save failed, score saved locally only:', err.message);
  }

  return newEntry;
}

/**
 * Get the leaderboard for a game mode from Firestore.
 * Falls back to localStorage if Firestore is unavailable.
 * @returns {Promise<Array>}
 */
export async function getLeaderboard(gameMode = 'CAMPAIGN') {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('score', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const entries = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.gameMode === gameMode) entries.push(data);
    });
    return entries.slice(0, MAX_ENTRIES);
  } catch (err) {
    console.warn('Firestore read failed, using local leaderboard:', err.message);
    return getLocalLeaderboard(gameMode);
  }
}

/**
 * Subscribe to real-time leaderboard updates.
 * Calls `callback(entries)` whenever the leaderboard changes.
 * Returns an unsubscribe function.
 */
export function subscribeLeaderboard(gameMode, callback) {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('score', 'desc'),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const entries = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.gameMode === gameMode) entries.push(data);
      });
      callback(entries.slice(0, MAX_ENTRIES));
    }, (err) => {
      console.warn('Firestore subscription failed:', err.message);
      callback(getLocalLeaderboard(gameMode));
    });
  } catch (err) {
    console.warn('Firestore subscription setup failed:', err.message);
    callback(getLocalLeaderboard(gameMode));
    return () => {}; // noop unsubscribe
  }
}

/**
 * Check if a score would make the top 10 (uses localStorage for instant check).
 */
export function isHighScore(score, gameMode = 'CAMPAIGN') {
  const board = getLocalLeaderboard(gameMode);
  if (board.length < MAX_ENTRIES) return true;
  return score > board[board.length - 1].score;
}
