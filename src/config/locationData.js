// ============================================================
// LOCATION DATA — Educational popup content for Pause & Explore
// ============================================================
//
// Keys MUST match CITIES keys in mapLayers.js exactly.
// Each entry: photo filename (in public/images/locations/),
// category, summary (one-liner), and 2 short punchy facts.
// ============================================================

export const LOCATION_DATA = {
  // ═══════════════════════════════════════════════════════════
  // L1: OTEF AZA — Gaza Border Communities
  // ═══════════════════════════════════════════════════════════

  'Sderot': {
    photo: 'sderot.jpg',
    category: 'city',
    summary: 'Border town <1 mile from Gaza — Israel\u2019s most rocket-targeted city.',
    facts: [
      'Bus stops double as bomb shelters. Most shelters per capita in Israel.',
      'Sapir College\u2019s 8,000 students study between rocket sirens.',
    ],
  },
  'Ashkelon': {
    photo: 'ashkelon.jpg',
    category: 'city',
    summary: 'Ancient coastal city with 5,000 years of continuous habitation.',
    facts: [
      'Home to a major desalination plant providing water for over a million people.',
      'Ancient Philistine port — archaeologists found a 3,000-year-old cemetery here.',
    ],
  },
  "Be'eri": {
    photo: 'beeri.jpg',
    category: 'city',
    summary: 'Kibbutz founded in 1946, named after Labor Zionist leader Berl Katznelson.',
    facts: [
      'Known for its printing press, one of the largest in Israel since the 1950s.',
      'Located in the western Negev, close to the Gaza border.',
    ],
  },
  'Kfar Aza': {
    photo: 'kfar-aza.jpg',
    category: 'city',
    summary: 'Small kibbutz just 2 km from the Gaza border fence.',
    facts: [
      'Founded in 1951 by immigrants from North Africa.',
      'Later joined by volunteers from around the world.',
    ],
  },
  "Re'im": {
    photo: 'reim.jpg',
    category: 'city',
    summary: 'Small western Negev kibbutz, ~5 km from the Gaza border.',
    facts: [
      'Site of the Nova music festival grounds.',
      'Located in open fields characteristic of the Negev landscape.',
    ],
  },
  'Netivot': {
    photo: 'netivot.jpg',
    category: 'city',
    summary: 'The \u201CCity of Torah\u201D — a center for Sephardic Jewish spiritual life.',
    facts: [
      'Home to the tomb of the Baba Sali, visited by thousands of pilgrims annually.',
      'Located in the northern Negev, within rocket range of Gaza.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // L2: GALIL & GOLAN — Northern Israel
  // ═══════════════════════════════════════════════════════════

  'Haifa': {
    photo: 'haifa.jpg',
    category: 'city',
    summary: 'Israel\u2019s largest port city and northern high-tech hub.',
    facts: [
      'Home to the Bah\u00e1\u2019\u00ed World Centre\u2019s terraced gardens — a UNESCO World Heritage Site.',
      'Known as a model of Jewish-Arab coexistence.',
    ],
  },
  'Nahariya': {
    photo: 'nahariya.jpg',
    category: 'city',
    summary: 'Israel\u2019s northernmost coastal city, 6 miles from Lebanon.',
    facts: [
      'Founded in 1934 by Jewish refugees from Nazi Germany.',
      'Over 900 rockets hit the city during the 2006 Lebanon War.',
    ],
  },
  'Kiryat Shmona': {
    photo: 'kiryat-shmona.jpg',
    category: 'city',
    summary: 'Israel\u2019s northernmost city, in the Hula Valley near Lebanon.',
    facts: [
      'Named after the \u201CEight Heroes\u201D who died defending Tel Hai in 1920.',
      'Frequent target of cross-border rocket attacks since the 1970s.',
    ],
  },
  'Teveriah': {
    photo: 'teveriah.jpg',
    category: 'city',
    summary: 'One of Judaism\u2019s four holy cities, on the Sea of Galilee.',
    facts: [
      'The Mishnah and Jerusalem Talmud were compiled here ~2,000 years ago.',
      'Sits ~200 meters below sea level — one of Earth\u2019s lowest cities.',
    ],
  },
  'Akko': {
    photo: 'akko.jpg',
    category: 'city',
    summary: 'UNESCO World Heritage Site — over 4,000 years of continuous habitation.',
    facts: [
      'Crusader ruins, Ottoman architecture, and ancient sea walls.',
      'Famous for its hummus — locals say it\u2019s the best in Israel.',
    ],
  },
  'Tzfat': {
    photo: 'tzfat.jpg',
    category: 'city',
    summary: 'Birthplace of Kabbalah and one of Judaism\u2019s four holy cities.',
    facts: [
      'Highest city in Israel at 900m elevation with panoramic Galilee views.',
      'Its Artists\u2019 Quarter draws visitors to galleries and cobblestone lanes.',
    ],
  },
  'Katzrin': {
    photo: 'katzrin.jpg',
    category: 'city',
    summary: 'Unofficial \u201Ccapital\u201D of the Golan Heights, near ancient ruins.',
    facts: [
      'Surrounded by volcanic basalt from ancient eruptions.',
      'Reconstructed village shows life in the Golan 1,500 years ago.',
    ],
  },
  'Majdal Shams': {
    photo: 'majdal-shams.jpg',
    category: 'city',
    summary: 'Largest Druze town in the Golan, at the foot of Mount Hermon.',
    facts: [
      'Residents can see into Syria — some have family on the other side.',
      'Known for cherry and apple orchards and an annual cherry festival.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // L3: CENTRAL ISRAEL — Tel Aviv, Jerusalem & Surroundings
  // ═══════════════════════════════════════════════════════════

  'Tel Aviv': {
    photo: 'tel-aviv.jpg',
    category: 'city',
    summary: '\u201CThe White City\u201D — world\u2019s largest Bauhaus collection, a UNESCO site.',
    facts: [
      'Israel\u2019s economic and tech capital — more startups per capita than almost any city.',
      'Founded in 1909 as a neighborhood of ancient Jaffa.',
    ],
  },
  'Jerusalem': {
    photo: 'jerusalem.jpg',
    category: 'city',
    summary: 'Sacred to Judaism, Christianity, and Islam — 5,000+ years of history.',
    facts: [
      'Home to the Western Wall, Church of the Holy Sepulchre, and Al-Aqsa Mosque.',
      'Israel\u2019s capital and largest city — population nearly 1 million.',
    ],
  },
  'Netanya': {
    photo: 'netanya.jpg',
    category: 'city',
    summary: 'Israel\u2019s diamond capital on the Mediterranean coast.',
    facts: [
      'Built around its diamond-cutting industry in the 1930s.',
      'Named after Nathan Straus, co-owner of Macy\u2019s department store.',
    ],
  },
  "Ra'anana": {
    photo: 'raanana.jpg',
    category: 'city',
    summary: 'Planned garden city in the Sharon plain, high quality of life.',
    facts: [
      'Hub for multinational tech — Oracle, SAP, and Microsoft offices here.',
      'One of Israel\u2019s most desirable residential cities.',
    ],
  },
  'Petah Tikva': {
    photo: 'petah-tikva.jpg',
    category: 'city',
    summary: '\u201CMother of the Colonies\u201D — first modern Jewish settlement (1878).',
    facts: [
      'Now a major city of 265,000 residents.',
      'Home to Schneider Children\u2019s Medical Center.',
    ],
  },
  'Rishon LeZion': {
    photo: 'rishon-lezion.jpg',
    category: 'city',
    summary: 'Israel\u2019s 4th-largest city, founded 1882 by Russian immigrants.',
    facts: [
      'Where \u201CHatikvah\u201D (national anthem) was first sung publicly in 1888.',
      'One of the original First Aliyah settlements.',
    ],
  },
  'Ashdod': {
    photo: 'ashdod.jpg',
    category: 'city',
    summary: 'Home to Israel\u2019s largest port — 60% of imported goods.',
    facts: [
      'Ancient Philistine city where the Ark of the Covenant was brought.',
      'Major Mediterranean port city with ~225,000 residents.',
    ],
  },
  "Modi'in": {
    photo: 'modiin.jpg',
    category: 'city',
    summary: 'One of Israel\u2019s newest cities, planned in the 1990s.',
    facts: [
      'Located halfway between Tel Aviv and Jerusalem.',
      'Ancient hometown of the Maccabees — the Hanukkah story.',
    ],
  },
  'Gush Etzion': {
    photo: 'gush-etzion.jpg',
    category: 'city',
    summary: 'Community cluster in the Judean Hills, south of Jerusalem.',
    facts: [
      'Original kibbutzim fell in 1948, re-established after 1967.',
      'Strategic position along the Jerusalem\u2013Hebron corridor.',
    ],
  },
  'Holon': {
    photo: 'holon.jpg',
    category: 'city',
    summary: 'Israel\u2019s \u201CCity of Children\u201D — culture and design hub.',
    facts: [
      'Home to the Design Museum Holon, designed by architect Ron Arad.',
      'Hosts the Adloyada Purim parade, Israel\u2019s largest.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // L4: STRATEGIC INFRASTRUCTURE
  // ═══════════════════════════════════════════════════════════

  'BAZAN Oil Refinery': {
    photo: 'bazan.jpg',
    category: 'infrastructure',
    summary: 'Israel\u2019s largest refinery — processes nearly all crude oil.',
    facts: [
      'A strike in Haifa Bay could cause an environmental catastrophe.',
      'Built by the British in 1938 as part of the Iraq-Haifa pipeline.',
    ],
  },
  'Orot Rabin Power Station': {
    photo: 'orot-rabin.jpg',
    category: 'infrastructure',
    summary: 'Israel\u2019s largest power station — ~20% of national electricity.',
    facts: [
      'Named after PM Yitzhak Rabin — twin smokestacks visible across the coast.',
      'Located on the Mediterranean coastal plain.',
    ],
  },
  'Sorek Desalination Plant': {
    photo: 'sorek.jpg',
    category: 'infrastructure',
    summary: 'One of the world\u2019s largest reverse-osmosis desalination plants.',
    facts: [
      'Produces 150M cubic meters of water/year — enough for 1.5 million people.',
      'Israel gets 80%+ of drinking water from desalination — a global leader.',
    ],
  },
  'Rutenberg Power Station': {
    photo: 'rutenberg.jpg',
    category: 'infrastructure',
    summary: 'Coal-fired power plant on the coast near Ashkelon.',
    facts: [
      'Named after Pinhas Rutenberg, who built Israel\u2019s first power grid in the 1920s.',
      'One of several critical energy facilities along the southern coast.',
    ],
  },
  'Ashdod Port': {
    photo: 'ashdod-port.jpg',
    category: 'infrastructure',
    summary: 'Israel\u2019s busiest cargo port — 60%+ of all imports.',
    facts: [
      'Disruption here would affect food, fuel, and construction nationwide.',
      'A critical economic chokepoint for the entire country.',
    ],
  },
  'The Kirya (IDF HQ)': {
    photo: 'kirya.jpg',
    category: 'infrastructure',
    summary: 'IDF central command headquarters in central Tel Aviv.',
    facts: [
      'Houses the General Staff, Military Intelligence, and national command bunker.',
      'Surrounded by some of Tel Aviv\u2019s most valuable real estate.',
    ],
  },
  'Dimona Nuclear Reactor': {
    photo: 'dimona.jpg',
    category: 'infrastructure',
    summary: 'Israel\u2019s nuclear research center in the Negev — operational since the 1960s.',
    facts: [
      'Built secretly with French assistance — denied for years.',
      'One of the most heavily defended sites in Israel.',
    ],
  },
  'Ben Gurion Airport': {
    photo: 'ben-gurion.jpg',
    category: 'infrastructure',
    summary: 'Israel\u2019s main international airport — 25M+ passengers/year.',
    facts: [
      'Named after Israel\u2019s first Prime Minister.',
      'Considered one of the most secure airports in the world.',
    ],
  },
  'Beersheba': {
    photo: 'beersheba.jpg',
    category: 'city',
    summary: '\u201CCapital of the South\u201D — largest Negev city (210K residents).',
    facts: [
      'Home to Ben-Gurion University — a cybersecurity and desert research hub.',
      'Ancient city from Genesis — Abraham dug a well here ~4,000 years ago.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // L5: MILITARY BASES
  // ═══════════════════════════════════════════════════════════

  'Ramat David AFB': {
    photo: 'ramat-david.jpg',
    category: 'base',
    summary: 'Frontline fighter base in northern Israel — F-16 squadrons.',
    facts: [
      'Built by the British RAF during the Mandate era (1940s).',
      'Targeted by Iraqi Scud missiles during the 1991 Gulf War.',
    ],
  },
  'Glilot (Unit 8200)': {
    photo: 'glilot.jpg',
    category: 'base',
    summary: 'HQ of Unit 8200 — Israel\u2019s signals intelligence (comparable to NSA).',
    facts: [
      'Alumni founded Waze, Check Point, and CyberArk.',
      'Located in the Tel Aviv metro area.',
    ],
  },
  'Palmachim AFB': {
    photo: 'palmachim.jpg',
    category: 'base',
    summary: 'Israel\u2019s space launch site — all satellites launched from here.',
    facts: [
      'Primary test site for Arrow missile defense interceptors.',
      'On the Mediterranean coast south of Tel Aviv.',
    ],
  },
  'Nevatim AFB': {
    photo: 'nevatim.jpg',
    category: 'base',
    summary: 'Home to Israel\u2019s F-35 \u201CAdir\u201D stealth fighters.',
    facts: [
      'First operational F-35 base outside the US.',
      'Top target for long-range missile strikes due to its strategic aircraft.',
    ],
  },
  'Tel Nof AFB': {
    photo: 'tel-nof.jpg',
    category: 'base',
    summary: 'One of Israel\u2019s largest and oldest air bases (since 1948).',
    facts: [
      'Home to heavy transport aircraft and helicopter squadrons.',
      'Key base for Operation Entebbe (1976) — the Uganda hostage rescue.',
    ],
  },
  'Ramon AFB': {
    photo: 'ramon.jpg',
    category: 'base',
    summary: 'Israel\u2019s southernmost air base, deep in the Negev.',
    facts: [
      'One of Israel\u2019s longest runways — used for advanced flight training.',
      'Named after Ilan Ramon, Israel\u2019s first astronaut (Columbia disaster).',
    ],
  },
  'Sdot Micha': {
    photo: 'sdot-micha.jpg',
    category: 'base',
    summary: 'Secretive base believed to house strategic missile capabilities.',
    facts: [
      'Located in the Judean foothills.',
      'One of the most secretive military installations in Israel.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // L6: FULL MAP
  // ═══════════════════════════════════════════════════════════

  'Eilat': {
    photo: 'eilat.jpg',
    category: 'city',
    summary: 'Israel\u2019s southernmost city — Red Sea resort known for diving.',
    facts: [
      'Borders Egypt and Jordan — three countries visible from the beach.',
      '300+ km from Gaza, but in range of long-range rockets from Yemen.',
    ],
  },
};
