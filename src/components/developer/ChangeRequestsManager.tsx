/**
 * Change Requests Manager Component
 * 
 * Displays and manages all change requests from clients.
 * Features:
 * - Filter by status (pending, in_progress, completed)
 * - Update status with one click
 * - Add response notes
 * - Priority indicators
 * - Mobile-optimized design
 */

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Filter,
  Inbox,
  X
} from 'lucide-react'
import type { ChangeRequest } from './types'

interface ChangeRequestWithProject {
  projectId: string
  businessName: string
  contactName: string
  contactEmail: string
  changeRequest: ChangeRequest
  revisionsUsed: number
  revisionsTotal: number
}

interface ChangeRequestsManagerProps {
  darkMode?: boolean
  onProjectClick?: (projectId: string) => void
}

const STATUS_CONFIG = {
  pending: {
    label: 'Wachten',
    labelEn: 'Pending',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: Clock
  },
  in_progress: {
    label: 'Bezig',
    labelEn: 'In Progress',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: PlayCircle
  },
  completed: {
    label: 'Afgerond',
    labelEn: 'Completed',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: CheckCircle2
  }
}

const PRIORITY_CONFIG = {
  low: {
    label: 'Laag',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10'
  },
  normal: {
    label: 'Normaal',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-400',
    bg: 'bg-red-500/10'
  }
}

const CATEGORY_CONFIG = {
  text: { label: 'Tekst', emoji: '📝' },
  design: { label: 'Design', emoji: '🎨' },
  images: { label: 'Afbeeldingen', emoji: '🖼️' },
  functionality: { label: 'Functionaliteit', emoji: '⚙️' },
  other: { label: 'Overig', emoji: '📋' }
}

export default function ChangeRequestsManager({ 
  darkMode = true, 
  onProjectClick 
}: ChangeRequestsManagerProps) {
  const { t, i18n } = useTranslation()
  const isNL = i18n.language === 'nl'
  
  const [changeRequests, setChangeRequests] = useState<ChangeRequestWithProject[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'normal' | 'urgent'>('all')
  
  // Expanded items
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  // Response modal
  const [responseModal, setResponseModal] = useState<{
    projectId: string
    changeRequestId: string
    currentStatus: string
    newStatus: string
  } | null>(null)
  const [responseText, setResponseText] = useState('')
  const [updating, setUpdating] = useState(false)
  
  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 })

  const fetchChangeRequests = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')

    try {
      const token = sessionStorage.getItem('webstability_dev_token')
      const response = await fetch('/api/developer/change-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      if (data.success) {
        setChangeRequests(data.changeRequests || [])
        setStats(data.stats || { total: 0, pending: 0, inProgress: 0, completed: 0 })
      }
    } catch (err) {
      setError('Kon wijzigingsverzoeken niet laden')
      console.error('Fetch change requests error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchChangeRequests()
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => fetchChangeRequests(true), 60000)
    return () => clearInterval(interval)
  }, [fetchChangeRequests])

  const updateStatus = async (
    projectId: string, 
    changeRequestId: string, 
    newStatus: 'pending' | 'in_progress' | 'completed',
    response?: string
  ) => {
    setUpdating(true)
    try {
      const token = sessionStorage.getItem('webstability_dev_token')
      const res = await fetch('/api/developer/change-requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId,
          changeRequestId,
          status: newStatus,
          response
        })
      })

      if (res.ok) {
        // Refresh the list
        await fetchChangeRequests(true)
        setResponseModal(null)
        setResponseText('')
      }
    } catch (err) {
      console.error('Update status error:', err)
    } finally {
      setUpdating(false)
    }
  }

  // Quick status update (no response needed)
  const quickUpdateStatus = (
    projectId: string, 
    changeRequestId: string, 
    currentStatus: string,
    newStatus: 'pending' | 'in_progress' | 'completed'
  ) => {
    if (newStatus === 'completed') {
      // Show response modal for completed status
      setResponseModal({
        projectId,
        changeRequestId,
        currentStatus,
        newStatus
      })
    } else {
      updateStatus(projectId, changeRequestId, newStatus)
    }
  }

  // Filter change requests
  const filteredRequests = changeRequests.filter(item => {
    if (statusFilter !== 'all' && item.changeRequest.status !== statusFilter) return false
    if (priorityFilter !== 'all' && item.changeRequest.priority !== priorityFilter) return false
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return isNL ? 'Zojuist' : 'Just now'
    if (diffHours < 24) return isNL ? `${diffHours}u geleden` : `${diffHours}h ago`
    if (diffDays < 7) return isNL ? `${diffDays}d geleden` : `${diffDays}d ago`
    return date.toLocaleDateString(isNL ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className={`w-6 h-6 animate-spin ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('developerDashboard.changeRequests.title', 'Wijzigingsverzoeken')}
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {stats.pending} {t('developerDashboard.changeRequests.pending', 'wachtend')} • 
            {stats.inProgress} {t('developerDashboard.changeRequests.inProgress', 'bezig')} • 
            {stats.completed} {t('developerDashboard.changeRequests.completed', 'afgerond')}
          </p>
        </div>
        
        <button
          onClick={() => fetchChangeRequests(true)}
          disabled={refreshing}
          className={`p-2 rounded-lg transition ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Status filters */}
        <div className="flex gap-1">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map(status => {
            const config = status === 'all' ? null : STATUS_CONFIG[status]
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  statusFilter === status
                    ? darkMode 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-indigo-600 text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? (isNL ? 'Alles' : 'All') : (isNL ? config?.label : config?.labelEn)}
                {status === 'pending' && stats.pending > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                    {stats.pending}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1">
          <Filter className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as typeof priorityFilter)}
            className={`text-sm rounded-lg px-2 py-1.5 border-0 focus:ring-2 focus:ring-indigo-500 ${
              darkMode 
                ? 'bg-gray-800 text-gray-300' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <option value="all">{isNL ? 'Alle prioriteiten' : 'All priorities'}</option>
            <option value="urgent">{isNL ? 'Urgent' : 'Urgent'}</option>
            <option value="normal">{isNL ? 'Normaal' : 'Normal'}</option>
            <option value="low">{isNL ? 'Laag' : 'Low'}</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
          {error}
        </div>
      )}

      {/* Change requests list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredRequests.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">
                {t('developerDashboard.changeRequests.empty', 'Geen wijzigingsverzoeken')}
              </p>
              <p className="text-sm mt-1">
                {statusFilter !== 'all' 
                  ? t('developerDashboard.changeRequests.noFiltered', 'Geen verzoeken met deze filter')
                  : t('developerDashboard.changeRequests.allDone', 'Alle verzoeken zijn afgehandeld')
                }
              </p>
            </div>
          ) : (
            filteredRequests.map((item, index) => {
              const statusConfig = STATUS_CONFIG[item.changeRequest.status]
              const priorityConfig = PRIORITY_CONFIG[item.changeRequest.priority]
              const categoryConfig = CATEGORY_CONFIG[item.changeRequest.category] || CATEGORY_CONFIG.other
              const StatusIcon = statusConfig.icon
              const isExpanded = expandedId === item.changeRequest.id
              
              return (
                <motion.div
                  key={item.changeRequest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className={`rounded-xl border overflow-hidden ${
                    darkMode 
                      ? `bg-gray-800/50 ${statusConfig.border}` 
                      : `bg-white border-gray-200 shadow-sm`
                  }`}
                >
                  {/* Main row */}
                  <div 
                    className={`p-4 cursor-pointer transition ${
                      darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : item.changeRequest.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statusConfig.bg}`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-lg">{categoryConfig.emoji}</span>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.businessName}
                              </p>
                              {item.changeRequest.priority !== 'normal' && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityConfig.bg} ${priorityConfig.color}`}>
                                  {priorityConfig.label}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {categoryConfig.label} • {formatDate(item.changeRequest.date)}
                            </p>
                          </div>
                          
                          {/* Expand indicator */}
                          <div className={`p-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                        
                        {/* Description preview */}
                        <p className={`text-sm mt-2 ${isExpanded ? '' : 'line-clamp-2'} ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {item.changeRequest.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`border-t ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}
                      >
                        <div className="p-4 space-y-4">
                          {/* Full description */}
                          <div>
                            <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {t('developerDashboard.changeRequests.description', 'Beschrijving')}
                            </p>
                            <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {item.changeRequest.description}
                            </p>
                          </div>
                          
                          {/* Response if exists */}
                          {item.changeRequest.response && (
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {t('developerDashboard.changeRequests.response', 'Reactie')}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {item.changeRequest.response}
                              </p>
                            </div>
                          )}
                          
                          {/* Meta info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                              {item.contactName}
                            </span>
                            <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                              Revisies: {item.revisionsUsed}/{item.revisionsTotal}
                            </span>
                            {item.changeRequest.completedAt && (
                              <>
                                <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
                                <span className="text-green-500">
                                  Afgerond {formatDate(item.changeRequest.completedAt)}
                                </span>
                              </>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            {/* Status buttons */}
                            {item.changeRequest.status !== 'pending' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  quickUpdateStatus(item.projectId, item.changeRequest.id, item.changeRequest.status, 'pending')
                                }}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                <Clock className="w-4 h-4 inline mr-1.5" />
                                {t('developerDashboard.changeRequests.markPending', 'Wachtend')}
                              </button>
                            )}
                            
                            {item.changeRequest.status !== 'in_progress' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  quickUpdateStatus(item.projectId, item.changeRequest.id, item.changeRequest.status, 'in_progress')
                                }}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                                  darkMode 
                                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                <PlayCircle className="w-4 h-4 inline mr-1.5" />
                                {t('developerDashboard.changeRequests.startWorking', 'Start')}
                              </button>
                            )}
                            
                            {item.changeRequest.status !== 'completed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  quickUpdateStatus(item.projectId, item.changeRequest.id, item.changeRequest.status, 'completed')
                                }}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                                  darkMode 
                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
                                {t('developerDashboard.changeRequests.markDone', 'Afronden')}
                              </button>
                            )}
                            
                            {/* View project button */}
                            {onProjectClick && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onProjectClick(item.projectId)
                                }}
                                className={`ml-auto px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                                  darkMode 
                                    ? 'text-indigo-400 hover:bg-indigo-500/20' 
                                    : 'text-indigo-600 hover:bg-indigo-50'
                                }`}
                              >
                                <ExternalLink className="w-4 h-4 inline mr-1.5" />
                                {t('developerDashboard.changeRequests.viewProject', 'Bekijk project')}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {responseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setResponseModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('developerDashboard.changeRequests.completeRequest', 'Verzoek afronden')}
                </h3>
                <button
                  onClick={() => setResponseModal(null)}
                  className={`p-2 rounded-lg transition ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('developerDashboard.changeRequests.responseHint', 'Voeg optioneel een korte reactie toe voor de klant.')}
              </p>
              
              <textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                placeholder={t('developerDashboard.changeRequests.responsePlaceholder', 'Bijv: Aanpassing is doorgevoerd op de website.')}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setResponseModal(null)}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('common.cancel', 'Annuleren')}
                </button>
                <button
                  onClick={() => updateStatus(
                    responseModal.projectId, 
                    responseModal.changeRequestId, 
                    'completed', 
                    responseText.trim() || undefined
                  )}
                  disabled={updating}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {t('developerDashboard.changeRequests.complete', 'Afronden')}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
