/**
 * Growth Tools - Churn Prevention, Upselling, Referrals
 * Componenten voor klantbehoud en groei
 */

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gift, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Copy,
  Share2,
  Star,
  ArrowRight,
  Sparkles,
  Users,
  Heart,
  X,
  MessageCircle,
  Award
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// ===========================================
// 1. CHURN PREVENTION - Dashboard Component
// ===========================================

interface ChurnAlertProps {
  projectId: string
  projectName: string
  lastActivity?: string
  daysSinceActivity: number
  onSendCheckIn: () => void
  onDismiss: () => void
}

export function ChurnAlert({ 
  projectName, 
  daysSinceActivity, 
  onSendCheckIn,
  onDismiss 
}: ChurnAlertProps) {
  const { t } = useTranslation()
  const isUrgent = daysSinceActivity > 30

  if (daysSinceActivity <= 14) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-xl p-3 sm:p-4 border ${
        isUrgent 
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg flex-shrink-0 ${
          isUrgent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
        }`}>
          {isUrgent ? (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
          ) : (
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`font-medium text-sm sm:text-base ${
                isUrgent ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'
              }`}>
                {isUrgent ? t('growthTools.churnAlert.churnRisk') : t('growthTools.churnAlert.checkInNeeded')}
              </p>
              <p className={`text-xs sm:text-sm mt-0.5 ${
                isUrgent ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                <span className="font-medium">{projectName}</span> - {daysSinceActivity} {t('growthTools.churnAlert.daysNoActivity')}
              </p>
            </div>
            <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={onSendCheckIn}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                isUrgent 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {t('growthTools.churnAlert.sendCheckIn')}
            </button>
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {t('growthTools.churnAlert.later')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ===========================================
// 2. SMART UPSELLING - Contextuele Prompts
// ===========================================

interface UpsellBannerProps {
  currentPackage: 'starter' | 'professional' | 'business'
  trigger: 'page_limit' | 'feature_locked' | 'usage_high' | 'anniversary' | 'general'
  featureName?: string
  onUpgrade: () => void
  onDismiss: () => void
}

export function UpsellBanner({ 
  currentPackage, 
  trigger, 
  featureName,
  onUpgrade, 
  onDismiss 
}: UpsellBannerProps) {
  const { t } = useTranslation()
  
  const upsellMessages = {
    page_limit: {
      title: t('growthTools.upsell.morePages'),
      message: t('growthTools.upsell.atLimit'),
      icon: Zap,
    },
    feature_locked: {
      title: t('growthTools.upsell.unlockFeature'),
      message: t('growthTools.upsell.availableHigherPlan'),
      icon: Sparkles,
    },
    usage_high: {
      title: t('growthTools.upsell.websiteGrowing'),
      message: t('growthTools.upsell.timeForMore'),
      icon: TrendingUp,
    },
    anniversary: {
      title: '🎉 ' + t('growthTools.upsell.oneYearCustomer'),
      message: t('growthTools.upsell.upgradeDiscount'),
      icon: Award,
    },
    general: {
      title: t('growthTools.upsell.readyForMore'),
      message: t('growthTools.upsell.discoverMore'),
      icon: ArrowRight,
    },
  }
  
  const config = upsellMessages[trigger]
  const Icon = config.icon
  const nextPackage = currentPackage === 'starter' ? 'Professional' : 'Business'
  const priceIncrease = currentPackage === 'starter' ? '€100' : '€150'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <button 
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base sm:text-lg">
              {trigger === 'feature_locked' && featureName 
                ? `${featureName} unlocken?` 
                : config.title}
            </h4>
            <p className="text-white/80 text-sm mt-0.5">
              {config.message}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onUpgrade}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-primary-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            {t('growthTools.upsell.upgradeTo')} {nextPackage}
            <span className="text-xs opacity-70">+{priceIncrease}/mnd</span>
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors"
          >
            {t('growthTools.upsell.notNow')}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ===========================================
// 3. REFERRAL WIDGET - Voor LivePortal
// ===========================================

interface ReferralWidgetProps {
  referralCode: string
  referralUrl: string
  referralsCount: number
  totalEarned: number
  onCopyCode: () => void
  onShare: () => void
}

export function ReferralWidget({
  referralCode,
  referralUrl,
  referralsCount,
  totalEarned,
  onCopyCode,
  onShare,
}: ReferralWidgetProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    onCopyCode()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('growthTools.referral.needWebsite'),
          text: t('growthTools.referral.use25Off').replace('mijn code', `mijn code ${referralCode}`),
          url: referralUrl,
        })
        onShare()
      } catch {
        setShowShareMenu(true)
      }
    } else {
      setShowShareMenu(true)
    }
  }

  const shareLinks = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(`Hey! ${t('growthTools.referral.use25Off').replace('mijn code', `mijn code ${referralCode}`)}: ${referralUrl}`)}`,
      color: 'bg-green-500',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
      color: 'bg-blue-600',
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(t('growthTools.referral.needWebsite'))}&body=${encodeURIComponent(`${t('growthTools.referral.use25Off').replace('mijn code', `mijn code ${referralCode}`)}: ${referralUrl}`)}`,
      color: 'bg-gray-600',
    },
  ]

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border border-purple-200 dark:border-purple-800 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
            {t('growthTools.referral.title')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t('growthTools.referral.shareCode')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
            <Users className="w-4 h-4" />
            <span className="text-xl sm:text-2xl font-bold">{referralsCount}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('growthTools.referral.referrals')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
            <span className="text-xl sm:text-2xl font-bold">€{totalEarned}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('growthTools.referral.earned')}</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('growthTools.referral.yourCode')}</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-lg sm:text-xl font-mono font-bold text-purple-600 dark:text-purple-400">
            {referralCode}
          </code>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all ${
              copied 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copied ? t('growthTools.referral.copied') : t('growthTools.referral.copyLink')}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {t('growthTools.referral.share')}
        </button>
      </div>

      {/* Share Menu */}
      <AnimatePresence>
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex gap-2">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 ${link.color} text-white text-center py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
                  onClick={() => setShowShareMenu(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works */}
      <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <Heart className="w-3 h-3 inline mr-1 text-pink-500" />
          {t('growthTools.referral.youGet25')}
        </p>
      </div>
    </div>
  )
}

// ===========================================
// 4. PACKAGE VALUE CARD - Waarde benadrukken
// ===========================================

interface PackageValueProps {
  currentPackage: 'starter' | 'professional' | 'business'
  monthsActive: number
  totalValue: number // Waarde van alles wat inbegrepen is
  onViewDetails?: () => void
}

export function PackageValueCard({ currentPackage, monthsActive }: PackageValueProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  
  const packageDetails = {
    starter: {
      name: 'Starter',
      price: 99,
      color: 'from-blue-500 to-cyan-500',
      includes: [
        { item: t('growthTools.packageValue.hosting'), value: 20 },
        { item: t('growthTools.packageValue.sslCertificate'), value: 10 },
        { item: t('growthTools.packageValue.dailyBackups'), value: 15 },
        { item: t('growthTools.packageValue.updatesAndSecurity'), value: 25 },
        { item: '2 ' + t('growthTools.packageValue.changesPerMonth'), value: 50 },
      ],
    },
    professional: {
      name: 'Professional',
      price: 199,
      color: 'from-purple-500 to-pink-500',
      includes: [
        { item: t('growthTools.packageValue.hosting'), value: 30 },
        { item: t('growthTools.packageValue.sslCertificate'), value: 10 },
        { item: t('growthTools.packageValue.dailyBackups'), value: 20 },
        { item: t('growthTools.packageValue.updatesAndSecurity'), value: 30 },
        { item: '5 ' + t('growthTools.packageValue.changesPerMonth'), value: 125 },
        { item: t('growthTools.packageValue.blogFunction'), value: 50 },
        { item: t('growthTools.packageValue.analytics'), value: 30 },
      ],
    },
    business: {
      name: 'Business',
      price: 349,
      color: 'from-amber-500 to-orange-500',
      includes: [
        { item: t('growthTools.packageValue.premiumHosting'), value: 50 },
        { item: t('growthTools.packageValue.sslCertificate'), value: 10 },
        { item: t('growthTools.packageValue.dailyBackups'), value: 25 },
        { item: t('growthTools.packageValue.updatesAndSecurity'), value: 40 },
        { item: t('growthTools.packageValue.unlimitedChanges'), value: 200 },
        { item: t('growthTools.packageValue.blogFunction'), value: 50 },
        { item: t('growthTools.packageValue.analytics'), value: 30 },
        { item: t('growthTools.packageValue.bookingSystem'), value: 80 },
        { item: t('growthTools.packageValue.liveChat'), value: 60 },
        { item: t('growthTools.packageValue.multilingual'), value: 100 },
      ],
    },
  }
  
  const pkg = packageDetails[currentPackage]
  const monthlyValue = pkg.includes.reduce((sum, item) => sum + item.value, 0)
  const totalSaved = (monthlyValue - pkg.price) * monthsActive

  return (
    <div className={`bg-gradient-to-br ${pkg.color} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs sm:text-sm">{t('growthTools.packageValue.yourPackage')}</p>
            <h3 className="text-xl sm:text-2xl font-bold">{pkg.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold">€{pkg.price}</p>
            <p className="text-white/70 text-xs">{t('growthTools.packageValue.perMonth')}</p>
          </div>
        </div>

        {/* Value indicator */}
        <div className="bg-white/20 rounded-xl p-3 sm:p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs sm:text-sm">{t('growthTools.packageValue.realValue')}</p>
              <p className="text-lg sm:text-xl font-bold">€{monthlyValue}{t('growthTools.packageValue.perMonth')}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs sm:text-sm">{t('growthTools.packageValue.youSave')}</p>
              <p className="text-lg sm:text-xl font-bold text-green-300">
                €{monthlyValue - pkg.price}{t('growthTools.packageValue.perMonth')}
              </p>
            </div>
          </div>
          {monthsActive > 1 && (
            <p className="text-center text-white/80 text-xs sm:text-sm mt-2 pt-2 border-t border-white/20">
              {t('growthTools.packageValue.totalSaved')} {monthsActive} {t('growthTools.packageValue.months')}: <strong className="text-green-300">€{totalSaved}</strong>
            </p>
          )}
        </div>

        {/* What's included */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left text-sm text-white/80 hover:text-white flex items-center justify-between"
        >
          <span>{t('growthTools.packageValue.whatsIncluded')}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            className="text-lg"
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {pkg.includes.map((item) => (
                  <div key={item.item} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>{item.item}</span>
                    </div>
                    <span className="text-white/60">€{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ===========================================
// 5. SATISFACTION CHECK - Na oplevering
// ===========================================

interface SatisfactionCheckProps {
  onRate: (rating: number) => void
  onDismiss: () => void
}

export function SatisfactionCheck({ onRate, onDismiss }: SatisfactionCheckProps) {
  const { t } = useTranslation()
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)

  const handleRate = (rating: number) => {
    setSelectedRating(rating)
    setTimeout(() => onRate(rating), 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-lg"
    >
      <button 
        onClick={onDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 dark:text-primary-400" />
        </div>
        
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t('growthTools.satisfaction.howSatisfied')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t('growthTools.satisfaction.feedbackHelps')}
        </p>

        {/* Star rating */}
        <div className="flex justify-center gap-1 sm:gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => handleRate(rating)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                  rating <= (hoveredRating || selectedRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>

        {selectedRating > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            {selectedRating >= 4 ? (
              <p className="text-green-600 dark:text-green-400 text-sm">
                {t('growthTools.satisfaction.great')} ⭐
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('growthTools.satisfaction.thanks')}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ===========================================
// 6. MILESTONE CELEBRATION
// ===========================================

interface MilestoneProps {
  type: '1_month' | '3_months' | '6_months' | '1_year'
  onClaim?: () => void
  onDismiss: () => void
}

const milestoneConfig = {
  '1_month': { titleKey: 'growthTools.milestone.oneMonth', emoji: '🎉', reward: null, messageKey: 'growthTools.milestone.websiteOneMonth' },
  '3_months': { titleKey: 'growthTools.milestone.threeMonths', emoji: '🚀', reward: 'growthTools.milestone.freeSeoCheck', messageKey: 'growthTools.milestone.youGetSeoAnalysis' },
  '6_months': { titleKey: 'growthTools.milestone.sixMonths', emoji: '⭐', reward: 'growthTools.milestone.tenPercentUpgrade', messageKey: 'growthTools.milestone.upgradeNow10' },
  '1_year': { titleKey: 'growthTools.milestone.oneYear', emoji: '🏆', reward: 'growthTools.milestone.freeRedesign', messageKey: 'growthTools.milestone.youGetRedesign' },
}

export function MilestoneCelebration({ type, onClaim, onDismiss }: MilestoneProps) {
  const { t } = useTranslation()
  const config = milestoneConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl sm:text-6xl mb-4">🎊</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t(config.titleKey)} {config.emoji}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t(config.messageKey)}
        </p>
        
        {config.reward && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('growthTools.milestone.yourReward')}:</p>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {t(config.reward)}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {config.reward && onClaim && (
            <button
              onClick={onClaim}
              className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
            >
              {t('growthTools.milestone.claimReward')}
            </button>
          )}
          <button
            onClick={onDismiss}
            className={`${config.reward ? '' : 'flex-1'} py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors`}
          >
            {t('growthTools.milestone.close')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
