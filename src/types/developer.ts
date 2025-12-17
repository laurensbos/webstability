// ===========================================
// DEVELOPER DASHBOARD - TYPES & CONFIGURATIE
// ===========================================

// Pakket configuratie met developer workflows
export interface PackageConfig {
  id: string
  name: string
  priceMonthly: number // incl BTW
  priceSetup: number // incl BTW
  maxPages: number | 'unlimited'
  maxProducts?: number
  revisionsIncluded: number // Aantal revisierondes
  monthlyChanges: number // Wijzigingen per maand
  supportResponseTime: '48u' | '24u' | '4u' | '1u'
  features: string[]
  developerTasks: DeveloperTask[]
  clientPermissions: ClientPermission[]
}

export interface DeveloperTask {
  id: string
  phase: ProjectPhase
  title: string
  description: string
  estimatedHours?: number
  required: boolean
}

export interface ClientPermission {
  id: string
  label: string
  description: string
  enabled: boolean
}

export type ProjectPhase = 'onboarding' | 'design' | 'development' | 'review' | 'live'
export type ProjectStatus = 'active' | 'paused' | 'cancelled' | 'completed'
export type ChangeRequestPriority = 'low' | 'normal' | 'urgent'
export type ChangeRequestStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'rejected'

// Project met uitgebreide developer velden
export interface DeveloperProject {
  // Basis
  projectId: string
  businessName: string
  package: string
  createdAt: string
  
  // Contact
  contactName: string
  contactEmail: string
  contactPhone: string
  
  // Status
  phase: ProjectPhase
  status: ProjectStatus
  statusMessage: string
  
  // Tijdlijn
  estimatedCompletion: string
  phaseDeadlines: Record<ProjectPhase, string>
  
  // Developer tracking
  currentTask?: string
  hoursSpent: number
  hoursEstimate: number
  
  // Revisies per pakket
  revisionsUsed: number
  revisionsTotal: number
  
  // Content & Assets
  onboardingComplete: boolean
  onboardingData?: OnboardingData
  onboardingChecklist?: OnboardingChecklist
  contentReceived: boolean
  assetsReceived: boolean
  googleDriveUrl?: string
  
  // Design
  designDrafts: DesignDraft[]
  selectedDesign?: string
  designApproved: boolean
  designApprovedAt?: string
  
  // Development
  stagingUrl?: string
  liveUrl?: string
  techStack?: string[]
  
  // Review & Feedback
  feedbackRounds: FeedbackRound[]
  
  // Communicatie
  messages: ProjectMessage[]
  changeRequests: ChangeRequest[]
  
  // Updates (client visible)
  updates: ProjectUpdate[]
  
  // Notities (developer only)
  internalNotes: string
  
  // Betaling - website gaat pas live na betaling!
  paymentStatus: 'pending' | 'awaiting_payment' | 'paid' | 'overdue' | 'failed'
  paymentUrl?: string           // Mollie checkout URL als in awaiting_payment
  paymentCompletedAt?: string   // Wanneer eerste betaling voltooid
  lastPaymentDate?: string
  nextBillingDate?: string
  
  // Kortingscode
  discountCode?: string         // Gebruikte kortingscode
  discountSavings?: number      // Bedrag bespaard met korting
  
  // Post-launch
  monthlyChangesUsed: number
  monthlyChangesLimit: number // Gebaseerd op pakket
  lastMonthlyReset?: string
}

export interface OnboardingData {
  submittedAt: string
  aboutText: string
  services: string
  uniqueSellingPoints: string
  hasLogo: boolean
  logoDescription?: string
  logoFiles?: string[]
  brandColors: string[]
  brandFonts: string
  photos: string[]
  socialMedia: Record<string, string>
  competitors: string[]
  extraWishes: string
  // Webshop-specific design fields
  webshopStyle?: string
  webshopColors?: string[]
  webshopCustomColor?: string
  webshopExampleSites?: string
  webshopBrandAssets?: string
}

// Onboarding Checklist data (from KlantOnboarding page)
export interface OnboardingChecklist {
  projectId: string
  submittedAt: string
  businessName?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  aboutText?: string
  services?: string
  uniqueSellingPoints?: string
  hasLogo?: string
  logoDescription?: string
  brandColors?: string
  brandFonts?: string
  photos?: string
  socialMedia?: string
  competitors?: string
  extraWishes?: string
}

export interface DesignDraft {
  id: string
  version: number
  imageUrl: string
  createdAt: string
  notes?: string
  clientFeedback?: string
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested'
}

export interface FeedbackRound {
  id: string
  round: number
  createdAt: string
  status: 'pending' | 'received' | 'implemented'
  previewUrl: string
  feedbackItems: FeedbackItem[]
}

export interface FeedbackItem {
  id: string
  page: string
  description: string
  screenshot?: string
  status: 'pending' | 'in_progress' | 'done'
  developerResponse?: string
}

export interface ProjectMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
  attachments?: string[]
}

export interface ChangeRequest {
  id: string
  date: string
  request: string
  priority: ChangeRequestPriority
  status: ChangeRequestStatus
  category: 'content' | 'design' | 'feature' | 'bug' | 'other'
  estimatedHours?: number
  isMonthlyChange: boolean // Telt mee voor maandelijks limiet?
  response?: string
  completedAt?: string
}

export interface ProjectUpdate {
  id: string
  date: string
  title: string
  message: string
  phase?: ProjectPhase
  isPublic: boolean // Zichtbaar voor klant?
}

// ===========================================
// PAKKET CONFIGURATIES
// ===========================================

export const PACKAGE_CONFIGS: Record<string, PackageConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 96,
    priceSetup: 181,
    maxPages: 5,
    revisionsIncluded: 2,
    monthlyChanges: 1,
    supportResponseTime: '48u',
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Contactformulier',
      'Google Maps',
      'Basis SEO',
    ],
    developerTasks: [
      { id: 'onboarding', phase: 'onboarding', title: 'Onboarding intake', description: 'Content en materialen verzamelen', required: true },
      { id: 'design-home', phase: 'design', title: 'Homepage design', description: 'Ontwerp homepage in Figma/XD', estimatedHours: 3, required: true },
      { id: 'design-pages', phase: 'design', title: 'Subpagina template', description: 'Basis template voor overige pagina\'s', estimatedHours: 2, required: true },
      { id: 'dev-setup', phase: 'development', title: 'Project setup', description: 'Domein, hosting, basis structuur', estimatedHours: 1, required: true },
      { id: 'dev-build', phase: 'development', title: 'Website bouwen', description: 'Implementatie design', estimatedHours: 6, required: true },
      { id: 'dev-forms', phase: 'development', title: 'Formulieren', description: 'Contactformulier implementeren', estimatedHours: 1, required: true },
      { id: 'dev-seo', phase: 'development', title: 'Basis SEO', description: 'Meta tags, sitemap, robots.txt', estimatedHours: 1, required: true },
      { id: 'review', phase: 'review', title: 'Review ronde', description: 'Feedback verwerken (2 rondes)', estimatedHours: 2, required: true },
      { id: 'launch', phase: 'live', title: 'Livegang', description: 'DNS, SSL, final checks', estimatedHours: 1, required: true },
    ],
    clientPermissions: [
      { id: 'view_progress', label: 'Voortgang bekijken', description: 'Realtime status updates', enabled: true },
      { id: 'submit_feedback', label: 'Feedback geven', description: 'Via project portal', enabled: true },
      { id: 'request_changes', label: 'Wijzigingen aanvragen', description: 'Content updates (2x/maand)', enabled: true },
      { id: 'view_staging', label: 'Preview bekijken', description: 'Staging website', enabled: true },
    ],
  },
  professional: {
    id: 'professional',
    name: 'Professioneel',
    priceMonthly: 180,
    priceSetup: 241,
    maxPages: 10,
    revisionsIncluded: 3,
    monthlyChanges: 3,
    supportResponseTime: '24u',
    features: [
      'Tot 10 pagina\'s',
      'Blog functionaliteit',
      'Social media integratie',
      'Google Analytics',
      'Uitgebreide SEO',
    ],
    developerTasks: [
      { id: 'onboarding', phase: 'onboarding', title: 'Uitgebreide intake', description: 'Content, branding, doelen bespreken', estimatedHours: 1, required: true },
      { id: 'design-moodboard', phase: 'design', title: 'Moodboard', description: 'Visuele richting bepalen', estimatedHours: 1, required: true },
      { id: 'design-home', phase: 'design', title: 'Homepage design', description: 'Premium homepage design', estimatedHours: 4, required: true },
      { id: 'design-pages', phase: 'design', title: 'Pagina templates', description: 'Meerdere templates voor variatie', estimatedHours: 4, required: true },
      { id: 'dev-setup', phase: 'development', title: 'Project setup', description: 'Domein, hosting, CMS', estimatedHours: 2, required: true },
      { id: 'dev-build', phase: 'development', title: 'Website bouwen', description: 'Volledige implementatie', estimatedHours: 10, required: true },
      { id: 'dev-blog', phase: 'development', title: 'Blog systeem', description: 'Blog met categorieën', estimatedHours: 3, required: true },
      { id: 'dev-analytics', phase: 'development', title: 'Analytics setup', description: 'GA4 + Search Console', estimatedHours: 1, required: true },
      { id: 'dev-seo', phase: 'development', title: 'SEO optimalisatie', description: 'Schema markup, performance', estimatedHours: 2, required: true },
      { id: 'review', phase: 'review', title: 'Review rondes', description: 'Feedback verwerken (3 rondes)', estimatedHours: 4, required: true },
      { id: 'launch', phase: 'live', title: 'Livegang', description: 'DNS, SSL, redirects, checks', estimatedHours: 2, required: true },
    ],
    clientPermissions: [
      { id: 'view_progress', label: 'Voortgang bekijken', description: 'Realtime status updates', enabled: true },
      { id: 'submit_feedback', label: 'Feedback geven', description: 'Via project portal', enabled: true },
      { id: 'request_changes', label: 'Wijzigingen aanvragen', description: 'Content updates (4x/maand)', enabled: true },
      { id: 'view_staging', label: 'Preview bekijken', description: 'Staging website', enabled: true },
      { id: 'view_analytics', label: 'Analytics bekijken', description: 'Bezoekersstatistieken', enabled: true },
      { id: 'manage_blog', label: 'Blog beheren', description: 'Eigen posts schrijven', enabled: true },
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    priceMonthly: 301,
    priceSetup: 362,
    maxPages: 20,
    revisionsIncluded: 5,
    monthlyChanges: 5,
    supportResponseTime: '4u',
    features: [
      'Tot 20 pagina\'s',
      'Online boekingssysteem',
      'Nieuwsbrief integratie',
      'Meerdere talen',
      'Priority support',
    ],
    developerTasks: [
      { id: 'kickoff', phase: 'onboarding', title: 'Kickoff call', description: 'Video call voor requirements', estimatedHours: 1, required: true },
      { id: 'onboarding', phase: 'onboarding', title: 'Content strategie', description: 'Content plan en structuur', estimatedHours: 2, required: true },
      { id: 'design-strategy', phase: 'design', title: 'Design strategie', description: 'UX research en wireframes', estimatedHours: 3, required: true },
      { id: 'design-system', phase: 'design', title: 'Design systeem', description: 'Components en stijlgids', estimatedHours: 4, required: true },
      { id: 'design-pages', phase: 'design', title: 'Alle pagina designs', description: 'Complete website designs', estimatedHours: 8, required: true },
      { id: 'dev-setup', phase: 'development', title: 'Geavanceerde setup', description: 'CI/CD, staging, productie', estimatedHours: 3, required: true },
      { id: 'dev-build', phase: 'development', title: 'Website bouwen', description: 'Volledige implementatie', estimatedHours: 16, required: true },
      { id: 'dev-booking', phase: 'development', title: 'Boekingssysteem', description: 'Online reserveringen', estimatedHours: 6, required: true },
      { id: 'dev-newsletter', phase: 'development', title: 'Nieuwsbrief', description: 'Mailchimp/ConvertKit integratie', estimatedHours: 2, required: true },
      { id: 'dev-i18n', phase: 'development', title: 'Meertaligheid', description: 'Taalswitch implementeren', estimatedHours: 4, required: true },
      { id: 'review', phase: 'review', title: 'Review rondes', description: 'Uitgebreide feedback (5 rondes)', estimatedHours: 6, required: true },
      { id: 'launch', phase: 'live', title: 'Premium livegang', description: 'Uitgebreide QA en launch', estimatedHours: 3, required: true },
    ],
    clientPermissions: [
      { id: 'view_progress', label: 'Voortgang bekijken', description: 'Realtime status updates', enabled: true },
      { id: 'submit_feedback', label: 'Feedback geven', description: 'Via project portal', enabled: true },
      { id: 'request_changes', label: 'Wijzigingen aanvragen', description: 'Content updates (8x/maand)', enabled: true },
      { id: 'view_staging', label: 'Preview bekijken', description: 'Staging website', enabled: true },
      { id: 'view_analytics', label: 'Analytics bekijken', description: 'Uitgebreide statistieken', enabled: true },
      { id: 'manage_blog', label: 'Blog beheren', description: 'Volledige blog controle', enabled: true },
      { id: 'manage_bookings', label: 'Boekingen beheren', description: 'Agenda en afspraken', enabled: true },
      { id: 'priority_support', label: 'Priority support', description: '4 uur response tijd', enabled: true },
    ],
  },
  webshop: {
    id: 'webshop',
    name: 'Webshop',
    priceMonthly: 422,
    priceSetup: 362,
    maxPages: 'unlimited',
    maxProducts: 500,
    revisionsIncluded: 5,
    monthlyChanges: 5,
    supportResponseTime: '4u',
    features: [
      'Onbeperkt pagina\'s',
      'Tot 500 producten',
      'Betaalsysteem (iDEAL, etc.)',
      'Voorraadbeheer',
      'Verzendintegraties',
    ],
    developerTasks: [
      { id: 'kickoff', phase: 'onboarding', title: 'E-commerce intake', description: 'Producten, verzending, betalingen', estimatedHours: 2, required: true },
      { id: 'onboarding', phase: 'onboarding', title: 'Product setup', description: 'Product data structuur', estimatedHours: 2, required: true },
      { id: 'design-shop', phase: 'design', title: 'Shop design', description: 'Homepage, categorie, product', estimatedHours: 6, required: true },
      { id: 'design-checkout', phase: 'design', title: 'Checkout flow', description: 'Cart, checkout, bevestiging', estimatedHours: 4, required: true },
      { id: 'dev-setup', phase: 'development', title: 'E-commerce setup', description: 'Shopify/WooCommerce/Custom', estimatedHours: 4, required: true },
      { id: 'dev-build', phase: 'development', title: 'Shop bouwen', description: 'Volledige webshop', estimatedHours: 20, required: true },
      { id: 'dev-payments', phase: 'development', title: 'Betalingen', description: 'Mollie, Stripe integratie', estimatedHours: 4, required: true },
      { id: 'dev-shipping', phase: 'development', title: 'Verzending', description: 'PostNL, DHL integratie', estimatedHours: 4, required: true },
      { id: 'dev-products', phase: 'development', title: 'Producten importeren', description: 'Tot 500 producten', estimatedHours: 4, required: true },
      { id: 'dev-email', phase: 'development', title: 'Email templates', description: 'Order confirmatie, verzending', estimatedHours: 3, required: true },
      { id: 'review', phase: 'review', title: 'Shop testen', description: 'Test orders, volledige flow', estimatedHours: 4, required: true },
      { id: 'launch', phase: 'live', title: 'Shop livegang', description: 'Betalingen activeren, launch', estimatedHours: 3, required: true },
    ],
    clientPermissions: [
      { id: 'view_progress', label: 'Voortgang bekijken', description: 'Realtime status updates', enabled: true },
      { id: 'submit_feedback', label: 'Feedback geven', description: 'Via project portal', enabled: true },
      { id: 'request_changes', label: 'Wijzigingen aanvragen', description: 'Updates (8x/maand)', enabled: true },
      { id: 'view_staging', label: 'Preview bekijken', description: 'Test shop', enabled: true },
      { id: 'view_analytics', label: 'Sales analytics', description: 'Omzet en orders', enabled: true },
      { id: 'manage_products', label: 'Producten beheren', description: 'Toevoegen/wijzigen', enabled: true },
      { id: 'manage_orders', label: 'Orders beheren', description: 'Bestellingen afhandelen', enabled: true },
      { id: 'manage_stock', label: 'Voorraad beheren', description: 'Stock levels', enabled: true },
      { id: 'priority_support', label: 'Priority support', description: '4 uur response tijd', enabled: true },
    ],
  },
}

// Maandelijkse wijzigingen limiet per pakket
export const MONTHLY_CHANGES_LIMIT: Record<string, number> = {
  starter: 2,
  professional: 4,
  business: 8,
  webshop: 8,
}

// Phase configuratie
export const PHASE_CONFIG: Record<ProjectPhase, { label: string; color: string; icon: string; description: string }> = {
  onboarding: {
    label: 'Onboarding',
    color: 'blue',
    icon: 'FileText',
    description: 'Content en materialen verzamelen',
  },
  design: {
    label: 'Design',
    color: 'amber',
    icon: 'Palette',
    description: 'Visueel ontwerp maken',
  },
  development: {
    label: 'Development',
    color: 'purple',
    icon: 'Code',
    description: 'Website bouwen',
  },
  review: {
    label: 'Review',
    color: 'cyan',
    icon: 'MessageSquare',
    description: 'Feedback verwerken',
  },
  live: {
    label: 'Live',
    color: 'green',
    icon: 'Rocket',
    description: 'Website is online',
  },
}
