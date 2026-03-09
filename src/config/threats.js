// ============================================================
// MISSILE DEFENSE — Threat Configuration (7-Level Campaign)
// ============================================================
//
// Defense System Matching:
//   Iron Dome     → Drones + Rockets  (Key 1)
//   David's Sling → Cruise Missiles   (Key 2)
//   Arrow 2       → Ballistic         (Key 3)
//   Arrow 3       → Hypersonic        (Key 4)
//
// Intel Levels: 'full' (all levels use full intel)
// reveal_pct: Fraction of countdown remaining when impact zone reveals
//   1.0 = revealed immediately, 0.4 = revealed at 40% time remaining
// priority: true for Dimona targets (triggers longer siren)
// is_final_salvo: Part of the named final salvo wave
// ============================================================

// Fallback command center — used when no per-level battery is set
export const COMMAND_CENTER = { x: 0.28, y: 0.34 };

export const THREAT_COLORS = {
  drone: '#eab308',
  rocket: '#f97316',
  cruise: '#3b82f6',
  ballistic: '#ef4444',
  hypersonic: '#a855f7',
};

// Shared map of all impact zone names to radar coordinates
export const IMPACT_POSITIONS = {
  // === Cities (must match CITIES in mapLayers.js) ===
  'Tel Aviv': { x: 0.28, y: 0.35 },
  'Jerusalem': { x: 0.44, y: 0.42 },
  'Haifa': { x: 0.36, y: 0.19 },
  'Ashdod': { x: 0.24, y: 0.41 },
  'Beersheba': { x: 0.29, y: 0.57 },
  'Eilat': { x: 0.35, y: 0.90 },
  'Dimona': { x: 0.37, y: 0.62 },
  'Netanya': { x: 0.31, y: 0.30 },
  'Ashkelon': { x: 0.202, y: 0.436 },
  'Teveriah': { x: 0.55, y: 0.19 },
  'Tzfat': { x: 0.54, y: 0.15 },
  'Kiryat Shmona': { x: 0.56, y: 0.10 },
  'Sderot': { x: 0.212, y: 0.467 },
  'Nahariya': { x: 0.40, y: 0.14 },
  // Otef Aza cities — GPS-verified positions
  "Be'eri": { x: 0.175, y: 0.490 },
  'Kfar Aza': { x: 0.191, y: 0.477 },
  "Re'im": { x: 0.162, y: 0.498 },
  'Netivot': { x: 0.211, y: 0.490 },
  'Rishon LeZion': { x: 0.27, y: 0.39 },
  'Petah Tikva': { x: 0.33, y: 0.34 },
  'Holon': { x: 0.27, y: 0.37 },
  "Ra'anana": { x: 0.313, y: 0.323 },
  "Modi'in": { x: 0.364, y: 0.386 },
  'Gush Etzion': { x: 0.417, y: 0.442 },
  'Caesarea': { x: 0.320, y: 0.253 },
  'Hadera': { x: 0.331, y: 0.269 },
  'Akko': { x: 0.39, y: 0.16 },
  'Katzrin': { x: 0.61, y: 0.14 },
  'Majdal Shams': { x: 0.64, y: 0.08 },
  'Arad': { x: 0.42, y: 0.58 },
  // === Strategic Infrastructure (L4) ===
  'BAZAN Oil Refinery': { x: 0.34, y: 0.20 },           // Haifa Bay
  'Orot Rabin Power Station': { x: 0.32, y: 0.27 },     // Hadera
  'Rutenberg Power Station': { x: 0.20, y: 0.44 },      // Ashkelon
  'Sorek Desalination Plant': { x: 0.23, y: 0.39 },     // Palmachim coast
  'Ashdod Port': { x: 0.23, y: 0.42 },                  // Ashdod
  'Dimona Nuclear Reactor': { x: 0.37, y: 0.62 },       // Negev
  'The Kirya (IDF HQ)': { x: 0.28, y: 0.35 },           // Tel Aviv
  'Ben Gurion Airport': { x: 0.32, y: 0.37 },        // Central
  // === Military Bases (L5) ===
  'Ramat David AFB': { x: 0.43, y: 0.22 },
  'Glilot (Unit 8200)': { x: 0.29, y: 0.33 },
  'Palmachim AFB': { x: 0.24, y: 0.38 },
  'Nevatim AFB': { x: 0.36, y: 0.54 },
  'Tel Nof AFB': { x: 0.31, y: 0.42 },
  'Ramon AFB': { x: 0.24, y: 0.62 },
  'Sdot Micha': { x: 0.36, y: 0.46 },
  // === Open ground areas ===
  'Negev Desert': { x: 0.29, y: 0.63 },
  'Northern Negev': { x: 0.19, y: 0.52 },
  'Central Negev': { x: 0.33, y: 0.68 },
  'Southern Negev': { x: 0.36, y: 0.76 },
  'Dead Sea Region': { x: 0.52, y: 0.48 },
  'Golan Heights': { x: 0.63, y: 0.16 },
  'Jordan Valley': { x: 0.56, y: 0.32 },
  'Judean Hills': { x: 0.42, y: 0.43 },
  'Judean Desert': { x: 0.49, y: 0.46 },
  'Arava Valley': { x: 0.42, y: 0.81 },
  'Mediterranean (off-coast)': { x: 0.15, y: 0.35 },
  'Western Galilee': { x: 0.38, y: 0.15 },
  'Upper Galilee': { x: 0.52, y: 0.14 },
  'Coastal Plain': { x: 0.28, y: 0.39 },
  'Sinai Border Region': { x: 0.12, y: 0.70 },
  'Off-course (Saudi Arabia)': { x: 0.82, y: 0.65 },
  'Off-course (Red Sea)': { x: 0.50, y: 0.88 },
  'Off-course (Jordan)': { x: 0.68, y: 0.42 },
};

// Interceptor system colors — matched to threat type colors
export const INTERCEPTOR_COLORS = {
  iron_dome:    '#eab308',   // matches drone/rocket warm tones
  davids_sling: '#3b82f6',   // matches cruise blue
  arrow_2:      '#ef4444',   // matches ballistic red
  arrow_3:      '#a855f7',   // matches hypersonic purple
};

// Per-level accent colors — subtle mood shift per level
export const LEVEL_ACCENT_COLORS = {
  1: '#f97316', // Orange — rockets, close/hot
  2: '#eab308', // Amber — drones, surveillance
  3: '#3b82f6', // Blue — cruise missiles, cold precision
  4: '#ef4444', // Red — ballistic, danger
  5: '#a855f7', // Purple — hypersonic, sci-fi
  6: '#06b6d4', // Cyan — mixed salvo, tactical
  7: '#f43f5e', // Rose — final battle, critical
};

// -----------------------------------------------------------
// Threat Builder
// -----------------------------------------------------------
export const THREAT_DATA = {
  drone: {
    names: ['Samad-3 Attack Drone', 'Shahed-136 Attack Drone', 'Ababil-3 Drone'],
    speeds: [0.2, 0.3, 0.4, 0.5],
    altitudes: [1, 2, 3, 4, 5],
    trajectories: ['Low altitude, flat, steady', 'Low altitude, erratic pattern', 'Low, hugging terrain contours'],
    correct_action: 'iron_dome',
  },
  rocket: {
    names: ['Qassam Rocket', 'Grad Rocket', 'Fajr-5 Rocket'],
    speeds: [1.0, 1.2, 1.5, 1.8, 2.0],
    altitudes: [8, 10, 12, 15, 18],
    trajectories: ['Unguided ballistic arc', 'Short-range ballistic', 'High-angle lob trajectory'],
    correct_action: 'iron_dome',
  },
  cruise: {
    names: ['Quds Cruise Missile', 'Soumar Cruise Missile', 'Paveh Cruise Missile'],
    speeds: [0.8, 0.9, 1.0, 1.1, 1.2],
    altitudes: [5, 6, 7, 8, 9, 10],
    trajectories: ['Low altitude, terrain-following', 'Sea-skimming approach, low profile', 'Low altitude, weaving trajectory'],
    correct_action: 'davids_sling',
  },
  ballistic: {
    names: ['Shahab-3 Ballistic Missile', 'Fateh-110 Ballistic Missile', 'Emad Ballistic Missile', 'Toofan Ballistic Missile'],
    speeds: [7, 7.5, 8, 8.5, 9, 9.5],
    altitudes: [25, 28, 32, 35, 38, 40, 42],
    trajectories: ['High parabolic arc, steep descent', 'High arc, standard ballistic trajectory', 'Medium arc, steep terminal phase'],
    correct_action: 'arrow_2',
  },
  hypersonic: {
    names: ['DF-ZF Hypersonic Glide Vehicle', 'Fattah Hypersonic Missile'],
    speeds: [12, 13, 14, 15, 16],
    altitudes: [75, 80, 85, 90, 95, 100],
    trajectories: ['Very high arc, exo-atmospheric, fast reentry', 'Boost-glide trajectory, maneuvering', 'Skip-glide reentry, high energy'],
    correct_action: 'arrow_3',
  },
};

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function threat(id, time, type, zone, populated, cdn, intel, reveal, extra = {}) {
  const d = THREAT_DATA[type];
  return {
    id,
    name: pick(d.names, id),
    type,
    speed_mach: pick(d.speeds, id + 3),
    altitude_km: pick(d.altitudes, id + 1),
    trajectory: pick(d.trajectories, id),
    impact_zone: zone,
    is_populated: populated,
    correct_action: d.correct_action,
    appear_time: time,
    countdown: cdn,
    intel,
    reveal_pct: reveal,
    origin: 'southeast', // default — overridden per-threat for geographic accuracy
    priority: false,
    is_final_salvo: false,
    ...extra,
  };
}

// ============================================================
// LEVEL 1: Otef Aza — Short-range ROCKETS only, Iron Dome
// Duration: 80s | 38 threats (20 live, 18 hold-fire) | Teaches: intercept + hold fire
// Rocket hold-fire ratio: ~47% — mirrors real Qassam inaccuracy (unguided, most miss)
// Pacing: singles 0-15s → pairs 18-32s → triples 37-51s → pairs 58-65s
// Geography: Gaza border communities. Viewport zoomed tight on south.
// All threats from Gaza. Only Otef Aza cities targeted.
// ============================================================
const THREATS_L1 = [
  // === SINGLES — learn the basics (4 threats, 3-13s) ===
  threat(1,  3,  'rocket', 'Sderot',          true,  8, 'full', 1.0, { origin: 'gaza' }),
  threat(2,  7,  'rocket', 'Northern Negev',  false, 8, 'full', 1.0, { origin: 'gaza' }),     // hold fire
  threat(3,  10, 'rocket', 'Ashkelon',        true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(4,  13, 'rocket', "Be'eri",          true,  7, 'full', 1.0, { origin: 'gaza' }),
  // === PAIRS — waves of 2 (8 threats, 18-32s) ===
  threat(5,  18, 'rocket', 'Kfar Aza',        true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(6,  18, 'rocket', 'Sderot',          true,  7, 'full', 1.0, { origin: 'gaza' }),     // simultaneous pair
  threat(7,  23, 'rocket', 'Northern Negev',  false, 7, 'full', 1.0, { origin: 'gaza' }),     // hold fire
  threat(8,  23, 'rocket', 'Netivot',         true,  7, 'full', 1.0, { origin: 'gaza' }),     // pair with hold fire
  threat(9,  28, 'rocket', "Re'im",           true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(10, 28, 'rocket', 'Ashkelon',        true,  6, 'full', 1.0, { origin: 'gaza' }),     // pair
  threat(11, 32, 'rocket', "Be'eri",          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(12, 32, 'rocket', 'Kfar Aza',        true,  6, 'full', 1.0, { origin: 'gaza' }),     // pair
  // === TRIPLES — waves of 3, real pressure (9 threats, 37-51s) ===
  threat(13, 37, 'rocket', 'Sderot',          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(14, 37, 'rocket', 'Netivot',         true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(15, 37, 'rocket', 'Northern Negev',  false, 6, 'full', 1.0, { origin: 'gaza' }),     // triple! (1 hold fire)
  threat(16, 44, 'rocket', 'Ashkelon',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(17, 44, 'rocket', "Re'im",           true,  5, 'full', 1.0, { origin: 'gaza' }),     // pair (was triple — removed 1 for pacing)
  threat(19, 51, 'rocket', "Be'eri",          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(20, 51, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(21, 51, 'rocket', 'Northern Negev',  false, 5, 'full', 1.0, { origin: 'gaza' }),     // triple! (1 hold fire)
  // === FINAL SURGE — dense pair salvos (4 threats, 58-65s) ===
  threat(22, 58, 'rocket', 'Ashkelon',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(23, 58, 'rocket', 'Netivot',         true,  5, 'full', 1.0, { origin: 'gaza' }),     // pair (was triple — removed 1 for pacing)
  threat(25, 65, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(26, 65, 'rocket', "Be'eri",          true,  5, 'full', 1.0, { origin: 'gaza' }),     // closing pair
  // === HOLD-FIRE — unguided Qassams landing in open ground (~45% of all rockets miss) ===
  threat(27, 5,  'rocket', 'Coastal Plain',             false, 8, 'full', 1.0, { origin: 'gaza' }),
  threat(28, 12, 'rocket', 'Mediterranean (off-coast)',false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(29, 16, 'rocket', 'Negev Desert',             false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(30, 21, 'rocket', 'Southern Negev',           false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(31, 25, 'rocket', 'Sinai Border Region',      false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(32, 31, 'rocket', 'Negev Desert',             false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(33, 35, 'rocket', 'Judean Hills',             false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(34, 40, 'rocket', 'Mediterranean (off-coast)',false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(35, 43, 'rocket', 'Central Negev',            false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(36, 47, 'rocket', 'Negev Desert',             false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(37, 53, 'rocket', 'Arava Valley',             false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(38, 57, 'rocket', 'Sinai Border Region',      false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(39, 61, 'rocket', 'Negev Desert',             false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(40, 68, 'rocket', 'Dead Sea Region',          false, 5, 'full', 1.0, { origin: 'gaza' }),
];

// ============================================================
// LEVEL 1 — VARIANT B: Same skeleton, different target assignments
// Same timing, countdowns, hold-fire positions, and ammo budget.
// Different city targets per slot so repeat players can't memorize.
// Same hold-fire rockets as variant A (open ground doesn't change).
// ============================================================
const THREATS_L1_B = [
  // === SINGLES — learn the basics (4 threats, 3-13s) ===
  threat(1,  3,  'rocket', 'Kfar Aza',        true,  8, 'full', 1.0, { origin: 'gaza' }),
  threat(2,  7,  'rocket', 'Northern Negev',  false, 8, 'full', 1.0, { origin: 'gaza' }),     // hold fire
  threat(3,  10, 'rocket', 'Sderot',          true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(4,  13, 'rocket', 'Netivot',         true,  7, 'full', 1.0, { origin: 'gaza' }),
  // === PAIRS — waves of 2 (8 threats, 18-32s) ===
  threat(5,  18, 'rocket', "Re'im",           true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(6,  18, 'rocket', 'Ashkelon',        true,  7, 'full', 1.0, { origin: 'gaza' }),     // simultaneous pair
  threat(7,  23, 'rocket', 'Northern Negev',  false, 7, 'full', 1.0, { origin: 'gaza' }),     // hold fire
  threat(8,  23, 'rocket', "Be'eri",          true,  7, 'full', 1.0, { origin: 'gaza' }),     // pair with hold fire
  threat(9,  28, 'rocket', 'Sderot',          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(10, 28, 'rocket', 'Kfar Aza',        true,  6, 'full', 1.0, { origin: 'gaza' }),     // pair
  threat(11, 32, 'rocket', 'Netivot',         true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(12, 32, 'rocket', "Re'im",           true,  6, 'full', 1.0, { origin: 'gaza' }),     // pair
  // === TRIPLES — waves of 3, real pressure (9 threats, 37-51s) ===
  threat(13, 37, 'rocket', 'Ashkelon',        true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(14, 37, 'rocket', "Be'eri",          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(15, 37, 'rocket', 'Northern Negev',  false, 6, 'full', 1.0, { origin: 'gaza' }),     // triple! (1 hold fire)
  threat(16, 44, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(17, 44, 'rocket', 'Kfar Aza',        true,  5, 'full', 1.0, { origin: 'gaza' }),     // pair (was triple — removed 1 for pacing)
  threat(19, 51, 'rocket', "Re'im",           true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(20, 51, 'rocket', 'Ashkelon',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(21, 51, 'rocket', 'Northern Negev',  false, 5, 'full', 1.0, { origin: 'gaza' }),     // triple! (1 hold fire)
  // === FINAL SURGE — dense pair salvos (4 threats, 58-65s) ===
  threat(22, 58, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(23, 58, 'rocket', "Be'eri",          true,  5, 'full', 1.0, { origin: 'gaza' }),     // pair (was triple — removed 1 for pacing)
  threat(25, 65, 'rocket', 'Kfar Aza',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(26, 65, 'rocket', 'Netivot',         true,  5, 'full', 1.0, { origin: 'gaza' }),     // closing pair
  // === HOLD-FIRE — unguided Qassams landing in open ground (~45% of all rockets miss) ===
  threat(27, 5,  'rocket', 'Coastal Plain',             false, 8, 'full', 1.0, { origin: 'gaza' }),
  threat(28, 12, 'rocket', 'Mediterranean (off-coast)',false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(29, 16, 'rocket', 'Negev Desert',             false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(30, 21, 'rocket', 'Southern Negev',           false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(31, 25, 'rocket', 'Sinai Border Region',      false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(32, 31, 'rocket', 'Negev Desert',             false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(33, 35, 'rocket', 'Judean Hills',             false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(34, 40, 'rocket', 'Mediterranean (off-coast)',false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(35, 43, 'rocket', 'Central Negev',            false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(36, 47, 'rocket', 'Negev Desert',             false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(37, 53, 'rocket', 'Arava Valley',             false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(38, 57, 'rocket', 'Sinai Border Region',      false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(39, 61, 'rocket', 'Negev Desert',             false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(40, 68, 'rocket', 'Dead Sea Region',          false, 5, 'full', 1.0, { origin: 'gaza' }),
];

// ============================================================
// LEVEL 2: Galil, Haifa & Golan — Drones + Rockets, Iron Dome
// Duration: 120s | 61 threats (40 live, 21 hold-fire) | Introduces: drones
// Rocket hold-fire ratio: ~40% (unguided). Drone hold-fire: ~16% (GPS-guided, more accurate).
// Geography: Northern Israel. Viewport zoomed tight on north.
// Threats from Lebanon (north) and Syria (northeast). No Gaza threats.
// ============================================================
const THREATS_L2 = [
  // === SINGLES — intro to drones (4 threats, 3-14s) ===
  threat(1,  3,  'rocket', 'Haifa',            true,  8, 'full', 1.0, { origin: 'north' }),         // Lebanon
  threat(2,  7,  'rocket', 'Western Galilee',  false, 8, 'full', 1.0, { origin: 'north' }),         // hold fire
  threat(3,  11, 'drone',  'Nahariya',         true,  11, 'full', 1.0, { origin: 'north' }),        // First drone!
  threat(4,  14, 'rocket', 'Kiryat Shmona',    true,  7, 'full', 1.0, { origin: 'north' }),
  // === PAIRS — mixed drones + rockets (10 threats, 19-36s) ===
  threat(5,  19, 'drone',  'Akko',             true,  10, 'full', 1.0, { origin: 'north' }),
  threat(6,  19, 'rocket', 'Teveriah',         true,  7,  'full', 1.0, { origin: 'northeast' }),    // simultaneous pair
  threat(7,  24, 'rocket', 'Tzfat',            true,  7,  'full', 1.0, { origin: 'north' }),
  threat(8,  24, 'drone',  'Golan Heights',    false, 10, 'full', 1.0, { origin: 'northeast' }),    // hold fire pair
  threat(9,  28, 'drone',  'Haifa',            true,  10, 'full', 1.0, { origin: 'north' }),
  threat(10, 28, 'rocket', 'Katzrin',          true,  7,  'full', 1.0, { origin: 'northeast' }),    // pair
  threat(11, 32, 'rocket', 'Nahariya',         true,  7,  'full', 1.0, { origin: 'north' }),
  threat(12, 32, 'drone',  'Kiryat Shmona',    true,  10, 'full', 1.0, { origin: 'north' }),        // pair
  threat(13, 36, 'rocket', 'Akko',             true,  6,  'full', 1.0, { origin: 'north' }),
  threat(14, 36, 'rocket', 'Upper Galilee',    false, 7,  'full', 1.0, { origin: 'north' }),        // hold fire pair
  // === TRIPLES — real pressure starts (12 threats, 41-60s) ===
  threat(15, 41, 'rocket', 'Haifa',            true,  6,  'full', 1.0, { origin: 'north' }),
  threat(16, 41, 'drone',  'Majdal Shams',     true,  9,  'full', 1.0, { origin: 'northeast' }),
  threat(17, 41, 'rocket', 'Tzfat',            true,  6,  'full', 1.0, { origin: 'north' }),        // triple!
  threat(18, 47, 'drone',  'Teveriah',         true,  9,  'full', 1.0, { origin: 'northeast' }),
  threat(19, 47, 'rocket', 'Nahariya',         true,  6,  'full', 1.0, { origin: 'north' }),
  threat(20, 47, 'drone',  'Akko',             true,  9,  'full', 1.0, { origin: 'north' }),        // triple!
  threat(21, 53, 'rocket', 'Kiryat Shmona',    true,  6,  'full', 1.0, { origin: 'north' }),
  threat(22, 53, 'rocket', 'Katzrin',          true,  6,  'full', 1.0, { origin: 'northeast' }),
  threat(23, 53, 'drone',  'Western Galilee',  false, 9,  'full', 1.0, { origin: 'north' }),        // triple! (1 hold fire)
  threat(24, 58, 'drone',  'Haifa',            true,  9,  'full', 1.0, { origin: 'north' }),
  threat(25, 58, 'rocket', 'Majdal Shams',     true,  6,  'full', 1.0, { origin: 'northeast' }),
  threat(26, 60, 'rocket', 'Tzfat',            true,  6,  'full', 1.0, { origin: 'north' }),        // near-triple overlap
  // === HEAVY SALVOS — triples and quads (10 threats, 65-85s) ===
  threat(27, 65, 'rocket', 'Haifa',            true,  5,  'full', 1.0, { origin: 'north' }),
  threat(28, 65, 'drone',  'Kiryat Shmona',    true,  9,  'full', 1.0, { origin: 'north' }),        // pair (was triple — removed 1 for pacing)
  threat(30, 72, 'drone',  'Nahariya',         true,  8,  'full', 1.0, { origin: 'north' }),
  threat(31, 72, 'rocket', 'Teveriah',         true,  5,  'full', 1.0, { origin: 'northeast' }),
  threat(33, 72, 'drone',  'Upper Galilee',    false, 8,  'full', 1.0, { origin: 'north' }),        // triple (was quad — removed 1 for pacing)
  // === CLOSING BARRAGE — relentless overlapping (7 threats, 80-100s) ===
  threat(34, 80, 'rocket', 'Haifa',            true,  5,  'full', 1.0, { origin: 'north' }),
  threat(35, 80, 'drone',  'Tzfat',            true,  8,  'full', 1.0, { origin: 'north' }),
  threat(36, 80, 'rocket', 'Kiryat Shmona',    true,  5,  'full', 1.0, { origin: 'north' }),        // triple!
  threat(37, 86, 'drone',  'Teveriah',         true,  8,  'full', 1.0, { origin: 'northeast' }),
  threat(38, 86, 'rocket', 'Akko',             true,  5,  'full', 1.0, { origin: 'north' }),
  threat(39, 86, 'rocket', 'Golan Heights',    false, 5,  'full', 1.0, { origin: 'northeast' }),    // triple! (hold fire)
  threat(40, 93, 'rocket', 'Nahariya',         true,  5,  'full', 1.0, { origin: 'north' }),
  threat(41, 93, 'drone',  'Haifa',            true,  8,  'full', 1.0, { origin: 'north' }),
  threat(42, 93, 'rocket', 'Majdal Shams',     true,  5,  'full', 1.0, { origin: 'northeast' }),    // closing triple!
  // === EXTENDED BARRAGE — fill the gap (6 threats, 100-112s) ===
  threat(43, 100,'drone',  'Kiryat Shmona',    true,  8,  'full', 1.0, { origin: 'north' }),
  threat(44, 100,'rocket', 'Tzfat',            true,  5,  'full', 1.0, { origin: 'north' }),        // pair!
  threat(45, 105,'rocket', 'Haifa',            true,  5,  'full', 1.0, { origin: 'north' }),
  threat(46, 105,'drone',  'Akko',             true,  8,  'full', 1.0, { origin: 'north' }),        // pair (was triple — removed 1 for pacing)
  threat(48, 112,'drone',  'Teveriah',         true,  7,  'full', 1.0, { origin: 'northeast' }),
  threat(49, 112,'rocket', 'Nahariya',         true,  5,  'full', 1.0, { origin: 'north' }),        // closing pair!
  // === HOLD-FIRE ROCKETS — unguided rockets landing in open ground (~40% miss rate) ===
  threat(50, 6,  'rocket', 'Western Galilee',  false, 8,  'full', 1.0, { origin: 'north' }),
  threat(51, 15, 'rocket', 'Upper Galilee',    false, 7,  'full', 1.0, { origin: 'north' }),
  threat(52, 22, 'rocket', 'Golan Heights',    false, 7,  'full', 1.0, { origin: 'northeast' }),
  threat(53, 27, 'rocket', 'Western Galilee',  false, 7,  'full', 1.0, { origin: 'north' }),
  threat(54, 31, 'rocket', 'Upper Galilee',    false, 7,  'full', 1.0, { origin: 'north' }),
  threat(55, 38, 'rocket', 'Golan Heights',    false, 6,  'full', 1.0, { origin: 'northeast' }),
  threat(56, 45, 'rocket', 'Western Galilee',  false, 6,  'full', 1.0, { origin: 'north' }),
  threat(57, 50, 'rocket', 'Upper Galilee',    false, 6,  'full', 1.0, { origin: 'north' }),
  threat(58, 57, 'rocket', 'Golan Heights',    false, 6,  'full', 1.0, { origin: 'northeast' }),
  threat(59, 63, 'rocket', 'Western Galilee',  false, 5,  'full', 1.0, { origin: 'north' }),
  threat(60, 69, 'rocket', 'Upper Galilee',    false, 5,  'full', 1.0, { origin: 'north' }),
  threat(61, 77, 'rocket', 'Golan Heights',    false, 5,  'full', 1.0, { origin: 'northeast' }),
  threat(62, 84, 'rocket', 'Western Galilee',  false, 5,  'full', 1.0, { origin: 'north' }),
  threat(63, 96, 'rocket', 'Upper Galilee',    false, 5,  'full', 1.0, { origin: 'north' }),
  threat(64, 108,'rocket', 'Golan Heights',    false, 5,  'full', 1.0, { origin: 'northeast' }),
];

// ============================================================
// LEVEL 3: Central Israel — Cruise Missiles + all previous
// Duration: 120s | 51 threats (37 live, 14 hold-fire) | Introduces: David's Sling + cruise missiles
// Rocket hold-fire ratio: ~41%. Drone: ~20%. Cruise: ~6%.
// Geography: Wider Central Region — Gaza border visible, Tel Aviv, Jerusalem,
// Modi'in, Ra'anana, Gush Etzion corridor.
// Rockets from Gaza, cruise missiles from Iran, drones from Lebanon.
// ============================================================
const THREATS_L3 = [
  // === Phase 1: Warm-up singles (3 threats, 4-12s) ===
  threat(1,  4,  'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(2,  8,  'rocket', 'Rishon LeZion',   true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(3,  12, 'drone',  'Netanya',         true,  11, 'full', 1.0, { origin: 'north' }),        // Lebanon
  // === Phase 2: Introduce cruise missiles (6 threats, 16-33s) ===
  threat(4,  16, 'cruise', 'Tel Aviv',        true,  11, 'full', 1.0, { origin: 'east' }),         // First cruise! Iran
  threat(5,  20, 'rocket', 'Judean Hills',    false, 7,  'full', 1.0, { origin: 'gaza' }),         // hold fire
  threat(6,  24, 'cruise', 'Jerusalem',       true,  10, 'full', 1.0, { origin: 'east' }),         // Iran
  threat(7,  27, 'rocket', 'Holon',           true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(8,  30, 'drone',  'Coastal Plain',   false, 11, 'full', 1.0, { origin: 'north' }),        // hold fire
  threat(9,  33, 'cruise', "Modi'in",         true,  10, 'full', 1.0, { origin: 'east' }),         // Iran
  // === Phase 3: Pairs and triples — tempo up (11 threats, 37-54s) ===
  threat(10, 37, 'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(11, 37, 'cruise', "Ra'anana",        true,  9,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  threat(12, 41, 'drone',  'Petah Tikva',     true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(13, 44, 'rocket', 'Rishon LeZion',   true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(14, 44, 'drone',  'Netanya',         true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon (pair!)
  threat(15, 48, 'cruise', 'Tel Aviv',        true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(16, 48, 'rocket', 'Holon',           true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(17, 51, 'cruise', 'Gush Etzion',     true,  10, 'full', 1.0, { origin: 'east' }),         // Iran
  threat(18, 54, 'rocket', 'Netanya',         true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(19, 54, 'cruise', "Modi'in",         true,  9,  'full', 1.0, { origin: 'east' }),         // Iran (pair — was triple, removed drone for pacing)
  // === Phase 4: Heavy overlap — heartland under fire (9 threats, 58-73s) ===
  threat(21, 58, 'cruise', 'Jerusalem',       true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(22, 58, 'rocket', 'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(23, 61, 'drone',  'Judean Hills',    false, 10, 'full', 1.0, { origin: 'north' }),        // hold fire
  threat(24, 64, 'cruise', "Modi'in",         true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(25, 64, 'rocket', 'Holon',           true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(26, 69, 'drone',  "Ra'anana",        true,  9,  'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(27, 69, 'cruise', 'Gush Etzion',     true,  9,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  threat(28, 73, 'rocket', 'Rishon LeZion',   true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(29, 73, 'cruise', 'Tel Aviv',        true,  8,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  // === Phase 5: Intense closing — triples and rapid fire (14 threats, 77-110s) ===
  threat(30, 77, 'rocket', 'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(31, 77, 'cruise', 'Jerusalem',       true,  8,  'full', 1.0, { origin: 'east' }),         // Iran (pair — was triple, removed drone for pacing)
  threat(33, 82, 'rocket', 'Netanya',         true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(34, 82, 'cruise', 'Coastal Plain',   false, 9,  'full', 1.0, { origin: 'east' }),         // hold fire (pair)
  threat(35, 86, 'drone',  'Netanya',         true,  9,  'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(36, 86, 'rocket', 'Holon',           true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(37, 91, 'cruise', "Ra'anana",        true,  8,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(38, 91, 'rocket', 'Rishon LeZion',   true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(39, 96, 'drone',  "Modi'in",         true,  9,  'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(40, 96, 'cruise', 'Gush Etzion',     true,  8,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  threat(41, 101,'rocket', 'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(42, 101,'cruise', 'Tel Aviv',        true,  8,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  threat(43, 106,'rocket', 'Netanya',         true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  // === HOLD-FIRE ROCKETS — unguided rockets missing populated areas (~41% miss rate) ===
  threat(44, 6,  'rocket', 'Judean Hills',              false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(45, 18, 'rocket', 'Mediterranean (off-coast)', false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(46, 28, 'rocket', 'Northern Negev',            false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(47, 38, 'rocket', 'Coastal Plain',             false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(48, 47, 'rocket', 'Judean Hills',              false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(49, 56, 'rocket', 'Mediterranean (off-coast)', false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(50, 66, 'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(51, 79, 'rocket', 'Coastal Plain',             false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(52, 89, 'rocket', 'Judean Hills',              false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(53, 100,'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
];

// ============================================================
// LEVEL 4: Strategic Threats — Ballistic + all previous, introduces Arrow 2
// Duration: 120s | 38 threats (33 live, 5 hold-fire)
// Drone hold-fire: ~8%. Cruise: ~8%. Ballistic: ~19%.
// Geography: Full country view. Critical infrastructure targets.
// NEW: ballistic missiles from Iran targeting strategic infrastructure.
// Targets: Jerusalem, Tel Aviv, Haifa (population centers),
//   BAZAN Oil Refinery, Orot Rabin, Rutenberg (energy),
//   Sorek Desalination Plant (water), Ashdod Port (transport),
//   Dimona Nuclear Reactor (nuclear), The Kirya/IDF HQ, IAI (command/defense).
// Educational: teaches WHY missile defense matters — it's not just cities.
// ============================================================
const THREATS_L4 = [
  // === Warm-up — drone + cruise, then first ballistic (5 threats, 4-22s) ===
  threat(1,  4,  'drone',     'BAZAN Oil Refinery',       true,  11, 'full', 1.0, { origin: 'north' }),        // Hezbollah → energy
  threat(2,  9,  'cruise',    'The Kirya (IDF HQ)',       true,  10, 'full', 1.0, { origin: 'east' }),         // Iran → command
  threat(3,  14, 'drone',     'Negev Desert',             false, 11, 'full', 1.0, { origin: 'east' }),         // hold fire
  threat(4,  18, 'ballistic', 'Dimona Nuclear Reactor',   true,  12, 'full', 0.40, { origin: 'east', priority: true }),  // ★ First ballistic! Iran → nuclear
  threat(5,  22, 'cruise',    'Orot Rabin Power Station', true,  10, 'full', 1.0, { origin: 'east' }),         // Iran → energy
  // === Mixed pairs — pressure builds (8 threats, 27-48s) ===
  threat(6,  27, 'ballistic', 'Tel Aviv',                 true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → population
  threat(7,  30, 'drone',     'Rutenberg Power Station',  true,  11, 'full', 1.0, { origin: 'north' }),        // Hezbollah → energy
  threat(8,  33, 'cruise',    'Haifa',                    true,  10, 'full', 1.0, { origin: 'east' }),         // Iran → population
  threat(9,  33, 'drone',     'Sorek Desalination Plant',  true,  11, 'full', 1.0, { origin: 'north' }),        // Hezbollah → water (pair!)
  threat(10, 37, 'ballistic', 'Sorek Desalination Plant', true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → water
  threat(11, 40, 'cruise',    'Ben Gurion Airport',    true,  10, 'full', 1.0, { origin: 'east' }),         // Iran → defense industry
  threat(12, 44, 'drone',     'Ashdod Port',              true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → transport
  threat(13, 48, 'ballistic', 'Jerusalem',                true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → population
  // === Triples — real pressure (8 threats, 53-72s) ===
  threat(14, 53, 'ballistic', 'Dimona Nuclear Reactor',   true,  11, 'full', 0.35, { origin: 'east', priority: true }),  // Iran → nuclear
  threat(15, 55, 'cruise',    'BAZAN Oil Refinery',       true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → energy
  threat(16, 55, 'drone',     'The Kirya (IDF HQ)',       true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → command (pair!)
  threat(17, 59, 'ballistic', 'Orot Rabin Power Station', true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → energy
  threat(18, 62, 'cruise',    'Northern Negev',           false, 9,  'full', 1.0, { origin: 'east' }),         // hold fire
  threat(19, 65, 'drone',     'Sorek Desalination Plant', true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → water
  threat(20, 68, 'ballistic', 'Haifa',                    true,  10, 'full', 0.40, { origin: 'east' }),        // Iran → population
  threat(21, 72, 'cruise',    'Rutenberg Power Station',  true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → energy
  // === Final surge — tight multi-threat waves (16 threats, 77-112s) ===
  threat(22, 77, 'drone',     'Ben Gurion Airport',    true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → defense industry
  threat(23, 80, 'ballistic', 'Tel Aviv',                 true,  10, 'full', 0.35, { origin: 'east' }),        // Iran → population
  threat(24, 83, 'cruise',    'Ashdod Port',              true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → transport
  threat(25, 83, 'drone',     'The Kirya (IDF HQ)',        true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → command (pair!)
  threat(26, 87, 'ballistic', 'Sorek Desalination Plant', true,  10, 'full', 0.40, { origin: 'east' }),        // Iran → water
  threat(27, 90, 'cruise',    'Jerusalem',                true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → population
  threat(28, 93, 'drone',     'BAZAN Oil Refinery',       true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → energy
  threat(29, 96, 'ballistic', 'The Kirya (IDF HQ)',       true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → command
  threat(30, 99, 'cruise',    'Orot Rabin Power Station', true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → energy
  threat(31, 103,'ballistic', 'Dimona Nuclear Reactor',   true,  10, 'full', 0.35, { origin: 'east', priority: true }),  // Iran → nuclear
  threat(32, 106,'drone',     'Haifa',                    true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → population
  threat(34, 109,'ballistic', 'Ben Gurion Airport',    true,  10, 'full', 0.40, { origin: 'east' }),        // Iran → defense industry
  threat(36, 112,'cruise',    'Tel Aviv',                 true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → population
  threat(37, 112,'ballistic', 'Jerusalem',                true,  10, 'full', 0.40, { origin: 'east' }),        // Iran → population (pair!)
  // === HOLD-FIRE BALLISTIC — ~19% miss rate for guided ballistics ===
  threat(38, 25, 'ballistic', 'Negev Desert',            false, 11, 'full', 0.45, { origin: 'east' }),
  threat(39, 58, 'ballistic', 'Dead Sea Region',         false, 10, 'full', 0.45, { origin: 'east' }),
  threat(40, 95, 'ballistic', 'Jordan Valley',           false, 10, 'full', 0.45, { origin: 'east' }),
];

// ============================================================
// THREATS_L5 array — Used by LEVEL 6 (Wave Assault)
// Duration: 150s | 48 threats (39 live, 9 hold-fire)
// Rocket hold-fire: ~43%. Drone: ~10%. Cruise: ~8%. Ballistic: ~14%. Hypersonic: 0%.
// Geography: Full country view. All 5 origins active (Yemen).
// All 5 threat types including hypersonic (added for L6 use).
// Wave assault from all fronts — expanded geography IS the challenge.
// ============================================================
const THREATS_L5 = [
  // === Phase 1: Full map introduction — showcase all 5 origins (6 threats, 4-22s) ===
  threat(1,  4,  'drone',     'Haifa',           true,  12, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(2,  9,  'rocket',    'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(3,  14, 'cruise',    'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(4,  17, 'drone',     'Golan Heights',   false, 11, 'full', 1.0, { origin: 'northeast' }),   // hold fire, Syria
  threat(5,  20, 'ballistic', 'Nevatim AFB',     true,  12, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(6,  22, 'drone',     'Eilat',           true,  11, 'full', 1.0, { origin: 'southeast' }),   // Yemen — first time!
  // === Phase 2: Pairs from multiple origins (10 threats, 28-52s) ===
  threat(7,  28, 'cruise',    'Jerusalem',       true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(8,  30, 'rocket',    'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(9,  34, 'ballistic', 'Tel Aviv',        true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(10, 34, 'drone',     'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen (pair!)
  threat(11, 38, 'cruise',    'Netanya',         true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(12, 41, 'rocket',    'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(13, 44, 'ballistic', 'Haifa',           true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(14, 44, 'drone',     'Netanya',         true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon (pair!)
  threat(15, 48, 'cruise',    'Beersheba',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(16, 52, 'ballistic', 'Negev Desert',    false, 11, 'full', 0.45, { origin: 'east' }),       // hold fire
  // === Phase 3: Triples — multi-front pressure (10 threats, 58-82s) ===
  threat(17, 58, 'hypersonic', 'Dimona',          true,  8,  'full', 0.35, { origin: 'east', priority: true }),  // Iran → strategic (hypersonic)
  threat(18, 59, 'cruise',    'Haifa',           true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(19, 61, 'rocket',    'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza (triple!)
  threat(20, 65, 'drone',     'Ashkelon',        true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(21, 67, 'ballistic', 'Ramat David AFB', true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → base
  threat(22, 70, 'cruise',    'Tel Aviv',        true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(23, 73, 'drone',     'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen → population
  threat(24, 76, 'ballistic', 'Jerusalem',       true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(25, 79, 'cruise',    'Netanya',         true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(26, 82, 'rocket',    'Netivot',         true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  // === Phase 4: Quads and sustained barrage (10 threats, 88-112s) ===
  threat(27, 88, 'hypersonic', 'Palmachim AFB',   true,  8,  'full', 0.40, { origin: 'east' }),       // Iran → base (hypersonic)
  threat(28, 88, 'cruise',    'Beersheba',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran (pair!)
  threat(29, 91, 'drone',     'Eilat',           true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(30, 93, 'rocket',    'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(31, 97, 'hypersonic', 'Tel Aviv',        true,  8,  'full', 0.35, { origin: 'east' }),       // Iran (hypersonic quad!)
  threat(32, 97, 'cruise',    'Jerusalem',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(33, 99, 'drone',     'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(34, 102,'rocket',    'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(35, 107,'ballistic', 'Nevatim AFB',     true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → base
  threat(36, 110,'cruise',    'Dead Sea Region', false, 9,  'full', 1.0, { origin: 'east' }),        // hold fire
  // === Phase 5: Closing barrage — relentless (6 threats, 120-140s) ===
  threat(37, 120,'hypersonic', 'Dimona',          true,  8,  'full', 0.35, { origin: 'east', priority: true }),  // Iran → strategic (hypersonic)
  threat(38, 123,'cruise',    'Tel Aviv',        true,  8,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(39, 127,'drone',     'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(40, 130,'hypersonic', 'Haifa',           true,  8,  'full', 0.35, { origin: 'east' }),       // Iran (hypersonic)
  threat(41, 134,'rocket',    'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(42, 138,'cruise',    'Netanya',         true,  8,  'full', 1.0, { origin: 'north' }),       // Lebanon
  // === HOLD-FIRE ROCKETS — unguided rockets missing populated areas (~43% miss rate) ===
  threat(43, 7,  'rocket', 'Northern Negev',            false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(44, 25, 'rocket', 'Mediterranean (off-coast)', false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(45, 46, 'rocket', 'Negev Desert',              false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(46, 70, 'rocket', 'Sinai Border Region',       false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(47, 95, 'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(48, 115,'rocket', 'Mediterranean (off-coast)', false, 6,  'full', 1.0, { origin: 'gaza' }),
];

// ============================================================
// THREATS_L6 array — Used by LEVEL 5 (Army Bases)
// Duration: 150s | 47 threats (35 live, 12 hold-fire) in clear waves
// Rocket hold-fire: ~44%. Drone: ~17%. Cruise: ~14%. Ballistic: ~22%. Hypersonic: ~11%.
// Hypersonic glide vehicles from Iran → requires Arrow 3.
// Teaching moment at t=22, then escalating integration.
// Army base targets ONLY + all threat types including hypersonic.
// ============================================================
const THREATS_L6 = [
  // WAVE 1: Warm-up — familiar threats at bases (3 threats, 4-12s)
  threat(1,  4,  'drone',      'Nevatim AFB',       true,  13, 'full', 1.0, { origin: 'southeast' }),   // Yemen → south base
  threat(2,  8,  'rocket',     'Palmachim AFB',     true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza → coastal base
  threat(3,  12, 'cruise',     'Glilot (Unit 8200)',true,  10, 'full', 1.0, { origin: 'east' }),        // Iran → intelligence HQ
  // WAVE 2: First hypersonic! (single, clear teaching moment)
  threat(4,  22, 'hypersonic', 'Sdot Micha',        true,  10, 'full', 0.40, { origin: 'east' }),       // ★ First hypersonic! Iran → strategic missile base
  threat(5,  28, 'ballistic',  'Negev Desert',      false, 11, 'full', 0.45, { origin: 'east' }),       // hold fire
  // WAVE 3: Second hypersonic + familiar mix
  threat(6,  34, 'cruise',     'Ramat David AFB',   true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon → northern air base
  threat(7,  36, 'hypersonic', 'Palmachim AFB',     true,  9,  'full', 0.40, { origin: 'east' }),       // Iran → missile test base
  threat(8,  38, 'rocket',     'Nevatim AFB',       true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza → south base
  // WAVE 4: Pressure builds — ballistic + hypersonic pair
  threat(9,  46, 'ballistic',  'Nevatim AFB',       true,  11, 'full', 0.40, { origin: 'east' }),       // Iran → south base
  threat(10, 48, 'hypersonic', 'Glilot (Unit 8200)',true,  9,  'full', 0.40, { origin: 'east' }),       // Iran → intelligence HQ
  threat(11, 48, 'drone',      'Arava Valley',      false, 11, 'full', 1.0, { origin: 'southeast' }),   // hold fire
  // WAVE 5: Heavy pressure — 4 simultaneous
  threat(12, 57, 'cruise',     'Tel Nof AFB',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran → central air base
  threat(13, 57, 'rocket',     'Palmachim AFB',     true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza → coastal base
  threat(14, 59, 'ballistic',  'Nevatim AFB',       true,  10, 'full', 0.35, { origin: 'east' }),                   // Iran → south base (F-35s)
  threat(15, 59, 'hypersonic', 'Ramat David AFB',   true,  8,  'full', 0.35, { origin: 'east' }),       // Iran → northern air base
  // WAVE 6: Mixed with hold fires
  threat(16, 69, 'drone',      'Palmachim AFB',     true,  11, 'full', 1.0, { origin: 'east' }),        // Iran → coastal base
  threat(17, 69, 'cruise',     'Dead Sea Region',   false, 9,  'full', 1.0, { origin: 'east' }),        // hold fire
  threat(18, 71, 'ballistic',  'Sdot Micha',        true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → strategic missile base
  threat(19, 71, 'rocket',     'Tel Nof AFB',       true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza → central base
  // WAVE 7: Escalation
  threat(20, 82, 'hypersonic', 'Nevatim AFB',       true,  8,  'full', 0.40, { origin: 'east' }),       // Iran → south base
  threat(21, 84, 'cruise',     'Glilot (Unit 8200)',true,  9,  'full', 1.0, { origin: 'east' }),        // Iran → intelligence HQ
  threat(22, 85, 'rocket',     'Ramon AFB',         true,  6,  'full', 1.0, { origin: 'southeast' }),   // Yemen → deep south base
  // WAVE 8: Sustained pressure
  threat(23, 94, 'ballistic',  'Ramat David AFB',   true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → northern air base
  threat(24, 95, 'drone',      'Sdot Micha',        true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria → missile base
  threat(25, 97, 'hypersonic', 'Sdot Micha',        true,  8,  'full', 0.35, { origin: 'east' }),                   // Iran → strategic missile base
  threat(26, 97, 'rocket',     'Palmachim AFB',     true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza → coastal base
  // WAVE 9: Heavy quad
  threat(27, 108,'cruise',     'Glilot (Unit 8200)',true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon → intelligence HQ
  threat(28, 108,'ballistic',  'Palmachim AFB',     true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → coastal base
  threat(29, 110,'hypersonic', 'Tel Nof AFB',       true,  8,  'full', 0.35, { origin: 'east' }),                   // Iran → central air base
  threat(30, 110,'rocket',     'Ramat David AFB',   true,  6,  'full', 1.0, { origin: 'north' }),       // Hezbollah → northern base
  // WAVE 10: Final massive wave
  threat(31, 122,'hypersonic', 'Sdot Micha',        true,  8,  'full', 0.35, { origin: 'east' }),       // Iran → strategic missile base
  threat(32, 122,'ballistic',  'Ramat David AFB',   true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → northern air base
  threat(33, 124,'cruise',     'Nevatim AFB',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran → south base
  threat(34, 124,'drone',      'Tel Nof AFB',       true,  11, 'full', 1.0, { origin: 'north' }),       // Lebanon → central base
  threat(35, 126,'rocket',     'Ramon AFB',         true,  6,  'full', 1.0, { origin: 'southeast' }),   // Yemen → deep south base
  threat(36, 126,'hypersonic', 'Central Negev',     false, 8,  'full', 0.50, { origin: 'east' }),       // hold fire
  // Trailing threats
  threat(37, 135,'ballistic',  'Sdot Micha',        true,  10, 'full', 0.35, { origin: 'east' }),       // Iran → strategic missile base
  threat(38, 138,'rocket',     'Nevatim AFB',       true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza → south base
  // Additional hold-fire threats — all 5 threat types covered
  threat(39, 40, 'rocket',    'Sinai Border Region',  false, 7,  'full', 1.0, { origin: 'gaza' }),        // hold fire — rocket dud
  threat(40, 62, 'ballistic', 'Judean Desert',        false, 10, 'full', 0.45, { origin: 'east' }),       // hold fire — ballistic dud
  threat(41, 90, 'drone',     'Ramat David AFB',       true,  11, 'full', 1.0, { origin: 'northeast' }),   // Syria → northern air base
  // === HOLD-FIRE ROCKETS — unguided rockets missing bases (~44% miss rate) ===
  threat(42, 15, 'rocket', 'Sinai Border Region',      false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(43, 32, 'rocket', 'Negev Desert',              false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(44, 52, 'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(45, 74, 'rocket', 'Sinai Border Region',       false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(46, 100,'rocket', 'Negev Desert',              false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(47, 130,'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
];

// ============================================================
// LEVEL 7: Final Stand — Multi-Front Simultaneous Salvos
// Duration: 150s | 59 threats (45 live, 14 hold-fire), ZERO ammo margin
// Rocket hold-fire: ~44%. Drone: ~22%. Cruise: ~17%. Ballistic: ~20%. Hypersonic: 0%.
// MECHANIC: Every wave fires from multiple origins simultaneously.
// 360° cognitive overload — player must scan entire radar constantly.
// Final salvo: ALL 5 origins fire at once.
// ============================================================
const THREATS_L7 = [
  // === SALVO 1: Opening — 3 origins at once (4 threats, 4-8s) ===
  threat(1,  4,  'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(2,  4,  'drone',      'Nahariya',        true,  12, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(3,  6,  'cruise',     'Eilat',           true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(4,  8,  'ballistic',  'Negev Desert',    false, 11, 'full', 0.45, { origin: 'east' }),       // hold fire, Iran
  // === SALVO 2: 4 origins (5 threats, 18-22s) ===
  threat(5,  18, 'ballistic',  'Tel Aviv',        true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(6,  18, 'rocket',     'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(7,  20, 'drone',      'Katzrin',         true,  11, 'full', 1.0, { origin: 'northeast' }),   // Syria
  threat(8,  20, 'cruise',     'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(9,  22, 'drone',      'Arava Valley',    false, 11, 'full', 1.0, { origin: 'southeast' }),   // hold fire
  // === SALVO 3: All 5 origins! (5 threats, 34-38s) ===
  threat(10, 34, 'hypersonic', 'Jerusalem',       true,  9,  'full', 0.40, { origin: 'east' }),       // Iran
  threat(11, 34, 'rocket',     'Kfar Aza',        true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(12, 36, 'drone',      'Haifa',           true,  11, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(13, 36, 'cruise',     'Arad',            true,  9,  'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(14, 38, 'ballistic',  'Golan Heights',   false, 10, 'full', 0.45, { origin: 'northeast' }), // hold fire, Syria
  // === SALVO 4: Quad — 4 origins (5 threats, 48-52s) ===
  threat(15, 48, 'hypersonic', 'Haifa',           true,  8,  'full', 0.35, { origin: 'east' }),       // Iran
  threat(16, 48, 'drone',      'Beersheba',       true,  11, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(17, 50, 'ballistic',  'Dimona',          true,  10, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(18, 50, 'rocket',     'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(19, 52, 'cruise',     'Central Negev',   false, 9,  'full', 1.0, { origin: 'east' }),        // hold fire
  // === SALVO 5: Triple front (4 threats, 62-66s) ===
  threat(20, 62, 'hypersonic', 'Tel Aviv',        true,  8,  'full', 0.35, { origin: 'east' }),       // Iran
  threat(21, 62, 'cruise',     'Netanya',         true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(22, 64, 'rocket',     'Be\'eri',         true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(23, 66, 'ballistic',  'Nevatim AFB',     true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → base
  // === SALVO 6: 4 origins again (5 threats, 76-80s) ===
  threat(24, 76, 'cruise',     'Jerusalem',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(25, 76, 'drone',      'Majdal Shams',    true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria
  threat(26, 78, 'hypersonic', 'Netanya',         true,  8,  'full', 0.35, { origin: 'east' }),       // Iran
  threat(27, 78, 'rocket',     'Netivot',         true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(28, 80, 'drone',      'Judean Hills',    false, 11, 'full', 1.0, { origin: 'east' }),        // hold fire
  // === SALVO 7: All 5 origins — escalation (5 threats, 90-95s) ===
  threat(29, 90, 'ballistic',  'Ramat David AFB', true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → base
  threat(30, 90, 'rocket',     'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(31, 92, 'hypersonic', 'Beersheba',       true,  8,  'full', 0.35, { origin: 'east' }),       // Iran
  threat(32, 92, 'drone',      'Akko',            true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(33, 95, 'cruise',     'Eilat',           true,  9,  'full', 1.0, { origin: 'southeast' }),   // Yemen
  // === SALVO 8: Pre-final push (4 threats, 107-112s) ===
  threat(34, 107,'ballistic',  'Palmachim AFB',   true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → base
  threat(35, 107,'cruise',     'Holon',           true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(36, 110,'hypersonic', 'Dimona',          true,  8,  'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(37, 112,'rocket',     'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  // === FINAL SALVO — ALL 5 ORIGINS SIMULTANEOUSLY (7 threats, 135-140s) ===
  threat(38, 135,'hypersonic', 'Tel Aviv',        true,  8,  'full', 0.35, { origin: 'east', is_final_salvo: true }),       // Iran
  threat(39, 135,'rocket',     'Sderot',          true,  6,  'full', 1.0,  { origin: 'gaza', is_final_salvo: true }),       // Gaza
  threat(40, 136,'cruise',     'Haifa',           true,  9,  'full', 1.0,  { origin: 'north', is_final_salvo: true }),      // Lebanon
  threat(41, 136,'drone',      'Beersheba',       true,  11, 'full', 1.0,  { origin: 'southeast', is_final_salvo: true }), // Yemen
  threat(42, 138,'ballistic',  'Jerusalem',       true,  10, 'full', 0.35, { origin: 'east', is_final_salvo: true }),       // Iran
  threat(43, 138,'hypersonic', 'Dimona',          true,  8,  'full', 0.35, { origin: 'east', is_final_salvo: true, priority: true }),  // Iran
  threat(44, 140,'cruise',     'Northern Negev',  false, 9,  'full', 1.0,  { origin: 'northeast', is_final_salvo: true }), // hold fire, Syria
  // === NEW LIVE THREATS — escalation for final level ===
  threat(45, 42, 'ballistic',  'Haifa',           true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → population
  threat(46, 55, 'hypersonic', 'Palmachim AFB',   true,  8,  'full', 0.35, { origin: 'east' }),       // Iran → base
  threat(47, 55, 'cruise',     'Tel Aviv',        true,  9,  'full', 1.0,  { origin: 'north' }),      // Lebanon → population
  threat(48, 85, 'rocket',     'Ashkelon',        true,  6,  'full', 1.0,  { origin: 'gaza' }),       // Gaza
  threat(49, 100,'hypersonic', 'Netanya',         true,  8,  'full', 0.35, { origin: 'east' }),       // Iran → population
  threat(50, 115,'ballistic',  'Sdot Micha',      true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → strategic base
  threat(51, 120,'cruise',     'Ashdod',          true,  9,  'full', 1.0,  { origin: 'east' }),       // Iran → population
  // === HOLD-FIRE ROCKETS — unguided rockets missing populated areas (~44% miss rate) ===
  threat(52, 10, 'rocket', 'Northern Negev',             false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(53, 25, 'rocket', 'Off-course (Jordan)',        false, 7,  'full', 1.0, { origin: 'east' }),
  threat(54, 40, 'rocket', 'Negev Desert',               false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(55, 58, 'rocket', 'Sinai Border Region',        false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(56, 72, 'rocket', 'Mediterranean (off-coast)',  false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(57, 88, 'rocket', 'Off-course (Red Sea)',       false, 6,  'full', 1.0, { origin: 'southeast' }),
  threat(58, 105,'rocket', 'Central Negev',              false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(59, 125,'rocket', 'Off-course (Saudi Arabia)',  false, 6,  'full', 1.0, { origin: 'east' }),
];

// ============================================================
// LEVEL CONFIGURATION
// ============================================================
export const LEVELS = [
  // Level 1: Otef Aza — Rockets + Iron Dome (randomized variants)
  {
    id: 1,
    duration: 80,
    ammo: { iron_dome: 24 },
    available_systems: ['iron_dome'],
    auto_end_delay: 3000,
    new_system: null,
    new_threat: null,
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L1,
    threatVariants: [THREATS_L1, THREATS_L1_B],
  },
  // Level 2: Galil & Golan — Drones + Rockets (still Iron Dome only)
  {
    id: 2,
    duration: 120,
    ammo: { iron_dome: 43 },
    available_systems: ['iron_dome'],
    auto_end_delay: 3000,
    new_system: null,
    new_threat: { type: 'drone', name: 'ATTACK DRONES', description: 'Low altitude, steady flight', speed: 'Mach 0.2–0.5' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L2,
  },
  // Level 3: Central Israel — Cruise Missiles + David's Sling
  {
    id: 3,
    duration: 120,
    ammo: { iron_dome: 24, davids_sling: 17 },
    available_systems: ['iron_dome', 'davids_sling'],
    auto_end_delay: 5000,
    new_system: { key: 'davids_sling', name: "DAVID'S SLING", shortcut: '2', color: '#3b82f6' },
    new_threat: { type: 'cruise', name: 'CRUISE MISSILES', description: 'Low altitude, terrain-following', speed: 'Mach 0.8–1.2' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L3,
  },
  // Level 4: Strategic Threats — Ballistic Missiles + Arrow 2
  {
    id: 4,
    duration: 120,
    ammo: { iron_dome: 12, davids_sling: 12, arrow_2: 15 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2'],
    auto_end_delay: 5000,
    new_system: { key: 'arrow_2', name: 'ARROW 2', shortcut: '3', color: '#ef4444' },
    new_threat: { type: 'ballistic', name: 'BALLISTIC MISSILES', description: 'High arc, fast reentry', speed: 'Mach 7–9.5' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L4,
  },
  // Level 5: Army Bases — Hypersonic Missiles + Arrow 3 (uses THREATS_L6 array)
  {
    id: 5,
    duration: 150,
    ammo: { iron_dome: 15, davids_sling: 7, arrow_2: 8, arrow_3: 9 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2', 'arrow_3'],
    auto_end_delay: 6000,
    new_system: { key: 'arrow_3', name: 'ARROW 3', shortcut: '4', color: '#a855f7' },
    new_threat: { type: 'hypersonic', name: 'HYPERSONIC GLIDE VEHICLES', description: 'Exo-atmospheric, extreme speed', speed: 'Mach 12–16' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L6,
  },
  // Level 6: Wave Assault — all types from all fronts, full geography (uses THREATS_L5 array)
  {
    id: 6,
    duration: 150,
    ammo: { iron_dome: 18, davids_sling: 12, arrow_2: 7, arrow_3: 6 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2', 'arrow_3'],
    auto_end_delay: 6000,
    new_system: null,
    new_threat: null,
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L5,
  },
  // Level 7: Final Stand — multi-front simultaneous salvos, tight ammo
  {
    id: 7,
    duration: 150,
    ammo: { iron_dome: 17, davids_sling: 10, arrow_2: 8, arrow_3: 10 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2', 'arrow_3'],
    auto_end_delay: 8000,
    new_system: null,
    new_threat: null,
    final_salvo_warning_time: 115,
    final_salvo_start_time: 135,
    threats: THREATS_L7,
  },
];

// -----------------------------------------------------------
// Public API — level-based
// -----------------------------------------------------------
export function getThreats(level) {
  const lvl = LEVELS[level - 1];
  return lvl ? lvl.threats : [];
}

// Pick a random variant for a level (called once per level start).
// Returns the selected threats array. Falls back to default if no variants.
export function pickThreatVariant(level) {
  const lvl = LEVELS[level - 1];
  if (!lvl) return [];
  if (lvl.threatVariants && lvl.threatVariants.length > 0) {
    return lvl.threatVariants[Math.floor(Math.random() * lvl.threatVariants.length)];
  }
  return lvl.threats;
}

export function getLevelConfig(level) {
  return LEVELS[level - 1] || LEVELS[0];
}

export const TOTAL_LEVELS = LEVELS.length;
