import { useState, useEffect, useRef, useCallback } from 'react'
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

const EYEBROW_TYPES = [
  { id: 'none', name: 'Keine' },
  { id: 'normal', name: 'Normal' },
  { id: 'thick', name: 'Dick' },
  { id: 'arched', name: 'Geschwungen' },
  { id: 'angry', name: 'Wuetend' },
]

const MOUTH_TYPES = [
  { id: 'smile', name: 'Laecheln' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'open', name: 'Offen' },
  { id: 'smirk', name: 'Grinsen' },
]

const ACCESSORY_TYPES = [
  { id: 'none', name: 'Keine' },
  { id: 'glasses', name: 'Brille' },
  { id: 'sunglasses', name: 'Sonnenbrille' },
  { id: 'earring', name: 'Ohrring' },
]

const BG_STYLES = [
  { id: 'gray', name: 'Grau', color: '#374151' },
  { id: 'blue', name: 'Blau', color: '#1e3a5f' },
  { id: 'purple', name: 'Lila', color: '#4a1a6b' },
  { id: 'green', name: 'Gruen', color: '#1a4a2e' },
  { id: 'sunset', name: 'Sunset', color: 'linear-gradient(#ff6b35, #4a1a6b)' },
]

const AVATAR_PRESETS = [
  {
    id: 'warrior',
    name: 'Krieger',
    emoji: '\u2694\uFE0F',
    config: { skinColor: '#D4A574', hairColor: '#1C1C1C', hairStyle: 'buzz', eyeType: 'almond', eyebrows: 'angry', mouth: 'neutral', accessory: 'none', bgStyle: 'gray' },
  },
  {
    id: 'scholar',
    name: 'Gelehrter',
    emoji: '\u{1F4DA}',
    config: { skinColor: '#F5D6B8', hairColor: '#6B3A2A', hairStyle: 'short', eyeType: 'round', eyebrows: 'arched', mouth: 'smile', accessory: 'glasses', bgStyle: 'blue' },
  },
  {
    id: 'artist',
    name: 'Kuenstler',
    emoji: '\u{1F3A8}',
    config: { skinColor: '#FDEBD0', hairColor: '#E91E63', hairStyle: 'curly', eyeType: 'cat', eyebrows: 'normal', mouth: 'smirk', accessory: 'earring', bgStyle: 'purple' },
  },
  {
    id: 'hacker',
    name: 'Hacker',
    emoji: '\u{1F4BB}',
    config: { skinColor: '#C4956A', hairColor: '#2196F3', hairStyle: 'mohawk', eyeType: 'sleepy', eyebrows: 'thick', mouth: 'smirk', accessory: 'sunglasses', bgStyle: 'green' },
  },
  {
    id: 'hero',
    name: 'Held',
    emoji: '\u{1F9B8}',
    config: { skinColor: '#8D5524', hairColor: '#D4A843', hairStyle: 'short', eyeType: 'almond', eyebrows: 'thick', mouth: 'smile', accessory: 'none', bgStyle: 'sunset' },
  },
  {
    id: 'mystic',
    name: 'Mystiker',
    emoji: '\u{1F52E}',
    config: { skinColor: '#5C3317', hairColor: '#9E9E9E', hairStyle: 'long', eyeType: 'cat', eyebrows: 'arched', mouth: 'neutral', accessory: 'earring', bgStyle: 'purple' },
  },
  {
    id: 'ninja',
    name: 'Ninja',
    emoji: '\u{1F977}',
    config: { skinColor: '#D4A574', hairColor: '#1C1C1C', hairStyle: 'ponytail', eyeType: 'sleepy', eyebrows: 'normal', mouth: 'neutral', accessory: 'none', bgStyle: 'gray' },
  },
  {
    id: 'punk',
    name: 'Punk',
    emoji: '\u{1F3B8}',
    config: { skinColor: '#FDEBD0', hairColor: '#8B2500', hairStyle: 'mohawk', eyeType: 'round', eyebrows: 'angry', mouth: 'open', accessory: 'earring', bgStyle: 'sunset' },
  },
]

const TABS = [
  { id: 'presets', name: 'Presets' },
  { id: 'basis', name: 'Basis' },
  { id: 'gesicht', name: 'Gesicht' },
  { id: 'style', name: 'Style' },
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
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('presets')

  const savedConfig = useRef({
    skinColor: user?.avatar?.skinColor || '#F5D6B8',
    hairColor: user?.avatar?.hairColor || '#2C1810',
    hairStyle: user?.avatar?.hairStyle || 'short',
    eyeType: user?.avatar?.eyes || 'round',
    eyebrows: user?.avatar?.eyebrows || 'none',
    mouth: user?.avatar?.mouth || 'smile',
    accessory: user?.avatar?.accessory || 'none',
    bgStyle: user?.avatar?.bgStyle || 'gray',
  })

  const [avatarConfig, setAvatarConfig] = useState({ ...savedConfig.current })
  const [showComparison, setShowComparison] = useState(false)

  const [saveStatus, setSaveStatus] = useState('saved')
  const debounceRef = useRef(null)
  const latestConfig = useRef(avatarConfig)

  const saveToServer = useCallback(async (config) => {
    setSaveStatus('saving')
    try {
      await updateUser({
        avatar: {
          skinColor: config.skinColor,
          hairColor: config.hairColor,
          hairStyle: config.hairStyle,
          eyes: config.eyeType,
          eyebrows: config.eyebrows,
          mouth: config.mouth,
          accessory: config.accessory,
          bgStyle: config.bgStyle,
        },
      })
      savedConfig.current = { ...config }
      setSaveStatus('saved')
    } catch {
      setSaveStatus('pending')
    }
  }, [updateUser])

  const updateConfig = (key, value) => {
    const newConfig = { ...avatarConfig, [key]: value }
    setAvatarConfig(newConfig)
    latestConfig.current = newConfig
    setSaveStatus('pending')

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveToServer(latestConfig.current)
    }, 800)
  }

  const applyPreset = (preset) => {
    const newConfig = { ...preset.config }
    setAvatarConfig(newConfig)
    latestConfig.current = newConfig
    setSaveStatus('pending')

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveToServer(latestConfig.current)
    }, 800)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const hasChanges = JSON.stringify(avatarConfig) !== JSON.stringify(savedConfig.current)

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Avatar anpassen</h1>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs px-3 py-1 rounded-full bg-bg-card text-text-secondary hover:text-text-primary transition-colors cursor-pointer border border-gray-700"
            >
              {showComparison ? 'Vergleich aus' : 'Vorher/Nachher'}
            </button>
          )}
          <span className={`text-sm px-3 py-1 rounded-full ${
            saveStatus === 'saved' ? 'bg-success/20 text-success' :
            saveStatus === 'saving' ? 'bg-accent/20 text-accent' :
            'bg-warning/20 text-warning'
          }`}>
            {saveStatus === 'saved' ? 'Gespeichert' :
             saveStatus === 'saving' ? 'Speichere...' :
             'Ungespeichert'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Live Preview + Comparison */}
        <div className="flex flex-col items-center bg-bg-card rounded-xl p-8">
          <div className="flex items-center gap-6">
            {/* Saved avatar (comparison) */}
            {showComparison && hasChanges && (
              <div className="flex flex-col items-center opacity-60">
                <AvatarRenderer
                  skinColor={savedConfig.current.skinColor}
                  hairColor={savedConfig.current.hairColor}
                  hairStyle={savedConfig.current.hairStyle}
                  eyeType={savedConfig.current.eyeType}
                  eyebrows={savedConfig.current.eyebrows}
                  mouth={savedConfig.current.mouth}
                  accessory={savedConfig.current.accessory}
                  bgStyle={savedConfig.current.bgStyle}
                  size={140}
                  username={user?.username}
                />
                <p className="text-xs text-text-muted mt-2">Gespeichert</p>
              </div>
            )}

            {/* Current preview */}
            <div className="flex flex-col items-center">
              <AvatarRenderer
                skinColor={avatarConfig.skinColor}
                hairColor={avatarConfig.hairColor}
                hairStyle={avatarConfig.hairStyle}
                eyeType={avatarConfig.eyeType}
                eyebrows={avatarConfig.eyebrows}
                mouth={avatarConfig.mouth}
                accessory={avatarConfig.accessory}
                bgStyle={avatarConfig.bgStyle}
                size={showComparison && hasChanges ? 140 : 280}
                username={user?.username}
                animated
              />
              {showComparison && hasChanges && (
                <p className="text-xs text-accent mt-2">Aktuell</p>
              )}
            </div>
          </div>

          <p className="mt-4 text-lg font-semibold">{user?.username}</p>
          <p className="text-text-muted text-sm">Live-Vorschau</p>
        </div>

        {/* Right: Customization Panel */}
        <div className="bg-bg-card rounded-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer relative ${
                  activeTab === tab.id
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            {activeTab === 'presets' && (
              <div>
                <p className="text-sm text-text-muted mb-4">Waehle ein Preset oder passe deinen Avatar individuell an.</p>
                <div className="grid grid-cols-2 gap-3">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className="flex items-center gap-3 p-3 bg-bg-hover rounded-xl hover:bg-gray-500/30 border border-gray-700 hover:border-accent/50 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <AvatarRenderer
                          skinColor={preset.config.skinColor}
                          hairColor={preset.config.hairColor}
                          hairStyle={preset.config.hairStyle}
                          eyeType={preset.config.eyeType}
                          eyebrows={preset.config.eyebrows}
                          mouth={preset.config.mouth}
                          accessory={preset.config.accessory}
                          bgStyle={preset.config.bgStyle}
                          size={48}
                        />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {preset.emoji} {preset.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'basis' && (
              <>
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
              </>
            )}

            {activeTab === 'gesicht' && (
              <>
                <StylePicker
                  label="Augenform"
                  options={EYE_TYPES}
                  selected={avatarConfig.eyeType}
                  onChange={(type) => updateConfig('eyeType', type)}
                />
                <StylePicker
                  label="Augenbrauen"
                  options={EYEBROW_TYPES}
                  selected={avatarConfig.eyebrows}
                  onChange={(type) => updateConfig('eyebrows', type)}
                />
                <StylePicker
                  label="Mund"
                  options={MOUTH_TYPES}
                  selected={avatarConfig.mouth}
                  onChange={(type) => updateConfig('mouth', type)}
                />
              </>
            )}

            {activeTab === 'style' && (
              <>
                <StylePicker
                  label="Accessoire"
                  options={ACCESSORY_TYPES}
                  selected={avatarConfig.accessory}
                  onChange={(type) => updateConfig('accessory', type)}
                />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Hintergrund</label>
                  <div className="flex flex-wrap gap-3">
                    {BG_STYLES.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => updateConfig('bgStyle', bg.id)}
                        title={bg.name}
                        className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
                          avatarConfig.bgStyle === bg.id
                            ? 'border-accent scale-110 ring-2 ring-accent ring-offset-2 ring-offset-bg-card'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ background: bg.color }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
