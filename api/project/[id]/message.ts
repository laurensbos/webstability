import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import nodemailer from 'nodemailer'
import { logEmailSent } from '../../developer/email-log.js'

// Initialize Redis
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

// Developer notification email - where to send client messages
const DEV_NOTIFICATION_EMAIL = process.env.DEV_NOTIFICATION_EMAIL || 'info@webstability.nl'

// Always use production URL - VERCEL_URL contains deployment-specific URLs that shouldn't be in emails
const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'

interface ChatMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
  senderName?: string
}

interface Project {
  id: string
  businessName?: string
  contactName?: string
  contactEmail?: string
  messages?: ChatMessage[]
  updatedAt?: string
  developerNotifiedOfFirstMessage?: boolean
  lastClientMessageAt?: string
  [key: string]: unknown
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

  // Get project ID from URL path: /api/project/[id]/message
  const url = req.url || ''
  const pathMatch = url.match(/\/api\/project\/([^/]+)\/message/)
  const projectId = pathMatch?.[1]

  if (!projectId) {
    return res.status(400).json({ success: false, message: 'Project ID verplicht' })
  }

  if (!kv) {
    return res.status(503).json({ success: false, message: 'Database niet geconfigureerd' })
  }

  try {
    const { message, from, senderName } = req.body

    if (!message) {
      return res.status(400).json({ success: false, message: 'Bericht is verplicht' })
    }

    const project = await kv.get<Project>(`project:${projectId}`)
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden' })
    }

    // Create new message with sender name
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString(),
      from: from === 'developer' ? 'developer' : 'client',
      message: message,
      read: false, // Always start as unread - the recipient marks it as read
      senderName: from === 'developer' ? 'Laurens' : (senderName || project.contactName || 'Klant'),
    }

    // Add to project messages
    const messages = project.messages || []
    messages.push(newMessage)

    // Check if we should notify developer about this client message
    // Notify if: first message OR client was inactive for 10+ minutes
    const TEN_MINUTES = 10 * 60 * 1000
    const now = Date.now()
    const lastClientMessageTime = project.lastClientMessageAt ? new Date(project.lastClientMessageAt).getTime() : 0
    const timeSinceLastClientMessage = now - lastClientMessageTime
    
    const isFirstClientMessage = from === 'client' && !project.developerNotifiedOfFirstMessage
    const clientReturnedAfterInactivity = from === 'client' && timeSinceLastClientMessage > TEN_MINUTES && lastClientMessageTime > 0

    // Update last client message timestamp
    const updatedProject = {
      ...project,
      messages,
      updatedAt: new Date().toISOString(),
      // Update last client message time if from client
      ...(from === 'client' && { lastClientMessageAt: new Date().toISOString() }),
      // Mark as notified if this is first client message
      ...(isFirstClientMessage && { developerNotifiedOfFirstMessage: true }),
    }

    await kv.set(`project:${projectId}`, updatedProject)

    const shouldNotifyDeveloper = isFirstClientMessage || clientReturnedAfterInactivity
    console.log(`Message sent for project ${projectId} from ${from}${isFirstClientMessage ? ' (first client message)' : ''}${clientReturnedAfterInactivity ? ' (client returned after inactivity)' : ''}`)

    // Helper function to send email via SMTP
    const sendEmail = async (to: string, subject: string, html: string) => {
      const transporter = createTransporter()
      if (transporter) {
        try {
          await transporter.sendMail({
            from: SMTP_FROM,
            to,
            subject,
            html,
            replyTo: 'info@webstability.nl'
          })
          console.log(`[Message] Email sent via SMTP to ${to}`)
          return true
        } catch (err) {
          console.error('[Message] SMTP failed:', err)
        }
      }
      
      console.warn('[Message] No email service available')
      return false
    }

    // Send email notification
    try {
      if (from === 'client' && shouldNotifyDeveloper) {
        // Notify developer about client message (first message or after 10min inactivity)
        const notificationReason = isFirstClientMessage ? 'Eerste bericht' : 'Klant is terug na inactiviteit'
        const html = `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #334155; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">💬 Nieuw Bericht van Klant</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">${notificationReason}</p>
              </div>
              <div style="padding: 24px;">
                <p><strong>Project:</strong> ${project.businessName || projectId}</p>
                <p><strong>Van:</strong> ${newMessage.senderName || project.contactName || project.contactEmail || 'Klant'}</p>
                <div style="background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0; color: #334155; white-space: pre-wrap;">${message}</p>
                </div>
                <p style="text-align: center; margin: 24px 0 0 0;">
                  <a href="${BASE_URL}/developer" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600;">
                    Beantwoorden →
                  </a>
                </p>
              </div>
              <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                  Met vriendelijke groet,<br><strong style="color: #334155;">Team Webstability</strong>
                </p>
                <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">
                  <a href="https://webstability.nl" style="color: #10b981; text-decoration: none;">webstability.nl</a>
                  &nbsp;•&nbsp;
                  <a href="mailto:info@webstability.nl" style="color: #10b981; text-decoration: none;">info@webstability.nl</a>
                  &nbsp;•&nbsp;
                  <a href="tel:+31644712573" style="color: #10b981; text-decoration: none;">06-44712573</a>
                </p>
                <p style="margin: 0; color: #cbd5e1; font-size: 11px;">KvK: 94081468 • BTW: NL004892818B28</p>
              </div>
            </div>
          </body>
          </html>
        `
        await sendEmail(DEV_NOTIFICATION_EMAIL, `💬 ${notificationReason}: ${project.businessName || 'Project'}`, html)
      } else if (from === 'developer' && project.contactEmail) {
        // Notify client about developer response
        const html = `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #334155; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">💬 Nieuw Bericht</h1>
              </div>
              <div style="padding: 24px;">
                <p style="margin: 0 0 16px 0;">Hoi${project.contactName ? ` ${project.contactName}` : ''},</p>
                <p style="margin: 0 0 16px 0;">Je hebt een nieuw bericht ontvangen over <strong>${project.businessName || 'je project'}</strong>:</p>
                <div style="background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0; color: #334155; white-space: pre-wrap;">${message}</p>
                </div>
                <p style="text-align: center; margin: 24px 0 0 0;">
                  <a href="${BASE_URL}/status/${projectId}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600;">
                    Bekijk & Beantwoord →
                  </a>
                </p>
              </div>
              <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                  Met vriendelijke groet,<br><strong style="color: #334155;">Team Webstability</strong>
                </p>
                <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">
                  <a href="https://webstability.nl" style="color: #10b981; text-decoration: none;">webstability.nl</a>
                  &nbsp;•&nbsp;
                  <a href="mailto:info@webstability.nl" style="color: #10b981; text-decoration: none;">info@webstability.nl</a>
                  &nbsp;•&nbsp;
                  <a href="tel:+31644712573" style="color: #10b981; text-decoration: none;">06-44712573</a>
                </p>
                <p style="margin: 0; color: #cbd5e1; font-size: 11px;">KvK: 94081468 • BTW: NL004892818B28</p>
              </div>
            </div>
          </body>
          </html>
        `
        await sendEmail(project.contactEmail, `💬 Nieuw bericht over ${project.businessName || 'je project'}`, html)
        
        // Log email for developer dashboard
        await logEmailSent({
          projectId: projectId as string,
          projectName: project.businessName || 'Project',
          recipientEmail: project.contactEmail,
          recipientName: project.contactName || '',
          type: 'message',
          subject: `Nieuw bericht over ${project.businessName || 'je project'}`,
          details: message.length > 50 ? message.substring(0, 50) + '...' : message,
          success: true
        })
      }
    } catch (emailError) {
      console.error('[Message] Email notification error:', emailError)
      // Continue even if email fails
    }

    return res.status(201).json({
      success: true,
      message: newMessage
    })

  } catch (error) {
    console.error('Project message API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij versturen bericht',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
