const DANGEROUS_PATTERNS = [
  { pattern: /eval\s*\(/, message: 'eval() erkannt - Sicherheitsrisiko' },
  { pattern: /Function\s*\(/, message: 'Function() Constructor erkannt - Sicherheitsrisiko' },
  { pattern: /document\.cookie/, message: 'Cookie-Zugriff erkannt' },
  { pattern: /localStorage\s*\.\s*(get|set|remove)Item/, message: 'localStorage-Zugriff erkannt' },
  { pattern: /sessionStorage\s*\.\s*(get|set|remove)Item/, message: 'sessionStorage-Zugriff erkannt' },
  { pattern: /fetch\s*\(|XMLHttpRequest|\.ajax\(/, message: 'Externer Netzwerk-Zugriff erkannt' },
  { pattern: /<script[\s>]/, message: 'Script-Tag erkannt' },
  { pattern: /window\.(location|open|close)/, message: 'Fenster-Manipulation erkannt' },
  { pattern: /document\.write/, message: 'document.write erkannt' },
  { pattern: /\bon\w+\s*=\s*["']/, message: 'Inline Event-Handler erkannt (onclick, onerror etc.)' },
  { pattern: /javascript\s*:/, message: 'JavaScript-URL erkannt' },
  { pattern: /import\s*\(/, message: 'Dynamischer Import erkannt' },
  { pattern: /parent\.|top\.|frames\[/, message: 'Frame-Zugriff erkannt' },
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
