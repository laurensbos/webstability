import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Shield,
  KeyRound
} from 'lucide-react'
import Logo from '../components/Logo'

// Floating Particles Component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * 400,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * 400],
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

export default function WachtwoordResetten() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const token = searchParams.get('token')
  const projectId = searchParams.get('project')
  
  // Request form state
  const [email, setEmail] = useState('')
  const [projectIdInput, setProjectIdInput] = useState('')
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [requestError, setRequestError] = useState('')
  
  // Reset form state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetError, setResetError] = useState('')

  // Pre-fill project ID from URL if available
  useEffect(() => {
    if (projectId) {
      setProjectIdInput(projectId)
    }
  }, [projectId])

  // Handle reset request (no token - requesting reset email)
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setRequestLoading(true)
    setRequestError('')

    try {
      const response = await fetch('/api/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email || undefined,
          projectId: projectIdInput || undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setRequestSent(true)
      } else {
        setRequestError(data.message || 'Er ging iets mis')
      }
    } catch {
      setRequestError('Er ging iets mis. Probeer het later opnieuw.')
    }

    setRequestLoading(false)
  }

  // Handle password reset (with token)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setResetError('Wachtwoorden komen niet overeen')
      return
    }

    if (newPassword.length < 6) {
      setResetError('Wachtwoord moet minimaal 6 tekens bevatten')
      return
    }

    setResetLoading(true)
    setResetError('')

    try {
      const response = await fetch('/api/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token,
          projectId,
          newPassword
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResetSuccess(true)
        // Redirect to project status after 3 seconds
        setTimeout(() => {
          navigate(`/status/${projectId}`)
        }, 3000)
      } else {
        setResetError(data.message || 'Er ging iets mis')
      }
    } catch {
      setResetError('Er ging iets mis. Probeer het later opnieuw.')
    }

    setResetLoading(false)
  }

  // If we have a token, show the password reset form
  const hasToken = token && projectId

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <FloatingParticles />
        
        <header className="relative z-10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="hover:opacity-80 transition">
              <Logo variant="white" />
            </Link>
          </div>
        </header>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-20 sm:pt-16 sm:pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6"
          >
            <KeyRound className="w-4 h-4" />
            {hasToken ? 'Nieuw wachtwoord instellen' : 'Wachtwoord vergeten'}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {hasToken ? (
              <>Stel je nieuwe <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">wachtwoord</span> in</>
            ) : (
              <>Wachtwoord <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">resetten</span></>
            )}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto"
          >
            {hasToken 
              ? 'Kies een nieuw wachtwoord voor je project.'
              : 'Vul je e-mailadres of Project ID in om een reset link te ontvangen.'
            }
          </motion.p>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 -mt-12 pb-12 sm:pb-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-700/50 p-6 sm:p-8"
        >
          {/* Request Reset Form (no token) */}
          {!hasToken && !requestSent && (
            <form onSubmit={handleRequestReset}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mailadres
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jouw@email.nl"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-700" />
                  <span className="text-gray-500 text-sm">of</span>
                  <div className="flex-1 h-px bg-gray-700" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={projectIdInput}
                    onChange={(e) => setProjectIdInput(e.target.value.toUpperCase())}
                    placeholder="WS-XXXXXXXX"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 font-mono transition"
                  />
                </div>
              </div>

              {requestError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{requestError}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={requestLoading || (!email && !projectIdInput)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {requestLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Versturen...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset link versturen
                  </>
                )}
              </motion.button>

              <div className="mt-6 text-center">
                <Link 
                  to="/status"
                  className="text-sm text-gray-400 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Terug naar inloggen
                </Link>
              </div>
            </form>
          )}

          {/* Request Sent Success */}
          {!hasToken && requestSent && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email verstuurd!</h3>
              <p className="text-gray-400 mb-6">
                Als dit project bestaat, ontvang je binnen enkele minuten een email met een reset link.
              </p>
              <p className="text-sm text-gray-500">
                Geen email ontvangen? Check je spam folder of{' '}
                <button 
                  onClick={() => setRequestSent(false)}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  probeer opnieuw
                </button>
              </p>
            </div>
          )}

          {/* Reset Password Form (with token) */}
          {hasToken && !resetSuccess && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-sm text-blue-400">
                  Project ID: <span className="font-mono font-bold">{projectId}</span>
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nieuw wachtwoord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimaal 6 tekens"
                      className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bevestig wachtwoord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Herhaal je wachtwoord"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {resetError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{resetError}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={resetLoading || !newPassword || !confirmPassword}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Wachtwoord wijzigen...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Wachtwoord opslaan
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* Reset Success */}
          {hasToken && resetSuccess && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Wachtwoord gewijzigd!</h3>
              <p className="text-gray-400 mb-6">
                Je wordt automatisch doorgestuurd naar je project...
              </p>
              <Link
                to={`/status/${projectId}`}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Of klik hier om direct te gaan
              </Link>
            </div>
          )}
        </motion.div>

        {/* Security badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>SSL beveiligd</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" />
            <span>Veilig opgeslagen</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
