import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Timer
} from 'lucide-react'

interface DeadlineTrackerProps {
  createdAt: string
  status: string
  estimatedCompletion?: string
  phaseDeadlines?: {
    onboarding?: string
    design?: string
    feedback?: string
    payment?: string
    live?: string
  }
  packageType?: string
}

// Standaard doorlooptijden per pakket (in werkdagen)
const PACKAGE_DURATIONS: Record<string, { design: number; feedback: number; payment: number; total: number }> = {
  starter: { design: 3, feedback: 5, payment: 2, total: 10 },
  professional: { design: 4, feedback: 7, payment: 3, total: 14 },
  business: { design: 5, feedback: 10, payment: 3, total: 18 },
  webshop: { design: 5, feedback: 14, payment: 4, total: 23 }
}

// Fase labels en iconen
const PHASE_INFO: Record<string, { label: string; icon: typeof Clock }> = {
  onboarding: { label: 'Onboarding', icon: Calendar },
  design: { label: 'Design', icon: Clock },
  feedback: { label: 'Feedback', icon: Zap },
  payment: { label: 'Betaling', icon: CheckCircle2 },
  live: { label: 'Live', icon: TrendingUp }
}

export default function DeadlineTracker({
  createdAt,
  status,
  estimatedCompletion,
  phaseDeadlines,
  packageType = 'starter'
}: DeadlineTrackerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    isOverdue: boolean
    isUrgent: boolean
  } | null>(null)

  // Bereken geschatte deadlines als ze niet meegegeven zijn
  const calculateDefaultDeadlines = () => {
    const durations = PACKAGE_DURATIONS[packageType] || PACKAGE_DURATIONS.starter
    const startDate = new Date(createdAt)
    
    // Helper om werkdagen toe te voegen
    const addWorkdays = (date: Date, days: number): Date => {
      const result = new Date(date)
      let added = 0
      while (added < days) {
        result.setDate(result.getDate() + 1)
        // Skip weekenden
        if (result.getDay() !== 0 && result.getDay() !== 6) {
          added++
        }
      }
      return result
    }
    
    const onboardingEnd = addWorkdays(startDate, 1) // 1 werkdag voor onboarding
    const designEnd = addWorkdays(onboardingEnd, durations.design)
    const feedbackEnd = addWorkdays(designEnd, durations.feedback)
    const paymentEnd = addWorkdays(feedbackEnd, durations.payment)
    
    return {
      onboarding: onboardingEnd.toISOString(),
      design: designEnd.toISOString(),
      feedback: feedbackEnd.toISOString(),
      payment: paymentEnd.toISOString(),
      live: paymentEnd.toISOString()
    }
  }

  const deadlines = phaseDeadlines || calculateDefaultDeadlines()

  // Bepaal huidige fase deadline
  const getCurrentDeadline = (): string | null => {
    switch (status) {
      case 'onboarding': return deadlines.onboarding || null
      case 'design': return deadlines.design || null
      case 'feedback': return deadlines.feedback || null
      case 'payment': return deadlines.payment || null
      case 'live': return null // Geen deadline meer
      default: return null
    }
  }

  const currentDeadline = getCurrentDeadline()

  // Update countdown timer
  useEffect(() => {
    if (!currentDeadline) {
      setTimeRemaining(null)
      return
    }

    const calculateTime = () => {
      const now = new Date()
      const deadline = new Date(currentDeadline)
      const diff = deadline.getTime() - now.getTime()
      
      const isOverdue = diff < 0
      const absDiff = Math.abs(diff)
      
      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))
      
      // Urgent = minder dan 2 dagen
      const isUrgent = !isOverdue && days < 2
      
      setTimeRemaining({ days, hours, minutes, isOverdue, isUrgent })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 60000) // Update elke minuut
    
    return () => clearInterval(interval)
  }, [currentDeadline])

  // Bereken voortgang per fase
  const getPhaseProgress = () => {
    const phases = ['onboarding', 'design', 'feedback', 'payment', 'live']
    const currentIndex = phases.indexOf(status)
    
    return phases.map((phase, index) => ({
      phase,
      label: PHASE_INFO[phase]?.label || phase,
      deadline: deadlines[phase as keyof typeof deadlines],
      status: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming'
    }))
  }

  const progress = getPhaseProgress()
  const currentPhaseInfo = PHASE_INFO[status]

  // Geen deadline tracking voor 'live' status
  if (status === 'live') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Website is Live! 🎉</h3>
            <p className="text-sm text-gray-300">Je website is succesvol gelanceerd.</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${
            timeRemaining?.isOverdue 
              ? 'bg-red-500/20' 
              : timeRemaining?.isUrgent 
                ? 'bg-amber-500/20'
                : 'bg-blue-500/20'
          }`}>
            <Timer className={`w-5 h-5 sm:w-6 sm:h-6 ${
              timeRemaining?.isOverdue 
                ? 'text-red-400' 
                : timeRemaining?.isUrgent 
                  ? 'text-amber-400'
                  : 'text-blue-400'
            }`} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">Project Timeline</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Huidige fase: {currentPhaseInfo?.label || status}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {timeRemaining && (
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            timeRemaining.isOverdue 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : timeRemaining.isUrgent 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {timeRemaining.isOverdue ? 'Vertraagd' : timeRemaining.isUrgent ? 'Bijna klaar!' : 'Op schema'}
          </div>
        )}
      </div>

      {/* Countdown Timer */}
      {timeRemaining && currentDeadline && (
        <div className={`rounded-xl p-4 mb-6 ${
          timeRemaining.isOverdue 
            ? 'bg-red-500/10 border border-red-500/30' 
            : timeRemaining.isUrgent 
              ? 'bg-amber-500/10 border border-amber-500/30'
              : 'bg-blue-500/10 border border-blue-500/30'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${
              timeRemaining.isOverdue ? 'text-red-400' : timeRemaining.isUrgent ? 'text-amber-400' : 'text-blue-400'
            }`}>
              {timeRemaining.isOverdue ? 'Overschrijding:' : 'Resterende tijd:'}
            </span>
            <span className="text-xs text-gray-500">
              Deadline: {new Date(currentDeadline).toLocaleDateString('nl-NL', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              })}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className={`text-2xl sm:text-3xl font-bold ${
                timeRemaining.isOverdue ? 'text-red-400' : 'text-white'
              }`}>
                {timeRemaining.days}
              </div>
              <div className="text-xs text-gray-400">dagen</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl sm:text-3xl font-bold ${
                timeRemaining.isOverdue ? 'text-red-400' : 'text-white'
              }`}>
                {timeRemaining.hours}
              </div>
              <div className="text-xs text-gray-400">uren</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl sm:text-3xl font-bold ${
                timeRemaining.isOverdue ? 'text-red-400' : 'text-white'
              }`}>
                {timeRemaining.minutes}
              </div>
              <div className="text-xs text-gray-400">minuten</div>
            </div>
          </div>

          {timeRemaining.isOverdue && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>We lopen iets achter - we werken eraan!</span>
            </div>
          )}
        </div>
      )}

      {/* Fase Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-700" />
        
        <div className="space-y-3">
          {progress.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center gap-3 pl-0 ${
                phase.status === 'current' ? 'opacity-100' : 
                phase.status === 'completed' ? 'opacity-70' : 'opacity-40'
              }`}
            >
              {/* Indicator */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                phase.status === 'completed' 
                  ? 'bg-green-500' 
                  : phase.status === 'current'
                    ? 'bg-blue-500 ring-4 ring-blue-500/30'
                    : 'bg-gray-700'
              }`}>
                {phase.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    phase.status === 'current' ? 'text-white' : 'text-gray-400'
                  }`}>
                    {phase.label}
                  </span>
                  {phase.deadline && (
                    <span className="text-xs text-gray-500">
                      {new Date(phase.deadline).toLocaleDateString('nl-NL', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Estimated Completion */}
      {estimatedCompletion && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Geschatte oplevering:</span>
            <span className="font-medium text-white">
              {estimatedCompletion}
            </span>
          </div>
        </div>
      )}

      {/* Package Info */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Doorlooptijd {PACKAGE_DURATIONS[packageType]?.total || 10} werkdagen
          </span>
          <span>
            Gestart: {new Date(createdAt).toLocaleDateString('nl-NL', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
