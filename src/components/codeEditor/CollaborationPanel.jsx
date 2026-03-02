import { useState } from 'react'
import { Users, UserPlus, X, Circle, Crown, Eye, Edit3 } from 'lucide-react'

const MOCK_COLLABORATORS = [
  { id: 'user-001', username: 'MindForgeTeam', avatar: 'M', isOnline: true, role: 'owner', color: '#6c5ce7' },
  { id: 'user-002', username: 'ScienceGamer', avatar: 'S', isOnline: true, role: 'editor', color: '#00b894' },
  { id: 'user-003', username: 'MathPro42', avatar: 'M', isOnline: false, role: 'viewer', color: '#fdcb6e' },
]

const MOCK_FRIENDS = [
  { id: 'user-004', username: 'QuizKing', avatar: 'Q' },
  { id: 'user-005', username: 'LearnMaster', avatar: 'L' },
  { id: 'user-006', username: 'PhysicsNerd', avatar: 'P' },
]

export default function CollaborationPanel({ isOpen, onClose }) {
  const [collaborators, setCollaborators] = useState(MOCK_COLLABORATORS)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteSearch, setInviteSearch] = useState('')

  const filteredFriends = MOCK_FRIENDS.filter(f =>
    f.username.toLowerCase().includes(inviteSearch.toLowerCase()) &&
    !collaborators.some(c => c.id === f.id)
  )

  const handleInvite = (friend) => {
    setCollaborators(prev => [...prev, {
      ...friend,
      isOnline: false,
      role: 'editor',
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }])
    setShowInvite(false)
    setInviteSearch('')
  }

  const handleRemove = (id) => {
    setCollaborators(prev => prev.filter(c => c.id !== id))
  }

  const handleRoleChange = (id, newRole) => {
    setCollaborators(prev => prev.map(c =>
      c.id === id ? { ...c, role: newRole } : c
    ))
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-0 right-0 w-full sm:w-80 h-full bg-bg-secondary border-l border-gray-700 z-20 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-text-primary">Zusammenarbeit</span>
          <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">{collaborators.length}</span>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Collaborators list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {collaborators.map(collab => (
          <div key={collab.id} className="flex items-center gap-3 p-2 bg-bg-card rounded-lg">
            {/* Avatar with online dot */}
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: collab.color }}
              >
                {collab.avatar}
              </div>
              <Circle
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${collab.isOnline ? 'text-green-400 fill-green-400' : 'text-gray-500 fill-gray-500'}`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{collab.username}</p>
              <div className="flex items-center gap-1 text-xs text-text-muted">
                {collab.role === 'owner' && <Crown className="w-3 h-3 text-accent" />}
                {collab.role === 'editor' && <Edit3 className="w-3 h-3" />}
                {collab.role === 'viewer' && <Eye className="w-3 h-3" />}
                <span className="capitalize">{collab.role === 'owner' ? 'Besitzer' : collab.role === 'editor' ? 'Bearbeiter' : 'Betrachter'}</span>
              </div>
            </div>

            {/* Actions */}
            {collab.role !== 'owner' && (
              <div className="flex items-center gap-1">
                <select
                  value={collab.role}
                  onChange={(e) => handleRoleChange(collab.id, e.target.value)}
                  className="!w-auto !py-0.5 !px-1 !text-xs !bg-bg-hover !rounded"
                >
                  <option value="editor">Bearbeiter</option>
                  <option value="viewer">Betrachter</option>
                </select>
                <button
                  onClick={() => handleRemove(collab.id)}
                  className="text-text-muted hover:text-red-400 p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Invite section */}
      {showInvite ? (
        <div className="border-t border-gray-700 p-3">
          <input
            type="text"
            value={inviteSearch}
            onChange={(e) => setInviteSearch(e.target.value)}
            placeholder="Freund suchen..."
            className="!text-sm !py-2 mb-2"
            autoFocus
          />
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {filteredFriends.map(friend => (
              <button
                key={friend.id}
                onClick={() => handleInvite(friend)}
                className="flex items-center gap-2 w-full p-2 bg-bg-card hover:bg-bg-hover rounded-lg transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center text-xs text-accent font-bold">
                  {friend.avatar}
                </div>
                <span className="text-sm text-text-primary">{friend.username}</span>
                <UserPlus className="w-3 h-3 text-accent ml-auto" />
              </button>
            ))}
            {filteredFriends.length === 0 && (
              <p className="text-xs text-text-muted text-center py-2">Keine Freunde gefunden</p>
            )}
          </div>
          <button
            onClick={() => setShowInvite(false)}
            className="text-xs text-text-muted hover:text-text-primary mt-2"
          >
            Abbrechen
          </button>
        </div>
      ) : (
        <div className="border-t border-gray-700 p-3">
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 w-full px-3 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg transition-colors text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Freund einladen
          </button>
        </div>
      )}
    </div>
  )
}
