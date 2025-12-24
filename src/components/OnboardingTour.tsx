/**
 * OnboardingTour - Interactieve walkthrough voor nieuwe klanten
 * 
 * Begeleidt klanten stap voor stap door het portaal:
 * 1. Welkom & overzicht
 * 2. Project status uitleg
 * 3. Taken checklist
 * 4. Design feedback geven
 * 5. Contact opnemen
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle,
  Layout,
  MessageSquare,
  FileCheck,
  HelpCircle,
  PartyPopper
} from 'lucide-react'

interface TourStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  emoji: string
  targetSelector?: string // CSS selector for highlighting element
  position: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welkom bij je project! 👋',
    description: 'Dit is je persoonlijke project portaal. Hier kun je de voortgang volgen, feedback geven en alles regelen voor je nieuwe website.',
    icon: <Sparkles className="w-6 h-6" />,
    emoji: '🎉',
    position: 'center'
  },
  {
    id: 'status',
    title: 'Project Status',
    description: 'Bovenaan zie je altijd in welke fase je project zich bevindt. Van onboarding tot live - je kunt elke stap volgen.',
    icon: <Layout className="w-6 h-6" />,
    emoji: '📊',
    targetSelector: '[data-tour="status"]',
    position: 'bottom'
  },
  {
    id: 'tasks',
    title: 'Jouw Taken',
    description: 'Hier zie je wat er van jou nodig is. Vink taken af wanneer ze klaar zijn - zo weten wij dat we verder kunnen.',
    icon: <FileCheck className="w-6 h-6" />,
    emoji: '✅',
    targetSelector: '[data-tour="tasks"]',
    position: 'right'
  },
  {
    id: 'design',
    title: 'Design Bekijken',
    description: 'Wanneer je design klaar is, kun je het hier bekijken en direct feedback geven. Simpel met duimpjes omhoog of omlaag!',
    icon: <CheckCircle className="w-6 h-6" />,
    emoji: '🎨',
    targetSelector: '[data-tour="design"]',
    position: 'left'
  },
  {
    id: 'help',
    title: 'Hulp Nodig?',
    description: 'Klik op het vraagteken voor veelgestelde vragen en tutorials. Je kunt ook altijd contact opnemen via WhatsApp of email.',
    icon: <HelpCircle className="w-6 h-6" />,
    emoji: '💡',
    targetSelector: '[data-tour="help"]',
    position: 'bottom'
  },
  {
    id: 'messages',
    title: 'Berichten & Updates',
    description: 'Je ontvangt meldingen wanneer er nieuws is over je project. Check regelmatig je notificaties!',
    icon: <MessageSquare className="w-6 h-6" />,
    emoji: '🔔',
    targetSelector: '[data-tour="notifications"]',
    position: 'bottom'
  },
  {
    id: 'done',
    title: 'Klaar om te beginnen!',
    description: 'Je weet nu hoe alles werkt. Heb je vragen? We staan altijd voor je klaar. Veel succes met je project!',
    icon: <PartyPopper className="w-6 h-6" />,
    emoji: '🚀',
    position: 'center'
  }
]

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
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  
  const step = TOUR_STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TOUR_STEPS.length - 1
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100

  // Find and highlight target element
  useEffect(() => {
    if (!isOpen || !step.targetSelector) {
      setHighlightRect(null)
      return
    }

    const targetElement = document.querySelector(step.targetSelector)
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      setHighlightRect(rect)
      
      // Scroll element into view if needed
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setHighlightRect(null)
    }
  }, [isOpen, step.targetSelector, currentStep])

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

  const handleComplete = () => {
    // Save completion to localStorage
    localStorage.setItem('onboarding-tour-completed', 'true')
    onComplete()
    onClose()
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding-tour-skipped', 'true')
    onClose()
  }

  if (!isOpen) return null

  // Calculate tooltip position based on highlight rect
  const getTooltipStyle = (): React.CSSProperties => {
    if (!highlightRect || step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    }

    const padding = 20
    const tooltipWidth = 400
    const tooltipHeight = 280

    switch (step.position) {
      case 'bottom':
        return {
          top: highlightRect.bottom + padding,
          left: Math.max(padding, Math.min(
            highlightRect.left + highlightRect.width / 2 - tooltipWidth / 2,
            window.innerWidth - tooltipWidth - padding
          )),
          transform: 'none'
        }
      case 'top':
        return {
          top: highlightRect.top - tooltipHeight - padding,
          left: Math.max(padding, Math.min(
            highlightRect.left + highlightRect.width / 2 - tooltipWidth / 2,
            window.innerWidth - tooltipWidth - padding
          )),
          transform: 'none'
        }
      case 'left':
        return {
          top: Math.max(padding, highlightRect.top + highlightRect.height / 2 - tooltipHeight / 2),
          left: highlightRect.left - tooltipWidth - padding,
          transform: 'none'
        }
      case 'right':
        return {
          top: Math.max(padding, highlightRect.top + highlightRect.height / 2 - tooltipHeight / 2),
          left: highlightRect.right + padding,
          transform: 'none'
        }
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        {/* Dark overlay with cutout for highlighted element */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="highlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {highlightRect && (
                <rect
                  x={highlightRect.left - 8}
                  y={highlightRect.top - 8}
                  width={highlightRect.width + 16}
                  height={highlightRect.height + 16}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.85)"
            mask="url(#highlight-mask)"
          />
        </svg>

        {/* Highlight ring around target element */}
        {highlightRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              borderRadius: 12,
              border: '3px solid rgb(168, 85, 247)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.1)'
            }}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute w-[90vw] max-w-[400px] bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden"
          style={getTooltipStyle()}
        >
          {/* Progress bar */}
          <div className="h-1 bg-zinc-800">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Emoji & Icon */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{step.emoji}</span>
              <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                {step.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2">
              {step.title.replace('je project', projectName)}
            </h3>

            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-4">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-6 bg-purple-500'
                      : index < currentStep
                      ? 'w-1.5 bg-purple-500/50'
                      : 'w-1.5 bg-zinc-700'
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              {!isFirstStep && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-2.5 text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Vorige
                </button>
              )}
              
              <div className="flex-1" />
              
              {!isLastStep ? (
                <>
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                  >
                    Overslaan
                  </button>
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    Volgende
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  Aan de slag!
                </button>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Keyboard hint */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">→</kbd>
            navigeren
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">Enter</kbd>
            volgende
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">Esc</kbd>
            sluiten
          </span>
        </div>
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
      }, 1000)
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
