import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* 404 Illustration */}
            <div className="mb-8">
              <span className="text-[150px] sm:text-[200px] font-bold text-gray-100 select-none">
                404
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 -mt-16">
              Pagina niet gevonden
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Oeps! De pagina die je zoekt bestaat niet of is verplaatst. 
              Geen zorgen, we helpen je terug op weg.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
              >
                <Home className="w-5 h-5" />
                Naar homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Ga terug
              </button>
            </div>

            {/* Helpful links */}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <p className="text-gray-500 text-sm mb-6">Misschien zoek je één van deze pagina's?</p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: 'Prijzen', href: '/#pricing' },
                  { label: 'Portfolio', href: '/#portfolio' },
                  { label: 'Kennisbank', href: '/kennisbank' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Start je project', href: '/start' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
