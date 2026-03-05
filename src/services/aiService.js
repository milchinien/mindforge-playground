const API_ENDPOINT = import.meta.env.VITE_AI_API_URL || 'https://api.anthropic.com/v1/messages'

export class AIService {
  constructor(config = {}) {
    this.endpoint = config.endpoint || API_ENDPOINT
    this.apiKey = config.apiKey || import.meta.env.VITE_AI_API_KEY || ''
    this.model = config.model || 'claude-sonnet-4-20250514'
  }

  getSystemPrompt(currentCode) {
    return `Du bist Forge KI, der Spielerstellungs-Assistent von MindForge – einer Gaming + Education Plattform.

DEINE AUFGABE:
Du hilfst Usern, interaktive Lernspiele als HTML/CSS/JavaScript zu erstellen. Du bist enthusiastisch, nutzt Gaming-Sprache und Schmiede-Metaphern.

REGELN:
- Antworte IMMER in der Sprache des Users (Deutsch oder Englisch)
- Generiere vollstaendigen, funktionierenden HTML/CSS/JS Code
- Nutze das MindForge Dark Theme (background: #111827, accent: #f97316, text: #f9fafb)
- Spiele muessen self-contained sein (KEINE externen Dependencies, CDNs oder Imports)
- Gib Code in DREI separaten Code-Bloecken zurueck: \`\`\`html, \`\`\`css, \`\`\`javascript
- Bei Aenderungswuenschen: Gib trotzdem ALLE drei Bloecke komplett zurueck
- Halte dich an Educational Game Design Best Practices
- Buttons und interaktive Elemente muessen gut sichtbar und klickbar sein
- Jedes Spiel braucht klares Feedback (richtig/falsch, Score, Fortschritt)

PERSOENLICHKEIT:
- Enthusiastisch und motivierend
- Nutze Schmiede-Metaphern ("geschmiedet", "in der Esse", "gehärtet")
- Gaming-Sprache ("Level up", "Achievement", "Quest")
- Kurze, praegnante Antworten - nicht zu viel Text, fokus auf Code

AKTUELLER CODE-STAND:
\`\`\`html
${currentCode.html || ''}
\`\`\`

\`\`\`css
${currentCode.css || ''}
\`\`\`

\`\`\`javascript
${currentCode.js || ''}
\`\`\``
  }

  async *streamChat(messages, systemPrompt, signal) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.model,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
        max_tokens: 8192,
      }),
      signal,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') return
          try {
            const parsed = JSON.parse(data)
            // Anthropic streaming format
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              yield parsed.delta.text
            }
            // OpenAI-compatible format
            if (parsed.choices?.[0]?.delta?.content) {
              yield parsed.choices[0].delta.content
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    }
  }

  async chat(messages, systemPrompt) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.model,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: false,
        max_tokens: 8192,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data.content?.[0]?.text || data.choices?.[0]?.message?.content || ''
  }
}

export const aiService = new AIService()
