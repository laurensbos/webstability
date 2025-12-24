/**
 * Keyboard Shortcuts Hook
 * 
 * Global keyboard shortcuts for power users
 * Shows a shortcuts modal on '?' key
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Keyboard, 
  X, 
  MessageSquare, 
  FolderOpen, 
  HelpCircle,
  Moon,
  Search,
  ArrowUp
} from 'lucide-react'

interface Shortcut {
  key: string
  description: string
  action: () => void
  icon?: React.ElementType
  category?: 'navigation' | 'actions' | 'general'
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  shortcuts?: Shortcut[]
  onOpenChat?: () => void
  onOpenDrive?: () => void
  onOpenHelp?: () => void
  onToggleDarkMode?: () => void
  onScrollToTop?: () => void
  onSearch?: () => void
}

export function useKeyboardShortcuts({
  enabled = true,
  shortcuts: customShortcuts = [],
  onOpenChat,
  onOpenDrive,
  onOpenHelp,
  onToggleDarkMode,
  onScrollToTop,
  onSearch
}: UseKeyboardShortcutsOptions = {}) {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)

  // Default shortcuts
  const defaultShortcuts: Shortcut[] = [
    {
      key: '?',
      description: 'Toon sneltoetsen',
      action: () => setShowShortcutsModal(true),
      icon: Keyboard,
      category: 'general'
    },
    {
      key: 'Escape',
      description: 'Sluit modals',
      action: () => setShowShortcutsModal(false),
      icon: X,
      category: 'general'
    },
    ...(onOpenChat ? [{
      key: 'c',
      description: 'Open chat',
      action: onOpenChat,
      icon: MessageSquare,
      category: 'navigation' as const
    }] : []),
    ...(onOpenDrive ? [{
      key: 'd',
      description: 'Open Google Drive',
      action: onOpenDrive,
      icon: FolderOpen,
      category: 'navigation' as const
    }] : []),
    ...(onOpenHelp ? [{
      key: 'h',
      description: 'Open hulpcentrum',
      action: onOpenHelp,
      icon: HelpCircle,
      category: 'navigation' as const
    }] : []),
    ...(onToggleDarkMode ? [{
      key: 'm',
      description: 'Wissel thema',
      action: onToggleDarkMode,
      icon: Moon,
      category: 'actions' as const
    }] : []),
    ...(onScrollToTop ? [{
      key: 't',
      description: 'Scroll naar boven',
      action: onScrollToTop,
      icon: ArrowUp,
      category: 'navigation' as const
    }] : []),
    ...(onSearch ? [{
      key: '/',
      description: 'Zoeken',
      action: onSearch,
      icon: Search,
      category: 'actions' as const
    }] : [])
  ]

  const allShortcuts = [...defaultShortcuts, ...customShortcuts]

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Only allow Escape in inputs
      if (event.key !== 'Escape') return
    }

    // Find matching shortcut
    const shortcut = allShortcuts.find(s => {
      if (event.key === s.key) return true
      if (s.key === '?' && event.key === '?' && event.shiftKey) return true
      return false
    })

    if (shortcut) {
      event.preventDefault()
      shortcut.action()
    }
  }, [enabled, allShortcuts])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    showShortcutsModal,
    setShowShortcutsModal,
    shortcuts: allShortcuts
  }
}

/**
 * Keyboard Shortcuts Modal
 */
interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: Shortcut[]
  darkMode?: boolean
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
  darkMode = true
}: KeyboardShortcutsModalProps) {
  const navigationShortcuts = shortcuts.filter(s => s.category === 'navigation')
  const actionShortcuts = shortcuts.filter(s => s.category === 'actions')
  const generalShortcuts = shortcuts.filter(s => s.category === 'general')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'
              }`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-4 border-b ${
                darkMode ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <Keyboard className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Sneltoetsen
                    </h2>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Navigeer sneller met je toetsenbord
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition ${
                    darkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
                {/* Navigation */}
                {navigationShortcuts.length > 0 && (
                  <ShortcutSection
                    title="Navigatie"
                    shortcuts={navigationShortcuts}
                    darkMode={darkMode}
                  />
                )}

                {/* Actions */}
                {actionShortcuts.length > 0 && (
                  <ShortcutSection
                    title="Acties"
                    shortcuts={actionShortcuts}
                    darkMode={darkMode}
                  />
                )}

                {/* General */}
                {generalShortcuts.length > 0 && (
                  <ShortcutSection
                    title="Algemeen"
                    shortcuts={generalShortcuts}
                    darkMode={darkMode}
                  />
                )}
              </div>

              {/* Footer */}
              <div className={`p-4 border-t ${
                darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Druk op <kbd className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>?</kbd> om dit venster te openen
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ShortcutSection({
  title,
  shortcuts,
  darkMode
}: {
  title: string
  shortcuts: Shortcut[]
  darkMode: boolean
}) {
  return (
    <div>
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
        darkMode ? 'text-gray-500' : 'text-gray-400'
      }`}>
        {title}
      </h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => {
          const Icon = shortcut.icon
          
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl ${
                darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <Icon className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {shortcut.description}
                </span>
              </div>
              <kbd className={`px-2 py-1 rounded-lg font-mono text-xs font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                  : 'bg-white text-gray-700 border border-gray-200 shadow-sm'
              }`}>
                {shortcut.key === ' ' ? 'Space' : shortcut.key}
              </kbd>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Small hint component to show keyboard shortcut availability
 */
export function KeyboardShortcutHint({ darkMode = true }: { darkMode?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
      className={`fixed bottom-24 md:bottom-6 left-6 px-3 py-2 rounded-xl text-xs flex items-center gap-2 ${
        darkMode 
          ? 'bg-gray-800/90 text-gray-400 border border-gray-700' 
          : 'bg-white/90 text-gray-500 border border-gray-200 shadow-sm'
      } backdrop-blur-sm`}
    >
      <Keyboard className="w-3.5 h-3.5" />
      <span>Druk <kbd className={`px-1 py-0.5 rounded font-mono ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>?</kbd> voor sneltoetsen</span>
    </motion.div>
  )
}
