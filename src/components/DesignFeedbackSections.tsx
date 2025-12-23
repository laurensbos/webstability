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
  Sparkles
} from 'lucide-react'

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
}

export default function DesignFeedbackSections({
  isOpen,
  onClose,
  projectId,
  designPreviewUrl,
  sections = DEFAULT_SECTIONS,
  onFeedbackSubmit,
  onApprove
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
  
  // UI state
  const [step, setStep] = useState<'intro' | 'sections' | 'summary'>('intro')
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
    }
  }, [isOpen, isMobile, sections])

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
      setStep('summary')
    }
  }

  const goPrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1)
    }
  }

  // Count feedback
  const changeCount = sectionFeedback.filter(f => f.rating === 'change').length
  const answeredCount = sectionFeedback.filter(f => f.rating !== null).length

  // Check if all sections are good
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
          generalComment
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
          generalComment
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-6"
        >
          <div className="text-7xl mb-4">
            {showSuccess === 'approved' ? '🎉' : '📨'}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {showSuccess === 'approved' ? 'Design goedgekeurd!' : 'Feedback verzonden!'}
          </h2>
          <p className="text-zinc-400">
            {showSuccess === 'approved'
              ? 'Geweldig! We gaan verder met de volgende stap.'
              : 'Bedankt! We gaan aan de slag met je feedback.'}
          </p>
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
          
          {/* Preview area - hidden on intro, smaller on desktop */}
          <div className={`${step === 'intro' ? 'hidden md:flex md:w-1/3' : isMobile ? 'h-[45vh]' : 'flex-1'} bg-zinc-950 p-4 flex items-center justify-center`}>
            <div className={`relative w-full h-full ${device === 'mobile' ? 'max-w-[375px]' : ''} bg-white rounded-lg overflow-hidden shadow-2xl`}>
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
          </div>

          {/* Feedback panel - larger on intro */}
          <div className={`${step === 'intro' ? 'flex-1 md:w-2/3' : isMobile ? 'flex-1' : 'w-full md:w-[450px] lg:w-[500px]'} bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col overflow-hidden`}>
            
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
              <div className="flex-1 flex flex-col">
                {/* Section header */}
                <div className="p-4 border-b border-zinc-800">
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

                {/* Feedback buttons */}
                <div className="flex-1 p-4 flex flex-col">
                  <p className="text-sm text-zinc-400 mb-4">Wat vind je van dit onderdeel?</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => updateFeedback(currentSection.id, { rating: 'good' })}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        currentFeedback?.rating === 'good'
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <ThumbsUp className="w-8 h-8" />
                      <span className="font-medium">Goed zo!</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        updateFeedback(currentSection.id, { rating: 'change' })
                        setExpandedComment(currentSection.id)
                      }}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        currentFeedback?.rating === 'change'
                          ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                          : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <ThumbsDown className="w-8 h-8" />
                      <span className="font-medium">Aanpassen</span>
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
                        <p className="text-sm text-zinc-400 mb-3">Wat wil je aanpassen?</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {FEEDBACK_PRESETS.map(preset => {
                            const isSelected = currentFeedback?.presets.includes(preset.id)
                            return (
                              <button
                                key={preset.id}
                                onClick={() => togglePreset(currentSection.id, preset.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
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
                        <label className="text-sm text-zinc-400 mb-2 block">
                          Extra toelichting <span className="text-zinc-600">(optioneel)</span>
                        </label>
                        <textarea
                          value={currentFeedback?.comment || ''}
                          onChange={(e) => updateFeedback(currentSection.id, { comment: e.target.value })}
                          placeholder="Beschrijf hier wat je precies wilt veranderen..."
                          className="w-full h-20 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                  <div className="flex-1" />

                  {/* Navigation */}
                  <div className="flex gap-3">
                    {currentSectionIndex > 0 && (
                      <button
                        onClick={goPrev}
                        className="px-4 py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors flex items-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Vorige
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

            {/* SUMMARY STEP */}
            {step === 'summary' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Overzicht
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    {allGood 
                      ? 'Alles ziet er goed uit! Je kunt het design goedkeuren.'
                      : `${changeCount} onderdeel${changeCount !== 1 ? 'en' : ''} moet${changeCount === 1 ? '' : 'en'} aangepast worden.`
                    }
                  </p>
                </div>

                {/* Summary list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {sections.map((section, index) => {
                    const feedback = sectionFeedback.find(f => f.sectionId === section.id)
                    return (
                      <div
                        key={section.id}
                        className={`p-3 rounded-lg border ${
                          feedback?.rating === 'good'
                            ? 'border-green-500/30 bg-green-500/10'
                            : feedback?.rating === 'change'
                            ? 'border-amber-500/30 bg-amber-500/10'
                            : 'border-zinc-700 bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{section.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{section.name}</p>
                            {/* Show selected presets */}
                            {feedback?.presets && feedback.presets.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {feedback.presets.map(presetId => {
                                  const preset = FEEDBACK_PRESETS.find(p => p.id === presetId)
                                  return preset ? (
                                    <span key={presetId} className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full">
                                      {preset.emoji} {preset.label}
                                    </span>
                                  ) : null
                                })}
                              </div>
                            )}
                            {feedback?.comment && (
                              <p className="text-xs text-zinc-400 mt-1">"{feedback.comment}"</p>
                            )}
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            feedback?.rating === 'good'
                              ? 'bg-green-500/20 text-green-400'
                              : feedback?.rating === 'change'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-zinc-700 text-zinc-500'
                          }`}>
                            {feedback?.rating === 'good' && <ThumbsUp className="w-4 h-4" />}
                            {feedback?.rating === 'change' && <ThumbsDown className="w-4 h-4" />}
                          </div>
                        </div>
                        
                        {/* Edit button */}
                        <button
                          onClick={() => {
                            setCurrentSectionIndex(index)
                            setStep('sections')
                          }}
                          className="mt-2 text-xs text-purple-400 hover:text-purple-300"
                        >
                          Aanpassen
                        </button>
                      </div>
                    )
                  })}

                  {/* General comment */}
                  <div className="mt-4">
                    <label className="text-sm text-zinc-400 mb-2 block">
                      Algemene opmerkingen <span className="text-zinc-600">(optioneel)</span>
                    </label>
                    <textarea
                      value={generalComment}
                      onChange={(e) => setGeneralComment(e.target.value)}
                      placeholder="Nog iets wat je kwijt wilt?"
                      className="w-full h-20 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-zinc-800 space-y-2">
                  {changeCount > 0 ? (
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmitting}
                      className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Feedback versturen
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <ThumbsUp className="w-5 h-5" />
                          Design goedkeuren! 🎉
                        </>
                      )}
                    </button>
                  )}
                  
                  {allGood && (
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmitting}
                      className="w-full py-2 text-zinc-400 text-sm hover:text-white transition-colors"
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
