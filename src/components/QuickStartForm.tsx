import { useState } from 'react'
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
  User
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getReferralCode, clearReferral } from '../hooks/useReferralCapture'

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-medium mb-4`}>
            <Sparkles className="w-4 h-4" />
            {t(`quickStartForm.services.${serviceType}`)}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('quickStartForm.header.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {t('quickStartForm.header.subtitle', { service: t(`quickStartForm.services.${serviceType}`) })}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8"
        >
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all ${
                isValid && !isSubmitting
                  ? `bg-gradient-to-r ${config.gradient} hover:shadow-lg hover:scale-[1.02]`
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
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span>{t('quickStartForm.trust.freeDesign')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span>{t('quickStartForm.trust.payAfterApproval')}</span>
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

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
            {t('quickStartForm.whatHappensNext.title')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('quickStartForm.whatHappensNext.step1')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('quickStartForm.whatHappensNext.step2')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('quickStartForm.whatHappensNext.step3')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
