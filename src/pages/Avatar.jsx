import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AvatarRenderer from '../components/profile/AvatarRenderer'

const SKIN_COLORS = [
  { name: 'Hell', hex: '#FDEBD0' },
  { name: 'Beige', hex: '#F5D6B8' },
  { name: 'Mittel', hex: '#D4A574' },
  { name: 'Olive', hex: '#C4956A' },
  { name: 'Braun', hex: '#8D5524' },
  { name: 'Dunkelbraun', hex: '#5C3317' },
  { name: 'Espresso', hex: '#3B1F0B' },
]

const HAIR_COLORS = [
  { name: 'Schwarz', hex: '#1C1C1C' },
  { name: 'Dunkelbraun', hex: '#2C1810' },
  { name: 'Braun', hex: '#6B3A2A' },
  { name: 'Hellbraun', hex: '#A0522D' },
  { name: 'Blond', hex: '#D4A843' },
  { name: 'Rot', hex: '#8B2500' },
  { name: 'Grau', hex: '#9E9E9E' },
  { name: 'Blau', hex: '#2196F3' },
  { name: 'Pink', hex: '#E91E63' },
]

const HAIR_STYLES = [
  { id: 'short', name: 'Kurz' },
  { id: 'long', name: 'Lang' },
  { id: 'curly', name: 'Lockig' },
  { id: 'buzz', name: 'Buzz Cut' },
  { id: 'ponytail', name: 'Pferdeschwanz' },
  { id: 'mohawk', name: 'Irokese' },
]

const EYE_TYPES = [
  { id: 'round', name: 'Rund' },
  { id: 'almond', name: 'Mandel' },
  { id: 'sleepy', name: 'Schlaefrig' },
  { id: 'cat', name: 'Katze' },
]

function ColorPicker({ label, colors, selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onChange(color.hex)}
            title={color.name}
            className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
              selected === color.hex
                ? 'border-accent scale-110 ring-2 ring-accent ring-offset-2 ring-offset-bg-card'
                : 'border-gray-600 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  )
}

function StylePicker({ label, options, selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              selected === option.id
                ? 'bg-accent text-white'
                : 'bg-bg-hover text-text-secondary hover:bg-gray-500'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Avatar() {
  const { user } = useAuth()

  const [avatarConfig, setAvatarConfig] = useState({
    skinColor: user?.avatar?.skinColor || '#F5D6B8',
    hairColor: user?.avatar?.hairColor || '#2C1810',
    hairStyle: user?.avatar?.hairStyle || 'short',
    eyeType: user?.avatar?.eyes || 'round',
  })

  const [savedConfig] = useState(avatarConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const updateConfig = (key, value) => {
    setAvatarConfig(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(r => setTimeout(r, 800))
    setIsSaving(false)
    setHasChanges(false)
  }

  const handleReset = () => {
    setAvatarConfig(savedConfig)
    setHasChanges(false)
  }

  return (
    <div className="max-w-5xl mx-auto py-4">
      <h1 className="text-3xl font-bold mb-8">Avatar anpassen</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Live Preview */}
        <div className="flex flex-col items-center bg-bg-card rounded-xl p-8">
          <AvatarRenderer
            skinColor={avatarConfig.skinColor}
            hairColor={avatarConfig.hairColor}
            hairStyle={avatarConfig.hairStyle}
            eyeType={avatarConfig.eyeType}
            size={250}
            username={user?.username}
          />
          <p className="mt-4 text-lg font-semibold">{user?.username}</p>
          <p className="text-text-muted text-sm">Live-Vorschau</p>
        </div>

        {/* Right: Customization Panel */}
        <div className="bg-bg-card rounded-xl p-6 space-y-6">
          <ColorPicker
            label="Hautfarbe"
            colors={SKIN_COLORS}
            selected={avatarConfig.skinColor}
            onChange={(color) => updateConfig('skinColor', color)}
          />

          <ColorPicker
            label="Haarfarbe"
            colors={HAIR_COLORS}
            selected={avatarConfig.hairColor}
            onChange={(color) => updateConfig('hairColor', color)}
          />

          <StylePicker
            label="Frisur"
            options={HAIR_STYLES}
            selected={avatarConfig.hairStyle}
            onChange={(style) => updateConfig('hairStyle', style)}
          />

          <StylePicker
            label="Augenform"
            options={EYE_TYPES}
            selected={avatarConfig.eyeType}
            onChange={(type) => updateConfig('eyeType', type)}
          />

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex-1 bg-accent hover:bg-accent-dark text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSaving ? 'Speichere...' : 'Speichern'}
            </button>
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="flex-1 bg-bg-hover hover:bg-gray-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Zuruecksetzen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
