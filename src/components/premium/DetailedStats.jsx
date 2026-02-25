import { TrendingUp, TrendingDown, Clock, Target, Flame, Award, BookOpen, BarChart3 } from 'lucide-react'
import { usePremiumStore } from '../../stores/premiumStore'

// ──────────── STREAK CALENDAR (GitHub-style) ────────────

function StreakCalendar({ weeks }) {
  const levelColors = [
    'bg-gray-800',          // level 0 - no activity
    'bg-emerald-900/60',    // level 1 - low
    'bg-emerald-700/70',    // level 2 - medium
    'bg-emerald-500/80',    // level 3 - high
    'bg-emerald-400',       // level 4 - very high
  ]

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-400" />
        <h3 className="font-bold text-text-primary">Lern-Streak Kalender</h3>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                className={`w-3.5 h-3.5 rounded-sm ${levelColors[day.level]} transition-colors`}
                title={`${day.date}: ${['Keine', 'Wenig', 'Mittel', 'Viel', 'Sehr viel'][day.level]} Aktivitaet`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
        <span>Weniger</span>
        <div className="flex gap-1">
          {levelColors.map((color, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
          ))}
        </div>
        <span>Mehr</span>
      </div>
    </div>
  )
}

// ──────────── STRENGTHS BAR CHART ────────────

function StrengthsChart({ strengths }) {
  const maxScore = 100

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-accent" />
        <h3 className="font-bold text-text-primary">Staerken & Schwaechen</h3>
      </div>

      <div className="space-y-3">
        {strengths.map((item) => {
          const percent = (item.score / maxScore) * 100
          const barColor = item.score >= 85
            ? 'bg-emerald-500'
            : item.score >= 70
              ? 'bg-accent'
              : item.score >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'

          return (
            <div key={item.subject}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-primary font-medium">{item.subject}</span>
                <span className={`text-sm font-bold ${
                  item.score >= 85 ? 'text-emerald-400' :
                  item.score >= 70 ? 'text-accent' :
                  item.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {item.score}%
                </span>
              </div>
              <div className="w-full bg-bg-hover rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ──────────── SUBJECT BREAKDOWN ────────────

function SubjectBreakdown({ subjects }) {
  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-accent" />
        <h3 className="font-bold text-text-primary">Faecher-Verteilung</h3>
      </div>

      <div className="space-y-3">
        {subjects.map((item) => (
          <div key={item.subject} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-text-primary flex-1 min-w-0 truncate">{item.subject}</span>
            <div className="w-32 bg-bg-hover rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              />
            </div>
            <span className="text-sm font-bold text-text-secondary w-10 text-right">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ──────────── DAILY TIME CHART ────────────

function DailyTimeChart({ dailyTime }) {
  const maxMinutes = Math.max(...dailyTime.map(d => d.minutes))

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-accent" />
        <h3 className="font-bold text-text-primary">Lernzeit (letzte 7 Tage)</h3>
      </div>

      <div className="flex items-end gap-2 h-36">
        {dailyTime.map((day) => {
          const heightPercent = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-text-secondary">{day.minutes}m</span>
              <div className="w-full flex justify-center flex-1 items-end">
                <div
                  className="w-full max-w-8 rounded-t-md bg-gradient-to-t from-accent to-accent/60 transition-all duration-700"
                  style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                />
              </div>
              <span className="text-xs text-text-muted font-medium">{day.day}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-between text-xs text-text-muted">
        <span>Gesamt: {dailyTime.reduce((s, d) => s + d.minutes, 0)} Minuten</span>
        <span>Durchschnitt: {Math.round(dailyTime.reduce((s, d) => s + d.minutes, 0) / 7)} Min/Tag</span>
      </div>
    </div>
  )
}

// ──────────── IMPROVEMENT TRENDS ────────────

function ImprovementTrends({ improvements }) {
  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-accent" />
        <h3 className="font-bold text-text-primary">Verbesserungs-Trend</h3>
      </div>
      <p className="text-xs text-text-muted mb-4">Veraenderung im Vergleich zum letzten Monat</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {improvements.map((item) => (
          <div
            key={item.subject}
            className={`rounded-lg p-3 border ${
              item.direction === 'up'
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-red-500/5 border-red-500/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {item.direction === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-bold ${
                item.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {item.direction === 'up' ? '+' : ''}{item.change}%
              </span>
            </div>
            <p className="text-xs text-text-secondary">{item.subject}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ──────────── MAIN COMPONENT ────────────

export default function DetailedStats() {
  const { detailedStats } = usePremiumStore()

  return (
    <div className="space-y-6">
      {/* Overview stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-xl p-4 border border-gray-700 text-center">
          <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-text-primary">{detailedStats.totalLearningHours}</p>
          <p className="text-xs text-text-muted">Lernstunden gesamt</p>
        </div>
        <div className="bg-bg-card rounded-xl p-4 border border-gray-700 text-center">
          <Target className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-text-primary">{detailedStats.averageScore}%</p>
          <p className="text-xs text-text-muted">Durchschnittsnote</p>
        </div>
        <div className="bg-bg-card rounded-xl p-4 border border-gray-700 text-center">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-text-primary">{detailedStats.currentStreak}</p>
          <p className="text-xs text-text-muted">Aktueller Streak</p>
        </div>
        <div className="bg-bg-card rounded-xl p-4 border border-gray-700 text-center">
          <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-text-primary">{detailedStats.bestStreak}</p>
          <p className="text-xs text-text-muted">Bester Streak</p>
        </div>
      </div>

      {/* Streak calendar */}
      <StreakCalendar weeks={detailedStats.streakCalendar} />

      {/* Two-column layout for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrengthsChart strengths={detailedStats.strengths} />
        <SubjectBreakdown subjects={detailedStats.subjectBreakdown} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyTimeChart dailyTime={detailedStats.dailyTime} />
        <ImprovementTrends improvements={detailedStats.improvements} />
      </div>
    </div>
  )
}
