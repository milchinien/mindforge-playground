import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockConversations, blockedWords } from '../data/chatData'

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

export const useChatStore = create(
  persist(
    (set, get) => ({
      // Konversationen nach FriendId
      conversations: mockConversations,

      // Ungelesene Nachrichten pro Freund
      unreadCounts: {
        'friend-1': 1,
        'friend-2': 2,
        'friend-3': 0,
        'friend-4': 0,
      },

      // Aktuell geoeffneter Chat
      activeChatId: null,

      // Overlay (Mini-Chat) offen/zu
      overlayOpen: false,
      overlayMinimized: false,

      // Aktiven Chat setzen
      setActiveChat: (friendId) => {
        set({ activeChatId: friendId })
        // Beim Oeffnen als gelesen markieren
        if (friendId) {
          get().markAsRead(friendId)
        }
      },

      // Nachricht senden
      sendMessage: (friendId, text) => {
        const filteredText = filterContent(text)
        const newMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          senderId: 'me',
          text: filteredText,
          timestamp: Date.now(),
          reactions: [],
        }

        set((state) => {
          const conversation = state.conversations[friendId] || {
            friendId,
            messages: [],
          }
          return {
            conversations: {
              ...state.conversations,
              [friendId]: {
                ...conversation,
                messages: [...conversation.messages, newMessage],
              },
            },
          }
        })
      },

      // Nachrichten als gelesen markieren
      markAsRead: (friendId) => {
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [friendId]: 0,
          },
        }))
      },

      // Reaktion auf Nachricht hinzufuegen/entfernen
      toggleReaction: (friendId, messageId, emoji) => {
        set((state) => {
          const conversation = state.conversations[friendId]
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
            conversations: {
              ...state.conversations,
              [friendId]: { ...conversation, messages },
            },
          }
        })
      },

      // Content-Filter exportieren
      filterContent,

      // Gesamtzahl ungelesener Nachrichten
      getTotalUnread: () => {
        const counts = get().unreadCounts
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
      name: 'mindforge-chat',
      partialize: (state) => ({
        conversations: state.conversations,
        unreadCounts: state.unreadCounts,
        activeChatId: state.activeChatId,
      }),
    }
  )
)
