/**
 * FloatingChat Component
 * 
 * Een floating chat widget die overal op de site zichtbaar is.
 * - Links onderaan de pagina
 * - Snelle polling voor real-time berichten
 * - Namen voor developer (Webstability Team) en klant
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  User,
  Sparkles
} from 'lucide-react'

interface ChatMessage {
  id: string
  date: string
  from: 'client' | 'developer'
  message: string
  read?: boolean
  senderName?: string
}

interface FloatingChatProps {
  projectId?: string
  customerName?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'client' | 'homepage'
}

// Polling interval - 3 seconds for real-time feel
const POLL_INTERVAL = 3000

export default function FloatingChat({ 
  projectId, 
  customerName = 'Jij',
  isOpen: controlledIsOpen,
  onOpenChange,
  variant = 'client'
}: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastMessageCountRef = useRef(0)

  // Use controlled state if provided
  const chatIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen
  const setChatIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpen(open)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatIsOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, chatIsOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (chatIsOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [chatIsOpen])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!projectId) return
    
    try {
      const response = await fetch(`/api/project/${projectId}/messages`)
      if (response.ok) {
        const data = await response.json()
        const newMessages = data.messages || []
        setMessages(newMessages)
        
        // Count unread messages from developer
        const unread = newMessages.filter(
          (m: ChatMessage) => m.from === 'developer' && !m.read
        ).length
        setUnreadCount(unread)
        
        // Clear unread when chat is open
        if (chatIsOpen && unread > 0) {
          // Mark as read
          fetch(`/api/project/${projectId}/messages/read`, { method: 'POST' })
          setUnreadCount(0)
        }
        
        lastMessageCountRef.current = newMessages.length
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    }
  }, [projectId, chatIsOpen])

  // Initial fetch and polling
  useEffect(() => {
    if (projectId) {
      fetchMessages()
      
      // Poll for new messages
      const interval = setInterval(fetchMessages, POLL_INTERVAL)
      return () => clearInterval(interval)
    }
  }, [projectId, fetchMessages])

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending || !projectId) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    // Optimistic update
    const optimisticMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      date: new Date().toISOString(),
      from: 'client',
      message: messageText,
      senderName: customerName
    }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      const response = await fetch(`/api/project/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText, 
          from: 'client',
          senderName: customerName
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Replace optimistic message with real one
        setMessages(prev => 
          prev.map(m => m.id === optimisticMsg.id ? data.message : m)
        )
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
      setNewMessage(messageText) // Restore message
    } finally {
      setSending(false)
    }
  }

  // Format time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' ' +
           date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  }

  // Get sender display name
  const getSenderName = (msg: ChatMessage) => {
    if (msg.from === 'developer') {
      return msg.senderName || 'Webstability Team'
    }
    return msg.senderName || customerName
  }

  return (
    <>
      {/* Floating Button - Fixed left bottom */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        onClick={() => setChatIsOpen(true)}
        className={`fixed left-6 bottom-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${
          chatIsOpen ? 'opacity-0 pointer-events-none' : ''
        } ${
          variant === 'homepage' 
            ? 'bg-gradient-to-br from-primary-500 to-blue-600' 
            : 'bg-gradient-to-br from-emerald-500 to-teal-600'
        }`}
      >
        <MessageSquare className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatIsOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-6 bottom-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className={`p-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-3 ${
              variant === 'homepage'
                ? 'bg-gradient-to-r from-primary-500 to-blue-600'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600'
            }`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Chat met ons</h3>
                <p className="text-xs text-white/70">Meestal binnen 5 min antwoord</p>
              </div>
              <button
                onClick={() => setChatIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
              {!projectId ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center px-4">
                  <Sparkles className="w-10 h-10 mb-3 text-primary-400" />
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Welkom!</p>
                  <p className="text-sm">Start een project om te kunnen chatten met onze designers.</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center">
                  <MessageSquare className="w-10 h-10 mb-3 opacity-50" />
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Start het gesprek</p>
                  <p className="text-sm">Stel je vraag en we antwoorden zo snel mogelijk!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.from === 'client' ? 'order-2' : ''}`}>
                      {/* Sender name */}
                      <div className={`text-xs mb-1 ${
                        msg.from === 'client' ? 'text-right text-emerald-600 dark:text-emerald-400' : 'text-left text-blue-600 dark:text-blue-400'
                      }`}>
                        {msg.from === 'developer' && (
                          <span className="inline-flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {getSenderName(msg)}
                          </span>
                        )}
                        {msg.from === 'client' && getSenderName(msg)}
                      </div>
                      
                      {/* Message bubble */}
                      <div className={`
                        rounded-2xl px-4 py-2.5 text-sm
                        ${msg.from === 'client' 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm' 
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-200 dark:border-white/10 shadow-sm'}
                      `}>
                        {msg.message}
                      </div>
                      
                      {/* Time */}
                      <div className={`text-xs mt-1 text-gray-400 dark:text-gray-500 ${
                        msg.from === 'client' ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(msg.date)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {projectId && (
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Typ je bericht..."
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className={`px-4 rounded-xl font-medium transition flex items-center justify-center ${
                      variant === 'homepage'
                        ? 'bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50'
                        : 'bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50'
                    } text-white disabled:cursor-not-allowed`}
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
