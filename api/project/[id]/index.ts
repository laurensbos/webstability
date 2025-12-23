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

const MOLLIE_API_URL = 'https://api.mollie.com/v2'
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY || ''

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
  designPreviewUrl?: string
  liveUrl?: string
  estimatedCompletion?: string
  statusMessage?: string
  mollieCustomerId?: string
  googleDriveUrl?: string
  onboardingData?: {
    driveFolderLink?: string
    driveFolderId?: string
    [key: string]: unknown
  }
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

interface MolliePayment {
  id: string
  status: string
  amount: { value: string; currency: string }
  description: string
  createdAt: string
  paidAt?: string
  method?: string
  metadata?: {
    projectId?: string
    packageType?: string
    type?: string
  }
}

interface Invoice {
  id: string
  date: string
  description: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  paidAt?: string
  paymentMethod?: string
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
      project = await kv.get<Project>(`project:${projectId.trim().toLowerCase()}`)
    }

    if (!project) {
      console.log(`[project/[id]] Project not found: ${normalizedId}`)
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
      designPreviewUrl: project.designPreviewUrl || '',
      liveUrl: project.liveUrl || '',
      updates: project.updates || [],
      messages: project.messages || [],
      changeRequests: project.changeRequests || [],
      revisionsUsed: project.revisionsUsed || 0,
      revisionsTotal: project.revisionsTotal || 3,
      designApprovedAt: project.designApprovedAt,
      googleDriveUrl: project.googleDriveUrl || project.onboardingData?.driveFolderLink || '',
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: project.updatedAt,
      invoices: [] as Invoice[]
    }
    
    // Fetch invoices from Mollie if we have API key
    if (MOLLIE_API_KEY) {
      try {
        const invoices = await fetchMolliePayments(
          normalizedId, 
          project.mollieCustomerId
        )
        clientProject.invoices = invoices
      } catch (e) {
        console.error('Error fetching Mollie payments:', e)
        // Continue without invoices
      }
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

// Fetch payments from Mollie for this project
async function fetchMolliePayments(
  projectId: string, 
  customerId?: string
): Promise<Invoice[]> {
  const payments: MolliePayment[] = []
  
  try {
    // If we have a customer ID, fetch via customer
    if (customerId) {
      const response = await fetch(
        `${MOLLIE_API_URL}/customers/${customerId}/payments?limit=50`,
        {
          headers: { 'Authorization': `Bearer ${MOLLIE_API_KEY}` }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const customerPayments = (data._embedded?.payments || []) as MolliePayment[]
        // Filter by projectId in metadata
        payments.push(
          ...customerPayments.filter(p => p.metadata?.projectId === projectId)
        )
      }
    }
    
    // If no payments found yet, search all recent payments
    if (payments.length === 0) {
      const response = await fetch(
        `${MOLLIE_API_URL}/payments?limit=100`,
        {
          headers: { 'Authorization': `Bearer ${MOLLIE_API_KEY}` }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const allPayments = (data._embedded?.payments || []) as MolliePayment[]
        payments.push(
          ...allPayments.filter(p => p.metadata?.projectId === projectId)
        )
      }
    }
  } catch (e) {
    console.error('Error fetching Mollie payments:', e)
  }
  
  // Map to Invoice format
  return payments.map(payment => ({
    id: payment.id,
    date: payment.createdAt,
    description: payment.description,
    amount: parseFloat(payment.amount.value),
    status: mapMollieStatus(payment.status),
    paidAt: payment.paidAt,
    paymentMethod: payment.method
  }))
}

// Map Mollie status to Invoice status
function mapMollieStatus(
  mollieStatus: string
): 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' {
  switch (mollieStatus) {
    case 'paid':
      return 'paid'
    case 'open':
    case 'pending':
    case 'authorized':
      return 'sent'
    case 'expired':
      return 'overdue'
    case 'failed':
    case 'canceled':
    case 'cancelled':
      return 'cancelled'
    default:
      return 'draft'
  }
}
