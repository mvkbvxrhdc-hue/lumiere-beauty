"use client"

import { useState } from "react"
import {
  Award,
  Flame,
  Zap,
  Star,
  Gift,
  ChevronRight,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Scan,
  MessageSquare,
  BookOpen,
  Users,
  BookHeart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tiers = [
  { name: "Silver", min: 0, max: 500, color: "from-gray-400 to-gray-500", textColor: "text-gray-500", bg: "bg-gray-50" },
  { name: "Gold", min: 500, max: 2000, color: "from-amber-400 to-yellow-500", textColor: "text-amber-600", bg: "bg-amber-50" },
  { name: "Platinum", min: 2000, max: 5000, color: "from-violet-500 to-indigo-600", textColor: "text-violet-600", bg: "bg-violet-50" },
  { name: "Diamond", min: 5000, max: 10000, color: "from-sky-400 to-cyan-500", textColor: "text-sky-600", bg: "bg-sky-50" },
]

const currentPoints = 1240
const currentTier = tiers[1] // Gold
const nextTier = tiers[2] // Platinum
const progressToNext = Math.round(((currentPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100)

const tasks = [
  { icon: Scan, label: "Complete a Skin Analysis", pts: 100, done: true },
  { icon: MessageSquare, label: "Chat with AI Advisor", pts: 25, done: true },
  { icon: BookHeart, label: "Write a Journal Entry", pts: 30, done: false },
  { icon: Flame, label: "Maintain a 7-day streak", pts: 75, done: false },
  { icon: ShoppingBag, label: "Make your first purchase", pts: 150, done: true },
  { icon: BookOpen, label: "Complete a Course", pts: 200, done: false },
  { icon: Users, label: "Refer a Friend", pts: 300, done: false },
  { icon: Star, label: "Leave a Product Review", pts: 40, done: false },
]

const rewards = [
  { label: "10% Off Next Order", pts: 500, category: "Discount", available: true },
  { label: "Free Shipping Voucher", pts: 300, category: "Shipping", available: true },
  { label: "Free Skin Analysis Report", pts: 800, category: "Feature", available: false },
  { label: "Exclusive Platinum Box", pts: 2000, category: "Gift", available: false },
  { label: "1-on-1 Dermatologist Call", pts: 3000, category: "Premium", available: false },
  { label: "Annual VIP Membership", pts: 5000, category: "VIP", available: false },
]

const history = [
  { label: "Skin Analysis completed", pts: "+100", date: "Today", positive: true },
  { label: "AI Advisor session", pts: "+25", date: "Yesterday", positive: true },
  { label: "Purchase — Vitamin C Serum", pts: "+150", date: "Apr 7", positive: true },
  { label: "Redeemed — 10% Off Coupon", pts: "-500", date: "Apr 5", positive: false },
  { label: "Journal entry written", pts: "+30", date: "Apr 4", positive: true },
]

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<"earn" | "redeem" | "history">("earn")

  return (
    <div className="min-h-screen bg-[#f5f4f8]">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Lumière Rewards</h1>
          <p className="text-sm text-gray-400 mt-0.5">Earn points, unlock exclusive perks</p>
        </div>

        {/* Points hero card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1a1025] px-8 py-8">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 mb-4`}>
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-300 tracking-widest uppercase">Gold Member</span>
              </div>
              <div className="text-5xl font-black text-white">{currentPoints.toLocaleString()}</div>
              <div className="text-sm text-white/40 mt-1">Total points earned</div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-white/40">Progress to Platinum</span>
                  <span className="text-white/60 font-bold">{currentPoints} / {nextTier.min}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-violet-500 transition-all"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <div className="text-[11px] text-white/30 mt-2">{nextTier.min - currentPoints} pts to reach Platinum</div>
              </div>
            </div>
            {/* Tier badges */}
            <div className="flex md:flex-col gap-2 flex-wrap">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all",
                    tier.name === currentTier.name
                      ? "bg-white/15 border-white/20 text-white"
                      : currentPoints >= tier.min
                        ? "bg-white/5 border-white/10 text-white/50"
                        : "bg-transparent border-white/5 text-white/20"
                  )}
                >
                  <Award className="w-3.5 h-3.5" />
                  {tier.name}
                  {tier.name === currentTier.name && (
                    <span className="ml-auto text-[9px] bg-white/20 rounded-full px-2 py-0.5">Current</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-2xl border border-gray-100 p-1">
          {(["earn", "redeem", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all",
                activeTab === tab ? "bg-violet-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {tab === "earn" ? "Earn Points" : tab === "redeem" ? "Redeem" : "History"}
            </button>
          ))}
        </div>

        {/* Tab: Earn */}
        {activeTab === "earn" && (
          <div className="space-y-2">
            {tasks.map(({ icon: Icon, label, pts, done }) => (
              <div
                key={label}
                className={cn(
                  "bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all",
                  done ? "border-emerald-100 opacity-60" : "border-gray-100 hover:border-violet-100 hover:shadow-sm"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", done ? "bg-emerald-50" : "bg-violet-50")}>
                  <Icon className={cn("w-5 h-5", done ? "text-emerald-500" : "text-violet-500")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-semibold", done ? "text-gray-400 line-through" : "text-gray-900")}>{label}</div>
                  <div className="text-xs text-violet-600 font-bold mt-0.5">+{pts} pts</div>
                </div>
                {done
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  : <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}

        {/* Tab: Redeem */}
        {activeTab === "redeem" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rewards.map(({ label, pts, category, available }) => (
              <div
                key={label}
                className={cn(
                  "bg-white rounded-2xl border p-5 transition-all",
                  available ? "border-gray-100 hover:border-violet-200 hover:shadow-sm" : "border-gray-100 opacity-50"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Gift className={cn("w-5 h-5", available ? "text-violet-500" : "text-gray-400")} />
                  </div>
                  {!available && <Lock className="w-4 h-4 text-gray-300" />}
                </div>
                <div className="text-sm font-bold text-gray-900 leading-tight mb-1">{label}</div>
                <div className="text-[11px] text-gray-400 mb-3">{category}</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-black text-violet-600">{pts.toLocaleString()} pts</div>
                  <Button
                    disabled={!available || currentPoints < pts}
                    size="sm"
                    className={cn(
                      "rounded-xl text-xs font-bold h-8 px-4",
                      available && currentPoints >= pts
                        ? "bg-violet-600 hover:bg-violet-500 text-white"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    {available && currentPoints >= pts ? "Redeem" : `Need ${pts - currentPoints > 0 ? (pts - currentPoints).toLocaleString() : 0} more`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: History */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {history.map(({ label, pts, date, positive }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-4">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", positive ? "bg-emerald-50" : "bg-rose-50")}>
                  {positive ? <Zap className="w-4 h-4 text-emerald-500" /> : <Gift className="w-4 h-4 text-rose-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{label}</div>
                  <div className="text-[11px] text-gray-400">{date}</div>
                </div>
                <div className={cn("text-sm font-black flex-shrink-0", positive ? "text-emerald-600" : "text-rose-500")}>{pts}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
