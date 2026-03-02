// ============================================================
// PROGRESSIVE GEOGRAPHY REVEAL — Map Layers Configuration
// ============================================================
//
// Each level reveals a new geographic region with cities, outlines,
// and a viewport that zooms into the featured region.
//
// Coordinate system: 0-1 normalized (x: west→east, y: north→south)
// Mapping: x = 0.28 + (lon - 34.78) * 0.3636
//          y = 0.90 - (lat - 29.56) * 0.22
// Must match IMPACT_POSITIONS in threats.js
// ============================================================

// --- City Data ---
// tier 1 = always labeled when visible (major cities)
// tier 2 = labeled only when zoomed in OR targeted by an active threat
// labelDir = direction to offset the label (e, w, ne, nw, se, sw, n, s)

export const CITIES = {
  // === L1: Otef Aza === (GPS-verified positions)
  'Sderot':         { x: 0.212, y: 0.467, region: 'otef_aza', tier: 1, revealLevel: 1, labelDir: 'e' },
  'Ashkelon':       { x: 0.202, y: 0.436, region: 'otef_aza', tier: 1, revealLevel: 1, labelDir: 'ne' },
  "Be'eri":         { x: 0.175, y: 0.490, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'se' },
  'Kfar Aza':       { x: 0.191, y: 0.477, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'n' },
  "Re'im":          { x: 0.162, y: 0.498, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 's' },
  'Netivot':        { x: 0.211, y: 0.490, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'e' },

  // === L2: Galil + Golan Heights ===
  'Haifa':          { x: 0.36, y: 0.19, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'w' },
  'Nahariya':       { x: 0.39, y: 0.15, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'w' },
  'Kiryat Shmona':  { x: 0.56, y: 0.10, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'sw' },
  'Teveriah':       { x: 0.55, y: 0.19, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'e' },
  'Akko':           { x: 0.37, y: 0.17, region: 'galil', tier: 2, revealLevel: 2, labelDir: 'e' },
  'Tzfat':          { x: 0.54, y: 0.15, region: 'galil', tier: 2, revealLevel: 2, labelDir: 'w' },
  'Katzrin':        { x: 0.60, y: 0.14, region: 'golan', tier: 2, revealLevel: 2, labelDir: 'e' },
  'Majdal Shams':   { x: 0.59, y: 0.09, region: 'golan', tier: 2, revealLevel: 2, labelDir: 'w' },

  // === L3: Gush Dan + Center ===
  'Tel Aviv':       { x: 0.28, y: 0.35, region: 'gush_dan', tier: 1, revealLevel: 3, labelDir: 'w' },
  'Ashdod':         { x: 0.24, y: 0.41, region: 'gush_dan', tier: 1, revealLevel: 3, labelDir: 'w' },
  'Jerusalem':      { x: 0.44, y: 0.42, region: 'gush_dan', tier: 1, revealLevel: 3, labelDir: 'e' },
  'Netanya':        { x: 0.31, y: 0.30, region: 'gush_dan', tier: 1, revealLevel: 3, labelDir: 'e' },
  'Rishon LeZion':  { x: 0.27, y: 0.39, region: 'gush_dan', tier: 1, revealLevel: 3, labelDir: 'se' },
  'Petah Tikva':    { x: 0.33, y: 0.34, region: 'gush_dan', tier: 1, revealLevel: 3, labelDir: 'e' },
  'Holon':          { x: 0.27, y: 0.37, region: 'gush_dan', tier: 2, revealLevel: 3, labelDir: 'e' },

  // === L4: Negev === (pushed south for spacing from Otef Aza / Jerusalem)
  'Beersheba':      { x: 0.29, y: 0.57, region: 'negev', tier: 1, revealLevel: 4, labelDir: 'e' },
  'Dimona':         { x: 0.37, y: 0.62, region: 'negev', tier: 1, revealLevel: 4, labelDir: 'e' },
  'Eilat':          { x: 0.35, y: 0.90, region: 'negev', tier: 1, revealLevel: 4, labelDir: 'e' },
  'Arad':           { x: 0.42, y: 0.58, region: 'negev', tier: 2, revealLevel: 4, labelDir: 'ne' },
};

// --- Level Viewport Configuration ---
// Each level zooms into the NEW region, not the whole country.
// L1 & L2 are tight zooms; L3 is the big zoom-out moment.

export const LEVEL_VIEWPORTS = [
  null, // index 0 unused (levels are 1-indexed)
  { centerX: 0.27, centerY: 0.48, scale: 2.5 },   // L1: tight on Otef Aza, cities near Gaza arc on left
  { centerX: 0.48, centerY: 0.15, scale: 1.8 },   // L2: Galil/Golan + battery (slightly wider)
  { centerX: 0.35, centerY: 0.35, scale: 1.0 },   // L3: zoom out — Gush Dan/Otef Aza closer to Gaza arc
  { centerX: 0.33, centerY: 0.44, scale: 0.80 },  // L4: includes Negev + Eilat visible
  { centerX: 0.33, centerY: 0.46, scale: 0.78 },  // L5: full country, Eilat clearly visible
  { centerX: 0.33, centerY: 0.46, scale: 0.78 },  // L6: same
  { centerX: 0.33, centerY: 0.46, scale: 0.78 },  // L7: same
];

// --- Per-Level Battery Positions (Regional HQs) ---
// Iron Dome batteries deployed regionally near the front (L1-L2).
// Upper-tier systems (David's Sling, Arrow) centralized (L3+).

export const LEVEL_BATTERIES = [
  null,
  { x: 0.27, y: 0.46, label: 'Iron Dome' },    // L1: east of Otef Aza cluster, near radar center
  { x: 0.38, y: 0.20, label: 'Iron Dome' },    // L2: near Haifa (northern front)
  { x: 0.30, y: 0.38, label: 'Defense HQ' },   // L3: central Israel (David's Sling)
  { x: 0.30, y: 0.38, label: 'Defense HQ' },   // L4: central (Arrow 2)
  { x: 0.30, y: 0.38, label: 'Defense HQ' },   // L5: central (Arrow 3)
  { x: 0.30, y: 0.38, label: 'Defense HQ' },   // L6
  { x: 0.30, y: 0.38, label: 'Defense HQ' },   // L7
];

// --- Region Outlines ---
// Polygon boundaries for each region, revealed progressively.
// Shaped to approximate actual geographic regions (not rectangles).

export const REGIONS = [
  {
    name: 'Otef Aza',
    revealLevel: 1,
    color: 'rgba(0, 255, 136, 0.06)',
    polygon: [
      [0.15, 0.44], [0.22, 0.44], [0.23, 0.47],
      [0.23, 0.51], [0.15, 0.51], [0.14, 0.47],
    ],
    labelPos: { x: 0.195, y: 0.52 },
  },
  {
    name: 'Galil',
    revealLevel: 2,
    color: 'rgba(0, 200, 255, 0.20)',
    polygon: [
      [0.35, 0.11], [0.52, 0.08], [0.55, 0.12],
      [0.55, 0.21], [0.36, 0.23], [0.33, 0.18],
    ],
    labelPos: { x: 0.45, y: 0.22 },
  },
  {
    name: 'Golan Heights',
    revealLevel: 2,
    color: 'rgba(100, 180, 255, 0.20)',
    polygon: [
      [0.56, 0.06], [0.65, 0.07], [0.65, 0.19],
      [0.57, 0.22], [0.55, 0.18], [0.55, 0.10],
    ],
    labelPos: { x: 0.58, y: 0.16 },
  },
  {
    name: 'Gush Dan',
    revealLevel: 3,
    color: 'rgba(0, 255, 200, 0.15)',
    polygon: [
      [0.25, 0.28], [0.35, 0.28], [0.46, 0.38],
      [0.46, 0.44], [0.24, 0.44], [0.24, 0.34],
    ],
    labelPos: { x: 0.32, y: 0.46 },
  },
  {
    name: 'Negev',
    revealLevel: 4,
    color: 'rgba(255, 200, 100, 0.15)',
    polygon: [
      [0.22, 0.55], [0.48, 0.55], [0.46, 0.68],
      [0.42, 0.80], [0.37, 0.92], [0.33, 0.92],
      [0.28, 0.75], [0.22, 0.62],
    ],
    labelPos: { x: 0.35, y: 0.70 },
  },
  // L5 unpopulated regions — outlines only, no cities
  {
    name: 'Arava',
    revealLevel: 5,
    color: 'rgba(180, 150, 80, 0.12)',
    polygon: [
      [0.42, 0.58], [0.50, 0.55], [0.48, 0.72],
      [0.44, 0.85], [0.38, 0.92], [0.38, 0.75],
    ],
    labelPos: { x: 0.45, y: 0.72 },
  },
  // Judean Desert removed — label caused clutter on zoomed-out views
];


// --- Threat Origin Indicators ---
// Labeled arc segments at the radar perimeter showing where threats come from.
// Angles in degrees (0 = top/north, clockwise). GPS-verified bearings.
// activeLevels = which levels show this arc (not cumulative — Gaza hidden in L2).

export const THREAT_ORIGINS = [
  { name: 'Gaza',    angle: 270, arcSpan: 20, activeLevels: [1, 3, 4, 5, 6, 7] },    // W (verified: ~270°)
  { name: 'Lebanon', angle: 0,   arcSpan: 35, activeLevels: [2, 3, 4, 5, 6, 7] },    // N — spans northern border (~342.5° to 17.5°)
  { name: 'Syria',   angle: 48,  arcSpan: 35, activeLevels: [2, 3, 4, 5, 6, 7] },    // NE — Golan/eastern border (~30° to 66°)
  { name: 'Iran',    angle: 100, arcSpan: 25, activeLevels: [3, 4, 5, 6, 7] },        // E-ESE — between Syria and Yemen (~87° to 113°)
  { name: 'Yemen',   angle: 155, arcSpan: 25, activeLevels: [3, 4, 5, 6, 7] },        // SSE (~142° to 168°)
];


// --- Helper Functions ---

/** Get all cities visible at a given level (accumulates) */
export function getVisibleCities(level) {
  const result = {};
  for (const [name, city] of Object.entries(CITIES)) {
    if (city.revealLevel <= level) {
      result[name] = city;
    }
  }
  return result;
}

/** Get the viewport config for a given level */
export function getViewportForLevel(level) {
  const idx = Math.min(level, LEVEL_VIEWPORTS.length - 1);
  return LEVEL_VIEWPORTS[idx] || LEVEL_VIEWPORTS[5];
}

/** Get the battery position for a given level */
export function getBatteryForLevel(level) {
  const idx = Math.min(level, LEVEL_BATTERIES.length - 1);
  return LEVEL_BATTERIES[idx] || LEVEL_BATTERIES[3];
}

/** Get all region outlines visible at a given level */
export function getVisibleRegions(level) {
  return REGIONS.filter((r) => r.revealLevel <= level);
}

/** Get threat origin indicators active at a given level (NOT cumulative) */
export function getVisibleThreatOrigins(level) {
  return THREAT_ORIGINS.filter((o) => o.activeLevels.includes(level));
}

