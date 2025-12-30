/**
 * ProgressStepper Component
 * 
 * Visual progress indicator showing all project phases
 * with current state and completion status.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2,
  FileText,
  Palette,
  MessageSquare,
  RefreshCw,
  CreditCard,
  Globe,
  Rocket
} from 'lucide-react'
import type { ProjectPhase } from '../types/project'

// Phase configuration
const PHASES: { key: ProjectPhase; icon: typeof FileText }[] = [
  { key: 'onboarding', icon: FileText },
  { key: 'design', icon: Palette },
  { key: 'feedback', icon: MessageSquare },
  { key: 'revisie', icon: RefreshCw },
  { key: 'payment', icon: CreditCard },
  { key: 'domain', icon: Globe },
  { key: 'live', icon: Rocket }
]

// Phase order for comparison
const PHASE_ORDER: ProjectPhase[] = ['onboarding', 'design', 'feedback', 'revisie', 'payment', 'domain', 'live']

interface ProgressStepperProps {
  currentPhase: ProjectPhase
  progress: number
  darkMode?: boolean
  phaseColors?: {
    gradient: string
    bg: string
    text: string
    border: string
  }
}

export default function ProgressStepper({
  currentPhase,
  progress,
  darkMode = false,
  phaseColors = {
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30'
  }
}: ProgressStepperProps) {
  const { t } = useTranslation()

  // Determine phase status
  const getPhaseStatus = (phaseKey: ProjectPhase): 'completed' | 'current' | 'upcoming' => {
    const currentIndex = PHASE_ORDER.indexOf(currentPhase)
    const phaseIndex = PHASE_ORDER.indexOf(phaseKey)
    
    if (phaseIndex < currentIndex) return 'completed'
    if (phaseIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative rounded-2xl border-2 p-4 sm:p-6 overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900/80 to-gray-950/80 border-gray-800' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
      }`}
    >
      {/* Gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phaseColors.gradient}`} />
      
      {/* Progress header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('projectStatus.projectProgress')}
        </h3>
        <span className={`text-2xl font-bold bg-gradient-to-r ${phaseColors.gradient} bg-clip-text text-transparent`}>
          {progress}%
        </span>
      </div>

      {/* Large progress bar */}
      <div className={`h-3.5 rounded-full overflow-hidden mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${phaseColors.gradient} relative shadow-lg`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
        </motion.div>
      </div>

      {/* Phase steps */}
      <div className="relative">
        {/* Mobile scroll indicator */}
        <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/80 to-transparent pointer-events-none z-10 rounded-r-xl" />
        
        <div 
          className="flex items-center justify-between mb-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none gap-1 sm:gap-0 min-w-0" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {PHASES.map((phase, index) => {
            const status = getPhaseStatus(phase.key)
            const Icon = phase.icon
            const isLast = index === PHASES.length - 1
            
            return (
              <div key={phase.key} className="flex items-center flex-shrink-0 sm:flex-shrink sm:flex-1">
                <div className="flex flex-col items-center min-w-[48px] sm:min-w-0">
                  <motion.div 
                    layout
                    initial={false}
                    animate={{
                      scale: status === 'current' ? 1.1 : 1,
                      boxShadow: status === 'current' ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                      status === 'completed' ? 'bg-green-500/20 border-2 border-green-500/50' :
                      status === 'current' ? `bg-gradient-to-br ${phaseColors.gradient} ring-2 ring-white/30` :
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {status === 'completed' ? (
                        <motion.div
                          key="completed"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            status === 'current' ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <motion.span 
                    initial={false}
                    animate={{ 
                      color: status === 'completed' ? '#4ade80' : 
                             status === 'current' ? (darkMode ? '#ffffff' : '#1f2937') : 
                             (darkMode ? '#6b7280' : '#9ca3af')
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-[10px] sm:text-xs mt-2 font-medium text-center"
                  >
                    {t(`projectStatus.phases.${phase.key}`)}
                  </motion.span>
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-2 sm:mx-3 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: status === 'completed' ? '100%' : '0%' }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-green-500/70"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
