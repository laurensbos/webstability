/**
 * Search Businesses API - Google Places
 * 
 * Zoekt echte bedrijven via Google Places API
 * GET /api/marketing/search-businesses?city=Amsterdam&type=restaurant
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface Business {
  id: string
  name: string
  type: string
  address: string
  city: string
  phone: string
  website: string
  email: string
  rating?: number
  totalRatings?: number
  lat: number
  lon: number
}

interface GooglePlaceResult {
  place_id: string
  name: string
  formatted_address?: string
  vicinity?: string
  types?: string[]
  rating?: number
  user_ratings_total?: number
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
}

// Type mapping naar Google Places types
const TYPE_MAPPING: Record<string, { type?: string; keyword: string }> = {
  restaurant: { type: 'restaurant', keyword: 'restaurant' },
  cafe: { type: 'cafe', keyword: 'cafe koffie' },
  bakker: { type: 'bakery', keyword: 'bakker bakkerij' },
  bakery: { type: 'bakery', keyword: 'bakker bakkerij' },
  kapper: { type: 'hair_care', keyword: 'kapper kapsalon barbershop' },
  hair_care: { type: 'hair_care', keyword: 'kapper kapsalon' },
  garage: { type: 'car_repair', keyword: 'garage autobedrijf autogarage APK' },
  car_repair: { type: 'car_repair', keyword: 'garage autobedrijf' },
  winkel: { type: 'store', keyword: 'winkel shop' },
  store: { type: 'store', keyword: 'winkel shop' },
  fitness: { type: 'gym', keyword: 'fitness sportschool gym' },
  gym: { type: 'gym', keyword: 'fitness sportschool' },
  tandarts: { type: 'dentist', keyword: 'tandarts tandartsenpraktijk' },
  dentist: { type: 'dentist', keyword: 'tandarts' },
  fysiotherapeut: { keyword: 'fysiotherapie fysiotherapeut fysio' },
  physiotherapist: { keyword: 'fysiotherapie fysiotherapeut' },
  hotel: { type: 'lodging', keyword: 'hotel pension B&B' },
  lodging: { type: 'lodging', keyword: 'hotel' },
  schoonheidssalon: { type: 'beauty_salon', keyword: 'schoonheidssalon beautysalon nagelsalon' },
  beauty_salon: { type: 'beauty_salon', keyword: 'schoonheidssalon' },
  apotheek: { type: 'pharmacy', keyword: 'apotheek' },
  pharmacy: { type: 'pharmacy', keyword: 'apotheek' },
  dierenarts: { type: 'veterinary_care', keyword: 'dierenarts dierenkliniek' },
  veterinary_care: { type: 'veterinary_care', keyword: 'dierenarts' },
  accountant: { type: 'accounting', keyword: 'accountant boekhouder administratiekantoor' },
  accounting: { type: 'accounting', keyword: 'accountant boekhouder' },
  advocaat: { type: 'lawyer', keyword: 'advocaat advocatenkantoor juridisch' },
  lawyer: { type: 'lawyer', keyword: 'advocaat' },
  makelaar: { type: 'real_estate_agency', keyword: 'makelaar makelaardij vastgoed' },
  real_estate_agency: { type: 'real_estate_agency', keyword: 'makelaar' },
  installateur: { keyword: 'installateur loodgieter elektricien cv installatie' },
  loodgieter: { type: 'plumber', keyword: 'loodgieter sanitair' },
  plumber: { type: 'plumber', keyword: 'loodgieter' },
  elektricien: { type: 'electrician', keyword: 'elektricien elektra' },
  electrician: { type: 'electrician', keyword: 'elektricien' },
  schilder: { keyword: 'schilder schildersbedrijf' },
  painter: { keyword: 'schilder schildersbedrijf' },
  timmerman: { keyword: 'timmerman timmerwerk houtbewerking' },
  aannemer: { keyword: 'aannemer bouwbedrijf aannemersbedrijf bouw verbouw renovatie' },
  bouw: { keyword: 'aannemer bouwbedrijf aannemersbedrijf bouw verbouw renovatie klusbedrijf' },
  overig: { keyword: 'bedrijf' },
}

// Nederlandse type labels
const TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  cafe: 'Café',
  bakery: 'Bakker',
  hair_care: 'Kapper',
  car_repair: 'Garage',
  store: 'Winkel',
  gym: 'Fitness',
  dentist: 'Tandarts',
  physiotherapist: 'Fysiotherapeut',
  lodging: 'Hotel',
  beauty_salon: 'Schoonheidssalon',
  pharmacy: 'Apotheek',
  veterinary_care: 'Dierenarts',
  accounting: 'Accountant',
  lawyer: 'Advocaat',
  real_estate_agency: 'Makelaar',
  plumber: 'Installateur',
  electrician: 'Elektricien',
  painter: 'Schilder',
  general_contractor: 'Aannemer',
  establishment: 'Bedrijf',
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

  const { type = 'overig', city, radius = '5000', query } = req.query

  // Als er een specifieke bedrijfsnaam/query is, zoek daarop
  const searchQuery = query ? String(query) : null

  if (!city) {
    return res.status(400).json({ 
      success: false,
      error: 'Stad is verplicht',
      example: '/api/marketing/search-businesses?city=Amsterdam&type=restaurant'
    })
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

  if (!GOOGLE_API_KEY) {
    console.error('[BusinessSearch] GOOGLE_PLACES_API_KEY not configured')
    return res.status(500).json({ 
      success: false,
      error: 'Google Places API key niet geconfigureerd' 
    })
  }

  console.log(`[BusinessSearch] Zoeken naar ${type} in ${city}`)

  try {
    // Stap 1: Geocode de stad om coördinaten te krijgen
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(String(city))},Netherlands&key=${GOOGLE_API_KEY}`
    
    console.log(`[BusinessSearch] Geocoding ${city}...`)
    
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()

    if (geocodeData.status !== 'OK' || !geocodeData.results?.[0]) {
      console.error(`[BusinessSearch] Geocoding failed: ${geocodeData.status}`)
      return res.status(200).json({ 
        success: true,
        businesses: [],
        count: 0,
        error: 'Locatie niet gevonden - controleer de spelling'
      })
    }

    const location = geocodeData.results[0].geometry.location
    const { lat, lng } = location

    console.log(`[BusinessSearch] Locatie gevonden: ${lat}, ${lng}`)

    // Stap 2: Zoek bedrijven in de buurt
    const typeKey = String(type).toLowerCase()
    const searchConfig = TYPE_MAPPING[typeKey] || { keyword: 'bedrijf' }
    const searchRadius = Math.min(parseInt(String(radius), 10) || 5000, 50000)

    // Bepaal de zoekterm: specifieke query of keyword van type
    const keywordToSearch = searchQuery || searchConfig.keyword

    // Bouw de URL met keyword (en optioneel type)
    let placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${searchRadius}&keyword=${encodeURIComponent(keywordToSearch)}&language=nl&key=${GOOGLE_API_KEY}`
    
    // Voeg type toe als die bestaat EN we niet op bedrijfsnaam zoeken
    if (searchConfig.type && !searchQuery) {
      placesUrl += `&type=${searchConfig.type}`
    }

    console.log(`[BusinessSearch] Zoeken naar "${keywordToSearch}" binnen ${searchRadius}m...`)

    const placesResponse = await fetch(placesUrl)
    const placesData = await placesResponse.json()

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      console.error(`[BusinessSearch] Places API error: ${placesData.status} - ${placesData.error_message}`)
      return res.status(200).json({ 
        success: true,
        businesses: [],
        count: 0,
        error: `Google API error: ${placesData.status}`
      })
    }

    const places: GooglePlaceResult[] = placesData.results || []
    console.log(`[BusinessSearch] ${places.length} plaatsen gevonden, details ophalen...`)

    // Stap 3: Haal details op voor elk bedrijf (voor telefoon en website)
    const businesses: Business[] = []
    
    // Beperk tot 15 om API calls te sparen
    for (const place of places.slice(0, 15)) {
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,international_phone_number,website,name,formatted_address,geometry&language=nl&key=${GOOGLE_API_KEY}`
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()

        let phone = ''
        let website = ''

        if (detailsData.status === 'OK' && detailsData.result) {
          phone = detailsData.result.formatted_phone_number || detailsData.result.international_phone_number || ''
          website = detailsData.result.website || ''
        }

        // Genereer email suggestie
        let email = ''
        if (website) {
          try {
            const domain = new URL(website).hostname.replace('www.', '')
            email = `info@${domain}`
          } catch {
            // Geen geldige URL
          }
        }

        // Type label - gebruik het type van de plaats of de gezochte categorie
        const placeType = place.types?.find(t => TYPE_LABELS[t])
        const typeLabel = (placeType && TYPE_LABELS[placeType]) || 
                          (searchConfig.type && TYPE_LABELS[searchConfig.type]) || 
                          String(type)

        // Extract stad uit adres
        const addressParts = (place.formatted_address || place.vicinity || '').split(',')
        const cityFromAddress = addressParts.length > 1 
          ? addressParts[addressParts.length - 2]?.trim()?.replace(/\d{4}\s?[A-Z]{2}/, '').trim() || String(city)
          : String(city)

        businesses.push({
          id: place.place_id,
          name: place.name,
          type: typeLabel,
          address: place.vicinity || place.formatted_address || '',
          city: cityFromAddress,
          phone,
          website,
          email,
          rating: place.rating,
          totalRatings: place.user_ratings_total,
          lat: place.geometry?.location?.lat || lat,
          lon: place.geometry?.location?.lng || lng,
        })
      } catch (detailError) {
        console.error(`[BusinessSearch] Error fetching details for ${place.name}:`, detailError)
        // Voeg bedrijf toe zonder details
        businesses.push({
          id: place.place_id,
          name: place.name,
          type: (searchConfig.type && TYPE_LABELS[searchConfig.type]) || String(type),
          address: place.vicinity || '',
          city: String(city),
          phone: '',
          website: '',
          email: '',
          rating: place.rating,
          totalRatings: place.user_ratings_total,
          lat: place.geometry?.location?.lat || lat,
          lon: place.geometry?.location?.lng || lng,
        })
      }
    }

    console.log(`[BusinessSearch] ✅ ${businesses.length} bedrijven met details`)

    return res.status(200).json({
      success: true,
      location: {
        query: String(city),
        lat,
        lon: lng,
        radius: searchRadius
      },
      count: businesses.length,
      businesses
    })

  } catch (error) {
    console.error('[BusinessSearch] Error:', error)
    return res.status(200).json({
      success: true,
      businesses: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Zoeken mislukt - probeer opnieuw'
    })
  }
}
