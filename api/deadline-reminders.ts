/**
 * Deadline Reminders API Endpoint
 * 
 * Stuurt herinneringen naar klanten over naderende deadlines
 * 
 * GET /api/deadline-reminders - Check en verstuur herinneringen (voor cron)
 * POST /api/deadline-reminders - Verstuur herinnering voor specifiek project
 * 
 * Wordt aangeroepen door Vercel Cron (dagelijks om 9:00 NL tijd)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { sendDeadlineReminderEmail, isSmtpConfigured } from './lib/smtp.js'
import { logEmailSent } from './developer/email-log.js'

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
    companyName?: string
  }
  paymentStatus?: string
  googleDriveUrl?: string
  onboardingData?: {
    uploadsCompleted?: boolean
    lastReminderSent?: string
    reminderCount?: number
    [key: string]: unknown
  }
  phaseDeadlines?: {
    onboarding?: string
    design?: string
    development?: string
    review?: string
    live?: string
  }
  createdAt: string
  updatedAt: string
}

// Fase-specifieke acties die de klant moet ondernemen
const PHASE_ACTIONS: Record<string, { action: string; urgentAction: string }> = {
  onboarding: {
    action: 'je onboarding formulier in te vullen en je bestanden te uploaden naar Google Drive',
    urgentAction: 'direct je onboarding af te ronden zodat we kunnen starten'
  },
  design: {
    action: 'het design concept te bekijken en feedback te geven',
    urgentAction: 'het design te bekijken - we wachten op je goedkeuring'
  },
  review: {
    action: 'de website te testen en eventuele feedback te geven',
    urgentAction: 'de review af te ronden zodat we live kunnen gaan'
  }
}

// Check of herinnering verstuurd moet worden
function shouldSendReminder(project: Project): { 
  shouldSend: boolean
  type: 'upcoming' | 'urgent' | 'overdue' | null
  deadline: string | null
  daysUntil: number | null
} {
  const status = project.status
  
  // Alleen herinneringen voor fases waar klant actie moet ondernemen
  if (!['onboarding', 'design', 'review'].includes(status)) {
    return { shouldSend: false, type: null, deadline: null, daysUntil: null }
  }
  
  // Check of uploads al klaar zijn voor onboarding
  if (status === 'onboarding' && project.onboardingData?.uploadsCompleted) {
    return { shouldSend: false, type: null, deadline: null, daysUntil: null }
  }
  
  // Bepaal deadline
  const deadline = project.phaseDeadlines?.[status as keyof typeof project.phaseDeadlines]
  
  // Als geen deadline, gebruik createdAt + standaard dagen
  const defaultDaysPerPhase: Record<string, number> = {
    onboarding: 3,
    design: 5,
    review: 3
  }
  
  let deadlineDate: Date
  if (deadline) {
    deadlineDate = new Date(deadline)
  } else {
    deadlineDate = new Date(project.createdAt)
    deadlineDate.setDate(deadlineDate.getDate() + (defaultDaysPerPhase[status] || 3))
  }
  
  const now = new Date()
  const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  // Check of er recent een herinnering is verstuurd (max 1 per 2 dagen)
  const lastReminder = project.onboardingData?.lastReminderSent
  if (lastReminder) {
    const lastReminderDate = new Date(lastReminder)
    const daysSinceLastReminder = Math.floor((now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceLastReminder < 2) {
      return { shouldSend: false, type: null, deadline: deadlineDate.toISOString(), daysUntil }
    }
  }
  
  // Bepaal type herinnering
  if (daysUntil < 0) {
    // Overdue - maximaal 3 herinneringen
    const reminderCount = project.onboardingData?.reminderCount || 0
    if (reminderCount >= 3) {
      return { shouldSend: false, type: null, deadline: deadlineDate.toISOString(), daysUntil }
    }
    return { shouldSend: true, type: 'overdue', deadline: deadlineDate.toISOString(), daysUntil }
  } else if (daysUntil <= 1) {
    // Urgent - deadline morgen of vandaag
    return { shouldSend: true, type: 'urgent', deadline: deadlineDate.toISOString(), daysUntil }
  } else if (daysUntil <= 3) {
    // Upcoming - binnen 3 dagen
    return { shouldSend: true, type: 'upcoming', deadline: deadlineDate.toISOString(), daysUntil }
  }
  
  return { shouldSend: false, type: null, deadline: deadlineDate.toISOString(), daysUntil }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify cron secret for automated calls
  const cronSecret = req.headers['authorization']?.replace('Bearer ', '')
  const isCronCall = cronSecret === process.env.CRON_SECRET
  
  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  if (!isSmtpConfigured()) {
    return res.status(503).json({ error: 'SMTP niet geconfigureerd' })
  }

  try {
    if (req.method === 'GET') {
      // Cron job: check alle projecten en verstuur herinneringen
      return await checkAllProjects(req, res, isCronCall)
    } else if (req.method === 'POST') {
      // Handmatige herinnering voor specifiek project
      return await sendSingleReminder(req, res)
    }
    
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Deadline reminders error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Check alle projecten en verstuur herinneringen
async function checkAllProjects(_req: VercelRequest, res: VercelResponse, isCronCall: boolean) {
  const ids = await kv!.smembers('projects') as string[]
  
  if (!ids || ids.length === 0) {
    return res.status(200).json({ message: 'Geen projecten gevonden', sent: 0 })
  }
  
  const projects = await Promise.all(
    ids.map(id => kv!.get<Project>(`project:${id}`))
  )
  
  const validProjects = projects.filter((p): p is Project => p !== null)
  
  const results: { projectId: string; sent: boolean; type?: string; error?: string }[] = []
  
  for (const project of validProjects) {
    const check = shouldSendReminder(project)
    
    if (!check.shouldSend || !check.type) {
      continue
    }
    
    const phaseAction = PHASE_ACTIONS[project.status] || PHASE_ACTIONS.onboarding
    const action = check.type === 'urgent' || check.type === 'overdue' 
      ? phaseAction.urgentAction 
      : phaseAction.action
    
    try {
      const result = await sendDeadlineReminderEmail({
        email: project.customer.email,
        name: project.customer.companyName || project.customer.name || 'daar',
        projectId: project.id,
        phase: project.status as 'onboarding' | 'design' | 'development' | 'review' | 'live',
        type: project.type,
        deadline: check.deadline!,
        daysUntil: check.daysUntil!,
        reminderType: check.type,
        action,
        driveLink: project.googleDriveUrl
      })
      
      if (result.success) {
        // Update project met reminder info
        const updatedOnboardingData = {
          ...project.onboardingData,
          lastReminderSent: new Date().toISOString(),
          reminderCount: (project.onboardingData?.reminderCount || 0) + 1
        }
        
        await kv!.set(`project:${project.id}`, {
          ...project,
          onboardingData: updatedOnboardingData,
          updatedAt: new Date().toISOString()
        })
        
        // Log email
        await logEmailSent({
          projectId: project.id,
          projectName: project.customer.companyName || project.customer.name || 'Project',
          recipientEmail: project.customer.email,
          recipientName: project.customer.name || '',
          type: 'reminder',
          subject: `Herinnering: ${check.type === 'overdue' ? 'Actie vereist' : 'Deadline nadert'}`,
          details: `Deadline herinnering (${check.type}) - ${check.daysUntil} dagen`,
          success: true
        })
        
        results.push({ projectId: project.id, sent: true, type: check.type })
        console.log(`✅ Deadline reminder sent to ${project.id} (${check.type})`)
      } else {
        results.push({ projectId: project.id, sent: false, error: result.error })
      }
    } catch (error) {
      results.push({ 
        projectId: project.id, 
        sent: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }
  
  const sentCount = results.filter(r => r.sent).length
  
  console.log(`Deadline reminders check complete: ${sentCount}/${results.length} sent`)
  
  return res.status(200).json({
    message: `${sentCount} herinneringen verstuurd`,
    sent: sentCount,
    total: results.length,
    results: isCronCall ? undefined : results // Alleen details voor handmatige calls
  })
}

// Verstuur herinnering voor specifiek project
async function sendSingleReminder(req: VercelRequest, res: VercelResponse) {
  const { projectId, force } = req.body
  
  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is verplicht' })
  }
  
  const project = await kv!.get<Project>(`project:${projectId}`)
  
  if (!project) {
    return res.status(404).json({ error: 'Project niet gevonden' })
  }
  
  // Check of herinnering nodig is (tenzij force=true)
  const check = shouldSendReminder(project)
  
  if (!force && !check.shouldSend) {
    return res.status(200).json({ 
      message: 'Geen herinnering nodig',
      reason: check.daysUntil !== null 
        ? `Deadline over ${check.daysUntil} dagen` 
        : 'Project niet in juiste fase'
    })
  }
  
  const reminderType = check.type || 'upcoming'
  const phaseAction = PHASE_ACTIONS[project.status] || PHASE_ACTIONS.onboarding
  const action = reminderType === 'urgent' || reminderType === 'overdue' 
    ? phaseAction.urgentAction 
    : phaseAction.action
  
  // Bereken deadline als die er niet is
  let deadline = check.deadline
  if (!deadline) {
    const defaultDays = { onboarding: 3, design: 5, review: 3 }[project.status] || 3
    const deadlineDate = new Date(project.createdAt)
    deadlineDate.setDate(deadlineDate.getDate() + defaultDays)
    deadline = deadlineDate.toISOString()
  }
  
  const daysUntil = check.daysUntil ?? 0
  
  const result = await sendDeadlineReminderEmail({
    email: project.customer.email,
    name: project.customer.companyName || project.customer.name || 'daar',
    projectId: project.id,
    phase: project.status as 'onboarding' | 'design' | 'development' | 'review' | 'live',
    type: project.type,
    deadline,
    daysUntil,
    reminderType,
    action,
    driveLink: project.googleDriveUrl
  })
  
  if (result.success) {
    // Update project met reminder info
    const updatedOnboardingData = {
      ...project.onboardingData,
      lastReminderSent: new Date().toISOString(),
      reminderCount: (project.onboardingData?.reminderCount || 0) + 1
    }
    
    await kv!.set(`project:${project.id}`, {
      ...project,
      onboardingData: updatedOnboardingData,
      updatedAt: new Date().toISOString()
    })
    
    // Log email
    await logEmailSent({
      projectId: project.id,
      projectName: project.customer.companyName || project.customer.name || 'Project',
      recipientEmail: project.customer.email,
      recipientName: project.customer.name || '',
      type: 'reminder',
      subject: `Herinnering: ${reminderType === 'overdue' ? 'Actie vereist' : 'Deadline nadert'}`,
      details: `Deadline herinnering (${reminderType}) - handmatig verstuurd`,
      success: true
    })
    
    return res.status(200).json({ 
      success: true, 
      message: 'Herinnering verstuurd',
      type: reminderType
    })
  }
  
  return res.status(500).json({ 
    success: false, 
    error: result.error || 'Email versturen mislukt'
  })
}
