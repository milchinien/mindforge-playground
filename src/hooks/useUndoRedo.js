import { useState, useCallback, useRef } from 'react'

export default function useUndoRedo(initialState, maxHistory = 50) {
  const [history, setHistory] = useState([initialState])
  const [pointer, setPointer] = useState(0)
  const isUndoRedo = useRef(false)

  const current = history[pointer]

  const pushState = useCallback((newState) => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false
      return
    }
    setHistory(prev => {
      const newHistory = prev.slice(0, pointer + 1)
      newHistory.push(newState)
      if (newHistory.length > maxHistory) newHistory.shift()
      return newHistory
    })
    setPointer(prev => Math.min(prev + 1, maxHistory - 1))
  }, [pointer, maxHistory])

  const undo = useCallback(() => {
    if (pointer <= 0) return null
    isUndoRedo.current = true
    const newPointer = pointer - 1
    setPointer(newPointer)
    return history[newPointer]
  }, [pointer, history])

  const redo = useCallback(() => {
    if (pointer >= history.length - 1) return null
    isUndoRedo.current = true
    const newPointer = pointer + 1
    setPointer(newPointer)
    return history[newPointer]
  }, [pointer, history])

  const canUndo = pointer > 0
  const canRedo = pointer < history.length - 1

  return { current, pushState, undo, redo, canUndo, canRedo }
}
