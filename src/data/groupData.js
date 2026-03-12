// Groups system data (Lerngruppen, Clans, Klassen)
// Real data will come from the database. These arrays are initialized empty.

// --- Lerngruppen ---
export const mockLerngruppen = []

// --- Clans ---
export const mockClans = []

// --- Klassen ---
export const mockKlassen = []

// --- Clan War ---
export const mockClanWar = null

// --- Group invites ---
export const mockGroupInvites = []

// --- Helper: all public groups for discovery ---
export function getAllPublicGroups() {
  return [
    ...mockLerngruppen.filter(g => g.isPublic),
    ...mockClans.filter(c => c.isPublic),
  ]
}
