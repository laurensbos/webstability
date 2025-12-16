import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Tag, Share2, Bookmark, ChevronRight, Sparkles, ArrowRight, BookOpen } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getArticleById, getRelatedArticles } from '../data/articles'

// Floating particles for hero and CTA
function FloatingParticles({ variant = 'blue' }: { variant?: 'blue' | 'white' }) {
  const particles = [
    { size: 6, x: '8%', y: '25%', delay: 0, duration: 6 },
    { size: 8, x: '88%', y: '20%', delay: 1.2, duration: 7 },
    { size: 5, x: '20%', y: '75%', delay: 0.5, duration: 5.5 },
    { size: 7, x: '80%', y: '70%', delay: 1.8, duration: 6.5 },
    { size: 4, x: '45%', y: '12%', delay: 0.8, duration: 5 },
    { size: 6, x: '95%', y: '55%', delay: 2, duration: 7.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            background: variant === 'white' 
              ? `rgba(255, 255, 255, ${0.2 + (i % 3) * 0.15})`
              : `rgba(59, 130, 246, ${0.15 + (i % 3) * 0.1})`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleById(slug) : undefined
  const relatedArticles = slug ? getRelatedArticles(slug, 3) : []

  if (!article) {
    return <Navigate to="/kennisbank" replace />
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Convert markdown-like content to HTML
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: JSX.Element[] = []
    let currentList: string[] = []
    let listType: 'ul' | 'ol' | 'checklist' | null = null
    let inTable = false
    let tableRows: string[][] = []

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        if (listType === 'checklist') {
          elements.push(
            <ul key={elements.length} className="space-y-2 my-4">
              {currentList.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <input type="checkbox" disabled className="mt-1 rounded border-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          )
        } else if (listType === 'ol') {
          elements.push(
            <ol key={elements.length} className="list-decimal list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
              {currentList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ol>
          )
        } else {
          elements.push(
            <ul key={elements.length} className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
              {currentList.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          )
        }
        currentList = []
        listType = null
      }
    }

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={elements.length} className="overflow-x-auto my-6">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {tableRows[0].map((cell, i) => (
                    <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(2).map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-sm text-gray-700 border-b">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableRows = []
        inTable = false
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()

      // Skip empty lines but flush lists
      if (!trimmedLine) {
        flushList()
        flushTable()
        continue
      }

      // Table detection
      if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        flushList()
        inTable = true
        const cells = trimmedLine.split('|').filter(c => c.trim()).map(c => c.trim())
        // Skip separator row
        if (!cells.every(c => c.match(/^[-:]+$/))) {
          tableRows.push(cells)
        }
        continue
      } else if (inTable) {
        flushTable()
      }

      // Headers
      if (trimmedLine.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        )
        continue
      }

      if (trimmedLine.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={elements.length} className="text-xl font-semibold text-gray-900 mt-8 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        )
        continue
      }

      // Bold text headers (like **1. Title**)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList()
        elements.push(
          <p key={elements.length} className="font-semibold text-gray-900 mt-6 mb-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        )
        continue
      }

      // Checklist items
      if (trimmedLine.startsWith('- [ ]') || trimmedLine.startsWith('- [x]')) {
        if (listType !== 'checklist') flushList()
        listType = 'checklist'
        currentList.push(trimmedLine.replace(/- \[[ x]\] /, ''))
        continue
      }

      // Unordered list
      if (trimmedLine.startsWith('- ')) {
        if (listType !== 'ul') flushList()
        listType = 'ul'
        // Handle bold in list items
        const text = trimmedLine.replace('- ', '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        currentList.push(text)
        continue
      }

      // Ordered list
      if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== 'ol') flushList()
        listType = 'ol'
        const text = trimmedLine.replace(/^\d+\.\s/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        currentList.push(text)
        continue
      }

      // Regular paragraph
      flushList()
      // Handle inline formatting
      const formattedText = trimmedLine
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')

      elements.push(
        <p 
          key={elements.length} 
          className="text-gray-700 leading-relaxed my-4"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      )
    }

    flushList()
    flushTable()

    return elements
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50" />
          
          {/* Animated background blobs */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Floating particles */}
          <FloatingParticles variant="blue" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto"
            >
              <Link to="/" className="hover:text-primary-600 transition-colors whitespace-nowrap">Home</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <Link to="/kennisbank" className="hover:text-primary-600 transition-colors whitespace-nowrap">Kennisbank</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-gray-900 truncate">{article.category}</span>
            </motion.nav>

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link 
                to="/kennisbank"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-6 sm:mb-8 text-sm sm:text-base group"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Terug naar Kennisbank</span>
              </Link>
            </motion.div>

            {/* Article header card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-lg shadow-gray-900/5"
            >
              {/* Category badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 text-xs sm:text-sm font-medium rounded-full">
                  <BookOpen className="w-3.5 h-3.5" />
                  {article.category}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                {article.title}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
                    {article.author.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{article.author}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  <span>{article.readTime} min leestijd</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid lg:grid-cols-[1fr,280px] gap-8 lg:gap-12"
            >
              {/* Main content */}
              <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary-600 prose-strong:text-gray-900 dark:prose-strong:text-white dark:prose-invert">
                {renderContent(article.content)}

                {/* Tags */}
                <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200 not-prose">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 mr-1">Tags:</span>
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-6 lg:mt-8 flex items-center gap-4 not-prose">
                  <span className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">Deel dit artikel:</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: article.title, url: window.location.href })
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                        }
                      }}
                      className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-600 dark:text-gray-400 hover:text-primary-600 rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-600 dark:text-gray-400 hover:text-primary-600 rounded-lg transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-32 space-y-6">
                  {/* CTA Card */}
                  <div className="relative p-6 bg-gradient-to-br from-primary-600 via-primary-600 to-blue-700 rounded-2xl text-white overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Klaar voor je eigen website?</h3>
                      <p className="text-primary-100 text-sm mb-5 leading-relaxed">
                        Professionele website vanaf €96/maand (incl. BTW).
                      </p>
                      <Link
                        to="/start"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-gray-900 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all group"
                      >
                        <span>Start je project</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Related articles */}
                  {relatedArticles.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary-600" />
                        Gerelateerde artikelen
                      </h4>
                      <div className="space-y-3">
                        {relatedArticles.map((related) => (
                          <Link
                            key={related.id}
                            to={`/kennisbank/${related.id}`}
                            className="block p-3 bg-white dark:bg-gray-900 rounded-xl hover:shadow-md transition-all border border-gray-100 group"
                          >
                            <span className="text-xs text-primary-600 font-medium">{related.category}</span>
                            <h5 className="text-sm font-medium text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                              {related.title}
                            </h5>
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{related.readTime} min</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </motion.div>
          </div>
        </section>

        {/* Related articles mobile */}
        {relatedArticles.length > 0 && (
          <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-800 lg:hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Gerelateerde artikelen</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/kennisbank/${related.id}`}
                    className="block p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <span className="text-[10px] sm:text-xs text-primary-600 font-medium">{related.category}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mt-1.5 sm:mt-2 mb-1.5 sm:mb-2 line-clamp-2">{related.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{related.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-10 lg:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          </div>
          
          {/* Floating particles */}
          <FloatingParticles variant="white" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white/90">Professionele websites</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4"
            >
              Klaar om te beginnen?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-primary-100 text-sm sm:text-base lg:text-lg mb-6 lg:mb-8 max-w-2xl mx-auto"
            >
              Een professionele website hoeft niet ingewikkeld te zijn. Wij regelen alles voor je, zodat jij kunt focussen op ondernemen.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <Link
                to="/start"
                className="group inline-flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-white dark:bg-gray-900 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all hover:-translate-y-0.5 shadow-lg text-sm lg:text-base"
              >
                <span>Start je project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/kennisbank"
                className="px-6 lg:px-8 py-3 lg:py-4 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/25 transition-all border border-white/20 text-sm lg:text-base"
              >
                Lees meer artikelen
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
