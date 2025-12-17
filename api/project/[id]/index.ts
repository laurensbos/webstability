/**
 * Get project by ID for client portal
 * GET /api/project/[id]
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  projectId?: string
  status: string
  phase?: string
  type?: string
  packageType?: string
  package?: string
  customer?: {
    name: string
    email: string
    phone?: string
    companyName?: string
  }
  businessName?: string
  contactEmail?: string
  contactPhone?: string
  paymentStatus?: string
  previewUrl?: string
  liveUrl?: string
  estimatedCompletion?: string
  statusMessage?: string
  messages?: Array<{
    id: string
    from: string
    message: string
    timestamp: string
    read?: boolean
  }>
  updates?: Array<{
    date: string
    title: string
    description: string
    phase: string
  }>
  changeRequests?: Array<{
    id: string
    date: string
    request: string
    priority: string
    status: string
  }>
  revisionsUsed?: number
  revisionsTotal?: number
  designApprovedAt?: string
  createdAt: string
  updatedAt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  if (!kv) {
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd'
    })
  }

  try {
    const { id } = req.query
    const projectId = Array.isArray(id) ? id[0] : id

    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID is verplicht' 
      })
    }

    // Try different key formats
    const normalizedId = projectId.trim().toUpperCase()
    let project = await kv.get<Project>(`project:${normalizedId}`)
    
    if (!project) {
      project = await kv.get<Project>(`project:${projectId.trim()}`)
    }

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project niet gevonden' 
      })
    }

    // Map project data to expected format for client portal
    const clientProject = {
      projectId: project.id || project.projectId || normalizedId,
      businessName: project.customer?.companyName || project.customer?.name || project.businessName || 'Je project',
      contactName: project.customer?.name || '',
      contactEmail: project.customer?.email || project.contactEmail || '',
      contactPhone: project.customer?.phone || project.contactPhone || '',
      package: project.packageType || project.package || '',
      type: project.type || 'website',
      status: project.phase || project.status || 'onboarding',
      statusMessage: project.statusMessage || getDefaultStatusMessage(project.phase || project.status),
      paymentStatus: project.paymentStatus || 'pending',
      estimatedCompletion: project.estimatedCompletion || '',
      previewUrl: project.previewUrl || '',
      liveUrl: project.liveUrl || '',
      updates: project.updates || [],
      messages: project.messages || [],
      changeRequests: project.changeRequests || [],
      revisionsUsed: project.revisionsUsed || 0,
      revisionsTotal: project.revisionsTotal || 3,
      designApprovedAt: project.designApprovedAt,
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: project.updatedAt
    }

    return res.status(200).json(clientProject)
  } catch (error) {
    console.error('Error fetching project:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij ophalen project' 
    })
  }
}

function getDefaultStatusMessage(phase: string): string {
  switch (phase) {
    case 'onboarding':
      return 'We verzamelen je materialen en wensen voor het project.'
    case 'intake':
      return 'We plannen een intake gesprek om je wensen te bespreken.'
    case 'design':
      return 'We werken aan het ontwerp van je website.'
    case 'development':
      return 'We bouwen je website volgens het goedgekeurde ontwerp.'
    case 'review':
      return 'Je website is klaar voor review. Bekijk hem en geef feedback.'
    case 'live':
      return 'Gefeliciteerd! Je website is live!'
    default:
      return 'We werken aan je project.'
  }
}
