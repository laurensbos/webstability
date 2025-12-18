import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  try {
    const { name, email, company } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('[Mock] Would send welcome email to:', email)
      console.log('[Mock] Name:', name, 'Company:', company || 'N/A')
      return res.status(200).json({ 
        success: true, 
        mock: true,
        message: 'Email would be sent (mock mode)' 
      })
    }

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: 'Webstability <noreply@webstability.nl>',
      to: email,
      subject: `Welkom bij Webstability${company ? `, ${company}` : ''}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="https://webstability.nl/og-image.svg" alt="Webstability" style="height: 40px; margin-bottom: 16px;">
            </div>
            
            <!-- Main Card -->
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Welcome Badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600;">
                  🎉 Welkom bij Webstability!
                </span>
              </div>
              
              <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 16px 0;">
                Hallo ${name}!
              </h1>
              
              <p style="color: #64748b; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 32px 0;">
                We zijn blij dat je deel uitmaakt van Webstability! We helpen ondernemers zoals jij aan professionele websites die écht resultaat opleveren.
              </p>
              
              <!-- What's Next Section -->
              <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <h2 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                  ✨ Wat kun je verwachten?
                </h2>
                <ul style="color: #475569; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                  <li>Professioneel webdesign op maat</li>
                  <li>Geen technisch gedoe - wij regelen alles</li>
                  <li>Transparante prijzen, geen verborgen kosten</li>
                  <li>Persoonlijk contact via je eigen klantportaal</li>
                  <li>Snelle levering binnen 5-10 werkdagen</li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="https://webstability.nl/start" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Start je project →
                </a>
              </div>
              
              <!-- Pricing Preview -->
              <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                  Onze pakketten beginnen vanaf
                </p>
                <p style="color: #1e293b; font-size: 32px; font-weight: 700; margin: 0;">
                  €49<span style="font-size: 16px; color: #64748b; font-weight: 400;">/maand</span>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; color: #94a3b8; font-size: 14px;">
              <p style="margin: 0 0 8px 0;">
                Vragen? Reply gewoon op deze email!
              </p>
              <p style="margin: 0;">
                © ${new Date().getFullYear()} Webstability • Leiden, Nederland
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email', details: error })
    }

    return res.status(200).json({ 
      success: true, 
      emailId: data?.id,
      message: 'Welcome email sent successfully' 
    })

  } catch (error) {
    console.error('Error sending welcome email:', error)
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
