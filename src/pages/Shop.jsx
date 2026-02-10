import { useAuth } from '../contexts/AuthContext'
import MindCoinIcon from '../components/common/MindCoinIcon'

const MINDCOIN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    amount: 500,
    bonus: 0,
    price: '4,99',
    pricePerEuro: '100 MC/\u20AC',
    badge: null,
    popular: false,
    bestDeal: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    amount: 1200,
    bonus: 200,
    price: '9,99',
    pricePerEuro: '120 MC/\u20AC',
    badge: 'BELIEBT',
    popular: true,
    bestDeal: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    amount: 2500,
    bonus: 500,
    price: '19,99',
    pricePerEuro: '125 MC/\u20AC',
    badge: 'BESTER DEAL',
    popular: false,
    bestDeal: true,
  },
]

function CoinPackageCard({ pkg, onPurchase }) {
  return (
    <div className={`bg-bg-card rounded-xl p-6 border relative
      ${pkg.popular ? 'border-accent ring-2 ring-accent/20' : ''}
      ${pkg.bestDeal ? 'border-warning ring-2 ring-warning/20' : ''}
      ${!pkg.popular && !pkg.bestDeal ? 'border-gray-700' : ''}`}>

      {pkg.badge && (
        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold
                          px-3 py-1 rounded-full whitespace-nowrap
          ${pkg.popular ? 'bg-accent text-white' : 'bg-warning text-black'}`}>
          {pkg.badge}
        </span>
      )}

      <h3 className="text-lg font-bold text-text-primary text-center mt-2">{pkg.name}</h3>

      <div className="text-center my-6">
        <MindCoinIcon size={100} className="mx-auto" />
        <p className="text-3xl font-bold text-accent mt-2">
          {pkg.amount.toLocaleString('de-DE')} MC
        </p>
        {pkg.bonus > 0 && (
          <p className="text-sm text-success font-medium mt-1">
            +{pkg.bonus} Bonus MindCoins!
          </p>
        )}
      </div>

      <p className="text-2xl font-bold text-text-primary text-center">
        {pkg.price}&euro;
      </p>
      <p className="text-xs text-text-muted text-center mt-1">
        {pkg.pricePerEuro}
      </p>

      <button
        onClick={() => onPurchase(pkg)}
        className="w-full mt-6 bg-accent hover:bg-accent-dark text-white py-3 rounded-lg
                   font-semibold transition-colors cursor-pointer"
      >
        Kaufen
      </button>
    </div>
  )
}

export default function Shop() {
  const { user } = useAuth()

  const handlePurchase = (pkg) => {
    alert(`Kauf-Funktion kommt bald!\n\nPaket: ${pkg.name}\nPreis: ${pkg.price}\u20AC\nMindCoins: ${pkg.amount + pkg.bonus} MC`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">MindCoins Shop</h1>
      <p className="text-text-secondary mb-8">Kaufe MindCoins fuer exklusive Items und Premium-Inhalte.</p>

      {/* Current balance */}
      <div className="bg-bg-card rounded-xl p-4 mb-8 inline-flex items-center gap-3 border border-gray-700">
        <MindCoinIcon size={56} />
        <div>
          <p className="text-sm text-text-muted">Dein Guthaben</p>
          <p className="text-2xl font-bold text-accent">{user?.mindCoins || 0} MindCoins</p>
        </div>
      </div>

      {/* Packages grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {MINDCOIN_PACKAGES.map(pkg => (
          <CoinPackageCard key={pkg.id} pkg={pkg} onPurchase={handlePurchase} />
        ))}
      </div>

      {/* What are MindCoins for? */}
      <section className="bg-bg-card rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Wofuer kannst du MindCoins verwenden?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#128142;</span>
            <div>
              <p className="font-medium text-text-primary">Premium Avatar Items</p>
              <p className="text-sm text-text-muted">Exklusive Anpassungen fuer deinen Avatar</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#127912;</span>
            <div>
              <p className="font-medium text-text-primary">Marketplace Assets</p>
              <p className="text-sm text-text-muted">3D-Modelle, Texturen, Audio und mehr</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#127918;</span>
            <div>
              <p className="font-medium text-text-primary">Premium-Spielinhalte</p>
              <p className="text-sm text-text-muted">Exklusive Inhalte und Features</p>
            </div>
          </div>
        </div>
      </section>

      {/* MVP notice */}
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
