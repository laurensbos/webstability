import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// Initialize Resend for email notifications
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

// SMTP Configuration (fallback if Resend not available)
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
  projectId?: string
  businessName?: string
  contactName?: string
  contactEmail?: string
  password?: string
  updatedAt?: string
  [key: string]: unknown
}

// Generate secure reset token
function generateResetToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// Send email using Resend or SMTP
async function sendResetEmail(
  to: string, 
  projectId: string, 
  token: string, 
  businessName: string
): Promise<boolean> {
  const resetUrl = `${BASE_URL}/wachtwoord-reset?token=${token}&project=${projectId}`
  
  const subject = 'Wachtwoord resetten - Webstability'
  const htmlContent = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);border-radius:16px;padding:40px;border:1px solid #333;">
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;">🔐 Wachtwoord resetten</h1>
      </div>
      
      <p style="color:#e5e5e5;font-size:16px;line-height:1.6;margin:0 0 20px;">
        Hallo,
      </p>
      
      <p style="color:#e5e5e5;font-size:16px;line-height:1.6;margin:0 0 20px;">
        Je hebt een wachtwoord reset aangevraagd voor het project <strong style="color:#8b5cf6;">${businessName}</strong>.
      </p>
      
      <p style="color:#e5e5e5;font-size:16px;line-height:1.6;margin:0 0 30px;">
        Klik op de onderstaande knop om een nieuw wachtwoord in te stellen. Deze link is 1 uur geldig.
      </p>
      
      <div style="text-align:center;margin:30px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%);color:#ffffff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;">
          Nieuw wachtwoord instellen
        </a>
      </div>
      
      <p style="color:#888;font-size:14px;line-height:1.6;margin:20px 0 0;">
        Als je geen wachtwoord reset hebt aangevraagd, kun je deze e-mail negeren.
      </p>
      
      <hr style="border:none;border-top:1px solid #333;margin:30px 0;">
      
      <p style="color:#666;font-size:12px;text-align:center;margin:0;">
        © ${new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
      </p>
    </div>
  </div>
</body>
</html>
  `

  try {
    // Try Resend first
    if (resend) {
      await resend.emails.send({
        from: 'Webstability <noreply@webstability.nl>',
        to: [to],
        subject,
        html: htmlContent,
      })
      return true
    }
    
    // Fallback to SMTP
    const transporter = createTransporter()
    if (transporter) {
      await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        html: htmlContent,
      })
      return true
    }
    
    console.error('No email provider configured')
    return false
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { id } = req.query
  const projectId = Array.isArray(id) ? id[0] : id

  if (!projectId) {
    return res.status(400).json({ success: false, message: 'Project ID is required' })
  }

  try {
    if (!kv) {
      console.error('Redis not configured')
      return res.status(500).json({ success: false, message: 'Database not available' })
    }

    // Get project to find email
    const projectKey = `project:${projectId}`
    const project = await kv.get<Project>(projectKey)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    if (!project.contactEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Geen e-mailadres gekoppeld aan dit project' 
      })
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const tokenExpiry = Date.now() + (60 * 60 * 1000) // 1 hour

    // Store reset token in Redis
    const resetKey = `password-reset:${resetToken}`
    await kv.set(resetKey, {
      projectId,
      token: resetToken,
      expiresAt: tokenExpiry,
      createdAt: new Date().toISOString()
    }, { ex: 3600 }) // Expire in 1 hour

    // Send reset email
    const emailSent = await sendResetEmail(
      project.contactEmail,
      projectId,
      resetToken,
      project.businessName || projectId
    )

    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Kon geen e-mail versturen. Probeer het later opnieuw.' 
      })
    }

    // Mask email for response
    const emailParts = project.contactEmail.split('@')
    const maskedEmail = emailParts[0].substring(0, 2) + '***@' + emailParts[1]

    console.log(`Password reset email sent for project ${projectId} to ${maskedEmail}`)

    return res.status(200).json({
      success: true,
      message: 'Reset e-mail verstuurd',
      maskedEmail
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return res.status(500).json({ success: false, message: 'Er ging iets mis' })
  }
}
