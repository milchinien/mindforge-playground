import DOMPurify from 'dompurify'

/**
 * Sanitize user-generated text (game titles, descriptions, reviews, chat messages).
 * Strips all HTML tags by default.
 */
export function sanitizeText(dirty) {
  if (!dirty || typeof dirty !== 'string') return ''
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] })
}

/**
 * Sanitize user-generated rich text (allows basic formatting).
 * Useful for descriptions that may contain markdown-rendered HTML.
 */
export function sanitizeRichText(dirty) {
  if (!dirty || typeof dirty !== 'string') return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}
