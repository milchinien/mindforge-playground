import mindcoinIcon from '../../assets/mindcoin-icon.png'
import mindcoinFull from '../../assets/mindcoin.png'

/**
 * MindCoin icon component using the custom logo.
 * Uses a pre-scaled 128x128 version for small sizes (better quality)
 * and the full 1024x1024 for large displays.
 */
export default function MindCoinIcon({ size, className = '' }) {
  const src = size && size > 64 ? mindcoinFull : mindcoinIcon

  return (
    <img
      src={src}
      alt="MindCoin"
      draggable={false}
      {...(size ? { width: size, height: size } : {})}
      className={`inline-block object-contain select-none ${className}`}
      style={{
        filter: 'hue-rotate(-15deg) saturate(1.3)',
      }}
    />
  )
}
