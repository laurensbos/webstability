/**
 * Push Notification Toggle Component
 * 
 * Shows a toggle to enable/disable push notifications
 * with explanation and status
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, BellRing, Check, X, Loader2, Info } from 'lucide-react'
import { usePushNotifications } from '../hooks/usePushNotifications'

interface PushNotificationToggleProps {
  projectId: string
  darkMode?: boolean
  compact?: boolean
}

export default function PushNotificationToggle({
  projectId,
  darkMode = true,
  compact = false
}: PushNotificationToggleProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    error,
    toggle
  } = usePushNotifications({
    projectId,
    onSubscribed: () => {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  })

  const handleToggle = async () => {
    await toggle()
  }

  // Not supported - don't render
  if (!isSupported) {
    return null
  }

  // Compact version for settings/account
  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isSubscribed
              ? darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'
              : darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {isSubscribed ? (
              <BellRing className={`w-5 h-5 ${
                darkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
            ) : (
              <BellOff className={`w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            )}
          </div>
          <div>
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Push notificaties
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isSubscribed ? 'Ingeschakeld' : 'Uitgeschakeld'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`relative w-12 h-7 rounded-full transition-colors ${
            isSubscribed
              ? 'bg-emerald-500'
              : darkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`}
        >
          <motion.div
            animate={{ x: isSubscribed ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center"
          >
            {isLoading && (
              <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
            )}
          </motion.div>
        </button>
      </div>
    )
  }

  // Full card version
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border overflow-hidden ${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-xl flex-shrink-0 ${
            isSubscribed
              ? 'bg-gradient-to-br from-emerald-500 to-green-600'
              : darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {isSubscribed ? (
              <BellRing className="w-6 h-6 text-white" />
            ) : (
              <Bell className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Push Notificaties
                </h3>
                <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isSubscribed 
                    ? 'Je ontvangt meldingen over je project'
                    : 'Ontvang meldingen bij updates'
                  }
                </p>
              </div>
              
              {/* Toggle */}
              <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                  isSubscribed
                    ? 'bg-emerald-500'
                    : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: isSubscribed ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
                  ) : isSubscribed ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <X className="w-3 h-3 text-gray-400" />
                  )}
                </motion.div>
              </button>
            </div>
            
            {/* Features list when not subscribed */}
            {!isSubscribed && (
              <div className={`mt-3 space-y-1.5 text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Nieuwe berichten van developer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Design klaar om te bekijken</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Fase updates en website live</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
              }`}>
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Success message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Push notificaties ingeschakeld! Je ontvangt nu meldingen.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Permission denied warning */}
        {permission === 'denied' && (
          <div className={`mt-3 flex items-start gap-2 p-3 rounded-lg text-sm ${
            darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-700'
          }`}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Notificaties geblokkeerd</p>
              <p className="mt-0.5 opacity-80">
                Je hebt notificaties geblokkeerd. Ga naar je browserinstellingen om dit aan te passen.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Floating Push Notification Prompt
 * 
 * Shows a floating card prompting users to enable notifications
 */
interface PushNotificationPromptProps {
  projectId: string
  darkMode?: boolean
  delay?: number
  onDismiss?: () => void
}

export function PushNotificationPrompt({
  projectId,
  darkMode = true,
  delay = 10000,
  onDismiss
}: PushNotificationPromptProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe
  } = usePushNotifications({ projectId })

  // Show prompt after delay if not subscribed
  useState(() => {
    // Check if already dismissed in this session
    const dismissed = sessionStorage.getItem(`push_prompt_dismissed_${projectId}`)
    if (dismissed) {
      setIsDismissed(true)
      return
    }
  })

  // Show after delay
  useState(() => {
    if (!isSupported || isSubscribed || isDismissed || permission === 'denied') {
      return
    }
    
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    
    return () => clearTimeout(timer)
  })

  const handleEnable = async () => {
    const success = await subscribe()
    if (success) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem(`push_prompt_dismissed_${projectId}`, 'true')
    onDismiss?.()
  }

  if (!isSupported || isSubscribed || isDismissed || permission === 'denied') {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 md:bottom-6 right-4 z-40 max-w-sm"
        >
          <div className={`rounded-2xl shadow-2xl overflow-hidden ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Header gradient */}
            <div className="h-1.5 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />
            
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Blijf op de hoogte! 🔔
                  </h4>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ontvang direct een melding als er iets nieuws is voor je project.
                  </p>
                </div>
                
                <button
                  onClick={handleDismiss}
                  className={`p-1.5 rounded-lg transition ${
                    darkMode ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleDismiss}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Later
                </button>
                <button
                  onClick={handleEnable}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <BellRing className="w-4 h-4" />
                      Inschakelen
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
