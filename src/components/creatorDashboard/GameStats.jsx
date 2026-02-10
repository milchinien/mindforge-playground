import { X, Eye, Play, Heart, ThumbsDown, Coins, Clock, BarChart2 } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'

export default function GameStats({ game, onClose }) {
  const likeRatio = game.likes + game.dislikes > 0
    ? Math.round((game.likes / (game.likes + game.dislikes)) * 100)
    : 0

  const mockEarnings = Math.round((game.plays || 0) * (game.price || 0) * 0.1)
  const avgPlayTime = '2m 34s'
  const completionRate = '78%'

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Statistiken: {game.title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1 text-text-muted text-sm">
              <Eye size={14} /> Views
            </div>
            <p className="text-xl font-bold">{formatNumber(game.views || 0)}</p>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1 text-text-muted text-sm">
              <Play size={14} /> Plays
            </div>
            <p className="text-xl font-bold">{formatNumber(game.plays || 0)}</p>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1 text-text-muted text-sm">
              <Heart size={14} /> Like-Ratio
            </div>
            <p className="text-xl font-bold">{likeRatio}%</p>
            <p className="text-xs text-text-muted mt-0.5">{formatNumber(game.likes || 0)} Likes / {formatNumber(game.dislikes || 0)} Dislikes</p>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1 text-text-muted text-sm">
              <Coins size={14} /> Einnahmen
            </div>
            <p className="text-xl font-bold">{formatNumber(mockEarnings)} MC</p>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1 text-text-muted text-sm">
              <Clock size={14} /> Ø Spielzeit
            </div>
            <p className="text-xl font-bold">{avgPlayTime}</p>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1 text-text-muted text-sm">
              <BarChart2 size={14} /> Abschlussrate
            </div>
            <p className="text-xl font-bold">{completionRate}</p>
          </div>
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
