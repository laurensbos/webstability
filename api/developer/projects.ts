import type { VercelRequest, VercelResponse } from '@vercel/node'

// This endpoint would normally connect to your database
// For production, use the server/app.js backend or set up a database connection

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  // Verify authorization
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ success: false, message: 'Niet ingelogd.' })
  }

  // In production, validate token against database/Redis
  // For now, we'll proxy to the Express server or return mock data

  try {
    // Proxy to Express server if running
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3001'
    
    const response = await fetch(`${serverUrl}/api/developer/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      return res.status(200).json(data)
    }

    // If server is not available, return empty array
    return res.status(200).json({ 
      success: true, 
      projects: [],
      message: 'Server niet beschikbaar. Draai de Express server voor volledige functionaliteit.'
    })

  } catch (error) {
    console.error('Get developer projects error:', error)
    return res.status(200).json({ 
      success: true, 
      projects: [],
      message: 'Kon projecten niet ophalen.'
    })
  }
}
