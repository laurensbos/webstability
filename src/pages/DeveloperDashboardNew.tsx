import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
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
  AlertCircle,
  Rocket,
  Loader2,
  Lock,
  Wallet,
  TrendingDown,
  Palette,
  Camera,
  Plane,
  PenTool
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

type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'payment' | 'live'
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
  onboarding: { label: 'Onboarding', color: 'text-blue-600', bg: 'bg-blue-100', icon: FileText },
  design: { label: 'Design', color: 'text-amber-600', bg: 'bg-amber-100', icon: Palette },
  feedback: { label: 'Feedback', color: 'text-indigo-600', bg: 'bg-indigo-100', icon: MessageSquare },
  payment: { label: 'Betaling', color: 'text-purple-600', bg: 'bg-purple-100', icon: CreditCard },
  live: { label: 'Live', color: 'text-green-600', bg: 'bg-green-100', icon: Rocket },
}

const _SERVICE_CONFIG: Record<ServiceType, { name: string; icon: typeof Camera; color: string }> = {
  drone: { name: 'Dronebeelden', icon: Plane, color: 'orange' },
  logo: { name: 'Logo Design', icon: PenTool, color: 'purple' },
  foto: { name: 'Fotografie', icon: Camera, color: 'pink' },
  tekst: { name: 'Tekstschrijven', icon: FileText, color: 'blue' },
  seo: { name: 'SEO Optimalisatie', icon: TrendingUp, color: 'green' },
}
void _SERVICE_CONFIG // Reserved for future use

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
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 bottom-0 w-72 z-50 lg:translate-x-0 lg:static lg:z-auto flex flex-col ${
          darkMode 
            ? 'bg-gray-900 border-r border-gray-800' 
            : 'bg-white border-r border-gray-200'
        }`}
      >
        {/* Logo */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <Logo variant={darkMode ? 'white' : 'default'} />
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
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
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
        <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
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
      </motion.aside>
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
}

function Header({ 
  darkMode, 
  setDarkMode, 
  onMenuClick, 
  notifications,
  onMarkAllRead,
  searchTerm,
  setSearchTerm,
  activeView
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

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

          {/* Page title - Mobile */}
          <h1 className={`lg:hidden text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {NAV_ITEMS.find(item => item.id === activeView)?.label}
          </h1>

          {/* Search - Desktop */}
          <div className="hidden lg:block relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoeken..."
              className={`w-64 pl-10 pr-4 py-2 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-800 text-white placeholder-gray-500' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search button - Mobile */}
          <button className={`lg:hidden p-2 rounded-lg ${
            darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}>
            <Search className="w-5 h-5" />
          </button>

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
                        className="text-sm text-blue-500 hover:text-blue-600"
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
                              : `border-gray-100 ${n.read ? '' : 'bg-blue-50/50'} hover:bg-gray-50`
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              n.type === 'message' ? 'bg-blue-100 text-blue-600' :
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
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
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
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    amber: 'from-amber-500 to-orange-600',
    purple: 'from-purple-500 to-violet-600',
    red: 'from-red-500 to-rose-600',
    cyan: 'from-cyan-500 to-blue-600',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
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
          <p className="text-blue-200 mt-1">Log in om door te gaan</p>
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
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Wachtwoord
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <p className="text-center text-blue-300/60 text-sm mt-6">
          © {new Date().getFullYear()} Webstability
        </p>
      </motion.div>
    </div>
  )
}

// ===========================================
// OVERVIEW VIEW
// ===========================================

interface OverviewViewProps {
  darkMode: boolean
  projects: Project[]
  clients: Client[]
  serviceRequests: ServiceRequest[]
  setActiveView: (view: DashboardView) => void
}

function OverviewView({ darkMode, projects, clients, serviceRequests, setActiveView }: OverviewViewProps) {
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.phase !== 'live').length,
    unreadMessages: projects.reduce((acc, p) => 
      acc + p.messages.filter(m => !m.read && m.from === 'client').length, 0
    ),
    pendingPayments: projects.filter(p => p.paymentStatus === 'awaiting_payment').length,
    monthlyRevenue: projects.filter(p => p.phase === 'live').reduce((acc, p) => 
      acc + (PACKAGE_CONFIG[p.package]?.price || 0), 0
    ),
    totalClients: clients.length,
    pendingServices: serviceRequests.filter(s => s.status === 'pending').length,
  }

  const readyToGoLive = projects.filter(p => p.paymentStatus === 'paid' && p.phase === 'payment')
  const awaitingPayment = projects.filter(p => p.designApproved && p.paymentStatus === 'awaiting_payment')

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Welkom terug! 👋
        </h1>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Hier is een overzicht van je projecten en activiteiten.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderKanban}
          label="Actieve projecten"
          value={stats.activeProjects}
          subValue={`${stats.totalProjects} totaal`}
          color="blue"
          darkMode={darkMode}
          delay={0}
        />
        <StatCard
          icon={MessageSquare}
          label="Ongelezen berichten"
          value={stats.unreadMessages}
          color="purple"
          darkMode={darkMode}
          delay={0.05}
        />
        <StatCard
          icon={Wallet}
          label="Maandelijks inkomen"
          value={`€${stats.monthlyRevenue}`}
          subValue={`${projects.filter(p => p.phase === 'live').length} abonnementen`}
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

      {/* Action Required Sections */}
      {readyToGoLive.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl border-2 ${
            darkMode 
              ? 'bg-green-900/20 border-green-500/50' 
              : 'bg-green-50 border-green-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-xl">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🚀 Klaar om live te gaan!
              </h3>
              <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                {readyToGoLive.length} project{readyToGoLive.length > 1 ? 'en' : ''} betaald en klaar voor livegang
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {readyToGoLive.map(p => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
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
                      {PACKAGE_CONFIG[p.package]?.name}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  <span className="hidden sm:inline">Zet live</span>
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {awaitingPayment.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`p-6 rounded-2xl border-2 ${
            darkMode 
              ? 'bg-amber-900/20 border-amber-500/50' 
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500 rounded-xl">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                💳 Wacht op betaling
              </h3>
              <p className={`text-sm ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                Design goedgekeurd, wacht op eerste betaling
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {awaitingPayment.map(p => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
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
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                  Wacht op betaling
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions + Recent Projects */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Snelle acties
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Plus, label: 'Nieuw project', color: 'blue', view: 'projects' as DashboardView },
              { icon: Users, label: 'Klanten', color: 'green', view: 'clients' as DashboardView },
              { icon: MessageSquare, label: 'Berichten', color: 'purple', view: 'messages' as DashboardView },
              { icon: Link2, label: 'Betaallink', color: 'amber', view: 'payments' as DashboardView },
            ].map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView(action.view)}
                className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`p-2 rounded-lg bg-${action.color}-500`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
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
              Recente projecten
            </h3>
            <button
              onClick={() => setActiveView('projects')}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Bekijk alle
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 4).map(p => {
              const phase = PHASE_CONFIG[p.phase]
              const PhaseIcon = phase.icon
              return (
                <div
                  key={p.id}
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
                  <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              )
            })}
            {projects.length === 0 && (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <FolderKanban className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nog geen projecten</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ===========================================
// PLACEHOLDER VIEWS (will be expanded in next steps)
// ===========================================

function ProjectsView({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Projecten
      </h2>
      <p>Wordt uitgebreid in stap 4...</p>
    </div>
  )
}

function ClientsView({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Klanten
      </h2>
      <p>Wordt uitgebreid in stap 4...</p>
    </div>
  )
}

function MessagesView({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Berichten
      </h2>
      <p>Wordt uitgebreid in stap 5...</p>
    </div>
  )
}

function OnboardingView({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Onboarding Aanvragen
      </h2>
      <p>Wordt uitgebreid in stap 6...</p>
    </div>
  )
}

function PaymentsView({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Betalingen & Mollie
      </h2>
      <p>Wordt uitgebreid met betaallinks in een latere stap...</p>
    </div>
  )
}

function ServicesView({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Extra Services
      </h2>
      <p>Wordt uitgebreid in een latere stap...</p>
    </div>
  )
}

function SettingsView({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Instellingen
      </h2>
      <p>Wordt uitgebreid in stap 7...</p>
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
  const [serviceRequests, _setServiceRequests] = useState<ServiceRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [_loading, setLoading] = useState(false)
  void _setServiceRequests // Reserved for future use
  void _loading // Reserved for future use

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
      const response = await fetch('/api/developer/projects', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem(TOKEN_KEY)}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.projects) {
          setProjects(data.projects.map((p: any) => ({
            ...p,
            id: p.projectId || p.id,
            messages: p.messages || [],
          })))
        }
      }

      // Generate clients from projects
      // In production, this would come from API
      
      // Generate notifications from projects
      generateNotifications()
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
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
      <div className="flex-1 flex flex-col min-w-0">
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
        />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
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
                />
              )}
              {activeView === 'projects' && <ProjectsView darkMode={darkMode} />}
              {activeView === 'clients' && <ClientsView darkMode={darkMode} />}
              {activeView === 'messages' && <MessagesView darkMode={darkMode} />}
              {activeView === 'onboarding' && <OnboardingView darkMode={darkMode} />}
              {activeView === 'payments' && <PaymentsView darkMode={darkMode} />}
              {activeView === 'services' && <ServicesView darkMode={darkMode} />}
              {activeView === 'settings' && <SettingsView darkMode={darkMode} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
