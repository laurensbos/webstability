/**
 * DesignFeedbackSections - Sectie-gebaseerde feedback voor leken
 * 
 * Simpele flow:
 * 1. Bekijk het design in iframe
 * 2. Geef per sectie feedback (👍/👎)
 * 3. Voeg optioneel opmerkingen toe
 * 4. Verstuur of keur goed
 */

import { useState, useEffect } from 'react'
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
  HelpCircle
} from 'lucide-react'
import { AVAILABLE_FEEDBACK_QUESTIONS } from '../types/project'
import type { FeedbackQuestionAnswer } from '../types/project'

// Standaard secties voor een website
const DEFAULT_SECTIONS = [
  { id: 'hero', name: 'Header & Hero', description: 'Logo, navigatie en de eerste indruk', icon: '🏠' },
  { id: 'about', name: 'Over Ons / Intro', description: 'Introductie en wie jullie zijn', icon: '👋' },
  { id: 'services', name: 'Diensten / Aanbod', description: 'Wat jullie aanbieden', icon: '⭐' },
  { id: 'features', name: 'Kenmerken / USPs', description: 'Waarom kiezen voor jullie', icon: '✨' },
  { id: 'testimonials', name: 'Reviews / Referenties', description: 'Wat anderen zeggen', icon: '💬' },
  { id: 'contact', name: 'Contact', description: 'Contactgegevens en formulier', icon: '📞' },
  { id: 'footer', name: 'Footer', description: 'Onderaan de pagina', icon: '📋' },
]

// Feedback presets - klikbare opties voor gedetailleerde feedback
const FEEDBACK_PRESETS = [
  { id: 'colors', label: 'Kleuren', emoji: '🎨', description: 'Andere kleuren gewenst' },
  { id: 'text', label: 'Tekst', emoji: '📝', description: 'Tekst aanpassen/herschrijven' },
  { id: 'image', label: 'Afbeelding', emoji: '📷', description: 'Andere foto/afbeelding' },
  { id: 'layout', label: 'Indeling', emoji: '📐', description: 'Layout/positie aanpassen' },
  { id: 'font', label: 'Lettertype', emoji: '🔤', description: 'Ander font gewenst' },
  { id: 'size', label: 'Formaat', emoji: '📏', description: 'Groter/kleiner maken' },
  { id: 'remove', label: 'Verwijderen', emoji: '🗑️', description: 'Deze sectie weghalen' },
  { id: 'spacing', label: 'Ruimte', emoji: '↔️', description: 'Meer/minder witruimte' },
]

interface SectionFeedback {
  sectionId: string
  rating: 'good' | 'change' | null
  comment: string
  presets: string[] // NEW: selected preset IDs
}

interface DesignFeedbackSectionsProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  designPreviewUrl: string
  sections?: typeof DEFAULT_SECTIONS
  onFeedbackSubmit?: () => Promise<void>
  onApprove?: () => Promise<void>
  // Custom questions from developer
  feedbackQuestionIds?: string[]  // IDs from AVAILABLE_FEEDBACK_QUESTIONS
  customQuestions?: string[]      // Free-form custom questions
}

export default function DesignFeedbackSections({
  isOpen,
  onClose,
  projectId,
  designPreviewUrl,
  sections = DEFAULT_SECTIONS,
  onFeedbackSubmit,
  onApprove,
  feedbackQuestionIds = [],
  customQuestions = []
}: DesignFeedbackSectionsProps) {
  // Device state
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [isMobile, setIsMobile] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  
  // Feedback state
  const [sectionFeedback, setSectionFeedback] = useState<SectionFeedback[]>(
    sections.map(s => ({ sectionId: s.id, rating: null, comment: '', presets: [] }))
  )
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [generalComment, setGeneralComment] = useState('')
  
  // Question answers state
  const [questionAnswers, setQuestionAnswers] = useState<FeedbackQuestionAnswer[]>([])
  
  // Get all questions to show (from predefined + custom)
  const allQuestions = [
    ...feedbackQuestionIds
      .map(id => AVAILABLE_FEEDBACK_QUESTIONS.find(q => q.id === id))
      .filter(Boolean)
      .map(q => ({ id: q!.id, question: q!.question, isCustom: false })),
    ...customQuestions.map((q, i) => ({ id: `custom-${i}`, question: q, isCustom: true }))
  ]
  const hasQuestions = allQuestions.length > 0
  
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

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setDevice(isMobile ? 'mobile' : 'desktop')
      setSectionFeedback(sections.map(s => ({ sectionId: s.id, rating: null, comment: '', presets: [] })))
      setCurrentSectionIndex(0)
      setGeneralComment('')
      setStep('intro')
      setIframeLoaded(false)
      setShowSuccess(null)
      // Initialize question answers
      setQuestionAnswers(allQuestions.map(q => ({
        questionId: q.id,
        question: q.question,
        answer: null,
        comment: ''
      })))
    }
  }, [isOpen, isMobile, sections, allQuestions.length])

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

  // Update section feedback
  const updateFeedback = (sectionId: string, update: Partial<SectionFeedback>) => {
    setSectionFeedback(prev => prev.map(f => 
      f.sectionId === sectionId ? { ...f, ...update } : f
    ))
  }

  // Toggle preset selection
  const togglePreset = (sectionId: string, presetId: string) => {
    setSectionFeedback(prev => prev.map(f => {
      if (f.sectionId !== sectionId) return f
      const hasPreset = f.presets.includes(presetId)
      return {
        ...f,
        presets: hasPreset 
          ? f.presets.filter(p => p !== presetId)
          : [...f.presets, presetId]
      }
    }))
  }

  // Navigation
  const goNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1)
    } else {
      // Go to questions step if there are questions, otherwise summary
      if (hasQuestions) {
        setStep('questions')
      } else {
        setStep('summary')
      }
    }
  }

  const goPrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1)
    }
  }
  
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
      setShowSuccess('approved')
      setTimeout(() => onClose(), 3000)
    } catch (error) {
      console.error('Error approving:', error)
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
      setShowSuccess('feedback')
      setTimeout(() => onClose(), 2500)
    } catch (error) {
      console.error('Error submitting feedback:', error)
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
            {showSuccess === 'approved' ? 'Design goedgekeurd!' : 'Bedankt voor je feedback!'}
          </h2>
          <p className="text-lg text-zinc-300 mb-6">
            {showSuccess === 'approved'
              ? 'Geweldig! Je ontvangt zo een e-mail met de volgende stappen.'
              : 'We gaan direct aan de slag met je aanpassingen. Je ziet de status terug op je projectpagina.'}
          </p>
          
          {showSuccess === 'feedback' && (
            <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Wat gebeurt er nu?</p>
                  <p className="text-xs text-zinc-400">We verwerken je feedback en sturen een nieuwe preview zodra deze klaar is.</p>
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
      >
        {/* Mobile hint - only visible on mobile */}
        {isMobile && step === 'intro' && (
          <div className="flex-shrink-0 bg-purple-600/20 border-b border-purple-500/30 px-4 py-2 text-center">
            <p className="text-xs text-purple-300">
              💻 Tip: Voor de beste ervaring, open dit op een desktop of laptop
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 h-14 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h1 className="text-white font-medium hidden sm:block">Design Feedback</h1>
            
            {/* Progress indicator */}
            {step === 'sections' && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="text-purple-400 font-medium">{currentSectionIndex + 1}</span>
                <span>/</span>
                <span>{sections.length}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Device toggle - only on desktop when not in intro */}
            {!isMobile && step !== 'intro' && (
              <div className="flex bg-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ${
                    device === 'desktop' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ${
                    device === 'mobile' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Mobiel</span>
                </button>
              </div>
            )}
            
            {/* External link */}
            <a
              href={absoluteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Preview area - hidden on intro, adjusted for mobile */}
          <div className={`${step === 'intro' ? 'hidden md:flex md:w-1/3' : isMobile ? 'h-[35vh] flex-shrink-0' : 'flex-1'} bg-zinc-950 p-2 md:p-4 flex items-center justify-center`}>
            
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
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                {/* MacBook Pro style mockup */}
                <div className="relative w-full max-w-5xl" style={{ height: 'calc(100% - 40px)', maxHeight: '75vh' }}>
                  {/* Screen bezel - dark frame around screen */}
                  <div className="bg-zinc-900 rounded-2xl p-3 shadow-2xl h-full flex flex-col">
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
                    
                    {/* Screen content - takes remaining space */}
                    <div className="relative bg-white overflow-hidden flex-1 min-h-0">
                      {!iframeLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
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
                  </div>
                  
                  {/* MacBook hinge/notch */}
                  <div className="flex justify-center">
                    <div className="w-16 h-1 bg-zinc-700 rounded-b-sm"></div>
                  </div>
                  
                  {/* MacBook base */}
                  <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 h-4 rounded-b-xl mx-4 flex items-center justify-center">
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
                      
                      {/* Screen content */}
                      <div className="absolute inset-0 bg-white overflow-hidden rounded-[2.5rem]">
                        {!iframeLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
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
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="max-w-md"
                >
                  <div className="text-7xl md:text-8xl mb-6">👋</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Welkom!</h2>
                  <p className="text-lg text-zinc-400 mb-8">
                    We gaan samen door je website design. Per onderdeel kun je aangeven of het goed is of aangepast moet worden.
                  </p>
                  
                  <div className="bg-zinc-800/50 rounded-2xl p-6 mb-8 text-left">
                    <p className="text-base text-zinc-300 mb-4 font-medium">Zo werkt het:</p>
                    <div className="space-y-4 text-base text-zinc-400">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <ThumbsUp className="w-5 h-5 text-green-400" />
                        </div>
                        <span><strong className="text-green-400">Goed</strong> = dit is prima zo</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <ThumbsDown className="w-5 h-5 text-amber-400" />
                        </div>
                        <span><strong className="text-amber-400">Aanpassen</strong> = hier wil ik iets veranderen</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('sections')}
                    className="w-full md:w-auto px-10 py-4 bg-purple-600 text-white text-lg rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Start feedback
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </motion.div>
              </div>
            )}

            {/* SECTIONS STEP */}
            {step === 'sections' && currentSection && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Section header - fixed */}
                <div className="p-4 border-b border-zinc-800 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{currentSection.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{currentSection.name}</h3>
                      <p className="text-sm text-zinc-400">{currentSection.description}</p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Feedback content - scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-sm text-zinc-400 mb-4">Wat vind je van dit onderdeel?</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => updateFeedback(currentSection.id, { rating: 'good' })}
                      className={`p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        currentFeedback?.rating === 'good'
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <ThumbsUp className="w-6 h-6 md:w-8 md:h-8" />
                      <span className="font-medium text-sm md:text-base">Goed zo!</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        updateFeedback(currentSection.id, { rating: 'change' })
                        setExpandedComment(currentSection.id)
                      }}
                      className={`p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        currentFeedback?.rating === 'change'
                          ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                          : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <ThumbsDown className="w-6 h-6 md:w-8 md:h-8" />
                      <span className="font-medium text-sm md:text-base">Aanpassen</span>
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
                        <p className="text-sm text-zinc-400 mb-2">Wat wil je aanpassen?</p>
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3">
                          {FEEDBACK_PRESETS.map(preset => {
                            const isSelected = currentFeedback?.presets.includes(preset.id)
                            return (
                              <button
                                key={preset.id}
                                onClick={() => togglePreset(currentSection.id, preset.id)}
                                className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 ${
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
                        <label className="text-sm text-zinc-400 mb-1.5 block">
                          Extra toelichting <span className="text-zinc-600">(optioneel)</span>
                        </label>
                        <textarea
                          value={currentFeedback?.comment || ''}
                          onChange={(e) => updateFeedback(currentSection.id, { comment: e.target.value })}
                          placeholder="Beschrijf hier wat je precies wilt veranderen..."
                          className="w-full h-16 md:h-20 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      Toch een opmerking toevoegen?
                    </button>
                  )}
                </div>

                {/* Navigation - fixed at bottom */}
                <div className="flex-shrink-0 p-4 border-t border-zinc-800 bg-zinc-900">
                  <div className="flex gap-3">
                    {currentSectionIndex > 0 && (
                      <button
                        onClick={goPrev}
                        className="px-3 md:px-4 py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors flex items-center gap-1 md:gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Vorige</span>
                      </button>
                    )}
                    
                    <button
                      onClick={goNext}
                      disabled={currentFeedback?.rating === null}
                      className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {currentSectionIndex < sections.length - 1 ? (
                        <>
                          Volgende
                          <ChevronRight className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          Bekijk overzicht
                          <Check className="w-5 h-5" />
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
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-400" />
                    Nog een paar vragen
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Je developer heeft nog een paar specifieke vragen voor je.
                  </p>
                </div>

                {/* Questions list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {allQuestions.map((question, index) => {
                    const answer = questionAnswers.find(qa => qa.questionId === question.id)
                    return (
                      <div key={question.id} className="bg-zinc-800/50 rounded-xl p-4">
                        <p className="text-white font-medium mb-3 flex items-start gap-2">
                          <span className="text-purple-400">{index + 1}.</span>
                          {question.question}
                        </p>
                        
                        {/* Yes/No buttons */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <button
                            onClick={() => updateQuestionAnswer(question.id, 'yes')}
                            className={`p-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                              answer?.answer === 'yes'
                                ? 'border-green-500 bg-green-500/20 text-green-400'
                                : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm font-medium">Ja, goed</span>
                          </button>
                          <button
                            onClick={() => updateQuestionAnswer(question.id, 'no')}
                            className={`p-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                              answer?.answer === 'no'
                                ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                                : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span className="text-sm font-medium">Nee, aanpassen</span>
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
                              placeholder="Wat moet er aangepast worden?"
                              className="w-full h-16 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Navigation */}
                <div className="p-4 border-t border-zinc-800 flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentSectionIndex(sections.length - 1)
                      setStep('sections')
                    }}
                    className="px-4 py-2.5 text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Terug
                  </button>
                  <button
                    onClick={() => setStep('summary')}
                    className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Bekijk overzicht
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* SUMMARY STEP */}
            {step === 'summary' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 md:p-6 border-b border-zinc-800">
                  <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                    Overzicht
                  </h3>
                  <p className="text-sm md:text-base text-zinc-400 mt-1">
                    {allGood 
                      ? 'Alles ziet er goed uit! Je kunt het design goedkeuren.'
                      : `${changeCount} onderdeel${changeCount !== 1 ? 'en' : ''} moet${changeCount === 1 ? '' : 'en'} aangepast worden.`
                    }
                  </p>
                </div>

                {/* Summary list - improved layout */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                  {sections.map((section, index) => {
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
                        <div className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
                          <span className="text-2xl md:text-3xl">{section.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-base md:text-lg font-medium text-white">{section.name}</p>
                            <p className="text-xs md:text-sm text-zinc-500">{section.description}</p>
                          </div>
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                            feedback?.rating === 'good'
                              ? 'bg-green-500/20 text-green-400'
                              : feedback?.rating === 'change'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-zinc-700 text-zinc-500'
                          }`}>
                            {feedback?.rating === 'good' && <ThumbsUp className="w-5 h-5 md:w-6 md:h-6" />}
                            {feedback?.rating === 'change' && <ThumbsDown className="w-5 h-5 md:w-6 md:h-6" />}
                          </div>
                        </div>
                        
                        {/* Expand button - only show for items with "change" rating */}
                        {feedback?.rating === 'change' && (
                          <button
                            onClick={() => setExpandedComment(isExpanded ? null : section.id)}
                            className="w-full px-4 md:px-5 pb-4 md:pb-5 pt-0 text-left"
                          >
                            <div className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                              <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              <span>Toon details</span>
                              {hasDetails && !isExpanded && (
                                <span className="text-xs text-amber-500/70">
                                  ({feedback.presets?.length || 0} tags{feedback.comment ? ', opmerking' : ''})
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
                              <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-amber-500/20 pt-4 space-y-3">
                                {/* Selected presets */}
                                {feedback?.presets && feedback.presets.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {feedback.presets.map(presetId => {
                                      const preset = FEEDBACK_PRESETS.find(p => p.id === presetId)
                                      return preset ? (
                                        <span key={presetId} className="text-sm px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                                          {preset.emoji} {preset.label}
                                        </span>
                                      ) : null
                                    })}
                                  </div>
                                )}
                                {/* Comment */}
                                {feedback?.comment && (
                                  <p className="text-sm text-zinc-300 bg-zinc-800/50 rounded-lg p-3 italic">
                                    "{feedback.comment}"
                                  </p>
                                )}
                                {/* Edit button */}
                                <button
                                  onClick={() => {
                                    setCurrentSectionIndex(index)
                                    setStep('sections')
                                  }}
                                  className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                                >
                                  ✏️ Aanpassen
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
                    <div className="mt-4 pt-4 border-t border-zinc-700">
                      <p className="text-base md:text-lg text-zinc-300 mb-3 flex items-center gap-2 font-medium">
                        <HelpCircle className="w-5 h-5 text-purple-400" />
                        Extra vragen
                      </p>
                      <div className="space-y-3">
                        {questionAnswers.filter(qa => qa.answer !== null).map(qa => (
                          <div 
                            key={qa.questionId} 
                            className={`p-4 rounded-xl border ${
                              qa.answer === 'yes' 
                                ? 'border-green-500/30 bg-green-500/10'
                                : 'border-amber-500/30 bg-amber-500/10'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                qa.answer === 'yes' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {qa.answer === 'yes' ? <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" /> : <ThumbsDown className="w-4 h-4 md:w-5 md:h-5" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm md:text-base text-white">{qa.question}</p>
                                {qa.comment && (
                                  <p className="text-xs md:text-sm text-zinc-400 mt-1 italic">"{qa.comment}"</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep('questions')}
                        className="mt-3 text-sm text-purple-400 hover:text-purple-300 font-medium"
                      >
                        ✏️ Aanpassen
                      </button>
                    </div>
                  )}

                  {/* General comment */}
                  <div className="mt-6">
                    <label className="text-sm md:text-base text-zinc-400 mb-2 block">
                      Algemene opmerkingen <span className="text-zinc-600">(optioneel)</span>
                    </label>
                    <textarea
                      value={generalComment}
                      onChange={(e) => setGeneralComment(e.target.value)}
                      placeholder="Nog iets wat je kwijt wilt?"
                      className="w-full h-24 md:h-28 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                    />
                  </div>
                </div>

                {/* Actions - improved */}
                <div className="p-4 md:p-6 border-t border-zinc-800 space-y-3">
                  {changeCount > 0 ? (
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmitting}
                      className="w-full py-4 md:py-4 bg-purple-600 text-white rounded-xl font-medium text-base md:text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5 md:w-6 md:h-6" />
                          Feedback versturen
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="w-full py-4 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium text-base md:text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      ) : (
                        <>
                          <ThumbsUp className="w-5 h-5 md:w-6 md:h-6" />
                          Design goedkeuren! 🎉
                        </>
                      )}
                    </button>
                  )}
                  
                  {allGood && (
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmitting}
                      className="w-full py-3 text-zinc-400 text-sm md:text-base hover:text-white transition-colors"
                    >
                      Toch feedback versturen
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
