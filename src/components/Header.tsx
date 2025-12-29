import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Image, Users, Mail, ArrowRight, ShoppingCart, Search, ClipboardList, Palette, Plane, Globe, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'
import { useDarkMode } from '../contexts/DarkModeContext'
import { LanguageSelector, MobileLanguageSelector } from './LanguageSelector'

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

interface HeaderProps {
  urgencyBannerVisible?: boolean
}

// dienstenItems and overOnsItems are now defined inside the component for i18n support

export default function Header({ urgencyBannerVisible = false }: HeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useDarkMode()

  const dienstenItems = [
    { label: t('header.services.websites'), href: '/websites', icon: Globe, description: t('header.services.websitesDesc') },
    { label: t('header.services.webshop'), href: '/webshop', icon: ShoppingCart, description: t('header.services.webshopDesc') },
    { label: t('header.services.logo'), href: '/logo', icon: Palette, description: t('header.services.logoDesc') },
    { label: t('header.services.drone'), href: '/luchtvideografie', icon: Plane, description: t('header.services.droneDesc') },
  ]

  const overOnsItems = [
    { label: t('header.about.aboutUs'), href: '/over-ons', icon: Users, description: t('header.about.aboutUsDesc') },
    { label: t('header.about.portfolio'), href: '/portfolio', icon: Image, description: t('header.about.portfolioDesc') },
    { label: t('header.about.contact'), href: '/contact', icon: Mail, description: t('header.about.contactDesc') },
  ]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [projectPasswordInput, setProjectPasswordInput] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showRecoveryForm, setShowRecoveryForm] = useState(false)
  const [recoveryType, setRecoveryType] = useState<'projectId' | 'password'>('projectId')
  const [foundProjects, setFoundProjects] = useState<{id: string, name: string}[]>([])
  const [showProjectSelect, setShowProjectSelect] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
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
    if (!emailInput.trim() || !projectPasswordInput.trim()) return

    setIsLoggingIn(true)
    setLoginError(null)

    try {
      // Login with email + password
      const response = await fetch('/api/login-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailInput.trim().toLowerCase(),
          password: projectPasswordInput.trim()
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.projects && data.projects.length > 1) {
          // Multiple projects found - show selection
          // Map API response to expected format
          const mappedProjects = data.projects.map((p: { projectId: string; businessName: string }) => ({
            id: p.projectId.toUpperCase(),
            name: p.businessName
          }))
          setFoundProjects(mappedProjects)
          setShowProjectSelect(true)
        } else {
          // Single project - navigate directly
          const projectId = (data.projects?.[0]?.projectId || data.projectId || '').toUpperCase()
          sessionStorage.setItem(`project_auth_${projectId}`, 'true')
          setShowProjectModal(false)
          navigate(`/project/${projectId}?pwd=${encodeURIComponent(projectPasswordInput)}`)
          setEmailInput('')
          setProjectPasswordInput('')
        }
      } else {
        setLoginError(data.message || data.error || 'Ongeldige email of wachtwoord')
      }
    } catch {
      setLoginError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleProjectSelect = (projectId: string) => {
    const normalizedId = projectId.toUpperCase()
    sessionStorage.setItem(`project_auth_${normalizedId}`, 'true')
    setShowProjectModal(false)
    navigate(`/project/${normalizedId}?pwd=${encodeURIComponent(projectPasswordInput)}`)
    setEmailInput('')
    setProjectPasswordInput('')
    setFoundProjects([])
    setShowProjectSelect(false)
  }

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRecovering(true)
    setRecoveryError(null)

    try {
      if (recoveryType === 'projectId') {
        // Send login link via email
        if (!recoveryEmail.trim()) return
        
        const response = await fetch('/api/send-login-link', {
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
        // Recovery password via email only (no project ID needed)
        if (!recoveryEmail.trim()) return
        
        const response = await fetch('/api/reset-password/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: recoveryEmail.trim()
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
    setRecoverySuccess(false)
    setRecoveryError(null)
    setEmailInput('')
    setProjectPasswordInput('')
    setLoginError(null)
    setFoundProjects([])
    setShowProjectSelect(false)
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
                {t('nav.howItWorks')}
              </a>

              {/* Prijzen - Direct link */}
              <a
                href="/#pricing"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                {t('nav.pricing')}
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
                  {t('nav.services')}
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
                {t('nav.knowledgeBase')}
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
                  {t('nav.about')}
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
                <WhatsAppIcon className="w-4 h-4" />
              </a>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                aria-label={darkMode ? 'Lichte modus activeren' : 'Donkere modus activeren'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Mijn project button */}
              <button
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <ClipboardList className="w-4 h-4" />
                {t('nav.myProject')}
              </button>

              {/* Start nu button */}
              <a
                href="/start"
                className="group flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                {t('nav.startNow')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Mobile header icons (left of hamburger) */}
            <div className="flex lg:hidden items-center gap-1.5">
              {/* WhatsApp - Mobile header */}
              <a
                href="https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20een%20vraag%20over%20jullie%20diensten."
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>

              {/* Mijn project - Mobile header */}
              <button
                onClick={() => setShowProjectModal(true)}
                className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all"
                aria-label="Mijn project"
              >
                <ClipboardList className="w-5 h-5" />
              </button>

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
            className="fixed inset-x-0 top-16 z-50 lg:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Hoe het werkt direct */}
              <a
                href="/#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t('nav.howItWorks')}
              </a>

              {/* Prijzen direct */}
              <a
                href="/#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t('nav.pricing')}
              </a>

              {/* Diensten accordion */}
              <div>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'diensten' ? null : 'diensten')}
                  className="flex items-center justify-between w-full px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t('nav.services')}
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
                {t('nav.knowledgeBase')}
              </a>

              {/* Over ons accordion */}
              <div>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'overons' ? null : 'overons')}
                  className="flex items-center justify-between w-full px-3 py-3 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t('nav.about')}
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
                {/* Mijn project - Mobile */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setShowProjectModal(true)
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                >
                  <ClipboardList className="w-5 h-5" />
                  {t('nav.myProject')}
                </button>

                <a
                  href="/start"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all"
                >
                  {t('nav.startNow')}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Mobile Language Selector */}
              <MobileLanguageSelector />
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y"
            >
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
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
                // Email + password login form
                showProjectSelect && foundProjects.length > 1 ? (
                  // Multiple projects selection
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {t('header.loginModal.multipleProjects')}
                    </p>
                    <div className="space-y-2">
                      {foundProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => handleProjectSelect(project.id)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 rounded-xl transition-all group"
                        >
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                              {project.name || t('dashboard.myProject')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                              {project.id}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { setShowProjectSelect(false); setFoundProjects([]); }}
                      className="w-full mt-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all"
                    >
                      {t('header.loginModal.backToLogin')}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {t('header.loginModal.enterCredentials')}
                    </p>

                    <form onSubmit={handleProjectSearch} autoComplete="off">
                      <div className="mb-4">
                        <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('login.customerPortal.emailLabel')}
                        </label>
                        <input
                          type="email"
                          id="loginEmail"
                          name="login-email-field"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder={t('login.customerPortal.emailPlaceholder')}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                          autoFocus
                          autoComplete="email"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          data-form-type="other"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="projectPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('header.loginModal.password')}
                        </label>
                        <input
                          type="password"
                          id="projectPassword"
                          name="project-password-field"
                          value={projectPasswordInput}
                          onChange={(e) => setProjectPasswordInput(e.target.value)}
                          placeholder={t('header.loginModal.passwordPlaceholder')}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                          autoComplete="current-password"
                          data-form-type="other"
                        />
                      </div>

                      {loginError && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                          {loginError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={!emailInput.trim() || !projectPasswordInput.trim() || isLoggingIn}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                      >
                        {isLoggingIn ? (
                          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                        {isLoggingIn ? t('header.loginModal.loggingIn') : t('header.loginModal.viewProjectStatus')}
                      </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">{t('login.forgotPassword')}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setShowRecoveryForm(true); setRecoveryType('projectId'); }}
                          className="flex-1 py-2 px-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          {t('header.loginModal.sendLoginLink')}
                        </button>
                        <button 
                          onClick={() => { setShowRecoveryForm(true); setRecoveryType('password'); }}
                          className="flex-1 py-2 px-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          {t('header.loginModal.forgotPassword')}
                        </button>
                      </div>
                    </div>
                  </>
                )
              ) : recoverySuccess ? (
                // Success state
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('header.loginModal.checkInbox')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {recoveryType === 'projectId' 
                      ? t('header.loginModal.recoverySuccessProjectId')
                      : t('header.loginModal.recoverySuccessPassword')
                    }
                  </p>
                  <button
                    onClick={resetModal}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl transition-all"
                  >
                    {t('header.loginModal.close')}
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
                      {t('header.loginModal.sendLoginLinkTab')}
                    </button>
                    <button
                      onClick={() => setRecoveryType('password')}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                        recoveryType === 'password' 
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t('header.loginModal.forgotPasswordTab')}
                    </button>
                  </div>

                  {recoveryType === 'projectId' ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t('header.loginModal.sendLoginLinkDesc')}
                      </p>

                      <form onSubmit={handleRecoverySubmit}>
                        <div className="mb-4">
                          <label htmlFor="recoveryEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('header.loginModal.email')}
                          </label>
                          <input
                            type="email"
                            id="recoveryEmail"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            placeholder={t('header.loginModal.emailPlaceholder')}
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
                              {t('header.loginModal.sending')}
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              {t('header.loginModal.sendLoginLink')}
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t('header.loginModal.forgotPasswordDesc')}
                      </p>

                      <form onSubmit={handleRecoverySubmit}>
                        <div className="mb-4">
                          <label htmlFor="recoveryEmailPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('header.loginModal.email')}
                          </label>
                          <input
                            type="email"
                            id="recoveryEmailPassword"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            placeholder={t('header.loginModal.emailPlaceholder')}
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
                              {t('header.loginModal.sending')}
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              {t('header.loginModal.sendResetLink')}
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
                    {t('header.loginModal.backToLogin')}
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
