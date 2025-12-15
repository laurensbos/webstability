import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * API endpoint to verify project credentials
 * POST /api/verify-project
 * Body: { projectId: string, password: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { projectId, password } = req.body

    if (!projectId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project-ID en wachtwoord zijn verplicht' 
      })
    }

    // Get database URL from environment
    const dbUrl = process.env.DATABASE_URL || 'http://localhost:3001'

    // Verify credentials with the server
    const response = await fetch(`${dbUrl}/api/verify-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, password })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return res.status(200).json({ 
        success: true,
        message: 'Verificatie succesvol'
      })
    } else {
      return res.status(401).json({ 
        success: false, 
        message: data.message || 'Ongeldige project-ID of wachtwoord'
      })
    }
  } catch (error) {
    console.error('Verify project error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
    })
  }
}
