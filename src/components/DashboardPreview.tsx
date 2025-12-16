import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Bell, 
  FileText, 
  Settings, 
  CheckCircle, 
  Shield 
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
              Alles in één overzicht
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-lg mb-6 lg:mb-8">
              Via je persoonlijke dashboard heb je altijd inzicht in je project. 
              Bekijk de voortgang, geef feedback en vraag aanpassingen aan — allemaal op één plek.
            </p>
            
            <div className="space-y-3 lg:space-y-4">
              {[
                { icon: Bell, text: 'Realtime updates over je project' },
                { icon: FileText, text: 'Direct feedback geven op ontwerpen' },
                { icon: Settings, text: 'Aanpassingen aanvragen met één klik' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm lg:text-base font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
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
              className="absolute -top-2 -left-2 lg:-top-4 lg:-left-4 w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg z-10"
            >
              <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-2 -right-2 lg:-bottom-4 lg:-right-4 w-10 h-10 lg:w-14 lg:h-14 bg-primary-100 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg z-10"
            >
              <Bell className="w-5 h-5 lg:w-7 lg:h-7 text-primary-600" />
            </motion.div>

            {/* Dashboard mockup */}
            <div 
              className="bg-white rounded-xl lg:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
              style={{ transform: 'rotateY(-3deg) rotateX(2deg)' }}
            >
              {/* Browser header */}
              <div className="bg-gray-100 px-3 py-2 lg:px-4 lg:py-3 border-b border-gray-200 flex items-center gap-2">
                <div className="flex gap-1 lg:gap-1.5">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-red-400" />
                  <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-2 lg:mx-4">
                  <div className="bg-white rounded-md px-2 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs text-gray-500 flex items-center gap-1 lg:gap-2">
                    <Shield className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-green-500" />
                    <span className="hidden sm:inline">dashboard.webstability.nl</span>
                    <span className="sm:hidden">dashboard</span>
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-4 lg:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm lg:text-base">Welkom terug, Lisa 👋</h4>
                    <p className="text-xs lg:text-sm text-gray-500">Studio Lisa • starter pakket</p>
                  </div>
                  <div className="px-2 py-0.5 lg:px-3 lg:py-1 bg-green-100 text-green-700 rounded-full text-[10px] lg:text-xs font-medium">
                    Website live
                  </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-4 lg:mb-6">
                  {[
                    { label: 'Bezoekers', value: '1.2k', trend: '+12%' },
                    { label: 'Pagina\'s', value: '5', trend: '' },
                    { label: 'Uptime', value: '99.9%', trend: '' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg lg:rounded-xl p-2 lg:p-3">
                      <div className="text-[9px] lg:text-xs text-gray-500 mb-0.5 lg:mb-1">{stat.label}</div>
                      <div className="flex items-baseline gap-0.5 lg:gap-1">
                        <span className="font-bold text-gray-900 text-xs lg:text-base">{stat.value}</span>
                        {stat.trend && <span className="text-[9px] lg:text-xs text-green-600">{stat.trend}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity */}
                <div className="space-y-2 lg:space-y-3">
                  <div className="text-[9px] lg:text-xs font-medium text-gray-500 uppercase tracking-wide">Recente updates</div>
                  {[
                    { text: 'Nieuwe contactpagina toegevoegd', time: 'Vandaag' },
                    { text: 'SEO optimalisatie voltooid', time: 'Gisteren' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 lg:py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-1.5 lg:gap-2">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-primary-500" />
                        <span className="text-xs lg:text-sm text-gray-700">{item.text}</span>
                      </div>
                      <span className="text-[9px] lg:text-xs text-gray-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
