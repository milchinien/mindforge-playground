import { useState } from 'react'
import { Coins, TrendingUp, Info, Play, Eye, ChevronDown, ChevronUp, Clock, DollarSign, Percent } from 'lucide-react'
import MindCoinIcon from '../common/MindCoinIcon'
import { formatNumber } from '../../utils/formatters'

// Earnings data will come from the database. Empty until real data is connected.
const MOCK_GAME_EARNINGS = []
const DAILY_EARNINGS = []

// ──────────── EARNINGS CHART ────────────

function EarningsChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-text-primary">Einnahmen (letzte 30 Tage)</h3>
        </div>
        <div className="flex items-center justify-center h-40 text-text-muted text-sm">
          Noch keine Einnahmen-Daten vorhanden.
        </div>
      </div>
    )
  }

  const maxEarnings = Math.max(...data.map(d => d.earnings))
  // Show every 5th label to avoid crowding
  const showLabel = (i) => i % 5 === 0 || i === data.length - 1

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h3 className="font-bold text-text-primary">Einnahmen (letzte 30 Tage)</h3>
      </div>

      <div className="flex items-end gap-[3px] h-40 overflow-x-auto pb-6 relative">
        {data.map((day, i) => {
          const heightPercent = maxEarnings > 0 ? (day.earnings / maxEarnings) * 100 : 0
          return (
            <div key={i} className="flex flex-col items-center flex-1 min-w-[8px] relative group">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 bg-bg-secondary border border-gray-600 rounded px-2 py-1 text-xs text-text-primary hover-show transition-opacity pointer-events-none whitespace-nowrap z-10">
                {day.date}: {day.earnings} MC
              </div>
              <div
                className="w-full rounded-t bg-gradient-to-t from-accent to-accent/50 transition-all duration-300 hover:from-accent hover:to-accent/70"
                style={{ height: `${heightPercent}%`, minHeight: '2px' }}
              />
              {showLabel(i) && (
                <span className="absolute -bottom-5 text-[9px] text-text-muted whitespace-nowrap">
                  {day.date}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-center justify-between text-xs text-text-muted">
        <span>Gesamt: {data.reduce((s, d) => s + d.earnings, 0).toLocaleString('de-DE')} MC</span>
        <span>Durchschnitt: {Math.round(data.reduce((s, d) => s + d.earnings, 0) / data.length)} MC/Tag</span>
      </div>
    </div>
  )
}

// ──────────── PER-GAME TABLE ────────────

function GameEarningsTable({ games }) {
  const [sortBy, setSortBy] = useState('totalEarnings')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  const sorted = [...games].sort((a, b) => {
    const mod = sortDir === 'desc' ? -1 : 1
    return (a[sortBy] - b[sortBy]) * mod
  })

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronDown className="w-3 h-3 text-text-muted" />
    return sortDir === 'desc'
      ? <ChevronDown className="w-3 h-3 text-accent" />
      : <ChevronUp className="w-3 h-3 text-accent" />
  }

  return (
    <div className="bg-bg-card rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-700">
        <h3 className="font-bold text-text-primary flex items-center gap-2">
          <Coins className="w-5 h-5 text-accent" />
          Einnahmen pro Spiel
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-text-muted">
              <th className="text-left px-5 py-3 font-medium">Spiel</th>
              <th className="text-right px-3 py-3 font-medium">
                <button onClick={() => handleSort('plays')} className="inline-flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors">
                  Plays <SortIcon field="plays" />
                </button>
              </th>
              <th className="text-right px-3 py-3 font-medium">
                <button onClick={() => handleSort('earningsPerPlay')} className="inline-flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors">
                  MC/Play <SortIcon field="earningsPerPlay" />
                </button>
              </th>
              <th className="text-right px-3 py-3 font-medium">
                <button onClick={() => handleSort('totalEarnings')} className="inline-flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors">
                  Gesamt <SortIcon field="totalEarnings" />
                </button>
              </th>
              <th className="text-right px-5 py-3 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((game) => (
              <tr key={game.id} className="border-b border-gray-700/50 last:border-0 hover:bg-bg-hover/30 transition-colors">
                <td className="px-5 py-3">
                  <span className="font-medium text-text-primary">{game.title}</span>
                </td>
                <td className="text-right px-3 py-3">
                  <span className="text-text-secondary flex items-center justify-end gap-1">
                    <Play className="w-3 h-3" />
                    {formatNumber(game.plays)}
                  </span>
                </td>
                <td className="text-right px-3 py-3">
                  <span className="text-accent font-medium">{game.earningsPerPlay} MC</span>
                </td>
                <td className="text-right px-3 py-3">
                  <span className="font-bold text-text-primary">{game.totalEarnings.toLocaleString('de-DE')} MC</span>
                </td>
                <td className="text-right px-5 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                    game.trend >= 0
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-red-400 bg-red-500/10'
                  }`}>
                    {game.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                    {game.trend >= 0 ? '+' : ''}{game.trend}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ──────────── MAIN COMPONENT ────────────

export default function RevenuePanel() {
  const totalEarnings = MOCK_GAME_EARNINGS.reduce((sum, g) => sum + g.totalEarnings, 0)
  const totalPlays = MOCK_GAME_EARNINGS.reduce((sum, g) => sum + g.plays, 0)
  const creatorShare = Math.round(totalEarnings * 0.7)
  const platformShare = Math.round(totalEarnings * 0.3)
  const monthlyEarnings = DAILY_EARNINGS.reduce((s, d) => s + d.earnings, 0)

  return (
    <div className="space-y-6">
      {/* Revenue overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-4 h-4 text-accent" />
            <span className="text-text-muted text-sm">Gesamt-Einnahmen</span>
          </div>
          <p className="text-2xl font-bold text-accent">{totalEarnings.toLocaleString('de-DE')}</p>
          <p className="text-xs text-text-muted">MindCoins</p>
        </div>

        <div className="bg-bg-card rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-text-muted text-sm">Dein Anteil (70%)</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{creatorShare.toLocaleString('de-DE')}</p>
          <p className="text-xs text-text-muted">MindCoins</p>
        </div>

        <div className="bg-bg-card rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-text-muted text-sm">Diesen Monat</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{monthlyEarnings.toLocaleString('de-DE')}</p>
          <p className="text-xs text-text-muted">MindCoins</p>
        </div>

        <div className="bg-bg-card rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Play className="w-4 h-4 text-accent" />
            <span className="text-text-muted text-sm">Gesamt Plays</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{formatNumber(totalPlays)}</p>
          <p className="text-xs text-text-muted">Spielvorgaenge</p>
        </div>
      </div>

      {/* Revenue share explanation */}
      <div className="bg-gradient-to-r from-accent/10 to-emerald-500/10 rounded-xl p-5 border border-accent/20">
        <div className="flex items-start gap-3">
          <Percent className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-text-primary mb-2">Revenue-Share Modell</h3>
            <p className="text-sm text-text-secondary mb-3">
              Als Creator erhaeltst du <span className="font-bold text-accent">70%</span> aller MindCoins, die durch deine Spiele generiert werden.
              Die restlichen 30% gehen an MindForge fuer Infrastruktur, Hosting und Plattform-Entwicklung.
            </p>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-bold">Dein Anteil: 70%</span>
                  <span className="text-text-muted">{creatorShare.toLocaleString('de-DE')} MC</span>
                </div>
                <div className="w-full bg-bg-hover rounded-full h-3">
                  <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '70%' }} />
                </div>
              </div>
              <div className="w-32">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-muted font-bold">Plattform: 30%</span>
                  <span className="text-text-muted">{platformShare.toLocaleString('de-DE')} MC</span>
                </div>
                <div className="w-full bg-bg-hover rounded-full h-3">
                  <div className="h-3 rounded-full bg-gray-500" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings chart */}
      <EarningsChart data={DAILY_EARNINGS} />

      {/* Per-game breakdown */}
      <GameEarningsTable games={MOCK_GAME_EARNINGS} />

      {/* Payout status */}
      <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-text-primary mb-2">Auszahlungs-Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-text-secondary">Auszahlungen werden automatisch am Ende jedes Monats verarbeitet</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-sm text-text-secondary">Mindest-Auszahlung: 1.000 MindCoins</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm text-text-secondary">MindCoins koennen im Shop fuer Inhalte oder Avatar-Items verwendet werden</span>
              </div>

              {/* Payout progress */}
              <div className="bg-bg-secondary rounded-lg p-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Naechste Auszahlung</span>
                  <span className="text-sm font-bold text-text-primary flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    01.03.2026
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-text-muted">Aktueller Monat</span>
                  <span className="text-xs text-accent font-bold">{monthlyEarnings.toLocaleString('de-DE')} / 1.000 MC</span>
                </div>
                <div className="w-full bg-bg-hover rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-accent transition-all"
                    style={{ width: `${Math.min(100, (monthlyEarnings / 1000) * 100)}%` }}
                  />
                </div>
                {monthlyEarnings >= 1000 ? (
                  <p className="text-xs text-emerald-400 mt-2 font-medium">Auszahlungs-Schwelle erreicht!</p>
                ) : (
                  <p className="text-xs text-text-muted mt-2">Noch {(1000 - monthlyEarnings).toLocaleString('de-DE')} MC bis zur Auszahlung</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
