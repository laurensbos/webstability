import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'

const recentSignups = [
  { name: 'Lisa', location: 'Amsterdam', timeKey: 'justNow' },
  { name: 'Mark', location: 'Rotterdam', timeKey: '2' },
  { name: 'Sophie', location: 'Utrecht', timeKey: '5' },
  { name: 'Jeroen', location: 'Eindhoven', timeKey: '8' },
  { name: 'Anna', location: 'Den Haag', timeKey: '12' },
  { name: 'Thomas', location: 'Groningen', timeKey: '15' },
]

export default function SocialProof() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Start showing after 5 seconds
    const initialDelay = setTimeout(() => {
      if (!isDismissed) setIsVisible(true)
    }, 5000)

    return () => clearTimeout(initialDelay)
  }, [isDismissed])

  useEffect(() => {
    if (!isVisible || isDismissed) return

    // Show each notification for 4 seconds, then hide for 2, then show next
    const showDuration = 4000
    const hideDuration = 8000

    const timer = setTimeout(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recentSignups.length)
        if (!isDismissed) setIsVisible(true)
      }, hideDuration)
    }, showDuration)

    return () => clearTimeout(timer)
  }, [isVisible, currentIndex, isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  const current = recentSignups[currentIndex]

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 sm:bottom-6 left-4 z-30 max-w-xs"
        >
          <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-4 pr-10 relative">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={t('socialProof.close')}
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-900 text-sm font-medium">
                  {current.name} {t('socialProof.from')} {current.location}
                </p>
                <p className="text-gray-500 text-xs">
                  {t('socialProof.signedUp')} • {current.timeKey === 'justNow' ? t('socialProof.times.justNow') : t('socialProof.times.minutesAgo', { count: parseInt(current.timeKey) })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
