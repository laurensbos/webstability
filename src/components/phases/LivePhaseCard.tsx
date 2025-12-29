/**
 * Live Phase Card
 * Shown when website is live - the celebration and ongoing management dashboard
 * Features:
 * - Celebration animation
 * - Website link
 * - Change requests
 * - Analytics link
 * - Review prompt
 * - Haptic feedback
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  CheckCircle2,
  ExternalLink,
  Star,
  Edit3,
  BarChart3,
  ChevronRight,
  Calendar,
  Clock,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Send,
  Loader2,
  X
} from 'lucide-react'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

interface ChangeRequest {
  id?: string
  title?: string
  description: string
  status?: 'pending' | 'in_progress' | 'done' | 'completed'
  response?: string
  createdAt?: string
  completedAt?: string
  estimatedCompletionDate?: string
  priority?: 'low' | 'normal' | 'urgent'
}

interface LivePhaseCardProps {
  businessName: string
  liveUrl?: string
  liveDate?: string
  packageName: string
  changesThisMonth?: number
  changesLimit?: number
  changeRequests?: ChangeRequest[]
  analyticsUrl?: string
  googleDriveUrl?: string
  darkMode?: boolean
  onRequestChange?: () => void
  onSubmitChangeRequest?: (description: string) => Promise<void>
  onLeaveReview?: () => void
  onContactSupport?: () => void
  onViewAnalytics?: () => void
}

export default function LivePhaseCard({
  liveUrl,
  liveDate,
  changesThisMonth = 0,
  changesLimit,
  changeRequests = [],
  analyticsUrl,
  darkMode = true,
  onRequestChange,
  onSubmitChangeRequest,
  onLeaveReview,
  onContactSupport,
  onViewAnalytics
}: LivePhaseCardProps) {
  const { t } = useTranslation()
  const haptic = useHapticFeedback()
  const [showAllChanges, setShowAllChanges] = useState(false)
  const [celebrationDone, setCelebrationDone] = useState(false)
  const [expandedChangeId, setExpandedChangeId] = useState<string | null>(null)
  const [showInlineForm, setShowInlineForm] = useState(false)
  const [changeDescription, setChangeDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [seenChanges, setSeenChanges] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('seenChangeRequests')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Check for new completed changes (completed in last 7 days and not seen)
  const recentlyCompletedChanges = changeRequests.filter(c => {
    if (c.status !== 'completed' || !c.completedAt) return false
    const completedTime = new Date(c.completedAt).getTime()
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return completedTime > sevenDaysAgo && !seenChanges.has(c.id || '')
  })

  const hasNewUpdates = recentlyCompletedChanges.length > 0

  // Mark a change as seen
  const markAsSeen = (changeId: string) => {
    setSeenChanges(prev => {
      const updated = new Set(prev)
      updated.add(changeId)
      localStorage.setItem('seenChangeRequests', JSON.stringify([...updated]))
      return updated
    })
  }

  // Mark all as seen when expanding list
  useEffect(() => {
    if (showAllChanges && hasNewUpdates) {
      recentlyCompletedChanges.forEach(c => {
        if (c.id) markAsSeen(c.id)
      })
    }
  }, [showAllChanges])

  // Calculate days since live
  const daysSinceLive = liveDate 
    ? Math.floor((Date.now() - new Date(liveDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Check if recently went live (show celebration)
  const isRecentlyLive = daysSinceLive <= 3 && !celebrationDone

  const pendingChanges = changeRequests.filter(c => c.status !== 'completed').length

  const handleVisitSite = () => {
    haptic.success()
    if (liveUrl) {
      window.open(liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`, '_blank')
    }
  }

  const handleSubmitInlineChange = async () => {
    if (!changeDescription.trim() || !onSubmitChangeRequest) return
    
    setIsSubmitting(true)
    try {
      await onSubmitChangeRequest(changeDescription.trim())
      setChangeDescription('')
      setSubmitSuccess(true)
      haptic.success()
      setTimeout(() => {
        setShowInlineForm(false)
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to submit change request:', error)
      haptic.error()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestChange = () => {
    haptic.selection()
    if (onSubmitChangeRequest) {
      setShowInlineForm(true)
    } else if (onRequestChange) {
      onRequestChange()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode 
          ? 'bg-gray-900/80 border-green-500/30' 
          : 'bg-white border-green-200 shadow-lg'
      }`}
    >
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.25),transparent_70%)]" />
        
        {/* Floating sparkles animation */}
        {isRecentlyLive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  y: 100, 
                  x: Math.random() * 100 
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: -100,
                  x: Math.random() * 200 - 50
                }}
                transition={{ 
                  duration: 3, 
                  delay: i * 0.5, 
                  repeat: 2,
                  ease: "easeOut"
                }}
                onAnimationComplete={() => i === 5 && setCelebrationDone(true)}
                className="absolute text-2xl"
                style={{ left: `${10 + i * 15}%` }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="relative flex items-start gap-4">
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
          >
            <motion.div
              animate={isRecentlyLive ? { 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.5, repeat: isRecentlyLive ? 3 : 0 }}
            >
              <Globe className="w-7 h-7 text-white" />
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {isRecentlyLive 
                ? t('phases.live.titleNew', 'Congratulations! 🎉')
                : t('phases.live.title', 'Your website is live!')
              }
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {isRecentlyLive
                ? t('phases.live.descriptionNew', 'Your website is now live and accessible to the world!')
                : t('phases.live.description', 'Manage your website and request changes here.')
              }
            </motion.p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Website URL Card */}
        {liveUrl && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleVisitSite}
            className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
              darkMode 
                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500/50'
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <Globe className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div className="text-left">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {liveUrl.replace(/^https?:\/\//, '')}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t('phases.live.clickToVisit', 'Click to visit your website')}
                </p>
              </div>
            </div>
            <ExternalLink className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </motion.button>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Days Live */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('phases.live.daysLive', 'Days live')}
              </span>
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {daysSinceLive}
            </p>
          </div>

          {/* Changes Used */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Edit3 className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('phases.live.changesUsed', 'Changes this month')}
              </span>
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {changesThisMonth}
              {changesLimit && (
                <span className={`text-sm font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  /{changesLimit}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Request Change */}
          {(onRequestChange || onSubmitChangeRequest) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRequestChange}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                darkMode
                  ? 'bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20'
                  : 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Edit3 className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                {t('phases.live.requestChange', 'Request change')}
              </span>
              {pendingChanges > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
                }`}>
                  {pendingChanges} {t('phases.live.pending', 'pending')}
                </span>
              )}
            </motion.button>
          )}

          {/* View Analytics */}
          {(onViewAnalytics || analyticsUrl) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                haptic.selection()
                if (analyticsUrl) {
                  window.open(analyticsUrl, '_blank')
                }
                onViewAnalytics?.()
              }}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                darkMode
                  ? 'bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20'
                  : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                {t('phases.live.viewAnalytics', 'Analytics')}
              </span>
            </motion.button>
          )}
        </div>

        {/* Inline Change Request Form */}
        <AnimatePresence>
          {showInlineForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`rounded-xl p-4 ${
                darkMode 
                  ? 'bg-purple-500/10 border border-purple-500/30' 
                  : 'bg-purple-50 border border-purple-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('phases.live.requestChange', 'Request change')}
                  </h4>
                  <button
                    onClick={() => {
                      setShowInlineForm(false)
                      setChangeDescription('')
                    }}
                    className={`p-1 rounded-lg transition ${
                      darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {submitSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3 py-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('phases.live.changeSubmitted', 'Change request submitted!')}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('phases.live.changeSubmittedDesc', "We'll get back to you soon")}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <textarea
                      value={changeDescription}
                      onChange={(e) => setChangeDescription(e.target.value)}
                      placeholder={t('phases.live.changeDescriptionPlaceholder', 'Describe what you would like to change...')}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg resize-none text-sm ${
                        darkMode
                          ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500'
                          : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition`}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {changesLimit && (
                          <>
                            {changesThisMonth}/{changesLimit} {t('phases.live.changesUsedShort', 'changes used')}
                          </>
                        )}
                      </p>
                      <button
                        onClick={handleSubmitInlineChange}
                        disabled={isSubmitting || !changeDescription.trim()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                          isSubmitting || !changeDescription.trim()
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('common.sending', 'Sending...')}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            {t('common.submit', 'Submit')}
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Change Requests */}
        {changeRequests.length > 0 && (
          <div className={`rounded-xl overflow-hidden ${
            darkMode ? 'bg-gray-800/30 border border-gray-800' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className={`p-4 flex items-center justify-between border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('phases.live.recentChanges', 'Recent changes')}
                </span>
                {hasNewUpdates && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    {recentlyCompletedChanges.length} {t('phases.live.newUpdates', 'new')}
                  </span>
                )}
              </div>
              {changeRequests.length > 3 && (
                <button
                  onClick={() => {
                    haptic.light()
                    setShowAllChanges(!showAllChanges)
                  }}
                  className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  {showAllChanges ? t('common.showLess', 'Show less') : t('common.viewAll', 'View all')}
                </button>
              )}
            </div>
            <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {(showAllChanges ? changeRequests : changeRequests.slice(0, 3)).map((change) => {
                const isNew = change.status === 'completed' && change.id && !seenChanges.has(change.id)
                const isExpanded = expandedChangeId === change.id

                return (
                  <div key={change.id} className="relative">
                    <button
                      onClick={() => {
                        if (change.id) {
                          setExpandedChangeId(isExpanded ? null : change.id)
                          if (isNew) markAsSeen(change.id)
                        }
                        haptic.light()
                      }}
                      className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
                        darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                      } ${isNew ? (darkMode ? 'bg-green-500/5' : 'bg-green-50/50') : ''}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        change.status === 'completed' 
                          ? 'bg-green-500/20' 
                          : change.status === 'in_progress'
                            ? 'bg-amber-500/20'
                            : 'bg-gray-500/20'
                      }`}>
                        {change.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        ) : change.status === 'in_progress' ? (
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Clock className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {change.description}
                        </p>
                        {/* Show ETA for pending/in_progress changes */}
                        {change.status !== 'completed' && change.estimatedCompletionDate && (
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {t('phases.live.expectedBy', 'Expected by')} {new Date(change.estimatedCompletionDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                        {/* Show priority if urgent */}
                        {change.priority === 'urgent' && change.status !== 'completed' && (
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400">
                            {t('phases.live.urgent', 'Urgent')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isNew && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500 text-white uppercase">
                            {t('common.new', 'New')}
                          </span>
                        )}
                        <span className={`text-xs ${
                          change.status === 'completed' 
                            ? 'text-green-500' 
                            : change.status === 'in_progress'
                              ? 'text-amber-500'
                              : darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {change.status === 'completed' 
                            ? t('phases.live.completed', 'Done')
                            : change.status === 'in_progress'
                              ? t('phases.live.inProgress', 'In progress')
                              : t('phases.live.pending', 'Pending')
                          }
                        </span>
                        {(change.response || change.status === 'completed') && (
                          <ChevronDown className={`w-4 h-4 transition-transform ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          } ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </button>
                    
                    {/* Expandable response section */}
                    <AnimatePresence>
                      {isExpanded && change.response && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className={`px-4 pb-3 pl-12 ${
                            darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-start gap-2">
                              <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                darkMode ? 'text-blue-400' : 'text-blue-500'
                              }`} />
                              <div>
                                <p className={`text-xs font-medium mb-1 ${
                                  darkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}>
                                  {t('phases.live.developerResponse', 'Developer response')}:
                                </p>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {change.response}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Leave Review CTA */}
        {onLeaveReview && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              haptic.success()
              onLeaveReview()
            }}
            className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
              darkMode
                ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-500/50'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
              }`}>
                <Star className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
              </div>
              <div className="text-left">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('phases.live.leaveReview', 'Leave a review')}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t('phases.live.reviewHelp', 'Help other entrepreneurs find us')}
                </p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
          </motion.button>
        )}

        {/* Support link */}
        {onContactSupport && (
          <button
            onClick={() => {
              haptic.light()
              onContactSupport()
            }}
            className={`w-full text-center text-sm ${
              darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            } transition`}
          >
            {t('phases.live.needHelp', 'Need help or support?')} →
          </button>
        )}
      </div>
    </motion.div>
  )
}
