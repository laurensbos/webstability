import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Send, Check, Loader2, Copy, ExternalLink, Euro } from 'lucide-react'
import { createPaymentLink, formatAmount, getPackagePrice } from '../services/mollie'

interface Submission {
  id: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  package: string
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  submission: Submission | null
}

type PaymentType = 'first' | 'monthly' | 'custom'

export default function PaymentModal({ isOpen, onClose, submission }: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>('first')
  const [customAmount, setCustomAmount] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  if (!submission) return null

  const packagePrice = getPackagePrice(submission.package)

  const getAmount = (): number => {
    switch (paymentType) {
      case 'first':
      case 'monthly':
        return packagePrice
      case 'custom':
        return parseFloat(customAmount) || 0
      default:
        return packagePrice
    }
  }

  const getDescription = (): string => {
    switch (paymentType) {
      case 'first':
        return `WebStability ${submission.package} - Eerste maand - ${submission.businessName}`
      case 'monthly':
        return `WebStability ${submission.package} - Maandelijks - ${submission.businessName}`
      case 'custom':
        return customDescription || `WebStability - ${submission.businessName}`
      default:
        return `WebStability - ${submission.businessName}`
    }
  }

  const handleCreatePayment = async () => {
    const amount = getAmount()
    if (amount <= 0) {
      setError('Voer een geldig bedrag in')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await createPaymentLink({
        amount: formatAmount(amount),
        description: getDescription(),
        customerEmail: submission.contactEmail,
        customerName: submission.contactName,
        projectId: submission.id,
        packageType: submission.package,
        businessName: submission.businessName,
      })

      setPaymentLink(result.paymentUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (paymentLink) {
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSendEmail = async () => {
    if (!paymentLink) return

    const subject = encodeURIComponent(`Betaallink WebStability - ${submission.businessName}`)
    const body = encodeURIComponent(`Beste ${submission.contactName},

Bedankt voor je aanvraag bij WebStability!

Hieronder vind je de betaallink voor je ${submission.package} pakket:

💳 Betaallink: ${paymentLink}

Bedrag: €${formatAmount(getAmount())}
Omschrijving: ${getDescription()}

Na betaling gaan we direct voor je aan de slag met je website!

Heb je vragen? Reply op deze email of bel ons.

Met vriendelijke groet,
Team WebStability

---
WebStability.nl
Professionele websites voor ondernemers
`)

    window.open(`mailto:${submission.contactEmail}?subject=${subject}&body=${body}`)
  }

  const handleClose = () => {
    setPaymentLink(null)
    setError(null)
    setCopied(false)
    setPaymentType('first')
    setCustomAmount('')
    setCustomDescription('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Betaallink Versturen</h2>
                  <p className="text-sm text-gray-500">{submission.businessName}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!paymentLink ? (
                <>
                  {/* Klant Info */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Klant:</span>
                        <p className="font-medium text-gray-900">{submission.contactName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium text-gray-900 truncate">{submission.contactEmail}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Pakket:</span>
                        <p className="font-medium text-gray-900 capitalize">{submission.package}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Prijs:</span>
                        <p className="font-medium text-green-600">€{packagePrice}/maand</p>
                      </div>
                    </div>
                  </div>

                  {/* Betalingstype */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type betaling
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'first', title: 'Eerste maand', desc: `€${packagePrice} - Start abonnement` },
                        { id: 'monthly', title: 'Maandelijkse betaling', desc: `€${packagePrice} - Terugkerende betaling` },
                        { id: 'custom', title: 'Aangepast bedrag', desc: 'Voer zelf een bedrag in' },
                      ].map((option) => (
                        <label 
                          key={option.id}
                          className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentType === option.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentType"
                            value={option.id}
                            checked={paymentType === option.id}
                            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{option.title}</p>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  {paymentType === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-6 space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bedrag (€) *
                        </label>
                        <div className="relative">
                          <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            min="1"
                            step="0.01"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="99.00"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Omschrijving
                        </label>
                        <input
                          type="text"
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          placeholder="Bijv. Extra werkzaamheden, Meerwerk, etc."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Samenvatting */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Te betalen:</span>
                      <span className="text-2xl font-bold text-green-600">
                        €{formatAmount(getAmount())}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{getDescription()}</p>
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={handleCreatePayment}
                    disabled={isLoading || (paymentType === 'custom' && !customAmount)}
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Bezig met aanmaken...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Betaallink Aanmaken
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* Payment Link Created */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Betaallink Aangemaakt! 🎉
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Stuur deze link naar {submission.contactName}
                  </p>

                  {/* Payment Link */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-2 text-left">Betaallink:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={paymentLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm truncate"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`p-2 rounded-lg transition-colors ${
                          copied ? 'bg-green-100 text-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                        }`}
                        title="Kopieer link"
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                      <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-5 h-5 text-gray-600" />
                      </a>
                    </div>
                    {copied && (
                      <p className="text-sm text-green-600 mt-2">✓ Link gekopieerd!</p>
                    )}
                  </div>

                  {/* Bedrag info */}
                  <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Bedrag:</span>
                      <span className="font-semibold text-gray-900">€{formatAmount(getAmount())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-amber-600">Wacht op betaling</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleSendEmail}
                      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Verstuur via Email
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Sluiten
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
