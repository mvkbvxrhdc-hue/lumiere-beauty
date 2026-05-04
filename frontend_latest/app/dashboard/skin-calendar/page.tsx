"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Circle,
  Flame,
  Sun,
  Moon,
  Droplets,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sparkles,
  ShoppingCart,
  Star,
  ChevronDown,
  ChevronUp,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

const today = new Date()
const todayStr = today.toDateString()

// ─── Daily Skin Data types ────────────────────────────────────────────────────
interface DailySkinData {
  oiliness: number       // 0–10: 0=very dry, 10=very oily
  hydration: number      // 0–10: 0=dehydrated, 10=well hydrated
  sensitivity: number    // 0–10: 0=none, 10=very sensitive/reactive
  acne: number           // 0–10: 0=clear, 10=severe breakout
  dullness: number       // 0–10: 0=glowing, 10=very dull
  overall: number        // 0–10: 0=bad, 10=great
}

// ─── Recommendation engine ────────────────────────────────────────────────────
function getRecommendations(data: DailySkinData) {
  const scores: Record<string, number> = {}

  MOCK_PRODUCTS.forEach((p: any) => {
    let score = 0
    const cat = p.category as string
    const types = (p.skin_types as string[]).map((t) => t.toLowerCase())

    // Oily skin rules
    if (data.oiliness >= 7) {
      if (cat === "Cleansers") score += 20
      if (cat === "Toners") score += 15
      if (cat === "Masks") score += 15
      if (types.some((t) => t.includes("oily") || t.includes("combination"))) score += 20
      if (types.some((t) => t.includes("acne"))) score += 10
    }

    // Dry / dehydrated skin rules
    if (data.hydration <= 4) {
      if (cat === "Serums") score += 25
      if (cat === "Moisturizers") score += 25
      if (types.some((t) => t.includes("dry") || t.includes("sensitive"))) score += 20
      if (p.name.toLowerCase().includes("hyaluronic") || p.name.toLowerCase().includes("hydrat")) score += 15
    }

    // Sensitive / reactive skin rules
    if (data.sensitivity >= 6) {
      if (types.some((t) => t.includes("sensitive"))) score += 25
      if (cat === "Moisturizers") score += 10
      if (p.name.toLowerCase().includes("gentle") || p.name.toLowerCase().includes("calm")) score += 15
    }

    // Breakout rules
    if (data.acne >= 6) {
      if (types.some((t) => t.includes("acne"))) score += 30
      if (cat === "Treatments") score += 20
      if (cat === "Cleansers") score += 15
      if (p.name.toLowerCase().includes("clarif") || p.name.toLowerCase().includes("bha") || p.name.toLowerCase().includes("salicyl")) score += 20
    }

    // Dull skin rules
    if (data.dullness >= 6) {
      if (p.name.toLowerCase().includes("vitamin c") || p.name.toLowerCase().includes("bright")) score += 30
      if (cat === "Serums") score += 10
      if (cat === "Masks") score += 10
    }

    // Always boost sunscreen
    if (cat === "Sunscreen") score += 8

    // Rating boost (0–5 pts)
    score += (p.rating - 4) * 10

    // Only in-stock products
    if (!p.in_stock) score = 0

    scores[p.id] = score
  })

  return MOCK_PRODUCTS
    .filter((p: any) => (scores[p.id] ?? 0) > 0)
    .sort((a: any, b: any) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
    .slice(0, 4)
}

function getReason(data: DailySkinData, cat: string, name: string): string {
  const n = name.toLowerCase()
  if (data.acne >= 6 && (cat === "Treatments" || n.includes("clarif"))) return "Targets today's breakouts"
  if (data.hydration <= 4 && (cat === "Serums" || n.includes("hyaluronic"))) return "Boosts low hydration levels"
  if (data.oiliness >= 7 && cat === "Cleansers") return "Controls excess oil today"
  if (data.oiliness >= 7 && cat === "Masks") return "Deep-cleanses oily pores"
  if (data.sensitivity >= 6 && cat === "Moisturizers") return "Calms reactive skin"
  if (data.dullness >= 6 && n.includes("vitamin c")) return "Brightens dull complexion"
  if (cat === "Sunscreen") return "Daily SPF — always essential"
  if (data.hydration <= 4 && cat === "Moisturizers") return "Seals in moisture for dry skin"
  return "Matched to your skin profile"
}

// ─── Slider component ─────────────────────────────────────────────────────────
function SkinSlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
  color,
}: {
  label: string
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (v: number) => void
  color: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <span className={`text-xs font-black ${color}`}>{value}/10</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-violet-600"
      />
      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

// ─── Routine steps ─────────────────────────────────────────────────────────────
const morningSteps = [
  { id: "m1", label: "Gentle Cleanser", desc: "60 sec, lukewarm water", icon: Droplets, done: true },
  { id: "m2", label: "Vitamin C Serum", desc: "3 drops, pat gently", icon: Zap, done: true },
  { id: "m3", label: "Moisturizer", desc: "Pea-sized amount", icon: Shield, done: false },
  { id: "m4", label: "SPF 50+ Sunscreen", desc: "1/4 tsp for face", icon: Sun, done: false },
]
const eveningSteps = [
  { id: "e1", label: "Oil Cleanser", desc: "Melt away SPF + makeup", icon: Droplets, done: false },
  { id: "e2", label: "Foaming Cleanser", desc: "Double cleanse", icon: Droplets, done: false },
  { id: "e3", label: "Retinol 0.5%", desc: "Pea-sized, avoid eyes", icon: Moon, done: false },
  { id: "e4", label: "Night Cream", desc: "Rich moisturizer", icon: Shield, done: false },
]
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getWeekDates(baseDate: Date) {
  const date = new Date(baseDate)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date)
    d.setDate(d.getDate() + i)
    return d
  })
}

const badges = [
  { icon: Flame, label: "12-day streak", color: "text-orange-500 bg-orange-50" },
  { icon: Shield, label: "SPF Champion", color: "text-sky-500 bg-sky-50" },
  { icon: Moon, label: "Night Owl", color: "text-indigo-500 bg-indigo-50" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SkinCalendarPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const baseDate = new Date(today)
  baseDate.setDate(today.getDate() + weekOffset * 7)
  const weekDates = getWeekDates(baseDate)

  const [morningChecked, setMorningChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(morningSteps.map((s) => [s.id, s.done]))
  )
  const [eveningChecked, setEveningChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(eveningSteps.map((s) => [s.id, s.done]))
  )

  // Daily skin data state
  const [skinData, setSkinData] = useState<DailySkinData>({
    oiliness: 5,
    hydration: 5,
    sensitivity: 3,
    acne: 2,
    dullness: 4,
    overall: 6,
  })
  const [dataSubmitted, setDataSubmitted] = useState(false)
  const [showDataInput, setShowDataInput] = useState(true)

  const { addToCart } = useCart()

  const morningDone = Object.values(morningChecked).filter(Boolean).length
  const eveningDone = Object.values(eveningChecked).filter(Boolean).length
  const totalDone = morningDone + eveningDone
  const totalSteps = morningSteps.length + eveningSteps.length
  const progress = Math.round((totalDone / totalSteps) * 100)

  // Run recommendation engine whenever data changes (after submit)
  const recommendations = useMemo(() => {
    if (!dataSubmitted) return []
    return getRecommendations(skinData)
  }, [skinData, dataSubmitted])

  const handleSubmitSkinData = () => {
    setDataSubmitted(true)
    setShowDataInput(false)
    // Persist to localStorage so Ingredient Lab can read it
    const entry = { ...skinData, date: new Date().toISOString(), source: "calendar" }
    try {
      const existing = JSON.parse(localStorage.getItem("skinCalendarHistory") || "[]")
      // Keep last 30 days
      existing.unshift(entry)
      localStorage.setItem("skinCalendarHistory", JSON.stringify(existing.slice(0, 30)))
      localStorage.setItem("skinCalendarLatest", JSON.stringify(entry))
    } catch {}
    toast.success("Skin data logged! Personalized recommendations are ready.")
  }

  const handleUpdate = (key: keyof DailySkinData) => (v: number) => {
    setSkinData((prev) => ({ ...prev, [key]: v }))
    if (dataSubmitted) {
      // live-update recommendations as sliders change
    }
  }

  // Overall skin health label
  const healthLabel =
    skinData.overall >= 8 ? "Glowing" :
    skinData.overall >= 6 ? "Good" :
    skinData.overall >= 4 ? "Fair" : "Needs Care"

  const healthColor =
    skinData.overall >= 8 ? "text-emerald-500" :
    skinData.overall >= 6 ? "text-violet-500" :
    skinData.overall >= 4 ? "text-amber-500" : "text-rose-500"

  return (
    <div className="min-h-screen bg-[#f5f4f8]">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Skin Calendar</h1>
            <p className="text-sm text-gray-400 mt-0.5">Log your daily skin condition for personalized product picks</p>
          </div>
        </div>

        {/* Streak + badges */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">12</div>
              <div className="text-xs text-gray-400 font-medium">Day Streak</div>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-100 hidden sm:block" />
          <div className="flex items-center gap-2 flex-wrap">
            {badges.map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${color}`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </div>
            ))}
          </div>
          <div className="ml-auto hidden lg:block">
            <div className="text-right mb-1">
              <span className="text-xs text-gray-400">Today&apos;s progress </span>
              <span className="text-xs font-bold text-gray-900">{progress}%</span>
            </div>
            <div className="w-36 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Week strip */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-violet-500" />
              {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <button
              onClick={() => setWeekOffset((o) => o + 1)}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((day, i) => {
              const d = weekDates[i]
              const isToday = d.toDateString() === todayStr
              const isPast = d < today && !isToday
              const completionFake = isPast ? [100, 75, 100, 50, 100, 100, 75][i] : isToday ? progress : 0
              return (
                <div key={day} className={cn("flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all", isToday ? "bg-violet-600" : "bg-gray-50 hover:bg-gray-100")}>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", isToday ? "text-violet-200" : "text-gray-400")}>{day}</span>
                  <span className={cn("text-sm font-black", isToday ? "text-white" : isPast ? "text-gray-500" : "text-gray-300")}>{d.getDate()}</span>
                  <div className={cn("w-full h-1 rounded-full overflow-hidden", isToday ? "bg-white/20" : "bg-gray-200")}>
                    <div
                      className={cn("h-full rounded-full", isToday ? "bg-white" : "bg-violet-400")}
                      style={{ width: `${completionFake}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Daily Skin Data Input ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Card header — always visible */}
          <button
            onClick={() => setShowDataInput((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Activity className="w-4 h-4 text-violet-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gray-900">Today&apos;s Skin Check-In</div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {dataSubmitted
                    ? `Logged — Skin health: ${healthLabel}`
                    : "Rate your skin to get personalized product picks"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {dataSubmitted && (
                <Badge className={cn("text-[10px] border-0 font-bold", healthColor, "bg-transparent")}>
                  {healthLabel}
                </Badge>
              )}
              {showDataInput
                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </button>

          {/* Collapsible sliders */}
          {showDataInput && (
            <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <SkinSlider
                  label="Oiliness"
                  leftLabel="Very dry"
                  rightLabel="Very oily"
                  value={skinData.oiliness}
                  onChange={handleUpdate("oiliness")}
                  color={skinData.oiliness >= 7 ? "text-amber-500" : skinData.oiliness <= 3 ? "text-sky-500" : "text-gray-600"}
                />
                <SkinSlider
                  label="Hydration"
                  leftLabel="Dehydrated"
                  rightLabel="Well hydrated"
                  value={skinData.hydration}
                  onChange={handleUpdate("hydration")}
                  color={skinData.hydration <= 4 ? "text-rose-500" : "text-emerald-500"}
                />
                <SkinSlider
                  label="Sensitivity / Redness"
                  leftLabel="None"
                  rightLabel="Very reactive"
                  value={skinData.sensitivity}
                  onChange={handleUpdate("sensitivity")}
                  color={skinData.sensitivity >= 7 ? "text-rose-500" : "text-gray-600"}
                />
                <SkinSlider
                  label="Breakouts / Acne"
                  leftLabel="Clear"
                  rightLabel="Severe"
                  value={skinData.acne}
                  onChange={handleUpdate("acne")}
                  color={skinData.acne >= 7 ? "text-rose-500" : skinData.acne <= 2 ? "text-emerald-500" : "text-gray-600"}
                />
                <SkinSlider
                  label="Dullness"
                  leftLabel="Glowing"
                  rightLabel="Very dull"
                  value={skinData.dullness}
                  onChange={handleUpdate("dullness")}
                  color={skinData.dullness >= 7 ? "text-amber-500" : "text-violet-500"}
                />
                <SkinSlider
                  label="Overall Skin Feeling"
                  leftLabel="Struggling"
                  rightLabel="Feeling great"
                  value={skinData.overall}
                  onChange={handleUpdate("overall")}
                  color={skinData.overall >= 7 ? "text-emerald-500" : skinData.overall <= 4 ? "text-rose-500" : "text-violet-500"}
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={handleSubmitSkinData}
                  className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-9 px-5 text-sm font-semibold flex-1 sm:flex-none"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {dataSubmitted ? "Update Recommendations" : "Get Personalized Picks"}
                </Button>
                {dataSubmitted && (
                  <span className="text-[11px] text-emerald-500 font-semibold">
                    Recommendations updated
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Personalized Product Recommendations ──────────────────────────── */}
        {dataSubmitted && recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Personalized for Today&apos;s Skin</h2>
                <p className="text-[11px] text-gray-400">Based on your skin check-in — updated in real time</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recommendations.map((product: any, idx: number) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-violet-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Match rank badge */}
                  <div className="relative">
                    <Link href={`/dashboard/products/${product.id}`}>
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    </Link>
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {idx === 0 && (
                        <Badge className="bg-violet-600 border-0 text-[10px] font-bold px-2 py-0.5">
                          Best Match
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{product.brand}</p>
                      <Link href={`/dashboard/products/${product.id}`}>
                        <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-violet-600 transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Why recommended */}
                    <div className="flex items-start gap-1.5 bg-violet-50 rounded-lg px-2.5 py-2">
                      <Sparkles className="w-3 h-3 text-violet-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-violet-700 font-medium leading-snug">
                        {getReason(skinData, product.category, product.name)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-semibold text-gray-700">{product.rating}</span>
                      <span className="text-[10px] text-gray-400">({product.review_count})</span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-sm font-black text-violet-600">${product.price}</span>
                      <Button
                        size="sm"
                        className="h-7 px-2.5 rounded-xl bg-[#1a1025] hover:bg-violet-700 text-white text-[10px] font-semibold"
                        onClick={() => {
                          addToCart({ id: product.id, name: product.name, price: product.price, image: product.image_url } as any)
                          toast.success(`${product.name} added to cart!`)
                        }}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Routines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Morning */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <Sun className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Morning Routine</div>
                <div className="text-[11px] text-gray-400">{morningDone}/{morningSteps.length} completed</div>
              </div>
              <div className="ml-auto text-xs font-bold text-amber-500">{Math.round((morningDone / morningSteps.length) * 100)}%</div>
            </div>
            <div className="p-3 space-y-1.5">
              {morningSteps.map((step) => {
                const checked = morningChecked[step.id]
                return (
                  <button
                    key={step.id}
                    onClick={() => setMorningChecked((prev) => ({ ...prev, [step.id]: !prev[step.id] }))}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all",
                      checked ? "bg-emerald-50" : "hover:bg-gray-50"
                    )}
                  >
                    {checked
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                    <step.icon className={cn("w-4 h-4 flex-shrink-0", checked ? "text-emerald-400" : "text-gray-300")} />
                    <div className="min-w-0">
                      <div className={cn("text-sm font-semibold", checked ? "text-emerald-700 line-through" : "text-gray-800")}>{step.label}</div>
                      <div className="text-[11px] text-gray-400 truncate">{step.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Evening */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Moon className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Evening Routine</div>
                <div className="text-[11px] text-gray-400">{eveningDone}/{eveningSteps.length} completed</div>
              </div>
              <div className="ml-auto text-xs font-bold text-indigo-500">{Math.round((eveningDone / eveningSteps.length) * 100)}%</div>
            </div>
            <div className="p-3 space-y-1.5">
              {eveningSteps.map((step) => {
                const checked = eveningChecked[step.id]
                return (
                  <button
                    key={step.id}
                    onClick={() => setEveningChecked((prev) => ({ ...prev, [step.id]: !prev[step.id] }))}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all",
                      checked ? "bg-emerald-50" : "hover:bg-gray-50"
                    )}
                  >
                    {checked
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                    <step.icon className={cn("w-4 h-4 flex-shrink-0", checked ? "text-emerald-400" : "text-gray-300")} />
                    <div className="min-w-0">
                      <div className={cn("text-sm font-semibold", checked ? "text-emerald-700 line-through" : "text-gray-800")}>{step.label}</div>
                      <div className="text-[11px] text-gray-400 truncate">{step.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
