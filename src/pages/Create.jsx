import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Rocket, Monitor, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useForgeAI } from '../hooks/useForgeAI'
import { usePublishedGames } from '../hooks/usePublishedGames'
import { useGameDrafts } from '../hooks/useGameDrafts'
import { defaultHtml, defaultCss, defaultJs } from '../data/codeTemplates'
import ForgeChat from '../components/create/ForgeChat'
import CodePanel from '../components/create/CodePanel'
import MetadataPanel from '../components/codeEditor/MetadataPanel'

const DRAFT_KEY = 'mindforge_forge_draft'

function loadLastDraft() {
  try {
    const stored = localStorage.getItem(DRAFT_KEY)
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

function persistDraft(data) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  } catch { /* quota exceeded */ }
}

export default function Create() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { publish } = usePublishedGames()
  const { saveDraft } = useGameDrafts()

  // Load draft on mount
  const lastDraft = useRef(loadLastDraft())

  // Code state
  const [code, setCode] = useState(() => {
    if (lastDraft.current?.code) return lastDraft.current.code
    return { html: defaultHtml, css: defaultCss, js: defaultJs }
  })
  const [activeFile, setActiveFile] = useState('html')

  // Metadata state
  const [metadata, setMetadata] = useState(() => {
    if (lastDraft.current?.metadata) return lastDraft.current.metadata
    return { title: '', description: '', subject: '', tags: [], premium: false, price: 0, visibility: 'public' }
  })
  const [showMetadata, setShowMetadata] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  // Panel resize - Chat 38%, Code+Preview 62% (more space for preview)
  const [panelRatio, setPanelRatio] = useState(0.38)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  // AI Hook
  const handleApplyCode = useCallback((blocks) => {
    setCode(prev => ({
      html: blocks.html ?? prev.html,
      css: blocks.css ?? prev.css,
      js: blocks.js ?? prev.js,
    }))
  }, [])

  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopGeneration,
    clearHistory,
    reapplyCode,
    setMessages,
    isMock,
  } = useForgeAI({ code, onApplyCode: handleApplyCode })

  // Restore chat history from draft
  useEffect(() => {
    if (lastDraft.current?.messages?.length > 0) {
      setMessages(lastDraft.current.messages)
    }
  }, [setMessages])

  // Code change handler (manual edits in Monaco)
  const handleCodeChange = useCallback((file, value) => {
    setCode(prev => ({ ...prev, [file]: value }))
  }, [])

  // Metadata change handler
  const handleMetadataChange = useCallback((updates) => {
    setMetadata(prev => ({ ...prev, ...updates }))
  }, [])

  // Save draft manually
  const handleSaveDraft = useCallback(() => {
    const draftData = {
      code: { ...code },
      metadata: { ...metadata },
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        codeBlocks: m.codeBlocks || null,
        codeApplied: m.codeApplied || false,
      })),
      savedAt: Date.now(),
    }
    persistDraft(draftData)

    // Also save to useGameDrafts
    saveDraft({
      id: 'forge-latest',
      mode: 'forge',
      type: 'custom',
      title: metadata.title || 'Unbenanntes Spiel',
      description: metadata.description,
      creatorId: user?.uid || 'unknown',
      creator: user?.displayName || user?.username || 'Anonymous',
      code: { ...code },
      status: 'draft',
    })

    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }, [code, metadata, messages, user, saveDraft])

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length > 0 || code.html !== defaultHtml) {
        persistDraft({
          code: { ...code },
          metadata: { ...metadata },
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
            codeBlocks: m.codeBlocks || null,
            codeApplied: m.codeApplied || false,
          })),
          savedAt: Date.now(),
        })
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [messages, code, metadata])

  // Publish handler
  const handlePublish = useCallback(() => {
    if (!metadata.title.trim()) {
      setShowMetadata(true)
      return
    }

    const gameData = {
      id: `game-forge-${Date.now()}`,
      mode: 'forge',
      type: 'custom',
      title: metadata.title,
      description: metadata.description,
      creator: user?.displayName || user?.username || 'Anonymous',
      creatorId: user?.uid || 'unknown',
      code: { ...code },
      tags: metadata.tags,
      subject: metadata.subject,
      price: metadata.premium ? metadata.price : 0,
      premium: metadata.premium,
      visibility: metadata.visibility,
      thumbnailUrl: null,
      category: 'custom',
    }

    publish(gameData)
    // Clear draft after publish
    localStorage.removeItem(DRAFT_KEY)
    navigate('/browse')
  }, [metadata, code, user, publish, navigate])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S = Save draft
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSaveDraft()
      }
      // Escape = Stop streaming
      if (e.key === 'Escape' && isStreaming) {
        stopGeneration()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSaveDraft, isStreaming, stopGeneration])

  // Resize handler
  const handleResizeStart = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)

    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    const handleMouseMove = (e) => {
      const x = e.clientX - rect.left
      const ratio = Math.max(0.2, Math.min(0.65, x / rect.width))
      setPanelRatio(ratio)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [])

  // Mobile check
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (isMobile) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 text-center">
        <div>
          <Monitor size={48} className="text-accent mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Desktop erforderlich</h2>
          <p className="text-gray-400 text-sm">
            Der Forge KI Game Creator ist nur auf Desktop-Geraeten verfuegbar.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors cursor-pointer"
          >
            Zurueck
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a14] flex flex-col z-[60]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f0f1a] border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="h-5 w-px bg-gray-800" />
          <span className="text-sm font-bold text-white">MindForge</span>
          <span className="text-xs px-2 py-0.5 rounded bg-accent/15 text-accent font-medium">Create</span>
          {isMock && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500/70 font-mono">
              Mock-KI
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save indicator */}
          {savedFlash && (
            <span className="text-xs text-emerald-400 animate-pulse flex items-center gap-1">
              <Save size={12} /> Gespeichert
            </span>
          )}
          <button
            onClick={handleSaveDraft}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-white border border-gray-800 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Ctrl+S"
          >
            <Save size={14} />
          </button>
          <button
            onClick={() => setShowMetadata(true)}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-white border border-gray-800 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            Metadaten
          </button>
          <button
            onClick={() => {
              if (!metadata.title.trim()) {
                setShowMetadata(true)
              } else {
                handlePublish()
              }
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:bg-accent-dark text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Rocket size={14} />
            Publish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="flex-1 flex min-h-0"
        style={{ userSelect: isDragging ? 'none' : 'auto' }}
      >
        {/* Left Panel - Forge Chat */}
        <div style={{ width: `${panelRatio * 100}%` }} className="min-w-0">
          <ForgeChat
            messages={messages}
            isStreaming={isStreaming}
            error={error}
            onSendMessage={sendMessage}
            onStopGeneration={stopGeneration}
            onClearHistory={() => {
              clearHistory()
              setCode({ html: defaultHtml, css: defaultCss, js: defaultJs })
            }}
            onReapply={reapplyCode}
            isMock={isMock}
          />
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleResizeStart}
          className="w-1 bg-[#0f0f1a] hover:bg-accent/20 cursor-col-resize transition-colors flex-shrink-0 flex items-center justify-center group"
        >
          <div className="w-0.5 h-8 bg-gray-800 group-hover:bg-accent rounded-full transition-colors" />
        </div>

        {/* Right Panel - Code + Preview */}
        <div style={{ width: `${(1 - panelRatio) * 100}%` }} className="min-w-0">
          <CodePanel
            code={code}
            activeFile={activeFile}
            onFileChange={setActiveFile}
            onCodeChange={handleCodeChange}
          />
        </div>
      </div>

      {/* Metadata Panel Overlay */}
      {showMetadata && (
        <MetadataPanel
          metadata={metadata}
          onChange={handleMetadataChange}
          onClose={() => setShowMetadata(false)}
        />
      )}
    </div>
  )
}
