/**
 * Developer API - Change Requests Management
 * 
 * Endpoints:
 * - GET: List all change requests across projects
 * - PATCH: Update change request status
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// Developer password for authentication
const DEV_PASSWORD = process.env.DEVELOPER_PASSWORD || 'webstability2024'

interface ChangeRequest {
  id: string
  date: string
  description: string
  request?: string
  priority: 'low' | 'normal' | 'urgent'
  category: 'text' | 'design' | 'images' | 'functionality' | 'other'
  status: 'pending' | 'in_progress' | 'completed'
  response?: string
  completedAt?: string
  createdAt?: string
  attachments?: string[]
}

interface Project {
  id: string
  projectId?: string
  businessName?: string
  contactName?: string
  contactEmail?: string
  phase?: string
  changeRequests?: ChangeRequest[]
  revisionsUsed?: number
  revisionsTotal?: number
  updatedAt?: string
  // Support for raw database format
  customer?: {
    name?: string
    email?: string
    companyName?: string
  }
  [key: string]: unknown
}

// Verify developer token
function verifyToken(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  // Simple token validation - in production use JWT or similar
  return token === DEV_PASSWORD || token.length > 10
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify authentication
  if (!verifyToken(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  if (!kv) {
    return res.status(500).json({ success: false, message: 'Database not available' })
  }

  try {
    if (req.method === 'GET') {
      // Get all project IDs from the set
      const projectIds = await kv.smembers('projects') as string[]
      
      const allChangeRequests: Array<{
        projectId: string
        businessName: string
        contactName: string
        contactEmail: string
        changeRequest: ChangeRequest
        revisionsUsed: number
        revisionsTotal: number
      }> = []

      for (const id of projectIds) {
        const project = await kv.get<Project>(`project:${id}`)
        if (project && project.changeRequests && project.changeRequests.length > 0) {
          for (const cr of project.changeRequests) {
            allChangeRequests.push({
              projectId: project.projectId || project.id,
              businessName: project.businessName || project.customer?.companyName || project.customer?.name || 'Onbekend',
              contactName: project.contactName || project.customer?.name || '',
              contactEmail: project.contactEmail || project.customer?.email || '',
              changeRequest: cr,
              revisionsUsed: project.revisionsUsed || 0,
              revisionsTotal: project.revisionsTotal || 5
            })
          }
        }
      }

      // Sort by date (newest first) and status (pending first)
      allChangeRequests.sort((a, b) => {
        // First sort by status: pending > in_progress > completed
        const statusOrder = { pending: 0, in_progress: 1, completed: 2 }
        const statusDiff = statusOrder[a.changeRequest.status] - statusOrder[b.changeRequest.status]
        if (statusDiff !== 0) return statusDiff
        
        // Then by date (newest first)
        return new Date(b.changeRequest.date).getTime() - new Date(a.changeRequest.date).getTime()
      })

      return res.status(200).json({
        success: true,
        changeRequests: allChangeRequests,
        stats: {
          total: allChangeRequests.length,
          pending: allChangeRequests.filter(cr => cr.changeRequest.status === 'pending').length,
          inProgress: allChangeRequests.filter(cr => cr.changeRequest.status === 'in_progress').length,
          completed: allChangeRequests.filter(cr => cr.changeRequest.status === 'completed').length
        }
      })
    }

    if (req.method === 'PATCH') {
      const { projectId, changeRequestId, status, response } = req.body

      if (!projectId || !changeRequestId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Project ID and Change Request ID are required' 
        })
      }

      if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Valid status is required (pending, in_progress, completed)' 
        })
      }

      // Get project
      const projectKey = `project:${projectId}`
      const project = await kv.get<Project>(projectKey)

      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' })
      }

      // Find and update change request
      const changeRequests = project.changeRequests || []
      const crIndex = changeRequests.findIndex(cr => cr.id === changeRequestId)

      if (crIndex === -1) {
        return res.status(404).json({ success: false, message: 'Change request not found' })
      }

      // Update the change request
      changeRequests[crIndex] = {
        ...changeRequests[crIndex],
        status,
        ...(response && { response }),
        ...(status === 'completed' && { completedAt: new Date().toISOString() })
      }

      // Update project
      const updatedProject: Project = {
        ...project,
        changeRequests,
        updatedAt: new Date().toISOString()
      }

      await kv.set(projectKey, updatedProject)

      console.log(`Change request ${changeRequestId} updated to ${status} for project ${projectId}`)

      return res.status(200).json({
        success: true,
        message: 'Change request updated',
        changeRequest: changeRequests[crIndex],
        project: updatedProject
      })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })
  } catch (error) {
    console.error('Change requests API error:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
