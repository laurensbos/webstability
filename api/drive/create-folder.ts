/**
 * Google Drive Folder Creation API
 * POST /api/drive/create-folder
 * Creates a project folder with subfolders in Google Drive
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

// Google Drive configuration from environment variables
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const GOOGLE_DRIVE_PARENT_FOLDER = process.env.GOOGLE_DRIVE_PARENT_FOLDER

// Subfolder structure for each project
const PROJECT_SUBFOLDERS = [
  'Ontwerp',
  'Content', 
  'Afbeeldingen',
  'Documenten',
  'Feedback'
]

async function createDriveFolder(
  drive: ReturnType<typeof google.drive>,
  name: string,
  parentId: string
): Promise<string> {
  const response = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    },
    fields: 'id, webViewLink'
  })
  
  return response.data.id || ''
}

async function setFolderPermissions(
  drive: ReturnType<typeof google.drive>,
  folderId: string,
  email?: string
) {
  // Make folder viewable by anyone with link
  await drive.permissions.create({
    fileId: folderId,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  })

  // If email provided, give editor access
  if (email) {
    try {
      await drive.permissions.create({
        fileId: folderId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: email
        },
        sendNotificationEmail: false
      })
    } catch (error) {
      console.log('Could not add email permission:', email, error)
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  // Check configuration
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_DRIVE_PARENT_FOLDER) {
    console.error('Missing Google Drive configuration')
    return res.status(500).json({ 
      success: false, 
      error: 'Google Drive niet geconfigureerd' 
    })
  }

  try {
    const { projectId, projectName, customerEmail } = req.body

    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project ID is verplicht' 
      })
    }

    // Initialize Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY
      },
      scopes: ['https://www.googleapis.com/auth/drive']
    })

    const drive = google.drive({ version: 'v3', auth })

    // Create main project folder
    const folderName = projectName 
      ? `${projectId} - ${projectName}`
      : projectId

    console.log(`Creating Drive folder: ${folderName}`)

    const mainFolderId = await createDriveFolder(
      drive, 
      folderName, 
      GOOGLE_DRIVE_PARENT_FOLDER
    )

    if (!mainFolderId) {
      throw new Error('Failed to create main folder')
    }

    // Create subfolders
    const subfolderIds: Record<string, string> = {}
    for (const subfolder of PROJECT_SUBFOLDERS) {
      const subfolderId = await createDriveFolder(drive, subfolder, mainFolderId)
      subfolderIds[subfolder.toLowerCase()] = subfolderId
    }

    // Set permissions (anyone with link can view)
    await setFolderPermissions(drive, mainFolderId, customerEmail)

    // Get folder link
    const folderLink = `https://drive.google.com/drive/folders/${mainFolderId}`

    console.log(`✅ Created Drive folder: ${folderLink}`)

    return res.status(200).json({
      success: true,
      folderId: mainFolderId,
      folderLink,
      subfolders: subfolderIds,
      message: `Map "${folderName}" succesvol aangemaakt`
    })

  } catch (error) {
    console.error('Error creating Drive folder:', error)
    return res.status(500).json({
      success: false,
      error: 'Kon geen Google Drive map aanmaken'
    })
  }
}
