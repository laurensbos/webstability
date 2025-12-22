/**
 * Uploads Complete Notification API
 * POST /api/uploads-complete
 * 
 * Called when client marks their uploads as complete
 * Updates project and notifies developer
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { sendEmail, isSmtpConfigured, baseTemplate } from './lib/smtp.js'
import { logEmailSent } from './developer/email-log.js'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const SMTP_USER = process.env.SMTP_USER

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  customer: {
    name: string
    email: string
    companyName?: string
  }
  googleDriveUrl?: string
  onboardingData?: Record<string, unknown>
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  try {
    const { projectId, message } = req.body

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is verplicht' })
    }

    // Get project
    const project = await kv.get<Project>(`project:${projectId}`)
    
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' })
    }

    // Update project with uploads complete status AND move to design phase
    const now = new Date().toISOString()
    const previousStatus = (project as Record<string, unknown>).status
    
    // Set uploadsConfirmed on the project level for easy access
    ;(project as Record<string, unknown>).uploadsConfirmed = true
    ;(project as Record<string, unknown>).uploadsConfirmedAt = now
    
    // Automatically move to design phase
    ;(project as Record<string, unknown>).status = 'design'
    ;(project as Record<string, unknown>).phase = 'design'
    ;(project as Record<string, unknown>).movedToDesignAt = now
    
    project.onboardingData = {
      ...project.onboardingData,
      uploadsCompleted: true,
      uploadsCompletedAt: now,
      uploadsMessage: message || ''
    }

    await kv.set(`project:${projectId}`, project)
    
    console.log(`📊 Project ${projectId} moved from ${previousStatus} to design phase`)

    console.log(`📊 Project ${projectId} moved from ${previousStatus} to design phase`)

    // Send notification email to developer
    if (isSmtpConfigured()) {
      const customerName = project.customer.companyName || project.customer.name || 'Klant'
      const driveLink = project.googleDriveUrl || ''
      
      const content = `
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">🎨</span>
          </div>
          <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: #0f172a;">Design Fase Gestart!</h1>
          <p style="margin: 0; color: #64748b; font-size: 16px;">${customerName} heeft de bestanden bevestigd - project gaat naar design</p>
        </div>
        
        <!-- Project Info -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b981; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0;">
                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Project ID</p>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">${projectId}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Klant</p>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">${customerName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Email</p>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 16px;">${project.customer.email}</p>
              </td>
            </tr>
            ${message ? `
            <tr>
              <td style="padding: 8px 0;">
                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Bericht van klant</p>
                <p style="margin: 4px 0 0; color: #0f172a; font-size: 16px; font-style: italic;">"${message}"</p>
              </td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <!-- Action Buttons -->
        <div style="text-align: center;">
          ${driveLink ? `
          <a href="${driveLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 8px;">
            📁 Bekijk bestanden
          </a>
          ` : ''}
          <a href="https://webstability.nl/developer" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 8px;">
            🖥️ Developer Dashboard
          </a>
        </div>
        
        <!-- Next Step Reminder -->
        <div style="background: #fef3c7; border-radius: 10px; padding: 16px; margin-top: 24px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>🎨 Status update:</strong> Het project is automatisch naar de design fase verplaatst. Start met het ontwerp!
          </p>
        </div>
      `

      try {
        await sendEmail({
          to: SMTP_USER || 'info@webstability.nl',
          subject: `🎨 ${customerName} - Design fase gestart (${projectId})`,
          html: baseTemplate(content, '#f59e0b'),
        })

        // Log email
        await logEmailSent({
          projectId,
          projectName: customerName,
          recipientEmail: SMTP_USER || 'info@webstability.nl',
          recipientName: 'Developer',
          type: 'phase_change',
          subject: `Design fase gestart - ${customerName}`,
          details: 'Project automatisch naar design fase na upload bevestiging',
          success: true
        })

        console.log(`Developer notification sent for design phase start: ${projectId}`)
      } catch (emailError) {
        console.error('Failed to send developer notification:', emailError)
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Project verplaatst naar design fase',
      uploadsCompletedAt: now,
      newStatus: 'design',
      movedToDesign: true
    })

  } catch (error) {
    console.error('Uploads complete error:', error)
    return res.status(500).json({ 
      error: 'Er ging iets mis',
      details: error instanceof Error ? error.message : 'Onbekende fout'
    })
  }
}
