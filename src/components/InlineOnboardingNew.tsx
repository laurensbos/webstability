import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Upload,
  ExternalLink,
  Loader2,
  Check,
  HelpCircle,
  Sparkles
} from 'lucide-react'
import { 
  getSectionsForPackage,
  getCompletionPercentage,
  type OnboardingQuestion,
  type OnboardingSection 
} from '../config/onboardingQuestions'
import type { PackageType } from '../config/packages'

// ===========================================
// QUESTION COMPONENTS
// ===========================================

interface QuestionProps {
  question: OnboardingQuestion
  value: any
  onChange: (value: any) => void
  disabled?: boolean
  darkMode?: boolean
  googleDriveUrl?: string
}

// Text Input
function TextQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  return (
    <div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={question.placeholder}
        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500'
        } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
      />
    </div>
  )
}

// Textarea
function TextareaQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  return (
    <div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={question.placeholder}
        rows={3}
        className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500'
        } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
      />
    </div>
  )
}

// Radio Group
function RadioQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  return (
    <div className="space-y-2">
      {question.options?.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
            value === option.value
              ? darkMode
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-primary-500 bg-primary-50'
              : darkMode
                ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            value === option.value
              ? 'border-primary-500 bg-primary-500'
              : darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            {value === option.value && <Check className="w-3 h-3 text-white" />}
          </div>
          <div className="flex-1">
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {option.label}
            </span>
            {option.description && (
              <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {option.description}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

// Checkbox Group
function CheckboxQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  const selectedValues = Array.isArray(value) ? value : []
  
  const toggleValue = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter(v => v !== optionValue))
    } else {
      onChange([...selectedValues, optionValue])
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {question.options?.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => toggleValue(option.value)}
          disabled={disabled}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
            selectedValues.includes(option.value)
              ? darkMode
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-primary-500 bg-primary-50'
              : darkMode
                ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
            selectedValues.includes(option.value)
              ? 'border-primary-500 bg-primary-500'
              : darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            {selectedValues.includes(option.value) && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  )
}

// Color Picker
function ColorQuestion({ value, onChange, darkMode }: Pick<QuestionProps, 'value' | 'onChange' | 'darkMode'>) {
  const presetColors = [
    { value: '#10B981', label: 'Groen' },
    { value: '#3B82F6', label: 'Blauw' },
    { value: '#8B5CF6', label: 'Paars' },
    { value: '#F59E0B', label: 'Oranje' },
    { value: '#EF4444', label: 'Rood' },
    { value: '#EC4899', label: 'Roze' },
    { value: '#14B8A6', label: 'Teal' },
    { value: '#1F2937', label: 'Donker' },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {presetColors.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={`w-12 h-12 rounded-xl border-2 transition-all ${
            value === color.value
              ? 'border-white ring-2 ring-primary-500 scale-110'
              : darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
          style={{ backgroundColor: color.value }}
          title={color.label}
        />
      ))}
      <label className={`w-12 h-12 rounded-xl border-2 cursor-pointer flex items-center justify-center ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'
      }`}>
        <input
          type="color"
          value={value || '#10B981'}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <span className="text-xs font-medium">+</span>
      </label>
    </div>
  )
}

// Tags Input
function TagsQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  const [input, setInput] = useState('')
  const tags = Array.isArray(value) ? value : []

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()])
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove))
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          disabled={disabled}
          placeholder={question.placeholder}
          className={`flex-1 px-4 py-2 rounded-xl border transition-colors ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={disabled || !input.trim()}
          className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          +
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Upload Button (links to Google Drive)
function UploadQuestion({ question, googleDriveUrl, darkMode }: QuestionProps) {
  if (!googleDriveUrl) return null
  
  return (
    <a
      href={googleDriveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition active:scale-[0.98] ${
        darkMode 
          ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30' 
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      <Upload className="w-4 h-4" />
      {question.uploadButtonText || 'Bestand uploaden'}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  )
}

// ===========================================
// QUESTION RENDERER
// ===========================================

function QuestionRenderer({ question, value, onChange, disabled, darkMode, googleDriveUrl }: QuestionProps) {
  const props = { question, value, onChange, disabled, darkMode, googleDriveUrl }
  
  switch (question.type) {
    case 'text':
      return <TextQuestion {...props} />
    case 'textarea':
      return <TextareaQuestion {...props} />
    case 'radio':
    case 'select':
      return <RadioQuestion {...props} />
    case 'checkbox':
      return <CheckboxQuestion {...props} />
    case 'color':
      return <ColorQuestion {...props} />
    case 'tags':
      return <TagsQuestion {...props} />
    case 'upload':
      return <UploadQuestion {...props} />
    default:
      return <TextQuestion {...props} />
  }
}

// ===========================================
// SECTION COMPONENT
// ===========================================

interface SectionComponentProps {
  section: OnboardingSection
  answers: Record<string, any>
  onChange: (questionId: string, value: any) => void
  isExpanded: boolean
  onToggle: () => void
  isComplete: boolean
  darkMode?: boolean
  googleDriveUrl?: string
  sectionNumber: number
  totalSections: number
}

function SectionComponent({
  section,
  answers,
  onChange,
  isExpanded,
  onToggle,
  isComplete,
  darkMode = true,
  googleDriveUrl,
  sectionNumber,
  totalSections
}: SectionComponentProps) {
  // Filter questions based on conditionalOn
  const visibleQuestions = section.questions.filter(q => {
    if (!q.conditionalOn) return true
    const dependentValue = answers[q.conditionalOn.questionId]
    return q.conditionalOn.values.includes(dependentValue)
  })

  const answeredCount = visibleQuestions.filter(q => {
    const answer = answers[q.id]
    if (Array.isArray(answer)) return answer.length > 0
    return answer !== undefined && answer !== '' && answer !== null
  }).length

  const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'text-amber-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-400' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: 'text-pink-400' },
  }

  const colors = colorClasses[section.color] || colorClasses.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border overflow-hidden transition-colors ${
        isExpanded
          ? `${colors.border} ${colors.bg}`
          : isComplete
            ? darkMode
              ? 'border-green-500/30 bg-green-500/5'
              : 'border-green-500/30 bg-green-50'
            : darkMode 
              ? 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50' 
              : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Completion indicator */}
        {isComplete ? (
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
        ) : (
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
            isExpanded 
              ? `${colors.border} ${colors.icon}` 
              : darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
          }`}>
            {sectionNumber}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{section.icon}</span>
            <span className={`font-semibold ${
              isComplete 
                ? 'text-green-500' 
                : darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {section.title}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {section.description}
            </p>
            {!isExpanded && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {answeredCount}/{visibleQuestions.length}
              </span>
            )}
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        )}
      </button>

      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`p-4 pt-0 space-y-6`}>
              {visibleQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  {/* Question Label */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <label className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {question.label}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {question.description && (
                        <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {question.description}
                        </p>
                      )}
                    </div>
                    {question.helpText && (
                      <div className="group relative">
                        <HelpCircle className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <div className="absolute right-0 top-6 w-48 p-2 rounded-lg bg-gray-900 text-white text-xs hidden group-hover:block z-10">
                          {question.helpText}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question Input */}
                  <QuestionRenderer
                    question={question}
                    value={answers[question.id]}
                    onChange={(value) => onChange(question.id, value)}
                    disabled={false}
                    darkMode={darkMode}
                    googleDriveUrl={googleDriveUrl}
                  />

                  {/* Inline Upload Button */}
                  {question.showUploadButton && googleDriveUrl && question.type !== 'upload' && (
                    <a
                      href={googleDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      {question.uploadButtonText || 'Upload'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}

              {/* Next Section Button */}
              {sectionNumber < totalSections && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={onToggle}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Volgende stap →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ===========================================
// MAIN COMPONENT
// ===========================================

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
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Get sections for this package
  const sections = getSectionsForPackage(packageType)
  const completionPercentage = getCompletionPercentage(packageType, answers)

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/api/client-onboarding?projectId=${projectId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.formData) {
            setAnswers(prev => ({ ...prev, ...data.formData }))
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error)
      }
    }
    loadData()
  }, [projectId])

  // Auto-save with debounce
  const saveData = useCallback(async () => {
    if (Object.keys(answers).length === 0) return
    
    setIsSaving(true)
    try {
      await fetch('/api/client-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          formData: answers,
          completionPercentage
        })
      })
      setLastSaved(new Date())
      onDataChange?.(answers)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }, [answers, projectId, completionPercentage, onDataChange])

  useEffect(() => {
    const timer = setTimeout(saveData, 1500)
    return () => clearTimeout(timer)
  }, [answers, saveData])

  const handleChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId)
  }

  const isSectionComplete = (section: OnboardingSection) => {
    const requiredQuestions = section.questions.filter(q => q.required)
    return requiredQuestions.every(q => {
      const answer = answers[q.id]
      if (Array.isArray(answer)) return answer.length > 0
      return answer !== undefined && answer !== '' && answer !== null
    })
  }

  // Auto-expand first incomplete section
  useEffect(() => {
    if (!expandedSection) {
      const firstIncomplete = sections.find(s => !isSectionComplete(s))
      if (firstIncomplete) {
        setExpandedSection(firstIncomplete.id)
      }
    }
  }, [sections])

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Voortgang
          </span>
          <div className="flex items-center gap-2">
            {isSaving ? (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Opslaan...
              </span>
            ) : lastSaved && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Check className="w-3 h-3" />
                Opgeslagen
              </span>
            )}
            <span className={`text-sm font-bold ${
              completionPercentage === 100 ? 'text-green-500' : darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {completionPercentage}%
            </span>
          </div>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            className={`h-full rounded-full ${
              completionPercentage === 100 
                ? 'bg-green-500' 
                : 'bg-gradient-to-r from-primary-500 to-primary-400'
            }`}
          />
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <SectionComponent
          key={section.id}
          section={section}
          answers={answers}
          onChange={handleChange}
          isExpanded={expandedSection === section.id}
          onToggle={() => toggleSection(section.id)}
          isComplete={isSectionComplete(section)}
          darkMode={darkMode}
          googleDriveUrl={googleDriveUrl}
          sectionNumber={index + 1}
          totalSections={sections.length}
        />
      ))}

      {/* Completion Message */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            darkMode 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-green-50 border-green-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Alles ingevuld! 🎉
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                We gaan aan de slag met je website. Je hoort snel van ons!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
