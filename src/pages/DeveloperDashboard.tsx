import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  User,
  UserPlus,
  MessageSquare,
  FolderKanban,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
  ChevronRight,
  Plus,
  HelpCircle,
  Briefcase,
  FileText,
  Link2,
  TrendingUp,
  Clock,
  CheckCircle2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Rocket,
  Loader2,
  Lock,
  Wallet,
  TrendingDown,
  Palette,
  Code,
  Eye,
  Camera,
  Plane,
  PenTool,
  Calendar,
  ExternalLink,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Globe,
  Send,
  RefreshCw,
  ArrowRight,
  Copy,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import Logo from '../components/Logo'

// ===========================================
// TYPES
// ===========================================

type DashboardView = 
  | 'overview' 
  | 'projects' 
  | 'clients' 
  | 'messages' 
  | 'onboarding'
  | 'payments' 
  | 'services' 
  | 'settings'

type ProjectPhase = 'onboarding' | 'design' | 'development' | 'review' | 'live'
type PaymentStatus = 'pending' | 'awaiting_payment' | 'paid' | 'failed' | 'refunded'
type ServiceType = 'drone' | 'logo' | 'foto' | 'tekst' | 'seo'

interface Project {
  id: string
  projectId: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  package: 'starter' | 'professional' | 'business' | 'webshop'
  phase: ProjectPhase
  paymentStatus: PaymentStatus
  paymentUrl?: string
  mollieCustomerId?: string
  createdAt: string
  updatedAt: string
  estimatedCompletion?: string
  stagingUrl?: string
  liveUrl?: string
  designApproved?: boolean
  designApprovedAt?: string
  messages: ChatMessage[]
  onboardingData?: Record<string, any>
  discountCode?: string
  internalNotes?: string
  phaseChecklist?: Record<string, boolean>
}

interface ChatMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  projects: string[]
  totalSpent: number
  createdAt: string
}

interface ServiceRequest {
  id: string
  type: ServiceType
  clientName: string
  clientEmail: string
  clientPhone: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  price?: number
  createdAt: string
}

interface Notification {
  id: string
  type: 'message' | 'payment' | 'onboarding' | 'service'
  title: string
  message: string
  projectId?: string
  read: boolean
  createdAt: string
}

// ===========================================
// CONSTANTS
// ===========================================

const DEV_PASSWORD = 'N45eqtu2!jz8j0v'
const AUTH_KEY = 'webstability_dev_auth'
const TOKEN_KEY = 'webstability_dev_token'
const DARK_MODE_KEY = 'webstability_dark_mode'

const PACKAGE_CONFIG = {
  starter: { name: 'Starter', price: 96, color: 'blue' },
  professional: { name: 'Professioneel', price: 180, color: 'purple' },
  business: { name: 'Business', price: 301, color: 'amber' },
  webshop: { name: 'Webshop', price: 422, color: 'emerald' },
}

const PHASE_CONFIG: Record<ProjectPhase, { label: string; color: string; bg: string; icon: typeof FileText }> = {
  onboarding: { label: 'Onboarding', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: FileText },
  design: { label: 'Design', color: 'text-amber-600', bg: 'bg-amber-100', icon: Palette },
  development: { label: 'Development', color: 'text-purple-600', bg: 'bg-purple-100', icon: Code },
  review: { label: 'Review', color: 'text-cyan-600', bg: 'bg-cyan-100', icon: Eye },
  live: { label: 'Live', color: 'text-green-600', bg: 'bg-green-100', icon: Rocket },
}

// ===========================================
// NAVIGATION CONFIG
// ===========================================

const NAV_ITEMS: { id: DashboardView; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projecten', icon: FolderKanban },
  { id: 'clients', label: 'Klanten', icon: Users },
  { id: 'messages', label: 'Berichten', icon: MessageSquare },
  { id: 'onboarding', label: 'Onboarding', icon: FileText },
  { id: 'payments', label: 'Betalingen', icon: CreditCard },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'settings', label: 'Instellingen', icon: Settings },
]

// ===========================================
// SIDEBAR COMPONENT
// ===========================================

interface SidebarProps {
  activeView: DashboardView
  setActiveView: (view: DashboardView) => void
  darkMode: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  unreadMessages: number
  pendingOnboarding: number
  onLogout: () => void
}

function Sidebar({ 
  activeView, 
  setActiveView, 
  darkMode, 
  isOpen, 
  setIsOpen,
  unreadMessages,
  pendingOnboarding,
  onLogout
}: SidebarProps) {
  const [showHelp, setShowHelp] = useState(false)
  
  const navItemsWithBadges = NAV_ITEMS.map(item => ({
    ...item,
    badge: item.id === 'messages' ? unreadMessages : 
           item.id === 'onboarding' ? pendingOnboarding : 
           undefined
  }))

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto flex-shrink-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          darkMode 
            ? 'bg-gray-900 border-r border-gray-800' 
            : 'bg-white border-r border-gray-200'
        }`}
      >
        {/* Logo - clickable to go home */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <Logo variant={darkMode ? 'white' : 'default'} />
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className={`lg:hidden p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Developer Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItemsWithBadges.map((item) => {
            const isActive = activeView === item.id
            const Icon = item.icon
            
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveView(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isActive
                    ? darkMode
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} space-y-2`}>
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowHelp(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/20' 
                : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Hulp & Proces</span>
          </motion.button>
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Uitloggen</span>
          </motion.button>
        </div>
      </aside>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  📚 Hulp & Procesoverzicht
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Process Steps */}
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    <span className="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">1</span>
                    Onboarding
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Nieuwe klant meldt zich aan via de website. Je ontvangt de bedrijfsgegevens, wensen en evt. logo/content.
                    Bekijk de onboarding data en neem contact op voor eventuele vragen.
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">2</span>
                    Design
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Maak het design in Figma of direct in code. Deel een preview link met de klant via berichten.
                    <strong className="block mt-1">⚠️ Betaling wordt pas verstuurd NA goedkeuring van het design!</strong>
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">3</span>
                    Development
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Bouw de website op basis van het goedgekeurde design. Zet de staging URL in het project.
                    Stuur een betaallink via "Betalingen" → klant betaalt via Mollie.
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">4</span>
                    Review
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Klant bekijkt de staging site en geeft feedback. Verwerk feedback en vraag om finale goedkeuring.
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">5</span>
                    Live
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Website gaat live! Zet de live URL in het project. Klant betaalt maandelijks via Mollie abonnement.
                  </p>
                </div>
              </div>

              {/* Quick Tips */}
              <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'border-emerald-500/30 bg-emerald-900/20' : 'border-emerald-200 bg-emerald-50'}`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  💡 Snelle tips
                </h3>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  <li>• <strong>Berichten:</strong> Direct chatten met klanten per project</li>
                  <li>• <strong>Betalingen:</strong> Genereer Mollie betaallinks, beheer kortingscodes</li>
                  <li>• <strong>Drag & drop:</strong> Sleep projecten tussen fases in Kanban view</li>
                  <li>• <strong>Sneltoetsen:</strong> D = dark mode, Escape = sluit modals</li>
                  <li>• <strong>Auto-refresh:</strong> Data ververst elke 30 seconden</li>
                </ul>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
              >
                Begrepen!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ===========================================
// HEADER COMPONENT
// ===========================================

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  onMenuClick: () => void
  notifications: Notification[]
  onMarkAllRead: () => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeView: DashboardView
  onRefresh: () => void
  isRefreshing: boolean
}

function Header({ 
  darkMode, 
  setDarkMode, 
  onMenuClick, 
  notifications,
  onMarkAllRead,
  searchTerm,
  setSearchTerm,
  activeView,
  onRefresh,
  isRefreshing,
  onNavigateToOverview
}: HeaderProps & { onNavigateToOverview?: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length
  
  const currentNav = NAV_ITEMS.find(item => item.id === activeView)

  return (
    <header className={`sticky top-0 z-30 ${
      darkMode 
        ? 'bg-gray-900/80 border-b border-gray-800' 
        : 'bg-white/80 border-b border-gray-200'
    } backdrop-blur-xl`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className={`lg:hidden p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2">
            {activeView !== 'overview' && onNavigateToOverview && (
              <>
                <button
                  onClick={onNavigateToOverview}
                  className={`hidden lg:flex items-center gap-1 text-sm font-medium ${
                    darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  } transition-colors`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overzicht</span>
                </button>
                <ChevronRight className={`hidden lg:block w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              </>
            )}
            <div className="flex items-center gap-2">
              {currentNav && (
                <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <currentNav.icon className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
              )}
              <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentNav?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            } ${isRefreshing ? 'animate-spin' : ''}`}
            title="Vernieuwen"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>

          {/* Search - Desktop */}
          <div className="hidden md:block relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoeken..."
              className={`w-48 lg:w-64 pl-10 pr-4 py-2 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500 ${
                darkMode 
                  ? 'bg-gray-800 text-white placeholder-gray-500' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl border overflow-hidden ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`flex items-center justify-between p-4 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Meldingen
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllRead}
                        className="text-sm text-emerald-500 hover:text-emerald-600"
                      >
                        Alles gelezen
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className={`p-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Geen meldingen</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map(n => (
                        <div
                          key={n.id}
                          className={`p-4 border-b last:border-0 cursor-pointer transition-colors ${
                            darkMode 
                              ? `border-gray-700 ${n.read ? '' : 'bg-gray-750'} hover:bg-gray-700`
                              : `border-gray-100 ${n.read ? '' : 'bg-emerald-50/50'} hover:bg-gray-50`
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              n.type === 'message' ? 'bg-emerald-100 text-emerald-600' :
                              n.type === 'payment' ? 'bg-green-100 text-green-600' :
                              n.type === 'onboarding' ? 'bg-purple-100 text-purple-600' :
                              'bg-amber-100 text-amber-600'
                            }`}>
                              {n.type === 'message' ? <MessageSquare className="w-4 h-4" /> :
                               n.type === 'payment' ? <CreditCard className="w-4 h-4" /> :
                               n.type === 'onboarding' ? <FileText className="w-4 h-4" /> :
                               <Briefcase className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {n.title}
                              </p>
                              <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {n.message}
                              </p>
                              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {new Date(n.createdAt).toLocaleDateString('nl-NL')}
                              </p>
                            </div>
                            {!n.read && (
                              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark mode toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </motion.button>

          {/* Help */}
          <button className={`hidden sm:flex p-2 rounded-lg ${
            darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}>
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

// ===========================================
// MOBILE BOTTOM NAVIGATION
// ===========================================

interface MobileBottomNavProps {
  activeView: DashboardView
  setActiveView: (view: DashboardView) => void
  darkMode: boolean
  unreadMessages: number
}

function MobileBottomNav({ activeView, setActiveView, darkMode, unreadMessages }: MobileBottomNavProps) {
  const mobileNavItems: { id: DashboardView; icon: typeof LayoutDashboard; label: string }[] = [
    { id: 'overview', icon: LayoutDashboard, label: 'Home' },
    { id: 'projects', icon: FolderKanban, label: 'Projecten' },
    { id: 'messages', icon: MessageSquare, label: 'Chat' },
    { id: 'settings', icon: Settings, label: 'Meer' },
  ]

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t pb-safe backdrop-blur-xl ${
      darkMode 
        ? 'bg-gray-900/95 border-gray-800' 
        : 'bg-white/95 border-gray-200'
    }`}>
      <div className="flex items-stretch h-16">
        {mobileNavItems.map(item => {
          const isActive = activeView === item.id
          const Icon = item.icon
          const showBadge = item.id === 'messages' && unreadMessages > 0

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? darkMode ? 'text-emerald-400' : 'text-emerald-600'
                  : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? '' : 'opacity-70'}`}>
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

// ===========================================
// STAT CARD COMPONENT
// ===========================================

interface StatCardProps {
  icon: typeof TrendingUp
  label: string
  value: string | number
  subValue?: string
  trend?: { value: number; positive: boolean }
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'cyan'
  darkMode: boolean
  delay?: number
}

function StatCard({ icon: Icon, label, value, subValue, trend, color, darkMode, delay = 0 }: StatCardProps) {
  const colorClasses = {
    blue: 'from-emerald-500 to-emerald-600',
    green: 'from-green-500 to-emerald-600',
    amber: 'from-amber-500 to-orange-600',
    purple: 'from-purple-500 to-violet-600',
    red: 'from-red-500 to-rose-600',
    cyan: 'from-cyan-500 to-emerald-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.positive ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
      {subValue && (
        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subValue}</div>
      )}
    </motion.div>
  )
}

// ===========================================
// LOGIN SCREEN
// ===========================================

interface LoginScreenProps {
  onLogin: (password: string) => Promise<boolean>
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const success = await onLogin(password)
    if (!success) {
      setError('Onjuist wachtwoord')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <Logo variant="white" size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Developer Dashboard</h1>
          <p className="text-emerald-200 mt-1">Log in om door te gaan</p>
        </motion.div>

        {/* Login form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-emerald-100 mb-2">
              Wachtwoord
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••••••"
                autoFocus
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Bezig...
              </>
            ) : (
              'Inloggen'
            )}
          </motion.button>
        </motion.form>

        <p className="text-center text-emerald-300/60 text-sm mt-6">
          © {new Date().getFullYear()} Webstability
        </p>
      </motion.div>
    </div>
  )
}

// ===========================================
// OVERVIEW VIEW - UITGEBREID
// ===========================================

interface OverviewViewProps {
  darkMode: boolean
  projects: Project[]
  clients: Client[]
  serviceRequests: ServiceRequest[]
  setActiveView: (view: DashboardView) => void
  onSelectProject: (project: Project) => void
  onUpdateProject: (project: Project) => Promise<void>
}

function OverviewView({ darkMode, projects, clients, serviceRequests, setActiveView, onSelectProject, onUpdateProject }: OverviewViewProps) {
  const [goingLive, setGoingLive] = useState<string | null>(null)
  
  const handleGoLive = async (project: Project) => {
    setGoingLive(project.id)
    try {
      await onUpdateProject({ ...project, phase: 'live' })
    } catch (error) {
      console.error('Error setting project live:', error)
    } finally {
      setGoingLive(null)
    }
  }

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.phase !== 'live').length,
    liveProjects: projects.filter(p => p.phase === 'live').length,
    unreadMessages: projects.reduce((acc, p) => 
      acc + p.messages.filter(m => !m.read && m.from === 'client').length, 0
    ),
    pendingPayments: projects.filter(p => p.paymentStatus === 'awaiting_payment').length,
    monthlyRevenue: projects.filter(p => p.phase === 'live').reduce((acc, p) => 
      acc + (PACKAGE_CONFIG[p.package]?.price || 0), 0
    ),
    totalClients: clients.length,
    pendingServices: serviceRequests.filter(s => s.status === 'pending').length,
    projectsThisMonth: projects.filter(p => {
      const date = new Date(p.createdAt)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length,
  }

  const readyToGoLive = projects.filter(p => p.paymentStatus === 'paid' && p.phase === 'review')
  const awaitingPayment = projects.filter(p => p.designApproved && p.paymentStatus === 'awaiting_payment')
  const inProgress = projects.filter(p => ['design', 'development'].includes(p.phase))
  const recentMessages = projects
    .flatMap(p => p.messages.filter(m => m.from === 'client').map(m => ({ ...m, project: p })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Bereken projecten per fase voor grafiek
  const phaseDistribution = {
    onboarding: projects.filter(p => p.phase === 'onboarding').length,
    design: projects.filter(p => p.phase === 'design').length,
    development: projects.filter(p => p.phase === 'development').length,
    review: projects.filter(p => p.phase === 'review').length,
    live: projects.filter(p => p.phase === 'live').length,
  }

  return (
    <div className="space-y-6">
      {/* Welcome header met datum */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welkom terug! 👋
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('projects')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nieuw project</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Hoofd stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderKanban}
          label="Actieve projecten"
          value={stats.activeProjects}
          subValue={`${stats.liveProjects} live`}
          trend={stats.projectsThisMonth > 0 ? { value: stats.projectsThisMonth, positive: true } : undefined}
          color="blue"
          darkMode={darkMode}
          delay={0}
        />
        <StatCard
          icon={MessageSquare}
          label="Ongelezen berichten"
          value={stats.unreadMessages}
          color={stats.unreadMessages > 0 ? 'red' : 'purple'}
          darkMode={darkMode}
          delay={0.05}
        />
        <StatCard
          icon={Wallet}
          label="MRR"
          value={`€${stats.monthlyRevenue}`}
          subValue={`${stats.liveProjects} abonnementen`}
          color="green"
          darkMode={darkMode}
          delay={0.1}
        />
        <StatCard
          icon={CreditCard}
          label="Wacht op betaling"
          value={stats.pendingPayments}
          color="amber"
          darkMode={darkMode}
          delay={0.15}
        />
      </div>

      {/* Urgente acties sectie */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Klaar om live te gaan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl border-2 ${
            readyToGoLive.length > 0
              ? darkMode 
                ? 'bg-green-900/20 border-green-500/50' 
                : 'bg-green-50 border-green-200'
              : darkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${readyToGoLive.length > 0 ? 'bg-green-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <Rocket className={`w-5 h-5 ${readyToGoLive.length > 0 ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {readyToGoLive.length > 0 ? '🚀 Klaar om live te gaan!' : 'Livegang'}
              </h3>
              <p className={`text-sm ${readyToGoLive.length > 0 ? (darkMode ? 'text-green-400' : 'text-green-700') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                {readyToGoLive.length > 0 
                  ? `${readyToGoLive.length} project${readyToGoLive.length > 1 ? 'en' : ''} klaar`
                  : 'Geen projecten klaar voor livegang'}
              </p>
            </div>
          </div>
          {readyToGoLive.length > 0 ? (
            <div className="space-y-3">
              {readyToGoLive.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {p.businessName}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {PACKAGE_CONFIG[p.package]?.name} • €{PACKAGE_CONFIG[p.package]?.price}/m
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleGoLive(p); }}
                    disabled={goingLive === p.id}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {goingLive === p.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Rocket className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{goingLive === p.id ? 'Bezig...' : 'Zet live'}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p className="text-sm">Projecten verschijnen hier wanneer ze betaald zijn en klaar voor livegang</p>
            </div>
          )}
        </motion.div>

        {/* Wacht op betaling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`p-6 rounded-2xl border-2 ${
            awaitingPayment.length > 0
              ? darkMode 
                ? 'bg-amber-900/20 border-amber-500/50' 
                : 'bg-amber-50 border-amber-200'
              : darkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${awaitingPayment.length > 0 ? 'bg-amber-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <CreditCard className={`w-5 h-5 ${awaitingPayment.length > 0 ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {awaitingPayment.length > 0 ? '💳 Wacht op betaling' : 'Betalingen'}
              </h3>
              <p className={`text-sm ${awaitingPayment.length > 0 ? (darkMode ? 'text-amber-400' : 'text-amber-700') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                {awaitingPayment.length > 0 
                  ? `${awaitingPayment.length} project${awaitingPayment.length > 1 ? 'en' : ''} wacht${awaitingPayment.length === 1 ? '' : 'en'}`
                  : 'Geen openstaande betalingen'}
              </p>
            </div>
          </div>
          {awaitingPayment.length > 0 ? (
            <div className="space-y-3">
              {awaitingPayment.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {p.businessName}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        €{PACKAGE_CONFIG[p.package]?.price}/maand
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveView('payments'); }}
                    className="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    Betaallink
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p className="text-sm">Alle betalingen zijn up-to-date! 🎉</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Pipeline overview + Recente berichten */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`lg:col-span-2 p-6 rounded-2xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Project Pipeline
            </h3>
            <button
              onClick={() => setActiveView('projects')}
              className="text-sm text-emerald-500 hover:text-emerald-600 font-medium"
            >
              Bekijk alle
            </button>
          </div>
          
          {/* Pipeline visualisatie */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.entries(PHASE_CONFIG).map(([phase, config]) => {
              const count = phaseDistribution[phase as ProjectPhase]
              const PhaseIcon = config.icon
              return (
                <motion.div
                  key={phase}
                  whileHover={{ scale: 1.02 }}
                  className={`flex-1 min-w-[100px] p-4 rounded-xl cursor-pointer transition-colors ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveView('projects')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${config.bg}`}>
                      <PhaseIcon className={`w-3.5 h-3.5 ${config.color}`} />
                    </div>
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {count}
                  </p>
                </motion.div>
              )
            })}
          </div>

          {/* Projecten in progress */}
          {inProgress.length > 0 && (
            <div>
              <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                In uitvoering ({inProgress.length})
              </p>
              <div className="space-y-2">
                {inProgress.slice(0, 4).map(p => {
                  const phase = PHASE_CONFIG[p.phase]
                  const PhaseIcon = phase.icon
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${phase.bg}`}>
                        <PhaseIcon className={`w-4 h-4 ${phase.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {p.businessName}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {PACKAGE_CONFIG[p.package]?.name} • {phase.label}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Recente berichten */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`p-6 rounded-2xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recente berichten
            </h3>
            <button
              onClick={() => setActiveView('messages')}
              className="text-sm text-emerald-500 hover:text-emerald-600 font-medium"
            >
              Bekijk alle
            </button>
          </div>
          <div className="space-y-3">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onSelectProject(msg.project)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    !msg.read ? (darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50') : ''
                  } ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      !msg.read ? 'bg-emerald-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <MessageSquare className={`w-3 h-3 ${!msg.read ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {msg.project.contactName}
                      </p>
                      <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {msg.message}
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(msg.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {!msg.read && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Geen berichten</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Snelle acties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Snelle acties
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('projects')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="p-3 rounded-xl bg-emerald-500">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className={`font-medium text-sm text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nieuw project
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const onboardingProjects = projects.filter(p => p.phase === 'onboarding')
              if (onboardingProjects.length > 0) {
                onSelectProject(onboardingProjects[0])
                setActiveView('projects')
              } else {
                setActiveView('onboarding')
              }
            }}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="p-3 rounded-xl bg-yellow-500">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className={`font-medium text-sm text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Onboarding
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('messages')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-colors relative ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {stats.unreadMessages > 0 && (
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {stats.unreadMessages}
              </span>
            )}
            <div className="p-3 rounded-xl bg-purple-500">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className={`font-medium text-sm text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Berichten
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('payments')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="p-3 rounded-xl bg-amber-500">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className={`font-medium text-sm text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Betaallinks
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('clients')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="p-3 rounded-xl bg-green-500">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className={`font-medium text-sm text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Klanten
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView('services')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="p-3 rounded-xl bg-indigo-500">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className={`font-medium text-sm text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Services
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Services overzicht (als er pending zijn) */}
      {stats.pendingServices > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className={`p-6 rounded-2xl border-2 ${
            darkMode ? 'bg-purple-900/20 border-purple-500/50' : 'bg-purple-50 border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-xl">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Service aanvragen
                </h3>
                <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                  {stats.pendingServices} nieuwe aanvra{stats.pendingServices === 1 ? 'ag' : 'gen'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('services')}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              Bekijken
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ===========================================
// PROJECTS VIEW - Full Kanban & List view
// ===========================================

interface ProjectsViewProps {
  darkMode: boolean
  projects: Project[]
  onUpdateProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  onSelectProject: (project: Project) => void
  onNavigateToPayments?: () => void
}

function ProjectsView({ darkMode, projects, onUpdateProject, onDeleteProject, onSelectProject, onNavigateToPayments }: ProjectsViewProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [filterPhase, setFilterPhase] = useState<ProjectPhase | 'all'>('all')
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)

  const phases: { key: ProjectPhase; label: string; color: string; bgColor: string }[] = [
    { key: 'onboarding', label: 'Onboarding', color: 'bg-yellow-500', bgColor: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50' },
    { key: 'design', label: 'Design', color: 'bg-emerald-500', bgColor: darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50' },
    { key: 'development', label: 'Development', color: 'bg-purple-500', bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-50' },
    { key: 'review', label: 'Review', color: 'bg-orange-500', bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-50' },
    { key: 'live', label: 'Live', color: 'bg-green-500', bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-50' },
  ]

  const filteredProjects = projects.filter(p => {
    const matchesPhase = filterPhase === 'all' || p.phase === filterPhase
    const matchesPayment = filterPayment === 'all' || p.paymentStatus === filterPayment
    const matchesSearch = searchQuery === '' || 
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesPhase && matchesPayment && matchesSearch
  })

  const getProjectsByPhase = (phase: ProjectPhase) => 
    filteredProjects.filter(p => p.phase === phase)

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
    onSelectProject(project)
  }

  const getPaymentBadge = (status: PaymentStatus) => {
    const badges = {
      pending: { label: 'In afwachting', color: 'bg-gray-500' },
      awaiting_payment: { label: 'Wacht op betaling', color: 'bg-yellow-500' },
      paid: { label: 'Betaald', color: 'bg-green-500' },
      failed: { label: 'Mislukt', color: 'bg-red-500' },
      refunded: { label: 'Terugbetaald', color: 'bg-purple-500' },
    }
    return badges[status]
  }

  const getPackageBadge = (pkg: Project['package']) => {
    const badges = {
      starter: { label: 'Starter', color: 'bg-gray-500', price: '€96/m' },
      professional: { label: 'Professional', color: 'bg-emerald-500', price: '€180/m' },
      business: { label: 'Business', color: 'bg-purple-500', price: '€301/m' },
      webshop: { label: 'Webshop', color: 'bg-orange-500', price: '€422/m' },
    }
    return badges[pkg]
  }

  // Project Card Component with Quick Actions
  const ProjectCard = ({ project }: { project: Project }) => {
    const payment = getPaymentBadge(project.paymentStatus)
    const pkg = getPackageBadge(project.package)
    const unreadCount = project.messages.filter(m => !m.read && m.from === 'client').length

    // Quick action handlers
    const handleMoveToNextPhase = async (e: React.MouseEvent) => {
      e.stopPropagation()
      const phaseOrder: ProjectPhase[] = ['onboarding', 'design', 'development', 'review', 'live']
      const currentIndex = phaseOrder.indexOf(project.phase)
      if (currentIndex < phaseOrder.length - 1) {
        const nextPhase = phaseOrder[currentIndex + 1]
        
        // Update project phase
        onUpdateProject({ ...project, phase: nextPhase, updatedAt: new Date().toISOString() })
        
        // Send phase change email to client
        try {
          const token = sessionStorage.getItem('webstability_dev_token')
          await fetch('/api/send-phase-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              projectId: project.projectId,
              projectName: project.businessName,
              customerEmail: project.contactEmail,
              customerName: project.contactName || project.businessName,
              newPhase: nextPhase
            })
          })
          console.log(`✅ Fase-wijziging email verstuurd naar ${project.contactEmail}`)
        } catch (error) {
          console.error('Kon fase-email niet versturen:', error)
        }
      }
    }

    const handleSendMessage = (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelectProject(project)
      // Scroll to messages section in project detail
    }

    const handleCopyPortalLink = (e: React.MouseEvent) => {
      e.stopPropagation()
      const link = `https://webstability.nl/project/${project.projectId}`
      navigator.clipboard.writeText(link)
      alert('Link gekopieerd!')
    }

    const getNextPhaseLabel = () => {
      const phaseLabels: Record<ProjectPhase, string> = {
        onboarding: '→ Design',
        design: '→ Development',
        development: '→ Review',
        review: '→ Live',
        live: ''
      }
      return phaseLabels[project.phase]
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        onClick={() => openProjectDetail(project)}
        className={`p-4 rounded-xl border cursor-pointer transition-all group ${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50' 
            : 'bg-white border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {project.businessName}
            </h4>
            <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {project.contactName}
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${pkg.color}`}>
            {pkg.label}
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${payment.color}`}>
            {payment.label}
          </span>
        </div>

        {/* Quick Actions - visible on hover */}
        <div className={`flex items-center gap-1 pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          {project.phase !== 'live' && (
            <button
              onClick={handleMoveToNextPhase}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30' 
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              }`}
              title="Naar volgende fase"
            >
              {getNextPhaseLabel()}
            </button>
          )}
          <button
            onClick={handleCopyPortalLink}
            className={`p-1.5 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            title="Kopieer klantportaal link"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleSendMessage}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
              title="Beantwoord bericht"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          )}
          {project.stagingUrl && (
            <a 
              href={project.stagingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              title="Preview bekijken"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </motion.div>
    )
  }

  // Drag state for kanban
  const [draggedProject, setDraggedProject] = useState<Project | null>(null)
  const [dragOverPhase, setDragOverPhase] = useState<ProjectPhase | null>(null)

  // Handle drop on a phase column
  const handleDropOnPhase = async (targetPhase: ProjectPhase) => {
    if (!draggedProject || draggedProject.phase === targetPhase) {
      setDraggedProject(null)
      setDragOverPhase(null)
      return
    }

    // Update project phase
    const updatedProject = { 
      ...draggedProject, 
      phase: targetPhase, 
      updatedAt: new Date().toISOString() 
    }
    onUpdateProject(updatedProject)

    // Send phase change email to client
    try {
      const token = sessionStorage.getItem('webstability_dev_token')
      await fetch('/api/send-phase-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: draggedProject.projectId,
          projectName: draggedProject.businessName,
          customerEmail: draggedProject.contactEmail,
          customerName: draggedProject.contactName || draggedProject.businessName,
          newPhase: targetPhase
        })
      })
      console.log(`✅ Fase-wijziging email verstuurd naar ${draggedProject.contactEmail}`)
    } catch (error) {
      console.error('Kon fase-email niet versturen:', error)
    }

    setDraggedProject(null)
    setDragOverPhase(null)
  }

  // Kanban Column Component with Drag & Drop
  const KanbanColumn = ({ phase }: { phase: typeof phases[0] }) => {
    const phaseProjects = getProjectsByPhase(phase.key)
    const isDragOver = dragOverPhase === phase.key
    
    return (
      <div 
        className={`flex-1 min-w-0 rounded-2xl ${phase.bgColor} p-4 transition-all ${
          isDragOver ? 'ring-2 ring-emerald-500 ring-offset-2 scale-[1.02]' : ''
        } ${draggedProject ? 'cursor-pointer' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          if (draggedProject && draggedProject.phase !== phase.key) {
            setDragOverPhase(phase.key)
          }
        }}
        onDragLeave={() => setDragOverPhase(null)}
        onDrop={(e) => {
          e.preventDefault()
          handleDropOnPhase(phase.key)
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${phase.color}`} />
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {phase.label}
            </h3>
          </div>
          <span className={`px-2 py-0.5 text-sm font-medium rounded-full ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'
          }`}>
            {phaseProjects.length}
          </span>
        </div>

        <div className="space-y-3 min-h-[200px]">
          <AnimatePresence>
            {phaseProjects.map(project => (
              <div
                key={project.id}
                draggable
                onDragStart={() => setDraggedProject(project)}
                onDragEnd={() => {
                  setDraggedProject(null)
                  setDragOverPhase(null)
                }}
                className={`${draggedProject?.id === project.id ? 'opacity-50' : ''}`}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </AnimatePresence>
          
          {phaseProjects.length === 0 && (
            <div className={`p-4 text-center text-sm rounded-xl border-2 border-dashed transition-all ${
              isDragOver 
                ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' 
                : darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
            }`}>
              {isDragOver ? 'Loslaten om hier te plaatsen' : 'Geen projecten'}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Projecten
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 'en' : ''} gevonden
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Zoeken..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-xl border w-48 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />
          </div>

          {/* Phase Filter */}
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value as ProjectPhase | 'all')}
            className={`px-3 py-2 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
          >
            <option value="all">Alle fases</option>
            {phases.map(p => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>

          {/* Payment Filter */}
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value as PaymentStatus | 'all')}
            className={`px-3 py-2 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
          >
            <option value="all">Alle betalingen</option>
            <option value="pending">In afwachting</option>
            <option value="awaiting_payment">Wacht op betaling</option>
            <option value="paid">Betaald</option>
            <option value="failed">Mislukt</option>
          </select>

          {/* View Toggle */}
          <div className={`flex rounded-xl border p-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-emerald-500 text-white'
                  : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-500 text-white'
                  : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 min-w-max md:min-w-0">
            {phases.map(phase => (
              <div key={phase.key} className="w-72 md:w-auto flex-shrink-0 md:flex-shrink">
                <KanbanColumn phase={phase} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className={`rounded-2xl border overflow-hidden ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Project
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Pakket
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Fase
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Betaling
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Aangemaakt
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProjects.map(project => {
                  const payment = getPaymentBadge(project.paymentStatus)
                  const pkg = getPackageBadge(project.package)
                  const phase = phases.find(p => p.key === project.phase)
                  const unreadCount = project.messages.filter(m => !m.read && m.from === 'client').length

                  return (
                    <tr 
                      key={project.id}
                      onClick={() => openProjectDetail(project)}
                      className={`cursor-pointer transition-colors ${
                        darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${pkg.color}`}>
                            {project.businessName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {project.businessName}
                              </span>
                              {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {project.contactName} • {project.contactEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${pkg.color}`}>
                          {pkg.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${phase?.color}`}>
                          {phase?.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${payment.color}`}>
                          {payment.label}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(project.createdAt).toLocaleDateString('nl-NL')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {project.stagingUrl && (
                            <a
                              href={project.stagingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                              title="Preview bekijken"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openProjectDetail(project)
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                            }`}
                            title="Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className={`p-12 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Geen projecten gevonden</p>
            </div>
          )}
        </div>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {showProjectModal && selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            darkMode={darkMode}
            onClose={() => {
              setShowProjectModal(false)
              setSelectedProject(null)
            }}
            onUpdate={onUpdateProject}
            onDelete={onDeleteProject}
            onPaymentClick={onNavigateToPayments}
            phases={phases}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================
// PROJECT DETAIL MODAL
// ===========================================

interface ProjectDetailModalProps {
  project: Project
  darkMode: boolean
  onClose: () => void
  onUpdate: (project: Project) => void
  onDelete?: (projectId: string) => void
  onPaymentClick?: () => void
  phases: { key: ProjectPhase; label: string; color: string }[]
}

function ProjectDetailModal({ project, darkMode, onClose, onUpdate, onDelete, onPaymentClick, phases }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'urls' | 'payment' | 'onboarding' | 'settings'>('overview')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [generatedPaymentUrl, setGeneratedPaymentUrl] = useState('')
  const [paymentDescription, setPaymentDescription] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [editPhase, setEditPhase] = useState(project.phase)
  const [editPaymentStatus, setEditPaymentStatus] = useState(project.paymentStatus)
  const [internalNotes, setInternalNotes] = useState(project.internalNotes || '')
  const [stagingUrl, setStagingUrl] = useState(project.stagingUrl || '')
  const [liveUrl, setLiveUrl] = useState(project.liveUrl || '')
  const [newMessage, setNewMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [checklist, setChecklist] = useState<Record<string, boolean>>(project.phaseChecklist || {})
  const [isSendingPhaseEmail, setIsSendingPhaseEmail] = useState(false)

  // Phase-specific checklists
  const phaseChecklists: Record<ProjectPhase, { id: string; label: string }[]> = {
    onboarding: [
      { id: 'onb_form', label: 'Onboarding formulier ingevuld' },
      { id: 'onb_logo', label: 'Logo ontvangen' },
      { id: 'onb_content', label: 'Teksten/content ontvangen' },
      { id: 'onb_colors', label: 'Huisstijl/kleuren bepaald' },
      { id: 'onb_examples', label: 'Voorbeeldwebsites besproken' },
    ],
    design: [
      { id: 'des_mockup', label: 'Design mockup gemaakt' },
      { id: 'des_preview', label: 'Design preview URL ingesteld' },
      { id: 'des_sent', label: 'Design naar klant gestuurd' },
      { id: 'des_feedback', label: 'Feedback van klant ontvangen' },
      { id: 'des_approved', label: 'Design goedgekeurd door klant' },
    ],
    development: [
      { id: 'dev_setup', label: 'Project setup voltooid' },
      { id: 'dev_pages', label: 'Alle pagina\'s gebouwd' },
      { id: 'dev_forms', label: 'Formulieren werkend' },
      { id: 'dev_responsive', label: 'Responsive getest' },
      { id: 'dev_seo', label: 'SEO ingesteld' },
    ],
    review: [
      { id: 'rev_test', label: 'Uitgebreid getest' },
      { id: 'rev_speed', label: 'Performance geoptimaliseerd' },
      { id: 'rev_client_test', label: 'Klant heeft getest' },
      { id: 'rev_feedback', label: 'Laatste feedback verwerkt' },
      { id: 'rev_approval', label: 'Klant akkoord voor live' },
    ],
    live: [
      { id: 'live_domain', label: 'Domein gekoppeld' },
      { id: 'live_ssl', label: 'SSL certificaat actief' },
      { id: 'live_email', label: 'Go-live email verstuurd' },
      { id: 'live_analytics', label: 'Analytics ingesteld' },
      { id: 'live_backup', label: 'Backup ingesteld' },
    ],
  }

  const currentChecklist = phaseChecklists[editPhase] || []
  const completedCount = currentChecklist.filter(item => checklist[item.id]).length
  const totalCount = currentChecklist.length
  const allCompleted = completedCount === totalCount && totalCount > 0

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(prev => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  const handleMoveToNextPhaseWithEmail = async () => {
    const phaseOrder: ProjectPhase[] = ['onboarding', 'design', 'development', 'review', 'live']
    const currentIndex = phaseOrder.indexOf(editPhase)
    if (currentIndex < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[currentIndex + 1]
      setEditPhase(nextPhase)
      
      // Send phase change email
      setIsSendingPhaseEmail(true)
      try {
        const token = sessionStorage.getItem('webstability_dev_token')
        await fetch('/api/send-phase-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            projectId: project.projectId,
            projectName: project.businessName,
            customerEmail: project.contactEmail,
            customerName: project.contactName || project.businessName,
            newPhase: nextPhase
          })
        })
        console.log(`✅ Fase-wijziging email verstuurd naar ${project.contactEmail}`)
      } catch (error) {
        console.error('Kon fase-email niet versturen:', error)
      } finally {
        setIsSendingPhaseEmail(false)
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    onUpdate({
      ...project,
      phase: editPhase,
      paymentStatus: editPaymentStatus,
      stagingUrl,
      liveUrl,
      internalNotes,
      phaseChecklist: checklist,
      updatedAt: new Date().toISOString(),
    })
    setTimeout(() => setIsSaving(false), 500)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString(),
      from: 'developer',
      message: newMessage.trim(),
      read: true,
    }
    
    onUpdate({
      ...project,
      messages: [...project.messages, newMsg],
      updatedAt: new Date().toISOString(),
    })
    setNewMessage('')
  }

  const handleCopyPortalLink = () => {
    const link = `https://webstability.nl/project/${project.projectId}`
    navigator.clipboard.writeText(link)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const getPackagePrice = (pkg: Project['package']) => {
    const prices = { starter: 96, professional: 180, business: 301, webshop: 422 }
    return prices[pkg]
  }

  const unreadCount = project.messages.filter(m => !m.read && m.from === 'client').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {project.businessName}
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {project.contactName} • {project.contactEmail}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {(['overview', 'messages', 'urls', 'payment', 'onboarding', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-white'
                    : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'overview' && 'Overzicht'}
                {tab === 'messages' && (
                  <>
                    Berichten
                    {unreadCount > 0 && (
                      <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${
                        activeTab === tab ? 'bg-white/20' : 'bg-red-500 text-white'
                      }`}>
                        {unreadCount}
                      </span>
                    )}
                  </>
                )}
                {tab === 'urls' && 'URLs & Links'}
                {tab === 'payment' && (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Betaling
                  </>
                )}
                {tab === 'onboarding' && (
                  <>
                    <FileText className="w-4 h-4" />
                    Onboarding
                    {project.onboardingData && Object.keys(project.onboardingData).length > 0 && (
                      <span className={`w-2 h-2 rounded-full bg-emerald-500`} />
                    )}
                  </>
                )}
                {tab === 'settings' && 'Instellingen'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pakket</p>
                  <p className={`font-semibold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.package}
                  </p>
                  <p className="text-sm text-emerald-500">€{getPackagePrice(project.package)}/maand</p>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fase</p>
                  <select
                    value={editPhase}
                    onChange={(e) => setEditPhase(e.target.value as ProjectPhase)}
                    className={`mt-1 w-full px-2 py-1 rounded-lg border text-sm font-semibold ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    {phases.map(p => (
                      <option key={p.key} value={p.key}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Betaling</p>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                    className={`mt-1 w-full px-2 py-1 rounded-lg border text-sm font-semibold ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="pending">In afwachting</option>
                    <option value="awaiting_payment">Wacht op betaling</option>
                    <option value="paid">Betaald</option>
                    <option value="failed">Mislukt</option>
                    <option value="refunded">Terugbetaald</option>
                  </select>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aangemaakt</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(project.createdAt).toLocaleDateString('nl-NL')}
                  </p>
                </div>
              </div>

              {/* Phase Checklist */}
              <div className={`p-4 rounded-xl border-2 ${
                allCompleted 
                  ? darkMode ? 'bg-green-500/10 border-green-500/50' : 'bg-green-50 border-green-200'
                  : darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      📋 Fase Checklist: {phases.find(p => p.key === editPhase)?.label}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {completedCount}/{totalCount} taken voltooid
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    allCompleted 
                      ? 'bg-green-500 text-white' 
                      : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {Math.round((completedCount / Math.max(totalCount, 1)) * 100)}%
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className={`h-2 rounded-full mb-4 overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300"
                    style={{ width: `${(completedCount / Math.max(totalCount, 1)) * 100}%` }}
                  />
                </div>
                
                {/* Checklist items */}
                <div className="space-y-2">
                  {currentChecklist.map(item => (
                    <label 
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        checklist[item.id]
                          ? darkMode ? 'bg-green-500/20' : 'bg-green-100'
                          : darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checklist[item.id] || false}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="w-5 h-5 rounded text-green-500 focus:ring-green-500"
                      />
                      <span className={`${
                        checklist[item.id] 
                          ? darkMode ? 'text-green-300 line-through' : 'text-green-700 line-through'
                          : darkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Move to next phase button */}
                {editPhase !== 'live' && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
                    <button
                      onClick={handleMoveToNextPhaseWithEmail}
                      disabled={!allCompleted || isSendingPhaseEmail}
                      className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        allCompleted && !isSendingPhaseEmail
                          ? 'bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer'
                          : darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSendingPhaseEmail ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Email versturen...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          Naar volgende fase + klant emailen
                        </>
                      )}
                    </button>
                    {!allCompleted && (
                      <p className={`text-sm text-center mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Voltooi alle taken om naar de volgende fase te gaan
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contactgegevens
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{project.contactName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <a href={`mailto:${project.contactEmail}`} className="text-emerald-500 hover:underline">
                      {project.contactEmail}
                    </a>
                  </div>
                  {project.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <a href={`tel:${project.contactPhone}`} className="text-emerald-500 hover:underline">
                        {project.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* URLs */}
              {(project.stagingUrl || project.liveUrl) && (
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Links
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.stagingUrl && (
                      <a
                        href={project.stagingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Staging Preview
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Live Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Interne notities
                </h3>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Voeg interne notities toe..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Opslaan...' : 'Wijzigingen opslaan'}
              </button>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              {/* Messages List */}
              <div className={`h-[400px] overflow-y-auto p-4 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                {project.messages.length === 0 ? (
                  <div className={`h-full flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nog geen berichten</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {project.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === 'developer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-3 rounded-2xl ${
                          msg.from === 'developer'
                            ? 'bg-emerald-500 text-white'
                            : darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900 shadow-sm'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.from === 'developer' ? 'text-emerald-200' : darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(msg.date).toLocaleString('nl-NL')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Send Message */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Typ een bericht..."
                  className={`flex-1 px-4 py-3 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'urls' && (
            <div className="space-y-6">
              {/* Klantportaal link */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  📋 Klantportaal Link
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://webstability.nl/project/${project.projectId}`}
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-gray-300' 
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  />
                  <button
                    onClick={handleCopyPortalLink}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                      showCopied 
                        ? 'bg-green-500 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {showCopied ? '✓ Gekopieerd!' : 'Kopieer'}
                  </button>
                </div>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Stuur deze link naar de klant om hun project te bekijken
                </p>
              </div>

              {/* Design/Staging URL */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🎨 Design Preview URL
                </h3>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={stagingUrl}
                    onChange={(e) => setStagingUrl(e.target.value)}
                    placeholder="https://preview.webstability.nl/project-naam"
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                  />
                  {stagingUrl && (
                    <a
                      href={stagingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  De klant ziet deze link in hun portaal tijdens design/review fase
                </p>
              </div>

              {/* Live URL */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🌐 Live Website URL
                </h3>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://www.klantnaam.nl"
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                  />
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Phase Action */}
              <div className={`p-4 rounded-xl border-2 border-dashed ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🚀 Snelle actie
                </h3>
                <div className="flex flex-wrap gap-3">
                  {editPhase !== 'live' && (
                    <button
                      onClick={handleMoveToNextPhaseWithEmail}
                      disabled={!allCompleted}
                      className={`flex items-center gap-2 px-4 py-2 font-medium rounded-xl transition-colors ${
                        allCompleted 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                      Verplaats naar {
                        editPhase === 'onboarding' ? 'Design' :
                        editPhase === 'design' ? 'Development' :
                        editPhase === 'development' ? 'Review' :
                        'Live'
                      }
                    </button>
                  )}
                  {editPhase === 'review' && editPaymentStatus === 'paid' && (
                    <button
                      onClick={() => {
                        setEditPhase('live')
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
                    >
                      <Rocket className="w-4 h-4" />
                      Zet Live!
                    </button>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Opslaan...' : 'URLs opslaan'}
              </button>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              {/* Current Payment Status */}
              <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  💳 Betalingsstatus
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    editPaymentStatus === 'paid' 
                      ? 'bg-green-500/20 text-green-400' 
                      : editPaymentStatus === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {editPaymentStatus === 'paid' ? '✓ Betaald' : 
                     editPaymentStatus === 'pending' ? '⏳ In afwachting' : '○ Niet betaald'}
                  </span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    €{getPackagePrice(project.package)}/maand
                  </span>
                </div>

                <div className="flex gap-3">
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                    className={`flex-1 px-4 py-2 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                  >
                    <option value="unpaid">Niet betaald</option>
                    <option value="pending">In afwachting</option>
                    <option value="paid">Betaald</option>
                  </select>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSaving ? '...' : 'Opslaan'}
                  </button>
                </div>
              </div>

              {/* Generate Payment Link */}
              <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🔗 Betaallink genereren (Mollie)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bedrag (€)
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={`${getPackagePrice(project.package)}`}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Omschrijving
                    </label>
                    <input
                      type="text"
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                      placeholder={`Website ${project.businessName} - ${project.package} pakket`}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                  </div>

                  <button
                    onClick={async () => {
                      setPaymentLoading(true)
                      try {
                        const amount = paymentAmount || String(getPackagePrice(project.package))
                        const description = paymentDescription || `Website ${project.businessName} - ${project.package} pakket`
                        
                        const response = await fetch('/api/create-payment', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            projectId: project.id,
                            amount,
                            description,
                            customerEmail: project.contactEmail,
                            customerName: project.contactName
                          })
                        })
                        
                        const data = await response.json()
                        if (data.paymentUrl) {
                          setGeneratedPaymentUrl(data.paymentUrl)
                        } else {
                          throw new Error(data.error || 'Kon betaallink niet maken')
                        }
                      } catch (error) {
                        console.error('Error creating payment:', error)
                        alert('Er ging iets mis bij het maken van de betaallink')
                      } finally {
                        setPaymentLoading(false)
                      }
                    }}
                    disabled={paymentLoading}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Bezig...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Betaallink genereren
                      </>
                    )}
                  </button>

                  {generatedPaymentUrl && (
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20 border border-green-500/50' : 'bg-green-50 border border-green-200'}`}>
                      <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                        ✓ Betaallink gegenereerd!
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={generatedPaymentUrl}
                          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPaymentUrl)
                            alert('Betaallink gekopieerd!')
                          }}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(generatedPaymentUrl, '_blank')}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Payment Links */}
              <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ⚡ Snelle betaallink
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Eerste betaling', amount: getPackagePrice(project.package) },
                    { label: 'Extra werk', amount: 50 },
                    { label: 'Aanpassing', amount: 25 },
                    { label: 'Custom', amount: 0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        if (preset.amount === 0) {
                          setPaymentAmount('')
                        } else {
                          setPaymentAmount(String(preset.amount))
                        }
                        setPaymentDescription(`${preset.label} - ${project.businessName}`)
                      }}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        darkMode 
                          ? 'bg-gray-600/50 border-gray-500 hover:border-emerald-500' 
                          : 'bg-white border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {preset.label}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {preset.amount === 0 ? 'Vul zelf in' : `€${preset.amount}`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Onboarding Tab */}
          {activeTab === 'onboarding' && (
            <div className="space-y-6">
              {project.onboardingData && Object.keys(project.onboardingData).length > 0 ? (
                <>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
                          Onboarding ingevuld
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-emerald-500' : 'text-emerald-700'}`}>
                          De klant heeft de onboarding gegevens ingevuld
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(project.onboardingData).map(([key, value]) => {
                      // Skip internal fields
                      if (key === 'lastUpdated' || key === 'projectId') return null
                      
                      // Format the key for display
                      const formatKey = (k: string) => {
                        const labels: Record<string, string> = {
                          businessName: 'Bedrijfsnaam',
                          businessDescription: 'Bedrijfsomschrijving',
                          targetAudience: 'Doelgroep',
                          websiteGoals: 'Website doelen',
                          preferredColors: 'Voorkeurskleuren',
                          exampleWebsites: 'Voorbeeldwebsites',
                          logo: 'Logo',
                          content: 'Content/Teksten',
                          pages: 'Gewenste pagina\'s',
                          contactInfo: 'Contactgegevens',
                          socialMedia: 'Social media links',
                          specialRequirements: 'Speciale wensen',
                          deadline: 'Deadline',
                          additionalNotes: 'Extra opmerkingen'
                        }
                        return labels[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      }

                      // Format the value for display
                      const formatValue = (v: unknown): string => {
                        if (v === null || v === undefined || v === '') return '-'
                        if (typeof v === 'boolean') return v ? 'Ja' : 'Nee'
                        if (Array.isArray(v)) return v.join(', ') || '-'
                        if (typeof v === 'object') return JSON.stringify(v, null, 2)
                        return String(v)
                      }

                      const displayValue = formatValue(value)
                      if (displayValue === '-') return null

                      return (
                        <div key={key} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatKey(key)}
                          </p>
                          <p className={`${darkMode ? 'text-white' : 'text-gray-900'} whitespace-pre-wrap break-words`}>
                            {displayValue}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className={`p-8 rounded-xl text-center ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                  <FileText className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Nog geen onboarding gegevens
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    De klant heeft nog geen onboarding formulier ingevuld.
                  </p>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Klantportaal: {window.location.origin}/project/{project.projectId}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-900/20 border border-yellow-500/50' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                      Projectinstellingen
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-yellow-500' : 'text-yellow-700'}`}>
                      Hier komen geavanceerde instellingen zoals project verwijderen, archiveren, etc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={`mailto:${project.contactEmail}?subject=Webstability - ${project.businessName}`}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 hover:border-emerald-500' 
                      : 'bg-gray-50 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <Mail className={`w-5 h-5 mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    E-mail versturen
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Stuur een e-mail naar de klant
                  </p>
                </a>
                <button 
                  onClick={onPaymentClick}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 hover:border-green-500' 
                      : 'bg-gray-50 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 mb-2 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Betaallink maken
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Genereer een Mollie betaallink
                  </p>
                </button>
              </div>

              {/* Danger Zone */}
              <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'border-red-500/30 bg-red-900/10' : 'border-red-200 bg-red-50'}`}>
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                  ⚠️ Gevarenzone
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm(`Weet je zeker dat je het project "${project.businessName}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
                        onDelete?.(project.id)
                        onClose()
                      }
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Project verwijderen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ===========================================
// CLIENTS VIEW
// ===========================================

interface ClientsViewProps {
  darkMode: boolean
  clients: Client[]
  projects: Project[]
  onSelectClient: (client: Client) => void
  onAddClient: (client: Client) => void
  onDeleteClient: (clientId: string, projectIds: string[]) => Promise<void>
}

function ClientsView({ darkMode, clients, projects, onSelectClient, onAddClient, onDeleteClient }: ClientsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'projects' | 'spent' | 'date'>('date')
  const [_selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Create client object
      const client: Client = {
        id: `client-${Date.now()}`,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        company: newClient.company,
        projects: [],
        totalSpent: 0,
        createdAt: new Date().toISOString()
      }

      // Send welcome email via API
      const emailResponse = await fetch('/api/client-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClient.name,
          email: newClient.email,
          company: newClient.company
        })
      })

      if (!emailResponse.ok) {
        console.warn('Email verzending gefaald, maar klant wordt toch toegevoegd')
      }

      // Add client
      onAddClient(client)
      
      setSubmitStatus('success')
      setTimeout(() => {
        setShowAddModal(false)
        setNewClient({ name: '', email: '', phone: '', company: '' })
        setSubmitStatus('idle')
      }, 1500)
    } catch (error) {
      console.error('Error adding client:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation()
    setClientToDelete(client)
    setDeletePassword('')
    setDeleteError('')
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (deletePassword !== DEV_PASSWORD) {
      setDeleteError('Onjuist wachtwoord')
      return
    }

    if (!clientToDelete) return

    setIsDeleting(true)
    setDeleteError('')

    try {
      const clientProjects = projects.filter(p => clientToDelete.projects.includes(p.id))
      await onDeleteClient(clientToDelete.id, clientProjects.map(p => p.id))
      setShowDeleteModal(false)
      setClientToDelete(null)
      setDeletePassword('')
    } catch (error) {
      console.error('Error deleting client:', error)
      setDeleteError('Er ging iets mis bij het verwijderen')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredClients = clients
    .filter(c => {
      const matchesSearch = searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'projects': return b.projects.length - a.projects.length
        case 'spent': return b.totalSpent - a.totalSpent
        case 'date': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default: return 0
      }
    })

  const getClientProjects = (client: Client) => 
    projects.filter(p => client.projects.includes(p.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Klanten
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filteredClients.length} klant{filteredClients.length !== 1 ? 'en' : ''} gevonden
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Zoek klant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-xl border w-56 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={`px-3 py-2 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
          >
            <option value="date">Nieuwste eerst</option>
            <option value="name">Naam A-Z</option>
            <option value="projects">Meeste projecten</option>
            <option value="spent">Hoogste omzet</option>
          </select>

          {/* Add Client Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Nieuwe klant</span>
          </motion.button>
        </div>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl p-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                    <UserPlus className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Nieuwe klant
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Voeg een nieuwe klant toe
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`p-2 rounded-xl transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClient} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Naam *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Jan de Vries"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-emerald-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="jan@bedrijf.nl"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-emerald-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Telefoonnummer
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="06-12345678"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-emerald-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bedrijfsnaam
                  </label>
                  <input
                    type="text"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    placeholder="Bedrijf B.V."
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-emerald-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>

                {/* Info box */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'}`}>
                  <div className="flex items-start gap-3">
                    <Mail className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                        Automatische welkomst email
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-emerald-400/70' : 'text-emerald-600'}`}>
                        De klant ontvangt automatisch een welkomst email met informatie over hoe ze een project kunnen starten.
                      </p>
                    </div>
                  </div>
                </div>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-500 font-medium">Klant aangemaakt & email verzonden!</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                  >
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-500 font-medium">Er ging iets mis. Probeer opnieuw.</span>
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newClient.name || !newClient.email}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Bezig...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Aanmaken & Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && clientToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-red-500/20">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Klant verwijderen
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {clientToDelete.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`p-2 rounded-xl transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 text-red-500" />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                      Let op: Deze actie kan niet ongedaan worden gemaakt!
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-red-400/70' : 'text-red-600'}`}>
                      De klant en alle {clientToDelete.projects.length} bijbehorende project{clientToDelete.projects.length !== 1 ? 'en' : ''} worden permanent verwijderd.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Voer het wachtwoord in om te bevestigen
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value)
                      setDeleteError('')
                    }}
                    placeholder="Wachtwoord"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-red-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500'
                    } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                  />
                </div>

                {deleteError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-500 text-sm">{deleteError}</span>
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Annuleren
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting || !deletePassword}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verwijderen...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Verwijderen
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredClients.map(client => {
          const clientProjects = getClientProjects(client)
          
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              onClick={() => {
                setSelectedClient(client)
                onSelectClient(client)
              }}
              className={`group p-5 rounded-2xl border cursor-pointer transition-all ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50' 
                  : 'bg-white border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.name}
                  </h3>
                  <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {client.company}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteClick(e, client)}
                  className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10 ${
                    darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                  }`}
                  title="Verwijder klant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <a 
                    href={`mailto:${client.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-emerald-500 hover:underline truncate"
                  >
                    {client.email}
                  </a>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <a 
                      href={`tel:${client.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-emerald-500 hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className={`mt-4 pt-4 border-t flex items-center justify-between ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {client.projects.length}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      project{client.projects.length !== 1 ? 'en' : ''}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold text-green-500`}>
                      €{client.totalSpent}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      /maand
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              </div>

              {/* Project badges */}
              {clientProjects.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {clientProjects.slice(0, 3).map(p => (
                    <span
                      key={p.id}
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p.businessName}
                    </span>
                  ))}
                  {clientProjects.length > 3 && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      +{clientProjects.length - 3} meer
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className={`p-12 text-center rounded-2xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'
        }`}>
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Geen klanten gevonden</p>
        </div>
      )}
    </div>
  )
}

// ===========================================
// MESSAGES VIEW - Full Chat Interface
// ===========================================

interface MessagesViewProps {
  darkMode: boolean
  projects: Project[]
  onUpdateProject: (project: Project) => void
}

function MessagesView({ darkMode, projects, onUpdateProject }: MessagesViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterUnread, setFilterUnread] = useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Get projects with messages, sorted by last message date
  const projectsWithMessages = projects
    .filter(p => {
      const hasMessages = p.messages.length > 0
      const matchesSearch = searchQuery === '' ||
        p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contactName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesUnread = !filterUnread || p.messages.some(m => !m.read && m.from === 'client')
      return hasMessages && matchesSearch && matchesUnread
    })
    .sort((a, b) => {
      const lastMsgA = a.messages[a.messages.length - 1]?.date || a.createdAt
      const lastMsgB = b.messages[b.messages.length - 1]?.date || b.createdAt
      return new Date(lastMsgB).getTime() - new Date(lastMsgA).getTime()
    })

  // Projects without messages (for starting new conversations)
  const projectsWithoutMessages = projects.filter(p => 
    p.messages.length === 0 &&
    (searchQuery === '' || 
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedProject?.messages])

  // Mark messages as read when project is selected
  useEffect(() => {
    if (selectedProject) {
      const hasUnread = selectedProject.messages.some(m => !m.read && m.from === 'client')
      if (hasUnread) {
        onUpdateProject({
          ...selectedProject,
          messages: selectedProject.messages.map(m => ({
            ...m,
            read: m.from === 'client' ? true : m.read
          }))
        })
      }
    }
  }, [selectedProjectId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString(),
      from: 'developer',
      message: newMessage.trim(),
      read: true,
    }

    // Optimistically update UI
    const updatedProject = {
      ...selectedProject,
      messages: [...selectedProject.messages, message],
      updatedAt: new Date().toISOString(),
    }
    onUpdateProject(updatedProject)
    setNewMessage('')

    // Send to API
    try {
      const token = sessionStorage.getItem('webstability_dev_token')
      await fetch('/api/developer/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          message: message.message
        })
      })
    } catch (error) {
      console.error('Error sending message:', error)
      // Could revert optimistic update here if needed
    }
  }

  const getUnreadCount = (project: Project) => 
    project.messages.filter(m => !m.read && m.from === 'client').length

  const getLastMessage = (project: Project) => {
    const lastMsg = project.messages[project.messages.length - 1]
    if (!lastMsg) return null
    return {
      text: lastMsg.message.substring(0, 50) + (lastMsg.message.length > 50 ? '...' : ''),
      date: lastMsg.date,
      from: lastMsg.from,
    }
  }

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Gisteren'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('nl-NL', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
    }
  }

  // Quick reply templates
  const quickReplies = [
    "Bedankt voor je bericht! Ik ga er direct mee aan de slag.",
    "De wijzigingen zijn doorgevoerd. Kun je even kijken of het goed is?",
    "Ik neem zo snel mogelijk contact met je op.",
    "De website is klaar voor review. Laat me weten wat je ervan vindt!",
    "Prima, dat gaan we regelen!",
  ]

  return (
    <div className="h-[calc(100vh-180px)] flex rounded-2xl overflow-hidden border"
      style={{ 
        borderColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)',
        backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white'
      }}
    >
      {/* Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r flex flex-col ${
        darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
      } ${selectedProjectId ? 'hidden md:flex' : 'flex'}`}>
        {/* Search & Filter Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Berichten
          </h2>
          <div className="relative mb-3">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Zoek conversatie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />
          </div>
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              filterUnread
                ? 'bg-emerald-500 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {filterUnread ? 'Alle berichten tonen' : 'Alleen ongelezen'}
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Conversations */}
          {projectsWithMessages.length > 0 && (
            <div className="p-2">
              {projectsWithMessages.map(project => {
                const unread = getUnreadCount(project)
                const lastMsg = getLastMessage(project)
                const isSelected = selectedProjectId === project.id

                return (
                  <motion.button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-3 rounded-xl text-left transition-all mb-1 ${
                      isSelected
                        ? 'bg-emerald-500 text-white'
                        : darkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-emerald-500 to-purple-500 text-white'
                      }`}>
                        {project.businessName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`font-semibold truncate text-sm ${
                            isSelected ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.businessName}
                          </h4>
                          {lastMsg && (
                            <span className={`text-xs flex-shrink-0 ${
                              isSelected ? 'text-white/70' : darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {formatMessageDate(lastMsg.date)}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${
                          isSelected ? 'text-white/70' : darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {project.contactName}
                        </p>
                        {lastMsg && (
                          <p className={`text-sm truncate mt-1 ${
                            isSelected 
                              ? 'text-white/80' 
                              : unread > 0 
                                ? darkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'
                                : darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {lastMsg.from === 'developer' && (
                              <span className="opacity-70">Jij: </span>
                            )}
                            {lastMsg.text}
                          </p>
                        )}
                      </div>
                      {unread > 0 && !isSelected && (
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                          {unread}
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Start New Conversation */}
          {projectsWithoutMessages.length > 0 && !filterUnread && (
            <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Start gesprek met
              </p>
              {projectsWithoutMessages.slice(0, 5).map(project => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`w-full p-3 rounded-xl text-left transition-colors mb-1 flex items-center gap-3 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {project.businessName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {project.businessName}
                    </p>
                    <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {project.contactName}
                    </p>
                  </div>
                  <Plus className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {projectsWithMessages.length === 0 && projectsWithoutMessages.length === 0 && (
            <div className={`p-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Geen conversaties gevonden</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedProjectId ? 'hidden md:flex' : 'flex'}`}>
        {selectedProject ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center gap-4 ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <button
                onClick={() => setSelectedProjectId(null)}
                className={`md:hidden p-2 rounded-xl ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {selectedProject.businessName.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedProject.businessName}
                </h3>
                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {selectedProject.contactName} • {selectedProject.contactEmail}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedProject.stagingUrl && (
                  <a
                    href={selectedProject.stagingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-xl transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                    title="Preview bekijken"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                <a
                  href={`mailto:${selectedProject.contactEmail}`}
                  className={`p-2 rounded-xl transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  title="E-mail versturen"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
            }`}>
              {selectedProject.messages.length === 0 ? (
                <div className={`h-full flex items-center justify-center ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Start het gesprek</p>
                    <p className="text-sm">Stuur een bericht naar {selectedProject.contactName}</p>
                  </div>
                </div>
              ) : (
                <>
                  {selectedProject.messages.map((msg, index) => {
                    const showDate = index === 0 || 
                      new Date(msg.date).toDateString() !== new Date(selectedProject.messages[index - 1].date).toDateString()
                    
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex items-center justify-center my-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              darkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400 shadow-sm'
                            }`}>
                              {new Date(msg.date).toLocaleDateString('nl-NL', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${msg.from === 'developer' ? 'justify-end' : 'justify-start'}`}>
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`max-w-[75%] ${
                              msg.from === 'developer'
                                ? 'bg-emerald-500 text-white rounded-2xl rounded-br-md'
                                : darkMode 
                                  ? 'bg-gray-800 text-white rounded-2xl rounded-bl-md' 
                                  : 'bg-white text-gray-900 rounded-2xl rounded-bl-md shadow-sm'
                            } px-4 py-3`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.from === 'developer' 
                                ? 'text-emerald-200' 
                                : darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {new Date(msg.date).toLocaleTimeString('nl-NL', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              {msg.from === 'developer' && (
                                <CheckCircle2 className="w-3 h-3 inline ml-1" />
                              )}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Quick Replies */}
            <div className={`px-4 py-2 border-t flex gap-2 overflow-x-auto ${
              darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
            }`}>
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => setNewMessage(reply)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {reply.substring(0, 30)}...
                </button>
              ))}
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Typ een bericht..."
                    rows={1}
                    className={`w-full px-4 py-3 rounded-2xl border resize-none ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`px-5 rounded-2xl font-semibold transition-all flex items-center gap-2 ${
                    newMessage.trim()
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Enter om te verzenden, Shift+Enter voor nieuwe regel
              </p>
            </div>
          </>
        ) : (
          /* Empty State - No conversation selected */
          <div className={`flex-1 flex items-center justify-center ${
            darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
          }`}>
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
              }`}>
                <MessageSquare className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Selecteer een gesprek
              </h3>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Kies een conversatie aan de linkerkant om berichten te bekijken
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OnboardingView({ 
  darkMode, 
  projects, 
  onUpdateProject,
  onSelectProject 
}: { 
  darkMode: boolean
  projects: Project[]
  onUpdateProject: (project: Project) => Promise<void>
  onSelectProject: (project: Project) => void
}) {
  const [selectedOnboarding, setSelectedOnboarding] = useState<Project | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete'>('all')

  // Filter projects in onboarding phase
  const onboardingProjects = projects.filter(p => p.phase === 'onboarding')
  
  // Further filter based on onboarding completion status
  const filteredProjects = onboardingProjects.filter(p => {
    if (filter === 'all') return true
    const hasOnboardingData = p.onboardingData && Object.keys(p.onboardingData).length > 0
    const isComplete = hasOnboardingData && p.onboardingData?.isComplete === true
    if (filter === 'complete') return isComplete
    if (filter === 'pending') return !isComplete
    return true
  })

  // Move project to design phase
  const moveToDesign = async (project: Project) => {
    const updated = { ...project, phase: 'design' as ProjectPhase }
    await onUpdateProject(updated)
    setSelectedOnboarding(null)
  }

  // Count statistics
  const pendingCount = onboardingProjects.filter(p => !p.onboardingData?.isComplete).length
  const completeCount = onboardingProjects.filter(p => p.onboardingData?.isComplete).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Onboarding Aanvragen
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Bekijk en beheer klant onboarding formulieren
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-3">
          <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
            <span className="text-lg font-bold">{pendingCount}</span>
            <span className="text-sm ml-1">Wachtend</span>
          </div>
          <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
            <span className="text-lg font-bold">{completeCount}</span>
            <span className="text-sm ml-1">Compleet</span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={`flex gap-2 p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {[
          { id: 'all', label: 'Alle', count: onboardingProjects.length },
          { id: 'pending', label: 'Wachtend op klant', count: pendingCount },
          { id: 'complete', label: 'Klaar voor design', count: completeCount },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.id
                ? darkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-white text-gray-900 shadow-sm'
                : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Projects list */}
      {filteredProjects.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <FileText className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {filter === 'pending' ? 'Geen wachtende onboardings' : 
             filter === 'complete' ? 'Geen voltooide onboardings' :
             'Geen onboarding projecten'}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Wanneer klanten zich aanmelden, verschijnen ze hier
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map(project => {
            const isComplete = project.onboardingData?.isComplete === true
            const hasData = project.onboardingData && Object.keys(project.onboardingData).length > 0
            const submittedAt = project.onboardingData?.submittedAt
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  darkMode 
                    ? 'bg-gray-800/60 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedOnboarding(project)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.businessName || 'Nieuw project'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isComplete 
                          ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                          : darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {isComplete ? 'Compleet' : 'Wachtend'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {PACKAGE_CONFIG[project.package]?.name || project.package}
                      </span>
                    </div>
                    
                    <div className={`flex flex-wrap gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {project.contactName || 'Geen naam'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {project.contactEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {submittedAt 
                          ? new Date(submittedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
                          : new Date(project.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
                        }
                      </span>
                    </div>

                    {/* Quick preview of onboarding data */}
                    {hasData && (
                      <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {project.onboardingData?.aboutBusiness || 
                           project.onboardingData?.aboutText || 
                           project.onboardingData?.uniqueFeatures ||
                           'Gegevens beschikbaar'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isComplete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveToDesign(project)
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Naar Design
                      </button>
                    )}
                    <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedOnboarding(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-3xl rounded-2xl shadow-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Modal Header */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedOnboarding.businessName || 'Onboarding Details'}
                    </h2>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Project ID: {selectedOnboarding.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOnboarding(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Contact Info */}
                <div>
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <User className="w-4 h-4" />
                    Contactgegevens
                  </h3>
                  <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Naam</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedOnboarding.contactName || '-'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bedrijf</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedOnboarding.businessName || '-'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                      <a href={`mailto:${selectedOnboarding.contactEmail}`} className="font-medium text-emerald-500 hover:underline">
                        {selectedOnboarding.contactEmail}
                      </a>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Telefoon</p>
                      <a href={`tel:${selectedOnboarding.contactPhone}`} className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedOnboarding.contactPhone || '-'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Onboarding Data */}
                {selectedOnboarding.onboardingData && Object.keys(selectedOnboarding.onboardingData).length > 0 ? (
                  <div>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FileText className="w-4 h-4" />
                      Ingevulde Gegevens
                    </h3>
                    <div className={`space-y-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      {/* About Business */}
                      {(selectedOnboarding.onboardingData.aboutBusiness || selectedOnboarding.onboardingData.aboutText) && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Over het bedrijf
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedOnboarding.onboardingData.aboutBusiness || selectedOnboarding.onboardingData.aboutText}
                          </p>
                        </div>
                      )}
                      
                      {/* Services */}
                      {selectedOnboarding.onboardingData.services && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Diensten/Producten
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedOnboarding.onboardingData.services}
                          </p>
                        </div>
                      )}

                      {/* Target Audience */}
                      {selectedOnboarding.onboardingData.targetAudience && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Doelgroep
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedOnboarding.onboardingData.targetAudience}
                          </p>
                        </div>
                      )}

                      {/* Design Style */}
                      {selectedOnboarding.onboardingData.designStyle && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Gewenste stijl
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedOnboarding.onboardingData.designStyle}
                          </p>
                        </div>
                      )}

                      {/* Brand Colors */}
                      {selectedOnboarding.onboardingData.brandColors && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Kleuren
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {(Array.isArray(selectedOnboarding.onboardingData.brandColors) 
                              ? selectedOnboarding.onboardingData.brandColors 
                              : [selectedOnboarding.onboardingData.brandColors]
                            ).map((color: string, i: number) => (
                              <span 
                                key={i}
                                className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                              >
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pages */}
                      {selectedOnboarding.onboardingData.selectedPages && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Gewenste pagina's
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {(Array.isArray(selectedOnboarding.onboardingData.selectedPages) 
                              ? selectedOnboarding.onboardingData.selectedPages 
                              : []
                            ).map((page: string, i: number) => (
                              <span 
                                key={i}
                                className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}
                              >
                                {page}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Unique Features */}
                      {selectedOnboarding.onboardingData.uniqueFeatures && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Unieke kenmerken
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedOnboarding.onboardingData.uniqueFeatures}
                          </p>
                        </div>
                      )}

                      {/* Extra Wishes */}
                      {selectedOnboarding.onboardingData.extraWishes && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Extra wensen
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedOnboarding.onboardingData.extraWishes}
                          </p>
                        </div>
                      )}

                      {/* Competitors */}
                      {selectedOnboarding.onboardingData.competitors && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Inspiratie / Concurrenten
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedOnboarding.onboardingData.competitors}
                          </p>
                        </div>
                      )}

                      {/* Logo */}
                      {selectedOnboarding.onboardingData.hasLogo && (
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Logo status
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedOnboarding.onboardingData.hasLogo === 'yes' || selectedOnboarding.onboardingData.hasLogo === true
                              ? 'Heeft een logo' 
                              : 'Heeft nog geen logo'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`p-6 text-center rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Klant heeft nog geen gegevens ingevuld
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Stuur een herinnering of neem contact op
                    </p>
                  </div>
                )}

                {/* Payment & Package Info */}
                <div>
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CreditCard className="w-4 h-4" />
                    Pakket & Betaling
                  </h3>
                  <div className={`grid grid-cols-3 gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pakket</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {PACKAGE_CONFIG[selectedOnboarding.package]?.name || selectedOnboarding.package}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Maandelijks</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{PACKAGE_CONFIG[selectedOnboarding.package]?.price || 0}/mnd
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Betaalstatus</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedOnboarding.paymentStatus === 'paid'
                          ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                          : darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {selectedOnboarding.paymentStatus === 'paid' ? 'Betaald' : 'Wachtend'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between`}>
                <button
                  onClick={() => {
                    onSelectProject(selectedOnboarding)
                    setSelectedOnboarding(null)
                  }}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Bekijk volledig project
                </button>
                
                {selectedOnboarding.onboardingData?.isComplete && (
                  <button
                    onClick={() => moveToDesign(selectedOnboarding)}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Starten met Design
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================
// PAYMENTS VIEW - Mollie Betaallinks & Kortingscodes
// ===========================================

interface PaymentsViewProps {
  darkMode: boolean
  projects: Project[]
  onUpdateProject: (project: Project) => void
}

// Discount codes loaded from API
interface DiscountCode {
  code: string
  type: 'percentage' | 'fixed'
  value: number // percentage (0-100) or fixed amount in euros
  description: string
  validUntil?: string
  maxUses?: number
  usedCount: number
  active: boolean
}

// Package prices (monthly)
const PACKAGE_PRICING = {
  starter: { name: 'Starter', monthlyExVat: 79.34, monthlyInclVat: 96 },
  professional: { name: 'Professional', monthlyExVat: 148.76, monthlyInclVat: 180 },
  business: { name: 'Business', monthlyExVat: 248.76, monthlyInclVat: 301 },
  webshop: { name: 'Webshop', monthlyExVat: 348.76, monthlyInclVat: 422 },
}

function PaymentsView({ darkMode, projects, onUpdateProject }: PaymentsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'discounts'>('overview')
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [_loadingDiscounts, setLoadingDiscounts] = useState(true)
  
  // Payment link creation state
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [useCustomAmount, setUseCustomAmount] = useState(false)
  const [description, setDescription] = useState('')
  const [selectedDiscount, setSelectedDiscount] = useState<string>('')
  const [customDiscount, setCustomDiscount] = useState<string>('')
  const [customDiscountType, setCustomDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [generatedLink, setGeneratedLink] = useState<string>('')

  // Load discount codes from API on mount
  useEffect(() => {
    loadDiscountCodes()
  }, [])
  
  const loadDiscountCodes = async () => {
    try {
      const token = sessionStorage.getItem('webstability_dev_token')
      const response = await fetch('/api/discounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.discounts) {
          setDiscountCodes(data.discounts)
        }
      }
    } catch (error) {
      console.error('Error loading discount codes:', error)
    } finally {
      setLoadingDiscounts(false)
    }
  }
  const [isGenerating, setIsGenerating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // New discount code state
  const [showNewDiscountModal, setShowNewDiscountModal] = useState(false)
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountCode>>({
    code: '',
    type: 'percentage',
    value: 10,
    description: '',
    active: true,
  })

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  // Calculate final price
  const calculateFinalPrice = () => {
    if (!selectedProject && !useCustomAmount) return { original: 0, discount: 0, final: 0 }
    
    let originalPrice = useCustomAmount 
      ? parseFloat(customAmount) || 0
      : PACKAGE_PRICING[selectedProject?.package || 'starter'].monthlyInclVat

    let discountAmount = 0
    
    // Apply selected preset discount
    if (selectedDiscount) {
      const discount = discountCodes.find(d => d.code === selectedDiscount)
      if (discount) {
        if (discount.type === 'percentage') {
          discountAmount = originalPrice * (discount.value / 100)
        } else {
          discountAmount = discount.value
        }
      }
    }
    
    // Or apply custom discount
    if (customDiscount && !selectedDiscount) {
      const value = parseFloat(customDiscount) || 0
      if (customDiscountType === 'percentage') {
        discountAmount = originalPrice * (value / 100)
      } else {
        discountAmount = value
      }
    }

    return {
      original: originalPrice,
      discount: discountAmount,
      final: Math.max(0, originalPrice - discountAmount)
    }
  }

  const prices = calculateFinalPrice()

  // Generate payment link via Mollie API
  const generatePaymentLink = async () => {
    if (!selectedProject && !useCustomAmount) return
    
    setIsGenerating(true)
    
    try {
      const token = sessionStorage.getItem('webstability_dev_token')
      
      // Call the payment API to create a Mollie payment
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: selectedProjectId || undefined,
          amount: prices.final.toFixed(2),
          description: description || `Betaling ${selectedProject?.businessName || 'Custom'}`,
          discountCode: selectedDiscount || undefined,
          customerEmail: selectedProject?.contactEmail || undefined,
          customerName: selectedProject?.contactName || selectedProject?.businessName || undefined,
          sendEmail: true, // Flag to send payment link email
          packageName: selectedProject?.package || 'Webstability Website',
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.paymentUrl) {
          setGeneratedLink(data.paymentUrl)
          
          // Update project with payment URL if selected
          if (selectedProject) {
            onUpdateProject({
              ...selectedProject,
              paymentUrl: data.paymentUrl,
              paymentStatus: 'awaiting_payment',
              updatedAt: new Date().toISOString(),
            })
          }
          
          // Show success message if email was sent
          if (data.emailSent) {
            console.log('✅ Payment link email sent to:', selectedProject?.contactEmail)
          }
        } else {
          // Fallback to a local link if Mollie not configured
          const baseUrl = window.location.origin + '/betalen'
          const params = new URLSearchParams({
            project: selectedProjectId || 'custom',
            amount: prices.final.toFixed(2),
            desc: description || `Betaling ${selectedProject?.businessName || 'Custom'}`,
            ...(selectedDiscount && { discount: selectedDiscount }),
          })
          
          const link = `${baseUrl}?${params.toString()}`
          setGeneratedLink(link)
          
          if (selectedProject) {
            onUpdateProject({
              ...selectedProject,
              paymentUrl: link,
              paymentStatus: 'awaiting_payment',
              updatedAt: new Date().toISOString(),
            })
          }
        }
      } else {
        console.error('Failed to create payment link')
      }
    } catch (error) {
      console.error('Error generating payment link:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // Payment stats
  const stats = {
    totalPaid: projects.filter(p => p.paymentStatus === 'paid').length,
    awaiting: projects.filter(p => p.paymentStatus === 'awaiting_payment').length,
    failed: projects.filter(p => p.paymentStatus === 'failed').length,
    monthlyRevenue: projects
      .filter(p => p.paymentStatus === 'paid')
      .reduce((sum, p) => sum + PACKAGE_PRICING[p.package].monthlyInclVat, 0),
  }

  // Add new discount code via API
  const handleAddDiscount = async () => {
    if (!newDiscount.code || !newDiscount.value) return
    
    const normalizedCode = newDiscount.code!.toUpperCase().replace(/\s/g, '')
    
    try {
      const token = sessionStorage.getItem('webstability_dev_token')
      const response = await fetch('/api/discounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: normalizedCode,
          type: newDiscount.type,
          value: newDiscount.value,
          description: newDiscount.description || '',
          validUntil: newDiscount.validUntil,
          maxUses: newDiscount.maxUses,
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.discount) {
          setDiscountCodes([...discountCodes, data.discount])
        }
      }
    } catch (error) {
      console.error('Error adding discount code:', error)
    }
    
    setShowNewDiscountModal(false)
    setNewDiscount({ code: '', type: 'percentage', value: 10, description: '', active: true })
  }

  // Toggle discount active status via API
  const toggleDiscountActive = async (code: string) => {
    const discount = discountCodes.find(d => d.code === code)
    if (!discount) return
    
    // Optimistic update
    setDiscountCodes(prev => prev.map(d => 
      d.code === code ? { ...d, active: !d.active } : d
    ))
    
    try {
      const token = sessionStorage.getItem('webstability_dev_token')
      await fetch('/api/discounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code,
          active: !discount.active
        })
      })
    } catch (error) {
      console.error('Error toggling discount:', error)
      // Revert on error
      setDiscountCodes(prev => prev.map(d => 
        d.code === code ? { ...d, active: discount.active } : d
      ))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Betalingen & Mollie
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Beheer betaallinks en kortingscodes
          </p>
        </div>

        <div className={`flex rounded-xl border p-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
          {(['overview', 'create', 'discounts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white'
                  : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && 'Overzicht'}
              {tab === 'create' && 'Betaallink maken'}
              {tab === 'discounts' && 'Kortingscodes'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl ${darkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Betaald</span>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalPaid}</p>
            </div>

            <div className={`p-5 rounded-2xl ${darkMode ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500 rounded-xl">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Wachtend</span>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.awaiting}</p>
            </div>

            <div className={`p-5 rounded-2xl ${darkMode ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <span className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Mislukt</span>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.failed}</p>
            </div>

            <div className={`p-5 rounded-2xl ${darkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500 rounded-xl">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Maandomzet</span>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>€{stats.monthlyRevenue.toFixed(0)}</p>
            </div>
          </div>

          {/* Recent Payments */}
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recente betalingen
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Project</th>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pakket</th>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bedrag</th>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Acties</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {projects.slice(0, 10).map(project => {
                    const pkg = PACKAGE_PRICING[project.package]
                    const statusColors = {
                      pending: 'bg-gray-500',
                      awaiting_payment: 'bg-yellow-500',
                      paid: 'bg-green-500',
                      failed: 'bg-red-500',
                      refunded: 'bg-purple-500',
                    }
                    const statusLabels = {
                      pending: 'In afwachting',
                      awaiting_payment: 'Wacht op betaling',
                      paid: 'Betaald',
                      failed: 'Mislukt',
                      refunded: 'Terugbetaald',
                    }

                    return (
                      <tr key={project.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.businessName}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project.contactEmail}</p>
                          </div>
                        </td>
                        <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {pkg.name}
                        </td>
                        <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          €{pkg.monthlyInclVat}/m
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${statusColors[project.paymentStatus]}`}>
                            {statusLabels[project.paymentStatus]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {project.paymentUrl && (
                              <button
                                onClick={() => copyToClipboard(project.paymentUrl!)}
                                className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                title="Kopieer betaallink"
                              >
                                <Link2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedProjectId(project.id)
                                setActiveTab('create')
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                              }`}
                              title="Nieuwe betaallink"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            {(project.paymentStatus !== 'pending' || project.paymentUrl) && (
                              <button
                                onClick={() => {
                                  if (confirm('Weet je zeker dat je de betalingstatus wilt resetten naar "In afwachting"?')) {
                                    onUpdateProject({
                                      ...project,
                                      paymentStatus: 'pending',
                                      paymentUrl: undefined,
                                      updatedAt: new Date().toISOString()
                                    })
                                  }
                                }}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Reset betaling"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Payment Link Tab */}
      {activeTab === 'create' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nieuwe betaallink aanmaken
            </h2>

            <div className="space-y-5">
              {/* Project Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value)
                    setUseCustomAmount(false)
                  }}
                  disabled={useCustomAmount}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50`}
                >
                  <option value="">Selecteer project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.businessName} - {PACKAGE_PRICING[p.package].name} (€{PACKAGE_PRICING[p.package].monthlyInclVat}/m)
                    </option>
                  ))}
                </select>
              </div>

              {/* Or Custom Amount */}
              <div className="flex items-center gap-3">
                <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>of</span>
                <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={useCustomAmount}
                    onChange={(e) => {
                      setUseCustomAmount(e.target.checked)
                      if (e.target.checked) setSelectedProjectId('')
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Eigen bedrag invoeren
                  </span>
                </label>
                {useCustomAmount && (
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>€</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Beschrijving (optioneel)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="bv. Website ontwikkeling januari 2025"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                />
              </div>

              {/* Discount Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kortingscode toepassen
                </label>
                <select
                  value={selectedDiscount}
                  onChange={(e) => {
                    setSelectedDiscount(e.target.value)
                    if (e.target.value) setCustomDiscount('')
                  }}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                >
                  <option value="">Geen kortingscode</option>
                  {discountCodes.filter(d => d.active).map(d => (
                    <option key={d.code} value={d.code}>
                      {d.code} - {d.type === 'percentage' ? `${d.value}%` : `€${d.value}`} ({d.description})
                    </option>
                  ))}
                </select>
              </div>

              {/* Or Custom Discount */}
              {!selectedDiscount && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Of directe korting geven
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={customDiscountType}
                      onChange={(e) => setCustomDiscountType(e.target.value as 'percentage' | 'fixed')}
                      className={`px-3 py-3 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">€</option>
                    </select>
                    <input
                      type="number"
                      value={customDiscount}
                      onChange={(e) => setCustomDiscount(e.target.value)}
                      placeholder={customDiscountType === 'percentage' ? 'bv. 10' : 'bv. 25'}
                      className={`flex-1 px-4 py-3 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generatePaymentLink}
                disabled={isGenerating || (!selectedProjectId && !useCustomAmount) || (useCustomAmount && !customAmount)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Genereren...
                  </>
                ) : (
                  <>
                    <Link2 className="w-5 h-5" />
                    Betaallink genereren
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Betalingsoverzicht
            </h2>

            <div className="space-y-4">
              {/* Project Info */}
              {selectedProject && (
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Project</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedProject.businessName}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedProject.contactName} • {PACKAGE_PRICING[selectedProject.package].name}
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className={`p-4 rounded-xl space-y-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Originele prijs</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>€{prices.original.toFixed(2)}</span>
                </div>
                
                {prices.discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Korting</span>
                    <span>-€{prices.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className={`pt-3 border-t flex justify-between ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Te betalen</span>
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>€{prices.final.toFixed(2)}</span>
                </div>
              </div>

              {/* Generated Link */}
              {generatedLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border-2 ${
                    darkMode ? 'bg-green-900/20 border-green-500/50' : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      Betaallink gegenereerd!
                    </span>
                  </div>
                  
                  <div className={`p-3 rounded-lg mb-3 break-all text-sm ${
                    darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
                  }`}>
                    {generatedLink}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedLink)}
                      className={`flex-1 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                        copySuccess
                          ? 'bg-green-500 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Gekopieerd!
                        </>
                      ) : (
                        <>
                          <Link2 className="w-4 h-4" />
                          Kopieer link
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => window.open(`mailto:${selectedProject?.contactEmail}?subject=Betaallink&body=Beste ${selectedProject?.contactName},%0D%0A%0D%0AHierbij de betaallink: ${encodeURIComponent(generatedLink)}%0D%0A%0D%0AMet vriendelijke groet`)}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Discount Codes Tab */}
      {activeTab === 'discounts' && (
        <div className="space-y-6">
          {/* Add New Code Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowNewDiscountModal(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nieuwe kortingscode
            </button>
          </div>

          {/* Discount Codes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discountCodes.map(code => (
              <motion.div
                key={code.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border transition-all ${
                  code.active
                    ? darkMode 
                      ? 'bg-gray-800/50 border-gray-700' 
                      : 'bg-white border-gray-200'
                    : darkMode
                      ? 'bg-gray-800/30 border-gray-700/50 opacity-60'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-3 py-1 rounded-lg font-mono font-bold text-sm ${
                    code.active
                      ? 'bg-emerald-500 text-white'
                      : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {code.code}
                  </div>
                  <button
                    onClick={() => toggleDiscountActive(code.code)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      code.active
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        : darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {code.active ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                </div>

                <div className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {code.type === 'percentage' ? `${code.value}%` : `€${code.value}`}
                  <span className={`text-sm font-normal ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>korting</span>
                </div>

                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {code.description || 'Geen beschrijving'}
                </p>

                <div className={`flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span>{code.usedCount}x gebruikt</span>
                  {code.validUntil && (
                    <span>Geldig t/m {new Date(code.validUntil).toLocaleDateString('nl-NL')}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* New Discount Modal */}
      <AnimatePresence>
        {showNewDiscountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewDiscountModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Nieuwe kortingscode
                </h3>
                <button
                  onClick={() => setShowNewDiscountModal(false)}
                  className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Code
                  </label>
                  <input
                    type="text"
                    value={newDiscount.code}
                    onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                    placeholder="bv. ZOMER2025"
                    className={`w-full px-4 py-3 rounded-xl border font-mono ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Type
                    </label>
                    <select
                      value={newDiscount.type}
                      onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as 'percentage' | 'fixed' })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Vast bedrag (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Waarde
                    </label>
                    <input
                      type="number"
                      value={newDiscount.value}
                      onChange={(e) => setNewDiscount({ ...newDiscount, value: parseFloat(e.target.value) })}
                      placeholder="10"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Beschrijving
                  </label>
                  <input
                    type="text"
                    value={newDiscount.description}
                    onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                    placeholder="bv. Zomeractie korting"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Geldig tot (optioneel)
                  </label>
                  <input
                    type="date"
                    value={newDiscount.validUntil || ''}
                    onChange={(e) => setNewDiscount({ ...newDiscount, validUntil: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                  />
                </div>

                <button
                  onClick={handleAddDiscount}
                  disabled={!newDiscount.code || !newDiscount.value}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kortingscode toevoegen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================
// SERVICES VIEW - Extra Services Management
// ===========================================

interface ServicesViewProps {
  darkMode: boolean
  serviceRequests: ServiceRequest[]
  onUpdateRequest: (request: ServiceRequest) => void
}

const SERVICE_DETAILS: Record<ServiceType, { 
  name: string
  icon: typeof Camera
  color: string
  bgColor: string
  description: string
  basePrice: number
}> = {
  drone: { 
    name: 'Dronebeelden', 
    icon: Plane, 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    description: 'Professionele luchtfotografie en video',
    basePrice: 399
  },
  logo: { 
    name: 'Logo Design', 
    icon: PenTool, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    description: 'Custom logo ontwerp met revisierondes',
    basePrice: 299
  },
  foto: { 
    name: 'Fotografie', 
    icon: Camera, 
    color: 'text-pink-500',
    bgColor: 'bg-pink-500',
    description: 'Productfotografie en bedrijfsfoto\'s',
    basePrice: 349
  },
  tekst: { 
    name: 'Tekstschrijven', 
    icon: FileText, 
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    description: 'SEO-geoptimaliseerde webteksten',
    basePrice: 199
  },
  seo: { 
    name: 'SEO Optimalisatie', 
    icon: TrendingUp, 
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    description: 'Zoekmachine optimalisatie pakket',
    basePrice: 449
  },
}

function ServicesView({ darkMode, serviceRequests, onUpdateRequest }: ServicesViewProps) {
  const [filterStatus, setFilterStatus] = useState<ServiceRequest['status'] | 'all'>('all')
  const [filterType, setFilterType] = useState<ServiceType | 'all'>('all')
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [quotePrice, setQuotePrice] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')

  const filteredRequests = serviceRequests.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus
    const matchesType = filterType === 'all' || r.type === filterType
    return matchesStatus && matchesType
  })

  const stats = {
    pending: serviceRequests.filter(r => r.status === 'pending').length,
    inProgress: serviceRequests.filter(r => r.status === 'in_progress').length,
    completed: serviceRequests.filter(r => r.status === 'completed').length,
    totalRevenue: serviceRequests
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.price || 0), 0),
  }

  const handleStatusChange = (request: ServiceRequest, newStatus: ServiceRequest['status']) => {
    onUpdateRequest({ ...request, status: newStatus })
  }

  const handleSendQuote = () => {
    if (!selectedRequest || !quotePrice) return
    
    onUpdateRequest({
      ...selectedRequest,
      price: parseFloat(quotePrice),
      status: 'pending',
    })
    
    setShowQuoteModal(false)
    setSelectedRequest(null)
    setQuotePrice('')
    setQuoteNotes('')
  }

  const getStatusBadge = (status: ServiceRequest['status']) => {
    const badges = {
      pending: { label: 'In afwachting', color: 'bg-yellow-500' },
      in_progress: { label: 'In uitvoering', color: 'bg-emerald-500' },
      completed: { label: 'Afgerond', color: 'bg-green-500' },
      cancelled: { label: 'Geannuleerd', color: 'bg-gray-500' },
    }
    return badges[status]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Extra Services
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Beheer service aanvragen voor drone, logo, foto, tekst en SEO
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ServiceType | 'all')}
            className={`px-3 py-2 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
          >
            <option value="all">Alle types</option>
            {Object.entries(SERVICE_DETAILS).map(([key, s]) => (
              <option key={key} value={key}>{s.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ServiceRequest['status'] | 'all')}
            className={`px-3 py-2 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
          >
            <option value="all">Alle statussen</option>
            <option value="pending">In afwachting</option>
            <option value="in_progress">In uitvoering</option>
            <option value="completed">Afgerond</option>
            <option value="cancelled">Geannuleerd</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Nieuw</span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.pending}</p>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <Loader2 className="w-5 h-5 text-white" />
            </div>
            <span className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>In uitvoering</span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.inProgress}</p>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Afgerond</span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.completed}</p>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500 rounded-xl">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Omzet</span>
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>€{stats.totalRevenue}</p>
        </div>
      </div>

      {/* Service Requests Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map(request => {
          const service = SERVICE_DETAILS[request.type]
          const status = getStatusBadge(request.status)
          const ServiceIcon = service.icon

          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${service.bgColor}`}>
                    <ServiceIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {service.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {request.clientName}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {request.description}
              </p>

              {/* Price & Date */}
              <div className={`flex items-center justify-between text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(request.createdAt).toLocaleDateString('nl-NL')}
                </span>
                {request.price && (
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    €{request.price}
                  </span>
                )}
              </div>

              {/* Contact */}
              <div className={`flex gap-2 mb-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <a href={`mailto:${request.clientEmail}`} className="hover:text-emerald-500 truncate">
                  {request.clientEmail}
                </a>
                {request.clientPhone && (
                  <>
                    <span>•</span>
                    <a href={`tel:${request.clientPhone}`} className="hover:text-emerald-500">
                      {request.clientPhone}
                    </a>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(request, 'in_progress')}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      Starten
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request)
                        setQuotePrice(request.price?.toString() || service.basePrice.toString())
                        setShowQuoteModal(true)
                      }}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Offerte
                    </button>
                  </>
                )}
                {request.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange(request, 'completed')}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Afronden
                  </button>
                )}
                {request.status === 'completed' && (
                  <div className={`flex-1 py-2 text-center text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ✓ Afgerond
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className={`p-12 text-center rounded-2xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'
        }`}>
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Geen service aanvragen gevonden</p>
        </div>
      )}

      {/* Quote Modal */}
      <AnimatePresence>
        {showQuoteModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Offerte versturen
                </h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Klant</p>
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedRequest.clientName}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {SERVICE_DETAILS[selectedRequest.type].name}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Prijs (incl. BTW)
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>€</span>
                    <input
                      type="number"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Richtprijs: €{SERVICE_DETAILS[selectedRequest.type].basePrice}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notities (optioneel)
                  </label>
                  <textarea
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Extra informatie voor de klant..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border resize-none ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                  />
                </div>

                <button
                  onClick={handleSendQuote}
                  disabled={!quotePrice}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Offerte versturen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================
// SETTINGS VIEW - Profile & Configuration
// ===========================================

interface SettingsViewProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

function SettingsView({ darkMode, setDarkMode }: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'api' | 'danger'>('profile')
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: 'Developer',
    email: 'developer@webstability.nl',
    phone: '+31 6 12345678',
    avatar: '',
  })
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNewProject: true,
    emailNewMessage: true,
    emailPayment: true,
    pushNewProject: false,
    pushNewMessage: true,
    pushPayment: true,
    weeklyReport: true,
  })

  // API Keys (mock)
  const [apiKeys] = useState([
    { id: 'key-1', name: 'Mollie Live', key: 'live_xxxxxxxxxxxxxxxx', created: '2024-01-15' },
    { id: 'key-2', name: 'Mollie Test', key: 'test_xxxxxxxxxxxxxxxx', created: '2024-01-15' },
  ])

  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const sections = [
    { id: 'profile', label: 'Profiel', icon: User },
    { id: 'notifications', label: 'Notificaties', icon: Bell },
    { id: 'api', label: 'API Sleutels', icon: Lock },
    { id: 'danger', label: 'Gevaarzone', icon: AlertCircle },
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className={`lg:w-64 flex-shrink-0 p-4 rounded-2xl border ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-lg font-bold mb-4 px-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Instellingen
        </h2>
        <nav className="space-y-1">
          {sections.map(section => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as typeof activeSection)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : darkMode 
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium">Thema</span>
            </div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {darkMode ? 'Donker' : 'Licht'}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 p-6 rounded-2xl border ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Profiel
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Beheer je persoonlijke gegevens
              </p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {profileData.name.charAt(0)}
              </div>
              <div>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors">
                  Foto wijzigen
                </button>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  JPG, PNG max 2MB
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Naam
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  E-mail
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Telefoon
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Opslaan...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Opgeslagen!
                  </>
                ) : (
                  'Wijzigingen opslaan'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notificaties
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Beheer je notificatie voorkeuren
              </p>
            </div>

            {/* Email Notifications */}
            <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Mail className="w-5 h-5" />
                E-mail notificaties
              </h4>
              <div className="space-y-3">
                {[
                  { key: 'emailNewProject', label: 'Nieuw project aangemaakt' },
                  { key: 'emailNewMessage', label: 'Nieuw bericht van klant' },
                  { key: 'emailPayment', label: 'Betaling ontvangen' },
                  { key: 'weeklyReport', label: 'Wekelijks overzicht' },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between cursor-pointer">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.label}</span>
                    <div 
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-emerald-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Bell className="w-5 h-5" />
                Push notificaties
              </h4>
              <div className="space-y-3">
                {[
                  { key: 'pushNewProject', label: 'Nieuw project aangemaakt' },
                  { key: 'pushNewMessage', label: 'Nieuw bericht van klant' },
                  { key: 'pushPayment', label: 'Betaling ontvangen' },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between cursor-pointer">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.label}</span>
                    <div 
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-emerald-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* API Keys Section */}
        {activeSection === 'api' && (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                API Sleutels
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Beheer je API sleutels voor externe integraties
              </p>
            </div>

            <div className="space-y-4">
              {apiKeys.map(apiKey => (
                <div
                  key={apiKey.id}
                  className={`p-4 rounded-xl border ${
                    darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {apiKey.name}
                    </h4>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Aangemaakt: {new Date(apiKey.created).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className={`flex-1 px-3 py-2 rounded-lg text-sm font-mono ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
                    }`}>
                      {showApiKey === apiKey.id ? apiKey.key : '••••••••••••••••'}
                    </code>
                    <button
                      onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(apiKey.key)}
                      className={`p-2 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}>
              <Plus className="w-4 h-4" />
              Nieuwe API sleutel
            </button>
          </div>
        )}

        {/* Danger Zone Section */}
        {activeSection === 'danger' && (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Gevaarzone
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Wees voorzichtig met deze acties
              </p>
            </div>

            <div className={`p-5 rounded-xl border-2 ${
              darkMode ? 'bg-red-900/10 border-red-500/30' : 'bg-red-50 border-red-200'
            }`}>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                Wachtwoord wijzigen
              </h4>
              <p className={`text-sm mb-4 ${darkMode ? 'text-red-400/70' : 'text-red-600'}`}>
                Wijzig je wachtwoord. Je wordt uitgelogd op alle apparaten.
              </p>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors">
                Wachtwoord wijzigen
              </button>
            </div>

            <div className={`p-5 rounded-xl border-2 ${
              darkMode ? 'bg-red-900/10 border-red-500/30' : 'bg-red-50 border-red-200'
            }`}>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                Cache wissen
              </h4>
              <p className={`text-sm mb-4 ${darkMode ? 'text-red-400/70' : 'text-red-600'}`}>
                Wis alle lokale cache data. Dit kan tijdelijk de prestaties beïnvloeden.
              </p>
              <button 
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.reload()
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
              >
                Cache wissen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function DeveloperDashboardNew() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // UI state
  const [activeView, setActiveView] = useState<DashboardView>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(DARK_MODE_KEY) === 'true'
    }
    return false
  })

  // Data state
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Log selected project for debugging (will be used in project detail view)
  useEffect(() => {
    if (selectedProject) {
      console.log('Selected project:', selectedProject.businessName)
    }
  }, [selectedProject])

  // Check auth on mount
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY)
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(DARK_MODE_KEY, String(darkMode))
  }, [darkMode])

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  // Auto-refresh data every 30 seconds for real-time updates
  useEffect(() => {
    if (!isAuthenticated) return
    
    const refreshInterval = setInterval(() => {
      loadData()
    }, 30000) // 30 seconds
    
    return () => clearInterval(refreshInterval)
  }, [isAuthenticated])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      if (e.key === 'Escape') {
        setSidebarOpen(false)
      }
      if (e.key === 'd' || e.key === 'D') {
        setDarkMode(!darkMode)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [darkMode])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load projects from API
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem(TOKEN_KEY)}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.projects) {
          const mappedProjects: Project[] = data.projects.map((p: any) => ({
            id: p.id,
            projectId: p.id,
            businessName: p.customer?.companyName || p.customer?.name || 'Onbekend',
            contactName: p.customer?.name || '',
            contactEmail: p.customer?.email || '',
            contactPhone: p.customer?.phone || '',
            package: mapPackageType(p.packageType || p.package || 'starter'),
            phase: mapStatus(p.status),
            paymentStatus: mapPaymentStatus(p.paymentStatus),
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            stagingUrl: p.stagingUrl || p.previewUrl || '',
            liveUrl: p.liveUrl || '',
            designApproved: p.designApproved || !!p.designApprovedAt,
            designApprovedAt: p.designApprovedAt || '',
            messages: p.messages || [],
            onboardingData: p.onboardingData || {},
            type: p.type,
            internalNotes: p.internalNotes || '',
          }))
          setProjects(mappedProjects)
          
          // Generate clients from projects
          const clientMap = new Map<string, Client>()
          const packagePrices = { starter: 96, professional: 180, business: 301, webshop: 422 }
          mappedProjects.forEach((p: Project) => {
            const projectPrice = packagePrices[p.package] || 0
            if (p.contactEmail && !clientMap.has(p.contactEmail)) {
              clientMap.set(p.contactEmail, {
                id: p.contactEmail,
                name: p.contactName || p.businessName,
                email: p.contactEmail,
                phone: p.contactPhone || '',
                company: p.businessName,
                projects: [p.id],
                totalSpent: p.paymentStatus === 'paid' ? projectPrice : 0,
                createdAt: p.createdAt || new Date().toISOString(),
              })
            } else if (p.contactEmail) {
              const existing = clientMap.get(p.contactEmail)!
              existing.projects.push(p.id)
              if (p.paymentStatus === 'paid') {
                existing.totalSpent += projectPrice
              }
            }
          })
          setClients(Array.from(clientMap.values()))
        }
      }
      
      // Load service requests from API
      try {
        const serviceResponse = await fetch('/api/services', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem(TOKEN_KEY)}`
          }
        })
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json()
          if (serviceData.services) {
            setServiceRequests(serviceData.services)
          }
        }
      } catch {
        // Services endpoint might not exist yet, that's ok
        console.log('Services endpoint not available')
      }
      
      // Generate notifications from projects
      generateNotifications()
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions for mapping API data
  const mapStatus = (status: string): ProjectPhase => {
    const statusMap: Record<string, ProjectPhase> = {
      'pending': 'onboarding',
      'onboarding': 'onboarding',
      'intake': 'onboarding',
      'design': 'design',
      'development': 'development',
      'review': 'review',
      'revisions': 'review',
      'live': 'live',
    }
    return statusMap[status] || 'onboarding'
  }
  
  const mapPaymentStatus = (status: string): PaymentStatus => {
    const paymentMap: Record<string, PaymentStatus> = {
      'pending': 'pending',
      'unpaid': 'pending',
      'awaiting_payment': 'awaiting_payment',
      'paid': 'paid',
      'failed': 'failed',
      'refunded': 'refunded',
    }
    return paymentMap[status] || 'pending'
  }
  
  const mapPackageType = (pkg: string): 'starter' | 'professional' | 'business' | 'webshop' => {
    const pkgMap: Record<string, 'starter' | 'professional' | 'business' | 'webshop'> = {
      'starter': 'starter',
      'professional': 'professional',
      'professioneel': 'professional',
      'business': 'business',
      'premium': 'business',
      'webshop': 'webshop',
    }
    return pkgMap[pkg.toLowerCase()] || 'starter'
  }

  const generateNotifications = () => {
    const newNotifications: Notification[] = []
    
    projects.forEach(p => {
      p.messages.filter(m => !m.read && m.from === 'client').forEach(m => {
        newNotifications.push({
          id: `msg-${m.id}`,
          type: 'message',
          title: 'Nieuw bericht',
          message: `${p.contactName}: ${m.message.substring(0, 50)}...`,
          projectId: p.id,
          read: false,
          createdAt: m.date,
        })
      })
    })
    
    setNotifications(newNotifications)
  }

  const handleLogin = async (password: string): Promise<boolean> => {
    // Local dev check
    if (password === DEV_PASSWORD) {
      sessionStorage.setItem(TOKEN_KEY, 'dev-token')
      sessionStorage.setItem(AUTH_KEY, 'true')
      setIsAuthenticated(true)
      return true
    }
    
    // API login
    try {
      const response = await fetch('/api/developer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        sessionStorage.setItem(TOKEN_KEY, data.token)
        sessionStorage.setItem(AUTH_KEY, 'true')
        setIsAuthenticated(true)
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
    }
    
    return false
  }

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
    setProjects([])
    setClients([])
    setNotifications([])
  }

  // Update project via API and local state
  const handleUpdateProject = async (updatedProject: Project) => {
    // Optimistically update local state
    setProjects(prev => prev.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ))

    // Update in API/database
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: updatedProject.id,
          status: updatedProject.phase,
          phase: updatedProject.phase,
          paymentStatus: updatedProject.paymentStatus,
          stagingUrl: updatedProject.stagingUrl,
          liveUrl: updatedProject.liveUrl,
          designApproved: updatedProject.designApproved,
          designApprovedAt: updatedProject.designApprovedAt,
          messages: updatedProject.messages,
          internalNotes: updatedProject.internalNotes,
        })
      })
      
      if (!response.ok) {
        console.error('Failed to update project')
        // Revert on failure
        // loadData()
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  // Delete project via API and local state
  const handleDeleteProject = async (projectId: string) => {
    // Optimistically remove from local state
    setProjects(prev => prev.filter(p => p.id !== projectId))

    // Delete from API/database
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        console.error('Failed to delete project')
        // Reload data to restore state
        loadData()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      loadData()
    }
  }

  // Update service request via API
  const handleUpdateService = async (updatedRequest: ServiceRequest) => {
    // Optimistically update local state
    setServiceRequests(prev => prev.map(r => 
      r.id === updatedRequest.id ? updatedRequest : r
    ))

    // Update in API/database
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedRequest)
      })
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Calculate badge counts
  const unreadMessages = projects.reduce((acc, p) => 
    acc + p.messages.filter(m => !m.read && m.from === 'client').length, 0
  )
  const pendingOnboarding = projects.filter(p => p.phase === 'onboarding').length

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        darkMode={darkMode}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        unreadMessages={unreadMessages}
        pendingOnboarding={pendingOnboarding}
        onLogout={handleLogout}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-0">
        {/* Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenuClick={() => setSidebarOpen(true)}
          notifications={notifications}
          onMarkAllRead={markAllNotificationsRead}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeView={activeView}
          onRefresh={loadData}
          isRefreshing={loading}
          onNavigateToOverview={() => setActiveView('overview')}
        />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto pb-24 md:pb-6 dashboard-scroll">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeView === 'overview' && (
                  <OverviewView
                    darkMode={darkMode}
                    projects={projects}
                    clients={clients}
                    serviceRequests={serviceRequests}
                    setActiveView={setActiveView}
                    onSelectProject={(project) => {
                      setSelectedProject(project)
                      setActiveView('projects')
                    }}
                    onUpdateProject={handleUpdateProject}
                  />
                )}
                {activeView === 'projects' && (
                  <ProjectsView 
                    darkMode={darkMode} 
                    projects={projects}
                    onUpdateProject={handleUpdateProject}
                    onDeleteProject={handleDeleteProject}
                    onSelectProject={setSelectedProject}
                    onNavigateToPayments={() => setActiveView('payments')}
                  />
                )}
                {activeView === 'clients' && (
                  <ClientsView 
                    darkMode={darkMode}
                    clients={clients}
                    projects={projects}
                    onSelectClient={() => {}}
                    onAddClient={(client) => setClients(prev => [client, ...prev])}
                    onDeleteClient={async (clientId, projectIds) => {
                      // Delete all associated projects from the API
                      for (const projectId of projectIds) {
                        await fetch(`/api/projects?id=${projectId}`, {
                          method: 'DELETE'
                        })
                      }
                      // Remove client from state
                      setClients(prev => prev.filter(c => c.id !== clientId))
                      // Remove projects from state
                      setProjects(prev => prev.filter(p => !projectIds.includes(p.id)))
                    }}
                  />
                )}
                {activeView === 'messages' && (
                  <MessagesView 
                    darkMode={darkMode}
                    projects={projects}
                    onUpdateProject={handleUpdateProject}
                  />
                )}
                {activeView === 'onboarding' && (
                  <OnboardingView 
                    darkMode={darkMode}
                    projects={projects}
                    onUpdateProject={handleUpdateProject}
                    onSelectProject={setSelectedProject}
                  />
                )}
                {activeView === 'payments' && (
                  <PaymentsView 
                    darkMode={darkMode}
                    projects={projects}
                    onUpdateProject={handleUpdateProject}
                  />
                )}
                {activeView === 'services' && (
                  <ServicesView 
                    darkMode={darkMode}
                    serviceRequests={serviceRequests}
                    onUpdateRequest={handleUpdateService}
                  />
                )}
                {activeView === 'settings' && (
                  <SettingsView 
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activeView={activeView}
          setActiveView={setActiveView}
          darkMode={darkMode}
          unreadMessages={unreadMessages}
        />
      </div>
    </div>
  )
}
