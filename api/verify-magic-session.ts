import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

/**
 * Verify Magic Session API
 * 
 * POST /api/verify-magic-session
 * 
 * Verifies the short-lived session token created after a magic link click
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  if (!kv) {
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd' 
    })
  }

  try {
    const { projectId, sessionToken } = req.body

    if (!projectId || !sessionToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID en session token zijn verplicht' 
      })
    }

    const normalizedId = projectId.trim().toUpperCase()
    const sessionHash = createHash('sha256').update(sessionToken).digest('hex')

    // Check if session token exists and is valid
    const isValid = await kv.get(`magic_session:${normalizedId}:${sessionHash}`)

    if (!isValid) {
      console.log(`Invalid or expired magic session for project ${normalizedId}`)
      return res.status(401).json({ 
        success: false, 
        message: 'Link is verlopen. Log in met je wachtwoord.' 
      })
    }

    // Session is valid! Delete it (one-time use)
    await kv.del(`magic_session:${normalizedId}:${sessionHash}`)

    console.log(`Magic session verified for project ${normalizedId}`)

    return res.status(200).json({
      success: true,
      projectId: normalizedId
    })

  } catch (error) {
    console.error('Verify magic session error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden' 
    })
  }
}
