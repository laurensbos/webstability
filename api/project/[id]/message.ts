import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { Resend } from 'resend'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// Initialize Resend for email notifications
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://webstability.nl'

interface ChatMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
}

interface Project {
  id: string
  businessName?: string
  contactName?: string
  contactEmail?: string
  messages?: ChatMessage[]
  updatedAt?: string
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
    const { message, from } = req.body

    if (!message) {
      return res.status(400).json({ success: false, message: 'Bericht is verplicht' })
    }

    const project = await kv.get<Project>(`project:${projectId}`)
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden' })
    }

    // Create new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString(),
      from: from === 'developer' ? 'developer' : 'client',
      message: message,
      read: from === 'developer', // Client messages are unread, developer messages are read
    }

    // Add to project messages
    const messages = project.messages || []
    messages.push(newMessage)

    const updatedProject = {
      ...project,
      messages,
      updatedAt: new Date().toISOString(),
    }

    await kv.set(`project:${projectId}`, updatedProject)

    console.log(`Message sent for project ${projectId} from ${from}`)

    // Send email notification
    if (resend) {
      try {
        if (from === 'client' && project.contactEmail) {
          // Notify developer about new client message
          await resend.emails.send({
            from: 'Webstability <noreply@webstability.nl>',
            to: 'developer@webstability.nl',
            subject: `💬 Nieuw bericht: ${project.businessName || 'Project'}`,
            html: `
              <!DOCTYPE html>
              <html>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #334155; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">💬 Nieuw Bericht</h1>
                  </div>
                  <div style="padding: 24px;">
                    <p><strong>Project:</strong> ${project.businessName || projectId}</p>
                    <p><strong>Van:</strong> ${project.contactName || project.contactEmail || 'Klant'}</p>
                    <div style="background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin: 16px 0;">
                      <p style="margin: 0; color: #334155; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="text-align: center; margin: 24px 0 0 0;">
                      <a href="${BASE_URL}/developer" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600;">
                        Beantwoorden →
                      </a>
                    </p>
                  </div>
                  <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">Dit bericht is verstuurd door Webstability</p>
                  </div>
                </div>
              </body>
              </html>
            `
          })
          console.log(`[Message] Developer notification sent`)
        } else if (from === 'developer' && project.contactEmail) {
          // Notify client about developer response
          await resend.emails.send({
            from: 'Webstability <noreply@webstability.nl>',
            to: project.contactEmail,
            subject: `💬 Nieuw bericht over ${project.businessName || 'je project'}`,
            html: `
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
                  <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">Dit bericht is verstuurd door Webstability</p>
                  </div>
                </div>
              </body>
              </html>
            `
          })
          console.log(`[Message] Client notification sent to ${project.contactEmail}`)
        }
      } catch (emailError) {
        console.error('[Message] Email notification error:', emailError)
        // Continue even if email fails
      }
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
