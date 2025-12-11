import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Layers, Image, CreditCard, Users, Mail, ArrowRight, ShoppingCart } from 'lucide-react'

interface HeaderProps {
  urgencyBannerVisible?: boolean
}

const dienstenItems = [
  { label: 'Hoe het werkt', href: '/#how-it-works', icon: Layers, description: 'Ons proces van A tot Z' },
  { label: 'Portfolio', href: '/#portfolio', icon: Image, description: 'Bekijk ons werk' },
  { label: 'Prijzen', href: '/#pricing', icon: CreditCard, description: 'Transparante tarieven' },
  { label: 'Webshop', href: '/webshop', icon: ShoppingCart, description: 'Webshop laten maken' },
]

const overOnsItems = [
  { label: 'Over ons', href: '/over-ons', icon: Users, description: 'Ons verhaal en team' },
  { label: 'Contact', href: '/contact', icon: Mail, description: 'Neem contact op' },
]

export default function Header({ urgencyBannerVisible = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
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
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a href="/" className="group flex-shrink-0">
              <span className="font-display font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors tracking-tight">
                webstability
              </span>
            </a>

            {/* Desktop Navigation */}
            <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
              {/* Diensten Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('diensten')}
                  onMouseEnter={() => setActiveDropdown('diensten')}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeDropdown === 'diensten' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {dienstenItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                              <item.icon className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{item.description}</div>
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
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
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
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {overOnsItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                              <item.icon className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{item.description}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <a
                href="/start"
                className="group flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                Start nu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu openen"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-white border-b border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Diensten accordion */}
              <div>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'diensten' ? null : 'diensten')}
                  className="flex items-center justify-between w-full px-3 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50"
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
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50"
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
                className="flex items-center px-3 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50"
              >
                Kennisbank
              </a>

              {/* Over ons accordion */}
              <div>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'overons' ? null : 'overons')}
                  className="flex items-center justify-between w-full px-3 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50"
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
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50"
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

              {/* CTA */}
              <div className="pt-4 border-t border-gray-100">
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
    </>
  )
}
