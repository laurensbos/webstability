import { useState, useEffect } from 'react'
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
  Clock
} from 'lucide-react'
import type { Project } from '../types/project'
import { PACKAGES } from '../config/packages'

interface AccountSectionProps {
  project: Project
  onUpdateProject?: (updates: Partial<Project>) => Promise<void>
  /** Initial tab to show */
  initialTab?: TabType
}

type TabType = 'profile' | 'payments' | 'package'

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

// Service type labels
const serviceTypeLabels: Record<string, string> = {
  website: 'Website',
  webshop: 'Webshop',
  logo: 'Logo Design',
  drone: 'Drone Beelden'
}

export default function AccountSection({ 
  project,
  onUpdateProject,
  initialTab = 'profile'
}: AccountSectionProps) {
  const { darkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  
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

  const tabs: TabItem[] = [
    { id: 'profile', label: 'Mijn gegevens', icon: User },
    { id: 'payments', label: 'Betalingen', icon: CreditCard },
    { id: 'package', label: 'Mijn pakket', icon: Package },
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

  const copyProjectId = () => {
    navigator.clipboard.writeText(project.projectId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentPackage = getPackageInfo(project.package)

  return (
    <div className="space-y-6">
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
                {project.businessName || 'Jouw bedrijf'}
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
                  Gegevens succesvol opgeslagen!
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
                    Contactgegevens
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
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Annuleren
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
                      Opslaan
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5">
                {isEditing ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Bedrijfsnaam
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
                        placeholder="Jouw bedrijfsnaam"
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Contactpersoon
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
                        placeholder="Je naam"
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        E-mailadres
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
                        placeholder="email@voorbeeld.nl"
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Telefoonnummer
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
                        placeholder="06 12345678"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Bedrijf</span>
                      </div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.businessName || <span className="text-gray-400 italic">Niet ingevuld</span>}
                      </p>
                    </div>
                    <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <User className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Contact</span>
                      </div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.contactName || <span className="text-gray-400 italic">Niet ingevuld</span>}
                      </p>
                    </div>
                    <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>E-mail</span>
                      </div>
                      <p className={`font-medium text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.contactEmail || <span className="text-gray-400 italic">Niet ingevuld</span>}
                      </p>
                    </div>
                    <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Telefoon</span>
                      </div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.contactPhone || <span className="text-gray-400 italic">Niet ingevuld</span>}
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
                  Projectinformatie
                </h3>
              </div>

              <div className="p-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Project ID</p>
                    <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.projectId}</p>
                  </div>
                  <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Aangemaakt op</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(project.createdAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Type dienst</p>
                    <p className={`font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {serviceTypeLabels[project.serviceType || 'website'] || 'Website'}
                    </p>
                  </div>
                  <div className={`p-3.5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pakket</p>
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
                  Betalingsstatus
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
                        Betaling ontvangen ✓
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-green-400/70' : 'text-green-600'}`}>
                        Eenmalige opstartkosten: €{currentPackage.setupFee}
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
                          Nog geen betaling nodig
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-blue-400/70' : 'text-blue-600'}`}>
                          Je betaalt pas nadat je het design hebt goedgekeurd. Eerst kijken, dan beslissen!
                        </p>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Na goedkeuring design:
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          €{currentPackage.setupFee}
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          eenmalige opstartkosten
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
                    Maandelijks abonnement
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Start na oplevering website
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
                      {currentPackage.name} pakket
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{currentPackage.price}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/maand</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                  }`}>
                    Geen contract
                  </div>
                </div>
                
                {/* What's included */}
                <div className="space-y-3">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Dit zit erin
                  </p>
                  
                  <div className={`grid gap-2`}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Hosting & domein
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Je website staat altijd online
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {currentPackage.changesPerMonth} wijzigingen per maand
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Teksten, foto's of kleine aanpassingen
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          SSL-certificaat & beveiliging
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Veilig voor jou en je bezoekers
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Onderhoud & updates
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Wij houden alles up-to-date
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Support via chat
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Vragen? Wij helpen je snel
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
                    💡 Maandelijks opzegbaar - geen lange contracten, geen gedoe
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
                        {currentPackage.name} pakket
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Je huidige pakket
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      €{currentPackage.price}
                    </span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/maand</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Inbegrepen in je pakket
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
                      Meer nodig?
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-amber-400/70' : 'text-amber-600'}`}>
                      Neem contact op om je pakket te upgraden en meer functies te ontgrendelen.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
