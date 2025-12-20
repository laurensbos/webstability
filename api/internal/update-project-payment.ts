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
import { Redis } from '@upstash/redis'

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || 'dev-secret-change-in-production'

// Redis connection
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  phase: string
  paymentStatus?: string
  paymentCompletedAt?: string
  contactEmail?: string
  contactName?: string
  businessName?: string
  [key: string]: unknown
}

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
  
  if (!kv) {
    return res.status(503).json({ error: 'Database not configured' })
  }
  
  try {
    const { projectId, paymentStatus, paymentCompletedAt } = req.body
    
    if (!projectId || !paymentStatus) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    console.log(`[Internal API] Update project ${projectId}: paymentStatus = ${paymentStatus}`)
    
    // Haal project op uit Redis
    const project = await kv.get<Project>(`project:${projectId}`)
    
    if (!project) {
      console.error(`[Internal API] Project ${projectId} not found`)
      return res.status(404).json({ error: 'Project not found' })
    }
    
    // Update project
    const updatedProject: Project = {
      ...project,
      paymentStatus,
      paymentCompletedAt: paymentCompletedAt || project.paymentCompletedAt,
      updatedAt: new Date().toISOString()
    }
    
    // Als betaling succesvol EN project is in design_approved fase → automatisch naar development
    if (paymentStatus === 'paid' && project.phase === 'design_approved') {
      console.log(`[Internal API] Project ${projectId} betaald in design_approved fase → automatisch naar development`)
      updatedProject.phase = 'development'
      
      // Stuur fase-email naar klant
      try {
        const baseUrl = process.env.SITE_URL || 'https://webstability.nl'
        await fetch(`${baseUrl}/api/send-phase-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project.id,
            projectName: project.businessName || 'Je Website',
            customerEmail: project.contactEmail,
            customerName: project.contactName || 'Klant',
            newPhase: 'development'
          })
        })
        console.log(`[Internal API] Phase email sent for project ${projectId}`)
      } catch (emailError) {
        console.error('[Internal API] Failed to send phase email:', emailError)
      }
    }
    
    // Sla project op
    await kv.set(`project:${projectId}`, updatedProject)
    
    console.log(`[Internal API] ✅ Project ${projectId} updated:`, {
      paymentStatus,
      paymentCompletedAt,
      phase: updatedProject.phase
    })
    
    return res.status(200).json({ 
      success: true,
      projectId,
      paymentStatus,
      paymentCompletedAt,
      phase: updatedProject.phase
    })
    
  } catch (error) {
    console.error('[Internal API] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
