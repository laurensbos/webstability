import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const whatsappLink = 'https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20een%20vraag%20over%20jullie%20diensten.'

  useEffect(() => {
    // Show button after scrolling past hero or after 3 seconds
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    // Also show after 3 seconds regardless of scroll
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  // Show tooltip after button is visible for 2 seconds (only once)
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const timer = setTimeout(() => {
        setShowTooltip(true)
        // Hide tooltip after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isExpanded])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
          {/* Tooltip/expanded message */}
          <AnimatePresence>
            {(showTooltip || isExpanded) && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-[280px]"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Webstability</p>
                      <p className="text-green-600 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Online nu
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsExpanded(false)
                      setShowTooltip(false)
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  👋 Hallo! Heb je een vraag? We reageren meestal binnen een paar minuten.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-center font-semibold rounded-xl transition shadow-lg shadow-green-500/25"
                >
                  Start gesprek
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 transition-all">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">1</span>
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
