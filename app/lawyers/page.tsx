'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

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
      <section className="pt-32 md:pt-36 pb-10 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Find Verified Lawyers
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Every lawyer is checked against their NBA branch and professional credentials.
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
                placeholder="Search by name or firm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Practice Area Filter */}
            <select
              value={practiceArea}
              onChange={(e) => setPracticeArea(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

            {/* State Filter */}
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

      {/* Lawyers Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading lawyers...</p>
            </div>
          ) : filteredLawyers && filteredLawyers.length > 0 ? (
            <>
              <p className="text-gray-600 mb-6">
                Showing <span className="font-semibold text-gray-900">{filteredLawyers.length}</span> lawyer{filteredLawyers.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLawyers.map((lawyer, index) => (
                  <div 
                    key={lawyer.lawyer_id} 
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Lawyer Header */}
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 ${lawyer.verified ? 'border-2 border-green-500 p-0.5' : ''}`}>
                        {lawyer.avatar_url ? (
                          <img 
                            src={lawyer.avatar_url} 
                            alt={lawyer.full_name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600">
                            {lawyer.full_name?.charAt(0) || 'L'}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
                          {lawyer.full_name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{lawyer.firm_name || 'Independent Practitioner'}</p>
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lawyer.practice_areas?.slice(0, 3).map((area: string, index: number) => (
                        <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                          {area}
                        </span>
                      ))}
                      {lawyer.practice_areas?.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">+{lawyer.practice_areas.length - 3} more</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {lawyer.state_of_practice}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lawyer.years_of_experience} years experience
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {lawyer.rating} rating
                      </div>
                    </div>

                    {/* Rate and Contact */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Hourly Rate</p>
                        <p className="font-bold text-blue-600 text-lg">₦{lawyer.hourly_rate?.toLocaleString() || 'Negotiable'}</p>
                      </div>
                      <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200">
                        Contact
                      </button>
                    </div>
                  </div>
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
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-1">Verified Credentials</h3>
              <p className="text-sm text-gray-600">Every lawyer is checked against NBA records</p>
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-1">Secure Escrow</h3>
              <p className="text-sm text-gray-600">Your funds are protected until work is done</p>
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-1">Fee Guidance</h3>
              <p className="text-sm text-gray-600">Pricing follows the Remuneration Order</p>
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