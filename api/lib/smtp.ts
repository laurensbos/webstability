/**
 * SMTP Email Library - Webstability
 * 
 * Minimalist, professional email templates
 * Clean design matching website aesthetics
 * Multi-language support (NL/EN)
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
// Language Support
// ===========================================

export type EmailLanguage = 'nl' | 'en'

// Get translations for email templates
const getTranslations = (lang: EmailLanguage = 'nl') => {
  const translations = {
    nl: {
      // Common
      greeting: 'Met vriendelijke groet,',
      team: 'Team Webstability',
      viewProject: 'Bekijk project',
      viewDashboard: 'Bekijk dashboard',
      oneClickLogin: 'Direct inloggen - geen wachtwoord nodig',
      ratedWith: 'Beoordeeld met',
      onTrustpilot: 'op Trustpilot',
      questions: 'Vragen? We staan voor je klaar.',
      footerDisclaimer: 'Je ontvangt deze email omdat je een project hebt bij Webstability.',
      allRightsReserved: 'Alle rechten voorbehouden.',
      
      // Welcome email
      welcomeTitle: 'Welkom!',
      welcomeSubtitle: 'Jouw project is gestart',
      welcomeIntro: 'Bedankt dat je voor Webstability hebt gekozen. We gaan direct voor je aan de slag.',
      
      // Process steps
      stepOnboarding: 'Informatie invullen',
      stepOnboardingDesc: 'Vertel ons over je bedrijf en wensen',
      stepDesign: 'Design ontvangen',
      stepDesignDesc: 'Binnen 5-7 werkdagen',
      stepFeedback: 'Feedback geven',
      stepFeedbackDesc: 'Tot 3 revisierondes inbegrepen',
      stepPayment: 'Betaling',
      stepPaymentDesc: 'Alleen als je 100% tevreden bent',
      stepLive: 'Website live',
      stepLiveDesc: 'Je website is online!',
      
      // Design ready
      designReadyTitle: 'Je design is klaar!',
      designReadySubtitle: 'Bekijk het eerste ontwerp',
      designReadyIntro: 'We hebben hard gewerkt aan je ontwerp en zijn benieuwd wat je ervan vindt.',
      viewDesign: 'Bekijk design',
      feedbackNote: 'Nog niet 100% tevreden? Geen probleem! Je hebt tot 3 gratis revisies.',
      
      // Payment
      paymentReceivedTitle: 'Betaling ontvangen',
      paymentReceivedSubtitle: 'Bedankt voor je vertrouwen',
      paymentReceivedIntro: 'We hebben je betaling in goede orde ontvangen. Je website gaat binnenkort live!',
      amount: 'Bedrag',
      paymentId: 'Betalingskenmerk',
      
      // Website live
      websiteLiveTitle: 'Je website is live! 🎉',
      websiteLiveSubtitle: 'Gefeliciteerd met je nieuwe website',
      websiteLiveIntro: 'Het is zover! Je professionele website is nu bereikbaar voor de hele wereld.',
      visitWebsite: 'Bezoek website',
      
      // Password reset
      passwordResetTitle: 'Wachtwoord resetten',
      passwordResetIntro: 'Je hebt een wachtwoord reset aangevraagd. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.',
      resetPassword: 'Reset wachtwoord',
      linkExpiry: 'Deze link is 1 uur geldig.',
      notRequested: 'Heb je dit niet aangevraagd? Negeer dan deze email.',
      
      // Phase update
      phaseUpdateTitle: 'Project update',
      currentPhase: 'Huidige fase',
      
      // Reminder
      reminderTitle: 'Herinnering',
      
      // Change request
      changeRequestReceived: 'Wijzigingsverzoek ontvangen',
      changeRequestProgress: 'Wijziging in behandeling',
      changeRequestCompleted: 'Wijziging doorgevoerd',
      yourRequest: 'Je verzoek',
      developerResponse: 'Reactie',
    },
    en: {
      // Common
      greeting: 'Best regards,',
      team: 'Team Webstability',
      viewProject: 'View project',
      viewDashboard: 'View dashboard',
      oneClickLogin: 'One-click login - no password needed',
      ratedWith: 'Rated',
      onTrustpilot: 'on Trustpilot',
      questions: 'Questions? We\'re here to help.',
      footerDisclaimer: 'You\'re receiving this email because you have a project with Webstability.',
      allRightsReserved: 'All rights reserved.',
      
      // Welcome email
      welcomeTitle: 'Welcome!',
      welcomeSubtitle: 'Your project has started',
      welcomeIntro: 'Thank you for choosing Webstability. We\'ll get started right away.',
      
      // Process steps
      stepOnboarding: 'Fill in information',
      stepOnboardingDesc: 'Tell us about your business',
      stepDesign: 'Receive design',
      stepDesignDesc: 'Within 5-7 business days',
      stepFeedback: 'Give feedback',
      stepFeedbackDesc: 'Up to 3 revision rounds included',
      stepPayment: 'Payment',
      stepPaymentDesc: 'Only when 100% satisfied',
      stepLive: 'Website live',
      stepLiveDesc: 'Your website is online!',
      
      // Design ready
      designReadyTitle: 'Your design is ready!',
      designReadySubtitle: 'View the first draft',
      designReadyIntro: 'We\'ve worked hard on your design and are curious what you think.',
      viewDesign: 'View design',
      feedbackNote: 'Not 100% satisfied yet? No problem! You have up to 3 free revisions.',
      
      // Payment
      paymentReceivedTitle: 'Payment received',
      paymentReceivedSubtitle: 'Thank you for your trust',
      paymentReceivedIntro: 'We\'ve received your payment. Your website will be live soon!',
      amount: 'Amount',
      paymentId: 'Payment reference',
      
      // Website live
      websiteLiveTitle: 'Your website is live! 🎉',
      websiteLiveSubtitle: 'Congratulations on your new website',
      websiteLiveIntro: 'The moment is here! Your professional website is now accessible to the world.',
      visitWebsite: 'Visit website',
      
      // Password reset
      passwordResetTitle: 'Reset password',
      passwordResetIntro: 'You\'ve requested a password reset. Click the button below to set a new password.',
      resetPassword: 'Reset password',
      linkExpiry: 'This link is valid for 1 hour.',
      notRequested: 'Didn\'t request this? Ignore this email.',
      
      // Phase update
      phaseUpdateTitle: 'Project update',
      currentPhase: 'Current phase',
      
      // Reminder
      reminderTitle: 'Reminder',
      
      // Change request
      changeRequestReceived: 'Change request received',
      changeRequestProgress: 'Change in progress',
      changeRequestCompleted: 'Change completed',
      yourRequest: 'Your request',
      developerResponse: 'Response',
    }
  }
  
  return translations[lang] || translations.nl
}

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
// Base Email Template - Minimalist Design
// Clean, professional, matches website aesthetics
// ===========================================

// Brand colors - clean, minimal palette
const BRAND_COLORS = {
  // Backgrounds
  bgMain: '#ffffff',
  bgSecondary: '#f8fafc',   // slate-50
  bgDark: '#0f172a',        // slate-900
  bgCard: '#f8fafc',        // slate-50 (for cards)
  
  // Primary - subtle emerald
  primary: '#059669',       // emerald-600
  primaryLight: '#10b981',  // emerald-500
  primaryDark: '#047857',   // emerald-700
  primaryBg: '#ecfdf5',     // emerald-50
  
  // Text
  textDark: '#0f172a',      // slate-900
  textMedium: '#475569',    // slate-600
  textLight: '#64748b',     // slate-500
  textMuted: '#94a3b8',     // slate-400
  textWhite: '#ffffff',     // white (for compatibility)
  
  // Accents
  border: '#e2e8f0',        // slate-200
  borderLight: '#f1f5f9',   // slate-100
  
  // States
  success: '#059669',
  successBg: '#ecfdf5',     // emerald-50 for success backgrounds
  warning: '#d97706',
  error: '#dc2626',
  info: '#3b82f6',          // blue
}

// Clean Trustpilot rating (subtle, not overwhelming)
const getTrustpilotRating = (t: ReturnType<typeof getTranslations>) => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
    <tr>
      <td style="padding-right: 8px;">
        <span style="color: ${BRAND_COLORS.textMuted}; font-size: 12px;">${t.ratedWith}</span>
      </td>
      <td>
        <span style="color: #00b67a; font-size: 14px; letter-spacing: 1px;">★★★★★</span>
      </td>
      <td style="padding-left: 8px;">
        <span style="color: ${BRAND_COLORS.textMuted}; font-size: 12px;">${t.onTrustpilot}</span>
      </td>
    </tr>
  </table>
`

export const baseTemplate = (content: string, lang: EmailLanguage = 'nl') => {
  const t = getTranslations(lang)
  
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Webstability</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND_COLORS.bgSecondary}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgSecondary};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: ${BRAND_COLORS.bgMain}; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid ${BRAND_COLORS.borderLight};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- Logo - Simple text logo -->
                    <a href="https://webstability.nl" style="text-decoration: none;">
                      <span style="font-size: 20px; font-weight: 700; color: ${BRAND_COLORS.textDark}; letter-spacing: -0.5px;">webstability</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: ${BRAND_COLORS.bgSecondary}; border-top: 1px solid ${BRAND_COLORS.border};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                
                <!-- Signature -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.textMedium}; line-height: 1.6;">
                      ${t.greeting}<br>
                      <strong style="color: ${BRAND_COLORS.textDark};">${t.team}</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <div style="height: 1px; background-color: ${BRAND_COLORS.border};"></div>
                  </td>
                </tr>
                
                <!-- Trustpilot -->
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <a href="https://nl.trustpilot.com/review/webstability.nl" style="text-decoration: none;">
                      ${getTrustpilotRating(t)}
                    </a>
                  </td>
                </tr>
                
                <!-- Contact -->
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="margin: 0; font-size: 13px; color: ${BRAND_COLORS.textLight};">
                      <a href="https://webstability.nl" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">webstability.nl</a>
                      &nbsp;·&nbsp;
                      <a href="mailto:info@webstability.nl" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">info@webstability.nl</a>
                      &nbsp;·&nbsp;
                      <a href="https://wa.me/31644712573" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">WhatsApp</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Legal -->
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 11px; color: ${BRAND_COLORS.textMuted};">
                      KvK: 91186307 · BTW: NL004875371B72
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Bottom Disclaimer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px;">
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <p style="margin: 0; font-size: 11px; color: ${BRAND_COLORS.textMuted}; line-height: 1.5;">
                ${t.footerDisclaimer}<br>
                © ${new Date().getFullYear()} Webstability. ${t.allRightsReserved}
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

type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'development' | 'payment' | 'approval' | 'review' | 'live'

const PHASE_CONFIG: { key: ProjectPhase | 'design_approved'; label: string; emoji: string }[] = [
  { key: 'onboarding', label: 'Onboarding', emoji: '📝' },
  { key: 'design', label: 'Design', emoji: '🎨' },
  { key: 'feedback', label: 'Feedback', emoji: '💬' },
  { key: 'revisie', label: 'Revisie', emoji: '🔄' },
  { key: 'payment', label: 'Betaling', emoji: '💳' },
  { key: 'approval', label: 'Goedkeuring', emoji: '✅' },
  { key: 'live', label: 'Live', emoji: '🚀' },
]

const getProgressBar = (currentPhase: ProjectPhase | 'design_approved' | 'development' | 'review', _accentColor: string = '#10b981'): string => {
  // Map legacy phases to new phases
  const phaseMapping: Record<string, ProjectPhase> = {
    'design_approved': 'feedback',
    'development': 'revisie',
    'review': 'approval'
  }
  const mappedPhase = phaseMapping[currentPhase] || currentPhase as ProjectPhase
  const currentIndex = PHASE_CONFIG.findIndex(p => p.key === mappedPhase)
  
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
  const serviceLabel = {
    website: 'Website',
    webshop: 'Webshop', 
    drone: 'Drone opnames',
    logo: 'Logo ontwerp'
  }[project.type || 'website'] || 'Website'

  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${BRAND_COLORS.primaryBg}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">🎉</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">Nieuw Project!</h1>
      <span style="display: inline-block; background: ${BRAND_COLORS.primaryBg}; color: ${BRAND_COLORS.primary}; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;">${serviceLabel} • ${project.package.toUpperCase()}</span>
    </div>
    
    <!-- Details -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Project ID</td>
          <td style="padding: 8px 0; text-align: right; color: ${BRAND_COLORS.textDark}; font-family: monospace;">${project.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Bedrijf</td>
          <td style="padding: 8px 0; text-align: right; color: ${BRAND_COLORS.textDark}; font-weight: 500;">${project.businessName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Email</td>
          <td style="padding: 8px 0; text-align: right;">
            <a href="mailto:${project.email}" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">${project.email}</a>
          </td>
        </tr>
        ${project.phone ? `
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Telefoon</td>
          <td style="padding: 8px 0; text-align: right;">
            <a href="tel:${project.phone}" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">${project.phone}</a>
          </td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <!-- CTA -->
    <div style="text-align: center;">
      <a href="https://webstability.nl/developer" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        Bekijk in Dashboard
      </a>
    </div>
  `

  return sendEmail({
    to: SMTP_USER || 'info@webstability.nl',
    subject: `🎉 Nieuw ${serviceLabel.toLowerCase()} project: ${project.businessName}`,
    html: baseTemplate(content, 'nl'),
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
  lang?: EmailLanguage
}) => {
  const lang = customer.lang || 'nl'
  const t = getTranslations(lang)
  
  const serviceLabel = lang === 'nl' ? {
    website: 'website',
    webshop: 'webshop', 
    drone: 'drone opnames',
    logo: 'logo ontwerp'
  }[customer.type || 'website'] || 'website' : {
    website: 'website',
    webshop: 'webshop', 
    drone: 'drone footage',
    logo: 'logo design'
  }[customer.type || 'website'] || 'website'
  
  // Generate magic link for 1-click login
  const magicLink = await generateMagicLinkUrl(customer.projectId)

  const content = `
    <!-- Hero -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: ${BRAND_COLORS.textDark};">${t.welcomeTitle}</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMedium}; font-size: 15px;">${t.welcomeSubtitle}</p>
    </div>
    
    <!-- Intro -->
    <p style="color: ${BRAND_COLORS.textMedium}; font-size: 15px; line-height: 1.7; margin-bottom: 28px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${customer.name},<br><br>
      ${t.welcomeIntro}
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${magicLink}" style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
        ${t.viewProject} →
      </a>
      <p style="margin: 12px 0 0; font-size: 12px; color: ${BRAND_COLORS.textMuted};">
        ${t.oneClickLogin}
      </p>
    </div>
    
    <!-- Process Steps -->
    <div style="background-color: ${BRAND_COLORS.bgSecondary}; border-radius: 8px; padding: 24px; margin: 32px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td style="width: 32px; vertical-align: top;">
                  <span style="display: inline-block; width: 24px; height: 24px; background-color: ${BRAND_COLORS.primary}; border-radius: 50%; color: white; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">1</span>
                </td>
                <td style="vertical-align: top;">
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${t.stepOnboarding}</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 13px;">${t.stepOnboardingDesc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td style="width: 32px; vertical-align: top;">
                  <span style="display: inline-block; width: 24px; height: 24px; background-color: ${BRAND_COLORS.primary}; border-radius: 50%; color: white; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">2</span>
                </td>
                <td style="vertical-align: top;">
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${t.stepDesign}</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 13px;">${t.stepDesignDesc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td style="width: 32px; vertical-align: top;">
                  <span style="display: inline-block; width: 24px; height: 24px; background-color: ${BRAND_COLORS.primary}; border-radius: 50%; color: white; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">3</span>
                </td>
                <td style="vertical-align: top;">
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${t.stepFeedback}</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 13px;">${t.stepFeedbackDesc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td style="width: 32px; vertical-align: top;">
                  <span style="display: inline-block; width: 24px; height: 24px; background-color: ${BRAND_COLORS.warning}; border-radius: 50%; color: white; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">4</span>
                </td>
                <td style="vertical-align: top;">
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${t.stepPayment}</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 13px;">${t.stepPaymentDesc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td style="width: 32px; vertical-align: top;">
                  <span style="display: inline-block; width: 24px; height: 24px; background-color: ${BRAND_COLORS.success}; border-radius: 50%; color: white; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">✓</span>
                </td>
                <td style="vertical-align: top;">
                  <p style="margin: 0; font-weight: 600; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${t.stepLive}</p>
                  <p style="margin: 4px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 13px;">${t.stepLiveDesc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    
    ${customer.driveLink ? `
    <!-- Google Drive Link -->
    <div style="text-align: center; padding: 20px; background-color: ${BRAND_COLORS.bgSecondary}; border-radius: 8px; margin-top: 24px;">
      <p style="margin: 0 0 12px; color: ${BRAND_COLORS.textMedium}; font-size: 14px;">
        ${lang === 'nl' ? '📁 Upload je bestanden naar Google Drive' : '📁 Upload your files to Google Drive'}
      </p>
      <a href="${customer.driveLink}" style="color: ${BRAND_COLORS.primary}; font-weight: 600; text-decoration: none; font-size: 14px;">
        ${lang === 'nl' ? 'Open Google Drive →' : 'Open Google Drive →'}
      </a>
    </div>
    ` : ''}
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `🚀 Welkom bij Webstability!`
      : `🚀 Welcome to Webstability!`,
    html: baseTemplate(content, lang),
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
  lang?: EmailLanguage
}) => {
  const lang = customer.lang || 'nl'
  const t = getTranslations(lang)
  
  // Generate magic link for 1-click login
  const magicLink = await generateMagicLinkUrl(customer.projectId)
  
  const content = `
    <!-- Hero -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: ${BRAND_COLORS.textDark};">${t.designReadyTitle}</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMedium}; font-size: 15px;">${t.designReadySubtitle}</p>
    </div>
    
    <!-- Intro -->
    <p style="color: ${BRAND_COLORS.textMedium}; font-size: 15px; line-height: 1.7; margin-bottom: 28px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${customer.name},<br><br>
      ${t.designReadyIntro}
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${customer.previewUrl}" style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
        ${t.viewDesign} →
      </a>
    </div>
    
    <!-- Feedback note -->
    <div style="background-color: ${BRAND_COLORS.bgSecondary}; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; color: ${BRAND_COLORS.textMedium}; font-size: 14px; text-align: center;">
        ${t.feedbackNote}
      </p>
    </div>
    
    <!-- Secondary CTA -->
    <div style="text-align: center; margin-top: 24px;">
      <a href="${magicLink}" style="color: ${BRAND_COLORS.primary}; font-weight: 600; text-decoration: none; font-size: 14px;">
        ${t.viewDashboard} →
      </a>
      <p style="margin: 8px 0 0; font-size: 12px; color: ${BRAND_COLORS.textMuted};">
        ${t.oneClickLogin}
      </p>
    </div>
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `🎨 Je design is klaar!`
      : `🎨 Your design is ready!`,
    html: baseTemplate(content, lang),
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
}, lang: EmailLanguage = 'nl') => {
  const t = getTranslations(lang)
  const magicLink = await generateMagicLinkUrl(customer.projectId)
  
  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${BRAND_COLORS.successBg}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">✓</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">${t.paymentReceivedTitle}</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 15px;">${t.paymentReceivedSubtitle}</p>
    </div>
    
    <!-- Message -->
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${customer.name},<br><br>
      ${t.paymentReceivedIntro}
    </p>
    
    <!-- Amount Card -->
    <div style="background: ${BRAND_COLORS.successBg}; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textMuted}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">${t.amount}</p>
      <p style="margin: 0; color: ${BRAND_COLORS.primary}; font-size: 36px; font-weight: 700;">€${customer.amount.toFixed(2)}</p>
    </div>
    
    ${customer.invoiceUrl ? `
    <a href="${customer.invoiceUrl}" style="display: block; text-align: center; color: ${BRAND_COLORS.primary}; text-decoration: none; font-size: 14px; margin-bottom: 24px;">
      ${lang === 'nl' ? '📄 Download factuur' : '📄 Download invoice'}
    </a>
    ` : ''}
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${magicLink}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        ${t.viewDashboard}
      </a>
    </div>
    
    <p style="text-align: center; color: ${BRAND_COLORS.textLight}; font-size: 13px;">
      ${t.oneClickLogin}
    </p>
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `✓ Betaling ontvangen - €${customer.amount.toFixed(2)}`
      : `✓ Payment received - €${customer.amount.toFixed(2)}`,
    html: baseTemplate(content, lang),
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
}, lang: EmailLanguage = 'nl') => {
  const t = getTranslations(lang)
  
  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${BRAND_COLORS.primaryBg}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">🎉</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">${t.websiteLiveTitle}</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 15px;">${t.websiteLiveSubtitle}</p>
    </div>
    
    <!-- Message -->
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${customer.name},<br><br>
      ${t.websiteLiveIntro}
    </p>
    
    <!-- Domain Card -->
    <div style="background: ${BRAND_COLORS.primaryBg}; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 8px; color: ${BRAND_COLORS.textMuted}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">${lang === 'nl' ? 'Je website' : 'Your website'}</p>
      <p style="margin: 0 0 16px; color: ${BRAND_COLORS.primary}; font-size: 22px; font-weight: 600;">${customer.domain}</p>
      <a href="${customer.liveUrl}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
        ${t.visitWebsite} →
      </a>
    </div>
    
    <!-- Tips -->
    <div style="border-top: 1px solid ${BRAND_COLORS.border}; padding-top: 24px;">
      <p style="margin: 0 0 16px; font-size: 15px; font-weight: 500; color: ${BRAND_COLORS.textDark};">
        ${lang === 'nl' ? 'Wat je nu kunt doen:' : 'What you can do now:'}
      </p>
      <ul style="margin: 0; padding-left: 20px; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 2;">
        <li>${lang === 'nl' ? 'Deel je website op social media' : 'Share your website on social media'}</li>
        <li>${lang === 'nl' ? 'Update je Google Mijn Bedrijf' : 'Update your Google My Business'}</li>
        <li>${lang === 'nl' ? 'Voeg de link toe aan je emailhandtekening' : 'Add the link to your email signature'}</li>
      </ul>
    </div>
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `🎉 Je website ${customer.domain} is live!`
      : `🎉 Your website ${customer.domain} is live!`,
    html: baseTemplate(content, lang),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Password reset email
export const sendPasswordResetEmail = async (customer: {
  email: string
  name: string
  resetUrl: string
  lang?: EmailLanguage
}) => {
  const lang = customer.lang || 'nl'
  const t = getTranslations(lang)
  
  const content = `
    <!-- Hero -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: ${BRAND_COLORS.textDark};">${t.passwordResetTitle}</h1>
    </div>
    
    <!-- Intro -->
    <p style="color: ${BRAND_COLORS.textMedium}; font-size: 15px; line-height: 1.7; margin-bottom: 28px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${customer.name},<br><br>
      ${t.passwordResetIntro}
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${customer.resetUrl}" style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
        ${t.resetPassword} →
      </a>
    </div>
    
    <!-- Notice -->
    <div style="background-color: ${BRAND_COLORS.bgSecondary}; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="margin: 0; color: ${BRAND_COLORS.textMedium}; font-size: 13px;">
        ⏰ ${t.linkExpiry}
      </p>
    </div>
    
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 13px; text-align: center;">
      ${t.notRequested}
    </p>
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `🔐 Wachtwoord resetten`
      : `🔐 Reset your password`,
    html: baseTemplate(content, lang),
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
}, lang: EmailLanguage = 'nl') => {
  const t = getTranslations(lang)
  const magicLink = await generateMagicLinkUrl(customer.projectId)
  
  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: #eff6ff; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">📢</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">${t.phaseUpdateTitle}</h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 15px;">${customer.updateTitle}</p>
    </div>
    
    <!-- Message -->
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${customer.name},
    </p>
    
    <!-- Update Content -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-left: 3px solid ${BRAND_COLORS.info}; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0; color: ${BRAND_COLORS.textMedium}; font-size: 15px; line-height: 1.6; white-space: pre-line;">${customer.updateMessage}</p>
    </div>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${magicLink}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        ${t.viewProject}
      </a>
    </div>
    
    <p style="text-align: center; color: ${BRAND_COLORS.textLight}; font-size: 13px;">
      ${t.oneClickLogin}
    </p>
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `📢 Update: ${customer.updateTitle}`
      : `📢 Update: ${customer.updateTitle}`,
    html: baseTemplate(content, lang),
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
}, lang: EmailLanguage = 'nl') => {
  const t = getTranslations(lang)
  const formattedAmount = new Intl.NumberFormat(lang === 'nl' ? 'nl-NL' : 'en-GB', {
    style: 'currency',
    currency: 'EUR'
  }).format(customer.amount)

  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${BRAND_COLORS.primaryBg}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">💳</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">
        ${lang === 'nl' ? 'Je betaallink is klaar' : 'Your payment link is ready'}
      </h1>
    </div>
    
    <!-- Message -->
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${customer.name},<br><br>
      ${lang === 'nl' 
        ? 'Je design is goedgekeurd! Om door te gaan naar de volgende stap, vragen we je om de betaling te voltooien.'
        : 'Your design has been approved! To proceed to the next step, we kindly ask you to complete the payment.'}
    </p>
    
    <!-- Payment Summary -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">${lang === 'nl' ? 'Project' : 'Project'}</td>
          <td style="padding: 8px 0; text-align: right; color: ${BRAND_COLORS.textDark}; font-weight: 500; font-size: 14px;">${customer.projectName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px;">${lang === 'nl' ? 'Pakket' : 'Package'}</td>
          <td style="padding: 8px 0; text-align: right; color: ${BRAND_COLORS.textDark}; font-weight: 500; font-size: 14px;">${customer.packageName}</td>
        </tr>
        <tr style="border-top: 1px solid ${BRAND_COLORS.border};">
          <td style="padding: 12px 0 4px; color: ${BRAND_COLORS.textDark}; font-weight: 600; font-size: 16px;">${lang === 'nl' ? 'Totaal' : 'Total'}</td>
          <td style="padding: 12px 0 4px; text-align: right; color: ${BRAND_COLORS.primary}; font-weight: 700; font-size: 20px;">${formattedAmount}</td>
        </tr>
      </table>
    </div>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${customer.paymentUrl}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        ${lang === 'nl' ? `Betaal ${formattedAmount}` : `Pay ${formattedAmount}`}
      </a>
    </div>
    
    <p style="text-align: center; color: ${BRAND_COLORS.textLight}; font-size: 13px;">
      ${lang === 'nl' 
        ? 'Na betaling gaan we direct verder met je website.'
        : 'After payment, we\'ll immediately continue with your website.'}
    </p>
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `💳 Betaallink ${customer.projectName} - ${formattedAmount}`
      : `💳 Payment link ${customer.projectName} - ${formattedAmount}`,
    html: baseTemplate(content, lang),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// Deadline reminder email
export const sendDeadlineReminderEmail = async (params: {
  email: string
  name: string
  projectId: string
  phase: 'onboarding' | 'design' | 'feedback' | 'revisie' | 'development' | 'payment' | 'approval' | 'review' | 'live'
  type?: string
  deadline: string
  daysUntil: number
  reminderType: 'upcoming' | 'urgent' | 'overdue'
  action: string
  driveLink?: string
}, lang: EmailLanguage = 'nl') => {
  const t = getTranslations(lang)
  const magicLink = await generateMagicLinkUrl(params.projectId)
  
  // Urgency config for light mode
  const urgencyConfig = {
    upcoming: {
      emoji: '📅',
      title: lang === 'nl' ? 'Deadline herinnering' : 'Deadline reminder',
      color: BRAND_COLORS.warning,
      bgColor: '#fef3c7',
      urgencyText: lang === 'nl' 
        ? `Nog ${params.daysUntil} ${params.daysUntil === 1 ? 'dag' : 'dagen'}`
        : `${params.daysUntil} ${params.daysUntil === 1 ? 'day' : 'days'} left`
    },
    urgent: {
      emoji: '⚠️',
      title: lang === 'nl' ? 'Deadline morgen!' : 'Deadline tomorrow!',
      color: '#ea580c',
      bgColor: '#ffedd5',
      urgencyText: params.daysUntil === 0 
        ? (lang === 'nl' ? 'Vandaag!' : 'Today!')
        : (lang === 'nl' ? 'Morgen!' : 'Tomorrow!')
    },
    overdue: {
      emoji: '🚨',
      title: lang === 'nl' ? 'Actie vereist' : 'Action required',
      color: BRAND_COLORS.error,
      bgColor: '#fee2e2',
      urgencyText: lang === 'nl' 
        ? `${Math.abs(params.daysUntil)} ${Math.abs(params.daysUntil) === 1 ? 'dag' : 'dagen'} te laat`
        : `${Math.abs(params.daysUntil)} ${Math.abs(params.daysUntil) === 1 ? 'day' : 'days'} overdue`
    }
  }
  
  const config = urgencyConfig[params.reminderType]
  const deadlineDate = new Date(params.deadline)
  const formattedDeadline = deadlineDate.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
  
  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${config.bgColor}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">${config.emoji}</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">${config.title}</h1>
      <p style="margin: 0; color: ${config.color}; font-size: 15px; font-weight: 500;">${config.urgencyText}</p>
    </div>
    
    <!-- Message -->
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${params.name},<br><br>
      ${lang === 'nl' 
        ? `We herinneren je aan je project. Om verder te kunnen, vragen we je om ${params.action}.`
        : `We'd like to remind you about your project. To proceed, we kindly ask you to ${params.action}.`}
    </p>
    
    <!-- Deadline Card -->
    <div style="background: ${config.bgColor}; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${lang === 'nl' ? 'Deadline' : 'Deadline'}</p>
            <p style="margin: 0; color: ${BRAND_COLORS.textDark}; font-size: 16px; font-weight: 500;">${formattedDeadline}</p>
          </td>
        </tr>
      </table>
    </div>
    
    ${params.driveLink ? `
    <!-- Drive Link -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 12px; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">
        📁 ${lang === 'nl' ? 'Upload je bestanden' : 'Upload your files'}
      </p>
      <a href="${params.driveLink}" style="color: ${BRAND_COLORS.primary}; text-decoration: none; font-size: 14px;">
        ${lang === 'nl' ? 'Open Google Drive →' : 'Open Google Drive →'}
      </a>
    </div>
    ` : ''}
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${magicLink}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        ${t.viewProject}
      </a>
    </div>
    
    <p style="text-align: center; color: ${BRAND_COLORS.textLight}; font-size: 13px;">
      ${t.oneClickLogin}
    </p>
  `

  return sendEmail({
    to: params.email,
    subject: `${config.emoji} ${config.title}`,
    html: baseTemplate(content, lang),
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
}, lang: EmailLanguage = 'nl') => {
  const t = getTranslations(lang)
  const magicLink = await generateMagicLinkUrl(customer.projectId)
  
  const phaseEmojis: Record<string, string> = {
    'onboarding': '📝',
    'design': '🎨',
    'design_approved': '✅',
    'development': '💻',
    'review': '🔍',
    'live': '🚀',
    'completed': '✅'
  }
  
  const phaseNamesNL: Record<string, string> = {
    'onboarding': 'Onboarding',
    'design': 'Design',
    'design_approved': 'Design goedgekeurd',
    'development': 'Ontwikkeling',
    'review': 'Review',
    'live': 'Website live',
    'completed': 'Afgerond'
  }
  
  const phaseNamesEN: Record<string, string> = {
    'onboarding': 'Onboarding',
    'design': 'Design',
    'design_approved': 'Design approved',
    'development': 'Development',
    'review': 'Review',
    'live': 'Website live',
    'completed': 'Completed'
  }

  const emoji = phaseEmojis[customer.newPhase] || '📌'
  const phaseName = lang === 'nl' 
    ? (phaseNamesNL[customer.newPhase] || customer.newPhase)
    : (phaseNamesEN[customer.newPhase] || customer.newPhase)

  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${BRAND_COLORS.primaryBg}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">${emoji}</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">
        ${lang === 'nl' ? 'Nieuwe fase' : 'New phase'}: ${phaseName}
      </h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 15px;">
        ${lang === 'nl' ? 'Je project gaat vooruit!' : 'Your project is progressing!'}
      </p>
    </div>
    
    <!-- Message -->
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${customer.name},<br><br>
      ${lang === 'nl' 
        ? `Je project <strong style="color: ${BRAND_COLORS.textDark};">${customer.projectName}</strong> is naar een nieuwe fase gegaan.`
        : `Your project <strong style="color: ${BRAND_COLORS.textDark};">${customer.projectName}</strong> has moved to a new phase.`}
    </p>
    
    <!-- Phase Description -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-left: 3px solid ${BRAND_COLORS.primary}; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px; font-weight: 500; color: ${BRAND_COLORS.textDark}; font-size: 14px;">${emoji} ${phaseName}</p>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6;">${customer.phaseDescription}</p>
    </div>
    
    ${customer.nextSteps.length > 0 ? `
    <!-- Next Steps -->
    <div style="margin-bottom: 24px;">
      <p style="margin: 0 0 12px; font-size: 15px; font-weight: 500; color: ${BRAND_COLORS.textDark};">
        ${lang === 'nl' ? 'Volgende stappen:' : 'Next steps:'}
      </p>
      <ul style="margin: 0; padding-left: 20px; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 2;">
        ${customer.nextSteps.map(step => `<li>${step}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${magicLink}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        ${t.viewProject}
      </a>
    </div>
    
    <p style="text-align: center; color: ${BRAND_COLORS.textLight}; font-size: 13px;">
      ${t.oneClickLogin}
    </p>
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `${emoji} ${customer.projectName} - Nieuwe fase: ${phaseName}`
      : `${emoji} ${customer.projectName} - New phase: ${phaseName}`,
    html: baseTemplate(content, lang),
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
}, lang: EmailLanguage = 'nl'): Promise<EmailResult> => {
  const t = getTranslations(lang)
  const magicLinkUrl = await generateMagicLinkUrl(customer.projectId)

  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${BRAND_COLORS.successBg}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">✓</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">
        ${lang === 'nl' ? 'Onboarding voltooid!' : 'Onboarding complete!'}
      </h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 15px;">
        ${lang === 'nl' ? `Bedankt, ${customer.name}!` : `Thank you, ${customer.name}!`}
      </p>
    </div>
    
    <!-- Message -->
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
      ${lang === 'nl' 
        ? `We hebben je informatie ontvangen voor <strong style="color: ${BRAND_COLORS.textDark};">${customer.businessName || 'je project'}</strong>. Ons team gaat nu aan de slag met het ontwerp.`
        : `We've received your information for <strong style="color: ${BRAND_COLORS.textDark};">${customer.businessName || 'your project'}</strong>. Our team will now start working on your design.`}
    </p>
    
    <!-- Timeline -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 500;">
        📅 ${lang === 'nl' ? 'Verwachte levertijd' : 'Expected delivery'}
      </p>
      <p style="margin: 0; color: ${BRAND_COLORS.primary}; font-size: 18px; font-weight: 600;">
        ${lang === 'nl' ? '5-7 werkdagen' : '5-7 business days'}
      </p>
    </div>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${magicLinkUrl}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        ${t.viewDashboard}
      </a>
    </div>
    
    <p style="text-align: center; color: ${BRAND_COLORS.textLight}; font-size: 13px;">
      ${t.oneClickLogin}
    </p>
  `

  return sendEmail({
    to: customer.email,
    subject: lang === 'nl' 
      ? `✓ Onboarding voltooid - ${customer.businessName || customer.projectId}`
      : `✓ Onboarding complete - ${customer.businessName || customer.projectId}`,
    html: baseTemplate(content, lang),
    replyTo: SMTP_USER || 'info@webstability.nl',
  })
}

// ===========================================
// Developer Notification Email
// ===========================================

export const sendDeveloperNotificationEmail = async (data: {
  type: 'new_design_request' | 'feedback_received' | 'payment_received' | 'new_message'
  projectId: string
  businessName: string
  customerName: string
  customerEmail: string
  message?: string
}): Promise<EmailResult> => {
  const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL || 'info@webstability.nl'
  const BASE_URL = process.env.SITE_URL || 'https://webstability.nl'
  const dashboardUrl = `${BASE_URL}/developer`

  const typeConfig: Record<string, { emoji: string; title: string }> = {
    'new_design_request': { emoji: '🎨', title: 'Nieuw Design Verzoek' },
    'feedback_received': { emoji: '💬', title: 'Feedback Ontvangen' },
    'payment_received': { emoji: '💰', title: 'Betaling Ontvangen' },
    'new_message': { emoji: '📩', title: 'Nieuw Bericht' }
  }

  const config = typeConfig[data.type] || typeConfig['new_design_request']

  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${BRAND_COLORS.primaryBg}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">${config.emoji}</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">
        ${config.title}
      </h1>
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 15px;">
        ${data.businessName}
      </p>
    </div>

    <!-- Details -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Project ID</td>
          <td style="padding: 8px 0; text-align: right; color: ${BRAND_COLORS.textDark}; font-family: monospace;">${data.projectId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Klant</td>
          <td style="padding: 8px 0; text-align: right; color: ${BRAND_COLORS.textDark}; font-weight: 500;">${data.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted};">Email</td>
          <td style="padding: 8px 0; text-align: right;">
            <a href="mailto:${data.customerEmail}" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">${data.customerEmail}</a>
          </td>
        </tr>
      </table>
    </div>

    ${data.message ? `
    <!-- Message -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-left: 3px solid ${BRAND_COLORS.primary}; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0; color: ${BRAND_COLORS.textMedium}; font-size: 14px; line-height: 1.6;">
        ${data.message}
      </p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${dashboardUrl}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        Open Dashboard
      </a>
    </div>
  `

  return sendEmail({
    to: DEVELOPER_EMAIL,
    subject: `${config.emoji} ${config.title} - ${data.businessName}`,
    html: baseTemplate(content, 'nl'),
  })
}

// Change Request Status Update Email
export const sendChangeRequestUpdateEmail = async (data: {
  email: string
  name: string
  projectId: string
  businessName: string
  changeDescription: string
  status: 'pending' | 'in_progress' | 'completed'
  response?: string
}, lang: EmailLanguage = 'nl') => {
  const t = getTranslations(lang)
  const magicLink = await generateMagicLinkUrl(data.projectId)
  
  const statusConfig = {
    pending: {
      emoji: '🔔',
      title: lang === 'nl' ? t.changeRequestReceived : 'Change request received',
      message: lang === 'nl' 
        ? 'We hebben je wijzigingsverzoek ontvangen en gaan ermee aan de slag.'
        : 'We\'ve received your change request and will get started on it.'
    },
    in_progress: {
      emoji: '⚡',
      title: lang === 'nl' ? t.changeRequestProgress : 'Change in progress',
      message: lang === 'nl' 
        ? 'We zijn bezig met je wijziging. Je hoort van ons zodra deze klaar is.'
        : 'We\'re working on your change. We\'ll let you know when it\'s done.'
    },
    completed: {
      emoji: '✓',
      title: lang === 'nl' ? t.changeRequestCompleted : 'Change completed',
      message: lang === 'nl' 
        ? 'Je wijziging is doorgevoerd! Bekijk het resultaat op je website.'
        : 'Your change has been completed! Check the result on your website.'
    }
  }

  const config = statusConfig[data.status]

  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background: ${data.status === 'completed' ? BRAND_COLORS.successBg : BRAND_COLORS.bgSecondary}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">${config.emoji}</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: ${BRAND_COLORS.textDark};">${config.title}</h1>
    </div>
    
    <!-- Message -->
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
      ${lang === 'nl' ? 'Hoi' : 'Hi'} ${data.name},<br><br>
      ${config.message}
    </p>
    
    <!-- Request -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-left: 3px solid ${BRAND_COLORS.primary}; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${lang === 'nl' ? t.yourRequest : 'Your request'}</p>
      <p style="margin: 0; color: ${BRAND_COLORS.textMedium}; font-size: 14px; line-height: 1.6;">${data.changeDescription}</p>
    </div>
    
    ${data.response ? `
    <!-- Response -->
    <div style="background: ${BRAND_COLORS.bgSecondary}; border-left: 3px solid ${BRAND_COLORS.info}; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">💬 ${lang === 'nl' ? t.developerResponse : 'Developer response'}</p>
      <p style="margin: 0; color: ${BRAND_COLORS.textMedium}; font-size: 14px; line-height: 1.6;">${data.response}</p>
    </div>
    ` : ''}
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${magicLink}" style="display: inline-block; background: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
        ${t.viewDashboard}
      </a>
    </div>
    
    <p style="text-align: center; color: ${BRAND_COLORS.textLight}; font-size: 13px;">
      ${t.oneClickLogin}
    </p>
  `

  return sendEmail({
    to: data.email,
    subject: `${config.emoji} ${config.title}`,
    html: baseTemplate(content, lang),
    replyTo: SMTP_USER || 'info@webstability.nl',
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
  sendDeveloperNotificationEmail,
  sendChangeRequestUpdateEmail,
}

