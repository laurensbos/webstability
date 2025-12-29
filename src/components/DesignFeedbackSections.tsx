/**
 * DesignFeedbackSections - Section-based feedback for non-technical users
 * 
 * Simple flow:
 * 1. View the design in iframe
 * 2. Give feedback per section (👍/👎)
 * 3. Optionally add comments
 * 4. Submit or approve
 * 
 * Features:
 * - Swipe navigation between sections
 * - Haptic feedback on interactions
 * - Auto-save progress to localStorage
 */

import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  X,
  Monitor,
  Smartphone,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Send,
  MessageSquare,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Clock,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save
} from 'lucide-react'
import { AVAILABLE_FEEDBACK_QUESTIONS } from '../types/project'
import type { FeedbackQuestionAnswer } from '../types/project'
import { useHapticFeedback } from '../hooks/useHapticFeedback'
import { useSwipeNavigation } from '../hooks/useSwipeNavigation'
import { useProgressPersistence } from '../hooks/useProgressPersistence'

// Section IDs and icons (translations loaded dynamically)
const SECTION_IDS = ['hero', 'about', 'services', 'features', 'testimonials', 'contact', 'footer'] as const
const SECTION_ICONS: Record<string, string> = {
  hero: '🏠',
  about: '👋',
  services: '⭐',
  features: '✨',
  testimonials: '💬',
  contact: '📞',
  footer: '📋',
}

// Preset IDs and emojis (translations loaded dynamically)
const PRESET_IDS = ['colors', 'text', 'image', 'layout', 'font', 'size', 'remove', 'spacing'] as const
const PRESET_EMOJIS: Record<string, string> = {
  colors: '🎨',
  text: '�',
  image: '📷',
  layout: '�',
  font: '🔤',
  size: '📏',
  remove: '🗑️',
  spacing: '↔️',
}

interface SectionFeedback {
  sectionId: string
  rating: 'good' | 'change' | null
  comment: string
  presets: string[]
}

interface Section {
  id: string
  name: string
  description: string
  icon: string
}

interface FeedbackPreset {
  id: string
  label: string
  emoji: string
  description: string
}

interface DesignFeedbackSectionsProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  designPreviewUrl: string
  sections?: Section[]
  onFeedbackSubmit?: () => Promise<void>
  onApprove?: () => Promise<void>
  feedbackQuestionIds?: string[]
  customQuestions?: string[]
}

export default function DesignFeedbackSections({
  isOpen,
  onClose,
  projectId,
  designPreviewUrl,
  sections: sectionsProp,
  onFeedbackSubmit,
  onApprove,
  feedbackQuestionIds = [],
  customQuestions = []
}: DesignFeedbackSectionsProps) {
  const { t } = useTranslation()
  
  // Build translated sections
  const DEFAULT_SECTIONS: Section[] = useMemo(() => SECTION_IDS.map(id => ({
    id,
    name: t(`designFeedback.sections.${id}.name`),
    description: t(`designFeedback.sections.${id}.description`),
    icon: SECTION_ICONS[id]
  })), [t])

  // Build translated presets
  const FEEDBACK_PRESETS: FeedbackPreset[] = useMemo(() => PRESET_IDS.map(id => ({
    id,
    label: t(`designFeedback.presets.${id}.label`),
    emoji: PRESET_EMOJIS[id],
    description: t(`designFeedback.presets.${id}.description`)
  })), [t])

  // Use prop sections or defaults
  const sections = sectionsProp || DEFAULT_SECTIONS

  // Haptic feedback for mobile interactions
  const haptic = useHapticFeedback()
  
  // Progress persistence - auto-save feedback to localStorage
  const {
    data: savedProgress,
    setData: saveProgress,
    wasRestored,
    clearProgress,
    lastSaved,
    hasUnsavedChanges
  } = useProgressPersistence<{
    sectionFeedback: SectionFeedback[]
    generalComment: string
    questionAnswers: FeedbackQuestionAnswer[]
    currentSectionIndex: number
    step: 'intro' | 'sections' | 'questions' | 'summary'
  }>({
    key: 'feedback_progress',
    projectId: designPreviewUrl, // Use URL as unique project identifier
    initialData: {
      sectionFeedback: sections.map((s: Section) => ({ sectionId: s.id, rating: null, comment: '', presets: [] })),
      generalComment: '',
      questionAnswers: [],
      currentSectionIndex: 0,
      step: 'intro'
    },
    version: 1,
    debounceMs: 500
  })

  // Debug: log incoming questions
  console.log('[DesignFeedbackSections] RECEIVED PROPS:')
  console.log('  - feedbackQuestionIds:', JSON.stringify(feedbackQuestionIds))
  console.log('  - customQuestions:', JSON.stringify(customQuestions))
  console.log('  - AVAILABLE_FEEDBACK_QUESTIONS:', AVAILABLE_FEEDBACK_QUESTIONS.map(q => q.id))
  
  // Device state
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [isMobile, setIsMobile] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  
  // Zoom state for preview
  const [zoomLevel, setZoomLevel] = useState(100)
  const zoomLevels = [50, 75, 100, 125, 150, 200]
  
  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoomLevel)
    if (currentIndex < zoomLevels.length - 1) {
      setZoomLevel(zoomLevels[currentIndex + 1])
    }
  }
  
  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoomLevel)
    if (currentIndex > 0) {
      setZoomLevel(zoomLevels[currentIndex - 1])
    }
  }
  
  const handleResetZoom = () => {
    setZoomLevel(100)
  }
  
  // Feedback state
  const [sectionFeedback, setSectionFeedback] = useState<SectionFeedback[]>(
    sections.map((s: Section) => ({ sectionId: s.id, rating: null, comment: '', presets: [] }))
  )
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [generalComment, setGeneralComment] = useState('')
  
  // Question answers state
  const [questionAnswers, setQuestionAnswers] = useState<FeedbackQuestionAnswer[]>([])
  
  // Get all questions to show (from predefined + custom)
  // If no questions were selected by developer, use default questions
  const effectiveQuestionIds = feedbackQuestionIds.length > 0 
    ? feedbackQuestionIds 
    : AVAILABLE_FEEDBACK_QUESTIONS.filter(q => q.isDefault).map(q => q.id)
  
  const allQuestions = [
    ...effectiveQuestionIds
      .map(id => AVAILABLE_FEEDBACK_QUESTIONS.find(q => q.id === id))
      .filter(Boolean)
      .map(q => ({ id: q!.id, question: q!.question, helpText: q!.helpText, icon: q!.icon, isCustom: false })),
    ...customQuestions.map((q, i) => ({ id: `custom-${i}`, question: q, helpText: undefined, icon: undefined, isCustom: true }))
  ]
  const hasQuestions = allQuestions.length > 0
  
  // Debug: log computed questions
  console.log('[DesignFeedbackSections] effectiveQuestionIds:', effectiveQuestionIds)
  console.log('[DesignFeedbackSections] allQuestions:', allQuestions)
  console.log('[DesignFeedbackSections] hasQuestions:', hasQuestions)
  
  // UI state - now includes 'questions' step
  const [step, setStep] = useState<'intro' | 'sections' | 'questions' | 'summary'>('intro')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState<'approved' | 'feedback' | null>(null)
  const [expandedComment, setExpandedComment] = useState<string | null>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset on open - restore saved progress if available
  useEffect(() => {
    if (isOpen) {
      setDevice(isMobile ? 'mobile' : 'desktop')
      setIframeLoaded(false)
      setShowSuccess(null)
      
      // If we have saved progress, restore it
      if (wasRestored && savedProgress.sectionFeedback.length > 0) {
        setSectionFeedback(savedProgress.sectionFeedback)
        setGeneralComment(savedProgress.generalComment)
        setQuestionAnswers(savedProgress.questionAnswers)
        setCurrentSectionIndex(savedProgress.currentSectionIndex)
        setStep(savedProgress.step)
      } else {
        // Initialize fresh
        setSectionFeedback(sections.map((s: Section) => ({ sectionId: s.id, rating: null, comment: '', presets: [] })))
        setCurrentSectionIndex(0)
        setGeneralComment('')
        setStep('intro')
        // Initialize question answers
        setQuestionAnswers(allQuestions.map(q => ({
          questionId: q.id,
          question: q.question,
          answer: null,
          comment: ''
        })))
      }
    }
  }, [isOpen, isMobile, sections, allQuestions.length, wasRestored, savedProgress])

  // Ensure URL is absolute
  const ensureAbsoluteUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `https://${url}`
  }

  const absoluteUrl = ensureAbsoluteUrl(designPreviewUrl)

  // Get current section
  const currentSection = sections[currentSectionIndex]
  const currentFeedback = sectionFeedback.find(f => f.sectionId === currentSection?.id)

  // Update section feedback with haptic and persistence
  const updateFeedback = (sectionId: string, update: Partial<SectionFeedback>) => {
    // Haptic feedback on rating change
    if (update.rating) {
      haptic.selection()
    }
    setSectionFeedback(prev => {
      const updated = prev.map(f => 
        f.sectionId === sectionId ? { ...f, ...update } : f
      )
      // Save progress
      saveProgress(current => ({ ...current, sectionFeedback: updated }))
      return updated
    })
  }

  // Toggle preset selection with haptic
  const togglePreset = (sectionId: string, presetId: string) => {
    haptic.light()
    setSectionFeedback(prev => {
      const updated = prev.map(f => {
        if (f.sectionId !== sectionId) return f
        const hasPreset = f.presets.includes(presetId)
        return {
          ...f,
          presets: hasPreset 
            ? f.presets.filter(p => p !== presetId)
            : [...f.presets, presetId]
        }
      })
      // Save progress
      saveProgress(current => ({ ...current, sectionFeedback: updated }))
      return updated
    })
  }

  // Navigation with haptic
  const goNext = () => {
    haptic.light()
    if (currentSectionIndex < sections.length - 1) {
      const newIndex = currentSectionIndex + 1
      setCurrentSectionIndex(newIndex)
      saveProgress(current => ({ ...current, currentSectionIndex: newIndex }))
    } else {
      // Go to questions step if there are questions, otherwise summary
      if (hasQuestions) {
        setStep('questions')
        saveProgress(current => ({ ...current, step: 'questions' }))
      } else {
        setStep('summary')
        saveProgress(current => ({ ...current, step: 'summary' }))
      }
    }
  }

  const goPrev = () => {
    haptic.light()
    if (currentSectionIndex > 0) {
      const newIndex = currentSectionIndex - 1
      setCurrentSectionIndex(newIndex)
      saveProgress(current => ({ ...current, currentSectionIndex: newIndex }))
    }
  }
  
  // Swipe navigation for mobile
  const swipe = useSwipeNavigation({
    enabled: step === 'sections',
    onSwipeLeft: goNext,
    onSwipeRight: goPrev
  })
  
  // Update question answer
  const updateQuestionAnswer = (questionId: string, answer: 'yes' | 'no' | null, comment?: string) => {
    setQuestionAnswers(prev => prev.map(qa => 
      qa.questionId === questionId
        ? { ...qa, answer, comment: comment !== undefined ? comment : qa.comment }
        : qa
    ))
  }

  // Count feedback
  const sectionChangeCount = sectionFeedback.filter(f => f.rating === 'change').length
  const questionChangeCount = questionAnswers.filter(qa => qa.answer === 'no').length
  const changeCount = sectionChangeCount + questionChangeCount
  const answeredCount = sectionFeedback.filter(f => f.rating !== null).length

  // Check if all sections are good (and all questions answered positively)
  const allGood = answeredCount === sections.length && changeCount === 0

  // Trigger confetti
  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#a855f7', '#22c55e', '#3b82f6', '#eab308']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#a855f7', '#22c55e', '#3b82f6', '#eab308']
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }

  // Handle approve
  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      // Submit approval via API
      await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          approved: true,
          type: 'design',
          sectionFeedback: sectionFeedback.filter(f => f.rating !== null),
          generalComment,
          questionAnswers: questionAnswers.filter(qa => qa.answer !== null)
        })
      })
      
      if (onApprove) await onApprove()
      triggerConfetti()
      haptic.success() // Haptic feedback on success
      clearProgress() // Clear saved progress
      setShowSuccess('approved')
      setTimeout(() => onClose(), 3000)
    } catch (error) {
      console.error('Error approving:', error)
      haptic.error()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle feedback submit
  const handleSubmitFeedback = async () => {
    setIsSubmitting(true)
    try {
      // Submit feedback via API
      await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          approved: false,
          type: 'design',
          sectionFeedback: sectionFeedback.filter(f => f.rating !== null),
          generalComment,
          questionAnswers: questionAnswers.filter(qa => qa.answer !== null)
        })
      })
      
      if (onFeedbackSubmit) await onFeedbackSubmit()
      haptic.success() // Haptic feedback on success
      clearProgress() // Clear saved progress
      setShowSuccess('feedback')
      setTimeout(() => onClose(), 2500)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      haptic.error()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Success overlay
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-6 max-w-md"
        >
          <div className="text-8xl mb-6">
            {showSuccess === 'approved' ? '🎉' : '✨'}
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            {showSuccess === 'approved' ? t('designFeedback.success.approved') : t('designFeedback.success.feedback')}
          </h2>
          <p className="text-lg text-zinc-300 mb-6">
            {showSuccess === 'approved'
              ? t('designFeedback.success.approvedDesc')
              : t('designFeedback.success.feedbackDesc')}
          </p>
          
          {showSuccess === 'feedback' && (
            <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t('designFeedback.success.whatNow')}</p>
                  <p className="text-xs text-zinc-400">{t('designFeedback.success.whatNowDesc')}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex flex-col"
        {...swipe.handlers}
      >
        {/* Auto-save indicator */}
        {hasUnsavedChanges && (
          <div className="fixed top-2 right-16 z-50 flex items-center gap-1.5 px-2 py-1 bg-zinc-800/80 rounded-full text-xs text-zinc-400 backdrop-blur-sm">
            <Save className="w-3 h-3 animate-pulse" />
            <span className="hidden sm:inline">{t('common.saving') || 'Saving...'}</span>
          </div>
        )}
        {lastSaved && !hasUnsavedChanges && step !== 'intro' && (
          <div className="fixed top-2 right-16 z-50 flex items-center gap-1.5 px-2 py-1 bg-zinc-800/80 rounded-full text-xs text-zinc-500 backdrop-blur-sm">
            <Check className="w-3 h-3" />
            <span className="hidden sm:inline">{t('common.saved') || 'Saved'}</span>
          </div>
        )}

        {/* Mobile hint - only visible on mobile */}
        {isMobile && step === 'intro' && (
          <div className="flex-shrink-0 bg-purple-600/20 border-b border-purple-500/30 px-3 sm:px-4 py-2 text-center safe-area-inset-top">
            <p className="text-[11px] sm:text-xs text-purple-300">
              {t('designFeedback.intro.tipMobile')}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 h-12 sm:h-14 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onClose}
              aria-label={t('common.close')}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <h1 className="text-sm sm:text-base text-white font-medium hidden sm:block">Design Feedback</h1>
            
            {/* Progress indicator */}
            {step === 'sections' && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-400">
                <span className="text-purple-400 font-medium">{currentSectionIndex + 1}</span>
                <span>/</span>
                <span>{sections.length}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Device toggle - only on desktop when not in intro */}
            {!isMobile && step !== 'intro' && (
              <div className="flex bg-zinc-800 rounded-lg p-0.5 sm:p-1">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-colors ${
                    device === 'desktop' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-colors ${
                    device === 'mobile' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Mobiel</span>
                </button>
              </div>
            )}
            
            {/* Zoom controls - only on desktop when not in intro */}
            {!isMobile && step !== 'intro' && (
              <div className="flex bg-zinc-800 rounded-lg p-0.5 sm:p-1 items-center gap-0.5">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="px-1.5 text-xs text-zinc-300 font-medium min-w-[40px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                {zoomLevel !== 100 && (
                  <button
                    onClick={handleResetZoom}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    aria-label={t('designFeedback.zoom.reset')}
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            )}
            
            {/* External link */}
            <a
              href={absoluteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Preview area - hidden on intro, adjusted for mobile */}
          <div className={`${step === 'intro' ? 'hidden md:flex md:w-1/3' : isMobile ? 'h-[30vh] min-h-[180px] flex-shrink-0' : 'flex-1'} bg-zinc-950 p-1.5 sm:p-2 md:p-4 flex items-center justify-center relative`}>
            
            {/* Floating zoom indicator when zoomed */}
            {!isMobile && step !== 'intro' && zoomLevel !== 100 && (
              <div className="absolute top-6 left-6 z-20 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm">
                <span className="text-purple-400 font-medium">{zoomLevel}%</span>
                <button
                  onClick={handleResetZoom}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            )}
            
            {/* On mobile: show simple framed preview without device mockup */}
            {isMobile && step !== 'intro' && (
              <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-zinc-700 bg-white">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  </div>
                )}
                <iframe
                  src={absoluteUrl}
                  className="w-full h-full border-0"
                  onLoad={() => setIframeLoaded(true)}
                  title="Design Preview"
                />
              </div>
            )}

            {/* Desktop/Laptop Mockup - only on desktop */}
            {!isMobile && device === 'desktop' && (
              <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4">
                {/* MacBook Pro style mockup - fills available space */}
                <div className="relative w-full h-full max-w-6xl flex flex-col">
                  {/* Screen bezel - dark frame around screen */}
                  <div className="bg-zinc-900 rounded-2xl p-2 md:p-3 shadow-2xl flex-1 flex flex-col min-h-0">
                    {/* Browser chrome inside bezel */}
                    <div className="bg-zinc-800 rounded-t-lg flex-shrink-0">
                      <div className="px-3 py-2 flex items-center gap-2">
                        {/* Traffic lights */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                        </div>
                        {/* URL bar */}
                        <div className="flex-1 mx-4">
                          <div className="bg-zinc-700/80 rounded-md px-4 py-1.5 text-xs text-zinc-400 truncate max-w-sm mx-auto text-center flex items-center justify-center gap-2">
                            <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {absoluteUrl}
                          </div>
                        </div>
                        {/* Window controls placeholder */}
                        <div className="w-16"></div>
                      </div>
                    </div>
                    
                    {/* Screen content - takes remaining space with zoom support */}
                    <div className="relative bg-white overflow-auto flex-1 min-h-0">
                      {!iframeLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        </div>
                      )}
                      <div 
                        className="origin-top-left transition-transform duration-200"
                        style={{ 
                          transform: `scale(${zoomLevel / 100})`,
                          width: `${10000 / zoomLevel}%`,
                          height: `${10000 / zoomLevel}%`
                        }}
                      >
                        <iframe
                          src={absoluteUrl}
                          className="w-full h-full border-0"
                          onLoad={() => setIframeLoaded(true)}
                          title="Design Preview"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* MacBook hinge/notch */}
                  <div className="flex justify-center flex-shrink-0">
                    <div className="w-16 h-1 bg-zinc-700 rounded-b-sm"></div>
                  </div>
                  
                  {/* MacBook base */}
                  <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 h-4 rounded-b-xl mx-4 flex items-center justify-center flex-shrink-0">
                    <div className="w-20 h-1 bg-zinc-700/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile/Phone Mockup - only on desktop when viewing mobile preview */}
            {!isMobile && device === 'mobile' && (
              <div className="relative h-full flex items-center justify-center py-4">
                {/* iPhone style mockup */}
                <div className="relative" style={{ height: 'min(100%, 580px)', aspectRatio: '9/19.5' }}>
                  {/* Phone outer frame - titanium style */}
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-700 rounded-[3rem] shadow-2xl p-1">
                    {/* Phone inner bezel */}
                    <div className="relative w-full h-full bg-black rounded-[2.5rem] overflow-hidden">
                      {/* Dynamic Island */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-10 flex items-center justify-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700"></div>
                        <div className="w-3 h-3 rounded-full bg-zinc-900 ring-1 ring-zinc-800"></div>
                      </div>
                      
                      {/* Screen content with zoom support */}
                      <div className="absolute inset-0 bg-white overflow-auto rounded-[2.5rem]">
                        {!iframeLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                          </div>
                        )}
                        <div 
                          className="origin-top-left transition-transform duration-200"
                          style={{ 
                            transform: `scale(${zoomLevel / 100})`,
                            width: `${10000 / zoomLevel}%`,
                            height: `${10000 / zoomLevel}%`
                          }}
                        >
                          <iframe
                            src={absoluteUrl}
                            className="w-full h-full border-0"
                            onLoad={() => setIframeLoaded(true)}
                            title="Design Preview"
                          />
                        </div>
                      </div>
                      
                      {/* Home indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-600 rounded-full z-10"></div>
                    </div>
                  </div>
                  
                  {/* Side buttons - volume */}
                  <div className="absolute left-0 top-28 w-0.5 h-8 bg-zinc-600 rounded-l-sm -translate-x-0.5"></div>
                  <div className="absolute left-0 top-40 w-0.5 h-12 bg-zinc-600 rounded-l-sm -translate-x-0.5"></div>
                  <div className="absolute left-0 top-56 w-0.5 h-12 bg-zinc-600 rounded-l-sm -translate-x-0.5"></div>
                  
                  {/* Side button - power */}
                  <div className="absolute right-0 top-36 w-0.5 h-16 bg-zinc-600 rounded-r-sm translate-x-0.5"></div>
                </div>
              </div>
            )}
          </div>

          {/* Feedback panel - larger on intro, scrollable on mobile */}
          <div className={`${step === 'intro' ? 'flex-1 md:w-2/3' : isMobile ? 'flex-1 min-h-0' : 'w-full md:w-[450px] lg:w-[500px]'} bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col overflow-hidden`}>
            
            {/* INTRO STEP */}
            {step === 'intro' && (
              <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 md:p-12 text-center overflow-y-auto">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="max-w-md w-full"
                >
                  <div className="text-5xl sm:text-7xl md:text-8xl mb-4 sm:mb-6">👋</div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">{t('designFeedback.intro.title')}</h2>
                  <p className="text-sm sm:text-base md:text-lg text-zinc-400 mb-5 sm:mb-8">
                    {t('designFeedback.intro.explanation')}
                  </p>
                  
                  <div className="bg-zinc-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-5 sm:mb-8 text-left">
                    <p className="text-sm sm:text-base text-zinc-300 mb-3 sm:mb-4 font-medium">{t('common.howItWorks', 'How it works:')}</p>
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-zinc-400">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                        </div>
                        <span><strong className="text-green-400">{t('designFeedback.sectionRating.good')}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                        </div>
                        <span><strong className="text-amber-400">{t('designFeedback.sectionRating.change')}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('sections')}
                    className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-purple-600 text-white text-base sm:text-lg rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {t('designFeedback.intro.startButton')}
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </motion.div>
              </div>
            )}

            {/* SECTIONS STEP */}
            {step === 'sections' && currentSection && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Section header - fixed */}
                <div className="p-3 sm:p-4 border-b border-zinc-800 flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span className="text-xl sm:text-2xl">{currentSection.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">{currentSection.name}</h3>
                      <p className="text-xs sm:text-sm text-zinc-400 truncate">{currentSection.description}</p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-2 sm:mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Feedback content - scrollable */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-zinc-400 mb-3 sm:mb-4">{t('designFeedback.sectionRating.question')}</p>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <button
                      onClick={() => updateFeedback(currentSection.id, { rating: 'good' })}
                      className={`p-2.5 sm:p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 sm:gap-2 ${
                        currentFeedback?.rating === 'good'
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                      <span className="font-medium text-xs sm:text-sm md:text-base">{t('designFeedback.sectionRating.good')}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        updateFeedback(currentSection.id, { rating: 'change' })
                        setExpandedComment(currentSection.id)
                      }}
                      className={`p-2.5 sm:p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 sm:gap-2 ${
                        currentFeedback?.rating === 'change'
                          ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                          : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <ThumbsDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                      <span className="font-medium text-xs sm:text-sm md:text-base">{t('designFeedback.sectionRating.change')}</span>
                    </button>
                  </div>

                  {/* Comment field - show when 'change' is selected or expanded */}
                  <AnimatePresence>
                    {(currentFeedback?.rating === 'change' || expandedComment === currentSection.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        {/* Preset buttons */}
                        <p className="text-xs sm:text-sm text-zinc-400 mb-2">{t('designFeedback.comments.selectPresets')}</p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-2 sm:mb-3">
                          {FEEDBACK_PRESETS.map(preset => {
                            const isSelected = currentFeedback?.presets.includes(preset.id)
                            return (
                              <button
                                key={preset.id}
                                onClick={() => togglePreset(currentSection.id, preset.id)}
                                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-lg text-[11px] sm:text-xs md:text-sm font-medium transition-all flex items-center gap-1 sm:gap-1.5 ${
                                  isSelected
                                    ? 'bg-amber-500/30 border-amber-500 text-amber-300 border'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 border hover:border-zinc-600 hover:text-zinc-300'
                                }`}
                              >
                                <span>{preset.emoji}</span>
                                <span>{preset.label}</span>
                              </button>
                            )
                          })}
                        </div>

                        {/* Custom comment */}
                        <label className="text-xs sm:text-sm text-zinc-400 mb-1 sm:mb-1.5 block">
                          {t('designFeedback.sectionRating.extraLabel')} <span className="text-zinc-600">{t('designFeedback.sectionRating.optional')}</span>
                        </label>
                        <textarea
                          value={currentFeedback?.comment || ''}
                          onChange={(e) => updateFeedback(currentSection.id, { comment: e.target.value })}
                          placeholder={t('designFeedback.comments.placeholder')}
                          className="w-full h-14 sm:h-16 md:h-20 px-2.5 sm:px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs sm:text-sm placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Optional: add comment when 'good' */}
                  {currentFeedback?.rating === 'good' && expandedComment !== currentSection.id && (
                    <button
                      onClick={() => setExpandedComment(currentSection.id)}
                      className="text-sm text-zinc-500 hover:text-zinc-300 flex items-center gap-1 mb-4"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {t('designFeedback.sectionRating.addCommentAnyway')}
                    </button>
                  )}
                </div>

                {/* Navigation - fixed at bottom */}
                <div className="flex-shrink-0 p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900 safe-area-inset-bottom">
                  <div className="flex gap-2 sm:gap-3">
                    {currentSectionIndex > 0 && (
                      <button
                        onClick={goPrev}
                        className="px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors flex items-center gap-1 sm:gap-2"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">{t('designFeedback.navigation.previous')}</span>
                      </button>
                    )}
                    
                    <button
                      onClick={goNext}
                      disabled={currentFeedback?.rating === null}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    >
                      {currentSectionIndex < sections.length - 1 ? (
                        <>
                          <span>{t('designFeedback.navigation.next')}</span>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">{t('designFeedback.navigation.viewSummary')}</span>
                          <span className="sm:hidden">{t('designFeedback.summary.title')}</span>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* QUESTIONS STEP */}
            {step === 'questions' && hasQuestions && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-zinc-800">
                  <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    {t('designFeedback.questions.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    {t('designFeedback.questions.subtitle')}
                  </p>
                </div>

                {/* Questions list */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {allQuestions.map((question, index) => {
                    const answer = questionAnswers.find(qa => qa.questionId === question.id)
                    return (
                      <div key={question.id} className="bg-zinc-800/50 rounded-xl p-3 sm:p-4">
                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                          {question.icon && (
                            <span className="text-xl sm:text-2xl mt-0.5">{question.icon}</span>
                          )}
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm sm:text-base">
                              <span className="text-purple-400 mr-1.5">{index + 1}.</span>
                              {question.question}
                            </p>
                            {question.helpText && (
                              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                                💡 {question.helpText}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Yes/No buttons */}
                        <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-3">
                          <button
                            onClick={() => updateQuestionAnswer(question.id, 'yes')}
                            className={`p-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                              answer?.answer === 'yes'
                                ? 'border-green-500 bg-green-500/20 text-green-400'
                                : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">{t('designFeedback.sectionRating.yesGood')}</span>
                          </button>
                          <button
                            onClick={() => updateQuestionAnswer(question.id, 'no')}
                            className={`p-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                              answer?.answer === 'no'
                                ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                                : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">{t('designFeedback.sectionRating.noChange')}</span>
                          </button>
                        </div>
                        
                        {/* Comment field - show when 'no' is selected */}
                        {answer?.answer === 'no' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                          >
                            <textarea
                              value={answer.comment || ''}
                              onChange={(e) => updateQuestionAnswer(question.id, 'no', e.target.value)}
                              placeholder={t('designFeedback.sectionRating.whatToChange')}
                              className="w-full h-14 sm:h-16 px-2.5 sm:px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                            />
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Navigation */}
                <div className="p-3 sm:p-4 border-t border-zinc-800 flex gap-2 safe-area-inset-bottom">
                  <button
                    onClick={() => {
                      setCurrentSectionIndex(sections.length - 1)
                      setStep('sections')
                    }}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm">{t('designFeedback.navigation.backToSections')}</span>
                  </button>
                  <button
                    onClick={() => setStep('summary')}
                    className="flex-1 py-2 sm:py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">{t('designFeedback.navigation.viewSummary')}</span>
                    <span className="sm:hidden">{t('designFeedback.summary.title')}</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* SUMMARY STEP */}
            {step === 'summary' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6 border-b border-zinc-800">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" />
                    {t('designFeedback.summary.title')}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-zinc-400 mt-1">
                    {allGood 
                      ? t('designFeedback.summary.allGoodDesc')
                      : t('designFeedback.summary.changesNeeded', { count: changeCount })
                    }
                  </p>
                </div>

                {/* Summary list - improved layout */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
                  {sections.map((section: Section, index: number) => {
                    const feedback = sectionFeedback.find(f => f.sectionId === section.id)
                    const hasDetails = (feedback?.presets && feedback.presets.length > 0) || feedback?.comment
                    const isExpanded = expandedComment === section.id
                    
                    return (
                      <div
                        key={section.id}
                        className={`rounded-xl border transition-all ${
                          feedback?.rating === 'good'
                            ? 'border-green-500/30 bg-green-500/10'
                            : feedback?.rating === 'change'
                            ? 'border-amber-500/30 bg-amber-500/10'
                            : 'border-zinc-700 bg-zinc-800/50'
                        }`}
                      >
                        {/* Section header - always visible */}
                        <div className="p-3 sm:p-4 md:p-5 flex items-center gap-2 sm:gap-3 md:gap-4">
                          <span className="text-xl sm:text-2xl md:text-3xl">{section.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base md:text-lg font-medium text-white truncate">{section.name}</p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-zinc-500 truncate">{section.description}</p>
                          </div>
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            feedback?.rating === 'good'
                              ? 'bg-green-500/20 text-green-400'
                              : feedback?.rating === 'change'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-zinc-700 text-zinc-500'
                          }`}>
                            {feedback?.rating === 'good' && <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
                            {feedback?.rating === 'change' && <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
                          </div>
                        </div>
                        
                        {/* Expand button - only show for items with "change" rating */}
                        {feedback?.rating === 'change' && (
                          <button
                            onClick={() => setExpandedComment(isExpanded ? null : section.id)}
                            className="w-full px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5 pt-0 text-left"
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition-colors">
                              <ChevronRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              <span>{t('common.showMore', 'Show details')}</span>
                              {hasDetails && !isExpanded && (
                                <span className="text-[10px] sm:text-xs text-amber-500/70">
                                  ({feedback.presets?.length || 0} {t('common.tags', 'tags')}{feedback.comment ? `, ${t('common.comment', 'comment')}` : ''})
                                </span>
                              )}
                            </div>
                          </button>
                        )}
                        
                        {/* Collapsible details */}
                        <AnimatePresence>
                          {isExpanded && feedback?.rating === 'change' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5 border-t border-amber-500/20 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                                {/* Selected presets */}
                                {feedback?.presets && feedback.presets.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {feedback.presets.map(presetId => {
                                      const preset = FEEDBACK_PRESETS.find(p => p.id === presetId)
                                      return preset ? (
                                        <span key={presetId} className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                                          {preset.emoji} {preset.label}
                                        </span>
                                      ) : null
                                    })}
                                  </div>
                                )}
                                {/* Comment */}
                                {feedback?.comment && (
                                  <p className="text-xs sm:text-sm text-zinc-300 bg-zinc-800/50 rounded-lg p-2 sm:p-3 italic">
                                    "{feedback.comment}"
                                  </p>
                                )}
                                {/* Edit button */}
                                <button
                                  onClick={() => {
                                    setCurrentSectionIndex(index)
                                    setStep('sections')
                                  }}
                                  className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 font-medium"
                                >
                                  ✏️ {t('common.edit')}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}

                  {/* Question answers summary - improved */}
                  {hasQuestions && questionAnswers.some(qa => qa.answer !== null) && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-700">
                      <p className="text-sm sm:text-base md:text-lg text-zinc-300 mb-2 sm:mb-3 flex items-center gap-2 font-medium">
                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                        {t('designFeedback.questions.title')}
                      </p>
                      <div className="space-y-2 sm:space-y-3">
                        {questionAnswers.filter(qa => qa.answer !== null).map(qa => (
                          <div 
                            key={qa.questionId} 
                            className={`p-3 sm:p-4 rounded-xl border ${
                              qa.answer === 'yes' 
                                ? 'border-green-500/30 bg-green-500/10'
                                : 'border-amber-500/30 bg-amber-500/10'
                            }`}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                qa.answer === 'yes' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {qa.answer === 'yes' ? <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm md:text-base text-white">{qa.question}</p>
                                {qa.comment && (
                                  <p className="text-[10px] sm:text-xs md:text-sm text-zinc-400 mt-1 italic truncate">"{qa.comment}"</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep('questions')}
                        className="mt-2 sm:mt-3 text-xs sm:text-sm text-purple-400 hover:text-purple-300 font-medium"
                      >
                        ✏️ {t('common.edit')}
                      </button>
                    </div>
                  )}

                  {/* General comment */}
                  <div className="mt-4 sm:mt-6">
                    <label className="text-xs sm:text-sm md:text-base text-zinc-400 mb-1.5 sm:mb-2 block">
                      {t('designFeedback.summary.generalComments')} <span className="text-zinc-600">({t('common.optional')})</span>
                    </label>
                    <textarea
                      value={generalComment}
                      onChange={(e) => setGeneralComment(e.target.value)}
                      placeholder={t('designFeedback.comments.generalPlaceholder')}
                      className="w-full h-20 sm:h-24 md:h-28 px-3 sm:px-4 py-2 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm md:text-base"
                    />
                  </div>
                </div>

                {/* Actions - improved */}
                <div className="p-3 sm:p-4 md:p-6 border-t border-zinc-800 space-y-2 sm:space-y-3 safe-area-inset-bottom">
                  {changeCount > 0 ? (
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmitting}
                      className="w-full py-3 sm:py-4 bg-purple-600 text-white rounded-xl font-medium text-sm sm:text-base md:text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                          {t('designFeedback.actions.submitFeedback')}
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium text-sm sm:text-base md:text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-spin" />
                      ) : (
                        <>
                          <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                          <span className="hidden sm:inline">{t('designFeedback.actions.approve')}</span>
                          <span className="sm:hidden">{t('designFeedback.actions.approveMobile')}</span>
                          <span>🎉</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {allGood && (
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmitting}
                      className="w-full py-2 sm:py-3 text-zinc-400 text-xs sm:text-sm md:text-base hover:text-white transition-colors"
                    >
                      {t('designFeedback.actions.sendAnyway')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
