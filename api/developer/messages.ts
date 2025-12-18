import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import nodemailer from 'nodemailer'

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

// Send notification email to client when developer sends a message
const sendMessageNotification = async (
  clientEmail: string, 
  clientName: string, 
  businessName: string,
  projectId: string,
  message: string
) => {
  const transporter = createTransporter()
  if (!transporter) {
    console.warn('SMTP not configured. Email notification not sent.')
    return
  }

  // Truncate message for preview
  const messagePreview = message.length > 200 ? message.substring(0, 200) + '...' : message
  const projectUrl = `https://webstability.nl/project/${projectId}`

  const html = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuw bericht van Webstability</title>
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
                Nieuw bericht 💬
              </h1>
              <p style="margin: 0 0 24px; font-size: 16px; color: #475569; line-height: 1.6;">
                Hoi ${clientName},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #475569; line-height: 1.6;">
                Er is een nieuw bericht voor je over jouw project <strong>${businessName}</strong>:
              </p>
              
              <!-- Message Box -->
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
                <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${messagePreview}</p>
              </div>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px;">
                    <a href="${projectUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);">
                      Bekijk bericht & reageer
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                Je kunt direct reageren via je project dashboard.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #94a3b8;">
                Dit bericht is verstuurd door Webstability
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

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: clientEmail,
      subject: `💬 Nieuw bericht over ${businessName}`,
      html,
      replyTo: 'info@webstability.nl'
    })
    console.log('Message notification sent to:', clientEmail)
  } catch (err) {
    console.error('Failed to send message notification:', err)
  }
}

interface ChatMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
}

interface Project {
  id: string
  status: string
  type: string
  packageType: string
  customer?: {
    name?: string
    email?: string
    phone?: string
    companyName?: string
  }
  contactEmail?: string
  contactName?: string
  businessName?: string
  paymentStatus: string
  messages?: ChatMessage[]
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify authorization
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ success: false, message: 'Niet ingelogd.' })
  }

  if (!kv) {
    return res.status(503).json({ success: false, message: 'Database niet geconfigureerd' })
  }

  try {
    const { projectId } = req.query

    if (req.method === 'GET') {
      // Get messages for a specific project
      if (!projectId) {
        return res.status(400).json({ success: false, message: 'Project ID verplicht' })
      }

      const project = await kv.get<Project>(`project:${projectId}`)
      
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project niet gevonden' })
      }

      return res.status(200).json({ 
        success: true, 
        messages: project.messages || [] 
      })
    }

    if (req.method === 'POST') {
      // Send a new message
      const { projectId: bodyProjectId, message } = req.body
      const targetProjectId = projectId || bodyProjectId

      if (!targetProjectId || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Project ID en bericht zijn verplicht' 
        })
      }

      const project = await kv.get<Project>(`project:${targetProjectId}`)
      
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project niet gevonden' })
      }

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        date: new Date().toISOString(),
        from: 'developer',
        message: message,
        read: true, // Developer messages are automatically read
      }

      const messages = project.messages || []
      messages.push(newMessage)

      const updatedProject = {
        ...project,
        messages,
        updatedAt: new Date().toISOString(),
      }

      await kv.set(`project:${targetProjectId}`, updatedProject)

      // Send email notification to client (non-blocking)
      const clientEmail = project.customer?.email || project.contactEmail
      const clientName = project.customer?.name || project.contactName || 'Klant'
      const businessName = project.customer?.companyName || project.businessName || 'je website'
      
      if (clientEmail) {
        sendMessageNotification(
          clientEmail,
          clientName,
          businessName,
          String(targetProjectId),
          message
        ).catch(err => console.error('Email notification error:', err))
      }

      return res.status(201).json({ 
        success: true, 
        message: newMessage,
        project: updatedProject
      })
    }

    if (req.method === 'PUT') {
      // Mark messages as read
      const { projectId: bodyProjectId, messageIds } = req.body
      const targetProjectId = projectId || bodyProjectId

      if (!targetProjectId) {
        return res.status(400).json({ success: false, message: 'Project ID verplicht' })
      }

      const project = await kv.get<Project>(`project:${targetProjectId}`)
      
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project niet gevonden' })
      }

      const messages = project.messages || []
      
      // Mark specified messages as read, or all if no messageIds provided
      const updatedMessages = messages.map(msg => {
        if (!messageIds || messageIds.includes(msg.id)) {
          return { ...msg, read: true }
        }
        return msg
      })

      const updatedProject = {
        ...project,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      }

      await kv.set(`project:${targetProjectId}`, updatedProject)

      return res.status(200).json({ 
        success: true, 
        messages: updatedMessages 
      })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })

  } catch (error) {
    console.error('Messages API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij verwerken berichten.',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
