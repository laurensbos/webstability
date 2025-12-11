import type { VercelRequest, VercelResponse } from '@vercel/node'

const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!MOLLIE_API_KEY) {
    return res.status(500).json({ error: 'Payment service not configured' })
  }

  try {
    const { id: paymentId } = req.body

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing payment ID' })
    }

    // Get payment details from Mollie
    const response = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch payment from Mollie')
      return res.status(200).end() // Always return 200 to Mollie
    }

    const payment = await response.json()

    // Log payment status change
    console.log('Mollie webhook received:', {
      paymentId: payment.id,
      status: payment.status,
      metadata: payment.metadata,
    })

    // Handle different payment statuses
    switch (payment.status) {
      case 'paid':
        // Payment successful
        // Here you could:
        // - Send confirmation email
        // - Update database
        // - Trigger next steps
        console.log('✅ Payment successful:', payment.id)
        break

      case 'failed':
      case 'canceled':
      case 'expired':
        // Payment failed
        console.log('❌ Payment failed/canceled/expired:', payment.id, payment.status)
        break

      case 'open':
      case 'pending':
        // Payment still processing
        console.log('⏳ Payment pending:', payment.id)
        break

      default:
        console.log('Unknown payment status:', payment.status)
    }

    // Always return 200 to Mollie
    return res.status(200).end()
  } catch (error) {
    console.error('Webhook error:', error)
    // Still return 200 to prevent Mollie from retrying
    return res.status(200).end()
  }
}
