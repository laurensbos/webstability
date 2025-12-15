/**
 * Create Payment API Endpoint
 * 
 * Maakt een Mollie betaling aan voor een nieuw abonnement.
 * 
 * POST /api/create-payment
 * Body: {
 *   projectId: string,
 *   packageType: 'starter' | 'professional' | 'business' | 'webshop',
 *   customer: {
 *     name: string,
 *     email: string,
 *     phone?: string,
 *     companyName?: string,
 *     address?: { street, postalCode, city, country },
 *     kvk?: string,
 *     btw?: string
 *   },
 *   redirectUrl: string
 * }
 * 
 * Response: {
 *   success: boolean,
 *   checkoutUrl?: string,
 *   paymentId?: string,
 *   error?: string
 * }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

const MOLLIE_API_URL = 'https://api.mollie.com/v2'
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY || ''
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://webstability.nl'

// BTW percentage
const VAT_RATE = 0.21

// Pakket prijzen (incl. BTW)
const PACKAGE_PRICES: Record<string, { name: string; price: number }> = {
  starter: { name: 'Starter', price: 29.00 },
  professional: { name: 'Professional', price: 49.00 },
  business: { name: 'Business', price: 79.00 },
  webshop: { name: 'Webshop', price: 99.00 }
}

interface CreatePaymentRequest {
  projectId: string
  packageType: string
  customer: {
    name: string
    email: string
    phone?: string
    companyName?: string
    address?: {
      street: string
      postalCode: string
      city: string
      country: string
    }
    kvk?: string
    btw?: string
  }
  redirectUrl: string
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
    const body = req.body as CreatePaymentRequest
    
    // Validatie
    if (!body.projectId || !body.packageType || !body.customer?.email) {
      return res.status(400).json({
        success: false,
        error: 'Verplichte velden ontbreken: projectId, packageType, customer.email'
      })
    }
    
    const pkg = PACKAGE_PRICES[body.packageType]
    if (!pkg) {
      return res.status(400).json({
        success: false,
        error: `Ongeldig pakket: ${body.packageType}`
      })
    }
    
    console.log(`[Payment] Nieuwe betaling voor project ${body.projectId}`)
    console.log(`[Payment] Pakket: ${pkg.name}, Prijs: €${pkg.price}`)
    console.log(`[Payment] Klant: ${body.customer.email}`)
    
    // Stap 1: Maak of vind Mollie klant
    const customerId = await getOrCreateCustomer(body.customer, body.projectId)
    console.log(`[Payment] Mollie klant: ${customerId}`)
    
    // Stap 2: Maak eerste betaling (voor mandate)
    const priceExclVat = Math.round((pkg.price / (1 + VAT_RATE)) * 100) / 100
    const vatAmount = Math.round((pkg.price - priceExclVat) * 100) / 100
    
    const payment = await createFirstPayment({
      customerId,
      projectId: body.projectId,
      packageType: body.packageType,
      packageName: pkg.name,
      amount: pkg.price,
      priceExclVat,
      vatAmount,
      redirectUrl: body.redirectUrl
    })
    
    console.log(`[Payment] ✅ Betaling aangemaakt: ${payment.id}`)
    console.log(`[Payment] Checkout URL: ${payment.checkoutUrl}`)
    
    return res.status(200).json({
      success: true,
      paymentId: payment.id,
      checkoutUrl: payment.checkoutUrl
    })
    
  } catch (error) {
    console.error('[Payment] Error:', error)
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Er ging iets mis bij het aanmaken van de betaling'
    })
  }
}

// ===========================================
// MOLLIE API FUNCTIONS
// ===========================================

async function getOrCreateCustomer(
  customer: CreatePaymentRequest['customer'],
  projectId: string
): Promise<string> {
  // Probeer eerst bestaande klant te vinden op email
  // In productie zou je dit in je database opslaan
  
  // Maak nieuwe klant aan
  const response = await fetch(`${MOLLIE_API_URL}/customers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MOLLIE_API_KEY}`,
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
    throw new Error(`Mollie klant error: ${error.detail || 'Onbekende fout'}`)
  }
  
  const data = await response.json()
  return data.id
}

async function createFirstPayment(data: {
  customerId: string
  projectId: string
  packageType: string
  packageName: string
  amount: number
  priceExclVat: number
  vatAmount: number
  redirectUrl: string
}): Promise<{ id: string; checkoutUrl: string }> {
  const response = await fetch(`${MOLLIE_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MOLLIE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: {
        value: data.amount.toFixed(2),
        currency: 'EUR'
      },
      description: `Webstability - ${data.packageName} (eerste maand)`,
      redirectUrl: data.redirectUrl,
      webhookUrl: `${BASE_URL}/api/mollie-webhook`,
      
      // Koppel aan klant voor automatische incasso
      customerId: data.customerId,
      sequenceType: 'first', // Dit creëert een mandate
      
      metadata: {
        projectId: data.projectId,
        packageType: data.packageType,
        type: 'first_payment',
        priceExclVat: data.priceExclVat,
        vatAmount: data.vatAmount,
        vatRate: VAT_RATE
      }
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mollie betaling error: ${error.detail || 'Onbekende fout'}`)
  }
  
  const payment = await response.json()
  
  return {
    id: payment.id,
    checkoutUrl: payment._links.checkout.href
  }
}
