import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Users } from 'lucide-react'

interface UrgencyBannerProps {
  onVisibilityChange?: (visible: boolean) => void
}

export default function UrgencyBanner({ onVisibilityChange }: UrgencyBannerProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [spotsLeft, setSpotsLeft] = useState(3)

  useEffect(() => {
    // Check if dismissed this session
    const dismissed = sessionStorage.getItem('urgencyBannerDismissed')
    if (!dismissed) {
      // Show immediately for better UX
      setIsVisible(true)
      onVisibilityChange?.(true)
    } else {
      onVisibilityChange?.(false)
    }
  }, [onVisibilityChange])

  useEffect(() => {
    // Randomly decrease spots occasionally for urgency
    const randomSpots = Math.floor(Math.random() * 3) + 2 // 2-4 spots
    setSpotsLeft(randomSpots)
  }, [])

  useEffect(() => {
    // Add padding to body when banner is visible
    if (isVisible) {
      document.body.style.paddingTop = '44px'
    } else {
      document.body.style.paddingTop = '0px'
    }
    return () => {
      document.body.style.paddingTop = '0px'
    }
  }, [isVisible])

  const handleDismiss = () => {
    setIsVisible(false)
    onVisibilityChange?.(false)
    sessionStorage.setItem('urgencyBannerDismissed', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-center relative">
              <div className="hidden sm:flex items-center gap-1.5 text-primary-100">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">{t('urgencyBanner.limited')}</span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-base font-medium">
                  🔥 <span className="hidden sm:inline">{t('urgencyBanner.thisMonth')}</span> {t('urgencyBanner.still')}{' '}
                  <span className="font-bold text-yellow-300">{spotsLeft} {t('urgencyBanner.spots')}</span>{' '}
                  {t('urgencyBanner.availableForProjects')}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-primary-100">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">{t('urgencyBanner.highDemand')}</span>
              </div>

              <button
                onClick={handleDismiss}
                className="absolute right-0 sm:right-0 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={t('common.close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
