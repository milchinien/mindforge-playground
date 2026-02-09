import { useAuth } from '../contexts/AuthContext'
import { Check, X, Crown, GraduationCap } from 'lucide-react'

const PREMIUM_TIERS = [
  {
    id: 'free',
    name: 'Kostenlos',
    price: '0',
    period: '',
    icon: null,
    description: 'Grundlegende MindForge-Funktionen',
    features: [
      { text: 'Lernspiele spielen', included: true },
      { text: 'Profil erstellen', included: true },
      { text: 'Freunde hinzufuegen', included: true },
      { text: 'An Events teilnehmen', included: true },
      { text: 'Achievements sammeln', included: true },
      { text: 'Spiele hochladen', included: false },
      { text: 'Custom Avatar Items', included: false },
      { text: 'Marketplace verkaufen', included: false },
      { text: 'Klassenverwaltung', included: false },
    ],
    buttonText: 'Aktueller Plan',
    highlighted: false,
  },
  {
    id: 'creator',
    name: 'Creator Premium',
    price: '9,99',
    period: '/Monat',
    icon: Crown,
    description: 'Fuer Lernspiel-Ersteller und kreative Koepfe',
    features: [
      { text: 'Alles aus Kostenlos', included: true },
      { text: 'Lernspiele erstellen & hochladen', included: true },
      { text: 'Custom Avatar Items', included: true },
      { text: 'Fruehzeitiger Event-Zugang', included: true },
      { text: 'Creator-Badge am Profil', included: true },
      { text: '100 MindCoins/Monat Bonus', included: true },
      { text: 'Im Marketplace verkaufen', included: true },
      { text: 'Klassenverwaltung', included: false },
      { text: 'Schueler-Tracking', included: false },
    ],
    buttonText: 'Creator werden',
    highlighted: true,
  },
  {
    id: 'teacher',
    name: 'Teacher Premium',
    price: '14,99',
    period: '/Monat',
    icon: GraduationCap,
    description: 'Fuer Lehrer und Bildungseinrichtungen',
    features: [
      { text: 'Alles aus Creator Premium', included: true },
      { text: 'Klassen erstellen & verwalten', included: true },
      { text: 'Schueler-Fortschritt tracken', included: true },
      { text: 'Spiele als Aufgaben zuweisen', included: true },
      { text: 'Teacher-Badge am Profil', included: true },
      { text: '200 MindCoins/Monat Bonus', included: true },
      { text: 'Erweiterte Lern-Statistiken', included: true },
      { text: 'Prioritaets-Support', included: true },
    ],
    buttonText: 'Teacher werden',
    highlighted: false,
  },
]

function PricingCard({ tier, isCurrentTier }) {
  const Icon = tier.icon
  return (
    <div className={`bg-bg-card rounded-xl p-6 border flex flex-col relative
      ${tier.highlighted
        ? 'border-accent ring-2 ring-accent/20 md:scale-105'
        : 'border-gray-700'
      }`}>
      {tier.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
          EMPFOHLEN
        </span>
      )}

      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-5 h-5 text-accent" />}
        <h3 className="text-xl font-bold text-text-primary">{tier.name}</h3>
      </div>
      <div className="mt-2 mb-4">
        {tier.price !== '0' ? (
          <>
            <span className="text-3xl font-bold text-text-primary">{tier.price}&euro;</span>
            <span className="text-text-muted">{tier.period}</span>
          </>
        ) : (
          <span className="text-3xl font-bold text-text-primary">Gratis</span>
        )}
      </div>
      <p className="text-sm text-text-secondary mb-6">{tier.description}</p>

      <ul className="space-y-3 mb-8 flex-1">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            {feature.included ? (
              <Check className="w-4 h-4 text-success flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-text-muted flex-shrink-0" />
            )}
            <span className={feature.included ? 'text-text-primary' : 'text-text-muted'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
          isCurrentTier
            ? 'bg-bg-hover text-text-muted cursor-default'
            : tier.highlighted
              ? 'bg-accent hover:bg-accent-dark text-white'
              : tier.id === 'free'
                ? 'bg-bg-hover text-text-muted cursor-default'
                : 'bg-bg-hover hover:bg-bg-card text-text-primary border border-gray-600'
        }`}
        disabled={isCurrentTier || tier.id === 'free'}
      >
        {isCurrentTier ? 'Aktueller Plan' : tier.buttonText}
      </button>

      {tier.id !== 'free' && !isCurrentTier && (
        <p className="text-xs text-text-muted text-center mt-2">
          Payment kommt bald
        </p>
      )}
    </div>
  )
}

export default function Premium() {
  const { user } = useAuth()
  const currentTier = user?.premiumTier || 'free'

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Schalte das volle Potential von MindForge frei</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Werde Creator oder Teacher und erhalte Zugang zu exklusiven Features,
          monatlichen MindCoins und vielem mehr.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {PREMIUM_TIERS.map(tier => (
          <PricingCard
            key={tier.id}
            tier={tier}
            isCurrentTier={currentTier === tier.id}
          />
        ))}
      </div>

      <div className="mt-12 bg-bg-card rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-center">Haeufig gestellte Fragen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-text-primary mb-1">Kann ich jederzeit kuendigen?</h3>
            <p className="text-sm text-text-secondary">Ja, du kannst dein Abo jederzeit kuendigen. Du behaeltst Premium bis zum Ende der Laufzeit.</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-1">Was passiert mit meinen Spielen?</h3>
            <p className="text-sm text-text-secondary">Bereits hochgeladene Spiele bleiben veroeffentlicht, auch nach Kuendigung.</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-1">Kann ich upgraden?</h3>
            <p className="text-sm text-text-secondary">Ja, du kannst jederzeit von Creator auf Teacher upgraden. Du zahlst nur die Differenz.</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-1">Gibt es einen Studenten-Rabatt?</h3>
            <p className="text-sm text-text-secondary">Ja! Studenten und Schueler erhalten 50% Rabatt auf alle Premium-Plaene.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-warning/10 border border-warning/30 rounded-lg p-4 text-center">
        <p className="text-warning font-medium">
          Payment-Integration kommt bald!
        </p>
        <p className="text-sm text-text-muted mt-1">
          Im MVP wird kein echtes Geld verarbeitet. Stripe/PayPal wird in einer spaeteren Version integriert.
        </p>
      </div>
    </div>
  )
}
