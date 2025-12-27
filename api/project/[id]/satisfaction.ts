/**
 * Satisfaction Survey API
 * 
 * POST /api/project/[id]/satisfaction
 * - Save satisfaction survey responses
 * - Track Trustpilot/Google review clicks
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

interface SatisfactionData {
  rating: number
  aspects?: string[]
  feedback?: string
  reviewPlatform?: 'trustpilot' | 'google'
  step: 'rating' | 'complete' | 'review-clicked'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id: projectId } = req.query

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ error: 'Project ID is required' })
  }

  // GET - Retrieve satisfaction data
  if (req.method === 'GET') {
    try {
      const data = await redis.hget(`project:${projectId}`, 'satisfaction')
      return res.status(200).json({ satisfaction: data || null })
    } catch (error) {
      console.error('Failed to get satisfaction data:', error)
      return res.status(500).json({ error: 'Failed to get satisfaction data' })
    }
  }

  // POST - Save satisfaction data
  if (req.method === 'POST') {
    try {
      const { rating, aspects, feedback, reviewPlatform, step } = req.body as SatisfactionData

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Valid rating (1-5) is required' })
      }

      // Get existing satisfaction data
      const existingData = await redis.hget(`project:${projectId}`, 'satisfaction') as Record<string, any> | null

      // Build satisfaction object
      const satisfactionData = {
        ...existingData,
        rating,
        aspects: aspects || existingData?.aspects || [],
        feedback: feedback || existingData?.feedback || '',
        reviewPlatform: reviewPlatform || existingData?.reviewPlatform || null,
        submittedAt: existingData?.submittedAt || new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        completedSteps: [
          ...(existingData?.completedSteps || []),
          step
        ].filter((v, i, a) => a.indexOf(v) === i) // unique
      }

      // Save to Redis
      await redis.hset(`project:${projectId}`, {
        satisfaction: JSON.stringify(satisfactionData)
      })

      // Log activity
      const activityKey = `project:${projectId}:activity`
      await redis.lpush(activityKey, JSON.stringify({
        type: 'satisfaction_survey',
        action: step === 'review-clicked' 
          ? `Klant heeft geklikt op ${reviewPlatform} review`
          : step === 'complete' 
          ? `Klant heeft feedback gegeven (${rating} sterren)`
          : `Klant heeft ${rating} sterren gegeven`,
        rating,
        reviewPlatform,
        timestamp: new Date().toISOString()
      }))

      // Trim activity log
      await redis.ltrim(activityKey, 0, 99)

      // If high rating and review clicked, mark for follow-up tracking
      if (rating >= 4 && reviewPlatform) {
        await redis.hset(`project:${projectId}`, {
          reviewRequested: JSON.stringify({
            platform: reviewPlatform,
            requestedAt: new Date().toISOString(),
            rating
          })
        })
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Satisfaction data saved',
        data: satisfactionData
      })
    } catch (error) {
      console.error('Failed to save satisfaction data:', error)
      return res.status(500).json({ error: 'Failed to save satisfaction data' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
