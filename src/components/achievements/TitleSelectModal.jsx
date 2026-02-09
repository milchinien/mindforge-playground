import { ALL_ACHIEVEMENTS } from '../../data/achievementDefinitions'
import Modal from '../common/Modal'

export default function TitleSelectModal({ isOpen, onClose, unlockedAchievements, activeTitle, onSelect }) {
  const availableTitles = ALL_ACHIEVEMENTS
    .filter(a => unlockedAchievements.includes(a.id) && a.reward.type === 'title')
    .map(a => ({
      achievementId: a.id,
      achievementName: a.name,
      title: a.reward.value,
      icon: a.icon,
    }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Titel auswaehlen">
      <p className="text-text-muted text-sm mb-6">
        Waehle einen Titel der unter deinem Namen angezeigt wird.
      </p>

      {/* No title option */}
      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-hover cursor-pointer mb-2">
        <input
          type="radio"
          name="title"
          checked={!activeTitle}
          onChange={() => onSelect(null)}
          className="accent-accent"
        />
        <span className="text-text-secondary">Kein Titel</span>
      </label>

      {/* Available titles */}
      {availableTitles.map(({ achievementId, achievementName, title, icon }) => (
        <label
          key={achievementId}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-bg-hover cursor-pointer mb-2
            ${activeTitle === title ? 'bg-accent/10 border border-accent/30' : ''}`}
        >
          <input
            type="radio"
            name="title"
            checked={activeTitle === title}
            onChange={() => onSelect(title)}
            className="accent-accent"
          />
          <span className="text-lg">{icon}</span>
          <div>
            <p className="text-text-primary font-medium">"{title}"</p>
            <p className="text-xs text-text-muted">aus: {achievementName}</p>
          </div>
        </label>
      ))}

      {availableTitles.length === 0 && (
        <p className="text-text-muted text-center py-8">
          Du hast noch keine Titel freigeschaltet. Schliesse Achievements ab um Titel zu erhalten!
        </p>
      )}

      <button
        onClick={onClose}
        className="w-full mt-4 bg-bg-hover hover:bg-gray-600 text-text-primary py-2.5 rounded-lg
                   font-medium transition-colors cursor-pointer"
      >
        Schliessen
      </button>
    </Modal>
  )
}
