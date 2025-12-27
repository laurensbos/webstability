import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Mail, 
  Clock, 
  Palette, 
  Copy, 
  Check, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  Globe, 
  ShoppingBag, 
  Camera, 
  PenTool,
  MessageCircle,
  Sparkles,
  Shield
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'

type ServiceType = 'website' | 'webshop' | 'drone' | 'logo'

const serviceConfig = {
  website: {
    gradient: 'from-primary-500 to-blue-500',
    bgGradient: 'from-primary-500/10 via-blue-500/5 to-transparent',
    icon: Globe,
    label: 'Website',
  },
  webshop: {
    gradient: 'from-emerald-500 to-green-500',
    bgGradient: 'from-emerald-500/10 via-green-500/5 to-transparent',
    icon: ShoppingBag,
    label: 'Webshop',
  },
  drone: {
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    icon: Camera,
    label: 'Drone opnames',
  },
  logo: {
    gradient: 'from-purple-500 to-violet-500',
    bgGradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
    icon: PenTool,
    label: 'Logo ontwerp',
  },
}

export default function Bedankt() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project') || 'WS-XXXXXX'
  const dienst = (searchParams.get('dienst') as ServiceType) || 'website'
  const email = searchParams.get('email') || ''
  const [copied, setCopied] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const config = serviceConfig[dienst] || serviceConfig.website
  const ServiceIcon = config.icon

  const copyProjectId = () => {
    navigator.clipboard.writeText(projectId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Auto-advance steps on mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const steps = [
    {
      icon: Mail,
      title: t('thankYou.steps.onboarding.title'),
      description: t('thankYou.steps.onboarding.description'),
      time: t('thankYou.steps.onboarding.time'),
      color: 'bg-blue-500',
    },
    {
      icon: Clock,
      title: t('thankYou.steps.design.title'),
      description: t('thankYou.steps.design.description'),
      time: t('thankYou.steps.design.time'),
      color: 'bg-amber-500',
    },
    {
      icon: Palette,
      title: t('thankYou.steps.feedback.title'),
      description: t('thankYou.steps.feedback.description'),
      time: t('thankYou.steps.feedback.time'),
      color: 'bg-green-500',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          
          {/* Success Hero - Clean & Centered */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-8 pb-6"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="relative inline-block mb-6"
            >
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} opacity-20 blur-xl`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center shadow-2xl`}>
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </motion.div>

            {/* Service Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-medium mb-4`}
            >
              <ServiceIcon className="w-4 h-4" />
              {t(`thankYou.services.${dienst}`)}
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {t('thankYou.title')}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 text-sm sm:text-base"
            >
              {t('thankYou.subtitle')}
            </motion.p>
          </motion.div>

          {/* Project ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-5 sm:p-6 mb-6 shadow-xl`}
          >
            <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
              <Shield className="w-4 h-4" />
              <span>{t('thankYou.projectId')}</span>
            </div>
            
            <button
              onClick={copyProjectId}
              className="w-full flex items-center justify-between bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 mb-4 hover:bg-white/20 transition-colors group"
            >
              <code className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider">
                {projectId}
              </code>
              <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="text-sm">{t('thankYou.copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span className="text-sm hidden sm:inline">{t('thankYou.copy')}</span>
                  </>
                )}
              </div>
            </button>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                to={`/intake/${projectId}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                {t('thankYou.startOnboarding')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* What to expect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-5 sm:p-6 mb-6 border border-primary-100 dark:border-gray-700"
          >
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              {t('thankYou.whatToExpect')}
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">{t('thankYou.expectations.freeDesign')}</strong> — {t('thankYou.expectations.freeDesignDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">{t('thankYou.expectations.timeline')}</strong> — {t('thankYou.expectations.timelineDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">{t('thankYou.expectations.revisions')}</strong> — {t('thankYou.expectations.revisionsDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">{t('thankYou.expectations.directContact')}</strong> — {t('thankYou.expectations.directContactDesc')}</span>
              </li>
            </ul>
          </motion.div>

          {/* Timeline Steps - Swipeable on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 sm:p-6 mb-6"
          >
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm sm:text-base">
              {t('thankYou.howItWorks')}
            </h2>

            {/* Mobile: Swipe Cards */}
            <div className="sm:hidden">
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-700 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${steps[activeStep].color} flex items-center justify-center flex-shrink-0`}>
                        {(() => {
                          const StepIcon = steps[activeStep].icon
                          return <StepIcon className="w-5 h-5 text-white" />
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                            {steps[activeStep].time}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {steps[activeStep].title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                          {steps[activeStep].description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots & Navigation */}
              <div className="flex items-center justify-between mt-4">
                <button 
                  onClick={() => setActiveStep((prev) => (prev - 1 + 3) % 3)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === activeStep 
                          ? 'bg-gray-900 dark:bg-white' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setActiveStep((prev) => (prev + 1) % 3)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Desktop: Vertical Timeline */}
            <div className="hidden sm:block space-y-4">
              {steps.map((step, idx) => {
                const StepIcon = step.icon
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center z-10`}>
                        <StepIcon className="w-5 h-5 text-white" />
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-600 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                          {step.time}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Email Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 mb-6 border border-blue-100 dark:border-blue-800"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Check je inbox
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  We sturen een bevestigingsmail naar{' '}
                  {email && <span className="font-medium text-gray-900 dark:text-white">{email}</span>}
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs mt-2">
                  💡 Niet ontvangen? Check je spam folder
                </p>
              </div>
            </div>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-100 dark:border-green-800"
          >
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Vragen? Neem direct contact op!
              </p>
              <a
                href="https://wa.me/31644712573"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp ons direct
              </a>
            </div>
          </motion.div>

          {/* Project Status Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-6"
          >
            <Link
              to={`/status/${projectId}`}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Of bekijk direct je project status →
            </Link>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
