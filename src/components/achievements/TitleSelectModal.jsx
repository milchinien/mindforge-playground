import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useInventoryStore, selectItems } from '../../stores/inventoryStore'
import Modal from '../common/Modal'

export default function TitleSelectModal({ isOpen, onClose, activeTitle, onSelect }) {
  const { t } = useTranslation()
  const items = useInventoryStore(selectItems)
  const titleItems = useMemo(() => items.filter((i) => i.type === 'title'), [items])

  const allTitles = titleItems.map((item) => ({
    id: item.id,
    source: item.description || item.source,
    title: item.name,
    icon: item.source === 'achievement' ? '\uD83C\uDFC6' : item.source === 'shop' ? '\uD83D\uDED2' : '\u2B50',
    type: item.source,
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('achievements.selectTitle')}>
      <p className="text-text-muted text-sm mb-6">
        {t('achievements.selectTitleDesc')}
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
        <span className="text-text-secondary">{t('achievements.noTitleOption')}</span>
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
              {type === 'shop' ? t('achievements.shopSource', { source }) : t('achievements.fromAchievement', { source })}
            </p>
          </div>
        </label>
      ))}

      {allTitles.length === 0 && (
        <p className="text-text-muted text-center py-8">
          {t('achievements.noTitlesUnlocked')}
        </p>
      )}

      <button
        onClick={onClose}
        className="w-full mt-4 bg-bg-hover hover:bg-gray-600 text-text-primary py-2.5 rounded-lg
                   font-medium transition-colors cursor-pointer"
      >
        {t('common.close')}
      </button>
    </Modal>
  )
}
