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
    return <FallbackLogin requireRole={requireRole}>{children}</FallbackLogin>
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
const FallbackLogin: React.FC<{ children: React.ReactNode; requireRole?: 'developer' | 'admin' | 'marketing' }> = ({ children, requireRole }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('dev_authenticated') === 'true'
  })
  const [userRole, setUserRole] = React.useState(() => {
    return localStorage.getItem('dev_user_role') || ''
  })
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  // Force logout function
  const forceLogout = () => {
    localStorage.removeItem('dev_authenticated')
    localStorage.removeItem('dev_user_role')
    localStorage.removeItem('dev_user_email')
    setIsAuthenticated(false)
    setUserRole('')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Development credentials
    const validCredentials = [
      { email: 'laurensbos', password: 'N45eqtu2!', role: 'developer' },
      { email: 'developer@webstability.nl', password: 'test1234', role: 'developer' },
      { email: 'admin@webstability.nl', password: 'test1234', role: 'admin' },
      { email: 'marketing@webstability.nl', password: 'marketing123', role: 'marketing' },
      { email: 'sales', password: 'sales123', role: 'marketing' },
      { email: 'wesley', password: 'getrichordietrying', role: 'marketing' },
    ]

    const matchedCred = validCredentials.find(
      cred => cred.email === email && cred.password === password
    )

    if (matchedCred) {
      // Check if user has sufficient permissions for the required role
      const hasDevRights = matchedCred.role === 'developer' || matchedCred.role === 'admin'
      const hasAdminRights = matchedCred.role === 'admin'
      const hasMarketingRights = matchedCred.role === 'marketing' || hasDevRights

      if (requireRole === 'developer' && !hasDevRights) {
        setError('Deze account heeft geen developer rechten')
        return
      }
      if (requireRole === 'admin' && !hasAdminRights) {
        setError('Deze account heeft geen admin rechten')
        return
      }
      if (requireRole === 'marketing' && !hasMarketingRights) {
        setError('Deze account heeft geen marketing rechten')
        return
      }

      localStorage.setItem('dev_authenticated', 'true')
      localStorage.setItem('dev_user_email', email)
      localStorage.setItem('dev_user_role', matchedCred.role)
      setIsAuthenticated(true)
      setUserRole(matchedCred.role)
      setError('')
    } else {
      setError('Ongeldige inloggegevens')
    }
  }

  if (isAuthenticated) {
    // Re-check role from localStorage (might have been updated)
    const currentRole = localStorage.getItem('dev_user_role') || userRole
    
    // Check role permissions
    const isDeveloper = currentRole === 'developer' || currentRole === 'admin'
    const isAdmin = currentRole === 'admin'
    const isMarketing = currentRole === 'marketing' || isDeveloper || isAdmin

    if (requireRole === 'admin' && !isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Geen toegang</h1>
            <p className="text-gray-600 mb-2">Je hebt geen admin rechten.</p>
            <p className="text-sm text-gray-400 mb-4">Huidige role: {currentRole || 'geen'}</p>
            <button 
              onClick={forceLogout}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Opnieuw inloggen
            </button>
          </div>
        </div>
      )
    }

    if (requireRole === 'developer' && !isDeveloper) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Geen toegang</h1>
            <p className="text-gray-600 mb-2">Je hebt geen developer rechten.</p>
            <p className="text-sm text-gray-400 mb-4">Huidige role: {currentRole || 'geen'}</p>
            <button 
              onClick={forceLogout}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Opnieuw inloggen
            </button>
          </div>
        </div>
      )
    }

    if (requireRole === 'marketing' && !isMarketing) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Geen toegang</h1>
            <p className="text-gray-600 mb-2">Je hebt geen marketing rechten.</p>
            <p className="text-sm text-gray-400 mb-4">Huidige role: {currentRole || 'geen'}</p>
            <button 
              onClick={forceLogout}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Opnieuw inloggen
            </button>
          </div>
        </div>
      )
    }

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
            <h1 className="text-2xl font-bold text-gray-900">
              {requireRole === 'developer' ? 'Developer Dashboard' : requireRole === 'admin' ? 'Admin Dashboard' : 'Marketing Dashboard'}
            </h1>
            <p className="text-gray-600 mt-2">
              Log in om toegang te krijgen.
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
