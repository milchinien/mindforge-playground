const spinnerSizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
}

export function LoadingSpinner({ size = 'md', fullScreen = false, text }) {
  const spinner = (
    <div className={`${fullScreen ? 'flex flex-col items-center gap-3' : 'inline-flex items-center gap-2'}`}>
      <div
        className={`${spinnerSizes[size]} border-bg-hover border-t-accent rounded-full animate-spin`}
      />
      {text && <span className="text-text-secondary text-sm">{text}</span>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
