'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AIPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [tokens, setTokens] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    court: false,
    contracts: false,
    general: false,
  })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      setUser(user)
      setTokens(user.user_metadata?.tokens || 0)
      setLoading(false)
    }

    getUser()

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const tokenPlans = [
    { tokens: 2500, validity: '24 months', price: 'NGN200,000', popular: true },
    { tokens: 1200, validity: '12 months', price: 'NGN100,000', popular: false },
    { tokens: 500, validity: '6 months', price: 'NGN50,000', popular: false },
  ]

  const samplePrompts = [
    { icon: '⚖️', text: 'What is res judicata in Nigeria Law?' },
    { icon: '📄', text: 'Draft a tenancy agreement for a property in Lagos' },
    { icon: '⚖️', text: 'Clause-by-clause contract audit' },
    { icon: '🔍', text: 'What are the grounds for divorce under Nigerian Law?' },
    { icon: '📄', text: 'Draft a motion on notice in extension of time' },
  ]

  const handleSendMessage = () => {
    if (!input.trim()) return

    const newMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
    setInput('')

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'I understand your question. Based on Nigerian law, this is a complex matter that requires careful consideration of the relevant statutes and case law. Would you like me to provide more specific information about this?',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiResponse])
      setTokens(prev => prev - 1)
    }, 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Token Purchase Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTokenModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Purchase Token</h2>
              <p className="text-gray-600 mt-1">Purchase LegallySwift AI Token Here</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tokenPlans.map((plan) => (
                  <div 
                    key={plan.tokens}
                    className={`border rounded-xl p-5 text-center relative transition-all hover:shadow-lg ${
                      plan.popular ? 'border-blue-600 shadow-lg shadow-blue-100' : 'border-gray-200'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-0.5 rounded-full">
                        Best Value
                      </span>
                    )}
                    <p className="text-2xl font-bold text-gray-900">{plan.tokens.toLocaleString()} Tokens</p>
                    <p className="text-xs text-gray-500 mt-1">Valid for {plan.validity}</p>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto my-3">
                      <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
                    </div>
                    <p className="text-xl font-bold text-blue-600">{plan.price}</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">
                      Buy Token
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowTokenModal(false)}
                className="w-full mt-4 py-3 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
              >
                Purchase Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[99] bg-white border-r border-gray-200 h-screen overflow-y-auto shadow-[4px_0px_8px_0px_#0000000A] transition-all duration-300 w-[250px] md:w-[280px] rounded-r-[25px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="px-4 md:px-[26px] py-8 md:py-[40px]">
          {/* Top Row: Menu, Logo, Search */}
          <div className="flex justify-between items-center">
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link href="/" className="hidden lg:block">
              <Image src="/logo.png" alt="LegallySwift" width={100} height={30} className="object-contain h-[24px] md:h-[29px] w-auto" />
            </Link>
            <button className="text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 border border-gray-200 rounded-[12px]">
            <div className="w-full bg-white h-[45px] rounded-[12px] flex items-center px-4 gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                placeholder="Search..." 
                className="w-full h-full bg-transparent outline-none text-gray-700 text-xs"
              />
              <button className="w-[29px] h-[29px] bg-[#1C65EA] rounded-full text-white flex items-center justify-center hover:bg-[#1557C7] transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex flex-col gap-y-3 mt-6">
            {/* Home */}
            <Link href="/" className="flex items-center gap-2 px-4 py-3 rounded-r-[15px] bg-[#EBF2FF] text-[#2E2E2ECC] font-semibold border-[0.5px] border-[#1C65EA33] transition-all">
              <span className="text-lg">🏠</span>
              <span className="flex-1 text-left text-sm">Home</span>
            </Link>

            {/* Review A Legal Document - Active */}
            <Link href="#" className="flex items-center gap-2 px-4 py-3 rounded-r-[15px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 shadow-lg text-white transition-all">
              <span className="text-lg">📄</span>
              <span className="flex-1 text-left text-sm font-semibold">Review A Legal Document</span>
            </Link>

            {/* ADR Corner */}
            <Link href="#" className="flex items-center gap-2 px-4 py-3 rounded-r-[15px] text-gray-700 hover:bg-gray-50 bg-gray-50 border-[0.5px] border-[#C8C7C780] transition-all">
              <span className="text-lg">🏛️</span>
              <span className="flex-1 text-left text-sm">ADR Corner</span>
            </Link>

            {/* Draft Court Processes - Expandable */}
            <div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-r-[15px] text-gray-700 hover:bg-gray-50 bg-gray-50 border-[0.5px] border-[#C8C7C780] cursor-pointer transition-all" onClick={() => setExpandedSections({...expandedSections, court: !expandedSections.court})}>
                <span className="text-lg">📝</span>
                <span className="flex-1 text-left text-sm">Draft Court Processes</span>
                <svg className={`w-4 h-4 transition-transform ${expandedSections.court ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" />
                </svg>
              </div>
              {expandedSections.court && (
                <div className="ml-6 mt-1 space-y-1">
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Civil Litigation</a>
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Criminal Litigation</a>
                </div>
              )}
            </div>

            {/* Draft Contracts & Agreements - Expandable */}
            <div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-r-[15px] text-gray-700 hover:bg-gray-50 bg-gray-50 border-[0.5px] border-[#C8C7C780] cursor-pointer transition-all" onClick={() => setExpandedSections({...expandedSections, contracts: !expandedSections.contracts})}>
                <span className="text-lg">📋</span>
                <span className="flex-1 text-left text-sm">Draft Contracts & Agreements</span>
                <svg className={`w-4 h-4 transition-transform ${expandedSections.contracts ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" />
                </svg>
              </div>
              {expandedSections.contracts && (
                <div className="ml-6 mt-1 space-y-1">
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Corporate Law</a>
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Family Law</a>
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Alternative Dispute Resolution</a>
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Property Law</a>
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Banking & Finance</a>
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Employment Law</a>
                </div>
              )}
            </div>

            {/* General Applications - Expandable */}
            <div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-r-[15px] text-gray-700 hover:bg-gray-50 bg-gray-50 border-[0.5px] border-[#C8C7C780] cursor-pointer transition-all" onClick={() => setExpandedSections({...expandedSections, general: !expandedSections.general})}>
                <span className="text-lg">⚖️</span>
                <span className="flex-1 text-left text-sm">General Applications</span>
                <svg className={`w-4 h-4 transition-transform ${expandedSections.general ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" />
                </svg>
              </div>
              {expandedSections.general && (
                <div className="ml-6 mt-1 space-y-1">
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Intellectual Property</a>
                  <a href="#" className="block px-3 py-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">Tax</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[98] lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-3 md:px-12 py-3 w-full">
          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Mobile menu button */}
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Token and Chat History buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setShowTokenModal(true)}
                className="cursor-pointer flex items-center gap-3 h-12 px-6 text-white rounded-xl font-semibold transition-all shadow-md bg-gradient-to-r from-[#4E7BE7] to-[#5B25B7] border border-[#11C6CC]"
              >
                <span className="text-lg">⭐</span>
                <span className="text-sm font-bold whitespace-nowrap">Your Token</span>
                <div className="w-3 h-3 rounded-full bg-[#EA1C1C]"></div>
              </button>
              <button className="cursor-pointer flex items-center gap-2 h-12 px-6 bg-[#800033] hover:bg-[#5A0D24] text-white rounded-xl font-semibold transition-all shadow-md">
                <span className="text-lg">💬</span>
                <span className="text-sm font-bold whitespace-nowrap">Chat History</span>
              </button>
            </div>

            {/* Mobile token and chat buttons */}
            <div className="md:hidden flex gap-2">
              <button 
                onClick={() => setShowTokenModal(true)}
                className="px-3 h-10 text-white rounded-xl text-xs font-medium flex items-center gap-1 bg-gradient-to-r from-[#4E7BE7] to-[#5B25B7] border border-[#11C6CC]"
              >
                ⭐ <span className="font-extrabold">Token</span>
              </button>
              <button className="px-3 h-10 bg-[#6B0F2B] text-white rounded-xl text-xs font-medium flex items-center gap-1">
                💬 <span className="font-bold">History</span>
              </button>
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 transition-all"
              >
                {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-6xl p-4 md:p-8 flex flex-col gap-8 pb-24">
              {/* Welcome */}
              <header className="mb-4 text-center mt-8 md:mt-12">
                <div className="flex gap-2 items-center justify-center mb-4">
                  <Image src="/icons/ai.png" alt="AI Logo" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                    Good Morning, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
                  </h1>
                </div>
                <p className="text-base text-slate-500">
                  To get started, type in a question below, upload a document to review, or pick up where you left off
                </p>
              </header>

              {/* Input Area */}
              <section>
                <div className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything or describe what you need."
                    rows={3}
                    className="w-full resize-none border-none bg-transparent p-0 text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <label className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all active:scale-95">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </div>
                      Upload Documents
                    </label>
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim()}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A5ED8] text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 7-7 7 7"></path>
                        <path d="M12 19V5"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </section>

              {/* Sample Prompts */}
              <section>
                <h2 className="text-xl font-bold text-gray-600 mb-4">Sample Questions/Prompts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {samplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt.text)}
                      className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-left transition-all shadow-sm active:scale-[0.98]"
                    >
                      <span className="text-slate-700 text-sm font-medium leading-tight">
                        {prompt.icon} {prompt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* Chat Messages */
            <div className="mx-auto max-w-4xl p-4 md:p-8 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.type === 'user'
                        ? 'bg-[#1A5ED8] text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Input when messages exist */}
        {messages.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything or describe what you need."
                  rows={2}
                  className="flex-1 resize-none border-none bg-transparent focus:outline-none focus:ring-0 text-slate-700"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A5ED8] text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 7-7 7 7"></path>
                    <path d="M12 19V5"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}