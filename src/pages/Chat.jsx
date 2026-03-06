import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Smile, Shield, ArrowDown, ArrowLeft, Search, Bot } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import { mindForgeBot, quickReactions } from '../data/chatData'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo } from '../utils/formatters'
import ChatBubble from '../components/chat/ChatBubble'

const DAY = 86400000

// Alle Chat-Kontakte (derzeit nur der Bot)
const chatContacts = [mindForgeBot]

function getDateLabel(timestamp) {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today - DAY)

  if (date.toDateString() === today.toDateString()) return 'Heute'
  if (date.toDateString() === yesterday.toDateString()) return 'Gestern'
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function groupMessagesByDate(messages) {
  const groups = []
  let currentLabel = null

  for (const msg of messages) {
    const label = getDateLabel(msg.timestamp)
    if (label !== currentLabel) {
      currentLabel = label
      groups.push({ type: 'date', label })
    }
    groups.push({ type: 'message', data: msg })
  }
  return groups
}

export default function Chat() {
  const { user } = useAuth()
  const [inputText, setInputText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  const conversations = useChatStore((s) => s.getConversations())
  const unreadCounts = useChatStore((s) => s.getUnreadCounts())
  const activeChatId = useChatStore((s) => s.activeChatId)
  const setActiveChat = useChatStore((s) => s.setActiveChat)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const setCurrentUser = useChatStore((s) => s.setCurrentUser)

  // User im Chat-Store setzen
  useEffect(() => {
    if (user?.uid) {
      setCurrentUser(user.uid)
    }
  }, [user?.uid, setCurrentUser])

  const activeContact = chatContacts.find((f) => f.id === activeChatId)
  const activeConversation = activeChatId ? conversations[activeChatId] : null

  const groupedMessages = useMemo(() => {
    if (!activeConversation) return []
    return groupMessagesByDate(activeConversation.messages)
  }, [activeConversation])

  // Gefilterte Kontaktliste
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return chatContacts
    const q = searchQuery.toLowerCase()
    return chatContacts.filter(
      (f) =>
        f.displayName.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Auto-Scroll nach unten bei neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages?.length])

  // Scroll-Button Logik
  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Nachricht senden
  const handleSend = () => {
    const text = inputText.trim()
    if (!text || !activeChatId) return
    sendMessage(activeChatId, text)
    setInputText('')
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  // Enter-Taste senden
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Emoji einfuegen
  const insertEmoji = (emoji) => {
    setInputText((prev) => prev + emoji)
    inputRef.current?.focus()
  }

  // Letzte Nachricht eines Gespraechs
  const getLastMessage = (contactId) => {
    const conv = conversations[contactId]
    if (!conv || conv.messages.length === 0) return null
    return conv.messages[conv.messages.length - 1]
  }

  return (
    <div className="-m-3 sm:-m-6 -mt-14">
      <>
        <title>Chat | MindForge</title>
        <meta name="description" content="Chatte mit ForgeBot auf MindForge" />
        <meta property="og:title" content="Chat | MindForge" />
        <meta property="og:description" content="Chatte mit ForgeBot auf MindForge" />
        <meta property="og:type" content="website" />
      </>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* ====== LINKE SIDEBAR: Kontaktliste ====== */}
        <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} w-full md:w-80 md:flex-shrink-0 bg-bg-secondary border-r border-gray-700 flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-text-primary mb-3">Nachrichten</h2>
            {/* Suche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kontakt suchen..."
                className="!pl-9 !py-2 !text-sm !rounded-lg !bg-bg-card"
              />
            </div>
          </div>

          {/* Kontaktliste */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                Kein Kontakt gefunden
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const lastMsg = getLastMessage(contact.id)
                const unread = unreadCounts[contact.id] || 0
                const isActive = activeChatId === contact.id

                return (
                  <button
                    key={contact.id}
                    onClick={() => setActiveChat(contact.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      hover:bg-bg-hover cursor-pointer ${
                        isActive ? 'bg-bg-card' : ''
                      }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center text-xl">
                        {contact.isBot ? (
                          <Bot className="w-6 h-6 text-white" />
                        ) : (
                          contact.emoji
                        )}
                      </div>
                      {/* Online-Punkt */}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-secondary
                          ${contact.isOnline ? 'bg-success' : 'bg-gray-500'}`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-sm truncate ${
                          unread > 0 ? 'text-text-primary' : 'text-text-secondary'
                        }`}>
                          {contact.displayName}
                          {contact.isBot && (
                            <span className="ml-1.5 text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full font-medium">
                              AI
                            </span>
                          )}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-text-muted flex-shrink-0 ml-2">
                            {timeAgo(lastMsg.timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className={`text-xs truncate ${
                          unread > 0 ? 'text-text-primary font-medium' : 'text-text-muted'
                        }`}>
                          {lastMsg
                            ? `${lastMsg.senderId === 'me' ? 'Du: ' : ''}${lastMsg.text}`
                            : 'Noch keine Nachrichten'}
                        </p>
                        {unread > 0 && (
                          <span className="flex-shrink-0 ml-2 bg-accent text-white text-[10px] font-bold
                                           rounded-full w-5 h-5 flex items-center justify-center">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ====== RECHTER BEREICH: Chat ====== */}
        <div className={`${!activeChatId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-bg-primary`}>
          {activeChatId && activeContact ? (
            <>
              {/* Chat-Header */}
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-700 bg-bg-secondary">
                {/* Back button for mobile */}
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden text-text-secondary hover:text-text-primary p-1 cursor-pointer"
                  aria-label="Zurueck zur Liste"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {/* Jugendschutz-Hinweis */}
                <Shield className="w-4 h-4 text-success flex-shrink-0 hidden sm:block" />
                <span className="text-[10px] text-success mr-2 flex-shrink-0 hidden sm:inline">
                  Content wird gefiltert
                </span>
                <div className="h-4 w-px bg-gray-600 hidden sm:block" />

                {/* Kontakt-Info */}
                <div className="relative flex-shrink-0 ml-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center text-lg">
                    {activeContact.isBot ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      activeContact.emoji
                    )}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-bg-secondary
                      ${activeContact.isOnline ? 'bg-success' : 'bg-gray-500'}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm flex items-center gap-1.5">
                    {activeContact.displayName}
                    {activeContact.isBot && (
                      <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full font-medium">
                        AI
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    {activeContact.isBot
                      ? 'Dein Lernassistent'
                      : activeContact.isOnline
                        ? 'Online'
                        : `Zuletzt online ${timeAgo(activeContact.lastSeen)}`}
                  </p>
                </div>
              </div>

              {/* Nachrichten-Bereich */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-2 relative"
              >
                {groupedMessages.map((item, i) => {
                  if (item.type === 'date') {
                    return (
                      <div key={`date-${i}`} className="flex items-center justify-center py-3">
                        <span className="text-[11px] text-text-muted bg-bg-secondary px-3 py-1 rounded-full">
                          {item.label}
                        </span>
                      </div>
                    )
                  }
                  return (
                    <ChatBubble
                      key={item.data.id}
                      message={item.data}
                      friendId={activeChatId}
                      isOwn={item.data.senderId === 'me'}
                    />
                  )
                })}
                <div ref={messagesEndRef} />

                {/* Scroll-to-Bottom Button */}
                {showScrollButton && (
                  <button
                    onClick={scrollToBottom}
                    className="sticky bottom-4 left-1/2 -translate-x-1/2 bg-bg-card hover:bg-bg-hover
                               text-text-primary rounded-full p-2 shadow-lg border border-gray-600
                               transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Eingabebereich */}
              <div className="px-3 sm:px-6 py-3 border-t border-gray-700 bg-bg-secondary">
                {/* Emoji-Picker */}
                {showEmojiPicker && (
                  <div className="mb-2 p-3 bg-bg-card rounded-xl border border-gray-600 flex flex-wrap gap-1.5">
                    {quickReactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="text-xl hover:scale-125 transition-transform p-1.5 rounded-lg
                                   hover:bg-bg-hover cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2">
                  {/* Emoji-Button */}
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`flex-shrink-0 p-2.5 rounded-lg transition-colors cursor-pointer ${
                      showEmojiPicker
                        ? 'bg-accent text-white'
                        : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                    }`}
                    aria-label="Emojis"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  {/* Texteingabe */}
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nachricht schreiben..."
                    rows={1}
                    className="flex-1 resize-none !py-2.5 !rounded-xl !text-sm !bg-bg-card
                               max-h-24 overflow-y-auto"
                    style={{ minHeight: '42px' }}
                  />

                  {/* Senden-Button */}
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className={`flex-shrink-0 p-2.5 rounded-lg transition-colors cursor-pointer ${
                      inputText.trim()
                        ? 'bg-accent hover:bg-accent-dark text-white'
                        : 'bg-bg-card text-text-muted cursor-not-allowed'
                    }`}
                    aria-label="Nachricht senden"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ====== LEERER ZUSTAND ====== */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Willkommen im Chat
                </h3>
                <p className="text-text-muted text-sm max-w-xs">
                  Sprich mit ForgeBot, deinem persoenlichen Lernassistenten!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
