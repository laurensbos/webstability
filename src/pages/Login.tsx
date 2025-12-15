import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/Logo'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, user, isConfigured, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already logged in
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/developer'
  
  useEffect(() => {
    if (user && !authLoading) {
      navigate(from, { replace: true })
    }
  }, [user, authLoading, navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!isConfigured) {
        // Fallback voor development
        const validCredentials = [
          { email: 'laurensbos', password: 'N45eqtu2!jz8j0v' },
          { email: 'info@webstability.nl', password: 'N45eqtu2!jz8j0v' },
          { email: 'developer@webstability.nl', password: 'test1234' },
          { email: 'admin@webstability.nl', password: 'test1234' },
        ]

        const isValid = validCredentials.some(
          cred => cred.email === email && cred.password === password
        )

        if (isValid) {
          localStorage.setItem('dev_authenticated', 'true')
          localStorage.setItem('dev_user_email', email)
          navigate(from, { replace: true })
        } else {
          setError('Ongeldige inloggegevens')
        }
      } else {
        // Supabase auth
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message === 'Invalid login credentials' 
            ? 'Ongeldige inloggegevens' 
            : error.message)
        }
      }
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar website
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo variant="default" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Inloggen</h1>
            <p className="text-gray-600 mt-2">
              Welkom terug bij Webstability
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Gebruikersnaam of e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="gebruikersnaam of email"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link 
                to="/wachtwoord-vergeten" 
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Wachtwoord vergeten?
              </Link>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Bezig met inloggen...
                </>
              ) : (
                'Inloggen'
              )}
            </button>
          </form>

          {/* Development notice */}
          {!isConfigured && import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Development mode</strong>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; {new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
        </p>
      </motion.div>
    </div>
  )
}

export default Login
