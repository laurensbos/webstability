/**
 * Billing & Invoice Types
 * Types voor betalingen, abonnementen en facturen
 */

import type { PackageType, ExtraServiceType } from '../config/company'

// ===========================================
// INVOICE TYPES
// ===========================================

export interface Invoice {
  id: string
  invoiceNumber: string           // e.g., "WS-2025-0001"
  projectId: string
  subscriptionId?: string
  
  // Klantgegevens
  customer: CustomerDetails
  
  // Factuurregels
  lines: InvoiceLine[]
  
  // Bedragen
  subtotal: number                // Totaal excl. BTW
  vatAmount: number               // BTW bedrag
  vatRate: number                 // BTW percentage (0.21)
  total: number                   // Totaal incl. BTW
  
  // Status
  status: InvoiceStatus
  
  // Datums
  issueDate: string               // Factuurdatum (ISO)
  dueDate: string                 // Vervaldatum (ISO)
  paidAt?: string                 // Betaaldatum (ISO)
  
  // Mollie koppelingen
  molliePaymentId?: string
  mollieSubscriptionId?: string
  
  // PDF
  pdfUrl?: string
  pdfGeneratedAt?: string
  
  // Notities
  notes?: string
  internalNotes?: string
  
  createdAt: string
  updatedAt: string
}

export type InvoiceStatus = 
  | 'draft'       // Concept, nog niet verstuurd
  | 'sent'        // Verstuurd, wacht op betaling
  | 'paid'        // Betaald
  | 'overdue'     // Te laat met betalen
  | 'cancelled'   // Geannuleerd
  | 'refunded'    // Terugbetaald

export interface InvoiceLine {
  id: string
  description: string
  quantity: number
  unitPriceExclVat: number        // Prijs per stuk excl. BTW
  totalExclVat: number            // Regeltotaal excl. BTW
  vatRate: number                 // BTW percentage
  vatAmount: number               // BTW bedrag
  totalInclVat: number            // Regeltotaal incl. BTW
  
  // Optionele periode (voor abonnementen)
  periodStart?: string
  periodEnd?: string
}

export interface CustomerDetails {
  name: string
  email: string
  phone?: string
  
  // Adres (optioneel voor particulieren, verplicht voor zakelijk)
  address?: {
    street: string
    postalCode: string
    city: string
    country: string
  }
  
  // Zakelijke gegevens (optioneel)
  companyName?: string
  kvk?: string
  btw?: string                    // BTW-nummer klant
}

// ===========================================
// SUBSCRIPTION TYPES
// ===========================================

export interface Subscription {
  id: string
  projectId: string
  
  // Mollie IDs
  mollieCustomerId: string
  mollieSubscriptionId?: string   // Pas na eerste betaling
  mollieMandateId?: string        // Machtiging voor automatische incasso
  
  // Klantgegevens
  customer: CustomerDetails
  
  // Pakket
  packageType: PackageType
  packageName: string
  
  // Prijzen (maandelijks)
  amountExclVat: number
  amountInclVat: number
  vatRate: number
  
  // Status
  status: SubscriptionStatus
  
  // Periodes
  interval: 'monthly' | 'yearly'
  intervalMonths: number          // 1 voor maandelijks, 12 voor jaarlijks
  
  // Belangrijke datums
  startDate: string               // Start van abonnement
  nextPaymentDate?: string        // Volgende incasso datum
  cancelledAt?: string            // Annuleringsdatum
  pausedAt?: string               // Gepauzeerd sinds
  
  // Statistieken
  totalPaid: number               // Totaal betaald
  paymentCount: number            // Aantal betalingen
  
  createdAt: string
  updatedAt: string
}

export type SubscriptionStatus = 
  | 'pending'     // Wacht op eerste betaling
  | 'active'      // Actief, wordt automatisch geïncasseerd
  | 'paused'      // Tijdelijk gepauzeerd
  | 'cancelled'   // Opgezegd
  | 'expired'     // Verlopen

// ===========================================
// PAYMENT TYPES
// ===========================================

export interface Payment {
  id: string
  invoiceId: string
  subscriptionId?: string
  projectId: string
  
  // Mollie
  molliePaymentId: string
  mollieStatus: MolliePaymentStatus
  
  // Bedragen
  amount: number                  // Bedrag incl. BTW
  amountRefunded?: number
  
  // Betaalmethode
  method?: PaymentMethod
  
  // Status
  status: PaymentStatus
  
  // Datums
  createdAt: string
  paidAt?: string
  failedAt?: string
  cancelledAt?: string
  expiredAt?: string
  
  // Foutmelding bij mislukking
  failureReason?: string
}

export type PaymentStatus = 
  | 'open'        // Wacht op betaling
  | 'pending'     // In verwerking
  | 'paid'        // Betaald
  | 'failed'      // Mislukt
  | 'cancelled'   // Geannuleerd
  | 'expired'     // Verlopen
  | 'refunded'    // Terugbetaald

export type MolliePaymentStatus = 
  | 'open'
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'canceled'
  | 'expired'

export type PaymentMethod = 
  | 'ideal'
  | 'creditcard'
  | 'bancontact'
  | 'sofort'
  | 'paypal'
  | 'applepay'
  | 'directdebit'  // Automatische incasso

// ===========================================
// MOLLIE WEBHOOK TYPES
// ===========================================

export interface MollieWebhookEvent {
  id: string                      // Payment ID (tr_xxx) of Subscription ID (sub_xxx)
}

export interface MolliePaymentResponse {
  id: string
  mode: 'test' | 'live'
  status: MolliePaymentStatus
  amount: {
    value: string
    currency: string
  }
  description: string
  method: PaymentMethod | null
  metadata: {
    projectId?: string
    subscriptionId?: string
    invoiceId?: string
    type?: 'first_payment' | 'recurring' | 'one_time'
  }
  redirectUrl: string
  webhookUrl: string
  createdAt: string
  paidAt?: string
  canceledAt?: string
  expiredAt?: string
  failedAt?: string
  
  // Mandate info voor subscriptions
  mandateId?: string
  subscriptionId?: string
  
  _links: {
    checkout?: { href: string }
    dashboard: { href: string }
  }
}

export interface MollieSubscriptionResponse {
  id: string
  mode: 'test' | 'live'
  status: 'pending' | 'active' | 'suspended' | 'canceled'
  amount: {
    value: string
    currency: string
  }
  times: number | null            // Aantal betalingen, null = oneindig
  timesRemaining: number | null
  interval: string                // "1 month", "1 year", etc.
  description: string
  method: PaymentMethod | null
  mandateId: string
  webhookUrl: string
  metadata: {
    projectId?: string
  }
  startDate: string
  nextPaymentDate: string | null
  createdAt: string
  canceledAt?: string
}

// ===========================================
// API REQUEST/RESPONSE TYPES
// ===========================================

export interface CreatePaymentRequest {
  projectId: string
  packageType: PackageType
  customer: CustomerDetails
  redirectUrl: string
}

export interface CreatePaymentResponse {
  success: boolean
  paymentId?: string
  checkoutUrl?: string
  error?: string
}

export interface CreateOneTimePaymentRequest {
  projectId: string
  serviceType: ExtraServiceType
  customer: CustomerDetails
  redirectUrl: string
}

export interface GetInvoicesRequest {
  projectId?: string
  status?: InvoiceStatus
  limit?: number
  offset?: number
}

export interface GetInvoicesResponse {
  success: boolean
  invoices: Invoice[]
  total: number
  error?: string
}

// ===========================================
// DASHBOARD TYPES
// ===========================================

export interface BillingStats {
  // Maandelijkse recurring revenue
  mrr: number
  mrrChange: number               // Verschil t.o.v. vorige maand
  
  // Totalen
  totalRevenue: number
  totalRevenueThisMonth: number
  totalRevenueLastMonth: number
  
  // Abonnementen
  activeSubscriptions: number
  cancelledThisMonth: number
  newThisMonth: number
  churnRate: number               // Percentage opzeggingen
  
  // Betalingen
  pendingPayments: number
  failedPayments: number
  overdueInvoices: number
}

export interface PaymentOverview {
  payment: Payment
  invoice: Invoice
  subscription?: Subscription
  project: {
    projectId: string
    businessName: string
  }
}
