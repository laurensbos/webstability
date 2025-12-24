/**
 * Customer Notifications API
 * 
 * Haalt notificaties op voor een klant op basis van email.
 * Gebruikt door het klantenportaal voor realtime updates.
 * 
 * GET /api/customer/notifications?email=...
 * POST /api/customer/notifications/read - markeer als gelezen
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'action'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
  projectId?: string
}

interface Project {
  id: string
  status: string
  businessName?: string
  contactEmail?: string
  changeRequests?: Array<{
    id: string
    status: string
    response?: string
    createdAt?: string
  }>
  messages?: Array<{
    id: string
    from: string
    read: boolean
    message: string
    date: string
  }>
  designPreviewUrl?: string
  paymentUrl?: string
  liveUrl?: string
  updatedAt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!kv) {
    return res.status(500).json({ success: false, message: 'Database not available' })
  }

  // GET - Fetch notifications for customer
  if (req.method === 'GET') {
    const email = req.query.email as string

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    try {
      // Find all projects for this email
      const projectIds = await kv.smembers('projects') as string[]
      const notifications: Notification[] = []

      if (projectIds && projectIds.length > 0) {
        const projects = await Promise.all(
          projectIds.map(id => kv!.get<Project>(`project:${id}`))
        )

        // Filter projects for this customer
        const customerProjects = projects.filter(p => 
          p && p.contactEmail?.toLowerCase() === email.toLowerCase()
        )

        // Generate notifications based on project status
        for (const project of customerProjects) {
          if (!project) continue

          const projectId = project.id

          // Check for unread messages from developer
          const unreadMessages = project.messages?.filter(m => 
            m.from === 'developer' && !m.read
          ) || []

          if (unreadMessages.length > 0) {
            notifications.push({
              id: `msg-${projectId}-${Date.now()}`,
              type: 'action',
              title: 'Nieuw bericht',
              message: `Je hebt ${unreadMessages.length} ongelezen bericht${unreadMessages.length > 1 ? 'en' : ''} van het team.`,
              link: `/status/${projectId}`,
              read: false,
              createdAt: unreadMessages[0].date,
              projectId
            })
          }

          // Check for completed change requests
          const completedRequests = project.changeRequests?.filter(cr => 
            cr.status === 'completed' && cr.response
          ) || []

          for (const cr of completedRequests.slice(0, 3)) {
            notifications.push({
              id: `cr-${cr.id}`,
              type: 'success',
              title: 'Wijziging afgerond',
              message: cr.response || 'Je aangevraagde wijziging is verwerkt.',
              link: `/status/${projectId}`,
              read: false,
              createdAt: cr.createdAt || new Date().toISOString(),
              projectId
            })
          }

          // Status-based notifications
          if (project.status === 'feedback' && project.designPreviewUrl) {
            notifications.push({
              id: `design-${projectId}`,
              type: 'action',
              title: 'Design klaar!',
              message: `Het design voor ${project.businessName || 'je project'} is klaar om te bekijken.`,
              link: `/status/${projectId}`,
              read: false,
              createdAt: project.updatedAt || new Date().toISOString(),
              projectId
            })
          }

          if (project.status === 'payment' && project.paymentUrl) {
            notifications.push({
              id: `payment-${projectId}`,
              type: 'warning',
              title: 'Betaling openstaand',
              message: `Je betaling voor ${project.businessName || 'je project'} staat nog open.`,
              link: `/status/${projectId}`,
              read: false,
              createdAt: project.updatedAt || new Date().toISOString(),
              projectId
            })
          }

          if (project.status === 'live' && project.liveUrl) {
            notifications.push({
              id: `live-${projectId}`,
              type: 'success',
              title: '🎉 Website live!',
              message: `${project.businessName || 'Je website'} is nu online!`,
              link: project.liveUrl,
              read: false,
              createdAt: project.updatedAt || new Date().toISOString(),
              projectId
            })
          }
        }
      }

      // Sort by date (newest first)
      notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      return res.status(200).json({
        success: true,
        notifications: notifications.slice(0, 20) // Max 20 notifications
      })
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      return res.status(500).json({ success: false, message: 'Failed to fetch notifications' })
    }
  }

  // POST - Mark notification as read
  if (req.method === 'POST') {
    // For now, notifications are generated dynamically, not stored
    // In a full implementation, you would store read status per notification
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' })
}
