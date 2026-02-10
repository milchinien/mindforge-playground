const DANGEROUS_PATTERNS = [
  { pattern: /eval\s*\(/, message: 'eval() erkannt - Sicherheitsrisiko' },
  { pattern: /document\.cookie/, message: 'Cookie-Zugriff erkannt' },
  { pattern: /localStorage\s*\.\s*(get|set|remove)Item/, message: 'localStorage-Zugriff erkannt' },
  { pattern: /fetch\s*\(|XMLHttpRequest|\.ajax\(/, message: 'Externer Netzwerk-Zugriff erkannt' },
  { pattern: /<script\s+src\s*=/, message: 'Externes Script erkannt' },
  { pattern: /window\.(location|open|close)/, message: 'Fenster-Manipulation erkannt' },
  { pattern: /document\.write/, message: 'document.write erkannt' },
]

export function reviewCode(code) {
  const allCode = typeof code === 'string' ? code : `${code.html || ''}\n${code.css || ''}\n${code.js || ''}`
  const warnings = []

  for (const { pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(allCode)) {
      warnings.push(message)
    }
  }

  return {
    passed: warnings.length === 0,
    warnings,
  }
}
