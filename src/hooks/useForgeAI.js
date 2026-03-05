import { useState, useRef, useCallback } from 'react'
import { aiService } from '../services/aiService'
import { mockStreamResponse } from '../services/mockAI'
import { extractCodeBlocks, hasCompleteCodeBlock } from '../utils/codeExtractor'

const MAX_CONTEXT_MESSAGES = 20
const USE_MOCK = !import.meta.env.VITE_AI_API_KEY

export function useForgeAI({ code, onApplyCode }) {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const lastAppliedRef = useRef('')
  const cancelledRef = useRef(false)

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return

    setError(null)
    cancelledRef.current = false
    const userMessage = { role: 'user', content: text, timestamp: Date.now() }

    setMessages(prev => [...prev, userMessage])

    // Add empty assistant message for streaming
    const assistantMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
      codeBlocks: null,
    }
    setMessages(prev => [...prev, assistantMessage])
    setIsStreaming(true)
    lastAppliedRef.current = ''

    const abortController = new AbortController()
    abortRef.current = abortController

    try {
      let fullText = ''
      let streamSource

      if (USE_MOCK) {
        // Use local mock AI
        streamSource = mockStreamResponse(text, code)
      } else {
        // Use real API
        const contextMessages = [...messages, userMessage]
          .slice(-MAX_CONTEXT_MESSAGES)
          .map(m => ({ role: m.role, content: m.content }))
        const systemPrompt = aiService.getSystemPrompt(code)
        streamSource = aiService.streamChat(contextMessages, systemPrompt, abortController.signal)
      }

      for await (const chunk of streamSource) {
        if (cancelledRef.current) break

        fullText += chunk

        // Update the last message with new content
        setMessages(prev => {
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          if (lastMsg.role === 'assistant') {
            updated[updated.length - 1] = { ...lastMsg, content: fullText }
          }
          return updated
        })

        // Auto-apply code blocks when complete blocks are detected
        if (hasCompleteCodeBlock(fullText) && fullText !== lastAppliedRef.current) {
          const blocks = extractCodeBlocks(fullText)
          const hasAny = blocks.html || blocks.css || blocks.js
          if (hasAny) {
            lastAppliedRef.current = fullText
            onApplyCode(blocks)
            setMessages(prev => {
              const updated = [...prev]
              const lastMsg = updated[updated.length - 1]
              if (lastMsg.role === 'assistant') {
                updated[updated.length - 1] = { ...lastMsg, codeBlocks: blocks, codeApplied: true }
              }
              return updated
            })
          }
        }
      }

      // Finalize the message
      setMessages(prev => {
        const updated = [...prev]
        const lastMsg = updated[updated.length - 1]
        if (lastMsg.role === 'assistant') {
          const blocks = extractCodeBlocks(fullText)
          const hasAny = blocks.html || blocks.css || blocks.js
          if (hasAny && fullText !== lastAppliedRef.current) {
            onApplyCode(blocks)
          }
          updated[updated.length - 1] = {
            ...lastMsg,
            content: fullText,
            isStreaming: false,
            codeBlocks: hasAny ? blocks : null,
            codeApplied: hasAny,
          }
        }
        return updated
      })
    } catch (err) {
      if (err.name === 'AbortError' || cancelledRef.current) {
        setMessages(prev => {
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          if (lastMsg.role === 'assistant') {
            updated[updated.length - 1] = { ...lastMsg, isStreaming: false }
          }
          return updated
        })
      } else {
        setError(err.message || 'Ein Fehler ist aufgetreten')
        setMessages(prev => {
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          if (lastMsg.role === 'assistant' && !lastMsg.content) {
            return updated.slice(0, -1)
          }
          if (lastMsg.role === 'assistant') {
            updated[updated.length - 1] = { ...lastMsg, isStreaming: false, hasError: true }
          }
          return updated
        })
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [messages, code, onApplyCode, isStreaming])

  const stopGeneration = useCallback(() => {
    cancelledRef.current = true
    if (abortRef.current) {
      abortRef.current.abort()
    }
  }, [])

  const clearHistory = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const reapplyCode = useCallback((messageIndex) => {
    const msg = messages[messageIndex]
    if (msg?.codeBlocks) {
      onApplyCode(msg.codeBlocks)
    }
  }, [messages, onApplyCode])

  // Allow setting messages externally (for draft restore)
  const setMessagesExternal = useCallback((msgs) => {
    setMessages(msgs)
  }, [])

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopGeneration,
    clearHistory,
    reapplyCode,
    setMessages: setMessagesExternal,
    isMock: USE_MOCK,
  }
}
