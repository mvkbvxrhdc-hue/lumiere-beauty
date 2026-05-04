"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Sparkles, User, ChevronRight, Zap, BookOpen, Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

// ─── Knowledge Base ────────────────────────────────────────────────────────────
// Each node: keywords (weighted), response, follow-up suggestion, related topics

type KnowledgeNode = {
  id: string
  keywords: { word: string; weight: number }[]
  response: (ctx: ConversationContext) => string
  followUp?: string
  related?: string[]
}

type ConversationContext = {
  skinType?: "oily" | "dry" | "combination" | "sensitive" | "normal"
  concerns: string[]
  mentionedTopics: string[]
  turnCount: number
}

const KNOWLEDGE_BASE: KnowledgeNode[] = [
  // ── Skin Types ──
  {
    id: "oily_skin",
    keywords: [
      { word: "oily", weight: 3 }, { word: "greasy", weight: 3 }, { word: "shine", weight: 2 },
      { word: "sebum", weight: 3 }, { word: "shiny", weight: 2 }, { word: "t-zone", weight: 2 },
    ],
    response: (ctx) => {
      const base = "Oily skin overproduces sebum — but it still needs hydration. Skipping moisturiser causes rebound oiliness. Core routine: low-pH gel cleanser → niacinamide 10% serum (regulates sebum production) → oil-free gel moisturiser → SPF 50 (non-comedogenic)."
      const extra = "\n\nKey ingredients to prioritise:\n• Niacinamide 5–10% — reduces pore size & sebum output\n• Salicylic acid 2% — dissolves oil inside pores (BHA)\n• Zinc PCA — antimicrobial & oil-balancing\n• Kaolin clay mask 1×/week — draws out excess oil\n\nAvoid: heavy oils, silicone-heavy primers, and alcohol-based toners that over-strip."
      return base + extra
    },
    followUp: "Do you also deal with breakouts, or is shine your main concern?",
    related: ["acne", "enlarged_pores", "bha_exfoliant"],
  },
  {
    id: "dry_skin",
    keywords: [
      { word: "dry", weight: 3 }, { word: "flaky", weight: 3 }, { word: "tight", weight: 2 },
      { word: "dehydrated", weight: 2 }, { word: "rough", weight: 2 }, { word: "peeling", weight: 2 },
    ],
    response: (ctx) => {
      return "Dry skin lacks lipids in the stratum corneum — the fix is layering humectants under occlusives.\n\nRoutine order matters:\n1. Cream/oil cleanser (avoid foaming — it strips lipids)\n2. Hydrating toner (glycerin or HA) on damp skin\n3. Hyaluronic acid serum (damp skin traps more moisture)\n4. Ceramide moisturiser (repairs lipid barrier)\n5. Optional: facial oil as final seal (squalane or rosehip)\n\nKey ingredients: Ceramides NP/AP/EOP, cholesterol, fatty acids, hyaluronic acid (multi-molecular weight), glycerin, shea butter.\n\nAvoid: SLS cleansers, alcohol-heavy products, and AHAs without barrier repair."
    },
    followUp: "Is your skin always dry, or does it fluctuate with seasons?",
    related: ["sensitive_skin", "barrier_repair", "moisturiser"],
  },
  {
    id: "combination_skin",
    keywords: [
      { word: "combination", weight: 3 }, { word: "mixed", weight: 2 }, { word: "oily t-zone", weight: 3 },
      { word: "dry cheeks", weight: 3 }, { word: "different areas", weight: 2 },
    ],
    response: () =>
      "Combination skin needs zone-based care — different products for different areas.\n\nT-zone (forehead, nose, chin):\n• Gel cleanser, BHA 1–2×/week, lightweight gel moisturiser\n• Mattifying sunscreen\n\nCheeks & under-eyes:\n• Cream cleanser or double cleanse, ceramide moisturiser, hydrating serum\n\nUseful everywhere: Niacinamide 5% — balances oil AND supports barrier. Avoid thick creams on T-zone and avoid foaming cleansers on cheeks.",
    followUp: "Do you get breakouts primarily in the T-zone?",
    related: ["oily_skin", "dry_skin", "niacinamide"],
  },
  {
    id: "sensitive_skin",
    keywords: [
      { word: "sensitive", weight: 3 }, { word: "reactive", weight: 3 }, { word: "redness", weight: 2 },
      { word: "irritated", weight: 3 }, { word: "stinging", weight: 3 }, { word: "burning", weight: 3 },
      { word: "rosacea", weight: 3 }, { word: "flush", weight: 2 },
    ],
    response: () =>
      "Sensitive skin has a compromised barrier that over-reacts to triggers. The priority is repair before treatment.\n\nSafe routine:\n1. Micellar water or gentle cream cleanser (pH 4.5–5.5)\n2. Centella asiatica serum (anti-inflammatory, barrier repair)\n3. Ceramide + cholesterol moisturiser\n4. Mineral SPF (zinc oxide — sits on top, no chemical absorption)\n\nCalming ingredients: Centella asiatica, bisabolol, oat extract (Avenanthramide), panthenol (B5), allantoin.\n\nFor rosacea specifically: azelaic acid 10–15% reduces inflammation and redness — one of the few actives proven safe for rosacea.\n\nStrict avoids: fragrance, essential oils, alcohol denat., SLS, physical scrubs, and strong actives (retinoids, AHA) until barrier is stable.",
    followUp: "Have you identified any specific triggers — like temperature, foods, or particular products?",
    related: ["barrier_repair", "rosacea", "azelaic_acid"],
  },

  // ── Acne & Breakouts ──
  {
    id: "acne",
    keywords: [
      { word: "acne", weight: 3 }, { word: "pimple", weight: 3 }, { word: "breakout", weight: 3 },
      { word: "zit", weight: 3 }, { word: "cystic", weight: 3 }, { word: "blackhead", weight: 2 },
      { word: "whitehead", weight: 2 }, { word: "blemish", weight: 2 }, { word: "comedone", weight: 3 },
    ],
    response: (ctx) => {
      const hasCystic = ctx.mentionedTopics.includes("cystic")
      const base = "Acne is caused by four factors: excess sebum, dead skin cell buildup, C. acnes bacteria, and inflammation. Effective treatment targets at least two of these.\n\nCore evidence-based treatments:\n• Salicylic acid 2% (BHA) — dissolves oil + exfoliates inside pores\n• Benzoyl peroxide 2.5–5% — kills C. acnes bacteria (most potent OTC)\n• Adapalene 0.1% (Differin) — retinoid, now OTC, prevents new comedones\n• Niacinamide 10% — reduces inflammation and sebum"
      const cysticNote = hasCystic
        ? "\n\nFor deep cystic acne: topical products alone won't reach it. A dermatologist can prescribe oral antibiotics (short-term), spironolactone (hormonal acne), or isotretinoin for severe cases."
        : "\n\nTimeline: expect 8–12 weeks for significant improvement. Purging (initial worsening) is normal with retinoids — it clears in 4–6 weeks."
      return base + cysticNote
    },
    followUp: "Is your acne primarily hormonal (around the jawline/chin) or all over the face?",
    related: ["bha_exfoliant", "benzoyl_peroxide", "retinol", "enlarged_pores"],
  },
  {
    id: "acne_scars",
    keywords: [
      { word: "scar", weight: 3 }, { word: "acne mark", weight: 3 }, { word: "post-acne", weight: 3 },
      { word: "pitting", weight: 3 }, { word: "ice pick", weight: 3 }, { word: "boxcar", weight: 3 },
      { word: "rolling scar", weight: 3 }, { word: "pih", weight: 3 },
    ],
    response: () =>
      "Acne scars fall into two categories — treat them differently:\n\n**Flat post-inflammatory hyperpigmentation (PIH — dark marks):**\n• Vitamin C 15–20% (brightening)\n• Azelaic acid 10% (melanin inhibitor)\n• Tranexamic acid (very effective for PIH)\n• Daily SPF 50 — non-negotiable, UV deepens PIH\n\n**Textural scars (icepick, boxcar, rolling):**\n• Microneedling 1.5–2mm — stimulates collagen remodelling (3–6 sessions)\n• Fractional laser (CO2 or Erbium) — most effective for deep scars\n• Chemical peels (TCA CROSS for icepick scars)\n• Subcision — for tethered rolling scars (breaks fibrous tissue)\n• Dermal filler — temporary volume fill for depressions\n\nTimeline: 6–18 months for significant improvement regardless of method.",
    followUp: "Are your scars mostly flat dark marks, or do they have texture/indentation?",
    related: ["hyperpigmentation", "vitamin_c", "professional_treatments"],
  },
  {
    id: "enlarged_pores",
    keywords: [
      { word: "pore", weight: 3 }, { word: "large pore", weight: 3 }, { word: "open pore", weight: 3 },
      { word: "minimize pore", weight: 3 }, { word: "pore size", weight: 3 },
    ],
    response: () =>
      "Pore size is largely genetic — but their appearance can be significantly reduced.\n\nWhat actually minimises pores:\n• Niacinamide 10% — clinically shown to reduce pore appearance over 12 weeks\n• Salicylic acid 2% (BHA) — dissolves sebum plug that stretches pores\n• Retinoids — increase collagen around pore walls, physically tightening them\n• Clay masks 1×/week — temporary but immediate tightening effect\n\nProfessional options:\n• Laser resurfacing (fractional) — most dramatic permanent improvement\n• Microneedling — stimulates collagen around pores\n• Professional chemical peels (glycolic 30–70%)\n\nMyths: cold water, ice, and primers don't actually change pore size — they temporarily reduce visibility.",
    followUp: "Do you also deal with blackheads or excess oil in those pores?",
    related: ["oily_skin", "bha_exfoliant", "niacinamide"],
  },

  // ── Anti-Aging ──
  {
    id: "anti_aging",
    keywords: [
      { word: "anti-aging", weight: 3 }, { word: "antiaging", weight: 3 }, { word: "aging", weight: 2 },
      { word: "age gracefully", weight: 2 }, { word: "look younger", weight: 2 }, { word: "youthful", weight: 2 },
    ],
    response: () =>
      "The evidence-based anti-aging hierarchy (ranked by clinical evidence):\n\n1. SPF 50 broad-spectrum — prevents 80% of visible aging (photoaging). Non-negotiable.\n2. Retinoids — only ingredient proven to reverse wrinkles (increases collagen, speeds cell turnover)\n3. Vitamin C 15–20% — antioxidant protection + collagen synthesis\n4. Peptides — signal collagen production (gentler than retinoids, stackable)\n5. Niacinamide — reduces pigmentation, firms skin\n\n**Morning:** Vitamin C → moisturiser → SPF 50\n**Evening:** Retinoid → moisturiser (wait 20 min after retinoid)\n\nProfessional: Botox for dynamic lines (3–4 month results), fillers for volume loss, laser/RF for skin tightening.",
    followUp: "Are you more concerned with fine lines, loss of firmness, or uneven tone?",
    related: ["retinol", "vitamin_c", "sunscreen", "fine_lines"],
  },
  {
    id: "fine_lines",
    keywords: [
      { word: "fine line", weight: 3 }, { word: "wrinkle", weight: 3 }, { word: "crow's feet", weight: 3 },
      { word: "forehead line", weight: 3 }, { word: "frown line", weight: 3 }, { word: "expression line", weight: 2 },
    ],
    response: () =>
      "Fine lines have two causes — expression (dynamic) and loss of collagen (static). Treatments differ:\n\n**Dynamic lines (visible only when you move):**\n• Botox — most effective treatment, relaxes underlying muscles (lasts 3–4 months)\n• Retinoids — can soften over 6–12 months of consistent use\n\n**Static lines (visible at rest):**\n• Retinoids (tretinoin 0.025–0.1%) — only topical proven to rebuild dermal collagen\n• Hyaluronic acid filler — immediate volume, lasts 9–18 months\n• Fractional laser — stimulates new collagen (3–5 sessions)\n• RF microneedling (Morpheus8) — combines heat + needling for deeper tightening\n\nPrevent new ones: SPF every day, sleep on back (pillow creases turn permanent), stay hydrated.",
    followUp: "Are these lines worse when you move your face, or visible even at rest?",
    related: ["anti_aging", "retinol", "botox_fillers"],
  },
  {
    id: "botox_fillers",
    keywords: [
      { word: "botox", weight: 3 }, { word: "filler", weight: 3 }, { word: "dermal filler", weight: 3 },
      { word: "lip filler", weight: 3 }, { word: "injection", weight: 2 }, { word: "hyaluronic filler", weight: 3 },
    ],
    response: () =>
      "Botox and fillers are completely different treatments — often combined:\n\n**Botox (botulinum toxin):**\n• Works by temporarily paralysing muscles\n• Best for: forehead lines, frown lines (11s), crow's feet, lip flip, gummy smile\n• Onset: 3–7 days, peaks at 2 weeks\n• Duration: 3–4 months (longer with repeated use)\n• Risks: bruising, asymmetry, ptosis (rare if injected properly)\n\n**Dermal Fillers (HA-based):**\n• Adds volume and structure\n• Best for: nasolabial folds, lips, cheeks, under-eyes (tear trough), jawline\n• Immediate results, lasts 6–24 months depending on area\n• Reversible with hyaluronidase\n\nChoose an experienced injector — a board-certified dermatologist or plastic surgeon. Results vary significantly by injector skill.",
    followUp: "Are you considering this for a specific area, like the forehead or lips?",
    related: ["fine_lines", "anti_aging", "professional_treatments"],
  },

  // ── Pigmentation ──
  {
    id: "hyperpigmentation",
    keywords: [
      { word: "hyperpigmentation", weight: 3 }, { word: "dark spot", weight: 3 }, { word: "sun spot", weight: 3 },
      { word: "age spot", weight: 3 }, { word: "melasma", weight: 3 }, { word: "uneven tone", weight: 2 },
      { word: "discolour", weight: 2 }, { word: "pigment", weight: 2 }, { word: "brown spot", weight: 3 },
    ],
    response: () =>
      "Hyperpigmentation is overproduction of melanin. Treatment must address the cause and block melanin at multiple points.\n\n**Evidence-ranked brightening ingredients:**\n1. Hydroquinone 4% (Rx) — gold standard, tyrosinase inhibitor\n2. Tranexamic acid — highly effective, especially for melasma\n3. Azelaic acid 10–20% — doubles as anti-inflammatory\n4. Vitamin C 15–20% — antioxidant + brightening\n5. Niacinamide 10% — blocks melanin transfer to skin cells\n6. Alpha arbutin 2% — gentler hydroquinone derivative\n7. Kojic acid, licorice root — supplementary\n\n**SPF 50 is mandatory** — UV exposure reverses all brightening progress in days.\n\nProfessional: IPL laser (best for solar lentigines), chemical peels (glycolic/kojic), Q-switched Nd:YAG for deep pigment.\n\nTimeline: 3–6 months topical. Melasma is chronic — requires maintenance.",
    followUp: "Is this pigmentation from sun damage, post-acne marks, or hormone-related (melasma)?",
    related: ["vitamin_c", "sunscreen", "acne_scars"],
  },

  // ── Key Ingredients ──
  {
    id: "retinol",
    keywords: [
      { word: "retinol", weight: 3 }, { word: "retinoid", weight: 3 }, { word: "tretinoin", weight: 3 },
      { word: "retin-a", weight: 3 }, { word: "adapalene", weight: 3 }, { word: "retinal", weight: 3 },
      { word: "retinaldehyde", weight: 3 },
    ],
    response: () =>
      "The retinoid family — ranked by strength:\n\nRetinyl esters → Retinol → Retinaldehyde → Adapalene → Tretinoin (Rx)\n\n**Starting protocol (to avoid purging/irritation):**\n• Week 1–2: Apply 0.1% retinol every 3rd night\n• Week 3–4: Every other night\n• Month 2–3: Nightly if skin tolerates\n• Then upgrade % gradually over months\n\n**Sandwich method** (for sensitive skin): Moisturiser → retinol → moisturiser\n\n**Non-negotiables:**\n• SPF the next morning — retinoids increase photosensitivity\n• No mixing with AHA/BHA in the same step (increases irritation)\n• Not safe during pregnancy\n\n**Adapalene 0.1% (Differin)**: Best starter retinoid — OTC, lower irritation than tretinoin, proven for both acne and anti-aging.\n\n**Tretinoin**: Prescription only, most researched, shows collagen results in 12 weeks.",
    followUp: "Are you using retinoids for anti-aging, acne, or both?",
    related: ["anti_aging", "acne", "sensitive_skin"],
  },
  {
    id: "vitamin_c",
    keywords: [
      { word: "vitamin c", weight: 3 }, { word: "ascorbic acid", weight: 3 }, { word: "l-ascorbic", weight: 3 },
      { word: "brightening serum", weight: 2 }, { word: "antioxidant serum", weight: 2 },
    ],
    response: () =>
      "Vitamin C is the most important morning antioxidant. Key facts:\n\n**Forms ranked by efficacy:**\n1. L-Ascorbic Acid — most potent, pH 3.5 required, unstable (oxidises to orange)\n2. Ascorbyl Glucoside — stable, converts to L-AA in skin\n3. Sodium Ascorbyl Phosphate — very stable, good for acne-prone\n4. Ascorbyl Tetraisopalmitate — oil-soluble, penetrates deeper\n\n**Optimal formulation:** 15–20% L-Ascorbic Acid + 1% Vitamin E + 0.5% Ferulic Acid. This combo is 8× more photoprotective than C alone.\n\n**Application:** Apply to clean skin before moisturiser, every morning. Keep in a dark/opaque bottle — discard when it turns orange-brown (oxidised, no longer effective).\n\n**Don't mix directly with:** Retinol in same step (different pH requirements), Benzoyl peroxide (oxidises the C).",
    followUp: "Are you using it primarily for brightening or for antioxidant protection?",
    related: ["hyperpigmentation", "anti_aging", "sunscreen"],
  },
  {
    id: "niacinamide",
    keywords: [
      { word: "niacinamide", weight: 3 }, { word: "vitamin b3", weight: 3 }, { word: "nicotinamide", weight: 3 },
    ],
    response: () =>
      "Niacinamide is one of the most versatile and well-tolerated actives — safe for all skin types.\n\n**Proven benefits at specific concentrations:**\n• 2–5%: Barrier repair (increases ceramide synthesis)\n• 5%: Reduces sebum output (oily skin)\n• 5–10%: Minimises pore appearance\n• 5–10%: Reduces redness/inflammation (rosacea, sensitive skin)\n• 10%: Fades hyperpigmentation (blocks melanin transfer)\n• 4–5%: Improves fine lines (NAD+ pathway)\n\n**Pairs well with:** Almost everything — retinol, AHA/BHA, vitamin C (ignore the flushing myth at modern concentrations), hyaluronic acid.\n\n**Use 10% in the morning** for sebum/pigment control, 5% evening for barrier repair.",
    followUp: "What's your main reason for using it — oil control, pigmentation, or barrier support?",
    related: ["oily_skin", "hyperpigmentation", "sensitive_skin"],
  },
  {
    id: "bha_exfoliant",
    keywords: [
      { word: "salicylic acid", weight: 3 }, { word: "bha", weight: 3 }, { word: "beta hydroxy", weight: 3 },
      { word: "exfoliant", weight: 2 }, { word: "exfoliate", weight: 2 }, { word: "chemical exfoliant", weight: 2 },
    ],
    response: () =>
      "BHA (Salicylic Acid) is oil-soluble — the only exfoliant that penetrates into pores to dissolve sebum.\n\n**What it does:**\n• Unclogs blackheads and whiteheads from inside the pore\n• Reduces sebum production\n• Exfoliates dead skin cells\n• Anti-inflammatory properties (great for inflammatory acne)\n\n**How to use:**\n• Concentration: 1–2% (higher % doesn't perform better, causes more irritation)\n• Frequency: Start 2×/week, increase to daily if skin tolerates\n• Apply to dry skin, leave for 20+ minutes, then continue routine\n• Do NOT use same session as retinoids (different pH, reduces efficacy of both)\n\n**AHA vs BHA:**\n• AHA (glycolic, lactic): Water-soluble, works on surface — better for dry skin, pigmentation, fine lines\n• BHA: Oil-soluble, works in pores — better for oily, acne-prone, clogged pores\n• Many people benefit from alternating both.",
    followUp: "Are you dealing more with blackheads, whiteheads, or inflamed pimples?",
    related: ["acne", "oily_skin", "enlarged_pores"],
  },
  {
    id: "sunscreen",
    keywords: [
      { word: "sunscreen", weight: 3 }, { word: "spf", weight: 3 }, { word: "sun protection", weight: 3 },
      { word: "sunblock", weight: 3 }, { word: "uv", weight: 2 }, { word: "mineral sunscreen", weight: 3 },
      { word: "chemical sunscreen", weight: 3 }, { word: "physical sunscreen", weight: 3 },
    ],
    response: () =>
      "SPF is the single most impactful skincare product you can use — period.\n\n**SPF numbers explained:**\n• SPF 30: blocks 97% of UVB\n• SPF 50: blocks 98% of UVB\n• SPF 100: blocks 99% of UVB\n→ SPF 50+ is recommended for maximum protection\n\n**Mineral vs Chemical:**\n| | Mineral (Zinc Oxide/Ti) | Chemical |\n|---|---|---|\n| Works | Immediately | After 20 min |\n| Feel | Can leave white cast | Invisible, elegant |\n| Best for | Sensitive/rosacea skin | All skin types |\n| Reef-safe | Yes | Often not |\n\n**Reapplication rules:**\n• Indoors: Once in the morning is fine\n• Outdoors: Reapply every 90–120 minutes, or after sweating/swimming\n\n**Amount:** 1/4 teaspoon for the face — most people apply 25% of the needed amount.",
    followUp: "Do you struggle with white cast, or finding one that doesn't cause breakouts?",
    related: ["anti_aging", "hyperpigmentation", "oily_skin"],
  },
  {
    id: "barrier_repair",
    keywords: [
      { word: "barrier", weight: 3 }, { word: "skin barrier", weight: 3 }, { word: "ceramide", weight: 3 },
      { word: "compromised", weight: 2 }, { word: "over-exfoliated", weight: 3 }, { word: "stripped", weight: 2 },
    ],
    response: () =>
      "Skin barrier damage (compromised stratum corneum) is extremely common from over-exfoliation, harsh cleansers, or retinoid misuse.\n\n**Signs of barrier damage:**\n• Stinging from products that didn't irritate before\n• Sudden sensitivity or redness\n• Tight, dry, flaky skin that doesn't respond to moisturiser\n• Breakouts despite not changing routine\n\n**Recovery protocol:**\n1. Stop all actives immediately (AHA, BHA, retinoids, vitamin C)\n2. Switch to a gentle, fragrance-free cream cleanser\n3. Apply ceramide-rich moisturiser 2× daily (look for Ceramide NP, AP, EOP)\n4. Petrolatum or thick balm as a final occlusive layer at night\n5. Mineral SPF only (chemical filter may sting)\n\nBarrier recovers in 2–4 weeks. Reintroduce actives one at a time after recovery.",
    followUp: "How long has your skin been reacting this way, and what products were you using?",
    related: ["sensitive_skin", "dry_skin", "ceramide"],
  },
  {
    id: "professional_treatments",
    keywords: [
      { word: "treatment", weight: 2 }, { word: "laser", weight: 3 }, { word: "peel", weight: 3 },
      { word: "microneedling", weight: 3 }, { word: "chemical peel", weight: 3 }, { word: "ipl", weight: 3 },
      { word: "hydrafacial", weight: 3 }, { word: "dermaplaning", weight: 3 }, { word: "professional", weight: 2 },
    ],
    response: () =>
      "Professional treatments ranked by concern:\n\n**Pigmentation & Uneven Tone:**\n• IPL Photofacial — targets melanin and vascularity (2–3 sessions)\n• Q-switched Nd:YAG — deep pigment (melasma, age spots)\n• Chemical peel (glycolic 30–70% or Jessner) — 4–6 sessions\n\n**Texture & Pores:**\n• Microneedling (1.5mm) — collagen induction, 3–6 sessions\n• Fraxel/CO2 fractional laser — most effective for texture (downtime: 5–10 days)\n• RF Microneedling (Morpheus8) — skin tightening + texture\n\n**Acne & Oily Skin:**\n• BHA peels — deeper pore cleansing\n• PDT (photodynamic therapy) — severe acne\n• HydraFacial — maintenance, hydration\n\n**Scarring:**\n• Subcision + filler — rolling scars\n• TCA CROSS — icepick scars\n• Fractional ablative laser — all scar types\n\nAlways consult a board-certified dermatologist before booking.",
    followUp: "Which concern are you hoping to address with a professional treatment?",
    related: ["acne_scars", "hyperpigmentation", "anti_aging"],
  },
  {
    id: "routine_building",
    keywords: [
      { word: "routine", weight: 3 }, { word: "order", weight: 2 }, { word: "steps", weight: 2 },
      { word: "layering", weight: 3 }, { word: "what order", weight: 3 }, { word: "build a routine", weight: 3 },
      { word: "start a routine", weight: 3 }, { word: "beginner", weight: 2 },
    ],
    response: (ctx) => {
      const skinNote = ctx.skinType
        ? `Since you have ${ctx.skinType} skin, I've tailored this:`
        : "A universal framework — adjust products for your skin type:"
      return `${skinNote}\n\n**Morning (protect & treat):**\n1. Gentle cleanser\n2. Vitamin C serum (antioxidant protection)\n3. Hydrating serum (hyaluronic acid or niacinamide)\n4. Moisturiser\n5. SPF 50+ (always last, always)\n\n**Evening (repair & renew):**\n1. Cleanser (double cleanse if you wear SPF/makeup)\n2. Hydrating toner or essence\n3. Actives (retinoid OR AHA/BHA — not both at once)\n4. Moisturiser\n5. Optional: facial oil or occlusive\n\n**Rules:**\n• Thin → thick consistency order\n• Introduce one new active every 3–4 weeks\n• pH matters: actives at 3–4, apply before moisturiser\n• Retinoids and AHA/BHA on alternate nights if using both`
    },
    followUp: "Are you starting from scratch, or looking to upgrade an existing routine?",
    related: ["retinol", "vitamin_c", "sunscreen", "niacinamide"],
  },
]

const SUGGESTED_QUESTIONS = [
  "Best routine for combination skin?",
  "How to reduce fine lines?",
  "How to treat acne scars?",
  "Botox vs fillers — what's the difference?",
  "How to build an anti-aging routine?",
  "How to fade dark spots fast?",
  "Is retinol safe for sensitive skin?",
  "How to minimise enlarged pores?",
  "How do I repair my skin barrier?",
]

// ─── Intent Engine ─────────────────────────────────────────────────────────────

function scoreNode(node: KnowledgeNode, input: string): number {
  const lower = input.toLowerCase()
  return node.keywords.reduce((score, { word, weight }) => {
    return lower.includes(word) ? score + weight : score
  }, 0)
}

function detectSkinType(input: string): ConversationContext["skinType"] | undefined {
  const lower = input.toLowerCase()
  if (lower.includes("oily") || lower.includes("greasy")) return "oily"
  if (lower.includes("dry") || lower.includes("dehydrated") || lower.includes("flaky")) return "dry"
  if (lower.includes("combination") || lower.includes("mixed")) return "combination"
  if (lower.includes("sensitive") || lower.includes("reactive") || lower.includes("rosacea")) return "sensitive"
  if (lower.includes("normal")) return "normal"
  return undefined
}

function resolveResponse(input: string, ctx: ConversationContext): { text: string; followUp?: string; newCtx: ConversationContext } {
  const lower = input.toLowerCase()

  // Score all nodes
  const scored = KNOWLEDGE_BASE
    .map((node) => ({ node, score: scoreNode(node, input) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  const newCtx: ConversationContext = {
    ...ctx,
    skinType: detectSkinType(input) ?? ctx.skinType,
    concerns: [...ctx.concerns],
    mentionedTopics: [...ctx.mentionedTopics, ...scored.slice(0, 2).map((s) => s.node.id)],
    turnCount: ctx.turnCount + 1,
  }

  // Match found
  if (scored.length > 0) {
    const top = scored[0]
    const response = top.node.response(newCtx)
    const followUp = top.node.followUp
    return { text: response, followUp, newCtx }
  }

  // Context-aware fallback — uses skin type if known
  const skinTypeHint = newCtx.skinType
    ? ` Since you have ${newCtx.skinType} skin, I can give you targeted advice on that.`
    : ""

  const fallback = ctx.turnCount === 0
    ? `Hi! I'm Dr. Ava, your AI skincare advisor. I have deep knowledge of skin science, ingredients, and treatments — but I need a bit more detail to help you well.${skinTypeHint}\n\nTry asking about:\n• A specific skin concern (acne, dark spots, wrinkles, dryness)\n• An ingredient (retinol, vitamin C, niacinamide)\n• A treatment (microneedling, chemical peel, Botox)\n• How to build or optimise a routine`
    : `Could you clarify a bit more? I couldn't find a confident match for "${input}".${skinTypeHint}\n\nTopics I cover well: acne, scarring, hyperpigmentation, anti-aging, skin barrier, pores, retinoids, SPF, professional treatments, and routine building.`

  return { text: fallback, newCtx }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  followUp?: string
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AIConsultationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Dr. Ava, your AI dermatology advisor. I have in-depth knowledge of skin science, ingredients, and evidence-based treatments.\n\nAsk me anything — skin concerns, routines, ingredients, or professional treatments. What would you like to know?",
    },
  ])
  const [ctx, setCtx] = useState<ConversationContext>({
    concerns: [],
    mentionedTopics: [],
    turnCount: 0,
  })
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const [voiceStatus, setVoiceStatus] = useState("Ready for English voice input")
  const [interimTranscript, setInterimTranscript] = useState("")
  const recognitionRef = useRef<any>(null)
  const voiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ignoreNextVoiceEndRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Check browser speech support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSpeechSupported(!!SpeechRecognition)

    return () => {
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
      if (recognitionRef.current) recognitionRef.current.abort()
    }
  }, [])

  const startListening = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMicError("Voice input needs Chrome or Edge because this browser does not support speech recognition.")
      return
    }

    setMicError(null)
    setInterimTranscript("")
    setVoiceStatus("Requesting microphone access...")

    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ audio: true })
      stream?.getTracks().forEach((track) => track.stop())
    } catch {
      setVoiceStatus("Microphone permission blocked")
      setMicError("Microphone access denied. Allow microphone permission in the browser address bar, then try again.")
      return
    }

    if (recognitionRef.current) recognitionRef.current.abort()

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.continuous = true

    const startingText = input.trim()
    let committedTranscript = ""
    let latestCombined = startingText

    const updateInput = (interim = "") => {
      const parts = [startingText, committedTranscript, interim].filter(Boolean)
      latestCombined = parts.join(" ").replace(/\s+/g, " ").trim()
      setInput(latestCombined)
      setInterimTranscript(interim)
    }

    recognition.onstart = () => {
      setIsListening(true)
      setVoiceStatus("Listening in English...")
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
      voiceTimerRef.current = setTimeout(() => {
        recognition.stop()
      }, 15000)
    }

    recognition.onresult = (event: any) => {
      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim()
        if (event.results[i].isFinal) {
          committedTranscript = `${committedTranscript} ${transcript}`.replace(/\s+/g, " ").trim()
        } else {
          interim = `${interim} ${transcript}`.trim()
        }
      }
      updateInput(interim)
      setVoiceStatus(interim ? "Recognising..." : "Captured. Keep speaking or stop.")
    }

    recognition.onerror = (event: any) => {
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
      setIsListening(false)
      setInterimTranscript("")
      if (ignoreNextVoiceEndRef.current && event.error === "aborted") {
        return
      }
      const messages: Record<string, string> = {
        "not-allowed":           "Microphone access denied. Click the lock icon in your browser address bar, allow microphone, then refresh.",
        "no-speech":             "No speech detected. Please speak clearly and try again.",
        "audio-capture":         "No microphone found. Please connect a microphone and try again.",
        "network":               "Network required for voice recognition in Chrome. You can still type your question below.",
        "aborted":               "Recording stopped. Click the mic button to try again.",
        "service-not-allowed":   "Speech service blocked. Please check your browser or system microphone permissions.",
        "language-not-supported":"English (en-US) is not supported in this browser. Try Chrome or Edge.",
        "bad-grammar":           "Speech recognition error. Please try again.",
      }
      const msg = messages[event.error]
        ?? `Voice error (${event.error}). Please type your question instead.`
      setMicError(msg)
      setVoiceStatus("Voice input stopped")
    }

    recognition.onend = () => {
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
      setIsListening(false)
      setInterimTranscript("")
      if (ignoreNextVoiceEndRef.current) {
        ignoreNextVoiceEndRef.current = false
        setVoiceStatus("Ready for English voice input")
        recognitionRef.current = null
        return
      }
      setInput(latestCombined)
      setVoiceStatus(latestCombined ? "Voice captured. Edit or send your question." : "Ready for English voice input")
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch {
      setMicError("Voice input is already starting. Please wait a second and try again.")
      setVoiceStatus("Ready for English voice input")
    }
  }

  const stopListening = () => {
    if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setVoiceStatus("Voice captured. Edit or send your question.")
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const submit = (text: string) => {
    const messageText = text.trim()
    if (!messageText || isTyping) return

    if (recognitionRef.current) {
      ignoreNextVoiceEndRef.current = true
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
      recognitionRef.current.abort()
      recognitionRef.current = null
      setIsListening(false)
      setInterimTranscript("")
      setVoiceStatus("Ready for English voice input")
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: messageText }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate thinking time proportional to response complexity
    const thinkTime = 600 + Math.min(messageText.length * 8, 1200)

    setTimeout(() => {
      const { text: responseText, followUp, newCtx } = resolveResponse(messageText, ctx)
      setCtx(newCtx)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseText,
          followUp,
        },
      ])
      setIsTyping(false)
    }, thinkTime)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit(input)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#f5f4f8] overflow-hidden">

      {/* Top bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#1a1025] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-300" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-none">Dr. Ava</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">AI Dermatology Advisor · Knowledge-based engine</p>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-5 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-violet-400" />
              50+ skincare topics
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-violet-400" />
              Context-aware responses
            </span>
            <span className="text-gray-300">|</span>
            <span>For educational use only</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex gap-4 px-4 md:px-6 py-4 md:py-5">

          {/* Chat */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-w-0">

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className="flex-shrink-0 mt-1">
                    {msg.role === "assistant" ? (
                      <div className="w-8 h-8 rounded-xl bg-[#1a1025] flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-violet-600" />
                      </div>
                    )}
                  </div>

                  <div className={cn("flex flex-col gap-1.5 max-w-[78%]", msg.role === "user" && "items-end")}>
                    <span className="text-[10px] font-semibold text-gray-400 px-1">
                      {msg.role === "assistant" ? "Dr. Ava" : "You"}
                    </span>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                        msg.role === "assistant"
                          ? "bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm"
                          : "bg-[#1a1025] text-white rounded-tr-sm"
                      )}
                    >
                      {msg.content}
                    </div>

                    {/* Follow-up suggestion */}
                    {msg.role === "assistant" && msg.followUp && (
                      <button
                        onClick={() => submit(msg.followUp!)}
                        disabled={isTyping}
                        className="flex items-center gap-1.5 text-[11px] text-violet-500 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-100 rounded-full px-3 py-1.5 transition-colors mt-0.5 self-start"
                      >
                        <ChevronRight className="w-3 h-3" />
                        {msg.followUp}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1a1025] flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 px-1">Dr. Ava</span>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-white">
              {/* Context pills */}
              {ctx.skinType && (
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[10px] text-gray-400">Context:</span>
                  <span className="text-[10px] bg-violet-50 text-violet-600 border border-violet-100 rounded-full px-2.5 py-0.5 font-medium">
                    {ctx.skinType} skin
                  </span>
                </div>
              )}

              {/* Mic error */}
              {micError && (
                <div className="flex items-center gap-2 mb-2.5 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
                  <MicOff className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-[11px] text-red-500">{micError}</p>
                  <button onClick={() => setMicError(null)} className="ml-auto text-red-300 hover:text-red-500 text-xs">x</button>
                </div>
              )}

              {/* Listening indicator */}
              {speechSupported && (
                <div className={cn(
                  "flex items-center gap-2.5 mb-2.5 px-3 py-2 rounded-xl border transition-colors",
                  isListening ? "bg-violet-50 border-violet-100" : "bg-gray-50 border-gray-100"
                )}>
                  <div className="flex gap-0.5 items-center">
                    {[0, 80, 160].map((delay) => (
                      <span
                        key={delay}
                        className={cn("w-0.5 rounded-full", isListening ? "bg-violet-500" : "bg-gray-300")}
                        style={{
                          height: "14px",
                          animationName: isListening ? "voiceBar" : "none",
                          animationDuration: "0.8s",
                          animationTimingFunction: "ease-in-out",
                          animationIterationCount: "infinite",
                          animationDelay: `${delay}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-[11px] font-medium", isListening ? "text-violet-600" : "text-gray-500")}>
                      {voiceStatus}
                    </p>
                    {interimTranscript && (
                      <p className="truncate text-[10px] text-violet-400">"{interimTranscript}"</p>
                    )}
                  </div>
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isTyping}
                    className={cn(
                      "text-[10px] font-semibold",
                      isListening ? "text-violet-500 hover:text-violet-700" : "text-gray-400 hover:text-violet-600"
                    )}
                  >
                    {isListening ? "Stop" : "Start"}
                  </button>
                </div>
              )}

              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Speak in English now..." : "Ask about skin concerns, ingredients, routines... (Enter to send)"}
                  disabled={isTyping}
                  rows={2}
                  className={`flex-1 text-sm border-gray-200 rounded-xl resize-none focus-visible:ring-violet-500 bg-gray-50 leading-relaxed transition-colors ${isListening ? "border-violet-300 bg-violet-50/40" : ""}`}
                />

                {/* Mic button */}
                {speechSupported && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isTyping}
                    title={isListening ? "Stop recording" : "Voice input (English)"}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 transition-all duration-200 border ${
                      isListening
                        ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200"
                        : "bg-white border-gray-200 text-gray-400 hover:border-violet-300 hover:text-violet-500"
                    }`}
                  >
                    {isListening ? (
                      <span className="relative flex items-center justify-center">
                        <span className="absolute w-6 h-6 rounded-full bg-violet-400/30 animate-ping" />
                        <Mic className="h-4 w-4 relative" />
                      </span>
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                )}

                <Button
                  onClick={() => submit(input)}
                  disabled={isTyping || !input.trim()}
                  className="h-10 w-10 p-0 rounded-xl bg-[#1a1025] hover:bg-violet-700 text-white flex-shrink-0 mb-0.5"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {speechSupported && !isListening && (
                <p className="text-[10px] text-gray-300 mt-1.5 text-right">
                  Click <Mic className="inline w-2.5 h-2.5 mx-0.5" /> to speak in English
                </p>
              )}
              {!speechSupported && (
                <p className="text-[10px] text-amber-500 mt-1.5 text-right">
                  Voice input needs Chrome or Edge.
                </p>
              )}
              <style>{`
                @keyframes voiceBar {
                  0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
                  50%       { transform: scaleY(1);   opacity: 1;   }
                }
              `}</style>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:flex flex-col w-60 flex-shrink-0 gap-3">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-violet-500" />
                <h3 className="text-xs font-bold text-gray-900">Popular Questions</h3>
              </div>
              <div className="p-2 space-y-0.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => submit(q)}
                    disabled={isTyping}
                    className="w-full flex items-start gap-2 text-left px-3 py-2.5 rounded-xl text-[11px] text-gray-500 hover:bg-violet-50 hover:text-violet-700 transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1025] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                <h3 className="text-xs font-bold text-white">Expertise</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Acne & breakouts",
                  "Anti-aging & retinoids",
                  "Hyperpigmentation",
                  "Skin barrier repair",
                  "Ingredient science",
                  "Professional treatments",
                  "Routine building",
                  "Sensitive / rosacea",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[11px] text-white/50">
                    <span className="w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
