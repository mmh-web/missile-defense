// ============================================================
// MISSILE DEFENSE — Team Name Profanity Filter
// Client-side filter for classroom/educational setting.
// ============================================================

// Common profanity + slurs — covers English basics.
// All lowercase, matched against normalized input.
const BLOCKED_WORDS = [
  'fuck', 'shit', 'ass', 'damn', 'bitch', 'dick', 'cock', 'pussy',
  'cunt', 'fag', 'slut', 'whore', 'nigger', 'nigga', 'retard',
  'penis', 'vagina', 'tits', 'boobs', 'anus', 'dildo',
  'hitler', 'nazi', 'heil', 'kkk',
  'piss', 'crap', 'douche', 'wank', 'twat', 'prick',
  'stfu', 'gtfo', 'milf', 'thot',
];

// Also catch l33t-speak substitutions: a→@/4, e→3, i→1/!, o→0, s→$
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/3/g, 'e')
    .replace(/[1!]/g, 'i')
    .replace(/0/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/7/g, 't')
    .replace(/[^a-z]/g, ''); // strip remaining non-alpha
}

/**
 * Returns true if the name contains profanity.
 */
export function containsProfanity(name) {
  if (!name) return false;
  const cleaned = normalize(name);
  return BLOCKED_WORDS.some((word) => cleaned.includes(word));
}

/**
 * Returns a sanitized version or null if clean.
 * For now we just block — don't try to auto-fix.
 */
export function isNameAllowed(name) {
  return !containsProfanity(name);
}
