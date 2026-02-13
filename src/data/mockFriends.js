export const mockFriends = []

export const mockFriendRequests = []

export function getOnlineFriends() {
  return mockFriends.filter(f => f.isOnline)
}

export function getOfflineFriends() {
  return mockFriends.filter(f => !f.isOnline)
}
