'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [type, setType] = useState('All Types')
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    
    async function fetchArticles() {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
      
      setArticles(data || [])
      setFilteredArticles(data || [])
      setLoading(false)
    }

    fetchArticles()
  }, [])

  // Filter articles
  useEffect(() => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (category !== 'All Categories') {
      filtered = filtered.filter(article => article.category === category)
    }

    if (type !== 'All Types') {
      filtered = filtered.filter(article => article.type === type)
    }

    setFilteredArticles(filtered)
  }, [searchTerm, category, type, articles])

  // Category icons
  const getCategoryIcon = (cat: string) => {
    const icons: { [key: string]: string } = {
      'Law': '⚖️',
      'Business': '💼',
      'Technology': '💻',
      'Fashion': '👗',
      'Sustainability': '🌱',
    }
    return icons[cat] || '📰'
  }

  // Category colors
  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Law': 'from-blue-500 to-blue-600',
      'Business': 'from-indigo-500 to-indigo-600',
      'Technology': 'from-purple-500 to-purple-600',
      'Fashion': 'from-pink-500 to-pink-600',
      'Sustainability': 'from-green-500 to-green-600',
    }
    return colors[cat] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-36 pb-10 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Journals & News
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Stay informed with legal insights, business news, and industry updates.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search articles or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option>All Categories</option>
              <option>Law</option>
              <option>Business</option>
              <option>Technology</option>
              <option>Fashion</option>
              <option>Sustainability</option>
            </select>

            {/* Type Filter */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option>All Types</option>
              <option>Article</option>
              <option>Journal</option>
              <option>News</option>
            </select>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All Categories', 'Law', 'Business', 'Technology', 'Fashion', 'Sustainability'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {!loading && filteredArticles && filteredArticles.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 md:p-12 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full -ml-10 -mb-10"></div>
              
              <div className="relative max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    ⭐ Featured
                  </span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {filteredArticles[0].type}
                  </span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {filteredArticles[0].category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                  {filteredArticles[0].title}
                </h2>
                <p className="text-white/80 mb-6 text-sm md:text-lg leading-relaxed">
                  {filteredArticles[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {filteredArticles[0].author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(filteredArticles[0].published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          ) : filteredArticles && filteredArticles.length > 0 ? (
            <>
              <p className="text-gray-600 mb-6">
                Showing <span className="font-semibold text-gray-900">{filteredArticles.length}</span> article{filteredArticles.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.slice(1).map((article, index) => (
                  <div 
                    key={article.id} 
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Article Thumbnail */}
                    <div className={`h-36 bg-gradient-to-r ${getCategoryColor(article.category)} flex items-center justify-center relative overflow-hidden`}>
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(article.category)}
                      </span>
                      {/* Decorative circles */}
                      <div className="absolute top-2 right-2 w-14 h-14 bg-white/10 rounded-full"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/10 rounded-full"></div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                          {article.category}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
                          {article.type}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 line-clamp-3 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {article.author_name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(article.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Articles Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setCategory('All Categories')
                  setType('All Types')
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-blue-100 mb-6">Get the latest legal and business updates delivered to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="border border-white/30 bg-white/10 text-white placeholder-blue-200 rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-xl">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image 
                src="/logo.png" 
                alt="LegallySwift Logo" 
                width={180} 
                height={54}
                className="h-12 w-auto object-contain mb-4"
              />
              <p className="text-gray-400">Legal infrastructure for Nigeria&apos;s entrepreneurs and innovators.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/lawyers" className="hover:text-white transition-colors">Find Lawyers</Link></li>
                <li><Link href="/courses" className="hover:text-white transition-colors">Training</Link></li>
                <li><Link href="/articles" className="hover:text-white transition-colors">Journals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Terms & Conditions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Lagos, Nigeria</li>
                <li>contact@legallyswift.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2026 LegallySwift by Joke Murgan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}