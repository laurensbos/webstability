/**
 * Project Login API Endpoint
 * 
 * Login met email + wachtwoord om projecten te vinden
 * POST /api/login-project
 * Body: { email: string, password: string }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

interface Project {
  id: string
  status: string
  type: string
  packageType: string
  customer: {
    name: string
    email: string
    phone?: string
    companyName?: string
  }
  createdAt: string
  updatedAt: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'E-mailadres en wachtwoord zijn verplicht' 
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = hashPassword(password)

    // Get all project IDs
    const ids = await kv.smembers('projects') as string[]
    
    if (!ids || ids.length === 0) {
      return res.status(200).json({ 
        success: false, 
        error: 'Geen project gevonden met deze gegevens'
      })
    }

    // Get all projects
    const projects = await Promise.all(
      ids.map(id => kv.get<Project>(`project:${id}`))
    )

    const validProjects = projects.filter((p): p is Project => p !== null)

    // Find projects matching email
    const matchingProjects = validProjects.filter(project => {
      const projectEmail = (project.customer?.email || '').toLowerCase()
      return projectEmail === normalizedEmail
    })

    if (matchingProjects.length === 0) {
      return res.status(200).json({ 
        success: false, 
        error: 'Geen project gevonden met dit e-mailadres'
      })
    }

    // Check password for each matching project
    const authenticatedProjects: Array<{
      projectId: string
      businessName: string
      status: string
      type: string
      createdAt: string
    }> = []
    
    for (const project of matchingProjects) {
      const storedHash = await kv.get<string>(`project:${project.id}:password`)
      
      // If no password is set (legacy/test project), allow access
      // OR if password matches
      if (!storedHash || storedHash === passwordHash) {
        authenticatedProjects.push({
          projectId: project.id,
          businessName: project.customer?.companyName || project.customer?.name || 'Project',
          status: project.status,
          type: project.type,
          createdAt: project.createdAt
        })
      }
    }

    if (authenticatedProjects.length === 0) {
      return res.status(200).json({ 
        success: false, 
        error: 'Onjuist wachtwoord'
      })
    }

    // Sort by creation date (newest first)
    authenticatedProjects.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return res.status(200).json({
      success: true,
      projects: authenticatedProjects,
      // If only one project, also return sessionToken for auto-login
      sessionToken: authenticatedProjects.length === 1 ? 'authenticated' : undefined
    })

  } catch (error) {
    console.error('Login project error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Er ging iets mis. Probeer het opnieuw.' 
    })
  }
}
