import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function FallbackUI({ error, onRetry, compact = false, message }) {
  const { t } = useTranslation()

  const isNetworkError = error?.message?.includes('network') ||
                          error?.message?.includes('fetch') ||
                          error?.code === 'unavailable'

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-bg-card rounded-lg p-4 border border-gray-700">
        {isNetworkError ? (
          <WifiOff className="w-5 h-5 text-warning shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-error shrink-0" />
        )}
        <p className="text-sm text-text-secondary flex-1">
          {message || (isNetworkError ? t('errors.networkError') : t('errors.loadingFailed'))}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-accent hover:text-accent-dark text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t('errors.retry')}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="bg-bg-card rounded-2xl p-8 max-w-sm w-full text-center border border-gray-700">
        {isNetworkError ? (
          <WifiOff className="w-12 h-12 text-warning mx-auto mb-4" />
        ) : (
          <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
        )}
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {isNetworkError ? t('errors.connectionLost') : t('errors.somethingWentWrong')}
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          {message || (isNetworkError ? t('errors.checkConnection') : t('errors.tryAgainLater'))}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 mx-auto bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t('errors.retry')}
          </button>
        )}
      </div>
    </div>
  )
}
