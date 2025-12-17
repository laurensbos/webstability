import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

type ServiceType = 'drone' | 'logo' | 'foto' | 'tekst' | 'seo'
type ServiceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

interface ServiceRequest {
  id: string
  type: ServiceType
  clientName: string
  clientEmail: string
  clientPhone: string
  projectId?: string
  description: string
  status: ServiceStatus
  price?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!kv) {
    return res.status(503).json({ success: false, message: 'Database niet geconfigureerd' })
  }

  try {
    if (req.method === 'GET') {
      // Get all service requests
      const ids = await kv.smembers('service_requests') as string[]
      
      if (!ids || ids.length === 0) {
        return res.status(200).json({ success: true, services: [] })
      }
      
      const services = await Promise.all(
        ids.map(id => kv.get<ServiceRequest>(`service:${id}`))
      )
      
      const validServices = services.filter((s): s is ServiceRequest => s !== null)
      
      // Sort by createdAt (newest first)
      validServices.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      return res.status(200).json({ success: true, services: validServices })
    }

    if (req.method === 'POST') {
      // Create new service request
      const { type, clientName, clientEmail, clientPhone, projectId, description, price } = req.body
      
      if (!type || !clientName || !clientEmail) {
        return res.status(400).json({ 
          success: false, 
          message: 'Type, naam en email zijn verplicht' 
        })
      }
      
      const id = `SRV-${Date.now()}`
      const now = new Date().toISOString()
      
      const service: ServiceRequest = {
        id,
        type,
        clientName,
        clientEmail,
        clientPhone: clientPhone || '',
        projectId,
        description: description || '',
        status: 'pending',
        price,
        createdAt: now,
        updatedAt: now,
      }
      
      await kv.set(`service:${id}`, service)
      await kv.sadd('service_requests', id)
      
      console.log(`Service request created: ${id} - ${type}`)
      
      return res.status(201).json({ success: true, service })
    }

    if (req.method === 'PUT') {
      // Update service request
      const { id, ...updates } = req.body
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'Service ID verplicht' })
      }
      
      const existing = await kv.get<ServiceRequest>(`service:${id}`)
      
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Service niet gevonden' })
      }
      
      const updated: ServiceRequest = {
        ...existing,
        ...updates,
        id: existing.id, // ID mag niet veranderen
        createdAt: existing.createdAt, // createdAt mag niet veranderen
        updatedAt: new Date().toISOString(),
      }
      
      await kv.set(`service:${id}`, updated)
      
      return res.status(200).json({ success: true, service: updated })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'Service ID verplicht' })
      }
      
      await kv.del(`service:${id}`)
      await kv.srem('service_requests', id as string)
      
      return res.status(200).json({ success: true, message: 'Service verwijderd' })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })

  } catch (error) {
    console.error('Services API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij verwerken service request',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
