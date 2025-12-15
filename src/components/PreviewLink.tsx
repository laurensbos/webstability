import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  RefreshCw,
  Eye,
  Copy,
  Check
} from 'lucide-react'

interface PreviewLinkProps {
  previewUrl: string
  projectName: string
  phaseColor: string
}

type DeviceType = 'desktop' | 'tablet' | 'mobile'

const DEVICE_CONFIG = {
  desktop: { icon: Monitor, width: '100%', label: 'Desktop' },
  tablet: { icon: Tablet, width: '768px', label: 'Tablet' },
  mobile: { icon: Smartphone, width: '375px', label: 'Mobiel' },
}

export default function PreviewLink({ 
  previewUrl, 
  projectName,
  phaseColor 
}: PreviewLinkProps) {
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-gray-900"
      >
        {/* Fullscreen Header */}
        <div className="absolute top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 p-3 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 ${phaseColor} rounded-lg flex items-center justify-center`}>
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium">{projectName}</span>
              </div>
              
              {/* Device selector */}
              <div className="flex items-center gap-1 p-1 bg-gray-700 rounded-lg">
                {(Object.keys(DEVICE_CONFIG) as DeviceType[]).map((d) => {
                  const config = DEVICE_CONFIG[d]
                  const Icon = config.icon
                  return (
                    <button
                      key={d}
                      onClick={() => setDevice(d)}
                      className={`p-2 rounded-md transition ${
                        device === d
                          ? 'bg-white text-gray-900'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={config.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition"
                title="Vernieuwen"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition"
                title="Open in nieuw tabblad"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen Preview */}
        <div className="pt-16 h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              width: device === 'desktop' ? '100%' : DEVICE_CONFIG[device].width,
              maxWidth: '100%'
            }}
            className="h-full bg-white rounded-lg overflow-hidden shadow-2xl"
          >
            <iframe
              key={refreshKey}
              src={previewUrl}
              className="w-full h-full border-0"
              title={`Preview van ${projectName}`}
            />
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className={`${phaseColor} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Live Preview</h3>
              <p className="text-sm text-white/80">Bekijk je website in ontwikkeling</p>
            </div>
          </div>
          
          {/* Device selector */}
          <div className="flex items-center gap-1 p-1 bg-white/10 rounded-lg">
            {(Object.keys(DEVICE_CONFIG) as DeviceType[]).map((d) => {
              const config = DEVICE_CONFIG[d]
              const Icon = config.icon
              return (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`p-2 rounded-md transition ${
                    device === d
                      ? 'bg-white text-gray-900'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={config.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="relative bg-gray-100 p-4">
        {/* URL Bar */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm">
            <span className="text-gray-400 truncate">{previewUrl}</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded transition"
            title="Kopieer link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded transition"
            title="Vernieuwen"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* iframe container */}
        <div className="flex justify-center">
          <motion.div
            layout
            style={{ 
              width: device === 'desktop' ? '100%' : DEVICE_CONFIG[device].width,
            }}
            className={`overflow-hidden transition-all duration-300 ${
              device !== 'desktop' 
                ? 'rounded-3xl border-4 border-gray-800 shadow-xl' 
                : 'rounded-lg border border-gray-200'
            }`}
          >
            {/* Device notch for mobile */}
            {device === 'mobile' && (
              <div className="bg-gray-800 h-6 flex items-center justify-center">
                <div className="w-20 h-4 bg-gray-900 rounded-full" />
              </div>
            )}
            
            <div className="relative bg-white" style={{ 
              height: device === 'desktop' ? '400px' : device === 'tablet' ? '500px' : '600px' 
            }}>
              <iframe
                key={refreshKey}
                src={previewUrl}
                className="w-full h-full border-0"
                title={`Preview van ${projectName}`}
              />
            </div>

            {/* Device home button for mobile/tablet */}
            {device !== 'desktop' && (
              <div className="bg-gray-800 h-5 flex items-center justify-center">
                <div className={`bg-gray-600 rounded-full ${
                  device === 'mobile' ? 'w-10 h-1' : 'w-8 h-8 border-2 border-gray-500'
                }`} />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
        <button
          onClick={() => setIsFullscreen(true)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 ${phaseColor} text-white rounded-xl font-medium hover:opacity-90 transition`}
        >
          <Maximize2 className="w-4 h-4" />
          Volledig scherm
        </button>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition"
        >
          <ExternalLink className="w-4 h-4" />
          Open in nieuw tabblad
        </a>
      </div>
    </motion.div>
  )
}
