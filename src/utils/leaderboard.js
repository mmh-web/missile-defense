// ============================================================
// MISSILE DEFENSE — Shared Leaderboard (Firestore + localStorage fallback)
// ============================================================
import { db } from './firebase.js';
import { containsProfanity } from './nameFilter.js';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

const STORAGE_KEY = 'missile-defense-leaderboard';
const MAX_ENTRIES = 10;
const COLLECTION = 'scores';

/**
 * Read ?event= param from URL. Returns uppercase string or '' (global).
 */
export function getEventCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('event');
    return code ? code.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20) : '';
  } catch {
    return '';
  }
}

/**
 * Read ?round= param from URL. Returns number (1-3) or null.
 */
export function getRoundNumber() {
  try {
    const params = new URLSearchParams(window.location.search);
    const round = parseInt(params.get('round'), 10);
    return round >= 1 && round <= 3 ? round : null;
  } catch {
    return null;
  }
}

/**
 * Read ?score= param from URL. Returns event code string or null.
 * Used for the spectator/scoreboard view.
 */
export function getSpectateCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('score');
    return code ? code.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20) : null;
  } catch {
    return null;
  }
}

/**
 * Read ?admin= param from URL. Returns event code string or null.
 * Used for the admin dashboard view.
 */
export function getAdminCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('admin');
    return code ? code.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20) : null;
  } catch {
    return null;
  }
}

/**
 * Read ?code= param from URL. Returns game code string or null.
 * Used for tournament V2 player join flow.
 */
export function getGameCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    return code ? code.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20) : null;
  } catch {
    return null;
  }
}

/**
 * Get the effective event code for scoring: {event}-R{round} in tournament mode.
 */
export function getTournamentEventCode() {
  const event = getEventCode();
  const round = getRoundNumber();
  if (event && round) return `${event}-R${round}`;
  return event;
}

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
  const rawName = (entry.name || 'AAA').toUpperCase().slice(0, 10);

  // Block inappropriate team names
  if (containsProfanity(rawName)) {
    throw new Error('PROFANITY');
  }

  const mode = entry.gameMode || 'CAMPAIGN';
  const event = entry.event || getTournamentEventCode();
  const newEntry = {
    name: rawName,
    score: entry.score || 0,
    stars: entry.stars || 0,
    rating: entry.rating || '',
    gameMode: mode,
    event, // '' = global, 'LINCOLN' = school-specific
    levelsCompleted: entry.levelsCompleted || 0,
    correctIntercepts: entry.correctIntercepts || 0,
    sirenCount: entry.sirenCount || 0,
    bestStreak: entry.bestStreak || 0,
    timestamp: Date.now(),
  };

  // Always save locally as fallback
  saveLocal(newEntry);

  // Try to save to Firestore
  // In tournament/event mode, use deterministic doc ID to avoid duplicates
  // (updateLiveScore and markScoreFinished already use this same ID pattern)
  try {
    if (event) {
      const docId = getLiveDocId(event, rawName);
      const docRef = doc(db, COLLECTION, docId);
      await setDoc(docRef, { ...newEntry, status: 'finished', lastUpdate: Date.now() }, { merge: true });
    } else {
      await addDoc(collection(db, COLLECTION), newEntry);
    }
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
export async function getLeaderboard(gameMode = 'CAMPAIGN', eventFilter = null) {
  const event = eventFilter !== null ? eventFilter : getEventCode();
  try {
    // Push event + gameMode into the Firestore query so low-scoring players
    // in an active event aren't silently dropped when the global `scores`
    // collection accumulates 500+ high-score docs across other events.
    // Requires a composite index on (event, gameMode, score desc).
    const q = query(
      collection(db, COLLECTION),
      where('event', '==', event),
      where('gameMode', '==', gameMode),
      orderBy('score', 'desc'),
      limit(500)
    );
    const snapshot = await getDocs(q);
    const raw = [];
    snapshot.forEach((doc) => {
      raw.push(doc.data());
    });
    // Deduplicate by team name — keep highest score per team
    const dedupKey = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const byName = new Map();
    raw.forEach((entry) => {
      const key = dedupKey(entry.name);
      const existing = byName.get(key);
      if (!existing || (entry.score || 0) > (existing.score || 0)) byName.set(key, entry);
    });
    return [...byName.values()].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, MAX_ENTRIES);
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
export function subscribeLeaderboard(gameMode, callback, eventFilter = null) {
  const event = eventFilter !== null ? eventFilter : getEventCode();
  try {
    // Push event + gameMode into the Firestore query — see getLeaderboard
    // for why. Requires composite index on (event, gameMode, score desc).
    const q = query(
      collection(db, COLLECTION),
      where('event', '==', event),
      where('gameMode', '==', gameMode),
      orderBy('score', 'desc'),
      limit(500)
    );
    return onSnapshot(q, (snapshot) => {
      const raw = [];
      snapshot.forEach((doc) => {
        raw.push(doc.data());
      });
      // Deduplicate by team name — keep highest score per team
      // Use sanitized key (strip emoji, lowercase) so "🔥 MIKE" and "MIKE" merge
      const dedupKey = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const byName = new Map();
      raw.forEach((entry) => {
        const key = dedupKey(entry.name);
        const existing = byName.get(key);
        if (!existing || (entry.score || 0) > (existing.score || 0)) byName.set(key, entry);
      });
      const entries = [...byName.values()].sort((a, b) => (b.score || 0) - (a.score || 0));
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
 * Subscribe to all-time leaderboard (all events, all tournaments).
 * Returns top scores across the entire scores collection.
 */
export function subscribeAllTimeLeaderboard(callback, maxEntries = 25) {
  if (!db) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('score', 'desc'),
      limit(500)
    );
    return onSnapshot(q, (snapshot) => {
      const raw = [];
      snapshot.forEach((d) => {
        const data = d.data();
        // Only finished scores (exclude live tournament updates)
        if (data.status === 'playing') return;
        if (data.gameMode === 'CAMPAIGN') raw.push(data);
      });
      // Deduplicate by team name — keep highest score per team
      const dedupKey = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const byName = new Map();
      raw.forEach((entry) => {
        const key = dedupKey(entry.name);
        const existing = byName.get(key);
        if (!existing || (entry.score || 0) > (existing.score || 0)) byName.set(key, entry);
      });
      const entries = [...byName.values()].sort((a, b) => (b.score || 0) - (a.score || 0));
      callback(entries.slice(0, maxEntries));
    }, (err) => {
      console.warn('All-time leaderboard subscription failed:', err.message);
      callback([]);
    });
  } catch (err) {
    console.warn('All-time leaderboard subscription setup failed:', err.message);
    callback([]);
    return () => {};
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

// ── Live Score Updates (Tournament Mode) ─────────────────────

/**
 * Deterministic Firestore doc ID for a team in an event.
 * One doc per team per event — updates overwrite, no duplicates.
 */
function getLiveDocId(eventCode, teamName) {
  const sanitized = (teamName || 'anon').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
  return `live__${eventCode}__${sanitized}`;
}

/**
 * Read a specific team's finalized round score.
 * Used by the rejoin flow to reconstruct cumulative totals when a
 * player refreshes without localStorage state (new tab, cleared cache, etc).
 *
 * Returns the raw round score (unmultiplied) or 0 if not found.
 */
export async function getRoundScore(eventCode, roundNumber, teamName) {
  if (!db || !eventCode || !teamName || !roundNumber) return 0;
  try {
    const docId = getLiveDocId(`${eventCode}-R${roundNumber}`, teamName);
    const snap = await getDoc(doc(db, COLLECTION, docId));
    if (!snap.exists()) return 0;
    return snap.data()?.score || 0;
  } catch {
    return 0;
  }
}

/**
 * Push a live score update to Firestore (tournament mode).
 * Uses setDoc with merge — creates on first call, updates thereafter.
 * Fire-and-forget: caller doesn't need to await.
 */
export async function updateLiveScore({ name, score, event, currentLevel, status = 'playing' }) {
  if (!db || !event || !name) return;
  try {
    const docId = getLiveDocId(event, name);
    const docRef = doc(db, COLLECTION, docId);
    await setDoc(docRef, {
      name: (name || 'ANON').slice(0, 20),
      score: score || 0,
      gameMode: 'CAMPAIGN',
      event,
      currentLevel: currentLevel || 1,
      status,
      timestamp: Date.now(),
      lastUpdate: Date.now(),
    }, { merge: true });
  } catch (err) {
    // Silent fail — game continues without live updates
  }
}

/**
 * Mark a live score as finished with final campaign stats.
 * Also saves to localStorage as the definitive final score.
 */
export async function markScoreFinished({ name, score, event, stats = {} }) {
  if (!db || !event || !name) return;
  try {
    const docId = getLiveDocId(event, name);
    const docRef = doc(db, COLLECTION, docId);
    const finalData = {
      name: (name || 'ANON').slice(0, 20),
      score: score || 0,
      gameMode: 'CAMPAIGN',
      event,
      status: 'finished',
      timestamp: Date.now(),
      lastUpdate: Date.now(),
      levelsCompleted: stats.levelsCompleted || 0,
      correctIntercepts: stats.totalCorrectIntercepts || 0,
      sirenCount: stats.totalSirens || 0,
      bestStreak: stats.overallBestStreak || 0,
      quizCorrect: stats.quizCorrect || 0,
      quizTotal: stats.quizTotal || 0,
    };
    await setDoc(docRef, finalData, { merge: true });
    // Also save locally as fallback
    saveLocal(finalData);
  } catch (err) {
    console.warn('Live score finalize failed:', err.message);
    // Still save locally
    saveLocal({
      name: (name || 'ANON').slice(0, 20),
      score: score || 0,
      gameMode: 'CAMPAIGN',
      event,
      timestamp: Date.now(),
    });
  }
}

// ── Tournament V2 (Lobby + Auto-Advancement) ─────────────────

const TOURNAMENTS = 'tournaments';

/** Sanitize team name for use as map key / doc ID component.
 *  Preserves emoji identity by converting emoji to hex codepoints.
 *  "🦅 MIKE" → "1f985_mike", "🐻 MIKE" → "1f43b_mike" */
export function sanitizeTeamKey(name) {
  if (!name) return 'anon';
  // Extract leading emoji (if any) and convert to hex codepoint
  const emojiMatch = name.match(/^([\p{Emoji}\u200d\ufe0f]+)\s*/u);
  const emojiPrefix = emojiMatch
    ? emojiMatch[1].codePointAt(0).toString(16) + '_'
    : '';
  const textPart = (emojiMatch ? name.slice(emojiMatch[0].length) : name)
    .toLowerCase().replace(/[^a-z0-9]/g, '');
  return (emojiPrefix + textPart).slice(0, 30) || 'anon';
}

/** Get tournament Firestore doc ID */
function getTournamentDocId(eventCode) {
  return `tournament__${(eventCode || '').toUpperCase()}`;
}

/**
 * Check if a tournament exists for the given event code.
 * Returns the tournament data or null.
 */
export async function getTournament(eventCode) {
  if (!db || !eventCode) return null;
  try {
    const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('getTournament failed:', err.message);
    return null;
  }
}

/**
 * Create a new tournament. Called from the admin dashboard.
 */
// Default advance configs per tournament format
function getDefaultAdvanceConfig(format) {
  switch (format) {
    case '1-round': return {};  // No advancement — single round
    case '2-round': return { 1: { type: 'count', value: 2 } };
    case '3-round': return { 1: { type: 'percentage', value: 50 }, 2: { type: 'count', value: 2 } };
    default: return { 1: { type: 'count', value: 2 } };
  }
}

function getDefaultMultipliers(format) {
  switch (format) {
    case '1-round': return { 1: 1 };
    case '2-round': return { 1: 1, 2: 1.5 };
    case '3-round': return { 1: 1, 2: 1.5, 3: 2 };
    default: return { 1: 1, 2: 1.5 };
  }
}

export async function createTournament(eventCode, format = '2-round', briefingMode = 'forced') {
  if (!db || !eventCode) return null;
  const docId = getTournamentDocId(eventCode);
  const docRef = doc(db, TOURNAMENTS, docId);
  const data = {
    eventCode: eventCode.toUpperCase(),
    format,
    briefingMode,
    currentRound: 1,
    roundStatus: 'lobby', // lobby | active | complete | finished
    advanceConfig: getDefaultAdvanceConfig(format),
    roundMultipliers: getDefaultMultipliers(format),
    rounds: {},
    teams: {},
    createdAt: Date.now(),
  };
  await setDoc(docRef, data);
  return data;
}

/**
 * Update tournament format (admin can change in lobby before R1 starts).
 * Also resets advanceConfig and roundMultipliers to match the new format.
 */
export async function updateTournamentFormat(eventCode, format) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, {
    format,
    advanceConfig: getDefaultAdvanceConfig(format),
    roundMultipliers: getDefaultMultipliers(format),
  }, { merge: true });
}

/**
 * Update briefing mode for a tournament (admin can change between rounds).
 */
export async function updateBriefingMode(eventCode, mode) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, { briefingMode: mode }, { merge: true });
}

/**
 * Subscribe to a tournament document in real-time.
 * Returns an unsubscribe function.
 */
export function subscribeTournament(eventCode, callback) {
  if (!db || !eventCode) {
    // Signal connectivity issue vs missing tournament
    callback(null, !db ? 'CONNECTION_ERROR' : null);
    return () => {};
  }
  try {
    const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
    return onSnapshot(docRef, (snap) => {
      callback(snap.exists() ? snap.data() : null);
    }, (err) => {
      console.warn('Tournament subscription failed:', err.message);
      callback(null, 'CONNECTION_ERROR');
    });
  } catch (err) {
    console.warn('Tournament subscription setup failed:', err.message);
    callback(null, 'CONNECTION_ERROR');
    return () => {};
  }
}

/**
 * Register a team in the tournament lobby.
 * Writes to the teams map in the tournament doc.
 */
export async function registerTeam(eventCode, name, emoji = '') {
  if (!db || !eventCode || !name) return;
  const displayName = emoji ? `${emoji} ${name}` : name;
  const key = sanitizeTeamKey(displayName);
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, {
    teams: {
      [key]: {
        name: name.toUpperCase().slice(0, 10),
        emoji: emoji || '',
        joinedAt: Date.now(),
      },
    },
  }, { merge: true });
}

/**
 * Admin: start the current round (lobby → active).
 */
export async function startRound(eventCode) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, { roundStatus: 'active' }, { merge: true });
}

/**
 * Admin: close the current round and set advancing teams.
 * @param {string} eventCode
 * @param {number} roundNumber - which round to close (1, 2, or 3)
 * @param {string[]} advancingTeamKeys - sanitized team keys that advance
 * @param {number} cutoffScore - score at the cutoff line
 */
export async function closeRound(eventCode, roundNumber, advancingTeamKeys, cutoffScore) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, {
    roundStatus: 'complete',
    rounds: {
      [roundNumber]: {
        advancingTeams: advancingTeamKeys,
        cutoffScore: cutoffScore || 0,
      },
    },
  }, { merge: true });
}

/**
 * Admin: advance to the next round (complete → lobby for next round).
 * @param {number} nextRound - the round number to advance to (2 or 3)
 */
export async function advanceToNextRound(eventCode, nextRound) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, {
    currentRound: nextRound,
    roundStatus: 'lobby',
  }, { merge: true });
}

/**
 * Admin: mark tournament as finished (after final round).
 */
export async function finishTournament(eventCode) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, { roundStatus: 'finished' }, { merge: true });
}

/**
 * Admin: update advancement config for a round.
 * @param {number} roundNumber
 * @param {{ type: 'percentage'|'count', value: number }} config
 */
export async function updateAdvanceConfig(eventCode, roundNumber, config) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, {
    advanceConfig: { [roundNumber]: config },
  }, { merge: true });
}

/**
 * Admin: reset tournament back to round 1 lobby with no teams.
 */
export async function resetTournament(eventCode) {
  if (!db || !eventCode) return;
  return createTournament(eventCode); // overwrite with fresh state
}

/**
 * Admin: pause all players (simple boolean flag).
 */
export async function pauseRound(eventCode) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, { paused: true }, { merge: true });
}

/**
 * Admin: resume all players.
 */
export async function resumeRound(eventCode) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, { paused: false }, { merge: true });
}

/**
 * Admin: kick a team from the tournament.
 */
export async function kickTeam(eventCode, teamKey) {
  if (!db || !eventCode || !teamKey) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  // Remove team from the teams map by setting to deleteField sentinel
  // Since Firestore merge doesn't support deleting nested fields easily,
  // we'll mark them as kicked instead
  await setDoc(docRef, {
    teams: { [teamKey]: { kicked: true } },
  }, { merge: true });
}

/**
 * Admin: start round with absolute timestamp for synchronized countdown.
 * Writes roundStartsAt = Date.now() + delayMs.
 */
export async function startRoundWithCountdown(eventCode, delayMs = 5000) {
  if (!db || !eventCode) return;
  const docRef = doc(db, TOURNAMENTS, getTournamentDocId(eventCode));
  await setDoc(docRef, {
    roundStatus: 'active',
    roundStartsAt: Date.now() + delayMs,
    paused: false,
  }, { merge: true });
}
