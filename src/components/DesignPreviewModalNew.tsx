/**
 * DesignPreviewModal Component - Advanced Annotation Tools
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  X, Monitor, Smartphone, ExternalLink, ThumbsUp, Loader2, Send,
  Circle, Minus, ArrowUpRight, MapPin, Undo2, Trash2, HelpCircle,
  ChevronRight, ChevronLeft
} from 'lucide-react'

type AnnotationType = 'circle' | 'underline' | 'arrow' | 'marker'

interface Annotation {
  id: string
  type: AnnotationType
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

const COLORS = [
  { id: 'red', value: '#ef4444', label: 'Rood' },
  { id: 'orange', value: '#f97316', label: 'Oranje' },
  { id: 'green', value: '#22c55e', label: 'Groen' },
  { id: 'blue', value: '#3b82f6', label: 'Blauw' },
  { id: 'purple', value: '#a855f7', label: 'Paars' },
]

const QUICK_TAGS = [
  { id: 'colors', label: 'Kleuren', emoji: '🎨' },
  { id: 'fonts', label: 'Lettertype', emoji: '🔤' },
  { id: 'images', label: 'Afbeeldingen', emoji: '📷' },
  { id: 'layout', label: 'Indeling', emoji: '📐' },
  { id: 'text', label: 'Teksten', emoji: '✏️' },
  { id: 'spacing', label: 'Ruimte', emoji: '↔️' },
  { id: 'less-busy', label: 'Minder druk', emoji: '✨' },
  { id: 'redesign', label: 'Anders ontwerp', emoji: '🔄' },
]

const TUTORIAL_STEPS_DESKTOP = [
  { title: 'Welkom bij de feedback tool!', description: 'Met deze tool kun je eenvoudig aangeven wat je wel of niet mooi vindt aan het design.', icon: '👋' },
  { title: 'Annotatie tools', description: 'Gebruik de tools om te markeren: omcirkelen, onderstrepen, pijlen plaatsen of punten markeren.', icon: '🎨' },
  { title: 'Kleuren kiezen', description: 'Kies een kleur voor je annotatie. Rood voor problemen, groen voor wat je mooi vindt!', icon: '🌈' },
  { title: 'Feedback toevoegen', description: 'Na het tekenen kun je een opmerking toevoegen. Gebruik ook de snelle tags voor veelvoorkomende feedback.', icon: '💬' },
  { title: 'Goedkeuren of verzenden', description: 'Tevreden? Keur het design goed! Nog feedback? Verstuur je opmerkingen.', icon: '✅' }
]

const TUTORIAL_STEPS_MOBILE = [
  { title: 'Welkom!', description: 'Tik op het scherm om feedback te geven.', icon: '👋' },
  { title: 'Teken & markeer', description: 'Selecteer een tool en teken op het design.', icon: '✏️' },
  { title: 'Verstuur feedback', description: 'Voeg een opmerking toe en verstuur.', icon: '📤' }
]

function DesignPreviewModal({ isOpen, onClose, projectId, designPreviewUrl, onFeedbackSubmit, onApprove }: DesignPreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [isMobile, setIsMobile] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [currentTool, setCurrentTool] = useState<AnnotationType>('marker')
  const [currentColor, setCurrentColor] = useState(COLORS[0].value)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [feedbackText, setFeedbackText] = useState('')
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState<'approved' | 'feedback' | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const tutorialKey = 'design-preview-tutorial-' + projectId
      if (!localStorage.getItem(tutorialKey)) {
        setShowTutorial(true)
        setTutorialStep(0)
      }
    }
  }, [isOpen, projectId])

  const completeTutorial = () => {
    localStorage.setItem('design-preview-tutorial-' + projectId, 'true')
    setShowTutorial(false)
  }

  const ensureAbsoluteUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return 'https://' + url
  }

  const absoluteUrl = ensureAbsoluteUrl(designPreviewUrl)

  useEffect(() => {
    if (isOpen) {
      setDevice('desktop')
      setAnnotations([])
      setCurrentTool('marker')
      setCurrentColor(COLORS[0].value)
      setSelectedTags([])
      setFeedbackText('')
      setActiveAnnotation(null)
      setIframeLoaded(false)
      setShowSuccess(null)
    }
  }, [isOpen])

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: ['#a855f7', '#22c55e', '#3b82f6', '#eab308'] })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: ['#a855f7', '#22c55e', '#3b82f6', '#eab308'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }

  const getSvgCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const rect = svgRef.current.getBoundingClientRect()
    let clientX: number, clientY: number
    if ('touches' in e) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY }
    else { clientX = e.clientX; clientY = e.clientY }
    return { x: ((clientX - rect.left) / rect.width) * 100, y: ((clientY - rect.top) / rect.height) * 100 }
  }, [])

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    setCurrentPoints([getSvgCoords(e)])
  }, [getSvgCoords])

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    setCurrentPoints(prev => [...prev, getSvgCoords(e)])
  }, [isDrawing, getSvgCoords])

  const handleEnd = useCallback(() => {
    if (!isDrawing || currentPoints.length === 0) return
    setIsDrawing(false)
    const newAnnotation: Annotation = { id: Date.now().toString(), type: currentTool, points: currentPoints, color: currentColor, comment: '', device }
    setAnnotations(prev => [...prev, newAnnotation])
    setActiveAnnotation(newAnnotation.id)
    setCurrentPoints([])
  }, [isDrawing, currentPoints, currentTool, currentColor, device])

  const renderAnnotation = (annotation: Annotation) => {
    const { type, points, color, id } = annotation
    const isActive = activeAnnotation === id
    if (points.length === 0) return null
    
    switch (type) {
      case 'circle': {
        if (points.length < 2) return null
        const first = points[0], last = points[points.length - 1]
        const cx = (first.x + last.x) / 2, cy = (first.y + last.y) / 2
        const rx = Math.abs(last.x - first.x) / 2, ry = Math.abs(last.y - first.y) / 2
        return <ellipse key={id} cx={cx + '%'} cy={cy + '%'} rx={rx + '%'} ry={ry + '%'} fill="none" stroke={color} strokeWidth={isActive ? 4 : 3} strokeDasharray={isActive ? "5,5" : "none"} className="cursor-pointer" onClick={() => setActiveAnnotation(id)} />
      }
      case 'underline': {
        if (points.length < 2) return null
        const first = points[0], last = points[points.length - 1]
        return <line key={id} x1={first.x + '%'} y1={first.y + '%'} x2={last.x + '%'} y2={last.y + '%'} stroke={color} strokeWidth={isActive ? 4 : 3} strokeLinecap="round" className="cursor-pointer" onClick={() => setActiveAnnotation(id)} />
      }
      case 'arrow': {
        if (points.length < 2) return null
        const first = points[0], last = points[points.length - 1]
        return <g key={id} className="cursor-pointer" onClick={() => setActiveAnnotation(id)}><line x1={first.x + '%'} y1={first.y + '%'} x2={last.x + '%'} y2={last.y + '%'} stroke={color} strokeWidth={isActive ? 4 : 3} strokeLinecap="round" /></g>
      }
      case 'marker': {
        const point = points[0]
        const idx = annotations.filter(a => a.device === device).indexOf(annotation) + 1
        return <g key={id} className="cursor-pointer" onClick={() => setActiveAnnotation(id)}><circle cx={point.x + '%'} cy={point.y + '%'} r={isActive ? 12 : 10} fill={color} stroke="white" strokeWidth={2} /><text x={point.x + '%'} y={point.y + '%'} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="12" fontWeight="bold">{idx}</text></g>
      }
      default: return null
    }
  }

  const undoLast = () => { setAnnotations(prev => prev.slice(0, -1)); setActiveAnnotation(null) }
  const clearAll = () => { setAnnotations([]); setActiveAnnotation(null) }
  const toggleTag = (tagId: string) => setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      if (onApprove) await onApprove()
      triggerConfetti()
      setShowSuccess('approved')
      setTimeout(() => onClose(), 3000)
    } catch (error) { console.error('Error approving:', error) }
    finally { setIsSubmitting(false) }
  }

  const handleSubmitFeedback = async () => {
    if (annotations.length === 0 && !feedbackText.trim() && selectedTags.length === 0) return
    setIsSubmitting(true)
    try {
      await fetch('/api/project/' + projectId + '/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ annotations, tags: selectedTags, text: feedbackText, device }) })
      if (onFeedbackSubmit) await onFeedbackSubmit()
      setShowSuccess('feedback')
      setTimeout(() => onClose(), 2500)
    } catch (error) { console.error('Error submitting feedback:', error) }
    finally { setIsSubmitting(false) }
  }

  if (!isOpen) return null

  const TutorialOverlay = () => {
    const steps = isMobile ? TUTORIAL_STEPS_MOBILE : TUTORIAL_STEPS_DESKTOP
    const currentStep = steps[tutorialStep]
    const isLastStep = tutorialStep === steps.length - 1
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full text-center border border-zinc-700">
          <div className="text-5xl mb-4">{currentStep.icon}</div>
          <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
          <p className="text-zinc-400 mb-6">{currentStep.description}</p>
          <div className="flex justify-center gap-2 mb-6">{steps.map((_, i) => <div key={i} className={'w-2 h-2 rounded-full transition-colors ' + (i === tutorialStep ? 'bg-purple-500' : 'bg-zinc-600')} />)}</div>
          <div className="flex gap-3">
            {tutorialStep > 0 && <button onClick={() => setTutorialStep(prev => prev - 1)} className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"><ChevronLeft className="w-4 h-4" />Vorige</button>}
            <button onClick={() => { if (isLastStep) completeTutorial(); else setTutorialStep(prev => prev + 1) }} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">{isLastStep ? 'Start!' : 'Volgende'}{!isLastStep && <ChevronRight className="w-4 h-4" />}</button>
          </div>
          <button onClick={completeTutorial} className="mt-4 text-sm text-zinc-500 hover:text-zinc-400">Overslaan</button>
        </motion.div>
      </motion.div>
    )
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-7xl mb-4">{showSuccess === 'approved' ? '🎉' : '📨'}</div>
          <h2 className="text-2xl font-bold text-white mb-2">{showSuccess === 'approved' ? 'Design goedgekeurd!' : 'Feedback verzonden!'}</h2>
          <p className="text-zinc-400">{showSuccess === 'approved' ? 'Geweldig! We gaan verder met de volgende stap.' : 'Bedankt! We gaan aan de slag met je feedback.'}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95">
        <AnimatePresence>{showTutorial && <TutorialOverlay />}</AnimatePresence>
        <div className="absolute top-0 left-0 right-0 h-14 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            <div className="flex bg-zinc-800 rounded-lg p-1">
              <button onClick={() => setDevice('desktop')} className={'px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ' + (device === 'desktop' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white')}><Monitor className="w-4 h-4" />{!isMobile && 'Desktop'}</button>
              <button onClick={() => setDevice('mobile')} className={'px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ' + (device === 'mobile' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white')}><Smartphone className="w-4 h-4" />{!isMobile && 'Mobiel'}</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowTutorial(true); setTutorialStep(0) }} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Hoe werkt het?"><HelpCircle className="w-5 h-5" /></button>
            <a href={absoluteUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"><ExternalLink className="w-5 h-5" /></a>
          </div>
        </div>

        <div className={'pt-14 h-full ' + (isMobile ? '' : 'flex')}>
          <div ref={containerRef} className={'relative ' + (isMobile ? 'h-[60vh]' : 'flex-1 h-full') + ' bg-zinc-950 overflow-hidden'}>
            <div className={'absolute inset-4 flex items-center justify-center ' + (device === 'mobile' ? 'max-w-[375px] mx-auto' : '')}>
              <div className="relative w-full h-full bg-white rounded-lg overflow-hidden shadow-2xl">
                {!iframeLoaded && <div className="absolute inset-0 flex items-center justify-center bg-zinc-900"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>}
                <iframe src={absoluteUrl} className="w-full h-full border-0" onLoad={() => setIframeLoaded(true)} title="Design Preview" />
                <svg ref={svgRef} className="absolute inset-0 w-full h-full cursor-crosshair" style={{ touchAction: 'none' }} onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}>
                  {annotations.filter(a => a.device === device).map(renderAnnotation)}
                  {isDrawing && currentPoints.length > 0 && <path d={'M ' + currentPoints.map(p => p.x + '% ' + p.y + '%').join(' L ')} fill="none" stroke={currentColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5" />}
                </svg>
              </div>
            </div>
            {isMobile && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-zinc-700">
                {[{ type: 'marker' as AnnotationType, icon: MapPin }, { type: 'circle' as AnnotationType, icon: Circle }, { type: 'underline' as AnnotationType, icon: Minus }, { type: 'arrow' as AnnotationType, icon: ArrowUpRight }].map(({ type, icon: Icon }) => (
                  <button key={type} onClick={() => setCurrentTool(type)} className={'p-2 rounded-full transition-colors ' + (currentTool === type ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white')}><Icon className="w-5 h-5" /></button>
                ))}
                <div className="w-px h-6 bg-zinc-700" />
                {COLORS.slice(0, 3).map(color => <button key={color.id} onClick={() => setCurrentColor(color.value)} className={'w-6 h-6 rounded-full border-2 transition-transform ' + (currentColor === color.value ? 'border-white scale-110' : 'border-transparent')} style={{ backgroundColor: color.value }} />)}
              </div>
            )}
          </div>

          <div className={(isMobile ? 'h-[40vh] border-t border-zinc-800' : 'w-96 h-full border-l border-zinc-800') + ' bg-zinc-900 flex flex-col'}>
            {!isMobile && (
              <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-zinc-300">Annotatie tools</span>
                  <div className="flex gap-1">
                    <button onClick={undoLast} disabled={annotations.length === 0} className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" title="Ongedaan maken"><Undo2 className="w-4 h-4" /></button>
                    <button onClick={clearAll} disabled={annotations.length === 0} className="p-1.5 text-zinc-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed" title="Alles wissen"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  {[{ type: 'marker' as AnnotationType, icon: MapPin, label: 'Punt' }, { type: 'circle' as AnnotationType, icon: Circle, label: 'Cirkel' }, { type: 'underline' as AnnotationType, icon: Minus, label: 'Lijn' }, { type: 'arrow' as AnnotationType, icon: ArrowUpRight, label: 'Pijl' }].map(({ type, icon: Icon, label }) => (
                    <button key={type} onClick={() => setCurrentTool(type)} className={'flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ' + (currentTool === type ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white')}><Icon className="w-4 h-4" /><span className="text-xs">{label}</span></button>
                  ))}
                </div>
                <div className="flex gap-2">{COLORS.map(color => <button key={color.id} onClick={() => setCurrentColor(color.value)} className={'w-8 h-8 rounded-full border-2 transition-all ' + (currentColor === color.value ? 'border-white scale-110' : 'border-transparent hover:scale-105')} style={{ backgroundColor: color.value }} title={color.label} />)}</div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <span className="text-sm font-medium text-zinc-300 mb-2 block">Snelle feedback</span>
                <div className="flex flex-wrap gap-2">{QUICK_TAGS.map(tag => <button key={tag.id} onClick={() => toggleTag(tag.id)} className={'px-3 py-1.5 rounded-full text-sm transition-colors ' + (selectedTags.includes(tag.id) ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white')}>{tag.emoji} {tag.label}</button>)}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-zinc-300 mb-2 block">Extra opmerkingen</span>
                <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Beschrijf hier je feedback..." className="w-full h-24 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              {annotations.filter(a => a.device === device).length > 0 && (
                <div>
                  <span className="text-sm font-medium text-zinc-300 mb-2 block">Annotaties ({annotations.filter(a => a.device === device).length})</span>
                  <div className="space-y-2">
                    {annotations.filter(a => a.device === device).map((annotation, index) => (
                      <div key={annotation.id} onClick={() => setActiveAnnotation(annotation.id)} className={'p-2 rounded-lg border cursor-pointer transition-colors ' + (activeAnnotation === annotation.id ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600')}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: annotation.color }}>{index + 1}</div>
                          <span className="text-sm text-zinc-300 capitalize">{annotation.type === 'marker' && 'Punt'}{annotation.type === 'circle' && 'Cirkel'}{annotation.type === 'underline' && 'Lijn'}{annotation.type === 'arrow' && 'Pijl'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800 space-y-2">
              <button onClick={handleSubmitFeedback} disabled={isSubmitting || (annotations.length === 0 && !feedbackText.trim() && selectedTags.length === 0)} className="w-full py-3 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" />Feedback versturen</>}
              </button>
              <button onClick={handleApprove} disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ThumbsUp className="w-5 h-5" />Design goedkeuren</>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DesignPreviewModal
