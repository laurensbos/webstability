import { useEffect, useRef, useState } from 'react'

interface AutoScrollCarouselProps {
  children: React.ReactNode
  className?: string
  speed?: number // pixels per second
  pauseOnHover?: boolean
}

export default function AutoScrollCarousel({ 
  children, 
  className = '',
  speed = 30, // slow, luxurious speed
  pauseOnHover = true 
}: AutoScrollCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const userScrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let lastTime = 0

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      if (!isPaused && !isUserScrolling) {
        const scrollAmount = (speed * deltaTime) / 1000

        // Check if we've reached the end
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
        
        if (scrollContainer.scrollLeft >= maxScroll - 1) {
          // Smoothly reset to beginning
          scrollContainer.scrollLeft = 0
        } else {
          scrollContainer.scrollLeft += scrollAmount
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPaused, isUserScrolling, speed])

  const handleTouchStart = () => {
    setIsUserScrolling(true)
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current)
    }
  }

  const handleTouchEnd = () => {
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 3000) // Resume after 3 seconds of no interaction
  }

  const handleScroll = () => {
    setIsUserScrolling(true)
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current)
    }
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 3000)
  }

  return (
    <div
      ref={scrollRef}
      className={`overflow-x-auto scrollbar-hide ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onScroll={handleScroll}
    >
      {children}
    </div>
  )
}
