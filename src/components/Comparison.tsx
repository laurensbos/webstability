import { motion } from 'framer-motion'
import { Check, X, Zap, Rocket, CreditCard, Shield, Heart } from 'lucide-react'

const comparisons = [
  {
    feature: 'Opstartkosten',
    webstability: { value: 'Vanaf €99', highlight: true },
    traditional: '€1.500 - €5.000+',
    diy: '€0 - €500',
  },
  {
    feature: 'Maandelijkse kosten',
    webstability: { value: 'Vanaf €79', highlight: true },
    traditional: '€50 - €200 hosting',
    diy: '€10 - €50',
  },
  {
    feature: 'Tijd tot live',
    webstability: { value: '7 dagen', highlight: true },
    traditional: '4-12 weken',
    diy: 'Weken/maanden',
  },
  {
    feature: 'Professioneel ontwerp',
    webstability: { value: true, highlight: true },
    traditional: true,
    diy: false,
  },
  {
    feature: 'Hosting inbegrepen',
    webstability: { value: true, highlight: true },
    traditional: false,
    diy: false,
  },
  {
    feature: 'SSL & beveiliging',
    webstability: { value: true, highlight: true },
    traditional: 'Extra kosten',
    diy: 'Zelf regelen',
  },
  {
    feature: 'Maandelijkse updates',
    webstability: { value: true, highlight: true },
    traditional: 'Uurtarief €75-150',
    diy: 'Zelf doen',
  },
  {
    feature: 'SEO geoptimaliseerd',
    webstability: { value: true, highlight: true },
    traditional: 'Extra kosten',
    diy: false,
  },
  {
    feature: 'Technische kennis nodig',
    webstability: { value: false, highlight: true },
    traditional: false,
    diy: true,
  },
  {
    feature: 'Persoonlijke support',
    webstability: { value: true, highlight: true },
    traditional: 'Beperkt',
    diy: false,
  },
]

function renderValue(value: boolean | string | { value: boolean | string; highlight: boolean }) {
  const actualValue = typeof value === 'object' ? value.value : value
  const isHighlight = typeof value === 'object' ? value.highlight : false

  if (typeof actualValue === 'boolean') {
    return actualValue ? (
      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isHighlight ? 'bg-green-100' : 'bg-green-50'}`}>
        <Check className={`w-4 h-4 ${isHighlight ? 'text-green-600' : 'text-green-500'}`} />
      </div>
    ) : (
      <div className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center">
        <X className="w-4 h-4 text-red-400" />
      </div>
    )
  }

  return (
    <span className={`text-sm ${isHighlight ? 'font-semibold text-primary-600' : 'text-gray-500'}`}>
      {actualValue}
    </span>
  )
}

export default function Comparison() {
  return (
    <section id="comparison" className="py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4"
          >
            Waarom Webstability
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            De slimme keuze voor je website
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base lg:text-lg"
          >
            Vergelijk Webstability met traditionele webdesigners en doe-het-zelf bouwers
          </motion.p>
        </div>

        {/* Mobile Comparison Cards */}
        <div className="lg:hidden space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border-2 border-primary-500 shadow-lg shadow-primary-500/10 p-5 relative"
          >
            <div className="absolute -top-3 left-4">
              <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> Aanbevolen
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 mt-2">Webstability</h3>
            <div className="space-y-3">
              {comparisons.slice(0, 6).map((row) => (
                <div key={row.feature} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600 text-sm">{row.feature}</span>
                  <div className="flex items-center">{renderValue(row.webstability)}</div>
                </div>
              ))}
            </div>
            <a
              href="/start"
              className="mt-4 block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white text-center font-semibold rounded-xl transition-all"
            >
              Start je project
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Webdesign bureau</h3>
            <div className="space-y-3">
              {comparisons.slice(0, 6).map((row) => (
                <div key={row.feature} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600 text-sm">{row.feature}</span>
                  <div className="flex items-center">{renderValue(row.traditional)}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Zelf bouwen (Wix, etc.)</h3>
            <div className="space-y-3">
              {comparisons.slice(0, 6).map((row) => (
                <div key={row.feature} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600 text-sm">{row.feature}</span>
                  <div className="flex items-center">{renderValue(row.diy)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Desktop Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-5 text-gray-500 font-semibold w-1/4"></th>
                  <th className="p-5 text-center bg-primary-50 border-x border-primary-100">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900 text-lg">Webstability</span>
                      <span className="text-xs text-primary-600 font-medium mt-1">✓ Aanbevolen</span>
                    </div>
                  </th>
                  <th className="p-5 text-center">
                    <span className="font-bold text-gray-900 text-lg">Webdesign bureau</span>
                    <p className="text-xs text-gray-500 mt-1">Freelancer of agency</p>
                  </th>
                  <th className="p-5 text-center">
                    <span className="font-bold text-gray-900 text-lg">Zelf bouwen</span>
                    <p className="text-xs text-gray-500 mt-1">Wix, Squarespace, etc.</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <tr key={row.feature} className={`${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                    <td className="p-4 text-gray-800 font-medium text-sm">{row.feature}</td>
                    <td className="p-4 text-center bg-primary-50/30 border-x border-primary-100/50">
                      <div className="flex justify-center">{renderValue(row.webstability)}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">{renderValue(row.traditional)}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">{renderValue(row.diy)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA Row */}
          <div className="border-t border-gray-100 p-5 bg-gray-50/50">
            <div className="grid grid-cols-4 gap-4">
              <div></div>
              <div className="text-center">
                <a
                  href="/start"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                >
                  Start je project
                </a>
              </div>
              <div className="text-center flex items-center justify-center">
                <span className="text-gray-500 text-sm">Gemiddeld €3.000+ investering</span>
              </div>
              <div className="text-center flex items-center justify-center">
                <span className="text-gray-500 text-sm">Uren/dagen werk nodig</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
        >
          {[
            { icon: Rocket, title: '7 dagen', subtitle: 'Tot live website', color: 'bg-blue-100 text-blue-600' },
            { icon: CreditCard, title: '€99', subtitle: 'Eenmalige opstart', color: 'bg-green-100 text-green-600' },
            { icon: Shield, title: '99.9%', subtitle: 'Uptime garantie', color: 'bg-primary-100 text-primary-600' },
            { icon: Heart, title: '150+', subtitle: 'Tevreden klanten', color: 'bg-pink-100 text-pink-600' },
          ].map((stat) => (
            <div key={stat.title} className="text-center p-4 lg:p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-3`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900">{stat.title}</div>
              <div className="text-gray-500 text-xs lg:text-sm">{stat.subtitle}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
