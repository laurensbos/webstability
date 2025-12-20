/**
 * Email Log API for Developer Dashboard
 * 
 * GET /api/developer/email-log - Get email log for dashboard
 * POST /api/developer/email-log - Log a sent email (internal use)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

export interface EmailLogEntry {
  id: string
  timestamp: string
  projectId: string
  projectName: string
  recipientEmail: string
  recipientName: string
  type: 'phase_change' | 'upload_link' | 'design_link' | 'live_link' | 'payment_link' | 'welcome' | 'password_reset' | 'message' | 'reminder' | 'other'
  subject: string
  details?: string
  success: boolean
  error?: string
}

const EMAIL_LOG_KEY = 'email_log'
const MAX_LOG_ENTRIES = 200 // Keep last 200 emails

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getEmailLog(req, res)
      case 'POST':
        return await addEmailLog(req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('[EmailLog] API error:', error)
    return res.status(500).json({ error: 'Er ging iets mis' })
  }
}

// GET - Get email log entries
async function getEmailLog(req: VercelRequest, res: VercelResponse) {
  const { projectId, limit = '50' } = req.query
  
  // Get all log entries
  let entries = await kv!.lrange<EmailLogEntry>(EMAIL_LOG_KEY, 0, -1)
  
  if (!entries) {
    entries = []
  }

  // Filter by project if specified
  if (projectId && typeof projectId === 'string') {
    entries = entries.filter(e => e.projectId === projectId)
  }

  // Sort by timestamp descending (newest first)
  entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Limit results
  const limitNum = Math.min(parseInt(limit as string) || 50, MAX_LOG_ENTRIES)
  entries = entries.slice(0, limitNum)

  return res.status(200).json({
    success: true,
    emails: entries,
    total: entries.length
  })
}

// POST - Add email log entry
async function addEmailLog(req: VercelRequest, res: VercelResponse) {
  const { projectId, projectName, recipientEmail, recipientName, type, subject, details, success, error } = req.body

  if (!projectId || !recipientEmail || !type) {
    return res.status(400).json({ error: 'projectId, recipientEmail en type zijn verplicht' })
  }

  const entry: EmailLogEntry = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    projectId,
    projectName: projectName || 'Onbekend project',
    recipientEmail,
    recipientName: recipientName || '',
    type: type as EmailLogEntry['type'],
    subject: subject || getDefaultSubject(type),
    details,
    success: success !== false,
    error
  }

  // Add to the front of the list (newest first)
  await kv!.lpush(EMAIL_LOG_KEY, entry)

  // Trim to keep only last MAX_LOG_ENTRIES
  await kv!.ltrim(EMAIL_LOG_KEY, 0, MAX_LOG_ENTRIES - 1)

  console.log(`[EmailLog] ✅ Logged: ${type} to ${recipientEmail} for project ${projectId}`)

  return res.status(200).json({
    success: true,
    entry
  })
}

// Helper function to get default subject based on email type
function getDefaultSubject(type: EmailLogEntry['type']): string {
  const subjects: Record<EmailLogEntry['type'], string> = {
    phase_change: 'Je project gaat naar de volgende fase',
    upload_link: 'Upload link voor je bestanden',
    design_link: 'Je design preview is klaar',
    live_link: 'Je website is live!',
    payment_link: 'Betalingslink voor je website',
    welcome: 'Welkom bij Webstability',
    password_reset: 'Wachtwoord reset aangevraagd',
    message: 'Nieuw bericht van Webstability',
    reminder: 'Herinnering: Actie vereist voor je project',
    other: 'Bericht van Webstability'
  }
  return subjects[type] || subjects.other
}

// Export helper function to log emails from other API routes
export async function logEmailSent(params: {
  projectId: string
  projectName?: string
  recipientEmail: string
  recipientName?: string
  type: EmailLogEntry['type']
  subject?: string
  details?: string
  success?: boolean
  error?: string
}): Promise<void> {
  if (!kv) {
    console.warn('[EmailLog] Redis not configured, skipping email log')
    return
  }

  const entry: EmailLogEntry = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    projectId: params.projectId,
    projectName: params.projectName || 'Onbekend project',
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName || '',
    type: params.type,
    subject: params.subject || getDefaultSubject(params.type),
    details: params.details,
    success: params.success !== false,
    error: params.error
  }

  try {
    await kv.lpush(EMAIL_LOG_KEY, entry)
    await kv.ltrim(EMAIL_LOG_KEY, 0, MAX_LOG_ENTRIES - 1)
  } catch (e) {
    console.error('[EmailLog] Failed to log email:', e)
  }
}
