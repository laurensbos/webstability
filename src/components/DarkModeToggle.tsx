/**
 * Animated Dark Mode Toggle
 * 
 * A beautiful animated toggle switch for dark/light mode
 * Features smooth sun/moon transitions and color shifts
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'

interface DarkModeToggleProps {
  darkMode: boolean
  onToggle: () => void
  showLabel?: boolean
  showSystemOption?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function DarkModeToggle({
  darkMode,
  onToggle,
  showLabel = false,
  size = 'md',
  className = ''
}: DarkModeToggleProps) {
  const sizes = {
    sm: {
      toggle: 'w-12 h-6',
      circle: 'w-5 h-5',
      icon: 'w-3 h-3',
      translate: 'translate-x-6'
    },
    md: {
      toggle: 'w-14 h-7',
      circle: 'w-6 h-6',
      icon: 'w-3.5 h-3.5',
      translate: 'translate-x-7'
    },
    lg: {
      toggle: 'w-16 h-8',
      circle: 'w-7 h-7',
      icon: 'w-4 h-4',
      translate: 'translate-x-8'
    }
  }

  const s = sizes[size]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {darkMode ? 'Donker' : 'Licht'}
        </span>
      )}
      
      <button
        onClick={onToggle}
        className={`relative ${s.toggle} rounded-full transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          darkMode
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 focus:ring-purple-500'
            : 'bg-gradient-to-r from-amber-400 to-orange-400 focus:ring-amber-500'
        } ${darkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
        aria-label={darkMode ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
      >
        {/* Background stars (visible in dark mode) */}
        <AnimatePresence>
          {darkMode && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-2.5 left-4 w-0.5 h-0.5 bg-white/70 rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.15 }}
                className="absolute bottom-1.5 left-3 w-0.5 h-0.5 bg-white/50 rounded-full"
              />
            </>
          )}
        </AnimatePresence>

        {/* Background clouds (visible in light mode) */}
        <AnimatePresence>
          {!darkMode && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.6, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: 0.1 }}
                className="absolute top-1.5 right-2 w-2 h-1 bg-white rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.4, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-1.5 right-3 w-1.5 h-0.5 bg-white rounded-full"
              />
            </>
          )}
        </AnimatePresence>

        {/* Toggle circle with icon */}
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}
          className={`absolute top-0.5 left-0.5 ${s.circle} rounded-full flex items-center justify-center ${
            darkMode
              ? `${s.translate} bg-gray-900`
              : 'translate-x-0 bg-white'
          } shadow-lg`}
        >
          <AnimatePresence mode="wait">
            {darkMode ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className={`${s.icon} text-purple-300`} />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className={`${s.icon} text-amber-500`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>
    </div>
  )
}

/**
 * Icon-only dark mode button for toolbars
 */
interface DarkModeButtonProps {
  darkMode: boolean
  onToggle: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DarkModeButton({
  darkMode,
  onToggle,
  size = 'md',
  className = ''
}: DarkModeButtonProps) {
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative rounded-xl transition-colors ${sizes[size]} ${
        darkMode
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      } ${className}`}
      aria-label={darkMode ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
    >
      <AnimatePresence mode="wait">
        {darkMode ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Moon className={iconSizes[size]} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Sun className={iconSizes[size]} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/**
 * Theme selector with system option
 */
interface ThemeSelectorProps {
  theme: 'light' | 'dark' | 'system'
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void
  darkMode?: boolean
}

export function ThemeSelector({
  theme,
  onThemeChange,
  darkMode = true
}: ThemeSelectorProps) {
  const options: { value: 'light' | 'dark' | 'system'; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Licht' },
    { value: 'dark', icon: Moon, label: 'Donker' },
    { value: 'system', icon: Monitor, label: 'Systeem' }
  ]

  return (
    <div className={`flex p-1 rounded-xl ${
      darkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      {options.map((option) => {
        const Icon = option.icon
        const isActive = theme === option.value

        return (
          <button
            key={option.value}
            onClick={() => onThemeChange(option.value)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? darkMode
                  ? 'text-white'
                  : 'text-gray-900'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className={`absolute inset-0 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'
                }`}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="w-4 h-4" />
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
