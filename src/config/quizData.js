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

  // ─── LEVEL 4: Strategic Targets — Ballistic Missiles + Arrow 2 ──
  4: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l4q1',
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
        id: 'l4q2',
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
        id: 'l4q3',
        question: "What is the Shahab-3's approximate range?",
        options: ['100 km', '500 km', 'Over 1,300 km', 'Over 5,000 km'],
        correctIndex: 2,
        explanation: "Iran's Shahab-3 has a range over 1,300 km \u2014 enough to reach Israel from Iranian soil.",
        linkedFacts: ['l4t2'],
      },
      {
        id: 'l4q4',
        question: 'At what speed do ballistic missiles reenter the atmosphere?',
        options: ['Mach 1-2', 'Mach 3-5', 'Mach 7-10', 'Mach 20+'],
        correctIndex: 2,
        explanation: 'Ballistic missiles reenter at Mach 7-10 \u2014 faster than any bullet.',
        linkedFacts: ['l4t3'],
      },
      {
        id: 'l4q5',
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
        id: 'l4q6',
        question: 'Up to what altitude can Arrow 2 engage targets?',
        options: ['10 km', '50 km', '90 km', '200 km'],
        correctIndex: 2,
        explanation: 'Arrow 2 can engage targets at altitudes up to 90 km above populated areas.',
        linkedFacts: ['l4d3'],
      },
      {
        id: 'l4q7',
        question: 'How does a ballistic missile reach its target?',
        options: [
          'It flies low along the terrain',
          'It launches on a high arc into space, then plunges down',
          'It glides at a constant altitude',
          'It uses jet engines for sustained flight',
        ],
        correctIndex: 1,
        explanation: 'Ballistic missiles launch on a high arc into space, then plunge toward the target.',
        linkedFacts: ['l4t3'],
      },
      {
        id: 'l4q8',
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
        id: 'l4q9',
        question: 'Why do adversaries target military bases with ballistic missiles?',
        options: [
          'Bases are easier to hit than cities',
          'To cripple air fields, missile batteries, and command centers',
          'International law only permits attacks on military sites',
          'Bases have no missile defense coverage',
        ],
        correctIndex: 1,
        explanation: 'Adversaries target military bases to destroy air fields, missile batteries, and intelligence sites — crippling the ability to fight back.',
        linkedFacts: ['l4t1'],
      },
      // ── New questions for Level 4 ──
      {
        id: 'l4q10',
        question: 'Where did Iran acquire the technology base for the Shahab-3 missile?',
        options: [
          'Developed entirely domestically',
          'From North Korea\'s Nodong missile program in the 1990s',
          'Purchased from Russia in 2005',
          'Reverse-engineered from captured US Patriot missiles',
        ],
        correctIndex: 1,
        explanation: 'The Shahab-3 is based on North Korea\'s Nodong missile — Iran acquired the technology in the 1990s and modified it for longer range.',
        linkedFacts: ['l4t4'],
      },
      {
        id: 'l4q11',
        question: 'What is the Fateh-110 and who else has access to it?',
        options: [
          'A long-range cruise missile used only by Iran',
          'A shorter-range ballistic missile (300 km) supplied to Hezbollah',
          'An anti-ship missile used by the Houthis',
          'A nuclear-capable ICBM kept in Iranian silos',
        ],
        correctIndex: 1,
        explanation: 'Iran\'s Fateh-110 is a shorter-range ballistic missile (300 km) — accurate enough to strike specific buildings, and has been supplied to Hezbollah.',
        linkedFacts: ['l4t5'],
      },
      {
        id: 'l4q12',
        question: 'What is the name of the radar system paired with Arrow 2?',
        options: ['Iron Eye', 'Green Pine', 'Red Sky', 'Blue Shield'],
        correctIndex: 1,
        explanation: 'Arrow 2 is paired with the Green Pine radar — one of the most powerful tracking radars in the world, able to detect missiles at ranges over 500 km.',
        linkedFacts: ['l4d6'],
      },
      {
        id: 'l4q13',
        question: 'Why is each incoming ballistic missile treated as an unknown-severity threat?',
        options: [
          'Radar cannot determine missile type during flight',
          'Ballistic missiles can carry conventional, chemical, or nuclear warheads — the payload is unknown until impact',
          'All ballistic missiles look identical on radar',
          'Defenders cannot tell decoys from real missiles',
        ],
        correctIndex: 1,
        explanation: 'Ballistic missiles can carry conventional, chemical, or nuclear warheads — making each incoming missile an unknown-severity threat that must be intercepted.',
        linkedFacts: ['l4t6'],
      },
    ],
  },

  // ─── LEVEL 5: Hypersonic + Arrow 3 ───────────────────────
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
        explanation: 'Hypersonic weapons travel at Mach 5 or above \u2014 over 6,000 km/h.',
        linkedFacts: ['l5t1'],
      },
      {
        id: 'l5q2',
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
        id: 'l5q3',
        question: 'Where does Arrow 3 intercept incoming threats?',
        options: [
          'At ground level',
          'In the lower atmosphere',
          'In the upper atmosphere',
          'In space, outside the atmosphere',
        ],
        correctIndex: 3,
        explanation: 'Arrow 3 intercepts targets in space \u2014 outside the atmosphere, before reentry.',
        linkedFacts: ['l5d1'],
      },
      {
        id: 'l5q4',
        question: 'Which company developed Arrow 3?',
        options: ['Rafael', 'Israel Aerospace Industries', 'Elbit Systems', 'Boeing'],
        correctIndex: 1,
        explanation: 'Arrow 3 was developed by Israel Aerospace Industries with US support.',
        linkedFacts: ['l5d4'],
      },
      {
        id: 'l5q5',
        question: 'What type of kill mechanism does Arrow 3 use?',
        options: [
          'Fragmentation warhead',
          'Hit-to-kill \u2014 pure kinetic energy',
          'Electromagnetic pulse',
          'Explosive blast',
        ],
        correctIndex: 1,
        explanation: 'Arrow 3 uses hit-to-kill technology \u2014 pure kinetic energy, no explosive warhead needed.',
        linkedFacts: ['l5d2'],
      },
      {
        id: 'l5q6',
        question: 'In what year was Arrow 3 successfully tested against a real target in space?',
        options: ['2010', '2015', '2019', '2022'],
        correctIndex: 2,
        explanation: 'Arrow 3 was successfully tested against real ballistic targets in space in 2019.',
        linkedFacts: ['l5d5'],
      },
      {
        id: 'l5q7',
        question: 'At what altitude can Arrow 3 engage threats?',
        options: ['Up to 10 km', 'Up to 50 km', 'Up to 90 km', 'Over 100 km'],
        correctIndex: 3,
        explanation: 'Arrow 3 can engage threats at altitudes over 100 km \u2014 the highest layer of Israeli defense.',
        linkedFacts: ['l5d3'],
      },
      {
        id: 'l5q8',
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
      // ── New questions for Level 5 ──
      {
        id: 'l5q9',
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
        id: 'l5q10',
        question: 'What happens to the surface of a hypersonic weapon during flight at Mach 5+?',
        options: [
          'It freezes due to high-altitude cold',
          'Nothing — the weapon is insulated',
          'Air friction heats it to over 2,000\u00b0C, requiring special heat-resistant materials',
          'It becomes electrically charged',
        ],
        correctIndex: 2,
        explanation: 'At Mach 5+, air friction heats the weapon\'s surface to over 2,000\u00b0C — requiring special heat-resistant materials to survive the flight.',
        linkedFacts: ['l5t5'],
      },
      {
        id: 'l5q11',
        question: 'How quickly can a Mach 7 hypersonic weapon cross 100 km?',
        options: ['About 10 minutes', 'About 5 minutes', 'About 50 seconds', 'About 10 seconds'],
        correctIndex: 2,
        explanation: 'A hypersonic weapon at Mach 7 crosses 100 km in about 50 seconds — leaving almost no time for traditional defense systems to react.',
        linkedFacts: ['l5t6'],
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

  // ─── LEVEL 6: April 2024 Attack & Multi-Layered Defense ───
  6: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l6q1',
        question: 'How many total projectiles did Iran launch at Israel on April 13, 2024?',
        options: ['About 50', 'About 150', 'Over 300', 'Over 1,000'],
        correctIndex: 2,
        explanation: 'Iran launched over 300 projectiles \u2014 170 drones, 30+ cruise missiles, and 120+ ballistic missiles.',
        linkedFacts: ['l6t1', 'l6t2'],
      },
      {
        id: 'l6q2',
        question: 'Why did Iran launch its 170 drones hours before the missiles?',
        options: [
          'The drones needed time to arm themselves mid-flight',
          'Drones fly ~185 km/h and take hours to arrive, while ballistic missiles arrive in under 12 minutes \u2014 staggering ensured simultaneous arrival',
          'Iranian launch sites can only fire one type at a time',
          'Drones needed to scout the targets first',
        ],
        correctIndex: 1,
        explanation: 'Drones travel slowly (~185 km/h, 4+ hour flight) while ballistic missiles arrive in under 12 minutes. Staggered launches meant all 300+ projectiles converged in the same window.',
        linkedFacts: ['l6t3'],
      },
      {
        id: 'l6q3',
        question: 'Which countries helped Israel intercept the April 2024 attack?',
        options: [
          'US and France',
          'US, UK, and Jordan',
          'US, Saudi Arabia, and Egypt',
          'UK, France, and Germany',
        ],
        correctIndex: 1,
        explanation: 'The US, United Kingdom, and Jordan all participated in intercepting drones and missiles \u2014 a multinational coalition defense.',
        linkedFacts: ['l6d2'],
      },
      {
        id: 'l6q4',
        question: 'What was the overall intercept rate of the April 2024 attack?',
        options: ['About 75%', 'About 85%', 'About 95%', 'About 99%'],
        correctIndex: 3,
        explanation: '99% of all 300+ projectiles were intercepted \u2014 only one ballistic missile struck its intended target at Nevatim airbase.',
        linkedFacts: ['l6d1', 'l6d6'],
      },
      {
        id: 'l6q5',
        question: 'What primary targets did Iran aim at during the April 2024 attack?',
        options: [
          'Tel Aviv and Haifa population centers',
          'Nevatim and Ramon airbases in the Negev desert',
          'The Knesset and government buildings in Jerusalem',
          'Iron Dome battery positions along the coast',
        ],
        correctIndex: 1,
        explanation: 'Iran targeted Nevatim and Ramon airbases in the Negev, plus military sites near the Dead Sea \u2014 focusing on military rather than civilian targets.',
        linkedFacts: ['l6t4'],
      },
      {
        id: 'l6q6',
        question: "Approximately how much did the intercept operation cost compared to Iran's attack?",
        options: [
          'Defense cost about the same as the attack (~$80M each)',
          "Defense cost over $1 billion vs Iran's ~$80-100 million attack",
          "Defense was cheaper at $10 million vs Iran's $500 million attack",
          'Both sides spent approximately $500 million',
        ],
        correctIndex: 1,
        explanation: "The coalition intercept operation cost over $1 billion, while Iran's attack cost an estimated $80-100 million \u2014 defense was roughly 10x more expensive than the attack.",
        linkedFacts: ['l6t5'],
      },
      {
        id: 'l6q7',
        question: 'What role did Jordan play in the April 2024 defense?',
        options: [
          'Jordan provided early warning radar data only',
          'Jordan intercepted drones and missiles crossing its airspace',
          'Jordan allowed Israeli jets to refuel at Jordanian bases',
          'Jordan did not participate',
        ],
        correctIndex: 1,
        explanation: 'Jordan intercepted Iranian drones and missiles crossing its airspace \u2014 a historic first for the kingdom.',
        linkedFacts: ['l6d5'],
      },
      {
        id: 'l6q8',
        question: "How many of Israel's defense tiers were activated during the April 2024 attack?",
        options: [
          'Only Iron Dome (1 tier)',
          'Iron Dome and Arrow 3 (2 tiers)',
          'Three out of four tiers',
          "All 4 tiers \u2014 Iron Dome, David's Sling, Arrow 2, and Arrow 3",
        ],
        correctIndex: 3,
        explanation: 'All 4 tiers fired in a single night \u2014 the first time the entire multi-layered system was tested in real combat simultaneously.',
        linkedFacts: ['l6d3'],
      },
      // ── New questions for Level 6 ──
      {
        id: 'l6q9',
        question: 'What advance notice did Israel have before the April 2024 attack?',
        options: [
          'No warning — the attack was a complete surprise',
          'Iran gave several hours of advance warning through diplomatic channels, allowing forces to prepare',
          'Israel detected the attack only 30 minutes before impact',
          'A spy provided intelligence the day before',
        ],
        correctIndex: 1,
        explanation: 'Iran gave several hours of advance warning through diplomatic channels — US and Israeli forces had time to position fighter jets and naval assets.',
        linkedFacts: ['l6t6'],
      },
      {
        id: 'l6q10',
        question: 'How did US naval forces contribute to the April 2024 defense?',
        options: [
          'They provided radar data only',
          'US Navy destroyers fired SM-3 interceptors, and US fighter jets shot down drones',
          'They blockaded Iranian ports to prevent further launches',
          'They did not participate directly in intercepts',
        ],
        correctIndex: 1,
        explanation: 'US Navy destroyers in the Eastern Mediterranean fired SM-3 interceptors, and US and UK fighter jets shot down drones over Jordan and Iraq.',
        linkedFacts: ['l6d4'],
      },
      {
        id: 'l6q11',
        question: 'How much damage did the one ballistic missile that struck Nevatim airbase cause?',
        options: [
          'The base was completely destroyed',
          'Minor damage to a taxiway — the runway remained operational',
          'Three aircraft were destroyed on the ground',
          'The missile was a dud and caused no damage',
        ],
        correctIndex: 1,
        explanation: 'Only one ballistic missile struck its intended target — Nevatim airbase sustained minor damage to a taxiway, but the runway remained operational.',
        linkedFacts: ['l6d6'],
      },
      {
        id: 'l6q12',
        question: 'How many Shahed drones were included in the April 2024 attack?',
        options: ['About 50', 'About 100', '170', 'Over 250'],
        correctIndex: 2,
        explanation: 'The salvo included 170 Shahed drones, along with 30+ cruise missiles and 120+ ballistic missiles.',
        linkedFacts: ['l6t2'],
      },
    ],
  },

  // ─── LEVEL 7: Cost Asymmetry & Resource Management ────────
  7: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l7q1',
        question: 'What is the cost ratio between an $800 Qassam rocket and the $50,000 Tamir interceptor that destroys it?',
        options: [
          '5:1 favoring the attacker',
          '20:1 favoring the attacker',
          '62:1 favoring the attacker',
          '100:1 favoring the attacker',
        ],
        correctIndex: 2,
        explanation: 'At $800 vs $50,000, the cost ratio is roughly 62:1 \u2014 the attacker spends 62 times less than the defender per engagement.',
        linkedFacts: ['l7t1'],
      },
      {
        id: 'l7q2',
        question: 'Why do IDF commanders sometimes deliberately let rockets hit open ground?',
        options: [
          'The radar cannot track rockets heading to open areas',
          'Intercepting every threat is economically impossible \u2014 interceptors must be saved for populated areas',
          'Open ground rockets always miss their targets anyway',
          'International law requires it',
        ],
        correctIndex: 1,
        explanation: 'Intercepting every threat is economically impossible. Commanders calculate whether each threat warrants a $50,000+ interceptor or will land harmlessly in open ground.',
        linkedFacts: ['l7t4'],
      },
      {
        id: 'l7q3',
        question: 'During October 2023, Hamas launched ~3,000 rockets in 24 hours. At $50K per Tamir, what would intercepting all of them cost?',
        options: [
          '$15 million',
          '$50 million',
          '$150 million',
          '$500 million',
        ],
        correctIndex: 2,
        explanation: '3,000 rockets \u00d7 $50,000 per Tamir = $150 million in a single day \u2014 this is why selective engagement is essential.',
        linkedFacts: ['l7t3'],
      },
      {
        id: 'l7q4',
        question: 'What is Iron Beam and why is it a potential game-changer?',
        options: [
          'A new radar system that detects threats earlier',
          'A laser defense system where each shot costs ~$3.50 in electricity instead of $50,000 per missile',
          'An upgraded version of Iron Dome with longer range',
          'A satellite-based interceptor system',
        ],
        correctIndex: 1,
        explanation: 'Iron Beam is a laser system by Rafael. Each shot costs roughly $3.50 in electricity compared to $50,000 for a Tamir \u2014 it could solve the cost-exchange ratio problem.',
        linkedFacts: ['l7d1', 'l7d2', 'l7d3'],
      },
      {
        id: 'l7q5',
        question: 'What is the main limitation of the Iron Beam laser system?',
        options: [
          'It can only fire once per minute',
          'It cannot work through clouds or heavy rain, and cannot reach altitudes needed for ballistic missiles',
          'It costs more per shot than traditional interceptors',
          'It can only target drones, not rockets',
        ],
        correctIndex: 1,
        explanation: 'Lasers cannot penetrate heavy cloud cover or rain, and they lack the range to reach ballistic missile altitudes \u2014 Iron Beam supplements Iron Dome, it does not replace it.',
        linkedFacts: ['l7d4', 'l7d5'],
      },
      {
        id: 'l7q6',
        question: 'A salvo of 5 cheap drones and 1 ballistic missile arrives simultaneously. You have 2 Arrow 2 interceptors and 3 Iron Dome Tamirs left. What is the optimal strategy?',
        options: [
          'Fire all interceptors at the drones first since there are more of them',
          'Use 1 Arrow 2 on the ballistic missile and 3 Tamirs on the 3 highest-priority drones, letting 2 drones pass',
          'Fire both Arrow 2s at the ballistic missile and ignore the drones entirely',
          'Hold fire on everything and hope they miss',
        ],
        correctIndex: 1,
        explanation: 'The ballistic missile is the deadliest threat \u2014 use 1 Arrow 2 to intercept it. Use Tamirs on drones threatening populated areas, and let drones heading for open ground pass.',
        linkedFacts: ['l7t4'],
      },
      {
        id: 'l7q7',
        question: 'How much does an Arrow 3 interceptor cost, and what makes this a strategic problem?',
        options: [
          '$500,000 \u2014 expensive but affordable in bulk',
          '$1 million \u2014 comparable to the threats it intercepts',
          '~$3.5 million \u2014 adversaries can force a launch with a $300,000 decoy',
          '$10 million \u2014 only used against nuclear threats',
        ],
        correctIndex: 2,
        explanation: 'At ~$3.5 million per Arrow 3, adversaries can force expensive interceptor launches with much cheaper decoy missiles \u2014 draining Israel\'s most critical defense layer.',
        linkedFacts: ['l7t2'],
      },
      {
        id: 'l7q8',
        question: 'What is the "cost-exchange ratio" problem in missile defense?',
        options: [
          'The cost of building defense systems versus buying them from allies',
          'The fundamental problem that defense consistently costs far more than attack, giving attackers an economic advantage',
          'The exchange rate between Israeli and Iranian currencies affecting weapons prices',
          'The cost of training operators versus automating the systems',
        ],
        correctIndex: 1,
        explanation: 'The cost-exchange ratio is the central unsolved problem of missile defense worldwide \u2014 cheap offensive weapons force expensive defensive responses, giving attackers an inherent economic advantage.',
        linkedFacts: ['l7t1', 'l7t2'],
      },
      // ── New questions for Level 7 ──
      {
        id: 'l7q9',
        question: 'How can adversaries exploit Israel\'s interceptor stockpile?',
        options: [
          'By hacking the defense system computers',
          'By launching cheap decoys that force the system to decide if each one is real or fake, draining the stockpile',
          'By attacking the factories that produce interceptors',
          'By jamming the radar so interceptors miss',
        ],
        correctIndex: 1,
        explanation: 'Adversaries can drain Israel\'s interceptor stockpile by launching cheap decoys — each decoy forces the system to decide if it\'s real or fake.',
        linkedFacts: ['l7t5'],
      },
      {
        id: 'l7q10',
        question: 'For the price of one Arrow 3 interceptor (~$3.5 million), how many Shahed drones could Iran produce?',
        options: ['About 10', 'About 50', 'About 175', 'About 500'],
        correctIndex: 2,
        explanation: 'Iran can produce Shahed drones for ~$20,000 each — for the price of one Arrow 3 ($3.5 million), they can build 175 drones.',
        linkedFacts: ['l7t6'],
      },
      {
        id: 'l7q11',
        question: 'What is Iron Beam\'s approximate effective range?',
        options: [
          'Over 100 km',
          '40-70 km like Iron Dome',
          'A few kilometers — designed for close-range threats only',
          'Unlimited range as long as it has power',
        ],
        correctIndex: 2,
        explanation: 'Iron Beam has a limited range of a few kilometers — it is designed to complement Iron Dome for close-range threats, not replace it.',
        linkedFacts: ['l7d5'],
      },
      {
        id: 'l7q12',
        question: 'Which country is co-investing with Israel in Iron Beam technology?',
        options: [
          'Germany',
          'The United Kingdom',
          'The United States',
          'France',
        ],
        correctIndex: 2,
        explanation: 'The US is co-investing in Iron Beam technology — the system may be deployed to protect US forces overseas as well.',
        linkedFacts: ['l7d6'],
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
