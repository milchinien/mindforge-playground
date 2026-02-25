import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AvatarEmoteEffect from './AvatarEmoteEffect'

// ============= EMOTE DATA =============
export const EMOTES = [
  { id: 'happy',    name: 'Fröhlich',   emoji: '😊', animationClass: 'emote-bounce' },
  { id: 'sad',      name: 'Traurig',    emoji: '😢', animationClass: 'emote-sway' },
  { id: 'excited',  name: 'Begeistert', emoji: '🤩', animationClass: 'emote-rapid-bounce' },
  { id: 'angry',    name: 'Wütend',     emoji: '😡', animationClass: 'emote-shake' },
  { id: 'thinking', name: 'Nachdenklich', emoji: '🤔', animationClass: 'emote-pulse' },
  { id: 'waving',   name: 'Winkend',    emoji: '👋', animationClass: 'emote-wave' },
  { id: 'dancing',  name: 'Tanzend',    emoji: '💃', animationClass: 'emote-dance' },
  { id: 'sleeping', name: 'Schlafend',  emoji: '😴', animationClass: 'emote-float' },
]

export function getEmoteById(id) {
  return EMOTES.find((e) => e.id === id) || null
}

// ============= SIZE CONFIG =============
const SIZE_CONFIG = {
  sm: { grid: 'grid-cols-4 gap-1', button: 'p-1.5', emoji: 'text-lg', label: 'text-[10px]', width: 'w-48' },
  md: { grid: 'grid-cols-4 gap-2', button: 'p-2', emoji: 'text-2xl', label: 'text-xs', width: 'w-64' },
  lg: { grid: 'grid-cols-4 gap-3', button: 'p-3', emoji: 'text-3xl', label: 'text-sm', width: 'w-80' },
}

// ============= EMOTE PICKER =============
export function EmotePicker({ onSelect, selectedEmote, size = 'md' }) {
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md

  return (
    <div className={`${config.width} bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-2xl`}>
      <p className="text-xs text-gray-400 font-medium mb-2 text-center uppercase tracking-wider">
        Emote wählen
      </p>
      <div className={`grid ${config.grid}`}>
        {EMOTES.map((emote) => {
          const isSelected = selectedEmote === emote.id
          return (
            <motion.button
              key={emote.id}
              onClick={() => onSelect(emote.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                ${config.button} rounded-lg flex flex-col items-center justify-center
                transition-colors duration-150 cursor-pointer
                ${isSelected
                  ? 'bg-primary/30 border border-primary ring-1 ring-primary/50'
                  : 'bg-gray-700/50 border border-gray-600/50 hover:bg-gray-600/70 hover:border-gray-500'
                }
              `}
              title={emote.name}
            >
              <span className={config.emoji}>{emote.emoji}</span>
              <span className={`${config.label} text-gray-300 mt-0.5 leading-tight`}>
                {emote.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ============= AVATAR EMOTE OVERLAY =============
// Wraps an avatar and shows an emote effect on top of it
export function AvatarWithEmote({ children, emoteId, avatarSize = 200, loop = false }) {
  return (
    <div className="relative inline-block" style={{ width: avatarSize, height: avatarSize }}>
      {children}
      <AnimatePresence>
        {emoteId && (
          <AvatarEmoteEffect emote={emoteId} size={avatarSize} loop={loop} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ============= FULL EMOTE SYSTEM HOOK =============
export function useEmotes() {
  const [activeEmote, setActiveEmote] = useState(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const playEmote = useCallback((emoteId) => {
    setActiveEmote(emoteId)
    setIsPickerOpen(false)
  }, [])

  const clearEmote = useCallback(() => {
    setActiveEmote(null)
  }, [])

  const togglePicker = useCallback(() => {
    setIsPickerOpen((prev) => !prev)
  }, [])

  return {
    activeEmote,
    isPickerOpen,
    playEmote,
    clearEmote,
    togglePicker,
    setIsPickerOpen,
  }
}

export default EmotePicker
