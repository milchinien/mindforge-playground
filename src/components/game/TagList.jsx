import { useNavigate } from 'react-router-dom'

export default function TagList({ tags, maxTags = 3, size = 'sm' }) {
  const navigate = useNavigate()
  const visibleTags = tags.slice(0, maxTags)
  const remaining = tags.length - maxTags

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm'

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleTags.map(tag => (
        <button
          key={tag}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/search?tag=${tag}`)
          }}
          className={`${sizeClasses} bg-primary/20 text-primary-light hover:bg-primary/30 rounded-full transition-colors duration-150 cursor-pointer`}
        >
          #{tag}
        </button>
      ))}
      {remaining > 0 && (
        <span className={`${sizeClasses} text-text-muted`}>
          +{remaining} mehr
        </span>
      )}
    </div>
  )
}
