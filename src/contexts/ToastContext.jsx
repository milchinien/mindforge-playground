import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useToastStore } from '../stores/toastStore'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'border-success text-success',
  error: 'border-error text-error',
  warning: 'border-warning text-warning',
  info: 'border-primary-light text-primary-light',
}

export function ToastProvider({ children }) {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 bg-bg-secondary border-l-4 ${colors[toast.type]} px-4 py-3 rounded-lg shadow-lg min-w-[280px] animate-in`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-text-primary text-sm flex-1">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function useToast() {
  const showToast = useToastStore((s) => s.showToast)
  return { showToast }
}
