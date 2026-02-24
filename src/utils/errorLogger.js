const errorLog = []
const MAX_LOG_SIZE = 100

export function logError(error, context = {}) {
  const entry = {
    message: error?.message || String(error),
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
  }

  errorLog.push(entry)
  if (errorLog.length > MAX_LOG_SIZE) errorLog.shift()

  if (import.meta.env.DEV) {
    console.error('[MindForge Error]', entry.message, context)
  }

  // Future: send to Firebase Analytics or Sentry
  // analytics.logEvent('error', { message: entry.message, ...context })
}

export function getErrorLog() {
  return [...errorLog]
}

export function clearErrorLog() {
  errorLog.length = 0
}

export function formatFirebaseError(code) {
  const messages = {
    'auth/user-not-found': 'Benutzer nicht gefunden.',
    'auth/wrong-password': 'Falsches Passwort.',
    'auth/email-already-in-use': 'Diese E-Mail ist bereits registriert.',
    'auth/weak-password': 'Passwort muss mindestens 6 Zeichen haben.',
    'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
    'auth/too-many-requests': 'Zu viele Versuche. Bitte warte einen Moment.',
    'auth/network-request-failed': 'Netzwerkfehler. Überprüfe deine Verbindung.',
    'permission-denied': 'Keine Berechtigung für diese Aktion.',
    'unavailable': 'Service nicht erreichbar. Bitte versuche es später.',
  }
  return messages[code] || 'Ein unerwarteter Fehler ist aufgetreten.'
}
