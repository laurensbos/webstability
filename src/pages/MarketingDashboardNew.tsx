import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  Plus,
  Send,
  Users,
  CheckCircle,
  X,
  Loader2,
  Trash2,
  Home
} from 'lucide-react'
import Logo from '../components/Logo'

// ===========================================
// TYPES
// ===========================================

interface Business {
  id: string
  name: string
  type: string
  address: string
  city: string
  postcode?: string
  phone?: string
  email?: string
  website?: string
  lat: number
  lon: number
}

interface Lead {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  status: 'nieuw' | 'gecontacteerd' | 'geinteresseerd' | 'offerte' | 'klant' | 'afgewezen'
  notes: string
  createdAt: string
  lastContact?: string
  emailsSent: number
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
}

// ===========================================
// CONSTANTS
// ===========================================

const businessTypes = [
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

const statusConfig: Record<Lead['status'], { color: string; bg: string; label: string }> = {
  nieuw: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Nieuw' },
  gecontacteerd: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Gecontacteerd' },
  geinteresseerd: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Geïnteresseerd' },
  offerte: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Offerte' },
  klant: { color: 'text-green-600', bg: 'bg-green-100', label: 'Klant!' },
  afgewezen: { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Afgewezen' },
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'intro',
    name: 'Eerste kennismaking',
    subject: 'Professionele website voor {{bedrijf}}?',
    body: `Beste {{naam}},

Ik zag dat {{bedrijf}} nog geen website heeft (of een verouderde). In 2025 zoekt 87% van de consumenten online voordat ze een aankoop doen.

Bij Webstability helpen we ondernemers zoals u aan een professionele website:

✓ Volledig verzorgd - wij regelen alles
✓ Vanaf €99 per maand - geen grote investering vooraf  
✓ Binnen 7 dagen online
✓ Inclusief hosting, SSL en updates

Zou u interesse hebben in een vrijblijvend gesprek?

Met vriendelijke groet,

Wesley
Webstability
info@webstability.nl
06-12345678`
  },
  {
    id: 'followup',
    name: 'Follow-up',
    subject: 'Even opvolgen - website voor {{bedrijf}}',
    body: `Beste {{naam}},

Vorige week stuurde ik u een bericht over een website voor {{bedrijf}}. 

Heeft u wellicht vragen? Of past een telefoontje beter?

Vriendelijke groet,

Wesley
Webstability`
  },
  {
    id: 'lokaal',
    name: 'Lokale benadering',
    subject: 'Collega-ondernemer uit de regio',
    body: `Beste {{naam}},

Als ondernemer uit de regio wil ik graag even kennismaken.

Wij helpen lokale ondernemers aan professionele websites - zonder technisch gedoe en tegen een eerlijke prijs.

• Persoonlijk contact
• Snel even langskomen kan altijd
• Al vanaf €99 per maand

Zullen we eens afspreken? Koffie is van mij!

Hartelijke groet,

Wesley
Webstability`
  },
]

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function MarketingDashboard() {
  // Search state
  const [searchCity, setSearchCity] = useState('')
  const [searchType, setSearchType] = useState('overig')
  const [searchRadius, setSearchRadius] = useState('5000')
  const [searchResults, setSearchResults] = useState<Business[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('alle')

  // Email state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTo, setEmailTo] = useState<Lead | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  // UI state
  const [activeTab, setActiveTab] = useState<'zoeken' | 'leads'>('zoeken')

  // Load leads from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('webstability_leads')
    if (saved) {
      try {
        setLeads(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load leads:', e)
      }
    }
  }, [])

  // Save leads to localStorage
  useEffect(() => {
    localStorage.setItem('webstability_leads', JSON.stringify(leads))
  }, [leads])

  // Search businesses
  const handleSearch = async () => {
    if (!searchCity.trim()) {
      setSearchError('Vul een stad of postcode in')
      return
    }

    setIsSearching(true)
    setSearchError('')
    setSearchResults([])

    try {
      const params = new URLSearchParams({
        city: searchCity,
        type: searchType,
        radius: searchRadius
      })

      const response = await fetch(`/api/marketing/search-businesses?${params}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.businesses)
        if (data.businesses.length === 0) {
          setSearchError('Geen bedrijven gevonden in dit gebied')
        }
      } else {
        setSearchError(data.error || 'Zoeken mislukt')
      }
    } catch (error) {
      setSearchError('Netwerkfout - probeer opnieuw')
    } finally {
      setIsSearching(false)
    }
  }

  // Add business to leads
  const addToLeads = (business: Business) => {
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
      status: 'nieuw',
      notes: `Type: ${business.type}`,
      createdAt: new Date().toISOString(),
      emailsSent: 0
    }

    setLeads(prev => [newLead, ...prev])
  }

  // Update lead
  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => 
      l.id === id ? { ...l, ...updates } : l
    ))
    if (selectedLead?.id === id) {
      setSelectedLead(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  // Delete lead
  const deleteLead = (id: string) => {
    if (confirm('Weet je zeker dat je deze lead wilt verwijderen?')) {
      setLeads(prev => prev.filter(l => l.id !== id))
      if (selectedLead?.id === id) {
        setSelectedLead(null)
      }
    }
  }

  // Open email modal
  const openEmailModal = (lead: Lead) => {
    setEmailTo(lead)
    setSelectedTemplate(null)
    setEmailSubject('')
    setEmailBody('')
    setShowEmailModal(true)
  }

  // Select template
  const selectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    
    // Replace placeholders
    const replacePlaceholders = (text: string) => {
      return text
        .replace(/\{\{bedrijf\}\}/g, emailTo?.companyName || '')
        .replace(/\{\{naam\}\}/g, emailTo?.contactPerson || 'heer/mevrouw')
        .replace(/\{\{stad\}\}/g, emailTo?.city || '')
    }

    setEmailSubject(replacePlaceholders(template.subject))
    setEmailBody(replacePlaceholders(template.body))
  }

  // Send email
  const sendEmail = async () => {
    if (!emailTo?.email || !emailSubject || !emailBody) {
      alert('Vul alle velden in')
      return
    }

    setIsSending(true)

    try {
      const response = await fetch('/api/marketing/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailTo.email,
          subject: emailSubject,
          body: emailBody,
          leadId: emailTo.id
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update lead
        updateLead(emailTo.id, {
          status: emailTo.status === 'nieuw' ? 'gecontacteerd' : emailTo.status,
          lastContact: new Date().toISOString(),
          emailsSent: emailTo.emailsSent + 1
        })

        setShowEmailModal(false)
        alert('Email verstuurd!')
      } else {
        alert(`Fout: ${data.error}`)
      }
    } catch (error) {
      alert('Versturen mislukt - probeer opnieuw')
    } finally {
      setIsSending(false)
    }
  }

  // Filter leads
  const filteredLeads = leads.filter(l => 
    statusFilter === 'alle' || l.status === statusFilter
  )

  // Stats
  const stats = {
    total: leads.length,
    nieuw: leads.filter(l => l.status === 'nieuw').length,
    gecontacteerd: leads.filter(l => l.status === 'gecontacteerd').length,
    klanten: leads.filter(l => l.status === 'klant').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="hover:opacity-80 transition-opacity">
                <Logo />
              </a>
              <div className="hidden sm:block">
                <span className="text-sm text-gray-500">Sales Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href="/"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Naar homepage"
              >
                <Home className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Totaal leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.nieuw}</div>
              <div className="text-xs text-gray-500">Nieuw</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.gecontacteerd}</div>
              <div className="text-xs text-gray-500">Gecontacteerd</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.klanten}</div>
              <div className="text-xs text-gray-500">Klanten</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('zoeken')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'zoeken'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Bedrijven zoeken
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'leads'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Mijn leads ({leads.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'zoeken' && (
          <div className="space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🔍 Zoek bedrijven in de buurt
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stad of postcode
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      placeholder="bijv. Leiden of 2312"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type bedrijf
                  </label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {businessTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Straal
                  </label>
                  <select
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="1000">1 km</option>
                    <option value="3000">3 km</option>
                    <option value="5000">5 km</option>
                    <option value="10000">10 km</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Zoeken...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Zoeken
                  </>
                )}
              </button>

              {searchError && (
                <p className="mt-3 text-sm text-red-600">{searchError}</p>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    {searchResults.length} bedrijven gevonden
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {searchResults.map((business) => {
                    const isAdded = leads.some(l => l.id === business.id)
                    
                    return (
                      <div key={business.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {business.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {business.address}, {business.city}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
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
                                  className="flex items-center gap-1 text-primary-600 hover:underline"
                                >
                                  <Globe className="w-3 h-3" />
                                  Website
                                </a>
                              )}
                              <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                                {business.type}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => addToLeads(business)}
                            disabled={isAdded}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isAdded
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : 'bg-primary-500 hover:bg-primary-600 text-white'
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
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-sm text-gray-500 flex-shrink-0">Filter:</span>
              {['alle', 'nieuw', 'gecontacteerd', 'geinteresseerd', 'offerte', 'klant', 'afgewezen'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'alle' ? 'Alle' : statusConfig[status as Lead['status']]?.label || status}
                </button>
              ))}
            </div>

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Nog geen leads</h3>
                <p className="text-sm text-gray-500">
                  Zoek bedrijven en voeg ze toe aan je lijst
                </p>
                <button
                  onClick={() => setActiveTab('zoeken')}
                  className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Bedrijven zoeken
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {lead.companyName}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[lead.status].bg} ${statusConfig[lead.status].color}`}>
                            {statusConfig[lead.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {lead.address}, {lead.city}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary-600">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </a>
                          )}
                          {lead.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </span>
                          )}
                          {lead.emailsSent > 0 && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Send className="w-3 h-3" />
                              {lead.emailsSent}x gemaild
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLead(lead.id, { status: e.target.value as Lead['status'] })}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary-500"
                        >
                          {Object.entries(statusConfig).map(([value, config]) => (
                            <option key={value} value={value}>{config.label}</option>
                          ))}
                        </select>
                        
                        <button
                          onClick={() => openEmailModal(lead)}
                          disabled={!lead.email}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={lead.email ? 'Email versturen' : 'Geen email adres'}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    {lead.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">{lead.notes}</p>
                      </div>
                    )}

                    {/* Edit contact person / email */}
                    {!lead.email && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-yellow-700 mb-2">
                          ⚠️ Geen email adres - voeg toe om te kunnen mailen
                        </p>
                        <input
                          type="email"
                          placeholder="Email toevoegen..."
                          className="w-full text-sm px-3 py-1.5 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                          onBlur={(e) => {
                            if (e.target.value) {
                              updateLead(lead.id, { email: e.target.value })
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                              updateLead(lead.id, { email: (e.target as HTMLInputElement).value })
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && emailTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">Email versturen</h2>
                  <p className="text-sm text-gray-500">Naar: {emailTo.companyName}</p>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Template selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kies een template
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {emailTemplates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => selectTemplate(t)}
                        className={`p-3 text-left rounded-lg border-2 transition-colors ${
                          selectedTemplate?.id === t.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium text-sm text-gray-900">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aan
                  </label>
                  <input
                    type="email"
                    value={emailTo.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Onderwerp
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Onderwerp..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bericht
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={12}
                    placeholder="Typ je bericht..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Verstuurd vanaf: info@webstability.nl
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={sendEmail}
                    disabled={isSending || !emailSubject || !emailBody}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Versturen...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Versturen
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
