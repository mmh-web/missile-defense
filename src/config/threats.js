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
  'Nahariya': { x: 0.39, y: 0.15 },
  // Otef Aza cities — GPS-verified positions
  "Be'eri": { x: 0.175, y: 0.490 },
  'Kfar Aza': { x: 0.191, y: 0.477 },
  "Re'im": { x: 0.162, y: 0.498 },
  'Netivot': { x: 0.211, y: 0.490 },
  'Rishon LeZion': { x: 0.27, y: 0.39 },
  'Petah Tikva': { x: 0.33, y: 0.34 },
  'Holon': { x: 0.27, y: 0.37 },
  'Akko': { x: 0.37, y: 0.17 },
  'Katzrin': { x: 0.60, y: 0.14 },
  'Majdal Shams': { x: 0.59, y: 0.09 },
  'Arad': { x: 0.42, y: 0.58 },
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
// LEVEL 1: Otef Aza — Short-range ROCKETS only, Iron Dome
// Duration: 120s | 29 threats | Teaches: intercept + hold fire
// Geography: Gaza border communities. Viewport zoomed tight on south.
// All threats from Gaza. Only Otef Aza cities targeted.
// ============================================================
const THREATS_L1 = [
  // Opening: gentle intro — 5s gaps, learn the basics
  threat(1,  3,  'rocket', 'Sderot',          true,  8, 'full', 1.0, { origin: 'gaza' }),
  threat(2,  8,  'rocket', 'Northern Negev',  false, 8, 'full', 1.0, { origin: 'gaza' }),    // hold fire
  threat(3,  13, 'rocket', 'Ashkelon',        true,  8, 'full', 1.0, { origin: 'gaza' }),
  threat(4,  18, 'rocket', 'Northern Negev',  false, 8, 'full', 1.0, { origin: 'gaza' }),    // hold fire
  // Pairs begin — first overlap
  threat(5,  24, 'rocket', "Be'eri",          true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(6,  26, 'rocket', 'Northern Negev',  false, 7, 'full', 1.0, { origin: 'gaza' }),    // hold fire
  // Tempo up — 4s gaps
  threat(7,  32, 'rocket', 'Kfar Aza',        true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(8,  36, 'rocket', 'Ashkelon',        true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(9,  40, 'rocket', 'Sderot',          true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(10, 42, 'rocket', 'Northern Negev',  false, 7, 'full', 1.0, { origin: 'gaza' }),    // hold fire
  // Simultaneous pair
  threat(11, 48, 'rocket', "Re'im",           true,  7, 'full', 1.0, { origin: 'gaza' }),
  threat(12, 48, 'rocket', 'Netivot',         true,  7, 'full', 1.0, { origin: 'gaza' }),
  // Building pressure — 3-4s gaps
  threat(13, 54, 'rocket', 'Ashkelon',        true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(14, 56, 'rocket', 'Northern Negev',  false, 6, 'full', 1.0, { origin: 'gaza' }),    // hold fire
  threat(15, 60, 'rocket', 'Sderot',          true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(16, 64, 'rocket', "Be'eri",          true,  6, 'full', 1.0, { origin: 'gaza' }),
  // Mid-section pairs
  threat(17, 69, 'rocket', 'Kfar Aza',        true,  6, 'full', 1.0, { origin: 'gaza' }),
  threat(18, 71, 'rocket', 'Northern Negev',  false, 6, 'full', 1.0, { origin: 'gaza' }),    // hold fire
  threat(19, 75, 'rocket', 'Netivot',         true,  6, 'full', 1.0, { origin: 'gaza' }),
  // === FLURRY — last 30s, rapid fire, 3s gaps ===
  threat(20, 80, 'rocket', 'Ashkelon',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(21, 83, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(22, 86, 'rocket', "Re'im",           true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(23, 89, 'rocket', 'Kfar Aza',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(24, 92, 'rocket', 'Ashkelon',        true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(25, 95, 'rocket', 'Netivot',         true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(26, 98, 'rocket', 'Sderot',          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(27, 101,'rocket', "Be'eri",          true,  5, 'full', 1.0, { origin: 'gaza' }),
  threat(28, 104,'rocket', 'Northern Negev',  false, 5, 'full', 1.0, { origin: 'gaza' }),    // hold fire
  threat(29, 107,'rocket', 'Ashkelon',        true,  5, 'full', 1.0, { origin: 'gaza' }),
];

// ============================================================
// LEVEL 2: Galil, Haifa & Golan — Drones + Rockets, Iron Dome
// Duration: 120s | 34 threats | Introduces: drones
// Geography: Northern Israel. Viewport zoomed tight on north.
// Threats from Lebanon (north) and Syria (northeast). No Gaza threats.
// ============================================================
const THREATS_L2 = [
  // Opening: familiar rockets from the north, then first drone
  threat(1,  3,  'rocket', 'Haifa',            true,  8, 'full', 1.0, { origin: 'north' }),         // Lebanon
  threat(2,  8,  'rocket', 'Western Galilee',  false, 8, 'full', 1.0, { origin: 'north' }),         // hold fire, Lebanon
  threat(3,  13, 'drone',  'Nahariya',         true,  12, 'full', 1.0, { origin: 'north' }),        // First drone! Lebanon
  threat(4,  18, 'rocket', 'Kiryat Shmona',    true,  7, 'full', 1.0, { origin: 'north' }),         // Lebanon
  // Pairs — mixed drones and rockets
  threat(5,  24, 'drone',  'Akko',             true,  11, 'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(6,  26, 'rocket', 'Upper Galilee',    false, 7,  'full', 1.0, { origin: 'north' }),        // hold fire, Lebanon
  threat(7,  30, 'rocket', 'Teveriah',         true,  7,  'full', 1.0, { origin: 'northeast' }),    // Syria
  threat(8,  34, 'drone',  'Golan Heights',    false, 11, 'full', 1.0, { origin: 'northeast' }),    // hold fire, Syria
  // Tempo up — 3-4s gaps
  threat(9,  38, 'rocket', 'Tzfat',            true,  7,  'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(10, 42, 'drone',  'Haifa',            true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(11, 45, 'rocket', 'Katzrin',          true,  7,  'full', 1.0, { origin: 'northeast' }),    // Syria
  threat(12, 48, 'drone',  'Nahariya',         true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(13, 51, 'rocket', 'Akko',             true,  7,  'full', 1.0, { origin: 'north' }),        // Lebanon
  // Triple overlap
  threat(14, 55, 'rocket', 'Kiryat Shmona',    true,  7,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(15, 55, 'drone',  'Majdal Shams',     true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria
  threat(16, 57, 'rocket', 'Western Galilee',  false, 7,  'full', 1.0, { origin: 'north' }),       // hold fire, Lebanon
  // Escalation — tighter 3-4s gaps
  threat(17, 61, 'drone',  'Teveriah',         true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria
  threat(18, 64, 'rocket', 'Haifa',            true,  6,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(19, 67, 'drone',  'Upper Galilee',    false, 10, 'full', 1.0, { origin: 'north' }),       // hold fire, Lebanon
  threat(20, 70, 'rocket', 'Akko',             true,  6,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(21, 73, 'drone',  'Katzrin',          true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria
  threat(22, 76, 'rocket', 'Nahariya',         true,  6,  'full', 1.0, { origin: 'north' }),       // Lebanon
  // Heavy pairs
  threat(23, 80, 'rocket', 'Tzfat',            true,  6,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(24, 80, 'drone',  'Kiryat Shmona',    true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(25, 83, 'drone',  'Haifa',            true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
  // === CLOSING SALVO — relentless ===
  threat(26, 87, 'rocket', 'Haifa',            true,  5,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(27, 90, 'drone',  'Nahariya',         true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(28, 92, 'rocket', 'Majdal Shams',     true,  6,  'full', 1.0, { origin: 'northeast' }),   // Syria
  threat(29, 95, 'drone',  'Teveriah',         true,  9,  'full', 1.0, { origin: 'northeast' }),   // Syria
  threat(30, 97, 'rocket', 'Akko',             true,  5,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(31, 99, 'rocket', 'Kiryat Shmona',    true,  5,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(32, 102,'drone',  'Tzfat',            true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(33, 105,'rocket', 'Golan Heights',    false, 6,  'full', 1.0, { origin: 'northeast' }),   // hold fire, Syria
  threat(34, 108,'drone',  'Haifa',            true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
];

// ============================================================
// LEVEL 3: Gush Dan & Jerusalem — Cruise Missiles + all previous
// Duration: 120s | 26 threats | Introduces: David's Sling + cruise missiles
// Geography: Big zoom-out — center + both fronts visible.
// Gaza rockets resume (south), Lebanon drones continue (north),
// NEW: cruise missiles from Iran (east) and Yemen (southeast).
// ============================================================
const THREATS_L3 = [
  // Warm-up with known types — remind player of both fronts
  threat(1,  4,  'rocket', 'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(2,  9,  'drone',  'Haifa',           true,  11, 'full', 1.0, { origin: 'north' }),        // Lebanon
  // First cruise missile! From Iran — the teaching moment
  threat(3,  15, 'cruise', 'Tel Aviv',        true,  11, 'full', 1.0, { origin: 'east' }),         // Iran
  threat(4,  22, 'rocket', 'Northern Negev',  false, 7,  'full', 1.0, { origin: 'gaza' }),         // hold fire
  threat(5,  27, 'cruise', 'Jerusalem',       true,  10, 'full', 1.0, { origin: 'east' }),         // Iran
  threat(6,  32, 'rocket', 'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  // Mixed pair — both fronts + cruise
  threat(7,  38, 'cruise', 'Haifa',           true,  10, 'full', 1.0, { origin: 'east' }),         // Iran
  threat(8,  40, 'drone',  'Coastal Plain',   false, 11, 'full', 1.0, { origin: 'north' }),        // hold fire, Lebanon
  // Tempo up — tighter gaps, introduce Gush Dan cities
  threat(9,  46, 'rocket', 'Ashdod',          true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(10, 51, 'cruise', 'Netanya',         true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(11, 57, 'drone',  'Kiryat Shmona',   true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon
  // Pairs overlap
  threat(12, 63, 'cruise', 'Tel Aviv',        true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(13, 64, 'rocket', 'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  // Bridge
  threat(14, 72, 'drone',  'Rishon LeZion',   true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon
  // Closing triple
  threat(15, 80, 'cruise', 'Jerusalem',       true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(16, 81, 'drone',  'Nahariya',        true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(17, 83, 'rocket', 'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  // Final pairs
  threat(18, 90, 'cruise', 'Judean Hills',    false, 9,  'full', 1.0, { origin: 'east' }),         // hold fire, Iran
  threat(19, 92, 'drone',  'Petah Tikva',     true,  10, 'full', 1.0, { origin: 'north' }),        // Lebanon
  // Compressed tail — rapid fire
  threat(20, 96, 'rocket', 'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(21, 98, 'cruise', 'Holon',           true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(22, 101,'drone',  'Haifa',           true,  9,  'full', 1.0, { origin: 'north' }),        // Lebanon
  threat(23, 102,'rocket', 'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
  threat(24, 106,'cruise', 'Tel Aviv',        true,  9,  'full', 1.0, { origin: 'east' }),         // Iran
  threat(25, 108,'drone',  'Western Galilee', false, 9,  'full', 1.0, { origin: 'north' }),        // hold fire, Lebanon
  threat(26, 110,'rocket', 'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),         // Gaza
];

// ============================================================
// LEVEL 4: Negev — Ballistic + all previous, introduces Arrow 2
// Duration: 150s | 30 threats
// Geography: Zooms out to include Negev. All previous fronts active.
// NEW: ballistic missiles from Iran (east).
// ============================================================
const THREATS_L4 = [
  // Warm-up with known types — 6s gaps
  threat(1,  4,  'drone',     'Haifa',           true,  11, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(2,  10, 'cruise',    'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(3,  16, 'rocket',    'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  // First ballistic! From Iran — the teaching moment
  threat(4,  24, 'ballistic', 'Tel Aviv',        true,  12, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(5,  32, 'drone',     'Negev Desert',    false, 11, 'full', 1.0, { origin: 'north' }),       // hold fire
  threat(6,  38, 'ballistic', 'Jerusalem',       true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  // Mixed pairs — introduce Negev cities
  threat(7,  45, 'cruise',    'Netanya',         true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(8,  47, 'rocket',    'Ashkelon',        true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(9,  53, 'ballistic', 'Beersheba',       true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(10, 58, 'drone',     'Golan Heights',   false, 11, 'full', 1.0, { origin: 'northeast' }),   // hold fire, Syria
  threat(11, 63, 'cruise',    'Haifa',           true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  // Triple — 3s gaps
  threat(12, 69, 'ballistic', 'Dimona',          true,  11, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(13, 71, 'cruise',    'Ashdod',          true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(14, 73, 'rocket',    'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  // Sustained pressure
  threat(15, 80, 'drone',     'Arad',            true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria
  threat(16, 85, 'ballistic', 'Haifa',           true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(17, 90, 'cruise',    'Arava Valley',    false, 9,  'full', 1.0, { origin: 'east' }),        // hold fire, Iran
  threat(18, 95, 'rocket',    'Ashkelon',        true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(19, 99, 'drone',     'Beersheba',       true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  // Closing quad — tight 2-3s gaps
  threat(20, 105,'ballistic', 'Jerusalem',       true,  10, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(21, 107,'cruise',    'Netanya',         true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(22, 109,'rocket',    'Beersheba',       true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza (long range)
  threat(23, 111,'drone',     'Northern Negev',  false, 10, 'full', 1.0, { origin: 'north' }),       // hold fire
  // Extended tail — relentless
  threat(24, 117,'ballistic', 'Tel Aviv',        true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(25, 121,'rocket',    'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(26, 125,'cruise',    'Haifa',           true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
  threat(27, 129,'drone',     'Ashkelon',        true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(28, 133,'ballistic', 'Beersheba',       true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(29, 137,'rocket',    'Netivot',         true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(30, 141,'cruise',    'Jerusalem',       true,  9,  'full', 1.0, { origin: 'east' }),        // Iran
];

// ============================================================
// LEVEL 5: Full Country — Hypersonic + all types, introduces Arrow 3
// Duration: 150s | 31 threats
// Geography: Full country view. Unpopulated region outlines added.
// NEW: hypersonic glide vehicles from Iran.
// All directions, all cities targetable.
// ============================================================
const THREATS_L5 = [
  // Warm-up — 5s gaps
  threat(1,  4,  'drone',      'Beersheba',       true,  11, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(2,  9,  'cruise',     'Haifa',           true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(3,  15, 'ballistic',  'Negev Desert',    false, 11, 'full', 0.45, { origin: 'east' }),       // hold fire, Iran
  // First hypersonic! From Iran — the teaching moment
  threat(4,  22, 'hypersonic', 'Tel Aviv',        true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(5,  29, 'rocket',     'Sderot',          true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(6,  35, 'hypersonic', 'Jerusalem',       true,   9, 'full', 0.35, { origin: 'east' }),       // Iran
  // Mixed pairs — 4s gaps
  threat(7,  42, 'cruise',     'Netanya',         true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(8,  44, 'ballistic',  'Beersheba',       true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(9,  50, 'hypersonic', 'Dead Sea Region', false,  9, 'full', 0.50, { origin: 'east' }),       // hold fire, Iran
  threat(10, 55, 'drone',      'Ashkelon',        true,  10, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(11, 59, 'cruise',     'Tel Aviv',        true,   9, 'full', 1.0, { origin: 'east' }),        // Iran
  // Escalation — triple
  threat(12, 65, 'ballistic',  'Dimona',          true,  11, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(13, 67, 'hypersonic', 'Haifa',           true,   9, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(14, 69, 'rocket',     'Ashdod',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  // More mixed — compressed
  threat(15, 76, 'cruise',     'Tel Aviv',        true,   9, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(16, 81, 'drone',      'Golan Heights',   false, 11, 'full', 1.0, { origin: 'northeast' }),   // hold fire, Syria
  threat(17, 86, 'rocket',     'Sderot',          true,  6,  'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(18, 91, 'hypersonic', 'Jerusalem',       true,   8, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(19, 96, 'ballistic',  'Eilat',           true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(20, 101,'drone',      'Beersheba',       true,  10, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(21, 106,'cruise',     'Netanya',         true,   9, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(22, 111,'ballistic',  'Haifa',           true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  // Closing quad — tight 2s gaps
  threat(23, 117,'hypersonic', 'Tel Aviv',        true,   8, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(24, 119,'cruise',     'Haifa',           true,   9, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(25, 121,'ballistic',  'Beersheba',       true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(26, 123,'rocket',     'Sderot',          true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(27, 126,'drone',      'Northern Negev',  false, 10, 'full', 1.0, { origin: 'north' }),       // hold fire
  // Extended tail — compressed
  threat(28, 131,'hypersonic', 'Dimona',          true,   8, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(29, 135,'rocket',     'Ashkelon',        true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(30, 139,'hypersonic', 'Jerusalem',       true,   8, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(31, 142,'rocket',     'Netivot',         true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
];

// ============================================================
// LEVEL 6: Wave-based assault — all types, all systems
// Duration: 150s | 37 threats in clear waves
// Wave gaps: 10-12s, tightening to near-overlap at end
// ============================================================
const THREATS_L6 = [
  // WAVE 1: Easy warm-up pair
  threat(1,  4,  'drone',      'Arad',            true,  13, 'full', 1.0, { origin: 'southeast' }),   // Yemen — new city
  threat(2,  6,  'rocket',     'Be\'eri',         true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza — new city
  // WAVE 2: Add cruise + hold fire
  threat(3,  14, 'cruise',     'Tel Aviv',        true,  10, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(4,  16, 'drone',      'Negev Desert',    false, 12, 'full', 1.0, { origin: 'southeast' }),   // hold fire
  // WAVE 3: All types mixed
  threat(5,  26, 'ballistic',  'Jerusalem',       true,  11, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(6,  28, 'cruise',     'Akko',            true,  9,  'full', 1.0, { origin: 'north' }),       // Lebanon — new city
  threat(7,  29, 'rocket',     'Kfar Aza',        true,  7,  'full', 1.0, { origin: 'gaza' }),        // Gaza — new city
  // WAVE 4: Hypersonic + ballistic
  threat(8,  40, 'hypersonic', 'Tel Aviv',        true,   9, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(9,  41, 'ballistic',  'Beersheba',       true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(10, 43, 'drone',      'Arava Valley',    false, 11, 'full', 1.0, { origin: 'southeast' }),   // hold fire
  // WAVE 5: Heavy pressure — 4 simultaneous
  threat(11, 53, 'cruise',     'Petah Tikva',     true,   9, 'full', 1.0, { origin: 'north' }),       // Lebanon — new city
  threat(12, 53, 'rocket',     'Sderot',          true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(13, 55, 'ballistic',  'Dimona',          true,  10, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(14, 55, 'hypersonic', 'Haifa',           true,   8, 'full', 0.35, { origin: 'east' }),       // Iran
  // WAVE 6: Mixed with hold fires
  threat(15, 67, 'drone',      'Rishon LeZion',   true,  11, 'full', 1.0, { origin: 'east' }),        // new city
  threat(16, 67, 'cruise',     'Dead Sea Region', false,  9, 'full', 1.0, { origin: 'east' }),        // hold fire, Iran
  threat(17, 68, 'ballistic',  'Jerusalem',       true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(18, 68, 'rocket',     'Ashkelon',        true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
  // WAVE 7: Escalation
  threat(19, 81, 'hypersonic', 'Beersheba',       true,   8, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(20, 83, 'cruise',     'Holon',           true,   9, 'full', 1.0, { origin: 'east' }),        // Iran — new city
  threat(21, 84, 'rocket',     'Netivot',         true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza — new city
  // WAVE 8: Sustained pressure
  threat(22, 94, 'ballistic',  'Haifa',           true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(23, 95, 'drone',      'Katzrin',         true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria — new city
  threat(24, 97, 'hypersonic', 'Jerusalem',       true,   8, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(25, 97, 'rocket',     'Ashdod',          true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
  // WAVE 9: Heavy quad
  threat(26, 109,'cruise',     'Netanya',         true,   9, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(27, 109,'ballistic',  'Tel Aviv',        true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(28, 111,'hypersonic', 'Dimona',          true,   8, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(29, 111,'rocket',     'Majdal Shams',    true,   6, 'full', 1.0, { origin: 'northeast' }),   // Syria — new city
  // WAVE 10: Final massive wave
  threat(30, 123,'hypersonic', 'Tel Aviv',        true,   8, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(31, 123,'ballistic',  'Haifa',           true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(32, 125,'cruise',     'Beersheba',       true,   9, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(33, 125,'drone',      'Nahariya',        true,  11, 'full', 1.0, { origin: 'north' }),       // Lebanon
  threat(34, 127,'rocket',     'Re\'im',          true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza — new city
  threat(35, 127,'hypersonic', 'Central Negev',   false,  8, 'full', 0.50, { origin: 'east' }),       // hold fire, Iran
  // Trailing threats
  threat(36, 136,'ballistic',  'Jerusalem',       true,  10, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(37, 140,'rocket',     'Sderot',          true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
];

// ============================================================
// LEVEL 7: Final Stand — massive salvos, limited ammo
// Duration: 150s | 40 threats, tight ammo
// Gaps: 2-4s, relentless pressure
// ============================================================
const THREATS_L7 = [
  // Opening — deceptively calm
  threat(1,  4,  'drone',      'Arad',            true,  12, 'full', 1.0, { origin: 'southeast' }),   // Yemen — new city
  threat(2,  8,  'rocket',     'Northern Negev',  false, 11, 'full', 1.0, { origin: 'gaza' }),        // hold fire, Gaza
  threat(3,  13, 'cruise',     'Akko',            true,   9, 'full', 1.0, { origin: 'north' }),       // Lebanon — new city
  threat(4,  18, 'ballistic',  'Negev Desert',    false, 11, 'full', 0.45, { origin: 'east' }),       // hold fire, Iran
  // Pressure builds — 3s gaps, must be selective
  threat(5,  25, 'hypersonic', 'Tel Aviv',        true,   9, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(6,  27, 'rocket',     'Kfar Aza',        true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza — new city
  threat(7,  30, 'drone',      'Arava Valley',    false, 11, 'full', 1.0, { origin: 'southeast' }),   // hold fire
  // Salvos start — 3 at once
  threat(8,  36, 'ballistic',  'Jerusalem',       true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(9,  36, 'cruise',     'Rishon LeZion',   true,   9, 'full', 1.0, { origin: 'east' }),        // Iran — new city
  threat(10, 38, 'rocket',     'Ashkelon',        true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
  // Bridge
  threat(11, 46, 'drone',      'Petah Tikva',     true,  11, 'full', 1.0, { origin: 'east' }),        // new city
  // More salvos — 4 at once
  threat(12, 51, 'hypersonic', 'Haifa',           true,   8, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(13, 51, 'drone',      'Beersheba',       true,  11, 'full', 1.0, { origin: 'southeast' }),   // Yemen
  threat(14, 52, 'ballistic',  'Dimona',          true,  10, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  threat(15, 52, 'cruise',     'Central Negev',   false,  9, 'full', 1.0, { origin: 'east' }),        // hold fire, Iran
  // Relentless — 4 at once
  threat(16, 61, 'hypersonic', 'Jerusalem',       true,   8, 'full', 0.35, { origin: 'east' }),       // Iran
  threat(17, 61, 'ballistic',  'Netanya',         true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(18, 63, 'cruise',     'Holon',           true,   9, 'full', 1.0, { origin: 'east' }),        // Iran — new city
  threat(19, 63, 'rocket',     'Be\'eri',         true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza — new city
  // Brief breather with hold fires
  threat(20, 72, 'drone',      'Judean Hills',    false, 11, 'full', 1.0, { origin: 'east' }),        // hold fire
  threat(21, 74, 'ballistic',  'Southern Negev',  false, 11, 'full', 0.45, { origin: 'east' }),       // hold fire, Iran
  // Sustained assault
  threat(22, 83, 'cruise',     'Tel Aviv',        true,   9, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(23, 85, 'rocket',     'Netivot',         true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza — new city
  threat(24, 90, 'hypersonic', 'Nahariya',        true,   8, 'full', 0.35, { origin: 'north' }),      // Lebanon — new city
  threat(25, 93, 'ballistic',  'Beersheba',       true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  // More pressure
  threat(26, 101,'cruise',     'Jerusalem',       true,   9, 'full', 1.0, { origin: 'east' }),        // Iran
  threat(27, 103,'rocket',     'Sderot',          true,   6, 'full', 1.0, { origin: 'gaza' }),        // Gaza
  threat(28, 106,'drone',      'Katzrin',         true,  10, 'full', 1.0, { origin: 'northeast' }),   // Syria — new city
  threat(29, 110,'hypersonic', 'Dimona',          true,   8, 'full', 0.35, { origin: 'east', priority: true }),  // Iran
  // Build to final salvo
  threat(30, 117,'ballistic',  'Haifa',           true,  10, 'full', 0.40, { origin: 'east' }),       // Iran
  threat(31, 119,'rocket',     'Majdal Shams',    true,   6, 'full', 1.0, { origin: 'northeast' }),   // Syria — new city
  threat(32, 123,'cruise',     'Netanya',         true,   9, 'full', 1.0, { origin: 'north' }),       // Lebanon
  // FINAL SALVO — 8 threats, overwhelming, tight 2s gaps
  threat(33, 135,'hypersonic', 'Tel Aviv',        true,   8, 'full', 0.35, { origin: 'east', is_final_salvo: true }),      // Iran
  threat(34, 135,'ballistic',  'Jerusalem',       true,  10, 'full', 0.35, { origin: 'east', is_final_salvo: true }),      // Iran
  threat(35, 136,'cruise',     'Haifa',           true,   9, 'full', 1.0,  { origin: 'north', is_final_salvo: true }),     // Lebanon
  threat(36, 136,'rocket',     'Beersheba',       true,   6, 'full', 1.0,  { origin: 'gaza', is_final_salvo: true }),      // Gaza
  threat(37, 138,'hypersonic', 'Dimona',          true,   8, 'full', 0.35, { origin: 'east', is_final_salvo: true, priority: true }),  // Iran
  threat(38, 138,'drone',      'Ashkelon',        true,  11, 'full', 1.0,  { origin: 'southeast', is_final_salvo: true }),  // Yemen
  threat(39, 140,'ballistic',  'Netanya',         true,  10, 'full', 0.40, { origin: 'east', is_final_salvo: true }),      // Iran
  threat(40, 140,'cruise',     'Northern Negev',  false,  9, 'full', 1.0,  { origin: 'east', is_final_salvo: true }),      // hold fire, Iran
];

// ============================================================
// LEVEL CONFIGURATION
// ============================================================
export const LEVELS = [
  // Level 1: Otef Aza — Rockets + Iron Dome
  {
    id: 1,
    duration: 120,
    ammo: { iron_dome: 22 },
    available_systems: ['iron_dome'],
    auto_end_delay: 3000,
    new_system: null,
    new_threat: null,
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L1,
  },
  // Level 2: Galil & Golan — Drones + Rockets (still Iron Dome only)
  {
    id: 2,
    duration: 120,
    ammo: { iron_dome: 27 },
    available_systems: ['iron_dome'],
    auto_end_delay: 3000,
    new_system: null,
    new_threat: { type: 'drone', name: 'ATTACK DRONES', description: 'Low altitude, steady flight', speed: 'Mach 0.2–0.5' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L2,
  },
  // Level 3: Gush Dan & Jerusalem — Cruise Missiles + David's Sling
  {
    id: 3,
    duration: 120,
    ammo: { iron_dome: 12, davids_sling: 6 },
    available_systems: ['iron_dome', 'davids_sling'],
    auto_end_delay: 5000,
    new_system: { key: 'davids_sling', name: "DAVID'S SLING", shortcut: '2', color: '#3b82f6' },
    new_threat: { type: 'cruise', name: 'CRUISE MISSILES', description: 'Low altitude, terrain-following', speed: 'Mach 0.8–1.2' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L3,
  },
  // Level 4: Negev — Ballistic Missiles + Arrow 2
  {
    id: 4,
    duration: 150,
    ammo: { iron_dome: 10, davids_sling: 6, arrow_2: 7 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2'],
    auto_end_delay: 5000,
    new_system: { key: 'arrow_2', name: 'ARROW 2', shortcut: '3', color: '#ef4444' },
    new_threat: { type: 'ballistic', name: 'BALLISTIC MISSILES', description: 'High arc, fast reentry', speed: 'Mach 7–9.5' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L4,
  },
  // Level 5: Full Country — Hypersonic + Arrow 3
  {
    id: 5,
    duration: 150,
    ammo: { iron_dome: 9, davids_sling: 6, arrow_2: 6, arrow_3: 5 },
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
    duration: 150,
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
    duration: 150,
    ammo: { iron_dome: 7, davids_sling: 5, arrow_2: 5, arrow_3: 4 },
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

export function getLevelConfig(level) {
  return LEVELS[level - 1] || LEVELS[0];
}

export const TOTAL_LEVELS = LEVELS.length;
