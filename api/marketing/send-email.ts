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

// Professional email template with Webstability branding
const createEmailTemplate = (body: string) => {
  // Convert plain text to HTML (preserve line breaks and bullets)
  const htmlBody = body
    .replace(/\n/g, '<br>')
    .replace(/✓/g, '&#10003;')
    .replace(/•/g, '&bull;')

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webstability</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-radius: 16px 16px 0 0;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                      webstability
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.8);">
                      Professionele websites voor ondernemers
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Email Content -->
          <tr>
            <td style="padding: 40px; background-color: #ffffff; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
              <div style="font-size: 15px; line-height: 1.7; color: #374151;">
                ${htmlBody}
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f3f4f6; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; border-top: none;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #111827;">
                      Webstability
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.6;">
                      <a href="https://webstability.nl" style="color: #059669; text-decoration: none;">webstability.nl</a><br>
                      <a href="mailto:info@webstability.nl" style="color: #059669; text-decoration: none;">info@webstability.nl</a><br>
                      <a href="tel:+31644712573" style="color: #059669; text-decoration: none;">06-44712573</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 1.6;">
                      <strong>Webstability</strong><br>
                      KvK: 94081468<br>
                      BTW: NL004892818B28
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 10px; color: #9ca3af;">
                      © ${new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, subject, body, leadId, businessName } = req.body

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body' })
  }

  try {
    await transporter.sendMail({
      from: {
        name: 'Laurens van Webstability',
        address: process.env.SMTP_USER || 'info@webstability.nl'
      },
      to,
      subject,
      text: body,
      html: createEmailTemplate(body)
    })

    console.log(`Marketing email sent to ${to}${leadId ? ` for lead ${leadId}` : ''}${businessName ? ` (${businessName})` : ''}`)

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
