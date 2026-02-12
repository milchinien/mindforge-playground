import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import MindCoinIcon from '../components/common/MindCoinIcon'
import useEscapeKey from '../hooks/useEscapeKey'

const MINDCOIN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    amount: 500,
    bonus: 0,
    price: '4,99',
    priceNum: 4.99,
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
    priceNum: 9.99,
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
    priceNum: 19.99,
    pricePerEuro: '125 MC/\u20AC',
    badge: 'BESTER DEAL',
    popular: false,
    bestDeal: true,
  },
]

const VALID_CODES = {
  'MindForge': { discount: 1.0, label: '100% Rabatt' },
}

function PurchaseModal({ pkg, onClose, onConfirm }) {
  const [discountCode, setDiscountCode] = useState('')
  const [appliedCode, setAppliedCode] = useState(null)
  const [codeError, setCodeError] = useState(null)
  const [purchased, setPurchased] = useState(false)
  useEscapeKey(onClose)

  const totalCoins = pkg.amount + pkg.bonus
  const discount = appliedCode ? VALID_CODES[appliedCode].discount : 0
  const finalPrice = pkg.priceNum * (1 - discount)
  const isFree = finalPrice === 0

  const handleApplyCode = () => {
    const trimmed = discountCode.trim()
    if (VALID_CODES[trimmed]) {
      setAppliedCode(trimmed)
      setCodeError(null)
    } else {
      setCodeError('Ungueltiger Rabattcode')
      setAppliedCode(null)
    }
  }

  const handlePurchase = () => {
    onConfirm(totalCoins)
    setPurchased(true)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         role="dialog" aria-modal="true" aria-label="MindCoins kaufen"
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full overflow-hidden"
           onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">MindCoins kaufen</h2>
            <button onClick={onClose} aria-label="Schliessen"
                    className="text-text-muted hover:text-text-primary text-xl">
              {'\u2715'}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {purchased ? (
            <div className="text-center py-6">
              <MindCoinIcon size={80} className="mx-auto" />
              <h3 className="text-2xl font-bold text-success mt-4">Erfolgreich!</h3>
              <p className="text-text-secondary mt-2">
                {totalCoins.toLocaleString('de-DE')} MindCoins wurden gutgeschrieben.
              </p>
              <button onClick={onClose}
                      className="mt-6 bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                Schliessen
              </button>
            </div>
          ) : (
            <>
              {/* Paket-Zusammenfassung */}
              <div className="bg-bg-card rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <MindCoinIcon size={56} />
                  <div>
                    <p className="font-bold text-text-primary text-lg">{pkg.name}-Paket</p>
                    <p className="text-accent font-semibold">
                      {totalCoins.toLocaleString('de-DE')} MindCoins
                    </p>
                    {pkg.bonus > 0 && (
                      <p className="text-sm text-success">+{pkg.bonus} Bonus inkludiert</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Zahlungsmethode */}
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Zahlungsmethode</h3>
                <div className="bg-bg-card rounded-lg p-4 text-center border border-gray-700">
                  <p className="text-text-muted text-sm">
                    Kommt bald: Kreditkarte, PayPal
                  </p>
                </div>
              </div>

              {/* Rabattcode */}
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Rabattcode</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => { setDiscountCode(e.target.value); setCodeError(null) }}
                    placeholder="Code eingeben..."
                    className="flex-1 bg-bg-card border border-gray-700 rounded-lg px-4 py-2 text-text-primary text-sm
                               focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={handleApplyCode}
                    className="bg-bg-hover hover:bg-gray-500 text-text-primary px-4 py-2 rounded-lg text-sm
                               font-medium transition-colors cursor-pointer"
                  >
                    Einloesen
                  </button>
                </div>
                {codeError && (
                  <p className="text-error text-xs mt-1">{codeError}</p>
                )}
                {appliedCode && (
                  <p className="text-success text-xs mt-1">
                    {VALID_CODES[appliedCode].label} angewendet!
                  </p>
                )}
              </div>

              {/* Preis-Zusammenfassung */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Paketpreis</span>
                  <span>{pkg.price}&euro;</span>
                </div>
                {appliedCode && (
                  <div className="flex justify-between text-sm text-success mt-1">
                    <span>Rabatt ({VALID_CODES[appliedCode].label})</span>
                    <span>-{(pkg.priceNum * discount).toFixed(2).replace('.', ',')}&euro;</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-text-primary mt-2 text-lg">
                  <span>Gesamt</span>
                  <span>{isFree ? 'Kostenlos' : `${finalPrice.toFixed(2).replace('.', ',')}\u20AC`}</span>
                </div>
              </div>

              {/* Kaufen-Button */}
              <button
                onClick={handlePurchase}
                disabled={!isFree}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isFree
                    ? 'bg-success hover:bg-green-600 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isFree ? 'Kostenlos bestellen' : 'Zahlungsmethode erforderlich'}
              </button>

              {!isFree && (
                <p className="text-xs text-text-muted text-center">
                  Gib den Rabattcode "MindForge" ein, um kostenlos zu testen.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

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
  const { user, updateUser } = useAuth()
  const [selectedPkg, setSelectedPkg] = useState(null)

  const handleConfirmPurchase = async (coins) => {
    await updateUser({
      mindCoins: (user?.mindCoins || 0) + coins,
    })
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
          <p className="text-2xl font-bold text-accent">{(user?.mindCoins || 0).toLocaleString('de-DE')} MindCoins</p>
        </div>
      </div>

      {/* Packages grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {MINDCOIN_PACKAGES.map(pkg => (
          <CoinPackageCard key={pkg.id} pkg={pkg} onPurchase={setSelectedPkg} />
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

      {/* Purchase Modal */}
      {selectedPkg && (
        <PurchaseModal
          pkg={selectedPkg}
          onClose={() => setSelectedPkg(null)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </div>
  )
}
