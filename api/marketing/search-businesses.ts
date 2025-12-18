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
  'winkel': ['shop=supermarket', 'shop=convenience', 'shop=clothes', 'shop=furniture'],
  'kapper': ['shop=hairdresser', 'shop=beauty'],
  'garage': ['shop=car_repair', 'shop=car', 'amenity=car_rental'],
  'bakker': ['shop=bakery', 'shop=pastry'],
  'slager': ['shop=butcher'],
  'bloemist': ['shop=florist', 'shop=garden_centre'],
  'fietsenmaker': ['shop=bicycle'],
  'schoonmaak': ['shop=dry_cleaning', 'shop=laundry'],
  'bouw': ['craft=builder', 'craft=roofer', 'craft=stonemason'],
  'installateur': ['craft=plumber', 'craft=electrician', 'craft=hvac'],
  'schilder': ['craft=painter'],
  'timmerman': ['craft=carpenter', 'craft=joiner'],
  'tandarts': ['amenity=dentist', 'amenity=doctors'],
  'fysiotherapeut': ['healthcare=physiotherapist', 'amenity=clinic'],
  'dierenarts': ['amenity=veterinary'],
  'apotheek': ['amenity=pharmacy'],
  'hotel': ['tourism=hotel', 'tourism=guest_house', 'tourism=hostel'],
  'fitness': ['leisure=fitness_centre', 'leisure=sports_centre', 'leisure=gym'],
  'overig': ['shop=yes', 'craft=yes', 'office=yes'],
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

  const { city, type = 'overig', radius = '10000' } = req.query
  const searchQuery = city as string

  if (!searchQuery) {
    return res.status(400).json({ 
      success: false,
      error: 'Stad of postcode is verplicht',
      example: '/api/marketing/search-businesses?city=Amsterdam&type=restaurant'
    })
  }

  console.log(`[BusinessSearch] Zoeken naar ${type} in ${searchQuery}, radius ${radius}m`)

  try {
    // Step 1: Geocode the city/postcode to get coordinates
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)},Netherlands&format=json&limit=1&addressdetails=1`
    
    console.log(`[BusinessSearch] Geocoding: ${geocodeUrl}`)
    
    const geocodeResponse = await fetch(geocodeUrl, {
      headers: {
        'User-Agent': 'Webstability-CRM/1.0 (https://webstability.nl)'
      }
    })
    
    if (!geocodeResponse.ok) {
      console.error(`[BusinessSearch] Geocode failed: ${geocodeResponse.status}`)
      return res.status(500).json({ 
        success: false,
        error: 'Geocoding mislukt - probeer opnieuw'
      })
    }
    
    const geocodeData = await geocodeResponse.json()
    
    if (!geocodeData || geocodeData.length === 0) {
      return res.status(200).json({ 
        success: true,
        businesses: [],
        error: 'Locatie niet gevonden - controleer de spelling'
      })
    }

    const { lat, lon, display_name } = geocodeData[0]
    const radiusMeters = Math.min(parseInt(radius as string) || 10000, 25000) // Max 25km

    console.log(`[BusinessSearch] Gevonden: ${display_name} (${lat}, ${lon})`)

    // Step 2: Build Overpass query for businesses
    const typeKey = (type as string).toLowerCase()
    const osmTags = businessTypes[typeKey] || businessTypes['overig']
    
    // Build query parts for each tag - search for nodes, ways and relations
    const queryParts = osmTags.map(tag => {
      const [key, value] = tag.split('=')
      if (value === 'yes' || value === '*') {
        return `
          node["${key}"](around:${radiusMeters},${lat},${lon});
          way["${key}"](around:${radiusMeters},${lat},${lon});
        `
      }
      return `
        node["${key}"="${value}"](around:${radiusMeters},${lat},${lon});
        way["${key}"="${value}"](around:${radiusMeters},${lat},${lon});
      `
    }).join('\n')

    const overpassQuery = `
      [out:json][timeout:30];
      (
        ${queryParts}
      );
      out center 100;
    `

    console.log(`[BusinessSearch] Overpass query voor ${typeKey}`)

    const overpassUrl = 'https://overpass-api.de/api/interpreter'
    const overpassResponse = await fetch(overpassUrl, {
      method: 'POST',
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Webstability-CRM/1.0 (https://webstability.nl)'
      }
    })

    if (!overpassResponse.ok) {
      console.error(`[BusinessSearch] Overpass failed: ${overpassResponse.status}`)
      // Return empty results instead of error
      return res.status(200).json({
        success: true,
        location: {
          query: searchQuery,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          radius: radiusMeters
        },
        count: 0,
        businesses: [],
        note: 'Overpass API tijdelijk niet beschikbaar'
      })
    }

    const overpassData = await overpassResponse.json()

    console.log(`[BusinessSearch] Overpass returned ${overpassData.elements?.length || 0} results`)

    // Step 3: Transform results
    const businesses: Business[] = (overpassData.elements || [])
      .filter((el: any) => el.tags?.name) // Only include places with names
      .map((el: any) => {
        // Handle both nodes and ways (ways have center coordinates)
        const elLat = el.lat || el.center?.lat
        const elLon = el.lon || el.center?.lon
        
        return {
          id: `osm-${el.id}`,
          name: el.tags.name,
          type: el.tags.shop || el.tags.amenity || el.tags.craft || el.tags.office || el.tags.leisure || 'Bedrijf',
          address: [
            el.tags['addr:street'],
            el.tags['addr:housenumber']
          ].filter(Boolean).join(' ') || 'Adres onbekend',
          city: el.tags['addr:city'] || el.tags['addr:municipality'] || searchQuery,
          postcode: el.tags['addr:postcode'] || '',
          phone: el.tags.phone || el.tags['contact:phone'] || '',
          email: el.tags.email || el.tags['contact:email'] || '',
          website: el.tags.website || el.tags['contact:website'] || el.tags.url || '',
          lat: elLat,
          lon: elLon
        }
      })
      .filter((b: Business) => b.lat && b.lon) // Only include if we have coordinates

    console.log(`[BusinessSearch] ✅ ${businesses.length} bedrijven gevonden`)

    return res.status(200).json({
      success: true,
      location: {
        query: searchQuery,
        displayName: display_name,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        radius: radiusMeters
      },
      count: businesses.length,
      businesses
    })

  } catch (error) {
    console.error('[BusinessSearch] Error:', error)
    return res.status(200).json({
      success: true,
      businesses: [],
      error: error instanceof Error ? error.message : 'Zoeken mislukt - probeer opnieuw'
    })
  }
}
