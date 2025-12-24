/**
 * Developer Dashboard Types
 * Shared types for all developer dashboard components
 */

export type DashboardView = 'projects' | 'messages' | 'payments' | 'customers'

export type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live'
export type PaymentStatus = 'pending' | 'awaiting_payment' | 'paid' | 'failed' | 'refunded'
export type ServiceType = 'website' | 'webshop' | 'logo' | 'drone'

export interface Project {
  id: string
  projectId: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  package: 'starter' | 'professional' | 'business' | 'webshop'
  serviceType?: ServiceType
  phase: ProjectPhase
  paymentStatus: PaymentStatus
  paymentUrl?: string
  mollieCustomerId?: string
  createdAt: string
  updatedAt: string
  estimatedCompletion?: string
  stagingUrl?: string
  liveUrl?: string
  designPreviewUrl?: string
  designApproved?: boolean
  designApprovedAt?: string
  googleDriveUrl?: string
  messages: ChatMessage[]
  onboardingData?: Record<string, unknown>
  discountCode?: string
  internalNotes?: string
  phaseChecklist?: Record<string, boolean>
  lastActivityAt?: string
  liveDate?: string
  feedbackHistory?: FeedbackEntry[]
  // Feedback questions selection
  feedbackQuestions?: string[]
  customQuestions?: string[]
  // Domain & Email for live going
  domainInfo?: DomainInfo
  emailInfo?: EmailInfo
  legalInfo?: LegalInfo
  businessInfo?: BusinessInfo
  liveGoingData?: LiveGoingData
  preLiveChecklist?: PreLiveChecklist
}

export interface ChatMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
}

export interface FeedbackEntry {
  id: string
  date: string
  type: 'design' | 'review'
  feedback: string
  feedbackItems?: FeedbackItem[]
  status: 'pending' | 'resolved'
  // Extended feedback fields
  severity?: 'small' | 'medium' | 'large'
  quickTags?: string[]
  category?: string
  details?: string
  markers?: FeedbackMarker[]
}

export interface FeedbackMarker {
  id: string
  x: number
  y: number
  device: 'desktop' | 'mobile'
  comment: string
  type: 'positive' | 'suggestion'
}

export interface FeedbackItem {
  category: string
  rating?: 'positive' | 'negative' | 'neutral'
  type?: 'positive' | 'suggestion'
  feedback?: string
  text?: string
  priority?: 'low' | 'normal' | 'urgent'
  position?: { x: number; y: number; device: string }
}

// Domain & Email configuration for going live
export interface DomainInfo {
  hasDomain: boolean
  domainName?: string
  registrar?: string // TransIP, Hostnet, Strato, GoDaddy, etc.
  wantsNewDomain?: boolean
  preferredDomain?: string
  dnsVerified?: boolean
  dnsRecords?: DnsRecord[]
  transferStatus: 'not_started' | 'instructions_sent' | 'pending' | 'in_progress' | 'completed' | 'not_needed'
  transferStartedAt?: string
  transferCompletedAt?: string
  notes?: string
}

export interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS'
  name: string
  value: string
  verified: boolean
  verifiedAt?: string
}

export interface EmailInfo {
  hasBusinessEmail: boolean
  currentProvider?: string // Google Workspace, Microsoft 365, Hostnet, eigen server
  emailAddresses?: string[]
  wantsWebstabilityEmail: boolean
  wantsEmailForwarding?: boolean
  forwardingAddress?: string
  emailSetupStatus: 'not_started' | 'pending' | 'in_progress' | 'completed' | 'not_needed'
  mxRecordsConfigured?: boolean
  notes?: string
}

export interface LiveGoingData {
  domainInfo: DomainInfo
  emailInfo: EmailInfo
  legalInfo: LegalInfo
  businessInfo: BusinessInfo
  checklist: PreLiveChecklist
  scheduledLiveDate?: string
  actualLiveDate?: string
  notes?: string
}

// Legal documents info
export interface LegalInfo {
  hasPrivacyPolicy: boolean
  privacyPolicyUrl?: string // Drive link or URL
  privacyPolicyUploadedAt?: string
  wantsPrivacyPolicyCreated: boolean
  
  hasTermsConditions: boolean
  termsConditionsUrl?: string
  termsConditionsUploadedAt?: string
  wantsTermsCreated: boolean
  
  wantsAnalytics: boolean
  analyticsConfigured?: boolean
  cookieConsentConfigured?: boolean
}

// Business info for website
export interface BusinessInfo {
  kvkNumber?: string
  btwNumber?: string
  iban?: string // For webshops
  businessAddress?: string
  businessCity?: string
  businessPostcode?: string
}

// Pre-live checklist - items klant moet afvinken
export interface PreLiveChecklist {
  // Automatisch
  paymentReceived: boolean
  paymentReceivedAt?: string
  
  // Domein
  authCodeProvided: boolean
  authCode?: string
  authCodeProvidedAt?: string
  domainTransferStarted: boolean
  domainTransferCompleted: boolean
  
  // Juridisch
  privacyPolicyProvided: boolean
  termsConditionsProvided: boolean
  
  // Email
  emailPreferenceConfirmed: boolean
  emailSetupCompleted: boolean
  
  // Analytics
  analyticsAgreed: boolean
  
  // Final
  finalApprovalGiven: boolean
  finalApprovalAt?: string
}

// Popular domain registrars in NL
export const DOMAIN_REGISTRARS = [
  { value: 'transip', label: 'TransIP' },
  { value: 'hostnet', label: 'Hostnet' },
  { value: 'strato', label: 'Strato' },
  { value: 'versio', label: 'Versio' },
  { value: 'mijndomein', label: 'Mijn Domein' },
  { value: 'godaddy', label: 'GoDaddy' },
  { value: 'namecheap', label: 'Namecheap' },
  { value: 'cloudflare', label: 'Cloudflare' },
  { value: 'other', label: 'Anders' },
  { value: 'unknown', label: 'Weet ik niet' },
]

// Popular email providers
export const EMAIL_PROVIDERS = [
  { value: 'google', label: 'Google Workspace (Gmail)' },
  { value: 'microsoft', label: 'Microsoft 365 (Outlook)' },
  { value: 'hostnet', label: 'Hostnet Email' },
  { value: 'transip', label: 'TransIP Email' },
  { value: 'own_server', label: 'Eigen mailserver' },
  { value: 'other', label: 'Anders' },
  { value: 'none', label: 'Geen zakelijke email' },
]

export interface EmailLogEntry {
  id: string
  timestamp: string
  projectId: string
  projectName: string
  recipientEmail: string
  recipientName: string
  type: 'phase_change' | 'upload_link' | 'design_link' | 'live_link' | 'payment_link' | 'welcome' | 'password_reset' | 'message' | 'other'
  subject: string
  details?: string
  success: boolean
  error?: string
}

// Phase configuration
export const PHASE_CONFIG: Record<ProjectPhase, { 
  label: string
  color: string
  bgColor: string
  emoji: string
}> = {
  onboarding: { 
    label: 'Onboarding', 
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    emoji: '📋'
  },
  design: { 
    label: 'Design', 
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    emoji: '🎨'
  },
  feedback: { 
    label: 'Feedback', 
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    emoji: '💬'
  },
  revisie: {
    label: 'Revisie',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    emoji: '🔄'
  },
  payment: { 
    label: 'Betaling', 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    emoji: '💳'
  },
  approval: {
    label: 'Goedkeuring',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    emoji: '✅'
  },
  live: { 
    label: 'Live', 
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    emoji: '🚀'
  },
}

// Package configuration - prijzen incl. BTW
export const PACKAGE_CONFIG = {
  starter: { name: 'Starter', price: 99, setupFee: 99, color: 'blue', emoji: '⭐', pages: 5 },
  professional: { name: 'Professioneel', price: 149, setupFee: 179, color: 'purple', emoji: '💎', pages: 10 },
  business: { name: 'Business', price: 199, setupFee: 239, color: 'amber', emoji: '🚀', pages: 20 },
  webshop: { name: 'Webshop', price: 349, setupFee: 249, color: 'emerald', emoji: '🛒', pages: 50 },
}

// Service type configuration
export const SERVICE_CONFIG: Record<ServiceType, { label: string; emoji: string }> = {
  website: { label: 'Website', emoji: '🌐' },
  webshop: { label: 'Webshop', emoji: '🛒' },
  logo: { label: 'Logo', emoji: '🎨' },
  drone: { label: 'Drone', emoji: '🚁' },
}

// Developer checklist per phase - wat moet de developer doen?
export const PHASE_CHECKLIST: Record<ProjectPhase, {
  title: string
  tasks: string[]
  nextAction: string
}> = {
  onboarding: {
    title: 'Wachten op klant',
    tasks: [
      'Klant moet onboarding formulier invullen',
      'Content en logo verzamelen in Google Drive',
      'Controleer of alle gegevens compleet zijn',
    ],
    nextAction: 'Alle gegevens binnen → Start design',
  },
  design: {
    title: 'Ontwerp maken',
    tasks: [
      'Bekijk onboarding data en requirements',
      'Maak homepage design in Figma',
      'Maak subpagina designs',
      'Upload design preview naar project',
      'Verstuur design ter goedkeuring',
    ],
    nextAction: 'Design klaar → Stuur ter feedback',
  },
  feedback: {
    title: 'Feedback verwerken',
    tasks: [
      'Klant bekijkt design preview',
      'Verwerk feedback punten',
      'Update design volgens wensen',
    ],
    nextAction: 'Feedback verwerkt → Stuur herzien design',
  },
  revisie: {
    title: 'Revisie afronden',
    tasks: [
      'Bouw website volgens goedgekeurd design',
      'Test responsive design (mobile/tablet/desktop)',
      'Test alle functionaliteit',
      'Vraag klant om akkoord voor betaling',
    ],
    nextAction: 'Website klaar → Stuur betaallink',
  },
  payment: {
    title: 'Wachten op betaling',
    tasks: [
      'Betaallink verstuurd naar klant',
      'Wacht op eerste betaling',
      'Check of betaling is ontvangen',
    ],
    nextAction: 'Betaling binnen → Stuur goedkeuringsverzoek',
  },
  approval: {
    title: 'Wachten op goedkeuring',
    tasks: [
      'Klant checkt alle content',
      'Klant bevestigt contactgegevens',
      'Klant accepteert voorwaarden',
      'Configureer domein & DNS',
    ],
    nextAction: 'Goedkeuring binnen → Zet website live',
  },
  live: {
    title: 'Website is live',
    tasks: [
      'DNS instellingen geconfigureerd',
      'SSL certificaat actief',
      'Website is bereikbaar',
      'Monitoring actief',
    ],
    nextAction: 'Onderhoud en maandelijkse aanpassingen',
  },
}
