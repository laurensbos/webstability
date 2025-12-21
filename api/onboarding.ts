import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProject, setProject } from './lib/database.js'
import type { Project } from './lib/database.js'

/**
 * API Endpoint: /api/onboarding
 * 
 * Legacy endpoint for client onboarding data - redirects to client-onboarding
 * Handles GET for retrieving and POST for saving onboarding data
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { projectId } = req.query

    // GET: Retrieve onboarding data
    if (req.method === 'GET') {
      if (!projectId || typeof projectId !== 'string') {
        return res.status(400).json({ error: 'Project ID required' })
      }

      const project = await getProject(projectId)
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Return onboarding data in a format compatible with the frontend
      const onboardingData = project.onboardingData || {}
      return res.status(200).json({
        projectId: project.id,
        businessName: project.customer?.companyName || onboardingData.businessName || '',
        contactName: project.customer?.name || '',
        contactEmail: project.customer?.email || '',
        contactPhone: project.customer?.phone || '',
        serviceType: project.type,
        formData: onboardingData,
        submittedAt: onboardingData.submittedAt,
        isComplete: onboardingData.isComplete || false,
        googleDriveUrl: onboardingData.googleDriveUrl,
        ...onboardingData
      })
    }

    // POST: Save onboarding data
    if (req.method === 'POST') {
      const data = req.body
      const id = data.projectId || projectId

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Project ID required' })
      }

      // Get existing project
      const project = await getProject(id)
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Update onboarding data
      const updatedProject: Project = {
        ...project,
        onboardingData: {
          ...(project.onboardingData || {}),
          ...data
        },
        updatedAt: new Date().toISOString()
      }

      await setProject(updatedProject)

      return res.status(200).json({
        success: true,
        projectId: id,
        message: 'Onboarding data saved'
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (error) {
    console.error('Onboarding API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
