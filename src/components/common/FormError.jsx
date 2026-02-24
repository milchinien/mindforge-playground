export default function FormError({ error, className = '' }) {
  if (!error) return null
  return (
    <p className={`text-error text-sm mt-1 ${className}`} role="alert">
      {error}
    </p>
  )
}
