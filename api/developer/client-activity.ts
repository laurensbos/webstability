import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface ChangeRequest {
  id: string
  description: string
  priority: 'low' | 'normal' | 'urgent'
  category: 'text' | 'design' | 'images' | 'functionality' | 'other'
  status: 'pending' | 'in_progress' | 'done' | 'completed'
  createdAt: string
  response?: string
}

interface Message {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
  senderName?: string
}

interface Project {
  id: string
  projectId?: string
  businessName?: string
  contactName?: string
  contactEmail?: string
  status?: string
  changeRequests?: ChangeRequest[]
  messages?: Message[]
  updatedAt?: string
  designPreviewUrl?: string
  liveUrl?: string
  [key: string]: unknown
}

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

/**
 * Developer Client Activity API
 * 
 * Provides real-time activity feed for developer dashboard
 * showing all client actions across all projects
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify authorization
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ success: false, message: 'Niet ingelogd.' })
  }

  if (!kv) {
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd',
      activities: []
    })
  }

  try {
    if (req.method === 'GET') {
      // Get query parameters
      const { filter, limit = '50', unreadOnly = 'false' } = req.query as Record<string, string>
      const maxItems = Math.min(parseInt(limit), 100)
      const onlyUnread = unreadOnly === 'true'

      // Get all projects
      const projectIds = await kv.smembers('projects') as string[]
      
      if (!projectIds || projectIds.length === 0) {
        return res.status(200).json({ 
          success: true, 
          activities: [],
          summary: { total: 0, unread: 0, actionRequired: 0 }
        })
      }

      // Fetch all projects
      const projects = await Promise.all(
        projectIds.map(id => kv.get<Project>(`project:${id}`))
      )
      
      const validProjects = projects.filter((p): p is Project => p !== null)
      
      // Collect all activities
      const activities: ActivityItem[] = []
      
      for (const project of validProjects) {
        const projectId = project.projectId || project.id
        const businessName = project.businessName || 'Onbekend'
        const contactName = project.contactName || ''
        const contactEmail = project.contactEmail || ''
        
        // Process unread messages from clients
        const clientMessages = (project.messages || [])
          .filter(msg => msg.from === 'client' && !msg.read)
        
        for (const msg of clientMessages) {
          activities.push({
            id: `msg-${msg.id}`,
            type: 'message',
            projectId,
            businessName,
            contactName,
            contactEmail,
            title: `Nieuw bericht van ${contactName || 'klant'}`,
            description: msg.message.length > 100 
              ? msg.message.substring(0, 100) + '...' 
              : msg.message,
            createdAt: msg.date,
            read: msg.read,
            actionRequired: true
          })
        }
        
        // Process pending change requests
        const pendingChanges = (project.changeRequests || [])
          .filter(cr => cr.status === 'pending')
        
        for (const change of pendingChanges) {
          activities.push({
            id: `cr-${change.id}`,
            type: 'change_request',
            projectId,
            businessName,
            contactName,
            contactEmail,
            title: `Wijzigingsverzoek: ${getCategoryLabel(change.category)}`,
            description: change.description.length > 100 
              ? change.description.substring(0, 100) + '...' 
              : change.description,
            priority: change.priority,
            category: change.category,
            status: change.status,
            createdAt: change.createdAt,
            read: false,
            actionRequired: true
          })
        }
        
        // Process in-progress change requests (for tracking)
        const inProgressChanges = (project.changeRequests || [])
          .filter(cr => cr.status === 'in_progress')
        
        for (const change of inProgressChanges) {
          activities.push({
            id: `cr-${change.id}`,
            type: 'change_request',
            projectId,
            businessName,
            contactName,
            contactEmail,
            title: `In behandeling: ${getCategoryLabel(change.category)}`,
            description: change.description.length > 100 
              ? change.description.substring(0, 100) + '...' 
              : change.description,
            priority: change.priority,
            category: change.category,
            status: change.status,
            createdAt: change.createdAt,
            read: true,
            actionRequired: false
          })
        }
      }
      
      // Sort by date (newest first)
      activities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      // Apply filters
      let filteredActivities = activities
      
      if (filter && filter !== 'all') {
        filteredActivities = activities.filter(a => a.type === filter)
      }
      
      if (onlyUnread) {
        filteredActivities = filteredActivities.filter(a => !a.read)
      }
      
      // Limit results
      const limitedActivities = filteredActivities.slice(0, maxItems)
      
      // Calculate summary
      const summary = {
        total: activities.length,
        unread: activities.filter(a => !a.read).length,
        actionRequired: activities.filter(a => a.actionRequired).length,
        byType: {
          messages: activities.filter(a => a.type === 'message').length,
          changeRequests: activities.filter(a => a.type === 'change_request').length
        }
      }

      return res.status(200).json({
        success: true,
        activities: limitedActivities,
        summary
      })
    }
    
    if (req.method === 'POST') {
      // Mark activity as read
      const { activityId, projectId, type } = req.body
      
      if (!activityId || !projectId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Activity ID en Project ID zijn verplicht' 
        })
      }
      
      // Get project
      const project = await kv.get<Project>(`project:${projectId}`)
      
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Project niet gevonden' 
        })
      }
      
      // Mark message as read
      if (type === 'message') {
        const messageId = activityId.replace('msg-', '')
        const messages = (project.messages || []).map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
        
        await kv.set(`project:${projectId}`, {
          ...project,
          messages,
          updatedAt: new Date().toISOString()
        })
      }
      
      return res.status(200).json({
        success: true,
        message: 'Activiteit gemarkeerd als gelezen'
      })
    }
    
    return res.status(405).json({ success: false, message: 'Method not allowed' })
    
  } catch (error) {
    console.error('Error in client-activity endpoint:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er ging iets mis bij het ophalen van activiteiten',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    text: 'Tekst',
    design: 'Design',
    images: 'Afbeeldingen',
    functionality: 'Functionaliteit',
    other: 'Overig'
  }
  return labels[category] || category
}
