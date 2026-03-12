import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { isTeacherPremium } from '../utils/premiumChecks'
import useEscapeKey from '../hooks/useEscapeKey'

// Class data will come from the database. Empty until real data is connected.
const MOCK_CLASSES = []

// Available games will be populated from the games store.
const AVAILABLE_GAMES = []

function QuickStats({ classes, t }) {
  const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0)
  const totalAssignments = classes.reduce((sum, c) => sum + c.assignments.length, 0)

  let totalCompletions = 0
  let totalPossible = 0
  classes.forEach(c => {
    c.assignments.forEach(a => {
      const completions = Object.values(a.completions)
      totalCompletions += completions.filter(Boolean).length
      totalPossible += completions.length
    })
  })
  const avgCompletion = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0

  const stats = [
    { label: t('teacher.classes'), value: classes.length, icon: '\u{1F3EB}' },
    { label: t('teacher.students'), value: totalStudents, icon: '\u{1F464}' },
    { label: t('teacher.assignments'), value: totalAssignments, icon: '\u{1F4CB}' },
    { label: t('teacher.completion'), value: `${avgCompletion}%`, icon: '\u2705' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-bg-card rounded-xl p-4 text-center">
          <span className="text-2xl">{stat.icon}</span>
          <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
          <p className="text-sm text-text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

function ClassSidebar({ classes, selectedClass, onSelect, onCreateNew, t }) {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        {t('teacher.myClasses')}
      </h3>
      <div className="space-y-2">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => onSelect(cls)}
            className={`w-full text-left p-3 rounded-lg transition-colors
              ${selectedClass?.id === cls.id
                ? 'bg-accent/10 border border-accent/30 text-accent'
                : 'bg-bg-card hover:bg-bg-hover text-text-primary'
              }`}
          >
            <p className="font-medium">{cls.name}</p>
            <p className="text-sm text-text-muted mt-0.5">
              {cls.students.length} {t('teacher.students')}
            </p>
          </button>
        ))}
      </div>
      <button
        onClick={onCreateNew}
        className="w-full mt-3 py-2 border-2 border-dashed border-gray-600
                   text-text-muted hover:text-text-primary hover:border-gray-500
                   rounded-lg transition-colors text-sm"
      >
        {t('teacher.newClass')}
      </button>
    </div>
  )
}

function AssignmentCard({ assignment, totalStudents, t }) {
  const completionCount = Object.values(assignment.completions).filter(Boolean).length
  const completionPercent = totalStudents > 0 ? Math.round((completionCount / totalStudents) * 100) : 0
  const deadlineDate = new Date(assignment.deadline).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
  const daysLeft = Math.ceil((new Date(assignment.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysLeft < 0
  const isUrgent = daysLeft <= 3 && daysLeft >= 0

  return (
    <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-text-primary">{assignment.gameName}</h3>
          <p className="text-sm text-text-muted mt-1">
            {t('teacher.deadline', { date: deadlineDate })}
            {isOverdue && <span className="text-error ml-2">{t('teacher.overdue')}</span>}
            {isUrgent && <span className="text-warning ml-2">{t('teacher.daysLeft', { count: daysLeft })}</span>}
            {!isOverdue && !isUrgent && <span className="text-text-muted ml-2">{t('teacher.daysRemaining', { count: daysLeft })}</span>}
          </p>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full
          ${completionPercent >= 80 ? 'bg-success/20 text-success' :
            completionPercent >= 50 ? 'bg-warning/20 text-warning' :
              'bg-error/20 text-error'}`}>
          {completionPercent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>{t('teacher.completed')}</span>
          <span>{t('teacher.studentsCompleted', { completed: completionCount, total: totalStudents })}</span>
        </div>
        <div className="w-full bg-bg-hover rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500
              ${completionPercent >= 80 ? 'bg-success' :
                completionPercent >= 50 ? 'bg-warning' : 'bg-error'}`}
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function ClassDetail({ cls, onAssignGame, t }) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{cls.name}</h2>
          <p className="text-text-muted text-sm">{cls.description}</p>
        </div>
        <button
          onClick={onAssignGame}
          className="bg-accent hover:bg-accent-dark text-white px-4 py-2
                     rounded-lg font-medium text-sm transition-colors"
        >
          {t('teacher.assignTask')}
        </button>
      </div>

      {/* Student overview */}
      <p className="text-sm text-text-muted mb-4">
        {t('teacher.studentsEnrolled', { count: cls.students.length })}
      </p>

      {/* Assignment list */}
      <div className="space-y-4">
        {cls.assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            totalStudents={cls.students.length}
            t={t}
          />
        ))}
      </div>

      {cls.assignments.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <span className="text-4xl block mb-2">{'\u{1F4CB}'}</span>
          {t('teacher.noAssignments')}
        </div>
      )}

      <p className="text-text-muted text-sm mt-6">
        {t('teacher.enrollmentNote')}
      </p>
    </div>
  )
}

function CreateClassModal({ isOpen, onClose, onCreate, t }) {
  const [className, setClassName] = useState('')
  const [classDescription, setClassDescription] = useState('')
  useEscapeKey(onClose, isOpen)

  if (!isOpen) return null

  const handleCreate = () => {
    if (!className.trim()) return
    onCreate({
      id: `class-${Date.now()}`,
      name: className,
      description: classDescription,
      students: [],
      assignments: [],
      createdAt: new Date(),
    })
    setClassName('')
    setClassDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         role="dialog" aria-modal="true" aria-label={t('teacher.createClass')}
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full p-6"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t('teacher.createClass')}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('teacher.className')}
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder={t('teacher.classNamePlaceholder')}
              className="w-full bg-bg-hover text-text-primary border border-gray-600
                         rounded-lg px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('teacher.classDescription')}
            </label>
            <textarea
              value={classDescription}
              onChange={(e) => setClassDescription(e.target.value)}
              placeholder={t('teacher.classDescPlaceholder')}
              rows={3}
              className="w-full bg-bg-hover text-text-primary border border-gray-600
                         rounded-lg px-4 py-3 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-bg-hover hover:bg-gray-500 text-text-primary py-2
                       rounded-lg font-medium transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleCreate}
            disabled={!className.trim()}
            className="flex-1 bg-accent hover:bg-accent-dark text-white py-2 rounded-lg
                       font-semibold transition-colors disabled:opacity-50"
          >
            {t('teacher.create')}
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignGameModal({ isOpen, onClose, onAssign, className, t }) {
  const [selectedGame, setSelectedGame] = useState('')
  const [deadline, setDeadline] = useState('')
  useEscapeKey(onClose, isOpen)

  if (!isOpen) return null

  const handleAssign = () => {
    if (!selectedGame || !deadline) return
    const game = AVAILABLE_GAMES.find(g => g.id === selectedGame)
    if (!game) return
    onAssign({
      id: `assign-${Date.now()}`,
      gameId: selectedGame,
      gameName: game.name,
      deadline: new Date(deadline),
      createdAt: new Date(),
      completions: {},
    })
    setSelectedGame('')
    setDeadline('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         role="dialog" aria-modal="true" aria-label={t('teacher.assignGame')}
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full p-6"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">{t('teacher.assignGame')}</h2>
        <p className="text-text-muted text-sm mb-4">{t('teacher.forClass', { name: className })}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('teacher.selectGame')}
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full bg-bg-hover text-text-primary border border-gray-600
                         rounded-lg px-4 py-3"
            >
              <option value="">{t('teacher.selectGamePlaceholder')}</option>
              {AVAILABLE_GAMES.map((game) => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {t('teacher.deadlineLabel')}
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-bg-hover text-text-primary border border-gray-600
                         rounded-lg px-4 py-3"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-bg-hover hover:bg-gray-500 text-text-primary py-2
                       rounded-lg font-medium transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedGame || !deadline}
            className="flex-1 bg-accent hover:bg-accent-dark text-white py-2 rounded-lg
                       font-semibold transition-colors disabled:opacity-50"
          >
            {t('teacher.assign')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [classes, setClasses] = useState(MOCK_CLASSES)
  const [selectedClassId, setSelectedClassId] = useState(MOCK_CLASSES[0]?.id)
  const [showCreateClassModal, setShowCreateClassModal] = useState(false)
  const [showAssignGameModal, setShowAssignGameModal] = useState(false)

  const selectedClass = classes.find(c => c.id === selectedClassId) || null

  // Redirect when no Teacher Premium
  if (!isTeacherPremium(user)) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-20">
        <>
          <title>Teacher Dashboard | MindForge</title>
          <meta name="description" content="Teacher Dashboard for managing classes and assignments on MindForge." />
          <meta property="og:title" content="Teacher Dashboard | MindForge" />
          <meta property="og:description" content="Teacher Dashboard for managing classes and assignments on MindForge." />
        </>
        <span className="text-6xl block mb-4">{'\u{1F469}\u200D\u{1F3EB}'}</span>
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          {t('teacher.premiumRequired')}
        </h2>
        <p className="text-text-muted mb-6">
          {t('teacher.premiumDesc')}
        </p>
        <Link
          to="/premium"
          className="inline-block bg-accent hover:bg-accent-dark text-white px-8 py-3
                     rounded-lg font-semibold transition-colors"
        >
          {t('teacher.discoverPremium')}
        </Link>
      </div>
    )
  }

  const handleCreateClass = (newClass) => {
    setClasses(prev => [...prev, newClass])
    setSelectedClassId(newClass.id)
  }

  const handleAssignGame = (newAssignment) => {
    setClasses(prev => prev.map(cls =>
      cls.id === selectedClassId
        ? { ...cls, assignments: [...cls.assignments, newAssignment] }
        : cls
    ))
  }

  return (
    <div className="p-6">
      <>
        <title>Teacher Dashboard | MindForge</title>
        <meta name="description" content="Teacher Dashboard for managing classes and assignments on MindForge." />
        <meta property="og:title" content="Teacher Dashboard | MindForge" />
        <meta property="og:description" content="Teacher Dashboard for managing classes and assignments on MindForge." />
      </>

      <h1 className="text-3xl font-bold mb-2">{t('teacher.title')}</h1>
      <p className="text-text-muted mb-8">
        {t('teacher.greeting', { name: user?.username || 'Lehrer' })} {'\u{1F469}\u200D\u{1F3EB}'}
      </p>

      {/* Quick Stats */}
      <QuickStats classes={classes} t={t} />

      {/* Main area: Sidebar + Detail */}
      <div className="flex flex-col md:flex-row gap-6">
        <ClassSidebar
          classes={classes}
          selectedClass={selectedClass}
          onSelect={(cls) => setSelectedClassId(cls.id)}
          onCreateNew={() => setShowCreateClassModal(true)}
          t={t}
        />

        {selectedClass && (
          <ClassDetail
            cls={selectedClass}
            onAssignGame={() => setShowAssignGameModal(true)}
            t={t}
          />
        )}
      </div>

      {/* Modals */}
      <CreateClassModal
        isOpen={showCreateClassModal}
        onClose={() => setShowCreateClassModal(false)}
        onCreate={handleCreateClass}
        t={t}
      />

      <AssignGameModal
        isOpen={showAssignGameModal}
        onClose={() => setShowAssignGameModal(false)}
        onAssign={handleAssignGame}
        className={selectedClass?.name}
        t={t}
      />
    </div>
  )
}
