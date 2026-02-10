import { useState, useEffect, useRef } from 'react'

export default function LivePreview({ html, css, js }) {
  const iframeRef = useRef(null)
  const [srcdoc, setSrcdoc] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setSrcdoc(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css || ''}</style>
</head>
<body>
${html || ''}
<script>${js || ''}<\/script>
</body>
</html>`)
    }, 500) // 500ms debounce
    return () => clearTimeout(timer)
  }, [html, css, js])

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        className="w-full h-full border-0"
        title="Live Preview"
        sandbox="allow-scripts"
      />
    </div>
  )
}
