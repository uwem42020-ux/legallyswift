'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function AskQuestionPage() {
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('General')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  const categories = [
    'General',
    'Criminal Law',
    'Family Law',
    'Real Estate',
    'Business & Corporate',
    'Employment Law',
    'Intellectual Property',
    'Tax Law',
    'Immigration',
    'Debt Recovery',
    'Human Rights',
    'Technology Law',
    'Fashion Law',
    'Entertainment Law',
    'Environmental Law',
  ]

  const faqs = [
    {
      q: 'What are my rights when arrested?',
      a: 'You have the right to remain silent, the right to legal representation, and the right to be brought before a court within a reasonable time. Contact a lawyer immediately.',
      category: 'Criminal Law'
    },
    {
      q: 'My landlord wants to evict me without notice. What should I do?',
      a: 'Under Nigerian tenancy law, your landlord must give you proper notice before eviction. The length of notice depends on your tenancy agreement and the state law applicable.',
      category: 'Real Estate'
    },
    {
      q: 'How do I register a business in Nigeria?',
      a: 'You need to register with the Corporate Affairs Commission (CAC). This involves choosing a business name, preparing incorporation documents, and filing with the CAC.',
      category: 'Business & Corporate'
    },
    {
      q: 'What is intellectual property and how do I protect it?',
      a: 'Intellectual property includes trademarks, copyrights, patents, and designs. You can protect your IP by registering with the appropriate authorities in Nigeria.',
      category: 'Intellectual Property'
    },
  ]

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
              Ask a Legal Question
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Get general legal information and guidance. We will point you in the right direction.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-yellow-50 border-b border-yellow-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This platform provides general legal information, not legal advice. 
              For specific legal matters, please consult a qualified lawyer.
            </p>
          </div>
        </div>
      </section>

      {/* Question Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Question Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for reaching out. Our team will review your question and respond shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setQuestion('')
                    setCategory('General')
                    setName('')
                    setEmail('')
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Ask Another Question
                </button>
                <Link
                  href="/lawyers"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all"
                >
                  Find a Lawyer
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Question</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Question */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Question
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    rows={5}
                    placeholder="Describe your legal question in detail..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Question'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-blue-600 font-semibold">{faq.category}</span>
                    <h3 className="font-semibold mb-1">{faq.q}</h3>
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Need Professional Legal Help?
          </h2>
          <p className="text-blue-100 mb-6">
            Connect with verified lawyers who can provide specific legal advice for your situation.
          </p>
          <Link
            href="/lawyers"
            className="inline-block bg-white text-blue-600 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-2xl"
          >
            Find a Lawyer
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