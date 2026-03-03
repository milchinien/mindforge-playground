import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      // General / UI preferences
      soundEffects: true,
      reducedMotion: false,
      autoplayVideos: true,
      fontSize: 'medium', // 'small' | 'medium' | 'large'

      // Privacy preferences
      profileVisibility: 'public', // 'public' | 'friends' | 'private'
      showOnlineStatus: true,
      showActivityStatus: true,
      allowMessagesFrom: 'friends', // 'everyone' | 'friends' | 'nobody'

      updateSetting: (key, value) => set({ [key]: value }),
    }),
    { name: 'mindforge-settings' }
  )
)
