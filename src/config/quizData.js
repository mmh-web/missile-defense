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
  // ─── LEVEL 1: Southern Israel + Rockets & Iron Dome ──────────────
  1: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      // Screen 1: Southern Israel target questions (linked to l1t facts)
      {
        id: 'l1q1',
        question: 'How far is Sderot from the Gaza border?',
        options: ['Less than a mile (1 km)', 'About 5 miles (8 km)', 'About 15 miles (25 km)', 'About 25 miles (40 km)'],
        correctIndex: 0,
        explanation: 'Sderot sits less than a mile from the Gaza fence — its residents have just 15 seconds to reach shelter when a rocket launches.',
        linkedFacts: ['l1t1'],
      },
      {
        id: 'l1q2',
        question: 'Why is Ashkelon considered both a civilian center and a strategic target?',
        options: [
          'It has a large military base',
          'It is home to a major power station and desalination plant',
          'It houses the Knesset (parliament)',
          'It is Israel\'s capital city',
        ],
        correctIndex: 1,
        explanation: 'Ashkelon (pop. ~150,000) houses a major power station and desalination plant, making it a critical infrastructure target just 8 miles from Gaza.',
        linkedFacts: ['l1t2'],
      },
      {
        id: 'l1q3',
        question: 'What is Soroka Hospital in Beersheba known for?',
        options: [
          'It is the oldest hospital in Israel',
          'It is the region\'s only Level 1 trauma center',
          'It specializes in military medicine only',
          'It was built underground for protection',
        ],
        correctIndex: 1,
        explanation: 'Beersheba (pop. ~210,000) is home to Soroka Hospital — the Negev region\'s only Level 1 trauma center, 25 miles from Gaza.',
        linkedFacts: ['l1t3'],
      },
      {
        id: 'l1q4',
        question: 'What is the "Gaza Envelope"?',
        options: [
          'A defensive wall surrounding Gaza',
          'Over 50 small farming communities within 4 miles (7 km) of the Gaza border',
          'The Israeli military command post near Gaza',
          'A security zone inside Gaza',
        ],
        correctIndex: 1,
        explanation: 'The "Gaza Envelope" includes over 50 small communities within 4 miles of the border — places like Kfar Aza and Be\'eri were devastated on October 7, 2023.',
        linkedFacts: ['l1t4'],
      },
      {
        id: 'l1q5',
        question: 'How many Israelis live within rocket range of Gaza?',
        options: ['About 100,000', 'About 500,000', 'Over one million', 'Over five million'],
        correctIndex: 2,
        explanation: 'Over one million Israelis — roughly 12% of the population — live within rocket range of Gaza.',
        linkedFacts: ['l1t5'],
      },
      {
        id: 'l1q6',
        question: 'What is "Tzeva Adom" (Color Red)?',
        options: [
          'A code name for a military operation',
          'The rocket alert warning system that uses sirens and smartphone apps',
          'The color of Iron Dome interceptors',
          'A diplomatic crisis level',
        ],
        correctIndex: 1,
        explanation: 'The "Color Red" (Tzeva Adom) alert system warns residents by siren and smartphone app — in border towns, it can sound dozens of times a day during conflict.',
        linkedFacts: ['l1t6'],
      },
      // Screen 2: Rockets & Iron Dome questions (linked to l1d facts)
      {
        id: 'l1q7',
        question: 'What are Qassam rockets built from?',
        options: [
          'Advanced military-grade explosives',
          'Sugar, fertilizer, and metal pipes',
          'Imported Iranian components',
          'Recycled vehicle engines',
        ],
        correctIndex: 1,
        explanation: 'Qassam rockets are built in Gaza from sugar, fertilizer, and metal pipes — costing about $800 each and completely unguided.',
        linkedFacts: ['l1d1'],
      },
      {
        id: 'l1q8',
        question: 'How many rockets and mortars have been fired from Gaza into Israel since 2001?',
        options: ['About 2,000', 'About 5,000', 'Over 20,000', 'Over 100,000'],
        correctIndex: 2,
        explanation: 'Over 20,000 rockets and mortars have been fired from Gaza since 2001 — with a range of 3-28 miles, they can strike from Sderot to Beersheba.',
        linkedFacts: ['l1d2'],
      },
      {
        id: 'l1q9',
        question: 'What is the cost ratio between a Qassam rocket and the Tamir interceptor that destroys it?',
        options: ['5:1', '20:1', '62:1', '100:1'],
        correctIndex: 2,
        explanation: 'A Qassam costs ~$800 vs. the Tamir at ~$50,000 — the 62:1 cost ratio is itself a strategic weapon for the attacker.',
        linkedFacts: ['l1d3'],
      },
      {
        id: 'l1q10',
        question: 'What year did Iron Dome become operational, and what is its success rate?',
        options: ['2005, ~70% success', '2008, ~80% success', '2011, 90%+ success', '2015, 95%+ success'],
        correctIndex: 2,
        explanation: 'Iron Dome became operational in 2011 with a 90%+ success rate — it only fires if a rocket threatens a populated area.',
        linkedFacts: ['l1d4'],
      },
      {
        id: 'l1q11',
        question: 'Who developed Iron Dome?',
        options: ['Israel Aerospace Industries (IAI)', 'Elbit Systems', 'Rafael Advanced Defense Systems', 'Boeing'],
        correctIndex: 2,
        explanation: 'Iron Dome was developed by Rafael Advanced Defense Systems with US backing. Each battery has a radar, control center, and 3-4 launchers.',
        linkedFacts: ['l1d5'],
      },
      {
        id: 'l1q12',
        question: 'Why doesn\'t Iron Dome fire at every incoming rocket?',
        options: [
          'It can only track one rocket at a time',
          'It lets rockets headed for open fields pass, saving interceptors for real threats',
          'Its radar cannot detect all rockets',
          'International law prevents it',
        ],
        correctIndex: 1,
        explanation: 'Iron Dome\'s "selective fire" is its secret weapon — by letting rockets headed for open fields pass harmlessly, it saves Tamir interceptors for rockets that truly threaten lives.',
        linkedFacts: ['l1d6'],
      },
    ],
  },

  // ─── LEVEL 2: Northern Israel + Attack Drones ──────────────
  2: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      // Screen 1: Northern Israel target questions (linked to l2t facts)
      {
        id: 'l2q1',
        question: 'How far is Kiryat Shmona from the Lebanese border?',
        options: ['Less than 1 mile', 'About 3 miles (5 km)', 'About 10 miles (16 km)', 'About 25 miles (40 km)'],
        correctIndex: 1,
        explanation: 'Kiryat Shmona sits just 3 miles from the Lebanese border — in October 2023, the entire city was evacuated for over a year.',
        linkedFacts: ['l2t1'],
      },
      {
        id: 'l2q2',
        question: 'What is unique about the town of Metula?',
        options: [
          'It is Israel\'s largest northern city',
          'It is Israel\'s northernmost town, built against the border fence',
          'It houses a major military base',
          'It is the site of Iron Dome\'s headquarters',
        ],
        correctIndex: 1,
        explanation: 'Metula (pop. ~2,000) is Israel\'s northernmost town — literally built against the Lebanese border fence, with Hezbollah positions visible from residents\' backyards.',
        linkedFacts: ['l2t2'],
      },
      {
        id: 'l2q3',
        question: 'How many rockets did Hezbollah fire at northern Israel during the 2006 war?',
        options: ['About 500', 'About 1,000', 'Over 4,000', 'Over 10,000'],
        correctIndex: 2,
        explanation: 'Hezbollah fired over 4,000 rockets at northern Israel during the 2006 war — many aimed at Haifa, Israel\'s third-largest city.',
        linkedFacts: ['l2t3'],
      },
      {
        id: 'l2q4',
        question: 'Which northern city\'s hospital was struck by Hezbollah rockets during the 2006 war?',
        options: ['Haifa', 'Kiryat Shmona', 'Nahariya', 'Tiberias'],
        correctIndex: 2,
        explanation: 'Nahariya (pop. ~60,000), just 6 miles from Lebanon, had its hospital struck by rockets during the 2006 war and has been targeted in every northern conflict.',
        linkedFacts: ['l2t4'],
      },
      {
        id: 'l2q5',
        question: 'How many northern residents were evacuated in October 2023?',
        options: ['About 5,000', 'About 20,000', 'Over 80,000', 'Over 500,000'],
        correctIndex: 2,
        explanation: 'Over 80,000 northern residents were evacuated in October 2023 and couldn\'t return for over a year — entire communities became ghost towns.',
        linkedFacts: ['l2t5'],
      },
      // Screen 2: Attack Drones questions (linked to l2d facts)
      {
        id: 'l2q7',
        question: 'What makes the Shahed-136 a "kamikaze" drone?',
        options: [
          'It is piloted by a human operator',
          'The drone IS the weapon — it crashes into the target and detonates on impact',
          'It self-destructs if detected by radar',
          'It drops bombs and then returns to base',
        ],
        correctIndex: 1,
        explanation: 'The Shahed-136 is a "kamikaze" drone — it crashes directly into its target and detonates on impact. Iran manufactures them and supplies them to Hezbollah and Hamas.',
        linkedFacts: ['l2d1'],
      },
      {
        id: 'l2q8',
        question: 'How do attack drones avoid radar detection?',
        options: [
          'They use stealth coatings',
          'They jam radar signals electronically',
          'They fly low (300-6,000 feet) and hug the terrain',
          'They are too small to reflect radar waves',
        ],
        correctIndex: 2,
        explanation: 'Attack drones fly low (300-6,000 feet) and slow (~115 mph), hugging the terrain to avoid radar — making them harder to detect than rockets or missiles.',
        linkedFacts: ['l2d2'],
      },
      {
        id: 'l2q9',
        question: 'What is the range of the Shahed-136 drone?',
        options: ['50 miles (80 km)', '300 miles (500 km)', '1,550 miles (2,500 km)', '5,000 miles (8,000 km)'],
        correctIndex: 2,
        explanation: 'The Shahed-136 has a range of 1,550 miles (2,500 km) — from Iran it takes 7+ hours to reach Israel, but from Lebanon the flight time is just minutes.',
        linkedFacts: ['l2d3'],
      },
      {
        id: 'l2q10',
        question: 'Why are drones launched in swarms of 10-50+?',
        options: [
          'They need to fly in formation for GPS accuracy',
          'To overwhelm air defenses so some get through to hit targets',
          'Each drone carries a piece of a larger weapon',
          'They communicate with each other to find targets',
        ],
        correctIndex: 1,
        explanation: 'Drones are launched in swarms of 10-50+ to overwhelm air defenses — even if most are shot down, the few that get through can strike critical targets like power plants or airfields.',
        linkedFacts: ['l2d4'],
      },
      {
        id: 'l2q11',
        question: 'How much does a single attack drone cost compared to an interceptor?',
        options: [
          'Drones cost more than interceptors',
          'They cost about the same (~$50,000)',
          'At ~$20,000, drones are 2.5x cheaper than interceptors',
          'Drones are free since they are homemade',
        ],
        correctIndex: 2,
        explanation: 'At ~$20,000 each, drones are 2.5x cheaper than the interceptors used to destroy them — attackers can afford to lose dozens while draining the defender\'s missile supply.',
        linkedFacts: ['l2d5'],
      },
      {
        id: 'l2q12',
        question: 'What gives attack drones an advantage over unguided Qassam rockets?',
        options: [
          'Drones fly faster than rockets',
          'Drones are invisible to all radar systems',
          'Drones use GPS navigation and can hit specific buildings',
          'Drones carry nuclear warheads',
        ],
        correctIndex: 2,
        explanation: 'Unlike unguided Qassam rockets, drones use GPS navigation and can be pre-programmed to hit specific buildings — turning a cheap weapon into a precision-guided threat.',
        linkedFacts: ['l2d6'],
      },
    ],
  },

  // ─── LEVEL 3: Central Israel + Cruise Missiles & David's Sling ────────────
  3: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      // Screen 1: Central Israel target questions (linked to l3t facts)
      {
        id: 'l3q1',
        question: 'What is the metropolitan population of the Tel Aviv area?',
        options: ['About 500,000', 'About 1 million', 'About 2 million', 'Over 4 million'],
        correctIndex: 3,
        explanation: 'Tel Aviv (pop. ~460,000, metro 4+ million) is Israel\'s economic engine — home to the stock exchange and most major tech companies.',
        linkedFacts: ['l3t1'],
      },
      {
        id: 'l3q2',
        question: 'Why is Jerusalem considered one of the most sensitive targets on Earth?',
        options: [
          'It is the largest city in the Middle East',
          'It is holy to Judaism, Christianity, and Islam',
          'It houses all of Israel\'s military command centers',
          'It is built entirely underground',
        ],
        correctIndex: 1,
        explanation: 'Jerusalem (pop. ~1 million) is holy to three religions — home to the Western Wall, Church of the Holy Sepulchre, and Al-Aqsa Mosque.',
        linkedFacts: ['l3t2'],
      },
      {
        id: 'l3q3',
        question: 'How narrow is Israel at its narrowest point near Netanya?',
        options: ['About 2 miles (3 km)', 'About 9 miles (15 km)', 'About 30 miles (50 km)', 'About 60 miles (100 km)'],
        correctIndex: 1,
        explanation: 'At its narrowest point near Netanya, Israel is just 9 miles (15 km) wide — a cruise missile from the east could cross the entire country in under a minute.',
        linkedFacts: ['l3t3'],
      },
      {
        id: 'l3q4',
        question: 'What happens when missile attacks target Ben Gurion Airport?',
        options: [
          'Flights are diverted to backup airports across the country',
          'The airport\'s defense system intercepts all threats',
          'The country is instantly cut off from the outside world',
          'Only domestic flights are affected',
        ],
        correctIndex: 2,
        explanation: 'Ben Gurion is Israel\'s only major international airport — missile attacks force it to shut down, instantly cutting the country off from the world.',
        linkedFacts: ['l3t4'],
      },
      {
        id: 'l3q5',
        question: 'What fraction of Israel\'s population lives in the central corridor between Tel Aviv and Jerusalem?',
        options: ['About a quarter', 'About a third', 'Close to half', 'About 90%'],
        correctIndex: 2,
        explanation: 'Nearly 5 million people — close to half of Israel\'s population — live in the narrow central corridor, making it the most densely populated target zone.',
        linkedFacts: ['l3t5'],
      },
      {
        id: 'l3q6',
        question: 'What is "Silicon Wadi"?',
        options: [
          'Israel\'s main desalination region',
          'A desert military training area',
          'The tech corridor from Tel Aviv to Herzliya with thousands of startups and global R&D centers',
          'An underground communications bunker',
        ],
        correctIndex: 2,
        explanation: '"Silicon Wadi" hosts thousands of startups plus R&D centers for Google, Apple, and Microsoft — a strike here would ripple through the global tech economy.',
        linkedFacts: ['l3t6'],
      },
      // Screen 2: Cruise Missiles & David's Sling questions (linked to l3d facts)
      {
        id: 'l3q7',
        question: 'How do cruise missiles differ from ballistic missiles?',
        options: [
          'Cruise missiles fly faster',
          'Cruise missiles fly like aircraft — low altitude, jet-powered, with wings',
          'Cruise missiles follow a high arc into space',
          'There is no difference',
        ],
        correctIndex: 1,
        explanation: 'Cruise missiles fly like small aircraft — jet-powered with wings, they hug terrain at low altitude and use GPS for meter-level accuracy.',
        linkedFacts: ['l3d1'],
      },
      {
        id: 'l3q8',
        question: 'What is the range of Iran\'s Paveh cruise missile?',
        options: ['About 125 miles', 'About 500 miles', 'Over 1,000 miles (1,600 km)', 'Over 3,000 miles'],
        correctIndex: 2,
        explanation: 'Iran\'s Paveh has a range of over 1,000 miles (1,600 km) — enough to reach central Israel from deep inside Iranian territory.',
        linkedFacts: ['l3d2'],
      },
      {
        id: 'l3q9',
        question: 'Why are cruise missiles difficult to detect on radar?',
        options: [
          'They are made of stealth material',
          'They fly above radar range',
          'They stay low and hug the terrain, hiding from distant radar',
          'They emit jamming signals',
        ],
        correctIndex: 2,
        explanation: 'Unlike ballistic missiles that arc high, cruise missiles stay low and hug terrain — making them nearly invisible to distant radar until dangerously close.',
        linkedFacts: ['l3d3'],
      },
      {
        id: 'l3q10',
        question: 'What gap does David\'s Sling fill in Israel\'s defense?',
        options: [
          'It replaces Iron Dome for short-range threats',
          'It fills the gap between Iron Dome (short-range) and Arrow (long-range)',
          'It defends against nuclear threats only',
          'It is designed only for drone interception',
        ],
        correctIndex: 1,
        explanation: 'David\'s Sling became operational in 2017, filling the gap between Iron Dome and Arrow — using Stunner interceptors with hit-to-kill technology.',
        linkedFacts: ['l3d4'],
      },
      {
        id: 'l3q11',
        question: 'What type of guidance does the Stunner interceptor use?',
        options: [
          'GPS guidance only',
          'A dual-seeker system using both infrared and radar',
          'Laser guidance from a ground operator',
          'Magnetic field tracking',
        ],
        correctIndex: 1,
        explanation: 'The Stunner has a dual-seeker system — both infrared and radar guidance — allowing it to track maneuvering cruise missiles at ranges of 25-185 miles.',
        linkedFacts: ['l3d5'],
      },
      {
        id: 'l3q12',
        question: 'Who developed David\'s Sling, and how much does each Stunner interceptor cost?',
        options: [
          'IAI and Boeing — ~$50,000 each',
          'Rafael and Raytheon — ~$1 million each',
          'Elbit and Lockheed Martin — ~$3.5 million each',
          'Rafael and Boeing — ~$500,000 each',
        ],
        correctIndex: 1,
        explanation: 'David\'s Sling was jointly developed by Rafael (Israel) and Raytheon (US). Each Stunner costs about $1 million — expensive, but far cheaper than what it protects.',
        linkedFacts: ['l3d6'],
      },
    ],
  },

  // ─── LEVEL 4: Strategic Targets — Infrastructure + Arrow 2 ──
  4: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      {
        id: 'l4q1',
        question: 'How wide is Israel at its narrowest point?',
        options: ['9 miles (15 km)', '30 miles (50 km)', '60 miles (100 km)', '125 miles (200 km)'],
        correctIndex: 0,
        explanation: 'Israel is only 9 miles (15 km) wide at its narrowest point — making its concentrated coastal infrastructure vulnerable to attack from multiple directions.',
        linkedFacts: ['l4t1'],
      },
      {
        id: 'l4q2',
        question: 'Why did Israel shut down its largest ammonia storage tank in Haifa in 2017?',
        options: ['Environmental regulations', 'Hezbollah threatened to strike it with missiles', 'It was no longer needed', 'An accidental chemical leak'],
        correctIndex: 1,
        explanation: 'Hezbollah\'s leader publicly threatened that striking BAZAN\'s ammonia tanks would have "the effect of a nuclear bomb" — Israel shut down the facility the following year.',
        linkedFacts: ['l4t2'],
      },
      {
        id: 'l4q3',
        question: 'What percentage of Israel\'s drinking water comes from desalination?',
        options: ['About 20%', 'About 40%', 'About 60%', 'Over 80%'],
        correctIndex: 3,
        explanation: 'Israel gets over 80% of its drinking water from desalination — the Sorek plant south of Tel Aviv is one of the world\'s largest.',
        linkedFacts: ['l4t3'],
      },
      {
        id: 'l4q4',
        question: 'What distinguishes the Orot Rabin power station in Hadera?',
        options: ['It is nuclear-powered', 'It is Israel\'s largest power station', 'It is underground', 'It runs entirely on solar power'],
        correctIndex: 1,
        explanation: 'Orot Rabin is Israel\'s largest power station at 2,590 megawatts — a single complex powering over a million homes.',
        linkedFacts: ['l4t4'],
      },
      {
        id: 'l4q5',
        question: 'Which site is one of Iran\'s top stated strategic targets in Israel?',
        options: ['Tel Aviv', 'The Knesset', 'Dimona Nuclear Reactor', 'Ben Gurion Airport'],
        correctIndex: 2,
        explanation: 'The Dimona nuclear reactor is one of Iran\'s top stated strategic targets — Iranian missiles landed in the Dimona area during the October 2024 attack.',
        linkedFacts: ['l4t5'],
      },
      {
        id: 'l4q6',
        question: 'The Kirya in Tel Aviv is often compared to which building?',
        options: ['The White House', 'The Pentagon', 'NATO Headquarters', 'The United Nations'],
        correctIndex: 1,
        explanation: 'The Kirya is often called "Israel\'s Pentagon" — it houses IDF headquarters, the Ministry of Defense, and top intelligence offices.',
        linkedFacts: ['l4t6'],
      },
      // Screen 2: Ballistic Missiles + Arrow 2 questions (linked to l4d facts)
      {
        id: 'l4q7',
        question: 'How long does a ballistic missile from Iran take to reach Israel?',
        options: ['About 1 hour', 'About 30 minutes', 'Under 12 minutes', 'About 5 minutes'],
        correctIndex: 2,
        explanation: 'Iranian ballistic missiles can reach Israel in under 12 minutes — giving very little time for detection, tracking, and interception.',
        linkedFacts: ['l4d1'],
      },
      {
        id: 'l4q8',
        question: 'How many ballistic missiles did Iran launch at Israel in October 2024?',
        options: ['About 50', 'About 100', 'About 200', 'About 500'],
        correctIndex: 2,
        explanation: 'Iran launched approximately 200 ballistic missiles at Israel in October 2024 — the largest ballistic missile attack in history.',
        linkedFacts: ['l4d2'],
      },
      {
        id: 'l4q9',
        question: 'What event made building Arrow 2 a national priority for Israel?',
        options: [
          'The 1967 Six-Day War',
          'Iraq\'s 39 Scud strikes on Israel in 1991',
          'The 2006 Lebanon War',
          'The October 7th attack in 2023',
        ],
        correctIndex: 1,
        explanation: 'Iraq launched 39 Scud missiles at Israel during the 1991 Gulf War — the trauma made building Arrow a national priority.',
        linkedFacts: ['l4d3'],
      },
      {
        id: 'l4q10',
        question: 'At what altitude does Arrow 2 intercept ballistic missiles?',
        options: ['3 miles (5 km)', '10 miles (16 km)', '30 miles (50 km)', '62 miles (100 km)'],
        correctIndex: 2,
        explanation: 'Arrow 2 intercepts at up to 30 miles (50 km) — roughly 5x a commercial airliner\'s cruising altitude, using a directed fragmentation warhead.',
        linkedFacts: ['l4d4'],
      },
      {
        id: 'l4q11',
        question: 'How much has the US invested in the Arrow program since 1989?',
        options: ['About $500 million', 'About $1 billion', 'Over $2.4 billion', 'Over $10 billion'],
        correctIndex: 2,
        explanation: 'The US has invested over $2.4 billion in the Arrow program, funding 50-80% of its development — a cornerstone of US-Israel defense cooperation.',
        linkedFacts: ['l4d5'],
      },
      {
        id: 'l4q12',
        question: 'How many targets can the Green Pine radar track simultaneously?',
        options: ['5', '10', '20', '30'],
        correctIndex: 3,
        explanation: 'The Green Pine radar tracks over 30 targets at ranges over 300 miles (500 km) and guides the Arrow to within 13 feet (4 m) of its target.',
        linkedFacts: ['l4d6'],
      },
      // ED3: Application/analysis questions for deeper learning
      {
        id: 'l4q13',
        question: 'Why can\'t Iron Dome intercept a ballistic missile from Iran?',
        options: [
          'Iron Dome is broken',
          'Ballistic missiles fly too high and fast — Iron Dome is designed for short-range, low-altitude threats',
          'Iron Dome can only shoot down rockets from Gaza',
          'Ballistic missiles are too small to detect',
        ],
        correctIndex: 1,
        explanation: 'Iron Dome operates at low altitude (up to ~10 km) against slow targets. Ballistic missiles reenter at Mach 8+ from altitudes of 50+ km — a completely different engagement envelope requiring Arrow 2.',
        linkedFacts: ['l4d4'],
      },
      {
        id: 'l4q14',
        question: 'If Iran launches 200 ballistic missiles, each costing ~$100K, and each Arrow 2 interceptor costs ~$2 million, what is the defender\'s cost disadvantage?',
        options: [
          'Defense costs about the same as attack',
          'Defense costs about 5x more than attack',
          'Defense costs about 20x more than attack',
          'Defense costs about 100x more than attack',
        ],
        correctIndex: 2,
        explanation: 'Attack: 200 × $100K = $20M. Defense: 200 × $2M = $400M. That\'s a 20:1 cost ratio favoring the attacker — the core "cost-exchange" problem in missile defense.',
        linkedFacts: ['l4d5'],
      },
    ],
  },

  // ─── LEVEL 5: Army Bases + Hypersonics + Arrow 3 ────────
  5: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 250,
    questions: [
      // Screen 1: Army Base questions (linked to l5t facts)
      {
        id: 'l5q1',
        question: 'Which Israeli air base is home to the country\'s entire F-35 stealth fighter fleet?',
        options: ['Ramat David AFB', 'Tel Nof AFB', 'Nevatim AFB', 'Ramon AFB'],
        correctIndex: 2,
        explanation: 'Nevatim AFB in the Negev houses Israel\'s entire F-35 "Adir" fleet — Iran fired missiles at it in October 2024.',
        linkedFacts: ['l5t1'],
      },
      {
        id: 'l5q2',
        question: 'What makes Palmachim AFB unique among military bases worldwide?',
        options: [
          'It is the largest base in the Middle East',
          'It is a spaceport that launches satellites and tests missile defenses',
          'It houses nuclear weapons',
          'It is entirely underground',
        ],
        correctIndex: 1,
        explanation: 'Palmachim is Israel\'s spaceport — launching satellites, testing Arrow interceptors, and serving as one of the world\'s few orbital launch sites.',
        linkedFacts: ['l5t2'],
      },
      {
        id: 'l5q3',
        question: 'Unit 8200, based at Glilot near Tel Aviv, is often compared to which US agency?',
        options: ['CIA', 'FBI', 'NSA', 'Pentagon'],
        correctIndex: 2,
        explanation: 'Unit 8200 is Israel\'s signals intelligence unit, often compared to the NSA. Its alumni have founded tech companies worth over $160 billion combined.',
        linkedFacts: ['l5t3'],
      },
      {
        id: 'l5q4',
        question: 'What is Sdot Micha believed to house?',
        options: [
          'Israel\'s F-35 fleet',
          'Israel\'s Jericho ballistic missiles — its strategic deterrent',
          'Israel\'s main radar installation',
          'Iron Dome production facilities',
        ],
        correctIndex: 1,
        explanation: 'Sdot Micha is believed to house Israel\'s Jericho ballistic missiles — the country\'s ultimate strategic deterrent, protected by its own Arrow batteries.',
        linkedFacts: ['l5t4'],
      },
      {
        id: 'l5q5',
        question: 'Why is Ramat David AFB strategically critical?',
        options: [
          'It houses Israel\'s nuclear arsenal',
          'It is the northernmost fighter base, about 30 miles (50 km) from the Lebanese border',
          'It is Israel\'s only naval air station',
          'It is where Iron Dome was developed',
        ],
        correctIndex: 1,
        explanation: 'Ramat David AFB is the northernmost fighter base — about 30 miles (50 km) from the Lebanese border, making it Hezbollah\'s first target in any northern conflict.',
        linkedFacts: ['l5t5'],
      },
      {
        id: 'l5q6',
        question: 'What historic distinction does Tel Nof AFB hold?',
        options: [
          'First base to operate Iron Dome',
          'First country outside the US to fly the F-15',
          'Oldest air base in the Middle East',
          'Only base with underground hangars',
        ],
        correctIndex: 1,
        explanation: 'Israel received its first F-15 Eagles at Tel Nof in 1976 — making it the first country outside the United States to operate the F-15.',
        linkedFacts: ['l5t6'],
      },
      // Screen 2: Hypersonics + Arrow 3 questions (linked to l5d facts)
      {
        id: 'l5q7',
        question: 'At what minimum speed does a weapon qualify as hypersonic?',
        options: ['Mach 1', 'Mach 3', 'Mach 5', 'Mach 10'],
        correctIndex: 2,
        explanation: 'Hypersonic weapons travel at Mach 5 or above — over 3,700 mph. They can maneuver unpredictably, making them extremely difficult to intercept.',
        linkedFacts: ['l5d1'],
      },
      {
        id: 'l5q8',
        question: 'How quickly can a Mach 7 hypersonic weapon cross 60 miles?',
        options: ['About 10 minutes', 'About 5 minutes', 'About 40 seconds', 'About 10 seconds'],
        correctIndex: 2,
        explanation: 'A hypersonic weapon at Mach 7 crosses 60 miles (100 km) in about 40 seconds — leaving almost no time for traditional defense systems to react.',
        linkedFacts: ['l5d2'],
      },
      {
        id: 'l5q9',
        question: 'Which countries are developing hypersonic weapons?',
        options: [
          'Only Russia and China',
          'Russia, China, the United States, Iran, and North Korea',
          'Only the United States and Israel',
          'All NATO countries',
        ],
        correctIndex: 1,
        explanation: 'Russia, China, the U.S., Iran, and North Korea are all developing hypersonic weapons — Russia\'s Avangard reportedly reaches Mach 20, while the U.S. is testing its own programs.',
        linkedFacts: ['l5d3'],
      },
      {
        id: 'l5q10',
        question: 'Where does Arrow 3 intercept incoming threats?',
        options: [
          'At ground level',
          'In the lower atmosphere',
          'In the upper atmosphere',
          'In space, outside the atmosphere',
        ],
        correctIndex: 3,
        explanation: 'Arrow 3 intercepts targets in space — outside the atmosphere, using pure hit-to-kill kinetic energy with no explosive warhead.',
        linkedFacts: ['l5d4'],
      },
      {
        id: 'l5q11',
        question: 'At what altitude can Arrow 3 engage threats?',
        options: ['Up to 6 miles', 'Up to 30 miles', 'Up to 55 miles', 'Over 62 miles (100 km)'],
        correctIndex: 3,
        explanation: 'Arrow 3 can engage threats at altitudes over 62 miles (100 km) — successfully tested against a real target in space in 2019.',
        linkedFacts: ['l5d5'],
      },
      {
        id: 'l5q12',
        question: 'Why is intercepting threats in space safer for people on the ground?',
        options: [
          'Space intercepts create no debris at all',
          'Debris burns up on reentry, protecting people from falling warhead fragments',
          'The explosion is contained by the vacuum of space',
          'Space intercepts use non-explosive methods that leave no debris',
        ],
        correctIndex: 1,
        explanation: 'Destroying threats in space means debris burns up on reentry — protecting people on the ground from falling warhead fragments.',
        linkedFacts: ['l5d6'],
      },
      // ED3: Application/analysis questions
      {
        id: 'l5q13',
        question: 'A hypersonic glide vehicle is detected at Mach 7 in the upper atmosphere. Why is Arrow 3 the right choice instead of Arrow 2?',
        options: [
          'Arrow 3 is cheaper',
          'Arrow 3 operates in space where it can intercept before atmospheric reentry makes the threat harder to hit',
          'Arrow 2 is only for slow targets',
          'Arrow 3 has a larger warhead',
        ],
        correctIndex: 1,
        explanation: 'Arrow 3 intercepts in space (exoatmospheric) — catching the threat before it reenters the atmosphere where its speed and maneuverability make interception much harder.',
        linkedFacts: ['l5d4', 'l5d5'],
      },
      {
        id: 'l5q14',
        question: 'Why would an attacker target military bases like Nevatim with precision weapons rather than cheap rockets?',
        options: [
          'Rockets are illegal under international law',
          'Unguided rockets lack the range and accuracy to hit specific hardened targets hundreds of miles away',
          'Military bases have no air defenses',
          'Rockets cost more than missiles',
        ],
        correctIndex: 1,
        explanation: 'Bases like Nevatim are 1,000+ km from Iran — only precision ballistic missiles or hypersonic weapons have the range and accuracy to strike specific facilities at that distance.',
        linkedFacts: ['l5t1'],
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
        question: 'Which threat actor launches attacks from the farthest distance — over 1,250 miles away?',
        options: ['Hezbollah in Lebanon', 'Hamas in Gaza', 'Yemen\'s Houthi rebels', 'Syrian military forces'],
        correctIndex: 2,
        explanation: 'Yemen\'s Houthi rebels, backed by Iran, have launched ballistic missiles and drones at Israel from over 1,250 miles (2,000 km) away — the farthest threat origin.',
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
          '620 miles long, 310 miles wide',
          '290 miles long, 85 miles wide',
          '125 miles long, 50 miles wide',
          '500 miles long, 185 miles wide',
        ],
        correctIndex: 1,
        explanation: 'Israel is one of the smallest countries facing multi-front missile threats — only 290 miles (470 km) long and 85 miles (135 km) wide at its widest.',
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
      // ED3: Application/analysis questions
      {
        id: 'l6q13',
        question: 'Iran launches ballistic missiles while Gaza fires rockets simultaneously. Why does this "multi-front" attack strain defenses more than either attack alone?',
        options: [
          'The missiles travel at the same speed',
          'Operators must track and assign different interceptor systems to different threat types arriving from different directions at the same time',
          'Both threats use the same interceptor type',
          'Multi-front attacks are actually easier because you can see all threats at once',
        ],
        correctIndex: 1,
        explanation: 'Multi-front attacks force operators to split attention across threat types, directions, and interceptor systems simultaneously — dramatically increasing the chance of errors.',
        linkedFacts: ['l6d1', 'l6d4'],
      },
      {
        id: 'l6q14',
        question: 'If you have limited Arrow 2 interceptors and Iran launches both real warheads and cheap decoys, what is the strategic dilemma?',
        options: [
          'There is no dilemma — shoot everything',
          'You must decide which targets to intercept, risking letting a real warhead through to conserve ammo for later waves',
          'Decoys are easy to distinguish from real warheads',
          'You should switch to Iron Dome instead',
        ],
        correctIndex: 1,
        explanation: 'With limited interceptors and indistinguishable decoys, defenders face an agonizing tradeoff: waste expensive ammo on decoys, or risk letting a real warhead through.',
        linkedFacts: ['l6d4'],
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
        options: ['~$500,000', '~$1 million', '~$2-3 million', '~$10 million'],
        correctIndex: 2,
        explanation: 'An Arrow 3 interceptor costs ~$2-3 million — adversaries can force a launch with a much cheaper decoy missile.',
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

    // Split shown facts into screen 1 (threat/target) and screen 2 (defense/weapon)
    // Fact IDs follow pattern: l{level}t{n} for targets, l{level}d{n} for defense
    const shownTargetIds = new Set([...idSet].filter(id => /l\d+t/.test(id)));
    const shownDefenseIds = new Set([...idSet].filter(id => /l\d+d/.test(id)));

    // Try to guarantee 1 question from each screen for balanced coverage
    if (n >= 2 && shownTargetIds.size > 0 && shownDefenseIds.size > 0) {
      const targetQs = pool.filter(q =>
        q.linkedFacts && q.linkedFacts.some(fid => shownTargetIds.has(fid))
      );
      const defenseQs = pool.filter(q =>
        q.linkedFacts && q.linkedFacts.some(fid => shownDefenseIds.has(fid))
      );

      if (targetQs.length >= 1 && defenseQs.length >= 1) {
        const t = targetQs[Math.floor(Math.random() * targetQs.length)];
        const remainingDefenseQs = defenseQs.filter(q => q.id !== t.id);
        if (remainingDefenseQs.length >= 1) {
          const d = remainingDefenseQs[Math.floor(Math.random() * remainingDefenseQs.length)];
          return [t, d];
        }
      }
    }

    // Fallback: filter to any shown facts and pick randomly
    const filtered = pool.filter(q =>
      q.linkedFacts && q.linkedFacts.some(fid => idSet.has(fid))
    );
    if (filtered.length >= n) {
      pool = filtered;
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
