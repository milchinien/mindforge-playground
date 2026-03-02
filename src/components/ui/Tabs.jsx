/**
 * Unified Tabs component for consistent tab navigation across the app.
 *
 * @param {Object} props
 * @param {Array} props.tabs - Array of { id, label, icon?, count? }
 *   icon can be a Lucide component OR an emoji string
 * @param {string} props.activeTab - Currently active tab id
 * @param {function} props.onChange - Callback when tab changes
 * @param {string} [props.variant] - "underline" (default) or "pills"
 * @param {string} [props.className] - Extra classes on the wrapper
 */
export default function Tabs({ tabs, activeTab, onChange, variant = 'underline', className = '' }) {
  const renderIcon = (icon) => {
    if (!icon) return null
    if (typeof icon === 'string') return <span className="text-sm leading-none">{icon}</span>
    const Icon = icon
    return <Icon className="w-3.5 h-3.5" />
  }

  if (variant === 'pills') {
    return (
      <div className={`flex gap-1.5 overflow-x-auto hide-scrollbar snap-x ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer
                ${isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                }`}
            >
              {renderIcon(tab.icon)}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center leading-none
                  ${isActive ? 'bg-accent/20 text-accent' : 'bg-bg-hover text-text-muted'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`flex gap-1 border-b border-white/10 overflow-x-auto hide-scrollbar snap-x ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer
              ${isActive
                ? 'text-accent'
                : 'text-text-muted hover:text-text-primary'
              }`}
          >
            {renderIcon(tab.icon)}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center leading-none
                ${isActive ? 'bg-accent/15 text-accent' : 'bg-bg-hover text-text-muted'}`}>
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
