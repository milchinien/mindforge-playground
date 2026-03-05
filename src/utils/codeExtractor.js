/**
 * Extract html, css, js code blocks from AI response text.
 * Looks for fenced code blocks like ```html ... ``` etc.
 */
export function extractCodeBlocks(text) {
  const result = { html: null, css: null, js: null }
  const regex = /```(html|css|javascript|js)\s*\n([\s\S]*?)```/gi
  let match

  while ((match = regex.exec(text)) !== null) {
    const lang = match[1].toLowerCase()
    const key = (lang === 'javascript' || lang === 'js') ? 'js' : lang
    result[key] = match[2].trim()
  }

  return result
}

/**
 * Check if text contains any code blocks.
 */
export function hasCodeBlocks(text) {
  return /```(html|css|javascript|js)\s*\n/i.test(text)
}

/**
 * Check if a complete code block (with closing ```) exists in text.
 */
export function hasCompleteCodeBlock(text) {
  return /```(html|css|javascript|js)\s*\n[\s\S]*?```/i.test(text)
}
