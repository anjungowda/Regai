import { FAQEntry, faqData } from '../data/chatbotFAQ';

export const findBestMatch = (input: string): FAQEntry | null => {
  const norm = input.toLowerCase().replace(/[^\w\s]/g, '');
  const tokens = norm.split(' ').filter(t => t.length > 2); // Ignore 'is', 'a', etc

  let bestMatch: FAQEntry | null = null;
  let highestScore = 0;

  // Threshold algorithm
  for (const entry of faqData) {
    let score = 0;
    for (const token of tokens) {
      if (entry.keywords.includes(token)) {
        score += 3; // exact match
      } else if (entry.keywords.some(k => k.includes(token) || token.includes(k))) {
        score += 1; // partial intersection match
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  // The Prompt requires a strict threshold of 3 to prevent false positives
  if (highestScore >= 3) {
    return bestMatch;
  }
  return null;
}
