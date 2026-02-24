import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useEscapeKey from '../../hooks/useEscapeKey'

export default function AddFriendModal({ onClose, onSendRequest }) {
  const { t } = useTranslation()
  useEscapeKey(onClose)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [sentRequests, setSentRequests] = useState([])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)

    // MVP: Mock-Suche
    const mockResults = [
      { uid: 'user-301', username: 'NeuerFreund', displayName: 'Neuer Freund', avatar: null },
      { uid: 'user-302', username: 'SpielProfi', displayName: 'Spiel Profi', avatar: null },
      { uid: 'user-303', username: 'LernChampion', displayName: 'Lern Champion', avatar: null },
    ].filter(u =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    setSearchResults(mockResults)
    setIsSearching(false)
    setHasSearched(true)
  }

  const handleSendRequest = (userId) => {
    onSendRequest(userId)
    setSentRequests(prev => [...prev, userId])
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         role="dialog" aria-modal="true" aria-label={t('friends.addFriendTitle')}
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full p-6"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t('friends.addFriendTitle')}</h2>

        {/* Suchfeld */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('friends.searchUsername')}
            className="flex-1 bg-bg-hover text-text-primary border border-gray-600
                       rounded-lg px-4 py-2"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg
                       font-medium transition-colors disabled:opacity-50"
          >
            {isSearching ? '...' : t('friends.search')}
          </button>
        </div>

        {/* Suchergebnisse */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <div key={user.uid}
                 className="flex items-center gap-3 bg-bg-card rounded-lg p-3">
              <div className="w-10 h-10 bg-bg-hover rounded-full flex items-center justify-center
                              text-sm font-bold">
                {user.displayName?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{user.displayName}</p>
                <p className="text-xs text-text-muted">@{user.username}</p>
              </div>
              <button
                onClick={() => handleSendRequest(user.uid)}
                disabled={sentRequests.includes(user.uid)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${sentRequests.includes(user.uid)
                    ? 'bg-bg-hover text-text-muted cursor-default'
                    : 'bg-accent hover:bg-accent-dark text-white'
                  }`}
              >
                {sentRequests.includes(user.uid) ? t('friends.sent') : t('friends.sendRequest')}
              </button>
            </div>
          ))}

          {searchResults.length === 0 && hasSearched && !isSearching && (
            <p className="text-center text-text-muted py-8">
              {t('friends.notFound')}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-bg-hover hover:bg-gray-500 text-text-primary py-2
                     rounded-lg font-medium transition-colors"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  )
}
