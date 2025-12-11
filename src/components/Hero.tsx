import { motion } from 'framer-motion'
import { ArrowRight, Check, Sparkles, Star, TrendingUp, Zap } from 'lucide-react'

export default function Hero() {

  const benefits = [
    'Eenmalig vanaf €99',
    'Online binnen 7 dagen',
    'Altijd bereikbare support',
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white pt-20">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-100/40 via-primary-50/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary-100/30 via-transparent to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        {/* Dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700">Nu beschikbaar in heel Nederland</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Jouw professionele website.{' '}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Zonder gedoe.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Een professionele website voor een vast bedrag per maand. 
              Inclusief hosting, onderhoud en aanpassingen. 
              <span className="font-semibold text-gray-900">Eenmalig vanaf €99.</span>
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0"
            >
              <a
                href="/start"
                className="group px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                Start je project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#pricing"
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                Bekijk prijzen
              </a>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              <p className="text-gray-500 text-sm">
                Vanaf <span className="text-gray-900 font-bold text-lg">€79</span>/maand • Geen contractduur
              </p>
              {/* Trust indicator */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-1">4.9/5 (120+ klanten)</span>
              </div>
            </div>
          </motion.div>

          {/* Right visual - Website Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main browser mockup with realistic website */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 font-mono flex items-center gap-2">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      jouwbedrijf.nl
                    </div>
                  </div>
                </div>
                
                {/* Realistic website preview */}
                <div className="bg-white">
                  {/* Hero section of preview */}
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-white/20 rounded-lg" />
                      <div className="h-4 bg-white/40 rounded w-24" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-6 bg-white rounded w-4/5" />
                      <div className="h-4 bg-white/60 rounded w-3/5" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-white rounded-lg w-24" />
                      <div className="h-8 bg-white/20 rounded-lg w-20 border border-white/40" />
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {['💼', '🚀', '💎'].map((emoji, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                          <div className="text-xl mb-1">{emoji}</div>
                          <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                          <div className="h-2 bg-gray-100 rounded w-4/5 mx-auto" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Testimonial preview */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full" />
                        <div className="flex-1">
                          <div className="h-2 bg-gray-300 rounded w-20 mb-1" />
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                      <div className="h-2 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats card */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">+147%</div>
                    <div className="text-xs text-gray-500">Meer bezoekers</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -left-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm font-semibold">Website live!</div>
                    <div className="text-gray-500 text-xs">In slechts 7 dagen</div>
                  </div>
                </div>
              </motion.div>

              {/* Speed badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute top-1/2 -right-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-3 py-1.5 shadow-lg"
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Supersnel</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
