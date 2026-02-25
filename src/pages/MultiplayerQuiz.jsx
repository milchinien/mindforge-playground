import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import {
  Users, Play, Trophy, Clock, Zap, Crown, Medal,
  Copy, Check, ArrowRight, RotateCcw, Home, Star,
  Loader2, Hash, Swords,
} from 'lucide-react'

// Mock quiz questions
const QUIZ_POOLS = {
  math: {
    nameKey: 'quiz.categories.math',
    emoji: '\u{1F4D0}',
    questions: [
      { q: 'Was ist 15 x 12?', options: ['180', '170', '190', '160'], correct: 0 },
      { q: 'Wie viel ist 256 / 8?', options: ['30', '32', '34', '28'], correct: 1 },
      { q: 'Was ist die Quadratwurzel von 144?', options: ['11', '13', '12', '14'], correct: 2 },
      { q: 'Wie viel ist 3\u2074?', options: ['27', '81', '64', '91'], correct: 1 },
      { q: 'Was ist 7! (Fakultaet)?', options: ['720', '5040', '2520', '40320'], correct: 1 },
      { q: 'Wie viel Grad hat ein regelmaessiges Sechseck innen?', options: ['720\u00B0', '540\u00B0', '360\u00B0', '1080\u00B0'], correct: 0 },
    ],
  },
  science: {
    nameKey: 'quiz.categories.science',
    emoji: '\u{1F52C}',
    questions: [
      { q: 'Welches Element hat das Symbol "Fe"?', options: ['Fluor', 'Eisen', 'Francium', 'Fermium'], correct: 1 },
      { q: 'Wie schnell ist Licht (ca.)?', options: ['300.000 km/s', '150.000 km/s', '1.000.000 km/s', '30.000 km/s'], correct: 0 },
      { q: 'Wie viele Knochen hat ein Erwachsener?', options: ['186', '206', '226', '256'], correct: 1 },
      { q: 'Was ist die chemische Formel von Wasser?', options: ['HO\u2082', 'H\u2082O', 'H\u2082O\u2082', 'OH'], correct: 1 },
      { q: 'Welcher Planet ist der groesste?', options: ['Saturn', 'Neptun', 'Jupiter', 'Uranus'], correct: 2 },
      { q: 'Was misst ein Barometer?', options: ['Temperatur', 'Luftdruck', 'Feuchtigkeit', 'Wind'], correct: 1 },
    ],
  },
  general: {
    nameKey: 'quiz.categories.general',
    emoji: '\u{1F4DA}',
    questions: [
      { q: 'Welche Stadt ist die Hauptstadt von Australien?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correct: 2 },
      { q: 'In welchem Jahr fiel die Berliner Mauer?', options: ['1987', '1989', '1991', '1990'], correct: 1 },
      { q: 'Wie viele Saiten hat eine Standardgitarre?', options: ['4', '5', '6', '8'], correct: 2 },
      { q: 'Welches Land hat die meisten Einwohner?', options: ['Indien', 'China', 'USA', 'Indonesien'], correct: 0 },
      { q: 'Wer malte die Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Da Vinci', 'Botticelli'], correct: 2 },
      { q: 'Was ist die kleinste Primzahl?', options: ['0', '1', '2', '3'], correct: 2 },
    ],
  },
}

const ANSWER_COLORS = [
  'bg-red-500/80 hover:bg-red-500',
  'bg-blue-500/80 hover:bg-blue-500',
  'bg-green-500/80 hover:bg-green-500',
  'bg-yellow-500/80 hover:bg-yellow-500',
]

const ANSWER_SHAPES = ['\u25B2', '\u25C6', '\u25CF', '\u25A0']

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function generateBotPlayers(count) {
  const names = ['SchlauerFuchs', 'QuizKoenig', 'BrainStorm', 'WissensMaster', 'DenkProfi', 'RaetselHeld', 'GeniusBoy', 'SmartCookie']
  return Array.from({ length: count }, (_, i) => ({
    id: `bot-${i}`,
    name: names[i % names.length],
    score: 0,
    isBot: true,
    streak: 0,
  }))
}

// ============= LOBBY =============
function QuizLobby({ user, onStart }) {
  const { t } = useTranslation()
  const [roomCode, setRoomCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [questionCount, setQuestionCount] = useState(5)
  const [timePerQuestion, setTimePerQuestion] = useState(15)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState(null) // 'create' | 'join'

  const handleCreate = () => {
    const code = generateRoomCode()
    setRoomCode(code)
    setMode('create')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartGame = () => {
    onStart({
      category: selectedCategory,
      questionCount,
      timePerQuestion,
      roomCode: roomCode || joinCode,
      isHost: mode === 'create',
    })
  }

  if (!mode) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-10">
          <span className="text-6xl block mb-4">{'\u26A1'}</span>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{t('quiz.title')}</h1>
          <p className="text-text-secondary">{t('quiz.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleCreate}
            className="bg-bg-card rounded-2xl p-8 border border-gray-700 hover:border-accent/50 transition-all cursor-pointer text-left group"
          >
            <Swords size={32} className="text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-text-primary mb-1">{t('quiz.createGame')}</h3>
            <p className="text-sm text-text-muted">{t('quiz.createDesc')}</p>
          </button>

          <button
            onClick={() => setMode('join')}
            className="bg-bg-card rounded-2xl p-8 border border-gray-700 hover:border-accent/50 transition-all cursor-pointer text-left group"
          >
            <Users size={32} className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-text-primary mb-1">{t('quiz.joinGame')}</h3>
            <p className="text-sm text-text-muted">{t('quiz.joinDesc')}</p>
          </button>
        </div>

        {/* Quick Play */}
        <button
          onClick={() => {
            setMode('create')
            setRoomCode(generateRoomCode())
            setTimeout(() => onStart({
              category: 'general',
              questionCount: 5,
              timePerQuestion: 15,
              roomCode: generateRoomCode(),
              isHost: true,
              quickPlay: true,
            }), 100)
          }}
          className="w-full mt-6 bg-accent hover:bg-accent-dark text-white py-4 rounded-2xl font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <Zap size={20} />
          {t('quiz.quickPlay')}
        </button>
      </div>
    )
  }

  if (mode === 'join') {
    return (
      <div className="max-w-md mx-auto py-8">
        <h2 className="text-2xl font-bold text-center mb-6">{t('quiz.joinGame')}</h2>
        <div className="bg-bg-card rounded-2xl p-6 border border-gray-700">
          <label className="block text-sm font-medium text-text-secondary mb-2">{t('quiz.enterCode')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder={t('quiz.codePlaceholder')}
              maxLength={6}
              className="flex-1 bg-bg-primary border border-gray-600 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest text-text-primary uppercase
                         focus:outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={handleStartGame}
            disabled={joinCode.length < 4}
            className="w-full mt-4 bg-accent hover:bg-accent-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            {t('quiz.join')}
          </button>
          <button
            onClick={() => setMode(null)}
            className="w-full mt-2 text-text-muted hover:text-text-primary py-2 text-sm transition-colors cursor-pointer"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    )
  }

  // Create mode - settings
  return (
    <div className="max-w-lg mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-6">{t('quiz.createGame')}</h2>

      {/* Room Code */}
      <div className="bg-bg-card rounded-2xl p-5 border border-accent/30 mb-6 text-center">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">{t('quiz.roomCode')}</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl font-mono font-bold tracking-[0.3em] text-accent">{roomCode}</span>
          <button onClick={handleCopy} className="text-text-muted hover:text-accent transition-colors cursor-pointer">
            {copied ? <Check size={20} className="text-success" /> : <Copy size={20} />}
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2">{t('quiz.shareCode')}</p>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">{t('quiz.category')}</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(QUIZ_POOLS).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                selectedCategory === key
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-700 bg-bg-card text-text-secondary hover:border-gray-500'
              }`}
            >
              <span className="text-2xl block">{cat.emoji}</span>
              <span className="text-xs font-medium mt-1 block">{t(cat.nameKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            <Hash size={14} className="inline mr-1" /> {t('quiz.questions')}
          </label>
          <select
            value={questionCount}
            onChange={e => setQuestionCount(Number(e.target.value))}
            className="w-full bg-bg-card border border-gray-700 rounded-xl px-4 py-2.5 text-text-primary cursor-pointer"
          >
            {[3, 5, 6].map(n => (
              <option key={n} value={n}>{t('quiz.questionsCount', { count: n })}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            <Clock size={14} className="inline mr-1" /> {t('quiz.timePerQuestion')}
          </label>
          <select
            value={timePerQuestion}
            onChange={e => setTimePerQuestion(Number(e.target.value))}
            className="w-full bg-bg-card border border-gray-700 rounded-xl px-4 py-2.5 text-text-primary cursor-pointer"
          >
            {[10, 15, 20, 30].map(n => (
              <option key={n} value={n}>{t('quiz.seconds', { count: n })}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleStartGame}
        className="w-full bg-accent hover:bg-accent-dark text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Play size={20} /> {t('quiz.startGame')}
      </button>
      <button
        onClick={() => setMode(null)}
        className="w-full mt-2 text-text-muted hover:text-text-primary py-2 text-sm transition-colors cursor-pointer"
      >
        {t('common.back')}
      </button>
    </div>
  )
}

// ============= LIVE QUIZ GAME =============
function LiveQuiz({ config, user, onFinish }) {
  const { t } = useTranslation()
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timePerQuestion)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [players, setPlayers] = useState(() => {
    const bots = generateBotPlayers(4)
    return [
      { id: 'me', name: user?.username || t('leaderboards.you'), score: 0, isBot: false, streak: 0 },
      ...bots,
    ]
  })
  const timerRef = useRef(null)

  const pool = QUIZ_POOLS[config.category] || QUIZ_POOLS[Object.keys(QUIZ_POOLS)[0]]
  const questions = pool.questions.slice(0, config.questionCount)
  const question = questions[currentQ]
  const isFinished = currentQ >= questions.length

  // Timer
  useEffect(() => {
    if (showResult || isFinished) return
    setTimeLeft(config.timePerQuestion)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentQ, showResult, isFinished])

  const handleTimeout = useCallback(() => {
    if (showResult) return
    setSelectedAnswer(-1)
    setStreak(0)
    setShowResult(true)
    simulateBotAnswers()
    setTimeout(nextQuestion, 2500)
  }, [showResult, currentQ])

  const simulateBotAnswers = () => {
    setPlayers(prev => prev.map(p => {
      if (!p.isBot) return p
      const isCorrect = Math.random() > 0.35
      const bonus = isCorrect ? Math.floor(Math.random() * 300) + 700 : 0
      return {
        ...p,
        score: p.score + bonus,
        streak: isCorrect ? p.streak + 1 : 0,
      }
    }))
  }

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null || showResult) return
    clearInterval(timerRef.current)
    setSelectedAnswer(idx)

    const isCorrect = idx === question.correct
    const timeBonus = Math.floor((timeLeft / config.timePerQuestion) * 500)
    const streakBonus = streak >= 2 ? streak * 50 : 0
    const points = isCorrect ? 500 + timeBonus + streakBonus : 0

    if (isCorrect) {
      setStreak(prev => prev + 1)
      setScore(prev => prev + points)
      setPlayers(prev => prev.map(p =>
        p.id === 'me' ? { ...p, score: p.score + points, streak: p.streak + 1 } : p
      ))
    } else {
      setStreak(0)
      setPlayers(prev => prev.map(p =>
        p.id === 'me' ? { ...p, streak: 0 } : p
      ))
    }

    simulateBotAnswers()
    setShowResult(true)
    setTimeout(nextQuestion, 2500)
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentQ(prev => prev + 1)
  }

  if (isFinished) {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const myRank = sorted.findIndex(p => p.id === 'me') + 1

    return (
      <div className="max-w-lg mx-auto py-8 text-center">
        <span className="text-6xl block mb-4">{myRank === 1 ? '\u{1F3C6}' : myRank <= 3 ? '\u{1F3C5}' : '\u{1F44F}'}</span>
        <h2 className="text-3xl font-bold text-text-primary mb-1">
          {myRank === 1 ? t('quiz.congratulations') : myRank <= 3 ? t('quiz.wellPlayed') : t('quiz.gameOver')}
        </h2>
        <p className="text-text-muted mb-6">{t('quiz.yourRank', { rank: myRank, total: sorted.length })}</p>

        {/* Score Card */}
        <div className="bg-bg-card rounded-2xl p-6 border border-gray-700 mb-6">
          <p className="text-4xl font-bold text-accent mb-1">{score.toLocaleString('de-DE')}</p>
          <p className="text-text-muted text-sm">{t('quiz.points')}</p>
        </div>

        {/* Scoreboard */}
        <div className="bg-bg-card rounded-2xl border border-gray-700 overflow-hidden mb-6">
          {sorted.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-5 py-3 border-b border-gray-700/50 last:border-0 ${
                p.id === 'me' ? 'bg-accent/10' : ''
              }`}
            >
              <span className="w-8 text-center font-bold text-lg">
                {i === 0 ? <Crown size={20} className="text-yellow-400 mx-auto" /> :
                 i === 1 ? <Medal size={20} className="text-gray-300 mx-auto" /> :
                 i === 2 ? <Medal size={20} className="text-amber-600 mx-auto" /> :
                 <span className="text-text-muted">{i + 1}</span>}
              </span>
              <span className={`flex-1 text-left font-medium ${p.id === 'me' ? 'text-accent' : 'text-text-primary'}`}>
                {p.name} {p.id === 'me' && `(${t('leaderboards.you')})`}
              </span>
              <span className="font-bold text-text-primary">{p.score.toLocaleString('de-DE')}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onFinish('lobby')}
            className="flex-1 bg-bg-card hover:bg-bg-hover text-text-primary py-3 rounded-xl font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 border border-gray-700"
          >
            <Home size={18} /> {t('quiz.lobby')}
          </button>
          <button
            onClick={() => onFinish('replay')}
            className="flex-1 bg-accent hover:bg-accent-dark text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> {t('quiz.playAgain')}
          </button>
        </div>
      </div>
    )
  }

  const timerPct = (timeLeft / config.timePerQuestion) * 100
  const timerColor = timeLeft <= 3 ? 'bg-error' : timeLeft <= 7 ? 'bg-warning' : 'bg-accent'

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Header: Question counter + Timer + Score */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-text-muted">
          {t('quiz.questionOf', { current: currentQ + 1, total: questions.length })}
        </span>
        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full font-bold flex items-center gap-1">
              <Zap size={12} /> {t('quiz.streak', { count: streak })}
            </span>
          )}
          <span className="text-sm font-bold text-accent">{score.toLocaleString('de-DE')} {t('quiz.pts')}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-bg-card rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-bg-card rounded-2xl p-8 border border-gray-700 mb-6 text-center min-h-[120px] flex items-center justify-center">
        <h2 className="text-xl font-bold text-text-primary">{question.q}</h2>
      </div>

      {/* Answers Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {question.options.map((opt, idx) => {
          let btnClass = ANSWER_COLORS[idx]
          if (showResult) {
            if (idx === question.correct) btnClass = 'bg-success ring-2 ring-success/50'
            else if (idx === selectedAnswer) btnClass = 'bg-error/60 ring-2 ring-error/50'
            else btnClass = 'bg-gray-700/50 opacity-50'
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={showResult}
              className={`${btnClass} text-white p-5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-3 text-left disabled:cursor-default`}
            >
              <span className="text-xl opacity-60">{ANSWER_SHAPES[idx]}</span>
              <span className="text-sm sm:text-base">{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Live Scoreboard Mini */}
      <div className="bg-bg-card rounded-xl p-3 border border-gray-700/50">
        <div className="flex gap-3 overflow-x-auto">
          {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
            <div
              key={p.id}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                p.id === 'me' ? 'bg-accent/15 border border-accent/30' : 'bg-bg-primary/40'
              }`}
            >
              <span className="text-xs font-bold text-text-muted">{i + 1}.</span>
              <span className={`text-xs font-medium truncate max-w-[80px] ${p.id === 'me' ? 'text-accent' : 'text-text-secondary'}`}>
                {p.name}
              </span>
              <span className="text-xs font-bold text-text-primary">{p.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============= MAIN =============
export default function MultiplayerQuiz() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [gameState, setGameState] = useState('lobby') // 'lobby' | 'playing'
  const [gameConfig, setGameConfig] = useState(null)

  const handleStart = (config) => {
    setGameConfig(config)
    setGameState('playing')
    showToast(t('quiz.quizStarting'), 'success')
  }

  const handleFinish = (action) => {
    if (action === 'replay') {
      setGameState('playing')
      setGameConfig(prev => ({ ...prev }))
    } else {
      setGameState('lobby')
      setGameConfig(null)
    }
  }

  if (gameState === 'playing' && gameConfig) {
    return (
      <>
        <>
          <title>Quiz Arena | MindForge</title>
          <meta name="description" content="Compete against other players in the MindForge Quiz Arena." />
          <meta property="og:title" content="Quiz Arena | MindForge" />
          <meta property="og:description" content="Compete against other players in the MindForge Quiz Arena." />
        </>
        <LiveQuiz key={JSON.stringify(gameConfig)} config={gameConfig} user={user} onFinish={handleFinish} />
      </>
    )
  }

  return (
    <>
      <>
        <title>Quiz Arena | MindForge</title>
        <meta name="description" content="Compete against other players in the MindForge Quiz Arena." />
        <meta property="og:title" content="Quiz Arena | MindForge" />
        <meta property="og:description" content="Compete against other players in the MindForge Quiz Arena." />
      </>
      <QuizLobby user={user} onStart={handleStart} />
    </>
  )
}
