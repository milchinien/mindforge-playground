const PLAYER_ACHIEVEMENTS = [
  // Games played
  { id: 'first-steps', name: 'Erste Schritte', description: 'Spiele dein erstes Lernspiel', category: 'player', requirement: { type: 'games_played', value: 1 }, reward: { type: 'title', value: 'Anfaenger' }, icon: '\uD83D\uDC76' },
  { id: 'player', name: 'Spieler', description: 'Spiele 10 verschiedene Lernspiele', category: 'player', requirement: { type: 'games_played', value: 10 }, reward: { type: 'title', value: 'Spieler' }, icon: '\uD83C\uDFAE' },
  { id: 'gamer', name: 'Gamer', description: 'Spiele 25 verschiedene Lernspiele', category: 'player', requirement: { type: 'games_played', value: 25 }, reward: { type: 'title', value: 'Gamer' }, icon: '\uD83D\uDD79\uFE0F' },
  { id: 'veteran', name: 'Veteran', description: 'Spiele 100 verschiedene Lernspiele', category: 'player', requirement: { type: 'games_played', value: 100 }, reward: { type: 'title', value: 'Veteran' }, icon: '\uD83C\uDFC5' },
  { id: 'legend', name: 'Legende', description: 'Spiele 500 verschiedene Lernspiele', category: 'player', requirement: { type: 'games_played', value: 500 }, reward: { type: 'title', value: 'Legende' }, icon: '\uD83C\uDF1F' },
  // Games completed
  { id: 'finisher', name: 'Abschliesser', description: 'Schliesse 5 Spiele erfolgreich ab', category: 'player', requirement: { type: 'games_completed', value: 5 }, reward: { type: 'title', value: 'Abschliesser' }, icon: '\u2705' },
  { id: 'completionist', name: 'Perfektionist', description: 'Schliesse 50 Spiele erfolgreich ab', category: 'player', requirement: { type: 'games_completed', value: 50 }, reward: { type: 'title', value: 'Perfektionist' }, icon: '\uD83D\uDCAF' },
  // Streaks
  { id: 'daily-3', name: 'Drei-Tage-Serie', description: 'Spiele 3 Tage hintereinander', category: 'player', requirement: { type: 'daily_streak', value: 3 }, reward: { type: 'title', value: 'Fleissig' }, icon: '\uD83D\uDD25' },
  { id: 'daily-7', name: 'Wochen-Krieger', description: 'Spiele 7 Tage hintereinander', category: 'player', requirement: { type: 'daily_streak', value: 7 }, reward: { type: 'title', value: 'Wochen-Krieger' }, icon: '\u2694\uFE0F' },
  { id: 'daily-30', name: 'Monats-Champion', description: 'Spiele 30 Tage hintereinander', category: 'player', requirement: { type: 'daily_streak', value: 30 }, reward: { type: 'title', value: 'Champion' }, icon: '\uD83C\uDFC6' },
  // Likes
  { id: 'first-like', name: 'Erster Daumen', description: 'Bewerte dein erstes Spiel', category: 'player', requirement: { type: 'likes_given', value: 1 }, reward: { type: 'title', value: 'Kritiker' }, icon: '\uD83D\uDC4D' },
  { id: 'reviewer', name: 'Rezensent', description: 'Bewerte 25 Spiele', category: 'player', requirement: { type: 'likes_given', value: 25 }, reward: { type: 'title', value: 'Rezensent' }, icon: '\uD83D\uDCDD' },
  // Playtime
  { id: 'time-1h', name: 'Stunden-Spieler', description: 'Verbringe insgesamt 1 Stunde mit Lernspielen', category: 'player', requirement: { type: 'total_playtime_minutes', value: 60 }, reward: { type: 'title', value: 'Zeitspieler' }, icon: '\u23F1\uFE0F' },
  { id: 'time-10h', name: 'Zehn-Stunden-Meister', description: 'Verbringe insgesamt 10 Stunden mit Lernspielen', category: 'player', requirement: { type: 'total_playtime_minutes', value: 600 }, reward: { type: 'title', value: 'Marathon-Spieler' }, icon: '\u231B' },
  { id: 'time-100h', name: 'Hundert-Stunden-Legende', description: 'Verbringe insgesamt 100 Stunden mit Lernspielen', category: 'player', requirement: { type: 'total_playtime_minutes', value: 6000 }, reward: { type: 'title', value: 'Unaufhaltsam' }, icon: '\uD83D\uDD70\uFE0F' },
]

const SOCIAL_ACHIEVEMENTS = [
  // Following
  { id: 'connected', name: 'Vernetzt', description: 'Folge 5 Creatorn', category: 'social', requirement: { type: 'following_count', value: 5 }, reward: { type: 'title', value: 'Vernetzt' }, icon: '\uD83D\uDD17' },
  { id: 'super-fan', name: 'Super-Fan', description: 'Folge 25 Creatorn', category: 'social', requirement: { type: 'following_count', value: 25 }, reward: { type: 'title', value: 'Super-Fan' }, icon: '\u2B50' },
  // Followers
  { id: 'noticed', name: 'Bemerkt', description: 'Erhalte deinen ersten Follower', category: 'social', requirement: { type: 'followers_count', value: 1 }, reward: { type: 'title', value: 'Bemerkt' }, icon: '\uD83D\uDC41\uFE0F' },
  { id: 'popular', name: 'Beliebt', description: 'Erhalte 10 Follower', category: 'social', requirement: { type: 'followers_count', value: 10 }, reward: { type: 'title', value: 'Beliebt' }, icon: '\uD83C\uDF1F' },
  { id: 'influencer', name: 'Influencer', description: 'Erhalte 50 Follower', category: 'social', requirement: { type: 'followers_count', value: 50 }, reward: { type: 'title', value: 'Influencer' }, icon: '\uD83D\uDCE2' },
  { id: 'celebrity', name: 'Beruehmtheit', description: 'Erhalte 200 Follower', category: 'social', requirement: { type: 'followers_count', value: 200 }, reward: { type: 'title', value: 'Beruehmtheit' }, icon: '\uD83C\uDFAC' },
  { id: 'superstar', name: 'Superstar', description: 'Erhalte 1000 Follower', category: 'social', requirement: { type: 'followers_count', value: 1000 }, reward: { type: 'title', value: 'Superstar' }, icon: '\uD83D\uDCAB' },
  // Friends
  { id: 'first-friend', name: 'Erster Freund', description: 'Fuege deinen ersten Freund hinzu', category: 'social', requirement: { type: 'friends_count', value: 1 }, reward: { type: 'title', value: 'Freundlich' }, icon: '\uD83E\uDD1D' },
  { id: 'social-butterfly', name: 'Sozialer Schmetterling', description: 'Habe 10 Freunde', category: 'social', requirement: { type: 'friends_count', value: 10 }, reward: { type: 'title', value: 'Gesellig' }, icon: '\uD83E\uDD8B' },
  { id: 'party-animal', name: 'Party-Tier', description: 'Habe 50 Freunde', category: 'social', requirement: { type: 'friends_count', value: 50 }, reward: { type: 'title', value: 'Party-Tier' }, icon: '\uD83C\uDF89' },
  { id: 'network-king', name: 'Netzwerk-Koenig', description: 'Habe 100 Freunde', category: 'social', requirement: { type: 'friends_count', value: 100 }, reward: { type: 'title', value: 'Netzwerk-Koenig' }, icon: '\uD83D\uDC51' },
  // Profile
  { id: 'avatar-creator', name: 'Stylisch', description: 'Passe deinen Avatar zum ersten Mal an', category: 'social', requirement: { type: 'avatar_customized', value: 1 }, reward: { type: 'title', value: 'Stylisch' }, icon: '\uD83C\uDFAD' },
  { id: 'profile-complete', name: 'Vollstaendig', description: 'Fuelle alle Profilfelder aus', category: 'social', requirement: { type: 'profile_complete', value: 1 }, reward: { type: 'title', value: 'Identitaet' }, icon: '\uD83D\uDCCB' },
  // Events
  { id: 'event-first', name: 'Event-Teilnehmer', description: 'Nimm an deinem ersten Event teil', category: 'social', requirement: { type: 'events_participated', value: 1 }, reward: { type: 'title', value: 'Teilnehmer' }, icon: '\uD83D\uDCC5' },
  { id: 'event-master', name: 'Event-Meister', description: 'Schliesse 10 Events erfolgreich ab', category: 'social', requirement: { type: 'events_completed', value: 10 }, reward: { type: 'title', value: 'Event-Meister' }, icon: '\uD83C\uDFC5' },
]

const SUBJECT_ACHIEVEMENTS = [
  // Mathe
  { id: 'mathe-beginner', name: 'Zahlen-Freund', description: 'Schliesse 5 Mathe-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 5, category: 'mathe' }, reward: { type: 'title', value: 'Zahlen-Freund' }, icon: '\uD83D\uDD22' },
  { id: 'mathe-pro', name: 'Mathe-Profi', description: 'Schliesse 25 Mathe-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 25, category: 'mathe' }, reward: { type: 'title', value: 'Mathe-Profi' }, icon: '\uD83D\uDCD0' },
  { id: 'mathe-genius', name: 'Mathe-Genie', description: 'Schliesse 10 Mathe-Spiele mit voller Punktzahl ab', category: 'subject', requirement: { type: 'category_perfect_scores', value: 10, category: 'mathe' }, reward: { type: 'title', value: 'Mathe-Genie' }, icon: '\uD83E\uDDEE' },
  // Physik
  { id: 'physik-beginner', name: 'Physik-Entdecker', description: 'Schliesse 5 Physik-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 5, category: 'physik' }, reward: { type: 'title', value: 'Physik-Entdecker' }, icon: '\u269B\uFE0F' },
  { id: 'physik-pro', name: 'Physik-Profi', description: 'Schliesse 25 Physik-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 25, category: 'physik' }, reward: { type: 'title', value: 'Physik-Profi' }, icon: '\uD83D\uDD2C' },
  { id: 'physik-genius', name: 'Einstein', description: 'Schliesse 10 Physik-Spiele mit voller Punktzahl ab', category: 'subject', requirement: { type: 'category_perfect_scores', value: 10, category: 'physik' }, reward: { type: 'title', value: 'Einstein' }, icon: '\uD83D\uDCA1' },
  // Chemie
  { id: 'chemie-beginner', name: 'Labor-Assistent', description: 'Schliesse 5 Chemie-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 5, category: 'chemie' }, reward: { type: 'title', value: 'Labor-Assistent' }, icon: '\uD83E\uDDEA' },
  { id: 'chemie-pro', name: 'Chemie-Profi', description: 'Schliesse 25 Chemie-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 25, category: 'chemie' }, reward: { type: 'title', value: 'Chemie-Profi' }, icon: '\u2697\uFE0F' },
  // Biologie
  { id: 'bio-beginner', name: 'Natur-Freund', description: 'Schliesse 5 Biologie-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 5, category: 'biologie' }, reward: { type: 'title', value: 'Natur-Freund' }, icon: '\uD83C\uDF3F' },
  { id: 'bio-pro', name: 'Biologie-Profi', description: 'Schliesse 25 Biologie-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 25, category: 'biologie' }, reward: { type: 'title', value: 'Biologie-Profi' }, icon: '\uD83E\uDDEC' },
  // Geschichte
  { id: 'geschichte-beginner', name: 'Zeitreisender', description: 'Schliesse 5 Geschichts-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 5, category: 'geschichte' }, reward: { type: 'title', value: 'Zeitreisender' }, icon: '\uD83D\uDCDC' },
  { id: 'geschichte-pro', name: 'Historiker', description: 'Schliesse 25 Geschichts-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 25, category: 'geschichte' }, reward: { type: 'title', value: 'Historiker' }, icon: '\uD83C\uDFDB\uFE0F' },
  // Sprachen
  { id: 'sprachen-beginner', name: 'Sprachschueler', description: 'Schliesse 5 Sprach-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 5, category: 'sprachen' }, reward: { type: 'title', value: 'Sprachschueler' }, icon: '\uD83D\uDDE3\uFE0F' },
  { id: 'sprachen-pro', name: 'Polyglott', description: 'Schliesse 25 Sprach-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 25, category: 'sprachen' }, reward: { type: 'title', value: 'Polyglott' }, icon: '\uD83C\uDF0D' },
  // Informatik
  { id: 'informatik-beginner', name: 'Code-Novize', description: 'Schliesse 5 Informatik-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 5, category: 'informatik' }, reward: { type: 'title', value: 'Code-Novize' }, icon: '\uD83D\uDCBB' },
  { id: 'informatik-pro', name: 'Hacker', description: 'Schliesse 25 Informatik-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 25, category: 'informatik' }, reward: { type: 'title', value: 'Hacker' }, icon: '\uD83D\uDDA5\uFE0F' },
  // Allgemeinwissen
  { id: 'allround-beginner', name: 'Wissbegierig', description: 'Schliesse Spiele aus 3 verschiedenen Fachgebieten ab', category: 'subject', requirement: { type: 'unique_categories_played', value: 3 }, reward: { type: 'title', value: 'Wissbegierig' }, icon: '\uD83D\uDCDA' },
  { id: 'allround-pro', name: 'Allround-Talent', description: 'Schliesse Spiele aus 6 verschiedenen Fachgebieten ab', category: 'subject', requirement: { type: 'unique_categories_played', value: 6 }, reward: { type: 'title', value: 'Allround-Talent' }, icon: '\uD83C\uDF93' },
  { id: 'allround-master', name: 'Universalgelehrter', description: 'Schliesse Spiele aus ALLEN Fachgebieten ab', category: 'subject', requirement: { type: 'unique_categories_played', value: 10 }, reward: { type: 'title', value: 'Universalgelehrter' }, icon: '\uD83E\uDD89' },
  // Musik
  { id: 'musik-beginner', name: 'Melodie-Freund', description: 'Schliesse 5 Musik-Spiele ab', category: 'subject', requirement: { type: 'category_games_completed', value: 5, category: 'musik' }, reward: { type: 'title', value: 'Melodie-Freund' }, icon: '\uD83C\uDFB5' },
]

const CREATOR_ACHIEVEMENTS = [
  // Games created
  { id: 'schoepfer', name: 'Schoepfer', description: 'Erstelle und veroeffentliche dein erstes Spiel', category: 'creator', requirement: { type: 'games_created', value: 1 }, reward: { type: 'title', value: 'Schoepfer' }, icon: '\uD83D\uDD28' },
  { id: 'builder', name: 'Baumeister', description: 'Erstelle 5 Spiele', category: 'creator', requirement: { type: 'games_created', value: 5 }, reward: { type: 'title', value: 'Baumeister' }, icon: '\uD83C\uDFD7\uFE0F' },
  { id: 'meisterschmied', name: 'Meisterschmied', description: 'Erstelle 10 Spiele', category: 'creator', requirement: { type: 'games_created', value: 10 }, reward: { type: 'title', value: 'Meisterschmied' }, icon: '\u2692\uFE0F' },
  { id: 'game-factory', name: 'Spiele-Fabrik', description: 'Erstelle 25 Spiele', category: 'creator', requirement: { type: 'games_created', value: 25 }, reward: { type: 'title', value: 'Spiele-Fabrik' }, icon: '\uD83C\uDFED' },
  { id: 'game-empire', name: 'Spiele-Imperium', description: 'Erstelle 50 Spiele', category: 'creator', requirement: { type: 'games_created', value: 50 }, reward: { type: 'title', value: 'Imperator' }, icon: '\uD83D\uDC51' },
  // Likes received
  { id: 'first-like-received', name: 'Erster Fan', description: 'Erhalte den ersten Like auf eines deiner Spiele', category: 'creator', requirement: { type: 'total_likes_received', value: 1 }, reward: { type: 'title', value: 'Geschaetzt' }, icon: '\u2764\uFE0F' },
  { id: 'crowd-pleaser', name: 'Publikumsliebling', description: 'Erhalte 100 Likes auf deine Spiele', category: 'creator', requirement: { type: 'total_likes_received', value: 100 }, reward: { type: 'title', value: 'Publikumsliebling' }, icon: '\uD83E\uDD70' },
  { id: 'beloved-creator', name: 'Geliebter Creator', description: 'Erhalte 1000 Likes auf deine Spiele', category: 'creator', requirement: { type: 'total_likes_received', value: 1000 }, reward: { type: 'title', value: 'Geliebter Creator' }, icon: '\uD83D\uDC9D' },
  // Plays received
  { id: 'first-player', name: 'Spielestart', description: 'Jemand spielt zum ersten Mal eines deiner Spiele', category: 'creator', requirement: { type: 'total_plays_received', value: 1 }, reward: { type: 'title', value: 'Spielestarter' }, icon: '\uD83C\uDFAF' },
  { id: 'popular-creator', name: 'Beliebter Creator', description: 'Deine Spiele wurden 500 Mal gespielt', category: 'creator', requirement: { type: 'total_plays_received', value: 500 }, reward: { type: 'title', value: 'Beliebter Creator' }, icon: '\uD83D\uDCCA' },
  { id: 'viral-creator', name: 'Viral', description: 'Deine Spiele wurden 5000 Mal gespielt', category: 'creator', requirement: { type: 'total_plays_received', value: 5000 }, reward: { type: 'title', value: 'Viral' }, icon: '\uD83D\uDE80' },
  // Quality
  { id: 'quality-creator', name: 'Qualitaets-Creator', description: 'Habe ein Spiel mit 90%+ positiven Bewertungen (mind. 50 Bewertungen)', category: 'creator', requirement: { type: 'game_approval_rate', value: 90 }, reward: { type: 'title', value: 'Qualitaets-Creator' }, icon: '\uD83D\uDC8E' },
  // Marketplace
  { id: 'marketplace-seller', name: 'Haendler', description: 'Verkaufe dein erstes Asset im Marketplace', category: 'creator', requirement: { type: 'assets_sold', value: 1 }, reward: { type: 'title', value: 'Haendler' }, icon: '\uD83D\uDED2' },
  { id: 'marketplace-pro', name: 'Top-Verkaeufer', description: 'Verkaufe 25 Assets im Marketplace', category: 'creator', requirement: { type: 'assets_sold', value: 25 }, reward: { type: 'title', value: 'Top-Verkaeufer' }, icon: '\uD83D\uDCB0' },
  // Premium
  { id: 'premium-member', name: 'Premium-Mitglied', description: 'Werde Premium-Mitglied', category: 'creator', requirement: { type: 'is_premium', value: 1 }, reward: { type: 'title', value: 'Premium' }, icon: '\uD83D\uDC8E' },
]

export const ALL_ACHIEVEMENTS = [
  ...PLAYER_ACHIEVEMENTS,
  ...SOCIAL_ACHIEVEMENTS,
  ...SUBJECT_ACHIEVEMENTS,
  ...CREATOR_ACHIEVEMENTS,
]

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'player', name: 'Spieler', icon: '\uD83C\uDFAE', count: PLAYER_ACHIEVEMENTS.length },
  { id: 'social', name: 'Sozial', icon: '\uD83D\uDC65', count: SOCIAL_ACHIEVEMENTS.length },
  { id: 'subject', name: 'Faecher', icon: '\uD83D\uDCDA', count: SUBJECT_ACHIEVEMENTS.length },
  { id: 'creator', name: 'Creator', icon: '\uD83D\uDD28', count: CREATOR_ACHIEVEMENTS.length },
]

export const MOCK_USER_PROGRESS = {
  games_played: 7,
  games_completed: 4,
  daily_streak: 2,
  likes_given: 3,
  total_playtime_minutes: 45,
  following_count: 3,
  followers_count: 1,
  friends_count: 2,
  avatar_customized: 1,
  profile_complete: 0,
  events_participated: 1,
  events_completed: 0,
  games_created: 0,
  total_likes_received: 0,
  total_plays_received: 0,
  assets_sold: 0,
  is_premium: 0,
  game_approval_rate: 0,
  category_games_completed: {
    mathe: 3, physik: 1, chemie: 0, biologie: 0,
    geschichte: 0, sprachen: 0, informatik: 0, musik: 0,
  },
  category_perfect_scores: {
    mathe: 1, physik: 0,
  },
  unique_categories_played: 2,
}

export {
  PLAYER_ACHIEVEMENTS,
  SOCIAL_ACHIEVEMENTS,
  SUBJECT_ACHIEVEMENTS,
  CREATOR_ACHIEVEMENTS,
}
