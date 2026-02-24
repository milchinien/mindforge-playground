// ============= EFFECT =============
export function renderEffect(effectType) {
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
export function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.textContent = animationStyles
  document.head.appendChild(style)
  styleInjected = true
}
