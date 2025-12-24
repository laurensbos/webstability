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
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  Lightbulb
} from 'lucide-react'

type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live'

interface FAQItem {
  question: string
  answer: string
  phases?: ProjectPhase[] // Relevante fases, leeg = altijd tonen
}

interface Tutorial {
  id: string
  title: string
  description: string
  duration: string
  videoUrl?: string
  articleUrl?: string
  phases?: ProjectPhase[]
}

// FAQ database
const FAQ_ITEMS: FAQItem[] = [
  // Algemeen
  { 
    question: 'Hoe lang duurt het voordat mijn website klaar is?',
    answer: 'De doorlooptijd hangt af van je gekozen pakket. Starter: 5-7 werkdagen, Professioneel: 7-10 werkdagen, Business: 10-14 werkdagen. Dit is exclusief de tijd die nodig is voor jouw feedback en goedkeuring.',
    phases: []
  },
  {
    question: 'Kan ik mijn abonnement opzeggen?',
    answer: 'Ja, je kunt na de eerste 3 maanden maandelijks opzeggen met een opzegtermijn van 1 maand. De eerste 3 maanden is er een minimale looptijd.',
    phases: []
  },
  {
    question: 'Wat gebeurt er als ik opzeg?',
    answer: 'Als je opzegt, wordt je website na de opzegtermijn offline gehaald. Je ontvangt een backup van alle content. Het domein blijft van jou.',
    phases: ['live']
  },
  
  // Onboarding
  {
    question: 'Welke informatie moet ik aanleveren?',
    answer: 'We hebben nodig: je bedrijfsgegevens, logo (indien aanwezig), teksten voor de website, foto\'s van je werk/team, en je voorkeuren qua stijl en kleuren.',
    phases: ['onboarding']
  },
  {
    question: 'Ik heb nog geen logo, wat nu?',
    answer: 'Geen probleem! Je kunt apart een logo laten ontwerpen (€169) of we gebruiken een stijlvolle tekst-logo met je bedrijfsnaam.',
    phases: ['onboarding']
  },
  {
    question: 'Welk formaat moeten mijn foto\'s zijn?',
    answer: 'Lever foto\'s aan in de hoogst mogelijke kwaliteit, minimaal 1200px breed. JPG of PNG formaat. We optimaliseren ze voor het web.',
    phases: ['onboarding']
  },

  // Design & Feedback
  {
    question: 'Hoe geef ik feedback op het ontwerp?',
    answer: 'Klik op "Bekijk ontwerp" om de preview te openen. Je kunt per sectie aangeven wat je goed vindt of wat je wilt aanpassen. Wees zo specifiek mogelijk.',
    phases: ['design', 'feedback']
  },
  {
    question: 'Hoeveel revisierondes heb ik?',
    answer: 'Het aantal revisies hangt af van je pakket: Starter: 2 rondes, Professioneel: 4 rondes, Business: 6 rondes. Extra revisies kunnen worden bijgekocht.',
    phases: ['feedback', 'revisie']
  },
  {
    question: 'Wat is het verschil tussen feedback en revisie?',
    answer: 'Feedback is wanneer jij aangeeft wat je wilt veranderen. Revisie is wanneer wij die aanpassingen doorvoeren. Elke feedbackronde telt als één revisie.',
    phases: ['feedback', 'revisie']
  },

  // Betaling
  {
    question: 'Welke betaalmethodes worden geaccepteerd?',
    answer: 'We accepteren iDEAL, creditcard (Visa, Mastercard), bankoverschrijving en Klarna (betaal later).',
    phases: ['payment']
  },
  {
    question: 'Wanneer start mijn abonnement?',
    answer: 'Je maandelijkse abonnement start op de dag dat je website live gaat. De eenmalige opstartkosten betaal je vooraf.',
    phases: ['payment']
  },

  // Live
  {
    question: 'Hoe vraag ik een wijziging aan?',
    answer: 'Ga naar je dashboard en klik op "Wijziging aanvragen". Beschrijf wat je wilt veranderen en voeg eventueel een screenshot toe. We verwerken wijzigingen binnen 48 uur.',
    phases: ['live']
  },
  {
    question: 'Hoeveel wijzigingen mag ik per maand aanvragen?',
    answer: 'Dit hangt af van je pakket: Starter: 2 wijzigingen, Professioneel & Business: onbeperkt. Grote wijzigingen (nieuwe pagina\'s, functionaliteiten) worden apart geoffreerd.',
    phases: ['live']
  },
  {
    question: 'Kan ik zelf content aanpassen?',
    answer: 'Op dit moment verzorgen wij alle aanpassingen voor je. Dit garandeert dat je website er altijd professioneel uitziet. Zelf-beheer is in ontwikkeling.',
    phases: ['live']
  },
]

// Video tutorials
const TUTORIALS: Tutorial[] = [
  {
    id: 'onboarding-guide',
    title: 'Onboarding invullen',
    description: 'Stap voor stap door het onboarding formulier',
    duration: '3 min',
    phases: ['onboarding']
  },
  {
    id: 'feedback-guide',
    title: 'Feedback geven op je ontwerp',
    description: 'Hoe geef je effectieve feedback?',
    duration: '4 min',
    phases: ['design', 'feedback']
  },
  {
    id: 'preview-guide',
    title: 'De preview bekijken',
    description: 'Navigeren door je website preview',
    duration: '2 min',
    phases: ['design', 'feedback']
  },
  {
    id: 'payment-guide',
    title: 'Betaling afronden',
    description: 'Betaalmethodes en facturen uitgelegd',
    duration: '2 min',
    phases: ['payment']
  },
  {
    id: 'dashboard-guide',
    title: 'Je dashboard gebruiken',
    description: 'Overzicht van alle functies na livegang',
    duration: '5 min',
    phases: ['live']
  },
  {
    id: 'changes-guide',
    title: 'Wijzigingen aanvragen',
    description: 'Hoe vraag je aanpassingen aan?',
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
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'faq' | 'tutorials' | 'contact'>('faq')

  // Filter FAQ based on phase and search
  const filteredFAQ = FAQ_ITEMS.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPhase = !item.phases || item.phases.length === 0 || 
      item.phases.includes(currentPhase)
    
    return matchesSearch && matchesPhase
  })

  // Filter tutorials based on phase
  const filteredTutorials = TUTORIALS.filter(tutorial => {
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
            className={`fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-hidden ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <HelpCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Hulp & Support
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Hoe kunnen we je helpen?
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Zoek in hulp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${
                    darkMode 
                      ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4">
                {[
                  { id: 'faq', label: 'FAQ', icon: BookOpen },
                  { id: 'tutorials', label: 'Tutorials', icon: PlayCircle },
                  { id: 'contact', label: 'Contact', icon: MessageCircle },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? darkMode
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-blue-50 text-blue-600'
                        : darkMode
                          ? 'text-gray-400 hover:bg-gray-800'
                          : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
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
                      <p>Geen resultaten gevonden</p>
                    </div>
                  ) : (
                    filteredFAQ.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded-xl overflow-hidden ${
                          darkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === item.question ? null : item.question)}
                          className={`w-full p-4 flex items-start gap-3 text-left ${
                            darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-100'
                          } transition-colors`}
                        >
                          <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            darkMode ? 'text-amber-400' : 'text-amber-500'
                          }`} />
                          <span className={`flex-1 font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.question}
                          </span>
                          {expandedFAQ === item.question ? (
                            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          ) : (
                            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          )}
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
                      <p>Geen tutorials voor deze fase</p>
                    </div>
                  ) : (
                    filteredTutorials.map((tutorial, index) => (
                      <motion.button
                        key={tutorial.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-full p-4 rounded-xl flex items-center gap-4 text-left transition-colors ${
                          darkMode 
                            ? 'bg-gray-800 hover:bg-gray-750' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${
                          darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                        }`}>
                          <PlayCircle className="w-6 h-6 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {tutorial.title}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {tutorial.description}
                          </p>
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {tutorial.duration}
                        </div>
                      </motion.button>
                    ))
                  )}

                  {/* Coming soon notice */}
                  <div className={`mt-6 p-4 rounded-xl text-center ${
                    darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      🎬 Video tutorials komen binnenkort!
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Kom je er niet uit? Neem contact met ons op.
                  </p>

                  {/* Contact options */}
                  <div className="space-y-3">
                    <a
                      href="mailto:support@webstability.nl"
                      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-750' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          E-mail
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          support@webstability.nl
                        </p>
                      </div>
                      <ExternalLink className={`w-4 h-4 ml-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </a>

                    <a
                      href="https://wa.me/31612345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-750' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <MessageCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          WhatsApp
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Reactie binnen 4 uur
                        </p>
                      </div>
                      <ExternalLink className={`w-4 h-4 ml-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </a>

                    <a
                      href="tel:+31612345678"
                      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-750' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <Phone className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Telefoon
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Ma-Vr 9:00 - 17:00
                        </p>
                      </div>
                      <ExternalLink className={`w-4 h-4 ml-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </a>
                  </div>

                  {/* Response times */}
                  <div className={`mt-6 p-4 rounded-xl ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Reactietijden
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Starter pakket</span>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>48 uur</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Professioneel pakket</span>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>24 uur</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Business pakket</span>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>4 uur</span>
                      </div>
                    </div>
                  </div>

                  {/* Restart Tour Button */}
                  {onRestartTour && (
                    <div className={`mt-6 p-4 rounded-xl border-2 border-dashed ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h4 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Rondleiding opnieuw bekijken?
                      </h4>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        We laten je stap voor stap zien hoe alles werkt.
                      </p>
                      <button
                        onClick={() => {
                          onRestartTour()
                          onClose()
                        }}
                        className={`w-full py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                          darkMode
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        Start rondleiding
                      </button>
                    </div>
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
