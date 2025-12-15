import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  CheckCircle2,
  MessageSquare,
  Type,
  Palette,
  Settings,
  Image,
  Clock,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react'

export interface FeedbackItem {
  id: string
  date: string
  page: string
  category: 'tekst' | 'design' | 'functionaliteit' | 'afbeelding' | 'anders'
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  response?: string
}

interface FeedbackModuleProps {
  projectId: string
  previewUrl?: string
  existingFeedback?: FeedbackItem[]
  onSubmit: (feedback: Omit<FeedbackItem, 'id' | 'date' | 'status'>) => Promise<void>
}

const PAGES = [
  { value: 'homepage', label: 'Homepage' },
  { value: 'over-ons', label: 'Over ons' },
  { value: 'diensten', label: 'Diensten' },
  { value: 'contact', label: 'Contact' },
  { value: 'algemeen', label: 'Algemeen / Hele website' },
]

const CATEGORIES = [
  { value: 'tekst', label: 'Tekst', icon: Type, color: 'blue' },
  { value: 'design', label: 'Design', icon: Palette, color: 'purple' },
  { value: 'functionaliteit', label: 'Functionaliteit', icon: Settings, color: 'amber' },
  { value: 'afbeelding', label: 'Afbeelding', icon: Image, color: 'green' },
  { value: 'anders', label: 'Anders', icon: MessageSquare, color: 'gray' },
]

const STATUS_CONFIG = {
  pending: { label: 'In wachtrij', color: 'bg-gray-100 text-gray-700', icon: Clock },
  in_progress: { label: 'In behandeling', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  completed: { label: 'Opgelost', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
}

export default function FeedbackModule({ 
  projectId: _projectId, 
  previewUrl, 
  existingFeedback = [],
  onSubmit 
}: FeedbackModuleProps) {
  // projectId is used by parent component for API calls
  void _projectId
  const [page, setPage] = useState('')
  const [category, setCategory] = useState<FeedbackItem['category'] | ''>('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!page || !category || !description.trim()) return

    setLoading(true)
    setError('')

    try {
      await onSubmit({
        page,
        category,
        description: description.trim()
      })
      setSubmitted(true)
      setPage('')
      setCategory('')
      setDescription('')
      
      // Reset na 3 seconden
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  const pendingCount = existingFeedback.filter(f => f.status === 'pending').length
  const inProgressCount = existingFeedback.filter(f => f.status === 'in_progress').length
  const completedCount = existingFeedback.filter(f => f.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Preview Link */}
      {previewUrl && (
        <motion.a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 transition text-center group"
        >
          <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
            <Palette className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Preview bekijken</h3>
          <p className="text-purple-600 text-sm">{previewUrl}</p>
          <p className="text-gray-500 text-xs mt-2">Opent in een nieuw venster</p>
        </motion.a>
      )}

      {/* Feedback Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            Feedback geven
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Beschrijf wat je wilt laten aanpassen
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-lg">Feedback ontvangen!</h4>
              <p className="text-gray-500 text-sm mt-1">
                We gaan ermee aan de slag en houden je op de hoogte.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              {/* Page Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Welke pagina betreft het?
                </label>
                <select
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  required
                >
                  <option value="">Selecteer een pagina...</option>
                  {PAGES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type aanpassing
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon
                    const isSelected = category === cat.value
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value as FeedbackItem['category'])}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                          isSelected
                            ? `border-${cat.color}-500 bg-${cat.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? `text-${cat.color}-600` : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${isSelected ? `text-${cat.color}-700` : 'text-gray-600'}`}>
                          {cat.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijving
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijf zo specifiek mogelijk wat je wilt laten aanpassen..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Tip: Hoe specifieker, hoe sneller we het kunnen aanpassen!
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !page || !category || !description.trim()}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
              >
                {loading ? (
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
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feedback History */}
      {existingFeedback.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
        >
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-gray-900">Eerdere feedback</h3>
              <div className="flex gap-2">
                {pendingCount > 0 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {pendingCount} wachtend
                  </span>
                )}
                {inProgressCount > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {inProgressCount} bezig
                  </span>
                )}
                {completedCount > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    {completedCount} opgelost
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-3">
                  {existingFeedback.slice().reverse().map(item => {
                    const StatusIcon = STATUS_CONFIG[item.status].icon
                    const categoryConfig = CATEGORIES.find(c => c.value === item.category)
                    const CategoryIcon = categoryConfig?.icon || MessageSquare

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border-2 ${
                          item.status === 'completed'
                            ? 'border-green-200 bg-green-50'
                            : item.status === 'in_progress'
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CategoryIcon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {PAGES.find(p => p.value === item.page)?.label || item.page}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-500">
                                {new Date(item.date).toLocaleDateString('nl-NL', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                            <p className="text-gray-900 text-sm">{item.description}</p>
                            {item.response && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs font-medium text-gray-500 mb-1">Reactie developer:</p>
                                <p className="text-sm text-gray-700">{item.response}</p>
                              </div>
                            )}
                          </div>
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_CONFIG[item.status].color}`}>
                            <StatusIcon className={`w-3 h-3 ${item.status === 'in_progress' ? 'animate-spin' : ''}`} />
                            {STATUS_CONFIG[item.status].label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
