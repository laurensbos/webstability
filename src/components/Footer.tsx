import { motion } from 'framer-motion'
import { ArrowRight, Mail, Phone, MapPin, ChevronDown, Sparkles, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'
import { LanguageSelector } from './LanguageSelector'

// footerLinks are now defined inside the component for i18n support

// Collapsible section for mobile
function MobileAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 lg:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 lg:hidden"
      >
        <h4 className="text-gray-900 dark:text-white font-semibold">{title}</h4>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <h4 className="hidden lg:block text-gray-900 dark:text-white font-semibold mb-4">{title}</h4>
      <div className={`${isOpen ? 'block pb-4' : 'hidden'} lg:block`}>
        {children}
      </div>
    </div>
  )
}

// CTA variants for different service pages
type CTAVariant = 'default' | 'webshop' | 'logo' | 'drone' | 'none'

interface CTAConfig {
  badge: string
  title: string
  highlight: string
  description: string
  buttonText: string
  buttonLink: string
  gradient: {
    from: string
    to: string
    text: string
    badge: string
    badgeBg: string
    buttonFrom: string
    buttonTo: string
    shadow: string
    particles: string
  }
}

// Function to get translated CTA configs
function getCTAConfigs(t: (key: string) => string): Record<Exclude<CTAVariant, 'none'>, CTAConfig> {
  return {
    default: {
      badge: t('footer.cta.default.badge'),
      title: t('footer.cta.default.title'),
      highlight: t('footer.cta.default.highlight'),
      description: t('footer.cta.default.description'),
      buttonText: t('footer.cta.default.buttonText'),
      buttonLink: '/start',
      gradient: {
        from: 'from-primary-50',
        to: 'to-blue-50',
        text: 'from-primary-600 to-blue-600',
        badge: 'text-primary-700',
        badgeBg: 'border-primary-200',
        buttonFrom: 'from-primary-500',
        buttonTo: 'to-primary-600',
        shadow: 'shadow-primary-500/30',
        particles: 'primary',
      },
    },
    webshop: {
      badge: t('footer.cta.webshop.badge'),
      title: t('footer.cta.webshop.title'),
      highlight: t('footer.cta.webshop.highlight'),
      description: t('footer.cta.webshop.description'),
      buttonText: t('footer.cta.webshop.buttonText'),
      buttonLink: '/start?dienst=webshop',
      gradient: {
        from: 'from-emerald-50',
        to: 'to-green-50',
        text: 'from-emerald-600 to-green-600',
        badge: 'text-emerald-700',
        badgeBg: 'border-emerald-200',
        buttonFrom: 'from-emerald-500',
        buttonTo: 'to-emerald-600',
        shadow: 'shadow-emerald-500/30',
        particles: 'emerald',
      },
    },
    logo: {
      badge: t('footer.cta.logo.badge'),
      title: t('footer.cta.logo.title'),
      highlight: t('footer.cta.logo.highlight'),
      description: t('footer.cta.logo.description'),
      buttonText: t('footer.cta.logo.buttonText'),
      buttonLink: '/start?dienst=logo',
      gradient: {
        from: 'from-purple-50',
        to: 'to-pink-50',
        text: 'from-purple-600 to-pink-600',
        badge: 'text-purple-700',
        badgeBg: 'border-purple-200',
        buttonFrom: 'from-purple-500',
        buttonTo: 'to-purple-600',
        shadow: 'shadow-purple-500/30',
        particles: 'purple',
      },
    },
    drone: {
      badge: t('footer.cta.drone.badge'),
      title: t('footer.cta.drone.title'),
      highlight: t('footer.cta.drone.highlight'),
      description: t('footer.cta.drone.description'),
      buttonText: t('footer.cta.drone.buttonText'),
      buttonLink: '/start?dienst=drone',
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
        text: 'from-orange-500 to-amber-500',
        badge: 'text-orange-700',
        badgeBg: 'border-orange-200',
        buttonFrom: 'from-orange-500',
        buttonTo: 'to-amber-500',
        shadow: 'shadow-orange-500/30',
        particles: 'orange',
      },
    },
  }
}

// Floating particles for CTA section with color variant
function CTAParticlesVariant({ variant = 'primary' }: { variant?: string }) {
  const colorMap: Record<string, string> = {
    primary: 'rgba(99, 102, 241,',
    emerald: 'rgba(16, 185, 129,',
    purple: 'rgba(168, 85, 247,',
    orange: 'rgba(249, 115, 22,',
  }
  const baseColor = colorMap[variant] || colorMap.primary

  const particles = [
    { size: 6, x: '10%', y: '20%', delay: 0, duration: 6 },
    { size: 8, x: '85%', y: '25%', delay: 1.2, duration: 7 },
    { size: 5, x: '25%', y: '70%', delay: 0.5, duration: 5.5 },
    { size: 7, x: '75%', y: '65%', delay: 1.8, duration: 6.5 },
    { size: 4, x: '50%', y: '15%', delay: 0.8, duration: 5 },
    { size: 6, x: '92%', y: '50%', delay: 2, duration: 7.5 },
    { size: 5, x: '5%', y: '55%', delay: 1.5, duration: 6 },
    { size: 4, x: '60%', y: '80%', delay: 0.3, duration: 5.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            background: `linear-gradient(135deg, ${baseColor} ${0.4 + (i % 3) * 0.2}), ${baseColor} ${0.3 + (i % 3) * 0.15}))`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

interface FooterProps {
  ctaVariant?: CTAVariant
}

export default function Footer({ ctaVariant = 'default' }: FooterProps) {
  const { t } = useTranslation()
  const ctaConfigs = getCTAConfigs(t)
  const config = ctaVariant !== 'none' ? ctaConfigs[ctaVariant] : null

  const footerLinksTranslated = {
    diensten: [
      { label: t('footer.links.websites'), href: '/websites' },
      { label: t('footer.links.webshop'), href: '/webshop' },
      { label: t('footer.links.logoDesign'), href: '/logo-maken' },
      { label: t('footer.links.droneVideography'), href: '/luchtvideografie' },
    ],
    product: [
      { label: t('footer.links.features'), href: '/#features' },
      { label: t('footer.links.pricing'), href: '/#pricing' },
      { label: t('footer.links.howItWorks'), href: '/#how-it-works' },
      { label: t('footer.links.faq'), href: '/#faq' },
    ],
    bedrijf: [
      { label: t('footer.links.aboutUs'), href: '/over-ons' },
      { label: t('footer.links.portfolio'), href: '/portfolio' },
      { label: t('footer.links.knowledgeBase'), href: '/kennisbank' },
      { label: t('footer.links.contact'), href: '/contact' },
    ],
    legal: [
      { label: t('footer.links.privacy'), href: '/privacy' },
      { label: t('footer.links.terms'), href: '/voorwaarden' },
    ],
  }

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* CTA Section - Full width */}
      {config && (
      <div className="py-12 lg:py-24 relative overflow-hidden">
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient.from} via-white ${config.gradient.to} dark:from-gray-800 dark:via-gray-900 dark:to-gray-800`} />
        <div className="absolute inset-0">
          <div className={`absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br ${config.gradient.from.replace('from-', 'from-').replace('-50', '-200')}/40 to-transparent rounded-full blur-3xl`} />
          <div className={`absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-tl ${config.gradient.to.replace('to-', 'from-').replace('-50', '-200')}/40 to-transparent rounded-full blur-3xl`} />
        </div>
        
        {/* Floating particles */}
        <CTAParticlesVariant variant={config.gradient.particles} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Sparkle badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border ${config.gradient.badgeBg} dark:border-gray-700 rounded-full px-4 py-1.5 mb-6 shadow-sm`}
          >
            <Sparkles className={`w-4 h-4 ${config.gradient.badge.replace('text-', 'text-').replace('-700', '-500')}`} />
            <span className={`text-sm font-medium ${config.gradient.badge}`}>{config.badge}</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6"
          >
            {config.title}{' '}
            <span className={`bg-gradient-to-r ${config.gradient.text} bg-clip-text text-transparent`}>
              {config.highlight}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-base lg:text-xl mb-8 lg:mb-10 max-w-2xl mx-auto"
          >
            {config.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to={config.buttonLink}
              className={`group inline-flex items-center justify-center gap-2 px-8 py-4 lg:px-10 lg:py-5 bg-gradient-to-r ${config.gradient.buttonFrom} ${config.gradient.buttonTo} hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-xl ${config.gradient.shadow} hover:-translate-y-1 text-base lg:text-lg`}
            >
              <span>{config.buttonText}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 lg:px-10 lg:py-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-lg hover:shadow-xl text-base lg:text-lg"
            >
              {t('contact.hero.messageButton')}
            </Link>
          </motion.div>
        </div>
      </div>
      )}

      {/* Main footer - Accordion on mobile, grid on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 lg:py-16 border-t border-gray-200 dark:border-gray-800">
          {/* Mobile: Brand + Accordion */}
          <div className="lg:hidden">
            {/* Brand compact */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <Link to="/">
                <Logo size="md" showText />
              </Link>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <a href="mailto:info@webstability.nl" className="hover:text-primary-600 dark:hover:text-primary-400">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="tel:+31644712573" className="hover:text-primary-600 dark:hover:text-primary-400">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Accordion sections */}
            <MobileAccordion title={t('footer.sections.services')}>
              <ul className="space-y-2">
                {footerLinksTranslated.diensten.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </MobileAccordion>
            
            <MobileAccordion title={t('footer.sections.product')}>
              <ul className="space-y-2">
                {footerLinksTranslated.product.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </MobileAccordion>
            
            <MobileAccordion title={t('footer.sections.company')}>
              <ul className="space-y-2">
                {footerLinksTranslated.bedrijf.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </MobileAccordion>
            
            <MobileAccordion title={t('footer.sections.legal')}>
              <ul className="space-y-2">
                {footerLinksTranslated.legal.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </MobileAccordion>
          </div>

          {/* Desktop: Full grid */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-block mb-6">
                <Logo size="md" showText />
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                {t('footer.description')}
              </p>
              
              {/* Contact info */}
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <a href="mailto:info@webstability.nl" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  info@webstability.nl
                </a>
                <a href="tel:+31644712573" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  06 44712573
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Nederland</span>
                </div>
              </div>
            </div>

            {/* Diensten */}
            <div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">{t('footer.sections.services')}</h4>
              <ul className="space-y-3">
                {footerLinksTranslated.diensten.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">{t('footer.sections.product')}</h4>
              <ul className="space-y-3">
                {footerLinksTranslated.product.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bedrijf */}
            <div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">{t('footer.sections.company')}</h4>
              <ul className="space-y-3">
                {footerLinksTranslated.bedrijf.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">{t('footer.sections.legal')}</h4>
              <ul className="space-y-3">
                {footerLinksTranslated.legal.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center gap-4">
            {/* Logo and copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>© {new Date().getFullYear()}</span>
              <Link to="/" className="font-display font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors tracking-tight">
                webstability
              </Link>
            </div>

            {/* Made with love + Trustpilot */}
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">Made with <span className="text-red-500">❤️</span></span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              {/* Trustpilot Badge */}
              <a 
                href="https://nl.trustpilot.com/review/webstability.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="Trustpilot">
                  <path fill="#00b67a" d="M12 0l2.9 8.8H24l-7.4 5.4 2.9 8.8L12 17.6 4.5 23l2.9-8.8L0 8.8h9.1z"/>
                </svg>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3.5 h-3.5 bg-[#00b67a] flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-white fill-white" />
                    </div>
                  ))}
                </div>
              </a>
            </div>

            {/* KVK and BTW */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>KVK: 91186307</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>BTW: NL004875371B72</span>
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  )
}
