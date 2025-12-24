/**
 * Client Activity Feed Component
 * 
 * Real-time activity feed showing all client actions:
 * - New messages from clients
 * - Change requests (pending, in progress)
 * - Status updates
 * 
 * Used in the Developer Dashboard for quick overview of client activity.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Bell,
  Loader2
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'message' | 'change_request' | 'status_update' | 'design_feedback' | 'payment'
  projectId: string
  businessName: string
  contactName: string
  contactEmail: string
  title: string
  description: string
  priority?: 'low' | 'normal' | 'urgent'
  category?: string
  status?: string
  createdAt: string
  read: boolean
  actionRequired: boolean
}

interface ActivitySummary {
  total: number
  unread: number
  actionRequired: number
  byType: {
    messages: number
    changeRequests: number
  }
}

interface ClientActivityFeedProps {
  authToken: string
  onProjectClick?: (projectId: string) => void
  maxItems?: number
  showFilters?: boolean
  compact?: boolean
  darkMode?: boolean
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Laag', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  normal: { label: 'Normaal', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  urgent: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-500/20' }
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof MessageSquare; color: string; bg: string }> = {
  message: { 
    label: 'Bericht', 
    icon: MessageSquare, 
    color: 'text-green-400', 
    bg: 'bg-green-500/20' 
  },
  change_request: { 
    label: 'Wijziging', 
    icon: Edit3, 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/20' 
  },
  status_update: { 
    label: 'Status', 
    icon: RefreshCw, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/20' 
  },
  design_feedback: { 
    label: 'Feedback', 
    icon: CheckCircle2, 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/20' 
  },
  payment: { 
    label: 'Betaling', 
    icon: AlertCircle, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/20' 
  }
}

export default function ClientActivityFeed({
  authToken,
  onProjectClick,
  maxItems = 20,
  showFilters = true,
  compact = false,
  darkMode = true
}: ClientActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [summary, setSummary] = useState<ActivitySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'message' | 'change_request'>('all')
  const [refreshing, setRefreshing] = useState(false)

  // Fetch activities
  const fetchActivities = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    
    try {
      const params = new URLSearchParams({
        filter: filter === 'all' ? '' : filter,
        limit: maxItems.toString()
      })
      
      const response = await fetch(`/api/developer/client-activity?${params}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch activities')
      
      const data = await response.json()
      
      if (data.success) {
        setActivities(data.activities)
        setSummary(data.summary)
      }
    } catch (err) {
      setError('Kon activiteiten niet laden')
      console.error('Error fetching activities:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Mark activity as read
  const markAsRead = async (activity: ActivityItem) => {
    try {
      await fetch('/api/developer/client-activity', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activityId: activity.id,
          projectId: activity.projectId,
          type: activity.type
        })
      })
      
      // Update local state
      setActivities(prev => 
        prev.map(a => a.id === activity.id ? { ...a, read: true } : a)
      )
      
      if (summary) {
        setSummary({
          ...summary,
          unread: Math.max(0, summary.unread - 1),
          actionRequired: activity.actionRequired 
            ? Math.max(0, summary.actionRequired - 1) 
            : summary.actionRequired
        })
      }
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchActivities()
  }, [filter])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchActivities(), 30000)
    return () => clearInterval(interval)
  }, [filter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Zojuist'
    if (diffMins < 60) return `${diffMins}m geleden`
    if (diffHours < 24) return `${diffHours}u geleden`
    if (diffDays < 7) return `${diffDays}d geleden`
    
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  }

  const handleActivityClick = (activity: ActivityItem) => {
    if (!activity.read) {
      markAsRead(activity)
    }
    if (onProjectClick) {
      onProjectClick(activity.projectId)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Activiteiten laden...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-12 ${
        darkMode ? 'text-red-400' : 'text-red-600'
      }`}>
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>{error}</p>
        <button 
          onClick={() => fetchActivities()}
          className="mt-2 text-sm underline"
        >
          Opnieuw proberen
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with summary and filters */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Klant Activiteit
            </h3>
            {summary && summary.unread > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                {summary.unread} nieuw
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchActivities(true)}
              disabled={refreshing}
              className={`p-2 rounded-lg transition ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className={`flex gap-2 ${compact ? 'mb-3' : ''}`}>
          {(['all', 'message', 'change_request'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                filter === f
                  ? darkMode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Alles' : f === 'message' ? 'Berichten' : 'Wijzigingen'}
              {summary && f !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  ({f === 'message' ? summary.byType.messages : summary.byType.changeRequests})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Activity List */}
      <div className={`space-y-2 ${compact ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
        <AnimatePresence>
          {activities.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Geen activiteit gevonden</p>
            </div>
          ) : (
            activities.map((activity, index) => {
              const typeConfig = TYPE_CONFIG[activity.type] || TYPE_CONFIG.message
              const TypeIcon = typeConfig.icon
              const priorityConfig = activity.priority ? PRIORITY_CONFIG[activity.priority] : null
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleActivityClick(activity)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                    activity.read
                      ? darkMode 
                        ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50' 
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 border-gray-700 hover:border-blue-500/50'
                        : 'bg-white border-gray-200 hover:border-blue-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConfig.bg}`}>
                      <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`font-medium text-sm ${
                            activity.read
                              ? darkMode ? 'text-gray-300' : 'text-gray-600'
                              : darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {activity.title}
                          </p>
                          <p className={`text-xs mt-0.5 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {activity.businessName}
                            {activity.contactName && ` • ${activity.contactName}`}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Priority badge */}
                          {priorityConfig && activity.priority !== 'normal' && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityConfig.bg} ${priorityConfig.color}`}>
                              {priorityConfig.label}
                            </span>
                          )}
                          
                          {/* Unread indicator */}
                          {!activity.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className={`text-sm mt-1 line-clamp-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {activity.description}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatDate(activity.createdAt)}
                        </span>
                        
                        <span className={`text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          Bekijken
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
      
      {/* Load more / View all */}
      {activities.length >= maxItems && (
        <div className="text-center pt-2">
          <button className={`text-sm ${
            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}>
            Alle activiteit bekijken →
          </button>
        </div>
      )}
    </div>
  )
}
