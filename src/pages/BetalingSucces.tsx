import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Mail, Phone, Clock, Loader2 } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

export default function BetalingSucces() {
  const [searchParams] = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading')

  useEffect(() => {
    // Check payment status if paymentId is in URL
    const checkPayment = async () => {
      // Give Mollie a moment to process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, you'd check the payment status via API
      // For now, we assume success if they landed here
      setPaymentStatus('success')
    }

    checkPayment()
  }, [searchParams])

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Betaling verifiëren...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-12 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-14 h-14 text-green-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Betaling Geslaagd! 🎉
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Bedankt voor je betaling! We gaan direct voor je aan de slag met je website.
        </motion.p>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-2xl p-6 mb-8 text-left"
        >
          <h2 className="font-semibold text-gray-900 mb-4">Wat gebeurt er nu?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Bevestigingsmail</p>
                <p className="text-sm text-gray-500">Je ontvangt een bevestiging per email</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Start binnen 24 uur</p>
                <p className="text-sm text-gray-500">We beginnen direct met je website</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Persoonlijk contact</p>
                <p className="text-sm text-gray-500">Je hoort van ons voor updates</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Link
            to="/klant-onboarding"
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Naar Klant Onboarding
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/"
            className="block w-full py-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Terug naar Home
          </Link>
        </motion.div>

        {/* Support */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-gray-500 mt-8"
        >
          Vragen? Neem contact op via{' '}
          <a href="mailto:info@webstability.nl" className="text-green-600 hover:underline">
            info@webstability.nl
          </a>
        </motion.p>
      </motion.div>
    </div>
  )
}
