/**
 * Invoice Service
 * 
 * Handles invoice creation, PDF generation, and sending
 */

import { companyInfo, VAT_RATE, packages } from '../config/company'
import type { 
  Invoice, 
  InvoiceLine, 
  CustomerDetails,
  Subscription 
} from '../types/billing'

// ===========================================
// INVOICE NUMBER GENERATION
// ===========================================

/**
 * Genereer een uniek factuurnummer
 * Format: WS-2025-0001
 */
export function generateInvoiceNumber(existingInvoices: Invoice[]): string {
  const year = new Date().getFullYear()
  const prefix = companyInfo.invoicePrefix
  
  // Vind hoogste nummer dit jaar
  const thisYearInvoices = existingInvoices.filter(inv => 
    inv.invoiceNumber.startsWith(`${prefix}-${year}`)
  )
  
  let nextNumber = 1
  if (thisYearInvoices.length > 0) {
    const numbers = thisYearInvoices.map(inv => {
      const parts = inv.invoiceNumber.split('-')
      return parseInt(parts[2], 10) || 0
    })
    nextNumber = Math.max(...numbers) + 1
  }
  
  return `${prefix}-${year}-${String(nextNumber).padStart(4, '0')}`
}

// ===========================================
// INVOICE CREATION
// ===========================================

/**
 * Maak een factuur voor een abonnementsbetaling
 */
export function createSubscriptionInvoice(
  subscription: Subscription,
  existingInvoices: Invoice[],
  periodStart: Date,
  periodEnd: Date
): Invoice {
  const pkg = packages[subscription.packageType]
  const now = new Date()
  
  const line: InvoiceLine = {
    id: crypto.randomUUID(),
    description: `${pkg.description} (${formatPeriod(periodStart, periodEnd)})`,
    quantity: 1,
    unitPriceExclVat: subscription.amountExclVat,
    totalExclVat: subscription.amountExclVat,
    vatRate: VAT_RATE,
    vatAmount: subscription.amountInclVat - subscription.amountExclVat,
    totalInclVat: subscription.amountInclVat,
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString()
  }
  
  const dueDate = new Date(now)
  dueDate.setDate(dueDate.getDate() + companyInfo.paymentTermDays)
  
  return {
    id: crypto.randomUUID(),
    invoiceNumber: generateInvoiceNumber(existingInvoices),
    projectId: subscription.projectId,
    subscriptionId: subscription.id,
    
    customer: subscription.customer,
    
    lines: [line],
    
    subtotal: line.totalExclVat,
    vatAmount: line.vatAmount,
    vatRate: VAT_RATE,
    total: line.totalInclVat,
    
    status: 'draft',
    
    issueDate: now.toISOString(),
    dueDate: dueDate.toISOString(),
    
    mollieSubscriptionId: subscription.mollieSubscriptionId,
    
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }
}

/**
 * Maak een eenmalige factuur
 */
export function createOneTimeInvoice(
  projectId: string,
  customer: CustomerDetails,
  lines: Array<{
    description: string
    quantity: number
    unitPriceExclVat: number
  }>,
  existingInvoices: Invoice[]
): Invoice {
  const now = new Date()
  
  const invoiceLines: InvoiceLine[] = lines.map(line => {
    const totalExclVat = line.quantity * line.unitPriceExclVat
    const vatAmount = Math.round(totalExclVat * VAT_RATE * 100) / 100
    
    return {
      id: crypto.randomUUID(),
      description: line.description,
      quantity: line.quantity,
      unitPriceExclVat: line.unitPriceExclVat,
      totalExclVat,
      vatRate: VAT_RATE,
      vatAmount,
      totalInclVat: totalExclVat + vatAmount
    }
  })
  
  const subtotal = invoiceLines.reduce((sum, l) => sum + l.totalExclVat, 0)
  const vatAmount = invoiceLines.reduce((sum, l) => sum + l.vatAmount, 0)
  const total = invoiceLines.reduce((sum, l) => sum + l.totalInclVat, 0)
  
  const dueDate = new Date(now)
  dueDate.setDate(dueDate.getDate() + companyInfo.paymentTermDays)
  
  return {
    id: crypto.randomUUID(),
    invoiceNumber: generateInvoiceNumber(existingInvoices),
    projectId,
    
    customer,
    
    lines: invoiceLines,
    
    subtotal: Math.round(subtotal * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    vatRate: VAT_RATE,
    total: Math.round(total * 100) / 100,
    
    status: 'draft',
    
    issueDate: now.toISOString(),
    dueDate: dueDate.toISOString(),
    
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }
}

// ===========================================
// PDF GENERATION
// ===========================================

/**
 * Genereer PDF HTML voor een factuur
 * Dit kan worden geconverteerd naar PDF met een service als Puppeteer of PDFKit
 */
export function generateInvoicePdfHtml(invoice: Invoice): string {
  const { customer, lines } = invoice
  
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Factuur ${invoice.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #2563eb;
    }
    
    .logo {
      font-size: 24pt;
      font-weight: bold;
      color: #2563eb;
    }
    
    .invoice-title {
      text-align: right;
    }
    
    .invoice-title h1 {
      font-size: 28pt;
      font-weight: 300;
      color: #6b7280;
      margin-bottom: 5px;
    }
    
    .invoice-number {
      font-size: 12pt;
      font-weight: 600;
      color: #2563eb;
    }
    
    .addresses {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    
    .address-block {
      width: 45%;
    }
    
    .address-block h3 {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #9ca3af;
      margin-bottom: 10px;
    }
    
    .address-block p {
      margin-bottom: 3px;
    }
    
    .address-block .company-name {
      font-weight: 600;
      font-size: 11pt;
    }
    
    .meta-info {
      display: flex;
      gap: 40px;
      margin-bottom: 30px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
    }
    
    .meta-item {
      flex: 1;
    }
    
    .meta-item label {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      display: block;
      margin-bottom: 3px;
    }
    
    .meta-item span {
      font-weight: 600;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    th {
      text-align: left;
      padding: 12px 8px;
      border-bottom: 2px solid #e5e7eb;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
    }
    
    th:last-child,
    td:last-child {
      text-align: right;
    }
    
    td {
      padding: 16px 8px;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .description {
      font-weight: 500;
    }
    
    .period {
      font-size: 9pt;
      color: #6b7280;
    }
    
    .totals {
      margin-left: auto;
      width: 280px;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .totals-row.total {
      border-bottom: none;
      border-top: 2px solid #2563eb;
      padding-top: 12px;
      margin-top: 4px;
      font-size: 14pt;
      font-weight: 700;
      color: #2563eb;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 9pt;
      color: #6b7280;
    }
    
    .footer-grid {
      display: flex;
      justify-content: space-between;
    }
    
    .footer-col h4 {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    
    .payment-info {
      background: #eff6ff;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
      border-left: 4px solid #2563eb;
    }
    
    .payment-info h4 {
      color: #1e40af;
      margin-bottom: 10px;
    }
    
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">${companyInfo.name}</div>
    <div class="invoice-title">
      <h1>FACTUUR</h1>
      <div class="invoice-number">${invoice.invoiceNumber}</div>
    </div>
  </div>
  
  <div class="addresses">
    <div class="address-block">
      <h3>Van</h3>
      <p class="company-name">${companyInfo.legalName}</p>
      <p>${companyInfo.address.street}</p>
      <p>${companyInfo.address.postalCode} ${companyInfo.address.city}</p>
      <p>${companyInfo.address.country}</p>
      <p style="margin-top: 10px;">
        KVK: ${companyInfo.kvk}<br>
        BTW: ${companyInfo.btw}
      </p>
    </div>
    
    <div class="address-block">
      <h3>Aan</h3>
      <p class="company-name">${customer.companyName || customer.name}</p>
      ${customer.companyName && customer.name !== customer.companyName ? `<p>${customer.name}</p>` : ''}
      ${customer.address ? `
        <p>${customer.address.street}</p>
        <p>${customer.address.postalCode} ${customer.address.city}</p>
        <p>${customer.address.country}</p>
      ` : ''}
      <p style="margin-top: 10px;">${customer.email}</p>
      ${customer.kvk ? `<p>KVK: ${customer.kvk}</p>` : ''}
      ${customer.btw ? `<p>BTW: ${customer.btw}</p>` : ''}
    </div>
  </div>
  
  <div class="meta-info">
    <div class="meta-item">
      <label>Factuurdatum</label>
      <span>${formatDate(invoice.issueDate)}</span>
    </div>
    <div class="meta-item">
      <label>Vervaldatum</label>
      <span>${formatDate(invoice.dueDate)}</span>
    </div>
    <div class="meta-item">
      <label>Status</label>
      <span>${getStatusLabel(invoice.status)}</span>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th style="width: 50%">Omschrijving</th>
        <th>Aantal</th>
        <th>Prijs excl. BTW</th>
        <th>BTW</th>
        <th>Totaal</th>
      </tr>
    </thead>
    <tbody>
      ${lines.map(line => `
        <tr>
          <td>
            <div class="description">${line.description}</div>
            ${line.periodStart && line.periodEnd ? `
              <div class="period">Periode: ${formatDate(line.periodStart)} t/m ${formatDate(line.periodEnd)}</div>
            ` : ''}
          </td>
          <td>${line.quantity}</td>
          <td>${formatCurrency(line.unitPriceExclVat)}</td>
          <td>${formatPercentage(line.vatRate)}</td>
          <td>${formatCurrency(line.totalInclVat)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="totals">
    <div class="totals-row">
      <span>Subtotaal excl. BTW</span>
      <span>${formatCurrency(invoice.subtotal)}</span>
    </div>
    <div class="totals-row">
      <span>BTW (${formatPercentage(invoice.vatRate)})</span>
      <span>${formatCurrency(invoice.vatAmount)}</span>
    </div>
    <div class="totals-row total">
      <span>Totaal</span>
      <span>${formatCurrency(invoice.total)}</span>
    </div>
  </div>
  
  <div class="payment-info">
    <h4>Betaalinformatie</h4>
    <p>
      Gelieve het totaalbedrag van <strong>${formatCurrency(invoice.total)}</strong> over te maken naar:<br><br>
      <strong>IBAN:</strong> ${companyInfo.iban}<br>
      <strong>BIC:</strong> ${companyInfo.bic}<br>
      <strong>T.n.v.:</strong> ${companyInfo.legalName}<br>
      <strong>O.v.v.:</strong> ${invoice.invoiceNumber}
    </p>
  </div>
  
  <div class="footer">
    <div class="footer-grid">
      <div class="footer-col">
        <h4>Contact</h4>
        <p>${companyInfo.email}</p>
        <p>${companyInfo.phone}</p>
        <p>${companyInfo.website}</p>
      </div>
      <div class="footer-col">
        <h4>Bankgegevens</h4>
        <p>IBAN: ${companyInfo.iban}</p>
        <p>BIC: ${companyInfo.bic}</p>
      </div>
      <div class="footer-col">
        <h4>Bedrijfsgegevens</h4>
        <p>KVK: ${companyInfo.kvk}</p>
        <p>BTW: ${companyInfo.btw}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// ===========================================
// EMAIL TEMPLATES
// ===========================================

/**
 * Genereer email voor factuur verzending
 */
export function generateInvoiceEmail(invoice: Invoice): {
  subject: string
  html: string
} {
  return {
    subject: `Factuur ${invoice.invoiceNumber} - ${companyInfo.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">${companyInfo.name}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937;">Factuur ${invoice.invoiceNumber}</h2>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Beste ${invoice.customer.name},
              </p>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Hierbij ontvang je de factuur voor je ${companyInfo.name} abonnement.
              </p>
              
              <!-- Invoice Summary -->
              <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <table width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Factuurnummer</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${invoice.invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Factuurdatum</td>
                    <td style="padding: 8px 0; text-align: right;">${formatDate(invoice.issueDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Vervaldatum</td>
                    <td style="padding: 8px 0; text-align: right;">${formatDate(invoice.dueDate)}</td>
                  </tr>
                  <tr style="border-top: 2px solid #e5e7eb;">
                    <td style="padding: 16px 0 8px 0; color: #1f2937; font-weight: 600; font-size: 18px;">Totaal</td>
                    <td style="padding: 16px 0 8px 0; text-align: right; font-weight: 700; font-size: 18px; color: #2563eb;">${formatCurrency(invoice.total)}</td>
                  </tr>
                </table>
              </div>
              
              ${invoice.pdfUrl ? `
                <a href="${invoice.pdfUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
                  Download Factuur PDF
                </a>
              ` : ''}
              
              <p style="color: #4b5563; line-height: 1.6; margin-top: 24px;">
                ${invoice.mollieSubscriptionId 
                  ? 'Dit bedrag wordt automatisch geïncasseerd van je rekening.'
                  : `Gelieve het bedrag binnen ${companyInfo.paymentTermDays} dagen over te maken naar ${companyInfo.iban} o.v.v. ${invoice.invoiceNumber}.`
                }
              </p>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Heb je vragen over deze factuur? Neem gerust contact met ons op.
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin-top: 24px;">
                Met vriendelijke groet,<br>
                <strong>Team ${companyInfo.name}</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                ${companyInfo.legalName} | KVK: ${companyInfo.kvk} | BTW: ${companyInfo.btw}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                ${companyInfo.address.street}, ${companyInfo.address.postalCode} ${companyInfo.address.city}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()
  }
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatPeriod(start: Date, _end: Date): string {
  void _end // Niet gebruikt in huidige implementatie
  return `${start.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}`
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(0)}%`
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Concept',
    sent: 'Verzonden',
    paid: 'Betaald',
    overdue: 'Te laat',
    cancelled: 'Geannuleerd',
    refunded: 'Terugbetaald'
  }
  return labels[status] || status
}
