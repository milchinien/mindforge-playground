export function isDev(user) {
  return user?.premiumTier === 'dev'
}

export function isPremium(user) {
  return user?.isPremium === true || isDev(user)
}

export function isCreatorPremium(user) {
  return isDev(user) || user?.premiumTier === 'creator' || user?.premiumTier === 'teacher' || user?.premiumTier === 'pro'
}

export function isTeacherPremium(user) {
  return isDev(user) || user?.premiumTier === 'teacher'
}

export function canUploadGames(user) {
  return isDev(user) || isCreatorPremium(user)
}

export function canManageClasses(user) {
  return isDev(user) || isTeacherPremium(user)
}
