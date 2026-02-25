// ──────────── PREMIUM THEMES ────────────

export const PREMIUM_THEMES = [
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Futuristisches Neon-Design mit leuchtenden Cyan- und Pink-Akzenten',
    primaryColor: '#00e5ff',
    accentColor: '#ff0090',
    bgGradient: 'from-cyan-900/40 via-bg-secondary to-pink-900/40',
    previewColors: ['#00e5ff', '#ff0090', '#0d0d2b', '#1a1a3e'],
    previewDescription: 'Dunkler Hintergrund mit leuchtenden Neon-Akzenten in Cyan und Pink',
    price: 500,
    rarity: 'epic',
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    description: 'Elegantes koenigliches Design mit Gold- und tiefem Purpur-Akzent',
    primaryColor: '#ffd700',
    accentColor: '#7b2d8e',
    bgGradient: 'from-yellow-900/30 via-bg-secondary to-purple-900/30',
    previewColors: ['#ffd700', '#7b2d8e', '#1a1020', '#2d1b3d'],
    previewDescription: 'Dunkler Purpur-Hintergrund mit goldenen Akzenten und royalem Flair',
    price: 750,
    rarity: 'legendary',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natuerliches Wald-Design mit beruhigenden Gruen- und Erdtoenen',
    primaryColor: '#4caf50',
    accentColor: '#8d6e63',
    bgGradient: 'from-green-900/30 via-bg-secondary to-amber-900/20',
    previewColors: ['#4caf50', '#8d6e63', '#0d1a0d', '#1a2e1a'],
    previewDescription: 'Dunkler Waldhintergrund mit gruenen und braunen Erdtoenen',
    price: 500,
    rarity: 'epic',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Tiefes Ozean-Design mit fliessenden Blau- und Teal-Gradienten',
    primaryColor: '#0288d1',
    accentColor: '#00897b',
    bgGradient: 'from-blue-900/30 via-bg-secondary to-teal-900/30',
    previewColors: ['#0288d1', '#00897b', '#0a1628', '#0d2137'],
    previewDescription: 'Tiefblauer Hintergrund mit Teal-Akzenten wie der tiefe Ozean',
    price: 500,
    rarity: 'epic',
  },
]

// ──────────── ANIMATED PROFILE FRAMES ────────────

export const PROFILE_FRAMES = [
  {
    id: 'glowing',
    name: 'Leuchtender Rahmen',
    description: 'Ein sanft leuchtender Rahmen um dein Profilbild',
    price: 300,
    rarity: 'epic',
    cssClass: 'frame-glowing',
    animation: `
      @keyframes frame-glow {
        0%, 100% { box-shadow: 0 0 8px 2px rgba(99, 102, 241, 0.6), 0 0 20px 4px rgba(99, 102, 241, 0.2); }
        50% { box-shadow: 0 0 16px 4px rgba(99, 102, 241, 0.8), 0 0 32px 8px rgba(99, 102, 241, 0.3); }
      }
    `,
    style: {
      animation: 'frame-glow 2s ease-in-out infinite',
      borderRadius: '50%',
    },
  },
  {
    id: 'pulsing',
    name: 'Pulsierender Rahmen',
    description: 'Ein dynamisch pulsierender Rahmen mit Farbwechsel',
    price: 400,
    rarity: 'epic',
    cssClass: 'frame-pulsing',
    animation: `
      @keyframes frame-pulse {
        0%, 100% { box-shadow: 0 0 10px 3px rgba(236, 72, 153, 0.6); border-color: rgba(236, 72, 153, 0.8); }
        33% { box-shadow: 0 0 10px 3px rgba(168, 85, 247, 0.6); border-color: rgba(168, 85, 247, 0.8); }
        66% { box-shadow: 0 0 10px 3px rgba(59, 130, 246, 0.6); border-color: rgba(59, 130, 246, 0.8); }
      }
    `,
    style: {
      animation: 'frame-pulse 3s ease-in-out infinite',
      border: '3px solid rgba(236, 72, 153, 0.8)',
      borderRadius: '50%',
    },
  },
  {
    id: 'rainbow',
    name: 'Regenbogen-Rahmen',
    description: 'Ein spektakulaerer Rahmen mit rotierenden Regenbogenfarben',
    price: 600,
    rarity: 'legendary',
    cssClass: 'frame-rainbow',
    animation: `
      @keyframes frame-rainbow {
        0% { border-color: #ff0000; box-shadow: 0 0 12px 3px rgba(255, 0, 0, 0.4); }
        16% { border-color: #ff8800; box-shadow: 0 0 12px 3px rgba(255, 136, 0, 0.4); }
        33% { border-color: #ffff00; box-shadow: 0 0 12px 3px rgba(255, 255, 0, 0.4); }
        50% { border-color: #00ff00; box-shadow: 0 0 12px 3px rgba(0, 255, 0, 0.4); }
        66% { border-color: #0088ff; box-shadow: 0 0 12px 3px rgba(0, 136, 255, 0.4); }
        83% { border-color: #8800ff; box-shadow: 0 0 12px 3px rgba(136, 0, 255, 0.4); }
        100% { border-color: #ff0000; box-shadow: 0 0 12px 3px rgba(255, 0, 0, 0.4); }
      }
    `,
    style: {
      animation: 'frame-rainbow 4s linear infinite',
      border: '3px solid #ff0000',
      borderRadius: '50%',
    },
  },
]

export const RARITY_CONFIG = {
  epic: { name: 'Episch', color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-500/20' },
  legendary: { name: 'Legendaer', color: 'text-orange-400', border: 'border-amber-500', bg: 'bg-amber-500/20' },
}
