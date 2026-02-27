import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Settings2, Palette, ListChecks, Eye, Save } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useGameDrafts } from '../../hooks/useGameDrafts'
import BasicSettingsTab from './tabs/BasicSettingsTab'
import QuestionEditorTab from './tabs/QuestionEditorTab'
import DesignTab from './tabs/DesignTab'
import SettingsTab from './tabs/SettingsTab'
import PreviewPublishTab from './tabs/PreviewPublishTab'
import Tabs from '../ui/Tabs'

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
  const { t } = useTranslation()
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

  const TABS = [
    { id: 'basics', label: t('create.builder.tabs.basics'), icon: Settings2 },
    { id: 'questions', label: t('create.builder.tabs.questions'), icon: ListChecks },
    { id: 'design', label: t('create.builder.tabs.design'), icon: Palette },
    { id: 'settings', label: t('create.builder.tabs.settings'), icon: Settings2 },
    { id: 'preview', label: t('create.builder.tabs.preview'), icon: Eye },
  ]

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
            <h1 className="text-xl font-bold">{gameData.title || t('create.builder.newQuiz')}</h1>
            <p className="text-text-muted text-xs">
              {t('create.builder.templateMode')}
              {lastSaved && ` · ${t('create.builder.savedAt', { time: lastSaved.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) })}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleManualSave}
          className="flex items-center gap-2 bg-bg-card hover:bg-bg-hover text-text-secondary px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm"
        >
          <Save size={16} />
          {t('create.builder.saveDraft')}
        </button>
      </div>

      {/* Tab Navigation */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

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
