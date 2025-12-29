import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
        setError(t('domainChecker.invalidDomain'))
      }
      setResults(domainResults)
    } catch (err) {
      console.error('Error checking domain:', err)
      setError(t('domainChecker.errorChecking'))
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const availableDomains = results.filter(r => r.available)
  const unavailableDomains = results.filter(r => !r.available)

  return (
    <section id="domain-checker" className="py-16 lg:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-primary-100/50 dark:bg-primary-900/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3 lg:mb-4"
          >
            {t('domainChecker.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4"
          >
            {t('domainChecker.title')}{' '}
            <span className="text-primary-600 dark:text-primary-400">
              {t('domainChecker.titleHighlight')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-base lg:text-lg max-w-2xl mx-auto"
          >
            {t('domainChecker.subtitle')}
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
                placeholder={t('domainChecker.placeholder')}
                className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-base lg:text-lg shadow-sm"
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
              <span>{t('domainChecker.check')}</span>
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
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">{t('domainChecker.checking')}</p>
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
                  <h3 className="text-gray-900 dark:text-white font-semibold flex items-center gap-2 text-sm lg:text-base">
                    <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
                    {t('domainChecker.available')} ({availableDomains.length})
                  </h3>
                  {availableDomains.map((result, index) => (
                    <motion.div
                      key={result.domain}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4 p-3 lg:p-4 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-xl hover:border-green-300 dark:hover:border-green-700 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-medium text-base lg:text-lg">{result.domain}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">{result.price}</div>
                        </div>
                      </div>
                      <a
                        href={`/start?domain=${encodeURIComponent(result.domain)}`}
                        className="group px-4 lg:px-5 py-2 lg:py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 text-sm"
                      >
                        {t('domainChecker.startProject')}
                        <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Niet beschikbare domeinen */}
              {unavailableDomains.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <X className="w-5 h-5 text-red-400" />
                    {t('domainChecker.notAvailable')} ({unavailableDomains.length})
                  </h3>
                  {unavailableDomains.map((result, index) => (
                    <motion.div
                      key={result.domain}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl opacity-60"
                    >
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <X className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-300 font-medium">{result.domain}</div>
                        <div className="text-gray-400 text-sm">{t('domainChecker.alreadyRegistered')}</div>
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
                  className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-2xl text-center"
                >
                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                    {t('domainChecker.goodNews')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {t('domainChecker.domainIncluded')}
                  </p>
                  <a
                    href={`/start?domain=${encodeURIComponent(availableDomains[0].domain)}`}
                    className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                  >
                    {t('domainChecker.startWith')} {availableDomains[0].domain}
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
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">{error || t('domainChecker.noResults')}</p>
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
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t('domainChecker.popularExtensions')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['.nl', '.com', '.eu', '.online', '.shop'].map((ext) => (
                <span
                  key={ext}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 text-sm"
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
