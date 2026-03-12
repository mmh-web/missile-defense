# Missile Defense — Game Architecture & Conventions

Educational missile defense game simulating Israel's multi-layered air defense system.
7-level campaign teaching Iron Dome through Arrow 3 via progressive geography reveal.
Built for classroom/escape-room use with facilitator controls and escape room timer.

## Tech Stack
- React 19 + Vite 7 + Tailwind CSS 4 (no component library)
- Single-page app, no router, no backend
- GitHub Pages deployment at `https://mmh-web.github.io/missile-defense/`
- Firebase Firestore for shared cloud leaderboard (project: `missile-defense-41ed4`)
- Base path: `/missile-defense/` (set in vite.config.js)

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component, game flow orchestration, music, facilitator controls |
| `src/hooks/useGameEngine.js` | All game state, scoring, threat lifecycle, interception logic, cheats |
| `src/components/RadarDisplay.jsx` | SVG radar, blip animation, viewport/zoom, map labels, trails |
| `src/components/ThreatPanel.jsx` | Compact threat rows with type-color coding |
| `src/components/ControlPanel.jsx` | Bottom interceptor buttons (1-4 keys + hold fire) |
| `src/config/threats.js` | All threat arrays, LEVELS config, ammo budgets, impact positions |
| `src/config/mapLayers.js` | Cities, regions, viewports, label positions, military bases |
| `src/config/spawnOrigins.js` | Where threats appear on radar (near/far by origin direction) |
| `src/config/quizData.js` | Per-level quiz question banks |
| `src/components/EducationalBriefing.jsx` | Pre-level educational content + quiz |
| `src/components/LevelIntro.jsx` | Level intro screen (L2+ — no quiz, just context) |
| `src/components/TzevaAdom.jsx` | Red alert siren overlay when city is hit |
| `src/components/FacilitatorControls.jsx` | Teacher/facilitator panel (ESC to toggle) |
| `src/components/AmmoStack.jsx` | Vertical ammo display for desktop right-side overlay |
| `src/components/VictoryAnimation.jsx` | Zero-siren level celebration (3 SVG animation variants) |
| `src/utils/firebase.js` | Firebase config + Firestore init |
| `src/utils/leaderboard.js` | Shared leaderboard (Firestore + localStorage fallback) |

## Level Progression

| Level | Region | New Threat | New System | Threats Array |
|-------|--------|-----------|------------|---------------|
| L1 | Otef Aza (south) | Rockets | Iron Dome (key 1) | `THREATS_L1` or `THREATS_L1_B` (random) |
| L2 | Galil & Golan (north) | Drones | — (still Iron Dome only) | `THREATS_L2` |
| L3 | Central Israel | Cruise missiles | David's Sling (key 2) | `THREATS_L3` |
| L4 | Strategic infrastructure | Ballistic missiles | Arrow 2 (key 3) | `THREATS_L4` |
| L5 | Military bases | Hypersonic glide vehicles | Arrow 3 (key 4) | **`THREATS_L6`** (swapped!) |
| L6 | Full map, all fronts | — | — | **`THREATS_L5`** (swapped!) |
| L7 ★ | Full map, multi-front salvos | — | — | `THREATS_L7` |

**★ L7 is a BONUS LEVEL** — disabled by default, toggled on via facilitator panel. Campaign ends after L6 unless bonus is enabled.

**CRITICAL: THREATS_L5 and THREATS_L6 arrays are SWAPPED.** Level 5 in-game uses `THREATS_L6`, Level 6 uses `THREATS_L5`. This is intentional — the arrays were restructured but keeping IDs stable was prioritized over renaming.

## Interceptor-to-Threat Mapping

| System | Key | Primary Targets | Cross-Compatible | Color |
|--------|-----|----------------|-----------------|-------|
| Iron Dome | 1 | Rockets + Drones | — | `#eab308` (yellow) |
| David's Sling | 2 | Cruise missiles | Also intercepts rockets & drones (wasteful) | `#3b82f6` (blue) |
| Arrow 2 | 3 | Ballistic missiles | — (can't engage low-altitude threats) | `#ef4444` (red) |
| Arrow 3 | 4 | Hypersonic glide vehicles | Also intercepts ballistic missiles (both high-altitude) | `#a855f7` (purple) |

### Cross-Compatibility Rules (realistic physics)
- **David's Sling → rockets/drones**: Works but wastes $1M interceptor on a $50K target. Shows warning.
- **Arrow 3 → ballistic missiles**: Works — both operate at high altitude/exoatmospheric.
- **Arrow 2 → low-altitude**: FAILS — operates at 15-80km, can't engage rockets/drones below 10km.
- **Arrow 3 → low-altitude**: FAILS — operates in space (100km+), can't engage atmospheric threats.
- The natural ammo cost IS the penalty — no artificial point deduction for cross-compatible intercepts.

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
- **L2**: +2 surplus per interceptor type (still learning, new threat type)
- **L3-L5**: +2 surplus per interceptor type above live threat count
- **L4**: +1 surplus per system (tighter pressure)
- **L6-L7**: Zero margin — exactly enough ammo (no room for error)

### Respite Design
Each level has designed breathing gaps (5-11s with no threats on screen) between dense phases:
- **L1**: 11s respite between pair phase and final surge (t≈47-58)
- **L2**: Multiple gaps in first 2/3 of level (HF rockets removed from gap periods)
- **L3**: Gaps between 3 phases (HF removed from inter-phase periods)
- **L4**: 4 clear phases with 3 respites (8s, 7s, 6s between phases)
- **L5**: Inter-wave gaps preserved (HF + some live threats removed)
- **CRITICAL**: Never place HF rockets in designed respite gaps — they fill the screen and defeat the purpose. HF should only appear DURING active phases.

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
| L3 | 0.34 | 0.38 | 2.4 | Central corridor (zoomed for readability) |
| L4 | 0.32 | 0.40 | 1.2 | Infrastructure belt |
| L5 | 0.33 | 0.42 | 1.0 | Military bases |
| L6-7 | 0.43 | 0.46 | 0.78 | Full country |

## Game State Machine
```
PRE_GAME → SCORING_INTRO → BRIEFING (L1 only, has quiz)
                          → LEVEL_INTRO (L2+, no quiz)
→ ACTIVE (gameplay) → LEVEL_COMPLETE → next level's BRIEFING/INTRO
                                      → SUMMARY (after L6, or L7 if bonus enabled, or escape room timeout)
```

## Scoring
- Correct intercept (populated target): +100 points, streak++
- Cross-compatible intercept: +100 points, streak++ (but ammo wasted from wrong tier)
- Combo bonus: +50 when 2 intercepts within 2 seconds ("DOUBLE INTERCEPT")
- Correct hold (open ground): streak++, no points
- Wrong interceptor: streak reset, ammo wasted
- Wasted intercept (correct system on open ground): streak reset, warning
- City hit (hold-fire on populated): siren, -100, streak reset
- Quiz bonus: +250 per correct answer (2 questions per level)
- Surplus ammo bonus: +250 per unused interceptor (only surplus beyond what was needed)
- Streak bonus: bestStreak x 25

## Gameplay Feedback Features
- **Near-miss callout**: "CLOSE CALL!" when intercepting with <2s remaining on countdown
- **Combo system**: 2 intercepts within 2 seconds → "DOUBLE INTERCEPT!" cyan flash overlay, +50 bonus points
- **Tzeva Adom city name**: Red alert overlay now shows which city was hit (e.g., "Sderot HIT")
- **Tactical debrief**: LevelComplete screen shows real-world cost connections (e.g., "3 correct holds saved ~$150K")
- **Cheat code hints**: L2/L3 complete screens show subtle classified intel teasing keyboard sequences
- **Shareable results card**: Campaign summary has screenshot-friendly score box for classroom sharing
- **Threat selection toggle**: Click a selected threat to deselect; click a different threat to switch selection
- **Team name persistence**: `campaignTeamName` state lifted to App.jsx, persists across LevelComplete and Summary screens throughout the campaign. Cleared on game reset.

## Victory Animation System
- Triggered on zero-siren level completions (before showing LEVEL_COMPLETE screen)
- 3 variants cycled by level number: `((currentLevel - 1) % 3) + 1`
  - **Iron Shield** (v1): Expanding golden dome + shockwave rings + particle burst. "IRON SHIELD / ALL THREATS NEUTRALIZED"
  - **Skies Clear** (v2): Dawn gradient + rising particles + sun glow. "SKIES CLEAR / ZERO CIVILIAN ALERTS"
  - **Star Commander** (v3): Constellation lines + gold star medal. "STAR COMMANDER / FLAWLESS DEFENSE"
- Renders as SVG `<g>` inside RadarDisplay's SVG via ref-based innerHTML injection
- **CSS animation fill-mode unreliable** with Tailwind CSS 4 `@layer` system for SVG elements. Key opacities (backdrop, text, medal, fade-out) use JS-driven inline styles via `applyJSTimeline()`. Decorative effects (particles, rings, rays) still use CSS animations.
- Duration: 6 seconds total (backdrop fade-in → content → text → fade-out → onComplete)
- `pendingLevelComplete` state in App.jsx delays LEVEL_COMPLETE screen while animation plays
- Test hook: `window.__testVictory(1)`, `(2)`, or `(3)` to preview during gameplay (auto-pauses)

## Desktop Layout
- **3-column flex layout**: Threat panel (260px) | Centered radar | Ammo stack (230px), all vertically centered. `gap-6` between columns.
- **Normal mode**: `max-w-[1200px]` constrains layout to center of screen
- **Fullscreen mode**: `max-w-none` + `px-8` padding — layout spreads across full width. `isFullscreen` state toggles this dynamically. Critical because fullscreen has different aspect ratio (wider) and the 1200px cap would leave too much dead space.
- **Radar sizing**: `maxWidth: 900px, maxHeight: 100%, aspectRatio: 1` — height-constrained, fills available vertical space. Panels don't shrink radar since width is not the constraint.
- **AmmoStack**: Shows all 4 interceptor types + hold fire vertically. Available systems bright, unavailable dimmed (opacity-20). Includes ammo counts, dots, streak indicator, and feedback messages. No letter-spacing on labels (was causing "DAVID'S SLING" truncation).
- **ControlPanel**: Hidden on desktop (`lg:hidden`), shown on mobile/tablet as bottom panel
- **Fullscreen mode**: Toggle via ⛶ button (top-right) or `F` key. Uses browser Fullscreen API. Available from any game screen.
- Top bar: Level name + Hebrew subtitle centered, music/score left, timer/settings right

## Quiz System
- 2 questions per level, randomly selected from pool of 12-14
- L1-L3: Primarily factual recall (geography, system specs, costs)
- L4-L6: Mix of recall + application/analysis questions (e.g., "Why can't Iron Dome intercept a ballistic missile?")
- L7: Cost-exchange ratio and strategic doctrine questions
- `linkedFacts` system ensures questions relate to facts shown in that session's briefing

## Blip Animation
- Position: `spawn + (target - spawn) * progress` where progress = timeElapsed / countdown
- Easing by type: ballistic `progress^3`, hypersonic `progress^4`, others linear
- Blip radius: drone 1.2, rocket 1.4, cruise 1.7, ballistic 2.0, hypersonic 2.2

## Label System
- Cities have `labelDir` (e, w, ne, nw, se, sw, n, s) controlling label offset
- `tier: 1` = always labeled when visible; `tier: 2` = labeled only when zoomed in or targeted
- **Per-level override in RadarDisplay.jsx**: Haifa uses `'se'` at L4-5 but `'w'` at L6+ to avoid overlap with nearby bases
- Infrastructure (`isInfra: true`) rendered with triangle markers ▲
- Military bases (`isBase: true`) rendered with diamond markers ◆, hidden at L6+ unless actively targeted or `keyBase: true`
- Multi-line labels: use `\n` in `shortLabel` field

### Label Sizing by Level
- Font sizes scale with viewport zoom: `scale >= 2.0` → 1.8, `scale >= 1.5` → 1.8, else 2.2
- **Landmark cities** (cities revealed before current level at L4-L5): 80% of normal size, dimmed green
- **Infrastructure at L4**: font size 2.0, normal weight (not bold) — reduced from 2.2 bold to avoid visual clutter
- **Infrastructure at L6+** (`keyInfra: true` only): 75% of normal size, very dimmed orange (40% opacity) — contextual landmarks only
- **L5 bases**: font size 2.2 (emphasized since they're the focus)

### Infrastructure Visibility at L6+
Three "key" infrastructure targets have `keyInfra: true` and remain visible as dimmed landmarks at L6-L7:
- **BAZAN Oil Refinery** — north (near Haifa), geographically distinct
- **Ben Gurion Airport** — central, universally recognized
- **Dimona Nuclear Reactor** — south, isolated area, iconic strategic target
The other 5 (Orot Rabin, Sorek, Rutenberg, Ashdod Port, The Kirya) are hidden at L6+ — they cluster in the Tel Aviv-Ashkelon corridor and would overlap badly at full-country zoom. They still light up red if actively targeted by a threat.

## Cheat Codes (typed during gameplay)
- **TZUR**: Auto-zap threats for 12s (3 uses/campaign, +75/intercept)
- **SASHA**: Same as TZUR with briefing music (3 uses/campaign)
- **DVIR**: Passive shield dome for 12s, auto-deflects at boundary (3 uses/campaign)
- **SUFRIN**: Auto-zap for 15s with portrait (3 uses/campaign)
- **BH**: Clear all active threats (3 uses/campaign)
- **BSD**: Resupply +1 of each interceptor (3 uses/campaign)

## Escape Room Mode
- 25-minute campaign-wide countdown (does not reset between levels)
- Ticks during all states except PRE_GAME and SUMMARY
- Auto-ends campaign when timer hits 0
- Facilitator can add/remove time via controls panel

## Deployment Workflow

### Git Remote
- **origin** → `mmh-web/missile-defense` (primary, only active remote)
- mmh-cyber repo exists but gh-pages is deleted — site is offline

### Live URL
- https://mmh-web.github.io/missile-defense/

### Steps
1. Edit source files in `/Users/mhecht/Desktop/missile-defense/`
2. Build: `npx vite build` (outputs to `dist/`)
3. Commit source + dist to `main`, push: `git push origin main`
4. Deploy to gh-pages:
   - `git stash && git checkout gh-pages && git pull origin gh-pages`
   - `git show main:dist/index.html > index.html`
   - `rm -rf assets && mkdir assets` then copy new asset files from `dist/assets/`
   - `git add index.html assets/ && git commit && git push origin gh-pages`
   - `git checkout main && git stash pop`

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
| L1 | 4.5 | 3.5 | 1.0 | 6.0 | 4.0 | **3.5** |
| L2 | 6.0 | 3.5 | 2.5 | 6.5 | 4.5 | **4.3** |
| L3 | 4.5 | 5.5 | 4.0 | 7.0 | 7.0 | **5.5** |
| L4 | 2.0 | 7.5 | 5.0 | 5.0 | 8.0 | **5.6** |
| L5 | 2.5 | 9.0 | 6.0 | 2.0 | 8.5 | **6.0** |
| L6 | 6.5 | 8.0 | 10.0 | 6.5 | 2.0 | **7.0** |
| L7 | 9.0 | 8.5 | 10.0 | 8.5 | 1.5 | **8.0** |

### Scoring Criteria Reference

**A. Tempo & Volume (20%)** — How fast must you click?
- Threats/min: L1=17.3, L2=15.9, L3=15.5, L4=12.5, L5=13.2, L6=15.4, L7=22.3
- Avg countdown: L1=6.8s, L2=7.6s, L3=7.7s, L4=10.2s, L5=8.5s, L6=6.7s, L7=6.3s
- Simultaneous 3+ waves: L1=2, L2=7, L3-L7=0
- Peak active threats: L1=5, L2=6, L3=6, L4=6, L5=6, L6=6, L7=8

**B. Decision Complexity (30%)** — How hard is each decision? (heaviest weight — wrong key press is #1 failure cause)
- Systems: L1-2=1, L3=2, L4=3, L5-7=4
- Threat types: L1=1, L2=2, L3=3, L4=3, L5-7=5
- HF ratio (hold-fire decisions): L1=22%, L2=29%, L3=28%, L4=13%, L5=18%, L6=13%, L7=24%
- Delayed reveal (% with reveal_pct < 1.0): L1-3=0%, L4=48%, L5=38%, L6=33%, L7=41%

**C. Ammo Pressure (20%)** — How much room for error?
- Surplus ratio: L1=22%, L2=6%, L3=10.8%, L4=9.1%, L5=11.4%, L6=0%, L7=0%
- Zero margin (L6, L7) = automatic 10.0 score — one wasted shot means guaranteed failure

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

## Shared Leaderboard (Firebase Firestore)
- Scores save to both Firestore cloud AND localStorage (offline fallback)
- Summary screen subscribes to real-time updates via `onSnapshot` — scores from other devices appear live
- Firestore collection: `scores`, indexed by `gameMode` + `score` (desc)
- Firebase project: `missile-defense-41ed4` (config in `src/utils/firebase.js`)
- Security rules: test mode (read/write open for 30 days from creation)
- `isHighScore()` uses localStorage only for instant sync check
- If Firestore is down, everything degrades gracefully to localStorage-only

## Responsive Design (Mobile + Tablet + Desktop)

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Phone | < 768px | Stacked: radar (flex-1) → compact threat table (max-h-240px) → controls. |
| Tablet (iPad portrait) | 768-1023px | Stacked: radar → compact threat table → controls. No keyboard shortcuts. |
| Desktop | ≥ 1024px | 3-column flex (max-w-1200px): threat panel (240px) + radar (flex-1, height-constrained) + ammo stack (200px). All vertically centered. Keyboard shortcuts shown. |

### Compact Threat Table (ThreatPanel.jsx)
Replaced verbose cards with compact single-line rows per threat: `T{id} TYPE ▸ IMPACT_ZONE countdown`.
- On desktop (`lg:`): two-line rows — line 1 is the compact row, line 2 shows full type badge + threat name
- On phone/tablet: single-line rows only (~32px each, all threats fit without scrolling)
- Sorted by urgency (ascending timeLeft), held threats sorted to bottom
- Visible at ALL breakpoints (no more hidden panel on mobile)
- **Color system**: Each row uses exactly 2 color families — threat type color (left border, ID, type abbrev) + green accent (countdown). Impact zone: white for populated, gray for open ground, gray pulsing for unrevealed. Critical rows (<5s) get subtle type-color background tint + white countdown. No amber/yellow mixing.

### Desktop 3-Column Layout
At `lg:` breakpoint, 3-column flex layout with dynamic max-width:
- Normal: `max-w-[1200px] mx-auto` — compact centered layout
- Fullscreen: `max-w-none px-8` — spreads across full width (wider aspect ratio needs more space)
- Threat panel: `order-1 w-[260px]` — fixed width, vertically centered
- Radar: `order-2 flex-1` — fills remaining space, height-constrained square
- Ammo stack: `order-3 w-[230px]` — fixed width, vertically centered
- Column gap: `gap-6` (24px) between all three panels
- On mobile: radar order-1 (top), threats order-2 (below), ammo hidden (ControlPanel at bottom)

### Key responsive patterns:
- **Viewport**: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`
- **3-column layout**: `lg:flex-row lg:items-center` — threat panel + radar + ammo stack side-by-side, vertically centered
- **Keyboard shortcut badges**: `hidden lg:flex` — only shown on desktop
- **Keyboard hint text**: `hidden lg:block` — only shown on desktop
- **Radar blip tap targets**: Invisible circle `r=10` for touch (r=10 in 100-unit SVG viewBox)
- **Radar sizing**: `maxWidth: 900px, maxHeight: 100%, aspectRatio: 1` — height-constrained, fills vertical space
- **Fullscreen**: `F` key or ⛶ button toggles fullscreen mode (browser Fullscreen API)
- **Top bar**: Hebrew names hidden on phone (`hidden md:inline`), front names hidden on smallest screens (`hidden sm:inline`)
- **Control buttons**: Compact text on phone (`text-[10px] md:text-sm`), no ammo dots on phone (`hidden sm:flex`)

## Workflow Rules
- **Never ask for permission** — just do the work and show results. User will playtest and give feedback.
- Keep dev server running after changes so user can playtest immediately.
- When making UI changes, test at all 3 breakpoints (phone 375×812, tablet 768×1024, desktop 1366×800).
- Deploy fully when asked (commit main → build → push → gh-pages deploy cycle).
- **Context window management**: Track remaining prompt space. When running low (~20% remaining), proactively update CLAUDE.md with all session state, pending tasks, and decisions — then alert the user: "⚠️ Running low on context. I've saved all session state to CLAUDE.md. Recommend starting a fresh session."
- **Auto-update CLAUDE.md**: Every ~30 minutes of active work OR after completing a significant feature/fix batch, proactively update this file with new logic, decisions, conventions, and pending work. Notify the user: "📝 Updated CLAUDE.md with [brief summary of what was added]." Commit alongside other changes when deploying.
- **Auto-update MEMORY.md**: When discovering new workflow patterns, gotchas, or user preferences that apply globally or across sessions, update `~/.claude/projects/-Users-mhecht-Desktop-missile-defense/memory/MEMORY.md`. Notify the user when updated.

## Important Conventions
- **MUTE GAME IN PREVIEW**: Always mute audio before playtesting: `document.querySelectorAll('audio,video').forEach(a=>{a.muted=true;a.pause()})`
- `window.__game = game` debug hook exists in App.jsx — useful for testing (`window.__game.startLevel(3)`)
- Sound files in `public/sounds/` (music-level-1.mp3 through music-level-7.mp3, briefing-music.mp3, siren.mp3, etc.)
- Images in `public/images/` (ID1.jpg through ID8.avif — interception photos, sufrin.png for cheat portrait)
- Image paths: always use `import.meta.env.BASE_URL` (resolves to `/missile-defense/` in prod, `/missile-defense/` in dev)
- Facilitator panel: ESC key toggles, auto-pauses gameplay
- Pause: P key during ACTIVE state
- Hebrew translations (`he` field) on cities for display
- All threat IDs must be unique within their array but can reuse across arrays
- Threat `origin` determines spawn point on radar edge (see spawnOrigins.js)
- **Game title**: "IRON DOME COMMAND" (פיקוד כיפת ברזל) — renamed from "MISSILE DEFENSE"
- **Hold fire key display**: Shows "SPC" (spacebar) not "5" in AmmoStack

## Zero-Scroll Design Philosophy
All game screens must fit in viewport without scrolling. Key design decisions:
- **No SVG animations in briefings** — removed from both EducationalBriefing and LevelIntro to save vertical space
- **Compact briefing header**: "L{n} — {NAME} {hebrew}" on single line instead of 4-line header
- **CONTINUE + SKIP side by side** — no fixed footer for skip button, both inline after countdown bar
- **Larger fact text** (`text-sm` not `text-xs`) since animation space was reclaimed
- **No Field Exercise** — L1 briefing phases are `['threat', 'defense', 'quiz']` only. The game itself teaches gameplay.
- **LevelComplete condensed**: campaign total is inline bar, no "NEXT: LEVEL X" preview card
- **Quiz tightened**: reduced margins (`mb-3` not `mb-6`), smaller option padding

## Cinematic Visual System

### Design Philosophy
All non-gameplay screens use real interception photos from Israel with gradient overlays, creating a cinematic military-tech aesthetic. Key pattern: hero photo → gradient overlay → large stat number → descriptive label → compact fact cards.

### Photo Assets (`public/images/`)
| File | Content | Used In |
|------|---------|---------|
| ID1.jpg | Interception photo | L1 threat, L5 threat |
| ID2.jpg | Interception photo | L2 threat |
| ID3.jpg | Interception photo | L4 threat, L6 threat, L7 threat, Title screen, Summary |
| ID4.jpeg | Interception photo | L3 threat, ScoringIntro background |
| ID5.jpeg | Interception photo | L1 defense, L5 defense, L7 defense |
| ID6.webp | Interception photo | L2 defense, L6 defense |
| ID7.jpeg | Interception photo | L4 defense |
| ID8.avif | Interception photo | L3 defense |

### Hero Photo Pattern (reusable across components)
```jsx
const basePath = import.meta.env.BASE_URL || '/missile-defense/';
// Photo container with gradient overlay
<div className="relative rounded-xl overflow-hidden">
  <div className="w-full h-[220px]"
    style={{ background: `url('${basePath}images/${photo}') center center / cover no-repeat` }} />
  <div className="absolute inset-0 flex flex-col justify-end"
    style={{ padding: '18px 22px', background: 'linear-gradient(...)' }}>
    <div className="text-[15px] font-bold tracking-[0.25em] uppercase" style={{ color, textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>CAPTION</div>
    <div className="font-mono font-black text-[52px]" style={{ color }}>STAT</div>
    <div className="font-mono text-[15px] text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>LABEL</div>
  </div>
</div>
```

### Screens with Cinematic Treatment
- **Title (PRE_GAME)**: Full-bleed ID3.jpg, "IRON DOME COMMAND" + Hebrew, 4 system badges, orange accent
- **Briefing threat phase**: Hero photo + big stat + fact cards, level-specific accent color
- **Briefing defense phase**: Hero photo + threat profile bar + fact cards, green accent
- **Briefing quiz phase**: Photo background with gradient overlay, cyan accent
- **Summary**: Photo band (260px, ID3.jpg) behind score box with green glow
- **HUD (gameplay)**: Backdrop-blur glass effect, thin accent glow line under top bar

### Text Readability Rules
- Hero caption: minimum `text-[15px]`, `font-bold`, `text-shadow: 0 1px 6px rgba(0,0,0,0.8)`
- Hero label: minimum `text-[15px]`, white, `text-shadow: 0 1px 4px rgba(0,0,0,0.6)`
- Any text over a photo MUST have text-shadow for readability
- Quiz/interactive content over photo backgrounds needs `z-index` above the gradient overlay div

### LevelComplete Hero Photo
- Photo band anchored to **bottom** of screen (`absolute bottom-0`), 320px tall
- Gradient fades **upward** into dark background, so header text ("ALL CLEAR", stars) sits on clean dark space
- Photo is atmospheric backdrop behind stats/buttons area at bottom

### Screens NOT YET Redesigned (still pending)
- **LevelComplete.jsx** — approved mockup exists (`mockup-level-complete.html`), but photo already moved to bottom
- **LevelIntro.jsx** — approved mockup exists (`mockup-level-intro.html`)
- **ScoringIntro.jsx** — approved mockup exists (`mockup-scoring-intro.html`)

## Pending Work (as of March 2026)

### Completed (Previous Sessions)
- ✅ Levels end before 0:00 — Fixed L2 duration (128→134s), L6 duration (152→160s)
- ✅ Score starting at 1000 — Fixed `getRunningScore()` counting surplus ammo during gameplay
- ✅ Briefing/LevelIntro scrolling — Removed animations, condensed layout, zero-scroll achieved
- ✅ Guilt/blame language — Cleaned up L1 emotional language, L2 "ghost towns", L3 "dangerously close"
- ✅ Summary.jsx dead code — Removed `typeColor()`, `levelStats` prop, fixed hardcoded `/7`
- ✅ CheatCountdown overlap — Each cheat uses unique yOffset (0, 10, 20, 8)
- ✅ ThreatPanel animate-pulse — Removed from critical rows
- ✅ Field Exercise removed from L1 — Game teaches gameplay directly
- ✅ Panel headers added — INCOMING THREATS + INTERCEPTORS persistent headers with tips
- ✅ Ammo dots wrap to 2 lines — No +N cutoff
- ✅ Cinematic visual overhaul — Title, briefing (threat/defense/quiz), summary screens redesigned with hero photos
- ✅ Game renamed — "MISSILE DEFENSE" → "IRON DOME COMMAND" (פיקוד כיפת ברזל)
- ✅ Hold fire key — "5" → "SPC" in AmmoStack
- ✅ HUD glass blur — Backdrop-blur + accent glow line on gameplay top bar
- ✅ Quiz visibility fix — z-index on content above photo overlay
- ✅ Briefing text readability — Caption/label bumped to 15px with text-shadow
- ✅ Progressive reveal re-enabled — `impactRevealed` was hardcoded true; now conditional on `reveal_pct`
- ✅ Wasted intercept streak reset — Added `setStreak(0)` for correct system on open ground
- ✅ Auto-zap cheats skip HF — All 3 cheat filters now check `t.is_populated`
- ✅ Leaderboard levels column removed — was showing "/7" which confused 6-level campaigns
- ✅ Fullscreen layout fix — `max-w-none` in fullscreen, panels no longer cramped
- ✅ L4 infrastructure labels — smaller (2.0) and not bold for cleaner radar
- ✅ LevelComplete photo to bottom — hero photo band moved from top to bottom, gradient flipped
- ✅ L6 key infrastructure landmarks — Dimona, BAZAN, Ben Gurion shown as dimmed context markers
- ✅ Hypersonic quiz corrected — answer now includes the United States
- ✅ AmmoStack truncation fix — removed letter-spacing, "DAVID'S SLING" fully visible everywhere

### Still Pending
- **LevelComplete redesign** — Approved mockup ready, not yet fully implemented (photo moved to bottom already)
- **LevelIntro redesign** — Approved mockup ready, not yet implemented
- **ScoringIntro redesign** — Approved mockup ready, not yet implemented
- **SUFRIN portrait broken image** — Image path may have base URL issue in dev vs production
- **Cheat codes untested** — TZUR, SASHA, DVIR, SUFRIN, BH, BSD, HACK overlay
- **Difficulty progression** — L5 (6.0) slightly below target (6.5-7.0), L7 (8.0) below target (8.5-9.5)
- **~720 lines dead code** — FieldExercisePhase and animation components in EducationalBriefing.jsx could be removed
- **Peak simultaneous threats**: L4 peaks at ~7, L5 peaks at 6, L6 peaks at ~10. User noticed high counts during playtesting — monitor feedback on whether these feel overwhelming
