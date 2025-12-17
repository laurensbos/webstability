/**
 * Onboarding types voor service-specifieke onboarding
 */

export type ServiceType = 'website' | 'webshop' | 'drone' | 'logo'

export type OnboardingPhase = 'intake' | 'design' | 'development' | 'review' | 'live'

export interface TimelineStep {
  id: OnboardingPhase
  title: string
  description: string
  estimatedDays: number
  status: 'pending' | 'active' | 'completed'
  completedAt?: string
}

// Base onboarding data shared across all services
export interface BaseOnboardingData {
  projectId: string
  serviceType: ServiceType
  createdAt: string
  updatedAt: string
  submittedAt?: string
  
  // Contact info
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  
  // Business info
  aboutBusiness: string
  targetAudience: string
  competitors: string[]
  
  // Design preferences
  hasLogo: boolean
  logoDescription?: string
  logoFiles?: string[]
  brandColors: string[]
  customColors?: string[]
  brandFont?: string
  
  // Additional
  additionalNotes?: string
  inspirationUrls?: string[]
  
  // Status
  canEdit: boolean // Can only edit until design is approved
  designApproved: boolean
  designApprovedAt?: string
}

// Website-specific questions
export interface WebsiteOnboardingData extends BaseOnboardingData {
  serviceType: 'website'
  
  // Website specific
  websiteType: 'business' | 'portfolio' | 'blog' | 'landing' | 'other'
  selectedPages: string[]
  mainGoal: 'leads' | 'information' | 'brand' | 'sales' | 'other'
  mainGoalOther?: string
  
  // Features
  needsContactForm: boolean
  needsBlog: boolean
  needsBookingSystem: boolean
  needsNewsletterIntegration: boolean
  needsGoogleMaps: boolean
  socialMediaLinks: Record<string, string>
  
  // Content
  hasExistingContent: boolean
  contentNotes?: string
  hasPhotos: boolean
  photoNotes?: string
  
  // Technical
  existingDomain?: string
  wantsDomainHelp: boolean
}

// Webshop-specific questions  
export interface WebshopOnboardingData extends BaseOnboardingData {
  serviceType: 'webshop'
  
  // Products
  productCategories: string[]
  estimatedProductCount: '1-50' | '50-200' | '200-500' | '500+'
  productDescriptions: 'customer_provides' | 'needs_help' | 'ai_generated'
  
  // Shipping & Payments
  shippingMethods: ('pickup' | 'postnl' | 'dhl' | 'dpd' | 'other')[]
  shippingOther?: string
  paymentMethods: ('ideal' | 'creditcard' | 'paypal' | 'klarna' | 'afterpay' | 'bancontact')[]
  
  // Features
  needsInventoryManagement: boolean
  needsCustomerAccounts: boolean
  needsDiscountCodes: boolean
  needsGiftCards: boolean
  needsReviews: boolean
  needsNewsletter: boolean
  
  // Content
  hasProductPhotos: boolean
  photoQuality: 'professional' | 'needs_editing' | 'needs_photography'
  
  // Design
  webshopStyle: 'minimal' | 'bold' | 'luxury' | 'playful' | 'corporate'
  exampleShops: string[]
}

// Drone-specific questions
export interface DroneOnboardingData extends BaseOnboardingData {
  serviceType: 'drone'
  
  // Project type
  projectType: 'real_estate' | 'event' | 'construction' | 'nature' | 'commercial' | 'other'
  projectTypeOther?: string
  
  // Content type
  contentNeeded: ('photos' | 'video' | '360_panorama' | 'timelapse')[]
  
  // Location
  locationAddress: string
  locationCity: string
  locationPostcode: string
  locationNotes?: string
  isIndoor: boolean
  hasPermissions: boolean
  permissionNotes?: string
  
  // Timing
  preferredDate: string
  preferredTimeOfDay: 'morning' | 'midday' | 'evening' | 'golden_hour' | 'flexible'
  isFlexibleDate: boolean
  deadlineDate?: string
  
  // Delivery
  deliveryFormat: 'digital_download' | 'usb' | 'both'
  needsEditing: boolean
  editingStyle?: 'natural' | 'cinematic' | 'corporate'
  
  // Usage
  usagePurpose: 'website' | 'social_media' | 'print' | 'video_production' | 'other'[]
  commercialUse: boolean
}

// Logo-specific questions
export interface LogoOnboardingData extends BaseOnboardingData {
  serviceType: 'logo'
  
  // Business
  industry: string
  values: string[]
  
  // Logo preferences
  logoType: 'wordmark' | 'lettermark' | 'icon' | 'combination' | 'emblem' | 'flexible'
  stylePreferences: ('modern' | 'classic' | 'minimalist' | 'playful' | 'bold' | 'elegant')[]
  
  // Colors
  colorPreferences: 'suggest' | 'has_colors'
  avoidColors?: string[]
  
  // Inspiration
  likedLogos: string[] // URLs or descriptions
  dislikedLogos: string[] // URLs or descriptions
  competitorLogos: string[]
  
  // Usage
  primaryUsage: ('website' | 'print' | 'signage' | 'merchandise' | 'social_media' | 'vehicles')[]
  needsVariations: boolean
  
  // Existing branding
  hasExistingLogo: boolean
  existingLogoFeedback?: string
  existingLogoFiles?: string[]
  
  // Deliverables
  neededFormats: ('svg' | 'png' | 'jpg' | 'pdf' | 'ai' | 'eps')[]
  needsColorPalette: boolean
  needsBrandGuidelines: boolean
}

// Union type for all onboarding data
export type OnboardingData = 
  | WebsiteOnboardingData 
  | WebshopOnboardingData 
  | DroneOnboardingData 
  | LogoOnboardingData

// Chat message for communication
export interface OnboardingMessage {
  id: string
  projectId: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
  attachments?: {
    name: string
    url: string
    type: string
  }[]
}

// Project timeline for tracking progress
export interface ProjectTimeline {
  projectId: string
  serviceType: ServiceType
  currentPhase: OnboardingPhase
  steps: TimelineStep[]
  estimatedCompletionDate: string
  nextActionRequired: 'client' | 'developer'
  nextActionDescription: string
}

// Full onboarding state
export interface OnboardingState {
  data: OnboardingData
  timeline: ProjectTimeline
  messages: OnboardingMessage[]
  canEdit: boolean
}

// Default timeline for each service type
export const getDefaultTimeline = (serviceType: ServiceType): TimelineStep[] => {
  const baseSteps: TimelineStep[] = [
    { 
      id: 'intake', 
      title: 'Intake', 
      description: 'Verzamel alle informatie over je project',
      estimatedDays: 2,
      status: 'active'
    },
    { 
      id: 'design', 
      title: 'Design', 
      description: 'Ontwerp van je project',
      estimatedDays: serviceType === 'logo' ? 5 : 7,
      status: 'pending'
    },
  ]

  if (serviceType === 'website' || serviceType === 'webshop') {
    baseSteps.push(
      { 
        id: 'development', 
        title: 'Development', 
        description: 'Bouwen van je website',
        estimatedDays: serviceType === 'webshop' ? 14 : 7,
        status: 'pending'
      },
      { 
        id: 'review', 
        title: 'Review', 
        description: 'Jouw feedback verwerken',
        estimatedDays: 3,
        status: 'pending'
      },
      { 
        id: 'live', 
        title: 'Live', 
        description: 'Je website gaat live!',
        estimatedDays: 1,
        status: 'pending'
      }
    )
  } else if (serviceType === 'drone') {
    baseSteps.push(
      { 
        id: 'development', 
        title: 'Opname', 
        description: 'Drone opnames maken',
        estimatedDays: 1,
        status: 'pending'
      },
      { 
        id: 'review', 
        title: 'Bewerking', 
        description: 'Editing en nabewerking',
        estimatedDays: 5,
        status: 'pending'
      },
      { 
        id: 'live', 
        title: 'Levering', 
        description: 'Bestanden worden geleverd',
        estimatedDays: 1,
        status: 'pending'
      }
    )
  } else if (serviceType === 'logo') {
    baseSteps.push(
      { 
        id: 'review', 
        title: 'Feedback', 
        description: 'Revisies verwerken',
        estimatedDays: 3,
        status: 'pending'
      },
      { 
        id: 'live', 
        title: 'Levering', 
        description: 'Bestanden in alle formaten',
        estimatedDays: 1,
        status: 'pending'
      }
    )
  }

  return baseSteps
}
