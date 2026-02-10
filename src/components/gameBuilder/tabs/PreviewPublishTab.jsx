import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Rocket, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { validateTemplateGame } from '../../../utils/gameValidation'
import { usePublishedGames } from '../../../hooks/usePublishedGames'
import { useGameDrafts } from '../../../hooks/useGameDrafts'

export default function PreviewPublishTab({ gameData, onChange, onSaveDraft }) {
  const navigate = useNavigate()
  const { publish } = usePublishedGames()
  const { deleteDraft } = useGameDrafts()
  const [isPublishing, setIsPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const validation = validateTemplateGame(gameData)

  const checks = [
    { label: 'Titel vorhanden', ok: gameData.title?.trim().length >= 3 },
    { label: 'Beschreibung vorhanden', ok: gameData.description?.trim().length >= 10 },
    { label: 'Fach ausgewaehlt', ok: !!gameData.subject },
    { label: 'Mindestens 3 Fragen', ok: (gameData.questions?.length || 0) >= 3 },
    { label: 'Alle Fragen haben korrekte Antworten', ok: gameData.questions?.every(q => q.options?.some(o => o.isCorrect)) },
    { label: 'Alle Fragen haben Text', ok: gameData.questions?.every(q => q.text?.trim()) },
    { label: 'Thumbnail vorhanden', ok: !!gameData.thumbnailRef },
    { label: 'Mindestens ein Tag', ok: (gameData.tags?.length || 0) > 0 },
  ]

  const allChecksPass = checks.every(c => c.ok)

  const handlePublish = async () => {
    if (!allChecksPass) return
    setIsPublishing(true)

    // Simulate publishing delay
    await new Promise(r => setTimeout(r, 1500))

    const publishedGame = {
      id: gameData.id.replace('draft-', 'game-pub-'),
      mode: 'template',
      type: gameData.type,
      title: gameData.title,
      description: gameData.description,
      creator: gameData.creator,
      creatorId: gameData.creatorId,
      thumbnail: gameData.thumbnailUrl || null,
      screenshots: [],
      tags: gameData.tags,
      subject: gameData.subject,
      category: gameData.category || 'quiz',
      price: gameData.price || 0,
      premium: gameData.premium || false,
      gameUrl: null,
      questions: gameData.questions,
      settings: gameData.settings,
      theme: gameData.theme,
      versions: [{ version: 1, date: new Date().toISOString(), note: 'Erstveroeffentlichung' }],
      createdAt: new Date().toISOString(),
    }

    publish(publishedGame)
    deleteDraft(gameData.id)

    setIsPublishing(false)
    setPublished(true)
  }

  if (published) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Spiel veroeffentlicht!</h2>
        <p className="text-text-secondary mb-6">Dein Quiz ist jetzt live und kann gespielt werden.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/browse')}
            className="bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Zum Mindbrowser
          </button>
          <button
            onClick={() => navigate('/my-games')}
            className="bg-bg-secondary hover:bg-bg-hover text-text-secondary px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Meine Spiele
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-4">Vorschau & Veroeffentlichen</h2>
      </div>

      {/* Validation Checklist */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3">Validierungs-Checkliste</h3>
        <div className="space-y-2">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              {check.ok ? (
                <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
              ) : (
                <XCircle size={18} className="text-red-400 flex-shrink-0" />
              )}
              <span className={`text-sm ${check.ok ? 'text-text-primary' : 'text-red-400'}`}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Preview */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3">Schnellvorschau</h3>
        <div className="bg-bg-secondary rounded-xl p-6">
          <div className="flex gap-4">
            {gameData.thumbnailUrl ? (
              <img src={gameData.thumbnailUrl} alt="Thumbnail" className="w-32 h-20 object-cover rounded-lg flex-shrink-0" />
            ) : (
              <div className="w-32 h-20 bg-bg-card rounded-lg flex items-center justify-center text-text-muted text-xs flex-shrink-0">
                Kein Bild
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-bold text-text-primary truncate">{gameData.title || 'Kein Titel'}</h4>
              <p className="text-text-muted text-sm line-clamp-2">{gameData.description || 'Keine Beschreibung'}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-bg-card px-2 py-0.5 rounded text-text-secondary">
                  {gameData.questions?.length || 0} Fragen
                </span>
                <span className="text-xs bg-bg-card px-2 py-0.5 rounded text-text-secondary">
                  {gameData.subject || 'Kein Fach'}
                </span>
                {gameData.premium && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                    {gameData.price} MC
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {!validation.isValid && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-red-400 text-sm font-medium">Bitte behebe folgende Probleme:</span>
          </div>
          <ul className="space-y-1">
            {validation.errors.map((err, i) => (
              <li key={i} className="text-red-300 text-sm ml-6">- {err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onSaveDraft}
          className="flex-1 flex items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-hover text-text-secondary py-3 rounded-lg transition-colors cursor-pointer font-medium"
        >
          <Save size={18} />
          Entwurf speichern
        </button>
        <button
          onClick={handlePublish}
          disabled={!allChecksPass || isPublishing}
          className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
        >
          <Rocket size={18} />
          {isPublishing ? 'Wird veroeffentlicht...' : 'Veroeffentlichen'}
        </button>
      </div>
    </div>
  )
}
