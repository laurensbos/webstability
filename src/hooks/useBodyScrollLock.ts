import { useEffect, useRef } from 'react'

/**
 * Hook to properly lock body scroll when modals are open
 * Fixes iOS Safari scroll issues where background content scrolls
 */
export function useBodyScrollLock(isLocked: boolean) {
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!isLocked) return

    // Store current scroll position
    scrollYRef.current = window.scrollY

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    // Apply styles to body
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
    }

    // Lock body scroll - works on iOS Safari
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    
    // Compensate for scrollbar width
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // Cleanup
    return () => {
      document.body.style.overflow = originalStyle.overflow
      document.body.style.position = originalStyle.position
      document.body.style.top = originalStyle.top
      document.body.style.left = originalStyle.left
      document.body.style.right = originalStyle.right
      document.body.style.width = originalStyle.width
      document.body.style.paddingRight = originalStyle.paddingRight

      // Restore scroll position
      window.scrollTo(0, scrollYRef.current)
    }
  }, [isLocked])
}

/**
 * Prevents touch scroll propagation in modal containers
 * Call this in your scrollable modal content div's onTouchMove
 */
export function preventScrollPropagation(e: React.TouchEvent<HTMLDivElement>) {
  e.stopPropagation()
}

export default useBodyScrollLock
