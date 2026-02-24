import { describe, it, expect, beforeEach } from 'vitest'
import { logError, getErrorLog, clearErrorLog, formatFirebaseError } from '../errorLogger'

describe('errorLogger', () => {
  beforeEach(() => {
    clearErrorLog()
  })

  it('logs errors to internal log', () => {
    logError(new Error('test error'))
    const log = getErrorLog()
    expect(log).toHaveLength(1)
    expect(log[0].message).toBe('test error')
  })

  it('includes context in log entries', () => {
    logError(new Error('with context'), { source: 'test' })
    const log = getErrorLog()
    expect(log[0].context.source).toBe('test')
  })

  it('clears the log', () => {
    logError(new Error('one'))
    logError(new Error('two'))
    clearErrorLog()
    expect(getErrorLog()).toHaveLength(0)
  })

  it('caps log at 100 entries', () => {
    for (let i = 0; i < 110; i++) {
      logError(new Error(`error ${i}`))
    }
    expect(getErrorLog()).toHaveLength(100)
  })
})

describe('formatFirebaseError', () => {
  it('maps known error codes', () => {
    expect(formatFirebaseError('auth/user-not-found')).toBe('Benutzer nicht gefunden.')
    expect(formatFirebaseError('auth/wrong-password')).toBe('Falsches Passwort.')
  })

  it('returns generic message for unknown codes', () => {
    expect(formatFirebaseError('unknown/code')).toBe('Ein unerwarteter Fehler ist aufgetreten.')
  })
})
