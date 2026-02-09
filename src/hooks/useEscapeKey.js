import { useEffect } from 'react'

export default function useEscapeKey(onEscape, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onEscape()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onEscape, enabled])
}
