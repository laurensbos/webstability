import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  PenTool,
  Check,
  CheckCircle2,
  Download,
  MessageSquare,
  Loader2,
  Star,
  Sparkles,
  FileImage,
  FileText,
  Palette,
  ThumbsUp,
  ArrowRight,
  X,
  ZoomIn,
  Package,
  Clock,
  AlertCircle
} from 'lucide-react'
import type { LogoPhase, LogoConcept, LogoRevision, LogoDeliverable, LogoProject } from '../types/project'

// ===========================================
// TYPES
// ===========================================

interface LogoProjectSectionProps {
  logoData: LogoProject
  packageType: string
  onSelectConcept: (conceptId: string) => Promise<void>
  onSubmitFeedback: (revision: { conceptId: string; feedback: string; round: number }) => Promise<void>
  onApproveFinal: () => Promise<void>
  onDownloadFile: (deliverable: LogoDeliverable) => Promise<void>
  onDownloadAll: () => Promise<void>
}

// ===========================================
// HELPERS
// ===========================================

const getMaxRevisions = (packageType: string): number => {
  switch (packageType) {
    case 'logoBasic':
    case 'basic':
      return 2
    case 'logoPro':
    case 'professional':
      return 3
    case 'logoPremium':
    case 'business':
    case 'premium':
      return 5
    default:
      return 3
  }
}

const getPackageLabel = (packageType: string): string => {
  switch (packageType) {
    case 'logoBasic':
    case 'basic':
      return 'Basic'
    case 'logoPro':
    case 'professional':
      return 'Professional'
    case 'logoPremium':
    case 'business':
    case 'premium':
      return 'Premium'
    default:
      return 'Standard'
  }
}

const triggerConfetti = () => {
  // Burst from left
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { x: 0.2, y: 0.6 },
    colors: ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F0ABFC']
  })
  
  // Burst from right
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.8, y: 0.6 },
      colors: ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F0ABFC']
    })
  }, 150)
  
  // Stars from center
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 360,
      startVelocity: 20,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['star'],
      colors: ['#FFD700', '#FFA500', '#FF6B6B']
    })
  }, 300)
}

// ===========================================
// PHASE INDICATOR
// ===========================================

function PhaseIndicator({ currentPhase }: { currentPhase: LogoPhase }) {
  const phases: { id: LogoPhase; label: string; icon: React.ElementType }[] = [
    { id: 'onboarding', label: 'Info', icon: FileText },
    { id: 'concepts', label: 'Concepten', icon: Palette },
    { id: 'revision', label: 'Revisies', icon: MessageSquare },
    { id: 'final', label: 'Finale', icon: ThumbsUp },
    { id: 'delivered', label: 'Geleverd', icon: Download },
  ]
  
  const currentIndex = phases.findIndex(p => p.id === currentPhase)
  
  return (
    <div className="flex items-center justify-between mb-8">
      {phases.map((phase, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const Icon = phase.icon
        
        return (
          <div key={phase.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${isCompleted 
                  ? 'bg-purple-500 text-white' 
                  : isCurrent 
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}
              `}>
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`
                mt-2 text-xs font-medium
                ${isCurrent ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}
              `}>
                {phase.label}
              </span>
            </div>
            
            {index < phases.length - 1 && (
              <div className={`
                w-12 sm:w-20 h-0.5 mx-2
                ${index < currentIndex ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'}
              `} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ===========================================
// CONCEPT CARD
// ===========================================

function ConceptCard({ 
  concept, 
  isSelected, 
  onSelect, 
  onPreview,
  disabled 
}: { 
  concept: LogoConcept
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
  disabled: boolean
}) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`
        relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer
        ${isSelected 
          ? 'border-purple-500 ring-4 ring-purple-500/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && onSelect()}
    >
      {/* Preview Image */}
      <div className="aspect-square bg-gray-50 dark:bg-gray-800 relative group">
        <img 
          src={concept.previewUrl} 
          alt={concept.name}
          className="w-full h-full object-contain p-4"
        />
        
        {/* Zoom overlay */}
        <div 
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation()
            onPreview()
          }}
        >
          <button className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        
        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-3 right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Check className="w-4 h-4" />
            Gekozen
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-4 bg-white dark:bg-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{concept.name}</h3>
        {concept.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{concept.description}</p>
        )}
      </div>
    </motion.div>
  )
}

// ===========================================
// CONCEPTS PHASE
// ===========================================

function ConceptsPhase({ 
  concepts, 
  selectedConceptId,
  onSelectConcept,
  loading
}: { 
  concepts: LogoConcept[]
  selectedConceptId?: string
  onSelectConcept: (id: string) => Promise<void>
  loading: boolean
}) {
  const [previewConcept, setPreviewConcept] = useState<LogoConcept | null>(null)
  const [selecting, setSelecting] = useState<string | null>(null)
  
  const handleSelect = async (conceptId: string) => {
    if (selecting) return
    setSelecting(conceptId)
    try {
      await onSelectConcept(conceptId)
    } finally {
      setSelecting(null)
    }
  }
  
  if (concepts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
          <Palette className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Concepten worden gemaakt
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Onze designer werkt aan je logo concepten. Je ontvangt een notificatie zodra ze klaar zijn om te bekijken.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <Clock className="w-4 h-4" />
          <span>Geschatte tijd: 3-5 werkdagen</span>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Kies je favoriete concept
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Klik op het concept dat je het beste bevalt. Daarna kun je feedback geven voor verdere aanpassingen.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((concept) => (
          <ConceptCard
            key={concept.id}
            concept={concept}
            isSelected={selectedConceptId === concept.id}
            onSelect={() => handleSelect(concept.id)}
            onPreview={() => setPreviewConcept(concept)}
            disabled={loading || !!selecting}
          />
        ))}
      </div>
      
      {/* Selected confirmation */}
      {selectedConceptId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium text-purple-900 dark:text-purple-100">
                {concepts.find(c => c.id === selectedConceptId)?.name} geselecteerd!
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Geef nu feedback voor de eerste revisie ronde.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Preview Modal */}
      <AnimatePresence>
        {previewConcept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewConcept(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewConcept(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <img 
                src={previewConcept.previewUrl} 
                alt={previewConcept.name}
                className="w-full"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {previewConcept.name}
                </h3>
                {previewConcept.description && (
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {previewConcept.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ===========================================
// REVISION PHASE
// ===========================================

function RevisionPhase({
  revisions,
  currentRound,
  maxRounds,
  onSubmitFeedback,
  loading
}: {
  revisions: LogoRevision[]
  currentRound: number
  maxRounds: number
  onSubmitFeedback: (feedback: string) => Promise<void>
  loading: boolean
}) {
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const inProgressRevision = revisions.find(r => r.round === currentRound && r.status === 'in_progress')
  const completedRevisions = revisions.filter(r => r.status === 'completed')
  
  const handleSubmit = async () => {
    if (!feedback.trim() || submitting) return
    setSubmitting(true)
    try {
      await onSubmitFeedback(feedback)
      setFeedback('')
    } finally {
      setSubmitting(false)
    }
  }
  
  const remainingRounds = maxRounds - currentRound + 1
  
  return (
    <div className="space-y-6">
      {/* Revision counter */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Revisie ronde {currentRound}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {remainingRounds} {remainingRounds === 1 ? 'ronde' : 'rondes'} over van {maxRounds}
            </p>
          </div>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: maxRounds }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i < currentRound - 1 
                  ? 'bg-purple-500' 
                  : i === currentRound - 1 
                    ? 'bg-purple-500 ring-2 ring-purple-300 dark:ring-purple-700' 
                    : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* In progress message */}
      {inProgressRevision && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">
                Designer werkt aan je aanpassingen
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Je ontvangt een notificatie zodra de nieuwe versie klaar is.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Previous revisions */}
      {completedRevisions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Eerdere feedback</h4>
          {completedRevisions.map((rev) => (
            <div key={rev.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ronde {rev.round}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(rev.feedbackAt).toLocaleDateString('nl-NL')}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{rev.feedback}</p>
              {rev.revisedPreviewUrl && (
                <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <img 
                    src={rev.revisedPreviewUrl} 
                    alt={`Revisie ${rev.round}`}
                    className="max-h-32 mx-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Feedback form */}
      {!inProgressRevision && currentRound <= maxRounds && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wat wil je aangepast hebben?
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Beschrijf hier je feedback voor de designer..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 Tip: Wees zo specifiek mogelijk over kleuren, vormen en stijl
            </p>
            <button
              onClick={handleSubmit}
              disabled={!feedback.trim() || submitting || loading}
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Versturen...
                </>
              ) : (
                <>
                  Feedback versturen
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Max revisions reached */}
      {currentRound > maxRounds && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            Je hebt alle {maxRounds} revisie rondes gebruikt.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Extra revisies kunnen apart worden aangevraagd.
          </p>
        </div>
      )}
    </div>
  )
}

// ===========================================
// FINAL APPROVAL PHASE
// ===========================================

function FinalApprovalPhase({
  finalPreviewUrl,
  onApprove,
  loading
}: {
  finalPreviewUrl?: string
  onApprove: () => Promise<void>
  loading: boolean
}) {
  const [approving, setApproving] = useState(false)
  
  const handleApprove = async () => {
    setApproving(true)
    try {
      await onApprove()
      triggerConfetti()
    } finally {
      setApproving(false)
    }
  }
  
  return (
    <div className="text-center">
      {finalPreviewUrl && (
        <div className="mb-6 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <img 
            src={finalPreviewUrl} 
            alt="Final logo"
            className="max-h-64 mx-auto"
          />
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Tevreden met je nieuwe logo?
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Na goedkeuring worden de finale bestanden klaargezet voor download.
        </p>
      </div>
      
      <button
        onClick={handleApprove}
        disabled={approving || loading}
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
      >
        {approving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Goedkeuren...
          </>
        ) : (
          <>
            <ThumbsUp className="w-5 h-5" />
            Logo goedkeuren
            <Sparkles className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  )
}

// ===========================================
// DELIVERABLES PHASE
// ===========================================

function DeliverablesPhase({
  deliverables,
  onDownloadFile,
  onDownloadAll,
  loading
}: {
  deliverables: LogoDeliverable[]
  onDownloadFile: (d: LogoDeliverable) => Promise<void>
  onDownloadAll: () => Promise<void>
  loading: boolean
}) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadingAll, setDownloadingAll] = useState(false)
  
  const handleDownload = async (deliverable: LogoDeliverable) => {
    setDownloading(deliverable.id)
    try {
      await onDownloadFile(deliverable)
    } finally {
      setDownloading(null)
    }
  }
  
  const handleDownloadAll = async () => {
    setDownloadingAll(true)
    try {
      await onDownloadAll()
    } finally {
      setDownloadingAll(false)
    }
  }
  
  const formatIcons: Record<string, React.ElementType> = {
    'PNG': FileImage,
    'SVG': FileText,
    'PDF': FileText,
    'AI': Palette,
    'EPS': Palette,
  }
  
  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="text-center p-6 bg-gradient-to-r from-purple-500/10 to-violet-500/10 dark:from-purple-900/30 dark:to-violet-900/30 rounded-2xl border border-purple-200 dark:border-purple-800">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <PenTool className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          🎉 Je logo is klaar!
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Download hieronder alle bestandsformaten voor je nieuwe logo.
        </p>
      </div>
      
      {/* Download all button */}
      <button
        onClick={handleDownloadAll}
        disabled={downloadingAll || loading}
        className="w-full p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {downloadingAll ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Downloaden...
          </>
        ) : (
          <>
            <Package className="w-5 h-5" />
            Download alle bestanden (.zip)
          </>
        )}
      </button>
      
      {/* Individual files */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Of download apart:</h4>
        
        {deliverables.map((deliverable) => {
          const FormatIcon = formatIcons[deliverable.format] || FileImage
          
          return (
            <motion.div
              key={deliverable.id}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <FormatIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{deliverable.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {deliverable.format} {deliverable.size && `• ${deliverable.size}`}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(deliverable)}
                disabled={downloading === deliverable.id || loading}
                className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                {downloading === deliverable.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            </motion.div>
          )
        })}
      </div>
      
      {/* Tip */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">Tip voor gebruik</p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Gebruik <strong>SVG</strong> voor web, <strong>PNG</strong> voor social media, en <strong>PDF/AI</strong> voor drukwerk.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function LogoProjectSection({
  logoData,
  packageType,
  onSelectConcept,
  onSubmitFeedback,
  onApproveFinal,
  onDownloadFile,
  onDownloadAll
}: LogoProjectSectionProps) {
  const [loading, setLoading] = useState(false)
  
  const {
    logoPhase,
    concepts = [],
    selectedConceptId,
    revisions = [],
    currentRevisionRound = 1,
    maxRevisionRounds,
    deliverables = [],
  } = logoData
  
  const maxRevisions = maxRevisionRounds || getMaxRevisions(packageType)
  
  // Get final preview URL (from latest revision or selected concept)
  const getFinalPreviewUrl = (): string | undefined => {
    const latestRevision = revisions
      .filter(r => r.status === 'completed')
      .sort((a, b) => b.round - a.round)[0]
    
    if (latestRevision?.revisedPreviewUrl) {
      return latestRevision.revisedPreviewUrl
    }
    
    const selectedConcept = concepts.find(c => c.id === selectedConceptId)
    return selectedConcept?.previewUrl
  }
  
  // Handle concept selection with loading state
  const handleSelectConcept = async (conceptId: string) => {
    setLoading(true)
    try {
      await onSelectConcept(conceptId)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle feedback submission
  const handleSubmitFeedback = async (feedback: string) => {
    setLoading(true)
    try {
      await onSubmitFeedback({
        conceptId: selectedConceptId || '',
        feedback,
        round: currentRevisionRound
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Handle final approval
  const handleApproveFinal = async () => {
    setLoading(true)
    try {
      await onApproveFinal()
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <PenTool className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Logo Design</h2>
            <p className="text-white/80">
              {getPackageLabel(packageType)} pakket • Max {maxRevisions} revisies
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Phase indicator */}
        <PhaseIndicator currentPhase={logoPhase} />
        
        {/* Phase content */}
        {logoPhase === 'onboarding' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Onboarding wordt verwerkt
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              We hebben je informatie ontvangen en gaan aan de slag met de eerste concepten.
            </p>
          </div>
        )}
        
        {logoPhase === 'concepts' && (
          <ConceptsPhase
            concepts={concepts}
            selectedConceptId={selectedConceptId}
            onSelectConcept={handleSelectConcept}
            loading={loading}
          />
        )}
        
        {logoPhase === 'revision' && selectedConceptId && (
          <RevisionPhase
            revisions={revisions}
            currentRound={currentRevisionRound}
            maxRounds={maxRevisions}
            onSubmitFeedback={handleSubmitFeedback}
            loading={loading}
          />
        )}
        
        {logoPhase === 'final' && (
          <FinalApprovalPhase
            finalPreviewUrl={getFinalPreviewUrl()}
            onApprove={handleApproveFinal}
            loading={loading}
          />
        )}
        
        {logoPhase === 'delivered' && (
          <DeliverablesPhase
            deliverables={deliverables}
            onDownloadFile={onDownloadFile}
            onDownloadAll={onDownloadAll}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
