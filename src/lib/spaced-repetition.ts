// Simplified SM-2 Spaced Repetition Algorithm for Hifz tracking
// All client-side with localStorage persistence

export interface HifzCard {
  id: string;
  surahId: number;
  ayahFrom: number;
  ayahTo: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number; // timestamp
  lastReview: number; // timestamp
  lastQuality: number; // 0-5
}

export interface HifzStats {
  totalMemorized: number;
  totalAyahs: number;
  totalSurahs: number;
  streak: number;
  reviewsToday: number;
  dueToday: number;
}

const STORAGE_KEY = 'iqaan-hifz-data';
const STREAK_KEY = 'iqaan-hifz-streak';

function getCardId(surahId: number, ayahFrom: number, ayahTo: number): string {
  return `${surahId}-${ayahFrom}-${ayahTo}`;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

export function getAllCards(): HifzCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCards(cards: HifzCard[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function getStreakData(): { currentStreak: number; lastReviewDate: string } {
  if (typeof window === 'undefined') return { currentStreak: 0, lastReviewDate: '' };
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { currentStreak: 0, lastReviewDate: '' };
  } catch {
    return { currentStreak: 0, lastReviewDate: '' };
  }
}

export function updateStreak(): number {
  const today = new Date().toISOString().split('T')[0];
  const streakData = getStreakData();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let streak = streakData.currentStreak;
  if (streakData.lastReviewDate === today) {
    // Already reviewed today
  } else if (streakData.lastReviewDate === yesterday) {
    streak += 1;
  } else if (streakData.lastReviewDate !== today) {
    streak = 1;
  }

  localStorage.setItem(STREAK_KEY, JSON.stringify({ currentStreak: streak, lastReviewDate: today }));
  return streak;
}

// ─── SM-2 Algorithm ───────────────────────────────────────────────────────────

export function createCard(surahId: number, ayahFrom: number, ayahTo: number): HifzCard {
  return {
    id: getCardId(surahId, ayahFrom, ayahTo),
    surahId,
    ayahFrom,
    ayahTo,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: 0,
    lastQuality: 0,
  };
}

/**
 * Quality scale (0-5):
 * 0 - Complete blackout
 * 1 - Incorrect, but recognized after seeing answer
 * 2 - Incorrect, but answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct with some hesitation
 * 5 - Perfect recall
 */
export function reviewCard(card: HifzCard, quality: number): HifzCard {
  // Clamp quality
  quality = Math.max(0, Math.min(5, quality));

  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1; // 1 day
    } else if (repetitions === 1) {
      interval = 6; // 6 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — restart
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    lastReview: Date.now(),
    lastQuality: quality,
    nextReview: Date.now() + interval * 24 * 60 * 60 * 1000,
  };
}

// ─── Operations ───────────────────────────────────────────────────────────────

export function memorizeAyah(surahId: number, ayahFrom: number, ayahTo: number): void {
  const cards = getAllCards();
  const id = getCardId(surahId, ayahFrom, ayahTo);
  const existing = cards.find(c => c.id === id);

  if (!existing) {
    const card = createCard(surahId, ayahFrom, ayahTo);
    card.lastReview = Date.now();
    card.repetitions = 1;
    card.interval = 1;
    card.nextReview = Date.now() + 24 * 60 * 60 * 1000;
    card.lastQuality = 4;
    cards.push(card);
    saveCards(cards);
    updateStreak();
  }
}

export function unmemorizeAyah(surahId: number, ayahFrom: number, ayahTo: number): void {
  const cards = getAllCards();
  const id = getCardId(surahId, ayahFrom, ayahTo);
  saveCards(cards.filter(c => c.id !== id));
}

export function isMemorized(surahId: number, ayah: number): boolean {
  const cards = getAllCards();
  return cards.some(c => c.surahId === surahId && ayah >= c.ayahFrom && ayah <= c.ayahTo);
}

export function getDueCards(): HifzCard[] {
  const cards = getAllCards();
  return cards.filter(c => c.nextReview <= Date.now()).sort((a, b) => a.nextReview - b.nextReview);
}

export function getCardsForSurah(surahId: number): HifzCard[] {
  return getAllCards().filter(c => c.surahId === surahId);
}

export function getMemorizedAyahs(surahId: number): Set<number> {
  const cards = getCardsForSurah(surahId);
  const ayahs = new Set<number>();
  for (const card of cards) {
    for (let i = card.ayahFrom; i <= card.ayahTo; i++) {
      ayahs.add(i);
    }
  }
  return ayahs;
}

export function calculateStats(versesCount: Record<number, number>): HifzStats {
  const cards = getAllCards();
  const surahSet = new Set<number>();
  let totalAyahs = 0;
  let dueToday = 0;
  let reviewsToday = 0;
  const today = new Date().toISOString().split('T')[0];

  for (const card of cards) {
    surahSet.add(card.surahId);
    totalAyahs += card.ayahTo - card.ayahFrom + 1;
    if (card.nextReview <= Date.now()) dueToday++;
    if (new Date(card.lastReview).toISOString().split('T')[0] === today) reviewsToday++;
  }

  const streak = getStreakData().currentStreak;

  return {
    totalMemorized: totalAyahs,
    totalAyahs,
    totalSurahs: surahSet.size,
    streak,
    reviewsToday,
    dueToday,
  };
}
