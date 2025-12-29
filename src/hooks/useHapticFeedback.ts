/**
 * useHapticFeedback - Trigger device vibration for tactile feedback
 * 
 * Provides haptic feedback on supported devices for:
 * - Success actions (approve, submit)
 * - Selection changes (rating, toggle)
 * - Error feedback
 * - Navigation
 */

import { useCallback } from 'react'

type HapticType = 'success' | 'selection' | 'error' | 'light' | 'medium' | 'heavy'

interface HapticPatterns {
  success: number[]
  selection: number[]
  error: number[]
  light: number[]
  medium: number[]
  heavy: number[]
}

const HAPTIC_PATTERNS: HapticPatterns = {
  success: [50, 50, 100],      // Short-pause-longer
  selection: [10],              // Quick tap
  error: [100, 50, 100, 50, 100], // Three quick vibrations
  light: [5],                   // Barely noticeable
  medium: [25],                 // Normal feedback
  heavy: [50]                   // Strong feedback
}

interface UseHapticFeedbackOptions {
  /** Enable/disable haptics globally */
  enabled?: boolean
}

interface UseHapticFeedbackReturn {
  /** Trigger haptic feedback */
  trigger: (type?: HapticType) => void
  /** Check if haptics are supported */
  isSupported: boolean
  /** Trigger on success (approve, submit) */
  success: () => void
  /** Trigger on selection change */
  selection: () => void
  /** Trigger on error */
  error: () => void
  /** Light tap */
  light: () => void
  /** Medium tap */
  medium: () => void
  /** Heavy tap */
  heavy: () => void
}

export function useHapticFeedback(
  options: UseHapticFeedbackOptions = {}
): UseHapticFeedbackReturn {
  const { enabled = true } = options
  
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator
  
  const trigger = useCallback((type: HapticType = 'selection') => {
    if (!enabled || !isSupported) return
    
    try {
      const pattern = HAPTIC_PATTERNS[type]
      navigator.vibrate(pattern)
    } catch {
      // Silently fail if vibration is not allowed
    }
  }, [enabled, isSupported])
  
  const success = useCallback(() => trigger('success'), [trigger])
  const selection = useCallback(() => trigger('selection'), [trigger])
  const error = useCallback(() => trigger('error'), [trigger])
  const light = useCallback(() => trigger('light'), [trigger])
  const medium = useCallback(() => trigger('medium'), [trigger])
  const heavy = useCallback(() => trigger('heavy'), [trigger])
  
  return {
    trigger,
    isSupported,
    success,
    selection,
    error,
    light,
    medium,
    heavy
  }
}

export default useHapticFeedback
