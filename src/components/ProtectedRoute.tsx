import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Lock, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Laden...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Profiel laden...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Fallback login voor development (zonder Supabase)
const FallbackLogin: React.FC<{ children: React.ReactNode; requireRole?: 'developer' | 'admin' | 'marketing' }> = ({ children, requireRole }) => {
  // Session-based auth - cleared on page refresh/close
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [userRole, setUserRole] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  // Clear any stored auth on mount - force re-login every session
  React.useEffect(() => {
    // Use sessionStorage instead of localStorage for session-based auth
    const sessionAuth = sessionStorage.getItem('dev_authenticated')
    const sessionRole = sessionStorage.getItem('dev_user_role')
    if (sessionAuth === 'true' && sessionRole) {
      setIsAuthenticated(true)
      setUserRole(sessionRole)
    }
    // Clear localStorage legacy auth
    localStorage.removeItem('dev_authenticated')
    localStorage.removeItem('dev_user_role')
    localStorage.removeItem('dev_user_email')
  }, [])

  // Force logout function
  const forceLogout = () => {
    sessionStorage.removeItem('dev_authenticated')
    sessionStorage.removeItem('dev_user_role')
    sessionStorage.removeItem('dev_user_email')
    setIsAuthenticated(false)
    setUserRole('')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Development credentials
    const validCredentials = [
      { email: 'laurensbos', password: 'N45eqtu2!jz8j0v', role: 'developer' },
      { email: 'info@webstability.nl', password: 'N45eqtu2!jz8j0v', role: 'developer' },
      { email: 'developer@webstability.nl', password: 'test1234', role: 'developer' },
      { email: 'admin@webstability.nl', password: 'test1234', role: 'admin' },
      { email: 'admin', password: 'N45eqtu2!jz8j0v', role: 'admin' },
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
      // Also set sessionStorage for current session
      sessionStorage.setItem('dev_authenticated', 'true')
      sessionStorage.setItem('dev_user_email', email)
      sessionStorage.setItem('dev_user_role', matchedCred.role)
      setIsAuthenticated(true)
      setUserRole(matchedCred.role)
      setError('')
    } else {
      setError('Ongeldige inloggegevens')
    }
  }

  if (isAuthenticated) {
    // Re-check role from sessionStorage (might have been updated)
    const currentRole = sessionStorage.getItem('dev_user_role') || userRole
    
    // Check role permissions
    const isDeveloper = currentRole === 'developer' || currentRole === 'admin'
    const isAdmin = currentRole === 'admin'
    const isMarketing = currentRole === 'marketing' || isDeveloper || isAdmin

    if (requireRole === 'admin' && !isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <Logo variant="white" size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {requireRole === 'developer' ? 'Developer Dashboard' : requireRole === 'admin' ? 'Admin Dashboard' : 'Marketing Dashboard'}
          </h1>
          <p className="text-emerald-200 mt-1">Log in om toegang te krijgen.</p>
        </motion.div>

        {/* Login form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">
              Naam
            </label>
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/70 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
                placeholder="Gebruikersnaam"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">
              Wachtwoord
            </label>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-300/70 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
          >
            Inloggen
          </motion.button>
        </motion.form>

        <p className="text-center text-emerald-300/60 text-sm mt-6">
          © {new Date().getFullYear()} Webstability
        </p>
      </motion.div>
    </div>
  )
}

export default ProtectedRoute
