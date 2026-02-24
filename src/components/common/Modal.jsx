import { useEffect, useRef, useId } from 'react'
import FocusTrap from 'focus-trap-react'
import { X } from 'lucide-react'

const widths = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'md' }) {
  const titleId = useId()
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    previousFocus.current = document.activeElement
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <FocusTrap focusTrapOptions={{ allowOutsideClick: true, escapeDeactivates: false }}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`relative bg-bg-secondary rounded-xl shadow-xl w-full ${widths[maxWidth]} animate-in`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Dialog schliessen"
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </FocusTrap>
    </div>
  )
}
