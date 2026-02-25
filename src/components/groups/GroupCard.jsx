import { memo } from 'react'
import { Users, Crown, Shield, Swords, UserPlus, UserMinus, BookOpen, Trophy } from 'lucide-react'
import { getSubjectConfig } from '../../data/subjectConfig'

function MemberAvatars({ members, maxShow = 5 }) {
  const visible = members.slice(0, maxShow)
  const remaining = members.length > maxShow ? members.length - maxShow : 0

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((member) => (
        <div
          key={member.id}
          className="w-8 h-8 rounded-full bg-bg-hover border-2 border-bg-card flex items-center justify-center
                     text-xs font-bold text-text-primary"
          title={member.displayName || member.username}
        >
          {(member.displayName || member.username)?.charAt(0) || '?'}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-bg-secondary border-2 border-bg-card flex items-center justify-center
                        text-xs font-medium text-text-muted">
          +{remaining}
        </div>
      )}
    </div>
  )
}

function GroupCard({ group, isMember, onJoin, onLeave }) {
  const isClan = group.type === 'clan'
  const isKlasse = group.type === 'klasse'
  const subjectConfig = group.subject ? getSubjectConfig(group.subject) : null

  const handleAction = (e) => {
    e.stopPropagation()
    if (isMember) {
      onLeave?.(group.id)
    } else {
      onJoin?.(group.id)
    }
  }

  // Clan-specific gradient wrapper
  if (isClan) {
    const winRate = group.warStats
      ? Math.round((group.warStats.wins / Math.max(1, group.warStats.wins + group.warStats.losses)) * 100)
      : 0

    return (
      <div className="relative bg-bg-card rounded-xl border border-gray-700 overflow-hidden
                      hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-black/20 group">
        {/* Gradient top bar */}
        <div className={`h-2 bg-gradient-to-r ${group.emblemColor}`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.emblemColor}
                              flex items-center justify-center shadow-lg flex-shrink-0`}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-text-primary truncate group-hover:text-accent transition-colors">
                  {group.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${group.emblemColor} text-white font-semibold`}>
                    Lvl {group.clanLevel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {group.memberCount}/{group.maxMembers}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {group.description}
          </p>

          {/* War Stats */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-bg-secondary rounded-lg">
            <div className="flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-text-primary">Clan Wars</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-success font-semibold">{group.warStats.wins}S</span>
              <span className="text-error font-semibold">{group.warStats.losses}N</span>
              <span className="text-text-muted">{group.warStats.draws}U</span>
              <span className="text-accent font-semibold ml-auto">{winRate}% Siegrate</span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Clan XP</span>
              <span>{group.clanXP?.toLocaleString('de-DE')} / {group.clanXPNext?.toLocaleString('de-DE')}</span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${group.emblemColor} transition-all`}
                style={{ width: `${Math.min(100, Math.round((group.clanXP / group.clanXPNext) * 100))}%` }}
              />
            </div>
          </div>

          {/* Members + Action */}
          <div className="flex items-center justify-between">
            <MemberAvatars members={group.members} />
            <button
              onClick={handleAction}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isMember
                  ? 'bg-error/10 text-error hover:bg-error/20'
                  : 'bg-accent hover:bg-accent-dark text-white'
                }`}
            >
              {isMember ? (
                <><UserMinus className="w-4 h-4" /> Verlassen</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Beitreten</>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Klasse card
  if (isKlasse) {
    const progressPercent = group.averageProgress || 0

    return (
      <div className="bg-bg-card rounded-xl border border-gray-700 p-5
                      hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-black/20 group">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-text-primary truncate group-hover:text-accent transition-colors">
                {group.name}
              </h3>
              <p className="text-xs text-text-muted">
                Lehrer: {group.teacherName} &middot; {group.studentCount} Schueler
              </p>
            </div>
          </div>
          {subjectConfig && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${subjectConfig.gradient} text-white flex-shrink-0`}>
              {subjectConfig.label}
            </span>
          )}
        </div>

        <p className="text-sm text-text-secondary mb-4 line-clamp-2">{group.description}</p>

        {/* Average progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>Durchschnittlicher Fortschritt</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-bg-hover rounded-full h-2">
            <div
              className="h-2 rounded-full bg-accent transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Assignments summary */}
        {group.assignments && group.assignments.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>{group.assignments.length} Aufgaben zugewiesen</span>
          </div>
        )}

        {/* Members + Action */}
        <div className="flex items-center justify-between">
          {group.students && <MemberAvatars members={group.students.map(s => ({ ...s, id: s.id }))} />}
          <span className="text-xs text-text-muted bg-bg-secondary px-3 py-1.5 rounded-lg">
            Nur mit Einladung
          </span>
        </div>
      </div>
    )
  }

  // Default: Lerngruppe card
  return (
    <div className="bg-bg-card rounded-xl border border-gray-700 p-5
                    hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-black/20 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          ${subjectConfig ? `bg-gradient-to-br ${subjectConfig.gradient}` : 'bg-bg-hover'}`}>
            <span className="text-xl">{subjectConfig?.icon || '\uD83D\uDCDA'}</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text-primary truncate group-hover:text-accent transition-colors">
              {group.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {group.memberCount}/{group.maxMembers}
              </span>
              {group.activeChallenges && group.activeChallenges.length > 0 && (
                <span className="text-accent">{group.activeChallenges.length} aktive Challenges</span>
              )}
            </div>
          </div>
        </div>
        {subjectConfig && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${subjectConfig.gradient} text-white flex-shrink-0`}>
            {subjectConfig.label}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {group.description}
      </p>

      {/* Active challenge preview */}
      {group.activeChallenges && group.activeChallenges.length > 0 && (
        <div className="mb-4 p-3 bg-bg-secondary rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-text-primary">{group.activeChallenges[0].title}</span>
          </div>
          <div className="w-full bg-bg-hover rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-accent transition-all"
              style={{ width: `${Math.round((group.activeChallenges[0].current / group.activeChallenges[0].target) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">
            {group.activeChallenges[0].current}/{group.activeChallenges[0].target}
          </p>
        </div>
      )}

      {/* Members + Action */}
      <div className="flex items-center justify-between">
        <MemberAvatars members={group.members} />
        <button
          onClick={handleAction}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${isMember
              ? 'bg-error/10 text-error hover:bg-error/20'
              : 'bg-accent hover:bg-accent-dark text-white'
            }`}
        >
          {isMember ? (
            <><UserMinus className="w-4 h-4" /> Verlassen</>
          ) : (
            <><UserPlus className="w-4 h-4" /> Beitreten</>
          )}
        </button>
      </div>
    </div>
  )
}

export default memo(GroupCard)
