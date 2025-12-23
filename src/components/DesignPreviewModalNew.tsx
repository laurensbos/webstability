import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Monitor, Smartphone, ThumbsUp, MessageSquare, Loader2, ChevronLeft, Check, Trash2 } from 'lucide-react'
import confetti from 'canvas-confetti'

interface FeedbackMarker {
  id: string
  x: number
  y: number
  comment: string
  device: 'desktop' | 'mobile'
}

interface DesignPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  designPreviewUrl: string
  projectId: string
  onApprove?: () => void
  onFeedbackSubmit?: () => void
}

type ViewMode = 'desktop' | 'mobile'
type ModalMode = 'preview' | 'approve' | 'feedback'
type SeverityLevel = 'small' | 'medium' | 'large'

const quickTags = [
  { id: 'colors', label: 'Andere kleuren', icon: '🎨' },
  { id: 'fonts', label: 'Ander lettertype', icon: '🔤' },
  { id: 'images', label: 'Andere afbeeldingen', icon: '🖼️' },
  { id: 'layout', label: 'Andere layout', icon: '📐' },
  { id: 'text', label: 'Tekst aanpassen', icon: '✏️' },
  { id: 'logo', label: 'Logo aanpassen', icon: '⭐' },
  { id: 'complete-redesign', label: 'Compleet ander design', icon: '🔄' },
  { id: 'other', label: 'Anders', icon: '💬' },
]

const severityOptions: { value: SeverityLevel; label: string; description: string; color: string }[] = [
  { value: 'small', label: 'Klein', description: 'Kleine aanpassingen zoals kleuren of tekst', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', description: 'Grotere wijzigingen in layout of secties', color: 'bg-yellow-500' },
  { value: 'large', label: 'Groot', description: 'Compleet nieuw design gewenst', color: 'bg-red-500' },
]

export default function DesignPreviewModal({ 
  isOpen, 
  onClose, 
  designPreviewUrl, 
  projectId,
  onApprove,
  onFeedbackSubmit 
}: DesignPreviewModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [modalMode, setModalMode] = useState<ModalMode>('preview')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [severity, setSeverity] = useState<SeverityLevel>('small')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [markers, setMarkers] = useState<FeedbackMarker[]>([])
  const [activeMarker, setActiveMarker] = useState<string | null>(null)
  const [pendingMarker, setPendingMarker] = useState<{ x: number; y: number } | null>(null)
  const [markerComment, setMarkerComment] = useState('')
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setModalMode('preview')
      setFeedbackText('')
      setSeverity('small')
      setSelectedTags([])
      setMarkers([])
      setActiveMarker(null)
      setPendingMarker(null)
      setMarkerComment('')
      setShowApprovalConfirm(false)
    }
  }, [isOpen])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalMode !== 'feedback') return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setPendingMarker({ x, y })
    setMarkerComment('')
  }

  const addMarker = () => {
    if (!pendingMarker || !markerComment.trim()) return
    
    const newMarker: FeedbackMarker = {
      id: Date.now().toString(),
      x: pendingMarker.x,
      y: pendingMarker.y,
      comment: markerComment.trim(),
      device: viewMode
    }
    
    setMarkers([...markers, newMarker])
    setPendingMarker(null)
    setMarkerComment('')
  }

  const removeMarker = (id: string) => {
    setMarkers(markers.filter(m => m.id !== id))
    if (activeMarker === id) setActiveMarker(null)
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(t => t !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: 'approval',
          approved: true
        })
      })

      if (!response.ok) throw new Error('Failed to approve')
      
      triggerConfetti()
      
      setTimeout(() => {
        onApprove?.()
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Approval error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim() && markers.length === 0 && selectedTags.length === 0) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: 'feedback',
          approved: false,
          feedback: feedbackText.trim(),
          severity,
          quickTags: selectedTags,
          markers: markers.map(m => ({
            x: m.x,
            y: m.y,
            comment: m.comment,
            device: m.device
          }))
        })
      })

      if (!response.ok) throw new Error('Failed to submit feedback')
      
      onFeedbackSubmit?.()
      setModalMode('preview')
      setFeedbackText('')
      setSeverity('small')
      setSelectedTags([])
      setMarkers([])
    } catch (error) {
      console.error('Feedback error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-900 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-4">
              {modalMode !== 'preview' && (
                <button
                  onClick={() => setModalMode('preview')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-xl font-semibold">
                {modalMode === 'preview' && 'Design Preview'}
                {modalMode === 'approve' && 'Design Goedkeuren'}
                {modalMode === 'feedback' && 'Feedback Geven'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View mode toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    viewMode === 'desktop' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">Desktop</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    viewMode === 'mobile' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Mobile</span>
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Preview Panel */}
            <div className={`${modalMode === 'feedback' ? 'w-[65%]' : 'flex-1'} bg-gray-950 p-6 flex items-center justify-center overflow-hidden`}>
              <div
                className={`relative bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
                  viewMode === 'desktop' ? 'w-full h-full' : 'w-[400px] h-full'
                }`}
                onClick={handlePreviewClick}
                style={{ cursor: modalMode === 'feedback' ? 'crosshair' : 'default' }}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  </div>
                )}
                <iframe
                  src={designPreviewUrl}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  title="Design Preview"
                />
                
                {/* Feedback Markers */}
                {modalMode === 'feedback' && markers.filter(m => m.device === viewMode).map((marker, index) => (
                  <div
                    key={marker.id}
                    className="absolute w-6 h-6 -ml-3 -mt-3 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveMarker(activeMarker === marker.id ? null : marker.id)
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
                
                {/* Pending Marker */}
                {pendingMarker && (
                  <div
                    className="absolute w-6 h-6 -ml-3 -mt-3 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse"
                    style={{ left: `${pendingMarker.x}%`, top: `${pendingMarker.y}%` }}
                  >
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Panel */}
            {modalMode === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-[35%] border-l border-gray-800 p-6 overflow-y-auto"
              >
                <div className="space-y-6">
                  {/* Instructions */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                      💡 Klik op het design om specifieke punten aan te wijzen, of gebruik onderstaande opties.
                    </p>
                  </div>

                  {/* Pending Marker Input */}
                  {pendingMarker && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-yellow-400 font-medium">Voeg een opmerking toe:</p>
                      <textarea
                        value={markerComment}
                        onChange={e => setMarkerComment(e.target.value)}
                        placeholder="Wat wil je hier veranderd hebben?"
                        className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm resize-none h-20"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={addMarker}
                          disabled={!markerComment.trim()}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-medium py-2 rounded-lg text-sm transition-colors"
                        >
                          Toevoegen
                        </button>
                        <button
                          onClick={() => setPendingMarker(null)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                        >
                          Annuleren
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Markers List */}
                  {markers.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Markeringen ({markers.length})</h4>
                      <div className="space-y-2">
                        {markers.map((marker, index) => (
                          <div
                            key={marker.id}
                            className={`bg-gray-800 rounded-lg p-3 flex items-start gap-3 ${
                              activeMarker === marker.id ? 'ring-2 ring-red-500' : ''
                            }`}
                          >
                            <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-300">{marker.comment}</p>
                              <p className="text-xs text-gray-500 mt-1">{marker.device === 'desktop' ? '🖥️ Desktop' : '📱 Mobile'}</p>
                            </div>
                            <button
                              onClick={() => removeMarker(marker.id)}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Severity */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">Hoe groot is de wijziging?</h4>
                    <div className="space-y-2">
                      {severityOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => setSeverity(option.value)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            severity === option.value
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${option.color}`} />
                          <div className="text-left">
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className="text-xs text-gray-500">{option.description}</p>
                          </div>
                          {severity === option.value && (
                            <Check className="w-4 h-4 text-emerald-500 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Tags */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">Wat wil je aanpassen?</h4>
                    <div className="flex flex-wrap gap-2">
                      {quickTags.map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag.id)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {tag.icon} {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Extra toelichting</h4>
                    <textarea
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      placeholder="Beschrijf je gewenste aanpassingen..."
                      className="w-full bg-gray-800 rounded-lg px-4 py-3 text-sm resize-none h-32"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting || (!feedbackText.trim() && markers.length === 0 && selectedTags.length === 0)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Versturen...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        Feedback Versturen
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Action Buttons (Preview Mode) */}
            {modalMode === 'preview' && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                <button
                  onClick={() => setModalMode('feedback')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Feedback Geven
                </button>
                <button
                  onClick={() => setShowApprovalConfirm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-medium transition-colors"
                >
                  <ThumbsUp className="w-5 h-5" />
                  Design Goedkeuren
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Approval Confirmation Modal */}
        <AnimatePresence>
          {showApprovalConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowApprovalConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-900 rounded-2xl p-6 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                    <ThumbsUp className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Design Goedkeuren?</h3>
                  <p className="text-gray-400">
                    Door het design goed te keuren, ga je akkoord met het ontwerp en gaan we door naar de betalingsfase.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowApprovalConfirm(false)}
                      className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Bezig...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Ja, Goedkeuren
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
