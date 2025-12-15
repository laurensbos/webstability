import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, ArrowRight, Check } from 'lucide-react'

export default function ExitIntent() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves towards the top of the viewport
    if (e.clientY <= 0 && !hasShown) {
      setIsVisible(true)
      setHasShown(true)
    }
  }, [hasShown])

  useEffect(() => {
    // Check if already shown this session
    const shown = sessionStorage.getItem('exitIntentShown')
    if (shown) {
      setHasShown(true)
      return
    }

    // Only add listener on desktop
    if (window.innerWidth > 768) {
      document.addEventListener('mouseout', handleMouseLeave)
    }

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave)
    }
  }, [handleMouseLeave])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem('exitIntentShown', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Send to FormSubmit
    try {
      await fetch('https://formsubmit.co/ajax/info@webstability.nl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          _subject: '🎁 Nieuwe lead via Exit Intent popup!',
          type: 'Exit Intent Lead',
        }),
      })
      setIsSubmitted(true)
      setTimeout(() => {
        handleClose()
      }, 2500)
    } catch {
      // Still show success to user
      setIsSubmitted(true)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white text-center relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Sluiten"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  Wacht! Niet weggaan zonder dit...
                </h3>
                <p className="text-primary-100 text-sm">
                  Ontvang een gratis website-adviesgesprek (t.w.v. €120)
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {!isSubmitted ? (
                  <>
                    <ul className="space-y-3 mb-6">
                      {[
                        'Persoonlijk advies over je online strategie',
                        'Analyse van je huidige website (indien aanwezig)',
                        'Vrijblijvend en zonder verplichtingen',
                      ].map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-gray-600 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Je e-mailadres"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary-500/25"
                      >
                        Claim gratis adviesgesprek
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>

                    <button
                      onClick={handleClose}
                      className="w-full mt-3 py-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
                    >
                      Nee bedankt, ik hoef geen gratis advies
                    </button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Top, we nemen contact op!
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Binnen 24 uur hoor je van ons.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
