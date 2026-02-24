import { adjustColor } from './avatarUtils'

// ============= HEAD =============
export function renderHead(skinColor, uid) {
  const skin = skinColor || '#F5D6B8'
  return (
    <>
      <defs>
        <radialGradient id={`skin-${uid}`} cx="48%" cy="40%" r="52%">
          <stop offset="0%" stopColor={adjustColor(skin, 15)} />
          <stop offset="80%" stopColor={skin} />
          <stop offset="100%" stopColor={adjustColor(skin, -12)} />
        </radialGradient>
      </defs>
      {/* Ears - smaller, softer */}
      <ellipse cx="57" cy="84" rx="6" ry="8" fill={skin} />
      <ellipse cx="143" cy="84" rx="6" ry="8" fill={skin} />
      <ellipse cx="57" cy="84" rx="3" ry="5" fill={adjustColor(skin, -18)} opacity="0.2" />
      <ellipse cx="143" cy="84" rx="3" ry="5" fill={adjustColor(skin, -18)} opacity="0.2" />
      {/* Head - rounder, friendlier */}
      <ellipse cx="100" cy="80" rx="42" ry="46" fill={`url(#skin-${uid})`} />
      {/* Soft cheek blush */}
      <ellipse cx="74" cy="94" rx="10" ry="6" fill="#f4a0a0" opacity="0.08" />
      <ellipse cx="126" cy="94" rx="10" ry="6" fill="#f4a0a0" opacity="0.08" />
    </>
  )
}

// ============= EYES =============
export function renderEyes(type, eyeColor, animated) {
  const blinkClass = animated ? 'avatar-blink' : ''
  const iris = eyeColor || '#6B3A2A'
  const irisDark = adjustColor(iris, -40)

  function eye(cx, cy, mirrorHighlight) {
    const hlX = mirrorHighlight ? cx + 1.5 : cx - 1.5
    switch (type) {
      case 'round':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="8" ry="8.5" fill="white" />
            <ellipse cx={cx} cy={cy} rx="8" ry="8.5" fill="none" stroke="#ddd" strokeWidth="0.4" />
            <circle cx={cx} cy={cy + 0.5} r="5.5" fill={iris} />
            <circle cx={cx} cy={cy + 0.5} r="5.5" fill="none" stroke={irisDark} strokeWidth="0.3" />
            <circle cx={cx} cy={cy + 0.5} r="3" fill="#1a1a1a" />
            <circle cx={hlX} cy={cy - 2} r="2" fill="white" opacity="0.85" />
            <circle cx={cx + (mirrorHighlight ? -1.5 : 1.5)} cy={cy + 2} r="1" fill="white" opacity="0.35" />
          </g>
        )
      case 'almond':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="10" ry="6.5" fill="white" />
            <ellipse cx={cx} cy={cy} rx="10" ry="6.5" fill="none" stroke="#ddd" strokeWidth="0.4" />
            <circle cx={cx} cy={cy} r="5" fill={iris} />
            <circle cx={cx} cy={cy} r="5" fill="none" stroke={irisDark} strokeWidth="0.3" />
            <circle cx={cx} cy={cy} r="2.8" fill="#1a1a1a" />
            <circle cx={hlX} cy={cy - 1.5} r="1.8" fill="white" opacity="0.85" />
          </g>
        )
      case 'sleepy':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="9" ry="5" fill="white" />
            <ellipse cx={cx} cy={cy - 1} rx="9" ry="3.5" fill={adjustColor('#F5D6B8', -5)} opacity="0.5" />
            <circle cx={cx} cy={cy + 0.5} r="4" fill={iris} />
            <circle cx={cx} cy={cy + 0.5} r="2" fill="#1a1a1a" />
            <circle cx={hlX} cy={cy - 0.5} r="1.3" fill="white" opacity="0.6" />
          </g>
        )
      case 'cat':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="9" ry="6" fill="white" />
            <ellipse cx={cx} cy={cy} rx="9" ry="6" fill="none" stroke="#ddd" strokeWidth="0.4" />
            <ellipse cx={cx} cy={cy} rx="3" ry="5" fill={iris} />
            <ellipse cx={cx} cy={cy} rx="1.2" ry="4" fill="#1a1a1a" />
            <circle cx={hlX} cy={cy - 1.5} r="1.5" fill="white" opacity="0.7" />
          </g>
        )
      case 'wide':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="8.5" ry="10" fill="white" />
            <ellipse cx={cx} cy={cy} rx="8.5" ry="10" fill="none" stroke="#ddd" strokeWidth="0.4" />
            <circle cx={cx} cy={cy} r="6" fill={iris} />
            <circle cx={cx} cy={cy} r="6" fill="none" stroke={irisDark} strokeWidth="0.3" />
            <circle cx={cx} cy={cy} r="3.5" fill="#1a1a1a" />
            <circle cx={hlX} cy={cy - 2.5} r="2.2" fill="white" opacity="0.85" />
            <circle cx={cx + (mirrorHighlight ? -1.5 : 1.5)} cy={cy + 2.5} r="1.2" fill="white" opacity="0.35" />
          </g>
        )
      default:
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="8" ry="8.5" fill="white" />
            <circle cx={cx} cy={cy + 0.5} r="5.5" fill={iris} />
            <circle cx={cx} cy={cy + 0.5} r="3" fill="#1a1a1a" />
            <circle cx={hlX} cy={cy - 2} r="2" fill="white" opacity="0.85" />
          </g>
        )
    }
  }

  return (
    <g className={blinkClass}>
      {eye(82, 82, false)}
      {eye(118, 82, true)}
    </g>
  )
}

// ============= EYEBROWS =============
export function renderEyebrows(type) {
  switch (type) {
    case 'normal':
      return (
        <>
          <path d="M 72 70 Q 82 66 92 70" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 108 70 Q 118 66 128 70" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )
    case 'thick':
      return (
        <>
          <path d="M 70 71 Q 82 64 94 71" stroke="#444" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 106 71 Q 118 64 130 71" stroke="#444" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )
    case 'arched':
      return (
        <>
          <path d="M 72 73 Q 78 64 92 69" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 128 73 Q 122 64 108 69" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )
    case 'angry':
      return (
        <>
          <path d="M 72 68 Q 82 71 92 68" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 108 68 Q 118 71 128 68" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )
    case 'thin':
      return (
        <>
          <path d="M 74 70 Q 82 68 90 70" stroke="#777" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 110 70 Q 118 68 126 70" stroke="#777" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      )
    default:
      return null
  }
}

// ============= NOSE =============
export function renderNose() {
  return (
    <>
      <ellipse cx="100" cy="96" rx="3" ry="2.5" fill="rgba(0,0,0,0.04)" />
      <path d="M 97 95 Q 100 99 103 95" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" strokeLinecap="round" />
    </>
  )
}

// ============= MOUTH =============
export function renderMouth(type) {
  // Using softer, warmer lip colors instead of blood-red
  const lipColor = '#d4807a'
  const lipDark = '#b86b66'
  const lipLight = '#e8a09a'

  switch (type) {
    case 'smile':
      return (
        <g>
          <path d="M 88 106 Q 100 115 112 106" stroke={lipColor} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 91 107 Q 100 113 109 107" fill={lipLight} opacity="0.25" />
        </g>
      )
    case 'neutral':
      return (
        <path d="M 90 108 Q 100 110 110 108" stroke={lipColor} strokeWidth="2" fill="none" strokeLinecap="round" />
      )
    case 'open':
      return (
        <g>
          <ellipse cx="100" cy="108" rx="8" ry="5.5" fill={lipDark} />
          <ellipse cx="100" cy="110" rx="5.5" ry="2.5" fill={lipLight} opacity="0.4" />
          <path d="M 92 107 Q 100 104 108 107" stroke={lipColor} strokeWidth="1.2" fill="none" />
        </g>
      )
    case 'smirk':
      return (
        <path d="M 90 108 Q 100 108 112 104" stroke={lipColor} strokeWidth="2" fill="none" strokeLinecap="round" />
      )
    case 'grin':
      return (
        <g>
          <path d="M 85 105 Q 100 116 115 105" stroke={lipColor} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 89 107 Q 100 114 111 107" fill="white" opacity="0.7" />
        </g>
      )
    default:
      return (
        <path d="M 88 106 Q 100 115 112 106" stroke={lipColor} strokeWidth="2" fill="none" strokeLinecap="round" />
      )
  }
}
