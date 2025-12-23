import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  ExternalLink,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  Globe,
  Rocket,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  FolderOpen,
  Plus,
  Upload
} from 'lucide-react'
import confetti from 'canvas-confetti'

// Package limits for change requests per month
const PACKAGE_LIMITS: Record<string, { changes: number; label: string }> = {
  starter: { changes: 2, label: 'Starter' },
  professional: { changes: 5, label: 'Professioneel' },
  business: { changes: 999, label: 'Business' }, // Unlimited
  webshop: { changes: 999, label: 'Webshop' } // Unlimited
}

interface LiveApprovalSectionProps {
  projectPackage: string
  status: 'payment' | 'live'
  stagingUrl?: string
  liveUrl?: string
  googleDriveUrl?: string
  reviewApproved?: boolean
  reviewApprovedAt?: string
  pendingChanges?: ChangeRequest[]
  changesThisMonth?: number
  onApprove: () => Promise<void>
  onFeedback: (feedback: string) => Promise<void>
  onRequestChange: (request: ChangeRequest) => Promise<void>
}

interface ChangeRequest {
  id?: string
  description: string
  priority: 'low' | 'normal' | 'urgent'
  category: 'text' | 'design' | 'functionality' | 'other'
  attachments?: string[]
  status?: 'pending' | 'in_progress' | 'completed'
  createdAt?: string
}

// Confetti celebration
const triggerConfetti = () => {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  // Big burst first
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
  })

  frame()
}

export default function LiveApprovalSection({
  projectPackage,
  status,
  stagingUrl,
  liveUrl,
  googleDriveUrl,
  reviewApproved,
  pendingChanges = [],
  changesThisMonth = 0,
  onApprove,
  onFeedback,
  onRequestChange
}: LiveApprovalSectionProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [newChange, setNewChange] = useState<Partial<ChangeRequest>>({
    description: '',
    priority: 'normal',
    category: 'text'
  })
  const [showPendingChanges, setShowPendingChanges] = useState(true)
  const [justApproved, setJustApproved] = useState(false)

  const packageConfig = PACKAGE_LIMITS[projectPackage] || PACKAGE_LIMITS.starter
  const changesLeft = packageConfig.changes === 999 ? 999 : Math.max(0, packageConfig.changes - changesThisMonth)
  const isUnlimited = packageConfig.changes === 999

  // Trigger confetti on approval
  useEffect(() => {
    if (justApproved) {
      triggerConfetti()
      const timer = setTimeout(() => setJustApproved(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [justApproved])

  const handleApprove = async () => {
    setLoading(true)
    try {
      await onApprove()
      setJustApproved(true)
      setShowSuccess(true)
    } catch (error) {
      console.error('Approval failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return
    setLoading(true)
    try {
      await onFeedback(feedback)
      setFeedback('')
      setShowFeedbackForm(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Feedback failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeSubmit = async () => {
    if (!newChange.description?.trim()) return
    setLoading(true)
    try {
      await onRequestChange({
        description: newChange.description,
        priority: newChange.priority || 'normal',
        category: newChange.category || 'text',
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      setNewChange({ description: '', priority: 'normal', category: 'text' })
      setShowChangeForm(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Change request failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Payment phase - waiting for payment/approval before going live
  if (status === 'payment' && !reviewApproved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Staging URL Preview */}
        {stagingUrl && (
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">Preview website</h3>
                <p className="text-gray-400 text-sm mt-1 mb-4">
                  Bekijk je website en test alle pagina's. Werkt alles naar wens?
                </p>
                <a
                  href={stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition shadow-lg shadow-amber-500/25"
                >
                  <ExternalLink className="w-4 h-4" />
                  Bekijk preview
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Approval Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="font-semibold text-white text-lg mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-400" />
            Beoordeling
          </h3>
          <p className="text-gray-400 text-sm mb-5">
            Is alles naar wens? Keur goed om live te gaan, of geef feedback voor aanpassingen.
          </p>

          <AnimatePresence mode="wait">
            {showFeedbackForm ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Beschrijf wat je aangepast wilt hebben...&#10;&#10;Bijv:&#10;- De titel op de homepage moet anders&#10;- De kleur van de knoppen is niet goed&#10;- Er mist nog een pagina"
                  className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={loading || !feedback.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Verstuur feedback
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition border border-gray-600"
                >
                  <ThumbsDown className="w-5 h-5 text-amber-400" />
                  Aanpassingen nodig
                </button>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-500/25"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ThumbsUp className="w-5 h-5" />
                      Goedkeuren & Live!
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {showSuccess && !justApproved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 font-medium">Je feedback is verstuurd!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Just approved - celebration screen
  if (justApproved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-emerald-500/40 rounded-2xl p-8 text-center relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/40"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Rocket className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Gefeliciteerd!</h2>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-xl text-emerald-300 mb-2">Je website gaat live! 🎉</p>
            <p className="text-gray-400">
              We zetten je website nu online. Je ontvangt een e-mail zodra alles klaar is.
            </p>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Live phase - show live URL and change request system
  if (status === 'live' || reviewApproved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Live Website Link */}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/40 rounded-xl p-5 hover:border-emerald-500/60 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-lg">Je website is live!</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                    Online
                  </span>
                </div>
                <p className="text-emerald-400 text-sm mt-1">{liveUrl}</p>
              </div>
              <ExternalLink className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition" />
            </div>
          </a>
        )}

        {/* Change Request System */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-primary-400" />
                  Aanpassingen aanvragen
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Wil je iets gewijzigd hebben? Dien een aanvraag in.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {isUnlimited ? '∞' : changesLeft}
                </div>
                <div className="text-xs text-gray-500">
                  {isUnlimited ? 'Onbeperkt' : `van ${packageConfig.changes}/maand`}
                </div>
              </div>
            </div>

            {/* Package info */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="px-2.5 py-1 bg-primary-500/20 text-primary-400 rounded-full font-medium">
                {packageConfig.label}
              </span>
              {!isUnlimited && changesLeft === 0 && (
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                  Limiet bereikt
                </span>
              )}
            </div>
          </div>

          {/* New change request form */}
          <AnimatePresence>
            {showChangeForm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 bg-gray-900/50"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Wat wil je aangepast hebben?
                    </label>
                    <textarea
                      value={newChange.description}
                      onChange={(e) => setNewChange(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Beschrijf de aanpassing zo duidelijk mogelijk...&#10;&#10;Bijv: 'Verander de tekst op de homepage van ... naar ...'"
                      className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Categorie
                      </label>
                      <select
                        value={newChange.category}
                        onChange={(e) => setNewChange(prev => ({ ...prev, category: e.target.value as ChangeRequest['category'] }))}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      >
                        <option value="text">Tekst aanpassing</option>
                        <option value="design">Design wijziging</option>
                        <option value="functionality">Functionaliteit</option>
                        <option value="other">Overig</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prioriteit
                      </label>
                      <select
                        value={newChange.priority}
                        onChange={(e) => setNewChange(prev => ({ ...prev, priority: e.target.value as ChangeRequest['priority'] }))}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      >
                        <option value="low">Laag - kan wachten</option>
                        <option value="normal">Normaal</option>
                        <option value="urgent">Urgent - zo snel mogelijk</option>
                      </select>
                    </div>
                  </div>

                  {/* Drive link for attachments */}
                  {googleDriveUrl && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <FolderOpen className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-blue-400 font-medium text-sm">
                            Bestanden bijvoegen?
                          </p>
                          <p className="text-blue-300/70 text-xs mt-1">
                            Upload afbeeldingen of documenten naar je Google Drive map.
                          </p>
                          <a
                            href={googleDriveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-400 hover:text-blue-300"
                          >
                            <Upload className="w-4 h-4" />
                            Open Drive map
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowChangeForm(false)}
                      className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handleChangeSubmit}
                      disabled={loading || !newChange.description?.trim() || (!isUnlimited && changesLeft === 0)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Verstuur aanvraag
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-5">
                <button
                  onClick={() => setShowChangeForm(true)}
                  disabled={!isUnlimited && changesLeft === 0}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-primary-500/20 hover:bg-primary-500/30 disabled:bg-gray-700/50 disabled:text-gray-600 border border-primary-500/30 disabled:border-gray-700 text-primary-400 disabled:cursor-not-allowed font-medium rounded-xl transition"
                >
                  <Plus className="w-5 h-5" />
                  Nieuwe aanpassing aanvragen
                </button>
                {!isUnlimited && changesLeft === 0 && (
                  <p className="text-center text-gray-500 text-xs mt-3">
                    Je hebt je maandelijkse limiet bereikt. Upgrade naar een hoger pakket voor meer aanpassingen.
                  </p>
                )}
              </div>
            )}
          </AnimatePresence>

          {/* Pending changes */}
          {pendingChanges.length > 0 && (
            <div className="border-t border-gray-700">
              <button
                onClick={() => setShowPendingChanges(!showPendingChanges)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    Openstaande aanvragen ({pendingChanges.length})
                  </span>
                </div>
                {showPendingChanges ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {showPendingChanges && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3">
                      {pendingChanges.map((change, index) => (
                        <div
                          key={change.id || index}
                          className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-white text-sm">{change.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                  change.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                  change.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {change.status === 'completed' ? 'Voltooid' :
                                   change.status === 'in_progress' ? 'In behandeling' : 'In wachtrij'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {change.createdAt && new Date(change.createdAt).toLocaleDateString('nl-NL')}
                                </span>
                              </div>
                            </div>
                            {change.status === 'completed' && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Success toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 font-medium">Aanvraag succesvol verstuurd!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return null
}
