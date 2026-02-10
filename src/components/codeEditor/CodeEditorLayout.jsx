import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Settings2, Rocket, MessageCircle, Monitor } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePublishedGames } from '../../hooks/usePublishedGames'
import { useGameDrafts } from '../../hooks/useGameDrafts'
import { validateFreeformGame } from '../../utils/gameValidation'
import { defaultHtml, defaultCss, defaultJs } from '../../data/codeTemplates'
import MonacoWrapper from './MonacoWrapper'
import LivePreview from './LivePreview'
import MetadataPanel from './MetadataPanel'
import AIChatPanel from './AIChatPanel'

export default function CodeEditorLayout({ onBack }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { publish } = usePublishedGames()
  const { saveDraft } = useGameDrafts()

  const [code, setCode] = useState({
    html: defaultHtml,
    css: defaultCss,
    js: defaultJs,
  })
  const [activeFile, setActiveFile] = useState('html')
  const [showMetadata, setShowMetadata] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    subject: '',
    tags: [],
    premium: false,
    price: 0,
    visibility: 'public',
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleCodeChange = (file, value) => {
    setCode(prev => ({ ...prev, [file]: value }))
  }

  const handleMetadataChange = (updates) => {
    setMetadata(prev => ({ ...prev, ...updates }))
  }

  const handlePublish = () => {
    const gameData = { ...metadata, code }
    const validation = validateFreeformGame(gameData)
    if (!validation.isValid) {
      alert(validation.errors.join('\n'))
      return
    }

    const publishedGame = {
      id: `game-free-${Date.now()}`,
      mode: 'freeform',
      type: 'custom',
      title: metadata.title,
      description: metadata.description,
      creator: user?.username || 'Anonym',
      creatorId: user?.uid,
      thumbnail: null,
      screenshots: [],
      tags: metadata.tags,
      subject: metadata.subject || 'informatik',
      category: 'custom',
      price: metadata.price || 0,
      premium: metadata.premium || false,
      gameUrl: null,
      code,
      settings: { visibility: metadata.visibility },
      versions: [{ version: 1, date: new Date().toISOString(), note: 'Erstveroeffentlichung' }],
      createdAt: new Date().toISOString(),
    }

    publish(publishedGame)
    navigate('/browse')
  }

  const handleApplyCode = (codeBlock) => {
    // Try to detect if it's HTML, CSS or JS
    if (codeBlock.includes('<') && codeBlock.includes('>')) {
      setCode(prev => ({ ...prev, html: codeBlock }))
      setActiveFile('html')
    } else if (codeBlock.includes('{') && codeBlock.includes(':') && !codeBlock.includes('function') && !codeBlock.includes('=>')) {
      setCode(prev => ({ ...prev, css: codeBlock }))
      setActiveFile('css')
    } else {
      setCode(prev => ({ ...prev, js: codeBlock }))
      setActiveFile('js')
    }
  }

  if (isMobile) {
    return (
      <div className="py-4 px-4 text-center">
        <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 cursor-pointer">
          <ArrowLeft size={20} /> Zurueck
        </button>
        <div className="py-12">
          <Monitor size={48} className="mx-auto text-text-muted mb-4" />
          <h2 className="text-xl font-bold mb-2">Desktop erforderlich</h2>
          <p className="text-text-secondary">Der Code-Editor ist nur auf Desktop-Geraeten verfuegbar. Bitte verwende einen groesseren Bildschirm.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-bg-secondary px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-text-muted hover:text-text-primary cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-text-primary">{metadata.title || 'Neues Spiel'}</span>
          <span className="text-xs text-text-muted">Freier Modus</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              showChat ? 'bg-accent/20 text-accent' : 'bg-bg-card text-text-secondary hover:text-text-primary'
            }`}
          >
            <MessageCircle size={14} />
            KI-Chat
          </button>
          <button
            onClick={() => setShowMetadata(true)}
            className="flex items-center gap-1.5 bg-bg-card text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            <Settings2 size={14} />
            Metadaten
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            <Rocket size={14} />
            Veroeffentlichen
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor + Preview */}
        <div className="flex-1 flex flex-col">
          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <MonacoWrapper
              code={code}
              activeFile={activeFile}
              onFileChange={setActiveFile}
              onCodeChange={handleCodeChange}
            />
          </div>

          {/* Live Preview */}
          <div className="h-[40%] border-t border-gray-700">
            <div className="bg-[#2d2d2d] px-3 py-1 text-xs text-gray-400 border-b border-[#333]">
              Live Preview
            </div>
            <div className="h-[calc(100%-28px)]">
              <LivePreview html={code.html} css={code.css} js={code.js} />
            </div>
          </div>
        </div>

        {/* AI Chat Panel */}
        {showChat && (
          <div className="w-80 border-l border-gray-700 flex-shrink-0">
            <AIChatPanel onClose={() => setShowChat(false)} onApplyCode={handleApplyCode} />
          </div>
        )}
      </div>

      {/* Metadata Panel */}
      {showMetadata && (
        <MetadataPanel metadata={metadata} onChange={handleMetadataChange} onClose={() => setShowMetadata(false)} />
      )}
    </div>
  )
}
