// ============================================================
// MISSILE DEFENSE — Threat Configuration (5-Level Campaign)
// ============================================================
//
// Defense System Matching:
//   Iron Dome     → Drones          (Key 1)
//   David's Sling → Cruise Missiles (Key 2)
//   Arrow 2       → Ballistic       (Key 3)
//   Arrow 3       → Hypersonic      (Key 4)
//
// Intel Levels: 'full' | 'partial' | 'minimal'
// reveal_pct: Fraction of countdown remaining when impact zone reveals
//   1.0 = revealed immediately, 0.4 = revealed at 40% time remaining
// course_correct: { new_impact_zone, new_is_populated, at_pct }
// priority: true for Dimona targets (triggers longer siren)
// is_decoy: Auto-resolving false contacts on radar
// is_final_salvo: Part of the named final salvo wave
// ============================================================

export const TZEVA_ADOM_DURATION = 15;
export const DIMONA_PENALTY_DURATION = 20;

// Command center — single launch point for ALL interceptors
export const COMMAND_CENTER = { x: 0.35, y: 0.40 };

export const POPULATED_ZONES = [
  { name: 'Tel Aviv', x: 0.35, y: 0.38 },
  { name: 'Jerusalem', x: 0.45, y: 0.43 },
  { name: 'Haifa', x: 0.35, y: 0.18 },
  { name: 'Ashdod', x: 0.30, y: 0.48 },
  { name: 'Beersheba', x: 0.40, y: 0.60 },
  { name: 'Eilat', x: 0.45, y: 0.90 },
  { name: 'Dimona', x: 0.48, y: 0.65 },
  { name: 'Netanya', x: 0.33, y: 0.32 },
  { name: 'Ashkelon', x: 0.28, y: 0.52 },
  { name: 'Teveriah', x: 0.42, y: 0.22 },
  { name: 'Tzfat', x: 0.40, y: 0.15 },
  { name: 'Kiryat Shmona', x: 0.42, y: 0.08 },
];

export const THREAT_COLORS = {
  ballistic: '#ef4444',
  cruise: '#f97316',
  hypersonic: '#a855f7',
  drone: '#eab308',
  decoy: '#6b7280',
};

// Shared map of all impact zone names to radar coordinates
export const IMPACT_POSITIONS = {
  'Tel Aviv': { x: 0.35, y: 0.38 },
  'Jerusalem': { x: 0.45, y: 0.43 },
  'Haifa': { x: 0.35, y: 0.18 },
  'Ashdod': { x: 0.30, y: 0.48 },
  'Beersheba': { x: 0.40, y: 0.60 },
  'Eilat': { x: 0.45, y: 0.90 },
  'Dimona': { x: 0.48, y: 0.65 },
  'Netanya': { x: 0.33, y: 0.32 },
  'Ashkelon': { x: 0.28, y: 0.52 },
  'Teveriah': { x: 0.42, y: 0.22 },
  'Tzfat': { x: 0.40, y: 0.15 },
  'Kiryat Shmona': { x: 0.42, y: 0.08 },
  // Open ground areas
  'Negev Desert': { x: 0.38, y: 0.72 },
  'Northern Negev': { x: 0.35, y: 0.58 },
  'Central Negev': { x: 0.42, y: 0.70 },
  'Southern Negev': { x: 0.43, y: 0.80 },
  'Dead Sea Region': { x: 0.50, y: 0.50 },
  'Golan Heights': { x: 0.48, y: 0.15 },
  'Jordan Valley': { x: 0.52, y: 0.35 },
  'Judean Hills': { x: 0.42, y: 0.48 },
  'Judean Desert': { x: 0.50, y: 0.45 },
  'Arava Valley': { x: 0.50, y: 0.75 },
  'Mediterranean (off-coast)': { x: 0.18, y: 0.35 },
  'Western Galilee': { x: 0.28, y: 0.15 },
  'Upper Galilee': { x: 0.38, y: 0.10 },
  'Coastal Plain': { x: 0.25, y: 0.42 },
  'Sinai Border Region': { x: 0.32, y: 0.78 },
  'Off-course (Saudi Arabia)': { x: 0.80, y: 0.65 },
  'Off-course (Red Sea)': { x: 0.55, y: 0.85 },
  'Off-course (Jordan)': { x: 0.65, y: 0.45 },
};

// Interceptor system colors (matches Briefing/ControlPanel)
export const INTERCEPTOR_COLORS = {
  iron_dome:    '#22c55e',
  davids_sling: '#3b82f6',
  arrow_2:      '#a855f7',
  arrow_3:      '#ef4444',
};

// -----------------------------------------------------------
// Threat Builder Helpers
// -----------------------------------------------------------
export const THREAT_DATA = {
  ballistic: {
    names: ['Toofan Ballistic Missile', 'Aqeel Ballistic Missile', 'Shahab-3 Ballistic Missile', 'Emad Ballistic Missile'],
    speeds: [7, 7.5, 8, 8.5, 9, 9.5],
    altitudes: [25, 28, 32, 35, 38, 40, 42],
    trajectories: ['High parabolic arc, steep descent', 'High arc, standard ballistic trajectory', 'Medium arc, steep terminal phase'],
    correct_action: 'arrow_2',
  },
  cruise: {
    names: ['Quds Cruise Missile', 'Soumar Cruise Missile', 'Paveh Cruise Missile'],
    speeds: [0.8, 0.9, 1.0, 1.1, 1.2],
    altitudes: [5, 6, 7, 8, 9, 10],
    trajectories: ['Low altitude, terrain-following', 'Sea-skimming approach, low profile', 'Low altitude, weaving trajectory'],
    correct_action: 'davids_sling',
  },
  drone: {
    names: ['Samad-3 Attack Drone', 'Shahed-136 Attack Drone', 'Ababil-3 Drone'],
    speeds: [0.2, 0.3, 0.4, 0.5],
    altitudes: [1, 2, 3, 4, 5],
    trajectories: ['Low altitude, flat, steady', 'Low altitude, erratic pattern', 'Low, hugging terrain contours'],
    correct_action: 'iron_dome',
  },
  hypersonic: {
    names: ['Palestine-2 Hypersonic Missile', 'Fattah Hypersonic Missile'],
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
    priority: false,
    is_decoy: false,
    is_final_salvo: false,
    course_correct: null,
    ...extra,
  };
}

function buildDecoy(id, time, cdn) {
  return {
    id,
    name: 'Radar Contact',
    type: 'decoy',
    speed_mach: null,
    altitude_km: null,
    trajectory: null,
    impact_zone: null,
    is_populated: false,
    correct_action: null,
    appear_time: time,
    countdown: cdn,
    intel: 'minimal',
    reveal_pct: null,
    priority: false,
    is_decoy: true,
    is_final_salvo: false,
    course_correct: null,
  };
}

// ============================================================
// LEVEL 1: FIRST CONTACT — Drones only, Iron Dome only
// Duration: 105s | 10 threats | Teaches: intercept + hold fire
// ============================================================
const THREATS_L1 = [
  // t=4: First threat — Tel Aviv, generous countdown
  threat(1,  4,  'drone', 'Tel Aviv',        true,  18, 'full', 1.0),
  // t=14: Hold fire lesson — Negev Desert (open ground)
  threat(2,  14, 'drone', 'Negev Desert',    false, 16, 'full', 1.0),
  // t=26: Reinforce intercept
  threat(3,  26, 'drone', 'Haifa',           true,  16, 'full', 1.0),
  // t=36: Second hold-fire test
  threat(4,  36, 'drone', 'Golan Heights',   false, 16, 'full', 1.0),
  // t=46: Countdown tightens
  threat(5,  46, 'drone', 'Ashdod',          true,  14, 'full', 1.0),
  // t=55: FIRST PAIR — two simultaneous!
  threat(6,  55, 'drone', 'Jerusalem',       true,  16, 'full', 1.0),
  threat(7,  55, 'drone', 'Northern Negev',  false, 14, 'full', 1.0),
  // t=68: Short countdown = urgency
  threat(8,  68, 'drone', 'Beersheba',       true,  12, 'full', 1.0),
  // t=76: SECOND PAIR — close it out
  threat(9,  76, 'drone', 'Netanya',         true,  14, 'full', 1.0),
  threat(10, 76, 'drone', 'Arava Valley',    false, 14, 'full', 1.0),
];

// ============================================================
// LEVEL 2: ESCALATION — Drones + Cruise Missiles
// Duration: 150s | 14 threats | Introduces: David's Sling
// ============================================================
const THREATS_L2 = [
  // Opening: familiar drone, then NEW cruise missile
  threat(1,  4,  'drone',  'Ashkelon',       true,  16, 'full', 1.0),
  threat(2,  12, 'cruise', 'Tel Aviv',       true,  13, 'full', 1.0),  // First cruise — faster than drones
  threat(3,  24, 'drone',  'Jordan Valley',  false, 15, 'full', 1.0),  // hold fire
  threat(4,  35, 'cruise', 'Haifa',          true,  12, 'full', 1.0),
  // Mixed pair
  threat(5,  46, 'drone',  'Beersheba',      true,  14, 'full', 1.0),
  threat(6,  47, 'cruise', 'Negev Desert',   false, 12, 'full', 1.0),  // hold fire
  // Tempo increases
  threat(7,  60, 'cruise', 'Jerusalem',      true,  11, 'full', 1.0),
  threat(8,  70, 'drone',  'Western Galilee',false, 14, 'full', 1.0),  // hold fire
  threat(9,  80, 'cruise', 'Netanya',        true,  11, 'full', 1.0),
  // Simultaneous mixed pair
  threat(10, 92, 'drone',  'Ashdod',         true,  13, 'full', 1.0),
  threat(11, 92, 'cruise', 'Teveriah',       true,  11, 'full', 1.0),
  // Final push
  threat(12, 106,'drone',  'Coastal Plain',  false, 13, 'full', 1.0),  // hold fire
  threat(13, 118,'cruise', 'Tel Aviv',       true,  10, 'full', 1.0),
  threat(14, 118,'drone',  'Haifa',          true,  12, 'full', 1.0),
];

// ============================================================
// LEVEL 3: BALLISTIC ARC — + Ballistic Missiles + Arrow 2
// Duration: 180s | 18 threats | Introduces: Arrow 2, course corrections
// ============================================================
const THREATS_L3 = [
  // Start with familiar types, then introduce ballistic
  threat(1,  4,  'drone',     'Ashkelon',        true,  15, 'full', 1.0),
  threat(2,  12, 'cruise',    'Haifa',           true,  12, 'full', 1.0),
  threat(3,  22, 'ballistic', 'Negev Desert',    false, 14, 'full', 0.45),  // First ballistic! Open ground.
  threat(4,  34, 'ballistic', 'Tel Aviv',        true,  13, 'full', 0.40),  // Ballistic on city
  threat(5,  44, 'drone',     'Golan Heights',   false, 14, 'full', 1.0),   // hold fire
  // Mixed pair with ballistic
  threat(6,  55, 'cruise',    'Jerusalem',       true,  11, 'full', 1.0),
  threat(7,  56, 'ballistic', 'Beersheba',       true,  13, 'partial', 0.40),
  // Course correction!
  threat(8,  68, 'ballistic', 'Central Negev',   false, 13, 'full', 0.45, {
    course_correct: { new_impact_zone: 'Beersheba', new_is_populated: true, at_pct: 0.55 },
  }),
  threat(9,  78, 'drone',     'Ashdod',          true,  13, 'full', 1.0),
  threat(10, 88, 'cruise',    'Dead Sea Region', false, 11, 'full', 1.0),   // hold fire
  // Triple!
  threat(11, 100,'ballistic', 'Dimona',          true,  13, 'full', 0.35, { priority: true }),
  threat(12, 100,'drone',     'Netanya',         true,  14, 'full', 1.0),
  threat(13, 101,'cruise',    'Arava Valley',    false, 11, 'full', 1.0),   // hold fire
  // Late push
  threat(14, 116,'ballistic', 'Haifa',           true,  12, 'partial', 0.40),
  threat(15, 126,'cruise',    'Tel Aviv',        true,  10, 'full', 1.0),
  threat(16, 136,'drone',     'Sinai Border Region', false, 13, 'full', 1.0), // hold fire
  // Final pair
  threat(17, 148,'ballistic', 'Jerusalem',       true,  12, 'full', 0.35),
  threat(18, 148,'cruise',    'Ashkelon',        true,  10, 'full', 1.0),
];

// ============================================================
// LEVEL 4: FOG OF WAR — Partial intel, decoys, delayed reveal
// Duration: 210s | 20 threats + 3 decoys | Same 3 systems
// ============================================================
const THREATS_L4 = [
  // Familiar opening, then intel starts degrading
  threat(1,  4,  'drone',     'Tel Aviv',        true,  15, 'full', 1.0),
  threat(2,  14, 'cruise',    'Haifa',           true,  11, 'full', 0.50),  // delayed reveal
  threat(3,  24, 'ballistic', 'Negev Desert',    false, 13, 'partial', 0.45),
  buildDecoy(21, 32, 12),  // First decoy!
  threat(4,  38, 'drone',     'Jerusalem',       true,  14, 'partial', 0.50),
  threat(5,  48, 'cruise',    'Coastal Plain',   false, 11, 'minimal', 0.50), // hold fire, minimal intel
  threat(6,  58, 'ballistic', 'Beersheba',       true,  12, 'partial', 0.40),
  // Mixed pair under fog
  threat(7,  68, 'drone',     'Ashkelon',        true,  13, 'full', 1.0),
  threat(8,  69, 'cruise',    'Jordan Valley',   false, 10, 'minimal', 0.50), // hold fire
  buildDecoy(22, 78, 10),  // Another decoy
  threat(9,  84, 'ballistic', 'Tel Aviv',        true,  12, 'partial', 0.35),
  threat(10, 94, 'drone',     'Golan Heights',   false, 12, 'full', 1.0),  // hold fire
  // Course correction under fog
  threat(11, 104,'ballistic', 'Northern Negev',  false, 13, 'partial', 0.45, {
    course_correct: { new_impact_zone: 'Dimona', new_is_populated: true, at_pct: 0.50 },
    priority: true,
  }),
  threat(12, 114,'cruise',    'Netanya',         true,  10, 'full', 1.0),
  threat(13, 114,'drone',     'Western Galilee', false, 13, 'partial', 0.50), // hold fire
  // Triple under fog
  threat(14, 128,'ballistic', 'Haifa',           true,  12, 'minimal', 0.40),
  threat(15, 128,'cruise',    'Ashdod',          true,  10, 'partial', 0.45),
  threat(16, 130,'drone',     'Judean Hills',    false, 12, 'minimal', 0.50), // hold fire
  buildDecoy(23, 140, 10),
  // Final push
  threat(17, 150,'ballistic', 'Jerusalem',       true,  11, 'partial', 0.35),
  threat(18, 160,'cruise',    'Tel Aviv',        true,  10, 'full', 1.0),
  threat(19, 170,'drone',     'Beersheba',       true,  12, 'partial', 0.45),
  threat(20, 170,'ballistic', 'Arava Valley',    false, 11, 'minimal', 0.50), // hold fire
];

// ============================================================
// LEVEL 5: IRON STORM — All 4 systems, hypersonics, final salvo
// Duration: 240s | 22 threats + 3 decoys | Full chaos
// ============================================================
const THREATS_L5 = [
  // Quick warm-up with familiar threats
  threat(1,  4,  'drone',      'Ashkelon',       true,  14, 'full', 1.0),
  threat(2,  12, 'cruise',     'Haifa',          true,  10, 'full', 1.0),
  threat(3,  20, 'ballistic',  'Negev Desert',   false, 12, 'partial', 0.45), // hold fire
  // Introduce hypersonic!
  threat(4,  30, 'hypersonic', 'Tel Aviv',       true,  10, 'full', 0.40),  // First hypersonic — fast!
  threat(5,  40, 'drone',      'Golan Heights',  false, 12, 'full', 1.0),   // hold fire
  threat(6,  50, 'hypersonic', 'Jerusalem',      true,   9, 'partial', 0.35),
  buildDecoy(23, 58, 10),
  // Mixed pairs
  threat(7,  64, 'cruise',     'Netanya',        true,  10, 'full', 1.0),
  threat(8,  65, 'ballistic',  'Beersheba',      true,  11, 'partial', 0.40),
  threat(9,  76, 'drone',      'Coastal Plain',  false, 12, 'minimal', 0.50), // hold fire
  threat(10, 86, 'hypersonic', 'Dead Sea Region',false,  9, 'full', 0.50),  // hold fire
  // Course correction
  threat(11, 96, 'ballistic',  'Central Negev',  false, 12, 'partial', 0.45, {
    course_correct: { new_impact_zone: 'Dimona', new_is_populated: true, at_pct: 0.50 },
    priority: true,
  }),
  buildDecoy(24, 104, 8),
  // Triple
  threat(12, 110,'cruise',     'Tel Aviv',       true,   9, 'full', 1.0),
  threat(13, 110,'drone',      'Ashdod',         true,  11, 'partial', 0.45),
  threat(14, 112,'hypersonic', 'Haifa',          true,   9, 'partial', 0.35),
  // Quad
  threat(15, 126,'ballistic',  'Jerusalem',      true,  11, 'full', 0.35),
  threat(16, 126,'cruise',     'Ashkelon',       true,   9, 'partial', 0.40),
  threat(17, 128,'drone',      'Sinai Border Region', false, 11, 'minimal', 0.50), // hold fire
  threat(18, 130,'hypersonic', 'Teveriah',       true,   8, 'partial', 0.35),
  buildDecoy(25, 145, 8),
  // Pre-salvo
  threat(19, 155,'ballistic',  'Southern Negev', false, 11, 'minimal', 0.50), // hold fire

  // FINAL SALVO — "OPERATION IRON STORM"
  threat(20, 195,'drone',      'Beersheba',      true,  14, 'full', 0.35, { is_final_salvo: true }),
  threat(21, 195,'cruise',     'Jerusalem',      true,  10, 'partial', 0.35, { is_final_salvo: true }),
  threat(22, 195,'ballistic',  'Dimona',         true,  12, 'full', 0.30, { priority: true, is_final_salvo: true }),
  threat(23, 195,'hypersonic', 'Tel Aviv',       true,   9, 'partial', 0.35, { is_final_salvo: true }),
  threat(24, 195,'cruise',     'Negev Desert',   false, 10, 'minimal', 0.50, { is_final_salvo: true }),
];

// ============================================================
// LEVEL CONFIGURATION
// ============================================================
export const LEVELS = [
  {
    id: 1,
    name: 'FIRST CONTACT',
    subtitle: 'Drone Interception',
    duration: 105,
    ammo: { iron_dome: 10 },
    available_systems: ['iron_dome'],
    auto_end_delay: 3000,
    new_system: null,
    new_threat: null,
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L1,
  },
  {
    id: 2,
    name: 'ESCALATION',
    subtitle: 'Cruise Missile Threat',
    duration: 150,
    ammo: { iron_dome: 8, davids_sling: 6 },
    available_systems: ['iron_dome', 'davids_sling'],
    auto_end_delay: 5000,
    new_system: { key: 'davids_sling', name: "DAVID'S SLING", shortcut: '2', color: '#3b82f6' },
    new_threat: { type: 'cruise', name: 'CRUISE MISSILES', description: 'Low altitude, terrain-following', speed: 'Mach 0.8–1.2' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L2,
  },
  {
    id: 3,
    name: 'BALLISTIC ARC',
    subtitle: 'Ballistic Missile Defense',
    duration: 180,
    ammo: { iron_dome: 6, davids_sling: 5, arrow_2: 6 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2'],
    auto_end_delay: 5000,
    new_system: { key: 'arrow_2', name: 'ARROW 2', shortcut: '3', color: '#a855f7' },
    new_threat: { type: 'ballistic', name: 'BALLISTIC MISSILES', description: 'High arc, fast reentry', speed: 'Mach 7–9.5' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L3,
  },
  {
    id: 4,
    name: 'FOG OF WAR',
    subtitle: 'Degraded Intel & Decoys',
    duration: 210,
    ammo: { iron_dome: 6, davids_sling: 5, arrow_2: 6 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2'],
    auto_end_delay: 5000,
    new_system: null,
    new_threat: null,
    new_mechanic: { name: 'FOG OF WAR', description: 'Intel is degraded. Impact zones reveal late. Decoy contacts appear on radar — dismiss with HOLD FIRE or waste precious interceptors.' },
    final_salvo_warning_time: null,
    final_salvo_start_time: null,
    threats: THREATS_L4,
  },
  {
    id: 5,
    name: 'IRON STORM',
    subtitle: 'Full Spectrum Defense',
    duration: 240,
    ammo: { iron_dome: 5, davids_sling: 4, arrow_2: 5, arrow_3: 4 },
    available_systems: ['iron_dome', 'davids_sling', 'arrow_2', 'arrow_3'],
    auto_end_delay: 8000,
    new_system: { key: 'arrow_3', name: 'ARROW 3', shortcut: '4', color: '#ef4444' },
    new_threat: { type: 'hypersonic', name: 'HYPERSONIC MISSILES', description: 'Exo-atmospheric, extreme speed', speed: 'Mach 12–16' },
    final_salvo_warning_time: 175,
    final_salvo_start_time: 195,
    threats: THREATS_L5,
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
