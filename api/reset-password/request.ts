/**
 * Password Reset Request API
 * POST /api/reset-password/request
 * Sends a password reset email with a secure token
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash, randomBytes } from 'crypto'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://webstability.nl'

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  customer?: {
    email: string
    name?: string
  }
  contactEmail?: string
  businessName?: string
}

async function sendResetEmail(email: string, resetUrl: string, projectId: string, businessName: string) {
  if (!RESEND_API_KEY) {
    console.log('Resend not configured, would send reset email to:', email)
    return true
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Webstability <noreply@webstability.nl>',
        to: email,
        subject: `Wachtwoord resetten voor project ${projectId}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
            <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #1f2937; font-size: 24px; margin: 0 0 8px 0;">Wachtwoord resetten</h1>
                <p style="color: #6b7280; font-size: 14px; margin: 0;">Project: ${projectId}</p>
              </div>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Hallo${businessName ? ` ${businessName}` : ''},
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                We hebben een verzoek ontvangen om het wachtwoord voor je project te resetten. 
                Klik op de onderstaande knop om een nieuw wachtwoord in te stellen.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #3b82f6, #6366f1); color: white; font-weight: 600; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">
                  Nieuw wachtwoord instellen
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Deze link is 1 uur geldig. Heb je geen wachtwoord reset aangevraagd? 
                Dan kun je deze email negeren.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
              </p>
            </div>
          </body>
          </html>
        `,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Error sending reset email:', error)
    return false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  if (!kv) {
    return res.status(503).json({ success: false, message: 'Database niet geconfigureerd' })
  }

  try {
    const { email, projectId } = req.body

    if (!email && !projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email of Project ID is verplicht' 
      })
    }

    let project: Project | null = null
    let foundProjectId = projectId

    if (projectId) {
      // Find project by ID
      const normalizedId = projectId.trim().toUpperCase()
      project = await kv.get<Project>(`project:${normalizedId}`)
      foundProjectId = normalizedId
    } else if (email) {
      // Find project by email - scan all projects
      const keys = await kv.keys('project:*')
      for (const key of keys) {
        if (key.includes(':password') || key.includes(':reset')) continue
        const p = await kv.get<Project>(key)
        if (p && (p.customer?.email === email || p.contactEmail === email)) {
          project = p
          foundProjectId = p.id || key.replace('project:', '')
          break
        }
      }
    }

    if (!project) {
      // Don't reveal whether project exists
      return res.status(200).json({ 
        success: true, 
        message: 'Als dit project bestaat, ontvang je een email met instructies.' 
      })
    }

    const targetEmail = project.customer?.email || project.contactEmail
    if (!targetEmail) {
      return res.status(200).json({ 
        success: true, 
        message: 'Als dit project bestaat, ontvang je een email met instructies.' 
      })
    }

    // Generate secure reset token
    const token = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(token).digest('hex')
    
    // Store token with 1 hour expiry
    await kv.set(`project:${foundProjectId}:reset`, tokenHash, { ex: 3600 })

    // Build reset URL
    const resetUrl = `${BASE_URL}/wachtwoord-resetten?token=${token}&project=${foundProjectId}`

    // Send email
    await sendResetEmail(
      targetEmail, 
      resetUrl, 
      foundProjectId, 
      project.businessName || project.customer?.name || ''
    )

    return res.status(200).json({ 
      success: true, 
      message: 'Als dit project bestaat, ontvang je een email met instructies.' 
    })

  } catch (error) {
    console.error('Reset password request error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er ging iets mis. Probeer het later opnieuw.' 
    })
  }
}
