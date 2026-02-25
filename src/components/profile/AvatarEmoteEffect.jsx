import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============= EMOTE ANIMATION CONFIGS =============
const EMOTE_CONFIGS = {
  happy: {
    emoji: '😊',
    animation: {
      y: [0, -12, 0, -8, 0],
      scale: [1, 1.15, 1, 1.1, 1],
    },
    transition: {
      duration: 0.8,
      repeat: 2,
      ease: 'easeInOut',
    },
  },
  sad: {
    emoji: '😢',
    animation: {
      x: [0, -6, 6, -4, 4, 0],
      rotate: [0, -3, 3, -2, 2, 0],
      opacity: [1, 0.7, 1, 0.7, 1],
    },
    transition: {
      duration: 1.6,
      repeat: 1,
      ease: 'easeInOut',
    },
  },
  excited: {
    emoji: '🤩',
    animation: {
      y: [0, -18, 0, -14, 0, -10, 0],
      scale: [1, 1.3, 0.9, 1.25, 0.95, 1.15, 1],
      rotate: [0, -5, 5, -5, 5, 0],
    },
    transition: {
      duration: 0.9,
      repeat: 2,
      ease: 'easeOut',
    },
    sparkles: true,
  },
  angry: {
    emoji: '😡',
    animation: {
      x: [0, -8, 8, -8, 8, -4, 4, 0],
      scale: [1, 1.1, 1.1, 1.1, 1.1, 1.05, 1.05, 1],
    },
    transition: {
      duration: 0.5,
      repeat: 3,
      ease: 'linear',
    },
  },
  thinking: {
    emoji: '🤔',
    animation: {
      scale: [1, 1.08, 1, 1.08, 1],
      opacity: [1, 0.8, 1, 0.8, 1],
    },
    transition: {
      duration: 1.5,
      repeat: 1,
      ease: 'easeInOut',
    },
    dots: true,
  },
  waving: {
    emoji: '👋',
    animation: {
      rotate: [0, 20, -10, 20, -10, 15, 0],
      x: [0, 2, -2, 2, -2, 1, 0],
    },
    transition: {
      duration: 0.8,
      repeat: 2,
      ease: 'easeInOut',
    },
  },
  dancing: {
    emoji: '💃',
    animation: {
      x: [0, 10, -10, 10, -10, 0],
      y: [0, -4, 0, -4, 0, 0],
      rotate: [0, 8, -8, 8, -8, 0],
      scale: [1, 1.05, 0.95, 1.05, 0.95, 1],
    },
    transition: {
      duration: 1.0,
      repeat: 2,
      ease: 'easeInOut',
    },
  },
  sleeping: {
    emoji: '😴',
    animation: {
      y: [0, -3, 0, -3, 0],
      opacity: [1, 0.85, 1, 0.85, 1],
    },
    transition: {
      duration: 2.0,
      repeat: 1,
      ease: 'easeInOut',
    },
    zzz: true,
  },
}

// ============= SPARKLE PARTICLES =============
function Sparkles({ size }) {
  const sparkleSize = Math.max(size * 0.08, 8)
  const positions = [
    { x: -30, y: -20, delay: 0 },
    { x: 25, y: -25, delay: 0.15 },
    { x: -20, y: 10, delay: 0.3 },
    { x: 30, y: 5, delay: 0.1 },
    { x: 0, y: -30, delay: 0.25 },
  ]

  return (
    <>
      {positions.map((pos, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `calc(50% + ${pos.x}%)`,
            top: `calc(50% + ${pos.y}%)`,
            fontSize: sparkleSize,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 0.6,
            delay: pos.delay,
            repeat: 3,
            ease: 'easeOut',
          }}
        >
          ✨
        </motion.span>
      ))}
    </>
  )
}

// ============= THINKING DOTS =============
function ThinkingDots({ size }) {
  const dotSize = Math.max(size * 0.04, 4)

  return (
    <div
      className="absolute pointer-events-none flex gap-1 items-center"
      style={{
        top: '15%',
        right: '-5%',
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="bg-gray-300 rounded-full inline-block"
          style={{ width: dotSize, height: dotSize }}
          initial={{ opacity: 0.3, scale: 0.7 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.7, 1.1, 0.7],
          }}
          transition={{
            duration: 1.0,
            delay: i * 0.25,
            repeat: 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ============= SLEEPING ZZZ =============
function SleepingZzz({ size }) {
  const fontSize = Math.max(size * 0.1, 10)

  return (
    <div className="absolute pointer-events-none" style={{ top: '5%', right: '5%' }}>
      {['z', 'Z', 'Z'].map((letter, i) => (
        <motion.span
          key={i}
          className="absolute text-blue-300/80 font-bold"
          style={{
            fontSize: fontSize + i * (fontSize * 0.3),
            right: i * 6,
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -20 - i * 12],
            x: [0, 8 + i * 4],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.5,
            repeat: 1,
            ease: 'easeOut',
          }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  )
}

// ============= MAIN COMPONENT =============
export default function AvatarEmoteEffect({ emote, size = 200, loop = false }) {
  const [isVisible, setIsVisible] = useState(true)
  const config = EMOTE_CONFIGS[emote]

  // Auto-hide after 2 seconds unless looping
  useEffect(() => {
    if (loop) return
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [emote, loop])

  // Reset visibility when emote changes
  useEffect(() => {
    setIsVisible(true)
  }, [emote])

  if (!config || !isVisible) return null

  const emojiSize = Math.max(size * 0.25, 24)

  // Adjust transition for looping
  const transition = {
    ...config.transition,
    ...(loop ? { repeat: Infinity, repeatType: 'loop' } : {}),
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        >
          {/* Emoji overlay */}
          <motion.div
            className="absolute"
            style={{
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: emojiSize,
              lineHeight: 1,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              ...config.animation,
            }}
            transition={{
              opacity: { duration: 0.15 },
              scale: { duration: 0.2 },
              ...transition,
            }}
          >
            {config.emoji}
          </motion.div>

          {/* Extra effects */}
          {config.sparkles && <Sparkles size={size} />}
          {config.dots && <ThinkingDots size={size} />}
          {config.zzz && <SleepingZzz size={size} />}

          {/* Subtle background glow */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: loop ? Infinity : 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
