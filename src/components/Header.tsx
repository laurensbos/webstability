import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Image, Users, Mail, ArrowRight, ShoppingCart, Search, ClipboardList, Palette, Plane, Globe, Moon, Sun, MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { useDarkMode } from '../contexts/DarkModeContext'

interface HeaderProps {
  urgencyBannerVisible?: boolean
}

const dienstenItems = [
  { label: 'Websites', href: '/websites', icon: Globe, description: 'Professionele website laten maken' },
  { label: 'Webshop', href: '/webshop', icon: ShoppingCart, description: 'Webshop laten maken' },
  { label: 'Logo laten maken', href: '/logo', icon: Palette, description: 'Professioneel logo ontwerp' },
  { label: 'Luchtfoto & Videografie', href: '/luchtvideografie', icon: Plane, description: 'Professionele luchtopnames' },
]

const overOnsItems = [
  { label: 'Over ons', href: '/over-ons', icon: Users, description: 'Ons verhaal en team' },
  { label: 'Portfolio', href: '/portfolio', icon: Image, description: 'Bekijk ons werk' },
  { label: 'Contact', href: '/contact', icon: Mail, description: 'Neem contact op' },
]

export default function Header({ urgencyBannerVisible = false }: HeaderProps) {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectIdInput, setProjectIdInput] = useState('')
  const [projectPasswordInput, setProjectPasswordInput] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showRecoveryForm, setShowRecoveryForm] = useState(false)
  const [recoveryType, setRecoveryType] = useState<'projectId' | 'password'>('projectId')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryProjectId, setRecoveryProjectId] = useState('')
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoverySuccess, setRecoverySuccess] = useState(false)
  const [recoveryError, setRecoveryError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const handleProjectSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectIdInput.trim() || !projectPasswordInput.trim()) return

    setIsLoggingIn(true)
    setLoginError(null)

    try {
      // Verify project credentials
      const response = await fetch('/api/verify-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: projectIdInput.trim().toUpperCase(),
          password: projectPasswordInput.trim()
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store session for this project
        sessionStorage.setItem(`project_auth_${projectIdInput.trim().toUpperCase()}`, 'true')
        setShowProjectModal(false)
        // Navigate with password in URL for initial verification
        navigate(`/project/${projectIdInput.trim().toUpperCase()}?pwd=${encodeURIComponent(projectPasswordInput)}`)
        setProjectIdInput('')
        setProjectPasswordInput('')
      } else {
        setLoginError(data.message || 'Ongeldige project-ID of wachtwoord')
      }
    } catch {
      setLoginError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRecovering(true)
    setRecoveryError(null)

    try {
      if (recoveryType === 'projectId') {
        // Recovery project-ID via email
        if (!recoveryEmail.trim()) return
        
        const response = await fetch('/api/recover-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: recoveryEmail.trim() })
        })

        if (response.ok) {
          setRecoverySuccess(true)
        } else {
          const data = await response.json()
          setRecoveryError(data.message || 'Er is iets misgegaan. Probeer het opnieuw.')
        }
      } else {
        // Recovery password via email + project ID
        if (!recoveryEmail.trim() || !recoveryProjectId.trim()) return
        
        const response = await fetch('/api/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: recoveryEmail.trim(),
            projectId: recoveryProjectId.trim().toUpperCase()
          })
        })

        if (response.ok) {
          setRecoverySuccess(true)
        } else {
          const data = await response.json()
          setRecoveryError(data.message || 'Er is iets misgegaan. Probeer het opnieuw.')
        }
      }
    } catch {
      setRecoveryError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setIsRecovering(false)
    }
  }

  const resetModal = () => {
    setShowProjectModal(false)
    setShowRecoveryForm(false)
    setRecoveryType('projectId')
    setRecoveryEmail('')
    setRecoveryProjectId('')
    setRecoverySuccess(false)
    setRecoveryError(null)
    setProjectIdInput('')
    setProjectPasswordInput('')
    setLoginError(null)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          urgencyBannerVisible ? 'top-11' : 'top-0'
        } ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a href="/" className="group flex-shrink-0">
              <Logo size="md" showText />
            </a>

            {/* Desktop Navigation */}
            <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
              {/* Hoe het werkt - Direct link */}
              <a
                href="/#how-it-works"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                Hoe het werkt
              </a>

              {/* Prijzen - Direct link */}
              <a
                href="/#pricing"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                Prijzen
              </a>

              {/* Diensten Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('diensten')}
                  onMouseEnter={() => setActiveDropdown('diensten')}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeDropdown === 'diensten' 
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  Diensten
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'diensten' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'diensten' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-2">
                        {dienstenItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40 transition-colors">
                              <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{item.description}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Kennisbank - Direct link (SEO) */}
              <a
                href="/kennisbank"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                Kennisbank
              </a>

              {/* Over ons Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('overons')}
                  onMouseEnter={() => setActiveDropdown('overons')}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeDropdown === 'overons' 
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  Over ons
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'overons' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'overons' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-2">
                        {overOnsItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40 transition-colors">
                              <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{item.description}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* WhatsApp link - Desktop */}
              <a
                href="https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20een%20vraag%20over%20jullie%20diensten."
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                aria-label={darkMode ? 'Lichte modus activeren' : 'Donkere modus activeren'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Mijn project button */}
              <button
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <ClipboardList className="w-4 h-4" />
                Mijn project
              </button>

              {/* Start nu button */}
              <a
                href="/start"
                className="group flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                Start nu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Mobile header icons (left of hamburger) */}
            <div className="flex lg:hidden items-center gap-2">
              {/* WhatsApp - Mobile header */}
              <a
                href="https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20een%20vraag%20over%20jullie%20diensten."
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              {/* Dark mode toggle - Mobile header */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                aria-label={darkMode ? 'Lichte modus activeren' : 'Donkere modus activeren'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Menu openen"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Hoe het werkt direct */}
              <a
                href="/#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Hoe het werkt
              </a>

              {/* Prijzen direct */}
              <a
                href="/#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Prijzen
              </a>

              {/* Diensten accordion */}
              <div>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'diensten' ? null : 'diensten')}
                  className="flex items-center justify-between w-full px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Diensten
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${mobileExpanded === 'diensten' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileExpanded === 'diensten' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 py-2 space-y-1">
                        {dienstenItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <item.icon className="w-5 h-5 text-primary-500" />
                            <span>{item.label}</span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Kennisbank direct */}
              <a
                href="/kennisbank"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Kennisbank
              </a>

              {/* Over ons accordion */}
              <div>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'overons' ? null : 'overons')}
                  className="flex items-center justify-between w-full px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Over ons
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${mobileExpanded === 'overons' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileExpanded === 'overons' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 py-2 space-y-1">
                        {overOnsItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <item.icon className="w-5 h-5 text-primary-500" />
                            <span>{item.label}</span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                {/* Dark mode toggle - Mobile */}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {darkMode ? 'Lichte modus' : 'Donkere modus'}
                </button>

                {/* Mijn project - Mobile */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setShowProjectModal(true)
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                >
                  <ClipboardList className="w-5 h-5" />
                  Mijn project
                </button>

                <a
                  href="/start"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all"
                >
                  Start nu
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Check Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={resetModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {showRecoveryForm ? 'Project-ID opvragen' : 'Check mijn project'}
                  </h2>
                </div>
                <button
                  onClick={resetModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!showRecoveryForm ? (
                // Project ID input form
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Voer je project-ID en wachtwoord in om je project status te bekijken.
                  </p>

                  <form onSubmit={handleProjectSearch}>
                    <div className="mb-4">
                      <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project-ID
                      </label>
                      <input
                        type="text"
                        id="projectId"
                        value={projectIdInput}
                        onChange={(e) => setProjectIdInput(e.target.value)}
                        placeholder="Bijv. WS-ABC123"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg font-mono uppercase"
                        autoFocus
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="projectPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Wachtwoord
                      </label>
                      <input
                        type="password"
                        id="projectPassword"
                        value={projectPasswordInput}
                        onChange={(e) => setProjectPasswordInput(e.target.value)}
                        placeholder="Je project wachtwoord"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>

                    {loginError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                        {loginError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!projectIdInput.trim() || !projectPasswordInput.trim() || isLoggingIn}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                    >
                      {isLoggingIn ? (
                        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                      {isLoggingIn ? 'Inloggen...' : 'Bekijk project status'}
                    </button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">Iets vergeten?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setShowRecoveryForm(true); setRecoveryType('projectId'); }}
                        className="flex-1 py-2 px-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        Project-ID kwijt
                      </button>
                      <button 
                        onClick={() => { setShowRecoveryForm(true); setRecoveryType('password'); }}
                        className="flex-1 py-2 px-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        Wachtwoord kwijt
                      </button>
                    </div>
                  </div>
                </>
              ) : recoverySuccess ? (
                // Success state
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Check je inbox!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {recoveryType === 'projectId' 
                      ? 'Als er projecten zijn gekoppeld aan dit e-mailadres, ontvang je binnen enkele minuten een e-mail met je project-ID(s) en wachtwoord.'
                      : 'Als dit e-mailadres gekoppeld is aan dit project, ontvang je een e-mail met een link om je wachtwoord opnieuw in te stellen.'
                    }
                  </p>
                  <button
                    onClick={resetModal}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl transition-all"
                  >
                    Sluiten
                  </button>
                </div>
              ) : (
                // Recovery form
                <>
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setRecoveryType('projectId')}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                        recoveryType === 'projectId' 
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      Project-ID kwijt
                    </button>
                    <button
                      onClick={() => setRecoveryType('password')}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                        recoveryType === 'password' 
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      Wachtwoord kwijt
                    </button>
                  </div>

                  {recoveryType === 'projectId' ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Voer het e-mailadres in waarmee je je project hebt aangemeld. We sturen je project-ID(s) naar dit adres.
                      </p>

                      <form onSubmit={handleRecoverySubmit}>
                        <div className="mb-4">
                          <label htmlFor="recoveryEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            E-mailadres
                          </label>
                          <input
                            type="email"
                            id="recoveryEmail"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            placeholder="jouw@email.nl"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            autoFocus
                            required
                          />
                        </div>

                        {recoveryError && (
                          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {recoveryError}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={!recoveryEmail.trim() || isRecovering}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                        >
                          {isRecovering ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Verzenden...
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              Verstuur project-ID
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Voer je project-ID en het bijbehorende e-mailadres in. We sturen een link om je wachtwoord opnieuw in te stellen.
                      </p>

                      <form onSubmit={handleRecoverySubmit}>
                        <div className="mb-4">
                          <label htmlFor="recoveryProjectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project-ID
                          </label>
                          <input
                            type="text"
                            id="recoveryProjectId"
                            value={recoveryProjectId}
                            onChange={(e) => setRecoveryProjectId(e.target.value)}
                            placeholder="Bijv. WS-ABC123"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-mono uppercase"
                            autoFocus
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="recoveryEmailPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            E-mailadres
                          </label>
                          <input
                            type="email"
                            id="recoveryEmailPassword"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            placeholder="jouw@email.nl"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            required
                          />
                        </div>

                        {recoveryError && (
                          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {recoveryError}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={!recoveryEmail.trim() || !recoveryProjectId.trim() || isRecovering}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                        >
                          {isRecovering ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Verzenden...
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              Verstuur reset link
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}

                  <button
                    onClick={() => setShowRecoveryForm(false)}
                    className="w-full mt-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
                  >
                    ← Terug naar inloggen
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
