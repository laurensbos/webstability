/**
 * Google Drive Folder Creation API
 * POST /api/drive/create-folder
 * Creates a project folder with subfolders in Google Drive
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

// Google Drive configuration from environment variables
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_DRIVE_PARENT_FOLDER = process.env.GOOGLE_DRIVE_PARENT_FOLDER

// Process the private key to handle various formats
function getPrivateKey(): string | undefined {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY
  if (!rawKey) return undefined
  
  // Handle different escaping scenarios:
  // 1. If stored with literal \n (common in Vercel), replace with actual newlines
  // 2. If stored with escaped \\n, replace those too
  // 3. If already has real newlines, keep them
  let key = rawKey
    .replace(/\\\\n/g, '\n')  // Handle double-escaped \\n
    .replace(/\\n/g, '\n')     // Handle single-escaped \n
  
  // Ensure proper PEM format
  if (!key.includes('-----BEGIN')) {
    // Try to reconstruct PEM format if markers are missing
    key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`
  }
  
  return key
}

const GOOGLE_PRIVATE_KEY = getPrivateKey()

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
    console.error('Missing Google Drive configuration:', {
      hasEmail: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasKey: !!GOOGLE_PRIVATE_KEY,
      hasParentFolder: !!GOOGLE_DRIVE_PARENT_FOLDER
    })
    return res.status(500).json({ 
      success: false, 
      error: 'Google Drive niet geconfigureerd' 
    })
  }

  // Debug: Log key format (first/last chars only for security)
  const keyStart = GOOGLE_PRIVATE_KEY.substring(0, 50)
  const keyEnd = GOOGLE_PRIVATE_KEY.substring(GOOGLE_PRIVATE_KEY.length - 30)
  console.log('Private key format check:', {
    startsWithBegin: GOOGLE_PRIVATE_KEY.includes('-----BEGIN'),
    endsWithEnd: GOOGLE_PRIVATE_KEY.includes('-----END'),
    hasNewlines: GOOGLE_PRIVATE_KEY.includes('\n'),
    keyStart: keyStart,
    keyEnd: keyEnd,
    totalLength: GOOGLE_PRIVATE_KEY.length
  })

  try {
    const { projectId, projectName, customerEmail } = req.body

    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project ID is verplicht' 
      })
    }

    // Initialize Google Drive API with JWT client (more reliable)
    const jwtClient = new google.auth.JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive']
    })

    // Authorize the client
    await jwtClient.authorize()

    const drive = google.drive({ version: 'v3', auth: jwtClient })

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
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isKeyError = errorMessage.includes('OSSL') || errorMessage.includes('key') || errorMessage.includes('sign')
    
    if (isKeyError) {
      console.error('Private key error - check GOOGLE_PRIVATE_KEY format in Vercel environment variables')
      console.error('The key should be the full PEM including -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----')
      console.error('In Vercel, paste the key with \\n for newlines OR paste the raw multi-line key')
    }
    
    return res.status(500).json({
      success: false,
      error: isKeyError 
        ? 'Google Drive authenticatie mislukt - controleer de private key configuratie'
        : 'Kon geen Google Drive map aanmaken',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    })
  }
}
