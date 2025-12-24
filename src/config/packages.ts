// ===========================================
// PACKAGE CONFIGURATION
// Defines features, pricing, and phase specifics per package
// ===========================================

export type PackageType = 'starter' | 'professional' | 'business' | 'webshop'
export type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live'

export interface PackageConfig {
  id: PackageType
  name: string
  price: number
  setupFee: number
  color: string
  gradient: string
  icon: string
  features: string[]
  revisions: number
  changesPerMonth: number  // Wijzigingen per maand na livegang
  estimatedDays: Record<ProjectPhase, number>
  feedbackQuestionIds: string[]  // Welke feedback vragen per pakket
  phaseDescriptions: Record<ProjectPhase, {
    title: string
    description: string
    clientTasks: string[]
    tips: string[]
  }>
}

export const PACKAGES: Record<PackageType, PackageConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 119,
    setupFee: 149,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    icon: '🚀',
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Basis SEO-optimalisatie',
      'Contactformulier + WhatsApp',
      'SSL-certificaat + hosting',
      '2 wijzigingen per maand'
    ],
    revisions: 2,
    changesPerMonth: 2,
    feedbackQuestionIds: ['branding-colors', 'content-text', 'func-mobile'],
    estimatedDays: {
      onboarding: 1,
      design: 5,
      feedback: 2,
      revisie: 2,
      payment: 1,
      approval: 1,
      live: 0
    },
    phaseDescriptions: {
      onboarding: {
        title: 'Vertel ons over je bedrijf',
        description: 'We hebben wat basisinformatie nodig om je website te maken. Dit duurt ongeveer 5-10 minuten.',
        clientTasks: [
          'Vul je bedrijfsgegevens in',
          'Upload je logo (of laat ons er één maken)',
          'Beschrijf kort wat je doet',
          'Lever teksten aan voor je pagina\'s'
        ],
        tips: [
          'Heb je nog geen logo? Geen probleem, we kunnen er één voor je ontwerpen',
          'Kies 2-3 foto\'s die je bedrijf het beste representeren'
        ]
      },
      design: {
        title: 'We bouwen je website',
        description: 'Ons team werkt aan je website. Dit duurt gemiddeld 5-7 werkdagen.',
        clientTasks: [],
        tips: [
          'Je ontvangt een e-mail zodra de preview klaar is',
          'Bekijk ondertussen inspiratie op onze portfolio'
        ]
      },
      feedback: {
        title: 'Bekijk je design',
        description: 'Je website preview is klaar! Bekijk hem en laat ons weten wat je ervan vindt.',
        clientTasks: [
          'Bekijk de preview zorgvuldig',
          'Check de teksten op fouten',
          'Geef je feedback via het formulier'
        ],
        tips: [
          'Je hebt 2 revisierondes inclusief',
          'Wees specifiek in je feedback voor het beste resultaat'
        ]
      },
      revisie: {
        title: 'We verwerken je feedback',
        description: 'We passen je website aan op basis van je feedback. Dit duurt 1-2 werkdagen.',
        clientTasks: [],
        tips: [
          'Je ontvangt een e-mail wanneer de aanpassingen klaar zijn'
        ]
      },
      payment: {
        title: 'Betaling afronden',
        description: 'Je website is goedgekeurd! Rond de betaling af om live te gaan.',
        clientTasks: [
          'Kies je betaalmethode',
          'Voltooi de betaling van €119/maand + €149 opstartkosten'
        ],
        tips: [
          'Betaling is maandelijks opzegbaar na 3 maanden',
          'Je eerste maand start na livegang'
        ]
      },
      approval: {
        title: 'Laatste check',
        description: 'Controleer of alles klopt voordat we live gaan.',
        clientTasks: [
          'Check je contactgegevens',
          'Bevestig je domeinnaam',
          'Geef je akkoord'
        ],
        tips: [
          'Na goedkeuring gaan we binnen 24 uur live'
        ]
      },
      live: {
        title: 'Je website is live! 🎉',
        description: 'Gefeliciteerd! Je website is nu bereikbaar voor iedereen.',
        clientTasks: [],
        tips: [
          'Deel je website op social media',
          'Vraag klanten om een review'
        ]
      }
    }
  },

  professional: {
    id: 'professional',
    name: 'Professioneel',
    price: 169,
    setupFee: 199,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    icon: '💼',
    features: [
      'Tot 10 pagina\'s',
      'Premium responsive design',
      'Uitgebreide SEO + rapportages',
      'Blog functionaliteit',
      'Google Analytics dashboard',
      'Onbeperkt tekstwijzigingen'
    ],
    revisions: 4,
    changesPerMonth: 999,
    feedbackQuestionIds: ['branding-colors', 'branding-style', 'content-text', 'func-mobile', 'func-navigation'],
    estimatedDays: {
      onboarding: 2,
      design: 5,
      feedback: 3,
      revisie: 2,
      payment: 1,
      approval: 1,
      live: 0
    },
    phaseDescriptions: {
      onboarding: {
        title: 'Laten we je website plannen',
        description: 'We maken een professionele website voor je. Vertel ons over je bedrijf en wat je wilt bereiken.',
        clientTasks: [
          'Vul je bedrijfsgegevens in',
          'Upload je logo en huisstijl',
          'Beschrijf je diensten of producten',
          'Lever teksten aan voor elke pagina',
          'Upload foto\'s van je werk/team'
        ],
        tips: [
          'Goede foto\'s maken een groot verschil',
          'Denk na over je belangrijkste call-to-action',
          'Bekijk websites van concurrenten voor inspiratie'
        ]
      },
      design: {
        title: 'We ontwerpen je website',
        description: 'Ons designteam werkt aan je website. Dit duurt gemiddeld 5 werkdagen.',
        clientTasks: [],
        tips: [
          'Je ontvangt een e-mail zodra de preview klaar is',
          'We houden rekening met je huisstijl en branche'
        ]
      },
      feedback: {
        title: 'Bekijk je ontwerp',
        description: 'Je website preview is klaar! Neem de tijd om alles te bekijken.',
        clientTasks: [
          'Bekijk alle pagina\'s',
          'Test de navigatie',
          'Check alle teksten',
          'Bekijk de mobiele versie',
          'Geef gedetailleerde feedback'
        ],
        tips: [
          'Je hebt 2 revisierondes inclusief',
          'Maak screenshots van punten die je wilt aanpassen'
        ]
      },
      revisie: {
        title: 'We verwerken je feedback',
        description: 'We passen alles aan op basis van je feedback. Dit duurt 1-2 werkdagen.',
        clientTasks: [],
        tips: [
          'Na deze ronde heb je nog 1 revisie over'
        ]
      },
      payment: {
        title: 'Betaling afronden',
        description: 'Je website is goedgekeurd! Rond de betaling af om live te gaan.',
        clientTasks: [
          'Kies je betaalmethode',
          'Voltooi de betaling van €169/maand + €199 opstartkosten'
        ],
        tips: [
          'Betaling is maandelijks opzegbaar na 3 maanden',
          'Hosting, onderhoud en onbeperkt wijzigingen inbegrepen'
        ]
      },
      approval: {
        title: 'Laatste check voor livegang',
        description: 'Controleer of alles perfect is voordat we live gaan.',
        clientTasks: [
          'Check al je contactgegevens',
          'Controleer je domeinnaam',
          'Bevestig je Google Analytics koppeling',
          'Geef je definitieve akkoord'
        ],
        tips: [
          'Na goedkeuring gaan we binnen 24 uur live'
        ]
      },
      live: {
        title: 'Je website is live! 🎉',
        description: 'Gefeliciteerd! Je professionele website is nu online.',
        clientTasks: [],
        tips: [
          'Deel je website op LinkedIn',
          'Voeg je website toe aan je e-mail handtekening',
          'Bekijk je eerste bezoekers in Google Analytics'
        ]
      }
    }
  },

  business: {
    id: 'business',
    name: 'Business',
    price: 249,
    setupFee: 299,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    icon: '🏢',
    features: [
      'Tot 20+ pagina\'s',
      'Premium custom design',
      'Online boekingssysteem',
      'Meertalige website (NL/EN/DE)',
      'CRM/Nieuwsbrief integratie',
      'Dedicated accountmanager'
    ],
    revisions: 6,
    changesPerMonth: 999,
    feedbackQuestionIds: ['branding-colors', 'branding-style', 'branding-professional', 'content-text', 'content-services', 'func-mobile', 'func-navigation', 'func-contact', 'images-quality'],
    estimatedDays: {
      onboarding: 3,
      design: 7,
      feedback: 4,
      revisie: 3,
      payment: 1,
      approval: 1,
      live: 0
    },
    phaseDescriptions: {
      onboarding: {
        title: 'Laten we een strategie maken',
        description: 'Je Business website verdient een grondige aanpak. Laten we samen je doelen en wensen bespreken.',
        clientTasks: [
          'Vul de uitgebreide vragenlijst in',
          'Upload je complete huisstijl (logo, kleuren, fonts)',
          'Lever teksten aan voor alle pagina\'s',
          'Deel je contentkalender (indien aanwezig)',
          'Upload professionele foto\'s',
          'Geef aan welke integraties je wilt'
        ],
        tips: [
          'Denk na over je SEO keywords',
          'Bereid een overzicht van je diensten/producten voor',
          'We kunnen een korte kickoff call inplannen'
        ]
      },
      design: {
        title: 'We bouwen je premium website',
        description: 'Ons team werkt aan je uitgebreide website. Dit duurt gemiddeld 7 werkdagen.',
        clientTasks: [],
        tips: [
          'Je krijgt tussentijdse updates',
          'We optimaliseren voor conversie'
        ]
      },
      feedback: {
        title: 'Bekijk je premium ontwerp',
        description: 'Je Business website is klaar voor review! Neem uitgebreid de tijd.',
        clientTasks: [
          'Bekijk alle pagina\'s op desktop en mobiel',
          'Test alle formulieren',
          'Check de blog functionaliteit',
          'Review de nieuwsbrief integratie',
          'Test de snelheid',
          'Geef gestructureerde feedback'
        ],
        tips: [
          'Je hebt 3 revisierondes inclusief',
          'Gebruik onze feedback template voor de beste resultaten'
        ]
      },
      revisie: {
        title: 'We perfectioneren je website',
        description: 'We verwerken je feedback met extra aandacht voor detail.',
        clientTasks: [],
        tips: [
          'Priority support betekent snellere updates'
        ]
      },
      payment: {
        title: 'Betaling afronden',
        description: 'Je Business website is goedgekeurd! Tijd om live te gaan.',
        clientTasks: [
          'Kies je betaalmethode',
          'Voltooi de betaling van €249/maand + €299 opstartkosten'
        ],
        tips: [
          'All-inclusive: hosting, onderhoud, updates en priority support'
        ]
      },
      approval: {
        title: 'Livegang voorbereiden',
        description: 'We gaan je website lanceren. Even alles controleren.',
        clientTasks: [
          'Check alle contactformulieren',
          'Bevestig je domeinnaam en e-mail',
          'Review je Google Analytics setup',
          'Controleer je nieuwsbrief settings',
          'Geef je definitieve akkoord'
        ],
        tips: [
          'We helpen je met de lancering strategie'
        ]
      },
      live: {
        title: 'Je Business website is live! 🎉',
        description: 'Gefeliciteerd! Je professionele online presence is nu actief.',
        clientTasks: [],
        tips: [
          'Plan een social media campagne voor je launch',
          'Stuur een nieuwsbrief naar je klanten',
          'Bekijk je statistieken na 1 week'
        ]
      }
    }
  },

  webshop: {
    id: 'webshop',
    name: 'Webshop',
    price: 399,
    setupFee: 299,
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    icon: '🛒',
    features: [
      'Tot 100 producten',
      'iDEAL, creditcard & PayPal',
      'PostNL integratie',
      'Order management',
      'Automatische facturen',
      'Mobiel-geoptimaliseerd'
    ],
    revisions: 2,
    changesPerMonth: 2,
    feedbackQuestionIds: ['branding-colors', 'branding-style', 'branding-professional', 'content-text', 'content-prices', 'content-services', 'func-mobile', 'func-navigation', 'func-contact', 'func-speed', 'images-quality', 'images-representative'],
    estimatedDays: {
      onboarding: 4,
      design: 10,
      feedback: 5,
      revisie: 3,
      payment: 1,
      approval: 2,
      live: 0
    },
    phaseDescriptions: {
      onboarding: {
        title: 'Laten we je webshop plannen',
        description: 'Een webshop vereist grondige voorbereiding. Laten we alles doornemen.',
        clientTasks: [
          'Vul de webshop vragenlijst in',
          'Upload je huisstijl en branding',
          'Lever je productcatalogus aan (CSV of handmatig)',
          'Upload productfoto\'s (min. 800x800px)',
          'Beschrijf je verzendopties',
          'Geef je BTW en KVK gegevens door',
          'Kies je betaalmethodes'
        ],
        tips: [
          'Goede productfoto\'s verkopen beter',
          'Bereid je retourbeleid voor',
          'Denk na over je verzendtarieven'
        ]
      },
      design: {
        title: 'We bouwen je webshop',
        description: 'Ons team bouwt je complete webshop. Dit duurt gemiddeld 10 werkdagen.',
        clientTasks: [],
        tips: [
          'We uploaden je eerste producten',
          'Je ontvangt tussentijdse updates',
          'We testen alle betaalmethodes'
        ]
      },
      feedback: {
        title: 'Test je webshop',
        description: 'Je webshop is klaar voor review! Test grondig alle functionaliteit.',
        clientTasks: [
          'Bekijk de homepage en categoriepagina\'s',
          'Check alle productpagina\'s',
          'Doe een test bestelling',
          'Test de betaalmethodes',
          'Review de order confirmatie e-mails',
          'Check de mobiele ervaring',
          'Geef gedetailleerde feedback'
        ],
        tips: [
          'Test met verschillende producten',
          'Check de laadsnelheid',
          'Vraag iemand anders ook te testen'
        ]
      },
      revisie: {
        title: 'We optimaliseren je webshop',
        description: 'We verwerken je feedback en optimaliseren de shop voor conversie.',
        clientTasks: [],
        tips: [
          'We testen na elke aanpassing',
          'Priority support voor snelle fixes'
        ]
      },
      payment: {
        title: 'Betaling en go-live voorbereiden',
        description: 'Je webshop is goedgekeurd! Tijd voor de laatste stappen.',
        clientTasks: [
          'Voltooi de betaling van €399/maand + €299 opstartkosten',
          'Controleer je Mollie/Stripe koppeling',
          'Bevestig je verzendopties'
        ],
        tips: [
          'We helpen je met de betaalaccount setup',
          'Eerste maand start na livegang'
        ]
      },
      approval: {
        title: 'Launch checklist',
        description: 'Laatste checks voordat je klanten kunnen bestellen.',
        clientTasks: [
          'Controleer alle producten en prijzen',
          'Test een echte betaling',
          'Check je juridische pagina\'s (AV, privacy)',
          'Bevestig je voorraad',
          'Review je verzendtarieven',
          'Geef je definitieve akkoord'
        ],
        tips: [
          'We doen een gezamenlijke test',
          'Bereid je eerste promotie voor'
        ]
      },
      live: {
        title: 'Je webshop is LIVE! 🛒🎉',
        description: 'Gefeliciteerd! Je kunt nu online verkopen!',
        clientTasks: [],
        tips: [
          'Deel je shop op alle social media',
          'Start met Google Shopping ads',
          'Stuur een launch e-mail naar je netwerk',
          'Bekijk je eerste orders in het dashboard'
        ]
      }
    }
  }
}

// Helper function to get package by type
export const getPackage = (type: PackageType): PackageConfig => PACKAGES[type]

// Get phase info for a specific package
export const getPhaseInfo = (
  packageType: PackageType, 
  phase: ProjectPhase
) => PACKAGES[packageType].phaseDescriptions[phase]

// Get total estimated days for a package
export const getTotalEstimatedDays = (packageType: PackageType): number => {
  const pkg = PACKAGES[packageType]
  return Object.values(pkg.estimatedDays).reduce((sum, days) => sum + days, 0)
}

// Get remaining revisions
export const getRemainingRevisions = (packageType: PackageType, usedRevisions: number): number => {
  return Math.max(0, PACKAGES[packageType].revisions - usedRevisions)
}
