/**
 * WhatsApp Business API Integration
 * 
 * Supports both:
 * 1. Meta WhatsApp Business API (direct)
 * 2. Twilio WhatsApp API (alternative)
 * 
 * For Meta API: https://developers.facebook.com/docs/whatsapp/cloud-api
 * For Twilio: https://www.twilio.com/docs/whatsapp
 */

// Environment variables
const WHATSAPP_PROVIDER = process.env.WHATSAPP_PROVIDER || 'meta' // 'meta' or 'twilio'

// Meta WhatsApp Business API
const META_WHATSAPP_TOKEN = process.env.META_WHATSAPP_TOKEN
const META_WHATSAPP_PHONE_ID = process.env.META_WHATSAPP_PHONE_ID

// Twilio WhatsApp (alternative)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM // e.g., 'whatsapp:+14155238886'

// Developer's WhatsApp number for notifications
const DEVELOPER_WHATSAPP = process.env.DEVELOPER_WHATSAPP || '31644712573'

/**
 * Check if WhatsApp is configured
 */
export function isWhatsAppConfigured(): boolean {
  if (WHATSAPP_PROVIDER === 'twilio') {
    return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM)
  }
  return !!(META_WHATSAPP_TOKEN && META_WHATSAPP_PHONE_ID)
}

/**
 * Format phone number to WhatsApp format (with country code, no + or spaces)
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // Remove leading +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1)
  }
  
  // Add Dutch country code if it starts with 0
  if (cleaned.startsWith('0')) {
    cleaned = '31' + cleaned.substring(1)
  }
  
  // Add 31 if it's a 9-digit Dutch number
  if (cleaned.length === 9) {
    cleaned = '31' + cleaned
  }
  
  return cleaned
}

/**
 * Send WhatsApp message via Meta Business API
 */
async function sendViaMeta(to: string, message: string): Promise<{ success: boolean; error?: string; messageId?: string }> {
  if (!META_WHATSAPP_TOKEN || !META_WHATSAPP_PHONE_ID) {
    return { success: false, error: 'Meta WhatsApp not configured' }
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${META_WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${META_WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formatPhoneNumber(to),
          type: 'text',
          text: { body: message }
        }),
      }
    )

    const data = await response.json()

    if (response.ok && data.messages?.[0]?.id) {
      return { success: true, messageId: data.messages[0].id }
    } else {
      console.error('Meta WhatsApp error:', data)
      return { success: false, error: data.error?.message || 'Unknown error' }
    }
  } catch (error) {
    console.error('Meta WhatsApp request failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Request failed' }
  }
}

/**
 * Send WhatsApp message via Twilio
 */
async function sendViaTwilio(to: string, message: string): Promise<{ success: boolean; error?: string; messageId?: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    return { success: false, error: 'Twilio WhatsApp not configured' }
  }

  try {
    const formattedTo = `whatsapp:+${formatPhoneNumber(to)}`
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: TWILIO_WHATSAPP_FROM,
          To: formattedTo,
          Body: message,
        }),
      }
    )

    const data = await response.json()

    if (response.ok && data.sid) {
      return { success: true, messageId: data.sid }
    } else {
      console.error('Twilio WhatsApp error:', data)
      return { success: false, error: data.message || 'Unknown error' }
    }
  } catch (error) {
    console.error('Twilio WhatsApp request failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Request failed' }
  }
}

/**
 * Send WhatsApp message (uses configured provider)
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  if (!isWhatsAppConfigured()) {
    console.warn('WhatsApp not configured, skipping message')
    return { success: false, error: 'WhatsApp not configured' }
  }

  console.log(`[WhatsApp] Sending to ${to}: ${message.substring(0, 50)}...`)

  if (WHATSAPP_PROVIDER === 'twilio') {
    return sendViaTwilio(to, message)
  }
  return sendViaMeta(to, message)
}

/**
 * Send notification to developer via WhatsApp
 */
export async function notifyDeveloperWhatsApp(message: string): Promise<{ success: boolean; error?: string }> {
  if (!DEVELOPER_WHATSAPP) {
    return { success: false, error: 'Developer WhatsApp not configured' }
  }
  return sendWhatsAppMessage(DEVELOPER_WHATSAPP, message)
}

// ===========================================
// PRE-DEFINED NOTIFICATION MESSAGES
// ===========================================

/**
 * Notify developer about new project
 */
export async function sendNewProjectNotification(project: {
  id: string
  businessName: string
  type: string
  package: string
}): Promise<{ success: boolean; error?: string }> {
  const message = `🎉 Nieuw project!\n\n` +
    `📋 ${project.id}\n` +
    `🏢 ${project.businessName}\n` +
    `📦 ${project.type} - ${project.package}\n\n` +
    `Open dashboard: webstability.nl/developer`
  
  return notifyDeveloperWhatsApp(message)
}

/**
 * Notify developer about uploads complete
 */
export async function sendUploadsCompleteNotification(project: {
  id: string
  businessName: string
  driveLink?: string
}): Promise<{ success: boolean; error?: string }> {
  const message = `📤 Uploads klaar!\n\n` +
    `📋 ${project.id}\n` +
    `🏢 ${project.businessName}\n\n` +
    `${project.driveLink ? `📁 ${project.driveLink}\n\n` : ''}` +
    `Klant heeft bestanden aangeleverd.`
  
  return notifyDeveloperWhatsApp(message)
}

/**
 * Notify developer about new message from client
 */
export async function sendNewMessageNotification(project: {
  id: string
  businessName: string
  messagePreview: string
}): Promise<{ success: boolean; error?: string }> {
  const message = `💬 Nieuw bericht!\n\n` +
    `📋 ${project.id}\n` +
    `🏢 ${project.businessName}\n\n` +
    `"${project.messagePreview.substring(0, 100)}${project.messagePreview.length > 100 ? '...' : ''}"`
  
  return notifyDeveloperWhatsApp(message)
}

/**
 * Notify developer about design approval
 */
export async function sendDesignApprovalNotification(project: {
  id: string
  businessName: string
}): Promise<{ success: boolean; error?: string }> {
  const message = `✅ Design goedgekeurd!\n\n` +
    `📋 ${project.id}\n` +
    `🏢 ${project.businessName}\n\n` +
    `Klant heeft design goedgekeurd. Wacht op betaling.`
  
  return notifyDeveloperWhatsApp(message)
}

/**
 * Notify developer about payment received
 */
export async function sendPaymentNotification(project: {
  id: string
  businessName: string
  amount: number
}): Promise<{ success: boolean; error?: string }> {
  const message = `💰 Betaling ontvangen!\n\n` +
    `📋 ${project.id}\n` +
    `🏢 ${project.businessName}\n` +
    `💵 €${project.amount.toFixed(2)}\n\n` +
    `Start development!`
  
  return notifyDeveloperWhatsApp(message)
}

/**
 * Send WhatsApp to client (requires their opt-in)
 */
export async function sendClientWhatsApp(
  clientPhone: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  // Only send if client has opted in (check should be done before calling)
  return sendWhatsAppMessage(clientPhone, message)
}
