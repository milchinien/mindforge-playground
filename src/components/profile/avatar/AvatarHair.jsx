import { adjustColor } from './avatarUtils'

// ============= HAIR (BACK LAYER) =============
export function renderHairBack(style, color) {
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
export function renderHairFront(style, color, uid) {
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
