/**
 * Revision Phase Card
 * Shown when feedback is being processed by the designer
 * Features:
 * - Progress visualization
 * - Revision counter
 * - Haptic feedback
 * - Estimated completion time
 */

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Eye
} from 'lucide-react'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

interface RevisionPhaseCardProps {
  revisionsUsed: number
  revisionsTotal?: number
  feedbackReceivedAt?: string
  estimatedCompletionDate?: string
  designPreviewUrl?: string
  darkMode?: boolean
  onViewPreview?: () => void
  onSendMessage?: () => void
}

export default function RevisionPhaseCard({
  revisionsUsed,
  revisionsTotal,
  feedbackReceivedAt,
  estimatedCompletionDate,
  designPreviewUrl,
  darkMode = true,
  onViewPreview,
  onSendMessage
}: RevisionPhaseCardProps) {
  const { t } = useTranslation()
  const haptic = useHapticFeedback()

  // Calculate progress through revision
  const getRevisionProgress = () => {
    if (!feedbackReceivedAt) return 0
    const daysSinceFeedback = Math.floor(
      (Date.now() - new Date(feedbackReceivedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    // Assume 3-5 days for revision, show progressive progress
    return Math.min(Math.floor((daysSinceFeedback / 4) * 100), 95)
  }

  const progress = getRevisionProgress()

  const revisionSteps = [
    { 
      label: t('phases.revision.steps.received', 'Feedback received'), 
      done: true,
      icon: MessageSquare
    },
    { 
      label: t('phases.revision.steps.analyzing', 'Analyzing changes'), 
      done: progress >= 25,
      current: progress > 0 && progress < 25,
      icon: Eye
    },
    { 
      label: t('phases.revision.steps.implementing', 'Implementing adjustments'), 
      done: progress >= 60,
      current: progress >= 25 && progress < 60,
      icon: RefreshCw
    },
    { 
      label: t('phases.revision.steps.finalizing', 'Finalizing new preview'), 
      done: progress >= 90,
      current: progress >= 60 && progress < 90,
      icon: Sparkles
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode 
          ? 'bg-gray-900/80 border-cyan-500/30' 
          : 'bg-white border-cyan-200 shadow-lg'
      }`}
    >
      {/* Header with animated gradient */}
      <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.2),transparent_70%)]" />
        
        <div className="relative flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-7 h-7 text-white" />
            </motion.div>
          </div>
          
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('phases.revision.title', 'Processing your feedback')} ✨
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('phases.revision.description', 'Our designer is working on the adjustments. You\'ll receive a new preview soon.')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Revision Counter */}
        <div className={`flex items-center justify-between p-4 rounded-xl ${
          darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'
            }`}>
              <MessageSquare className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('phases.revision.round', 'Revision round')}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {feedbackReceivedAt && new Date(feedbackReceivedAt).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {revisionsUsed}
            </span>
            {revisionsTotal && (
              <span className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                /{revisionsTotal}
              </span>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          <p className={`text-xs font-medium uppercase tracking-wide ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {t('phases.revision.progress', 'Progress')}
          </p>
          
          <div className="space-y-2">
            {revisionSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    step.current
                      ? darkMode
                        ? 'bg-cyan-500/10 border border-cyan-500/30'
                        : 'bg-cyan-50 border border-cyan-200'
                      : darkMode
                        ? 'bg-gray-800/30'
                        : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    step.done 
                      ? 'bg-green-500/20' 
                      : step.current 
                        ? 'bg-cyan-500/20 animate-pulse' 
                        : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : step.current ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Icon className="w-4 h-4 text-cyan-400" />
                      </motion.div>
                    ) : (
                      <Icon className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <span className={`text-sm ${
                    step.done 
                      ? darkMode ? 'text-gray-400' : 'text-gray-500'
                      : step.current 
                        ? darkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'
                        : darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {step.current && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                    }`}>
                      {t('phases.revision.inProgress', 'In progress')}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Estimated completion */}
        {estimatedCompletionDate && (
          <div className={`flex items-center gap-3 p-4 rounded-xl ${
            darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'
          }`}>
            <Clock className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('phases.revision.estimated', 'Expected completion')}
              </p>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {new Date(estimatedCompletionDate).toLocaleDateString('nl-NL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          {designPreviewUrl && onViewPreview && (
            <button
              onClick={() => {
                haptic.selection()
                onViewPreview()
              }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t('phases.revision.viewCurrent', 'View current')}
              </span>
            </button>
          )}
          
          {onSendMessage && (
            <button
              onClick={() => {
                haptic.selection()
                onSendMessage()
              }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                darkMode
                  ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
                  : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t('phases.revision.sendMessage', 'Send message')}
              </span>
            </button>
          )}
        </div>

        {/* Info note */}
        <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          💡 {t('phases.revision.tip', 'You\'ll receive an email when the new preview is ready')}
        </p>
      </div>
    </motion.div>
  )
}
