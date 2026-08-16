'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [filteredResources, setFilteredResources] = useState<any[]>([])

  const resources = [
    {
      id: 1,
      title: 'Non-Disclosure Agreement (NDA) Template',
      description: 'Protect your confidential business information with this standard NDA template.',
      category: 'Business',
      type: 'Template',
      format: 'PDF',
      size: '245 KB',
      downloads: 1250,
    },
    {
      id: 2,
      title: 'Lease Agreement Template',
      description: 'Standard residential and commercial lease agreement for Nigerian properties.',
      category: 'Real Estate',
      type: 'Template',
      format: 'DOC',
      size: '180 KB',
      downloads: 980,
    },
    {
      id: 3,
      title: 'Business Registration Guide',
      description: 'Step-by-step guide to registering your business with CAC in Nigeria.',
      category: 'Business',
      type: 'Guide',
      format: 'PDF',
      size: '1.2 MB',
      downloads: 2100,
    },
    {
      id: 4,
      title: 'Employment Contract Template',
      description: 'Comprehensive employment contract template for Nigerian businesses.',
      category: 'Employment',
      type: 'Template',
      format: 'DOC',
      size: '320 KB',
      downloads: 1560,
    },
    {
      id: 5,
      title: 'Intellectual Property Protection Guide',
      description: 'Learn how to protect your trademarks, copyrights, and patents in Nigeria.',
      category: 'Intellectual Property',
      type: 'Guide',
      format: 'PDF',
      size: '850 KB',
      downloads: 720,
    },
    {
      id: 6,
      title: 'Company Incorporation Documents Checklist',
      description: 'Complete checklist of documents needed for company incorporation in Nigeria.',
      category: 'Business',
      type: 'Checklist',
      format: 'PDF',
      size: '150 KB',
      downloads: 1890,
    },
    {
      id: 7,
      title: 'Tenancy Agreement Template',
      description: 'Standard tenancy agreement for residential properties in Nigeria.',
      category: 'Real Estate',
      type: 'Template',
      format: 'DOC',
      size: '195 KB',
      downloads: 1100,
    },
    {
      id: 8,
      title: 'Data Protection Compliance Guide',
      description: 'Understand your obligations under the Nigeria Data Protection Act 2023.',
      category: 'Technology',
      type: 'Guide',
      format: 'PDF',
      size: '1.5 MB',
      downloads: 640,
    },
    {
      id: 9,
      title: 'Fashion Design Copyright Guide',
      description: 'Protect your fashion designs and brand with this comprehensive guide.',
      category: 'Fashion',
      type: 'Guide',
      format: 'PDF',
      size: '980 KB',
      downloads: 450,
    },
    {
      id: 10,
      title: 'Partnership Agreement Template',
      description: 'Standard partnership agreement for business partnerships in Nigeria.',
      category: 'Business',
      type: 'Template',
      format: 'DOC',
      size: '275 KB',
      downloads: 830,
    },
    {
      id: 11,
      title: 'Environmental Compliance Checklist',
      description: 'Essential checklist for environmental compliance for Nigerian businesses.',
      category: 'Sustainability',
      type: 'Checklist',
      format: 'PDF',
      size: '420 KB',
      downloads: 380,
    },
    {
      id: 12,
      title: 'Freelance Contract Template',
      description: 'Professional contract template for freelance and consulting services.',
      category: 'Employment',
      type: 'Template',
      format: 'DOC',
      size: '230 KB',
      downloads: 920,
    },
  ]

  const categories = ['All Categories', 'Business', 'Real Estate', 'Employment', 'Intellectual Property', 'Technology', 'Fashion', 'Sustainability']

  // Filter resources
  useEffect(() => {
    let filtered = resources

    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (category !== 'All Categories') {
      filtered = filtered.filter(resource => resource.category === category)
    }

    setFilteredResources(filtered)
  }, [searchTerm, category])

  // Initialize filtered resources
  useEffect(() => {
    setFilteredResources(resources)
  }, [])

  // Type icons
  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'Template': '📄',
      'Guide': '📖',
      'Checklist': '✓',
    }
    return icons[type] || '📄'
  }

  // Category colors
  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Business': 'from-blue-500 to-blue-600',
      'Real Estate': 'from-indigo-500 to-indigo-600',
      'Employment': 'from-purple-500 to-purple-600',
      'Intellectual Property': 'from-pink-500 to-pink-600',
      'Technology': 'from-green-500 to-green-600',
      'Fashion': 'from-orange-500 to-orange-600',
      'Sustainability': 'from-teal-500 to-teal-600',
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
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full animate-blob-medium"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full animate-blob-slow"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Legal Resources
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Download templates, guides, and checklists to help you navigate legal matters.
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
                placeholder="Search resources..."
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
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
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

      {/* Resources Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredResources && filteredResources.length > 0 ? (
            <>
              <p className="text-gray-600 mb-6">
                Showing <span className="font-semibold text-gray-900">{filteredResources.length}</span> resource{filteredResources.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <div 
                    key={resource.id} 
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Resource Thumbnail */}
                    <div className={`h-32 bg-gradient-to-r ${getCategoryColor(resource.category)} flex items-center justify-center relative overflow-hidden`}>
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {getTypeIcon(resource.type)}
                      </span>
                      {/* Decorative circles */}
                      <div className="absolute top-2 right-2 w-14 h-14 bg-white/10 rounded-full animate-blob-medium"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/10 rounded-full animate-blob-fast"></div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                          {resource.category}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
                          {resource.type}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 flex-1">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {resource.format}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {resource.downloads.toLocaleString()}
                        </span>
                      </div>
                      
                      <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Resources Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setCategory('All Categories')
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full animate-blob-medium"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full animate-blob-slow"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Get Access to Premium Resources
          </h2>
          <p className="text-blue-100 mb-6">
            Upgrade to Premium to access all templates, guides, and exclusive content.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-blue-600 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-2xl"
          >
            View Pricing
          </Link>
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