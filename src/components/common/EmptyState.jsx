import { Link } from 'react-router-dom'
import Button from './Button'

export default function EmptyState({ icon = '📦', title, description, actionLabel, actionLink }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      {description && <p className="text-text-secondary mb-4">{description}</p>}
      {actionLabel && actionLink && (
        <Link to={actionLink}>
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
