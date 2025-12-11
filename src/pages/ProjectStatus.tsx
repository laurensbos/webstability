import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  FileText, 
  Palette, 
  Code, 
  Rocket,
  MessageSquare,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Demo project data - in productie zou dit van een API komen
const demoProject = {
  id: 'WS-2024-001',
  businessName: 'Bakkerij De Gouden Korst',
  package: 'Professional',
  startDate: '2024-12-01',
  estimatedDelivery: '2024-12-15',
  currentPhase: 2,
  previewUrl: null,
  phases: [
    {
      id: 1,
      title: 'Intake & Planning',
      description: 'Kennismakingsgesprek en projectplanning',
      status: 'completed',
      completedDate: '2024-12-02',
    },
    {
      id: 2,
      title: 'Ontwerp',
      description: 'Visueel ontwerp en huisstijl verwerking',
      status: 'in-progress',
      completedDate: null,
    },
    {
      id: 3,
      title: 'Development',
      description: 'Bouwen van de website',
      status: 'pending',
      completedDate: null,
    },
    {
      id: 4,
      title: 'Review & Feedback',
      description: 'Jouw feedback verwerken',
      status: 'pending',
      completedDate: null,
    },
    {
      id: 5,
      title: 'Livegang',
      description: 'Website online zetten',
      status: 'pending',
      completedDate: null,
    },
  ],
  updates: [
    {
      date: '2024-12-05',
      message: 'We zijn begonnen met het ontwerp! Je ontvangt binnenkort de eerste mockups.',
      type: 'info',
    },
    {
      date: '2024-12-02',
      message: 'Intake gesprek afgerond. Alle informatie is ontvangen.',
      type: 'success',
    },
    {
      date: '2024-12-01',
      message: 'Project gestart! Welkom bij Webstability.',
      type: 'success',
    },
  ],
}

const phaseIcons = [FileText, Palette, Code, MessageSquare, Rocket]

export default function ProjectStatus() {
  const [projectCode, setProjectCode] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  // Demo: accepteer elke code voor nu
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectCode.trim().length > 0) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Voer je projectcode in')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'in-progress':
        return <Clock className="w-6 h-6 text-primary-500 animate-pulse" />
      default:
        return <Circle className="w-6 h-6 text-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50'
      case 'in-progress':
        return 'border-primary-500 bg-primary-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="pt-32 pb-20">
          <div className="max-w-md mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Project Status</h1>
                <p className="text-gray-600 mt-2">
                  Voer je projectcode in om de status van je website te bekijken
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projectcode
                  </label>
                  <input
                    type="text"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none uppercase"
                    placeholder="bijv. WS-2024-001"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Je projectcode staat in de bevestigingsmail die je van ons hebt ontvangen
                  </p>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Bekijk status
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                  Geen projectcode ontvangen?{' '}
                  <a href="/contact" className="text-primary-600 font-medium hover:underline">
                    Neem contact op
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Project status dashboard
  const project = demoProject
  const progressPercentage = (project.currentPhase / project.phases.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Project #{project.id}</p>
                <h1 className="text-2xl font-bold text-gray-900">{project.businessName}</h1>
                <p className="text-primary-600 font-medium">{project.package} pakket</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Verwachte oplevering</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(project.estimatedDelivery).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Voortgang</span>
                <span className="text-sm font-semibold text-primary-600">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Phases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Projectfases</h2>
              <div className="space-y-3">
                {project.phases.map((phase, index) => {
                  const Icon = phaseIcons[index]
                  return (
                    <div
                      key={phase.id}
                      className={`p-4 rounded-xl border-2 transition-all ${getStatusColor(phase.status)}`}
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(phase.status)}
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                          <p className="text-sm text-gray-600">{phase.description}</p>
                        </div>
                        {phase.completedDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(phase.completedDate).toLocaleDateString('nl-NL')}
                          </span>
                        )}
                        {phase.status === 'in-progress' && (
                          <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                            Actief
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Preview link */}
              {project.previewUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white"
                >
                  <h3 className="font-semibold mb-2">🎉 Preview beschikbaar!</h3>
                  <p className="text-primary-100 text-sm mb-4">
                    Bekijk de eerste versie van je website en geef feedback.
                  </p>
                  <a
                    href={project.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Bekijk preview
                  </a>
                </motion.div>
              )}
            </motion.div>

            {/* Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Updates</h2>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {project.updates.map((update, index) => (
                    <div key={index} className="p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(update.date).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                      <p className="text-sm text-gray-700">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                <p className="text-sm text-gray-600 mb-3">Vragen over je project?</p>
                <a
                  href="https://wa.me/31644712573"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 bg-green-500 hover:bg-green-600 text-white text-center font-medium rounded-lg transition-colors text-sm"
                >
                  WhatsApp ons
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
