import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings2, Palette, ListChecks, Eye, Save } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useGameDrafts } from '../../hooks/useGameDrafts'
import BasicSettingsTab from './tabs/BasicSettingsTab'
import QuestionEditorTab from './tabs/QuestionEditorTab'
import DesignTab from './tabs/DesignTab'
import SettingsTab from './tabs/SettingsTab'
import PreviewPublishTab from './tabs/PreviewPublishTab'

const TABS = [
  { id: 'basics', label: 'Grundlagen', icon: Settings2 },
  { id: 'questions', label: 'Fragen', icon: ListChecks },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'settings', label: 'Einstellungen', icon: Settings2 },
  { id: 'preview', label: 'Vorschau & Publish', icon: Eye },
]

function createEmptyGame(userId, username) {
  return {
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mode: 'template',
    type: 'quiz',
    version: 1,
    title: '',
    description: '',
    creatorId: userId,
    creator: username,
    thumbnailRef: null,
    thumbnailUrl: null,
    screenshotRefs: [],
    tags: [],
    subject: '',
    category: 'quiz',
    price: 0,
    premium: false,
    settings: {
      timeLimit: 30,
      randomOrder: false,
      showPoints: true,
      visibility: 'public',
    },
    questions: [],
    theme: 'mindforge',
    customColors: null,
    stats: { plays: 0, views: 0, likes: 0, dislikes: 0 },
    status: 'draft',
    createdAt: new Date().toISOString(),
    versions: [],
  }
}

export default function GameBuilderPage({ editDraftId, onBack }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { saveDraft, getDraft } = useGameDrafts()
  const [activeTab, setActiveTab] = useState('basics')
  const [gameData, setGameData] = useState(() => {
    if (editDraftId) {
      const existing = getDraft(editDraftId)
      if (existing) return existing
    }
    return createEmptyGame(user?.uid, user?.username)
  })
  const [lastSaved, setLastSaved] = useState(null)
  const autoSaveRef = useRef(null)

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (gameData.title || gameData.questions.length > 0) {
        saveDraft(gameData)
        setLastSaved(new Date())
      }
    }, 30000)
    return () => clearInterval(autoSaveRef.current)
  }, [gameData, saveDraft])

  const updateGameData = (updates) => {
    setGameData(prev => ({ ...prev, ...updates }))
  }

  const handleManualSave = () => {
    saveDraft(gameData)
    setLastSaved(new Date())
  }

  return (
    <div className="py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{gameData.title || 'Neues Quiz'}</h1>
            <p className="text-text-muted text-xs">
              Template-Modus
              {lastSaved && ` · Gespeichert ${lastSaved.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleManualSave}
          className="flex items-center gap-2 bg-bg-card hover:bg-bg-hover text-text-secondary px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm"
        >
          <Save size={16} />
          Entwurf speichern
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex-1 justify-center ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-bg-card rounded-xl p-6">
        {activeTab === 'basics' && (
          <BasicSettingsTab gameData={gameData} onChange={updateGameData} />
        )}
        {activeTab === 'questions' && (
          <QuestionEditorTab gameData={gameData} onChange={updateGameData} />
        )}
        {activeTab === 'design' && (
          <DesignTab gameData={gameData} onChange={updateGameData} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab gameData={gameData} onChange={updateGameData} />
        )}
        {activeTab === 'preview' && (
          <PreviewPublishTab gameData={gameData} onChange={updateGameData} onSaveDraft={handleManualSave} />
        )}
      </div>
    </div>
  )
}
