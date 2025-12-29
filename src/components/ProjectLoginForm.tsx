/**
 * ProjectLoginForm Component
 * 
 * Login form for project status page authentication.
 * Supports login with project ID + password or email + password.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
  Clock
} from 'lucide-react'
import Logo from './Logo'

interface ProjectLoginFormProps {
  projectId?: string
  onLogin: (credentials: { projectId?: string; email?: string; password: string }) => Promise<void>
  loading?: boolean
  error?: string
}

export default function ProjectLoginForm({
  projectId,
  onLogin,
  loading = false,
  error = ''
}: ProjectLoginFormProps) {
  const { t } = useTranslation()
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onLogin({
      projectId: projectId && projectId !== ':projectId' ? projectId : undefined,
      email: emailInput || undefined,
      password: passwordInput
    })
  }

  const hasValidProjectId = projectId && projectId !== ':projectId'

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition">
            <Logo variant="white" />
          </Link>
          <span className="px-3 py-1.5 bg-blue-500/10 rounded-full text-blue-400 text-xs border border-blue-500/20 font-medium flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            {t('projectStatus.login.secure', 'Beveiligd')}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white mb-1">
                {t('projectStatus.login.title')}
              </h1>
              <p className="text-sm text-gray-400">
                {t('projectStatus.login.subtitle')}
              </p>
            </div>

            {hasValidProjectId && (
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-500">{t('projectStatus.login.project')}</p>
                <p className="font-mono text-sm text-white">{projectId}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!hasValidProjectId && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('projectStatus.login.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={t('projectStatus.login.emailPlaceholder')}
                      className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('projectStatus.login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={t('projectStatus.login.passwordPlaceholder')}
                    className="w-full pl-11 pr-11 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                    autoFocus={!!hasValidProjectId}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !passwordInput.trim()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t('projectStatus.login.submit')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link 
                to="/wachtwoord-vergeten" 
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {t('projectStatus.login.forgotPassword')}
              </Link>
            </div>
          </motion.div>

          {/* Trust badges */}
          <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-500" />
              {t('projectStatus.login.sslSecure')}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              {t('projectStatus.login.alwaysAccess')}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
