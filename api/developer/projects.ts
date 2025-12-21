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
  status: 'onboarding' | 'intake' | 'design' | 'development' | 'review' | 'live'
  type: 'website' | 'webshop' | 'drone' | 'logo'
  packageType: string
  customer: {
    name: string
    email: string
    phone?: string
    companyName?: string
  }
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentId?: string
  onboardingData?: Record<string, unknown>
  messages?: Array<{
    id: string
    date: string
    from: 'client' | 'developer'
    message: string
    read: boolean
  }>
  createdAt: string
  updatedAt: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
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

  // Check Redis configuration
  if (!kv) {
    console.error('Redis not configured')
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd',
      projects: []
    })
  }

  try {
    if (req.method === 'GET') {
      // Get all projects from Redis
      const ids = await kv.smembers('projects') as string[]
      
      if (!ids || ids.length === 0) {
        return res.status(200).json({ success: true, projects: [] })
      }
      
      const projects = await Promise.all(
        ids.map(id => kv.get<Project>(`project:${id}`))
      )
      
      const validProjects = projects.filter((p): p is Project => p !== null)
      
      // Map to dashboard format
      const mappedProjects = validProjects.map(p => ({
        id: p.id,
        projectId: p.id,
        businessName: p.customer?.companyName || p.customer?.name || 'Onbekend',
        contactName: p.customer?.name || '',
        contactEmail: p.customer?.email || '',
        contactPhone: p.customer?.phone || '',
        package: p.packageType || 'starter',
        phase: mapStatus(p.status),
        paymentStatus: mapPaymentStatus(p.paymentStatus),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        messages: p.messages || [],
        onboardingData: p.onboardingData || {},
        type: p.type,
      }))
      
      // Sort by createdAt (newest first)
      mappedProjects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      return res.status(200).json({ success: true, projects: mappedProjects })
    }
    
    if (req.method === 'PUT') {
      // Update project
      const { id, ...updates } = req.body
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'Project ID verplicht' })
      }
      
      const existing = await kv.get<Project>(`project:${id}`)
      
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Project niet gevonden' })
      }
      
      // Map dashboard fields back to storage format
      const updatedProject: Project = {
        ...existing,
        status: mapPhaseToStatus(updates.phase) || existing.status,
        paymentStatus: updates.paymentStatus || existing.paymentStatus,
        messages: updates.messages || existing.messages,
        updatedAt: new Date().toISOString(),
      }
      
      await kv.set(`project:${id}`, updatedProject)
      
      return res.status(200).json({ success: true, project: updatedProject })
    }
    
    if (req.method === 'DELETE') {
      // Delete project
      const projectId = req.query.projectId as string
      
      if (!projectId) {
        return res.status(400).json({ success: false, message: 'Project ID verplicht' })
      }
      
      const existing = await kv.get<Project>(`project:${projectId}`)
      
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Project niet gevonden' })
      }
      
      // Remove project from Redis
      await kv.del(`project:${projectId}`)
      
      // Remove from projects set
      await kv.srem('projects', projectId)
      
      console.log(`Project ${projectId} deleted by developer`)
      
      return res.status(200).json({ success: true, message: 'Project verwijderd' })
    }
    
    return res.status(405).json({ success: false, message: 'Method not allowed' })

  } catch (error) {
    console.error('Developer projects API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij ophalen projecten.',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Map internal status to dashboard phase
function mapStatus(status: string): 'onboarding' | 'design' | 'development' | 'review' | 'live' {
  const statusMap: Record<string, 'onboarding' | 'design' | 'development' | 'review' | 'live'> = {
    'pending': 'onboarding',
    'onboarding': 'onboarding',
    'intake': 'onboarding',
    'design': 'design',
    'development': 'development',
    'review': 'review',
    'revisions': 'review',
    'live': 'live',
  }
  return statusMap[status] || 'onboarding'
}

// Map dashboard phase back to internal status
function mapPhaseToStatus(phase: string): Project['status'] | null {
  const phaseMap: Record<string, Project['status']> = {
    'onboarding': 'onboarding',
    'design': 'design',
    'development': 'development',
    'review': 'review',
    'live': 'live',
  }
  return phaseMap[phase] || null
}

// Map payment status
function mapPaymentStatus(status: string): 'pending' | 'awaiting_payment' | 'paid' | 'failed' | 'refunded' {
  const paymentMap: Record<string, 'pending' | 'awaiting_payment' | 'paid' | 'failed' | 'refunded'> = {
    'pending': 'pending',
    'awaiting_payment': 'awaiting_payment',
    'paid': 'paid',
    'failed': 'failed',
    'refunded': 'refunded',
  }
  return paymentMap[status] || 'pending'
}
