import { useState, useEffect } from 'react'
import { Clock, ChevronRight, Users, Trophy } from 'lucide-react'
import { useQuestStore } from '../stores/questStore'
import { QUEST_TABS, RARITY_CONFIG } from '../data/questData'
import { useCountdown } from '../hooks/useCountdown'
import QuestCard from '../components/quests/QuestCard'
import BadgeGrid from '../components/quests/BadgeGrid'

// --- Tab Button ---
function TabButton({ tab, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(tab.id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer flex-1
        ${isActive
          ? 'bg-bg-card text-accent shadow-sm'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
        }`}
    >
      <span>{tab.icon}</span>
      <span className="hidden sm:inline">{tab.label}</span>
    </button>
  )
}

// --- Daily Reset Countdown ---
function DailyCountdown({ resetAt }) {
  const countdown = useCountdown(new Date(resetAt).toISOString())

  return (
    <div className="flex items-center gap-2 text-sm text-text-muted bg-bg-card rounded-lg px-4 py-2 mb-4">
      <Clock className="w-4 h-4" />
      <span>Naechster Reset in:</span>
      <span className="font-mono font-semibold text-accent">{countdown.formatted}</span>
    </div>
  )
}

// --- Weekly Reset Countdown ---
function WeeklyCountdown({ resetAt }) {
  const countdown = useCountdown(new Date(resetAt).toISOString())

  return (
    <div className="flex items-center gap-2 text-sm text-text-muted bg-bg-card rounded-lg px-4 py-2 mb-4">
      <Clock className="w-4 h-4" />
      <span>Wochen-Reset in:</span>
      <span className="font-mono font-semibold text-warning">{countdown.formatted}</span>
    </div>
  )
}

// --- Daily Tab Content ---
function DailyTab() {
  const dailyQuests = useQuestStore((s) => s.dailyQuests)
  const dailyResetAt = useQuestStore((s) => s.dailyResetAt)
  const claimQuestReward = useQuestStore((s) => s.claimQuestReward)

  const completedCount = dailyQuests.filter(q => q.status === 'claimed').length

  return (
    <div>
      <DailyCountdown resetAt={dailyResetAt} />

      {/* Daily progress indicator */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 bg-bg-hover rounded-full h-2.5">
          <div
            className="bg-accent h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / dailyQuests.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-text-secondary font-medium">
          {completedCount}/{dailyQuests.length}
        </span>
      </div>

      <div className="space-y-3">
        {dailyQuests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClaim={claimQuestReward}
          />
        ))}
      </div>
    </div>
  )
}

// --- Weekly Tab Content ---
function WeeklyTab() {
  const weeklyQuests = useQuestStore((s) => s.weeklyQuests)
  const weeklyResetAt = useQuestStore((s) => s.weeklyResetAt)
  const claimQuestReward = useQuestStore((s) => s.claimQuestReward)

  const completedCount = weeklyQuests.filter(q => q.status === 'claimed').length

  return (
    <div>
      <WeeklyCountdown resetAt={weeklyResetAt} />

      {/* Weekly progress indicator */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 bg-bg-hover rounded-full h-2.5">
          <div
            className="bg-warning h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / weeklyQuests.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-text-secondary font-medium">
          {completedCount}/{weeklyQuests.length}
        </span>
      </div>

      <div className="space-y-3">
        {weeklyQuests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClaim={claimQuestReward}
          />
        ))}
      </div>

      {/* Bonus info */}
      <div className="mt-6 bg-bg-card border border-gray-700 rounded-lg p-4 text-center">
        <p className="text-text-secondary text-sm">
          Woechentliche Quests bieten neben XP auch kosmetische Belohnungen wie Rahmen und Titel.
        </p>
      </div>
    </div>
  )
}

// --- Story Tab Content ---
function StoryTab() {
  const storyProgress = useQuestStore((s) => s.storyProgress)
  const claimQuestReward = useQuestStore((s) => s.claimQuestReward)

  const claimedChapters = storyProgress.chapters.filter(c => c.status === 'claimed').length
  const totalChapters = storyProgress.chapters.length

  return (
    <div>
      {/* Story header */}
      <div className="bg-bg-card rounded-xl p-6 border border-accent/20 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{storyProgress.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{storyProgress.title}</h2>
              <p className="text-sm text-text-secondary">{storyProgress.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 bg-bg-hover rounded-full h-3">
              <div
                className="bg-gradient-to-r from-accent to-purple-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${(claimedChapters / totalChapters) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-text-primary">
              Kapitel {claimedChapters}/{totalChapters}
            </span>
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="space-y-3">
        {storyProgress.chapters.map((chapter) => (
          <QuestCard
            key={chapter.id}
            quest={chapter}
            onClaim={claimQuestReward}
            variant="story"
            locked={chapter.status === 'locked'}
            narrative={chapter.narrative}
            chapter={chapter.chapter}
          />
        ))}
      </div>
    </div>
  )
}

// --- Community Tab Content ---
function CommunityTab() {
  const communityQuests = useQuestStore((s) => s.communityQuests)
  const claimQuestReward = useQuestStore((s) => s.claimQuestReward)

  return (
    <div>
      {/* Community intro */}
      <div className="flex items-center gap-3 bg-bg-card rounded-xl p-4 border border-gray-700 mb-6">
        <Users className="w-6 h-6 text-accent flex-shrink-0" />
        <div>
          <p className="text-text-primary font-semibold text-sm">Gemeinsam staerker</p>
          <p className="text-text-secondary text-xs">
            Community-Quests werden von allen Spielern gemeinsam absolviert. Jeder Beitrag zaehlt!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {communityQuests.map(quest => {
          const progress = Math.min(100, Math.round((quest.current / quest.target) * 100))
          const isClaimed = quest.status === 'claimed'
          const isCompleted = quest.status === 'completed'

          return (
            <div
              key={quest.id}
              className={`bg-bg-card rounded-xl p-6 border transition-all duration-300 ${
                isClaimed
                  ? 'border-success/30 bg-success/5'
                  : isCompleted
                    ? 'border-accent/40 bg-accent/5'
                    : 'border-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{quest.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-text-primary">{quest.title}</h3>
                    {isClaimed && (
                      <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                        Abgeschlossen
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{quest.description}</p>

                  {/* Massive progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-text-muted mb-1.5">
                      <span>{quest.current.toLocaleString('de-DE')}/{quest.target.toLocaleString('de-DE')}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-bg-hover rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                          isCompleted || isClaimed ? 'bg-success' : 'bg-gradient-to-r from-primary-light to-accent'
                        }`}
                        style={{ width: `${progress}%` }}
                      >
                        {/* Shimmer effect */}
                        {!isClaimed && !isCompleted && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contributors & rewards */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {quest.contributors.toLocaleString('de-DE')} Teilnehmer
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quest.xpReward && (
                        <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full">
                          {quest.xpReward} XP
                        </span>
                      )}
                      {quest.cosmeticReward && (
                        <span className="text-xs font-medium bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full">
                          {quest.cosmeticReward}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Claim button for completed community quests */}
                  {isCompleted && !isClaimed && (
                    <button
                      onClick={() => claimQuestReward(quest.id)}
                      className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-light text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 cursor-pointer"
                    >
                      Belohnung einloesen
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Main Quests Page ---
export default function Quests() {
  const [activeTab, setActiveTab] = useState('daily')
  const checkResets = useQuestStore((s) => s.checkResets)
  const unlockedBadges = useQuestStore((s) => s.unlockedBadges)

  // Check for quest resets on mount
  useEffect(() => {
    checkResets()
  }, [checkResets])

  return (
    <div className="p-6">
      <>
        <title>Quests & Abzeichen | MindForge</title>
        <meta name="description" content="Taeglich neue Quests, Story-Abenteuer und Abzeichen zum Sammeln auf MindForge." />
        <meta property="og:title" content="Quests & Abzeichen | MindForge" />
        <meta property="og:description" content="Taeglich neue Quests, Story-Abenteuer und Abzeichen zum Sammeln auf MindForge." />
        <meta property="og:type" content="website" />
      </>

      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Quests & Abzeichen</h1>
          <p className="text-text-secondary mt-1">
            Erledige Quests, sammle XP und schalte einzigartige Abzeichen frei.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-bg-card border border-gray-700 rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-text-muted">Abzeichen</p>
            <p className="text-lg font-bold text-accent">{unlockedBadges.length}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 mb-8 overflow-x-auto">
        {QUEST_TABS.map(tab => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'daily' && <DailyTab />}
        {activeTab === 'weekly' && <WeeklyTab />}
        {activeTab === 'story' && <StoryTab />}
        {activeTab === 'community' && <CommunityTab />}
        {activeTab === 'badges' && <BadgeGrid />}
      </div>

      {/* Bottom note */}
      <div className="mt-8 bg-bg-card border border-gray-700 rounded-lg p-4 text-center">
        <p className="text-text-secondary text-sm">
          Quests und Abzeichen geben XP und kosmetische Belohnungen -- keine MindCoins.
        </p>
        <p className="text-text-muted text-xs mt-1">
          Bewusste Design-Entscheidung: Fairness fuer alle Spieler.
        </p>
      </div>
    </div>
  )
}
