import { motion } from 'framer-motion'
import { Mail, Phone, MessageCircle, Clock, MapPin, Send } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Contact() {
  const navigate = useNavigate()
  const [formState, setFormState] = useState<'idle' | 'submitting'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')

    // FormSubmit.co integration
    try {
      await fetch('https://formsubmit.co/ajax/hallo@webstability.nl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          _subject: `Nieuw contactformulier van ${formData.name}`,
        }),
      })
      // Redirect naar bedankt pagina
      navigate('/bedankt')
    } catch {
      setFormState('idle')
      alert('Er ging iets mis. Probeer het opnieuw of mail direct naar hallo@webstability.nl')
    }
  }

  const whatsappLink = 'https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20een%20vraag%20over%20een%20website.'

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-100/40 via-primary-50/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4">
                Contact
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Laten we{' '}
                <span className="text-primary-600">praten</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Heb je een vraag of wil je een website laten maken? 
                Neem contact met ons op en we reageren binnen 24 uur.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Neem contact op
                </h2>

                {/* Contact Methods */}
                <div className="space-y-6 mb-12">
                  {/* Email */}
                  <a
                    href="mailto:hallo@webstability.nl"
                    className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                      <p className="text-primary-600 font-medium">hallo@webstability.nl</p>
                      <p className="text-sm text-gray-500 mt-1">We reageren binnen 24 uur</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                      <p className="text-green-600 font-medium">06 44712573</p>
                      <p className="text-sm text-gray-500 mt-1">Snelste manier om ons te bereiken</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+31644712573"
                    className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <Phone className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Telefoon</h3>
                      <p className="text-primary-600 font-medium">06 44712573</p>
                      <p className="text-sm text-gray-500 mt-1">Ma-Vr 9:00 - 18:00</p>
                    </div>
                  </a>
                </div>

                {/* Extra Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span>Reactie binnen 24 uur</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span>Gevestigd in Nederland</span>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl shadow-gray-100/50">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Stuur een bericht
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Vul het formulier in en we nemen zo snel mogelijk contact met je op.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Naam *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        placeholder="Je naam"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                              placeholder="je@email.nl"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                              Telefoon
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                              placeholder="06 12345678"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Bericht *
                          </label>
                          <textarea
                            id="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                            placeholder="Vertel ons over je project of stel je vraag..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={formState === 'submitting'}
                          className="w-full py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {formState === 'submitting' ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Versturen...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              <span>Verstuur bericht</span>
                            </>
                          )}
                        </button>
                      </form>
                </div>

                {/* WhatsApp CTA */}
                <div className="mt-6 p-6 bg-green-50 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Liever direct chatten?</h3>
                      <p className="text-sm text-gray-600">Stuur ons een WhatsApp bericht</p>
                    </div>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Veelgestelde vragen
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Hoe snel reageren jullie?',
                  a: 'We reageren altijd binnen 24 uur op werkdagen. Via WhatsApp zijn we vaak nog sneller!',
                },
                {
                  q: 'Kan ik een vrijblijvend gesprek inplannen?',
                  a: 'Ja, natuurlijk! Stuur ons een bericht en we plannen een gratis kennismakingsgesprek in.',
                },
                {
                  q: 'Wat kost een website?',
                  a: 'Onze website abonnementen starten vanaf €79/maand. Kijk op onze prijzenpagina voor alle details.',
                },
                {
                  q: 'Waar zijn jullie gevestigd?',
                  a: 'We zijn gevestigd in Nederland en werken volledig remote. We kunnen dus voor klanten door heel Nederland werken.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
