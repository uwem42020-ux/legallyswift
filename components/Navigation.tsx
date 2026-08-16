'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navDropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/lawyers', label: 'Find Lawyers' },
    {
      label: 'Resources',
      items: [
        { href: '/resources', label: 'Legal Resources' },
        { href: '/ai', label: 'AI Assistant' },
      ],
    },
    {
      label: 'Training',
      items: [
        { href: '/courses', label: 'Courses' },
        { href: '/ask', label: 'Ask a Question' },
      ],
    },
    {
      label: 'Content',
      items: [
        { href: '/articles', label: 'Journals & News' },
        { href: '/pricing', label: 'Pricing' },
      ],
    },
  ]

  useEffect(() => {
    const supabase = createClient()

    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setShowDropdown(false)
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const isDropdownActive = (items: { href: string }[]) => {
    return items.some(item => pathname.startsWith(item.href))
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image 
              src="/logo.png" 
              alt="LegallySwift Logo" 
              width={180} 
              height={54}
              className="w-auto h-12 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6" ref={navDropdownRef}>
            {navLinks.map((link, index) => {
              if (link.items) {
                return (
                  <div 
                    key={index} 
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-1 transition-colors text-sm py-2 ${
                        isDropdownActive(link.items)
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {link.label}
                      <svg className={`w-3 h-3 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" />
                      </svg>
                    </button>

                    <div 
                      className={`absolute left-0 top-full pt-2 transition-all duration-200 ${
                        activeDropdown === link.label 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible -translate-y-1'
                      }`}
                    >
                      <div className="w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2">
                        {link.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              isActive(item.href)
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link 
                  key={index}
                  href={link.href} 
                  className={`transition-colors text-sm py-2 ${
                    isActive(link.href)
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* Auth Area - Shows nothing while loading */}
            {!loading && (
              user ? (
                /* User is logged in - Show avatar */
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white hover:bg-blue-700 transition-all border-2 border-blue-600"
                  >
                    {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          href="/dashboard" 
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          🏠 Dashboard
                        </Link>
                        <Link 
                          href="/ai" 
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          ⚖️ AI Assistant
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          🚪 Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* User is NOT logged in */
                <>
                  <Link 
                    href="/login" 
                    className={`transition-colors text-sm py-2 ${
                      pathname === '/login'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className={`px-5 py-2.5 rounded-lg transition-all text-sm ${
                      pathname === '/signup'
                        ? 'bg-blue-700 text-white shadow-lg shadow-blue-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200'
                    }`}
                  >
                    Get Started
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile: Auth area + Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            {!loading && (
              user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white"
                  >
                    {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          🏠 Dashboard
                        </Link>
                        <Link href="/ai" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          ⚖️ AI Assistant
                        </Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          🚪 Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/signup" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
                >
                  Get Started
                </Link>
              )
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 pt-4">
            <div className="space-y-1">
              {navLinks.map((link, index) => {
                if (link.items) {
                  return (
                    <div key={index}>
                      <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{link.label}</p>
                      {link.items.map((item, itemIndex) => (
                        <Link 
                          key={itemIndex}
                          href={item.href} 
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-4 py-3 rounded-lg transition-colors ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )
                }
                return (
                  <Link 
                    key={index}
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {!loading && !user && (
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/login'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}