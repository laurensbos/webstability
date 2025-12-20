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

// Developer notification email
const DEV_NOTIFICATION_EMAIL = process.env.DEV_NOTIFICATION_EMAIL || 'info@webstability.nl'

// Always use production URL - VERCEL_URL contains deployment-specific URLs that shouldn't be in emails
const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'

interface ChangeRequest {
  id: string
  date: string
  request: string
  priority: 'low' | 'normal' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed'
  response?: string
}

interface Project {
  id: string
  projectId?: string
  businessName?: string
  contactName?: string
  contactEmail?: string
  changeRequests?: ChangeRequest[]
  revisionsUsed?: number
  revisionsTotal?: number
  updatedAt?: string
  [key: string]: unknown
}

const PRIORITY_LABELS: Record<string, { label: string; emoji: string }> = {
  low: { label: 'Laag', emoji: '🟢' },
  normal: { label: 'Normaal', emoji: '🟡' },
  urgent: { label: 'Urgent', emoji: '🔴' }
}

// Send notification email to developer
async function notifyDeveloper(
  project: Project,
  changeRequest: ChangeRequest
): Promise<boolean> {
  const priorityInfo = PRIORITY_LABELS[changeRequest.priority] || PRIORITY_LABELS.normal
  
  const subject = `${priorityInfo.emoji} Nieuwe aanvraag: ${project.businessName || project.id}`
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
        <h1 style="color:#ffffff;margin:0;font-size:24px;">📝 Nieuwe Aanpassing Aanvraag</h1>
      </div>
      
      <div style="background:#1f1f1f;border-radius:12px;padding:20px;margin-bottom:20px;">
        <p style="color:#888;font-size:14px;margin:0 0 5px;">Project</p>
        <p style="color:#ffffff;font-size:18px;font-weight:600;margin:0;">${project.businessName || 'Onbekend'}</p>
      </div>
      
      <div style="display:flex;gap:15px;margin-bottom:20px;">
        <div style="background:#1f1f1f;border-radius:12px;padding:15px;flex:1;">
          <p style="color:#888;font-size:12px;margin:0 0 5px;">Prioriteit</p>
          <p style="color:${changeRequest.priority === 'urgent' ? '#ef4444' : changeRequest.priority === 'normal' ? '#3b82f6' : '#888'};font-size:16px;font-weight:600;margin:0;">
            ${priorityInfo.emoji} ${priorityInfo.label}
          </p>
        </div>
        <div style="background:#1f1f1f;border-radius:12px;padding:15px;flex:1;">
          <p style="color:#888;font-size:12px;margin:0 0 5px;">Revisies gebruikt</p>
          <p style="color:#ffffff;font-size:16px;font-weight:600;margin:0;">
            ${project.revisionsUsed || 0} / ${project.revisionsTotal || 5}
          </p>
        </div>
      </div>
      
      <div style="background:#1f1f1f;border-radius:12px;padding:20px;margin-bottom:20px;">
        <p style="color:#888;font-size:14px;margin:0 0 10px;">Aanvraag</p>
        <p style="color:#e5e5e5;font-size:16px;line-height:1.6;margin:0;white-space:pre-wrap;">${changeRequest.request}</p>
      </div>
      
      <div style="text-align:center;margin:30px 0;">
        <a href="${BASE_URL}/developer" style="display:inline-block;background:linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%);color:#ffffff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;">
          Open Developer Dashboard
        </a>
      </div>
      
      <hr style="border:none;border-top:1px solid #333;margin:30px 0;">
      
      <p style="color:#666;font-size:12px;text-align:center;margin:0;">
        Project ID: ${project.id || project.projectId}
      </p>
    </div>
  </div>
</body>
</html>
  `

  try {
    // Send via SMTP
    const transporter = createTransporter()
    if (transporter) {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: DEV_NOTIFICATION_EMAIL,
        subject,
        html: htmlContent,
        replyTo: 'info@webstability.nl'
      })
      return true
    }
    
    console.log('No email provider configured, skipping notification')
    return false
  } catch (error) {
    console.error('Notification email error:', error)
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

  const { request, priority = 'normal' } = req.body

  if (!request || !request.trim()) {
    return res.status(400).json({ success: false, message: 'Aanvraag tekst is verplicht' })
  }

  try {
    if (!kv) {
      console.error('Redis not configured')
      return res.status(500).json({ success: false, message: 'Database not available' })
    }

    // Get existing project
    const projectKey = `project:${projectId}`
    const project = await kv.get<Project>(projectKey)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    // Check revision limits
    const revisionsUsed = project.revisionsUsed || 0
    const revisionsTotal = project.revisionsTotal || 5

    if (revisionsUsed >= revisionsTotal) {
      return res.status(400).json({ 
        success: false, 
        message: 'Je hebt al je revisies gebruikt. Neem contact op voor extra revisies.',
        revisionsUsed,
        revisionsTotal
      })
    }

    // Create new change request
    const newChangeRequest: ChangeRequest = {
      id: `cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      request: request.trim(),
      priority: ['low', 'normal', 'urgent'].includes(priority) ? priority : 'normal',
      status: 'pending'
    }

    // Update project
    const updatedProject: Project = {
      ...project,
      changeRequests: [...(project.changeRequests || []), newChangeRequest],
      revisionsUsed: revisionsUsed + 1,
      updatedAt: new Date().toISOString()
    }

    // Save to Redis
    await kv.set(projectKey, updatedProject)

    // Send notification email to developer
    await notifyDeveloper(updatedProject, newChangeRequest)

    console.log(`Change request created for project ${projectId}:`, {
      id: newChangeRequest.id,
      priority: newChangeRequest.priority,
      revisionsUsed: updatedProject.revisionsUsed,
      revisionsTotal: updatedProject.revisionsTotal
    })

    return res.status(200).json({
      success: true,
      message: 'Aanvraag succesvol verstuurd',
      changeRequest: newChangeRequest,
      revisionsUsed: updatedProject.revisionsUsed,
      revisionsTotal: updatedProject.revisionsTotal
    })
  } catch (error) {
    console.error('Change request error:', error)
    return res.status(500).json({ success: false, message: 'Er ging iets mis bij het opslaan' })
  }
}
