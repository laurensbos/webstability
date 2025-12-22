// Centrale pakketten data - wordt gebruikt door Pricing, StartProject, en Websites pagina's
// Alle prijzen zijn INCLUSIEF 21% BTW

export interface Package {
  id: string
  name: string
  price: number
  priceExcl: number
  setupFee: number
  tagline: string
  description: string
  features: string[]
  featuresDetailed: {
    category: string
    items: string[]
  }[]
  deliveryDays: number
  popular?: boolean
  maxPages: number | 'unlimited'
  supportResponseTime: string
  revisionsPerMonth: number | 'unlimited'
}

export const packages: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 119,
    priceExcl: 98,
    setupFee: 149,
    tagline: 'Ideaal om te beginnen',
    description: 'Perfect voor ZZP\'ers en kleine ondernemers die online willen starten met een professionele uitstraling.',
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Contactformulier + WhatsApp button',
      'Google Maps integratie',
      'Basis SEO-optimalisatie',
      'SSL-certificaat + hosting',
    ],
    featuresDetailed: [
      {
        category: 'Website',
        items: [
          'Tot 5 pagina\'s (Home, Over ons, Diensten, Contact, etc.)',
          'Volledig responsive design (mobiel, tablet, desktop)',
          'Modern en clean ontwerp passend bij je huisstijl',
          'Snelle laadtijden (< 3 seconden)',
        ]
      },
      {
        category: 'Functionaliteiten',
        items: [
          'Contactformulier met e-mailnotificaties',
          'Google Maps locatie integratie',
          'Social media iconen met links',
          'Click-to-call telefoonknop',
          'WhatsApp chat button',
        ]
      },
      {
        category: 'SEO & Technisch',
        items: [
          'Basis SEO-optimalisatie (meta titles, descriptions)',
          'SSL-certificaat (https://)',
          'Snelle hosting in Nederland',
          'Wekelijkse backups',
        ]
      },
      {
        category: 'Support & Onderhoud',
        items: [
          '2 tekstwijzigingen per maand inbegrepen',
          'E-mail support (48u reactietijd)',
          'Technisch onderhoud & updates',
          'Uptime monitoring',
          'Wekelijkse backups',
        ]
      }
    ],
    deliveryDays: 7,
    popular: false,
    maxPages: 5,
    supportResponseTime: '48 uur',
    revisionsPerMonth: 2,
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: 169,
    priceExcl: 140,
    setupFee: 199,
    tagline: 'Voor groeiende ondernemers',
    description: 'Voor ondernemers die serieus willen groeien. Meer pagina\'s, betere SEO en uitgebreidere functionaliteiten.',
    features: [
      'Tot 10 pagina\'s',
      'Alles van Starter +',
      'Blog functionaliteit',
      'Google Analytics dashboard',
      'Uitgebreide SEO + rapportages',
      'Onbeperkt tekstwijzigingen',
    ],
    featuresDetailed: [
      {
        category: 'Website',
        items: [
          'Tot 10 pagina\'s volledig op maat',
          'Premium responsive design',
          'Animaties en interactieve elementen',
          'Geoptimaliseerd voor conversie',
          'Meerdere call-to-actions',
        ]
      },
      {
        category: 'Functionaliteiten',
        items: [
          'Alles van Starter pakket +',
          'Blog met categorieën en tags',
          'Nieuwsbrief aanmeldformulier',
          'FAQ sectie met accordion',
          'Afbeeldingen galerij/portfolio',
          'Reviews/testimonials sectie',
        ]
      },
      {
        category: 'SEO & Analytics',
        items: [
          'Uitgebreide SEO-optimalisatie',
          'Google Analytics 4 integratie',
          'Google Search Console setup',
          'Maandelijkse SEO rapportage',
          'Sitemap & robots.txt',
          'Schema markup voor Google',
        ]
      },
      {
        category: 'Support & Onderhoud',
        items: [
          'Onbeperkt tekstwijzigingen per maand',
          'E-mail & WhatsApp support (24u reactietijd)',
          'Maandelijks onderhoud & updates',
          'Prioriteit bij technische issues',
          'Dagelijkse backups',
        ]
      }
    ],
    deliveryDays: 10,
    popular: true,
    maxPages: 10,
    supportResponseTime: '24 uur',
    revisionsPerMonth: 'unlimited',
  },
  {
    id: 'business',
    name: 'Business',
    price: 249,
    priceExcl: 206,
    setupFee: 299,
    tagline: 'Complete oplossing',
    description: 'Voor gevestigde bedrijven die het beste willen. Volledige vrijheid, premium support en geavanceerde functionaliteiten.',
    features: [
      'Tot 20+ pagina\'s',
      'Alles van Professioneel +',
      'Online boekingssysteem',
      'Meertalige website (NL/EN/DE)',
      'CRM/Nieuwsbrief integratie',
      'Dedicated accountmanager',
    ],
    featuresDetailed: [
      {
        category: 'Website',
        items: [
          'Tot 20+ pagina\'s (geen limiet bij doorlopend project)',
          'Premium custom design door senior designer',
          'Geavanceerde animaties en micro-interacties',
          'Conversion-geoptimaliseerde landingspagina\'s',
          'A/B testing mogelijkheden',
        ]
      },
      {
        category: 'Functionaliteiten',
        items: [
          'Alles van Professioneel pakket +',
          'Online boekings-/afsprakensysteem',
          'Meertalige website (NL/EN/DE)',
          'Klantenportaal met login',
          'Formulieren met voorwaardelijke logica',
          'PDF downloads en bronnen bibliotheek',
          'Video integraties (Vimeo/YouTube)',
        ]
      },
      {
        category: 'Integraties',
        items: [
          'Mailchimp/ActiveCampaign integratie',
          'CRM koppeling (HubSpot, Salesforce)',
          'Boekhoud integratie (Exact, Moneybird)',
          'Calendly/Cal.com booking',
          'Zapier automatiseringen',
          'Custom API koppelingen',
        ]
      },
      {
        category: 'Support & Onderhoud',
        items: [
          'Onbeperkt wijzigingen (tekst, afbeeldingen, kleine aanpassingen)',
          'Dedicated accountmanager',
          'Telefoon, e-mail & WhatsApp support',
          'Same-day response bij urgente issues',
          'Kwartaal strategie call',
          'Realtime uptime monitoring met alerts',
        ]
      }
    ],
    deliveryDays: 14,
    popular: false,
    maxPages: 20,
    supportResponseTime: '4 uur',
    revisionsPerMonth: 'unlimited',
  },
]

// Webshop pakketten - aparte array
export const webshopPackages: Package[] = [
  {
    id: 'webshop-starter',
    name: 'Starter',
    price: 399,
    priceExcl: 330,
    setupFee: 299,
    tagline: 'Start met verkopen',
    description: 'Perfect om te beginnen met online verkopen. Alle basis functionaliteiten voor een succesvolle start.',
    features: [
      'Tot 100 producten',
      'iDEAL, creditcard & PayPal',
      'PostNL integratie',
      'Order management',
      'Automatische facturen',
      'Mobiel-geoptimaliseerd design',
    ],
    featuresDetailed: [
      {
        category: 'Webshop',
        items: [
          'Tot 100 producten met varianten',
          'Professioneel responsive design',
          'Productcategorieën en filters',
          'Zoekfunctie',
          'Productafbeeldingen gallery',
        ]
      },
      {
        category: 'Betalingen',
        items: [
          'iDEAL (alle banken)',
          'Creditcard (Visa, Mastercard)',
          'PayPal',
          'Bancontact (België)',
          'Veilige checkout (PCI compliant)',
          'Automatische facturen',
        ]
      },
      {
        category: 'Verzending',
        items: [
          'PostNL integratie',
          'Vast verzendtarief',
          'Gratis verzending vanaf bedrag',
          'Track & trace voor klanten',
        ]
      },
      {
        category: 'Beheer & Support',
        items: [
          'Eenvoudig productbeheer',
          'Order notificaties via e-mail',
          'Basis voorraadwaarschuwingen',
          'E-mail support (48u reactietijd)',
          'Wekelijkse backups',
        ]
      }
    ],
    deliveryDays: 14,
    popular: false,
    maxPages: 'unlimited',
    supportResponseTime: '48 uur',
    revisionsPerMonth: 2,
  },
  {
    id: 'webshop-professional',
    name: 'Professioneel',
    price: 499,
    priceExcl: 413,
    setupFee: 399,
    tagline: 'Voor groeiende webshops',
    description: 'Voor serieuze webshops die willen groeien. Alle betaalmethodes, geavanceerde verzending en marketing tools.',
    features: [
      'Tot 500 producten',
      'Alle betaalmethodes + Klarna',
      'PostNL + DHL integratie',
      'Kortingscodes & acties',
      'Klantaccounts + reviews',
      'Boekhoudkoppeling',
    ],
    featuresDetailed: [
      {
        category: 'Webshop',
        items: [
          'Tot 500 producten met onbeperkte varianten',
          'Premium custom design',
          'Geavanceerde productfilters',
          'Product vergelijken',
          'Recent bekeken producten',
          'Cross-sell en upsell mogelijkheden',
        ]
      },
      {
        category: 'Betalingen',
        items: [
          'Alle iDEAL banken',
          'Creditcard (Visa, Mastercard, Amex)',
          'PayPal',
          'Klarna (achteraf betalen)',
          'Apple Pay & Google Pay',
          'Bancontact & SOFORT',
        ]
      },
      {
        category: 'Verzending & Logistiek',
        items: [
          'PostNL & DHL integratie',
          'Automatische verzendlabels',
          'Meerdere verzendmethodes',
          'Afhalen in winkel',
          'Verzendkosten per gewicht/zone',
          'Track & trace notificaties',
        ]
      },
      {
        category: 'Marketing & Klanten',
        items: [
          'Kortingscodes (%, vast bedrag, gratis verzending)',
          'Klantaccounts met orderhistorie',
          'Verlaten winkelwagen e-mails',
          'Nieuwsbrief integratie',
          'Google Shopping feed',
          'Facebook Pixel integratie',
        ]
      },
      {
        category: 'Beheer & Integraties',
        items: [
          'Koppeling Exact/Moneybird/e-Boekhouden',
          'Voorraad synchronisatie',
          'Export naar Excel/CSV',
          'WhatsApp & e-mail support (24u)',
          'Dagelijkse backups',
        ]
      }
    ],
    deliveryDays: 21,
    popular: true,
    maxPages: 'unlimited',
    supportResponseTime: '24 uur',
    revisionsPerMonth: 'unlimited',
  },
  {
    id: 'webshop-business',
    name: 'Business',
    price: 699,
    priceExcl: 578,
    setupFee: 549,
    tagline: 'Enterprise oplossing',
    description: 'Complete e-commerce oplossing voor ambitieuze ondernemers. Onbeperkt producten, B2B functionaliteiten en premium support.',
    features: [
      'Onbeperkt producten',
      'B2B functionaliteiten',
      'Multi-carrier verzending',
      'Geavanceerde rapportages',
      'API koppelingen',
      'Dedicated accountmanager',
    ],
    featuresDetailed: [
      {
        category: 'Webshop',
        items: [
          'Onbeperkt producten',
          'Premium enterprise design',
          'Mega menu navigatie',
          'Geavanceerde zoek met autocomplete',
          'Productbundels en sets',
          'Digitale producten (downloads)',
        ]
      },
      {
        category: 'B2B Functionaliteiten',
        items: [
          'B2B klantgroepen met staffelprijzen',
          'Offerte aanvraag systeem',
          'Inkooporders en goedkeuring',
          'BTW-vrije verkoop aan zakelijk',
          'Minimum bestelwaarde per klantgroep',
          'Gepersonaliseerde catalogi',
        ]
      },
      {
        category: 'Verzending & Fulfilment',
        items: [
          'PostNL, DHL, DPD, UPS integratie',
          'Fulfilment center koppeling',
          'Dropshipping integratie',
          'Internationale verzending',
          'Verzendregels per product/categorie',
          'Retourportaal voor klanten',
        ]
      },
      {
        category: 'Analytics & Rapportages',
        items: [
          'Real-time sales dashboard',
          'Geavanceerde verkooprapporten',
          'Klantwaarde analyse (CLV)',
          'Voorraad- en omzetprognoses',
          'Custom rapportages op aanvraag',
        ]
      },
      {
        category: 'Integraties & API',
        items: [
          'REST API toegang',
          'ERP/WMS koppelingen',
          'PIM systeem integratie',
          'Channable/Channeble feed',
          'Bol.com/Amazon marketplace sync',
          'Custom webhook triggers',
        ]
      },
      {
        category: 'Support',
        items: [
          'Dedicated accountmanager',
          'Telefoon & WhatsApp support',
          'Same-day response',
          'Maandelijkse strategie call',
          'Onbeperkte wijzigingen',
          '99.9% uptime garantie',
        ]
      }
    ],
    deliveryDays: 28,
    popular: false,
    maxPages: 'unlimited',
    supportResponseTime: '4 uur',
    revisionsPerMonth: 'unlimited',
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

// Helper om levertijd tekst te krijgen
export const getDeliveryText = (days: number): string => {
  if (days <= 7) return `Binnen ${days} werkdagen`
  if (days <= 14) return `Binnen ${Math.ceil(days / 7)} weken`
  return `Binnen ${Math.ceil(days / 7)} weken`
}
