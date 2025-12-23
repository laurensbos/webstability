/**
 * DesignPreviewModal - Advanced Feedback System
 * Desktop: Split-screen met preview + annotatie tools
 * Mobiel: Full-screen preview met tap-to-mark
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  X, Monitor, Smartphone, ExternalLink, ThumbsUp, MessageSquare, CheckCircle2,
  Loader2, Send, Sparkles, Circle, Minus, ArrowUpRight, MousePointer2,
  Trash2, Undo2, ChevronUp, ChevronDown, PenTool, Move
} from 'lucide-react'

interface Annotation {
  id: string
  type: 'circle' | 'underline' | 'arrow' | 'marker'
  points: { x: number; y: number }[]
  color: string
  comment: string
  device: 'desktop' | 'mobile'
}

interface DesignPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  designPreviewUrl: string
  onFeedbackSubmit?: () => Promise<void>
  onApprove?: () => Promise<void>
}

const QUICK_TAGS = [
  { id: 'colors', label: 'Kleuren', emoji: '🎨' },
  { id: 'fonts', label: 'Lettertype', emoji: '✏️' },
  { id: 'images', label: "Foto's", emoji: '📷' },
  { id: 'layout', label: 'Indeling', emoji: '📐' },
  { id: 'text', label: 'Teksten', emoji: '💬' },
  { id: 'spacing', label: 'Ruimte', emoji: '↔️' },
  { id: 'less-busy', label: 'Rustiger', emoji: '✨' },
  { id: 'redesign', label: 'Anders', emoji: '🔄' },
]

const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

export default function DesignPreviewModal({
  isOpen, onClose, projectId, designPreviewUrl, onFeedbackSubmit, onApprove
}: DesignPreviewModalProps) {
  const [view, setView] = useState<'preview' | 'feedback' | 'success'>('preview')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successType, setSuccessType] = useState<'approved' | 'feedback' | null>(null)
  
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [activeTool, setActiveTool] = useState<'select' | 'circle' | 'underline' | 'arrow' | 'marker'>('select')
  const [activeColor, setActiveColor] = useState(COLORS[0])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentAnnotation, setCurrentAnnotation] = useState<Partial<Annotation> | null>(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [feedbackText, setFeedbackText] = useState('')
  const [showMobilePanel, setShowMobilePanel] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const absoluteUrl = (() => {
    if (!designPreviewUrl) return ''
    if (designPreviewUrl.startsWith('http://') || designPreviewUrl.startsWith('https://')) return designPreviewUrl
    return 'https://' + designPreviewUrl
  })()

  useEffect(() => {
    if (isOpen) {
      setView('preview')
      setDevice('desktop')
      setIframeLoaded(false)
      setAnnotations([])
      setActiveTool('select')
      setActiveColor(COLORS[0])
      setSelectedAnnotation(null)
      setSelectedTags([])
      setFeedbackText('')
      setSuccessType(null)
      setShowMobilePanel(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#a855f7', '#22c55e', '#3b82f6', '#f59e0b'] })
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#a855f7', '#22c55e', '#3b82f6', '#f59e0b'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }

  const getRelativePosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return { x: ((clientX - rect.left) / rect.width) * 100, y: ((clientY - rect.top) / rect.height) * 100 }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (activeTool === 'select') return
    e.preventDefault()
    const pos = getRelativePosition(e)
    setIsDrawing(true)
    
    if (activeTool === 'marker') {
      const newAnnotation: Annotation = { id: Date.now().toString(), type: 'marker', points: [pos], color: activeColor, comment: '', device }
      setAnnotations(prev => [...prev, newAnnotation])
      setEditingComment(newAnnotation.id)
      setIsDrawing(false)
    } else {
      setCurrentAnnotation({ id: Date.now().toString(), type: activeTool, points: [pos], color: activeColor, comment: '', device })
    }
  }, [activeTool, activeColor, device, getRelativePosition])

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentAnnotation || activeTool === 'marker') return
    e.preventDefault()
    const pos = getRelativePosition(e)
    setCurrentAnnotation(prev => {
      if (!prev) return prev
      const points = [...prev.points!]
      if (points.length === 1) points.push(pos)
      else points[1] = pos
      return { ...prev, points }
    })
  }, [isDrawing, currentAnnotation, activeTool, getRelativePosition])

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentAnnotation) return
    setIsDrawing(false)
    if (currentAnnotation.points && currentAnnotation.points.length >= 2) {
      const [p1, p2] = currentAnnotation.points
      const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
      if (distance > 2) {
        const newAnnotation = currentAnnotation as Annotation
        setAnnotations(prev => [...prev, newAnnotation])
        setEditingComment(newAnnotation.id)
      }
    }
    setCurrentAnnotation(null)
  }, [isDrawing, currentAnnotation])

  const deleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id))
    if (selectedAnnotation === id) setSelectedAnnotation(null)
    if (editingComment === id) setEditingComment(null)
  }

  const saveComment = (id: string, comment: string) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, comment } : a))
    setEditingComment(null)
    setCommentText('')
  }

  const undoLastAnnotation = () => setAnnotations(prev => prev.slice(0, -1))
  const toggleTag = (tagId: string) => setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      await fetch('/api/project-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId, approved: true, type: 'design' }) })
      triggerConfetti()
      setSuccessType('approved')
      setView('success')
      if (onApprove) await onApprove()
      setTimeout(() => onClose(), 3500)
    } catch (error) { console.error('Error approving:', error); alert('Er ging iets mis.') }
    finally { setIsSubmitting(false) }
  }

  const handleSubmitFeedback = async () => {
    if (annotations.length === 0 && selectedTags.length === 0 && !feedbackText.trim()) {
      alert('Markeer iets op het design of selecteer wat je wilt aanpassen.')
      return
    }
    setIsSubmitting(true)
    try {
      const annotationSummary = annotations.map((a, i) => `[${i + 1}] ${a.type}: ${a.comment || 'Geen beschrijving'}`).join('\n')
      await fetch('/api/project-feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId, approved: false, type: 'design',
          severity: annotations.length > 5 || selectedTags.includes('redesign') ? 'large' : annotations.length > 2 ? 'medium' : 'small',
          quickTags: selectedTags, details: feedbackText.trim(),
          annotations: annotations.map(a => ({ type: a.type, points: a.points, comment: a.comment, device: a.device })),
          feedbackItems: [{ category: 'design', type: 'suggestion', text: `${selectedTags.map(t => QUICK_TAGS.find(tag => tag.id === t)?.label).filter(Boolean).join(', ')}${feedbackText ? '\n' + feedbackText : ''}${annotationSummary ? '\n\nAnnotaties:\n' + annotationSummary : ''}` }]
        })
      })
      setSuccessType('feedback')
      setView('success')
      if (onFeedbackSubmit) await onFeedbackSubmit()
      setTimeout(() => onClose(), 3000)
    } catch (error) { console.error('Error:', error); alert('Er ging iets mis.') }
    finally { setIsSubmitting(false) }
  }

  const renderAnnotation = (annotation: Annotation | Partial<Annotation>, isTemp = false) => {
    if (!annotation.points || annotation.points.length === 0) return null
    const opacity = isTemp ? 0.6 : 1
    const strokeWidth = 3
    
    switch (annotation.type) {
      case 'circle': {
        if (annotation.points.length < 2) return null
        const [center, edge] = annotation.points
        const radius = Math.sqrt(Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2))
        return <ellipse key={annotation.id} cx={`${center.x}%`} cy={`${center.y}%`} rx={`${radius}%`} ry={`${radius}%`} fill="none" stroke={annotation.color} strokeWidth={strokeWidth} strokeDasharray={isTemp ? '5,5' : 'none'} opacity={opacity} className="pointer-events-none" />
      }
      case 'underline': {
        if (annotation.points.length < 2) return null
        const [start, end] = annotation.points
        return <line key={annotation.id} x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${start.y}%`} stroke={annotation.color} strokeWidth={strokeWidth * 1.5} strokeLinecap="round" opacity={opacity} className="pointer-events-none" />
      }
      case 'arrow': {
        if (annotation.points.length < 2) return null
        const [start, end] = annotation.points
        const angle = Math.atan2(end.y - start.y, end.x - start.x)
        const arrowSize = 2
        const arrowX1 = end.x - arrowSize * Math.cos(angle - Math.PI / 6)
        const arrowY1 = end.y - arrowSize * Math.sin(angle - Math.PI / 6)
        const arrowX2 = end.x - arrowSize * Math.cos(angle + Math.PI / 6)
        const arrowY2 = end.y - arrowSize * Math.sin(angle + Math.PI / 6)
        return <g key={annotation.id} opacity={opacity} className="pointer-events-none"><line x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`} stroke={annotation.color} strokeWidth={strokeWidth} strokeLinecap="round" /><polygon points={`${end.x}%,${end.y}% ${arrowX1}%,${arrowY1}% ${arrowX2}%,${arrowY2}%`} fill={annotation.color} /></g>
      }
      case 'marker': {
        const [pos] = annotation.points
        const index = annotations.findIndex(a => a.id === annotation.id) + 1
        return <g key={annotation.id} className="cursor-pointer" onClick={() => setSelectedAnnotation(annotation.id!)}><circle cx={`${pos.x}%`} cy={`${pos.y}%`} r="16" fill={annotation.color} stroke="white" strokeWidth="2" /><text x={`${pos.x}%`} y={`${pos.y}%`} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="12" fontWeight="bold">{index || '?'}</text></g>
      }
      default: return null
    }
  }

  if (!isOpen) return null

  // Success view
  if (view === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }} className="text-center max-w-md">
          {successType === 'approved' ? (
            <>
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10, delay: 0.2 }} className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-16 h-16 text-green-400" /></motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">Goedgekeurd! 🎉</h2>
              <p className="text-xl text-gray-300 mb-2">Super, je design is goedgekeurd!</p>
              <p className="text-lg text-purple-400 font-medium">Je gaat nu door naar de betaling...</p>
            </>
          ) : (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, delay: 0.2 }} className="w-28 h-28 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><Send className="w-16 h-16 text-purple-400" /></motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">Verstuurd! ✨</h2>
              <p className="text-xl text-gray-300 mb-2">Bedankt voor je feedback!</p>
              <p className="text-lg text-purple-400 font-medium">Onze designer gaat ermee aan de slag.</p>
            </>
          )}
        </motion.div>
      </motion.div>
    )
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
            <button onClick={() => setDevice('desktop')} className={`px-3 py-1.5 rounded text-sm font-medium transition ${device === 'desktop' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}><Monitor className="w-4 h-4" /></button>
            <button onClick={() => setDevice('mobile')} className={`px-3 py-1.5 rounded text-sm font-medium transition ${device === 'mobile' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}><Smartphone className="w-4 h-4" /></button>
          </div>
          <span className="text-sm text-gray-400 font-medium">Design Preview</span>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/95 border-b border-gray-800 overflow-x-auto">
          <button onClick={() => setActiveTool('marker')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition shrink-0 ${activeTool === 'marker' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`}><MousePointer2 className="w-4 h-4" />Markeer</button>
          {annotations.length > 0 && <button onClick={undoLastAnnotation} className="p-2 bg-gray-800 rounded-lg text-gray-400"><Undo2 className="w-4 h-4" /></button>}
          <div className="flex gap-1 ml-auto">{COLORS.map(color => <button key={color} onClick={() => setActiveColor(color)} className={`w-6 h-6 rounded-full transition ${activeColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`} style={{ backgroundColor: color }} />)}</div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-gray-950">
          <div ref={canvasRef} className={`absolute inset-4 bg-white rounded-xl overflow-hidden shadow-2xl ${device === 'mobile' ? 'max-w-[280px] mx-auto' : ''}`} style={{ border: device === 'mobile' ? '8px solid #374151' : '3px solid #374151', borderRadius: device === 'mobile' ? '2rem' : '0.75rem' }} onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp} onClick={(e) => { if (activeTool === 'marker') handleMouseDown(e as unknown as React.MouseEvent) }}>
            {!iframeLoaded && absoluteUrl && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10"><Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" /><p className="text-gray-600 font-medium">Laden...</p></div>}
            {absoluteUrl && <iframe src={absoluteUrl} className={`w-full h-full border-0 transition-opacity ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setIframeLoaded(true)} title="Preview" style={{ pointerEvents: activeTool !== 'select' ? 'none' : 'auto' }} />}
            {!absoluteUrl && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-6 text-center"><Sparkles className="w-12 h-12 text-purple-400 mb-4" /><h3 className="text-lg font-bold text-gray-800 mb-2">Preview komt eraan</h3></div>}
            <svg ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ pointerEvents: activeTool !== 'select' ? 'auto' : 'none' }}>{annotations.filter(a => a.device === device).map(a => renderAnnotation(a))}{currentAnnotation && renderAnnotation(currentAnnotation, true)}</svg>
          </div>
        </div>

        <AnimatePresence>
          {editingComment && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-32 left-4 right-4 bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Beschrijf wat je wilt aanpassen..." className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 text-sm" autoFocus />
              <div className="flex gap-2 mt-3">
                <button onClick={() => { saveComment(editingComment, commentText); setCommentText('') }} className="flex-1 py-2.5 bg-purple-500 text-white rounded-lg font-medium text-sm">Opslaan</button>
                <button onClick={() => { deleteAnnotation(editingComment); setCommentText('') }} className="p-2.5 bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => setShowMobilePanel(!showMobilePanel)} className="absolute bottom-28 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 rounded-full text-gray-300 text-sm font-medium flex items-center gap-2 shadow-lg border border-gray-700">
          {annotations.length > 0 && <span className="w-5 h-5 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center">{annotations.length}</span>}
          Feedback details
          {showMobilePanel ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showMobilePanel && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-gray-900 border-t border-gray-800 overflow-hidden">
              <div className="p-4 max-h-[40vh] overflow-y-auto">
                <p className="text-sm text-gray-400 mb-3">Wat wil je aanpassen?</p>
                <div className="flex flex-wrap gap-2 mb-4">{QUICK_TAGS.map(tag => <button key={tag.id} onClick={() => toggleTag(tag.id)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${selectedTags.includes(tag.id) ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`}>{tag.emoji} {tag.label}</button>)}</div>
                <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Extra opmerkingen..." className="w-full h-20 px-4 py-3 bg-gray-800 rounded-lg text-white text-sm placeholder-gray-500 resize-none" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <div className="flex gap-3">
            <button onClick={handleSubmitFeedback} disabled={isSubmitting} className="flex-1 py-4 bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 border-2 border-gray-700"><MessageSquare className="w-5 h-5" />Feedback ({annotations.length})</button>
            <button onClick={handleApprove} disabled={isSubmitting} className="flex-1 py-4 bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ThumbsUp className="w-5 h-5" />}Goedkeuren</button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Desktop Layout
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-gray-900 flex">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-800 rounded-xl p-1.5">
              <button onClick={() => setDevice('desktop')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${device === 'desktop' ? 'bg-purple-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}><Monitor className="w-4 h-4" /> Desktop</button>
              <button onClick={() => setDevice('mobile')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${device === 'mobile' ? 'bg-purple-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}><Smartphone className="w-4 h-4" /> Mobiel</button>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div className="flex items-center gap-1 bg-gray-800 rounded-xl p-1.5">
              <button onClick={() => setActiveTool('select')} title="Selecteren" className={`p-2 rounded-lg transition ${activeTool === 'select' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}><Move className="w-4 h-4" /></button>
              <button onClick={() => setActiveTool('marker')} title="Marker" className={`p-2 rounded-lg transition ${activeTool === 'marker' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}><MousePointer2 className="w-4 h-4" /></button>
              <button onClick={() => setActiveTool('circle')} title="Omcirkelen" className={`p-2 rounded-lg transition ${activeTool === 'circle' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}><Circle className="w-4 h-4" /></button>
              <button onClick={() => setActiveTool('underline')} title="Onderstrepen" className={`p-2 rounded-lg transition ${activeTool === 'underline' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}><Minus className="w-4 h-4" /></button>
              <button onClick={() => setActiveTool('arrow')} title="Pijl" className={`p-2 rounded-lg transition ${activeTool === 'arrow' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}><ArrowUpRight className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-1">{COLORS.map(color => <button key={color} onClick={() => setActiveColor(color)} className={`w-6 h-6 rounded-full transition ${activeColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: color }} />)}</div>
            {annotations.length > 0 && <button onClick={undoLastAnnotation} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition" title="Ongedaan maken"><Undo2 className="w-4 h-4" /></button>}
          </div>
          <div className="flex items-center gap-3">
            {absoluteUrl && <a href={absoluteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition text-sm"><ExternalLink className="w-4 h-4" /> Nieuw tabblad</a>}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 bg-gray-950 flex items-center justify-center p-8 overflow-hidden">
          <motion.div layout ref={canvasRef} className={`relative bg-white overflow-hidden shadow-2xl ${device === 'desktop' ? 'w-full h-full max-w-[1200px] rounded-xl' : 'w-[390px] h-[90%] max-h-[844px] rounded-[3rem]'}`} style={{ border: device === 'mobile' ? '12px solid #1f2937' : '4px solid #374151', cursor: activeTool !== 'select' ? 'crosshair' : 'default' }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {device === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-3xl z-20 flex items-center justify-center"><div className="w-16 h-4 bg-gray-900 rounded-full" /></div>}
            {!iframeLoaded && absoluteUrl && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10"><Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" /><p className="text-gray-600 font-medium text-lg">Design laden...</p></div>}
            {absoluteUrl && <iframe src={absoluteUrl} className={`w-full h-full border-0 transition-opacity ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setIframeLoaded(true)} title="Design Preview" style={{ pointerEvents: activeTool !== 'select' ? 'none' : 'auto' }} />}
            {!absoluteUrl && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-8 text-center"><Sparkles className="w-16 h-16 text-purple-400 mb-6" /><h3 className="text-2xl font-bold text-gray-800 mb-3">Design preview komt eraan</h3><p className="text-lg text-gray-600">Je ontvangt bericht zodra je design klaar is.</p></div>}
            <svg ref={overlayRef} className="absolute inset-0 w-full h-full z-10" style={{ pointerEvents: 'none' }}>{annotations.filter(a => a.device === device).map(a => renderAnnotation(a))}{currentAnnotation && renderAnnotation(currentAnnotation, true)}</svg>
          </motion.div>
        </div>
      </div>

      <div className="w-[400px] bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-1">Feedback geven</h2>
          <p className="text-sm text-gray-400">Markeer elementen en beschrijf wat je wilt aanpassen</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {annotations.filter(a => a.device === device).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><PenTool className="w-8 h-8 text-gray-600" /></div>
              <p className="text-gray-400 text-sm">Gebruik de tools hierboven om<br />elementen te markeren</p>
            </div>
          ) : (
            <div className="space-y-3">
              {annotations.filter(a => a.device === device).map((annotation, index) => (
                <motion.div key={annotation.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`bg-gray-800 rounded-xl p-4 border-2 transition ${selectedAnnotation === annotation.id ? 'border-purple-500' : 'border-transparent hover:border-gray-700'}`} onClick={() => setSelectedAnnotation(annotation.id)}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: annotation.color }}>{index + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-500 capitalize">{annotation.type === 'marker' ? 'Marker' : annotation.type === 'circle' ? 'Omcirkeld' : annotation.type === 'underline' ? 'Onderstreept' : 'Pijl'}</span></div>
                      {editingComment === annotation.id ? (
                        <div className="space-y-2">
                          <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Beschrijf wat je wilt aanpassen..." className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white text-sm placeholder-gray-400" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveComment(annotation.id, commentText) }} />
                          <div className="flex gap-2">
                            <button onClick={() => saveComment(annotation.id, commentText)} className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-medium">Opslaan</button>
                            <button onClick={() => setEditingComment(null)} className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-xs">Annuleren</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-300 cursor-pointer" onClick={() => { setEditingComment(annotation.id); setCommentText(annotation.comment) }}>{annotation.comment || <span className="text-gray-500 italic">Klik om beschrijving toe te voegen</span>}</p>
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteAnnotation(annotation.id) }} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400 mb-3">Algemene feedback:</p>
          <div className="flex flex-wrap gap-2 mb-4">{QUICK_TAGS.map(tag => <button key={tag.id} onClick={() => toggleTag(tag.id)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${selectedTags.includes(tag.id) ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{tag.emoji} {tag.label}</button>)}</div>
          <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Extra opmerkingen..." className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div className="p-4 border-t border-gray-800 space-y-3">
          <button onClick={handleSubmitFeedback} disabled={isSubmitting} className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 border-2 border-gray-700"><MessageSquare className="w-5 h-5" />Feedback versturen {annotations.length > 0 && `(${annotations.length})`}</button>
          <button onClick={handleApprove} disabled={isSubmitting} className="w-full py-4 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 shadow-lg shadow-green-500/25">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ThumbsUp className="w-5 h-5" />}Design goedkeuren</button>
        </div>
      </div>
    </motion.div>
  )
}
