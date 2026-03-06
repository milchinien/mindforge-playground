import { lazy, Suspense } from 'react'
import AvatarRenderer from './AvatarRenderer'

const Avatar3DRenderer = lazy(() =>
  import('./Avatar3DRenderer').catch(() => ({
    default: ({ size }) => (
      <div
        style={{ width: size, height: size, borderRadius: '50%' }}
        className="bg-bg-primary/50 flex items-center justify-center text-text-muted text-[10px] text-center p-1"
      >
        3D N/A
      </div>
    ),
  }))
)

const MIN_3D_SIZE = 80

function is3DEnabled() {
  try { return localStorage.getItem('avatar-3d-mode') === 'true' } catch { return false }
}

/**
 * Smart Avatar wrapper - renders 3D or 2D based on user preference and size.
 * For sizes < 80px, always uses 2D for performance.
 * Accepts all props from both AvatarRenderer and Avatar3DRenderer.
 */
export default function AvatarDisplay({ size = 200, force2D = false, ...props }) {
  const use3D = !force2D && size >= MIN_3D_SIZE && is3DEnabled()

  if (!use3D) {
    return <AvatarRenderer size={size} {...props} />
  }

  return (
    <Suspense fallback={
      <div
        style={{ width: size, height: size, borderRadius: '50%' }}
        className="bg-bg-primary/50 flex items-center justify-center"
      >
        <div className="animate-spin border-2 border-accent border-t-transparent rounded-full"
          style={{ width: Math.max(16, size * 0.2), height: Math.max(16, size * 0.2) }}
        />
      </div>
    }>
      <Avatar3DRenderer size={size} {...props} />
    </Suspense>
  )
}
