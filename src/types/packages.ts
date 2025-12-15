/**
 * Pakket configuratie en limieten voor Webstability
 */

export type PackageType = 'starter' | 'professional' | 'business' | 'webshop'

export interface PackageLimits {
  maxPages: number
  revisions: number
  hasContactForm: boolean
  hasBlog: boolean
  hasBookingSystem: boolean
  hasWebshop: boolean
  hasSEOOptimization: boolean
  hasPrioritySupport: boolean
  hasAnalytics: boolean
  hasSocialIntegration: boolean
  hasMultiLanguage: boolean
  deliveryDays: number
  monthlyPrice: number
  setupFee: number
}

export interface PackageConfig {
  key: PackageType
  name: string
  tagline: string
  limits: PackageLimits
  recommendedFor: string[]
  features: string[]
  notIncluded: string[]
}

export const PACKAGE_CONFIGS: Record<PackageType, PackageConfig> = {
  starter: {
    key: 'starter',
    name: 'Starter',
    tagline: 'Perfect voor ZZP\'ers en starters',
    limits: {
      maxPages: 5,
      revisions: 2,
      hasContactForm: true,
      hasBlog: false,
      hasBookingSystem: false,
      hasWebshop: false,
      hasSEOOptimization: false,
      hasPrioritySupport: false,
      hasAnalytics: true,
      hasSocialIntegration: true,
      hasMultiLanguage: false,
      deliveryDays: 7,
      monthlyPrice: 79,
      setupFee: 99
    },
    recommendedFor: [
      'ZZP\'ers',
      'Freelancers', 
      'Starters',
      'Kleine dienstverleners'
    ],
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Contactformulier',
      'SSL certificaat',
      'Basis hosting',
      '2 revisierondes',
      'Google Analytics'
    ],
    notIncluded: [
      'Blog functionaliteit',
      'SEO optimalisatie pakket',
      'Boekingssysteem',
      'Meertalig'
    ]
  },
  professional: {
    key: 'professional',
    name: 'Professioneel',
    tagline: 'Voor groeiende ondernemers',
    limits: {
      maxPages: 10,
      revisions: 3,
      hasContactForm: true,
      hasBlog: true,
      hasBookingSystem: false,
      hasWebshop: false,
      hasSEOOptimization: true,
      hasPrioritySupport: false,
      hasAnalytics: true,
      hasSocialIntegration: true,
      hasMultiLanguage: false,
      deliveryDays: 10,
      monthlyPrice: 149,
      setupFee: 199
    },
    recommendedFor: [
      'MKB bedrijven',
      'Consultants',
      'Coaches',
      'Creatieve bureaus'
    ],
    features: [
      'Tot 10 pagina\'s',
      'Responsive design',
      'Contactformulier',
      'Blog functionaliteit',
      'SEO optimalisatie',
      'SSL certificaat',
      'Premium hosting',
      '3 revisierondes',
      'Google Analytics',
      'Social media integratie'
    ],
    notIncluded: [
      'Boekingssysteem',
      'Meertalig',
      'Priority support'
    ]
  },
  business: {
    key: 'business',
    name: 'Business',
    tagline: 'Complete oplossing voor bedrijven',
    limits: {
      maxPages: 20,
      revisions: 5,
      hasContactForm: true,
      hasBlog: true,
      hasBookingSystem: true,
      hasWebshop: false,
      hasSEOOptimization: true,
      hasPrioritySupport: true,
      hasAnalytics: true,
      hasSocialIntegration: true,
      hasMultiLanguage: true,
      deliveryDays: 14,
      monthlyPrice: 249,
      setupFee: 399
    },
    recommendedFor: [
      'Gevestigde bedrijven',
      'Meerdere locaties',
      'Grotere teams',
      'B2B dienstverleners'
    ],
    features: [
      'Tot 20 pagina\'s',
      'Responsive design',
      'Contactformulier',
      'Blog functionaliteit',
      'SEO optimalisatie',
      'Boekingssysteem',
      'SSL certificaat',
      'Premium hosting',
      '5 revisierondes',
      'Priority support',
      'Google Analytics',
      'Social media integratie',
      'Meertalig mogelijk'
    ],
    notIncluded: [
      'Webshop functionaliteit'
    ]
  },
  webshop: {
    key: 'webshop',
    name: 'Webshop',
    tagline: 'Verkoop online met gemak',
    limits: {
      maxPages: 15,
      revisions: 3,
      hasContactForm: true,
      hasBlog: true,
      hasBookingSystem: false,
      hasWebshop: true,
      hasSEOOptimization: true,
      hasPrioritySupport: true,
      hasAnalytics: true,
      hasSocialIntegration: true,
      hasMultiLanguage: false,
      deliveryDays: 14,
      monthlyPrice: 249,
      setupFee: 299
    },
    recommendedFor: [
      'Online retailers',
      'Productverkoop',
      'Handgemaakte producten',
      'Dropshipping'
    ],
    features: [
      'Tot 15 pagina\'s + productpagina\'s',
      'WooCommerce webshop',
      'Productbeheer',
      'Betalingen (iDEAL, creditcard)',
      'Voorraad beheer',
      'Verzendopties',
      'SSL certificaat',
      'Premium hosting',
      '3 revisierondes',
      'Priority support'
    ],
    notIncluded: [
      'Boekingssysteem',
      'Meertalig'
    ]
  }
}

/**
 * Haal pakket configuratie op
 */
export const getPackageConfig = (packageType: string): PackageConfig | null => {
  const key = packageType?.toLowerCase() as PackageType
  return PACKAGE_CONFIGS[key] || null
}

/**
 * Check of feature beschikbaar is in pakket
 */
export const isFeatureAvailable = (packageType: string, feature: keyof PackageLimits): boolean => {
  const config = getPackageConfig(packageType)
  if (!config) return false
  return !!config.limits[feature]
}

/**
 * Krijg aanbevolen pakket op basis van benodigde features
 */
export const getRecommendedPackage = (
  requiredPages: number, 
  needsBlog: boolean, 
  needsBooking: boolean, 
  needsWebshop: boolean
): PackageType => {
  if (needsWebshop) return 'webshop'
  if (needsBooking) return 'business'
  if (requiredPages > 10) return 'business'
  if (requiredPages > 5 || needsBlog) return 'professional'
  return 'starter'
}

/**
 * Validatie result voor pakket selectie
 */
export interface PackageValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  recommendedPackage?: PackageType
}

/**
 * Valideer of geselecteerde opties passen binnen pakket
 */
export const validatePackageSelection = (
  selectedPackage: PackageType,
  selectedPages: string[],
  options: {
    needsBlog?: boolean
    needsBooking?: boolean
    needsWebshop?: boolean
    needsMultiLanguage?: boolean
  }
): PackageValidation => {
  const config = PACKAGE_CONFIGS[selectedPackage]
  const errors: string[] = []
  const warnings: string[] = []
  let recommendedPackage: PackageType | undefined

  // Check pagina limiet
  if (selectedPages.length > config.limits.maxPages) {
    errors.push(`Je hebt ${selectedPages.length} pagina's geselecteerd, maar het ${config.name} pakket ondersteunt maximaal ${config.limits.maxPages} pagina's.`)
    recommendedPackage = getRecommendedPackage(
      selectedPages.length, 
      options.needsBlog || false, 
      options.needsBooking || false, 
      options.needsWebshop || false
    )
  }

  // Check blog
  if (options.needsBlog && !config.limits.hasBlog) {
    errors.push(`Blog functionaliteit is niet inbegrepen in het ${config.name} pakket.`)
    if (!recommendedPackage) recommendedPackage = 'professional'
  }

  // Check booking
  if (options.needsBooking && !config.limits.hasBookingSystem) {
    errors.push(`Een boekingssysteem is niet inbegrepen in het ${config.name} pakket.`)
    if (!recommendedPackage) recommendedPackage = 'business'
  }

  // Check webshop
  if (options.needsWebshop && !config.limits.hasWebshop) {
    errors.push(`Webshop functionaliteit vereist het Webshop pakket.`)
    recommendedPackage = 'webshop'
  }

  // Check multi-language
  if (options.needsMultiLanguage && !config.limits.hasMultiLanguage) {
    warnings.push(`Meertaligheid is alleen beschikbaar in het Business pakket.`)
    if (!recommendedPackage) recommendedPackage = 'business'
  }

  // Warnings voor bijna vol
  const pagesLeft = config.limits.maxPages - selectedPages.length
  if (pagesLeft <= 1 && pagesLeft >= 0) {
    warnings.push(`Je zit bijna aan de paginalimiet (${selectedPages.length}/${config.limits.maxPages}).`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendedPackage: errors.length > 0 ? recommendedPackage : undefined
  }
}

/**
 * Standaard pagina opties met beschrijvingen
 */
export interface PageOption {
  id: string
  label: string
  description: string
  recommended: boolean
  requiresFeature?: keyof PackageLimits
}

export const PAGE_OPTIONS: PageOption[] = [
  { id: 'home', label: 'Homepage', description: 'De landingspagina van je website', recommended: true },
  { id: 'about', label: 'Over ons', description: 'Vertel je verhaal en wie je bent', recommended: true },
  { id: 'services', label: 'Diensten', description: 'Overzicht van je diensten/aanbod', recommended: true },
  { id: 'contact', label: 'Contact', description: 'Contactformulier en gegevens', recommended: true },
  { id: 'portfolio', label: 'Portfolio/Projecten', description: 'Showcase van je werk', recommended: false },
  { id: 'team', label: 'Team', description: 'Stel je teamleden voor', recommended: false },
  { id: 'pricing', label: 'Prijzen', description: 'Prijsoverzicht van je diensten', recommended: false },
  { id: 'faq', label: 'FAQ', description: 'Veelgestelde vragen', recommended: false },
  { id: 'blog', label: 'Blog', description: 'Artikelen en nieuws', recommended: false, requiresFeature: 'hasBlog' },
  { id: 'testimonials', label: 'Reviews/Testimonials', description: 'Klantervaringen', recommended: false },
  { id: 'gallery', label: 'Galerij', description: 'Foto galerij', recommended: false },
  { id: 'booking', label: 'Afspraken/Boeken', description: 'Online boekingssysteem', recommended: false, requiresFeature: 'hasBookingSystem' },
  { id: 'locations', label: 'Locaties', description: 'Meerdere vestigingen', recommended: false },
  { id: 'careers', label: 'Vacatures', description: 'Werken bij pagina', recommended: false },
]

/**
 * Branche opties met aanbevolen pagina's
 */
export interface IndustryOption {
  id: string
  label: string
  icon: string
  suggestedPages: string[]
  suggestedFeatures: string[]
}

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { 
    id: 'consulting', 
    label: 'Advies & Consultancy',
    icon: 'Briefcase',
    suggestedPages: ['home', 'about', 'services', 'contact', 'testimonials'],
    suggestedFeatures: []
  },
  { 
    id: 'healthcare', 
    label: 'Zorg & Welzijn',
    icon: 'Heart',
    suggestedPages: ['home', 'about', 'services', 'team', 'contact'],
    suggestedFeatures: ['booking']
  },
  { 
    id: 'creative', 
    label: 'Creatief & Design',
    icon: 'Palette',
    suggestedPages: ['home', 'about', 'portfolio', 'services', 'contact'],
    suggestedFeatures: []
  },
  { 
    id: 'retail', 
    label: 'Retail & E-commerce',
    icon: 'ShoppingBag',
    suggestedPages: ['home', 'about', 'contact', 'faq'],
    suggestedFeatures: ['webshop']
  },
  { 
    id: 'food', 
    label: 'Horeca & Food',
    icon: 'Utensils',
    suggestedPages: ['home', 'about', 'gallery', 'contact'],
    suggestedFeatures: ['booking']
  },
  { 
    id: 'construction', 
    label: 'Bouw & Techniek',
    icon: 'Wrench',
    suggestedPages: ['home', 'about', 'services', 'portfolio', 'contact'],
    suggestedFeatures: []
  },
  { 
    id: 'education', 
    label: 'Educatie & Training',
    icon: 'GraduationCap',
    suggestedPages: ['home', 'about', 'services', 'team', 'contact'],
    suggestedFeatures: ['booking']
  },
  { 
    id: 'fitness', 
    label: 'Sport & Fitness',
    icon: 'Dumbbell',
    suggestedPages: ['home', 'about', 'services', 'team', 'pricing', 'contact'],
    suggestedFeatures: ['booking']
  },
  { 
    id: 'realestate', 
    label: 'Vastgoed',
    icon: 'Home',
    suggestedPages: ['home', 'about', 'services', 'portfolio', 'contact'],
    suggestedFeatures: []
  },
  { 
    id: 'legal', 
    label: 'Juridisch & Financieel',
    icon: 'Scale',
    suggestedPages: ['home', 'about', 'services', 'team', 'contact'],
    suggestedFeatures: []
  },
  { 
    id: 'beauty', 
    label: 'Beauty & Wellness',
    icon: 'Sparkles',
    suggestedPages: ['home', 'about', 'services', 'pricing', 'gallery', 'contact'],
    suggestedFeatures: ['booking']
  },
  { 
    id: 'other', 
    label: 'Anders',
    icon: 'Globe',
    suggestedPages: ['home', 'about', 'services', 'contact'],
    suggestedFeatures: []
  }
]

/**
 * Stijl opties voor design voorkeuren
 */
export interface StyleOption {
  id: string
  label: string
  description: string
  colors: string[]
}

export const STYLE_OPTIONS: StyleOption[] = [
  { id: 'modern', label: 'Modern & Strak', description: 'Clean lijnen, veel witruimte', colors: ['#3B82F6', '#1F2937'] },
  { id: 'classic', label: 'Klassiek & Tijdloos', description: 'Traditioneel en betrouwbaar', colors: ['#1E3A5F', '#D4AF37'] },
  { id: 'playful', label: 'Speels & Creatief', description: 'Kleurrijk en dynamisch', colors: ['#EC4899', '#8B5CF6'] },
  { id: 'minimal', label: 'Minimalistisch', description: 'Zo eenvoudig mogelijk', colors: ['#111827', '#F9FAFB'] },
  { id: 'bold', label: 'Gedurfd & Opvallend', description: 'Grote statements, contrast', colors: ['#DC2626', '#FBBF24'] },
  { id: 'natural', label: 'Natuurlijk & Organisch', description: 'Zachte kleuren, ronde vormen', colors: ['#059669', '#D1FAE5'] }
]

/**
 * Kleur opties
 */
export interface ColorOption {
  id: string
  label: string
  hex: string
  description: string
}

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'blue', label: 'Blauw', hex: '#3B82F6', description: 'Vertrouwen, professionaliteit' },
  { id: 'green', label: 'Groen', hex: '#22C55E', description: 'Natuur, groei, gezondheid' },
  { id: 'red', label: 'Rood', hex: '#EF4444', description: 'Energie, passie' },
  { id: 'orange', label: 'Oranje', hex: '#F97316', description: 'Vriendelijk, energiek' },
  { id: 'purple', label: 'Paars', hex: '#8B5CF6', description: 'Creativiteit, luxe' },
  { id: 'teal', label: 'Teal', hex: '#14B8A6', description: 'Modern, fris' },
  { id: 'pink', label: 'Roze', hex: '#EC4899', description: 'Speels, vrouwelijk' },
  { id: 'black', label: 'Zwart', hex: '#1F2937', description: 'Elegant, premium' },
  { id: 'custom', label: 'Eigen kleur', hex: '#6366F1', description: 'Kies je eigen kleur' }
]

/**
 * Interface voor intake data die wordt doorgegeven aan onboarding
 */
export interface IntakeData {
  // Bedrijfsgegevens
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  industry: string
  
  // Website configuratie
  selectedPackage: PackageType
  selectedPages: string[]
  websiteType: string
  
  // Feature wensen
  needsBlog: boolean
  needsBooking: boolean
  needsWebshop: boolean
  needsMultiLanguage: boolean
  
  // Design voorkeuren
  websiteGoal: string
  targetAudience: string
  competitors: string
  colorPreference: string
  customColors: string[]
  stylePreference: string
  inspirationUrls: string[]
  
  // Branding
  hasLogo: boolean
  logoDescription: string
  
  // Content
  hasContent: boolean
  contentNotes: string
  hasPhotos: boolean
  photoNotes: string
  
  // Domein
  domainOption: 'new' | 'existing' | 'help'
  domainName: string
  
  // Planning
  desiredLaunchDate: string
  additionalNotes: string
}

/**
 * Map intake vragen naar onboarding velden
 * Dit zorgt ervoor dat ingevulde vragen niet opnieuw hoeven worden beantwoord
 */
export const INTAKE_TO_ONBOARDING_MAP: Record<string, string> = {
  'businessName': 'businessName',
  'contactName': 'contactName',
  'contactEmail': 'contactEmail',
  'contactPhone': 'contactPhone',
  'industry': 'industry',
  'websiteGoal': 'aboutText', // Doel website -> Over tekst basis
  'targetAudience': 'targetAudience',
  'competitors': 'competitors',
  'colorPreference': 'brandColors',
  'stylePreference': 'designStyle',
  'hasLogo': 'hasLogo',
  'logoDescription': 'logoDescription',
  'hasContent': 'hasContent',
  'contentNotes': 'contentNotes',
  'hasPhotos': 'hasPhotos',
  'photoNotes': 'photos',
  'inspirationUrls': 'exampleSites',
  'additionalNotes': 'extraWishes'
}
