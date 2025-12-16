import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 bg-primary-100/50 rounded-full blur-3xl" />
            </div>
            
            {/* 404 Illustration with logo styling */}
            <div className="relative mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="relative inline-block"
              >
                {/* Big 404 */}
                <span className="text-[120px] sm:text-[180px] font-bold bg-gradient-to-br from-primary-200 to-primary-100 bg-clip-text text-transparent select-none">
                  404
                </span>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <Search className="w-6 h-6 text-gray-400" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [8, -8, 8], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-2 -left-6 bg-primary-500 rounded-2xl p-3 shadow-lg"
                >
                  <span className="text-white text-xl">🔍</span>
                </motion.div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Pagina niet gevonden
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto"
            >
              Oeps! De pagina die je zoekt bestaat niet of is verplaatst. 
              Geen zorgen, we helpen je terug op weg.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                <Home className="w-5 h-5" />
                Naar homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Ga terug
              </button>
            </motion.div>

            {/* Help section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 text-sm mb-4">Misschien zoek je een van deze pagina's?</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Prijzen', href: '/#pricing' },
                  { label: 'Portfolio', href: '/portfolio' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Project status', href: '/project' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
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
              className="mt-8 p-6 bg-primary-50 rounded-2xl border border-primary-100 max-w-md mx-auto"
            >
              <div className="flex items-center justify-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary-600" />
                <p className="text-primary-900 text-sm">
                  Hulp nodig? <a href="/contact" className="font-semibold underline hover:no-underline">Neem contact op</a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
