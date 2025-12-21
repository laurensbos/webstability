/**
 * Email Verified Page
 * 
 * Getoond na succesvolle email verificatie
 * Mobiel-geoptimaliseerd met login mogelijkheid via email + wachtwoord
 */

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react'
import Logo from '../components/Logo'

export default function EmailVerified() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // URL params
  const projectId = searchParams.get('projectId') || searchParams.get('id') || ''
  const emailParam = searchParams.get('email') || ''
  const verified = searchParams.get('verified') === 'true'
  const error = searchParams.get('error')
  
  // Login state - now uses email instead of project ID
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState(emailParam)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Auto-show login if verified successfully
  useEffect(() => {
    if (verified) {
      // Short delay before showing login
      const timer = setTimeout(() => setShowLogin(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [verified])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    
    setLoading(true)
    setLoginError('')

    try {
      // Login with email + password
      const response = await fetch('/api/login-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password
        })
      })

      const data = await response.json()

      if (data.success && data.projects && data.projects.length > 0) {
        // Get the first (or only) project
        const project = data.projects[0]
        
        // Store auth and redirect
        sessionStorage.setItem('projectAuth', JSON.stringify({
          projectId: project.projectId,
          authenticated: true,
          timestamp: Date.now()
        }))
        navigate(`/project/${project.projectId}`)
      } else {
        setLoginError(data.error || 'Ongeldige gegevens')
      }
    } catch {
      setLoginError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'invalid_token':
        return 'De verificatielink is ongeldig of verlopen. Vraag een nieuwe aan.'
      case 'project_not_found':
        return 'Project niet gevonden. Controleer je project ID.'
      case 'already_verified':
        return 'Je e-mailadres is al geverifieerd.'
      default:
        return 'Er ging iets mis bij de verificatie.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="max-w-md mx-auto flex justify-center">
          <Logo variant="white" size="md" />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden"
          >
            {/* Success State */}
            {verified && (
              <>
                <div className="p-6 sm:p-8 text-center">
                  {/* Success animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                  >
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      E-mail bevestigd! 🎉
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Je e-mailadres is succesvol geverifieerd.
                    </p>
                  </motion.div>

                  {/* Project ID badge */}
                  {projectId && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 rounded-full"
                    >
                      <Mail className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Project:</span>
                      <span className="font-mono font-bold text-green-400">{projectId}</span>
                    </motion.div>
                  )}
                </div>

                {/* Login section */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: showLogin ? 1 : 0, height: showLogin ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-700/50 overflow-hidden"
                >
                  <div className="p-6 sm:p-8 bg-gray-900/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary-400" />
                      <h2 className="font-semibold text-white">Log nu in op je portaal</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          E-mailadres
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="je@email.nl"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Wachtwoord
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Je wachtwoord"
                            className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Error message */}
                      {loginError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                        >
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="text-red-400 text-sm">{loginError}</span>
                        </motion.div>
                      )}

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={loading || !email.trim() || !password.trim()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Inloggen...</span>
                          </>
                        ) : (
                          <>
                            <span>Naar mijn portaal</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-center text-gray-500 text-xs mt-4">
                      Wachtwoord vergeten? Check je welkomstmail of{' '}
                      <a href="/contact" className="text-primary-400 hover:underline">
                        neem contact op
                      </a>
                    </p>
                  </div>
                </motion.div>

                {/* Show login button if not auto-shown */}
                {!showLogin && (
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setShowLogin(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all"
                    >
                      <span>Inloggen op portaal</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Error State */}
            {!verified && (
              <div className="p-6 sm:p-8 text-center">
                {/* Error icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                >
                  <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Verificatie mislukt
                </h1>
                <p className="text-gray-400 text-sm sm:text-base mb-6">
                  {getErrorMessage(error)}
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  {projectId && (
                    <button
                      onClick={() => navigate(`/project/${projectId}`)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all"
                    >
                      <span>Ga naar mijn project</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all"
                  >
                    Hulp nodig? Neem contact op
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Footer text */}
          <p className="text-center text-gray-500 text-sm mt-6">
            © {new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
          </p>
        </div>
      </main>
    </div>
  )
}
