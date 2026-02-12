function getInitials(username) {
  if (!username) return '?'
  return username.charAt(0).toUpperCase()
}

function renderHair(style, color, animated) {
  const hoverClass = animated ? 'avatar-hair-hover' : ''
  switch (style) {
    case 'short':
      return (
        <path
          className={hoverClass}
          d="M 40 75 Q 40 35 100 30 Q 160 35 160 75 L 155 65 Q 150 45 100 40 Q 50 45 45 65 Z"
          fill={color}
        />
      )
    case 'long':
      return (
        <g className={hoverClass}>
          <path
            d="M 40 75 Q 40 35 100 28 Q 160 35 160 75 L 155 65 Q 150 42 100 36 Q 50 42 45 65 Z"
            fill={color}
          />
          <path d="M 38 75 Q 35 100 30 140 Q 32 145 42 130 Q 44 100 45 80 Z" fill={color} />
          <path d="M 162 75 Q 165 100 170 140 Q 168 145 158 130 Q 156 100 155 80 Z" fill={color} />
        </g>
      )
    case 'curly':
      return (
        <g className={hoverClass}>
          <circle cx="55" cy="50" r="18" fill={color} />
          <circle cx="85" cy="38" r="18" fill={color} />
          <circle cx="115" cy="38" r="18" fill={color} />
          <circle cx="145" cy="50" r="18" fill={color} />
          <circle cx="40" cy="70" r="14" fill={color} />
          <circle cx="160" cy="70" r="14" fill={color} />
        </g>
      )
    case 'buzz':
      return (
        <path
          className={hoverClass}
          d="M 45 75 Q 45 42 100 36 Q 155 42 155 75 L 150 68 Q 148 48 100 42 Q 52 48 50 68 Z"
          fill={color}
          opacity={0.6}
        />
      )
    case 'ponytail':
      return (
        <g className={hoverClass}>
          <path
            d="M 42 75 Q 42 38 100 32 Q 158 38 158 75 L 153 67 Q 150 46 100 40 Q 50 46 47 67 Z"
            fill={color}
          />
          <ellipse cx="100" cy="22" rx="18" ry="12" fill={color} />
          <path d="M 100 22 Q 105 10 115 5 Q 120 15 108 22" fill={color} />
        </g>
      )
    case 'mohawk':
      return (
        <path
          className={hoverClass}
          d="M 85 70 Q 85 20 100 10 Q 115 20 115 70 L 110 60 Q 108 30 100 22 Q 92 30 90 60 Z"
          fill={color}
        />
      )
    default:
      return null
  }
}

function renderEyes(type, animated) {
  const blinkClass = animated ? 'avatar-blink' : ''
  switch (type) {
    case 'round':
      return (
        <g className={blinkClass}>
          <circle cx="75" cy="105" r="6" fill="#333" />
          <circle cx="125" cy="105" r="6" fill="#333" />
          <circle cx="77" cy="103" r="2" fill="white" />
          <circle cx="127" cy="103" r="2" fill="white" />
        </g>
      )
    case 'almond':
      return (
        <g className={blinkClass}>
          <ellipse cx="75" cy="105" rx="8" ry="5" fill="#333" />
          <ellipse cx="125" cy="105" rx="8" ry="5" fill="#333" />
          <circle cx="77" cy="104" r="2" fill="white" />
          <circle cx="127" cy="104" r="2" fill="white" />
        </g>
      )
    case 'sleepy':
      return (
        <g className={blinkClass}>
          <path d="M 67 105 Q 75 100 83 105" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 117 105 Q 125 100 133 105" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'cat':
      return (
        <g className={blinkClass}>
          <ellipse cx="75" cy="105" rx="10" ry="4" fill="#333" />
          <ellipse cx="125" cy="105" rx="10" ry="4" fill="#333" />
          <ellipse cx="75" cy="105" rx="3" ry="4" fill="#6B8E23" />
          <ellipse cx="125" cy="105" rx="3" ry="4" fill="#6B8E23" />
        </g>
      )
    default:
      return (
        <g className={blinkClass}>
          <circle cx="75" cy="105" r="5" fill="#333" />
          <circle cx="125" cy="105" r="5" fill="#333" />
        </g>
      )
  }
}

function renderEyebrows(type) {
  switch (type) {
    case 'normal':
      return (
        <>
          <path d="M 64 92 Q 75 88 86 92" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 114 92 Q 125 88 136 92" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )
    case 'thick':
      return (
        <>
          <path d="M 62 93 Q 75 86 88 93" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 112 93 Q 125 86 138 93" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'arched':
      return (
        <>
          <path d="M 64 95 Q 72 84 86 90" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 136 95 Q 128 84 114 90" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )
    case 'angry':
      return (
        <>
          <path d="M 64 88 Q 75 92 86 88" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 114 88 Q 125 92 136 88" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )
    default:
      return null
  }
}

function renderMouth(type) {
  switch (type) {
    case 'smile':
      return (
        <path d="M 82 130 Q 100 142 118 130" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )
    case 'neutral':
      return (
        <path d="M 85 134 L 115 134" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )
    case 'open':
      return (
        <ellipse cx="100" cy="135" rx="12" ry="8" fill="#333" />
      )
    case 'smirk':
      return (
        <path d="M 85 133 Q 100 133 118 128" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )
    default:
      return (
        <path d="M 82 130 Q 100 142 118 130" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )
  }
}

function renderAccessory(type) {
  switch (type) {
    case 'glasses':
      return (
        <>
          <circle cx="75" cy="105" r="14" stroke="#555" strokeWidth="2" fill="none" />
          <circle cx="125" cy="105" r="14" stroke="#555" strokeWidth="2" fill="none" />
          <path d="M 89 105 L 111 105" stroke="#555" strokeWidth="2" />
          <path d="M 61 105 L 50 100" stroke="#555" strokeWidth="2" />
          <path d="M 139 105 L 150 100" stroke="#555" strokeWidth="2" />
        </>
      )
    case 'sunglasses':
      return (
        <>
          <rect x="58" y="95" width="30" height="20" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
          <rect x="112" y="95" width="30" height="20" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
          <path d="M 88 103 L 112 103" stroke="#333" strokeWidth="2" />
          <path d="M 58 103 L 48 99" stroke="#333" strokeWidth="2" />
          <path d="M 142 103 L 152 99" stroke="#333" strokeWidth="2" />
        </>
      )
    case 'earring':
      return (
        <circle cx="38" cy="120" r="4" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      )
    case 'crown':
      return (
        <g className="avatar-sparkle">
          <polygon points="70,38 80,20 90,35 100,12 110,35 120,20 130,38" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
          <circle cx="80" cy="28" r="2" fill="#FF6B6B" />
          <circle cx="100" cy="18" r="2.5" fill="#4FC3F7" />
          <circle cx="120" cy="28" r="2" fill="#81C784" />
        </g>
      )
    case 'helmet':
      return (
        <g>
          <path d="M 45 80 Q 45 20 100 15 Q 155 20 155 80" fill="#6B7280" stroke="#4B5563" strokeWidth="2" />
          <path d="M 60 80 L 60 95 Q 60 100 65 100 L 135 100 Q 140 100 140 95 L 140 80" fill="none" stroke="#4B5563" strokeWidth="2" />
          <rect x="65" y="92" width="70" height="6" rx="2" fill="#4B5563" opacity="0.5" />
        </g>
      )
    default:
      return null
  }
}

function renderBackground(bgStyle, uniqueId) {
  switch (bgStyle) {
    case 'gray':
      return <circle cx="100" cy="100" r="98" fill="#374151" />
    case 'blue':
      return <circle cx="100" cy="100" r="98" fill="#1e3a5f" />
    case 'purple':
      return <circle cx="100" cy="100" r="98" fill="#4a1a6b" />
    case 'green':
      return <circle cx="100" cy="100" r="98" fill="#1a4a2e" />
    case 'sunset':
      return (
        <>
          <defs>
            <linearGradient id={`bg-sunset-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#4a1a6b" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill={`url(#bg-sunset-${uniqueId})`} />
        </>
      )
    case 'galaxy':
      return (
        <>
          <defs>
            <radialGradient id={`bg-galaxy-${uniqueId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a0533" />
              <stop offset="50%" stopColor="#0d1b3e" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill={`url(#bg-galaxy-${uniqueId})`} />
          <circle cx="60" cy="40" r="1" fill="white" opacity="0.8" />
          <circle cx="140" cy="60" r="1.5" fill="white" opacity="0.6" />
          <circle cx="80" cy="160" r="1" fill="white" opacity="0.7" />
          <circle cx="150" cy="150" r="1" fill="#9C27B0" opacity="0.8" />
          <circle cx="45" cy="130" r="0.8" fill="#4FC3F7" opacity="0.6" />
        </>
      )
    case 'fire':
      return (
        <>
          <defs>
            <linearGradient id={`bg-fire-${uniqueId}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#b71c1c" />
              <stop offset="50%" stopColor="#e65100" />
              <stop offset="100%" stopColor="#ff8f00" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill={`url(#bg-fire-${uniqueId})`} />
        </>
      )
    default:
      return <circle cx="100" cy="100" r="98" fill="#374151" />
  }
}

function renderFrame(frameType, uniqueId) {
  switch (frameType) {
    case 'golden':
      return (
        <>
          <defs>
            <linearGradient id={`frame-gold-${uniqueId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA000" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#frame-gold-${uniqueId})`} strokeWidth="4" />
        </>
      )
    case 'diamond':
      return (
        <>
          <defs>
            <linearGradient id={`frame-diamond-${uniqueId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B3E5FC" />
              <stop offset="50%" stopColor="#E1F5FE" />
              <stop offset="100%" stopColor="#4FC3F7" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#frame-diamond-${uniqueId})`} strokeWidth="4" className="avatar-sparkle" />
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
            <linearGradient id={`frame-rainbow-${uniqueId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="75%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#frame-rainbow-${uniqueId})`} strokeWidth="4" />
        </>
      )
    default:
      return null
  }
}

function renderEffect(effectType) {
  switch (effectType) {
    case 'fire-aura':
      return (
        <circle cx="100" cy="100" r="94" fill="none" stroke="#ff6b35" strokeWidth="2" opacity="0.4" className="avatar-aura-fire" />
      )
    case 'rainbow-shimmer':
      return (
        <circle cx="100" cy="100" r="94" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.3" className="avatar-sparkle" />
      )
    default:
      return null
  }
}

const animationStyles = `
  @keyframes avatar-blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
  @keyframes avatar-sparkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes avatar-aura-pulse {
    0%, 100% { stroke-width: 2; opacity: 0.4; }
    50% { stroke-width: 4; opacity: 0.7; }
  }
  .avatar-blink {
    animation: avatar-blink 4s ease-in-out infinite;
    transform-origin: center 105px;
  }
  .avatar-hair-hover {
    transition: transform 0.3s ease;
    transform-origin: center top;
  }
  .avatar-hair-hover:hover {
    transform: translateY(-1px);
  }
  .avatar-sparkle {
    animation: avatar-sparkle 2s ease-in-out infinite;
  }
  .avatar-aura-fire {
    animation: avatar-aura-pulse 2s ease-in-out infinite;
  }
`

let styleInjected = false
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.textContent = animationStyles
  document.head.appendChild(style)
  styleInjected = true
}

let avatarCounter = 0

export default function AvatarRenderer({
  skinColor, hairColor, hairStyle, eyeType,
  eyebrows = 'none', mouth = 'smile', accessory = 'none', bgStyle = 'gray',
  size = 200, username, animated = false,
  equippedFrame, equippedEffect, equippedBackground, equippedHairColor, equippedAccessory,
}) {
  if (animated) injectStyles()

  const uniqueId = `av-${++avatarCounter}`
  const finalBg = equippedBackground || bgStyle
  const finalHairColor = equippedHairColor || hairColor || '#2C1810'
  const finalAccessory = equippedAccessory || accessory

  if (!skinColor && !hairColor && !hairStyle) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#374151" />
        <text x="100" y="115" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold">
          {getInitials(username)}
        </text>
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      {renderBackground(finalBg, uniqueId)}
      {renderEffect(equippedEffect)}
      <circle cx="100" cy="105" r="72" fill={skinColor || '#F5D6B8'} />
      {renderHair(hairStyle || 'short', finalHairColor, animated)}
      {renderEyebrows(eyebrows)}
      {renderEyes(eyeType || 'round', animated)}
      {renderMouth(mouth)}
      {renderAccessory(finalAccessory)}
      {renderFrame(equippedFrame, uniqueId)}
    </svg>
  )
}
