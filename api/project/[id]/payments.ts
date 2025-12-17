/**
 * Get Payments API Endpoint
 * 
 * Haalt alle betalingen/facturen op voor een specifiek project vanuit Mollie.
 * 
 * GET /api/project/[id]/payments
 * 
 * Response: {
 *   success: boolean,
 *   payments: Array<{
 *     id: string,
 *     date: string,
 *     description: string,
 *     amount: number,
 *     status: 'paid' | 'pending' | 'open' | 'failed' | 'expired' | 'cancelled',
 *     paidAt?: string,
 *     method?: string
 *   }>,
 *   error?: string
 * }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const MOLLIE_API_URL = 'https://api.mollie.com/v2'
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY || ''

// Redis for project data
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

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
    originalAmount?: number
    discountCode?: string
  }
}

interface ProjectData {
  projectId: string
  mollieCustomerId?: string
  contactEmail?: string
  [key: string]: unknown
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
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
  
  const { id } = req.query
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Project ID is vereist' })
  }
  
  try {
    console.log(`[Payments] Ophalen betalingen voor project ${id}`)
    
    // Haal project data op uit Redis
    const projectData = kv ? await kv.get(`project:${id}`) as ProjectData | null : null
    
    if (!projectData) {
      console.log(`[Payments] Project ${id} niet gevonden in Redis`)
      return res.status(404).json({ success: false, error: 'Project niet gevonden' })
    }
    
    // Als we een Mollie customer ID hebben, haal betalingen via customer op
    let payments: MolliePayment[] = []
    
    if (projectData.mollieCustomerId) {
      payments = await getCustomerPayments(projectData.mollieCustomerId, id)
    } else {
      // Fallback: zoek betalingen op basis van email of metadata
      payments = await searchPaymentsByProjectId(id)
    }
    
    // Map naar frontend formaat
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      date: payment.createdAt,
      description: payment.description,
      amount: parseFloat(payment.amount.value),
      status: mapMollieStatus(payment.status),
      paidAt: payment.paidAt,
      method: payment.method,
      originalAmount: payment.metadata?.originalAmount,
      discountCode: payment.metadata?.discountCode
    }))
    
    console.log(`[Payments] ${formattedPayments.length} betalingen gevonden voor project ${id}`)
    
    return res.status(200).json({
      success: true,
      payments: formattedPayments
    })
    
  } catch (error) {
    console.error('[Payments] Error:', error)
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Er ging iets mis bij het ophalen van betalingen'
    })
  }
}

// Haal betalingen op via Mollie customer ID
async function getCustomerPayments(customerId: string, projectId: string): Promise<MolliePayment[]> {
  try {
    const response = await fetch(
      `${MOLLIE_API_URL}/customers/${customerId}/payments?limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${MOLLIE_API_KEY}`
        }
      }
    )
    
    if (!response.ok) {
      console.error('[Payments] Mollie error:', await response.text())
      return []
    }
    
    const data = await response.json()
    
    // Filter betalingen die bij dit project horen
    const projectPayments = (data._embedded?.payments || []).filter(
      (p: MolliePayment) => p.metadata?.projectId === projectId
    )
    
    return projectPayments
  } catch (error) {
    console.error('[Payments] Error fetching customer payments:', error)
    return []
  }
}

// Zoek betalingen op basis van project ID in metadata
async function searchPaymentsByProjectId(projectId: string): Promise<MolliePayment[]> {
  try {
    // Mollie heeft geen directe search op metadata, dus we halen recente betalingen op
    // en filteren op metadata
    const response = await fetch(
      `${MOLLIE_API_URL}/payments?limit=250`,
      {
        headers: {
          'Authorization': `Bearer ${MOLLIE_API_KEY}`
        }
      }
    )
    
    if (!response.ok) {
      console.error('[Payments] Mollie error:', await response.text())
      return []
    }
    
    const data = await response.json()
    
    // Filter op projectId in metadata
    const projectPayments = (data._embedded?.payments || []).filter(
      (p: MolliePayment) => p.metadata?.projectId === projectId
    )
    
    return projectPayments
  } catch (error) {
    console.error('[Payments] Error searching payments:', error)
    return []
  }
}

// Map Mollie status naar frontend status
function mapMollieStatus(mollieStatus: string): 'paid' | 'pending' | 'open' | 'failed' | 'expired' | 'cancelled' {
  switch (mollieStatus) {
    case 'paid':
      return 'paid'
    case 'pending':
    case 'authorized':
      return 'pending'
    case 'open':
      return 'open'
    case 'failed':
      return 'failed'
    case 'expired':
      return 'expired'
    case 'canceled':
    case 'cancelled':
      return 'cancelled'
    default:
      return 'pending'
  }
}
