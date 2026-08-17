'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

// Scroll Reveal Component
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entries[0].target)
        }
      },
      { threshold: 0.05 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [practiceArea, setPracticeArea] = useState('All Practice Areas')
  const [state, setState] = useState('All States')
  const [filteredLawyers, setFilteredLawyers] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    
    async function fetchLawyers() {
      const { data } = await supabase
        .from('lawyer_directory')
        .select('*')
      
      setLawyers(data || [])
      setFilteredLawyers(data || [])
      setLoading(false)
    }

    fetchLawyers()
  }, [])

  // Filter lawyers
  useEffect(() => {
    let filtered = lawyers

    if (searchTerm) {
      filtered = filtered.filter(lawyer => 
        lawyer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.firm_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (practiceArea !== 'All Practice Areas') {
      filtered = filtered.filter(lawyer => 
        lawyer.practice_areas?.includes(practiceArea)
      )
    }

    if (state !== 'All States') {
      filtered = filtered.filter(lawyer => 
        lawyer.state_of_practice === state
      )
    }

    setFilteredLawyers(filtered)
  }, [searchTerm, practiceArea, state, lawyers])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-8 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full animate-blob-medium"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full animate-blob-slow"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Find Verified Lawyers
            </h1>
            <p className="text-base md:text-lg text-blue-100">
              Every lawyer is checked against their NBA branch and professional credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter - ONE HORIZONTAL LINE */}
      <section className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row gap-2 items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Practice Area */}
            <select
              value={practiceArea}
              onChange={(e) => setPracticeArea(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex-shrink-0 w-auto"
            >
              <option>All Practice Areas</option>
              <option>Corporate Law</option>
              <option>Family Law</option>
              <option>Real Estate</option>
              <option>Intellectual Property</option>
              <option>Criminal Law</option>
              <option>Fashion Law</option>
              <option>Technology Law</option>
              <option>Environmental Law</option>
            </select>

            {/* State */}
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex-shrink-0 w-auto"
            >
              <option>All States</option>
              <option>Lagos</option>
              <option>Abuja</option>
              <option>Kano</option>
              <option>Port Harcourt</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Ad Sidebar - Visible on all screens */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Ad Placeholder */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-400 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-semibold">Advertise Here</p>
                  <p className="text-gray-400 text-xs mt-1">Your ad could be here</p>
                </div>

                {/* Second Ad */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-center text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <p className="text-base font-bold mb-1">Grow Your Practice</p>
                  <p className="text-xs text-blue-100 mb-3">Get listed on LegallySwift and reach more clients.</p>
                  <Link href="/signup" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-all">
                    Join Now
                  </Link>
                </div>
              </div>
            </aside>

            {/* Lawyers Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading lawyers...</p>
                </div>
              ) : filteredLawyers && filteredLawyers.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-4 text-sm">
                    Showing <span className="font-semibold text-gray-900">{filteredLawyers.length}</span> lawyer{filteredLawyers.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredLawyers.map((lawyer, index) => (
                      <ScrollReveal key={lawyer.lawyer_id} delay={index * 50}>
                        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-full">
                          {/* Lawyer Header */}
                          <div className="flex items-center mb-3">
                            <div className={`w-14 h-14 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 ${lawyer.verified ? 'border-2 border-green-500 p-0.5' : ''}`}>
                              {lawyer.avatar_url ? (
                                <img 
                                  src={lawyer.avatar_url} 
                                  alt={lawyer.full_name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-blue-600">
                                  {lawyer.full_name?.charAt(0) || 'L'}
                                </div>
                              )}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <h3 className="font-semibold text-base truncate group-hover:text-blue-600 transition-colors">
                                {lawyer.full_name}
                              </h3>
                              <p className="text-xs text-gray-600 truncate">{lawyer.firm_name || 'Independent Practitioner'}</p>
                            </div>
                            {lawyer.verified && (
                              <span className="ml-2 border border-green-500 text-green-600 text-xs px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                              </span>
                            )}
                          </div>

                          {/* Practice Areas */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {lawyer.practice_areas?.slice(0, 3).map((area: string, index: number) => (
                              <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                {area}
                              </span>
                            ))}
                            {lawyer.practice_areas?.length > 3 && (
                              <span className="text-xs text-gray-500 self-center">+{lawyer.practice_areas.length - 3} more</span>
                            )}
                          </div>

                          {/* Details */}
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {lawyer.state_of_practice}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {lawyer.years_of_experience} years experience
                            </div>
                          </div>

                          {/* Rate and Contact */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-[10px] text-gray-500">Hourly Rate</p>
                              <p className="font-bold text-blue-600 text-base">₦{lawyer.hourly_rate?.toLocaleString() || 'Negotiable'}</p>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200">
                              Contact
                            </button>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Lawyers Found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setPracticeArea('All Practice Areas')
                      setState('All States')
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
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
                src="/logo2.png" 
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