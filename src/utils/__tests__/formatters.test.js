import { describe, it, expect } from 'vitest'
import { formatNumber, formatDate, timeAgo } from '../formatters'

describe('formatNumber', () => {
  it('returns number as string for values under 1000', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(42)).toBe('42')
    expect(formatNumber(999)).toBe('999')
  })

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K')
    expect(formatNumber(1500)).toBe('1.5K')
    expect(formatNumber(999999)).toBe('1000.0K')
  })

  it('formats millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M')
    expect(formatNumber(2500000)).toBe('2.5M')
  })
})

describe('formatDate', () => {
  it('formats date in German locale', () => {
    const result = formatDate('2026-02-24')
    expect(result).toMatch(/24/)
    expect(result).toMatch(/02/)
    expect(result).toMatch(/2026/)
  })
})

describe('timeAgo', () => {
  it('returns "Gerade eben" for recent dates', () => {
    const now = new Date()
    expect(timeAgo(now)).toBe('Gerade eben')
  })
})
