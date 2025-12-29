/**
 * Customer Portal - Klantendashboard
 * 
 * Volledig klantenportaal met:
 * - Overzicht actieve projecten
 * - Wijzigingen aanvragen
 * - Facturen bekijken
 * - Support & FAQ
 * - Profiel instellingen
 * - Notificaties
 * 
 * Features:
 * - Dark mode geoptimaliseerd
 * - Volledig responsive (mobile-first)
 * - Realtime updates
 * - Integratie met Developer Dashboard via API
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ChevronRight,
  Loader2,
  Sun,
  Moon,
  Home,
  Edit3,
  TrendingUp
} from 'lucide-react'
import Logo from '../../components/Logo'
import { useDarkMode } from '../../contexts/DarkModeContext'

// Types
interface CustomerSession {
  email: string
  name: string
  projectIds: string[]
  token: string
  expiresAt: string
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'action'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

interface ProjectSummary {
  projectId: string
  businessName: string
  status: string
  type: string
  package: string
  unreadMessages: number
  pendingActions: number
  liveUrl?: string
}

// Storage keys
const SESSION_KEY = 'webstability_customer_session'
const NOTIFICATIONS_KEY = 'webstability_customer_notifications'

export default function CustomerPortal() {
  const navigate = useNavigate()
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { t } = useTranslation()
  
  // Navigation items with translations
  const navItems = [
    { id: 'overview', label: t('portal.nav.overview'), icon: LayoutDashboard, path: '/portaal' },
    { id: 'projects', label: t('portal.nav.projects'), icon: FolderOpen, path: '/portaal/projecten' },
    { id: 'invoices', label: t('portal.nav.invoices'), icon: FileText, path: '/portaal/facturen' },
    { id: 'changes', label: t('portal.nav.changes'), icon: Edit3, path: '/portaal/wijzigingen' },
    { id: 'messages', label: t('portal.nav.messages'), icon: MessageSquare, path: '/portaal/berichten' },
    { id: 'analytics', label: t('portal.nav.analytics'), icon: TrendingUp, path: '/portaal/analytics' },
    { id: 'support', label: t('portal.nav.support'), icon: HelpCircle, path: '/portaal/support' },
    { id: 'settings', label: t('portal.nav.settings'), icon: Settings, path: '/portaal/instellingen' },
  ]
  
  // State
  const [session, setSession] = useState<CustomerSession | null>(null)
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  // Current active nav item
  const activeNavItem = navItems.find(item => 
    location.pathname === item.path || 
    (item.path !== '/portaal' && location.pathname.startsWith(item.path))
  ) || navItems[0]

  // Set page title
  useEffect(() => {
    document.title = `${activeNavItem.label} | ${t('login.customerPortal.title')} - Webstability`
  }, [activeNavItem.label, t])

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedSession = sessionStorage.getItem(SESSION_KEY)
        
        if (storedSession) {
          const parsed = JSON.parse(storedSession) as CustomerSession
          
          // Check if session is expired
          if (new Date(parsed.expiresAt) > new Date()) {
            setSession(parsed)
            await fetchProjects(parsed.email)
            await fetchNotifications(parsed.email)
          } else {
            // Session expired
            sessionStorage.removeItem(SESSION_KEY)
            navigate('/portaal/login')
          }
        } else {
          navigate('/portaal/login')
        }
      } catch (error) {
        console.error('Session check error:', error)
        navigate('/portaal/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
  }, [navigate])

  // Fetch projects
  const fetchProjects = async (email: string) => {
    try {
      const response = await fetch(`/api/project-lookup?q=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.success && data.projects) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  // Fetch notifications
  const fetchNotifications = async (email: string) => {
    try {
      const response = await fetch(`/api/customer/notifications?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.success && data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      // Use stored notifications as fallback
      const stored = localStorage.getItem(NOTIFICATIONS_KEY)
      if (stored) {
        setNotifications(JSON.parse(stored))
      }
    }
  }

  // Handle logout
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(NOTIFICATIONS_KEY)
    setSession(null)
    navigate('/portaal/login')
  }, [navigate])

  // Mark notification as read
  const markNotificationRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    
    // Sync with API
    try {
      await fetch('/api/customer/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session?.email, 
          notificationId 
        })
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length
  
  // Total pending actions across all projects
  const totalPendingActions = projects.reduce((sum, p) => sum + (p.pendingActions || 0), 0)
  const totalUnreadMessages = projects.reduce((sum, p) => sum + (p.unreadMessages || 0), 0)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Laden...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!session) {
    return null
  }

  return (
    <>
      {/* SEO Meta Tags - set via document.title for now */}
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 z-50 h-full w-72 
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <Logo variant={darkMode ? 'white' : 'default'} className="h-8" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeNavItem.id === item.id
                const Icon = item.icon
                
                // Count badges
                let badge = 0
                if (item.id === 'messages') badge = totalUnreadMessages
                if (item.id === 'projects') badge = totalPendingActions
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        navigate(item.path)
                        setSidebarOpen(false)
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                        ${isActive 
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {badge > 0 && (
                        <span className={`
                          px-2 py-0.5 text-xs font-semibold rounded-full
                          ${isActive ? 'bg-white/20 text-white' : 'bg-primary-500 text-white'}
                        `}>
                          {badge}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {session.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Uitloggen</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-72">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
            <div className="h-full flex items-center justify-between px-4 lg:px-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Page Title */}
              <div className="hidden lg:flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-400" />
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {activeNavItem.label}
                </span>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications)
                      setShowUserMenu(false)
                    }}
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{t('portal.notifications')}</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">{t('portal.noNotifications')}</p>
                            </div>
                          ) : (
                            notifications.slice(0, 10).map((notification) => (
                              <button
                                key={notification.id}
                                onClick={() => {
                                  markNotificationRead(notification.id)
                                  if (notification.link) {
                                    navigate(notification.link)
                                  }
                                  setShowNotifications(false)
                                }}
                                className={`
                                  w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition
                                  ${!notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                                `}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`
                                    w-2 h-2 rounded-full mt-2 flex-shrink-0
                                    ${notification.type === 'success' ? 'bg-green-500' : ''}
                                    ${notification.type === 'warning' ? 'bg-yellow-500' : ''}
                                    ${notification.type === 'action' ? 'bg-blue-500' : ''}
                                    ${notification.type === 'info' ? 'bg-gray-400' : ''}
                                  `} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      {new Date(notification.createdAt).toLocaleDateString('nl-NL', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => {
                                navigate('/portaal/notificaties')
                                setShowNotifications(false)
                              }}
                              className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              {t('portal.viewAllNotifications')}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu (Mobile) */}
                <div className="relative lg:hidden">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu)
                      setShowNotifications(false)
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-900 dark:text-white">{session.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{session.email}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => {
                              navigate('/portaal/instellingen')
                              setShowUserMenu(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                          >
                            <Settings className="w-4 h-4" />
                            {t('portal.nav.settings')}
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            <LogOut className="w-4 h-4" />
                            {t('portal.logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-8">
            <Outlet context={{ session, projects, notifications, fetchProjects }} />
          </main>
        </div>

        {/* Click outside to close dropdowns */}
        {(showNotifications || showUserMenu) && (
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => {
              setShowNotifications(false)
              setShowUserMenu(false)
            }}
          />
        )}
      </div>
    </>
  )
}

// Export context hook for child pages
export function useCustomerPortal() {
  // This would use React Router's useOutletContext
  // For now, return a placeholder
  return {
    session: null as CustomerSession | null,
    projects: [] as ProjectSummary[],
    notifications: [] as Notification[],
    fetchProjects: async () => {}
  }
}
