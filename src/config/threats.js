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
// Duration: 80s | 30 threats (18 live, 12 hold-fire) | Teaches: intercept + hold fire
// Rocket hold-fire ratio: ~40% — mirrors real Qassam inaccuracy (unguided, most miss)
// Pacing: singles 0-14s → pairs 16-29s → triple 33s → pair 42s → [11s RESPITE] → final 58-65s
// Geography: Gaza border communities. Viewport zoomed tight on south.
// All threats from Gaza. Only Otef Aza cities targeted.
// ============================================================
const THREATS_L1 = [
  // === SINGLES — learn the basics (4 threats, 3-12s) ===
  threat(1,  3,  'rocket', 'Sderot',          true,  8, 'full', 1.0, { origin: 'gaza' }),
  threat(2,  7,  'rocket', 'Northern Negev',  false, 8, 'full', 1.0, { origin: 'gaza' }),     // hold fire
  threat(3,  9,  'rocket', 'Ashkelon',        true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(4,  12, 'rocket', "Be'eri",          true,  7, 'full', 1.0, { origin: 'gaza' }),
  // === PAIRS — waves of 2 (8 threats, 16-29s) ===
  threat(5,  16, 'rocket', 'Kfar Aza',        true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(6,  16, 'rocket', 'Sderot',          true,  7, 'full', 1.0, { origin: 'gaza' }),     // simultaneous pair
  threat(7,  21, 'rocket', 'Northern Negev',  false, 7, 'full', 1.0, { origin: 'gaza' }),     // hold fire
  threat(8,  21, 'rocket', 'Netivot',         true,  7, 'full', 1.0, { origin: 'gaza' }),     // pair with hold fire
  threat(9,  26, 'rocket', "Re'im",           true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(10, 26, 'rocket', 'Ashkelon',        true,  6, 'full', 1.0, { origin: 'gaza' }),     // pair
  threat(11, 29, 'rocket', "Be'eri",          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(12, 29, 'rocket', 'Kfar Aza',        true,  6, 'full', 1.0, { origin: 'gaza' }),     // pair
  // === TRIPLES — waves of 3 with 6s breathing gaps (9 threats, 33-48s) ===
  threat(13, 33, 'rocket', 'Sderot',          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(14, 33, 'rocket', 'Netivot',         true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(15, 33, 'rocket', 'Northern Negev',  false, 6, 'full', 1.0, { origin: 'gaza' }),     // triple! (1 hold fire)
  //                                    === 6s BREATHING GAP ===
  threat(16, 42, 'rocket', 'Ashkelon',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(17, 42, 'rocket', "Re'im",           true,  5, 'full', 1.0, { origin: 'gaza' }),     // pair
  //                                    === 11s RESPITE (resolve t=47 → next t=58) ===
  // === FINAL SURGE — dense pair salvos (4 threats, 58-65s) ===
  threat(22, 58, 'rocket', 'Ashkelon',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(23, 58, 'rocket', 'Netivot',         true,  5, 'full', 1.0, { origin: 'gaza' }),     // pair (was triple — removed 1 for pacing)
  threat(25, 65, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(26, 65, 'rocket', "Be'eri",          true,  5, 'full', 1.0, { origin: 'gaza' }),     // closing pair
  // === HOLD-FIRE — unguided Qassams landing in open ground (~40% miss) ===
  // HF 34-38 removed — they were filling respite gaps between triple/pair and final surge
  threat(27, 5,  'rocket', 'Coastal Plain',             false, 8, 'full', 1.0, { origin: 'gaza' }),
  threat(28, 11, 'rocket', 'Mediterranean (off-coast)',false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(29, 14, 'rocket', 'Negev Desert',             false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(30, 19, 'rocket', 'Southern Negev',           false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(31, 23, 'rocket', 'Sinai Border Region',      false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(32, 28, 'rocket', 'Negev Desert',             false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(33, 31, 'rocket', 'Judean Hills',             false, 6, 'full', 1.0, { origin: 'gaza' }),
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
  // === SINGLES — learn the basics (4 threats, 3-12s) ===
  threat(1,  3,  'rocket', 'Kfar Aza',        true,  8, 'full', 1.0, { origin: 'gaza' }),
  threat(2,  7,  'rocket', 'Northern Negev',  false, 8, 'full', 1.0, { origin: 'gaza' }),     // hold fire
  threat(3,  9,  'rocket', 'Sderot',          true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(4,  12, 'rocket', 'Netivot',         true,  7, 'full', 1.0, { origin: 'gaza' }),
  // === PAIRS — waves of 2 (8 threats, 16-29s) ===
  threat(5,  16, 'rocket', "Re'im",           true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(6,  16, 'rocket', 'Ashkelon',        true,  7, 'full', 1.0, { origin: 'gaza' }),     // simultaneous pair
  threat(7,  21, 'rocket', 'Northern Negev',  false, 7, 'full', 1.0, { origin: 'gaza' }),     // hold fire
  threat(8,  21, 'rocket', "Be'eri",          true,  7, 'full', 1.0, { origin: 'gaza' }),     // pair with hold fire
  threat(9,  26, 'rocket', 'Sderot',          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(10, 26, 'rocket', 'Kfar Aza',        true,  6, 'full', 1.0, { origin: 'gaza' }),     // pair
  threat(11, 29, 'rocket', 'Netivot',         true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(12, 29, 'rocket', "Re'im",           true,  6, 'full', 1.0, { origin: 'gaza' }),     // pair
  // === TRIPLES — waves of 3 with 6s breathing gaps (9 threats, 33-48s) ===
  threat(13, 33, 'rocket', 'Ashkelon',        true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(14, 33, 'rocket', "Be'eri",          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(15, 33, 'rocket', 'Northern Negev',  false, 6, 'full', 1.0, { origin: 'gaza' }),     // triple! (1 hold fire)
  //                                    === 6s BREATHING GAP ===
  threat(16, 42, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(17, 42, 'rocket', 'Kfar Aza',        true,  5, 'full', 1.0, { origin: 'gaza' }),     // pair
  //                                    === 11s RESPITE (resolve t=47 → next t=58) ===
  // === FINAL SURGE — dense pair salvos (4 threats, 58-65s) ===
  threat(22, 58, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(23, 58, 'rocket', "Be'eri",          true,  5, 'full', 1.0, { origin: 'gaza' }),     // pair
  threat(25, 65, 'rocket', 'Kfar Aza',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(26, 65, 'rocket', 'Netivot',         true,  5, 'full', 1.0, { origin: 'gaza' }),     // closing pair
  // === HOLD-FIRE — unguided Qassams landing in open ground (~40% miss) ===
  // HF 34-38 removed — they were filling respite gaps
  threat(27, 5,  'rocket', 'Coastal Plain',             false, 8, 'full', 1.0, { origin: 'gaza' }),
  threat(28, 11, 'rocket', 'Mediterranean (off-coast)',false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(29, 14, 'rocket', 'Negev Desert',             false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(30, 19, 'rocket', 'Southern Negev',           false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(31, 23, 'rocket', 'Sinai Border Region',      false, 7, 'full', 1.0, { origin: 'gaza' }),
  threat(32, 28, 'rocket', 'Negev Desert',             false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(33, 31, 'rocket', 'Judean Hills',             false, 6, 'full', 1.0, { origin: 'gaza' }),
  threat(39, 61, 'rocket', 'Negev Desert',             false, 5, 'full', 1.0, { origin: 'gaza' }),
  threat(40, 68, 'rocket', 'Dead Sea Region',          false, 5, 'full', 1.0, { origin: 'gaza' }),
];

// ============================================================
// LEVEL 2: Galil, Haifa & Golan — Drones + Rockets, Iron Dome
// Duration: 128s | 48 threats (34 live, 14 hold-fire) | Introduces: drones
// Rocket hold-fire ratio: ~23% (unguided). Drone hold-fire: ~16% (GPS-guided, more accurate).
// Geography: Northern Israel. Viewport zoomed tight on north.
// Threats from Lebanon (north) and Syria (northeast). No Gaza threats.
// Respite design: HF rockets cleared from gap periods so 7-9s designed gaps are real respites.
// ============================================================
const THREATS_L2 = [
  // === SINGLES — intro to drones (4 threats, 3-13s) ===
  threat(1,  3,  'rocket', 'Haifa',            true,  8, 'full', 1.0, { origin: 'north' }),         // Lebanon
  threat(2,  7,  'rocket', 'Western Galilee',  false, 8, 'full', 1.0, { origin: 'north' }),         // hold fire
  threat(3,  10, 'drone',  'Nahariya',         true,  11, 'full', 1.0, { origin: 'north' }),        // First drone!
  threat(4,  13, 'rocket', 'Kiryat Shmona',    true,  7, 'full', 1.0, { origin: 'north' }),
  // === PAIRS — mixed drones + rockets (10 threats, 17-33s) ===
  threat(5,  17, 'drone',  'Akko',             true,  10, 'full', 1.0, { origin: 'north' }),
  threat(6,  17, 'rocket', 'Teveriah',         true,  7,  'full', 1.0, { origin: 'northeast' }),    // simultaneous pair
  threat(7,  22, 'rocket', 'Tzfat',            true,  7,  'full', 1.0, { origin: 'north' }),
  threat(8,  22, 'drone',  'Golan Heights',    false, 10, 'full', 1.0, { origin: 'northeast' }),    // hold fire pair
  threat(9,  26, 'drone',  'Haifa',            true,  10, 'full', 1.0, { origin: 'north' }),
  threat(10, 26, 'rocket', 'Katzrin',          true,  7,  'full', 1.0, { origin: 'northeast' }),    // pair
  threat(11, 29, 'rocket', 'Nahariya',         true,  7,  'full', 1.0, { origin: 'north' }),
  // T12 (drone, Kiryat Shmona) removed — was bridging into TRIPLES respite
  threat(13, 33, 'rocket', 'Akko',             true,  6,  'full', 1.0, { origin: 'north' }),
  // T14 (HF rocket) removed — was bridging into TRIPLES respite
  //                                    === 6s BREATHING GAP (T13 ends t=39 → TRIPLES at t=45) ===
  // === TRIPLES — pressure waves (10 threats, 45-72s) ===
  threat(15, 45, 'rocket', 'Haifa',            true,  6,  'full', 1.0, { origin: 'north' }),
  threat(16, 45, 'drone',  'Majdal Shams',     true,  9,  'full', 1.0, { origin: 'northeast' }),
  threat(17, 45, 'rocket', 'Tzfat',            true,  6,  'full', 1.0, { origin: 'north' }),        // triple!
  //                                    === 9s sub-wave gap ===
  threat(18, 54, 'drone',  'Teveriah',         true,  9,  'full', 1.0, { origin: 'northeast' }),
  threat(19, 54, 'rocket', 'Nahariya',         true,  6,  'full', 1.0, { origin: 'north' }),        // pair (reduced from triple)
  //                                    === 9s sub-wave gap ===
  threat(21, 63, 'rocket', 'Kiryat Shmona',    true,  6,  'full', 1.0, { origin: 'north' }),
  threat(22, 63, 'rocket', 'Katzrin',          true,  6,  'full', 1.0, { origin: 'northeast' }),
  threat(23, 63, 'drone',  'Western Galilee',  false, 9,  'full', 1.0, { origin: 'north' }),        // triple! (1 hold fire)
  //                                    === 9s sub-wave gap ===
  threat(24, 72, 'drone',  'Haifa',            true,  9,  'full', 1.0, { origin: 'north' }),
  threat(25, 72, 'rocket', 'Majdal Shams',     true,  6,  'full', 1.0, { origin: 'northeast' }),    // pair
  //                                    === CONTINUOUS into HEAVY ===
  // === HEAVY SALVOS — pairs and triples (7 threats, 81-103s) ===
  threat(27, 81, 'rocket', 'Haifa',            true,  5,  'full', 1.0, { origin: 'north' }),
  threat(28, 81, 'drone',  'Kiryat Shmona',    true,  9,  'full', 1.0, { origin: 'north' }),        // pair
  threat(30, 88, 'drone',  'Nahariya',         true,  8,  'full', 1.0, { origin: 'north' }),
  threat(31, 88, 'rocket', 'Teveriah',         true,  5,  'full', 1.0, { origin: 'northeast' }),
  threat(33, 88, 'drone',  'Upper Galilee',    false, 8,  'full', 1.0, { origin: 'north' }),        // triple (1 hold fire)
  //                                    === 8s sub-wave gap ===
  threat(34, 96, 'rocket', 'Haifa',            true,  5,  'full', 1.0, { origin: 'north' }),
  threat(35, 96, 'drone',  'Tzfat',            true,  8,  'full', 1.0, { origin: 'north' }),        // pair (reduced from triple)
  // T37 (drone, Teveriah) removed — was bridging into CLOSING respite
  threat(38, 103,'rocket', 'Akko',             true,  5,  'full', 1.0, { origin: 'north' }),
  threat(39, 103,'rocket', 'Golan Heights',    false, 5,  'full', 1.0, { origin: 'northeast' }),    // pair (1 hold fire)
  //                                    === 6s BREATHING GAP (T38/39 end t=108 → CLOSING at t=114) ===
  // === CLOSING BARRAGE (8 threats, 114-127s) ===
  threat(40, 114,'rocket', 'Nahariya',         true,  5,  'full', 1.0, { origin: 'north' }),
  threat(41, 114,'drone',  'Haifa',            true,  8,  'full', 1.0, { origin: 'north' }),        // pair
  threat(43, 119,'drone',  'Kiryat Shmona',    true,  8,  'full', 1.0, { origin: 'north' }),
  threat(44, 119,'rocket', 'Tzfat',            true,  5,  'full', 1.0, { origin: 'north' }),        // pair!
  threat(45, 123,'rocket', 'Haifa',            true,  5,  'full', 1.0, { origin: 'north' }),
  threat(46, 123,'drone',  'Akko',             true,  8,  'full', 1.0, { origin: 'north' }),        // pair
  threat(48, 127,'drone',  'Teveriah',         true,  7,  'full', 1.0, { origin: 'northeast' }),
  threat(49, 127,'rocket', 'Nahariya',         true,  5,  'full', 1.0, { origin: 'north' }),        // closing pair!
  // === HOLD-FIRE ROCKETS — unguided rockets landing in open ground (~40% miss rate) ===
  // HF 55-59 removed — they were filling designed respite gaps in first 2/3 of level
  threat(50, 5,  'rocket', 'Western Galilee',  false, 8,  'full', 1.0, { origin: 'north' }),
  threat(51, 14, 'rocket', 'Upper Galilee',    false, 7,  'full', 1.0, { origin: 'north' }),
  threat(52, 20, 'rocket', 'Golan Heights',    false, 7,  'full', 1.0, { origin: 'northeast' }),
  threat(53, 25, 'rocket', 'Western Galilee',  false, 7,  'full', 1.0, { origin: 'north' }),
  threat(54, 30, 'rocket', 'Upper Galilee',    false, 7,  'full', 1.0, { origin: 'north' }),
  threat(60, 84, 'rocket', 'Upper Galilee',    false, 5,  'full', 1.0, { origin: 'north' }),
  threat(61, 92, 'rocket', 'Golan Heights',    false, 5,  'full', 1.0, { origin: 'northeast' }),
  threat(62, 100,'rocket', 'Western Galilee',  false, 5,  'full', 1.0, { origin: 'north' }),
  // T63 removed — was bridging into CLOSING respite
  threat(64, 122,'rocket', 'Golan Heights',    false, 5,  'full', 1.0, { origin: 'northeast' }),
];

// ============================================================
// LEVEL 3: Central Israel — Cruise Missiles + all previous
// Duration: 120s | 40 threats (31 live, 9 hold-fire) | Introduces: David's Sling + cruise missiles
// Rocket hold-fire ratio: ~41%. Drone: ~20%. Cruise: ~6%.
// Geography: Wider Central Region — Gaza border visible, Tel Aviv, Jerusalem,
// Modi'in, Ra'anana, Gush Etzion corridor.
// Rockets from Gaza, cruise missiles from Iran, drones from Lebanon.
// Respite design: 5-7s gaps between phases (measured from interception to next launch).
// ============================================================
const THREATS_L3 = [
  // === Phase 1: Warm-up singles (3 threats, 4-11s) ===
  threat(1,  4,  'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(2,  8,  'rocket', 'Rishon LeZion',   true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(3,  11, 'drone',  'Netanya',         true,  11, 'full', 1.0, { origin: 'north' }),        // Lebanon
  // === Phase 2: Introduce cruise missiles (6 threats, 14-30s) ===
  threat(4,  14, 'cruise', 'Tel Aviv',        true,  11, 'full', 1.0, { origin: 'east' }),         // First cruise! Iran
  threat(5,  18, 'rocket', 'Judean Hills',    false, 7,  'full', 1.0, { origin: 'gaza' }),         // hold fire
  threat(6,  21, 'cruise', 'Jerusalem',       true,  10, 'full', 1.0, { origin: 'east' }),         // Iran
  threat(7,  24, 'rocket', 'Holon',           true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  // T8 (HF drone) + T9 (cruise, Modi'in) removed — were bridging into Phase 3 respite
  //                                    === 6s BREATHING GAP (T7 ends t=31, HF46 ends t=32 → P3 at t=38) ===
  // === Phase 3: Pairs with breathing gaps (8 threats, 38-56s) ===
  threat(10, 38, 'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(11, 38, 'cruise', "Ra'anana",        true,  9,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  threat(13, 44, 'rocket', 'Rishon LeZion',   true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(14, 44, 'drone',  'Netanya',         true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon (pair!)
  threat(15, 50, 'cruise', 'Tel Aviv',        true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(16, 50, 'rocket', 'Holon',           true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  // T17 (cruise, Gush Etzion) removed — was bridging into Phase 4 respite
  threat(19, 56, 'cruise', "Modi'in",         true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  //                                    === 6s BREATHING GAP (T19 ends t=65 → P4 at t=71) ===
  // === Phase 4: Heartland under fire (8 threats, 71-87s) ===
  threat(21, 71, 'cruise', 'Jerusalem',       true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(22, 71, 'rocket', 'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(23, 75, 'drone',  'Judean Hills',    false, 10, 'full', 1.0, { origin: 'north' }),        // hold fire
  threat(24, 77, 'cruise', "Modi'in",         true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(25, 77, 'rocket', 'Holon',           true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(26, 83, 'drone',  "Ra'anana",        true,  9,  'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(27, 83, 'cruise', 'Gush Etzion',     true,  9,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  threat(28, 87, 'rocket', 'Rishon LeZion',   true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  // T29 (cruise, Tel Aviv) removed — was bridging into Phase 5 respite
  //                                    === 6s BREATHING GAP (T28 ends t=93 → P5 at t=99) ===
  // === Phase 5: Intense closing — rapid pairs (12 threats, 99-119s) ===
  threat(30, 99, 'rocket', 'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(31, 99, 'cruise', 'Jerusalem',       true,  8,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  threat(33, 103,'rocket', 'Netanya',         true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(34, 103,'cruise', 'Coastal Plain',   false, 9,  'full', 1.0, { origin: 'east' }),         // hold fire (pair)
  threat(35, 107,'drone',  'Netanya',         true,  9,  'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(36, 107,'rocket', 'Holon',           true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(37, 111,'cruise', "Ra'anana",        true,  8,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(38, 111,'rocket', 'Rishon LeZion',   true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza (pair!)
  threat(39, 115,'drone',  "Modi'in",         true,  9,  'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(40, 115,'cruise', 'Gush Etzion',     true,  8,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  threat(41, 119,'rocket', 'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(42, 119,'cruise', 'Tel Aviv',        true,  8,  'full', 1.0, { origin: 'east' }),         // Iran (pair!)
  // === HOLD-FIRE ROCKETS — unguided rockets missing populated areas ===
  // HF 47, 49, 51, 52 removed — they were filling designed respite gaps between phases
  threat(44, 6,  'rocket', 'Judean Hills',              false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(45, 16, 'rocket', 'Mediterranean (off-coast)', false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(46, 25, 'rocket', 'Northern Negev',            false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(48, 46, 'rocket', 'Judean Hills',              false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(50, 73, 'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(53, 109,'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
];

// ============================================================
// LEVEL 4: Strategic Threats — Ballistic + all previous, introduces Arrow 2
// Duration: 130s | 31 threats (27 live, 4 hold-fire)
// Drone hold-fire: ~4%. Cruise: ~4%. Ballistic: ~15%.
// Geography: Full country view. Critical infrastructure targets.
// NEW: ballistic missiles from Iran targeting strategic infrastructure.
// Respite design: 3 clear respites (8s, 7s, 6s) between phases.
// Long countdowns (10-12s) require wider phase spacing than rocket levels.
// ============================================================
const THREATS_L4 = [
  // === Phase 1: Teaching — drone, cruise, then first ballistic (3 threats, 4-18s) ===
  threat(1,  4,  'drone',     'BAZAN Oil Refinery',       true,  11, 'full', 1.0, { origin: 'north' }),        // Hezbollah → energy
  threat(2,  9,  'cruise',    'The Kirya (IDF HQ)',       true,  10, 'full', 1.0, { origin: 'east' }),         // Iran → command
  threat(4,  18, 'ballistic', 'Dimona Nuclear Reactor',   true,  12, 'full', 0.40, { origin: 'east', priority: true }),  // ★ First ballistic! Iran → nuclear
  //                                    === 8s RESPITE (ballistic resolves t=30, next at t=38) ===
  // === Phase 2: Mixed pairs — building pressure (7 threats, 38-55s) ===
  threat(5,  38, 'cruise',    'Orot Rabin Power Station', true,  10, 'full', 1.0, { origin: 'east' }),         // Iran → energy
  threat(6,  41, 'ballistic', 'Ashdod Port',              true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → transport
  threat(7,  44, 'drone',     'Rutenberg Power Station',  true,  11, 'full', 1.0, { origin: 'north' }),        // Hezbollah → energy
  threat(8,  47, 'cruise',    'BAZAN Oil Refinery',       true,  10, 'full', 1.0, { origin: 'east' }),         // Iran → energy
  threat(9,  47, 'drone',     'Sorek Desalination Plant', true,  11, 'full', 1.0, { origin: 'north' }),        // Hezbollah → water (pair!)
  threat(10, 51, 'ballistic', 'Sorek Desalination Plant', true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → water
  threat(11, 55, 'cruise',    'Ben Gurion Airport',       true,  10, 'full', 1.0, { origin: 'east' }),         // Iran → transport
  //                                    === 7s RESPITE (last resolve ~t=65, next at t=72) ===
  // === Phase 3: Triples — real pressure (8 threats, 72-92s) ===
  threat(12, 72, 'ballistic', 'Dimona Nuclear Reactor',   true,  11, 'full', 0.35, { origin: 'east', priority: true }),  // Iran → nuclear
  threat(13, 75, 'cruise',    'BAZAN Oil Refinery',       true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → energy
  threat(14, 75, 'drone',     'The Kirya (IDF HQ)',       true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → command (pair!)
  threat(15, 80, 'ballistic', 'Orot Rabin Power Station', true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → energy
  threat(17, 84, 'drone',     'Sorek Desalination Plant', true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → water
  threat(18, 87, 'ballistic', 'Rutenberg Power Station',  true,  10, 'full', 0.40, { origin: 'east' }),        // Iran → energy
  threat(19, 90, 'cruise',    'Rutenberg Power Station',  true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → energy
  threat(20, 92, 'drone',     'Ben Gurion Airport',       true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → transport
  //                                    === 6s RESPITE (last resolve ~t=102, next at t=108) ===
  // === Phase 4: Final surge — climax (9 threats, 108-122s) ===
  threat(21, 108,'ballistic', 'Ben Gurion Airport',       true,  10, 'full', 0.35, { origin: 'east' }),        // Iran → transport
  threat(22, 108,'cruise',    'Ashdod Port',              true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → transport (pair!)
  threat(23, 111,'drone',     'The Kirya (IDF HQ)',       true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → command
  threat(24, 111,'ballistic', 'Sorek Desalination Plant', true,  10, 'full', 0.40, { origin: 'east' }),        // Iran → water (pair!)
  threat(25, 114,'cruise',    'Orot Rabin Power Station', true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → energy
  threat(26, 114,'drone',     'BAZAN Oil Refinery',       true,  10, 'full', 1.0, { origin: 'north' }),        // Hezbollah → energy (pair!)
  threat(27, 118,'ballistic', 'The Kirya (IDF HQ)',       true,  11, 'full', 0.40, { origin: 'east' }),        // Iran → command
  threat(28, 118,'ballistic', 'Dimona Nuclear Reactor',   true,  10, 'full', 0.35, { origin: 'east', priority: true }),  // Iran → nuclear (pair!)
  threat(29, 122,'cruise',    'Ashdod Port',              true,  9,  'full', 1.0, { origin: 'east' }),         // Iran → transport
  // === HOLD-FIRE — duds/off-course during active phases (NOT in respite gaps) ===
  threat(30, 14, 'drone',     'Negev Desert',             false, 11, 'full', 1.0, { origin: 'east' }),
  threat(31, 55, 'ballistic', 'Dead Sea Region',          false, 10, 'full', 0.45, { origin: 'east' }),
  threat(32, 80, 'cruise',    'Northern Negev',           false, 9,  'full', 1.0, { origin: 'east' }),
  threat(33, 112,'ballistic', 'Jordan Valley',            false, 10, 'full', 0.45, { origin: 'east' }),
];

// ============================================================
// THREATS_L5 array — Used by LEVEL 6 (Wave Assault)
// Duration: 152s | 45 threats (39 live, 6 hold-fire)
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
  // T16 (HF ballistic) removed — was bridging P2→P3 respite gap
  //                                    === 6s BREATHING GAP (T15 ends t=57 → P3 at t=63) ===
  // === Phase 3: Triples — multi-front pressure (10 threats, 63-87s) ===
  threat(17, 63, 'hypersonic', 'Dimona',          true,  8,  'full', 0.35, { origin: 'east', priority: true }),  // Iran → strategic (hypersonic)
  threat(18, 64, 'cruise',    'Haifa',           true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(19, 66, 'rocket',    'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza (triple!)
  threat(20, 70, 'drone',     'Ashkelon',        true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(21, 72, 'ballistic', 'Ramat David AFB', true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → base
  threat(22, 75, 'cruise',    'Tel Aviv',        true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(23, 78, 'drone',     'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen → population
  threat(24, 81, 'ballistic', 'Jerusalem',       true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(25, 84, 'cruise',    'Netanya',         true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(26, 87, 'rocket',    'Netivot',         true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  //                                    === 5s BREATHING GAP (T25/26 end t=93 → P4 at t=98) ===
  // === Phase 4: Quads and sustained barrage (9 threats, 98-117s) ===
  threat(27, 98, 'hypersonic', 'Palmachim AFB',   true,  8,  'full', 0.40, { origin: 'east' }),       // Iran → base (hypersonic)
  threat(28, 98, 'cruise',    'Beersheba',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran (pair!)
  threat(29, 101,'drone',     'Eilat',           true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(30, 103,'rocket',    'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(31, 107,'hypersonic', 'Tel Aviv',        true,  8,  'full', 0.35, { origin: 'east' }),       // Iran (hypersonic quad!)
  threat(32, 107,'cruise',    'Jerusalem',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(33, 109,'drone',     'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(34, 112,'rocket',    'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(35, 117,'ballistic', 'Nevatim AFB',     true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → base
  // T36 (HF cruise) removed — was bridging P4→P5 respite gap
  //                                    === 5s BREATHING GAP (T35 ends t=127 → P5 at t=132) ===
  // === Phase 5: Closing barrage — relentless (6 threats, 132-150s) ===
  threat(37, 132,'hypersonic', 'Dimona',          true,  8,  'full', 0.35, { origin: 'east', priority: true }),  // Iran → strategic (hypersonic)
  threat(38, 135,'cruise',    'Tel Aviv',        true,  8,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(39, 139,'drone',     'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(40, 142,'hypersonic', 'Haifa',           true,  8,  'full', 0.35, { origin: 'east' }),       // Iran (hypersonic)
  threat(41, 146,'rocket',    'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(42, 150,'cruise',    'Netanya',         true,  8,  'full', 1.0, { origin: 'north' }),       // Lebanon
  // === HOLD-FIRE ROCKETS — unguided rockets missing populated areas (~43% miss rate) ===
  threat(43, 7,  'rocket', 'Northern Negev',            false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(44, 25, 'rocket', 'Mediterranean (off-coast)', false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(45, 46, 'rocket', 'Negev Desert',              false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(46, 75, 'rocket', 'Sinai Border Region',       false, 6,  'full', 1.0, { origin: 'gaza' }),
  threat(47, 105,'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
  // T48 (HF rocket) removed — was bridging P4→P5 respite gap
];

// ============================================================
// THREATS_L6 array — Used by LEVEL 5 (Army Bases)
// Duration: 150s | 40 threats (33 live, 7 hold-fire) in clear waves
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
  //                                    === 5s BREATHING GAP (W3 ends t=45 → W4 at t=50) ===
  // WAVE 4: Pressure builds — ballistic + hypersonic pair
  threat(9,  50, 'ballistic',  'Nevatim AFB',       true,  11, 'full', 0.40, { origin: 'east' }),       // Iran → south base
  threat(10, 52, 'hypersonic', 'Glilot (Unit 8200)',true,  9,  'full', 0.40, { origin: 'east' }),       // Iran → intelligence HQ
  threat(11, 52, 'drone',      'Arava Valley',      false, 11, 'full', 1.0, { origin: 'southeast' }),   // hold fire
  // WAVE 5: Heavy pressure — 4 simultaneous
  threat(12, 61, 'cruise',     'Tel Nof AFB',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran → central air base
  threat(13, 61, 'rocket',     'Palmachim AFB',     true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza → coastal base
  threat(14, 63, 'ballistic',  'Nevatim AFB',       true,  10, 'full', 0.35, { origin: 'east' }),                   // Iran → south base (F-35s)
  threat(15, 63, 'hypersonic', 'Ramat David AFB',   true,  8,  'full', 0.35, { origin: 'east' }),       // Iran → northern air base
  // WAVE 6: Mixed with hold fires (threat 19 removed for respite spacing)
  threat(16, 73, 'drone',      'Palmachim AFB',     true,  11, 'full', 1.0, { origin: 'east' }),        // Iran → coastal base
  threat(17, 73, 'cruise',     'Dead Sea Region',   false, 9,  'full', 1.0, { origin: 'east' }),        // hold fire
  threat(18, 75, 'ballistic',  'Sdot Micha',        true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → strategic missile base
  //                                    === 5s BREATHING GAP (W6 ends t=85 → W7 at t=90) ===
  // WAVE 7: Escalation
  threat(20, 90, 'hypersonic', 'Nevatim AFB',       true,  8,  'full', 0.40, { origin: 'east' }),       // Iran → south base
  threat(21, 92, 'cruise',     'Glilot (Unit 8200)',true,  9,  'full', 1.0, { origin: 'east' }),        // Iran → intelligence HQ
  threat(22, 93, 'rocket',     'Ramon AFB',         true,  6,  'full', 1.0, { origin: 'southeast' }),   // Yemen → deep south base
  // WAVE 8: Sustained pressure
  threat(23, 102,'ballistic',  'Ramat David AFB',   true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → northern air base
  threat(24, 103,'drone',      'Sdot Micha',        true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria → missile base
  threat(25, 105,'hypersonic', 'Sdot Micha',        true,  8,  'full', 0.35, { origin: 'east' }),                   // Iran → strategic missile base
  threat(26, 105,'rocket',     'Palmachim AFB',     true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza → coastal base
  // WAVE 9: Heavy quad
  threat(27, 116,'cruise',     'Glilot (Unit 8200)',true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon → intelligence HQ
  threat(28, 116,'ballistic',  'Palmachim AFB',     true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → coastal base
  threat(29, 118,'hypersonic', 'Tel Nof AFB',       true,  8,  'full', 0.35, { origin: 'east' }),                   // Iran → central air base
  threat(30, 118,'rocket',     'Ramat David AFB',   true,  6,  'full', 1.0, { origin: 'north' }),       // Hezbollah → northern base
  // WAVE 10: Final massive wave
  threat(31, 130,'hypersonic', 'Sdot Micha',        true,  8,  'full', 0.35, { origin: 'east' }),       // Iran → strategic missile base
  threat(32, 130,'ballistic',  'Ramat David AFB',   true,  10, 'full', 0.40, { origin: 'east' }),       // Iran → northern air base
  threat(33, 132,'cruise',     'Nevatim AFB',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran → south base
  threat(34, 132,'drone',      'Tel Nof AFB',       true,  11, 'full', 1.0, { origin: 'north' }),       // Lebanon → central base
  threat(35, 134,'rocket',     'Ramon AFB',         true,  6,  'full', 1.0, { origin: 'southeast' }),   // Yemen → deep south base
  threat(36, 134,'hypersonic', 'Central Negev',     false, 8,  'full', 0.50, { origin: 'east' }),       // hold fire
  // Trailing threats
  threat(37, 143,'ballistic',  'Sdot Micha',        true,  10, 'full', 0.35, { origin: 'east' }),       // Iran → strategic missile base
  threat(38, 146,'rocket',     'Nevatim AFB',       true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza → south base
  // Additional hold-fire threats — all 5 threat types covered
  // T39 (HF rocket) removed — was bridging W3→W4 respite gap
  threat(40, 66, 'ballistic', 'Judean Desert',        false, 10, 'full', 0.45, { origin: 'east' }),       // hold fire — ballistic dud
  // threat 41 removed for respite spacing
  // === HOLD-FIRE ROCKETS — unguided rockets missing bases ===
  // HF 43, 44, 45, 46 removed — they were filling respite gaps between waves
  threat(42, 15, 'rocket', 'Sinai Border Region',      false, 7,  'full', 1.0, { origin: 'gaza' }),
  threat(47, 138,'rocket', 'Northern Negev',            false, 6,  'full', 1.0, { origin: 'gaza' }),
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
    ammo: { iron_dome: 22 },
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
    duration: 128,
    ammo: { iron_dome: 37 },
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
    ammo: { iron_dome: 21, davids_sling: 14 },
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
    ammo: { iron_dome: 10, davids_sling: 11, arrow_2: 12 },
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
    ammo: { iron_dome: 13, davids_sling: 7, arrow_2: 8, arrow_3: 9 },
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
    duration: 152,
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
