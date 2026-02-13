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

const EXTRA_PACKAGES = [
  {
    id: 'mega',
    name: 'Mega',
    amount: 3500,
    bonus: 750,
    price: '34,99',
    priceNum: 34.99,
    pricePerEuro: '121 MC/\u20AC',
    badge: 'MEGA',
    popular: false,
    bestDeal: false,
    mega: true,
  },
  {
    id: 'ultra',
    name: 'Ultra',
    amount: 5000,
    bonus: 1500,
    price: '49,99',
    priceNum: 49.99,
    pricePerEuro: '130 MC/\u20AC',
    badge: 'ULTRA',
    popular: false,
    bestDeal: false,
    ultra: true,
  },
  {
    id: 'diamant',
    name: 'Diamant',
    amount: 10000,
    bonus: 4000,
    price: '99,99',
    priceNum: 99.99,
    pricePerEuro: '140 MC/\u20AC',
    badge: 'LEGENDAER',
    popular: false,
    bestDeal: true,
    legendary: true,
  },
]

const VALID_CODES = {
  'MindForge': { discount: 1.0, label: '100% Rabatt', type: 'multi', maxUses: Infinity },
  'WELCOME10': { discount: 0.1, label: '10% Rabatt', type: 'once', maxUses: 1 },
  'EVENT2025': { discount: 0.5, label: '50% Rabatt', type: 'once', maxUses: 1 },
  'WINTER25': { discount: 0.25, label: '25% Rabatt', type: 'once', maxUses: 1, expiresAt: '2025-03-31' },
}

const SEASONAL_OFFERS = [
  {
    id: 'winter-pack',
    name: 'Winter-Paket',
    emoji: '\u2744\uFE0F',
    description: '800 MindCoins + Exklusiver Schnee-Hintergrund + Titel',
    amount: 800,
    bonus: 200,
    price: '5,99',
    priceNum: 5.99,
    availableUntil: '2026-03-31T23:59:59',
    badge: 'LIMITIERT',
    oneTimePurchase: true,
    rewardTitle: 'Schneekoenig',
    rewardTitleIcon: '\u2744\uFE0F',
  },
  {
    id: 'valentines-pack',
    name: 'Valentins-Paket',
    emoji: '\u2764\uFE0F',
    description: '1500 MindCoins + Herz-Rahmen + Titel',
    amount: 1500,
    bonus: 300,
    price: '9,99',
    priceNum: 9.99,
    availableUntil: '2026-02-28T23:59:59',
    badge: 'EVENT',
    oneTimePurchase: true,
    rewardTitle: 'Amors Liebling',
    rewardTitleIcon: '\u2764\uFE0F',
  },
]

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(targetDate) - new Date()
    return Math.max(0, diff)
  })

  useState(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate) - new Date()
      setTimeLeft(Math.max(0, diff))
    }, 60000)
    return () => clearInterval(interval)
  })

  if (timeLeft <= 0) return <span className="text-error text-xs">Abgelaufen</span>

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return (
    <span className="text-warning text-xs font-medium">
      Noch {days}T {hours}h
    </span>
  )
}

function PurchaseModal({ pkg, onClose, onConfirm, userBalance, usedCodes }) {
  const [discountCode, setDiscountCode] = useState('')
  const [appliedCode, setAppliedCode] = useState(null)
  const [codeError, setCodeError] = useState(null)
  const [purchased, setPurchased] = useState(false)
  const [newBalance, setNewBalance] = useState(null)
  useEscapeKey(onClose)

  const totalCoins = pkg.amount + (pkg.bonus || 0)
  const discount = appliedCode ? VALID_CODES[appliedCode].discount : 0
  const finalPrice = pkg.priceNum * (1 - discount)
  const isFree = finalPrice === 0

  const handleApplyCode = () => {
    const trimmed = discountCode.trim()
    const codeConfig = VALID_CODES[trimmed]

    if (!codeConfig) {
      setCodeError('Ungueltiger Rabattcode')
      setAppliedCode(null)
      return
    }

    if (codeConfig.expiresAt && new Date(codeConfig.expiresAt) < new Date()) {
      setCodeError('Dieser Code ist abgelaufen')
      setAppliedCode(null)
      return
    }

    if (codeConfig.type === 'once' && usedCodes?.includes(trimmed)) {
      setCodeError('Dieser Code wurde bereits verwendet')
      setAppliedCode(null)
      return
    }

    setAppliedCode(trimmed)
    setCodeError(null)
  }

  const handlePurchase = () => {
    setNewBalance((userBalance || 0) + totalCoins)
    onConfirm(totalCoins, appliedCode)
    setPurchased(true)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         role="dialog" aria-modal="true" aria-label="MindCoins kaufen"
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full overflow-hidden"
           onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">MindCoins kaufen</h2>
            <button onClick={onClose} aria-label="Schliessen"
                    className="text-text-muted hover:text-text-primary text-xl cursor-pointer">
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
              <p className="text-sm text-accent mt-1">
                Neues Guthaben: {(newBalance || 0).toLocaleString('de-DE')} MC
              </p>
              {pkg.rewardTitle && (
                <div className="mt-3 bg-warning/10 border border-warning/30 rounded-lg px-4 py-2 inline-block">
                  <p className="text-warning text-sm font-semibold">
                    {pkg.rewardTitleIcon} Titel freigeschaltet: "{pkg.rewardTitle}"
                  </p>
                </div>
              )}
              <button onClick={onClose}
                      className="mt-6 bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                Schliessen
              </button>
            </div>
          ) : (
            <>
              <div className="bg-bg-card rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <MindCoinIcon size={56} />
                  <div>
                    <p className="font-bold text-text-primary text-lg">{pkg.name}-Paket</p>
                    <p className="text-accent font-semibold">
                      {totalCoins.toLocaleString('de-DE')} MindCoins
                    </p>
                    {(pkg.bonus || 0) > 0 && (
                      <p className="text-sm text-success">+{pkg.bonus} Bonus inkludiert</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">Zahlungsmethode</h3>
                <div className="bg-bg-card rounded-lg p-4 text-center border border-gray-700">
                  <p className="text-text-muted text-sm">
                    Kommt bald: Kreditkarte, PayPal
                  </p>
                </div>
              </div>

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
                <p className="text-xs text-text-muted mt-2">
                  Verfuegbare Codes: WELCOME10 (10%), EVENT2025 (50%), MindForge (100%)
                </p>
              </div>

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
  const isExtra = pkg.mega || pkg.ultra || pkg.legendary

  const getBorderClass = () => {
    if (pkg.legendary) return 'border-amber-400 ring-2 ring-amber-400/20'
    if (pkg.ultra) return 'border-purple-500 ring-2 ring-purple-500/20'
    if (pkg.mega) return 'border-blue-500 ring-2 ring-blue-500/20'
    if (pkg.popular) return 'border-accent ring-2 ring-accent/20'
    if (pkg.bestDeal) return 'border-warning ring-2 ring-warning/20'
    return 'border-gray-700'
  }

  const getBadgeClass = () => {
    if (pkg.legendary) return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black'
    if (pkg.ultra) return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    if (pkg.mega) return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
    if (pkg.popular) return 'bg-accent text-white'
    return 'bg-warning text-black'
  }

  return (
    <div className={`bg-bg-card rounded-xl p-6 border relative ${getBorderClass()}`}>

      {pkg.badge && (
        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold
                          px-3 py-1 rounded-full whitespace-nowrap ${getBadgeClass()}`}>
          {pkg.badge}
        </span>
      )}

      <h3 className="text-lg font-bold text-text-primary text-center mt-2">{pkg.name}</h3>

      <div className="text-center my-6">
        <MindCoinIcon size={100} className="mx-auto" />
        {isExtra ? (
          <>
            <p className="text-3xl font-bold text-accent mt-2">
              {(pkg.amount + pkg.bonus).toLocaleString('de-DE')} MC
            </p>
            {pkg.bonus > 0 && (
              <div className={`inline-block mt-2 bg-success/10 border border-success/30 rounded-full font-bold text-success
                ${pkg.bonus >= 3000 ? 'text-base px-5 py-1.5' : pkg.bonus >= 1000 ? 'text-sm px-4 py-1' : 'text-xs px-3 py-0.5'}`}>
                davon +{pkg.bonus.toLocaleString('de-DE')} Bonus!
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-3xl font-bold text-accent mt-2">
              {pkg.amount.toLocaleString('de-DE')} MC
            </p>
            {pkg.bonus > 0 && (
              <p className="text-sm text-success font-medium mt-1">
                +{pkg.bonus} Bonus MindCoins!
              </p>
            )}
          </>
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

function TransactionHistory({ transactions }) {
  const [filter, setFilter] = useState('all')

  const filtered = transactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const typeColors = {
    purchase: 'text-success',
    spend: 'text-error',
    earn: 'text-accent',
  }

  const typeLabels = {
    purchase: 'Einkauf',
    spend: 'Ausgabe',
    earn: 'Gutschrift',
  }

  return (
    <section className="bg-bg-card rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Transaktionsverlauf</h2>
        <div className="flex gap-2">
          {['all', 'purchase', 'spend', 'earn'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filter === f ? 'bg-accent text-white' : 'bg-bg-hover text-text-secondary hover:text-text-primary'
              }`}
            >
              {f === 'all' ? 'Alle' : typeLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-text-muted text-center py-8 text-sm">Noch keine Transaktionen.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filtered.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
              <div>
                <p className="text-sm text-text-primary">{t.description}</p>
                <p className="text-xs text-text-muted">
                  {new Date(t.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className={`font-bold text-sm ${typeColors[t.type] || 'text-text-primary'}`}>
                {t.type === 'spend' ? '-' : '+'}{t.amount} MC
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function Shop() {
  const { user, updateUser } = useAuth()
  const [selectedPkg, setSelectedPkg] = useState(null)
  const [showMore, setShowMore] = useState(false)

  const transactions = user?.transactions || []
  const purchasedOffers = user?.purchasedOffers || []

  const addTransaction = (type, amount, description) => {
    return {
      type,
      amount,
      description,
      date: new Date().toISOString(),
    }
  }

  const handleConfirmPurchase = async (coins, usedCode) => {
    const newTransactions = [...transactions, addTransaction('purchase', coins, `${selectedPkg.name}-Paket gekauft`)]

    const updates = {
      mindCoins: (user?.mindCoins || 0) + coins,
      transactions: newTransactions,
    }

    if (usedCode && VALID_CODES[usedCode]?.type === 'once') {
      updates.usedCodes = [...(user?.usedCodes || []), usedCode]
    }

    if (selectedPkg.oneTimePurchase) {
      updates.purchasedOffers = [...purchasedOffers, selectedPkg.id]
    }

    if (selectedPkg.rewardTitle) {
      const currentShopTitles = user?.shopTitles || []
      if (!currentShopTitles.some(t => t.title === selectedPkg.rewardTitle)) {
        updates.shopTitles = [...currentShopTitles, {
          title: selectedPkg.rewardTitle,
          icon: selectedPkg.rewardTitleIcon,
          source: selectedPkg.name,
        }]
      }
    }

    await updateUser(updates)
  }

  const activeSeasonalOffers = SEASONAL_OFFERS.filter(o => new Date(o.availableUntil) > new Date())

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

      {/* Seasonal Offers */}
      {activeSeasonalOffers.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">{'\u{1F381}'}</span> Aktuelle Angebote
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSeasonalOffers.map(offer => {
              const alreadyPurchased = purchasedOffers.includes(offer.id)
              return (
                <div key={offer.id} className={`bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-xl p-5 border border-accent/30 relative overflow-hidden ${alreadyPurchased ? 'opacity-75' : ''}`}>
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${alreadyPurchased ? 'bg-success text-white' : 'bg-warning text-black'}`}>
                    {alreadyPurchased ? 'GEKAUFT' : offer.badge}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{offer.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-text-primary">{offer.name}</h3>
                      <p className="text-sm text-text-secondary">{offer.description}</p>
                      {offer.rewardTitle && (
                        <p className="text-xs text-warning mt-1">
                          {offer.rewardTitleIcon} Schaltet Titel frei: "{offer.rewardTitle}"
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-accent font-bold">{offer.price}&euro;</span>
                        <CountdownTimer targetDate={offer.availableUntil} />
                      </div>
                    </div>
                  </div>
                  {alreadyPurchased ? (
                    <div className="w-full mt-4 bg-success/20 text-success py-2 rounded-lg font-semibold text-sm text-center border border-success/30">
                      Bereits gekauft
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPkg(offer)}
                      className="w-full mt-4 bg-accent hover:bg-accent-dark text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm"
                    >
                      Kaufen
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Packages grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {MINDCOIN_PACKAGES.map(pkg => (
          <CoinPackageCard key={pkg.id} pkg={pkg} onPurchase={setSelectedPkg} />
        ))}
      </div>

      {/* More packages toggle */}
      {!showMore ? (
        <button
          onClick={() => setShowMore(true)}
          className="w-full mb-12 py-3 rounded-xl border-2 border-dashed border-gray-600 hover:border-accent
                     text-text-secondary hover:text-accent font-semibold transition-colors cursor-pointer
                     flex items-center justify-center gap-2"
        >
          Mehr Pakete anzeigen
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">{'\u{1F48E}'}</span> Grosse Pakete
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXTRA_PACKAGES.map(pkg => (
              <CoinPackageCard key={pkg.id} pkg={pkg} onPurchase={setSelectedPkg} />
            ))}
          </div>
          <button
            onClick={() => setShowMore(false)}
            className="w-full mt-4 py-2 text-text-muted hover:text-text-secondary text-sm
                       transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            Weniger anzeigen
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Transaction History */}
      <div className="mb-12">
        <TransactionHistory transactions={transactions} />
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
          userBalance={user?.mindCoins || 0}
          usedCodes={user?.usedCodes}
        />
      )}
    </div>
  )
}
