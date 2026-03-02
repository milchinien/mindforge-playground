import { useEffect } from 'react'

export default function useEscapeKey(onEscape, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onEscape()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onEscape, enabled])
}
