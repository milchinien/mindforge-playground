import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users, Shield, BookOpen, Compass, Search, Mail,
  Check, X, Swords, Plus, FileText, AlertCircle
} from 'lucide-react'
import { useGroupStore } from '../stores/groupStore'
import GroupCard from '../components/groups/GroupCard'
import ClanWarBanner from '../components/groups/ClanWarBanner'
import Tabs from '../components/ui/Tabs'

// --- Invite Card ---
function InviteCard({ invite, onAccept, onDecline }) {
  const typeLabels = { clan: 'Clan', lerngruppe: 'Lerngruppe', klasse: 'Klasse' }

  return (
    <div className="flex items-center gap-4 bg-bg-card rounded-xl p-4 border border-accent/20">
      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
        <Mail className="w-5 h-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{invite.groupName}</p>
        <p className="text-xs text-text-muted">
          {typeLabels[invite.groupType] || invite.groupType} &middot; Eingeladen von {invite.invitedBy}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onAccept(invite.id)}
          className="w-8 h-8 rounded-lg bg-success/20 text-success hover:bg-success/30 flex items-center justify-center transition-colors"
          title="Annehmen"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDecline(invite.id)}
          className="w-8 h-8 rounded-lg bg-error/20 text-error hover:bg-error/30 flex items-center justify-center transition-colors"
          title="Ablehnen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// --- Create Group Modal ---
function CreateGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [subject, setSubject] = useState('')

  const subjects = [
    { value: '', label: 'Kein Fach (Allgemein)' },
    { value: 'mathematik', label: 'Mathematik' },
    { value: 'deutsch', label: 'Deutsch' },
    { value: 'englisch', label: 'Englisch' },
    { value: 'physik', label: 'Physik' },
    { value: 'chemie', label: 'Chemie' },
    { value: 'biologie', label: 'Biologie' },
    { value: 'informatik', label: 'Informatik' },
    { value: 'geschichte', label: 'Geschichte' },
    { value: 'geographie', label: 'Geographie' },
    { value: 'kunst', label: 'Kunst' },
    { value: 'musik', label: 'Musik' },
  ]

  const canSubmit = name.trim().length >= 3 && description.trim().length >= 10

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    onCreate({
      name: name.trim(),
      description: description.trim(),
      requirements: requirements.trim(),
      subject: subject || null,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg-card border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Community Gruppe erstellen</h2>
              <p className="text-xs text-text-muted">Erstelle deine eigene Lerngruppe und lade andere ein</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Gruppenname *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Mathe-Helden, Bio-Nerds..."
              maxLength={40}
              className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-2.5
                         text-sm text-text-primary placeholder-text-muted
                         focus:outline-none focus:border-accent transition-colors"
            />
            <p className="text-xs text-text-muted mt-1">{name.length}/40 Zeichen (mind. 3)</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Beschreibung *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Worum geht es in deiner Gruppe? Was macht ihr gemeinsam?"
              maxLength={200}
              rows={3}
              className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-2.5
                         text-sm text-text-primary placeholder-text-muted resize-none
                         focus:outline-none focus:border-accent transition-colors"
            />
            <p className="text-xs text-text-muted mt-1">{description.length}/200 Zeichen (mind. 10)</p>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Anforderungen
              </span>
            </label>
            <input
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="z.B. Mindestens Level 5, Aktive Teilnahme..."
              maxLength={100}
              className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-2.5
                         text-sm text-text-primary placeholder-text-muted
                         focus:outline-none focus:border-accent transition-colors"
            />
            <p className="text-xs text-text-muted mt-1">Optional - Was sollten Mitglieder mitbringen?</p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Fach / Thema
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-2.5
                         text-sm text-text-primary
                         focus:outline-none focus:border-accent transition-colors"
            >
              {subjects.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-bg-secondary text-text-secondary
                         hover:bg-bg-hover text-sm font-medium transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium
                         hover:bg-accent-dark transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Gruppe erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Groups() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('lerngruppen')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const {
    lerngruppen, clans, klassen, customGroups,
    myGroups, myClans, myClasses, groupInvites, activeClanWar,
    joinGroup, leaveGroup, joinClan, leaveClan,
    acceptInvite, declineInvite, createGroup,
  } = useGroupStore()

  // All lerngruppen (mock + community)
  const allLerngruppen = useMemo(() => [...lerngruppen, ...customGroups], [lerngruppen, customGroups])

  // Filter for "Entdecken" tab
  const allDiscoverItems = useMemo(() => {
    const items = [
      ...allLerngruppen.filter(g => g.isPublic),
      ...clans.filter(c => c.isPublic),
    ]
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    )
  }, [searchQuery, allLerngruppen, clans])

  const TABS = [
    { id: 'lerngruppen', label: 'Lerngruppen', icon: Users, count: allLerngruppen.length },
    { id: 'clans', label: 'Clans', icon: Shield, count: clans.length },
    { id: 'klassen', label: 'Klassen', icon: BookOpen, count: klassen.length },
    { id: 'entdecken', label: 'Entdecken', icon: Compass },
  ]

  const renderLerngruppen = () => (
    <div>
      {/* Create Group Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                   border-2 border-dashed border-accent/30 bg-accent/5
                   text-accent hover:bg-accent/10 hover:border-accent/50
                   transition-colors text-sm font-medium"
      >
        <Plus className="w-5 h-5" />
        Community Gruppe erstellen
      </button>

      {/* Invites for Lerngruppen */}
      {groupInvites.filter(i => i.groupType === 'lerngruppe').length > 0 && (
        <div className="mb-6">
          <div className="space-y-2">
            {groupInvites
              .filter(i => i.groupType === 'lerngruppe')
              .map(invite => (
                <InviteCard
                  key={invite.id}
                  invite={invite}
                  onAccept={acceptInvite}
                  onDecline={declineInvite}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Lerngruppen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allLerngruppen.map(group => (
          <GroupCard
            key={group.id}
            group={group}
            isMember={myGroups.includes(group.id)}
            onJoin={joinGroup}
            onLeave={leaveGroup}
          />
        ))}
      </div>
    </div>
  )

  const renderClans = () => (
    <div>
      {/* Clan War Banner */}
      {activeClanWar && activeClanWar.status !== 'completed' && (
        <div className="mb-6">
          <ClanWarBanner war={activeClanWar} />
        </div>
      )}

      {/* Clan Invites */}
      {groupInvites.filter(i => i.groupType === 'clan').length > 0 && (
        <div className="mb-6">
          <div className="space-y-2">
            {groupInvites
              .filter(i => i.groupType === 'clan')
              .map(invite => (
                <InviteCard
                  key={invite.id}
                  invite={invite}
                  onAccept={acceptInvite}
                  onDecline={declineInvite}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Clans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clans.map(clan => (
          <GroupCard
            key={clan.id}
            group={clan}
            isMember={myClans.includes(clan.id)}
            onJoin={joinClan}
            onLeave={leaveClan}
          />
        ))}
      </div>
    </div>
  )

  const renderKlassen = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {klassen.map(klasse => (
          <GroupCard
            key={klasse.id}
            group={klasse}
            isMember={myClasses.includes(klasse.id)}
          />
        ))}
      </div>

      {klassen.length <= 2 && (
        <p className="text-text-muted text-sm text-center mt-6">
          Frage deine Lehrkraft nach dem Einladungscode, um einer Klasse beizutreten.
        </p>
      )}
    </div>
  )

  const renderEntdecken = () => (
    <div>
      {/* Search + Create */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Community Gruppen und Clans suchen..."
            className="w-full bg-bg-card border border-gray-700 rounded-lg pl-10 pr-4 py-2.5
                       text-sm text-text-primary placeholder-text-muted
                       focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white
                     hover:bg-accent-dark text-sm font-medium transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Erstellen</span>
        </button>
      </div>

      {/* Results */}
      {allDiscoverItems.length === 0 ? (
        <div className="text-center py-16">
          <Compass className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Keine Ergebnisse
          </h3>
          <p className="text-text-muted text-sm">
            Versuche einen anderen Suchbegriff.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-muted mb-4">
            {allDiscoverItems.length} Community Gruppen & Clans gefunden
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allDiscoverItems.map(item => {
              const isClan = item.type === 'clan'
              const isMember = isClan
                ? myClans.includes(item.id)
                : myGroups.includes(item.id)

              return (
                <GroupCard
                  key={item.id}
                  group={item}
                  isMember={isMember}
                  onJoin={isClan ? joinClan : joinGroup}
                  onLeave={isClan ? leaveClan : leaveGroup}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="p-6">
      <>
        <title>Community Gruppen | MindForge</title>
        <meta name="description" content="Erstelle und tritt Community Lerngruppen, Clans und Klassen bei. Lerne gemeinsam!" />
        <meta property="og:title" content="Community Gruppen | MindForge" />
        <meta property="og:description" content="Erstelle und tritt Community Lerngruppen, Clans und Klassen bei. Lerne gemeinsam!" />
        <meta property="og:type" content="website" />
      </>

      {/* Tab navigation */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab content */}
      {activeTab === 'lerngruppen' && renderLerngruppen()}
      {activeTab === 'clans' && renderClans()}
      {activeTab === 'klassen' && renderKlassen()}
      {activeTab === 'entdecken' && renderEntdecken()}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createGroup}
        />
      )}
    </div>
  )
}
