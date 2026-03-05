import { Bot, User } from 'lucide-react'
import ForgeCodeBlock from './ForgeCodeBlock'

/**
 * Parse message content into text segments and code blocks.
 */
function parseContent(content) {
  const parts = []
  const regex = /```(html|css|javascript|js)\s*\n([\s\S]*?)```/gi
  let lastIndex = 0
  let match

  while ((match = regex.exec(content)) !== null) {
    // Text before code block
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    const lang = match[1].toLowerCase()
    parts.push({
      type: 'code',
      language: lang === 'javascript' ? 'js' : lang,
      content: match[2].trim(),
    })
    lastIndex = match.index + match[0].length
  }

  // Remaining text
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return parts
}

/**
 * Render inline markdown (bold, inline code, links).
 */
function renderInlineMarkdown(text) {
  // Process bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-[#1a1a2e] px-1.5 py-0.5 rounded text-accent text-xs font-mono">{part.slice(1, -1)}</code>
    }
    return <span key={i}>{part}</span>
  })
}

export default function ForgeChatMessage({ message, onReapply, messageIndex }) {
  const isUser = message.role === 'user'
  const parts = parseContent(message.content)

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} mb-4`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
        isUser ? 'bg-blue-500/10' : 'bg-accent/10'
      }`}>
        {isUser ? (
          <User size={14} className="text-blue-400/70" />
        ) : (
          <Bot size={14} className="text-accent/70" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-full text-left rounded-lg px-3 py-2.5 ${
          isUser
            ? 'bg-blue-500/8 border border-blue-500/10'
            : 'bg-[#111120] border border-gray-800/30'
        }`}>
          {parts.map((part, i) => {
            if (part.type === 'code') {
              return (
                <ForgeCodeBlock
                  key={i}
                  code={part.content}
                  language={part.language}
                  onApply={onReapply ? () => onReapply(messageIndex) : undefined}
                  applied={message.codeApplied}
                />
              )
            }
            // Text part - render as paragraphs
            return (
              <div key={i} className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {part.content.split('\n').map((line, j) => (
                  <p key={j} className={line.trim() ? 'mb-1' : 'mb-2'}>
                    {renderInlineMarkdown(line)}
                  </p>
                ))}
              </div>
            )
          })}

          {/* Streaming indicator */}
          {message.isStreaming && (
            <span className="inline-flex gap-1 ml-1">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}

          {/* Code applied badge */}
          {message.codeApplied && !message.isStreaming && (
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Code in Editor uebernommen
            </div>
          )}

          {/* Error state */}
          {message.hasError && (
            <div className="mt-2 text-xs text-red-400">
              Antwort unvollstaendig - versuche es erneut
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
