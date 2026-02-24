import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getStorageItem, setStorageItem, removeStorageItem, clearNamespace } from '../storage'

// Create a proper localStorage mock for environments where jsdom doesn't provide one
function createLocalStorageMock() {
  let store = {}
  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => {
      store[key] = String(value)
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    key: vi.fn((index) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length
    },
  }
}

describe('storage utility', () => {
  let mockStorage

  beforeEach(() => {
    mockStorage = createLocalStorageMock()
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    })
  })

  it('stores and retrieves items', () => {
    setStorageItem('test', { foo: 'bar' })
    expect(getStorageItem('test')).toEqual({ foo: 'bar' })
  })

  it('returns fallback for missing items', () => {
    expect(getStorageItem('missing', 'default')).toBe('default')
  })

  it('removes items', () => {
    setStorageItem('test', 'value')
    removeStorageItem('test')
    expect(getStorageItem('test')).toBeNull()
  })

  it('clears all namespaced items', () => {
    setStorageItem('a', 1)
    setStorageItem('b', 2)
    clearNamespace()
    expect(getStorageItem('a')).toBeNull()
    expect(getStorageItem('b')).toBeNull()
  })

  it('validates schema for known keys', () => {
    // theme must be one of dark/light/high-contrast
    mockStorage.setItem('mf_theme', JSON.stringify({ data: 'invalid-theme', _v: 1 }))
    expect(getStorageItem('theme', 'dark')).toBe('dark')
  })
})
