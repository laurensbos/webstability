import type { VercelRequest, VercelResponse } from '@vercel/node'

const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!MOLLIE_API_KEY) {
    console.error('MOLLIE_API_KEY not configured')
    return res.status(500).json({ error: 'Payment service not configured' })
  }

  try {
    const { amount, description, customerEmail, customerName, projectId, redirectUrl, webhookUrl } = req.body

    if (!amount || !description) {
      return res.status(400).json({ error: 'Missing required fields: amount, description' })
    }

    // Create payment via Mollie API
    const response = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: {
          currency: 'EUR',
          value: amount, // Format: "10.00"
        },
        description,
        redirectUrl: redirectUrl || 'https://webstability.nl/betaling-succes',
        webhookUrl: webhookUrl || 'https://webstability.nl/api/mollie-webhook',
        metadata: {
          projectId,
          customerEmail,
          customerName,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Mollie API error:', errorData)
      return res.status(response.status).json({ 
        error: 'Failed to create payment',
        details: errorData 
      })
    }

    const payment = await response.json()

    return res.status(200).json({
      success: true,
      paymentId: payment.id,
      paymentUrl: payment._links.checkout.href,
      status: payment.status,
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
