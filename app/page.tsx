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
          const duration = 2000
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
      { threshold: 0.5 }
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
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [stats, setStats] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [buttonsLoaded, setButtonsLoaded] = useState(false)

  useEffect(() => {
    setHeroLoaded(true)
    const timer = setTimeout(() => setButtonsLoaded(true), 600)
    
    const supabase = createClient()
    
    async function fetchData() {
      const { data: statsData } = await supabase
        .from('platform_stats')
        .select('*')
        .single()
      setStats(statsData)

      const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .limit(3)
        .order('published_at', { ascending: false })
      setArticles(articlesData || [])

      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .limit(3)
      setCourses(coursesData || [])
    }

    fetchData()
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Moving Blobs */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-gradient-to-r from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Animated Moving Blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slow"></div>
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slower"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob-medium"></div>
        <div className="absolute top-10 right-1/4 w-40 h-40 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob-fast"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Zoom-in animation for heading and paragraph */}
            <div 
              className={`transition-all duration-1000 ease-out ${
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

            {/* Pop-in animation for buttons */}
            <div 
              className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-500 ease-out ${
                buttonsLoaded 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-50 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
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

      {/* Full Width Banner Image with Text Overlay */}
      <section className="relative w-full">
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
          <Image 
            src="/banner.png" 
            alt="LegallySwift Banner" 
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70"></div>
          
          {/* Text Overlay with Zoom-In Animation */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                  Solutions Built Around Your Needs
                </h2>
                <p className="text-sm md:text-lg text-white/90 leading-relaxed">
                  Our solutions are designed to help you work smarter, adapt faster, and stay ahead 
                  in a rapidly evolving legal industry. By combining technology with practical legal 
                  solutions, we give you the tools to improve efficiency, deliver better client 
                  experiences, and confidently embrace the future of law.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section with Count Up */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="hover:scale-105 transition-transform duration-300">
              <CountUp target={stats?.total_lawyers || 6} />
              <div className="text-gray-600 mt-2">Verified Lawyers</div>
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <CountUp target={stats?.total_clients || 0} />
              <div className="text-gray-600 mt-2">Active Clients</div>
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <CountUp target={stats?.total_courses || 4} />
              <div className="text-gray-600 mt-2">Training Courses</div>
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <CountUp target={stats?.total_articles || 4} />
              <div className="text-gray-600 mt-2">Articles & Journals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section with Custom PNG Icons */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              A complete ecosystem designed to support legal professionals and entrepreneurs in Nigeria.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Law', description: 'Verified lawyers, legal documents, and escrow-protected payments.', icon: '/icons/law.png' },
              { title: 'Entrepreneurship', description: 'Business resources, mentorship, and startup legal guidance.', icon: '/icons/entrepreneurship.png' },
              { title: 'Innovation & Technology', description: 'Legal tech insights, AI tools, and digital transformation.', icon: '/icons/innovation.png' },
              { title: 'Sustainability', description: 'ESG compliance, green business practices, and regulations.', icon: '/icons/sustainability.png' },
              { title: 'Fashion Law', description: 'IP protection for designers, licensing, and brand defense.', icon: '/icons/fashion.png' },
              { title: 'Journals & News', description: 'Stay informed with legal and business publications.', icon: '/icons/news.png' },
            ].map((module, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-full">
                  <div className="mb-4 flex items-center justify-center h-24 w-24 mx-auto">
                    <Image 
                      src={module.icon} 
                      alt={module.title} 
                      width={96} 
                      height={96}
                      className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{module.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-center">{module.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles with Scroll Reveal */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">Latest from Our Journals</h2>
              <Link href="/articles" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All →
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles?.map((article, index) => (
              <ScrollReveal key={article.id} delay={index * 150}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-semibold mb-2">{article.category}</div>
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {article.author_name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(article.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses with Scroll Reveal - Darker Background */}
      <section className="py-16 md:py-20 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">Featured Training Programs</h2>
              <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All →
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses?.map((course, index) => (
              <ScrollReveal key={course.id} delay={index * 150}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-semibold mb-2">{course.category}</div>
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
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

      {/* Call to Action with Scroll Reveal */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full animate-blob-medium"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full animate-blob-slow"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">Join LegallySwift today and access premium legal resources.</p>
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