import { useState, useCallback } from 'react'
import { saveImageFromFile, getImageUrl, deleteImage } from '../utils/imageStorage'

export function useImageStorage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const uploadImage = useCallback(async (file, prefix = 'img') => {
    setLoading(true)
    setError(null)
    try {
      const key = await saveImageFromFile(file, prefix)
      const url = await getImageUrl(key)
      return { key, url }
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const loadImageUrl = useCallback(async (key) => {
    if (!key) return null
    try {
      return await getImageUrl(key)
    } catch {
      return null
    }
  }, [])

  const removeImage = useCallback(async (key) => {
    if (!key) return
    try {
      await deleteImage(key)
    } catch (err) {
      setError(err.message || 'Loeschen fehlgeschlagen')
    }
  }, [])

  return { uploadImage, loadImageUrl, removeImage, loading, error }
}
