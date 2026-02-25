// ============= SEASON SYSTEM DATA =============
// Season 1: "Wissensdurst" - Mock data for Battle Pass, Weekly Challenges, Leaderboard

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
    primary: '#6366f1',    // Indigo
    secondary: '#818cf8',  // Light indigo
    accent: '#a78bfa',     // Violet
    gradient: 'from-indigo-600 via-violet-600 to-purple-600',
    bgGradient: 'from-indigo-900/30 via-violet-900/20 to-purple-900/30',
    icon: 'book-open',
  },
  xpPerTier: 1000,
  maxTier: 30,
}

// ---------- BATTLE PASS TIERS (30 Tiers) ----------
// Each tier has a free reward and optionally a premium reward
export const BATTLE_PASS_TIERS = [
  // Tier 1-5: Einstieg
  {
    tier: 1,
    xpRequired: 0,
    free: { type: 'xp-booster', name: '+10% XP Booster', description: '2 Stunden aktiv', duration: '2h', icon: 'zap', rarity: 'common' },
    premium: { type: 'avatar-frame', name: 'Wissens-Rahmen', description: 'Ein schlichter blauer Rahmen', icon: 'frame', rarity: 'common' },
  },
  {
    tier: 2,
    xpRequired: 1000,
    free: { type: 'badge', name: 'Season 1 Teilnehmer', description: 'Zeigt deine Teilnahme an Season 1', icon: 'award', rarity: 'common' },
    premium: { type: 'xp-booster', name: '+25% XP Booster', description: '1 Stunde aktiv', duration: '1h', icon: 'zap', rarity: 'uncommon' },
  },
  {
    tier: 3,
    xpRequired: 2000,
    free: null,
    premium: { type: 'avatar-item', name: 'Gelehrten-Brille', description: 'Eine stylische Brille fuer Wissbegierige', icon: 'glasses', rarity: 'uncommon' },
  },
  {
    tier: 4,
    xpRequired: 3000,
    free: { type: 'xp-booster', name: '+10% XP Booster', description: '4 Stunden aktiv', duration: '4h', icon: 'zap', rarity: 'common' },
    premium: null,
  },
  {
    tier: 5,
    xpRequired: 4000,
    free: { type: 'title', name: 'Wissbegierig', description: 'Zeige allen deine Neugier', icon: 'tag', rarity: 'uncommon' },
    premium: { type: 'avatar-item', name: 'Buecherwurm-Muetze', description: 'Eine suesse Muetze mit Buch-Motiv', icon: 'book', rarity: 'uncommon' },
  },

  // Tier 6-10: Fortgeschritten
  {
    tier: 6,
    xpRequired: 5000,
    free: { type: 'xp-booster', name: '+15% XP Booster', description: '3 Stunden aktiv', duration: '3h', icon: 'zap', rarity: 'uncommon' },
    premium: { type: 'profile-banner', name: 'Galaxie-Banner', description: 'Ein kosmisches Profilbanner', icon: 'image', rarity: 'rare' },
  },
  {
    tier: 7,
    xpRequired: 6000,
    free: null,
    premium: { type: 'avatar-item', name: 'Wissens-Umhang', description: 'Ein mystischer Umhang des Wissens', icon: 'shield', rarity: 'rare' },
  },
  {
    tier: 8,
    xpRequired: 7000,
    free: { type: 'badge', name: 'Aufsteiger', description: 'Du hast Tier 8 erreicht!', icon: 'trending-up', rarity: 'uncommon' },
    premium: { type: 'xp-booster', name: '+50% XP Booster', description: '1 Stunde aktiv', duration: '1h', icon: 'zap', rarity: 'rare' },
  },
  {
    tier: 9,
    xpRequired: 8000,
    free: { type: 'xp-booster', name: '+10% XP Booster', description: '6 Stunden aktiv', duration: '6h', icon: 'zap', rarity: 'common' },
    premium: null,
  },
  {
    tier: 10,
    xpRequired: 9000,
    free: { type: 'title', name: 'Entdecker', description: 'Fuer die neugierigen Geister', icon: 'tag', rarity: 'rare' },
    premium: { type: 'avatar-frame', name: 'Flammen-Rahmen', description: 'Ein feuriger Profilrahmen', icon: 'frame', rarity: 'rare' },
  },

  // Tier 11-15: Erfahren
  {
    tier: 11,
    xpRequired: 10000,
    free: { type: 'xp-booster', name: '+20% XP Booster', description: '2 Stunden aktiv', duration: '2h', icon: 'zap', rarity: 'uncommon' },
    premium: { type: 'avatar-item', name: 'Neon-Kopfhoerer', description: 'Leuchtende Kopfhoerer im Cyberpunk-Stil', icon: 'headphones', rarity: 'rare' },
  },
  {
    tier: 12,
    xpRequired: 11000,
    free: null,
    premium: { type: 'profile-effect', name: 'Partikel-Effekt: Sterne', description: 'Sterne schweben um dein Profil', icon: 'sparkles', rarity: 'rare' },
  },
  {
    tier: 13,
    xpRequired: 12000,
    free: { type: 'badge', name: 'Halbzeit!', description: 'Fast die Haelfte geschafft', icon: 'clock', rarity: 'uncommon' },
    premium: { type: 'xp-booster', name: '+25% XP Booster', description: '4 Stunden aktiv', duration: '4h', icon: 'zap', rarity: 'rare' },
  },
  {
    tier: 14,
    xpRequired: 13000,
    free: { type: 'xp-booster', name: '+15% XP Booster', description: '4 Stunden aktiv', duration: '4h', icon: 'zap', rarity: 'uncommon' },
    premium: null,
  },
  {
    tier: 15,
    xpRequired: 14000,
    free: { type: 'title', name: 'Gelehrter', description: 'Ein Titel fuer wahre Wissenssuchende', icon: 'tag', rarity: 'rare' },
    premium: { type: 'avatar-item', name: 'Kristall-Amulett', description: 'Ein leuchtendes Amulett des Wissens', icon: 'gem', rarity: 'epic' },
  },

  // Tier 16-20: Experte
  {
    tier: 16,
    xpRequired: 15000,
    free: { type: 'xp-booster', name: '+25% XP Booster', description: '3 Stunden aktiv', duration: '3h', icon: 'zap', rarity: 'uncommon' },
    premium: { type: 'avatar-frame', name: 'Kristall-Rahmen', description: 'Ein funkelnder Kristallrahmen', icon: 'frame', rarity: 'epic' },
  },
  {
    tier: 17,
    xpRequired: 16000,
    free: null,
    premium: { type: 'avatar-item', name: 'Magier-Robe', description: 'Eine epische Robe fuer Wissensmagier', icon: 'wand', rarity: 'epic' },
  },
  {
    tier: 18,
    xpRequired: 17000,
    free: { type: 'badge', name: 'Experte', description: 'Tier 18 erreicht - Respekt!', icon: 'star', rarity: 'rare' },
    premium: { type: 'xp-booster', name: '+50% XP Booster', description: '3 Stunden aktiv', duration: '3h', icon: 'zap', rarity: 'epic' },
  },
  {
    tier: 19,
    xpRequired: 18000,
    free: { type: 'xp-booster', name: '+20% XP Booster', description: '6 Stunden aktiv', duration: '6h', icon: 'zap', rarity: 'uncommon' },
    premium: null,
  },
  {
    tier: 20,
    xpRequired: 19000,
    free: { type: 'title', name: 'Meister des Wissens', description: 'Nur die Besten tragen diesen Titel', icon: 'tag', rarity: 'epic' },
    premium: { type: 'profile-banner', name: 'Aurora-Banner', description: 'Ein atemberaubendes Nordlicht-Banner', icon: 'image', rarity: 'epic' },
  },

  // Tier 21-25: Meister
  {
    tier: 21,
    xpRequired: 20000,
    free: { type: 'xp-booster', name: '+30% XP Booster', description: '2 Stunden aktiv', duration: '2h', icon: 'zap', rarity: 'rare' },
    premium: { type: 'avatar-item', name: 'Elementar-Fluegel', description: 'Mystische Fluegel aus reiner Energie', icon: 'feather', rarity: 'epic' },
  },
  {
    tier: 22,
    xpRequired: 21000,
    free: null,
    premium: { type: 'profile-effect', name: 'Partikel-Effekt: Feuer', description: 'Flammen tanzen um dein Profil', icon: 'flame', rarity: 'epic' },
  },
  {
    tier: 23,
    xpRequired: 22000,
    free: { type: 'badge', name: 'Fast geschafft!', description: 'Die letzten Tiers warten', icon: 'target', rarity: 'rare' },
    premium: { type: 'xp-booster', name: '+75% XP Booster', description: '1 Stunde aktiv', duration: '1h', icon: 'zap', rarity: 'epic' },
  },
  {
    tier: 24,
    xpRequired: 23000,
    free: { type: 'xp-booster', name: '+25% XP Booster', description: '8 Stunden aktiv', duration: '8h', icon: 'zap', rarity: 'rare' },
    premium: null,
  },
  {
    tier: 25,
    xpRequired: 24000,
    free: { type: 'title', name: 'Wissens-Champion', description: 'Champion der ersten Season', icon: 'tag', rarity: 'epic' },
    premium: { type: 'avatar-frame', name: 'Legendaerer Rahmen', description: 'Ein goldener, animierter Rahmen', icon: 'frame', rarity: 'legendary' },
  },

  // Tier 26-30: Legende
  {
    tier: 26,
    xpRequired: 25000,
    free: { type: 'xp-booster', name: '+50% XP Booster', description: '2 Stunden aktiv', duration: '2h', icon: 'zap', rarity: 'epic' },
    premium: { type: 'avatar-item', name: 'Drachen-Schulterstueck', description: 'Ein Drache ruht auf deiner Schulter', icon: 'shield', rarity: 'legendary' },
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
    free: { type: 'badge', name: 'Unaufhaltsam', description: 'Tier 28 - Nur noch 2!', icon: 'flame', rarity: 'epic' },
    premium: { type: 'xp-booster', name: '+100% XP Booster', description: '1 Stunde aktiv', duration: '1h', icon: 'zap', rarity: 'legendary' },
  },
  {
    tier: 29,
    xpRequired: 28000,
    free: { type: 'xp-booster', name: '+50% XP Booster', description: '4 Stunden aktiv', duration: '4h', icon: 'zap', rarity: 'epic' },
    premium: { type: 'profile-effect', name: 'Partikel-Effekt: Galaxie', description: 'Eine ganze Galaxie umgibt dein Profil', icon: 'sparkles', rarity: 'legendary' },
  },
  {
    tier: 30,
    xpRequired: 29000,
    free: { type: 'title', name: 'Legende der Season 1', description: 'Der ultimative Titel fuer wahre Meister', icon: 'crown', rarity: 'legendary' },
    premium: { type: 'avatar-item', name: 'Wissensdurst-Ruestung', description: 'Die exklusive legendaere Ruestung der Season 1 - nie wieder erhaeltlich!', icon: 'shield', rarity: 'legendary' },
  },
]

// ---------- WEEKLY CHALLENGES ----------
// 5 challenges per week, rotating. Week number calculated from season start.
export const WEEKLY_CHALLENGES = [
  // Woche 1
  {
    week: 1,
    challenges: [
      {
        id: 'w1-c1',
        title: 'Spiele 5 Mathe-Spiele',
        description: 'Starte und spiele 5 verschiedene Mathe-Lernspiele',
        category: 'mathe',
        difficulty: 'easy',
        type: 'games_played',
        target: 5,
        xpReward: 200,
        bonusReward: null,
      },
      {
        id: 'w1-c2',
        title: 'Erreiche 3x Highscore',
        description: 'Erziele in 3 verschiedenen Spielen einen neuen Highscore',
        category: 'any',
        difficulty: 'medium',
        type: 'highscores',
        target: 3,
        xpReward: 350,
        bonusReward: { type: 'badge', name: 'Wochen-Sieger', icon: 'trophy' },
      },
      {
        id: 'w1-c3',
        title: 'Spiele 3 Tage hintereinander',
        description: 'Melde dich an 3 aufeinanderfolgenden Tagen an und spiele mindestens ein Spiel',
        category: 'any',
        difficulty: 'easy',
        type: 'daily_streak',
        target: 3,
        xpReward: 150,
        bonusReward: null,
      },
      {
        id: 'w1-c4',
        title: 'Schliesse 10 Spiele ab',
        description: 'Beende 10 Lernspiele erfolgreich (beliebige Kategorie)',
        category: 'any',
        difficulty: 'medium',
        type: 'games_completed',
        target: 10,
        xpReward: 400,
        bonusReward: null,
      },
      {
        id: 'w1-c5',
        title: 'Perfekte Runde in Naturwissenschaften',
        description: 'Erreiche in einem Naturwissenschaften-Spiel 100% korrekte Antworten',
        category: 'naturwissenschaften',
        difficulty: 'hard',
        type: 'perfect_score',
        target: 1,
        xpReward: 500,
        bonusReward: { type: 'title', name: 'Perfektionist der Woche', icon: 'star' },
      },
    ],
  },
  // Woche 2
  {
    week: 2,
    challenges: [
      {
        id: 'w2-c1',
        title: 'Spiele 3 Sprach-Spiele',
        description: 'Teste dein Sprachwissen in 3 verschiedenen Spielen',
        category: 'sprachen',
        difficulty: 'easy',
        type: 'games_played',
        target: 3,
        xpReward: 200,
        bonusReward: null,
      },
      {
        id: 'w2-c2',
        title: 'Sammle 2.000 XP',
        description: 'Verdiene insgesamt 2.000 Season-XP in dieser Woche',
        category: 'any',
        difficulty: 'medium',
        type: 'xp_earned',
        target: 2000,
        xpReward: 300,
        bonusReward: null,
      },
      {
        id: 'w2-c3',
        title: 'Bewerte 5 Spiele',
        description: 'Gib 5 verschiedenen Spielen eine Bewertung',
        category: 'any',
        difficulty: 'easy',
        type: 'likes_given',
        target: 5,
        xpReward: 150,
        bonusReward: null,
      },
      {
        id: 'w2-c4',
        title: 'Gewinne 5 Quiz-Duelle',
        description: 'Siege in 5 Multiplayer-Quiz-Runden',
        category: 'quiz',
        difficulty: 'hard',
        type: 'quiz_wins',
        target: 5,
        xpReward: 500,
        bonusReward: { type: 'avatar-item', name: 'Quiz-Krone', icon: 'crown' },
      },
      {
        id: 'w2-c5',
        title: 'Spiele 7 verschiedene Kategorien',
        description: 'Spiele mindestens ein Spiel aus 7 verschiedenen Fachbereichen',
        category: 'any',
        difficulty: 'medium',
        type: 'unique_categories',
        target: 7,
        xpReward: 350,
        bonusReward: { type: 'badge', name: 'Allrounder', icon: 'compass' },
      },
    ],
  },
  // Woche 3
  {
    week: 3,
    challenges: [
      {
        id: 'w3-c1',
        title: 'Spiele 30 Minuten',
        description: 'Verbringe insgesamt 30 Minuten mit Lernspielen',
        category: 'any',
        difficulty: 'easy',
        type: 'playtime_minutes',
        target: 30,
        xpReward: 200,
        bonusReward: null,
      },
      {
        id: 'w3-c2',
        title: '5 Spiele in Folge gewinnen',
        description: 'Schliesse 5 Spiele hintereinander erfolgreich ab',
        category: 'any',
        difficulty: 'hard',
        type: 'win_streak',
        target: 5,
        xpReward: 500,
        bonusReward: { type: 'title', name: 'Unbesiegbar', icon: 'shield' },
      },
      {
        id: 'w3-c3',
        title: 'Spiele 4 Geschichte-Spiele',
        description: 'Reise durch die Zeit mit 4 Geschichte-Spielen',
        category: 'geschichte',
        difficulty: 'easy',
        type: 'games_played',
        target: 4,
        xpReward: 200,
        bonusReward: null,
      },
      {
        id: 'w3-c4',
        title: 'Erreiche Tier 10',
        description: 'Steige im Battle Pass auf Tier 10 auf',
        category: 'any',
        difficulty: 'medium',
        type: 'reach_tier',
        target: 10,
        xpReward: 400,
        bonusReward: { type: 'xp-booster', name: '+25% XP Booster (2h)', icon: 'zap' },
      },
      {
        id: 'w3-c5',
        title: 'Lade einen Freund ein',
        description: 'Fuege einen neuen Freund zu deiner Freundesliste hinzu',
        category: 'social',
        difficulty: 'medium',
        type: 'friends_added',
        target: 1,
        xpReward: 300,
        bonusReward: null,
      },
    ],
  },
  // Woche 4
  {
    week: 4,
    challenges: [
      {
        id: 'w4-c1',
        title: 'Spiele 8 Spiele',
        description: 'Starte und spiele 8 beliebige Lernspiele',
        category: 'any',
        difficulty: 'easy',
        type: 'games_played',
        target: 8,
        xpReward: 250,
        bonusReward: null,
      },
      {
        id: 'w4-c2',
        title: 'Sammle 3.000 XP',
        description: 'Verdiene insgesamt 3.000 Season-XP in dieser Woche',
        category: 'any',
        difficulty: 'hard',
        type: 'xp_earned',
        target: 3000,
        xpReward: 500,
        bonusReward: { type: 'badge', name: 'XP-Jaeger', icon: 'target' },
      },
      {
        id: 'w4-c3',
        title: '2x Perfekte Runde',
        description: 'Erreiche in 2 beliebigen Spielen 100% korrekte Antworten',
        category: 'any',
        difficulty: 'hard',
        type: 'perfect_score',
        target: 2,
        xpReward: 500,
        bonusReward: { type: 'title', name: 'Makelloser Geist', icon: 'sparkles' },
      },
      {
        id: 'w4-c4',
        title: 'Spiele 5 Tage hintereinander',
        description: 'Melde dich an 5 aufeinanderfolgenden Tagen an',
        category: 'any',
        difficulty: 'medium',
        type: 'daily_streak',
        target: 5,
        xpReward: 350,
        bonusReward: null,
      },
      {
        id: 'w4-c5',
        title: 'Spiele 3 Erdkunde-Spiele',
        description: 'Erkunde die Welt mit 3 Erdkunde-Lernspielen',
        category: 'erdkunde',
        difficulty: 'easy',
        type: 'games_played',
        target: 3,
        xpReward: 200,
        bonusReward: null,
      },
    ],
  },
]

// ---------- SEASON LEADERBOARD ----------
export const SEASON_LEADERBOARD = [
  { id: 'user-100', username: 'PixelMaster', seasonXP: 22400, tier: 23, gamesPlayed: 156, challengesCompleted: 18 },
  { id: 'user-102', username: 'QuizKoenig', seasonXP: 19800, tier: 20, gamesPlayed: 134, challengesCompleted: 16 },
  { id: 'user-101', username: 'BrainStorm99', seasonXP: 17200, tier: 18, gamesPlayed: 121, challengesCompleted: 14 },
  { id: 'user-106', username: 'MathGenius', seasonXP: 15600, tier: 16, gamesPlayed: 108, challengesCompleted: 13 },
  { id: 'user-104', username: 'WissenHeld', seasonXP: 14100, tier: 15, gamesPlayed: 98, challengesCompleted: 12 },
  { id: 'user-103', username: 'LernFuchs', seasonXP: 12800, tier: 13, gamesPlayed: 89, challengesCompleted: 11 },
  { id: 'user-109', username: 'GeoExpert', seasonXP: 11200, tier: 12, gamesPlayed: 77, challengesCompleted: 9 },
  { id: 'user-105', username: 'CodeNinja42', seasonXP: 9800, tier: 10, gamesPlayed: 68, challengesCompleted: 8 },
  { id: 'user-107', username: 'ScienceGirl', seasonXP: 8400, tier: 9, gamesPlayed: 58, challengesCompleted: 7 },
  { id: 'user-112', username: 'SprachProfi', seasonXP: 7100, tier: 8, gamesPlayed: 49, challengesCompleted: 6 },
  { id: 'user-108', username: 'HistoryPro', seasonXP: 5800, tier: 6, gamesPlayed: 40, challengesCompleted: 5 },
  { id: 'user-111', username: 'BioNerd', seasonXP: 4500, tier: 5, gamesPlayed: 31, challengesCompleted: 4 },
  { id: 'user-113', username: 'KunstFan', seasonXP: 3200, tier: 4, gamesPlayed: 22, challengesCompleted: 3 },
  { id: 'user-114', username: 'MusikStar', seasonXP: 2100, tier: 3, gamesPlayed: 14, challengesCompleted: 2 },
  { id: 'user-110', username: 'PhysikFan', seasonXP: 1200, tier: 2, gamesPlayed: 8, challengesCompleted: 1 },
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
