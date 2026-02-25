import { motion, AnimatePresence } from 'framer-motion'

const moodConfig = {
  happy: {
    eyeShape: 'arc',       // happy curved eyes
    mouthPath: 'smile',
    earAngle: 0,
    tailWag: true,
  },
  thinking: {
    eyeShape: 'dots',      // looking up / to the side
    mouthPath: 'flat',
    earAngle: -5,
    tailWag: false,
  },
  excited: {
    eyeShape: 'big',       // wide open eyes
    mouthPath: 'open',
    earAngle: 8,
    tailWag: true,
  },
  wave: {
    eyeShape: 'arc',
    mouthPath: 'smile',
    earAngle: 3,
    tailWag: false,
  },
  sad: {
    eyeShape: 'sad',
    mouthPath: 'frown',
    earAngle: -10,
    tailWag: false,
  },
}

function Eyes({ mood, cx, cy, scale }) {
  const s = scale
  const config = moodConfig[mood]
  const eyeSpacing = 8 * s

  if (config.eyeShape === 'arc') {
    // Happy arched eyes
    return (
      <g>
        <path
          d={`M ${cx - eyeSpacing - 3 * s} ${cy} Q ${cx - eyeSpacing} ${cy - 4 * s} ${cx - eyeSpacing + 3 * s} ${cy}`}
          fill="none" stroke="var(--color-accent, #f97316)" strokeWidth={1.8 * s} strokeLinecap="round"
        />
        <path
          d={`M ${cx + eyeSpacing - 3 * s} ${cy} Q ${cx + eyeSpacing} ${cy - 4 * s} ${cx + eyeSpacing + 3 * s} ${cy}`}
          fill="none" stroke="var(--color-accent, #f97316)" strokeWidth={1.8 * s} strokeLinecap="round"
        />
      </g>
    )
  }

  if (config.eyeShape === 'dots') {
    // Thinking -- dots shifted slightly up-right
    return (
      <g>
        <circle cx={cx - eyeSpacing + 1.5 * s} cy={cy - 1 * s} r={2.2 * s} fill="var(--color-accent, #f97316)" />
        <circle cx={cx + eyeSpacing + 1.5 * s} cy={cy - 1 * s} r={2.2 * s} fill="var(--color-accent, #f97316)" />
      </g>
    )
  }

  if (config.eyeShape === 'big') {
    // Excited -- big glowing circles
    return (
      <g>
        <circle cx={cx - eyeSpacing} cy={cy} r={3.5 * s} fill="var(--color-accent, #f97316)" />
        <circle cx={cx - eyeSpacing + 1 * s} cy={cy - 1 * s} r={1.2 * s} fill="#fff" opacity={0.8} />
        <circle cx={cx + eyeSpacing} cy={cy} r={3.5 * s} fill="var(--color-accent, #f97316)" />
        <circle cx={cx + eyeSpacing + 1 * s} cy={cy - 1 * s} r={1.2 * s} fill="#fff" opacity={0.8} />
      </g>
    )
  }

  if (config.eyeShape === 'sad') {
    // Sad -- slanted lines
    return (
      <g>
        <ellipse cx={cx - eyeSpacing} cy={cy + 0.5 * s} rx={2.5 * s} ry={2.8 * s} fill="var(--color-accent, #f97316)" />
        <path
          d={`M ${cx - eyeSpacing - 3 * s} ${cy - 3.5 * s} L ${cx - eyeSpacing + 2 * s} ${cy - 2 * s}`}
          stroke="var(--color-primary, #1e3a8a)" strokeWidth={1.2 * s} strokeLinecap="round" fill="none"
        />
        <ellipse cx={cx + eyeSpacing} cy={cy + 0.5 * s} rx={2.5 * s} ry={2.8 * s} fill="var(--color-accent, #f97316)" />
        <path
          d={`M ${cx + eyeSpacing + 3 * s} ${cy - 3.5 * s} L ${cx + eyeSpacing - 2 * s} ${cy - 2 * s}`}
          stroke="var(--color-primary, #1e3a8a)" strokeWidth={1.2 * s} strokeLinecap="round" fill="none"
        />
      </g>
    )
  }

  // Default dots
  return (
    <g>
      <circle cx={cx - eyeSpacing} cy={cy} r={2.5 * s} fill="var(--color-accent, #f97316)" />
      <circle cx={cx + eyeSpacing} cy={cy} r={2.5 * s} fill="var(--color-accent, #f97316)" />
    </g>
  )
}

function Mouth({ mood, cx, cy, scale }) {
  const s = scale
  const config = moodConfig[mood]

  if (config.mouthPath === 'smile') {
    return (
      <path
        d={`M ${cx - 5 * s} ${cy} Q ${cx} ${cy + 5 * s} ${cx + 5 * s} ${cy}`}
        fill="none" stroke="var(--color-accent, #f97316)" strokeWidth={1.4 * s} strokeLinecap="round"
      />
    )
  }

  if (config.mouthPath === 'flat') {
    return (
      <line
        x1={cx - 4 * s} y1={cy + 1 * s} x2={cx + 4 * s} y2={cy + 1 * s}
        stroke="var(--color-accent, #f97316)" strokeWidth={1.4 * s} strokeLinecap="round"
      />
    )
  }

  if (config.mouthPath === 'open') {
    return (
      <ellipse
        cx={cx} cy={cy + 1.5 * s} rx={4 * s} ry={3.5 * s}
        fill="var(--color-primary-dark, #1e3a5f)" stroke="var(--color-accent, #f97316)" strokeWidth={1.2 * s}
      />
    )
  }

  if (config.mouthPath === 'frown') {
    return (
      <path
        d={`M ${cx - 5 * s} ${cy + 3 * s} Q ${cx} ${cy - 2 * s} ${cx + 5 * s} ${cy + 3 * s}`}
        fill="none" stroke="var(--color-accent, #f97316)" strokeWidth={1.4 * s} strokeLinecap="round"
      />
    )
  }

  return null
}

export default function Mascot({ mood = 'happy', size = 120, message }) {
  const config = moodConfig[mood] || moodConfig.happy
  const s = size / 120 // scale factor based on default 120

  // Layout constants (based on 120px canvas, scaled)
  const headCx = 60 * s
  const headCy = 42 * s
  const headR = 22 * s

  const bodyCx = 60 * s
  const bodyCy = 76 * s
  const bodyW = 18 * s
  const bodyH = 18 * s

  const viewW = 120 * s
  const viewH = 100 * s

  // Total height including bubble
  const bubbleHeight = message ? 36 * s : 0
  const totalH = viewH + bubbleHeight

  // Arm positions
  const armY = bodyCy - 4 * s
  const isWaving = mood === 'wave'

  return (
    <div className="inline-flex flex-col items-center select-none" style={{ width: viewW }}>
      {/* Speech bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative mb-1 max-w-[180px]"
          >
            <div
              className="bg-bg-card text-text-primary text-xs px-3 py-2 rounded-xl shadow-lg border border-gray-600 text-center leading-snug"
              style={{ fontSize: Math.max(10, 11 * s) }}
            >
              {message}
            </div>
            {/* Bubble tail */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-bg-card border-r border-b border-gray-600 rotate-45"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot SVG */}
      <motion.svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        width={viewW}
        height={viewH}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MindForge Mascot"
        role="img"
        animate={{ y: [0, -2 * s, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="mascotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-light, #2563eb)" />
            <stop offset="100%" stopColor="var(--color-primary, #1e3a8a)" />
          </linearGradient>
          <linearGradient id="mascotEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-light, #fb923c)" />
            <stop offset="100%" stopColor="var(--color-accent, #f97316)" />
          </linearGradient>
          <filter id="mascotGlow">
            <feGaussianBlur stdDeviation={1.5 * s} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- Tail --- */}
        <motion.path
          d={`
            M ${bodyCx + bodyW * 0.6} ${bodyCy + bodyH * 0.2}
            Q ${bodyCx + bodyW * 1.8} ${bodyCy - bodyH * 0.6},
              ${bodyCx + bodyW * 2.1} ${bodyCy - bodyH * 1.2}
          `}
          fill="none"
          stroke="url(#mascotBodyGrad)"
          strokeWidth={3.5 * s}
          strokeLinecap="round"
          animate={config.tailWag ? { d: [
            `M ${bodyCx + bodyW * 0.6} ${bodyCy + bodyH * 0.2} Q ${bodyCx + bodyW * 1.8} ${bodyCy - bodyH * 0.6}, ${bodyCx + bodyW * 2.1} ${bodyCy - bodyH * 1.2}`,
            `M ${bodyCx + bodyW * 0.6} ${bodyCy + bodyH * 0.2} Q ${bodyCx + bodyW * 2.0} ${bodyCy - bodyH * 0.3}, ${bodyCx + bodyW * 2.3} ${bodyCy - bodyH * 0.9}`,
            `M ${bodyCx + bodyW * 0.6} ${bodyCy + bodyH * 0.2} Q ${bodyCx + bodyW * 1.8} ${bodyCy - bodyH * 0.6}, ${bodyCx + bodyW * 2.1} ${bodyCy - bodyH * 1.2}`,
          ] } : undefined}
          transition={config.tailWag ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
        {/* Tail tip (orange) */}
        <motion.circle
          cx={bodyCx + bodyW * 2.1}
          cy={bodyCy - bodyH * 1.2}
          r={3 * s}
          fill="var(--color-accent, #f97316)"
          animate={config.tailWag ? {
            cx: [bodyCx + bodyW * 2.1, bodyCx + bodyW * 2.3, bodyCx + bodyW * 2.1],
            cy: [bodyCy - bodyH * 1.2, bodyCy - bodyH * 0.9, bodyCy - bodyH * 1.2],
          } : undefined}
          transition={config.tailWag ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />

        {/* --- Legs --- */}
        <rect x={bodyCx - bodyW * 0.55} y={bodyCy + bodyH * 0.7} width={5 * s} height={8 * s} rx={2.5 * s} fill="url(#mascotBodyGrad)" />
        <rect x={bodyCx + bodyW * 0.15} y={bodyCy + bodyH * 0.7} width={5 * s} height={8 * s} rx={2.5 * s} fill="url(#mascotBodyGrad)" />
        {/* Feet (orange) */}
        <ellipse cx={bodyCx - bodyW * 0.55 + 2.5 * s} cy={bodyCy + bodyH * 0.7 + 8 * s} rx={3.5 * s} ry={2 * s} fill="var(--color-accent, #f97316)" />
        <ellipse cx={bodyCx + bodyW * 0.15 + 2.5 * s} cy={bodyCy + bodyH * 0.7 + 8 * s} rx={3.5 * s} ry={2 * s} fill="var(--color-accent, #f97316)" />

        {/* --- Body --- */}
        <ellipse cx={bodyCx} cy={bodyCy} rx={bodyW} ry={bodyH} fill="url(#mascotBodyGrad)" />
        {/* Belly highlight */}
        <ellipse cx={bodyCx} cy={bodyCy + 2 * s} rx={bodyW * 0.6} ry={bodyH * 0.55} fill="var(--color-primary-light, #2563eb)" opacity={0.3} />
        {/* Chest bolt (robot detail) */}
        <circle cx={bodyCx} cy={bodyCy - 4 * s} r={2.5 * s} fill="var(--color-accent, #f97316)" opacity={0.8} />
        <circle cx={bodyCx} cy={bodyCy - 4 * s} r={1.2 * s} fill="var(--color-bg-primary, #111827)" />

        {/* --- Arms --- */}
        {/* Left arm */}
        <rect
          x={bodyCx - bodyW - 4 * s}
          y={armY}
          width={4.5 * s}
          height={12 * s}
          rx={2.2 * s}
          fill="url(#mascotBodyGrad)"
        />
        {/* Left hand (orange) */}
        <circle cx={bodyCx - bodyW - 1.8 * s} cy={armY + 13 * s} r={2.8 * s} fill="var(--color-accent, #f97316)" />

        {/* Right arm (waves if mood === 'wave') */}
        <motion.g
          style={{ transformOrigin: `${bodyCx + bodyW + 2 * s}px ${armY}px` }}
          animate={isWaving ? { rotate: [0, -30, 0, -30, 0] } : { rotate: 0 }}
          transition={isWaving ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <rect
            x={bodyCx + bodyW - 0.5 * s}
            y={armY}
            width={4.5 * s}
            height={12 * s}
            rx={2.2 * s}
            fill="url(#mascotBodyGrad)"
          />
          {/* Right hand (orange) */}
          <circle cx={bodyCx + bodyW + 1.8 * s} cy={armY + 13 * s} r={2.8 * s} fill="var(--color-accent, #f97316)" />
        </motion.g>

        {/* --- Head --- */}
        <circle cx={headCx} cy={headCy} r={headR} fill="url(#mascotBodyGrad)" />
        {/* Head rim / visor line (robot detail) */}
        <path
          d={`M ${headCx - headR * 0.85} ${headCy - headR * 0.15} A ${headR * 0.9} ${headR * 0.9} 0 0 1 ${headCx + headR * 0.85} ${headCy - headR * 0.15}`}
          fill="none" stroke="var(--color-primary-dark, #1e3a5f)" strokeWidth={1.5 * s} opacity={0.5}
        />
        {/* Antenna */}
        <line
          x1={headCx} y1={headCy - headR}
          x2={headCx} y2={headCy - headR - 6 * s}
          stroke="var(--color-primary-light, #2563eb)" strokeWidth={1.5 * s} strokeLinecap="round"
        />
        <motion.circle
          cx={headCx} cy={headCy - headR - 7.5 * s} r={2.2 * s}
          fill="var(--color-accent, #f97316)"
          filter="url(#mascotGlow)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* --- Fox Ears --- */}
        <motion.g
          style={{ transformOrigin: `${headCx - headR * 0.6}px ${headCy - headR * 0.6}px` }}
          animate={{ rotate: config.earAngle }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Left ear outer */}
          <path
            d={`
              M ${headCx - headR * 0.85} ${headCy - headR * 0.5}
              L ${headCx - headR * 1.15} ${headCy - headR * 1.6}
              L ${headCx - headR * 0.2} ${headCy - headR * 0.85}
              Z
            `}
            fill="url(#mascotBodyGrad)"
          />
          {/* Left ear inner (orange) */}
          <path
            d={`
              M ${headCx - headR * 0.75} ${headCy - headR * 0.6}
              L ${headCx - headR * 1.0} ${headCy - headR * 1.35}
              L ${headCx - headR * 0.35} ${headCy - headR * 0.85}
              Z
            `}
            fill="url(#mascotEarGrad)" opacity={0.8}
          />
        </motion.g>

        <motion.g
          style={{ transformOrigin: `${headCx + headR * 0.6}px ${headCy - headR * 0.6}px` }}
          animate={{ rotate: -config.earAngle }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Right ear outer */}
          <path
            d={`
              M ${headCx + headR * 0.85} ${headCy - headR * 0.5}
              L ${headCx + headR * 1.15} ${headCy - headR * 1.6}
              L ${headCx + headR * 0.2} ${headCy - headR * 0.85}
              Z
            `}
            fill="url(#mascotBodyGrad)"
          />
          {/* Right ear inner (orange) */}
          <path
            d={`
              M ${headCx + headR * 0.75} ${headCy - headR * 0.6}
              L ${headCx + headR * 1.0} ${headCy - headR * 1.35}
              L ${headCx + headR * 0.35} ${headCy - headR * 0.85}
              Z
            `}
            fill="url(#mascotEarGrad)" opacity={0.8}
          />
        </motion.g>

        {/* --- Face --- */}
        {/* Cheek blush */}
        <circle cx={headCx - headR * 0.7} cy={headCy + headR * 0.15} r={3 * s} fill="var(--color-accent, #f97316)" opacity={0.2} />
        <circle cx={headCx + headR * 0.7} cy={headCy + headR * 0.15} r={3 * s} fill="var(--color-accent, #f97316)" opacity={0.2} />

        {/* Eyes */}
        <Eyes mood={mood} cx={headCx} cy={headCy - 2 * s} scale={s} />

        {/* Nose (small triangle) */}
        <path
          d={`M ${headCx} ${headCy + 3 * s} L ${headCx - 2 * s} ${headCy + 6 * s} L ${headCx + 2 * s} ${headCy + 6 * s} Z`}
          fill="var(--color-accent-dark, #ea580c)" opacity={0.7}
        />

        {/* Mouth */}
        <Mouth mood={mood} cx={headCx} cy={headCy + 8 * s} scale={s} />

        {/* Whisker marks (subtle, fox-like) */}
        <line x1={headCx - headR * 0.5} y1={headCy + 4 * s} x2={headCx - headR * 1.05} y2={headCy + 2 * s} stroke="var(--color-primary-light, #2563eb)" strokeWidth={0.8 * s} opacity={0.3} strokeLinecap="round" />
        <line x1={headCx - headR * 0.5} y1={headCy + 6 * s} x2={headCx - headR * 1.05} y2={headCy + 6 * s} stroke="var(--color-primary-light, #2563eb)" strokeWidth={0.8 * s} opacity={0.3} strokeLinecap="round" />
        <line x1={headCx + headR * 0.5} y1={headCy + 4 * s} x2={headCx + headR * 1.05} y2={headCy + 2 * s} stroke="var(--color-primary-light, #2563eb)" strokeWidth={0.8 * s} opacity={0.3} strokeLinecap="round" />
        <line x1={headCx + headR * 0.5} y1={headCy + 6 * s} x2={headCx + headR * 1.05} y2={headCy + 6 * s} stroke="var(--color-primary-light, #2563eb)" strokeWidth={0.8 * s} opacity={0.3} strokeLinecap="round" />

        {/* Thinking bubble dots (only when mood is 'thinking') */}
        {mood === 'thinking' && (
          <g>
            <motion.circle
              cx={headCx + headR * 1.1} cy={headCy - headR * 0.8} r={1.5 * s}
              fill="var(--color-text-secondary, #9ca3af)"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx={headCx + headR * 1.35} cy={headCy - headR * 1.15} r={2 * s}
              fill="var(--color-text-secondary, #9ca3af)"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx={headCx + headR * 1.55} cy={headCy - headR * 1.55} r={2.5 * s}
              fill="var(--color-text-secondary, #9ca3af)"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
          </g>
        )}
      </motion.svg>
    </div>
  )
}
