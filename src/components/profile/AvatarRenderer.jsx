// ============= UTILITIES =============
function adjustColor(hex, amount) {
  if (!hex || hex.charAt(0) !== '#') return hex || '#F5D6B8'
  const num = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

function getInitials(username) {
  if (!username) return '?'
  return username.charAt(0).toUpperCase()
}

// Body type width multipliers
const BODY_CONFIGS = {
  slim: { shoulderW: 0.78, neckW: 0.88 },
  normal: { shoulderW: 1.0, neckW: 1.0 },
  athletic: { shoulderW: 1.1, neckW: 1.05 },
  wide: { shoulderW: 1.22, neckW: 1.12 },
  stocky: { shoulderW: 1.3, neckW: 1.15 },
}

// ============= BACKGROUND =============
function renderBackground(bgStyle, uid) {
  const gradientBgs = {
    sunset: { stops: [['#ff6b35', 0], ['#4a1a6b', 100]], dir: 'y' },
    galaxy: null,
    fire: { stops: [['#ff8f00', 0], ['#e65100', 50], ['#b71c1c', 100]], dir: 'y-reverse' },
    ocean: { stops: [['#0077b6', 0], ['#023e8a', 50], ['#03045e', 100]], dir: 'y' },
    forest: { stops: [['#2d6a4f', 0], ['#1b4332', 100]], dir: 'y' },
    neon: { stops: [['#7b2ff7', 0], ['#2196F3', 50], ['#00e5ff', 100]], dir: 'x' },
    arctic: { stops: [['#e3f2fd', 0], ['#90caf9', 50], ['#42a5f5', 100]], dir: 'y' },
    cherry: { stops: [['#f8bbd0', 0], ['#e91e63', 60], ['#880e4f', 100]], dir: 'y' },
    candy: { stops: [['#f48fb1', 0], ['#ce93d8', 33], ['#90caf9', 66], ['#80deea', 100]], dir: 'x' },
    mindforge: { stops: [['#f97316', 0], ['#ea580c', 50], ['#9a3412', 100]], dir: 'y' },
  }
  const solidBgs = {
    gray: '#374151',
    blue: '#1e3a5f',
    purple: '#4a1a6b',
    green: '#1a4a2e',
    red: '#7f1d1d',
    pink: '#831843',
  }

  if (solidBgs[bgStyle]) {
    return <circle cx="100" cy="100" r="98" fill={solidBgs[bgStyle]} />
  }

  if (bgStyle === 'galaxy') {
    return (
      <>
        <defs>
          <radialGradient id={`bg-galaxy-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0533" />
            <stop offset="50%" stopColor="#0d1b3e" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="98" fill={`url(#bg-galaxy-${uid})`} />
        <circle cx="55" cy="38" r="1" fill="white" opacity="0.8" />
        <circle cx="140" cy="55" r="1.5" fill="white" opacity="0.6" />
        <circle cx="35" cy="130" r="1" fill="#4FC3F7" opacity="0.6" />
        <circle cx="160" cy="140" r="1" fill="#9C27B0" opacity="0.8" />
        <circle cx="80" cy="165" r="0.8" fill="white" opacity="0.5" />
        <circle cx="120" cy="30" r="0.8" fill="#FFD700" opacity="0.6" />
      </>
    )
  }

  const cfg = gradientBgs[bgStyle]
  if (cfg) {
    const isReverse = cfg.dir.includes('reverse')
    const isX = cfg.dir.includes('x')
    return (
      <>
        <defs>
          <linearGradient id={`bg-${bgStyle}-${uid}`}
            x1={0} y1={isReverse ? 1 : 0} x2={isX ? 1 : 0} y2={isX ? 0 : (isReverse ? 0 : 1)}>
            {cfg.stops.map(([color, offset], i) => (
              <stop key={i} offset={`${offset}%`} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="98" fill={`url(#bg-${bgStyle}-${uid})`} />
      </>
    )
  }

  return <circle cx="100" cy="100" r="98" fill="#374151" />
}

// ============= BODY & CLOTHING =============
function renderBody(skinColor, clothing, clothingColor, uid, bodyType) {
  const darkSkin = adjustColor(skinColor || '#F5D6B8', -20)
  const cColor = clothingColor || '#374151'
  const darkCloth = adjustColor(cColor, -30)
  const cfg = BODY_CONFIGS[bodyType] || BODY_CONFIGS.normal
  const sw = cfg.shoulderW
  const nw = cfg.neckW

  // Neck - adjusted for body type
  const neckL = 100 - 10 * nw
  const neckR = 100 + 10 * nw
  const neckPath = `M ${neckL} 128 Q ${100} 136 ${neckR} 128 L ${neckR} 142 L ${neckL} 142 Z`

  // Body/shoulders - adjusted for body type
  const shoulderL = 100 - 62 * sw
  const shoulderR = 100 + 62 * sw
  const armL = 100 - 90 * sw
  const armR = 100 + 90 * sw
  const bodyPath = `M ${neckL} 142 Q ${shoulderL} 150 ${armL} 172 Q ${armL - 8} 186 ${armL - 12} 210 L ${armR + 12} 210 Q ${armR + 8} 186 ${armR} 172 Q ${shoulderR} 150 ${neckR} 142 Z`

  let clothingDetail = null
  switch (clothing) {
    case 'hoodie':
      clothingDetail = (
        <>
          <path d={`M ${neckL} 142 Q 100 152 ${neckR} 142`} stroke={darkCloth} strokeWidth="1.5" fill="none" />
          <line x1="100" y1="150" x2="100" y2="210" stroke={darkCloth} strokeWidth="1" opacity="0.3" />
          <path d={`M ${neckL + 6} 144 L ${neckL + 3} 158`} stroke={darkCloth} strokeWidth="1.5" opacity="0.5" />
          <path d={`M ${neckR - 6} 144 L ${neckR - 3} 158`} stroke={darkCloth} strokeWidth="1.5" opacity="0.5" />
        </>
      )
      break
    case 'jacket':
      clothingDetail = (
        <>
          <line x1="100" y1="144" x2="100" y2="210" stroke={darkCloth} strokeWidth="2" />
          <path d={`M ${neckL} 142 L ${neckL + 6} 154 L 100 146 L ${neckR - 6} 154 L ${neckR} 142`} fill="none" stroke={darkCloth} strokeWidth="1.5" />
        </>
      )
      break
    case 'tank':
      clothingDetail = (
        <path d={`M ${neckL + 3} 142 Q 100 150 ${neckR - 3} 142`} stroke={darkCloth} strokeWidth="1" fill="none" />
      )
      break
    case 'suit':
      clothingDetail = (
        <>
          <line x1="100" y1="146" x2="100" y2="210" stroke={darkCloth} strokeWidth="1.5" />
          <path d={`M ${neckL} 142 L ${neckL + 8} 156 L 100 146 L ${neckR - 8} 156 L ${neckR} 142`} fill="none" stroke={darkCloth} strokeWidth="1.5" />
          <rect x="97" y="154" width="6" height="8" rx="1" fill={darkCloth} opacity="0.5" />
        </>
      )
      break
    default: // tshirt
      clothingDetail = (
        <path d={`M ${neckL} 142 Q 100 150 ${neckR} 142`} stroke={darkCloth} strokeWidth="1.5" fill="none" />
      )
  }

  return (
    <>
      <path d={neckPath} fill={darkSkin} />
      <defs>
        <linearGradient id={`cloth-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cColor} />
          <stop offset="100%" stopColor={darkCloth} />
        </linearGradient>
      </defs>
      <path d={bodyPath} fill={`url(#cloth-${uid})`} />
      {clothingDetail}
    </>
  )
}

// ============= HEAD =============
function renderHead(skinColor, uid) {
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
function renderEyes(type, eyeColor, animated) {
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
function renderEyebrows(type) {
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
function renderNose() {
  return (
    <>
      <ellipse cx="100" cy="96" rx="3" ry="2.5" fill="rgba(0,0,0,0.04)" />
      <path d="M 97 95 Q 100 99 103 95" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" strokeLinecap="round" />
    </>
  )
}

// ============= MOUTH =============
function renderMouth(type) {
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

// ============= HAIR (BACK LAYER) =============
function renderHairBack(style, color) {
  const c = color || '#2C1810'
  switch (style) {
    case 'long':
      return (
        <g opacity="0.9">
          <path d="M 54 78 Q 48 108 42 148 Q 40 158 48 152 Q 50 122 54 90 Z" fill={c} />
          <path d="M 146 78 Q 152 108 158 148 Q 160 158 152 152 Q 150 122 146 90 Z" fill={c} />
        </g>
      )
    case 'braids':
      return (
        <g>
          <path d="M 58 72 Q 52 96 46 118 Q 42 132 46 136 Q 50 132 48 118 Q 52 100 56 82 Z" fill={c} />
          <path d="M 142 72 Q 148 96 154 118 Q 158 132 154 136 Q 150 132 152 118 Q 148 100 144 82 Z" fill={c} />
          <circle cx="46" cy="138" r="3.5" fill={c} />
          <circle cx="154" cy="138" r="3.5" fill={c} />
        </g>
      )
    case 'afro':
      return (
        <g opacity="0.9">
          <circle cx="54" cy="72" r="11" fill={c} />
          <circle cx="146" cy="72" r="11" fill={c} />
          <circle cx="46" cy="90" r="9" fill={c} />
          <circle cx="154" cy="90" r="9" fill={c} />
        </g>
      )
    default:
      return null
  }
}

// ============= HAIR (FRONT LAYER) =============
function renderHairFront(style, color, uid) {
  const c = color || '#2C1810'
  const highlight = adjustColor(c, 35)
  const hoverClass = 'avatar-hair-hover'

  switch (style) {
    case 'short':
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 60 38 100 32 Q 140 38 142 78 Q 138 54 100 46 Q 62 54 58 78 Z" fill={c} />
          <path d="M 74 48 Q 90 38 108 40" stroke={highlight} strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
        </g>
      )
    case 'long':
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 58 36 100 28 Q 142 36 142 78 Q 138 52 100 44 Q 62 52 58 78 Z" fill={c} />
          <path d="M 56 78 Q 53 90 51 100" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 144 78 Q 147 90 149 100" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 72 46 Q 90 36 108 38" stroke={highlight} strokeWidth="2" fill="none" opacity="0.18" strokeLinecap="round" />
        </g>
      )
    case 'curly':
      return (
        <g className={hoverClass}>
          <circle cx="62" cy="48" r="16" fill={c} />
          <circle cx="88" cy="38" r="16" fill={c} />
          <circle cx="112" cy="38" r="16" fill={c} />
          <circle cx="138" cy="48" r="16" fill={c} />
          <circle cx="50" cy="66" r="12" fill={c} />
          <circle cx="150" cy="66" r="12" fill={c} />
          <circle cx="60" cy="44" r="3.5" fill={highlight} opacity="0.12" />
          <circle cx="88" cy="34" r="3.5" fill={highlight} opacity="0.12" />
          <circle cx="114" cy="34" r="3.5" fill={highlight} opacity="0.12" />
        </g>
      )
    case 'buzz':
      return (
        <g className={hoverClass}>
          <path d="M 60 78 Q 60 40 100 34 Q 140 40 140 78 Q 136 54 100 46 Q 64 54 60 78 Z"
                fill={c} opacity="0.5" />
        </g>
      )
    case 'ponytail':
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 60 38 100 32 Q 140 38 142 78 Q 138 54 100 46 Q 62 54 58 78 Z" fill={c} />
          <ellipse cx="100" cy="26" rx="14" ry="9" fill={c} />
          <path d="M 100 26 Q 106 14 116 8 Q 118 14 110 22" fill={c} />
          <circle cx="112" cy="10" r="3" fill={c} />
        </g>
      )
    case 'mohawk':
      return (
        <g className={hoverClass}>
          <path d="M 88 68 Q 88 22 100 10 Q 112 22 112 68 Q 108 42 100 32 Q 92 42 88 68 Z" fill={c} />
          <path d="M 96 32 Q 100 20 104 32" stroke={highlight} strokeWidth="1.5" fill="none" opacity="0.18" />
        </g>
      )
    case 'messy':
      return (
        <g className={hoverClass}>
          <path d="M 56 78 Q 54 40 100 30 Q 146 40 144 78 Q 140 50 100 42 Q 60 50 56 78 Z" fill={c} />
          <path d="M 62 52 L 54 40 Q 58 46 64 48" fill={c} />
          <path d="M 138 52 L 146 40 Q 142 46 136 48" fill={c} />
          <path d="M 86 40 L 82 28 Q 86 34 90 38" fill={c} />
          <path d="M 114 40 L 118 28 Q 114 34 110 38" fill={c} />
          <path d="M 100 36 L 98 24 Q 102 30 102 36" fill={c} />
        </g>
      )
    case 'bob':
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 58 36 100 30 Q 142 36 142 78 Q 138 52 100 44 Q 62 52 58 78 Z" fill={c} />
          <path d="M 56 78 Q 53 98 55 108 Q 57 112 60 108 Q 58 98 58 82 Z" fill={c} />
          <path d="M 144 78 Q 147 98 145 108 Q 143 112 140 108 Q 142 98 142 82 Z" fill={c} />
          <path d="M 72 48 Q 88 36 106 39" stroke={highlight} strokeWidth="2" fill="none" opacity="0.18" strokeLinecap="round" />
        </g>
      )
    case 'spiky':
      return (
        <g className={hoverClass}>
          <path d="M 62 68 L 54 32 Q 60 44 70 50 L 68 20 Q 74 38 82 44 L 84 12 Q 90 32 96 42 L 100 8 Q 106 32 112 42 L 116 12 Q 122 32 128 44 L 132 20 Q 136 38 140 50 L 146 32 Q 144 54 138 68 Q 128 52 100 46 Q 72 52 62 68 Z"
              fill={c} />
          <path d="M 90 30 Q 96 18 104 30" stroke={highlight} strokeWidth="1.5" fill="none" opacity="0.18" />
        </g>
      )
    case 'braids':
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 58 36 100 30 Q 142 36 142 78 Q 138 52 100 44 Q 62 52 58 78 Z" fill={c} />
          <path d="M 74 48 Q 88 38 106 39" stroke={highlight} strokeWidth="2" fill="none" opacity="0.18" strokeLinecap="round" />
        </g>
      )
    case 'afro':
      return (
        <g className={hoverClass}>
          <circle cx="100" cy="44" r="46" fill={c} />
          <circle cx="62" cy="62" r="20" fill={c} />
          <circle cx="138" cy="62" r="20" fill={c} />
          <circle cx="100" cy="18" r="16" fill={c} />
          <circle cx="72" cy="28" r="14" fill={c} />
          <circle cx="128" cy="28" r="14" fill={c} />
          <circle cx="80" cy="36" r="5" fill={highlight} opacity="0.1" />
          <circle cx="112" cy="24" r="3.5" fill={highlight} opacity="0.08" />
        </g>
      )
    case 'pixie':
      return (
        <g className={hoverClass}>
          <path d="M 60 78 Q 62 40 100 32 Q 138 40 140 78 Q 136 56 100 48 Q 64 56 60 78 Z" fill={c} />
          <path d="M 58 72 Q 50 60 46 68 Q 44 76 54 78" fill={c} />
          <path d="M 76 48 Q 88 38 104 40" stroke={highlight} strokeWidth="1.5" fill="none" opacity="0.18" strokeLinecap="round" />
        </g>
      )
    case 'sidepart':
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 58 36 100 30 Q 140 36 142 78 Q 138 54 100 46 Q 62 54 58 78 Z" fill={c} />
          <path d="M 58 68 Q 54 52 70 40 Q 86 32 100 30" stroke={c} strokeWidth="9" fill="none" />
          <path d="M 56 74 Q 48 60 44 72 Q 42 82 52 80" fill={c} />
          <path d="M 70 44 Q 84 34 98 36" stroke={highlight} strokeWidth="2" fill="none" opacity="0.18" strokeLinecap="round" />
        </g>
      )
    case 'undercut':
      return (
        <g className={hoverClass}>
          <path d="M 72 78 Q 74 44 100 36 Q 126 44 128 78 Q 124 56 100 50 Q 76 56 72 78 Z" fill={c} />
          <path d="M 60 78 Q 62 58 72 52" stroke={c} strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M 140 78 Q 138 58 128 52" stroke={c} strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M 84 48 Q 96 38 110 42" stroke={highlight} strokeWidth="1.5" fill="none" opacity="0.18" strokeLinecap="round" />
        </g>
      )
    default:
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 60 38 100 32 Q 140 38 142 78 Q 138 54 100 46 Q 62 54 58 78 Z" fill={c} />
        </g>
      )
  }
}

// ============= ACCESSORY =============
function renderAccessory(type) {
  switch (type) {
    case 'glasses':
      return (
        <g>
          <circle cx="82" cy="82" r="12" stroke="#777" strokeWidth="1.8" fill="none" />
          <circle cx="118" cy="82" r="12" stroke="#777" strokeWidth="1.8" fill="none" />
          <path d="M 94 82 L 106 82" stroke="#777" strokeWidth="1.8" />
          <path d="M 70 82 L 58 79" stroke="#777" strokeWidth="1.8" />
          <path d="M 130 82 L 142 79" stroke="#777" strokeWidth="1.8" />
        </g>
      )
    case 'sunglasses':
      return (
        <g>
          <rect x="68" y="75" width="26" height="16" rx="3.5" fill="#1a1a1a" stroke="#444" strokeWidth="1.2" />
          <rect x="106" y="75" width="26" height="16" rx="3.5" fill="#1a1a1a" stroke="#444" strokeWidth="1.2" />
          <path d="M 94 82 L 106 82" stroke="#444" strokeWidth="1.8" />
          <path d="M 68 80 L 58 77" stroke="#444" strokeWidth="1.8" />
          <path d="M 132 80 L 142 77" stroke="#444" strokeWidth="1.8" />
          <rect x="71" y="77" width="8" height="2.5" rx="1" fill="white" opacity="0.12" />
          <rect x="109" y="77" width="8" height="2.5" rx="1" fill="white" opacity="0.12" />
        </g>
      )
    case 'earring':
      return (
        <g>
          <circle cx="50" cy="92" r="3" fill="#FFD700" />
          <circle cx="50" cy="92" r="1.8" fill="#FFA000" />
        </g>
      )
    case 'headphones':
      return (
        <g>
          <path d="M 52 76 Q 52 44 100 38 Q 148 44 148 76" stroke="#444" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <rect x="44" y="70" width="12" height="20" rx="4.5" fill="#555" stroke="#444" strokeWidth="1" />
          <rect x="144" y="70" width="12" height="20" rx="4.5" fill="#555" stroke="#444" strokeWidth="1" />
          <rect x="47" y="74" width="6" height="12" rx="2.5" fill="#666" />
          <rect x="147" y="74" width="6" height="12" rx="2.5" fill="#666" />
        </g>
      )
    case 'mask':
      return (
        <g>
          <path d="M 74 94 Q 76 104 82 108 Q 92 114 100 116 Q 108 114 118 108 Q 124 104 126 94 Q 100 90 74 94 Z"
                fill="#333" />
          <path d="M 78 98 Q 100 94 122 98" stroke="#555" strokeWidth="0.8" fill="none" />
          <path d="M 80 102 Q 100 98 120 102" stroke="#555" strokeWidth="0.8" fill="none" />
        </g>
      )
    case 'scarf':
      return (
        <g>
          <path d="M 80 116 Q 78 126 76 138 Q 73 146 84 144 Q 88 138 90 128 Q 92 120 100 116 Q 108 120 110 128 Q 112 138 116 144 Q 127 146 124 138 Q 122 126 120 116"
                fill="#e07060" stroke="#c05545" strokeWidth="0.8" />
          <path d="M 80 124 Q 100 120 120 124" stroke="#c05545" strokeWidth="1.2" fill="none" opacity="0.4" />
        </g>
      )
    case 'monocle':
      return (
        <g>
          <circle cx="118" cy="82" r="13" stroke="#FFD700" strokeWidth="1.8" fill="none" />
          <circle cx="118" cy="82" r="11" stroke="#DAA520" strokeWidth="0.4" fill="rgba(255,255,255,0.04)" />
          <path d="M 131 82 Q 136 88 140 100 Q 142 108 139 114" stroke="#FFD700" strokeWidth="1" fill="none" />
          <circle cx="118" cy="77" r="1.8" fill="white" opacity="0.25" />
        </g>
      )
    case 'bowtie':
      return (
        <g>
          <path d="M 86 132 L 96 126 L 96 138 Z" fill="#d07068" />
          <path d="M 114 132 L 104 126 L 104 138 Z" fill="#d07068" />
          <circle cx="100" cy="132" r="3" fill="#e08078" />
          <circle cx="100" cy="132" r="1.8" fill="#b05548" />
        </g>
      )
    case 'bandana':
      return (
        <g>
          <path d="M 58 62 Q 60 50 100 44 Q 140 50 142 62 Q 138 54 100 50 Q 62 54 58 62 Z" fill="#e07060" />
          <path d="M 58 62 Q 100 58 142 62" stroke="#c05545" strokeWidth="1.8" fill="none" />
          <circle cx="100" cy="46" r="1.8" fill="#c05545" />
          <path d="M 56 62 L 48 70 Q 46 74 50 72 L 58 66" fill="#e07060" />
          <path d="M 144 62 L 152 70 Q 154 74 150 72 L 142 66" fill="#e07060" />
        </g>
      )
    default:
      return null
  }
}

// ============= HATS =============
function renderHat(type) {
  switch (type) {
    case 'baseball':
      return (
        <g>
          <path d="M 60 50 Q 62 28 100 22 Q 138 28 140 50 Q 130 38 100 32 Q 70 38 60 50 Z" fill="#2c3e50" />
          <path d="M 58 50 Q 80 48 118 56 Q 136 60 134 54 Q 118 46 58 50 Z" fill="#1a252f" />
          <circle cx="100" cy="24" r="2.5" fill="#1a252f" />
          <path d="M 74 38 Q 90 28 106 30" stroke="white" strokeWidth="0.8" fill="none" opacity="0.1" strokeLinecap="round" />
        </g>
      )
    case 'beanie':
      return (
        <g>
          <path d="M 58 52 Q 60 22 100 14 Q 140 22 142 52 Q 134 44 100 40 Q 66 44 58 52 Z" fill="#7f8c8d" />
          <path d="M 56 52 Q 100 46 144 52" stroke="#6c7a7d" strokeWidth="3.5" fill="none" />
          <path d="M 78 50 L 78 26" stroke="#6c7a7d" strokeWidth="0.7" opacity="0.25" />
          <path d="M 100 48 L 100 16" stroke="#6c7a7d" strokeWidth="0.7" opacity="0.25" />
          <path d="M 122 50 L 122 26" stroke="#6c7a7d" strokeWidth="0.7" opacity="0.25" />
          <circle cx="100" cy="14" r="4.5" fill="#8e9fa1" />
        </g>
      )
    case 'tophat':
      return (
        <g>
          <ellipse cx="100" cy="42" rx="46" ry="7" fill="#111" />
          <rect x="72" y="6" width="56" height="36" rx="3" fill="#1a1a1a" />
          <rect x="72" y="32" width="56" height="5" fill="#7a0000" />
          <rect x="80" y="9" width="14" height="3" rx="1.5" fill="white" opacity="0.06" />
          <ellipse cx="100" cy="8" rx="26" ry="4" fill="#222" />
        </g>
      )
    case 'wizard':
      return (
        <g>
          <ellipse cx="100" cy="46" rx="50" ry="9" fill="#3d1a6b" />
          <path d="M 64 46 L 100 -16 L 136 46 Z" fill="#5b2d8e" />
          <path d="M 100 -16 Q 116 -10 122 0" stroke="#5b2d8e" strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="122" cy="0" r="3.5" fill="#FFD700" className="avatar-sparkle" />
          <circle cx="96" cy="14" r="1.8" fill="#FFD700" opacity="0.7" />
          <circle cx="110" cy="24" r="1.3" fill="#4FC3F7" opacity="0.6" />
          <circle cx="86" cy="30" r="1.5" fill="#FFD700" opacity="0.5" />
          <circle cx="114" cy="36" r="1" fill="#81C784" opacity="0.6" />
        </g>
      )
    case 'viking':
      return (
        <g>
          <path d="M 54 54 Q 56 26 100 18 Q 144 26 146 54 Q 138 42 100 36 Q 62 42 54 54 Z" fill="#8B8B8B" />
          <path d="M 52 54 Q 100 58 148 54" stroke="#6B6B6B" strokeWidth="3.5" fill="none" />
          <path d="M 98 54 L 100 74 L 102 54" fill="#6B6B6B" />
          <path d="M 50 48 Q 34 30 24 10" stroke="#F5DEB3" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 150 48 Q 166 30 176 10" stroke="#F5DEB3" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M 50 48 Q 32 28 22 6" stroke="#DAA520" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 150 48 Q 168 28 178 6" stroke="#DAA520" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'pirate':
      return (
        <g>
          <path d="M 50 50 Q 54 24 100 16 Q 146 24 150 50 Q 128 38 100 36 Q 72 38 50 50 Z" fill="#111" />
          <path d="M 48 50 Q 100 40 152 50 Q 153 54 150 54 Q 100 44 50 54 Q 47 54 48 50 Z" fill="#222" />
          <path d="M 56 50 L 42 44 Q 40 42 44 42 L 58 46" fill="#222" />
          <path d="M 144 50 L 158 44 Q 160 42 156 42 L 142 46" fill="#222" />
          <circle cx="100" cy="32" r="5.5" fill="white" opacity="0.85" />
          <circle cx="97" cy="31" r="1.3" fill="#111" />
          <circle cx="103" cy="31" r="1.3" fill="#111" />
          <path d="M 96 35 Q 100 37 104 35" stroke="#111" strokeWidth="0.7" fill="none" />
        </g>
      )
    case 'crown':
      return (
        <g className="avatar-sparkle">
          <rect x="68" y="34" width="64" height="15" rx="2" fill="#FFD700" />
          <polygon points="68,34 74,18 84,32 94,12 100,30 106,12 116,32 126,18 132,34" fill="#FFD700" />
          <circle cx="84" cy="24" r="2.5" fill="#FF6B6B" />
          <circle cx="100" cy="18" r="3" fill="#4FC3F7" />
          <circle cx="116" cy="24" r="2.5" fill="#81C784" />
          <rect x="70" y="36" width="60" height="3.5" rx="1" fill="#FFA000" opacity="0.4" />
          <rect x="74" y="38" width="10" height="1.5" rx="1" fill="white" opacity="0.12" />
        </g>
      )
    case 'santa':
      return (
        <g>
          <path d="M 58 52 Q 62 30 100 22 Q 128 18 146 6 Q 152 10 142 22 Q 124 28 140 48 Q 100 42 58 52 Z" fill="#c0392b" />
          <path d="M 56 52 Q 100 44 146 52" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" />
          <circle cx="148" cy="8" r="7" fill="white" />
          <circle cx="148" cy="8" r="4.5" fill="#f0f0f0" />
        </g>
      )
    case 'cowboy':
      return (
        <g>
          <ellipse cx="100" cy="46" rx="54" ry="9" fill="#8B6914" />
          <path d="M 70 46 Q 72 20 88 16 Q 100 24 112 16 Q 128 20 130 46" fill="#A0782C" />
          <path d="M 70 42 Q 100 36 130 42" stroke="#6B4E0A" strokeWidth="2.5" fill="none" />
          <ellipse cx="100" cy="18" rx="20" ry="4.5" fill="#A0782C" />
          <path d="M 82 30 Q 94 24 106 26" stroke="#C09840" strokeWidth="0.8" fill="none" opacity="0.25" />
        </g>
      )
    case 'catears':
      return (
        <g>
          <path d="M 58 54 Q 100 46 142 54" stroke="#333" strokeWidth="2.5" fill="none" />
          <path d="M 64 52 L 52 20 L 84 44 Z" fill="#333" />
          <path d="M 68 48 L 58 26 L 80 44 Z" fill="#FF9999" />
          <path d="M 136 52 L 148 20 L 116 44 Z" fill="#333" />
          <path d="M 132 48 L 142 26 L 120 44 Z" fill="#FF9999" />
        </g>
      )
    case 'helmet':
      return (
        <g>
          <path d="M 50 56 Q 52 22 100 14 Q 148 22 150 56" fill="#6B7280" stroke="#4B5563" strokeWidth="1.8" />
          <path d="M 62 56 L 62 72 Q 62 78 68 78 L 132 78 Q 138 78 138 72 L 138 56" fill="none" stroke="#4B5563" strokeWidth="1.8" />
          <rect x="68" y="72" width="64" height="4.5" rx="2" fill="#4B5563" opacity="0.4" />
          <path d="M 72 32 Q 90 22 108 24" stroke="white" strokeWidth="0.8" fill="none" opacity="0.08" />
        </g>
      )
    case 'fedora':
      return (
        <g>
          <ellipse cx="100" cy="46" rx="50" ry="8" fill="#3E2723" />
          <path d="M 64 46 Q 66 24 84 18 Q 100 24 116 18 Q 134 24 136 46" fill="#5D4037" />
          <ellipse cx="100" cy="20" rx="18" ry="5.5" fill="#5D4037" />
          <path d="M 74 40 Q 100 34 126 40" stroke="#2C1810" strokeWidth="2.5" fill="none" />
          <rect x="74" y="37" width="52" height="4.5" rx="2" fill="#1a1a1a" opacity="0.4" />
          <path d="M 84 26 Q 96 20 108 22" stroke="#795548" strokeWidth="0.8" fill="none" opacity="0.25" />
        </g>
      )
    case 'beret':
      return (
        <g>
          <path d="M 60 50 Q 58 32 82 22 Q 100 16 128 24 Q 146 30 142 50" fill="#c0392b" />
          <ellipse cx="100" cy="50" rx="42" ry="5.5" fill="#a93226" />
          <circle cx="100" cy="18" r="3.5" fill="#a93226" />
          <path d="M 78 30 Q 92 22 112 24" stroke="#e74c3c" strokeWidth="1.2" fill="none" opacity="0.2" />
        </g>
      )
    case 'partyhat':
      return (
        <g>
          <path d="M 72 50 L 100 -6 L 128 50 Z" fill="#9b59b6" />
          <path d="M 76 50 L 100 -2 L 124 50 Z" fill="none" stroke="#8e44ad" strokeWidth="0.8" />
          <line x1="80" y1="40" x2="100" y2="4" stroke="#FFD700" strokeWidth="1.2" opacity="0.4" />
          <line x1="120" y1="40" x2="100" y2="4" stroke="#e74c3c" strokeWidth="1.2" opacity="0.4" />
          <line x1="100" y1="50" x2="100" y2="-2" stroke="#4FC3F7" strokeWidth="1.2" opacity="0.4" />
          <circle cx="100" cy="-6" r="4.5" fill="#FFD700" className="avatar-sparkle" />
          <circle cx="87" cy="22" r="1.8" fill="#e74c3c" opacity="0.6" />
          <circle cx="110" cy="30" r="1.8" fill="#4FC3F7" opacity="0.6" />
          <circle cx="96" cy="36" r="1.3" fill="#81C784" opacity="0.6" />
        </g>
      )
    case 'bunnyears':
      return (
        <g>
          <path d="M 74 50 Q 70 14 64 -16 Q 62 -26 68 -26 Q 76 -24 78 -6 Q 82 14 80 50" fill="#FFB6C1" />
          <path d="M 76 44 Q 72 16 68 -12 Q 67 -18 70 -18 Q 74 -16 76 -4 Q 78 16 78 44" fill="#FF69B4" opacity="0.35" />
          <path d="M 126 50 Q 130 14 136 -16 Q 138 -26 132 -26 Q 124 -24 122 -6 Q 118 14 120 50" fill="#FFB6C1" />
          <path d="M 124 44 Q 128 16 132 -12 Q 133 -18 130 -18 Q 126 -16 124 -4 Q 122 16 122 44" fill="#FF69B4" opacity="0.35" />
        </g>
      )
    case 'chef':
      return (
        <g>
          <circle cx="82" cy="22" r="16" fill="white" />
          <circle cx="118" cy="22" r="16" fill="white" />
          <circle cx="100" cy="14" r="18" fill="white" />
          <circle cx="67" cy="30" r="12" fill="white" />
          <circle cx="133" cy="30" r="12" fill="white" />
          <rect x="60" y="38" width="80" height="12" rx="2" fill="white" />
          <rect x="62" y="46" width="76" height="3" fill="#e0e0e0" opacity="0.35" />
          <circle cx="94" cy="18" r="2.5" fill="#f5f5f5" opacity="0.35" />
        </g>
      )
    case 'astronaut':
      return (
        <g>
          <path d="M 50 60 Q 52 18 100 10 Q 148 18 150 60 Q 150 70 146 74 L 54 74 Q 50 70 50 60 Z" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="1.2" />
          <path d="M 58 60 Q 58 26 100 18 Q 142 26 142 60 Q 142 66 138 68 L 62 68 Q 58 66 58 60 Z" fill="#4FC3F7" opacity="0.2" />
          <path d="M 70 32 Q 86 22 106 26" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" strokeLinecap="round" />
          <rect x="92" y="68" width="16" height="7" rx="2" fill="#bdbdbd" />
        </g>
      )
    default:
      return null
  }
}

// ============= FRAME =============
function renderFrame(frameType, uid) {
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

// ============= EFFECT =============
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

// ============= ANIMATIONS =============
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
    transform-origin: center 82px;
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

// ============= MAIN COMPONENT =============
export default function AvatarRenderer({
  skinColor, hairColor, hairStyle, eyeType,
  eyebrows = 'none', mouth = 'smile', accessory = 'none', bgStyle = 'gray',
  hat = 'none', clothing = 'tshirt', clothingColor = '#374151', eyeColor = '#6B3A2A',
  bodyType = 'normal',
  size = 200, username, animated = false,
  equippedFrame, equippedEffect, equippedBackground, equippedHairColor, equippedAccessory,
}) {
  if (animated) injectStyles()

  const uid = `av-${++avatarCounter}`
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
      {renderBackground(finalBg, uid)}

      <defs>
        <clipPath id={`clip-${uid}`}>
          <circle cx="100" cy="100" r="98" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${uid})`}>
        {renderEffect(equippedEffect)}
        {renderHairBack(hairStyle, finalHairColor)}
        {renderBody(skinColor || '#F5D6B8', clothing, clothingColor, uid, bodyType)}
        {renderHead(skinColor, uid)}
        {renderEyebrows(eyebrows)}
        {renderEyes(eyeType || 'round', eyeColor, animated)}
        {renderNose()}
        {renderMouth(mouth)}
        {renderHairFront(hairStyle || 'short', finalHairColor, uid)}
        {renderAccessory(finalAccessory)}
        {renderHat(hat)}
      </g>

      {renderFrame(equippedFrame, uid)}
    </svg>
  )
}
