import { motion } from 'framer-motion'
import { Check, CheckCircle, Sparkles, PartyPopper } from 'lucide-react'

interface SuccessAnimationProps {
  variant?: 'check' | 'checkCircle' | 'sparkle' | 'confetti'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'green' | 'blue'
  message?: string
  subMessage?: string
}

const sizeClasses = {
  sm: { icon: 'w-8 h-8', container: 'w-16 h-16', text: 'text-sm', subtext: 'text-xs' },
  md: { icon: 'w-12 h-12', container: 'w-24 h-24', text: 'text-base', subtext: 'text-sm' },
  lg: { icon: 'w-16 h-16', container: 'w-32 h-32', text: 'text-lg', subtext: 'text-base' }
}

const colorClasses = {
  primary: {
    bg: 'from-primary-400 to-primary-600',
    ring: 'border-primary-200 dark:border-primary-800',
    text: 'text-primary-600 dark:text-primary-400'
  },
  green: {
    bg: 'from-green-400 to-green-600',
    ring: 'border-green-200 dark:border-green-800',
    text: 'text-green-600 dark:text-green-400'
  },
  blue: {
    bg: 'from-blue-400 to-blue-600',
    ring: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400'
  }
}

/**
 * Animated success indicator for form submissions, completions, etc.
 */
export function SuccessAnimation({
  variant = 'checkCircle',
  size = 'md',
  color = 'green',
  message,
  subMessage
}: SuccessAnimationProps) {
  const sizes = sizeClasses[size]
  const colors = colorClasses[color]

  const Icon = {
    check: Check,
    checkCircle: CheckCircle,
    sparkle: Sparkles,
    confetti: PartyPopper
  }[variant]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center text-center"
    >
      {/* Animated rings */}
      <div className="relative">
        {/* Outer ring - expands */}
        <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`absolute inset-0 ${sizes.container} rounded-full border-4 ${colors.ring}`}
        />
        
        {/* Second ring - delayed */}
        <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className={`absolute inset-0 ${sizes.container} rounded-full border-2 ${colors.ring}`}
        />

        {/* Main circle with icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.1 
          }}
          className={`relative ${sizes.container} rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg`}
        >
          {/* Checkmark animation */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
              delay: 0.3
            }}
          >
            <Icon className={`${sizes.icon} text-white`} strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        {/* Sparkles */}
        {variant === 'sparkle' || variant === 'confetti' ? (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1 
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos((i / 6) * Math.PI * 2) * 60,
                  y: Math.sin((i / 6) * Math.PI * 2) * 60,
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.3 + i * 0.05,
                  ease: 'easeOut'
                }}
                className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gradient-to-br ${colors.bg}`}
                style={{ marginTop: -4, marginLeft: -4 }}
              />
            ))}
          </>
        ) : null}
      </div>

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-4 font-semibold ${colors.text} ${sizes.text}`}
        >
          {message}
        </motion.p>
      )}

      {subMessage && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`mt-1 text-gray-500 dark:text-gray-400 ${sizes.subtext}`}
        >
          {subMessage}
        </motion.p>
      )}
    </motion.div>
  )
}

/**
 * Simple inline success checkmark
 */
export function InlineSuccess({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 ${className}`}
    >
      <motion.svg
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-3 h-3 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path d="M5 13l4 4L19 7" />
      </motion.svg>
    </motion.div>
  )
}

/**
 * Loading → Success transition component
 */
export function LoadingSuccess({ 
  isLoading, 
  isSuccess,
  loadingText = 'Laden...',
  successText = 'Gelukt!'
}: { 
  isLoading: boolean
  isSuccess: boolean
  loadingText?: string
  successText?: string
}) {
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-green-600 dark:text-green-400"
      >
        <InlineSuccess />
        <span className="font-medium">{successText}</span>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full"
        />
        <span>{loadingText}</span>
      </div>
    )
  }

  return null
}

export default SuccessAnimation
