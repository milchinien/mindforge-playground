import { motion } from 'framer-motion'

function SkeletonBase({ className = '', rounded = 'rounded-lg' }) {
  return (
    <motion.div
      className={`bg-bg-hover ${rounded} ${className}`}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="w-[120px] sm:w-[220px] flex-shrink-0 bg-bg-card rounded-lg sm:rounded-xl overflow-hidden">
      <SkeletonBase className="w-full h-20 sm:h-40" rounded="rounded-none" />
      <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
        <SkeletonBase className="h-3 sm:h-4 w-3/4" />
        <SkeletonBase className="h-2.5 sm:h-3 w-1/2" />
        <div className="hidden sm:flex gap-1 mt-2">
          <SkeletonBase className="h-5 w-12 rounded-full" />
          <SkeletonBase className="h-5 w-14 rounded-full" />
        </div>
        <div className="hidden sm:flex gap-3 mt-2">
          <SkeletonBase className="h-3 w-10" />
          <SkeletonBase className="h-3 w-10" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBase className="h-4 w-2/3" />
            <SkeletonBase className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="flex flex-col items-center gap-4">
      <SkeletonBase className="w-24 h-24 rounded-full" />
      <SkeletonBase className="h-6 w-40" />
      <SkeletonBase className="h-4 w-60" />
      <div className="flex gap-6 mt-2">
        <SkeletonBase className="h-12 w-16" />
        <SkeletonBase className="h-12 w-16" />
        <SkeletonBase className="h-12 w-16" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonGrid({ cards = 6 }) {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default SkeletonBase
