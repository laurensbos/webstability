import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDarkMode } from '../contexts/DarkModeContext'
import {
  User,
  CreditCard,
  Package,
  MessageSquare,
  Mail,
  Phone,
  Building2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Receipt,
  Globe,
  Edit3,
  Save,
  CheckCircle2,
  Gift,
  Copy,
  ArrowLeft,
  Home,
  ChevronRight,
  Check,
  Shield,
  Zap,
  Sparkles
} from 'lucide-react'
import Logo from './Logo'
import type { Project } from '../types/project'
import { getWhatsAppLink, WHATSAPP_MESSAGES } from '../lib/constants'
import { PACKAGES } from '../config/packages'

interface ClientAccountModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  onUpdateProject?: (updates: Partial<Project>) => Promise<void>
  /** Render inline instead of modal - used for account tab in bottom nav */
  isInline?: boolean
  /** Initial tab to show */
  initialTab?: TabType
}

type TabType = 'profile' | 'payments' | 'package' | 'messages'

interface TabItem {
  id: TabType
  label: string
  mobileLabel: string
  icon: React.ElementType
  badge?: number
}

// Package visual styling
const packageStyles: Record<string, { 
  gradient: string
  iconBg: string
  iconColor: string
  accentColor: string
}> = {
  starter: {
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
    accentColor: 'blue'
  },
  professional: {
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500',
    accentColor: 'purple'
  },
  business: {
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-500',
    accentColor: 'amber'
  },
  webshop: {
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-500',
    accentColor: 'emerald'
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

export default function ClientAccountModal({ 
  isOpen, 
  onClose, 
  project,
  onUpdateProject,
  isInline = false,
  initialTab
}: ClientAccountModalProps) {
  const { darkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])
  
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

  const currentPackage = getPackageInfo(project.package)

  if (!isOpen) return null

  // Content to render - used for both modal and inline modes
  const renderContent = () => (
    <>
      {/* Hero Section with User Info */}
      <div className="flex-shrink-0 relative overflow-hidden">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentPackage.gradient} opacity-10`} />
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${
          darkMode ? 'to-gray-950' : 'to-gray-50'
        }`} />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Large Avatar */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${currentPackage.gradient} flex items-center justify-center shadow-2xl`}>
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {(project.businessName || project.contactName || 'W').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {project.businessName || 'Mijn Account'}
              </h1>
              <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {project.contactName ? `${project.contactName} • ` : ''}{project.contactEmail || 'Klantportaal'}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentPackage.gradient} text-white`}>
                  <Package className="w-3.5 h-3.5" />
                  {currentPackage.name} pakket
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Project: {project.projectId}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="mt-8 -mb-px">
            <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? darkMode
                        ? 'bg-gray-900 text-white border-t-2 border-x border-t-primary-500 border-gray-800'
                        : 'bg-white text-gray-900 border-t-2 border-x border-t-primary-500 border-gray-200 shadow-sm'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
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
          </nav>
        </div>
      </div>
    </>
  )

  // Inline mode - render content directly without modal overlay and header
  if (isInline) {
    return (
      <div className={`flex flex-col min-h-full ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        {renderContent()}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - subtle for page-like feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}
          />

          {/* Full Page Portal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex flex-col overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}
          >
            {/* Header - Website style */}
            <header className={`flex-shrink-0 backdrop-blur-md border-b sticky top-0 z-10 ${
              darkMode 
                ? 'bg-gray-950/95 border-gray-800' 
                : 'bg-white/95 border-gray-200'
            }`}>
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <div className="flex items-center gap-4">
                    <Logo className="h-7" variant={darkMode ? 'white' : 'default'} />
                  </div>

                  {/* Breadcrumb - Desktop */}
                  <div className="hidden md:flex items-center gap-2 text-sm">
                    <button
                      onClick={onClose}
                      className={`hover:text-primary-500 transition-colors flex items-center gap-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      Project
                    </button>
                    <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mijn Account</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* WhatsApp Button */}
                    <a
                      href={getWhatsAppLink(WHATSAPP_MESSAGES.PROJECT(project.projectId))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        darkMode
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    {/* Back Button */}
                    <button
                      onClick={onClose}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        darkMode
                          ? 'bg-gray-800 hover:bg-gray-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Terug naar project</span>
                      <span className="sm:hidden">Terug</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Hero Section with User Info */}
            <div className="flex-shrink-0 relative overflow-hidden">
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentPackage.gradient} opacity-10`} />
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${
                darkMode ? 'to-gray-950' : 'to-gray-50'
              }`} />
              
              <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Large Avatar */}
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${currentPackage.gradient} flex items-center justify-center shadow-2xl`}>
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {(project.businessName || project.contactName || 'W').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.businessName || 'Mijn Account'}
                    </h1>
                    <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.contactName ? `${project.contactName} • ` : ''}{project.contactEmail || 'Klantportaal'}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentPackage.gradient} text-white`}>
                        <Package className="w-3.5 h-3.5" />
                        {currentPackage.name} pakket
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Project: {project.projectId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="mt-8 -mb-px">
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-medium transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? darkMode
                              ? 'bg-gray-900 text-white border-t-2 border-x border-t-primary-500 border-gray-800'
                              : 'bg-white text-gray-900 border-t-2 border-x border-t-primary-500 border-gray-200 shadow-sm'
                            : darkMode
                              ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
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
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-6 lg:p-8 space-y-6"
                    >
                      {/* Success message */}
                      {saveSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-green-400 font-medium">
                            Gegevens succesvol opgeslagen!
                          </span>
                        </motion.div>
                      )}

                      {/* Contact Details Card */}
                      <div className={`rounded-2xl border overflow-hidden ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
                      }`}>
                        <div className={`flex items-center justify-between px-4 sm:px-6 py-4 border-b ${
                          darkMode ? 'border-gray-700' : 'border-gray-100'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              darkMode ? 'bg-primary-500/20' : 'bg-primary-50'
                            }`}>
                              <User className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                            </div>
                            <h3 className={`text-base sm:text-lg font-semibold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              Contactgegevens
                            </h3>
                          </div>
                          {!isEditing ? (
                            <button
                              onClick={() => setIsEditing(true)}
                              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                darkMode 
                                  ? 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20' 
                                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                              }`}
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
                              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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

                      <div className="p-4 sm:p-5">
                        {isEditing ? (
                          // Edit mode - form layout
                          <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Bedrijfsnaam
                                </label>
                                <input
                                  type="text"
                                  value={formData.businessName}
                                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
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
                                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                                    darkMode 
                                      ? 'bg-gray-900 border-gray-700 text-white' 
                                      : 'bg-gray-50 border-gray-200 text-gray-900'
                                  }`}
                                  placeholder="Je naam"
                                />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  E-mailadres
                                </label>
                                <input
                                  type="email"
                                  value={formData.contactEmail}
                                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
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
                                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                                    darkMode 
                                      ? 'bg-gray-900 border-gray-700 text-white' 
                                      : 'bg-gray-50 border-gray-200 text-gray-900'
                                  }`}
                                  placeholder="06 12345678"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          // View mode - compact list
                          <div className="space-y-3">
                            {/* Bedrijf & Naam */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  <Building2 className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Bedrijf</p>
                                  <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {project.businessName || <span className="text-gray-400 italic text-sm">—</span>}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Contact</p>
                                  <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {project.contactName || <span className="text-gray-400 italic text-sm">—</span>}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Divider */}
                            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`} />
                            
                            {/* Email & Phone */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>E-mail</p>
                                  <p className={`font-medium truncate text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {project.contactEmail || <span className="text-gray-400 italic">—</span>}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Telefoon</p>
                                  <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {project.contactPhone || <span className="text-gray-400 italic text-sm">—</span>}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Project Info Card */}
                    <div className={`rounded-2xl shadow-sm border overflow-hidden ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className={`flex items-center gap-3 px-4 sm:px-5 py-4 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <Globe className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <h3 className={`text-base sm:text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Projectinformatie
                        </h3>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Project ID</p>
                            <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.projectId}</p>
                          </div>
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aangemaakt op</p>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {new Date(project.createdAt).toLocaleDateString('nl-NL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type dienst</p>
                            <p className={`font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {serviceTypeLabels[project.serviceType || 'website'] || 'Website'}
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pakket</p>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentPackage.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Referral Card */}
                    {project.referralCode && (
                      <div className={`rounded-2xl border overflow-hidden ${
                        darkMode
                          ? 'bg-gradient-to-br from-primary-500/5 to-blue-500/5 border-primary-500/20'
                          : 'bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200'
                      }`}>
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              darkMode ? 'bg-primary-500/20' : 'bg-primary-100'
                            }`}>
                              <Gift className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                🎁 Referral Programma
                              </h4>
                              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Deel je code en verdien €50 korting per doorverwijzing!
                              </p>
                              <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                                darkMode
                                  ? 'bg-gray-800 border-gray-700'
                                  : 'bg-white border-gray-200'
                              }`}>
                                <span className={`font-mono font-bold flex-1 ${
                                  darkMode ? 'text-primary-400' : 'text-primary-600'
                                }`}>
                                  {project.referralCode}
                                </span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(project.referralCode || '')}
                                  className={`p-2 rounded-lg transition-colors ${
                                    darkMode
                                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                                      : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                                  }`}
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                              {(project.referralsCount || 0) > 0 && (
                                <p className={`mt-2 text-sm ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
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
                        : darkMode
                        ? 'bg-gradient-to-br from-primary-500/5 to-purple-500/5 border border-primary-500/20'
                        : 'bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200'
                    }`}>
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            project.paymentStatus === 'paid'
                              ? 'bg-green-500/20'
                              : project.paymentStatus === 'awaiting_payment'
                              ? 'bg-amber-500/20'
                              : 'bg-gradient-to-br from-primary-500/20 to-purple-500/20'
                          }`}>
                            {project.paymentStatus === 'paid' ? (
                              <CheckCircle2 className="w-8 h-8 text-green-500" />
                            ) : project.paymentStatus === 'awaiting_payment' ? (
                              <AlertCircle className="w-8 h-8 text-amber-500" />
                            ) : (
                              <span className="text-3xl">🎨</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg sm:text-xl font-bold mb-1 ${
                              project.paymentStatus === 'paid'
                                ? 'text-green-400'
                                : project.paymentStatus === 'awaiting_payment'
                                ? 'text-amber-400'
                                : darkMode ? 'text-primary-400' : 'text-primary-600'
                            }`}>
                              {project.paymentStatus === 'paid'
                                ? '✓ Betaling ontvangen'
                                : project.paymentStatus === 'awaiting_payment'
                                ? 'Wacht op betaling'
                                : project.paymentStatus === 'not_required'
                                ? 'Wij leveren eerst!'
                                : 'Betaalstatus onbekend'}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {project.paymentStatus === 'paid' && project.paymentCompletedAt
                                ? `Betaald op ${new Date(project.paymentCompletedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                : project.paymentStatus === 'awaiting_payment'
                                ? 'Rond de betaling af om door te gaan met je project'
                                : 'Je krijgt eerst je design te zien. Pas als je tevreden bent, sturen we de betaallink. Geen risico!'}
                            </p>
                            {project.paymentStatus === 'not_required' && (
                              <div className={`mt-3 flex items-center gap-2 text-xs font-medium ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                                <Shield className="w-3.5 h-3.5" />
                                <span>100% tevreden garantie</span>
                              </div>
                            )}
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
                    <div className={`rounded-2xl shadow-sm border overflow-hidden ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className={`flex items-center gap-3 px-4 sm:px-5 py-4 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <div className={`w-10 h-10 rounded-xl ${currentPackage.iconBg} flex items-center justify-center`}>
                          <Package className={`w-5 h-5 ${currentPackage.iconColor}`} />
                        </div>
                        <h3 className={`text-base sm:text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Huidige abonnement
                        </h3>
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className={`flex items-center justify-between p-4 rounded-xl ${
                          darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                        }`}>
                          <div>
                            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {currentPackage.name}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Maandelijks abonnement
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              €{currentPackage.price}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              per maand
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Invoices */}
                    <div className={`rounded-2xl shadow-sm border overflow-hidden ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className={`flex items-center gap-3 px-4 sm:px-5 py-4 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <Receipt className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <h3 className={`text-base sm:text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Factuurgeschiedenis
                        </h3>
                      </div>
                      <div className="p-4 sm:p-5">
                        {project.invoices && project.invoices.length > 0 ? (
                          <div className="space-y-3">
                            {project.invoices.map((invoice) => (
                              <div
                                key={invoice.id}
                                className={`flex items-center justify-between p-4 rounded-xl ${
                                  darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    invoice.status === 'paid'
                                      ? 'bg-green-500/20'
                                      : invoice.status === 'overdue'
                                      ? 'bg-red-500/20'
                                      : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                  }`}>
                                    <Receipt className={`w-5 h-5 ${
                                      invoice.status === 'paid'
                                        ? 'text-green-500'
                                        : invoice.status === 'overdue'
                                        ? 'text-red-500'
                                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                  </div>
                                  <div>
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {invoice.description}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {new Date(invoice.date).toLocaleDateString('nl-NL')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    €{invoice.amount.toFixed(2)}
                                  </p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    invoice.status === 'paid'
                                      ? 'bg-green-500/20 text-green-500'
                                      : invoice.status === 'overdue'
                                      ? 'bg-red-500/20 text-red-500'
                                      : darkMode
                                      ? 'bg-gray-700 text-gray-400'
                                      : 'bg-gray-200 text-gray-600'
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
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <span className="text-3xl">📄</span>
                            </div>
                            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Nog geen facturen
                            </p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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
                          {currentPackage.features.map((feature: string, index: number) => (
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
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className={`rounded-2xl p-4 border ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            darkMode ? 'bg-primary-500/10' : 'bg-primary-50'
                          }`}>
                            <Globe className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type</p>
                            <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {serviceTypeLabels[project.serviceType || 'website'] || 'Website'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-2xl p-4 border ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            darkMode ? 'bg-green-500/10' : 'bg-green-50'
                          }`}>
                            <Shield className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Support</p>
                            <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {project.package === 'business' ? '4 uur' : project.package === 'professional' ? '24 uur' : '48 uur'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-2xl p-4 border ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            darkMode ? 'bg-purple-500/10' : 'bg-purple-50'
                          }`}>
                            <Edit3 className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wijzigingen</p>
                            <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {currentPackage.changesPerMonth >= 999 ? 'Onbeperkt' : `${currentPackage.changesPerMonth}/maand`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-2xl p-4 border ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            darkMode ? 'bg-amber-500/10' : 'bg-amber-50'
                          }`}>
                            <Sparkles className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                          </div>
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revisies</p>
                            <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {currentPackage.revisions}x inbegrepen
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Revisions Progress */}
                    {project.revisionsTotal !== undefined && (
                      <div className={`rounded-2xl p-5 border ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              darkMode ? 'bg-purple-500/10' : 'bg-purple-50'
                            }`}>
                              <Edit3 className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            </div>
                            <div>
                              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Revisies deze maand
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {project.revisionsUsed || 0} van {project.revisionsTotal} gebruikt
                              </p>
                            </div>
                          </div>
                          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {project.revisionsTotal - (project.revisionsUsed || 0)}
                          </span>
                        </div>
                        <div className={`h-3 rounded-full overflow-hidden ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
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
                    <div className={`rounded-2xl shadow-sm border overflow-hidden ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className={`flex items-center gap-3 px-4 sm:px-5 py-4 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          darkMode ? 'bg-primary-500/10' : 'bg-primary-50'
                        }`}>
                          <MessageSquare className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                        </div>
                        <div>
                          <h3 className={`text-base sm:text-lg font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            Berichtengeschiedenis
                          </h3>
                          {project.messages && project.messages.length > 0 && (
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                                        : darkMode
                                        ? 'bg-gray-700 text-white rounded-bl-sm'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-xs font-medium ${
                                        message.from === 'client'
                                          ? 'text-white/80'
                                          : darkMode ? 'text-gray-400' : 'text-gray-500'
                                      }`}>
                                        {message.from === 'client' ? 'Jij' : message.senderName || 'Webstability'}
                                      </span>
                                      <span className={`text-xs ${
                                        message.from === 'client'
                                          ? 'text-white/60'
                                          : darkMode ? 'text-gray-500' : 'text-gray-400'
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
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <span className="text-3xl">💬</span>
                            </div>
                            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Nog geen berichten
                            </p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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
            </div>

            {/* Footer */}
            <footer className={`flex-shrink-0 border-t py-4 ${
              darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  © {new Date().getFullYear()} Webstability
                </p>
                <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  Beveiligd
                </div>
              </div>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
