import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { timeAgo } from '../../utils/formatters'
import { useNotificationStore } from '../../stores/notificationStore'

const NOTIFICATION_ICONS = {
  system: '\u2699\uFE0F',
  follow: '\uD83D\uDC64',
  friend_request: '\uD83E\uDD1D',
  achievement: '\uD83C\uDFC6',
  new_game: '\uD83C\uDFAE',
  event: '\uD83C\uDF89',
  quest: '\uD83D\uDCDC',
  season: '\u2B50',
}

function NotificationItem({ notification, onClick }) {
  const icon = NOTIFICATION_ICONS[notification.type] || '\uD83D\uDCCC'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 hover:bg-bg-hover transition-colors
                  flex gap-3 border-b border-gray-700/50 last:border-b-0 cursor-pointer
                  ${!notification.read ? 'bg-accent/5' : ''}`}
    >
      <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-relaxed
          ${!notification.read ? 'text-text-primary' : 'text-text-secondary'}`}>
          {notification.title}
        </p>
        <p className={`text-xs leading-relaxed mt-0.5
          ${!notification.read ? 'text-text-secondary' : 'text-text-muted'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-text-muted mt-1">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <span className="w-2.5 h-2.5 bg-accent rounded-full flex-shrink-0 mt-2" aria-label="Unread" />
      )}
    </button>
  )
}

export default function NotificationDropdown() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.read).length)
  const { markAsRead, markAllAsRead } = useNotificationStore()

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification.id)
    if (notification.link) navigate(notification.link)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${t('notifications.title')}${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-error text-white text-xs
                           min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold"
                aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="region"
          aria-label={t('notifications.title')}
          className="fixed right-2 sm:absolute sm:right-0 top-16 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-96 bg-bg-secondary
                        border border-gray-700 rounded-xl shadow-2xl z-50
                        max-h-[500px] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="font-semibold text-text-primary">{t('notifications.title')}</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-accent hover:text-accent-light transition-colors cursor-pointer"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-text-muted">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                {t('notifications.noNotifications')}
              </div>
            ) : (
              notifications.map(notif => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onClick={() => handleNotificationClick(notif)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
