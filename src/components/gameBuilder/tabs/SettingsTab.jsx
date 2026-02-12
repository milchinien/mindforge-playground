import { Clock, Shuffle, Award, Eye, EyeOff } from 'lucide-react'

export default function SettingsTab({ gameData, onChange }) {
  const settings = gameData.settings || {}

  const updateSetting = (key, value) => {
    onChange({ settings: { ...settings, [key]: value } })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-4">Spieleinstellungen</h2>
      </div>

      {/* Price */}
      <div>
        <label>Preis</label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer !mb-0">
            <input
              type="radio"
              checked={!gameData.premium}
              onChange={() => onChange({ premium: false, price: 0 })}
              className="!w-4 !h-4"
            />
            <span className="text-text-primary text-sm">Kostenlos</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer !mb-0">
            <input
              type="radio"
              checked={gameData.premium}
              onChange={() => onChange({ premium: true, price: gameData.price || 10 })}
              className="!w-4 !h-4"
            />
            <span className="text-text-primary text-sm">MindCoins:</span>
            {gameData.premium && (
              <input
                type="number"
                value={gameData.price}
                onChange={(e) => onChange({ price: parseInt(e.target.value) || 0 })}
                min={1}
                max={9999}
                className="!w-24 !py-1 !text-sm"
              />
            )}
          </label>
        </div>
      </div>

      {/* Time Limit */}
      <div>
        <label className="flex items-center gap-2">
          <Clock size={16} className="text-text-muted" />
          Zeitlimit pro Frage
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={120}
            step={5}
            value={settings.timeLimit || 0}
            onChange={(e) => updateSetting('timeLimit', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-text-primary font-mono text-sm w-16 text-right">
            {settings.timeLimit > 0 ? `${settings.timeLimit}s` : 'Aus'}
          </span>
        </div>
        <p className="text-text-muted text-xs mt-1">0 = Kein Zeitlimit</p>
      </div>

      {/* Random Order */}
      <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
        <div className="flex items-center gap-3">
          <Shuffle size={18} className="text-text-muted" />
          <div>
            <p className="text-text-primary text-sm font-medium">Zufaellige Reihenfolge</p>
            <p className="text-text-muted text-xs">Fragen werden bei jedem Durchlauf neu gemischt</p>
          </div>
        </div>
        <button
          onClick={() => updateSetting('randomOrder', !settings.randomOrder)}
          className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
            settings.randomOrder ? 'bg-accent' : 'bg-gray-600'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
            settings.randomOrder ? 'translate-x-[22px]' : 'translate-x-[2px]'
          }`} />
        </button>
      </div>

      {/* Show Points */}
      <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
        <div className="flex items-center gap-3">
          <Award size={18} className="text-text-muted" />
          <div>
            <p className="text-text-primary text-sm font-medium">Punkte anzeigen</p>
            <p className="text-text-muted text-xs">Zeige den Punktestand waehrend des Spiels</p>
          </div>
        </div>
        <button
          onClick={() => updateSetting('showPoints', !settings.showPoints)}
          className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
            settings.showPoints ? 'bg-accent' : 'bg-gray-600'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
            settings.showPoints ? 'translate-x-[22px]' : 'translate-x-[2px]'
          }`} />
        </button>
      </div>

      {/* Visibility */}
      <div>
        <label>Sichtbarkeit</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateSetting('visibility', 'public')}
            className={`flex items-center gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
              settings.visibility === 'public'
                ? 'border-accent bg-accent/10'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <Eye size={18} className={settings.visibility === 'public' ? 'text-accent' : 'text-text-muted'} />
            <div>
              <p className="text-sm font-medium text-text-primary">Oeffentlich</p>
              <p className="text-xs text-text-muted">Im Mindbrowser sichtbar</p>
            </div>
          </button>
          <button
            onClick={() => updateSetting('visibility', 'unlisted')}
            className={`flex items-center gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
              settings.visibility === 'unlisted'
                ? 'border-accent bg-accent/10'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <EyeOff size={18} className={settings.visibility === 'unlisted' ? 'text-accent' : 'text-text-muted'} />
            <div>
              <p className="text-sm font-medium text-text-primary">Ungelistet</p>
              <p className="text-xs text-text-muted">Nur per Link erreichbar</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
