import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Settings2, Rocket, Monitor, GripHorizontal } from 'lucide-react'
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

  // Resizable AI panel
  const [aiPanelHeight, setAiPanelHeight] = useState(280)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  const dragStartHeight = useRef(0)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Drag resize handler
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      const delta = dragStartY.current - e.clientY
      const newHeight = Math.max(48, Math.min(window.innerHeight * 0.6, dragStartHeight.current + delta))
      setAiPanelHeight(newHeight)
    }

    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleDragStart = (e) => {
    setIsDragging(true)
    dragStartY.current = e.clientY
    dragStartHeight.current = aiPanelHeight
  }

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
    // Object format from PreviewCard: { html, css, js }
    if (typeof codeBlock === 'object' && codeBlock !== null) {
      setCode(prev => ({
        ...prev,
        ...(codeBlock.html !== undefined ? { html: codeBlock.html } : {}),
        ...(codeBlock.css !== undefined ? { css: codeBlock.css } : {}),
        ...(codeBlock.js !== undefined ? { js: codeBlock.js } : {}),
      }))
      return
    }

    // String format: detect type by content
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
    <div className="fixed inset-0 z-[60] flex flex-col h-screen bg-[#1e1e1e]" style={{ userSelect: isDragging ? 'none' : 'auto' }} data-testid="editor-fullscreen">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-[#181818] px-4 py-2 border-b border-[#2a2a2a] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-200">{metadata.title || 'Neues Spiel'}</span>
          <span className="text-xs text-gray-600 bg-[#2a2a2a] px-2 py-0.5 rounded">Freier Modus</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMetadata(true)}
            className="flex items-center gap-1.5 bg-[#2a2a2a] text-gray-400 hover:text-gray-200 px-3 py-1.5 rounded text-sm transition-colors cursor-pointer"
          >
            <Settings2 size={14} />
            Metadaten
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors cursor-pointer"
          >
            <Rocket size={14} />
            Veroeffentlichen
          </button>
        </div>
      </div>

      {/* Main Content: Editor (left) + Preview (right) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Monaco Editor */}
        <div className="flex-1 min-w-0">
          <MonacoWrapper
            code={code}
            activeFile={activeFile}
            onFileChange={setActiveFile}
            onCodeChange={handleCodeChange}
          />
        </div>

        {/* Live Preview */}
        <div className="w-[40%] border-l border-[#2a2a2a] flex flex-col flex-shrink-0">
          <div className="bg-[#181818] px-3 py-1 text-xs text-gray-500 border-b border-[#2a2a2a] flex-shrink-0">
            Live Preview
          </div>
          <div className="flex-1 min-h-0">
            <LivePreview html={code.html} css={code.css} js={code.js} />
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="h-1 bg-[#2a2a2a] hover:bg-gray-600 cursor-ns-resize flex items-center justify-center flex-shrink-0 transition-colors"
        onMouseDown={handleDragStart}
        data-testid="resize-handle"
      >
        <GripHorizontal size={12} className="text-gray-700" />
      </div>

      {/* AI Panel - always at bottom like VS Code terminal */}
      <div style={{ height: aiPanelHeight }} className="flex-shrink-0" data-testid="ai-panel">
        <AIChatPanel onApplyCode={handleApplyCode} codeContext={code} />
      </div>

      {/* Metadata Panel */}
      {showMetadata && (
        <MetadataPanel metadata={metadata} onChange={handleMetadataChange} onClose={() => setShowMetadata(false)} />
      )}
    </div>
  )
}
