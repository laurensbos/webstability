/**
 * Developer Dashboard Types
 * Shared types for all developer dashboard components
 */

export type DashboardView = 'projects' | 'messages' | 'payments'

export type ProjectPhase = 'onboarding' | 'design' | 'design_approved' | 'development' | 'review' | 'live'
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
}

export interface FeedbackItem {
  category: string
  rating: 'positive' | 'negative' | 'neutral'
  feedback: string
  priority: 'low' | 'normal' | 'urgent'
}

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
  design_approved: { 
    label: 'Goedgekeurd', 
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    emoji: '✅'
  },
  development: { 
    label: 'Development', 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    emoji: '💻'
  },
  review: { 
    label: 'Review', 
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    emoji: '👁️'
  },
  live: { 
    label: 'Live', 
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    emoji: '🚀'
  },
}

// Package configuration
export const PACKAGE_CONFIG = {
  starter: { name: 'Starter', price: 29, setupFee: 99, color: 'blue', emoji: '⭐' },
  professional: { name: 'Professional', price: 49, setupFee: 179, color: 'purple', emoji: '💎' },
  business: { name: 'Business', price: 79, setupFee: 239, color: 'amber', emoji: '🚀' },
  webshop: { name: 'Webshop', price: 99, setupFee: 249, color: 'emerald', emoji: '🛒' },
}

// Service type configuration
export const SERVICE_CONFIG: Record<ServiceType, { label: string; emoji: string }> = {
  website: { label: 'Website', emoji: '🌐' },
  webshop: { label: 'Webshop', emoji: '🛒' },
  logo: { label: 'Logo', emoji: '🎨' },
  drone: { label: 'Drone', emoji: '🚁' },
}
