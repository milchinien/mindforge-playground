import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  Users, Shield, BookOpen, Compass, Plus, Search, Mail,
  Check, X, UserPlus, Swords
} from 'lucide-react'
import { useGroupStore } from '../stores/groupStore'
import { mockLerngruppen, mockClans, mockKlassen } from '../data/groupData'
import GroupCard from '../components/groups/GroupCard'
import ClanWarBanner from '../components/groups/ClanWarBanner'

// --- Tab button (consistent with Leaderboards page) ---
function TabButton({ active, onClick, children, icon: Icon, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer
        ${active
          ? 'bg-bg-card text-accent shadow-sm'
          : 'text-text-secondary hover:text-text-primary'
        }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
      {typeof count === 'number' && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-accent/20 text-accent' : 'bg-bg-hover text-text-muted'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

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

export default function Groups() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('lerngruppen')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    myGroups, myClans, myClasses, groupInvites, activeClanWar,
    joinGroup, leaveGroup, joinClan, leaveClan,
    acceptInvite, declineInvite,
  } = useGroupStore()

  // Filter for "Entdecken" tab
  const allDiscoverItems = useMemo(() => {
    const items = [
      ...mockLerngruppen.filter(g => g.isPublic),
      ...mockClans.filter(c => c.isPublic),
    ]
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const TABS = [
    { id: 'lerngruppen', label: 'Lerngruppen', icon: Users, count: mockLerngruppen.length },
    { id: 'clans', label: 'Clans', icon: Shield, count: mockClans.length },
    { id: 'klassen', label: 'Klassen', icon: BookOpen, count: mockKlassen.length },
    { id: 'entdecken', label: 'Entdecken', icon: Compass },
  ]

  const renderLerngruppen = () => (
    <div>
      {/* Quick actions */}
      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Lerngruppe erstellen
        </button>
        <button className="flex items-center gap-2 bg-bg-card hover:bg-bg-hover border border-gray-700 text-text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <UserPlus className="w-4 h-4" />
          Gruppe beitreten
        </button>
      </div>

      {/* Invites for Lerngruppen */}
      {groupInvites.filter(i => i.groupType === 'lerngruppe').length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Einladungen
          </h3>
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

      {/* My Groups Section */}
      {myGroups.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Meine Lerngruppen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLerngruppen
              .filter(g => myGroups.includes(g.id))
              .map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isMember={true}
                  onLeave={leaveGroup}
                />
              ))}
          </div>
        </div>
      )}

      {/* All groups */}
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Alle Lerngruppen
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockLerngruppen.map(group => (
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
      {/* Quick actions */}
      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Clan gruenden
        </button>
        <button className="flex items-center gap-2 bg-bg-card hover:bg-bg-hover border border-gray-700 text-text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <UserPlus className="w-4 h-4" />
          Clan beitreten
        </button>
      </div>

      {/* Clan War Banner */}
      {activeClanWar && activeClanWar.status !== 'completed' && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Swords className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Aktueller Clan War
            </h3>
          </div>
          <ClanWarBanner war={activeClanWar} />
        </div>
      )}

      {/* Invites for Clans */}
      {groupInvites.filter(i => i.groupType === 'clan').length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Clan-Einladungen
          </h3>
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

      {/* My Clans Section */}
      {myClans.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Meine Clans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockClans
              .filter(c => myClans.includes(c.id))
              .map(clan => (
                <GroupCard
                  key={clan.id}
                  group={clan}
                  isMember={true}
                  onLeave={leaveClan}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Clans */}
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Alle Clans
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockClans.map(clan => (
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
      {/* Info banner */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text-primary mb-1">Klassen fuer Lehrkraefte</p>
            <p className="text-xs text-text-secondary">
              Klassen koennen nur von Premium-Lehrkraeften erstellt werden. Schueler treten per Einladungscode bei.
            </p>
          </div>
        </div>
      </div>

      {/* Klassen cards */}
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Meine Klassen
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockKlassen.map(klasse => (
          <GroupCard
            key={klasse.id}
            group={klasse}
            isMember={myClasses.includes(klasse.id)}
          />
        ))}
      </div>

      {/* No more classes hint */}
      {mockKlassen.length <= 2 && (
        <div className="text-center py-8 mt-4">
          <p className="text-text-muted text-sm">
            Frage deine Lehrkraft nach dem Einladungscode, um einer Klasse beizutreten.
          </p>
        </div>
      )}
    </div>
  )

  const renderEntdecken = () => (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Gruppen und Clans suchen..."
          className="w-full bg-bg-card border border-gray-700 rounded-lg pl-10 pr-4 py-2.5
                     text-sm text-text-primary placeholder-text-muted
                     focus:outline-none focus:border-accent transition-colors"
        />
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
            {allDiscoverItems.length} oeffentliche Gruppen & Clans gefunden
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
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>Gruppen | MindForge</title>
        <meta name="description" content="Tritt Lerngruppen, Clans und Klassen bei. Lerne gemeinsam und kaempfe in Clan Wars!" />
        <meta property="og:title" content="Gruppen | MindForge" />
        <meta property="og:description" content="Tritt Lerngruppen, Clans und Klassen bei. Lerne gemeinsam und kaempfe in Clan Wars!" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Gruppen</h1>
          <p className="text-text-secondary">Lerngruppen, Clans & Klassen</p>
        </div>
      </div>

      {/* Pending invites summary */}
      {groupInvites.length > 0 && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">
              {groupInvites.length} offene Einladung{groupInvites.length !== 1 ? 'en' : ''}
            </p>
            <p className="text-xs text-text-muted">
              Du hast unbearbeitete Gruppeneinladungen.
            </p>
          </div>
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            count={tab.count}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'lerngruppen' && renderLerngruppen()}
      {activeTab === 'clans' && renderClans()}
      {activeTab === 'klassen' && renderKlassen()}
      {activeTab === 'entdecken' && renderEntdecken()}

      {/* Footer info */}
      <div className="mt-8 bg-bg-card border border-gray-700 rounded-lg p-4 text-center">
        <p className="text-text-secondary text-sm">
          Gruppen sind der beste Weg, gemeinsam zu lernen und sich gegenseitig zu motivieren.
        </p>
        <p className="text-text-muted text-xs mt-1">
          Erstelle deine eigene Gruppe oder tritt einer bestehenden bei!
        </p>
      </div>
    </div>
  )
}
