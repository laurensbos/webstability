import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProject, setProject } from './lib/database.js'
import { sendOnboardingCompleteEmail } from './lib/smtp.js'

/**
 * API Endpoint: /api/client-onboarding-submit
 * 
 * Handles final submission of client onboarding
 * Changes project status from intake to design
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
    const { serviceType, formData } = req.body

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

    // Update project with final data - status stays onboarding until developer reviews
    // The developer will move it to design phase after reviewing
    const updatedProject = {
      ...project,
      status: 'onboarding' as const, // Keep as onboarding until developer reviews
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
        isComplete: true
      },
      updatedAt: new Date().toISOString()
    }

    await setProject(updatedProject)

    // Send confirmation email to client with dashboard link
    try {
      await sendOnboardingCompleteEmail({
        name: formData?.contactName || project.customer?.name || 'Klant',
        email: formData?.contactEmail || project.customer?.email,
        projectId: projectId as string,
        businessName: formData?.businessName || project.customer?.companyName
      })
      console.log(`Onboarding complete email sent to ${formData?.contactEmail || project.customer?.email}`)
    } catch (emailError) {
      console.error('Failed to send onboarding complete email:', emailError)
      // Don't fail the request if email fails
    }

    return res.status(200).json({
      success: true,
      projectId: projectId,
      message: 'Onboarding succesvol ingediend! We reviewen je gegevens en nemen contact op.',
      nextPhase: 'onboarding', // Developer will move to design after review
      canEdit: false
    })
  } catch (error) {
    console.error('Submit onboarding error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}
