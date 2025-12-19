import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, X, Sparkles } from 'lucide-react'

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (roughly 600px)
      const shouldShow = window.scrollY > 600
      setIsVisible(shouldShow && !isDismissed)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-2xl shadow-gray-200/50 safe-area-inset-bottom"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Left side - offer text */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">
                    Start nu vanaf <span className="text-primary-600">€99/maand</span> <span className="text-gray-400 text-xs">(incl. BTW)</span>
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Eenmalig €120 • Online binnen 7 dagen
                  </p>
                </div>
              </div>

              {/* Right side - CTA buttons */}
              <div className="flex items-center gap-3">
                <a
                  href="/start"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                >
                  Start je project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <button
                  onClick={handleDismiss}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Sluiten"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
