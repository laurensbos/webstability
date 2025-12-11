import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false)

  const whatsappLink = 'https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20een%20vraag%20over%20een%20website.'

  useEffect(() => {
    // Show button after scrolling past hero
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat via WhatsApp"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
