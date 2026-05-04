import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000"

// ─── Types ────────────────────────────────────────────────────────────────────
// PixelStats are computed on the client using Canvas getImageData()
// so every number here comes from real RGBA pixel values, not compressed bytes.
export interface PixelStats {
  // Global channel means (0-255)
  meanR: number; meanG: number; meanB: number
  // Per-channel standard deviation (0-255) — variance in colour
  stdR: number; stdG: number; stdB: number
  // Brightness: (R+G+B)/3 normalised 0-1
  brightness: number
  // Texture frequency: mean absolute delta between adjacent pixels, 0-1
  textureFreq: number
  // Shannon entropy of luminance histogram, normalised 0-1
  entropy: number
  // Local contrast (mean std-dev in 5×5 windows), 0-1
  localContrast: number
  // Spatial zone stats — top third (forehead/T-zone), mid (cheeks), bottom (chin/eye area)
  zones: {
    top:    ZoneStat
    mid:    ZoneStat
    bottom: ZoneStat
  }
}

export interface ZoneStat {
  meanR: number; meanG: number; meanB: number
  brightness: number; std: number
}

// ─── Dermatology signal extraction ────────────────────────────────────────────
function clamp(v: number, lo = 0, hi = 100) {
  return Math.round(Math.max(lo, Math.min(hi, v)))
}

function rgbToHSL(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h, s, l }
}

function deriveSignals(ps: PixelStats) {
  const hsl = rgbToHSL(ps.meanR, ps.meanG, ps.meanB)

  // ── Warmth: red-channel dominance over blue → redness / inflammation signal
  const warmth       = (ps.meanR - ps.meanB) / 255          // -1…+1

  // ── Shine: high brightness + low texture variance → specular highlight (oiliness)
  const shineSignal  = ps.brightness > 0.62
    ? Math.pow((ps.brightness - 0.62) / 0.38, 0.7)
    : 0                                                        // 0…1

  // ── Dullness: low brightness without shine → dehydrated / dull skin
  const dullSignal   = ps.brightness < 0.40
    ? Math.pow((0.40 - ps.brightness) / 0.40, 0.6)
    : 0                                                        // 0…1

  // ── Redness: warmth × saturation composite
  const rednessSignal = Math.min(1, Math.max(0, warmth * 1.4 + hsl.s * 0.6))

  // ── Yellow index: (R+G)/2 − B → melanin / hyperpigmentation proxy
  const yellowIndex  = ((ps.meanR + ps.meanG) / 2 - ps.meanB) / 255   // -0.5…0.5

  return { hsl, warmth, shineSignal, dullSignal, rednessSignal, yellowIndex }
}

function classifySkinType(ps: PixelStats, sig: ReturnType<typeof deriveSignals>) {
  const { shineSignal, dullSignal, rednessSignal } = sig

  // Score each skin type from real pixel signals
  const oilyScore  = shineSignal * 60 + (ps.stdR / 128) * 25 + ps.textureFreq * 15
  const dryScore   = dullSignal * 55 + (1 - hsl_s(sig)) * 25 + (1 - ps.localContrast) * 20
  const sensiScore = rednessSignal * 65 + sig.hsl.s * 35

  const maxScore = Math.max(oilyScore, dryScore, sensiScore)
  if (oilyScore > 20 && dryScore > 20) return "Combination"
  if (maxScore === oilyScore  && oilyScore  > 18) return "Oily"
  if (maxScore === dryScore   && dryScore   > 16) return "Dry"
  if (maxScore === sensiScore && sensiScore > 22) return "Sensitive"
  return "Normal"
}

function hsl_s(sig: ReturnType<typeof deriveSignals>) { return sig.hsl.s }

function computeMetrics(ps: PixelStats, sig: ReturnType<typeof deriveSignals>) {
  const { shineSignal, dullSignal, rednessSignal, yellowIndex } = sig

  // Moisture: inversely correlated with shine + dullness; boosted by mid-brightness
  const moistureRaw    = (1 - shineSignal) * 0.45 + (1 - dullSignal) * 0.35 + (1 - ps.textureFreq) * 0.20
  // Oiliness: shine + warmth + channel variance
  const oilinessRaw    = shineSignal * 0.55 + sig.warmth * 0.25 + (ps.stdR / 128) * 0.20
  // Texture quality: low frequency + low local contrast = smoother skin
  const textureRaw     = (1 - ps.textureFreq) * 0.65 + (1 - ps.localContrast) * 0.35
  // Clarity: low entropy + low redness
  const clarityRaw     = (1 - ps.entropy) * 0.60 + (1 - rednessSignal * 0.8) * 0.40
  // Elasticity: plump skin has mid-level brightness and low std
  const elasticityRaw  = Math.max(0, 1 - Math.abs(ps.brightness - 0.55) * 2) * 0.70 + (1 - (ps.stdR / 128) * 0.5) * 0.30
  // Fine lines: high local contrast in areas of mid-brightness
  const fineLinesRaw   = ps.localContrast * 0.50 + ps.textureFreq * 0.35 + (1 - ps.brightness) * 0.15
  // Hyperpigmentation: yellow index + entropy (uneven distribution)
  const hyperpigRaw    = Math.max(0, yellowIndex + 0.5) * 0.60 + ps.entropy * 0.40   // yellow index shifted to 0-1
  // Redness score
  const rednessRaw     = rednessSignal * 0.70 + sig.hsl.s * 0.30
  // Pore size: local contrast is the strongest predictor of visible pores
  const poreSizeRaw    = ps.localContrast * 0.65 + ps.textureFreq * 0.35

  return {
    // Hydration group
    moisture:           clamp(moistureRaw    * 100),
    dehydrationLines:   clamp((1 - moistureRaw) * 80 + ps.textureFreq * 20),
    waterContent:       clamp(moistureRaw    * 92),
    // Oil group
    oiliness:           clamp(oilinessRaw   * 100),
    sebumProduction:    clamp(oilinessRaw   * 88 + shineSignal * 12),
    shineLevel:         clamp(shineSignal   * 100),
    // Surface group
    texture:            clamp(textureRaw    * 100),
    clarity:            clamp(clarityRaw    * 100),
    evenness:           clamp((1 - ps.entropy) * 78 + (1 - Math.abs(sig.warmth)) * 22),
    roughness:          clamp(ps.textureFreq * 78 + ps.localContrast * 22),
    // Aging group
    elasticity:         clamp(elasticityRaw * 100),
    firmness:           clamp(elasticityRaw * 92),
    fineLines:          clamp(fineLinesRaw  * 100),
    wrinkleDepth:       clamp(fineLinesRaw  * 72 + ps.localContrast * 28),
    // Pigmentation group
    hyperpigmentation:  clamp(hyperpigRaw   * 100),
    darkSpots:          clamp(hyperpigRaw   * 82 + ps.entropy * 18),
    // Sensitivity group
    redness:            clamp(rednessRaw    * 100),
    sensitivity:        clamp(rednessRaw    * 76 + sig.hsl.s * 24),
    // Pore group
    poreSize:           clamp(poreSizeRaw   * 100),
    poreClogging:       clamp(poreSizeRaw   * 80 + oilinessRaw * 20),
  }
}

function computeZone(z: ZoneStat) {
  const hsl = rgbToHSL(z.meanR, z.meanG, z.meanB)
  const shine = z.brightness > 0.62 ? (z.brightness - 0.62) / 0.38 : 0
  const warm  = (z.meanR - z.meanB) / 255
  return {
    moisture:  clamp((1 - shine) * 60 + (1 - Math.max(0, (0.4 - z.brightness) / 0.4)) * 40),
    oiliness:  clamp(shine * 70 + Math.max(0, warm) * 30),
    texture:   clamp((1 - (z.std / 80)) * 65 + (1 - shine) * 35),
    redness:   clamp(Math.max(0, warm) * 80 + hsl.s * 20),
    pores:     clamp((z.std / 80) * 70 + shine * 30),
  }
}

// ─── Main route handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ps: PixelStats = body.pixelStats

    if (!ps || typeof ps.meanR !== "number") {
      return NextResponse.json({ error: "Invalid pixel stats payload" }, { status: 400 })
    }

    const sig      = deriveSignals(ps)
    const skinType = classifySkinType(ps, sig)
    const metrics  = computeMetrics(ps, sig)

    const zoneBreakdown = {
      tZone:   computeZone(ps.zones.top),
      cheeks:  computeZone(ps.zones.mid),
      eyeArea: computeZone(ps.zones.bottom),
    }

    // Detect concerns from metrics
    const concerns: string[] = []
    if (metrics.oiliness > 62)           concerns.push("Excess Sebum")
    if (metrics.poreSize > 55)           concerns.push("Enlarged Pores")
    if (metrics.moisture < 45)           concerns.push("Dehydration")
    if (metrics.fineLines > 45)          concerns.push("Fine Lines")
    if (metrics.redness > 50)            concerns.push("Redness")
    if (metrics.hyperpigmentation > 45)  concerns.push("Uneven Tone")
    if (metrics.darkSpots > 42)          concerns.push("Dark Spots")
    if (metrics.roughness > 52)          concerns.push("Uneven Texture")
    if (metrics.clarity < 48)            concerns.push("Dullness")
    if (skinType === "Sensitive")        concerns.push("Irritation")

    // Overall health score — weighted average of positive indicators
    const healthScore = clamp(
      metrics.moisture         * 0.18 +
      metrics.texture          * 0.16 +
      metrics.clarity          * 0.16 +
      metrics.elasticity       * 0.15 +
      (100 - metrics.redness)  * 0.12 +
      (100 - metrics.hyperpigmentation) * 0.12 +
      (100 - metrics.fineLines)* 0.11
      - concerns.length * 2
    )

    // Age estimate from fine lines + elasticity
    const ageScore = (metrics.fineLines + (100 - metrics.elasticity)) / 2
    const ageEstimate =
      ageScore > 65 ? "40-50" :
      ageScore > 50 ? "35-45" :
      ageScore > 38 ? "28-38" :
      ageScore > 25 ? "22-32" : "18-26"

    // Confidence: based on image quality signals
    const confidence = clamp(
      75 + ps.brightness * 10 - ps.entropy * 8 - (1 - ps.localContrast) * 5
    )

    // Routines
    const morningRoutine = [
      { step: 1, product: skinType === "Oily" ? "Foaming Gel Cleanser (Salicylic 0.5%)" : skinType === "Dry" ? "Cream Cleanser (Ceramide-Enriched)" : "Amino Acid Gentle Cleanser", why: `Your ${skinType.toLowerCase()} skin type (oiliness: ${metrics.oiliness}/100, moisture: ${metrics.moisture}/100) requires a ${skinType === "Oily" ? "sebum-clearing" : skinType === "Dry" ? "barrier-respecting" : "balanced"} cleanse.` },
      { step: 2, product: metrics.moisture < 48 ? "Hyaluronic Acid Hydrating Toner (3 Weights)" : "pH-Balancing Essence", why: metrics.moisture < 48 ? `Moisture score ${metrics.moisture}/100 indicates dehydration — multi-weight HA restores osmotic balance at all skin depths before serums.` : `Your moisture score (${metrics.moisture}/100) is adequate; a balancing essence sets pH to 5.4–5.6 for maximum serum penetration.` },
      { step: 3, product: metrics.hyperpigmentation > 42 ? "Vitamin C Serum 15% + Ferulic Acid" : "Niacinamide Serum 10%", why: metrics.hyperpigmentation > 42 ? `Hyperpigmentation score ${metrics.hyperpigmentation}/100 — L-ascorbic acid inhibits tyrosinase enzyme and neutralises UV-generated free radicals detected in your image.` : `Niacinamide directly reduces sebum production (your sebum score: ${metrics.sebumProduction}/100) and reinforces barrier ceramides.` },
      { step: 4, product: metrics.poreSize > 52 ? "BHA Serum (Salicylic Acid 2%)" : "Peptide Complex Serum", why: metrics.poreSize > 52 ? `Pore score ${metrics.poreSize}/100 — salicylic acid is oil-soluble, penetrating sebaceous follicles to clear congestion at root level.` : "Matrixyl-3000 peptide complex signals fibroblasts to synthesise collagen I & III for long-term firmness support." },
      { step: 5, product: skinType === "Dry" ? "Ceramide + Cholesterol Barrier Repair Cream" : skinType === "Oily" ? "Lightweight Oil-Free Gel Moisturiser" : "Balanced SPF Moisturiser", why: `Seals the treatment stack and maintains TEWL below 15 g/m²/h. Your elasticity score is ${metrics.elasticity}/100.` },
      { step: 6, product: skinType === "Sensitive" ? "Mineral SPF 50+ (Zinc Oxide 20%)" : "Chemical Broad-Spectrum SPF 50+", why: "UVA radiation induces MMP-1 (collagenase), degrading collagen at a rate of 1% per year. Daily SPF 50+ reduces photoaging by 24% over 4.5 years (NEJM, 2013)." },
    ]

    const eveningRoutine = [
      { step: 1, product: "Cleansing Balm or Micellar Oil", why: "First cleanse emulsifies SPF, sebum and environmental PM2.5 particulates that water-based cleansers cannot dissolve." },
      { step: 2, product: skinType === "Sensitive" ? "Gentle Micellar Gel Cleanser" : "pH-Balanced Foam Cleanser", why: "Second cleanse achieves a clean base without disrupting the acid mantle (target pH 4.7–5.5)." },
      { step: 3, product: metrics.redness > 48 ? "Centella Asiatica Calming Toner" : "AHA 5% + PHA Resurfacing Toner", why: metrics.redness > 48 ? `Redness score ${metrics.redness}/100 — Asiaticoside in cica down-regulates NF-κB inflammatory pathway overnight.` : `Texture score ${metrics.texture}/100 — AHA dissolves corneocyte bonds; PHA provides additional humectancy with gentle exfoliation.` },
      { step: 4, product: metrics.fineLines > 40 ? "Retinaldehyde 0.05% Serum" : "EGF + Growth Factor Repair Serum", why: metrics.fineLines > 40 ? `Fine lines score ${metrics.fineLines}/100 — Retinaldehyde converts to retinoic acid in-skin; 11x less irritating than tretinoin with equivalent 12-week efficacy.` : "Epidermal growth factor binds keratinocyte receptors, accelerating overnight skin repair and cellular turnover." },
      { step: 5, product: skinType === "Dry" ? "Overnight Barrier Recovery Mask" : "Ceramide-NP + Squalane Moisturiser", why: "Night-time TEWL is 17% higher than daytime — occlusion supports barrier repair during the circadian repair window (11 PM–2 AM)." },
      ...(metrics.fineLines > 38 || metrics.moisture < 42 ? [{ step: 6, product: "Eye Cream (Caffeine 3% + Retinyl Palmitate)", why: "Periorbital skin is 0.5 mm thick vs 2 mm on the cheeks — targeted actives prevent fine lines and dark circles in the thinnest, most delicate zone." }] : []),
    ]

    const ingredientsToUse: { name: string; benefit: string; priority: "high" | "medium" | "low" }[] = []
    if (metrics.moisture < 55)           ingredientsToUse.push({ name: "Hyaluronic Acid (3 Molecular Weights)", benefit: `Moisture score ${metrics.moisture}/100. Multi-weight HA hydrates from stratum corneum to dermis simultaneously — holds 1,000× its weight in water.`, priority: "high" })
    if (metrics.oiliness > 58)           ingredientsToUse.push({ name: "Niacinamide 10%", benefit: `Sebum score ${metrics.sebumProduction}/100. Reduces sebocyte lipid production by 30% at 4 weeks and visibly minimises pore size.`, priority: "high" })
    if (metrics.fineLines > 38)          ingredientsToUse.push({ name: "Retinaldehyde 0.05–0.1%", benefit: `Fine lines score ${metrics.fineLines}/100. Most potent OTC retinoid — converts directly to retinoic acid without requiring hepatic metabolism.`, priority: "high" })
    if (metrics.hyperpigmentation > 40)  ingredientsToUse.push({ name: "Vitamin C (L-Ascorbic Acid 15%)", benefit: `Pigmentation score ${metrics.hyperpigmentation}/100. Inhibits tyrosinase enzyme, preventing melanin synthesis while scavenging UV-generated reactive oxygen species.`, priority: "high" })
    if (metrics.redness > 45)           ingredientsToUse.push({ name: "Centella Asiatica (Asiaticoside)", benefit: `Redness score ${metrics.redness}/100. Clinically shown to reduce TEWL by 13% and inflammatory cytokines by 28% over 8 weeks.`, priority: "high" })
    ingredientsToUse.push({ name: "Ceramides (NP, AP, EOP)", benefit: "Restores the 3-lamellar lipid matrix of the stratum corneum — essential for all skin types regardless of concerns.", priority: "medium" })
    ingredientsToUse.push({ name: "Azelaic Acid 10%", benefit: "Dual-action: antimicrobial against P. acnes + tyrosinase inhibitor for fading pigmentation. Safe in pregnancy.", priority: "medium" })
    if (metrics.clarity < 55)           ingredientsToUse.push({ name: "Glycolic Acid 5-8% (AHA)", benefit: `Clarity score ${metrics.clarity}/100. Smallest AHA molecule — penetrates deepest to dissolve corneocyte bonds and reduce cell turnover from 28 to 14 days.`, priority: "medium" })
    ingredientsToUse.push({ name: "Squalane (Plant-Derived)", benefit: "Skin-identical lipid that mimics sebum without clogging. Reinforces barrier without greasiness — universal for all skin types.", priority: "low" })

    const ingredientsToAvoid =
      skinType === "Sensitive"
        ? ["Synthetic fragrance (top allergen)", "Denatured alcohol (SD40)", "Essential oils — lavender, citrus, peppermint", "Sodium Lauryl Sulfate (SLS)", "High-concentration AHA > 10%"]
        : skinType === "Oily"
        ? ["Mineral oil (non-breathable occlusive)", "Heavy silicones (dimethicone-dominant)", "Comedogenic oils — coconut oil, cocoa butter, wheat germ oil", "Thick emollient creams with petrolatum as first ingredient"]
        : skinType === "Dry"
        ? ["Denatured alcohol (strips barrier lipids)", "High-concentration salicylic acid > 2%", "Sulfate-heavy cleansers", "Astringent alcohol-based toners"]
        : ["Denatured alcohol in high concentrations", "Unfiltered essential oils without carrier", "Harsh physical scrubs with irregular particles"]

    // ── Dynamic lifestyle tips based on actual skin metrics ─────────────────────
    const lifestyleTips = [
      // 1. Sleep — scales with elasticity + fine lines + firmness
      {
        category: "Sleep",
        icon: "moon",
        image: "/habit-sleep.jpg",
        title: metrics.elasticity < 50 || metrics.fineLines > 55
          ? "Urgently Prioritise Sleep for Skin Repair"
          : metrics.elasticity < 70
          ? "Improve Sleep Quality to Boost Elasticity"
          : "Maintain Your 7–9 Hour Sleep Routine",
        tip: metrics.elasticity < 50
          ? `Your elasticity score is critically low at ${metrics.elasticity}/100. Growth hormone — the primary collagen-building signal — peaks between 11 PM and 2 AM during deep sleep. Poor sleep actively degrades your skin structure.`
          : metrics.fineLines > 55
          ? `Fine lines are elevated at ${metrics.fineLines}/100. During sleep, skin cell turnover doubles and collagen synthesis peaks. Even one week of 6-hour nights reduces collagen by 25%.`
          : metrics.elasticity < 70
          ? `Your elasticity score of ${metrics.elasticity}/100 can improve with consistent deep sleep. Growth hormone production during sleep drives collagen synthesis — aim for 7–9 hours per night.`
          : `Elasticity score of ${metrics.elasticity}/100 is healthy. Consistent sleep maintains the overnight repair window and prevents premature collagen degradation.`,
        frequency: "Every night",
        impact: (metrics.elasticity < 55 || metrics.fineLines > 50) ? "high" : "medium",
        habits: [
          "Set a consistent bedtime before 11 PM",
          "Keep your room cool (18–20 °C) for deeper sleep stages",
          metrics.fineLines > 45
            ? "Sleep on your back to prevent compression wrinkles"
            : "Avoid screens 30 min before bed to reduce cortisol",
          "Use a silk pillowcase to minimise friction and moisture loss",
        ],
      },

      // 2. Hydration — scales with moisture + dehydration lines
      {
        category: "Hydration",
        icon: "droplets",
        image: "/habit-hydration.jpg",
        title: metrics.moisture < 40
          ? "Critical: Hydrate Your Skin from the Inside"
          : metrics.moisture < 60
          ? "Boost Daily Water Intake for Better Moisture"
          : "Maintain Your Hydration Levels",
        tip: metrics.moisture < 40
          ? `Your moisture score is at ${metrics.moisture}/100 — clinically dehydrated. Internal hydration directly supports the stratum corneum's water-holding capacity and makes topical serums significantly more effective.`
          : metrics.moisture < 60
          ? `Moisture is at ${metrics.moisture}/100. Increasing daily water intake to 2.5–3 L raises skin surface hydration measurably within 4 weeks and reduces dehydration lines.`
          : `Your moisture score of ${metrics.moisture}/100 is healthy. Maintain 2–3 L daily to sustain barrier function and amplify topical hyaluronic acid.`,
        frequency: "Throughout the day",
        impact: metrics.moisture < 50 ? "high" : "medium",
        habits: [
          "Start each morning with 500 ml water before coffee",
          metrics.moisture < 50
            ? "Limit caffeine to 2 cups daily — it acts as a diuretic"
            : "Eat water-rich foods: cucumber, watermelon, celery",
          metrics.dehydrationLines > 50
            ? "Add electrolytes (magnesium, potassium) to improve cellular retention"
            : "Limit alcohol which increases transepidermal water loss",
          "Track intake with a marked 2.5 L water bottle",
        ],
      },

      // 3. Sun protection — scales with hyperpigmentation + fine lines + clarity
      {
        category: "Sun Protection",
        icon: "sun",
        image: "/habit-sunscreen.jpg",
        title: metrics.hyperpigmentation > 55 || metrics.darkSpots > 50
          ? "SPF Is Non-Negotiable for Your Pigmentation"
          : metrics.fineLines > 45
          ? "Daily SPF to Prevent Further Photoaging"
          : "Keep Up Your Daily SPF Habit",
        tip: metrics.hyperpigmentation > 55
          ? `Your hyperpigmentation score is ${metrics.hyperpigmentation}/100. UV exposure triggers melanin overproduction. Without daily SPF 50+, any topical brightening treatment will be counteracted within hours.`
          : metrics.fineLines > 45
          ? `Fine lines at ${metrics.fineLines}/100 indicate active photoaging. UV radiation generates reactive oxygen species that degrade collagen and elastin — SPF is the single most evidence-backed anti-aging intervention.`
          : "UV radiation accounts for up to 80% of visible skin aging. Daily broad-spectrum SPF maintains your current skin health and prevents future damage.",
        frequency: "Daily outdoors",
        impact: (metrics.hyperpigmentation > 50 || metrics.fineLines > 50) ? "high" : "medium",
        habits: [
          metrics.hyperpigmentation > 55
            ? "Use SPF 50+ PA++++ with iron oxides to block visible light (triggers melanin)"
            : "Apply SPF 30+ as the last step of your morning routine",
          "Reapply every 2 hours of direct sun exposure",
          metrics.darkSpots > 50
            ? "Wear a wide-brim hat on high UV index days"
            : "Use SPF 50 for high UV index days (UV > 6)",
          "Don't forget neck, hands, and décolletage",
        ],
      },

      // 4. Stress — scales with acne concern + redness + oiliness
      {
        category: "Stress Management",
        icon: "zap",
        image: "/habit-stress.jpg",
        title: (concerns.includes("Acne") && metrics.oiliness > 60)
          ? "Stress is Fuelling Your Breakouts"
          : metrics.redness > 55
          ? "Manage Stress to Calm Skin Reactivity"
          : "Maintain Stress-Reduction Habits",
        tip: (concerns.includes("Acne") && metrics.oiliness > 60)
          ? `Acne concern + oiliness at ${metrics.oiliness}/100: cortisol directly stimulates sebaceous glands via androgen receptors, increasing sebum by up to 60% during stress. Stress management is as important as your topical routine.`
          : metrics.redness > 55
          ? `Your redness score of ${metrics.redness}/100 suggests reactive inflammation. Chronic cortisol disrupts the skin barrier and amplifies immune responses, worsening visible redness and sensitivity.`
          : "Sustained low-level stress degrades collagen through cortisol-mediated metalloproteinase activation. Daily stress management preserves skin structure over time.",
        frequency: "Daily practice",
        impact: (concerns.includes("Acne") || metrics.redness > 55) ? "high" : "medium",
        habits: [
          "10 minutes of mindful breathing or meditation daily",
          metrics.oiliness > 60
            ? "Exercise 3–4× per week — reduces cortisol and regulates sebum"
            : "Regular aerobic exercise boosts microcirculation to skin",
          "Limit alcohol — it spikes cortisol and dehydrates skin cells",
          metrics.sensitivity > 50
            ? "Practice progressive muscle relaxation to reduce inflammatory flares"
            : "Journal or talk therapy to process chronic stressors",
        ],
      },

      // 5. Nutrition — scales with skin type and dominant concern
      {
        category: "Nutrition",
        icon: "leaf",
        image: "/habit-diet.jpg",
        title: concerns.includes("Acne")
          ? "Adjust Your Diet to Reduce Acne Triggers"
          : skinType === "Dry" || metrics.moisture < 50
          ? "Eat More Skin-Barrier Building Foods"
          : metrics.hyperpigmentation > 50
          ? "Boost Your Diet for Brighter Skin"
          : "Optimise Your Diet for Skin Health",
        tip: concerns.includes("Acne")
          ? `Acne-prone skin is highly sensitive to glycaemic load. High-GI foods spike insulin, raising IGF-1 — a hormone that increases sebum production and skin cell proliferation. Dietary changes can reduce breakouts by 30–50%.`
          : skinType === "Dry" || metrics.moisture < 50
          ? `Dry skin (moisture: ${metrics.moisture}/100) often lacks essential fatty acids. Omega-3s (EPA/DHA) are incorporated directly into phospholipids in your skin's lipid bilayer, improving moisture retention and reducing TEWL.`
          : metrics.hyperpigmentation > 50
          ? `Hyperpigmentation at ${metrics.hyperpigmentation}/100. Antioxidant-rich foods neutralise UV-generated free radicals and vitamin C inhibits tyrosinase enzyme that produces melanin.`
          : "Antioxidant-rich foods neutralise free radicals that degrade collagen. Vitamins C, E, and polyphenols from berries reduce skin inflammation markers within 8 weeks.",
        frequency: "Every meal",
        impact: (concerns.includes("Acne") || skinType === "Dry" || metrics.moisture < 50) ? "high" : "medium",
        habits: [
          concerns.includes("Acne")
            ? "Eliminate white bread, sugary drinks, and processed cereals"
            : "Eat berries, leafy greens, and colourful vegetables daily",
          skinType === "Dry" || metrics.moisture < 50
            ? "Include omega-3 sources 4× per week: salmon, mackerel, walnuts, flaxseed"
            : "Include omega-3 sources: salmon, walnuts, chia seeds",
          metrics.hyperpigmentation > 50
            ? "Eat vitamin C-rich foods (bell peppers, kiwi) to inhibit melanin synthesis"
            : "Consider collagen peptide powder (10 g) with Vitamin C",
          concerns.includes("Acne")
            ? "Try a 4-week low-GI diet and track breakout frequency"
            : "Limit ultra-processed foods high in refined sugar and trans fats",
        ],
      },

      // 6. Hygiene vs Environment — oily/acne vs dry/sensitive
      ...(skinType === "Oily" || (concerns.includes("Acne") && metrics.oiliness > 55) ? [{
        category: "Hygiene",
        icon: "shield",
        image: "/habit-hygiene.jpg",
        title: metrics.oiliness > 70
          ? "Strict Hygiene Protocol for Oily Skin"
          : "Reduce Bacterial Transfer to Your Skin",
        tip: metrics.oiliness > 70
          ? `Sebum output is high at ${metrics.oiliness}/100. This creates an ideal environment for P. acnes bacteria. Every time you touch your face, you transfer bacteria, oils, and allergens from your hands directly onto your skin.`
          : `Your oiliness score of ${metrics.oiliness}/100 combined with acne means bacterial cross-contamination from surfaces and hands is actively worsening your skin. Hygiene interventions alone can reduce lesion count.`,
        frequency: "All day",
        impact: "high" as const,
        habits: [
          "Become conscious of unconscious face-touching habits throughout the day",
          metrics.oiliness > 70
            ? "Change your pillowcase every 2–3 days (bacteria double every 20 min on fabric)"
            : "Change your pillowcase every 3–4 days",
          "Disinfect your phone screen with alcohol wipes daily",
          "Use clean application tools — never apply products with unwashed fingers",
        ],
      }] : [{
        category: "Environment",
        icon: "cloud",
        image: "/habit-environment.jpg",
        title: metrics.moisture < 50
          ? "Your Dry Indoor Environment is Worsening Your Skin"
          : skinType === "Sensitive"
          ? "Control Environment to Reduce Skin Reactivity"
          : "Optimise Indoor Humidity for Skin Health",
        tip: metrics.moisture < 50
          ? `Moisture score of ${metrics.moisture}/100 combined with dry indoor air compounds the problem. Low ambient humidity (below 40% RH) increases transepidermal water loss by up to 25%, directly pulling moisture out of your skin.`
          : skinType === "Sensitive"
          ? "Sensitive skin is highly reactive to environmental triggers: dry air, pollution, and temperature swings all compromise the barrier. A stable indoor environment measurably reduces reactive flares."
          : "Low ambient humidity increases transepidermal water loss by 25%. A humidified home environment maintains your current moisture score and amplifies the effect of topical hydrators.",
        frequency: "At home & office",
        impact: (metrics.moisture < 50 || skinType === "Sensitive") ? "high" as const : "medium" as const,
        habits: [
          metrics.moisture < 50
            ? "Use a humidifier in your bedroom set to 50–55% RH — this is the most impactful change"
            : "Use a humidifier in your bedroom targeting 45–55% RH",
          skinType === "Sensitive"
            ? "Avoid synthetic fragrances in candles, laundry detergents, and air fresheners"
            : "Place humidity-regulating plants (pothos, peace lily) in living spaces",
          "Limit shower temperature to 37–38 °C — hot water dissolves skin lipids",
          metrics.moisture < 50
            ? "Apply moisturiser within 60 seconds of cleansing to lock in residual water"
            : "Apply moisturiser within 3 minutes of cleansing on damp skin",
        ],
      }]),
    ]

    const recommendations = [
      `Your skin type is ${skinType}. Primary concerns: ${concerns.slice(0, 3).join(", ") || "none detected"}.`,
      healthScore >= 75 ? "Your skin health is strong. Focus on maintenance and prevention." : "Your skin would benefit from a targeted active ingredient protocol. Start with one new product at a time.",
      `Next check-in recommended in ${metrics.fineLines > 40 || concerns.length > 3 ? 21 : 30} days to track improvement.`,
    ]

    const result = {
      skinType, concerns, healthScore, ageEstimate,
      detailedMetrics: metrics, zoneBreakdown,
      recommendations, morningRoutine, eveningRoutine,
      ingredientsToUse, ingredientsToAvoid, lifestyleTips,
      confidence,
      trend: healthScore > 70 ? "improving" : healthScore > 55 ? "stable" : "declining",
      nextCheckIn: metrics.fineLines > 40 || concerns.length > 3 ? 21 : 30,
    }

    const cookieStore = await cookies()
    const userId = cookieStore.get("auth_email")?.value || "anonymous-demo-user"
    const backendAnalysis = await syncAnalysisToBackend(ps, result, userId)
    if (backendAnalysis?.modelAnalysis) {
      Object.assign(result, {
        analysisEngine: backendAnalysis.analysisEngine,
        modelAnalysis: backendAnalysis.modelAnalysis,
        modelSkinType: backendAnalysis.modelSkinType,
        modelConfidence: backendAnalysis.modelConfidence,
      })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error("[analyze-skin]", err)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

async function syncAnalysisToBackend(pixelStats: PixelStats, result: Record<string, unknown>, userId: string) {
  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/skin-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pixelStats,
        imageDataUrl: body.imageDataUrl,
        saveMeasurement: true,
        deviceId: "frontend-skin-analysis",
        userId,
        frontendAnalysis: result,
      }),
      cache: "no-store",
    })
    if (!response.ok) return null
    return response.json()
  } catch (err) {
    console.warn("[analyze-skin] could not sync analysis to backend", err)
    return null
  }
}
