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
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'
import { sendWelcomeEmail, sendProjectCreatedEmail, isSmtpConfigured } from './lib/smtp.js'

// Simple password hashing (use bcrypt in production for better security)
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

// Check if Redis is configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

// Only create Redis client if credentials are available
const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

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

  // Check if Redis is configured
  if (!kv) {
    console.error('Upstash Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.')
    return res.status(503).json({ 
      error: 'Database niet geconfigureerd',
      message: 'Neem contact op met support: info@webstability.nl',
      details: 'Upstash Redis environment variables missing'
    })
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
    const project = await kv!.get<Project>(`project:${id}`)
    
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' })
    }
    
    return res.status(200).json({ project })
  }
  
  // Alle projecten ophalen
  const ids = await kv!.smembers('projects') as string[]
  
  if (!ids || ids.length === 0) {
    return res.status(200).json({ projects: [] })
  }
  
  const projects = await Promise.all(
    ids.map(id => kv!.get<Project>(`project:${id}`))
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
  
  // Support both formats: customer.email OR email at top level
  const customerEmail = body.customer?.email || body.email
  const customerName = body.customer?.name || body.companyName || ''
  const customerPhone = body.customer?.phone || body.phone
  
  if (!body.type || !customerEmail) {
    return res.status(400).json({ 
      error: 'Verplichte velden ontbreken: type, email',
      received: { type: body.type, email: customerEmail }
    })
  }
  
  const id = body.id || body.projectId || `PRJ-${Date.now()}`
  
  const project: Project = {
    id,
    status: body.status || 'onboarding',
    type: body.type,
    packageType: body.packageType || body.package || 'starter',
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      companyName: body.customer?.companyName || body.companyName,
      address: body.customer?.address,
      kvk: body.customer?.kvk,
      btw: body.customer?.btw
    },
    paymentStatus: body.paymentStatus || 'pending',
    paymentId: body.paymentId,
    onboardingData: body.onboardingData || {
      // Store all the onboarding form data
      industry: body.industry,
      currentWebsite: body.currentWebsite,
      designStyle: body.designStyle,
      colorPreferences: body.colorPreferences,
      customColor: body.customColor,
      competitors: body.competitors,
      goal: body.goal,
      targetAudience: body.targetAudience,
      uniqueFeatures: body.uniqueFeatures,
      pages: body.pages,
      extraFeatures: body.extraFeatures,
      discountCode: body.discountCode,
      discountDescription: body.discountDescription,
      discountAmount: body.discountAmount,
      finalSetupFee: body.finalSetupFee,
      finalMonthlyFee: body.finalMonthlyFee,
    },
    tasks: body.tasks || [],
    createdAt: body.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  await kv!.set(`project:${project.id}`, project)
  await kv!.sadd('projects', project.id)
  
  // Store password hash separately for security
  if (body.password) {
    const passwordHash = hashPassword(body.password)
    await kv!.set(`project:${project.id}:password`, passwordHash)
    console.log(`Password hash stored for project: ${project.id}`)
  }
  
  console.log(`Project created: ${project.id} - ${project.type}`)
  
  // Send confirmation emails
  if (isSmtpConfigured()) {
    try {
      // Send welcome email to customer
      const welcomeResult = await sendWelcomeEmail({
        email: project.customer.email,
        name: project.customer.companyName || project.customer.name || 'daar',
        projectId: project.id,
        package: project.packageType,
        type: project.type,
      })
      console.log(`Welcome email sent: ${welcomeResult.success ? 'OK' : welcomeResult.error}`)
      
      // Send notification to developer
      const notifyResult = await sendProjectCreatedEmail({
        id: project.id,
        businessName: project.customer.companyName || project.customer.name || 'Onbekend',
        email: project.customer.email,
        phone: project.customer.phone,
        package: project.packageType,
        type: project.type,
      })
      console.log(`Developer notification sent: ${notifyResult.success ? 'OK' : notifyResult.error}`)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails
    }
  } else {
    console.warn('SMTP not configured, skipping confirmation emails')
  }
  
  return res.status(201).json({ success: true, project })
}

// PUT - Project updaten
async function updateProject(req: VercelRequest, res: VercelResponse) {
  const body = req.body
  
  if (!body.id) {
    return res.status(400).json({ error: 'Project ID is verplicht' })
  }
  
  const existing = await kv!.get<Project>(`project:${body.id}`)
  
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
  
  await kv!.set(`project:${updated.id}`, updated)
  
  console.log(`Project updated: ${updated.id}`)
  
  return res.status(200).json({ success: true, project: updated })
}
