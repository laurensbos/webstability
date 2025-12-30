import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useDarkMode } from '../contexts/DarkModeContext'
import {
  User,
  CreditCard,
  Package,
  Mail,
  Phone,
  Building2,
  Loader2,
  Receipt,
  Globe,
  Edit3,
  Save,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Clock,
  Shield,
  Key,
  Gift,
  ExternalLink,
  Zap,
  TrendingUp
} from 'lucide-react'
import type { Project } from '../types/project'
import { PACKAGES } from '../config/packages'

interface AccountSectionProps {
  project: Project
  onUpdateProject?: (updates: Partial<Project>) => Promise<void>
  /** Initial tab to show */
  initialTab?: TabType
}

type TabType = 'profile' | 'payments' | 'package' | 'security'

interface TabItem {
  id: TabType
  label: string
  icon: React.ElementType
}

// Package visual styling
const packageStyles: Record<string, { 
  gradient: string
  iconBg: string
  iconColor: string
  bgLight: string
  bgDark: string
}> = {
  starter: {
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-500/10'
  },
  professional: {
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-500/10'
  },
  business: {
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-500',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-500/10'
  },
  webshop: {
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-500/10'
  }
}

// Helper to get package info
const getPackageInfo = (packageType: string) => {
  const pkg = PACKAGES[packageType as keyof typeof PACKAGES]
  const style = packageStyles[packageType] || packageStyles.starter
  return {
    name: pkg?.name || 'Starter',
    price: pkg?.price || 119,
    setupFee: pkg?.setupFee || 149,
    features: pkg?.features || [],
    revisions: pkg?.revisions || 2,
    changesPerMonth: pkg?.changesPerMonth || 2,
    ...style
  }
}

export default function AccountSection({ 
  project,
  onUpdateProject,
  initialTab = 'profile'
}: AccountSectionProps) {
  const { t } = useTranslation()
  const { darkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedReferral, setCopiedReferral] = useState(false)
  const [passwordResetLoading, setPasswordResetLoading] = useState(false)
  const [passwordResetSent, setPasswordResetSent] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(project.referralCode || null)
  const [loadingReferral, setLoadingReferral] = useState(false)
  
  // Get or create referral code on mount
  useEffect(() => {
    const fetchOrCreateReferralCode = async () => {
      // If project already has referral code, use it
      if (project.referralCode) {
        setReferralCode(project.referralCode)
        return
      }
      
      setLoadingReferral(true)
      try {
        const response = await fetch('/api/referral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: project.projectId })
        })
        const data = await response.json()
        if (data.success && data.referralCode) {
          setReferralCode(data.referralCode)
        }
      } catch (error) {
        console.error('Error fetching referral code:', error)
      } finally {
        setLoadingReferral(false)
      }
    }
    
    fetchOrCreateReferralCode()
  }, [project.projectId, project.referralCode])
  
  const referralLink = referralCode 
    ? `https://webstability.nl/start?ref=${referralCode}`
    : ''
  
  // Handle password reset request
  const handlePasswordReset = async () => {
    if (!project.contactEmail) return
    
    setPasswordResetLoading(true)
    try {
      const response = await fetch('/api/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: project.contactEmail,
          projectId: project.projectId 
        })
      })
      
      if (response.ok) {
        setPasswordResetSent(true)
        setTimeout(() => setPasswordResetSent(false), 5000)
      }
    } catch (error) {
      console.error('Error requesting password reset:', error)
    } finally {
      setPasswordResetLoading(false)
    }
  }
  
  // Calculate changes used this month (mock - would come from API)
  const changesUsedThisMonth = project.changesThisMonth || 0
  const changesPerMonth = getPackageInfo(project.package).changesPerMonth
  
  // Editable form state
  const [formData, setFormData] = useState({
    contactName: project.contactName || '',
    contactEmail: project.contactEmail || '',
    contactPhone: project.contactPhone || '',
    businessName: project.businessName || '',
    preferredLanguage: project.preferredLanguage || 'nl',
  })

  // Update form when project changes
  useEffect(() => {
    setFormData({
      contactName: project.contactName || '',
      contactEmail: project.contactEmail || '',
      contactPhone: project.contactPhone || '',
      businessName: project.businessName || '',
      preferredLanguage: project.preferredLanguage || 'nl',
    })
  }, [project])

  const tabs: TabItem[] = [
    { id: 'profile', label: t('account.tabs.profile'), icon: User },
    { id: 'payments', label: t('account.tabs.payments'), icon: CreditCard },
    { id: 'package', label: t('account.tabs.package'), icon: Package },
    { id: 'security', label: t('account.tabs.security', 'Beveiliging'), icon: Shield },
  ]

  const handleSave = async () => {
    if (!onUpdateProject) return
    
    setIsSaving(true)
    try {
      await onUpdateProject({
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        businessName: formData.businessName,
        preferredLanguage: formData.preferredLanguage as 'nl' | 'en',
      })
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const copyProjectId = () => {
    navigator.clipboard.writeText(project.projectId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentPackage = getPackageInfo(project.package)

  // Phase display helper
  const getPhaseInfo = (status: string) => {
    const phases: Record<string, { label: string; color: string; bg: string }> = {
      onboarding: { label: t('account.phase.onboarding', 'Onboarding'), color: 'text-blue-500', bg: 'bg-blue-500' },
      design: { label: t('account.phase.design', 'Design'), color: 'text-purple-500', bg: 'bg-purple-500' },
      feedback: { label: t('account.phase.feedback', 'Feedback'), color: 'text-amber-500', bg: 'bg-amber-500' },
      revisie: { label: t('account.phase.revision', 'Revisie'), color: 'text-orange-500', bg: 'bg-orange-500' },
      payment: { label: t('account.phase.payment', 'Betaling'), color: 'text-pink-500', bg: 'bg-pink-500' },
      domain: { label: t('account.phase.domain', 'Domein'), color: 'text-cyan-500', bg: 'bg-cyan-500' },
      live: { label: t('account.phase.live', 'Live'), color: 'text-green-500', bg: 'bg-green-500' },
    }
    return phases[status] || phases.onboarding
  }
  
  const phaseInfo = getPhaseInfo(project.status)

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralLink)
    setCopiedReferral(true)
    setTimeout(() => setCopiedReferral(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Quick Status Bar */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3`}>
        {/* Current Phase */}
        <div className={`rounded-xl p-4 border ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${phaseInfo.bg}`} />
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('account.currentPhase', 'Huidige fase')}
            </span>
          </div>
          <p className={`font-semibold ${phaseInfo.color}`}>{phaseInfo.label}</p>
        </div>
        
        {/* Changes This Month */}
        <div className={`rounded-xl p-4 border ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Zap className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('account.changesLeft', 'Wijzigingen over')}
            </span>
          </div>
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {changesPerMonth - changesUsedThisMonth}/{changesPerMonth}
          </p>
        </div>
        
        {/* Domain - only show if live */}
        {project.status === 'live' && project.domainInfo?.domainName ? (
          <div className={`rounded-xl p-4 border col-span-2 sm:col-span-1 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Globe className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('account.yourWebsite', 'Je website')}
              </span>
            </div>
            <a 
              href={`https://${project.domainInfo.domainName}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold text-primary-500 hover:text-primary-400 flex items-center gap-1`}
            >
              {project.domainInfo.domainName}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <div className={`rounded-xl p-4 border col-span-2 sm:col-span-1 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('account.progress', 'Voortgang')}
              </span>
            </div>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {(project as any).onboardingProgress || 0}% {t('account.complete', 'compleet')}
            </p>
          </div>
        )}
      </div>

      {/* Header with avatar and quick info */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'
      }`}>
        <div className={`relative overflow-hidden p-5 ${darkMode ? currentPackage.bgDark : currentPackage.bgLight}`}>
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentPackage.gradient} opacity-5`} />
          
          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentPackage.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <span className="text-xl font-bold text-white">
                {(project.businessName || project.contactName || 'W').charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className={`text-lg font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {project.businessName || t('account.yourBusiness')}
              </h2>
              <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {project.contactName || project.contactEmail}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${currentPackage.gradient} text-white`}>
                  <Package className="w-3 h-3" />
                  {currentPackage.name}
                </span>
                <button
                  onClick={copyProjectId}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                    darkMode 
                      ? 'bg-gray-700/50 text-gray-400 hover:text-white' 
                      : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {project.projectId}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? darkMode
                    ? 'text-white'
                    : 'text-gray-900'
                  : darkMode
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="account-tab-indicator"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentPackage.gradient}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Success message */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl flex items-center gap-3 ${
                  darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  {t('account.saved')}
                </span>
              </motion.div>
            )}

            {/* Contact Details Card */}
            <div className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${
                darkMode ? 'border-gray-700/50' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-primary-500/20' : 'bg-primary-50'
                  }`}>
                    <User className={`w-4 h-4 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                  </div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('account.contactDetails')}
                  </h3>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20' 
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {t('account.edit')}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          contactName: project.contactName || '',
                          contactEmail: project.contactEmail || '',
                          contactPhone: project.contactPhone || '',
                          businessName: project.businessName || '',
                          preferredLanguage: project.preferredLanguage || 'nl',
                        })
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t('account.cancel')}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      {t('account.save')}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5">
                {isEditing ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('account.businessName')}
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                          darkMode 
                            ? 'bg-gray-900 border-gray-700 text-white' 
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                        placeholder={t('account.placeholders.businessName')}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('account.contactPerson')}
                      </label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                          darkMode 
                            ? 'bg-gray-900 border-gray-700 text-white' 
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                        placeholder={t('account.placeholders.contactName')}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('account.contactEmail')}
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                          darkMode 
                            ? 'bg-gray-900 border-gray-700 text-white' 
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                        placeholder={t('account.placeholders.email')}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('account.contactPhone')}
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                          darkMode 
                            ? 'bg-gray-900 border-gray-700 text-white' 
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                        placeholder={t('account.placeholders.phone')}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('account.emailLanguage')}
                      </label>
                      <div className="flex items-center gap-2">
                        <Globe className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <select
                          value={formData.preferredLanguage}
                          onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as 'nl' | 'en' })}
                          className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 text-white' 
                              : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        >
                          <option value="nl">🇳🇱 Nederlands</option>
                          <option value="en">🇬🇧 English</option>
                        </select>
                      </div>
                      <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t('account.emailLanguageDescription')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('account.company')}</span>
                      </div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.businessName || <span className="text-gray-400 italic">{t('account.notFilled')}</span>}
                      </p>
                    </div>
                    <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <User className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('account.contact')}</span>
                      </div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.contactName || <span className="text-gray-400 italic">{t('account.notFilled')}</span>}
                      </p>
                    </div>
                    <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('account.email')}</span>
                      </div>
                      <p className={`font-medium text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.contactEmail || <span className="text-gray-400 italic">{t('account.notFilled')}</span>}
                      </p>
                    </div>
                    <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('account.phone')}</span>
                      </div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.contactPhone || <span className="text-gray-400 italic">{t('account.notFilled')}</span>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Info Card */}
            <div className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center gap-3 px-5 py-4 border-b ${
                darkMode ? 'border-gray-700/50' : 'border-gray-100'
              }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Globe className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('account.projectInfo')}
                </h3>
              </div>

              <div className="p-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('account.projectId')}</p>
                    <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.projectId}</p>
                  </div>
                  <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('account.createdAt')}</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(project.createdAt).toLocaleDateString(t('common.locale'), {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('account.serviceType')}</p>
                    <p className={`font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t(`account.${project.serviceType || 'website'}`)}
                    </p>
                  </div>
                  <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t('account.package.title')}</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentPackage.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <motion.div
            key="payments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Payment Status */}
            <div className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center gap-3 px-5 py-4 border-b ${
                darkMode ? 'border-gray-700/50' : 'border-gray-100'
              }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  project.paymentStatus === 'paid' 
                    ? 'bg-green-500/20' 
                    : darkMode ? 'bg-amber-500/20' : 'bg-amber-50'
                }`}>
                  <CreditCard className={`w-4 h-4 ${
                    project.paymentStatus === 'paid' ? 'text-green-500' : 'text-amber-500'
                  }`} />
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('account.paymentStatus')}
                </h3>
              </div>

              <div className="p-5">
                {project.paymentStatus === 'paid' ? (
                  <div className={`flex items-center gap-3 p-4 rounded-xl ${
                    darkMode ? 'bg-green-500/10' : 'bg-green-50'
                  }`}>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                        {t('account.paymentReceived')}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-green-400/70' : 'text-green-600'}`}>
                        {t('account.setupFee')}: €{currentPackage.setupFee}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`flex items-start gap-3 p-4 rounded-xl ${
                      darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                      }`}>
                        <Clock className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className={`font-medium mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                          {t('account.noPaymentYet')}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-blue-400/70' : 'text-blue-600'}`}>
                          {t('account.noPaymentDescription')}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('account.afterApproval')}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          €{currentPackage.setupFee}
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {t('account.oneTimeSetup')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Subscription Info */}
            <div className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center gap-3 px-5 py-4 border-b ${
                darkMode ? 'border-gray-700/50' : 'border-gray-100'
              }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-primary-500/20' : 'bg-primary-50'
                }`}>
                  <Receipt className={`w-4 h-4 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('account.monthlySubscription')}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('account.startsAfterDelivery')}
                  </p>
                </div>
              </div>

              <div className="p-5">
                {/* Price */}
                <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${
                  darkMode ? 'bg-gradient-to-r from-primary-500/10 to-primary-600/5' : 'bg-gradient-to-r from-primary-50 to-primary-100/50'
                }`}>
                  <div>
                    <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                      {t('account.packageName', { name: currentPackage.name })}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{currentPackage.price}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('account.package.perMonth')}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                  }`}>
                    {t('account.noContract')}
                  </div>
                </div>
                
                {/* What's included */}
                <div className="space-y-3">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('account.whatsIncluded')}
                  </p>
                  
                  <div className={`grid gap-2`}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('account.hosting')}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('account.hostingDesc')}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('account.changesPerMonthCount', { count: currentPackage.changesPerMonth })}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('account.changesDesc')}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('account.sslSecurity')}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('account.sslDesc')}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('account.maintenance')}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('account.maintenanceDesc')}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('account.chatSupport')}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('account.chatSupportDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cancellation info */}
                <div className={`mt-4 p-3 rounded-xl border-2 border-dashed ${
                  darkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50/50'
                }`}>
                  <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('account.cancelAnytime')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Package Tab */}
        {activeTab === 'package' && (
          <motion.div
            key="package"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Current Package */}
            <div className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'
            }`}>
              <div className={`relative overflow-hidden p-5 ${darkMode ? currentPackage.bgDark : currentPackage.bgLight}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${currentPackage.gradient} opacity-10`} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentPackage.gradient} flex items-center justify-center`}>
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('account.packageName', { name: currentPackage.name })}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('account.package.yourCurrentPackage')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      €{currentPackage.price}
                    </span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('account.package.perMonth')}</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('account.package.includedInPackage')}
                </h4>
                <ul className="space-y-2.5">
                  {currentPackage.features.slice(0, 6).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        darkMode ? 'bg-green-500/20' : 'bg-green-100'
                      }`}>
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Upgrade hint - only show for non-business */}
            {project.package !== 'business' && (
              <div className={`rounded-2xl border p-5 ${
                darkMode ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
                  }`}>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                      {t('account.package.needMore')}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-amber-400/70' : 'text-amber-600'}`}>
                      {t('account.package.upgradeDescription')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Password Reset */}
            <div className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center gap-3 px-5 py-4 border-b ${
                darkMode ? 'border-gray-700/50' : 'border-gray-100'
              }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-primary-500/20' : 'bg-primary-50'
                }`}>
                  <Key className={`w-4 h-4 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('account.security.password', 'Wachtwoord')}
                </h3>
              </div>
              <div className="p-5">
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('account.security.passwordDescription', 'Wijzig het wachtwoord voor toegang tot je project dashboard.')}
                </p>
                {passwordResetSent ? (
                  <div className={`flex items-center gap-2 p-3 rounded-xl ${
                    darkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t('account.security.resetEmailSent', 'Reset e-mail verzonden! Check je inbox.')}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handlePasswordReset}
                    disabled={passwordResetLoading || !project.contactEmail}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                      darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {passwordResetLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    {t('account.security.changePassword', 'Wachtwoord wijzigen')}
                  </button>
                )}
              </div>
            </div>

            {/* Email Address - Contact Info */}
            <div className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'
            }`}>
              <div className={`flex items-center gap-3 px-5 py-4 border-b ${
                darkMode ? 'border-gray-700/50' : 'border-gray-100'
              }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-green-500/20`}>
                  <Mail className={`w-4 h-4 text-green-500`} />
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('account.security.email', 'E-mailadres')}
                </h3>
              </div>
              <div className="p-5">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  darkMode ? 'bg-green-500/10' : 'bg-green-50'
                }`}>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      {project.contactEmail || t('account.security.noEmail', 'Geen e-mail ingesteld')}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-green-400/70' : 'text-green-600'}`}>
                      {t('account.security.emailInUse', 'Gebruikt voor inloggen en notificaties')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Program */}
            <div className={`rounded-2xl border overflow-hidden relative ${
              darkMode ? 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 border-purple-500/20' : 'bg-gradient-to-br from-purple-50 via-pink-50/50 to-purple-50 border-purple-200'
            }`}>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              
              <div className={`flex items-center gap-3 px-5 py-4 border-b relative ${
                darkMode ? 'border-purple-500/20' : 'border-purple-200'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25`}>
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('account.referral.title', 'Verdien €25 korting')}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {t('account.referral.subtitle', 'Voor elke vriend die start')}
                  </p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('account.referral.description', 'Deel je unieke link en ontvang €25 korting op je abonnement voor elke nieuwe klant die via jouw link start.')}
                </p>
                
                {/* Referral Link */}
                <div className={`flex items-center gap-2 p-3 rounded-xl ${
                  darkMode ? 'bg-gray-900/50' : 'bg-white'
                }`}>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs mb-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {t('account.referral.yourLink', 'Jouw link')}
                    </p>
                    {loadingReferral ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {t('account.referral.loading', 'Link genereren...')}
                        </span>
                      </div>
                    ) : referralLink ? (
                      <p className={`text-sm font-mono truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {referralLink}
                      </p>
                    ) : (
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t('account.referral.unavailable', 'Niet beschikbaar')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={copyReferralCode}
                    disabled={!referralLink || loadingReferral}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      copiedReferral
                        ? 'bg-green-500 text-white'
                        : darkMode 
                          ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                  >
                    {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedReferral ? t('account.copied', 'Gekopieerd!') : t('account.copy', 'Kopieer')}
                  </button>
                </div>
                
                {/* Stats placeholder */}
                <div className={`grid grid-cols-2 gap-3 pt-2`}>
                  <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.referralsCount || 0}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {t('account.referral.friends', 'Vrienden verwezen')}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
                    <p className={`text-2xl font-bold text-green-500`}>
                      €{project.referralRewards || 0}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {t('account.referral.earned', 'Korting verdiend')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
