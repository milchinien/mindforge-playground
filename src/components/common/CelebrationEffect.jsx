import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Particle({ x, y, color, delay, type }) {
  if (type === 'confetti') {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: x, top: y }}
        initial={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }}
        animate={{
          opacity: 0,
          y: [0, -80, 200],
          x: [0, (Math.random() - 0.5) * 200],
          rotate: Math.random() * 720 - 360,
          scale: [1, 1.2, 0.5],
        }}
        transition={{ duration: 1.8, delay, ease: 'easeOut' }}
      >
        <div
          className="w-2 h-3 rounded-sm"
          style={{ backgroundColor: color }}
        />
      </motion.div>
    )
  }

  // Sparkle type
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        rotate: [0, 180],
      }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      <div className="text-lg" style={{ color }}>
        ✦
      </div>
    </motion.div>
  )
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899']

export function useConfetti() {
  const [particles, setParticles] = useState([])

  const triggerConfetti = useCallback((originX = '50%', originY = '50%') => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: originX,
      y: originY,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
      type: 'confetti',
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 2500)
  }, [])

  const triggerSparkles = useCallback((originX = '50%', originY = '50%') => {
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: `calc(${originX} + ${(Math.random() - 0.5) * 100}px)`,
      y: `calc(${originY} + ${(Math.random() - 0.5) * 80}px)`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.4,
      type: 'sparkle',
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1500)
  }, [])

  const CelebrationOverlay = useCallback(() => (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <Particle key={p.id} {...p} />
          ))}
        </div>
      )}
    </AnimatePresence>
  ), [particles])

  return { triggerConfetti, triggerSparkles, CelebrationOverlay }
}

export function CelebrationBanner({ show, message, icon = '🎉', onDismiss }) {
  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-accent to-primary-light text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3"
      >
        <span className="text-2xl">{icon}</span>
        <span className="font-semibold">{message}</span>
        {onDismiss && (
          <button onClick={onDismiss} className="ml-2 text-white/70 hover:text-white">
            ✕
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default CelebrationBanner
