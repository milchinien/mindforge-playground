import { memo } from 'react'
import { ASSET_TYPES } from '../../data/mockAssets'
import MindCoinIcon from '../common/MindCoinIcon'

const TYPE_ICONS = {
  '3d-model': '\u{1F9CA}',
  'texture': '\u{1F3A8}',
  'audio': '\u{1F3B5}',
  'script': '\u{1F4DC}',
  'avatar-item': '\u{1F464}',
}

export default memo(function AssetCard({ asset, onClick, purchased }) {
  const isFree = asset.price === 0

  return (
    <div
      onClick={() => onClick?.(asset)}
      className="bg-bg-card rounded-xl overflow-hidden border border-gray-700
                 hover:border-gray-600 transition-all cursor-pointer group"
    >
      {/* Preview Image / Placeholder */}
      <div className="aspect-video bg-bg-hover flex items-center justify-center
                      text-5xl group-hover:scale-105 transition-transform overflow-hidden">
        {asset.previewImage ? (
          <img src={asset.previewImage} alt={asset.name} className="w-full h-full object-cover" />
        ) : (
          <span className="opacity-50">{asset.avatarIcon || TYPE_ICONS[asset.type] || '\u{1F4E6}'}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Typ Badge */}
        <span className="text-xs bg-bg-hover text-text-muted px-2 py-0.5 rounded-full">
          {TYPE_ICONS[asset.type]} {ASSET_TYPES.find(t => t.id === asset.type)?.name || asset.type}
        </span>

        {/* Name */}
        <h3 className="font-semibold text-text-primary mt-2 truncate">{asset.name}</h3>

        {/* Creator */}
        <p className="text-sm text-text-muted mt-1">
          von: <span className="text-text-secondary">{asset.creator.username}</span>
        </p>

        {/* Rating & Downloads */}
        <div className="flex items-center gap-3 mt-2 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            <span className="text-warning">{'\u2605'}</span>
            {asset.rating.toFixed(1)}
            <span className="text-xs">({asset.ratingCount})</span>
          </span>
          <span className="flex items-center gap-1">
            {'\u{1F4E5}'} {asset.downloads}
          </span>
        </div>

        {/* Preis */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          {purchased ? (
            <span className="text-success font-semibold">Gekauft</span>
          ) : isFree ? (
            <span className="text-success font-semibold">Kostenlos</span>
          ) : (
            <span className="flex items-center gap-1 font-semibold text-accent">
              <MindCoinIcon size={18} /> {asset.price} MC
            </span>
          )}
        </div>
      </div>
    </div>
  )
})
