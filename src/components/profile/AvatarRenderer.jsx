import { getInitials } from './avatar/avatarUtils'
import renderBackground from './avatar/AvatarBackground'
import renderBody from './avatar/AvatarBody'
import { renderHead, renderEyes, renderEyebrows, renderNose, renderMouth } from './avatar/AvatarHead'
import { renderHairBack, renderHairFront } from './avatar/AvatarHair'
import renderAccessory from './avatar/AvatarAccessory'
import renderHat from './avatar/AvatarHat'
import renderFrame from './avatar/AvatarFrame'
import { renderEffect, injectStyles } from './avatar/AvatarEffects'

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
