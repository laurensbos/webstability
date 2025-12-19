/**
 * Trustpilot Review Request API
 * 
 * POST /api/review-request
 * Sends a review request email to customer when project goes live
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProject, setProject } from './lib/database.js'
import { sendEmail } from './lib/smtp.js'

const TRUSTPILOT_COMPANY_URL = 'https://nl.trustpilot.com/review/webstability.nl'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
  
  try {
    const { projectId, customerEmail, customerName, websiteUrl, delay = false } = req.body
    
    if (!projectId || !customerEmail || !customerName) {
      return res.status(400).json({
        success: false,
        error: 'Verplichte velden ontbreken'
      })
    }

    // Check if review already requested
    const project = await getProject(projectId)
    if (project) {
      const data = project.onboardingData as Record<string, unknown> | undefined
      if (data?.reviewRequested) {
        return res.status(400).json({
          success: false,
          error: 'Review is al aangevraagd voor dit project'
        })
      }
    }

    // If delay is true, schedule for later (just mark as pending)
    if (delay) {
      if (project) {
        await setProject({
          ...project,
          onboardingData: {
            ...(project.onboardingData as Record<string, unknown>),
            reviewPending: true,
            reviewScheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          }
        })
      }
      
      console.log(`[ReviewRequest] Gepland voor project ${projectId} over 7 dagen`)
      
      return res.status(200).json({
        success: true,
        message: 'Review verzoek gepland voor over 7 dagen'
      })
    }

    // Send review request email now
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Je website is live!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Bedankt dat je voor Webstability hebt gekozen</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #374151;">Beste ${customerName},</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Wat geweldig dat je website nu live is! 🚀 We hopen dat je tevreden bent met het eindresultaat.
          </p>
          
          ${websiteUrl ? `
          <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Je website:</p>
            <a href="${websiteUrl}" style="color: #6366f1; font-size: 18px; font-weight: 600; text-decoration: none;">${websiteUrl}</a>
          </div>
          ` : ''}
          
          <div style="background: linear-gradient(135deg, #00b67a 0%, #00d68f 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
            <img src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-white.svg" alt="Trustpilot" style="height: 30px; margin-bottom: 15px;">
            <p style="color: white; margin: 0 0 15px 0; font-size: 16px;">
              Zou je een review willen achterlaten?
            </p>
            <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0; font-size: 14px;">
              Het kost maar 2 minuten en helpt andere ondernemers enorm!
            </p>
            <a href="${TRUSTPILOT_COMPANY_URL}" 
               style="display: inline-block; background: white; color: #00b67a; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              ⭐ Schrijf een review
            </a>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Je review betekent heel veel voor ons en helpt andere ondernemers om de juiste keuze te maken.
          </p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Heb je vragen of feedback? Neem gerust contact met ons op!
          </p>
          
          <p style="font-size: 16px; color: #374151; margin-top: 30px;">
            Met vriendelijke groet,<br>
            <strong>Het Webstability Team</strong>
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Webstability • info@webstability.nl
          </p>
        </div>
      </div>
    `

    await sendEmail({
      to: customerEmail,
      subject: '⭐ Vertel ons wat je van je nieuwe website vindt!',
      html: emailHtml
    })

    // Update project to mark review as requested
    if (project) {
      await setProject({
        ...project,
        onboardingData: {
          ...(project.onboardingData as Record<string, unknown>),
          reviewRequested: true,
          reviewRequestedAt: new Date().toISOString(),
          trustpilotReviewUrl: TRUSTPILOT_COMPANY_URL
        }
      })
    }

    console.log(`[ReviewRequest] Email verstuurd naar ${customerEmail} voor project ${projectId}`)

    return res.status(200).json({
      success: true,
      message: 'Review verzoek verstuurd'
    })

  } catch (error) {
    console.error('[ReviewRequest] Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Er ging iets mis bij het versturen van het review verzoek'
    })
  }
}
