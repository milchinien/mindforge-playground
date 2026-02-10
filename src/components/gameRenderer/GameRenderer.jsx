import QuizRenderer from './QuizRenderer'
import CustomCodeRenderer from './CustomCodeRenderer'

export default function GameRenderer({ game, onBack, onRestart }) {
  if (game.type === 'quiz' || game.mode === 'template') {
    return <QuizRenderer game={game} onBack={onBack} onRestart={onRestart} />
  }

  if (game.mode === 'freeform' && game.code) {
    return <CustomCodeRenderer game={game} onBack={onBack} />
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-xl text-white mb-4">Unbekannter Spieltyp</p>
        <button onClick={onBack} className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-lg cursor-pointer">
          Zurueck
        </button>
      </div>
    </div>
  )
}
