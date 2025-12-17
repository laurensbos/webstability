import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Check } from 'lucide-react'

type ConsentType = 'all' | 'necessary' | 'custom'

interface CookiePreferences {
  necessary: boolean  // Always true
  analytics: boolean
  marketing: boolean
  functional: boolean
}

const CONSENT_KEY = 'webstability_cookie_consent'
const PREFERENCES_KEY = 'webstability_cookie_preferences'

// Check if consent has been given
export const hasConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(CONSENT_KEY) !== null
}

// Get saved preferences
export const getPreferences = (): CookiePreferences => {
  if (typeof window === 'undefined') {
    return { necessary: true, analytics: false, marketing: false, functional: false }
  }
  
  try {
    const saved = localStorage.getItem(PREFERENCES_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // Ignore parse errors
  }
  
  return { necessary: true, analytics: false, marketing: false, functional: false }
}

// Check if specific category is allowed
export const isAllowed = (category: keyof CookiePreferences): boolean => {
  if (category === 'necessary') return true
  const prefs = getPreferences()
  return prefs[category]
}

interface CookieConsentProps {
  onConsentChange?: (preferences: CookiePreferences) => void
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: true,
  })

  useEffect(() => {
    // Show banner if no consent given yet
    const timer = setTimeout(() => {
      if (!hasConsent()) {
        setVisible(true)
      }
    }, 1000) // Small delay for better UX

    return () => clearTimeout(timer)
  }, [])

  const saveConsent = (type: ConsentType) => {
    let finalPreferences: CookiePreferences

    switch (type) {
      case 'all':
        finalPreferences = {
          necessary: true,
          analytics: true,
          marketing: true,
          functional: true,
        }
        break
      case 'necessary':
        finalPreferences = {
          necessary: true,
          analytics: false,
          marketing: false,
          functional: false,
        }
        break
      case 'custom':
        finalPreferences = preferences
        break
    }

    // Save to localStorage
    localStorage.setItem(CONSENT_KEY, new Date().toISOString())
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(finalPreferences))

    // Trigger callback
    onConsentChange?.(finalPreferences)

    // Initialize analytics if allowed
    if (finalPreferences.analytics) {
      initializeAnalytics()
    }

    setVisible(false)
  }

  const initializeAnalytics = () => {
    // Initialize Google Analytics, Sentry, etc. here
    // This is where you'd load tracking scripts
    console.log('Analytics initialized (consent given)')
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Main banner */}
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-start gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  {/* Mobile close button */}
                  <button
                    onClick={() => saveConsent('necessary')}
                    className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0 ml-auto"
                    aria-label="Sluiten"
                  >
                    <X className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                  </button>
                </div>
                
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Wij gebruiken cookies 🍪
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 mt-1 text-sm md:text-base">
                    We gebruiken cookies om je ervaring te verbeteren en onze website te optimaliseren. 
                    Je kunt zelf kiezen welke cookies je accepteert.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 mt-4">
                    <button
                      onClick={() => saveConsent('all')}
                      className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl sm:rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      Alles accepteren
                    </button>
                    
                    <button
                      onClick={() => saveConsent('necessary')}
                      className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl sm:rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      Alleen noodzakelijk
                    </button>
                    
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-gray-600 dark:text-slate-400 rounded-xl sm:rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center sm:justify-start gap-2 text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      Aanpassen
                    </button>
                  </div>
                </div>
                
                {/* Desktop close button */}
                <button
                  onClick={() => saveConsent('necessary')}
                  className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Sluiten"
                >
                  <X className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                </button>
              </div>
            </div>

            {/* Details panel */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 space-y-3 md:space-y-4">
                    {/* Necessary cookies */}
                    <CookieToggle
                      title="Noodzakelijke cookies"
                      description="Deze cookies zijn essentieel voor het functioneren van de website."
                      checked={true}
                      disabled={true}
                      onChange={() => {}}
                    />
                    
                    {/* Analytics cookies */}
                    <CookieToggle
                      title="Analytische cookies"
                      description="Helpen ons te begrijpen hoe bezoekers onze website gebruiken."
                      checked={preferences.analytics}
                      onChange={() => togglePreference('analytics')}
                    />
                    
                    {/* Functional cookies */}
                    <CookieToggle
                      title="Functionele cookies"
                      description="Onthouden je voorkeuren zoals taal en locatie."
                      checked={preferences.functional}
                      onChange={() => togglePreference('functional')}
                    />
                    
                    {/* Marketing cookies */}
                    <CookieToggle
                      title="Marketing cookies"
                      description="Worden gebruikt om gepersonaliseerde advertenties te tonen."
                      checked={preferences.marketing}
                      onChange={() => togglePreference('marketing')}
                    />

                    <div className="pt-2">
                      <button
                        onClick={() => saveConsent('custom')}
                        className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl sm:rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Voorkeuren opslaan
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface CookieToggleProps {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
}

const CookieToggle: React.FC<CookieToggleProps> = ({
  title,
  description,
  checked,
  disabled,
  onChange,
}) => {
  return (
    <div className="flex items-start gap-3 md:gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
      <label className="relative inline-flex items-center cursor-pointer mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className={`
          w-11 h-6 bg-gray-200 dark:bg-slate-700 rounded-full peer 
          peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
          after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
          after:bg-white after:rounded-full after:h-5 after:w-5 
          after:transition-all peer-checked:after:translate-x-full
          after:shadow-sm
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `} />
      </label>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
          {title}
          {disabled && (
            <span className="ml-2 text-xs text-gray-500 dark:text-slate-500 font-normal">(altijd aan)</span>
          )}
        </h4>
        <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">{description}</p>
      </div>
    </div>
  )
}

export default CookieConsent
