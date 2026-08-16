'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>('client')
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
      setUserRole(user.user_metadata?.role || 'client')
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="block mb-8">
            <Image 
              src="/logo.png" 
              alt="LegallySwift Logo" 
              width={160} 
              height={48}
              className="w-auto h-10 object-contain"
            />
          </Link>

          {/* User Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-sm text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3 inline-block bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full capitalize">
              {userRole}
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <a href="#" className="block px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold">
              🏠 Dashboard
            </a>
            {userRole === 'lawyer' ? (
              <>
                <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  ⚖️ My Cases
                </a>
                <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📄 My Profile
                </a>
                <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  💰 Invoicing
                </a>
                <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📊 Analytics
                </a>
              </>
            ) : (
              <>
                <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📋 My Cases
                </a>
                <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📚 My Courses
                </a>
                <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📄 My Documents
                </a>
                <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  💳 Payments
                </a>
              </>
            )}
            <a href="#" className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              ⚙️ Settings
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              🚪 Log Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
          <div className="flex justify-between items-center gap-3">
            <button 
              className="lg:hidden text-gray-700 flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 capitalize truncate">
              Welcome, {user?.user_metadata?.full_name || 'User'} 👋
            </h1>
            <Link 
              href="/" 
              className="text-white bg-blue-600 border-2 border-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 hover:border-blue-700 transition-all flex-shrink-0"
            >
              Home
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Stats Cards - 2 columns on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {userRole === 'lawyer' ? (
              <>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-2 md:mb-3 flex items-center justify-center">
                    <Image 
                      src="/icons/active.png" 
                      alt="Active Cases" 
                      width={48} 
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">0</div>
                  <div className="text-gray-600 text-xs md:text-sm text-center mt-1">Active Cases</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-2 md:mb-3 flex items-center justify-center">
                    <Image 
                      src="/icons/total.png" 
                      alt="Total Clients" 
                      width={48} 
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">0</div>
                  <div className="text-gray-600 text-xs md:text-sm text-center mt-1">Total Clients</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-2 md:mb-3 flex items-center justify-center">
                    <Image 
                      src="/icons/earnings.png" 
                      alt="Earnings" 
                      width={48} 
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">₦0</div>
                  <div className="text-gray-600 text-xs md:text-sm text-center mt-1">Earnings</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-2 md:mb-3 flex items-center justify-center">
                    <Image 
                      src="/icons/rating.png" 
                      alt="Rating" 
                      width={48} 
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">0</div>
                  <div className="text-gray-600 text-xs md:text-sm text-center mt-1">Rating</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-2 md:mb-3 flex items-center justify-center">
                    <Image 
                      src="/icons/active.png" 
                      alt="My Cases" 
                      width={48} 
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">0</div>
                  <div className="text-gray-600 text-xs md:text-sm text-center mt-1">My Cases</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-2 md:mb-3 flex items-center justify-center">
                    <Image 
                      src="/icons/total.png" 
                      alt="Enrolled Courses" 
                      width={48} 
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">0</div>
                  <div className="text-gray-600 text-xs md:text-sm text-center mt-1">Enrolled Courses</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-2 md:mb-3 flex items-center justify-center">
                    <Image 
                      src="/icons/earnings.png" 
                      alt="Documents" 
                      width={48} 
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">0</div>
                  <div className="text-gray-600 text-xs md:text-sm text-center mt-1">Documents</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-2 md:mb-3 flex items-center justify-center">
                    <Image 
                      src="/icons/rating.png" 
                      alt="Total Spent" 
                      width={48} 
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">₦0</div>
                  <div className="text-gray-600 text-xs md:text-sm text-center mt-1">Total Spent</div>
                </div>
              </>
            )}
          </div>

          {/* Products Section */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Product 1 - LegallySwift AI */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <Image 
                    src="/icons/ai.png" 
                    alt="LegallySwift AI" 
                    width={80} 
                    height={80}
                    className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                  />
                  {/* Animated decorative circles */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-blob-medium"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-blob-fast"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full animate-blob-slow"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    LegallySwift AI
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    One AI Tool. Every Legal Task
                    <br />
                    Document Review | Legal Drafting | Research
                  </p>
                  <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 w-full">
                    View
                  </button>
                </div>
              </div>

              {/* Product 2 - Textbook & Journals */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
                  <Image 
                    src="/icons/books.png" 
                    alt="Textbook & Journals" 
                    width={80} 
                    height={80}
                    className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                  />
                  {/* Animated decorative circles */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-blob-fast"></div>
                  <div className="absolute bottom-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-blob-medium"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full animate-blob-slow"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    Textbook & Journals
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your legal textbooks and journals now accessible on your device
                  </p>
                  <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 w-full">
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Product 3 - State Laws */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <div className="h-40 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                  <Image 
                    src="/icons/state.png" 
                    alt="State Laws" 
                    width={80} 
                    height={80}
                    className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                  />
                  {/* Animated decorative circles */}
                  <div className="absolute top-4 right-4 w-14 h-14 bg-white/10 rounded-full animate-blob-medium"></div>
                  <div className="absolute bottom-4 left-4 w-18 h-18 bg-white/10 rounded-full animate-blob-slow"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full animate-blob-fast"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    State Laws
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get access to complete e-laws of selected States from across the federation
                  </p>
                  <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 w-full">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - 2 columns on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            {userRole === 'lawyer' ? (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Update Your Profile</h3>
                  <p className="text-blue-100 mb-4">Complete your professional profile to attract more clients.</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Edit Profile
                  </button>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold mb-2">💼 Case Management</h3>
                  <p className="text-gray-600 mb-4">Manage your cases, clients, and documents in one place.</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    View Cases
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Find a Lawyer</h3>
                  <p className="text-blue-100 mb-4">Connect with verified lawyers for your legal needs.</p>
                  <Link href="/lawyers" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Browse Lawyers
                  </Link>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold mb-2">📚 Explore Courses</h3>
                  <p className="text-gray-600 mb-4">Enroll in training programs to learn legal and business skills.</p>
                  <Link href="/courses" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    View Courses
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500">No recent activity yet.</p>
              <p className="text-sm text-gray-400 mt-1">Your activity will appear here.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}