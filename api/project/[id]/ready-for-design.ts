/**
 * Mark project as ready for design phase
 * POST /api/project/[id]/ready-for-design
 * 
 * Called by client when they have completed onboarding and uploaded all files
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { sendOnboardingCompleteEmail, sendDeveloperNotificationEmail, isSmtpConfigured } from '../../lib/smtp.js'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  status: string
  readyForDesign?: boolean
  readyForDesignAt?: string
  contactEmail?: string
  contactName?: string
  businessName?: string
  customer?: {
    email?: string
    name?: string
    companyName?: string
  }
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const projectId = (Array.isArray(id) ? id[0] : id)?.toUpperCase()

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID required' })
  }

  if (!kv) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  try {
    // Get current project
    const project = await kv.hgetall(`project:${projectId}`) as Project | null

    if (!project) {
      return res.status(404).json({ error: 'Project not found', projectId })
    }

    // Check if project is in onboarding phase (allow if already in design too - idempotent)
    if (project.status !== 'onboarding' && project.status !== 'design') {
      return res.status(400).json({ 
        error: 'Project is not in onboarding or design phase',
        currentStatus: project.status
      })
    }

    // If already in design, just return success
    if (project.status === 'design') {
      return res.status(200).json({ 
        success: true, 
        message: 'Project is already in design phase',
        status: 'design'
      })
    }

    // Mark as ready for design AND change status to design phase
    const updates = {
      status: 'design',
      readyForDesign: true,
      readyForDesignAt: new Date().toISOString()
    }

    await kv.hset(`project:${projectId}`, updates)

    // Log activity
    const activityId = `activity:${projectId}:${Date.now()}`
    await kv.hset(activityId, {
      projectId,
      type: 'phase_change',
      message: 'Project is gestart met de design fase',
      timestamp: new Date().toISOString(),
      from: 'system',
      oldStatus: 'onboarding',
      newStatus: 'design'
    })

    // Add to project's activity list
    await kv.lpush(`project:${projectId}:activity`, activityId)

    // Send onboarding complete email to client
    const customerEmail = project.customer?.email || project.contactEmail
    const customerName = project.customer?.name || project.contactName || 'Klant'
    const businessName = project.customer?.companyName || project.businessName
    
    if (customerEmail && isSmtpConfigured()) {
      try {
        await sendOnboardingCompleteEmail({
          name: customerName,
          email: customerEmail,
          projectId: projectId,
          businessName: businessName
        })
        console.log(`Onboarding complete email sent to ${customerEmail}`)
      } catch (emailError) {
        console.error('Failed to send onboarding complete email:', emailError)
      }

      // Notify developer
      try {
        await sendDeveloperNotificationEmail({
          type: 'new_design_request',
          projectId: projectId,
          businessName: businessName || 'Nieuw project',
          customerName: customerName,
          customerEmail: customerEmail,
          message: `${customerName} heeft de design fase gestart. Het project staat nu op 'Design'. Alle bestanden zijn geüpload naar Google Drive.`
        })
        console.log('Developer notification email sent')
      } catch (emailError) {
        console.error('Failed to send developer notification:', emailError)
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Project moved to design phase',
      status: 'design',
      readyForDesignAt: updates.readyForDesignAt
    })

  } catch (error) {
    console.error('Error marking project ready for design:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ 
      error: 'Failed to update project',
      details: errorMessage,
      projectId 
    })
  }
}
