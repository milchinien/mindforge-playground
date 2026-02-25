import { useMemo } from 'react'

const CONFETTI_COLORS = [
  '#f97316', '#ef4444', '#10b981', '#3b82f6',
  '#a855f7', '#f59e0b', '#ec4899', '#06b6d4',
]

const SHAPES = ['rect', 'circle']

export default function AvatarConfetti({ size = 200 }) {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * size * 0.8 + size * 0.1,
      y: Math.random() * -10,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      delay: Math.random() * 0.4,
      particleSize: 3 + Math.random() * 4,
    }))
  }, [size])

  return (
    <g>
      {particles.map((p) => (
        <g
          key={p.id}
          style={{
            animation: `confetti-fall 1.2s ${p.delay}s ease-out forwards`,
            transformOrigin: `${p.x}px ${p.y}px`,
          }}
        >
          {p.shape === 'rect' ? (
            <rect
              x={p.x}
              y={p.y}
              width={p.particleSize}
              height={p.particleSize * 0.7}
              fill={p.color}
              rx="0.5"
            />
          ) : (
            <circle
              cx={p.x}
              cy={p.y}
              r={p.particleSize / 2}
              fill={p.color}
            />
          )}
        </g>
      ))}
    </g>
  )
}
