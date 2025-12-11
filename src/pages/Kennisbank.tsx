import { motion } from 'framer-motion'
import { Search, Clock, ArrowRight, TrendingUp, Bookmark, BookOpen, Users, Zap, DollarSign, Lightbulb, Briefcase, BarChart3, Settings, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { articles } from '../data/articles'

// Category config with icons and colors
const categoryConfig: Record<string, { icon: typeof BookOpen; color: string; bg: string }> = {
  'Kosten': { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Tips': { icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50' },
  'ZZP': { icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
  'SEO': { icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
  'Techniek': { icon: Settings, color: 'text-rose-600', bg: 'bg-rose-50' },
}

const categories = [
  { name: 'Alle artikelen', count: articles.length, icon: Sparkles },
  { name: 'Kosten', count: articles.filter(a => a.category === 'Kosten').length, icon: DollarSign },
  { name: 'Tips', count: articles.filter(a => a.category === 'Tips').length, icon: Lightbulb },
  { name: 'ZZP', count: articles.filter(a => a.category === 'ZZP').length, icon: Briefcase },
  { name: 'SEO', count: articles.filter(a => a.category === 'SEO').length, icon: BarChart3 },
  { name: 'Techniek', count: articles.filter(a => a.category === 'Techniek').length, icon: Settings },
]

export default function Kennisbank() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Alle artikelen')

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = activeCategory === 'Alle artikelen' || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const trendingArticles = articles.filter(a => a.trending)
  const featuredArticle = articles.find(a => a.featured)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-100/40 via-primary-50/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <span className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4">
                Kennisbank
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Alles over websites{' '}
                <span className="text-primary-600">voor ondernemers</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Praktische tips, handleidingen en inzichten om het maximale uit je online aanwezigheid te halen.
              </p>

              {/* Search bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek artikelen..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-lg shadow-gray-100"
                />
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
            >
              {[
                { icon: BookOpen, value: `${articles.length}+`, label: 'Artikelen' },
                { icon: Users, value: '5.000+', label: 'Lezers/maand' },
                { icon: Zap, value: '100%', label: 'Gratis toegang' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <stat.icon className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="py-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                to={`/kennisbank/${featuredArticle.id}`}
                className="group block bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 rounded-2xl p-8 md:p-12 text-white hover:shadow-2xl hover:shadow-primary-500/25 transition-all relative overflow-hidden"
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>
                
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                      ⭐ Uitgelicht artikel
                    </span>
                    <span className="flex items-center gap-1 text-primary-100 text-sm">
                      <Clock className="w-4 h-4" />
                      {featuredArticle.readTime} min lezen
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:underline">
                    {featuredArticle.title}
                  </h2>
                  
                  <p className="text-primary-100 mb-6 max-w-xl">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                    Lees het volledige artikel
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Category Tabs */}
        <section className="py-8 border-b border-gray-100 sticky top-16 bg-white/95 backdrop-blur-sm z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === category.name
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeCategory === category.name
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Trending Articles */}
        <section className="py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Populaire artikelen</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {trendingArticles.map((article, index) => {
                const config = categoryConfig[article.category] || categoryConfig['Tips']
                const CategoryIcon = config.icon
                return (
                  <motion.a
                    key={article.id}
                    href={`/kennisbank/${article.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all"
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Trending badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Populair
                      </span>
                      
                      {/* Category icon */}
                      <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                        <CategoryIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium ${config.color}`}>
                          {article.category}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          {article.readTime} min
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Main Content - Articles Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeCategory}
              </h2>
              <span className="text-gray-500 text-sm">
                {filteredArticles.length} artikel{filteredArticles.length !== 1 ? 'en' : ''}
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Geen artikelen gevonden voor "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-primary-600 font-medium hover:underline"
                >
                  Wis zoekopdracht
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => {
                  const config = categoryConfig[article.category] || categoryConfig['Tips']
                  const CategoryIcon = config.icon
                  return (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all"
                    >
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        {/* Category badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full ${config.bg} flex items-center gap-1.5`}>
                          <CategoryIcon className={`w-3.5 h-3.5 ${config.color}`} />
                          <span className={`text-xs font-medium ${config.color}`}>
                            {article.category}
                          </span>
                        </div>

                        {/* Trending badge */}
                        {article.trending && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Populair
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{article.readTime} min lezen</span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          <a href={`/kennisbank/${article.id}`}>
                            {article.title}
                          </a>
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        <a
                          href={`/kennisbank/${article.id}`}
                          className="inline-flex items-center gap-1.5 text-primary-600 font-medium text-sm group-hover:gap-2.5 transition-all"
                        >
                          Lees artikel
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            )}

            {/* Help CTA inline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                    <Bookmark className="w-7 h-7 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Hulp nodig met je website?</h3>
                    <p className="text-gray-400">Laat ons je website bouwen terwijl jij je focust op ondernemen.</p>
                  </div>
                </div>
                <a
                  href="/start"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 whitespace-nowrap"
                >
                  Start je project
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Liever direct aan de slag?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Laat het bouwen van je website aan ons over. Binnen 7 dagen online, inclusief alles wat je nodig hebt.
              </p>
              <a
                href="/start"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                Start je project
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
