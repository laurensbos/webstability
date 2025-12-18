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
const TYPE_MAPPING: Record<string, string> = {
  restaurant: 'restaurant',
  cafe: 'cafe',
  bakker: 'bakery',
  bakery: 'bakery',
  kapper: 'hair_care',
  hair_care: 'hair_care',
  garage: 'car_repair',
  car_repair: 'car_repair',
  winkel: 'store',
  store: 'store',
  fitness: 'gym',
  gym: 'gym',
  tandarts: 'dentist',
  dentist: 'dentist',
  fysiotherapeut: 'physiotherapist',
  physiotherapist: 'physiotherapist',
  hotel: 'lodging',
  lodging: 'lodging',
  schoonheidssalon: 'beauty_salon',
  beauty_salon: 'beauty_salon',
  apotheek: 'pharmacy',
  pharmacy: 'pharmacy',
  dierenarts: 'veterinary_care',
  veterinary_care: 'veterinary_care',
  accountant: 'accounting',
  accounting: 'accounting',
  advocaat: 'lawyer',
  lawyer: 'lawyer',
  makelaar: 'real_estate_agency',
  real_estate_agency: 'real_estate_agency',
  installateur: 'plumber',
  loodgieter: 'plumber',
  plumber: 'plumber',
  elektricien: 'electrician',
  electrician: 'electrician',
  schilder: 'painter',
  painter: 'painter',
  timmerman: 'general_contractor',
  aannemer: 'general_contractor',
  bouw: 'general_contractor',
  overig: 'establishment',
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

  const { type = 'overig', city, radius = '5000' } = req.query

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
    const googleType = TYPE_MAPPING[typeKey] || 'establishment'
    const searchRadius = Math.min(parseInt(String(radius), 10) || 5000, 50000)

    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${searchRadius}&type=${googleType}&language=nl&key=${GOOGLE_API_KEY}`

    console.log(`[BusinessSearch] Zoeken naar ${googleType} binnen ${searchRadius}m...`)

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

        // Type label
        const placeType = place.types?.find(t => TYPE_LABELS[t]) || googleType
        const typeLabel = TYPE_LABELS[placeType] || TYPE_LABELS[googleType] || String(type)

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
          type: TYPE_LABELS[googleType] || String(type),
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
