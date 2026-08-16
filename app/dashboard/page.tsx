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

  // Chart data
  const chartData = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 25 },
    { month: 'Apr', value: 60 },
    { month: 'May', value: 40 },
    { month: 'Jun', value: 75 },
    { month: 'Jul', value: 55 },
    { month: 'Aug', value: 85 },
  ]

  const maxValue = Math.max(...chartData.map(d => d.value))
  const chartHeight = 120

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Sticky */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="block mb-8">
            <Image 
              src="/logo2.png" 
              alt="LegallySwift Logo" 
              width={160} 
              height={48}
              className="w-auto h-10 object-contain"
            />
          </Link>

          {/* User Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
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
          <nav className="space-y-1 flex-1 overflow-y-auto">
            <a href="#" className="block px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold">
              🏠 Dashboard
            </a>
            {userRole === 'lawyer' ? (
              <>
                <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  ⚖️ My Cases
                </a>
                <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📄 My Profile
                </a>
                <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  💰 Invoicing
                </a>
                <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📊 Analytics
                </a>
              </>
            ) : (
              <>
                <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📋 My Cases
                </a>
                <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📚 My Courses
                </a>
                <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  📄 My Documents
                </a>
                <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  💳 Payments
                </a>
              </>
            )}
            <a href="#" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              ⚙️ Settings
            </a>
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-2"
          >
            🚪 Log Out
          </button>
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
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 sticky top-0 z-30">
          <div className="flex justify-between items-center gap-3">
            <button 
              className="lg:hidden text-gray-700 flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 capitalize truncate">
              Welcome, {user?.user_metadata?.full_name || 'User'} 👋
            </h1>
            <Link 
              href="/" 
              className="text-white bg-blue-600 border-2 border-blue-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 hover:border-blue-700 transition-all flex-shrink-0"
            >
              Home
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Stats Cards - Horizontal compact */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {userRole === 'lawyer' ? (
              <>
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                  <Image 
                    src="/icons/active.png" 
                    alt="Active Cases" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight">0</div>
                    <div className="text-gray-600 text-xs truncate">Active Cases</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                  <Image 
                    src="/icons/total.png" 
                    alt="Total Clients" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight">0</div>
                    <div className="text-gray-600 text-xs truncate">Total Clients</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                  <Image 
                    src="/icons/earnings.png" 
                    alt="Earnings" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight">₦0</div>
                    <div className="text-gray-600 text-xs truncate">Earnings</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                  <Image 
                    src="/icons/rating.png" 
                    alt="Rating" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight">0</div>
                    <div className="text-gray-600 text-xs truncate">Rating</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                  <Image 
                    src="/icons/active.png" 
                    alt="My Cases" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight">0</div>
                    <div className="text-gray-600 text-xs truncate">My Cases</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                  <Image 
                    src="/icons/total.png" 
                    alt="Enrolled Courses" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight">0</div>
                    <div className="text-gray-600 text-xs truncate">Enrolled Courses</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                  <Image 
                    src="/icons/earnings.png" 
                    alt="Documents" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight">0</div>
                    <div className="text-gray-600 text-xs truncate">Documents</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                  <Image 
                    src="/icons/rating.png" 
                    alt="Total Spent" 
                    width={32} 
                    height={32}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight">₦0</div>
                    <div className="text-gray-600 text-xs truncate">Total Spent</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Products Section */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* LegallySwift AI - Links to /ai */}
              <Link 
                href="/ai" 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <Image 
                    src="/icons/ai.png" 
                    alt="LegallySwift AI" 
                    width={64} 
                    height={64}
                    className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                  />
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-blob-medium"></div>
                  <div className="absolute bottom-4 left-4 w-10 h-10 bg-white/10 rounded-full animate-blob-fast"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 group-hover:text-blue-600 transition-colors">
                    LegallySwift AI
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    One AI Tool. Every Legal Task
                    <br />
                    Document Review | Legal Drafting | Research
                  </p>
                  <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all w-full text-center">
                    View
                  </span>
                </div>
              </Link>

              {/* Textbook & Journals - Links to /resources */}
              <Link 
                href="/resources" 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
                  <Image 
                    src="/icons/books.png" 
                    alt="Textbook & Journals" 
                    width={64} 
                    height={64}
                    className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-blob-fast"></div>
                  <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-blob-medium"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 group-hover:text-blue-600 transition-colors">
                    Textbook & Journals
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Your legal textbooks and journals now accessible on your device
                  </p>
                  <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all w-full text-center">
                    Buy Now
                  </span>
                </div>
              </Link>

              {/* State Laws - No link */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                  <Image 
                    src="/icons/state.png" 
                    alt="State Laws" 
                    width={64} 
                    height={64}
                    className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                  />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full animate-blob-medium"></div>
                  <div className="absolute bottom-4 left-4 w-14 h-14 bg-white/10 rounded-full animate-blob-slow"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 group-hover:text-blue-600 transition-colors">
                    State Laws
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Get access to complete e-laws of selected States from across the federation
                  </p>
                  <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all w-full text-center">
                    Buy Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {userRole === 'lawyer' ? (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
                  <h3 className="text-base font-bold mb-1.5">Update Your Profile</h3>
                  <p className="text-blue-100 text-xs mb-3">Complete your professional profile to attract more clients.</p>
                  <button className="bg-white text-blue-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                    Edit Profile
                  </button>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h3 className="text-base font-bold mb-1.5">💼 Case Management</h3>
                  <p className="text-gray-600 text-xs mb-3">Manage your cases, clients, and documents in one place.</p>
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                    View Cases
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
                  <h3 className="text-base font-bold mb-1.5">Find a Lawyer</h3>
                  <p className="text-blue-100 text-xs mb-3">Connect with verified lawyers for your legal needs.</p>
                  <Link href="/lawyers" className="inline-block bg-white text-blue-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                    Browse Lawyers
                  </Link>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h3 className="text-base font-bold mb-1.5">📚 Explore Courses</h3>
                  <p className="text-gray-600 text-xs mb-3">Enroll in training programs to learn legal and business skills.</p>
                  <Link href="/courses" className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                    View Courses
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Recent Activity with Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold mb-4">Recent Activity</h3>
            
            {/* 3D Line Chart */}
            <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
              {/* Chart Area */}
              <div className="relative" style={{ height: `${chartHeight}px` }}>
                {/* Grid Lines */}
                {[0, 1, 2, 3].map((line) => (
                  <div 
                    key={line}
                    className="absolute left-0 right-0 border-t border-gray-100"
                    style={{ top: `${(line / 3) * 100}%` }}
                  ></div>
                ))}

                {/* SVG Line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Area fill */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2563EB" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Area fill */}
                  <polygon
                    points={chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - (d.value / maxValue) * 90} ${(i / (chartData.length - 1)) * 100},100`).join(' ')}
                    fill="url(#chartGradient)"
                  />

                  {/* Line */}
                  <polyline
                    points={chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - (d.value / maxValue) * 90}`).join(' ')}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#shadow)"
                  />
                </svg>

                {/* Markers */}
                {chartData.map((d, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-lg cursor-pointer hover:scale-150 transition-transform"
                    style={{
                      left: `${(i / (chartData.length - 1)) * 100}%`,
                      top: `${100 - (d.value / maxValue) * 90}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`${d.month}: ${d.value}`}
                  ></div>
                ))}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between mt-2">
                {chartData.map((d, i) => (
                  <span key={i} className="text-[10px] text-gray-500">{d.month}</span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}