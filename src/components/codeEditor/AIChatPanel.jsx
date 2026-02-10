import { useState, useRef, useEffect } from 'react'
import { X, Send, Copy, Check } from 'lucide-react'
import { useAIChat } from '../../hooks/useAIChat'

function CodeBlock({ code, language, onApply }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-gray-600">
      <div className="flex items-center justify-between bg-[#2d2d2d] px-3 py-1">
        <span className="text-xs text-gray-400">{language || 'code'}</span>
        <div className="flex gap-1">
          <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer">
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Kopiert' : 'Kopieren'}
          </button>
          {onApply && (
            <button onClick={() => onApply(code)} className="text-xs text-accent hover:text-accent-light flex items-center gap-1 cursor-pointer ml-2">
              Code uebernehmen
            </button>
          )}
        </div>
      </div>
      <pre className="p-3 text-sm overflow-x-auto bg-[#1e1e1e]">
        <code className="text-gray-300">{code}</code>
      </pre>
    </div>
  )
}

function MessageContent({ content, onApplyCode }) {
  // Parse code blocks from content
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n?([\s\S]*?)```/)
          if (match) {
            return <CodeBlock key={i} language={match[1]} code={match[2].trim()} onApply={onApplyCode} />
          }
        }
        return <span key={i}>{part}</span>
      })}
    </div>
  )
}

export default function AIChatPanel({ onClose, onApplyCode }) {
  const { messages, isLoading, sendMessage, requestCount, maxRequests } = useAIChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div>
          <h3 className="text-sm font-semibold">KI-Assistent</h3>
          <p className="text-xs text-text-muted">{requestCount} von {maxRequests} Anfragen</p>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary cursor-pointer">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-xl px-3 py-2 ${
              msg.role === 'user'
                ? 'bg-accent text-white'
                : 'bg-bg-card text-text-primary'
            }`}>
              <MessageContent content={msg.content} onApplyCode={msg.role === 'assistant' ? onApplyCode : undefined} />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-bg-card rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Beschreibe was du brauchst..."
            className="!flex-1 !text-sm !py-2"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-accent hover:bg-accent-dark text-white p-2 rounded-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
