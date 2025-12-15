/**
 * Utility functions voor Webstability
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names met Tailwind conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format prijs naar Nederlandse notatie
 */
export function formatPrice(price: number, decimals = 0): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price)
}

/**
 * Format datum naar Nederlandse notatie
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(d)
}

/**
 * Format relatieve tijd (bijv. "2 dagen geleden")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Vandaag'
  if (diffDays === 1) return 'Gisteren'
  if (diffDays < 7) return `${diffDays} dagen geleden`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} maanden geleden`
  return `${Math.floor(diffDays / 365)} jaar geleden`
}

/**
 * Debounce functie
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle functie
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => { inThrottle = false }, limit)
    }
  }
}

/**
 * Genereer random ID
 */
export function generateId(prefix = ''): string {
  const random = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}_${random}` : random
}

/**
 * Valideer email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valideer telefoonnummer (NL)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  const regex = /^(\+31|0031|0)[1-9][0-9]{8}$/
  return regex.test(cleaned)
}

/**
 * Truncate tekst
 */
export function truncate(text: string, length: number, suffix = '...'): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + suffix
}

/**
 * Capitalize eerste letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Slugify tekst
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Sleep/delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check of we op mobiel zijn
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * Check of we in de browser zijn
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Smooth scroll naar element
 */
export function scrollToElement(elementId: string, offset = 0): void {
  const element = document.getElementById(elementId)
  if (!element) return
  
  const top = element.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}
