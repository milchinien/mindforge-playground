import { useRef, useEffect } from 'react'
import { Bot, Sparkles, Trash2 } from 'lucide-react'
import ForgeChatMessage from './ForgeChatMessage'
import ForgeChatInput from './ForgeChatInput'

const QUICK_PROMPTS = [
  { label: 'Quiz', prompt: 'Erstelle ein interaktives Quiz-Spiel mit 5 Multiple-Choice-Fragen zum Thema Allgemeinwissen. Mit Score-Tracking, Timer pro Frage und einem Ergebnis-Screen am Ende.' },
  { label: 'Memory', prompt: 'Erstelle ein Memory-Kartenspiel mit 8 Paaren. Die Karten sollen sich beim Aufdecken animieren und es soll einen Zug-Zaehler und Timer geben.' },
  { label: 'Lueckentext', prompt: 'Erstelle ein Lueckentext-Spiel bei dem der User fehlende Woerter in Saetze einsetzen muss. Mit Klick-Auswahl und sofortigem Feedback.' },
  { label: 'Karteikarten', prompt: 'Erstelle ein Karteikarten-Lernspiel (Flashcards) mit Flip-Animation. Der User kann Karten als gewusst oder nochmal markieren und am Ende eine Zusammenfassung sehen.' },
]

function WelcomeMessage({ isMock }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 pb-4">
      <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/15 flex items-center justify-center mb-4">
        <Bot size={28} className="text-accent" />
      </div>
      <h2 className="text-lg font-bold text-white mb-1.5">
        Forge KI
      </h2>
      <p className="text-gray-500 text-sm max-w-sm mb-1">
        Willkommen in der Schmiede! Beschreibe mir einfach, was fuer ein Lernspiel du erstellen moechtest.
      </p>
      <p className="text-gray-600 text-xs mb-4">
        Du kannst jederzeit Aenderungen anfordern.
      </p>
      {isMock && (
        <p className="text-amber-500/50 text-[10px] font-mono">
          Mock-Modus aktiv &middot; Vorgefertigte Templates
        </p>
      )}
    </div>
  )
}

function SuggestionChips({ onSelect }) {
  return (
    <div className="px-4 pb-2">
      <p className="text-[10px] text-gray-600 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
        <Sparkles size={10} /> Schnellstart
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.label}
            onClick={() => onSelect(item.prompt)}
            className="px-2.5 py-1 bg-white/[0.03] border border-gray-800 rounded-md text-[11px] text-gray-400 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-colors cursor-pointer font-mono"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ForgeChat({
  messages,
  isStreaming,
  error,
  onSendMessage,
  onStopGeneration,
  onClearHistory,
  onReapply,
  isMock,
}) {
  const scrollRef = useRef(null)
  const hasMessages = messages.length > 0

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-[#0a0a14]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800/40 bg-[#0d0d18]">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-accent" />
          <span className="text-xs font-semibold text-gray-300 font-mono">Forge KI</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-accent animate-pulse' : 'bg-emerald-500/60'}`} />
        </div>
        {hasMessages && (
          <button
            onClick={onClearHistory}
            className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer p-1 rounded hover:bg-white/5"
            title="Chat leeren (Reset)"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {!hasMessages ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
              <WelcomeMessage isMock={isMock} />
            </div>
            <SuggestionChips onSelect={onSendMessage} />
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {messages.map((msg, i) => (
              <ForgeChatMessage
                key={i}
                message={msg}
                messageIndex={i}
                onReapply={msg.codeBlocks ? onReapply : undefined}
              />
            ))}

            {error && (
              <div className="mx-10 px-3 py-2 bg-red-500/5 border border-red-500/15 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick prompts below messages */}
      {hasMessages && !isStreaming && (
        <SuggestionChips onSelect={onSendMessage} />
      )}

      {/* Input */}
      <ForgeChatInput
        onSend={onSendMessage}
        onStop={onStopGeneration}
        isStreaming={isStreaming}
      />
    </div>
  )
}
