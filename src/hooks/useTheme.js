import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('mindforge-theme')
      if (saved) return saved
    } catch { /* Private browsing / storage unavailable */ }
    try {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
    } catch { /* matchMedia not supported */ }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'high-contrast')
    if (theme === 'light') {
      root.classList.add('light')
    } else if (theme === 'high-contrast') {
      root.classList.add('high-contrast')
    }
    try { localStorage.setItem('mindforge-theme', theme) } catch { /* ignore */ }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const isDark = theme === 'dark' || theme === 'high-contrast'
  const isHighContrast = theme === 'high-contrast'

  return { theme, setTheme, toggleTheme, isDark, isHighContrast }
}
