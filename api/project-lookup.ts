/**
 * Project Lookup API Endpoint
 * 
 * Zoek projecten op basis van email of project ID
 * GET /api/project-lookup?q=email@example.com
 * GET /api/project-lookup?q=WS-ABC123
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

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
  businessName?: string
  contactName?: string
  contactEmail?: string
  createdAt: string
  updatedAt: string
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

  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  try {
    const query = (req.query.q as string || '').trim().toLowerCase()
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Zoekterm is verplicht' 
      })
    }

    // Haal alle project IDs op
    const ids = await kv.smembers('projects') as string[]
    
    if (!ids || ids.length === 0) {
      return res.status(200).json({ 
        success: false, 
        projects: [],
        message: 'Geen projecten gevonden'
      })
    }

    // Haal alle projecten op
    const projects = await Promise.all(
      ids.map(id => kv.get<Project>(`project:${id}`))
    )

    const validProjects = projects.filter((p): p is Project => p !== null)

    // Zoek op email of project ID
    const matchingProjects = validProjects.filter(project => {
      const projectId = (project.id || '').toLowerCase()
      const email = (project.customer?.email || project.contactEmail || '').toLowerCase()
      const businessName = (project.customer?.companyName || project.businessName || '').toLowerCase()
      
      // Match op exacte project ID
      if (projectId === query || projectId.includes(query)) {
        return true
      }
      
      // Match op email (exacte match of bevat)
      if (email === query || email.includes(query)) {
        return true
      }
      
      // Match op bedrijfsnaam
      if (businessName.includes(query)) {
        return true
      }
      
      return false
    })

    if (matchingProjects.length === 0) {
      return res.status(200).json({ 
        success: false, 
        projects: [],
        message: 'Geen projecten gevonden met deze gegevens'
      })
    }

    // Sorteer op datum (nieuwste eerst)
    matchingProjects.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Return projecten met beperkte info (geen gevoelige data)
    const safeProjects = matchingProjects.map(p => ({
      projectId: p.id,
      businessName: p.customer?.companyName || p.businessName || 'Onbekend',
      status: p.status,
      type: p.type,
      package: p.packageType,
      createdAt: p.createdAt
    }))

    return res.status(200).json({ 
      success: true, 
      projects: safeProjects,
      count: safeProjects.length
    })

  } catch (error) {
    console.error('Project lookup error:', error)
    return res.status(500).json({ 
      success: false,
      error: 'Er ging iets mis bij het zoeken'
    })
  }
}
