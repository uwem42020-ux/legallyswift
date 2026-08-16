'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [level, setLevel] = useState('All Levels')
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    
    async function fetchCourses() {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
      
      setCourses(data || [])
      setFilteredCourses(data || [])
      setLoading(false)
    }

    fetchCourses()
  }, [])

  // Filter courses
  useEffect(() => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (category !== 'All Categories') {
      filtered = filtered.filter(course => course.category === category)
    }

    if (level !== 'All Levels') {
      filtered = filtered.filter(course => course.level === level)
    }

    setFilteredCourses(filtered)
  }, [searchTerm, category, level, courses])

  // Category icons
  const getCategoryIcon = (cat: string) => {
    const icons: { [key: string]: string } = {
      'Law': '⚖️',
      'Entrepreneurship': '💼',
      'Technology': '💻',
      'Fashion': '👗',
      'Sustainability': '🌱',
    }
    return icons[cat] || '📚'
  }

  // Category colors
  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Law': 'from-blue-500 to-blue-600',
      'Entrepreneurship': 'from-indigo-500 to-indigo-600',
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
              LegallySwift Academy
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Practical legal and business training for entrepreneurs, lawyers, and professionals.
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
                placeholder="Search courses or instructors..."
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
              <option>Entrepreneurship</option>
              <option>Technology</option>
              <option>Fashion</option>
              <option>Sustainability</option>
            </select>

            {/* Level Filter */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All Categories', 'Law', 'Entrepreneurship', 'Technology', 'Fashion', 'Sustainability'].map((cat) => (
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

      {/* Courses Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            <>
              <p className="text-gray-600 mb-6">
                Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Course Thumbnail */}
                    <div className={`h-40 bg-gradient-to-r ${getCategoryColor(course.category)} flex items-center justify-center relative overflow-hidden`}>
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(course.category)}
                      </span>
                      {/* Decorative circles */}
                      <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/10 rounded-full"></div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                          {course.category}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
                          {course.level}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {course.instructor_name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.duration_hours} hours
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-bold text-blue-600 text-xl">
                            {course.price > 0 ? `₦${course.price.toLocaleString()}` : 'Free'}
                          </p>
                        </div>
                        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Courses Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setCategory('All Categories')
                  setLevel('All Levels')
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Learn With Us */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Learn With LegallySwift</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Legal Experts</h3>
              <p className="text-sm text-gray-600">Learn from verified practitioners with real experience</p>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Certificates</h3>
              <p className="text-sm text-gray-600">Earn recognized certification upon completion</p>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Practical Skills</h3>
              <p className="text-sm text-gray-600">Apply what you learn immediately</p>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Community</h3>
              <p className="text-sm text-gray-600">Network with professionals and peers</p>
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