/**
 * Mark project as ready for design phase
 * POST /api/project/[id]/ready-for-design
 * 
 * Called by client when they have completed onboarding and uploaded all files
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  status: string
  readyForDesign?: boolean
  readyForDesignAt?: string
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const projectId = (Array.isArray(id) ? id[0] : id)?.toUpperCase()

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID required' })
  }

  if (!kv) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  try {
    // Get current project
    const project = await kv.hgetall(`project:${projectId}`) as Project | null

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    // Check if project is in onboarding phase
    if (project.status !== 'onboarding') {
      return res.status(400).json({ 
        error: 'Project is not in onboarding phase',
        currentStatus: project.status
      })
    }

    // Mark as ready for design (but don't change phase yet - developer will do that)
    const updates = {
      readyForDesign: true,
      readyForDesignAt: new Date().toISOString()
    }

    await kv.hset(`project:${projectId}`, updates)

    // Log activity
    const activityId = `activity:${projectId}:${Date.now()}`
    await kv.hset(activityId, {
      projectId,
      type: 'ready_for_design',
      message: 'Klant heeft bevestigd klaar te zijn voor design',
      timestamp: new Date().toISOString(),
      from: 'client'
    })

    // Add to project's activity list
    await kv.lpush(`project:${projectId}:activity`, activityId)

    // Send notification to developer (optional - could trigger email/slack)
    // For now, the developer portal will show this status

    return res.status(200).json({ 
      success: true, 
      message: 'Project marked as ready for design',
      readyForDesignAt: updates.readyForDesignAt
    })

  } catch (error) {
    console.error('Error marking project ready for design:', error)
    return res.status(500).json({ error: 'Failed to update project' })
  }
}
