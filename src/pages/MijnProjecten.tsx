/**
 * Mijn Projecten - Klantendashboard voor meerdere projecten
 * 
 * Toegang via: /mijn-projecten
 * 
 * Klanten kunnen hier al hun projecten zien en beheren.
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderOpen,
  Plus,
  Search,
  Loader2,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Rocket,
  Palette,
  Code,
  FileText,
  MessageSquare,
  Mail,
  LogOut,
  User,
  RefreshCw
} from 'lucide-react'
import Logo from '../components/Logo'

interface ProjectSummary {
  projectId: string
  businessName: string
  status: string
  type: string
  package: string
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof FileText }> = {
  onboarding: { label: 'Onboarding', color: 'text-blue-500', bg: 'bg-blue-500/20', icon: FileText },
  design: { label: 'Design', color: 'text-amber-500', bg: 'bg-amber-500/20', icon: Palette },
  design_approved: { label: 'Goedgekeurd', color: 'text-indigo-500', bg: 'bg-indigo-500/20', icon: CheckCircle2 },
  development: { label: 'Development', color: 'text-purple-500', bg: 'bg-purple-500/20', icon: Code },
  review: { label: 'Review', color: 'text-cyan-500', bg: 'bg-cyan-500/20', icon: MessageSquare },
  live: { label: 'Live', color: 'text-green-500', bg: 'bg-green-500/20', icon: Rocket }
}

const TYPE_LABELS: Record<string, string> = {
  website: 'Website',
  webshop: 'Webshop',
  drone: 'Drone Video',
  logo: 'Logo Design'
}

export default function MijnProjecten() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  // Projects state
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  
  // Check for existing session
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('customer_email')
    const storedProjects = sessionStorage.getItem('customer_projects')
    
    if (storedEmail && storedProjects) {
      setCustomerEmail(storedEmail)
      setProjects(JSON.parse(storedProjects))
      setIsLoggedIn(true)
    }
    
    // Check for email in URL params
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  // Login handler - zoek projecten op email
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setLoginLoading(true)
    setLoginError('')
    
    try {
      // Zoek projecten op email
      const response = await fetch(`/api/project-lookup?q=${encodeURIComponent(email.trim())}`)
      const data = await response.json()
      
      if (data.success && data.projects?.length > 0) {
        // Als er maar 1 project is, redirect direct naar dat project
        if (data.projects.length === 1) {
          navigate(`/project/${data.projects[0].projectId}`)
          return
        }
        
        // Meerdere projecten - toon overzicht
        setProjects(data.projects)
        setCustomerEmail(email.trim())
        setIsLoggedIn(true)
        
        // Sla op in session
        sessionStorage.setItem('customer_email', email.trim())
        sessionStorage.setItem('customer_projects', JSON.stringify(data.projects))
      } else {
        setLoginError('Geen projecten gevonden met dit e-mailadres.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setLoginError('Er ging iets mis. Probeer het opnieuw.')
    }
    
    setLoginLoading(false)
  }

  // Refresh projects
  const handleRefresh = async () => {
    if (!customerEmail) return
    
    setRefreshing(true)
    try {
      const response = await fetch(`/api/project-lookup?q=${encodeURIComponent(customerEmail)}`)
      const data = await response.json()
      
      if (data.success && data.projects) {
        setProjects(data.projects)
        sessionStorage.setItem('customer_projects', JSON.stringify(data.projects))
      }
    } catch (err) {
      console.error('Refresh error:', err)
    }
    setRefreshing(false)
  }

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('customer_email')
    sessionStorage.removeItem('customer_projects')
    setIsLoggedIn(false)
    setProjects([])
    setCustomerEmail('')
    setEmail('')
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="hover:opacity-80 transition">
              <Logo variant="white" />
            </Link>
          </div>
        </header>

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6"
            >
              <FolderOpen className="w-4 h-4" />
              Mijn Projecten
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Bekijk al je projecten
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-xl mx-auto"
            >
              Log in met je e-mailadres om al je projecten te bekijken en beheren
            </motion.p>
          </div>
        </div>

        {/* Login Form */}
        <main className="max-w-md mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 sm:p-8"
          >
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-mailadres
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jouw@email.nl"
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Gebruik het e-mailadres waarmee je je project(en) hebt aangemaakt
                </p>
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {loginError}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loginLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Zoeken...
                  </>
                ) : (
                  <>
                    Bekijk mijn projecten
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
              <p className="text-sm text-gray-500 mb-2">Weet je je Project ID?</p>
              <Link 
                to="/project"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition inline-flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                Zoek op Project ID
              </Link>
            </div>
          </motion.div>

          {/* New Project CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm mb-2">Nog geen project?</p>
            <Link
              to="/start"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Start een nieuw project
            </Link>
          </motion.div>
        </main>
      </div>
    )
  }

  // Projects Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition">
            <Logo variant="white" />
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-gray-400 text-sm">
              <User className="w-4 h-4" />
              <span>{customerEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Uitloggen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Mijn Projecten
            </h1>
            <p className="text-gray-400">
              {projects.length} project{projects.length !== 1 ? 'en' : ''} gevonden
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Ververs</span>
            </button>
            <Link
              to="/start"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nieuw project</span>
            </Link>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          <AnimatePresence>
            {projects.map((project, index) => {
              const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.onboarding
              const StatusIcon = statusConfig.icon
              
              return (
                <motion.div
                  key={project.projectId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/project/${project.projectId}`}
                    className="block bg-gray-800/60 hover:bg-gray-800 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition group overflow-hidden"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left side - Project info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-xl ${statusConfig.bg} flex items-center justify-center`}>
                              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition truncate">
                                {project.businessName}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {project.projectId}
                              </p>
                            </div>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400">
                              {TYPE_LABELS[project.type] || project.type}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400 capitalize">
                              {project.package}
                            </span>
                          </div>
                        </div>

                        {/* Right side - Date and arrow */}
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(project.createdAt)}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition ml-auto" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress indicator based on status */}
                    <div className="h-1 bg-gray-700/50">
                      <div 
                        className={`h-full ${
                          project.status === 'live' ? 'bg-green-500 w-full' :
                          project.status === 'review' ? 'bg-cyan-500 w-5/6' :
                          project.status === 'development' ? 'bg-purple-500 w-4/6' :
                          project.status === 'design_approved' ? 'bg-indigo-500 w-3/6' :
                          project.status === 'design' ? 'bg-amber-500 w-2/6' :
                          'bg-blue-500 w-1/6'
                        } transition-all`}
                      />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Geen projecten gevonden
            </h3>
            <p className="text-gray-400 mb-6">
              Start je eerste project om aan de slag te gaan
            </p>
            <Link
              to="/start"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition"
            >
              <Plus className="w-5 h-5" />
              Start nieuw project
            </Link>
          </motion.div>
        )}

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gray-800/40 rounded-xl border border-gray-700/50 p-6"
        >
          <h3 className="font-semibold text-white mb-4">
            Hulp nodig?
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href="https://wa.me/31644712573"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition"
            >
              <MessageSquare className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white text-sm font-medium">WhatsApp</p>
                <p className="text-gray-500 text-xs">Direct antwoord</p>
              </div>
            </a>
            <a
              href="mailto:info@webstability.nl"
              className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition"
            >
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white text-sm font-medium">E-mail</p>
                <p className="text-gray-500 text-xs">info@webstability.nl</p>
              </div>
            </a>
            <Link
              to="/kennisbank"
              className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition"
            >
              <FileText className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white text-sm font-medium">Kennisbank</p>
                <p className="text-gray-500 text-xs">Veelgestelde vragen</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
