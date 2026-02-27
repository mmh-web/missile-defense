// ============================================================
// MISSILE DEFENSE — Threat Configuration
// ============================================================
// Two game modes: SHORT (4 min) and FULL (18 min)
//
// Defense System Matching:
//   Iron Dome     → Drones
//   David's Sling → Cruise Missiles
//   Arrow 2       → Ballistic Missiles
//   Arrow 3       → Hypersonic Missiles
//
// Intel Levels: 'full' | 'partial' | 'minimal'
// reveal_pct: Fraction of countdown remaining when impact zone reveals
// course_correct: { new_impact_zone, new_is_populated, at_pct }
// priority: true for Dimona targets (triggers longer siren)
// is_decoy: Auto-resolving false contacts on radar
// is_final_salvo: Part of the named final salvo wave
// ============================================================

export const GAME_MODES = {
  SHORT: {
    key: 'SHORT',
    label: 'SHORT MISSION',
    description: '4 MIN',
    study_duration: 30,
    game_duration: 240,
    ammo: { iron_dome: 4, davids_sling: 3, arrow_2: 4, arrow_3: 3 },
    final_salvo_warning_time: 195,
    final_salvo_start_time: 205,
  },
  FULL: {
    key: 'FULL',
    label: 'FULL MISSION',
    description: '18 MIN',
    study_duration: 240,
    game_duration: 1080,
    ammo: { iron_dome: 10, davids_sling: 8, arrow_2: 10, arrow_3: 7 },
    final_salvo_warning_time: 855,
    final_salvo_start_time: 885,
  },
};

export const TZEVA_ADOM_DURATION = 20;
export const DIMONA_PENALTY_DURATION = 25;

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

// -----------------------------------------------------------
// Threat Builder Helpers
// -----------------------------------------------------------
const THREAT_DATA = {
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
// SHORT MODE — 4 minutes (30s study + 210s active)
// 21 threats + 2 decoys
// ============================================================
const THREATS_SHORT = [
  // WARM-UP (t=30-65)
  threat(1,  30,  'ballistic', 'Negev Desert',             false, 20, 'full',    0.40),
  threat(2,  40,  'drone',     'Golan Heights',            false, 18, 'partial', 0.45),
  threat(3,  50,  'ballistic', 'Tel Aviv',                 true,  20, 'full',    0.35),
  threat(4,  60,  'cruise',    'Mediterranean (off-coast)',false, 18, 'minimal', 0.50),
  threat(5,  68,  'drone',     'Northern Negev',           false, 16, 'full',    0.40),

  // BUILDING (t=72-132)
  buildDecoy(22, 72, 12),
  threat(6,  80,  'ballistic', 'Negev Desert',             false, 18, 'partial', 0.45, {
    course_correct: { new_impact_zone: 'Beersheba', new_is_populated: true, at_pct: 0.60 },
  }),
  threat(7,  90,  'cruise',    'Haifa',                    true,  18, 'full',    0.30),
  threat(8,  100, 'hypersonic','Jordan Valley',             false, 15, 'partial', 0.50),
  threat(9,  108, 'drone',     'Arava Valley',             false, 16, 'minimal', 0.50),
  threat(10, 118, 'ballistic', 'Dead Sea Region',          false, 16, 'full',    0.40),
  threat(11, 126, 'cruise',    'Judean Hills',             false, 15, 'partial', 0.45),
  buildDecoy(23, 132, 10),

  // PRESSURE (t=138-188)
  threat(12, 138, 'ballistic', 'Dimona',                   true,  18, 'full',    0.25, { priority: true }),
  threat(13, 148, 'drone',     'Western Galilee',          false, 14, 'full',    0.40),
  threat(14, 156, 'hypersonic','Tel Aviv',                  true,  16, 'partial', 0.35),
  threat(15, 164, 'ballistic', 'Central Negev',            false, 14, 'minimal', 0.50),
  threat(16, 172, 'cruise',    'Upper Galilee',            false, 14, 'full',    0.45),
  threat(17, 180, 'drone',     'Off-course (Jordan)',      false, 14, 'partial', 0.50),
  threat(18, 188, 'ballistic', 'Sinai Border Region',      false, 14, 'full',    0.40),

  // FINAL SALVO (warning t=195, salvo t=205)
  threat(19, 205, 'drone',     'Beersheba',                true,  16, 'full',    0.30, { is_final_salvo: true }),
  threat(20, 205, 'cruise',    'Jerusalem',                true,  16, 'partial', 0.35, { is_final_salvo: true }),
  threat(21, 205, 'hypersonic','Southern Negev',            false, 14, 'minimal', 0.50, { is_final_salvo: true }),
];

// ============================================================
// FULL MODE — 18 minutes (240s study + ~14 min active)
// 63 threats + 8 decoys
// ============================================================
const THREATS_FULL = [
  // ---- PHASE 1: WARM-UP (t=240-330, single threats) ----
  threat(1,  240, 'ballistic', 'Negev Desert',             false, 25, 'full',    0.40),
  threat(2,  252, 'drone',     'Golan Heights',            false, 22, 'full',    0.40),
  threat(3,  264, 'ballistic', 'Tel Aviv',                 true,  25, 'full',    0.35),
  threat(4,  276, 'cruise',    'Mediterranean (off-coast)',false, 22, 'full',    0.40),
  threat(5,  288, 'drone',     'Eilat',                    true,  22, 'full',    0.35),
  threat(6,  300, 'ballistic', 'Arava Valley',             false, 20, 'partial', 0.45),
  threat(7,  312, 'hypersonic','Jordan Valley',             false, 18, 'full',    0.45),
  threat(8,  324, 'cruise',    'Haifa',                    true,  22, 'full',    0.30),

  // ---- PHASE 2: BUILDING (t=335-500, pairs appear) ----
  threat(9,  335, 'ballistic', 'Dead Sea Region',          false, 20, 'partial', 0.45),
  threat(10, 343, 'drone',     'Northern Negev',           false, 20, 'full',    0.40),
  threat(11, 355, 'ballistic', 'Jerusalem',                true,  22, 'full',    0.30),
  threat(12, 355, 'cruise',    'Judean Hills',             false, 20, 'partial', 0.50),
  buildDecoy(64, 368, 12),
  threat(13, 375, 'drone',     'Western Galilee',          false, 18, 'minimal', 0.55),
  threat(14, 385, 'ballistic', 'Negev Desert',             false, 18, 'partial', 0.45, {
    course_correct: { new_impact_zone: 'Beersheba', new_is_populated: true, at_pct: 0.60 },
  }),
  threat(15, 395, 'cruise',    'Netanya',                  true,  20, 'full',    0.30),
  threat(16, 405, 'hypersonic','Off-course (Saudi Arabia)', false, 16, 'full',    0.50, {
    trajectory: 'Erratic — Loss of control, breaking apart',
  }),
  threat(17, 415, 'drone',     'Central Negev',            false, 18, 'partial', 0.45),
  buildDecoy(65, 425, 10),
  threat(18, 435, 'drone',     'Ashkelon',                 true,  20, 'partial', 0.35),
  threat(19, 448, 'cruise',    'Coastal Plain',            false, 18, 'minimal', 0.55),
  threat(20, 460, 'drone',     'Upper Galilee',            false, 18, 'full',    0.40),
  threat(21, 472, 'ballistic', 'Sinai Border Region',      false, 18, 'partial', 0.50),
  threat(22, 485, 'cruise',    'Teveriah',                 true,  20, 'full',    0.30),

  // ---- PHASE 3: PRESSURE (t=500-700, triples, shorter countdowns) ----
  threat(23, 500, 'ballistic', 'Tel Aviv',                 true,  20, 'partial', 0.35),
  threat(24, 508, 'drone',     'Golan Heights',            false, 16, 'full',    0.40),
  threat(25, 508, 'cruise',    'Northern Negev',           false, 18, 'minimal', 0.55),
  buildDecoy(66, 520, 10),
  threat(26, 528, 'hypersonic','Tel Aviv',                  true,  16, 'full',    0.30),
  threat(27, 538, 'ballistic', 'Judean Desert',            false, 16, 'partial', 0.50),
  threat(28, 538, 'drone',     'Haifa',                    true,  18, 'full',    0.30),
  threat(29, 550, 'cruise',    'Dead Sea Region',          false, 16, 'partial', 0.45),
  threat(30, 560, 'ballistic', 'Southern Negev',           false, 16, 'minimal', 0.55),
  buildDecoy(67, 570, 8),
  threat(31, 575, 'drone',     'Jordan Valley',            false, 14, 'full',    0.40),
  threat(32, 575, 'cruise',    'Ashdod',                   true,  18, 'partial', 0.35),
  threat(33, 588, 'ballistic', 'Negev Desert',             false, 16, 'full',    0.40),
  threat(34, 600, 'hypersonic','Central Negev',             false, 14, 'partial', 0.50),
  threat(35, 600, 'drone',     'Kiryat Shmona',            true,  18, 'full',    0.25),
  threat(36, 615, 'ballistic', 'Mediterranean (off-coast)',false, 16, 'minimal', 0.55, {
    course_correct: { new_impact_zone: 'Haifa', new_is_populated: true, at_pct: 0.55 },
  }),
  threat(37, 628, 'cruise',    'Western Galilee',          false, 14, 'partial', 0.45),
  buildDecoy(68, 640, 8),
  threat(38, 648, 'ballistic', 'Dimona',                   true,  20, 'full',    0.25, { priority: true }),
  threat(39, 660, 'drone',     'Sinai Border Region',      false, 14, 'full',    0.40),
  threat(40, 672, 'cruise',    'Upper Galilee',            false, 14, 'partial', 0.50),

  // ---- PHASE 4: CHAOS (t=685-870, quads, very short countdowns) ----
  threat(41, 685, 'drone',     'Tzfat',                    true,  18, 'partial', 0.35),
  threat(42, 695, 'hypersonic','Off-course (Red Sea)',      false, 14, 'minimal', 0.55, {
    trajectory: 'Erratic — Loss of control, tumbling',
  }),
  threat(43, 705, 'cruise',    'Beersheba',                true,  16, 'full',    0.30),
  threat(44, 705, 'drone',     'Dead Sea Region',          false, 14, 'partial', 0.50),
  threat(45, 715, 'cruise',    'Judean Hills',             false, 14, 'minimal', 0.55),
  buildDecoy(69, 722, 8),
  threat(46, 728, 'hypersonic','Jerusalem',                 true,  14, 'partial', 0.35),
  threat(47, 738, 'ballistic', 'Arava Valley',             false, 14, 'full',    0.40, {
    course_correct: { new_impact_zone: 'Dimona', new_is_populated: true, at_pct: 0.55 },
    priority: true,
  }),
  threat(48, 748, 'drone',     'Golan Heights',            false, 12, 'minimal', 0.55),
  threat(49, 748, 'cruise',    'Coastal Plain',            false, 14, 'partial', 0.45),
  buildDecoy(70, 758, 8),
  threat(50, 768, 'ballistic', 'Northern Negev',           false, 12, 'full',    0.40),
  threat(51, 778, 'drone',     'Negev Desert',             false, 12, 'partial', 0.50),
  threat(52, 790, 'cruise',    'Mediterranean (off-coast)',false, 12, 'minimal', 0.55),
  threat(53, 800, 'hypersonic','Haifa',                     true,  14, 'full',    0.30),
  threat(54, 812, 'ballistic', 'Southern Negev',           false, 12, 'partial', 0.45),
  threat(55, 825, 'drone',     'Negev Desert',             false, 12, 'full',    0.40),
  buildDecoy(71, 835, 8),
  threat(56, 845, 'cruise',    'Central Negev',            false, 12, 'minimal', 0.55),
  threat(57, 858, 'ballistic', 'Jordan Valley',            false, 12, 'partial', 0.50),

  // ---- PHASE 5: FINAL SALVO "OPERATION IRON STORM" (warning t=855, salvo t=885) ----
  threat(58, 885, 'ballistic', 'Dimona',                   true,  18, 'full',    0.25, { priority: true, is_final_salvo: true }),
  threat(59, 885, 'cruise',    'Tel Aviv',                 true,  18, 'partial', 0.30, { is_final_salvo: true }),
  threat(60, 885, 'drone',     'Beersheba',                true,  16, 'full',    0.30, { is_final_salvo: true }),
  threat(61, 885, 'hypersonic','Jerusalem',                 true,  16, 'partial', 0.35, { is_final_salvo: true }),
  threat(62, 885, 'ballistic', 'Southern Negev',           false, 14, 'minimal', 0.55, { is_final_salvo: true }),
  threat(63, 885, 'cruise',    'Negev Desert',             false, 14, 'minimal', 0.50, { is_final_salvo: true }),
];

// -----------------------------------------------------------
// Exports
// -----------------------------------------------------------
export function getThreats(mode) {
  return mode === 'SHORT' ? THREATS_SHORT : THREATS_FULL;
}

export function getConfig(mode) {
  return GAME_MODES[mode] || GAME_MODES.FULL;
}

// Legacy exports (used by existing code, will be mode-aware via engine)
export const THREATS = THREATS_FULL;
export const INITIAL_AMMO = GAME_MODES.FULL.ammo;
export const STUDY_PHASE_DURATION = GAME_MODES.FULL.study_duration;
export const GAME_DURATION = GAME_MODES.FULL.game_duration;
