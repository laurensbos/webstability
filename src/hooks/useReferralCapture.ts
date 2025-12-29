import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const REFERRAL_STORAGE_KEY = 'webstability_referral'
const REFERRAL_EXPIRY_DAYS = 30

interface ReferralData {
  code: string
  capturedAt: string
  expiresAt: string
  landingPage: string
}

/**
 * Hook that captures referral codes from URL parameters.
 * When a visitor arrives via a link like /?ref=LISS-1234, this hook:
 * 1. Extracts the referral code from the URL
 * 2. Validates it with the API (optional)
 * 3. Stores it in localStorage with expiry date
 * 
 * The stored referral code is then used during checkout/onboarding
 * to attribute the referral and apply any discounts.
 */
export function useReferralCapture() {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const refCode = searchParams.get('ref')
    
    if (refCode) {
      captureReferral(refCode)
      
      // Remove the ref parameter from URL (cleaner URL)
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('ref')
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams])
}

/**
 * Capture and store referral code
 */
export function captureReferral(code: string): void {
  const normalizedCode = code.toUpperCase().trim()
  
  if (!normalizedCode) return
  
  // Check if we already have a referral stored
  const existingReferral = getReferral()
  
  // Only overwrite if no existing referral or if expired
  if (existingReferral && new Date(existingReferral.expiresAt) > new Date()) {
    console.log('[Referral] Already have valid referral:', existingReferral.code)
    return
  }
  
  const now = new Date()
  const expiryDate = new Date(now)
  expiryDate.setDate(expiryDate.getDate() + REFERRAL_EXPIRY_DAYS)
  
  const referralData: ReferralData = {
    code: normalizedCode,
    capturedAt: now.toISOString(),
    expiresAt: expiryDate.toISOString(),
    landingPage: window.location.pathname
  }
  
  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(referralData))
    console.log('[Referral] Captured referral code:', normalizedCode)
    
    // Optional: validate referral code with API
    validateReferralCode(normalizedCode)
  } catch (error) {
    console.error('[Referral] Failed to store referral:', error)
  }
}

/**
 * Get stored referral code (if valid)
 */
export function getReferral(): ReferralData | null {
  try {
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY)
    if (!stored) return null
    
    const data = JSON.parse(stored) as ReferralData
    
    // Check if expired
    if (new Date(data.expiresAt) < new Date()) {
      clearReferral()
      return null
    }
    
    return data
  } catch {
    return null
  }
}

/**
 * Get just the referral code string (for forms)
 */
export function getReferralCode(): string | null {
  const referral = getReferral()
  return referral?.code || null
}

/**
 * Clear stored referral (after successful conversion)
 */
export function clearReferral(): void {
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY)
    console.log('[Referral] Cleared referral data')
  } catch {
    // Ignore errors
  }
}

/**
 * Validate referral code with API (background check)
 */
async function validateReferralCode(code: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/referral?code=${encodeURIComponent(code)}`)
    const data = await response.json()
    
    if (!data.valid) {
      console.warn('[Referral] Invalid referral code:', code)
      // Optionally clear invalid codes
      // clearReferral()
      return false
    }
    
    console.log('[Referral] Valid referral from:', data.referrerName)
    return true
  } catch (error) {
    console.error('[Referral] Failed to validate:', error)
    // Keep the code anyway - validation is optional
    return true
  }
}
