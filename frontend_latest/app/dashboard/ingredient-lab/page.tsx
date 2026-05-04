"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FlaskConical,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Shield,
  Droplets,
  Scan,
  CalendarCheck,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Safety = "safe" | "caution" | "avoid"
type MatchLevel = "excellent" | "good" | "caution" | "avoid" | "unknown"

interface Ingredient {
  name: string
  aka: string
  function: string
  safety: Safety
  rating: number
  description: string
  goodFor: string[]
  avoid: string[]
  note?: string
  // Skin condition triggers for matching engine
  goodForConditions: {
    oily?: boolean; dry?: boolean; sensitive?: boolean; acne?: boolean
    dull?: boolean; aging?: boolean; hyperpigmentation?: boolean
    roughTexture?: boolean; barrierDamage?: boolean
  }
  avoidConditions: {
    sensitive?: boolean; verySensitive?: boolean; reactive?: boolean
    pregnancy?: boolean; sunExposed?: boolean
  }
}

// ─── Knowledge base ──────────────────────────────────────────────────────────
const ingredientDatabase: Record<string, Ingredient> = {
  "retinol": {
    name: "Retinol", aka: "Vitamin A, Retinyl Palmitate", function: "Anti-aging, Cell turnover",
    safety: "caution", rating: 9.2,
    description: "The gold standard anti-aging ingredient. Increases cell turnover, stimulates collagen, and fades dark spots. Start low (0.25%) and build up slowly.",
    goodFor: ["Aging", "Wrinkles", "Texture", "Acne"], avoid: ["Pregnant / nursing women", "Sensitive skin (start low)", "Before sun exposure"],
    note: "Always use SPF when using retinol. Begin 2x per week.",
    goodForConditions: { acne: true, aging: true, roughTexture: true, hyperpigmentation: true },
    avoidConditions: { verySensitive: true, reactive: true, sunExposed: true },
  },
  "niacinamide": {
    name: "Niacinamide", aka: "Vitamin B3, Nicotinamide", function: "Sebum control, Brightening, Anti-inflammatory",
    safety: "safe", rating: 9.6,
    description: "A multitasking powerhouse that reduces pore appearance, regulates sebum, brightens dark spots, and strengthens the skin barrier. Suitable for all skin types.",
    goodFor: ["Oily skin", "Enlarged pores", "Hyperpigmentation", "Sensitive skin"], avoid: [],
    note: "Can be combined with most actives. Ideal 5-10% concentration.",
    goodForConditions: { oily: true, sensitive: true, hyperpigmentation: true, barrierDamage: true, dull: true },
    avoidConditions: {},
  },
  "hyaluronic acid": {
    name: "Hyaluronic Acid", aka: "HA, Sodium Hyaluronate, Hyaluronan", function: "Hydration, Plumping",
    safety: "safe", rating: 9.8,
    description: "A humectant that holds up to 1000x its weight in water. Draws moisture into the skin, leaving it plump and supple. Works best when applied to damp skin.",
    goodFor: ["All skin types", "Dehydration", "Fine lines"], avoid: [],
    note: "Apply on damp skin and seal with a moisturizer for best results.",
    goodForConditions: { dry: true, aging: true },
    avoidConditions: {},
  },
  "salicylic acid": {
    name: "Salicylic Acid", aka: "BHA, Beta Hydroxy Acid", function: "Exfoliation, Pore cleansing, Anti-acne",
    safety: "caution", rating: 9.1,
    description: "An oil-soluble BHA that penetrates deep into pores to dissolve excess sebum and dead cells. The #1 ingredient for acne and blackheads.",
    goodFor: ["Acne", "Oily skin", "Blackheads", "Enlarged pores"], avoid: ["Dry / sensitive skin (use lower concentration)", "Aspirin allergy"],
    note: "Use 0.5–2% concentration. Start 2x per week.",
    goodForConditions: { oily: true, acne: true, roughTexture: true },
    avoidConditions: { sensitive: true, verySensitive: true },
  },
  "vitamin c": {
    name: "Vitamin C", aka: "L-Ascorbic Acid, Ascorbyl Glucoside, AA2G", function: "Antioxidant, Brightening, Collagen support",
    safety: "caution", rating: 9.4,
    description: "A powerful antioxidant that brightens, evens tone, and boosts collagen production. L-Ascorbic Acid is the most potent form but can be unstable.",
    goodFor: ["Dull skin", "Dark spots", "Anti-aging", "Sun damage"], avoid: ["Use with retinol (at different times)", "Sensitive skin — start low"],
    note: "Use 10-20% LAA in morning routine. Store away from light.",
    goodForConditions: { dull: true, hyperpigmentation: true, aging: true },
    avoidConditions: { verySensitive: true, reactive: true },
  },
  "ceramides": {
    name: "Ceramides", aka: "Ceramide NP, Ceramide AP, Ceramide EOP", function: "Barrier repair, Moisture retention",
    safety: "safe", rating: 9.7,
    description: "Lipid molecules that make up 50% of the skin barrier. Essential for locking in moisture and protecting against environmental damage.",
    goodFor: ["Dry skin", "Sensitive skin", "Eczema", "Barrier damage"], avoid: [],
    note: "Look for ceramides paired with cholesterol and fatty acids for best barrier repair.",
    goodForConditions: { dry: true, sensitive: true, barrierDamage: true },
    avoidConditions: {},
  },
  "azelaic acid": {
    name: "Azelaic Acid", aka: "Nonanedioic Acid", function: "Anti-inflammatory, Brightening, Anti-acne",
    safety: "safe", rating: 9.0,
    description: "A gentle multitasker that fights acne bacteria, reduces redness, and fades post-acne marks. Well tolerated even by sensitive and rosacea-prone skin.",
    goodFor: ["Rosacea", "Acne", "Post-acne marks", "Sensitive skin"], avoid: [],
    note: "Available OTC at 10%, prescription at 15-20%. Great for sensitive skin.",
    goodForConditions: { acne: true, sensitive: true, hyperpigmentation: true, dull: true },
    avoidConditions: {},
  },
  "aha glycolic": {
    name: "Glycolic Acid", aka: "AHA, Alpha Hydroxy Acid", function: "Chemical exfoliation, Brightening",
    safety: "caution", rating: 8.9,
    description: "The smallest AHA — deeply exfoliates, unclogs pores, and dramatically improves dull, uneven skin. Boosts collagen when used consistently.",
    goodFor: ["Uneven texture", "Dullness", "Anti-aging", "Dark spots"], avoid: ["Sensitive skin", "Rosacea", "After sun exposure"],
    note: "Start at 5-7%, max 10% OTC. Always wear SPF — increases photosensitivity.",
    goodForConditions: { dull: true, roughTexture: true, aging: true, hyperpigmentation: true },
    avoidConditions: { sensitive: true, verySensitive: true, sunExposed: true },
  },
  "peptides": {
    name: "Peptides", aka: "Matrixyl, Argireline, Copper Peptides", function: "Anti-aging, Collagen synthesis",
    safety: "safe", rating: 8.7,
    description: "Short chains of amino acids that signal skin cells to produce more collagen. Excellent for fine lines, firmness, and barrier support with no irritation.",
    goodFor: ["Aging", "Fine lines", "Loss of firmness", "All skin types"], avoid: [],
    note: "Works synergistically with retinol and hyaluronic acid.",
    goodForConditions: { aging: true, dry: true, barrierDamage: true },
    avoidConditions: {},
  },
  "benzoyl peroxide": {
    name: "Benzoyl Peroxide", aka: "BPO", function: "Antibacterial, Anti-acne",
    safety: "caution", rating: 8.5,
    description: "Kills acne-causing bacteria directly in the pore. One of the most effective OTC acne treatments. Starts at 2.5% and can go up to 10%.",
    goodFor: ["Inflammatory acne", "Pustules", "Oily skin"], avoid: ["Dry / sensitive skin", "Can bleach fabric"],
    note: "Start with 2.5% to minimize irritation. Spot treat or wash-off formulas preferred.",
    goodForConditions: { acne: true, oily: true },
    avoidConditions: { sensitive: true, verySensitive: true, dry: true },
  },
}

// ─── Skin matching engine ────────────────────────────────────────────────────
interface SkinContext {
  // From Skin Calendar (daily check-in)
  calendarData?: {
    oiliness: number; hydration: number; sensitivity: number
    acne: number; dullness: number; overall: number; date: string
  }
  // From Skin Analysis (photo-based)
  analysisData?: {
    skinType: string; concerns: string[]
    detailedMetrics: { moisture: number; oiliness: number; sensitivity: number; acne?: number; hyperpigmentation: number; texture: number; fineLines: number }
    ingredientsToUse: { name: string; priority: string }[]
    ingredientsToAvoid: string[]
    date: string
  }
}

interface MatchResult {
  level: MatchLevel
  score: number       // 0–100
  reasons: string[]  // why this ingredient fits or doesn't
  sources: ("calendar" | "analysis")[]
}

function matchIngredient(ing: Ingredient, ctx: SkinContext): MatchResult {
  const reasons: string[] = []
  const sources: ("calendar" | "analysis")[] = []
  let score = 50 // neutral baseline

  const { calendarData, analysisData } = ctx

  // ── Signals from Skin Calendar ──────────────────────────────────────────
  if (calendarData) {
    sources.push("calendar")
    const { oiliness, hydration, sensitivity, acne, dullness } = calendarData

    if (oiliness >= 7 && ing.goodForConditions.oily) {
      score += 20; reasons.push("Matches your high oiliness today")
    }
    if (hydration <= 4 && ing.goodForConditions.dry) {
      score += 20; reasons.push("Boosts low hydration levels today")
    }
    if (acne >= 6 && ing.goodForConditions.acne) {
      score += 25; reasons.push("Targets active breakouts you logged")
    }
    if (dullness >= 6 && ing.goodForConditions.dull) {
      score += 15; reasons.push("Brightens today's dull complexion")
    }
    if (sensitivity >= 7 && ing.avoidConditions.verySensitive) {
      score -= 35; reasons.push("High sensitivity today — this may irritate")
    } else if (sensitivity >= 5 && ing.avoidConditions.sensitive) {
      score -= 20; reasons.push("Moderate sensitivity — use with caution")
    }
    if (sensitivity >= 5 && ing.goodForConditions.sensitive) {
      score += 15; reasons.push("Gentle enough for your sensitive state")
    }
    if (oiliness <= 3 && ing.avoidConditions.dry) {
      score -= 15; reasons.push("Skin is very dry — this may over-strip")
    }
  }

  // ── Signals from Skin Analysis ──────────────────────────────────────────
  if (analysisData) {
    sources.push("analysis")
    const { skinType, concerns, detailedMetrics, ingredientsToUse, ingredientsToAvoid } = analysisData

    // Direct AI recommendations override
    const aiRecommended = ingredientsToUse.some(
      (r) => r.name.toLowerCase().includes(ing.name.toLowerCase()) ||
             ing.name.toLowerCase().includes(r.name.toLowerCase())
    )
    const aiAvoided = ingredientsToAvoid.some(
      (a) => a.toLowerCase().includes(ing.name.toLowerCase()) ||
             ing.name.toLowerCase().includes(a.toLowerCase())
    )

    if (aiRecommended) {
      score += 30; reasons.push("Recommended by your AI skin analysis")
    }
    if (aiAvoided) {
      score -= 40; reasons.push("Flagged to avoid by your AI skin analysis")
    }

    // Metric-based signals
    if (detailedMetrics.oiliness > 65 && ing.goodForConditions.oily) {
      score += 15; reasons.push("Matches elevated oiliness from photo analysis")
    }
    if (detailedMetrics.moisture < 40 && ing.goodForConditions.dry) {
      score += 15; reasons.push("Addresses low moisture from photo analysis")
    }
    if (detailedMetrics.sensitivity > 60 && ing.avoidConditions.sensitive) {
      score -= 20; reasons.push("Skin analysis detected high sensitivity")
    }
    if (detailedMetrics.hyperpigmentation > 55 && ing.goodForConditions.hyperpigmentation) {
      score += 15; reasons.push("Targets hyperpigmentation detected in analysis")
    }
    if (detailedMetrics.texture > 60 && ing.goodForConditions.roughTexture) {
      score += 12; reasons.push("Smooths rough texture from your scan")
    }
    if (detailedMetrics.fineLines > 55 && ing.goodForConditions.aging) {
      score += 12; reasons.push("Addresses fine lines from your analysis")
    }

    // Skin type fit
    const skinLower = skinType.toLowerCase()
    if (skinLower.includes("oily") && ing.goodForConditions.oily) {
      score += 10; reasons.push(`Suited for your ${skinType} skin type`)
    }
    if (skinLower.includes("dry") && ing.goodForConditions.dry) {
      score += 10; reasons.push(`Suited for your ${skinType} skin type`)
    }
    if (skinLower.includes("sensitive") && ing.goodForConditions.sensitive) {
      score += 10; reasons.push(`Suited for your ${skinType} skin type`)
    }

    // Concerns
    if (concerns.includes("Acne") && ing.goodForConditions.acne) {
      score += 10; reasons.push("Addresses Acne concern from your report")
    }
  }

  // Baseline from safety
  if (ing.safety === "safe") score += 5
  if (ing.safety === "avoid") score -= 20

  const clamped = Math.max(0, Math.min(100, score))
  let level: MatchLevel
  if (sources.length === 0) level = "unknown"
  else if (clamped >= 75) level = "excellent"
  else if (clamped >= 55) level = "good"
  else if (clamped >= 35) level = "caution"
  else level = "avoid"

  if (reasons.length === 0) reasons.push("No strong signals from your skin data")

  return { level, score: clamped, reasons, sources }
}

// ─── Config ──────────────────────────────────────────────────────────────────
const safetyConfig: Record<Safety, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  safe:    { label: "Generally Safe", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  caution: { label: "Use with Caution", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  avoid:   { label: "Avoid", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
}

const matchConfig: Record<MatchLevel, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  excellent: { label: "Excellent Match", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2 },
  good:      { label: "Good Match",      color: "text-sky-700",     bg: "bg-sky-50",     border: "border-sky-200",     icon: TrendingUp },
  caution:   { label: "Use with Care",   color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: AlertCircle },
  avoid:     { label: "Not Recommended", color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200",    icon: XCircle },
  unknown:   { label: "No Skin Data",    color: "text-gray-500",    bg: "bg-gray-50",    border: "border-gray-200",    icon: Minus },
}

const popularIngredients = ["Retinol", "Niacinamide", "Hyaluronic Acid", "Salicylic Acid", "Vitamin C", "Ceramides", "Azelaic Acid", "Glycolic Acid", "Peptides"]

// ─── Page ────────────────────────────────────────────────────────────────────
export default function IngredientLabPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<Ingredient | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("info")
  const [skinCtx, setSkinCtx] = useState<SkinContext>({})
  const [activeTab, setActiveTab] = useState<"search" | "match-all">("search")

  // Load skin data from localStorage (populated by Calendar + Analysis pages)
  useEffect(() => {
    const ctx: SkinContext = {}
    try {
      const cal = localStorage.getItem("skinCalendarLatest")
      if (cal) ctx.calendarData = JSON.parse(cal)
    } catch {}
    try {
      const ana = localStorage.getItem("skinAnalysisLatest")
      if (ana) ctx.analysisData = JSON.parse(ana)
    } catch {}
    setSkinCtx(ctx)
  }, [])

  const hasSkinData = !!(skinCtx.calendarData || skinCtx.analysisData)

  const handleSearch = () => {
    const key = query.toLowerCase().trim()
    const found = ingredientDatabase[key]
    if (found) { setResult(found); setNotFound(false) }
    else { setResult(null); setNotFound(true) }
  }

  // Match score for current search result
  const matchResult = useMemo(() =>
    result ? matchIngredient(result, skinCtx) : null,
    [result, skinCtx]
  )

  // Match all ingredients for the "All Matches" tab
  const allMatches = useMemo(() =>
    Object.values(ingredientDatabase)
      .map((ing) => ({ ing, match: matchIngredient(ing, skinCtx) }))
      .sort((a, b) => b.match.score - a.match.score),
    [skinCtx]
  )

  const safety = result ? safetyConfig[result.safety] : null

  return (
    <div className="min-h-screen bg-[#f5f4f8]">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Ingredient Lab</h1>
            <p className="text-sm text-gray-400 mt-0.5">Matched to your real skin data — not generic advice</p>
          </div>
          {/* Data sources badge */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            {skinCtx.calendarData ? (
              <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-xl px-3 py-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-[11px] font-bold text-violet-700">Calendar Logged</span>
              </div>
            ) : (
              <Link href="/dashboard/skin-calendar">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-1.5 hover:border-violet-300 transition-colors cursor-pointer">
                  <CalendarCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] font-semibold text-gray-400">Log skin data</span>
                </div>
              </Link>
            )}
            {skinCtx.analysisData ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5">
                <Scan className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-700">Analysis Linked</span>
              </div>
            ) : (
              <Link href="/dashboard/skin-analysis">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-1.5 hover:border-violet-300 transition-colors cursor-pointer">
                  <Scan className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] font-semibold text-gray-400">Run skin analysis</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* No data banner */}
        {!hasSkinData && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Connect your skin data for personalized matching</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Complete a <Link href="/dashboard/skin-calendar" className="underline font-semibold">daily check-in</Link> or run a <Link href="/dashboard/skin-analysis" className="underline font-semibold">skin analysis</Link> — the lab will instantly match every ingredient to your real skin condition.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1 w-fit">
          {(["search", "match-all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                activeTab === tab ? "bg-[#1a1025] text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
              )}
            >
              {tab === "search" ? "Search Ingredient" : "All Ingredient Matches"}
            </button>
          ))}
        </div>

        {/* ── SEARCH TAB ────────────────────────────────────────────────────── */}
        {activeTab === "search" && (
          <>
            {/* Search bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="e.g. Retinol, Niacinamide, Salicylic Acid..."
                    className="pl-10 h-11 border-gray-100 bg-gray-50 rounded-xl text-sm focus:border-violet-300 focus:ring-0 text-gray-800 placeholder:text-gray-300"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-11 px-6 font-semibold">
                  <FlaskConical className="w-4 h-4 mr-2" />Analyze
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Popular:</span>
                {popularIngredients.map((ing) => (
                  <button key={ing} onClick={() => setQuery(ing)}
                    className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-violet-100 hover:text-violet-700 text-xs font-semibold text-gray-500 transition-colors">
                    {ing}
                  </button>
                ))}
              </div>
            </div>

            {/* Not found */}
            {notFound && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <Info className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-700">Ingredient not found</h3>
                <p className="text-xs text-gray-400 mt-1">Try: Retinol, Niacinamide, Hyaluronic Acid, Ceramides, Azelaic Acid</p>
              </div>
            )}

            {/* Result */}
            {result && safety && matchResult && (
              <div className="space-y-3">
                {/* ── Skin Match Card ─────────────────────────────────────── */}
                {hasSkinData && (
                  <div className={cn("rounded-2xl border-2 p-5", matchConfig[matchResult.level].border, matchConfig[matchResult.level].bg)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {(() => { const Icon = matchConfig[matchResult.level].icon; return <Icon className={cn("w-4 h-4", matchConfig[matchResult.level].color)} /> })()}
                          <span className={cn("text-sm font-black", matchConfig[matchResult.level].color)}>
                            {matchConfig[matchResult.level].label} for Your Skin
                          </span>
                          <div className="flex gap-1 ml-2">
                            {matchResult.sources.includes("calendar") && (
                              <span className="text-[9px] font-black bg-violet-100 text-violet-600 rounded-md px-1.5 py-0.5 tracking-wide">CALENDAR</span>
                            )}
                            {matchResult.sources.includes("analysis") && (
                              <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 rounded-md px-1.5 py-0.5 tracking-wide">AI SCAN</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {matchResult.reasons.map((r, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                              <span className="text-gray-400 mt-0.5">•</span>
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Score gauge */}
                      <div className="flex-shrink-0 text-center">
                        <div className="relative w-16 h-16">
                          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                            <circle cx="32" cy="32" r="26" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                            <circle cx="32" cy="32" r="26" fill="none"
                              stroke={matchResult.level === "excellent" ? "#059669" : matchResult.level === "good" ? "#0284c7" : matchResult.level === "caution" ? "#d97706" : "#dc2626"}
                              strokeWidth="6" strokeLinecap="round"
                              strokeDasharray={`${(matchResult.score / 100) * 163} 163`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-black text-gray-900">{matchResult.score}</span>
                          </div>
                        </div>
                        <div className="text-[9px] text-gray-400 font-semibold mt-1">MATCH SCORE</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overview card */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-black text-gray-900">{result.name}</h2>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${safety.bg} ${safety.color}`}>
                          <safety.icon className="w-3.5 h-3.5" />{safety.label}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Also known as: <span className="text-gray-600 font-medium">{result.aka}</span></p>
                      <p className="text-xs text-violet-600 font-semibold mt-1">{result.function}</p>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className="text-3xl font-black text-gray-900">{result.rating}</div>
                      <div className="flex items-center gap-0.5 justify-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < Math.round(result.rating / 2) ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                        ))}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Safety Score</div>
                    </div>
                  </div>

                  {[
                    { id: "info", icon: Info, label: "What it does", content: <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p> },
                    { id: "good", icon: CheckCircle2, label: `Good for (${result.goodFor.length})`,
                      content: <div className="flex flex-wrap gap-2">{result.goodFor.map((t) => <span key={t} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">{t}</span>)}</div> },
                    { id: "avoid", icon: XCircle, label: "Avoid if...",
                      content: result.avoid.length > 0
                        ? <div className="flex flex-wrap gap-2">{result.avoid.map((t) => <span key={t} className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">{t}</span>)}</div>
                        : <p className="text-sm text-gray-400">No known groups to avoid — suitable for everyone.</p> },
                  ].map(({ id, icon: Icon, label, content }) => (
                    <div key={id} className="border-t border-gray-50">
                      <button onClick={() => setExpandedSection(expandedSection === id ? null : id)}
                        className="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-violet-500" />
                          <span className="text-sm font-semibold text-gray-700">{label}</span>
                        </div>
                        {expandedSection === id ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                      </button>
                      {expandedSection === id && <div className="px-6 pb-4">{content}</div>}
                    </div>
                  ))}

                  {result.note && (
                    <div className="mx-4 mb-4 flex items-start gap-3 bg-violet-50 rounded-xl p-3.5">
                      <Zap className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-violet-700 font-medium leading-relaxed"><span className="font-bold">Pro tip:</span> {result.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── ALL MATCHES TAB ────────────────────────────────────────────────── */}
        {activeTab === "match-all" && (
          <div className="space-y-3">
            {!hasSkinData ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">No Skin Data Yet</h3>
                <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">
                  Log your daily skin data in Skin Calendar or run a photo-based Skin Analysis to see all ingredients ranked for your skin.
                </p>
                <div className="flex items-center justify-center gap-3 mt-5">
                  <Link href="/dashboard/skin-calendar">
                    <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl border-gray-200">
                      <CalendarCheck className="w-3.5 h-3.5" />Daily Check-in
                    </Button>
                  </Link>
                  <Link href="/dashboard/skin-analysis">
                    <Button size="sm" className="gap-2 text-xs rounded-xl bg-violet-600 hover:bg-violet-500">
                      <Scan className="w-3.5 h-3.5" />Run Analysis
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 font-medium">
                  {allMatches.length} ingredients ranked by compatibility with your skin data
                  {skinCtx.calendarData && ` · Calendar: ${new Date(skinCtx.calendarData.date).toLocaleDateString()}`}
                  {skinCtx.analysisData && ` · Analysis: ${new Date(skinCtx.analysisData.date).toLocaleDateString()}`}
                </p>
                <div className="grid gap-2">
                  {allMatches.map(({ ing, match }) => {
                    const cfg = matchConfig[match.level]
                    const Icon = cfg.icon
                    return (
                      <div key={ing.name} className="bg-white rounded-2xl border border-gray-100 hover:border-violet-200 transition-colors p-4">
                        <div className="flex items-center gap-4">
                          {/* Score ring */}
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                              <circle cx="20" cy="20" r="15" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                              <circle cx="20" cy="20" r="15" fill="none"
                                stroke={match.level === "excellent" ? "#059669" : match.level === "good" ? "#0284c7" : match.level === "caution" ? "#d97706" : "#dc2626"}
                                strokeWidth="4" strokeLinecap="round"
                                strokeDasharray={`${(match.score / 100) * 94} 94`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[9px] font-black text-gray-800">{match.score}</span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-gray-900">{ing.name}</span>
                              <span className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg", cfg.bg, cfg.color)}>
                                <Icon className="w-3 h-3" />{cfg.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">{ing.function}</p>
                            <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{match.reasons[0]}</p>
                          </div>

                          {/* Analyze button */}
                          <button
                            onClick={() => { setQuery(ing.name.toLowerCase()); handleSearch(); setActiveTab("search") }}
                            className="flex-shrink-0 text-[11px] font-semibold text-violet-600 hover:text-violet-800 px-3 py-1.5 rounded-xl hover:bg-violet-50 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Product compare — always visible */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-violet-500" />
            <h3 className="text-sm font-bold text-gray-900">Product Formula Comparison</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "CeraVe Moisturizing Cream", brand: "CeraVe", keyIngredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"], score: 94, verdict: "Excellent", verdictColor: "text-emerald-600 bg-emerald-50" },
              { name: "Neutrogena Hydro Boost", brand: "Neutrogena", keyIngredients: ["Hyaluronic Acid", "Dimethicone"], score: 81, verdict: "Good", verdictColor: "text-sky-600 bg-sky-50" },
            ].map((product) => (
              <div key={product.name} className="border border-gray-100 rounded-xl p-4 hover:border-violet-200 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900 leading-tight">{product.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{product.brand}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${product.verdictColor}`}>{product.verdict}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${product.score}%` }} />
                  </div>
                  <span className="text-xs font-black text-gray-900">{product.score}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.keyIngredients.map((ing) => (
                    <span key={ing} className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-semibold">{ing}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-200 rounded-xl text-xs font-semibold text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors">
            <Droplets className="w-3.5 h-3.5" />Add product to compare
          </button>
        </div>

      </div>
    </div>
  )
}
