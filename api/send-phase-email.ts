/**
 * Send Phase Change Email API
 * 
 * POST /api/send-phase-email
 * Body: {
 *   projectId: string,
 *   projectName: string,
 *   customerEmail: string,
 *   customerName: string,
 *   newPhase: string
 * }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sendPhaseChangeEmail } from './lib/smtp.js'
import { logEmailSent } from './developer/email-log.js'

// Phase descriptions and next steps
const phaseInfo: Record<string, { description: string; nextSteps: string[] }> = {
  'onboarding': {
    description: 'Je project is aangemaakt en we verzamelen alle informatie die we nodig hebben om je website te maken.',
    nextSteps: [
      'Vul de onboarding vragenlijst in',
      'Lever je logo en huisstijl aan',
      'Deel voorbeeldwebsites die je aanspreken'
    ]
  },
  'design': {
    description: 'Ons design team werkt aan het visuele ontwerp van je website. Je ontvangt binnenkort een preview.',
    nextSteps: [
      'Je ontvangt binnen 3-5 werkdagen een design preview',
      'Bekijk het ontwerp en geef feedback',
      'Wij verwerken je feedback in het finale design'
    ]
  },
  'design_approved': {
    description: 'Je hebt het design goedgekeurd! 🎨 Na ontvangst van je betaling starten we direct met de bouw van je website.',
    nextSteps: [
      'Voltooi de betaling via de betaallink',
      'Na betaling starten we binnen 1 werkdag met bouwen',
      'Je ontvangt een bevestiging zodra de bouw begint'
    ]
  },
  'development': {
    description: 'Je betaling is ontvangen! Onze developers bouwen nu je website met alle functionaliteiten.',
    nextSteps: [
      'Je website wordt volledig gebouwd',
      'Alle pagina\'s worden gemaakt',
      'Formulieren en contactfuncties worden ingesteld'
    ]
  },
  'review': {
    description: 'Je website is klaar voor review! Bekijk alles en geef je laatste feedback voor we live gaan.',
    nextSteps: [
      'Test alle pagina\'s en functies',
      'Controleer teksten en afbeeldingen',
      'Geef je goedkeuring om live te gaan'
    ]
  },
  'live': {
    description: '🎉 Gefeliciteerd! Je website is nu live en bereikbaar voor iedereen!',
    nextSteps: [
      'Deel je website met vrienden en klanten',
      'Check je email voor inloggegevens',
      'Neem contact op bij vragen'
    ]
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
  
  try {
    const { projectId, projectName, customerEmail, customerName, newPhase } = req.body
    
    if (!projectId || !customerEmail || !customerName || !newPhase) {
      return res.status(400).json({
        success: false,
        error: 'Verplichte velden ontbreken'
      })
    }
    
    const info = phaseInfo[newPhase] || {
      description: 'Je project is naar een nieuwe fase gegaan.',
      nextSteps: []
    }
    
    console.log(`[PhaseEmail] Versturen naar ${customerEmail} voor fase: ${newPhase}`)
    
    let emailSuccess = true
    let emailError: string | undefined
    
    try {
      await sendPhaseChangeEmail({
        email: customerEmail,
        name: customerName,
        projectId,
        projectName: projectName || 'Je Website',
        newPhase,
        phaseDescription: info.description,
        nextSteps: info.nextSteps
      })
      console.log(`[PhaseEmail] ✅ Email verstuurd`)
    } catch (sendError) {
      emailSuccess = false
      emailError = sendError instanceof Error ? sendError.message : 'Onbekende fout'
      console.error('[PhaseEmail] Email versturen mislukt:', sendError)
    }
    
    // Log email for developer dashboard
    const phaseLabels: Record<string, string> = {
      onboarding: 'Onboarding',
      design: 'Design',
      design_approved: 'Design Goedgekeurd',
      development: 'Development',
      review: 'Review',
      live: 'Live'
    }
    
    await logEmailSent({
      projectId,
      projectName: projectName || 'Je Website',
      recipientEmail: customerEmail,
      recipientName: customerName,
      type: 'phase_change',
      subject: `Je project gaat naar ${phaseLabels[newPhase] || newPhase}`,
      details: `Fase veranderd naar: ${phaseLabels[newPhase] || newPhase}`,
      success: emailSuccess,
      error: emailError
    })

    // If phase is 'live', schedule Trustpilot review request for 7 days later
    if (newPhase === 'live') {
      try {
        // Always use production URL for API calls
        const baseUrl = process.env.SITE_URL || 'https://webstability.nl'
        
        await fetch(`${baseUrl}/api/review-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            customerEmail,
            customerName,
            websiteUrl: req.body.websiteUrl,
            delay: true // Schedule for later
          })
        })
        
        console.log(`[PhaseEmail] Trustpilot review gepland voor project ${projectId}`)
      } catch (reviewError) {
        console.error('[PhaseEmail] Review scheduling error:', reviewError)
        // Don't fail the main request
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Email verstuurd'
    })
    
  } catch (error) {
    console.error('[PhaseEmail] Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Er ging iets mis'
    })
  }
}
