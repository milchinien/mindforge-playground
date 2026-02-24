import { useState, useCallback } from 'react'

export function useConfirm() {
  const [state, setState] = useState({ isOpen: false, config: null, resolve: null })

  const confirm = useCallback((config) => {
    return new Promise((resolve) => {
      setState({ isOpen: true, config, resolve })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    state.resolve?.(true)
    setState({ isOpen: false, config: null, resolve: null })
  }, [state.resolve])

  const handleClose = useCallback(() => {
    state.resolve?.(false)
    setState({ isOpen: false, config: null, resolve: null })
  }, [state.resolve])

  return {
    isOpen: state.isOpen,
    config: state.config,
    confirm,
    handleConfirm,
    handleClose,
  }
}
