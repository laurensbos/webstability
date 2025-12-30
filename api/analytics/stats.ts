/**
 * Analytics Stats API
 * 
 * Returns visitor statistics for a project's website
 * In production, this would integrate with Plausible, GA4, or similar
 * 
 * GET /api/analytics/stats?projectId=...
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface AnalyticsData {
  visitorsToday: number
  visitorsWeek: number
  visitorsMonth: number
  pageViews: number
  topPages: Array<{ path: string; views: number }>
  topSources: Array<{ source: string; visitors: number }>
  bounceRate: number
  avgSessionDuration: number
  lastUpdated: string
}

interface Project {
  id: string
  status: string
  liveUrl?: string
  analyticsUrl?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { projectId } = req.query

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ error: 'Project ID is required' })
  }

  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  try {
    // Get project
    const project = await kv.get<Project>(`project:${projectId}`)
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' })
    }

    // Check if project is live
    if (project.status !== 'live' || !project.liveUrl) {
      return res.status(200).json({
        success: true,
        analytics: null,
        message: 'Website is nog niet live'
      })
    }

    // Try to get cached analytics
    let analytics = await kv.get<AnalyticsData>(`analytics:${projectId}`)

    // If no analytics or stale (older than 1 hour), generate/fetch new data
    const isStale = analytics && new Date(analytics.lastUpdated).getTime() < Date.now() - 60 * 60 * 1000

    if (!analytics || isStale) {
      // In production, this would call Plausible/GA4 API
      // For now, we generate realistic mock data based on project age
      
      const liveDate = project.liveUrl ? new Date() : null
      const daysLive = liveDate ? Math.max(1, Math.floor((Date.now() - liveDate.getTime()) / (1000 * 60 * 60 * 24))) : 1

      // Generate realistic stats based on days live
      const baseVisitors = Math.floor(Math.random() * 20) + 5
      const growthFactor = Math.min(daysLive / 30, 3) // Grows over first 90 days

      analytics = {
        visitorsToday: Math.floor(baseVisitors * (0.8 + Math.random() * 0.4)),
        visitorsWeek: Math.floor(baseVisitors * 7 * growthFactor * (0.9 + Math.random() * 0.2)),
        visitorsMonth: Math.floor(baseVisitors * 30 * growthFactor * (0.85 + Math.random() * 0.3)),
        pageViews: Math.floor(baseVisitors * 2.5 * 30 * growthFactor),
        topPages: [
          { path: '/', views: Math.floor(baseVisitors * 30 * 0.6) },
          { path: '/contact', views: Math.floor(baseVisitors * 30 * 0.2) },
          { path: '/over-ons', views: Math.floor(baseVisitors * 30 * 0.12) },
          { path: '/diensten', views: Math.floor(baseVisitors * 30 * 0.08) }
        ],
        topSources: [
          { source: 'Google', visitors: Math.floor(baseVisitors * 30 * 0.45) },
          { source: 'Direct', visitors: Math.floor(baseVisitors * 30 * 0.3) },
          { source: 'Social', visitors: Math.floor(baseVisitors * 30 * 0.15) },
          { source: 'Referral', visitors: Math.floor(baseVisitors * 30 * 0.1) }
        ],
        bounceRate: 35 + Math.floor(Math.random() * 20),
        avgSessionDuration: 60 + Math.floor(Math.random() * 120),
        lastUpdated: new Date().toISOString()
      }

      // Cache for 1 hour
      await kv.set(`analytics:${projectId}`, analytics, { ex: 3600 })
    }

    return res.status(200).json({
      success: true,
      analytics
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return res.status(500).json({ error: 'Er ging iets mis' })
  }
}
