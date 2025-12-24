/**
 * Pull to Refresh Component
 * 
 * Mobile-friendly pull-to-refresh functionality
 * Shows a loading indicator when pulling down from top of page
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ArrowDown } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  disabled?: boolean
  threshold?: number
  darkMode?: boolean
}

export default function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
  threshold = 80,
  darkMode = true
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const isPullingRef = useRef(false)

  const progress = Math.min(pullDistance / threshold, 1)
  const shouldRefresh = pullDistance >= threshold

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return
    if (window.scrollY > 0) return // Only work at top of page
    
    startYRef.current = e.touches[0].clientY
    isPullingRef.current = true
    setIsPulling(true)
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPullingRef.current || disabled || isRefreshing) return
    if (window.scrollY > 0) {
      setPullDistance(0)
      return
    }

    const currentY = e.touches[0].clientY
    const diff = currentY - startYRef.current

    if (diff > 0) {
      // Prevent default scroll when pulling
      e.preventDefault()
      // Apply resistance to pull
      const resistance = 0.5
      setPullDistance(diff * resistance)
    }
  }, [disabled, isRefreshing])

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) return
    
    isPullingRef.current = false
    setIsPulling(false)

    if (shouldRefresh && !isRefreshing && !disabled) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [shouldRefresh, isRefreshing, disabled, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Use passive: false to be able to preventDefault
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <AnimatePresence>
        {(pullDistance > 10 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ 
              opacity: 1, 
              y: Math.min(pullDistance - 20, threshold - 20)
            }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed left-1/2 -translate-x-1/2 z-50 top-4"
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
              darkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}>
              {isRefreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw className={`w-5 h-5 ${
                    darkMode ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                </motion.div>
              ) : shouldRefresh ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <ArrowDown className={`w-5 h-5 ${
                    darkMode ? 'text-green-400' : 'text-green-500'
                  }`} />
                </motion.div>
              ) : (
                <motion.div
                  style={{ rotate: progress * 180 }}
                >
                  <ArrowDown className={`w-5 h-5 transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading bar at top */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
          />
        )}
      </AnimatePresence>

      {/* Pull hint text */}
      <AnimatePresence>
        {isPulling && pullDistance > 20 && !isRefreshing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className={`fixed left-1/2 -translate-x-1/2 top-16 text-xs font-medium z-50 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {shouldRefresh ? 'Loslaten om te verversen' : 'Trek naar beneden om te verversen'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        animate={{ 
          y: isPulling || isRefreshing ? Math.min(pullDistance * 0.3, 30) : 0 
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Simple hook for manual refresh trigger
 */
export function useRefresh(fetchFn: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchFn()
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchFn])

  return { isRefreshing, refresh }
}
