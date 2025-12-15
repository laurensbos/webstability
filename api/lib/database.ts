/**
 * Upstash Redis Database Helper
 * 
 * Centralized database operations for Webstability
 * Uses Upstash Redis for data storage
 */

import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

// =============
// TYPES
// =============

export interface Project {
  id: string
  status: 'onboarding' | 'intake' | 'design' | 'development' | 'review' | 'live'
  type: 'website' | 'webshop' | 'drone' | 'logo'
  packageType: string
  customer: {
    name: string
    email: string
    phone?: string
    companyName?: string
  }
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentId?: string
  onboardingData?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  city: string
  status: 'nieuw' | 'gecontacteerd' | 'geinteresseerd' | 'offerte' | 'klant' | 'afgewezen'
  priority: boolean
  notes?: string
  followUpDate?: string
  emailsSent: number
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  projectId: string
  mollieId: string
  amount: number
  status: 'open' | 'pending' | 'paid' | 'failed' | 'canceled' | 'expired'
  description: string
  createdAt: string
  paidAt?: string
}

// =============
// PROJECTS
// =============

export async function getProject(id: string): Promise<Project | null> {
  return await kv.get<Project>(`project:${id}`)
}

export async function setProject(project: Project): Promise<void> {
  await kv.set(`project:${project.id}`, {
    ...project,
    updatedAt: new Date().toISOString()
  })
  // Also add to list
  await kv.sadd('projects', project.id)
}

export async function getAllProjects(): Promise<Project[]> {
  const ids = await kv.smembers('projects')
  const projects = await Promise.all(
    ids.map(id => kv.get<Project>(`project:${id}`))
  )
  return projects.filter((p): p is Project => p !== null)
}

export async function updateProjectStatus(
  id: string, 
  status: Project['status']
): Promise<void> {
  const project = await getProject(id)
  if (project) {
    await setProject({ ...project, status })
  }
}

export async function updateProjectPayment(
  id: string, 
  paymentStatus: Project['paymentStatus'],
  paymentId?: string
): Promise<void> {
  const project = await getProject(id)
  if (project) {
    await setProject({ 
      ...project, 
      paymentStatus,
      paymentId 
    })
  }
}

// =============
// LEADS (Marketing CRM)
// =============

export async function getLead(id: string): Promise<Lead | null> {
  return await kv.get<Lead>(`lead:${id}`)
}

export async function setLead(lead: Lead): Promise<void> {
  await kv.set(`lead:${lead.id}`, {
    ...lead,
    updatedAt: new Date().toISOString()
  })
  await kv.sadd('leads', lead.id)
}

export async function getAllLeads(): Promise<Lead[]> {
  const ids = await kv.smembers('leads')
  const leads = await Promise.all(
    ids.map(id => kv.get<Lead>(`lead:${id}`))
  )
  return leads.filter((l): l is Lead => l !== null)
}

export async function deleteLead(id: string): Promise<void> {
  await kv.del(`lead:${id}`)
  await kv.srem('leads', id)
}

// =============
// PAYMENTS
// =============

export async function getPayment(mollieId: string): Promise<Payment | null> {
  return await kv.get<Payment>(`payment:${mollieId}`)
}

export async function setPayment(payment: Payment): Promise<void> {
  await kv.set(`payment:${payment.mollieId}`, payment)
  await kv.sadd('payments', payment.mollieId)
  // Link to project
  await kv.set(`project:${payment.projectId}:payment`, payment.mollieId)
}

export async function updatePaymentStatus(
  mollieId: string, 
  status: Payment['status'],
  paidAt?: string
): Promise<void> {
  const payment = await getPayment(mollieId)
  if (payment) {
    await kv.set(`payment:${mollieId}`, {
      ...payment,
      status,
      paidAt
    })
  }
}

// =============
// ANALYTICS (Simple counters)
// =============

export async function incrementPageView(page: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  await kv.hincrby(`analytics:${today}`, page, 1)
  await kv.hincrby('analytics:total', page, 1)
}

export async function getPageViews(date?: string): Promise<Record<string, number>> {
  const key = date ? `analytics:${date}` : 'analytics:total'
  return await kv.hgetall(key) || {}
}

export async function incrementVisitor(): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  await kv.incr(`visitors:${today}`)
}

export async function getVisitors(date: string): Promise<number> {
  return await kv.get(`visitors:${date}`) || 0
}

// =============
// UTILITY
// =============

export async function ping(): Promise<boolean> {
  try {
    await kv.ping()
    return true
  } catch {
    return false
  }
}

export default {
  // Projects
  getProject,
  setProject,
  getAllProjects,
  updateProjectStatus,
  updateProjectPayment,
  // Leads
  getLead,
  setLead,
  getAllLeads,
  deleteLead,
  // Payments
  getPayment,
  setPayment,
  updatePaymentStatus,
  // Analytics
  incrementPageView,
  getPageViews,
  incrementVisitor,
  getVisitors,
  // Utility
  ping
}
