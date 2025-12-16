// Centrale pakketten data - wordt gebruikt door Pricing, StartProject, en Websites pagina's
// Alle prijzen zijn INCLUSIEF 21% BTW

export interface Package {
  id: string
  name: string
  price: number
  priceExcl: number
  tagline: string
  features: string[]
  popular?: boolean
  maxPages: number | 'unlimited'
}

export const packages: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 96,
    priceExcl: 79,
    tagline: 'Ideaal om te beginnen',
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Contactformulier',
      'Google Maps integratie',
    ],
    popular: false,
    maxPages: 5,
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: 180,
    priceExcl: 149,
    tagline: 'Meest gekozen',
    features: [
      'Tot 10 pagina\'s',
      'Alles van Starter +',
      'Blog functionaliteit',
      'Social media integratie',
      'Google Analytics',
    ],
    popular: true,
    maxPages: 10,
  },
  {
    id: 'business',
    name: 'Business',
    price: 301,
    priceExcl: 249,
    tagline: 'Voor groeiende bedrijven',
    features: [
      'Tot 20 pagina\'s',
      'Alles van Professioneel +',
      'Online boekingssysteem',
      'Nieuwsbrief integratie',
      'Meerdere talen',
    ],
    popular: false,
    maxPages: 20,
  },
  {
    id: 'webshop-starter',
    name: 'Webshop Starter',
    price: 301,
    priceExcl: 249,
    tagline: 'Start met verkopen',
    features: [
      'Tot 50 producten',
      'iDEAL & creditcard',
      'Basis verzendopties',
      'Order management',
      'E-mail notificaties',
    ],
    popular: false,
    maxPages: 'unlimited',
  },
  {
    id: 'webshop-pro',
    name: 'Webshop Pro',
    price: 422,
    priceExcl: 349,
    tagline: 'Verkoop online',
    features: [
      'Tot 500 producten',
      'Alle betaalmethodes',
      'Geavanceerde verzending',
      'Koppeling met boekhouden',
      'Kortingscodes systeem',
    ],
    popular: false,
    maxPages: 'unlimited',
  },
]

// Wat altijd inbegrepen is bij elk pakket
export const includedFeatures = [
  'Hosting & SSL-certificaat',
  'Domein beheer',
  'Onderhoud & updates',
  'Persoonlijke support',
  'Maandelijkse aanpassingen',
  'SEO geoptimaliseerd',
]

// Trust badges
export const trustBadges = [
  'Geen verborgen kosten',
  'Maandelijks opzegbaar',
  '14 dagen geld-terug',
]
