/**
 * Search Businesses API
 * 
 * Zoekt bedrijven in de buurt via OpenStreetMap Nominatim + Overpass API
 * GET /api/marketing/search-businesses?city=Amsterdam&type=restaurant
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface Business {
  id: string
  name: string
  type: string
  address: string
  city: string
  postcode?: string
  phone?: string
  email?: string
  website?: string
  lat: number
  lon: number
}

// Business types mapping (Dutch to OSM tags)
const businessTypes: Record<string, string[]> = {
  'restaurant': ['amenity=restaurant', 'amenity=cafe', 'amenity=fast_food'],
  'winkel': ['shop=*'],
  'kapper': ['shop=hairdresser', 'shop=beauty'],
  'garage': ['shop=car_repair', 'shop=car'],
  'bakker': ['shop=bakery'],
  'slager': ['shop=butcher'],
  'bloemist': ['shop=florist'],
  'fietsenmaker': ['shop=bicycle'],
  'schoonmaak': ['office=cleaning', 'shop=cleaning'],
  'bouw': ['office=construction', 'craft=builder'],
  'installateur': ['craft=plumber', 'craft=electrician', 'craft=hvac'],
  'schilder': ['craft=painter'],
  'timmerman': ['craft=carpenter'],
  'tandarts': ['amenity=dentist'],
  'fysiotherapeut': ['amenity=physiotherapist', 'healthcare=physiotherapist'],
  'dierenarts': ['amenity=veterinary'],
  'apotheek': ['amenity=pharmacy'],
  'hotel': ['tourism=hotel', 'tourism=guest_house'],
  'fitness': ['leisure=fitness_centre', 'leisure=sports_centre'],
  'overig': ['office=*', 'shop=*', 'craft=*'],
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { city, postcode, type = 'overig', radius = '5000' } = req.query

  if (!city && !postcode) {
    return res.status(400).json({ 
      error: 'Stad of postcode is verplicht',
      example: '/api/marketing/search-businesses?city=Amsterdam&type=restaurant'
    })
  }

  try {
    // Step 1: Geocode the city/postcode to get coordinates
    const searchQuery = postcode || city
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery as string)},Netherlands&format=json&limit=1`
    
    const geocodeResponse = await fetch(geocodeUrl, {
      headers: {
        'User-Agent': 'Webstability-Marketing/1.0 (info@webstability.nl)'
      }
    })
    
    const geocodeData = await geocodeResponse.json()
    
    if (!geocodeData || geocodeData.length === 0) {
      return res.status(404).json({ 
        error: 'Locatie niet gevonden',
        query: searchQuery
      })
    }

    const { lat, lon } = geocodeData[0]
    const radiusMeters = parseInt(radius as string) || 5000

    // Step 2: Build Overpass query for businesses
    const typeKey = (type as string).toLowerCase()
    const osmTags = businessTypes[typeKey] || businessTypes['overig']
    
    // Build query parts for each tag
    const queryParts = osmTags.map(tag => {
      const [key, value] = tag.split('=')
      if (value === '*') {
        return `node["${key}"](around:${radiusMeters},${lat},${lon});`
      }
      return `node["${key}"="${value}"](around:${radiusMeters},${lat},${lon});`
    }).join('\n')

    const overpassQuery = `
      [out:json][timeout:25];
      (
        ${queryParts}
      );
      out body 50;
    `

    const overpassUrl = 'https://overpass-api.de/api/interpreter'
    const overpassResponse = await fetch(overpassUrl, {
      method: 'POST',
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Webstability-Marketing/1.0 (info@webstability.nl)'
      }
    })

    const overpassData = await overpassResponse.json()

    // Step 3: Transform results
    const businesses: Business[] = (overpassData.elements || [])
      .filter((el: any) => el.tags?.name) // Only include places with names
      .map((el: any) => ({
        id: `osm-${el.id}`,
        name: el.tags.name,
        type: el.tags.shop || el.tags.amenity || el.tags.craft || el.tags.office || 'Bedrijf',
        address: [
          el.tags['addr:street'],
          el.tags['addr:housenumber']
        ].filter(Boolean).join(' ') || 'Adres onbekend',
        city: el.tags['addr:city'] || el.tags['addr:municipality'] || (city as string) || '',
        postcode: el.tags['addr:postcode'] || '',
        phone: el.tags.phone || el.tags['contact:phone'] || '',
        email: el.tags.email || el.tags['contact:email'] || '',
        website: el.tags.website || el.tags['contact:website'] || '',
        lat: el.lat,
        lon: el.lon
      }))

    // Sort by distance from center (already roughly sorted by Overpass)
    return res.status(200).json({
      success: true,
      location: {
        query: searchQuery,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        radius: radiusMeters
      },
      count: businesses.length,
      businesses
    })

  } catch (error) {
    console.error('Search businesses error:', error)
    return res.status(500).json({
      error: 'Zoeken mislukt',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
