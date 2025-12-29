/**
 * Domain Phase Card
 * Shown after payment when domain needs to be configured
 * Features:
 * - LiveGoingWizard integration
 * - Domain status tracking
 * - DNS instructions
 * - Progress indicators
 * - Haptic feedback
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  CheckCircle2,
  Settings,
  Shield,
  Mail,
  Sparkles,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'
import LiveGoingWizard from '../LiveGoingWizard'
import type { DomainInfo, EmailInfo, LiveGoingData } from '../developer/types'

interface DomainPhaseCardProps {
  businessName: string
  domainInfo?: DomainInfo
  emailInfo?: EmailInfo
  liveGoingData?: LiveGoingData
  darkMode?: boolean
  onSaveConfig: (data: LiveGoingData) => Promise<void>
  onContactSupport?: () => void
}

type ConfigStatus = 'not_started' | 'in_progress' | 'completed'

export default function DomainPhaseCard({
  businessName,
  domainInfo,
  emailInfo,
  liveGoingData,
  darkMode = true,
  onSaveConfig,
  onContactSupport
}: DomainPhaseCardProps) {
  const { t } = useTranslation()
  const haptic = useHapticFeedback()
  const [showWizard, setShowWizard] = useState(false)

  // Determine configuration status
  const getConfigStatus = (): ConfigStatus => {
    if (!liveGoingData && !domainInfo) return 'not_started'
    if (domainInfo?.transferStatus === 'completed' && emailInfo?.emailSetupStatus === 'completed') {
      return 'completed'
    }
    return 'in_progress'
  }

  const configStatus = getConfigStatus()

  // Configuration steps
  const configSteps = [
    {
      id: 'payment',
      icon: CheckCircle2,
      label: t('phases.domain.steps.payment', 'Payment received'),
      done: true, // Always true in domain phase
      description: t('phases.domain.steps.paymentDesc', 'Your payment has been processed')
    },
    {
      id: 'domain',
      icon: Globe,
      label: t('phases.domain.steps.domain', 'Domain configuration'),
      done: domainInfo?.transferStatus === 'completed',
      current: domainInfo?.transferStatus === 'in_progress' || domainInfo?.transferStatus === 'pending',
      description: domainInfo?.domainName || t('phases.domain.steps.domainDesc', 'Configure your domain')
    },
    {
      id: 'email',
      icon: Mail,
      label: t('phases.domain.steps.email', 'Email setup'),
      done: emailInfo?.emailSetupStatus === 'completed',
      current: emailInfo?.emailSetupStatus === 'in_progress',
      description: emailInfo?.forwardingAddress || emailInfo?.currentProvider || t('phases.domain.steps.emailDesc', 'Set up business email')
    },
    {
      id: 'ssl',
      icon: Shield,
      label: t('phases.domain.steps.ssl', 'SSL certificate'),
      done: configStatus === 'completed',
      description: t('phases.domain.steps.sslDesc', 'Secure connection (HTTPS)')
    },
    {
      id: 'final',
      icon: Sparkles,
      label: t('phases.domain.steps.final', 'Final checks & go live'),
      done: false,
      description: t('phases.domain.steps.finalDesc', 'Last verifications before launch')
    }
  ]

  const handleOpenWizard = () => {
    haptic.selection()
    setShowWizard(true)
  }

  const handleSaveConfig = async (data: LiveGoingData) => {
    haptic.success()
    try {
      await onSaveConfig(data)
      setShowWizard(false)
    } catch (error) {
      console.error('Error saving config:', error)
    }
  }

  const completedSteps = configSteps.filter(s => s.done).length
  const progress = Math.round((completedSteps / configSteps.length) * 100)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border overflow-hidden ${
          darkMode 
            ? 'bg-gray-900/80 border-pink-500/30' 
            : 'bg-white border-pink-200 shadow-lg'
        }`}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-pink-500/20 p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.2),transparent_70%)]" />
          
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Globe className="w-7 h-7 text-white" />
              </motion.div>
            </div>
            
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('phases.domain.title', 'Setting up your domain')} 🌐
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('phases.domain.description', 'We\'re configuring your domain and preparing your website for launch.')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('phases.domain.progress', 'Setup progress')}
              </span>
              <span className={`text-sm font-bold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                {progress}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
              />
            </div>
          </div>

          {/* Configuration Steps */}
          <div className="space-y-2">
            {configSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    step.current
                      ? darkMode
                        ? 'bg-pink-500/10 border border-pink-500/30'
                        : 'bg-pink-50 border border-pink-200'
                      : darkMode
                        ? 'bg-gray-800/30'
                        : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    step.done 
                      ? 'bg-green-500/20' 
                      : step.current 
                        ? 'bg-pink-500/20' 
                        : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : step.current ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4 text-pink-400" />
                      </motion.div>
                    ) : (
                      <Icon className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      step.done 
                        ? darkMode ? 'text-gray-400' : 'text-gray-500'
                        : step.current 
                          ? darkMode ? 'text-white' : 'text-gray-900'
                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    {step.description && (
                      <p className={`text-xs truncate ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                    )}
                  </div>
                  {step.current && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      darkMode ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {t('phases.domain.active', 'Active')}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Configure Button */}
          {configStatus !== 'completed' && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleOpenWizard}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-pink-500/25 transition-all"
            >
              <Settings className="w-5 h-5" />
              {liveGoingData 
                ? t('phases.domain.updateConfig', 'Update configuration')
                : t('phases.domain.configure', 'Configure domain & email')
              }
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}

          {/* Domain Info Summary (if configured) */}
          {domainInfo?.domainName && (
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className={`w-5 h-5 ${darkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {domainInfo.domainName}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {domainInfo.registrar || t('phases.domain.yourDomain', 'Your domain')}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  domainInfo.transferStatus === 'completed'
                    ? 'bg-green-500/20 text-green-400'
                    : domainInfo.transferStatus === 'in_progress'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {domainInfo.transferStatus === 'completed' 
                    ? t('phases.domain.connected', 'Connected')
                    : domainInfo.transferStatus === 'in_progress'
                      ? t('phases.domain.inProgress', 'In progress')
                      : t('phases.domain.pending', 'Pending')
                  }
                </div>
              </div>
            </div>
          )}

          {/* What happens next */}
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'
          }`}>
            <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {t('phases.domain.whatNext', 'What happens next?')}
            </p>
            <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                {t('phases.domain.next1', 'We verify your domain settings')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                {t('phases.domain.next2', 'SSL certificate is automatically installed')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                {t('phases.domain.next3', 'Final checks and your website goes live! 🚀')}
              </li>
            </ul>
          </div>

          {/* Support link */}
          {onContactSupport && (
            <button
              onClick={() => {
                haptic.light()
                onContactSupport()
              }}
              className={`w-full text-center text-sm ${
                darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              } transition`}
            >
              {t('phases.domain.needHelp', 'Need help with domain configuration?')} →
            </button>
          )}
        </div>
      </motion.div>

      {/* LiveGoingWizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWizard(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            >
              <LiveGoingWizard
                businessName={businessName}
                initialData={liveGoingData}
                onSave={handleSaveConfig}
                onClose={() => setShowWizard(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
