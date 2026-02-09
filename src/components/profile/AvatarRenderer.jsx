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

export default function AvatarRenderer({ skinColor, hairColor, hairStyle, eyeType, size = 200, username }) {
  // Fallback: just initials on colored circle
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
      {/* Background circle */}
      <circle cx="100" cy="100" r="98" fill="#374151" />

      {/* Head */}
      <circle cx="100" cy="105" r="72" fill={skinColor || '#F5D6B8'} />

      {/* Hair */}
      {renderHair(hairStyle || 'short', hairColor || '#2C1810')}

      {/* Eyes */}
      {renderEyes(eyeType || 'round')}

      {/* Mouth */}
      <path d="M 82 130 Q 100 142 118 130" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
