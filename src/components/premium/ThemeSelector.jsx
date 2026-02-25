import { useState } from 'react'
import { Check, Lock, Palette, Sparkles } from 'lucide-react'
import { usePremiumStore } from '../../stores/premiumStore'
import { PREMIUM_THEMES, PROFILE_FRAMES, RARITY_CONFIG } from '../../data/premiumThemes'
import { useAuth } from '../../contexts/AuthContext'
import { isPremium } from '../../utils/premiumChecks'
import MindCoinIcon from '../common/MindCoinIcon'

export default function ThemeSelector() {
  const { user } = useAuth()
  const userIsPremium = isPremium(user)
  const {
    activeTheme, unlockedThemes, setTheme, unlockTheme,
    activeFrame, unlockedFrames, setFrame, unlockFrame,
  } = usePremiumStore()
  const [confirmUnlock, setConfirmUnlock] = useState(null)
  const [confirmFrame, setConfirmFrame] = useState(null)

  const handleApplyTheme = (themeId) => {
    if (activeTheme === themeId) {
      setTheme(null)
    } else if (unlockedThemes.includes(themeId)) {
      setTheme(themeId)
    } else {
      setConfirmUnlock(themeId)
    }
  }

  const handleConfirmUnlockTheme = () => {
    if (confirmUnlock) {
      unlockTheme(confirmUnlock)
      setTheme(confirmUnlock)
      setConfirmUnlock(null)
    }
  }

  const handleApplyFrame = (frameId) => {
    if (activeFrame === frameId) {
      setFrame(null)
    } else if (unlockedFrames.includes(frameId)) {
      setFrame(frameId)
    } else {
      setConfirmFrame(frameId)
    }
  }

  const handleConfirmUnlockFrame = () => {
    if (confirmFrame) {
      unlockFrame(confirmFrame)
      setFrame(confirmFrame)
      setConfirmFrame(null)
    }
  }

  const confirmThemeData = confirmUnlock ? PREMIUM_THEMES.find(t => t.id === confirmUnlock) : null
  const confirmFrameData = confirmFrame ? PROFILE_FRAMES.find(f => f.id === confirmFrame) : null

  // Inject frame animation styles
  const frameStyles = PROFILE_FRAMES.map(f => f.animation).join('\n')

  return (
    <div className="space-y-8">
      <style>{frameStyles}</style>

      {/* ── Premium Themes ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold text-text-primary">Premium-Themes</h2>
        </div>
        <p className="text-sm text-text-secondary mb-5">
          Passe dein MindForge-Erlebnis mit exklusiven Themes an. Nur fuer Premium-Mitglieder.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PREMIUM_THEMES.map((theme) => {
            const isActive = activeTheme === theme.id
            const isUnlocked = unlockedThemes.includes(theme.id)
            const rarity = RARITY_CONFIG[theme.rarity]

            return (
              <div
                key={theme.id}
                className={`relative bg-bg-card rounded-xl border overflow-hidden transition-all ${
                  isActive
                    ? 'border-accent ring-2 ring-accent/30'
                    : isUnlocked
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-700 opacity-80'
                }`}
              >
                {/* Gradient preview bar */}
                <div
                  className="h-20 w-full relative"
                  style={{
                    background: `linear-gradient(135deg, ${theme.previewColors[0]}, ${theme.previewColors[1]}, ${theme.previewColors[2]}, ${theme.previewColors[3]})`,
                  }}
                >
                  {/* Rarity badge */}
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${rarity.bg} ${rarity.color}`}>
                    {rarity.name}
                  </span>

                  {/* Active checkmark */}
                  {isActive && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Lock overlay */}
                  {!isUnlocked && !userIsPremium && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white/70" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-text-primary">{theme.name}</h3>
                    {/* Color swatches */}
                    <div className="flex gap-1">
                      {theme.previewColors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mb-3">{theme.description}</p>

                  {isUnlocked ? (
                    <button
                      onClick={() => handleApplyTheme(theme.id)}
                      className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-accent/20 text-accent border border-accent/40'
                          : 'bg-bg-hover hover:bg-bg-secondary text-text-primary border border-gray-600'
                      }`}
                    >
                      {isActive ? 'Aktiv' : 'Aktivieren'}
                    </button>
                  ) : userIsPremium ? (
                    <button
                      onClick={() => handleApplyTheme(theme.id)}
                      className="w-full py-2 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-dark text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <MindCoinIcon size={16} />
                      {theme.price} MC freischalten
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-lg text-sm font-semibold bg-bg-hover text-text-muted text-center flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Premium erforderlich
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Animated Profile Frames ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold text-text-primary">Animierte Profilrahmen</h2>
        </div>
        <p className="text-sm text-text-secondary mb-5">
          Lass dein Profil mit animierten Rahmen hervorstechen. Sichtbar fuer alle Spieler.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROFILE_FRAMES.map((frame) => {
            const isActive = activeFrame === frame.id
            const isUnlocked = unlockedFrames.includes(frame.id)
            const rarity = RARITY_CONFIG[frame.rarity]

            return (
              <div
                key={frame.id}
                className={`bg-bg-card rounded-xl p-5 border text-center relative transition-all ${
                  isActive
                    ? 'border-accent ring-2 ring-accent/30'
                    : isUnlocked
                      ? 'border-gray-600'
                      : 'border-gray-700'
                }`}
              >
                {/* Rarity badge */}
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${rarity.bg} ${rarity.color}`}>
                  {rarity.name}
                </span>

                {/* Frame preview */}
                <div className="flex justify-center mb-4 mt-2">
                  <div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/30 to-purple-500/30 flex items-center justify-center"
                    style={frame.style}
                  >
                    <span className="text-2xl">
                      {frame.id === 'glowing' ? '\u2728' : frame.id === 'pulsing' ? '\u{1F49C}' : '\u{1F308}'}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-text-primary text-sm">{frame.name}</h3>
                <p className="text-xs text-text-muted mt-1 mb-4">{frame.description}</p>

                {isUnlocked ? (
                  <button
                    onClick={() => handleApplyFrame(frame.id)}
                    className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-accent/20 text-accent border border-accent/40'
                        : 'bg-bg-hover hover:bg-bg-secondary text-text-primary border border-gray-600'
                    }`}
                  >
                    {isActive ? 'Aktiv' : 'Aktivieren'}
                  </button>
                ) : userIsPremium ? (
                  <button
                    onClick={() => handleApplyFrame(frame.id)}
                    className="w-full py-2 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-dark text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MindCoinIcon size={16} />
                    {frame.price} MC freischalten
                  </button>
                ) : (
                  <div className="w-full py-2 rounded-lg text-sm font-semibold bg-bg-hover text-text-muted text-center flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Premium erforderlich
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Unlock Confirmation Modals ── */}
      {confirmThemeData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmUnlock(null)}>
          <div className="bg-bg-secondary rounded-xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div
              className="h-24 w-full"
              style={{
                background: `linear-gradient(135deg, ${confirmThemeData.previewColors[0]}, ${confirmThemeData.previewColors[1]}, ${confirmThemeData.previewColors[2]})`,
              }}
            />
            <div className="p-6 text-center">
              <h3 className="text-lg font-bold text-text-primary mb-2">"{confirmThemeData.name}" freischalten?</h3>
              <p className="text-sm text-text-secondary mb-4">{confirmThemeData.description}</p>
              <div className="flex items-center justify-center gap-2 mb-5">
                <MindCoinIcon size={24} />
                <span className="text-xl font-bold text-accent">{confirmThemeData.price} MC</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmUnlock(null)}
                  className="flex-1 py-2.5 rounded-lg bg-bg-hover text-text-secondary font-semibold transition-colors cursor-pointer hover:bg-bg-card"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleConfirmUnlockTheme}
                  className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer"
                >
                  Freischalten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmFrameData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmFrame(null)}>
          <div className="bg-bg-secondary rounded-xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-purple-500/30 flex items-center justify-center"
                style={confirmFrameData.style}
              >
                <span className="text-3xl">
                  {confirmFrameData.id === 'glowing' ? '\u2728' : confirmFrameData.id === 'pulsing' ? '\u{1F49C}' : '\u{1F308}'}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">"{confirmFrameData.name}" freischalten?</h3>
            <p className="text-sm text-text-secondary mb-4">{confirmFrameData.description}</p>
            <div className="flex items-center justify-center gap-2 mb-5">
              <MindCoinIcon size={24} />
              <span className="text-xl font-bold text-accent">{confirmFrameData.price} MC</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmFrame(null)}
                className="flex-1 py-2.5 rounded-lg bg-bg-hover text-text-secondary font-semibold transition-colors cursor-pointer hover:bg-bg-card"
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirmUnlockFrame}
                className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer"
              >
                Freischalten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
