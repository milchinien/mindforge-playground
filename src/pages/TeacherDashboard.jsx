import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { isTeacherPremium } from '../utils/premiumChecks'

const MOCK_CLASSES = [
  {
    id: 'class-1',
    name: 'Mathe 10a',
    description: 'Mathematik Klasse 10a, Schuljahr 2024/2025',
    students: [
      { uid: 'student-1', username: 'MaxMustermann', displayName: 'Max Mustermann', avatar: null },
      { uid: 'student-2', username: 'AnnaSchmidt', displayName: 'Anna Schmidt', avatar: null },
      { uid: 'student-3', username: 'TimBerger', displayName: 'Tim Berger', avatar: null },
      { uid: 'student-4', username: 'LauraWeber', displayName: 'Laura Weber', avatar: null },
      { uid: 'student-5', username: 'PaulFischer', displayName: 'Paul Fischer', avatar: null },
      { uid: 'student-6', username: 'SophieWagner', displayName: 'Sophie Wagner', avatar: null },
      { uid: 'student-7', username: 'LeonBauer', displayName: 'Leon Bauer', avatar: null },
      { uid: 'student-8', username: 'EmmaHoffmann', displayName: 'Emma Hoffmann', avatar: null },
      { uid: 'student-9', username: 'FelixSchulz', displayName: 'Felix Schulz', avatar: null },
      { uid: 'student-10', username: 'MiaKoch', displayName: 'Mia Koch', avatar: null },
      { uid: 'student-11', username: 'NoahRichter', displayName: 'Noah Richter', avatar: null },
      { uid: 'student-12', username: 'LenaKlein', displayName: 'Lena Klein', avatar: null },
    ],
    assignments: [
      {
        id: 'assign-1',
        gameId: 'mathe-quiz-pro',
        gameName: 'Mathe-Quiz Pro',
        deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completions: {
          'student-1': true, 'student-2': true, 'student-3': false, 'student-4': true,
          'student-5': false, 'student-6': true, 'student-7': true, 'student-8': false,
          'student-9': true, 'student-10': true, 'student-11': false, 'student-12': true,
        },
      },
      {
        id: 'assign-2',
        gameId: 'geometrie-runde',
        gameName: 'Geometrie-Runde',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completions: {
          'student-1': true, 'student-2': false, 'student-3': true, 'student-4': false,
          'student-5': true, 'student-6': false, 'student-7': true, 'student-8': false,
          'student-9': false, 'student-10': true, 'student-11': false, 'student-12': false,
        },
      },
      {
        id: 'assign-3',
        gameId: 'bruchrechnung-basics',
        gameName: 'Bruchrechnung Basics',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completions: {
          'student-1': false, 'student-2': false, 'student-3': true, 'student-4': false,
          'student-5': false, 'student-6': false, 'student-7': false, 'student-8': false,
          'student-9': true, 'student-10': false, 'student-11': false, 'student-12': false,
        },
      },
    ],
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'class-2',
    name: 'Physik 9b',
    description: 'Physik Klasse 9b, Schuljahr 2024/2025',
    students: [
      { uid: 'student-20', username: 'JanKowalski', displayName: 'Jan Kowalski', avatar: null },
      { uid: 'student-21', username: 'MariaGross', displayName: 'Maria Gross', avatar: null },
      { uid: 'student-22', username: 'DavidLang', displayName: 'David Lang', avatar: null },
      { uid: 'student-23', username: 'SarahBraun', displayName: 'Sarah Braun', avatar: null },
      { uid: 'student-24', username: 'LukasWolf', displayName: 'Lukas Wolf', avatar: null },
      { uid: 'student-25', username: 'HannahSchwarz', displayName: 'Hannah Schwarz', avatar: null },
      { uid: 'student-26', username: 'BenZimmermann', displayName: 'Ben Zimmermann', avatar: null },
      { uid: 'student-27', username: 'ClaraMeyer', displayName: 'Clara Meyer', avatar: null },
      { uid: 'student-28', username: 'TomSchroeder', displayName: 'Tom Schroeder', avatar: null },
      { uid: 'student-29', username: 'LisaNeumann', displayName: 'Lisa Neumann', avatar: null },
      { uid: 'student-30', username: 'JonasKrause', displayName: 'Jonas Krause', avatar: null },
      { uid: 'student-31', username: 'EmilyPeters', displayName: 'Emily Peters', avatar: null },
    ],
    assignments: [
      {
        id: 'assign-4',
        gameId: 'physik-sim-grundlagen',
        gameName: 'Physik-Simulation: Grundlagen',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completions: {
          'student-20': true, 'student-21': true, 'student-22': false, 'student-23': true,
          'student-24': false, 'student-25': false, 'student-26': true, 'student-27': false,
          'student-28': true, 'student-29': false, 'student-30': true, 'student-31': false,
        },
      },
      {
        id: 'assign-5',
        gameId: 'kraft-und-bewegung',
        gameName: 'Kraft und Bewegung',
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completions: {
          'student-20': false, 'student-21': true, 'student-22': false, 'student-23': false,
          'student-24': false, 'student-25': false, 'student-26': false, 'student-27': false,
          'student-28': false, 'student-29': false, 'student-30': false, 'student-31': false,
        },
      },
    ],
    createdAt: new Date('2024-09-01'),
  },
]

const AVAILABLE_GAMES = [
  { id: 'mathe-quiz-pro', name: 'Mathe-Quiz Pro' },
  { id: 'geometrie-runde', name: 'Geometrie-Runde' },
  { id: 'bruchrechnung-basics', name: 'Bruchrechnung Basics' },
  { id: 'physik-sim-grundlagen', name: 'Physik-Simulation: Grundlagen' },
  { id: 'kraft-und-bewegung', name: 'Kraft und Bewegung' },
  { id: 'vokabel-trainer', name: 'Vokabel-Trainer Englisch' },
  { id: 'geschichts-quiz', name: 'Geschichts-Quiz: Mittelalter' },
]

function QuickStats({ classes }) {
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
    { label: 'Klassen', value: classes.length, icon: '\u{1F3EB}' },
    { label: 'Schueler', value: totalStudents, icon: '\u{1F464}' },
    { label: 'Aufgaben', value: totalAssignments, icon: '\u{1F4CB}' },
    { label: 'Abschluss', value: `${avgCompletion}%`, icon: '\u2705' },
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

function ClassSidebar({ classes, selectedClass, onSelect, onCreateNew }) {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Meine Klassen
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
              {cls.students.length} Schueler
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
        + Neue Klasse
      </button>
    </div>
  )
}

function AssignmentCard({ assignment, totalStudents }) {
  const completionCount = Object.values(assignment.completions).filter(Boolean).length
  const completionPercent = Math.round((completionCount / totalStudents) * 100)
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
            Deadline: {deadlineDate}
            {isOverdue && <span className="text-error ml-2">(Ueberfaellig!)</span>}
            {isUrgent && <span className="text-warning ml-2">({daysLeft} Tage!)</span>}
            {!isOverdue && !isUrgent && <span className="text-text-muted ml-2">({daysLeft} Tage)</span>}
          </p>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full
          ${completionPercent >= 80 ? 'bg-success/20 text-success' :
            completionPercent >= 50 ? 'bg-warning/20 text-warning' :
              'bg-error/20 text-error'}`}>
          {completionPercent}%
        </span>
      </div>

      {/* Fortschrittsbalken */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>Abgeschlossen</span>
          <span>{completionCount}/{totalStudents} Schueler</span>
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

function ClassDetail({ cls, onAssignGame }) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{cls.name}</h2>
          <p className="text-text-muted text-sm">{cls.description}</p>
        </div>
        <button
          onClick={onAssignGame}
          className="bg-accent hover:bg-orange-600 text-white px-4 py-2
                     rounded-lg font-medium text-sm transition-colors"
        >
          + Aufgabe zuweisen
        </button>
      </div>

      {/* Schueler-Uebersicht */}
      <p className="text-sm text-text-muted mb-4">
        {cls.students.length} Schueler eingeschrieben
      </p>

      {/* Aufgaben-Liste */}
      <div className="space-y-4">
        {cls.assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            totalStudents={cls.students.length}
          />
        ))}
      </div>

      {cls.assignments.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <span className="text-4xl block mb-2">{'\u{1F4CB}'}</span>
          Noch keine Aufgaben zugewiesen.
        </div>
      )}

      <p className="text-text-muted text-sm mt-6">
        Schueler-Einschreibung: In einer spaeteren Version koennen Schueler ueber einen
        Klassen-Code beitreten.
      </p>
    </div>
  )
}

function CreateClassModal({ isOpen, onClose, onCreate }) {
  const [className, setClassName] = useState('')
  const [classDescription, setClassDescription] = useState('')

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
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full p-6"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Neue Klasse erstellen</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Klassenname *
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="z.B. Mathe 10a"
              className="w-full bg-bg-hover text-text-primary border border-gray-600
                         rounded-lg px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Beschreibung
            </label>
            <textarea
              value={classDescription}
              onChange={(e) => setClassDescription(e.target.value)}
              placeholder="z.B. Mathematik Klasse 10a, Schuljahr 2024/2025"
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
            Abbrechen
          </button>
          <button
            onClick={handleCreate}
            disabled={!className.trim()}
            className="flex-1 bg-accent hover:bg-orange-600 text-white py-2 rounded-lg
                       font-semibold transition-colors disabled:opacity-50"
          >
            Erstellen
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignGameModal({ isOpen, onClose, onAssign, className }) {
  const [selectedGame, setSelectedGame] = useState('')
  const [deadline, setDeadline] = useState('')

  if (!isOpen) return null

  const handleAssign = () => {
    if (!selectedGame || !deadline) return
    const game = AVAILABLE_GAMES.find(g => g.id === selectedGame)
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
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full p-6"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">Aufgabe zuweisen</h2>
        <p className="text-text-muted text-sm mb-4">Klasse: {className}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Spiel auswaehlen *
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full bg-bg-hover text-text-primary border border-gray-600
                         rounded-lg px-4 py-3"
            >
              <option value="">Spiel waehlen...</option>
              {AVAILABLE_GAMES.map((game) => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Deadline *
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
            Abbrechen
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedGame || !deadline}
            className="flex-1 bg-accent hover:bg-orange-600 text-white py-2 rounded-lg
                       font-semibold transition-colors disabled:opacity-50"
          >
            Zuweisen
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState(MOCK_CLASSES)
  const [selectedClass, setSelectedClass] = useState(MOCK_CLASSES[0])
  const [showCreateClassModal, setShowCreateClassModal] = useState(false)
  const [showAssignGameModal, setShowAssignGameModal] = useState(false)

  // Redirect wenn kein Teacher Premium
  if (!isTeacherPremium(user)) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-20">
        <span className="text-6xl block mb-4">{'\u{1F469}\u200D\u{1F3EB}'}</span>
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Teacher Premium erforderlich
        </h2>
        <p className="text-text-muted mb-6">
          Das Teacher Dashboard ist exklusiv fuer Teacher Premium Mitglieder.
          Erstelle Klassen, weise Spiele zu und verfolge den Fortschritt deiner Schueler.
        </p>
        <Link
          to="/premium"
          className="inline-block bg-accent hover:bg-orange-600 text-white px-8 py-3
                     rounded-lg font-semibold transition-colors"
        >
          Teacher Premium entdecken
        </Link>
      </div>
    )
  }

  const handleCreateClass = (newClass) => {
    setClasses(prev => [...prev, newClass])
  }

  const handleAssignGame = (newAssignment) => {
    setClasses(prev => prev.map(cls =>
      cls.id === selectedClass.id
        ? { ...cls, assignments: [...cls.assignments, newAssignment] }
        : cls
    ))
    setSelectedClass(prev => ({
      ...prev,
      assignments: [...prev.assignments, newAssignment],
    }))
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
      <p className="text-text-muted mb-8">
        Hallo, {user?.username || 'Lehrer'}! {'\u{1F469}\u200D\u{1F3EB}'}
      </p>

      {/* Schnell-Statistiken */}
      <QuickStats classes={classes} />

      {/* Hauptbereich: Sidebar + Detail */}
      <div className="flex flex-col md:flex-row gap-6">
        <ClassSidebar
          classes={classes}
          selectedClass={selectedClass}
          onSelect={setSelectedClass}
          onCreateNew={() => setShowCreateClassModal(true)}
        />

        {selectedClass && (
          <ClassDetail
            cls={selectedClass}
            onAssignGame={() => setShowAssignGameModal(true)}
          />
        )}
      </div>

      {/* Modals */}
      <CreateClassModal
        isOpen={showCreateClassModal}
        onClose={() => setShowCreateClassModal(false)}
        onCreate={handleCreateClass}
      />

      <AssignGameModal
        isOpen={showAssignGameModal}
        onClose={() => setShowAssignGameModal(false)}
        onAssign={handleAssignGame}
        className={selectedClass?.name}
      />
    </div>
  )
}
