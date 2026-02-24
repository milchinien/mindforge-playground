import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import { useTranslation } from 'react-i18next'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger'
}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const variants = {
    danger: 'bg-error hover:bg-red-600',
    warning: 'bg-warning hover:bg-yellow-600',
    info: 'bg-accent hover:bg-accent-dark',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || t('common.confirm')} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-0.5" />
          <p className="text-text-secondary text-sm">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-card transition-colors"
          >
            {cancelText || t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${variants[variant]} disabled:opacity-50`}
          >
            {loading ? t('common.loading') : (confirmText || t('common.delete'))}
          </button>
        </div>
      </div>
    </Modal>
  )
}
