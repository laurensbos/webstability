/**
 * DesignFeedback Component
 * 
 * Een gestructureerde feedback tool voor design review.
 * Ondersteunt website, webshop, logo en drone projecten.
 * Klanten kunnen per onderdeel feedback geven met prioriteit.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Send,
  Palette,
  Type,
  Layout,
  Image,
  ShoppingCart,
  Globe,
  Smartphone,
  ChevronDown,
  Sparkles,
  PenTool,
  Video,
  Camera,
  Zap
} from 'lucide-react'

// Service-specific feedback categories
const FEEDBACK_CATEGORIES = {
  website: [
    { id: 'algemeen', label: 'Algemene indruk', icon: Sparkles, description: 'Eerste indruk van het ontwerp' },
    { id: 'kleuren', label: 'Kleuren & stijl', icon: Palette, description: 'Kleurenpalet en visuele stijl' },
    { id: 'teksten', label: 'Teksten & content', icon: Type, description: 'Koppen, teksten en opmaak' },
    { id: 'layout', label: 'Layout & structuur', icon: Layout, description: 'Indeling en navigatie' },
    { id: 'afbeeldingen', label: 'Afbeeldingen', icon: Image, description: "Foto's en graphics" },
    { id: 'mobiel', label: 'Mobiele weergave', icon: Smartphone, description: 'Hoe het eruitziet op telefoon' },
  ],
  webshop: [
    { id: 'algemeen', label: 'Algemene indruk', icon: Sparkles, description: 'Eerste indruk van de webshop' },
    { id: 'kleuren', label: 'Kleuren & branding', icon: Palette, description: 'Kleurenpalet past bij merk' },
    { id: 'producten', label: 'Product weergave', icon: ShoppingCart, description: 'Hoe producten worden getoond' },
    { id: 'layout', label: 'Layout & navigatie', icon: Layout, description: 'Menu, categorieën, zoeken' },
    { id: 'checkout', label: 'Bestellen & betalen', icon: Globe, description: 'Winkelwagen en checkout flow' },
    { id: 'mobiel', label: 'Mobiele weergave', icon: Smartphone, description: 'Hoe het eruitziet op telefoon' },
  ],
  logo: [
    { id: 'algemeen', label: 'Algemene indruk', icon: Sparkles, description: 'Wat vind je van de concepten?' },
    { id: 'vorm', label: 'Vorm & symbool', icon: PenTool, description: 'Het icoon/symbool van het logo' },
    { id: 'typografie', label: 'Lettertype', icon: Type, description: 'De letters en tekststijl' },
    { id: 'kleuren', label: 'Kleuren', icon: Palette, description: 'Kleurkeuze en combinaties' },
    { id: 'varianten', label: 'Varianten', icon: Layout, description: 'Verschillende versies van het logo' },
  ],
  drone: [
    { id: 'algemeen', label: 'Algemene indruk', icon: Sparkles, description: 'Wat vind je van de beelden?' },
    { id: 'video', label: 'Video kwaliteit', icon: Video, description: 'Scherpte en vloeiendheid' },
    { id: 'foto', label: "Foto's", icon: Camera, description: "Kwaliteit van de foto's" },
    { id: 'editing', label: 'Bewerking', icon: Zap, description: 'Kleuren, snelheid, overgangen' },
    { id: 'muziek', label: 'Muziek & geluid', icon: Sparkles, description: 'Audio en muziekkeuze' },
  ],
}

// Quick feedback options
const QUICK_FEEDBACK_OPTIONS = [
  { emoji: '👍', label: 'Ziet er goed uit!' },
  { emoji: '🎨', label: 'Andere kleuren graag' },
  { emoji: '📝', label: 'Tekst aanpassen' },
  { emoji: '📷', label: 'Andere afbeelding' },
  { emoji: '↔️', label: 'Iets groter/kleiner' },
  { emoji: '🔄', label: 'Anders indelen' },
]

interface FeedbackEntry {
  id: string
  category: string
  rating: 'positive' | 'neutral' | 'negative'
  feedback: string
  priority: 'low' | 'normal' | 'urgent'
}

interface DesignFeedbackProps {
  projectId: string
  serviceType: 'website' | 'webshop' | 'logo' | 'drone'
  designPreviewUrl?: string
  onSubmit?: (feedback: FeedbackEntry[], overallApproved: boolean) => Promise<void>
  onClose?: () => void
  existingFeedback?: FeedbackEntry[]
}

export function DesignFeedback({
  projectId,
  serviceType,
  designPreviewUrl,
  onSubmit,
  onClose,
  existingFeedback = []
}: DesignFeedbackProps) {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>(existingFeedback)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currentFeedback, setCurrentFeedback] = useState('')
  const [currentRating, setCurrentRating] = useState<'positive' | 'neutral' | 'negative'>('neutral')
  const [currentPriority, setCurrentPriority] = useState<'low' | 'normal' | 'urgent'>('normal')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const categories = FEEDBACK_CATEGORIES[serviceType] || FEEDBACK_CATEGORIES.website

  // Add feedback for a category
  const addFeedback = () => {
    if (!activeCategory || !currentFeedback.trim()) return

    const newEntry: FeedbackEntry = {
      id: Date.now().toString(),
      category: activeCategory,
      rating: currentRating,
      feedback: currentFeedback.trim(),
      priority: currentPriority
    }

    setFeedbackEntries(prev => [...prev, newEntry])
    setCurrentFeedback('')
    setCurrentRating('neutral')
    setCurrentPriority('normal')
    setActiveCategory(null)
  }

  // Add quick feedback
  const addQuickFeedback = (categoryId: string, quickOption: string) => {
    const newEntry: FeedbackEntry = {
      id: Date.now().toString(),
      category: categoryId,
      rating: quickOption.includes('👍') ? 'positive' : 'neutral',
      feedback: quickOption,
      priority: 'normal'
    }
    setFeedbackEntries(prev => [...prev, newEntry])
  }

  // Remove feedback
  const removeFeedback = (id: string) => {
    setFeedbackEntries(prev => prev.filter(f => f.id !== id))
  }

  // Get feedback for category
  const getFeedbackForCategory = (categoryId: string) => {
    return feedbackEntries.filter(f => f.category === categoryId)
  }

  // Count feedback by rating
  const positiveCount = feedbackEntries.filter(f => f.rating === 'positive').length
  const negativeCount = feedbackEntries.filter(f => f.rating === 'negative').length
  const neutralCount = feedbackEntries.filter(f => f.rating === 'neutral').length

  // Submit all feedback
  const handleSubmit = async (approved: boolean) => {
    setSubmitting(true)
    try {
      // Call API to save feedback
      const response = await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          approved,
          type: 'design',
          feedbackItems: feedbackEntries.map(f => ({
            category: f.category,
            rating: f.rating,
            feedback: f.feedback,
            priority: f.priority
          }))
        })
      })

      if (response.ok) {
        if (onSubmit) {
          await onSubmit(feedbackEntries, approved)
        }
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          if (onClose) onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
    setSubmitting(false)
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Design Feedback</h3>
              <p className="text-sm text-gray-500">
                {serviceType === 'logo' ? 'Geef feedback op de logo concepten' :
                 serviceType === 'drone' ? 'Geef feedback op de beelden' :
                 serviceType === 'webshop' ? 'Geef feedback op je webshop design' :
                 'Geef feedback op je website design'}
              </p>
            </div>
          </div>
          
          {designPreviewUrl && (
            <a
              href={designPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition"
            >
              Bekijk design →
            </a>
          )}
        </div>

        {/* Feedback summary */}
        {feedbackEntries.length > 0 && (
          <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">{positiveCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">{neutralCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">{negativeCount}</span>
            </div>
            <span className="text-xs text-gray-500 ml-auto">
              {feedbackEntries.length} feedback punt{feedbackEntries.length !== 1 ? 'en' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="divide-y divide-gray-800">
        {categories.map((category) => {
          const categoryFeedback = getFeedbackForCategory(category.id)
          const isExpanded = expandedCategory === category.id
          const CategoryIcon = category.icon

          return (
            <div key={category.id} className="bg-gray-900">
              {/* Category header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-800/50 transition text-left"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  categoryFeedback.length > 0 
                    ? categoryFeedback.some(f => f.rating === 'negative') 
                      ? 'bg-amber-500/20' 
                      : 'bg-green-500/20'
                    : 'bg-gray-800'
                }`}>
                  {categoryFeedback.length > 0 ? (
                    categoryFeedback.some(f => f.rating === 'negative') 
                      ? <AlertCircle className="w-5 h-5 text-amber-400" />
                      : <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <CategoryIcon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{category.label}</p>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
                {categoryFeedback.length > 0 && (
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                    {categoryFeedback.length}
                  </span>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-500 transition ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Category content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      {/* Quick options */}
                      <div className="flex flex-wrap gap-2">
                        {QUICK_FEEDBACK_OPTIONS.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => addQuickFeedback(category.id, `${option.emoji} ${option.label}`)}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition flex items-center gap-1.5"
                          >
                            <span>{option.emoji}</span>
                            <span>{option.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Existing feedback for this category */}
                      {categoryFeedback.length > 0 && (
                        <div className="space-y-2">
                          {categoryFeedback.map((entry) => (
                            <div
                              key={entry.id}
                              className={`p-3 rounded-lg border flex items-start gap-3 ${
                                entry.rating === 'positive' ? 'bg-green-500/10 border-green-500/30' :
                                entry.rating === 'negative' ? 'bg-amber-500/10 border-amber-500/30' :
                                'bg-gray-800 border-gray-700'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                                entry.rating === 'positive' ? 'bg-green-500/20' :
                                entry.rating === 'negative' ? 'bg-amber-500/20' :
                                'bg-gray-700'
                              }`}>
                                {entry.rating === 'positive' ? (
                                  <ThumbsUp className="w-3 h-3 text-green-400" />
                                ) : entry.rating === 'negative' ? (
                                  <AlertCircle className="w-3 h-3 text-amber-400" />
                                ) : (
                                  <MessageSquare className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white break-words">{entry.feedback}</p>
                                {entry.priority === 'urgent' && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeFeedback(entry.id)}
                                className="p-1 text-gray-500 hover:text-red-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add new feedback */}
                      {activeCategory === category.id ? (
                        <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                          {/* Rating selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 w-20">Type:</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setCurrentRating('positive')}
                                className={`p-2 rounded-lg transition ${
                                  currentRating === 'positive' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-gray-700 text-gray-400 hover:text-green-400'
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setCurrentRating('neutral')}
                                className={`p-2 rounded-lg transition ${
                                  currentRating === 'neutral' 
                                    ? 'bg-blue-500/20 text-blue-400' 
                                    : 'bg-gray-700 text-gray-400 hover:text-blue-400'
                                }`}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setCurrentRating('negative')}
                                className={`p-2 rounded-lg transition ${
                                  currentRating === 'negative' 
                                    ? 'bg-amber-500/20 text-amber-400' 
                                    : 'bg-gray-700 text-gray-400 hover:text-amber-400'
                                }`}
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Priority selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 w-20">Prioriteit:</span>
                            <select
                              value={currentPriority}
                              onChange={(e) => setCurrentPriority(e.target.value as 'low' | 'normal' | 'urgent')}
                              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                            >
                              <option value="low">Laag - nice to have</option>
                              <option value="normal">Normaal</option>
                              <option value="urgent">Urgent - moet echt anders</option>
                            </select>
                          </div>

                          {/* Feedback text */}
                          <textarea
                            value={currentFeedback}
                            onChange={(e) => setCurrentFeedback(e.target.value)}
                            placeholder="Beschrijf je feedback zo duidelijk mogelijk..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 outline-none resize-none"
                            rows={3}
                          />

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={addFeedback}
                              disabled={!currentFeedback.trim()}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Toevoegen
                            </button>
                            <button
                              onClick={() => setActiveCategory(null)}
                              className="px-4 py-2 text-gray-400 hover:text-white transition"
                            >
                              Annuleren
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          className="w-full p-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-400 transition flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Feedback toevoegen
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Submit section */}
      <div className="p-5 border-t border-gray-800 bg-gray-800/50">
        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-lg font-medium text-white">Feedback verzonden!</p>
            <p className="text-sm text-gray-400">We gaan er direct mee aan de slag</p>
          </motion.div>
        ) : (
          <>
            {feedbackEntries.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">
                Klik op een onderdeel hierboven om feedback te geven
              </p>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="text-sm text-gray-400">
                  <strong className="text-white">{feedbackEntries.length}</strong> feedback punt{feedbackEntries.length !== 1 ? 'en' : ''} 
                  {negativeCount > 0 && (
                    <span className="text-amber-400"> • {negativeCount} wijziging{negativeCount !== 1 ? 'en' : ''} nodig</span>
                  )}
                </div>

                {/* Submit buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {negativeCount === 0 && positiveCount > 0 ? (
                    // All positive - can approve
                    <button
                      onClick={() => handleSubmit(true)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-400 hover:to-emerald-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ThumbsUp className="w-5 h-5" />
                      )}
                      Design goedkeuren ✨
                    </button>
                  ) : (
                    // Has changes needed - submit feedback
                    <button
                      onClick={() => handleSubmit(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-indigo-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      Feedback versturen
                    </button>
                  )}
                </div>

                {negativeCount > 0 && (
                  <p className="text-xs text-center text-gray-500">
                    Na het verwerken van de feedback kun je het design opnieuw bekijken
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DesignFeedback
