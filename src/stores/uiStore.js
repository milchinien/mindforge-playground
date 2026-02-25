import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Favorite pages (pinned by user)
      favorites: [],
      addFavorite: (page) => set((state) => {
        if (state.favorites.some(f => f.path === page.path)) return state
        return { favorites: [...state.favorites, page].slice(0, 8) }
      }),
      removeFavorite: (path) => set((state) => ({
        favorites: state.favorites.filter(f => f.path !== path)
      })),
      isFavorite: (path) => get().favorites.some(f => f.path === path),

      // Recently visited pages (auto-tracked)
      recentPages: [],
      addRecentPage: (page) => set((state) => {
        const filtered = state.recentPages.filter(p => p.path !== page.path)
        return { recentPages: [{ ...page, visitedAt: Date.now() }, ...filtered].slice(0, 5) }
      }),
    }),
    {
      name: 'mindforge-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        favorites: state.favorites,
        recentPages: state.recentPages,
      }),
    }
  )
)
