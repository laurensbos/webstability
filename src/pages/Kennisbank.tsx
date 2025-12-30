import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  Search, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Zap, 
  DollarSign, 
  Lightbulb, 
  Briefcase, 
  BarChart3, 
  Settings, 
  Sparkles,
  GraduationCap
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { articles as articlesNl } from '../data/articles'
import { articlesEn } from '../data/articles-en'

// Floating particles component with primary/blue accents
function FloatingParticles() {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
    { size: 6, x: '20%', y: '60%', delay: 1, duration: 5 },
    { size: 3, x: '80%', y: '30%', delay: 0.5, duration: 4.5 },
    { size: 5, x: '70%', y: '70%', delay: 1.5, duration: 5.5 },
    { size: 4, x: '90%', y: '50%', delay: 2, duration: 4 },
    { size: 7, x: '15%', y: '80%', delay: 0.8, duration: 6 },
    { size: 3, x: '60%', y: '15%', delay: 1.2, duration: 4.2 },
    { size: 5, x: '40%', y: '85%', delay: 0.3, duration: 5.3 },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary-400 to-blue-500 dark:from-primary-500 dark:to-blue-600"
          style={{ 
            width: p.size, 
            height: p.size, 
            left: p.x, 
            top: p.y,
            opacity: 0.4 + (p.size / 20)
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
  )
}

// Category config with icons and colors - supports both NL and EN categories
const categoryConfig: Record<string, { icon: typeof BookOpen; color: string; darkColor: string; bg: string; darkBg: string; gradient: string }> = {
  'Kosten': { icon: DollarSign, color: 'text-emerald-600', darkColor: 'dark:text-emerald-400', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/30', gradient: 'from-emerald-500 to-green-600' },
  'Pricing': { icon: DollarSign, color: 'text-emerald-600', darkColor: 'dark:text-emerald-400', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/30', gradient: 'from-emerald-500 to-green-600' },
  'Tips': { icon: Lightbulb, color: 'text-amber-600', darkColor: 'dark:text-amber-400', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/30', gradient: 'from-amber-500 to-orange-600' },
  'ZZP': { icon: Briefcase, color: 'text-purple-600', darkColor: 'dark:text-purple-400', bg: 'bg-purple-50', darkBg: 'dark:bg-purple-900/30', gradient: 'from-purple-500 to-violet-600' },
  'Freelance': { icon: Briefcase, color: 'text-purple-600', darkColor: 'dark:text-purple-400', bg: 'bg-purple-50', darkBg: 'dark:bg-purple-900/30', gradient: 'from-purple-500 to-violet-600' },
  'SEO': { icon: BarChart3, color: 'text-blue-600', darkColor: 'dark:text-blue-400', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/30', gradient: 'from-blue-500 to-indigo-600' },
  'Techniek': { icon: Settings, color: 'text-rose-600', darkColor: 'dark:text-rose-400', bg: 'bg-rose-50', darkBg: 'dark:bg-rose-900/30', gradient: 'from-rose-500 to-pink-600' },
  'Technical': { icon: Settings, color: 'text-rose-600', darkColor: 'dark:text-rose-400', bg: 'bg-rose-50', darkBg: 'dark:bg-rose-900/30', gradient: 'from-rose-500 to-pink-600' },
}

// Category keys for filtering - maps translated category to filter key
const categoryFilterKeys = {
  nl: { costs: 'Kosten', zzp: 'ZZP', tech: 'Techniek' },
  en: { costs: 'Pricing', zzp: 'Freelance', tech: 'Technical' }
}

export default function Kennisbank() {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  
  // Get the correct articles based on current language
  const isEnglish = i18n.language === 'en'
  const articles = isEnglish ? articlesEn : articlesNl
  const catKeys = isEnglish ? categoryFilterKeys.en : categoryFilterKeys.nl

  const categories = [
    { name: t('knowledgeBase.categories.all'), key: 'all', count: articles.length, icon: Sparkles },
    { name: t('knowledgeBase.categories.costs'), key: catKeys.costs, count: articles.filter(a => a.category === catKeys.costs).length, icon: DollarSign },
    { name: t('knowledgeBase.categories.tips'), key: 'Tips', count: articles.filter(a => a.category === 'Tips').length, icon: Lightbulb },
    { name: t('knowledgeBase.categories.zzp'), key: catKeys.zzp, count: articles.filter(a => a.category === catKeys.zzp).length, icon: Briefcase },
    { name: t('knowledgeBase.categories.seo'), key: 'SEO', count: articles.filter(a => a.category === 'SEO').length, icon: BarChart3 },
    { name: t('knowledgeBase.categories.tech'), key: catKeys.tech, count: articles.filter(a => a.category === catKeys.tech).length, icon: Settings },
  ]

  const stats = [
    { icon: BookOpen, value: `${articles.length}+`, label: t('knowledgeBase.stats.articles') },
    { icon: Users, value: '5.000+', label: t('knowledgeBase.stats.readers') },
    { icon: Zap, value: '100%', label: t('knowledgeBase.stats.free') },
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const trendingArticles = articles.filter(a => a.trending).slice(0, 3)
  const featuredArticle = articles.find(a => a.featured)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-primary-200/60 via-blue-100/40 to-indigo-100/30 dark:from-primary-900/40 dark:via-blue-900/30 dark:to-indigo-900/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-100/50 via-primary-100/40 to-transparent dark:from-blue-900/30 dark:via-primary-900/20 dark:to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <FloatingParticles />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f120_1px,transparent_1px),linear-gradient(to_bottom,#6366f120_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#6366f110_1px,transparent_1px),linear-gradient(to_bottom,#6366f110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            <div className="absolute top-20 right-20 w-32 h-32 border border-primary-200/30 dark:border-primary-700/30 rounded-full" />
            <div className="absolute top-24 right-24 w-24 h-24 border border-primary-300/20 dark:border-primary-600/20 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/50 dark:to-blue-900/50 border border-primary-200/50 dark:border-primary-700/50 rounded-full px-4 py-2 mb-6"
                >
                  <GraduationCap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t('knowledgeBase.badge')}</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {t('knowledgeBase.title')}{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {t('knowledgeBase.titleHighlight')}
                  </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  {t('knowledgeBase.subtitle')}
                </p>

                {/* Search bar */}
                <div className="relative max-w-xl mx-auto mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('knowledgeBase.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-lg shadow-gray-100/50 dark:shadow-gray-900/50"
                  />
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-6 sm:gap-10">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="text-center"
                    >
                      <stat.icon className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="py-8 lg:py-12 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                to={`/kennisbank/${featuredArticle.id}`}
                className="group block relative rounded-2xl lg:rounded-3xl overflow-hidden"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img 
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    loading="eager"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
                </div>
                
                <div className="relative z-10 p-6 sm:p-10 lg:p-16 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary-500 text-white rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      {t('knowledgeBase.featured')}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-300 text-sm">
                      <Clock className="w-4 h-4" />
                      {featuredArticle.readTime} {t('knowledgeBase.readTime')}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 group-hover:text-primary-200 transition-colors">
                    {featuredArticle.title}
                  </h2>
                  
                  <p className="text-gray-300 text-base lg:text-lg mb-6 line-clamp-2">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                    {t('knowledgeBase.readArticle')}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Category Tabs */}
        <section className="py-4 lg:py-6 border-b border-gray-100 dark:border-gray-800 sticky top-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon
                const isActive = activeCategory === category.key
                return (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 dark:bg-gray-900/20' : 'bg-gray-200 dark:bg-gray-700'
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
        {trendingArticles.length > 0 && (
          <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('knowledgeBase.trending.title')}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{t('knowledgeBase.trending.subtitle')}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {trendingArticles.map((article, index) => {
                  const config = categoryConfig[article.category] || categoryConfig['Tips']
                  const CategoryIcon = config.icon
                  return (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          #{index + 1} {t('knowledgeBase.trending.popular')}
                        </span>
                        
                        <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
                          <CategoryIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold ${config.color} ${config.darkColor}`}>
                            {article.category}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
                            <Clock className="w-3 h-3" />
                            {article.readTime} min
                          </span>
                        </div>
                        <Link 
                          to={`/kennisbank/${article.id}`}
                          className="block"
                        >
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-2.5 transition-all">
                            {t('knowledgeBase.readMore')}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Link>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="py-12 lg:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.find(c => c.key === activeCategory)?.name || activeCategory}
              </h2>
              <span className="text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                {filteredArticles.length === 1 
                  ? t('knowledgeBase.articleCount', { count: filteredArticles.length })
                  : t('knowledgeBase.articleCountPlural', { count: filteredArticles.length })}
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">{t('knowledgeBase.noResults.title')}</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">{t('knowledgeBase.noResults.subtitle')}</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('Alle artikelen'); }}
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  {t('knowledgeBase.noResults.viewAll')}
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
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        
                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full ${config.bg} ${config.darkBg} flex items-center gap-1.5`}>
                          <CategoryIcon className={`w-3.5 h-3.5 ${config.color} ${config.darkColor}`} />
                          <span className={`text-xs font-semibold ${config.color} ${config.darkColor}`}>
                            {article.category}
                          </span>
                        </div>

                        {article.trending && (
                          <span className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs mb-3">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{article.readTime} {t('knowledgeBase.readTime')}</span>
                        </div>

                        <Link to={`/kennisbank/${article.id}`}>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        <Link
                          to={`/kennisbank/${article.id}`}
                          className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-2.5 transition-all"
                        >
                          {t('knowledgeBase.readArticle')}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">{t('knowledgeBase.cta.badge')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {t('knowledgeBase.cta.title')}{' '}
                <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                  {t('knowledgeBase.cta.titleHighlight')}
                </span>
              </h2>

              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                {t('knowledgeBase.cta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/start"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                >
                  {t('knowledgeBase.cta.startProject')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                >
                  {t('knowledgeBase.cta.contact')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer ctaVariant="none" />
    </div>
  )
}
