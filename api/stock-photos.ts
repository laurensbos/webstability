/**
 * Stock Photos API
 * 
 * GET /api/stock-photos?query=...&count=...
 * Searches Unsplash for free stock photos
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
    links: {
      html: string
    }
  }
  links: {
    html: string
    download: string
  }
  width: number
  height: number
  color: string
}

interface StockPhoto {
  id: string
  url: string
  thumbUrl: string
  fullUrl: string
  alt: string
  photographer: string
  photographerUrl: string
  downloadUrl: string
  width: number
  height: number
  color: string
  source: 'unsplash'
}

// Fallback foto's voor als API niet beschikbaar is - uitgebreide set
const FALLBACK_PHOTOS: StockPhoto[] = [
  {
    id: 'fallback-1',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
    alt: 'Modern office workspace',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
    width: 1920,
    height: 1280,
    color: '#f5f5f5',
    source: 'unsplash'
  },
  {
    id: 'fallback-2',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920',
    alt: 'Team collaboration',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920',
    width: 1920,
    height: 1280,
    color: '#e8e8e8',
    source: 'unsplash'
  },
  {
    id: 'fallback-3',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920',
    alt: 'Business analytics',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920',
    width: 1920,
    height: 1067,
    color: '#2c3e50',
    source: 'unsplash'
  },
  {
    id: 'fallback-4',
    url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920',
    alt: 'Business meeting',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920',
    width: 1920,
    height: 1280,
    color: '#f0f0f0',
    source: 'unsplash'
  },
  {
    id: 'fallback-5',
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920',
    alt: 'Team working together',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920',
    width: 1920,
    height: 1280,
    color: '#e5e5e5',
    source: 'unsplash'
  },
  {
    id: 'fallback-6',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920',
    alt: 'Working on laptop',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920',
    width: 1920,
    height: 1280,
    color: '#d4d4d4',
    source: 'unsplash'
  },
  {
    id: 'fallback-7',
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920',
    alt: 'Startup office',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920',
    width: 1920,
    height: 1280,
    color: '#ffffff',
    source: 'unsplash'
  },
  {
    id: 'fallback-8',
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920',
    alt: 'Business presentation',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920',
    width: 1920,
    height: 1280,
    color: '#1a1a1a',
    source: 'unsplash'
  },
  {
    id: 'fallback-9',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    thumbUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
    fullUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920',
    alt: 'Creative workspace',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    downloadUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920',
    width: 1920,
    height: 1280,
    color: '#f8f8f8',
    source: 'unsplash'
  }
]

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Branche-specifieke zoektermen
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  // Services
  'kapper': ['hair salon', 'hairdresser', 'barber shop'],
  'schoonheid': ['beauty salon', 'spa treatment', 'cosmetics'],
  'fitness': ['gym workout', 'fitness training', 'personal trainer'],
  'restaurant': ['restaurant interior', 'food plating', 'chef cooking'],
  'cafe': ['coffee shop', 'cafe interior', 'barista'],
  'bakker': ['bakery', 'fresh bread', 'pastries'],
  'bloemen': ['flower shop', 'florist', 'bouquet'],
  
  // Professional
  'advocaat': ['law office', 'legal consultation', 'attorney'],
  'accountant': ['accounting office', 'finance professional', 'business meeting'],
  'marketing': ['marketing strategy', 'digital marketing', 'creative agency'],
  'consultant': ['business consulting', 'strategy meeting', 'professional office'],
  'coach': ['life coaching', 'personal development', 'mentoring'],
  
  // Construction & Trade
  'bouw': ['construction site', 'building contractor', 'architecture'],
  'loodgieter': ['plumbing work', 'pipe installation', 'bathroom renovation'],
  'elektricien': ['electrical work', 'electrician', 'wiring'],
  'schilder': ['house painting', 'interior painting', 'decorator'],
  'timmerman': ['woodworking', 'carpentry', 'furniture making'],
  
  // Retail
  'winkel': ['retail store', 'shopping', 'storefront'],
  'kleding': ['fashion store', 'clothing boutique', 'apparel'],
  'technologie': ['technology store', 'electronics', 'gadgets'],
  
  // Healthcare
  'dokter': ['medical practice', 'doctor consultation', 'healthcare'],
  'tandarts': ['dental clinic', 'dentist', 'dental care'],
  'fysiotherapie': ['physiotherapy', 'physical therapy', 'rehabilitation'],
  'psycholoog': ['therapy session', 'mental health', 'counseling'],
  
  // Default
  'bedrijf': ['business professional', 'office workspace', 'team meeting'],
  'algemeen': ['modern business', 'professional workspace', 'corporate']
}

function getSearchTerms(query: string, businessDescription?: string): string[] {
  const terms: string[] = []
  const lowerQuery = query.toLowerCase()
  const lowerDesc = (businessDescription || '').toLowerCase()
  
  // Check for industry matches
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (lowerQuery.includes(industry) || lowerDesc.includes(industry)) {
      terms.push(...keywords)
    }
  }
  
  // Add the original query if we have terms
  if (terms.length > 0) {
    return terms
  }
  
  // Fallback to general business terms with the query
  return [`${query} business`, `${query} professional`, 'modern business office']
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { query, businessDescription, count = '9' } = req.query
  const photoCount = Math.min(Math.max(parseInt(count as string) || 9, 1), 30)
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' })
  }
  
  // If no Unsplash API key, return shuffled fallback photos
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('[StockPhotos] No Unsplash API key, returning shuffled fallback photos')
    return res.status(200).json({
      photos: shuffleArray(FALLBACK_PHOTOS).slice(0, photoCount),
      source: 'fallback',
      message: 'Using fallback photos (API key not configured)'
    })
  }
  
  try {
    // Get search terms based on query and business description
    const searchTerms = getSearchTerms(query, businessDescription as string | undefined)
    // Rotate through search terms for variety, use random offset
    const termIndex = Math.floor(Math.random() * searchTerms.length)
    const searchQuery = searchTerms[termIndex]
    
    // Add random page offset for variety on refresh
    const randomPage = Math.floor(Math.random() * 5) + 1
    
    console.log(`[StockPhotos] Searching for: "${searchQuery}" (page ${randomPage}, from query: "${query}")`)
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${photoCount}&page=${randomPage}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1'
        }
      }
    )
    
    if (!response.ok) {
      console.error(`[StockPhotos] Unsplash API error: ${response.status}`)
      return res.status(200).json({
        photos: shuffleArray(FALLBACK_PHOTOS).slice(0, photoCount),
        source: 'fallback',
        message: 'API temporarily unavailable'
      })
    }
    
    const data = await response.json()
    
    const photos: StockPhoto[] = data.results.map((photo: UnsplashPhoto) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.small,
      fullUrl: photo.urls.full,
      alt: photo.alt_description || photo.description || 'Stock photo',
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadUrl: photo.links.download,
      width: photo.width,
      height: photo.height,
      color: photo.color,
      source: 'unsplash' as const
    }))
    
    return res.status(200).json({
      photos,
      source: 'unsplash',
      searchQuery,
      total: data.total
    })
  } catch (error) {
    console.error('[StockPhotos] Error:', error)
    return res.status(200).json({
      photos: shuffleArray(FALLBACK_PHOTOS).slice(0, photoCount),
      source: 'fallback',
      message: 'Error fetching photos'
    })
  }
}
