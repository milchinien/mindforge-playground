export function isDev(user) {
  return user?.premiumTier === 'dev'
}

export function isPremium(user) {
  return user?.isPremium === true || isDev(user)
}

export function isProPremium(user) {
  return isDev(user) || user?.premiumTier === 'pro' || user?.premiumTier === 'creator' || user?.premiumTier === 'teacher'
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

export function getPremiumTierLevel(user) {
  if (isDev(user)) return 4
  switch (user?.premiumTier) {
    case 'teacher': return 3
    case 'creator': return 2
    case 'pro': return 1
    default: return 0
  }
}

export function getPremiumDiscount(user) {
  if (isDev(user)) return { percent: 15, bonusMC: 200 }
  switch (user?.premiumTier) {
    case 'teacher': return { percent: 15, bonusMC: 200 }
    case 'creator': return { percent: 10, bonusMC: 100 }
    case 'pro': return { percent: 5, bonusMC: 50 }
    default: return { percent: 0, bonusMC: 0 }
  }
}
