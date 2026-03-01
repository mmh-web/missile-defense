// ============================================================
// MISSILE DEFENSE — Quiz Question Bank
// ============================================================
//
// Each level has 8 questions; 2 are randomly selected per playthrough.
// Every answer to every question is explicitly taught in the briefing
// content that precedes it.
//
// correctIndex: 0-based index into the options array
// ============================================================

export const QUIZ_DATA = {
  // ─── LEVEL 1: Rockets from Gaza + Iron Dome ──────────────
  1: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 50,
    questions: [
      {
        id: 'l1q1',
        question: 'What year did Iron Dome become operational?',
        options: ['2001', '2006', '2011', '2017'],
        correctIndex: 2,
        explanation: 'Iron Dome became operational in 2011.',
      },
      {
        id: 'l1q2',
        question: 'Iron Dome was developed in response to which conflict?',
        options: ['1967 Six-Day War', '1973 Yom Kippur War', '2006 Lebanon War', '2014 Gaza War'],
        correctIndex: 2,
        explanation: 'Development began after the 2006 Lebanon War, when Hezbollah launched thousands of rockets into northern Israel.',
      },
      {
        id: 'l1q3',
        question: "What is the name of Iron Dome's interceptor missile?",
        options: ['Arrow', 'Barak', 'Patriot', 'Tamir'],
        correctIndex: 3,
        explanation: 'The Tamir interceptor missile is used by Iron Dome.',
      },
      {
        id: 'l1q4',
        question: 'Where are Qassam rockets primarily manufactured?',
        options: ['Iran', 'Lebanon', 'Gaza', 'Syria'],
        correctIndex: 2,
        explanation: 'Qassam rockets are built in Gaza using basic materials like sugar and fertilizer.',
      },
      {
        id: 'l1q5',
        question: 'Approximately how much does a single Iron Dome interceptor cost?',
        options: ['~$5,000', '~$50,000', '~$500,000', '~$5,000,000'],
        correctIndex: 1,
        explanation: 'Each Tamir interceptor costs approximately $50,000.',
      },
      {
        id: 'l1q6',
        question: 'Which Israeli city near Gaza has been most targeted by Qassam rockets?',
        options: ['Tel Aviv', 'Haifa', 'Sderot', 'Eilat'],
        correctIndex: 2,
        explanation: 'Sderot, located just 1 km from the Gaza border, has been the most frequently targeted city.',
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
      },
      {
        id: 'l1q8',
        question: 'A Qassam costs ~$800 to build. How much does the Tamir interceptor that destroys it cost?',
        options: ['~$800', '~$5,000', '~$50,000', '~$500,000'],
        correctIndex: 2,
        explanation: 'The Tamir costs approximately $50,000 \u2014 this cost imbalance is a strategic weapon.',
      },
    ],
  },

  // ─── LEVEL 2: Attack Drones from Lebanon/Syria ──────────
  2: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 50,
    questions: [
      {
        id: 'l2q1',
        question: 'The Shahed-136 kamikaze drone is manufactured by which country?',
        options: ['China', 'Iran', 'Russia', 'Syria'],
        correctIndex: 1,
        explanation: 'The Shahed-136 is manufactured by Iran and supplied to groups like Hezbollah.',
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
      },
      {
        id: 'l2q3',
        question: 'At what altitude do attack drones typically fly?',
        options: ['High altitude (30+ km)', 'Medium altitude (10-20 km)', 'Low altitude (under 5 km)', 'Exo-atmospheric'],
        correctIndex: 2,
        explanation: 'Attack drones fly at low altitude, making them hard to detect on radar.',
      },
      {
        id: 'l2q4',
        question: 'Approximately how much does a Shahed-136 drone cost to produce?',
        options: ['~$2,000', '~$20,000', '~$200,000', '~$2,000,000'],
        correctIndex: 1,
        explanation: 'Shahed-136 drones cost roughly $20,000 each, cheap enough to launch in swarms.',
      },
      {
        id: 'l2q5',
        question: 'Which defense system intercepts attack drones?',
        options: ['Arrow 2', "David's Sling", 'Iron Dome', 'Arrow 3'],
        correctIndex: 2,
        explanation: 'Iron Dome intercepts both drones and short-range rockets.',
      },
      {
        id: 'l2q6',
        question: 'How do attack drones compare to rockets in speed?',
        options: ['Much faster', 'About the same', 'Much slower', 'Depends on altitude'],
        correctIndex: 2,
        explanation: 'Drones fly at Mach 0.2-0.5, much slower than rockets which travel at Mach 1-2.',
      },
      {
        id: 'l2q7',
        question: 'Which Lebanese group uses Iranian-made drones against Israel?',
        options: ['Hamas', 'Hezbollah', 'Islamic Jihad', 'Fatah'],
        correctIndex: 1,
        explanation: 'Hezbollah in Lebanon has received Shahed-136 and other Iranian drones.',
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
      },
    ],
  },

  // ─── LEVEL 3: Cruise Missiles + David's Sling ────────────
  3: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 50,
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
      },
      {
        id: 'l3q2',
        question: "What year was David's Sling declared operational?",
        options: ['2007', '2011', '2014', '2017'],
        correctIndex: 3,
        explanation: "David's Sling was declared operational in 2017.",
      },
      {
        id: 'l3q3',
        question: "What is the name of David's Sling interceptor?",
        options: ['Tamir', 'Stunner', 'Arrow', 'Patriot'],
        correctIndex: 1,
        explanation: "David's Sling fires Stunner interceptors that use hit-to-kill technology.",
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
      },
      {
        id: 'l3q6',
        question: 'Which country developed the Paveh and Quds cruise missiles?',
        options: ['Russia', 'China', 'Iran', 'North Korea'],
        correctIndex: 2,
        explanation: 'Iran developed the Paveh and Quds cruise missiles for long-range strikes.',
      },
      {
        id: 'l3q7',
        question: "What is the effective range of David's Sling?",
        options: ['4-70 km', '40-300 km', '100-1,000 km', '1,000+ km'],
        correctIndex: 1,
        explanation: "David's Sling has an effective range of 40-300 km.",
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
      },
    ],
  },

  // ─── LEVEL 4: Ballistic Missiles + Arrow 2 ───────────────
  4: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 50,
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
      },
      {
        id: 'l4q3',
        question: "What is the Shahab-3's approximate range?",
        options: ['100 km', '500 km', 'Over 1,300 km', 'Over 5,000 km'],
        correctIndex: 2,
        explanation: "Iran's Shahab-3 has a range over 1,300 km \u2014 enough to reach Israel from Iranian soil.",
      },
      {
        id: 'l4q4',
        question: 'At what speed do ballistic missiles reenter the atmosphere?',
        options: ['Mach 1-2', 'Mach 3-5', 'Mach 7-10', 'Mach 20+'],
        correctIndex: 2,
        explanation: 'Ballistic missiles reenter at Mach 7-10 \u2014 faster than any bullet.',
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
      },
      {
        id: 'l4q6',
        question: 'Up to what altitude can Arrow 2 engage targets?',
        options: ['10 km', '50 km', '90 km', '200 km'],
        correctIndex: 2,
        explanation: 'Arrow 2 can engage targets at altitudes up to 90 km above populated areas.',
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
      },
    ],
  },

  // ─── LEVEL 5: Hypersonic + Arrow 3 ───────────────────────
  5: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 50,
    questions: [
      {
        id: 'l5q1',
        question: 'At what minimum speed does a weapon qualify as hypersonic?',
        options: ['Mach 1', 'Mach 3', 'Mach 5', 'Mach 10'],
        correctIndex: 2,
        explanation: 'Hypersonic weapons travel at Mach 5 or above \u2014 over 6,000 km/h.',
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
      },
      {
        id: 'l5q4',
        question: 'Which company developed Arrow 3?',
        options: ['Rafael', 'Israel Aerospace Industries', 'Elbit Systems', 'Boeing'],
        correctIndex: 1,
        explanation: 'Arrow 3 was developed by Israel Aerospace Industries with US support.',
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
      },
      {
        id: 'l5q6',
        question: 'In what year was Arrow 3 successfully tested against a real target in space?',
        options: ['2010', '2015', '2019', '2022'],
        correctIndex: 2,
        explanation: 'Arrow 3 was successfully tested against real ballistic targets in space in 2019.',
      },
      {
        id: 'l5q7',
        question: 'At what altitude can Arrow 3 engage threats?',
        options: ['Up to 10 km', 'Up to 50 km', 'Up to 90 km', 'Over 100 km'],
        correctIndex: 3,
        explanation: 'Arrow 3 can engage threats at altitudes over 100 km \u2014 the highest layer of Israeli defense.',
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
      },
    ],
  },

  // ─── LEVEL 6: April 2024 Attack & Multi-Layered Defense ───
  6: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 50,
    questions: [
      {
        id: 'l6q1',
        question: 'How many total projectiles did Iran launch at Israel on April 13, 2024?',
        options: ['About 50', 'About 150', 'Over 300', 'Over 1,000'],
        correctIndex: 2,
        explanation: 'Iran launched over 300 projectiles \u2014 170 drones, 30+ cruise missiles, and 120+ ballistic missiles.',
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
      },
      {
        id: 'l6q4',
        question: 'What was the overall intercept rate of the April 2024 attack?',
        options: ['About 75%', 'About 85%', 'About 95%', 'About 99%'],
        correctIndex: 3,
        explanation: '99% of all 300+ projectiles were intercepted \u2014 only one ballistic missile struck its intended target at Nevatim airbase.',
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
      },
    ],
  },

  // ─── LEVEL 7: Cost Asymmetry & Resource Management ────────
  7: {
    questionsPerQuiz: 2,
    timePerQuestion: 15,
    pointsPerCorrect: 50,
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
      },
    ],
  },
};

/**
 * Get N random questions for a given level.
 * Returns a shuffled subset of the question bank.
 */
export function getRandomQuestions(level, count) {
  const data = QUIZ_DATA[level];
  if (!data) return [];
  const n = count || data.questionsPerQuiz;
  const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
