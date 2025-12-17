import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface ChatMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
}

interface Project {
  id: string
  messages?: ChatMessage[]
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Get project ID from URL path: /api/project/[id]/messages
  const url = req.url || ''
  const pathMatch = url.match(/\/api\/project\/([^/]+)\/messages/)
  const projectId = pathMatch?.[1]

  if (!projectId) {
    return res.status(400).json({ success: false, message: 'Project ID verplicht' })
  }

  if (!kv) {
    return res.status(503).json({ success: false, message: 'Database niet geconfigureerd' })
  }

  try {
    const project = await kv.get<Project>(`project:${projectId}`)
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden' })
    }

    if (req.method === 'GET') {
      // Return messages for this project
      return res.status(200).json({
        success: true,
        messages: project.messages || []
      })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })

  } catch (error) {
    console.error('Project messages API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij ophalen berichten',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
