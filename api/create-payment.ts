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
 *   redirectUrl: string,
 *   discountCode?: string  // Optional discount code
 * }
 * 
 * OR (simple payment link from developer dashboard):
 * Body: {
 *   projectId: string,
 *   amount: string,
 *   description: string,
 *   customerEmail: string,
 *   customerName: string,
 *   sendEmail: boolean,
 *   packageName: string
 * }
 * 
 * Response: {
 *   success: boolean,
 *   checkoutUrl?: string,
 *   paymentId?: string,
 *   discount?: { code, type, value, savings },
 *   emailSent?: boolean,
 *   error?: string
 * }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { sendPaymentLinkEmail } from './lib/smtp.js'
import { logEmailSent } from './developer/email-log.js'

const MOLLIE_API_URL = 'https://api.mollie.com/v2'
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY || ''
// Always use production URL - VERCEL_URL contains deployment-specific URLs that shouldn't be in emails
const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'

// Redis for discount codes
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// BTW percentage
const VAT_RATE = 0.21

// Pakket prijzen (incl. BTW)
const PACKAGE_PRICES: Record<string, { name: string; price: number }> = {
  starter: { name: 'Starter', price: 29.00 },
  professional: { name: 'Professional', price: 49.00 },
  business: { name: 'Business', price: 79.00 },
  webshop: { name: 'Webshop', price: 99.00 }
}

interface DiscountCode {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description: string
  validUntil?: string
  maxUses?: number
  usedCount: number
  active: boolean
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
  discountCode?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
  
  try {
    const body = req.body
    
    // Simple flow from developer dashboard (direct amount)
    if (body.amount && body.customerEmail) {
      return handleSimplePayment(req, res, body)
    }
    
    // Full Mollie flow with packageType
    const fullBody = body as CreatePaymentRequest
    
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
    
    // Kortingscode validatie en prijsberekening
    let finalPrice = pkg.price
    let discountInfo: { code: string; type: string; value: number; savings: number } | null = null
    
    if (body.discountCode && kv) {
      const discount = await validateAndApplyDiscount(body.discountCode, pkg.price)
      if (discount) {
        finalPrice = discount.finalPrice
        discountInfo = {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          savings: discount.savings
        }
        console.log(`[Payment] Kortingscode ${discount.code} toegepast: -€${discount.savings.toFixed(2)}`)
      }
    }
    
    // Stap 1: Maak of vind Mollie klant
    const customerId = await getOrCreateCustomer(body.customer, body.projectId)
    console.log(`[Payment] Mollie klant: ${customerId}`)
    
    // Stap 2: Maak eerste betaling (voor mandate)
    const priceExclVat = Math.round((finalPrice / (1 + VAT_RATE)) * 100) / 100
    const vatAmount = Math.round((finalPrice - priceExclVat) * 100) / 100
    
    const payment = await createFirstPayment({
      customerId,
      projectId: body.projectId,
      packageType: body.packageType,
      packageName: pkg.name,
      amount: finalPrice,
      originalAmount: pkg.price,
      priceExclVat,
      vatAmount,
      redirectUrl: body.redirectUrl,
      discountCode: discountInfo?.code
    })
    
    console.log(`[Payment] ✅ Betaling aangemaakt: ${payment.id}`)
    console.log(`[Payment] Checkout URL: ${payment.checkoutUrl}`)
    
    // Update usedCount van kortingscode
    if (discountInfo && kv) {
      await incrementDiscountUsage(discountInfo.code)
    }
    
    return res.status(200).json({
      success: true,
      paymentId: payment.id,
      checkoutUrl: payment.checkoutUrl,
      discount: discountInfo
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
// SIMPLE PAYMENT (Developer Dashboard)
// ===========================================

async function handleSimplePayment(
  req: VercelRequest,
  res: VercelResponse,
  body: {
    projectId?: string
    amount: string
    description: string
    customerEmail: string
    customerName: string
    sendEmail?: boolean
    packageName?: string
    discountCode?: string
  }
) {
  try {
    const amount = parseFloat(body.amount)
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Ongeldig bedrag'
      })
    }
    
    console.log(`[Payment] Simpele betaling: €${amount}`)
    console.log(`[Payment] Klant: ${body.customerEmail}`)
    
    // Check if Mollie is configured
    if (!MOLLIE_API_KEY) {
      // Return fallback URL without Mollie
      const paymentUrl = `${BASE_URL}/betalen?amount=${amount}&project=${body.projectId || 'custom'}&desc=${encodeURIComponent(body.description)}`
      
      // Send email if requested
      let emailSent = false
      if (body.sendEmail && body.customerEmail && body.customerName) {
        try {
          await sendPaymentLinkEmail({
            email: body.customerEmail,
            name: body.customerName,
            projectId: body.projectId || 'custom',
            projectName: body.description || 'Website Project',
            amount: amount,
            paymentUrl: paymentUrl,
            packageName: body.packageName || 'Webstability Website',
            phase: 'design_approved', // Payment happens after design approval
          })
          emailSent = true
          console.log(`[Payment] ✅ Email verstuurd naar ${body.customerEmail}`)
          
          // Log email for developer dashboard
          await logEmailSent({
            projectId: body.projectId || 'custom',
            projectName: body.description || 'Website Project',
            recipientEmail: body.customerEmail,
            recipientName: body.customerName,
            type: 'payment_link',
            subject: `Betalingslink voor je website (€${amount.toFixed(2)})`,
            details: `Betalingslink verstuurd - €${amount.toFixed(2)}`,
            success: true
          })
        } catch (emailError) {
          console.error('[Payment] Email fout:', emailError)
          
          // Log failed email
          await logEmailSent({
            projectId: body.projectId || 'custom',
            projectName: body.description || 'Website Project',
            recipientEmail: body.customerEmail,
            recipientName: body.customerName,
            type: 'payment_link',
            subject: `Betalingslink voor je website (€${amount.toFixed(2)})`,
            success: false,
            error: emailError instanceof Error ? emailError.message : 'Onbekende fout'
          })
        }
      }
      
      return res.status(200).json({
        success: true,
        paymentUrl: paymentUrl,
        emailSent
      })
    }
    
    // Create Mollie payment
    const response = await fetch(`${MOLLIE_API_URL}/payments`, {
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
        description: body.description || 'Webstability Betaling',
        redirectUrl: `${BASE_URL}/betaald?project=${body.projectId || 'custom'}`,
        webhookUrl: `${BASE_URL}/api/mollie-webhook`,
        metadata: {
          projectId: body.projectId,
          type: 'simple_payment',
          customerEmail: body.customerEmail,
          customerName: body.customerName
        }
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Mollie error: ${error.detail || 'Onbekende fout'}`)
    }
    
    const payment = await response.json()
    const paymentUrl = payment._links.checkout.href
    
    console.log(`[Payment] ✅ Mollie betaling aangemaakt: ${payment.id}`)
    
    // Send email if requested
    let emailSent = false
    if (body.sendEmail && body.customerEmail && body.customerName) {
      try {
        await sendPaymentLinkEmail({
          email: body.customerEmail,
          name: body.customerName,
          projectId: body.projectId || 'custom',
          projectName: body.description || 'Website Project',
          amount: amount,
          paymentUrl: paymentUrl,
          packageName: body.packageName || 'Webstability Website',
          phase: 'design_approved', // Payment happens after design approval
        })
        emailSent = true
        console.log(`[Payment] ✅ Email verstuurd naar ${body.customerEmail}`)
        
        // Log email for developer dashboard
        await logEmailSent({
          projectId: body.projectId || 'custom',
          projectName: body.description || 'Website Project',
          recipientEmail: body.customerEmail,
          recipientName: body.customerName,
          type: 'payment_link',
          subject: `Betalingslink voor je website (€${amount.toFixed(2)})`,
          details: `Betalingslink verstuurd via Mollie - €${amount.toFixed(2)}`,
          success: true
        })
      } catch (emailError) {
        console.error('[Payment] Email fout:', emailError)
        
        // Log failed email
        await logEmailSent({
          projectId: body.projectId || 'custom',
          projectName: body.description || 'Website Project',
          recipientEmail: body.customerEmail,
          recipientName: body.customerName,
          type: 'payment_link',
          subject: `Betalingslink voor je website (€${amount.toFixed(2)})`,
          success: false,
          error: emailError instanceof Error ? emailError.message : 'Onbekende fout'
        })
      }
    }
    
    return res.status(200).json({
      success: true,
      paymentId: payment.id,
      paymentUrl: paymentUrl,
      emailSent
    })
    
  } catch (error) {
    console.error('[Payment] Simple payment error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Er ging iets mis'
    })
  }
}

// ===========================================
// DISCOUNT FUNCTIONS
// ===========================================

async function validateAndApplyDiscount(
  code: string,
  originalPrice: number
): Promise<{ code: string; type: string; value: number; finalPrice: number; savings: number } | null> {
  if (!kv) return null
  
  try {
    const discountData = await kv.get(`discount:${code.toUpperCase()}`) as DiscountCode | null
    
    if (!discountData) {
      console.log(`[Payment] Kortingscode ${code} niet gevonden`)
      return null
    }
    
    // Check of de code actief is
    if (!discountData.active) {
      console.log(`[Payment] Kortingscode ${code} is niet actief`)
      return null
    }
    
    // Check vervaldatum
    if (discountData.validUntil) {
      const validUntil = new Date(discountData.validUntil)
      if (validUntil < new Date()) {
        console.log(`[Payment] Kortingscode ${code} is verlopen`)
        return null
      }
    }
    
    // Check max uses
    if (discountData.maxUses && discountData.usedCount >= discountData.maxUses) {
      console.log(`[Payment] Kortingscode ${code} is maximaal aantal keer gebruikt`)
      return null
    }
    
    // Bereken korting
    let savings = 0
    if (discountData.type === 'percentage') {
      savings = Math.round(originalPrice * (discountData.value / 100) * 100) / 100
    } else if (discountData.type === 'fixed') {
      savings = Math.min(discountData.value, originalPrice) // Nooit meer dan de prijs
    }
    
    const finalPrice = Math.max(0, originalPrice - savings)
    
    return {
      code: discountData.code,
      type: discountData.type,
      value: discountData.value,
      finalPrice,
      savings
    }
  } catch (error) {
    console.error('[Payment] Discount validation error:', error)
    return null
  }
}

async function incrementDiscountUsage(code: string): Promise<void> {
  if (!kv) return
  
  try {
    const discountData = await kv.get(`discount:${code.toUpperCase()}`) as DiscountCode | null
    if (discountData) {
      discountData.usedCount = (discountData.usedCount || 0) + 1
      await kv.set(`discount:${code.toUpperCase()}`, discountData)
      console.log(`[Payment] Kortingscode ${code} usedCount verhoogd naar ${discountData.usedCount}`)
    }
  } catch (error) {
    console.error('[Payment] Error incrementing discount usage:', error)
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
  originalAmount?: number
  priceExclVat: number
  vatAmount: number
  redirectUrl: string
  discountCode?: string
}): Promise<{ id: string; checkoutUrl: string }> {
  // Beschrijving met korting info als van toepassing
  let description = `Webstability - ${data.packageName} (eerste maand)`
  if (data.discountCode && data.originalAmount && data.originalAmount !== data.amount) {
    const savings = data.originalAmount - data.amount
    description += ` - Korting: €${savings.toFixed(2)}`
  }
  
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
      description,
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
        vatRate: VAT_RATE,
        originalAmount: data.originalAmount,
        discountCode: data.discountCode
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
