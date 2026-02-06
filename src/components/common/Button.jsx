import { LoadingSpinner } from './LoadingSpinner'

const variants = {
  primary: 'bg-accent hover:bg-accent-dark text-white',
  secondary: 'bg-bg-card hover:bg-bg-hover text-text-primary',
  outline: 'border border-gray-600 hover:bg-bg-card text-text-primary bg-transparent',
  danger: 'bg-error hover:bg-red-600 text-white',
  ghost: 'hover:bg-bg-card text-text-secondary bg-transparent',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        rounded-lg font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  )
}
