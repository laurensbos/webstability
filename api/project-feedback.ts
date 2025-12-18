/**
 * Project Feedback API Endpoint
 * 
 * Verwerkt design goedkeuring of feedback van de klant.
 * Bij goedkeuring wordt automatisch een betaallink gegenereerd en verzonden.
 * 
 * POST /api/project-feedback
 * Body: {
 *   projectId: string,
 *   approved: boolean,
 *   feedback?: string,
 *   type: 'design' | 'review'
 * }
 * 
 * Response: {
 *   success: boolean,
 *   approved?: boolean,
 *   designApprovedAt?: string,
 *   paymentUrl?: string,
 *   error?: string
 * }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { Resend } from 'resend'

const MOLLIE_API_URL = 'https://api.mollie.com/v2'
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY || ''
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://webstability.nl'

// Redis for project data
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// Resend for email
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

// Pakket prijzen (incl. BTW)
const PACKAGE_PRICES: Record<string, { name: string; price: number }> = {
  starter: { name: 'Starter', price: 29.00 },
  professional: { name: 'Professional', price: 49.00 },
  business: { name: 'Business', price: 79.00 },
  webshop: { name: 'Webshop', price: 99.00 }
}

interface ProjectData {
  projectId: string
  businessName: string
  contactEmail: string
  contactName?: string
  package: string
  status: string
  mollieCustomerId?: string
  designApprovedAt?: string
  paymentStatus?: string
  paymentUrl?: string
  designPreviewUrl?: string
  [key: string]: unknown
}

interface FeedbackRequest {
  projectId: string
  approved: boolean
  feedback?: string
  type: 'design' | 'review'
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
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
  
  try {
    const body = req.body as FeedbackRequest
    const { projectId, approved, feedback, type } = body
    
    if (!projectId) {
      return res.status(400).json({ success: false, error: 'Project ID is vereist' })
    }
    
    console.log(`[Feedback] Received for project ${projectId}:`, { approved, type, feedback: feedback?.substring(0, 100) })
    
    // Haal project data op
    const projectData = kv ? await kv.get(`project:${projectId}`) as ProjectData | null : null
    
    if (!projectData) {
      console.log(`[Feedback] Project ${projectId} niet gevonden`)
      return res.status(404).json({ success: false, error: 'Project niet gevonden' })
    }
    
    const designApprovedAt = new Date().toISOString()
    let paymentUrl: string | undefined
    
    if (approved) {
      console.log(`[Feedback] Design approved for ${projectId}`)
      
      // Update project met design approval
      projectData.designApprovedAt = designApprovedAt
      projectData.paymentStatus = 'awaiting_payment'
      projectData.status = 'review' // Move to review phase
      
      // Genereer betaallink als we customer info hebben
      if (projectData.contactEmail && projectData.package) {
        try {
          paymentUrl = await createPaymentLink(projectData)
          projectData.paymentUrl = paymentUrl
          console.log(`[Feedback] Payment link created: ${paymentUrl}`)
        } catch (err) {
          console.error('[Feedback] Payment link creation failed:', err)
          // Continue without payment link - developer can create manually
        }
      }
      
      // Sla updates op in Redis
      if (kv) {
        await kv.set(`project:${projectId}`, projectData)
      }
      
      // Stuur email naar klant met betaallink
      if (projectData.contactEmail) {
        await sendApprovalEmail(projectData, paymentUrl)
      }
      
      // Stuur notificatie naar developer
      await sendDeveloperNotification(projectData, 'approved')
      
    } else {
      // Feedback ontvangen - stuur naar developer
      console.log(`[Feedback] Changes requested for ${projectId}:`, feedback)
      
      // Voeg feedback toe aan project
      const existingFeedback = (projectData as any).feedbackHistory || []
      existingFeedback.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type,
        feedback,
        status: 'pending'
      })
      ;(projectData as any).feedbackHistory = existingFeedback
      
      // Sla op in Redis
      if (kv) {
        await kv.set(`project:${projectId}`, projectData)
      }
      
      // Stuur notificatie naar developer
      await sendDeveloperNotification(projectData, 'feedback', feedback)
    }
    
    return res.status(200).json({
      success: true,
      approved,
      designApprovedAt: approved ? designApprovedAt : undefined,
      paymentUrl
    })
    
  } catch (error) {
    console.error('[Feedback] Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Er ging iets mis'
    })
  }
}

// ===========================================
// PAYMENT FUNCTIONS
// ===========================================

async function createPaymentLink(projectData: ProjectData): Promise<string> {
  const pkg = PACKAGE_PRICES[projectData.package]
  if (!pkg) {
    throw new Error(`Ongeldig pakket: ${projectData.package}`)
  }
  
  // Eerst customer ophalen of aanmaken
  let customerId = projectData.mollieCustomerId
  
  if (!customerId) {
    // Maak nieuwe customer aan
    const customerResponse = await fetch(`${MOLLIE_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectData.contactName || projectData.businessName,
        email: projectData.contactEmail,
        metadata: {
          projectId: projectData.projectId,
          businessName: projectData.businessName
        }
      })
    })
    
    if (!customerResponse.ok) {
      const error = await customerResponse.text()
      throw new Error(`Mollie customer error: ${error}`)
    }
    
    const customer = await customerResponse.json()
    customerId = customer.id
    
    // Update projectData met customer ID
    projectData.mollieCustomerId = customerId
  }
  
  // Maak betaling aan
  const redirectUrl = `${BASE_URL}/status/${projectData.projectId}?payment=success`
  const webhookUrl = `${BASE_URL}/api/mollie-webhook`
  
  const paymentResponse = await fetch(`${MOLLIE_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MOLLIE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: {
        currency: 'EUR',
        value: pkg.price.toFixed(2)
      },
      description: `Webstability ${pkg.name} - ${projectData.businessName}`,
      redirectUrl,
      webhookUrl,
      method: ['ideal', 'creditcard', 'bancontact', 'paypal'],
      metadata: {
        projectId: projectData.projectId,
        packageType: projectData.package,
        type: 'first_payment'
      },
      sequenceType: 'first' // Voor toekomstige auto-incasso
    })
  })
  
  if (!paymentResponse.ok) {
    const error = await paymentResponse.text()
    throw new Error(`Mollie payment error: ${error}`)
  }
  
  const payment = await paymentResponse.json()
  return payment._links.checkout.href
}

// ===========================================
// EMAIL FUNCTIONS
// ===========================================

async function sendApprovalEmail(projectData: ProjectData, paymentUrl?: string): Promise<void> {
  if (!resend) {
    console.log('[Feedback] Resend not configured - skipping email')
    return
  }
  
  const pkg = PACKAGE_PRICES[projectData.package]
  const paymentSection = paymentUrl ? `
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <h3 style="color: white; margin: 0 0 8px 0; font-size: 18px;">Volgende stap: Betaling</h3>
      <p style="color: rgba(255,255,255,0.9); margin: 0 0 16px 0; font-size: 14px;">
        Om je website live te zetten, vragen we je om de eerste maand te betalen.
      </p>
      <a href="${paymentUrl}" style="display: inline-block; background: white; color: #059669; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">
        Betaal €${pkg?.price.toFixed(2) || '29.00'}/maand →
      </a>
    </div>
  ` : ''
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✅ Design Goedgekeurd!</h1>
        </div>
        
        <div style="padding: 32px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            Hey${projectData.contactName ? ` ${projectData.contactName}` : ''},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            Super! Je hebt het design van <strong>${projectData.businessName}</strong> goedgekeurd. 
            We gaan nu aan de slag met de ontwikkeling van je website.
          </p>
          
          ${paymentSection}
          
          <div style="background: #0f172a; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #f1f5f9;">📊 Wat gebeurt er nu?</h3>
            <ol style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.8;">
              <li>We ontwikkelen je website (3-5 werkdagen)</li>
              <li>Je ontvangt een preview link om alles te testen</li>
              <li>Na goedkeuring gaan we live!</li>
            </ol>
          </div>
          
          <p style="font-size: 14px; color: #64748b; margin: 24px 0 0 0;">
            Vragen? Reply op deze email of stuur een bericht via je 
            <a href="${BASE_URL}/status/${projectData.projectId}" style="color: #6366f1;">project dashboard</a>.
          </p>
        </div>
        
        <div style="background: #0f172a; padding: 24px; text-align: center; border-top: 1px solid #334155;">
          <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 13px;">
            Met vriendelijke groet,<br><strong style="color: #e2e8f0;">Team Webstability</strong>
          </p>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;">
            <a href="https://webstability.nl" style="color: #6366f1; text-decoration: none;">webstability.nl</a>
            &nbsp;•&nbsp;
            <a href="mailto:info@webstability.nl" style="color: #6366f1; text-decoration: none;">info@webstability.nl</a>
            &nbsp;•&nbsp;
            <a href="tel:+31644712573" style="color: #6366f1; text-decoration: none;">06-44712573</a>
          </p>
          <p style="margin: 0; color: #475569; font-size: 11px;">
            KvK: 94081468 • BTW: NL004892818B28<br>
            © ${new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
  
  try {
    await resend.emails.send({
      from: 'Webstability <noreply@webstability.nl>',
      to: projectData.contactEmail,
      subject: `✅ Design goedgekeurd - ${projectData.businessName}`,
      html
    })
    console.log(`[Feedback] Approval email sent to ${projectData.contactEmail}`)
  } catch (err) {
    console.error('[Feedback] Email send error:', err)
  }
}

async function sendDeveloperNotification(
  projectData: ProjectData, 
  action: 'approved' | 'feedback',
  feedback?: string
): Promise<void> {
  if (!resend) return
  
  const subject = action === 'approved' 
    ? `✅ Design goedgekeurd: ${projectData.businessName}`
    : `💬 Feedback ontvangen: ${projectData.businessName}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 24px;">
        <h2 style="margin: 0 0 16px 0;">${action === 'approved' ? '✅ Design Goedgekeurd' : '💬 Feedback Ontvangen'}</h2>
        
        <p><strong>Project:</strong> ${projectData.businessName}</p>
        <p><strong>Pakket:</strong> ${projectData.package}</p>
        <p><strong>Klant:</strong> ${projectData.contactEmail}</p>
        
        ${feedback ? `
          <div style="background: #0f172a; border-radius: 8px; padding: 16px; margin-top: 16px;">
            <p style="margin: 0 0 8px 0; font-weight: 600;">Feedback:</p>
            <p style="margin: 0; color: #94a3b8;">${feedback}</p>
          </div>
        ` : ''}
        
        <p style="margin-top: 24px;">
          <a href="${BASE_URL}/developer" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Open Developer Dashboard →
          </a>
        </p>
      </div>
    </body>
    </html>
  `
  
  try {
    // Developer email - update with your email
    await resend.emails.send({
      from: 'Webstability <noreply@webstability.nl>',
      to: 'developer@webstability.nl',
      subject,
      html
    })
    console.log(`[Feedback] Developer notification sent`)
  } catch (err) {
    console.error('[Feedback] Developer notification error:', err)
  }
}
