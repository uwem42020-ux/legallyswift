'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  href?: string
  label: string
  items?: { href: string; label: string }[]
}

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const navLinks: NavItem[] = [
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
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setOpenDropdown(null)
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isDropdownActive = (items: { href: string }[]) => {
    return items.some(item => pathname.startsWith(item.href))
  }

  const getUserInitials = () => {
    const fullName = user?.user_metadata?.full_name || ''
    if (fullName) {
      return fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    }
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 pointer-events-auto">
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pointer-events-auto">
        <div className="flex justify-between items-center h-16 md:h-20" ref={dropdownRef}>
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image 
              src="/logo.png" 
              alt="LegallySwift Logo" 
              width={180} 
              height={54}
              className="w-auto h-8 md:h-10 lg:h-12 object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div 
            className="hidden lg:flex items-center space-x-6"
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {navLinks.map((link, index) => {
              if (link.items) {
                return (
                  <div 
                    key={index} 
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDropdown(link.label)}
                      className={`flex items-center gap-1 transition-colors text-sm py-2 ${
                        isDropdownActive(link.items)
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {link.label}
                      <svg className={`w-3 h-3 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" />
                      </svg>
                    </button>

                    {openDropdown === link.label && (
                      <div className="absolute left-0 top-full z-[9999]">
                        <div className="w-56 bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-xl py-2 mt-1">
                          {link.items.map((item, itemIndex) => (
                            <a
                              key={itemIndex}
                              href={item.href}
                              className={`block px-4 py-2.5 text-sm transition-colors ${
                                isActive(item.href)
                                  ? 'bg-blue-50/80 text-blue-600 font-semibold'
                                  : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'
                              }`}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link 
                  key={index}
                  href={link.href!}
                  onClick={() => setOpenDropdown(null)}
                  className={`transition-colors text-sm py-2 ${
                    isActive(link.href!)
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* Auth Area - Desktop */}
            {!loading && (
              user ? (
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => toggleDropdown('user')}
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white hover:bg-blue-700 transition-all border-2 border-blue-600"
                  >
                    {getUserInitials()}
                  </button>

                  {openDropdown === 'user' && (
                    <div className="absolute right-0 top-full z-[9999]">
                      <div className="w-56 bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-xl mt-1">
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <a href="/dashboard" className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-white/50 hover:text-blue-600 transition-colors">
                            🏠 Dashboard
                          </a>
                          <a href="/ai" className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-white/50 hover:text-blue-600 transition-colors">
                            ⚖️ AI Assistant
                          </a>
                          <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors">
                            🚪 Log Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors text-sm py-2">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all text-sm">
                    Get Started
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile: User + Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            {!loading && (
              user ? (
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => toggleDropdown('user')}
                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                  >
                    {getUserInitials()}
                  </button>
                  {openDropdown === 'user' && (
                    <div className="absolute right-0 top-full z-[9999]">
                      <div className="w-56 bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-xl mt-1">
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.user_metadata?.full_name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <a href="/dashboard" className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-white/50 hover:text-blue-600 transition-colors">
                            🏠 Dashboard
                          </a>
                          <a href="/ai" className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-white/50 hover:text-blue-600 transition-colors">
                            ⚖️ AI Assistant
                          </a>
                          <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors">
                            🚪 Log Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Mobile Login - Border only */}
                  <Link 
                    href="/login" 
                    className="text-blue-600 border-2 border-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 hover:bg-blue-50 transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0"
                  >
                    Get Started
                  </Link>
                </>
              )
            )}
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-1 flex-shrink-0"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200/50 pt-4 bg-white/70 backdrop-blur-xl">
            <div className="space-y-1">
              {navLinks.map((link, index) => {
                if (link.items) {
                  return (
                    <div key={index}>
                      <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{link.label}</p>
                      {link.items.map((item, itemIndex) => (
                        <a key={itemIndex} href={item.href} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-white/50 hover:text-blue-600 transition-colors">
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )
                }
                return (
                  <a key={index} href={link.href} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-white/50 hover:text-blue-600 transition-colors">
                    {link.label}
                  </a>
                )
              })}
              {!loading && !user && (
                <a href="/login" className="block px-4 py-3 rounded-lg text-blue-600 font-semibold hover:bg-white/50 transition-colors">
                  Login
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}