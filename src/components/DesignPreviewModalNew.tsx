/**
 * DesignPreviewModal - Simpele, mobiel-vriendelijke versie
 * 
 * Filosofie:
 * - Full-screen preview (geen split-screen)
 * - Grote, duidelijke knoppen
 * - Simpel feedback formulier
 * - Werkt perfect op mobiel én desktop
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
  MessageSquare,
  CheckCircle2,
  Loader2,
  Send,
  ArrowLeft,
  Sparkles
} from 'lucide-react'

interface DesignPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  designPreviewUrl: string
  onFeedbackSubmit?: () => Promise<void>
  onApprove?: () => Promise<void>
}

// Quick feedback tags - simpel en duidelijk
const QUICK_TAGS = [
  { id: 'colors', label: 'Kleuren aanpassen', emoji: '🎨' },
  { id: 'fonts', label: 'Lettertype wijzigen', emoji: '✏️' },
  { id: 'images', label: 'Andere foto\'s', emoji: '📷' },
  { id: 'layout', label: 'Andere indeling', emoji: '📐' },
  { id: 'text', label: 'Teksten aanpassen', emoji: '💬' },
  { id: 'more-space', label: 'Meer ruimte', emoji: '↔️' },
  { id: 'less-busy', label: 'Rustiger design', emoji: '✨' },
  { id: 'complete-redesign', label: 'Compleet anders', emoji: '🔄' },
]

export default function DesignPreviewModal({
  isOpen,
  onClose,
  projectId,
  designPreviewUrl,
  onFeedbackSubmit,
  onApprove
}: DesignPreviewModalProps) {
  // States
  const [view, setView] = useState<'preview' | 'feedback' | 'success'>('preview')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successType, setSuccessType] = useState<'approved' | 'feedback' | null>(null)
  
  // Feedback form
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [feedbackText, setFeedbackText] = useState('')

  // Ensure URL is absolute
  const absoluteUrl = (() => {
    if (!designPreviewUrl) return ''
    if (designPreviewUrl.startsWith('http://') || designPreviewUrl.startsWith('https://')) {
      return designPreviewUrl
    }
    return `https://${designPreviewUrl}`
  })()

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setView('preview')
      setDevice('desktop')
      setIframeLoaded(false)
      setSelectedTags([])
      setFeedbackText('')
      setSuccessType(null)
    }
  }, [isOpen])

  // Confetti animation
  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#a855f7', '#22c55e', '#3b82f6', '#f59e0b']
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#a855f7', '#22c55e', '#3b82f6', '#f59e0b']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  // Toggle tag
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    )
  }

  // Approve design
  const handleApprove = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          approved: true,
          type: 'design'
        })
      })

      if (!response.ok) throw new Error('Failed to approve')

      triggerConfetti()
      setSuccessType('approved')
      setView('success')
      
      if (onApprove) await onApprove()
      
      setTimeout(() => onClose(), 3500)
    } catch (error) {
      console.error('Error approving:', error)
      alert('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (selectedTags.length === 0 && !feedbackText.trim()) {
      alert('Selecteer minimaal één optie of typ je feedback.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Determine severity based on tags
      const isLarge = selectedTags.includes('complete-redesign')
      const severity = isLarge ? 'large' : selectedTags.length > 3 ? 'medium' : 'small'

      const response = await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          approved: false,
          type: 'design',
          severity,
          quickTags: selectedTags,
          details: feedbackText.trim(),
          feedbackItems: [{
            category: 'design',
            type: 'suggestion',
            text: [
              ...selectedTags.map(t => QUICK_TAGS.find(tag => tag.id === t)?.label || t),
              feedbackText.trim()
            ].filter(Boolean).join(' | ')
          }]
        })
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSuccessType('feedback')
      setView('success')
      
      if (onFeedbackSubmit) await onFeedbackSubmit()
      
      setTimeout(() => onClose(), 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Success Screen */}
        {view === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900 p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-center max-w-md"
            >
              {successType === 'approved' ? (
                <>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-14 h-14 text-green-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Goedgekeurd! 🎉
                  </h2>
                  <p className="text-xl text-gray-300 mb-2">
                    Super, je design is goedgekeurd!
                  </p>
                  <p className="text-purple-400 font-medium">
                    Je gaat nu door naar de betaling...
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                    className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Send className="w-14 h-14 text-purple-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Verstuurd! ✨
                  </h2>
                  <p className="text-xl text-gray-300 mb-2">
                    Bedankt voor je feedback!
                  </p>
                  <p className="text-purple-400 font-medium">
                    Onze designer gaat ermee aan de slag.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Feedback Form */}
        {view === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute inset-0 flex flex-col bg-gray-900"
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-800 sm:px-6">
              <button
                onClick={() => setView('preview')}
                className="p-2 hover:bg-gray-800 rounded-xl transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-lg font-bold text-white">Wat wil je aanpassen?</h2>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Quick tags */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Kies wat van toepassing is:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedTags.includes(tag.id)
                          ? 'bg-purple-500 text-white scale-105'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {tag.emoji} {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text feedback */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Of beschrijf in je eigen woorden:
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Bijv. 'Ik zou graag meer blauw in het design zien' of 'De header mag iets kleiner'"
                  className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Selected summary */}
              {selectedTags.length > 0 && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-purple-300">
                    <span className="font-medium">Geselecteerd:</span>{' '}
                    {selectedTags.map(t => QUICK_TAGS.find(tag => tag.id === t)?.label).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Footer with submit button */}
            <div className="p-4 border-t border-gray-800 bg-gray-900 sm:p-6">
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || (selectedTags.length === 0 && !feedbackText.trim())}
                className="w-full py-4 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Versturen...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Feedback versturen
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Preview View */}
        {view === 'preview' && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 sm:px-6">
              {/* Device toggle */}
              <div className="flex items-center gap-1 bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    device === 'desktop' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    device === 'mobile' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Mobiel</span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {absoluteUrl && (
                  <a
                    href={absoluteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition"
                    title="Open in nieuw tabblad"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview frame */}
            <div className="flex-1 bg-gray-950 flex items-center justify-center p-4 overflow-hidden">
              <div 
                className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                  device === 'desktop' 
                    ? 'w-full h-full max-w-6xl' 
                    : 'w-[375px] h-[90%] max-h-[812px]'
                }`}
                style={{
                  border: device === 'mobile' ? '10px solid #374151' : '4px solid #374151'
                }}
              >
                {/* Mobile notch */}
                {device === 'mobile' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-700 rounded-b-2xl z-10" />
                )}

                {/* Loading spinner */}
                {!iframeLoaded && absoluteUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                    <p className="text-gray-600 font-medium">Design laden...</p>
                  </div>
                )}

                {/* Iframe */}
                {absoluteUrl && (
                  <iframe
                    src={absoluteUrl}
                    className={`w-full h-full border-0 transition-opacity duration-300 ${
                      iframeLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setIframeLoaded(true)}
                    title="Design Preview"
                  />
                )}

                {/* No URL placeholder */}
                {!absoluteUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
                    <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Design preview komt eraan
                    </h3>
                    <p className="text-gray-600">
                      Je ontvangt bericht zodra je design klaar is.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons - fixed at bottom */}
            <div className="bg-gray-900 border-t border-gray-800 p-4 sm:p-6">
              <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setView('feedback')}
                  className="flex-1 py-4 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Feedback geven
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Bezig...
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="w-5 h-5" />
                      Goedkeuren
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
