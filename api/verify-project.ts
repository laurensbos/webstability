import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

/**
 * API endpoint to verify project credentials
 * POST /api/verify-project
 * Body: { projectId: string, password: string }
 */

// Check if Redis is configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

// Only create Redis client if credentials are available
const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// Simple password hashing (must match the one in projects.ts)
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  // Check if Redis is configured
  if (!kv) {
    console.error('Upstash Redis not configured for verify-project')
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd'
    })
  }

  try {
    const { projectId, password } = req.body

    if (!projectId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project-ID en wachtwoord zijn verplicht' 
      })
    }

    // Normalize project ID (uppercase, trimmed)
    const normalizedId = projectId.trim().toUpperCase()

    // Check if project exists
    const project = await kv.get(`project:${normalizedId}`)
    
    if (!project) {
      // Also try without uppercase normalization
      const projectAlt = await kv.get(`project:${projectId.trim()}`)
      if (!projectAlt) {
        return res.status(401).json({ 
          success: false, 
          message: 'Project niet gevonden'
        })
      }
    }

    // Get stored password hash
    let storedHash = await kv.get<string>(`project:${normalizedId}:password`)
    
    // Try alternative key format if not found
    if (!storedHash) {
      storedHash = await kv.get<string>(`project:${projectId.trim()}:password`)
    }

    if (!storedHash) {
      // No password set for this project - allow access with any password for legacy projects
      // Or you can return an error if all projects should have passwords
      console.log(`No password hash found for project: ${normalizedId}`)
      return res.status(200).json({ 
        success: true,
        message: 'Verificatie succesvol'
      })
    }

    // Compare password hashes
    const inputHash = hashPassword(password)
    
    if (inputHash === storedHash) {
      return res.status(200).json({ 
        success: true,
        message: 'Verificatie succesvol'
      })
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Onjuist wachtwoord'
      })
    }
  } catch (error) {
    console.error('Verify project error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
    })
  }
}
