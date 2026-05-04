export interface Lesson {
  id: string
  title: string
  duration: string
  type: "reading" | "quiz" | "video"
  content: string
  videoUrl?: string // YouTube video URL
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorTitle: string
  instructorAvatar: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  image: string
  rating: number
  students: number
  price: number
  lessons: Lesson[]
  whatYouLearn: string[]
  requirements: string[]
  recommendedProducts: string[] // Product IDs
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Skincare Fundamentals: Complete Beginner's Guide",
    description:
      "Master the basics of skincare with this comprehensive course. Learn about skin types, proper cleansing techniques, building your first skincare routine, and understanding how different products work. Perfect for anyone starting their skincare journey or looking to build a solid foundation.",
    instructor: "Dr. Sarah Chen",
    instructorTitle: "Board-Certified Dermatologist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "4 hours",
    level: "Beginner",
    category: "Basics",
    image: "/skincare-basics-course.jpg",
    rating: 4.9,
    students: 12543,
    price: 0,
    lessons: [
      {
        id: "1-1",
        title: "Understanding Your Skin Type",
        duration: "15 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=y3mNfNpXJqw",
        content:
          "Learn how to identify your skin type (normal, dry, oily, combination, or sensitive) and understand its unique characteristics and needs. We'll cover the Fitzpatrick scale, how to perform a skin type test at home, and why your skin type matters for product selection.",
      },
      {
        id: "1-2",
        title: "The Science of Skin Layers",
        duration: "10 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=Dy0dAhIRvjU",
        content:
          "Explore the three main layers of skin: epidermis, dermis, and hypodermis. The epidermis is your skin's protective outer layer, the dermis contains collagen and elastin for structure, and the hypodermis provides cushioning.",
      },
      {
        id: "1-3",
        title: "Cleansing: The Foundation of Skincare",
        duration: "12 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=qv0HlFl8cAo",
        content:
          "Master proper cleansing techniques using lukewarm water and gentle, nonmedicated cleansers. Learn about different cleanser types: foaming for oily skin, cream-based for dry/sensitive skin, and gel for combination skin.",
      },
      {
        id: "1-4",
        title: "Building Your First Routine",
        duration: "20 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=gKJ8KLtSg5c",
        content:
          "Create a dermatologist-approved routine with 5 essential products: cleanser, antioxidant serum (like vitamin C), moisturizer, sunscreen (SPF 30+), and night treatment. Morning routine: cleanse, apply vitamin C serum, moisturize, and apply SPF.",
      },
      {
        id: "1-5",
        title: "Common Skincare Mistakes to Avoid",
        duration: "14 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=R1iqIoJfMpg",
        content:
          "Discover the most common skincare mistakes: Over-exfoliating, using too many products at once, skipping SPF, not removing makeup before cleansing, using hot water, and picking at skin.",
      },
      {
        id: "1-6",
        title: "Knowledge Check",
        duration: "10 min",
        type: "quiz",
        content:
          "Test your understanding of skincare fundamentals with this comprehensive quiz covering skin types, layers, cleansing techniques, and routine building.",
      },
    ],
    whatYouLearn: [
      "Identify your skin type accurately and understand its needs",
      "Understand skin anatomy and how products work at different layers",
      "Master proper cleansing techniques using lukewarm water and gentle products",
      "Build a dermatologist-approved 5-product routine that works",
      "Avoid common beginner mistakes that damage skin",
      "Choose the right products for your specific skin type and concerns",
    ],
    requirements: [
      "No prior skincare knowledge required",
      "Willingness to learn and experiment with products",
      "Basic commitment to daily skincare routine",
    ],
    recommendedProducts: ["1", "4", "7", "10"],
  },
  {
    id: "2",
    title: "Anti-Aging Skincare Masterclass",
    description:
      "Advanced strategies for preventing and treating signs of aging. Learn about retinoids, peptides, antioxidants, and proven anti-aging ingredients backed by dermatologists. Discover how to build a comprehensive anti-aging routine that addresses fine lines, wrinkles, loss of firmness, and age spots.",
    instructor: "Dr. Michael Park",
    instructorTitle: "Anti-Aging Specialist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "6 hours",
    level: "Advanced",
    category: "Anti-Aging",
    image: "/anti-aging-skincare-course.jpg",
    rating: 4.8,
    students: 8932,
    price: 79,
    lessons: [
      {
        id: "2-1",
        title: "The Science of Skin Aging",
        duration: "18 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=zIR2F86WHIM",
        content:
          "Understand intrinsic aging (genetic, natural decline) vs extrinsic aging (environmental damage). Collagen makes up 70-80% of our skin and provides structure and firmness.",
      },
      {
        id: "2-2",
        title: "Retinoids: The Gold Standard",
        duration: "22 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=Dy0dAhIRvjU",
        content:
          "Dermatologists consider retinoids the most effective anti-aging ingredient, second only to sunscreen. Learn the proper way to use retinol and build tolerance.",
      },
      {
        id: "2-3",
        title: "Peptides and Growth Factors",
        duration: "15 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=FmOfvJB5eok",
        content:
          "Peptides are chains of amino acids that act as signaling molecules, stimulating collagen production for firmer, younger-looking skin.",
      },
      {
        id: "2-4",
        title: "Antioxidants for Prevention",
        duration: "16 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=qv0HlFl8cAo",
        content:
          "Antioxidants neutralize free radicals and prevent premature aging. Vitamin C serum reinforces sunscreen and reduces hyperpigmentation.",
      },
      {
        id: "2-5",
        title: "Advanced Treatment Techniques",
        duration: "20 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=lPFXnGp4hag",
        content:
          "Professional treatments complement at-home care: Chemical peels, microneedling, laser therapy, radiofrequency, and ultrasound treatments.",
      },
      {
        id: "2-6",
        title: "Building Your Anti-Aging Routine",
        duration: "18 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=y3mNfNpXJqw",
        content:
          "Create a comprehensive routine: Morning - gentle cleanser, vitamin C serum, peptide serum, moisturizer, SPF 30+. Evening - cleanser, retinoid, peptide serum, moisturizer.",
      },
      {
        id: "2-7",
        title: "Final Assessment",
        duration: "15 min",
        type: "quiz",
        content:
          "Comprehensive test on anti-aging skincare strategies, ingredient mechanisms, proper usage protocols, and treatment timing.",
      },
    ],
    whatYouLearn: [
      "Understand the biology of skin aging including collagen breakdown and free radical damage",
      "Master retinoid usage with proper tolerance-building protocols",
      "Combine multiple anti-aging actives (retinoids, peptides, antioxidants) safely",
      "Choose effective peptides and antioxidants for specific concerns",
      "Understand professional treatment options and optimal timing",
      "Create a comprehensive anti-aging routine that delivers visible results in 3-6 months",
    ],
    requirements: [
      "Basic skincare knowledge recommended",
      "Understanding of skincare ingredients helpful",
      "Commitment to consistent routine for 3-6 months to see results",
    ],
    recommendedProducts: ["2", "3", "11", "14", "17"],
  },
  {
    id: "3",
    title: "Acne Treatment & Prevention Protocol",
    description:
      "Evidence-based strategies for treating and preventing acne using dermatologist-recommended ingredients. Learn about salicylic acid, benzoyl peroxide, retinoids, and professional treatments for clear, healthy skin.",
    instructor: "Dr. Emily Rodriguez",
    instructorTitle: "Acne Specialist & Dermatologist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "5 hours",
    level: "Intermediate",
    category: "Acne",
    image: "/acne-treatment-course.jpg",
    rating: 4.9,
    students: 15678,
    price: 59,
    lessons: [
      {
        id: "3-1",
        title: "Understanding Acne Formation",
        duration: "16 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=gKJ8KLtSg5c",
        content:
          "Learn about the four factors of acne: excess sebum production, clogged pores from dead skin cells, bacteria proliferation, and inflammation.",
      },
      {
        id: "3-2",
        title: "Types of Acne Lesions",
        duration: "12 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=R1iqIoJfMpg",
        content:
          "Identify different acne types: Non-inflammatory (blackheads, whiteheads) vs Inflammatory (papules, pustules, nodules, cysts).",
      },
      {
        id: "3-3",
        title: "Salicylic Acid Deep Dive",
        duration: "14 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=FmOfvJB5eok",
        content:
          "Salicylic acid is a beta hydroxy acid (BHA) that exfoliates skin and unclogs pores. Best for blackheads, whiteheads, and clogged pores.",
      },
      {
        id: "3-4",
        title: "Benzoyl Peroxide Protocol",
        duration: "11 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=zIR2F86WHIM",
        content:
          "Benzoyl peroxide kills acne-causing bacteria and reduces inflammation. Most effective for inflammatory acne like red pimples and cystic acne.",
      },
      {
        id: "3-5",
        title: "Retinoids for Acne",
        duration: "18 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=Dy0dAhIRvjU",
        content:
          "Retinoids prevent clogged pores by increasing cell turnover. Learn about Adapalene (Differin) and Tretinoin for acne treatment.",
      },
      {
        id: "3-6",
        title: "Lifestyle Factors & Diet",
        duration: "15 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=lPFXnGp4hag",
        content:
          "Explore the connection between lifestyle and acne: diet, stress, sleep, exercise, and skincare habits.",
      },
      {
        id: "3-7",
        title: "Post-Acne Scarring Treatment",
        duration: "17 min",
        type: "video",
        videoUrl: "https://www.youtube.com/watch?v=qv0HlFl8cAo",
        content:
          "Learn strategies for treating acne scars and hyperpigmentation including PIH, PIE, and atrophic scars.",
      },
      {
        id: "3-8",
        title: "Course Assessment",
        duration: "15 min",
        type: "quiz",
        content:
          "Test your knowledge of acne formation, treatment ingredients, and proper usage protocols.",
      },
    ],
    whatYouLearn: [
      "Understand the four factors of acne formation",
      "Use salicylic acid effectively for clogged pores and blackheads",
      "Apply benzoyl peroxide correctly to kill bacteria and reduce inflammation",
      "Incorporate retinoids into acne treatment for prevention",
      "Address lifestyle factors that affect acne (diet, stress, sleep)",
      "Treat post-acne scarring and hyperpigmentation",
    ],
    requirements: [
      "Basic understanding of skincare",
      "Willingness to be consistent with treatment for 6-12 weeks",
      "Patience for results - acne treatment takes time",
    ],
    recommendedProducts: ["5", "8", "12", "15", "20"],
  },
  {
    id: "4",
    title: "Hydration & Moisture Barrier Repair",
    description:
      "Learn how to deeply hydrate your skin and repair damaged moisture barriers. Perfect for dry, dehydrated, or compromised skin.",
    instructor: "Dr. Lisa Wang",
    instructorTitle: "Hydration & Barrier Specialist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "4.5 hours",
    level: "Intermediate",
    category: "Hydration",
    image: "/hydration-skincare-course.jpg",
    rating: 4.8,
    students: 9876,
    price: 49,
    lessons: [
      {
        id: "4-1",
        title: "Hydration vs Moisture: The Difference",
        duration: "20 min",
        type: "reading",
        content:
          "Understand the crucial difference between hydration (water content) and moisture (oil content) in skincare. Hydration refers to water in the skin, while moisture refers to the lipid barrier that prevents water loss. Both are essential for healthy, plump skin. Dehydrated skin lacks water and feels tight, while dry skin lacks oil and may be flaky.",
      },
      {
        id: "4-2",
        title: "The Skin Barrier Explained",
        duration: "30 min",
        type: "reading",
        content:
          "Learn about the stratum corneum and lipid barrier that protects your skin. The barrier is made of ceramides (50% of barrier lipids), cholesterol, and fatty acids arranged in a 'brick and mortar' structure. When compromised, skin becomes sensitive, dry, and prone to irritation. Signs of damaged barrier include redness, flaking, stinging, and increased sensitivity.",
      },
      {
        id: "4-3",
        title: "Hyaluronic Acid Mastery",
        duration: "35 min",
        type: "reading",
        content:
          "Master the use of hyaluronic acid (HA) in different molecular weights for optimal hydration. HA is a humectant that draws water into the skin. Apply to damp skin to prevent it from drawing water *out* of your skin. Seal with an occlusive moisturizer. Learn about other humectants like glycerin, panthenol (vitamin B5), and aloe vera.",
      },
      {
        id: "4-4",
        title: "Choosing the Right Moisturizer",
        duration: "30 min",
        type: "reading",
        content:
          "Select the perfect moisturizer based on your skin type and climate. Gel moisturizers (water-based) are best for oily skin. Lotions (lightweight) suit normal/combination skin. Creams (oil-based) are ideal for dry skin. Ointments/balms (heavier) are for very dry or cracked skin. Look for key ingredients: ceramides, fatty acids, squalane, and shea butter.",
      },
      {
        id: "4-5",
        title: "Repairing a Damaged Barrier",
        duration: "40 min",
        type: "reading",
        content:
          "Protocol for healing a compromised barrier: 1) Stop all actives (acids, retinoids, scrubs), 2) Switch to a gentle, non-foaming cleanser, 3) Use a barrier-repair cream with ceramides, cholesterol, and fatty acids, 4) Avoid hot water and harsh towels, 5) Simplify routine to just cleanse, moisturize, and SPF. Healing typically takes 2-4 weeks. Reintroduce actives slowly once skin is fully healed.",
      },
      {
        id: "4-6",
        title: "Humectants, Emollients & Occlusives",
        duration: "35 min",
        type: "reading",
        content:
          "Learn the three types of moisturizing ingredients and how to layer them. Humectants (hyaluronic acid, glycerin) attract water. Emollients (squalane, fatty acids) soften and smooth. Occlusives (petrolatum, dimethicone) seal in moisture. Proper layering: humectant on damp skin → emollient → occlusive. This creates a complete hydration system that attracts, retains, and locks in moisture for all-day hydration.",
      },
      {
        id: "4-7",
        title: "Knowledge Assessment",
        duration: "15 min",
        type: "quiz",
        content:
          "Test your understanding of hydration, moisture barrier function, and repair protocols. Questions cover the difference between hydration and moisture, ceramide function, proper layering techniques, and barrier repair strategies.",
      },
    ],
    whatYouLearn: [
      "Distinguish between hydration and moisture",
      "Understand skin barrier function",
      "Use hyaluronic acid effectively",
      "Repair damaged moisture barriers",
      "Layer moisturizing ingredients properly",
      "Create a barrier-supporting routine",
    ],
    requirements: [
      "Basic skincare knowledge helpful",
      "Understanding of product layering",
      "Commitment to gentle skincare",
    ],
    recommendedProducts: ["1", "6", "9", "13", "16"],
  },
  {
    id: "5",
    title: "Brightening & Hyperpigmentation Treatment",
    description:
      "Master the art of treating dark spots, melasma, and uneven skin tone. Learn about vitamin C, niacinamide, and other brightening agents.",
    instructor: "Dr. James Kim",
    instructorTitle: "Pigmentation Specialist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "5.5 hours",
    level: "Advanced",
    category: "Brightening",
    image: "/brightening-skincare-course.jpg",
    rating: 4.9,
    students: 11234,
    price: 69,
    lessons: [
      {
        id: "5-1",
        title: "Understanding Melanin Production",
        duration: "30 min",
        type: "reading",
        content:
          "Learn how melanin is produced through the tyrosinase enzyme pathway and what causes hyperpigmentation. Melanin is produced by melanocytes in response to UV exposure, hormones, or inflammation. Excess melanin leads to dark spots, uneven tone, and hyperpigmentation. Understanding this process helps you choose ingredients that interrupt melanin production at different stages.",
      },
      {
        id: "5-2",
        title: "Types of Hyperpigmentation",
        duration: "25 min",
        type: "reading",
        content:
          "Identify different types: PIH (post-inflammatory hyperpigmentation - brown/dark spots after acne or injury), PIE (post-inflammatory erythema - red/pink marks from inflammation), melasma (hormonal patches on cheeks/forehead), sun spots (UV-induced dark spots), and age spots (cumulative sun damage). Each type requires different treatment approaches and timelines.",
      },
      {
        id: "5-3",
        title: "Vitamin C: The Brightening Powerhouse",
        duration: "45 min",
        type: "reading",
        content:
          "Master vitamin C usage, forms (L-ascorbic acid is most potent), concentrations (10-20% effective), and stability (needs pH below 3.5). Vitamin C inhibits tyrosinase enzyme, reducing melanin production. It also neutralizes free radicals and boosts collagen. Apply in morning before sunscreen for maximum protection. Look for products with ferulic acid and vitamin E for enhanced stability and efficacy. Store in cool, dark place to prevent oxidation.",
      },
      {
        id: "5-4",
        title: "Niacinamide for Even Tone",
        duration: "35 min",
        type: "reading",
        content:
          "Learn how niacinamide (vitamin B3) reduces pigmentation by decreasing melanin transfer from melanocytes to keratinocytes, making dark spots less visible. It also has anti-inflammatory properties, strengthens skin barrier, controls oil, and soothes irritation. Use 5-10% concentration. Safe for sensitive, acne-prone, and oily skin. Can be combined with vitamin C despite old myths. Apply morning and evening before moisturizer.",
      },
      {
        id: "5-5",
        title: "Alpha Arbutin & Kojic Acid",
        duration: "30 min",
        type: "reading",
        content:
          "Explore these powerful tyrosinase inhibitors for brightening. Alpha arbutin is a stable, gentle alternative to hydroquinone that gradually fades dark spots. Kojic acid is derived from mushrooms and inhibits melanin production. Both are effective for melasma and sun spots. Use 1-2% alpha arbutin and 1-4% kojic acid. Combine with vitamin C and niacinamide for enhanced results. Always use SPF 30+ as these ingredients increase photosensitivity.",
      },
      {
        id: "5-6",
        title: "Chemical Exfoliation for Brightness",
        duration: "40 min",
        type: "reading",
        content:
          "Use AHAs (glycolic, lactic, mandelic acids) to fade dark spots and reveal brighter skin by removing pigmented dead skin cells. AHAs work on skin surface, accelerating cell turnover. Glycolic acid (smallest molecule) penetrates deepest. Lactic acid is gentler for sensitive skin. Mandelic acid is best for darker skin tones. Start with 5-8% concentration 2-3x per week. Increase gradually. Always use SPF as AHAs increase sun sensitivity.",
      },
      {
        id: "5-7",
        title: "Sun Protection: The Key to Success",
        duration: "35 min",
        type: "reading",
        content:
          "Understand why SPF 30+ broad-spectrum sunscreen is crucial for treating and preventing pigmentation. UV exposure triggers melanin production, darkening existing spots and creating new ones. Without daily SPF, brightening treatments are ineffective. Apply 1/4 teaspoon for face, reapply every 2 hours when outdoors. Look for sunscreens with iron oxide for visible light protection (important for melasma). Mineral sunscreens with zinc oxide provide best protection.",
      },
      {
        id: "5-8",
        title: "Professional Treatments",
        duration: "30 min",
        type: "reading",
        content:
          "Learn about laser treatments (targets melanin with light energy), chemical peels (removes pigmented layers), microneedling with brightening serums (enhances product penetration), and IPL (intense pulsed light for sun damage). Professional treatments accelerate results but require downtime (3-7 days) and multiple sessions (4-6 treatments). Best for stubborn melasma, deep sun damage, or when topicals plateau. Always consult board-certified dermatologist.",
      },
      {
        id: "5-9",
        title: "Final Exam",
        duration: "20 min",
        type: "quiz",
        content:
          "Comprehensive assessment of brightening and pigmentation treatment covering melanin production, ingredient mechanisms, proper usage protocols, and when to seek professional help.",
      },
    ],
    whatYouLearn: [
      "Understand melanin production and pigmentation",
      "Use vitamin C effectively for brightening",
      "Incorporate niacinamide into your routine",
      "Combine multiple brightening ingredients safely",
      "Protect skin from further pigmentation",
      "Know when to seek professional treatments",
    ],
    requirements: [
      "Intermediate skincare knowledge",
      "Understanding of active ingredients",
      "Commitment to daily sun protection",
    ],
    recommendedProducts: ["3", "5", "11", "18", "22"],
  },
  {
    id: "6",
    title: "Sensitive Skin Care Essentials",
    description:
      "Learn how to care for sensitive, reactive, and rosacea-prone skin. Discover gentle yet effective ingredients and routines.",
    instructor: "Dr. Anna Martinez",
    instructorTitle: "Sensitive Skin Specialist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "4 hours",
    level: "Beginner",
    category: "Sensitive Skin",
    image: "/sensitive-skin-care-course.jpg",
    rating: 4.9,
    students: 13456,
    price: 39,
    lessons: [
      {
        id: "6-1",
        title: "What Makes Skin Sensitive?",
        duration: "25 min",
        type: "reading",
        content:
          "Understand the causes of skin sensitivity and reactivity. Sensitive skin has a weakened barrier, making it more susceptible to irritants like fragrances, alcohol, sulfates, and harsh actives. Causes include genetics, environmental factors, over-exfoliation, harsh products, and underlying conditions like rosacea or eczema. Symptoms include redness, itching, burning, stinging, dryness, and visible blood vessels.",
      },
      {
        id: "6-2",
        title: "Identifying Triggers",
        duration: "20 min",
        type: "reading",
        content:
          "Learn to identify common irritants and allergens in skincare. Top triggers: fragrances (synthetic and natural), essential oils, alcohol denat, sulfates (SLS, SLES), harsh physical scrubs, high-concentration actives, hot water, and over-cleansing. Keep a skincare diary to track reactions. Perform patch tests on inner arm for 24-48 hours before using new products on face. Introduce one new product at a time.",
      },
      {
        id: "6-3",
        title: "Gentle Cleansing Methods",
        duration: "30 min",
        type: "reading",
        content:
          "Master gentle cleansing techniques that won't irritate sensitive skin. Use lukewarm water (never hot), gentle fingertips (no washcloths or brushes), and fragrance-free, sulfate-free cleansers. Best cleansers: CeraVe Hydrating Cleanser, Vanicream Gentle Facial Cleanser, La Roche-Posay Toleriane, Cetaphil Gentle Skin Cleanser. Cleanse once daily (evening), just rinse with water in morning. Pat dry with soft towel, never rub.",
      },
      {
        id: "6-4",
        title: "Soothing Ingredients",
        duration: "35 min",
        type: "reading",
        content:
          "Discover centella asiatica (cica - reduces inflammation and redness), allantoin (soothes and heals), colloidal oatmeal (calms itching), niacinamide (strengthens barrier), ceramides (repairs barrier), aloe vera (cooling and anti-inflammatory), and green tea (antioxidant and calming). These ingredients reduce reactivity and strengthen skin over time. Look for products with multiple soothing ingredients for best results.",
      },
      {
        id: "6-5",
        title: "Building a Minimal Routine",
        duration: "30 min",
        type: "reading",
        content:
          "Create an effective minimal routine that won't overwhelm sensitive skin. Essential 4 steps: 1) Gentle cleanser (evening only), 2) Hydrating serum with hyaluronic acid and prebiotics, 3) Barrier repair moisturizer with ceramides, 4) Mineral SPF 30+ (zinc oxide or titanium dioxide). Avoid unnecessary extras like toners, multiple serums, or harsh actives. Keep it simple for 4-6 weeks before adding anything new.",
      },
      {
        id: "6-6",
        title: "Managing Rosacea",
        duration: "25 min",
        type: "reading",
        content:
          "Special considerations for rosacea-prone skin. Rosacea causes persistent redness, visible blood vessels, and inflammatory bumps. Avoid triggers: hot beverages, spicy foods, alcohol, extreme temperatures, stress. Use azelaic acid (anti-inflammatory and antibacterial), niacinamide (reduces redness), and green-tinted primers (color-corrects redness). Mineral SPF is essential. Consider prescription treatments like metronidazole or ivermectin if severe.",
      },
      {
        id: "6-7",
        title: "Assessment",
        duration: "15 min",
        type: "quiz",
        content:
          "Test your knowledge of sensitive skin care, trigger identification, gentle cleansing methods, soothing ingredients, and rosacea management.",
      },
    ],
    whatYouLearn: [
      "Understand sensitive skin causes",
      "Identify and avoid triggers",
      "Use gentle cleansing methods",
      "Choose soothing ingredients",
      "Build a minimal effective routine",
      "Manage rosacea and reactivity",
    ],
    requirements: ["No prior knowledge required", "Willingness to simplify routine", "Patience with skin healing"],
    recommendedProducts: ["4", "7", "10", "19", "24"],
  },
  {
    id: "7",
    title: "Skincare Ingredients Decoded",
    description:
      "Comprehensive guide to understanding skincare ingredients. Learn to read labels, understand concentrations, and choose effective products.",
    instructor: "Dr. Robert Chen",
    instructorTitle: "Cosmetic Chemist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "6 hours",
    level: "Intermediate",
    category: "Ingredients",
    image: "/skincare-ingredients-course.jpg",
    rating: 4.8,
    students: 10987,
    price: 59,
    lessons: [
      {
        id: "7-1",
        title: "How to Read Ingredient Lists",
        duration: "30 min",
        type: "reading",
        content:
          "Master the art of reading and understanding INCI (International Nomenclature of Cosmetic Ingredients) lists. Ingredients are listed in descending order by concentration, with those above 1% listed first, followed by those below 1% in any order. Learn to identify active ingredients vs fillers, understand common ingredient names, and spot marketing tricks. The first 5-7 ingredients make up the bulk of the formula.",
      },
      {
        id: "7-2",
        title: "Active Ingredients vs Inactive",
        duration: "25 min",
        type: "reading",
        content:
          "Understand the difference between active ingredients (retinol, vitamin C, acids) that create visible changes and inactive ingredients (water, preservatives, emulsifiers) that support the formula. Active ingredients need specific concentrations and pH levels to work effectively. Learn which actives address specific concerns and how to verify if a product contains effective amounts.",
      },
      {
        id: "7-3",
        title: "Retinoids Family Deep Dive",
        duration: "45 min",
        type: "reading",
        content:
          "Explore all retinoid types from weakest to strongest: retinyl palmitate (weakest, good for beginners), retinol (OTC, effective for anti-aging), retinaldehyde (faster-acting than retinol), adapalene (OTC, FDA-approved for acne), and tretinoin (prescription, most potent). Each converts to retinoic acid at different rates. Learn which form suits your skin tolerance and concerns, proper usage protocols, and how to build tolerance gradually.",
      },
      {
        id: "7-4",
        title: "AHAs and BHAs Explained",
        duration: "40 min",
        type: "reading",
        content:
          "Learn about alpha hydroxy acids (water-soluble, work on surface): glycolic acid (smallest molecule, penetrates deepest, 5-10% effective), lactic acid (gentler, hydrating, 5-10%), mandelic acid (largest molecule, best for sensitive/darker skin, 5-10%). Beta hydroxy acid (oil-soluble, penetrates pores): salicylic acid (0.5-2% for acne, blackheads). Understand pH requirements (3-4 for effectiveness), how to introduce gradually, and proper usage frequency.",
      },
      {
        id: "7-5",
        title: "Antioxidants Encyclopedia",
        duration: "35 min",
        type: "reading",
        content:
          "Comprehensive guide to antioxidants that neutralize free radicals: Vitamin C (L-ascorbic acid 10-20%, brightening and collagen-boosting), Vitamin E (tocopherol, enhances vitamin C), Ferulic acid (stabilizes vitamins C and E), Niacinamide (vitamin B3, 5-10%, multi-functional), Resveratrol (anti-aging), CoQ10 (energizes cells), Green tea (EGCG, anti-inflammatory). Learn about stability, packaging requirements, and optimal combinations.",
      },
      {
        id: "7-6",
        title: "Peptides and Proteins",
        duration: "30 min",
        type: "reading",
        content:
          "Understand different peptide types and their functions: Signal peptides (stimulate collagen production - Matrixyl, Argireline), Carrier peptides (deliver minerals like copper), Neurotransmitter peptides (relax facial muscles - 'topical botox'), and Enzyme inhibitor peptides (slow collagen breakdown). Learn effective concentrations (typically 3-5%), how peptides work as signaling molecules, and why they're best used after establishing a basic routine with retinol and vitamin C.",
      },
      {
        id: "7-7",
        title: "Preservatives and Formulation",
        duration: "25 min",
        type: "reading",
        content:
          "Learn about preservatives (phenoxyethanol, parabens, benzyl alcohol) that prevent bacterial and fungal growth in water-based products. Understand pH levels (most actives work at pH 3-4, while cleansers should be pH 5-6), product stability (why some ingredients need airless pumps or opaque bottles), and formulation basics. Discover why preservatives are essential for product safety and how to identify well-formulated products. Learn about emulsifiers that blend oil and water, and stabilizers that maintain product consistency.",
      },
      {
        id: "7-8",
        title: "Ingredient Interactions",
        duration: "35 min",
        type: "reading",
        content:
          "Discover which ingredients work together and which don't. Good combinations: Vitamin C + Vitamin E + Ferulic acid (enhanced stability), Niacinamide + most ingredients (very compatible), Retinol + Peptides (complementary anti-aging). Avoid combining: Retinol + AHAs/BHAs (irritation risk), Vitamin C + Retinol (use AM/PM separately), Benzoyl Peroxide + Retinol (can deactivate each other, unless formulated together). Learn how to stagger actives throughout the week.",
      },
      {
        id: "7-9",
        title: "Final Assessment",
        duration: "20 min",
        type: "quiz",
        content:
          "Comprehensive test on reading ingredient lists, understanding active vs inactive ingredients, retinoid types, acid families, antioxidants, peptides, and ingredient interactions. Questions cover effective concentrations, pH requirements, and proper ingredient combinations.",
      },
    ],
    whatYouLearn: [
      "Read and understand INCI ingredient lists",
      "Identify effective concentrations of actives",
      "Understand all major ingredient categories (retinoids, acids, antioxidants, peptides)",
      "Know which ingredients work together and which conflict",
      "Evaluate product formulations for effectiveness",
      "Make informed purchasing decisions based on ingredient knowledge",
    ],
    requirements: [
      "Basic skincare knowledge helpful",
      "Interest in ingredient science",
      "Willingness to learn chemistry basics",
    ],
    recommendedProducts: ["2", "3", "5", "11", "14", "17"],
  },
  {
    id: "8",
    title: "Korean Skincare Routine Mastery",
    description:
      "Learn the famous 10-step Korean skincare routine and K-beauty philosophy. Discover innovative ingredients and techniques.",
    instructor: "Dr. Ji-Yeon Park",
    instructorTitle: "K-Beauty Expert",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "5 hours",
    level: "Beginner",
    category: "Routines",
    image: "/korean-skincare-routine.jpg",
    rating: 4.9,
    students: 16789,
    price: 49,
    lessons: [
      {
        id: "8-1",
        title: "K-Beauty Philosophy",
        duration: "20 min",
        type: "reading",
        content:
          "Understand the Korean approach to skincare: prevention over treatment, hydration as foundation, consistency over quick fixes, and skin as an investment. K-beauty emphasizes achieving 'glass skin' (dewy, translucent, poreless appearance) through layering lightweight hydrating products. The philosophy focuses on gentle, nourishing ingredients rather than harsh actives, and building a customized routine that evolves with your skin's needs.",
      },
      {
        id: "8-2",
        title: "The 10-Step Routine Explained",
        duration: "40 min",
        type: "reading",
        content:
          "Learn each step of the complete routine: 1) Oil cleanser (removes makeup/sunscreen), 2) Water-based cleanser (deep cleansing), 3) Exfoliator (1-2x weekly, removes dead cells), 4) Toner (balances pH, preps skin), 5) Essence (lightweight hydration, enhances absorption), 6) Serum/Ampoule (concentrated treatment), 7) Sheet mask (2-3x weekly, intensive hydration), 8) Eye cream (targets delicate eye area), 9) Moisturizer (seals in hydration), 10) SPF (morning) or Sleeping mask (night). Not all steps are necessary daily - customize based on your needs.",
      },
      {
        id: "8-3",
        title: "Double Cleansing Method",
        duration: "30 min",
        type: "reading",
        content:
          "Master the art of double cleansing for perfectly clean skin without stripping. Step 1: Oil cleanser removes oil-based impurities (makeup, sunscreen, sebum) by dissolving them. Massage for 1-2 minutes, emulsify with water, rinse. Step 2: Water-based cleanser (foam, gel, or cream) removes water-based impurities (sweat, dirt) and any remaining residue. This two-step process ensures thorough cleansing while maintaining skin's oil balance. Essential for evening routine, optional in morning.",
      },
      {
        id: "8-4",
        title: "Essences and Serums",
        duration: "35 min",
        type: "reading",
        content:
          "Understand the difference between essences (watery, hydrating, preps skin for better absorption of subsequent products) and serums (thicker, concentrated actives targeting specific concerns). Essences are K-beauty staples that enhance effectiveness of treatments applied after. Layer from thinnest to thickest consistency. Popular essences: COSRX Snail Mucin, Missha Time Revolution, SK-II. Can use multiple serums targeting different concerns - apply thinnest first, wait 30-60 seconds between layers.",
      },
      {
        id: "8-5",
        title: "Sheet Mask Mastery",
        duration: "25 min",
        type: "reading",
        content:
          "Learn how to choose and use sheet masks effectively for intensive hydration and treatment. Types: hydrating (hyaluronic acid), brightening (vitamin C, niacinamide), soothing (centella, aloe), anti-aging (peptides, retinol). Apply to clean, toned skin, leave for 15-20 minutes (not until dry - can reverse hydration), pat in remaining essence, follow with moisturizer to seal. Use 2-3x weekly for special occasions. Store in fridge for extra soothing effect.",
      },
      {
        id: "8-6",
        title: "K-Beauty Ingredients",
        duration: "40 min",
        type: "reading",
        content:
          "Discover innovative K-beauty ingredients: Snail mucin (hydrating, healing, promotes cell regeneration), Propolis (antibacterial, anti-inflammatory, brightening), Ginseng (anti-aging, energizing, improves circulation), Centella asiatica/Cica (soothing, healing, reduces redness), Fermented ingredients (enhanced absorption, probiotic benefits), Rice extract (brightening, softening), Green tea (antioxidant, calming), Bee venom (anti-aging, plumping). These gentle yet effective ingredients are backed by traditional Korean medicine and modern science.",
      },
      {
        id: "8-7",
        title: "Customizing Your Routine",
        duration: "30 min",
        type: "reading",
        content:
          "Adapt the 10-step routine to your skin type and concerns. Oily skin: lightweight essences, gel moisturizers, skip oil cleansers if not wearing makeup. Dry skin: rich essences, cream moisturizers, add facial oils. Sensitive skin: minimal steps, focus on soothing ingredients (centella, aloe). Acne-prone: BHA toners, tea tree, skip heavy creams. You don't need all 10 steps daily - a basic routine might be: double cleanse, toner, essence, moisturizer, SPF. Add treatments as needed.",
      },
      {
        id: "8-8",
        title: "Course Quiz",
        duration: "15 min",
        type: "quiz",
        content:
          "Test your K-beauty knowledge covering the philosophy, 10-step routine, double cleansing technique, essence vs serum differences, sheet mask usage, innovative K-beauty ingredients, and routine customization strategies.",
      },
    ],
    whatYouLearn: [
      "Understand K-beauty philosophy of prevention and hydration",
      "Master the complete 10-step routine",
      "Perfect double cleansing technique",
      "Layer multiple products effectively (essences, serums, treatments)",
      "Use sheet masks properly for maximum benefit",
      "Customize routine for your specific skin type and concerns",
    ],
    requirements: [
      "No prior knowledge required",
      "Willingness to try new products and techniques",
      "Time for multi-step routine (can be simplified)",
    ],
    recommendedProducts: ["1", "4", "6", "9", "13", "16"],
  },
  {
    id: "9",
    title: "Chemical Peels & Exfoliation Science",
    description:
      "Advanced course on chemical exfoliation. Learn about AHAs, BHAs, PHAs, and how to safely perform at-home peels.",
    instructor: "Dr. Marcus Johnson",
    instructorTitle: "Chemical Peel Specialist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "5.5 hours",
    level: "Advanced",
    category: "Treatments",
    image: "/chemical-peel-skincare.jpg",
    rating: 4.7,
    students: 7654,
    price: 79,
    lessons: [
      {
        id: "9-1",
        title: "The Science of Exfoliation",
        duration: "30 min",
        type: "reading",
        content:
          "Understand how chemical exfoliants work at the cellular level by dissolving the bonds (desmosomes) holding dead skin cells together. This process, called chemical exfoliation or keratolysis, promotes cell turnover and reveals fresher skin. Unlike physical exfoliation (scrubs), chemical exfoliation works uniformly and can penetrate deeper. Learn about the skin's natural desquamation process and how acids accelerate it safely. Chemical exfoliants also stimulate collagen production and improve product penetration.",
      },
      {
        id: "9-2",
        title: "AHA Family: Glycolic, Lactic, Mandelic",
        duration: "45 min",
        type: "reading",
        content:
          "Deep dive into alpha hydroxy acids (water-soluble, work on skin surface). Glycolic acid: derived from sugarcane, smallest molecular size (penetrates deepest), most effective for fine lines and hyperpigmentation, use 5-10% for home use, 20-70% for professional peels. Lactic acid: derived from milk, gentler and hydrating, suitable for sensitive/dry skin, 5-10% home use. Mandelic acid: derived from almonds, largest molecule (gentlest), best for sensitive skin and darker skin tones (less PIH risk), 5-10%. All AHAs are humectants and increase sun sensitivity - always use SPF 30+.",
      },
      {
        id: "9-3",
        title: "BHA: Salicylic Acid Mastery",
        duration: "35 min",
        type: "reading",
        content:
          "Learn everything about beta hydroxy acid (oil-soluble, penetrates pores). Salicylic acid is derived from willow bark and is the only BHA used in skincare. It penetrates into pores to dissolve sebum and dead skin cells, making it ideal for oily, acne-prone, and blackhead-prone skin. Anti-inflammatory properties reduce redness and swelling. Use 0.5-2% for daily use, up to 30% for professional peels. Can be used with AHAs for full-spectrum exfoliation. Less sun-sensitizing than AHAs but still requires SPF.",
      },
      {
        id: "9-4",
        title: "PHAs: Gentle Exfoliation",
        duration: "30 min",
        type: "reading",
        content:
          "Discover polyhydroxy acids (larger molecular size, gentler exfoliation) for sensitive skin. PHAs are a subclass of AHAs that penetrate less deeply, reducing irritation risk. Types: Gluconolactone (antioxidant, hydrating), Lactobionic acid (chelating, anti-aging), Galactose (wound healing). Suitable for rosacea, eczema, and those who can't tolerate AHAs or BHAs. Also have humectant properties for hydration. Use 5-10% concentration. Can be used daily even on sensitive skin. Ideal for beginners to chemical exfoliation.",
      },
      {
        id: "9-5",
        title: "At-Home Peel Protocols",
        duration: "50 min",
        type: "reading",
        content:
          "Learn how to safely perform at-home chemical peels. Preparation: Stop all actives 3-5 days before, ensure healthy skin barrier. Application: Cleanse thoroughly, apply thin even layer avoiding eyes/lips, start with 1-2 minutes, gradually increase to 5-10 minutes max. Neutralize if required (some self-neutralize). Post-peel care: Gentle cleanser, hydrating products, barrier repair moisturizer, SPF 30+ mandatory. Expect mild tingling (normal), stop if burning. Peeling may occur 2-5 days after. Start with low concentrations (10-20% AHA, 2% BHA), use once weekly max. Never peel compromised or sunburned skin.",
      },
      {
        id: "9-6",
        title: "Managing Side Effects",
        duration: "25 min",
        type: "reading",
        content:
          "Handle purging (temporary increase in breakouts as congestion surfaces, lasts 4-6 weeks, occurs in usual breakout areas), irritation (redness, stinging - reduce frequency or concentration), over-exfoliation (compromised barrier, sensitivity, dryness - stop all actives, focus on barrier repair for 2-4 weeks). Distinguish between purging (normal, temporary) and reaction (worsening, new areas - discontinue product). Prevention: Start low concentration, increase gradually, don't combine multiple acids, always use SPF, listen to your skin.",
      },
      {
        id: "9-7",
        title: "Professional vs At-Home",
        duration: "30 min",
        type: "reading",
        content:
          "Understand when to seek professional treatments. At-home peels: 5-30% AHA, 0.5-2% BHA, suitable for maintenance, mild concerns, regular use. Professional peels: 30-70% AHA, 20-30% BHA, TCA peels, combination peels, for stubborn hyperpigmentation, deep wrinkles, severe acne scarring, melasma. Professional peels offer controlled application, higher concentrations, immediate neutralization, and expert monitoring. Downtime: at-home (minimal to none), professional (3-14 days depending on depth). Cost: at-home ($20-60 per product), professional ($150-500 per session). Consider professional for faster results or if at-home peels plateau.",
      },
      {
        id: "9-8",
        title: "Final Exam",
        duration: "20 min",
        type: "quiz",
        content:
          "Comprehensive assessment on chemical exfoliation covering the science of exfoliation, AHA types and properties, BHA mechanisms, PHA benefits, at-home peel protocols, side effect management, and when to seek professional treatments.",
      },
    ],
    whatYouLearn: [
      "Understand exfoliation science at cellular level",
      "Master different acid types (AHAs, BHAs, PHAs) and their properties",
      "Perform safe at-home chemical peels with proper protocols",
      "Choose the right acid and concentration for your skin type",
      "Manage side effects including purging and irritation",
      "Know when to seek professional treatments vs at-home care",
    ],
    requirements: [
      "Advanced skincare knowledge required",
      "Experience with active ingredients (retinoids, acids)",
      "Healthy, intact skin barrier (no active irritation or compromise)",
    ],
    recommendedProducts: ["5", "8", "12", "15", "20"],
  },
  {
    id: "10",
    title: "Sun Protection & UV Defense",
    description:
      "Comprehensive guide to sun protection. Learn about UVA/UVB, SPF ratings, sunscreen ingredients, and proper application.",
    instructor: "Dr. Rachel Green",
    instructorTitle: "Photoprotection Specialist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "4 hours",
    level: "Beginner",
    category: "Protection",
    image: "/sunscreen-sun-protection.jpg",
    rating: 4.9,
    students: 14321,
    price: 29,
    lessons: [
      {
        id: "10-1",
        title: "Understanding UV Radiation",
        duration: "25 min",
        type: "reading",
        content:
          "Learn about UV radiation types and their effects on skin. UVA rays (320-400nm): penetrate deeper into dermis, cause wrinkles, age spots, and contribute to skin cancer, present year-round even through clouds and windows, responsible for tanning and photoaging. UVB rays (280-320nm): affect epidermis, cause sunburn and DNA damage, stronger in summer and at high altitudes, primary cause of skin cancer. UVC rays (100-280nm): blocked by ozone layer, not a concern. Both UVA and UVB contribute to premature aging and skin cancer - need broad-spectrum protection.",
      },
      {
        id: "10-2",
        title: "SPF and PA Ratings Explained",
        duration: "20 min",
        type: "reading",
        content:
          "Understand what SPF numbers really mean and PA+ ratings. SPF (Sun Protection Factor) measures UVB protection: SPF 15 blocks ~93% of UVB, SPF 30 blocks ~97%, SPF 50 blocks ~98%. Higher SPF provides marginally more protection but not double. American Academy of Dermatology recommends minimum SPF 30. PA (Protection Grade of UVA) system from Asia indicates UVA protection: PA+ (some protection), PA++ (moderate), PA+++ (high), PA++++ (extremely high). Look for 'broad spectrum' label ensuring both UVA and UVB protection.",
      },
      {
        id: "10-3",
        title: "Chemical vs Physical Sunscreens",
        duration: "35 min",
        type: "reading",
        content:
          "Compare organic (chemical) and inorganic (mineral/physical) UV filters. Chemical sunscreens: absorb UV rays and convert to heat, ingredients include avobenzone, oxybenzone, octisalate, homosalate, lightweight and blend easily, ideal under makeup, may irritate sensitive skin. Mineral sunscreens: sit on surface and reflect UV radiation, active ingredients are zinc oxide (broad-spectrum) and titanium dioxide (mainly UVB), start working immediately, better for sensitive/post-procedure skin, may leave white cast. Neither type is inherently better - choose based on skin type and lifestyle. Zinc oxide has calming, anti-inflammatory properties ideal for acne-prone skin.",
      },
      {
        id: "10-4",
        title: "Proper Application Technique",
        duration: "30 min",
        type: "reading",
        content:
          "Learn the correct amount and application method for maximum protection. Amount: 1/4 teaspoon (about 2 finger lengths) for face and neck, more for body. Most people apply only 25-50% of needed amount, reducing protection significantly. Application: Apply to clean, moisturized skin 15 minutes before sun exposure (chemical sunscreens need time to absorb), dot on forehead, cheeks, nose, chin, then blend evenly, don't forget ears, neck, and chest. For makeup wearers: sunscreen goes after moisturizer, before makeup. Mineral sunscreens work immediately, chemical need 15-20 minutes.",
      },
      {
        id: "10-5",
        title: "Reapplication and Daily Use",
        duration: "25 min",
        type: "reading",
        content:
          "Master the art of reapplying sunscreen throughout the day. Reapply every 2 hours when outdoors, immediately after swimming or heavy sweating, even if labeled 'water-resistant' (which only lasts 40-80 minutes). For daily indoor use: one application usually sufficient unless near windows. Reapplication over makeup: use powder sunscreen, SPF setting spray, or cushion compact. Sunscreen degrades with UV exposure, so reapplication is crucial. Set phone reminders. Any sunscreen is better than no sunscreen - consistency matters most.",
      },
      {
        id: "10-6",
        title: "Sunscreen for Different Skin Types",
        duration: "30 min",
        type: "reading",
        content:
          "Choose the right sunscreen formula for your skin type. Oily/acne-prone: lightweight gel or fluid formulas, oil-free, non-comedogenic, mattifying, look for zinc oxide (anti-inflammatory). Dry skin: cream or lotion formulas with hydrating ingredients (hyaluronic acid, glycerin, ceramides). Sensitive skin: mineral sunscreens (zinc oxide/titanium dioxide) are less irritating, fragrance-free. Darker skin tones: chemical sunscreens (no white cast) or tinted mineral sunscreens. Aging skin: moisturizing formulas with antioxidants.",
      },
      {
        id: "10-7",
        title: "Knowledge Check",
        duration: "15 min",
        type: "quiz",
        content:
          "Test your sun protection knowledge covering UV radiation types, SPF and PA ratings, chemical vs mineral sunscreen differences, proper application amounts and techniques, reapplication protocols, and choosing sunscreen for different skin types.",
      },
    ],
    whatYouLearn: [
      "Understand UVA and UVB radiation and their effects",
      "Decode SPF numbers and PA ratings accurately",
      "Choose between chemical and physical/mineral sunscreens",
      "Apply correct amount of sunscreen (1/4 teaspoon for face)",
      "Reapply throughout the day for continuous protection",
      "Select appropriate sunscreen formula for your skin type",
    ],
    requirements: [
      "No prior knowledge required",
      "Commitment to daily SPF 30+ use",
      "Willingness to reapply regularly when outdoors",
    ],
    recommendedProducts: ["21", "23", "25", "27"],
  },
  {
    id: "11",
    title: "Facial Massage & Lymphatic Drainage",
    description:
      "Learn professional facial massage techniques to improve circulation, reduce puffiness, and enhance product absorption.",
    instructor: "Elena Volkov",
    instructorTitle: "Licensed Esthetician & Massage Therapist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "3.5 hours",
    level: "Beginner",
    category: "Techniques",
    image: "/facial-massage-lymphatic-drainage.jpg",
    rating: 4.8,
    students: 9876,
    price: 39,
    lessons: [
      {
        id: "11-1",
        title: "Facial Anatomy for Massage",
        duration: "25 min",
        type: "reading",
        content:
          "Understand facial muscles and lymphatic system for effective massage. Major facial muscles: frontalis (forehead), orbicularis oculi (around eyes), zygomaticus (smile), masseter (jaw). Lymphatic system: network of vessels that drain toxins and excess fluid, lymph nodes located around ears, jaw, and neck. Lymphatic drainage moves fluid toward these nodes for elimination. Understanding anatomy helps you massage in correct directions (always toward lymph nodes) and avoid sensitive areas. Proper technique enhances circulation, reduces puffiness, and promotes healthy, glowing skin.",
      },
      {
        id: "11-2",
        title: "Basic Massage Techniques",
        duration: "30 min",
        type: "reading",
        content:
          "Learn fundamental massage movements: Effleurage (light, gliding strokes for relaxation and product distribution), Petrissage (kneading, lifting motions for deeper muscle work), Tapotement (gentle tapping to stimulate circulation), and Friction (circular motions for tension release). Always use clean hands and facial oil or serum for slip. Apply gentle to medium pressure - face has delicate skin and muscles. Move in upward and outward motions to lift and contour. Spend 5-10 minutes for full facial massage. Benefits include improved circulation, enhanced product absorption, stress relief, and temporary lifting effect.",
      },
      {
        id: "11-3",
        title: "Lymphatic Drainage Protocol",
        duration: "40 min",
        type: "reading",
        content:
          "Master the technique to reduce puffiness and improve circulation. Lymphatic drainage uses very light pressure (lighter than massage) with specific directional movements toward lymph nodes. Protocol: 1) Start at neck to 'open' drainage pathways, 2) Forehead: center to temples, 3) Under eyes: inner to outer corner, 4) Cheeks: nose to ears, 5) Jawline: chin to ears, 6) Finish at neck, draining downward. Use ring and middle fingers, feather-light touch. Perform morning or evening, especially beneficial for puffy eyes, sinus congestion, or after flights. Helps body naturally detox, boosts circulation, reduces inflammation, and promotes sculpted appearance.",
      },
      {
        id: "11-4",
        title: "Gua Sha Techniques",
        duration: "35 min",
        type: "reading",
        content:
          "Learn proper gua sha tool usage and techniques. Gua sha is traditional Chinese medicine technique using flat stone tool (jade, rose quartz, bian stone) to scrape skin gently. Benefits: lymphatic drainage, reduces puffiness, improves circulation, relieves facial tension, promotes collagen production, enhances product absorption. Technique: Hold tool at 15-30 degree angle, use gentle to medium pressure, always move upward and outward, repeat each stroke 3-5 times. Areas: neck (downward), jawline (chin to ear), cheeks (nose to ears), under eyes (inner to outer, very gentle), forehead (center to temples). Use with facial oil. Perform 3-5 times weekly. Store in fridge for extra de-puffing effect.",
      },
      {
        id: "11-5",
        title: "Jade Rolling Methods",
        duration: "20 min",
        type: "reading",
        content:
          "Discover how to use jade and rose quartz rollers effectively. Rollers have two ends: large for cheeks, forehead, neck; small for under eyes, nose, lips. Benefits: cooling and soothing, reduces puffiness, enhances product absorption, promotes lymphatic drainage, stress relief. Technique: Roll in upward and outward motions, use gentle pressure, repeat each area 3-5 times. Routine: neck (downward), jawline (center to ears), cheeks (nose to ears), forehead (center to temples), under eyes (inner to outer with small end). Use after applying serum or oil. Clean roller after each use with gentle soap. Store in fridge for enhanced de-puffing. Use daily, morning or evening.",
      },
      {
        id: "11-6",
        title: "Daily Massage Routine",
        duration: "25 min",
        type: "reading",
        content:
          "Create a quick daily facial massage routine (5 minutes). Morning routine: 1) Apply facial oil or serum, 2) Lymphatic drainage on eyes and face to reduce overnight puffiness, 3) Jade rolling for cooling effect, 4) Gentle tapping to wake up skin. Evening routine: 1) Apply night cream or oil, 2) Relaxing effleurage strokes, 3) Gua sha for deeper work and tension release, 4) Pressure points on temples and jaw for stress relief. Customize based on concerns: focus on eyes for puffiness, jawline for definition, forehead for tension. Consistency is key - even 2-3 minutes daily shows results over time.",
      },
      {
        id: "11-7",
        title: "Practical Assessment",
        duration: "15 min",
        type: "quiz",
        content:
          "Test your knowledge of facial anatomy, massage techniques (effleurage, petrissage, tapotement), lymphatic drainage protocols, gua sha usage, jade rolling methods, and creating effective daily massage routines.",
      },
    ],
    whatYouLearn: [
      "Understand facial anatomy and lymphatic system",
      "Perform basic massage techniques (effleurage, petrissage, tapotement)",
      "Master lymphatic drainage for reducing puffiness",
      "Use gua sha tools correctly with proper angles and pressure",
      "Incorporate jade rolling into daily routine",
      "Create personalized 5-minute daily massage routine",
    ],
    requirements: [
      "No prior experience needed",
      "Facial massage tools helpful but not required (can use hands)",
      "Clean hands and face before massage",
    ],
    recommendedProducts: ["6", "9", "13", "26"],
  },
  {
    id: "12",
    title: "Hormonal Acne Management",
    description:
      "Specialized course on treating hormonal acne. Understand the hormonal connection and effective treatment strategies.",
    instructor: "Dr. Sophia Lee",
    instructorTitle: "Hormonal Health & Dermatology Specialist",
    instructorAvatar: "/placeholder.svg?height=100&width=100",
    duration: "5 hours",
    level: "Intermediate",
    category: "Acne",
    image: "/hormonal-acne-treatment.jpg",
    rating: 4.9,
    students: 11543,
    price: 69,
    lessons: [
      {
        id: "12-1",
        title: "Hormones and Skin Connection",
        duration: "30 min",
        type: "reading",
        content:
          "Understand how hormones affect skin and cause acne. Androgens (testosterone, DHEA) increase sebum production and trigger acne. Estrogen has protective effects, keeping skin clear. Progesterone can worsen acne in some people. Hormonal fluctuations during menstrual cycle, pregnancy, menopause, or due to PCOS cause breakouts. Cortisol (stress hormone) increases inflammation and oil production. Insulin and IGF-1 (from high-glycemic foods) stimulate androgen production. Understanding these connections helps target treatment effectively. Hormonal acne is primarily driven by internal factors, requiring different approach than typical acne.",
      },
      {
        id: "12-2",
        title: "Identifying Hormonal Acne",
        duration: "25 min",
        type: "reading",
        content:
          "Learn the signs and patterns of hormonal breakouts. Location: primarily around chin, jawline, and lower cheeks (U-zone), sometimes neck and chest. Type: deep, painful nodules or cysts rather than surface whiteheads. Timing: worsens monthly around menstruation (7-10 days before period), may improve mid-cycle. Age: often persists beyond teenage years, can start in 20s-40s. Resistance: doesn't respond well to typical acne treatments (benzoyl peroxide, salicylic acid alone). Other signs: irregular periods, excess facial hair, thinning scalp hair (possible PCOS). If you identify with these patterns, hormonal treatment may be necessary.",
      },
      {
        id: "12-3",
        title: "Topical Treatment Strategies",
        duration: "40 min",
        type: "reading",
        content:
          "Effective topical treatments for hormonal acne. Retinoids (adapalene, tretinoin): prevent clogged pores, reduce inflammation, use nightly, build tolerance gradually. Benzoyl peroxide 2.5-5%: kills bacteria, reduces inflammation, use AM or PM. Azelaic acid 15-20%: reduces inflammation, fades marks, gentle enough for sensitive skin. Niacinamide 5-10%: controls oil, reduces inflammation, strengthens barrier. Salicylic acid 2%: unclogs pores, reduces oil. Spironolactone cream (topical): blocks androgens locally. Combination approach works best: retinoid + benzoyl peroxide or azelaic acid. Be patient - takes 3-6 months to see full results. Always use SPF 30+ as these increase sun sensitivity.",
      },
      {
        id: "12-4",
        title: "Lifestyle and Diet Factors",
        duration: "35 min",
        type: "reading",
        content:
          "How diet, stress, and sleep affect hormonal acne. Diet: High-glycemic foods (sugar, white bread, processed carbs) spike insulin and IGF-1, triggering acne. Dairy (especially skim milk) may worsen breakouts due to hormones and growth factors. Consider low-glycemic diet, reduce dairy, increase omega-3s (anti-inflammatory). Stress: Increases cortisol, leading to more oil production and inflammation. Practice stress management: meditation, exercise, adequate sleep. Sleep: Poor sleep disrupts hormones and increases cortisol. Aim for 7-9 hours. Exercise: Improves circulation and reduces stress, but wash face after sweating. These lifestyle changes support medical treatments and may reduce severity.",
      },
      {
        id: "12-5",
        title: "Supplements and Internal Support",
        duration: "30 min",
        type: "reading",
        content:
          "Learn about supplements that may help hormonal acne. Zinc (30-40mg daily): reduces inflammation, regulates oil production. Omega-3 fatty acids: anti-inflammatory, supports hormone balance. Vitamin D: deficiency linked to acne, supports immune function. Probiotics: gut health affects skin, may reduce inflammation. DIM (diindolylmethane): helps metabolize estrogen. Spearmint tea: may reduce androgens (2 cups daily). Inositol: beneficial for PCOS-related acne. Important: Supplements support but don't replace medical treatment. Consult healthcare provider before starting, especially if taking medications. Results take 3-6 months. Focus on whole-food nutrition first.",
      },
      {
        id: "12-6",
        title: "Medical Treatment Options",
        duration: "35 min",
        type: "reading",
        content:
          "Understand when to consider medical treatments. Spironolactone: oral anti-androgen medication, reduces oil production and inflammation, 50-200mg daily, effective first-line treatment for women, requires contraception (can feminize male fetuses), routine potassium monitoring generally unnecessary unless risk factors present. Combined oral contraceptives (birth control): contain estrogen and progesterone, block hormonal fluctuations, reduce testosterone effects, similar efficacy across brands. Topical retinoids: can be used with hormonal treatments. Consult board-certified dermatologist if acne persists beyond age 25, worsens monthly, causes scarring, doesn't improve after 3 months of OTC treatment, or significantly impacts self-esteem.",
      },
      {
        id: "12-7",
        title: "Managing Menstrual Cycle Breakouts",
        duration: "25 min",
        type: "reading",
        content:
          "Strategies for cycle-related acne flares. Track your cycle to predict breakouts (usually 7-10 days before period). Preventive approach: Increase retinoid frequency week before period, add spot treatment with benzoyl peroxide or salicylic acid, use clay mask to absorb excess oil, avoid picking or squeezing (worsens inflammation and scarring). During breakout: Ice inflamed cysts (reduces swelling), hydrocolloid patches (absorbs fluid, prevents picking), gentle skincare (don't over-treat), consider cortisone injection from dermatologist for severe cysts. Post-breakout: Treat hyperpigmentation with vitamin C, niacinamide, or azelaic acid. Consistency with hormonal treatment (spironolactone or birth control) reduces cycle-related flares over time.",
      },
      {
        id: "12-8",
        title: "Final Assessment",
        duration: "15 min",
        type: "quiz",
        content:
          "Test your hormonal acne knowledge covering hormone-skin connections, identifying hormonal acne patterns, topical treatment strategies, lifestyle and diet factors, supplement options, medical treatment protocols, and managing menstrual cycle breakouts.",
      },
    ],
    whatYouLearn: [
      "Understand how hormones (androgens, estrogen, cortisol) affect skin",
      "Identify hormonal acne patterns (location, timing, type)",
      "Use effective topical treatments (retinoids, azelaic acid, niacinamide)",
      "Address lifestyle factors (diet, stress, sleep) that affect hormones",
      "Know when to seek medical help (spironolactone, birth control)",
      "Manage cycle-related breakouts with preventive strategies",
    ],
    requirements: [
      "Basic acne knowledge helpful",
      "Understanding of menstrual cycle",
      "Patience for treatment results (3-6 months)",
    ],
    recommendedProducts: ["5", "8", "12", "15", "20"],
  },
]

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id)
}

export function getCoursesByCategory(category: string): Course[] {
  return courses.filter((course) => course.category === category)
}

export function getCoursesByLevel(level: string): Course[] {
  return courses.filter((course) => course.level === level)
}
