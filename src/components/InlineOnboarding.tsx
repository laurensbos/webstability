import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Building2, 
  Palette, 
  Target, 
  FileText,
  Upload,
  ExternalLink,
  Lightbulb,
  Loader2,
  Save
} from 'lucide-react'
import {
  WebsiteBedrijfStep,
  WebsiteBrandingStep,
  WebsiteDoelenStep,
  WebsiteContentStep
} from './onboarding/WebsiteFormSteps'
import type { PackageType } from '../config/packages'

// Onboarding sections configuration - keys for i18n
const ONBOARDING_SECTION_KEYS = [
  { 
    id: 'bedrijf', 
    titleKey: 'inlineOnboarding.sections.bedrijf.title',
    icon: Building2,
    component: WebsiteBedrijfStep 
  },
  { 
    id: 'branding', 
    titleKey: 'inlineOnboarding.sections.branding.title',
    icon: Palette,
    component: WebsiteBrandingStep 
  },
  { 
    id: 'doelen', 
    titleKey: 'inlineOnboarding.sections.doelen.title',
    icon: Target,
    component: WebsiteDoelenStep 
  },
  { 
    id: 'content', 
    titleKey: 'inlineOnboarding.sections.content.title',
    icon: FileText,
    component: WebsiteContentStep 
  },
]

interface InlineOnboardingProps {
  projectId: string
  packageType: PackageType
  darkMode?: boolean
  googleDriveUrl?: string
  onDataChange?: (data: Record<string, any>) => void
  initialData?: Record<string, any>
}

export default function InlineOnboarding({
  projectId,
  packageType,
  darkMode = true,
  googleDriveUrl,
  onDataChange,
  initialData = {}
}: InlineOnboardingProps) {
  const { t } = useTranslation()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/api/client-onboarding?projectId=${projectId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.formData) {
            setFormData(prev => ({ ...prev, ...data.formData }))
            // Determine which sections are completed based on data
            const completed: string[] = []
            if (data.formData.companyName || data.formData.businessName) completed.push('bedrijf')
            if (data.formData.hasLogo || data.formData.primaryColor) completed.push('branding')
            if (data.formData.goal || data.formData.targetAudience) completed.push('doelen')
            if (data.formData.hasTexts || data.formData.hasPhotos) completed.push('content')
            setCompletedSections(completed)
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error)
      }
    }
    loadData()
  }, [projectId])

  // Auto-save on data change (debounced)
  useEffect(() => {
    const saveData = async () => {
      if (Object.keys(formData).length === 0) return
      
      setIsSaving(true)
      try {
        await fetch('/api/client-onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            formData,
            currentStep: expandedSection || 'bedrijf'
          })
        })
        setLastSaved(new Date())
        onDataChange?.(formData)
      } catch (error) {
        console.error('Error saving onboarding data:', error)
      } finally {
        setIsSaving(false)
      }
    }

    const timer = setTimeout(saveData, 1500)
    return () => clearTimeout(timer)
  }, [formData, projectId, expandedSection, onDataChange])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId)
  }

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId])
    }
    // Move to next section
    const currentIndex = ONBOARDING_SECTION_KEYS.findIndex(s => s.id === sectionId)
    if (currentIndex < ONBOARDING_SECTION_KEYS.length - 1) {
      setExpandedSection(ONBOARDING_SECTION_KEYS[currentIndex + 1].id)
    } else {
      setExpandedSection(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* Saving indicator */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-gray-500"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{t('inlineOnboarding.saving')}</span>
          </motion.div>
        )}
        {!isSaving && lastSaved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-green-500"
          >
            <Save className="w-3 h-3" />
            <span>{t('inlineOnboarding.autoSaved')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Sections */}
      {ONBOARDING_SECTION_KEYS.map((section) => {
        const isExpanded = expandedSection === section.id
        const isCompleted = completedSections.includes(section.id)
        const SectionIcon = section.icon
        const SectionComponent = section.component

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border overflow-hidden transition-colors ${
              isExpanded
                ? darkMode 
                  ? 'border-primary-500/50 bg-gray-800/50' 
                  : 'border-primary-500/50 bg-white'
                : isCompleted
                  ? darkMode
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-green-500/30 bg-green-50'
                  : darkMode 
                    ? 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            {/* Section Header - Always visible */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                  isExpanded 
                    ? 'border-primary-500' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`} />
              )}
              
              <div className="flex-1 flex items-center gap-2">
                <SectionIcon className={`w-4 h-4 ${
                  isCompleted 
                    ? 'text-green-500' 
                    : isExpanded 
                      ? 'text-primary-500' 
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={`text-sm font-medium ${
                  isCompleted 
                    ? 'text-green-500' 
                    : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {t(section.titleKey)}
                </span>
              </div>

              {isExpanded ? (
                <ChevronUp className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              )}
            </button>

            {/* Section Content - Expandable */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 pt-0 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="pt-4">
                      <SectionComponent
                        data={formData}
                        onChange={handleChange}
                        disabled={false}
                        packageId={packageType as any}
                      />
                      
                      {/* Mark complete button */}
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => markSectionComplete(section.id)}
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {t('inlineOnboarding.nextStep')}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Upload Button */}
      {googleDriveUrl && (
        <a
          href={googleDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm transition active:scale-[0.98] ${
            darkMode 
              ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          {t('inlineOnboarding.uploadFiles')}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}

      {/* Tips */}
      <div className={`p-3 rounded-xl ${
        darkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
      }`}>
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              {t('inlineOnboarding.tips.title')}
            </p>
            <ul className="space-y-1">
              <li className={`text-sm ${darkMode ? 'text-amber-200/70' : 'text-amber-600'}`}>
                • {t('inlineOnboarding.tips.noLogo')}
              </li>
              <li className={`text-sm ${darkMode ? 'text-amber-200/70' : 'text-amber-600'}`}>
                • {t('inlineOnboarding.tips.choosePhotos')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
