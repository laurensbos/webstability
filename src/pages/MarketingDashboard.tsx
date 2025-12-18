import { useState, useEffect, createContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../components/Logo'
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
  Download,
  User,
  Globe,
  ChevronDown,
  X,
  TrendingUp,
  MessageSquare,
  Moon,
  Sun,
  HelpCircle,
  BookOpen,
  Lightbulb,
  MousePointer,
  ArrowRight,
  Sparkles,
  Target,
  Calendar,
  RefreshCw,
  ChevronRight,
  Zap
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
✓ Vanaf €99 per maand - geen grote investering vooraf  
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
• Al vanaf €99 per maand

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

Geen grote investering vooraf - wij werken met een abonnement vanaf €99/maand.

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

const statusColors: Record<Lead['status'], { bg: string; darkBg: string; text: string; darkText: string; label: string }> = {
  nieuw: { bg: 'bg-blue-100', darkBg: 'bg-blue-500/20', text: 'text-blue-700', darkText: 'text-blue-400', label: 'Nieuw' },
  gecontacteerd: { bg: 'bg-yellow-100', darkBg: 'bg-yellow-500/20', text: 'text-yellow-700', darkText: 'text-yellow-400', label: 'Gecontacteerd' },
  geinteresseerd: { bg: 'bg-purple-100', darkBg: 'bg-purple-500/20', text: 'text-purple-700', darkText: 'text-purple-400', label: 'Geïnteresseerd' },
  offerte: { bg: 'bg-orange-100', darkBg: 'bg-orange-500/20', text: 'text-orange-700', darkText: 'text-orange-400', label: 'Offerte verstuurd' },
  klant: { bg: 'bg-green-100', darkBg: 'bg-green-500/20', text: 'text-green-700', darkText: 'text-green-400', label: 'Klant!' },
  afgewezen: { bg: 'bg-gray-100', darkBg: 'bg-gray-700/50', text: 'text-gray-500', darkText: 'text-gray-400', label: 'Afgewezen' }
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
  
  // Main view tab - zoeken or leads
  const [mainTab, setMainTab] = useState<'zoeken' | 'leads'>('zoeken')
  
  // Business search state
  const [searchCity, setSearchCity] = useState('')
  const [businessNameQuery, setBusinessNameQuery] = useState('')
  const [searchType, setSearchType] = useState('alles')
  const [searchRadius, setSearchRadius] = useState('5')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{
    id: string
    name: string
    address: string
    city: string
    phone?: string
    website?: string
    email?: string
    type: string
  }>>([])
  
  // Website analysis state
  interface WebsiteAnalysis {
    isOutdated: boolean
    score: number
    issues: string[]
    details: {
      hasHttps: boolean
      hasViewport: boolean
      loadTime: number
      oldTechnologies: string[]
      firstSeen?: string
    }
    recommendation: string
  }
  const [analyzingWebsites, setAnalyzingWebsites] = useState<Record<string, boolean>>({})
  const [websiteAnalyses, setWebsiteAnalyses] = useState<Record<string, WebsiteAnalysis>>({})
  
  // Dark mode state - default to true for modern look
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('webstability_darkmode')
    // Default to dark mode if no preference saved
    return saved === null ? true : saved === 'true'
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
      // Version check - clear old mockdata
      const CURRENT_VERSION = '2.0.0' // Increment this when mockdata changes
      const savedVersion = localStorage.getItem('webstability_leads_version')
      
      if (savedVersion !== CURRENT_VERSION) {
        // Clear old data including mockdata
        console.log('[MarketingDashboard] Clearing old data, upgrading to version', CURRENT_VERSION)
        localStorage.removeItem('webstability_leads')
        localStorage.setItem('webstability_leads_version', CURRENT_VERSION)
      }
      
      // Always load from localStorage first (instant)
      const saved = localStorage.getItem('webstability_leads')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Filter out any remaining mockdata by known IDs
          const filtered = parsed.filter((l: Lead) => 
            l.id !== '1' && l.id !== '2' && 
            !l.companyName?.includes('Schildersbedrijf Jansen') &&
            !l.companyName?.includes('Bakkerij De Gouden Korrel')
          )
          setLeads(filtered)
          
          // Update localStorage if we filtered anything
          if (filtered.length !== parsed.length) {
            localStorage.setItem('webstability_leads', JSON.stringify(filtered))
          }
        } catch {
          console.log('Invalid leads data, starting fresh')
          setLeads([])
        }
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
    }
    
    loadLeads()
  }, [])

  // Business types for search
  const businessTypes = [
    { value: 'alles', label: 'Alles' },
    { value: 'restaurant', label: 'Restaurant / Horeca' },
    { value: 'kapper', label: 'Kapper / Schoonheid' },
    { value: 'winkel', label: 'Winkel / Retail' },
    { value: 'garage', label: 'Garage / Auto' },
    { value: 'bouw', label: 'Bouw / Aannemer' },
    { value: 'installateur', label: 'Installateur' },
    { value: 'schilder', label: 'Schilder' },
    { value: 'fitness', label: 'Fitness / Sport' },
    { value: 'tandarts', label: 'Tandarts / Zorg' },
    { value: 'overig', label: 'Overig' },
  ]

  // Search businesses via API
  const handleBusinessSearch = async () => {
    if (!searchCity.trim()) {
      setSearchError('Vul een stad of postcode in')
      return
    }

    setIsSearching(true)
    setSearchError('')
    setSearchResults([])

    try {
      // Converteer km naar meters voor de API
      const radiusInMeters = (parseInt(searchRadius) * 1000).toString()
      
      const params = new URLSearchParams({
        city: searchCity.trim(),
        type: searchType,
        radius: radiusInMeters
      })

      // Voeg bedrijfsnaam query toe als die is ingevuld
      if (businessNameQuery.trim()) {
        params.set('query', businessNameQuery.trim())
      }

      console.log(`[Search] Zoeken naar ${businessNameQuery || searchType} in ${searchCity}, radius ${searchRadius}km...`)
      
      const response = await fetch(`/api/marketing/search-businesses?${params}`)
      const data = await response.json()

      console.log('[Search] Response:', data)

      if (data.success) {
        setSearchResults(data.businesses || [])
        if (!data.businesses || data.businesses.length === 0) {
          setSearchError(data.error || `Geen ${businessNameQuery || searchType} bedrijven gevonden binnen ${searchRadius}km van ${searchCity}. Probeer een groter zoekgebied.`)
        }
      } else {
        setSearchError(data.error || 'Zoeken mislukt - probeer opnieuw')
      }
    } catch (error) {
      console.error('[Search] Error:', error)
      setSearchError('Netwerkfout - controleer je verbinding en probeer opnieuw')
    } finally {
      setIsSearching(false)
    }
  }

  // Add business from search results to leads
  const addBusinessToLeads = (business: typeof searchResults[0]) => {
    // Check if already exists
    if (leads.some(l => l.id === business.id)) {
      return
    }

    const newLead: Lead = {
      id: business.id,
      companyName: business.name,
      contactPerson: '',
      email: business.email || '',
      phone: business.phone || '',
      website: business.website || '',
      address: business.address,
      city: business.city,
      notes: `Type: ${business.type}`,
      status: 'nieuw',
      priority: false,
      createdAt: new Date().toISOString(),
      emailsSent: 0,
      emailHistory: [],
      notesTimeline: []
    }

    setLeads(prev => [newLead, ...prev])
  }

  // Analyze website for outdated indicators
  const analyzeWebsite = async (businessId: string, website: string) => {
    if (!website) return
    
    setAnalyzingWebsites(prev => ({ ...prev, [businessId]: true }))
    
    try {
      const response = await fetch('/api/marketing/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: website })
      })
      const data = await response.json()
      
      console.log('[Analyze] Response:', data)
      
      if (data.success && data.analysis) {
        setWebsiteAnalyses(prev => ({ ...prev, [businessId]: data.analysis }))
      } else if (data.error) {
        console.error('[Analyze] API Error:', data.error)
      }
    } catch (error) {
      console.error('[Analyze] Error:', error)
    } finally {
      setAnalyzingWebsites(prev => ({ ...prev, [businessId]: false }))
    }
  }

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
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      (lead.companyName || '').toLowerCase().includes(searchLower) ||
      (lead.contactPerson || '').toLowerCase().includes(searchLower) ||
      (lead.city || '').toLowerCase().includes(searchLower) ||
      (lead.email || '').toLowerCase().includes(searchLower)
    
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
        .replace('{{bedrijf}}', lead.companyName || '')
        .replace('{{naam}}', lead.contactPerson || 'heer/mevrouw')
        .replace('{{stad}}', lead.city || '')
      
      const body = template.body
        .replace(/{{bedrijf}}/g, lead.companyName || '')
        .replace(/{{naam}}/g, lead.contactPerson || 'heer/mevrouw')
        .replace(/{{stad}}/g, lead.city || '')
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
    
    // Helper to escape CSV values (handle commas, quotes, newlines)
    const escapeCSV = (value: string | undefined | null): string => {
      if (!value) return ''
      const str = String(value)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }
    
    const rows = leads.map(l => [
      escapeCSV(l.companyName),
      escapeCSV(l.contactPerson),
      escapeCSV(l.email),
      escapeCSV(l.phone),
      escapeCSV(l.city),
      escapeCSV(statusColors[l.status]?.label || l.status),
      escapeCSV(l.notes),
      escapeCSV(l.followUpDate),
      String(l.emailsSent || 0)
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }) // BOM for Excel
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url) // Clean up
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Animated Background - Like diensten pages */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Gradient overlay */}
          <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-emerald-600/10 via-gray-900 to-teal-600/10' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/50'}`} />
          
          {/* Animated gradient blobs */}
          <motion.div 
            className={`absolute top-0 right-0 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 ${
              darkMode ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent' : 'bg-gradient-to-br from-emerald-200/40 via-teal-100/30 to-transparent'
            }`}
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className={`absolute bottom-0 left-0 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 ${
              darkMode ? 'bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-transparent' : 'bg-gradient-to-tr from-teal-100/40 via-emerald-50/30 to-transparent'
            }`}
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Decorative rings - hidden on mobile */}
          <div className={`hidden sm:block absolute top-20 right-20 w-32 h-32 border rounded-full ${darkMode ? 'border-emerald-400/20' : 'border-emerald-300/30'}`} />
          <div className={`hidden sm:block absolute top-24 right-24 w-24 h-24 border rounded-full ${darkMode ? 'border-teal-500/10' : 'border-teal-200/30'}`} />
          <div className={`hidden sm:block absolute bottom-32 left-20 w-20 h-20 border rounded-full ${darkMode ? 'border-emerald-400/20' : 'border-emerald-200/30'}`} />
          
          {/* Floating particles */}
          {darkMode && (
            <>
              {[
                { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
                { size: 6, x: '20%', y: '60%', delay: 1, duration: 5 },
                { size: 3, x: '80%', y: '30%', delay: 0.5, duration: 4.5 },
                { size: 5, x: '70%', y: '70%', delay: 1.5, duration: 5.5 },
                { size: 4, x: '90%', y: '50%', delay: 2, duration: 4 },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"
                  style={{ 
                    width: p.size, 
                    height: p.size, 
                    left: p.x, 
                    top: p.y,
                    opacity: 0.4
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}
        </div>

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

        {/* Modern Header with glass effect */}
        <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-900/70 border-gray-800/50' 
            : 'bg-white/70 border-gray-200/50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                <a href="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <Logo variant={darkMode ? 'white' : 'default'} showText={false} />
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
                <div className="hidden sm:block">
                  <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Sales Dash
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Lokale klanten werven
                    </span>
                    {syncStatus === 'syncing' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-500">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Syncing
                      </span>
                    )}
                    {syncStatus === 'synced' && lastSyncTime && (
                      <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        ✓ {lastSyncTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Bar - Desktop only */}
              <div className="hidden lg:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Zoek op bedrijf, email, stad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>
              </div>
              
              {/* Actions - Desktop only */}
              <div className="hidden sm:flex items-center gap-3">
                {/* Help Button */}
                <Tooltip text="Hulp & Handleiding" darkMode={darkMode}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHelp(true)}
                    className={`p-2.5 rounded-xl transition-colors ${
                      darkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
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
                    className={`p-2.5 rounded-xl transition-colors ${
                      darkMode 
                        ? 'text-yellow-400 hover:bg-gray-800' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                      darkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden lg:inline">Export</span>
                  </motion.button>
                </Tooltip>

                {/* Add Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/25"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden lg:inline font-medium">Nieuw bedrijf</span>
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8">
        
        {/* Mobile: Simple header with stats */}
        <div className="sm:hidden mb-4">
          <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {mainTab === 'zoeken' ? '🔍 Bedrijven zoeken' : `📋 Mijn leads (${stats.total})`}
          </h2>
        </div>

        {/* Desktop: Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden sm:block mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                darkMode ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20' : 'bg-gradient-to-br from-emerald-100 to-teal-100'
              }`}
            >
              <Sparkles className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </motion.div>
            <div className="flex-1">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Welkom terug! 👋
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Desktop only */}
        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border backdrop-blur-xl transition-all cursor-pointer ${
              darkMode 
                ? 'bg-gray-800/60 border-gray-700/50 hover:border-blue-500/50' 
                : 'bg-white/80 border-gray-200/50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
                <Building2 className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <span className={`hidden sm:inline text-xs font-medium px-2 py-1 rounded-full ${
                darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                Totaal
              </span>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Leads</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border transition-all cursor-pointer ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:border-amber-500/50' 
                : 'bg-white border-gray-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-amber-500/20' : 'bg-gradient-to-br from-amber-50 to-amber-100'}`}>
                <Mail className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <Sparkles className={`hidden sm:block w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.emailsSent}</p>
            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emails</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border transition-all cursor-pointer ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50' 
                : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}>
                <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.gecontacteerd + stats.geinteresseerd}</p>
            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>In gesprek</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border transition-all cursor-pointer col-span-1 sm:col-span-1 ${
              darkMode 
                ? 'bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-700/50' 
                : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${darkMode ? 'bg-emerald-500/20' : 'bg-white shadow-sm'}`}>
                <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <span className={`hidden sm:inline text-xs font-medium px-2 py-1 rounded-full ${
                darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
              }`}>
                🎉
              </span>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.klanten}</p>
            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Klanten</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
              stats.followUpsOverdue > 0 
                ? darkMode 
                  ? 'bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-500/50' 
                  : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200'
                : stats.followUpsToday > 0 
                  ? darkMode 
                    ? 'bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/50' 
                    : 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200'
                  : darkMode 
                    ? 'bg-gray-800/50 border-gray-700/50' 
                    : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className={`p-2 sm:p-3 rounded-xl ${
                stats.followUpsOverdue > 0 
                  ? darkMode ? 'bg-red-500/20' : 'bg-white shadow-sm'
                  : stats.followUpsToday > 0 
                    ? darkMode ? 'bg-orange-500/20' : 'bg-white shadow-sm'
                    : darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  stats.followUpsOverdue > 0 
                    ? darkMode ? 'text-red-400' : 'text-red-600'
                    : stats.followUpsToday > 0 
                      ? darkMode ? 'text-orange-400' : 'text-orange-600'
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              {stats.followUpsOverdue > 0 && (
                <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-red-500"></span>
                </span>
              )}
            </div>
            <p className={`text-xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {stats.followUpsToday + stats.followUpsOverdue}
            </p>
            <p className={`text-[10px] sm:text-sm mt-0.5 sm:mt-1 ${
              stats.followUpsOverdue > 0 
                ? darkMode ? 'text-red-400' : 'text-red-600'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {stats.followUpsOverdue > 0 ? `${stats.followUpsOverdue} te laat!` : 'Follow-ups'}
            </p>
          </motion.div>
        </div>

        {/* Quick Actions - Desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="hidden sm:block mb-8"
        >
          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                darkMode 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              Nieuw bedrijf
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMainTab('zoeken')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                mainTab === 'zoeken'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              Zoeken
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMainTab('leads')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                mainTab === 'leads'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Leads ({leads.length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportToCSV}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Download className="w-4 h-4" />
              Exporteer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                localStorage.removeItem('webstability_onboarding_complete')
                setOnboardingStep(0)
                setShowOnboarding(true)
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              Tutorial
            </motion.button>
          </div>
        </motion.div>

        {/* Conversie Funnel - Desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`hidden sm:block rounded-2xl p-5 border backdrop-blur-xl mb-6 ${
            darkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'
          }`}
        >
          {/* Conversie Funnel */}
          <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Conversie Funnel
          </h3>
          <div className="flex items-center justify-between gap-2 text-center mb-4">
            <div className="flex-1 min-w-[50px]">
              <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{stats.nieuw}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nieuw</div>
            </div>
            <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'} flex-shrink-0`} />
            <div className="flex-1 min-w-[50px]">
              <div className={`text-xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{stats.gecontacteerd}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact</div>
            </div>
            <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'} flex-shrink-0`} />
            <div className="flex-1 min-w-[50px]">
              <div className={`text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{stats.geinteresseerd}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interesse</div>
              {conversionRates.contactToInterest > 0 && (
                <div className={`text-[10px] font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{conversionRates.contactToInterest}%</div>
              )}
            </div>
            <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'} flex-shrink-0`} />
            <div className="flex-1 min-w-[50px]">
              <div className={`text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{stats.offerte}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Offerte</div>
              {conversionRates.interestToQuote > 0 && (
                <div className={`text-[10px] font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{conversionRates.interestToQuote}%</div>
              )}
            </div>
            <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'} flex-shrink-0`} />
            <div className="flex-1 min-w-[50px]">
              <div className={`text-xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{stats.klanten}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Klant</div>
              {conversionRates.quoteToCustomer > 0 && (
                <div className={`text-[10px] font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{conversionRates.quoteToCustomer}%</div>
              )}
            </div>
          </div>
          {stats.total > 0 && (
            <div className={`pt-3 border-t text-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Totale conversie: <span className="font-bold text-emerald-500">{conversionRates.overallConversion}%</span>
                {stats.afgewezen > 0 && (
                  <span className={`ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>• {stats.afgewezen} afgewezen</span>
                )}
              </span>
            </div>
          )}
        </motion.div>

        {/* Status Filter Chips */}
        {mainTab === 'zoeken' ? (
          /* Business Search Panel */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border backdrop-blur-xl mb-4 ${
              darkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'
            }`}
          >
            <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              Zoek bedrijven
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="col-span-1">
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Stad/postcode
                </label>
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBusinessSearch()}
                  placeholder="bijv. Leiden"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Bedrijfsnaam {searchType !== 'alles' && <span className="text-gray-500">(optioneel)</span>}
                  {searchType === 'alles' && <span className="text-emerald-500">*</span>}
                </label>
                <input
                  type="text"
                  value={businessNameQuery}
                  onChange={(e) => setBusinessNameQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBusinessSearch()}
                  placeholder={searchType === 'alles' ? 'bijv. hoveniersbedrijf' : 'bijv. Bakkerij De Boer'}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                />
              </div>
              
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                >
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Straal
                </label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                  className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                >
                  <option value="2">2 km</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBusinessSearch}
                  disabled={isSearching || !searchCity.trim()}
                  className="w-full px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {isSearching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Zoeken
                </motion.button>
              </div>
            </div>

            {searchError && (
              <p className={`text-sm mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{searchError}</p>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className={`rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {searchResults.length} bedrijven gevonden
                  </h4>
                </div>
                
                <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'} max-h-96 overflow-y-auto`}>
                  {searchResults.map((business) => {
                    const isAdded = leads.some(l => l.id === business.id)
                    const analysis = websiteAnalyses[business.id]
                    const isAnalyzing = analyzingWebsites[business.id]
                    
                    return (
                      <div key={business.id} className={`p-4 transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h5 className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {business.name}
                            </h5>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {business.address}, {business.city}
                            </p>
                            <div className={`flex flex-wrap gap-3 mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {business.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {business.phone}
                                </span>
                              )}
                              {business.website && (
                                <a 
                                  href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-emerald-500 hover:underline"
                                >
                                  <Globe className="w-3 h-3" />
                                  Website
                                </a>
                              )}
                              <span className={`px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                {business.type}
                              </span>
                            </div>
                            
                            {/* Website Analysis Result */}
                            {analysis && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`mt-3 p-3 rounded-lg border ${
                                  analysis.isOutdated
                                    ? darkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
                                    : darkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    analysis.isOutdated
                                      ? 'bg-orange-500 text-white'
                                      : 'bg-emerald-500 text-white'
                                  }`}>
                                    Score: {analysis.score}/100
                                  </div>
                                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {analysis.isOutdated ? '⚠️ Verouderd' : '✓ Modern'}
                                  </span>
                                </div>
                                {analysis.issues.length > 0 && (
                                  <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {analysis.issues.slice(0, 3).map((issue, i) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <span className="text-orange-500">•</span>
                                        {issue}
                                      </li>
                                    ))}
                                    {analysis.issues.length > 3 && (
                                      <li className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        +{analysis.issues.length - 3} meer problemen
                                      </li>
                                    )}
                                  </ul>
                                )}
                                <p className={`mt-2 text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  💡 {analysis.recommendation}
                                </p>
                              </motion.div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {/* Analyze Button */}
                            {business.website && !analysis && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => analyzeWebsite(business.id, business.website!)}
                                disabled={isAnalyzing}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                  darkMode 
                                    ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                } ${isAnalyzing ? 'opacity-50 cursor-wait' : ''}`}
                              >
                                {isAnalyzing ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 inline mr-1 animate-spin" />
                                    Analyseren...
                                  </>
                                ) : (
                                  <>
                                    <Search className="w-4 h-4 inline mr-1" />
                                    Analyseer
                                  </>
                                )}
                              </motion.button>
                            )}
                            
                            {/* Add to Leads Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addBusinessToLeads(business)}
                              disabled={isAdded}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                isAdded
                                  ? darkMode 
                                    ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                                    : 'bg-emerald-100 text-emerald-700 cursor-default'
                                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <CheckCircle className="w-4 h-4 inline mr-1" />
                                  Toegevoegd
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 inline mr-1" />
                                  Toevoegen
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Original Leads Filter */
          <>
          <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
          {['alle', 'nieuw', 'gecontacteerd', 'geinteresseerd', 'offerte', 'klant', 'afgewezen'].map((status) => {
            const count = status === 'alle' ? leads.length : leads.filter(l => l.status === status).length
            return (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatusFilter(status)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  statusFilter === status
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : darkMode
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {status === 'alle' ? 'Alle' : statusColors[status as Lead['status']]?.label || status}
                <span className={`ml-1.5 sm:ml-2 px-1 sm:px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs ${
                  statusFilter === status
                    ? 'bg-white/20'
                    : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {count}
                </span>
              </motion.button>
            )
          })}
          </div>

        {/* Leads List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`rounded-2xl shadow-sm border backdrop-blur-xl overflow-hidden transition-colors ${
            darkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'
          }`}
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
        </>
        )}
      </main>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        darkMode={darkMode}
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
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 100 }}
              className={`rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h2 className={`text-lg sm:text-xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email versturen</h2>
                    <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Naar: {selectedLead.email}</p>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className={`p-2 rounded-lg flex-shrink-0 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto max-h-[55vh] sm:max-h-[60vh]">
                {/* Template selector */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Kies een template
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {emailTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => openEmailModal(selectedLead, template)}
                        className={`p-3 text-left rounded-xl border transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                            : darkMode 
                              ? 'border-gray-600 hover:border-emerald-500 bg-gray-700' 
                              : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{template.name}</p>
                        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Onderwerp
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                    placeholder="Email onderwerp..."
                  />
                </div>

                {/* Body */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bericht
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={8}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                    placeholder="Typ je bericht..."
                  />
                </div>
              </div>

              <div className={`p-4 sm:p-6 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Annuleren
                </button>
                <button
                  onClick={sendEmail}
                  disabled={sending || !emailSubject || !emailBody}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Mobile Bottom Navigation - Clean 4 items */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl pb-safe ${
        darkMode 
          ? 'bg-gray-900/95 border-gray-800' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="flex items-center justify-around h-16 px-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMainTab('zoeken')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              mainTab === 'zoeken' 
                ? (darkMode ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50') 
                : (darkMode ? 'text-gray-400' : 'text-gray-500')
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Zoeken</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMainTab('leads')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              mainTab === 'leads' 
                ? (darkMode ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50') 
                : (darkMode ? 'text-gray-400' : 'text-gray-500')
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Leads</span>
            {stats.total > 0 && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 text-[9px] flex items-center justify-center rounded-full bg-emerald-500 text-white font-bold`}>
                {stats.total > 99 ? '99+' : stats.total}
              </span>
            )}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center"
          >
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/30">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              // Filter leads die nog geen email hebben gehad
              setMainTab('leads')
              setStatusFilter('nieuw')
            }}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors relative ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="text-[10px] font-medium">Te mailen</span>
            {stats.nieuw > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 text-[9px] flex items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                {stats.nieuw}
              </span>
            )}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowHelp(true)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
            <span className="text-[10px] font-medium">Meer</span>
          </motion.button>
        </div>
      </nav>
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
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-semibold truncate text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>{lead.companyName}</h3>
                {/* Status badge - visible on larger screens */}
                <span className={`hidden sm:inline-flex px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>
              {/* Status badge - mobile only, under company name */}
              <div className="flex items-center gap-2 mt-1 sm:hidden">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                {isFollowUpOverdue && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                    Te laat!
                  </span>
                )}
                {isFollowUpToday && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                    Vandaag
                  </span>
                )}
              </div>
              {/* Follow-up badges - desktop only */}
              <div className="hidden sm:flex items-center gap-2 mt-1">
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
              <div className={`flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 mt-1.5 sm:mt-1 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lead.contactPerson && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{lead.contactPerson}</span>
                    <span className="sm:hidden">{lead.contactPerson.split(' ')[0]}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {lead.city}
                </span>
                {lead.website && (
                  <a 
                    href={`https://${lead.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-600 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Website</span>
                    <span className="sm:hidden">Web</span>
                  </a>
                )}
              </div>
              {lead.notes && (
                <p className={`text-xs sm:text-sm mt-2 line-clamp-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{lead.notes}</p>
              )}
            </div>
          </div>

          {/* Actions row */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-3 flex-wrap">
            <a
              href={`mailto:${lead.email}`}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                darkMode ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:hidden">Mail</span>
              <span className="hidden sm:inline">{lead.email}</span>
            </a>
            <a
              href={`tel:${lead.phone}`}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                darkMode ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="sm:hidden">Bel</span>
              <span className="hidden sm:inline">{lead.phone}</span>
            </a>
            
            {/* Details toggle button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors ${
                showDetails 
                  ? darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700' 
                  : darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
              <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                isFollowUpOverdue 
                  ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700' 
                  : isFollowUpToday 
                    ? darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700' 
                    : darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-3 h-3" />
                {new Date(lead.followUpDate).toLocaleDateString('nl-NL')}
              </span>
            )}

            {lead.lastContact && !lead.followUpDate && (
              <span className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <Clock className="w-3 h-3" />
                {new Date(lead.lastContact).toLocaleDateString('nl-NL')}
              </span>
            )}

            <div className="flex-1" />

            {/* Email button - opens template modal */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowTemplates(true)
                setShowMenu(false)
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Email sturen</span>
              <span className="sm:hidden">Email</span>
            </button>

            {/* Template selection modal */}
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowTemplates(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 100 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 100 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    } shadow-2xl`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Kies email template
                      </h3>
                      <button
                        onClick={() => setShowTemplates(false)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            onEmail(template)
                            setShowTemplates(false)
                          }}
                          className={`w-full p-4 text-left rounded-xl border transition-all ${
                            darkMode 
                              ? 'border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10' 
                              : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                          }`}
                        >
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {template.name}
                          </p>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {template.description}
                          </p>
                        </button>
                      ))}
                      
                      <hr className={`my-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                      
                      <button
                        onClick={() => {
                          onEmail()
                          setShowTemplates(false)
                        }}
                        className={`w-full p-4 text-left rounded-xl border transition-all ${
                          darkMode 
                            ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-700' 
                            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ✏️ Leeg bericht
                        </p>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Schrijf zelf een email
                        </p>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
                className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                  {/* Email History */}
                  <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Emails ({lead.emailHistory?.length || 0})
                    </h4>
                    {lead.emailHistory && lead.emailHistory.length > 0 ? (
                      <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                        {lead.emailHistory.slice().reverse().map((email) => (
                          <div key={email.id} className={`rounded p-2 text-xs ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{email.subject}</p>
                            {email.templateName && (
                              <p className={`truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Template: {email.templateName}</p>
                            )}
                            <p className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                              {new Date(email.sentAt).toLocaleDateString('nl-NL')}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nog geen emails verstuurd</p>
                    )}
                  </div>

                  {/* Notes Timeline */}
                  <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Notities ({lead.notesTimeline?.length || 0})
                    </h4>
                    {lead.notesTimeline && lead.notesTimeline.length > 0 ? (
                      <div className="space-y-2 max-h-24 sm:max-h-28 overflow-y-auto mb-2 sm:mb-3">
                        {lead.notesTimeline.slice().reverse().map((note) => (
                          <div key={note.id} className={`rounded p-2 text-xs ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <p className={darkMode ? 'text-white' : 'text-gray-900'}>{note.text}</p>
                            <p className={`mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(note.createdAt).toLocaleDateString('nl-NL')}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-xs mb-2 sm:mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nog geen notities</p>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Notitie..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newNote.trim()) {
                            onAddNote(newNote)
                            setNewNote('')
                          }
                        }}
                        className={`flex-1 min-w-0 px-2 py-1.5 text-xs border rounded focus:ring-1 focus:ring-emerald-500 ${
                          darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-200'
                        }`}
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
                  <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Follow-up
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="date"
                        value={lead.followUpDate || ''}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => onSetFollowUp(e.target.value || undefined)}
                        className={`w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-emerald-500 ${
                          darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-200'
                        }`}
                      />
                      {lead.followUpDate && (
                        <button
                          onClick={() => onSetFollowUp(undefined)}
                          className={`w-full px-2 py-1 text-xs rounded transition-colors ${
                            darkMode ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          Verwijderen
                        </button>
                      )}
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            const tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate() + 1)
                            onSetFollowUp(tomorrow.toISOString().split('T')[0])
                          }}
                          className={`px-2 py-1 text-xs border rounded ${
                            darkMode ? 'bg-gray-600 border-gray-500 text-white hover:bg-gray-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Morgen
                        </button>
                        <button
                          onClick={() => {
                            const nextWeek = new Date()
                            nextWeek.setDate(nextWeek.getDate() + 7)
                            onSetFollowUp(nextWeek.toISOString().split('T')[0])
                          }}
                          className={`px-2 py-1 text-xs border rounded ${
                            darkMode ? 'bg-gray-600 border-gray-500 text-white hover:bg-gray-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          +1 week
                        </button>
                        <button
                          onClick={() => {
                            const nextMonth = new Date()
                            nextMonth.setMonth(nextMonth.getMonth() + 1)
                            onSetFollowUp(nextMonth.toISOString().split('T')[0])
                          }}
                          className={`px-2 py-1 text-xs border rounded ${
                            darkMode ? 'bg-gray-600 border-gray-500 text-white hover:bg-gray-500' : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
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
  onAdd,
  darkMode = false
}: { 
  isOpen: boolean
  onClose: () => void
  onAdd: (lead: Lead) => void
  darkMode?: boolean
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

  const inputClasses = `w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-200 text-gray-900'
  }`

  const labelClasses = `block text-xs sm:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 100 }}
        className={`rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nieuw bedrijf</h2>
            <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className={labelClasses}>
              Bedrijfsnaam *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              className={inputClasses}
              placeholder="Bakkerij De Gouden Korrel"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClasses}>
                Contactpersoon *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                className={inputClasses}
                placeholder="Jan Bakker"
              />
            </div>
            <div>
              <label className={labelClasses}>
                Plaats *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className={inputClasses}
                placeholder="Leiden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClasses}>
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={inputClasses}
                placeholder="info@bedrijf.nl"
              />
            </div>
            <div>
              <label className={labelClasses}>
                Telefoon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={inputClasses}
                placeholder="06-12345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClasses}>
                Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className={inputClasses}
                placeholder="www.bedrijf.nl"
              />
            </div>
            <div>
              <label className={labelClasses}>
                Adres
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className={inputClasses}
                placeholder="Dorpsstraat 15"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              Notities
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className={inputClasses}
              placeholder="Geen website, alleen Facebook pagina. Geïnteresseerd in offerte."
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
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
      title: 'Welkom bij Webstability Marketing! 👋',
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 100 }}
        className={`w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl ${
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

        <div className="p-5 sm:p-8">
          {/* Icon */}
          <motion.div
            key={step}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center ${
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
            <h2 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentStep.title}
            </h2>
            <p className={`text-sm sm:text-base mb-3 sm:mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentStep.description}
            </p>
            <p className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg inline-block ${
              darkMode ? 'bg-gray-700 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            }`}>
              💡 {currentStep.tip}
            </p>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 sm:mt-8">
            <button
              onClick={onSkip}
              className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Overslaan
            </button>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
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
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
            >
              {step < steps.length - 1 ? (
                <>Volgende <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></>
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
        'Vul de bedrijfsgegevens in',
        'Voeg notities toe',
        'Klik op "Toevoegen"'
      ]
    },
    {
      title: '� Bedrijven zoeken',
      steps: [
        'Ga naar "Bedrijven Zoeken" tab',
        'Vul een stad of postcode in',
        'Optioneel: filter op type of bedrijfsnaam',
        'Klik op "Zoeken" en voeg leads toe'
      ]
    },
    {
      title: '🌐 Website analyseren',
      steps: [
        'Zoek bedrijven met een website',
        'Klik op "Analyseer" bij een bedrijf',
        'Bekijk de score (0-100, lager = verouderd)',
        'Verouderde sites zijn perfecte leads!'
      ]
    },
    {
      title: '�📧 Emails versturen',
      steps: [
        'Klik op "Email sturen" bij een lead',
        'Kies een email template',
        'Pas het bericht aan',
        'Klik op "Verstuur email"'
      ]
    },
    {
      title: '📅 Follow-ups plannen',
      steps: [
        'Klik op "Details" bij een lead',
        'Ga naar Follow-up sectie',
        'Kies een datum',
        'Je krijgt een melding'
      ]
    },
    {
      title: '📊 Status bijwerken',
      steps: [
        'Klik op het menu (⋮) bij een lead',
        'Kies de nieuwe status',
        'Funnel wordt bijgewerkt'
      ]
    }
  ]

  const tips = [
    { icon: '⭐', text: 'Markeer prioriteit leads met de ster voor snelle focus' },
    { icon: '🔍', text: 'Gebruik de zoekbalk om snel leads te vinden' },
    { icon: '🌐', text: 'Analyseer websites - verouderde sites = warme leads!' },
    { icon: '📊', text: 'Score onder 50 = website heeft update nodig' },
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 100 }}
        className={`w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Hulp
                </h2>
                <p className={`text-xs sm:text-sm hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
          <div className="flex gap-1 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto">
            {[
              { id: 'guide' as const, label: 'Handleiding', icon: <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
              { id: 'tips' as const, label: 'Tips', icon: <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
              { id: 'shortcuts' as const, label: 'Sneltoetsen', icon: <MousePointer className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[45vh] sm:max-h-[50vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'guide' && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4 sm:space-y-6"
              >
                {guides.map((guide, i) => (
                  <div key={i} className={`p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold mb-2 sm:mb-3 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {guide.title}
                    </h3>
                    <ol className="space-y-1.5 sm:space-y-2">
                      {guide.steps.map((step, j) => (
                        <li key={j} className={`flex items-start gap-2 sm:gap-3 text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium ${
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
                className="grid gap-2 sm:gap-3"
              >
                {tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                  >
                    <span className="text-lg sm:text-2xl">{tip.icon}</span>
                    <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tip.text}</span>
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
                className="space-y-2 sm:space-y-3"
              >
                <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Sneltoetsen (binnenkort)
                </p>
                {shortcuts.map((shortcut, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                  >
                    <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{shortcut.description}</span>
                    <kbd className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono ${
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
        <div className={`p-3 sm:p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between gap-2">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className="hidden sm:inline">Hulp nodig? </span>
              <a href="mailto:support@webstability.nl" className="text-emerald-600 hover:underline">support@webstability.nl</a>
            </p>
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs sm:text-sm"
            >
              Sluiten
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
