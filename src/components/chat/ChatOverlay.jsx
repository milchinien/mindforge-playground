import { useState, useRef, useEffect, useMemo } from 'react'
import { MessageCircle, X, Minus, Send, Smile, ArrowLeft, Shield } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'
import { chatFriends, quickReactions } from '../../data/chatData'
import { timeAgo } from '../../utils/formatters'
import ChatBubble from './ChatBubble'

export default function ChatOverlay() {
  const [inputText, setInputText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedFriendId, setSelectedFriendId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const conversations = useChatStore((s) => s.conversations)
  const unreadCounts = useChatStore((s) => s.unreadCounts)
  const overlayOpen = useChatStore((s) => s.overlayOpen)
  const overlayMinimized = useChatStore((s) => s.overlayMinimized)
  const toggleOverlay = useChatStore((s) => s.toggleOverlay)
  const closeOverlay = useChatStore((s) => s.closeOverlay)
  const minimizeOverlay = useChatStore((s) => s.minimizeOverlay)
  const restoreOverlay = useChatStore((s) => s.restoreOverlay)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const markAsRead = useChatStore((s) => s.markAsRead)
  const getTotalUnread = useChatStore((s) => s.getTotalUnread)

  const totalUnread = getTotalUnread()
  const selectedFriend = chatFriends.find((f) => f.id === selectedFriendId)
  const activeConversation = selectedFriendId ? conversations[selectedFriendId] : null

  // Auto-Scroll bei neuen Nachrichten
  useEffect(() => {
    if (selectedFriendId && overlayOpen && !overlayMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeConversation?.messages?.length, selectedFriendId, overlayOpen, overlayMinimized])

  // Beim Oeffnen eines Chats: als gelesen markieren
  useEffect(() => {
    if (selectedFriendId && overlayOpen && !overlayMinimized) {
      markAsRead(selectedFriendId)
    }
  }, [selectedFriendId, overlayOpen, overlayMinimized, markAsRead])

  // Nachricht senden
  const handleSend = () => {
    const text = inputText.trim()
    if (!text || !selectedFriendId) return
    sendMessage(selectedFriendId, text)
    setInputText('')
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insertEmoji = (emoji) => {
    setInputText((prev) => prev + emoji)
    inputRef.current?.focus()
  }

  const getLastMessage = (friendId) => {
    const conv = conversations[friendId]
    if (!conv || conv.messages.length === 0) return null
    return conv.messages[conv.messages.length - 1]
  }

  const handleSelectFriend = (friendId) => {
    setSelectedFriendId(friendId)
    markAsRead(friendId)
  }

  const handleBack = () => {
    setSelectedFriendId(null)
    setShowEmojiPicker(false)
    setInputText('')
  }

  // Datum-Gruppen fuer Nachrichten
  const groupedMessages = useMemo(() => {
    if (!activeConversation) return []
    const groups = []
    let currentDate = null
    for (const msg of activeConversation.messages) {
      const date = new Date(msg.timestamp).toDateString()
      if (date !== currentDate) {
        currentDate = date
        const d = new Date(msg.timestamp)
        const today = new Date()
        let label
        if (d.toDateString() === today.toDateString()) label = 'Heute'
        else if (d.toDateString() === new Date(today - 86400000).toDateString()) label = 'Gestern'
        else label = d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })
        groups.push({ type: 'date', label })
      }
      groups.push({ type: 'message', data: msg })
    }
    return groups
  }, [activeConversation])

  return (
    <>
      {/* ====== SCHWEBENDER BUTTON ====== */}
      <button
        onClick={overlayMinimized ? restoreOverlay : toggleOverlay}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-accent hover:bg-accent-dark text-white
                   rounded-full w-14 h-14 flex items-center justify-center shadow-xl
                   transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Chat oeffnen"
      >
        <MessageCircle className="w-6 h-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold
                           rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {/* ====== MINI-CHAT PANEL ====== */}
      {overlayOpen && !overlayMinimized && (
        <div className="fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 h-[60vh] sm:h-[28rem] bg-bg-secondary rounded-2xl
                        shadow-2xl border border-gray-700 flex flex-col overflow-hidden
                        animate-in slide-in-from-bottom-4">
          {/* Panel-Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-bg-card border-b border-gray-700">
            <div className="flex items-center gap-2">
              {selectedFriendId ? (
                <>
                  <button
                    onClick={handleBack}
                    className="text-text-muted hover:text-text-primary p-1 cursor-pointer"
                    aria-label="Zurueck"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-7 h-7 bg-bg-hover rounded-full flex items-center justify-center text-sm">
                    {selectedFriend?.emoji}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text-primary">
                      {selectedFriend?.displayName}
                    </span>
                    {selectedFriend?.isOnline && (
                      <span className="block text-[9px] text-success leading-tight">Online</span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-text-primary">Nachrichten</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={minimizeOverlay}
                className="text-text-muted hover:text-text-primary p-1 cursor-pointer"
                aria-label="Minimieren"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={closeOverlay}
                className="text-text-muted hover:text-text-primary p-1 cursor-pointer"
                aria-label="Schliessen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Jugendschutz-Hinweis */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-success/10 border-b border-gray-700">
            <Shield className="w-3 h-3 text-success" />
            <span className="text-[9px] text-success">Content wird gefiltert</span>
          </div>

          {selectedFriendId ? (
            /* ====== Chat-Ansicht ====== */
            <>
              {/* Nachrichten */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
                {groupedMessages.map((item, i) => {
                  if (item.type === 'date') {
                    return (
                      <div key={`date-${i}`} className="flex justify-center py-1">
                        <span className="text-[9px] text-text-muted bg-bg-card px-2 py-0.5 rounded-full">
                          {item.label}
                        </span>
                      </div>
                    )
                  }
                  return (
                    <ChatBubble
                      key={item.data.id}
                      message={item.data}
                      friendId={selectedFriendId}
                      isOwn={item.data.senderId === 'me'}
                    />
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Eingabe */}
              <div className="px-3 py-2 border-t border-gray-700">
                {showEmojiPicker && (
                  <div className="mb-2 flex flex-wrap gap-1 p-2 bg-bg-card rounded-lg border border-gray-600">
                    {quickReactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="text-sm hover:scale-110 transition-transform p-1 cursor-pointer
                                   rounded hover:bg-bg-hover"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`flex-shrink-0 p-2 rounded-lg transition-colors cursor-pointer ${
                      showEmojiPicker
                        ? 'bg-accent text-white'
                        : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                    }`}
                    aria-label="Emojis"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nachricht..."
                    className="!py-2 !text-xs !rounded-lg !bg-bg-card flex-1"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className={`flex-shrink-0 p-2 rounded-lg transition-colors cursor-pointer ${
                      inputText.trim()
                        ? 'bg-accent hover:bg-accent-dark text-white'
                        : 'bg-bg-card text-text-muted cursor-not-allowed'
                    }`}
                    aria-label="Senden"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ====== Freundesliste ====== */
            <div className="flex-1 overflow-y-auto">
              {chatFriends.map((friend) => {
                const lastMsg = getLastMessage(friend.id)
                const unread = unreadCounts[friend.id] || 0

                return (
                  <button
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left
                               hover:bg-bg-hover transition-colors cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 bg-bg-hover rounded-full flex items-center justify-center text-base">
                        {friend.emoji}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-bg-secondary
                          ${friend.isOnline ? 'bg-success' : 'bg-gray-500'}`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold truncate ${
                          unread > 0 ? 'text-text-primary' : 'text-text-secondary'
                        }`}>
                          {friend.displayName}
                        </span>
                        {lastMsg && (
                          <span className="text-[9px] text-text-muted flex-shrink-0 ml-1">
                            {timeAgo(lastMsg.timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-[11px] truncate ${
                          unread > 0 ? 'text-text-primary' : 'text-text-muted'
                        }`}>
                          {lastMsg
                            ? `${lastMsg.senderId === 'me' ? 'Du: ' : ''}${lastMsg.text}`
                            : 'Keine Nachrichten'}
                        </p>
                        {unread > 0 && (
                          <span className="flex-shrink-0 ml-1 bg-accent text-white text-[9px] font-bold
                                           rounded-full w-4 h-4 flex items-center justify-center">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
