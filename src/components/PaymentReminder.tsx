import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock,
  Calendar,
  Bell,
  MessageSquare
} from 'lucide-react'

interface PaymentReminderProps {
  projectId: string
  businessName: string
  contactEmail: string
  contactName: string
  packageType: string
  lastReminderSent?: string
  reminderCount?: number
  paymentUrl?: string
  onReminderSent?: () => void
}

export default function PaymentReminder({
  projectId,
  businessName,
  contactEmail,
  contactName,
  packageType,
  lastReminderSent,
  reminderCount = 0,
  paymentUrl,
  onReminderSent
}: PaymentReminderProps) {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<'friendly' | 'urgent' | 'final'>('friendly')

  const templates = {
    friendly: {
      name: 'Vriendelijke herinnering',
      description: 'Een zachte reminder dat de betaling nog openstaat',
      subject: `Herinnering: Je website wacht op je, ${contactName}!`,
      icon: Bell,
      color: 'blue'
    },
    urgent: {
      name: 'Dringende herinnering',
      description: 'Benadrukt dat actie nodig is',
      subject: `Actie vereist: Betaling voor ${businessName}`,
      icon: Clock,
      color: 'amber'
    },
    final: {
      name: 'Laatste herinnering',
      description: 'Laatste kans voordat we het project pauzeren',
      subject: `Laatste herinnering: Website ${businessName}`,
      icon: AlertCircle,
      color: 'red'
    }
  }

  const sendReminder = async () => {
    setSending(true)
    setError('')

    try {
      const response = await fetch('/api/deadline-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: 'payment',
          template: selectedTemplate,
          recipientEmail: contactEmail,
          recipientName: contactName,
          businessName,
          packageType,
          paymentUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        setSent(true)
        onReminderSent?.()
        // Reset after 3 seconds
        setTimeout(() => setSent(false), 3000)
      } else {
        setError(data.error || t('errors.api.sendReminderFailed'))
      }
    } catch (err) {
      console.error('Reminder error:', err)
      setError(t('errors.api.sendFailed'))
    }

    setSending(false)
  }

  const getDaysSinceLastReminder = () => {
    if (!lastReminderSent) return null
    const days = Math.floor((Date.now() - new Date(lastReminderSent).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const daysSinceReminder = getDaysSinceLastReminder()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Betalingsherinnering versturen</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Stuur een email naar de klant</p>
        </div>
      </div>

      {/* Reminder history */}
      {(lastReminderSent || reminderCount > 0) && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>
                {reminderCount} herinnering{reminderCount !== 1 ? 'en' : ''} verstuurd
              </span>
            </div>
            {daysSinceReminder !== null && (
              <span className="text-gray-500 dark:text-gray-400">
                {daysSinceReminder === 0 ? 'Vandaag' : `${daysSinceReminder} dagen geleden`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Template selector */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Kies template:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(templates) as [keyof typeof templates, typeof templates.friendly][]).map(([key, template]) => {
            const Icon = template.icon
            const isSelected = selectedTemplate === key
            return (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `border-${template.color}-500 bg-${template.color}-50 dark:bg-${template.color}-900/20`
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${
                  isSelected ? `text-${template.color}-600` : 'text-gray-400'
                }`} />
                <p className={`text-xs font-medium ${
                  isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {template.name}
                </p>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {templates[selectedTemplate].description}
        </p>
      </div>

      {/* Preview */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
          <MessageSquare className="w-4 h-4" />
          <span className="font-medium">Preview:</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          Naar: {contactEmail}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Onderwerp: {templates[selectedTemplate].subject}
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Send button */}
      <motion.button
        onClick={sendReminder}
        disabled={sending || sent}
        whileHover={{ scale: sent ? 1 : 1.02 }}
        whileTap={{ scale: sent ? 1 : 0.98 }}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
          sent
            ? 'bg-green-500 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        } disabled:opacity-50`}
      >
        {sending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Versturen...
          </>
        ) : sent ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Verstuurd!
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Verstuur herinnering
          </>
        )}
      </motion.button>

      {/* Warning for multiple reminders */}
      {reminderCount >= 2 && (
        <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Er zijn al {reminderCount} herinneringen verstuurd. Overweeg telefonisch contact.
        </p>
      )}
    </div>
  )
}
