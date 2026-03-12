import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useNotificationStore } from './notificationStore'
import { useAchievementStore } from './achievementStore'

const EMPTY_ARR = []

function createDefaultUserData() {
  return {
    following: [],
    followers: [],
    friends: [],
    friendRequests: [],
    sentRequests: [],
  }
}

function getUserData(state) {
  if (!state.currentUserId) return createDefaultUserData()
  return state.userData[state.currentUserId] || createDefaultUserData()
}

// Selectors for components
export const selectFriends = (s) => getUserData(s).friends
export const selectFollowing = (s) => getUserData(s).following
export const selectFollowers = (s) => getUserData(s).followers
export const selectFriendRequests = (s) => getUserData(s).friendRequests

export const useSocialStore = create(
  persist(
    (set, get) => ({
      userData: {},
      currentUserId: null,

      setCurrentUser: (userId) => {
        set((state) => {
          if (userId && !state.userData[userId]) {
            return {
              currentUserId: userId,
              userData: { ...state.userData, [userId]: createDefaultUserData() },
            }
          }
          return { currentUserId: userId }
        })
      },

      followUser: (userId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        const ud = getUserData(get())
        if (ud.following.includes(userId)) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                following: [...currentUd.following, userId],
                followers: currentUd.followers.includes(userId)
                  ? currentUd.followers
                  : [...currentUd.followers, userId],
              },
            },
          }
        })
        useAchievementStore.getState()?.setSyncedProgress?.('following_count', getUserData(get()).following.length)

        useNotificationStore.getState()?.addNotification?.({
          type: 'follow',
          title: 'Neuer Follower!',
          message: 'Jemand folgt dir jetzt!',
          link: null,
        })
        useAchievementStore.getState()?.setSyncedProgress?.('followers_count', getUserData(get()).followers.length)
      },

      unfollowUser: (userId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                following: currentUd.following.filter((id) => id !== userId),
                followers: currentUd.followers.filter((id) => id !== userId),
              },
            },
          }
        })
        useAchievementStore.getState()?.setSyncedProgress?.('following_count', getUserData(get()).following.length)
      },

      addFollower: (userId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        const ud = getUserData(get())
        if (ud.followers.includes(userId)) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                followers: [...currentUd.followers, userId],
              },
            },
          }
        })
        useNotificationStore.getState()?.addNotification?.({
          type: 'follow',
          title: 'Neuer Follower!',
          message: 'Jemand folgt dir jetzt!',
          link: null,
        })
        useAchievementStore.getState()?.setSyncedProgress?.('followers_count', getUserData(get()).followers.length)
      },

      removeFollower: (userId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                followers: currentUd.followers.filter((id) => id !== userId),
              },
            },
          }
        })
      },

      sendFriendRequest: (userId, username, avatar) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        const ud = getUserData(get())
        if (ud.sentRequests.includes(userId)) return
        if (ud.friends.some((f) => f.userId === userId)) return

        const request = {
          id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          fromUserId: userId,
          fromUsername: username,
          fromAvatar: avatar,
          sentAt: new Date().toISOString(),
        }

        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                sentRequests: [...currentUd.sentRequests, userId],
                friendRequests: [...currentUd.friendRequests, request],
              },
            },
          }
        })

        useNotificationStore.getState()?.addNotification?.({
          type: 'friend_request',
          title: 'Freundschaftsanfrage!',
          message: `${username} moechte dein Freund sein!`,
          link: '/friends',
        })
      },

      acceptFriendRequest: (requestId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        const ud = getUserData(get())
        const request = ud.friendRequests.find((r) => r.id === requestId)
        if (!request) return

        const newFriend = {
          userId: request.fromUserId,
          username: request.fromUsername,
          avatar: request.fromAvatar,
          addedAt: new Date().toISOString(),
          isOnline: false,
        }

        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                friends: [...currentUd.friends, newFriend],
                friendRequests: currentUd.friendRequests.filter((r) => r.id !== requestId),
                sentRequests: currentUd.sentRequests.filter((id) => id !== request.fromUserId),
              },
            },
          }
        })

        useAchievementStore.getState()?.setSyncedProgress?.('friends_count', getUserData(get()).friends.length)
      },

      declineFriendRequest: (requestId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        const ud = getUserData(get())
        const request = ud.friendRequests.find((r) => r.id === requestId)

        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                friendRequests: currentUd.friendRequests.filter((r) => r.id !== requestId),
                sentRequests: request
                  ? currentUd.sentRequests.filter((id) => id !== request.fromUserId)
                  : currentUd.sentRequests,
              },
            },
          }
        })
      },

      removeFriend: (userId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                friends: currentUd.friends.filter((f) => f.userId !== userId),
              },
            },
          }
        })
      },

      isFollowing: (userId) => getUserData(get()).following.includes(userId),

      isFriend: (userId) => getUserData(get()).friends.some((f) => f.userId === userId),

      hasSentRequest: (userId) => getUserData(get()).sentRequests.includes(userId),

      getFollowerCount: () => getUserData(get()).followers.length,

      getFollowingCount: () => getUserData(get()).following.length,

      getFriendCount: () => getUserData(get()).friends.length,

      getOnlineFriends: () => getUserData(get()).friends.filter((f) => f.isOnline),

      simulateOnlineStatus: () => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                friends: currentUd.friends.map((f) => ({ ...f, isOnline: Math.random() > 0.6 })),
              },
            },
          }
        })
      },

    }),
    {
      name: 'mindforge-social',
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
)
