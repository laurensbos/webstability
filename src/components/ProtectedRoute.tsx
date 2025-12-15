import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireRole?: 'developer' | 'admin' | 'marketing'
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireRole 
}) => {
  const { user, userProfile, loading, isConfigured, isDeveloper, isAdmin } = useAuth()
  const location = useLocation()

  // Als Supabase niet geconfigureerd is, toon fallback login
  if (!isConfigured) {
    return <FallbackLogin>{children}</FallbackLogin>
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  // Niet ingelogd -> redirect naar login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role check
  if (requireRole === 'admin' && !isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  if (requireRole === 'developer' && !isDeveloper && !isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  // Marketing role - developers and admins also have access
  if (requireRole === 'marketing' && !isDeveloper && !isAdmin && userProfile?.role !== 'marketing') {
    return <Navigate to="/unauthorized" replace />
  }

  // Check if user profile exists
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Profiel laden...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Fallback login voor development (zonder Supabase)
const FallbackLogin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('dev_authenticated') === 'true'
  })
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Development credentials
    const validCredentials = [
      { email: 'laurensbos', password: 'N45eqtu2!jz8j0v', role: 'developer' },
      { email: 'developer@webstability.nl', password: 'test1234', role: 'developer' },
      { email: 'admin@webstability.nl', password: 'test1234', role: 'admin' },
      { email: 'marketing@webstability.nl', password: 'marketing123', role: 'marketing' },
      { email: 'sales', password: 'sales123', role: 'marketing' },
      { email: 'wesley', password: 'getrichordietrying', role: 'marketing' },
    ]

    const isValid = validCredentials.some(
      cred => cred.email === email && cred.password === password
    )

    if (isValid) {
      localStorage.setItem('dev_authenticated', 'true')
      localStorage.setItem('dev_user_email', email)
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Ongeldige inloggegevens')
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Webstability</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Marketing Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Log in om toegang te krijgen tot het CRM systeem.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gebruikersnaam
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Vul je gebruikersnaam in"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
            >
              Inloggen
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
        </p>
      </div>
    </div>
  )
}

export default ProtectedRoute
