/**
 * Check Email API Endpoint
 * 
 * GET /api/check-email?email=xxx - Check of email al in gebruik is
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Check if Redis is configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface Project {
  id: string
  customer: {
    email: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if Redis is configured
  if (!kv) {
    console.error('Upstash Redis not configured.')
    return res.status(503).json({ 
      error: 'Database niet geconfigureerd',
      inUse: false // Default to false to not block registration
    })
  }

  const email = req.query.email as string

  if (!email || !email.includes('@')) {
    return res.status(400).json({ 
      error: 'Geldig e-mailadres is verplicht',
      inUse: false
    })
  }

  try {
    // Get all project IDs
    const projectIds = await kv.smembers('projects') as string[]
    
    if (!projectIds || projectIds.length === 0) {
      return res.status(200).json({ 
        inUse: false,
        message: 'E-mailadres is beschikbaar'
      })
    }

    // Check each project for matching email
    const normalizedEmail = email.toLowerCase().trim()
    
    for (const projectId of projectIds) {
      const project = await kv.get<Project>(`project:${projectId}`)
      if (project && project.customer?.email?.toLowerCase().trim() === normalizedEmail) {
        console.log(`Email ${normalizedEmail} is already in use by project ${projectId}`)
        return res.status(200).json({ 
          inUse: true,
          message: 'Dit e-mailadres is al in gebruik bij een project. Gebruik je project ID om je status te bekijken of neem contact met ons op.',
          projectId: projectId // Optionally include for debugging (remove in production if needed)
        })
      }
    }

    return res.status(200).json({ 
      inUse: false,
      message: 'E-mailadres is beschikbaar'
    })

  } catch (error) {
    console.error('Check email error:', error)
    return res.status(500).json({ 
      error: 'Er ging iets mis bij het controleren',
      inUse: false // Default to false on error
    })
  }
}
