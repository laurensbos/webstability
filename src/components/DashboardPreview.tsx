import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Bell, 
  FileText, 
  CheckCircle, 
  Shield,
  TrendingUp,
  FileCheck,
  Clock,
  MessageSquare,
  ArrowRight
} from 'lucide-react'

export default function DashboardPreview() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs lg:text-sm font-medium mb-4 lg:mb-6">
              <LayoutDashboard className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              Jouw dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
              Altijd inzicht in je project
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-lg mb-6 lg:mb-8">
              Via je persoonlijke dashboard heb je 24/7 toegang tot je project. 
              Bekijk statistieken, geef feedback en volg updates — alles realtime.
            </p>
            
            <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
              {[
                { icon: TrendingUp, text: 'Realtime statistieken & bezoekersdata', color: 'primary' },
                { icon: MessageSquare, text: 'Direct feedback geven op ontwerpen', color: 'emerald' },
                { icon: Bell, text: 'Push notificaties bij updates', color: 'amber' },
                { icon: FileCheck, text: 'Voortgang & status volgen', color: 'purple' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${
                    item.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/30' :
                    item.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/30' :
                    item.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/30' :
                    'bg-purple-50 dark:bg-purple-900/30'
                  }`}>
                    <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                      item.color === 'primary' ? 'text-primary-600 dark:text-primary-400' :
                      item.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                      item.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm lg:text-base font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA button */}
            <motion.a
              href="/start"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all group shadow-lg shadow-primary-500/25"
            >
              Start je project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>

          {/* 3D Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-1 lg:order-2"
            style={{ perspective: '1000px' }}
          >
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-2 -left-2 lg:-top-4 lg:-left-4 w-12 h-12 lg:w-16 lg:h-16 bg-green-100 dark:bg-green-900/50 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg z-10"
            >
              <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
            </motion.div>
            
            {/* Notification bell - floating bottom right */}
            <motion.div
              animate={{ y: [0, 8, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-2 -right-2 lg:-bottom-4 lg:-right-4 w-12 h-12 lg:w-14 lg:h-14 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl z-10 border border-gray-100 dark:border-gray-700"
            >
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-400" />
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
            </motion.div>

            {/* Dashboard mockup */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              style={{ transform: 'rotateY(-3deg) rotateX(2deg)' }}
            >
              {/* Browser header */}
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 lg:px-4 lg:py-3 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2">
                <div className="flex gap-1 lg:gap-1.5">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-red-400" />
                  <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-2 lg:mx-4">
                  <div className="bg-white dark:bg-gray-800 rounded-md px-2 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 lg:gap-2">
                    <Shield className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-green-500" />
                    <span className="hidden sm:inline">dashboard.webstability.nl</span>
                    <span className="sm:hidden">dashboard</span>
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-800/50">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 lg:mb-6 bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base">Welkom terug, Lisa 👋</h4>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Studio Lisa • starter pakket</p>
                  </div>
                  <div className="px-2 py-1 lg:px-3 lg:py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] lg:text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="hidden sm:inline">Website live</span>
                    <span className="sm:hidden">Live</span>
                  </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-4 lg:mb-5">
                  {[
                    { label: 'Bezoekers', value: '1.2k', trend: '+12%', icon: TrendingUp, color: 'primary' },
                    { label: 'Pagina\'s', value: '5', trend: '', icon: FileText, color: 'gray' },
                    { label: 'Uptime', value: '99.9%', trend: '', icon: Clock, color: 'green' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1 mb-1">
                        <stat.icon className={`w-3 h-3 lg:w-3.5 lg:h-3.5 ${
                          stat.color === 'primary' ? 'text-primary-500' :
                          stat.color === 'green' ? 'text-green-500' :
                          'text-gray-400'
                        }`} />
                        <span className="text-[9px] lg:text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                      </div>
                      <div className="flex items-baseline gap-0.5 lg:gap-1">
                        <span className="font-bold text-gray-900 dark:text-white text-sm lg:text-lg">{stat.value}</span>
                        {stat.trend && <span className="text-[9px] lg:text-xs text-green-600">{stat.trend}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-[9px] lg:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 lg:mb-3">Recente updates</div>
                  <div className="space-y-2 lg:space-y-3">
                    {[
                      { text: 'Nieuwe contactpagina toegevoegd', time: 'Vandaag', isNew: true },
                      { text: 'SEO optimalisatie voltooid', time: 'Gisteren', isNew: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 lg:py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                        <div className="flex items-center gap-1.5 lg:gap-2">
                          <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${item.isNew ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                        </div>
                        <span className="text-[9px] lg:text-xs text-gray-400">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
