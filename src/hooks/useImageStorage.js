import { useState, useCallback } from 'react'
import { saveImageFromFile, getImageUrl, deleteImage } from '../utils/imageStorage'

export function useImageStorage() {
  const [loading, setLoading] = useState(false)

  const uploadImage = useCallback(async (file, prefix = 'img') => {
    setLoading(true)
    try {
      const key = await saveImageFromFile(file, prefix)
      const url = await getImageUrl(key)
      return { key, url }
    } finally {
      setLoading(false)
    }
  }, [])

  const loadImageUrl = useCallback(async (key) => {
    if (!key) return null
    return getImageUrl(key)
  }, [])

  const removeImage = useCallback(async (key) => {
    if (!key) return
    await deleteImage(key)
  }, [])

  return { uploadImage, loadImageUrl, removeImage, loading }
}
