import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import MindCoinIcon from '../components/common/MindCoinIcon'
import { MOCK_EVENTS } from '../data/mockEvents'
import { useCountdown } from '../hooks/useCountdown'

function ActiveEventCard({ event }) {
  const { t } = useTranslation()
  const countdown = useCountdown(event.endDate)
  const progressPercent = event.userProgress
    ? Math.round((event.userProgress.current / event.userProgress.target) * 100)
    : 0

  return (
    <div className="bg-bg-card rounded-xl p-6 border border-accent/30 relative overflow-hidden">
      {/* LIVE Badge */}
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center gap-1.5 bg-error/20 text-error px-3 py-1
                         rounded-full text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
          {t('events.live')}
        </span>
        <span className="text-text-muted text-sm">
          {event.participants.toLocaleString('de-DE')} {t('common.participants')}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-2">{event.title}</h2>
      <p className="text-text-secondary mb-4">{event.description}</p>

      {/* Countdown */}
      <div className="mb-4">
        <p className="text-sm text-text-muted mb-1">{t('events.endsIn')}</p>
        <p className="text-3xl font-mono font-bold text-accent">{countdown.formatted}</p>
        <p className="text-xs text-text-muted mt-1">
          {t('events.timeRemaining', { days: countdown.days, hours: countdown.hours, minutes: countdown.minutes })}
        </p>
      </div>

      {/* Progress */}
      {event.userProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">{t('events.progress')}</span>
            <span className="text-text-primary font-medium">
              {event.userProgress.current}/{event.userProgress.target} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-bg-hover rounded-full h-3">
            <div
              className="bg-accent h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Reward */}
      <div className="flex items-center gap-2 bg-bg-hover/50 rounded-lg px-4 py-3">
        <MindCoinIcon size={36} />
        <div>
          <p className="text-sm text-text-muted">{t('events.reward')}</p>
          <p className="text-text-primary font-semibold">{event.reward.description}</p>
        </div>
      </div>
    </div>
  )
}

function UpcomingEventCard({ event }) {
  const { t } = useTranslation()
  const countdown = useCountdown(event.startDate)

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-xs font-bold">
          {t('events.soon')}
        </span>
      </div>

      <h3 className="text-lg font-bold text-text-primary mb-1">{event.title}</h3>
      <p className="text-text-secondary text-sm mb-3 line-clamp-2">{event.description}</p>

      <p className="text-sm text-text-muted mb-1">{t('events.startsIn')}</p>
      <p className="text-xl font-mono font-bold text-warning">{countdown.formatted}</p>

      <div className="flex items-center gap-2 mt-3 text-sm">
        <MindCoinIcon size={32} />
        <span className="text-text-secondary">{event.reward.description}</span>
      </div>
    </div>
  )
}

function EndedEventCard({ event }) {
  const { t } = useTranslation()
  const endDateFormatted = new Date(event.endDate).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const progressPercent = event.userProgress
    ? Math.round((event.userProgress.current / event.userProgress.target) * 100)
    : 0

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700 opacity-75">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-gray-600/30 text-text-muted px-3 py-1 rounded-full text-xs font-bold">
          {t('events.ended')}
        </span>
      </div>

      <h3 className="text-lg font-bold text-text-primary mb-1">{event.title}</h3>
      <p className="text-text-muted text-sm mb-3">{t('events.endedOn', { date: endDateFormatted })}</p>

      {event.userProgress && (
        <div className="mb-3">
          <p className="text-sm text-text-secondary">
            {t('events.yourResult', { current: event.userProgress.current, target: event.userProgress.target })}
          </p>
          <div className="w-full bg-bg-hover rounded-full h-2 mt-1">
            <div
              className="bg-text-muted h-2 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-text-muted">
        <MindCoinIcon size={32} />
        <span>{event.reward.description}</span>
        {event.userProgress?.rewardClaimed && (
          <span className="text-success ml-2">&#10003; {t('events.claimed')}</span>
        )}
      </div>
    </div>
  )
}

export default function Events() {
  const { t } = useTranslation()
  const [events, setEvents] = useState([])

  useEffect(() => {
    setEvents(MOCK_EVENTS)
  }, [])

  const activeEvents = events.filter(e => e.status === 'active')
  const upcomingEvents = events.filter(e => e.status === 'upcoming')
  const endedEvents = events.filter(e => e.status === 'ended')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>{t('events.title')} | MindForge</title>
        <meta name="description" content={t('events.title')} />
        <meta property="og:title" content={`${t('events.title')} | MindForge`} />
        <meta property="og:description" content={t('events.title')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8">{t('events.title')}</h1>

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
            {t('events.active')}
          </h2>
          <div className="space-y-4">
            {activeEvents.map(event => (
              <ActiveEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t('events.upcoming')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map(event => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Ended Events */}
      {endedEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text-muted mb-4">
            {t('events.past')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endedEvents.map(event => (
              <EndedEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {events.length === 0 && (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">&#128197;</span>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {t('events.noEvents')}
          </h3>
          <p className="text-text-muted">
            {t('events.noEventsDesc')}
          </p>
        </div>
      )}
    </div>
  )
}
