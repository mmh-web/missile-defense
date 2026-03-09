# Missile Defense

Educational missile defense game simulating Israel's multi-layered air defense system. A 7-level campaign teaches players about Iron Dome through Arrow 3 via progressive geography reveal, threat escalation, and real-world educational content. Built for classroom and escape-room use with facilitator controls and an optional campaign-wide countdown timer.

**Live Demo:** https://mmh-cyber.github.io/missile-defense/

---

## Table of Contents

1. [Tech Stack & Dependencies](#tech-stack--dependencies)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Game Overview](#game-overview)
5. [Game State Machine](#game-state-machine)
6. [Level Progression](#level-progression)
7. [Threat System](#threat-system)
8. [Interceptor Systems](#interceptor-systems)
9. [Coordinate System](#coordinate-system)
10. [Radar Display](#radar-display)
11. [Scoring System](#scoring-system)
12. [Educational Briefing System](#educational-briefing-system)
13. [Quiz System](#quiz-system)
14. [Sound System](#sound-system)
15. [Visual Effects & Animations](#visual-effects--animations)
16. [Cheat Code System](#cheat-code-system)
17. [Facilitator Controls](#facilitator-controls)
18. [Escape Room Mode](#escape-room-mode)
19. [Leaderboard](#leaderboard)
20. [Deployment](#deployment)
21. [Debug & Testing](#debug--testing)

---

## Tech Stack & Dependencies

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool / dev server |
| Tailwind CSS | 4.x | Utility-first CSS (via `@tailwindcss/vite` plugin) |
| `@vitejs/plugin-react` | 5.x | React fast refresh for Vite |

No component library, no router, no backend. The entire app is a single-page application deployed as static files to GitHub Pages.

**`package.json` scripts:**
- `npm run dev` — Start Vite dev server (port 5173, host 127.0.0.1)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build locally

**Vite config** (`vite.config.js`):
- Base path: `/missile-defense/` (for GitHub Pages subpath deployment)
- Plugins: `react()`, `tailwindcss()`
- Dev server binds to `127.0.0.1:5173`

---

## Project Structure

```
missile-defense/
├── public/
│   ├── sounds/               # Audio files
│   │   ├── music-level-1.mp3 ... music-level-7.mp3
│   │   ├── music-default.mp3
│   │   ├── briefing-music.mp3
│   │   └── siren.mp3
│   └── images/
│       └── sufrin.png         # Cheat code portrait
├── src/
│   ├── App.jsx               # Root component, game flow orchestration
│   ├── index.css             # All CSS animations and custom styles
│   ├── main.jsx              # React entry point
│   ├── hooks/
│   │   └── useGameEngine.js  # Core game engine (state, scoring, threats, cheats)
│   ├── components/
│   │   ├── RadarDisplay.jsx  # SVG radar, blips, trails, effects, CRT atmosphere
│   │   ├── ThreatPanel.jsx   # Right-side threat cards with countdowns
│   │   ├── ControlPanel.jsx  # Bottom interceptor buttons
│   │   ├── EducationalBriefing.jsx  # Pre-level educational content + quiz
│   │   ├── LevelIntro.jsx    # Level intro screen (L2+)
│   │   ├── LevelComplete.jsx # Post-level score breakdown + badges
│   │   ├── Summary.jsx       # Campaign summary + leaderboard save
│   │   ├── ScoringIntro.jsx  # One-time scoring explanation screen
│   │   ├── FacilitatorControls.jsx  # Teacher/facilitator settings panel
│   │   ├── EscapeRoomTimer.jsx      # Campaign-wide countdown display
│   │   ├── TzevaAdom.jsx     # Red alert siren overlay on city hit
│   │   └── Leaderboard.jsx   # Standalone leaderboard modal
│   ├── config/
│   │   ├── threats.js        # Threat arrays, LEVELS config, ammo, impact positions
│   │   ├── mapLayers.js      # Cities, regions, viewports, batteries
│   │   ├── spawnOrigins.js   # Radar edge spawn points per origin direction
│   │   └── quizData.js       # Per-level quiz question banks
│   └── utils/
│       ├── soundEffects.js   # Web Audio API synthesized sound effects
│       ├── musicPlayer.js    # Background music player (MP3 files)
│       └── leaderboard.js    # localStorage leaderboard persistence
├── vite.config.js
├── package.json
├── CLAUDE.md                 # Architecture reference for AI assistants
└── README.md                 # This file
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://127.0.0.1:5173/missile-defense/

# Production build
npm run build
```

---

## Game Overview

Players operate Israel's multi-layered air defense system across 7 progressively harder levels. Each level:

1. Shows an **educational briefing** with real-world facts about the region and defense systems
2. Tests knowledge with a **2-question quiz**
3. Enters **active gameplay** where threats appear on a radar display
4. Players must **identify each threat type** and **fire the correct interceptor** (keys 1-4) or **hold fire** (key 5/Space) if the threat targets open ground
5. After clearing all threats, shows a **score breakdown** with achievement badges

The campaign progresses from a single threat type (rockets) and single defense system (Iron Dome) to all 5 threat types and all 4 defense systems simultaneously.

**Controls during gameplay:**
| Key | Action |
|---|---|
| Click/Tab | Select a threat on radar |
| 1 | Fire Iron Dome |
| 2 | Fire David's Sling |
| 3 | Fire Arrow 2 |
| 4 | Fire Arrow 3 |
| 5 or Space | Hold fire (let threat pass) |
| P | Pause |
| ESC | Open facilitator/settings panel |

---

## Game State Machine

```
PRE_GAME
  │
  └─▶ SCORING_INTRO  (one-time scoring explanation)
        │
        └─▶ BRIEFING   (Level 1 only — has educational content + quiz + field exercise)
        └─▶ LEVEL_INTRO (Levels 2-7 — shows new threats/systems, ammo, no quiz)
              │
              └─▶ ACTIVE  (live gameplay — threats spawn, player intercepts)
                    │
                    └─▶ LEVEL_COMPLETE  (score breakdown, badges, campaign total)
                          │
                          ├─▶ BRIEFING / LEVEL_INTRO  (next level)
                          └─▶ SUMMARY  (after Level 7 or escape room timeout)
```

**States** (defined in `useGameEngine.js` as `GAME_STATES`):
- `pre_game` — Title screen with START CAMPAIGN button
- `scoring_intro` — Explains scoring rules (shown once per campaign)
- `briefing` — Educational content with fact cards, defense animations, quiz, and optional field exercise (Level 1 only)
- `level_intro` — Compact intro showing new threats, new systems, ammo budget (Levels 2-7)
- `active` — Live gameplay with radar, threat panel, and control panel
- `level_complete` — Score breakdown with star rating and achievement badges
- `summary` — Final campaign results with leaderboard entry

---

## Level Progression

| Level | Region | New Threat | New System | Threats Array | Duration | Viewport |
|---|---|---|---|---|---|---|
| L1 | Otef Aza (south) | Rockets | Iron Dome (key 1) | `THREATS_L1` or `THREATS_L1_B` (random) | 80s | 2.5x zoom, southern Israel |
| L2 | Galil & Golan (north) | Drones | — | `THREATS_L2` | 120s | 1.8x zoom, northern Israel |
| L3 | Central Israel | Cruise missiles | David's Sling (key 2) | `THREATS_L3` | 120s | 2.0x zoom, central corridor |
| L4 | Strategic infrastructure | Ballistic missiles | Arrow 2 (key 3) | `THREATS_L4` | 120s | 1.2x zoom, infrastructure belt |
| L5 | Military bases | Hypersonic glide vehicles | Arrow 3 (key 4) | **`THREATS_L6`** | 150s | 1.0x zoom, bases |
| L6 | Full map, all fronts | — (wave assault) | — | **`THREATS_L5`** | 150s | 0.78x zoom, full country |
| L7 | Full map, multi-front salvos | — (final challenge) | — | `THREATS_L7` | 150s | 0.78x zoom, full country |

**CRITICAL: THREATS_L5 and THREATS_L6 arrays are SWAPPED.** Level 5 in-game uses `THREATS_L6`, Level 6 uses `THREATS_L5`. This is intentional — the arrays were restructured but keeping IDs stable was prioritized over renaming.

### L1 Variant System

Level 1 randomly selects between `THREATS_L1` and `THREATS_L1_B` via `pickThreatVariant()`. Both variants have the same timing, countdowns, and hold-fire rockets, but different city target assignments so repeat players cannot memorize the answers.

### LEVELS Configuration Array

Each entry in the `LEVELS` array (in `threats.js`) defines:

```js
{
  id: 1,                           // Level number
  threats: 'THREATS_L1',           // Which threat array to use
  hasVariant: true,                // Whether to randomly pick between variants
  duration: 80,                    // Level duration in seconds
  ammo: { iron_dome: 22 },        // Ammo budget per interceptor type
  available_systems: ['iron_dome'], // Which interceptors are available
  auto_end_delay: 3000,            // ms delay after last threat before auto-ending
  new_system: { ... },            // Info about newly introduced system (if any)
  new_threat: { ... },            // Info about newly introduced threat (if any)
}
```

### Ammo Budget Philosophy
- **Levels 1-2**: +4 surplus per interceptor type above live threat count (forgiving — blip overlap makes mis-clicks common)
- **Levels 3-6**: +2 surplus per interceptor type above live threat count
- **Level 7**: Zero margin — exactly enough ammo for every populated threat (no room for error)

---

## Threat System

### Threat Builder Function

All threats are created via a builder function in `threats.js`:

```js
threat(id, appear_time, type, impact_zone, is_populated, countdown, intel, reveal_pct, extra)
```

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Unique ID within the array (e.g., `'L1-01'`) |
| `appear_time` | number | Seconds after level start when threat spawns |
| `type` | string | `'rocket'`, `'drone'`, `'cruise'`, `'ballistic'`, `'hypersonic'` |
| `impact_zone` | string | Key into `IMPACT_POSITIONS` (e.g., `'Sderot'`, `'Open Ground South'`) |
| `is_populated` | boolean | `true` = city/base (must intercept), `false` = open ground (hold fire) |
| `countdown` | number | Seconds until threat reaches target |
| `intel` | string | Short intel text shown on threat card |
| `reveal_pct` | number | 0-1, fraction of countdown before impact zone name is revealed. `1.0` = shown immediately, `0.35-0.45` = delayed reveal for ballistic/hypersonic |
| `extra` | object | Optional: `{ origin, salvo, priority, badge }` |

### Extra Fields
- `origin`: `'gaza'`, `'north'`, `'northeast'`, `'east'`, `'southeast'` — determines spawn point on radar edge
- `salvo`: string label shown as badge (e.g., `'SALVO 1'`)
- `priority`: `'HIGH'` — shown as red priority badge
- `badge`: custom badge text

### Threat Types & Properties (`THREAT_DATA`)

| Type | Display Name | Speed | Altitude | Trajectory | Correct Action |
|---|---|---|---|---|---|
| `rocket` | ROCKET | ~1,500 mph | 6-30 mi | Ballistic arc | `iron_dome` |
| `drone` | DRONE | ~115 mph | 300-6,000 ft | Low terrain-following | `iron_dome` |
| `cruise` | CRUISE MISSILE | ~500 mph | 50-300 ft | Low terrain-hugging | `davids_sling` |
| `ballistic` | BALLISTIC MISSILE | ~4,500 mph | 100+ mi | High arc | `arrow_2` |
| `hypersonic` | HYPERSONIC GLIDE | Mach 5-10 | 25-60 mi | Boost-glide | `arrow_3` |

### Hold-Fire Ratios (mirrors real-world accuracy)
- Rockets: ~45-47% hold-fire (unguided Qassams, most miss)
- Drones: ~10-20% hold-fire (GPS-guided, more accurate)
- Cruise: ~6-15% hold-fire (precision guided)
- Ballistic: ~15-20% hold-fire (some miss)
- Hypersonic: 0-10% hold-fire (precision weapons)

### Impact Positions

`IMPACT_POSITIONS` is a lookup table mapping ~60 location names to `{x, y}` coordinates in the normalized 0-1 map coordinate system. Includes cities, infrastructure, military bases, and "open ground" zones for hold-fire threats.

### Threat Lifecycle

1. **Spawn**: When `sessionTime >= appear_time`, threat enters `activeThreats` array. Countdown timer starts ticking via a `setInterval(100ms)`.
2. **Active**: Threat blip moves across radar from spawn point to target. Player can select it and take action.
3. **Resolution**: One of:
   - **Correct intercept**: Player fires the matching system on a populated target → +100 points, streak++
   - **Correct hold**: Player holds fire on open ground target → streak++, no points
   - **Wrong interceptor**: Player fires wrong system → streak reset, ammo wasted
   - **Wasted intercept**: Player fires correct system but target is open ground → streak++, warning
   - **City hit**: Threat reaches a populated target without interception → siren, -100 points, streak reset
   - **Ground impact**: Threat reaches open ground without interception → ground impact effect

---

## Interceptor Systems

| System | Key | Color (hex) | Intercepts | Hebrew |
|---|---|---|---|---|
| Iron Dome | 1 | `#eab308` (yellow) | Rockets + Drones | כיפת ברזל |
| David's Sling | 2 | `#3b82f6` (blue) | Cruise missiles | קלע דוד |
| Arrow 2 | 3 | `#ef4444` (red) | Ballistic missiles | חץ 2 |
| Arrow 3 | 4 | `#a855f7` (purple) | Hypersonic glide vehicles | חץ 3 |

Each system is progressively unlocked as new threat types are introduced across levels.

---

## Coordinate System

### Map Coordinates (0-1 normalized)

All geographic positions use a normalized coordinate system:
- **x**: 0 (west) → 1 (east)
- **y**: 0 (north) → 1 (south)

**GPS to map coordinate formula:**
```
x = 0.28 + (longitude - 34.78) * 0.3636
y = 0.90 - (latitude - 29.56) * 0.22
```

Used by: `IMPACT_POSITIONS`, `CITIES`, `SPAWN_NEAR/FAR`, `REGIONS`, battery positions.

### SVG Coordinates (0-100 viewBox)

The radar display uses a 100x100 SVG viewBox. Map coordinates are transformed via:

```js
function mapToSVG(mapX, mapY, viewport) {
  const svgX = ((mapX - viewport.centerX) * viewport.scale + 0.5) * 100;
  const svgY = ((mapY - viewport.centerY) * viewport.scale + 0.5) * 100;
  return { x: svgX, y: svgY };
}
```

Each level has a viewport defined in `LEVEL_VIEWPORTS`:

| Level | centerX | centerY | scale | Description |
|---|---|---|---|---|
| L1 | 0.27 | 0.48 | 2.5 | Tight zoom on Otef Aza (south) |
| L2 | 0.48 | 0.15 | 1.8 | Northern Israel (Galil/Golan) |
| L3 | 0.34 | 0.38 | 2.0 | Central corridor |
| L4 | 0.32 | 0.40 | 1.2 | Infrastructure belt |
| L5 | 0.33 | 0.42 | 1.0 | Military bases |
| L6-7 | 0.43 | 0.46 | 0.78 | Full country |

### Spawn Origins

Threats spawn from the radar edge based on their `origin` field. Two sets of spawn points exist in `spawnOrigins.js`:

- **`SPAWN_NEAR`**: Border spawn points for short-range threats (rockets, nearby drones). Closer to map edge.
- **`SPAWN_FAR`**: Off-map spawn points for long-range threats (missiles, distant drones). Further from map.

**Spawn logic** (`getSpawnOrigin()`):
- Rockets → always NEAR
- Drones from nearby origins (gaza, north) → NEAR
- Everything else → FAR

Origins: `gaza`, `north`, `northeast`, `east`, `southeast`

---

## Radar Display

The radar is rendered as an SVG with a circular clip path (radius 49, centered at 50,50).

### Layers (bottom to top)

1. **Background**: Dark circular fill
2. **Range rings**: Concentric circles at 25% intervals
3. **Crosshairs**: Horizontal and vertical lines through center
4. **Region outlines**: Geographic region polygons (Otef Aza, Galil, etc.)
5. **City markers**: Three marker types:
   - `●` circle — regular city
   - `▲` triangle — infrastructure (`isInfra: true`)
   - `◆` diamond — military base (`isBase: true`)
6. **City labels**: Text labels with directional offsets
7. **Threat origin arcs**: Perimeter arcs showing attack source directions (Gaza, Lebanon, Syria, Iran, Yemen)
8. **Battery position**: Star marker showing interceptor battery location
9. **Threat blips**: Animated dots moving from spawn to target
10. **Interceptor trails**: Lines from battery to intercept point
11. **Impact effects**: Explosions, deflections, ground impacts
12. **Cheat characters**: Teddy bear, cat, turtle, portrait overlays
13. **CRT atmosphere**: Scan lines, vignette, phosphor noise

### Blip Animation

Blip position is calculated as:
```
position = spawn + (target - spawn) * progress
```

Where `progress = timeElapsed / countdown`, modified by easing:
- **Rockets/Drones/Cruise**: Linear (`progress`)
- **Ballistic**: Cubic easing (`progress^3`) — slow start, fast terminal phase
- **Hypersonic**: Quartic easing (`progress^4`) — very slow start, extremely fast terminal dive

**Blip radius by type:** drone 1.2, rocket 1.4, cruise 1.7, ballistic 2.0, hypersonic 2.2

### Label System

Cities have a `labelDir` field controlling label offset direction: `e`, `w`, `ne`, `nw`, `se`, `sw`, `n`, `s`. Labels use a `LABEL_OFFSETS` lookup for pixel displacement.

- **Tier 1**: Always labeled when in viewport
- **Tier 2**: Only labeled when zoomed in or actively targeted

**Per-level override**: Haifa uses `'se'` label direction at L4-5 but `'w'` at L6+ to avoid overlap with nearby military bases.

### City Visibility

`getVisibleCities()` in `mapLayers.js` determines which cities appear per level:
- **L1-3**: Region-specific (only cities in the level's geographic area)
- **L4**: Infrastructure sites + major landmarks
- **L5**: Military bases + major landmarks
- **L6+**: Cumulative — all cities revealed up to and including current level, plus all from previous levels

Military bases are hidden at L6+ unless actively targeted by a threat (to reduce visual clutter on the full map).

### Battery Positions

`LEVEL_BATTERIES` defines interceptor battery positions:
- **L1-4**: Single battery (one position)
- **L5-7**: Array of 3 batteries spread across the country

`getNearestBattery()` picks the closest battery for trail rendering in multi-battery levels.

---

## Scoring System

### Point Values

| Action | Points | Streak Effect |
|---|---|---|
| Correct intercept (populated target) | +100 | streak++ |
| Correct hold fire (open ground) | 0 | streak++ |
| Wrong interceptor used | 0 | streak reset |
| Wasted intercept (correct system on open ground) | 0 | streak++ (warning shown) |
| City hit (populated target not intercepted) | -100 | streak reset |
| Quiz correct answer | +250 (per question) | — |
| Surplus ammo bonus | +250 per unused interceptor | — |
| Streak bonus | bestStreak x 25 | — |
| Cheat-assisted intercept | +75 (instead of +100) | — |

### Surplus Ammo Calculation

Only interceptors above what was needed count as "surplus":
```
creditableAmmo = ammoRemaining - ammoSurplus
```
Where `ammoSurplus` is the designed +2 buffer per interceptor type (L1-6). At L7 the surplus is 0.

### Star Rating

Stars are calculated based on performance metrics (intercept rate, siren count, streak). A **Perfect Defense** (5 stars) triggers gold particle effects and a fanfare sound.

### Achievement Badges (LevelComplete screen)

| Badge | Condition |
|---|---|
| PERFECT DEFENSE | 5-star rating (no cities hit, all populated threats intercepted) |
| IRON WALL | 0 sirens (but not 5 stars — i.e., some holds missed or wrong systems) |
| 10x STREAK | Best streak >= 10 |
| INTEL MASTER | Quiz bonus >= 500 (both questions correct) |
| EFFICIENT | Ammo remaining >= 50% of starting ammo |

---

## Educational Briefing System

The `EducationalBriefing` component presents pre-level educational content in phases:

### Phases per Level

| Phase | Content | Present In |
|---|---|---|
| `threat` | Facts about the region/targets at risk (3 randomly selected from pool of 6) | All levels |
| `defense` | Facts about the threat type and defense system (3 randomly selected from pool of 6) | All levels |
| `quiz` | 2 quiz questions linked to the shown facts | All levels |
| `exercise` | Interactive "field exercise" — practice intercepting with the new system | Level 1 only |

### Briefing Content Structure (`BRIEFING_CONTENT`)

Each level has:
```js
{
  phases: ['threat', 'defense', 'quiz', 'exercise'], // L1 has exercise
  threat: {
    title: 'SOUTHERN ISRAEL',
    hebrewTitle: 'דְּרוֹם יִשְׂרָאֵל',
    subtitle: 'Communities in the Line of Fire',
    color: '#f97316',
    displayCount: 3,           // How many facts to show (randomly selected)
    factPool: [                // Pool of 6 facts (3 shown per playthrough)
      { id: 'l1t1', icon: '🏘️', text: '...' },
      // ...
    ],
    animation: 'rocket',       // Which SVG animation to show
  },
  defense: { /* same structure */ },
  exerciseConfig: {            // Only for levels with exercises
    threatType: 'rocket',
    systemKey: 'iron_dome',
    systemName: 'IRON DOME',
    shortcut: '1',
    // OR for multi-threat exercises:
    exerciseThreats: [
      { systemName: 'ARROW 3', shortcut: '4', threatLabel: 'HYPERSONIC', ... },
      { systemName: 'ARROW 2', shortcut: '3', threatLabel: 'BALLISTIC', ... },
    ],
  },
}
```

### Briefing Animations

Each briefing phase includes animated SVG illustrations:
- **Rocket**: Arc path from launch to impact with animated missile on offset-path
- **Drone**: Low-altitude terrain-following flight with rotor animation
- **Cruise Missile**: Low-altitude flight with exhaust trail over terrain
- **Ballistic Missile**: High arc trajectory with reentry glow
- **Hypersonic**: Boost-glide trajectory with plasma wake and bow shock

Defense animations show interceptor launches and interceptions.

### Level Intro (LevelIntro.jsx)

For Levels 2-7, a simpler intro screen replaces the full briefing. It shows:
- New threat card (if applicable) with animated SVG depiction
- New system card (if applicable) with shortcut key
- Ammunition breakdown for the level
- Challenge description for L6-7 (no new threats/systems)
- "BEGIN LEVEL" button

### Auto-advance

Each briefing phase has a `CountdownBar` that auto-advances after a set duration. Users can also click "NEXT" to skip ahead.

---

## Quiz System

### Structure (`quizData.js`)

Each level has ~12 questions, but only 2 are shown per playthrough. Questions are filtered to match the randomly-selected briefing facts via `linkedFacts` arrays.

```js
{
  questionsPerQuiz: 2,
  timePerQuestion: 15,           // seconds to answer
  pointsPerCorrect: 250,
  questions: [
    {
      id: 'l1q1',
      question: 'How far is Sderot from the Gaza border?',
      options: ['Less than a mile (1 km)', 'About 5 miles', ...],
      correctIndex: 0,
      explanation: 'Sderot sits less than a mile from...',
      linkedFacts: ['l1t1'],     // Links to fact IDs shown in briefing
    },
    // ...
  ],
}
```

### Question Selection (`getRandomQuestions()`)

1. Collects all fact IDs shown in the current briefing playthrough
2. Filters questions to those whose `linkedFacts` overlap with shown facts
3. Randomly selects `questionsPerQuiz` questions from the filtered pool
4. Falls back to random selection from all questions if not enough linked ones

### Quiz Flow

1. Question displayed with 4 options and a 15-second countdown timer
2. Player clicks an option
3. Immediate feedback: correct (green flash) or wrong (red shake)
4. Explanation shown for 3 seconds
5. Next question or proceed to level

---

## Sound System

### Synthesized Sound Effects (`soundEffects.js`)

All gameplay sounds are synthesized via the **Web Audio API** — no external audio files needed for SFX. Uses `AudioContext` with oscillators, noise buffers, and gain envelopes.

#### Launch Sounds (per interceptor system)

| System | Sound Character |
|---|---|
| Iron Dome | Sharp POP + ascending zip |
| David's Sling | Mechanical CLUNK + pressurized hiss |
| Arrow 2 | Deep THOOM + rolling rumble |
| Arrow 3 | Electric ZAP + ascending whistle |

#### Intercept Sounds (per threat type)

| Threat | Sound Character |
|---|---|
| Rocket (Iron Dome) | Sharp crack + metallic pop + debris zing |
| Cruise (David's Sling) | Heavy boom + resonant ring |
| Ballistic (Arrow 2) | Deep boom + atmospheric shockwave + debris rain |
| Hypersonic (Arrow 3) | Electric crack + harmonic resonance + plasma dissipation |

#### Other Sounds
- **City hit**: Heavy explosion with low rumble
- **Ground impact**: Muffled thud + crumbling debris
- **Shield bounce** (DVIR cheat): Hollow bonk + metallic ring
- **Beard zap** (SUFRIN cheat): Twangy hair-pluck snap + fuzzy buzz
- **Perfect fanfare**: Triumphant ascending brass chord + shimmer cascade

### Background Music (`musicPlayer.js`)

- Per-level MP3 tracks: `music-level-1.mp3` through `music-level-7.mp3`
- Fallback to `music-default.mp3` if level track missing
- Fade in/out with configurable duration (1.5s default)
- Crossfade between levels (0.8s fade out before switching)
- Loading lock prevents concurrent race conditions from React re-renders
- Separate briefing music track: `briefing-music.mp3`
- Siren sound: `siren.mp3` (played on city hit)

### Volume Control

Global volume slider in facilitator controls (0-100%). Affects both music and sound effects.

---

## Visual Effects & Animations

All CSS animations are defined in `src/index.css`. SVG effects are rendered in `RadarDisplay.jsx`.

### Radar Atmosphere (CRT Effect)
- **Sweep**: Rotating conic gradient (4s period)
- **Scan lines**: Repeating horizontal lines via `#root::after`
- **Vignette**: Radial gradient on radar circle (inner glow + edge shadow)
- **Phosphor noise**: SVG `feTurbulence` filter for static texture
- **CRT flicker**: Subtle opacity animation on glow overlay

### Impact Effects (SVG + CSS)

| Effect | Trigger | Visual |
|---|---|---|
| `InterceptEffect` | Correct intercept | Green flash + expanding shockwave rings + scattered particles |
| `HypersonicInterceptEffect` | Arrow 3 intercept | Cyan/purple plasma flash + triple shockwave + electric arcs + energy dissipation |
| `CityHitEffect` | City hit | Red/orange flash + double shockwave + damage pulse + crater mark + debris |
| `GroundImpactEffect` | Hold-fire completes on open ground | Amber dust puff + ring + small particles |
| `ShieldDeflectEffect` | DVIR shield bounce | Green flash + crack ring + ripple + bounce particles + sparks |
| `HoldClearEffect` | Correct hold fire | Blue flash + ring + checkmark + "CLEAR" label |

### Interceptor Trails (`TrailEffect`)
- Line from battery position to intercept point
- Animated warhead dot moving along the trail
- CSS `stroke-dasharray` animation for trail draw
- Flash at launch point
- Duration: 600ms default, varies by distance

### Screen Shake
- Triggered on city hit
- CSS `screenShake` animation (0.5s, translates the game container)
- Accompanied by red border flash (`borderFlashRed`)

### Threat Blip States
- **Active**: Full opacity, pulse animation
- **Urgent** (< 3s remaining): Fast pulse, danger ring
- **Selected**: Spinning selection ring (dashed circle)
- **Intercepted**: `intercepted-blip-fade` (600ms fade to 0)
- **Held**: `held-blip-fade` (dimmed to 0.35 opacity, still moving)

### Cheat Character Animations
- **Teddy Bear** (TZUR): Drop-in bounce → hold → spin+fire → fade out
- **Siamese Cat** (SASHA): Slinky landing → eye glow pulse → laser beams → fade out
- **Turtle** (DVIR): Shell emerge → wobble → gentle bob → retreat
- **Shield Dome** (DVIR): Pop-in scale → pulse glow
- **Sufrin Portrait**: Drop-in bounce → beard strand flicker → fade out

---

## Cheat Code System

Cheat codes are typed during active gameplay. The game buffers keystrokes and checks against known codes via prefix matching.

### Available Cheats

| Code | Name | Effect | Uses | Duration |
|---|---|---|---|---|
| `TZUR` | Teddy Bear | Auto-zaps threats every 300ms | 3/campaign | 12s |
| `SASHA` | Laser Cat | Same as TZUR + briefing music plays | 3/campaign | 12s |
| `DVIR` | Turtle Shield | Passive dome auto-deflects threats at boundary | 3/campaign | 12s |
| `SUFRIN` | Beard Defense | Auto-zaps threats with portrait overlay | 3/campaign | 15s |
| `BH` | Clear All | Instantly clears all active threats | 1/level | instant |
| `BSD` | Resupply | Adds +1 of each available interceptor | 1/level | instant |
| `HACK` | Hack HUD | Shows overlay of available cheat codes | unlimited | 5s display |
| `PP` | Pause Toggle | Toggles pause state | unlimited | — |

### Cheat Implementation

**Auto-zap cheats** (TZUR, SASHA, SUFRIN): Set up a 300ms interval that selects the oldest active threat and fires the correct interceptor automatically. Cheat-assisted intercepts earn +75 instead of +100.

**DVIR shield**: Creates a visual dome on the radar. When a threat reaches the dome boundary (progress >= certain threshold), it's auto-deflected with a bounce animation and shield sound effect.

**Cheat tracking**: `cheatUsage` object tracks remaining uses per cheat code across the campaign. `cheatLevelUsage` tracks per-level uses for BH/BSD.

### Visual Feedback

Each cheat has:
- An animated SVG character overlay on the radar
- A banner showing the cheat name
- A circular countdown timer (`CheatCountdown` component)
- Paw print hints (🐾) in the control panel showing cheat availability

---

## Facilitator Controls

Opened via **ESC key**. Two-tiered access:

### Always Visible (unlocked)
- **Volume slider**: 0-100% global volume

### Behind Facilitator Code (locked, code: `1948`)
- **Escape Room Mode toggle**: Enable/disable campaign-wide timer
- **Timer Duration slider**: 5-45 minutes (visible when escape room mode on)
- **+1 MIN button**: Add time during active campaign
- **Skip Briefings toggle**: Skip all educational content (go straight to gameplay)
- **Pause/Resume**: Pause or resume the current game
- **Jump to Level**: Buttons 1-7 to jump to any level's briefing/intro
- **Reset to Main Menu**: Return to pre-game state

---

## Escape Room Mode

When enabled via facilitator controls:

- **25-minute** campaign-wide countdown (configurable 5-45 minutes)
- Timer does **NOT** reset between levels — it's continuous across the entire campaign
- Timer **ticks** during: `scoring_intro`, `briefing`, `level_intro`, `active`, `level_complete`
- Timer **paused** during: `pre_game`, `summary`, and when game is paused
- When timer reaches 0: campaign auto-ends, jumps to `summary` screen with `endedEarly: true`
- Facilitator can add time via the +1 MIN button

### Timer Display (`EscapeRoomTimer.jsx`)
- Pill-shaped badge showing lock icon + "ESCAPE ROOM" label + remaining time
- Color coding: purple (normal) → amber (< 3 min) → red pulsing (< 1 min)
- Positioned at top of screen during all game states

---

## Leaderboard

### Storage (`leaderboard.js`)
- Persisted in `localStorage` under key `missile-defense-leaderboard`
- Stored as JSON object keyed by game mode (`CAMPAIGN`, legacy `SHORT`/`FULL`)
- Maximum 10 entries per mode, sorted by score descending

### Entry Fields
```js
{
  name: 'CALLSIGN',           // 1-10 uppercase alphanumeric chars
  score: 5200,
  stars: 4,
  rating: 'EXCELLENT',
  gameMode: 'CAMPAIGN',
  levelsCompleted: 7,
  correctIntercepts: 45,
  sirenCount: 2,
  bestStreak: 15,
  timestamp: 1710000000000,    // Date.now()
}
```

### Save Flow
1. Campaign ends → Summary screen shows
2. Player enters callsign (uppercase, alphanumeric, max 10 chars)
3. Click "SAVE SCORE" → entry added to localStorage
4. Leaderboard table updates with highlighted new entry

### Leaderboard Display
- Shows rank, callsign, score, levels completed, rating, stars
- #1 gets crown emoji (👑), top 3 get colored ranks
- Highlighted entry for just-saved score (green background)
- "CLEAR ALL" button at bottom (clears all entries)

---

## Deployment

### Build Process
```bash
npm run build    # Outputs to dist/
```

### GitHub Pages Deployment

**gh-pages branch structure is FLAT** — `index.html` + `assets/` at repo root, NOT inside `dist/`:

```bash
# 1. Build
npx vite build

# 2. Commit source + dist to main, push
git add -A && git commit -m "Build" && git push

# 3. Deploy to gh-pages
git stash && git checkout gh-pages

# 4. Copy built files (flat structure)
cp dist/index.html index.html
rm -rf assets/
cp -r dist/assets/ assets/

# 5. Commit and push
git add -A && git commit -m "Deploy" && git push

# 6. Switch back
git checkout main && git stash pop
```

### Important: Base Path
The Vite config sets `base: '/missile-defense/'` for GitHub Pages subpath. All asset URLs are relative to this base.

---

## Debug & Testing

### Debug Hook
`App.jsx` exposes `window.__game = game` — the full game engine state. Use in browser console:

```js
// Jump to a specific level
window.__game.startLevel(3)

// Check current state
window.__game.gameState
window.__game.activeThreats
window.__game.ammo

// Trigger cheat
window.__game.triggerTzurMode()
```

### Key Patterns

- **Threat timing**: All `appear_time` values are in seconds from level start. Threats appear over the full level duration to maintain pressure.
- **Race condition guard**: `interceptedIdsRef` (a React ref) prevents double-processing of the same threat during rapid clicks.
- **Loading lock**: `musicPlayer.js` uses `loadingLevel` to prevent concurrent `startMusic()` calls from React re-renders.
- **Auto-end level**: When all threats are resolved (intercepted, held, or timed out), the level auto-ends after `auto_end_delay` ms. A guard prevents premature ending when threats are still spawning.
- **Session time**: `sessionTimeRef` tracks time since level start, used for threat spawn timing. Only advances while game is unpaused and in ACTIVE state.

### Common Development Tasks

- **Add a new city**: Add entry to `CITIES` in `mapLayers.js` with x, y, region, tier, revealLevel, labelDir, Hebrew name
- **Add a new threat**: Add entry to the appropriate `THREATS_LX` array in `threats.js` using the `threat()` builder
- **Adjust ammo budget**: Modify the `ammo` object in the corresponding `LEVELS` entry in `threats.js`
- **Change viewport zoom**: Modify `LEVEL_VIEWPORTS` in `mapLayers.js`
- **Add a new quiz question**: Add entry to the corresponding level in `quizData.js`, link to briefing fact IDs via `linkedFacts`
- **Add a sound effect**: Add a new function in `soundEffects.js` using Web Audio API oscillators and noise buffers
