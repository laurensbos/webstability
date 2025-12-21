import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProject, setProject } from './lib/database.js'
import { sendDeveloperNotificationEmail, isSmtpConfigured } from './lib/smtp.js'

/**
 * API Endpoint: /api/client-onboarding-submit
 * 
 * Handles final submission of client onboarding
 * Project stays in 'onboarding' phase - client must click "Start Design" after uploading to Drive
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

    // Project stays in onboarding - client must click "Start Design" after uploading files to Drive
    const nextStatus = 'onboarding'

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

    // Create Google Drive folder if it doesn't exist yet
    let driveLink = (updatedProject as any).googleDriveUrl || updatedProject.onboardingData?.driveFolderLink
    if (!driveLink && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_DRIVE_PARENT_FOLDER) {
      try {
        const driveResponse = await fetch(`${process.env.SITE_URL || 'https://webstability.nl'}/api/drive/create-folder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: projectId,
            projectName: formData?.businessName || updatedProject.customer?.companyName || updatedProject.customer?.name || '',
            customerEmail: formData?.contactEmail || updatedProject.customer?.email
          })
        })
        
        if (driveResponse.ok) {
          const driveData = await driveResponse.json()
          driveLink = driveData.folderLink
          // Update project with Drive folder link
          ;(updatedProject as any).googleDriveUrl = driveData.folderLink
          updatedProject.onboardingData = {
            ...updatedProject.onboardingData,
            driveFolderLink: driveData.folderLink,
            driveFolderId: driveData.folderId
          }
          await setProject(updatedProject)
          console.log(`✅ Google Drive folder created for ${projectId}: ${driveData.folderLink}`)
        } else {
          console.warn('Google Drive folder creation failed:', await driveResponse.text())
        }
      } catch (driveError) {
        console.error('Google Drive folder creation error:', driveError)
      }
    }

    // Note: Onboarding complete email is sent when client clicks "Start Design" in the dashboard
    // This is handled in /api/project/[id]/ready-for-design

    // Notify developer that onboarding form is completed (but not yet ready for design)
    if (isSmtpConfigured()) {
      try {
        await sendDeveloperNotificationEmail({
          type: 'new_design_request',
          projectId: projectId as string,
          businessName: formData?.businessName || project.customer?.companyName || 'Nieuw project',
          customerName: formData?.contactName || project.customer?.name || 'Klant',
          customerEmail: formData?.contactEmail || project.customer?.email,
          message: `${formData?.contactName || 'Een klant'} heeft de onboarding vragen ingevuld. Wacht op bevestiging dat bestanden zijn geüpload.`
        })
        console.log('Developer notification email sent')
      } catch (emailError) {
        console.error('Failed to send developer notification:', emailError)
      }
    }

    return res.status(200).json({
      success: true,
      projectId: projectId,
      message: 'Onboarding succesvol ingediend! Upload nu je bestanden naar Google Drive.',
      nextPhase: nextStatus,
      canEdit: false,
      onboardingComplete: true,
      googleDriveUrl: driveLink || null
    })
  } catch (error) {
    console.error('Submit onboarding error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}
