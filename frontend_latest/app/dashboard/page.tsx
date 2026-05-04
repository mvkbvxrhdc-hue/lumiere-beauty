"use client"

import { Button } from "@/components/ui/button"
import {
  BookOpen,
  ShoppingBag,
  Users,
  Scan,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CalendarDays,
  Ticket,
  FlaskConical,
  CalendarCheck,
  BookHeart,
  Award,
  Flame,
  Zap,
  Star,
} from "lucide-react"
import Link from "next/link"

const quickActions = [
  { icon: Scan, label: "Skin Analysis", desc: "AI report", href: "/dashboard/skin-analysis", color: "bg-violet-50 text-violet-600" },
  { icon: MessageSquare, label: "AI Advisor", desc: "Ask Dr. Ava", href: "/dashboard/ai-consultation", color: "bg-indigo-50 text-indigo-600" },
  { icon: CalendarCheck, label: "Skin Calendar", desc: "Daily routine", href: "/dashboard/skin-calendar", color: "bg-emerald-50 text-emerald-600" },
  { icon: FlaskConical, label: "Ingredient Lab", desc: "Analyze products", href: "/dashboard/ingredient-lab", color: "bg-amber-50 text-amber-600" },
  { icon: BookHeart, label: "Skin Journal", desc: "Track progress", href: "/dashboard/skin-journal", color: "bg-rose-50 text-rose-600" },
  { icon: Award, label: "Rewards", desc: "1,240 pts", href: "/dashboard/rewards", color: "bg-orange-50 text-orange-600" },
  { icon: Sparkles, label: "Beauty Services", desc: "Book treatments", href: "/dashboard/beauty-services", color: "bg-pink-50 text-pink-600" },
  { icon: ShoppingBag, label: "Shop", desc: "60+ products", href: "/dashboard/products", color: "bg-sky-50 text-sky-600" },
  { icon: BookOpen, label: "Courses", desc: "Expert programs", href: "/dashboard/courses", color: "bg-teal-50 text-teal-600" },
  { icon: Users, label: "Community", desc: "Connect", href: "/dashboard/community", color: "bg-purple-50 text-purple-600" },
  { icon: CalendarDays, label: "My Bookings", desc: "Upcoming", href: "/dashboard/bookings", color: "bg-blue-50 text-blue-600" },
  { icon: Ticket, label: "Coupons", desc: "Offers", href: "/dashboard/coupons", color: "bg-red-50 text-red-600" },
]

const stats = [
  { label: "Skin Score", value: "87", sub: "Above avg", positive: true },
  { label: "Streak", value: "12d", sub: "Keep going!", positive: true },
  { label: "Rewards", value: "1,240", sub: "Points earned", positive: true },
  { label: "Courses", value: "3/12", sub: "Completed", positive: false },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f4f8]">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-5">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1a1025] px-8 py-9">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 border border-violet-500/20 px-3 py-1">
                <Sparkles className="w-3 h-3 text-violet-300" />
                <span className="text-[10px] font-bold text-violet-300 tracking-widest uppercase">AI-Powered Skincare</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white leading-tight">
                  Good morning, <span className="text-violet-300">Lumière</span>
                </h1>
                <p className="mt-2 text-white/40 text-sm leading-relaxed max-w-sm">
                  Your skin is looking great today. Keep up your routine and stay on track.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button asChild className="bg-violet-500 hover:bg-violet-400 text-white font-semibold rounded-xl h-9 px-5 text-sm shadow-lg shadow-violet-900/30">
                  <Link href="/dashboard/skin-analysis">
                    <Scan className="w-4 h-4 mr-2" />Analyze My Skin
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl h-9 px-5 text-sm">
                  <Link href="/dashboard/skin-calendar">Today&apos;s Routine</Link>
                </Button>
              </div>
            </div>

            {/* Skin score card */}
            <div className="hidden md:block flex-shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-52 text-center">
                <div className="text-5xl font-black text-white leading-none">87</div>
                <div className="text-[9px] font-bold text-violet-300 uppercase tracking-widest mt-1">Skin Health Score</div>
                <div className="mt-4 space-y-2.5">
                  {[["Hydration", 82], ["Texture", 74], ["Clarity", 91]].map(([label, val]) => (
                    <div key={String(label)} className="flex items-center gap-2 text-[10px]">
                      <span className="text-white/30 w-14 text-right">{label}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-violet-400" style={{ width: `${val}%` }} />
                      </div>
                      <span className="text-white/40 w-6">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(({ label, value, sub, positive }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:border-violet-100 hover:shadow-sm transition-all">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</div>
              <div className="text-2xl font-black text-gray-900">{value}</div>
              <div className={`text-[11px] mt-1 font-medium ${positive ? "text-emerald-500" : "text-gray-400"}`}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Rewards progress banner */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                <Award className="w-4.5 h-4.5 text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Lumière Rewards</div>
                <div className="text-xs text-gray-400">Gold Member — 1,240 pts</div>
              </div>
            </div>
            <Link href="/dashboard/rewards" className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400" style={{ width: "62%" }} />
            </div>
            <span className="text-xs font-bold text-gray-900">1,240 / 2,000 pts</span>
          </div>
          <div className="text-[11px] text-gray-400">760 pts to reach <span className="font-semibold text-gray-600">Platinum</span> status</div>
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { icon: Flame, label: "12-day streak", sub: "+50 pts", color: "bg-orange-50 text-orange-500" },
              { icon: Zap, label: "Skin Analysis", sub: "+100 pts", color: "bg-violet-50 text-violet-500" },
              { icon: Star, label: "Write a review", sub: "+30 pts", color: "bg-amber-50 text-amber-500" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-700">{label}</div>
                  <div className="text-[10px] text-emerald-500 font-bold">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3">Quick Access</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickActions.map(({ icon: Icon, label, desc, href, color }) => (
              <Link
                key={label}
                href={href}
                className="group bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center text-center hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 ${color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-gray-900 leading-tight">{label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/dashboard/skin-calendar" className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
              <CalendarCheck className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Skin Calendar</h3>
            <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">Personalized daily routines with reminders and streak tracking.</p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 group-hover:gap-2 transition-all">
              Open calendar <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
          <Link href="/dashboard/ingredient-lab" className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
              <FlaskConical className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Ingredient Lab</h3>
            <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">Decode any skincare ingredient and compare product formulas.</p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 group-hover:gap-2 transition-all">
              Analyze now <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
          <Link href="/dashboard/skin-journal" className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
              <BookHeart className="w-4.5 h-4.5 text-rose-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Skin Journal</h3>
            <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">Log your skin, share before & afters, and track your journey.</p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-rose-600 group-hover:gap-2 transition-all">
              Write entry <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
