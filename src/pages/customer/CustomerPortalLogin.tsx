/**
 * Customer Portal Login Page
 * 
 * Login via:
 * - Email + magic link
 * - Project wachtwoord (bestaande flow)
 */

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sun,
  Moon,
  ArrowLeft,
  Shield
} from 'lucide-react'
import Logo from '../../components/Logo'
import { useDarkMode } from '../../contexts/DarkModeContext'

// Storage key
const SESSION_KEY = 'webstability_customer_session'

type LoginMethod = 'email' | 'password'

export default function CustomerPortalLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { darkMode, toggleDarkMode } = useDarkMode()
  
  // Form state
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email')
  const [email, setEmail] = useState('')
  const [projectId, setProjectId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Check for existing session on mount
  useEffect(() => {
    const storedSession = sessionStorage.getItem(SESSION_KEY)
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession)
        if (new Date(parsed.expiresAt) > new Date()) {
          navigate('/portaal')
          return
        }
      } catch {
        sessionStorage.removeItem(SESSION_KEY)
      }
    }
    
    // Check for email in URL params (from magic link redirect)
    const emailParam = searchParams.get('email')
    const tokenParam = searchParams.get('token')
    
    if (emailParam) {
      setEmail(emailParam)
    }
    
    // Auto-verify magic link token
    if (tokenParam && emailParam) {
      verifyMagicToken(emailParam, tokenParam)
    }
  }, [navigate, searchParams])

  // Verify magic link token
  const verifyMagicToken = async (email: string, token: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/verify-magic-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store session
        const session = {
          email: data.email,
          name: data.name || email.split('@')[0],
          projectIds: data.projectIds || [],
          token: data.sessionToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        }
        
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
        
        // Redirect to portal
        navigate('/portaal')
      } else {
        setError(data.message || t('login.customerPortal.invalidOrExpiredLink'))
      }
    } catch (err) {
      console.error('Magic token verify error:', err)
      setError(t('login.customerPortal.somethingWentWrong'))
    } finally {
      setLoading(false)
    }
  }

  // Handle email login (magic link)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/magic-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(),
          redirectUrl: `${window.location.origin}/portaal/login`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess(t('login.customerPortal.successMessage'))
      } else {
        setError(data.message || t('login.customerPortal.noAccountFound'))
      }
    } catch (err) {
      console.error('Email login error:', err)
      setError(t('login.customerPortal.somethingWentWrong'))
    } finally {
      setLoading(false)
    }
  }

  // Handle project/password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId.trim() || !password.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/login-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: projectId.trim(),
          password: password.trim()
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.project) {
        // Store session
        const session = {
          email: data.project.contactEmail || '',
          name: data.project.contactName || data.project.businessName,
          projectIds: [data.project.projectId || data.project.id],
          token: data.sessionToken || Date.now().toString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
        
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
        
        // Redirect to portal
        navigate('/portaal')
      } else {
        setError(data.message || t('login.customerPortal.invalidCredentials'))
      }
    } catch (err) {
      console.error('Password login error:', err)
      setError(t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">{t('login.backToWebsite')}</span>
          </Link>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label={darkMode ? t('login.customerPortal.lightTheme') : t('login.customerPortal.darkTheme')}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo size="lg" className="justify-center mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('login.customerPortal.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('login.customerPortal.subtitle')}
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Login Method Toggle */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setLoginMethod('email')
                    setError('')
                    setSuccess('')
                  }}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                    loginMethod === 'email'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t('login.customerPortal.emailTab')}
                  </div>
                </button>
                <button
                  onClick={() => {
                    setLoginMethod('password')
                    setError('')
                    setSuccess('')
                  }}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                    loginMethod === 'password'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t('login.customerPortal.passwordTab')}
                  </div>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Email Login Form */}
                  {loginMethod === 'email' && (
                    <motion.form
                      key="email"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleEmailLogin}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('login.customerPortal.emailLabel')}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('login.customerPortal.emailPlaceholder')}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
                        {t('login.customerPortal.secureLoginInfo')}
                      </p>

                      {/* Success Message */}
                      <AnimatePresence>
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-green-700 dark:text-green-300 font-medium">{success}</p>
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                {t('login.customerPortal.checkSpam')}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Error Message */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                          >
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        disabled={loading || !email.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-xl transition shadow-lg shadow-primary-500/25 disabled:shadow-none"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('login.customerPortal.sending')}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            {t('login.customerPortal.sendLoginLink')}
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}

                  {/* Password Login Form */}
                  {loginMethod === 'password' && (
                    <motion.form
                      key="password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handlePasswordLogin}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project ID
                        </label>
                        <input
                          type="text"
                          id="projectId"
                          value={projectId}
                          onChange={(e) => setProjectId(e.target.value)}
                          placeholder="PRJ-..."
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('login.customerPortal.passwordLabel')}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          to="/wachtwoord-vergeten"
                          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {t('login.customerPortal.forgotPassword')}
                        </Link>
                      </div>

                      {/* Error Message */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                          >
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        disabled={loading || !projectId.trim() || !password.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-xl transition shadow-lg shadow-primary-500/25 disabled:shadow-none"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('login.customerPortal.loggingIn')}
                          </>
                        ) : (
                          <>
                            {t('login.customerPortal.loginWithPassword')}
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('projectStatus.havingTrouble')}{' '}
                <Link to="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {t('projectStatus.contactUs')}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
        </footer>
      </div>
    </div>
  )
}
