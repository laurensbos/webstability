/**
 * Push Notifications API
 * 
 * POST /api/push/subscribe - Subscribe to push notifications
 * POST /api/push/unsubscribe - Unsubscribe from push notifications
 * POST /api/push/send - Send a push notification (internal use)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import webpush from 'web-push'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

// VAPID keys for web push
// Generate with: npx web-push generate-vapid-keys
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { action } = req.query

  // GET - Return VAPID public key
  if (req.method === 'GET') {
    if (action === 'vapid-key') {
      return res.status(200).json({ 
        publicKey: VAPID_PUBLIC_KEY,
        enabled: Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY)
      })
    }
    return res.status(400).json({ error: 'Invalid action' })
  }

  if (req.method === 'POST') {
    const { projectId, subscription, type } = req.body

    // Subscribe to push notifications
    if (action === 'subscribe') {
      if (!projectId || !subscription) {
        return res.status(400).json({ error: 'projectId and subscription are required' })
      }

      try {
        // Store subscription in Redis
        const subscriptionKey = `push:${projectId}`
        const existingSubscriptions = await redis.get(subscriptionKey) as PushSubscription[] | null
        
        const subscriptions = existingSubscriptions || []
        
        // Check if subscription already exists
        const exists = subscriptions.some(
          (s: PushSubscription) => s.endpoint === subscription.endpoint
        )
        
        if (!exists) {
          subscriptions.push(subscription)
          await redis.set(subscriptionKey, JSON.stringify(subscriptions))
        }

        // Log activity
        await redis.lpush(`project:${projectId}:activity`, JSON.stringify({
          type: 'push_subscribed',
          action: 'Klant heeft push notificaties ingeschakeld',
          timestamp: new Date().toISOString()
        }))

        return res.status(200).json({ 
          success: true, 
          message: 'Subscription saved' 
        })
      } catch (error) {
        console.error('Failed to save subscription:', error)
        return res.status(500).json({ error: 'Failed to save subscription' })
      }
    }

    // Unsubscribe from push notifications
    if (action === 'unsubscribe') {
      if (!projectId || !subscription) {
        return res.status(400).json({ error: 'projectId and subscription are required' })
      }

      try {
        const subscriptionKey = `push:${projectId}`
        const existingSubscriptions = await redis.get(subscriptionKey) as PushSubscription[] | null
        
        if (existingSubscriptions) {
          const filtered = existingSubscriptions.filter(
            (s: PushSubscription) => s.endpoint !== subscription.endpoint
          )
          
          if (filtered.length > 0) {
            await redis.set(subscriptionKey, JSON.stringify(filtered))
          } else {
            await redis.del(subscriptionKey)
          }
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Unsubscribed' 
        })
      } catch (error) {
        console.error('Failed to unsubscribe:', error)
        return res.status(500).json({ error: 'Failed to unsubscribe' })
      }
    }

    // Send push notification (internal use)
    if (action === 'send') {
      // Check for API key or internal auth
      const authHeader = req.headers.authorization
      if (!authHeader || authHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      if (!projectId) {
        return res.status(400).json({ error: 'projectId is required' })
      }

      const { title, body, data } = req.body as {
        title: string
        body: string
        data?: Record<string, any>
      }

      if (!title || !body) {
        return res.status(400).json({ error: 'title and body are required' })
      }

      try {
        const subscriptionKey = `push:${projectId}`
        const subscriptions = await redis.get(subscriptionKey) as PushSubscription[] | null

        if (!subscriptions || subscriptions.length === 0) {
          return res.status(200).json({ 
            success: true, 
            message: 'No subscriptions found',
            sent: 0 
          })
        }

        const payload: NotificationPayload = {
          title,
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: `project-${projectId}`,
          data: {
            projectId,
            url: `/status/${projectId}`,
            ...data
          },
          actions: [
            { action: 'open', title: 'Bekijken' },
            { action: 'dismiss', title: 'Later' }
          ]
        }

        const results = await Promise.allSettled(
          subscriptions.map(async (subscription: PushSubscription) => {
            try {
              await webpush.sendNotification(
                subscription,
                JSON.stringify(payload)
              )
              return { success: true }
            } catch (error: any) {
              // Remove invalid subscriptions
              if (error.statusCode === 410 || error.statusCode === 404) {
                const filtered = subscriptions.filter(
                  (s: PushSubscription) => s.endpoint !== subscription.endpoint
                )
                if (filtered.length > 0) {
                  await redis.set(subscriptionKey, JSON.stringify(filtered))
                } else {
                  await redis.del(subscriptionKey)
                }
              }
              return { success: false, error: error.message }
            }
          })
        )

        const sent = results.filter(
          (r) => r.status === 'fulfilled' && (r.value as any).success
        ).length

        return res.status(200).json({ 
          success: true, 
          sent,
          total: subscriptions.length 
        })
      } catch (error) {
        console.error('Failed to send notification:', error)
        return res.status(500).json({ error: 'Failed to send notification' })
      }
    }

    // Send notification by type (triggered by phase changes, messages, etc.)
    if (action === 'notify') {
      if (!projectId || !type) {
        return res.status(400).json({ error: 'projectId and type are required' })
      }

      const notificationTemplates: Record<string, { title: string; body: string }> = {
        'phase_change': {
          title: '🚀 Nieuwe fase!',
          body: 'Je project is naar een nieuwe fase gegaan. Bekijk de voortgang!'
        },
        'new_message': {
          title: '💬 Nieuw bericht',
          body: 'Je hebt een nieuw bericht ontvangen van de developer.'
        },
        'design_ready': {
          title: '🎨 Design klaar!',
          body: 'Je design preview is klaar om te bekijken!'
        },
        'feedback_processed': {
          title: '✨ Feedback verwerkt',
          body: 'Je feedback is verwerkt. Bekijk de aanpassingen!'
        },
        'payment_required': {
          title: '💳 Betaling vereist',
          body: 'Je design is goedgekeurd! Rond de betaling af om live te gaan.'
        },
        'website_live': {
          title: '🎉 Je website is live!',
          body: 'Gefeliciteerd! Je website staat nu online.'
        },
        'deadline_reminder': {
          title: '⏰ Deadline nadert',
          body: 'Er staat een actie open voor je project. Bekijk wat je moet doen.'
        }
      }

      const template = notificationTemplates[type]
      if (!template) {
        return res.status(400).json({ error: 'Unknown notification type' })
      }

      try {
        const subscriptionKey = `push:${projectId}`
        const subscriptions = await redis.get(subscriptionKey) as PushSubscription[] | null

        if (!subscriptions || subscriptions.length === 0) {
          return res.status(200).json({ 
            success: true, 
            message: 'No subscriptions found',
            sent: 0 
          })
        }

        const payload: NotificationPayload = {
          ...template,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: `${type}-${projectId}`,
          data: {
            projectId,
            type,
            url: `/status/${projectId}`
          },
          requireInteraction: ['design_ready', 'payment_required', 'website_live'].includes(type)
        }

        let sent = 0
        for (const subscription of subscriptions) {
          try {
            await webpush.sendNotification(subscription, JSON.stringify(payload))
            sent++
          } catch (error: any) {
            if (error.statusCode === 410 || error.statusCode === 404) {
              // Remove invalid subscription
              const filtered = subscriptions.filter(
                (s: PushSubscription) => s.endpoint !== subscription.endpoint
              )
              if (filtered.length > 0) {
                await redis.set(subscriptionKey, JSON.stringify(filtered))
              } else {
                await redis.del(subscriptionKey)
              }
            }
          }
        }

        return res.status(200).json({ 
          success: true, 
          sent,
          total: subscriptions.length 
        })
      } catch (error) {
        console.error('Failed to send notification:', error)
        return res.status(500).json({ error: 'Failed to send notification' })
      }
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
