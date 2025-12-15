import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  MessageSquare,
  Loader2,
  Check,
  CheckCheck,
  Clock,
  User,
  Headphones
} from 'lucide-react'

export interface ChatMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read: boolean
}

interface ChatModuleProps {
  projectId: string
  messages: ChatMessage[]
  onSendMessage: (message: string) => Promise<void>
  phaseColor?: string
}

export default function ChatModule({ 
  projectId: _projectId, 
  messages, 
  onSendMessage,
  phaseColor = 'bg-primary-600'
}: ChatModuleProps) {
  // projectId is used by parent component for API calls
  void _projectId
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    try {
      await onSendMessage(newMessage.trim())
      setNewMessage('')
      inputRef.current?.focus()
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = messages.filter(m => !m.read && m.from === 'developer').length

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Vandaag'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Gisteren'
    } else {
      return date.toLocaleDateString('nl-NL', { 
        day: 'numeric', 
        month: 'long' 
      })
    }
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = []
  let currentDate = ''
  
  messages.forEach(msg => {
    const msgDate = new Date(msg.date).toDateString()
    if (msgDate !== currentDate) {
      currentDate = msgDate
      groupedMessages.push({ date: msg.date, messages: [msg] })
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg)
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[500px]"
    >
      {/* Header */}
      <div className={`${phaseColor} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Direct Contact</h3>
              <p className="text-sm text-white/80">Chat met je developer</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
              {unreadCount} nieuw
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="font-medium text-gray-600">Nog geen berichten</p>
            <p className="text-sm text-center mt-1">
              Stel je vraag en we reageren<br />zo snel mogelijk!
            </p>
          </div>
        ) : (
          <>
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm border border-gray-100">
                    {formatDate(group.date)}
                  </span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {group.messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2 max-w-[85%] ${msg.from === 'client' ? 'flex-row-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.from === 'client' 
                              ? 'bg-primary-100' 
                              : 'bg-gradient-to-br from-purple-500 to-blue-500'
                          }`}>
                            {msg.from === 'client' ? (
                              <User className="w-4 h-4 text-primary-600" />
                            ) : (
                              <Headphones className="w-4 h-4 text-white" />
                            )}
                          </div>

                          {/* Message bubble */}
                          <div className={`rounded-2xl p-4 ${
                            msg.from === 'client'
                              ? `${phaseColor} text-white rounded-br-md`
                              : 'bg-white text-gray-900 shadow-md border border-gray-100 rounded-bl-md'
                          }`}>
                            {msg.from === 'developer' && (
                              <p className="text-xs font-semibold text-purple-600 mb-1">
                                Team Webstability
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            <div className={`flex items-center justify-end gap-1 mt-2 ${
                              msg.from === 'client' ? 'text-white/60' : 'text-gray-400'
                            }`}>
                              <span className="text-xs">{formatTime(msg.date)}</span>
                              {msg.from === 'client' && (
                                msg.read ? (
                                  <CheckCheck className="w-3 h-3" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Typ je vraag of opmerking..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            disabled={loading}
          />
          <motion.button
            type="submit"
            disabled={loading || !newMessage.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-3 ${phaseColor} hover:opacity-90 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            Gemiddelde reactietijd: binnen 4 uur op werkdagen
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Online</span>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
