/**
 * Send Login Link API Endpoint
 * 
 * Stuurt een magic login link naar het opgegeven e-mailadres
 * POST /api/send-login-link
 * Body: { email: string }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash, randomBytes } from 'crypto'
import nodemailer from 'nodemailer'

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// SMTP configuratie
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM || 'Webstability <info@webstability.nl>'

const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'
const MAGIC_SECRET = process.env.MAGIC_LINK_SECRET || 'webstability-magic-link-secret-2024'

interface Project {
  id: string
  status: string
  type: string
  customer: {
    name: string
    email: string
    companyName?: string
  }
}

// Brand colors voor consistente emails
const BRAND_COLORS = {
  bgDark: '#0f172a',
  bgCard: '#1e293b',
  primary: '#10b981',
  primaryDark: '#059669',
  primaryLight: '#34d399',
  primaryBg: '#064e3b',
  textWhite: '#ffffff',
  textLight: '#f1f5f9',
  textMuted: '#94a3b8',
  border: '#334155',
  warning: '#f59e0b',
}

function generateMagicToken(): string {
  return randomBytes(32).toString('hex')
}

function hashMagicToken(token: string): string {
  return createHash('sha256').update(token + MAGIC_SECRET).digest('hex')
}

async function generateMagicLinkUrl(projectId: string): Promise<string> {
  const normalizedId = projectId.trim().toUpperCase()
  const fallbackUrl = `${BASE_URL}/project/${normalizedId}`
  
  if (!kv) return fallbackUrl
  
  try {
    const token = generateMagicToken()
    const hashedToken = hashMagicToken(token)
    
    // Store token in Redis with 24 hour expiry
    await kv.set(`magic:${hashedToken}`, {
      projectId: normalizedId,
      createdAt: Date.now()
    }, { ex: 86400 })
    
    return `${BASE_URL}/project/${normalizedId}?token=${token}`
  } catch {
    return fallbackUrl
  }
}

function getLoginLinkEmailTemplate(projects: Array<{ id: string; name: string; magicLink: string }>): string {
  const projectsList = projects.map(p => `
    <tr>
      <td style="padding: 16px; background: ${BRAND_COLORS.bgCard}; border-radius: 12px; margin-bottom: 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textWhite}; font-size: 16px; font-weight: 600;">${p.name}</p>
              <p style="margin: 0 0 12px; color: ${BRAND_COLORS.textMuted}; font-size: 13px; font-family: monospace;">${p.id}</p>
              <a href="${p.magicLink}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Bekijk project →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td style="height: 12px;"></td></tr>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Je inloglinks</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND_COLORS.bgDark}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgDark};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); border-radius: 16px 16px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: white;">🔑 Je inloglinks</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px; background-color: ${BRAND_COLORS.bgCard};">
              <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                Je hebt een inloglink aangevraagd. Hieronder vind je ${projects.length === 1 ? 'de link naar je project' : 'de links naar je projecten'}:
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                ${projectsList}
              </table>
              
              <div style="background: #422006; border: 1px solid ${BRAND_COLORS.warning}; border-radius: 10px; padding: 16px;">
                <p style="margin: 0; color: #fbbf24; font-size: 14px;">
                  <strong>⏰ Let op:</strong> Deze links zijn 24 uur geldig. Na die tijd kun je een nieuwe link aanvragen.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px; background-color: ${BRAND_COLORS.bgDark}; border-radius: 0 0 16px 16px; border-top: 1px solid ${BRAND_COLORS.border};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 15px; color: ${BRAND_COLORS.textMuted}; line-height: 1.5;">
                      Met vriendelijke groet,<br>
                      <strong style="color: ${BRAND_COLORS.textWhite};">Team Webstability</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Disclaimer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 11px; color: ${BRAND_COLORS.textMuted}; line-height: 1.5;">
                Heb je deze email niet aangevraagd? Dan kun je hem negeren.<br>
                © ${new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!kv) {
    return res.status(503).json({ error: 'Database niet geconfigureerd' })
  }

  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'E-mailadres is verplicht' 
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Get all project IDs
    const ids = await kv.smembers('projects') as string[]
    
    if (!ids || ids.length === 0) {
      // Always return success for security (don't reveal if email exists)
      return res.status(200).json({ 
        success: true, 
        message: 'Als er projecten zijn gekoppeld aan dit e-mailadres, ontvang je binnen enkele minuten een e-mail met inloglinks.'
      })
    }

    // Get all projects
    const projects = await Promise.all(
      ids.map(id => kv.get<Project>(`project:${id}`))
    )

    const validProjects = projects.filter((p): p is Project => p !== null)

    // Find projects matching email
    const matchingProjects = validProjects.filter(project => {
      const projectEmail = (project.customer?.email || '').toLowerCase()
      return projectEmail === normalizedEmail
    })

    if (matchingProjects.length === 0) {
      // Always return success for security
      return res.status(200).json({ 
        success: true, 
        message: 'Als er projecten zijn gekoppeld aan dit e-mailadres, ontvang je binnen enkele minuten een e-mail met inloglinks.'
      })
    }

    // Generate magic links for each project
    const projectsWithLinks = await Promise.all(
      matchingProjects.map(async (project) => ({
        id: project.id,
        name: project.customer?.companyName || project.customer?.name || 'Project',
        magicLink: await generateMagicLinkUrl(project.id)
      }))
    )

    // Send email with login links
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error('SMTP not configured')
      return res.status(200).json({ 
        success: true, 
        message: 'Als er projecten zijn gekoppeld aan dit e-mailadres, ontvang je binnen enkele minuten een e-mail met inloglinks.'
      })
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    const customerName = matchingProjects[0]?.customer?.name || 'daar'
    
    await transporter.sendMail({
      from: SMTP_FROM,
      to: normalizedEmail,
      subject: `🔑 Je inloglinks voor Webstability`,
      html: getLoginLinkEmailTemplate(projectsWithLinks),
    })

    console.log(`Login link email sent to ${normalizedEmail} for ${projectsWithLinks.length} project(s)`)

    return res.status(200).json({
      success: true,
      message: 'Als er projecten zijn gekoppeld aan dit e-mailadres, ontvang je binnen enkele minuten een e-mail met inloglinks.'
    })

  } catch (error) {
    console.error('Send login link error:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Er ging iets mis. Probeer het opnieuw.' 
    })
  }
}
