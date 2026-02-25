import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { getUserByUsername } from '../data/mockUsers'
import { mockGames } from '../data/mockGames'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileTabs from '../components/profile/ProfileTabs'
import GameCard from '../components/game/GameCard'
import Modal from '../components/common/Modal'

export default function Profile() {
  const { t } = useTranslation()
  const { username } = useParams()
  const { user: currentUser, updateUser } = useAuth()
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

  const handleEditSave = async () => {
    const updates = {
      bio: editBio,
      socialLinks: {
        website: editWebsite,
        twitter: editTwitter,
        youtube: editYoutube,
      }
    }
    setProfileUser(prev => ({ ...prev, ...updates }))
    setIsEditModalOpen(false)
    if (isOwnProfile) {
      await updateUser(updates)
    }
  }

  // 404
  if (notFound) {
    return (
      <div className="text-center py-20">
        <>
          <title>{t('profile.userNotFound')} | MindForge</title>
        </>
        <h1 className="text-6xl font-bold text-text-muted mb-4">404</h1>
        <p className="text-xl text-text-secondary mb-2">{t('profile.userNotFound')}</p>
        <p className="text-text-muted mb-6">{t('profile.userNotFoundDesc', { username })}</p>
        <Link to="/" className="text-accent hover:underline">
          {t('profile.backToHome')}
        </Link>
      </div>
    )
  }

  // Loading
  if (!profileUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <>
          <title>{username} | MindForge</title>
        </>
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-4 max-w-5xl mx-auto">
      <>
        <title>{profileUser.username || username} | MindForge</title>
        <meta name="description" content={`${profileUser.username || username} - MindForge`} />
        <meta property="og:title" content={`${profileUser.username || username} | MindForge`} />
        <meta property="og:description" content={`${profileUser.username || username} - MindForge`} />
        <meta property="og:type" content="profile" />
      </>

      {/* Profile Header */}
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        isLoggedIn={!!currentUser}
        onEditClick={handleEditOpen}
        onFollowChange={(nowFollowing) => {
          setIsFollowing(nowFollowing)
          setProfileUser(prev => ({
            ...prev,
            followers: Math.max(0, (prev.followers || 0) + (nowFollowing ? 1 : -1))
          }))
        }}
        isFollowing={isFollowing}
        onTitleChange={async (title) => {
          setProfileUser(prev => ({ ...prev, activeTitle: title }))
          await updateUser({ activeTitle: title })
        }}
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
                  ? t('profile.noGamesCreated')
                  : t('profile.noGamesCreatedOther')}
              </p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="flex flex-wrap gap-4">
            {favoriteGames.map(game => <GameCard key={game.id} game={game} />)}
            {favoriteGames.length === 0 && (
              <p className="text-text-muted w-full text-center py-8">
                {t('profile.noFavorites')}
              </p>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">&#127942;</p>
            <p className="text-text-secondary mb-4">
              {isOwnProfile
                ? t('profile.checkAchievements')
                : t('profile.userAchievements', { username: profileUser.username })}
            </p>
            {isOwnProfile && (
              <Link
                to="/achievements"
                className="inline-block bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg transition-colors font-medium"
              >
                {t('profile.viewAchievements')}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t('profile.editProfile')}
      >
        <div className="space-y-4">
          <div>
            <label>{t('profile.bio')}</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder={t('profile.bioPlaceholder')}
            />
            <p className="text-text-muted text-xs mt-1 text-right">{editBio.length}/200</p>
          </div>

          <div>
            <label>{t('profile.website')}</label>
            <input
              type="text"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              placeholder={t('profile.websitePlaceholder')}
            />
          </div>

          <div>
            <label>{t('profile.twitter')}</label>
            <input
              type="text"
              value={editTwitter}
              onChange={(e) => setEditTwitter(e.target.value)}
              placeholder={t('profile.twitterPlaceholder')}
            />
          </div>

          <div>
            <label>{t('profile.youtube')}</label>
            <input
              type="text"
              value={editYoutube}
              onChange={(e) => setEditYoutube(e.target.value)}
              placeholder={t('profile.youtubePlaceholder')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-bg-card hover:bg-bg-hover text-text-secondary py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleEditSave}
              className="flex-1 bg-accent hover:bg-accent-dark text-white py-2.5 rounded-lg transition-colors cursor-pointer font-semibold"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
