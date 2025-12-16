import { motion } from 'framer-motion'
import { ArrowRight, Star, TrendingUp } from 'lucide-react'

// Floating particles component
function FloatingParticles() {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
    { size: 6, x: '20%', y: '60%', delay: 1, duration: 5 },
    { size: 3, x: '80%', y: '30%', delay: 0.5, duration: 4.5 },
    { size: 5, x: '70%', y: '70%', delay: 1.5, duration: 5.5 },
    { size: 4, x: '90%', y: '50%', delay: 2, duration: 4 },
    { size: 7, x: '15%', y: '80%', delay: 0.8, duration: 6 },
    { size: 3, x: '60%', y: '15%', delay: 1.2, duration: 4.2 },
    { size: 5, x: '40%', y: '85%', delay: 0.3, duration: 5.3 },
    { size: 4, x: '85%', y: '85%', delay: 1.8, duration: 4.8 },
    { size: 6, x: '5%', y: '45%', delay: 2.2, duration: 5.2 },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary-400 to-blue-500"
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

export default function Hero() {

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient blobs - more colorful */}
        <motion.div 
          className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-primary-200/60 via-blue-100/40 to-cyan-100/30 dark:from-primary-800/30 dark:via-blue-900/20 dark:to-cyan-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-primary-100/50 via-blue-100/40 to-transparent dark:from-primary-900/30 dark:via-blue-900/20 dark:to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
          animate={{ 
            scale: [1, 1.08, 1],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-100/30 via-primary-100/20 to-blue-100/30 dark:from-cyan-900/20 dark:via-primary-900/10 dark:to-blue-900/20 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        <FloatingParticles />
        
        {/* Subtle grid with brand color */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe33_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe33_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e3a5f33_1px,transparent_1px),linear-gradient(to_bottom,#1e3a5f33_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Decorative rings */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-primary-200/30 dark:border-primary-700/30 rounded-full" />
        <div className="absolute top-24 right-24 w-24 h-24 border border-primary-300/20 dark:border-primary-600/20 rounded-full" />
        <div className="absolute bottom-32 left-20 w-20 h-20 border border-blue-200/40 dark:border-blue-700/40 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge above headline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200/50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-primary-700">100+ websites opgeleverd</span>
            </motion.div>

            {/* Main headline - responsive sizing */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight">
              Een website die{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary-600 via-primary-500 to-blue-500 bg-clip-text text-transparent">
                  klanten oplevert
                </span>
                {/* Animated underline - subtle curved line */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M0 5 Q50 0 100 5 T200 5"
                    stroke="url(#underlineGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F8EF7" stopOpacity="0.7" />
                      <stop offset="50%" stopColor="#6366F1" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Professionele website binnen 7 dagen. Geen technisch gedoe, geen verborgen kosten. Focus op je bedrijf, wij regelen de rest.
            </p>

            {/* CTA buttons - stacked on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0"
            >
              <a
                href="/start"
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 overflow-hidden text-sm sm:text-base"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative">Start direct</span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#portfolio"
                className="group text-gray-600 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm transition-colors flex items-center gap-1"
              >
                Bekijk ons werk 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </motion.div>

            {/* Trust indicators - always side by side */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center gap-2 sm:gap-4 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="whitespace-nowrap">Geen verplichtingen</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  </svg>
                </div>
                <span className="whitespace-nowrap">Reactie binnen 24 uur</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right visual - Website Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow behind mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-blue-400/15 to-cyan-400/10 rounded-3xl blur-2xl scale-105" />
              
              {/* Main browser mockup */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-2xl shadow-primary-900/10 dark:shadow-primary-900/30 overflow-hidden">
                {/* Browser bar with gradient */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 font-mono flex items-center gap-2">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      jouwbedrijf.nl
                    </div>
                  </div>
                </div>
                
                {/* Website preview content */}
                <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-900">
                  {/* Hero of preview - more vibrant */}
                  <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700 p-6 text-white relative overflow-hidden">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 border-2 border-white rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 border-2 border-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm" />
                        <div className="h-4 bg-white/40 rounded w-24" />
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-6 bg-white rounded w-4/5" />
                        <div className="h-4 bg-white/60 rounded w-3/5" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-white rounded-lg w-24" />
                        <div className="h-8 bg-white/20 rounded-lg w-20 border border-white/40 backdrop-blur-sm" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Features section of preview */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {['💼', '🚀', '💎'].map((emoji, i) => (
                        <motion.div 
                          key={i} 
                          className="bg-white dark:bg-gray-700 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-600 shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        >
                          <div className="text-xl mb-1">{emoji}</div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1" />
                          <div className="h-2 bg-gray-100 dark:bg-gray-500 rounded w-4/5 mx-auto" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Review preview */}
                    <div className="bg-gradient-to-br from-white to-primary-50/30 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-primary-100/50 dark:border-primary-800/50 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full" />
                        <div className="flex-1">
                          <div className="h-2 bg-gray-300 dark:bg-gray-500 rounded w-20 mb-1" />
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats card - enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl shadow-green-900/10 dark:shadow-green-900/30 border border-green-100 dark:border-green-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">+147%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Meer bezoekers</div>
                  </div>
                </div>
              </motion.div>

              {/* New floating element - delivery time */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                className="absolute -bottom-4 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl shadow-primary-900/10 dark:shadow-primary-900/30 border border-primary-100 dark:border-primary-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-blue-200 dark:from-primary-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">7 dagen</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Levertijd</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
