import { useState, useCallback } from 'react'

const DRAFTS_KEY = 'mindforge_game_drafts'

function loadDrafts() {
  try {
    const stored = localStorage.getItem(DRAFTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function persistDrafts(drafts) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

export function useGameDrafts() {
  const [drafts, setDrafts] = useState(loadDrafts)

  const saveDraft = useCallback((draft) => {
    setDrafts(prev => {
      const existing = prev.findIndex(d => d.id === draft.id)
      const updated = existing >= 0
        ? prev.map((d, i) => i === existing ? { ...draft, updatedAt: new Date().toISOString() } : d)
        : [...prev, { ...draft, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
      persistDrafts(updated)
      return updated
    })
  }, [])

  const deleteDraft = useCallback((draftId) => {
    setDrafts(prev => {
      const updated = prev.filter(d => d.id !== draftId)
      persistDrafts(updated)
      return updated
    })
  }, [])

  const getDraft = useCallback((draftId) => {
    return loadDrafts().find(d => d.id === draftId) || null
  }, [])

  const listDrafts = useCallback((userId) => {
    return loadDrafts().filter(d => d.creatorId === userId)
  }, [])

  return { drafts, saveDraft, deleteDraft, getDraft, listDrafts }
}
