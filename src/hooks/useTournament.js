// ============================================================
// TOURNAMENT V2 — Lobby + Auto-Advancement State Hook
// ============================================================
// Subscribes to Firestore tournament doc, manages tournament phases,
// handles cumulative scoring, and sessionStorage persistence.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  subscribeTournament,
  registerTeam,
  sanitizeTeamKey,
  subscribeLeaderboard,
  getTournament,
} from '../utils/leaderboard.js';
import { ROUND_CONFIGS, getTotalRounds, getRoundConfig, getFormatConfig } from './useGameEngine.js';

const SESSION_KEY = 'tournament_v2_state';

// Tournament phases (client-side state machine)
export const TOURNAMENT_PHASES = {
  TITLE: 'title',           // Game code input + solo mission
  LOBBY: 'lobby',           // Name + emoji entry
  WAITING: 'waiting',       // "You're in — look at the main screen"
  TAP_READY: 'tap_ready',   // "Tap when ready" (unlocks audio)
  COUNTDOWN: 'countdown',   // 5-4-3-2-1
  PLAYING: 'playing',       // Game engine running
  ROUND_COMPLETE: 'round_complete', // Score + rank + waiting for results
  ADVANCING: 'advancing',   // "Great run! You advance!"
  ELIMINATED: 'eliminated', // "Great run! Practice any level."
  PRACTICE: 'practice',     // Practice mode (replay any level)
  LOBBY_PRACTICE: 'lobby_practice', // Guided practice round from lobby/waiting
  CHAMPION: 'champion',     // Tournament winner
};

/**
 * Load persisted tournament state from sessionStorage.
 */
function loadSessionState() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Save tournament state to sessionStorage (survives refresh).
 */
function saveSessionState(state) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Clear tournament session state.
 */
function clearSessionState() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

/**
 * Main tournament hook. Manages the entire tournament lifecycle.
 *
 * @param {string|null} initialEventCode - From URL param ?code=
 * @returns Tournament state and actions
 */
export default function useTournament(initialEventCode = null) {
  // Core state
  const [eventCode, setEventCode] = useState(initialEventCode || '');
  const [tournamentDoc, setTournamentDoc] = useState(null);
  const [phase, setPhase] = useState(TOURNAMENT_PHASES.TITLE);
  const [teamName, setTeamName] = useState('');
  const [teamEmoji, setTeamEmoji] = useState('');
  const [joined, setJoined] = useState(false);
  const [lateJoiner, setLateJoiner] = useState(false); // Joined after R1 started — skip R1 gameplay
  const lateJoinerRef = useRef(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Countdown state
  const [countdownValue, setCountdownValue] = useState(null);
  const countdownIntervalRef = useRef(null);

  // Scoring
  const [cumulativeBase, setCumulativeBase] = useState(0);
  const [roundScores, setRoundScores] = useState({}); // { 1: 2500, 2: 3200 }

  // Round leaderboard (for player's round_complete screen)
  const [roundLeaderboard, setRoundLeaderboard] = useState([]);

  // Error state
  const [error, setError] = useState(null);

  // Refs for stable callbacks (avoid stale closures)
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const joinedRef = useRef(joined);
  joinedRef.current = joined;
  const teamKeyRef = useRef('');
  const eventCodeRef = useRef(eventCode);
  eventCodeRef.current = eventCode;
  const tournamentDocRef = useRef(tournamentDoc);
  tournamentDocRef.current = tournamentDoc;
  const cumulativeBaseRef = useRef(cumulativeBase);
  cumulativeBaseRef.current = cumulativeBase;

  // ── Session restoration ──────────────────────────────────────
  useEffect(() => {
    const saved = loadSessionState();
    if (saved && saved.eventCode) {
      setEventCode(saved.eventCode);
      setTeamName(saved.teamName || '');
      setTeamEmoji(saved.teamEmoji || '');
      setCumulativeBase(saved.cumulativeBase || 0);
      setRoundScores(saved.roundScores || {});
      setJoined(true);
      teamKeyRef.current = sanitizeTeamKey(saved.teamName);
      // Phase will be determined by tournament doc subscription below
    }
  }, []);

  // ── Persist state to sessionStorage ──────────────────────────
  useEffect(() => {
    if (joined && eventCode && teamName) {
      saveSessionState({
        eventCode,
        teamName,
        teamEmoji,
        cumulativeBase,
        roundScores,
      });
    }
  }, [joined, eventCode, teamName, teamEmoji, cumulativeBase, roundScores]);

  // ── Subscribe to tournament doc ──────────────────────────────
  useEffect(() => {
    if (!eventCode) return;

    const unsub = subscribeTournament(eventCode, (doc, reason) => {
      setTournamentDoc(doc);
      if (!doc) {
        setError(reason === 'CONNECTION_ERROR'
          ? 'CONNECTION ERROR — CHECK WIFI AND TRY AGAIN'
          : 'TOURNAMENT NOT FOUND');
        return;
      }
      setError(null);

      // Validate session restoration: if we think we're "joined" (from sessionStorage)
      // but our team isn't in this tournament's teams map, we have stale session data.
      if (joinedRef.current && teamKeyRef.current && doc.teams) {
        if (!doc.teams[teamKeyRef.current]) {
          setJoined(false);
          joinedRef.current = false;
          clearSessionState();
        }
      }

      // GATE: if player hasn't joined this tournament, check if they're allowed in
      // Allow joining anytime during Round 1 (lobby, active, or complete).
      // Block joining once R2+ has started (inter-round lobbies don't accept new players).
      if (!joinedRef.current) {
        const isRound1 = (doc.currentRound || 1) === 1;
        const isFinished = doc.roundStatus === 'finished';
        if (isRound1 && !isFinished) {
          // R1 in any state — allow entry, show lobby screen for name entry
          if (phaseRef.current !== TOURNAMENT_PHASES.LOBBY) {
            setPhase(TOURNAMENT_PHASES.LOBBY);
          }
        } else {
          // Tournament is past R1 or finished — block entry
          const messages = {
            lobby: 'ROUND 2+ IN PROGRESS — TOO LATE TO JOIN',
            active: 'TOURNAMENT IN PROGRESS — TOO LATE TO JOIN',
            paused: 'TOURNAMENT IN PROGRESS — TOO LATE TO JOIN',
            complete: 'ROUND CLOSED — TOO LATE TO JOIN',
            finished: 'TOURNAMENT HAS ENDED',
          };
          setError(messages[doc.roundStatus] || 'TOURNAMENT UNAVAILABLE');
          return; // Don't process any further
        }
      }
    });

    return unsub;
  }, [eventCode]);

  // ── React to tournament doc changes (phase transitions) ──────
  useEffect(() => {
    if (!tournamentDoc || !joinedRef.current) return;

    const { roundStatus, currentRound, rounds, paused } = tournamentDoc;
    const teamKey = teamKeyRef.current;

    // Check if eliminated from a previous round
    if (currentRound > 1) {
      const prevRound = rounds?.[currentRound - 1];
      if (prevRound?.advancingTeams && !prevRound.advancingTeams.includes(teamKey)) {
        // Don't interrupt active gameplay or practice — only transition if safe
        const protectedPhases = [
          TOURNAMENT_PHASES.PLAYING,
          TOURNAMENT_PHASES.COUNTDOWN,
          TOURNAMENT_PHASES.TAP_READY,
          TOURNAMENT_PHASES.PRACTICE,
          TOURNAMENT_PHASES.LOBBY_PRACTICE,
        ];
        if (!protectedPhases.includes(phaseRef.current)) {
          setPhase(TOURNAMENT_PHASES.ELIMINATED);
        }
        return;
      }
    }

    // React to round status
    if (roundStatus === 'lobby') {
      // If we already joined and round is in lobby, we're waiting
      if (phaseRef.current === TOURNAMENT_PHASES.PLAYING ||
          phaseRef.current === TOURNAMENT_PHASES.COUNTDOWN ||
          phaseRef.current === TOURNAMENT_PHASES.TAP_READY) {
        // Don't interrupt active gameplay
        return;
      }
      // Don't kick players out of practice when tournament doc updates (e.g., new player joins)
      if (phaseRef.current === TOURNAMENT_PHASES.LOBBY_PRACTICE) {
        return;
      }
      if (phaseRef.current !== TOURNAMENT_PHASES.LOBBY) {
        setPhase(TOURNAMENT_PHASES.WAITING);
      }
    } else if (roundStatus === 'active') {
      if (phaseRef.current === TOURNAMENT_PHASES.WAITING ||
          phaseRef.current === TOURNAMENT_PHASES.LOBBY ||
          phaseRef.current === TOURNAMENT_PHASES.LOBBY_PRACTICE) {
        // Round starting! Transition to tap_ready (for audio unlock) or countdown
        setPhase(audioUnlocked ? TOURNAMENT_PHASES.COUNTDOWN : TOURNAMENT_PHASES.TAP_READY);
      }
    } else if (roundStatus === 'complete') {
      // Don't interrupt active gameplay — player may still be between levels
      if (phaseRef.current === TOURNAMENT_PHASES.PLAYING) {
        return;
      }
      // Round closed by admin — check if we advance
      const roundResult = rounds?.[currentRound];
      if (roundResult?.advancingTeams) {
        if (roundResult.advancingTeams.includes(teamKey)) {
          // Check if this is the final round
          if (currentRound >= getTotalRounds(tournamentDoc)) {
            setPhase(TOURNAMENT_PHASES.CHAMPION);
          } else {
            setPhase(TOURNAMENT_PHASES.ADVANCING);
          }
        } else {
          // Late joiners with no R1 score get eliminated unless admin includes them
          setPhase(TOURNAMENT_PHASES.ELIMINATED);
        }
      }
      // If no advancingTeams yet, admin hasn't confirmed — stay on round_complete
    } else if (roundStatus === 'finished') {
      // Tournament is over
      const lastRound = rounds?.[currentRound];
      if (lastRound?.advancingTeams?.includes(teamKey)) {
        setPhase(TOURNAMENT_PHASES.CHAMPION);
      }
    }
  }, [tournamentDoc, audioUnlocked]);

  // ── Handle remote pause ──────────────────────────────────────
  const isPaused = tournamentDoc?.paused === true;

  // ── Countdown logic ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== TOURNAMENT_PHASES.COUNTDOWN) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setCountdownValue(null);
      return;
    }

    // Use roundStartsAt from tournament doc if available, else count from now
    const startAt = tournamentDoc?.roundStartsAt;
    const targetTime = startAt || (Date.now() + 5000);

    const tick = () => {
      const remaining = Math.ceil((targetTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        setCountdownValue(0);
        setPhase(TOURNAMENT_PHASES.PLAYING);
      } else {
        setCountdownValue(remaining);
      }
    };

    tick(); // Immediate first tick
    countdownIntervalRef.current = setInterval(tick, 100); // High frequency for smooth countdown

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [phase, tournamentDoc?.roundStartsAt]);

  // ── Subscribe to round leaderboard (for player's round_complete screen) ──
  useEffect(() => {
    if (phase !== TOURNAMENT_PHASES.ROUND_COMPLETE &&
        phase !== TOURNAMENT_PHASES.ADVANCING &&
        phase !== TOURNAMENT_PHASES.ELIMINATED) {
      return;
    }
    if (!eventCode || !tournamentDoc) return;

    const roundEventCode = `${eventCode}-R${tournamentDoc.currentRound}`;
    const unsub = subscribeLeaderboard('CAMPAIGN', (entries) => {
      setRoundLeaderboard(entries);
    }, roundEventCode);

    return unsub;
  }, [phase, eventCode, tournamentDoc?.currentRound]);

  // ── Actions ──────────────────────────────────────────────────

  /**
   * Check if a game code is valid and transition to lobby.
   */
  const joinTournament = useCallback(async (code) => {
    const cleanCode = (code || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20);
    if (!cleanCode) {
      setError('ENTER A GAME CODE');
      return false;
    }

    setError(null);

    // Set event code to trigger the real-time subscription.
    // The subscription callback will validate roundStatus and block if needed.
    // If retrying the same code after a connection error, clear first to re-trigger the effect.
    if (eventCode === cleanCode) {
      setEventCode('');
      // Use microtask to ensure state clears before re-setting
      await new Promise(r => setTimeout(r, 0));
    }
    setEventCode(cleanCode);
    // Don't set phase yet — wait for subscription to confirm status
    return true;
  }, []);

  /**
   * Register team name + emoji and join the lobby.
   */
  const submitTeamName = useCallback(async (name, emoji = '') => {
    if (!eventCode || !name?.trim()) return false;

    // Block joining if tournament is past Round 1
    const currentRound = tournamentDoc?.currentRound || 1;
    const status = tournamentDoc?.roundStatus;
    if (currentRound > 1 || status === 'finished') {
      setError(status === 'finished' ? 'TOURNAMENT HAS ENDED' : 'TOURNAMENT IN PROGRESS — TOO LATE TO JOIN');
      return false;
    }

    const cleanName = name.trim().toUpperCase().slice(0, 10);
    const displayNameForKey = emoji ? `${emoji} ${cleanName}` : cleanName;
    const key = sanitizeTeamKey(displayNameForKey);
    teamKeyRef.current = key;

    // Check for duplicate name+icon combination
    if (tournamentDoc?.teams?.[key] && !joinedRef.current) {
      setError('NAME + ICON ALREADY TAKEN');
      return false;
    }

    setError(null);
    setTeamName(cleanName);
    setTeamEmoji(emoji);

    try {
      await registerTeam(eventCode, cleanName, emoji);
      setJoined(true);
      // If R1 is already active, jump straight into gameplay (skip waiting)
      const isLate = status && status !== 'lobby';
      if (isLate && status === 'active') {
        setPhase(audioUnlocked ? TOURNAMENT_PHASES.COUNTDOWN : TOURNAMENT_PHASES.TAP_READY);
      } else {
        setPhase(TOURNAMENT_PHASES.WAITING);
      }

      return true;
    } catch (err) {
      setError('FAILED TO JOIN — TRY AGAIN');
      return false;
    }
  }, [eventCode, tournamentDoc]);

  /**
   * Player taps "ready" — unlocks audio context.
   */
  const tapReady = useCallback(() => {
    // Create and resume audio context to unlock audio
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume().then(() => ctx.close());
    } catch {}
    setAudioUnlocked(true);
    setPhase(TOURNAMENT_PHASES.COUNTDOWN);
  }, []);

  /**
   * Called when game engine reaches SUMMARY state.
   * Stores the round score and transitions to round_complete.
   */
  const onRoundFinished = useCallback((roundScore) => {
    // Read from refs to avoid stale closure — tournamentDoc and cumulativeBase
    // can change between when this callback is created and when it's called
    const doc = tournamentDocRef.current;
    const currentRound = doc?.currentRound || 1;
    const roundCfg = getRoundConfig(doc, currentRound);
    const multiplier = roundCfg?.multiplier || doc?.roundMultipliers?.[currentRound] || 1;
    const adjustedScore = Math.round(roundScore * multiplier);
    const base = cumulativeBaseRef.current;
    const totalScore = base + adjustedScore;

    setRoundScores(prev => ({ ...prev, [currentRound]: adjustedScore }));
    setCumulativeBase(totalScore);
    setPhase(TOURNAMENT_PHASES.ROUND_COMPLETE);

    return totalScore;
  }, []); // No deps — reads from refs

  /**
   * Player chooses to enter practice mode after elimination.
   */
  const enterPractice = useCallback(() => {
    setPhase(TOURNAMENT_PHASES.PRACTICE);
  }, []);

  /**
   * Enter guided practice round from lobby/waiting screen.
   */
  const enterLobbyPractice = useCallback(() => {
    setPhase(TOURNAMENT_PHASES.LOBBY_PRACTICE);
  }, []);

  /**
   * Get the current round config for the game engine.
   */
  const currentRoundConfig = tournamentDoc
    ? getRoundConfig(tournamentDoc, tournamentDoc.currentRound) || null
    : null;

  /**
   * Get the display name (emoji + name).
   */
  const displayName = teamEmoji ? `${teamEmoji} ${teamName}` : teamName;

  /**
   * Get the tournament event code for the current round (e.g., "HAWK-R1").
   */
  const currentRoundEventCode = eventCode && tournamentDoc
    ? `${eventCode}-R${tournamentDoc.currentRound}`
    : '';

  /**
   * Get the player's rank in the current round leaderboard.
   */
  const playerRank = roundLeaderboard.findIndex(
    e => sanitizeTeamKey(e.name) === teamKeyRef.current
  ) + 1;

  /**
   * Reset tournament state (for starting over).
   */
  const reset = useCallback(() => {
    clearSessionState();
    setEventCode('');
    setTournamentDoc(null);
    setPhase(TOURNAMENT_PHASES.TITLE);
    setTeamName('');
    setTeamEmoji('');
    setJoined(false);
    setAudioUnlocked(false);
    setCumulativeBase(0);
    setRoundScores({});
    setRoundLeaderboard([]);
    setError(null);
    teamKeyRef.current = '';
  }, []);

  return {
    // State
    phase,
    eventCode,
    tournamentDoc,
    teamName,
    teamEmoji,
    displayName,
    joined,
    lateJoiner,
    error,
    countdownValue,
    cumulativeBase,
    roundScores,
    roundLeaderboard,
    playerRank,
    currentRoundConfig,
    currentRoundEventCode,
    isPaused,
    briefingMode: tournamentDoc?.briefingMode || 'forced',

    // Actions
    joinTournament,
    submitTeamName,
    tapReady,
    onRoundFinished,
    enterPractice,
    enterLobbyPractice,
    reset,
    setPhase,
    setTeamName,
    setTeamEmoji,
    setError,
  };
}
