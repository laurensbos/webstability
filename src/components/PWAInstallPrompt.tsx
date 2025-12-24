/**
 * PWA Install Prompt
 * 
 * Shows a prompt to install the app as a PWA
 * Stores dismissal in localStorage
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  X, 
  Smartphone,
  Share,
  PlusSquare,
  Check
} from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAInstallPromptProps {
  darkMode?: boolean
  delay?: number // Delay before showing (ms)
}

export default function PWAInstallPrompt({
  darkMode = true,
  delay = 30000 // 30 seconds default
}: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (isInStandaloneMode) {
      setIsStandalone(true)
      return
    }

    // Check if dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      // Don't show again for 7 days after dismissal
      if (daysSinceDismissed < 7) return
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Handle beforeinstallprompt event (Chrome, Edge, Samsung Internet)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after delay
      setTimeout(() => {
        setShowPrompt(true)
      }, delay)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show manual instructions after delay
    if (isIOSDevice) {
      setTimeout(() => {
        setShowPrompt(true)
      }, delay)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [delay])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setInstalling(true)

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setInstalled(true)
        setTimeout(() => {
          setShowPrompt(false)
        }, 2000)
      }
    } catch (error) {
      console.error('PWA install error:', error)
    } finally {
      setInstalling(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
    setShowPrompt(false)
  }

  // Don't show if already standalone
  if (isStandalone) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 rounded-2xl shadow-2xl overflow-hidden ${
            darkMode 
              ? 'bg-gray-900 border border-gray-800' 
              : 'bg-white border border-gray-200'
          }`}
        >
          {/* Header */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  installed
                    ? 'bg-green-500/20'
                    : darkMode
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                      : 'bg-gradient-to-br from-blue-100 to-purple-100'
                }`}>
                  {installed ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <Smartphone className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {installed ? 'Geïnstalleerd!' : 'Installeer de app'}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {installed 
                      ? 'Je kunt nu de app gebruiken'
                      : 'Snelle toegang vanaf je startscherm'
                    }
                  </p>
                </div>
              </div>
              {!installed && (
                <button
                  onClick={handleDismiss}
                  className={`p-1.5 rounded-lg transition ${
                    darkMode 
                      ? 'hover:bg-gray-800 text-gray-500' 
                      : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {!installed && (
            <div className="p-4">
              {isIOS ? (
                // iOS manual instructions
                <div className="space-y-3">
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Voeg toe aan je startscherm:
                  </p>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-3 p-2.5 rounded-xl ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <Share className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        1. Tik op <strong>Deel</strong>
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 p-2.5 rounded-xl ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <PlusSquare className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        2. Kies <strong>Zet op beginscherm</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium ${
                      darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Begrepen
                  </button>
                </div>
              ) : (
                // Chrome/Android install button
                <div className="space-y-3">
                  <ul className={`space-y-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>Werkt offline</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>Snelle toegang</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>Push notificaties</span>
                    </li>
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDismiss}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Later
                    </button>
                    <button
                      onClick={handleInstall}
                      disabled={installing || !deferredPrompt}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition disabled:opacity-50"
                    >
                      {installing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Installeer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
