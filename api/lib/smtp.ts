/**
 * SMTP Email Library - Webstability
 * 
 * Professional email templates matching website design
 * Uses Nodemailer with Hostinger SMTP
 * 
 * Environment variables:
 * - SMTP_HOST (smtp.hostinger.com)
 * - SMTP_PORT (465 for SSL)
 * - SMTP_USER (info@webstability.nl)
 * - SMTP_PASS (email password)
 */

import nodemailer from 'nodemailer'
import { Redis } from '@upstash/redis'
import { createHash, randomBytes } from 'crypto'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM || 'Webstability <info@webstability.nl>'

// Redis for magic link storage
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

// Always use production URL
const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'
const MAGIC_SECRET = process.env.MAGIC_LINK_SECRET || 'webstability-magic-link-secret-2024'

// ===========================================
// Magic Link Generation
// ===========================================

function generateMagicToken(): string {
  return randomBytes(32).toString('hex')
}

function hashMagicToken(token: string): string {
  return createHash('sha256').update(token + MAGIC_SECRET).digest('hex')
}

/**
 * Generate a magic link for 1-click login from emails
 * Returns the full URL with token, or a fallback URL if Redis is not available
 */
export async function generateMagicLinkUrl(projectId: string): Promise<string> {
  const normalizedId = projectId.trim().toUpperCase()
  const fallbackUrl = `${BASE_URL}/project/${normalizedId}`
  
  if (!kv) {
    console.log('Redis not available, using fallback URL for magic link')
    return fallbackUrl
  }
  
  try {
    const token = generateMagicToken()
    const tokenHash = hashMagicToken(token)
    
    // Store token with 7 day expiry
    await kv.set(`magic_token:${normalizedId}`, tokenHash, { ex: 604800 })
    
    console.log(`Magic link generated for project ${normalizedId}`)
    return `${BASE_URL}/api/magic-login?token=${token}&projectId=${normalizedId}`
  } catch (error) {
    console.error('Error generating magic link:', error)
    return fallbackUrl
  }
}

export const isSmtpConfigured = (): boolean => {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)
}

const createTransporter = () => {
  if (!isSmtpConfigured()) return null
  
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

export const sendEmail = async (options: SendEmailOptions): Promise<EmailResult> => {
  const transporter = createTransporter()
  
  if (!transporter) {
    console.warn('SMTP not configured. Email not sent:', options.subject)
    return { success: false, error: 'SMTP not configured' }
  }

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, id: info.messageId }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: String(err) }
  }
}

// ===========================================
// Base Email Template - Webstability Design
// Professional dark mode styling matching website design
// ===========================================

// Consistent brand colors - using emerald/teal as primary (matching website)
const BRAND_COLORS = {
  // Dark mode backgrounds
  bgDark: '#0f172a',       // slate-900
  bgCard: '#1e293b',       // slate-800
  bgCardHover: '#334155',  // slate-700
  
  // Primary accent - emerald (consistent with website)
  primary: '#10b981',      // emerald-500
  primaryDark: '#059669',  // emerald-600
  primaryLight: '#34d399', // emerald-400
  primaryBg: '#064e3b',    // emerald-900
  
  // Text colors
  textWhite: '#ffffff',
  textLight: '#f1f5f9',    // slate-100
  textMuted: '#94a3b8',    // slate-400
  textDark: '#0f172a',     // slate-900
  
  // Accent colors for different states
  success: '#10b981',      // emerald
  warning: '#f59e0b',      // amber
  error: '#ef4444',        // red
  info: '#3b82f6',         // blue
  
  // Borders
  border: '#334155',       // slate-700
  borderLight: '#475569',  // slate-600
}

// Trustpilot stars SVG for emails (inline, email-safe) - Improved for mobile
const getTrustpilotStars = () => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
    <tr>
      ${[1,2,3,4,5].map(() => `
        <td style="padding: 0 2px;">
          <div style="width: 20px; height: 20px; background-color: #00b67a; text-align: center; line-height: 20px; border-radius: 2px;">
            <span style="color: white; font-size: 12px;">★</span>
          </div>
        </td>
      `).join('')}
    </tr>
  </table>
`

export const baseTemplate = (content: string, _accentColor: string = '#10b981') => `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <meta name="supported-color-schemes" content="dark light">
  <title>Webstability</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .button { padding: 12px 24px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND_COLORS.bgDark}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    Webstability - Professionele websites voor ondernemers
  </div>
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgDark};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 24px 32px; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); border-radius: 16px 16px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- Logo Text -->
                    <span style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">webstability</span>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <!-- Trustpilot Mini Badge -->
                    <a href="https://nl.trustpilot.com/review/webstability.nl" style="text-decoration: none;">
                      ${getTrustpilotStars()}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content Area - Dark background -->
          <tr>
            <td style="padding: 40px 32px; background-color: ${BRAND_COLORS.bgCard};">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px; background-color: ${BRAND_COLORS.bgDark}; border-radius: 0 0 16px 16px; border-top: 1px solid ${BRAND_COLORS.border};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <!-- Greeting -->
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <p style="margin: 0; font-size: 15px; color: ${BRAND_COLORS.textMuted}; line-height: 1.5;">
                      Met vriendelijke groet,<br>
                      <strong style="color: ${BRAND_COLORS.textWhite};">Team Webstability</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding-bottom: 20px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, ${BRAND_COLORS.border}, transparent);"></div>
                  </td>
                </tr>
                
                <!-- Trustpilot Section -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <a href="https://nl.trustpilot.com/review/webstability.nl" style="text-decoration: none; display: inline-block;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding-bottom: 6px;">
                            <span style="color: ${BRAND_COLORS.textMuted}; font-size: 13px;">Beoordeeld met</span>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-bottom: 6px;">
                            ${getTrustpilotStars()}
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <span style="color: ${BRAND_COLORS.textMuted}; font-size: 13px;">op Trustpilot</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
                
                <!-- Contact Links - Stacked vertically for mobile -->
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding-bottom: 8px;">
                          <a href="https://webstability.nl" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none; font-size: 14px; font-weight: 500;">🌐 webstability.nl</a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom: 8px;">
                          <a href="mailto:info@webstability.nl" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none; font-size: 14px; font-weight: 500;">✉️ info@webstability.nl</a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <a href="tel:+31644712573" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none; font-size: 14px; font-weight: 500;">📞 06-44712573</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Legal -->
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 11px; color: ${BRAND_COLORS.textMuted};">
                      KvK: 91186307 • BTW: NL004875371B72
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Bottom Disclaimer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 24px 16px;">
              <p style="margin: 0; font-size: 11px; color: ${BRAND_COLORS.textMuted}; line-height: 1.5;">
                Je ontvangt deze email omdat je een aanvraag hebt gedaan bij Webstability.<br>
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

// ===========================================
// Email Templates - Professional Webstability Design
// ===========================================

// All service types now use consistent emerald branding
const getServiceColor = (_type?: string) => ({
  primary: BRAND_COLORS.primary,
  gradient: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%)`
})

// ===========================================
// Progress Bar Component for Emails - Dark Mode
// ===========================================

type ProjectPhase = 'onboarding' | 'design' | 'design_approved' | 'development' | 'review' | 'live'

const PHASE_CONFIG: { key: ProjectPhase; label: string; emoji: string }[] = [
  { key: 'onboarding', label: 'Onboarding', emoji: '📝' },
  { key: 'design', label: 'Design', emoji: '🎨' },
  { key: 'design_approved', label: 'Goedgekeurd', emoji: '✅' },
  { key: 'development', label: 'Ontwikkeling', emoji: '💻' },
  { key: 'review', label: 'Review', emoji: '🔍' },
  { key: 'live', label: 'Live', emoji: '🚀' },
]

const getProgressBar = (currentPhase: ProjectPhase, _accentColor: string = '#10b981'): string => {
  const currentIndex = PHASE_CONFIG.findIndex(p => p.key === currentPhase)
  
  // Generate the step circles with connecting lines - mobile optimized, dark mode
  const steps = PHASE_CONFIG.map((phase, index) => {
    const isCompleted = index < currentIndex
    const isCurrent = index === currentIndex
    
    // Dark mode colors
    const circleColor = isCompleted || isCurrent ? BRAND_COLORS.primary : BRAND_COLORS.border
    const textColor = isCompleted || isCurrent ? BRAND_COLORS.textLight : BRAND_COLORS.textMuted
    const checkmark = isCompleted ? '✓' : phase.emoji
    
    // Shorter labels for mobile
    const shortLabel = phase.label.length > 8 ? phase.label.slice(0, 7) + '.' : phase.label
    
    return `
      <td style="text-align: center; vertical-align: top; width: ${100 / PHASE_CONFIG.length}%; padding: 0 2px;">
        <div style="
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          background: ${isCurrent ? BRAND_COLORS.primary : isCompleted ? BRAND_COLORS.primaryBg : BRAND_COLORS.bgDark}; 
          border: 2px solid ${circleColor};
          color: ${isCurrent ? '#ffffff' : isCompleted ? BRAND_COLORS.primaryLight : BRAND_COLORS.textMuted}; 
          font-size: 12px; 
          font-weight: 700; 
          line-height: 28px; 
          margin: 0 auto 6px;
          ${isCurrent ? 'box-shadow: 0 0 0 3px ' + BRAND_COLORS.primary + '40;' : ''}
        ">
          ${checkmark}
        </div>
        <p style="margin: 0; font-size: 9px; color: ${textColor}; font-weight: ${isCurrent ? '700' : '500'}; line-height: 1.2;">
          ${shortLabel}
        </p>
      </td>
    `
  }).join('')

  // Create the connecting line behind the circles
  const progressPercentage = Math.round((currentIndex / (PHASE_CONFIG.length - 1)) * 100)
  
  return `
    <!-- Progress Bar Section - Dark Mode -->
    <div style="background: ${BRAND_COLORS.bgDark}; border-radius: 12px; padding: 16px 8px; margin-bottom: 24px; border: 1px solid ${BRAND_COLORS.border};">
      <p style="margin: 0 0 12px; font-size: 11px; font-weight: 600; color: ${BRAND_COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">
        📍 Voortgang (${currentIndex + 1}/${PHASE_CONFIG.length})
      </p>
      
      <!-- Progress line background -->
      <div style="position: relative; padding: 0 16px;">
        <div style="position: absolute; top: 16px; left: 32px; right: 32px; height: 2px; background: ${BRAND_COLORS.border}; border-radius: 2px;">
          <div style="width: ${progressPercentage}%; height: 100%; background: ${BRAND_COLORS.primary}; border-radius: 2px;"></div>
        </div>
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="position: relative;">
          <tr>
            ${steps}
          </tr>
        </table>
      </div>
    </div>
  `
}

// ===========================================
// Magic Link Button Component for Emails  
// ===========================================

/**
 * Generate a prominent magic link button for 1-click login - Dark mode
 */
const getMagicLinkButton = (magicLink: string, buttonText: string = 'Bekijk je project →', _accentColor: string = '#10b981'): string => {
  return `
    <!-- Magic Link Button - 1-Click Login -->
    <div style="text-align: center; margin: 24px 0;">
      <a href="${magicLink}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); color: #ffffff; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px ${BRAND_COLORS.primary}40;">
        ${buttonText}
      </a>
      <p style="margin: 12px 0 0; font-size: 12px; color: ${BRAND_COLORS.textMuted};">
        🔐 1-klik login — geen wachtwoord nodig
      </p>
    </div>
  `
}

// Developer notification - New project
export const sendProjectCreatedEmail = async (project: {
  id: string
  businessName: string
  email: string
  phone?: string
  package: string
  type?: string
}) => {
  const colors = getServiceColor(project.type)
  const serviceLabel = {
    website: 'Website',
    webshop: 'Webshop', 
    drone: 'Drone opnames',
    logo: 'Logo ontwerp'
  }[project.type || 'website'] || 'Website'

  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: ${colors.gradient}; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">🎉</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Nieuw Project!</h1>
      <span style="display: inline-block; background: ${colors.primary}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">${serviceLabel} • ${project.package.toUpperCase()}</span>
    </div>
    
    <div style="background: ${BRAND_COLORS.bgDark}; border: 1px solid ${BRAND_COLORS.border}; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: ${BRAND_COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.5px;">Klantgegevens</h2>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
            <span style="color: ${BRAND_COLORS.textMuted}; font-size: 14px;">Project ID</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_COLORS.border}; text-align: right;">
            <span style="color: ${BRAND_COLORS.textWhite}; font-weight: 600; font-family: monospace;">${project.id}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
            <span style="color: ${BRAND_COLORS.textMuted}; font-size: 14px;">Bedrijf</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_COLORS.border}; text-align: right;">
            <span style="color: ${BRAND_COLORS.textWhite}; font-weight: 600;">${project.businessName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
            <span style="color: ${BRAND_COLORS.textMuted}; font-size: 14px;">Email</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_COLORS.border}; text-align: right;">
            <a href="mailto:${project.email}" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none;">${project.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <span style="color: ${BRAND_COLORS.textMuted}; font-size: 14px;">Telefoon</span>
          </td>
          <td style="padding: 8px 0; text-align: right;">
            ${project.phone ? `<a href="tel:${project.phone}" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none;">${project.phone}</a>` : `<span style="color: ${BRAND_COLORS.textMuted};">Niet opgegeven</span>`}
          </td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center;">
      <a href="https://webstability.nl/developer" style="display: inline-block; background: ${colors.gradient}; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Bekijk in Dashboard →
      </a>
    </div>
  `

  return sendEmail({
    to: SMTP_USER || 'info@webstability.nl',
    subject: `🎉 Nieuw ${serviceLabel.toLowerCase()} project: ${project.businessName}`,
    html: baseTemplate(content, colors.primary),
  })
}

// Welcome email to customer
export const sendWelcomeEmail = async (customer: {
  email: string
  name: string
  projectId: string
  package: string
  type?: string
  password?: string
  phase?: ProjectPhase
  driveLink?: string
}) => {
  const colors = getServiceColor(customer.type)
  const serviceLabel = {
    website: 'website',
    webshop: 'webshop', 
    drone: 'drone opnames',
    logo: 'logo ontwerp'
  }[customer.type || 'website'] || 'website'

  const currentPhase = customer.phase || 'onboarding'
  
  // Generate magic link for 1-click login
  const magicLink = await generateMagicLinkUrl(customer.projectId)

  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: ${colors.gradient}; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">🚀</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Welkom bij Webstability!</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px;">Je professionele ${serviceLabel} is onderweg</p>
    </div>
    
    ${getProgressBar(currentPhase, colors.primary)}
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${customer.name},<br><br>
      Super dat je voor Webstability hebt gekozen! We gaan direct voor je aan de slag.
    </p>
    
    ${customer.password ? `
    <!-- Login Credentials Card - Dark mode -->
    <div style="background: ${BRAND_COLORS.primaryBg}; border: 2px solid ${BRAND_COLORS.primary}; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: ${BRAND_COLORS.primaryLight};">🔐 Je inloggegevens</h3>
      <p style="margin: 0 0 16px; color: ${BRAND_COLORS.primary}; font-size: 14px;">Gebruik deze gegevens om de status van je project te volgen</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: ${BRAND_COLORS.bgCard}; border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid ${BRAND_COLORS.border};">
            <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">E-mailadres</p>
            <p style="margin: 6px 0 0; color: ${BRAND_COLORS.textWhite}; font-size: 18px; font-weight: 600;">${customer.email}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px;">
            <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Wachtwoord</p>
            <p style="margin: 6px 0 0; color: ${BRAND_COLORS.textWhite}; font-size: 20px; font-weight: 700; font-family: monospace;">${customer.password}</p>
          </td>
        </tr>
      </table>
      <div style="margin-top: 16px; padding: 12px; background: ${BRAND_COLORS.bgCard}; border-radius: 8px;">
        <p style="margin: 0; color: ${BRAND_COLORS.primaryLight}; font-size: 13px; line-height: 1.5;">
          <strong>💡 Zo log je in:</strong><br>
          1. Ga naar <a href="https://webstability.nl/status" style="color: ${BRAND_COLORS.primary}; font-weight: 600;">webstability.nl/status</a><br>
          2. Vul je e-mailadres in<br>
          3. Vul je wachtwoord in en klik op inloggen
        </p>
      </div>
    </div>
    ` : `
    <!-- Email verification when no password is set yet -->
    <div style="background: ${colors.gradient}; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 16px; color: rgba(255,255,255,0.9); font-size: 16px;">
        Verifieer je e-mailadres om toegang te krijgen tot je project
      </p>
      <a href="${magicLink}" style="display: inline-block; background: white; color: ${colors.primary}; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);">
        ✉️ Verifieer e-mail →
      </a>
    </div>
    `}
    
    <!-- Steps - Dark Mode -->
    <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Zo werkt het:</h2>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 48px; vertical-align: top;">
                <div style="width: 36px; height: 36px; background: ${BRAND_COLORS.primary}; border-radius: 50%; color: white; font-weight: 700; font-size: 16px; text-align: center; line-height: 36px;">1</div>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0 0 4px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Onboarding invullen</p>
                <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">Vertel ons meer over je bedrijf, kleuren en stijl.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 48px; vertical-align: top;">
                <div style="width: 36px; height: 36px; background: ${BRAND_COLORS.primary}; border-radius: 50%; color: white; font-weight: 700; font-size: 16px; text-align: center; line-height: 36px;">2</div>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0 0 4px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Bestanden uploaden</p>
                <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">
                  ${customer.driveLink 
                    ? `<a href="${customer.driveLink}" style="color: ${BRAND_COLORS.primaryLight}; font-weight: 600;">Open je Google Drive map →</a> en upload je logo, foto's en teksten.`
                    : 'Je Google Drive map voor bestanden (logo, foto\'s, etc.) wordt klaargezet.'}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 48px; vertical-align: top;">
                <div style="width: 36px; height: 36px; background: ${BRAND_COLORS.primary}; border-radius: 50%; color: white; font-weight: 700; font-size: 16px; text-align: center; line-height: 36px;">3</div>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0 0 4px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Wij ontwerpen</p>
                <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">Binnen 5-7 dagen ontvang je het eerste design.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 48px; vertical-align: top;">
                <div style="width: 36px; height: 36px; background: ${BRAND_COLORS.primary}; border-radius: 50%; color: white; font-weight: 700; font-size: 16px; text-align: center; line-height: 36px;">4</div>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0 0 4px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Feedback & goedkeuren</p>
                <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">Bekijk het design en geef feedback. Tot 3 revisies inbegrepen!</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 48px; vertical-align: top;">
                <div style="width: 36px; height: 36px; background: ${BRAND_COLORS.warning}; border-radius: 50%; color: white; font-weight: 700; font-size: 16px; text-align: center; line-height: 36px;">5</div>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0 0 4px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Betaling</p>
                <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;"><strong style="color: ${BRAND_COLORS.primary};">Pas na goedkeuring van het design</strong> — vrijblijvend starten!</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 48px; vertical-align: top;">
                <div style="width: 36px; height: 36px; background: ${BRAND_COLORS.success}; border-radius: 50%; color: white; font-weight: 700; font-size: 16px; text-align: center; line-height: 36px;">✓</div>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0 0 4px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Live!</p>
                <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">Na betaling gaat je ${serviceLabel} direct live.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    ${customer.driveLink ? `
    <!-- Google Drive Upload Box - Dark Mode -->
    <div style="background: ${BRAND_COLORS.bgDark}; border: 2px solid ${BRAND_COLORS.info}; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 40px; margin-bottom: 12px;">📁</div>
        <p style="margin: 0 0 8px; color: ${BRAND_COLORS.textWhite}; font-size: 18px; font-weight: 700;">
          Jouw Google Drive map is klaar!
        </p>
        <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">
          We hebben 5 mappen voor je klaargezet. Hier is wat we nodig hebben:
        </p>
      </div>
      
      <!-- Folder explanation table -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px; background: ${BRAND_COLORS.bgCard}; border-radius: 8px; margin-bottom: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width: 36px; vertical-align: top;">
                  <span style="font-size: 20px;">🎨</span>
                </td>
                <td>
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textWhite}; font-size: 14px;">Ontwerp</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px;">Logo bestanden, huisstijl handboek, kleurencodes</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
        <tr>
          <td style="padding: 10px; background: ${BRAND_COLORS.bgCard}; border-radius: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width: 36px; vertical-align: top;">
                  <span style="font-size: 20px;">📝</span>
                </td>
                <td>
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textWhite}; font-size: 14px;">Content</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px;">Teksten voor je website, bedrijfsomschrijving, USP's</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
        <tr>
          <td style="padding: 10px; background: ${BRAND_COLORS.bgCard}; border-radius: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width: 36px; vertical-align: top;">
                  <span style="font-size: 20px;">📸</span>
                </td>
                <td>
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textWhite}; font-size: 14px;">Afbeeldingen</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px;">Foto's van je producten, team, bedrijfspand (hoge kwaliteit)</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
        <tr>
          <td style="padding: 10px; background: ${BRAND_COLORS.bgCard}; border-radius: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width: 36px; vertical-align: top;">
                  <span style="font-size: 20px;">📄</span>
                </td>
                <td>
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textWhite}; font-size: 14px;">Documenten</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px;">Prijslijsten, brochures, certificaten, downloads voor bezoekers</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
        <tr>
          <td style="padding: 10px; background: ${BRAND_COLORS.bgCard}; border-radius: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width: 36px; vertical-align: top;">
                  <span style="font-size: 20px;">💬</span>
                </td>
                <td>
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textWhite}; font-size: 14px;">Feedback</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px;">Hier plaatsen wij previews en kun je feedback achterlaten</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <div style="text-align: center;">
        <a href="${customer.driveLink}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.info} 0%, #2563eb 100%); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);">
          📤 Open Google Drive →
        </a>
        <p style="margin: 16px 0 0; font-size: 13px; color: ${BRAND_COLORS.textMuted};">
          Werkt ook op je telefoon! Sleep je bestanden naar de juiste map.
        </p>
      </div>
    </div>
    ` : ''}
    
    <!-- Prominent Upload CTA - Dark Mode -->
    <div style="background: ${BRAND_COLORS.primaryBg}; border: 2px solid ${BRAND_COLORS.primary}; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 8px; color: ${BRAND_COLORS.textWhite}; font-size: 18px; font-weight: 700;">
        🚀 Begin nu met je onboarding!
      </p>
      <p style="margin: 0 0 16px; color: ${BRAND_COLORS.primaryLight}; font-size: 14px;">
        Hoe sneller je je info aanlevert, hoe sneller we kunnen starten
      </p>
      <a href="https://webstability.nl/intake/${customer.projectId}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); color: white; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
        📝 Start Onboarding (2 min) →
      </a>
      <p style="margin: 12px 0 0; font-size: 12px; color: ${BRAND_COLORS.textMuted};">
        Of <a href="${magicLink}" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: underline;">bekijk je project status</a>
      </p>
    </div>
    
    <!-- Spam Notice - Dark Mode -->
    <div style="background: #422006; border: 1px solid ${BRAND_COLORS.warning}; border-radius: 10px; padding: 16px; margin-top: 24px;">
      <p style="margin: 0; color: #fbbf24; font-size: 14px;">
        <strong>💡 Tip:</strong> Onze e-mails kunnen soms in je spam folder terechtkomen. Voeg <strong style="color: ${BRAND_COLORS.textWhite};">info@webstability.nl</strong> toe aan je contacten om dit te voorkomen.
      </p>
    </div>
  `

  return sendEmail({
    to: customer.email,
    subject: `Welkom ${customer.name}! Je ${serviceLabel} project is gestart 🚀`,
    html: baseTemplate(content, colors.primary),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Design ready for review
export const sendDesignReadyEmail = async (customer: {
  email: string
  name: string
  projectId: string
  previewUrl: string
  phase?: ProjectPhase
}) => {
  const currentPhase = customer.phase || 'design'
  
  // Generate magic link for 1-click login
  const magicLink = await generateMagicLinkUrl(customer.projectId)
  
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">🎨</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Je design is klaar!</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px;">Tijd om te bekijken wat we voor je hebben gemaakt</p>
    </div>
    
    ${getProgressBar(currentPhase, BRAND_COLORS.primary)}
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${customer.name},<br><br>
      Goed nieuws! Het design voor je website is af en klaar voor review. We zijn benieuwd wat je ervan vindt!
    </p>
    
    <!-- Preview Card - Dark Mode -->
    <div style="background: ${BRAND_COLORS.primaryBg}; border: 2px solid ${BRAND_COLORS.primary}; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 8px; color: ${BRAND_COLORS.primaryLight}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">👀 Preview klaar</p>
      <p style="margin: 0 0 20px; color: ${BRAND_COLORS.textLight}; font-size: 16px;">Neem rustig de tijd om alles te bekijken.</p>
      <a href="${customer.previewUrl}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); color: white; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Preview Bekijken →
      </a>
    </div>
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Ben je tevreden? Top! Keur het design goed in je dashboard.<br>
      Heb je aanpassingen? Geen probleem, je hebt <strong style="color: ${BRAND_COLORS.primary};">3 revisies</strong> inbegrepen.
    </p>
    
    ${getMagicLinkButton(magicLink, 'Naar Dashboard →', BRAND_COLORS.primary)}
  `

  return sendEmail({
    to: customer.email,
    subject: `🎨 Je website design is klaar voor review!`,
    html: baseTemplate(content, BRAND_COLORS.primary),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Payment received confirmation
export const sendPaymentConfirmationEmail = async (customer: {
  email: string
  name: string
  projectId: string
  amount: number
  invoiceUrl?: string
  phase?: ProjectPhase
}) => {
  const currentPhase = customer.phase || 'development'
  
  // Generate magic link for 1-click login
  const magicLink = await generateMagicLinkUrl(customer.projectId)
  
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">✅</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Betaling ontvangen!</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px;">Bedankt voor je betaling</p>
    </div>
    
    ${getProgressBar(currentPhase, BRAND_COLORS.primary)}
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${customer.name},<br><br>
      Bedankt voor je betaling! We hebben deze succesvol ontvangen.
    </p>
    
    <!-- Amount Card - Dark Mode -->
    <div style="background: ${BRAND_COLORS.primaryBg}; border: 2px solid ${BRAND_COLORS.primary}; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 8px; color: ${BRAND_COLORS.primaryLight}; font-size: 14px;">Betaald bedrag</p>
      <p style="margin: 0 0 8px; color: ${BRAND_COLORS.primary}; font-size: 48px; font-weight: 700;">€${customer.amount.toFixed(2)}</p>
      <p style="margin: 0; color: ${BRAND_COLORS.textLight}; font-size: 16px; font-weight: 600;">✓ Betaling geslaagd</p>
    </div>
    
    <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Wat nu?</h2>
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Je website wordt nu live gezet! Dit gebeurt meestal binnen 24 uur. Je ontvangt een email zodra alles online staat.
    </p>
    
    ${customer.invoiceUrl ? `
    <div style="background: ${BRAND_COLORS.bgDark}; border: 1px solid ${BRAND_COLORS.border}; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
      <a href="${customer.invoiceUrl}" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none; font-weight: 600;">
        📄 Download je factuur (PDF)
      </a>
    </div>
    ` : ''}
    
    ${getMagicLinkButton(magicLink, 'Bekijk Status →', BRAND_COLORS.info)}
  `

  return sendEmail({
    to: customer.email,
    subject: `✅ Betaling ontvangen - €${customer.amount.toFixed(2)}`,
    html: baseTemplate(content, BRAND_COLORS.primary),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Website is live!
export const sendWebsiteLiveEmail = async (customer: {
  email: string
  name: string
  domain: string
  liveUrl: string
  phase?: ProjectPhase
}) => {
  const currentPhase = customer.phase || 'live'
  
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">🎉</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Je website is LIVE!</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px;">Gefeliciteerd met je nieuwe website</p>
    </div>
    
    ${getProgressBar(currentPhase, BRAND_COLORS.primary)}
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${customer.name},<br><br>
      Het moment is daar! Je nieuwe website staat online en is bereikbaar voor de hele wereld. 🌍
    </p>
    
    <!-- Live Website Card - Dark Mode -->
    <div style="background: ${BRAND_COLORS.primaryBg}; border: 2px solid ${BRAND_COLORS.primary}; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 8px; color: ${BRAND_COLORS.primaryLight}; font-size: 14px; font-weight: 600;">Je website</p>
      <p style="margin: 0 0 20px; color: ${BRAND_COLORS.textWhite}; font-size: 28px; font-weight: 700;">${customer.domain}</p>
      <a href="${customer.liveUrl}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); color: white; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
        🌐 Bezoek je website
      </a>
    </div>
    
    <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: ${BRAND_COLORS.textWhite};">Wat kun je nu doen?</h2>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 36px; vertical-align: middle;">
                <span style="font-size: 20px;">📣</span>
              </td>
              <td style="vertical-align: middle;">
                <p style="margin: 0; color: ${BRAND_COLORS.textLight};">Deel je nieuwe website met je netwerk</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 36px; vertical-align: middle;">
                <span style="font-size: 20px;">📱</span>
              </td>
              <td style="vertical-align: middle;">
                <p style="margin: 0; color: ${BRAND_COLORS.textLight};">Voeg de link toe aan je social media profielen</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 36px; vertical-align: middle;">
                <span style="font-size: 20px;">💼</span>
              </td>
              <td style="vertical-align: middle;">
                <p style="margin: 0; color: ${BRAND_COLORS.textLight};">Update je visitekaartjes en briefpapier</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 36px; vertical-align: middle;">
                <span style="font-size: 20px;">📍</span>
              </td>
              <td style="vertical-align: middle;">
                <p style="margin: 0; color: ${BRAND_COLORS.textLight};">Claim je Google Mijn Bedrijf profiel</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <div style="background: #422006; border: 1px solid ${BRAND_COLORS.warning}; border-radius: 10px; padding: 16px;">
      <p style="margin: 0; color: #fbbf24; font-size: 14px;">
        <strong>💡 Tip:</strong> Heb je vragen of wil je wijzigingen? Je kunt altijd contact met ons opnemen via je dashboard of reply direct op deze email.
      </p>
    </div>
  `

  return sendEmail({
    to: customer.email,
    subject: `🎉 Je website ${customer.domain} is LIVE!`,
    html: baseTemplate(content, BRAND_COLORS.primary),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Password reset email
export const sendPasswordResetEmail = async (customer: {
  email: string
  name: string
  resetUrl: string
}) => {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_COLORS.warning} 0%, #ea580c 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">🔐</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Wachtwoord resetten</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px;">Je hebt een reset aangevraagd</p>
    </div>
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${customer.name},<br><br>
      Je hebt aangegeven dat je je wachtwoord wilt resetten. Klik op de onderstaande knop om een nieuw wachtwoord in te stellen.
    </p>
    
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${customer.resetUrl}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.warning} 0%, #ea580c 100%); color: white; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Wachtwoord resetten →
      </a>
    </div>
    
    <div style="background: #422006; border: 1px solid ${BRAND_COLORS.warning}; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0; color: #fbbf24; font-size: 14px;">
        <strong>⏰ Let op:</strong> Deze link is 1 uur geldig. Heb je niet om een reset gevraagd? Dan kun je deze email negeren.
      </p>
    </div>
    
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
      Werkt de knop niet? Kopieer dan deze link in je browser:<br>
      <span style="color: ${BRAND_COLORS.primaryLight}; word-break: break-all;">${customer.resetUrl}</span>
    </p>
  `

  return sendEmail({
    to: customer.email,
    subject: `🔐 Wachtwoord resetten voor Webstability`,
    html: baseTemplate(content, BRAND_COLORS.warning),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Project update notification
export const sendProjectUpdateEmail = async (customer: {
  email: string
  name: string
  projectId: string
  updateTitle: string
  updateMessage: string
  phase?: ProjectPhase
}) => {
  const currentPhase = customer.phase || 'design'
  
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_COLORS.info} 0%, #1d4ed8 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">📢</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Update voor je project</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px;">${customer.updateTitle}</p>
    </div>
    
    ${getProgressBar(currentPhase, BRAND_COLORS.info)}
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${customer.name},<br><br>
      Er is een update voor je project!
    </p>
    
    <div style="background: ${BRAND_COLORS.bgDark}; border-left: 4px solid ${BRAND_COLORS.info}; border-radius: 0 12px 12px 0; padding: 20px 24px; margin-bottom: 24px;">
      <p style="margin: 0; color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; white-space: pre-line;">${customer.updateMessage}</p>
    </div>
    
    <div style="text-align: center;">
      <a href="https://webstability.nl/status/${customer.projectId}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.info} 0%, #1d4ed8 100%); color: white; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Bekijk Project Status →
      </a>
    </div>
  `

  return sendEmail({
    to: customer.email,
    subject: `📢 Update: ${customer.updateTitle}`,
    html: baseTemplate(content, BRAND_COLORS.info),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Payment link email
export const sendPaymentLinkEmail = async (customer: {
  email: string
  name: string
  projectId: string
  projectName: string
  amount: number
  paymentUrl: string
  packageName: string
  phase?: ProjectPhase
}) => {
  const formattedAmount = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(customer.amount)

  const currentPhase = customer.phase || 'design_approved'

  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">💳</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Je betaallink is klaar!</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px;">Voltooi je betaling om verder te gaan</p>
    </div>
    
    ${getProgressBar(currentPhase, BRAND_COLORS.primary)}
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${customer.name},<br><br>
      Je design is goedgekeurd! 🎉 Om door te gaan naar de ontwikkeling van je website hebben we je betaling nodig.
    </p>
    
    <div style="background: ${BRAND_COLORS.primaryBg}; border: 1px solid ${BRAND_COLORS.primary}; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: ${BRAND_COLORS.primaryLight}; font-size: 18px; font-weight: 600;">📋 Betalingsoverzicht</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Project</td>
          <td style="padding: 8px 0; text-align: right; color: ${BRAND_COLORS.textWhite}; font-weight: 500;">${customer.projectName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Pakket</td>
          <td style="padding: 8px 0; text-align: right; color: ${BRAND_COLORS.textWhite}; font-weight: 500;">${customer.packageName}</td>
        </tr>
        <tr style="border-top: 2px solid ${BRAND_COLORS.primary};">
          <td style="padding: 16px 0 8px; color: ${BRAND_COLORS.primary}; font-weight: 600; font-size: 18px;">Totaal</td>
          <td style="padding: 16px 0 8px; text-align: right; color: ${BRAND_COLORS.primary}; font-weight: 700; font-size: 20px;">${formattedAmount}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${customer.paymentUrl}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); color: white; padding: 18px 48px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
        💳 Betaal nu ${formattedAmount} →
      </a>
    </div>
    
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 14px; text-align: center; margin-bottom: 24px;">
      De betaallink is 15 minuten geldig. Na betaling gaan we direct verder met je website!
    </p>
    
    <div style="background: #422006; border: 1px solid ${BRAND_COLORS.warning}; border-radius: 12px; padding: 16px;">
      <p style="margin: 0; color: #fbbf24; font-size: 14px;">
        <strong>💡 Tip:</strong> Na je betaling ontvang je automatisch een bevestiging en gaan we direct verder met de volgende stap van je project.
      </p>
    </div>
  `

  return sendEmail({
    to: customer.email,
    subject: `💳 Betaallink voor ${customer.projectName} - ${formattedAmount}`,
    html: baseTemplate(content, BRAND_COLORS.primary),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Deadline reminder email
export const sendDeadlineReminderEmail = async (params: {
  email: string
  name: string
  projectId: string
  phase: 'onboarding' | 'design' | 'development' | 'review' | 'live'
  type?: string
  deadline: string
  daysUntil: number
  reminderType: 'upcoming' | 'urgent' | 'overdue'
  action: string
  driveLink?: string
}) => {
  const colors = getServiceColor(params.type)
  
  // Bepaal urgentie styling - Dark Mode
  const urgencyConfig = {
    upcoming: {
      emoji: '📅',
      title: 'Deadline herinnering',
      color: BRAND_COLORS.warning,
      bgColor: '#422006',
      borderColor: '#fbbf24',
      urgencyText: `Nog ${params.daysUntil} ${params.daysUntil === 1 ? 'dag' : 'dagen'} te gaan`
    },
    urgent: {
      emoji: '⚠️',
      title: 'Deadline morgen!',
      color: '#ea580c',
      bgColor: '#431407',
      borderColor: '#fb923c',
      urgencyText: params.daysUntil === 0 ? 'Deadline is vandaag!' : 'Deadline is morgen!'
    },
    overdue: {
      emoji: '🚨',
      title: 'Actie vereist',
      color: BRAND_COLORS.error,
      bgColor: '#450a0a',
      borderColor: '#f87171',
      urgencyText: `${Math.abs(params.daysUntil)} ${Math.abs(params.daysUntil) === 1 ? 'dag' : 'dagen'} over de deadline`
    }
  }
  
  const config = urgencyConfig[params.reminderType]
  const deadlineDate = new Date(params.deadline)
  const formattedDeadline = deadlineDate.toLocaleDateString('nl-NL', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
  
  // Generate magic link for 1-click login
  const magicLink = await generateMagicLinkUrl(params.projectId)
  
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">${config.emoji}</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">${config.title}</h1>
      <p style="margin: 0; color: ${config.color}; font-size: 16px; font-weight: 600;">${config.urgencyText}</p>
    </div>
    
    ${getProgressBar(params.phase, colors.primary)}
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${params.name},<br><br>
      We willen je even herinneren aan je project. Om verder te kunnen met de volgende stap, vragen we je om ${params.action}.
    </p>
    
    <!-- Deadline card - Dark Mode -->
    <div style="background: ${config.bgColor}; border-left: 4px solid ${config.borderColor}; border-radius: 0 12px 12px 0; padding: 20px 24px; margin-bottom: 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Deadline</p>
            <p style="margin: 0; color: ${BRAND_COLORS.textWhite}; font-size: 18px; font-weight: 600;">${formattedDeadline}</p>
          </td>
          <td align="right">
            <div style="background: ${config.color}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
              ${config.urgencyText}
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    ${params.driveLink ? `
    <!-- Google Drive link - Dark Mode -->
    <div style="background: ${BRAND_COLORS.bgDark}; border: 1px solid ${BRAND_COLORS.border}; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px; color: ${BRAND_COLORS.textWhite}; font-size: 16px; font-weight: 600;">📁 Je bestanden uploaden</h3>
      <p style="margin: 0 0 16px; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">
        Upload je content, logo's en afbeeldingen naar je persoonlijke Google Drive map:
      </p>
      <a href="${params.driveLink}" style="display: inline-block; background: ${BRAND_COLORS.info}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        📂 Open Google Drive →
      </a>
    </div>
    ` : ''}
    
    ${getMagicLinkButton(magicLink, 'Bekijk Project Status →', colors.primary)}
    
    <div style="background: ${BRAND_COLORS.bgDark}; border: 1px solid ${BRAND_COLORS.border}; border-radius: 12px; padding: 16px; margin-top: 24px;">
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; text-align: center;">
        <strong style="color: ${BRAND_COLORS.textWhite};">Vragen of hulp nodig?</strong><br>
        Neem gerust contact op via 
        <a href="mailto:info@webstability.nl" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none;">info@webstability.nl</a> 
        of bel <a href="tel:+31644712573" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none;">06-44712573</a>
      </p>
    </div>
  `

  return sendEmail({
    to: params.email,
    subject: `${config.emoji} ${config.title} - ${params.projectId}`,
    html: baseTemplate(content, config.color),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Phase change notification
export const sendPhaseChangeEmail = async (customer: {
  email: string
  name: string
  projectId: string
  projectName: string
  newPhase: string
  phaseDescription: string
  nextSteps: string[]
}) => {
  const phaseEmojis: Record<string, string> = {
    'onboarding': '📝',
    'design': '🎨',
    'design_approved': '✅',
    'development': '💻',
    'review': '🔍',
    'live': '🚀',
    'completed': '✅'
  }
  
  const phaseColors: Record<string, string> = {
    'onboarding': BRAND_COLORS.warning,
    'design': BRAND_COLORS.primary,
    'design_approved': BRAND_COLORS.success,
    'development': BRAND_COLORS.info,
    'review': BRAND_COLORS.warning,
    'live': BRAND_COLORS.success,
    'completed': BRAND_COLORS.primary
  }
  
  const phaseNames: Record<string, string> = {
    'onboarding': 'Onboarding',
    'design': 'Design Fase',
    'design_approved': 'Design Goedgekeurd',
    'development': 'Ontwikkeling',
    'review': 'Review & Feedback',
    'live': 'Website Live!',
    'completed': 'Afgerond'
  }

  const emoji = phaseEmojis[customer.newPhase] || '📌'
  const color = phaseColors[customer.newPhase] || BRAND_COLORS.info
  const phaseName = phaseNames[customer.newPhase] || customer.newPhase
  const currentPhase = (PHASE_CONFIG.some(p => p.key === customer.newPhase) ? customer.newPhase : 'onboarding') as ProjectPhase

  // Generate magic link for 1-click login
  const magicLink = await generateMagicLinkUrl(customer.projectId)

  const nextStepsList = customer.nextSteps.map(step => 
    `<li style="padding: 8px 0; color: ${BRAND_COLORS.textLight};">${step}</li>`
  ).join('')

  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px;">${emoji}</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: ${BRAND_COLORS.textWhite};">Nieuwe fase: ${phaseName}</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 16px;">Je project gaat vooruit!</p>
    </div>
    
    ${getProgressBar(currentPhase, color)}
    
    <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Hoi ${customer.name},<br><br>
      Goed nieuws! Je project <strong style="color: ${BRAND_COLORS.textWhite};">${customer.projectName}</strong> is naar een nieuwe fase gegaan.
    </p>
    
    <div style="background: ${BRAND_COLORS.bgDark}; border-left: 4px solid ${color}; border-radius: 0 12px 12px 0; padding: 20px 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 8px; color: ${color}; font-size: 18px; font-weight: 600;">${emoji} ${phaseName}</h3>
      <p style="margin: 0; color: ${BRAND_COLORS.textLight}; font-size: 15px; line-height: 1.6;">${customer.phaseDescription}</p>
    </div>
    
    ${customer.nextSteps.length > 0 ? `
    <div style="background: ${BRAND_COLORS.bgDark}; border: 1px solid ${BRAND_COLORS.border}; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px; color: ${BRAND_COLORS.textWhite}; font-size: 16px; font-weight: 600;">📋 Volgende stappen:</h3>
      <ul style="margin: 0; padding-left: 20px; list-style-type: none;">
        ${customer.nextSteps.map(step => `
          <li style="padding: 6px 0; color: ${BRAND_COLORS.textLight}; position: relative; padding-left: 24px;">
            <span style="position: absolute; left: 0; color: ${color};">✓</span>
            ${step}
          </li>
        `).join('')}
      </ul>
    </div>
    ` : ''}
    
    ${getMagicLinkButton(magicLink, 'Bekijk Project Status →', color)}
  `

  return sendEmail({
    to: customer.email,
    subject: `${emoji} ${customer.projectName} - Nieuwe fase: ${phaseName}`,
    html: baseTemplate(content, color),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// ===========================================
// Onboarding Complete Confirmation Email
// ===========================================

export const sendOnboardingCompleteEmail = async (customer: {
  name: string
  email: string
  projectId: string
  businessName?: string
  package?: string
}): Promise<EmailResult> => {
  const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'
  const dashboardUrl = `${BASE_URL}/status/${customer.projectId}`
  
  // Generate magic link for 1-click access
  const magicLinkUrl = await generateMagicLinkUrl(customer.projectId)

  const html = baseTemplate(`
    <!-- Header with success checkmark -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_COLORS.success} 0%, #059669 100%); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 36px; line-height: 1;">✓</span>
      </div>
      <h1 style="color: ${BRAND_COLORS.textWhite}; font-size: 28px; margin: 0 0 8px; font-weight: 700;">
        Onboarding voltooid! 🎉
      </h1>
      <p style="color: ${BRAND_COLORS.textMuted}; font-size: 16px; margin: 0;">
        Bedankt voor het invullen, ${customer.name}!
      </p>
    </div>

    <!-- Main content card -->
    <div style="background-color: ${BRAND_COLORS.bgCard}; border-radius: 16px; padding: 32px; margin-bottom: 24px; border: 1px solid ${BRAND_COLORS.border};">
      <p style="color: ${BRAND_COLORS.textLight}; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        We hebben al je informatie ontvangen voor <strong style="color: ${BRAND_COLORS.primary};">${customer.businessName || 'je project'}</strong>. 
        Ons team gaat nu aan de slag met het ontwerp van je website.
      </p>

      <div style="background: linear-gradient(135deg, ${BRAND_COLORS.primaryBg} 0%, #064e3b 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 4px solid ${BRAND_COLORS.primary};">
        <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin: 0;">
          <strong style="color: ${BRAND_COLORS.primary};">💡 Wat kun je verwachten?</strong><br><br>
          Binnen <strong>5-7 werkdagen</strong> ontvang je het eerste ontwerp van je website. 
          Je kunt de voortgang volgen in je persoonlijke dashboard.
        </p>
      </div>

      <!-- CTA Button - Dashboard -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${magicLinkUrl}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); color: white; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
          📊 Bekijk je Dashboard →
        </a>
      </div>
      
      <p style="color: ${BRAND_COLORS.textMuted}; font-size: 12px; text-align: center; margin: 0;">
        Of kopieer deze link: <a href="${dashboardUrl}" style="color: ${BRAND_COLORS.primary};">${dashboardUrl}</a>
      </p>
    </div>

    <!-- Next steps -->
    <div style="background-color: ${BRAND_COLORS.bgCard}; border-radius: 16px; padding: 24px; border: 1px solid ${BRAND_COLORS.border};">
      <h3 style="color: ${BRAND_COLORS.textWhite}; font-size: 18px; margin: 0 0 20px; font-weight: 600;">
        📋 Volgende stappen
      </h3>
      
      <div style="margin-bottom: 16px; padding-left: 16px; border-left: 3px solid ${BRAND_COLORS.success};">
        <p style="color: ${BRAND_COLORS.success}; font-size: 14px; margin: 0 0 4px; font-weight: 600;">✓ Onboarding voltooid</p>
        <p style="color: ${BRAND_COLORS.textMuted}; font-size: 13px; margin: 0;">Je informatie is ontvangen</p>
      </div>
      
      <div style="margin-bottom: 16px; padding-left: 16px; border-left: 3px solid ${BRAND_COLORS.warning};">
        <p style="color: ${BRAND_COLORS.warning}; font-size: 14px; margin: 0 0 4px; font-weight: 600;">⏳ Design wordt gemaakt</p>
        <p style="color: ${BRAND_COLORS.textMuted}; font-size: 13px; margin: 0;">We maken je eerste ontwerp (5-7 werkdagen)</p>
      </div>
      
      <div style="padding-left: 16px; border-left: 3px solid ${BRAND_COLORS.border};">
        <p style="color: ${BRAND_COLORS.textMuted}; font-size: 14px; margin: 0 0 4px; font-weight: 600;">Design review</p>
        <p style="color: ${BRAND_COLORS.textMuted}; font-size: 13px; margin: 0;">Je ontvangt een mail zodra je design klaar is</p>
      </div>
    </div>

    <!-- Contact info -->
    <div style="text-align: center; margin-top: 32px; padding: 20px; background-color: rgba(16, 185, 129, 0.1); border-radius: 12px;">
      <p style="color: ${BRAND_COLORS.textLight}; font-size: 14px; margin: 0;">
        Vragen? Stuur een bericht via je dashboard of mail naar<br>
        <a href="mailto:info@webstability.nl" style="color: ${BRAND_COLORS.primary}; text-decoration: none; font-weight: 500;">info@webstability.nl</a>
      </p>
    </div>
  `)

  return sendEmail({
    to: customer.email,
    subject: `✅ Onboarding voltooid - ${customer.businessName || customer.projectId}`,
    html,
    text: `Hoi ${customer.name},

Bedankt voor het invullen van de onboarding voor ${customer.businessName || 'je project'}!

We hebben al je informatie ontvangen en gaan aan de slag met het ontwerp van je website.

Binnen 5-7 werkdagen ontvang je het eerste ontwerp.

Bekijk je dashboard: ${dashboardUrl}

Vragen? Mail naar info@webstability.nl

Met vriendelijke groet,
Team Webstability`
  })
}

export default {
  sendEmail,
  isSmtpConfigured,
  generateMagicLinkUrl,
  sendProjectCreatedEmail,
  sendWelcomeEmail,
  sendDesignReadyEmail,
  sendPaymentConfirmationEmail,
  sendWebsiteLiveEmail,
  sendPasswordResetEmail,
  sendProjectUpdateEmail,
  sendPaymentLinkEmail,
  sendPhaseChangeEmail,
  sendDeadlineReminderEmail,
  sendOnboardingCompleteEmail,
}

