"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  ArrowRight,
  ScanFace,
  Star,
  ChevronRight,
  Shield,
  Zap,
  Heart,
  Bot,
  ShoppingBag,
  BookOpen,
  Users,
  CheckCircle2,
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-violet-100/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">Lumière</span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500">
            <Link href="#features" className="hover:text-violet-600 transition-colors">Features</Link>
            <Link href="#how" className="hover:text-violet-600 transition-colors">How it Works</Link>
            <Link href="#reviews" className="hover:text-violet-600 transition-colors">Reviews</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-gray-500 hover:text-violet-600 transition-colors px-4 py-2">
              Sign In
            </Link>
            <Button
              onClick={() => router.push("/login")}
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-5 h-9 text-sm font-semibold shadow-md shadow-violet-200 transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 px-6">
        {/* Soft background wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(167,139,250,0.15),transparent)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold text-violet-700 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Beauty Intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.08] tracking-tight mb-6">
            Your skin deserves{" "}
            <span className="relative inline-block">
              <span className="text-violet-600">expert care</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 8.5C50 3 100 1 150 3.5C200 6 250 9 298 5" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Lumière combines AI skin analysis, curated product recommendations, and expert-led courses to deliver your most radiant self — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-violet-200 w-full sm:w-auto"
            >
              Start Free Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
              className="rounded-full px-8 h-12 text-base border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-700 w-full sm:w-auto"
            >
              Explore Features
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="font-medium text-gray-600">4.9</span>
              <span>from 2,800+ reviews</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Dermatologist approved</span>
            </div>
          </div>
        </div>

        {/* Hero visual — bento grid */}
        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-3 gap-3 relative z-10">
          {/* Main card */}
          <div className="col-span-2 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 p-6 text-white min-h-56 flex flex-col justify-between shadow-xl shadow-violet-200">
            <div className="flex items-center gap-2 text-violet-200 text-sm font-medium">
              <ScanFace className="w-4 h-4" />
              AI Skin Analysis
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">Your skin score</div>
              <div className="flex items-end gap-2">
                <span className="text-6xl font-black leading-none">87</span>
                <span className="text-violet-300 text-lg mb-1">/ 100</span>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {["Hydration +12%", "Radiance +8%", "Pores -5%"].map(tag => (
                  <span key={tag} className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Side cards */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5 flex flex-col justify-between flex-1">
              <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-xs text-gray-500 mt-0.5">User rating</div>
              </div>
            </div>
            <div className="rounded-2xl bg-violet-50 border border-violet-100 p-5 flex flex-col justify-between flex-1">
              <Users className="w-6 h-6 text-violet-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12k+</div>
                <div className="text-xs text-gray-500 mt-0.5">Members</div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="rounded-2xl bg-gray-900 p-5 text-white flex flex-col justify-between">
            <Bot className="w-6 h-6 text-violet-400" />
            <div>
              <div className="text-sm font-semibold">AI Advisor</div>
              <div className="text-xs text-gray-400 mt-0.5">24/7 skin support</div>
            </div>
          </div>
          <div className="rounded-2xl bg-pink-50 border border-pink-100 p-5 flex flex-col justify-between">
            <ShoppingBag className="w-6 h-6 text-pink-500" />
            <div>
              <div className="text-sm font-semibold text-gray-900">60+ Products</div>
              <div className="text-xs text-gray-400 mt-0.5">Curated skincare</div>
            </div>
          </div>
          <div className="rounded-2xl bg-green-50 border border-green-100 p-5 flex flex-col justify-between">
            <BookOpen className="w-6 h-6 text-green-500" />
            <div>
              <div className="text-sm font-semibold text-gray-900">12 Courses</div>
              <div className="text-xs text-gray-400 mt-0.5">Expert-led</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">How it Works</div>
            <h2 className="text-4xl font-bold text-gray-900">Three steps to your best skin</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: ScanFace, color: "violet", title: "Analyze", desc: "Upload a selfie or answer a short quiz. Our AI maps 30+ skin metrics in seconds." },
              { step: "02", icon: Sparkles, color: "purple", title: "Personalize", desc: "Get a tailored routine, product recommendations, and treatments matched to your profile." },
              { step: "03", icon: Zap, color: "indigo", title: "Transform", desc: "Track progress week by week with AI-powered check-ins and expert guidance." },
            ].map(({ step, icon: Icon, color, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl bg-${color}-100 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <span className={`text-4xl font-black text-${color}-100`}>{step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Features</div>
            <h2 className="text-4xl font-bold text-gray-900">Everything your skin needs</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">A complete platform built for serious skincare — from first analysis to long-term transformation.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: ScanFace, title: "AI Skin Scan", desc: "Advanced computer vision analyzes your skin type, texture, moisture levels, and early signs of aging.", badge: "Most Popular" },
              { icon: Bot, title: "AI Skin Advisor", desc: "Chat with a dermatology-trained AI, available 24/7 to answer your skin questions with clinical accuracy.", badge: null },
              { icon: ShoppingBag, title: "Curated Shop", desc: "60+ dermatologist-vetted products, filtered to match your exact skin profile. No more guessing.", badge: null },
              { icon: BookOpen, title: "Expert Courses", desc: "12 in-depth skincare courses taught by board-certified dermatologists. Learn at your own pace.", badge: "New" },
              { icon: Heart, title: "Beauty Services", desc: "Book clinic treatments — chemical peels, laser sessions, and facials — directly within the app.", badge: null },
              { icon: Users, title: "Community", desc: "Connect with 12,000+ members, share your journey, and get tips from skincare enthusiasts worldwide.", badge: null },
            ].map(({ icon: Icon, title, desc, badge }) => (
              <div key={title} className="group flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-200 transition-colors">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{title}</span>
                    {badge && (
                      <span className="bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{badge}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Reviews</div>
            <h2 className="text-4xl font-bold text-gray-900">Real results, real people</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Sarah M.", handle: "@sarahskin", rating: 5, text: "The AI analysis picked up early signs of dehydration I had no idea about. My skin has genuinely transformed in 6 weeks." },
              { name: "Jessica L.", handle: "@jessbeauty", rating: 5, text: "I was skeptical but the product recommendations were scarily accurate. Finally found a moisturizer that doesn't break me out." },
              { name: "Emily R.", handle: "@emilyglows", rating: 5, text: "The expert courses are worth it alone. Dr. Chen's Acne Masterclass completely changed how I approach my routine." },
            ].map(({ name, handle, rating, text }) => (
              <div key={name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{`"${text}"`}</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{name}</div>
                  <div className="text-gray-400 text-xs">{handle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { value: "12k+", label: "Active members" },
              { value: "4.9", label: "Average rating" },
              { value: "96%", label: "Satisfaction rate" },
              { value: "30+", label: "Skin metrics tracked" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
                <div className="text-3xl font-black text-violet-600">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-violet-600 rounded-3xl px-8 py-14 shadow-2xl shadow-violet-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-violet-200 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">Ready for your best skin?</h2>
              <p className="text-violet-200 mb-8 leading-relaxed">Join 12,000+ members who have transformed their skincare routine with AI-powered guidance.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  className="bg-white text-violet-700 hover:bg-violet-50 rounded-full px-8 h-12 font-semibold shadow-lg w-full sm:w-auto"
                >
                  Start Free Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 rounded-full px-8 h-12 font-semibold w-full sm:w-auto"
                >
                  Create Account
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-violet-200 text-xs">
                {["No credit card required", "Free skin analysis", "Cancel anytime"].map(txt => (
                  <span key={txt} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {txt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Lumière</span>
            <span className="text-gray-300 text-sm ml-2">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-violet-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-violet-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-violet-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
