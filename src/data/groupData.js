// Mock data for Groups system (Lerngruppen, Clans, Klassen)

// --- Lerngruppen ---
export const mockLerngruppen = [
  {
    id: 'lg-mathe-genies',
    type: 'lerngruppe',
    name: 'Mathe-Genies',
    description: 'Gemeinsam knacken wir jede Gleichung! Wir helfen uns gegenseitig bei Algebra, Analysis und Geometrie.',
    subject: 'mathematik',
    memberCount: 20,
    maxMembers: 30,
    isPublic: true,
    createdAt: new Date('2025-09-15'),
    members: [
      { id: 'user-100', username: 'PixelMaster', displayName: 'PixelMaster', level: 47, role: 'leader' },
      { id: 'user-106', username: 'MathGenius', displayName: 'MathGenius', level: 30, role: 'moderator' },
      { id: 'user-101', username: 'BrainStorm99', displayName: 'BrainStorm99', level: 43, role: 'member' },
      { id: 'user-103', username: 'LernFuchs', displayName: 'LernFuchs', level: 37, role: 'member' },
      { id: 'user-109', username: 'GeoExpert', displayName: 'GeoExpert', level: 24, role: 'member' },
    ],
    leaderboard: [
      { userId: 'user-100', username: 'PixelMaster', xp: 4800 },
      { userId: 'user-106', username: 'MathGenius', xp: 4200 },
      { userId: 'user-101', username: 'BrainStorm99', xp: 3600 },
      { userId: 'user-103', username: 'LernFuchs', xp: 2900 },
      { userId: 'user-109', username: 'GeoExpert', xp: 2100 },
    ],
    activeChallenges: [
      { id: 'ch-1', title: '100 Gleichungen in einer Woche', target: 100, current: 67, endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { id: 'ch-2', title: 'Geometrie-Meister', target: 50, current: 32, endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: 'lg-physik-labor',
    type: 'lerngruppe',
    name: 'Physik-Labor',
    description: 'Das virtuelle Labor fuer alle Physik-Begeisterten. Von Mechanik bis Quantenphysik.',
    subject: 'physik',
    memberCount: 15,
    maxMembers: 25,
    isPublic: true,
    createdAt: new Date('2025-10-02'),
    members: [
      { id: 'user-110', username: 'PhysikFan', displayName: 'PhysikFan', level: 22, role: 'leader' },
      { id: 'user-107', username: 'ScienceGirl', displayName: 'ScienceGirl', level: 28, role: 'moderator' },
      { id: 'user-102', username: 'QuizKoenig', displayName: 'QuizKoenig', level: 40, role: 'member' },
      { id: 'user-104', username: 'WissenHeld', displayName: 'WissenHeld', level: 34, role: 'member' },
      { id: 'user-108', username: 'HistoryPro', displayName: 'HistoryPro', level: 26, role: 'member' },
    ],
    leaderboard: [
      { userId: 'user-102', username: 'QuizKoenig', xp: 3900 },
      { userId: 'user-107', username: 'ScienceGirl', xp: 3100 },
      { userId: 'user-110', username: 'PhysikFan', xp: 2800 },
      { userId: 'user-104', username: 'WissenHeld', xp: 2400 },
      { userId: 'user-108', username: 'HistoryPro', xp: 1700 },
    ],
    activeChallenges: [
      { id: 'ch-3', title: 'Newton-Challenge', target: 30, current: 18, endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: 'lg-sprach-club',
    type: 'lerngruppe',
    name: 'Sprach-Club',
    description: 'Sprachen lernen macht zusammen mehr Spass! Deutsch, Englisch und mehr.',
    subject: 'deutsch',
    memberCount: 25,
    maxMembers: 40,
    isPublic: true,
    createdAt: new Date('2025-08-20'),
    members: [
      { id: 'user-112', username: 'SprachProfi', displayName: 'SprachProfi', level: 18, role: 'leader' },
      { id: 'user-105', username: 'CodeNinja42', displayName: 'CodeNinja42', level: 32, role: 'moderator' },
      { id: 'user-113', username: 'KunstFan', displayName: 'KunstFan', level: 16, role: 'member' },
      { id: 'user-114', username: 'MusikStar', displayName: 'MusikStar', level: 14, role: 'member' },
      { id: 'user-111', username: 'BioNerd', displayName: 'BioNerd', level: 20, role: 'member' },
    ],
    leaderboard: [
      { userId: 'user-112', username: 'SprachProfi', xp: 5100 },
      { userId: 'user-105', username: 'CodeNinja42', xp: 4300 },
      { userId: 'user-113', username: 'KunstFan', xp: 3200 },
      { userId: 'user-114', username: 'MusikStar', xp: 2600 },
      { userId: 'user-111', username: 'BioNerd', xp: 1900 },
    ],
    activeChallenges: [
      { id: 'ch-4', title: 'Vokabel-Marathon', target: 200, current: 145, endsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) },
      { id: 'ch-5', title: 'Grammatik-Guru', target: 80, current: 52, endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    ],
  },
]

// --- Clans ---
export const mockClans = [
  {
    id: 'clan-wissenskrieger',
    type: 'clan',
    name: 'Die Wissenskrieger',
    description: 'Elite-Clan fuer echte Wissenskaempfer. Wir dominieren jede Clan-War-Saison!',
    memberCount: 50,
    maxMembers: 60,
    isPublic: true,
    clanLevel: 12,
    clanXP: 84500,
    clanXPNext: 100000,
    emblemColor: 'from-red-500 to-orange-500',
    emblemBg: 'bg-red-500/10',
    createdAt: new Date('2025-06-10'),
    warStats: { wins: 28, losses: 7, draws: 3 },
    members: [
      { id: 'user-100', username: 'PixelMaster', displayName: 'PixelMaster', level: 47, role: 'leader' },
      { id: 'user-101', username: 'BrainStorm99', displayName: 'BrainStorm99', level: 43, role: 'officer' },
      { id: 'user-102', username: 'QuizKoenig', displayName: 'QuizKoenig', level: 40, role: 'officer' },
      { id: 'user-103', username: 'LernFuchs', displayName: 'LernFuchs', level: 37, role: 'member' },
      { id: 'user-104', username: 'WissenHeld', displayName: 'WissenHeld', level: 34, role: 'member' },
    ],
  },
  {
    id: 'clan-brainstorm',
    type: 'clan',
    name: 'Brain Storm',
    description: 'Kreativitaet trifft Wissen. Wir denken anders und gewinnen anders!',
    memberCount: 35,
    maxMembers: 50,
    isPublic: true,
    clanLevel: 8,
    clanXP: 42000,
    clanXPNext: 60000,
    emblemColor: 'from-blue-500 to-cyan-500',
    emblemBg: 'bg-blue-500/10',
    createdAt: new Date('2025-07-22'),
    warStats: { wins: 15, losses: 10, draws: 2 },
    members: [
      { id: 'user-107', username: 'ScienceGirl', displayName: 'ScienceGirl', level: 28, role: 'leader' },
      { id: 'user-105', username: 'CodeNinja42', displayName: 'CodeNinja42', level: 32, role: 'officer' },
      { id: 'user-110', username: 'PhysikFan', displayName: 'PhysikFan', level: 22, role: 'member' },
      { id: 'user-111', username: 'BioNerd', displayName: 'BioNerd', level: 20, role: 'member' },
      { id: 'user-108', username: 'HistoryPro', displayName: 'HistoryPro', level: 26, role: 'member' },
    ],
  },
  {
    id: 'clan-quizmasters',
    type: 'clan',
    name: 'Quiz Masters',
    description: 'Die unangefochtenen Quiz-Champions! Wir leben fuer den Wettbewerb.',
    memberCount: 45,
    maxMembers: 55,
    isPublic: true,
    clanLevel: 15,
    clanXP: 115000,
    clanXPNext: 130000,
    emblemColor: 'from-purple-500 to-pink-500',
    emblemBg: 'bg-purple-500/10',
    createdAt: new Date('2025-05-03'),
    warStats: { wins: 42, losses: 5, draws: 1 },
    members: [
      { id: 'user-106', username: 'MathGenius', displayName: 'MathGenius', level: 30, role: 'leader' },
      { id: 'user-109', username: 'GeoExpert', displayName: 'GeoExpert', level: 24, role: 'officer' },
      { id: 'user-112', username: 'SprachProfi', displayName: 'SprachProfi', level: 18, role: 'officer' },
      { id: 'user-113', username: 'KunstFan', displayName: 'KunstFan', level: 16, role: 'member' },
      { id: 'user-114', username: 'MusikStar', displayName: 'MusikStar', level: 14, role: 'member' },
    ],
  },
]

// --- Klassen ---
export const mockKlassen = [
  {
    id: 'klasse-10a-mueller',
    type: 'klasse',
    name: 'Klasse 10a - Herr Mueller',
    description: 'Mathematik und Naturwissenschaften fuer die 10. Klasse. Alle Aufgaben und Materialien hier.',
    teacherName: 'Herr Mueller',
    subject: 'mathematik',
    studentCount: 28,
    isPublic: false,
    createdAt: new Date('2025-09-01'),
    students: [
      { id: 'user-201', username: 'Schueler01', displayName: 'Anna M.', progress: 85 },
      { id: 'user-202', username: 'Schueler02', displayName: 'Ben K.', progress: 72 },
      { id: 'user-203', username: 'Schueler03', displayName: 'Clara S.', progress: 91 },
      { id: 'user-204', username: 'Schueler04', displayName: 'David L.', progress: 68 },
      { id: 'user-205', username: 'Schueler05', displayName: 'Eva W.', progress: 78 },
    ],
    assignments: [
      { id: 'assign-1', title: 'Quadratische Funktionen', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), completedCount: 18, totalCount: 28, gameId: 'game-mathe-1' },
      { id: 'assign-2', title: 'Wahrscheinlichkeitsrechnung', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), completedCount: 8, totalCount: 28, gameId: 'game-mathe-2' },
      { id: 'assign-3', title: 'Trigonometrie Basics', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completedCount: 25, totalCount: 28, gameId: 'game-mathe-3' },
    ],
    averageProgress: 79,
  },
  {
    id: 'klasse-info-lk',
    type: 'klasse',
    name: 'Informatik LK',
    description: 'Leistungskurs Informatik - Algorithmen, Datenstrukturen und Softwareentwicklung.',
    teacherName: 'Frau Schmidt',
    subject: 'informatik',
    studentCount: 16,
    isPublic: false,
    createdAt: new Date('2025-09-01'),
    students: [
      { id: 'user-301', username: 'CodeKid01', displayName: 'Felix R.', progress: 95 },
      { id: 'user-302', username: 'CodeKid02', displayName: 'Greta H.', progress: 88 },
      { id: 'user-303', username: 'CodeKid03', displayName: 'Hanna P.', progress: 82 },
      { id: 'user-304', username: 'CodeKid04', displayName: 'Igor T.', progress: 76 },
      { id: 'user-305', username: 'CodeKid05', displayName: 'Jana B.', progress: 91 },
    ],
    assignments: [
      { id: 'assign-4', title: 'Sortieralgorithmen', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), completedCount: 10, totalCount: 16, gameId: 'game-info-1' },
      { id: 'assign-5', title: 'Baeume und Graphen', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), completedCount: 3, totalCount: 16, gameId: 'game-info-2' },
    ],
    averageProgress: 86,
  },
]

// --- Clan War ---
export const mockClanWar = {
  id: 'war-001',
  status: 'active', // 'preparing' | 'active' | 'completed'
  startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  endsAt: new Date(Date.now() + 36 * 60 * 60 * 1000),
  clanA: {
    id: 'clan-wissenskrieger',
    name: 'Die Wissenskrieger',
    emblemColor: 'from-red-500 to-orange-500',
    score: 1450,
    members: 50,
    clanLevel: 12,
  },
  clanB: {
    id: 'clan-quizmasters',
    name: 'Quiz Masters',
    emblemColor: 'from-purple-500 to-pink-500',
    score: 1320,
    members: 45,
    clanLevel: 15,
  },
  matchups: [
    { id: 'm-1', playerA: 'PixelMaster', playerB: 'MathGenius', scoreA: 320, scoreB: 290, status: 'completed' },
    { id: 'm-2', playerA: 'BrainStorm99', playerB: 'GeoExpert', scoreA: 280, scoreB: 310, status: 'completed' },
    { id: 'm-3', playerA: 'QuizKoenig', playerB: 'SprachProfi', scoreA: 0, scoreB: 0, status: 'pending' },
    { id: 'm-4', playerA: 'LernFuchs', playerB: 'KunstFan', scoreA: 350, scoreB: 270, status: 'completed' },
    { id: 'm-5', playerA: 'WissenHeld', playerB: 'MusikStar', scoreA: 0, scoreB: 0, status: 'active' },
  ],
}

// --- Group invites ---
export const mockGroupInvites = [
  {
    id: 'inv-1',
    groupId: 'clan-brainstorm',
    groupName: 'Brain Storm',
    groupType: 'clan',
    invitedBy: 'ScienceGirl',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'inv-2',
    groupId: 'lg-physik-labor',
    groupName: 'Physik-Labor',
    groupType: 'lerngruppe',
    invitedBy: 'PhysikFan',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]

// --- Helper: all public groups for discovery ---
export function getAllPublicGroups() {
  return [
    ...mockLerngruppen.filter(g => g.isPublic),
    ...mockClans.filter(c => c.isPublic),
  ]
}
