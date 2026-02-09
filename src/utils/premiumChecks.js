export function isPremium(user) {
  return user?.isPremium === true
}

export function isCreatorPremium(user) {
  return user?.premiumTier === 'creator' || user?.premiumTier === 'teacher'
}

export function isTeacherPremium(user) {
  return user?.premiumTier === 'teacher'
}

export function canUploadGames(user) {
  return isCreatorPremium(user)
}

export function canManageClasses(user) {
  return isTeacherPremium(user)
}
