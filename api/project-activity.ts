/**
 * Project Activity API
 * 
 * Tracks customer activity for churn prevention
 * POST /api/project-activity - Update last activity timestamp
 * GET /api/project-activity - Get activity stats and milestones
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface ProjectActivity {
  projectId: string
  lastActivityAt: string
  activityCount: number
  activities: Array<{
    type: 'login' | 'message' | 'change_request' | 'feedback' | 'page_view'
    timestamp: string
  }>
  // Milestones
  milestones: {
    oneMonth?: { reached: boolean; claimedAt?: string }
    threeMonths?: { reached: boolean; claimedAt?: string }
    sixMonths?: { reached: boolean; claimedAt?: string }
    oneYear?: { reached: boolean; claimedAt?: string }
  }
  // Satisfaction
  satisfactionScore?: number
  satisfactionSubmittedAt?: string
}

interface Project {
  id: string
  status: string
  createdAt: string
  liveDate?: string
  customer?: {
    name?: string
    email?: string
    companyName?: string
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getActivity(req, res)
      case 'POST':
        return await trackActivity(req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Project Activity API error:', error)
    return res.status(500).json({ error: 'Er ging iets mis' })
  }
}

// GET - Get activity stats and check milestones
async function getActivity(req: VercelRequest, res: VercelResponse) {
  const { projectId } = req.query
  
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ error: 'Project ID is verplicht' })
  }

  // Get project
  const project = await kv!.get<Project>(`project:${projectId}`)
  if (!project) {
    return res.status(404).json({ error: 'Project niet gevonden' })
  }

  // Get activity data
  let activity = await kv!.get<ProjectActivity>(`activity:${projectId}`)
  
  if (!activity) {
    activity = {
      projectId,
      lastActivityAt: new Date().toISOString(),
      activityCount: 0,
      activities: [],
      milestones: {}
    }
  }

  // Calculate milestones based on live date
  const liveDate = project.liveDate ? new Date(project.liveDate) : null
  const now = new Date()
  
  if (liveDate && project.status === 'live') {
    const monthsSinceLive = (now.getTime() - liveDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
    
    // Check for new milestones
    const milestoneChecks = [
      { key: 'oneMonth', months: 1 },
      { key: 'threeMonths', months: 3 },
      { key: 'sixMonths', months: 6 },
      { key: 'oneYear', months: 12 },
    ] as const

    let updated = false
    for (const check of milestoneChecks) {
      if (monthsSinceLive >= check.months && !activity.milestones[check.key]?.reached) {
        activity.milestones[check.key] = { reached: true }
        updated = true
      }
    }

    if (updated) {
      await kv!.set(`activity:${projectId}`, activity)
    }
  }

  // Calculate days since last activity
  const daysSinceActivity = Math.floor(
    (now.getTime() - new Date(activity.lastActivityAt).getTime()) / (24 * 60 * 60 * 1000)
  )

  // Check if satisfaction check should be shown (7 days after go-live, not yet submitted)
  let showSatisfactionCheck = false
  if (liveDate && project.status === 'live' && !activity.satisfactionSubmittedAt) {
    const daysSinceLive = (now.getTime() - liveDate.getTime()) / (24 * 60 * 60 * 1000)
    showSatisfactionCheck = daysSinceLive >= 7 && daysSinceLive <= 30
  }

  // Find unclaimed milestones
  const unclaimedMilestones = Object.entries(activity.milestones)
    .filter(([, value]) => value.reached && !value.claimedAt)
    .map(([key]) => key)

  return res.status(200).json({
    success: true,
    activity: {
      ...activity,
      daysSinceActivity,
      showSatisfactionCheck,
      unclaimedMilestones,
      churnRisk: daysSinceActivity > 30 ? 'high' : daysSinceActivity > 14 ? 'medium' : 'low'
    }
  })
}

// POST - Track new activity
async function trackActivity(req: VercelRequest, res: VercelResponse) {
  const { projectId, type, satisfactionScore, claimMilestone } = req.body
  
  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is verplicht' })
  }

  // Verify project exists
  const project = await kv!.get<Project>(`project:${projectId}`)
  if (!project) {
    return res.status(404).json({ error: 'Project niet gevonden' })
  }

  // Get or create activity record
  let activity = await kv!.get<ProjectActivity>(`activity:${projectId}`)
  
  if (!activity) {
    activity = {
      projectId,
      lastActivityAt: new Date().toISOString(),
      activityCount: 0,
      activities: [],
      milestones: {}
    }
  }

  const now = new Date().toISOString()

  // Handle satisfaction score submission
  if (satisfactionScore !== undefined) {
    activity.satisfactionScore = satisfactionScore
    activity.satisfactionSubmittedAt = now
    
    // If high score, could trigger Trustpilot review request
    if (satisfactionScore >= 4) {
      // Schedule review request via existing review-request API
      try {
        const baseUrl = process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'https://webstability.nl'
        
        await fetch(`${baseUrl}/api/review-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId })
        })
      } catch (e) {
        console.error('Failed to trigger review request:', e)
      }
    }
    
    await kv!.set(`activity:${projectId}`, activity)
    return res.status(200).json({ success: true, message: 'Bedankt voor je feedback!' })
  }

  // Handle milestone claim
  if (claimMilestone) {
    const validMilestones = ['oneMonth', 'threeMonths', 'sixMonths', 'oneYear'] as const
    if (validMilestones.includes(claimMilestone)) {
      const milestoneKey = claimMilestone as typeof validMilestones[number]
      if (activity.milestones[milestoneKey]?.reached && !activity.milestones[milestoneKey]?.claimedAt) {
        activity.milestones[milestoneKey] = {
          ...activity.milestones[milestoneKey],
          claimedAt: now
        }
        
        // TODO: Trigger actual reward (e.g., send email with discount code)
        console.log(`Milestone ${claimMilestone} claimed for project ${projectId}`)
      }
    }
    
    await kv!.set(`activity:${projectId}`, activity)
    return res.status(200).json({ success: true, message: 'Beloning geclaimed!' })
  }

  // Track regular activity
  const activityType = type || 'page_view'
  
  // Update activity
  activity.lastActivityAt = now
  activity.activityCount += 1
  
  // Keep last 50 activities
  activity.activities = [
    { type: activityType, timestamp: now },
    ...activity.activities.slice(0, 49)
  ]

  await kv!.set(`activity:${projectId}`, activity)

  // Also update the project's lastActivityAt
  await kv!.set(`project:${projectId}`, {
    ...project,
    lastActivityAt: now,
    updatedAt: now
  })

  return res.status(200).json({ 
    success: true, 
    lastActivityAt: now,
    activityCount: activity.activityCount
  })
}
