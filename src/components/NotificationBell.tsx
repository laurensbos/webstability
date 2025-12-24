/**
 * NotificationBell - Notificatie dropdown voor klanten
 * 
 * Toont:
 * - Unread badge
 * - Notificatie lijst
 * - Verschillende notificatie types
 * - Markeer als gelezen
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  X,
  AlertCircle,
  Info,
  Sparkles,
  MessageSquare,
  Rocket,
  ChevronRight
} from 'lucide-react'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'phase' | 'message'
  title: string
  message: string
  timestamp: string
  read: boolean
  link?: string
  linkLabel?: string
}

interface NotificationBellProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onNotificationClick?: (notification: Notification) => void
  darkMode?: boolean
}

export default function NotificationBell({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  darkMode = true
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Zojuist'
    if (diffMins < 60) return `${diffMins} min geleden`
    if (diffHours < 24) return `${diffHours} uur geleden`
    if (diffDays < 7) return `${diffDays} dagen geleden`
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  }

  // Get icon for notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Sparkles className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />
      case 'phase':
        return <Rocket className="w-4 h-4 text-blue-500" />
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  // Get background color for notification type
  const getNotificationBg = (type: Notification['type'], read: boolean) => {
    if (read) return darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
    
    switch (type) {
      case 'success':
        return darkMode ? 'bg-green-500/10' : 'bg-green-50'
      case 'warning':
        return darkMode ? 'bg-amber-500/10' : 'bg-amber-50'
      case 'phase':
        return darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
      case 'message':
        return darkMode ? 'bg-purple-500/10' : 'bg-purple-50'
      default:
        return darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
    if (notification.link) {
      setIsOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-colors ${
          darkMode 
            ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
        }`}
      >
        <Bell className="w-5 h-5" />
        
        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-xl overflow-hidden z-50 ${
              darkMode 
                ? 'bg-gray-900 border border-gray-800' 
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notificaties
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                        darkMode 
                          ? 'text-blue-400 hover:bg-blue-500/10' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Alles gelezen
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-1 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className={`p-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Bell className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Geen notificaties</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifications.map((notification, index) => (
                    <motion.button
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        getNotificationBg(notification.type, notification.read)
                      } ${
                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium text-sm truncate ${
                              notification.read
                                ? darkMode ? 'text-gray-400' : 'text-gray-600'
                                : darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-sm mt-0.5 line-clamp-2 ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.link && (
                              <span className={`text-xs font-medium flex items-center gap-1 ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                {notification.linkLabel || 'Bekijken'}
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 5 && (
              <div className={`p-3 border-t text-center ${
                darkMode ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <button className={`text-sm font-medium ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}>
                  Alle notificaties bekijken
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper function to generate notifications based on project status
export function generateProjectNotifications(project: {
  status: string
  businessName: string
  designPreviewUrl?: string
  paymentStatus?: string
  createdAt?: string
  updates?: Array<{ date: string; message: string }>
}): Notification[] {
  const notifications: Notification[] = []
  const now = new Date()

  // Phase-based notifications
  switch (project.status) {
    case 'design':
      notifications.push({
        id: 'design-progress',
        type: 'info',
        title: 'Ontwerp in productie',
        message: `We werken hard aan het ontwerp voor ${project.businessName}. Je ontvangt bericht zodra de preview klaar is.`,
        timestamp: new Date(now.getTime() - 3600000).toISOString(),
        read: false
      })
      break
    
    case 'feedback':
      notifications.push({
        id: 'preview-ready',
        type: 'success',
        title: 'Preview is klaar! 🎉',
        message: 'Je website preview staat klaar om te bekijken. Geef je feedback zodat we verder kunnen.',
        timestamp: new Date(now.getTime() - 1800000).toISOString(),
        read: false,
        link: '#preview',
        linkLabel: 'Bekijk preview'
      })
      break
    
    case 'payment':
      notifications.push({
        id: 'payment-pending',
        type: 'warning',
        title: 'Betaling afronden',
        message: 'Je ontwerp is goedgekeurd! Rond de betaling af om live te gaan.',
        timestamp: new Date(now.getTime() - 900000).toISOString(),
        read: false,
        link: '#payment',
        linkLabel: 'Naar betaling'
      })
      break
    
    case 'live':
      notifications.push({
        id: 'site-live',
        type: 'success',
        title: 'Je website is live! 🚀',
        message: `Gefeliciteerd! ${project.businessName} is nu online bereikbaar.`,
        timestamp: new Date(now.getTime() - 86400000).toISOString(),
        read: true
      })
      break
  }

  // Add welcome notification
  notifications.push({
    id: 'welcome',
    type: 'info',
    title: 'Welkom bij Webstability',
    message: 'Bedankt voor je aanmelding! We gaan aan de slag met je website.',
    timestamp: project.createdAt || new Date(now.getTime() - 172800000).toISOString(),
    read: true
  })

  return notifications.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}
