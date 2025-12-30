/**
 * DesignFeedback Component
 * 
 * Een gestructureerde feedback tool voor design review.
 * Ondersteunt website, webshop, logo en drone projecten.
 * Klanten kunnen per onderdeel feedback geven met prioriteit.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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

// Service-specific feedback categories - now using translation keys
const FEEDBACK_CATEGORY_KEYS = {
  website: ['algemeen', 'kleuren', 'teksten', 'layout', 'afbeeldingen', 'mobiel'],
  webshop: ['algemeen', 'kleuren', 'producten', 'layout', 'checkout', 'mobiel'],
  logo: ['algemeen', 'vorm', 'typografie', 'kleuren', 'varianten'],
  drone: ['algemeen', 'video', 'foto', 'editing', 'muziek'],
}

const CATEGORY_ICONS = {
  algemeen: Sparkles,
  kleuren: Palette,
  teksten: Type,
  layout: Layout,
  afbeeldingen: Image,
  mobiel: Smartphone,
  producten: ShoppingCart,
  checkout: Globe,
  vorm: PenTool,
  typografie: Type,
  varianten: Layout,
  video: Video,
  foto: Camera,
  editing: Zap,
  muziek: Sparkles,
}

// Quick feedback option keys
const QUICK_FEEDBACK_KEYS = [
  { emoji: '👍', key: 'looksGood' },
  { emoji: '🎨', key: 'differentColors' },
  { emoji: '📝', key: 'adjustText' },
  { emoji: '📷', key: 'differentImage' },
  { emoji: '↔️', key: 'sizeChange' },
  { emoji: '🔄', key: 'rearrange' },
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
  const { t } = useTranslation()
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>(existingFeedback)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currentFeedback, setCurrentFeedback] = useState('')
  const [currentRating, setCurrentRating] = useState<'positive' | 'neutral' | 'negative'>('neutral')
  const [currentPriority, setCurrentPriority] = useState<'low' | 'normal' | 'urgent'>('normal')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // Build categories from translation keys
  const categoryKeys = FEEDBACK_CATEGORY_KEYS[serviceType] || FEEDBACK_CATEGORY_KEYS.website
  const categories = categoryKeys.map((id: string) => ({
    id,
    label: t(`designFeedback.categories.${serviceType}.${id}.label`),
    description: t(`designFeedback.categories.${serviceType}.${id}.description`),
    icon: CATEGORY_ICONS[id as keyof typeof CATEGORY_ICONS] || Sparkles
  }))

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative bg-gray-900 rounded-2xl border-2 border-gray-800 overflow-hidden shadow-xl shadow-black/30"
    >
      {/* Gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
      
      {/* Decorative blur orbs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 opacity-15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header - Enhanced */}
      <div className="relative p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t('designFeedback.title')}</h3>
              <p className="text-sm text-gray-400">
                {serviceType === 'logo' ? t('designFeedback.descriptionLogo') :
                 serviceType === 'drone' ? t('designFeedback.descriptionDrone') :
                 serviceType === 'webshop' ? t('designFeedback.descriptionWebshop') :
                 t('designFeedback.descriptionWebsite')}
              </p>
            </div>
          </div>
          
          {designPreviewUrl && (
            <motion.a
              href={designPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-xl text-sm font-semibold hover:from-purple-500/30 hover:to-pink-500/30 transition border border-purple-500/30"
            >
              {t('designFeedback.viewDesign')}
            </motion.a>
          )}
        </div>

        {/* Feedback summary - Enhanced */}
        {feedbackEntries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5 p-4 bg-gray-800/60 rounded-xl border border-gray-700/50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ThumbsUp className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm font-semibold text-green-400">{positiveCount}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-blue-400">{neutralCount}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-amber-400">{negativeCount}</span>
            </div>
            <span className="text-sm text-gray-400 ml-auto font-medium">
              {t('designFeedback.feedbackPoints', { count: feedbackEntries.length })}
            </span>
          </motion.div>
        )}
      </div>

      {/* Categories - Enhanced */}
      <div className="relative divide-y divide-gray-800/50">
        {categories.map((category, categoryIndex) => {
          const categoryFeedback = getFeedbackForCategory(category.id)
          const isExpanded = expandedCategory === category.id
          const CategoryIcon = category.icon

          return (
            <motion.div 
              key={category.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.05 }}
              className="bg-gray-900"
            >
              {/* Category header - Enhanced */}
              <motion.button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
                className="w-full p-5 flex items-center gap-4 transition text-left"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  categoryFeedback.length > 0 
                    ? categoryFeedback.some(f => f.rating === 'negative') 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/25' 
                      : 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/25'
                    : 'bg-gray-800'
                }`}>
                  {categoryFeedback.length > 0 ? (
                    categoryFeedback.some(f => f.rating === 'negative') 
                      ? <AlertCircle className="w-5 h-5 text-white" />
                      : <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <CategoryIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{category.label}</p>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </div>
                {categoryFeedback.length > 0 && (
                  <span className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm font-semibold text-gray-200">
                    {categoryFeedback.length}
                  </span>
                )}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </motion.button>

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
                        {QUICK_FEEDBACK_KEYS.map((option, i) => {
                          const label = t(`designFeedback.quickFeedback.${option.key}`)
                          return (
                            <button
                              key={i}
                              onClick={() => addQuickFeedback(category.id, `${option.emoji} ${label}`)}
                              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition flex items-center gap-1.5"
                            >
                              <span>{option.emoji}</span>
                              <span>{label}</span>
                            </button>
                          )
                        })}
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
                                    {t('designFeedback.urgent')}
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
                            <span className="text-sm text-gray-400 w-20">{t('designFeedback.rating.type')}</span>
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
                            <span className="text-sm text-gray-400 w-20">{t('designFeedback.priority.label')}</span>
                            <select
                              value={currentPriority}
                              onChange={(e) => setCurrentPriority(e.target.value as 'low' | 'normal' | 'urgent')}
                              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                            >
                              <option value="low">{t('designFeedback.priority.low')}</option>
                              <option value="normal">{t('designFeedback.priority.normal')}</option>
                              <option value="urgent">{t('designFeedback.priority.urgent')}</option>
                            </select>
                          </div>

                          {/* Feedback text */}
                          <textarea
                            value={currentFeedback}
                            onChange={(e) => setCurrentFeedback(e.target.value)}
                            placeholder={t('designFeedback.feedbackPlaceholder')}
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
                              {t('designFeedback.add')}
                            </button>
                            <button
                              onClick={() => setActiveCategory(null)}
                              className="px-4 py-2 text-gray-400 hover:text-white transition"
                            >
                              {t('designFeedback.cancel')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          className="w-full p-4 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-purple-500 hover:text-purple-400 transition flex items-center justify-center gap-2 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          {t('designFeedback.addFeedback')}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Submit section - Enhanced */}
      <div className="relative p-6 border-t border-gray-800 bg-gradient-to-t from-gray-800/80 to-gray-900">
        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/30">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <p className="text-xl font-bold text-white mb-1">{t('designFeedback.feedbackSent')}</p>
            <p className="text-sm text-gray-400">{t('designFeedback.feedbackSentDesc')}</p>
          </motion.div>
        ) : (
          <>
            {feedbackEntries.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">
                {t('designFeedback.clickToGiveFeedback')}
              </p>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="text-sm text-gray-400">
                  {t('designFeedback.feedbackPoints', { count: feedbackEntries.length })}
                  {negativeCount > 0 && (
                    <span className="text-amber-400"> • {t('designFeedback.changesNeeded', { count: negativeCount })}</span>
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
                      {t('designFeedback.approveDesign')}
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
                      {t('designFeedback.sendFeedback')}
                    </button>
                  )}
                </div>

                {negativeCount > 0 && (
                  <p className="text-xs text-center text-gray-500">
                    {t('designFeedback.afterProcessing')}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

export default DesignFeedback
