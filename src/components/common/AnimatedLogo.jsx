import { motion } from 'framer-motion'

const sizes = {
  sm: { icon: 32, fontSize: 'text-lg', gap: 'gap-2' },
  md: { icon: 48, fontSize: 'text-2xl', gap: 'gap-3' },
  lg: { icon: 72, fontSize: 'text-4xl', gap: 'gap-4' },
}

export default function AnimatedLogo({
  size = 'md',
  animated = true,
  showText = true,
  fullScreen = false,
}) {
  const s = sizes[size] || sizes.md
  const iconSize = s.icon

  // Gear teeth count and geometry
  const gearTeeth = 8
  const gearOuterR = iconSize * 0.48
  const gearInnerR = iconSize * 0.36
  const gearHoleR = iconSize * 0.14
  const toothWidth = 0.22 // radians half-width

  // Build gear path with teeth
  function buildGearPath(cx, cy) {
    const points = []
    for (let i = 0; i < gearTeeth; i++) {
      const angle = (i / gearTeeth) * Math.PI * 2
      const nextAngle = ((i + 0.5) / gearTeeth) * Math.PI * 2

      // Inner point before tooth
      points.push({
        x: cx + Math.cos(angle - toothWidth) * gearInnerR,
        y: cy + Math.sin(angle - toothWidth) * gearInnerR,
      })
      // Outer tooth start
      points.push({
        x: cx + Math.cos(angle - toothWidth * 0.6) * gearOuterR,
        y: cy + Math.sin(angle - toothWidth * 0.6) * gearOuterR,
      })
      // Outer tooth end
      points.push({
        x: cx + Math.cos(angle + toothWidth * 0.6) * gearOuterR,
        y: cy + Math.sin(angle + toothWidth * 0.6) * gearOuterR,
      })
      // Inner point after tooth
      points.push({
        x: cx + Math.cos(angle + toothWidth) * gearInnerR,
        y: cy + Math.sin(angle + toothWidth) * gearInnerR,
      })
      // Inner arc to next tooth
      points.push({
        x: cx + Math.cos(nextAngle - toothWidth) * gearInnerR,
        y: cy + Math.sin(nextAngle - toothWidth) * gearInnerR,
      })
    }
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`
    }
    d += ' Z'
    return d
  }

  // Brain path (stylized, fits inside gear) -- left and right hemispheres
  const brainCx = iconSize / 2
  const brainCy = iconSize / 2
  const br = iconSize * 0.2 // brain radius

  const brainPath = `
    M ${brainCx} ${brainCy + br * 0.9}
    C ${brainCx - br * 0.3} ${brainCy + br * 0.9},
      ${brainCx - br * 1.1} ${brainCy + br * 0.5},
      ${brainCx - br * 1.1} ${brainCy}
    C ${brainCx - br * 1.1} ${brainCy - br * 0.5},
      ${brainCx - br * 0.9} ${brainCy - br * 1.0},
      ${brainCx - br * 0.5} ${brainCy - br * 1.05}
    C ${brainCx - br * 0.2} ${brainCy - br * 1.15},
      ${brainCx} ${brainCy - br * 1.1},
      ${brainCx} ${brainCy - br * 0.85}
    C ${brainCx} ${brainCy - br * 1.1},
      ${brainCx + br * 0.2} ${brainCy - br * 1.15},
      ${brainCx + br * 0.5} ${brainCy - br * 1.05}
    C ${brainCx + br * 0.9} ${brainCy - br * 1.0},
      ${brainCx + br * 1.1} ${brainCy - br * 0.5},
      ${brainCx + br * 1.1} ${brainCy}
    C ${brainCx + br * 1.1} ${brainCy + br * 0.5},
      ${brainCx + br * 0.3} ${brainCy + br * 0.9},
      ${brainCx} ${brainCy + br * 0.9}
    Z
  `

  // Center dividing line of the brain
  const brainDivide = `
    M ${brainCx} ${brainCy - br * 0.85}
    C ${brainCx - br * 0.15} ${brainCy - br * 0.3},
      ${brainCx + br * 0.15} ${brainCy + br * 0.3},
      ${brainCx} ${brainCy + br * 0.9}
  `

  // Brain folds (left)
  const foldLeft = `
    M ${brainCx - br * 0.3} ${brainCy - br * 0.5}
    Q ${brainCx - br * 0.8} ${brainCy - br * 0.1},
      ${brainCx - br * 0.35} ${brainCy + br * 0.35}
  `

  // Brain folds (right)
  const foldRight = `
    M ${brainCx + br * 0.3} ${brainCy - br * 0.5}
    Q ${brainCx + br * 0.8} ${brainCy - br * 0.1},
      ${brainCx + br * 0.35} ${brainCy + br * 0.35}
  `

  const gearPath = buildGearPath(iconSize / 2, iconSize / 2)

  const logoContent = (
    <div className={`inline-flex items-center ${s.gap}`}>
      {/* SVG Icon */}
      <div className="relative flex-shrink-0" style={{ width: iconSize, height: iconSize }}>
        <svg
          viewBox={`0 0 ${iconSize} ${iconSize}`}
          width={iconSize}
          height={iconSize}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent, #f97316)" />
              <stop offset="100%" stopColor="var(--color-accent-dark, #ea580c)" />
            </linearGradient>
            <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary-light, #2563eb)" />
              <stop offset="100%" stopColor="var(--color-primary, #1e3a8a)" />
            </linearGradient>
            <filter id="brainGlow">
              <feGaussianBlur stdDeviation={iconSize * 0.02} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Gear -- rotates */}
          <motion.g
            style={{ transformOrigin: `${iconSize / 2}px ${iconSize / 2}px` }}
            animate={animated ? { rotate: 360 } : undefined}
            transition={animated ? { duration: 20, repeat: Infinity, ease: 'linear' } : undefined}
          >
            <path d={gearPath} fill="url(#gearGrad)" opacity={0.9} />
            {/* Gear center hole */}
            <circle cx={iconSize / 2} cy={iconSize / 2} r={gearHoleR} fill="var(--color-bg-primary, #111827)" />
          </motion.g>

          {/* Brain -- pulses */}
          <motion.g
            filter="url(#brainGlow)"
            animate={animated ? { scale: [1, 1.06, 1] } : undefined}
            transition={animated ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
            style={{ transformOrigin: `${brainCx}px ${brainCy}px` }}
          >
            <path d={brainPath} fill="url(#brainGrad)" />
            <path d={brainDivide} fill="none" stroke="var(--color-accent, #f97316)" strokeWidth={iconSize * 0.02} opacity={0.7} />
            <path d={foldLeft} fill="none" stroke="var(--color-accent, #f97316)" strokeWidth={iconSize * 0.015} opacity={0.5} strokeLinecap="round" />
            <path d={foldRight} fill="none" stroke="var(--color-accent, #f97316)" strokeWidth={iconSize * 0.015} opacity={0.5} strokeLinecap="round" />
          </motion.g>
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <motion.div
          className={`${s.fontSize} font-bold select-none`}
          initial={animated ? { opacity: 0, x: -8 } : undefined}
          animate={animated ? { opacity: 1, x: 0 } : undefined}
          transition={animated ? { duration: 0.6, delay: 0.2 } : undefined}
        >
          <span style={{ color: 'var(--color-primary-light, #2563eb)' }}>Mind</span>
          <span style={{ color: 'var(--color-accent, #f97316)' }}>Forge</span>
        </motion.div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {logoContent}
        </motion.div>
        {/* Loading dots */}
        <div className="flex gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-accent"
              animate={animated ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] } : undefined}
              transition={animated ? { duration: 1.2, repeat: Infinity, delay: i * 0.2 } : undefined}
            />
          ))}
        </div>
      </div>
    )
  }

  return logoContent
}
