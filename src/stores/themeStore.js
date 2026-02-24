import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function getDefaultTheme() {
  try {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  } catch {}
  return 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.remove('light', 'high-contrast')
  if (theme === 'light') root.classList.add('light')
  else if (theme === 'high-contrast') root.classList.add('high-contrast')
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: getDefaultTheme(),
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        get().setTheme(next)
      },
    }),
    {
      name: 'mindforge-theme',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrate: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)

// Selector hooks for computed values
export const useIsDark = () => useThemeStore((s) => s.theme === 'dark' || s.theme === 'high-contrast')
export const useIsHighContrast = () => useThemeStore((s) => s.theme === 'high-contrast')
