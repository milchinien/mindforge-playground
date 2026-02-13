import { ALL_ACHIEVEMENTS } from '../../data/achievementDefinitions'
import Modal from '../common/Modal'

export default function TitleSelectModal({ isOpen, onClose, unlockedAchievements, activeTitle, onSelect, shopTitles = [] }) {
  const achievementTitles = ALL_ACHIEVEMENTS
    .filter(a => a.reward.type === 'title')
    .map(a => ({
      id: a.id,
      source: a.name,
      title: a.reward.value,
      icon: a.icon,
      type: 'achievement',
    }))

  const formattedShopTitles = shopTitles.map(t => ({
    id: `shop-${t.title}`,
    source: t.source,
    title: t.title,
    icon: t.icon,
    type: 'shop',
  }))

  const allTitles = [...achievementTitles, ...formattedShopTitles]

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
      {allTitles.map(({ id, source, title, icon, type }) => (
        <label
          key={id}
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
            <p className="text-xs text-text-muted">
              {type === 'shop' ? `Shop: ${source}` : `aus: ${source}`}
            </p>
          </div>
        </label>
      ))}

      {allTitles.length === 0 && (
        <p className="text-text-muted text-center py-8">
          Du hast noch keine Titel freigeschaltet. Schliesse Achievements ab oder kaufe Saisonpakete im Shop!
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
