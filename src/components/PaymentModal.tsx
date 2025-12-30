/**
 * PaymentModal Component
 * 
 * Modal for customers to complete payment after design approval.
 * Integrates with Mollie payment API.
 * 
 * Usage:
 * - Triggered via custom event 'open-payment-modal'
 * - Or by passing props directly
 * 
 * Features:
 * - Package summary display
 * - Discount code support
 * - Secure Mollie checkout redirect
 * - Mobile-optimized design
 */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  X,
  Shield,
  Lock,
  Check,
  Loader2,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Tag
} from 'lucide-react'

// Package prices (incl. BTW)
const PACKAGE_PRICES: Record<string, { name: string; monthly: number; setup: number }> = {
  starter: { name: 'Starter', monthly: 119, setup: 149 },
  professional: { name: 'Professional', monthly: 179, setup: 199 },
  business: { name: 'Business', monthly: 279, setup: 249 },
  webshop: { name: 'Webshop', monthly: 399, setup: 299 }
}

interface PaymentModalProps {
  isOpen?: boolean
  onClose?: () => void
  projectId?: string
  packageType?: string
  customerEmail?: string
  customerName?: string
  businessName?: string
  paymentUrl?: string
}

interface DiscountInfo {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description?: string
  savings: number
}

export default function PaymentModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  projectId: propProjectId,
  packageType: propPackageType,
  customerEmail: propCustomerEmail,
  customerName: propCustomerName,
  businessName: propBusinessName,
  paymentUrl: propPaymentUrl
}: PaymentModalProps) {
  const { t } = useTranslation()
  
  // State
  const [isOpen, setIsOpen] = useState(propIsOpen || false)
  const [projectId, setProjectId] = useState(propProjectId || '')
  const [packageType, setPackageType] = useState(propPackageType || 'starter')
  const [customerEmail, setCustomerEmail] = useState(propCustomerEmail || '')
  const [customerName, setCustomerName] = useState(propCustomerName || '')
  const [businessName, setBusinessName] = useState(propBusinessName || '')
  const [existingPaymentUrl, setExistingPaymentUrl] = useState(propPaymentUrl || '')
  
  // Discount state
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(null)
  const [checkingDiscount, setCheckingDiscount] = useState(false)
  const [discountError, setDiscountError] = useState('')
  
  // Payment state
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  // Package info
  const pkg = PACKAGE_PRICES[packageType] || PACKAGE_PRICES.starter
  
  // Calculate totals
  const setupFee = pkg.setup
  const monthlyFee = pkg.monthly
  const discountAmount = appliedDiscount?.savings || 0
  const totalDueNow = setupFee - discountAmount

  // Listen for custom event
  useEffect(() => {
    function handleOpenPayment(e: CustomEvent) {
      const detail = e.detail || {}
      if (detail.projectId) setProjectId(detail.projectId)
      if (detail.packageType) setPackageType(detail.packageType)
      if (detail.customerEmail) setCustomerEmail(detail.customerEmail)
      if (detail.customerName) setCustomerName(detail.customerName)
      if (detail.businessName) setBusinessName(detail.businessName)
      if (detail.paymentUrl) setExistingPaymentUrl(detail.paymentUrl)
      if (detail.discountCode) {
        setDiscountCode(detail.discountCode)
        validateDiscount(detail.discountCode)
      }
      setIsOpen(true)
    }

    window.addEventListener('open-payment-modal', handleOpenPayment as EventListener)
    return () => window.removeEventListener('open-payment-modal', handleOpenPayment as EventListener)
  }, [])

  // Sync with props
  useEffect(() => {
    if (propIsOpen !== undefined) setIsOpen(propIsOpen)
  }, [propIsOpen])

  // Close handler
  const handleClose = () => {
    setIsOpen(false)
    setError('')
    setDiscountError('')
    propOnClose?.()
  }

  // Validate discount code
  const validateDiscount = async (code?: string) => {
    const codeToCheck = code || discountCode
    if (!codeToCheck.trim()) {
      setDiscountError(t('paymentModal.discount.enterCode', 'Voer een kortingscode in'))
      return
    }

    setCheckingDiscount(true)
    setDiscountError('')

    try {
      const response = await fetch(`/api/discounts?code=${encodeURIComponent(codeToCheck)}&validate=true&amount=${setupFee}`)
      const data = await response.json()

      if (data.success && data.valid) {
        const savings = data.discount.type === 'percentage'
          ? (setupFee * data.discount.value) / 100
          : data.discount.value
        
        setAppliedDiscount({
          code: data.discount.code,
          type: data.discount.type,
          value: data.discount.value,
          description: data.discount.description,
          savings: Math.min(savings, setupFee) // Can't discount more than setup fee
        })
        setDiscountCode(data.discount.code)
        setDiscountError('')
      } else {
        setAppliedDiscount(null)
        setDiscountError(data.error || t('paymentModal.discount.invalid', 'Ongeldige kortingscode'))
      }
    } catch {
      setDiscountError(t('paymentModal.discount.error', 'Kon kortingscode niet controleren'))
    }

    setCheckingDiscount(false)
  }

  // Remove discount
  const removeDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    setDiscountError('')
  }

  // Initiate payment
  const initiatePayment = async () => {
    // If we already have a payment URL, just redirect
    if (existingPaymentUrl) {
      window.location.href = existingPaymentUrl
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          packageType,
          customer: {
            name: customerName,
            email: customerEmail,
            companyName: businessName
          },
          redirectUrl: `${window.location.origin}/project/${projectId}?payment=success`,
          discountCode: appliedDiscount?.code
        })
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Track payment initiation
        try {
          (window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({
            event: 'payment_initiated',
            projectId,
            packageType,
            amount: totalDueNow,
            discountCode: appliedDiscount?.code
          })
        } catch { /* ignore */ }

        // Redirect to Mollie checkout
        window.location.href = data.checkoutUrl
      } else {
        setError(data.error || t('paymentModal.error.general', 'Er ging iets mis. Probeer het opnieuw.'))
      }
    } catch {
      setError(t('paymentModal.error.network', 'Verbindingsfout. Controleer je internet.'))
    }

    setIsProcessing(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl modal-safe-height border-2 border-gray-200 dark:border-gray-700"
        >
          {/* Premium gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-blue-500 to-primary-500 rounded-t-xl" />
          
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-4 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* Header */}
          <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {t('paymentModal.title', 'Betaling afronden')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {businessName || t('paymentModal.subtitle', 'Beveiligde betaling')}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              aria-label={t('common.close', 'Sluiten')}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>

          <div className="p-5 space-y-5">
            {/* Package Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('paymentModal.package', 'Jouw pakket')}
                </span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-primary-500/25">
                  {pkg.name}
                </span>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('paymentModal.setupFee', 'Eenmalige opstartkosten')}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    €{setupFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('paymentModal.monthly', 'Maandelijks abonnement')}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    €{monthlyFee.toFixed(2)}/mnd
                  </span>
                </div>

                {/* Discount applied */}
                {appliedDiscount && (
                  <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                    <span className="text-sm flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      {t('paymentModal.discount.applied', 'Korting')} ({appliedDiscount.code})
                    </span>
                    <span className="font-medium">
                      -€{appliedDiscount.savings.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {t('paymentModal.dueNow', 'Nu te betalen')}
                  </span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    €{totalDueNow.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('paymentModal.monthlyNote', 'Maandabonnement start na oplevering website')}
                </p>
              </div>
            </div>

            {/* Discount Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('paymentModal.discount.label', 'Kortingscode')}
                <span className="text-gray-400 font-normal ml-1">({t('common.optional', 'optioneel')})</span>
              </label>

              {appliedDiscount ? (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        {appliedDiscount.code}
                      </span>
                      <span className="text-sm text-green-600 dark:text-green-400 ml-2">
                        -{appliedDiscount.type === 'percentage' 
                          ? `${appliedDiscount.value}%` 
                          : `€${appliedDiscount.value}`
                        }
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className="text-sm text-green-700 dark:text-green-300 hover:underline font-medium"
                  >
                    {t('paymentModal.discount.remove', 'Verwijderen')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value.toUpperCase())
                      setDiscountError('')
                    }}
                    placeholder={t('paymentModal.discount.placeholder', 'Voer code in')}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <motion.button
                    onClick={() => validateDiscount()}
                    disabled={checkingDiscount || !discountCode.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-500 dark:hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 border-2 border-gray-200 dark:border-gray-500"
                  >
                    {checkingDiscount ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t('paymentModal.discount.apply', 'Toepassen')
                    )}
                  </motion.button>
                </div>
              )}

              {discountError && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {discountError}
                </p>
              )}
            </div>

            {/* What's included */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/25">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                {t('paymentModal.included.title', 'Dit zit in je abonnement')}
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  {t('paymentModal.included.hosting', 'Hosting & SSL-certificaat')}
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  {t('paymentModal.included.maintenance', 'Onderhoud & updates')}
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  {t('paymentModal.included.support', 'Persoonlijke support')}
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  {t('paymentModal.included.changes', 'Maandelijkse wijzigingen')}
                </li>
              </ul>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl">
                <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </p>
              </div>
            )}

            {/* Pay button */}
            <motion.button
              onClick={initiatePayment}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-primary-500 via-blue-500 to-primary-500 hover:from-primary-600 hover:via-blue-600 hover:to-primary-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('paymentModal.processing', 'Doorsturen naar betaling...')}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {t('paymentModal.payNow', 'Veilig betalen met iDEAL')}
                  <ExternalLink className="w-4 h-4 ml-1" />
                </>
              )}
            </motion.button>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <Shield className="w-4 h-4" />
                <span>{t('paymentModal.secure', 'Beveiligd')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <Lock className="w-4 h-4" />
                <span>{t('paymentModal.encrypted', 'Versleuteld')}</span>
              </div>
              {/* Mollie logo */}
              <div className="flex items-center gap-1">
                <img 
                  src="https://www.mollie.com/external/icons/payment-methods/ideal.svg" 
                  alt="iDEAL" 
                  className="h-5" 
                />
              </div>
            </div>

            {/* Cancel policy note */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              {t('paymentModal.cancelNote', 'Cancel monthly after 3 months. No hidden costs.')}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Helper function to open the payment modal from anywhere
export function openPaymentModal(options: {
  projectId: string
  packageType: string
  customerEmail: string
  customerName: string
  businessName?: string
  paymentUrl?: string
  discountCode?: string
}) {
  window.dispatchEvent(new CustomEvent('open-payment-modal', { detail: options }))
}
