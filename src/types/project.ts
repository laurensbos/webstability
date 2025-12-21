/**
 * Project status types voor het klantportaal
 */

export type ProjectPhase = 'onboarding' | 'design' | 'design_approved' | 'development' | 'review' | 'live'

export type PackageType = 'starter' | 'professional' | 'premium' | 'webshop'

export interface ProjectUpdate {
  id?: string
  date: string
  title: string
  message: string
  phase?: ProjectPhase
}

export interface ProjectMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
}

export interface ChangeRequest {
  id?: string
  date?: string
  description: string
  request?: string              // Legacy field, use description instead
  priority: 'low' | 'normal' | 'urgent'
  category: 'text' | 'design' | 'functionality' | 'other'
  status?: 'pending' | 'in_progress' | 'completed'
  response?: string
  createdAt?: string
  attachments?: string[]
}

export interface FeedbackItem {
  id: string
  date: string
  page: string
  category: 'text' | 'design' | 'functionality'
  description: string
  screenshot?: string
  status: 'pending' | 'in_progress' | 'completed'
}

// ===========================================
// LOGO PROJECT TYPES
// ===========================================

export type LogoPhase = 'onboarding' | 'concepts' | 'revision' | 'final' | 'delivered'

export interface LogoConcept {
  id: string
  name: string                    // "Concept A", "Concept B", etc.
  description?: string            // Designer's notes about this concept
  previewUrl: string              // Image URL for preview
  createdAt: string
  isSelected?: boolean            // Client selected this one
  selectedAt?: string
}

export interface LogoRevision {
  id: string
  round: number                   // 1, 2, 3
  conceptId: string               // Which concept this revision is for
  feedback: string                // Client feedback
  feedbackAt: string
  revisedPreviewUrl?: string      // Updated preview after revision
  revisedAt?: string
  status: 'pending' | 'in_progress' | 'completed'
}

export interface LogoDeliverable {
  id: string
  name: string                    // "Logo Primary", "Logo Icon", etc.
  format: string                  // "PNG", "SVG", "PDF", etc.
  downloadUrl: string
  size?: string                   // "1024x1024", "Vector", etc.
  variant?: 'primary' | 'secondary' | 'icon' | 'dark' | 'light' | 'monochrome'
}

export interface LogoProject {
  // Phase tracking
  logoPhase: LogoPhase
  
  // Concepts phase
  concepts?: LogoConcept[]
  selectedConceptId?: string
  conceptSelectedAt?: string
  
  // Revision tracking
  revisions?: LogoRevision[]
  currentRevisionRound?: number
  maxRevisionRounds: number       // Based on package: 2, 3, or 5
  
  // Final deliverables
  deliverables?: LogoDeliverable[]
  finalApproved?: boolean
  finalApprovedAt?: string
  
  // Downloads
  downloadedAt?: string
  allFilesDownloaded?: boolean
}

export interface ProjectTask {
  id: string
  title: string
  description?: string
  phase: ProjectPhase
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  dueDate?: string
  completedAt?: string
  assignedTo?: 'client' | 'developer'
  priority?: 'low' | 'normal' | 'high'
}

export type PaymentStatus = 'not_required' | 'pending' | 'awaiting_payment' | 'paid' | 'failed'

export interface Invoice {
  id: string
  date: string
  dueDate?: string
  description: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  paidAt?: string
  paymentUrl?: string
}

export type ServiceType = 'website' | 'webshop' | 'logo' | 'drone'

export interface Project {
  projectId: string
  businessName: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  serviceType?: ServiceType        // Type dienst: website, webshop, logo, drone
  package: PackageType | string
  status: ProjectPhase
  statusMessage: string
  estimatedCompletion?: string
  updates: ProjectUpdate[]
  createdAt: string
  designPreviewUrl?: string
  liveUrl?: string
  // Betaalstatus - website gaat pas live na betaling
  paymentStatus?: PaymentStatus
  paymentUrl?: string           // Mollie checkout URL
  paymentCompletedAt?: string   // Wanneer betaald
  designApprovedAt?: string     // Wanneer design goedgekeurd
  // Nieuwe velden voor communicatie
  messages?: ProjectMessage[]
  changeRequests?: ChangeRequest[]
  feedback?: FeedbackItem[]
  tasks?: ProjectTask[]
  invoices?: Invoice[]
  revisionsUsed?: number
  revisionsTotal?: number
  googleDriveUrl?: string
  // Live datum - wanneer website live ging
  liveDate?: string
  // Geschatte deadlines per fase
  phaseDeadlines?: {
    onboarding?: string
    design?: string
    development?: string
    review?: string
    live?: string
  }
  // Referral systeem
  referralCode?: string          // Unieke code voor deze klant
  referredBy?: string            // Referral code van andere klant
  referralDiscount?: number      // Korting in € door referral
  referralsCount?: number        // Aantal doorverwijzingen
  referralRewards?: number       // Verdiende beloningen in €
  // Review goedkeuring
  reviewApproved?: boolean       // Is review goedgekeurd
  reviewApprovedAt?: string      // Wanneer goedgekeurd
  // Change requests tracking
  changesThisMonth?: number      // Aantal aanpassingen deze maand
  changesResetAt?: string        // Wanneer teller reset
  // Review status
  reviewRequested?: boolean      // Is review gevraagd?
  reviewRequestedAt?: string     // Wanneer gevraagd
  trustpilotReviewUrl?: string   // Link naar Trustpilot review
  // Intake data van StartProject - wordt hergebruikt in onboarding
  intakeData?: {
    industry?: string
    websiteType?: string
    selectedPages?: string[]
    needsBlog?: boolean
    needsBooking?: boolean
    needsWebshop?: boolean
    needsMultiLanguage?: boolean
    websiteGoal?: string
    targetAudience?: string
    competitors?: string
    colorPreference?: string
    customColors?: string[]
    stylePreference?: string
    inspirationUrls?: string[]
    hasLogo?: boolean
    logoDescription?: string
    hasContent?: boolean
    contentNotes?: string
    hasPhotos?: boolean
    photoNotes?: string
    domainOption?: string
    domainName?: string
    desiredLaunchDate?: string
    additionalNotes?: string
  }
}

export interface ProjectStep {
  key: ProjectPhase
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Fase configuratie voor het admin dashboard
 * Bevat checklist items en standaard berichten per fase
 */
export interface PhaseConfig {
  key: ProjectPhase
  label: string
  color: string
  bgColor: string
  borderColor: string
  description: string
  customerMessage: string
  checklist: {
    label: string
    forCustomer: boolean // true = klant moet dit doen, false = developer
  }[]
  nextPhaseAction?: string
}

export const PHASE_CONFIGS: PhaseConfig[] = [
  {
    key: 'onboarding',
    label: 'Onboarding',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    description: 'We verzamelen materialen van de klant',
    customerMessage: 'We hebben je aanvraag ontvangen! Vul de onboarding checklist in zodat we kunnen starten.',
    checklist: [
      { label: 'Onboarding link verstuurd', forCustomer: false },
      { label: 'Logo ontvangen', forCustomer: true },
      { label: 'Teksten/content ontvangen', forCustomer: true },
      { label: 'Foto\'s ontvangen', forCustomer: true },
      { label: 'Huisstijl informatie ontvangen', forCustomer: true },
    ],
    nextPhaseAction: 'Start met design →'
  },
  {
    key: 'design',
    label: 'Design',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    description: 'We maken het ontwerp',
    customerMessage: 'Onboarding ontvangen! We gaan aan de slag met het ontwerp.',
    checklist: [
      { label: 'Wireframes gemaakt', forCustomer: false },
      { label: 'Design mockup gemaakt', forCustomer: false },
      { label: 'Design preview link ingesteld', forCustomer: false },
      { label: 'Design preview naar klant gestuurd', forCustomer: false },
    ],
    nextPhaseAction: 'Design goedkeuren →'
  },
  {
    key: 'design_approved',
    label: 'Goedgekeurd',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    description: 'Design goedgekeurd, wacht op betaling',
    customerMessage: 'Je hebt het design goedgekeurd! Na betaling starten we met de bouw van je website.',
    checklist: [
      { label: 'Design definitief goedgekeurd', forCustomer: true },
      { label: 'Betaallink verstuurd', forCustomer: false },
      { label: 'Betaling ontvangen', forCustomer: true },
    ],
    nextPhaseAction: 'Start development →'
  },
  {
    key: 'development',
    label: 'Development',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    description: 'We bouwen de website',
    customerMessage: 'Design is goedgekeurd! We zijn nu je website aan het bouwen.',
    checklist: [
      { label: 'Homepage gebouwd', forCustomer: false },
      { label: 'Overige pagina\'s gebouwd', forCustomer: false },
      { label: 'Formulieren werkend', forCustomer: false },
      { label: 'Responsive check gedaan', forCustomer: false },
      { label: 'SEO basis ingesteld', forCustomer: false },
    ],
    nextPhaseAction: 'Klaar voor review →'
  },
  {
    key: 'review',
    label: 'Review',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    description: 'Klant bekijkt en geeft feedback',
    customerMessage: 'Je website is klaar voor review! Bekijk de preview en geef je feedback.',
    checklist: [
      { label: 'Preview link naar klant gestuurd', forCustomer: false },
      { label: 'Klant heeft gereviewd', forCustomer: true },
      { label: 'Feedback verwerkt', forCustomer: false },
      { label: 'Finale goedkeuring ontvangen', forCustomer: true },
    ],
    nextPhaseAction: 'Zet live! 🚀'
  },
  {
    key: 'live',
    label: 'Live',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    description: 'Website is online!',
    customerMessage: 'Gefeliciteerd! Je website is live! 🎉',
    checklist: [
      { label: 'Domein gekoppeld', forCustomer: false },
      { label: 'SSL certificaat actief', forCustomer: false },
      { label: 'Google Analytics ingesteld', forCustomer: false },
      { label: 'Welkomstmail verstuurd', forCustomer: false },
    ],
  }
]

/**
 * Haal fase configuratie op
 */
export const getPhaseConfig = (phase: ProjectPhase): PhaseConfig => {
  return PHASE_CONFIGS.find(p => p.key === phase) || PHASE_CONFIGS[0]
}

/**
 * Haal volgende fase op
 */
export const getNextPhase = (currentPhase: ProjectPhase): ProjectPhase | null => {
  const phases: ProjectPhase[] = ['onboarding', 'design', 'development', 'review', 'live']
  const currentIndex = phases.indexOf(currentPhase)
  if (currentIndex < phases.length - 1) {
    return phases[currentIndex + 1]
  }
  return null
}

/**
 * Bereken voortgangspercentage op basis van projectfase
 */
export const getProgressPercentage = (status: ProjectPhase): number => {
  const percentages: Record<ProjectPhase, number> = {
    onboarding: 15,
    design: 35,
    design_approved: 50,
    development: 70,
    review: 85,
    live: 100
  }
  return percentages[status] ?? 0
}

/**
 * Groepeer updates per datum
 */
export const groupUpdatesByDate = (updates: ProjectUpdate[]): Map<string, ProjectUpdate[]> => {
  const grouped = new Map<string, ProjectUpdate[]>()
  
  // Sorteer updates op datum (nieuwste eerst)
  const sorted = [...updates].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  sorted.forEach(update => {
    const existing = grouped.get(update.date) || []
    grouped.set(update.date, [...existing, update])
  })
  
  return grouped
}

/**
 * Format datum naar Nederlandse notatie
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * FAQ items per fase - wordt getoond aan klant
 */
export interface PhaseFAQ {
  question: string
  answer: string
}

export const PHASE_FAQS: Record<ProjectPhase, PhaseFAQ[]> = {
  onboarding: [
    { question: 'Wat moet ik aanleveren?', answer: 'Je logo (liefst in hoge kwaliteit/vector), teksten voor de website, foto\'s van je werk/bedrijf, en je huisstijlkleuren als je die hebt.' },
    { question: 'Hoe lang duurt deze fase?', answer: 'Dit hangt af van hoe snel je de materialen kunt aanleveren. Gemiddeld duurt dit 1-3 werkdagen.' },
    { question: 'Wat als ik nog geen logo heb?', answer: 'Geen probleem! We kunnen ook een logo voor je ontwerpen als extra service, of we werken met je bedrijfsnaam in een mooi lettertype.' },
    { question: 'Kan ik later nog materialen aanpassen?', answer: 'Ja, kleine aanpassingen zijn altijd mogelijk. Grote wijzigingen kunnen wel invloed hebben op de planning.' }
  ],
  design: [
    { question: 'Wat gebeurt er in de designfase?', answer: 'We maken een visueel ontwerp van je website. Je krijgt een preview te zien zodat je kunt beoordelen of het aan je wensen voldoet.' },
    { question: 'Hoeveel revisies zijn inbegrepen?', answer: 'Afhankelijk van je pakket heb je 2-5 designrevisies inbegrepen. Extra revisies kunnen worden bijgeboekt.' },
    { question: 'Hoe kan ik feedback geven?', answer: 'Via de feedbacksectie op deze pagina kun je je opmerkingen doorgeven. Wees zo specifiek mogelijk over wat je anders wilt.' },
    { question: 'Hoe lang duurt de designfase?', answer: 'Gemiddeld 3-5 werkdagen, afhankelijk van de complexiteit en feedback.' }
  ],
  design_approved: [
    { question: 'Wat betekent "Design goedgekeurd"?', answer: 'Je hebt het ontwerp goedgekeurd! Nu wachten we op je betaling voordat we verder gaan met de bouw van je website.' },
    { question: 'Hoe kan ik betalen?', answer: 'Je ontvangt een betaallink via e-mail. Je kunt betalen via iDEAL, creditcard of andere betaalmethodes.' },
    { question: 'Wat gebeurt er na betaling?', answer: 'Zodra we je betaling hebben ontvangen, starten we direct met het bouwen van je website!' },
    { question: 'Kan ik nog wijzigingen doorgeven?', answer: 'Kleine wijzigingen zijn nog mogelijk tijdens de bouwfase. Grote ontwerpwijzigingen kunnen extra kosten met zich meebrengen.' }
  ],
  development: [
    { question: 'Wat gebeurt er nu?', answer: 'We bouwen je website op basis van het goedgekeurde ontwerp. Alles wordt responsive gemaakt voor mobiel, tablet en desktop.' },
    { question: 'Kan ik nog wijzigingen doorgeven?', answer: 'Kleine tekstaanpassingen zijn mogelijk. Grote structurele wijzigingen kunnen extra kosten met zich meebrengen.' },
    { question: 'Hoe lang duurt development?', answer: 'Gemiddeld 5-10 werkdagen, afhankelijk van de complexiteit van je website.' },
    { question: 'Wordt mijn website SEO-vriendelijk?', answer: 'Ja, we optimaliseren de technische SEO-basis: snelle laadtijden, goede structuur, en juiste meta-tags.' }
  ],
  review: [
    { question: 'Wat moet ik controleren?', answer: 'Check alle teksten op spelfouten, of de foto\'s goed staan, of links werken, en of alles goed leesbaar is op je telefoon.' },
    { question: 'Hoeveel tijd heb ik voor review?', answer: 'We geven je gemiddeld 3-5 werkdagen om alles te bekijken. Langer mag ook, maar dit kan de livegang vertragen.' },
    { question: 'Wat als ik iets wil aanpassen?', answer: 'Gebruik het feedbackformulier om je aanpassingen door te geven. We verwerken deze zo snel mogelijk.' },
    { question: 'Wanneer gaat mijn site live?', answer: 'Zodra je de finale goedkeuring geeft, kunnen we binnen 1-2 werkdagen live gaan!' }
  ],
  live: [
    { question: 'Mijn website is live! Wat nu?', answer: 'Gefeliciteerd! Je kunt nu je website delen. Wij zorgen voor hosting, SSL en technisch onderhoud.' },
    { question: 'Hoe vraag ik een wijziging aan?', answer: 'Gebruik het "Aanpassing aanvragen" formulier op deze pagina. We nemen je verzoek zo snel mogelijk in behandeling.' },
    { question: 'Hoeveel wijzigingen zijn inbegrepen?', answer: 'In je abonnement zitten standaard kleine tekstuele en afbeelding-wijzigingen. Grote wijzigingen worden apart besproken.' },
    { question: 'Wat als mijn website traag is?', answer: 'Neem contact met ons op. We monitoren de prestaties en lossen eventuele problemen snel op.' }
  ]
}

/**
 * Haal revisies voor pakket op
 */
export const getPackageRevisions = (packageType: string): number => {
  const revisions: Record<string, number> = {
    starter: 2,
    professional: 3,
    premium: 5,
    business: 5,
    webshop: 3
  }
  return revisions[packageType?.toLowerCase()] || 2
}

/**
 * Priority labels
 */
export const PRIORITY_CONFIG = {
  low: { label: 'Nice to have', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  normal: { label: 'Normaal', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  urgent: { label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-100' }
}

