'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    async function fetchPlans() {
      const { data } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true })
      
      setPlans(data || [])
      setLoading(false)
    }

    fetchPlans()
  }, [])

  // Plan icons
  const planIcons: { [key: string]: string } = {
    'Free': '🆓',
    'Premium': '⭐',
    'Lawyer Pro': '⚖️',
  }

  // Plan colors
  const planColors: { [key: string]: string } = {
    'Free': 'from-gray-500 to-gray-600',
    'Premium': 'from-blue-500 to-indigo-600',
    'Lawyer Pro': 'from-indigo-500 to-purple-600',
  }

  // Lawyer listing plans
  const lawyerPlans = [
    {
      name: 'Free',
      price: 'Free',
      platformFee: '12%',
      tagline: 'Get listed and start taking clients',
      features: [
        '20 AI credits / month',
        '12.00% platform fee on invoices',
        '3 case intakes / month',
        '5 sealed documents / month',
      ],
      popular: false,
      buttonText: 'Get Started',
      icon: '🆓',
      color: 'from-gray-500 to-gray-600',
    },
    {
      name: 'Pro',
      price: '₦5,000 /mo',
      platformFee: '7%',
      tagline: 'For practitioners building a client base',
      features: [
        '300 AI credits / month',
        '7.00% platform fee on invoices',
        'Unlimited case intakes',
        'Unlimited document signing',
        'Boosted directory placement',
        'Verified precedent research',
        'See who viewed your profile',
      ],
      popular: true,
      buttonText: 'Choose Pro',
      icon: '⭐',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Firm',
      price: '₦10,000 /mo',
      platformFee: '5%',
      tagline: 'For chambers and multi-lawyer practices',
      features: [
        '800 AI credits / month',
        '5.00% platform fee on invoices',
        'Unlimited case intakes',
        'Unlimited document signing',
        'Boosted directory placement',
        'Verified precedent research',
        'See who viewed your profile',
        'Firm seats, shared wallet & branding',
        'Priority support',
      ],
      popular: false,
      buttonText: 'Choose Firm',
      icon: '🏢',
      color: 'from-indigo-500 to-purple-600',
    },
  ]

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true)
    }
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
              Choose Your Plan
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Access premium legal resources, training, and tools designed for entrepreneurs and legal professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button className="px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg shadow-blue-200">
                For Clients
              </button>
              <button className="px-6 py-2 rounded-full text-sm font-semibold text-gray-700 hover:text-blue-600">
                For Lawyers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Client Plans */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading plans...</p>
            </div>
          ) : plans && plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => {
                const features = typeof plan.features === 'string' 
                  ? JSON.parse(plan.features) 
                  : plan.features || []
                
                const isPro = plan.name === 'Lawyer Pro'
                const displayPrice = billingCycle === 'monthly' 
                  ? plan.price_monthly 
                  : plan.price_yearly || plan.price_monthly * 12 * 0.8
                
                return (
                  <div 
                    key={plan.id} 
                    className={`bg-white border rounded-2xl p-6 md:p-8 flex flex-col relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                      isPro 
                        ? 'border-blue-600 shadow-xl shadow-blue-100' 
                        : 'border-gray-200 hover:shadow-xl'
                    }`}
                  >
                    {isPro && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-lg shadow-blue-200">
                        ⭐ Most Popular
                      </span>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${planColors[plan.name] || 'from-blue-500 to-indigo-600'} rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg`}>
                        {planIcons[plan.name] || '📦'}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                    </div>
                    
                    <div className="text-center mb-6">
                      {displayPrice > 0 ? (
                        <>
                          <span className="text-4xl font-bold text-gray-900">₦{displayPrice.toLocaleString()}</span>
                          <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                          {billingCycle === 'yearly' && plan.price_yearly && (
                            <p className="text-sm text-green-600 mt-1 font-semibold">
                              Save ₦{(plan.price_monthly * 12 - plan.price_yearly).toLocaleString()}
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-gray-900">Free</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <ul className="space-y-3 mb-6">
                        {features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button 
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        isPro 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-200 hover:scale-105' 
                          : plan.price_monthly > 0 
                            ? 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:scale-105' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {plan.price_monthly > 0 ? 'Start Free Trial' : 'Get Started Free'}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Plans Available</h3>
              <p className="text-gray-500">Subscription plans will appear here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lawyer Listing Plans */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Pay Less as You Earn More
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every plan lowers the fee we take on your invoices. If you bill regularly, the plan pays for itself.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {lawyerPlans.map((plan) => (
              <div 
                key={plan.name} 
                className={`bg-white border rounded-2xl p-6 md:p-8 flex flex-col relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-blue-600 shadow-xl shadow-blue-100' 
                    : 'border-gray-200 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-lg shadow-blue-200">
                    Most Popular
                  </span>
                )}

                {/* Icon and Name */}
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                </div>

                {/* Platform Fee */}
                <div className="text-center mb-6">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Platform fee</p>
                  <p className="text-2xl font-bold text-blue-600">{plan.platformFee}</p>
                  <p className="text-xs text-gray-500">on each invoice you issue</p>
                </div>

                {/* Features */}
                <div className="flex-1">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-200 hover:scale-105' 
                      : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:scale-105'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Promo Code */}
          <div className="max-w-md mx-auto mt-10">
            <p className="text-center text-sm font-semibold text-gray-700 mb-3">Have a promo code?</p>
            <p className="text-center text-xs text-gray-500 mb-4">Enter it below to unlock your plan — no card needed.</p>
            {promoApplied ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700 font-semibold">✓ Promo code applied successfully!</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="PIL-XXXXXXXX"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Value Comparison */}
          <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Does it pay off?</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">On ₦500,000 of invoices a month</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-gray-700 mb-1">Free — 12% fee</p>
                <p className="text-2xl font-bold text-gray-900">₦60,000</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border-2 border-blue-600">
                <p className="text-sm font-semibold text-blue-600 mb-1">Pro — 7% fee + ₦5,000</p>
                <p className="text-2xl font-bold text-blue-600">₦40,000</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-500">
                <p className="text-sm font-semibold text-green-700 mb-1">You keep</p>
                <p className="text-2xl font-bold text-green-700">₦20,000 more</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Pro pays for itself once you bill roughly ₦100,000 a month. Above that, every naira of the fee difference is yours.
            </p>
          </div>

          {/* Billing Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Billed monthly in naira through Paystack. Cancel any time — you keep access until the end of the period you have paid for. 
            Escrow protection, verified profiles and signature verification are free on every plan.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Compare Features</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold">Premium</th>
                  <th className="text-center py-4 px-4 font-semibold bg-blue-50">Lawyer Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">Browse Lawyers Directory</td>
                  <td className="text-center text-green-600">✓</td>
                  <td className="text-center text-green-600">✓</td>
                  <td className="text-center text-green-600 bg-blue-50">✓</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">Read Articles & Journals</td>
                  <td className="text-center text-gray-400">Limited</td>
                  <td className="text-center text-green-600">✓</td>
                  <td className="text-center text-green-600 bg-blue-50">✓</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">Access Training Courses</td>
                  <td className="text-center text-gray-400">Preview Only</td>
                  <td className="text-center text-green-600">✓</td>
                  <td className="text-center text-green-600 bg-blue-50">✓</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">Document Templates</td>
                  <td className="text-center text-red-400">—</td>
                  <td className="text-center text-green-600">✓</td>
                  <td className="text-center text-green-600 bg-blue-50">✓</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">Featured Lawyer Listing</td>
                  <td className="text-center text-red-400">—</td>
                  <td className="text-center text-red-400">—</td>
                  <td className="text-center text-green-600 bg-blue-50">✓</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">Case Management Tools</td>
                  <td className="text-center text-red-400">—</td>
                  <td className="text-center text-red-400">—</td>
                  <td className="text-center text-green-600 bg-blue-50">✓</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">Escrow Protection</td>
                  <td className="text-center text-red-400">—</td>
                  <td className="text-center text-green-600">✓</td>
                  <td className="text-center text-green-600 bg-blue-50">✓</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">Analytics Dashboard</td>
                  <td className="text-center text-red-400">—</td>
                  <td className="text-center text-red-400">—</td>
                  <td className="text-center text-green-600 bg-blue-50">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Premium and Lawyer Pro plans come with a 7-day free trial. No credit card required.'
              },
              {
                q: 'How does escrow protection work?',
                a: 'Client funds are held securely for 7 days after work is completed, protecting both parties in the transaction.'
              },
              {
                q: 'Are lawyers on the platform verified?',
                a: 'Yes, every lawyer is checked against their NBA branch, call-to-bar year, and professional credentials before listing.'
              },
              {
                q: 'What is the platform fee?',
                a: 'The platform fee is a percentage charged on each invoice you issue through the platform. It decreases as you upgrade your plan.'
              },
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
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