/**
 * useSwipeNavigation - Handle swipe gestures for step/section navigation
 * 
 * Features:
 * - Left/right swipe detection
 * - Configurable threshold
 * - Velocity-based detection
 * - Prevents accidental triggers
 */

import { useCallback, useRef } from 'react'

interface SwipeState {
  startX: number
  startY: number
  startTime: number
}

interface UseSwipeNavigationOptions {
  /** Minimum distance in px to trigger swipe (default: 50) */
  threshold?: number
  /** Maximum vertical movement allowed (default: 100) */
  maxVerticalMovement?: number
  /** Minimum velocity in px/ms (default: 0.3) */
  minVelocity?: number
  /** Enable/disable swipe */
  enabled?: boolean
  /** Callback for swipe left (next) */
  onSwipeLeft?: () => void
  /** Callback for swipe right (previous) */
  onSwipeRight?: () => void
}

interface UseSwipeNavigationReturn {
  /** Touch handlers to spread on the container */
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
  }
}

export function useSwipeNavigation({
  threshold = 50,
  maxVerticalMovement = 100,
  minVelocity = 0.3,
  enabled = true,
  onSwipeLeft,
  onSwipeRight
}: UseSwipeNavigationOptions = {}): UseSwipeNavigationReturn {
  const swipeRef = useRef<SwipeState | null>(null)
  
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled) return
    
    const touch = e.touches[0]
    swipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    }
  }, [enabled])
  
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enabled || !swipeRef.current) return
    
    const touch = e.changedTouches[0]
    const { startX, startY, startTime } = swipeRef.current
    
    const deltaX = touch.clientX - startX
    const deltaY = Math.abs(touch.clientY - startY)
    const deltaTime = Date.now() - startTime
    const velocity = Math.abs(deltaX) / deltaTime
    
    // Reset
    swipeRef.current = null
    
    // Check constraints
    if (deltaY > maxVerticalMovement) return // Too much vertical movement
    if (Math.abs(deltaX) < threshold) return // Not enough horizontal movement
    if (velocity < minVelocity) return // Too slow
    
    // Determine direction
    if (deltaX < 0) {
      // Swipe left = next
      onSwipeLeft?.()
    } else {
      // Swipe right = previous
      onSwipeRight?.()
    }
  }, [enabled, threshold, maxVerticalMovement, minVelocity, onSwipeLeft, onSwipeRight])
  
  return {
    handlers: {
      onTouchStart,
      onTouchEnd
    }
  }
}

export default useSwipeNavigation
