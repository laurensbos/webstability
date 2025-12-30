/**
 * Project status types voor het klantportaal
 */

export type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'domain' | 'live'

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
  senderName?: string
}

export interface ChangeRequest {
  id?: string
  title?: string
  date?: string
  description: string
  request?: string              // Legacy field, use description instead
  priority: 'low' | 'normal' | 'urgent'
  category: 'text' | 'design' | 'images' | 'functionality' | 'other'
  status?: 'pending' | 'in_progress' | 'done' | 'completed'
  response?: string
  createdAt?: string
  attachments?: string[]
}

// ===========================================
// FEEDBACK QUESTIONS TYPES
// ===========================================

export type FeedbackQuestionCategory = 'branding' | 'content' | 'functionality' | 'images' | 'custom'

export interface FeedbackQuestion {
  id: string
  category: FeedbackQuestionCategory
  question: string
  helpText?: string                // Extra uitleg voor leken
  icon?: string                    // Emoji icon voor visuele herkenning
  isDefault?: boolean              // Of het een standaard vraag is
}

export interface FeedbackQuestionAnswer {
  questionId: string
  question: string
  answer: 'yes' | 'no' | null
  comment?: string
}

// Beschikbare vragen die developer kan kiezen
// Vragen zijn leek-vriendelijk geschreven met hulptekst
export const AVAILABLE_FEEDBACK_QUESTIONS: FeedbackQuestion[] = [
  // Branding & Stijl - Eerste indruk
  { 
    id: 'branding-firstimpression', 
    category: 'branding', 
    question: '🎨 Wat vind je van de eerste indruk?',
    helpText: 'Bekijk de website 5 seconden en geef je gevoel.',
    isDefault: true 
  },
  { 
    id: 'branding-colors', 
    category: 'branding', 
    question: '🌈 Vind je de kleuren mooi?',
    helpText: 'Passen de kleuren bij je bedrijf en huisstijl?',
    isDefault: true 
  },
  { 
    id: 'branding-style', 
    category: 'branding', 
    question: '✨ Past de stijl bij je merk?',
    helpText: 'Is dit hoe je wilt dat klanten je zien?',
    isDefault: false 
  },
  { 
    id: 'branding-professional', 
    category: 'branding', 
    question: '👔 Ziet het er professioneel genoeg uit?',
    helpText: 'Zou je dit vertrouwen als klant?',
    isDefault: false 
  },
  { 
    id: 'branding-friendly', 
    category: 'branding', 
    question: '😊 Is de sfeer vriendelijk/toegankelijk?',
    helpText: 'Voelt de website uitnodigend aan?',
    isDefault: false 
  },
  { 
    id: 'branding-logo', 
    category: 'branding', 
    question: '🏷️ Staat je logo goed in beeld?',
    helpText: 'Is het groot genoeg en op de juiste plek?',
    isDefault: false 
  },
  
  // Content & Tekst
  { 
    id: 'content-text', 
    category: 'content', 
    question: '📝 Kloppen alle teksten?',
    helpText: 'Geen tikfouten? Alle informatie correct?',
    isDefault: true 
  },
  { 
    id: 'content-tone', 
    category: 'content', 
    question: '💬 Spreekt de tekst je aan?',
    helpText: 'Is dit hoe je tegen klanten wilt praten?',
    isDefault: false 
  },
  { 
    id: 'content-prices', 
    category: 'content', 
    question: '💰 Zijn de prijzen correct?',
    helpText: 'Controleer alle bedragen en tarieven.',
    isDefault: false 
  },
  { 
    id: 'content-services', 
    category: 'content', 
    question: '📋 Staan al je diensten erbij?',
    helpText: 'Missen er diensten of producten?',
    isDefault: false 
  },
  { 
    id: 'content-contact', 
    category: 'content', 
    question: '📞 Kloppen je contactgegevens?',
    helpText: 'Check telefoonnummer, email en adres.',
    isDefault: false 
  },
  
  // Functionaliteit
  { 
    id: 'func-mobile', 
    category: 'functionality', 
    question: '📱 Werkt het goed op je telefoon?',
    helpText: 'Bekijk de website op je mobiel.',
    isDefault: true 
  },
  { 
    id: 'func-navigation', 
    category: 'functionality', 
    question: '🧭 Is de navigatie logisch?',
    helpText: 'Kun je makkelijk vinden wat je zoekt?',
    isDefault: false 
  },
  { 
    id: 'func-buttons', 
    category: 'functionality', 
    question: '👆 Zijn de knoppen duidelijk?',
    helpText: 'Weet je waar je moet klikken?',
    isDefault: false 
  },
  { 
    id: 'func-contact', 
    category: 'functionality', 
    question: '✉️ Werkt het contactformulier?',
    helpText: 'Probeer een testbericht te sturen.',
    isDefault: false 
  },
  { 
    id: 'func-speed', 
    category: 'functionality', 
    question: '⚡ Laadt de website snel genoeg?',
    helpText: 'Moet je lang wachten op pagina\'s?',
    isDefault: false 
  },
  
  // Afbeeldingen
  { 
    id: 'images-representative', 
    category: 'images', 
    question: '📷 Passen de foto\'s bij je bedrijf?',
    helpText: 'Representeren ze wat je doet?',
    isDefault: false 
  },
  { 
    id: 'images-quality', 
    category: 'images', 
    question: '🖼️ Is de kwaliteit van foto\'s goed?',
    helpText: 'Zijn ze scherp en niet wazig?',
    isDefault: false 
  },
  { 
    id: 'images-other', 
    category: 'images', 
    question: '🔄 Wil je andere foto\'s gebruiken?',
    helpText: 'Heb je betere of andere beelden?',
    isDefault: false 
  },
]

export const FEEDBACK_QUESTION_CATEGORIES: Record<FeedbackQuestionCategory, string> = {
  branding: 'Branding & Stijl',
  content: 'Content & Tekst',
  functionality: 'Functionaliteit',
  images: 'Afbeeldingen',
  custom: 'Eigen vragen'
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

export type PaymentStatus = 'not_required' | 'pending' | 'awaiting_payment' | 'paid' | 'failed' | 'overdue'

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
  // Payment tracking voor verbeterde UX
  lastPaymentAttempt?: string   // Laatste betaalpoging
  paymentFailureReason?: string // Reden van mislukking
  paymentRetryCount?: number    // Aantal pogingen
  paymentReminderCount?: number // Aantal verstuurde herinneringen
  lastPaymentReminderSent?: string // Laatste herinnering datum
  // Feedback status tracking
  feedbackReceivedAt?: string   // Wanneer feedback ontvangen
  feedbackStatus?: 'processing' | 'completed'  // Verwerking status
  // Custom feedback questions voor dit project
  feedbackQuestions?: string[]  // Array van question IDs die developer heeft geselecteerd
  customQuestions?: string[]    // Eigen vragen van developer
  feedbackQuestionAnswers?: FeedbackQuestionAnswer[]  // Antwoorden van klant
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
  // Upload bevestiging
  uploadsConfirmed?: boolean     // Heeft klant bevestigd dat alle uploads klaar zijn
  uploadsConfirmedAt?: string    // Wanneer bevestigd
  // Change requests tracking
  changesThisMonth?: number      // Aantal aanpassingen deze maand
  changesResetAt?: string        // Wanneer teller reset
  analyticsUrl?: string          // URL naar analytics dashboard (bv. Plausible/GA embed)
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
  // Pre-live checklist data
  domainInfo?: {
    hasDomain?: boolean
    domainName?: string
    registrar?: string
    authCode?: string
    transferStatus?: string
  }
  emailInfo?: {
    emailPreference?: 'none' | 'new' | 'existing'
    currentProvider?: string
    desiredEmails?: string[]
    hasBusinessEmail?: boolean
  }
  legalInfo?: {
    hasPrivacyPolicy?: boolean
    privacyPolicyUrl?: string
    wantsPrivacyPolicyCreated?: boolean
    hasTermsConditions?: boolean
    termsConditionsUrl?: string
    wantsTermsCreated?: boolean
    wantsAnalytics?: boolean
  }
  // Email preferences
  preferredLanguage?: 'nl' | 'en'    // Preferred language for emails
  businessInfo?: {
    kvkNumber?: string
    btwNumber?: string
  }
  preLiveChecklist?: {
    paymentReceived?: boolean
    authCodeProvided?: boolean
    privacyPolicyProvided?: boolean
    termsConditionsProvided?: boolean
    emailPreferenceConfirmed?: boolean
    analyticsAgreed?: boolean
    finalApprovalGiven?: boolean
    // Klant approval velden
    contentApproved?: boolean          // Alle teksten en content zijn correct
    contactInfoCorrect?: boolean       // Contactgegevens kloppen
    termsAccepted?: boolean            // Algemene voorwaarden geaccepteerd
    domainConfirmed?: boolean          // Domein informatie correct
    approvedAt?: string                // Wanneer goedgekeurd
    approvedByName?: string            // Naam van wie goedkeurde
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
    key: 'feedback',
    label: 'Feedback',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    description: 'Bekijk design en geef feedback',
    customerMessage: 'Je design preview is klaar! Bekijk het en geef je feedback.',
    checklist: [
      { label: 'Design preview bekeken', forCustomer: true },
      { label: 'Feedback gegeven', forCustomer: true },
      { label: 'Feedback verwerkt', forCustomer: false },
      { label: 'Design definitief goedgekeurd', forCustomer: true },
    ],
    nextPhaseAction: 'Naar betaling →'
  },
  {
    key: 'payment',
    label: 'Betaling',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    description: 'Wacht op betaling om live te gaan',
    customerMessage: 'Je design is goedgekeurd! Na betaling zetten we je website live.',
    checklist: [
      { label: 'Betaallink verstuurd', forCustomer: false },
      { label: 'Betaling ontvangen', forCustomer: true },
      { label: 'Website gebouwd', forCustomer: false },
      { label: 'Domein geconfigureerd', forCustomer: false },
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
  const phases: ProjectPhase[] = ['onboarding', 'design', 'feedback', 'payment', 'live']
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
    feedback: 50,
    revisie: 60,
    payment: 75,
    domain: 90,
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
  feedback: [
    { question: 'Wat moet ik doen in de feedbackfase?', answer: 'Bekijk je design preview en geef aan wat je mooi vindt en wat je graag anders ziet. Wees zo specifiek mogelijk!' },
    { question: 'Hoeveel feedback rondes zijn er?', answer: 'Afhankelijk van je pakket heb je 2-5 feedbackrondes. We verwerken je feedback tot je 100% tevreden bent.' },
    { question: 'Hoe kan ik feedback geven?', answer: 'Via de design preview knop kun je per categorie feedback geven. Je kunt ook algemene opmerkingen toevoegen.' },
    { question: 'Wat gebeurt er na mijn goedkeuring?', answer: 'Na je goedkeuring ontvang je een betaallink. Zodra de betaling binnen is, zetten we je website live!' }
  ],
  revisie: [
    { question: 'Wat gebeurt er nu met mijn feedback?', answer: 'We zijn je feedback aan het verwerken en passen het design aan. Je ontvangt binnenkort een nieuwe preview.' },
    { question: 'Hoe lang duurt de revisie?', answer: 'Meestal 1-3 werkdagen, afhankelijk van de hoeveelheid aanpassingen.' },
    { question: 'Kan ik nog meer feedback geven?', answer: 'Zodra de revisie klaar is, krijg je een nieuwe preview te zien waarop je opnieuw feedback kunt geven.' },
    { question: 'Hoeveel revisies zijn inbegrepen?', answer: 'Afhankelijk van je pakket heb je 2-5 revisierondes inbegrepen.' }
  ],
  payment: [
    { question: 'Hoe kan ik betalen?', answer: 'Je ontvangt een betaallink via e-mail. Je kunt betalen via iDEAL, creditcard of andere betaalmethodes.' },
    { question: 'Wat gebeurt er na betaling?', answer: 'Zodra we je betaling hebben ontvangen, configureren we je domein en zetten we je website live!' },
    { question: 'Hoe lang duurt het tot mijn site live is?', answer: 'Na betaling duurt het meestal 1-2 werkdagen voordat je website volledig live is.' },
    { question: 'Wat als ik nog iets wil aanpassen?', answer: 'Kleine wijzigingen zijn altijd mogelijk. Neem contact met ons op via de chat.' }
  ],
  domain: [
    { question: 'Wat is een domein?', answer: 'Een domein is het webadres van je website, bijvoorbeeld jouwbedrijf.nl.' },
    { question: 'Ik heb al een domein, wat nu?', answer: 'Geen probleem! We hebben je autorisatiecode nodig om het domein te verhuizen. Deze kun je opvragen bij je huidige provider.' },
    { question: 'Wat is een autorisatiecode?', answer: 'Dit is een unieke code die nodig is om je domein te verhuizen naar een andere provider. Vraag deze op bij je huidige domeinprovider.' },
    { question: 'Hoe lang duurt het verhuizen?', answer: 'Een domeinverhuizing duurt gemiddeld 1-5 werkdagen, afhankelijk van je huidige provider.' },
    { question: 'Moet ik zelf iets doen?', answer: 'Je hoeft alleen de autorisatiecode te delen en de verhuizing goed te keuren. Wij regelen de rest!' }
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

