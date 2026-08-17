'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Navigation from '@/components/Navigation'

// Count Up Component
function CountUp({ target, suffix = '+' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 1500
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [target, hasAnimated])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-blue-600">
      {count}{suffix}
    </div>
  )
}

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

export default function Home() {
  const [stats, setStats] = useState<any>({ total_lawyers: 6, total_clients: 0, total_courses: 4, total_articles: 4 })
  const [articles, setArticles] = useState<any[]>([
    {
      id: 1,
      category: 'Law',
      title: 'Understanding Your Legal Rights in Nigeria',
      excerpt: 'A comprehensive guide to knowing and protecting your rights under Nigerian law.',
      author_name: 'LegallySwift',
      published_at: new Date().toISOString(),
    },
    {
      id: 2,
      category: 'Business',
      title: 'Starting a Business in Nigeria: Legal Requirements',
      excerpt: 'Everything you need to know about registering and running a business legally.',
      author_name: 'LegallySwift',
      published_at: new Date().toISOString(),
    },
    {
      id: 3,
      category: 'Technology',
      title: 'The Future of Legal Tech in Nigeria',
      excerpt: 'How technology is transforming the legal industry across Africa.',
      author_name: 'LegallySwift',
      published_at: new Date().toISOString(),
    },
  ])
  const [courses, setCourses] = useState<any[]>([
    {
      id: 1,
      category: 'Law',
      title: 'Legal Basics for Entrepreneurs',
      description: 'Learn the essential legal knowledge every entrepreneur needs.',
      price: 25000,
      duration_hours: 4,
    },
    {
      id: 2,
      category: 'Business',
      title: 'Business Registration Masterclass',
      description: 'Step-by-step guide to registering your business with CAC.',
      price: 15000,
      duration_hours: 3,
    },
    {
      id: 3,
      category: 'Fashion',
      title: 'Fashion Law: Protecting Your Brand',
      description: 'Learn how to protect your fashion designs and brand identity.',
      price: 30000,
      duration_hours: 5,
    },
  ])
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [buttonsLoaded, setButtonsLoaded] = useState(false)

  useEffect(() => {
    setHeroLoaded(true)
    const timer = setTimeout(() => setButtonsLoaded(true), 300)
    
    const supabase = createClient()
    
    async function fetchData() {
      try {
        const { data: statsData } = await supabase
          .from('platform_stats')
          .select('*')
          .single()
        if (statsData) setStats(statsData)

        const { data: articlesData } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .limit(3)
          .order('published_at', { ascending: false })
        if (articlesData && articlesData.length > 0) setArticles(articlesData)

        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .limit(3)
        if (coursesData && coursesData.length > 0) setCourses(coursesData)
      } catch (error) {
        // Silently fail - use default data
      }
    }

    fetchData()
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-gradient-to-r from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slow"></div>
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slower"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div 
              className={`transition-all duration-700 ease-out ${
                heroLoaded 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-75'
              }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Law Meets{' '}
                <span className="text-blue-600 relative inline-block pb-4">
                  Entrepreneurship
                  <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 200 20" preserveAspectRatio="none">
                    <path d="M0 15 Q100 0 200 15" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Nigeria&apos;s legal infrastructure for entrepreneurs, lawyers, and innovators.
                Connect with verified lawyers, access premium training, and stay informed.
              </p>
            </div>

            <div 
              className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-500 ease-out ${
                buttonsLoaded 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-50 translate-y-4'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <Link 
                href="/lawyers" 
                className="bg-blue-600 text-white px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-200 hover:scale-105"
              >
                Find a Lawyer
              </Link>
              <Link 
                href="/courses" 
                className="bg-white text-blue-600 px-8 py-3.5 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all hover:shadow-xl hover:shadow-blue-100 hover:scale-105"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative w-full">
        <div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden">
          <Image 
            src="/banner.png" 
            alt="LegallySwift Banner" 
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70"></div>
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
                Solutions Built Around Your Needs
              </h2>
              <p className="text-xs md:text-base text-white/90 leading-relaxed max-w-2xl mx-auto">
                Our solutions are designed to help you work smarter, adapt faster, and stay ahead 
                in a rapidly evolving legal industry.
              </p>
            </div>
          </div>
        </div>
      </section>

            {/* AI Counsel Section */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400 rounded-full animate-blob-medium"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-indigo-400 rounded-full animate-blob-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-400 rounded-full animate-blob-fast"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-pink-400 rounded-full animate-blob-slower"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center max-w-5xl mx-auto">
              {/* Animated AI Logo */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-6">
                <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping opacity-30"></div>
                <div className="absolute inset-0 border border-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin" style={{ animationDuration: '4s' }}>
                  <div className="absolute inset-1 bg-blue-900 rounded-full"></div>
                </div>
                <div className="absolute inset-2 flex items-center justify-center">
                  <Image 
                    src="/icons/ai.png" 
                    alt="AI Counsel" 
                    width={80} 
                    height={80}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain animate-pulse"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-semibold">Introducing</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                AI Counsel: The Future of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient">
                  Legal Research & Analysis
                </span>
              </h2>

              <p className="text-lg md:text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                AI Counsel meticulously analyzes
              </p>

              {/* Product Cards - 4 items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
                {/* Card 1 - AI Counsel */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/50 group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-full overflow-hidden bg-white/10 border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex items-center justify-center">
                      <Image 
                        src="/icons/aicounsel_logo.jpeg" 
                        alt="AI Counsel" 
                        width={64} 
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-base mb-1 group-hover:text-blue-300 transition-colors">AI Counsel</h3>
                    <p className="text-blue-200 text-xs mb-2">LegalpediaLens</p>
                    <span className="bg-blue-500/20 text-blue-200 text-xs px-3 py-1 rounded-full group-hover:bg-blue-500/40 transition-all">AI Assistant</span>
                  </div>
                </div>

                {/* Card 2 - AI Judiciary */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/30 hover:border-indigo-400/50 group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-full overflow-hidden bg-white/10 border border-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 flex items-center justify-center">
                      <Image 
                        src="/icons/conversation.png" 
                        alt="AI Judiciary" 
                        width={64} 
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-base mb-1 group-hover:text-indigo-300 transition-colors">AI Judiciary</h3>
                    <p className="text-blue-200 text-xs mb-2">Teams</p>
                    <span className="bg-indigo-500/20 text-indigo-200 text-xs px-3 py-1 rounded-full group-hover:bg-indigo-500/40 transition-all">AI Judiciary</span>
                  </div>
                </div>

                {/* Card 3 - Legalpedia Resources */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-400/50 group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-full overflow-hidden bg-white/10 border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex items-center justify-center">
                      <Image 
                        src="/icons/nigerian-coat-of-arms.png" 
                        alt="Legalpedia Resources" 
                        width={64} 
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-base mb-1 group-hover:text-purple-300 transition-colors">Legalpedia Resources</h3>
                    <p className="text-blue-200 text-xs mb-2">20,152 Resources</p>
                    <span className="bg-purple-500/20 text-purple-200 text-xs px-3 py-1 rounded-full group-hover:bg-purple-500/40 transition-all">View Judgements</span>
                  </div>
                </div>

                {/* Card 4 - Articles */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/30 hover:border-pink-400/50 group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-full overflow-hidden bg-white/10 border border-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 flex items-center justify-center">
                      <Image 
                        src="/icons/file.png" 
                        alt="Articles" 
                        width={64} 
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-base mb-1 group-hover:text-pink-300 transition-colors">Articles</h3>
                    <p className="text-blue-200 text-xs mb-2">71 Articles</p>
                    <span className="bg-pink-500/20 text-pink-200 text-xs px-3 py-1 rounded-full group-hover:bg-pink-500/40 transition-all">Publish an Article</span>
                  </div>
                </div>
              </div>

              <p className="text-blue-200 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                Extracting critical insights and patterns that will empower lawyers to make more informed decisions faster.
              </p>

              <Link
                href="/ai"
                className="inline-block mt-8 bg-white text-blue-900 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-2xl hover:scale-105"
              >
                Try AI Counsel
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <CountUp target={stats?.total_lawyers || 6} />
              <div className="text-gray-600 mt-2">Verified Lawyers</div>
            </div>
            <div>
              <CountUp target={stats?.total_clients || 0} />
              <div className="text-gray-600 mt-2">Active Clients</div>
            </div>
            <div>
              <CountUp target={stats?.total_courses || 4} />
              <div className="text-gray-600 mt-2">Training Courses</div>
            </div>
            <div>
              <CountUp target={stats?.total_articles || 4} />
              <div className="text-gray-600 mt-2">Articles & Journals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              A complete ecosystem designed to support legal professionals and entrepreneurs in Nigeria.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Law', description: 'Verified lawyers, legal documents, and escrow-protected payments.', icon: '/icons/law.png' },
              { title: 'Entrepreneurship', description: 'Business resources, mentorship, and startup legal guidance.', icon: '/icons/entrepreneurship.png' },
              { title: 'Innovation & Technology', description: 'Legal tech insights, AI tools, and digital transformation.', icon: '/icons/innovation.png' },
              { title: 'Sustainability', description: 'ESG compliance, green business practices, and regulations.', icon: '/icons/sustainability.png' },
              { title: 'Fashion Law', description: 'IP protection for designers, licensing, and brand defense.', icon: '/icons/fashion.png' },
              { title: 'Journals & News', description: 'Stay informed with legal and business publications.', icon: '/icons/news.png' },
            ].map((module, index) => (
              <ScrollReveal key={index} delay={index * 50}>
                <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-full">
                  <div className="mb-3 flex items-center justify-center h-20 w-20 mx-auto">
                    <Image 
                      src={module.icon} 
                      alt={module.title} 
                      width={80} 
                      height={80}
                      className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1.5 text-center">{module.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-center">{module.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Latest from Our Journals</h2>
              <Link href="/articles" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All →
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {articles?.map((article, index) => (
              <ScrollReveal key={article.id} delay={index * 50}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div className="p-5">
                    <div className="text-sm text-blue-600 font-semibold mb-2">{article.category}</div>
                    <h3 className="text-base font-semibold mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                    <div className="mt-3 text-sm text-gray-500">By {article.author_name}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-14 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Training Programs</h2>
              <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All →
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {courses?.map((course, index) => (
              <ScrollReveal key={course.id} delay={index * 50}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div className="p-5">
                    <div className="text-sm text-blue-600 font-semibold mb-2">{course.category}</div>
                    <h3 className="text-base font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">₦{course.price?.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{course.duration_hours} hours</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Get Started?</h2>
            <p className="text-lg text-blue-100 mb-6">Join LegallySwift today and access premium legal resources.</p>
            <Link 
              href="/signup" 
              className="bg-white text-blue-600 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-2xl inline-block"
            >
              Create Free Account
            </Link>
          </ScrollReveal>
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