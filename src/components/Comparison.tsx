import { motion } from 'framer-motion'
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react'

// Floating particles for visual appeal
function FloatingParticles() {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 8 },
    { size: 6, x: '85%', y: '15%', delay: 1.5, duration: 10 },
    { size: 3, x: '20%', y: '80%', delay: 0.8, duration: 9 },
    { size: 5, x: '90%', y: '70%', delay: 2.2, duration: 11 },
    { size: 4, x: '5%', y: '50%', delay: 1, duration: 7 },
    { size: 3, x: '75%', y: '85%', delay: 0.5, duration: 8.5 },
    { size: 5, x: '50%', y: '10%', delay: 1.8, duration: 9.5 },
    { size: 4, x: '95%', y: '40%', delay: 2.5, duration: 10 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary-400 to-primary-600"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const comparisons: {
  aspect: string
  webstability: string | { type: 'check' | 'cross' | 'question'; note?: string }
  traditional: string | { type: 'check' | 'cross' | 'question'; note?: string }
  diy: string | { type: 'check' | 'cross' | 'question'; note?: string }
}[] = [
  {
    aspect: 'Maandelijkse kosten',
    webstability: 'Vanaf €96/maand',
    traditional: '€200-500/maand',
    diy: '€0-50/maand',
  },
  {
    aspect: 'Opstartkosten',
    webstability: 'Vanaf €120 eenmalig',
    traditional: '€2.000-10.000+',
    diy: '€0-100',
  },
  {
    aspect: 'Professioneel design',
    webstability: { type: 'check', note: 'Op maat gemaakt' },
    traditional: { type: 'check', note: 'Op maat gemaakt' },
    diy: { type: 'cross', note: 'Templates' },
  },
  {
    aspect: 'Technisch onderhoud',
    webstability: { type: 'check', note: 'Volledig verzorgd' },
    traditional: { type: 'question', note: 'Vaak extra kosten' },
    diy: { type: 'cross', note: 'Zelf doen' },
  },
  {
    aspect: 'Wijzigingen doorvoeren',
    webstability: { type: 'check', note: 'Wij regelen het' },
    traditional: '€50-150/uur',
    diy: { type: 'cross', note: 'Zelf leren' },
  },
  {
    aspect: 'Support & hulp',
    webstability: { type: 'check', note: 'Persoonlijk contact' },
    traditional: { type: 'question', note: 'Beperkt inbegrepen' },
    diy: { type: 'cross', note: 'Forums/documentatie' },
  },
  {
    aspect: 'Flexibiliteit',
    webstability: { type: 'check', note: 'Maandelijks opzegbaar' },
    traditional: { type: 'cross', note: 'Je zit eraan vast' },
    diy: { type: 'check', note: 'Flexibel' },
  },
  {
    aspect: 'Tijdsinvestering jij',
    webstability: '~2 uur intake',
    traditional: '~10-20 uur meetings',
    diy: '50-200+ uur',
  },
]

type CellValue = string | { type: 'check' | 'cross' | 'question'; note?: string }

function renderCell(value: CellValue, isWebstability = false) {
  if (typeof value === 'object') {
    return (
      <div className="flex items-center gap-1.5 justify-center">
        {value.type === 'check' && <Check className={`w-4 h-4 ${isWebstability ? 'text-green-600' : 'text-gray-400'}`} />}
        {value.type === 'cross' && <X className="w-4 h-4 text-red-400" />}
        {value.type === 'question' && <HelpCircle className="w-4 h-4 text-amber-500" />}
        {value.note && (
          <span className={`text-sm ${isWebstability && value.type === 'check' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
            {value.note}
          </span>
        )}
      </div>
    )
  }
  return (
    <span className={`text-sm ${isWebstability ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
      {value}
    </span>
  )
}

export default function Comparison() {
  return (
    <section id="comparison" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-100/40 to-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-blue-100/30 to-primary-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-50/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Bespaar{' '}
            <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              duizenden euro's
            </span>{' '}
            én tijd
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-base lg:text-lg"
          >
            Een traditioneel webbureau vraagt €3.000+ en weken werk. Zelf bouwen kost je eindeloos veel tijd.
          </motion.p>
        </div>

        {/* Desktop Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 lg:p-5 text-gray-500 font-medium text-sm">Aspect</th>
                  <th className="p-4 lg:p-5 text-center bg-gradient-to-b from-primary-50 to-primary-100/50 border-x border-primary-200/50">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-gray-900 text-base">webstability</span>
                      <span className="text-xs text-primary-600 font-medium flex items-center gap-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                        Beste keuze
                      </span>
                    </div>
                  </th>
                  <th className="p-4 lg:p-5 text-center">
                    <span className="font-bold text-gray-900">Webbureau</span>
                    <p className="text-xs text-gray-500 mt-0.5 hidden lg:block">Freelancer of agency</p>
                  </th>
                  <th className="p-4 lg:p-5 text-center">
                    <span className="font-bold text-gray-900">Zelf maken</span>
                    <p className="text-xs text-gray-500 mt-0.5 hidden lg:block">Wix, Squarespace, etc.</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <tr 
                    key={row.aspect} 
                    className={`${index % 2 === 0 ? 'bg-gray-50/30' : ''} hover:bg-gray-50/70 transition-colors`}
                  >
                    <td className="p-4 text-gray-700 font-medium text-sm">{row.aspect}</td>
                    <td className="p-4 text-center bg-gradient-to-b from-primary-50/40 to-primary-50/20 border-x border-primary-100/30">
                      <div className="flex justify-center">{renderCell(row.webstability, true)}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">{renderCell(row.traditional)}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">{renderCell(row.diy)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA Row */}
          <div className="border-t border-gray-200/80 p-6 lg:p-8 bg-gradient-to-r from-primary-50 via-white to-blue-50 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-primary-200 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-tl from-blue-200 to-transparent rounded-full blur-2xl" />
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left: Value proposition */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white">€</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center ring-2 ring-white">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Bespaar gemiddeld €2.500+</p>
                  <p className="text-sm text-gray-500">Vergeleken met een traditioneel webbureau</p>
                </div>
              </div>

              {/* Center: CTA */}
              <div className="flex flex-col items-center gap-2">
                <a
                  href="/start"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  <span>Start je project</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Geen verplichtingen
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Maandelijks opzegbaar
                  </span>
                </div>
              </div>

              {/* Right: Social proof hint */}
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-2 ring-white flex items-center justify-center text-white text-xs font-medium"
                      style={{ 
                        backgroundImage: `linear-gradient(135deg, hsl(${200 + i * 30}, 70%, 60%), hsl(${220 + i * 30}, 70%, 50%))` 
                      }}
                    >
                      {['L', 'M', 'S', 'K'][i]}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">50+ ondernemers</p>
                  <p className="text-gray-500 text-xs">gingen je al voor</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
