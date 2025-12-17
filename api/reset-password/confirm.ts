import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

/**
 * API endpoint to confirm password reset
 * POST /api/reset-password/confirm
 * Body: { token: string, newPassword: string }
 */

// Check if Redis is configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// Simple password hashing (must match the one in projects.ts)
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

interface ResetToken {
  projectId: string
  email: string
  expiry: number
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

  if (!kv) {
    console.error('Upstash Redis not configured for reset-password/confirm')
    return res.status(503).json({ 
      success: false, 
      message: 'Database niet geconfigureerd'
    })
  }

  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token en nieuw wachtwoord zijn verplicht' 
      })
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wachtwoord moet minimaal 6 tekens bevatten'
      })
    }

    // Get reset token data
    const resetData = await kv.get<ResetToken>(`reset:${token}`)

    if (!resetData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ongeldige of verlopen reset link'
      })
    }

    // Check if token is expired
    if (Date.now() > resetData.expiry) {
      await kv.del(`reset:${token}`)
      return res.status(400).json({ 
        success: false, 
        message: 'Reset link is verlopen. Vraag een nieuwe aan.'
      })
    }

    // Update password hash
    const passwordHash = hashPassword(newPassword)
    await kv.set(`project:${resetData.projectId}:password`, passwordHash)

    // Delete used token
    await kv.del(`reset:${token}`)

    console.log(`Password reset completed for project: ${resetData.projectId}`)

    return res.status(200).json({ 
      success: true,
      message: 'Wachtwoord succesvol gewijzigd!'
    })
  } catch (error) {
    console.error('Confirm reset password error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
    })
  }
}
