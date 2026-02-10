import { X, RotateCcw, Clock } from 'lucide-react'

export default function VersionHistory({ game, onClose }) {
  const versions = game.versions || [
    { version: 1, date: game.createdAt, note: 'Erstveroeffentlichung' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Versionen: {game.title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {versions.map((v, i) => (
            <div key={v.version} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-sm font-bold">
                  {v.version}
                </div>
                <div>
                  <p className="text-sm font-medium">{v.note || 'Keine Notiz'}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(v.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {i > 0 && (
                <button
                  onClick={() => alert('Wiederherstellen ist im MVP nur simuliert.')}
                  className="text-text-muted hover:text-accent text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} /> Wiederherstellen
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-bg-secondary hover:bg-bg-hover text-text-secondary rounded-lg transition-colors cursor-pointer"
        >
          Schliessen
        </button>
      </div>
    </div>
  )
}
