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
  Star,
  Zap,
  Shield,
  Globe,
  Edit3,
  Save,
  CheckCircle2
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
  icon: React.ElementType
  badge?: number
}

// Package information
const packageInfo: Record<string, { 
  name: string
  price: number
  features: string[]
  color: string
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
    color: 'blue'
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
    color: 'purple'
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
    color: 'amber'
  },
  premium: {
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
    color: 'amber'
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
    color: 'emerald'
  }
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
    { id: 'profile', label: 'Mijn gegevens', icon: User },
    { id: 'payments', label: 'Betalingen', icon: CreditCard },
    { id: 'package', label: 'Mijn pakket', icon: Package },
    { id: 'messages', label: 'Berichten', icon: MessageSquare, badge: unreadMessages },
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal - Full screen on mobile */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 sm:inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col bg-white dark:bg-gray-900 sm:rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Account
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.businessName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Tabs - Horizontal scroll on mobile */}
              <div className="mt-4 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 min-w-max sm:min-w-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                      {tab.badge && tab.badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          activeTab === tab.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-primary-500 text-white'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 sm:p-6 space-y-6"
                  >
                    {/* Success message */}
                    {saveSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Gegevens succesvol opgeslagen
                        </span>
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Contactgegevens
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-500/20 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Bewerken
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
                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            Annuleren
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            Opslaan
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Business Name */}
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Bedrijfsnaam</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">
                            {project.businessName || '-'}
                          </p>
                        )}
                      </div>

                      {/* Contact Name */}
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Naam</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">
                            {project.contactName || '-'}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">E-mail</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">
                            {project.contactEmail || '-'}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Telefoon</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">
                            {project.contactPhone || '-'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Project ID */}
                    <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Project ID</p>
                          <p className="font-mono text-gray-900 dark:text-white">{project.projectId}</p>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          Aangemaakt: {new Date(project.createdAt).toLocaleDateString('nl-NL')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <motion.div
                    key="payments"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 sm:p-6 space-y-6"
                  >
                    {/* Payment Status Banner */}
                    <div className={`p-4 rounded-xl border ${
                      project.paymentStatus === 'paid' 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : project.paymentStatus === 'awaiting_payment'
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center gap-3">
                        {project.paymentStatus === 'paid' ? (
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-500" />
                          </div>
                        ) : project.paymentStatus === 'awaiting_payment' ? (
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className={`font-semibold ${
                            project.paymentStatus === 'paid' 
                              ? 'text-green-600 dark:text-green-400' 
                              : project.paymentStatus === 'awaiting_payment'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {project.paymentStatus === 'paid' 
                              ? 'Betaling ontvangen' 
                              : project.paymentStatus === 'awaiting_payment'
                              ? 'Wacht op betaling'
                              : project.paymentStatus === 'not_required'
                              ? 'Nog geen betaling nodig'
                              : 'Betaalstatus onbekend'}
                          </p>
                          {project.paymentCompletedAt && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Betaald op {new Date(project.paymentCompletedAt).toLocaleDateString('nl-NL')}
                            </p>
                          )}
                        </div>
                        {project.paymentStatus === 'awaiting_payment' && project.paymentUrl && (
                          <a
                            href={project.paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
                          >
                            Betalen
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Current Subscription */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Huidige abonnement
                      </h3>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-${currentPackage.color}-500/20 flex items-center justify-center`}>
                              <Package className={`w-5 h-5 text-${currentPackage.color}-500`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{currentPackage.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Maandelijks abonnement</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">€{currentPackage.price}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">per maand</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Invoices */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Factuurgeschiedenis
                      </h3>
                      {project.invoices && project.invoices.length > 0 ? (
                        <div className="space-y-3">
                          {project.invoices.map((invoice) => (
                            <div
                              key={invoice.id}
                              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    invoice.status === 'paid' 
                                      ? 'bg-green-500/20' 
                                      : invoice.status === 'overdue'
                                      ? 'bg-red-500/20'
                                      : 'bg-gray-500/20'
                                  }`}>
                                    <Receipt className={`w-5 h-5 ${
                                      invoice.status === 'paid' 
                                        ? 'text-green-500' 
                                        : invoice.status === 'overdue'
                                        ? 'text-red-500'
                                        : 'text-gray-500'
                                    }`} />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {invoice.description}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {new Date(invoice.date).toLocaleDateString('nl-NL')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    €{invoice.amount.toFixed(2)}
                                  </p>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    invoice.status === 'paid' 
                                      ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                                      : invoice.status === 'overdue'
                                      ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                                      : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {invoice.status === 'paid' ? 'Betaald' : 
                                     invoice.status === 'overdue' ? 'Achterstallig' : 
                                     invoice.status === 'sent' ? 'Verzonden' : 'Concept'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                          <Receipt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Nog geen facturen
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Package Tab */}
                {activeTab === 'package' && (
                  <motion.div
                    key="package"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 sm:p-6 space-y-6"
                  >
                    {/* Current Package */}
                    <div className={`p-6 rounded-2xl bg-gradient-to-br from-${currentPackage.color}-500/10 to-${currentPackage.color}-600/5 border border-${currentPackage.color}-500/20`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-xl bg-${currentPackage.color}-500/20 flex items-center justify-center`}>
                          <Star className={`w-7 h-7 text-${currentPackage.color}-500`} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Jouw pakket</p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {currentPackage.name}
                          </h3>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            €{currentPackage.price}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">per maand</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {currentPackage.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50"
                          >
                            <Check className={`w-5 h-5 text-${currentPackage.color}-500`} />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Service Type */}
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Type dienst</p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {project.serviceType || 'Website'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Revisions */}
                    {(project.revisionsUsed !== undefined || project.revisionsTotal !== undefined) && (
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Edit3 className="w-5 h-5 text-primary-500" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Revisies deze maand</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {project.revisionsUsed || 0} / {project.revisionsTotal || '∞'} gebruikt
                              </p>
                            </div>
                          </div>
                          <div className="w-24 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 rounded-full transition-all"
                              style={{ 
                                width: project.revisionsTotal 
                                  ? `${((project.revisionsUsed || 0) / project.revisionsTotal) * 100}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Support */}
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Support reactietijd</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {project.package === 'business' || project.package === 'premium' 
                              ? 'Prioriteit - binnen 4 uur' 
                              : project.package === 'professional'
                              ? 'Binnen 24 uur'
                              : 'Binnen 48 uur'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade CTA */}
                    {project.package !== 'business' && project.package !== 'premium' && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-blue-500/10 border border-primary-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-primary-500" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Upgrade naar Business</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Meer features en prioriteit support
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors">
                            Bekijken
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 sm:p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Berichtengeschiedenis
                    </h3>

                    {project.messages && project.messages.length > 0 ? (
                      <div className="space-y-4">
                        {project.messages
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((message) => (
                            <div
                              key={message.id}
                              className={`p-4 rounded-xl border ${
                                message.from === 'client'
                                  ? 'bg-primary-500/5 border-primary-500/20 ml-4 sm:ml-8'
                                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 mr-4 sm:mr-8'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    message.from === 'client'
                                      ? 'bg-primary-500/20'
                                      : 'bg-gray-500/20'
                                  }`}>
                                    <User className={`w-4 h-4 ${
                                      message.from === 'client'
                                        ? 'text-primary-500'
                                        : 'text-gray-500'
                                    }`} />
                                  </div>
                                  <div>
                                    <p className={`text-sm font-medium ${
                                      message.from === 'client'
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                      {message.from === 'client' ? 'Jij' : message.senderName || 'Webstability'}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                  {new Date(message.date).toLocaleDateString('nl-NL', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {message.message}
                              </p>
                              {!message.read && message.from === 'developer' && (
                                <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-primary-500 text-white">
                                  Nieuw
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                          Nog geen berichten
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Berichten met ons team verschijnen hier
                        </p>
                      </div>
                    )}
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
