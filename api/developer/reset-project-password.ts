/**
 * Developer API: Reset Project Password
 * 
 * POST /api/developer/reset-project-password
 * Body: { projectId: string, newPassword: string }
 * 
 * Protected endpoint - requires developer auth
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const DEVELOPER_PASSWORD = process.env.DEVELOPER_PASSWORD || 'dev-password-2024'

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check developer auth
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  
  if (token !== DEVELOPER_PASSWORD && token !== process.env.DEVELOPER_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  try {
    const { projectId, newPassword, removePassword } = req.body

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is verplicht' })
    }

    const normalizedId = projectId.trim().toUpperCase()
    
    // Check if project exists
    const project = await kv.get(`project:${normalizedId}`)
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' })
    }

    if (removePassword) {
      // Remove password entirely
      await kv.del(`project:${normalizedId}:password`)
      console.log(`[reset-password] Password removed for project: ${normalizedId}`)
      
      return res.status(200).json({
        success: true,
        message: 'Wachtwoord verwijderd. Gebruiker kan nu met elk wachtwoord inloggen.'
      })
    }

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'Nieuw wachtwoord moet minimaal 4 karakters zijn' })
    }

    // Hash and store new password
    const passwordHash = hashPassword(newPassword)
    await kv.set(`project:${normalizedId}:password`, passwordHash)
    
    console.log(`[reset-password] Password reset for project: ${normalizedId}`)

    return res.status(200).json({
      success: true,
      message: `Wachtwoord gereset voor project ${normalizedId}`
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ error: 'Er ging iets mis' })
  }
}
