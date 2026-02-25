import { useState } from 'react'
import { Search, HelpCircle, Type, ImageIcon, Clock, Trophy, Palette, GitBranch, Repeat, ChevronDown, ChevronRight } from 'lucide-react'
import { BLOCK_CATEGORIES, BLOCK_TYPES } from '../../data/builderBlocks'

const ICON_MAP = {
  HelpCircle,
  Type,
  ImageIcon,
  Clock,
  Trophy,
  Palette,
  GitBranch,
  Repeat,
}

export default function BlockToolbox({ onAddBlock, blockCounts }) {
  const [search, setSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(
    () => new Set(BLOCK_CATEGORIES.map(c => c.id))
  )

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const filteredTypes = Object.values(BLOCK_TYPES).filter(bt => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      bt.label.toLowerCase().includes(q) ||
      bt.description.toLowerCase().includes(q) ||
      bt.category.toLowerCase().includes(q)
    )
  })

  const getBlocksByCategory = (categoryId) => {
    return filteredTypes.filter(bt => bt.category === categoryId)
  }

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('application/x-builder-block', blockType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="w-64 flex-shrink-0 bg-bg-card border-r border-gray-700/50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-700/50 flex-shrink-0">
        <h3 className="text-sm font-bold text-text-primary mb-2">Baustein-Toolbox</h3>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bloecke suchen..."
            className="w-full bg-bg-secondary border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        {/* Block count */}
        <div className="mt-2 text-xs text-text-muted">
          {blockCounts} {blockCounts === 1 ? 'Block' : 'Bloecke'} im Workspace
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {BLOCK_CATEGORIES.map(category => {
          const categoryBlocks = getBlocksByCategory(category.id)
          if (categoryBlocks.length === 0 && search) return null
          const isExpanded = expandedCategories.has(category.id)

          return (
            <div key={category.id}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer group"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-text-muted" />
                ) : (
                  <ChevronRight size={14} className="text-text-muted" />
                )}
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                  {category.label}
                </span>
                <span className="ml-auto text-[10px] text-text-muted bg-bg-secondary px-1.5 py-0.5 rounded">
                  {categoryBlocks.length}
                </span>
              </button>

              {/* Block items */}
              {isExpanded && (
                <div className="ml-2 mt-1 space-y-1">
                  {categoryBlocks.map(blockDef => {
                    const Icon = ICON_MAP[blockDef.icon] || HelpCircle
                    return (
                      <div
                        key={blockDef.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, blockDef.type)}
                        onClick={() => onAddBlock(blockDef.type)}
                        className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg bg-bg-secondary hover:bg-bg-hover border border-transparent hover:border-gray-600 transition-all cursor-grab active:cursor-grabbing group"
                        title={blockDef.description}
                      >
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${category.color}22`, color: category.color }}
                        >
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-text-primary leading-tight">{blockDef.label}</p>
                          <p className="text-[10px] text-text-muted leading-tight mt-0.5 line-clamp-2">{blockDef.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {search && filteredTypes.length === 0 && (
          <div className="text-center py-6 text-text-muted text-xs">
            Keine Bloecke gefunden
          </div>
        )}
      </div>
    </div>
  )
}
