/**
 * OnboardingTour - Simpele walkthrough voor nieuwe klanten
 * 
 * Altijd gecentreerde cards, mobiel-vriendelijk, voor leken geschreven
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Rocket,
  FileEdit,
  Eye,
  MessageCircle,
  PartyPopper
} from 'lucide-react'

interface TourStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  emoji: string
  tips?: string[]
}

interface OnboardingTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  projectName?: string
}

export default function OnboardingTour({
  isOpen,
  onClose,
  onComplete,
  projectName = 'je project'
}: OnboardingTourProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)

  const TOUR_STEPS: TourStep[] = [
    {
      id: 'welcome',
      title: t('onboardingTour.steps.welcome.title'),
      description: t('onboardingTour.steps.welcome.description'),
      icon: <Sparkles className="w-6 h-6" />,
      emoji: '🎉',
      tips: [
        t('onboardingTour.steps.welcome.tips.0'),
        t('onboardingTour.steps.welcome.tips.1'),
        t('onboardingTour.steps.welcome.tips.2')
      ]
    },
    {
      id: 'progress',
      title: t('onboardingTour.steps.progress.title'),
      description: t('onboardingTour.steps.progress.description'),
      icon: <Rocket className="w-6 h-6" />,
      emoji: '📊',
      tips: [
        t('onboardingTour.steps.progress.tips.0'),
        t('onboardingTour.steps.progress.tips.1'),
        t('onboardingTour.steps.progress.tips.2')
      ]
    },
    {
      id: 'onboarding',
      title: t('onboardingTour.steps.onboarding.title'),
      description: t('onboardingTour.steps.onboarding.description'),
      icon: <FileEdit className="w-6 h-6" />,
      emoji: '✏️',
      tips: [
        t('onboardingTour.steps.onboarding.tips.0'),
        t('onboardingTour.steps.onboarding.tips.1'),
        t('onboardingTour.steps.onboarding.tips.2')
      ]
    },
    {
      id: 'design',
      title: t('onboardingTour.steps.design.title'),
      description: t('onboardingTour.steps.design.description'),
      icon: <Eye className="w-6 h-6" />,
      emoji: '🎨',
      tips: [
        t('onboardingTour.steps.design.tips.0'),
        t('onboardingTour.steps.design.tips.1'),
        t('onboardingTour.steps.design.tips.2')
      ]
    },
    {
      id: 'contact',
      title: t('onboardingTour.steps.contact.title'),
      description: t('onboardingTour.steps.contact.description'),
      icon: <MessageCircle className="w-6 h-6" />,
      emoji: '💬',
      tips: [
        t('onboardingTour.steps.contact.tips.0'),
        t('onboardingTour.steps.contact.tips.1'),
        t('onboardingTour.steps.contact.tips.2')
      ]
    },
    {
      id: 'done',
      title: t('onboardingTour.steps.done.title'),
      description: t('onboardingTour.steps.done.description'),
      icon: <PartyPopper className="w-6 h-6" />,
      emoji: '🚀',
      tips: [
        t('onboardingTour.steps.done.tips.0'),
        t('onboardingTour.steps.done.tips.1'),
        t('onboardingTour.steps.done.tips.2')
      ]
    }
  ]
  
  const step = TOUR_STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TOUR_STEPS.length - 1
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isLastStep) {
          handleComplete()
        } else {
          setCurrentStep(prev => prev + 1)
        }
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        setCurrentStep(prev => prev - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isFirstStep, isLastStep])

  // Reset step when tour opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
    }
  }, [isOpen])

  const handleComplete = () => {
    localStorage.setItem('onboarding-tour-completed', 'true')
    onComplete()
    onClose()
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding-tour-skipped', 'true')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Dark overlay */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleSkip}
        />

        {/* Card - always centered */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden"
        >
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-800">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl transition-colors z-10"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Emoji & Step indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{step.emoji}</span>
                <div className="p-2.5 bg-primary-500/20 rounded-xl text-primary-400">
                  {step.icon}
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {currentStep + 1} / {TOUR_STEPS.length}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {step.title.replace('je project', projectName)}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Tips */}
            {step.tips && step.tips.length > 0 && (
              <div className="bg-gray-800/50 rounded-2xl p-4 mb-6">
                <ul className="space-y-2">
                  {step.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="text-primary-400 mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {TOUR_STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-primary-500'
                      : index < currentStep
                      ? 'w-2 bg-primary-500/50 hover:bg-primary-500/70'
                      : 'w-2 bg-gray-700 hover:bg-gray-600'
                  }`}
                  aria-label={t('onboardingTour.goToStep', { step: index + 1 })}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              {!isFirstStep && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center gap-1.5 px-4 py-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('onboardingTour.previous')}</span>
                </button>
              )}
              
              <div className="flex-1" />
              
              {!isLastStep ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex-1 sm:flex-none px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
                >
                  {t('onboardingTour.next')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  {t('onboardingTour.getStarted')}
                </button>
              )}
            </div>

            {/* Skip link - only on first few steps */}
            {currentStep < 2 && (
              <button
                onClick={handleSkip}
                className="w-full mt-4 text-center text-sm text-gray-600 hover:text-gray-400 transition-colors"
              >
                {t('onboardingTour.skip')}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook to check if tour should be shown
export function useOnboardingTour() {
  const [shouldShowTour, setShouldShowTour] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem('onboarding-tour-completed')
    const skipped = localStorage.getItem('onboarding-tour-skipped')
    
    // Show tour if not completed or skipped
    if (!completed && !skipped) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setShouldShowTour(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const resetTour = () => {
    localStorage.removeItem('onboarding-tour-completed')
    localStorage.removeItem('onboarding-tour-skipped')
    setShouldShowTour(true)
  }

  const dismissTour = () => {
    setShouldShowTour(false)
  }

  return { shouldShowTour, resetTour, dismissTour }
}
