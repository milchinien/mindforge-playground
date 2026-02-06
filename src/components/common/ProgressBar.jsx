const colors = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}

const heights = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

export default function ProgressBar({ value = 0, max = 100, showLabel = false, showValues = false, color = 'accent', size = 'md' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div>
      {(showLabel || showValues) && (
        <div className="flex justify-between text-sm text-text-secondary mb-1">
          {showLabel && <span>{Math.round(percent)}%</span>}
          {showValues && <span>{value}/{max}</span>}
        </div>
      )}
      <div className={`bg-bg-secondary rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${colors[color]} rounded-full ${heights[size]} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
