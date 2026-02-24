// ============= FRAME =============
export default function renderFrame(frameType, uid) {
  switch (frameType) {
    case 'golden':
      return (
        <>
          <defs>
            <linearGradient id={`frame-gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA000" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#frame-gold-${uid})`} strokeWidth="4" />
        </>
      )
    case 'diamond':
      return (
        <>
          <defs>
            <linearGradient id={`frame-diamond-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B3E5FC" />
              <stop offset="50%" stopColor="#E1F5FE" />
              <stop offset="100%" stopColor="#4FC3F7" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#frame-diamond-${uid})`} strokeWidth="4" className="avatar-sparkle" />
        </>
      )
    case 'fire':
      return (
        <circle cx="100" cy="100" r="97" fill="none" stroke="#ef4444" strokeWidth="3" className="avatar-aura-fire" />
      )
    case 'rainbow':
      return (
        <>
          <defs>
            <linearGradient id={`frame-rainbow-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="75%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#frame-rainbow-${uid})`} strokeWidth="4" />
        </>
      )
    default:
      return null
  }
}
