import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Check, X, Loader2, Globe, ArrowRight } from 'lucide-react'

type DomainResult = {
  domain: string
  available: boolean
  price?: string
}

// Echte domain check via DNS lookup
async function checkDomainAvailability(domain: string): Promise<DomainResult[]> {
  // Normaliseer domain input - verwijder extensie als die al is ingevoerd
  let cleanDomain = domain.toLowerCase().trim()
  cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/, '')
  cleanDomain = cleanDomain.replace(/\.(nl|com|eu|online|net|org|io|shop|be|de)$/i, '')
  cleanDomain = cleanDomain.replace(/[^a-z0-9-]/g, '')
  
  if (!cleanDomain || cleanDomain.length < 2) {
    return []
  }

  const extensions = [
    { ext: '.nl', price: '€9,99/jaar' },
    { ext: '.com', price: '€12,99/jaar' },
    { ext: '.eu', price: '€8,99/jaar' },
    { ext: '.online', price: '€14,99/jaar' },
  ]

  // Check elk domein via DNS lookup
  const results = await Promise.all(
    extensions.map(async ({ ext, price }) => {
      const fullDomain = cleanDomain + ext
      const available = await checkSingleDomain(fullDomain)
      return {
        domain: fullDomain,
        available,
        price,
      }
    })
  )

  return results
}

// Check een enkel domein via DNS-gebaseerde API
async function checkSingleDomain(domain: string): Promise<boolean> {
  try {
    // Gebruik een publieke DNS API om te checken of het domein bestaat
    // We proberen de DNS records op te halen - als er geen zijn, is het domein waarschijnlijk beschikbaar
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
      { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      }
    )
    
    if (!response.ok) {
      // Bij een fout, neem aan dat we het niet kunnen checken
      return false
    }
    
    const data = await response.json()
    
    // Status 3 = NXDOMAIN (domein bestaat niet) = beschikbaar
    // Status 0 = NOERROR (domein bestaat) = niet beschikbaar
    // Als er Answer records zijn, bestaat het domein
    if (data.Status === 3) {
      return true // Domein bestaat niet, dus beschikbaar
    }
    
    if (data.Status === 0) {
      // Domein bestaat, maar we moeten ook checken of er daadwerkelijk records zijn
      // Sommige domeinen zijn geregistreerd maar hebben geen DNS records
      if (data.Answer && data.Answer.length > 0) {
        return false // Heeft DNS records, dus in gebruik
      }
      // Geen Answer maar ook geen NXDOMAIN - waarschijnlijk geregistreerd
      return false
    }
    
    // Voor andere statussen, doe een extra check via NS records
    const nsResponse = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`,
      { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      }
    )
    
    if (nsResponse.ok) {
      const nsData = await nsResponse.json()
      if (nsData.Status === 3) {
        return true // NXDOMAIN = beschikbaar
      }
      if (nsData.Answer && nsData.Answer.length > 0) {
        return false // Heeft NS records = geregistreerd
      }
    }
    
    return false // Bij twijfel, zeg niet beschikbaar
  } catch (error) {
    console.error(`Error checking ${domain}:`, error)
    // Bij timeout of andere errors, kunnen we niet zeker zijn
    return false
  }
}

export default function DomainChecker() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DomainResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    setHasSearched(true)
    setError(null)

    try {
      const domainResults = await checkDomainAvailability(query.trim())
      if (domainResults.length === 0) {
        setError('Voer een geldige domeinnaam in (minimaal 2 karakters)')
      }
      setResults(domainResults)
    } catch (err) {
      console.error('Error checking domain:', err)
      setError('Er ging iets mis bij het controleren. Probeer het opnieuw.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const availableDomains = results.filter(r => r.available)
  const unavailableDomains = results.filter(r => !r.available)

  return (
    <section id="domain-checker" className="py-16 lg:py-32 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-primary-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3 lg:mb-4"
          >
            Domeinchecker
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4"
          >
            Vind jouw perfecte{' '}
            <span className="text-primary-600">
              domeinnaam
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto"
          >
            Check direct of jouw gewenste domeinnaam nog beschikbaar is. 
            Domeinregistratie is bij alle pakketten inbegrepen.
          </motion.p>
        </div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoek je domeinnaam (bijv. mijnbedrijf)"
                className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-base lg:text-lg shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 lg:px-8 py-3 lg:py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 text-sm lg:text-base"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
              ) : (
                <Search className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
              <span>Controleer</span>
            </button>
          </div>
        </motion.form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 lg:py-12"
            >
              <Loader2 className="w-6 h-6 lg:w-8 lg:h-8 text-primary-500 animate-spin mx-auto mb-3 lg:mb-4" />
              <p className="text-gray-600 text-sm lg:text-base">Domeinen controleren...</p>
            </motion.div>
          )}

          {!isLoading && hasSearched && results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3 lg:space-y-4"
            >
              {/* Beschikbare domeinen */}
              {availableDomains.length > 0 && (
                <div className="space-y-2 lg:space-y-3">
                  <h3 className="text-gray-900 font-semibold flex items-center gap-2 text-sm lg:text-base">
                    <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
                    Beschikbaar ({availableDomains.length})
                  </h3>
                  {availableDomains.map((result, index) => (
                    <motion.div
                      key={result.domain}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4 p-3 lg:p-4 bg-white border border-green-200 rounded-xl hover:border-green-300 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium text-base lg:text-lg">{result.domain}</div>
                          <div className="text-gray-500 text-xs lg:text-sm">{result.price}</div>
                        </div>
                      </div>
                      <a
                        href={`/start?domain=${encodeURIComponent(result.domain)}`}
                        className="group px-4 lg:px-5 py-2 lg:py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 text-sm"
                      >
                        Start project
                        <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Niet beschikbare domeinen */}
              {unavailableDomains.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="text-gray-500 font-semibold flex items-center gap-2">
                    <X className="w-5 h-5 text-red-400" />
                    Niet beschikbaar ({unavailableDomains.length})
                  </h3>
                  {unavailableDomains.map((result, index) => (
                    <motion.div
                      key={result.domain}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl opacity-60"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <X className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="text-gray-600 font-medium">{result.domain}</div>
                        <div className="text-gray-400 text-sm">Reeds geregistreerd</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* CTA als er beschikbare domeinen zijn */}
              {availableDomains.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 p-6 bg-primary-50 border border-primary-100 rounded-2xl text-center"
                >
                  <p className="text-gray-900 font-medium mb-2">
                    🎉 Goed nieuws! Er zijn domeinen beschikbaar.
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Domeinregistratie is inbegrepen bij al onze pakketten. 
                    Klik hierboven op je favoriete domein om direct te starten.
                  </p>
                  <a
                    href={`/start?domain=${encodeURIComponent(availableDomains[0].domain)}`}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Start met {availableDomains[0].domain}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">{error || 'Geen resultaten gevonden. Probeer een andere zoekterm.'}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggesties als er nog niet gezocht is */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-gray-500 text-sm mb-4">Populaire extensies:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['.nl', '.com', '.eu', '.online', '.shop'].map((ext) => (
                <span
                  key={ext}
                  className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-gray-600 text-sm"
                >
                  {ext}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
