import { useState } from 'react'
import { Share2, Link as LinkIcon, Check, MessageCircle } from 'lucide-react'

const shareTargets = [
  {
    id: 'copy',
    label: 'Link kopieren',
    icon: LinkIcon,
    color: 'bg-gray-600 hover:bg-gray-500',
    action: (url) => {
      navigator.clipboard.writeText(url)
      return true // indicates "copied" state
    }
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-600 hover:bg-green-500',
    action: (url, title) => {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`, '_blank')
    }
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'bg-black hover:bg-gray-800',
    action: (url, title) => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
    }
  },
]

export default function ShareButtons({ title, url, compact = false }) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const shareUrl = url || window.location.href

  const handleShare = async (target) => {
    if (target.id === 'copy') {
      target.action(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      target.action(shareUrl, title || 'MindForge')
    }
  }

  // Use native share API if available (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'MindForge', url: shareUrl })
      } catch {
        setShowMenu(!showMenu)
      }
    } else {
      setShowMenu(!showMenu)
    }
  }

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors text-sm"
        >
          <Share2 className="w-4 h-4" />
          Teilen
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-8 z-50 bg-bg-secondary border border-gray-700 rounded-xl shadow-xl p-2 min-w-[180px]">
              {shareTargets.map(target => {
                const Icon = target.icon
                return (
                  <button
                    key={target.id}
                    onClick={() => { handleShare(target); if (target.id !== 'copy') setShowMenu(false) }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
                  >
                    {target.id === 'copy' && copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    {target.id === 'copy' && copied ? 'Kopiert!' : target.label}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-muted mr-1">Teilen:</span>
      {shareTargets.map(target => {
        const Icon = target.icon
        return (
          <button
            key={target.id}
            onClick={() => handleShare(target)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm transition-colors ${target.color}`}
            title={target.label}
          >
            {target.id === 'copy' && copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{target.id === 'copy' && copied ? 'Kopiert!' : target.label}</span>
          </button>
        )
      })}
    </div>
  )
}
