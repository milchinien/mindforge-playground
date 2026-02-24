const NAMESPACE = 'mf_'
const SCHEMA_VERSION = 1

const schemas = {
  session: {
    version: 1,
    validate: (data) => data && typeof data.uid === 'string' && typeof data.expiresAt === 'number',
  },
  theme: {
    version: 1,
    validate: (data) => ['dark', 'light', 'high-contrast'].includes(data),
  },
  sidebar: {
    version: 1,
    validate: (data) => typeof data === 'boolean',
  },
  drafts: {
    version: 1,
    validate: (data) => Array.isArray(data),
  },
  recentGames: {
    version: 1,
    validate: (data) => Array.isArray(data),
  },
}

function getKey(key) {
  return `${NAMESPACE}${key}`
}

export function getStorageItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(getKey(key))
    if (raw === null) return fallback

    const parsed = JSON.parse(raw)

    // Check version
    if (parsed._v !== undefined && schemas[key]) {
      if (parsed._v < schemas[key].version) {
        // Schema version mismatch - clear stale data
        localStorage.removeItem(getKey(key))
        return fallback
      }
    }

    const value = parsed._v !== undefined ? parsed.data : parsed

    // Validate if schema exists
    if (schemas[key] && !schemas[key].validate(value)) {
      localStorage.removeItem(getKey(key))
      return fallback
    }

    return value
  } catch {
    return fallback
  }
}

export function setStorageItem(key, value) {
  try {
    const wrapped = {
      data: value,
      _v: schemas[key]?.version || SCHEMA_VERSION,
      _ts: Date.now(),
    }
    localStorage.setItem(getKey(key), JSON.stringify(wrapped))
    return true
  } catch {
    return false
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(getKey(key))
    return true
  } catch {
    return false
  }
}

export function clearNamespace() {
  try {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(NAMESPACE)) keys.push(key)
    }
    keys.forEach((key) => localStorage.removeItem(key))
    return true
  } catch {
    return false
  }
}
