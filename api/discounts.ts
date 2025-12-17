import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

// Initialize Redis
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

const kv = REDIS_URL && REDIS_TOKEN 
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null

interface DiscountCode {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description: string
  validUntil?: string
  maxUses?: number
  usedCount: number
  active: boolean
  createdAt: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify authorization for write operations
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  if (!kv) {
    return res.status(503).json({ success: false, message: 'Database niet geconfigureerd' })
  }

  try {
    if (req.method === 'GET') {
      // Get all discount codes (public for validation, or all for admin)
      const { code, validate } = req.query
      
      if (code && validate === 'true') {
        // Validate a specific discount code (public)
        const discount = await kv.get<DiscountCode>(`discount:${(code as string).toUpperCase()}`)
        
        if (!discount || !discount.active) {
          return res.status(404).json({ 
            success: false, 
            valid: false,
            message: 'Kortingscode niet geldig' 
          })
        }
        
        // Check expiry
        if (discount.validUntil && new Date(discount.validUntil) < new Date()) {
          return res.status(400).json({ 
            success: false, 
            valid: false,
            message: 'Kortingscode is verlopen' 
          })
        }
        
        // Check max uses
        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
          return res.status(400).json({ 
            success: false, 
            valid: false,
            message: 'Kortingscode is op' 
          })
        }
        
        return res.status(200).json({
          success: true,
          valid: true,
          discount: {
            code: discount.code,
            type: discount.type,
            value: discount.value,
            description: discount.description,
          }
        })
      }
      
      // Get all discount codes (requires auth)
      if (!token) {
        return res.status(401).json({ success: false, message: 'Niet ingelogd' })
      }
      
      const codes = await kv.smembers('discount_codes') as string[]
      
      if (!codes || codes.length === 0) {
        return res.status(200).json({ success: true, discounts: [] })
      }
      
      const discounts = await Promise.all(
        codes.map(code => kv.get<DiscountCode>(`discount:${code}`))
      )
      
      const validDiscounts = discounts.filter((d): d is DiscountCode => d !== null)
      
      return res.status(200).json({ success: true, discounts: validDiscounts })
    }

    if (req.method === 'POST') {
      // Create new discount code (requires auth)
      if (!token) {
        return res.status(401).json({ success: false, message: 'Niet ingelogd' })
      }
      
      const { code, type, value, description, validUntil, maxUses } = req.body
      
      if (!code || !type || !value) {
        return res.status(400).json({ 
          success: false, 
          message: 'Code, type en waarde zijn verplicht' 
        })
      }
      
      const normalizedCode = (code as string).toUpperCase().replace(/\s/g, '')
      
      // Check if code already exists
      const existing = await kv.get(`discount:${normalizedCode}`)
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: 'Deze kortingscode bestaat al' 
        })
      }
      
      const discount: DiscountCode = {
        code: normalizedCode,
        type,
        value: parseFloat(value),
        description: description || '',
        validUntil,
        maxUses: maxUses ? parseInt(maxUses) : undefined,
        usedCount: 0,
        active: true,
        createdAt: new Date().toISOString(),
      }
      
      await kv.set(`discount:${normalizedCode}`, discount)
      await kv.sadd('discount_codes', normalizedCode)
      
      return res.status(201).json({ success: true, discount })
    }

    if (req.method === 'PUT') {
      // Update discount code (requires auth)
      if (!token) {
        return res.status(401).json({ success: false, message: 'Niet ingelogd' })
      }
      
      const { code, ...updates } = req.body
      
      if (!code) {
        return res.status(400).json({ success: false, message: 'Code is verplicht' })
      }
      
      const normalizedCode = (code as string).toUpperCase()
      const existing = await kv.get<DiscountCode>(`discount:${normalizedCode}`)
      
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Kortingscode niet gevonden' })
      }
      
      // If incrementing usage (when code is applied)
      if (updates.incrementUsage) {
        const updated = {
          ...existing,
          usedCount: existing.usedCount + 1,
        }
        await kv.set(`discount:${normalizedCode}`, updated)
        return res.status(200).json({ success: true, discount: updated })
      }
      
      const updated: DiscountCode = {
        ...existing,
        ...updates,
        code: existing.code, // Can't change the code
      }
      
      await kv.set(`discount:${normalizedCode}`, updated)
      
      return res.status(200).json({ success: true, discount: updated })
    }

    if (req.method === 'DELETE') {
      // Delete discount code (requires auth)
      if (!token) {
        return res.status(401).json({ success: false, message: 'Niet ingelogd' })
      }
      
      const { code } = req.query
      
      if (!code) {
        return res.status(400).json({ success: false, message: 'Code is verplicht' })
      }
      
      const normalizedCode = (code as string).toUpperCase()
      
      await kv.del(`discount:${normalizedCode}`)
      await kv.srem('discount_codes', normalizedCode)
      
      return res.status(200).json({ success: true, message: 'Kortingscode verwijderd' })
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' })

  } catch (error) {
    console.error('Discounts API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Fout bij verwerken kortingscodes',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
