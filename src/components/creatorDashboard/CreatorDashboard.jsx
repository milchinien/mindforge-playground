import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gamepad2, FileText, Globe, Eye, Play, Heart, Coins, Edit3, Trash2, EyeOff, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useGameDrafts } from '../../hooks/useGameDrafts'
import { mockGames, removePublishedGame } from '../../data/mockGames'
import { formatNumber } from '../../utils/formatters'
import GameStats from './GameStats'
import VersionHistory from './VersionHistory'

export default function CreatorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { drafts, deleteDraft } = useGameDrafts()
  const [activeTab, setActiveTab] = useState('drafts')
  const [showVersions, setShowVersions] = useState(null)
  const [showStats, setShowStats] = useState(null)

  const myDrafts = drafts.filter(d => d.creatorId === user?.uid)
  const myPublished = mockGames.filter(g => g.creatorId === user?.uid && g.status === 'published')

  // Summary stats
  const totalPlays = myPublished.reduce((sum, g) => sum + (g.plays || 0), 0)
  const totalViews = myPublished.reduce((sum, g) => sum + (g.views || 0), 0)
  const totalLikes = myPublished.reduce((sum, g) => sum + (g.likes || 0), 0)
  const totalEarnings = myPublished.reduce((sum, g) => sum + ((g.plays || 0) * (g.price || 0) * 0.1), 0)

  const handleDeletePublished = (gameId) => {
    if (confirm('Spiel wirklich loeschen?')) {
      removePublishedGame(gameId)
      window.location.reload()
    }
  }

  const handleDeleteDraft = (draftId) => {
    if (confirm('Entwurf wirklich loeschen?')) {
      deleteDraft(draftId)
    }
  }

  const handleDepublish = (gameId) => {
    if (confirm('Spiel depublizieren?')) {
      removePublishedGame(gameId)
      window.location.reload()
    }
  }

  return (
    <div className="py-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meine Spiele</h1>
          <p className="text-text-muted mt-1">Verwalte deine Entwuerfe und veroeffentlichten Spiele</p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
        >
          + Neues Spiel
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Play size={16} className="text-text-muted" />
            <span className="text-text-muted text-sm">Plays</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(totalPlays)}</p>
        </div>
        <div className="bg-bg-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-text-muted" />
            <span className="text-text-muted text-sm">Views</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(totalViews)}</p>
        </div>
        <div className="bg-bg-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={16} className="text-text-muted" />
            <span className="text-text-muted text-sm">Likes</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(totalLikes)}</p>
        </div>
        <div className="bg-bg-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={16} className="text-text-muted" />
            <span className="text-text-muted text-sm">Einnahmen</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(Math.round(totalEarnings))} MC</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'drafts' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <FileText size={16} />
          Entwuerfe ({myDrafts.length})
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'published' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Globe size={16} />
          Veroeffentlicht ({myPublished.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'drafts' && (
        <div>
          {myDrafts.length === 0 ? (
            <div className="text-center py-12 bg-bg-card rounded-xl">
              <FileText size={40} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted">Keine Entwuerfe vorhanden</p>
              <button onClick={() => navigate('/create')} className="text-accent hover:underline mt-2 cursor-pointer text-sm">
                Erstelle dein erstes Spiel
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myDrafts.map(draft => (
                <div key={draft.id} className="bg-bg-card rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{draft.title || 'Unbenannter Entwurf'}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock size={12} />
                        {draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString('de-DE') : 'Unbekannt'}
                      </span>
                      <span className="text-xs bg-bg-secondary px-2 py-0.5 rounded text-text-muted">
                        {draft.mode === 'template' ? 'Quiz' : 'Custom'}
                      </span>
                      <span className="text-xs text-text-muted">
                        {draft.questions?.length || 0} Fragen
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => { navigate('/create'); /* TODO: pass draft ID */ }}
                      className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1.5 rounded-lg text-sm hover:bg-accent/20 transition-colors cursor-pointer"
                    >
                      <Edit3 size={14} /> Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="p-1.5 text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'published' && (
        <div>
          {myPublished.length === 0 ? (
            <div className="text-center py-12 bg-bg-card rounded-xl">
              <Globe size={40} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted">Noch keine veroeffentlichten Spiele</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPublished.map(game => (
                <div key={game.id} className="bg-bg-card rounded-xl p-4 flex items-center gap-4">
                  {/* Thumbnail */}
                  {game.thumbnail ? (
                    <img src={game.thumbnail} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-14 bg-bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gamepad2 size={20} className="text-text-muted" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{game.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(game.views || 0)}</span>
                      <span className="flex items-center gap-1"><Play size={12} /> {formatNumber(game.plays || 0)}</span>
                      <span className="flex items-center gap-1"><Heart size={12} /> {formatNumber(game.likes || 0)}</span>
                      <span className="bg-bg-secondary px-2 py-0.5 rounded">
                        {game.mode === 'template' ? 'Quiz' : game.mode === 'freeform' ? 'Custom' : 'ZIP'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setShowStats(game)}
                      className="p-2 text-text-muted hover:text-accent transition-colors cursor-pointer" title="Statistiken"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setShowVersions(game)}
                      className="p-2 text-text-muted hover:text-accent transition-colors cursor-pointer" title="Versionen"
                    >
                      <Clock size={16} />
                    </button>
                    <button
                      onClick={() => handleDepublish(game.id)}
                      className="p-2 text-text-muted hover:text-yellow-400 transition-colors cursor-pointer" title="Depublizieren"
                    >
                      <EyeOff size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePublished(game.id)}
                      className="p-2 text-text-muted hover:text-red-400 transition-colors cursor-pointer" title="Loeschen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Modal */}
      {showStats && <GameStats game={showStats} onClose={() => setShowStats(null)} />}

      {/* Version History Modal */}
      {showVersions && <VersionHistory game={showVersions} onClose={() => setShowVersions(null)} />}
    </div>
  )
}
