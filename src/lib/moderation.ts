const TOXICITY_URL =
  'https://us-central1-wallofsupport-22a63.cloudfunctions.net/checkToxicity';
const SENTIMENT_URL =
  'https://us-central1-wallofsupport-22a63.cloudfunctions.net/checkSentiment';

const TOXICITY_THRESHOLD = 0.4;
const SENTIMENT_THRESHOLD = -0.3;

const BLOCKED_TERMS = [
  'fuck', 'fucking', 'fucked', 'fucker',
  'shit', 'bullshit',
  'bitch', 'bastard',
  'ass', 'asshole', 'arse',
  'cock', 'dick', 'pussy', 'cunt',
  'whore', 'slut',
  'nigger', 'nigga',
  'faggot', 'fag',
  'retard', 'retarded',
  'piss', 'pissed',
  'crap', 'damn', 'damnit',
];

export function hasProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_TERMS.some((term) => new RegExp(`\\b${term}\\b`, 'i').test(lower));
}

export interface ModerationResult {
  passed: boolean;
  reason?: string;
}

export async function moderateContent(text: string): Promise<ModerationResult> {
  if (hasProfanity(text)) {
    return {
      passed: false,
      reason:
        'Your message contains language that violates our community guidelines. Please keep it respectful.',
    };
  }

  try {
    const [toxRes, sentRes] = await Promise.all([
      fetch(TOXICITY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: text }),
      }),
      fetch(SENTIMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: text }),
      }),
    ]);

    const toxScore: number = await toxRes.json();
    const sentScore: number = await sentRes.json();

    if (typeof toxScore === 'number' && toxScore > TOXICITY_THRESHOLD) {
      return {
        passed: false,
        reason:
          'Your message contains language that violates our community guidelines. Please keep it respectful.',
      };
    }

    if (typeof sentScore === 'number' && sentScore < SENTIMENT_THRESHOLD) {
      return {
        passed: false,
        reason:
          'This is a space for positivity and support. Please share an uplifting or encouraging message.',
      };
    }

    return { passed: true };
  } catch {
    return { passed: true };
  }
}
