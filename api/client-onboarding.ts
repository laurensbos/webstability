import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProject, setProject } from './lib/database'

/**
 * API Endpoint: /api/client-onboarding
 * 
 * Handles saving and retrieving client onboarding data
 * for the new service-specific onboarding flow
 */

// Generate unique project ID
function generateProjectId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

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
      if (!projectId || projectId === 'new') {
        return res.status(400).json({ error: 'Project ID required' })
      }

      const project = await getProject(projectId as string)
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Return onboarding-specific data
      return res.status(200).json({
        projectId: project.id,
        serviceType: project.type,
        formData: project.onboardingData || {},
        currentPhase: project.status,
        canEdit: project.status === 'onboarding' || project.status === 'intake',
        messages: [], // TODO: Get messages from database
        timeline: getTimeline(project.type, project.status),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      })
    }

    // POST: Save/update onboarding data
    if (req.method === 'POST') {
      const { serviceType, formData, currentStep, currentPhase } = req.body

      // Creating new project
      if (!projectId || projectId === 'new') {
        const newId = generateProjectId()
        
        const newProject = {
          id: newId,
          status: 'intake' as const,
          type: serviceType || 'website',
          packageType: formData?.package || 'starter',
          customer: {
            name: formData?.contactName || '',
            email: formData?.contactEmail || '',
            phone: formData?.contactPhone || '',
            companyName: formData?.businessName || ''
          },
          paymentStatus: 'pending' as const,
          onboardingData: {
            ...formData,
            currentStep,
            lastUpdated: new Date().toISOString()
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        await setProject(newProject)

        return res.status(201).json({
          success: true,
          projectId: newId,
          message: 'Project aangemaakt'
        })
      }

      // Update existing project
      const existingProject = await getProject(projectId as string)
      
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Check if still editable
      if (existingProject.status !== 'onboarding' && existingProject.status !== 'intake') {
        return res.status(403).json({ 
          error: 'Project kan niet meer bewerkt worden',
          canEdit: false 
        })
      }

      // Update project
      const updatedProject = {
        ...existingProject,
        type: serviceType || existingProject.type,
        customer: {
          name: formData?.contactName || existingProject.customer.name,
          email: formData?.contactEmail || existingProject.customer.email,
          phone: formData?.contactPhone || existingProject.customer.phone,
          companyName: formData?.businessName || existingProject.customer.companyName
        },
        onboardingData: {
          ...existingProject.onboardingData,
          ...formData,
          currentStep,
          lastUpdated: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      }

      await setProject(updatedProject)

      return res.status(200).json({
        success: true,
        projectId: projectId,
        message: 'Voortgang opgeslagen'
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Client onboarding API error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}

// Helper function to generate timeline based on service type
function getTimeline(serviceType: string, currentStatus: string) {
  const baseSteps = [
    { 
      id: 'intake', 
      title: 'Intake', 
      description: 'Verzamel alle informatie over je project',
      estimatedDays: 2,
      status: currentStatus === 'intake' ? 'active' : 
              ['design', 'development', 'review', 'live'].includes(currentStatus) ? 'completed' : 'pending'
    },
    { 
      id: 'design', 
      title: 'Design', 
      description: 'Ontwerp van je project',
      estimatedDays: serviceType === 'logo' ? 5 : 7,
      status: currentStatus === 'design' ? 'active' : 
              ['development', 'review', 'live'].includes(currentStatus) ? 'completed' : 'pending'
    },
  ]

  if (serviceType === 'website' || serviceType === 'webshop') {
    return [
      ...baseSteps,
      { 
        id: 'development', 
        title: 'Development', 
        description: 'Bouwen van je website',
        estimatedDays: serviceType === 'webshop' ? 14 : 7,
        status: currentStatus === 'development' ? 'active' : 
                ['review', 'live'].includes(currentStatus) ? 'completed' : 'pending'
      },
      { 
        id: 'review', 
        title: 'Review', 
        description: 'Jouw feedback verwerken',
        estimatedDays: 3,
        status: currentStatus === 'review' ? 'active' : 
                currentStatus === 'live' ? 'completed' : 'pending'
      },
      { 
        id: 'live', 
        title: 'Live', 
        description: 'Je website gaat live!',
        estimatedDays: 1,
        status: currentStatus === 'live' ? 'completed' : 'pending'
      }
    ]
  } else if (serviceType === 'drone') {
    return [
      { 
        id: 'intake', 
        title: 'Intake', 
        description: 'Projectdetails en planning',
        estimatedDays: 2,
        status: currentStatus === 'intake' ? 'active' : 'completed'
      },
      { 
        id: 'development', 
        title: 'Opname', 
        description: 'Drone opnames maken',
        estimatedDays: 1,
        status: currentStatus === 'development' ? 'active' : 'pending'
      },
      { 
        id: 'review', 
        title: 'Bewerking', 
        description: 'Editing en nabewerking',
        estimatedDays: 5,
        status: currentStatus === 'review' ? 'active' : 'pending'
      },
      { 
        id: 'live', 
        title: 'Levering', 
        description: 'Bestanden worden geleverd',
        estimatedDays: 1,
        status: currentStatus === 'live' ? 'completed' : 'pending'
      }
    ]
  } else if (serviceType === 'logo') {
    return [
      ...baseSteps,
      { 
        id: 'review', 
        title: 'Feedback', 
        description: 'Revisies verwerken',
        estimatedDays: 3,
        status: currentStatus === 'review' ? 'active' : 'pending'
      },
      { 
        id: 'live', 
        title: 'Levering', 
        description: 'Bestanden in alle formaten',
        estimatedDays: 1,
        status: currentStatus === 'live' ? 'completed' : 'pending'
      }
    ]
  }

  return baseSteps
}
