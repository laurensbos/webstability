/**
 * Stock Photo Suggestions Component
 * 
 * Shows relevant stock photos based on business type
 * Used in onboarding when client doesn't have their own photos
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Image,
  Search,
  Check,
  Download,
  ExternalLink,
  Loader2,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'

interface StockPhoto {
  id: string
  url: string
  thumbUrl: string
  fullUrl: string
  alt: string
  photographer: string
  photographerUrl: string
  downloadUrl: string
  width: number
  height: number
  color: string
  source: 'unsplash'
}

interface StockPhotoSuggestionsProps {
  businessName?: string
  businessDescription?: string
  selectedPhotos: string[]
  onSelectPhoto: (photoUrl: string) => void
  onDeselectPhoto: (photoUrl: string) => void
  maxSelections?: number
  darkMode?: boolean
  compact?: boolean
}

export default function StockPhotoSuggestions({
  businessName = '',
  businessDescription = '',
  selectedPhotos,
  onSelectPhoto,
  onDeselectPhoto,
  maxSelections = 10,
  darkMode = true,
  compact = false
}: StockPhotoSuggestionsProps) {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<StockPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customSearch, setCustomSearch] = useState('')
  const [error, setError] = useState('')
  const [previewPhoto, setPreviewPhoto] = useState<StockPhoto | null>(null)
  const [page, setPage] = useState(0)

  const photosPerPage = compact ? 6 : 9

  // Generate search query from business info
  useEffect(() => {
    if (businessName || businessDescription) {
      // Extract keywords from business name and description
      const keywords = [businessName, businessDescription]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 3)
        .join(' ')
      
      if (keywords) {
        setSearchQuery(keywords)
      }
    }
  }, [businessName, businessDescription])

  // Fetch photos when search query changes
  useEffect(() => {
    if (!searchQuery) return
    fetchPhotos(searchQuery)
  }, [searchQuery])

  const fetchPhotos = async (query: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `/api/stock-photos?query=${encodeURIComponent(query)}&businessDescription=${encodeURIComponent(businessDescription)}&count=18`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos')
      }
      
      const data = await response.json()
      setPhotos(data.photos || [])
      setPage(0)
    } catch (err) {
      console.error('Failed to fetch stock photos:', err)
      setError(t('errors.api.loadPhotosFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (customSearch.trim()) {
      setSearchQuery(customSearch.trim())
    }
  }

  const handleRefresh = () => {
    if (searchQuery) {
      fetchPhotos(searchQuery)
    }
  }

  const handleSelectPhoto = (photo: StockPhoto) => {
    if (selectedPhotos.includes(photo.fullUrl)) {
      onDeselectPhoto(photo.fullUrl)
    } else if (selectedPhotos.length < maxSelections) {
      onSelectPhoto(photo.fullUrl)
    }
  }

  const isSelected = (photo: StockPhoto) => selectedPhotos.includes(photo.fullUrl)

  const paginatedPhotos = photos.slice(page * photosPerPage, (page + 1) * photosPerPage)
  const totalPages = Math.ceil(photos.length / photosPerPage)

  // Suggested search terms
  const suggestedSearches = [
    'kantoor',
    'team',
    'klanten',
    'werkplaats',
    'winkel',
    'natuur',
    'technologie',
    'stad'
  ]

  return (
    <div className={`space-y-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Image className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold">Stockfoto suggesties</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Gratis foto's van Unsplash
            </p>
          </div>
        </div>
        
        {selectedPhotos.length > 0 && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {selectedPhotos.length}/{maxSelections} geselecteerd
          </div>
        )}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={customSearch}
            onChange={(e) => setCustomSearch(e.target.value)}
            placeholder="Zoek foto's..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={!customSearch.trim() || loading}
          className={`px-4 py-2.5 rounded-xl font-medium transition flex items-center gap-2 ${
            customSearch.trim()
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : darkMode
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Search className="w-4 h-4" />
          Zoeken
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className={`p-2.5 rounded-xl transition ${
            darkMode
              ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </form>

      {/* Suggested Searches */}
      {!compact && (
        <div className="flex flex-wrap gap-2">
          {suggestedSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                setCustomSearch(term)
                setSearchQuery(term)
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                searchQuery === term
                  ? 'bg-purple-500 text-white'
                  : darkMode
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={`p-4 rounded-xl text-center ${
          darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
        }`}>
          {error}
        </div>
      )}

      {/* Photo Grid */}
      {!loading && !error && photos.length > 0 && (
        <>
          <div className={`grid gap-3 ${compact ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
            <AnimatePresence mode="popLayout">
              {paginatedPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => handleSelectPhoto(photo)}
                >
                  {/* Image */}
                  <img
                    src={photo.thumbUrl}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    style={{ backgroundColor: photo.color }}
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 transition ${
                    isSelected(photo)
                      ? 'bg-emerald-500/40'
                      : 'bg-black/0 group-hover:bg-black/30'
                  }`} />
                  
                  {/* Selection indicator */}
                  <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition ${
                    isSelected(photo)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  
                  {/* Preview button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewPhoto(photo)
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  
                  {/* Photographer credit */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                    <p className="text-white text-xs truncate">
                      📷 {photo.photographer}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`p-2 rounded-lg transition ${
                  page === 0
                    ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
                    : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className={`p-2 rounded-lg transition ${
                  page >= totalPages - 1
                    ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
                    : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && photos.length === 0 && searchQuery && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Geen foto's gevonden voor "{searchQuery}"</p>
          <p className="text-sm mt-2">Probeer een andere zoekterm</p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !error && photos.length === 0 && !searchQuery && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Voer je bedrijfsnaam in om relevante foto suggesties te zien</p>
        </div>
      )}

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewPhoto(null)}
              className="fixed inset-0 bg-black/80 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-10 z-50 flex items-center justify-center"
            >
              <div className={`relative max-w-4xl w-full rounded-2xl overflow-hidden ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              }`}>
                {/* Close button */}
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Image */}
                <img
                  src={previewPhoto.url}
                  alt={previewPhoto.alt}
                  className="w-full max-h-[70vh] object-contain"
                  style={{ backgroundColor: previewPhoto.color }}
                />
                
                {/* Footer */}
                <div className={`p-4 flex items-center justify-between ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div>
                    <p className="font-medium">📷 {previewPhoto.photographer}</p>
                    <a
                      href={previewPhoto.photographerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-500 hover:underline"
                    >
                      Bekijk op Unsplash
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={previewPhoto.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                        darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    <button
                      onClick={() => {
                        handleSelectPhoto(previewPhoto)
                        setPreviewPhoto(null)
                      }}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                        isSelected(previewPhoto)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {isSelected(previewPhoto) ? (
                        <>
                          <X className="w-4 h-4" />
                          Deselecteren
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Selecteren
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Unsplash Attribution */}
      <p className={`text-xs text-center ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        Foto's van{' '}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-purple-500"
        >
          Unsplash
        </a>
        {' '}• Gratis te gebruiken
      </p>
    </div>
  )
}
