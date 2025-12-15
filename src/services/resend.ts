import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Webstability <noreply@webstability.nl>'

// Check if Resend is configured
export const isResendConfigured = (): boolean => {
  return Boolean(resendApiKey)
}

// Create Resend client (only if configured)
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Email types
interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

// Generic send email function
export const sendEmail = async (options: SendEmailOptions): Promise<EmailResult> => {
  if (!resend) {
    console.warn('Resend is not configured. Email not sent:', options.subject)
    return { success: false, error: 'Resend not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: String(err) }
  }
}

// ===========================================
// Email Templates
// ===========================================

// Project created notification (to developer)
export const sendProjectCreatedEmail = async (project: {
  id: string
  businessName: string
  email: string
  phone?: string
  package: string
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
        .badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
        .detail { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Nieuw Project!</h1>
          <span class="badge">${project.package.toUpperCase()}</span>
        </div>
        <div class="content">
          <h2>Projectdetails</h2>
          <div class="detail">
            <strong>Bedrijf:</strong> ${project.businessName}<br>
            <strong>Email:</strong> ${project.email}<br>
            <strong>Telefoon:</strong> ${project.phone || 'Niet opgegeven'}<br>
            <strong>Pakket:</strong> ${project.package}
          </div>
          <a href="https://webstability.nl/developer" class="btn">Bekijk in Dashboard</a>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: 'info@webstability.nl',
    subject: `🎉 Nieuw project: ${project.businessName}`,
    html,
  })
}

// Welcome email to customer
export const sendWelcomeEmail = async (customer: {
  email: string
  name: string
  projectId: string
  package: string
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .footer { background: #f8fafc; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center; font-size: 14px; color: #64748b; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .step { display: flex; align-items: start; margin: 20px 0; }
        .step-num { background: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
        .step-text { flex: 1; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Welkom bij Webstability! 🚀</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Je professionele website is onderweg</p>
        </div>
        <div class="content">
          <p>Hoi ${customer.name},</p>
          <p>Super dat je voor Webstability hebt gekozen! We gaan direct voor je aan de slag.</p>
          
          <h3>Zo werkt het:</h3>
          
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text">
              <strong>Onboarding invullen</strong><br>
              Vertel ons meer over je bedrijf, kleuren en stijl.
            </div>
          </div>
          
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text">
              <strong>Wij ontwerpen</strong><br>
              Binnen 5-7 dagen ontvang je het eerste design.
            </div>
          </div>
          
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text">
              <strong>Feedback geven</strong><br>
              Bekijk het design en geef feedback. Tot 3 revisies inbegrepen!
            </div>
          </div>
          
          <div class="step">
            <div class="step-num">4</div>
            <div class="step-text">
              <strong>Live!</strong><br>
              Na goedkeuring en betaling gaat je website direct live.
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://webstability.nl/onboarding/${customer.projectId}" class="btn">
              Start Onboarding →
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
            Vragen? Reply direct op deze email of stuur een WhatsApp naar +31 6 12345678.
          </p>
        </div>
        <div class="footer">
          <p>Met vriendelijke groet,<br><strong>Team Webstability</strong></p>
          <p style="margin-top: 20px;">
            <a href="https://webstability.nl" style="color: #2563eb;">webstability.nl</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: customer.email,
    subject: `Welkom ${customer.name}! Je Webstability project is gestart 🚀`,
    html,
    replyTo: 'info@webstability.nl',
  })
}

// Design ready for review
export const sendDesignReadyEmail = async (customer: {
  email: string
  name: string
  projectId: string
  previewUrl: string
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .footer { background: #f8fafc; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center; font-size: 14px; color: #64748b; }
        .btn { display: inline-block; background: #10b981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px; }
        .btn-outline { display: inline-block; background: white; color: #2563eb; border: 2px solid #2563eb; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px; }
        .preview-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Je design is klaar! 🎨</h1>
        </div>
        <div class="content">
          <p>Hoi ${customer.name},</p>
          <p>Goed nieuws! Het design voor je website is af en klaar voor review.</p>
          
          <div class="preview-box">
            <h3 style="margin-top: 0;">👀 Bekijk je website</h3>
            <p>Neem rustig de tijd om alles te bekijken.</p>
            <a href="${customer.previewUrl}" class="btn">Preview Bekijken</a>
          </div>
          
          <p>Ben je tevreden? Keur het design goed in je dashboard. Heb je aanpassingen? Geen probleem, je hebt 3 revisies inbegrepen!</p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://webstability.nl/status/${customer.projectId}" class="btn-outline">
              Naar Dashboard
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Met vriendelijke groet,<br><strong>Team Webstability</strong></p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: customer.email,
    subject: `🎨 Je website design is klaar voor review!`,
    html,
    replyTo: 'info@webstability.nl',
  })
}

// Payment received confirmation
export const sendPaymentConfirmationEmail = async (customer: {
  email: string
  name: string
  projectId: string
  amount: number
  invoiceUrl?: string
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .footer { background: #f8fafc; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center; font-size: 14px; color: #64748b; }
        .success-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        .amount { font-size: 32px; font-weight: bold; color: #10b981; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Betaling ontvangen ✅</h1>
        </div>
        <div class="content">
          <p>Hoi ${customer.name},</p>
          <p>Bedankt voor je betaling! We hebben deze succesvol ontvangen.</p>
          
          <div class="success-box">
            <p style="margin: 0; color: #64748b;">Betaald bedrag</p>
            <div class="amount">€${customer.amount.toFixed(2)}</div>
            <p style="margin: 10px 0 0; color: #10b981; font-weight: 600;">✓ Betaling geslaagd</p>
          </div>
          
          <p><strong>Wat nu?</strong></p>
          <p>Je website wordt nu live gezet! Dit gebeurt meestal binnen 24 uur. Je ontvangt een email zodra alles online staat.</p>
          
          ${customer.invoiceUrl ? `
          <p style="margin-top: 20px;">
            <a href="${customer.invoiceUrl}" style="color: #2563eb;">📄 Download je factuur (PDF)</a>
          </p>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://webstability.nl/status/${customer.projectId}" class="btn">
              Bekijk Status
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Met vriendelijke groet,<br><strong>Team Webstability</strong></p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: customer.email,
    subject: `✅ Betaling ontvangen - €${customer.amount.toFixed(2)}`,
    html,
    replyTo: 'info@webstability.nl',
  })
}

// Website is live!
export const sendWebsiteLiveEmail = async (customer: {
  email: string
  name: string
  domain: string
  liveUrl: string
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .footer { background: #f8fafc; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center; font-size: 14px; color: #64748b; }
        .live-box { background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border: 2px solid #8b5cf6; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0; }
        .domain { font-size: 24px; font-weight: bold; color: #6d28d9; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .share-btns { margin-top: 20px; }
        .share-btns a { display: inline-block; margin: 5px; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎉 Je website is LIVE!</h1>
        </div>
        <div class="content">
          <p>Hoi ${customer.name},</p>
          <p>Het moment is daar! Je nieuwe website staat online en is bereikbaar voor de hele wereld.</p>
          
          <div class="live-box">
            <p style="margin: 0 0 10px; color: #64748b;">Je website:</p>
            <div class="domain">${customer.domain}</div>
            <a href="${customer.liveUrl}" class="btn" style="margin-top: 20px;">
              🌐 Bezoek je website
            </a>
          </div>
          
          <h3>Wat kun je nu doen?</h3>
          <ul>
            <li>Deel je nieuwe website met je netwerk</li>
            <li>Voeg de link toe aan je social media profielen</li>
            <li>Update je visitekaartjes en briefpapier</li>
            <li>Claim je Google Mijn Bedrijf profiel</li>
          </ul>
          
          <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
            💡 <strong>Tip:</strong> Heb je vragen of wil je wijzigingen? Je kunt altijd contact met ons opnemen via je dashboard.
          </p>
        </div>
        <div class="footer">
          <p>Gefeliciteerd met je nieuwe website! 🚀</p>
          <p><strong>Team Webstability</strong></p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: customer.email,
    subject: `🎉 Je website ${customer.domain} is LIVE!`,
    html,
    replyTo: 'info@webstability.nl',
  })
}

// Developer notification for new feedback
export const sendFeedbackNotificationEmail = async (project: {
  id: string
  businessName: string
  feedbackType: string
  feedbackContent: string
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #fbbf24; color: #1f2937; padding: 20px 30px; border-radius: 12px 12px 0 0; }
        .content { background: #fffbeb; padding: 30px; border-radius: 0 0 12px 12px; }
        .feedback-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #fbbf24; }
        .btn { display: inline-block; background: #1f2937; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">📝 Nieuwe Feedback</h2>
          <p style="margin: 5px 0 0;">${project.businessName}</p>
        </div>
        <div class="content">
          <p><strong>Type:</strong> ${project.feedbackType}</p>
          <div class="feedback-box">
            ${project.feedbackContent}
          </div>
          <a href="https://webstability.nl/developer" class="btn">Bekijk in Dashboard</a>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: 'info@webstability.nl',
    subject: `📝 Nieuwe feedback: ${project.businessName}`,
    html,
  })
}

export default {
  sendEmail,
  sendProjectCreatedEmail,
  sendWelcomeEmail,
  sendDesignReadyEmail,
  sendPaymentConfirmationEmail,
  sendWebsiteLiveEmail,
  sendFeedbackNotificationEmail,
}
