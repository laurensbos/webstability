/**
 * Mobile Bottom Navigation
 * 
 * A fixed bottom navigation bar for mobile devices
 * Provides quick access to key actions
 */

import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  MessageSquare,
  FileText,
  HelpCircle,
  User,
  type LucideIcon
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  onClick: () => void
  badge?: number
  active?: boolean
}

interface MobileBottomNavProps {
  items?: NavItem[]
  onHome?: () => void
  onChat?: () => void
  onDocs?: () => void
  onHelp?: () => void
  onAccount?: () => void
  unreadMessages?: number
  activeTab?: string
  darkMode?: boolean
}

export default function MobileBottomNav({
  items,
  onHome,
  onChat,
  onDocs,
  onHelp,
  onAccount,
  unreadMessages = 0,
  activeTab = 'home',
  darkMode = true
}: MobileBottomNavProps) {
  // Default navigation items if none provided
  const defaultItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      onClick: onHome || (() => {}),
      active: activeTab === 'home'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      onClick: onChat || (() => {}),
      badge: unreadMessages,
      active: activeTab === 'chat'
    },
    {
      id: 'docs',
      label: 'Bestanden',
      icon: FileText,
      onClick: onDocs || (() => {}),
      active: activeTab === 'docs'
    },
    {
      id: 'help',
      label: 'Hulp',
      icon: HelpCircle,
      onClick: onHelp || (() => {}),
      active: activeTab === 'help'
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      onClick: onAccount || (() => {}),
      active: activeTab === 'account'
    }
  ]

  const navItems = items || defaultItems

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className="h-20 md:hidden" />
      
      {/* Bottom Navigation Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`fixed bottom-0 left-0 right-0 z-40 md:hidden ${
          darkMode
            ? 'bg-gray-900/95 border-t border-gray-800'
            : 'bg-white/95 border-t border-gray-200'
        } backdrop-blur-xl safe-area-inset-bottom`}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors ${
                  item.active
                    ? darkMode
                      ? 'text-white'
                      : 'text-blue-600'
                    : darkMode
                      ? 'text-gray-500 hover:text-gray-300'
                      : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {item.active && (
                    <motion.div
                      layoutId="activeTab"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${
                        darkMode
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-blue-500'
                      }`}
                    />
                  )}
                </AnimatePresence>

                {/* Icon with badge */}
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${
                    item.active ? 'scale-110' : ''
                  }`} />
                  
                  {/* Badge */}
                  <AnimatePresence>
                    {item.badge && item.badge > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Label */}
                <span className={`mt-1 text-[10px] font-medium truncate max-w-[56px] ${
                  item.active ? 'opacity-100' : 'opacity-70'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </motion.nav>
    </>
  )
}

/**
 * Custom hook for mobile bottom nav state
 */
export function useMobileNav() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    scrollToTop
  }
}
