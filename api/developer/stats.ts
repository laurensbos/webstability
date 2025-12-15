import type { VercelRequest, VercelResponse } from '@vercel/node'

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

  try {
    // Proxy to Express server if running
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3001'
    
    const response = await fetch(`${serverUrl}/api/developer/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      return res.status(200).json(data)
    }

    // Return default stats if server not available
    return res.status(200).json({ 
      success: true, 
      stats: {
        totalProjects: 0,
        activeProjects: 0,
        inReview: 0,
        pendingOnboarding: 0,
        liveProjects: 0,
        recentProjects: [],
        projectsByStatus: {
          onboarding: 0,
          design: 0,
          development: 0,
          review: 0,
          live: 0,
        },
        monthlyRevenue: 0
      }
    })

  } catch (error) {
    console.error('Get developer stats error:', error)
    return res.status(500).json({ success: false, message: 'Fout bij ophalen statistieken.' })
  }
}
