import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Check, Globe } from 'lucide-react'

type ContactModalProps = {
  isOpen: boolean
  onClose: () => void
  domain: string
}

export default function ContactModal({ isOpen, onClose, domain }: ContactModalProps) {
  const { t } = useTranslation()
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
      setError(t('contactModal.emailRequired'))
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
        throw new Error(t('contactModal.sendFailed'))
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(t('contactModal.errorGeneric'))
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', duration: 0.4, damping: 25 }}
            className="relative w-full sm:max-w-md bg-white dark:bg-gray-800 border-t sm:border border-gray-100 dark:border-gray-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
            
            {/* Header */}
            <div className="relative p-4 sm:p-6 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={t('contactModal.close')}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{t('contactModal.title')}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{t('contactModal.aboutDomain')}: <span className="text-primary-600 dark:text-primary-400 font-medium">{domain}</span></p>
                </div>
              </div>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="p-6 sm:p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h4 className="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl mb-2">{t('contactModal.success.title')}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {t('contactModal.success.message')}
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 pb-safe">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {t('contactModal.description')}
                </p>

                {/* Email (required) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('contactModal.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('contactModal.emailPlaceholder')}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Name (optional) */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('contactModal.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('contactModal.namePlaceholder')}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('contactModal.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('contactModal.phonePlaceholder')}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                </div>

                {/* Message (optional) */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('contactModal.message')} <span className="text-gray-400">({t('contactModal.optional')})</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('contactModal.messagePlaceholder')}
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
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
                      {t('contactModal.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contactModal.submit')}
                    </>
                  )}
                </button>

                <p className="text-gray-400 text-xs text-center">
                  {t('contactModal.privacy')}
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
