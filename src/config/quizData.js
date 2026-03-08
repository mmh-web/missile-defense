// ============================================================
// MISSILE DEFENSE — Quiz Question Bank
// ============================================================
//
// Each level has ~12 questions; 2 are randomly selected per playthrough.
// Every answer to every question is explicitly taught in the briefing
// content that precedes it.
//
// correctIndex: 0-based index into the options array
// linkedFacts: array of fact IDs this question relates to (used to
//   filter questions to match the randomly-shown briefing facts)
// ============================================================

export const QUIZ_DATA = {
  // ─── LEVEL 1: Rockets from Gaza + Iron Dome ──────────────
  1: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l1q1',
        question: 'What year did Iron Dome become operational?',
        options: ['2001', '2006', '2011', '2017'],
        correctIndex: 2,
        explanation: 'Iron Dome became operational in 2011.',
        linkedFacts: ['l1d1'],
      },
      {
        id: 'l1q2',
        question: 'Iron Dome was developed in response to which conflict?',
        options: ['1967 Six-Day War', '1973 Yom Kippur War', '2006 Lebanon War', '2014 Gaza War'],
        correctIndex: 2,
        explanation: 'Development began after the 2006 Lebanon War, when Hezbollah launched thousands of rockets into northern Israel.',
        linkedFacts: ['l1d1'],
      },
      {
        id: 'l1q3',
        question: "What is the name of Iron Dome's interceptor missile?",
        options: ['Arrow', 'Barak', 'Patriot', 'Tamir'],
        correctIndex: 3,
        explanation: 'The Tamir interceptor missile is used by Iron Dome.',
        linkedFacts: ['l1d2'],
      },
      {
        id: 'l1q4',
        question: 'Where are Qassam rockets primarily manufactured?',
        options: ['Iran', 'Lebanon', 'Gaza', 'Syria'],
        correctIndex: 2,
        explanation: 'Qassam rockets are built in Gaza using basic materials like sugar and fertilizer.',
        linkedFacts: ['l1t1'],
      },
      {
        id: 'l1q5',
        question: 'Approximately how much does a single Iron Dome interceptor cost?',
        options: ['~$5,000', '~$50,000', '~$500,000', '~$5,000,000'],
        correctIndex: 1,
        explanation: 'Each Tamir interceptor costs approximately $50,000.',
        linkedFacts: ['l1d2', 'l1t3'],
      },
      {
        id: 'l1q6',
        question: 'Which Israeli city near Gaza has been most targeted by Qassam rockets?',
        options: ['Tel Aviv', 'Haifa', 'Sderot', 'Eilat'],
        correctIndex: 2,
        explanation: 'Sderot, located just 1 km from the Gaza border, has been the most frequently targeted city.',
        linkedFacts: ['l1t2'],
      },
      {
        id: 'l1q7',
        question: 'What makes short-range rockets different from cruise missiles?',
        options: [
          'They are faster',
          'They are unguided \u2014 they cannot steer after launch',
          'They fly at higher altitudes',
          'They carry larger warheads',
        ],
        correctIndex: 1,
        explanation: 'Short-range rockets are unguided \u2014 they cannot steer after launch.',
        linkedFacts: ['l1t4'],
      },
      {
        id: 'l1q8',
        question: 'A Qassam costs ~$800 to build. How much does the Tamir interceptor that destroys it cost?',
        options: ['~$800', '~$5,000', '~$50,000', '~$500,000'],
        correctIndex: 2,
        explanation: 'The Tamir costs approximately $50,000 \u2014 this cost imbalance is a strategic weapon.',
        linkedFacts: ['l1t3'],
      },
      // ── New questions for Level 1 ──
      {
        id: 'l1q9',
        question: 'How much warning time do residents near Gaza have when a Qassam rocket is launched?',
        options: ['5-10 minutes', '2-3 minutes', '15-45 seconds', 'No warning at all'],
        correctIndex: 2,
        explanation: 'From launch to impact, a Qassam gives residents only 15-45 seconds to reach shelter, depending on distance.',
        linkedFacts: ['l1t5'],
      },
      {
        id: 'l1q10',
        question: 'Approximately how many rockets and mortars have been fired from Gaza into Israel since 2001?',
        options: ['About 2,000', 'About 5,000', 'Over 20,000', 'Over 100,000'],
        correctIndex: 2,
        explanation: 'Over 20,000 rockets and mortars have been fired from Gaza into Israel since 2001.',
        linkedFacts: ['l1t6'],
      },
      {
        id: 'l1q11',
        question: 'Which company developed Iron Dome?',
        options: ['Israel Aerospace Industries', 'Elbit Systems', 'Rafael Advanced Defense Systems', 'Boeing'],
        correctIndex: 2,
        explanation: 'Iron Dome was developed by Rafael Advanced Defense Systems with financial backing from the United States.',
        linkedFacts: ['l1d4'],
      },
      {
        id: 'l1q12',
        question: 'What components make up a single Iron Dome battery?',
        options: [
          'One launcher and a mobile command vehicle',
          'A radar unit, a control center, and 3-4 launchers',
          'Two radars and a single launcher',
          'A satellite link and 6 launchers',
        ],
        correctIndex: 1,
        explanation: 'Each Iron Dome battery includes a radar unit, a control center, and 3-4 launchers — enough to protect a medium-sized city.',
        linkedFacts: ['l1d5'],
      },
      {
        id: 'l1q13',
        question: 'Why doesn\'t Iron Dome fire at every incoming rocket?',
        options: [
          'It can only track one rocket at a time',
          'It calculates each rocket\'s trajectory and only fires if the rocket threatens a populated area',
          'Its radar cannot detect all rockets',
          'International law prevents it',
        ],
        correctIndex: 1,
        explanation: 'Iron Dome calculates each rocket\'s trajectory and only fires if the rocket threatens a populated area — saving interceptors for real threats.',
        linkedFacts: ['l1d6', 'l1d3'],
      },
    ],
  },

  // ─── LEVEL 2: Attack Drones from Lebanon/Syria ──────────
  2: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l2q1',
        question: 'The Shahed-136 kamikaze drone is manufactured by which country?',
        options: ['China', 'Iran', 'Russia', 'Syria'],
        correctIndex: 1,
        explanation: 'The Shahed-136 is manufactured by Iran and supplied to groups like Hezbollah.',
        linkedFacts: ['l2t1'],
      },
      {
        id: 'l2q2',
        question: 'What makes kamikaze drones different from traditional drones?',
        options: [
          'They are controlled by AI',
          'They carry multiple warheads',
          'They crash directly into the target',
          'They fly at higher altitudes',
        ],
        correctIndex: 2,
        explanation: 'Kamikaze drones ARE the weapon \u2014 they crash directly into their target.',
        linkedFacts: ['l2t2'],
      },
      {
        id: 'l2q3',
        question: 'At what altitude do attack drones typically fly?',
        options: ['High altitude (30+ km)', 'Medium altitude (10-20 km)', 'Low altitude (under 5 km)', 'Exo-atmospheric'],
        correctIndex: 2,
        explanation: 'Attack drones fly at low altitude, making them hard to detect on radar.',
        linkedFacts: ['l2t4'],
      },
      {
        id: 'l2q4',
        question: 'Approximately how much does a Shahed-136 drone cost to produce?',
        options: ['~$2,000', '~$20,000', '~$200,000', '~$2,000,000'],
        correctIndex: 1,
        explanation: 'Shahed-136 drones cost roughly $20,000 each, cheap enough to launch in swarms.',
        linkedFacts: ['l2t3'],
      },
      {
        id: 'l2q5',
        question: 'Which defense system intercepts attack drones?',
        options: ['Arrow 2', "David's Sling", 'Iron Dome', 'Arrow 3'],
        correctIndex: 2,
        explanation: 'Iron Dome intercepts both drones and short-range rockets.',
        linkedFacts: ['l2t1'],
      },
      {
        id: 'l2q6',
        question: 'How do attack drones compare to rockets in speed?',
        options: ['Much faster', 'About the same', 'Much slower', 'Depends on altitude'],
        correctIndex: 2,
        explanation: 'Drones fly at Mach 0.2-0.5, much slower than rockets which travel at Mach 1-2.',
        linkedFacts: ['l2t4'],
      },
      {
        id: 'l2q7',
        question: 'Which Lebanese group uses Iranian-made drones against Israel?',
        options: ['Hamas', 'Hezbollah', 'Islamic Jihad', 'Fatah'],
        correctIndex: 1,
        explanation: 'Hezbollah in Lebanon has received Shahed-136 and other Iranian drones.',
        linkedFacts: ['l2t1'],
      },
      {
        id: 'l2q8',
        question: 'Why are drone swarms considered a strategic challenge?',
        options: [
          'They are invisible to radar',
          'They can overwhelm defenses through sheer numbers',
          'They carry nuclear warheads',
          'They cannot be intercepted',
        ],
        correctIndex: 1,
        explanation: 'At ~$20,000 each, drones are cheap enough to overwhelm expensive interceptors through numbers.',
        linkedFacts: ['l2t3'],
      },
      // ── New questions for Level 2 ──
      {
        id: 'l2q9',
        question: 'What is the approximate range of the Shahed-136 drone?',
        options: ['100 km', '500 km', 'Up to 2,500 km', 'Over 5,000 km'],
        correctIndex: 2,
        explanation: 'The Shahed-136 has a range of up to 2,500 km — enough to reach Israel from Iran, Yemen, or Iraq.',
        linkedFacts: ['l2t5'],
      },
      {
        id: 'l2q10',
        question: 'How long does it take a Shahed-136 drone to fly from Iran to Israel?',
        options: ['About 30 minutes', 'About 1 hour', 'Over 4 hours', 'About 12 hours'],
        correctIndex: 2,
        explanation: 'A Shahed-136 drone takes over 4 hours to fly from Iran to Israel, giving defenders time to prepare if detected early.',
        linkedFacts: ['l2t6'],
      },
      {
        id: 'l2q11',
        question: 'At approximately what speed does a Shahed-136 drone fly?',
        options: ['~50 km/h', '~185 km/h', '~800 km/h', '~2,000 km/h'],
        correctIndex: 1,
        explanation: 'Shahed-136 drones fly at approximately 185 km/h — much slower than missiles, which is why they are launched hours in advance.',
        linkedFacts: ['l2t4', 'l2t6'],
      },
      {
        id: 'l2q12',
        question: 'Why are low-flying drones difficult for radar to detect?',
        options: [
          'They are too small to reflect radar waves',
          'They fly below the radar horizon and blend with ground clutter',
          'They use stealth technology',
          'They jam radar signals',
        ],
        correctIndex: 1,
        explanation: 'Drones fly at low altitude (under 1,000 m), staying below the radar horizon and blending with terrain clutter, making early detection difficult.',
        linkedFacts: ['l2t4'],
      },
    ],
  },

  // ─── LEVEL 3: Cruise Missiles + David's Sling ────────────
  3: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l3q1',
        question: "Which companies jointly developed David's Sling?",
        options: [
          'IAI and Boeing',
          'Rafael and Raytheon',
          'Elbit and Lockheed Martin',
          'IMI and General Dynamics',
        ],
        correctIndex: 1,
        explanation: "David's Sling was jointly developed by Rafael (Israel) and Raytheon (US).",
        linkedFacts: ['l3d4'],
      },
      {
        id: 'l3q2',
        question: "What year was David's Sling declared operational?",
        options: ['2007', '2011', '2014', '2017'],
        correctIndex: 3,
        explanation: "David's Sling was declared operational in 2017.",
        linkedFacts: ['l3d1'],
      },
      {
        id: 'l3q3',
        question: "What is the name of David's Sling interceptor?",
        options: ['Tamir', 'Stunner', 'Arrow', 'Patriot'],
        correctIndex: 1,
        explanation: "David's Sling fires Stunner interceptors that use hit-to-kill technology.",
        linkedFacts: ['l3d2'],
      },
      {
        id: 'l3q4',
        question: 'How do cruise missiles differ from ballistic missiles?',
        options: [
          'Cruise missiles fly faster',
          'Cruise missiles fly like aircraft at low altitude',
          'Cruise missiles follow a ballistic arc',
          'There is no difference',
        ],
        correctIndex: 1,
        explanation: 'Cruise missiles fly like small aircraft \u2014 jet-powered, with wings, at low altitude.',
        linkedFacts: ['l3t2', 'l3t3'],
      },
      {
        id: 'l3q5',
        question: 'Why are cruise missiles difficult to detect on radar?',
        options: [
          'They are made of stealth material',
          'They fly above radar range',
          'They hug the terrain at low altitude',
          'They emit jamming signals',
        ],
        correctIndex: 2,
        explanation: 'Cruise missiles hug the terrain at low altitude, making them difficult for radar to detect.',
        linkedFacts: ['l3t5'],
      },
      {
        id: 'l3q6',
        question: 'Which country developed the Paveh and Quds cruise missiles?',
        options: ['Russia', 'China', 'Iran', 'North Korea'],
        correctIndex: 2,
        explanation: 'Iran developed the Paveh and Quds cruise missiles for long-range strikes.',
        linkedFacts: ['l3t1'],
      },
      {
        id: 'l3q7',
        question: "What is the effective range of David's Sling?",
        options: ['4-70 km', '40-300 km', '100-1,000 km', '1,000+ km'],
        correctIndex: 1,
        explanation: "David's Sling has an effective range of 40-300 km.",
        linkedFacts: ['l3d5'],
      },
      {
        id: 'l3q8',
        question: "What makes the Stunner interceptor's technology special?",
        options: [
          'It uses a nuclear warhead',
          'It uses hit-to-kill \u2014 no explosive warhead',
          'It can intercept multiple targets at once',
          'It is reusable',
        ],
        correctIndex: 1,
        explanation: 'The Stunner uses hit-to-kill technology \u2014 it destroys the target through direct impact, with no explosive warhead.',
        linkedFacts: ['l3d2'],
      },
      // ── New questions for Level 3 ──
      {
        id: 'l3q9',
        question: 'What is the approximate range of the Paveh cruise missile?',
        options: ['200 km', '800 km', 'Over 1,600 km', 'Over 5,000 km'],
        correctIndex: 2,
        explanation: 'The Paveh cruise missile has a range of over 1,600 km — enough to reach Israel from deep inside Iranian territory.',
        linkedFacts: ['l3t4'],
      },
      {
        id: 'l3q10',
        question: 'How do modern cruise missiles navigate to their targets?',
        options: [
          'They follow a pre-set ballistic trajectory',
          'They use GPS and terrain-matching navigation for meter-level accuracy',
          'They are remotely piloted by an operator',
          'They rely on star navigation like early ICBMs',
        ],
        correctIndex: 1,
        explanation: 'Modern cruise missiles use GPS and terrain-matching navigation to strike targets with accuracy within a few meters.',
        linkedFacts: ['l3t6'],
      },
      {
        id: 'l3q11',
        question: 'What type of guidance does the Stunner interceptor use to track maneuvering targets?',
        options: [
          'GPS guidance only',
          'A dual-seeker system using both infrared and radar',
          'Laser guidance from a ground operator',
          'Magnetic field tracking',
        ],
        correctIndex: 1,
        explanation: 'The Stunner has a dual-seeker system — it uses both infrared and radar guidance to track and hit maneuvering targets.',
        linkedFacts: ['l3d6'],
      },
      {
        id: 'l3q12',
        question: 'Approximately how much does one Stunner interceptor cost?',
        options: ['~$50,000', '~$250,000', '~$1 million', '~$3.5 million'],
        correctIndex: 2,
        explanation: 'Each Stunner interceptor costs approximately $1 million — far more than a Tamir but less than an Arrow.',
        linkedFacts: ['l3d3'],
      },
    ],
  },

  // ─── LEVEL 4: The Home Front — Population Corridor + Arrow 2 ──
  4: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l4q1',
        question: 'Approximately how many people live in Israel?',
        options: ['~3 million', '~5.5 million', '~9.8 million', '~15 million'],
        correctIndex: 2,
        explanation: 'Israel has approximately 9.8 million people in one of the world\'s smallest countries — about the size of New Jersey.',
        linkedFacts: ['l4t1'],
      },
      {
        id: 'l4q2',
        question: 'What percentage of Israel\'s population lives on the coastal plain from Haifa to Ashdod?',
        options: ['About 30%', 'About 50%', 'Over 70%', 'About 90%'],
        correctIndex: 2,
        explanation: 'The coastal plain from Haifa to Ashdod holds over 70% of Israel\'s population in a strip only 15-20 km wide.',
        linkedFacts: ['l4t2'],
      },
      {
        id: 'l4q3',
        question: 'At its narrowest point near Netanya, how wide is Israel from the sea to the West Bank border?',
        options: ['50 km', '30 km', '15 km', '5 km'],
        correctIndex: 2,
        explanation: 'At its narrowest point near Netanya, Israel is only 15 km from the Mediterranean Sea to the West Bank border.',
        linkedFacts: ['l4t3'],
      },
      {
        id: 'l4q4',
        question: 'How many people live in Gush Dan — the greater Tel Aviv metropolitan area?',
        options: ['About 500,000', 'Nearly 2 million', 'Nearly 4 million', 'Over 7 million'],
        correctIndex: 2,
        explanation: 'Gush Dan — the greater Tel Aviv metropolitan area — contains nearly 4 million people, almost half the country\'s population.',
        linkedFacts: ['l4t4'],
      },
      {
        id: 'l4q5',
        question: 'How long does it take a Shahab-3 ballistic missile to reach Israel from Iran?',
        options: ['About 1 hour', 'About 30 minutes', 'Under 12 minutes', 'About 5 minutes'],
        correctIndex: 2,
        explanation: 'A Shahab-3 ballistic missile launched from Iran reaches any city in Israel in under 12 minutes — arcing through space at Mach 7-10.',
        linkedFacts: ['l4t5'],
      },
      {
        id: 'l4q6',
        question: 'At what speed do ballistic missiles reenter the atmosphere?',
        options: ['Mach 1-2', 'Mach 3-5', 'Mach 7-10', 'Mach 20+'],
        correctIndex: 2,
        explanation: 'Ballistic missiles reenter at Mach 7-10 with enormous kinetic energy, making them devastating against densely populated areas.',
        linkedFacts: ['l4t5', 'l4t6'],
      },
      {
        id: 'l4q7',
        question: 'Which companies jointly developed Arrow 2?',
        options: [
          'Rafael and Raytheon',
          'Israel Aerospace Industries and Boeing',
          'Elbit and Lockheed Martin',
          'IMI and Northrop Grumman',
        ],
        correctIndex: 1,
        explanation: 'Arrow 2 was jointly developed by Israel Aerospace Industries (IAI) and Boeing.',
        linkedFacts: ['l4d4'],
      },
      {
        id: 'l4q8',
        question: 'What was Arrow 2 the first in the world to achieve?',
        options: [
          'First hypersonic interceptor',
          'First deployed anti-ballistic missile system',
          'First space-based interceptor',
          'First AI-guided missile',
        ],
        correctIndex: 1,
        explanation: "Arrow 2 was the world's first operational anti-ballistic missile defense system, deployed in 2000.",
        linkedFacts: ['l4d1'],
      },
      {
        id: 'l4q9',
        question: 'Where does Arrow 2 intercept ballistic missiles?',
        options: [
          'At ground level',
          'In the lower atmosphere',
          'In the upper atmosphere during descent',
          'In space',
        ],
        correctIndex: 2,
        explanation: 'Arrow 2 intercepts ballistic missiles in the upper atmosphere during their descent.',
        linkedFacts: ['l4d2'],
      },
      {
        id: 'l4q10',
        question: 'Up to what altitude can Arrow 2 engage targets?',
        options: ['10 km', '50 km', '90 km', '200 km'],
        correctIndex: 2,
        explanation: 'Arrow 2 can engage targets at altitudes up to 90 km above populated areas.',
        linkedFacts: ['l4d3'],
      },
      {
        id: 'l4q11',
        question: 'What type of warhead does Arrow 2 use?',
        options: [
          'Hit-to-kill (no explosive)',
          'Nuclear',
          'Directed fragmentation',
          'Electromagnetic pulse',
        ],
        correctIndex: 2,
        explanation: 'Arrow 2 uses a directed fragmentation warhead to destroy incoming ballistic missiles.',
        linkedFacts: ['l4d5'],
      },
      {
        id: 'l4q12',
        question: 'What is the name of the radar system paired with Arrow 2?',
        options: ['Iron Eye', 'Green Pine', 'Red Sky', 'Blue Shield'],
        correctIndex: 1,
        explanation: 'Arrow 2 is paired with the Green Pine radar — one of the most powerful tracking radars in the world, able to detect missiles at ranges over 500 km.',
        linkedFacts: ['l4d6'],
      },
    ],
  },

  // ─── LEVEL 5: Hypersonic Weapons + Arrow 3 ─────────────
  5: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l5q1',
        question: 'At what minimum speed does a weapon qualify as hypersonic?',
        options: ['Mach 1', 'Mach 3', 'Mach 5', 'Mach 10'],
        correctIndex: 2,
        explanation: 'Hypersonic weapons travel at Mach 5 or above — over 6,000 km/h.',
        linkedFacts: ['l5t1'],
      },
      {
        id: 'l5q2',
        question: 'What flight profile do hypersonic glide vehicles follow?',
        options: [
          'Low altitude, terrain-following',
          'Straight and level at high altitude',
          'Boost to edge of space, then glide back at extreme speed',
          'Standard ballistic arc',
        ],
        correctIndex: 2,
        explanation: 'Hypersonic glide vehicles boost to the edge of space, then glide back at extreme speed while maneuvering.',
        linkedFacts: ['l5t2'],
      },
      {
        id: 'l5q3',
        question: 'What makes hypersonic glide vehicles especially dangerous?',
        options: [
          'They carry nuclear warheads',
          'They can change course mid-flight',
          'They are invisible to radar',
          'They travel through space only',
        ],
        correctIndex: 1,
        explanation: 'Their ability to change course mid-flight makes them nearly impossible to predict.',
        linkedFacts: ['l5t3'],
      },
      {
        id: 'l5q4',
        question: 'Which countries are known to be developing hypersonic weapons?',
        options: [
          'Only the United States',
          'Russia, China, Iran, and North Korea',
          'Only Russia and China',
          'All NATO countries',
        ],
        correctIndex: 1,
        explanation: 'Russia, China, Iran, and North Korea are all developing hypersonic weapons — Russia\'s Avangard can reportedly reach Mach 20.',
        linkedFacts: ['l5t4'],
      },
      {
        id: 'l5q5',
        question: 'What happens to the surface of a hypersonic weapon during flight at Mach 5+?',
        options: [
          'It freezes due to high-altitude cold',
          'Nothing — the weapon is insulated',
          'Air friction heats it to over 2,000°C, requiring special heat-resistant materials',
          'It becomes electrically charged',
        ],
        correctIndex: 2,
        explanation: 'At Mach 5+, air friction heats the weapon\'s surface to over 2,000°C — requiring special heat-resistant materials to survive the flight.',
        linkedFacts: ['l5t5'],
      },
      {
        id: 'l5q6',
        question: 'How quickly can a Mach 7 hypersonic weapon cross 100 km?',
        options: ['About 10 minutes', 'About 5 minutes', 'About 50 seconds', 'About 10 seconds'],
        correctIndex: 2,
        explanation: 'A hypersonic weapon at Mach 7 crosses 100 km in about 50 seconds — leaving almost no time for traditional defense systems to react.',
        linkedFacts: ['l5t6'],
      },
      {
        id: 'l5q7',
        question: 'Where does Arrow 3 intercept incoming threats?',
        options: [
          'At ground level',
          'In the lower atmosphere',
          'In the upper atmosphere',
          'In space, outside the atmosphere',
        ],
        correctIndex: 3,
        explanation: 'Arrow 3 intercepts targets in space — outside the atmosphere, before reentry.',
        linkedFacts: ['l5d1'],
      },
      {
        id: 'l5q8',
        question: 'What type of kill mechanism does Arrow 3 use?',
        options: [
          'Fragmentation warhead',
          'Hit-to-kill — pure kinetic energy',
          'Electromagnetic pulse',
          'Explosive blast',
        ],
        correctIndex: 1,
        explanation: 'Arrow 3 uses hit-to-kill technology — pure kinetic energy, no explosive warhead needed.',
        linkedFacts: ['l5d2'],
      },
      {
        id: 'l5q9',
        question: 'At what altitude can Arrow 3 engage threats?',
        options: ['Up to 10 km', 'Up to 50 km', 'Up to 90 km', 'Over 100 km'],
        correctIndex: 3,
        explanation: 'Arrow 3 can engage threats at altitudes over 100 km — the highest layer of Israeli defense.',
        linkedFacts: ['l5d3'],
      },
      {
        id: 'l5q10',
        question: 'Which company developed Arrow 3?',
        options: ['Rafael', 'Israel Aerospace Industries', 'Elbit Systems', 'Boeing'],
        correctIndex: 1,
        explanation: 'Arrow 3 was developed by Israel Aerospace Industries (IAI) with support from the US Missile Defense Agency.',
        linkedFacts: ['l5d4'],
      },
      {
        id: 'l5q11',
        question: 'In what year was Arrow 3 successfully tested against a real target in space?',
        options: ['2010', '2015', '2019', '2022'],
        correctIndex: 2,
        explanation: 'Arrow 3 was successfully tested against a real ballistic target in space in 2019 — proving the system works in actual combat conditions.',
        linkedFacts: ['l5d5'],
      },
      {
        id: 'l5q12',
        question: 'Why is intercepting threats in space (as Arrow 3 does) safer for people on the ground?',
        options: [
          'Space intercepts create no debris at all',
          'Debris from space intercepts burns up on reentry, protecting people from falling warhead fragments',
          'The explosion is contained by the vacuum of space',
          'Space intercepts use non-explosive methods that leave no debris',
        ],
        correctIndex: 1,
        explanation: 'Destroying threats in space means debris burns up on reentry — protecting people on the ground from falling warhead fragments.',
        linkedFacts: ['l5d6'],
      },
    ],
  },

  // ─── LEVEL 6: Multi-Front Threats & Layered Defense ──────
  6: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l6q1',
        question: 'From how many directions does Israel face simultaneous missile threats?',
        options: ['2 — north and south', '3 — north, south, and east', '5 — Gaza, Lebanon, Syria, Iran, and Yemen', '7 — all neighboring countries'],
        correctIndex: 2,
        explanation: 'Israel faces threats from 5 directions simultaneously — Gaza (west), Lebanon (north), Syria (northeast), Iran (east), and Yemen (southeast).',
        linkedFacts: ['l6t1'],
      },
      {
        id: 'l6q2',
        question: 'Which threat actor launches attacks from the farthest distance — over 2,000 km away?',
        options: ['Hezbollah in Lebanon', 'Hamas in Gaza', 'Yemen\'s Houthi rebels', 'Syrian military forces'],
        correctIndex: 2,
        explanation: 'Yemen\'s Houthi rebels, backed by Iran, have launched ballistic missiles and drones at Israel from over 2,000 km away — the farthest threat origin.',
        linkedFacts: ['l6t2'],
      },
      {
        id: 'l6q3',
        question: 'What is Iran\'s "Axis of Resistance"?',
        options: [
          'Iran\'s domestic missile defense network',
          'A coordinated network of allied groups across Gaza, Lebanon, Syria, Iraq, and Yemen that can strike simultaneously',
          'A single military unit based in Tehran',
          'Iran\'s nuclear weapons program',
        ],
        correctIndex: 1,
        explanation: 'Iran\'s "Axis of Resistance" coordinates attacks across all fronts — Gaza, Lebanon, Syria, Iraq, and Yemen can strike simultaneously.',
        linkedFacts: ['l6t3'],
      },
      {
        id: 'l6q4',
        question: 'Why is defending against 360° threats exponentially harder than one front?',
        options: [
          'The radar can only face one direction',
          'Operators must constantly scan the entire radar for threats from any direction simultaneously',
          'Israel only has batteries on one border',
          'Missiles from different directions travel at different speeds',
        ],
        correctIndex: 1,
        explanation: 'Defending 360° is exponentially harder than one front — operators must constantly scan the entire radar for threats from any direction.',
        linkedFacts: ['l6t4'],
      },
      {
        id: 'l6q5',
        question: 'How long and wide is Israel at its maximum dimensions?',
        options: [
          '1,000 km long, 500 km wide',
          '470 km long, 135 km wide',
          '200 km long, 80 km wide',
          '800 km long, 300 km wide',
        ],
        correctIndex: 1,
        explanation: 'Israel is one of the smallest countries facing multi-front missile threats — only 470 km long and 135 km wide at its widest.',
        linkedFacts: ['l6t5'],
      },
      {
        id: 'l6q6',
        question: 'How does the travel time of an Iranian ballistic missile compare to a Yemeni drone?',
        options: [
          'Both arrive in about 30 minutes',
          'The ballistic missile takes under 12 minutes; the drone takes 4+ hours',
          'The drone is faster because it flies at low altitude',
          'Both take about 2 hours',
        ],
        correctIndex: 1,
        explanation: 'A ballistic missile from Iran reaches Israel in under 12 minutes, while a drone from Yemen takes 4+ hours — defenders must handle vastly different timelines.',
        linkedFacts: ['l6t6'],
      },
      {
        id: 'l6q7',
        question: 'How does Israel\'s multi-layered defense assign threat types to interceptor systems?',
        options: [
          'All systems can intercept all threat types equally',
          'Iron Dome handles rockets/drones, David\'s Sling handles cruise missiles, Arrow handles ballistic missiles',
          'Each system is assigned a geographic region regardless of threat type',
          'The assignment is random based on availability',
        ],
        correctIndex: 1,
        explanation: 'Israel\'s multi-layered defense assigns each system to specific threat types — Iron Dome for rockets/drones, David\'s Sling for cruise missiles, Arrow for ballistic.',
        linkedFacts: ['l6d1'],
      },
      {
        id: 'l6q8',
        question: 'What connects all of Israel\'s defense systems into a unified picture?',
        options: [
          'Each system operates independently with no coordination',
          'A unified command network that shows all threats on one screen regardless of origin direction',
          'Radio communication between individual battery commanders',
          'Visual spotters relay information by phone',
        ],
        correctIndex: 1,
        explanation: 'The entire system is connected by a unified command network — operators see all threats on one screen regardless of origin direction.',
        linkedFacts: ['l6d2'],
      },
      {
        id: 'l6q9',
        question: 'How do interceptor batteries provide coverage across Israel?',
        options: [
          'One central battery covers the entire country',
          'Multiple batteries spread across the country provide overlapping coverage zones',
          'Batteries are only placed in Tel Aviv',
          'Mobile batteries follow threats as they fly',
        ],
        correctIndex: 1,
        explanation: 'Each interceptor battery protects a zone — multiple batteries spread across the country provide overlapping coverage.',
        linkedFacts: ['l6d3'],
      },
      {
        id: 'l6q10',
        question: 'What critical decision becomes harder during multi-front attacks?',
        options: [
          'Choosing which radar frequency to use',
          'Deciding which threats to intercept and which to let pass (hold fire) when threats come from every direction',
          'Selecting the right uniform for operators',
          'Deciding where to build new factories',
        ],
        correctIndex: 1,
        explanation: 'Deciding which threats to intercept and which to let pass (hold fire) becomes critical when threats come from every direction simultaneously.',
        linkedFacts: ['l6d4'],
      },
      {
        id: 'l6q11',
        question: 'Where has Israel deployed Iron Dome batteries across the country?',
        options: [
          'Only in Tel Aviv',
          'Only along the northern border',
          'From Eilat in the south to Haifa in the north',
          'Only around military bases',
        ],
        correctIndex: 2,
        explanation: 'Israel has deployed Iron Dome batteries from Eilat in the south to Haifa in the north — each covering a specific region.',
        linkedFacts: ['l6d5'],
      },
      {
        id: 'l6q12',
        question: 'How quickly can interceptor batteries be moved to reinforce threatened areas?',
        options: [
          'They are permanent and cannot be moved',
          'Within hours — batteries can be repositioned to reinforce the most threatened areas',
          'It takes weeks to relocate a battery',
          'Only new batteries can be added, existing ones stay put',
        ],
        correctIndex: 1,
        explanation: 'During multi-front attacks, interceptor batteries can be repositioned within hours to reinforce the most threatened areas.',
        linkedFacts: ['l6d6'],
      },
    ],
  },

  // ─── LEVEL 7: April 13 Attack + Cost Problem ────────
  7: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l7q1',
        question: 'How many total projectiles did Iran launch at Israel on April 13, 2024?',
        options: ['About 50', 'About 150', 'Over 300', 'Over 1,000'],
        correctIndex: 2,
        explanation: 'Iran launched over 300 projectiles — 170+ drones, 30+ cruise missiles, and 120+ ballistic missiles.',
        linkedFacts: ['l7t1'],
      },
      {
        id: 'l7q2',
        question: 'Why did Iran stagger the launch timing of drones, cruise missiles, and ballistic missiles?',
        options: [
          'They ran out of launchers and had to reload',
          'Slow drones launched first, then cruise, then ballistic — all timed to arrive simultaneously for maximum overload',
          'Each weapon type required different weather conditions',
          'International law requires sequential launches',
        ],
        correctIndex: 1,
        explanation: 'Iran staggered launches — slow drones first, then cruise missiles, then ballistic — all timed to arrive simultaneously for maximum overload.',
        linkedFacts: ['l7t2'],
      },
      {
        id: 'l7q3',
        question: 'Which countries helped Israel intercept the April 13 attack?',
        options: [
          'Only Israel defended alone',
          'The US, UK, France, and Jordan',
          'NATO as a whole',
          'Only the United States',
        ],
        correctIndex: 1,
        explanation: 'A coalition of the US, UK, France, and Jordan helped Israel intercept the attack — US Navy destroyers shot down ballistic missiles from the Red Sea.',
        linkedFacts: ['l7t3'],
      },
      {
        id: 'l7q4',
        question: 'What percentage of incoming projectiles were intercepted on April 13?',
        options: ['About 50%', 'About 75%', 'About 90%', '99%'],
        correctIndex: 3,
        explanation: '99% of incoming projectiles were intercepted — only a handful of ballistic missiles struck near Nevatim Air Base, causing minor damage.',
        linkedFacts: ['l7t4'],
      },
      {
        id: 'l7q5',
        question: 'How many defense tiers activated during the April 13 attack?',
        options: ['Only Iron Dome', 'Iron Dome and Arrow 2', 'Three tiers', 'All four — Iron Dome, David\'s Sling, Arrow 2, and Arrow 3'],
        correctIndex: 3,
        explanation: 'All four defense tiers activated simultaneously — Iron Dome, David\'s Sling, Arrow 2, and Arrow 3 each engaged their designated threats.',
        linkedFacts: ['l7t5'],
      },
      {
        id: 'l7q6',
        question: 'What was the estimated cost of defending against the April 13 attack vs. the cost of the attack itself?',
        options: [
          'Defense: $10 million, Attack: $5 million',
          'Defense: $100 million, Attack: $50 million',
          'Defense: ~$1.35 billion, Attack: ~$80-100 million',
          'Defense: $5 billion, Attack: $1 billion',
        ],
        correctIndex: 2,
        explanation: 'Defending against the April 13 attack cost an estimated $1.35 billion — while Iran\'s total attack cost roughly $80-100 million.',
        linkedFacts: ['l7t6'],
      },
      {
        id: 'l7q7',
        question: 'What is the cost ratio between an $800 Qassam rocket and the $50,000 Tamir interceptor that destroys it?',
        options: [
          '5:1 favoring the attacker',
          '20:1 favoring the attacker',
          '62:1 favoring the attacker',
          '100:1 favoring the attacker',
        ],
        correctIndex: 2,
        explanation: 'At $800 vs $50,000, the cost ratio is roughly 62:1 — the attacker spends 62 times less than the defender per engagement.',
        linkedFacts: ['l7d1'],
      },
      {
        id: 'l7q8',
        question: 'How much does an Arrow 3 interceptor cost?',
        options: ['~$500,000', '~$1 million', '~$3.5 million', '~$10 million'],
        correctIndex: 2,
        explanation: 'An Arrow 3 interceptor costs ~$3.5 million — adversaries can force a launch with a much cheaper decoy missile.',
        linkedFacts: ['l7d2'],
      },
      {
        id: 'l7q9',
        question: 'What is Iron Beam and why is it a potential game-changer?',
        options: [
          'A new radar system that detects threats earlier',
          'A laser defense system where each shot costs ~$3.50 in electricity instead of $50,000 per missile',
          'An upgraded version of Iron Dome with longer range',
          'A satellite-based interceptor system',
        ],
        correctIndex: 1,
        explanation: 'Iron Beam is a laser system under development — each shot costs roughly $3.50 in electricity vs $50,000 for a Tamir.',
        linkedFacts: ['l7d3', 'l7d4'],
      },
      {
        id: 'l7q10',
        question: 'What is the main limitation of the Iron Beam laser system?',
        options: [
          'It can only fire once per minute',
          'It loses effectiveness in heavy cloud cover, rain, or sandstorms',
          'It costs more per shot than traditional interceptors',
          'It can only target drones, not rockets',
        ],
        correctIndex: 1,
        explanation: 'Iron Beam\'s main limitation is weather — lasers lose effectiveness in heavy cloud cover, rain, or sandstorms.',
        linkedFacts: ['l7d5'],
      },
      {
        id: 'l7q11',
        question: 'Which country is co-investing with Israel in Iron Beam technology?',
        options: ['Germany', 'The United Kingdom', 'The United States', 'France'],
        correctIndex: 2,
        explanation: 'The US is co-investing in Iron Beam technology — the system could transform missile defense economics worldwide.',
        linkedFacts: ['l7d6'],
      },
      {
        id: 'l7q12',
        question: 'What is the fundamental "cost-exchange ratio" problem in missile defense?',
        options: [
          'The cost of building defense systems versus buying from allies',
          'Defense consistently costs far more than attack, giving attackers an economic advantage',
          'The exchange rate between currencies affecting weapons prices',
          'The cost of training operators versus automating systems',
        ],
        correctIndex: 1,
        explanation: 'The cost-exchange ratio is the central unsolved problem — cheap offensive weapons force expensive defensive responses, giving attackers an inherent economic advantage.',
        linkedFacts: ['l7d1', 'l7d2'],
      },
    ],
  },
};

/**
 * Get N random questions for a given level.
 * If shownFactIds is provided, only questions linked to those facts are eligible.
 * Falls back to all questions if filtering yields too few.
 */
export function getRandomQuestions(level, count, shownFactIds) {
  const data = QUIZ_DATA[level];
  if (!data) return [];
  const n = count || data.questionsPerQuiz;

  let pool = data.questions;

  // Filter to questions linked to shown facts (if linkedFacts are defined)
  if (shownFactIds && shownFactIds.length > 0) {
    const idSet = new Set(shownFactIds);
    const filtered = pool.filter(q =>
      q.linkedFacts && q.linkedFacts.some(fid => idSet.has(fid))
    );
    // Only use filtered pool if it has enough questions
    if (filtered.length >= n) {
      pool = filtered;
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
