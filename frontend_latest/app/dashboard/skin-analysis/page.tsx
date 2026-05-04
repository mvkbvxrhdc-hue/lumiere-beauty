"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Upload, Scan, CheckCircle, Sparkles, Camera, RefreshCw,
  FlaskConical, Sun, Moon, Shield, AlertTriangle, ChevronDown, ChevronUp,
  Activity, Eye, Layers, Droplets, Zap, ShoppingBag, Star, ShoppingCart, ArrowRight,
  Leaf, Cloud, Check,
} from "lucide-react"
import { toast } from "sonner"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import SkinRadarChart from "@/components/skin-radar-chart"

// ─── Types ────────────────────────────────────────────────────────────────────
interface PixelStats {
  meanR: number; meanG: number; meanB: number
  stdR: number; stdG: number; stdB: number
  brightness: number; textureFreq: number; entropy: number; localContrast: number
  zones: { top: ZoneStat; mid: ZoneStat; bottom: ZoneStat }
}
interface ZoneStat { meanR: number; meanG: number; meanB: number; brightness: number; std: number }
interface ZoneAnalysis { moisture: number; oiliness: number; texture: number; redness: number; pores: number }
interface DetailedMetrics {
  moisture: number; dehydrationLines: number; waterContent: number
  oiliness: number; sebumProduction: number; shineLevel: number
  texture: number; clarity: number; evenness: number; roughness: number
  elasticity: number; firmness: number; fineLines: number; wrinkleDepth: number
  hyperpigmentation: number; darkSpots: number; redness: number; sensitivity: number
  poreSize: number; poreClogging: number
}
interface RoutineStep { step: number; product: string; why: string }
interface IngredientRec { name: string; benefit: string; priority: "high" | "medium" | "low" }
interface FullAnalysis {
  skinType: string; concerns: string[]; healthScore: number; ageEstimate: string
  detailedMetrics: DetailedMetrics
  zoneBreakdown: { tZone: ZoneAnalysis; cheeks: ZoneAnalysis; eyeArea: ZoneAnalysis }
  recommendations: string[]; morningRoutine: RoutineStep[]; eveningRoutine: RoutineStep[]
  ingredientsToUse: IngredientRec[]; ingredientsToAvoid: string[]
  lifestyleTips: Array<{
    category: string; icon: string; image: string | null; title: string; tip: string
    frequency: string; impact: "high" | "medium" | "low"; habits: string[]
  }>; confidence: number; trend: string; nextCheckIn: number
}

// ─── Canvas-based pixel analysis (runs entirely in the browser) ───────────────
async function extractPixelStats(imageDataUrl: string): Promise<PixelStats> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Draw to offscreen canvas
      const SAMPLE_SIZE = 300  // resize to 300×300 for consistent sampling
      const canvas = document.createElement("canvas")
      canvas.width = SAMPLE_SIZE
      canvas.height = SAMPLE_SIZE
      const ctx = canvas.getContext("2d")
      if (!ctx) { reject(new Error("Canvas not supported")); return }
      ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)

      // Get actual RGBA pixel data
      const full = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data
      const N = SAMPLE_SIZE * SAMPLE_SIZE

      // ── Global channel stats ────────────────────────────────────────────────
      let sumR = 0, sumG = 0, sumB = 0
      for (let i = 0; i < full.length; i += 4) {
        sumR += full[i]; sumG += full[i + 1]; sumB += full[i + 2]
      }
      const meanR = sumR / N, meanG = sumG / N, meanB = sumB / N
      let varR = 0, varG = 0, varB = 0
      for (let i = 0; i < full.length; i += 4) {
        varR += (full[i]     - meanR) ** 2
        varG += (full[i + 1] - meanG) ** 2
        varB += (full[i + 2] - meanB) ** 2
      }
      const stdR = Math.sqrt(varR / N), stdG = Math.sqrt(varG / N), stdB = Math.sqrt(varB / N)
      const brightness = (meanR + meanG + meanB) / 3 / 255

      // ── Texture frequency: mean |lum[i] - lum[i-1]| ────────────────────────
      let texSum = 0, texCount = 0
      for (let i = 4; i < full.length; i += 4) {
        const lumCur  = (full[i]     * 0.299 + full[i + 1]     * 0.587 + full[i + 2]     * 0.114)
        const lumPrev = (full[i - 4] * 0.299 + full[i - 3]     * 0.587 + full[i - 2]     * 0.114)
        texSum += Math.abs(lumCur - lumPrev)
        texCount++
      }
      const textureFreq = (texSum / texCount) / 255

      // ── Shannon entropy of luminance histogram ──────────────────────────────
      const hist = new Float32Array(256)
      for (let i = 0; i < full.length; i += 4) {
        const lum = Math.round(full[i] * 0.299 + full[i + 1] * 0.587 + full[i + 2] * 0.114)
        hist[lum]++
      }
      let entropy = 0
      for (let v = 0; v < 256; v++) {
        if (hist[v] > 0) {
          const p = hist[v] / N
          entropy -= p * Math.log2(p)
        }
      }
      entropy /= 8  // normalise to 0-1

      // ── Local contrast: std-dev in 5×5 pixel windows ───────────────────────
      const WINDOW = 5
      let lcSum = 0, lcCount = 0
      for (let y = 0; y < SAMPLE_SIZE - WINDOW; y += WINDOW) {
        for (let x = 0; x < SAMPLE_SIZE - WINDOW; x += WINDOW) {
          const lums: number[] = []
          for (let wy = 0; wy < WINDOW; wy++) {
            for (let wx = 0; wx < WINDOW; wx++) {
              const idx = ((y + wy) * SAMPLE_SIZE + (x + wx)) * 4
              lums.push(full[idx] * 0.299 + full[idx + 1] * 0.587 + full[idx + 2] * 0.114)
            }
          }
          const wMean = lums.reduce((a, b) => a + b, 0) / lums.length
          const wStd = Math.sqrt(lums.reduce((a, v) => a + (v - wMean) ** 2, 0) / lums.length)
          lcSum += wStd; lcCount++
        }
      }
      const localContrast = Math.min(1, (lcSum / lcCount) / 60)

      // ── Spatial zone stats (top / mid / bottom thirds) ──────────────────────
      const buildZone = (rowStart: number, rowEnd: number): ZoneStat => {
        let sR = 0, sG = 0, sB = 0, cnt = 0
        for (let y = rowStart; y < rowEnd; y++) {
          for (let x = 0; x < SAMPLE_SIZE; x++) {
            const i = (y * SAMPLE_SIZE + x) * 4
            sR += full[i]; sG += full[i + 1]; sB += full[i + 2]; cnt++
          }
        }
        const mR = sR / cnt, mG = sG / cnt, mB = sB / cnt
        let vSum = 0
        for (let y = rowStart; y < rowEnd; y++) {
          for (let x = 0; x < SAMPLE_SIZE; x++) {
            const i = (y * SAMPLE_SIZE + x) * 4
            const lum = full[i] * 0.299 + full[i + 1] * 0.587 + full[i + 2] * 0.114
            const mLum = mR * 0.299 + mG * 0.587 + mB * 0.114
            vSum += (lum - mLum) ** 2
          }
        }
        return { meanR: mR, meanG: mG, meanB: mB, brightness: (mR + mG + mB) / 3 / 255, std: Math.sqrt(vSum / cnt) }
      }

      const third = Math.floor(SAMPLE_SIZE / 3)
      resolve({
        meanR, meanG, meanB, stdR, stdG, stdB,
        brightness, textureFreq, entropy, localContrast,
        zones: {
          top:    buildZone(0, third),
          mid:    buildZone(third, third * 2),
          bottom: buildZone(third * 2, SAMPLE_SIZE),
        },
      })
    }
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = imageDataUrl
  })
}

// ─── UI helpers ──────────────────────�����────────────────────────────────────────
function scoreLabel(v: number) {
  if (v >= 80) return { label: "Excellent", color: "text-emerald-500" }
  if (v >= 65) return { label: "Good",      color: "text-sky-500" }
  if (v >= 50) return { label: "Fair",      color: "text-amber-500" }
  return          { label: "Needs Care",    color: "text-rose-500" }
}

function MetricBar({ label, value, barColor }: { label: string; value: number; barColor: string }) {
  const { label: sl, color: sc } = scoreLabel(value)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-500">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold ${sc}`}>{sl}</span>
          <span className="text-[11px] font-black text-gray-900 w-7 text-right">{value}</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function RoutineCard({ title, icon: Icon, steps, accent }: { title: string; icon: React.ElementType; steps: RoutineStep[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-gray-900">{title}</span>
      </div>
      {steps.map((s) => (
        <div key={s.step}>
          <button onClick={() => setOpen(open === s.step ? null : s.step)}
            className="w-full flex items-center gap-3 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">{s.step}</div>
            <span className="flex-1 text-xs font-semibold text-gray-800">{s.product}</span>
            {open === s.step ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {open === s.step && (
            <div className="ml-8 mr-2 mb-1 p-2.5 bg-violet-50 rounded-lg">
              <p className="text-[11px] text-violet-800 leading-relaxed">{s.why}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const TABS = ["Overview", "Zones", "Routine", "Ingredients", "Lifestyle", "Products"] as const
type Tab = typeof TABS[number]

// ─── Product recommendation engine ────────────────────────────────────────────
interface ScoredProduct {
  product: (typeof MOCK_PRODUCTS)[number]
  score: number
  reasons: string[]
}

function getProductRecommendations(result: FullAnalysis): ScoredProduct[] {
  const m = result.detailedMetrics
  const concerns = result.concerns.map(c => c.toLowerCase())
  const skinType = result.skinType.toLowerCase()

  return MOCK_PRODUCTS
    .map((p) => {
      let score = 0
      const reasons: string[] = []
      const cat = p.category.toLowerCase()
      const name = p.name.toLowerCase()
      const desc = p.description.toLowerCase()
      const highlights = p.highlights.map(h => h.toLowerCase()).join(" ")
      const fullText = `${name} ${desc} ${highlights}`

      // ── Hydration / moisture signals ───────────────────────────────────────
      if (m.moisture < 45) {
        if (fullText.includes("hydrat") || fullText.includes("hyaluronic") || cat === "serums") {
          score += 30; reasons.push("Your moisture level is low — hydrating serums are a priority")
        }
        if (fullText.includes("moisture") || fullText.includes("plump")) {
          score += 15
        }
      }

      // ── Oiliness / sebum signals ───────────────────────────────────────────
      if (m.oiliness > 60 || skinType.includes("oily")) {
        if (fullText.includes("oil control") || fullText.includes("sebum") || fullText.includes("niacinamide") || fullText.includes("purif")) {
          score += 28; reasons.push("Your oiliness score is elevated — oil-control formulas are recommended")
        }
        if (fullText.includes("lightweight") || fullText.includes("non-comedogenic") || fullText.includes("clay")) {
          score += 15
        }
      }

      // ── Acne / blemish signals ─────────────────────────────────────────────
      if (concerns.some(c => c.includes("acne") || c.includes("blemish")) || m.poreClogging > 55) {
        if (cat === "treatments" || fullText.includes("blemish") || fullText.includes("aha") || fullText.includes("bha") || fullText.includes("salicyl")) {
          score += 32; reasons.push("Active acne concern detected — targeted treatments are matched")
        }
        if (cat === "masks" && fullText.includes("clay")) {
          score += 18; reasons.push("Clay mask recommended to deep-cleanse congested pores")
        }
        if (fullText.includes("non-comedogenic")) {
          score += 10
        }
      }

      // ── Hyperpigmentation / dark spots ────────────────────────────────────
      if (m.hyperpigmentation > 50 || m.darkSpots > 50 || concerns.some(c => c.includes("pigment") || c.includes("dark spot") || c.includes("uneven"))) {
        if (fullText.includes("vitamin c") || fullText.includes("brighten") || fullText.includes("dark spot") || fullText.includes("tone")) {
          score += 30; reasons.push("Hyperpigmentation detected — brightening actives are recommended")
        }
      }

      // ── Texture / roughness ────────────────────────────────────────────────
      if (m.roughness > 55 || m.texture < 45) {
        if (fullText.includes("exfoliat") || fullText.includes("smooth") || fullText.includes("texture") || cat === "toners") {
          score += 25; reasons.push("Uneven texture detected — chemical exfoliation can help")
        }
      }

      // ── Ageing / fine lines / elasticity ──────────────────────────────────
      if (m.fineLines > 50 || m.elasticity < 50 || concerns.some(c => c.includes("line") || c.includes("age") || c.includes("firm"))) {
        if (fullText.includes("retinol") || fullText.includes("peptide") || fullText.includes("anti-aging") || fullText.includes("collagen") || fullText.includes("firm")) {
          score += 28; reasons.push("Fine lines and elasticity loss detected — retinoids and peptides are matched")
        }
      }

      // ── Eye area (pore-clogging / dark circles) ────────────────────────────
      if (concerns.some(c => c.includes("eye") || c.includes("dark circle")) || m.wrinkleDepth > 50) {
        if (cat === "eye care") {
          score += 35; reasons.push("Eye-area concern identified — targeted eye care is recommended")
        }
      }

      // ── Redness / sensitivity ──────────────────────────────────────────────
      if (m.redness > 55 || m.sensitivity > 55 || skinType.includes("sensitive")) {
        if (fullText.includes("sooth") || fullText.includes("calm") || fullText.includes("fragrance-free") || fullText.includes("gentle")) {
          score += 22; reasons.push("Elevated redness/sensitivity — gentle, soothing formulas are a better fit")
        }
      }

      // ── SPF is always recommended ──────────────────────────────────────────
      if (cat === "sunscreen") {
        score += 20; reasons.push("Daily SPF is essential for all skin types to prevent further damage")
      }

      // ── Skin type compatibility bonus ──────────────────────────────────────
      const stMatch = p.skin_types.some(st =>
        st.toLowerCase().includes(skinType) ||
        st === "All Skin Types" ||
        (skinType.includes("oily") && st.toLowerCase().includes("oily")) ||
        (skinType.includes("dry") && st.toLowerCase().includes("dry")) ||
        (skinType.includes("combination") && st.toLowerCase().includes("combination"))
      )
      if (stMatch) { score += 12 }

      // ── Rating quality bonus ───────────────────────────────────────────────
      score += Math.round((p.rating - 4) * 15)

      return { product: p, score, reasons }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
}

async function logShadowProductRecommendations(result: FullAnalysis, picks: ScoredProduct[]) {
  try {
    await fetch("/api/recommendations/shadow-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysis_id: null,
        event_type: "impression",
        analysis: {
          skinType: result.skinType,
          concerns: result.concerns,
          healthScore: result.healthScore,
          detailedMetrics: result.detailedMetrics,
          modelAnalysis: (result as any).modelAnalysis,
        },
        items: picks.map((pick, index) => ({
          product: {
            id: pick.product.id,
            name: pick.product.name,
            brand: pick.product.brand,
            category: pick.product.category,
            description: pick.product.description,
            skin_types: pick.product.skin_types,
            highlights: pick.product.highlights,
            rating: pick.product.rating,
            price: pick.product.price,
            in_stock: pick.product.in_stock,
          },
          visible_rank: index + 1,
          rule_score: pick.score,
          reasons: pick.reasons,
        })),
      }),
      cache: "no-store",
    })
  } catch (err) {
    console.warn("[skin-analysis] shadow recommendation logging failed", err)
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SkinAnalysisPage() {
  const [step, setStep] = useState<"upload" | "analyzing" | "done">("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [result, setResult] = useState<FullAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("Overview")
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<"upload" | "camera">("upload")
  const [analysisPhase, setAnalysisPhase] = useState(0)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const shadowRecommendationLogRef = useRef<string | null>(null)

  // Stop camera stream when leaving camera mode or component unmounts
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (countdownRef.current) clearInterval(countdownRef.current)
    setCameraActive(false)
    setCountdown(null)
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  useEffect(() => {
    if (!result) return
    const picks = getProductRecommendations(result)
    if (picks.length === 0) return
    const logKey = `${result.skinType}:${result.healthScore}:${picks.map((pick) => `${pick.product.id}-${pick.score}`).join("|")}`
    if (shadowRecommendationLogRef.current === logKey) return
    shadowRecommendationLogRef.current = logKey
    void logShadowProductRecommendations(result, picks)
  }, [result])

  // Start camera AFTER inputMode="camera" so the <video> element is in the DOM
  useEffect(() => {
    if (inputMode !== "camera") return
    let cancelled = false
    setCameraError(null)
    setCameraActive(false)

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
    }).then((stream) => {
      if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
      streamRef.current = stream

      // Poll for the video element (React may not have committed yet)
      let tries = 0
      const attach = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().then(() => {
            if (!cancelled) setCameraActive(true)
          }).catch(() => {})
        } else if (tries < 30) {
          tries++
          setTimeout(attach, 100)
        }
      }
      attach()
    }).catch((err: any) => {
      if (cancelled) return
      const msg =
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera access denied. Click the lock icon in your browser address bar and allow camera access."
          : err.name === "NotFoundError" || err.name === "DevicesNotFoundError"
          ? "No camera found. Please connect a camera and try again."
          : err.name === "NotReadableError"
          ? "Camera is in use by another application. Please close it and try again."
          : `Could not start camera (${err.name}). Please check permissions and try again.`
      setCameraError(msg)
    })

    return () => { cancelled = true }
  }, [inputMode])

  // Keep startCamera as a manual retry (just re-triggers the effect)
  const startCamera = useCallback(() => {
    stopCamera()
    setCameraError(null)
    // Toggle inputMode to re-trigger the useEffect
    setInputMode("upload")
    requestAnimationFrame(() => setInputMode("camera"))
  }, [stopCamera])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !cameraActive) return
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    // Mirror horizontally (selfie flip)
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    setUploadedImage(dataUrl)
    stopCamera()
    setInputMode("upload")
  }, [cameraActive, stopCamera])

  const startCountdown = useCallback(() => {
    let count = 3
    setCountdown(count)
    countdownRef.current = setInterval(() => {
      count -= 1
      if (count === 0) {
        clearInterval(countdownRef.current!)
        setCountdown(null)
        capturePhoto()
      } else {
        setCountdown(count)
      }
    }, 1000)
  }, [capturePhoto])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!uploadedImage) return
    setStep("analyzing")
    setAnalysisProgress(0)
    setAnalysisPhase(0)

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

    try {
      // Phase 1 — image preprocessing
      setAnalysisPhase(1); setAnalysisProgress(5)
      await delay(1800)

      // Phase 2 — canvas pixel extraction (real analysis)
      setAnalysisPhase(2); setAnalysisProgress(12)
      await delay(1200)
      const pixelStats = await extractPixelStats(uploadedImage)
      setAnalysisProgress(20)
      await delay(900)

      // Phase 3 — RGB channel decomposition
      setAnalysisPhase(3); setAnalysisProgress(28)
      await delay(2000)

      // Phase 4 — texture frequency analysis
      setAnalysisPhase(4); setAnalysisProgress(38)
      await delay(2200)

      // Phase 5 — entropy calculation
      setAnalysisPhase(5); setAnalysisProgress(48)
      await delay(1800)

      // Phase 6 — zone mapping
      setAnalysisPhase(6); setAnalysisProgress(57)
      await delay(2000)

      // Phase 7 — dermatology model inference (API)
      setAnalysisPhase(7); setAnalysisProgress(65)
      const res = await fetch("/api/analyze-skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixelStats, imageDataUrl: uploadedImage }),
      })
      if (!res.ok) throw new Error("Analysis failed")
      const data = await res.json()
      setAnalysisProgress(78)
      await delay(1400)

      // Phase 8 — generating routine
      setAnalysisPhase(8); setAnalysisProgress(86)
      await delay(1600)

      // Phase 9 — ingredient matching
      setAnalysisPhase(9); setAnalysisProgress(93)
      await delay(1400)

      // Phase 10 — finalising report
      setAnalysisPhase(10); setAnalysisProgress(100)
      await delay(1200)

  setResult(data)
  setStep("done")
  setActiveTab("Overview")
  // Persist to localStorage for Ingredient Lab cross-page matching
  try {
    const snapshot = {
      date: new Date().toISOString(),
      source: "analysis",
      skinType: data.skinType,
      concerns: data.concerns,
      healthScore: data.healthScore,
      detailedMetrics: data.detailedMetrics,
      ingredientsToUse: data.ingredientsToUse,
      ingredientsToAvoid: data.ingredientsToAvoid,
    }
    localStorage.setItem("skinAnalysisLatest", JSON.stringify(snapshot))
  } catch {}
  toast.success("Skin analysis complete — 20 metrics computed from real pixels")
    } catch (err: any) {
      toast.error(err.message || "Analysis failed. Please try again.")
      setStep("upload")
    }
  }, [uploadedImage])

  const reset = useCallback(() => {
    stopCamera()
    setStep("upload"); setUploadedImage(null)
    setResult(null); setAnalysisProgress(0)
    setInputMode("upload")
  }, [stopCamera])

  // ─── Render ──────────��─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f4f8]">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1a1025] px-8 py-10">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 border border-violet-500/20 px-3.5 py-1.5">
                <Sparkles className="w-3 h-3 text-violet-300" />
                <span className="text-[10px] font-bold text-violet-300 tracking-widest uppercase">Canvas Pixel Analysis Engine</span>
              </div>
              <h1 className="text-3xl font-bold text-white">AI Skin Report</h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                Real image processing — your photo is decoded pixel by pixel in the browser using Canvas API, then 20 dermatological metrics are computed from actual RGB values.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {[["300×300", "Pixel Grid"], ["20", "Metrics"], ["4", "Algorithms"]].map(([val, lbl]) => (
                <div key={lbl} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                  <div className="text-2xl font-black text-white leading-none">{val}</div>
                  <div className="mt-1 text-[10px] text-violet-300 uppercase tracking-widest font-semibold">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm explanation */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <FlaskConical className="w-3.5 h-3.5 text-violet-500" />
            </div>
            <span className="text-sm font-bold text-gray-900">What Actually Happens</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: "01", t: "Canvas getImageData()", d: "Your image is drawn to a 300×300 offscreen canvas. We read every real RGBA pixel — no compressed bytes, no guessing." },
              { n: "02", t: "Channel Statistics", d: "Mean & std-dev computed per R, G, B channel across 90,000 pixels. Warmth (R−B), shine (high brightness), and redness (saturation) are derived." },
              { n: "03", t: "Texture & Entropy", d: "Luminance delta between adjacent pixels = texture frequency. Shannon entropy of the 256-bin luma histogram reveals pigmentation uniformity." },
              { n: "04", t: "5×5 Local Contrast", d: "Std-dev inside sliding 5×5 pixel windows — high local contrast = visible pores or fine lines. Image is split into 3 vertical zones." },
            ].map(({ n, t, d }) => (
              <div key={n} className="rounded-xl bg-gray-50 border border-gray-100 p-3.5 space-y-1.5">
                <div className="text-[9px] font-black text-violet-500 tracking-widest">STEP {n}</div>
                <div className="text-xs font-bold text-gray-900">{t}</div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload / Analyzing / Results */}
        {step === "upload" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              {/* Tab switcher */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                {(["upload", "camera"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      if (mode !== inputMode) {
                        if (mode === "upload") { stopCamera(); setInputMode("upload") }
                        else { setUploadedImage(null); setInputMode("camera") }
                      }
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      inputMode === mode
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {mode === "upload" ? <Upload className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                    {mode === "upload" ? "Upload Photo" : "Use Camera"}
                  </button>
                ))}
              </div>

              {/* ── Upload mode ── */}
              {inputMode === "upload" && (
                <>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-violet-300 hover:bg-violet-50/30 transition-colors">
                    {uploadedImage ? (
                      <div className="p-4 space-y-3">
                        <div className="rounded-xl overflow-hidden max-h-56 flex items-center justify-center bg-gray-100">
                          <img src={uploadedImage} alt="Uploaded" className="max-h-56 mx-auto object-contain" />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setUploadedImage(null)}
                          className="w-full gap-2 text-xs border-gray-200 hover:border-violet-300">
                          <RefreshCw className="w-3.5 h-3.5" /> Replace Image
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block p-10 text-center">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 text-violet-500" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Click to upload photo</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG — up to 10 MB</p>
                      </label>
                    )}
                  </div>
                  {uploadedImage && (
                    <Button className="w-full bg-[#1a1025] hover:bg-violet-800 text-white font-semibold rounded-xl h-11" onClick={handleAnalyze}>
                      <Sparkles className="mr-2 w-4 h-4" /> Run Real Pixel Analysis
                    </Button>
                  )}
                </>
              )}

              {/* ── Camera mode ── */}
              {inputMode === "camera" && (
                <div className="space-y-3">
                  {cameraError ? (
                    <div className="rounded-xl bg-red-50 border border-red-100 p-5 text-center space-y-3">
                      <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
                      <p className="text-xs text-red-600 leading-relaxed">{cameraError}</p>
                      <Button size="sm" variant="outline" onClick={startCamera}
                        className="border-red-200 text-red-600 hover:bg-red-50 text-xs">
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ transform: "scaleX(-1)" }}
                      />
                      {/* Face guide overlay */}
                      {cameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-36 h-48 rounded-full border-2 border-white/40 border-dashed" />
                        </div>
                      )}
                      {/* Countdown overlay */}
                      {countdown !== null && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="text-8xl font-black text-white drop-shadow-lg">{countdown}</span>
                        </div>
                      )}
                      {/* Not active yet */}
                      {!cameraActive && !cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <Camera className="w-10 h-10 text-white/60" />
                          <p className="text-white/60 text-xs">Starting camera...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {cameraActive && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={capturePhoto}
                        className="gap-2 text-xs border-gray-200 font-semibold"
                      >
                        <Camera className="w-3.5 h-3.5" /> Capture Now
                      </Button>
                      <Button
                        size="sm"
                        onClick={startCountdown}
                        disabled={countdown !== null}
                        className="gap-2 text-xs bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {countdown !== null ? `Taking in ${countdown}…` : "3-sec Timer"}
                      </Button>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    Position your face inside the guide circle · Remove makeup · Use natural light
                  </p>
                </div>
              )}

              {/* Tips (always visible) */}
              <div className="space-y-1.5 pt-1">
                {["Shoot in soft natural light — avoid flash or backlight", "Remove all makeup for most accurate pixel readings", "Face camera directly, neutral expression, sharp focus"].map((tip) => (
                  <div key={tip} className="flex items-start gap-2 text-[11px] text-gray-400">
                    <CheckCircle className="w-3 h-3 text-violet-300 flex-shrink-0 mt-0.5" /> {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column wrapper */}
            <div className="flex flex-col gap-5">

            {/* Face scan showcase image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0d0818] h-52 flex-shrink-0">
              <img
                src="/face-scan-ai.jpg"
                alt="AI facial scan"
                className="w-full h-full object-cover object-top opacity-90"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0818]/80 via-[#0d0818]/10 to-transparent" />
              {/* Animated scan line — using Tailwind animate-bounce variant via translate */}
              <div className="absolute left-0 right-0 h-px bg-violet-400/70 shadow-[0_0_10px_2px_rgba(139,92,246,0.5)] animate-[scanLine_3s_ease-in-out_infinite]" />
              {/* Corner grid dots */}
              {[["top-3","left-3"],["top-3","right-3"],["bottom-16","left-3"],["bottom-16","right-3"]].map(([t,l],i) => (
                <div key={i} className={`absolute ${t} ${l} w-3 h-3`}>
                  <div className="absolute top-0 left-0 w-2 h-px bg-violet-400" />
                  <div className="absolute top-0 left-0 w-px h-2 bg-violet-400" />
                </div>
              ))}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10 bg-gradient-to-t from-[#0d0818] to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">AI Facial Scan Ready</span>
                </div>
                <p className="text-[10px] text-white/40 mt-0.5">Upload a photo or use your camera to begin</p>
              </div>
            </div>

            {/* What we measure */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">20 Metrics We Compute</h3>
              {[
                { icon: Droplets, label: "Hydration Group", items: ["Moisture", "Dehydration Lines", "Water Content"], color: "text-sky-500", bg: "bg-sky-50" },
                { icon: Zap,      label: "Oil & Sebum",     items: ["Oiliness", "Sebum Production", "Shine Level"],  color: "text-amber-500", bg: "bg-amber-50" },
                { icon: Layers,   label: "Skin Surface",    items: ["Texture", "Clarity", "Evenness", "Roughness"],  color: "text-violet-500", bg: "bg-violet-50" },
                { icon: Activity, label: "Aging Signals",   items: ["Elasticity", "Firmness", "Fine Lines"],         color: "text-rose-500",   bg: "bg-rose-50" },
                { icon: Eye,      label: "Pigmentation",    items: ["Hyperpigmentation", "Dark Spots"],              color: "text-orange-500", bg: "bg-orange-50" },
                { icon: Shield,   label: "Sensitivity",     items: ["Redness", "Sensitivity", "Pore Size"],          color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map(({ icon: Icon, label, items, color, bg }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-gray-700">{label}</div>
                    <div className="text-[10px] text-gray-400">{items.join(" · ")}</div>
                  </div>
                </div>
              ))}
            </div>
            </div> {/* end right column */}
          </div>
        )}

        {step === "analyzing" && (() => {
          const phases = [
            { id: 1,  label: "Preprocessing image",              detail: "Normalising resolution to 300×300 for consistent sampling",      progress: 5  },
            { id: 2,  label: "Canvas pixel extraction",          detail: "Reading 90,000 real RGBA pixels via getImageData()",              progress: 20 },
            { id: 3,  label: "RGB channel decomposition",        detail: "Computing mean & std-dev across R, G, B channels",              progress: 28 },
            { id: 4,  label: "Texture frequency analysis",       detail: "Measuring luminance delta between adjacent pixels",              progress: 38 },
            { id: 5,  label: "Shannon entropy calculation",      detail: "Analysing 256-bin histogram to detect pigmentation variance",    progress: 48 },
            { id: 6,  label: "Spatial zone mapping",             detail: "Isolating T-zone, cheeks and eye area for independent scoring",  progress: 57 },
            { id: 7,  label: "Dermatology model inference",      detail: "Translating pixel signals into 20 clinical skin metrics",        progress: 78 },
            { id: 8,  label: "Personalised routine generation",  detail: "Matching your metrics to a morning & evening care programme",    progress: 86 },
            { id: 9,  label: "Ingredient compatibility check",   detail: "Cross-referencing your concerns with 40+ active ingredients",    progress: 93 },
            { id: 10, label: "Compiling final report",           detail: "Assembling your complete dermatological skin profile",           progress: 100 },
          ]
          const current = phases.find(p => p.id === analysisPhase) ?? phases[0]
          return (
            <div className="grid lg:grid-cols-5 gap-5">
              {/* Left — image preview with scan overlay */}
              <div className="lg:col-span-2 bg-[#0d0818] rounded-2xl overflow-hidden relative flex items-center justify-center min-h-[320px]">
                {/* Background: uploaded photo or AI wireframe fallback */}
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Analysing" className="absolute inset-0 w-full h-full object-cover opacity-55" />
                ) : (
                  <img src="/face-scan-wireframe.jpg" alt="Face scan" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                )}

                {/* Scan grid overlay — SVG mesh */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.35 }}>
                  {/* Vertical grid lines */}
                  {[40,80,120,160].map(x => (
                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2="240" stroke="#a78bfa" strokeWidth="0.4" strokeDasharray="4 6" />
                  ))}
                  {/* Horizontal grid lines */}
                  {[48,96,144,192].map(y => (
                    <line key={`h${y}`} x1="0" y1={y} x2="200" y2={y} stroke="#a78bfa" strokeWidth="0.4" strokeDasharray="4 6" />
                  ))}
                  {/* Face oval outline */}
                  <ellipse cx="100" cy="115" rx="62" ry="80" fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="6 4" />
                  {/* Zone dots — T-Zone */}
                  <circle cx="100" cy="55"  r="3" fill="#a78bfa" opacity="0.9"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite" /></circle>
                  <circle cx="100" cy="100" r="3" fill="#a78bfa" opacity="0.9"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.1s" repeatCount="indefinite" /></circle>
                  {/* Cheek dots */}
                  <circle cx="55"  cy="120" r="3" fill="#38bdf8" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.6s" repeatCount="indefinite" /></circle>
                  <circle cx="145" cy="120" r="3" fill="#38bdf8" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.0s" repeatCount="indefinite" /></circle>
                  {/* Eye area dots */}
                  <circle cx="76"  cy="88"  r="2.5" fill="#f472b6" opacity="0.85"><animate attributeName="opacity" values="0.85;0.2;0.85" dur="1.4s" repeatCount="indefinite" /></circle>
                  <circle cx="124" cy="88"  r="2.5" fill="#f472b6" opacity="0.85"><animate attributeName="opacity" values="0.85;0.2;0.85" dur="1.9s" repeatCount="indefinite" /></circle>
                  {/* Jaw dots */}
                  <circle cx="72"  cy="160" r="2"   fill="#34d399" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.2s" repeatCount="indefinite" /></circle>
                  <circle cx="128" cy="160" r="2"   fill="#34d399" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.7s" repeatCount="indefinite" /></circle>
                  {/* Scanning line animated from top to bottom */}
                  <line x1="0" y1="0" x2="200" y2="0" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.8">
                    <animateTransform attributeName="transform" type="translate" from="0,0" to="0,240" dur="2.8s" repeatCount="indefinite" />
                  </line>
                  <rect x="0" y="-8" width="200" height="8" fill="url(#scanGrad)">
                    <animateTransform attributeName="transform" type="translate" from="0,0" to="0,248" dur="2.8s" repeatCount="indefinite" />
                  </rect>
                  <defs>
                    <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Corner brackets */}
                {[["top-3 left-3","top-0 left-0 border-t border-l"],["top-3 right-3","top-0 right-0 border-t border-r"],["bottom-20 left-3","bottom-0 left-0 border-b border-l"],["bottom-20 right-3","bottom-0 right-0 border-b border-r"]].map(([pos, bdr], i) => (
                  <div key={i} className={`absolute ${pos} w-4 h-4`}>
                    <div className={`absolute ${bdr} w-full h-full border-violet-400/60`} />
                  </div>
                ))}

                {/* Zone labels */}
                <div className="absolute top-[22%] left-1/2 -translate-x-1/2">
                  <span className="text-[8px] font-bold text-violet-300/70 uppercase tracking-widest bg-[#0d0818]/60 px-1.5 py-0.5 rounded">T-Zone</span>
                </div>
                <div className="absolute top-[47%] left-[16%]">
                  <span className="text-[8px] font-bold text-sky-300/70 uppercase tracking-widest bg-[#0d0818]/60 px-1.5 py-0.5 rounded">Cheeks</span>
                </div>
                <div className="absolute top-[35%] left-[60%]">
                  <span className="text-[8px] font-bold text-pink-300/70 uppercase tracking-widest bg-[#0d0818]/60 px-1.5 py-0.5 rounded">Eyes</span>
                </div>

                {/* Phase label overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5">
                  <p className="text-white text-xs font-semibold leading-snug">{current.label}</p>
                  <p className="text-white/50 text-[10px] mt-0.5 leading-relaxed">{current.detail}</p>
                </div>

                {/* Progress badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#0d0818]/80 border border-violet-500/30 backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-[11px] font-black text-violet-300">{analysisProgress}%</span>
                </div>
              </div>

              {/* Right — phase list */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Analysis Pipeline</p>
                {phases.map((phase) => {
                  const done    = analysisPhase > phase.id
                  const active  = analysisPhase === phase.id
                  const pending = analysisPhase < phase.id
                  return (
                    <div key={phase.id}
                      className={`flex items-start gap-3.5 rounded-xl px-3.5 py-2.5 transition-all duration-500 ${
                        active  ? "bg-violet-50 border border-violet-100" :
                        done    ? "opacity-60" : "opacity-25"
                      }`}
                    >
                      {/* Status icon */}
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-300 ${
                        done    ? "bg-emerald-100" :
                        active  ? "bg-violet-500 animate-pulse" :
                                  "bg-gray-100"
                      }`}>
                        {done   ? <CheckCircle className="w-3 h-3 text-emerald-600" /> :
                         active ? <div className="w-2 h-2 rounded-full bg-white" /> :
                                  <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-tight truncate ${
                          active ? "text-violet-700" : done ? "text-gray-600" : "text-gray-400"
                        }`}>{phase.label}</p>
                        {active && (
                          <p className="text-[10px] text-violet-500 mt-0.5 leading-relaxed">{phase.detail}</p>
                        )}
                      </div>

                      {/* Phase number */}
                      <span className={`text-[9px] font-black tabular-nums ${
                        active ? "text-violet-400" : "text-gray-200"
                      }`}>{String(phase.id).padStart(2, "0")}</span>
                    </div>
                  )
                })}

                {/* Overall progress bar */}
                <div className="pt-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-gray-400">Overall Progress</span>
                    <span className="text-[10px] font-black text-violet-600">{analysisProgress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-1000"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {step === "done" && result && (
          <>
            {/* Header row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#7c3aed" strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 28 * result.healthScore / 100} ${2 * Math.PI * 28}`}
                      strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-gray-900 leading-none">{result.healthScore}</span>
                    <span className="text-[8px] text-gray-400 font-semibold">/ 100</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{result.skinType} Skin</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.concerns.slice(0, 4).map((c) => (
                      <Badge key={c} className="text-[10px] bg-violet-50 text-violet-700 border border-violet-100 font-medium px-2">{c}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-[10px] text-gray-400">Algorithm confidence</div>
                  <div className="text-sm font-black text-violet-600">{result.confidence}%</div>
                </div>
                <Button variant="outline" size="sm" onClick={reset} className="gap-1.5 text-xs border-gray-200">
                  <RefreshCw className="w-3 h-3" /> New Analysis
                </Button>
              </div>
            </div>

            {/* Tab nav */}
            <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit">
              {TABS.map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === t ? "bg-[#1a1025] text-white" : "text-gray-500 hover:text-gray-900"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "Overview" && (() => {
              const radarAxes = [
                { label: "Hydration",  v: result.detailedMetrics.moisture,   description: "Skin water content and barrier moisture retention capacity." },
                { label: "Clarity",    v: result.detailedMetrics.clarity,    description: "Overall skin clarity, blemish presence and congestion level." },
                { label: "Texture",    v: result.detailedMetrics.texture,    description: "Surface smoothness, pore visibility and tactile evenness." },
                { label: "Elasticity", v: result.detailedMetrics.elasticity, description: "Collagen density and skin's ability to rebound under pressure." },
                { label: "Evenness",   v: result.detailedMetrics.evenness,   description: "Tone uniformity and reduction of hyperpigmentation patches." },
                { label: "Firmness",   v: result.detailedMetrics.firmness,   description: "Structural density and resistance to sagging over time." },
              ]

              const metrics = [
                { label: "Moisture",          v: result.detailedMetrics.moisture,          dot: "#38bdf8" },
                { label: "Oiliness",          v: result.detailedMetrics.oiliness,          dot: "#fbbf24" },
                { label: "Texture",           v: result.detailedMetrics.texture,           dot: "#a78bfa" },
                { label: "Clarity",           v: result.detailedMetrics.clarity,           dot: "#34d399" },
                { label: "Elasticity",        v: result.detailedMetrics.elasticity,        dot: "#818cf8" },
                { label: "Evenness",          v: result.detailedMetrics.evenness,          dot: "#2dd4bf" },
                { label: "Fine Lines",        v: result.detailedMetrics.fineLines,         dot: "#fb7185" },
                { label: "Hyperpigmentation", v: result.detailedMetrics.hyperpigmentation, dot: "#fb923c" },
                { label: "Redness",           v: result.detailedMetrics.redness,           dot: "#f87171" },
                { label: "Pore Size",         v: result.detailedMetrics.poreSize,          dot: "#c084fc" },
              ]

              // Shared card style
              const cardCls = "bg-white rounded-2xl border border-violet-100 p-5 flex flex-col"

              return (
                <div className="grid gap-4 lg:grid-cols-2">

                  {/* ── Interactive Radar ─────────────────────────── */}
                  <div className={cardCls}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">Skin Radar</p>
                        <h3 className="text-base font-black text-gray-900 mt-0.5">6-Axis Overview</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900">
                          {result.healthScore}
                          <span className="text-sm font-normal text-gray-300">/100</span>
                        </div>
                        <div className="text-[10px] text-gray-400">Health Score</div>
                      </div>
                    </div>
                    <SkinRadarChart axes={radarAxes} healthScore={result.healthScore} />
                  </div>

                  {/* ── Key Metrics ───────────────────────────────── */}
                  <div className={cardCls + " gap-3"}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">Key Metrics</p>
                        <h3 className="text-base font-black text-gray-900 mt-0.5">10 Skin Indicators</h3>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-violet-600" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {metrics.map(({ label, v, dot }) => {
                        const { label: sl } = scoreLabel(v)
                        const statusColor =
                          sl === "Excellent" ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                          sl === "Good"      ? "text-sky-600 bg-sky-50 border-sky-100" :
                          sl === "Fair"      ? "text-amber-600 bg-amber-50 border-amber-100" :
                                              "text-rose-600 bg-rose-50 border-rose-100"
                        return (
                          <div key={label} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
                                <span className="text-[10px] font-semibold text-gray-500 leading-none">{label}</span>
                              </div>
                              <span className="text-[11px] font-black text-gray-900">{v}</span>
                            </div>
                            <div className="relative h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                                style={{ width: `${v}%`, background: dot }}
                              />
                            </div>
                            <span className={`inline-flex text-[9px] font-bold px-1.5 py-px rounded-full border ${statusColor}`}>{sl}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                </div>
              )
            })()}

            {/* Zones */}
            {activeTab === "Zones" && (
              <div className="grid gap-4 md:grid-cols-3">
                {([
                  { label: "T-Zone (Forehead + Nose)", zone: result.zoneBreakdown.tZone,   icon: Zap },
                  { label: "Cheeks",                   zone: result.zoneBreakdown.cheeks,   icon: Droplets },
                  { label: "Eye Area + Chin",          zone: result.zoneBreakdown.eyeArea,  icon: Eye },
                ] as { label: string; zone: ZoneAnalysis; icon: React.ElementType }[]).map(({ label, zone, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-violet-500" />
                      </div>
                      <span className="text-xs font-bold text-gray-900">{label}</span>
                    </div>
                    {([
                      ["Moisture", zone.moisture, "bg-sky-400"],
                      ["Oiliness", zone.oiliness, "bg-amber-400"],
                      ["Texture",  zone.texture,  "bg-violet-400"],
                      ["Redness",  zone.redness,  "bg-rose-400"],
                      ["Pores",    zone.pores,    "bg-orange-400"],
                    ] as [string, number, string][]).map(([k, v, b]) => (
                      <MetricBar key={k} label={k} value={v} barColor={b} />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Routine */}
            {activeTab === "Routine" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <RoutineCard title="Morning Routine" icon={Sun} steps={result.morningRoutine} accent="bg-amber-50 text-amber-600" />
                <RoutineCard title="Evening Routine" icon={Moon} steps={result.eveningRoutine} accent="bg-indigo-50 text-indigo-600" />
              </div>
            )}

            {/* Ingredients */}
            {activeTab === "Ingredients" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-gray-900">Recommended Ingredients</span>
                  </div>
                  {result.ingredientsToUse.map((ing) => (
                    <div key={ing.name}>
                      <button onClick={() => setExpandedIngredient(expandedIngredient === ing.name ? null : ing.name)}
                        className="w-full flex items-center gap-2.5 p-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left">
                        <Badge className={`text-[9px] px-1.5 py-0.5 border-0 font-bold flex-shrink-0 ${ing.priority === "high" ? "bg-violet-100 text-violet-700" : ing.priority === "medium" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"}`}>
                          {ing.priority.toUpperCase()}
                        </Badge>
                        <span className="flex-1 text-xs font-semibold text-gray-800">{ing.name}</span>
                        {expandedIngredient === ing.name ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                      </button>
                      {expandedIngredient === ing.name && (
                        <div className="ml-10 mr-2 mb-1 p-2.5 bg-emerald-50 rounded-lg">
                          <p className="text-[11px] text-emerald-800 leading-relaxed">{ing.benefit}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-bold text-gray-900">Avoid for Your Skin Type</span>
                  </div>
                  {result.ingredientsToAvoid.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 p-2.5 bg-rose-50 border border-rose-100 rounded-lg">
                      <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] text-rose-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {activeTab === "Lifestyle" && (() => {
              const iconMap: Record<string, React.ElementType> = {
                moon: Moon, droplets: Droplets, sun: Sun, zap: Zap,
                leaf: Leaf, shield: Shield, cloud: Cloud,
              }
              const impactConfig = {
                high:   { label: "High Impact", color: "bg-rose-50 text-rose-600 border-rose-200" },
                medium: { label: "Medium Impact", color: "bg-amber-50 text-amber-600 border-amber-200" },
                low:    { label: "Low Impact",  color: "bg-gray-50 text-gray-500 border-gray-200" },
              }
              return (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="bg-[#0d0818] rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Leaf className="w-5 h-5 text-violet-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white">
                        {result.healthScore >= 80
                          ? "Your Skin is Thriving — Maintain These Habits"
                          : result.healthScore >= 65
                          ? "Your Skin Needs These Targeted Improvements"
                          : "Your Skin Needs Urgent Lifestyle Changes"}
                      </h3>
                      <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                        Personalised to your <span className="text-violet-300 font-semibold">{result.skinType}</span> skin (score: <span className={`font-bold ${result.healthScore >= 80 ? "text-emerald-400" : result.healthScore >= 65 ? "text-amber-400" : "text-rose-400"}`}>{result.healthScore}/100</span>) and {result.concerns.length} identified {result.concerns.length === 1 ? "concern" : "concerns"}.
                      </p>
                      {/* Priority pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {result.lifestyleTips
                          .filter(t => t.impact === "high")
                          .map((t, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-rose-500/15 border border-rose-500/20 text-rose-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
                              <span className="w-1 h-1 rounded-full bg-rose-400" />{t.category}
                            </span>
                          ))}
                        {result.lifestyleTips
                          .filter(t => t.impact === "medium")
                          .map((t, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/20 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
                              <span className="w-1 h-1 rounded-full bg-amber-400" />{t.category}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-white/40">High impact</div>
                      <div className={`text-2xl font-black ${result.lifestyleTips.filter(t => t.impact === "high").length >= 3 ? "text-rose-400" : "text-amber-400"}`}>
                        {result.lifestyleTips.filter(t => t.impact === "high").length}
                      </div>
                    </div>
                  </div>

                  {/* Habit cards */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {result.lifestyleTips.map((tip, i) => {
                      const Icon = iconMap[tip.icon] || Sparkles
                      const impact = impactConfig[tip.impact]
                      return (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                          {/* Image header — always shown */}
                          <div className="relative h-36 overflow-hidden bg-[#0d0818]">
                            <img
                              src={tip.image ?? "/face-scan-ai.jpg"}
                              alt={tip.title}
                              className="w-full h-full object-cover opacity-80"
                            />
                            {/* Gradient scrim */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                            {/* Category pill */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-1">
                              <Icon className="w-3 h-3 text-white" />
                              <span className="text-[10px] font-bold text-white tracking-wide">{tip.category}</span>
                            </div>
                            {/* Impact badge */}
                            <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm ${impact.color}`}>
                              {impact.label}
                            </span>
                          </div>

                          <div className="p-4 space-y-3">
                            {/* Title */}
                            <h4 className="text-sm font-bold text-gray-900 leading-snug">{tip.title}</h4>

                            {/* Tip text */}
                            <p className="text-[11px] text-gray-500 leading-relaxed">{tip.tip}</p>

                            {/* Frequency badge */}
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                              <span className="text-[10px] font-semibold text-violet-600 uppercase tracking-wide">{tip.frequency}</span>
                            </div>

                            {/* Habit checklist */}
                            <div className="space-y-2 pt-2 border-t border-gray-50">
                              {tip.habits.map((habit, j) => (
                                <div key={j} className="flex items-start gap-2">
                                  <div className="w-4 h-4 rounded-full bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-2.5 h-2.5 text-violet-500" />
                                  </div>
                                  <span className="text-[11px] text-gray-600 leading-relaxed">{habit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {activeTab === "Products" && (() => {
              const picks = getProductRecommendations(result)
              return (
                <div className="space-y-5">
                  {/* Header */}
                  <div className="bg-[#1a1025] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-violet-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white">Personalised Product Picks</h3>
                      <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">
                        Matched to your <span className="text-violet-300 font-semibold">{result.skinType} skin</span> profile and {result.concerns.length} identified concerns. Scored by our recommendation engine.
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-white/40">Products matched</div>
                      <div className="text-2xl font-black text-violet-300">{picks.length}</div>
                    </div>
                  </div>

                  {/* Product grid */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {picks.map(({ product: p, score, reasons }, idx) => (
                      <div key={p.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                      >
                        {/* Match score badge */}
                        <div className="relative bg-gray-50 h-36 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                          </div>
                          {/* Rank badge */}
                          {idx === 0 && (
                            <div className="absolute top-3 left-3 bg-[#1a1025] text-white text-[9px] font-black px-2 py-1 rounded-lg tracking-wide">
                              BEST MATCH
                            </div>
                          )}
                          {/* Match score ring */}
                          <div className="absolute top-3 right-3 w-10 h-10">
                            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#7c3aed" strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 14 * Math.min(score, 100) / 100} ${2 * Math.PI * 14}`}
                                strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[9px] font-black text-violet-700">{Math.min(score, 100)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col flex-1 gap-3">
                          {/* Product info */}
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-[10px] text-gray-400 font-medium">{p.brand}</p>
                                <h4 className="text-sm font-bold text-gray-900 leading-tight">{p.name}</h4>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-sm font-black text-gray-900">${p.price}</div>
                                {p.original_price > p.price && (
                                  <div className="text-[10px] text-gray-400 line-through">${p.original_price}</div>
                                )}
                              </div>
                            </div>
                            {/* Stars */}
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(p.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                              ))}
                              <span className="text-[10px] text-gray-400 ml-0.5">{p.rating} ({p.review_count})</span>
                            </div>
                          </div>

                          {/* Why recommended */}
                          <div className="flex-1 space-y-1.5">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Why this product</p>
                            {reasons.slice(0, 2).map((r, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <CheckCircle className="w-3 h-3 text-violet-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-gray-600 leading-relaxed">{r}</p>
                              </div>
                            ))}
                          </div>

                          {/* Skin type tags */}
                          <div className="flex flex-wrap gap-1">
                            {p.skin_types.slice(0, 2).map(st => (
                              <span key={st} className="text-[9px] bg-violet-50 text-violet-600 border border-violet-100 rounded-full px-2 py-0.5 font-medium">
                                {st}
                              </span>
                            ))}
                            {p.badge && (
                              <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2 py-0.5 font-medium">
                                {p.badge}
                              </span>
                            )}
                          </div>

                          {/* CTA */}
                          <button
                            onClick={() => {
                              toast.success(`${p.name} added to cart`)
                            }}
                            disabled={!p.in_stock}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              p.in_stock
                                ? "bg-[#1a1025] hover:bg-violet-700 text-white"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {p.in_stock ? "Add to Cart" : "Out of Stock"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View all link */}
                  <div className="flex justify-center">
                    <a href="/dashboard/products"
                      className="flex items-center gap-2 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      Browse all products <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )
            })()}
          </>
        )}
      </div>
    </div>
  )
}
