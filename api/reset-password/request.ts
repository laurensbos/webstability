/**
 * Password Reset Request API
 * POST /api/reset-password/request
 * Sends a password reset email with a secure token
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash, randomBytes } from 'crypto'
import nodemailer from 'nodemailer'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://webstability.nl'

// SMTP Configuration
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'info@webstability.nl',
    pass: process.env.SMTP_PASS
  }
}

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
  if (!smtpConfig.auth.pass) {
    console.log('SMTP not configured, would send reset email to:', email)
    return true
  }

  try {
    const transporter = nodemailer.createTransport(smtpConfig)
    
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: email,
      subject: `🔐 Wachtwoord resetten - ${projectId}`,
      html: `
        <!DOCTYPE html>
        <html lang="nl">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="dark light">
          <title>Wachtwoord resetten</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <!-- Container -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0f172a;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <!-- Main Card -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
                  <!-- Header with Logo -->
                  <tr>
                    <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #334155;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 12px 24px; border-radius: 12px; margin-bottom: 16px;">
                        <span style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">webstability</span>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Icon -->
                  <tr>
                    <td style="padding: 32px 32px 0; text-align: center;">
                      <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 32px; line-height: 64px;">🔐</span>
                      </div>
                      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #ffffff;">Wachtwoord resetten</h1>
                      <p style="margin: 0; color: #94a3b8; font-size: 14px;">Project: <span style="color: #10b981; font-family: monospace;">${projectId}</span></p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 24px 32px;">
                      <p style="color: #f1f5f9; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                        Hallo${businessName ? ` <strong>${businessName}</strong>` : ''},
                      </p>
                      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        We hebben een verzoek ontvangen om het wachtwoord voor je project te resetten. Klik op onderstaande knop om een nieuw wachtwoord in te stellen.
                      </p>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                          Nieuw wachtwoord instellen
                        </a>
                      </div>
                      
                      <!-- Timer note -->
                      <div style="background-color: #0f172a; border-radius: 12px; padding: 16px; text-align: center; margin-top: 24px;">
                        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                          ⏱️ Deze link is <strong style="color: #f59e0b;">1 uur</strong> geldig
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Security notice -->
                  <tr>
                    <td style="padding: 0 32px 24px;">
                      <div style="background-color: #1e3a5f; border-radius: 12px; padding: 16px; border-left: 4px solid #3b82f6;">
                        <p style="color: #93c5fd; font-size: 14px; margin: 0; line-height: 1.5;">
                          💡 Heb je geen wachtwoord reset aangevraagd? Dan kun je deze email veilig negeren.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; background-color: #0f172a; border-top: 1px solid #334155; text-align: center;">
                      <p style="color: #64748b; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Webstability — Professionele websites voor ondernemers
                      </p>
                      <p style="color: #475569; font-size: 11px; margin: 8px 0 0;">
                        Deze e-mail is verzonden naar ${email}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    console.log('✅ Password reset email sent to:', email)
    return true
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
