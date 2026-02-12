function getInitials(username) {
  if (!username) return '?'
  return username.charAt(0).toUpperCase()
}

function renderHair(style, color) {
  switch (style) {
    case 'short':
      return (
        <path
          d="M 40 75 Q 40 35 100 30 Q 160 35 160 75 L 155 65 Q 150 45 100 40 Q 50 45 45 65 Z"
          fill={color}
        />
      )
    case 'long':
      return (
        <>
          <path
            d="M 40 75 Q 40 35 100 28 Q 160 35 160 75 L 155 65 Q 150 42 100 36 Q 50 42 45 65 Z"
            fill={color}
          />
          <path d="M 38 75 Q 35 100 30 140 Q 32 145 42 130 Q 44 100 45 80 Z" fill={color} />
          <path d="M 162 75 Q 165 100 170 140 Q 168 145 158 130 Q 156 100 155 80 Z" fill={color} />
        </>
      )
    case 'curly':
      return (
        <>
          <circle cx="55" cy="50" r="18" fill={color} />
          <circle cx="85" cy="38" r="18" fill={color} />
          <circle cx="115" cy="38" r="18" fill={color} />
          <circle cx="145" cy="50" r="18" fill={color} />
          <circle cx="40" cy="70" r="14" fill={color} />
          <circle cx="160" cy="70" r="14" fill={color} />
        </>
      )
    case 'buzz':
      return (
        <path
          d="M 45 75 Q 45 42 100 36 Q 155 42 155 75 L 150 68 Q 148 48 100 42 Q 52 48 50 68 Z"
          fill={color}
          opacity={0.6}
        />
      )
    case 'ponytail':
      return (
        <>
          <path
            d="M 42 75 Q 42 38 100 32 Q 158 38 158 75 L 153 67 Q 150 46 100 40 Q 50 46 47 67 Z"
            fill={color}
          />
          <ellipse cx="100" cy="22" rx="18" ry="12" fill={color} />
          <path d="M 100 22 Q 105 10 115 5 Q 120 15 108 22" fill={color} />
        </>
      )
    case 'mohawk':
      return (
        <path
          d="M 85 70 Q 85 20 100 10 Q 115 20 115 70 L 110 60 Q 108 30 100 22 Q 92 30 90 60 Z"
          fill={color}
        />
      )
    default:
      return null
  }
}

function renderEyes(type) {
  switch (type) {
    case 'round':
      return (
        <>
          <circle cx="75" cy="105" r="6" fill="#333" />
          <circle cx="125" cy="105" r="6" fill="#333" />
          <circle cx="77" cy="103" r="2" fill="white" />
          <circle cx="127" cy="103" r="2" fill="white" />
        </>
      )
    case 'almond':
      return (
        <>
          <ellipse cx="75" cy="105" rx="8" ry="5" fill="#333" />
          <ellipse cx="125" cy="105" rx="8" ry="5" fill="#333" />
          <circle cx="77" cy="104" r="2" fill="white" />
          <circle cx="127" cy="104" r="2" fill="white" />
        </>
      )
    case 'sleepy':
      return (
        <>
          <path d="M 67 105 Q 75 100 83 105" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 117 105 Q 125 100 133 105" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )
    case 'cat':
      return (
        <>
          <ellipse cx="75" cy="105" rx="10" ry="4" fill="#333" />
          <ellipse cx="125" cy="105" rx="10" ry="4" fill="#333" />
          <ellipse cx="75" cy="105" rx="3" ry="4" fill="#6B8E23" />
          <ellipse cx="125" cy="105" rx="3" ry="4" fill="#6B8E23" />
        </>
      )
    default:
      return (
        <>
          <circle cx="75" cy="105" r="5" fill="#333" />
          <circle cx="125" cy="105" r="5" fill="#333" />
        </>
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
    default:
      return null
  }
}

function renderBackground(bgStyle) {
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
            <linearGradient id="bg-sunset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#4a1a6b" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill="url(#bg-sunset)" />
        </>
      )
    default:
      return <circle cx="100" cy="100" r="98" fill="#374151" />
  }
}

export default function AvatarRenderer({
  skinColor, hairColor, hairStyle, eyeType,
  eyebrows = 'none', mouth = 'smile', accessory = 'none', bgStyle = 'gray',
  size = 200, username,
}) {
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
      {renderBackground(bgStyle)}
      <circle cx="100" cy="105" r="72" fill={skinColor || '#F5D6B8'} />
      {renderHair(hairStyle || 'short', hairColor || '#2C1810')}
      {renderEyebrows(eyebrows)}
      {renderEyes(eyeType || 'round')}
      {renderMouth(mouth)}
      {renderAccessory(accessory)}
    </svg>
  )
}
