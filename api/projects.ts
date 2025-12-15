/**
 * Projects API Endpoint
 * 
 * CRUD operations voor projecten
 * GET /api/projects - Alle projecten ophalen
 * GET /api/projects?id=xxx - Specifiek project ophalen
 * POST /api/projects - Nieuw project aanmaken
 * PUT /api/projects - Project updaten
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

interface Project {
  id: string
  status: 'onboarding' | 'intake' | 'design' | 'development' | 'review' | 'live'
  type: 'website' | 'webshop' | 'drone' | 'logo'
  packageType: string
  customer: {
    name: string
    email: string
    phone?: string
    companyName?: string
    address?: {
      street?: string
      postalCode?: string
      city?: string
    }
    kvk?: string
    btw?: string
  }
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentId?: string
  onboardingData?: Record<string, unknown>
  tasks?: Array<{
    id: string
    title: string
    status: 'todo' | 'in-progress' | 'done'
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getProjects(req, res)
      
      case 'POST':
        return await createProject(req, res)
      
      case 'PUT':
        return await updateProject(req, res)
      
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Projects API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// GET - Projecten ophalen
async function getProjects(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string
  
  // Specifiek project ophalen
  if (id) {
    const project = await kv.get<Project>(`project:${id}`)
    
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' })
    }
    
    return res.status(200).json({ project })
  }
  
  // Alle projecten ophalen
  const ids = await kv.smembers('projects') as string[]
  
  if (!ids || ids.length === 0) {
    return res.status(200).json({ projects: [] })
  }
  
  const projects = await Promise.all(
    ids.map(id => kv.get<Project>(`project:${id}`))
  )
  
  const validProjects = projects.filter((p): p is Project => p !== null)
  
  // Sorteer op createdAt (nieuwste eerst)
  validProjects.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  return res.status(200).json({ projects: validProjects })
}

// POST - Nieuw project aanmaken
async function createProject(req: VercelRequest, res: VercelResponse) {
  const body = req.body
  
  if (!body.type || !body.customer?.email) {
    return res.status(400).json({ 
      error: 'Verplichte velden ontbreken: type, customer.email' 
    })
  }
  
  const id = body.id || `PRJ-${Date.now()}`
  
  const project: Project = {
    id,
    status: body.status || 'onboarding',
    type: body.type,
    packageType: body.packageType || 'starter',
    customer: {
      name: body.customer.name || '',
      email: body.customer.email,
      phone: body.customer.phone,
      companyName: body.customer.companyName,
      address: body.customer.address,
      kvk: body.customer.kvk,
      btw: body.customer.btw
    },
    paymentStatus: body.paymentStatus || 'pending',
    paymentId: body.paymentId,
    onboardingData: body.onboardingData,
    tasks: body.tasks || [],
    createdAt: body.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  await kv.set(`project:${project.id}`, project)
  await kv.sadd('projects', project.id)
  
  console.log(`Project created: ${project.id} - ${project.type}`)
  
  return res.status(201).json({ success: true, project })
}

// PUT - Project updaten
async function updateProject(req: VercelRequest, res: VercelResponse) {
  const body = req.body
  
  if (!body.id) {
    return res.status(400).json({ error: 'Project ID is verplicht' })
  }
  
  const existing = await kv.get<Project>(`project:${body.id}`)
  
  if (!existing) {
    return res.status(404).json({ error: 'Project niet gevonden' })
  }
  
  const updated: Project = {
    ...existing,
    ...body,
    id: existing.id, // ID mag niet veranderen
    createdAt: existing.createdAt, // createdAt mag niet veranderen
    updatedAt: new Date().toISOString()
  }
  
  await kv.set(`project:${updated.id}`, updated)
  
  console.log(`Project updated: ${updated.id}`)
  
  return res.status(200).json({ success: true, project: updated })
}
