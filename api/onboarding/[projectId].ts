import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

/**
 * API Endpoint: /api/onboarding/[projectId]
 * 
 * Get onboarding data for a specific project
 */

// Check if Redis is configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  status: string
  type: string
  packageType: string
  customer: {
    name: string
    email: string
    phone?: string
    companyName?: string
  }
  paymentStatus: string
  googleDriveUrl?: string
  onboardingData?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!kv) {
    return res.status(503).json({ error: 'Database not configured' })
  }

  try {
    const { projectId } = req.query

    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ error: 'Project ID required' })
    }

    // GET: Retrieve onboarding data
    if (req.method === 'GET') {
      const project = await kv.get<Project>(`project:${projectId}`)
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Return onboarding data in a format compatible with the frontend
      const onboardingData = project.onboardingData || {}
      return res.status(200).json({
        projectId: project.id,
        businessName: project.customer?.companyName || (onboardingData.businessName as string) || '',
        contactName: project.customer?.name || '',
        contactEmail: project.customer?.email || '',
        contactPhone: project.customer?.phone || '',
        serviceType: project.type,
        formData: onboardingData,
        submittedAt: onboardingData.submittedAt,
        isComplete: onboardingData.isComplete || false,
        googleDriveUrl: project.googleDriveUrl || onboardingData.driveFolderLink,
        ...onboardingData
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (error) {
    console.error('Onboarding API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
