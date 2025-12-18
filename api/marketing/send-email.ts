import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'info@webstability.nl',
    pass: process.env.SMTP_PASS
  }
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, subject, body, leadId } = req.body

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body' })
  }

  try {
    // Convert plain text to HTML (preserve line breaks)
    const htmlBody = body
      .replace(/\n/g, '<br>')
      .replace(/✓/g, '&#10003;')
      .replace(/•/g, '&bull;')

    await transporter.sendMail({
      from: {
        name: 'Webstability',
        address: process.env.SMTP_USER || 'info@webstability.nl'
      },
      to,
      subject,
      text: body,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="margin-bottom: 30px;">
            ${htmlBody}
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="font-size: 12px; color: #888;">
            <p style="margin: 0;">
              Dit bericht is verstuurd door Webstability<br>
              <a href="https://webstability.nl" style="color: #10b981;">webstability.nl</a>
            </p>
          </div>
        </body>
        </html>
      `
    })

    console.log(`Marketing email sent to ${to} for lead ${leadId}`)

    return res.status(200).json({ 
      success: true, 
      message: 'Email verstuurd',
      leadId 
    })

  } catch (error) {
    console.error('Email send error:', error)
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
