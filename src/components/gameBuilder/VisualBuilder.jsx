import { useState, useReducer, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Code, Download, Trash2, Undo2, Redo2, Rocket, Settings2, Eye, EyeOff, Layers } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { usePublishedGames } from '../../hooks/usePublishedGames'
import { createBlockInstance, generateGameCode, BLOCK_TYPES } from '../../data/builderBlocks'
import BlockToolbox from './BlockToolbox'
import BuilderBlock from './BuilderBlock'

// --- Reducer for undo/redo ---
const MAX_HISTORY = 50

function blocksReducer(state, action) {
  switch (action.type) {
    case 'SET_BLOCKS': {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(action.blocks)
      if (newHistory.length > MAX_HISTORY) newHistory.shift()
      return {
        ...state,
        blocks: action.blocks,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    }
    case 'UNDO': {
      if (state.historyIndex <= 0) return state
      const newIndex = state.historyIndex - 1
      return {
        ...state,
        blocks: state.history[newIndex],
        historyIndex: newIndex,
      }
    }
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state
      const newIndex = state.historyIndex + 1
      return {
        ...state,
        blocks: state.history[newIndex],
        historyIndex: newIndex,
      }
    }
    default:
      return state
  }
}

function initBlocksState() {
  return {
    blocks: [],
    history: [[]],
    historyIndex: 0,
  }
}

// --- Main Component ---

export default function VisualBuilder({ onBack }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { publish } = usePublishedGames()

  const [state, dispatch] = useReducer(blocksReducer, null, initBlocksState)
  const { blocks } = state

  const [showPreview, setShowPreview] = useState(true)
  const [previewCode, setPreviewCode] = useState({ html: '', css: '', js: '' })
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishData, setPublishData] = useState({ title: '', description: '', tags: [] })
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [workspaceDragOver, setWorkspaceDragOver] = useState(false)

  const previewIframeRef = useRef(null)
  const workspaceRef = useRef(null)

  // --- Block Operations ---

  const setBlocks = useCallback((newBlocks) => {
    dispatch({ type: 'SET_BLOCKS', blocks: newBlocks })
  }, [])

  const addBlock = useCallback((blockType) => {
    const instance = createBlockInstance(blockType)
    if (!instance) return
    setBlocks([...blocks, instance])
  }, [blocks, setBlocks])

  const updateBlockData = useCallback((blockId, newData) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, data: newData } : b))
  }, [blocks, setBlocks])

  const deleteBlock = useCallback((blockId) => {
    setBlocks(blocks.filter(b => b.id !== blockId))
  }, [blocks, setBlocks])

  const clearAll = useCallback(() => {
    if (blocks.length === 0) return
    if (window.confirm('Alle Bloecke entfernen? Diese Aktion kann rueckgaengig gemacht werden.')) {
      setBlocks([])
    }
  }, [blocks, setBlocks])

  // --- Drag and Drop within workspace ---

  const handleWorkspaceDragStart = useCallback((e, fromIndex) => {
    e.dataTransfer.setData('application/x-workspace-reorder', String(fromIndex))
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleWorkspaceDragOver = useCallback((e, overIndex) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(overIndex)
  }, [])

  const handleWorkspaceDrop = useCallback((e, toIndex) => {
    e.preventDefault()
    setDragOverIndex(null)

    // Reorder within workspace
    const fromIndexStr = e.dataTransfer.getData('application/x-workspace-reorder')
    if (fromIndexStr !== '') {
      const fromIndex = parseInt(fromIndexStr, 10)
      if (isNaN(fromIndex) || fromIndex === toIndex) return
      const newBlocks = [...blocks]
      const [moved] = newBlocks.splice(fromIndex, 1)
      newBlocks.splice(toIndex, 0, moved)
      setBlocks(newBlocks)
      return
    }

    // Drop from toolbox
    const blockType = e.dataTransfer.getData('application/x-builder-block')
    if (blockType) {
      const instance = createBlockInstance(blockType)
      if (!instance) return
      const newBlocks = [...blocks]
      newBlocks.splice(toIndex + 1, 0, instance)
      setBlocks(newBlocks)
    }
  }, [blocks, setBlocks])

  // --- Drop on empty workspace ---

  const handleWorkspaceAreaDrop = useCallback((e) => {
    e.preventDefault()
    setWorkspaceDragOver(false)
    const blockType = e.dataTransfer.getData('application/x-builder-block')
    if (blockType) {
      addBlock(blockType)
    }
  }, [addBlock])

  const handleWorkspaceAreaDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setWorkspaceDragOver(true)
  }, [])

  const handleWorkspaceAreaDragLeave = useCallback((e) => {
    // Only set false if leaving the workspace itself
    if (workspaceRef.current && !workspaceRef.current.contains(e.relatedTarget)) {
      setWorkspaceDragOver(false)
    }
  }, [])

  // --- Preview ---

  const generatePreview = useCallback(() => {
    const code = generateGameCode(blocks)
    setPreviewCode(code)
  }, [blocks])

  // Auto-update preview on block changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      generatePreview()
    }, 600)
    return () => clearTimeout(timer)
  }, [blocks, generatePreview])

  const previewSrcDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${previewCode.css || ''}</style>
</head>
<body>
${previewCode.html || ''}
<script>${previewCode.js || ''}<\/script>
</body>
</html>`

  // --- Code export ---

  const fullCode = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MindForge Quiz</title>
  <style>
${previewCode.css || ''}
  </style>
</head>
<body>
${previewCode.html || ''}
<script>
${previewCode.js || ''}
</script>
</body>
</html>`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fullCode).catch(() => {})
  }

  const handleDownloadCode = () => {
    const blob = new Blob([fullCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mindforge-game.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  // --- Publish ---

  const handlePublish = () => {
    if (!publishData.title.trim()) {
      alert('Bitte gib einen Titel ein.')
      return
    }

    const code = generateGameCode(blocks)
    const publishedGame = {
      id: `game-visual-${Date.now()}`,
      mode: 'visual',
      type: 'quiz',
      title: publishData.title,
      description: publishData.description,
      creator: user?.username || 'Anonym',
      creatorId: user?.uid,
      thumbnail: null,
      screenshots: [],
      tags: publishData.tags.length > 0 ? publishData.tags : ['quiz'],
      subject: 'quiz',
      category: 'quiz',
      price: 0,
      premium: false,
      gameUrl: null,
      code,
      settings: { visibility: 'public' },
      versions: [{ version: 1, date: new Date().toISOString(), note: 'Erstveroeffentlichung' }],
      createdAt: new Date().toISOString(),
    }

    publish(publishedGame)
    navigate('/browse')
  }

  // --- Keyboard shortcuts ---

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        dispatch({ type: 'UNDO' })
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        dispatch({ type: 'REDO' })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // --- Quick-add templates ---
  const quickTemplates = [
    { label: '3-Fragen-Quiz', blocks: ['designBg', 'score', 'timer', 'question', 'question', 'question', 'ifElse'] },
    { label: '5-Fragen-Quiz', blocks: ['designBg', 'score', 'timer', 'loop', 'question', 'question', 'question', 'question', 'question', 'ifElse'] },
  ]

  const applyQuickTemplate = (template) => {
    if (blocks.length > 0 && !window.confirm('Vorhandene Bloecke werden ersetzt. Fortfahren?')) return
    const newBlocks = template.blocks
      .map(type => createBlockInstance(type))
      .filter(Boolean)
    setBlocks(newBlocks)
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col h-screen bg-bg-primary">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-bg-card px-4 py-2 border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-text-muted hover:text-text-primary cursor-pointer transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Layers size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-text-primary">Visual Builder</span>
          </div>
          <span className="text-[10px] text-text-muted bg-bg-secondary px-2 py-0.5 rounded">
            {blocks.length} {blocks.length === 1 ? 'Block' : 'Bloecke'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.historyIndex <= 0}
            className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer transition-colors p-1.5"
            title="Rueckgaengig (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.historyIndex >= state.history.length - 1}
            className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer transition-colors p-1.5"
            title="Wiederherstellen (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>

          <div className="w-px h-5 bg-gray-700 mx-1" />

          {/* Toggle Preview */}
          <button
            onClick={() => setShowPreview(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
              showPreview ? 'bg-accent/20 text-accent' : 'bg-bg-secondary text-text-muted hover:text-text-primary'
            }`}
          >
            {showPreview ? <Eye size={14} /> : <EyeOff size={14} />}
            Vorschau
          </button>

          {/* View Code */}
          <button
            onClick={() => { generatePreview(); setShowCodeModal(true) }}
            className="flex items-center gap-1.5 bg-bg-secondary text-text-muted hover:text-text-primary px-3 py-1.5 rounded text-xs transition-colors cursor-pointer"
          >
            <Code size={14} />
            Code
          </button>

          {/* Clear */}
          <button
            onClick={clearAll}
            disabled={blocks.length === 0}
            className="text-text-muted hover:text-red-400 disabled:opacity-30 cursor-pointer transition-colors p-1.5"
            title="Alle Bloecke loeschen"
          >
            <Trash2 size={16} />
          </button>

          <div className="w-px h-5 bg-gray-700 mx-1" />

          {/* Publish */}
          <button
            onClick={() => { generatePreview(); setShowPublishModal(true) }}
            disabled={blocks.length === 0}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            <Rocket size={14} />
            Veroeffentlichen
          </button>
        </div>
      </div>

      {/* Main Layout: Toolbox | Workspace | Preview */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Toolbox */}
        <BlockToolbox onAddBlock={addBlock} blockCounts={blocks.length} />

        {/* Center: Workspace */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Quick templates bar */}
          {blocks.length === 0 && (
            <div className="bg-bg-secondary/50 border-b border-gray-700/30 px-4 py-2 flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-text-muted">Schnellstart:</span>
              {quickTemplates.map(t => (
                <button
                  key={t.label}
                  onClick={() => applyQuickTemplate(t)}
                  className="bg-bg-card hover:bg-bg-hover border border-gray-700 text-text-secondary hover:text-text-primary px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Workspace drop area */}
          <div
            ref={workspaceRef}
            onDrop={handleWorkspaceAreaDrop}
            onDragOver={handleWorkspaceAreaDragOver}
            onDragLeave={handleWorkspaceAreaDragLeave}
            className={`flex-1 overflow-y-auto p-6 transition-colors ${
              workspaceDragOver ? 'bg-accent/5' : ''
            }`}
          >
            {blocks.length === 0 ? (
              <div className={`h-full flex flex-col items-center justify-center transition-colors rounded-2xl border-2 border-dashed ${
                workspaceDragOver ? 'border-accent bg-accent/5' : 'border-gray-700/50'
              }`}>
                <Layers size={48} className="text-text-muted/30 mb-4" />
                <h3 className="text-lg font-semibold text-text-muted mb-1">Workspace leer</h3>
                <p className="text-sm text-text-muted/60 max-w-md text-center">
                  Ziehe Bloecke aus der Toolbox hierher oder klicke auf einen Block, um ihn hinzuzufuegen.
                  Nutze die Schnellstart-Vorlagen oben fuer einen schnellen Einstieg.
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-3">
                {blocks.map((block, index) => (
                  <BuilderBlock
                    key={block.id}
                    block={block}
                    index={index}
                    totalBlocks={blocks.length}
                    onUpdate={updateBlockData}
                    onDelete={deleteBlock}
                    onMoveUp={() => {
                      if (index === 0) return
                      const newBlocks = [...blocks]
                      ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
                      setBlocks(newBlocks)
                    }}
                    onMoveDown={() => {
                      if (index >= blocks.length - 1) return
                      const newBlocks = [...blocks]
                      ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
                      setBlocks(newBlocks)
                    }}
                    onDragStart={handleWorkspaceDragStart}
                    onDragOver={handleWorkspaceDragOver}
                    onDrop={handleWorkspaceDrop}
                    isDragTarget={dragOverIndex === index}
                  />
                ))}

                {/* Drop zone at the bottom */}
                <div
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }}
                  onDrop={(e) => {
                    e.preventDefault()
                    const blockType = e.dataTransfer.getData('application/x-builder-block')
                    if (blockType) addBlock(blockType)
                  }}
                  className="h-16 border-2 border-dashed border-gray-700/30 rounded-xl flex items-center justify-center text-text-muted/40 text-xs hover:border-gray-600/50 transition-colors"
                >
                  + Block hier ablegen
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        {showPreview && (
          <div className="w-[340px] flex-shrink-0 border-l border-gray-700/50 flex flex-col bg-bg-card">
            <div className="px-3 py-2 border-b border-gray-700/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Play size={12} className="text-accent" />
                <span className="text-xs font-semibold text-text-secondary">Live-Vorschau</span>
              </div>
              <button
                onClick={generatePreview}
                className="text-[10px] text-accent hover:text-accent-dark cursor-pointer transition-colors"
              >
                Aktualisieren
              </button>
            </div>
            <div className="flex-1 min-h-0 p-2">
              <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                <iframe
                  ref={previewIframeRef}
                  srcDoc={previewSrcDoc}
                  className="w-full h-full border-0"
                  title="Visual Builder Vorschau"
                  sandbox="allow-scripts"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60" onClick={() => setShowCodeModal(false)}>
          <div className="bg-bg-card rounded-2xl w-[800px] max-w-[90vw] max-h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50">
              <h3 className="text-sm font-bold text-text-primary">Generierter Code</h3>
              <div className="flex items-center gap-2">
                <button onClick={handleCopyCode} className="text-xs bg-bg-secondary hover:bg-bg-hover text-text-secondary px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                  Kopieren
                </button>
                <button onClick={handleDownloadCode} className="text-xs bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                  <Download size={12} />
                  HTML herunterladen
                </button>
                <button onClick={() => setShowCodeModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer ml-2 text-lg leading-none">&times;</button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap bg-bg-secondary rounded-xl p-4 leading-relaxed">
                {fullCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60" onClick={() => setShowPublishModal(false)}>
          <div className="bg-bg-card rounded-2xl w-[500px] max-w-[90vw] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50">
              <h3 className="text-sm font-bold text-text-primary">Spiel veroeffentlichen</h3>
              <button onClick={() => setShowPublishModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer text-lg leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-text-muted mb-1 font-medium">Titel *</label>
                <input
                  type="text"
                  value={publishData.title}
                  onChange={(e) => setPublishData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Mein Quiz-Spiel"
                  maxLength={100}
                  className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1 font-medium">Beschreibung</label>
                <textarea
                  value={publishData.description}
                  onChange={(e) => setPublishData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Kurze Beschreibung deines Spiels..."
                  rows={3}
                  maxLength={500}
                  className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1 font-medium">Tags (kommagetrennt)</label>
                <input
                  type="text"
                  value={publishData.tags.join(', ')}
                  onChange={(e) => setPublishData(prev => ({
                    ...prev,
                    tags: e.target.value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
                  }))}
                  placeholder="quiz, mathematik, lernen"
                  className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                />
              </div>

              {/* Preview summary */}
              <div className="bg-bg-secondary rounded-xl p-3">
                <p className="text-xs text-text-muted mb-1">Zusammenfassung</p>
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span>{blocks.filter(b => b.type === 'question').length} Fragen</span>
                  <span>{blocks.length} Bloecke gesamt</span>
                  <span>Modus: Visual Builder</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 bg-bg-secondary hover:bg-bg-hover text-text-secondary py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!publishData.title.trim()}
                  className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Rocket size={14} />
                  Veroeffentlichen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
