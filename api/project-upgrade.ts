/**
 * Project Upgrade API
 * 
 * POST /api/project-upgrade
 * Upgrades a project to a higher package tier
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Package hierarchy and pricing
const PACKAGES = {
  starter: { price: 119, setupFee: 149, order: 0 },
  professional: { price: 169, setupFee: 199, order: 1 },
  business: { price: 249, setupFee: 299, order: 2 },
  webshop: { price: 299, setupFee: 399, order: 3 }
}

type PackageType = keyof typeof PACKAGES

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { projectId, newPackage } = req.body

  if (!projectId || !newPackage) {
    return res.status(400).json({ error: 'Missing projectId or newPackage' })
  }

  if (!PACKAGES[newPackage as PackageType]) {
    return res.status(400).json({ error: 'Invalid package type' })
  }

  try {
    // Get current project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, package, client_email, business_name')
      .eq('id', projectId)
      .single()

    if (fetchError || !project) {
      console.error('[ProjectUpgrade] Project not found:', fetchError)
      return res.status(404).json({ error: 'Project not found' })
    }

    const currentPackage = project.package as PackageType
    const newPkg = PACKAGES[newPackage as PackageType]
    const currentPkg = PACKAGES[currentPackage]

    // Validate upgrade is actually an upgrade
    if (newPkg.order <= currentPkg.order) {
      return res.status(400).json({ error: 'Can only upgrade to a higher package' })
    }

    // Calculate upgrade fee (difference in setup fees)
    const upgradeFee = newPkg.setupFee - currentPkg.setupFee
    const newMonthlyPrice = newPkg.price

    // Update project package
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        package: newPackage,
        upgraded_at: new Date().toISOString(),
        upgraded_from: currentPackage,
        upgrade_fee: upgradeFee > 0 ? upgradeFee : 0
      })
      .eq('id', projectId)

    if (updateError) {
      console.error('[ProjectUpgrade] Update failed:', updateError)
      return res.status(500).json({ error: 'Failed to update project' })
    }

    // Log the upgrade activity
    await supabase.from('project_activity').insert({
      project_id: projectId,
      type: 'package_upgraded',
      title: `Pakket geüpgraded naar ${newPackage}`,
      description: `Van ${currentPackage} naar ${newPackage}. Nieuw maandbedrag: €${newMonthlyPrice}`,
      metadata: {
        from_package: currentPackage,
        to_package: newPackage,
        upgrade_fee: upgradeFee,
        new_monthly_price: newMonthlyPrice
      }
    })

    console.log(`[ProjectUpgrade] Project ${projectId} upgraded from ${currentPackage} to ${newPackage}`)

    return res.status(200).json({
      success: true,
      previousPackage: currentPackage,
      newPackage,
      upgradeFee,
      newMonthlyPrice
    })
  } catch (error) {
    console.error('[ProjectUpgrade] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
