import { adjustColor, BODY_CONFIGS } from './avatarUtils'

// ============= BODY & CLOTHING =============
export default function renderBody(skinColor, clothing, clothingColor, uid, bodyType) {
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
