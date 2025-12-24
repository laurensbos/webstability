/**
 * Website Analysis API
 * 
 * Analyseert een website op veroudering en kwaliteit
 * POST /api/marketing/analyze-website
 * Body: { url: string }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface WebsiteIssue {
  type: 'critical' | 'warning' | 'info'
  message: string
  icon: string
}

interface WebsiteAnalysis {
  url: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  isOutdated: boolean
  issues: WebsiteIssue[]
  details: {
    hasHttps: boolean
    hasViewport: boolean
    loadTime: number | null
    hasjQuery: boolean
    hasWordPress: boolean
    hasModernFramework: boolean
    oldTechnologies: string[]
    missingFeatures: string[]
  }
  recommendation: string
  salesTip: string
}

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

  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is verplicht' })
  }

  try {
    // Normaliseer URL
    let websiteUrl = String(url).trim()
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      websiteUrl = 'https://' + websiteUrl
    }

    console.log(`[WebsiteAnalysis] Analyseren: ${websiteUrl}`)

    const issues: WebsiteIssue[] = []
    let score = 100
    const details: WebsiteAnalysis['details'] = {
      hasHttps: false,
      hasViewport: false,
      loadTime: null,
      hasjQuery: false,
      hasWordPress: false,
      hasModernFramework: false,
      oldTechnologies: [],
      missingFeatures: [],
    }

    // Check 1: HTTPS
    const hasHttps = websiteUrl.startsWith('https://')
    details.hasHttps = hasHttps
    if (!hasHttps) {
      issues.push({
        type: 'critical',
        message: 'Geen beveiligde verbinding (het slotje in de browser ontbreekt)',
        icon: 'shield-off',
      })
      score -= 25
    }

    // Check 2: Fetch de website
    const startTime = Date.now()
    let html = ''
    let fetchSuccess = false

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      // Probeer eerst HTTPS, dan HTTP
      let response
      try {
        response = await fetch(websiteUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'follow',
        })
      } catch {
        // Probeer HTTP als HTTPS faalt
        const httpUrl = websiteUrl.replace('https://', 'http://')
        response = await fetch(httpUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'follow',
        })
        details.hasHttps = false
        if (!issues.find(i => i.message.includes('beveiligde verbinding'))) {
          issues.push({
            type: 'critical',
            message: 'Geen beveiligde verbinding (het slotje in de browser ontbreekt)',
            icon: 'shield-off',
          })
          score -= 25
        }
      }
      
      clearTimeout(timeoutId)

      const loadTime = Date.now() - startTime
      details.loadTime = loadTime
      fetchSuccess = true

      // Check laadtijd
      if (loadTime > 5000) {
        issues.push({
          type: 'critical',
          message: `Website laadt langzaam (${(loadTime / 1000).toFixed(1)} sec) - bezoekers haken snel af`,
          icon: 'clock',
        })
        score -= 20
      } else if (loadTime > 3000) {
        issues.push({
          type: 'warning',
          message: `Laadtijd kan sneller (${(loadTime / 1000).toFixed(1)} sec) - snellere sites scoren beter`,
          icon: 'clock',
        })
        score -= 10
      }

      html = await response.text()
      const htmlLower = html.toLowerCase()

      // Check 3: Viewport (mobiel-vriendelijk)
      const hasViewport = htmlLower.includes('viewport') && (htmlLower.includes('width=device-width') || htmlLower.includes('width='))
      details.hasViewport = hasViewport
      if (!hasViewport) {
        issues.push({
          type: 'critical',
          message: 'Werkt niet goed op telefoons - veel bezoekers zien de site op mobiel',
          icon: 'smartphone',
        })
        details.missingFeatures.push('Responsive design')
        score -= 25
      }

      // Check 4: Oude technologieën detecteren
      const oldTechPatterns = [
        { pattern: /<table[^>]*>\s*<tr[^>]*>\s*<td[^>]*>[\s\S]{0,500}<table/i, name: 'Tabel-gebaseerde layout' },
        { pattern: /\.swf['"]|flash|shockwave/i, name: 'Flash' },
        { pattern: /<frameset|<frame\s/i, name: 'Frames' },
        { pattern: /<marquee/i, name: 'Marquee animatie' },
        { pattern: /<blink/i, name: 'Blink effect' },
        { pattern: /<font\s+[^>]*size=/i, name: 'Oude font tags' },
        { pattern: /<center>/i, name: 'Center tags' },
        { pattern: /jquery[-.]1\.[0-8]\./i, name: 'Oude jQuery (< 1.9)' },
        { pattern: /jquery[-.]2\.[0-2]\./i, name: 'Verouderde jQuery (2.x)' },
        { pattern: /bootstrap[\/.-]2\./i, name: 'Oude Bootstrap (v2)' },
        { pattern: /bootstrap[\/.-]3\./i, name: 'Verouderde Bootstrap (v3)' },
        { pattern: /mootools/i, name: 'MooTools' },
        { pattern: /prototype\.js/i, name: 'Prototype.js' },
        { pattern: /scriptaculous/i, name: 'Scriptaculous' },
        { pattern: /yui[\/.-]2\./i, name: 'YUI 2' },
      ]

      for (const tech of oldTechPatterns) {
        if (tech.pattern.test(html)) {
          details.oldTechnologies.push(tech.name)
        }
      }

      if (details.oldTechnologies.length > 0) {
        const techScore = Math.min(details.oldTechnologies.length * 8, 30)
        score -= techScore
        issues.push({
          type: 'warning',
          message: `Oudere technieken gebruikt - website kan moderner`,
          icon: 'alert-triangle',
        })
      }

      // Check 5: jQuery detectie
      details.hasjQuery = /jquery/i.test(html)
      
      // Check 6: WordPress detectie
      details.hasWordPress = /wp-content|wordpress/i.test(html)
      if (details.hasWordPress) {
        // Check voor verouderde WordPress indicatoren
        if (/wordpress\s*[0-3]\./i.test(html) || /wp-includes.*version.*[0-3]\./i.test(html)) {
          issues.push({
            type: 'warning',
            message: 'WordPress lijkt niet up-to-date - updates zijn belangrijk voor veiligheid',
            icon: 'alert-circle',
          })
          score -= 10
        }
      }

      // Check 7: Moderne frameworks detectie
      const modernFrameworks = [
        /react/i,
        /vue/i,
        /angular/i,
        /svelte/i,
        /next/i,
        /nuxt/i,
        /gatsby/i,
        /tailwind/i,
      ]
      details.hasModernFramework = modernFrameworks.some(pattern => pattern.test(html))

      // Check 8: Ontbrekende moderne features
      if (!htmlLower.includes('charset') && !htmlLower.includes('utf-8')) {
        details.missingFeatures.push('Tekencodering')
        score -= 5
      }
      
      if (!htmlLower.includes('<meta name="description"') && !htmlLower.includes("<meta name='description'")) {
        details.missingFeatures.push('Beschrijving voor Google')
        score -= 5
      }

      if (!htmlLower.includes('favicon') && !htmlLower.includes('icon')) {
        details.missingFeatures.push('Icoontje in browsertab')
        score -= 3
      }

      if (!htmlLower.includes('og:') && !htmlLower.includes('twitter:')) {
        details.missingFeatures.push('Preview bij delen op social media')
        score -= 3
      }

      // Check 9: Design indicatoren van veroudering
      const outdatedDesignPatterns = [
        { pattern: /copyright\s*©?\s*(19[0-9]{2}|200[0-9]|201[0-5])/i, name: 'Oude copyright datum' },
        { pattern: /all\s*rights\s*reserved.*?(19[0-9]{2}|200[0-9]|201[0-5])/i, name: 'Oude copyright' },
        { pattern: /last\s*updated?:?\s*(19[0-9]{2}|200[0-9]|201[0-8])/i, name: 'Lang niet bijgewerkt' },
        { pattern: /best\s*viewed\s*(in|with)|optimized\s*for/i, name: '"Best viewed in" tekst' },
        { pattern: /hit\s*counter|visitor\s*count|bezoekers?\s*teller/i, name: 'Bezoekersteller' },
        { pattern: /guestbook|gastenboek/i, name: 'Gastenboek' },
        { pattern: /under\s*construction|in\s*aanbouw/i, name: 'Under construction' },
        { pattern: /webmaster@|info@.*\.nl.*mailto/i, name: 'Mailto links' },
      ]

      for (const pattern of outdatedDesignPatterns) {
        if (pattern.pattern.test(html)) {
          if (!details.oldTechnologies.includes(pattern.name)) {
            details.oldTechnologies.push(pattern.name)
            score -= 5
          }
        }
      }

      if (details.missingFeatures.length > 2) {
        issues.push({
          type: 'warning',
          message: `Ontbrekend: ${details.missingFeatures.slice(0, 3).join(', ')}`,
          icon: 'x-circle',
        })
      }

    } catch (fetchError) {
      console.error('[WebsiteAnalysis] Fetch error:', fetchError)
      issues.push({
        type: 'critical',
        message: 'Website moeilijk te bereiken - bezoekers kunnen dit ook ervaren',
        icon: 'wifi-off',
      })
      score -= 30
    }

    // Bereken eindscores
    score = Math.max(0, Math.min(100, score))
    
    let grade: WebsiteAnalysis['grade']
    if (score >= 90) grade = 'A'
    else if (score >= 75) grade = 'B'
    else if (score >= 60) grade = 'C'
    else if (score >= 40) grade = 'D'
    else grade = 'F'

    const isOutdated = score < 60 || details.oldTechnologies.length >= 2 || !details.hasViewport

    // Genereer aanbeveling
    let recommendation = ''
    let salesTip = ''

    if (score >= 80) {
      recommendation = 'Deze website ziet er prima uit.'
      salesTip = 'Vraag of ze tevreden zijn en of er wensen zijn voor verbeteringen.'
    } else if (score >= 60) {
      recommendation = 'Deze website heeft een paar verbeterpunten.'
      salesTip = 'Benader vriendelijk, focus op hoe de site beter kan werken op telefoons.'
    } else if (score >= 40) {
      recommendation = 'Deze website zou wel een update kunnen gebruiken.'
      salesTip = 'Goede kans om te helpen. Leg uit dat veel bezoekers op mobiel kijken.'
    } else {
      recommendation = 'Deze website is toe aan vernieuwing.'
      salesTip = 'Leg vriendelijk uit dat een moderne site bezoekers helpt vertrouwen te krijgen.'
    }

    const analysis: WebsiteAnalysis = {
      url: websiteUrl,
      score,
      grade,
      isOutdated,
      issues,
      details,
      recommendation,
      salesTip,
    }

    console.log(`[WebsiteAnalysis] ✅ Score: ${score} (${grade}) - Verouderd: ${isOutdated}`)

    return res.status(200).json({
      success: true,
      analysis,
    })

  } catch (error) {
    console.error('[WebsiteAnalysis] Error:', error)
    return res.status(200).json({
      success: false,
      error: error instanceof Error ? error.message : 'Analyse mislukt',
    })
  }
}
