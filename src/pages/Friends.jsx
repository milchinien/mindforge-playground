import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mockFriends, mockFriendRequests } from '../data/mockFriends'
import FriendCard from '../components/friends/FriendCard'
import FriendRequestCard from '../components/friends/FriendRequestCard'
import AddFriendModal from '../components/friends/AddFriendModal'
import Tabs from '../components/ui/Tabs'

export default function Friends() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [friends, setFriends] = useState(mockFriends)
  const [requests, setRequests] = useState(mockFriendRequests)
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)

  const onlineFriends = friends.filter(f => f.isOnline)
  const offlineFriends = friends.filter(f => !f.isOnline)

  const TABS = [
    { id: 'all',      label: t('friends.all'),      count: friends.length },
    { id: 'online',   label: t('friends.online'),    count: onlineFriends.length },
    { id: 'offline',  label: t('friends.offline'),   count: offlineFriends.length },
    { id: 'requests', label: t('friends.requests'),  count: requests.length },
  ]

  const handleAcceptRequest = async (friendshipId) => {
    const request = requests.find(r => r.friendshipId === friendshipId)
    if (request) {
      // Anfrage aus Liste entfernen und als Freund hinzufuegen
      setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
      setFriends(prev => [...prev, {
        id: request.id || `friend-${request.uid}`,
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
  }

  const renderFriendList = (friendList) => {
    if (friendList.length === 0) {
      return (
        <div className="text-center py-16">
          <span className="text-5xl block mb-3">{'\u{1F465}'}</span>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            {t('friends.noFriends')}
          </h3>
          <p className="text-text-muted text-sm">
            {t('friends.addFriendsHint')}
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
            {t('friends.noRequests')}
          </h3>
          <p className="text-text-muted text-sm">
            {t('friends.requestsHint')}
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
    <div className="p-6">
      <>
        <title>{t('friends.title')} | MindForge</title>
        <meta name="description" content={t('friends.title')} />
        <meta property="og:title" content={`${t('friends.title')} | MindForge`} />
        <meta property="og:description" content={t('friends.title')} />
        <meta property="og:type" content="website" />
      </>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t('friends.title')}</h1>
        <button
          onClick={() => setShowAddFriendModal(true)}
          className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg
                     font-medium text-sm transition-colors"
        >
          {t('friends.addFriend')}
        </button>
      </div>

      {/* Tab-Navigation */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

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
