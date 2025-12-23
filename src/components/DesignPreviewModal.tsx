/**
 * DesignPreviewModal Component
 * 
 * Een uitgebreide design preview modal met:
 * - Device mockup met live website/design preview
 * - Geïntegreerde feedback tool
 * - Per-service specifieke categorieën
 * - Goedkeuring workflow
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Send,
  Palette,
  Type,
  Layout,
  Image,
  ShoppingCart,
  Globe,
  Sparkles,
  PenTool,
  Video,
  Camera,
  Zap,
  ChevronRight,
  RefreshCw
} from 'lucide-react'

// Service-specific feedback categories
const FEEDBACK_CATEGORIES = {
  website: [
    { id: 'algemeen', label: 'Algemene indruk', icon: Sparkles, description: 'Eerste gevoel bij het design' },
    { id: 'kleuren', label: 'Kleuren & stijl', icon: Palette, description: 'Past het bij je merk?' },
    { id: 'teksten', label: 'Teksten', icon: Type, description: 'Koppen en beschrijvingen' },
    { id: 'layout', label: 'Indeling', icon: Layout, description: 'Structuur en navigatie' },
    { id: 'afbeeldingen', label: 'Afbeeldingen', icon: Image, description: "Foto's en graphics" },
  ],
  webshop: [
    { id: 'algemeen', label: 'Algemene indruk', icon: Sparkles, description: 'Eerste gevoel bij de webshop' },
    { id: 'producten', label: 'Product weergave', icon: ShoppingCart, description: 'Hoe producten eruit zien' },
    { id: 'kleuren', label: 'Kleuren & branding', icon: Palette, description: 'Past het bij je merk?' },
    { id: 'navigatie', label: 'Navigatie', icon: Layout, description: 'Menu en categorieën' },
    { id: 'checkout', label: 'Checkout flow', icon: Globe, description: 'Bestellen en betalen' },
  ],
  logo: [
    { id: 'concept', label: 'Concept', icon: Sparkles, description: 'Het idee achter het logo' },
    { id: 'vorm', label: 'Vorm & symbool', icon: PenTool, description: 'Het icoon/symbool' },
    { id: 'typografie', label: 'Lettertype', icon: Type, description: 'De letters en stijl' },
    { id: 'kleuren', label: 'Kleuren', icon: Palette, description: 'Kleurkeuze' },
  ],
  drone: [
    { id: 'kwaliteit', label: 'Beeldkwaliteit', icon: Video, description: 'Scherpte en kleuren' },
    { id: 'shots', label: 'Shots & hoeken', icon: Camera, description: 'Cameraposities' },
    { id: 'editing', label: 'Bewerking', icon: Zap, description: 'Effecten en overgangen' },
    { id: 'muziek', label: 'Muziek', icon: Sparkles, description: 'Audio en sfeer' },
  ],
}

// Pre-defined feedback options for quick selection
const QUICK_OPTIONS = {
  positive: [
    '👍 Ziet er goed uit!',
    '🎯 Precies wat ik zocht',
    '✨ Mooi en professioneel',
    '💪 Past perfect bij mijn merk',
  ],
  negative: [
    '🎨 Andere kleur graag',
    '📝 Tekst aanpassen',
    '📷 Andere foto',
    '↔️ Groter/kleiner maken',
    '🔄 Anders indelen',
    '💭 Iets anders in gedachten',
  ]
}

interface FeedbackItem {
  id: string
  category: string
  type: 'positive' | 'suggestion'
  text: string
  priority: 'normal' | 'important'
}

interface DesignPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
  serviceType: 'website' | 'webshop' | 'logo' | 'drone'
  designPreviewUrl: string
  onFeedbackSubmit?: (approved: boolean, feedback: FeedbackItem[]) => Promise<void>
}

export default function DesignPreviewModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  serviceType,
  designPreviewUrl,
  onFeedbackSubmit
}: DesignPreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState<'preview' | 'feedback'>('preview')
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackType, setFeedbackType] = useState<'positive' | 'suggestion'>('suggestion')
  const [isImportant, setIsImportant] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  const categories = FEEDBACK_CATEGORIES[serviceType] || FEEDBACK_CATEGORIES.website

  // Valideer of de URL geldig is (niet leeg en begint met http:// of https://)
  const isValidUrl = designPreviewUrl && 
    designPreviewUrl.trim() !== '' && 
    (designPreviewUrl.startsWith('http://') || designPreviewUrl.startsWith('https://'))

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDevice('desktop')
      setActiveTab('preview')
      setIframeLoaded(false)
      // Als URL ongeldig is, toon direct error
      setIframeError(!isValidUrl)
    }
  }, [isOpen, isValidUrl])

  // Device dimensions
  const deviceSizes = {
    desktop: { width: '100%', height: '100%', scale: 1 },
    tablet: { width: '768px', height: '1024px', scale: 0.6 },
    mobile: { width: '375px', height: '812px', scale: 0.5 },
  }

  // Add feedback item
  const addFeedback = (categoryId: string, text: string, type: 'positive' | 'suggestion', important: boolean = false) => {
    if (!text.trim()) return
    
    const newItem: FeedbackItem = {
      id: Date.now().toString(),
      category: categoryId,
      type,
      text: text.trim(),
      priority: important ? 'important' : 'normal'
    }
    
    setFeedbackItems(prev => [...prev, newItem])
    setFeedbackText('')
    setActiveCategory(null)
    setIsImportant(false)
  }

  // Remove feedback item
  const removeFeedback = (id: string) => {
    setFeedbackItems(prev => prev.filter(f => f.id !== id))
  }

  // Get category stats
  const getCategoryStats = (categoryId: string) => {
    const items = feedbackItems.filter(f => f.category === categoryId)
    return {
      total: items.length,
      positive: items.filter(f => f.type === 'positive').length,
      suggestions: items.filter(f => f.type === 'suggestion').length,
    }
  }

  // Submit feedback
  const handleSubmit = async (approved: boolean) => {
    setIsSubmitting(true)
    
    try {
      // Send to API
      const response = await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          approved,
          type: 'design',
          feedbackItems: feedbackItems.map(f => ({
            category: f.category,
            rating: f.type === 'positive' ? 'positive' : 'negative',
            feedback: f.text,
            priority: f.priority
          }))
        })
      })

      if (response.ok) {
        if (onFeedbackSubmit) {
          await onFeedbackSubmit(approved, feedbackItems)
        }
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          setFeedbackItems([])
          onClose()
        }, 2500)
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
    
    setIsSubmitting(false)
  }

  // Check if all feedback is positive (can approve)
  const canApprove = feedbackItems.length > 0 && feedbackItems.every(f => f.type === 'positive')
  const hasSuggestions = feedbackItems.some(f => f.type === 'suggestion')
  const importantCount = feedbackItems.filter(f => f.priority === 'important').length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-7xl h-[90vh] bg-gray-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {serviceType === 'logo' ? <PenTool className="w-5 h-5 text-white" /> :
                 serviceType === 'drone' ? <Video className="w-5 h-5 text-white" /> :
                 serviceType === 'webshop' ? <ShoppingCart className="w-5 h-5 text-white" /> :
                 <Globe className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{projectName}</h2>
                <p className="text-sm text-gray-400">
                  {serviceType === 'logo' ? 'Logo Design Review' :
                   serviceType === 'drone' ? 'Drone Beelden Review' :
                   serviceType === 'webshop' ? 'Webshop Design Review' :
                   'Website Design Review'}
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'preview' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4 inline mr-2" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'feedback' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Feedback
                {feedbackItems.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {feedbackItems.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {activeTab === 'preview' ? (
              /* Preview Tab */
              <div className="flex-1 flex flex-col">
                {/* Device Selector */}
                <div className="flex items-center justify-center gap-2 py-3 border-b border-gray-800 bg-gray-900/50">
                  {[
                    { id: 'desktop', icon: Monitor, label: 'Desktop' },
                    { id: 'tablet', icon: Tablet, label: 'Tablet' },
                    { id: 'mobile', icon: Smartphone, label: 'Mobiel' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setDevice(id as 'desktop' | 'tablet' | 'mobile')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        device === id
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                  
                  <div className="w-px h-6 bg-gray-700 mx-2" />
                  
                  {isValidUrl && (
                    <a
                      href={designPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in nieuw tabblad
                    </a>
                  )}
                  
                  <button
                    onClick={() => {
                      setIframeLoaded(false)
                      setIframeError(false)
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                    title="Vernieuwen"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview Frame */}
                <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-800 to-gray-900 overflow-auto">
                  <div 
                    className={`relative transition-all duration-500 ${
                      device === 'desktop' ? 'w-full h-full' : ''
                    }`}
                    style={device !== 'desktop' ? {
                      width: deviceSizes[device].width,
                      height: deviceSizes[device].height,
                      transform: `scale(${deviceSizes[device].scale})`,
                      transformOrigin: 'center center'
                    } : {}}
                  >
                    {/* Device Frame */}
                    <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl ${
                      device === 'mobile' 
                        ? 'border-8 border-gray-700 rounded-[3rem]' 
                        : device === 'tablet'
                        ? 'border-8 border-gray-700 rounded-3xl'
                        : 'border-4 border-gray-700'
                    }`}>
                      {/* Browser Chrome for Desktop */}
                      {device === 'desktop' && (
                        <div className="h-10 bg-gray-800 flex items-center gap-2 px-4 border-b border-gray-700">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                            <div className="w-3 h-3 rounded-full bg-green-500/70" />
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="bg-gray-700 rounded-lg px-4 py-1.5 text-xs text-gray-400 truncate max-w-md">
                              {isValidUrl ? designPreviewUrl : 'Geen geldige URL ingesteld'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Phone Notch for Mobile */}
                      {device === 'mobile' && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-700 rounded-b-2xl z-10" />
                      )}

                      {/* iframe */}
                      <div className={`relative bg-white ${device === 'desktop' ? 'h-[calc(100%-40px)]' : 'h-full'}`}>
                        {!iframeLoaded && !iframeError && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                            <p className="text-gray-600 font-medium">Design laden...</p>
                          </div>
                        )}
                        
                        {iframeError && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                              <AlertCircle className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview niet beschikbaar</h3>
                            <p className="text-gray-600 mb-4 max-w-sm">
                              {!isValidUrl 
                                ? 'Er is nog geen geldige preview URL ingesteld. Neem contact op met de developer.'
                                : 'De preview kan niet in dit venster worden geladen. Bekijk het design in een nieuw tabblad.'}
                            </p>
                            {isValidUrl && (
                              <a
                                href={designPreviewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-400 transition flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Open in nieuw tabblad
                              </a>
                            )}
                          </div>
                        )}

                        {isValidUrl && (
                          <iframe
                            src={designPreviewUrl}
                            className={`w-full h-full border-0 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setIframeLoaded(true)}
                            onError={() => setIframeError(true)}
                            title="Design Preview"
                            sandbox="allow-scripts allow-same-origin"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Footer */}
                <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/80 flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Bekijk je design en geef feedback via de <strong className="text-white">Feedback</strong> tab
                  </p>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-400 hover:to-pink-400 transition flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Geef feedback
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Feedback Tab */
              <div className="flex-1 flex overflow-hidden">
                {/* Categories Panel */}
                <div className="w-80 border-r border-gray-800 overflow-y-auto bg-gray-900/50">
                  <div className="p-4 border-b border-gray-800">
                    <h3 className="font-semibold text-white mb-1">Geef feedback per onderdeel</h3>
                    <p className="text-sm text-gray-500">Klik op een categorie om feedback toe te voegen</p>
                  </div>
                  
                  <div className="divide-y divide-gray-800">
                    {categories.map((category) => {
                      const stats = getCategoryStats(category.id)
                      const CategoryIcon = category.icon
                      const isActive = activeCategory === category.id
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(isActive ? null : category.id)}
                          className={`w-full p-4 text-left transition ${
                            isActive 
                              ? 'bg-purple-500/20 border-l-2 border-purple-500' 
                              : 'hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              stats.total > 0 
                                ? stats.suggestions > 0 
                                  ? 'bg-amber-500/20' 
                                  : 'bg-green-500/20'
                                : 'bg-gray-800'
                            }`}>
                              {stats.total > 0 ? (
                                stats.suggestions > 0 
                                  ? <AlertCircle className="w-5 h-5 text-amber-400" />
                                  : <CheckCircle2 className="w-5 h-5 text-green-400" />
                              ) : (
                                <CategoryIcon className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate">{category.label}</p>
                              <p className="text-sm text-gray-500 truncate">{category.description}</p>
                            </div>
                            {stats.total > 0 && (
                              <div className="flex items-center gap-1">
                                {stats.positive > 0 && (
                                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                                    {stats.positive}
                                  </span>
                                )}
                                {stats.suggestions > 0 && (
                                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                                    {stats.suggestions}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {activeCategory ? (
                    /* Active Category Feedback */
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="max-w-2xl mx-auto space-y-6">
                        {/* Category Header */}
                        <div className="flex items-center gap-3">
                          {(() => {
                            const cat = categories.find(c => c.id === activeCategory)
                            const Icon = cat?.icon || Sparkles
                            return (
                              <>
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                  <Icon className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-white">{cat?.label}</h3>
                                  <p className="text-gray-400">{cat?.description}</p>
                                </div>
                              </>
                            )
                          })()}
                        </div>

                        {/* Quick Options */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-400">Snelle feedback:</p>
                          <div className="flex flex-wrap gap-2">
                            {QUICK_OPTIONS.positive.slice(0, 2).map((option, i) => (
                              <button
                                key={i}
                                onClick={() => addFeedback(activeCategory, option, 'positive')}
                                className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm hover:bg-green-500/20 transition"
                              >
                                {option}
                              </button>
                            ))}
                            {QUICK_OPTIONS.negative.slice(0, 4).map((option, i) => (
                              <button
                                key={i}
                                onClick={() => addFeedback(activeCategory, option, 'suggestion')}
                                className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm hover:bg-amber-500/20 transition"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Feedback Input */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-400">Of schrijf je eigen feedback:</p>
                          
                          <div className="flex gap-2 mb-3">
                            <button
                              onClick={() => setFeedbackType('positive')}
                              className={`flex-1 p-3 rounded-xl border-2 transition flex items-center justify-center gap-2 ${
                                feedbackType === 'positive'
                                  ? 'bg-green-500/20 border-green-500 text-green-400'
                                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
                              }`}
                            >
                              <ThumbsUp className="w-5 h-5" />
                              <span className="font-medium">Positief</span>
                            </button>
                            <button
                              onClick={() => setFeedbackType('suggestion')}
                              className={`flex-1 p-3 rounded-xl border-2 transition flex items-center justify-center gap-2 ${
                                feedbackType === 'suggestion'
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
                              }`}
                            >
                              <AlertCircle className="w-5 h-5" />
                              <span className="font-medium">Suggestie</span>
                            </button>
                          </div>

                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={feedbackType === 'positive' 
                              ? 'Wat vind je goed aan dit onderdeel?' 
                              : 'Wat zou je graag anders zien?'
                            }
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 outline-none resize-none"
                            rows={3}
                          />

                          {feedbackType === 'suggestion' && (
                            <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isImportant}
                                onChange={(e) => setIsImportant(e.target.checked)}
                                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-300">
                                <strong className="text-red-400">Belangrijk!</strong> - Dit moet echt anders
                              </span>
                            </label>
                          )}

                          <button
                            onClick={() => addFeedback(activeCategory, feedbackText, feedbackType, isImportant)}
                            disabled={!feedbackText.trim()}
                            className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                            Feedback toevoegen
                          </button>
                        </div>

                        {/* Existing Feedback for Category */}
                        {getCategoryStats(activeCategory).total > 0 && (
                          <div className="space-y-3 pt-4 border-t border-gray-800">
                            <p className="text-sm font-medium text-gray-400">Jouw feedback:</p>
                            {feedbackItems
                              .filter(f => f.category === activeCategory)
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                                    item.type === 'positive'
                                      ? 'bg-green-500/10 border-green-500/30'
                                      : 'bg-amber-500/10 border-amber-500/30'
                                  }`}
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    item.type === 'positive' ? 'bg-green-500/20' : 'bg-amber-500/20'
                                  }`}>
                                    {item.type === 'positive' 
                                      ? <ThumbsUp className="w-4 h-4 text-green-400" />
                                      : <AlertCircle className="w-4 h-4 text-amber-400" />
                                    }
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white">{item.text}</p>
                                    {item.priority === 'important' && (
                                      <span className="inline-block mt-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                        Belangrijk
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeFeedback(item.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-400 transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* No Category Selected */
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="text-center max-w-md">
                        <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-6">
                          <MessageSquare className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Selecteer een categorie</h3>
                        <p className="text-gray-400">
                          Klik links op een onderdeel om feedback te geven over dat specifieke deel van je {serviceType === 'logo' ? 'logo' : serviceType === 'drone' ? 'beelden' : 'design'}.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Footer */}
                  {feedbackItems.length > 0 && (
                    <div className="p-6 border-t border-gray-800 bg-gray-900/80">
                      {showSuccess ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-2"
                        >
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                            <span className="text-lg font-medium text-white">Feedback verzonden!</span>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {/* Summary */}
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">
                              <strong className="text-white">{feedbackItems.length}</strong> feedback punt{feedbackItems.length !== 1 ? 'en' : ''}
                              {hasSuggestions && (
                                <span className="text-amber-400"> • {feedbackItems.filter(f => f.type === 'suggestion').length} suggestie{feedbackItems.filter(f => f.type === 'suggestion').length !== 1 ? 's' : ''}</span>
                              )}
                              {importantCount > 0 && (
                                <span className="text-red-400"> • {importantCount} belangrijk</span>
                              )}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            {canApprove && (
                              <button
                                onClick={() => handleSubmit(true)}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-400 hover:to-emerald-400 transition flex items-center gap-2 disabled:opacity-50"
                              >
                                {isSubmitting ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-5 h-5" />
                                )}
                                Design Goedkeuren ✨
                              </button>
                            )}
                            
                            {hasSuggestions && (
                              <button
                                onClick={() => handleSubmit(false)}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-indigo-400 transition flex items-center gap-2 disabled:opacity-50"
                              >
                                {isSubmitting ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Send className="w-5 h-5" />
                                )}
                                Feedback Versturen
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
