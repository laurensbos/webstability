import { useState, useEffect, createContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Search,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MoreVertical,
  Filter,
  Download,
  User,
  Globe,
  ChevronDown,
  X,
  TrendingUp,
  Users,
  MessageSquare,
  Moon,
  Sun,
  HelpCircle,
  BookOpen,
  Lightbulb,
  MousePointer,
  ArrowRight
} from 'lucide-react'

// Dark Mode Context
const DarkModeContext = createContext<{
  darkMode: boolean
  toggleDarkMode: () => void
}>({ darkMode: false, toggleDarkMode: () => {} })

// Types
interface EmailHistoryItem {
  id: string
  subject: string
  templateName?: string
  sentAt: string
}

interface NoteItem {
  id: string
  text: string
  createdAt: string
}

interface Lead {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  website?: string
  address: string
  city: string
  notes: string
  status: 'nieuw' | 'gecontacteerd' | 'geinteresseerd' | 'offerte' | 'klant' | 'afgewezen'
  priority: boolean
  createdAt: string
  lastContact?: string
  emailsSent: number
  // Nieuwe velden
  emailHistory: EmailHistoryItem[]
  notesTimeline: NoteItem[]
  followUpDate?: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  description: string
}

// Email templates
const emailTemplates: EmailTemplate[] = [
  {
    id: 'intro',
    name: 'Eerste kennismaking',
    subject: 'Professionele website voor {{bedrijf}}?',
    description: 'Eerste contact met bedrijf zonder website',
    body: `Beste {{naam}},

Ik zag dat {{bedrijf}} nog geen website heeft en dat is zonde! In 2024 zoekt 87% van de consumenten online voordat ze een aankoop doen.

Bij Webstability helpen we ondernemers zoals u aan een professionele website, zonder gedoe:

✓ Volledig verzorgd - wij regelen alles
✓ Vanaf €29 per maand - geen grote investering vooraf  
✓ Binnen 7 dagen online
✓ Inclusief hosting, SSL en updates

Zou u interesse hebben in een vrijblijvend gesprek? Ik kom graag langs voor een kop koffie.

Met vriendelijke groet,

{{afzender}}
Webstability
info@webstability.nl`
  },
  {
    id: 'geen-website',
    name: 'Geen website',
    subject: 'Een website voor {{bedrijf}} - makkelijker dan u denkt',
    description: 'Voor bedrijven zonder online aanwezigheid',
    body: `Beste {{naam}},

Ik reed laatst langs {{bedrijf}} in {{stad}} en vroeg me af: heeft u weleens overwogen om een website te laten maken?

Veel ondernemers denken dat een website duur en ingewikkeld is. Bij ons niet:

• Geen technische kennis nodig
• Wij schrijven de teksten
• Hosting en onderhoud inbegrepen
• Al vanaf €29 per maand

Meer dan 150 ondernemers gingen u voor. Zullen we eens vrijblijvend kennismaken?

Hartelijke groet,

{{afzender}}
Webstability`
  },
  {
    id: 'verouderd',
    name: 'Verouderde website',
    subject: 'Tijd voor een nieuwe website, {{bedrijf}}?',
    description: 'Voor bedrijven met oude/slechte website',
    body: `Beste {{naam}},

Ik bekeek de website van {{bedrijf}} en zag mogelijkheden voor verbetering. Een moderne, snelle website kan echt het verschil maken voor uw bedrijf.

Wat wij bieden:

✓ Modern, fris design
✓ Mobiel vriendelijk (85% zoekt op telefoon!)
✓ Sneller dan uw huidige site
✓ Beter vindbaar in Google
✓ Maandelijks aan te passen

Geen grote investering vooraf - wij werken met een abonnement vanaf €29/maand.

Interesse in een vrijblijvende website-scan? Ik laat zien wat er beter kan.

Met vriendelijke groet,

{{afzender}}
Webstability`
  },
  {
    id: 'followup',
    name: 'Follow-up',
    subject: 'Even opvolgen - website voor {{bedrijf}}',
    description: 'Na eerste contact geen reactie',
    body: `Beste {{naam}},

Vorige week stuurde ik u een bericht over een website voor {{bedrijf}}. Ik begrijp dat u het druk heeft, maar wilde toch even opvolgen.

Heeft u wellicht vragen? Of past een telefoontje beter?

U kunt mij bereiken op 06-12345678 of gewoon op deze mail reageren.

Vriendelijke groet,

{{afzender}}
Webstability`
  },
  {
    id: 'lokaal',
    name: 'Lokale benadering',
    subject: 'Collega-ondernemer uit {{stad}}',
    description: 'Nadruk op lokale samenwerking',
    body: `Beste {{naam}},

Als mede-ondernemer uit de regio {{stad}} wil ik graag even kennismaken.

Ik ben {{afzender}} van Webstability. Wij helpen lokale ondernemers aan professionele websites - zonder technisch gedoe en tegen een eerlijke prijs.

Waarom lokaal werken fijn is:
• Persoonlijk contact, geen callcenter
• We spreken dezelfde taal
• Snel even langskomen kan altijd
• We kennen de lokale markt

Zullen we eens afspreken? Koffie is van mij!

Hartelijke groet,

{{afzender}}
Webstability
Julianalaan 41, Kaag`
  },
  {
    id: 'actie',
    name: 'Actie/Aanbieding',
    subject: '🎄 Eindejaarsactie: gratis website-ontwerp voor {{bedrijf}}',
    description: 'Seizoensgebonden aanbieding',
    body: `Beste {{naam}},

Speciaal voor de feestdagen hebben wij een mooie actie:

🎁 GRATIS website-ontwerp (t.w.v. €199)

Dit betekent:
✓ Wij maken een ontwerp op maat
✓ Geen verplichtingen
✓ Bevalt het? Dan starten we
✓ Bevalt het niet? Geen kosten

Deze actie geldt nog tot en met 31 december.

Interesse? Reageer op deze mail of bel naar 06-12345678.

Fijne feestdagen alvast!

{{afzender}}
Webstability`
  }
]

const statusColors: Record<Lead['status'], { bg: string; text: string; label: string }> = {
  nieuw: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Nieuw' },
  gecontacteerd: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Gecontacteerd' },
  geinteresseerd: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Geïnteresseerd' },
  offerte: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Offerte verstuurd' },
  klant: { bg: 'bg-green-100', text: 'text-green-700', label: 'Klant!' },
  afgewezen: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Afgewezen' }
}

export default function MarketingDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('alle')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [sending, setSending] = useState(false)
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('webstability_darkmode')
    return saved === 'true'
  })
  
  // Help/Onboarding state
  const [showHelp, setShowHelp] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('webstability_onboarding_complete')
  })
  const [onboardingStep, setOnboardingStep] = useState(0)

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('webstability_darkmode', darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  // Sync status
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  // Sync leads to API (background)
  const syncToAPI = async (leadsToSync: Lead[]) => {
    try {
      setSyncStatus('syncing')
      
      // Sync each lead to the API
      for (const lead of leadsToSync) {
        await fetch('/api/leads', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        }).catch(() => {
          // If PUT fails (lead doesn't exist), try POST
          return fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead)
          })
        })
      }
      
      setSyncStatus('synced')
      setLastSyncTime(new Date().toLocaleTimeString('nl-NL'))
      localStorage.setItem('webstability_last_sync', new Date().toISOString())
    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus('error')
    }
  }

  // Load leads - first from localStorage, then try API
  useEffect(() => {
    const loadLeads = async () => {
      // Always load from localStorage first (instant)
      const saved = localStorage.getItem('webstability_leads')
      if (saved) {
        setLeads(JSON.parse(saved))
      }
      
      // Then try to fetch from API (background)
      try {
        const response = await fetch('/api/leads')
        if (response.ok) {
          const data = await response.json()
          if (data.leads && data.leads.length > 0) {
            // Merge API data with local data (local wins on conflicts)
            const localLeads = saved ? JSON.parse(saved) : []
            const localIds = new Set(localLeads.map((l: Lead) => l.id))
            
            // Add any leads from API that aren't in local storage
            const newLeads = data.leads.filter((l: Lead) => !localIds.has(l.id))
            if (newLeads.length > 0) {
              const merged = [...localLeads, ...newLeads]
              setLeads(merged)
              localStorage.setItem('webstability_leads', JSON.stringify(merged))
            }
            
            setSyncStatus('synced')
            setLastSyncTime(new Date().toLocaleTimeString('nl-NL'))
          }
        }
      } catch (error) {
        // API not available, continue with local data
        console.log('API not available, using local data')
      }
      
      // If no data at all, use demo data
      if (!saved) {
        setLeads([
        {
          id: '1',
          companyName: 'Bakkerij De Gouden Korrel',
          contactPerson: 'Jan Bakker',
          email: 'info@degoudenkorrel.nl',
          phone: '06-12345678',
          address: 'Dorpsstraat 15',
          city: 'Leiden',
          notes: 'Geen website, alleen Facebook pagina',
          status: 'nieuw',
          priority: true,
          createdAt: new Date().toISOString(),
          emailsSent: 0,
          emailHistory: [],
          notesTimeline: []
        },
        {
          id: '2',
          companyName: 'Schildersbedrijf Jansen',
          contactPerson: 'Piet Jansen',
          email: 'piet@jansenschilders.nl',
          phone: '06-98765432',
          website: 'www.jansenschilders.nl',
          address: 'Industrieweg 8',
          city: 'Alphen aan den Rijn',
          notes: 'Website uit 2015, niet mobiel vriendelijk',
          status: 'gecontacteerd',
          priority: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          lastContact: new Date(Date.now() - 3600000).toISOString(),
          emailsSent: 1,
          emailHistory: [
            {
              id: 'eh1',
              subject: 'Tijd voor een nieuwe website, Schildersbedrijf Jansen?',
              templateName: 'Verouderde website',
              sentAt: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          notesTimeline: [
            {
              id: 'n1',
              text: 'Website uit 2015, niet mobiel vriendelijk',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ],
          followUpDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
        }
      ])
      }
    }
    
    loadLeads()
  }, [])

  // Save leads to localStorage AND sync to API
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('webstability_leads', JSON.stringify(leads))
      // Debounce sync to API
      const timeout = setTimeout(() => {
        syncToAPI(leads)
      }, 2000) // Wait 2 seconds after last change
      return () => clearTimeout(timeout)
    }
  }, [leads])

  const today = new Date().toISOString().split('T')[0]

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesStatus = false
    if (statusFilter === 'alle') {
      matchesStatus = true
    } else if (statusFilter === 'followup') {
      matchesStatus = lead.followUpDate !== undefined && lead.followUpDate <= today
    } else {
      matchesStatus = lead.status === statusFilter
    }

    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    // Eerst follow-ups sorteren (te laat eerst, dan vandaag)
    const aFollowUp = a.followUpDate && a.followUpDate <= today
    const bFollowUp = b.followUpDate && b.followUpDate <= today
    if (aFollowUp && !bFollowUp) return -1
    if (!aFollowUp && bFollowUp) return 1
    
    // Dan priority
    if (a.priority && !b.priority) return -1
    if (!a.priority && b.priority) return 1
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const stats = {
    total: leads.length,
    nieuw: leads.filter(l => l.status === 'nieuw').length,
    gecontacteerd: leads.filter(l => l.status === 'gecontacteerd').length,
    geinteresseerd: leads.filter(l => l.status === 'geinteresseerd').length,
    offerte: leads.filter(l => l.status === 'offerte').length,
    klanten: leads.filter(l => l.status === 'klant').length,
    afgewezen: leads.filter(l => l.status === 'afgewezen').length,
    emailsSent: leads.reduce((sum, l) => sum + l.emailsSent, 0),
    followUpsToday: leads.filter(l => l.followUpDate === new Date().toISOString().split('T')[0]).length,
    followUpsOverdue: leads.filter(l => l.followUpDate && l.followUpDate < new Date().toISOString().split('T')[0]).length
  }

  // Conversie percentages
  const conversionRates = {
    contactToInterest: stats.gecontacteerd > 0 
      ? Math.round((stats.geinteresseerd / stats.gecontacteerd) * 100) 
      : 0,
    interestToQuote: stats.geinteresseerd > 0 
      ? Math.round((stats.offerte / stats.geinteresseerd) * 100) 
      : 0,
    quoteToCustomer: stats.offerte > 0 
      ? Math.round((stats.klanten / stats.offerte) * 100) 
      : 0,
    overallConversion: stats.total > 0 
      ? Math.round((stats.klanten / stats.total) * 100) 
      : 0
  }

  const openEmailModal = (lead: Lead, template?: EmailTemplate) => {
    setSelectedLead(lead)
    setSelectedTemplate(template || null)
    
    if (template) {
      const subject = template.subject
        .replace('{{bedrijf}}', lead.companyName)
        .replace('{{naam}}', lead.contactPerson)
        .replace('{{stad}}', lead.city)
      
      const body = template.body
        .replace(/{{bedrijf}}/g, lead.companyName)
        .replace(/{{naam}}/g, lead.contactPerson)
        .replace(/{{stad}}/g, lead.city)
        .replace(/{{afzender}}/g, 'Laurens')
      
      setEmailSubject(subject)
      setEmailBody(body)
    } else {
      setEmailSubject('')
      setEmailBody('')
    }
    
    setShowEmailModal(true)
  }

  const sendEmail = async () => {
    if (!selectedLead || !emailSubject || !emailBody) return
    
    setSending(true)
    
    try {
      const response = await fetch('/api/marketing/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedLead.email,
          subject: emailSubject,
          body: emailBody,
          leadId: selectedLead.id
        })
      })

      if (response.ok) {
        // Update lead met email history
        const newEmailHistoryItem: EmailHistoryItem = {
          id: Date.now().toString(),
          subject: emailSubject,
          templateName: selectedTemplate?.name,
          sentAt: new Date().toISOString()
        }

        setLeads(prev => prev.map(l => 
          l.id === selectedLead.id
            ? { 
                ...l, 
                status: l.status === 'nieuw' ? 'gecontacteerd' : l.status,
                emailsSent: l.emailsSent + 1,
                lastContact: new Date().toISOString(),
                emailHistory: [...(l.emailHistory || []), newEmailHistoryItem]
              }
            : l
        ))
        
        setShowEmailModal(false)
        setSelectedLead(null)
        alert('Email verstuurd!')
      } else {
        alert('Fout bij versturen email')
      }
    } catch (error) {
      console.error('Email error:', error)
      alert('Fout bij versturen email')
    } finally {
      setSending(false)
    }
  }

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, status } : l
    ))
  }

  const togglePriority = (leadId: string) => {
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, priority: !l.priority } : l
    ))
  }

  const addNote = (leadId: string, noteText: string) => {
    if (!noteText.trim()) return
    
    const newNote: NoteItem = {
      id: Date.now().toString(),
      text: noteText.trim(),
      createdAt: new Date().toISOString()
    }
    
    setLeads(prev => prev.map(l =>
      l.id === leadId
        ? { ...l, notesTimeline: [...(l.notesTimeline || []), newNote] }
        : l
    ))
  }

  const setFollowUpDate = (leadId: string, date: string | undefined) => {
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, followUpDate: date } : l
    ))
  }

  const deleteLead = (leadId: string) => {
    if (confirm('Weet je zeker dat je deze lead wilt verwijderen?')) {
      setLeads(prev => prev.filter(l => l.id !== leadId))
    }
  }

  const exportToCSV = () => {
    const headers = ['Bedrijf', 'Contact', 'Email', 'Telefoon', 'Stad', 'Status', 'Notities', 'Follow-up', 'Emails verstuurd']
    const rows = leads.map(l => [
      l.companyName,
      l.contactPerson,
      l.email,
      l.phone,
      l.city,
      statusColors[l.status].label,
      l.notes,
      l.followUpDate || '',
      l.emailsSent.toString()
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Onboarding Modal */}
        <AnimatePresence>
          {showOnboarding && (
            <OnboardingModal
              step={onboardingStep}
              onNext={() => {
                if (onboardingStep < 4) {
                  setOnboardingStep(onboardingStep + 1)
                } else {
                  localStorage.setItem('webstability_onboarding_complete', 'true')
                  setShowOnboarding(false)
                }
              }}
              onSkip={() => {
                localStorage.setItem('webstability_onboarding_complete', 'true')
                setShowOnboarding(false)
              }}
              darkMode={darkMode}
            />
          )}
        </AnimatePresence>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelp && (
            <HelpModal onClose={() => setShowHelp(false)} darkMode={darkMode} />
          )}
        </AnimatePresence>

        {/* Header */}
        <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
                >
                  <Target className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Marketing CRM</h1>
                  <div className="flex items-center gap-2">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lokale klanten werven</p>
                    {/* Sync Status Indicator */}
                    {syncStatus === 'syncing' && (
                      <span className="flex items-center gap-1 text-xs text-blue-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Syncing...
                      </span>
                    )}
                    {syncStatus === 'synced' && lastSyncTime && (
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        ✓ {lastSyncTime}
                      </span>
                    )}
                    {syncStatus === 'error' && (
                      <span className="text-xs text-red-500">⚠ Sync failed</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Help Button */}
                <Tooltip text="Hulp & Handleiding" darkMode={darkMode}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHelp(true)}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </motion.button>
                </Tooltip>

                {/* Dark Mode Toggle */}
                <Tooltip text={darkMode ? 'Lichte modus' : 'Donkere modus'} darkMode={darkMode}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.button>
                </Tooltip>

                {/* Export Button */}
                <Tooltip text="Exporteer naar CSV" darkMode={darkMode}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToCSV}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </motion.button>
                </Tooltip>

                {/* Add Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nieuw bedrijf</span>
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl p-4 sm:p-5 shadow-sm border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Building2 className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Leads</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl p-4 sm:p-5 shadow-sm border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                <MessageSquare className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.emailsSent}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emails</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl p-4 sm:p-5 shadow-sm border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <Users className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.gecontacteerd + stats.geinteresseerd}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>In gesprek</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl p-4 sm:p-5 shadow-sm border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.klanten}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Klanten</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl p-4 sm:p-5 shadow-sm border transition-colors ${
              stats.followUpsOverdue > 0 
                ? darkMode ? 'border-red-500/50 bg-red-500/10' : 'border-red-200 bg-red-50'
                : stats.followUpsToday > 0 
                  ? darkMode ? 'border-orange-500/50 bg-orange-500/10' : 'border-orange-200 bg-orange-50'
                  : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stats.followUpsOverdue > 0 
                  ? darkMode ? 'bg-red-500/20' : 'bg-red-100'
                  : stats.followUpsToday > 0 
                    ? darkMode ? 'bg-orange-500/20' : 'bg-orange-100'
                    : darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Clock className={`w-5 h-5 ${
                  stats.followUpsOverdue > 0 
                    ? darkMode ? 'text-red-400' : 'text-red-600'
                    : stats.followUpsToday > 0 
                      ? darkMode ? 'text-orange-400' : 'text-orange-600'
                      : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.followUpsToday + stats.followUpsOverdue}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stats.followUpsOverdue > 0 ? `${stats.followUpsOverdue} te laat!` : 'Follow-ups'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Conversie Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-xl p-4 sm:p-6 shadow-sm border mb-6 sm:mb-8 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
        >
          <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Conversie Funnel</h3>
          <div className="flex items-center justify-between gap-1 sm:gap-2 text-center overflow-x-auto">
            <div className="flex-1 min-w-[50px]">
              <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{stats.nieuw}</div>
              <div className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nieuw</div>
            </div>
            <div className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} hidden sm:block`}>→</div>
            <div className="flex-1 min-w-[50px]">
              <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{stats.gecontacteerd}</div>
              <div className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact</div>
            </div>
            <div className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} hidden sm:block`}>→</div>
            <div className="flex-1 min-w-[50px]">
              <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{stats.geinteresseerd}</div>
              <div className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interesse</div>
              {conversionRates.contactToInterest > 0 && (
                <div className={`text-[10px] sm:text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{conversionRates.contactToInterest}%</div>
              )}
            </div>
            <div className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} hidden sm:block`}>→</div>
            <div className="flex-1 min-w-[50px]">
              <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{stats.offerte}</div>
              <div className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Offerte</div>
              {conversionRates.interestToQuote > 0 && (
                <div className={`text-[10px] sm:text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{conversionRates.interestToQuote}%</div>
              )}
            </div>
            <div className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} hidden sm:block`}>→</div>
            <div className="flex-1 min-w-[50px]">
              <div className={`text-base sm:text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{stats.klanten}</div>
              <div className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Klant</div>
              {conversionRates.quoteToCustomer > 0 && (
                <div className={`text-[10px] sm:text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{conversionRates.quoteToCustomer}%</div>
              )}
            </div>
          </div>
          {stats.total > 0 && (
            <div className={`mt-4 pt-4 border-t text-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Totale conversie: <span className="font-bold text-emerald-500">{conversionRates.overallConversion}%</span>
                {stats.afgewezen > 0 && (
                  <span className={`ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>• {stats.afgewezen} afgewezen</span>
                )}
              </span>
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Zoek op bedrijf, contact of plaats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-colors ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500' 
                  : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
              } border`}
            />
          </div>
          
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`pl-10 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 appearance-none transition-colors ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500' 
                  : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
              } border`}
            >
              <option value="alle">Alle statussen</option>
              <option value="followup">📅 Follow-ups vandaag/te laat</option>
              <option value="nieuw">Nieuw</option>
              <option value="gecontacteerd">Gecontacteerd</option>
              <option value="geinteresseerd">Geïnteresseerd</option>
              <option value="offerte">Offerte verstuurd</option>
              <option value="klant">Klant</option>
              <option value="afgewezen">Afgewezen</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Leads List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
        >
          {filteredLeads.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <Building2 className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Geen leads gevonden</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4" />
                Eerste bedrijf toevoegen
              </motion.button>
            </div>
          ) : (
            <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {filteredLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LeadRow
                    lead={lead}
                    onEmail={(template) => openEmailModal(lead, template)}
                    onStatusChange={(status) => updateLeadStatus(lead.id, status)}
                    onTogglePriority={() => togglePriority(lead.id)}
                    onDelete={() => deleteLead(lead.id)}
                    onAddNote={(note) => addNote(lead.id, note)}
                    onSetFollowUp={(date) => setFollowUpDate(lead.id, date)}
                    templates={emailTemplates}
                    darkMode={darkMode}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(lead) => {
          setLeads(prev => [lead, ...prev])
          setShowAddModal(false)
        }}
      />

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Email versturen</h2>
                    <p className="text-sm text-gray-500">Naar: {selectedLead.email}</p>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Template selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kies een template
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {emailTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => openEmailModal(selectedLead, template)}
                        className={`p-3 text-left rounded-xl border transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <p className="font-medium text-sm text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-500 truncate">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Onderwerp
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Email onderwerp..."
                  />
                </div>

                {/* Body */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bericht
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                    placeholder="Typ je bericht..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuleren
                </button>
                <button
                  onClick={sendEmail}
                  disabled={sending || !emailSubject || !emailBody}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Versturen...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Verstuur email
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </DarkModeContext.Provider>
  )
}

// Lead Row Component
function LeadRow({ 
  lead, 
  onEmail, 
  onStatusChange, 
  onTogglePriority,
  onDelete,
  onAddNote,
  onSetFollowUp,
  templates,
  darkMode = false
}: { 
  lead: Lead
  onEmail: (template?: EmailTemplate) => void
  onStatusChange: (status: Lead['status']) => void
  onTogglePriority: () => void
  onDelete: () => void
  onAddNote: (note: string) => void
  onSetFollowUp: (date: string | undefined) => void
  templates: EmailTemplate[]
  darkMode?: boolean
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [newNote, setNewNote] = useState('')
  const status = statusColors[lead.status]

  const today = new Date().toISOString().split('T')[0]
  const isFollowUpOverdue = lead.followUpDate && lead.followUpDate < today
  const isFollowUpToday = lead.followUpDate === today

  return (
    <div className={`p-3 sm:p-4 transition-colors ${
      isFollowUpOverdue 
        ? darkMode ? 'bg-red-500/10' : 'bg-red-50/50'
        : isFollowUpToday 
          ? darkMode ? 'bg-orange-500/10' : 'bg-orange-50/50'
          : darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
    }`}>
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Priority star */}
        <button
          onClick={onTogglePriority}
          className={`mt-1 transition-colors ${lead.priority ? 'text-yellow-500' : darkMode ? 'text-gray-600 hover:text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
        >
          <Star className={`w-5 h-5 ${lead.priority ? 'fill-current' : ''}`} />
        </button>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{lead.companyName}</h3>
                {isFollowUpOverdue && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium whitespace-nowrap ${darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                    Follow-up te laat!
                  </span>
                )}
                {isFollowUpToday && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium whitespace-nowrap ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                    Vandaag opvolgen
                  </span>
                )}
              </div>
              <div className={`flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{lead.contactPerson}</span>
                  <span className="sm:hidden">{lead.contactPerson.split(' ')[0]}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {lead.city}
                </span>
                {lead.website && (
                  <a 
                    href={`https://${lead.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-600 hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
              {lead.notes && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-1">{lead.notes}</p>
              )}
            </div>

            {/* Status badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>

          {/* Actions row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              {lead.email}
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              {lead.phone}
            </a>
            
            {/* Details toggle button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors ${
                showDetails ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {lead.emailsSent > 0 && (
                <>
                  <Send className="w-3 h-3" />
                  {lead.emailsSent}x
                </>
              )}
              {lead.notesTimeline?.length > 0 && (
                <>
                  <MessageSquare className="w-3 h-3" />
                  {lead.notesTimeline.length}
                </>
              )}
              {!lead.emailsSent && !lead.notesTimeline?.length && 'Details'}
              <ChevronDown className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>

            {lead.followUpDate && (
              <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${isFollowUpOverdue ? 'bg-red-100 text-red-700' : isFollowUpToday ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                <Clock className="w-3 h-3" />
                {new Date(lead.followUpDate).toLocaleDateString('nl-NL')}
              </span>
            )}

            {lead.lastContact && !lead.followUpDate && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(lead.lastContact).toLocaleDateString('nl-NL')}
              </span>
            )}

            <div className="flex-1" />

            {/* Email button with dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTemplates(!showTemplates)
                  setShowMenu(false)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email sturen
                <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showTemplates && (
                  <>
                    {/* Backdrop to close on click outside */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowTemplates(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border z-20 max-h-80 overflow-y-auto ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                      }`}
                    >
                    <div className="p-2">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            onEmail(template)
                            setShowTemplates(false)
                          }}
                          className={`w-full p-3 text-left rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-emerald-50'
                          }`}
                        >
                          <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{template.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{template.description}</p>
                        </button>
                      ))}
                      <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                      <button
                        onClick={() => {
                          onEmail()
                          setShowTemplates(false)
                        }}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Leeg bericht</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Schrijf zelf een email</p>
                      </button>
                    </div>
                  </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* More menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                  setShowTemplates(false)
                }}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    {/* Backdrop to close on click outside */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-20 ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                      }`}
                    >
                    <div className="p-2">
                      <p className={`px-3 py-1 text-xs font-medium uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Status wijzigen</p>
                      {Object.entries(statusColors).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => {
                            onStatusChange(key as Lead['status'])
                            setShowMenu(false)
                          }}
                          className={`w-full flex items-center gap-2 p-2 text-left rounded-lg transition-colors ${
                            lead.status === key 
                              ? darkMode ? 'bg-gray-700' : 'bg-gray-50'
                              : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${value.bg.replace('100', '500')}`} />
                          <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{value.label}</span>
                          {lead.status === key && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />}
                        </button>
                      ))}
                      <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                      <button
                        onClick={() => {
                          onDelete()
                          setShowMenu(false)
                        }}
                        className={`w-full flex items-center gap-2 p-2 text-left rounded-lg ${
                          darkMode ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Verwijderen</span>
                      </button>
                    </div>
                  </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Expandable Details Panel */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Email History */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email History ({lead.emailHistory?.length || 0})
                    </h4>
                    {lead.emailHistory && lead.emailHistory.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {lead.emailHistory.slice().reverse().map((email) => (
                          <div key={email.id} className="bg-white rounded p-2 text-xs">
                            <p className="font-medium text-gray-900 truncate">{email.subject}</p>
                            {email.templateName && (
                              <p className="text-gray-500">Template: {email.templateName}</p>
                            )}
                            <p className="text-gray-400">
                              {new Date(email.sentAt).toLocaleDateString('nl-NL')} om {new Date(email.sentAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">Nog geen emails verstuurd</p>
                    )}
                  </div>

                  {/* Notes Timeline */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Notities ({lead.notesTimeline?.length || 0})
                    </h4>
                    {lead.notesTimeline && lead.notesTimeline.length > 0 ? (
                      <div className="space-y-2 max-h-28 overflow-y-auto mb-3">
                        {lead.notesTimeline.slice().reverse().map((note) => (
                          <div key={note.id} className="bg-white rounded p-2 text-xs">
                            <p className="text-gray-900">{note.text}</p>
                            <p className="text-gray-400 mt-1">
                              {new Date(note.createdAt).toLocaleDateString('nl-NL')}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mb-3">Nog geen notities</p>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nieuwe notitie..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newNote.trim()) {
                            onAddNote(newNote)
                            setNewNote('')
                          }
                        }}
                        className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => {
                          if (newNote.trim()) {
                            onAddNote(newNote)
                            setNewNote('')
                          }
                        }}
                        className="px-2 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Follow-up Planner */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Follow-up
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="date"
                        value={lead.followUpDate || ''}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => onSetFollowUp(e.target.value || undefined)}
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-emerald-500"
                      />
                      {lead.followUpDate && (
                        <button
                          onClick={() => onSetFollowUp(undefined)}
                          className="w-full px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Follow-up verwijderen
                        </button>
                      )}
                      <div className="flex gap-1 flex-wrap">
                        <button
                          onClick={() => {
                            const tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate() + 1)
                            onSetFollowUp(tomorrow.toISOString().split('T')[0])
                          }}
                          className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
                        >
                          Morgen
                        </button>
                        <button
                          onClick={() => {
                            const nextWeek = new Date()
                            nextWeek.setDate(nextWeek.getDate() + 7)
                            onSetFollowUp(nextWeek.toISOString().split('T')[0])
                          }}
                          className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
                        >
                          +1 week
                        </button>
                        <button
                          onClick={() => {
                            const nextMonth = new Date()
                            nextMonth.setMonth(nextMonth.getMonth() + 1)
                            onSetFollowUp(nextMonth.toISOString().split('T')[0])
                          }}
                          className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
                        >
                          +1 maand
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Add Lead Modal
function AddLeadModal({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean
  onClose: () => void
  onAdd: (lead: Lead) => void
}) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newLead: Lead = {
      id: Date.now().toString(),
      ...formData,
      status: 'nieuw',
      priority: false,
      createdAt: new Date().toISOString(),
      emailsSent: 0,
      emailHistory: [],
      notesTimeline: formData.notes ? [{
        id: Date.now().toString(),
        text: formData.notes,
        createdAt: new Date().toISOString()
      }] : []
    }

    onAdd(newLead)
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      notes: ''
    })
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nieuw bedrijf toevoegen</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrijfsnaam *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Bakkerij De Gouden Korrel"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contactpersoon *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Jan Bakker"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plaats *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Leiden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="info@bedrijf.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefoon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="06-12345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="www.bedrijf.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Dorpsstraat 15"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notities
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Geen website, alleen Facebook pagina. Geïnteresseerd in offerte."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Toevoegen
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Target icon for header
function Target({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

// Tooltip Component
function Tooltip({ children, text, darkMode }: { children: React.ReactNode; text: string; darkMode: boolean }) {
  const [show, setShow] = useState(false)
  
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded whitespace-nowrap z-50 ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
            }`}
          >
            {text}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
              darkMode ? 'border-b-gray-700' : 'border-b-gray-900'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Onboarding Modal Component
function OnboardingModal({ 
  step, 
  onNext, 
  onSkip, 
  darkMode 
}: { 
  step: number
  onNext: () => void
  onSkip: () => void
  darkMode: boolean 
}) {
  const steps = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Welkom bij Marketing CRM! 👋',
      description: 'Dit systeem helpt je om lokale bedrijven te vinden en te converteren naar klanten. Laten we je rondleiden!',
      tip: 'Dit duurt maar 1 minuut'
    },
    {
      icon: <Plus className="w-8 h-8" />,
      title: 'Leads toevoegen',
      description: 'Klik op "Nieuw bedrijf" om een potentiële klant toe te voegen. Vul de bedrijfsgegevens in en voeg notities toe.',
      tip: 'Tip: Noteer altijd waarom dit bedrijf interessant is'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Emails versturen',
      description: 'Bij elke lead kun je emails versturen met vooraf gemaakte templates. Kies een template en personaliseer indien nodig.',
      tip: 'Tip: De template wordt automatisch gepersonaliseerd'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Follow-ups plannen',
      description: 'Klik op "Details" bij een lead om notities toe te voegen en follow-up datums in te stellen. Je krijgt een melding als actie nodig is.',
      tip: 'Tip: Stel altijd een follow-up in na het eerste contact'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Voortgang bijhouden',
      description: 'De conversie funnel bovenaan laat zien hoe je leads door de fases gaan. Pas de status aan via het menu rechts.',
      tip: 'Je bent klaar om te starten! 🚀'
    }
  ]

  const currentStep = steps[step]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            className="h-full bg-emerald-500"
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Icon */}
          <motion.div
            key={step}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            {currentStep.icon}
          </motion.div>

          {/* Content */}
          <motion.div
            key={`content-${step}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentStep.title}
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentStep.description}
            </p>
            <p className={`text-sm px-4 py-2 rounded-lg inline-block ${
              darkMode ? 'bg-gray-700 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            }`}>
              💡 {currentStep.tip}
            </p>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={onSkip}
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Overslaan
            </button>
            
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step 
                      ? 'bg-emerald-500' 
                      : i < step 
                        ? darkMode ? 'bg-emerald-700' : 'bg-emerald-200'
                        : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {step < steps.length - 1 ? (
                <>Volgende <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Start! 🎉</>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Help Modal Component
function HelpModal({ onClose, darkMode }: { onClose: () => void; darkMode: boolean }) {
  const [activeTab, setActiveTab] = useState<'guide' | 'tips' | 'shortcuts'>('guide')

  const guides = [
    {
      title: '🏢 Leads toevoegen',
      steps: [
        'Klik op "Nieuw bedrijf" rechtsboven',
        'Vul de bedrijfsgegevens in (naam, contact, email)',
        'Voeg notities toe over waarom dit interessant is',
        'Klik op "Toevoegen"'
      ]
    },
    {
      title: '📧 Emails versturen',
      steps: [
        'Klik op "Email sturen" bij een lead',
        'Kies een email template',
        'Pas het bericht aan indien nodig',
        'Klik op "Verstuur email"'
      ]
    },
    {
      title: '📅 Follow-ups plannen',
      steps: [
        'Klik op "Details" bij een lead',
        'Ga naar het Follow-up tabblad',
        'Kies een datum of gebruik snelkeuzes',
        'Je krijgt een melding als actie nodig is'
      ]
    },
    {
      title: '📊 Status bijwerken',
      steps: [
        'Klik op het menu (drie puntjes) bij een lead',
        'Kies de nieuwe status',
        'De conversie funnel wordt automatisch bijgewerkt'
      ]
    }
  ]

  const tips = [
    { icon: '⭐', text: 'Markeer prioriteit leads met de ster voor snelle focus' },
    { icon: '🔍', text: 'Gebruik de zoekbalk om snel leads te vinden' },
    { icon: '📤', text: 'Exporteer je leads regelmatig als backup' },
    { icon: '🌙', text: 'Schakel dark mode in voor minder vermoeide ogen' },
    { icon: '📝', text: 'Voeg altijd een notitie toe na elk gesprek' },
    { icon: '⏰', text: 'Plan follow-ups direct na het versturen van een email' },
    { icon: '🎯', text: 'Focus op leads met "Interesse" status voor hoogste conversie' },
    { icon: '📈', text: 'Check de conversie funnel wekelijks voor inzichten' }
  ]

  const shortcuts = [
    { key: 'n', description: 'Nieuw bedrijf toevoegen' },
    { key: 's', description: 'Zoeken in leads' },
    { key: 'e', description: 'Exporteren naar CSV' },
    { key: 'd', description: 'Dark mode toggle' },
    { key: '?', description: 'Deze hulp openen' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Hulp & Handleiding
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Leer hoe je het CRM optimaal gebruikt
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'guide' as const, label: 'Handleiding', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'tips' as const, label: 'Tips', icon: <Lightbulb className="w-4 h-4" /> },
              { id: 'shortcuts' as const, label: 'Sneltoetsen', icon: <MousePointer className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : darkMode 
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'guide' && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {guides.map((guide, i) => (
                  <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {guide.title}
                    </h3>
                    <ol className="space-y-2">
                      {guide.steps.map((step, j) => (
                        <li key={j} className={`flex items-start gap-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {j + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid gap-3"
              >
                {tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                  >
                    <span className="text-2xl">{tip.icon}</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{tip.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'shortcuts' && (
              <motion.div
                key="shortcuts"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Gebruik deze sneltoetsen om sneller te werken (binnenkort beschikbaar)
                </p>
                {shortcuts.map((shortcut, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                  >
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{shortcut.description}</span>
                    <kbd className={`px-3 py-1 rounded text-sm font-mono ${
                      darkMode ? 'bg-gray-600 text-gray-300' : 'bg-white border border-gray-300 text-gray-700'
                    }`}>
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Hulp nodig? Mail naar <a href="mailto:support@webstability.nl" className="text-emerald-600 hover:underline">support@webstability.nl</a>
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
            >
              Sluiten
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
