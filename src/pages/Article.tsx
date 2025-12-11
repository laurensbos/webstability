import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Tag, Share2, Bookmark, ChevronRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getArticleById, getRelatedArticles } from '../data/articles'

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
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          )
        } else if (listType === 'ol') {
          elements.push(
            <ol key={elements.length} className="list-decimal list-inside space-y-2 my-4 text-gray-700">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          )
        } else {
          elements.push(
            <ul key={elements.length} className="list-disc list-inside space-y-2 my-4 text-gray-700">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
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
              <thead className="bg-gray-50">
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
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-gray-500 mb-8"
            >
              <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/kennisbank" className="hover:text-primary-600 transition-colors">Kennisbank</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{article.category}</span>
            </motion.nav>

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link 
                to="/kennisbank"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Terug naar Kennisbank</span>
              </Link>
            </motion.div>

            {/* Article header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4">
                {article.category}
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                {article.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min leestijd</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">{article.author}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid lg:grid-cols-[1fr,250px] gap-12"
            >
              {/* Main content */}
              <article className="prose prose-lg max-w-none">
                {renderContent(article.content)}

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-8 flex items-center gap-4">
                  <span className="text-gray-600 font-medium">Deel dit artikel:</span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-32 space-y-8">
                  {/* CTA */}
                  <div className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white">
                    <h3 className="font-bold text-lg mb-2">Klaar voor je eigen website?</h3>
                    <p className="text-primary-100 text-sm mb-4">
                      Professionele website vanaf €79/maand, inclusief alles.
                    </p>
                    <Link
                      to="/start"
                      className="block w-full py-2 bg-white text-primary-600 text-center font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Start je project
                    </Link>
                  </div>

                  {/* Related articles */}
                  {relatedArticles.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Gerelateerde artikelen</h4>
                      <div className="space-y-4">
                        {relatedArticles.map((related) => (
                          <Link
                            key={related.id}
                            to={`/kennisbank/${related.id}`}
                            className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-xs text-primary-600 font-medium">{related.category}</span>
                            <h5 className="text-sm font-medium text-gray-900 mt-1 line-clamp-2">
                              {related.title}
                            </h5>
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
          <section className="py-12 bg-gray-50 lg:hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Gerelateerde artikelen</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/kennisbank/${related.id}`}
                    className="block p-6 bg-white rounded-xl hover:shadow-md transition-shadow"
                  >
                    <span className="text-xs text-primary-600 font-medium">{related.category}</span>
                    <h4 className="font-semibold text-gray-900 mt-2 mb-2">{related.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Een professionele website hoeft niet ingewikkeld te zijn. Wij regelen alles voor je, zodat jij kunt focussen op ondernemen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/start"
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Start je project
              </Link>
              <Link
                to="/kennisbank"
                className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
              >
                Lees meer artikelen
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
