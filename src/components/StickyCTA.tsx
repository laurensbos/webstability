import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, X, Sparkles } from 'lucide-react'

export default function StickyCTA() {
  const { t } = useTranslation()
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
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-900/10 dark:shadow-black/50 safe-area-inset-bottom"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Left side - offer text */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {t('stickyCTA.priceFrom')} <span className="text-primary-600 dark:text-primary-400">€119/maand</span> <span className="text-gray-400 dark:text-gray-500 text-xs">{t('stickyCTA.inclVat')}</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t('stickyCTA.oneTime')} • {t('stickyCTA.liveIn')}
                  </p>
                </div>
              </div>

              {/* Mobile: Compact centered layout */}
              <div className="flex sm:hidden items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">
                    {t('stickyCTA.priceFrom')} <span className="text-primary-600 dark:text-primary-400">€119/maand</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                    {t('stickyCTA.oneTime')} • {t('stickyCTA.liveInShort')}
                  </p>
                </div>
              </div>

              {/* Right side - CTA buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href="/start"
                  className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                >
                  <span className="hidden sm:inline">{t('stickyCTA.startProject')}</span>
                  <span className="sm:hidden">{t('stickyCTA.startNow')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <button
                  onClick={handleDismiss}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label={t('stickyCTA.close')}
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
