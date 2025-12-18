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
  isFallback?: boolean
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

// Fallback bedrijven als de API geen resultaten geeft
function generateFallbackBusinesses(city: string, type: string): Business[] {
  const businessTemplates: Record<string, Array<{name: string, typeLabel: string}>> = {
    'restaurant': [
      { name: 'Restaurant De Gouden Lepel', typeLabel: 'restaurant' },
      { name: 'Eetcafé Het Hoekje', typeLabel: 'cafe' },
      { name: 'Pizzeria Napoli', typeLabel: 'restaurant' },
      { name: 'Wok Palace', typeLabel: 'fast_food' },
      { name: 'Brasserie De Markt', typeLabel: 'restaurant' },
    ],
    'winkel': [
      { name: 'Supermarkt Plus', typeLabel: 'supermarket' },
      { name: 'Kledingzaak Mooi & Stijl', typeLabel: 'clothes' },
      { name: 'Electronica Expert', typeLabel: 'electronics' },
      { name: 'Woninginrichting Thuis', typeLabel: 'furniture' },
      { name: 'Boekhandel De Lezer', typeLabel: 'books' },
    ],
    'kapper': [
      { name: 'Kapsalon Knip & Co', typeLabel: 'hairdresser' },
      { name: 'Barbershop The Gentlemen', typeLabel: 'hairdresser' },
      { name: 'Beautysalon Glow', typeLabel: 'beauty' },
      { name: 'Hairstudio Modern', typeLabel: 'hairdresser' },
      { name: 'Nagelstudio Perfect', typeLabel: 'beauty' },
    ],
    'garage': [
      { name: 'Autobedrijf Van der Berg', typeLabel: 'car_repair' },
      { name: 'Garage Snelservice', typeLabel: 'car_repair' },
      { name: 'APK Centrum', typeLabel: 'car_repair' },
      { name: 'Bandencentrale Grip', typeLabel: 'car_repair' },
      { name: 'Autopoets Pro', typeLabel: 'car' },
    ],
    'bakker': [
      { name: 'Bakkerij Het Warme Broodje', typeLabel: 'bakery' },
      { name: 'Patisserie Zoet', typeLabel: 'pastry' },
      { name: 'Brood & Banket', typeLabel: 'bakery' },
      { name: 'De Korenschoof', typeLabel: 'bakery' },
      { name: 'Taartenshop Feestelijk', typeLabel: 'pastry' },
    ],
    'bouw': [
      { name: 'Bouwbedrijf Stevig BV', typeLabel: 'builder' },
      { name: 'Dakdekkersbedrijf Top', typeLabel: 'roofer' },
      { name: 'Aannemersbedrijf Fundament', typeLabel: 'builder' },
      { name: 'Renovatie Specialist', typeLabel: 'builder' },
      { name: 'Metselwerk Van Dijk', typeLabel: 'stonemason' },
    ],
    'installateur': [
      { name: 'Loodgietersbedrijf Druppel', typeLabel: 'plumber' },
      { name: 'Elektra Service 24/7', typeLabel: 'electrician' },
      { name: 'CV Installatie Warmte', typeLabel: 'hvac' },
      { name: 'Sanitair Expert', typeLabel: 'plumber' },
      { name: 'Airco & Klimaat BV', typeLabel: 'hvac' },
    ],
    'tandarts': [
      { name: 'Tandartspraktijk De Kies', typeLabel: 'dentist' },
      { name: 'Mondzorg Centrum', typeLabel: 'dentist' },
      { name: 'Huisartsenpraktijk Gezond', typeLabel: 'doctors' },
      { name: 'Tandheelkunde Plus', typeLabel: 'dentist' },
      { name: 'Orthodontie Smile', typeLabel: 'dentist' },
    ],
    'fysiotherapeut': [
      { name: 'Fysiotherapie Vitaal', typeLabel: 'physiotherapist' },
      { name: 'Sport & Revalidatie Centrum', typeLabel: 'clinic' },
      { name: 'Manuele Therapie Balans', typeLabel: 'physiotherapist' },
      { name: 'Fysiofitness Actief', typeLabel: 'physiotherapist' },
      { name: 'Rugpoli Expert', typeLabel: 'clinic' },
    ],
    'fitness': [
      { name: 'Sportschool PowerFit', typeLabel: 'fitness_centre' },
      { name: 'Gym24 Fitness', typeLabel: 'fitness_centre' },
      { name: 'CrossFit Box', typeLabel: 'sports_centre' },
      { name: 'Yoga Studio Zen', typeLabel: 'fitness_centre' },
      { name: 'Health Club Vitality', typeLabel: 'sports_centre' },
    ],
  }

  const templates = businessTemplates[type] || businessTemplates['winkel'] || []
  const streets = ['Hoofdstraat', 'Marktplein', 'Stationsweg', 'Kerkstraat', 'Dorpsstraat', 'Industrieweg', 'Winkelcentrum']
  
  return templates.map((template, index) => ({
    id: `fallback-${type}-${index}`,
    name: template.name,
    type: template.typeLabel,
    address: `${streets[index % streets.length]} ${Math.floor(Math.random() * 100) + 1}`,
    city: city,
    postcode: '',
    phone: '',
    email: '',
    website: '',
    lat: 52.0 + (Math.random() * 0.1),
    lon: 5.0 + (Math.random() * 0.1),
    isFallback: true
  }))
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
      // Return fallback businesses instead of error
      const fallbackBusinesses = generateFallbackBusinesses(searchQuery, type as string)
      return res.status(200).json({ 
        success: true,
        businesses: fallbackBusinesses,
        count: fallbackBusinesses.length,
        note: 'Geocoding tijdelijk niet beschikbaar - voorbeeldbedrijven getoond'
      })
    }
    
    const geocodeData = await geocodeResponse.json()
    
    if (!geocodeData || geocodeData.length === 0) {
      // Return fallback businesses instead of empty
      const fallbackBusinesses = generateFallbackBusinesses(searchQuery, type as string)
      return res.status(200).json({ 
        success: true,
        businesses: fallbackBusinesses,
        count: fallbackBusinesses.length,
        note: 'Locatie niet gevonden - voorbeeldbedrijven getoond'
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
      // Return fallback businesses instead of empty
      const fallbackBusinesses = generateFallbackBusinesses(searchQuery, typeKey)
      return res.status(200).json({
        success: true,
        location: {
          query: searchQuery,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          radius: radiusMeters
        },
        count: fallbackBusinesses.length,
        businesses: fallbackBusinesses,
        note: 'Overpass API tijdelijk niet beschikbaar - voorbeeldbedrijven getoond'
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

    // If no results found, return fallback businesses
    if (businesses.length === 0) {
      const fallbackBusinesses = generateFallbackBusinesses(searchQuery, typeKey)
      return res.status(200).json({
        success: true,
        location: {
          query: searchQuery,
          displayName: display_name,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          radius: radiusMeters
        },
        count: fallbackBusinesses.length,
        businesses: fallbackBusinesses,
        note: 'Geen bedrijven gevonden in OpenStreetMap - voorbeeldbedrijven getoond'
      })
    }

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
    const typeKey = (type as string).toLowerCase()
    const fallbackBusinesses = generateFallbackBusinesses(searchQuery, typeKey)
    return res.status(200).json({
      success: true,
      businesses: fallbackBusinesses,
      count: fallbackBusinesses.length,
      note: 'Er is een fout opgetreden - voorbeeldbedrijven getoond'
    })
  }
}
