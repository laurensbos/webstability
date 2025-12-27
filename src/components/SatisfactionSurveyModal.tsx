/**
 * Satisfaction Survey Modal
 * 
 * Shows after a project goes live to collect feedback
 * If rating is high (4-5), prompts for Trustpilot review
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Star,
  Heart,
  ThumbsUp,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Send
} from 'lucide-react'

interface SatisfactionSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  businessName: string
  contactName?: string
  darkMode?: boolean
}

type SurveyStep = 'rating' | 'feedback' | 'trustpilot' | 'thank-you'

// Trustpilot URL - vervang met je eigen Trustpilot bedrijfspagina
const TRUSTPILOT_URL = 'https://nl.trustpilot.com/evaluate/webstability.nl'
const GOOGLE_REVIEW_URL = 'https://g.page/r/webstability/review'

export default function SatisfactionSurveyModal({
  isOpen,
  onClose,
  projectId,
  businessName,
  contactName,
  darkMode = true
}: SatisfactionSurveyModalProps) {
  const [step, setStep] = useState<SurveyStep>('rating')
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAspects, setSelectedAspects] = useState<string[]>([])

  const aspects = [
    { id: 'communication', label: 'Communicatie', emoji: '💬' },
    { id: 'speed', label: 'Snelheid', emoji: '⚡' },
    { id: 'quality', label: 'Kwaliteit', emoji: '✨' },
    { id: 'design', label: 'Design', emoji: '🎨' },
    { id: 'support', label: 'Support', emoji: '🤝' },
    { id: 'value', label: 'Prijs/kwaliteit', emoji: '💰' }
  ]

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 1: return 'Zeer ontevreden'
      case 2: return 'Ontevreden'
      case 3: return 'Neutraal'
      case 4: return 'Tevreden'
      case 5: return 'Zeer tevreden'
      default: return 'Klik op een ster'
    }
  }

  const getRatingEmoji = (r: number) => {
    switch (r) {
      case 1: return '😞'
      case 2: return '😕'
      case 3: return '😐'
      case 4: return '😊'
      case 5: return '🤩'
      default: return '⭐'
    }
  }

  const handleRatingSubmit = async () => {
    if (rating === 0) return
    
    setIsSubmitting(true)
    
    try {
      // Save rating to backend
      await fetch(`/api/project/${projectId}/satisfaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          aspects: selectedAspects,
          step: 'rating'
        })
      })
      
      // If high rating, go to Trustpilot step
      if (rating >= 4) {
        setStep('trustpilot')
      } else {
        // If lower rating, ask for feedback
        setStep('feedback')
      }
    } catch (error) {
      console.error('Failed to save rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFeedbackSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      await fetch(`/api/project/${projectId}/satisfaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          aspects: selectedAspects,
          feedback,
          step: 'complete'
        })
      })
      
      setStep('thank-you')
    } catch (error) {
      console.error('Failed to save feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTrustpilotClick = async (platform: 'trustpilot' | 'google') => {
    // Track that user clicked review link
    try {
      await fetch(`/api/project/${projectId}/satisfaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          aspects: selectedAspects,
          reviewPlatform: platform,
          step: 'review-clicked'
        })
      })
    } catch (error) {
      console.error('Failed to track review click:', error)
    }
    
    // Open review platform
    const url = platform === 'trustpilot' ? TRUSTPILOT_URL : GOOGLE_REVIEW_URL
    window.open(url, '_blank')
    
    // Show thank you after a short delay
    setTimeout(() => {
      setStep('thank-you')
    }, 1000)
  }

  const handleSkipReview = () => {
    setStep('thank-you')
  }

  const handleClose = () => {
    // Reset state
    setStep('rating')
    setRating(0)
    setFeedback('')
    setSelectedAspects([])
    onClose()
  }

  const toggleAspect = (aspectId: string) => {
    setSelectedAspects(prev =>
      prev.includes(aspectId)
        ? prev.filter(a => a !== aspectId)
        : [...prev, aspectId]
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <div className={`rounded-2xl shadow-2xl overflow-hidden ${
              darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
            }`}>
              {/* Header */}
              <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {step === 'thank-you' ? (
                      <Heart className="w-6 h-6" />
                    ) : step === 'trustpilot' ? (
                      <Star className="w-6 h-6" />
                    ) : (
                      <Sparkles className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {step === 'thank-you' 
                        ? 'Bedankt!' 
                        : step === 'trustpilot'
                        ? 'Deel je ervaring'
                        : 'Hoe was je ervaring?'}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {step === 'thank-you'
                        ? 'We waarderen je feedback'
                        : `${businessName} is nu live!`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Rating */}
                  {step === 'rating' && (
                    <motion.div
                      key="rating"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Hoi {contactName || 'daar'}! Hoe tevreden ben je met je nieuwe website?
                        </p>
                        
                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 my-6">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-10 h-10 transition-colors ${
                                  star <= (hoveredRating || rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : darkMode ? 'text-gray-600' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        
                        {/* Rating Label */}
                        <div className="h-8">
                          {(hoveredRating || rating) > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-center gap-2"
                            >
                              <span className="text-2xl">{getRatingEmoji(hoveredRating || rating)}</span>
                              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {getRatingLabel(hoveredRating || rating)}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Aspects - only show if rating is selected */}
                      {rating > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Wat vond je vooral goed? (optioneel)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {aspects.map((aspect) => (
                              <button
                                key={aspect.id}
                                onClick={() => toggleAspect(aspect.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                                  selectedAspects.includes(aspect.id)
                                    ? 'bg-emerald-500 text-white'
                                    : darkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <span>{aspect.emoji}</span>
                                <span>{aspect.label}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <button
                        onClick={handleRatingSubmit}
                        disabled={rating === 0 || isSubmitting}
                        className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                          rating > 0
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg'
                            : darkMode
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <ThumbsUp className="w-5 h-5" />
                            Verstuur
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2a: Feedback (for lower ratings) */}
                  {step === 'feedback' && (
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="text-center">
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Bedankt voor je eerlijke feedback. Wat kunnen we verbeteren?
                        </p>
                      </div>

                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Vertel ons wat beter kon..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                          darkMode
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep('thank-you')}
                          className={`flex-1 py-3 rounded-xl font-medium transition ${
                            darkMode
                              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Overslaan
                        </button>
                        <button
                          onClick={handleFeedbackSubmit}
                          disabled={isSubmitting}
                          className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Verstuur
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2b: Trustpilot Request (for high ratings) */}
                  {step === 'trustpilot' && (
                    <motion.div
                      key="trustpilot"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">🎉</div>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          Super! Blij dat je tevreden bent!
                        </p>
                        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Zou je je ervaring willen delen? Dit helpt andere ondernemers enorm!
                        </p>
                      </div>

                      {/* Review Platform Options */}
                      <div className="space-y-3">
                        <button
                          onClick={() => handleTrustpilotClick('trustpilot')}
                          className="w-full p-4 rounded-xl bg-[#00b67a] text-white hover:bg-[#009d6a] transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <Star className="w-5 h-5 fill-white" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold">Review op Trustpilot</p>
                              <p className="text-sm text-white/80">~30 seconden</p>
                            </div>
                          </div>
                          <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition" />
                        </button>

                        <button
                          onClick={() => handleTrustpilotClick('google')}
                          className="w-full p-4 rounded-xl bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold">Review op Google</p>
                              <p className="text-sm text-gray-500">~30 seconden</p>
                            </div>
                          </div>
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition" />
                        </button>
                      </div>

                      <button
                        onClick={handleSkipReview}
                        className={`w-full py-2 text-sm ${
                          darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                        } transition`}
                      >
                        Misschien later
                      </button>
                    </motion.div>
                  )}

                  {/* Step 3: Thank You */}
                  {step === 'thank-you' && (
                    <motion.div
                      key="thank-you"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.1 }}
                        className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Bedankt voor je feedback!
                      </h3>
                      <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Je mening helpt ons om nog beter te worden.
                      </p>

                      <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                      >
                        Sluiten
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
