import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, ArrowRight, Clock } from 'lucide-react'

export default function NewYearsDeal() {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Countdown to 31 January 2026
  useEffect(() => {
    const deadline = new Date('2026-01-31T23:59:59').getTime()

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, deadline - now)

      setTimeLeft({
        days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((remaining % (1000 * 60)) / 1000),
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm"
    >
      <div className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-primary-500/30">
        {/* Firework effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Sparkle particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: '100%',
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: Math.random() * 60 + '%',
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeOut'
              }}
            />
          ))}
          
          {/* Larger sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 40}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </motion.div>
          ))}

          {/* Gradient overlay for firework glow */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute top-4 right-1/4 w-24 h-24 bg-primary-500/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/2 w-40 h-20 bg-orange-500/20 rounded-full blur-3xl" />
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors z-20 cursor-pointer"
          aria-label="Sluiten"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1 mb-4">
            <span className="text-lg">🎆</span>
            <span className="text-yellow-300 text-xs font-semibold uppercase tracking-wide">
              Nieuwjaarsactie 2026
            </span>
          </div>

          {/* Headline */}
          <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
            Nieuwjaarskorting!
          </h3>

          {/* Deal */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 line-through text-lg">€99,-</span>
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                GRATIS
              </span>
            </div>
            <p className="text-primary-200 text-sm">
              Tijdelijk <span className="text-white font-semibold">geen opstartkosten</span> voor nieuwe klanten
            </p>
          </div>

          {/* Countdown timer */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { value: timeLeft.days, label: 'dagen' },
              { value: timeLeft.hours, label: 'uren' },
              { value: timeLeft.minutes, label: 'min' },
              { value: timeLeft.seconds, label: 'sec' },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-white font-bold text-lg sm:text-xl font-mono">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-gray-400 text-[10px] uppercase">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Timer indicator */}
          <div className="flex items-center gap-2 text-yellow-300/80 text-xs mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Geldig t/m 31 januari 2026</span>
          </div>

          {/* CTA */}
          <a
            href="/start"
            onClick={() => setIsVisible(false)}
            className="group flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/25"
          >
            Claim je korting
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Sub text */}
          <p className="text-center text-gray-400 text-xs mt-3">
            Bespaar €99,- • Direct starten mogelijk
          </p>
        </div>

        {/* Bottom firework burst decoration */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8">
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 to-transparent blur-xl" />
        </div>
      </div>
    </motion.div>
  )
}
