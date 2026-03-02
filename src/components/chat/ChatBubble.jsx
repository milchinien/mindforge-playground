import { memo, useState } from 'react'
import { quickReactions } from '../../data/chatData'
import { useChatStore } from '../../stores/chatStore'

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default memo(function ChatBubble({ message, friendId, isOwn }) {
  const [showReactions, setShowReactions] = useState(false)
  const toggleReaction = useChatStore((s) => s.toggleReaction)

  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} group`}>
      {/* Nachrichtenblase */}
      <div
        className={`relative max-w-[75%] px-4 py-2.5 break-words ${
          isOwn
            ? 'bg-accent text-white rounded-2xl rounded-br-md'
            : 'bg-bg-card text-text-primary rounded-2xl rounded-bl-md'
        }`}
        onDoubleClick={() => setShowReactions(!showReactions)}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>

      {/* Reaktionen anzeigen */}
      {message.reactions.length > 0 && (
        <div className={`flex gap-1 mt-0.5 ${isOwn ? 'mr-2' : 'ml-2'}`}>
          {message.reactions.map((emoji, i) => (
            <button
              key={i}
              onClick={() => toggleReaction(friendId, message.id, emoji)}
              className="text-xs bg-bg-card hover:bg-bg-hover rounded-full px-1.5 py-0.5
                         border border-gray-600 transition-colors cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Reaktion-Picker (bei Doppelklick) */}
      {showReactions && (
        <div
          className={`flex flex-wrap gap-1 mt-1 p-2 bg-bg-secondary rounded-xl border border-gray-600
                      shadow-lg max-w-[240px] ${isOwn ? 'mr-2' : 'ml-2'}`}
        >
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                toggleReaction(friendId, message.id, emoji)
                setShowReactions(false)
              }}
              className="text-base hover:scale-125 transition-transform p-1 cursor-pointer
                         rounded hover:bg-bg-hover"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Zeitstempel */}
      <span
        className={`text-[10px] text-text-muted mt-0.5 ${isOwn ? 'mr-2' : 'ml-2'}`}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  )
})
