// ============= UTILITIES =============
export function adjustColor(hex, amount) {
  if (!hex || hex.charAt(0) !== '#') return hex || '#F5D6B8'
  const num = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

export function getInitials(username) {
  if (!username) return '?'
  return username.charAt(0).toUpperCase()
}

// Body type width multipliers
export const BODY_CONFIGS = {
  slim: { shoulderW: 0.78, neckW: 0.88 },
  normal: { shoulderW: 1.0, neckW: 1.0 },
  athletic: { shoulderW: 1.1, neckW: 1.05 },
  wide: { shoulderW: 1.22, neckW: 1.12 },
  stocky: { shoulderW: 1.3, neckW: 1.15 },
}
