export const gameThemes = [
  {
    id: 'mindforge',
    name: 'MindForge Standard',
    colors: {
      background: '#111827',
      card: '#1f2937',
      primary: '#f97316',
      primaryHover: '#ea580c',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
      correct: '#22c55e',
      incorrect: '#ef4444',
      border: '#374151',
    },
  },
  {
    id: 'ocean',
    name: 'Ozean',
    colors: {
      background: '#0c1929',
      card: '#132f4c',
      primary: '#29b6f6',
      primaryHover: '#0288d1',
      text: '#e3f2fd',
      textSecondary: '#90caf9',
      correct: '#66bb6a',
      incorrect: '#ef5350',
      border: '#1e4976',
    },
  },
  {
    id: 'forest',
    name: 'Wald',
    colors: {
      background: '#1a2e1a',
      card: '#2d4a2d',
      primary: '#66bb6a',
      primaryHover: '#43a047',
      text: '#e8f5e9',
      textSecondary: '#a5d6a7',
      correct: '#81c784',
      incorrect: '#e57373',
      border: '#3e6b3e',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: {
      background: '#0a0a0a',
      card: '#1a1a2e',
      primary: '#e040fb',
      primaryHover: '#aa00ff',
      text: '#ffffff',
      textSecondary: '#b388ff',
      correct: '#00e676',
      incorrect: '#ff1744',
      border: '#2a2a4e',
    },
  },
  {
    id: 'pastel',
    name: 'Pastell',
    colors: {
      background: '#fef7f0',
      card: '#ffffff',
      primary: '#f48fb1',
      primaryHover: '#f06292',
      text: '#37474f',
      textSecondary: '#78909c',
      correct: '#81c784',
      incorrect: '#e57373',
      border: '#e0e0e0',
    },
  },
]

export function getThemeById(id) {
  return gameThemes.find(t => t.id === id) || gameThemes[0]
}
