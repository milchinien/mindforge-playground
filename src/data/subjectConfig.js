// Subject configuration - gradients, icons, and labels
// Used by GameCard, FeaturedCarousel, and ThumbnailPlaceholder

export const SUBJECT_CONFIG = {
  mathematik: {
    label: 'Mathematik',
    icon: '\u{1F4D0}',
    gradient: 'from-blue-600 to-blue-800',
    gradientDark: 'from-blue-700 to-blue-900',
    color: '#2563eb',
  },
  physik: {
    label: 'Physik',
    icon: '\u269B\uFE0F',
    gradient: 'from-purple-600 to-purple-800',
    gradientDark: 'from-purple-700 to-purple-900',
    color: '#9333ea',
  },
  chemie: {
    label: 'Chemie',
    icon: '\u{1F9EA}',
    gradient: 'from-green-600 to-green-800',
    gradientDark: 'from-green-700 to-green-900',
    color: '#16a34a',
  },
  biologie: {
    label: 'Biologie',
    icon: '\u{1F33F}',
    gradient: 'from-emerald-600 to-emerald-800',
    gradientDark: 'from-emerald-700 to-emerald-900',
    color: '#059669',
  },
  deutsch: {
    label: 'Deutsch',
    icon: '\u{1F4DA}',
    gradient: 'from-red-600 to-red-800',
    gradientDark: 'from-red-700 to-red-900',
    color: '#dc2626',
  },
  englisch: {
    label: 'Englisch',
    icon: '\u{1F30D}',
    gradient: 'from-yellow-600 to-yellow-800',
    gradientDark: 'from-yellow-700 to-yellow-900',
    color: '#ca8a04',
  },
  geschichte: {
    label: 'Geschichte',
    icon: '\u{1F3DB}\uFE0F',
    gradient: 'from-amber-600 to-amber-800',
    gradientDark: 'from-amber-700 to-amber-900',
    color: '#d97706',
  },
  geographie: {
    label: 'Geographie',
    icon: '\u{1F5FA}\uFE0F',
    gradient: 'from-teal-600 to-teal-800',
    gradientDark: 'from-teal-700 to-teal-900',
    color: '#0d9488',
  },
  informatik: {
    label: 'Informatik',
    icon: '\u{1F4BB}',
    gradient: 'from-cyan-600 to-cyan-800',
    gradientDark: 'from-cyan-700 to-cyan-900',
    color: '#0891b2',
  },
  kunst: {
    label: 'Kunst',
    icon: '\u{1F3A8}',
    gradient: 'from-pink-600 to-pink-800',
    gradientDark: 'from-pink-700 to-pink-900',
    color: '#db2777',
  },
  musik: {
    label: 'Musik',
    icon: '\u{1F3B5}',
    gradient: 'from-violet-600 to-violet-800',
    gradientDark: 'from-violet-700 to-violet-900',
    color: '#7c3aed',
  },
}

export const DEFAULT_SUBJECT = {
  label: 'Sonstiges',
  icon: '\u{1F3AE}',
  gradient: 'from-gray-600 to-gray-800',
  gradientDark: 'from-gray-700 to-gray-900',
  color: '#6b7280',
}

export function getSubjectConfig(subject) {
  return SUBJECT_CONFIG[subject] || DEFAULT_SUBJECT
}
