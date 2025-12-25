/**
 * ProjectTimeline - Visuele timeline van project fases
 * 
 * Toont alle fases met:
 * - Huidige status per fase
 * - Geschatte en werkelijke datums
 * - Milestone vieringen
 * - Interactieve tooltips
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  FileText,
  Palette,
  MessageSquare,
  RefreshCw,
  CreditCard,
  Globe,
  Rocket,
  ChevronDown,
  ChevronUp,
  Calendar,
  Sparkles
} from 'lucide-react'

type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'domain' | 'live'

interface PhaseData {
  key: ProjectPhase
  label: string
  description: string
  icon: React.ReactNode
  emoji: string
  estimatedDays: number // Geschatte dagen vanaf start
  tips: string[]
}

const PHASES: PhaseData[] = [
  {
    key: 'onboarding',
    label: 'Onboarding',
    description: 'We verzamelen alle informatie voor je website',
    icon: <FileText className="w-5 h-5" />,
    emoji: '📋',
    estimatedDays: 0,
    tips: ['Vul het formulier zo volledig mogelijk in', 'Upload je logo in hoge kwaliteit']
  },
  {
    key: 'design',
    label: 'Design',
    description: 'Je website wordt ontworpen',
    icon: <Palette className="w-5 h-5" />,
    emoji: '🎨',
    estimatedDays: 3,
    tips: ['We werken aan je design', 'Je ontvangt bericht zodra het klaar is']
  },
  {
    key: 'feedback',
    label: 'Feedback',
    description: 'Bekijk het design en geef feedback',
    icon: <MessageSquare className="w-5 h-5" />,
    emoji: '💬',
    estimatedDays: 5,
    tips: ['Neem de tijd om alles goed te bekijken', 'Geef specifieke feedback voor snellere aanpassingen']
  },
  {
    key: 'revisie',
    label: 'Revisie',
    description: 'We verwerken je feedback',
    icon: <RefreshCw className="w-5 h-5" />,
    emoji: '🔄',
    estimatedDays: 7,
    tips: ['Revisies worden binnen 24-48 uur verwerkt', 'Je kunt meerdere revisierondes hebben']
  },
  {
    key: 'payment',
    label: 'Betaling',
    description: 'Rond de betaling af',
    icon: <CreditCard className="w-5 h-5" />,
    emoji: '💳',
    estimatedDays: 8,
    tips: ['Betaal veilig via iDEAL of creditcard', 'Je ontvangt direct een bevestiging']
  },
  {
    key: 'domain',
    label: 'Domein',
    description: 'Domein verhuizen & configureren',
    icon: <Globe className="w-5 h-5" />,
    emoji: '🌐',
    estimatedDays: 9,
    tips: ['Vraag je autorisatiecode op bij je provider', 'We regelen de verhuizing voor je']
  },
  {
    key: 'live',
    label: 'Live!',
    description: 'Je website is online!',
    icon: <Rocket className="w-5 h-5" />,
    emoji: '🚀',
    estimatedDays: 10,
    tips: ['Deel je nieuwe website!', 'We blijven je website onderhouden']
  }
]

interface TimelineEvent {
  phase: ProjectPhase
  date?: Date
  completedAt?: Date
  status: 'completed' | 'current' | 'upcoming'
}

interface ProjectTimelineProps {
  currentPhase: ProjectPhase
  startDate?: Date
  phaseHistory?: { phase: ProjectPhase; completedAt: Date }[]
  darkMode?: boolean
  compact?: boolean
}

export default function ProjectTimeline({
  currentPhase,
  startDate = new Date(),
  phaseHistory = [],
  darkMode = true,
  compact = false
}: ProjectTimelineProps) {
  const [expandedPhase, setExpandedPhase] = useState<ProjectPhase | null>(null)
  const [isExpanded, setIsExpanded] = useState(!compact)

  // Build timeline events
  const events: TimelineEvent[] = PHASES.map(phase => {
    const historyEntry = phaseHistory.find(h => h.phase === phase.key)
    const phaseIndex = PHASES.findIndex(p => p.key === phase.key)
    const currentIndex = PHASES.findIndex(p => p.key === currentPhase)

    let status: 'completed' | 'current' | 'upcoming'
    if (historyEntry || phaseIndex < currentIndex) {
      status = 'completed'
    } else if (phase.key === currentPhase) {
      status = 'current'
    } else {
      status = 'upcoming'
    }

    // Calculate estimated date
    const estimatedDate = new Date(startDate)
    estimatedDate.setDate(estimatedDate.getDate() + phase.estimatedDays)

    return {
      phase: phase.key,
      date: estimatedDate,
      completedAt: historyEntry?.completedAt,
      status
    }
  })

  // Calculate progress
  const completedCount = events.filter(e => e.status === 'completed').length
  const currentIndex = events.findIndex(e => e.status === 'current')
  const progressPercent = ((completedCount + 0.5) / PHASES.length) * 100

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { 
      day: 'numeric', 
      month: 'short'
    })
  }

  // Get phase data
  const getPhaseData = (key: ProjectPhase) => PHASES.find(p => p.key === key)!

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl overflow-hidden ${
        darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer ${
          darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
        }`}
        onClick={() => compact && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Project Timeline
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Fase {currentIndex + 1} van {PHASES.length} • {getPhaseData(currentPhase).label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress badge */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
          }`}>
            {Math.round(progressPercent)}% compleet
          </div>

          {compact && (
            <button className={`p-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className={`h-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Timeline */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-0">
              {events.map((event, index) => {
                const phase = getPhaseData(event.phase)
                const isLast = index === events.length - 1
                const isExpandedPhase = expandedPhase === event.phase

                return (
                  <div key={event.phase} className="relative">
                    {/* Connector line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[19px] top-10 w-0.5 h-[calc(100%-16px)] ${
                          event.status === 'completed'
                            ? 'bg-gradient-to-b from-green-500 to-green-500/50'
                            : event.status === 'current'
                            ? 'bg-gradient-to-b from-purple-500 to-gray-700'
                            : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    {/* Phase item */}
                    <div
                      className={`relative flex gap-4 p-2 rounded-xl cursor-pointer transition-colors ${
                        isExpandedPhase
                          ? darkMode ? 'bg-gray-800' : 'bg-gray-50'
                          : darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setExpandedPhase(isExpandedPhase ? null : event.phase)}
                    >
                      {/* Status icon */}
                      <div className="flex-shrink-0 relative z-10">
                        {event.status === 'completed' ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/25"
                          >
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </motion.div>
                        ) : event.status === 'current' ? (
                          <motion.div
                            animate={{ 
                              boxShadow: ['0 0 0 0 rgba(168, 85, 247, 0.4)', '0 0 0 10px rgba(168, 85, 247, 0)', '0 0 0 0 rgba(168, 85, 247, 0)']
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center"
                          >
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </motion.div>
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-gray-100 border-2 border-gray-200'
                          }`}>
                            <Circle className={`w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{phase.emoji}</span>
                          <h4 className={`font-medium ${
                            event.status === 'upcoming'
                              ? darkMode ? 'text-gray-500' : 'text-gray-400'
                              : darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {phase.label}
                          </h4>
                          {event.status === 'current' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                              Nu bezig
                            </span>
                          )}
                        </div>

                        <p className={`text-sm mt-0.5 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {phase.description}
                        </p>

                        {/* Date info */}
                        <div className="flex items-center gap-3 mt-1">
                          {event.completedAt ? (
                            <span className="text-xs text-green-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Afgerond op {formatDate(event.completedAt)}
                            </span>
                          ) : event.status === 'current' ? (
                            <span className="text-xs text-purple-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              In uitvoering
                            </span>
                          ) : event.date && (
                            <span className={`text-xs flex items-center gap-1 ${
                              darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              <Calendar className="w-3 h-3" />
                              Geschat: {formatDate(event.date)}
                            </span>
                          )}
                        </div>

                        {/* Expanded tips */}
                        <AnimatePresence>
                          {isExpandedPhase && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className={`mt-3 p-3 rounded-lg ${
                                darkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'
                              }`}>
                                <p className={`text-xs font-medium mb-2 flex items-center gap-1 ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  <Sparkles className="w-3 h-3 text-yellow-500" />
                                  Tips voor deze fase
                                </p>
                                <ul className="space-y-1">
                                  {phase.tips.map((tip, i) => (
                                    <li 
                                      key={i}
                                      className={`text-xs flex items-start gap-2 ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                      }`}
                                    >
                                      <span className="text-purple-400">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Expand indicator */}
                      <div className={`flex-shrink-0 self-center ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {isExpandedPhase ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer with estimated completion */}
            <div className={`px-4 py-3 border-t ${
              darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Geschatte oplevering
                </span>
                <span className={`font-medium flex items-center gap-1 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Rocket className="w-4 h-4 text-purple-500" />
                  {formatDate(events[events.length - 1].date!)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
