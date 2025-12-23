import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

interface PreLiveData {
  section: string
  projectId: string
  // Domain
  hasDomain?: boolean
  domainName?: string
  registrar?: string
  authCode?: string
  // Email
  emailPreference?: 'none' | 'new' | 'existing'
  currentEmailProvider?: string
  desiredEmails?: string
  // Legal
  hasPrivacyPolicy?: boolean
  privacyPolicyUrl?: string
  wantsPrivacyPolicyCreated?: boolean
  hasTermsConditions?: boolean
  termsConditionsUrl?: string
  wantsTermsCreated?: boolean
  wantsAnalytics?: boolean
  // Business
  kvkNumber?: string
  btwNumber?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { projectId } = req.query

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ error: 'Project ID is required' })
  }

  try {
    // GET - Fetch pre-live data
    if (req.method === 'GET') {
      const project = await redis.hgetall(`project:${projectId}`)
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Parse stored JSON fields
      const domainInfo = project.domainInfo ? JSON.parse(project.domainInfo as string) : null
      const emailInfo = project.emailInfo ? JSON.parse(project.emailInfo as string) : null
      const legalInfo = project.legalInfo ? JSON.parse(project.legalInfo as string) : null
      const businessInfo = project.businessInfo ? JSON.parse(project.businessInfo as string) : null
      const preLiveChecklist = project.preLiveChecklist ? JSON.parse(project.preLiveChecklist as string) : null

      return res.status(200).json({
        projectId,
        domainInfo,
        emailInfo,
        legalInfo,
        businessInfo,
        preLiveChecklist
      })
    }

    // POST/PUT - Update pre-live data
    if (req.method === 'POST' || req.method === 'PUT') {
      const data = req.body as PreLiveData

      // Fetch existing project
      const project = await redis.hgetall(`project:${projectId}`)
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Parse existing data
      let domainInfo = project.domainInfo ? JSON.parse(project.domainInfo as string) : {}
      let emailInfo = project.emailInfo ? JSON.parse(project.emailInfo as string) : {}
      let legalInfo = project.legalInfo ? JSON.parse(project.legalInfo as string) : {}
      let businessInfo = project.businessInfo ? JSON.parse(project.businessInfo as string) : {}
      let preLiveChecklist = project.preLiveChecklist ? JSON.parse(project.preLiveChecklist as string) : {}

      // Update based on section
      switch (data.section) {
        case 'domain':
          domainInfo = {
            ...domainInfo,
            hasDomain: data.hasDomain,
            domainName: data.domainName,
            registrar: data.registrar,
            authCode: data.authCode,
            updatedAt: new Date().toISOString()
          }
          preLiveChecklist = {
            ...preLiveChecklist,
            authCodeProvided: !!data.authCode || !data.hasDomain,
            authCodeProvidedAt: data.authCode ? new Date().toISOString() : undefined
          }
          break

        case 'email':
          emailInfo = {
            ...emailInfo,
            emailPreference: data.emailPreference,
            currentProvider: data.currentEmailProvider,
            desiredEmails: data.desiredEmails?.split(',').map(e => e.trim()).filter(Boolean),
            hasBusinessEmail: data.emailPreference !== 'none',
            wantsWebstabilityEmail: data.emailPreference === 'new',
            updatedAt: new Date().toISOString()
          }
          preLiveChecklist = {
            ...preLiveChecklist,
            emailPreferenceConfirmed: true,
            emailPreferenceConfirmedAt: new Date().toISOString()
          }
          break

        case 'legal':
          legalInfo = {
            ...legalInfo,
            hasPrivacyPolicy: data.hasPrivacyPolicy,
            privacyPolicyUrl: data.privacyPolicyUrl,
            wantsPrivacyPolicyCreated: data.wantsPrivacyPolicyCreated,
            hasTermsConditions: data.hasTermsConditions,
            termsConditionsUrl: data.termsConditionsUrl,
            wantsTermsCreated: data.wantsTermsCreated,
            wantsAnalytics: data.wantsAnalytics,
            updatedAt: new Date().toISOString()
          }
          preLiveChecklist = {
            ...preLiveChecklist,
            privacyPolicyProvided: data.hasPrivacyPolicy || data.wantsPrivacyPolicyCreated,
            termsConditionsProvided: data.hasTermsConditions || data.wantsTermsCreated || (!data.hasTermsConditions && !data.wantsTermsCreated)
          }
          break

        case 'business':
          businessInfo = {
            ...businessInfo,
            kvkNumber: data.kvkNumber,
            btwNumber: data.btwNumber,
            updatedAt: new Date().toISOString()
          }
          break

        case 'analytics':
          legalInfo = {
            ...legalInfo,
            wantsAnalytics: data.wantsAnalytics,
            updatedAt: new Date().toISOString()
          }
          preLiveChecklist = {
            ...preLiveChecklist,
            analyticsAgreed: true,
            analyticsAgreedAt: new Date().toISOString()
          }
          break
      }

      // Check if all items are complete
      const allComplete = 
        preLiveChecklist.paymentReceived &&
        (preLiveChecklist.authCodeProvided || !domainInfo.hasDomain) &&
        preLiveChecklist.privacyPolicyProvided &&
        preLiveChecklist.termsConditionsProvided &&
        preLiveChecklist.emailPreferenceConfirmed

      // Update project in Redis
      await redis.hset(`project:${projectId}`, {
        domainInfo: JSON.stringify(domainInfo),
        emailInfo: JSON.stringify(emailInfo),
        legalInfo: JSON.stringify(legalInfo),
        businessInfo: JSON.stringify(businessInfo),
        preLiveChecklist: JSON.stringify(preLiveChecklist),
        updatedAt: new Date().toISOString()
      })

      // Log activity
      const activityEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'prelive_update',
        section: data.section,
        description: `Pre-live gegevens bijgewerkt: ${data.section}`
      }
      
      const existingActivity = project.activity ? JSON.parse(project.activity as string) : []
      await redis.hset(`project:${projectId}`, {
        activity: JSON.stringify([activityEntry, ...existingActivity].slice(0, 50))
      })

      return res.status(200).json({
        success: true,
        section: data.section,
        allComplete,
        domainInfo,
        emailInfo,
        legalInfo,
        businessInfo,
        preLiveChecklist
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Pre-live data error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
