import { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomQuestions, QUIZ_DATA } from '../config/quizData.js';

// ============================================================
// BRIEFING_CONTENT — All level-specific content for all 7 levels
// ============================================================
const BRIEFING_CONTENT = {
  1: {
    phases: ['threat', 'defense', 'quiz', 'exercise'],
    threat: {
      title: 'SOUTHERN ISRAEL',
      hebrewTitle: 'דְּרוֹם יִשְׂרָאֵל',
      subtitle: 'Communities in the Line of Fire',
      color: '#f97316',
      displayCount: 3,
      factPool: [
        { id: 'l1t1', icon: '🏘️', text: 'Sderot (pop. ~35,000) sits less than a mile (1 km) from the Gaza fence — when a rocket launches, residents have approximately 15 seconds of warning before impact' },
        { id: 'l1t2', icon: '🏗️', text: 'Ashkelon (pop. ~150,000) is a coastal city 8 miles (13 km) from Gaza — home to a major power station and desalination plant, making it both a civilian center and a strategic target' },
        { id: 'l1t3', icon: '🏙️', text: 'Beersheba (pop. ~210,000) is the capital of the Negev, 25 miles (40 km) from Gaza — home to Ben-Gurion University and Soroka Hospital, the region\'s only Level 1 trauma center' },
        { id: 'l1t4', icon: '🌾', text: 'The "Gaza Envelope" includes over 50 small farming communities within 4 miles (7 km) of the border — including Kfar Aza, Be\'eri, and Nir Oz, which were attacked on October 7, 2023' },
        { id: 'l1t5', icon: '👥', text: 'Over one million Israelis — roughly 12% of the population — live within rocket range of Gaza. During major escalations, daily life across the entire south grinds to a halt' },
        { id: 'l1t6', icon: '🚨', text: 'The "Color Red" (Tzeva Adom) alert system warns residents by siren and smartphone app — in border towns like Sderot, it can sound dozens of times in a single day during conflict' },
      ],
      animation: 'rocket',
    },
    defense: {
      title: 'ROCKETS & IRON DOME',
      hebrewTitle: 'כִּפַּת בַּרְזֶל',
      subtitle: 'The Cheapest Threat, The Smartest Shield',
      color: '#22c55e',
      displayCount: 3,
      factPool: [
        { id: 'l1d1', icon: '🚀', text: 'Qassam rockets are built in Gaza from sugar, fertilizer, and metal pipes — costing about $800 each. They are completely unguided and cannot steer after launch' },
        { id: 'l1d2', icon: '🔢', text: 'Over 20,000 rockets and mortars have been fired from Gaza since 2001 — with a range of 3-28 miles (5-45 km), they can strike anywhere from Sderot to Beersheba' },
        { id: 'l1d3', icon: '💰', text: 'A Qassam costs ~$800 to build; the Tamir interceptor that destroys it costs ~$50,000 — this 62:1 cost ratio is itself a strategic weapon for the attacker' },
        { id: 'l1d4', icon: '🛡️', text: 'Iron Dome became operational in 2011 with a 90%+ success rate — it calculates each rocket\'s trajectory and only fires if it threatens a populated area, saving interceptors for real threats' },
        { id: 'l1d5', icon: '🏭', text: 'Developed by Rafael Advanced Defense Systems with US backing — each Iron Dome battery has a radar unit, control center, and 3-4 launchers, enough to protect a medium-sized city' },
        { id: 'l1d6', icon: '🧠', text: 'Iron Dome\'s "selective fire" is its secret weapon — by letting rockets headed for open fields pass harmlessly, it saves its limited Tamir interceptors for the rockets that truly threaten lives' },
      ],
      animation: 'iron_dome',
    },
    exerciseConfig: {
      threatType: 'rocket',
      systemKey: 'iron_dome',
      systemName: 'IRON DOME',
      shortcut: '1',
      threatLabel: 'ROCKET',
      threatColor: '#f97316',
    },
  },

  2: {
    phases: ['threat', 'defense', 'quiz'],
    threat: {
      title: 'NORTHERN ISRAEL',
      hebrewTitle: 'צְפוֹן יִשְׂרָאֵל',
      subtitle: 'The Northern Border Under Threat',
      color: '#eab308',
      displayCount: 3,
      factPool: [
        { id: 'l2t1', icon: '🏘️', text: 'Kiryat Shmona (pop. ~24,000) sits just 3 miles (5 km) from the Lebanese border — in October 2023, the entire city was evacuated and residents couldn\'t return for over a year' },
        { id: 'l2t2', icon: '📍', text: 'Metula (pop. ~2,000) is Israel\'s northernmost town — literally built against the border fence. Its residents can see Hezbollah positions from their backyards' },
        { id: 'l2t3', icon: '⚓', text: 'Haifa (pop. ~285,000, metro ~1 million) is Israel\'s third-largest city and main port — Hezbollah fired over 4,000 rockets at northern Israel during the 2006 war, many aimed at Haifa' },
        { id: 'l2t4', icon: '🏖️', text: 'Nahariya (pop. ~60,000) is a coastal city just 6 miles (10 km) from the Lebanese border — during the 2006 war, rockets struck its hospital, and it has been targeted in every northern conflict' },
        { id: 'l2t5', icon: '👥', text: 'Over 80,000 northern residents were evacuated in October 2023 and couldn\'t return for over a year — communities remained empty while cross-border rocket and drone fire continued' },
        { id: 'l2t6', icon: '🏔️', text: 'The Galilee holds the Sea of Galilee — Israel\'s largest freshwater lake — plus major farmland. Hezbollah\'s arsenal of 150,000+ rockets puts all of northern Israel at risk' },
      ],
      animation: 'drone',
    },
    defense: {
      title: 'ATTACK DRONES',
      hebrewTitle: 'כטב"מ תַּקִּיפָה',
      subtitle: 'Slow, Cheap, and Deadly in Swarms',
      color: '#eab308',
      displayCount: 3,
      factPool: [
        { id: 'l2d1', icon: '🇮🇷', text: 'Iran manufactures the Shahed-136 "kamikaze" drone and supplies it to Hezbollah and allied groups — the drone IS the weapon, crashing directly into its target and detonating on impact' },
        { id: 'l2d2', icon: '📡', text: 'Attack drones cruise at 300-6,000 feet (100-2,000 m) and fly slow (~115 mph / 185 km/h) — they hug the terrain to avoid radar, making them harder to detect than rockets or missiles' },
        { id: 'l2d3', icon: '📏', text: 'The Shahed-136 has a range of 1,550 miles (2,500 km) — launched from Iran, it takes 7+ hours to reach Israel, but from Lebanon the flight time is just minutes' },
        { id: 'l2d4', icon: '🐝', text: 'Drones are launched in swarms of 10-50+ to overwhelm air defenses — even if most are shot down, the few that get through can strike power plants, radar stations, or airfields' },
        { id: 'l2d5', icon: '💰', text: 'At ~$20,000 each, drones are 2.5× cheaper than the interceptors used to destroy them — attackers can afford to lose dozens while draining the defender\'s missile supply' },
        { id: 'l2d6', icon: '🎯', text: 'Unlike unguided Qassam rockets, drones use GPS navigation and can be pre-programmed to hit specific buildings — turning a cheap weapon into a precision-guided threat' },
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
      factPool: [
        { id: 'l3t1', icon: '🏙️', text: 'Tel Aviv (pop. ~460,000, metro 4+ million) is Israel\'s economic engine — home to the stock exchange, most major tech companies, and the country\'s busiest cultural scene' },
        { id: 'l3t2', icon: '🕌', text: 'Jerusalem (pop. ~1 million) is holy to Judaism, Christianity, and Islam — home to the Western Wall, Church of the Holy Sepulchre, and Al-Aqsa Mosque, making it one of the most sensitive targets on Earth' },
        { id: 'l3t3', icon: '📐', text: 'At its narrowest point near Netanya, Israel is just 9 miles (15 km) wide — a cruise missile launched from the east could cross the entire country in under a minute' },
        { id: 'l3t4', icon: '✈️', text: 'Ben Gurion Airport near Tel Aviv is Israel\'s only major international airport — missile attacks force it to shut down, instantly cutting the country off from the outside world' },
        { id: 'l3t5', icon: '👥', text: 'Nearly 5 million people — close to half of Israel\'s population — live in the narrow central corridor between Tel Aviv and Jerusalem, making it the most densely populated target zone' },
        { id: 'l3t6', icon: '💻', text: 'The "Silicon Wadi" tech corridor from Tel Aviv to Herzliya hosts thousands of startups and R&D centers for Google, Apple, and Microsoft — a strike here would ripple through the global tech economy' },
      ],
      animation: 'cruise',
    },
    defense: {
      title: "CRUISE MISSILES & DAVID'S SLING",
      hebrewTitle: 'קֶלַע דָּוִד',
      subtitle: 'Low-Flying Threat, Precision Shield',
      color: '#3b82f6',
      displayCount: 3,
      factPool: [
        { id: 'l3d1', icon: '✈️', text: 'Cruise missiles fly like small aircraft — jet-powered with wings, they hug terrain at low altitude to sneak under radar, and use GPS to strike targets with meter-level accuracy' },
        { id: 'l3d2', icon: '🇮🇷', text: 'Iran\'s Paveh cruise missile has a range of over 1,000 miles (1,600 km) — enough to reach central Israel from deep inside Iranian territory, flying low the entire way' },
        { id: 'l3d3', icon: '📡', text: 'Unlike ballistic missiles that arc high into the sky, cruise missiles stay low and hug the terrain — making them difficult to detect by distant radar until they are within close range' },
        { id: 'l3d4', icon: '🛡️', text: "David's Sling became operational in 2017, filling the gap between Iron Dome and Arrow — it fires Stunner interceptors that use hit-to-kill technology with no explosive warhead" },
        { id: 'l3d5', icon: '👁️', text: "The Stunner has a dual-seeker system — both infrared and radar guidance — allowing it to track and hit maneuvering cruise missiles at ranges of 25-185 miles (40-300 km)" },
        { id: 'l3d6', icon: '🏭', text: "David's Sling was jointly developed by Rafael (Israel) and Raytheon (US). Each Stunner interceptor costs about $1 million — expensive, but far cheaper than what it protects" },
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
      factPool: [
        { id: 'l4t1', icon: '🗺️', text: 'Israel is roughly the size of New Jersey and only 15 km (9 miles) wide at its narrowest point — nearly all critical infrastructure sits along a tiny coastal strip, within range of enemy missiles' },
        { id: 'l4t2', icon: '⛽', text: 'The BAZAN refinery in Haifa Bay supplies about 65% of Israel\'s diesel fuel. In 2016, Hezbollah\'s leader threatened that striking its ammonia tanks would have "the effect of a nuclear bomb" — Israel shut down the ammonia storage facility by 2017' },
        { id: 'l4t3', icon: '💧', text: 'Israel gets over 80% of its drinking water from desalination — the Sorek plant south of Tel Aviv is one of the world\'s largest, providing water for millions. Losing it would create a national crisis within days' },
        { id: 'l4t4', icon: '⚡', text: 'Orot Rabin in Hadera is Israel\'s largest power station at 2,590 megawatts — a single complex powering over a million homes. Israel\'s grid depends on just a handful of plants like this' },
        { id: 'l4t5', icon: '☢️', text: 'The Dimona nuclear reactor in the Negev is one of Iran\'s top stated strategic targets — Iranian missiles landed in the Dimona area during the October 2024 attack on Israel' },
        { id: 'l4t6', icon: '🏛️', text: 'The Kirya in central Tel Aviv is Israel\'s Pentagon — housing IDF headquarters, the Ministry of Defense, and top intelligence offices. In October 2024, an Iranian ballistic missile landed just 500 meters (5 football fields) away' },
      ],
      animation: 'ballistic',
    },
    defense: {
      title: 'BALLISTIC MISSILES & ARROW 2',
      hebrewTitle: 'חֵץ 2',
      subtitle: 'High Arc Threat, High Altitude Shield',
      color: '#ef4444',
      displayCount: 3,
      factPool: [
        { id: 'l4d1', icon: '🎯', text: 'Ballistic missiles follow a high arc into the upper atmosphere, then dive toward their target at extreme speed — Iran\'s Emad and Khorramshahr missiles can reach Israel in under 12 minutes' },
        { id: 'l4d2', icon: '💥', text: 'Iran launched approximately 200 ballistic missiles at Israel in October 2024 — the largest ballistic missile attack in history. Arrow 2 and Arrow 3 intercepted many of them at altitude' },
        { id: 'l4d3', icon: '📅', text: 'Arrow 2 became operational in 2000 — the world\'s first modern anti-ballistic missile system. Iraq\'s 39 Scud strikes on Israel in 1991 made building it a national priority' },
        { id: 'l4d4', icon: '🚀', text: 'Arrow 2 flies at Mach 9 and intercepts at up to 30 miles (50 km) altitude — 5x the cruising altitude of an airliner. It uses a directed fragmentation warhead that destroys targets within a 165-foot (50 m) radius' },
        { id: 'l4d5', icon: '🏭', text: 'Jointly developed by Israel Aerospace Industries (IAI) and Boeing — the US has funded 50-80% of the Arrow program, investing over $2.4 billion since 1989' },
        { id: 'l4d6', icon: '📡', text: 'Paired with the Green Pine radar — able to detect missiles at 300+ miles (500+ km), track 30 targets simultaneously, and guide the Arrow to within 13 feet (4 m) of its target' },
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
      factPool: [
        { id: 'l5t1', icon: '✈️', text: 'Nevatim AFB in the Negev is home to Israel\'s entire F-35 "Adir" stealth fighter fleet — Iran fired missiles directly at it in October 2024, and satellite images showed damage to the base' },
        { id: 'l5t2', icon: '🚀', text: 'Palmachim AFB on the coast is Israel\'s spaceport — it launches satellites, tests Arrow interceptors, and is one of only a handful of orbital launch sites in the world. Israel launches westward over the sea to avoid overflying hostile neighbors' },
        { id: 'l5t3', icon: '🕵️', text: 'Glilot base near Tel Aviv houses Unit 8200, Israel\'s signals intelligence unit — often compared to the NSA. Its alumni have founded hundreds of tech companies worth over $160 billion combined' },
        { id: 'l5t4', icon: '☢️', text: 'Sdot Micha is believed to house Israel\'s Jericho ballistic missiles — the country\'s ultimate strategic deterrent. It has no runway, only underground missile storage, and is itself protected by Arrow batteries' },
        { id: 'l5t5', icon: '🛩️', text: 'Ramat David AFB in the Jezreel Valley is the northernmost fighter base — just 30 miles (50 km) from the Lebanese border, making it Hezbollah\'s first target in any northern war' },
        { id: 'l5t6', icon: '🦅', text: 'Tel Nof AFB near Rehovot houses Israel\'s F-15 long-range strike fleet. Israel was the first country outside the US to fly the F-15 — receiving its first Eagles in 1976' },
      ],
      animation: 'hypersonic',
    },
    defense: {
      title: 'HYPERSONICS & ARROW 3',
      hebrewTitle: 'חֵץ 3',
      subtitle: 'Fastest Threat, Highest Shield',
      color: '#a855f7',
      displayCount: 3,
      factPool: [
        { id: 'l5d1', icon: '⚡', text: 'Hypersonic weapons travel at Mach 5+ — over 3,700 mph. They boost to the edge of space, then glide back while maneuvering, making them nearly impossible to predict' },
        { id: 'l5d2', icon: '⏱️', text: 'A hypersonic weapon at Mach 7 crosses 60 miles (100 km) in about 40 seconds — air friction heats its surface to over 3,600°F, requiring special materials to survive' },
        { id: 'l5d3', icon: '🇷🇺', text: 'Russia, China, Iran, and North Korea are all developing hypersonic weapons — Russia\'s Avangard reportedly reaches Mach 20, and Iran has tested its own Fattah hypersonic missile' },
        { id: 'l5d4', icon: '🌌', text: 'Arrow 3 intercepts threats in space — outside the atmosphere, before reentry. It uses hit-to-kill technology: pure kinetic energy, no explosive warhead needed' },
        { id: 'l5d5', icon: '📏', text: 'Arrow 3 engages threats at altitudes over 62 miles (100 km) — the highest layer of Israeli defense. It was successfully tested against a real target in space in 2019' },
        { id: 'l5d6', icon: '🌐', text: 'Destroying threats in space means debris burns up on reentry — protecting people below. Arrow 3 was developed by IAI with the US Missile Defense Agency' },
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
      factPool: [
        { id: 'l6t1', icon: '🗺️', text: 'Israel faces threats from 5 directions simultaneously — Gaza (southwest), Lebanon (north), Syria (northeast), Iran (east), and Yemen (southeast)' },
        { id: 'l6t2', icon: '🇾🇪', text: 'Yemen\'s Houthi rebels, backed by Iran, have launched ballistic missiles and drones at Israel from over 2,000 km (1,250 miles) away — the farthest threat origin' },
        { id: 'l6t3', icon: '🔗', text: 'Iran\'s "Axis of Resistance" coordinates attacks across all fronts — Gaza, Lebanon, Syria, Iraq, and Yemen can strike simultaneously' },
        { id: 'l6t4', icon: '📐', text: 'Defending 360° is exponentially harder than one front — operators must constantly scan the entire radar for threats from any direction' },
        { id: 'l6t5', icon: '🌍', text: 'Israel is one of the smallest countries facing multi-front missile threats — the entire country is only 290 miles (470 km) long and 85 miles (135 km) wide at its widest' },
        { id: 'l6t6', icon: '⏱️', text: 'A ballistic missile from Iran reaches Israel in under 12 minutes, while a drone from Yemen takes 4+ hours — defenders must handle vastly different timelines' },
      ],
      animation: 'layered',
    },
    defense: {
      title: 'MULTI-LAYERED DEFENSE',
      hebrewTitle: 'הֲגָנָה רַב-שִׁכְבָתִית',
      subtitle: 'Integrated Air Defense Network',
      color: '#a855f7',
      displayCount: 3,
      factPool: [
        { id: 'l6d1', icon: '🛡️', text: 'Israel\'s multi-layered defense assigns each system to specific threat types — Iron Dome for rockets/drones, David\'s Sling for cruise missiles, Arrow for ballistic' },
        { id: 'l6d2', icon: '📡', text: 'The entire system is connected by a unified command network — operators see all threats on one screen regardless of origin direction' },
        { id: 'l6d3', icon: '🎯', text: 'Each interceptor battery protects a zone — multiple batteries spread across the country provide overlapping coverage' },
        { id: 'l6d4', icon: '🧠', text: 'Deciding which threats to intercept and which to let pass (hold fire) becomes critical when threats come from every direction simultaneously' },
        { id: 'l6d5', icon: '📏', text: 'Israel has deployed Iron Dome batteries from Eilat in the south to Haifa in the north — each covering a specific region' },
        { id: 'l6d6', icon: '🔄', text: 'During multi-front attacks, interceptor batteries can be repositioned within hours to reinforce the most threatened areas' },
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
      factPool: [
        { id: 'l7t1', icon: '🚀', text: 'On April 13, 2024, Iran launched over 300 projectiles at Israel — 170+ drones, 30+ cruise missiles, and 120+ ballistic missiles' },
        { id: 'l7t2', icon: '⏱️', text: 'Iran staggered launches — slow drones first, then cruise missiles, then ballistic — all timed to arrive simultaneously for maximum overload' },
        { id: 'l7t3', icon: '🤝', text: 'A coalition of the US, UK, France, and Jordan helped Israel intercept the attack — US Navy destroyers shot down ballistic missiles from the Red Sea' },
        { id: 'l7t4', icon: '🎯', text: '99% of incoming projectiles were intercepted — only a handful of ballistic missiles struck near Nevatim Air Base, causing minor damage' },
        { id: 'l7t5', icon: '🛡️', text: 'All four defense tiers activated simultaneously — Iron Dome, David\'s Sling, Arrow 2, and Arrow 3 each engaged their designated threats' },
        { id: 'l7t6', icon: '💰', text: 'Defending against the April 13 attack cost an estimated $1.35 billion — while Iran\'s total attack cost roughly $80-100 million' },
      ],
      animation: 'final_stand',
    },
    defense: {
      title: 'THE COST PROBLEM',
      hebrewTitle: 'בְּעָיַת הָעֲלוּת',
      subtitle: 'When Defense Costs More Than Attack',
      color: '#f97316',
      displayCount: 3,
      factPool: [
        { id: 'l7d1', icon: '💰', text: 'A Qassam rocket costs $800 to build — the Tamir that destroys it costs $50,000 (a 62:1 cost ratio favoring the attacker)' },
        { id: 'l7d2', icon: '🚀', text: 'An Arrow 3 interceptor costs ~$2-3 million — adversaries can force a launch with a much cheaper decoy missile' },
        { id: 'l7d3', icon: '🔦', text: 'Iron Beam is a laser defense system under development — each shot costs roughly $3.50 in electricity vs $50,000 for a Tamir' },
        { id: 'l7d4', icon: '⚡', text: 'Iron Beam has no ammunition limit — as long as there is power, it can keep firing, eliminating the supply exhaustion problem' },
        { id: 'l7d5', icon: '🌧️', text: 'Iron Beam\'s main limitation is weather — lasers lose effectiveness in heavy cloud cover, rain, or sandstorms' },
        { id: 'l7d6', icon: '🔬', text: 'The US is co-investing in Iron Beam technology — the system could transform missile defense economics worldwide' },
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
  threat: 'TARGETS AT RISK',
  defense: 'THREATS & DEFENSES',
  quiz: 'INTEL CHECK',
  exercise: 'FIELD EXERCISE',
};

// ============================================================
// Phase progress bar — dynamic based on level's phases
// ============================================================
function PhaseBar({ currentPhase, phases }) {
  const phaseIndex = phases.indexOf(currentPhase);
  return (
    <div className="flex gap-1 mb-6">
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
// PHASE 1: Threat Briefing (Generic, data-driven)
// ============================================================
function ThreatBriefingPhase({ data, onComplete }) {
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const bullets = data.bullets;

  useEffect(() => {
    const timers = bullets.map((_, i) =>
      setTimeout(() => setVisibleBullets(i + 1), (i + 1) * 2500)
    );
    const allBulletsTime = bullets.length * 2500;
    const readyTimer = setTimeout(() => setCanContinue(true), allBulletsTime + 2000);
    return () => { timers.forEach(clearTimeout); clearTimeout(readyTimer); };
  }, [bullets]);

  const AnimComponent = THREAT_ANIMATIONS[data.animation] || null;

  return (
    <div>
      <div className="text-center mb-2">
        <div className="text-[10px] text-gray-500 font-mono tracking-[0.4em] mb-0.5">THREAT BRIEFING</div>
        <h2 className="text-xl font-bold font-mono tracking-wider" style={{ color: data.color }}>{data.title}</h2>
        {data.hebrewTitle && (
          <div className="text-lg font-bold mt-0.5" style={{ color: data.color, opacity: 0.75, fontFamily: 'Arial, sans-serif' }}>{data.hebrewTitle}</div>
        )}
        <div className="text-[10px] text-gray-600 font-mono mt-0.5">{data.subtitle}</div>
      </div>

      {AnimComponent && <div className="scale-[0.85] origin-top -mb-3"><AnimComponent /></div>}

      <div className="space-y-1.5 mt-2">
        {bullets.map((bullet, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 p-2 rounded-lg bg-gray-900/50 border border-gray-800 transition-all duration-500 ${
              i < visibleBullets ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <span className="text-sm flex-shrink-0">{bullet.icon}</span>
            <span className="text-xs font-mono text-gray-300 leading-relaxed">{bullet.text}</span>
          </div>
        ))}
      </div>

      <CountdownBar duration={25} onComplete={onComplete} paused={false} />

      {canContinue && (
        <div className="text-center mt-3">
          <button
            onClick={onComplete}
            className="px-8 py-2.5 bg-green-900/30 border border-green-700 text-green-400
              font-mono text-sm tracking-widest rounded-lg
              hover:bg-green-900/50 hover:border-green-400
              transition-all active:scale-95 cursor-pointer"
          >
            CONTINUE ▸
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PHASE 2: Defense Briefing (Generic, data-driven)
// ============================================================
function DefenseBriefingPhase({ data, onComplete }) {
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const bullets = data.bullets;

  useEffect(() => {
    const timers = bullets.map((_, i) =>
      setTimeout(() => setVisibleBullets(i + 1), (i + 1) * 2000)
    );
    const allBulletsTime = bullets.length * 2000;
    const readyTimer = setTimeout(() => setCanContinue(true), allBulletsTime + 2000);
    return () => { timers.forEach(clearTimeout); clearTimeout(readyTimer); };
  }, [bullets]);

  const AnimComponent = DEFENSE_ANIMATIONS[data.animation] || null;

  return (
    <div>
      <div className="text-center mb-2">
        <div className="text-[10px] text-gray-500 font-mono tracking-[0.4em] mb-0.5">DEFENSE BRIEFING</div>
        <h2 className="text-xl font-bold font-mono tracking-wider" style={{ color: data.color }}>{data.title}</h2>
        {data.hebrewTitle && (
          <div className="text-lg font-bold mt-0.5" style={{ color: data.color, opacity: 0.75, fontFamily: 'Arial, sans-serif' }}>{data.hebrewTitle}</div>
        )}
        <div className="text-[10px] text-gray-600 font-mono mt-0.5">{data.subtitle}</div>
      </div>

      {AnimComponent && <div className="scale-[0.85] origin-top -mb-3"><AnimComponent /></div>}

      <div className="space-y-1.5 mt-2">
        {bullets.map((bullet, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 p-2 rounded-lg bg-gray-900/50 border border-gray-800 transition-all duration-500 ${
              i < visibleBullets ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <span className="text-sm flex-shrink-0">{bullet.icon}</span>
            <span className="text-xs font-mono text-gray-300 leading-relaxed">{bullet.text}</span>
          </div>
        ))}
      </div>

      <CountdownBar duration={25} onComplete={onComplete} paused={false} />

      {canContinue && (
        <div className="text-center mt-3">
          <button
            onClick={onComplete}
            className="px-8 py-2.5 bg-green-900/30 border border-green-700 text-green-400
              font-mono text-sm tracking-widest rounded-lg
              hover:bg-green-900/50 hover:border-green-400
              transition-all active:scale-95 cursor-pointer"
          >
            CONTINUE ▸
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PHASE 3: Intel Check (Quiz) — UNCHANGED
// ============================================================
function IntelCheckPhase({ level, shownFactIds, onComplete }) {
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
      <div className="text-center mb-6">
        <div className="text-xs text-gray-500 font-mono tracking-[0.4em] mb-1">INTEL CHECK</div>
        <h2 className="text-xl font-bold font-mono text-cyan-400 tracking-wider">
          QUESTION {currentQ + 1} OF {questions.length}
        </h2>
      </div>

      {/* Timer bar */}
      <div className="mb-6">
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
      <div className="text-lg font-mono text-gray-200 mb-6 text-center leading-relaxed">
        {q.question}
      </div>

      {/* Options */}
      <div className="space-y-2.5 max-w-lg mx-auto">
        {q.options.map((option, i) => {
          let btnClass = 'border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-500 cursor-pointer';
          let indicator = null;

          if (showResult) {
            if (i === q.correctIndex) {
              btnClass = 'border-green-400 bg-green-900/60 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[1.02]';
              indicator = <span className="ml-auto text-green-400 font-bold">✓</span>;
            } else if (i === selectedAnswer && !isCorrect) {
              btnClass = 'border-red-400 bg-red-900/60 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.4)]';
              indicator = <span className="ml-auto text-red-400 font-bold">✗</span>;
            } else {
              btnClass = 'border-gray-800 bg-gray-900/30 text-gray-600';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showResult}
              className={`w-full py-3 px-5 rounded-lg font-mono text-sm tracking-wide
                border-2 transition-all duration-300 ${btnClass}
                ${showResult ? 'cursor-default' : 'active:scale-[0.98]'}
              `}
            >
              <span className="flex items-center">
                <span className="mr-3 text-gray-600">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1">{option}</span>
                {indicator}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div className={`mt-5 p-4 rounded-lg text-center font-mono text-sm ${
          timedOut
            ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-400'
            : isCorrect
            ? 'bg-green-900/30 border border-green-700 text-green-400'
            : 'bg-red-900/30 border border-red-700 text-red-400'
        }`}>
          {timedOut && (
            <>
              <div className="font-bold tracking-wider mb-1">TIME'S UP</div>
              <div className="text-xs text-gray-400">{q.explanation}</div>
            </>
          )}
          {!timedOut && isCorrect && (
            <>
              <div className="font-bold tracking-wider mb-1">✓ CORRECT — +{quizConfig.pointsPerCorrect} PTS</div>
              <div className="text-xs text-gray-400">{q.explanation}</div>
            </>
          )}
          {!timedOut && !isCorrect && (
            <>
              <div className="font-bold tracking-wider mb-1">✗ INCORRECT</div>
              <div className="text-xs text-gray-400">{q.explanation}</div>
            </>
          )}
        </div>
      )}

      {/* Points tracker */}
      <div className="mt-4 text-center">
        <span className="font-mono text-xs text-gray-600 tracking-widest">INTEL SCORE: </span>
        <span className="font-mono text-sm text-cyan-400 font-bold">{totalPoints} PTS</span>
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
      {/* Decorative background grid — visible topographic feel */}
      <div
        className="absolute inset-0 pointer-events-none"
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
      {/* Accent glow bar at top — visible color strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${briefingAccent.color}60, transparent)` }}
      />
      {/* Corner accent — bottom-left classification stamp */}
      <div className="absolute bottom-16 left-4 pointer-events-none">
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

      <div className="max-w-2xl w-full mx-auto px-4 pt-2 pb-1 flex-shrink-0">
        {/* Header — level name prominent, right padding avoids Escape Room timer overlap */}
        <div className="text-center mb-2 pr-48">
          <div
            className="font-mono text-[10px] tracking-[0.5em] mb-0.5"
            style={{ color: `${briefingAccent.color}70` }}
          >
            LEVEL {level} — MISSION BRIEFING
          </div>
          <h1 className="text-xl lg:text-2xl font-bold font-mono tracking-wider mb-0.5"
            style={{ color: briefingAccent.color }}>
            {levelInfo.name}
          </h1>
          {levelInfo.hebrewName && (
            <div className="text-base lg:text-lg font-bold mb-0.5"
              style={{ fontFamily: 'Arial, sans-serif', color: `${briefingAccent.color}BF` }}>
              {levelInfo.hebrewName}
            </div>
          )}
          <div className="text-[10px] lg:text-xs font-mono tracking-widest"
            style={{ color: `${briefingAccent.color}80` }}>
            {levelInfo.subtitle}
          </div>
        </div>

        {/* Phase progress bar — right padding avoids Escape Room timer overlap */}
        <div className="pr-48">
          <PhaseBar currentPhase={phase} phases={phases} />
        </div>
      </div>

      {/* Phase content — scrollable if needed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl w-full mx-auto px-4 pb-4">
          {phase === 'threat' && contentRef.current.threat && (
            <ThreatBriefingPhase data={contentRef.current.threat} onComplete={handleThreatComplete} />
          )}
          {phase === 'defense' && contentRef.current.defense && (
            <DefenseBriefingPhase data={contentRef.current.defense} onComplete={handleDefenseComplete} />
          )}
          {phase === 'quiz' && (
            <IntelCheckPhase level={level} shownFactIds={factIdsRef.current} onComplete={handleQuizComplete} />
          )}
          {phase === 'exercise' && content.exerciseConfig && (
            <FieldExercisePhase config={content.exerciseConfig} onComplete={handleExerciseComplete} />
          )}
        </div>
      </div>

      {/* SKIP button — fixed at bottom center */}
      <div className="flex-shrink-0 py-3 flex justify-center bg-[#0a0e1a]/90 border-t border-gray-800/50">
        <button
          onClick={handleSkipBriefing}
          className="text-gray-300 hover:text-white font-mono text-sm tracking-widest
            transition-all cursor-pointer px-8 py-2.5 rounded-lg
            border-2 border-gray-600 hover:border-gray-400
            bg-gray-800/60 hover:bg-gray-700/80
            active:scale-95"
        >
          SKIP BRIEFING ⚠
        </button>
      </div>
    </div>
  );
}

