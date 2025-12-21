import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProject, setProject } from './lib/database.js'
import { sendDeveloperNotificationEmail, isSmtpConfigured } from './lib/smtp.js'

/**
 * API Endpoint: /api/client-onboarding-submit
 * 
 * Handles final submission of client onboarding
 * When client gives approval, project moves to 'design' phase
 * Developer receives email notification
 */

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

  try {
    const { projectId } = req.query
    const { serviceType, formData, approvedForDesign } = req.body

    if (!projectId || projectId === 'new') {
      return res.status(400).json({ error: 'Project ID required for submission' })
    }

    const project = await getProject(projectId as string)
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    // Check if project can be submitted
    if (project.status !== 'onboarding' && project.status !== 'intake') {
      return res.status(403).json({ 
        error: 'Project is al ingediend',
        canEdit: false 
      })
    }

    // Determine next status based on approval
    // If client approved for design, move directly to 'design' phase
    const nextStatus = approvedForDesign ? 'design' : 'onboarding'

    // Update project with final data
    const updatedProject = {
      ...project,
      status: nextStatus as any,
      type: serviceType || project.type,
      customer: {
        name: formData?.contactName || project.customer.name,
        email: formData?.contactEmail || project.customer.email,
        phone: formData?.contactPhone || project.customer.phone,
        companyName: formData?.businessName || project.customer.companyName
      },
      onboardingData: {
        ...project.onboardingData,
        ...formData,
        submittedAt: new Date().toISOString(),
        isComplete: true,
        approvedForDesign: approvedForDesign || false,
        approvedAt: approvedForDesign ? new Date().toISOString() : undefined
      },
      updatedAt: new Date().toISOString()
    }

    await setProject(updatedProject)

    // Note: Onboarding complete email is sent when client clicks "Start Design" in the dashboard
    // This is handled in /api/project/[id]/ready-for-design

    // If approved for design, notify the developer
    if (approvedForDesign && isSmtpConfigured()) {
      try {
        await sendDeveloperNotificationEmail({
          type: 'new_design_request',
          projectId: projectId as string,
          businessName: formData?.businessName || project.customer?.companyName || 'Nieuw project',
          customerName: formData?.contactName || project.customer?.name || 'Klant',
          customerEmail: formData?.contactEmail || project.customer?.email,
          message: `${formData?.contactName || 'Een klant'} heeft de onboarding voltooid en akkoord gegeven. Het project staat nu klaar in de design fase.`
        })
        console.log('Developer notification email sent')
      } catch (emailError) {
        console.error('Failed to send developer notification:', emailError)
      }
    }

    return res.status(200).json({
      success: true,
      projectId: projectId,
      message: approvedForDesign 
        ? 'Akkoord gegeven! Je project gaat nu naar de design fase.'
        : 'Onboarding succesvol ingediend!',
      nextPhase: nextStatus,
      canEdit: false,
      movedToDesign: approvedForDesign
    })
  } catch (error) {
    console.error('Submit onboarding error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}
