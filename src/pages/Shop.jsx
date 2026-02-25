import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Coins, Crown, Gift, Sparkles, Receipt, Lock, GraduationCap, Check, X, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import MindCoinIcon from '../components/common/MindCoinIcon'
import { getPremiumDiscount, isPremium } from '../utils/premiumChecks'
import useEscapeKey from '../hooks/useEscapeKey'

// ──────────── CONSTANTS ────────────

const VALID_CODES = {
  'MindForge': { discount: 1.0, label: '100% Rabatt', type: 'multi', maxUses: Infinity },
  'WELCOME10': { discount: 0.1, label: '10% Rabatt', type: 'once', maxUses: 1 },
  'EVENT2025': { discount: 0.5, label: '50% Rabatt', type: 'once', maxUses: 1 },
  'WINTER25': { discount: 0.25, label: '25% Rabatt', type: 'once', maxUses: 1, expiresAt: '2026-03-31' },
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

const MINDCOIN_PACKAGES = [
  { id: 'starter', name: 'Starter', amount: 500, bonus: 0, price: '4,99', priceNum: 4.99, pricePerEuro: '100 MC/\u20AC', badge: null },
  { id: 'standard', name: 'Standard', amount: 1200, bonus: 200, price: '9,99', priceNum: 9.99, pricePerEuro: '120 MC/\u20AC', popular: true },
  { id: 'premium', name: 'Premium', amount: 2500, bonus: 500, price: '19,99', priceNum: 19.99, pricePerEuro: '125 MC/\u20AC', bestDeal: true },
]

const EXTRA_PACKAGES = [
  { id: 'mega', name: 'Mega', amount: 3500, bonus: 750, price: '34,99', priceNum: 34.99, pricePerEuro: '121 MC/\u20AC', mega: true },
  { id: 'ultra', name: 'Ultra', amount: 5000, bonus: 1500, price: '49,99', priceNum: 49.99, pricePerEuro: '130 MC/\u20AC', ultra: true },
  { id: 'diamant', name: 'Diamant', amount: 10000, bonus: 4000, price: '99,99', priceNum: 99.99, pricePerEuro: '140 MC/\u20AC', legendary: true },
]

const MONTHLY_EXCLUSIVE_ITEMS = [
  {
    id: 'exc-glow-frame',
    name: 'Gluehender Rahmen',
    icon: '\u{1F525}',
    rarity: 'epic',
    price: 150,
    description: 'Ein leuchtender Rahmen mit Glow-Effekt fuer dein Profil',
    availableMonth: 2,
  },
  {
    id: 'exc-aurora-bg',
    name: 'Nordlicht-Hintergrund',
    icon: '\u{1F30C}',
    rarity: 'legendary',
    price: 200,
    description: 'Mystischer Nordlicht-Hintergrund fuer deinen Avatar',
    availableMonth: 2,
  },
  {
    id: 'exc-crystal-crown',
    name: 'Kristall-Krone',
    icon: '\u{1F451}',
    rarity: 'legendary',
    price: 300,
    description: 'Eine funkelnde Krone aus reinem Kristall',
    availableMonth: 2,
  },
  {
    id: 'exc-spring-aura',
    name: 'Fruehlings-Aura',
    icon: '\u{1F33C}',
    rarity: 'epic',
    price: 175,
    description: 'Blumen-Partikel umgeben deinen Avatar',
    availableMonth: 3,
  },
  {
    id: 'exc-rainbow-trail',
    name: 'Regenbogen-Spur',
    icon: '\u{1F308}',
    rarity: 'legendary',
    price: 250,
    description: 'Ein farbenfroher Regenbogen-Effekt',
    availableMonth: 3,
  },
  {
    id: 'exc-thunder-badge',
    name: 'Donner-Emblem',
    icon: '\u26A1',
    rarity: 'epic',
    price: 160,
    description: 'Elektrisierendes Emblem fuer dein Profil',
    availableMonth: 3,
  },
]

const RARITY_CONFIG = {
  common: { name: 'Gewoehnlich', color: 'text-gray-400', border: 'border-gray-600', bg: 'bg-gray-600/20' },
  rare: { name: 'Selten', color: 'text-blue-400', border: 'border-blue-500', bg: 'bg-blue-500/20' },
  epic: { name: 'Episch', color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-500/20' },
  legendary: { name: 'Legendaer', color: 'text-orange-400', border: 'border-amber-500', bg: 'bg-amber-500/20' },
}

// ──────────── SIDEBAR CATEGORIES ────────────

const SHOP_CATEGORIES = [
  { id: 'mindcoins', icon: Coins, labelKey: 'shop.categories.mindcoins' },
  { id: 'premium', icon: Crown, labelKey: 'shop.categories.premium' },
  { id: 'seasonal', icon: Gift, labelKey: 'shop.categories.seasonal' },
  { id: 'exclusive', icon: Sparkles, labelKey: 'shop.categories.exclusive' },
  { id: 'transactions', icon: Receipt, labelKey: 'shop.categories.transactions' },
]

// ──────────── COMPONENTS ────────────

function CountdownTimer({ targetDate, t }) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, new Date(targetDate) - new Date()))

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(Math.max(0, new Date(targetDate) - new Date())), 60000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (timeLeft <= 0) return <span className="text-error text-xs">{t('shop.expired')}</span>

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return <span className="text-warning text-xs font-medium">{t('shop.remaining', { days, hours })}</span>
}

function PurchaseModal({ pkg, onClose, onConfirm, userBalance, usedCodes, premiumDiscount, t }) {
  const [discountCode, setDiscountCode] = useState('')
  const [appliedCode, setAppliedCode] = useState(null)
  const [codeError, setCodeError] = useState(null)
  const [purchased, setPurchased] = useState(false)
  const [newBalance, setNewBalance] = useState(null)
  useEscapeKey(onClose)

  const totalCoins = pkg.amount + (pkg.bonus || 0) + (premiumDiscount?.bonusMC || 0)
  const premiumPriceReduction = premiumDiscount?.percent ? pkg.priceNum * (premiumDiscount.percent / 100) : 0
  const priceAfterPremium = pkg.priceNum - premiumPriceReduction
  const codeDiscount = appliedCode ? VALID_CODES[appliedCode].discount : 0
  const finalPrice = priceAfterPremium * (1 - codeDiscount)
  const isFree = finalPrice <= 0.005

  const handleApplyCode = () => {
    const trimmed = discountCode.trim()
    const codeConfig = VALID_CODES[trimmed]
    if (!codeConfig) { setCodeError(t('shop.invalidCode')); setAppliedCode(null); return }
    if (codeConfig.expiresAt && new Date(codeConfig.expiresAt) < new Date()) { setCodeError(t('shop.codeExpired')); setAppliedCode(null); return }
    if (codeConfig.type === 'once' && usedCodes?.includes(trimmed)) { setCodeError(t('shop.codeUsed')); setAppliedCode(null); return }
    setAppliedCode(trimmed)
    setCodeError(null)
  }

  const handlePurchase = () => {
    setNewBalance((userBalance || 0) + totalCoins)
    onConfirm(totalCoins, appliedCode)
    setPurchased(true)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">{t('shop.buyTitle')}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl cursor-pointer">{'\u2715'}</button>
        </div>

        <div className="p-6 space-y-6">
          {purchased ? (
            <div className="text-center py-6">
              <MindCoinIcon size={80} className="mx-auto" />
              <h3 className="text-2xl font-bold text-success mt-4">{t('shop.success')}</h3>
              <p className="text-text-secondary mt-2">{t('shop.coinsAdded', { coins: totalCoins.toLocaleString('de-DE') })}</p>
              {premiumDiscount?.bonusMC > 0 && (
                <p className="text-xs text-accent mt-1">{t('shop.premiumBonus', { bonus: premiumDiscount.bonusMC })}</p>
              )}
              <p className="text-sm text-accent mt-1">{t('shop.newBalance', { balance: (newBalance || 0).toLocaleString('de-DE') })}</p>
              {pkg.rewardTitle && (
                <div className="mt-3 bg-warning/10 border border-warning/30 rounded-lg px-4 py-2 inline-block">
                  <p className="text-warning text-sm font-semibold">{pkg.rewardTitleIcon} {t('shop.titleUnlocked', { title: pkg.rewardTitle })}</p>
                </div>
              )}
              <button onClick={onClose} className="mt-6 bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer">{t('common.close')}</button>
            </div>
          ) : (
            <>
              <div className="bg-bg-card rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <MindCoinIcon size={56} />
                  <div>
                    <p className="font-bold text-text-primary text-lg">{t('shop.packageName', { name: pkg.name })}</p>
                    <p className="text-accent font-semibold">{totalCoins.toLocaleString('de-DE')} MindCoins</p>
                    {(pkg.bonus || 0) > 0 && <p className="text-sm text-success">{t('shop.bonusIncluded', { bonus: pkg.bonus })}</p>}
                    {premiumDiscount?.bonusMC > 0 && (
                      <p className="text-xs text-accent font-medium">{t('shop.premiumBonus', { bonus: premiumDiscount.bonusMC })}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">{t('shop.paymentMethod')}</h3>
                <div className="bg-bg-card rounded-lg p-4 text-center border border-gray-700">
                  <p className="text-text-muted text-sm">{t('shop.paymentComingSoon')}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">{t('shop.discountCode')}</h3>
                <div className="flex gap-2">
                  <input type="text" value={discountCode} onChange={(e) => { setDiscountCode(e.target.value); setCodeError(null) }}
                    placeholder={t('shop.codePlaceholder')} className="flex-1 bg-bg-card border border-gray-700 rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent" />
                  <button onClick={handleApplyCode} className="bg-bg-hover hover:bg-gray-500 text-text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">{t('shop.redeem')}</button>
                </div>
                {codeError && <p className="text-error text-xs mt-1">{codeError}</p>}
                {appliedCode && <p className="text-success text-xs mt-1">{VALID_CODES[appliedCode].label} {t('shop.applied')}</p>}
                <p className="text-xs text-text-muted mt-2">{t('shop.availableCodes')}</p>
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-1">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>{t('shop.packagePrice')}</span>
                  <span>{pkg.price}&euro;</span>
                </div>
                {premiumDiscount?.percent > 0 && (
                  <div className="flex justify-between text-sm text-accent">
                    <span>{t('shop.premiumDiscount', { percent: premiumDiscount.percent })}</span>
                    <span>-{premiumPriceReduction.toFixed(2).replace('.', ',')}&euro;</span>
                  </div>
                )}
                {appliedCode && (
                  <div className="flex justify-between text-sm text-success">
                    <span>{t('shop.discount', { discount: VALID_CODES[appliedCode].label })}</span>
                    <span>-{(priceAfterPremium * codeDiscount).toFixed(2).replace('.', ',')}&euro;</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-text-primary mt-2 text-lg">
                  <span>{t('shop.total')}</span>
                  <span>{isFree ? t('common.free') : `${finalPrice.toFixed(2).replace('.', ',')}\u20AC`}</span>
                </div>
              </div>

              <button onClick={handlePurchase} disabled={!isFree}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${isFree ? 'bg-success hover:bg-green-600 text-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                {isFree ? t('shop.freeOrder') : t('shop.paymentRequired')}
              </button>
              {!isFree && <p className="text-xs text-text-muted text-center">{t('shop.testHint')}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CoinPackageCard({ pkg, onPurchase, premiumDiscount, t }) {
  const isExtra = pkg.mega || pkg.ultra || pkg.legendary
  const hasPremiumDiscount = premiumDiscount?.percent > 0

  const getBadge = () => {
    if (pkg.legendary) return { text: t('shop.legendary'), cls: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black' }
    if (pkg.ultra) return { text: t('shop.ultra'), cls: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' }
    if (pkg.mega) return { text: t('shop.mega'), cls: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' }
    if (pkg.popular) return { text: t('shop.popular'), cls: 'bg-accent text-white' }
    if (pkg.bestDeal) return { text: t('shop.bestDeal'), cls: 'bg-warning text-black' }
    return null
  }

  const getBorderClass = () => {
    if (pkg.legendary) return 'border-amber-400 ring-2 ring-amber-400/20'
    if (pkg.ultra) return 'border-purple-500 ring-2 ring-purple-500/20'
    if (pkg.mega) return 'border-blue-500 ring-2 ring-blue-500/20'
    if (pkg.popular) return 'border-accent ring-2 ring-accent/20'
    if (pkg.bestDeal) return 'border-warning ring-2 ring-warning/20'
    return 'border-gray-700'
  }

  const badge = getBadge()
  const totalCoins = pkg.amount + (pkg.bonus || 0) + (premiumDiscount?.bonusMC || 0)
  const discountedPrice = hasPremiumDiscount ? (pkg.priceNum * (1 - premiumDiscount.percent / 100)) : pkg.priceNum

  return (
    <div className={`bg-bg-card rounded-xl p-5 border relative ${getBorderClass()}`}>
      {badge && (
        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${badge.cls}`}>
          {badge.text}
        </span>
      )}

      <h3 className="text-lg font-bold text-text-primary text-center mt-2">{pkg.name}</h3>

      <div className="text-center my-4">
        <MindCoinIcon size={80} className="mx-auto" />
        {isExtra ? (
          <>
            <p className="text-2xl font-bold text-accent mt-2">{totalCoins.toLocaleString('de-DE')} {t('common.mc')}</p>
            {pkg.bonus > 0 && (
              <div className={`inline-block mt-1 bg-success/10 border border-success/30 rounded-full font-bold text-success
                ${pkg.bonus >= 3000 ? 'text-sm px-4 py-1' : 'text-xs px-3 py-0.5'}`}>
                {t('shop.bonusAmount', { bonus: pkg.bonus.toLocaleString('de-DE') })}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-accent mt-2">{totalCoins.toLocaleString('de-DE')} {t('common.mc')}</p>
            {pkg.bonus > 0 && <p className="text-sm text-success font-medium mt-1">+{pkg.bonus} {t('shop.bonusMindCoins')}</p>}
          </>
        )}
        {hasPremiumDiscount && premiumDiscount.bonusMC > 0 && (
          <p className="text-xs text-accent font-semibold mt-1">{t('shop.premiumBonus', { bonus: premiumDiscount.bonusMC })}</p>
        )}
      </div>

      <div className="text-center">
        {hasPremiumDiscount ? (
          <>
            <p className="text-sm text-text-muted line-through">{pkg.price}&euro;</p>
            <p className="text-xl font-bold text-accent">{discountedPrice.toFixed(2).replace('.', ',')}&euro;</p>
          </>
        ) : (
          <p className="text-xl font-bold text-text-primary">{pkg.price}&euro;</p>
        )}
        <p className="text-xs text-text-muted mt-1">{pkg.pricePerEuro}</p>
      </div>

      <button onClick={() => onPurchase(pkg)}
        className="w-full mt-4 bg-accent hover:bg-accent-dark text-white py-2.5 rounded-lg font-semibold transition-colors cursor-pointer text-sm">
        {t('common.buy')}
      </button>
    </div>
  )
}

function TransactionHistory({ transactions, t }) {
  const [filter, setFilter] = useState('all')
  const filtered = transactions.filter(tx => filter === 'all' || tx.type === filter)
  const typeColors = { purchase: 'text-success', spend: 'text-error', earn: 'text-accent' }
  const typeLabels = { purchase: t('shop.purchase'), spend: t('shop.spend'), earn: t('shop.credit') }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('shop.transactionHistory')}</h2>
        <div className="flex gap-2">
          {['all', 'purchase', 'spend', 'earn'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${filter === f ? 'bg-accent text-white' : 'bg-bg-hover text-text-secondary hover:text-text-primary'}`}>
              {f === 'all' ? t('shop.all') : typeLabels[f]}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-text-muted text-center py-8 text-sm">{t('shop.noTransactions')}</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
              <div>
                <p className="text-sm text-text-primary">{tx.description}</p>
                <p className="text-xs text-text-muted">{new Date(tx.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <span className={`font-bold text-sm ${typeColors[tx.type] || 'text-text-primary'}`}>
                {tx.type === 'spend' ? '-' : '+'}{tx.amount} {t('common.mc')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ──────────── SECTION COMPONENTS ────────────

function MindCoinsSection({ user, premiumDiscount, onPurchase, t }) {
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="space-y-6">
      {/* Balance */}
      <div className="bg-bg-card rounded-xl p-4 inline-flex items-center gap-3 border border-gray-700">
        <MindCoinIcon size={56} />
        <div>
          <p className="text-sm text-text-muted">{t('shop.yourBalance')}</p>
          <p className="text-2xl font-bold text-accent">{(user?.mindCoins || 0).toLocaleString('de-DE')} MindCoins</p>
        </div>
      </div>

      {premiumDiscount?.percent > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 flex items-center gap-3">
          <Crown className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-accent">{t('shop.premiumDiscount', { percent: premiumDiscount.percent })}</p>
            <p className="text-xs text-text-muted">{t('shop.premiumBonus', { bonus: premiumDiscount.bonusMC })} auf jedes Paket</p>
          </div>
        </div>
      )}

      {/* Standard Packages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MINDCOIN_PACKAGES.map(pkg => (
          <CoinPackageCard key={pkg.id} pkg={pkg} onPurchase={onPurchase} premiumDiscount={premiumDiscount} t={t} />
        ))}
      </div>

      {/* Extra Packages */}
      {!showMore ? (
        <button onClick={() => setShowMore(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-600 hover:border-accent text-text-secondary hover:text-accent font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
          {t('shop.showMore')}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-2xl">{'\u{1F48E}'}</span> {t('shop.bigPackages')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXTRA_PACKAGES.map(pkg => (
              <CoinPackageCard key={pkg.id} pkg={pkg} onPurchase={onPurchase} premiumDiscount={premiumDiscount} t={t} />
            ))}
          </div>
          <button onClick={() => setShowMore(false)}
            className="w-full mt-3 py-2 text-text-muted hover:text-text-secondary text-sm transition-colors cursor-pointer flex items-center justify-center gap-1">
            {t('shop.showLess')}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
        </div>
      )}

      {/* What are MindCoins for */}
      <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-3">{t('shop.whatFor')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#128142;</span>
            <div>
              <p className="font-medium text-text-primary text-sm">{t('shop.forAvatar')}</p>
              <p className="text-xs text-text-muted">{t('shop.forAvatarDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#127912;</span>
            <div>
              <p className="font-medium text-text-primary text-sm">{t('shop.forAssets')}</p>
              <p className="text-xs text-text-muted">{t('shop.forAssetsDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#127918;</span>
            <div>
              <p className="font-medium text-text-primary text-sm">{t('shop.forContent')}</p>
              <p className="text-xs text-text-muted">{t('shop.forContentDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PremiumSection({ user, t }) {
  const [isYearly, setIsYearly] = useState(false)
  const currentTier = user?.premiumTier || 'free'

  const tiers = [
    { id: 'free', name: t('premium.free'), monthly: '0', yearly: '0', icon: null, features: [t('premium.features.playGames'), t('premium.features.createProfile'), t('premium.features.addFriends')], missing: [t('premium.features.uploadGames'), t('premium.features.exclusiveMonthlyItems')] },
    { id: 'pro', name: t('premium.pro'), monthly: '4,99', yearly: '3,99', icon: Sparkles, color: 'text-blue-400', features: [t('premium.features.premiumAvatarItems'), t('premium.features.monthlyCoins50'), t('premium.features.mcDiscount', { percent: 5 }), t('premium.features.exclusiveMonthlyItems')], missing: [t('premium.features.uploadGames')] },
    { id: 'creator', name: t('premium.creator'), monthly: '9,99', yearly: '7,99', icon: Crown, color: 'text-accent', recommended: true, features: [t('premium.features.createGames'), t('premium.features.monthlyCoins100'), t('premium.features.mcDiscount', { percent: 10 }), t('premium.features.sellOnMarketplace')], missing: [t('premium.features.classManagement')] },
    { id: 'teacher', name: t('premium.teacher'), monthly: '14,99', yearly: '11,99', icon: GraduationCap, color: 'text-purple-400', features: [t('premium.features.manageClasses'), t('premium.features.monthlyCoins200'), t('premium.features.mcDiscount', { percent: 15 }), t('premium.features.prioritySupport')], missing: [] },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('shop.categories.premium')}</h2>
        <div className="inline-flex items-center bg-bg-card rounded-full p-1 border border-gray-700">
          <button onClick={() => setIsYearly(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${!isYearly ? 'bg-accent text-white' : 'text-text-secondary'}`}>
            {t('premium.monthly')}
          </button>
          <button onClick={() => setIsYearly(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${isYearly ? 'bg-accent text-white' : 'text-text-secondary'}`}>
            {t('premium.yearly')}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isYearly ? 'bg-white/20' : 'bg-success/20 text-success'}`}>-20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map(tier => {
          const Icon = tier.icon
          const isCurrent = currentTier === tier.id
          const price = isYearly ? tier.yearly : tier.monthly

          return (
            <div key={tier.id} className={`bg-bg-card rounded-xl p-5 border relative flex flex-col ${tier.recommended ? 'border-accent ring-2 ring-accent/20' : 'border-gray-700'}`}>
              {tier.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">{t('premium.recommended')}</span>
              )}
              <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className={`w-5 h-5 ${tier.color || 'text-accent'}`} />}
                <h3 className="font-bold text-text-primary">{tier.name}</h3>
              </div>
              {tier.id !== 'free' ? (
                <p className="text-2xl font-bold text-text-primary mb-3">{price}&euro;<span className="text-sm text-text-muted font-normal">{t('common.perMonth')}</span></p>
              ) : (
                <p className="text-2xl font-bold text-text-primary mb-3">{t('premium.freePrice')}</p>
              )}
              <ul className="space-y-1.5 flex-1 mb-4">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs"><Check className="w-3.5 h-3.5 text-success flex-shrink-0" /><span className="text-text-primary">{f}</span></li>
                ))}
                {tier.missing.map((f, i) => (
                  <li key={`m-${i}`} className="flex items-center gap-2 text-xs"><X className="w-3.5 h-3.5 text-text-muted flex-shrink-0" /><span className="text-text-muted">{f}</span></li>
                ))}
              </ul>
              <button disabled={isCurrent || tier.id === 'free'}
                className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${isCurrent || tier.id === 'free' ? 'bg-bg-hover text-text-muted cursor-not-allowed' : tier.recommended ? 'bg-accent hover:bg-accent-dark text-white cursor-pointer' : 'bg-bg-hover hover:bg-bg-card text-text-primary border border-gray-600 cursor-pointer'}`}>
                {isCurrent ? t('premium.currentPlan') : tier.id === 'free' ? t('premium.freePrice') : t('common.buy')}
              </button>
            </div>
          )
        })}
      </div>

      <Link to="/premium" className="flex items-center gap-2 text-accent hover:underline text-sm">
        <ExternalLink className="w-4 h-4" /> {t('shop.viewPremiumDetails')}
      </Link>
    </div>
  )
}

function SeasonalSection({ user, onPurchase, t }) {
  const purchasedOffers = user?.purchasedOffers || []
  const activeOffers = SEASONAL_OFFERS.filter(o => new Date(o.availableUntil) > new Date())

  if (activeOffers.length === 0) {
    return <p className="text-text-muted text-center py-12">{t('shop.noTransactions')}</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span className="text-2xl">{'\u{1F381}'}</span> {t('shop.currentOffers')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeOffers.map(offer => {
          const alreadyPurchased = purchasedOffers.includes(offer.id)
          return (
            <div key={offer.id} className={`bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-xl p-5 border border-accent/30 relative overflow-hidden ${alreadyPurchased ? 'opacity-75' : ''}`}>
              <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${alreadyPurchased ? 'bg-success text-white' : 'bg-warning text-black'}`}>
                {alreadyPurchased ? t('shop.purchasedBadge') : offer.badge}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{offer.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary">{offer.name}</h3>
                  <p className="text-sm text-text-secondary">{offer.description}</p>
                  {offer.rewardTitle && (
                    <p className="text-xs text-warning mt-1">{offer.rewardTitleIcon} {t('shop.unlocksTitle')} "{offer.rewardTitle}"</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-accent font-bold">{offer.price}&euro;</span>
                    <CountdownTimer targetDate={offer.availableUntil} t={t} />
                  </div>
                </div>
              </div>
              {alreadyPurchased ? (
                <div className="w-full mt-4 bg-success/20 text-success py-2 rounded-lg font-semibold text-sm text-center border border-success/30">{t('shop.alreadyPurchased')}</div>
              ) : (
                <button onClick={() => onPurchase(offer)}
                  className="w-full mt-4 bg-accent hover:bg-accent-dark text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm">{t('common.buy')}</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ExclusiveSection({ user, t }) {
  const currentMonth = new Date().getMonth() + 1
  const monthItems = MONTHLY_EXCLUSIVE_ITEMS.filter(item => item.availableMonth === currentMonth)
  const userIsPremium = isPremium(user)
  const daysLeft = Math.ceil((new Date(new Date().getFullYear(), currentMonth, 0) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" /> {t('shop.exclusiveTitle')}
        </h2>
        <span className="text-xs text-warning font-medium bg-warning/10 px-3 py-1 rounded-full">
          {t('shop.endsIn', { days: daysLeft })}
        </span>
      </div>
      <p className="text-text-secondary text-sm">{t('shop.exclusiveDesc')}</p>

      {!userIsPremium && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-warning flex-shrink-0" />
          <div>
            <p className="text-warning font-semibold text-sm">{t('shop.premiumRequired')}</p>
            <p className="text-text-muted text-xs">{t('shop.lockedForFree')}</p>
          </div>
          <Link to="/premium" className="ml-auto bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">
            {t('premium.becomePro')}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {monthItems.map(item => {
          const rarity = RARITY_CONFIG[item.rarity]
          return (
            <div key={item.id} className={`bg-bg-card rounded-xl p-5 border relative ${rarity.border} ${!userIsPremium ? 'opacity-60' : ''}`}>
              <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${rarity.bg} ${rarity.color}`}>
                {rarity.name}
              </span>
              <div className="text-center mb-3">
                <span className="text-4xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-text-primary text-center text-sm">{item.name}</h3>
              <p className="text-xs text-text-muted text-center mt-1 mb-3">{item.description}</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                <MindCoinIcon size={18} />
                <span className="font-bold text-accent">{item.price} MC</span>
              </div>
              {userIsPremium ? (
                <button className="w-full bg-accent hover:bg-accent-dark text-white py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                  {t('common.buy')}
                </button>
              ) : (
                <div className="w-full bg-bg-hover text-text-muted py-2 rounded-lg text-sm font-semibold text-center flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> {t('shop.premiumOnly')}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {monthItems.length === 0 && (
        <p className="text-text-muted text-center py-8 text-sm">{t('shop.monthlyRotating')}</p>
      )}
    </div>
  )
}

// ──────────── MAIN SHOP ────────────

export default function Shop() {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()
  const [activeCategory, setActiveCategory] = useState('mindcoins')
  const [selectedPkg, setSelectedPkg] = useState(null)

  const transactions = user?.transactions || []
  const premiumDiscount = getPremiumDiscount(user)

  const addTransaction = (type, amount, description) => ({
    type, amount, description, date: new Date().toISOString(),
  })

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
      updates.purchasedOffers = [...(user?.purchasedOffers || []), selectedPkg.id]
    }
    if (selectedPkg.rewardTitle) {
      const currentShopTitles = user?.shopTitles || []
      if (!currentShopTitles.some(t => t.title === selectedPkg.rewardTitle)) {
        updates.shopTitles = [...currentShopTitles, { title: selectedPkg.rewardTitle, icon: selectedPkg.rewardTitleIcon, source: selectedPkg.name }]
      }
    }
    try { await updateUser(updates) } catch {}
  }

  const renderContent = () => {
    switch (activeCategory) {
      case 'mindcoins':
        return <MindCoinsSection user={user} premiumDiscount={premiumDiscount} onPurchase={setSelectedPkg} t={t} />
      case 'premium':
        return <PremiumSection user={user} t={t} />
      case 'seasonal':
        return <SeasonalSection user={user} onPurchase={setSelectedPkg} t={t} />
      case 'exclusive':
        return <ExclusiveSection user={user} t={t} />
      case 'transactions':
        return <TransactionHistory transactions={transactions} t={t} />
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <>
        <title>MindCoins Shop | MindForge</title>
        <meta name="description" content={t('shop.subtitle')} />
        <meta property="og:title" content="MindCoins Shop | MindForge" />
        <meta property="og:description" content={t('shop.subtitle')} />
      </>

      <h1 className="text-3xl font-bold mb-2">{t('shop.title')}</h1>
      <p className="text-text-secondary mb-6">{t('shop.subtitle')}</p>

      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <nav className="hidden md:flex flex-col w-52 flex-shrink-0 sticky top-20 self-start">
          <div className="bg-bg-card rounded-xl border border-gray-700 overflow-hidden">
            {SHOP_CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-accent/15 text-accent font-semibold border-l-3 border-accent'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {t(cat.labelKey)}
                </button>
              )
            })}
          </div>

          {/* Balance mini card */}
          <div className="mt-4 bg-bg-card rounded-xl border border-gray-700 p-3 text-center">
            <MindCoinIcon size={32} className="mx-auto" />
            <p className="text-lg font-bold text-accent mt-1">{(user?.mindCoins || 0).toLocaleString('de-DE')}</p>
            <p className="text-[10px] text-text-muted">MindCoins</p>
          </div>
        </nav>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-4 w-full -mx-6 px-6">
          {SHOP_CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                  activeCategory === cat.id ? 'bg-accent text-white' : 'bg-bg-card text-text-secondary border border-gray-700'
                }`}>
                <Icon className="w-4 h-4" />
                {t(cat.labelKey)}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedPkg && (
        <PurchaseModal
          pkg={selectedPkg}
          onClose={() => setSelectedPkg(null)}
          onConfirm={handleConfirmPurchase}
          userBalance={user?.mindCoins || 0}
          usedCodes={user?.usedCodes}
          premiumDiscount={premiumDiscount}
          t={t}
        />
      )}
    </div>
  )
}
