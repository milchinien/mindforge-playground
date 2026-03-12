// Chat-System Daten

// MindForge AI Lernassistent
export const mindForgeBot = {
  id: 'mindforge-ai',
  username: 'ForgeBot',
  displayName: 'ForgeBot',
  emoji: '\u2699\uFE0F',
  isOnline: true,
  isBot: true,
  lastSeen: Date.now(),
}

// Willkommensnachricht vom Bot
export function getWelcomeMessages() {
  const now = Date.now()
  return [
    {
      id: 'welcome-1',
      senderId: 'mindforge-ai',
      text: 'Hey! Ich bin ForgeBot, dein persoenlicher Lernassistent bei MindForge! \u{1F916}',
      timestamp: now - 2000,
      reactions: [],
    },
    {
      id: 'welcome-2',
      senderId: 'mindforge-ai',
      text: 'Ich kann dir helfen mit:\n\n\u2022 Lerntipps zu jedem Fach\n\u2022 Spiel-Empfehlungen passend zu deinen Interessen\n\u2022 Motivation und Lernstrategien\n\nSchreib mir einfach, was du lernen moechtest!',
      timestamp: now - 1000,
      reactions: [],
    },
  ]
}

// Spiel-Empfehlungen nach Fach
const gameRecommendations = {
  mathematik: {
    tips: [
      'Versuche taeglich 10-15 Minuten Mathe zu ueben - Regelmaessigkeit schlaegt Intensitaet!',
      'Verstehe die Konzepte, statt nur Formeln auswendig zu lernen.',
      'Fehler sind deine besten Lehrer - analysiere jeden Fehler genau.',
    ],
    games: [],
  },
  physik: {
    tips: [
      'Physik wird klarer, wenn du dir Alltagsbeispiele ueberlegst.',
      'Zeichne Skizzen und Diagramme - sie helfen beim Verstaendnis enorm!',
      'Experimentiere! Auch gedankliche Experimente helfen.',
    ],
    games: [],
  },
  chemie: {
    tips: [
      'Lerne das Periodensystem in Gruppen, nicht alles auf einmal.',
      'Verstehe die Elektronenkonfiguration - sie erklaert fast alles!',
      'Erstelle Karteikarten fuer chemische Reaktionen.',
    ],
    games: [],
  },
  deutsch: {
    tips: [
      'Lies taeglich mindestens 15 Minuten - egal was, Hauptsache lesen!',
      'Fuehre ein Wortschatz-Tagebuch mit neuen Woertern.',
      'Uebe Rechtschreibung mit Diktaten.',
    ],
    games: [],
  },
  englisch: {
    tips: [
      'Schau Filme und Serien auf Englisch mit Untertiteln.',
      'Denke in Englisch - beschreibe deinen Tag im Kopf auf Englisch!',
      'Nutze Vokabel-Apps fuer taegliches Training.',
    ],
    games: [],
  },
  biologie: {
    tips: [
      'Erstelle Mind-Maps fuer biologische Systeme.',
      'Verbinde Theorie mit der Natur - beobachte Pflanzen und Tiere!',
      'Lerne mit Bildern und Diagrammen.',
    ],
    games: [],
  },
  geschichte: {
    tips: [
      'Erstelle Zeitleisten - sie helfen, Zusammenhaenge zu sehen.',
      'Versuche, Geschichte wie eine Story zu verstehen, nicht als Daten.',
      'Diskutiere historische Ereignisse mit anderen.',
    ],
    games: [],
  },
  geographie: {
    tips: [
      'Nutze Google Maps zum Erkunden - virtuelles Reisen bildet!',
      'Lerne Laender in Gruppen (nach Kontinent).',
      'Verbinde Geographie mit aktuellen Nachrichten.',
    ],
    games: [],
  },
  informatik: {
    tips: [
      'Programmieren lernt man nur durch Programmieren - uebe taeglich!',
      'Starte mit kleinen Projekten, die dich interessieren.',
      'Lies Code von anderen und verstehe ihn.',
    ],
    games: [],
  },
  kunst: {
    tips: [
      'Uebe taeglich Skizzieren - auch 5 Minuten reichen.',
      'Studiere Kunstwerke beruehmter Kuenstler.',
      'Experimentiere mit verschiedenen Techniken.',
    ],
    games: [],
  },
  musik: {
    tips: [
      'Uebe ein Instrument regelmaessig, auch wenn nur 10 Minuten.',
      'Hoere verschiedene Musikgenres bewusst an.',
      'Lerne Noten lesen - es oeffnet eine neue Welt!',
    ],
    games: [],
  },
}

// Keyword-Zuordnung zu Faechern
const subjectKeywords = {
  mathematik: ['mathe', 'mathematik', 'rechnen', 'zahlen', 'algebra', 'geometrie', 'bruch', 'brueche', 'gleichung', 'formel', 'addition', 'multiplikation', 'division', 'subtraktion', 'prozent'],
  physik: ['physik', 'kraft', 'energie', 'schwerkraft', 'geschwindigkeit', 'beschleunigung', 'strom', 'spannung', 'widerstand', 'newton', 'elektrizitaet'],
  chemie: ['chemie', 'element', 'atom', 'molekuel', 'reaktion', 'periodensystem', 'saeure', 'base', 'bindung', 'ion'],
  deutsch: ['deutsch', 'grammatik', 'rechtschreibung', 'aufsatz', 'lesen', 'schreiben', 'wortschatz', 'diktat', 'literatur', 'gedicht'],
  englisch: ['englisch', 'english', 'vokabeln', 'vocabulary', 'grammar', 'sprache'],
  biologie: ['bio', 'biologie', 'zelle', 'evolution', 'oekosystem', 'pflanze', 'tier', 'organ', 'dna', 'genetik', 'koerper'],
  geschichte: ['geschichte', 'history', 'mittelalter', 'roemer', 'krieg', 'epoche', 'antike', 'revolution', 'kaiser'],
  geographie: ['geo', 'geographie', 'erdkunde', 'land', 'laender', 'kontinent', 'hauptstadt', 'karte', 'klima'],
  informatik: ['informatik', 'programmieren', 'coding', 'code', 'python', 'javascript', 'computer', 'algorithmus', 'software', 'programmierung'],
  kunst: ['kunst', 'malen', 'zeichnen', 'kreativ', 'design', 'farbe', 'skulptur', 'kuenstler'],
  musik: ['musik', 'instrument', 'noten', 'melodie', 'rhythmus', 'klavier', 'gitarre', 'singen'],
}

// Allgemeine Lerntipps
const generalTips = [
  'Plane feste Lernzeiten ein und halte sie ein - Gewohnheiten sind der Schluessel!',
  'Nutze die Pomodoro-Technik: 25 Min lernen, 5 Min Pause.',
  'Erklaere den Stoff laut jemandem (oder dir selbst) - das vertieft das Verstaendnis.',
  'Abwechslung hilft! Wechsle zwischen verschiedenen Faechern.',
  'Ausreichend Schlaf ist wichtig - im Schlaf wird Gelerntes gefestigt.',
  'Trinke genug Wasser beim Lernen - dein Gehirn braucht es!',
  'Belohne dich nach einer Lernsession - das motiviert langfristig.',
  'Erstelle Zusammenfassungen in eigenen Worten.',
  'Nutze verschiedene Sinne: lesen, hoeren, schreiben, zeichnen.',
  'Fange mit dem schwierigsten Fach an, solange du noch frisch bist.',
]

// Motivations-Sprueche
const motivationResponses = [
  'Du schaffst das! Jeder Experte war mal ein Anfaenger. \u{1F4AA}',
  'Dranbleiben! Fortschritt passiert oft unsichtbar, bevor der Durchbruch kommt.',
  'Fehler sind keine Niederlagen - sie sind Lernchancen. Weiter so!',
  'Stell dir vor, wie stolz du sein wirst, wenn du es geschafft hast!',
  'Kleine Schritte fuehren auch zum Ziel. Du bist auf dem richtigen Weg!',
]

// Generiert eine Bot-Antwort basierend auf der Nachricht
export function generateBotResponse(userMessage) {
  const msg = userMessage.toLowerCase()

  // Begruessungen
  if (/^(hi|hallo|hey|moin|servus|guten\s*(tag|morgen|abend))/.test(msg)) {
    return 'Hallo! Wie kann ich dir heute beim Lernen helfen? Sag mir einfach, welches Fach dich interessiert! \u{1F4DA}'
  }

  // Danke
  if (/^(danke|thx|thanks|dankeschoen|vielen dank)/.test(msg)) {
    return 'Gern geschehen! Wenn du noch Fragen hast, bin ich jederzeit hier. \u{1F60A}'
  }

  // Hilfe
  if (/^(hilfe|help|was kannst du|was machst du)/.test(msg)) {
    return 'Ich kann dir helfen mit:\n\n\u2022 Lerntipps zu jedem Fach (z.B. "Tipps fuer Mathe")\n\u2022 Spiel-Empfehlungen (z.B. "Empfehle mir Physik-Spiele")\n\u2022 Motivation wenn du sie brauchst\n\u2022 Lernstrategien und -techniken\n\nFrag einfach los!'
  }

  // Motivation
  if (/(motivation|motivier|keine lust|keinen bock|schwer|schaff.*nicht|aufgeben|frustriert|gestresst)/.test(msg)) {
    return motivationResponses[Math.floor(Math.random() * motivationResponses.length)]
  }

  // Fach erkennen
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(kw => msg.includes(kw))) {
      const data = gameRecommendations[subject]
      if (!data) continue

      const tip = data.tips[Math.floor(Math.random() * data.tips.length)]
      let response = `\u{1F4A1} Lerntipp fuer ${subject.charAt(0).toUpperCase() + subject.slice(1)}:\n${tip}`

      if (data.games.length > 0) {
        response += '\n\n\u{1F3AE} Passende Spiele auf MindForge:'
        for (const game of data.games) {
          response += `\n\u2022 ${game.title} - ${game.desc}`
        }
      }

      return response
    }
  }

  // Allgemeine Lernfragen
  if (/(lern|tipps?|strategie|besser|verbessern|ueben|training|pruefung|klausur|test|hausaufgabe)/.test(msg)) {
    const tip = generalTips[Math.floor(Math.random() * generalTips.length)]
    return `\u{1F4A1} Lerntipp:\n${tip}\n\nWenn du mir sagst, welches Fach du uebst, kann ich dir gezieltere Tipps und passende Spiele empfehlen!`
  }

  // Spiel-Empfehlung allgemein
  if (/(spiel|game|empfehl|vorschlag|spielen|zocken)/.test(msg)) {
    return 'Welches Fach interessiert dich? Ich kann dir passende Lernspiele empfehlen fuer:\n\n\u2022 Mathe & Physik\n\u2022 Chemie & Biologie\n\u2022 Deutsch & Englisch\n\u2022 Geschichte & Geographie\n\u2022 Informatik, Kunst & Musik\n\nSag einfach das Fach!'
  }

  // Fallback
  const fallbacks = [
    'Sag mir, welches Fach dich interessiert, und ich gebe dir Lerntipps und passende Spiel-Empfehlungen!',
    'Ich helfe dir gerne beim Lernen! Nenn mir einfach ein Fach oder frag nach Lerntipps.',
    'Moechtest du Tipps zu einem bestimmten Schulfach? Oder soll ich dir ein Lernspiel empfehlen?',
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
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
