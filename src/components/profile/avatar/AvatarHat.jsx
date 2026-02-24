// ============= HATS =============
export default function renderHat(type) {
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
