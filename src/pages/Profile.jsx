import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getUserByUsername } from '../data/mockUsers'
import { mockGames } from '../data/mockGames'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileTabs from '../components/profile/ProfileTabs'
import GameCard from '../components/game/GameCard'
import Modal from '../components/common/Modal'

export default function Profile() {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [activeTab, setActiveTab] = useState('games')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Edit form state
  const [editBio, setEditBio] = useState('')
  const [editWebsite, setEditWebsite] = useState('')
  const [editTwitter, setEditTwitter] = useState('')
  const [editYoutube, setEditYoutube] = useState('')

  useEffect(() => {
    setNotFound(false)
    setProfileUser(null)
    setActiveTab('games')

    // Check if own profile
    if (currentUser && currentUser.username?.toLowerCase() === username.toLowerCase()) {
      setProfileUser(currentUser)
      return
    }

    // Load from mock data
    const user = getUserByUsername(username)
    if (user) {
      setProfileUser(user)
    } else {
      setNotFound(true)
    }
  }, [username, currentUser])

  const isOwnProfile = currentUser && profileUser && currentUser.uid === profileUser.uid

  // Games for this user
  const userGames = profileUser ? mockGames.filter(g => g.creatorId === profileUser.uid) : []
  const favoriteGames = mockGames.slice(0, 4) // Placeholder

  const handleEditOpen = () => {
    setEditBio(profileUser?.bio || '')
    setEditWebsite(profileUser?.socialLinks?.website || '')
    setEditTwitter(profileUser?.socialLinks?.twitter || '')
    setEditYoutube(profileUser?.socialLinks?.youtube || '')
    setIsEditModalOpen(true)
  }

  const handleEditSave = () => {
    // For MVP: update local state
    setProfileUser(prev => ({
      ...prev,
      bio: editBio,
      socialLinks: {
        website: editWebsite,
        twitter: editTwitter,
        youtube: editYoutube,
      }
    }))
    setIsEditModalOpen(false)
  }

  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev)
  }

  // 404
  if (notFound) {
    return (
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-text-muted mb-4">404</h1>
        <p className="text-xl text-text-secondary mb-2">Benutzer nicht gefunden</p>
        <p className="text-text-muted mb-6">Der Benutzer &quot;{username}&quot; existiert nicht.</p>
        <Link to="/" className="text-accent hover:underline">
          Zurueck zur Startseite
        </Link>
      </div>
    )
  }

  // Loading
  if (!profileUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-4 max-w-5xl mx-auto">
      {/* Profile Header */}
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        isLoggedIn={!!currentUser}
        onEditClick={handleEditOpen}
        onFollowClick={handleFollowToggle}
        isFollowing={isFollowing}
      />

      {/* Tabs */}
      <div className="mt-6">
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          gamesCount={userGames.length}
          favoritesCount={favoriteGames.length}
        />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'games' && (
          <div className="flex flex-wrap gap-4">
            {userGames.map(game => <GameCard key={game.id} game={game} />)}
            {userGames.length === 0 && (
              <p className="text-text-muted w-full text-center py-8">
                {isOwnProfile
                  ? 'Du hast noch keine Spiele erstellt.'
                  : 'Dieser User hat noch keine Spiele erstellt.'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="flex flex-wrap gap-4">
            {favoriteGames.map(game => <GameCard key={game.id} game={game} />)}
            {favoriteGames.length === 0 && (
              <p className="text-text-muted w-full text-center py-8">
                Noch keine Favoriten.
              </p>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">&#127942;</p>
            <p className="text-text-secondary">Achievements kommen bald!</p>
            <p className="text-text-muted text-sm mt-2">
              Wird in einem zukuenftigen Update implementiert.
            </p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Profil bearbeiten"
      >
        <div className="space-y-4">
          <div>
            <label>Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Erzaehl etwas ueber dich..."
            />
            <p className="text-text-muted text-xs mt-1 text-right">{editBio.length}/200</p>
          </div>

          <div>
            <label>Website</label>
            <input
              type="text"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              placeholder="https://deine-website.de"
            />
          </div>

          <div>
            <label>Twitter</label>
            <input
              type="text"
              value={editTwitter}
              onChange={(e) => setEditTwitter(e.target.value)}
              placeholder="@deinname"
            />
          </div>

          <div>
            <label>YouTube</label>
            <input
              type="text"
              value={editYoutube}
              onChange={(e) => setEditYoutube(e.target.value)}
              placeholder="@deinkanal"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-bg-card hover:bg-bg-hover text-text-secondary py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              onClick={handleEditSave}
              className="flex-1 bg-accent hover:bg-accent-dark text-white py-2.5 rounded-lg transition-colors cursor-pointer font-semibold"
            >
              Speichern
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
