// Mock-Daten fuer das Chat-System

const now = Date.now()
const MINUTE = 60000
const HOUR = 3600000
const DAY = 86400000

// Freunde fuer Chat-Konversationen
export const chatFriends = [
  {
    id: 'friend-1',
    username: 'MaxGamer99',
    displayName: 'Max',
    emoji: '\uD83D\uDE0E',
    isOnline: true,
    lastSeen: now,
  },
  {
    id: 'friend-2',
    username: 'LenaLernt',
    displayName: 'Lena',
    emoji: '\uD83E\uDD13',
    isOnline: true,
    lastSeen: now - MINUTE * 3,
  },
  {
    id: 'friend-3',
    username: 'PixelPaul',
    displayName: 'Paul',
    emoji: '\uD83C\uDFA8',
    isOnline: false,
    lastSeen: now - HOUR * 2,
  },
  {
    id: 'friend-4',
    username: 'SarahStar',
    displayName: 'Sarah',
    emoji: '\u2B50',
    isOnline: false,
    lastSeen: now - DAY * 1,
  },
]

// Mock-Konversationen
export const mockConversations = {
  'friend-1': {
    friendId: 'friend-1',
    messages: [
      {
        id: 'msg-1-1',
        senderId: 'friend-1',
        text: 'Hey! Hast du schon das neue Mathe-Spiel ausprobiert?',
        timestamp: now - HOUR * 3,
        reactions: [],
      },
      {
        id: 'msg-1-2',
        senderId: 'me',
        text: 'Noch nicht, ist es gut?',
        timestamp: now - HOUR * 3 + MINUTE * 2,
        reactions: [],
      },
      {
        id: 'msg-1-3',
        senderId: 'friend-1',
        text: 'Mega! Ich hab schon 12.000 Punkte geschafft. Die Physik-Levels sind echt knifflig.',
        timestamp: now - HOUR * 3 + MINUTE * 5,
        reactions: ['\uD83D\uDD25'],
      },
      {
        id: 'msg-1-4',
        senderId: 'me',
        text: 'Nice, das probiere ich heute Abend mal aus!',
        timestamp: now - HOUR * 2 + MINUTE * 45,
        reactions: [],
      },
      {
        id: 'msg-1-5',
        senderId: 'friend-1',
        text: 'Sag Bescheid wenn du spielst, dann koennen wir zusammen die Quiz-Arena machen!',
        timestamp: now - HOUR * 2 + MINUTE * 48,
        reactions: ['\uD83D\uDC4D'],
      },
      {
        id: 'msg-1-6',
        senderId: 'me',
        text: 'Klar, mach ich! Bin ab 18 Uhr online.',
        timestamp: now - HOUR * 1,
        reactions: [],
      },
    ],
  },
  'friend-2': {
    friendId: 'friend-2',
    messages: [
      {
        id: 'msg-2-1',
        senderId: 'friend-2',
        text: 'Hi! Kannst du mir bei dem Chemie-Quiz helfen? Ich komm bei Level 5 nicht weiter.',
        timestamp: now - DAY * 1,
        reactions: [],
      },
      {
        id: 'msg-2-2',
        senderId: 'me',
        text: 'Klar! Bei Level 5 musst du die Elemente nach Elektronegativitaet sortieren.',
        timestamp: now - DAY * 1 + MINUTE * 15,
        reactions: ['\u2764\uFE0F'],
      },
      {
        id: 'msg-2-3',
        senderId: 'friend-2',
        text: 'Ahh, danke! Das hat geholfen. Hab jetzt 3 Sterne!',
        timestamp: now - DAY * 1 + MINUTE * 40,
        reactions: ['\uD83C\uDF89'],
      },
      {
        id: 'msg-2-4',
        senderId: 'friend-2',
        text: 'Uebrigens, hast du Lust morgen zusammen ein Spiel zu erstellen?',
        timestamp: now - HOUR * 5,
        reactions: [],
      },
      {
        id: 'msg-2-5',
        senderId: 'me',
        text: 'Ja, mega gerne! Was fuer ein Thema?',
        timestamp: now - HOUR * 4,
        reactions: [],
      },
      {
        id: 'msg-2-6',
        senderId: 'friend-2',
        text: 'Ich dachte an ein Biologie-Memory mit Zellen und Organellen. Waere das cool?',
        timestamp: now - HOUR * 3 + MINUTE * 30,
        reactions: [],
      },
    ],
  },
  'friend-3': {
    friendId: 'friend-3',
    messages: [
      {
        id: 'msg-3-1',
        senderId: 'me',
        text: 'Paul, dein neues Spiel sieht echt toll aus!',
        timestamp: now - DAY * 2,
        reactions: [],
      },
      {
        id: 'msg-3-2',
        senderId: 'friend-3',
        text: 'Danke! Hab ueber 2 Wochen daran gearbeitet. Die Grafiken waren am schwierigsten.',
        timestamp: now - DAY * 2 + MINUTE * 10,
        reactions: [],
      },
      {
        id: 'msg-3-3',
        senderId: 'friend-3',
        text: 'Hast du schon das Easter Egg auf Level 3 gefunden?',
        timestamp: now - DAY * 2 + MINUTE * 12,
        reactions: ['\uD83D\uDC40'],
      },
      {
        id: 'msg-3-4',
        senderId: 'me',
        text: 'Nee, noch nicht! Gib mir einen Hinweis?',
        timestamp: now - DAY * 1 - HOUR * 20,
        reactions: [],
      },
      {
        id: 'msg-3-5',
        senderId: 'friend-3',
        text: 'Klick 3x auf den blauen Kristall! Mehr sag ich nicht.',
        timestamp: now - DAY * 1 - HOUR * 18,
        reactions: ['\uD83D\uDE02'],
      },
    ],
  },
  'friend-4': {
    friendId: 'friend-4',
    messages: [
      {
        id: 'msg-4-1',
        senderId: 'friend-4',
        text: 'Hey, willst du meinem Team fuer das Event am Wochenende beitreten?',
        timestamp: now - DAY * 3,
        reactions: [],
      },
      {
        id: 'msg-4-2',
        senderId: 'me',
        text: 'Welches Event meinst du?',
        timestamp: now - DAY * 3 + MINUTE * 30,
        reactions: [],
      },
      {
        id: 'msg-4-3',
        senderId: 'friend-4',
        text: 'Das Wissens-Turnier! 3er-Teams, jeder nimmt ein Fach. Ich mach Geschichte, brauch noch jemanden fuer Mathe und Naturwissenschaften.',
        timestamp: now - DAY * 3 + MINUTE * 35,
        reactions: [],
      },
      {
        id: 'msg-4-4',
        senderId: 'me',
        text: 'Bin dabei! Ich nehm Mathe.',
        timestamp: now - DAY * 2 - HOUR * 10,
        reactions: ['\uD83D\uDE4C'],
      },
    ],
  },
}

// Content-Filter Wortliste (Jugendschutz)
export const blockedWords = [
  // Deutsche Schimpfwoerter
  'schei\u00DFe', 'scheisse', 'arsch', 'arschloch', 'fick', 'ficken',
  'hurensohn', 'hure', 'wichser', 'bastard', 'missgeburt', 'behindert',
  'spast', 'idiot', 'depp', 'vollidiot', 'dumm', 'penner', 'assi',
  'fotze', 'schwuchtel', 'schlampe', 'drecksau', 'wixer',
  // Englische Begriffe (haeufig genutzt)
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'dick', 'pussy',
  'bastard', 'whore', 'slut', 'retard', 'stupid',
  // Jugendgefaehrdende Begriffe
  'nazi', 'hitler', 'heil', 'sieg heil', 'drogen', 'kiffen',
  'saufen', 'porno', 'sex', 'nackt',
  // Mobbing-Begriffe
  'opfer', 'loser', 'versager', 'huso', 'hurenson',
]

// Schnell-Reaktionen (Emojis)
export const quickReactions = [
  '\uD83D\uDC4D', // Daumen hoch
  '\u2764\uFE0F', // Herz
  '\uD83D\uDE02', // Lachend
  '\uD83D\uDD25', // Feuer
  '\uD83C\uDF89', // Party
  '\uD83D\uDE2E', // Ueberrascht
  '\uD83D\uDC4F', // Klatschen
  '\uD83D\uDE4C', // Haende hoch
  '\uD83D\uDCAF', // 100
  '\uD83D\uDC40', // Augen
  '\uD83E\uDD14', // Nachdenklich
  '\uD83D\uDE22', // Traurig
]
