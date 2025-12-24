/**
 * Centrale constanten voor Webstability
 * Alle contactgegevens en configuratie op één plek
 */

// Contact informatie
export const CONTACT = {
  WHATSAPP_NUMBER: '31644712573',
  WHATSAPP_DISPLAY: '06-44712573',
  EMAIL: 'info@webstability.nl',
  PHONE: '+31 6 44712573',
} as const

// WhatsApp links
export const getWhatsAppLink = (message?: string) => {
  const baseUrl = `https://wa.me/${CONTACT.WHATSAPP_NUMBER}`
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`
  }
  return baseUrl
}

// Standaard WhatsApp berichten
export const WHATSAPP_MESSAGES = {
  GENERAL: 'Hoi! Ik heb een vraag over jullie diensten.',
  PROJECT: (projectId: string) => `Hoi! Vraag over project ${projectId}`,
  PAYMENT_ISSUE: 'Hoi, ik heb problemen met de betaling voor mijn website.',
  SUPPORT: 'Hoi! Ik heb een vraag over mijn website.',
} as const

// Website URLs
export const URLS = {
  SITE: 'https://webstability.nl',
  DOMAIN: 'webstability.nl',
} as const

// Bedrijfsgegevens
export const COMPANY = {
  NAME: 'Webstability',
  LEGAL_NAME: 'Webstability',
  TAGLINE: 'Professionele websites voor ondernemers',
  DESCRIPTION: 'Wij bouwen professionele websites voor ondernemers. Geen gedoe, gewoon een mooie website die werkt.',
} as const

// Social Media
export const SOCIAL = {
  INSTAGRAM: 'https://instagram.com/webstability',
  LINKEDIN: 'https://linkedin.com/company/webstability',
  FACEBOOK: 'https://facebook.com/webstability',
} as const
