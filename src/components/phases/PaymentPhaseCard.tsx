/**
 * Payment Phase Card
 * Shown when design is approved and payment is pending
 * Features:
 * - Payment status display
 * - Invoice overview
 * - Secure payment button
 * - Package summary
 * - Haptic feedback
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Shield,
  Lock,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Gift,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

interface Invoice {
  id: string
  description: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  date: string
  dueDate?: string
  paidAt?: string
  paymentUrl?: string
}

interface PaymentPhaseCardProps {
  businessName: string
  packageName: string
  monthlyPrice: number
  setupFee?: number
  paymentUrl?: string
  paymentStatus: 'pending' | 'paid' | 'overdue'
  invoices?: Invoice[]
  darkMode?: boolean
  onPayNow?: () => void
  onContactSupport?: () => void
}

export default function PaymentPhaseCard({
  packageName,
  monthlyPrice,
  setupFee = 149,
  paymentUrl,
  paymentStatus,
  invoices = [],
  darkMode = true,
  onPayNow,
  onContactSupport
}: PaymentPhaseCardProps) {
  const { t } = useTranslation()
  const haptic = useHapticFeedback()
  const [showInvoices, setShowInvoices] = useState(false)

  const isPaid = paymentStatus === 'paid'
  const isOverdue = paymentStatus === 'overdue'

  const handlePayClick = () => {
    haptic.success()
    if (paymentUrl) {
      window.open(paymentUrl, '_blank')
    }
    onPayNow?.()
  }

  // What's included in package
  const packageFeatures = [
    { icon: Zap, label: t('phases.payment.features.hosting', 'Hosting & SSL included') },
    { icon: Shield, label: t('phases.payment.features.maintenance', 'Maintenance & updates') },
    { icon: Gift, label: t('phases.payment.features.support', 'Personal support') },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode 
          ? 'bg-gray-900/80 border-purple-500/30' 
          : 'bg-white border-purple-200 shadow-lg'
      }`}
    >
      {/* Header */}
      <div className={`p-5 relative overflow-hidden ${
        isPaid 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20'
          : isOverdue
            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20'
            : 'bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20'
      }`}>
        <div className={`absolute inset-0 ${
          isPaid 
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.2),transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.2),transparent_70%)]'
        }`} />
        
        <div className="relative flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            isPaid 
              ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/25'
              : isOverdue
                ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/25'
                : 'bg-gradient-to-br from-purple-500 to-indigo-500 shadow-purple-500/25'
          }`}>
            {isPaid ? (
              <CheckCircle2 className="w-7 h-7 text-white" />
            ) : (
              <CreditCard className="w-7 h-7 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {isPaid 
                ? t('phases.payment.titlePaid', 'Payment received! ✓')
                : isOverdue
                  ? t('phases.payment.titleOverdue', 'Payment overdue')
                  : t('phases.payment.title', 'Complete your payment')
              }
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isPaid 
                ? t('phases.payment.descriptionPaid', 'We\'re preparing to take your website live!')
                : t('phases.payment.description', 'Your design is approved! Complete the payment to go live.')
              }
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Payment Summary */}
        {!isPaid && (
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('phases.payment.packageLabel', 'Your package')}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
              }`}>
                {packageName}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('phases.payment.setupFee', 'One-time setup')}
                </span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  €{setupFee.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('phases.payment.monthly', 'Monthly subscription')}
                </span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  €{monthlyPrice.toFixed(2)}/mo
                </span>
              </div>
            </div>

            <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('phases.payment.dueNow', 'Due now')}
                </span>
                <span className={`text-xl font-bold ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  €{setupFee.toFixed(2)}
                </span>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('phases.payment.monthlyStarts', 'Monthly subscription starts after website is live')}
              </p>
            </div>
          </div>
        )}

        {/* Payment Button */}
        {!isPaid && paymentUrl && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handlePayClick}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg ${
              isOverdue
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-red-500/25'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-purple-500/25'
            }`}
          >
            <Lock className="w-5 h-5" />
            {t('phases.payment.payNow', 'Pay securely with iDEAL')}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}

        {/* Trust badges */}
        {!isPaid && (
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <Shield className={`w-4 h-4 ${darkMode ? 'text-green-500' : 'text-green-600'}`} />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {t('phases.payment.secure', 'Secure')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Lock className={`w-4 h-4 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`} />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {t('phases.payment.encrypted', 'Encrypted')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 className={`w-4 h-4 ${darkMode ? 'text-purple-500' : 'text-purple-600'}`} />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Mollie
              </span>
            </div>
          </div>
        )}

        {/* Package Features - Always visible */}
        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-800/30 border border-gray-800' : 'bg-gray-50'
        }`}>
          <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {t('phases.payment.included', 'Included in your subscription')}
          </p>
          <div className="space-y-2">
            {packageFeatures.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feature.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Invoices Section */}
        {invoices.length > 0 && (
          <div className={`rounded-xl overflow-hidden ${
            darkMode ? 'bg-gray-800/30 border border-gray-800' : 'bg-gray-50 border border-gray-200'
          }`}>
            <button
              onClick={() => {
                haptic.light()
                setShowInvoices(!showInvoices)
              }}
              className={`w-full p-4 flex items-center justify-between ${
                darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
              } transition`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('phases.payment.invoices', 'Invoices')} ({invoices.length})
                </span>
              </div>
              {showInvoices ? (
                <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              ) : (
                <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              )}
            </button>
            
            <AnimatePresence>
              {showInvoices && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {invoices.map((invoice) => (
                      <div 
                        key={invoice.id}
                        className={`p-4 flex items-center justify-between ${
                          darkMode ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            invoice.status === 'paid' 
                              ? 'bg-green-500/20' 
                              : invoice.status === 'overdue' 
                                ? 'bg-red-500/20' 
                                : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            {invoice.status === 'paid' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : invoice.status === 'overdue' ? (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            ) : (
                              <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {invoice.description}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(invoice.date).toLocaleDateString('nl-NL')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            €{invoice.amount.toFixed(2)}
                          </span>
                          {invoice.status !== 'paid' && invoice.paymentUrl && (
                            <a
                              href={invoice.paymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
                              onClick={() => haptic.success()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Success message when paid */}
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl ${
              darkMode 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <Sparkles className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              <div>
                <p className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  {t('phases.payment.thankYou', 'Thank you for your payment!')}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('phases.payment.nextSteps', 'We\'ll now configure your domain and prepare for launch.')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

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
            {t('phases.payment.questions', 'Questions about payment?')} →
          </button>
        )}
      </div>
    </motion.div>
  )
}
