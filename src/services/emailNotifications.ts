// Email Notification Service
// This service handles all email notifications for the project flow

export interface EmailTemplate {
  subject: string
  preview: string
  body: string
}

export type NotificationType = 
  | 'project_created'
  | 'onboarding_complete'
  | 'design_ready'
  | 'feedback_received'
  | 'revision_complete'
  | 'project_live'
  | 'new_message'
  | 'change_request_received'
  | 'change_request_complete'
  | 'payment_success'
  | 'payment_reminder'

interface NotificationData {
  projectId: string
  projectName: string
  clientName: string
  clientEmail: string
  previewUrl?: string
  liveUrl?: string
  message?: string
  [key: string]: string | undefined
}

// Email templates in Dutch
const EMAIL_TEMPLATES: Record<NotificationType, (data: NotificationData) => EmailTemplate> = {
  project_created: (data) => ({
    subject: `🎉 Welkom bij Webstability - Project ${data.projectId}`,
    preview: `Je project ${data.projectName} is aangemaakt!`,
    body: `
      <h1>Welkom ${data.clientName}! 🎉</h1>
      <p>Bedankt voor je vertrouwen in Webstability. Je project is succesvol aangemaakt.</p>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0;">Project Details</h2>
        <p><strong>Project ID:</strong> ${data.projectId}</p>
        <p><strong>Naam:</strong> ${data.projectName}</p>
      </div>
      
      <h2>Volgende stap: Onboarding</h2>
      <p>Om je website te kunnen bouwen hebben we wat informatie van je nodig. Klik op onderstaande knop om de onboarding te starten.</p>
      
      <a href="https://webstability.nl/intake/${data.projectId}" style="display: inline-block; background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
        Start Onboarding →
      </a>
      
      <p>Je kunt de voortgang van je project altijd volgen via:</p>
      <a href="https://webstability.nl/project/${data.projectId}">https://webstability.nl/project/${data.projectId}</a>
    `
  }),

  onboarding_complete: (data) => ({
    subject: `✅ Onboarding voltooid - ${data.projectName}`,
    preview: `We hebben alles ontvangen en gaan aan de slag!`,
    body: `
      <h1>Top, we kunnen beginnen! 🚀</h1>
      <p>Beste ${data.clientName},</p>
      <p>We hebben al je gegevens en materialen ontvangen. Ons team gaat nu aan de slag met het ontwerp van je website.</p>
      
      <div style="background: #ecfdf5; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h3 style="margin: 0 0 10px 0; color: #059669;">Wat gebeurt er nu?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>We analyseren je wensen en content</li>
          <li>We maken een eerste design concept</li>
          <li>Je ontvangt binnen 3-5 werkdagen een preview</li>
        </ul>
      </div>
      
      <p>We houden je op de hoogte van elke stap. Je kunt ook altijd de status bekijken via je persoonlijke projectpagina.</p>
      
      <a href="https://webstability.nl/project/${data.projectId}" style="display: inline-block; background: #10b981; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
        Bekijk Project Status
      </a>
    `
  }),

  design_ready: (data) => ({
    subject: `🎨 Je design is klaar voor review - ${data.projectName}`,
    preview: `Bekijk je nieuwe website design en geef feedback!`,
    body: `
      <h1>Je design is klaar! 🎨</h1>
      <p>Beste ${data.clientName},</p>
      <p>Geweldig nieuws! We hebben het eerste ontwerp van je website afgerond. We zijn benieuwd wat je ervan vindt!</p>
      
      <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h3 style="margin: 0 0 10px 0; color: #d97706;">⏰ Actie vereist</h3>
        <p style="margin: 0;">Bekijk het ontwerp en geef je feedback. Zo kunnen we verder met de ontwikkeling.</p>
      </div>
      
      ${data.previewUrl ? `
        <a href="${data.previewUrl}" style="display: inline-block; background: linear-gradient(to right, #8b5cf6, #6366f1); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Bekijk Design Preview →
        </a>
      ` : ''}
      
      <h3>Hoe geef je feedback?</h3>
      <ol>
        <li>Bekijk de preview van je website</li>
        <li>Ga naar je projectpagina</li>
        <li>Geef aan wat je goed vindt en wat je wilt aanpassen</li>
      </ol>
      
      <a href="https://webstability.nl/project/${data.projectId}" style="display: inline-block; background: #6366f1; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
        Geef Feedback
      </a>
    `
  }),

  feedback_received: (data) => ({
    subject: `📝 Feedback ontvangen - ${data.projectName}`,
    preview: `We hebben je feedback ontvangen en gaan ermee aan de slag.`,
    body: `
      <h1>Bedankt voor je feedback! 📝</h1>
      <p>Beste ${data.clientName},</p>
      <p>We hebben je feedback ontvangen en gaan ermee aan de slag. Je hoort van ons zodra we klaar zijn met de aanpassingen.</p>
      
      ${data.message ? `
        <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Je feedback:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      ` : ''}
      
      <p>Gemiddelde verwerkingstijd: 1-2 werkdagen</p>
    `
  }),

  revision_complete: (data) => ({
    subject: `✨ Aanpassingen doorgevoerd - ${data.projectName}`,
    preview: `De aanpassingen zijn klaar! Bekijk het resultaat.`,
    body: `
      <h1>Aanpassingen zijn klaar! ✨</h1>
      <p>Beste ${data.clientName},</p>
      <p>We hebben je feedback verwerkt en de aanpassingen zijn doorgevoerd. Bekijk het resultaat en laat ons weten of het naar wens is!</p>
      
      ${data.previewUrl ? `
        <a href="${data.previewUrl}" style="display: inline-block; background: linear-gradient(to right, #8b5cf6, #6366f1); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Bekijk Nieuwe Versie →
        </a>
      ` : ''}
      
      <a href="https://webstability.nl/project/${data.projectId}" style="display: inline-block; background: #6366f1; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
        Bekijk & Reageer
      </a>
    `
  }),

  project_live: (data) => ({
    subject: `🚀 Je website is LIVE! - ${data.projectName}`,
    preview: `Gefeliciteerd! Je website staat nu online.`,
    body: `
      <h1>Gefeliciteerd! Je website is live! 🚀</h1>
      <p>Beste ${data.clientName},</p>
      <p>Het moment is daar! Je website staat online en is klaar om bezoekers te ontvangen.</p>
      
      ${data.liveUrl ? `
        <div style="background: linear-gradient(to right, #ecfdf5, #d1fae5); padding: 24px; border-radius: 12px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0 0 10px 0; color: #059669;">Je website is nu bereikbaar op:</h2>
          <a href="${data.liveUrl}" style="font-size: 24px; color: #059669; font-weight: bold;">${data.liveUrl}</a>
        </div>
        
        <a href="${data.liveUrl}" style="display: inline-block; background: linear-gradient(to right, #10b981, #059669); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Bezoek Je Website →
        </a>
      ` : ''}
      
      <h2>Wat nu?</h2>
      <ul>
        <li><strong>Deel je website</strong> - Laat je klanten weten dat je online bent</li>
        <li><strong>Aanpassingen nodig?</strong> - Je kunt via je projectpagina wijzigingen aanvragen</li>
        <li><strong>Hulp nodig?</strong> - Ons team staat altijd voor je klaar</li>
      </ul>
      
      <p style="color: #6b7280; font-size: 14px;">
        Tip: Voeg je website toe aan Google Mijn Bedrijf voor betere vindbaarheid!
      </p>
    `
  }),

  new_message: (data) => ({
    subject: `💬 Nieuw bericht over ${data.projectName}`,
    preview: `Je hebt een nieuw bericht ontvangen van Team Webstability.`,
    body: `
      <h1>Je hebt een nieuw bericht 💬</h1>
      <p>Beste ${data.clientName},</p>
      <p>Er is een nieuw bericht geplaatst over je project.</p>
      
      ${data.message ? `
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">— Team Webstability</p>
        </div>
      ` : ''}
      
      <a href="https://webstability.nl/project/${data.projectId}" style="display: inline-block; background: #3b82f6; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
        Bekijk & Reageer
      </a>
    `
  }),

  change_request_received: (data) => ({
    subject: `📋 Aanpassingsverzoek ontvangen - ${data.projectName}`,
    preview: `We hebben je verzoek ontvangen en gaan ermee aan de slag.`,
    body: `
      <h1>Aanpassingsverzoek ontvangen 📋</h1>
      <p>Beste ${data.clientName},</p>
      <p>We hebben je aanpassingsverzoek ontvangen. Ons team bekijkt het en gaat ermee aan de slag.</p>
      
      ${data.message ? `
        <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Je verzoek:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      ` : ''}
      
      <p>Verwachte doorlooptijd: 1-3 werkdagen</p>
      
      <a href="https://webstability.nl/project/${data.projectId}" style="display: inline-block; background: #6366f1; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
        Bekijk Status
      </a>
    `
  }),

  change_request_complete: (data) => ({
    subject: `✅ Aanpassing afgerond - ${data.projectName}`,
    preview: `Je aangevraagde wijziging is doorgevoerd!`,
    body: `
      <h1>Aanpassing afgerond! ✅</h1>
      <p>Beste ${data.clientName},</p>
      <p>Goed nieuws! We hebben je aanpassing doorgevoerd. De wijziging is nu zichtbaar op je website.</p>
      
      ${data.liveUrl ? `
        <a href="${data.liveUrl}" style="display: inline-block; background: #10b981; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Bekijk Je Website →
        </a>
      ` : ''}
      
      <p>Laat ons weten als er nog iets aangepast moet worden!</p>
    `
  }),

  payment_success: (data) => ({
    subject: `💳 Betaling ontvangen - ${data.projectName}`,
    preview: `Bedankt voor je betaling! Je project start nu.`,
    body: `
      <h1>Betaling ontvangen! 💳</h1>
      <p>Beste ${data.clientName},</p>
      <p>Bedankt voor je betaling! Je abonnement is nu actief en we gaan aan de slag met je project.</p>
      
      <div style="background: #ecfdf5; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h3 style="margin: 0 0 10px 0; color: #059669;">✓ Betaling succesvol</h3>
        <p style="margin: 0;">Je factuur wordt binnen 24 uur per e-mail verzonden.</p>
      </div>
      
      <a href="https://webstability.nl/project/${data.projectId}" style="display: inline-block; background: #10b981; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
        Bekijk Project Status
      </a>
    `
  }),

  payment_reminder: (data) => ({
    subject: `⏰ Herinnering: Betaling openstaand - ${data.projectName}`,
    preview: `Er staat nog een betaling open voor je project.`,
    body: `
      <h1>Betalingsherinnering ⏰</h1>
      <p>Beste ${data.clientName},</p>
      <p>Dit is een vriendelijke herinnering dat er nog een betaling openstaat voor je project.</p>
      
      <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h3 style="margin: 0 0 10px 0; color: #d97706;">Actie vereist</h3>
        <p style="margin: 0;">Rond je betaling af om je project te laten starten.</p>
      </div>
      
      <a href="https://webstability.nl/project/${data.projectId}" style="display: inline-block; background: #f59e0b; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">
        Betaling Afronden
      </a>
      
      <p style="color: #6b7280; font-size: 14px;">
        Vragen over je factuur? Neem gerust contact met ons op.
      </p>
    `
  }),
}

// Generate email HTML with base template
export function generateEmailHtml(type: NotificationType, data: NotificationData): string {
  const template = EMAIL_TEMPLATES[type](data)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 32px; text-align: center;">
              <img src="https://webstability.nl/logo-white.png" alt="Webstability" width="180" style="max-width: 100%;">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${template.body}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Vragen? We staan voor je klaar!
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <a href="mailto:info@webstability.nl" style="color: #2563eb;">info@webstability.nl</a>
                &nbsp;•&nbsp;
                <a href="https://wa.me/31612345678" style="color: #2563eb;">WhatsApp</a>
              </p>
              <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// Send email notification (mock implementation - integrate with your email provider)
export async function sendNotification(
  type: NotificationType, 
  data: NotificationData
): Promise<{ success: boolean; error?: string }> {
  try {
    const template = EMAIL_TEMPLATES[type](data)
    const html = generateEmailHtml(type, data)
    
    // Log for development
    console.log(`[Email] Sending ${type} to ${data.clientEmail}`)
    console.log(`[Email] Subject: ${template.subject}`)
    console.log(`[Email] HTML length: ${html.length} chars`)
    
    // In production, integrate with your email provider:
    // - Resend (recommended): https://resend.com
    // - SendGrid: https://sendgrid.com
    // - Amazon SES
    // - Postmark
    
    // Example with Resend:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'Webstability <noreply@webstability.nl>',
    //     to: data.clientEmail,
    //     subject: template.subject,
    //     html: html,
    //   }),
    // })
    
    return { success: true }
  } catch (error) {
    console.error('[Email] Error sending notification:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Helper to send batch notifications
export async function sendBatchNotifications(
  notifications: { type: NotificationType; data: NotificationData }[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0
  let failed = 0
  
  for (const notification of notifications) {
    const result = await sendNotification(notification.type, notification.data)
    if (result.success) {
      sent++
    } else {
      failed++
    }
  }
  
  return { sent, failed }
}
