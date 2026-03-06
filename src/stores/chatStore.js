import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { blockedWords, getWelcomeMessages, generateBotResponse } from '../data/chatData'

// Stabile leere Objekte fuer Selektoren (verhindert infinite re-renders bei zustand Object.is Vergleich)
const EMPTY_OBJ = {}

// Content-Filter: Ersetzt verbotene Woerter mit ***
function filterContent(text) {
  if (!text) return text
  let filtered = text
  for (const word of blockedWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    filtered = filtered.replace(regex, '***')
  }
  return filtered
}

// Initialisiert Bot-Konversation fuer einen User
function createBotConversation() {
  return {
    friendId: 'mindforge-ai',
    messages: getWelcomeMessages(),
  }
}

export const useChatStore = create(
  persist(
    (set, get) => ({
      // Alle Konversationen, pro User gespeichert: { [userId]: { [chatId]: conversation } }
      userConversations: {},

      // Ungelesene Nachrichten pro User: { [userId]: { [chatId]: count } }
      userUnreadCounts: {},

      // Aktueller User
      currentUserId: null,

      // Aktuell geoeffneter Chat
      activeChatId: null,

      // Overlay (Mini-Chat) offen/zu
      overlayOpen: false,
      overlayMinimized: false,

      // Aktuellen User setzen (wird beim Login/Auth-Change aufgerufen)
      setCurrentUser: (userId) => {
        const state = get()
        // Bot-Konversation initialisieren falls noch nicht vorhanden
        if (userId && !state.userConversations[userId]) {
          set((s) => ({
            currentUserId: userId,
            activeChatId: null,
            userConversations: {
              ...s.userConversations,
              [userId]: {
                'mindforge-ai': createBotConversation(),
              },
            },
            userUnreadCounts: {
              ...s.userUnreadCounts,
              [userId]: { 'mindforge-ai': 1 },
            },
          }))
        } else {
          set({ currentUserId: userId, activeChatId: null })
        }
      },

      // Konversationen des aktuellen Users holen
      getConversations: () => {
        const { currentUserId, userConversations } = get()
        if (!currentUserId) return EMPTY_OBJ
        return userConversations[currentUserId] || EMPTY_OBJ
      },

      // Unread-Counts des aktuellen Users holen
      getUnreadCounts: () => {
        const { currentUserId, userUnreadCounts } = get()
        if (!currentUserId) return EMPTY_OBJ
        return userUnreadCounts[currentUserId] || EMPTY_OBJ
      },

      // Aktiven Chat setzen
      setActiveChat: (chatId) => {
        set({ activeChatId: chatId })
        if (chatId) {
          get().markAsRead(chatId)
        }
      },

      // Nachricht senden
      sendMessage: (chatId, text) => {
        const { currentUserId } = get()
        if (!currentUserId) return

        const filteredText = filterContent(text)
        const newMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          senderId: 'me',
          text: filteredText,
          timestamp: Date.now(),
          reactions: [],
        }

        set((state) => {
          const userConvs = state.userConversations[currentUserId] || {}
          const conversation = userConvs[chatId] || { friendId: chatId, messages: [] }
          return {
            userConversations: {
              ...state.userConversations,
              [currentUserId]: {
                ...userConvs,
                [chatId]: {
                  ...conversation,
                  messages: [...conversation.messages, newMessage],
                },
              },
            },
          }
        })

        // Bot-Antwort generieren
        if (chatId === 'mindforge-ai') {
          const delay = 800 + Math.random() * 1200
          setTimeout(() => {
            const responseText = generateBotResponse(text)
            const botMessage = {
              id: `msg-bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              senderId: 'mindforge-ai',
              text: responseText,
              timestamp: Date.now(),
              reactions: [],
            }
            set((state) => {
              const uid = state.currentUserId
              if (!uid) return state
              const userConvs = state.userConversations[uid] || {}
              const conversation = userConvs[chatId] || { friendId: chatId, messages: [] }
              const isActive = state.activeChatId === chatId
              return {
                userConversations: {
                  ...state.userConversations,
                  [uid]: {
                    ...userConvs,
                    [chatId]: {
                      ...conversation,
                      messages: [...conversation.messages, botMessage],
                    },
                  },
                },
                userUnreadCounts: isActive ? state.userUnreadCounts : {
                  ...state.userUnreadCounts,
                  [uid]: {
                    ...(state.userUnreadCounts[uid] || {}),
                    [chatId]: ((state.userUnreadCounts[uid] || {})[chatId] || 0) + 1,
                  },
                },
              }
            })
          }, delay)
        }
      },

      // Nachrichten als gelesen markieren
      markAsRead: (chatId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => ({
          userUnreadCounts: {
            ...state.userUnreadCounts,
            [currentUserId]: {
              ...(state.userUnreadCounts[currentUserId] || {}),
              [chatId]: 0,
            },
          },
        }))
      },

      // Reaktion auf Nachricht hinzufuegen/entfernen
      toggleReaction: (chatId, messageId, emoji) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const userConvs = state.userConversations[currentUserId] || {}
          const conversation = userConvs[chatId]
          if (!conversation) return state

          const messages = conversation.messages.map((msg) => {
            if (msg.id !== messageId) return msg
            const hasReaction = msg.reactions.includes(emoji)
            return {
              ...msg,
              reactions: hasReaction
                ? msg.reactions.filter((r) => r !== emoji)
                : [...msg.reactions, emoji],
            }
          })

          return {
            userConversations: {
              ...state.userConversations,
              [currentUserId]: {
                ...userConvs,
                [chatId]: { ...conversation, messages },
              },
            },
          }
        })
      },

      // Content-Filter exportieren
      filterContent,

      // Gesamtzahl ungelesener Nachrichten
      getTotalUnread: () => {
        const counts = get().getUnreadCounts()
        return Object.values(counts).reduce((sum, c) => sum + c, 0)
      },

      // Overlay umschalten
      toggleOverlay: () => {
        set((state) => ({
          overlayOpen: !state.overlayOpen,
          overlayMinimized: false,
        }))
      },

      // Overlay schliessen
      closeOverlay: () => {
        set({ overlayOpen: false, overlayMinimized: false })
      },

      // Overlay minimieren
      minimizeOverlay: () => {
        set({ overlayMinimized: true })
      },

      // Overlay wiederherstellen
      restoreOverlay: () => {
        set({ overlayMinimized: false })
      },
    }),
    {
      name: 'mindforge-chat-v2',
      partialize: (state) => ({
        userConversations: state.userConversations,
        userUnreadCounts: state.userUnreadCounts,
      }),
    }
  )
)
