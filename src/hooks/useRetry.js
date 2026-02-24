import { useState, useCallback, useRef } from 'react'
import { logError } from '../utils/errorLogger'

export function useRetry(asyncFn, { maxRetries = 3, delay = 1000, backoff = 2 } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const abortRef = useRef(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    setRetryCount(0)

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFn(...args)
        setData(result)
        setLoading(false)
        return result
      } catch (err) {
        setRetryCount(attempt + 1)

        if (attempt === maxRetries) {
          logError(err, { retries: attempt, fn: asyncFn.name || 'anonymous' })
          setError(err)
          setLoading(false)
          throw err
        }

        // Wait before retry with exponential backoff
        const waitTime = delay * Math.pow(backoff, attempt)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }, [asyncFn, maxRetries, delay, backoff])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
    setRetryCount(0)
  }, [])

  return { data, error, loading, retryCount, execute, reset }
}
