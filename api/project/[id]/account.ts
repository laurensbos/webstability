import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  projectId?: string
  businessName?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  updatedAt?: string
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { id } = req.query
  const projectId = Array.isArray(id) ? id[0] : id

  if (!projectId) {
    return res.status(400).json({ success: false, message: 'Project ID is required' })
  }

  const { contactName, contactEmail, contactPhone, businessName } = req.body

  try {
    if (!kv) {
      console.error('Redis not configured')
      return res.status(500).json({ success: false, message: 'Database not available' })
    }

    // Get existing project
    const projectKey = `project:${projectId}`
    const project = await kv.get<Project>(projectKey)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    // Update project with new account data
    const updatedProject: Project = {
      ...project,
      ...(contactName && { contactName }),
      ...(contactEmail && { contactEmail }),
      ...(contactPhone !== undefined && { contactPhone }),
      ...(businessName && { businessName }),
      updatedAt: new Date().toISOString()
    }

    // Save to Redis
    await kv.set(projectKey, updatedProject)

    console.log(`Account updated for project ${projectId}:`, {
      contactName: updatedProject.contactName,
      contactEmail: updatedProject.contactEmail,
      businessName: updatedProject.businessName
    })

    return res.status(200).json({
      success: true,
      message: 'Account gegevens bijgewerkt',
      project: {
        contactName: updatedProject.contactName,
        contactEmail: updatedProject.contactEmail,
        contactPhone: updatedProject.contactPhone,
        businessName: updatedProject.businessName
      }
    })
  } catch (error) {
    console.error('Account update error:', error)
    return res.status(500).json({ success: false, message: 'Er ging iets mis bij het opslaan' })
  }
}
