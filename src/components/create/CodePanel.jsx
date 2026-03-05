import { useState, useCallback } from 'react'
import { GripHorizontal, Eye, Code2 } from 'lucide-react'
import MonacoWrapper from '../codeEditor/MonacoWrapper'
import LivePreview from '../codeEditor/LivePreview'

export default function CodePanel({ code, activeFile, onFileChange, onCodeChange }) {
  const [editorRatio, setEditorRatio] = useState(0.4)
  const [isDragging, setIsDragging] = useState(false)
  const [activeView, setActiveView] = useState('split') // 'split', 'code', 'preview'

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)

    const container = e.target.closest('[data-code-panel]')
    if (!container) return
    const rect = container.getBoundingClientRect()

    const handleMouseMove = (e) => {
      const y = e.clientY - rect.top
      const ratio = Math.max(0.15, Math.min(0.85, y / rect.height))
      setEditorRatio(ratio)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [])

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]" data-code-panel>
      {/* View Toggle */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#181818] border-b border-[#333]">
        <div className="flex gap-1">
          {[
            { id: 'split', icon: null, label: 'Split' },
            { id: 'code', icon: Code2, label: 'Code' },
            { id: 'preview', icon: Eye, label: 'Preview' },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                activeView === view.id
                  ? 'bg-accent/15 text-accent'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {view.icon && <view.icon size={12} />}
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col" style={{ userSelect: isDragging ? 'none' : 'auto' }}>
        {/* Code Editor */}
        {activeView !== 'preview' && (
          <div style={{ height: activeView === 'code' ? '100%' : `${editorRatio * 100}%` }} className="min-h-0">
            <MonacoWrapper
              code={code}
              activeFile={activeFile}
              onFileChange={onFileChange}
              onCodeChange={onCodeChange}
            />
          </div>
        )}

        {/* Resize Handle (only in split mode) */}
        {activeView === 'split' && (
          <div
            onMouseDown={handleMouseDown}
            className="flex items-center justify-center h-2 bg-[#252526] hover:bg-accent/20 cursor-row-resize transition-colors border-y border-[#333] flex-shrink-0"
          >
            <GripHorizontal size={14} className="text-gray-600" />
          </div>
        )}

        {/* Live Preview */}
        {activeView !== 'code' && (
          <div style={{ height: activeView === 'preview' ? '100%' : `${(1 - editorRatio) * 100}%` }} className="min-h-0">
            <div className="h-full flex flex-col">
              <div className="px-3 py-1 bg-[#181818] border-b border-[#333] flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Preview</span>
              </div>
              <div className="flex-1 min-h-0">
                <LivePreview html={code.html} css={code.css} js={code.js} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
