import { useState, useEffect } from 'react'

function calculateTimeLeft(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: '00:00:00:00' }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  const pad = (n) => String(n).padStart(2, '0')
  const formatted = `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  return { days, hours, minutes, seconds, isExpired: false, formatted }
}

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}
