import { motion } from 'framer-motion'
import { 
  Heart, 
  Target, 
  Users, 
  Zap,
  CheckCircle,
  ArrowRight,
  Globe,
  Laptop,
  MapPin,
  Clock,
  Sparkles,
  Code,
  Rocket,
  Shield,
  Star,
  Coffee,
  Wifi
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Floating particles component with dark mode support
function FloatingParticles() {
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
          className="absolute rounded-full bg-gradient-to-br from-primary-400 to-blue-500 dark:from-primary-500 dark:to-blue-600"
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

const techStack = [
  'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vercel', 'Cloudflare', 'Framer Motion'
]

export default function OverOns() {
  const { t } = useTranslation()

  const values = [
    {
      icon: Heart,
      title: t('aboutPage.values.items.honest.title'),
      description: t('aboutPage.values.items.honest.description'),
    },
    {
      icon: Zap,
      title: t('aboutPage.values.items.fast.title'),
      description: t('aboutPage.values.items.fast.description'),
    },
    {
      icon: Users,
      title: t('aboutPage.values.items.personal.title'),
      description: t('aboutPage.values.items.personal.description'),
    },
    {
      icon: Target,
      title: t('aboutPage.values.items.results.title'),
      description: t('aboutPage.values.items.results.description'),
    },
  ]

  const stats = [
    { value: '150+', label: t('aboutPage.stats.websitesBuilt') },
    { value: '100%', label: t('aboutPage.stats.remoteTeam') },
    { value: '4.9', label: t('aboutPage.stats.trustpilot'), icon: Star },
    { value: '24u', label: t('aboutPage.stats.responseTime') },
  ]

  const workStyle = [
    {
      icon: Wifi,
      title: t('aboutPage.workStyle.items.remote.title'),
      description: t('aboutPage.workStyle.items.remote.description'),
    },
    {
      icon: Code,
      title: t('aboutPage.workStyle.items.modern.title'),
      description: t('aboutPage.workStyle.items.modern.description'),
    },
    {
      icon: Rocket,
      title: t('aboutPage.workStyle.items.delivery.title'),
      description: t('aboutPage.workStyle.items.delivery.description'),
    },
    {
      icon: Coffee,
      title: t('aboutPage.workStyle.items.flexible.title'),
      description: t('aboutPage.workStyle.items.flexible.description'),
    },
  ]

  const milestones = [
    { year: '2023', title: t('aboutPage.timeline.milestones.2023.title'), description: t('aboutPage.timeline.milestones.2023.description') },
    { year: '2024', title: t('aboutPage.timeline.milestones.2024.title'), description: t('aboutPage.timeline.milestones.2024.description') },
    { year: '2025', title: t('aboutPage.timeline.milestones.2025.title'), description: t('aboutPage.timeline.milestones.2025.description') },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-primary-200/60 via-blue-100/40 to-cyan-100/30 dark:from-primary-900/40 dark:via-blue-900/30 dark:to-cyan-900/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-primary-100/50 via-blue-100/40 to-transparent dark:from-primary-900/30 dark:via-blue-900/20 dark:to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <FloatingParticles />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe33_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe33_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/50 dark:to-blue-900/50 border border-primary-200/50 dark:border-primary-700/50 rounded-full px-4 py-2 mb-6"
                >
                  <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t('aboutPage.badge')}</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {t('aboutPage.heroTitle')}{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {t('aboutPage.heroTitleHighlight')}
                  </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {t('aboutPage.heroSubtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/start"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                  >
                    {t('aboutPage.startProject')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg"
                  >
                    {t('aboutPage.contact')}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="py-8 bg-gradient-to-r from-primary-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
                    {stat.icon && <stat.icon className="w-5 h-5 text-yellow-300 fill-yellow-300" />}
                  </div>
                  <p className="text-primary-100 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-50/50 via-blue-50/30 to-cyan-50/50 dark:from-primary-900/20 dark:via-blue-900/15 dark:to-cyan-900/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3">
                  {t('aboutPage.story.badge')}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('aboutPage.story.title')}{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Webstability
                  </span>
                  {t('aboutPage.story.titleEnd') && ` ${t('aboutPage.story.titleEnd')}`}
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    {t('aboutPage.story.paragraph1')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('aboutPage.story.paragraph2Bold')}</strong> {t('aboutPage.story.paragraph2')}
                  </p>
                  <p>
                    {t('aboutPage.story.paragraph3')}
                    <strong className="text-gray-900 dark:text-white"> {t('aboutPage.story.paragraph3Bold')}</strong>
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('aboutPage.story.conclusion')}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Remote work illustration */}
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-3xl p-8 border border-primary-100 dark:border-primary-800">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Work locations */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('aboutPage.remoteWork.remoteFirst')}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('aboutPage.remoteWork.remoteFirstDesc')}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('aboutPage.remoteWork.flexible')}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('aboutPage.remoteWork.flexibleDesc')}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('aboutPage.remoteWork.digital')}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('aboutPage.remoteWork.digitalDesc')}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                          <Laptop className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('aboutPage.remoteWork.modern')}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('aboutPage.remoteWork.modernDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-primary-100 dark:border-primary-800">
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                      <Sparkles className="w-4 h-4 inline mr-1 text-primary-500 dark:text-primary-400" />
                      {t('aboutPage.remoteWork.noOfficeCosts')}
                    </p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/10 dark:bg-primary-500/5 rounded-2xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/5 rounded-2xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* How we work - Remote & Modern */}
        <section className="py-20 bg-gradient-to-b from-gray-50 via-primary-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-100/40 to-blue-100/20 dark:from-primary-900/20 dark:to-blue-900/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-blue-100/30 to-primary-100/20 dark:from-blue-900/15 dark:to-primary-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                {t('aboutPage.workStyle.title')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {t('aboutPage.workStyle.heading')}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {t('aboutPage.workStyle.headingHighlight')}
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                {t('aboutPage.workStyleSubtitle')}
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workStyle.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/50 hover:border-primary-200 dark:hover:border-primary-700 hover:-translate-y-1 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Tech stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t('aboutPage.techStack')}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {techStack.map((tech) => (
                  <span 
                    key={tech}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3">
                {t('aboutPage.values.title')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('aboutPage.values.heading')}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {t('aboutPage.values.headingHighlight')}
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('aboutPage.valuesSubtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-gradient-to-b from-gray-50 via-primary-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3">
                {t('aboutPage.timeline.title')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t('aboutPage.timeline.heading')}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {t('aboutPage.timeline.headingHighlight')}
                </span>
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-primary-300 dark:from-primary-600 dark:via-primary-500 dark:to-primary-400 hidden md:block" />
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-6 md:gap-8"
                  >
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <span className="text-white font-bold text-sm">{milestone.year}</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3">
                {t('aboutPage.promise.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('aboutPage.promise.title')}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {t('aboutPage.promise.titleHighlight')}
                </span>
                {' '}{t('aboutPage.promise.titleEnd', 'we')}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-3xl p-8 border border-primary-100 dark:border-primary-800"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { text: t('aboutPage.promise.items.liveIn7Days'), icon: Rocket },
                  { text: t('aboutPage.promise.items.noHiddenCosts'), icon: Shield },
                  { text: t('aboutPage.promise.items.alwaysReachable'), icon: Users },
                  { text: t('aboutPage.promise.items.unlimitedChanges'), icon: Zap },
                  { text: t('aboutPage.promise.items.uptime'), icon: Globe },
                  { text: t('aboutPage.promise.items.noLongContracts'), icon: Heart },
                  { text: t('aboutPage.promise.items.freeDomain'), icon: CheckCircle },
                  { text: t('aboutPage.promise.items.moneyBack'), icon: Star },
                ].map((promise, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/50 dark:border-gray-700"
                  >
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <promise.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{promise.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white/90">{t('aboutPage.cta.badge')}</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              {t('aboutPage.cta.heading')}{' '}
              <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                {t('aboutPage.cta.headingHighlight')}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto"
            >
              {t('aboutPage.cta.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/start"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <span>{t('aboutPage.startProject')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/25 transition-all border border-white/20"
              >
                {t('aboutPage.contact')}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer ctaVariant="none" />
    </div>
  )
}
