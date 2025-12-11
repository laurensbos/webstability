import type { VercelRequest, VercelResponse } from '@vercel/node'

const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!MOLLIE_API_KEY) {
    return res.status(500).json({ error: 'Payment service not configured' })
  }

  const { paymentId } = req.query

  if (!paymentId || typeof paymentId !== 'string') {
    return res.status(400).json({ error: 'Missing paymentId parameter' })
  }

  try {
    const response = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return res.status(response.status).json({ 
        error: 'Failed to get payment status',
        details: errorData 
      })
    }

    const payment = await response.json()

    return res.status(200).json({
      success: true,
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount,
      description: payment.description,
      paidAt: payment.paidAt || null,
      metadata: payment.metadata,
    })
  } catch (error) {
    console.error('Error getting payment:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
