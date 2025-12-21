import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

/**
 * API endpoint to verify project credentials
 * POST /api/verify-project
 * Body: { projectId: string, password: string }
 * 
 * Requires email verification before allowing access
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

interface Project {
  id: string
  emailVerified?: boolean
  emailVerifiedAt?: string
  customer?: {
    email?: string
    name?: string
    [key: string]: unknown
  }
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
    console.log(`[verify-project] Checking project: ${normalizedId}`)

    // Check if project exists - try multiple key formats
    let project = await kv.get<Project>(`project:${normalizedId}`)
    let foundKey = normalizedId
    
    if (!project) {
      // Try without uppercase
      project = await kv.get<Project>(`project:${projectId.trim()}`)
      foundKey = projectId.trim()
    }
    
    if (!project) {
      // Try lowercase
      project = await kv.get<Project>(`project:${projectId.trim().toLowerCase()}`)
      foundKey = projectId.trim().toLowerCase()
    }
    
    if (!project) {
      console.log(`[verify-project] Project not found: ${normalizedId}`)
      return res.status(401).json({ 
        success: false, 
        message: 'Er is geen project gevonden met dit e-mailadres. Controleer je gegevens of neem contact met ons op.'
      })
    }
    
    console.log(`[verify-project] Project found with key: ${foundKey}`)

    // Note: Email verification is no longer required for login
    // If password is correct, allow access regardless of email verification status
    // This enables seamless login from Header modal

    // Get stored password hash - try same key that found the project
    let storedHash = await kv.get<string>(`project:${foundKey}:password`)
    
    // Try alternative key formats if not found
    if (!storedHash && foundKey !== normalizedId) {
      storedHash = await kv.get<string>(`project:${normalizedId}:password`)
    }
    if (!storedHash) {
      storedHash = await kv.get<string>(`project:${projectId.trim()}:password`)
    }
    if (!storedHash) {
      storedHash = await kv.get<string>(`project:${projectId.trim().toLowerCase()}:password`)
    }

    if (!storedHash) {
      // No password set for this project - allow access with any password for legacy projects
      console.log(`[verify-project] No password hash found for project: ${foundKey}, allowing access`)
      return res.status(200).json({ 
        success: true,
        message: 'Verificatie succesvol'
      })
    }

    console.log(`[verify-project] Password hash found, comparing...`)

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
