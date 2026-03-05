import { useState } from 'react'
import { Copy, Check, Play } from 'lucide-react'

const LANG_LABELS = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  javascript: 'JavaScript',
}

const LANG_COLORS = {
  html: 'text-orange-400',
  css: 'text-blue-400',
  js: 'text-yellow-400',
  javascript: 'text-yellow-400',
}

export default function ForgeCodeBlock({ code, language, onApply, applied }) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a2e]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-xs font-mono ${LANG_COLORS[language] || 'text-gray-400'} cursor-pointer hover:underline`}
        >
          {LANG_LABELS[language] || language} {collapsed ? '(...)' : ''}
        </button>
        <div className="flex items-center gap-1">
          {onApply && (
            <button
              onClick={() => onApply()}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                applied
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-accent hover:bg-accent/10'
              }`}
            >
              {applied ? <Check size={12} /> : <Play size={12} />}
              {applied ? 'Applied' : 'Apply'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code */}
      {!collapsed && (
        <pre className="bg-[#0d1117] p-3 overflow-x-auto text-xs font-mono text-gray-300 max-h-64 overflow-y-auto">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
