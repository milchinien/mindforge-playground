import { useState } from 'react'
import { mockFriends, mockFriendRequests } from '../data/mockFriends'
import FriendCard from '../components/friends/FriendCard'
import FriendRequestCard from '../components/friends/FriendRequestCard'
import AddFriendModal from '../components/friends/AddFriendModal'

export default function Friends() {
  const [activeTab, setActiveTab] = useState('all')
  const [friends, setFriends] = useState(mockFriends)
  const [requests, setRequests] = useState(mockFriendRequests)
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)

  const onlineFriends = friends.filter(f => f.isOnline)
  const offlineFriends = friends.filter(f => !f.isOnline)

  const TABS = [
    { id: 'all',      label: 'Alle',      count: friends.length },
    { id: 'online',   label: 'Online',    count: onlineFriends.length },
    { id: 'offline',  label: 'Offline',   count: offlineFriends.length },
    { id: 'requests', label: 'Anfragen',  count: requests.length },
  ]

  const handleAcceptRequest = async (friendshipId) => {
    const request = requests.find(r => r.friendshipId === friendshipId)
    if (request) {
      // Anfrage aus Liste entfernen und als Freund hinzufuegen
      setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
      setFriends(prev => [...prev, {
        id: `friend-new-${Date.now()}`,
        friendshipId,
        uid: request.uid,
        username: request.username,
        displayName: request.displayName,
        avatar: request.avatar,
        isOnline: false,
        activity: null,
        lastOnline: new Date(),
      }])
    }
  }

  const handleDeclineRequest = async (friendshipId) => {
    setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
  }

  const handleSendRequest = (userId) => {
    // MVP: Nur visuelles Feedback (kein echter API-Call)
    console.log('Freundschaftsanfrage gesendet an:', userId)
  }

  const renderFriendList = (friendList) => {
    if (friendList.length === 0) {
      return (
        <div className="text-center py-16">
          <span className="text-5xl block mb-3">{'\u{1F465}'}</span>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Keine Freunde in dieser Kategorie
          </h3>
          <p className="text-text-muted text-sm">
            Fuege neue Freunde hinzu, um sie hier zu sehen.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {friendList.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    )
  }

  const renderRequests = () => {
    if (requests.length === 0) {
      return (
        <div className="text-center py-16">
          <span className="text-5xl block mb-3">{'\u2709\uFE0F'}</span>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Keine offenen Anfragen
          </h3>
          <p className="text-text-muted text-sm">
            Wenn jemand dir eine Freundschaftsanfrage sendet, erscheint sie hier.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {requests.map((request) => (
          <FriendRequestCard
            key={request.id}
            request={request}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Freunde</h1>
        <button
          onClick={() => setShowAddFriendModal(true)}
          className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg
                     font-medium text-sm transition-colors"
        >
          + Freund hinzufuegen
        </button>
      </div>

      {/* Tab-Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative
              ${activeTab === tab.id ? 'text-accent' : 'text-text-muted hover:text-text-primary'}`}
          >
            {tab.label}
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full
              ${tab.id === 'requests' && tab.count > 0
                ? 'bg-error/20 text-error'
                : 'bg-bg-hover'
              }`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Content basierend auf Tab */}
      {activeTab === 'all' && renderFriendList(friends)}
      {activeTab === 'online' && renderFriendList(onlineFriends)}
      {activeTab === 'offline' && renderFriendList(offlineFriends)}
      {activeTab === 'requests' && renderRequests()}

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <AddFriendModal
          onClose={() => setShowAddFriendModal(false)}
          onSendRequest={handleSendRequest}
        />
      )}
    </div>
  )
}
