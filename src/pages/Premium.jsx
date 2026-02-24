import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Check, X, Crown, GraduationCap } from 'lucide-react'

function PricingCard({ tier, isCurrentTier, t }) {
  const Icon = tier.icon
  return (
    <div className={`bg-bg-card rounded-xl p-6 border flex flex-col relative
      ${tier.highlighted
        ? 'border-accent ring-2 ring-accent/20 md:scale-105'
        : 'border-gray-700'
      }`}>
      {tier.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
          {t('premium.recommended')}
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
          <span className="text-3xl font-bold text-text-primary">{t('premium.freePrice')}</span>
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
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isCurrentTier || tier.id === 'free'
            ? 'bg-bg-hover text-text-muted cursor-not-allowed'
            : tier.highlighted
              ? 'bg-accent hover:bg-accent-dark text-white cursor-pointer'
              : 'bg-bg-hover hover:bg-bg-card text-text-primary border border-gray-600 cursor-pointer'
        }`}
        disabled={isCurrentTier || tier.id === 'free'}
      >
        {isCurrentTier ? t('premium.currentPlan') : tier.buttonText}
      </button>

      {tier.id !== 'free' && !isCurrentTier && (
        <p className="text-xs text-text-muted text-center mt-2">
          {t('premium.paymentSoon')}
        </p>
      )}
    </div>
  )
}

export default function Premium() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const currentTier = user?.premiumTier || 'free'

  const PREMIUM_TIERS = [
    {
      id: 'free',
      name: t('premium.free'),
      price: '0',
      period: '',
      icon: null,
      description: t('premium.freeDesc'),
      features: [
        { text: t('premium.features.playGames'), included: true },
        { text: t('premium.features.createProfile'), included: true },
        { text: t('premium.features.addFriends'), included: true },
        { text: t('premium.features.joinEvents'), included: true },
        { text: t('premium.features.collectAchievements'), included: true },
        { text: t('premium.features.uploadGames'), included: false },
        { text: t('premium.features.customAvatar'), included: false },
        { text: t('premium.features.sellMarketplace'), included: false },
        { text: t('premium.features.classManagement'), included: false },
      ],
      buttonText: t('premium.currentPlan'),
      highlighted: false,
    },
    {
      id: 'creator',
      name: t('premium.creator'),
      price: '9,99',
      period: t('common.perMonth'),
      icon: Crown,
      description: t('premium.creatorDesc'),
      features: [
        { text: t('premium.features.allFromFree'), included: true },
        { text: t('premium.features.createGames'), included: true },
        { text: t('premium.features.customAvatar'), included: true },
        { text: t('premium.features.earlyAccess'), included: true },
        { text: t('premium.features.creatorBadge'), included: true },
        { text: t('premium.features.monthlyCoins100'), included: true },
        { text: t('premium.features.sellOnMarketplace'), included: true },
        { text: t('premium.features.classManagement'), included: false },
        { text: t('premium.features.studentTracking'), included: false },
      ],
      buttonText: t('premium.becomeCreator'),
      highlighted: true,
    },
    {
      id: 'teacher',
      name: t('premium.teacher'),
      price: '14,99',
      period: t('common.perMonth'),
      icon: GraduationCap,
      description: t('premium.teacherDesc'),
      features: [
        { text: t('premium.features.allFromCreator'), included: true },
        { text: t('premium.features.manageClasses'), included: true },
        { text: t('premium.features.trackProgress'), included: true },
        { text: t('premium.features.assignGames'), included: true },
        { text: t('premium.features.teacherBadge'), included: true },
        { text: t('premium.features.monthlyCoins200'), included: true },
        { text: t('premium.features.advancedStats'), included: true },
        { text: t('premium.features.prioritySupport'), included: true },
      ],
      buttonText: t('premium.becomeTeacher'),
      highlighted: false,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>Premium | MindForge</title>
        <meta name="description" content={t('premium.subtitle')} />
        <meta property="og:title" content="Premium | MindForge" />
        <meta property="og:description" content={t('premium.subtitle')} />
      </Helmet>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{t('premium.headline')}</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          {t('premium.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {PREMIUM_TIERS.map(tier => (
          <PricingCard
            key={tier.id}
            tier={tier}
            isCurrentTier={currentTier === tier.id}
            t={t}
          />
        ))}
      </div>

      <div className="mt-12 bg-bg-card rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-center">{t('premium.faq.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-text-primary mb-1">{t('premium.faq.cancelQ')}</h3>
            <p className="text-sm text-text-secondary">{t('premium.faq.cancelA')}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-1">{t('premium.faq.gamesQ')}</h3>
            <p className="text-sm text-text-secondary">{t('premium.faq.gamesA')}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-1">{t('premium.faq.upgradeQ')}</h3>
            <p className="text-sm text-text-secondary">{t('premium.faq.upgradeA')}</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-1">{t('premium.faq.studentQ')}</h3>
            <p className="text-sm text-text-secondary">{t('premium.faq.studentA')}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-warning/10 border border-warning/30 rounded-lg p-4 text-center">
        <p className="text-warning font-medium">
          {t('premium.paymentSoon')}
        </p>
        <p className="text-sm text-text-muted mt-1">
          {t('premium.paymentNote')}
        </p>
      </div>
    </div>
  )
}
