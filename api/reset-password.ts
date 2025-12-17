import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail, isSmtpConfigured } from './lib/smtp.js'

/**
 * API endpoint to request password reset
 * POST /api/reset-password
 * Body: { projectId: string, email: string }
 */

// Check if Redis is configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  customer: {
    email: string
    name?: string
    companyName?: string
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  if (!kv) {
    console.error('Upstash Redis not configured for reset-password')
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd'
    })
  }

  try {
    const { projectId, email } = req.body

    if (!projectId || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project-ID en e-mailadres zijn verplicht' 
      })
    }

    // Normalize inputs
    const normalizedId = projectId.trim().toUpperCase()
    const normalizedEmail = email.trim().toLowerCase()

    // Get project and verify email matches
    let project = await kv.get<Project>(`project:${normalizedId}`)
    
    if (!project) {
      project = await kv.get<Project>(`project:${projectId.trim()}`)
    }

    // Always return success to prevent email enumeration
    if (!project || project.customer.email.toLowerCase() !== normalizedEmail) {
      console.log(`Password reset requested but email mismatch or project not found: ${normalizedId}`)
      return res.status(200).json({ 
        success: true,
        message: 'Als dit e-mailadres gekoppeld is aan dit project, ontvang je een e-mail.'
      })
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex')
    const expiry = Date.now() + 3600000 // 1 hour

    // Store token in Redis with expiry
    await kv.set(`reset:${token}`, {
      projectId: project.id,
      email: normalizedEmail,
      expiry
    }, { ex: 3600 }) // Expire after 1 hour

    // Send reset email
    if (isSmtpConfigured()) {
      const resetUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://webstability.nl'}/reset-wachtwoord?token=${token}`
      
      await sendPasswordResetEmail({
        email: project.customer.email,
        name: project.customer.companyName || project.customer.name || 'daar',
        resetUrl: resetUrl,
      })
      
      console.log(`Password reset email sent for project: ${project.id}`)
    } else {
      console.warn('SMTP not configured, cannot send password reset email')
    }

    return res.status(200).json({ 
      success: true,
      message: 'Als dit e-mailadres gekoppeld is aan dit project, ontvang je een e-mail.'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
    })
  }
}
