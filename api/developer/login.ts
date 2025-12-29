import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

// Developer sessions (in-memory for Vercel - would need Redis/DB for production)
const developerSessions: Record<string, { expiresAt: number }> = {}

// Valid passwords - use environment variables for security
// Set these in Vercel: ADMIN_PASSWORD, DEV_PASSWORD_1, DEV_PASSWORD_2
const VALID_PASSWORDS = [
  process.env.ADMIN_PASSWORD,
  process.env.DEV_PASSWORD_1,
  process.env.DEV_PASSWORD_2,
].filter(Boolean) as string[]

// Warning if no passwords are configured
if (VALID_PASSWORDS.length === 0) {
  console.warn('[Developer Login] WARNING: No passwords configured. Set ADMIN_PASSWORD, DEV_PASSWORD_1, or DEV_PASSWORD_2 environment variables.')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ success: false, message: 'Wachtwoord is verplicht.' })
    }

    if (VALID_PASSWORDS.includes(password)) {
      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString('hex')
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours

      // Store session
      developerSessions[sessionToken] = { expiresAt }

      return res.status(200).json({
        success: true,
        token: sessionToken,
        expiresAt
      })
    }

    return res.status(401).json({ success: false, message: 'Onjuist wachtwoord.' })

  } catch (error) {
    console.error('Developer login error:', error)
    return res.status(500).json({ success: false, message: 'Er is een fout opgetreden.' })
  }
}
