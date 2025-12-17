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
  updatedAt?: string
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  // Get project ID from URL path: /api/project/[id]/message
  const url = req.url || ''
  const pathMatch = url.match(/\/api\/project\/([^/]+)\/message/)
  const projectId = pathMatch?.[1]

  if (!projectId) {
    return res.status(400).json({ success: false, message: 'Project ID verplicht' })
  }

  if (!kv) {
    return res.status(503).json({ success: false, message: 'Database niet geconfigureerd' })
  }

  try {
    const { message, from } = req.body

    if (!message) {
      return res.status(400).json({ success: false, message: 'Bericht is verplicht' })
    }

    const project = await kv.get<Project>(`project:${projectId}`)
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden' })
    }

    // Create new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString(),
      from: from === 'developer' ? 'developer' : 'client',
      message: message,
      read: from === 'developer', // Client messages are unread, developer messages are read
    }

    // Add to project messages
    const messages = project.messages || []
    messages.push(newMessage)

    const updatedProject = {
      ...project,
      messages,
      updatedAt: new Date().toISOString(),
    }

    await kv.set(`project:${projectId}`, updatedProject)

    console.log(`Message sent for project ${projectId} from ${from}`)

    return res.status(201).json({
      success: true,
      message: newMessage
    })

  } catch (error) {
    console.error('Project message API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij versturen bericht',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
