import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldOff, Home, ArrowLeft, Lock } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-8"
          >
            <ShieldOff className="w-12 h-12 text-red-600 dark:text-red-400" />
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Geen toegang
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Je hebt geen toestemming om deze pagina te bekijken. 
            Dit kan zijn omdat je niet bent ingelogd of niet de juiste rechten hebt.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
            >
              <Lock className="w-5 h-5" />
              Inloggen
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Naar homepage
            </Link>
          </div>

          {/* Help section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hulp nodig?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Als je denkt dat je wel toegang zou moeten hebben, neem dan contact met ons op.
            </p>
            <a
              href="mailto:info@webstability.nl"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              info@webstability.nl
            </a>
          </motion.div>

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 mt-8 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ga terug
          </motion.button>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
