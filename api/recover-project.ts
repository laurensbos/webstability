import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import nodemailer from 'nodemailer'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// SMTP config
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM || 'Webstability <info@webstability.nl>'
const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'

// Simple email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { email } = req.body || {}
    const normalizedEmail = (email || '').toLowerCase().trim()

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, error: 'invalid_email' })
    }

    // Find projects matching this email in Redis
    const matchingProjects: Array<{ id: string; businessName?: string }> = []
    
    if (kv) {
      // Scan for projects with matching email
      const keys = await kv.keys('project:*')
      
      for (const key of keys.slice(0, 100)) { // Limit scan
        try {
          const project = await kv.get(key) as any
          if (project && (
            (project.customer?.email || '').toLowerCase() === normalizedEmail ||
            (project.email || '').toLowerCase() === normalizedEmail
          )) {
            matchingProjects.push({
              id: project.id,
              businessName: project.customer?.companyName || project.businessName
            })
          }
        } catch {
          // Skip invalid projects
        }
      }
    }

    console.log(`[Recovery] Email: ${normalizedEmail}, Found: ${matchingProjects.length} project(s)`)
    
    // Send email with project IDs if found
    if (matchingProjects.length > 0 && SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS }
        })
        
        const projectList = matchingProjects.map(p => 
          `• <strong>${p.id}</strong>${p.businessName ? ` (${p.businessName})` : ''}`
        ).join('<br>')
        
        await transporter.sendMail({
          from: SMTP_FROM,
          to: normalizedEmail,
          subject: 'Je Webstability project-ID(s)',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #111827;">Je project-ID(s)</h2>
              <p style="color: #6b7280;">Hier zijn de project-ID(s) gekoppeld aan dit e-mailadres:</p>
              <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                ${projectList}
              </div>
              <p style="color: #6b7280; margin-top: 24px;">
                Ga naar <a href="${BASE_URL}/project-login" style="color: #3b82f6;">webstability.nl/project-login</a> 
                om in te loggen met je project-ID.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #9ca3af; font-size: 12px;">
                Dit is een automatisch gegenereerde e-mail van Webstability.
              </p>
            </div>
          `
        })
        
        console.log(`[Recovery] Email sent to ${normalizedEmail} with ${matchingProjects.length} project(s)`)
      } catch (emailError) {
        console.error('[Recovery] Failed to send email:', emailError)
      }
    }

    // Always return success (don't reveal if email exists for security)
    return res.status(200).json({ 
      success: true, 
      message: 'Als dit e-mailadres bij ons bekend is, ontvang je binnen enkele minuten een e-mail met je project-ID(s).'
    })

  } catch (error) {
    console.error('Recovery error:', error)
    return res.status(500).json({ success: false, error: 'server_error' })
  }
}
