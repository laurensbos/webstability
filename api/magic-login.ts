import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash, randomBytes } from 'crypto'

/**
 * Magic Link Login API
 * 
 * POST /api/magic-login - Generate a magic link token for a project
 * GET /api/magic-login?token=xxx&projectId=xxx - Verify magic link token
 * 
 * Magic links provide 1-click login from emails without needing password
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// Always use production URL
const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'

// Magic link secret for extra security
const MAGIC_SECRET = process.env.MAGIC_LINK_SECRET || 'webstability-magic-link-secret-2024'

interface Project {
  id: string
  customer?: {
    email?: string
    name?: string
    companyName?: string
  }
  status?: string
  [key: string]: unknown
}

// Generate a secure magic token
function generateMagicToken(): string {
  return randomBytes(32).toString('hex')
}

// Hash token with secret for storage
function hashToken(token: string): string {
  return createHash('sha256').update(token + MAGIC_SECRET).digest('hex')
}

// Generate magic link URL
export function generateMagicLink(projectId: string, token: string): string {
  return `${BASE_URL}/api/magic-login?token=${token}&projectId=${projectId}`
}

// Store token and return the magic link
export async function createMagicLink(projectId: string): Promise<{ 
  success: boolean
  magicLink?: string
  error?: string 
}> {
  if (!kv) {
    return { success: false, error: 'Database niet beschikbaar' }
  }

  const normalizedId = projectId.trim().toUpperCase()
  
  // Check if project exists
  const project = await kv.get<Project>(`project:${normalizedId}`)
  if (!project) {
    return { success: false, error: 'Project niet gevonden' }
  }

  // Generate token
  const token = generateMagicToken()
  const tokenHash = hashToken(token)

  // Store token with 7 day expiry (longer for convenience)
  // Key format: magic_token:{projectId}
  await kv.set(`magic_token:${normalizedId}`, tokenHash, { ex: 604800 }) // 7 days

  const magicLink = generateMagicLink(normalizedId, token)
  
  console.log(`Magic link created for project ${normalizedId}`)
  
  return { success: true, magicLink }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!kv) {
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd' 
    })
  }

  try {
    // GET: Verify magic link token and redirect to project
    if (req.method === 'GET') {
      const { token, projectId } = req.query

      if (!token || !projectId) {
        return res.redirect(302, `${BASE_URL}/status?error=invalid_link`)
      }

      const normalizedId = (projectId as string).trim().toUpperCase()
      const tokenHash = hashToken(token as string)

      // Get stored token hash
      const storedHash = await kv.get<string>(`magic_token:${normalizedId}`)

      if (!storedHash) {
        console.log(`Magic link expired or not found for project ${normalizedId}`)
        return res.redirect(302, `${BASE_URL}/project/${normalizedId}?magic=expired`)
      }

      if (storedHash !== tokenHash) {
        console.log(`Invalid magic link token for project ${normalizedId}`)
        return res.redirect(302, `${BASE_URL}/project/${normalizedId}?magic=invalid`)
      }

      // Token is valid! Generate a short-lived session token for the redirect
      const sessionToken = randomBytes(16).toString('hex')
      const sessionHash = createHash('sha256').update(sessionToken).digest('hex')
      
      // Store session token with 5 minute expiry (just for the redirect)
      await kv.set(`magic_session:${normalizedId}:${sessionHash}`, true, { ex: 300 })

      console.log(`Magic link verified for project ${normalizedId}`)

      // Redirect to project page with session token
      return res.redirect(302, `${BASE_URL}/project/${normalizedId}?magic_session=${sessionToken}`)
    }

    // POST: Generate new magic link for a project
    if (req.method === 'POST') {
      const { projectId } = req.body

      if (!projectId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Project ID is verplicht' 
        })
      }

      const result = await createMagicLink(projectId)
      
      if (!result.success) {
        return res.status(404).json({ 
          success: false, 
          message: result.error 
        })
      }

      return res.status(200).json({
        success: true,
        magicLink: result.magicLink
      })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })

  } catch (error) {
    console.error('Magic login error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden' 
    })
  }
}
