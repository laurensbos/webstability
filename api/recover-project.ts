import type { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs'
import path from 'path'

// Simple email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { email } = req.body || {}
    const normalizedEmail = (email || '').toLowerCase().trim()

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, error: 'invalid_email' })
    }

    // Try to read projects from the data file
    let projects: any[] = []
    try {
      const dataPath = path.join(process.cwd(), 'server', 'data', 'projects.json')
      if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf-8')
        projects = JSON.parse(data)
      }
    } catch (e) {
      console.error('Could not read projects file:', e)
    }

    // Find projects matching this email
    const matchingProjects = projects.filter((p: any) => 
      (p.email || '').toLowerCase() === normalizedEmail ||
      (p.contact?.email || '').toLowerCase() === normalizedEmail
    )

    // Log for debugging (in production, you'd send an actual email here)
    console.log(`[Recovery] Email: ${normalizedEmail}, Found: ${matchingProjects.length} project(s)`)
    
    if (matchingProjects.length > 0) {
      console.log('[Recovery] Project IDs:', matchingProjects.map((p: any) => p.id).join(', '))
      
      // TODO: In production, send actual email with project IDs
      // For now, we just log it. You could integrate with:
      // - Nodemailer + SMTP
      // - SendGrid
      // - Resend
      // - etc.
    }

    // Always return success (don't reveal if email exists for security)
    return res.status(200).json({ 
      success: true, 
      message: 'Als dit e-mailadres bij ons bekend is, ontvang je binnen enkele minuten een e-mail met je project-ID(s).'
    })

  } catch (error) {
    console.error('Recovery error:', error)
    return res.status(500).json({ success: false, error: 'server_error' })
  }
}
