import { useState, useCallback } from 'react'
import { FORGE_TIPS, RESPONSE_PATTERNS, SMART_RESPONSES } from './aiResponsePatterns'

// Fuzzy matching: check if any word in text partially matches any trigger (min 3 chars)
function fuzzyScore(text, triggers) {
  const words = text.split(/\s+/)
  let score = 0
  for (const trigger of triggers) {
    // Exact substring match (high value)
    if (text.includes(trigger)) {
      score += 3
      continue
    }
    // Partial match: word starts with trigger or trigger starts with word (min 3 chars)
    for (const word of words) {
      if (word.length < 3) continue
      if (trigger.startsWith(word) || word.startsWith(trigger)) {
        score += 1
      }
    }
  }
  return score
}

export function useAIChat(codeContext) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `🤖⚒️ **FORGE** online!

Yo, Abenteurer! Ich bin dein KI-Schmied - ich schmiede dir Game-Components aus Code.

Sag mir was du brauchst oder tippe \`hilfe\` fuer mein volles Arsenal!`,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [requestCount, setRequestCount] = useState(0)
  const maxRequests = 50

  const findBestResponse = useCallback((text) => {
    const lowerText = text.toLowerCase()

    // Score-based fuzzy matching for code responses
    const scored = RESPONSE_PATTERNS.map((pattern) => ({
      pattern,
      score: fuzzyScore(lowerText, pattern.triggers),
    }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)

    // If clear best match (score >= 3 or only one match), return it
    if (scored.length > 0 && (scored[0].score >= 3 || scored.length === 1)) {
      const p = scored[0].pattern
      if (p.forgeIntro) {
        return {
          content: p.forgeIntro,
          codeResponse: p.response,
          card: { id: p.id, icon: p.icon, label: p.label, difficulty: p.difficulty, description: p.description },
        }
      }
      return { content: p.response }
    }

    // If multiple weak matches, show top suggestions
    if (scored.length > 1) {
      const suggestions = scored.slice(0, 4).map((s) => ({
        id: s.pattern.id,
        label: s.pattern.label,
        icon: s.pattern.icon,
      }))
      return {
        content: 'Hmm, da gibt es mehrere Moeglichkeiten in Forge\'s Werkstatt! Was soll es sein?',
        suggestions,
      }
    }

    // Check smart responses (greetings, etc.)
    const smartMatch = SMART_RESPONSES.find((r) => {
      const hasTrigger = r.triggers.some((t) => lowerText.includes(t))
      const hasExact = r.exactTriggers?.some((t) => {
        const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`\\b${escaped}\\b`, 'i')
        return regex.test(lowerText)
      })
      return hasTrigger || hasExact
    })
    if (smartMatch) return { content: smartMatch.response }

    // No match at all → show all categories as multiple choice
    const mainCategories = RESPONSE_PATTERNS
      .filter((p) => p.id !== 'help')
      .map((p) => ({ id: p.id, label: p.label, icon: p.icon }))
    return {
      content: 'Das kenn ich noch nicht, Abenteurer! Aber schau mal in Forge\'s Werkstatt - vielleicht ist was Passendes dabei:',
      suggestions: mainCategories,
    }
  }, [])

  const sendMessage = useCallback(
    async (text, categoryId) => {
      if (isLoading || requestCount >= maxRequests) return

      // If categoryId provided, find that pattern directly
      if (categoryId) {
        const pattern = RESPONSE_PATTERNS.find((p) => p.id === categoryId)
        if (!pattern) return

        const userMessage = { role: 'user', content: text, hidden: true }
        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)
        await new Promise((r) => setTimeout(r, 800))

        const newCount = requestCount + 1
        let intro = pattern.forgeIntro || ''
        if (newCount % 3 === 0) {
          intro += FORGE_TIPS[Math.floor(Math.random() * FORGE_TIPS.length)]
        }

        if (pattern.forgeIntro) {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: intro,
            codeResponse: pattern.response,
            card: { id: pattern.id, icon: pattern.icon, label: pattern.label, difficulty: pattern.difficulty, description: pattern.description },
          }])
        } else {
          setMessages((prev) => [...prev, { role: 'assistant', content: pattern.response }])
        }
        setRequestCount((prev) => prev + 1)
        setIsLoading(false)
        return
      }

      if (!text.trim()) return

      const userMessage = { role: 'user', content: text }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      // Simulate API delay
      const lowerText = text.toLowerCase()
      const isSimple = SMART_RESPONSES.some((r) =>
        r.triggers.some((t) => lowerText.includes(t))
      )
      await new Promise((r) => setTimeout(r, isSimple ? 500 : 1000))

      const result = findBestResponse(text)
      const newCount = requestCount + 1
      let content = result.content
      if (newCount % 3 === 0) {
        content += FORGE_TIPS[Math.floor(Math.random() * FORGE_TIPS.length)]
      }

      const aiMessage = {
        role: 'assistant',
        content,
        codeResponse: result.codeResponse,
        card: result.card,
        suggestions: result.suggestions,
      }

      setMessages((prev) => [...prev, aiMessage])
      setRequestCount((prev) => prev + 1)
      setIsLoading(false)
    },
    [isLoading, requestCount, maxRequests, findBestResponse]
  )

  return { messages, isLoading, sendMessage, requestCount, maxRequests }
}
