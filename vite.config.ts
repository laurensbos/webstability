import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve as dnsResolve } from 'dns/promises'
import path from 'path'

// Helper: sanitize and normalize domain string
function normalizeDomain(raw: string){
  if(!raw) return ''
  let s = raw.trim().toLowerCase()
  s = s.replace(/^https?:\/\//, '')
  s = s.replace(/^www\./, '')
  s = s.split(/[/?#]/)[0]
  return s
}

// Simple label validation
function validateLabel(label: string){
  // allow a-z, 0-9 and hyphen, no leading/trailing hyphen, length 2-63
  if(!label) return false
  if(label.length < 2 || label.length > 63) return false
  if(label.startsWith('-') || label.endsWith('-')) return false
  return /^[a-z0-9-]+$/.test(label)
}

const COMMON_TLDS = ['nl','com','eu','net','shop','online','dev']
const RESERVED = new Set(['www','admin','root','mail','test','example','localhost','google'])

// Availability heuristic: deterministic pseudo-random based on string
function deterministicAvailable(seed: string){
  let h = 0
  for(let i=0;i<seed.length;i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return (Math.abs(h) % 2) === 1
}

// In-memory projects store for mock API
const PROJECTS: Array<any> = [
  {
    projectId: 'TEST123',
    businessName: 'Test Bedrijf',
    contactName: 'Jan Jansen',
    contactEmail: 'test@example.com',
    contactPhone: '0612345678',
    package: 'professional',
    status: 'review',  // In review fase voor testen van betaalflow
    statusMessage: 'Je website is klaar voor review! Bekijk de preview en geef je goedkeuring.',
    estimatedCompletion: '27 december 2025',
    createdAt: '2025-12-14T10:00:00.000Z',
    designPreviewUrl: 'https://preview.webstability.nl/test123',
    // Payment status - website gaat pas live na betaling
    paymentStatus: 'pending',  // 'pending' | 'awaiting_payment' | 'paid' | 'failed'
    paymentUrl: undefined,
    paymentCompletedAt: undefined,
    designApprovedAt: undefined,
    updates: [
      {
        date: '2025-12-14T10:00:00.000Z',
        title: 'Onboarding ontvangen',
        message: 'We hebben je gegevens ontvangen en gaan aan de slag!'
      },
      {
        date: '2025-12-15T14:00:00.000Z',
        title: 'Design concept klaar',
        message: 'Het eerste design concept is gereed voor review.'
      }
    ],
    revisionsUsed: 0,
    revisionsTotal: 3,
    messages: [],
    changeRequests: []
  }
]

// Coupons and payments (in-memory)
const COUPONS: Record<string, any> = {
  NEWYEAR30: { code: 'NEWYEAR30', discount: 0.30, expires: '2026-01-31' }
}
const PAYMENTS: Array<any> = []

// Mock content templates
const BASE_TEMPLATES: Record<string, any> = {
  general: {
    title: 'Moderne website die converteert',
    subtitle: 'Snel live, SEO-ready en mobiel geoptimaliseerd.',
    cta: 'Start nu',
  },
  restaurant: {
    title: 'Reserveer meer tafels met een aantrekkelijke website',
    subtitle: 'Menukaarten, openingstijden en online reserveren.',
    cta: 'Bekijk demo',
  },
  shop: {
    title: 'Uw catalogus, online en verkoopklaar',
    subtitle: 'Productpagina’s, betalingen en voorraadbeheer.',
    cta: 'Start webshop',
  },
  service: {
    title: 'Krijg meer klanten met een professionele site',
    subtitle: 'Duidelijke dienstpagina’s, contact en leadformulieren.',
    cta: 'Vraag offerte aan',
  },
}

// Combined mock API middleware for dev
function apiMock() {
  return {
    name: 'api-mock',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (!req.url) return next()

        // /api/check (domain mock)
        if (req.url.startsWith('/api/check')) {
          ;(async () => {
            try{
              const u = new URL(req.url, 'http://localhost')
              const raw = u.searchParams.get('domain') || ''
              const normalized = normalizeDomain(raw)

              let label = ''
              let tld = ''
              let tldProvided = false
              if(normalized){
                const parts = normalized.split('.')
                if(parts.length === 1){
                  label = parts[0]
                } else {
                  tldProvided = true
                  label = parts.slice(0, -1).join('.')
                  tld = parts[parts.length - 1]
                }
              }

              const suggestions: string[] = []
              const response: any = { domain: normalized, available: false, suggestions: [], reason: null }

              if(!label || !validateLabel(label) || RESERVED.has(label)){
                response.available = false
                response.reason = 'invalid_label'
                if(label){
                  response.suggestions = COMMON_TLDS.slice(0,3).map(t=>`${label}.${t}`)
                }
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(response))
                return
              }

              if(tldProvided && tld){
                try{
                  await dnsResolve(normalized)
                  response.available = false
                  response.reason = 'dns_exists'
                } catch (dnsErr: any){
                  if(dnsErr && dnsErr.code === 'ENOTFOUND'){
                    response.available = true
                    response.reason = 'dns_not_found'
                  } else {
                    response.available = deterministicAvailable(normalized)
                    response.reason = 'heuristic_dns_error'
                  }
                }
              } else {
                if(label.includes('vrij') || label.includes('free')){
                  response.available = true
                  response.reason = 'keyword_available'
                } else if(label.length <= 2){
                  response.available = false
                  response.reason = 'too_short'
                } else {
                  response.available = deterministicAvailable(normalized || label)
                  response.reason = 'heuristic'
                }
              }

              if(!response.available || !tldProvided){
                const prefer = ['nl','com','shop','online','dev']
                for(const t of prefer){
                  if(suggestions.length >= 4) break
                  const s = `${label}.${t}`
                  if(s !== normalized) suggestions.push(s)
                }
              }

              response.suggestions = suggestions

              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify(response))
              return
            } catch (err) {
              res.setHeader('content-type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'mock_error', message: String(err) }))
              return
            }
          })()
          return
        }

        // /api/content?industry=...
        if (req.url.startsWith('/api/content')) {
          const u = new URL(req.url, 'http://localhost')
          const industry = u.searchParams.get('industry') || 'general'
          const payload = BASE_TEMPLATES[industry] || BASE_TEMPLATES.general
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(payload))
          return
        }

        // Coupon validation
        if (req.url.startsWith('/api/coupons')){
          const u = new URL(req.url, 'http://localhost')
          const code = (u.searchParams.get('code') || '').toUpperCase()
          const found = COUPONS[code]
          if(!found){
            res.setHeader('content-type','application/json')
            res.end(JSON.stringify({ valid: false }))
            return
          }
          res.setHeader('content-type','application/json')
          res.end(JSON.stringify({ valid: true, code: found.code, discount: found.discount, expires: found.expires }))
          return
        }

        // /api/create-payment (POST) - create a mock payment session and return redirect URL
        if (req.url.startsWith('/api/create-payment') && req.method === 'POST'){
          ;(async ()=>{
            try{
              let body = ''
              for await (const chunk of req) body += chunk
              const data = JSON.parse(body || '{}')
              const id = 'pay_' + Math.random().toString(36).slice(2,9)
              const payment = { id, ...data, status: 'pending', created: Date.now() }
              PAYMENTS.push(payment)
              res.setHeader('content-type','application/json')
              res.end(JSON.stringify({ id, url: `/mock-pay/${id}` }))
              return
            }catch(e){
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'invalid' }))
              return
            }
          })()
          return
        }

        // Serve mock payment page (simple HTML)
        if(req.url.startsWith('/mock-pay/')){
          const id = req.url.split('/').pop() || ''
          const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mock betaling</title></head><body style="font-family:system-ui,Segoe UI,Roboto,-apple-system,Helvetica,Arial;color:#111;background:#f7f7fb;display:flex;align-items:center;justify-content:center;height:100vh;">\n<div style=\"max-width:420px;padding:24px;background:white;border-radius:12px;box-shadow:0 8px 30px rgba(2,6,23,0.08);text-align:center;\">\n  <h2>Mock betaling</h2>\n  <p>Betalings-id: ${id}</p>\n  <p><button id=\"ok\" style=\"padding:10px 16px;border-radius:8px;border:none;background:#6b21a8;color:white;font-weight:600\">Simuleer betaling voltooid</button></p>\n  <script>document.getElementById('ok').addEventListener('click',async()=>{await fetch('/api/mock-pay/${id}/complete',{method:'POST'}); window.opener?.postMessage({ type: 'mock-payment', id: '${id}', status: 'paid' }, '*'); window.close();})</script>\n</div></body></html>`
          res.setHeader('content-type','text/html')
          res.end(html)
          return
        }

        // Complete mock payment (POST)
        if(req.url.startsWith('/api/mock-pay/') && req.method === 'POST'){
          const parts = req.url.split('/')
          const id = parts[parts.length - 2] || parts.pop() || ''
          const p = PAYMENTS.find(x=>x.id === id)
          if(p){
            p.status = 'paid'
            // create a lightweight project reservation
            const projId = 'proj_' + Math.random().toString(36).slice(2,9)
            const project = { id: projId, title: p.title || 'Aanvraag via betaling', plan: p.plan, coupon: p.coupon, created: Date.now() }
            PROJECTS.push(project)
            res.setHeader('content-type','application/json')
            res.end(JSON.stringify({ ok: true, project }))
            return
          }
          res.statusCode = 404
          res.end(JSON.stringify({ ok: false }))
          return
        }

        // /api/onboard (POST) - create project
        if (req.url.startsWith('/api/onboard') && req.method === 'POST') {
          ;(async () => {
            try{
              let body = ''
              for await (const chunk of req) body += chunk
              const data = JSON.parse(body || '{}')
              const id = 'proj_' + Math.random().toString(36).slice(2,9)
              const project = { id, ...data, created: Date.now() }
              PROJECTS.push(project)
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ id, project }))
              return
            } catch(e){
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'invalid' }))
              return
            }
          })()
          return
        }

        // /api/projects (GET)
        if (req.url.startsWith('/api/projects') && req.method === 'GET'){
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ projects: PROJECTS }))
          return
        }

        // /api/service-request (POST) - create new service request (drone/logo) from StartProject wizard
        if (req.url.startsWith('/api/service-request') && req.method === 'POST') {
          ;(async () => {
            try {
              let body = ''
              for await (const chunk of req) body += chunk
              const data = JSON.parse(body || '{}')
              
              // Generate unique project ID with service type prefix
              const prefix = data.serviceType === 'drone' ? 'DR' : data.serviceType === 'logo' ? 'LO' : data.serviceType === 'webshop' ? 'WB' : 'SV'
              const projectId = `${prefix}-${Date.now().toString(36).toUpperCase()}`
              
              const getStatusMessage = (type: string) => {
                switch (type) {
                  case 'drone': return 'Je drone aanvraag is ontvangen. We nemen binnen 48 uur contact op.'
                  case 'logo': return 'Je logo aanvraag is ontvangen. We starten binnenkort met de concepten.'
                  case 'webshop': return 'Je webshop aanvraag is ontvangen. We nemen contact op om je project te bespreken.'
                  default: return 'Je aanvraag is ontvangen.'
                }
              }
              
              const getServiceLabel = (type: string) => {
                switch (type) {
                  case 'drone': return 'Drone'
                  case 'logo': return 'Logo'
                  case 'webshop': return 'Webshop'
                  default: return 'Service'
                }
              }
              
              const project = {
                id: projectId,
                projectId,
                serviceType: data.serviceType,
                businessName: data.businessName,
                contactName: data.contactName,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone || '',
                package: data.package,
                packageName: data.packageName,
                packagePrice: data.packagePrice,
                status: 'pending',
                statusMessage: getStatusMessage(data.serviceType),
                updates: [{
                  date: new Date().toLocaleDateString('nl-NL'),
                  title: `${getServiceLabel(data.serviceType)} aanvraag ontvangen`,
                  message: 'Je aanvraag is ontvangen en wordt verwerkt!'
                }],
                createdAt: new Date().toISOString(),
                // Service-specific data
                ...(data.serviceType === 'drone' ? {
                  locationType: data.locationType,
                  preferredDate: data.preferredDate,
                  timePreference: data.timePreference,
                  description: data.description,
                  deliverables: data.deliverables,
                } : {}),
                ...(data.serviceType === 'logo' ? {
                  style: data.style,
                  colors: data.colors,
                  businessDescription: data.businessDescription,
                  inspiration: data.inspiration,
                  deadline: data.deadline,
                } : {}),
                ...(data.serviceType === 'webshop' ? {
                  productCount: data.productCount,
                  hasProducts: data.hasProducts,
                  productCategories: data.productCategories,
                  paymentMethods: data.paymentMethods,
                  shippingOptions: data.shippingOptions,
                  webshopFeatures: data.webshopFeatures,
                  webshopStyle: data.webshopStyle,
                } : {}),
                remarks: data.remarks,
                callScheduled: data.callScheduled,
                callDate: data.callDate,
                callTime: data.callTime,
              }
              
              PROJECTS.push(project)
              
              console.log(`📝 [Mock] Nieuwe ${data.serviceType} aanvraag: ${projectId} voor ${data.businessName}`)
              console.log(`📧 [Mock] Emails zouden worden verstuurd naar: ${data.contactEmail} en info@webstability.nl`)
              
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ 
                success: true, 
                projectId,
                serviceType: data.serviceType,
                emailsSent: { admin: false, customer: false }
              }))
              return
            } catch (e) {
              console.error('Service request error:', e)
              res.statusCode = 500
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ error: 'Aanvraag mislukt', details: String(e) }))
              return
            }
          })()
          return
        }

        // /api/project-request (POST) - create new project from StartProject wizard
        if (req.url.startsWith('/api/project-request') && req.method === 'POST') {
          ;(async () => {
            try {
              let body = ''
              for await (const chunk of req) body += chunk
              const data = JSON.parse(body || '{}')
              
              // Generate unique project ID
              const projectId = 'WS-' + Date.now().toString(36).toUpperCase()
              
              // Package revision limits
              const packageRevisions: Record<string, number> = {
                starter: 2,
                professional: 3,
                business: 5,
                webshop: 3
              }
              
              const project = {
                id: projectId,
                projectId,
                businessName: data.businessName,
                contactName: data.contactName,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone || '',
                package: data.package,
                status: 'onboarding',
                statusMessage: 'Welkom! Vul de onboarding checklist in om te starten.',
                updates: [{
                  date: new Date().toLocaleDateString('nl-NL'),
                  title: 'Project aangemaakt',
                  message: 'Je aanvraag is ontvangen. Vul de onboarding in om te starten!'
                }],
                createdAt: new Date().toISOString(),
                intakeData: data.intakeData || null,
                revisionsUsed: 0,
                revisionsTotal: packageRevisions[data.package] || 2,
                messages: [],
                changeRequests: []
              }
              
              PROJECTS.push(project)
              
              console.log(`📝 [Mock] Nieuw project: ${projectId} voor ${data.businessName}`)
              console.log(`📧 [Mock] Emails zouden worden verstuurd naar: ${data.contactEmail} en info@webstability.nl`)
              
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ 
                success: true, 
                projectId,
                emailsSent: { admin: false, customer: false } // Mock - geen echte emails
              }))
              return
            } catch (e) {
              console.error('Project request error:', e)
              res.statusCode = 500
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ error: 'Aanvraag mislukt', details: String(e) }))
              return
            }
          })()
          return
        }

        // /api/project/:id (GET) - get project by ID
        if (req.url.match(/^\/api\/project\/[^/]+$/) && req.method === 'GET') {
          const projectId = req.url.split('/').pop() || ''
          const project = PROJECTS.find((p: any) => p.projectId === projectId || p.id === projectId)
          
          if (project) {
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(project))
          } else {
            res.statusCode = 404
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: 'Project niet gevonden' }))
          }
          return
        }

        // /api/verify-project (POST) - verify project credentials (mock - always succeeds with test1234)
        if (req.url.startsWith('/api/verify-project') && req.method === 'POST') {
          ;(async () => {
            try {
              let body = ''
              for await (const chunk of req) body += chunk
              const data = JSON.parse(body || '{}')
              const { projectId, password } = data
              
              if (!projectId || !password) {
                res.statusCode = 400
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify({ success: false, message: 'Project-ID en wachtwoord zijn verplicht' }))
                return
              }
              
              // For development/testing: accept "test1234" as password for any project
              if (password === 'test1234') {
                console.log(`[Mock] Project verified: ${projectId}`)
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify({ success: true, projectId }))
                return
              }
              
              res.statusCode = 401
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ success: false, message: 'Onjuist wachtwoord.' }))
              return
            } catch (e) {
              res.statusCode = 500
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ success: false, message: 'Er ging iets mis.' }))
              return
            }
          })()
          return
        }

        // /api/recover-project (POST) - lookup project IDs by email and "send" them
        if (req.url.startsWith('/api/recover-project') && req.method === 'POST') {
          ;(async () => {
            try {
              let body = ''
              for await (const chunk of req) body += chunk
              const data = JSON.parse(body || '{}')
              const email = (data.email || '').toLowerCase().trim()
              
              if (!email || !email.includes('@')) {
                res.statusCode = 400
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify({ success: false, error: 'invalid_email' }))
                return
              }

              // Find all projects matching this email
              const matchingProjects = PROJECTS.filter((p: any) => 
                (p.email || '').toLowerCase() === email ||
                (p.contact?.email || '').toLowerCase() === email
              )

              // In production, this would send an actual email
              // For mock purposes, we just log and return success
              console.log(`[Mock] Would send recovery email to ${email} with ${matchingProjects.length} project(s)`)
              if (matchingProjects.length > 0) {
                console.log('[Mock] Project IDs:', matchingProjects.map((p: any) => p.id).join(', '))
              }

              // Always return success (don't reveal if email exists for security)
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ 
                success: true, 
                message: 'Als dit e-mailadres bij ons bekend is, ontvang je binnen enkele minuten een e-mail met je project-ID(s).'
              }))
              return
            } catch (e) {
              res.statusCode = 500
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ success: false, error: 'server_error' }))
              return
            }
          })()
          return
        }

        // /api/project-feedback (POST) - design/review goedkeuring of feedback
        if (req.url.startsWith('/api/project-feedback') && req.method === 'POST') {
          ;(async () => {
            try {
              let body = ''
              for await (const chunk of req) body += chunk
              const data = JSON.parse(body || '{}')
              const { projectId, approved, feedback, type } = data
              
              console.log(`[Mock] Feedback received for ${projectId}:`, { approved, type, feedback })
              
              // Find and update project
              const project = PROJECTS.find((p: any) => p.projectId === projectId || p.id === projectId)
              if (project) {
                if (approved) {
                  project.designApprovedAt = new Date().toISOString()
                  project.paymentStatus = 'awaiting_payment'
                  console.log(`[Mock] Design approved for ${projectId} - payment required`)
                }
              }
              
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ 
                success: true,
                approved,
                designApprovedAt: approved ? new Date().toISOString() : undefined
              }))
              return
            } catch (e) {
              res.statusCode = 500
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ success: false, error: 'server_error' }))
              return
            }
          })()
          return
        }

        // /api/create-payment (POST) - mock payment creation
        if (req.url.startsWith('/api/create-payment') && req.method === 'POST') {
          ;(async () => {
            try {
              let body = ''
              for await (const chunk of req) body += chunk
              const data = JSON.parse(body || '{}')
              const { projectId, packageType } = data
              
              console.log(`[Mock] Creating payment for ${projectId}, package: ${packageType}`)
              
              // Generate mock payment ID
              const paymentId = `tr_mock_${Date.now()}`
              
              // Return mock checkout URL
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ 
                success: true,
                paymentId,
                checkoutUrl: `/api/mock-pay/${paymentId}?projectId=${projectId}`
              }))
              return
            } catch (e) {
              res.statusCode = 500
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ success: false, error: 'payment_creation_failed' }))
              return
            }
          })()
          return
        }

        // /api/marketing/search-businesses - Mock business search for marketing CRM
        if (req.url?.startsWith('/api/marketing/search-businesses') && req.method === 'GET') {
          const urlObj = new URL(req.url, 'http://localhost')
          const city = urlObj.searchParams.get('city') || 'Amsterdam'
          const type = urlObj.searchParams.get('type') || 'overig'
          const radius = urlObj.searchParams.get('radius') || '5000'
          
          console.log(`[MOCK] Business search: ${type} in ${city}, radius ${radius}m`)
          
          // Generate mock businesses
          const mockBusinesses = [
            { id: 'mock-1', name: `${type.charAt(0).toUpperCase() + type.slice(1)} De Gouden Leeuw`, type, address: 'Hoofdstraat 15', city, phone: '020-1234567', website: '', email: '', lat: 52.37, lon: 4.89 },
            { id: 'mock-2', name: `${type.charAt(0).toUpperCase() + type.slice(1)} Het Centrum`, type, address: 'Marktplein 8', city, phone: '020-7654321', website: 'www.hetcentrum.nl', email: 'info@hetcentrum.nl', lat: 52.36, lon: 4.88 },
            { id: 'mock-3', name: `Van der Berg ${type}`, type, address: 'Dorpsweg 42', city, phone: '', website: '', email: '', lat: 52.38, lon: 4.90 },
            { id: 'mock-4', name: `${city} ${type.charAt(0).toUpperCase() + type.slice(1)} Service`, type, address: 'Stationsplein 3', city, phone: '06-12345678', website: '', email: 'contact@example.nl', lat: 52.37, lon: 4.91 },
            { id: 'mock-5', name: `Jansen & Zn ${type}`, type, address: 'Industrieweg 99', city, phone: '', website: 'www.jansenzn.nl', email: '', lat: 52.35, lon: 4.87 },
          ]
          
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ 
            success: true,
            location: { query: city, lat: 52.37, lon: 4.89, radius: parseInt(radius) },
            count: mockBusinesses.length,
            businesses: mockBusinesses
          }))
          return
        }

        // /api/leads - Mock leads API for marketing CRM
        if (req.url === '/api/leads' && req.method === 'GET') {
          console.log('[MOCK] Get leads - returning empty (use localStorage)')
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ leads: [], source: 'mock' }))
          return
        }
        
        if (req.url === '/api/leads' && (req.method === 'POST' || req.method === 'PUT')) {
          let body = ''
          req.on('data', (chunk: any) => { body += chunk })
          req.on('end', () => {
            console.log('[MOCK] Save lead - stored in localStorage only')
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ success: true, message: 'Saved (mock)' }))
          })
          return
        }

        // /api/marketing/send-email - Mock email sending for marketing CRM
        if (req.url === '/api/marketing/send-email' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: any) => { body += chunk })
          req.on('end', () => {
            try {
              const { to, subject, leadId } = JSON.parse(body)
              console.log(`[MOCK] Marketing email to: ${to}`)
              console.log(`[MOCK] Subject: ${subject}`)
              console.log(`[MOCK] Lead ID: ${leadId}`)
              
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ 
                success: true, 
                message: 'Email verstuurd (mock)',
                leadId
              }))
            } catch (e) {
              res.statusCode = 400
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        // /api/contact - Contact form submission
        if (req.url === '/api/contact' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: any) => { body += chunk })
          req.on('end', () => {
            try {
              const { name, email, subject, message } = JSON.parse(body)
              console.log(`[MOCK] Contact form from: ${name} <${email}>`)
              console.log(`[MOCK] Subject: ${subject}`)
              console.log(`[MOCK] Message: ${message}`)
              
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ 
                success: true, 
                message: 'Bericht ontvangen (mock)'
              }))
            } catch (e) {
              res.statusCode = 400
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiMock()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
