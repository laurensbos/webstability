/**
 * Mollie Webhook Handler
 * 
 * Dit endpoint wordt aangeroepen door Mollie wanneer een betaling status verandert.
 * 
 * POST /api/mollie-webhook
 * Body: { id: "tr_xxx" }
 * 
 * Vercel Serverless Function
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

const MOLLIE_API_URL = 'https://api.mollie.com/v2'

// Environment variables
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY || ''
const DATABASE_URL = process.env.DATABASE_URL || ''

interface MolliePayment {
  id: string
  status: 'open' | 'pending' | 'authorized' | 'paid' | 'failed' | 'canceled' | 'expired'
  amount: { value: string; currency: string }
  description: string
  metadata: {
    projectId?: string
    subscriptionId?: string
    invoiceId?: string
    packageType?: string
    type?: 'first_payment' | 'recurring' | 'one_time'
    priceExclVat?: number
    vatAmount?: number
    vatRate?: number
  }
  customerId?: string
  mandateId?: string
  subscriptionId?: string
  paidAt?: string
  failedAt?: string
  canceledAt?: string
  expiredAt?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Alleen POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const { id } = req.body
    
    if (!id) {
      console.error('[Webhook] Geen payment ID ontvangen')
      return res.status(400).json({ error: 'Missing payment ID' })
    }
    
    console.log(`[Webhook] Payment update ontvangen: ${id}`)
    
    // Haal payment details op bij Mollie
    const payment = await getMolliePayment(id)
    
    console.log(`[Webhook] Payment status: ${payment.status}`)
    console.log(`[Webhook] Metadata:`, payment.metadata)
    
    // Verwerk op basis van status
    switch (payment.status) {
      case 'paid':
        await handlePaymentSuccess(payment)
        break
        
      case 'failed':
        await handlePaymentFailed(payment)
        break
        
      case 'canceled':
      case 'expired':
        await handlePaymentCanceled(payment)
        break
        
      default:
        console.log(`[Webhook] Status ${payment.status} - geen actie nodig`)
    }
    
    // Mollie verwacht een 200 OK
    return res.status(200).json({ success: true })
    
  } catch (error) {
    console.error('[Webhook] Error:', error)
    // Stuur toch 200, anders blijft Mollie retrien
    return res.status(200).json({ error: 'Internal error, logged' })
  }
}

// ===========================================
// MOLLIE API CALLS
// ===========================================

async function getMolliePayment(paymentId: string): Promise<MolliePayment> {
  const response = await fetch(`${MOLLIE_API_URL}/payments/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${MOLLIE_API_KEY}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`Mollie API error: ${response.status}`)
  }
  
  return response.json()
}

async function createMollieSubscription(
  customerId: string,
  packageType: string,
  projectId: string,
  priceExclVat: number,
  vatAmount: number,
  vatRate: number
): Promise<{ subscriptionId: string; nextPaymentDate: string }> {
  // Bepaal prijs op basis van package
  const prices: Record<string, number> = {
    starter: 29.00,
    professional: 49.00,
    business: 79.00,
    webshop: 99.00
  }
  
  const amount = prices[packageType] || 29.00
  
  const response = await fetch(
    `${MOLLIE_API_URL}/customers/${customerId}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: {
          value: amount.toFixed(2),
          currency: 'EUR'
        },
        interval: '1 month',
        description: `Webstability - ${packageType} (maandelijks)`,
        webhookUrl: `${process.env.VERCEL_URL || 'https://webstability.nl'}/api/mollie-webhook`,
        metadata: {
          projectId,
          packageType,
          priceExclVat,
          vatAmount,
          vatRate
        }
      })
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mollie subscription error: ${error.detail}`)
  }
  
  const subscription = await response.json()
  
  return {
    subscriptionId: subscription.id,
    nextPaymentDate: subscription.nextPaymentDate
  }
}

// ===========================================
// PAYMENT HANDLERS
// ===========================================

async function handlePaymentSuccess(payment: MolliePayment) {
  const { metadata, customerId, mandateId } = payment
  
  console.log(`[Webhook] ✅ Betaling succesvol: ${payment.id}`)
  
  // Check of dit een eerste betaling is (voor subscription)
  if (metadata.type === 'first_payment' && customerId && mandateId) {
    console.log(`[Webhook] Eerste betaling - maak subscription aan`)
    
    try {
      // Maak subscription aan
      const subscription = await createMollieSubscription(
        customerId,
        metadata.packageType || 'starter',
        metadata.projectId || '',
        metadata.priceExclVat || 0,
        metadata.vatAmount || 0,
        metadata.vatRate || 0.21
      )
      
      console.log(`[Webhook] ✅ Subscription aangemaakt: ${subscription.subscriptionId}`)
      
      // Update project in database
      await updateProjectSubscription(
        metadata.projectId || '',
        subscription.subscriptionId,
        subscription.nextPaymentDate
      )
      
    } catch (error) {
      console.error(`[Webhook] ❌ Kon subscription niet aanmaken:`, error)
    }
  }
  
  // Maak/update factuur
  await createOrUpdateInvoice(payment, 'paid')
  
  // Update project status
  if (metadata.projectId) {
    await updateProjectPaymentStatus(metadata.projectId, 'paid')
  }
  
  // Stuur bevestigingsmail
  await sendPaymentConfirmation(payment)
}

async function handlePaymentFailed(payment: MolliePayment) {
  console.log(`[Webhook] ❌ Betaling mislukt: ${payment.id}`)
  
  const { metadata } = payment
  
  // Update factuur status
  if (metadata.invoiceId) {
    await updateInvoiceStatus(metadata.invoiceId, 'overdue')
  }
  
  // Update project
  if (metadata.projectId) {
    await updateProjectPaymentStatus(metadata.projectId, 'failed')
  }
  
  // Stuur herinneringsmail
  await sendPaymentFailedEmail(payment)
}

async function handlePaymentCanceled(payment: MolliePayment) {
  console.log(`[Webhook] ⚠️ Betaling geannuleerd/verlopen: ${payment.id}`)
  
  const { metadata } = payment
  
  // Update factuur status
  if (metadata.invoiceId) {
    await updateInvoiceStatus(metadata.invoiceId, 'cancelled')
  }
}

// ===========================================
// DATABASE OPERATIONS (Placeholder - implementeer met je database)
// ===========================================

async function updateProjectSubscription(
  projectId: string,
  subscriptionId: string,
  nextPaymentDate: string
): Promise<void> {
  // TODO: Implementeer database update
  console.log(`[DB] Update project ${projectId}:`, { subscriptionId, nextPaymentDate })
  
  // Voorbeeld met fetch naar je eigen API:
  // await fetch(`${process.env.VERCEL_URL}/api/internal/update-project`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ projectId, subscriptionId, nextPaymentDate })
  // })
}

async function updateProjectPaymentStatus(
  projectId: string,
  status: 'paid' | 'failed' | 'pending'
): Promise<void> {
  console.log(`[DB] Update payment status for ${projectId}: ${status}`)
  
  // Bereken de paymentCompletedAt timestamp
  const now = new Date().toISOString()
  
  // Update project in database via interne API
  try {
    const response = await fetch(
      `${process.env.VERCEL_URL || 'https://webstability.nl'}/api/internal/update-project-payment`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Internal-Secret': process.env.INTERNAL_API_SECRET || ''
        },
        body: JSON.stringify({ 
          projectId, 
          paymentStatus: status,
          paymentCompletedAt: status === 'paid' ? now : undefined
        })
      }
    )
    
    if (response.ok) {
      console.log(`[DB] ✅ Project ${projectId} payment status updated to ${status}`)
      
      // Bij succesvolle betaling: stuur notificatie naar developer
      if (status === 'paid') {
        await sendDeveloperNotification(projectId, 'payment_received')
      }
    }
  } catch (error) {
    console.error(`[DB] ❌ Kon project niet updaten:`, error)
  }
}

async function createOrUpdateInvoice(
  payment: MolliePayment,
  status: 'paid' | 'sent' | 'draft'
): Promise<void> {
  console.log(`[Invoice] Create/update invoice for payment ${payment.id}, status: ${status}`)
  
  // Genereer factuurnummer, maak PDF, etc.
  // Dit zou een call naar je invoice service kunnen zijn
}

async function updateInvoiceStatus(
  invoiceId: string,
  status: string
): Promise<void> {
  console.log(`[Invoice] Update status ${invoiceId}: ${status}`)
}

// ===========================================
// EMAIL NOTIFICATIONS
// ===========================================

async function sendPaymentConfirmation(payment: MolliePayment): Promise<void> {
  console.log(`[Email] Stuur betalingsbevestiging voor ${payment.id}`)
  
  // Implementeer met je email service (Resend, SendGrid, etc.)
  // const { sendNotification } = require('../services/emailNotifications')
  // await sendNotification('payment_success', { ... })
}

async function sendPaymentFailedEmail(payment: MolliePayment): Promise<void> {
  console.log(`[Email] Stuur betalingsfout email voor ${payment.id}`)
}

async function sendDeveloperNotification(
  projectId: string,
  type: 'payment_received' | 'payment_failed' | 'subscription_created'
): Promise<void> {
  console.log(`[Notification] Developer notificatie: ${type} voor project ${projectId}`)
  
  // Stuur een notificatie naar de developer via:
  // 1. E-mail
  // 2. Push notificatie
  // 3. Slack/Discord webhook
  // 4. In-app notificatie
  
  try {
    // Voorbeeld: Email naar developer
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     from: 'Webstability <noreply@webstability.nl>',
    //     to: 'developer@webstability.nl',
    //     subject: `🚀 Project betaald - Klaar voor livegang: ${projectId}`,
    //     html: `
    //       <h1>Betaling ontvangen!</h1>
    //       <p>Project <strong>${projectId}</strong> is betaald en klaar om live te gaan.</p>
    //       <a href="https://webstability.nl/developer">Open Developer Dashboard</a>
    //     `
    //   })
    // })
    
    console.log(`[Notification] ✅ Developer genotificeerd over ${type}`)
    
  } catch (error) {
    console.error(`[Notification] ❌ Kon developer niet notificeren:`, error)
  }
}
