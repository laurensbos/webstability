/**
 * Leads API Endpoint
 * 
 * CRUD operations voor Marketing CRM leads
 * GET /api/leads - Alle leads ophalen
 * POST /api/leads - Nieuwe lead toevoegen
 * PUT /api/leads - Lead updaten
 * DELETE /api/leads?id=xxx - Lead verwijderen
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Initialize Redis with error handling
let kv: Redis | null = null
try {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  
  if (url && token) {
    kv = new Redis({ url, token })
  }
} catch (e) {
  console.error('Failed to initialize Redis:', e)
}

interface Lead {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  website?: string
  address?: string
  city: string
  notes?: string
  status: 'nieuw' | 'gecontacteerd' | 'geinteresseerd' | 'offerte' | 'klant' | 'afgewezen'
  priority: boolean
  followUpDate?: string
  emailsSent: number
  emailHistory: Array<{
    id: string
    subject: string
    templateName?: string
    sentAt: string
  }>
  notesTimeline: Array<{
    id: string
    text: string
    createdAt: string
  }>
  createdAt: string
  lastContact?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Check if Redis is available
  if (!kv) {
    console.log('[Leads API] Redis not configured, returning empty leads')
    // Return empty array if Redis not available - allows frontend to work with localStorage
    if (req.method === 'GET') {
      return res.status(200).json({ leads: [], source: 'fallback' })
    }
    return res.status(200).json({ success: true, message: 'Running in offline mode' })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getLeads(res)
      
      case 'POST':
        return await createLead(req, res)
      
      case 'PUT':
        return await updateLead(req, res)
      
      case 'DELETE':
        return await deleteLead(req, res)
      
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Leads API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// GET - Alle leads ophalen
async function getLeads(res: VercelResponse) {
  if (!kv) {
    return res.status(200).json({ leads: [] })
  }
  
  const ids = await kv.smembers('leads') as string[]
  
  if (!ids || ids.length === 0) {
    return res.status(200).json({ leads: [] })
  }
  
  const leads = await Promise.all(
    ids.map(id => kv!.get<Lead>(`lead:${id}`))
  )
  
  const validLeads = leads.filter((l): l is Lead => l !== null)
  
  // Sorteer op createdAt (nieuwste eerst)
  validLeads.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  return res.status(200).json({ leads: validLeads })
}

// POST - Nieuwe lead toevoegen
async function createLead(req: VercelRequest, res: VercelResponse) {
  if (!kv) {
    return res.status(200).json({ success: true, message: 'Offline mode' })
  }
  
  const body = req.body
  
  if (!body.companyName || !body.email || !body.city) {
    return res.status(400).json({ 
      error: 'Verplichte velden ontbreken: companyName, email, city' 
    })
  }
  
  const lead: Lead = {
    id: body.id || Date.now().toString(),
    companyName: body.companyName,
    contactPerson: body.contactPerson || '',
    email: body.email,
    phone: body.phone || '',
    website: body.website,
    address: body.address,
    city: body.city,
    notes: body.notes,
    status: body.status || 'nieuw',
    priority: body.priority || false,
    followUpDate: body.followUpDate,
    emailsSent: body.emailsSent || 0,
    emailHistory: body.emailHistory || [],
    notesTimeline: body.notesTimeline || [],
    createdAt: body.createdAt || new Date().toISOString(),
    lastContact: body.lastContact
  }
  
  await kv.set(`lead:${lead.id}`, lead)
  await kv.sadd('leads', lead.id)
  
  console.log(`Lead created: ${lead.id} - ${lead.companyName}`)
  
  return res.status(201).json({ success: true, lead })
}

// PUT - Lead updaten
async function updateLead(req: VercelRequest, res: VercelResponse) {
  if (!kv) {
    return res.status(200).json({ success: true, message: 'Offline mode' })
  }
  
  const body = req.body
  
  if (!body.id) {
    return res.status(400).json({ error: 'Lead ID is verplicht' })
  }
  
  const existing = await kv.get<Lead>(`lead:${body.id}`)
  
  if (!existing) {
    return res.status(404).json({ error: 'Lead niet gevonden' })
  }
  
  const updated: Lead = {
    ...existing,
    ...body,
    id: existing.id, // ID mag niet veranderen
    createdAt: existing.createdAt // createdAt mag niet veranderen
  }
  
  await kv.set(`lead:${updated.id}`, updated)
  
  console.log(`Lead updated: ${updated.id} - ${updated.companyName}`)
  
  return res.status(200).json({ success: true, lead: updated })
}

// DELETE - Lead verwijderen
async function deleteLead(req: VercelRequest, res: VercelResponse) {
  if (!kv) {
    return res.status(200).json({ success: true, message: 'Offline mode' })
  }
  
  const id = req.query.id as string
  
  if (!id) {
    return res.status(400).json({ error: 'Lead ID is verplicht' })
  }
  
  const existing = await kv.get<Lead>(`lead:${id}`)
  
  if (!existing) {
    return res.status(404).json({ error: 'Lead niet gevonden' })
  }
  
  await kv.del(`lead:${id}`)
  await kv.srem('leads', id)
  
  console.log(`Lead deleted: ${id}`)
  
  return res.status(200).json({ success: true })
}
