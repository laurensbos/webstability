import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Mail, MessageCircle, ArrowRight, Copy, Check, ExternalLink, Shield, Sparkles, Globe, ShoppingBag, Camera, Palette, Lock } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

type ServiceType = 'website' | 'webshop' | 'drone' | 'logo'

// Color schemes per service
const serviceColors = {
  website: {
    gradient: 'from-primary-500 to-blue-500',
    gradientBg: 'from-slate-50 via-primary-50/30 to-white',
    blob1: 'from-primary-200/60 via-blue-100/40 to-cyan-100/30',
    blob2: 'from-blue-100/50 via-primary-100/40 to-transparent',
    particle: 'from-primary-400 to-blue-500',
    text: 'text-primary-600',
    textDark: 'text-primary-700',
    bg: 'bg-primary-50',
    bgLight: 'bg-primary-100',
    border: 'border-primary-200',
    icon: Globe,
    label: 'Website',
  },
  webshop: {
    gradient: 'from-emerald-500 to-green-500',
    gradientBg: 'from-slate-50 via-emerald-50/30 to-white',
    blob1: 'from-emerald-200/60 via-green-100/40 to-teal-100/30',
    blob2: 'from-green-100/50 via-emerald-100/40 to-transparent',
    particle: 'from-emerald-400 to-green-500',
    text: 'text-emerald-600',
    textDark: 'text-emerald-700',
    bg: 'bg-emerald-50',
    bgLight: 'bg-emerald-100',
    border: 'border-emerald-200',
    icon: ShoppingBag,
    label: 'Webshop',
  },
  drone: {
    gradient: 'from-orange-500 to-amber-500',
    gradientBg: 'from-slate-50 via-orange-50/30 to-white',
    blob1: 'from-orange-200/60 via-amber-100/40 to-yellow-100/30',
    blob2: 'from-amber-100/50 via-orange-100/40 to-transparent',
    particle: 'from-orange-400 to-amber-500',
    text: 'text-orange-600',
    textDark: 'text-orange-700',
    bg: 'bg-orange-50',
    bgLight: 'bg-orange-100',
    border: 'border-orange-200',
    icon: Camera,
    label: 'Drone opnames',
  },
  logo: {
    gradient: 'from-purple-500 to-violet-500',
    gradientBg: 'from-slate-50 via-purple-50/30 to-white',
    blob1: 'from-purple-200/60 via-violet-100/40 to-fuchsia-100/30',
    blob2: 'from-violet-100/50 via-purple-100/40 to-transparent',
    particle: 'from-purple-400 to-violet-500',
    text: 'text-purple-600',
    textDark: 'text-purple-700',
    bg: 'bg-purple-50',
    bgLight: 'bg-purple-100',
    border: 'border-purple-200',
    icon: Palette,
    label: 'Logo ontwerp',
  },
}

function FloatingParticles({ colors }: { colors: typeof serviceColors.website }) {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
    { size: 6, x: '20%', y: '60%', delay: 1, duration: 5 },
    { size: 3, x: '80%', y: '30%', delay: 0.5, duration: 4.5 },
    { size: 5, x: '70%', y: '70%', delay: 1.5, duration: 5.5 },
    { size: 4, x: '90%', y: '50%', delay: 2, duration: 4 },
    { size: 7, x: '15%', y: '80%', delay: 0.8, duration: 6 },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${colors.particle}`}
          style={{ 
            width: p.size, 
            height: p.size, 
            left: p.x, 
            top: p.y,
            opacity: 0.4 + (p.size / 20)
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )
}

export default function Bedankt() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')
  const dienst = (searchParams.get('dienst') as ServiceType) || 'website'
  const email = searchParams.get('email') || ''
  const [copied, setCopied] = useState(false)

  const colors = serviceColors[dienst] || serviceColors.website
  const ServiceIcon = colors.icon

  const copyProjectId = () => {
    if (projectId) {
      navigator.clipboard.writeText(projectId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const steps = [
    {
      icon: Mail,
      title: 'Bevestigingsmail',
      description: 'Je ontvangt direct een bevestiging op het opgegeven e-mailadres.',
      time: 'Nu'
    },
    {
      icon: Clock,
      title: 'Persoonlijk contact',
      description: 'We nemen binnen 24 uur contact met je op om je wensen te bespreken.',
      time: 'Binnen 24 uur'
    },
    {
      icon: CheckCircle,
      title: 'Eerste ontwerp',
      description: 'Na akkoord ontvang je binnen 5 werkdagen het eerste ontwerp.',
      time: 'Binnen 5 dagen'
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className={`relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br ${colors.gradientBg} pt-20`}>
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${colors.blob1} rounded-full blur-3xl -translate-y-1/3 translate-x-1/4`}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className={`absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr ${colors.blob2} rounded-full blur-3xl translate-y-1/3 -translate-x-1/4`}
            animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <FloatingParticles colors={colors} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0e7ff22_1px,transparent_1px),linear-gradient(to_bottom,#e0e7ff22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="relative inline-block mb-8"
          >
            {/* Outer ring animation */}
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.gradient} opacity-20`}
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className={`relative w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center shadow-xl`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </motion.div>
            </div>
            {/* Sparkles */}
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className={`w-6 h-6 ${colors.text}`} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`inline-flex items-center gap-2 ${colors.bg} ${colors.border} border rounded-full px-4 py-2 mb-6`}>
              <ServiceIcon className={`w-4 h-4 ${colors.text}`} />
              <span className={`text-sm font-medium ${colors.textDark}`}>{colors.label}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Bedankt voor je aanvraag!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
              We hebben je projectaanvraag ontvangen en gaan er direct mee aan de slag. 
              Je ontvangt binnen 24 uur een reactie van ons.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          {/* Project ID Card */}
          {projectId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-6 mb-8 shadow-xl`}
            >
              <p className="text-white/90 text-sm mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Bewaar dit goed - je hebt dit nodig om je project te volgen:
              </p>
              <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
                <code className="text-2xl font-mono font-bold text-white tracking-wider">
                  {projectId}
                </code>
                <button
                  onClick={copyProjectId}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Kopieer project ID"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/80" />
                  )}
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
                <Link
                  to={`/onboarding/${projectId}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-white/90 dark:hover:bg-gray-800 transition shadow-lg"
                >
                  Start onboarding
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={`/project/${projectId}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition border border-white/20"
                >
                  Bekijk project status
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  to={`/status/${projectId}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition border border-white/20"
                >
                  <Lock className="w-4 h-4" />
                  Login dashboard
                </Link>
              </div>
            </motion.div>
          )}

          {/* Spam warning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${colors.bg} rounded-2xl p-6 mb-8 border ${colors.border}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">📧 Check je inbox!</h3>
                {email ? (
                  <p className="text-gray-700 text-sm mb-3">
                    We sturen een bevestigingsmail naar <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
                  </p>
                ) : (
                  <p className="text-gray-700 text-sm mb-3">
                    We sturen je een bevestigingsmail met alle details.
                  </p>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>In deze mail vind je:</p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-2 space-y-0.5">
                    <li>Je project ID</li>
                    <li>Link naar de onboarding</li>
                    <li>Wat je van ons kunt verwachten</li>
                    <li>Contactgegevens voor vragen</li>
                  </ul>
                </div>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-xs">
                    <strong>💡 Tip:</strong> Niet ontvangen? Check je spam/ongewenste mail en voeg{' '}
                    <span className="font-medium">info@webstability.nl</span> toe aan je contacten.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm"
          >
            <h2 className="font-bold text-gray-900 text-xl mb-6">Wat kun je verwachten?</h2>
            
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-[22px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent" />
              
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="relative flex items-start gap-4"
                  >
                    <div className={`relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                        <span className={`text-xs font-medium ${colors.text} ${colors.bg} px-2 py-1 rounded-full`}>
                          {step.time}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`${colors.bg} rounded-2xl p-6 mb-8 text-center border ${colors.border}`}
          >
            <p className="text-gray-900 dark:text-white font-medium mb-4">
              Kan je niet wachten? Neem direct contact op:
            </p>
            <a
              href="https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20zojuist%20een%20aanvraag%20gedaan%20en%20wil%20graag%20meer%20info."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ons direct
            </a>
          </motion.div>

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              ← Terug naar de homepage
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
