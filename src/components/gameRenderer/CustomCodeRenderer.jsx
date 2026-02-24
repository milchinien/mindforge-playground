import { useMemo } from 'react'

export default function CustomCodeRenderer({ game, onBack }) {
  const srcdoc = useMemo(() => {
    if (!game.code) return '<p>Kein Code vorhanden</p>'
    const { html = '', css = '', js = '' } = game.code
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:;">
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`
  }, [game.code])

  return (
    <iframe
      srcDoc={srcdoc}
      className="w-full h-full border-0"
      title={game.title || 'Custom Game'}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
    />
  )
}
