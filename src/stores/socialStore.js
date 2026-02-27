import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useNotificationStore } from './notificationStore'
import { useAchievementStore } from './achievementStore'

export const useSocialStore = create(
  persist(
    (set, get) => ({
      following: [],
      followers: [],
      friends: [],
      friendRequests: [],
      sentRequests: [],

      followUser: (userId) => {
        if (get().following.includes(userId)) return
        set((state) => ({ following: [...state.following, userId] }))
        // Simulate follower on our side
        get().addFollower(userId)
        // Achievement sync
        useAchievementStore.getState()?.setSyncedProgress?.('following_count', get().following.length)
      },

      unfollowUser: (userId) => {
        set((state) => ({ following: state.following.filter((id) => id !== userId) }))
        get().removeFollower(userId)
        useAchievementStore.getState()?.setSyncedProgress?.('following_count', get().following.length)
      },

      addFollower: (userId) => {
        if (get().followers.includes(userId)) return
        set((state) => ({ followers: [...state.followers, userId] }))
        useNotificationStore.getState()?.addNotification?.({
          type: 'follow',
          title: 'Neuer Follower!',
          message: 'Jemand folgt dir jetzt!',
          link: null,
        })
        useAchievementStore.getState()?.setSyncedProgress?.('followers_count', get().followers.length)
      },

      removeFollower: (userId) =>
        set((state) => ({ followers: state.followers.filter((id) => id !== userId) })),

      sendFriendRequest: (userId, username, avatar) => {
        if (get().sentRequests.includes(userId)) return
        if (get().friends.some((f) => f.userId === userId)) return

        const request = {
          id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          fromUserId: userId,
          fromUsername: username,
          fromAvatar: avatar,
          sentAt: new Date().toISOString(),
        }

        set((state) => ({
          sentRequests: [...state.sentRequests, userId],
          friendRequests: [...state.friendRequests, request],
        }))

        useNotificationStore.getState()?.addNotification?.({
          type: 'friend_request',
          title: 'Freundschaftsanfrage!',
          message: `${username} moechte dein Freund sein!`,
          link: '/friends',
        })
      },

      acceptFriendRequest: (requestId) => {
        const request = get().friendRequests.find((r) => r.id === requestId)
        if (!request) return

        const newFriend = {
          userId: request.fromUserId,
          username: request.fromUsername,
          avatar: request.fromAvatar,
          addedAt: new Date().toISOString(),
          isOnline: Math.random() > 0.5,
        }

        set((state) => ({
          friends: [...state.friends, newFriend],
          friendRequests: state.friendRequests.filter((r) => r.id !== requestId),
          sentRequests: state.sentRequests.filter((id) => id !== request.fromUserId),
        }))

        useAchievementStore.getState()?.setSyncedProgress?.('friends_count', get().friends.length)
      },

      declineFriendRequest: (requestId) => {
        const request = get().friendRequests.find((r) => r.id === requestId)
        set((state) => ({
          friendRequests: state.friendRequests.filter((r) => r.id !== requestId),
          sentRequests: request
            ? state.sentRequests.filter((id) => id !== request.fromUserId)
            : state.sentRequests,
        }))
      },

      removeFriend: (userId) =>
        set((state) => ({ friends: state.friends.filter((f) => f.userId !== userId) })),

      isFollowing: (userId) => get().following.includes(userId),

      isFriend: (userId) => get().friends.some((f) => f.userId === userId),

      hasSentRequest: (userId) => get().sentRequests.includes(userId),

      getFollowerCount: () => get().followers.length,

      getFollowingCount: () => get().following.length,

      getFriendCount: () => get().friends.length,

      getOnlineFriends: () => get().friends.filter((f) => f.isOnline),

      simulateOnlineStatus: () =>
        set((state) => ({
          friends: state.friends.map((f) => ({ ...f, isOnline: Math.random() > 0.6 })),
        })),
    }),
    {
      name: 'mindforge-social',
      partialize: (state) => ({
        following: state.following,
        followers: state.followers,
        friends: state.friends,
        friendRequests: state.friendRequests,
        sentRequests: state.sentRequests,
      }),
    }
  )
)
