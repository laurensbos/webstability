import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve as dnsResolve } from 'dns/promises'

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
const PROJECTS: Array<any> = []

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

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiMock()],
})
