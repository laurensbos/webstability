import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * API endpoint to request password reset
 * POST /api/reset-password
 * Body: { projectId: string, email: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { projectId, email } = req.body

    if (!projectId || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project-ID en e-mailadres zijn verplicht' 
      })
    }

    // Get database URL from environment
    const dbUrl = process.env.DATABASE_URL || 'http://localhost:3001'

    // Forward request to the server
    const response = await fetch(`${dbUrl}/api/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, email })
    })

    const data = await response.json()

    if (response.ok) {
      return res.status(200).json({ 
        success: true,
        message: data.message || 'Als dit e-mailadres gekoppeld is aan dit project, ontvang je een e-mail.'
      })
    } else {
      return res.status(response.status).json({ 
        success: false, 
        message: data.message || 'Er is iets misgegaan. Probeer het opnieuw.'
      })
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
    })
  }
}
