import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

interface LogoConcept {
  id: string
  name: string
  description?: string
  previewUrl: string
  createdAt: string
  isSelected?: boolean
  selectedAt?: string
}

interface LogoRevision {
  id: string
  round: number
  conceptId: string
  feedback: string
  feedbackAt: string
  revisedPreviewUrl?: string
  revisedAt?: string
  status: 'pending' | 'in_progress' | 'completed'
}

interface LogoDeliverable {
  id: string
  name: string
  format: string
  downloadUrl: string
  size?: string
  variant?: 'primary' | 'secondary' | 'icon' | 'dark' | 'light' | 'monochrome'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query
  const projectId = Array.isArray(id) ? id[0] : id

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' })
  }

  try {
    // GET - Get logo project data
    if (req.method === 'GET') {
      const project = await redis.get(`project:${projectId}`) as Record<string, unknown> | null

      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Return logo-specific data
      return res.status(200).json({
        success: true,
        logoData: {
          logoPhase: project.logoPhase || 'onboarding',
          concepts: project.logoConcepts || [],
          selectedConceptId: project.selectedConceptId,
          conceptSelectedAt: project.conceptSelectedAt,
          revisions: project.logoRevisions || [],
          currentRevisionRound: project.currentRevisionRound || 1,
          maxRevisionRounds: project.maxRevisionRounds || 3,
          deliverables: project.logoDeliverables || [],
          finalApproved: project.logoFinalApproved,
          finalApprovedAt: project.logoFinalApprovedAt,
        }
      })
    }

    // POST - Select concept or submit feedback
    if (req.method === 'POST') {
      const { action, conceptId, feedback, round } = req.body as {
        action: 'select_concept' | 'submit_feedback' | 'approve_final'
        conceptId?: string
        feedback?: string
        round?: number
      }

      const project = await redis.get(`project:${projectId}`) as Record<string, unknown> | null

      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      const now = new Date().toISOString()

      switch (action) {
        case 'select_concept': {
          if (!conceptId) {
            return res.status(400).json({ error: 'Concept ID is required' })
          }

          const concepts = (project.logoConcepts || []) as LogoConcept[]
          const updatedConcepts = concepts.map(c => ({
            ...c,
            isSelected: c.id === conceptId,
            selectedAt: c.id === conceptId ? now : c.selectedAt
          }))

          await redis.set(`project:${projectId}`, {
            ...project,
            logoConcepts: updatedConcepts,
            selectedConceptId: conceptId,
            conceptSelectedAt: now,
            logoPhase: 'revision', // Move to revision phase
            currentRevisionRound: 1,
            updatedAt: now,
          })

          return res.status(200).json({
            success: true,
            message: 'Concept selected successfully',
            selectedConceptId: conceptId
          })
        }

        case 'submit_feedback': {
          if (!feedback) {
            return res.status(400).json({ error: 'Feedback is required' })
          }

          const revisions = (project.logoRevisions || []) as LogoRevision[]
          const currentRound = round || (project.currentRevisionRound as number) || 1
          const selectedConceptId = project.selectedConceptId as string

          const newRevision: LogoRevision = {
            id: `rev_${Date.now()}`,
            round: currentRound,
            conceptId: selectedConceptId,
            feedback,
            feedbackAt: now,
            status: 'pending'
          }

          await redis.set(`project:${projectId}`, {
            ...project,
            logoRevisions: [...revisions, newRevision],
            currentRevisionRound: currentRound + 1,
            updatedAt: now,
          })

          // TODO: Send notification to developer about new feedback

          return res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully',
            revision: newRevision
          })
        }

        case 'approve_final': {
          await redis.set(`project:${projectId}`, {
            ...project,
            logoPhase: 'delivered',
            logoFinalApproved: true,
            logoFinalApprovedAt: now,
            status: 'live', // Mark project as completed
            updatedAt: now,
          })

          // TODO: Generate/copy final deliverables to project

          return res.status(200).json({
            success: true,
            message: 'Logo approved! Final files are ready for download.'
          })
        }

        default:
          return res.status(400).json({ error: 'Invalid action' })
      }
    }

    // PUT - Developer actions (add concepts, complete revision, add deliverables)
    if (req.method === 'PUT') {
      const { action } = req.body as { action: string }

      const project = await redis.get(`project:${projectId}`) as Record<string, unknown> | null

      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      const now = new Date().toISOString()

      switch (action) {
        case 'add_concepts': {
          const { concepts } = req.body as { concepts: LogoConcept[] }
          
          if (!concepts || !Array.isArray(concepts)) {
            return res.status(400).json({ error: 'Concepts array is required' })
          }

          // Add IDs and timestamps
          const newConcepts = concepts.map((c, i) => ({
            ...c,
            id: c.id || `concept_${Date.now()}_${i}`,
            createdAt: now
          }))

          await redis.set(`project:${projectId}`, {
            ...project,
            logoConcepts: newConcepts,
            logoPhase: 'concepts',
            updatedAt: now,
          })

          // TODO: Send notification to client about new concepts

          return res.status(200).json({
            success: true,
            message: 'Concepts added successfully',
            concepts: newConcepts
          })
        }

        case 'complete_revision': {
          const { revisionId, revisedPreviewUrl } = req.body as { 
            revisionId: string 
            revisedPreviewUrl: string 
          }

          const revisions = (project.logoRevisions || []) as LogoRevision[]
          const updatedRevisions = revisions.map(r => 
            r.id === revisionId 
              ? { ...r, status: 'completed' as const, revisedPreviewUrl, revisedAt: now }
              : r
          )

          // Check if this is the last revision or if we should go to final
          const maxRounds = (project.maxRevisionRounds as number) || 3
          const currentRound = (project.currentRevisionRound as number) || 1
          const shouldGoToFinal = currentRound > maxRounds

          await redis.set(`project:${projectId}`, {
            ...project,
            logoRevisions: updatedRevisions,
            logoPhase: shouldGoToFinal ? 'final' : 'revision',
            updatedAt: now,
          })

          // TODO: Send notification to client

          return res.status(200).json({
            success: true,
            message: 'Revision completed'
          })
        }

        case 'mark_final': {
          await redis.set(`project:${projectId}`, {
            ...project,
            logoPhase: 'final',
            updatedAt: now,
          })

          return res.status(200).json({
            success: true,
            message: 'Marked as ready for final approval'
          })
        }

        case 'add_deliverables': {
          const { deliverables } = req.body as { deliverables: LogoDeliverable[] }

          if (!deliverables || !Array.isArray(deliverables)) {
            return res.status(400).json({ error: 'Deliverables array is required' })
          }

          const newDeliverables = deliverables.map((d, i) => ({
            ...d,
            id: d.id || `file_${Date.now()}_${i}`
          }))

          await redis.set(`project:${projectId}`, {
            ...project,
            logoDeliverables: newDeliverables,
            updatedAt: now,
          })

          return res.status(200).json({
            success: true,
            message: 'Deliverables added',
            deliverables: newDeliverables
          })
        }

        default:
          return res.status(400).json({ error: 'Invalid action' })
      }
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Logo API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
