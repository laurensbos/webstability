import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MessageCircle, X, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function FloatingWhatsApp() {
  const { t } = useTranslation()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'name' | 'message'>('name')

  // Hide on developer and marketing dashboards
  const hiddenPaths = ['/developer', '/marketing', '/login', '/status']
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path))

  useEffect(() => {
    // Hide on hidden paths only
    if (shouldHide) {
      setIsVisible(false)
      return
    }

    // Show button after scrolling past hero or after 3 seconds
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    // Also show after 3 seconds regardless of scroll
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [shouldHide])

  // Show tooltip after button is visible for 2 seconds (only once)
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const timer = setTimeout(() => {
        setShowTooltip(true)
        // Hide tooltip after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isExpanded])

  const handleStartChat = () => {
    const trimmedName = name.trim()
    const trimmedMessage = message.trim() || t('floatingWhatsApp.defaultMessage')
    const whatsappMessage = `${trimmedName}: ${trimmedMessage}`
    const whatsappLink = `https://wa.me/31644712573?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappLink, '_blank', 'noopener,noreferrer')
  }

  const handleClose = () => {
    setIsExpanded(false)
    setShowTooltip(false)
    // Reset form after closing
    setTimeout(() => {
      setStep('name')
      setMessage('')
    }, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3"
        >
          {/* Tooltip/expanded message */}
          <AnimatePresence>
            {(showTooltip || isExpanded) && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 w-[300px]"
              >
                  <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t('floatingWhatsApp.chatWithUs')}</p>
                      <p className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {t('floatingWhatsApp.responseTime')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                  >
                    <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </button>
                </div>

                {isExpanded ? (
                  <div className="space-y-3">
                    {step === 'name' ? (
                      <>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {t('floatingWhatsApp.welcome')}
                        </p>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('floatingWhatsApp.namePlaceholder')}
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && name.trim()) {
                              setStep('message')
                            }
                          }}
                        />
                        <button
                          onClick={() => name.trim() && setStep('message')}
                          disabled={!name.trim()}
                          className="w-full py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:dark:bg-gray-600 text-white font-semibold rounded-xl transition shadow-lg shadow-green-500/25 disabled:shadow-none"
                        >
                          {t('floatingWhatsApp.next')}
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {t('floatingWhatsApp.helpQuestion')} <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
                        </p>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t('floatingWhatsApp.messagePlaceholder')}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 resize-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setStep('name')}
                            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition"
                          >
                            {t('floatingWhatsApp.back')}
                          </button>
                          <button
                            onClick={handleStartChat}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition shadow-lg shadow-green-500/25"
                          >
                            <Send className="w-4 h-4" />
                            {t('floatingWhatsApp.startChat')}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {t('floatingWhatsApp.greeting')}
                    </p>
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="block w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-xl transition shadow-lg shadow-green-500/25"
                    >
                      {t('floatingWhatsApp.startConversation')}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:shadow-xl">
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
