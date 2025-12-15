/**
 * Webstability Bedrijfsconfiguratie
 * 
 * ⚠️ BELANGRIJK: Vul hier je eigen bedrijfsgegevens in!
 * Deze worden gebruikt voor facturen en betalingen.
 */

export const companyInfo = {
  // Bedrijfsnaam
  name: 'Webstability',
  legalName: 'Webstability', // Officiële handelsnaam
  
  // Adresgegevens
  address: {
    street: 'Julianalaan 41',
    postalCode: '2159 LD',
    city: 'Kaag',
    country: 'Nederland'
  },
  
  // Zakelijke gegevens
  kvk: '91186307',
  btw: 'NL004875371B72',
  iban: 'NL89INGB0105461474',
  bic: 'INGBNL2A',
  
  // Contactgegevens
  email: 'info@webstability.nl',
  phone: '+31 6 12345678',
  website: 'https://webstability.nl',
  
  // Logo URL voor facturen
  logoUrl: 'https://webstability.nl/logo.png',
  
  // Factuur instellingen
  invoicePrefix: 'WS',               // Factuur prefix: WS-2025-0001
  paymentTermDays: 14,               // Betaaltermijn in dagen
  
  // Mollie configuratie
  mollie: {
    profileId: '',                   // ← Vul in vanuit Mollie dashboard
    testMode: import.meta.env?.MODE !== 'production'
  }
}

// BTW percentage Nederland
export const VAT_RATE = 0.21 // 21%

// Bereken prijs excl BTW vanuit incl BTW
export const calcExclVat = (inclVat: number): number => {
  return Math.round((inclVat / (1 + VAT_RATE)) * 100) / 100
}

// Bereken BTW bedrag
export const calcVatAmount = (exclVat: number): number => {
  return Math.round(exclVat * VAT_RATE * 100) / 100
}

/**
 * Pakket configuratie met prijzen
 * Prijzen zijn INCLUSIEF BTW (consumentenprijzen)
 */
export const packages = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceInclVat: 29.00,
    priceExclVat: calcExclVat(29.00), // €23.97
    interval: 'monthly' as const,
    intervalMonths: 1,
    description: 'Website abonnement - Starter pakket',
    features: [
      'Professionele website',
      '1 pagina',
      'Mobiel responsive',
      'SSL certificaat',
      'Hosting inbegrepen'
    ]
  },
  professional: {
    id: 'professional',
    name: 'Professional', 
    priceInclVat: 49.00,
    priceExclVat: calcExclVat(49.00), // €40.50
    interval: 'monthly' as const,
    intervalMonths: 1,
    description: 'Website abonnement - Professional pakket',
    features: [
      'Professionele website',
      '5 pagina\'s',
      'Contactformulier',
      'Mobiel responsive',
      'SSL certificaat',
      'Hosting inbegrepen',
      'SEO basis'
    ]
  },
  business: {
    id: 'business',
    name: 'Business',
    priceInclVat: 79.00,
    priceExclVat: calcExclVat(79.00), // €65.29
    interval: 'monthly' as const,
    intervalMonths: 1,
    description: 'Website abonnement - Business pakket',
    features: [
      'Professionele website',
      '10 pagina\'s',
      'Contactformulier',
      'Blog functionaliteit',
      'Mobiel responsive',
      'SSL certificaat',
      'Hosting inbegrepen',
      'SEO optimalisatie',
      'Google Analytics'
    ]
  },
  webshop: {
    id: 'webshop',
    name: 'Webshop',
    priceInclVat: 99.00,
    priceExclVat: calcExclVat(99.00), // €81.82
    interval: 'monthly' as const,
    intervalMonths: 1,
    description: 'Website abonnement - Webshop pakket',
    features: [
      'Complete webshop',
      'Onbeperkt producten',
      'Betaalintegratie',
      'Voorraad beheer',
      'Mobiel responsive',
      'SSL certificaat',
      'Hosting inbegrepen',
      'SEO optimalisatie'
    ]
  }
} as const

export type PackageType = keyof typeof packages

export const getPackage = (type: PackageType) => packages[type]

/**
 * Extra services (eenmalige betalingen)
 */
export const extraServices = {
  drone: {
    id: 'drone',
    name: 'Drone Footage',
    priceInclVat: 299.00,
    priceExclVat: calcExclVat(299.00),
    description: 'Professionele drone opnames voor je website'
  },
  logo: {
    id: 'logo',
    name: 'Logo Ontwerp',
    priceInclVat: 199.00,
    priceExclVat: calcExclVat(199.00),
    description: 'Professioneel logo ontwerp'
  },
  fotografie: {
    id: 'fotografie',
    name: 'Fotografie',
    priceInclVat: 349.00,
    priceExclVat: calcExclVat(349.00),
    description: 'Professionele bedrijfsfotografie'
  },
  teksten: {
    id: 'teksten',
    name: 'Teksten Schrijven',
    priceInclVat: 149.00,
    priceExclVat: calcExclVat(149.00),
    description: 'Professionele webteksten'
  },
  seo: {
    id: 'seo',
    name: 'SEO Pakket',
    priceInclVat: 199.00,
    priceExclVat: calcExclVat(199.00),
    description: 'Uitgebreide SEO optimalisatie'
  }
} as const

export type ExtraServiceType = keyof typeof extraServices
