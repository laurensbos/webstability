import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash, randomBytes } from 'crypto'
import nodemailer from 'nodemailer'

/**
 * API endpoint to handle email verification
 * GET /api/verify-email?token=xxx - Verify email with token
 * POST /api/verify-email - Send verification email
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM || 'Webstability <info@webstability.nl>'

const isSmtpConfigured = () => Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)

const createTransporter = () => {
  if (!isSmtpConfigured()) return null
  
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://webstability.nl'

interface Project {
  id: string
  emailVerified?: boolean
  emailVerifiedAt?: string
  customer?: {
    email?: string
    name?: string
    companyName?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

// Generate verification token
function generateToken(): string {
  return randomBytes(32).toString('hex')
}

// Hash token for storage
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!kv) {
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd' 
    })
  }

  try {
    // GET: Verify email with token
    if (req.method === 'GET') {
      const { token, projectId } = req.query

      if (!token || !projectId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token en Project ID zijn verplicht' 
        })
      }

      const normalizedId = (projectId as string).trim().toUpperCase()
      const tokenHash = hashToken(token as string)

      // Get stored token
      const storedHash = await kv.get<string>(`email_verification:${normalizedId}`)

      if (!storedHash || storedHash !== tokenHash) {
        // Redirect to email verified page with error
        return res.redirect(302, `${BASE_URL}/email-verified?projectId=${normalizedId}&verified=false&error=invalid_token`)
      }

      // Token is valid, update project
      const project = await kv.get<Project>(`project:${normalizedId}`)
      
      if (!project) {
        return res.redirect(302, `${BASE_URL}/email-verified?projectId=${normalizedId}&verified=false&error=project_not_found`)
      }

      // Mark email as verified
      const updatedProject = {
        ...project,
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await kv.set(`project:${normalizedId}`, updatedProject)
      
      // Delete the verification token
      await kv.del(`email_verification:${normalizedId}`)

      console.log(`Email verified for project ${normalizedId}`)

      // Redirect to email verified page with success
      return res.redirect(302, `${BASE_URL}/email-verified?projectId=${normalizedId}&verified=true`)
    }

    // POST: Send verification email
    if (req.method === 'POST') {
      const { projectId } = req.body

      if (!projectId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Project ID is verplicht' 
        })
      }

      const normalizedId = projectId.trim().toUpperCase()
      const project = await kv.get<Project>(`project:${normalizedId}`)

      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: 'Project niet gevonden' 
        })
      }

      if (project.emailVerified) {
        return res.status(200).json({ 
          success: true, 
          message: 'E-mail is al geverifieerd',
          alreadyVerified: true
        })
      }

      const email = project.customer?.email
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Geen e-mailadres gevonden voor dit project' 
        })
      }

      // Generate and store verification token
      const token = generateToken()
      const tokenHash = hashToken(token)

      // Store token with 24 hour expiry
      await kv.set(`email_verification:${normalizedId}`, tokenHash, { ex: 86400 })

      // Create verification URL
      const verificationUrl = `${BASE_URL}/api/verify-email?token=${token}&projectId=${normalizedId}`

      // Send email
      const transporter = createTransporter()
      if (!transporter) {
        console.error('SMTP not configured')
        return res.status(503).json({ 
          success: false, 
          message: 'E-mail service niet beschikbaar' 
        })
      }

      const clientName = project.customer?.name || 'Klant'
      const businessName = project.customer?.companyName || 'je project'

      const html = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bevestig je e-mailadres</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); text-align: center;">
              <span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">webstability</span>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #0f172a;">
                Bevestig je e-mailadres ✉️
              </h1>
              <p style="margin: 0 0 24px; font-size: 16px; color: #475569; line-height: 1.6;">
                Hoi ${clientName},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #475569; line-height: 1.6;">
                Voordat je toegang krijgt tot je project dashboard voor <strong>${businessName}</strong>, moeten we eerst je e-mailadres verifiëren.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);">
                      Bevestig e-mailadres
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 16px; font-size: 14px; color: #64748b; line-height: 1.6;">
                Of kopieer deze link naar je browser:
              </p>
              <p style="margin: 0 0 24px; font-size: 12px; color: #94a3b8; word-break: break-all; background-color: #f1f5f9; padding: 12px; border-radius: 8px;">
                ${verificationUrl}
              </p>
              
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  ⏰ Deze link is 24 uur geldig.
                </p>
              </div>
              
              <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                Heb je deze e-mail niet aangevraagd? Dan kun je deze e-mail negeren.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">
                Met vriendelijke groet,<br>
                <strong style="color: #334155;">Team Webstability</strong>
              </p>
              <p style="margin: 12px 0 0; font-size: 12px; color: #94a3b8;">
                <a href="https://webstability.nl" style="color: #10b981; text-decoration: none;">webstability.nl</a>
                &nbsp;•&nbsp;
                <a href="mailto:info@webstability.nl" style="color: #10b981; text-decoration: none;">info@webstability.nl</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

      await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject: `Bevestig je e-mailadres voor ${businessName}`,
        html,
        replyTo: 'info@webstability.nl'
      })

      console.log(`Verification email sent to ${email} for project ${normalizedId}`)

      return res.status(200).json({
        success: true,
        message: 'Verificatie-e-mail verstuurd',
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })

  } catch (error) {
    console.error('Email verification error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden' 
    })
  }
}
