import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFound() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-gray-900 to-purple-600/10" />
        <motion.div 
          className="absolute top-0 right-0 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 bg-gradient-to-br from-primary-500/20 via-purple-500/10 to-transparent"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 bg-gradient-to-tr from-purple-500/15 via-primary-500/10 to-transparent"
          animate={{ 
            scale: [1, 1.08, 1],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating particles */}
        {[
          { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
          { size: 6, x: '85%', y: '15%', delay: 1, duration: 5 },
          { size: 3, x: '75%', y: '60%', delay: 0.5, duration: 4.5 },
          { size: 5, x: '20%', y: '70%', delay: 1.5, duration: 5.5 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-primary-400 to-purple-500"
            style={{ 
              width: p.size, 
              height: p.size, 
              left: p.x, 
              top: p.y,
              opacity: 0.4
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <Header />
      
      <main className="relative z-10 pt-12 sm:pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* 404 Illustration */}
            <div className="relative mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="relative inline-block"
              >
                {/* Big 404 */}
                <span className="text-[100px] sm:text-[160px] lg:text-[200px] font-bold bg-gradient-to-br from-primary-400 via-purple-400 to-primary-300 bg-clip-text text-transparent select-none leading-none">
                  404
                </span>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-gray-800/80 backdrop-blur-xl rounded-2xl p-2 sm:p-3 shadow-lg border border-gray-700/50"
                >
                  <Search className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [8, -8, 8], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-1 sm:-bottom-2 -left-4 sm:-left-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl p-2 sm:p-3 shadow-lg shadow-primary-500/25"
                >
                  <span className="text-white text-lg sm:text-xl">🔍</span>
                </motion.div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4"
            >
              {t('notFound.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4"
            >
              {t('notFound.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center px-4"
            >
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                <Home className="w-5 h-5" />
                {t('notFound.goHome')}
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('notFound.goBack')}
              </button>
            </motion.div>

            {/* Help section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10"
            >
              <p className="text-gray-500 text-sm mb-4">{t('notFound.helpTitle')}</p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
                {[
                  { label: t('notFound.links.pricing'), href: '/#pricing' },
                  { label: t('notFound.links.portfolio'), href: '/portfolio' },
                  { label: t('notFound.links.contact'), href: '/contact' },
                  { label: t('notFound.links.projectStatus'), href: '/project' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-primary-500/20 max-w-md mx-auto"
            >
              <div className="flex items-center justify-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary-400" />
                <p className="text-gray-300 text-sm">
                  {t('notFound.needHelp')} <Link to="/contact" className="font-semibold text-primary-400 hover:text-primary-300 underline hover:no-underline">{t('notFound.contactUs')}</Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
