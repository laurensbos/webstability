/**
 * useRealtimeSync - Hook voor realtime data synchronisatie
 * 
 * Features:
 * - Polling met configureerbare interval
 * - Activity tracking
 * - Online/offline detectie
 * - Automatisch reconnect
 */

import { useState, useEffect, useCallback, useRef } from 'react'

// Types
export interface SyncConfig {
  projectId?: string
  authToken?: string
  pollInterval?: number  // in milliseconds
  enablePolling?: boolean
  onDataUpdate?: (data: SyncData) => void
  onActivityUpdate?: (activity: ActivityItem) => void
  onConnectionChange?: (isOnline: boolean) => void
}

export interface SyncData {
  project?: ProjectSyncData
  messages?: MessageSyncData[]
  notifications?: NotificationSyncData[]
  lastUpdated: string
}

export interface ProjectSyncData {
  projectId: string
  status: string
  paymentStatus?: string
  designPreviewUrl?: string
  liveUrl?: string
  updatedAt: string
}

export interface MessageSyncData {
  id: string
  from: 'client' | 'developer'
  message: string
  date: string
  read: boolean
}

export interface NotificationSyncData {
  id: string
  type: 'info' | 'success' | 'warning' | 'phase' | 'message'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export interface ActivityItem {
  id: string
  type: 'task_completed' | 'feedback_given' | 'message_sent' | 'file_uploaded' | 'phase_changed' | 'payment_made' | 'design_viewed'
  projectId: string
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// Activity types configuration
export const ACTIVITY_TYPES = {
  task_completed: {
    label: 'Taak afgerond',
    icon: 'CheckCircle',
    color: 'green'
  },
  feedback_given: {
    label: 'Feedback gegeven',
    icon: 'MessageSquare',
    color: 'purple'
  },
  message_sent: {
    label: 'Bericht verstuurd',
    icon: 'Send',
    color: 'blue'
  },
  file_uploaded: {
    label: 'Bestand geüpload',
    icon: 'Upload',
    color: 'amber'
  },
  phase_changed: {
    label: 'Fase veranderd',
    icon: 'ArrowRight',
    color: 'cyan'
  },
  payment_made: {
    label: 'Betaling ontvangen',
    icon: 'CreditCard',
    color: 'green'
  },
  design_viewed: {
    label: 'Ontwerp bekeken',
    icon: 'Eye',
    color: 'indigo'
  }
}

// Hook
export function useRealtimeSync(config: SyncConfig) {
  const {
    projectId,
    authToken,
    pollInterval = 5000,
    enablePolling = true,
    onDataUpdate,
    onActivityUpdate,
    onConnectionChange
  } = config

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isPolling, setIsPolling] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastDataRef = useRef<string>('')

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      onConnectionChange?.(true)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      onConnectionChange?.(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onConnectionChange])

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!projectId || !isOnline) return

    try {
      setIsPolling(true)
      setSyncError(null)

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch(`/api/project/${projectId}`, { headers })
      
      if (!response.ok) {
        throw new Error('Failed to fetch project data')
      }

      const data = await response.json()
      const dataString = JSON.stringify(data)

      // Only notify if data changed
      if (dataString !== lastDataRef.current) {
        lastDataRef.current = dataString
        
        const syncData: SyncData = {
          project: {
            projectId: data.projectId,
            status: data.status,
            paymentStatus: data.paymentStatus,
            designPreviewUrl: data.designPreviewUrl,
            liveUrl: data.liveUrl,
            updatedAt: data.updatedAt || new Date().toISOString()
          },
          messages: data.messages || [],
          lastUpdated: new Date().toISOString()
        }

        onDataUpdate?.(syncData)
      }

      setLastSyncTime(new Date())
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Sync failed')
    } finally {
      setIsPolling(false)
    }
  }, [projectId, authToken, isOnline, onDataUpdate])

  // Start/stop polling
  useEffect(() => {
    if (enablePolling && isOnline && projectId) {
      // Initial fetch
      fetchData()

      // Start polling
      pollIntervalRef.current = setInterval(fetchData, pollInterval)

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    }
  }, [enablePolling, isOnline, projectId, pollInterval, fetchData])

  // Track activity
  const trackActivity = useCallback(async (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    if (!projectId) return

    const fullActivity: ActivityItem = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }

    // Store locally
    try {
      const stored = localStorage.getItem(`activities-${projectId}`)
      const activities: ActivityItem[] = stored ? JSON.parse(stored) : []
      activities.unshift(fullActivity)
      // Keep only last 50 activities
      localStorage.setItem(`activities-${projectId}`, JSON.stringify(activities.slice(0, 50)))
    } catch (e) {
      console.error('Failed to store activity locally:', e)
    }

    // Notify callback
    onActivityUpdate?.(fullActivity)

    // Send to server (best effort)
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      await fetch('/api/project-activity', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          projectId: fullActivity.projectId,
          type: fullActivity.type,
          description: fullActivity.description,
          timestamp: fullActivity.timestamp,
          metadata: fullActivity.metadata
        })
      })
    } catch (e) {
      // Silently fail - activity is already stored locally
      console.warn('Failed to sync activity to server:', e)
    }

    return fullActivity
  }, [projectId, authToken, onActivityUpdate])

  // Get local activities
  const getLocalActivities = useCallback((): ActivityItem[] => {
    if (!projectId) return []
    
    try {
      const stored = localStorage.getItem(`activities-${projectId}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }, [projectId])

  // Force refresh
  const refresh = useCallback(() => {
    lastDataRef.current = ''
    fetchData()
  }, [fetchData])

  return {
    isOnline,
    isPolling,
    lastSyncTime,
    syncError,
    trackActivity,
    getLocalActivities,
    refresh
  }
}

// Helper: Track specific activities
export const createActivityTracker = (trackActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => Promise<ActivityItem | undefined>) => ({
  taskCompleted: (projectId: string, taskName: string) => 
    trackActivity({
      type: 'task_completed',
      projectId,
      description: `Taak "${taskName}" afgerond`,
      metadata: { taskName }
    }),

  feedbackGiven: (projectId: string, feedbackType: 'positive' | 'negative' | 'mixed') =>
    trackActivity({
      type: 'feedback_given',
      projectId,
      description: `Feedback gegeven op ontwerp`,
      metadata: { feedbackType }
    }),

  messageSent: (projectId: string) =>
    trackActivity({
      type: 'message_sent',
      projectId,
      description: 'Nieuw bericht verzonden'
    }),

  fileUploaded: (projectId: string, fileName: string) =>
    trackActivity({
      type: 'file_uploaded',
      projectId,
      description: `Bestand "${fileName}" geüpload`,
      metadata: { fileName }
    }),

  phaseChanged: (projectId: string, fromPhase: string, toPhase: string) =>
    trackActivity({
      type: 'phase_changed',
      projectId,
      description: `Project verplaatst van ${fromPhase} naar ${toPhase}`,
      metadata: { fromPhase, toPhase }
    }),

  paymentMade: (projectId: string, amount: number) =>
    trackActivity({
      type: 'payment_made',
      projectId,
      description: `Betaling van €${amount} ontvangen`,
      metadata: { amount }
    }),

  designViewed: (projectId: string, duration?: number) =>
    trackActivity({
      type: 'design_viewed',
      projectId,
      description: 'Ontwerp bekeken',
      metadata: { duration }
    })
})

export default useRealtimeSync
