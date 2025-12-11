import { motion } from 'framer-motion'
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Prijzen', href: '/#pricing' },
    { label: 'Hoe het werkt', href: '/#how-it-works' },
    { label: 'Webshop', href: '/webshop' },
    { label: 'FAQ', href: '/#faq' },
  ],
  bedrijf: [
    { label: 'Over ons', href: '/over-ons' },
    { label: 'Kennisbank', href: '/kennisbank' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Algemene voorwaarden', href: '/voorwaarden' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-16 lg:py-20 border-b border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Klaar om te beginnen?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg mb-8"
            >
              Start vandaag nog met je professionele website. 
              Eenmalige opstartkosten vanaf €99, geen verplichtingen.
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 group"
              >
                Start je project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-all border border-gray-200"
              >
                Neem contact op
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Main footer */}
        <div className="py-12 lg:py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="font-display font-bold text-xl text-gray-900 tracking-tight">
                webstability
              </span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-sm">
              Professionele websites voor ondernemers. 
              Geen gedoe, gewoon een mooie website die werkt.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3 text-sm text-gray-600">
              <a href="mailto:info@webstability.nl" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                <Mail className="w-4 h-4" />
                info@webstability.nl
              </a>
              <a href="tel:+31644712573" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                <Phone className="w-4 h-4" />
                06 44712573
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Nederland</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Bedrijf</h4>
            <ul className="space-y-3">
              {footerLinks.bedrijf.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-500">
              <span>© {new Date().getFullYear()} Webstability</span>
              <span className="hidden sm:inline">•</span>
              <span>Made with ❤️ by Webstability</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
              <span>KVK: 91186307</span>
              <span>•</span>
              <span>BTW: NL004875371B72</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
