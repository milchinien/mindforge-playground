import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Contrast } from 'lucide-react'
import { useThemeStore, useIsDark, useIsHighContrast } from '../../stores/themeStore'
import { useSettingsStore } from '../../stores/settingsStore'
import ToggleSwitch from './ToggleSwitch'

export default function GeneralTab() {
  const { t, i18n } = useTranslation()
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const isDark = useIsDark()
  const isHighContrast = useIsHighContrast()

  const soundEffects = useSettingsStore((s) => s.soundEffects)
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  const autoplayVideos = useSettingsStore((s) => s.autoplayVideos)
  const fontSize = useSettingsStore((s) => s.fontSize)
  const updateSetting = useSettingsStore((s) => s.updateSetting)

  const [language, setLanguage] = useState(i18n.language || 'de')

  const handleLanguageChange = (value) => {
    setLanguage(value)
    i18n.changeLanguage(value)
  }

  return (
    <div className="space-y-6">
      {/* Theme */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {isHighContrast ? <Contrast size={20} /> : isDark ? <Moon size={20} /> : <Sun size={20} />}
          {t('settings.appearance')}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary">{t('settings.theme')}</p>
            <p className="text-sm text-text-muted">{t('settings.themeDesc')}</p>
          </div>
          <div className="flex bg-bg-hover rounded-lg p-1">
            {['dark', 'light', 'high-contrast'].map((id) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  theme === id ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t(`settings.${id === 'high-contrast' ? 'highContrast' : id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Preview */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: t('settings.dark'), bg: '#111827', card: '#374151', text: '#ffffff', accent: '#f97316' },
            { id: 'light', label: t('settings.light'), bg: '#f9fafb', card: '#ffffff', text: '#111827', accent: '#2563eb' },
            { id: 'high-contrast', label: t('settings.highContrast'), bg: '#000000', card: '#1a1a1a', text: '#ffffff', accent: '#00ff88' },
          ].map((preview) => (
            <button
              key={preview.id}
              onClick={() => setTheme(preview.id)}
              className={`rounded-lg p-3 border-2 transition-all cursor-pointer ${
                theme === preview.id
                  ? 'border-accent shadow-lg shadow-accent/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              style={{ backgroundColor: preview.bg }}
            >
              <div className="space-y-1.5">
                <div className="h-2 w-3/4 rounded" style={{ backgroundColor: preview.text, opacity: 0.8 }} />
                <div className="h-2 w-1/2 rounded" style={{ backgroundColor: preview.text, opacity: 0.4 }} />
                <div className="flex gap-1 mt-2">
                  <div className="h-6 flex-1 rounded" style={{ backgroundColor: preview.card }} />
                  <div className="h-6 flex-1 rounded" style={{ backgroundColor: preview.accent }} />
                </div>
                <p className="text-xs font-medium mt-1 text-center" style={{ color: preview.text }}>
                  {preview.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.language')}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary">{t('settings.displayLanguage')}</p>
            <p className="text-sm text-text-muted">{t('settings.moreLanguages')}</p>
          </div>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="!w-auto !py-2 !px-4"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="fr" disabled>Francais (bald)</option>
            <option value="es" disabled>Espanol (bald)</option>
          </select>
        </div>
      </section>

      {/* UI Preferences */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.tabs.general')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary">{t('settings.soundEffects')}</p>
              <p className="text-sm text-text-muted">{t('settings.soundEffectsDesc')}</p>
            </div>
            <ToggleSwitch checked={soundEffects} onChange={(v) => updateSetting('soundEffects', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary">{t('settings.reducedMotion')}</p>
              <p className="text-sm text-text-muted">{t('settings.reducedMotionDesc')}</p>
            </div>
            <ToggleSwitch checked={reducedMotion} onChange={(v) => updateSetting('reducedMotion', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary">{t('settings.autoplay')}</p>
              <p className="text-sm text-text-muted">{t('settings.autoplayDesc')}</p>
            </div>
            <ToggleSwitch checked={autoplayVideos} onChange={(v) => updateSetting('autoplayVideos', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary">{t('settings.fontSize')}</p>
              <p className="text-sm text-text-muted">{t('settings.fontSizeDesc')}</p>
            </div>
            <div className="flex bg-bg-hover rounded-lg p-1">
              {[
                { id: 'small', label: t('settings.fontSmall') },
                { id: 'medium', label: t('settings.fontMedium') },
                { id: 'large', label: t('settings.fontLarge') },
              ].map((size) => (
                <button
                  key={size.id}
                  onClick={() => updateSetting('fontSize', size.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    fontSize === size.id ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
