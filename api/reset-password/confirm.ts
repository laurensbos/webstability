import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * API endpoint to confirm password reset
 * POST /api/reset-password/confirm
 * Body: { token: string, newPassword: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token en nieuw wachtwoord zijn verplicht' 
      })
    }

    // Get database URL from environment
    const dbUrl = process.env.DATABASE_URL || 'http://localhost:3001'

    // Forward request to the server
    const response = await fetch(`${dbUrl}/api/reset-password/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return res.status(200).json({ 
        success: true,
        message: data.message || 'Wachtwoord succesvol gewijzigd!'
      })
    } else {
      return res.status(response.status).json({ 
        success: false, 
        message: data.message || 'Er is iets misgegaan. Probeer het opnieuw.'
      })
    }
  } catch (error) {
    console.error('Confirm reset password error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
    })
  }
}
