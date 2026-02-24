import { useTranslation } from 'react-i18next'
import { Layers, Code, FileArchive } from 'lucide-react'

export default function ModeSelector({ onSelect }) {
  const { t } = useTranslation()

  const modes = [
    {
      id: 'template',
      icon: Layers,
      title: t('create.modes.template.title'),
      subtitle: t('create.modes.template.subtitle'),
      description: t('create.modes.template.description'),
      features: t('create.modes.template.features', { returnObjects: true }),
      color: 'from-orange-500 to-amber-600',
      recommended: true,
    },
    {
      id: 'freeform',
      icon: Code,
      title: t('create.modes.freeform.title'),
      subtitle: t('create.modes.freeform.subtitle'),
      description: t('create.modes.freeform.description'),
      features: t('create.modes.freeform.features', { returnObjects: true }),
      color: 'from-purple-500 to-violet-600',
    },
    {
      id: 'zip',
      icon: FileArchive,
      title: t('create.modes.zip.title'),
      subtitle: t('create.modes.zip.subtitle'),
      description: t('create.modes.zip.description'),
      features: t('create.modes.zip.features', { returnObjects: true }),
      color: 'from-cyan-500 to-blue-600',
    },
  ]

  return (
    <div className="py-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">{t('create.modes.title')}</h1>
        <p className="text-text-secondary">{t('create.modes.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => {
          const Icon = mode.icon
          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className="bg-bg-card rounded-xl p-6 text-left hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-accent/30 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-text-primary">{mode.title}</h2>
                {mode.recommended && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">{t('create.modes.template.recommended')}</span>
                )}
              </div>
              <p className="text-text-muted text-xs mb-3">{mode.subtitle}</p>
              <p className="text-text-secondary text-sm mb-4">{mode.description}</p>

              <ul className="space-y-1.5">
                {(Array.isArray(mode.features) ? mode.features : []).map((f, i) => (
                  <li key={i} className="text-text-secondary text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
    </div>
  )
}
