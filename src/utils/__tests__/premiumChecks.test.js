import { describe, it, expect } from 'vitest'
import { isDev, isPremium, isCreatorPremium, isTeacherPremium, canUploadGames, canManageClasses } from '../premiumChecks'

describe('premiumChecks', () => {
  const devUser = { premiumTier: 'dev', isPremium: true }
  const creatorUser = { premiumTier: 'creator', isPremium: true }
  const teacherUser = { premiumTier: 'teacher', isPremium: true }
  const freeUser = { premiumTier: null, isPremium: false }

  describe('isDev', () => {
    it('returns true for dev users', () => expect(isDev(devUser)).toBe(true))
    it('returns false for non-dev users', () => expect(isDev(freeUser)).toBe(false))
    it('returns false for null', () => expect(isDev(null)).toBe(false))
  })

  describe('isPremium', () => {
    it('returns true for premium users', () => expect(isPremium(creatorUser)).toBe(true))
    it('returns true for dev users', () => expect(isPremium(devUser)).toBe(true))
    it('returns false for free users', () => expect(isPremium(freeUser)).toBe(false))
  })

  describe('canUploadGames', () => {
    it('allows dev users', () => expect(canUploadGames(devUser)).toBe(true))
    it('allows creator premium', () => expect(canUploadGames(creatorUser)).toBe(true))
    it('denies free users', () => expect(canUploadGames(freeUser)).toBe(false))
  })

  describe('canManageClasses', () => {
    it('allows dev users', () => expect(canManageClasses(devUser)).toBe(true))
    it('allows teacher users', () => expect(canManageClasses(teacherUser)).toBe(true))
    it('denies creator users', () => expect(canManageClasses(creatorUser)).toBe(false))
  })
})
