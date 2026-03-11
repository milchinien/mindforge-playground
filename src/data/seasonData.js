// ============= SEASON SYSTEM DATA =============
// Season 1: "Wissensdurst" - Battle Pass, Weekly Challenges

// ---------- CURRENT SEASON ----------
export const CURRENT_SEASON = {
  id: 'season-1',
  number: 1,
  name: 'Wissensdurst',
  subtitle: 'Die Reise des Wissens beginnt',
  description: 'Stelle dein Wissen unter Beweis und sammle exklusive Belohnungen in der ersten Season von MindForge!',
  startDate: '2026-02-01T00:00:00Z',
  endDate: '2026-05-02T23:59:59Z',
  durationDays: 90,
  theme: {
    primary: '#6366f1',
    secondary: '#818cf8',
    accent: '#a78bfa',
    gradient: 'from-indigo-600 via-violet-600 to-purple-600',
    bgGradient: 'from-indigo-900/30 via-violet-900/20 to-purple-900/30',
    icon: 'book-open',
  },
  xpPerTier: 1000,
  maxTier: 30,
}

// ---------- PREMIUM SUBSCRIPTION ----------
export const PREMIUM_SUBSCRIPTION = {
  price: 14.99,
  currency: 'EUR',
  period: 'month',
  name: 'MindForge Premium',
  benefits: [
    'Premium Mind Pass inklusive',
    'Exklusive Premium-Belohnungen jedes Level',
    '+15% Bonus Season-XP permanent',
    'Frueher Zugang zu neuen Seasons',
    'Exklusiver Premium-Profilrahmen',
    'Werbefreies Spielerlebnis',
  ],
}

// ---------- BATTLE PASS TIERS (30 Tiers, 5 Pages x 6 Tiers) ----------
// Layout: each page shows 6 cards. First and last card = FREE reward.
// Page 1: T1-T6, Page 2: T7-T12, Page 3: T13-T18, Page 4: T19-T24, Page 5: T25-T30
// Free rewards: first & last tier of each page (tiers 1,6,7,12,13,18,19,24,25,30)
// Premium rewards: middle 4 tiers of each page (tiers 2-5, 8-11, 14-17, 20-23, 26-29)
// XP boosters: rare, premium only (tiers 4, 14, 22, 28)
export const BATTLE_PASS_TIERS = [
  // ═══ PAGE 1: Tiers 1-6 ═══
  {
    tier: 1,
    xpRequired: 0,
    free: { type: 'badge', name: 'Season 1 Teilnehmer', description: 'Zeigt deine Teilnahme an Season 1', icon: 'award', rarity: 'common' },
    premium: null,
  },
  {
    tier: 2,
    xpRequired: 1000,
    free: null,
    premium: { type: 'avatar-frame', name: 'Wissens-Rahmen', description: 'Ein schlichter blauer Rahmen fuer Wissbegierige', icon: 'frame', rarity: 'common' },
  },
  {
    tier: 3,
    xpRequired: 2000,
    free: null,
    premium: { type: 'badge', name: 'Season 1 Starter', description: 'Zeigt dass du von Anfang an dabei warst', icon: 'award', rarity: 'common' },
  },
  {
    tier: 4,
    xpRequired: 3000,
    free: null,
    premium: { type: 'xp-booster', name: '+25% XP Booster', description: '1 Stunde lang +25% Season-XP', duration: '1h', icon: 'zap', rarity: 'uncommon' },
  },
  {
    tier: 5,
    xpRequired: 4000,
    free: null,
    premium: { type: 'profile-banner', name: 'Sternennacht-Banner', description: 'Ein funkelndes Nachthimmel-Banner', icon: 'image', rarity: 'uncommon' },
  },
  {
    tier: 6,
    xpRequired: 5000,
    free: { type: 'title', name: 'Wissbegierig', description: 'Zeige allen deine Neugier', icon: 'tag', rarity: 'uncommon' },
    premium: null,
  },

  // ═══ PAGE 2: Tiers 7-12 ═══
  {
    tier: 7,
    xpRequired: 6000,
    free: { type: 'badge', name: 'Aufsteiger', description: 'Du bist auf dem richtigen Weg!', icon: 'trending-up', rarity: 'uncommon' },
    premium: null,
  },
  {
    tier: 8,
    xpRequired: 7000,
    free: null,
    premium: { type: 'avatar-item', name: 'Gelehrten-Brille', description: 'Eine stylische Brille fuer Wissbegierige', icon: 'glasses', rarity: 'uncommon' },
  },
  {
    tier: 9,
    xpRequired: 8000,
    free: null,
    premium: { type: 'avatar-item', name: 'Wissens-Umhang', description: 'Ein mystischer Umhang des Wissens', icon: 'shield', rarity: 'rare' },
  },
  {
    tier: 10,
    xpRequired: 9000,
    free: null,
    premium: { type: 'profile-effect', name: 'Partikel: Funken', description: 'Elektrische Funken um dein Profil', icon: 'sparkles', rarity: 'rare' },
  },
  {
    tier: 11,
    xpRequired: 10000,
    free: null,
    premium: { type: 'avatar-frame', name: 'Flammen-Rahmen', description: 'Ein feuriger Profilrahmen', icon: 'frame', rarity: 'rare' },
  },
  {
    tier: 12,
    xpRequired: 11000,
    free: { type: 'title', name: 'Gelehrter', description: 'Ein Titel fuer wahre Wissenssuchende', icon: 'tag', rarity: 'rare' },
    premium: null,
  },

  // ═══ PAGE 3: Tiers 13-18 ═══
  {
    tier: 13,
    xpRequired: 12000,
    free: { type: 'badge', name: 'Halbzeit!', description: 'Fast die Haelfte geschafft', icon: 'clock', rarity: 'rare' },
    premium: null,
  },
  {
    tier: 14,
    xpRequired: 13000,
    free: null,
    premium: { type: 'xp-booster', name: '+50% XP Booster', description: '1 Stunde lang +50% Season-XP', duration: '1h', icon: 'zap', rarity: 'rare' },
  },
  {
    tier: 15,
    xpRequired: 14000,
    free: null,
    premium: { type: 'avatar-item', name: 'Neon-Kopfhoerer', description: 'Leuchtende Kopfhoerer im Cyberpunk-Stil', icon: 'headphones', rarity: 'rare' },
  },
  {
    tier: 16,
    xpRequired: 15000,
    free: null,
    premium: { type: 'avatar-item', name: 'Kristall-Amulett', description: 'Ein leuchtendes Amulett des Wissens', icon: 'gem', rarity: 'rare' },
  },
  {
    tier: 17,
    xpRequired: 16000,
    free: null,
    premium: { type: 'avatar-frame', name: 'Kristall-Rahmen', description: 'Ein funkelnder Kristallrahmen', icon: 'frame', rarity: 'epic' },
  },
  {
    tier: 18,
    xpRequired: 17000,
    free: { type: 'title', name: 'Meister des Wissens', description: 'Nur die Besten tragen diesen Titel', icon: 'tag', rarity: 'rare' },
    premium: null,
  },

  // ═══ PAGE 4: Tiers 19-24 ═══
  {
    tier: 19,
    xpRequired: 18000,
    free: { type: 'badge', name: 'Stratege', description: 'Deine Strategie zahlt sich aus!', icon: 'target', rarity: 'epic' },
    premium: null,
  },
  {
    tier: 20,
    xpRequired: 19000,
    free: null,
    premium: { type: 'avatar-item', name: 'Magier-Robe', description: 'Eine epische Robe fuer Wissensmagier', icon: 'wand', rarity: 'epic' },
  },
  {
    tier: 21,
    xpRequired: 20000,
    free: null,
    premium: { type: 'profile-effect', name: 'Partikel: Sterne', description: 'Sterne schweben um dein Profil', icon: 'sparkles', rarity: 'epic' },
  },
  {
    tier: 22,
    xpRequired: 21000,
    free: null,
    premium: { type: 'xp-booster', name: '+75% XP Booster', description: '1 Stunde lang +75% Season-XP', duration: '1h', icon: 'zap', rarity: 'epic' },
  },
  {
    tier: 23,
    xpRequired: 22000,
    free: null,
    premium: { type: 'avatar-item', name: 'Elementar-Fluegel', description: 'Mystische Fluegel aus reiner Energie', icon: 'feather', rarity: 'epic' },
  },
  {
    tier: 24,
    xpRequired: 23000,
    free: { type: 'title', name: 'Wissens-Champion', description: 'Champion der ersten Season', icon: 'tag', rarity: 'epic' },
    premium: null,
  },

  // ═══ PAGE 5: Tiers 25-30 ═══
  {
    tier: 25,
    xpRequired: 24000,
    free: { type: 'badge', name: 'Experte', description: 'Nur die Besten erreichen dieses Level', icon: 'star', rarity: 'epic' },
    premium: null,
  },
  {
    tier: 26,
    xpRequired: 25000,
    free: null,
    premium: { type: 'avatar-item', name: 'Schatten-Ruestung', description: 'Eine mystische Ruestung aus den Schatten', icon: 'shield', rarity: 'legendary' },
  },
  {
    tier: 27,
    xpRequired: 26000,
    free: null,
    premium: { type: 'profile-banner', name: 'Dimensionsriss-Banner', description: 'Ein Portal in eine andere Dimension', icon: 'image', rarity: 'legendary' },
  },
  {
    tier: 28,
    xpRequired: 27000,
    free: null,
    premium: { type: 'xp-booster', name: '+100% XP Booster', description: '1 Stunde lang +100% Season-XP', duration: '1h', icon: 'zap', rarity: 'legendary' },
  },
  {
    tier: 29,
    xpRequired: 28000,
    free: null,
    premium: { type: 'avatar-item', name: 'Wissensdurst-Ruestung', description: 'Die exklusive legendaere Ruestung der Season 1 - nie wieder erhaeltlich!', icon: 'shield', rarity: 'legendary' },
  },
  {
    tier: 30,
    xpRequired: 29000,
    free: { type: 'title', name: 'Legende der Season 1', description: 'Der ultimative Titel fuer wahre Meister', icon: 'crown', rarity: 'legendary' },
    premium: null,
  },
]

// ---------- WEEKLY CHALLENGES ----------
export const WEEKLY_CHALLENGES = [
  {
    week: 1,
    challenges: [
      { id: 'w1-c1', title: 'Spiele 5 Mathe-Spiele', description: 'Starte und spiele 5 verschiedene Mathe-Lernspiele', category: 'mathe', difficulty: 'easy', type: 'games_played', target: 5, xpReward: 200, bonusReward: null },
      { id: 'w1-c2', title: 'Erreiche 3x Highscore', description: 'Erziele in 3 verschiedenen Spielen einen neuen Highscore', category: 'any', difficulty: 'medium', type: 'highscores', target: 3, xpReward: 350, bonusReward: { type: 'badge', name: 'Wochen-Sieger', icon: 'trophy' } },
      { id: 'w1-c3', title: 'Spiele 3 Tage hintereinander', description: 'Melde dich an 3 aufeinanderfolgenden Tagen an und spiele mindestens ein Spiel', category: 'any', difficulty: 'easy', type: 'daily_streak', target: 3, xpReward: 150, bonusReward: null },
      { id: 'w1-c4', title: 'Schliesse 10 Spiele ab', description: 'Beende 10 Lernspiele erfolgreich (beliebige Kategorie)', category: 'any', difficulty: 'medium', type: 'games_completed', target: 10, xpReward: 400, bonusReward: null },
      { id: 'w1-c5', title: 'Perfekte Runde in Naturwissenschaften', description: 'Erreiche in einem Naturwissenschaften-Spiel 100% korrekte Antworten', category: 'naturwissenschaften', difficulty: 'hard', type: 'perfect_score', target: 1, xpReward: 500, bonusReward: { type: 'title', name: 'Perfektionist der Woche', icon: 'star' } },
    ],
  },
  {
    week: 2,
    challenges: [
      { id: 'w2-c1', title: 'Spiele 3 Sprach-Spiele', description: 'Teste dein Sprachwissen in 3 verschiedenen Spielen', category: 'sprachen', difficulty: 'easy', type: 'games_played', target: 3, xpReward: 200, bonusReward: null },
      { id: 'w2-c2', title: 'Sammle 2.000 XP', description: 'Verdiene insgesamt 2.000 Season-XP in dieser Woche', category: 'any', difficulty: 'medium', type: 'xp_earned', target: 2000, xpReward: 300, bonusReward: null },
      { id: 'w2-c3', title: 'Bewerte 5 Spiele', description: 'Gib 5 verschiedenen Spielen eine Bewertung', category: 'any', difficulty: 'easy', type: 'likes_given', target: 5, xpReward: 150, bonusReward: null },
      { id: 'w2-c4', title: 'Gewinne 5 Quiz-Duelle', description: 'Siege in 5 Multiplayer-Quiz-Runden', category: 'quiz', difficulty: 'hard', type: 'quiz_wins', target: 5, xpReward: 500, bonusReward: { type: 'avatar-item', name: 'Quiz-Krone', icon: 'crown' } },
      { id: 'w2-c5', title: 'Spiele 7 verschiedene Kategorien', description: 'Spiele mindestens ein Spiel aus 7 verschiedenen Fachbereichen', category: 'any', difficulty: 'medium', type: 'unique_categories', target: 7, xpReward: 350, bonusReward: { type: 'badge', name: 'Allrounder', icon: 'compass' } },
    ],
  },
  {
    week: 3,
    challenges: [
      { id: 'w3-c1', title: 'Spiele 30 Minuten', description: 'Verbringe insgesamt 30 Minuten mit Lernspielen', category: 'any', difficulty: 'easy', type: 'playtime_minutes', target: 30, xpReward: 200, bonusReward: null },
      { id: 'w3-c2', title: '5 Spiele in Folge gewinnen', description: 'Schliesse 5 Spiele hintereinander erfolgreich ab', category: 'any', difficulty: 'hard', type: 'win_streak', target: 5, xpReward: 500, bonusReward: { type: 'title', name: 'Unbesiegbar', icon: 'shield' } },
      { id: 'w3-c3', title: 'Spiele 4 Geschichte-Spiele', description: 'Reise durch die Zeit mit 4 Geschichte-Spielen', category: 'geschichte', difficulty: 'easy', type: 'games_played', target: 4, xpReward: 200, bonusReward: null },
      { id: 'w3-c4', title: 'Erreiche Tier 10', description: 'Steige im Battle Pass auf Tier 10 auf', category: 'any', difficulty: 'medium', type: 'reach_tier', target: 10, xpReward: 400, bonusReward: { type: 'xp-booster', name: '+25% XP Booster (2h)', icon: 'zap' } },
      { id: 'w3-c5', title: 'Lade einen Freund ein', description: 'Fuege einen neuen Freund zu deiner Freundesliste hinzu', category: 'social', difficulty: 'medium', type: 'friends_added', target: 1, xpReward: 300, bonusReward: null },
    ],
  },
  {
    week: 4,
    challenges: [
      { id: 'w4-c1', title: 'Spiele 8 Spiele', description: 'Starte und spiele 8 beliebige Lernspiele', category: 'any', difficulty: 'easy', type: 'games_played', target: 8, xpReward: 250, bonusReward: null },
      { id: 'w4-c2', title: 'Sammle 3.000 XP', description: 'Verdiene insgesamt 3.000 Season-XP in dieser Woche', category: 'any', difficulty: 'hard', type: 'xp_earned', target: 3000, xpReward: 500, bonusReward: { type: 'badge', name: 'XP-Jaeger', icon: 'target' } },
      { id: 'w4-c3', title: '2x Perfekte Runde', description: 'Erreiche in 2 beliebigen Spielen 100% korrekte Antworten', category: 'any', difficulty: 'hard', type: 'perfect_score', target: 2, xpReward: 500, bonusReward: { type: 'title', name: 'Makelloser Geist', icon: 'sparkles' } },
      { id: 'w4-c4', title: 'Spiele 5 Tage hintereinander', description: 'Melde dich an 5 aufeinanderfolgenden Tagen an', category: 'any', difficulty: 'medium', type: 'daily_streak', target: 5, xpReward: 350, bonusReward: null },
      { id: 'w4-c5', title: 'Spiele 3 Erdkunde-Spiele', description: 'Erkunde die Welt mit 3 Erdkunde-Lernspielen', category: 'erdkunde', difficulty: 'easy', type: 'games_played', target: 3, xpReward: 200, bonusReward: null },
    ],
  },
]

// ---------- RARITY CONFIG ----------
export const RARITY_CONFIG = {
  common: { label: 'Gewoehnlich', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30' },
  uncommon: { label: 'Ungewoehnlich', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  rare: { label: 'Selten', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  epic: { label: 'Episch', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  legendary: { label: 'Legendaer', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
}

// ---------- DIFFICULTY CONFIG ----------
export const DIFFICULTY_CONFIG = {
  easy: { label: 'Leicht', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  medium: { label: 'Mittel', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  hard: { label: 'Schwer', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
}

// ---------- PREMIUM PASS PRICE ----------
export const PREMIUM_PASS_PRICE = 950 // MindCoins
