/**
 * MilestoneCelebration - Viering bij belangrijke project mijlpalen
 * 
 * Toont celebratie modals met:
 * - Confetti animatie
 * - Milestone-specifieke berichten
 * - Motiverende teksten
 * - Volgende stappen
 */

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  X,
  PartyPopper,
  Rocket,
  CheckCircle2,
  Sparkles,
  Heart,
  Star,
  Trophy,
  Zap
} from 'lucide-react'

type MilestoneType = 
  | 'onboarding_complete'
  | 'design_ready'
  | 'feedback_submitted'
  | 'payment_complete'
  | 'project_approved'
  | 'website_live'
  | 'first_revision'

interface MilestoneConfig {
  type: MilestoneType
  title: string
  subtitle: string
  emoji: string
  icon: React.ReactNode
  message: string
  nextStep?: string
  confettiConfig?: {
    particleCount?: number
    spread?: number
    colors?: string[]
    duration?: number
  }
}

const MILESTONE_CONFIGS: Record<MilestoneType, MilestoneConfig> = {
  onboarding_complete: {
    type: 'onboarding_complete',
    title: 'Onboarding Voltooid!',
    subtitle: 'Je hebt alle informatie ingevuld',
    emoji: '🎉',
    icon: <CheckCircle2 className="w-8 h-8" />,
    message: 'Super! We hebben alles wat we nodig hebben om aan je website te beginnen. Je ontvangt bericht zodra het eerste design klaar is.',
    nextStep: 'We gaan nu aan de slag met je design. Dit duurt meestal 3-5 werkdagen.',
    confettiConfig: {
      particleCount: 100,
      spread: 70,
      colors: ['#8b5cf6', '#a855f7', '#22c55e']
    }
  },
  design_ready: {
    type: 'design_ready',
    title: 'Je Design is Klaar!',
    subtitle: 'Tijd om te bekijken',
    emoji: '🎨',
    icon: <Sparkles className="w-8 h-8" />,
    message: 'Geweldig nieuws! Je eerste design staat klaar om te bekijken. Neem rustig de tijd en geef je feedback.',
    nextStep: 'Bekijk het design en geef aan wat je ervan vindt met duimpjes omhoog of omlaag.',
    confettiConfig: {
      particleCount: 80,
      spread: 60,
      colors: ['#ec4899', '#f43f5e', '#8b5cf6']
    }
  },
  feedback_submitted: {
    type: 'feedback_submitted',
    title: 'Feedback Verstuurd!',
    subtitle: 'We gaan ermee aan de slag',
    emoji: '💬',
    icon: <CheckCircle2 className="w-8 h-8" />,
    message: 'Bedankt voor je feedback! We verwerken je opmerkingen zo snel mogelijk.',
    nextStep: 'Je ontvangt bericht zodra de aanpassingen klaar zijn.',
    confettiConfig: {
      particleCount: 50,
      spread: 50,
      colors: ['#06b6d4', '#0ea5e9', '#8b5cf6']
    }
  },
  payment_complete: {
    type: 'payment_complete',
    title: 'Betaling Ontvangen!',
    subtitle: 'Bedankt voor je vertrouwen',
    emoji: '💳',
    icon: <Heart className="w-8 h-8" />,
    message: 'Je betaling is succesvol verwerkt. We waarderen je vertrouwen in ons!',
    nextStep: 'Je website gaat nu naar de laatste check voor livegang.',
    confettiConfig: {
      particleCount: 100,
      spread: 80,
      colors: ['#22c55e', '#10b981', '#fbbf24']
    }
  },
  project_approved: {
    type: 'project_approved',
    title: 'Project Goedgekeurd!',
    subtitle: 'Klaar voor livegang',
    emoji: '✅',
    icon: <Trophy className="w-8 h-8" />,
    message: 'Fantastisch! Je hebt je website goedgekeurd. We maken alles klaar voor de lancering.',
    nextStep: 'Je website gaat binnen 24 uur live!',
    confettiConfig: {
      particleCount: 150,
      spread: 100,
      colors: ['#fbbf24', '#f59e0b', '#8b5cf6']
    }
  },
  website_live: {
    type: 'website_live',
    title: 'Je Website is Live!',
    subtitle: 'Gefeliciteerd! 🎊',
    emoji: '🚀',
    icon: <Rocket className="w-8 h-8" />,
    message: 'WOW! Je website is nu online en klaar om de wereld te veroveren. Deel hem met iedereen!',
    nextStep: 'We blijven je website onderhouden en up-to-date houden.',
    confettiConfig: {
      particleCount: 200,
      spread: 120,
      colors: ['#8b5cf6', '#ec4899', '#fbbf24', '#22c55e'],
      duration: 4000
    }
  },
  first_revision: {
    type: 'first_revision',
    title: 'Eerste Revisie Klaar!',
    subtitle: 'Bekijk de aanpassingen',
    emoji: '🔄',
    icon: <Zap className="w-8 h-8" />,
    message: 'De aanpassingen zijn verwerkt! Bekijk of alles naar wens is.',
    nextStep: 'Nog niet tevreden? Je kunt nog meer feedback geven.',
    confettiConfig: {
      particleCount: 60,
      spread: 50,
      colors: ['#06b6d4', '#8b5cf6']
    }
  }
}

interface MilestoneCelebrationProps {
  milestone: MilestoneType | null
  onClose: () => void
}

export default function MilestoneCelebration({
  milestone,
  onClose
}: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)

  const config = milestone ? MILESTONE_CONFIGS[milestone] : null

  // Fire confetti
  const fireConfetti = useCallback(() => {
    if (!config?.confettiConfig) return

    const { particleCount = 100, spread = 70, colors = ['#8b5cf6'], duration = 2500 } = config.confettiConfig

    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: particleCount / 10,
        angle: 60,
        spread,
        origin: { x: 0, y: 0.8 },
        colors
      })
      confetti({
        particleCount: particleCount / 10,
        angle: 120,
        spread,
        origin: { x: 1, y: 0.8 },
        colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // Initial burst from center
    confetti({
      particleCount,
      spread: spread * 1.5,
      origin: { x: 0.5, y: 0.6 },
      colors
    })

    // Side bursts
    frame()
  }, [config])

  useEffect(() => {
    if (milestone) {
      setIsVisible(true)
      // Delay confetti slightly for better effect
      const timer = setTimeout(fireConfetti, 300)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [milestone, fireConfetti])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  if (!config) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/50 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="relative p-8 text-center">
              {/* Animated emoji */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                className="text-7xl mb-4"
              >
                {config.emoji}
              </motion.div>

              {/* Icon badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex p-3 bg-purple-500/20 rounded-2xl text-purple-400 mb-4"
              >
                {config.icon}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-1"
              >
                {config.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-purple-400 font-medium mb-4"
              >
                {config.subtitle}
              </motion.p>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mb-6 leading-relaxed"
              >
                {config.message}
              </motion.p>

              {/* Next step */}
              {config.nextStep && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800/50 rounded-xl p-4 mb-6"
                >
                  <p className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    Volgende stap
                  </p>
                  <p className="text-sm text-white">
                    {config.nextStep}
                  </p>
                </motion.div>
              )}

              {/* Action button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleClose}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
              >
                <PartyPopper className="w-5 h-5" />
                Geweldig!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to manage milestone celebrations
export function useMilestoneCelebration(projectId: string) {
  const [currentMilestone, setCurrentMilestone] = useState<MilestoneType | null>(null)

  // Check if milestone was already celebrated
  const hasBeenCelebrated = (milestone: MilestoneType) => {
    const celebrated = localStorage.getItem(`milestone-${projectId}-${milestone}`)
    return celebrated === 'true'
  }

  // Mark milestone as celebrated
  const markAsCelebrated = (milestone: MilestoneType) => {
    localStorage.setItem(`milestone-${projectId}-${milestone}`, 'true')
  }

  // Trigger a celebration
  const celebrate = (milestone: MilestoneType) => {
    if (!hasBeenCelebrated(milestone)) {
      setCurrentMilestone(milestone)
      markAsCelebrated(milestone)
    }
  }

  // Close celebration
  const closeCelebration = () => {
    setCurrentMilestone(null)
  }

  // Reset all celebrations for a project (for testing)
  const resetCelebrations = () => {
    Object.keys(MILESTONE_CONFIGS).forEach(milestone => {
      localStorage.removeItem(`milestone-${projectId}-${milestone}`)
    })
  }

  return {
    currentMilestone,
    celebrate,
    closeCelebration,
    hasBeenCelebrated,
    resetCelebrations
  }
}
