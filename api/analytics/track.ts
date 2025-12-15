import type { VercelRequest, VercelResponse } from '@vercel/node'

// Simple analytics tracking endpoint
// Stores pageviews in Vercel KV or returns mock data for now

interface PageView {
  path: string
  referrer: string
  userAgent: string
  country?: string
  city?: string
  device: 'mobile' | 'desktop' | 'tablet'
  timestamp: string
  sessionId: string
}

// Helper to detect device type from user agent
function getDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  const ua = userAgent.toLowerCase()
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
  return 'desktop'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { path, referrer, sessionId } = req.body
    const userAgent = req.headers['user-agent'] || ''
    
    // Get geo info from Vercel headers
    const country = req.headers['x-vercel-ip-country'] as string || 'NL'
    const city = req.headers['x-vercel-ip-city'] as string || 'Unknown'

    const pageView: PageView = {
      path: path || '/',
      referrer: referrer || '',
      userAgent,
      country,
      city,
      device: getDeviceType(userAgent),
      timestamp: new Date().toISOString(),
      sessionId: sessionId || `session_${Date.now()}`
    }

    // For now, log the pageview (in production, store in KV/database)
    console.log('PageView tracked:', pageView)

    // In production, you would store this in Vercel KV:
    // import { kv } from '@vercel/kv'
    // await kv.lpush('pageviews', JSON.stringify(pageView))
    // await kv.ltrim('pageviews', 0, 99999) // Keep last 100k pageviews

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    return res.status(500).json({ error: 'Failed to track' })
  }
}
