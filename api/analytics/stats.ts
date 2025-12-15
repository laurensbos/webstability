import type { VercelRequest, VercelResponse } from '@vercel/node'

// Analytics stats endpoint - returns aggregated analytics data
// In production, this would query from Vercel KV or a database

interface DailyStats {
  date: string
  visitors: number
  pageviews: number
  bounceRate: number
  avgDuration: number
}

interface TrafficSource {
  source: string
  visits: number
  percent: number
}

interface TopPage {
  path: string
  title: string
  views: number
  uniqueVisitors: number
}

interface DeviceStats {
  device: string
  percent: number
  visitors: number
}

interface LocationStats {
  country: string
  countryCode: string
  visits: number
  percent: number
}

interface ConversionGoal {
  name: string
  conversions: number
  rate: number
}

interface AnalyticsResponse {
  period: string
  summary: {
    totalVisitors: number
    totalPageviews: number
    avgSessionDuration: number
    bounceRate: number
    newVisitors: number
    returningVisitors: number
    visitorChange: number
    pageviewChange: number
  }
  dailyStats: DailyStats[]
  trafficSources: TrafficSource[]
  topPages: TopPage[]
  devices: DeviceStats[]
  locations: LocationStats[]
  conversions: ConversionGoal[]
  realtime: {
    activeVisitors: number
    currentPages: { path: string; visitors: number }[]
  }
}

// Generate realistic demo data based on date range
function generateStats(period: string): AnalyticsResponse {
  const now = new Date()
  let days = 7
  
  switch (period) {
    case '30d': days = 30; break
    case '90d': days = 90; break
    case '12m': days = 365; break
    default: days = 7
  }

  // Generate daily stats with realistic patterns
  const dailyStats: DailyStats[] = []
  let totalVisitors = 0
  let totalPageviews = 0

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // More visitors on weekdays
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseVisitors = isWeekend ? 150 : 250
    
    // Add some randomness
    const visitors = Math.floor(baseVisitors + (Math.random() - 0.5) * 100)
    const pageviews = Math.floor(visitors * (2.5 + Math.random()))
    
    totalVisitors += visitors
    totalPageviews += pageviews

    dailyStats.push({
      date: date.toISOString().split('T')[0],
      visitors,
      pageviews,
      bounceRate: Math.floor(35 + Math.random() * 20),
      avgDuration: Math.floor(90 + Math.random() * 120)
    })
  }

  // Calculate previous period for comparison
  const previousTotalVisitors = Math.floor(totalVisitors * (0.85 + Math.random() * 0.2))
  const previousTotalPageviews = Math.floor(totalPageviews * (0.85 + Math.random() * 0.2))

  const visitorChange = ((totalVisitors - previousTotalVisitors) / previousTotalVisitors) * 100
  const pageviewChange = ((totalPageviews - previousTotalPageviews) / previousTotalPageviews) * 100

  // Traffic sources (realistic distribution)
  const trafficSources: TrafficSource[] = [
    { source: 'Google (organisch)', visits: Math.floor(totalVisitors * 0.42), percent: 42 },
    { source: 'Direct', visits: Math.floor(totalVisitors * 0.28), percent: 28 },
    { source: 'Social Media', visits: Math.floor(totalVisitors * 0.15), percent: 15 },
    { source: 'Referrals', visits: Math.floor(totalVisitors * 0.10), percent: 10 },
    { source: 'Email', visits: Math.floor(totalVisitors * 0.05), percent: 5 },
  ]

  // Top pages
  const topPages: TopPage[] = [
    { path: '/', title: 'Homepage', views: Math.floor(totalPageviews * 0.35), uniqueVisitors: Math.floor(totalVisitors * 0.85) },
    { path: '/websites', title: 'Websites', views: Math.floor(totalPageviews * 0.18), uniqueVisitors: Math.floor(totalVisitors * 0.45) },
    { path: '/webshop', title: 'Webshop', views: Math.floor(totalPageviews * 0.12), uniqueVisitors: Math.floor(totalVisitors * 0.32) },
    { path: '/luchtvideografie', title: 'Dronebeelden', views: Math.floor(totalPageviews * 0.10), uniqueVisitors: Math.floor(totalVisitors * 0.25) },
    { path: '/start', title: 'Project starten', views: Math.floor(totalPageviews * 0.08), uniqueVisitors: Math.floor(totalVisitors * 0.18) },
    { path: '/contact', title: 'Contact', views: Math.floor(totalPageviews * 0.06), uniqueVisitors: Math.floor(totalVisitors * 0.15) },
    { path: '/over-ons', title: 'Over ons', views: Math.floor(totalPageviews * 0.04), uniqueVisitors: Math.floor(totalVisitors * 0.10) },
    { path: '/portfolio', title: 'Portfolio', views: Math.floor(totalPageviews * 0.03), uniqueVisitors: Math.floor(totalVisitors * 0.08) },
  ]

  // Devices (mobile-first in Netherlands)
  const devices: DeviceStats[] = [
    { device: 'Mobiel', percent: 58, visitors: Math.floor(totalVisitors * 0.58) },
    { device: 'Desktop', percent: 34, visitors: Math.floor(totalVisitors * 0.34) },
    { device: 'Tablet', percent: 8, visitors: Math.floor(totalVisitors * 0.08) },
  ]

  // Locations (focused on Netherlands)
  const locations: LocationStats[] = [
    { country: 'Nederland', countryCode: 'NL', visits: Math.floor(totalVisitors * 0.87), percent: 87 },
    { country: 'België', countryCode: 'BE', visits: Math.floor(totalVisitors * 0.07), percent: 7 },
    { country: 'Duitsland', countryCode: 'DE', visits: Math.floor(totalVisitors * 0.03), percent: 3 },
    { country: 'Verenigd Koninkrijk', countryCode: 'GB', visits: Math.floor(totalVisitors * 0.02), percent: 2 },
    { country: 'Overig', countryCode: 'XX', visits: Math.floor(totalVisitors * 0.01), percent: 1 },
  ]

  // Conversions
  const conversions: ConversionGoal[] = [
    { name: 'Projectaanvraag gestart', conversions: Math.floor(totalVisitors * 0.018), rate: 1.8 },
    { name: 'Contactformulier ingevuld', conversions: Math.floor(totalVisitors * 0.012), rate: 1.2 },
    { name: 'WhatsApp geklikt', conversions: Math.floor(totalVisitors * 0.035), rate: 3.5 },
    { name: 'Prijzen bekeken', conversions: Math.floor(totalVisitors * 0.085), rate: 8.5 },
  ]

  // Real-time (simulated)
  const activeVisitors = Math.floor(1 + Math.random() * 5)
  const realtime = {
    activeVisitors,
    currentPages: [
      { path: '/', visitors: Math.ceil(activeVisitors * 0.5) },
      { path: '/websites', visitors: Math.floor(activeVisitors * 0.3) },
      { path: '/start', visitors: Math.floor(activeVisitors * 0.2) },
    ].filter(p => p.visitors > 0)
  }

  // Average session duration (in seconds)
  const avgSessionDuration = Math.floor(dailyStats.reduce((sum, d) => sum + d.avgDuration, 0) / dailyStats.length)
  
  // Average bounce rate
  const bounceRate = Math.floor(dailyStats.reduce((sum, d) => sum + d.bounceRate, 0) / dailyStats.length)

  return {
    period,
    summary: {
      totalVisitors,
      totalPageviews,
      avgSessionDuration,
      bounceRate,
      newVisitors: Math.floor(totalVisitors * 0.65),
      returningVisitors: Math.floor(totalVisitors * 0.35),
      visitorChange: Math.round(visitorChange * 10) / 10,
      pageviewChange: Math.round(pageviewChange * 10) / 10,
    },
    dailyStats,
    trafficSources,
    topPages,
    devices,
    locations,
    conversions,
    realtime
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check authorization (simple check for developer dashboard)
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const period = (req.query.period as string) || '7d'
    
    // In production, you would fetch real data from Vercel KV or database
    // For now, generate realistic demo data
    const stats = generateStats(period)

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    
    return res.status(200).json(stats)
  } catch (error) {
    console.error('Analytics stats error:', error)
    return res.status(500).json({ error: 'Failed to fetch stats' })
  }
}
