import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Check, Globe } from 'lucide-react'

type ContactModalProps = {
  isOpen: boolean
  onClose: () => void
  domain: string
}

export default function ContactModal({ isOpen, onClose, domain }: ContactModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Vul je e-mailadres in')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Stuur email via FormSubmit (gratis email service)
      const response = await fetch('https://formsubmit.co/ajax/info@webstability.nl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nieuwe aanvraag: ${domain}`,
          domain: domain,
          naam: name || 'Niet ingevuld',
          email: email,
          telefoon: phone || 'Niet ingevuld',
          bericht: message || 'Geen extra bericht',
          _template: 'table'
        })
      })

      if (response.ok) {
        setIsSuccess(true)
        // Reset form na 3 seconden en sluit modal
        setTimeout(() => {
          setIsSuccess(false)
          setEmail('')
          setName('')
          setPhone('')
          setMessage('')
          onClose()
        }, 3000)
      } else {
        throw new Error('Verzenden mislukt')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setError('Er ging iets mis. Probeer het opnieuw of mail direct naar info@webstability.nl')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-gray-100">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg">Contact opnemen</h3>
                  <p className="text-gray-500 text-sm">Over domein: <span className="text-primary-600 font-medium">{domain}</span></p>
                </div>
              </div>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h4 className="text-gray-900 font-semibold text-xl mb-2">Bedankt!</h4>
                <p className="text-gray-600">
                  We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op.
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-gray-600 text-sm mb-4">
                  Laat je gegevens achter en wij nemen binnen 24 uur contact met je op over dit domein.
                </p>

                {/* Email (required) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    E-mailadres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="je@email.nl"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Name (optional) */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Naam
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Je naam"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Telefoonnummer
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06-12345678"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Message (optional) */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bericht <span className="text-gray-400">(optioneel)</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Vertel ons meer over je project..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Versturen...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Verstuur aanvraag
                    </>
                  )}
                </button>

                <p className="text-gray-400 text-xs text-center">
                  We delen je gegevens nooit met derden.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
