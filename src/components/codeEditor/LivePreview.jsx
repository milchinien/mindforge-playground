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
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:;">
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
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
