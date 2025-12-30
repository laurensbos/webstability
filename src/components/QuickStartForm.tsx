import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Check, 
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Building2,
  Phone,
  Sparkles,
  User,
  Gift
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getReferralCode, clearReferral, getReferral } from '../hooks/useReferralCapture'

interface QuickStartFormProps {
  serviceType: 'website' | 'webshop' | 'drone' | 'logo'
  initialPackage?: string
  onBack?: () => void
}

// Generate Project ID
function generateProjectId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'WS-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Service configuration
const serviceConfig = {
  website: {
    name: 'Website',
    gradient: 'from-primary-500 to-primary-600',
  },
  webshop: {
    name: 'Webshop',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  drone: {
    name: 'Drone Video',
    gradient: 'from-orange-500 to-orange-600',
  },
  logo: {
    name: 'Logo Design',
    gradient: 'from-purple-500 to-purple-600',
  },
}

export default function QuickStartForm({ 
  serviceType, 
  initialPackage,
  onBack 
}: QuickStartFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const config = serviceConfig[serviceType]
  const packageId = initialPackage || 'starter'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [hasReferral, setHasReferral] = useState(false)
  
  // Check for referral code on mount
  useEffect(() => {
    const referral = getReferral()
    setHasReferral(!!referral)
  }, [])
  
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
  })

  const isValid = formData.name.trim() &&
                  formData.companyName.trim() && 
                  formData.email.includes('@') && 
                  formData.password.length >= 4

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError('')
    const projectId = generateProjectId()

    try {
      // Get referral code if available
      const referralCode = getReferralCode()
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: serviceType,
          package: packageId,
          packageType: packageId,
          name: formData.name,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          status: 'onboarding',
          createdAt: new Date().toISOString(),
          // Include referral code for attribution
          referredBy: referralCode || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'EMAIL_IN_USE') {
          setError(t('quickStartForm.errors.emailInUse'))
        } else {
          setError(data.error || t('quickStartForm.errors.generic'))
        }
        return
      }

      // Clear referral code after successful conversion
      if (referralCode) {
        clearReferral()
      }

      navigate(`/bedankt?project=${projectId}&dienst=${serviceType}&email=${encodeURIComponent(formData.email)}`)
    } catch (err) {
      console.error('Error submitting project:', err)
      setError(t('quickStartForm.errors.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-8 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-50/40 via-blue-50/30 to-purple-50/40 dark:from-primary-900/15 dark:via-blue-900/10 dark:to-purple-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-20 w-[300px] h-[300px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto">
        {/* Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-bold mb-5 shadow-lg`}
          >
            <Sparkles className="w-4 h-4" />
            {t(`quickStartForm.services.${serviceType}`)}
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t('quickStartForm.header.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {t('quickStartForm.header.subtitle', { service: t(`quickStartForm.services.${serviceType}`) })}
          </p>
        </motion.div>

        {/* Referral Discount Banner - Enhanced */}
        {hasReferral && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/10 dark:to-purple-500/20 border-2 border-purple-200 dark:border-purple-500/30 relative overflow-hidden shadow-lg shadow-purple-500/10"
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex items-center gap-3 sm:gap-4 relative">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-purple-700 dark:text-purple-300 text-base sm:text-lg">
                  {t('quickStartForm.referral.title', '🎉 €25 korting!')}
                </p>
                <p className="text-sm text-purple-600/80 dark:text-purple-400/80 line-clamp-2">
                  {t('quickStartForm.referral.subtitle', 'Je bent uitgenodigd door een vriend en ontvangt €25 korting.')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Card - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-700 p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Subtle gradient accent at top */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                {t('quickStartForm.form.name.label')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('quickStartForm.form.name.placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base"
                required
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                {t('quickStartForm.form.company.label')} *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder={t('quickStartForm.form.company.placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                {t('quickStartForm.form.email.label')} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('quickStartForm.form.email.placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base"
                required
              />
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                {t('quickStartForm.form.phone.label')} <span className="text-gray-400 font-normal">({t('common.optional')})</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('quickStartForm.form.phone.placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                {t('quickStartForm.form.password.label')} *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('quickStartForm.form.password.placeholder')}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                {t('quickStartForm.form.password.helper')}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button - Enhanced */}
            <motion.button
              type="submit"
              disabled={!isValid || isSubmitting}
              whileHover={isValid && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={isValid && !isSubmitting ? { scale: 0.98 } : {}}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-white transition-all ${
                isValid && !isSubmitting
                  ? `bg-gradient-to-r ${config.gradient} hover:shadow-xl shadow-lg shadow-primary-500/25`
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('quickStartForm.submit.loading')}
                </>
              ) : (
                <>
                  {t('quickStartForm.submit.default')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Trust badges - Enhanced */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">{t('quickStartForm.trust.freeDesign')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">{t('quickStartForm.trust.payAfterApproval')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        {onBack && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onBack}
            className="w-full mt-4 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm"
          >
            {t('quickStartForm.back')}
          </motion.button>
        )}

        {/* What happens next - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">
            {t('quickStartForm.whatHappensNext.title')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-500/25">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">
                {t('quickStartForm.whatHappensNext.step1')}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-500/25">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">
                {t('quickStartForm.whatHappensNext.step2')}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-500/25">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">
                {t('quickStartForm.whatHappensNext.step3')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
