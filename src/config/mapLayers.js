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
// isBase = military installation (rendered with diamond marker, hidden at L6+ unless targeted)

export const CITIES = {
  // === L1: Otef Aza === (GPS-verified positions)
  'Sderot':         { x: 0.212, y: 0.467, region: 'otef_aza', tier: 1, revealLevel: 1, labelDir: 'e', he: 'שְׂדֵרוֹת', population: '27K' },
  'Ashkelon':       { x: 0.202, y: 0.436, region: 'otef_aza', tier: 1, revealLevel: 1, labelDir: 'w', he: 'אַשְׁקְלוֹן', population: '155K' },
  "Be'eri":         { x: 0.175, y: 0.490, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'se', he: 'בְּאֵרִי' },
  'Kfar Aza':       { x: 0.191, y: 0.477, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'n', he: 'כְּפַר עַזָּה' },
  "Re'im":          { x: 0.162, y: 0.498, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 's', he: 'רְעִים' },
  'Netivot':        { x: 0.211, y: 0.490, region: 'otef_aza', tier: 2, revealLevel: 1, labelDir: 'e', he: 'נְתִיבוֹת' },

  // === L2: Galil + Golan Heights === (GPS-verified positions)
  'Haifa':          { x: 0.36, y: 0.19, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'se', he: 'חֵיפָה', population: '285K' },
  'Nahariya':       { x: 0.40, y: 0.14, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'nw', he: 'נַהֲרִיָּה', population: '60K' },
  'Kiryat Shmona':  { x: 0.56, y: 0.10, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'nw', he: 'קִרְיַת שְׁמוֹנָה', population: '24K' },
  'Teveriah':       { x: 0.55, y: 0.19, region: 'galil', tier: 1, revealLevel: 2, labelDir: 'e', he: 'טְבֶרְיָה', population: '45K' },
  'Akko':           { x: 0.39, y: 0.16, region: 'galil', tier: 2, revealLevel: 2, labelDir: 'e', he: 'עַכּוֹ' },
  'Tzfat':          { x: 0.54, y: 0.15, region: 'galil', tier: 2, revealLevel: 2, labelDir: 'w', he: 'צְפַת' },
  'Katzrin':        { x: 0.61, y: 0.14, region: 'golan', tier: 1, revealLevel: 2, labelDir: 'e', he: 'קַצְרִין', population: '8K' },
  'Majdal Shams':   { x: 0.64, y: 0.08, region: 'golan', tier: 2, revealLevel: 2, labelDir: 'w', he: 'מַגְ׳דַל שַׁמְס' },

  // === L3: Central Israel (Tel Aviv metro, Jerusalem corridor, Judean foothills) ===
  // tier 1: major cities always labeled on zoomed-out maps (L5+)
  // tier 2: labeled only when zoomed in (L3) or when actively targeted (L5+)
  'Tel Aviv':       { x: 0.28, y: 0.35, region: 'central', tier: 1, revealLevel: 3, labelDir: 'nw', he: 'תֵּל אָבִיב', population: '470K' },
  'Jerusalem':      { x: 0.44, y: 0.42, region: 'central', tier: 1, revealLevel: 3, labelDir: 'se', he: 'יְרוּשָׁלַיִם', population: '980K' },
  'Netanya':        { x: 0.31, y: 0.30, region: 'central', tier: 1, revealLevel: 3, labelDir: 'ne', he: 'נְתַנְיָה', population: '225K' },
  "Ra'anana":       { x: 0.313, y: 0.323, region: 'central', tier: 2, revealLevel: 3, labelDir: 'w', he: 'רַעֲנַנָּה' },
  'Petah Tikva':    { x: 0.33, y: 0.34, region: 'central', tier: 2, revealLevel: 3, labelDir: 'e', he: 'פֶּתַח תִּקְוָה', population: '265K' },
  'Rishon LeZion':  { x: 0.27, y: 0.39, region: 'central', tier: 2, revealLevel: 3, labelDir: 'e', he: 'רִאשׁוֹן לְצִיּוֹן', population: '260K' },
  'Ashdod':         { x: 0.24, y: 0.41, region: 'central', tier: 2, revealLevel: 3, labelDir: 'w', he: 'אַשְׁדּוֹד', population: '225K' },
  "Modi'in":        { x: 0.364, y: 0.386, region: 'central', tier: 2, revealLevel: 3, labelDir: 'e', he: 'מוֹדִיעִין' },
  'Gush Etzion':    { x: 0.417, y: 0.442, region: 'central', tier: 2, revealLevel: 3, labelDir: 'se', he: 'גּוּשׁ עֶצְיוֹן' },
  'Holon':          { x: 0.27, y: 0.37, region: 'central', tier: 2, revealLevel: 3, labelDir: 'e', he: 'חוֹלוֹן', population: '200K' },

  // === L4: Strategic Infrastructure — Critical targets enemies want to destroy ===
  // isInfra = infrastructure marker (rendered with ▲ triangle, distinct from city ● and base ◆)
  'BAZAN Oil Refinery':       { x: 0.34, y: 0.20, region: 'infra', tier: 1, revealLevel: 4, labelDir: 'n', isInfra: true, he: 'בז"ן', shortLabel: 'BAZAN Refinery' },
  'Orot Rabin Power Station': { x: 0.32, y: 0.27, region: 'infra', tier: 1, revealLevel: 4, labelDir: 'e', isInfra: true, he: 'אוֹרוֹת רָבִּין', shortLabel: 'Orot Rabin\nPower Stn' },
  'Sorek Desalination Plant': { x: 0.23, y: 0.39, region: 'infra', tier: 1, revealLevel: 4, labelDir: 'w', isInfra: true, he: 'סוֹרֵק', shortLabel: 'Sorek\nDesalination' },
  'Rutenberg Power Station':  { x: 0.20, y: 0.44, region: 'infra', tier: 1, revealLevel: 4, labelDir: 'w', isInfra: true, he: 'רוּטֶנְבֶּרְג', shortLabel: 'Rutenberg\nPower Stn' },
  'Ashdod Port':              { x: 0.23, y: 0.42, region: 'infra', tier: 1, revealLevel: 4, labelDir: 'se', isInfra: true, he: 'נָמָל אַשְׁדּוֹד', shortLabel: 'Ashdod Port' },
  'The Kirya (IDF HQ)':       { x: 0.29, y: 0.36, region: 'infra', tier: 1, revealLevel: 4, labelDir: 'w', isInfra: true, he: 'הַקִּרְיָה', shortLabel: 'The Kirya\nIDF HQ' },
  'Dimona Nuclear Reactor':   { x: 0.37, y: 0.62, region: 'infra', tier: 1, revealLevel: 4, labelDir: 'e', isInfra: true, he: 'כּוֹר דִּימוֹנָה', shortLabel: 'Dimona\nNuclear Facility' },
  'Ben Gurion Airport':       { x: 0.32, y: 0.37, region: 'infra', tier: 1, revealLevel: 4, labelDir: 'ne', isInfra: true, he: 'נתב"ג', shortLabel: 'Ben Gurion\nAirport' },
  // Landmark city revealed at L4 for geographic reference
  'Beersheba':      { x: 0.29, y: 0.57, region: 'negev', tier: 1, revealLevel: 4, labelDir: 'e', he: 'בְּאֵר שֶׁבַע', population: '210K' },

  // === L5: Army Bases — Military installations targeted by ballistic/hypersonic missiles ===
  // isBase = military base (rendered with ◆ diamond marker)
  // keyBase = persists on map at L6+ even when not targeted
  'Ramat David AFB':  { x: 0.43, y: 0.22, region: 'bases', tier: 1, revealLevel: 5, labelDir: 'e', isBase: true, keyBase: true, he: 'רָמַת דָּוִד' },
  'Glilot (Unit 8200)': { x: 0.29, y: 0.33, region: 'bases', tier: 1, revealLevel: 5, labelDir: 'w', isBase: true, he: 'גְּלִילוֹת 8200' },
  'Palmachim AFB':    { x: 0.24, y: 0.38, region: 'bases', tier: 1, revealLevel: 5, labelDir: 'w', isBase: true, keyBase: true, he: 'פַּלְמַחִים' },
  'Nevatim AFB':      { x: 0.36, y: 0.51, region: 'bases', tier: 1, revealLevel: 5, labelDir: 'e', isBase: true, keyBase: true, he: 'נְבָטִים' },
  'Tel Nof AFB':      { x: 0.31, y: 0.42, region: 'bases', tier: 1, revealLevel: 5, labelDir: 'e', isBase: true, he: 'תֵּל נוֹף' },
  'Ramon AFB':        { x: 0.24, y: 0.62, region: 'bases', tier: 1, revealLevel: 5, labelDir: 'e', isBase: true, he: 'רָמוֹן' },
  'Sdot Micha':       { x: 0.36, y: 0.46, region: 'bases', tier: 1, revealLevel: 5, labelDir: 'e', isBase: true, he: 'שְׂדוֹת מִיכָה' },

  // === L6: Full map reveal — Eilat ===
  'Eilat':          { x: 0.35, y: 0.90, region: 'negev', tier: 1, revealLevel: 6, labelDir: 'e', he: 'אֵילַת', population: '55K' },
};

// --- Level Viewport Configuration ---
// Steady zoom-out progression: 2.5 → 1.8 → 1.8 → 1.3 → 0.80 → 0.78 → 0.78
// L1-L3: regional zooms. L4: populated corridor. L5: bases wide. L6-L7: full map.

export const LEVEL_VIEWPORTS = [
  null, // index 0 unused (levels are 1-indexed)
  { centerX: 0.27, centerY: 0.48, scale: 2.5 },   // L1: tight on Otef Aza
  { centerX: 0.48, centerY: 0.15, scale: 1.8 },   // L2: Galil/Golan
  { centerX: 0.34, centerY: 0.38, scale: 2.0 },   // L3: Central Israel — tighter for population labels
  { centerX: 0.32, centerY: 0.40, scale: 1.2 },   // L4: infrastructure corridor — Haifa to Dimona
  { centerX: 0.33, centerY: 0.42, scale: 1.0 },   // L5: military bases — tighter for base spread
  { centerX: 0.43, centerY: 0.46, scale: 0.78 },  // L6: full map — first complete view
  { centerX: 0.43, centerY: 0.46, scale: 0.78 },  // L7: full map — April 13
];

// --- Per-Level Battery Positions ---
// Iron Dome batteries deployed regionally near the front (L1-L2).
// David's Sling based at Hatzor AFB (L3).
// Arrow 2 based at Palmachim area (L4 — corridor view, label handled by city).
// Nationwide (L5-7): distributed batteries — getNearestBattery picks the closest.

export const LEVEL_BATTERIES = [
  null,
  { x: 0.24, y: 0.455, label: 'Hatzerim AFB', labelDir: 'e' },    // L1: Iron Dome battery
  { x: 0.43, y: 0.22, label: 'Ramat David AFB', labelDir: 's' },  // L2: northern air defense
  { x: 0.25, y: 0.42, label: 'Hatzor AFB', labelDir: 's' },       // L3: David's Sling home base
  { x: 0.30, y: 0.50, label: 'Arrow Battery', labelDir: 'e' },    // L4: Arrow 2 — between coast and Beersheba, clear of infra
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
    labelPos: { x: 0.46, y: 0.13 },
  },
  {
    name: 'Golan Heights',
    revealLevel: 2,
    color: 'rgba(100, 180, 255, 0.20)',
    polygon: [
      [0.58, 0.05], [0.68, 0.06], [0.68, 0.18],
      [0.62, 0.22], [0.58, 0.18], [0.57, 0.10],
    ],
    labelPos: { x: 0.63, y: 0.04 },
  },
  {
    name: 'Central Israel',
    revealLevel: 3,
    color: 'rgba(0, 255, 200, 0.15)',
    polygon: [
      [0.22, 0.28], [0.36, 0.28], [0.46, 0.38],
      [0.46, 0.46], [0.22, 0.46], [0.22, 0.34],
    ],
    labelPos: { x: 0.375, y: 0.36 },
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
  // L6 unpopulated regions — outlines only, no cities (revealed with full map)
  {
    name: 'Arava',
    revealLevel: 6,
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
  { name: 'Iran',    angle: 100, arcSpan: 40, activeLevels: [3, 4, 5, 6, 7] },        // E-ESE — wide arc covers SPAWN_FAR entry (~80° to 120°)
  { name: 'Yemen',   angle: 155, arcSpan: 25, activeLevels: [5, 6, 7] },              // SSE (~142° to 168°) — first appears at L5
];


// --- Helper Functions ---

// Landmark cities shown as faded reference points at L4-L5 for geographic orientation
// L4 infrastructure: full set for context. L5 bases: only south/east (Tel Aviv/Haifa overlap with bases).
const LANDMARKS_L4 = new Set(['Tel Aviv', 'Jerusalem', 'Haifa', 'Beersheba']);
const LANDMARKS_L5 = new Set(['Jerusalem', 'Beersheba']);

/** Get cities visible at a given level.
 *  L1-L3: region-specific (only that level's cities) — focused zoom per front.
 *  L4-L5: theme-focused — that level's entries (infra/bases) + landmark cities for reference.
 *  L6+: cumulative (all cities revealed so far) — full map view. */
export function getVisibleCities(level) {
  const result = {};
  const landmarks = level === 5 ? LANDMARKS_L5 : LANDMARKS_L4;
  for (const [name, city] of Object.entries(CITIES)) {
    if (level <= 3) {
      // Region-specific: only show this level's cities
      if (city.revealLevel === level) result[name] = city;
    } else if (level <= 5) {
      // Theme-focused: show this level's entries + landmark cities for orientation
      if (city.revealLevel === level) result[name] = city;
      else if (landmarks.has(name) && city.revealLevel <= level) result[name] = city;
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
 *  L1-L3: only that level's region. L4+: cumulative. */
export function getVisibleRegions(level) {
  if (level <= 3) return REGIONS.filter((r) => r.revealLevel === level);
  if (level === 4) return []; // L4 infrastructure labels are dense — skip region names to avoid overlap
  if (level === 5) return REGIONS.filter((r) => r.revealLevel <= level && r.name !== 'Golan Heights' && r.name !== 'Otef Aza');
  return REGIONS.filter((r) => r.revealLevel <= level);
}

/** Get threat origin indicators active at a given level (NOT cumulative) */
export function getVisibleThreatOrigins(level) {
  return THREAT_ORIGINS.filter((o) => o.activeLevels.includes(level));
}

