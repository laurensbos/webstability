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
  status: string
  type: string
  packageType: string
  customer: {
    name: string
    email: string
    phone?: string
    companyName?: string
  }
  paymentStatus: string
  messages?: ChatMessage[]
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify authorization
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ success: false, message: 'Niet ingelogd.' })
  }

  if (!kv) {
    return res.status(503).json({ success: false, message: 'Database niet geconfigureerd' })
  }

  try {
    const { projectId } = req.query

    if (req.method === 'GET') {
      // Get messages for a specific project
      if (!projectId) {
        return res.status(400).json({ success: false, message: 'Project ID verplicht' })
      }

      const project = await kv.get<Project>(`project:${projectId}`)
      
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project niet gevonden' })
      }

      return res.status(200).json({ 
        success: true, 
        messages: project.messages || [] 
      })
    }

    if (req.method === 'POST') {
      // Send a new message
      const { projectId: bodyProjectId, message } = req.body
      const targetProjectId = projectId || bodyProjectId

      if (!targetProjectId || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Project ID en bericht zijn verplicht' 
        })
      }

      const project = await kv.get<Project>(`project:${targetProjectId}`)
      
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project niet gevonden' })
      }

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        date: new Date().toISOString(),
        from: 'developer',
        message: message,
        read: true, // Developer messages are automatically read
      }

      const messages = project.messages || []
      messages.push(newMessage)

      const updatedProject = {
        ...project,
        messages,
        updatedAt: new Date().toISOString(),
      }

      await kv.set(`project:${targetProjectId}`, updatedProject)

      return res.status(201).json({ 
        success: true, 
        message: newMessage,
        project: updatedProject
      })
    }

    if (req.method === 'PUT') {
      // Mark messages as read
      const { projectId: bodyProjectId, messageIds } = req.body
      const targetProjectId = projectId || bodyProjectId

      if (!targetProjectId) {
        return res.status(400).json({ success: false, message: 'Project ID verplicht' })
      }

      const project = await kv.get<Project>(`project:${targetProjectId}`)
      
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project niet gevonden' })
      }

      const messages = project.messages || []
      
      // Mark specified messages as read, or all if no messageIds provided
      const updatedMessages = messages.map(msg => {
        if (!messageIds || messageIds.includes(msg.id)) {
          return { ...msg, read: true }
        }
        return msg
      })

      const updatedProject = {
        ...project,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      }

      await kv.set(`project:${targetProjectId}`, updatedProject)

      return res.status(200).json({ 
        success: true, 
        messages: updatedMessages 
      })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })

  } catch (error) {
    console.error('Messages API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij verwerken berichten.',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
