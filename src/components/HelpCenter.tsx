/**
 * HelpCenter - FAQ en tutorials voor klanten
 * 
 * Slide-over panel met:
 * - FAQ per fase
 * - Video tutorials
 * - Contact opties
 * - Zoekfunctie
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  HelpCircle,
  Search,
  ChevronDown,
  PlayCircle,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  Lightbulb
} from 'lucide-react'

type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'domain' | 'live'

interface FAQItem {
  key: string
  phases?: ProjectPhase[] // Relevante fases, leeg = altijd tonen
}

interface Tutorial {
  id: string
  key: string
  duration: string
  videoUrl?: string
  articleUrl?: string
  phases?: ProjectPhase[]
}

// FAQ keys - translations are in locale files
const FAQ_KEYS: FAQItem[] = [
  // Algemeen
  { key: 'howLong', phases: [] },
  { key: 'cancel', phases: [] },
  { key: 'whatHappens', phases: ['live'] },
  
  // Onboarding
  { key: 'whatInfo', phases: ['onboarding'] },
  { key: 'noLogo', phases: ['onboarding'] },
  { key: 'photoFormat', phases: ['onboarding'] },

  // Design & Feedback
  { key: 'howFeedback', phases: ['design', 'feedback'] },
  { key: 'revisionRounds', phases: ['feedback', 'revisie'] },
  { key: 'feedbackVsRevision', phases: ['feedback', 'revisie'] },

  // Betaling
  { key: 'paymentMethods', phases: ['payment'] },
  { key: 'subscriptionStart', phases: ['payment'] },

  // Live
  { key: 'requestChange', phases: ['live'] },
  { key: 'changesPerMonth', phases: ['live'] },
  { key: 'selfEdit', phases: ['live'] },
]

// Tutorial keys - translations are in locale files
const TUTORIAL_KEYS: Tutorial[] = [
  {
    id: 'onboarding-guide',
    key: 'onboardingGuide',
    duration: '3 min',
    phases: ['onboarding']
  },
  {
    id: 'feedback-guide',
    key: 'feedbackGuide',
    duration: '4 min',
    phases: ['design', 'feedback']
  },
  {
    id: 'preview-guide',
    key: 'previewGuide',
    duration: '2 min',
    phases: ['design', 'feedback']
  },
  {
    id: 'payment-guide',
    key: 'paymentGuide',
    duration: '2 min',
    phases: ['payment']
  },
  {
    id: 'dashboard-guide',
    key: 'dashboardGuide',
    duration: '5 min',
    phases: ['live']
  },
  {
    id: 'changes-guide',
    key: 'changesGuide',
    duration: '3 min',
    phases: ['live']
  },
]

interface HelpCenterProps {
  isOpen: boolean
  onClose: () => void
  currentPhase?: ProjectPhase
  darkMode?: boolean
  onRestartTour?: () => void // Callback to restart onboarding tour
}

export default function HelpCenter({
  isOpen,
  onClose,
  currentPhase = 'onboarding',
  darkMode = true,
  onRestartTour
}: HelpCenterProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'faq' | 'tutorials' | 'contact'>('faq')

  // Get translated FAQ items
  const getTranslatedFAQ = () => FAQ_KEYS.map(item => ({
    ...item,
    question: t(`helpCenter.faq.${item.key}.question`),
    answer: t(`helpCenter.faq.${item.key}.answer`)
  }))

  // Get translated tutorials
  const getTranslatedTutorials = () => TUTORIAL_KEYS.map(tutorial => ({
    ...tutorial,
    title: t(`helpCenter.tutorials.${tutorial.key}.title`),
    description: t(`helpCenter.tutorials.${tutorial.key}.description`)
  }))

  // Filter FAQ based on phase and search
  const filteredFAQ = getTranslatedFAQ().filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPhase = !item.phases || item.phases.length === 0 || 
      item.phases.includes(currentPhase)
    
    return matchesSearch && matchesPhase
  })

  // Filter tutorials based on phase
  const filteredTutorials = getTranslatedTutorials().filter(tutorial => {
    const matchesSearch = searchQuery === '' ||
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPhase = !tutorial.phases || tutorial.phases.length === 0 ||
      tutorial.phases.includes(currentPhase)
    
    return matchesSearch && matchesPhase
  })

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setExpandedFAQ(null)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-hidden border-l-2 ${
              darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}
          >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-primary-500 to-purple-500" />
            
            {/* Header */}
            <div className={`p-4 pt-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t('helpCenter.title')}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('helpCenter.subtitle')}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className={`p-2.5 rounded-xl border-2 transition-colors ${
                    darkMode ? 'hover:bg-gray-800 text-gray-400 border-gray-700' : 'hover:bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder={t('helpCenter.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm ${
                    darkMode 
                      ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700' 
                      : 'bg-white text-gray-900 placeholder-gray-400 border-gray-200'
                  } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4">
                {[
                  { id: 'faq', labelKey: 'helpCenter.tabs.faq', icon: BookOpen },
                  { id: 'tutorials', labelKey: 'helpCenter.tabs.tutorials', icon: PlayCircle },
                  { id: 'contact', labelKey: 'helpCenter.tabs.contact', icon: MessageCircle },
                ].map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? darkMode
                          ? 'bg-gradient-to-r from-primary-500/20 to-blue-500/20 text-primary-400 shadow-lg shadow-primary-500/20 border-2 border-primary-500/30'
                          : 'bg-gradient-to-r from-primary-50 to-blue-50 text-primary-600 shadow-lg shadow-primary-500/20 border-2 border-primary-200'
                        : darkMode
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300 border-2 border-transparent'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-2 border-transparent'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t(tab.labelKey)}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100%-200px)] p-4">
              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="space-y-2">
                  {filteredFAQ.length === 0 ? (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{t('helpCenter.noResults')}</p>
                    </div>
                  ) : (
                    filteredFAQ.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                        className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                          expandedFAQ === item.question
                            ? darkMode 
                              ? 'bg-gradient-to-br from-gray-800 to-gray-850 border-amber-500/30 shadow-lg shadow-amber-500/10' 
                              : 'bg-gradient-to-br from-amber-50/50 to-white border-amber-200 shadow-lg shadow-amber-500/10'
                            : darkMode 
                              ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600' 
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === item.question ? null : item.question)}
                          className={`w-full p-4 flex items-start gap-3 text-left transition-colors`}
                        >
                          <div className={`p-2 rounded-xl transition-all ${
                            expandedFAQ === item.question
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30'
                              : darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
                          }`}>
                            <Lightbulb className={`w-4 h-4 flex-shrink-0 ${
                              expandedFAQ === item.question ? 'text-white' : darkMode ? 'text-amber-400' : 'text-amber-600'
                            }`} />
                          </div>
                          <span className={`flex-1 font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.question}
                          </span>
                          <motion.div
                            animate={{ rotate: expandedFAQ === item.question ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          >
                            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedFAQ === item.question && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className={`px-4 pb-4 pl-12 text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {item.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Tutorials Tab */}
              {activeTab === 'tutorials' && (
                <div className="space-y-3">
                  {filteredTutorials.length === 0 ? (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <PlayCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{t('helpCenter.noTutorials')}</p>
                    </div>
                  ) : (
                    filteredTutorials.map((tutorial, index) => (
                      <motion.button
                        key={tutorial.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all duration-200 border-2 ${
                          darkMode 
                            ? 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10' 
                            : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10'
                        }`}
                      >
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                          <PlayCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {tutorial.title}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {tutorial.description}
                          </p>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-lg ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tutorial.duration}
                        </div>
                      </motion.button>
                    ))
                  )}

                  {/* Coming soon notice */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`mt-6 p-4 rounded-2xl text-center border-2 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30' 
                        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                    }`}
                  >
                    <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {t('helpCenter.tutorialsComingSoon')}
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('helpCenter.contactIntro')}
                  </p>

                  {/* Contact options */}
                  <div className="space-y-3">
                    <motion.a
                      href="mailto:support@webstability.nl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border-2 ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10' 
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10'
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('helpCenter.contactMethods.email.title')}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('helpCenter.contactMethods.email.value')}
                        </p>
                      </div>
                      <ExternalLink className={`w-4 h-4 ml-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </motion.a>

                    <motion.a
                      href="https://wa.me/31612345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border-2 ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700/50 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10' 
                          : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/10'
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('helpCenter.contactMethods.whatsapp.title')}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('helpCenter.contactMethods.whatsapp.description')}
                        </p>
                      </div>
                      <ExternalLink className={`w-4 h-4 ml-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </motion.a>

                    <motion.a
                      href="tel:+31612345678"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border-2 ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10' 
                          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10'
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('helpCenter.contactMethods.phone.title')}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('helpCenter.contactMethods.phone.description')}
                        </p>
                      </div>
                      <ExternalLink className={`w-4 h-4 ml-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </motion.a>
                  </div>

                  {/* Response times */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`mt-6 p-4 rounded-2xl border-2 ${
                      darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t('helpCenter.responseTimes.title')}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{t('helpCenter.responseTimes.starter')}</span>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{t('helpCenter.responseTimes.starterTime')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{t('helpCenter.responseTimes.professional')}</span>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{t('helpCenter.responseTimes.professionalTime')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{t('helpCenter.responseTimes.business')}</span>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{t('helpCenter.responseTimes.businessTime')}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Restart Tour Button */}
                  {onRestartTour && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className={`mt-6 p-5 rounded-2xl border-2 border-dashed ${
                        darkMode ? 'border-purple-500/30 bg-purple-500/5' : 'border-purple-200 bg-purple-50/50'
                      }`}
                    >
                      <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('helpCenter.tour.title')}
                      </h4>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('helpCenter.tour.description')}
                      </p>
                      <motion.button
                        onClick={() => {
                          onRestartTour()
                          onClose()
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
                      >
                        <BookOpen className="w-4 h-4" />
                        {t('helpCenter.tour.button')}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
