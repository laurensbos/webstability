/**
 * Push Notification Helper
 * 
 * Utility functions to send push notifications from other API endpoints
 */

import { Redis } from '@upstash/redis'
import webpush from 'web-push'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

// VAPID configuration
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:info@webstability.nl'

// Configure web-push
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, any>
  actions?: { action: string; title: string }[]
  requireInteraction?: boolean
}

// Notification templates for different events
export const NOTIFICATION_TEMPLATES = {
  // Phase changes
  phase_design: {
    title: '🎨 Ontwerpfase gestart',
    body: 'We zijn begonnen met het ontwerp van je website!'
  },
  phase_feedback: {
    title: '👀 Design klaar voor review',
    body: 'Je design preview is klaar om te bekijken!'
  },
  phase_revisie: {
    title: '✏️ Feedback ontvangen',
    body: 'We verwerken je feedback. Je hoort snel van ons!'
  },
  phase_payment: {
    title: '💳 Betaling vereist',
    body: 'Je design is goedgekeurd! Rond de betaling af om live te gaan.'
  },
  phase_domain: {
    title: '🌐 Domein configuratie',
    body: 'We configureren je domein. Bijna live!'
  },
  phase_live: {
    title: '🎉 Je website is live!',
    body: 'Gefeliciteerd! Je website staat nu online.'
  },
  
  // Messages
  new_message: {
    title: '💬 Nieuw bericht',
    body: 'Je hebt een nieuw bericht ontvangen.'
  },
  
  // Design
  design_ready: {
    title: '🎨 Design klaar!',
    body: 'Je design preview is klaar om te bekijken!'
  },
  design_updated: {
    title: '✨ Design bijgewerkt',
    body: 'Je design is aangepast. Bekijk de wijzigingen!'
  },
  
  // Reminders
  deadline_reminder: {
    title: '⏰ Actie vereist',
    body: 'Er staat een actie open voor je project.'
  },
  onboarding_reminder: {
    title: '📝 Onboarding herinnering',
    body: 'Vergeet niet je onboarding af te ronden!'
  },
  feedback_reminder: {
    title: '👀 Feedback herinnering',
    body: 'Je design wacht op je feedback!'
  },
  payment_reminder: {
    title: '💳 Betaling herinnering',
    body: 'Rond je betaling af om je website live te zetten!'
  }
} as const

export type NotificationType = keyof typeof NOTIFICATION_TEMPLATES

/**
 * Send a push notification to all subscribers of a project
 */
export async function sendPushNotification(
  projectId: string,
  type: NotificationType,
  customPayload?: Partial<NotificationPayload>
): Promise<{ sent: number; total: number }> {
  // Check if push is configured
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log('[Push] VAPID keys not configured, skipping notification')
    return { sent: 0, total: 0 }
  }

  try {
    // Get subscriptions
    const subscriptionKey = `push:${projectId}`
    const subscriptions = await redis.get(subscriptionKey) as PushSubscription[] | null

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`[Push] No subscriptions for project ${projectId}`)
      return { sent: 0, total: 0 }
    }

    // Get template
    const template = NOTIFICATION_TEMPLATES[type]
    if (!template) {
      console.error(`[Push] Unknown notification type: ${type}`)
      return { sent: 0, total: 0 }
    }

    // Build payload
    const payload: NotificationPayload = {
      ...template,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: `${type}-${projectId}`,
      data: {
        projectId,
        type,
        url: `/status/${projectId}`,
        timestamp: new Date().toISOString()
      },
      actions: [
        { action: 'open', title: 'Bekijken' },
        { action: 'dismiss', title: 'Later' }
      ],
      // Important notifications should require interaction
      requireInteraction: ['phase_feedback', 'phase_payment', 'phase_live', 'design_ready'].includes(type),
      ...customPayload
    }

    console.log(`[Push] Sending ${type} notification to ${subscriptions.length} subscribers for project ${projectId}`)

    // Send to all subscribers
    let sent = 0
    const validSubscriptions: PushSubscription[] = []

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(subscription, JSON.stringify(payload))
        sent++
        validSubscriptions.push(subscription)
      } catch (error: any) {
        console.error(`[Push] Failed to send to endpoint:`, error.message)
        
        // Remove invalid subscriptions (410 Gone or 404 Not Found)
        if (error.statusCode !== 410 && error.statusCode !== 404) {
          validSubscriptions.push(subscription)
        }
      }
    }

    // Update subscriptions if some were removed
    if (validSubscriptions.length !== subscriptions.length) {
      if (validSubscriptions.length > 0) {
        await redis.set(subscriptionKey, JSON.stringify(validSubscriptions))
      } else {
        await redis.del(subscriptionKey)
      }
    }

    console.log(`[Push] Sent ${sent}/${subscriptions.length} notifications for project ${projectId}`)
    return { sent, total: subscriptions.length }
  } catch (error) {
    console.error('[Push] Error sending notification:', error)
    return { sent: 0, total: 0 }
  }
}

/**
 * Send notification when phase changes
 */
export async function notifyPhaseChange(projectId: string, newPhase: string): Promise<void> {
  const phaseTypeMap: Record<string, NotificationType> = {
    design: 'phase_design',
    feedback: 'phase_feedback',
    revisie: 'phase_revisie',
    payment: 'phase_payment',
    domain: 'phase_domain',
    live: 'phase_live'
  }

  const notificationType = phaseTypeMap[newPhase]
  if (notificationType) {
    await sendPushNotification(projectId, notificationType)
  }
}

/**
 * Send notification for new message
 */
export async function notifyNewMessage(
  projectId: string, 
  messagePreview?: string
): Promise<void> {
  await sendPushNotification(projectId, 'new_message', {
    body: messagePreview 
      ? `"${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}"`
      : 'Je hebt een nieuw bericht ontvangen.'
  })
}

/**
 * Send notification when design is ready
 */
export async function notifyDesignReady(projectId: string): Promise<void> {
  await sendPushNotification(projectId, 'design_ready')
}

/**
 * Send reminder notification
 */
export async function sendReminder(
  projectId: string, 
  type: 'deadline' | 'onboarding' | 'feedback' | 'payment'
): Promise<void> {
  const reminderType = `${type}_reminder` as NotificationType
  await sendPushNotification(projectId, reminderType)
}
