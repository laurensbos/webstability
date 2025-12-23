/**
 * DesignPreviewModal Component - Redesigned
 * 
 * Split-screen layout met:
 * - Links: Live website preview (desktop/mobiel)
 * - Rechts: Feedback panel
 * - Click-to-comment: Klik op de preview om feedback te plaatsen
 * - Interactieve markers op de preview
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Monitor,
  Smartphone,
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Loader2,
  Send,
  MousePointer2,
  Plus
} from 'lucide-react'

// Feedback marker interface
interface FeedbackMarker {
  id: string
  x: number // percentage position
  y: number // percentage position
  device: 'desktop' | 'mobile'
  comment: string
  type: 'positive' | 'suggestion'
  createdAt: string
}

interface DesignPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
  serviceType?: 'website' | 'webshop' | 'logo' | 'drone'
  designPreviewUrl: string
  onFeedbackSubmit?: (approved: boolean, markers: FeedbackMarker[]) => Promise<void>
}

// Quick feedback suggestions
const QUICK_SUGGESTIONS = [
  { emoji: '🎨', text: 'Kleur aanpassen' },
  { emoji: '📝', text: 'Tekst wijzigen' },
  { emoji: '📷', text: 'Andere afbeelding' },
  { emoji: '↔️', text: 'Formaat aanpassen' },
  { emoji: '🔄', text: 'Volgorde wijzigen' },
  { emoji: '✨', text: 'Ziet er goed uit!' },
]

export default function DesignPreviewModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  designPreviewUrl,
  onFeedbackSubmit
}: DesignPreviewModalProps) {
  // State
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [markers, setMarkers] = useState<FeedbackMarker[]>([])
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const [pendingMarker, setPendingMarker] = useState<{ x: number; y: number } | null>(null)
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [newCommentType, setNewCommentType] = useState<'positive' | 'suggestion'>('suggestion')
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [generalFeedback, setGeneralFeedback] = useState('')
  
  const previewRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Ensure URL is absolute
  const ensureAbsoluteUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `https://${url}`
  }

  const absoluteUrl = ensureAbsoluteUrl(designPreviewUrl)
  const isValidUrl = absoluteUrl && absoluteUrl.startsWith('http')

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setDevice('desktop')
      setMarkers([])
      setIsAddingMarker(false)
      setPendingMarker(null)
      setActiveMarkerId(null)
      setNewComment('')
      setIframeLoaded(false)
      setIframeError(false)
      setShowSuccess(false)
      setGeneralFeedback('')
    }
  }, [isOpen])

  // Handle click on preview to add marker
  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMarker || !previewRef.current) return

    const rect = previewRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPendingMarker({ x, y })
    setIsAddingMarker(false)
  }

  // Add new marker with comment
  const addMarker = () => {
    if (!pendingMarker || !newComment.trim()) return

    const newMarker: FeedbackMarker = {
      id: Date.now().toString(),
      x: pendingMarker.x,
      y: pendingMarker.y,
      device,
      comment: newComment.trim(),
      type: newCommentType,
      createdAt: new Date().toISOString()
    }

    setMarkers(prev => [...prev, newMarker])
    setPendingMarker(null)
    setNewComment('')
    setNewCommentType('suggestion')
  }

  // Delete marker
  const deleteMarker = (id: string) => {
    setMarkers(prev => prev.filter(m => m.id !== id))
    if (activeMarkerId === id) setActiveMarkerId(null)
  }

  // Cancel pending marker
  const cancelPendingMarker = () => {
    setPendingMarker(null)
    setNewComment('')
  }

  // Submit all feedback
  const handleSubmit = async (approved: boolean) => {
    setIsSubmitting(true)
    
    try {
      // Add general feedback as a marker if provided
      const allMarkers = [...markers]
      if (generalFeedback.trim()) {
        allMarkers.push({
          id: 'general-' + Date.now(),
          x: 50,
          y: 10,
          device: 'desktop',
          comment: `[Algemene feedback] ${generalFeedback.trim()}`,
          type: 'suggestion',
          createdAt: new Date().toISOString()
        })
      }

      // Call API
      const response = await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          approved,
          type: 'design',
          markers: allMarkers,
          feedbackItems: allMarkers.map(m => ({
            category: 'visual',
            type: m.type,
            text: m.comment,
            position: { x: m.x, y: m.y, device: m.device }
          }))
        })
      })

      if (!response.ok) throw new Error('Failed to submit')

      if (onFeedbackSubmit) {
        await onFeedbackSubmit(approved, allMarkers)
      }

      setShowSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Er ging iets mis bij het versturen. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get markers for current device
  const currentDeviceMarkers = markers.filter(m => m.device === device)
  const otherDeviceMarkers = markers.filter(m => m.device !== device)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-[95vw] h-[90vh] bg-gray-900 rounded-2xl overflow-hidden flex flex-col"
        >
          {/* Success overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-gray-900/95 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Feedback verzonden!</h3>
                  <p className="text-gray-400">Bedankt voor je feedback. We gaan ermee aan de slag.</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">{projectName}</h2>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                Design Review
              </span>
            </div>

            {/* Device toggle */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  device === 'desktop' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-medium">Desktop</span>
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  device === 'mobile' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">Mobiel</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {isValidUrl && (
                <a
                  href={absoluteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Nieuw tabblad</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main content - Split screen */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Preview */}
            <div className="flex-1 relative bg-gray-950 flex items-center justify-center p-6">
              {/* Add marker mode indicator */}
              <AnimatePresence>
                {isAddingMarker && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-purple-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                  >
                    <MousePointer2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Klik op de plek waar je feedback wilt geven</span>
                    <button 
                      onClick={() => setIsAddingMarker(false)}
                      className="ml-2 p-1 hover:bg-purple-600 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Device frame */}
              <div 
                className={`relative transition-all duration-500 ${
                  device === 'desktop' 
                    ? 'w-full h-full max-w-[1200px]' 
                    : 'w-[400px] h-[85%] max-h-[800px]'
                }`}
              >
                {/* Device mockup frame */}
                <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl ${
                  device === 'mobile' 
                    ? 'border-[8px] border-gray-700 bg-gray-700' 
                    : 'border-4 border-gray-700 bg-gray-700'
                }`}>
                  {/* Mobile notch */}
                  {device === 'mobile' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-700 rounded-b-2xl z-10" />
                  )}

                  {/* Preview container */}
                  <div 
                    ref={previewRef}
                    className={`relative w-full h-full bg-white overflow-hidden ${
                      isAddingMarker ? 'cursor-crosshair' : ''
                    }`}
                    onClick={handlePreviewClick}
                  >
                    {/* Loading state */}
                    {!iframeLoaded && !iframeError && isValidUrl && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Design laden...</p>
                      </div>
                    )}

                    {/* Error state */}
                    {(iframeError || !isValidUrl) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-8 text-center z-10">
                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                          <AlertCircle className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview niet beschikbaar</h3>
                        <p className="text-gray-600 mb-4 max-w-sm">
                          {!isValidUrl 
                            ? 'Er is nog geen preview URL ingesteld.'
                            : 'De website kan niet in dit venster worden geladen vanwege beveiligingsinstellingen.'}
                        </p>
                        {isValidUrl && (
                          <a
                            href={absoluteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-400 transition flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Bekijk in nieuw tabblad
                          </a>
                        )}
                      </div>
                    )}

                    {/* Iframe */}
                    {isValidUrl && (
                      <iframe
                        ref={iframeRef}
                        src={absoluteUrl}
                        className={`w-full h-full border-0 transition-opacity ${
                          iframeLoaded ? 'opacity-100' : 'opacity-0'
                        } ${isAddingMarker ? 'pointer-events-none' : ''}`}
                        onLoad={() => setIframeLoaded(true)}
                        onError={() => setIframeError(true)}
                        title="Design Preview"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                      />
                    )}

                    {/* Existing markers */}
                    {currentDeviceMarkers.map((marker, index) => (
                      <motion.div
                        key={marker.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute z-20"
                        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveMarkerId(activeMarkerId === marker.id ? null : marker.id)
                          }}
                          className={`w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform hover:scale-110 ${
                            marker.type === 'positive' 
                              ? 'bg-green-500' 
                              : 'bg-purple-500'
                          } ${activeMarkerId === marker.id ? 'ring-4 ring-white/50' : ''}`}
                        >
                          {index + 1}
                        </button>

                        {/* Marker tooltip */}
                        <AnimatePresence>
                          {activeMarkerId === marker.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute top-8 left-0 w-64 bg-gray-800 rounded-xl shadow-2xl p-3 z-30"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  marker.type === 'positive' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {marker.type === 'positive' ? '👍 Positief' : '💬 Suggestie'}
                                </span>
                                <button
                                  onClick={() => deleteMarker(marker.id)}
                                  className="p-1 text-gray-500 hover:text-red-400 transition"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-white text-sm">{marker.comment}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}

                    {/* Pending marker (while adding) */}
                    <AnimatePresence>
                      {pendingMarker && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute z-30"
                          style={{ left: `${pendingMarker.x}%`, top: `${pendingMarker.y}%` }}
                        >
                          <div className="w-8 h-8 -ml-4 -mt-4 rounded-full bg-purple-500 flex items-center justify-center animate-pulse shadow-lg ring-4 ring-purple-500/30">
                            <Plus className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Feedback panel */}
            <div className="w-[380px] bg-gray-900 border-l border-gray-800 flex flex-col">
              {/* Pending marker form */}
              <AnimatePresence>
                {pendingMarker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-gray-800"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <Plus className="w-4 h-4 text-purple-400" />
                          Nieuwe feedback
                        </h3>
                        <button
                          onClick={cancelPendingMarker}
                          className="text-gray-500 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Type selector */}
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setNewCommentType('suggestion')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                            newCommentType === 'suggestion'
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          💬 Suggestie
                        </button>
                        <button
                          onClick={() => setNewCommentType('positive')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                            newCommentType === 'positive'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          👍 Positief
                        </button>
                      </div>

                      {/* Quick suggestions */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {QUICK_SUGGESTIONS.map((suggestion) => (
                          <button
                            key={suggestion.text}
                            onClick={() => setNewComment(suggestion.text)}
                            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition"
                          >
                            {suggestion.emoji} {suggestion.text}
                          </button>
                        ))}
                      </div>

                      {/* Comment input */}
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Schrijf je feedback..."
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        autoFocus
                      />

                      {/* Add button */}
                      <button
                        onClick={addMarker}
                        disabled={!newComment.trim()}
                        className="w-full mt-3 py-2.5 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Feedback toevoegen
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add marker button */}
              {!pendingMarker && (
                <div className="p-4 border-b border-gray-800">
                  <button
                    onClick={() => setIsAddingMarker(true)}
                    className={`w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                      isAddingMarker
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <MousePointer2 className="w-4 h-4" />
                    Klik om feedback te plaatsen
                  </button>
                </div>
              )}

              {/* Feedback list */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    Jouw feedback ({markers.length})
                  </h3>
                  {otherDeviceMarkers.length > 0 && (
                    <span className="text-xs text-gray-500">
                      +{otherDeviceMarkers.length} op {device === 'desktop' ? 'mobiel' : 'desktop'}
                    </span>
                  )}
                </div>

                {markers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Nog geen feedback gegeven.
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      Klik op de preview om te beginnen.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {markers.map((marker, index) => (
                      <motion.div
                        key={marker.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-xl border transition cursor-pointer ${
                          activeMarkerId === marker.id
                            ? 'bg-gray-800 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        } ${marker.device !== device ? 'opacity-50' : ''}`}
                        onClick={() => {
                          if (marker.device !== device) {
                            setDevice(marker.device)
                          }
                          setActiveMarkerId(marker.id)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                            marker.type === 'positive' ? 'bg-green-500' : 'bg-purple-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${
                                marker.type === 'positive' ? 'text-green-400' : 'text-purple-400'
                              }`}>
                                {marker.type === 'positive' ? '👍 Positief' : '💬 Suggestie'}
                              </span>
                              {marker.device !== device && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  {marker.device === 'desktop' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                                </span>
                              )}
                            </div>
                            <p className="text-white text-sm">{marker.comment}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteMarker(marker.id)
                            }}
                            className="p-1 text-gray-500 hover:text-red-400 transition flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* General feedback */}
                <div className="mt-6">
                  <h4 className="text-gray-400 text-sm font-medium mb-2">Algemene opmerkingen</h4>
                  <textarea
                    value={generalFeedback}
                    onChange={(e) => setGeneralFeedback(e.target.value)}
                    placeholder="Nog iets anders? Schrijf het hier..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit buttons */}
              <div className="p-4 border-t border-gray-800 space-y-3">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-400 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ThumbsUp className="w-5 h-5" />
                      Design goedkeuren
                    </>
                  )}
                </button>

                {(markers.length > 0 || generalFeedback.trim()) && (
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Feedback versturen ({markers.length + (generalFeedback.trim() ? 1 : 0)})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
