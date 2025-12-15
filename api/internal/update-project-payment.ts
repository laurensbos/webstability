/**
 * Internal API: Update Project Payment Status
 * 
 * Dit endpoint wordt intern aangeroepen door de Mollie webhook
 * om de betalingsstatus van een project te updaten.
 * 
 * POST /api/internal/update-project-payment
 * 
 * Body: {
 *   projectId: string
 *   paymentStatus: 'pending' | 'awaiting_payment' | 'paid' | 'failed'
 *   paymentCompletedAt?: string
 * }
 * 
 * Beveiligd met X-Internal-Secret header
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || 'dev-secret-change-in-production'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Alleen POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  // Beveiligingscheck - alleen interne calls
  const secret = req.headers['x-internal-secret']
  if (secret !== INTERNAL_SECRET) {
    console.error('[Internal API] Unauthorized request')
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  try {
    const { projectId, paymentStatus, paymentCompletedAt } = req.body
    
    if (!projectId || !paymentStatus) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    console.log(`[Internal API] Update project ${projectId}: paymentStatus = ${paymentStatus}`)
    
    // Hier zou je je database updaten
    // Voorbeeld met een SQLite/Postgres query of een Firebase update
    
    // Voor development: schrijf naar een JSON file of gebruik de mock data
    // In productie: gebruik je echte database
    
    // Voorbeeld database update:
    // await db.query(`
    //   UPDATE projects 
    //   SET 
    //     payment_status = $1,
    //     payment_completed_at = $2,
    //     updated_at = NOW()
    //   WHERE project_id = $3
    // `, [paymentStatus, paymentCompletedAt, projectId])
    
    // Log voor tracking
    console.log(`[Internal API] ✅ Project ${projectId} updated:`, {
      paymentStatus,
      paymentCompletedAt
    })
    
    return res.status(200).json({ 
      success: true,
      projectId,
      paymentStatus,
      paymentCompletedAt
    })
    
  } catch (error) {
    console.error('[Internal API] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
