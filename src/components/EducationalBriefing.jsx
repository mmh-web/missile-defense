import { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomQuestions, QUIZ_DATA } from '../config/quizData.js';

// ============================================================
// BRIEFING_CONTENT — All level-specific content for all 7 levels
// ============================================================
const BRIEFING_CONTENT = {
  1: {
    phases: ['threat', 'defense', 'quiz'],
    threat: {
      title: 'SOUTHERN ISRAEL',
      hebrewTitle: 'דְּרוֹם יִשְׂרָאֵל',
      subtitle: 'Communities in the Line of Fire',
      color: '#f97316',
      displayCount: 3,
      heroImage: 'ID1.jpg',
      heroCaption: 'SOUTHERN ISRAEL · דְּרוֹם יִשְׂרָאֵל',
      heroStat: '20,000+',
      heroLabel: 'rockets and mortars fired at Israel since 2001 — ranging from Sderot to Beersheba',
      factPool: [
        { id: 'l1t1', icon: '🏘️', stat: '15 seconds', detail: 'Warning time in Sderot (pop. 35,000) — just 1 km from the Gaza fence' },
        { id: 'l1t2', icon: '🏗️', stat: '150,000', detail: 'People in Ashkelon, 13 km from Gaza — home to a power station and desalination plant' },
        { id: 'l1t3', icon: '🏙️', stat: '210,000', detail: 'People in Beersheba, 40 km from Gaza — home to the region\'s only Level 1 trauma center' },
        { id: 'l1t4', icon: '🌾', stat: '50+', detail: 'Farming communities in the "Gaza Envelope" within 7 km of the border — including Kfar Aza, Be\'eri, Nir Oz' },
        { id: 'l1t5', icon: '👥', stat: '1 million+', detail: 'Israelis live within rocket range of Gaza — 12% of the population' },
        { id: 'l1t6', icon: '🚨', stat: 'TZEVA ADOM', detail: '"Color Red" siren system — can sound dozens of times per day in border towns during conflict' },
      ],
      animation: 'rocket',
    },
    defense: {
      title: 'ROCKETS & IRON DOME',
      hebrewTitle: 'כִּפַּת בַּרְזֶל',
      subtitle: 'The Cheapest Threat, The Smartest Shield',
      color: '#22c55e',
      displayCount: 3,
      heroImage: 'ID5.jpeg',
      heroCaption: 'IRON DOME · כִּפַּת בַּרְזֶל',
      heroStat: '90%+',
      heroLabel: 'interception success rate — Iron Dome calculates each trajectory and only fires when a populated area is threatened',
      factPool: [
        { id: 'l1d1', icon: '🚀', stat: '$800', detail: 'Cost of a Qassam rocket — built from sugar, fertilizer, and pipes. Completely unguided' },
        { id: 'l1d2', icon: '🔢', stat: '20,000+', detail: 'Rockets and mortars fired from Gaza since 2001 — range of 5-45 km, Sderot to Beersheba' },
        { id: 'l1d3', icon: '💰', stat: '62:1', detail: 'Cost ratio — $800 Qassam vs $50,000 Tamir interceptor. The ratio itself is a weapon' },
        { id: 'l1d4', icon: '🛡️', stat: '90%+', detail: 'Iron Dome success rate since 2011 — only fires at rockets headed for populated areas' },
        { id: 'l1d5', icon: '🏭', stat: '3-4', detail: 'Launchers per Iron Dome battery, plus radar and control center — enough for a medium city' },
        { id: 'l1d6', icon: '🧠', stat: 'SELECTIVE FIRE', detail: 'Iron Dome\'s secret — lets rockets aimed at open fields pass, saving interceptors for real threats' },
      ],
      animation: 'iron_dome',
    },
    exerciseConfig: null,
  },

  2: {
    phases: ['threat', 'defense', 'quiz'],
    threat: {
      title: 'NORTHERN ISRAEL',
      hebrewTitle: 'צְפוֹן יִשְׂרָאֵל',
      subtitle: 'The Northern Border Under Threat',
      color: '#eab308',
      displayCount: 3,
      heroImage: 'ID2.jpg',
      heroCaption: 'NORTHERN ISRAEL · צְפוֹן יִשְׂרָאֵל',
      heroStat: '150,000+',
      heroLabel: 'rockets in Hezbollah\'s arsenal — putting the Galilee and all of northern Israel at risk',
      factPool: [
        { id: 'l2t1', icon: '🏘️', stat: '5 km', detail: 'Kiryat Shmona to the Lebanese border — entire city evacuated Oct 2023, couldn\'t return for a year' },
        { id: 'l2t2', icon: '📍', stat: '0 km', detail: 'Metula is built against the border fence — residents can see Hezbollah positions from their backyards' },
        { id: 'l2t3', icon: '⚓', stat: '4,000+', detail: 'Rockets fired at northern Israel in the 2006 war — many aimed at Haifa (pop. 1 million metro)' },
        { id: 'l2t4', icon: '🏖️', stat: '10 km', detail: 'Nahariya to the Lebanese border — rockets struck its hospital in 2006' },
        { id: 'l2t5', icon: '👥', stat: '80,000', detail: 'Northern residents evacuated in Oct 2023 — couldn\'t return for over a year' },
        { id: 'l2t6', icon: '🏔️', stat: '150,000+', detail: 'Rockets in Hezbollah\'s arsenal — putting all of the Galilee and northern Israel at risk' },
      ],
      animation: 'drone',
    },
    defense: {
      title: 'ATTACK DRONES',
      hebrewTitle: 'כטב"מ תַּקִּיפָה',
      subtitle: 'Slow, Cheap, and Deadly in Swarms',
      color: '#eab308',
      displayCount: 3,
      heroImage: 'ID6.webp',
      heroCaption: 'IRON DOME · כִּפַּת בַּרְזֶל',
      heroStat: '$20,000',
      heroLabel: 'cost per drone — 2.5× cheaper than the interceptor that destroys it, designed to overwhelm',
      factPool: [
        { id: 'l2d1', icon: '🇮🇷', stat: 'SHAHED-136', detail: 'Iranian "kamikaze" drone — the drone IS the weapon, crashing into its target and detonating' },
        { id: 'l2d2', icon: '📡', stat: '185 km/h', detail: 'Drone cruise speed — slow and low (100-2,000m), hugging terrain to avoid radar detection' },
        { id: 'l2d3', icon: '📏', stat: '2,500 km', detail: 'Shahed-136 range — 7+ hours from Iran, but just minutes from Lebanon' },
        { id: 'l2d4', icon: '🐝', stat: '10-50+', detail: 'Drones per swarm — designed to overwhelm defenses. Even a few getting through can be devastating' },
        { id: 'l2d5', icon: '💰', stat: '$20,000', detail: 'Cost per drone — 2.5× cheaper than the interceptor that destroys it' },
        { id: 'l2d6', icon: '🎯', stat: 'GPS-GUIDED', detail: 'Unlike unguided rockets, drones are pre-programmed to hit specific buildings' },
      ],
      animation: 'iron_dome',
    },
    exerciseConfig: {
      exerciseThreats: [
        { systemName: 'IRON DOME', shortcut: '1', threatLabel: 'DRONE', threatColor: '#eab308', startX: 30, startY: 55 },
        { systemName: 'IRON DOME', shortcut: '1', threatLabel: 'ROCKET', threatColor: '#f97316', startX: 260, startY: 15 },
      ],
    },
  },

  3: {
    phases: ['threat', 'defense', 'quiz'],
    threat: {
      title: 'CENTRAL ISRAEL',
      hebrewTitle: 'מֶרְכַּז יִשְׂרָאֵל',
      subtitle: 'The Heart of the Nation',
      color: '#3b82f6',
      displayCount: 3,
      heroImage: 'ID4.jpeg',
      heroCaption: 'CENTRAL ISRAEL · מֶרְכַּז יִשְׂרָאֵל',
      heroStat: '15 km',
      heroLabel: 'Israel\'s width at its narrowest — a cruise missile could cross the entire country in under a minute',
      factPool: [
        { id: 'l3t1', icon: '🏙️', stat: '4 million+', detail: 'People in the Tel Aviv metro area — Israel\'s economic engine, stock exchange, and tech hub' },
        { id: 'l3t2', icon: '🕌', stat: '3 FAITHS', detail: 'Jerusalem is holy to Judaism, Christianity, and Islam — one of the most sensitive targets on Earth' },
        { id: 'l3t3', icon: '📐', stat: '15 km', detail: 'Israel\'s width at its narrowest — a cruise missile could cross the entire country in under a minute' },
        { id: 'l3t4', icon: '✈️', stat: '1 AIRPORT', detail: 'Ben Gurion is Israel\'s only major international airport — a missile attack cuts the country off' },
        { id: 'l3t5', icon: '👥', stat: '~5 million', detail: 'People in the central corridor between Tel Aviv and Jerusalem — nearly half the population' },
        { id: 'l3t6', icon: '💻', stat: 'SILICON WADI', detail: 'Thousands of startups plus Google, Apple, Microsoft R&D — a strike ripples through global tech' },
      ],
      animation: 'cruise',
    },
    defense: {
      title: "CRUISE MISSILES & DAVID'S SLING",
      hebrewTitle: 'קֶלַע דָּוִד',
      subtitle: 'Low-Flying Threat, Precision Shield',
      color: '#3b82f6',
      displayCount: 3,
      heroImage: 'ID8.avif',
      heroCaption: "DAVID'S SLING · קֶלַע דָּוִד",
      heroStat: 'HIT-TO-KILL',
      heroLabel: 'Stunner interceptors use no explosive warhead — pure kinetic impact at 40-300 km range',
      factPool: [
        { id: 'l3d1', icon: '✈️', stat: 'LOW & SLOW', detail: 'Cruise missiles fly like small aircraft, hugging terrain to sneak under radar with GPS accuracy' },
        { id: 'l3d2', icon: '🇮🇷', stat: '1,600 km', detail: 'Range of Iran\'s Paveh cruise missile — enough to reach central Israel flying low the entire way' },
        { id: 'l3d3', icon: '📡', stat: 'TERRAIN HUG', detail: 'Unlike high-arc ballistic missiles, cruise missiles stay low — hard to detect until close range' },
        { id: 'l3d4', icon: '🛡️', stat: 'HIT-TO-KILL', detail: 'David\'s Sling Stunner interceptors use no explosive warhead — pure kinetic impact, operational 2017' },
        { id: 'l3d5', icon: '👁️', stat: 'DUAL SEEKER', detail: 'Stunner uses both infrared and radar guidance to track maneuvering targets at 40-300 km range' },
        { id: 'l3d6', icon: '🏭', stat: '$1 million', detail: 'Cost per Stunner interceptor — expensive, but far cheaper than what it protects' },
      ],
      animation: 'davids_sling',
    },
    exerciseConfig: {
      exerciseThreats: [
        { systemName: "DAVID'S SLING", shortcut: '2', threatLabel: 'CRUISE', threatColor: '#3b82f6', startX: 30, startY: 55 },
        { systemName: 'IRON DOME', shortcut: '1', threatLabel: 'ROCKET', threatColor: '#f97316', startX: 260, startY: 15 },
      ],
    },
  },

  4: {
    phases: ['threat', 'defense', 'quiz'],
    threat: {
      title: 'STRATEGIC TARGETS',
      hebrewTitle: 'מַטָּרוֹת אִסְטְרָטֶגִיּוֹת',
      subtitle: 'Why Missile Defense Matters',
      color: '#ef4444',
      displayCount: 3,
      heroImage: 'ID3.jpg',
      heroCaption: 'STRATEGIC TARGETS · מַטָּרוֹת אִסְטְרָטֶגִיּוֹת',
      heroStat: '~200',
      heroLabel: 'ballistic missiles Iran fired at Israel in Oct 2024 — the largest such attack in history',
      factPool: [
        { id: 'l4t1', icon: '🗺️', stat: '15 km WIDE', detail: 'Israel at its narrowest — nearly all critical infrastructure on a tiny coastal strip in missile range' },
        { id: 'l4t2', icon: '⛽', stat: '65%', detail: 'Of Israel\'s diesel comes from the BAZAN refinery in Haifa Bay — Hezbollah\'s stated top target' },
        { id: 'l4t3', icon: '💧', stat: '80%+', detail: 'Of Israel\'s drinking water comes from desalination — losing Sorek plant means national crisis in days' },
        { id: 'l4t4', icon: '⚡', stat: '2,590 MW', detail: 'Orot Rabin power station — a single complex powering over a million homes' },
        { id: 'l4t5', icon: '☢️', stat: 'DIMONA', detail: 'Nuclear reactor in the Negev — Iran\'s top stated target. Missiles hit the area in October 2024' },
        { id: 'l4t6', icon: '🏛️', stat: '500 m', detail: 'How close an Iranian ballistic missile landed to the Kirya (Israel\'s Pentagon) in October 2024' },
      ],
      animation: 'ballistic',
    },
    defense: {
      title: 'BALLISTIC MISSILES & ARROW 2',
      hebrewTitle: 'חֵץ 2',
      subtitle: 'High Arc Threat, High Altitude Shield',
      color: '#ef4444',
      displayCount: 3,
      heroImage: 'ID7.jpeg',
      heroCaption: 'ARROW 2 · חֵץ 2',
      heroStat: 'MACH 9',
      heroLabel: 'Arrow 2 speed — intercepts at 50+ km altitude, 5× higher than airliners fly',
      factPool: [
        { id: 'l4d1', icon: '🎯', stat: '<12 min', detail: 'Flight time from Iran — ballistic missiles arc through upper atmosphere then dive at extreme speed' },
        { id: 'l4d2', icon: '💥', stat: '~200', detail: 'Ballistic missiles Iran fired at Israel in Oct 2024 — the largest such attack in history' },
        { id: 'l4d3', icon: '📅', stat: 'YEAR 2000', detail: 'Arrow 2 became operational — world\'s first modern anti-ballistic missile system, born from 1991 Scud attacks' },
        { id: 'l4d4', icon: '🚀', stat: 'MACH 9', detail: 'Arrow 2 speed — intercepts at 50+ km altitude, 5× higher than airliners fly' },
        { id: 'l4d5', icon: '🏭', stat: '$2.4 billion', detail: 'US investment in Arrow program since 1989 — jointly built by IAI and Boeing' },
        { id: 'l4d6', icon: '📡', stat: '500+ km', detail: 'Green Pine radar detection range — tracks 30 targets simultaneously, guides Arrow to within 4 meters' },
      ],
      animation: 'arrow_2',
    },
    exerciseConfig: {
      exerciseThreats: [
        { systemName: 'ARROW 2', shortcut: '3', threatLabel: 'BALLISTIC', threatColor: '#ef4444', startX: 30, startY: 55 },
        { systemName: "DAVID'S SLING", shortcut: '2', threatLabel: 'CRUISE', threatColor: '#3b82f6', startX: 260, startY: 15 },
      ],
    },
  },

  5: {
    phases: ['threat', 'defense', 'quiz'],
    threat: {
      title: 'ARMY BASES',
      hebrewTitle: 'בְּסִיסֵי צָבָא',
      subtitle: 'Why Enemies Target the Bases',
      color: '#a855f7',
      displayCount: 3,
      heroImage: 'ID1.jpg',
      heroCaption: 'MILITARY BASES · בְּסִיסֵי צָבָא',
      heroStat: 'NEVATIM',
      heroLabel: 'Home to all of Israel\'s F-35s — Iran fired missiles directly at it in October 2024',
      factPool: [
        { id: 'l5t1', icon: '✈️', stat: 'NEVATIM AFB', detail: 'Home to all of Israel\'s F-35s — Iran fired missiles directly at it in Oct 2024' },
        { id: 'l5t2', icon: '🚀', stat: 'PALMACHIM', detail: 'Israel\'s spaceport — launches satellites and tests Arrow interceptors. Launches westward over sea' },
        { id: 'l5t3', icon: '🕵️', stat: 'UNIT 8200', detail: 'Glilot base signals intelligence — compared to the NSA. Alumni founded $160B+ in tech companies' },
        { id: 'l5t4', icon: '☢️', stat: 'SDOT MICHA', detail: 'Believed to house Jericho ballistic missiles — Israel\'s ultimate deterrent, protected by Arrow' },
        { id: 'l5t5', icon: '🛩️', stat: '50 km', detail: 'Ramat David AFB to the Lebanese border — Hezbollah\'s first target in any northern war' },
        { id: 'l5t6', icon: '🦅', stat: 'TEL NOF', detail: 'Israel\'s F-15 long-range strike fleet — first country outside the US to fly the F-15 (1976)' },
      ],
      animation: 'hypersonic',
    },
    defense: {
      title: 'HYPERSONICS & ARROW 3',
      hebrewTitle: 'חֵץ 3',
      subtitle: 'Fastest Threat, Highest Shield',
      color: '#a855f7',
      displayCount: 3,
      heroImage: 'ID5.jpeg',
      heroCaption: 'ARROW 3 · חֵץ 3',
      heroStat: 'IN SPACE',
      heroLabel: 'Arrow 3 intercepts outside the atmosphere — hit-to-kill with pure kinetic energy, no warhead',
      factPool: [
        { id: 'l5d1', icon: '⚡', stat: 'MACH 5+', detail: 'Hypersonic speed — over 3,700 mph, boost to edge of space then glide while maneuvering' },
        { id: 'l5d2', icon: '⏱️', stat: '40 seconds', detail: 'To cross 100 km at Mach 7 — surface heats to 3,600°F from air friction' },
        { id: 'l5d3', icon: '🇷🇺', stat: 'MACH 20', detail: 'Russia\'s Avangard speed — Russia, China, Iran, North Korea all developing hypersonics' },
        { id: 'l5d4', icon: '🌌', stat: 'IN SPACE', detail: 'Arrow 3 intercepts outside the atmosphere — hit-to-kill with pure kinetic energy, no warhead' },
        { id: 'l5d5', icon: '📏', stat: '100+ km', detail: 'Arrow 3 engagement altitude — highest layer of Israeli defense. Tested in space in 2019' },
        { id: 'l5d6', icon: '🌐', stat: 'BURNS UP', detail: 'Debris from space intercepts burns on reentry — protecting people below' },
      ],
      animation: 'arrow_3',
    },
    exerciseConfig: {
      exerciseThreats: [
        { systemName: 'ARROW 3', shortcut: '4', threatLabel: 'HYPERSONIC', threatColor: '#a855f7', startX: 30, startY: 55 },
        { systemName: 'ARROW 2', shortcut: '3', threatLabel: 'BALLISTIC', threatColor: '#ef4444', startX: 260, startY: 15 },
      ],
    },
  },

  6: {
    phases: ['threat', 'defense', 'quiz'],
    threat: {
      title: 'THE EXPANDING THREAT RING',
      hebrewTitle: 'טַבַּעַת הָאִיּוּמִים',
      subtitle: 'Five Fronts — 360° of Danger',
      color: '#a855f7',
      displayCount: 3,
      heroImage: 'ID3.jpg',
      heroCaption: 'ALL FRONTS · טַבַּעַת הָאִיּוּמִים',
      heroStat: '5 FRONTS',
      heroLabel: 'Gaza, Lebanon, Syria, Iran, Yemen — Israel faces simultaneous threats from every direction',
      factPool: [
        { id: 'l6t1', icon: '🗺️', stat: '5 FRONTS', detail: 'Gaza, Lebanon, Syria, Iran, Yemen — Israel faces simultaneous threats from every direction' },
        { id: 'l6t2', icon: '🇾🇪', stat: '2,000+ km', detail: 'Yemen Houthi launch distance — the farthest threat origin, backed by Iran' },
        { id: 'l6t3', icon: '🔗', stat: 'AXIS', detail: 'Iran\'s "Axis of Resistance" — Gaza, Lebanon, Syria, Iraq, and Yemen can all strike at once' },
        { id: 'l6t4', icon: '📐', stat: '360°', detail: 'Defense perimeter — exponentially harder than one front, operators must scan every direction' },
        { id: 'l6t5', icon: '🌍', stat: '470 × 135 km', detail: 'Israel\'s total size — one of the smallest countries facing multi-front missile threats' },
        { id: 'l6t6', icon: '⏱️', stat: '12 min vs 4 hr', detail: 'Iranian ballistic missile vs Yemeni drone — defenders handle vastly different timelines at once' },
      ],
      animation: 'layered',
    },
    defense: {
      title: 'MULTI-LAYERED DEFENSE',
      hebrewTitle: 'הֲגָנָה רַב-שִׁכְבָתִית',
      subtitle: 'Integrated Air Defense Network',
      color: '#a855f7',
      displayCount: 3,
      heroImage: 'ID6.webp',
      heroCaption: 'MULTI-LAYER · הֲגָנָה רַב-שִׁכְבָתִית',
      heroStat: '4 LAYERS',
      heroLabel: 'Iron Dome → David\'s Sling → Arrow 2 → Arrow 3 — each assigned to specific threat types',
      factPool: [
        { id: 'l6d1', icon: '🛡️', stat: '4 LAYERS', detail: 'Iron Dome → David\'s Sling → Arrow 2 → Arrow 3 — each assigned to specific threat types' },
        { id: 'l6d2', icon: '📡', stat: '1 SCREEN', detail: 'Unified command network — operators see all threats regardless of origin on a single display' },
        { id: 'l6d3', icon: '🎯', stat: 'OVERLAP', detail: 'Multiple batteries per region provide overlapping coverage across the country' },
        { id: 'l6d4', icon: '🧠', stat: 'HOLD FIRE', detail: 'The hardest decision — which threats to intercept vs let pass when attacks come from everywhere' },
        { id: 'l6d5', icon: '📏', stat: 'EILAT → HAIFA', detail: 'Iron Dome batteries deployed the full length of the country, each covering a specific region' },
        { id: 'l6d6', icon: '🔄', stat: 'HOURS', detail: 'Time to reposition batteries during multi-front attacks to reinforce the most threatened areas' },
      ],
      animation: 'wave_tactics',
    },
    exerciseConfig: null,
  },

  7: {
    phases: ['threat', 'defense', 'quiz'],
    threat: {
      title: 'APRIL 13, 2024',
      hebrewTitle: 'שְׁלוֹשָׁה עָשָׂר בְּאַפְּרִיל',
      subtitle: 'The Night Everything Fired',
      color: '#ef4444',
      displayCount: 3,
      heroImage: 'ID3.jpg',
      heroCaption: 'APRIL 13, 2024 · שְׁלוֹשָׁה עָשָׂר בְּאַפְּרִיל',
      heroStat: '300+',
      heroLabel: 'projectiles Iran launched — 170+ drones, 30+ cruise missiles, 120+ ballistic missiles',
      factPool: [
        { id: 'l7t1', icon: '🚀', stat: '300+', detail: 'Projectiles Iran launched — 170+ drones, 30+ cruise missiles, 120+ ballistic missiles' },
        { id: 'l7t2', icon: '⏱️', stat: 'STAGGERED', detail: 'Slow drones first, then cruise, then ballistic — all timed to arrive simultaneously' },
        { id: 'l7t3', icon: '🤝', stat: '4 NATIONS', detail: 'US, UK, France, Jordan helped intercept — US Navy destroyers shot down ballistic missiles' },
        { id: 'l7t4', icon: '🎯', stat: '99%', detail: 'Of incoming projectiles intercepted — only a handful hit near Nevatim AFB, minor damage' },
        { id: 'l7t5', icon: '🛡️', stat: 'ALL 4 TIERS', detail: 'Iron Dome, David\'s Sling, Arrow 2, and Arrow 3 all fired simultaneously for the first time' },
        { id: 'l7t6', icon: '💰', stat: '$1.35 billion', detail: 'Defense cost — vs Iran\'s $80-100 million attack cost' },
      ],
      animation: 'final_stand',
    },
    defense: {
      title: 'THE COST PROBLEM',
      hebrewTitle: 'בְּעָיַת הָעֲלוּת',
      subtitle: 'When Defense Costs More Than Attack',
      color: '#f97316',
      displayCount: 3,
      heroImage: 'ID5.jpeg',
      heroCaption: 'THE COST PROBLEM · בְּעָיַת הָעֲלוּת',
      heroStat: '$1.35B',
      heroLabel: 'defense cost for one night — vs Iran\'s $80-100 million attack. The economics of survival',
      factPool: [
        { id: 'l7d1', icon: '💰', stat: '62:1', detail: '$800 Qassam vs $50,000 Tamir — the cost ratio is itself a weapon for the attacker' },
        { id: 'l7d2', icon: '🚀', stat: '$2-3 million', detail: 'Arrow 3 interceptor cost — adversaries can force a launch with a cheaper decoy' },
        { id: 'l7d3', icon: '🔦', stat: '$3.50', detail: 'Iron Beam cost per shot — laser defense, vs $50,000 for a Tamir interceptor' },
        { id: 'l7d4', icon: '⚡', stat: '∞ AMMO', detail: 'Iron Beam has no ammunition limit — fires as long as there is power' },
        { id: 'l7d5', icon: '🌧️', stat: 'WEATHER', detail: 'Iron Beam\'s main limitation — lasers lose effectiveness in clouds, rain, and sandstorms' },
        { id: 'l7d6', icon: '🔬', stat: 'GAME CHANGER', detail: 'US co-investing in Iron Beam — could transform missile defense economics worldwide' },
      ],
      animation: 'resource_mgmt',
    },
    exerciseConfig: null,
  },
};

// ============================================================
// Phase label mapping
// ============================================================
const PHASE_LABELS = {
  threat: 'SITUATION',
  defense: 'RESPONSE',
  quiz: 'READINESS CHECK',
  exercise: 'FIELD EXERCISE',
};

// ============================================================
// Phase progress bar — dynamic based on level's phases
// ============================================================
function PhaseBar({ currentPhase, phases }) {
  const phaseIndex = phases.indexOf(currentPhase);
  return (
    <div className="flex gap-1 mb-3">
      {phases.map((phaseKey, i) => {
        const isComplete = i < phaseIndex;
        const isCurrent = i === phaseIndex;
        const label = PHASE_LABELS[phaseKey] || phaseKey.toUpperCase();
        return (
          <div
            key={phaseKey}
            className={`flex-1 py-1.5 text-center font-mono text-[10px] tracking-widest rounded-sm transition-all duration-500
              ${isCurrent ? 'bg-green-900/60 text-green-400 border border-green-700 phase-active-pulse' : ''}
              ${isComplete ? 'bg-green-900/30 text-green-700 border border-green-900' : ''}
              ${!isCurrent && !isComplete ? 'bg-gray-900/50 text-gray-700 border border-gray-800' : ''}
            `}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Auto-advance countdown bar
// ============================================================
function CountdownBar({ duration, onComplete, paused }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    if (paused) return;
    startRef.current = performance.now() - elapsed * 1000;

    const interval = setInterval(() => {
      const now = performance.now();
      const e = (now - startRef.current) / 1000;
      setElapsed(e);
      if (e >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [duration, onComplete, paused]);

  const pct = Math.min(100, (elapsed / duration) * 100);
  const remaining = Math.max(0, Math.ceil(duration - elapsed));

  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-xs text-gray-500 tabular-nums w-6 text-right">{remaining}s</span>
    </div>
  );
}

// ============================================================
// THREAT ANIMATIONS — Small SVGs inside the briefing card
// ============================================================

function DroneAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 80" width="300" height="80" className="overflow-visible">
        <line x1="0" y1="72" x2="300" y2="72" stroke="#22c55e" strokeWidth="0.3" opacity="0.15" />
        <line x1="0" y1="40" x2="300" y2="40" stroke="#eab308" strokeWidth="0.3" opacity="0.06" strokeDasharray="4,8" />
        <text x="6" y="38" fill="#eab308" fontSize="5" fontFamily="monospace" opacity="0.2">LOW ALT</text>
        <g className="drone-fly">
          <circle cx="-14" cy="0" r="4" fill="#eab308" opacity="0.12" className="drone-rotor-spin" />
          <line x1="-14" y1="-3.5" x2="-14" y2="3.5" stroke="#eab308" strokeWidth="0.8" opacity="0.3" className="drone-rotor-spin" />
          <path d="M16,0 L12,-1.2 L-10,-1.2 L-13,0 L-10,1.2 L12,1.2 Z" fill="#eab308" opacity="0.85" />
          <path d="M4,-1.2 L-2,-8 L-8,-7 L-6,-1.2" fill="#eab308" opacity="0.7" />
          <path d="M4,1.2 L-2,8 L-8,7 L-6,1.2" fill="#eab308" opacity="0.7" />
          <path d="M-10,-1.2 L-13,-5 L-11,-4.5 L-10,-1.2" fill="#eab308" opacity="0.6" />
          <path d="M-10,1.2 L-13,5 L-11,4.5 L-10,1.2" fill="#eab308" opacity="0.6" />
          <ellipse cx="15" cy="0" rx="2" ry="1" fill="#fbbf24" opacity="0.9" />
          <circle cx="16.5" cy="0" r="0.5" fill="#fef08a" opacity="0.8" />
          <circle cx="-15" cy="0" r="2" fill="#f59e0b" opacity="0.3" className="drone-exhaust-glow" />
        </g>
      </svg>
    </div>
  );
}

function RocketAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 110" width="300" height="110" className="overflow-visible">
        {/* Ground */}
        <line x1="0" y1="100" x2="300" y2="100" stroke="#22c55e" strokeWidth="0.3" opacity="0.15" />
        {/* Arc path */}
        <path
          d="M30,98 Q80,20 150,15 Q220,12 270,98"
          fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.1"
          strokeDasharray="3,5"
        />
        <text x="150" y="10" fill="#f97316" fontSize="5" textAnchor="middle" opacity="0.2" fontFamily="monospace">APOGEE</text>
        <text x="30" y="108" fill="#f97316" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">LAUNCH</text>
        <text x="270" y="108" fill="#f97316" fontSize="5" textAnchor="middle" opacity="0.3" fontFamily="monospace">IMPACT</text>
        {/* Rocket on arc */}
        <g className="ballistic-missile-arc">
          <ellipse cx="-6" cy="0" rx="4" ry="1.5" fill="#f97316" opacity="0.15" className="ballistic-glow" />
          <path d="M-5,-1.5 L5,-1.5 L7,-1 L7,1 L5,1.5 L-5,1.5 L-6,1 L-6,-1 Z" fill="#f97316" opacity="0.85" />
          <path d="M5,-1.5 L10,0 L5,1.5" fill="#fb923c" opacity="0.9" />
          <path d="M-5,-1.5 L-7,-3.5 L-6,-3 L-5,-1.5" fill="#f97316" opacity="0.6" />
          <path d="M-5,1.5 L-7,3.5 L-6,3 L-5,1.5" fill="#f97316" opacity="0.6" />
          <circle cx="8" cy="0" r="2.5" fill="#f97316" opacity="0.15" className="ballistic-glow" />
        </g>
      </svg>
    </div>
  );
}

function CruiseMissileAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 80" width="300" height="80" className="overflow-visible">
        {/* Terrain */}
        <path
          d="M0,72 Q40,62 80,70 T160,66 T240,72 T300,68 L300,80 L0,80 Z"
          fill="#1a2e1a" opacity="0.5"
        />
        <path
          d="M0,72 Q40,62 80,70 T160,66 T240,72 T300,68"
          fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.25"
        />
        <line x1="0" y1="40" x2="300" y2="40" stroke="#3b82f6" strokeWidth="0.3" opacity="0.06" strokeDasharray="4,8" />
        <text x="6" y="38" fill="#3b82f6" fontSize="5" fontFamily="monospace" opacity="0.2">LOW ALT</text>
        {/* Cruise missile */}
        <g className="cruise-missile-fly">
          <ellipse cx="-16" cy="0" rx="4" ry="1.5" fill="#3b82f6" opacity="0.25" className="cruise-exhaust-pulse" />
          <path d="M18,0 L16,-1.8 L-12,-1.8 L-14,0 L-12,1.8 L16,1.8 Z" fill="#3b82f6" opacity="0.85" />
          <path d="M2,-1.8 L-1,-9 L-6,-8 L-4,-1.8" fill="#3b82f6" opacity="0.65" />
          <path d="M2,1.8 L-1,9 L-6,8 L-4,1.8" fill="#3b82f6" opacity="0.65" />
          <path d="M-11,-1.8 L-13,-5.5 L-12,-5 L-10,-1.8" fill="#3b82f6" opacity="0.55" />
          <path d="M-11,1.8 L-13,5.5 L-12,5 L-10,1.8" fill="#3b82f6" opacity="0.55" />
          <rect x="-4" y="1.8" width="6" height="2" rx="0.5" fill="#3b82f6" opacity="0.5" />
          <path d="M16,-1.5 L22,0 L16,1.5" fill="#60a5fa" opacity="0.9" />
          <circle cx="20" cy="0" r="0.8" fill="#bfdbfe" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

function BallisticMissileAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 120" width="300" height="120" className="overflow-visible">
        <line x1="0" y1="108" x2="300" y2="108" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />
        <path
          d="M35,106 Q75,10 150,6 Q225,4 270,106"
          fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.12"
          strokeDasharray="4,4"
        />
        <text x="150" y="4" fill="#ef4444" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">APOGEE</text>
        <circle cx="35" cy="106" r="2" fill="#ef4444" opacity="0.25" />
        <text x="35" y="116" fill="#ef4444" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">LAUNCH</text>
        <circle cx="270" cy="106" r="2" fill="#ef4444" opacity="0.35" className="ballistic-impact-pulse" />
        <text x="270" y="116" fill="#ef4444" fontSize="5" textAnchor="middle" opacity="0.35" fontFamily="monospace">IMPACT</text>
        <g className="ballistic-missile-arc">
          <ellipse cx="-8" cy="0" rx="5" ry="2" fill="#ef4444" opacity="0.15" className="ballistic-glow" />
          <path d="M-6,-2 L7,-2 L10,-1.5 L10,1.5 L7,2 L-6,2 L-8,1.5 L-8,-1.5 Z" fill="#ef4444" opacity="0.85" />
          <path d="M7,-2 L14,0 L7,2" fill="#f87171" opacity="0.9" />
          <path d="M-6,-2 L-9,-5 L-7,-4 L-6,-2" fill="#ef4444" opacity="0.6" />
          <path d="M-6,2 L-9,5 L-7,4 L-6,2" fill="#ef4444" opacity="0.6" />
          <rect x="0" y="-1" width="1.5" height="2" rx="0.3" fill="#f87171" opacity="0.4" />
          <circle cx="12" cy="0" r="3" fill="#ef4444" opacity="0.15" className="ballistic-glow" />
        </g>
      </svg>
    </div>
  );
}

function HypersonicMissileAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 120" width="300" height="120" className="overflow-visible">
        <line x1="0" y1="108" x2="300" y2="108" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />
        <path
          d="M280,8 Q200,10 150,40 Q120,65 90,106"
          fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.10"
          strokeDasharray="3,5"
        />
        {[0,1,2,3,4,5,6,7].map(i => (
          <line
            key={i}
            x1={270 - i * 22} y1={6 + i * 12}
            x2={258 - i * 20} y2={14 + i * 14}
            stroke="#a855f7" strokeWidth={0.4 + i * 0.1}
            opacity={0.04 + i * 0.025}
            className="hypersonic-speed-line"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
        <text x="275" y="6" fill="#a855f7" fontSize="5" textAnchor="end" opacity="0.3" fontFamily="monospace">REENTRY</text>
        <text x="150" y="30" fill="#a855f7" fontSize="4" textAnchor="middle" opacity="0.15" fontFamily="monospace">GLIDE PHASE</text>
        <circle cx="90" cy="106" r="3" fill="#a855f7" opacity="0.25" className="ballistic-impact-pulse" />
        <text x="90" y="116" fill="#a855f7" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">IMPACT</text>
        <g className="hypersonic-missile-dive">
          <ellipse cx="-20" cy="0" rx="18" ry="3" fill="#a855f7" opacity="0.08" className="hypersonic-plasma" />
          <ellipse cx="-14" cy="0" rx="12" ry="2.5" fill="#c084fc" opacity="0.10" className="hypersonic-plasma" />
          <ellipse cx="-8" cy="0" rx="6" ry="2" fill="#d8b4fe" opacity="0.12" />
          <path d="M-8,-1.8 L8,-1.8 L12,-1 L12,1 L8,1.8 L-8,1.8 L-10,1 L-10,-1 Z" fill="#a855f7" opacity="0.9" />
          <path d="M8,-1.8 L18,0 L8,1.8" fill="#d8b4fe" opacity="0.9" />
          <path d="M-7,-1.8 L-10,-4 L-8,-3.5 L-6,-1.8" fill="#a855f7" opacity="0.55" />
          <path d="M-7,1.8 L-10,4 L-8,3.5 L-6,1.8" fill="#a855f7" opacity="0.55" />
          <path d="M16,-5 Q22,0 16,5" fill="none" stroke="#d8b4fe" strokeWidth="0.8" opacity="0.5" />
          <path d="M14,-7 Q23,0 14,7" fill="none" stroke="#a855f7" strokeWidth="0.4" opacity="0.2" />
          <circle cx="16" cy="0" r="4" fill="#a855f7" opacity="0.2" className="hypersonic-plasma" />
          <circle cx="16" cy="0" r="2" fill="#d8b4fe" opacity="0.4" />
          <circle cx="17" cy="0" r="1" fill="#f0e0ff" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

function LayeredDefenseAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 160" width="300" height="160" className="overflow-visible">
        {/* Ground */}
        <line x1="0" y1="150" x2="300" y2="150" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />

        {/* City */}
        <rect x="130" y="135" width="15" height="15" fill="#334155" opacity="0.5" rx="1" />
        <rect x="148" y="130" width="12" height="20" fill="#334155" opacity="0.5" rx="1" />
        <rect x="163" y="138" width="10" height="12" fill="#334155" opacity="0.5" rx="1" />
        <text x="150" y="148" fill="#94a3b8" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">CITY</text>

        {/* Layer 4: Arrow 3 (space) */}
        <line x1="20" y1="15" x2="280" y2="15" stroke="#a855f7" strokeWidth="0.3" opacity="0.2" strokeDasharray="4,6" />
        <text x="10" y="13" fill="#a855f7" fontSize="4.5" fontFamily="monospace" opacity="0.4">SPACE</text>
        <rect x="240" y="8" width="40" height="12" fill="#a855f7" opacity="0.15" rx="2" />
        <text x="260" y="16" fill="#a855f7" fontSize="4.5" fontFamily="monospace" opacity="0.6" textAnchor="middle">ARROW 3</text>

        {/* Layer 3: Arrow 2 (upper atmo) */}
        <line x1="20" y1="45" x2="280" y2="45" stroke="#ef4444" strokeWidth="0.3" opacity="0.2" strokeDasharray="4,6" />
        <text x="10" y="43" fill="#ef4444" fontSize="4.5" fontFamily="monospace" opacity="0.4">UPPER ATM</text>
        <rect x="240" y="38" width="40" height="12" fill="#ef4444" opacity="0.15" rx="2" />
        <text x="260" y="46" fill="#ef4444" fontSize="4.5" fontFamily="monospace" opacity="0.6" textAnchor="middle">ARROW 2</text>

        {/* Layer 2: David's Sling (mid) */}
        <line x1="20" y1="80" x2="280" y2="80" stroke="#3b82f6" strokeWidth="0.3" opacity="0.2" strokeDasharray="4,6" />
        <text x="10" y="78" fill="#3b82f6" fontSize="4.5" fontFamily="monospace" opacity="0.4">MID ALT</text>
        <rect x="230" y="73" width="50" height="12" fill="#3b82f6" opacity="0.15" rx="2" />
        <text x="255" y="81" fill="#3b82f6" fontSize="4.5" fontFamily="monospace" opacity="0.6" textAnchor="middle">DAVID'S SLING</text>

        {/* Layer 1: Iron Dome (low) */}
        <line x1="20" y1="115" x2="280" y2="115" stroke="#22c55e" strokeWidth="0.3" opacity="0.2" strokeDasharray="4,6" />
        <text x="10" y="113" fill="#22c55e" fontSize="4.5" fontFamily="monospace" opacity="0.4">LOW ALT</text>
        <rect x="230" y="108" width="50" height="12" fill="#22c55e" opacity="0.15" rx="2" />
        <text x="255" y="116" fill="#22c55e" fontSize="4.5" fontFamily="monospace" opacity="0.6" textAnchor="middle">IRON DOME</text>

        {/* Incoming threats at different layers */}
        <circle cx="50" cy="15" r="3" fill="#a855f7" opacity="0.5" className="mini-radar-blip" />
        <circle cx="70" cy="45" r="3" fill="#ef4444" opacity="0.5" className="mini-radar-blip" />
        <circle cx="40" cy="80" r="3" fill="#3b82f6" opacity="0.5" className="mini-radar-blip" />
        <circle cx="60" cy="115" r="3" fill="#22c55e" opacity="0.5" className="mini-radar-blip" />

        {/* Intercept lines */}
        <line x1="240" y1="15" x2="55" y2="15" stroke="#a855f7" strokeWidth="0.5" opacity="0.15" strokeDasharray="2,4" />
        <line x1="240" y1="45" x2="75" y2="45" stroke="#ef4444" strokeWidth="0.5" opacity="0.15" strokeDasharray="2,4" />
        <line x1="230" y1="80" x2="45" y2="80" stroke="#3b82f6" strokeWidth="0.5" opacity="0.15" strokeDasharray="2,4" />
        <line x1="230" y1="115" x2="65" y2="115" stroke="#22c55e" strokeWidth="0.5" opacity="0.15" strokeDasharray="2,4" />
      </svg>
    </div>
  );
}

// ============================================================
// DEFENSE ANIMATIONS — Show the defense system intercepting a threat
// ============================================================

function TamirInterceptAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 160" width="300" height="160" className="overflow-visible">
        {/* Ground */}
        <line x1="0" y1="150" x2="300" y2="150" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />

        {/* City silhouette */}
        <rect x="220" y="130" width="15" height="20" fill="#334155" opacity="0.5" rx="1" />
        <rect x="238" y="125" width="12" height="25" fill="#334155" opacity="0.5" rx="1" />
        <rect x="253" y="135" width="10" height="15" fill="#334155" opacity="0.5" rx="1" />
        <text x="230" y="145" fill="#94a3b8" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">CITY</text>

        {/* Iron Dome battery */}
        <rect x="40" y="140" width="30" height="10" fill="#22c55e" opacity="0.3" rx="2" />
        <rect x="48" y="135" width="14" height="8" fill="#22c55e" opacity="0.4" rx="1" />
        <line x1="55" y1="135" x2="55" y2="125" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
        <text x="55" y="158" fill="#22c55e" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">IRON DOME</text>

        {/* Incoming drone */}
        <g className="brief-drone-approach">
          <circle r="3" fill="#eab308" opacity="0.8" />
          <circle r="6" fill="none" stroke="#eab308" strokeWidth="0.5" opacity="0.3" className="mini-radar-blip" />
        </g>

        {/* Tamir interceptor trail */}
        <line x1="55" y1="125" x2="170" y2="60" stroke="#22c55e" strokeWidth="1.5" opacity="0" className="tamir-launch-line" />

        {/* Intercept flash */}
        <circle cx="170" cy="60" r="0" fill="#22c55e" opacity="0" className="tamir-intercept-flash" />
      </svg>
    </div>
  );
}

function DavidsSlingInterceptAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 160" width="300" height="160" className="overflow-visible">
        <line x1="0" y1="150" x2="300" y2="150" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />
        {/* City */}
        <rect x="220" y="130" width="15" height="20" fill="#334155" opacity="0.5" rx="1" />
        <rect x="238" y="125" width="12" height="25" fill="#334155" opacity="0.5" rx="1" />
        <text x="235" y="145" fill="#94a3b8" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">CITY</text>
        {/* David's Sling battery */}
        <rect x="35" y="138" width="35" height="12" fill="#3b82f6" opacity="0.3" rx="2" />
        <rect x="45" y="132" width="16" height="9" fill="#3b82f6" opacity="0.4" rx="1" />
        <line x1="53" y1="132" x2="53" y2="120" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
        <text x="53" y="158" fill="#3b82f6" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">DAVID'S SLING</text>
        {/* Incoming cruise missile - low alt approach */}
        <g className="brief-drone-approach">
          <circle r="3" fill="#3b82f6" opacity="0.8" />
          <circle r="6" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" className="mini-radar-blip" />
        </g>
        {/* Stunner interceptor trail */}
        <line x1="53" y1="120" x2="170" y2="60" stroke="#3b82f6" strokeWidth="1.5" opacity="0" className="tamir-launch-line" />
        {/* Intercept flash */}
        <circle cx="170" cy="60" r="0" fill="#3b82f6" opacity="0" className="tamir-intercept-flash" />
      </svg>
    </div>
  );
}

function Arrow2InterceptAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 160" width="300" height="160" className="overflow-visible">
        <line x1="0" y1="150" x2="300" y2="150" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />
        {/* Upper atmosphere line */}
        <line x1="0" y1="40" x2="300" y2="40" stroke="#ef4444" strokeWidth="0.3" opacity="0.08" strokeDasharray="4,6" />
        <text x="6" y="38" fill="#ef4444" fontSize="4.5" fontFamily="monospace" opacity="0.2">UPPER ATMOSPHERE</text>
        {/* City */}
        <rect x="220" y="130" width="15" height="20" fill="#334155" opacity="0.5" rx="1" />
        <rect x="238" y="125" width="12" height="25" fill="#334155" opacity="0.5" rx="1" />
        <text x="235" y="145" fill="#94a3b8" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">CITY</text>
        {/* Arrow 2 battery */}
        <rect x="35" y="138" width="35" height="12" fill="#ef4444" opacity="0.3" rx="2" />
        <rect x="45" y="132" width="16" height="9" fill="#ef4444" opacity="0.4" rx="1" />
        <line x1="53" y1="132" x2="53" y2="118" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
        <text x="53" y="158" fill="#ef4444" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">ARROW 2</text>
        {/* Incoming ballistic — descending from upper right */}
        <g className="brief-ballistic-descend">
          <circle r="3" fill="#ef4444" opacity="0.8" />
          <circle r="6" fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.3" className="mini-radar-blip" />
        </g>
        {/* Arrow interceptor trail going up */}
        <line x1="53" y1="118" x2="200" y2="35" stroke="#ef4444" strokeWidth="1.5" opacity="0" className="tamir-launch-line" />
        {/* Intercept flash */}
        <circle cx="200" cy="35" r="0" fill="#ef4444" opacity="0" className="tamir-intercept-flash" />
      </svg>
    </div>
  );
}

function Arrow3InterceptAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 160" width="300" height="160" className="overflow-visible">
        <line x1="0" y1="150" x2="300" y2="150" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />
        {/* Space boundary */}
        <line x1="0" y1="25" x2="300" y2="25" stroke="#a855f7" strokeWidth="0.3" opacity="0.08" strokeDasharray="4,6" />
        <text x="6" y="22" fill="#a855f7" fontSize="4.5" fontFamily="monospace" opacity="0.2">SPACE (EXO-ATMOSPHERE)</text>
        {/* City */}
        <rect x="220" y="130" width="15" height="20" fill="#334155" opacity="0.5" rx="1" />
        <rect x="238" y="125" width="12" height="25" fill="#334155" opacity="0.5" rx="1" />
        <text x="235" y="145" fill="#94a3b8" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">CITY</text>
        {/* Arrow 3 battery */}
        <rect x="35" y="138" width="35" height="12" fill="#a855f7" opacity="0.3" rx="2" />
        <rect x="45" y="132" width="16" height="9" fill="#a855f7" opacity="0.4" rx="1" />
        <line x1="53" y1="132" x2="53" y2="115" stroke="#a855f7" strokeWidth="2" opacity="0.6" />
        <text x="53" y="158" fill="#a855f7" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">ARROW 3</text>
        {/* Incoming from space */}
        <g className="brief-space-descend">
          <circle r="3" fill="#a855f7" opacity="0.8" />
          <circle r="6" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" className="mini-radar-blip" />
        </g>
        {/* Arrow 3 going to space */}
        <line x1="53" y1="115" x2="210" y2="20" stroke="#a855f7" strokeWidth="1.5" opacity="0" className="tamir-launch-line" />
        {/* Intercept flash */}
        <circle cx="210" cy="20" r="0" fill="#a855f7" opacity="0" className="tamir-intercept-flash" />
      </svg>
    </div>
  );
}

function WaveTacticsAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 130" width="300" height="130" className="overflow-visible">
        <line x1="0" y1="120" x2="300" y2="120" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />
        {/* City */}
        <rect x="230" y="100" width="15" height="20" fill="#334155" opacity="0.5" rx="1" />
        <rect x="248" y="95" width="12" height="25" fill="#334155" opacity="0.5" rx="1" />
        <text x="245" y="115" fill="#94a3b8" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">CITY</text>
        {/* Multiple incoming threats — wave visualization */}
        {/* Drones low */}
        <circle cx="30" cy="95" r="3" fill="#eab308" opacity="0.6" className="mini-radar-blip" />
        <circle cx="55" cy="100" r="3" fill="#eab308" opacity="0.6" className="mini-radar-blip" />
        <line x1="30" y1="95" x2="245" y2="105" stroke="#eab308" strokeWidth="0.3" opacity="0.2" strokeDasharray="2,3" />
        <line x1="55" y1="100" x2="245" y2="105" stroke="#eab308" strokeWidth="0.3" opacity="0.2" strokeDasharray="2,3" />
        {/* Cruise mid */}
        <circle cx="20" cy="60" r="3" fill="#3b82f6" opacity="0.6" className="mini-radar-blip" />
        <line x1="20" y1="60" x2="245" y2="105" stroke="#3b82f6" strokeWidth="0.3" opacity="0.2" strokeDasharray="2,3" />
        {/* Ballistic high */}
        <circle cx="80" cy="15" r="3" fill="#ef4444" opacity="0.6" className="mini-radar-blip" />
        <line x1="80" y1="15" x2="245" y2="105" stroke="#ef4444" strokeWidth="0.3" opacity="0.2" strokeDasharray="2,3" />
        {/* Wave label */}
        <text x="150" y="10" fill="#22c55e" fontSize="5" textAnchor="middle" opacity="0.25" fontFamily="monospace">MIXED WAVE INCOMING</text>
        {/* Defense batteries */}
        <rect x="200" y="110" width="20" height="8" fill="#22c55e" opacity="0.3" rx="1" />
        <text x="210" y="128" fill="#22c55e" fontSize="4" fontFamily="monospace" opacity="0.35" textAnchor="middle">DEF</text>
      </svg>
    </div>
  );
}

function FinalStandAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 130" width="300" height="130" className="overflow-visible">
        <line x1="0" y1="120" x2="300" y2="120" stroke="#22c55e" strokeWidth="0.5" opacity="0.2" />
        {/* City */}
        <rect x="230" y="100" width="15" height="20" fill="#334155" opacity="0.5" rx="1" />
        <rect x="248" y="95" width="12" height="25" fill="#334155" opacity="0.5" rx="1" />
        <text x="245" y="115" fill="#94a3b8" fontSize="5" fontFamily="monospace" opacity="0.4" textAnchor="middle">CITY</text>
        {/* Massive incoming salvos from all directions */}
        {[
          { cx: 15, cy: 30, color: '#ef4444' },
          { cx: 35, cy: 15, color: '#ef4444' },
          { cx: 50, cy: 45, color: '#3b82f6' },
          { cx: 25, cy: 70, color: '#f97316' },
          { cx: 70, cy: 20, color: '#a855f7' },
          { cx: 10, cy: 90, color: '#eab308' },
          { cx: 60, cy: 80, color: '#eab308' },
          { cx: 45, cy: 55, color: '#ef4444' },
          { cx: 80, cy: 50, color: '#3b82f6' },
          { cx: 90, cy: 10, color: '#a855f7' },
        ].map((t, i) => (
          <g key={i}>
            <circle cx={t.cx} cy={t.cy} r="2.5" fill={t.color} opacity="0.5" className="mini-radar-blip" />
            <line x1={t.cx} y1={t.cy} x2="245" y2="105" stroke={t.color} strokeWidth="0.2" opacity="0.15" strokeDasharray="2,4" />
          </g>
        ))}
        {/* Warning text */}
        <text x="150" y="10" fill="#ef4444" fontSize="5" textAnchor="middle" opacity="0.35" fontFamily="monospace">MASSIVE SALVO INCOMING</text>
        {/* Ammo warning */}
        <text x="150" y="125" fill="#f97316" fontSize="4.5" textAnchor="middle" opacity="0.3" fontFamily="monospace">LOW AMMO WARNING</text>
      </svg>
    </div>
  );
}

function ResourceMgmtAnimation() {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 300 110" width="300" height="110" className="overflow-visible">
        {/* Ammo bars */}
        <text x="20" y="15" fill="#f97316" fontSize="5" fontFamily="monospace" opacity="0.4">INTERCEPTOR RESERVES</text>
        {/* Iron Dome */}
        <text x="20" y="32" fill="#22c55e" fontSize="5" fontFamily="monospace" opacity="0.5">IRON DOME</text>
        <rect x="85" y="25" width="180" height="8" fill="#1e293b" rx="2" />
        <rect x="85" y="25" width="60" height="8" fill="#22c55e" opacity="0.5" rx="2" />
        <text x="270" y="32" fill="#22c55e" fontSize="5" fontFamily="monospace" opacity="0.4">33%</text>
        {/* David's Sling */}
        <text x="20" y="50" fill="#3b82f6" fontSize="5" fontFamily="monospace" opacity="0.5">DAVID'S SLING</text>
        <rect x="85" y="43" width="180" height="8" fill="#1e293b" rx="2" />
        <rect x="85" y="43" width="36" height="8" fill="#3b82f6" opacity="0.5" rx="2" />
        <text x="270" y="50" fill="#3b82f6" fontSize="5" fontFamily="monospace" opacity="0.4">20%</text>
        {/* Arrow 2 */}
        <text x="20" y="68" fill="#ef4444" fontSize="5" fontFamily="monospace" opacity="0.5">ARROW 2</text>
        <rect x="85" y="61" width="180" height="8" fill="#1e293b" rx="2" />
        <rect x="85" y="61" width="27" height="8" fill="#ef4444" opacity="0.5" rx="2" />
        <text x="270" y="68" fill="#ef4444" fontSize="5" fontFamily="monospace" opacity="0.4">15%</text>
        {/* Arrow 3 */}
        <text x="20" y="86" fill="#a855f7" fontSize="5" fontFamily="monospace" opacity="0.5">ARROW 3</text>
        <rect x="85" y="79" width="180" height="8" fill="#1e293b" rx="2" />
        <rect x="85" y="79" width="18" height="8" fill="#a855f7" opacity="0.5" rx="2" />
        <text x="270" y="86" fill="#a855f7" fontSize="5" fontFamily="monospace" opacity="0.4">10%</text>
        {/* Critical warning */}
        <text x="150" y="105" fill="#ef4444" fontSize="5" textAnchor="middle" opacity="0.3" fontFamily="monospace">MAKE EVERY SHOT COUNT</text>
      </svg>
    </div>
  );
}

// ============================================================
// Animation lookup maps
// ============================================================
const THREAT_ANIMATIONS = {
  drone: DroneAnimation,
  rocket: RocketAnimation,
  cruise: CruiseMissileAnimation,
  ballistic: BallisticMissileAnimation,
  hypersonic: HypersonicMissileAnimation,
  layered: LayeredDefenseAnimation,
  final_stand: FinalStandAnimation,
};

const DEFENSE_ANIMATIONS = {
  iron_dome: TamirInterceptAnimation,
  davids_sling: DavidsSlingInterceptAnimation,
  arrow_2: Arrow2InterceptAnimation,
  arrow_3: Arrow3InterceptAnimation,
  wave_tactics: WaveTacticsAnimation,
  resource_mgmt: ResourceMgmtAnimation,
};

// ============================================================
// BRIEFING SOUND EFFECTS — Web Audio API procedural sounds
// Subtle tactical audio cues for the dossier experience
// ============================================================
let _audioCtx = null;
const getAudioCtx = () => {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
};

const briefingSounds = {
  // Document reveal: short "tick" click (typewriter-like)
  docReveal: (volume = 0.08) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch(e) {}
  },

  // Phase transition: radar ping sweep
  phasePing: (volume = 0.06) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
  },

  // Quiz correct: ascending double beep
  quizCorrect: (volume = 0.1) => {
    try {
      const ctx = getAudioCtx();
      [0, 0.1].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(i === 0 ? 523 : 784, ctx.currentTime + delay); // C5, G5
        gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.12);
      });
    } catch(e) {}
  },

  // Quiz wrong: descending buzz
  quizWrong: (volume = 0.08) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch(e) {}
  },
};

// ============================================================
// BRIEFING ICONS — Monochrome SVG icons for fact cards
// Replaces emoji bullets with military-style pictograms
// ============================================================
const ICON_SVG = {
  // Cities & population
  city: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><rect x="2" y="8" width="5" height="10" rx="0.5"/><rect x="8" y="3" width="5" height="15" rx="0.5"/><rect x="14" y="6" width="4" height="12" rx="0.5"/><line x1="4" y1="11" x2="6" y2="11"/><line x1="4" y1="14" x2="6" y2="14"/><line x1="10" y1="6" x2="12" y2="6"/><line x1="10" y1="9" x2="12" y2="9"/><line x1="10" y1="12" x2="12" y2="12"/></svg>,
  // People / population
  people: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="7" cy="6" r="2.5"/><circle cx="14" cy="6" r="2.5"/><path d="M2 17c0-3 2.5-5 5-5s5 2 5 5"/><path d="M10 17c0-3 2-5 4-5s4 2 4 5"/></svg>,
  // Alert / siren
  alert: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 2v2M3 10H1M19 10h-2M4.9 4.9l1.4 1.4M15.1 4.9l-1.4 1.4"/><circle cx="10" cy="10" r="4"/><circle cx="10" cy="10" r="1.5" fill={c}/></svg>,
  // Rocket / missile
  rocket: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 2c0 0-5 4-5 11h10c0-7-5-11-5-11z"/><path d="M7 13l-2 5h2l1-2 1 2h2l1-2 1 2h2l-2-5"/></svg>,
  // Shield / defense
  shield: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 2L3 6v5c0 4 3.5 6.5 7 8 3.5-1.5 7-4 7-8V6L10 2z"/><path d="M7.5 10l2 2 3.5-4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  // Factory / industry
  factory: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M2 18V8l4-3v5l4-3v5l4-3v8H2z"/><rect x="15" y="4" width="3" height="14"/><line x1="16.5" y1="2" x2="16.5" y2="4"/></svg>,
  // Target / crosshair
  target: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3"/><line x1="10" y1="1" x2="10" y2="5"/><line x1="10" y1="15" x2="10" y2="19"/><line x1="1" y1="10" x2="5" y2="10"/><line x1="15" y1="10" x2="19" y2="10"/></svg>,
  // Radar / satellite dish
  radar: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 18V10"/><path d="M6 18h8"/><path d="M4 10a6 6 0 0112 0"/><path d="M7 10a3 3 0 016 0"/><circle cx="10" cy="10" r="1" fill={c}/></svg>,
  // Money / cost
  money: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><line x1="10" y1="2" x2="10" y2="18"/><path d="M14 6c0-1.7-1.8-3-4-3S6 4.3 6 6s1.8 2.5 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3"/></svg>,
  // Map / geography
  map: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M3 3l5 2v12l-5-2V3z"/><path d="M8 5l5-2v12l-5 2V5z"/><path d="M13 3l5 2v12l-5-2V3z"/></svg>,
  // Plane / aircraft
  plane: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 2L8 8H2l2 3-1 7h2l5-4 5 4h2l-1-7 2-3h-6L10 2z"/></svg>,
  // Explosion / impact
  explosion: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 1l2 5 5-1-3 4 4 3-5 1 1 5-4-3-4 3 1-5-5-1 4-3-3-4 5 1z"/></svg>,
  // Clock / time
  clock: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="10" cy="10" r="8"/><path d="M10 5v5l3.5 2" strokeLinecap="round"/></svg>,
  // Brain / intelligence
  brain: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 18V10"/><path d="M10 10C10 6 7 3 5 4s-1 5 1 6"/><path d="M10 10c0-4 3-7 5-6s1 5-1 6"/><circle cx="6" cy="6" r="2"/><circle cx="14" cy="6" r="2"/></svg>,
  // Pin / location
  pin: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 18s-6-5.7-6-10a6 6 0 0112 0c0 4.3-6 10-6 10z"/><circle cx="10" cy="8" r="2"/></svg>,
  // Anchor / port
  anchor: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="10" cy="4" r="2"/><line x1="10" y1="6" x2="10" y2="18"/><path d="M4 14c0 3 2.7 4 6 4s6-1 6-4"/><line x1="6" y1="10" x2="14" y2="10"/></svg>,
  // Flag / nation
  flag: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><line x1="4" y1="2" x2="4" y2="18"/><path d="M4 3h10l-3 4 3 4H4"/></svg>,
  // Water / desalination
  water: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 2c0 0-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z"/></svg>,
  // Lightning / power
  lightning: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M11 1L5 11h5l-1 8 6-10h-5z" fill={c} fillOpacity="0.15"/></svg>,
  // Nuclear / hazard
  nuclear: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="10" cy="10" r="2"/><path d="M10 2a8 8 0 014 1.5L10 10"/><path d="M18 14a8 8 0 01-4 1.5L10 10"/><path d="M2 14a8 8 0 010-4l8 0"/></svg>,
  // Building / government
  building: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M3 18V8l7-6 7 6v10H3z"/><rect x="8" y="12" width="4" height="6"/><line x1="3" y1="8" x2="17" y2="8"/></svg>,
  // Mountain / terrain
  mountain: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M1 18l6-12 3 4 4-8 5 16H1z"/></svg>,
  // Swarm / multiple
  swarm: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="5" cy="5" r="2"/><circle cx="14" cy="4" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="4" cy="14" r="2"/><circle cx="15" cy="13" r="2"/></svg>,
  // Spy / intelligence
  spy: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="10" cy="7" r="5"/><path d="M3 9h14"/><circle cx="7.5" cy="7" r="1.5"/><circle cx="12.5" cy="7" r="1.5"/><path d="M6 16c0-2 2-3.5 4-3.5s4 1.5 4 3.5"/></svg>,
  // Eagle / military
  eagle: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 3L3 10l3 0-2 4h4l2 3 2-3h4l-2-4 3 0z"/></svg>,
  // Link / chain
  link: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M8 12l4-4"/><path d="M6.5 8.5l-2 2a3.5 3.5 0 005 5l2-2"/><path d="M13.5 11.5l2-2a3.5 3.5 0 00-5-5l-2 2"/></svg>,
  // Globe / worldwide
  globe: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="10" cy="10" r="8"/><ellipse cx="10" cy="10" rx="3.5" ry="8"/><line x1="2" y1="10" x2="18" y2="10"/></svg>,
  // Handshake / coalition
  handshake: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M2 10l4-4 4 2 4-2 4 4"/><path d="M6 10l4 4 4-4"/></svg>,
  // Space / orbit
  space: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><circle cx="10" cy="10" r="2" fill={c}/><ellipse cx="10" cy="10" rx="8" ry="3" transform="rotate(-30 10 10)"/><ellipse cx="10" cy="10" rx="8" ry="3" transform="rotate(30 10 10)"/></svg>,
  // Laser / beam
  laser: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M4 16l6-8 6 8"/><line x1="10" y1="8" x2="10" y2="2"/><circle cx="10" cy="2" r="1.5" fill={c} fillOpacity="0.3"/><line x1="6" y1="4" x2="8" y2="6"/><line x1="14" y1="4" x2="12" y2="6"/></svg>,
  // Rain / weather
  rain: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M5 10a4 4 0 018-1h1a3 3 0 010 6H5a3 3 0 010-6z"/><line x1="7" y1="16" x2="6" y2="18"/><line x1="10" y1="16" x2="9" y2="18"/><line x1="13" y1="16" x2="12" y2="18"/></svg>,
  // Ruler / measurement
  ruler: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><rect x="2" y="7" width="16" height="6" rx="1"/><line x1="5" y1="7" x2="5" y2="10"/><line x1="8" y1="7" x2="8" y2="11"/><line x1="11" y1="7" x2="11" y2="10"/><line x1="14" y1="7" x2="14" y2="11"/></svg>,
  // Numbers / data
  numbers: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><rect x="2" y="2" width="16" height="16" rx="2"/><line x1="2" y1="8" x2="18" y2="8"/><line x1="2" y1="14" x2="18" y2="14"/><line x1="10" y1="2" x2="10" y2="18"/></svg>,
  // Eye / surveillance
  eye: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="3"/><circle cx="10" cy="10" r="1" fill={c}/></svg>,
  // Calendar / date
  calendar: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><rect x="3" y="4" width="14" height="13" rx="1.5"/><line x1="3" y1="8" x2="17" y2="8"/><line x1="7" y1="2" x2="7" y2="5"/><line x1="13" y1="2" x2="13" y2="5"/></svg>,
  // Fuel / gas
  fuel: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><rect x="3" y="4" width="9" height="14" rx="1"/><path d="M12 8l3-2v8l-1 1"/><circle cx="14.5" cy="14" r="1.5"/><line x1="5" y1="11" x2="10" y2="11"/></svg>,
  // Computer / tech
  computer: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><rect x="2" y="3" width="16" height="11" rx="1.5"/><line x1="6" y1="17" x2="14" y2="17"/><line x1="10" y1="14" x2="10" y2="17"/></svg>,
  // Mosque / religious
  mosque: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M10 2c0 0-6 4-6 8v8h12v-8c0-4-6-8-6-8z"/><line x1="10" y1="2" x2="10" y2="0.5"/><circle cx="10" cy="0.5" r="0.8" fill={c}/><rect x="8" y="13" width="4" height="5"/></svg>,
  // Rotate / cycle
  rotate: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M14 3l2 2-2 2"/><path d="M16 5H8a5 5 0 000 10h1"/><path d="M6 17l-2-2 2-2"/><path d="M4 15h8a5 5 0 000-10h-1"/></svg>,
  // Lab / research
  lab: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M7 2h6v5l4 9H3l4-9V2z"/><line x1="6" y1="13" x2="14" y2="13"/><line x1="7" y1="2" x2="13" y2="2"/></svg>,
  // Beach / coastal
  beach: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><path d="M2 14c2-1 4 1 6 0s4 1 6 0 4 1 4 0"/><line x1="14" y1="4" x2="14" y2="14"/><path d="M14 4c0 0-6 1-6 5h6"/></svg>,
  // Grain / farming
  grain: (c) => <svg viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" className="w-4 h-4"><line x1="10" y1="18" x2="10" y2="6"/><path d="M10 6c-3-4-6-2-6-2s2 3 6 2"/><path d="M10 6c3-4 6-2 6-2s-2 3-6 2"/><path d="M10 10c-3-3-5-1-5-1s1 3 5 1"/><path d="M10 10c3-3 5-1 5-1s-1 3-5 1"/></svg>,
};

// Map each emoji to an SVG icon key
const EMOJI_TO_ICON = {
  '🏘️': 'city', '🏗️': 'city', '🏙️': 'city', '🏖️': 'beach',
  '🌾': 'grain', '👥': 'people', '🚨': 'alert',
  '🚀': 'rocket', '🔢': 'numbers', '💰': 'money',
  '🛡️': 'shield', '🏭': 'factory', '🧠': 'brain',
  '📍': 'pin', '⚓': 'anchor', '🏔️': 'mountain',
  '🇮🇷': 'flag', '🇷🇺': 'flag', '🇾🇪': 'flag',
  '📡': 'radar', '📏': 'ruler', '🐝': 'swarm',
  '🎯': 'target', '🕌': 'mosque', '📐': 'ruler',
  '✈️': 'plane', '💻': 'computer', '👁️': 'eye',
  '🗺️': 'map', '⛽': 'fuel', '💧': 'water',
  '⚡': 'lightning', '☢️': 'nuclear', '🏛️': 'building',
  '💥': 'explosion', '📅': 'calendar',
  '🕵️': 'spy', '🛩️': 'plane', '🦅': 'eagle',
  '⏱️': 'clock', '🌌': 'space', '🌐': 'globe',
  '🔗': 'link', '🌍': 'globe',
  '🤝': 'handshake', '🔦': 'laser', '🔬': 'lab',
  '🌧️': 'rain', '🔄': 'rotate',
};

// Render either SVG icon or fallback to emoji
const BriefingIcon = ({ emoji, color }) => {
  const iconKey = EMOJI_TO_ICON[emoji];
  const iconFn = iconKey && ICON_SVG[iconKey];
  if (iconFn) {
    return <span className="flex-shrink-0 mt-0.5 opacity-70">{iconFn(color)}</span>;
  }
  return <span className="text-base flex-shrink-0">{emoji}</span>;
};

// ============================================================
// PHASE 1: Threat Briefing (Generic, data-driven)
// ============================================================
function ThreatBriefingPhase({ data, onComplete, onSkip }) {
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const bullets = data.bullets;
  const basePath = import.meta.env.BASE_URL || '/missile-defense/';

  useEffect(() => {
    const timers = bullets.map((_, i) =>
      setTimeout(() => { setVisibleBullets(i + 1); briefingSounds.docReveal(); }, (i + 1) * 2500)
    );
    const allBulletsTime = bullets.length * 2500;
    const readyTimer = setTimeout(() => setCanContinue(true), allBulletsTime + 2000);
    return () => { timers.forEach(clearTimeout); clearTimeout(readyTimer); };
  }, [bullets]);

  return (
    <div className="flex flex-col gap-2">
      {/* Hero image with big stat */}
      {data.heroImage && (
        <div className="relative rounded-xl overflow-hidden flex-shrink-0">
          <div
            className="w-full h-[220px]"
            style={{ background: `url('${basePath}images/${data.heroImage}') center center / cover no-repeat` }}
          />
          <div
            className="absolute inset-0 flex flex-col justify-end"
            style={{ padding: '18px 22px', background: 'linear-gradient(to bottom, rgba(10,14,26,0.15) 0%, rgba(10,14,26,0.3) 40%, rgba(10,14,26,0.88) 100%)' }}
          >
            {data.heroCaption && (
              <div className="absolute top-3 left-4 text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: `${data.color}bb` }}>
                {data.heroCaption}
              </div>
            )}
            <div className="font-mono font-black text-[52px] leading-none tracking-tight" style={{ color: data.color, textShadow: `0 0 40px ${data.color}40` }}>
              {data.heroStat}
            </div>
            <div className="font-mono text-[15px] text-gray-100 mt-1.5 leading-relaxed tracking-wide">
              {data.heroLabel}
            </div>
          </div>
        </div>
      )}

      {/* Fact cards */}
      <div className="flex flex-col gap-1.5">
        {bullets.map((bullet, i) => {
          const isVisible = i < visibleBullets;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg bg-gray-900/55 border border-gray-800/80 ${
                isVisible ? 'dossier-reveal' : 'opacity-0'
              }`}
              style={isVisible ? {
                '--accent-color': data.color,
                '--accent-glow': `${data.color}40`,
                animationDelay: '0s',
              } : undefined}
            >
              <BriefingIcon emoji={bullet.icon} color={data.color} />
              <div className="flex-1 min-w-0">
                <span className="font-mono font-bold text-sm tracking-wide" style={{ color: data.color }}>{bullet.stat}</span>
                <span className="text-[13px] font-mono text-gray-400 ml-2">{bullet.detail}</span>
              </div>
            </div>
          );
        })}
      </div>

      <CountdownBar duration={25} onComplete={onComplete} paused={false} />

      <div className="flex items-center justify-center gap-3">
        {canContinue && (
          <button
            onClick={onComplete}
            className="px-8 py-2.5 bg-green-900/30 border border-green-700 text-green-400
              font-mono text-sm tracking-widest rounded-lg
              hover:bg-green-900/50 hover:border-green-400
              transition-all active:scale-95 cursor-pointer"
          >
            CONTINUE ▸
          </button>
        )}
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-5 py-2.5 bg-gray-800/60 border border-gray-600 text-gray-400
              font-mono text-xs tracking-widest rounded-lg
              hover:bg-gray-700/80 hover:border-gray-400 hover:text-gray-300
              transition-all active:scale-95 cursor-pointer"
          >
            SKIP BRIEFING ▸
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// THREAT PROFILES — Compact tactical stats for defense phase
// ============================================================
const THREAT_PROFILES = {
  1: { threat: 'QASSAM ROCKET', system: 'IRON DOME', speed: '~Mach 1', range: '5-45 km', cost: '$800', altitude: '< 10 km', systemCost: '$50K' },
  2: { threat: 'ATTACK DRONE', system: 'IRON DOME', speed: '185 km/h', range: '2,500 km', cost: '$20K', altitude: '0.1-2 km', systemCost: '$50K' },
  3: { threat: 'CRUISE MISSILE', system: "DAVID'S SLING", speed: '~Mach 0.8', range: '1,600 km', cost: '$500K', altitude: '< 1 km', systemCost: '$1M' },
  4: { threat: 'BALLISTIC MISSILE', system: 'ARROW 2', speed: 'Mach 7+', range: '2,000 km', cost: '$5M', altitude: '50+ km', systemCost: '$3M' },
  5: { threat: 'HYPERSONIC GLIDE', system: 'ARROW 3', speed: 'Mach 5-20', range: '1,500+ km', cost: '$10M+', altitude: '100+ km', systemCost: '$2-3M' },
  6: { threat: 'MULTI-FRONT', system: 'ALL LAYERS', speed: 'Varies', range: '5-2,500 km', cost: 'Varies', altitude: '0-100+ km', systemCost: 'Varies' },
  7: { threat: 'SATURATION ATTACK', system: 'ALL LAYERS', speed: 'Simultaneous', range: 'All origins', cost: '$80-100M', altitude: 'All layers', systemCost: '$1.35B' },
};

// ============================================================
// PHASE 2: Defense Briefing (Generic, data-driven)
// ============================================================
function DefenseBriefingPhase({ data, onComplete, onSkip, level }) {
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const bullets = data.bullets;
  const profile = THREAT_PROFILES[level];
  const basePath = import.meta.env.BASE_URL || '/missile-defense/';

  useEffect(() => {
    const timers = bullets.map((_, i) =>
      setTimeout(() => { setVisibleBullets(i + 1); briefingSounds.docReveal(); }, (i + 1) * 2000)
    );
    const allBulletsTime = bullets.length * 2000;
    const readyTimer = setTimeout(() => setCanContinue(true), allBulletsTime + 2000);
    return () => { timers.forEach(clearTimeout); clearTimeout(readyTimer); };
  }, [bullets]);

  return (
    <div className="flex flex-col gap-2">
      {/* Hero image with defense stat */}
      {data.heroImage && (
        <div className="relative rounded-xl overflow-hidden flex-shrink-0">
          <div
            className="w-full h-[200px]"
            style={{ background: `url('${basePath}images/${data.heroImage}') center 35% / cover no-repeat` }}
          />
          <div
            className="absolute inset-0 flex flex-col justify-end"
            style={{ padding: '16px 22px', background: 'linear-gradient(to bottom, rgba(10,14,26,0.15) 0%, rgba(10,14,26,0.35) 40%, rgba(10,14,26,0.9) 100%)' }}
          >
            {data.heroCaption && (
              <div className="absolute top-3 left-4 text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: `${data.color}bb` }}>
                {data.heroCaption}
              </div>
            )}
            <div className="font-mono font-black text-[48px] leading-none tracking-tight" style={{ color: data.color, textShadow: `0 0 40px ${data.color}35` }}>
              {data.heroStat}
            </div>
            <div className="font-mono text-[15px] text-gray-100 mt-1.5 leading-relaxed tracking-wide">
              {data.heroLabel}
            </div>
          </div>
        </div>
      )}

      {/* Threat Profile Bar */}
      {profile && (
        <div className="px-3.5 py-2 rounded-lg bg-gray-900/60 flex items-center justify-between gap-2 text-[10px] font-mono"
          style={{ border: `1px solid ${data.color}25` }}>
          <div className="flex items-center gap-2">
            <span className="tracking-[0.18em] text-gray-500">SPEED</span>
            <span className="font-bold" style={{ color: data.color }}>{profile.speed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="tracking-[0.18em] text-gray-500">RANGE</span>
            <span className="font-bold" style={{ color: data.color }}>{profile.range}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="tracking-[0.18em] text-gray-500">ALT</span>
            <span className="font-bold" style={{ color: data.color }}>{profile.altitude}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="tracking-[0.18em] text-gray-500">COST</span>
            <span className="font-bold" style={{ color: data.color }}>{profile.cost}</span>
          </div>
        </div>
      )}

      {/* Fact cards */}
      <div className="flex flex-col gap-1.5">
        {bullets.map((bullet, i) => {
          const isVisible = i < visibleBullets;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg bg-gray-900/55 border border-gray-800/80 ${
                isVisible ? 'dossier-reveal' : 'opacity-0'
              }`}
              style={isVisible ? {
                '--accent-color': data.color,
                '--accent-glow': `${data.color}40`,
                animationDelay: '0s',
              } : undefined}
            >
              <BriefingIcon emoji={bullet.icon} color={data.color} />
              <div className="flex-1 min-w-0">
                <span className="font-mono font-bold text-sm tracking-wide" style={{ color: data.color }}>{bullet.stat}</span>
                <span className="text-[13px] font-mono text-gray-400 ml-2">{bullet.detail}</span>
              </div>
            </div>
          );
        })}
      </div>

      <CountdownBar duration={25} onComplete={onComplete} paused={false} />

      <div className="flex items-center justify-center gap-3">
        {canContinue && (
          <button
            onClick={onComplete}
            className="px-8 py-2.5 bg-green-900/30 border border-green-700 text-green-400
              font-mono text-sm tracking-widest rounded-lg
              hover:bg-green-900/50 hover:border-green-400
              transition-all active:scale-95 cursor-pointer"
          >
            CONTINUE ▸
          </button>
        )}
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-5 py-2.5 bg-gray-800/60 border border-gray-600 text-gray-400
              font-mono text-xs tracking-widest rounded-lg
              hover:bg-gray-700/80 hover:border-gray-400 hover:text-gray-300
              transition-all active:scale-95 cursor-pointer"
          >
            SKIP BRIEFING ▸
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PHASE 3: Intel Check (Quiz) — UNCHANGED
// ============================================================
function IntelCheckPhase({ level, shownFactIds, onComplete, onSkip }) {
  const [questions] = useState(() => getRandomQuestions(level, 2, shownFactIds));
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);
  const answeredRef = useRef(false);
  // Use refs for values needed in setTimeout callbacks to avoid stale closures
  const totalPointsRef = useRef(0);
  const currentQRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const quizConfig = QUIZ_DATA[level] || { timePerQuestion: 15, pointsPerCorrect: 50 };

  // Advance to next question or complete quiz — uses refs only so it never changes identity
  const doAdvance = useCallback((earnedPoints) => {
    const newTotal = totalPointsRef.current + earnedPoints;
    totalPointsRef.current = newTotal;
    setTotalPoints(newTotal);

    if (currentQRef.current + 1 >= questions.length) {
      onCompleteRef.current(newTotal);
    } else {
      const nextQ = currentQRef.current + 1;
      currentQRef.current = nextQ;
      setCurrentQ(nextQ);
    }
  }, [questions]);

  // Per-question timer — only re-runs when currentQ changes (new question)
  useEffect(() => {
    answeredRef.current = false;
    setTimeLeft(quizConfig.timePerQuestion);
    setSelectedAnswer(null);
    setShowResult(false);

    const startTime = performance.now();
    timerRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const remaining = Math.max(0, quizConfig.timePerQuestion - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0 && !answeredRef.current) {
        clearInterval(timerRef.current);
        answeredRef.current = true;
        briefingSounds.quizWrong();
        setShowResult(true);
        // Auto-advance after showing timeout result (0 points earned)
        setTimeout(() => doAdvance(0), 3500);
      }
    }, 100);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentQ, doAdvance, quizConfig]);

  const handleAnswer = useCallback((index) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(index);
    const q = questions[currentQRef.current];
    const correct = index === q.correctIndex;
    const earned = correct ? quizConfig.pointsPerCorrect : 0;

    if (correct) briefingSounds.quizCorrect();
    else briefingSounds.quizWrong();

    setShowResult(true);
    setTimeout(() => doAdvance(earned), 3500);
  }, [questions, quizConfig, doAdvance]);

  if (questions.length === 0) {
    onComplete(0);
    return null;
  }

  const q = questions[currentQ];
  const isCorrect = selectedAnswer === q.correctIndex;
  const timedOut = showResult && selectedAnswer === null;
  const pct = (timeLeft / quizConfig.timePerQuestion) * 100;

  return (
    <div>
      <div className="text-center mb-2">
        <div className="font-mono text-base font-black tracking-[0.2em] text-cyan-400"
          style={{ textShadow: '0 0 20px rgba(6,182,212,0.2)' }}>
          READINESS CHECK
        </div>
        <div className="font-mono text-[10px] tracking-[0.15em] mt-0.5"
          style={{ color: 'rgba(6,182,212,0.44)' }}>
          QUESTION {currentQ + 1} OF {questions.length} · +{quizConfig.pointsPerCorrect} PER CORRECT
        </div>
      </div>

      {/* Timer bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ease-linear ${
              timeLeft < 5 ? 'bg-red-500' : timeLeft < 10 ? 'bg-yellow-500' : 'bg-cyan-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-right mt-1">
          <span className={`font-mono text-xs tabular-nums ${
            timeLeft < 5 ? 'text-red-400' : 'text-gray-500'
          }`}>
            {Math.ceil(timeLeft)}s
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="text-base font-mono text-gray-200 mb-4 text-center leading-relaxed">
        {q.question}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-1.5 max-w-lg mx-auto">
        {q.options.map((option, i) => {
          const letter = String.fromCharCode(65 + i);
          let borderColor = '#1e2736';
          let bgColor = 'rgba(17,24,39,0.55)';
          let keyBg = 'rgba(6,182,212,0.15)';
          let keyBorder = 'rgba(6,182,212,0.25)';
          let keyColor = '#06b6d4';
          let keyText = letter;
          let textColor = '#d1d5db';

          if (showResult) {
            if (i === q.correctIndex) {
              borderColor = '#22c55e';
              bgColor = 'rgba(34,197,94,0.1)';
              keyBg = 'rgba(34,197,94,0.2)';
              keyBorder = 'rgba(34,197,94,0.38)';
              keyColor = '#22c55e';
              keyText = '✓';
              textColor = '#22c55e';
            } else if (i === selectedAnswer && !isCorrect) {
              borderColor = '#ef4444';
              bgColor = 'rgba(239,68,68,0.1)';
              keyBg = 'rgba(239,68,68,0.2)';
              keyBorder = 'rgba(239,68,68,0.38)';
              keyColor = '#ef4444';
              keyText = '✗';
              textColor = '#ef4444';
            } else {
              borderColor = '#1e2736';
              bgColor = 'rgba(17,24,39,0.3)';
              textColor = '#6b7280';
              keyColor = '#4b5563';
              keyBg = 'rgba(75,85,99,0.15)';
              keyBorder = 'rgba(75,85,99,0.25)';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showResult}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl font-mono transition-all duration-200
                ${showResult ? 'cursor-default' : 'cursor-pointer hover:opacity-80 active:scale-[0.98]'}
              `}
              style={{
                background: bgColor,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                style={{
                  background: keyBg,
                  border: `1px solid ${keyBorder}`,
                  color: keyColor,
                }}>
                {keyText}
              </div>
              <span className="text-[13px] text-left" style={{ color: textColor }}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div className="mt-2.5 px-3.5 py-2.5 rounded-lg" style={{
          background: timedOut ? 'rgba(234,179,8,0.06)' : isCorrect ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
          border: `1px solid ${timedOut ? 'rgba(234,179,8,0.15)' : isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
        }}>
          <div className="font-mono text-[11px] font-bold tracking-[0.15em] mb-1"
            style={{ color: timedOut ? '#eab308' : isCorrect ? '#22c55e' : '#ef4444' }}>
            {timedOut ? "TIME'S UP" : isCorrect ? `✓ CORRECT — +${quizConfig.pointsPerCorrect} POINTS` : '✗ INCORRECT'}
          </div>
          <div className="font-mono text-xs text-gray-400 leading-relaxed">{q.explanation}</div>
        </div>
      )}

      {/* Points tracker */}
      <div className="mt-3 flex justify-center gap-4">
        <div className="text-center">
          <div className="font-mono text-lg font-black text-green-400">{totalPoints}</div>
          <div className="font-mono text-[8px] text-gray-500 tracking-[0.15em] mt-0.5">QUIZ POINTS</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-black text-green-400">{currentQ + (showResult ? 1 : 0)}/{questions.length}</div>
          <div className="font-mono text-[8px] text-gray-500 tracking-[0.15em] mt-0.5">ANSWERED</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PHASE 4: Field Exercise (Mini-game) — Data-driven
// Two-step workflow: (1) click threat to select, (2) press shortcut to fire
// Mimics actual game controls to orient the player
// ============================================================
function FieldExercisePhase({ config, onComplete }) {
  // Build threats array — backwards compat with single-threat configs
  const threats = config.exerciseThreats || [{
    systemName: config.systemName || 'IRON DOME',
    shortcut: config.shortcut || '1',
    threatLabel: config.threatLabel || 'DRONE',
    threatColor: config.threatColor || '#eab308',
    startX: 30,
    startY: 55,
  }];
  const isMultiThreat = threats.length > 1;

  // State machine: waiting → selected → fired → intercepted → (next or complete)
  const [threatIndex, setThreatIndex] = useState(0);
  const [step, setStep] = useState('waiting');
  const [threatProgress, setThreatProgress] = useState(0);
  const [trailProgress, setTrailProgress] = useState(0);
  const [showStepFlash, setShowStepFlash] = useState(false);
  const animRef = useRef(null);
  const stepRef = useRef('waiting');
  const threatIndexRef = useRef(0);

  // Current threat config
  const current = threats[threatIndex];
  const {
    systemName = 'IRON DOME',
    shortcut = '1',
    threatLabel = 'DRONE',
    threatColor = '#eab308',
    startX = 30,
    startY = 55,
  } = current;

  // City target for trajectory
  const cityX = 250;
  const cityY = 55;

  // Keep refs in sync
  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => { threatIndexRef.current = threatIndex; }, [threatIndex]);

  // Threat flies toward city — stops when fired
  const threatStopped = step === 'fired' || step === 'intercepted' || step === 'complete';
  useEffect(() => {
    if (threatStopped) return;
    const startTime = performance.now();
    const duration = 25000;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(1, elapsed / duration);
      setThreatProgress(p);

      if (p >= 1) {
        setTimeout(() => onComplete(), 2000);
        return;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [threatStopped, threatIndex]);

  // Trail animation after firing
  const isFired = step === 'fired';
  useEffect(() => {
    if (!isFired) return;
    const startTime = performance.now();
    const duration = 600;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(1, elapsed / duration);
      setTrailProgress(p);

      if (p >= 1) {
        setStep('intercepted');
        setTimeout(() => {
          const idx = threatIndexRef.current;
          if (idx < threats.length - 1) {
            // More threats — advance to next
            setThreatIndex(idx + 1);
            setStep('waiting');
            setThreatProgress(0);
            setTrailProgress(0);
          } else {
            // All done
            setStep('complete');
            setTimeout(() => onComplete(), 2500);
          }
        }, 800);
        return;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isFired]);

  // Listen for keyboard shortcut to fire (only when threat is selected)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const cur = threats[threatIndexRef.current];
      if (cur && e.key === cur.shortcut && stepRef.current === 'selected') {
        e.preventDefault();
        setStep('fired');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click on threat to select it
  const handleSelectThreat = useCallback(() => {
    if (step !== 'waiting') return;
    setStep('selected');
    setShowStepFlash(true);
    setTimeout(() => setShowStepFlash(false), 600);
  }, [step]);

  // Click fire button (fallback for keyboard)
  const handleFireClick = useCallback(() => {
    if (step !== 'selected') return;
    setStep('fired');
  }, [step]);

  // Threat position — interpolate from start toward city
  const threatX = startX + threatProgress * (cityX - startX);
  const threatY = startY + threatProgress * (cityY - startY);

  // Battery position
  const batteryX = 130;
  const batteryY = 145;

  // Trail endpoint (where threat currently is)
  const trailEndX = batteryX + (threatX - batteryX) * trailProgress;
  const trailEndY = batteryY + (threatY - batteryY) * trailProgress;

  const isSelected = step === 'selected';

  // Determine interceptor color from system
  const interceptorColor = threatColor === '#eab308' ? '#22c55e' : threatColor;
  const batteryColor = interceptorColor;

  const threatId = `T${threatIndex + 1}`;

  return (
    <div>
      <div className="text-center mb-3">
        <div className="text-xs text-gray-500 font-mono tracking-[0.4em] mb-1">FIELD EXERCISE</div>
        <h2 className="text-xl font-bold font-mono text-green-400 tracking-wider">WEAPONS TRAINING</h2>
        <div className="text-xs text-gray-600 font-mono mt-1">Practice the two-step intercept procedure</div>
      </div>

      {/* Threat counter for multi-threat exercises */}
      {isMultiThreat && (
        <div className="text-center mb-2">
          <span className="text-xs font-mono text-gray-500 tracking-widest">
            THREAT {threatIndex + 1} OF {threats.length}
          </span>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex gap-2 mb-4 max-w-sm mx-auto">
        <div className={`flex-1 py-1 text-center font-mono text-[10px] tracking-wider rounded-sm border transition-all duration-300 ${
          step === 'waiting'
            ? 'border-yellow-600 bg-yellow-900/30 text-yellow-400 phase-active-pulse'
            : step === 'selected' || step === 'fired' || step === 'intercepted' || step === 'complete'
            ? 'border-green-800 bg-green-900/20 text-green-700'
            : 'border-gray-800 bg-gray-900/30 text-gray-700'
        }`}>
          STEP 1: SELECT TARGET
        </div>
        <div className={`flex-1 py-1 text-center font-mono text-[10px] tracking-wider rounded-sm border transition-all duration-300 ${
          step === 'selected'
            ? 'border-yellow-600 bg-yellow-900/30 text-yellow-400 phase-active-pulse'
            : step === 'fired' || step === 'intercepted' || step === 'complete'
            ? 'border-green-800 bg-green-900/20 text-green-700'
            : 'border-gray-800 bg-gray-900/30 text-gray-700'
        }`}>
          STEP 2: FIRE
        </div>
      </div>

      {/* Instruction prompt — changes per step */}
      <div className={`mb-3 p-3 rounded-lg border text-center font-mono transition-all duration-300 ${
        step === 'waiting'
          ? 'border-yellow-700 bg-yellow-900/20'
          : step === 'selected'
          ? 'border-green-700 bg-green-900/20'
          : 'border-gray-800 bg-gray-900/20'
      } ${showStepFlash ? 'quiz-correct-flash' : ''}`}>
        {step === 'waiting' && (
          <>
            <div className="text-yellow-400 text-sm font-bold tracking-wider mb-1 animate-pulse">
              ▼ CLICK ON THE {threatLabel} TO SELECT IT ▼
            </div>
            <div className="text-xs text-gray-500 tracking-wider">
              In the game, you must click a threat before you can fire
            </div>
          </>
        )}
        {step === 'selected' && (
          <>
            <div className="text-green-400 text-sm font-bold tracking-wider mb-1 animate-pulse">
              TARGET SELECTED — NOW PRESS {shortcut} TO FIRE {systemName}
            </div>
            <div className="text-xs text-gray-500 tracking-wider">
              Or click the {systemName} button below
            </div>
          </>
        )}
        {step === 'fired' && (
          <div className="text-green-400 text-sm font-bold tracking-wider animate-pulse">
            INTERCEPTOR LAUNCHED...
          </div>
        )}
        {step === 'intercepted' && (
          <>
            <div className="text-green-300 text-lg font-bold tracking-wider">
              ✓ TARGET DESTROYED
            </div>
            <div className="text-xs text-gray-500 mt-1 tracking-widest">
              {threatIndex < threats.length - 1
                ? 'NEXT THREAT INCOMING...'
                : `${systemName} INTERCEPTION SUCCESSFUL`
              }
            </div>
          </>
        )}
        {step === 'complete' && (
          <>
            <div className="text-green-400 text-lg font-bold tracking-wider">
              TRAINING COMPLETE
            </div>
            <div className="text-xs text-gray-500 mt-1 tracking-widest">
              PROCEEDING TO COMBAT OPERATIONS...
            </div>
          </>
        )}
      </div>

      {/* Mini radar */}
      <div className="flex justify-center mb-3">
        <svg viewBox="0 0 300 170" width="360" height="200" className="overflow-visible">
          {/* Background grid */}
          <rect x="0" y="0" width="300" height="170" fill="#0a0e1a" rx="8" stroke="#1e293b" strokeWidth="0.5" />

          {/* Range rings */}
          <circle cx="150" cy="100" r="40" fill="none" stroke="#1e293b" strokeWidth="0.3" />
          <circle cx="150" cy="100" r="80" fill="none" stroke="#1e293b" strokeWidth="0.3" />
          <circle cx="150" cy="100" r="120" fill="none" stroke="#1e293b" strokeWidth="0.3" />

          {/* City target area */}
          <rect x="240" y="35" width="20" height="30" fill="#334155" opacity="0.4" rx="2" />
          <rect x="255" y="30" width="15" height="35" fill="#334155" opacity="0.4" rx="2" />
          <text x="252" y="80" fill="#ef4444" fontSize="7" fontFamily="monospace" opacity="0.6" textAnchor="middle">CITY</text>

          {/* Battery */}
          <rect x={batteryX - 12} y={batteryY - 5} width="24" height="10" fill={batteryColor} opacity="0.4" rx="2" />
          <line x1={batteryX} y1={batteryY - 5} x2={batteryX} y2={batteryY - 15} stroke={batteryColor} strokeWidth="2" opacity="0.5" />
          <text x={batteryX} y={batteryY + 15} fill={batteryColor} fontSize="6" fontFamily="monospace" opacity="0.5" textAnchor="middle">{systemName}</text>

          {/* Incoming threat blip — clickable in 'waiting' step */}
          {step !== 'intercepted' && step !== 'complete' && (
            <g
              onClick={handleSelectThreat}
              className={step === 'waiting' ? 'cursor-pointer' : ''}
            >
              {/* Larger invisible click target */}
              {step === 'waiting' && (
                <circle cx={threatX} cy={threatY} r="20" fill="transparent" />
              )}

              {/* Selection ring (appears when selected) */}
              {isSelected && (
                <>
                  <circle cx={threatX} cy={threatY} r="14" fill="none" stroke={threatColor} strokeWidth="1.5" opacity="0.6" className="mini-radar-blip" />
                  <circle cx={threatX} cy={threatY} r="18" fill="none" stroke={threatColor} strokeWidth="0.5" opacity="0.3" />
                </>
              )}

              {/* Threat blip */}
              <circle cx={threatX} cy={threatY} r="5" fill={threatColor} opacity="0.9" />
              <circle cx={threatX} cy={threatY} r="9" fill="none" stroke={threatColor} strokeWidth="0.5" opacity="0.4" className="mini-radar-blip" />

              {/* Threat label with threat ID (like real game) */}
              <text x={threatX} y={threatY - 14} fill={threatColor} fontSize="7" fontFamily="monospace" opacity="0.8" textAnchor="middle" fontWeight="bold">
                {threatId}
              </text>
              <text x={threatX} y={threatY - 22} fill={threatColor} fontSize="5" fontFamily="monospace" opacity="0.5" textAnchor="middle">
                {threatLabel}
              </text>

              {/* Trajectory line */}
              <line x1={threatX} y1={threatY} x2={cityX} y2={cityY} stroke={threatColor} strokeWidth="0.3" opacity="0.3" strokeDasharray="3,3" />

              {/* Click prompt arrow (only in waiting step) */}
              {step === 'waiting' && threatProgress > 0.05 && (
                <g className="exercise-click-prompt">
                  <text x={threatX} y={threatY + 28} fill={threatColor} fontSize="8" fontFamily="monospace" opacity="0.8" textAnchor="middle">
                    ▲ CLICK
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Interceptor trail — rocket projectile with warhead */}
          {step === 'fired' && (
            <g>
              {/* Fading trail line from battery to warhead */}
              <line
                x1={batteryX}
                y1={batteryY - 15}
                x2={trailEndX}
                y2={trailEndY}
                stroke={batteryColor}
                strokeWidth="1"
                opacity="0.4"
              />
              {/* Bright warhead dot — the projectile */}
              <circle
                cx={trailEndX}
                cy={trailEndY}
                r="3"
                fill="white"
                opacity="0.95"
              />
              {/* Warhead glow */}
              <circle
                cx={trailEndX}
                cy={trailEndY}
                r="5"
                fill={batteryColor}
                opacity="0.4"
              />
              {/* Launch flash at battery (only at start) */}
              {trailProgress < 0.3 && (
                <circle
                  cx={batteryX}
                  cy={batteryY - 15}
                  r={4 + (1 - trailProgress / 0.3) * 6}
                  fill={batteryColor}
                  opacity={(1 - trailProgress / 0.3) * 0.6}
                />
              )}
            </g>
          )}

          {/* Intercept flash */}
          {(step === 'intercepted' || step === 'complete') && (
            <g>
              <circle cx={threatX} cy={threatY} r="12" fill={batteryColor} opacity="0.6" className="exercise-intercept-flash" />
              <circle cx={threatX} cy={threatY} r="6" fill="#fff" opacity="0.8" className="exercise-intercept-flash" />
              {/* Debris particles */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={threatX + Math.cos(angle) * 15}
                    cy={threatY + Math.sin(angle) * 15}
                    r="1.5"
                    fill={i % 2 === 0 ? batteryColor : threatColor}
                    opacity="0.6"
                    className="exercise-debris"
                  />
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Fire button — styled like real ControlPanel, only active when selected */}
      {step !== 'fired' && step !== 'intercepted' && step !== 'complete' && (
        <div className="max-w-xs mx-auto">
          <div className="text-xs text-gray-600 font-mono tracking-widest mb-2 text-center">
            {isSelected ? 'SELECT INTERCEPTOR' : 'SELECT A THREAT FIRST'}
          </div>
          <button
            onClick={handleFireClick}
            disabled={!isSelected}
            className={`
              w-full py-3 px-4 rounded-lg font-mono transition-all relative
              border-2
              ${!isSelected
                ? 'opacity-40 cursor-not-allowed border-gray-800 bg-gray-900/50'
                : 'cursor-pointer active:scale-95 border-gray-700 bg-gray-900/30 hover:border-green-500 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]'
              }
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-bold tracking-wider ${isSelected ? 'text-green-400' : 'text-gray-600'}`}>
                {systemName}
              </span>
              <span
                className={`w-7 h-7 rounded border-2 flex items-center justify-center text-sm font-mono font-bold ${
                  isSelected
                    ? 'border-green-400 text-green-400'
                    : 'border-gray-700 text-gray-700'
                }`}
              >
                {shortcut}
              </span>
            </div>
            <div className="text-center">
              <span className={`text-lg font-bold ${isSelected ? 'text-green-400' : 'text-gray-700'}`}>
                FIRE
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Controls reminder */}
      <div className="mt-3 text-center text-[11px] text-gray-600 font-mono tracking-wider">
        CLICK TARGET &#x2022; PRESS {shortcut} TO FIRE
      </div>

      <CountdownBar duration={isMultiThreat ? 50 : 35} onComplete={onComplete} paused={step === 'complete'} />
    </div>
  );
}

// ============================================================
// Main EducationalBriefing Orchestrator
// ============================================================
// Level names + geographic context for briefing headers
const LEVEL_NAMES = {
  1: { name: 'SOUTHERN FRONT', hebrewName: 'חֲזִית הַדָּרוֹם', subtitle: 'Otef Aza — Gaza Border Communities' },
  2: { name: 'NORTHERN FRONT', hebrewName: 'חֲזִית הַצָּפוֹן', subtitle: 'Galil & Golan Heights' },
  3: { name: 'CENTRAL FRONT', hebrewName: 'חֲזִית הַמֶּרְכָּז', subtitle: 'Tel Aviv — Jerusalem Corridor' },
  4: { name: 'STRATEGIC TARGETS', hebrewName: 'מַטָּרוֹת אִסְטְרָטֶגִיּוֹת', subtitle: 'Defending Critical Infrastructure' },
  5: { name: 'ARMY BASES', hebrewName: 'בְּסִיסֵי צָבָא', subtitle: 'Defending Military Installations' },
  6: { name: 'WAVE ASSAULT', hebrewName: 'מִתְקֶפֶת גַּלִּים', subtitle: 'Coordinated Multi-Front Attack' },
  7: { name: 'APRIL 13', hebrewName: 'שְׁלוֹשָׁה עָשָׂר בְּאַפְּרִיל', subtitle: 'The Night Everything Fired' },
};

// Helper: randomly select N items from an array (Fisher-Yates shuffle)
function selectRandom(arr, count) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

// Per-level briefing accent colors — drives background gradient, borders, and decorative elements
const BRIEFING_ACCENTS = {
  1: { color: '#f97316', label: 'SOUTH' },    // Orange — southern Israel / rockets & Iron Dome
  2: { color: '#eab308', label: 'NORTH' },     // Amber — northern Israel / attack drones
  3: { color: '#3b82f6', label: 'CENTER' },     // Blue — central Israel / cruise missiles & David's Sling
  4: { color: '#ef4444', label: 'STRATEGIC' },  // Red — strategic infrastructure / ballistic & Arrow 2
  5: { color: '#a855f7', label: 'BASES' },      // Purple — army bases / hypersonics & Arrow 3
  6: { color: '#06b6d4', label: 'MULTI' },      // Cyan — multi-front / layered defense
  7: { color: '#f43f5e', label: 'FINAL' },      // Rose — April 13 / cost problem & Iron Beam
};

export default function EducationalBriefing({ level, onComplete }) {
  const content = BRIEFING_CONTENT[level] || BRIEFING_CONTENT[1];
  const phases = content.phases;
  const levelInfo = LEVEL_NAMES[level] || { name: `LEVEL ${level}`, subtitle: '' };
  const briefingAccent = BRIEFING_ACCENTS[level] || BRIEFING_ACCENTS[1];

  const [phase, setPhase] = useState(phases[0]);
  const quizPointsRef = useRef(0);

  // Randomly select facts from each phase's factPool (or use bullets as fallback)
  const { selectedContent, shownFactIds } = (() => {
    const ids = [];
    const result = { ...content };

    if (content.threat) {
      const pool = content.threat.factPool || content.threat.bullets || [];
      const count = content.threat.displayCount || pool.length;
      const chosen = pool.length > count ? selectRandom(pool, count) : pool;
      chosen.forEach(f => { if (f.id) ids.push(f.id); });
      result.threat = { ...content.threat, bullets: chosen };
    }

    if (content.defense) {
      const pool = content.defense.factPool || content.defense.bullets || [];
      const count = content.defense.displayCount || pool.length;
      const chosen = pool.length > count ? selectRandom(pool, count) : pool;
      chosen.forEach(f => { if (f.id) ids.push(f.id); });
      result.defense = { ...content.defense, bullets: chosen };
    }

    return { selectedContent: result, shownFactIds: ids };
  })();

  // Use memoized values so they don't re-randomize on re-render
  const contentRef = useRef(selectedContent);
  const factIdsRef = useRef(shownFactIds);

  // Advance to the next phase in the level's phase list
  const advancePhase = useCallback((currentPhaseKey) => {
    const idx = phases.indexOf(currentPhaseKey);
    if (idx < phases.length - 1) {
      setPhase(phases[idx + 1]);
      briefingSounds.phasePing();
    } else {
      // Last phase completed
      onComplete({ quizPoints: quizPointsRef.current });
    }
  }, [phases, onComplete]);

  const handleThreatComplete = useCallback(() => {
    advancePhase('threat');
  }, [advancePhase]);

  const handleDefenseComplete = useCallback(() => {
    advancePhase('defense');
  }, [advancePhase]);

  const handleQuizComplete = useCallback((points) => {
    quizPointsRef.current = points;
    advancePhase('quiz');
  }, [advancePhase]);

  const handleExerciseComplete = useCallback(() => {
    advancePhase('exercise');
  }, [advancePhase]);

  // Skip entire briefing — forfeits all quiz points
  const handleSkipBriefing = useCallback(() => {
    onComplete({ quizPoints: 0 });
  }, [onComplete]);

  const quizBasePath = import.meta.env.BASE_URL || '/missile-defense/';
  const quizHeroImage = contentRef.current?.threat?.heroImage || 'ID1.jpg';

  return (
    <div
      className="h-screen flex flex-col relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 100%, ${briefingAccent.color}18 0%, transparent 50%),
          radial-gradient(ellipse at 0% 0%, ${briefingAccent.color}10 0%, transparent 40%),
          radial-gradient(ellipse at 100% 50%, ${briefingAccent.color}08 0%, transparent 35%),
          linear-gradient(180deg, #0a0e1a 0%, #080c17 100%)
        `,
      }}
    >
      {/* Quiz phase background photo */}
      {phase === 'quiz' && (
        <>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `url('${quizBasePath}images/${quizHeroImage}') center center / cover no-repeat` }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom,
                rgba(10,14,26,0.45) 0%,
                rgba(10,14,26,0.6) 25%,
                rgba(10,14,26,0.85) 55%,
                #0a0e1a 100%
              )`,
            }} />
        </>
      )}
      {/* Decorative background grid — parallax shift on phase change */}
      {phase !== 'quiz' && (
      <div
        className={`absolute inset-0 pointer-events-none briefing-grid-phase-${phases.indexOf(phase)}`}
        style={{
          backgroundImage: `
            linear-gradient(${briefingAccent.color}15 1px, transparent 1px),
            linear-gradient(90deg, ${briefingAccent.color}15 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
        }}
      />
      )}
      {/* Accent glow bar at top — visible color strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${briefingAccent.color}60, transparent)` }}
      />
      {/* Corner accent — bottom-left classification stamp */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div
          className="font-mono text-[9px] tracking-[0.4em] px-2 py-0.5 rounded border"
          style={{
            color: `${briefingAccent.color}70`,
            borderColor: `${briefingAccent.color}35`,
            background: `${briefingAccent.color}12`,
          }}
        >
          LVL {level} — {briefingAccent.label}
        </div>
      </div>

      <div className="max-w-2xl w-full mx-auto px-4 pt-2 pb-0.5 flex-shrink-0 relative z-10">
        {/* Header — clear level briefing title */}
        <div className="text-center mb-1.5 pr-20">
          <h1 className="text-xl lg:text-2xl font-bold font-mono tracking-wider"
            style={{ color: briefingAccent.color }}>
            LEVEL {level} BRIEFING
          </h1>
          <div className="flex items-baseline justify-center gap-2 mt-0.5">
            <span className="text-xs lg:text-sm font-mono tracking-widest"
              style={{ color: `${briefingAccent.color}90` }}>
              {levelInfo.name}
            </span>
            {levelInfo.hebrewName && (
              <span className="text-xs lg:text-sm font-bold"
                style={{ fontFamily: 'Arial, sans-serif', color: `${briefingAccent.color}70` }}>
                {levelInfo.hebrewName}
              </span>
            )}
          </div>
        </div>

        {/* Phase progress bar */}
        <div className="pr-20">
          <PhaseBar currentPhase={phase} phases={phases} />
        </div>
      </div>

      {/* Phase content — scrollable if needed */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-2xl w-full mx-auto px-4 pb-2">
          {phase === 'threat' && contentRef.current.threat && (
            <ThreatBriefingPhase data={contentRef.current.threat} onComplete={handleThreatComplete} onSkip={handleSkipBriefing} />
          )}
          {phase === 'defense' && contentRef.current.defense && (
            <DefenseBriefingPhase data={contentRef.current.defense} onComplete={handleDefenseComplete} onSkip={handleSkipBriefing} level={level} />
          )}
          {phase === 'quiz' && (
            <IntelCheckPhase level={level} shownFactIds={factIdsRef.current} onComplete={handleQuizComplete} onSkip={handleSkipBriefing} />
          )}
          {phase === 'exercise' && content.exerciseConfig && (
            <FieldExercisePhase config={content.exerciseConfig} onComplete={handleExerciseComplete} />
          )}
        </div>
      </div>

    </div>
  );
}

