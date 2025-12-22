import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  CreditCard,
  Package,
  MessageSquare,
  Mail,
  Phone,
  Building2,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  Clock,
  Receipt,
  Zap,
  Shield,
  Globe,
  Edit3,
  Save,
  CheckCircle2,
  Gift,
  Copy,
  Sparkles
} from 'lucide-react'
import type { Project } from '../types/project'

interface ClientAccountModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  onUpdateProject?: (updates: Partial<Project>) => Promise<void>
}

type TabType = 'profile' | 'payments' | 'package' | 'messages'

interface TabItem {
  id: TabType
  label: string
  mobileLabel: string
  icon: React.ElementType
  badge?: number
}

// Package information with enhanced data
const packageInfo: Record<string, { 
  name: string
  price: number
  features: string[]
  gradient: string
  iconBg: string
  iconColor: string
}> = {
  starter: {
    name: 'Starter',
    price: 99,
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Contactformulier',
      'Basis SEO',
      'SSL-certificaat',
      '48u support reactietijd',
    ],
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500'
  },
  professional: {
    name: 'Professioneel',
    price: 149,
    features: [
      'Tot 10 pagina\'s',
      'Premium design',
      'Blog functionaliteit',
      'Google Analytics',
      'Uitgebreide SEO',
      '24u support reactietijd',
    ],
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500'
  },
  business: {
    name: 'Business',
    price: 199,
    features: [
      'Onbeperkt pagina\'s',
      'Custom functionaliteiten',
      'Meertalig mogelijk',
      'Geavanceerde integraties',
      'Prioriteit support',
      'Maandelijkse rapportage',
    ],
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-500'
  },
  premium: {
    name: 'Premium',
    price: 249,
    features: [
      'Onbeperkt pagina\'s',
      'Custom functionaliteiten',
      'Meertalig mogelijk',
      'Geavanceerde integraties',
      'Prioriteit support',
      'Maandelijkse rapportage',
    ],
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-500'
  },
  webshop: {
    name: 'Webshop',
    price: 349,
    features: [
      'Tot 500 producten',
      'iDEAL & creditcard',
      'Voorraadbeheer',
      'Klantaccounts',
      'Kortingscodes',
      'Prioriteit support',
    ],
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-500'
  }
}

// Service type labels
const serviceTypeLabels: Record<string, string> = {
  website: 'Website',
  webshop: 'Webshop',
  logo: 'Logo Design',
  drone: 'Drone Beelden'
}

export default function ClientAccountModal({ 
  isOpen, 
  onClose, 
  project,
  onUpdateProject 
}: ClientAccountModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Editable form state
  const [formData, setFormData] = useState({
    contactName: project.contactName || '',
    contactEmail: project.contactEmail || '',
    contactPhone: project.contactPhone || '',
    businessName: project.businessName || '',
  })

  // Update form when project changes
  useEffect(() => {
    setFormData({
      contactName: project.contactName || '',
      contactEmail: project.contactEmail || '',
      contactPhone: project.contactPhone || '',
      businessName: project.businessName || '',
    })
  }, [project])

  const unreadMessages = project.messages?.filter(m => !m.read && m.from === 'developer').length || 0

  const tabs: TabItem[] = [
    { id: 'profile', label: 'Mijn gegevens', mobileLabel: 'Gegevens', icon: User },
    { id: 'payments', label: 'Betalingen', mobileLabel: 'Betaling', icon: CreditCard },
    { id: 'package', label: 'Mijn pakket', mobileLabel: 'Pakket', icon: Package },
    { id: 'messages', label: 'Berichten', mobileLabel: 'Chat', icon: MessageSquare, badge: unreadMessages },
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

  const currentPackage = packageInfo[project.package] || packageInfo.starter

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal - Full screen on mobile, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 sm:inset-4 md:inset-6 lg:inset-10 xl:inset-16 z-50 flex flex-col bg-gray-50 dark:bg-gray-950 sm:rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header with gradient */}
            <div className="flex-shrink-0 relative overflow-hidden">
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentPackage.gradient} opacity-10`} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950" />
              
              <div className="relative px-4 sm:px-6 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentPackage.gradient} flex items-center justify-center shadow-lg`}>
                      <span className="text-xl font-bold text-white">
                        {(project.businessName || project.contactName || 'W').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {project.businessName || 'Mijn Account'}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {project.contactName || project.contactEmail || 'Klantportaal'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Tabs - Horizontal scroll on mobile */}
                <div className="mt-4 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-hide pb-2">
                  <div className="flex gap-1.5 sm:gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.mobileLabel}</span>
                        {tab.badge && tab.badge > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white px-1">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6 space-y-6"
                  >
                    {/* Success message */}
                    {saveSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Gegevens succesvol opgeslagen!
                        </span>
                      </motion.div>
                    )}

                    {/* Contact Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-500" />
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            Contactgegevens
                          </h3>
                        </div>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-500/20 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Bewerken</span>
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
                                })
                              }}
                              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              Annuleren
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              <span className="hidden sm:inline">Opslaan</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Business Name */}
                        <div className="group">
                          <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                            <Building2 className="w-4 h-4" />
                            Bedrijfsnaam
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.businessName}
                              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                              placeholder="Jouw bedrijfsnaam"
                            />
                          ) : (
                            <p className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium">
                              {project.businessName || <span className="text-gray-400 italic">Niet ingevuld</span>}
                            </p>
                          )}
                        </div>

                        {/* Contact Name */}
                        <div className="group">
                          <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                            <User className="w-4 h-4" />
                            Naam
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.contactName}
                              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                              placeholder="Je naam"
                            />
                          ) : (
                            <p className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium">
                              {project.contactName || <span className="text-gray-400 italic">Niet ingevuld</span>}
                            </p>
                          )}
                        </div>

                        {/* Email & Phone - 2 column on larger screens */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="group">
                            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                              <Mail className="w-4 h-4" />
                              E-mailadres
                            </label>
                            {isEditing ? (
                              <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="email@voorbeeld.nl"
                              />
                            ) : (
                              <p className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium break-all">
                                {project.contactEmail || <span className="text-gray-400 italic">Niet ingevuld</span>}
                              </p>
                            )}
                          </div>

                          <div className="group">
                            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                              <Phone className="w-4 h-4" />
                              Telefoonnummer
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="06 12345678"
                              />
                            ) : (
                              <p className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium">
                                {project.contactPhone || <span className="text-gray-400 italic">Niet ingevuld</span>}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Info Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          Projectinformatie
                        </h3>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project ID</p>
                            <p className="font-mono text-sm text-gray-900 dark:text-white">{project.projectId}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Aangemaakt op</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(project.createdAt).toLocaleDateString('nl-NL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type dienst</p>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                              {serviceTypeLabels[project.serviceType || 'website'] || 'Website'}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pakket</p>
                            <p className="font-medium text-gray-900 dark:text-white">{currentPackage.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Referral Card */}
                    {project.referralCode && (
                      <div className="bg-gradient-to-br from-primary-500/5 to-blue-500/5 rounded-2xl border border-primary-500/20 overflow-hidden">
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                              <Gift className="w-5 h-5 text-primary-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Referral Programma</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Deel je code en verdien €50 korting per doorverwijzing!
                              </p>
                              <div className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <span className="font-mono font-bold text-primary-600 dark:text-primary-400 flex-1">
                                  {project.referralCode}
                                </span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(project.referralCode || '')}
                                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                              </div>
                              {(project.referralsCount || 0) > 0 && (
                                <p className="mt-2 text-sm text-primary-600 dark:text-primary-400">
                                  ✨ {project.referralsCount} doorverwijzing(en) • €{project.referralRewards || 0} verdiend
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <motion.div
                    key="payments"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6 space-y-6"
                  >
                    {/* Payment Status Card */}
                    <div className={`rounded-2xl overflow-hidden ${
                      project.paymentStatus === 'paid'
                        ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20'
                        : project.paymentStatus === 'awaiting_payment'
                        ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20'
                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                    }`}>
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            project.paymentStatus === 'paid'
                              ? 'bg-green-500/20'
                              : project.paymentStatus === 'awaiting_payment'
                              ? 'bg-amber-500/20'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            {project.paymentStatus === 'paid' ? (
                              <CheckCircle2 className="w-7 h-7 text-green-500" />
                            ) : project.paymentStatus === 'awaiting_payment' ? (
                              <AlertCircle className="w-7 h-7 text-amber-500" />
                            ) : (
                              <Clock className="w-7 h-7 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg sm:text-xl font-bold mb-1 ${
                              project.paymentStatus === 'paid'
                                ? 'text-green-600 dark:text-green-400'
                                : project.paymentStatus === 'awaiting_payment'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {project.paymentStatus === 'paid'
                                ? 'Betaling ontvangen ✓'
                                : project.paymentStatus === 'awaiting_payment'
                                ? 'Wacht op betaling'
                                : project.paymentStatus === 'not_required'
                                ? 'Nog geen betaling nodig'
                                : 'Betaalstatus onbekend'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {project.paymentStatus === 'paid' && project.paymentCompletedAt
                                ? `Betaald op ${new Date(project.paymentCompletedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                : project.paymentStatus === 'awaiting_payment'
                                ? 'Rond de betaling af om door te gaan met je project'
                                : 'We informeren je wanneer er een betaling nodig is'}
                            </p>
                          </div>
                          {project.paymentStatus === 'awaiting_payment' && project.paymentUrl && (
                            <a
                              href={project.paymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25"
                            >
                              Nu Betalen
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Current Subscription */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <div className={`w-10 h-10 rounded-xl ${currentPackage.iconBg} flex items-center justify-center`}>
                          <Package className={`w-5 h-5 ${currentPackage.iconColor}`} />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          Huidige abonnement
                        </h3>
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{currentPackage.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Maandelijks abonnement</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">€{currentPackage.price}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">per maand</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Invoices */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          Factuurgeschiedenis
                        </h3>
                      </div>
                      <div className="p-4 sm:p-5">
                        {project.invoices && project.invoices.length > 0 ? (
                          <div className="space-y-3">
                            {project.invoices.map((invoice) => (
                              <div
                                key={invoice.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    invoice.status === 'paid'
                                      ? 'bg-green-500/20'
                                      : invoice.status === 'overdue'
                                      ? 'bg-red-500/20'
                                      : 'bg-gray-200 dark:bg-gray-700'
                                  }`}>
                                    <Receipt className={`w-5 h-5 ${
                                      invoice.status === 'paid'
                                        ? 'text-green-500'
                                        : invoice.status === 'overdue'
                                        ? 'text-red-500'
                                        : 'text-gray-400'
                                    }`} />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{invoice.description}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {new Date(invoice.date).toLocaleDateString('nl-NL')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900 dark:text-white">€{invoice.amount.toFixed(2)}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    invoice.status === 'paid'
                                      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                      : invoice.status === 'overdue'
                                      ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {invoice.status === 'paid' ? 'Betaald' :
                                     invoice.status === 'overdue' ? 'Achterstallig' :
                                     invoice.status === 'sent' ? 'Verzonden' : 'Concept'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-10 text-center">
                            <Receipt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Nog geen facturen</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                              Facturen verschijnen hier zodra ze beschikbaar zijn
                            </p>
                          </div>
                        )}
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
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6 space-y-6"
                  >
                    {/* Package Hero Card */}
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentPackage.gradient} p-6 sm:p-8`}>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-3">
                              <Sparkles className="w-4 h-4" />
                              Jouw pakket
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                              {currentPackage.name}
                            </h2>
                            <p className="text-white/70">Maandelijks abonnement</p>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl sm:text-5xl font-bold text-white">€{currentPackage.price}</p>
                            <p className="text-white/70">per maand</p>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          {currentPackage.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
                            >
                              <Check className="w-5 h-5 text-white flex-shrink-0" />
                              <span className="text-white/90 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-primary-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Type dienst</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {serviceTypeLabels[project.serviceType || 'website'] || 'Website'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Support reactietijd</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {project.package === 'business' || project.package === 'premium'
                                ? 'Binnen 4 uur'
                                : project.package === 'professional'
                                ? 'Binnen 24 uur'
                                : 'Binnen 48 uur'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Revisions Progress */}
                    {project.revisionsTotal !== undefined && (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                              <Edit3 className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">Revisies deze maand</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {project.revisionsUsed || 0} van {project.revisionsTotal} gebruikt
                              </p>
                            </div>
                          </div>
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {project.revisionsTotal - (project.revisionsUsed || 0)}
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                            style={{
                              width: `${((project.revisionsUsed || 0) / project.revisionsTotal) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upgrade CTA */}
                    {project.package !== 'business' && project.package !== 'premium' && (
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                              <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">Upgrade naar Business</h4>
                              <p className="text-white/70 text-sm">
                                Meer pagina's, prioriteit support & custom features
                              </p>
                            </div>
                          </div>
                          <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-white/90 transition-colors">
                            Bekijk opties
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            Berichtengeschiedenis
                          </h3>
                          {project.messages && project.messages.length > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {project.messages.length} bericht{project.messages.length !== 1 ? 'en' : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        {project.messages && project.messages.length > 0 ? (
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {project.messages
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${message.from === 'client' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl ${
                                      message.from === 'client'
                                        ? 'bg-primary-500 text-white rounded-br-sm'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-xs font-medium ${
                                        message.from === 'client'
                                          ? 'text-white/80'
                                          : 'text-gray-500 dark:text-gray-400'
                                      }`}>
                                        {message.from === 'client' ? 'Jij' : message.senderName || 'Webstability'}
                                      </span>
                                      <span className={`text-xs ${
                                        message.from === 'client'
                                          ? 'text-white/60'
                                          : 'text-gray-400 dark:text-gray-500'
                                      }`}>
                                        {new Date(message.date).toLocaleDateString('nl-NL', {
                                          day: 'numeric',
                                          month: 'short',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                      {message.message}
                                    </p>
                                    {!message.read && message.from === 'developer' && (
                                      <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                                        Nieuw
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                              <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Nog geen berichten</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                              Berichten met ons team verschijnen hier
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
