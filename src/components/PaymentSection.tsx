import { motion } from 'framer-motion'
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Rocket, 
  Shield, 
  Lock,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'
import { packages } from '../config/company'

interface PaymentSectionProps {
  projectId: string
  packageType: string
  paymentStatus: 'pending' | 'awaiting_payment' | 'paid' | 'failed'
  paymentUrl?: string
  designApprovedAt?: string
  onPaymentInitiated?: () => void
}

export default function PaymentSection({
  projectId,
  packageType,
  paymentStatus,
  paymentUrl,
  designApprovedAt,
  onPaymentInitiated
}: PaymentSectionProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Vind het pakket
  const pkg = packages[packageType as keyof typeof packages] || packages.professional

  const initiatePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          packageType,
          type: 'subscription'
        })
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Redirect naar Mollie checkout
        window.location.href = data.checkoutUrl
        onPaymentInitiated?.()
      } else {
        setError(data.error || 'Er ging iets mis bij het aanmaken van de betaling.')
      }
    } catch (err) {
      console.error('Payment initiation error:', err)
      setError('Kon geen verbinding maken met de betaalserver.')
    }

    setLoading(false)
  }

  // Al betaald - toon succes
  if (paymentStatus === 'paid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6 md:p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">Betaling ontvangen!</h3>
            <p className="text-green-700">Je website gaat binnenkort live</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3 text-green-800">
            <Rocket className="w-5 h-5" />
            <p className="font-medium">
              We zetten je website nu online. Je ontvangt een e-mail zodra alles klaar is!
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // Wacht op goedkeuring design
  if (paymentStatus === 'pending' && !designApprovedAt) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 md:p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900">Wacht op goedkeuring</h3>
            <p className="text-amber-700">Keur eerst het design goed om verder te gaan</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
          <p className="text-amber-800">
            Bekijk de design preview hierboven en klik op <strong>"Goedkeuren"</strong> als je tevreden bent. 
            Daarna kun je betalen en gaat je website live.
          </p>
        </div>
      </motion.div>
    )
  }

  // Betaling mislukt
  if (paymentStatus === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border-2 border-red-200 p-6 md:p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900">Betaling niet gelukt</h3>
            <p className="text-red-700">Probeer het opnieuw of neem contact op</p>
          </div>
        </div>

        <motion.button
          onClick={initiatePayment}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-red-500/25"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Opnieuw proberen
            </>
          )}
        </motion.button>
      </motion.div>
    )
  }

  // Design goedgekeurd - toon betaaloptie
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-6 md:p-8 overflow-hidden relative"
    >
      {/* Decoratieve elementen */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Klaar om live te gaan!</h3>
            <p className="text-gray-600">Start je abonnement en we zetten je website online</p>
          </div>
        </div>

        {/* Design goedgekeurd badge */}
        <div className="flex items-center gap-2 mb-6 text-green-700 bg-green-100 rounded-lg px-3 py-2 w-fit">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">Design goedgekeurd</span>
        </div>

        {/* Pakket info */}
        <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{pkg.name} Pakket</h4>
              <p className="text-gray-600 text-sm">{pkg.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">€{pkg.priceInclVat.toFixed(2)}</p>
              <p className="text-xs text-gray-500">per maand incl. BTW</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {pkg.features.slice(0, 6).map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Betaal knop */}
        {paymentUrl ? (
          <a
            href={paymentUrl}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
          >
            <CreditCard className="w-5 h-5" />
            Doorgaan naar betaling
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <motion.button
            onClick={initiatePayment}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-blue-500/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Moment geduld...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Start abonnement & ga live
              </>
            )}
          </motion.button>
        )}

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Lock className="w-4 h-4" />
            <span>Veilig betalen</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Shield className="w-4 h-4" />
            <span>Maandelijks opzegbaar</span>
          </div>
        </div>

        {/* Betaalmethodes */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-xs text-gray-500">Betaal met:</span>
          <div className="flex items-center gap-2">
            <img src="https://www.mollie.com/external/icons/payment-methods/ideal.svg" alt="iDEAL" className="h-6" />
            <img src="https://www.mollie.com/external/icons/payment-methods/creditcard.svg" alt="Creditcard" className="h-6" />
            <img src="https://www.mollie.com/external/icons/payment-methods/bancontact.svg" alt="Bancontact" className="h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
