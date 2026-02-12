import { useState, useRef, useEffect } from 'react'
import { Send, Copy, Check, ChevronDown, ChevronUp, Code2, Zap, Eye, EyeOff, Bot } from 'lucide-react'
import { useAIChat } from '../../hooks/useAIChat'

function parseCodeBlocks(text) {
  const blocks = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let match
  while ((match = regex.exec(text)) !== null) {
    blocks.push({ language: match[1] || 'code', code: match[2].trim() })
  }
  return blocks
}

function CodeBlock({ code, language, onApply }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-gray-600">
      <div className="flex items-center justify-between bg-[#1a1a2e] px-3 py-1">
        <span className="text-xs text-gray-400 font-mono">{language || 'code'}</span>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer">
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Kopiert' : 'Kopieren'}
          </button>
          {onApply && (
            <button onClick={() => onApply(code)} className="text-xs text-accent hover:text-accent-light flex items-center gap-1 cursor-pointer">
              Code uebernehmen
            </button>
          )}
        </div>
      </div>
      <pre className="p-3 text-sm overflow-x-auto bg-[#0d1117] max-h-[200px]">
        <code className="text-gray-300 font-mono text-xs">{code}</code>
      </pre>
    </div>
  )
}

function PreviewCard({ card, codeResponse, onApplyCode }) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inserted, setInserted] = useState(false)

  const codeBlocks = parseCodeBlocks(codeResponse)

  const handleInsertAll = () => {
    const codeObj = {}
    codeBlocks.forEach(block => {
      if (block.language === 'html') codeObj.html = block.code
      else if (block.language === 'css') codeObj.css = block.code
      else if (block.language === 'javascript' || block.language === 'js') codeObj.js = block.code
    })
    onApplyCode(codeObj)
    setInserted(true)
    setTimeout(() => setInserted(false), 3000)
  }

  const handleCopyAll = () => {
    const allCode = codeBlocks.map(b => `/* ${b.language} */\n${b.code}`).join('\n\n')
    navigator.clipboard.writeText(allCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const difficultyLabel = card.difficulty === 1 ? 'Einsteiger' : card.difficulty === 2 ? 'Mittel' : 'Fortgeschritten'
  const difficultyColor = card.difficulty === 1
    ? 'text-green-400 border-green-400/30 bg-green-400/10'
    : card.difficulty === 2
      ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
      : 'text-red-400 border-red-400/30 bg-red-400/10'

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[#333] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] shadow-lg" data-testid="preview-card">
      {/* Card Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#333]">
        <span className="text-2xl">{card.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-bold text-sm">{card.label}</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${difficultyColor} font-medium`}>
              {difficultyLabel}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-0.5">{card.description}</p>
        </div>
      </div>

      {/* Code Info Bar */}
      <div className="px-4 py-2 flex items-center gap-2 text-xs text-gray-500 bg-[#0f0f1a]/50">
        <Code2 size={12} />
        <span>{codeBlocks.length} Code-Dateien</span>
        {codeBlocks.map((b, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-[#2a2a2a] rounded text-[10px] text-gray-400">
            {b.language}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 px-4 py-3 border-t border-[#333]">
        <button
          onClick={handleInsertAll}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            inserted
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30 hover:border-accent/50'
          }`}
          data-testid="insert-btn"
        >
          {inserted ? (
            <><Check size={14} /> Eingefuegt!</>
          ) : (
            <><Zap size={14} /> Einfuegen</>
          )}
        </button>
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white rounded-lg text-sm transition-all cursor-pointer border border-[#444]"
          data-testid="toggle-code-btn"
        >
          {showCode ? <EyeOff size={14} /> : <Eye size={14} />}
          {showCode ? 'Ausblenden' : 'Code'}
        </button>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white rounded-lg text-sm transition-all cursor-pointer border border-[#444]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>

      {/* Expandable Code Section */}
      {showCode && (
        <div className="border-t border-[#333] max-h-[300px] overflow-y-auto">
          {codeBlocks.map((block, i) => (
            <div key={i}>
              <div className="flex items-center justify-between bg-[#1a1a2e] px-3 py-1 border-t border-[#333]">
                <span className="text-xs text-gray-400 font-mono">{block.language}</span>
                <button
                  onClick={() => {
                    const lang = block.language === 'javascript' || block.language === 'js' ? 'js' : block.language
                    onApplyCode({ [lang]: block.code })
                  }}
                  className="text-xs text-accent hover:text-accent-light cursor-pointer"
                >
                  Nur diesen Code
                </button>
              </div>
              <pre className="p-3 text-sm overflow-x-auto bg-[#0d1117]">
                <code className="text-gray-300 font-mono text-xs">{block.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Achievement-style insertion message */}
      {inserted && (
        <div className="px-4 py-2 bg-green-500/10 border-t border-green-500/20 text-center">
          <span className="text-green-400 text-xs font-medium" data-testid="forge-achievement">🎮 Component erfolgreich geschmiedet und eingefuegt!</span>
        </div>
      )}
    </div>
  )
}

function MessageContent({ content, onApplyCode }) {
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
        // Bold text
        const boldParts = part.split(/(\*\*[\s\S]*?\*\*)/g)
        return boldParts.map((bp, j) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={`${i}-${j}`} className="text-text-primary">{bp.slice(2, -2)}</strong>
          }
          // Inline code
          const codeParts = bp.split(/(`[^`]+`)/g)
          return codeParts.map((cp, k) => {
            if (cp.startsWith('`') && cp.endsWith('`')) {
              return <code key={`${i}-${j}-${k}`} className="bg-[#1a1a2e] px-1.5 py-0.5 rounded text-accent font-mono text-xs">{cp.slice(1, -1)}</code>
            }
            return <span key={`${i}-${j}-${k}`}>{cp}</span>
          })
        })
      })}
    </div>
  )
}

function SuggestionChips({ suggestions, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2" data-testid="ai-suggestions">
      {suggestions.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id, s.label)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] hover:border-gray-500 rounded-lg text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
          data-testid={`suggestion-${s.id}`}
        >
          <span>{s.icon}</span>
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function AIChatPanel({ onApplyCode, codeContext }) {
  const { messages, isLoading, sendMessage, requestCount, maxRequests } = useAIChat(codeContext)
  const [input, setInput] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [autoApply, setAutoApply] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const lastProcessedIdx = useRef(0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-apply: automatically insert code when new assistant messages with codeResponse arrive
  useEffect(() => {
    if (!autoApply) return
    const newMessages = messages.slice(lastProcessedIdx.current)
    lastProcessedIdx.current = messages.length
    for (const msg of newMessages) {
      if (msg.role === 'assistant' && msg.codeResponse) {
        const blocks = []
        const regex = /```(\w*)\n?([\s\S]*?)```/g
        let match
        while ((match = regex.exec(msg.codeResponse)) !== null) {
          blocks.push({ language: match[1] || 'code', code: match[2].trim() })
        }
        if (blocks.length > 0) {
          const codeObj = {}
          blocks.forEach(block => {
            if (block.language === 'html') codeObj.html = block.code
            else if (block.language === 'css') codeObj.css = block.code
            else if (block.language === 'javascript' || block.language === 'js') codeObj.js = block.code
          })
          onApplyCode(codeObj)
        }
      }
    }
  }, [messages, autoApply, onApplyCode])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const handleSuggestionClick = (categoryId, label) => {
    sendMessage(label, categoryId)
  }

  if (isMinimized) {
    return (
      <div className="bg-[#181818] border-t border-[#2a2a2a]">
        <div
          className="flex items-center justify-between px-3 py-1 cursor-pointer hover:bg-[#222]"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-white bg-[#2d2d2d] border-b-2 border-accent">
              <span className="text-sm">🤖</span>
              FORGE
            </div>
            <span className="text-xs text-gray-500">{requestCount}/{maxRequests} Anfragen</span>
          </div>
          <button className="text-gray-400 hover:text-white p-1 cursor-pointer">
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#181818] border-t border-[#2a2a2a]" style={{ height: '100%' }}>
      {/* Tab Bar */}
      <div className="flex items-center justify-between bg-[#1a1a1a] border-b border-[#2a2a2a] flex-shrink-0">
        <div className="flex items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-[#181818] border-b-2 border-accent">
            <span className="text-sm">🤖</span>
            FORGE
          </div>
          <span className="text-xs text-gray-500 ml-3">{requestCount}/{maxRequests} Anfragen</span>
        </div>
        <div className="flex items-center gap-1 pr-2">
          <button
            onClick={() => setAutoApply(!autoApply)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
              autoApply
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'bg-[#2a2a2a] text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
            title={autoApply ? 'Auto-Code-Einfuegen aktiv' : 'Auto-Code-Einfuegen aktivieren'}
          >
            <Bot size={11} />
            Auto
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white p-1 cursor-pointer"
            title="Minimieren"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((msg, i) => {
          if (msg.hidden) return null
          return (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-accent/30 to-orange-600/20 flex items-center justify-center mt-0.5 border border-accent/20">
                  <span className="text-sm">🤖</span>
                </div>
              )}
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                msg.role === 'user'
                  ? 'bg-[#264f78] text-white'
                  : 'bg-[#252526] text-gray-300'
              }`}>
                {msg.card ? (
                  <>
                    <MessageContent content={msg.content} />
                    <PreviewCard card={msg.card} codeResponse={msg.codeResponse} onApplyCode={onApplyCode} />
                  </>
                ) : (
                  <MessageContent content={msg.content} onApplyCode={msg.role === 'assistant' ? onApplyCode : undefined} />
                )}
                {msg.suggestions && !isLoading && (
                  <SuggestionChips suggestions={msg.suggestions} onSelect={handleSuggestionClick} />
                )}
              </div>
            </div>
          )
        })}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-accent/30 to-orange-600/20 flex items-center justify-center mt-0.5 border border-accent/20">
              <span className="text-sm animate-bounce">⚒️</span>
            </div>
            <div className="bg-[#252526] rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">Forge schmiedet</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Terminal-style Input */}
      <div className="flex-shrink-0 border-t border-[#2a2a2a] bg-[#181818]">
        <div className="flex items-center px-3 py-2 gap-2">
          <span className="text-accent font-mono text-sm font-bold select-none">⚒️</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Sag Forge was du brauchst... (z.B. 'erstelle ein quiz')"
            className="!flex-1 !bg-transparent !border-none !outline-none !ring-0 !text-sm !text-gray-200 !font-mono !py-1 !px-0 placeholder:text-gray-600"
            disabled={isLoading}
            data-testid="ai-input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="text-accent hover:text-accent-light disabled:text-gray-600 cursor-pointer disabled:cursor-not-allowed transition-colors p-1"
            data-testid="ai-send-btn"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
