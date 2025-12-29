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
import { logEmailSent } from './developer/email-log.js'

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
  status: 'onboarding' | 'intake' | 'design' | 'feedback' | 'revisie' | 'development' | 'payment' | 'approval' | 'review' | 'live'
  phase?: string // Explicit phase for client portal
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
  googleDriveUrl?: string
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
      
      case 'DELETE':
        return await deleteProject(req, res)
      
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
  // Prefer personal name over company name for more personal emails
  const customerName = body.customer?.name || body.name || body.companyName || ''
  const customerPhone = body.customer?.phone || body.phone
  // Referral code if referred by another customer
  const referredBy = body.referredBy || null
  
  if (!body.type || !customerEmail) {
    return res.status(400).json({ 
      error: 'Verplichte velden ontbreken: type, email',
      received: { type: body.type, email: customerEmail }
    })
  }
  
  // Check if email is already in use by another project
  const normalizedEmail = customerEmail.trim().toLowerCase()
  const existingIds = await kv!.smembers('projects') as string[]
  
  if (existingIds && existingIds.length > 0) {
    const existingProjects = await Promise.all(
      existingIds.map(id => kv!.get<Project>(`project:${id}`))
    )
    
    const emailInUse = existingProjects.some(p => 
      p && (p.customer?.email || '').toLowerCase() === normalizedEmail
    )
    
    if (emailInUse) {
      return res.status(400).json({ 
        error: 'Dit e-mailadres is al in gebruik bij een ander project. Log in om je bestaande project te bekijken.',
        code: 'EMAIL_IN_USE'
      })
    }
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
      // Referral tracking
      referredBy: referredBy,
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
  
  // Process referral if present
  if (referredBy) {
    try {
      const referralResponse = await fetch(`${process.env.SITE_URL || 'https://webstability.nl'}/api/referral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim',
          code: referredBy,  // The referral code used
          projectId: project.id  // The new project claiming the referral
        })
      })
      
      if (referralResponse.ok) {
        const referralData = await referralResponse.json()
        console.log(`✅ Referral claimed: ${referredBy} → ${project.id}, discount: €${referralData.discount}`)
        
        // Update project with applied referral discount
        if (referralData.discount) {
          project.onboardingData = {
            ...project.onboardingData,
            referralDiscount: referralData.discount,
            referredBy: referredBy
          }
          await kv!.set(`project:${project.id}`, project)
        }
      } else {
        console.warn(`Referral claim failed for code ${referredBy}:`, await referralResponse.text())
      }
    } catch (referralError) {
      console.error('Referral processing error:', referralError)
      // Don't fail the request if referral processing fails
    }
  }
  
  // Create Google Drive folder for project
  let driveFolderLink: string | undefined
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_DRIVE_PARENT_FOLDER) {
    try {
      const driveResponse = await fetch(`${process.env.SITE_URL || 'https://webstability.nl'}/api/drive/create-folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          projectName: project.customer.companyName || project.customer.name || '',
          customerEmail: project.customer.email
        })
      })
      
      if (driveResponse.ok) {
        const driveData = await driveResponse.json()
        driveFolderLink = driveData.folderLink
        // Update project with Drive folder link - use googleDriveUrl field
        project.onboardingData = {
          ...project.onboardingData,
          driveFolderLink: driveData.folderLink,
          driveFolderId: driveData.folderId
        }
        // Also store as top-level googleDriveUrl for easy access
        project.googleDriveUrl = driveData.folderLink
        await kv!.set(`project:${project.id}`, project)
        console.log(`✅ Google Drive folder created: ${driveData.folderLink}`)
      } else {
        console.warn('Google Drive folder creation failed:', await driveResponse.text())
      }
    } catch (driveError) {
      console.error('Google Drive folder creation error:', driveError)
      // Don't fail the request if Drive folder creation fails
    }
  }
  
  // Send confirmation emails and email verification
  if (isSmtpConfigured()) {
    try {
      // Send welcome email to customer (no password for security - they must remember it)
      const welcomeResult = await sendWelcomeEmail({
        email: project.customer.email,
        name: project.customer.companyName || project.customer.name || 'daar',
        projectId: project.id,
        package: project.packageType,
        type: project.type,
        phase: 'onboarding', // Start phase for progress bar
        driveLink: driveFolderLink, // Include Google Drive link if created
      })
      console.log(`Welcome email sent: ${welcomeResult.success ? 'OK' : welcomeResult.error}`)
      
      // Log welcome email for developer dashboard
      await logEmailSent({
        projectId: project.id,
        projectName: project.customer.companyName || project.customer.name || 'Nieuw project',
        recipientEmail: project.customer.email,
        recipientName: project.customer.name || project.customer.companyName || '',
        type: 'welcome',
        subject: 'Welkom bij Webstability - Je project is aangemaakt',
        details: `Welkomstemail verstuurd - ${project.packageType} pakket`,
        success: welcomeResult.success,
        error: welcomeResult.error
      })
      
      // Send email verification request
      try {
        // Always use production URL for internal API calls
        const verifyResponse = await fetch(`${process.env.SITE_URL || 'https://webstability.nl'}/api/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: project.id })
        })
        if (verifyResponse.ok) {
          console.log(`Email verification request sent for project: ${project.id}`)
        }
      } catch (verifyError) {
        console.error('Email verification request failed:', verifyError)
      }
      
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
  
  // Debug: log incoming feedbackQuestions
  console.log(`[updateProject] Incoming body keys:`, Object.keys(body))
  console.log(`[updateProject] feedbackQuestions:`, body.feedbackQuestions)
  console.log(`[updateProject] customQuestions:`, body.customQuestions)
  
  if (!body.id) {
    return res.status(400).json({ error: 'Project ID is verplicht' })
  }
  
  const existing = await kv!.get<Project>(`project:${body.id}`)
  
  if (!existing) {
    return res.status(404).json({ error: 'Project niet gevonden' })
  }
  
  // Map phase to status if phase is provided (from developer dashboard)
  let status = existing.status
  let phase = body.phase || (existing as unknown as { phase?: string }).phase
  
  if (body.phase) {
    const phaseToStatusMap: Record<string, Project['status']> = {
      'onboarding': 'onboarding',
      'design': 'design',
      'development': 'development',
      'review': 'review',
      'live': 'live',
    }
    status = phaseToStatusMap[body.phase] || existing.status
    phase = body.phase
  } else if (body.status) {
    status = body.status
    // Also update phase to match status
    phase = body.status
  }
  
  // Build update object, explicitly excluding status from body spread to prevent override
  const { status: _bodyStatus, ...bodyWithoutStatus } = body
  
  const updated = {
    ...existing,
    ...bodyWithoutStatus,
    status, // Use mapped status
    phase,  // Store phase explicitly for client portal
    id: existing.id, // ID mag niet veranderen
    createdAt: existing.createdAt, // createdAt mag niet veranderen
    updatedAt: new Date().toISOString()
  }
  
  await kv!.set(`project:${updated.id}`, updated)
  
  console.log(`Project updated: ${updated.id}, status: ${updated.status}, phase: ${phase}`)
  
  return res.status(200).json({ success: true, project: updated })
}

// DELETE - Project verwijderen
async function deleteProject(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string
  
  if (!id) {
    return res.status(400).json({ error: 'Project ID is verplicht' })
  }
  
  const existing = await kv!.get<Project>(`project:${id}`)
  
  if (!existing) {
    return res.status(404).json({ error: 'Project niet gevonden' })
  }
  
  // Remove from projects set
  await kv!.srem('projects', id)
  
  // Delete the project data
  await kv!.del(`project:${id}`)
  
  // Also delete associated password if exists
  await kv!.del(`project:${id}:password`)
  
  console.log(`Project deleted: ${id}`)
  
  return res.status(200).json({ success: true, message: 'Project verwijderd' })
}
