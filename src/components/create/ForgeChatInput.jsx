import { useState, useRef, useEffect } from 'react'
import { Send, Square } from 'lucide-react'

export default function ForgeChatInput({ onSend, onStop, isStreaming, disabled }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px'
    }
  }, [input])

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSend = () => {
    if (!input.trim() || isStreaming || disabled) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape' && isStreaming) {
      onStop()
    }
  }

  return (
    <div className="border-t border-gray-800/40 bg-[#0d0d18] p-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-3 text-accent text-sm select-none pointer-events-none">
            &gt;
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? 'Forge arbeitet...' : 'Beschreibe dein Spiel...'}
            disabled={disabled}
            rows={1}
            className="w-full bg-[#0f0f1c] border border-gray-800/50 rounded-lg pl-8 pr-3 py-2.5 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 disabled:opacity-50 font-mono"
          />
        </div>

        {isStreaming ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
            title="Stop (Esc)"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent hover:bg-accent/25 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Senden (Enter)"
          >
            <Send size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-1.5 px-1">
        <span className="text-[10px] text-gray-600 font-mono">
          {isStreaming ? 'Esc zum Stoppen' : 'Enter senden | Shift+Enter Zeile'}
        </span>
        {!import.meta.env.VITE_AI_API_KEY && (
          <span className="text-[10px] text-amber-500/70 font-mono">
            API Key fehlt
          </span>
        )}
      </div>
    </div>
  )
}
