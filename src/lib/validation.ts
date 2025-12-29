/**
 * Validation Utilities - Webstability
 * 
 * Common validation functions for forms
 */

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate Dutch phone number
 * Accepts formats: 0612345678, 06 12 34 56 78, +31612345678, +31 6 12345678
 */
export function isValidDutchPhone(phone: string): boolean {
  // Remove all spaces, dashes and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  // Dutch mobile: 06xxxxxxxx or +316xxxxxxxx
  const mobileRegex = /^(0|\+31|0031)6\d{8}$/
  
  // Dutch landline: 0xx-xxxxxxx or +31xx-xxxxxxx (various formats)
  const landlineRegex = /^(0|\+31|0031)[1-9]\d{8,9}$/
  
  return mobileRegex.test(cleaned) || landlineRegex.test(cleaned)
}

/**
 * Validate international phone number (basic check)
 */
export function isValidPhone(phone: string): boolean {
  // Remove all spaces, dashes and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  // At least 8 digits, optionally starting with +
  const phoneRegex = /^\+?\d{8,15}$/
  
  return phoneRegex.test(cleaned)
}

/**
 * Format Dutch phone number to standard format
 */
export function formatDutchPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  // Convert +31 to 0
  let formatted = cleaned.replace(/^\+31/, '0').replace(/^0031/, '0')
  
  // Format as 06 12 34 56 78
  if (formatted.length === 10 && formatted.startsWith('06')) {
    return `${formatted.slice(0, 2)} ${formatted.slice(2, 4)} ${formatted.slice(4, 6)} ${formatted.slice(6, 8)} ${formatted.slice(8, 10)}`
  }
  
  return formatted
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

/**
 * Validate KVK number (Dutch Chamber of Commerce)
 */
export function isValidKvk(kvk: string): boolean {
  const cleaned = kvk.replace(/\s/g, '')
  return /^\d{8}$/.test(cleaned)
}

/**
 * Validate BTW number (Dutch VAT)
 */
export function isValidBtw(btw: string): boolean {
  const cleaned = btw.replace(/[\s\.]/g, '').toUpperCase()
  return /^NL\d{9}B\d{2}$/.test(cleaned)
}

/**
 * Validate Dutch postal code
 */
export function isValidPostcode(postcode: string): boolean {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase()
  return /^\d{4}[A-Z]{2}$/.test(cleaned)
}

/**
 * Format Dutch postal code
 */
export function formatPostcode(postcode: string): string {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase()
  if (/^\d{4}[A-Z]{2}$/.test(cleaned)) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)}`
  }
  return postcode
}
