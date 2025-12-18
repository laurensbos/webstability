import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Palette,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Loader2,
  Sparkles,
  ArrowRight,
  Eye,
  Star,
  Shield,
  Clock,
  CreditCard
} from 'lucide-react'

interface DesignApprovalCardProps {
  projectId: string
  previewUrl?: string
  designApprovedAt?: string
  paymentStatus?: string
  onApprove: (feedback?: string) => Promise<void>
  onRequestChanges: (feedback: string) => Promise<void>
}

export default function DesignApprovalCard({
  projectId: _projectId,
  previewUrl,
  designApprovedAt,
  paymentStatus,
  onApprove,
  onRequestChanges
}: DesignApprovalCardProps) {
  void _projectId
  const [mode, setMode] = useState<'initial' | 'approve' | 'changes'>('initial')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [approved, setApproved] = useState(!!designApprovedAt)

  const handleApprove = async () => {
    setLoading(true)
    try {
      await onApprove(feedback)
      setApproved(true)
    } catch (err) {
      console.error('Approval error:', err)
    }
    setLoading(false)
  }

  const handleRequestChanges = async () => {
    if (!feedback.trim()) return
    setLoading(true)
    try {
      await onRequestChanges(feedback)
      setMode('initial')
      setFeedback('')
    } catch (err) {
      console.error('Change request error:', err)
    }
    setLoading(false)
  }

  // Al goedgekeurd - wacht op betaling
  if (approved && paymentStatus !== 'paid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative p-6 sm:p-8 md:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl"
            >
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </motion.div>

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-emerald-100 text-sm font-medium">Design goedgekeurd!</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  Nog één stap...
                </h3>
                <p className="text-emerald-100 text-sm sm:text-base max-w-lg">
                  Je design is goedgekeurd! Rond je betaling af om je website live te zetten.
                </p>
              </motion.div>
            </div>

            {/* Next step indicator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl"
            >
              <CreditCard className="w-5 h-5 text-white" />
              <span className="text-white font-medium text-sm">Betaling volgt hieronder</span>
              <ArrowRight className="w-4 h-4 text-white animate-pulse" />
            </motion.div>
          </div>

          {/* Approved timestamp */}
          {designApprovedAt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex items-center gap-2 text-emerald-100 text-sm"
            >
              <Clock className="w-4 h-4" />
              Goedgekeurd op {new Date(designApprovedAt).toLocaleDateString('nl-NL', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  // Al betaald - volledig klaar
  if (approved && paymentStatus === 'paid') {
    return null // PaymentSection toont al het succes bericht
  }

  // Design review nodig
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
      
      <div className="relative p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
          <motion.div
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl"
          >
            <Palette className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="text-purple-200 text-sm font-medium">Design klaar voor review</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Bekijk je nieuwe website! 🎨
            </h3>
            <p className="text-purple-200 text-sm sm:text-base max-w-lg">
              We hebben je design afgerond. Bekijk de preview en laat ons weten wat je ervan vindt.
            </p>
          </div>
        </div>

        {/* Preview Button */}
        {previewUrl && (
          <motion.a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white font-semibold py-4 px-6 rounded-2xl transition-all mb-6"
          >
            <Eye className="w-5 h-5" />
            <span>Preview bekijken</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        )}

        {/* Action Buttons */}
        <AnimatePresence mode="wait">
          {mode === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('approve')}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all"
              >
                <ThumbsUp className="w-5 h-5" />
                <span>Goedkeuren</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('changes')}
                className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 text-white font-semibold py-4 px-6 rounded-2xl transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Aanpassingen nodig</span>
              </motion.button>
            </motion.div>
          )}

          {mode === 'approve' && (
            <motion.div
              key="approve"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Bevestig goedkeuring
                </h4>
                <p className="text-purple-200 text-sm mb-4">
                  Weet je zeker dat je het design wilt goedkeuren? Na goedkeuring ontvang je de betaallink.
                </p>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Eventuele opmerkingen (optioneel)..."
                  rows={2}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none mb-4"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApprove}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Bezig...' : 'Ja, goedkeuren!'}</span>
                  </motion.button>

                  <button
                    onClick={() => setMode('initial')}
                    disabled={loading}
                    className="px-6 py-3 text-purple-200 hover:text-white transition-colors"
                  >
                    Annuleren
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-purple-200 text-xs">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Veilige betaling via Mollie</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Binnen 48u live</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'changes' && (
            <motion.div
              key="changes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  Welke aanpassingen wil je?
                </h4>
                <p className="text-purple-200 text-sm mb-4">
                  Beschrijf zo specifiek mogelijk wat je wilt aanpassen. Je hebt 3 revisierondes inbegrepen.
                </p>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Bijv: 'Ik zou graag een donkerder blauw zien in de header' of 'Kunnen we de tekst op de homepage wat groter maken?'"
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none mb-4"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRequestChanges}
                    disabled={loading || !feedback.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MessageSquare className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Versturen...' : 'Verstuur feedback'}</span>
                  </motion.button>

                  <button
                    onClick={() => setMode('initial')}
                    disabled={loading}
                    className="px-6 py-3 text-purple-200 hover:text-white transition-colors"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
