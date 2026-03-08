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
// isBase = military installation (rendered with diamond marker, hidden at L5+ unless targeted)

export const CITIES = {
  // === L1: Otef Aza === (GPS-verified positions)
  'Sderot':         { x: 0.212, y: 0.467, region: 'otef_aza', tier: 1, revealLevel: 1, labelDir: 'e', he: 'שְׂדֵרוֹת' },
  'Ashkelon':       { x: 0.202, y: 0.436, region: 'otef_aza', tier: 1, revealLevel: 1, labelDir: 'w', he: 'אַשְׁקְלוֹן' },
  "Be'eri":         { x: 0.175, y: 0.490, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'se', he: 'בְּאֵרִי' },
  'Kfar Aza':       { x: 0.191, y: 0.477, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'n', he: 'כְּפַר עַזָּה' },
  "Re'im":          { x: 0.162, y: 0.498, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 's', he: 'רְעִים' },
  'Netivot':        { x: 0.211, y: 0.490, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'e', he: 'נְתִיבוֹת' },

  // === L2: Galil + Golan Heights === (GPS-verified positions)
  'Haifa':          { x: 0.36, y: 0.19, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'w', he: 'חֵיפָה' },
  'Nahariya':       { x: 0.40, y: 0.14, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'nw', he: 'נַהֲרִיָּה' },
  'Kiryat Shmona':  { x: 0.56, y: 0.10, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'nw', he: 'קִרְיַת שְׁמוֹנָה' },
  'Teveriah':       { x: 0.55, y: 0.19, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'e', he: 'טְבֶרְיָה' },
  'Akko':           { x: 0.39, y: 0.16, region: 'galil', tier: 2, revealLevel: 2, labelDir: 'e', he: 'עַכּוֹ' },
  'Tzfat':          { x: 0.54, y: 0.15, region: 'galil', tier: 2, revealLevel: 2, labelDir: 'w', he: 'צְפַת' },
  'Katzrin':        { x: 0.61, y: 0.14, region: 'golan', tier: 1, revealLevel: 2, labelDir: 'e', he: 'קַצְרִין' },
  'Majdal Shams':   { x: 0.64, y: 0.08, region: 'golan', tier: 2, revealLevel: 2, labelDir: 'w', he: 'מַגְ׳דַל שַׁמְס' },

  // === L3: Central Israel (Tel Aviv metro, Jerusalem corridor, Judean foothills) ===
  // tier 1: major cities always labeled on zoomed-out maps (L5+)
  // tier 2: labeled only when zoomed in (L3) or when actively targeted (L5+)
  'Tel Aviv':       { x: 0.28, y: 0.35, region: 'central', tier: 1, revealLevel: 3, labelDir: 'nw', he: 'תֵּל אָבִיב' },
  'Jerusalem':      { x: 0.44, y: 0.42, region: 'central', tier: 1, revealLevel: 3, labelDir: 'e', he: 'יְרוּשָׁלַיִם' },
  'Netanya':        { x: 0.31, y: 0.30, region: 'central', tier: 1, revealLevel: 3, labelDir: 'n', he: 'נְתַנְיָה' },
  "Ra'anana":       { x: 0.313, y: 0.323, region: 'central', tier: 2, revealLevel: 3, labelDir: 'w', he: 'רַעֲנַנָּה' },
  'Petah Tikva':    { x: 0.33, y: 0.34, region: 'central', tier: 2, revealLevel: 3, labelDir: 'e', he: 'פֶּתַח תִּקְוָה' },
  'Rishon LeZion':  { x: 0.27, y: 0.39, region: 'central', tier: 2, revealLevel: 3, labelDir: 'sw', he: 'רִאשׁוֹן לְצִיּוֹן' },
  'Ashdod':         { x: 0.24, y: 0.41, region: 'central', tier: 2, revealLevel: 3, labelDir: 'w', he: 'אַשְׁדּוֹד' },
  "Modi'in":        { x: 0.364, y: 0.386, region: 'central', tier: 2, revealLevel: 3, labelDir: 'e', he: 'מוֹדִיעִין' },
  'Gush Etzion':    { x: 0.417, y: 0.442, region: 'central', tier: 2, revealLevel: 3, labelDir: 'se', he: 'גּוּשׁ עֶצְיוֹן' },
  'Holon':          { x: 0.27, y: 0.37, region: 'central', tier: 2, revealLevel: 3, labelDir: 'e', he: 'חוֹלוֹן' },

  // === L4: Israeli Military Bases === (GPS-verified positions)
  // Strategic installations targeted by ballistic missiles. Shown exclusively at L4.
  // At L5+, only keyBase entries persist on the map; others hide unless actively targeted.
  'Ramat David AFB':  { x: 0.43, y: 0.22, region: 'bases', tier: 1, revealLevel: 4, labelDir: 'e', isBase: true, keyBase: true, he: 'רָמַת דָּוִד' },
  'Glilot (Unit 8200)': { x: 0.29, y: 0.33, region: 'bases', tier: 1, revealLevel: 4, labelDir: 'w', isBase: true, he: 'גְּלִילוֹת 8200' },
  'Palmachim AFB':    { x: 0.24, y: 0.38, region: 'bases', tier: 1, revealLevel: 4, labelDir: 'w', isBase: true, keyBase: true, he: 'פַּלְמַחִים' },
  'Nevatim AFB':      { x: 0.36, y: 0.51, region: 'bases', tier: 1, revealLevel: 4, labelDir: 'e', isBase: true, keyBase: true, he: 'נְבָטִים' },
  'Tel Nof AFB':      { x: 0.31, y: 0.42, region: 'bases', tier: 1, revealLevel: 4, labelDir: 'e', isBase: true, he: 'תֵּל נוֹף' },
  'Ramon AFB':        { x: 0.24, y: 0.62, region: 'bases', tier: 1, revealLevel: 4, labelDir: 'e', isBase: true, he: 'רָמוֹן' },
  'Sdot Micha':       { x: 0.36, y: 0.46, region: 'bases', tier: 1, revealLevel: 4, labelDir: 'e', isBase: true, he: 'שְׂדוֹת מִיכָה' },

  // === L5: Coastal bridge + Negev === (full geography reveal)
  // Coastal cities between Galil and Central — fill the visual gap on full map
  'Caesarea':       { x: 0.320, y: 0.253, region: 'coast', tier: 2, revealLevel: 5, labelDir: 'w', he: 'קֵיסָרְיָה' },
  'Hadera':         { x: 0.331, y: 0.269, region: 'coast', tier: 2, revealLevel: 5, labelDir: 'e', he: 'חֲדֵרָה' },
  // Negev (pushed south for spacing from Otef Aza / Jerusalem)
  'Beersheba':      { x: 0.29, y: 0.57, region: 'negev', tier: 1, revealLevel: 5, labelDir: 'e', he: 'בְּאֵר שֶׁבַע' },
  'Dimona':         { x: 0.37, y: 0.62, region: 'negev', tier: 1, revealLevel: 5, labelDir: 's', he: 'דִּימוֹנָה' },
  'Eilat':          { x: 0.35, y: 0.90, region: 'negev', tier: 1, revealLevel: 5, labelDir: 'e', he: 'אֵילַת' },
  'Arad':           { x: 0.42, y: 0.58, region: 'negev', tier: 2, revealLevel: 5, labelDir: 'ne', he: 'עֲרָד' },
};

// --- Level Viewport Configuration ---
// Each level zooms into the NEW region, not the whole country.
// L1 & L2 are tight zooms; L3 is the big zoom-out moment.

export const LEVEL_VIEWPORTS = [
  null, // index 0 unused (levels are 1-indexed)
  { centerX: 0.27, centerY: 0.48, scale: 2.5 },   // L1: tight on Otef Aza, cities near Gaza arc on left
  { centerX: 0.48, centerY: 0.15, scale: 1.8 },   // L2: Galil/Golan + battery (slightly wider)
  { centerX: 0.34, centerY: 0.39, scale: 1.8 },   // L3: Central Israel — shifted right so Jerusalem isn't near Iran arc edge
  { centerX: 0.33, centerY: 0.44, scale: 0.80 },  // L4: military bases — full map, bases only
  { centerX: 0.43, centerY: 0.46, scale: 0.78 },  // L5: full geography — Jerusalem near center, Golan visible
  { centerX: 0.43, centerY: 0.46, scale: 0.78 },  // L6: same
  { centerX: 0.43, centerY: 0.46, scale: 0.78 },  // L7: same
];

// --- Per-Level Battery Positions ---
// Iron Dome batteries deployed regionally near the front (L1-L2).
// David's Sling based at Hatzor AFB (L3).
// Arrow systems based at Palmachim AFB (L4).
// Nationwide (L5-7): distributed batteries — interceptors fire from nearest base.

export const LEVEL_BATTERIES = [
  null,
  { x: 0.24, y: 0.455, label: 'Hatzerim AFB', labelDir: 'e' },      // L1: Iron Dome battery
  { x: 0.43, y: 0.22, label: 'Ramat David AFB', labelDir: 's' },  // L2: northern air defense
  { x: 0.25, y: 0.42, label: 'Hatzor AFB', labelDir: 's' },       // L3: David's Sling home base
  { x: 0.22, y: 0.40, label: 'Palmachim AFB', labelDir: 'sw' },   // L4: Arrow 2 primary site
  // L5-7: array of distributed batteries — getNearestBattery picks the closest
  [
    { x: 0.24, y: 0.38, label: 'Palmachim' },     // Central coast — Arrow 2/3 primary
    { x: 0.43, y: 0.22, label: 'Ramat David' },   // North — Iron Dome / air defense
    { x: 0.36, y: 0.51, label: 'Nevatim' },       // South — strategic air base
  ],
  [
    { x: 0.24, y: 0.38, label: 'Palmachim' },
    { x: 0.43, y: 0.22, label: 'Ramat David' },
    { x: 0.36, y: 0.51, label: 'Nevatim' },
  ],
  [
    { x: 0.24, y: 0.38, label: 'Palmachim' },
    { x: 0.43, y: 0.22, label: 'Ramat David' },
    { x: 0.36, y: 0.51, label: 'Nevatim' },
  ],
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
    labelPos: { x: 0.43, y: 0.22 },
  },
  {
    name: 'Golan Heights',
    revealLevel: 2,
    color: 'rgba(100, 180, 255, 0.20)',
    polygon: [
      [0.58, 0.05], [0.68, 0.06], [0.68, 0.18],
      [0.62, 0.22], [0.58, 0.18], [0.57, 0.10],
    ],
    labelPos: { x: 0.69, y: 0.08 },
  },
  {
    name: 'Central Israel',
    revealLevel: 3,
    color: 'rgba(0, 255, 200, 0.15)',
    polygon: [
      [0.22, 0.28], [0.36, 0.28], [0.46, 0.38],
      [0.46, 0.46], [0.22, 0.46], [0.22, 0.34],
    ],
    labelPos: { x: 0.42, y: 0.35 },
  },
  {
    name: 'Negev',
    revealLevel: 5,
    color: 'rgba(255, 200, 100, 0.15)',
    polygon: [
      [0.22, 0.55], [0.48, 0.55], [0.46, 0.68],
      [0.42, 0.80], [0.37, 0.92], [0.33, 0.92],
      [0.28, 0.75], [0.22, 0.62],
    ],
    labelPos: { x: 0.33, y: 0.72 },
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
    labelPos: { x: 0.46, y: 0.78 },
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
  { name: 'Syria',   angle: 48,  arcSpan: 35, activeLevels: [2, 4, 5, 6, 7] },       // NE — Golan/eastern border (~30° to 66°)
  { name: 'Iran',    angle: 100, arcSpan: 25, activeLevels: [3, 4, 5, 6, 7] },        // E-ESE — between Syria and Yemen (~87° to 113°)
  { name: 'Yemen',   angle: 155, arcSpan: 25, activeLevels: [4, 5, 6, 7] },           // SSE (~142° to 168°)
];


// --- Helper Functions ---

/** Get cities visible at a given level.
 *  L1-L4: region-specific (only that level's cities/bases) — focused zoom per front.
 *  L5+: cumulative (all cities + bases revealed so far) — full map. */
export function getVisibleCities(level) {
  const result = {};
  for (const [name, city] of Object.entries(CITIES)) {
    if (level <= 4) {
      // Region-specific: only show this level's cities/bases
      if (city.revealLevel === level) result[name] = city;
    } else {
      // Cumulative: show all cities revealed up to this level
      if (city.revealLevel <= level) result[name] = city;
    }
  }
  return result;
}

/** Get the viewport config for a given level */
export function getViewportForLevel(level) {
  const idx = Math.min(level, LEVEL_VIEWPORTS.length - 1);
  return LEVEL_VIEWPORTS[idx] || LEVEL_VIEWPORTS[5];
}

/** Get battery config for a given level.
 *  Returns a single battery object (L1-4) or an array of batteries (L5-7). */
export function getBatteryForLevel(level) {
  const idx = Math.min(level, LEVEL_BATTERIES.length - 1);
  return LEVEL_BATTERIES[idx] || LEVEL_BATTERIES[3];
}

/** Get the nearest battery to a target position.
 *  For L1-4 (single battery) returns that battery.
 *  For L5-7 (multiple batteries) returns the closest one. */
export function getNearestBattery(level, targetX, targetY) {
  const entry = getBatteryForLevel(level);
  if (!entry) return null;
  if (!Array.isArray(entry)) return entry;
  // Find nearest battery by Euclidean distance
  let best = entry[0];
  let bestDist = Infinity;
  for (const b of entry) {
    const dx = b.x - targetX;
    const dy = b.y - targetY;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) { bestDist = dist; best = b; }
  }
  return best;
}

/** Get region labels visible at a given level.
 *  L1-L4: only that level's region. L5+: cumulative. */
export function getVisibleRegions(level) {
  if (level <= 4) return REGIONS.filter((r) => r.revealLevel === level);
  return REGIONS.filter((r) => r.revealLevel <= level);
}

/** Get threat origin indicators active at a given level (NOT cumulative) */
export function getVisibleThreatOrigins(level) {
  return THREAT_ORIGINS.filter((o) => o.activeLevels.includes(level));
}

