/**
 * Push Notifications Hook
 * 
 * Handles service worker registration and push subscription
 */

import { useState, useEffect, useCallback } from 'react'

interface UsePushNotificationsOptions {
  projectId?: string
  onSubscribed?: () => void
  onUnsubscribed?: () => void
  onError?: (error: Error) => void
}

interface PushNotificationState {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  permission: NotificationPermission | 'default'
  error: string | null
}

export function usePushNotifications(options: UsePushNotificationsOptions = {}) {
  const { projectId, onSubscribed, onUnsubscribed, onError } = options
  
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    permission: 'default',
    error: null
  })
  
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null)

  // Check support and get VAPID key on mount
  useEffect(() => {
    const init = async () => {
      // Check browser support
      const isSupported = 'serviceWorker' in navigator && 
                         'PushManager' in window && 
                         'Notification' in window

      if (!isSupported) {
        setState(prev => ({ 
          ...prev, 
          isSupported: false, 
          isLoading: false,
          error: 'Push notifications worden niet ondersteund in deze browser'
        }))
        return
      }

      try {
        // Get VAPID public key
        const response = await fetch('/api/push/notifications?action=vapid-key')
        const data = await response.json()
        
        if (!data.enabled) {
          setState(prev => ({ 
            ...prev, 
            isSupported: false, 
            isLoading: false,
            error: 'Push notifications zijn niet geconfigureerd'
          }))
          return
        }
        
        setVapidPublicKey(data.publicKey)

        // Register service worker
        const reg = await navigator.serviceWorker.register('/sw.js')
        setRegistration(reg)

        // Check current permission
        const permission = Notification.permission

        // Check if already subscribed
        const subscription = await reg.pushManager.getSubscription()
        
        setState({
          isSupported: true,
          isSubscribed: !!subscription,
          isLoading: false,
          permission,
          error: null
        })
      } catch (error) {
        console.error('Failed to initialize push notifications:', error)
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Kon push notifications niet initialiseren'
        }))
      }
    }

    init()
  }, [])

  // Convert base64 to Uint8Array for VAPID key
  const urlBase64ToUint8Array = useCallback((base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }, [])

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!registration || !vapidPublicKey || !projectId) {
      setState(prev => ({ ...prev, error: 'Kan niet subscriben' }))
      return false
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()
      
      if (permission !== 'granted') {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          permission,
          error: 'Notificatie permissie geweigerd'
        }))
        return false
      }

      // Subscribe to push manager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // Send subscription to backend
      const response = await fetch('/api/push/notifications?action=subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          subscription: subscription.toJSON()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save subscription')
      }

      setState(prev => ({ 
        ...prev, 
        isSubscribed: true, 
        isLoading: false,
        permission: 'granted',
        error: null
      }))
      
      onSubscribed?.()
      return true
    } catch (error) {
      console.error('Failed to subscribe:', error)
      const errorMessage = error instanceof Error ? error.message : 'Subscriben mislukt'
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }))
      onError?.(error instanceof Error ? error : new Error(errorMessage))
      return false
    }
  }, [registration, vapidPublicKey, projectId, urlBase64ToUint8Array, onSubscribed, onError])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!registration || !projectId) {
      return false
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        // Unsubscribe from push manager
        await subscription.unsubscribe()
        
        // Remove from backend
        await fetch('/api/push/notifications?action=unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            subscription: subscription.toJSON()
          })
        })
      }

      setState(prev => ({ 
        ...prev, 
        isSubscribed: false, 
        isLoading: false,
        error: null
      }))
      
      onUnsubscribed?.()
      return true
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Unsubscribe mislukt'
      }))
      return false
    }
  }, [registration, projectId, onUnsubscribed])

  // Toggle subscription
  const toggle = useCallback(async () => {
    if (state.isSubscribed) {
      return unsubscribe()
    } else {
      return subscribe()
    }
  }, [state.isSubscribed, subscribe, unsubscribe])

  return {
    ...state,
    subscribe,
    unsubscribe,
    toggle
  }
}
