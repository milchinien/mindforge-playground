const spinnerSizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
}

export function LoadingSpinner({ size = 'md', fullScreen = false, text, thumbnail, name }) {
  // Custom MindForge loading screen: grey bg, white spinner, name + thumbnail above
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2a2a2e]">
        {/* Name + Thumbnail above spinner */}
        {(name || thumbnail) && (
          <div className="flex flex-col items-center mb-6">
            {thumbnail && (
              <div className="w-20 h-20 rounded-xl overflow-hidden mb-3 shadow-lg">
                <img src={thumbnail} alt={name || ''} className="w-full h-full object-cover" />
              </div>
            )}
            {name && (
              <p className="text-white text-lg font-semibold tracking-wide">{name}</p>
            )}
          </div>
        )}

        {/* White spinning circle */}
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />

        {text && <p className="text-white/70 text-sm mt-4">{text}</p>}
      </div>
    )
  }

  // Page-level loading: grey area with spinner, name + thumbnail
  if (name || thumbnail) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#2a2a2e] rounded-2xl mx-auto max-w-md">
        {thumbnail && (
          <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 shadow-lg">
            <img src={thumbnail} alt={name || ''} className="w-full h-full object-cover" />
          </div>
        )}
        {name && (
          <p className="text-white text-base font-semibold mb-4">{name}</p>
        )}
        <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin" />
        {text && <p className="text-white/60 text-sm mt-3">{text}</p>}
      </div>
    )
  }

  // Default inline spinner
  const spinner = (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${spinnerSizes[size]} border-bg-hover border-t-accent rounded-full animate-spin`}
      />
      {text && <span className="text-text-secondary text-sm">{text}</span>}
    </div>
  )

  return spinner
}

// Page loader for Suspense fallback - grey bg with MindForge branding
export function PageLoader({ name, thumbnail }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {(name || thumbnail) && (
        <div className="flex flex-col items-center mb-6">
          {thumbnail && (
            <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 shadow-lg">
              <img src={thumbnail} alt={name || ''} className="w-full h-full object-cover" />
            </div>
          )}
          {name && (
            <p className="text-text-primary text-base font-semibold">{name}</p>
          )}
        </div>
      )}
      <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
    </div>
  )
}

export default LoadingSpinner
