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

// Command center — single launch point for ALL interceptors
export const COMMAND_CENTER = { x: 0.28, y: 0.38 };

export const POPULATED_ZONES = [
  { name: 'Tel Aviv', x: 0.28, y: 0.35 },
  { name: 'Jerusalem', x: 0.44, y: 0.42 },
  { name: 'Haifa', x: 0.36, y: 0.19 },
  { name: 'Ashdod', x: 0.24, y: 0.41 },
  { name: 'Beersheba', x: 0.29, y: 0.53 },
  { name: 'Eilat', x: 0.35, y: 0.90 },
  { name: 'Dimona', x: 0.37, y: 0.57 },
  { name: 'Netanya', x: 0.31, y: 0.30 },
  { name: 'Ashkelon', x: 0.21, y: 0.44 },
  { name: 'Teveriah', x: 0.55, y: 0.19 },
  { name: 'Tzfat', x: 0.54, y: 0.15 },
  { name: 'Kiryat Shmona', x: 0.56, y: 0.10 },
  { name: 'Sderot', x: 0.22, y: 0.47 },
  { name: 'Nahariya', x: 0.39, y: 0.15 },
];

export const THREAT_COLORS = {
  drone: '#eab308',
  rocket: '#f97316',
  cruise: '#3b82f6',
  ballistic: '#ef4444',
  hypersonic: '#a855f7',
};

// Shared map of all impact zone names to radar coordinates
export const IMPACT_POSITIONS = {
  'Tel Aviv': { x: 0.28, y: 0.35 },
  'Jerusalem': { x: 0.44, y: 0.42 },
  'Haifa': { x: 0.36, y: 0.19 },
  'Ashdod': { x: 0.24, y: 0.41 },
  'Beersheba': { x: 0.29, y: 0.53 },
  'Eilat': { x: 0.35, y: 0.90 },
  'Dimona': { x: 0.37, y: 0.57 },
  'Netanya': { x: 0.31, y: 0.30 },
  'Ashkelon': { x: 0.21, y: 0.44 },
  'Teveriah': { x: 0.55, y: 0.19 },
  'Tzfat': { x: 0.54, y: 0.15 },
  'Kiryat Shmona': { x: 0.56, y: 0.10 },
  'Sderot': { x: 0.22, y: 0.47 },
  'Nahariya': { x: 0.39, y: 0.15 },
  // Open ground areas
  'Negev Desert': { x: 0.29, y: 0.63 },
  'Northern Negev': { x: 0.22, y: 0.52 },
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

// -----------------------------------------------------------
// Threat Builder Helpers
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
// LEVEL 1: Drones only, Iron Dome only
// Duration: 120s | 24 threats | Teaches: intercept + hold fire
// Gentle start → pairs → flurry at end
// ============================================================
const THREATS_L1 = [
  // Opening: gentle intro — 6s gaps, learn the basics
  threat(1,  3,  'drone', 'Beersheba',       true,  14, 'full', 1.0, { origin: 'southeast' }),
  threat(2,  9,  'drone', 'Negev Desert',    false, 13, 'full', 1.0, { origin: 'southeast' }),  // hold fire
  threat(3,  15, 'drone', 'Ashdod',          true,  13, 'full', 1.0, { origin: 'southeast' }),
  threat(4,  21, 'drone', 'Arava Valley',    false, 13, 'full', 1.0, { origin: 'south' }),      // hold fire
  // Pairs begin — first overlap
  threat(5,  28, 'drone', 'Jerusalem',       true,  12, 'full', 1.0, { origin: 'east' }),
  threat(6,  30, 'drone', 'Northern Negev',  false, 12, 'full', 1.0, { origin: 'southeast' }),  // hold fire
  // Tempo up — 5s gaps
  threat(7,  37, 'drone', 'Tel Aviv',        true,  11, 'full', 1.0, { origin: 'east' }),
  threat(8,  42, 'drone', 'Dimona',          true,  11, 'full', 1.0, { origin: 'southeast' }),
  threat(9,  47, 'drone', 'Ashkelon',        true,  11, 'full', 1.0, { origin: 'southeast' }),
  threat(10, 49, 'drone', 'Central Negev',   false, 11, 'full', 1.0, { origin: 'south' }),      // hold fire
  // Simultaneous pair
  threat(11, 56, 'drone', 'Netanya',         true,  10, 'full', 1.0, { origin: 'east' }),
  threat(12, 56, 'drone', 'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),
  // Building pressure
  threat(13, 63, 'drone', 'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),
  threat(14, 65, 'drone', 'Judean Hills',    false, 10, 'full', 1.0, { origin: 'east' }),       // hold fire
  threat(15, 70, 'drone', 'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),
  threat(16, 75, 'drone', 'Sderot',          true,  10, 'full', 1.0, { origin: 'southeast' }),
  // Mid-section pairs
  threat(17, 82, 'drone', 'Jerusalem',       true,  10, 'full', 1.0, { origin: 'east' }),
  threat(18, 84, 'drone', 'Coastal Plain',   false, 10, 'full', 1.0, { origin: 'southeast' }),  // hold fire
  // === FLURRY — last 30s, rapid fire, 3-4s gaps ===
  threat(19, 90, 'drone', 'Ashkelon',        true,  9,  'full', 1.0, { origin: 'southeast' }),
  threat(20, 93, 'drone', 'Dimona',          true,  9,  'full', 1.0, { origin: 'southeast' }),
  threat(21, 96, 'drone', 'Haifa',           true,  9,  'full', 1.0, { origin: 'north' }),
  threat(22, 99, 'drone', 'Beersheba',       true,  9,  'full', 1.0, { origin: 'southeast' }),
  threat(23, 103,'drone', 'Tel Aviv',        true,  8,  'full', 1.0, { origin: 'east' }),
  threat(24, 107,'drone', 'Netanya',         true,  8,  'full', 1.0, { origin: 'east' }),
];

// ============================================================
// LEVEL 2: Rockets + Drones, Iron Dome only
// Duration: 120s | 32 threats | Introduces: rockets (~2x L1 intensity)
// Gaza rockets use 'gaza' origin (close spawn, 6-8s countdowns)
// ============================================================
const THREATS_L2 = [
  // Opening: familiar drone, then first rocket from Gaza
  threat(1,  3,  'drone',  'Sderot',          true,  13, 'full', 1.0, { origin: 'southeast' }),
  threat(2,  7,  'rocket', 'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),       // First rocket! Gaza
  threat(3,  12, 'drone',  'Negev Desert',    false, 12, 'full', 1.0, { origin: 'southeast' }),  // hold fire
  threat(4,  16, 'rocket', 'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  // Pairs — mixed drones and rockets
  threat(5,  21, 'drone',  'Beersheba',       true,  11, 'full', 1.0, { origin: 'southeast' }),
  threat(6,  23, 'rocket', 'Northern Negev',  false, 7,  'full', 1.0, { origin: 'gaza' }),       // hold fire, Gaza
  threat(7,  28, 'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(8,  31, 'drone',  'Arava Valley',    false, 12, 'full', 1.0, { origin: 'south' }),      // hold fire
  // Tempo up — 4-5s gaps
  threat(9,  35, 'rocket', 'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(10, 39, 'drone',  'Tel Aviv',        true,  11, 'full', 1.0, { origin: 'east' }),
  threat(11, 43, 'rocket', 'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),       // Gaza, fast
  threat(12, 46, 'drone',  'Netanya',         true,  11, 'full', 1.0, { origin: 'east' }),
  // Triple overlap — rockets + drone simultaneously
  threat(13, 51, 'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(14, 51, 'drone',  'Jerusalem',       true,  11, 'full', 1.0, { origin: 'east' }),
  threat(15, 54, 'rocket', 'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),       // Gaza, fast
  // Escalation — constant pressure
  threat(16, 59, 'drone',  'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),
  threat(17, 62, 'rocket', 'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(18, 65, 'drone',  'Central Negev',   false, 10, 'full', 1.0, { origin: 'south' }),      // hold fire
  threat(19, 68, 'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(20, 71, 'drone',  'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),
  threat(21, 74, 'rocket', 'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),       // Gaza, fast
  // Heavy pairs
  threat(22, 78, 'rocket', 'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(23, 78, 'drone',  'Dimona',          true,  10, 'full', 1.0, { origin: 'southeast' }),
  threat(24, 83, 'rocket', 'Tel Aviv',        true,  8,  'full', 1.0, { origin: 'gaza' }),       // Gaza (long range)
  // === CLOSING SALVO — last 30s, relentless ===
  threat(25, 88, 'rocket', 'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(26, 91, 'drone',  'Beersheba',       true,  9,  'full', 1.0, { origin: 'southeast' }),
  threat(27, 94, 'rocket', 'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(28, 97, 'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(29, 100,'drone',  'Ashkelon',        true,  9,  'full', 1.0, { origin: 'southeast' }),
  threat(30, 103,'rocket', 'Dimona',          true,  7,  'full', 1.0, { origin: 'gaza', priority: true }),  // Gaza, priority
  threat(31, 107,'rocket', 'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),       // Gaza
  threat(32, 110,'rocket', 'Northern Negev',  false, 7,  'full', 1.0, { origin: 'gaza' }),       // hold fire, Gaza
];

// ============================================================
// LEVEL 3: Cruise + Drones + Rockets, introduces David's Sling
// Duration: 160s | 19 threats (added 1 filler to eliminate dead spot)
// Gaps: 5-7s, building to 5s
// ============================================================
const THREATS_L3 = [
  // Warm-up with known types — 7s gaps
  threat(1,  4,  'drone',  'Beersheba',       true,  14, 'full', 1.0, { origin: 'southeast' }),
  threat(2,  11, 'rocket', 'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),  // Gaza
  // First cruise missile! From Iran
  threat(3,  19, 'cruise', 'Tel Aviv',        true,  12, 'full', 1.0, { origin: 'east' }),
  threat(4,  27, 'drone',  'Arava Valley',    false, 13, 'full', 1.0, { origin: 'south' }),      // hold fire
  threat(5,  34, 'cruise', 'Haifa',           true,  11, 'full', 1.0, { origin: 'north' }),      // Lebanon
  threat(6,  41, 'rocket', 'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),  // Gaza
  // Mixed pair — 6s gaps
  threat(7,  49, 'cruise', 'Jerusalem',       true,  11, 'full', 1.0, { origin: 'east' }),       // Iran
  threat(8,  51, 'drone',  'Northern Negev',  false, 13, 'full', 1.0, { origin: 'southeast' }),  // hold fire
  // Tempo up — 6s gaps
  threat(9,  59, 'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),  // Gaza
  threat(10, 66, 'cruise', 'Netanya',         true,  10, 'full', 1.0, { origin: 'east' }),       // Iran
  threat(11, 73, 'drone',  'Beersheba',       true,  12, 'full', 1.0, { origin: 'southeast' }),
  // Pairs overlap — 5s gaps
  threat(12, 81, 'cruise', 'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),       // Iran
  threat(13, 83, 'rocket', 'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),  // Gaza
  // Filler to bridge gap toward closing triple
  threat(14, 93, 'drone',  'Coastal Plain',   true,  12, 'full', 1.0, { origin: 'east' }),
  // Closing triple — 5s gaps
  threat(15, 103,'cruise', 'Dimona',          true,  10, 'full', 1.0, { origin: 'east', priority: true }),  // Iran
  threat(16, 105,'drone',  'Haifa',           true,  12, 'full', 1.0, { origin: 'north' }),      // Lebanon
  threat(17, 107,'rocket', 'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),  // Gaza
  // Final pair
  threat(18, 117,'cruise', 'Central Negev',   false, 10, 'full', 1.0, { origin: 'east' }),       // hold fire, Iran
  threat(19, 119,'drone',  'Jerusalem',       true,  12, 'full', 1.0, { origin: 'east' }),
  // Extended tail — fill to near duration (150s)
  threat(20, 125,'rocket', 'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza — resolves t=132
  threat(21, 131,'cruise', 'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),      // Lebanon — resolves t=141
  threat(22, 137,'drone',  'Ashkelon',        true,  10, 'full', 1.0, { origin: 'southeast' }),  // resolves t=147
  threat(23, 142,'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),       // Gaza — resolves t=149
];

// ============================================================
// LEVEL 4: Ballistic + all previous, introduces Arrow 2
// Duration: 170s | 21 threats (added 1 filler to eliminate dead spot)
// Gaps: 5-7s, building to 5s
// ============================================================
const THREATS_L4 = [
  // Warm-up with known types — 7s gaps
  threat(1,  4,  'drone',     'Beersheba',       true,  13, 'full', 1.0, { origin: 'southeast' }),
  threat(2,  11, 'cruise',    'Haifa',           true,  11, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(3,  18, 'rocket',    'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  // First ballistic! From Iran
  threat(4,  27, 'ballistic', 'Tel Aviv',        true,  13, 'full', 0.40, { origin: 'east' }),
  threat(5,  35, 'drone',     'Negev Desert',    false, 13, 'full', 1.0, { origin: 'southeast' }),   // hold fire
  threat(6,  42, 'ballistic', 'Jerusalem',       true,  12, 'full', 0.40, { origin: 'east' }),       // Iran
  // Mixed pairs — 6s gaps
  threat(7,  50, 'cruise',    'Netanya',         true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(8,  52, 'rocket',    'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  threat(9,  60, 'ballistic', 'Beersheba',       true,  12, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(10, 67, 'drone',     'Golan Heights',   false, 12, 'full', 1.0, { origin: 'northeast' }),   // hold fire, Syria
  // Triple — 5s gaps
  threat(11, 75, 'ballistic', 'Dimona',          true,  12, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(12, 77, 'cruise',    'Ashdod',          true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(13, 79, 'rocket',    'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  // Tempo up — 5s gaps
  threat(14, 89, 'drone',     'Tel Aviv',        true,  12, 'full', 1.0, { origin: 'east' }),
  threat(15, 96, 'ballistic', 'Haifa',           true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(16, 103,'cruise',    'Arava Valley',    false, 10, 'full', 1.0, { origin: 'east' }),        // hold fire, Iran
  threat(17, 112,'rocket',    'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  // Closing quad — tight 2s gaps
  threat(18, 121,'ballistic', 'Jerusalem',       true,  11, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(19, 123,'cruise',    'Netanya',         true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(20, 125,'rocket',    'Beersheba',       true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  threat(21, 127,'drone',     'Northern Negev',  false, 12, 'full', 1.0, { origin: 'southeast' }),   // hold fire
  // Extended tail — fill to near duration (150s)
  threat(22, 131,'ballistic', 'Tel Aviv',        true,  12, 'full', 0.40, { origin: 'east' }),       // Iran — resolves t=143
  threat(23, 136,'rocket',    'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza — resolves t=143
  threat(24, 140,'cruise',    'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon — resolves t=150
  threat(25, 143,'drone',     'Ashkelon',        true,  7,  'full', 1.0, { origin: 'southeast' }),   // resolves t=150
];

// ============================================================
// LEVEL 5: Hypersonic + all types, introduces Arrow 3
// Duration: 180s | 24 threats (added 2 fillers to eliminate dead spots)
// Gaps: 4-6s, building to 4s
// ============================================================
const THREATS_L5 = [
  // Warm-up — 6s gaps
  threat(1,  4,  'drone',      'Beersheba',       true,  13, 'full', 1.0, { origin: 'southeast' }),
  threat(2,  10, 'cruise',     'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),      // Lebanon
  threat(3,  17, 'ballistic',  'Negev Desert',    false, 12, 'full', 0.45, { origin: 'east' }),      // hold fire, Iran
  // First hypersonic! From Iran
  threat(4,  26, 'hypersonic', 'Tel Aviv',        true,  10, 'full', 0.40, { origin: 'east' }),
  threat(5,  34, 'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  threat(6,  40, 'hypersonic', 'Jerusalem',       true,   9, 'full', 0.35, { origin: 'east' }),      // Iran
  // Mixed pairs — 5s gaps
  threat(7,  48, 'cruise',     'Netanya',         true,  10, 'full', 1.0, { origin: 'east' }),       // Iran
  threat(8,  50, 'ballistic',  'Beersheba',       true,  11, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(9,  58, 'hypersonic', 'Dead Sea Region', false,  9, 'full', 0.50, { origin: 'east' }),      // hold fire, Iran
  threat(10, 64, 'drone',      'Ashkelon',        true,  12, 'full', 1.0, { origin: 'southeast' }),
  // Escalation — triple, 5s gaps
  threat(11, 73, 'ballistic',  'Dimona',          true,  11, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(12, 75, 'hypersonic', 'Haifa',           true,   9, 'full', 0.35, { origin: 'east' }),      // Iran
  threat(13, 77, 'rocket',     'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  // More mixed — 5s gaps
  threat(14, 86, 'cruise',     'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),       // Iran
  threat(15, 92, 'drone',      'Golan Heights',   false, 12, 'full', 1.0, { origin: 'northeast' }),  // hold fire, Syria
  threat(16, 100,'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  threat(17, 107,'hypersonic', 'Jerusalem',       true,   9, 'full', 0.35, { origin: 'east' }),      // Iran
  threat(18, 114,'ballistic',  'Ashkelon',        true,  11, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(19, 123,'cruise',     'Netanya',         true,  10, 'full', 1.0, { origin: 'north' }),      // Lebanon
  // Closing quad — tight 2s gaps
  threat(20, 132,'hypersonic', 'Tel Aviv',        true,   9, 'full', 0.35, { origin: 'east' }),      // Iran
  threat(21, 134,'cruise',     'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),      // Lebanon
  threat(22, 136,'ballistic',  'Beersheba',       true,  11, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(23, 138,'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  threat(24, 140,'drone',      'Northern Negev',  false, 12, 'full', 1.0, { origin: 'southeast' }),  // hold fire
  // Extended tail — fill to near duration (150s)
  threat(25, 142,'hypersonic', 'Tel Aviv',        true,   8, 'full', 0.35, { origin: 'east' }),      // Iran — resolves t=150
  threat(26, 143,'rocket',     'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza — resolves t=150
];

// ============================================================
// LEVEL 6: Wave-based assault — all types, all systems
// Duration: 180s | 25 threats in clear waves (added 1 filler)
// Wave gaps: 10-12s, tightening to near-overlap at end
// ============================================================
const THREATS_L6 = [
  // WAVE 1: Easy warm-up pair
  threat(1,  4,  'drone',      'Beersheba',       true,  14, 'full', 1.0, { origin: 'southeast' }),
  threat(2,  6,  'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  // WAVE 2: Add cruise + hold fire
  threat(3,  16, 'cruise',     'Tel Aviv',        true,  11, 'full', 1.0, { origin: 'east' }),       // Iran
  threat(4,  18, 'drone',      'Negev Desert',    false, 13, 'full', 1.0, { origin: 'southeast' }),  // hold fire
  // WAVE 3: All types mixed
  threat(5,  30, 'ballistic',  'Jerusalem',       true,  12, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(6,  32, 'cruise',     'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),      // Lebanon
  threat(7,  34, 'rocket',     'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  // WAVE 4: Hypersonic + ballistic
  threat(8,  46, 'hypersonic', 'Tel Aviv',        true,  10, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(9,  48, 'ballistic',  'Beersheba',       true,  11, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(10, 50, 'drone',      'Arava Valley',    false, 12, 'full', 1.0, { origin: 'south' }),      // hold fire
  // WAVE 5: Heavy pressure — 4 simultaneous
  threat(11, 62, 'cruise',     'Netanya',         true,  10, 'full', 1.0, { origin: 'north' }),      // Lebanon
  threat(12, 62, 'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  threat(13, 64, 'ballistic',  'Dimona',          true,  11, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(14, 64, 'hypersonic', 'Haifa',           true,   9, 'full', 0.35, { origin: 'east' }),      // Iran
  // WAVE 6: Mixed with hold fires
  threat(15, 78, 'drone',      'Tel Aviv',        true,  12, 'full', 1.0, { origin: 'east' }),
  threat(16, 78, 'cruise',     'Dead Sea Region', false, 10, 'full', 1.0, { origin: 'east' }),       // hold fire, Iran
  threat(17, 80, 'ballistic',  'Jerusalem',       true,  11, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(18, 80, 'rocket',     'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  // WAVE 7: Escalation
  threat(19, 95, 'hypersonic', 'Beersheba',       true,   9, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(20, 97, 'cruise',     'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),       // Iran
  threat(21, 99, 'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  // WAVE 8: Sustained pressure
  threat(22, 110,'ballistic',  'Haifa',           true,  11, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(23, 112,'drone',      'Ashkelon',        true,  11, 'full', 1.0, { origin: 'southeast' }),
  threat(24, 114,'hypersonic', 'Jerusalem',       true,   9, 'full', 0.35, { origin: 'east' }),      // Iran
  threat(25, 114,'rocket',     'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  // WAVE 9: Heavy quad
  threat(26, 128,'cruise',     'Netanya',         true,  10, 'full', 1.0, { origin: 'north' }),      // Lebanon
  threat(27, 128,'ballistic',  'Tel Aviv',        true,  11, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(28, 130,'hypersonic', 'Dimona',          true,   9, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(29, 130,'rocket',     'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
  // WAVE 10: Final massive wave
  threat(30, 145,'hypersonic', 'Tel Aviv',        true,   9, 'full', 0.35, { origin: 'east' }),      // Iran
  threat(31, 145,'ballistic',  'Haifa',           true,  11, 'full', 0.40, { origin: 'east' }),      // Iran
  threat(32, 147,'cruise',     'Beersheba',       true,  10, 'full', 1.0, { origin: 'east' }),       // Iran
  threat(33, 147,'drone',      'Netanya',         true,  12, 'full', 1.0, { origin: 'east' }),
  threat(34, 149,'rocket',     'Dimona',          true,  7,  'full', 1.0, { origin: 'gaza', priority: true }),  // Gaza
  threat(35, 149,'hypersonic', 'Central Negev',   false,  9, 'full', 0.50, { origin: 'east' }),      // hold fire, Iran
  // Trailing threats
  threat(36, 160,'ballistic',  'Jerusalem',       true,  11, 'full', 0.35, { origin: 'east' }),      // Iran
  threat(37, 165,'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),   // Gaza
];

// ============================================================
// LEVEL 7: Final Stand — massive salvos, limited ammo
// Duration: 180s | 31 threats (added 3 fillers), tight ammo
// Gaps: 2-4s, relentless pressure
// ============================================================
const THREATS_L7 = [
  // Opening — deceptively calm, 4s gaps
  threat(1,  4,  'drone',      'Beersheba',       true,  13, 'full', 1.0, { origin: 'southeast' }),
  threat(2,  8,  'rocket',     'Northern Negev',  false, 12, 'full', 1.0, { origin: 'gaza' }),   // hold fire, Gaza
  threat(3,  14, 'cruise',     'Haifa',           true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(4,  20, 'ballistic',  'Negev Desert',    false, 12, 'full', 0.45, { origin: 'east' }),       // hold fire, Iran
  // Pressure builds — 3s gaps, must be selective
  threat(5,  28, 'hypersonic', 'Tel Aviv',        true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(6,  30, 'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  threat(7,  33, 'drone',      'Arava Valley',    false, 12, 'full', 1.0, { origin: 'south' }),       // hold fire
  // Salvos start — 3 at once
  threat(8,  40, 'ballistic',  'Jerusalem',       true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(9,  40, 'cruise',     'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(10, 42, 'rocket',     'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  // Bridge
  threat(11, 51, 'drone',      'Netanya',         true,  12, 'full', 1.0, { origin: 'east' }),
  // More salvos — 4 at once
  threat(12, 56, 'hypersonic', 'Haifa',           true,   9, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(13, 56, 'drone',      'Beersheba',       true,  12, 'full', 1.0, { origin: 'southeast' }),
  threat(14, 58, 'ballistic',  'Dimona',          true,  11, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(15, 58, 'cruise',     'Central Negev',   false, 10, 'full', 1.0, { origin: 'east' }),        // hold fire, Iran
  // Relentless — 4 at once
  threat(16, 68, 'hypersonic', 'Jerusalem',       true,   9, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(17, 68, 'ballistic',  'Netanya',         true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(18, 70, 'cruise',     'Ashdod',          true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(19, 70, 'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  // Brief breather with hold fires
  threat(20, 80, 'drone',      'Judean Hills',    false, 12, 'full', 1.0, { origin: 'east' }),        // hold fire
  threat(21, 82, 'ballistic',  'Southern Negev',  false, 12, 'full', 0.45, { origin: 'east' }),       // hold fire, Iran
  // Sustained assault
  threat(22, 92, 'cruise',     'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(23, 95, 'rocket',     'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  threat(24, 100,'hypersonic', 'Haifa',           true,   9, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(25, 103,'ballistic',  'Beersheba',       true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  // More pressure
  threat(26, 112,'cruise',     'Jerusalem',       true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(27, 115,'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  threat(28, 118,'drone',      'Tel Aviv',        true,  11, 'full', 1.0, { origin: 'east' }),
  threat(29, 122,'hypersonic', 'Dimona',          true,   9, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  // Build to final salvo
  threat(30, 130,'ballistic',  'Haifa',           true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(31, 133,'rocket',     'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),    // Gaza
  threat(32, 137,'cruise',     'Netanya',         true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  // FINAL SALVO — 8 threats, overwhelming, tight 2s gaps
  threat(33, 150,'hypersonic', 'Tel Aviv',        true,   9, 'full', 0.35, { origin: 'east', is_final_salvo: true }),      // Iran
  threat(34, 150,'ballistic',  'Jerusalem',       true,  11, 'full', 0.35, { origin: 'east', is_final_salvo: true }),      // Iran
  threat(35, 152,'cruise',     'Haifa',           true,  10, 'full', 1.0,  { origin: 'north', is_final_salvo: true }),     // Lebanon
  threat(36, 152,'rocket',     'Beersheba',       true,  7,  'full', 1.0,  { origin: 'gaza', is_final_salvo: true }),  // Gaza
  threat(37, 154,'hypersonic', 'Dimona',          true,   9, 'full', 0.35, { origin: 'east', is_final_salvo: true, priority: true }),  // Iran
  threat(38, 154,'drone',      'Ashkelon',        true,  12, 'full', 1.0,  { origin: 'southeast', is_final_salvo: true }),
  threat(39, 156,'ballistic',  'Netanya',         true,  11, 'full', 0.40, { origin: 'east', is_final_salvo: true }),      // Iran
  threat(40, 156,'cruise',     'Northern Negev',  false, 10, 'full', 1.0,  { origin: 'east', is_final_salvo: true }),      // hold fire, Iran
];

// ============================================================
// LEVEL CONFIGURATION
// ============================================================
export const LEVELS = [
  // Level 1: Drones + Iron Dome
  {
    id: 1,
    duration: 120,
    ammo: { iron_dome: 18 },
    available_systems: ['iron_dome'],
    auto_end_delay: 3000,
    new_system: null,
    new_threat: null,
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L1,
  },
  // Level 2: Rockets (still Iron Dome only)
  {
    id: 2,
    duration: 120,
    ammo: { iron_dome: 24 },
    available_systems: ['iron_dome'],
    auto_end_delay: 3000,
    new_system: null,
    new_threat: { type: 'rocket', name: 'SHORT-RANGE ROCKETS', description: 'Unguided ballistic arc, short range', speed: 'Mach 1–2' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L2,
  },
  // Level 3: Cruise Missiles + David's Sling
  {
    id: 3,
    duration: 150,
    ammo: { iron_dome: 10, davids_sling: 6 },
    available_systems: ['iron_dome', 'davids_sling'],
    auto_end_delay: 5000,
    new_system: { key: 'davids_sling', name: "DAVID'S SLING", shortcut: '2', color: '#3b82f6' },
    new_threat: { type: 'cruise', name: 'CRUISE MISSILES', description: 'Low altitude, terrain-following', speed: 'Mach 0.8–1.2' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L3,
  },
  // Level 4: Ballistic Missiles + Arrow 2
  {
    id: 4,
    duration: 150,
    ammo: { iron_dome: 8, davids_sling: 5, arrow_2: 6 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2'],
    auto_end_delay: 5000,
    new_system: { key: 'arrow_2', name: 'ARROW 2', shortcut: '3', color: '#ef4444' },
    new_threat: { type: 'ballistic', name: 'BALLISTIC MISSILES', description: 'High arc, fast reentry', speed: 'Mach 7–9.5' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L4,
  },
  // Level 5: Hypersonic + Arrow 3
  {
    id: 5,
    duration: 150,
    ammo: { iron_dome: 7, davids_sling: 5, arrow_2: 5, arrow_3: 4 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2', 'arrow_3'],
    auto_end_delay: 5000,
    new_system: { key: 'arrow_3', name: 'ARROW 3', shortcut: '4', color: '#a855f7' },
    new_threat: { type: 'hypersonic', name: 'HYPERSONIC GLIDE VEHICLES', description: 'Exo-atmospheric, extreme speed', speed: 'Mach 12–16' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L5,
  },
  // Level 6: Wave-based assault — all types
  {
    id: 6,
    duration: 180,
    ammo: { iron_dome: 8, davids_sling: 6, arrow_2: 6, arrow_3: 5 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2', 'arrow_3'],
    auto_end_delay: 6000,
    new_system: null,
    new_threat: null,
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L6,
  },
  // Level 7: Final Stand — massive salvos, limited ammo
  {
    id: 7,
    duration: 180,
    ammo: { iron_dome: 7, davids_sling: 5, arrow_2: 5, arrow_3: 4 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2', 'arrow_3'],
    auto_end_delay: 8000,
    new_system: null,
    new_threat: null,
    final_salvo_warning_time: 130,
    final_salvo_start_time: 150,
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

export function getConfig(level) {
  return LEVELS[level - 1] || LEVELS[0];
}

export function getLevelConfig(level) {
  return LEVELS[level - 1] || LEVELS[0];
}

export const TOTAL_LEVELS = LEVELS.length;
