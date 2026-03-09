# Missile Defense — Game Architecture & Conventions

Educational missile defense game simulating Israel's multi-layered air defense system.
7-level campaign teaching Iron Dome through Arrow 3 via progressive geography reveal.
Built for classroom/escape-room use with facilitator controls and escape room timer.

## Tech Stack
- React 19 + Vite 7 + Tailwind CSS 4 (no component library)
- Single-page app, no router, no backend
- GitHub Pages deployment at `https://mmh-cyber.github.io/missile-defense/`
- Base path: `/missile-defense/` (set in vite.config.js)

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component, game flow orchestration, music, facilitator controls |
| `src/hooks/useGameEngine.js` | All game state, scoring, threat lifecycle, interception logic, cheats |
| `src/components/RadarDisplay.jsx` | SVG radar, blip animation, viewport/zoom, map labels, trails |
| `src/components/ThreatPanel.jsx` | Right-side threat cards with countdown timers |
| `src/components/ControlPanel.jsx` | Bottom interceptor buttons (1-4 keys + hold fire) |
| `src/config/threats.js` | All threat arrays, LEVELS config, ammo budgets, impact positions |
| `src/config/mapLayers.js` | Cities, regions, viewports, label positions, military bases |
| `src/config/spawnOrigins.js` | Where threats appear on radar (near/far by origin direction) |
| `src/config/quizData.js` | Per-level quiz question banks |
| `src/components/EducationalBriefing.jsx` | Pre-level educational content + quiz |
| `src/components/LevelIntro.jsx` | Level intro screen (L2+ — no quiz, just context) |
| `src/components/TzevaAdom.jsx` | Red alert siren overlay when city is hit |
| `src/components/FacilitatorControls.jsx` | Teacher/facilitator panel (ESC to toggle) |

## Level Progression

| Level | Region | New Threat | New System | Threats Array |
|-------|--------|-----------|------------|---------------|
| L1 | Otef Aza (south) | Rockets | Iron Dome (key 1) | `THREATS_L1` or `THREATS_L1_B` (random) |
| L2 | Galil & Golan (north) | Drones | — (still Iron Dome only) | `THREATS_L2` |
| L3 | Central Israel | Cruise missiles | David's Sling (key 2) | `THREATS_L3` |
| L4 | Strategic infrastructure | Ballistic missiles | Arrow 2 (key 3) | `THREATS_L4` |
| L5 | Military bases | Hypersonic glide vehicles | Arrow 3 (key 4) | **`THREATS_L6`** (swapped!) |
| L6 | Full map, all fronts | — | — | **`THREATS_L5`** (swapped!) |
| L7 | Full map, multi-front salvos | — | — | `THREATS_L7` |

**CRITICAL: THREATS_L5 and THREATS_L6 arrays are SWAPPED.** Level 5 in-game uses `THREATS_L6`, Level 6 uses `THREATS_L5`. This is intentional — the arrays were restructured but keeping IDs stable was prioritized over renaming.

## Interceptor-to-Threat Mapping

| System | Key | Intercepts | Color |
|--------|-----|-----------|-------|
| Iron Dome | 1 | Rockets + Drones | `#eab308` (yellow) |
| David's Sling | 2 | Cruise missiles | `#3b82f6` (blue) |
| Arrow 2 | 3 | Ballistic missiles | `#ef4444` (red) |
| Arrow 3 | 4 | Hypersonic glide vehicles | `#a855f7` (purple) |

## Threat System

### Builder Function
```
threat(id, appear_time, type, impact_zone, is_populated, countdown, intel, reveal_pct, extra)
```
- `is_populated: true` = target is a city/base (player MUST intercept)
- `is_populated: false` = open ground (player should HOLD FIRE — it's a dud/miss)
- `reveal_pct: 1.0` = impact zone shown immediately; `0.35-0.45` = delayed reveal (ballistic/hypersonic)
- `origin` in extra: `'gaza'`, `'north'`, `'northeast'`, `'east'`, `'southeast'`

### Hold-Fire Ratios (mirrors real-world accuracy)
- Rockets: ~45-47% hold-fire (unguided Qassams, most miss)
- Drones: ~10-20% hold-fire (GPS-guided, more accurate)
- Cruise: ~6-15% hold-fire (precision guided)
- Ballistic: ~15-20% hold-fire (some miss)
- Hypersonic: 0-10% hold-fire (precision weapons)

### Ammo Budget Philosophy
- **L1**: +4 surplus per interceptor type (beginner level, blip overlap makes mis-clicks common)
- **L2**: +3 surplus per interceptor type (still learning, new threat type)
- **L3-L6**: +2 surplus per interceptor type above live threat count
- **L7**: Zero margin — exactly enough ammo (no room for error)

### L1 Variant System
Level 1 has two threat arrays: `THREATS_L1` and `THREATS_L1_B`. One is randomly selected each playthrough via `pickThreatVariant()`. Same timing/countdowns/HF rockets, different city target assignments so repeat players can't memorize.

## Coordinate System

### Map Coordinates (0-1 normalized)
- x: west (0) → east (1)
- y: north (0) → south (1)
- Formula from GPS: `x = 0.28 + (lon - 34.78) * 0.3636`, `y = 0.90 - (lat - 29.56) * 0.22`
- Used by: `IMPACT_POSITIONS`, `CITIES`, `SPAWN_NEAR/FAR`, `REGIONS`, battery positions

### SVG Coordinates (0-100 viewBox)
- Transformed via `mapToSVG(x, y, viewport)`:
  ```
  svgX = ((mapX - viewport.centerX) * viewport.scale + 0.5) * 100
  svgY = ((mapY - viewport.centerY) * viewport.scale + 0.5) * 100
  ```
- Blips clipped by circular radar mask (radius 49, centered at 50,50)

### Viewport Per Level
| Level | centerX | centerY | scale | Zoom |
|-------|---------|---------|-------|------|
| L1 | 0.27 | 0.48 | 2.5 | Tight on Otef Aza |
| L2 | 0.48 | 0.15 | 1.8 | Northern Israel |
| L3 | 0.34 | 0.38 | 2.0 | Central corridor |
| L4 | 0.32 | 0.40 | 1.2 | Infrastructure belt |
| L5 | 0.33 | 0.42 | 1.0 | Military bases |
| L6-7 | 0.43 | 0.46 | 0.78 | Full country |

## Game State Machine
```
PRE_GAME → SCORING_INTRO → BRIEFING (L1 only, has quiz)
                          → LEVEL_INTRO (L2+, no quiz)
→ ACTIVE (gameplay) → LEVEL_COMPLETE → next level's BRIEFING/INTRO
                                      → SUMMARY (after L7 or escape room timeout)
```

## Scoring
- Correct intercept (populated target): +100 points, streak++
- Correct hold (open ground): streak++, no points
- Wrong interceptor: streak reset, ammo wasted
- Wasted intercept (correct system on open ground): streak++, warning
- City hit (hold-fire on populated): siren, -100, streak reset
- Quiz bonus: +250 per correct answer (2 questions per level)
- Surplus ammo bonus: +250 per unused interceptor (only surplus beyond what was needed)
- Streak bonus: bestStreak x 25

## Blip Animation
- Position: `spawn + (target - spawn) * progress` where progress = timeElapsed / countdown
- Easing by type: ballistic `progress^3`, hypersonic `progress^4`, others linear
- Blip radius: drone 1.2, rocket 1.4, cruise 1.7, ballistic 2.0, hypersonic 2.2

## Label System
- Cities have `labelDir` (e, w, ne, nw, se, sw, n, s) controlling label offset
- `tier: 1` = always labeled when visible; `tier: 2` = labeled only when zoomed in or targeted
- **Per-level override in RadarDisplay.jsx**: Haifa uses `'se'` at L4-5 but `'w'` at L6+ to avoid overlap with nearby bases
- Infrastructure (`isInfra: true`) rendered with triangle markers
- Military bases (`isBase: true`) rendered with diamond markers, hidden at L6+ unless actively targeted
- Multi-line labels: use `\n` in `shortLabel` field

## Cheat Codes (typed during gameplay)
- **TZUR**: Auto-zap threats for 12s (3 uses/campaign, +75/intercept)
- **SASHA**: Same as TZUR with briefing music (3 uses/campaign)
- **DVIR**: Passive shield dome for 12s, auto-deflects at boundary (3 uses/campaign)
- **SUFRIN**: Auto-zap for 15s with portrait (3 uses/campaign)
- **BH**: Clear all active threats (1 use/level)
- **BSD**: Resupply +1 of each interceptor (1 use/level)

## Escape Room Mode
- 25-minute campaign-wide countdown (does not reset between levels)
- Ticks during all states except PRE_GAME and SUMMARY
- Auto-ends campaign when timer hits 0
- Facilitator can add/remove time via controls panel

## Deployment Workflow
1. Edit source files in `/Users/mhecht/Desktop/missile-defense/`
2. If using a worktree, copy changed files to worktree for dev server preview
3. Build: `npx vite build` (outputs to `dist/`)
4. Commit source + dist to `main`, push
5. Deploy to gh-pages:
   - `git stash && git checkout gh-pages`
   - Copy `dist/assets/*` → `assets/` and `dist/index.html` → `index.html` (flat structure, no dist/ prefix)
   - Remove old asset files, add new ones
   - Commit, push, switch back: `git checkout main && git stash pop`

**gh-pages structure is FLAT**: `index.html` + `assets/` at repo root, NOT inside `dist/`.

## Difficulty Rating System (1.0-10.0 scale)

Shared language for tuning level difficulty. Five weighted dimensions:

| Category | Weight | What It Measures |
|----------|--------|-----------------|
| **A. Tempo & Volume** | 20% | Threats/min, countdown length, simultaneous spawns, peak active threats |
| **B. Decision Complexity** | 30% | # interceptor systems, # threat types, HF ratio, delayed reveal % |
| **C. Ammo Pressure** | 20% | Per-system surplus ratio (0% = zero margin) |
| **D. Sustained Intensity** | 15% | Breathing gaps (>5s pauses), relentlessness, duration |
| **E. Learning Curve** | 15% | New systems/types/mechanics introduced this level |

### Current Scores

| Level | A. Tempo | B. Decisions | C. Ammo | D. Intensity | E. Learning | **TOTAL** |
|-------|---------|-------------|---------|-------------|-------------|-----------|
| L1 | 5.5 | 3.5 | 1.0 | 7.0 | 4.0 | **4.0** |
| L2 | 7.0 | 3.5 | 3.0 | 7.5 | 4.5 | **4.9** |
| L3 | 4.5 | 5.5 | 4.0 | 7.0 | 7.0 | **5.5** |
| L4 | 2.0 | 7.0 | 3.0 | 5.0 | 8.0 | **5.1** |
| L5 | 2.5 | 9.0 | 6.0 | 2.0 | 8.5 | **6.0** |
| L6 | 2.0 | 7.5 | 6.5 | 5.5 | 2.0 | **5.1** |
| L7 | 6.0 | 7.0 | 10.0 | 5.0 | 1.5 | **6.3** |

### Scoring Criteria Reference

**A. Tempo & Volume (20%)** — How fast must you click?
- Threats/min: L1=28.5, L2=30.5, L3=25.5, L4=19.0, L5=18.8, L6=19.2, L7=23.6
- Avg countdown: L1=6.1s, L2=6.9s, L3=7.7s, L4=10.2s, L5=8.5s, L6=8.6s, L7=8.5s
- Simultaneous 3+ waves: L1=2, L2=7, L3-L7=0
- Peak active threats: L1=6, L2=7, L3=6, L4=6, L5=6, L6=5, L7=7

**B. Decision Complexity (30%)** — How hard is each decision? (heaviest weight — wrong key press is #1 failure cause)
- Systems: L1-2=1, L3=2, L4=3, L5-7=4
- Threat types: L1=1, L2=2, L3=3, L4=3, L5-7=5
- HF ratio (hold-fire decisions): L1=47%, L2=34%, L3=28%, L4=13%, L5=26%, L6=19%, L7=24%
- Delayed reveal (% with reveal_pct < 1.0): L1-3=0%, L4=42%, L5=38%, L6=25%, L7=34%

**C. Ammo Pressure (20%)** — How much room for error?
- Surplus ratio: L1=20%, L2=7.5%, L3=10.8%, L4=18.2%, L5=11.4%, L6=10.3%, L7=0%
- Zero margin (L7) = automatic 10.0 score — one wasted shot means guaranteed failure

**D. Sustained Intensity (15%)** — How relentless is the pace?
- Breathing gaps (>5s): L1=0, L2=1, L3=0, L4=0, L5=7, L6=2, L7=5
- Zero gaps = relentless; many gaps = time to recover

**E. Learning Curve (15%)** — How much is new?
- L1: First level (intercept + hold fire concept)
- L2: New type (drones), new origins (north, northeast)
- L3: New system (David's Sling), new type (cruise), new origin (east)
- L4: New system (Arrow 2), new type (ballistic), new mechanic (delayed reveal)
- L5: New system (Arrow 3), new type (hypersonic), new origins (southeast)
- L6-7: No new mechanics (practice/mastery)

### How to Adjust Difficulty

To make a level **easier** (lower score):
- Remove live threats from simultaneous waves → lowers A (tempo)
- Increase countdowns by 1-2s → lowers A (more reaction time)
- Add +1-2 ammo surplus → lowers C (more room for error)
- Add breathing gaps between dense waves → lowers D (recovery time)
- Convert live threats to HF → lowers A but raises B slightly

To make a level **harder** (higher score):
- Add simultaneous threat waves → raises A
- Shorten countdowns → raises A
- Reduce ammo surplus → raises C (biggest impact at low surplus levels)
- Remove breathing gaps → raises D
- Add more delayed-reveal threats → raises B

### Target Progression (ideal difficulty curve)
- L1: 3.0-3.5 (gentle tutorial)
- L2: 4.0-4.5 (comfortable)
- L3: 5.0-5.5 (challenging)
- L4: 5.5-6.0 (hard, despite slow tempo)
- L5: 6.5-7.0 (very hard)
- L6: 7.0-7.5 (intense)
- L7: 8.5-9.5 (brutal finale)

## Important Conventions
- **MUTE GAME IN PREVIEW**: Always mute audio before playtesting: `document.querySelectorAll('audio,video').forEach(a=>{a.muted=true;a.pause()})`
- `window.__game = game` debug hook exists in App.jsx — useful for testing (`window.__game.startLevel(3)`)
- Sound files in `public/sounds/` (music-level-1.mp3 through music-level-7.mp3, briefing-music.mp3, siren.mp3, etc.)
- Images in `public/images/` (sufrin.png for cheat portrait)
- Facilitator panel: ESC key toggles, auto-pauses gameplay
- Pause: P key during ACTIVE state
- Hebrew translations (`he` field) on cities for display
- All threat IDs must be unique within their array but can reuse across arrays
- Threat `origin` determines spawn point on radar edge (see spawnOrigins.js)
