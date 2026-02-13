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
function renderBody(skinColor, clothing, clothingColor, uid) {
  const darkSkin = adjustColor(skinColor || '#F5D6B8', -25)
  const cColor = clothingColor || '#374151'
  const darkCloth = adjustColor(cColor, -35)

  const neckPath = 'M 88 124 Q 90 132 88 140 L 112 140 Q 110 132 112 124'
  const bodyPath = 'M 88 140 Q 62 148 38 168 Q 22 182 10 210 L 190 210 Q 178 182 162 168 Q 138 148 112 140 Z'

  let clothingDetail = null
  switch (clothing) {
    case 'hoodie':
      clothingDetail = (
        <>
          <path d="M 88 140 Q 100 150 112 140" stroke={darkCloth} strokeWidth="1.5" fill="none" />
          <line x1="100" y1="148" x2="100" y2="210" stroke={darkCloth} strokeWidth="1" opacity="0.3" />
          <line x1="93" y1="143" x2="90" y2="160" stroke={darkCloth} strokeWidth="1.5" opacity="0.6" />
          <line x1="107" y1="143" x2="110" y2="160" stroke={darkCloth} strokeWidth="1.5" opacity="0.6" />
          <path d="M 72 142 Q 68 130 70 122 Q 82 118 100 120 Q 118 118 130 122 Q 132 130 128 142"
                fill={adjustColor(cColor, -15)} opacity="0.4" />
        </>
      )
      break
    case 'jacket':
      clothingDetail = (
        <>
          <line x1="100" y1="142" x2="100" y2="210" stroke={darkCloth} strokeWidth="2" />
          <path d="M 88 140 L 94 152 L 100 144 L 106 152 L 112 140" fill="none" stroke={darkCloth} strokeWidth="1.5" />
        </>
      )
      break
    case 'tank':
      clothingDetail = (
        <path d="M 85 140 Q 100 148 115 140" stroke={darkCloth} strokeWidth="1" fill="none" />
      )
      break
    case 'suit':
      clothingDetail = (
        <>
          <line x1="100" y1="144" x2="100" y2="210" stroke={darkCloth} strokeWidth="1.5" />
          <path d="M 88 140 L 96 155 L 100 144 L 104 155 L 112 140" fill="none" stroke={darkCloth} strokeWidth="1.5" />
          <rect x="97" y="152" width="6" height="8" rx="1" fill={darkCloth} opacity="0.6" />
        </>
      )
      break
    default: // tshirt
      clothingDetail = (
        <path d="M 88 140 Q 100 148 112 140" stroke={darkCloth} strokeWidth="1.5" fill="none" />
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
        <radialGradient id={`skin-${uid}`} cx="45%" cy="38%" r="55%">
          <stop offset="0%" stopColor={adjustColor(skin, 12)} />
          <stop offset="75%" stopColor={skin} />
          <stop offset="100%" stopColor={adjustColor(skin, -18)} />
        </radialGradient>
      </defs>
      {/* Ears */}
      <ellipse cx="54" cy="82" rx="7" ry="10" fill={skin} />
      <ellipse cx="146" cy="82" rx="7" ry="10" fill={skin} />
      <ellipse cx="54" cy="82" rx="4" ry="6" fill={adjustColor(skin, -25)} opacity="0.25" />
      <ellipse cx="146" cy="82" rx="4" ry="6" fill={adjustColor(skin, -25)} opacity="0.25" />
      {/* Head */}
      <ellipse cx="100" cy="78" rx="44" ry="48" fill={`url(#skin-${uid})`} />
      {/* Subtle chin shadow */}
      <ellipse cx="100" cy="118" rx="28" ry="8" fill={adjustColor(skin, -20)} opacity="0.12" />
    </>
  )
}

// ============= EYES =============
function renderEyes(type, eyeColor, animated) {
  const blinkClass = animated ? 'avatar-blink' : ''
  const iris = eyeColor || '#6B3A2A'
  const irisDark = adjustColor(iris, -40)

  function eye(cx, cy, mirrorHighlight) {
    const hlX = mirrorHighlight ? cx + 2 : cx - 2
    switch (type) {
      case 'round':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="11" ry="11" fill="white" />
            <ellipse cx={cx} cy={cy} rx="11" ry="11" fill="none" stroke="#e0ddd8" strokeWidth="0.5" />
            <circle cx={cx} cy={cy + 1} r="7.5" fill={iris} />
            <circle cx={cx} cy={cy + 1} r="7.5" fill="none" stroke={irisDark} strokeWidth="0.5" />
            <circle cx={cx} cy={cy + 1} r="4" fill="#111" />
            <circle cx={hlX} cy={cy - 2} r="2.5" fill="white" opacity="0.9" />
            <circle cx={cx + (mirrorHighlight ? -2 : 2)} cy={cy + 3} r="1.2" fill="white" opacity="0.4" />
          </g>
        )
      case 'almond':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="13" ry="8" fill="white" />
            <ellipse cx={cx} cy={cy} rx="13" ry="8" fill="none" stroke="#e0ddd8" strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r="6.5" fill={iris} />
            <circle cx={cx} cy={cy} r="6.5" fill="none" stroke={irisDark} strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r="3.5" fill="#111" />
            <circle cx={hlX} cy={cy - 2} r="2" fill="white" opacity="0.9" />
            <circle cx={cx + (mirrorHighlight ? -1 : 1)} cy={cy + 2} r="1" fill="white" opacity="0.4" />
          </g>
        )
      case 'sleepy':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="12" ry="6" fill="white" />
            <ellipse cx={cx} cy={cy - 1} rx="12" ry="4" fill={adjustColor('#F5D6B8', -5)} opacity="0.6" />
            <circle cx={cx} cy={cy + 1} r="5" fill={iris} />
            <circle cx={cx} cy={cy + 1} r="2.5" fill="#111" />
            <circle cx={hlX} cy={cy - 1} r="1.5" fill="white" opacity="0.7" />
          </g>
        )
      case 'cat':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="13" ry="7" fill="white" />
            <ellipse cx={cx} cy={cy} rx="13" ry="7" fill="none" stroke="#e0ddd8" strokeWidth="0.5" />
            <ellipse cx={cx} cy={cy} rx="4" ry="6.5" fill={iris} />
            <ellipse cx={cx} cy={cy} rx="1.5" ry="5" fill="#111" />
            <circle cx={hlX} cy={cy - 2} r="1.8" fill="white" opacity="0.8" />
          </g>
        )
      case 'wide':
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="11" ry="13" fill="white" />
            <ellipse cx={cx} cy={cy} rx="11" ry="13" fill="none" stroke="#e0ddd8" strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r="8" fill={iris} />
            <circle cx={cx} cy={cy} r="8" fill="none" stroke={irisDark} strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r="4.5" fill="#111" />
            <circle cx={hlX} cy={cy - 3} r="3" fill="white" opacity="0.9" />
            <circle cx={cx + (mirrorHighlight ? -2 : 2)} cy={cy + 3} r="1.5" fill="white" opacity="0.4" />
          </g>
        )
      default:
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx="11" ry="11" fill="white" />
            <circle cx={cx} cy={cy + 1} r="7.5" fill={iris} />
            <circle cx={cx} cy={cy + 1} r="4" fill="#111" />
            <circle cx={hlX} cy={cy - 2} r="2.5" fill="white" opacity="0.9" />
          </g>
        )
    }
  }

  return (
    <g className={blinkClass}>
      {eye(80, 80, false)}
      {eye(120, 80, true)}
    </g>
  )
}

// ============= EYEBROWS =============
function renderEyebrows(type) {
  switch (type) {
    case 'normal':
      return (
        <>
          <path d="M 68 67 Q 80 62 92 67" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 108 67 Q 120 62 132 67" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )
    case 'thick':
      return (
        <>
          <path d="M 66 68 Q 80 60 94 68" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 106 68 Q 120 60 134 68" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'arched':
      return (
        <>
          <path d="M 68 70 Q 76 60 92 66" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 132 70 Q 124 60 108 66" stroke="#555" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )
    case 'angry':
      return (
        <>
          <path d="M 68 64 Q 80 68 92 64" stroke="#444" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 108 64 Q 120 68 132 64" stroke="#444" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )
    case 'thin':
      return (
        <>
          <path d="M 70 67 Q 80 64 90 67" stroke="#666" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 110 67 Q 120 64 130 67" stroke="#666" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
      <ellipse cx="100" cy="98" rx="4" ry="3" fill="rgba(0,0,0,0.06)" />
      <path d="M 96 96 Q 100 101 104 96" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="97" cy="98" r="1.2" fill="rgba(0,0,0,0.04)" />
      <circle cx="103" cy="98" r="1.2" fill="rgba(0,0,0,0.04)" />
    </>
  )
}

// ============= MOUTH =============
function renderMouth(type) {
  switch (type) {
    case 'smile':
      return (
        <g>
          <path d="M 85 110 Q 100 122 115 110" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 88 111 Q 100 118 112 111" fill="#e74c3c" opacity="0.3" />
        </g>
      )
    case 'neutral':
      return (
        <path d="M 88 112 Q 100 114 112 112" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )
    case 'open':
      return (
        <g>
          <ellipse cx="100" cy="113" rx="10" ry="7" fill="#8b1a1a" />
          <ellipse cx="100" cy="116" rx="7" ry="3" fill="#e74c3c" opacity="0.5" />
          <path d="M 90 112 Q 100 108 110 112" stroke="#c0392b" strokeWidth="1.5" fill="none" />
        </g>
      )
    case 'smirk':
      return (
        <path d="M 88 112 Q 100 112 115 107" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )
    case 'grin':
      return (
        <g>
          <path d="M 82 108 Q 100 125 118 108" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 86 110 Q 100 120 114 110" fill="white" opacity="0.8" />
        </g>
      )
    default:
      return (
        <path d="M 85 110 Q 100 122 115 110" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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
          <path d="M 50 75 Q 44 110 38 150 Q 36 162 46 155 Q 48 125 52 90 Z" fill={c} />
          <path d="M 150 75 Q 156 110 162 150 Q 164 162 154 155 Q 152 125 148 90 Z" fill={c} />
        </g>
      )
    case 'braids':
      return (
        <g>
          <path d="M 55 70 Q 48 95 42 120 Q 38 135 42 140 Q 46 135 44 120 Q 48 100 52 80 Z" fill={c} />
          <path d="M 145 70 Q 152 95 158 120 Q 162 135 158 140 Q 154 135 156 120 Q 152 100 148 80 Z" fill={c} />
          <circle cx="42" cy="142" r="4" fill={c} />
          <circle cx="158" cy="142" r="4" fill={c} />
        </g>
      )
    case 'afro':
      return (
        <g opacity="0.9">
          <circle cx="50" cy="70" r="12" fill={c} />
          <circle cx="150" cy="70" r="12" fill={c} />
          <circle cx="42" cy="90" r="10" fill={c} />
          <circle cx="158" cy="90" r="10" fill={c} />
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
          <path d="M 56 78 Q 56 34 100 28 Q 144 34 144 78 Q 140 52 100 44 Q 60 52 56 78 Z" fill={c} />
          <path d="M 72 48 Q 90 36 108 38" stroke={highlight} strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />
        </g>
      )
    case 'long':
      return (
        <g className={hoverClass}>
          <path d="M 56 78 Q 56 32 100 25 Q 144 32 144 78 Q 140 50 100 42 Q 60 50 56 78 Z" fill={c} />
          <path d="M 53 78 Q 50 90 48 100" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 147 78 Q 150 90 152 100" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 70 45 Q 90 33 110 36" stroke={highlight} strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
        </g>
      )
    case 'curly':
      return (
        <g className={hoverClass}>
          <circle cx="60" cy="46" r="17" fill={c} />
          <circle cx="88" cy="36" r="17" fill={c} />
          <circle cx="112" cy="36" r="17" fill={c} />
          <circle cx="140" cy="46" r="17" fill={c} />
          <circle cx="48" cy="66" r="13" fill={c} />
          <circle cx="152" cy="66" r="13" fill={c} />
          <circle cx="58" cy="42" r="4" fill={highlight} opacity="0.15" />
          <circle cx="86" cy="32" r="4" fill={highlight} opacity="0.15" />
          <circle cx="114" cy="32" r="4" fill={highlight} opacity="0.15" />
        </g>
      )
    case 'buzz':
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 58 38 100 32 Q 142 38 142 78 Q 138 52 100 44 Q 62 52 58 78 Z"
                fill={c} opacity="0.55" />
        </g>
      )
    case 'ponytail':
      return (
        <g className={hoverClass}>
          <path d="M 56 78 Q 56 34 100 28 Q 144 34 144 78 Q 140 52 100 44 Q 60 52 56 78 Z" fill={c} />
          <ellipse cx="100" cy="22" rx="16" ry="10" fill={c} />
          <path d="M 100 22 Q 106 10 118 4 Q 120 12 110 20" fill={c} />
          <circle cx="112" cy="6" r="3" fill={c} />
        </g>
      )
    case 'mohawk':
      return (
        <g className={hoverClass}>
          <path d="M 86 68 Q 86 18 100 6 Q 114 18 114 68 Q 110 40 100 28 Q 90 40 86 68 Z" fill={c} />
          <path d="M 96 30 Q 100 16 104 30" stroke={highlight} strokeWidth="1.5" fill="none" opacity="0.2" />
        </g>
      )
    case 'messy':
      return (
        <g className={hoverClass}>
          <path d="M 54 78 Q 52 38 100 26 Q 148 38 146 78 Q 142 48 100 40 Q 58 48 54 78 Z" fill={c} />
          <path d="M 60 50 L 52 38 Q 56 44 62 46" fill={c} />
          <path d="M 140 50 L 148 38 Q 144 44 138 46" fill={c} />
          <path d="M 85 38 L 80 24 Q 84 32 88 36" fill={c} />
          <path d="M 115 38 L 120 24 Q 116 32 112 36" fill={c} />
          <path d="M 100 34 L 98 20 Q 102 28 102 34" fill={c} />
        </g>
      )
    case 'bob':
      return (
        <g className={hoverClass}>
          <path d="M 56 78 Q 56 34 100 28 Q 144 34 144 78 Q 140 50 100 42 Q 60 50 56 78 Z" fill={c} />
          <path d="M 54 78 Q 50 100 52 112 Q 54 116 58 112 Q 56 100 56 82 Z" fill={c} />
          <path d="M 146 78 Q 150 100 148 112 Q 146 116 142 112 Q 144 100 144 82 Z" fill={c} />
          <path d="M 70 46 Q 88 34 106 37" stroke={highlight} strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
        </g>
      )
    case 'spiky':
      return (
        <g className={hoverClass}>
          <path d="M 60 68 L 50 28 Q 58 42 68 48 L 65 16 Q 72 36 80 42 L 82 8 Q 88 30 94 40 L 100 4 Q 106 30 112 40 L 118 8 Q 122 30 128 42 L 135 16 Q 138 36 142 48 L 150 28 Q 148 52 140 68 Q 130 50 100 44 Q 70 50 60 68 Z"
              fill={c} />
          <path d="M 88 28 Q 95 14 102 28" stroke={highlight} strokeWidth="1.5" fill="none" opacity="0.2" />
        </g>
      )
    case 'braids':
      return (
        <g className={hoverClass}>
          <path d="M 56 78 Q 56 34 100 28 Q 144 34 144 78 Q 140 50 100 42 Q 60 50 56 78 Z" fill={c} />
          <path d="M 72 46 Q 88 35 106 37" stroke={highlight} strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
        </g>
      )
    case 'afro':
      return (
        <g className={hoverClass}>
          <circle cx="100" cy="42" r="48" fill={c} />
          <circle cx="60" cy="60" r="22" fill={c} />
          <circle cx="140" cy="60" r="22" fill={c} />
          <circle cx="100" cy="14" r="18" fill={c} />
          <circle cx="70" cy="24" r="16" fill={c} />
          <circle cx="130" cy="24" r="16" fill={c} />
          <circle cx="78" cy="34" r="6" fill={highlight} opacity="0.12" />
          <circle cx="112" cy="22" r="4" fill={highlight} opacity="0.1" />
        </g>
      )
    case 'pixie':
      return (
        <g className={hoverClass}>
          <path d="M 58 78 Q 60 38 100 30 Q 140 38 142 78 Q 138 54 100 46 Q 62 54 58 78 Z" fill={c} />
          <path d="M 56 70 Q 48 58 44 68 Q 42 76 52 78" fill={c} />
          <path d="M 74 46 Q 88 36 104 38" stroke={highlight} strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />
        </g>
      )
    case 'sidepart':
      return (
        <g className={hoverClass}>
          <path d="M 56 78 Q 56 34 100 28 Q 144 34 144 78 Q 140 52 100 44 Q 60 52 56 78 Z" fill={c} />
          <path d="M 56 66 Q 52 50 68 38 Q 84 30 100 28" stroke={c} strokeWidth="10" fill="none" />
          <path d="M 54 72 Q 46 58 42 72 Q 40 82 50 80" fill={c} />
          <path d="M 68 42 Q 82 32 96 34" stroke={highlight} strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
        </g>
      )
    case 'undercut':
      return (
        <g className={hoverClass}>
          <path d="M 70 78 Q 72 42 100 34 Q 128 42 130 78 Q 126 54 100 48 Q 74 54 70 78 Z" fill={c} />
          <path d="M 58 78 Q 60 56 70 50" stroke={c} strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M 142 78 Q 140 56 130 50" stroke={c} strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M 82 46 Q 95 36 110 40" stroke={highlight} strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />
        </g>
      )
    default:
      return (
        <g className={hoverClass}>
          <path d="M 56 78 Q 56 34 100 28 Q 144 34 144 78 Q 140 52 100 44 Q 60 52 56 78 Z" fill={c} />
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
          <circle cx="80" cy="80" r="14" stroke="#666" strokeWidth="2" fill="none" />
          <circle cx="120" cy="80" r="14" stroke="#666" strokeWidth="2" fill="none" />
          <path d="M 94 80 L 106 80" stroke="#666" strokeWidth="2" />
          <path d="M 66 80 L 54 76" stroke="#666" strokeWidth="2" />
          <path d="M 134 80 L 146 76" stroke="#666" strokeWidth="2" />
        </g>
      )
    case 'sunglasses':
      return (
        <g>
          <rect x="64" y="72" width="30" height="18" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
          <rect x="106" y="72" width="30" height="18" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
          <path d="M 94 80 L 106 80" stroke="#333" strokeWidth="2" />
          <path d="M 64 78 L 54 74" stroke="#333" strokeWidth="2" />
          <path d="M 136 78 L 146 74" stroke="#333" strokeWidth="2" />
          <rect x="67" y="74" width="10" height="3" rx="1" fill="white" opacity="0.15" />
          <rect x="109" y="74" width="10" height="3" rx="1" fill="white" opacity="0.15" />
        </g>
      )
    case 'earring':
      return (
        <g>
          <circle cx="46" cy="92" r="3.5" fill="#FFD700" />
          <circle cx="46" cy="92" r="2" fill="#FFA000" />
        </g>
      )
    case 'headphones':
      return (
        <g>
          <path d="M 48 74 Q 48 40 100 34 Q 152 40 152 74" stroke="#333" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="40" y="68" width="14" height="22" rx="5" fill="#444" stroke="#333" strokeWidth="1" />
          <rect x="146" y="68" width="14" height="22" rx="5" fill="#444" stroke="#333" strokeWidth="1" />
          <rect x="43" y="72" width="8" height="14" rx="3" fill="#555" />
          <rect x="149" y="72" width="8" height="14" rx="3" fill="#555" />
        </g>
      )
    case 'mask':
      return (
        <g>
          <path d="M 70 92 Q 72 105 80 112 Q 90 118 100 120 Q 110 118 120 112 Q 128 105 130 92 Q 100 88 70 92 Z"
                fill="#2c2c2c" />
          <path d="M 75 96 Q 100 92 125 96" stroke="#444" strokeWidth="1" fill="none" />
          <path d="M 78 100 Q 100 96 122 100" stroke="#444" strokeWidth="1" fill="none" />
          <path d="M 82 104 Q 100 100 118 104" stroke="#444" strokeWidth="1" fill="none" />
        </g>
      )
    case 'scarf':
      return (
        <g>
          <path d="M 78 118 Q 75 128 72 140 Q 68 150 82 148 Q 88 140 90 128 Q 92 120 100 118 Q 108 120 110 128 Q 112 140 118 148 Q 132 150 128 140 Q 125 128 122 118"
                fill="#e74c3c" stroke="#c0392b" strokeWidth="1" />
          <path d="M 78 126 Q 100 122 122 126" stroke="#c0392b" strokeWidth="1.5" fill="none" opacity="0.5" />
        </g>
      )
    case 'monocle':
      return (
        <g>
          <circle cx="120" cy="80" r="15" stroke="#FFD700" strokeWidth="2" fill="none" />
          <circle cx="120" cy="80" r="13" stroke="#DAA520" strokeWidth="0.5" fill="rgba(255,255,255,0.05)" />
          <path d="M 135 80 Q 142 86 146 100 Q 148 110 144 118" stroke="#FFD700" strokeWidth="1.2" fill="none" />
          <circle cx="120" cy="74" r="2" fill="white" opacity="0.3" />
        </g>
      )
    case 'bowtie':
      return (
        <g>
          <path d="M 84 134 L 96 128 L 96 140 Z" fill="#c0392b" />
          <path d="M 116 134 L 104 128 L 104 140 Z" fill="#c0392b" />
          <circle cx="100" cy="134" r="3.5" fill="#e74c3c" />
          <circle cx="100" cy="134" r="2" fill="#a93226" />
        </g>
      )
    case 'bandana':
      return (
        <g>
          <path d="M 56 60 Q 56 48 100 42 Q 144 48 144 60 Q 140 52 100 48 Q 60 52 56 60 Z" fill="#e74c3c" />
          <path d="M 56 60 Q 100 56 144 60" stroke="#c0392b" strokeWidth="2" fill="none" />
          <circle cx="100" cy="44" r="2" fill="#c0392b" />
          <path d="M 54 60 L 46 70 Q 44 74 48 72 L 56 64" fill="#e74c3c" />
          <path d="M 146 60 L 154 70 Q 156 74 152 72 L 144 64" fill="#e74c3c" />
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
          <path d="M 58 48 Q 58 24 100 18 Q 142 24 142 48 Q 132 36 100 30 Q 68 36 58 48 Z" fill="#2c3e50" />
          <path d="M 56 48 Q 80 46 120 56 Q 140 60 138 52 Q 120 44 56 48 Z" fill="#1a252f" />
          <circle cx="100" cy="20" r="3" fill="#1a252f" />
          <path d="M 72 36 Q 90 26 108 28" stroke="white" strokeWidth="1" fill="none" opacity="0.12" strokeLinecap="round" />
        </g>
      )
    case 'beanie':
      return (
        <g>
          <path d="M 56 50 Q 56 18 100 10 Q 144 18 144 50 Q 136 42 100 38 Q 64 42 56 50 Z" fill="#7f8c8d" />
          <path d="M 54 50 Q 100 44 146 50" stroke="#6c7a7d" strokeWidth="4" fill="none" />
          <path d="M 76 48 L 76 22" stroke="#6c7a7d" strokeWidth="0.8" opacity="0.3" />
          <path d="M 100 46 L 100 12" stroke="#6c7a7d" strokeWidth="0.8" opacity="0.3" />
          <path d="M 124 48 L 124 22" stroke="#6c7a7d" strokeWidth="0.8" opacity="0.3" />
          <circle cx="100" cy="10" r="5" fill="#8e9fa1" />
        </g>
      )
    case 'tophat':
      return (
        <g>
          <ellipse cx="100" cy="40" rx="48" ry="8" fill="#111" />
          <rect x="70" y="2" width="60" height="38" rx="3" fill="#1a1a1a" />
          <rect x="70" y="30" width="60" height="6" fill="#8b0000" />
          <rect x="78" y="5" width="16" height="3" rx="1.5" fill="white" opacity="0.08" />
          <ellipse cx="100" cy="4" rx="28" ry="4" fill="#222" />
        </g>
      )
    case 'wizard':
      return (
        <g>
          <ellipse cx="100" cy="44" rx="52" ry="10" fill="#3d1a6b" />
          <path d="M 62 44 L 100 -20 L 138 44 Z" fill="#5b2d8e" />
          <path d="M 100 -20 Q 118 -14 125 -2" stroke="#5b2d8e" strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx="125" cy="-2" r="4" fill="#FFD700" className="avatar-sparkle" />
          <circle cx="95" cy="10" r="2" fill="#FFD700" opacity="0.8" />
          <circle cx="110" cy="22" r="1.5" fill="#4FC3F7" opacity="0.7" />
          <circle cx="85" cy="28" r="1.8" fill="#FFD700" opacity="0.6" />
          <circle cx="115" cy="35" r="1.2" fill="#81C784" opacity="0.7" />
        </g>
      )
    case 'viking':
      return (
        <g>
          <path d="M 52 52 Q 52 22 100 14 Q 148 22 148 52 Q 140 40 100 34 Q 60 40 52 52 Z" fill="#8B8B8B" />
          <path d="M 50 52 Q 100 58 150 52" stroke="#6B6B6B" strokeWidth="4" fill="none" />
          <path d="M 98 52 L 100 75 L 102 52" fill="#6B6B6B" />
          <path d="M 48 46 Q 32 28 22 6" stroke="#F5DEB3" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 152 46 Q 168 28 178 6" stroke="#F5DEB3" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 48 46 Q 30 26 20 2" stroke="#DAA520" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 152 46 Q 170 26 180 2" stroke="#DAA520" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'pirate':
      return (
        <g>
          <path d="M 48 48 Q 52 20 100 12 Q 148 20 152 48 Q 130 36 100 34 Q 70 36 48 48 Z" fill="#111" />
          <path d="M 46 48 Q 100 38 154 48 Q 155 52 152 52 Q 100 42 48 52 Q 45 52 46 48 Z" fill="#222" />
          <path d="M 54 48 L 40 42 Q 38 40 42 40 L 56 44" fill="#222" />
          <path d="M 146 48 L 160 42 Q 162 40 158 40 L 144 44" fill="#222" />
          <circle cx="100" cy="30" r="6" fill="white" opacity="0.9" />
          <circle cx="97" cy="29" r="1.5" fill="#111" />
          <circle cx="103" cy="29" r="1.5" fill="#111" />
          <path d="M 95 33 Q 100 35 105 33" stroke="#111" strokeWidth="0.8" fill="none" />
          <path d="M 90 34 L 92 38 L 88 38 Z" fill="white" opacity="0.8" />
          <path d="M 110 34 L 108 38 L 112 38 Z" fill="white" opacity="0.8" />
        </g>
      )
    case 'crown':
      return (
        <g className="avatar-sparkle">
          <rect x="66" y="32" width="68" height="16" rx="2" fill="#FFD700" />
          <polygon points="66,32 72,14 82,30 92,8 100,28 108,8 118,30 128,14 134,32" fill="#FFD700" />
          <circle cx="82" cy="22" r="3" fill="#FF6B6B" />
          <circle cx="100" cy="14" r="3.5" fill="#4FC3F7" />
          <circle cx="118" cy="22" r="3" fill="#81C784" />
          <rect x="68" y="34" width="64" height="4" rx="1" fill="#FFA000" opacity="0.5" />
          <rect x="72" y="36" width="12" height="2" rx="1" fill="white" opacity="0.15" />
        </g>
      )
    case 'santa':
      return (
        <g>
          <path d="M 56 50 Q 60 28 100 18 Q 130 14 148 2 Q 155 6 145 18 Q 125 24 142 46 Q 100 40 56 50 Z" fill="#c0392b" />
          <path d="M 54 50 Q 100 42 148 50" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx="150" cy="4" r="8" fill="white" />
          <circle cx="150" cy="4" r="5" fill="#f0f0f0" />
        </g>
      )
    case 'cowboy':
      return (
        <g>
          <ellipse cx="100" cy="44" rx="56" ry="10" fill="#8B6914" />
          <path d="M 68 44 Q 70 16 86 12 Q 100 22 114 12 Q 130 16 132 44" fill="#A0782C" />
          <path d="M 68 40 Q 100 34 132 40" stroke="#6B4E0A" strokeWidth="3" fill="none" />
          <ellipse cx="100" cy="14" rx="22" ry="5" fill="#A0782C" />
          <path d="M 80 28 Q 92 22 104 24" stroke="#C09840" strokeWidth="1" fill="none" opacity="0.3" />
        </g>
      )
    case 'catears':
      return (
        <g>
          <path d="M 55 52 Q 100 44 145 52" stroke="#222" strokeWidth="3" fill="none" />
          <path d="M 62 50 L 50 16 L 82 42 Z" fill="#222" />
          <path d="M 66 46 L 56 22 L 78 42 Z" fill="#FF9999" />
          <path d="M 138 50 L 150 16 L 118 42 Z" fill="#222" />
          <path d="M 134 46 L 144 22 L 122 42 Z" fill="#FF9999" />
        </g>
      )
    case 'helmet':
      return (
        <g>
          <path d="M 48 55 Q 48 18 100 10 Q 152 18 152 55" fill="#6B7280" stroke="#4B5563" strokeWidth="2" />
          <path d="M 60 55 L 60 72 Q 60 78 66 78 L 134 78 Q 140 78 140 72 L 140 55" fill="none" stroke="#4B5563" strokeWidth="2" />
          <rect x="66" y="70" width="68" height="5" rx="2" fill="#4B5563" opacity="0.5" />
          <path d="M 70 30 Q 90 18 110 22" stroke="white" strokeWidth="1" fill="none" opacity="0.1" />
        </g>
      )
    case 'fedora':
      return (
        <g>
          <ellipse cx="100" cy="44" rx="52" ry="9" fill="#3E2723" />
          <path d="M 62 44 Q 64 22 82 14 Q 100 20 118 14 Q 136 22 138 44" fill="#5D4037" />
          <ellipse cx="100" cy="16" rx="20" ry="6" fill="#5D4037" />
          <path d="M 72 38 Q 100 32 128 38" stroke="#2C1810" strokeWidth="3" fill="none" />
          <rect x="72" y="35" width="56" height="5" rx="2" fill="#1a1a1a" opacity="0.5" />
          <path d="M 82 24 Q 95 18 108 20" stroke="#795548" strokeWidth="1" fill="none" opacity="0.3" />
        </g>
      )
    case 'beret':
      return (
        <g>
          <path d="M 58 48 Q 56 30 80 18 Q 100 12 130 20 Q 148 28 144 48" fill="#c0392b" />
          <ellipse cx="100" cy="48" rx="44" ry="6" fill="#a93226" />
          <circle cx="100" cy="14" r="4" fill="#a93226" />
          <path d="M 76 28 Q 90 18 110 22" stroke="#e74c3c" strokeWidth="1.5" fill="none" opacity="0.25" />
        </g>
      )
    case 'partyhat':
      return (
        <g>
          <path d="M 70 48 L 100 -10 L 130 48 Z" fill="#9b59b6" />
          <path d="M 74 48 L 100 -6 L 126 48 Z" fill="none" stroke="#8e44ad" strokeWidth="1" />
          <line x1="78" y1="38" x2="100" y2="0" stroke="#FFD700" strokeWidth="1.5" opacity="0.5" />
          <line x1="122" y1="38" x2="100" y2="0" stroke="#e74c3c" strokeWidth="1.5" opacity="0.5" />
          <line x1="100" y1="48" x2="100" y2="-6" stroke="#4FC3F7" strokeWidth="1.5" opacity="0.5" />
          <circle cx="100" cy="-10" r="5" fill="#FFD700" className="avatar-sparkle" />
          <circle cx="85" cy="20" r="2" fill="#e74c3c" opacity="0.7" />
          <circle cx="110" cy="28" r="2" fill="#4FC3F7" opacity="0.7" />
          <circle cx="95" cy="34" r="1.5" fill="#81C784" opacity="0.7" />
        </g>
      )
    case 'bunnyears':
      return (
        <g>
          <path d="M 72 48 Q 68 10 62 -20 Q 60 -30 66 -30 Q 74 -28 76 -10 Q 80 10 78 48" fill="#FFB6C1" />
          <path d="M 74 42 Q 70 12 66 -16 Q 65 -22 68 -22 Q 72 -20 74 -8 Q 76 12 76 42" fill="#FF69B4" opacity="0.4" />
          <path d="M 128 48 Q 132 10 138 -20 Q 140 -30 134 -30 Q 126 -28 124 -10 Q 120 10 122 48" fill="#FFB6C1" />
          <path d="M 126 42 Q 130 12 134 -16 Q 135 -22 132 -22 Q 128 -20 126 -8 Q 124 12 124 42" fill="#FF69B4" opacity="0.4" />
        </g>
      )
    case 'chef':
      return (
        <g>
          <circle cx="80" cy="18" r="18" fill="white" />
          <circle cx="120" cy="18" r="18" fill="white" />
          <circle cx="100" cy="10" r="20" fill="white" />
          <circle cx="65" cy="28" r="14" fill="white" />
          <circle cx="135" cy="28" r="14" fill="white" />
          <rect x="58" y="36" width="84" height="14" rx="2" fill="white" />
          <rect x="60" y="44" width="80" height="4" fill="#e0e0e0" opacity="0.4" />
          <circle cx="92" cy="14" r="3" fill="#f5f5f5" opacity="0.4" />
        </g>
      )
    case 'astronaut':
      return (
        <g>
          <path d="M 48 58 Q 48 14 100 6 Q 152 14 152 58 Q 152 70 148 74 L 52 74 Q 48 70 48 58 Z" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="1.5" />
          <path d="M 56 58 Q 56 22 100 14 Q 144 22 144 58 Q 144 66 140 68 L 60 68 Q 56 66 56 58 Z" fill="#4FC3F7" opacity="0.25" />
          <path d="M 68 30 Q 85 20 105 24" stroke="white" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
          <rect x="90" y="68" width="20" height="8" rx="2" fill="#bdbdbd" />
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
    transform-origin: center 80px;
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
        {renderBody(skinColor || '#F5D6B8', clothing, clothingColor, uid)}
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
