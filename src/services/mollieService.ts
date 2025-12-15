/**
 * Mollie Payment Service
 * 
 * Handles all Mollie API interactions for:
 * - Customer creation
 * - First payment (to get mandate for recurring)
 * - Subscription creation
 * - Payment status checks
 * - Webhook handling
 * 
 * Flow:
 * 1. Klant kiest pakket → createCustomer()
 * 2. Eerste betaling → createFirstPayment() → Redirect naar Mollie
 * 3. Klant betaalt → Webhook → handlePaymentWebhook()
 * 4. Betaling succesvol → createSubscription() met mandate
 * 5. Elke maand → Mollie incasseert automatisch → Webhook → createInvoice()
 */

import { companyInfo, packages, VAT_RATE, type PackageType } from '../config/company'
import type { 
  CustomerDetails,
  MolliePaymentResponse,
  MollieSubscriptionResponse,
  PaymentMethod
} from '../types/billing'

// Mollie API base URL
const MOLLIE_API_URL = 'https://api.mollie.com/v2'

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Format bedrag voor Mollie API (string met 2 decimalen)
 */
export function formatMollieAmount(amount: number): string {
  return amount.toFixed(2)
}

/**
 * Parse Mollie bedrag naar number
 */
export function parseMollieAmount(amount: { value: string; currency: string }): number {
  return parseFloat(amount.value)
}

/**
 * Genereer webhook URL
 */
export function getWebhookUrl(): string {
  const baseUrl = import.meta.env?.VITE_API_URL || 'https://webstability.nl'
  return `${baseUrl}/api/mollie-webhook`
}

// ===========================================
// CUSTOMER MANAGEMENT
// ===========================================

/**
 * Maak een nieuwe Mollie klant aan
 */
export async function createMollieCustomer(
  apiKey: string,
  customer: CustomerDetails,
  projectId: string
): Promise<{ customerId: string }> {
  const response = await fetch(`${MOLLIE_API_URL}/customers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: customer.companyName || customer.name,
      email: customer.email,
      metadata: {
        projectId,
        phone: customer.phone,
        kvk: customer.kvk,
        btw: customer.btw
      }
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mollie error: ${error.detail || 'Kon klant niet aanmaken'}`)
  }
  
  const data = await response.json()
  return { customerId: data.id }
}

/**
 * Haal klantgegevens op
 */
export async function getMollieCustomer(
  apiKey: string,
  customerId: string
): Promise<{ id: string; name: string; email: string }> {
  const response = await fetch(`${MOLLIE_API_URL}/customers/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })
  
  if (!response.ok) {
    throw new Error('Kon klant niet ophalen')
  }
  
  return response.json()
}

// ===========================================
// FIRST PAYMENT (voor mandate)
// ===========================================

/**
 * Maak eerste betaling aan voor recurring payments
 * Dit creëert een mandate die we later gebruiken voor automatische incasso
 */
export async function createFirstPayment(
  apiKey: string,
  data: {
    customerId: string
    projectId: string
    packageType: PackageType
    redirectUrl: string
  }
): Promise<{ paymentId: string; checkoutUrl: string }> {
  const pkg = packages[data.packageType]
  
  const response = await fetch(`${MOLLIE_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: {
        value: formatMollieAmount(pkg.priceInclVat),
        currency: 'EUR'
      },
      description: `${companyInfo.name} - ${pkg.name} (eerste maand)`,
      redirectUrl: data.redirectUrl,
      webhookUrl: getWebhookUrl(),
      
      // Koppel aan klant voor mandate
      customerId: data.customerId,
      sequenceType: 'first', // Dit maakt een mandate aan
      
      metadata: {
        projectId: data.projectId,
        packageType: data.packageType,
        type: 'first_payment',
        priceExclVat: pkg.priceExclVat,
        vatAmount: pkg.priceInclVat - pkg.priceExclVat,
        vatRate: VAT_RATE
      }
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mollie error: ${error.detail || 'Kon betaling niet aanmaken'}`)
  }
  
  const payment = await response.json()
  
  return {
    paymentId: payment.id,
    checkoutUrl: payment._links.checkout.href
  }
}

// ===========================================
// SUBSCRIPTION MANAGEMENT
// ===========================================

/**
 * Maak een subscription aan na succesvolle eerste betaling
 */
export async function createMollieSubscription(
  apiKey: string,
  data: {
    customerId: string
    projectId: string
    packageType: PackageType
  }
): Promise<{ subscriptionId: string; nextPaymentDate: string }> {
  const pkg = packages[data.packageType]
  
  const response = await fetch(
    `${MOLLIE_API_URL}/customers/${data.customerId}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: {
          value: formatMollieAmount(pkg.priceInclVat),
          currency: 'EUR'
        },
        interval: '1 month',
        description: `${companyInfo.name} - ${pkg.name} (maandelijks)`,
        webhookUrl: getWebhookUrl(),
        metadata: {
          projectId: data.projectId,
          packageType: data.packageType,
          priceExclVat: pkg.priceExclVat,
          vatAmount: pkg.priceInclVat - pkg.priceExclVat,
          vatRate: VAT_RATE
        }
      })
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mollie error: ${error.detail || 'Kon abonnement niet aanmaken'}`)
  }
  
  const subscription: MollieSubscriptionResponse = await response.json()
  
  return {
    subscriptionId: subscription.id,
    nextPaymentDate: subscription.nextPaymentDate || ''
  }
}

/**
 * Pauzeer een subscription
 */
export async function pauseMollieSubscription(
  apiKey: string,
  customerId: string,
  subscriptionId: string
): Promise<void> {
  // Mollie heeft geen echte pause, we cancelen en maken later nieuw
  // Voor nu gebruiken we de cancel endpoint
  await cancelMollieSubscription(apiKey, customerId, subscriptionId)
}

/**
 * Annuleer een subscription
 */
export async function cancelMollieSubscription(
  apiKey: string,
  customerId: string,
  subscriptionId: string
): Promise<void> {
  const response = await fetch(
    `${MOLLIE_API_URL}/customers/${customerId}/subscriptions/${subscriptionId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mollie error: ${error.detail || 'Kon abonnement niet annuleren'}`)
  }
}

/**
 * Haal subscription details op
 */
export async function getMollieSubscription(
  apiKey: string,
  customerId: string,
  subscriptionId: string
): Promise<MollieSubscriptionResponse> {
  const response = await fetch(
    `${MOLLIE_API_URL}/customers/${customerId}/subscriptions/${subscriptionId}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Kon abonnement niet ophalen')
  }
  
  return response.json()
}

// ===========================================
// PAYMENT MANAGEMENT
// ===========================================

/**
 * Haal payment details op
 */
export async function getMolliePayment(
  apiKey: string,
  paymentId: string
): Promise<MolliePaymentResponse> {
  const response = await fetch(`${MOLLIE_API_URL}/payments/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })
  
  if (!response.ok) {
    throw new Error('Kon betaling niet ophalen')
  }
  
  return response.json()
}

/**
 * Maak een eenmalige betaling (voor extra services)
 */
export async function createOneTimePayment(
  apiKey: string,
  data: {
    customerId?: string
    projectId: string
    description: string
    amountInclVat: number
    redirectUrl: string
    metadata?: Record<string, unknown>
  }
): Promise<{ paymentId: string; checkoutUrl: string }> {
  const body: Record<string, unknown> = {
    amount: {
      value: formatMollieAmount(data.amountInclVat),
      currency: 'EUR'
    },
    description: data.description,
    redirectUrl: data.redirectUrl,
    webhookUrl: getWebhookUrl(),
    metadata: {
      projectId: data.projectId,
      type: 'one_time',
      ...data.metadata
    }
  }
  
  // Als we een bestaande klant hebben, koppel de betaling
  if (data.customerId) {
    body.customerId = data.customerId
  }
  
  const response = await fetch(`${MOLLIE_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mollie error: ${error.detail || 'Kon betaling niet aanmaken'}`)
  }
  
  const payment = await response.json()
  
  return {
    paymentId: payment.id,
    checkoutUrl: payment._links.checkout.href
  }
}

/**
 * Refund een betaling (gedeeltelijk of volledig)
 */
export async function refundPayment(
  apiKey: string,
  paymentId: string,
  amount?: number,
  description?: string
): Promise<{ refundId: string }> {
  const body: Record<string, unknown> = {}
  
  if (amount) {
    body.amount = {
      value: formatMollieAmount(amount),
      currency: 'EUR'
    }
  }
  
  if (description) {
    body.description = description
  }
  
  const response = await fetch(`${MOLLIE_API_URL}/payments/${paymentId}/refunds`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mollie error: ${error.detail || 'Kon niet terugbetalen'}`)
  }
  
  const refund = await response.json()
  return { refundId: refund.id }
}

// ===========================================
// MANDATE MANAGEMENT
// ===========================================

/**
 * Haal mandates op voor een klant
 */
export async function getCustomerMandates(
  apiKey: string,
  customerId: string
): Promise<Array<{ id: string; status: string; method: PaymentMethod }>> {
  const response = await fetch(
    `${MOLLIE_API_URL}/customers/${customerId}/mandates`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Kon mandates niet ophalen')
  }
  
  const data = await response.json()
  return data._embedded?.mandates || []
}

/**
 * Check of klant een geldige mandate heeft
 */
export async function hasValidMandate(
  apiKey: string,
  customerId: string
): Promise<boolean> {
  const mandates = await getCustomerMandates(apiKey, customerId)
  return mandates.some(m => m.status === 'valid')
}
