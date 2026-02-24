// ============= ACCESSORY =============
export default function renderAccessory(type) {
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
