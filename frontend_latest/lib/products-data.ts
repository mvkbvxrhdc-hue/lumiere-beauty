export interface ProductVariant {
  id: string
  name: string
  type: "size" | "version"
  price: number
  originalPrice?: number
  inStock: boolean
}

export interface CustomerReview {
  id: string
  rating: number
  title: string
  comment: string
  author: string
  avatar: string
  date: string
  helpful: number
  verified: boolean
  images?: string[]
  videoUrl?: string
  skinType?: string
  age?: string
  sellerResponse?: {
    comment: string
    date: string
    responder: string
  }
}

export interface ProductQnA {
  id: string
  question: string
  answer: string
  askedBy: string
  answeredBy: string
  helpful: number
  date: string
}

export interface Ingredient {
  name: string
  purpose: string
  benefits: string[]
}

export interface Certification {
  name: string
  icon: string
  description: string
}

export interface UsageStep {
  step: number
  instruction: string
  tip?: string
}

export interface Product {
  id: string
  name: string
  brand: string
  description: string
  price: number
  originalPrice?: number
  category: string
  skinType: string[]
  rating: number
  reviews: number
  image: string
  badge?: string
  tags: string[]
  ingredients?: string[]
  benefits?: string[]
  usage?: string
  inStock: boolean
  variants?: ProductVariant[]
  customerReviews?: CustomerReview[]
  qna?: ProductQnA[]
  images?: string[]
  specifications?: Record<string, string>
  highlights?: string[]
  shippingInfo?: string
  stockQuantity?: number
  seller?: string
  ratingBreakdown?: { 5: number; 4: number; 3: number; 2: number; 1: number }
  detailedIngredients?: Ingredient[]
  certifications?: Certification[]
  usageInstructions?: UsageStep[]
  safetyWarnings?: string[]
  videoUrl?: string
  beforeAfterImages?: string[]
  frequentlyBoughtWith?: string[]
  subscriptionDiscount?: number
  pricePerUnit?: string
  detailedDescription?: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Vitamin C Brightening Serum",
    brand: "GlowLab",
    description:
      "A powerful antioxidant serum that brightens skin tone and reduces dark spots. Our advanced formula combines 20% pure L-Ascorbic Acid with Vitamin E and Ferulic Acid for maximum stability and effectiveness. Clinically proven to reduce hyperpigmentation by 45% in 8 weeks.",
    price: 45.99,
    originalPrice: 59.99,
    category: "Serums",
    skinType: ["All", "Dull", "Aging"],
    rating: 4.8,
    reviews: 324,
    image: "/vitamin-c-serum.jpg",
    images: ["/vitamin-c-serum.jpg", "/vitamin-c-serum.jpg", "/vitamin-c-serum.jpg"],
    badge: "Bestseller",
    tags: ["Free Home Return", "100k+ Orders in 90 Days", "Gold List"],
    inStock: true,
    stockQuantity: 156,
    seller: "GlowLab Official Store",
    shippingInfo: "Free shipping on orders over $35. Arrives in 2-3 business days.",
    pricePerUnit: "$1.53 per ml",
    subscriptionDiscount: 15,
    videoUrl: "dQw4w9WgXcQ", // Using just the YouTube ID for better compatibility
    beforeAfterImages: ["/vitamin-c-serum.jpg", "/vitamin-c-serum.jpg"],
    frequentlyBoughtWith: ["2", "6"],
    highlights: [
      "20% Pure Vitamin C (L-Ascorbic Acid) for maximum effectiveness",
      "Brightens skin tone and fades dark spots in 4-6 weeks",
      "Boosts collagen production for firmer, younger-looking skin",
      "Lightweight, fast-absorbing formula suitable for daily use",
      "Stabilized formula with Vitamin E and Ferulic Acid",
      "Dermatologist-tested and cruelty-free",
    ],
    specifications: {
      "Product Size": "30ml / 1 fl oz",
      "Key Ingredients": "20% L-Ascorbic Acid, Vitamin E, Ferulic Acid, Hyaluronic Acid",
      "Skin Type": "All skin types, especially dull and aging skin",
      Texture: "Lightweight serum",
      Scent: "Unscented",
      "pH Level": "3.5",
      "Shelf Life": "12 months after opening",
      "Made In": "USA",
      "Cruelty-Free": "Yes",
      Vegan: "Yes",
    },
    detailedIngredients: [
      {
        name: "L-Ascorbic Acid (20%)",
        purpose: "Active brightening agent",
        benefits: [
          "Inhibits melanin production to fade dark spots",
          "Boosts collagen synthesis for firmer skin",
          "Neutralizes free radicals to prevent premature aging",
          "Enhances skin radiance and luminosity",
        ],
      },
      {
        name: "Vitamin E (Tocopherol)",
        purpose: "Antioxidant and stabilizer",
        benefits: [
          "Protects skin from environmental damage",
          "Enhances vitamin C stability and effectiveness",
          "Moisturizes and nourishes skin",
          "Reduces inflammation and redness",
        ],
      },
      {
        name: "Ferulic Acid",
        purpose: "Antioxidant booster",
        benefits: [
          "Doubles the photoprotection of vitamins C and E",
          "Stabilizes the formula for longer shelf life",
          "Reduces fine lines and wrinkles",
          "Improves skin firmness and elasticity",
        ],
      },
      {
        name: "Hyaluronic Acid",
        purpose: "Hydration agent",
        benefits: [
          "Holds up to 1000x its weight in water",
          "Plumps skin and reduces fine lines",
          "Improves skin texture and smoothness",
          "Enhances product absorption",
        ],
      },
      {
        name: "Glycerin",
        purpose: "Humectant",
        benefits: [
          "Draws moisture into the skin",
          "Strengthens skin barrier function",
          "Prevents transepidermal water loss",
          "Softens and smooths skin texture",
        ],
      },
    ],
    certifications: [
      {
        name: "Cruelty-Free",
        icon: "🐰",
        description: "Never tested on animals. Certified by Leaping Bunny.",
      },
      {
        name: "Vegan",
        icon: "🌱",
        description: "100% plant-based ingredients. No animal-derived components.",
      },
      {
        name: "Dermatologist Tested",
        icon: "✓",
        description: "Clinically tested and approved by board-certified dermatologists.",
      },
      {
        name: "Hypoallergenic",
        icon: "✓",
        description: "Formulated to minimize allergic reactions.",
      },
    ],
    usageInstructions: [
      {
        step: 1,
        instruction: "Cleanse your face thoroughly and pat dry.",
        tip: "Use lukewarm water to avoid irritating the skin.",
      },
      {
        step: 2,
        instruction: "Apply 3-4 drops of serum to your fingertips.",
        tip: "A little goes a long way - don't over-apply.",
      },
      {
        step: 3,
        instruction: "Gently press and pat the serum into your face and neck.",
        tip: "Avoid rubbing to prevent irritation. Focus on areas with dark spots.",
      },
      {
        step: 4,
        instruction: "Wait 1-2 minutes for the serum to fully absorb.",
        tip: "The serum should feel dry to the touch before applying other products.",
      },
      {
        step: 5,
        instruction: "Follow with moisturizer and sunscreen (AM) or night cream (PM).",
        tip: "SPF 30+ is essential when using vitamin C during the day.",
      },
    ],
    safetyWarnings: [
      "For external use only. Avoid contact with eyes.",
      "If irritation occurs, discontinue use and consult a dermatologist.",
      "Perform a patch test before first use, especially if you have sensitive skin.",
      "Store in a cool, dark place away from direct sunlight to maintain potency.",
      "Use within 12 months of opening for best results.",
      "May increase sun sensitivity - always use SPF 30+ during the day.",
      "Not recommended during pregnancy without consulting your doctor.",
    ],
    ratingBreakdown: {
      5: 245,
      4: 58,
      3: 15,
      2: 4,
      1: 2,
    },
    variants: [
      { id: "1-standard", name: "Standard 30ml", type: "size", price: 45.99, originalPrice: 59.99, inStock: true },
      { id: "1-large", name: "Large 50ml", type: "size", price: 68.99, originalPrice: 85.99, inStock: true },
      { id: "1-premium", name: "Premium Formula", type: "version", price: 65.99, originalPrice: 79.99, inStock: true },
    ],
    customerReviews: [
      {
        id: "r1",
        rating: 5,
        title: "Amazing results!",
        comment:
          "I've been using this serum for 3 weeks and my skin looks so much brighter. Dark spots are fading and my complexion is more even. The texture is lightweight and absorbs quickly without any stickiness. I use it every morning under my sunscreen and have noticed a significant improvement in my skin's radiance.",
        author: "Sarah M.",
        avatar: "/avatars/avatar-1.jpg",
        date: "2024-01-15",
        helpful: 145,
        verified: true,
        images: ["/vitamin-c-serum.jpg", "/vitamin-c-serum.jpg"],
        skinType: "Combination",
        age: "32",
        sellerResponse: {
          comment:
            "Thank you so much for your wonderful review, Sarah! We're thrilled to hear about your results. Keep up the great routine!",
          date: "2024-01-16",
          responder: "GlowLab Team",
        },
      },
      {
        id: "r2",
        rating: 4,
        title: "Good but takes time",
        comment:
          "Effective product but you need to be patient. Results started showing after about 4 weeks of consistent use. My skin is definitely brighter now and some of my sun spots have faded. The only reason I'm giving 4 stars instead of 5 is because it took longer than I expected to see results.",
        author: "Jessica L.",
        avatar: "/avatars/avatar-2.jpg",
        date: "2024-01-10",
        helpful: 89,
        verified: true,
        skinType: "Dry",
        age: "45",
      },
      {
        id: "r3",
        rating: 5,
        title: "Holy grail serum",
        comment:
          "This is my third bottle! It's gentle yet effective. No irritation and my skin glows. I use it every morning under sunscreen. My dermatologist even commented on how much brighter my skin looks. Worth every penny!",
        author: "Emily R.",
        avatar: "/avatars/avatar-3.jpg",
        date: "2024-01-05",
        helpful: 167,
        verified: true,
        images: ["/vitamin-c-serum.jpg"],
        skinType: "Normal",
        age: "28",
      },
      {
        id: "r4",
        rating: 5,
        title: "Best vitamin C serum I've tried",
        comment:
          "I've tried many vitamin C serums and this one is by far the best. It doesn't oxidize quickly like others, and the packaging keeps it fresh. My skin tone is more even and my acne scars are fading. Highly recommend!",
        author: "Maria G.",
        avatar: "/avatars/avatar-4.jpg",
        date: "2024-01-03",
        helpful: 92,
        verified: true,
        images: ["/vitamin-c-serum.jpg", "/vitamin-c-serum.jpg", "/vitamin-c-serum.jpg"],
        skinType: "Oily",
        age: "26",
      },
      {
        id: "r5",
        rating: 3,
        title: "Decent but not amazing",
        comment:
          "It's a good serum but I expected more dramatic results based on the reviews. My skin is slightly brighter but not as much as I hoped. Maybe I need to use it longer.",
        author: "Linda K.",
        avatar: "/avatars/avatar-5.jpg",
        date: "2024-01-01",
        helpful: 34,
        verified: true,
        skinType: "Sensitive",
        age: "38",
        sellerResponse: {
          comment:
            "Hi Linda, thank you for your feedback. Vitamin C typically shows best results after 6-8 weeks of consistent use. Please reach out to our customer service if you have any questions!",
          date: "2024-01-02",
          responder: "GlowLab Support",
        },
      },
      {
        id: "r6",
        rating: 5,
        title: "Game changer for my skin!",
        comment:
          "I was skeptical at first, but this serum has completely transformed my skin. My dark spots from acne are almost gone, and my skin looks so much healthier. The consistency is perfect - not too thick, not too watery. Absorbs beautifully!",
        author: "Rachel T.",
        avatar: "/avatars/avatar-6.jpg",
        date: "2023-12-28",
        helpful: 78,
        verified: true,
        videoUrl: "dQw4w9WgXcQ",
        skinType: "Combination",
        age: "30",
      },
      {
        id: "r7",
        rating: 4,
        title: "Great for brightening",
        comment:
          "Love how this makes my skin glow! I've been using it for 2 months and my complexion is noticeably brighter. The only downside is the price, but it's worth it for the quality.",
        author: "Amanda P.",
        avatar: "/avatars/avatar-1.jpg",
        date: "2023-12-25",
        helpful: 56,
        verified: true,
        skinType: "Normal",
        age: "35",
      },
      {
        id: "r8",
        rating: 5,
        title: "Perfect for sensitive skin",
        comment:
          "I have very sensitive skin and most vitamin C serums irritate me, but this one is so gentle! No redness, no burning, just beautiful glowing skin. I'm so happy I found this!",
        author: "Sophie W.",
        avatar: "/avatars/avatar-2.jpg",
        date: "2023-12-20",
        helpful: 103,
        verified: true,
        images: ["/vitamin-c-serum.jpg"],
        skinType: "Sensitive",
        age: "29",
      },
    ],
    qna: [
      {
        id: "q1",
        question: "Can I use this in the morning or only at night?",
        answer:
          "You can use it in the morning! Just make sure to follow with sunscreen as vitamin C can increase sun sensitivity.",
        askedBy: "Michelle K.",
        answeredBy: "GlowLab Expert",
        helpful: 89,
        date: "2024-01-12",
      },
      {
        id: "q2",
        question: "Is this suitable for sensitive skin?",
        answer:
          "Yes, our formula is gentle and suitable for sensitive skin. However, we recommend doing a patch test first.",
        askedBy: "David P.",
        answeredBy: "GlowLab Expert",
        helpful: 56,
        date: "2024-01-08",
      },
    ],
  },
  {
    id: "2",
    name: "Hyaluronic Acid Moisturizer",
    brand: "HydraGlow",
    description: "Deep hydration cream with hyaluronic acid for plump, dewy skin",
    price: 38.5,
    category: "Moisturizers",
    skinType: ["Dry", "Normal", "Combination"],
    rating: 4.9,
    reviews: 512,
    image: "/moisturizer-jar.jpg",
    images: ["/moisturizer-jar.jpg", "/moisturizer-jar.jpg", "/moisturizer-jar.jpg"],
    badge: "Top Rated",
    tags: ["Home Replacement Service", "Free Home Return", "Gold List"],
    inStock: true,
    stockQuantity: 89,
    seller: "HydraGlow Official",
    shippingInfo: "Free 2-day shipping. Order within 3 hrs for same-day dispatch.",
    videoUrl: "dQw4w9WgXcQ", // Using just the YouTube ID
    detailedDescription:
      "Our advanced moisturizer features three molecular weights of hyaluronic acid that penetrate different layers of skin for comprehensive hydration. The lightweight yet rich formula absorbs quickly without leaving a greasy residue, making it perfect for both morning and night use.",
    highlights: [
      "Triple molecular weight hyaluronic acid for deep hydration",
      "Locks in moisture for up to 24 hours",
      "Plumps and smooths fine lines",
      "Non-greasy, fast-absorbing formula",
      "Suitable for all skin types including sensitive skin",
      "Fragrance-free and non-comedogenic",
    ],
    benefits: [
      "Provides intense, long-lasting hydration",
      "Reduces appearance of fine lines",
      "Improves skin elasticity and firmness",
      "Soothes and calms irritated skin",
      "Strengthens skin's moisture barrier",
    ],
    usage:
      "Apply morning and evening to cleansed skin. Gently massage into face and neck until fully absorbed. Can be used alone or under makeup.",
    ingredients: ["Hyaluronic Acid", "Ceramides", "Glycerin", "Niacinamide", "Panthenol"],
    specifications: {
      "Product Size": "50g / 1.7 oz",
      "Key Ingredients": "Hyaluronic Acid (3 molecular weights), Ceramides, Glycerin",
      "Skin Type": "Dry, Normal, Combination",
      Texture: "Rich cream",
      Scent: "Fragrance-free",
      "pH Level": "5.5",
      "Shelf Life": "18 months after opening",
      "Made In": "South Korea",
      "Cruelty-Free": "Yes",
      Vegan: "Yes",
    },
    ratingBreakdown: {
      5: 456,
      4: 42,
      3: 10,
      2: 3,
      1: 1,
    },
    variants: [
      { id: "2-small", name: "Small 30g", type: "size", price: 38.5, inStock: true },
      { id: "2-large", name: "Large 75g", type: "size", price: 65.0, inStock: true },
    ],
    customerReviews: [
      {
        id: "r4",
        rating: 5,
        title: "Best moisturizer ever!",
        comment:
          "My skin has never felt so hydrated. It absorbs quickly and doesn't feel greasy at all. Wake up with plump, dewy skin every morning!",
        author: "Amanda T.",
        avatar: "/avatars/avatar-4.jpg",
        date: "2024-01-18",
        helpful: 78,
        verified: true,
        images: ["/moisturizer-jar.jpg"],
      },
      {
        id: "r5",
        rating: 5,
        title: "Perfect for dry skin",
        comment:
          "I have very dry skin and this moisturizer is a lifesaver. My skin stays hydrated all day. No more flaking or tightness!",
        author: "Lisa W.",
        avatar: "/avatars/avatar-5.jpg",
        date: "2024-01-14",
        helpful: 54,
        verified: true,
      },
    ],
    qna: [
      {
        id: "q3",
        question: "Does this contain fragrance?",
        answer: "No, this moisturizer is fragrance-free and suitable for sensitive skin.",
        askedBy: "Rachel B.",
        answeredBy: "HydraGlow Team",
        helpful: 42,
        date: "2024-01-16",
      },
    ],
  },
  {
    id: "3",
    name: "Retinol Night Cream",
    brand: "YouthRevive",
    description: "Anti-aging night cream with retinol to reduce fine lines and wrinkles",
    price: 52.0,
    category: "Treatments",
    skinType: ["Aging", "Normal", "Dry"],
    rating: 4.7,
    reviews: 289,
    image: "/retinol-cream-jar.jpg",
    images: ["/retinol-cream-jar.jpg", "/retinol-cream-jar.jpg", "/retinol-cream-jar.jpg"],
    tags: ["100k+ Orders in 90 Days", "Gold List"],
    inStock: true,
    stockQuantity: 234,
    seller: "YouthRevive Skincare",
    shippingInfo: "Standard shipping 3-5 days. Express available at checkout.",
    videoUrl: "dQw4w9WgXcQ", // Using just the YouTube ID
    detailedDescription:
      "This advanced night cream features time-release retinol technology that delivers powerful anti-aging benefits while minimizing irritation. Enriched with peptides and antioxidants, it works overnight to smooth fine lines, improve texture, and restore youthful radiance to your skin.",
    highlights: [
      "0.5% Encapsulated Retinol for gentle yet effective results",
      "Reduces fine lines and wrinkles in 8-12 weeks",
      "Improves skin texture and firmness",
      "Time-release formula minimizes irritation",
      "Enriched with peptides and antioxidants",
      "Dermatologist-recommended for anti-aging",
    ],
    benefits: [
      "Visibly reduces fine lines and wrinkles",
      "Improves skin firmness and elasticity",
      "Evens out skin tone and texture",
      "Stimulates collagen production",
      "Minimizes appearance of pores",
    ],
    usage:
      "Apply a pea-sized amount to clean, dry skin every evening. Start with 2-3 times per week and gradually increase frequency. Always use sunscreen during the day.",
    ingredients: ["Encapsulated Retinol", "Peptides", "Niacinamide", "Ceramides", "Squalane"],
    specifications: {
      "Product Size": "50ml / 1.7 fl oz",
      "Key Ingredients": "0.5% Encapsulated Retinol, Peptides, Niacinamide, Ceramides",
      "Skin Type": "Aging, Normal, Dry",
      Texture: "Rich night cream",
      Scent: "Light herbal",
      "pH Level": "6.0",
      "Shelf Life": "12 months after opening",
      "Made In": "France",
      "Cruelty-Free": "Yes",
      Vegan: "No (contains beeswax)",
    },
    ratingBreakdown: {
      5: 198,
      4: 67,
      3: 18,
      2: 4,
      1: 2,
    },
    variants: [
      { id: "3-standard", name: "Standard 0.5%", type: "version", price: 52.0, inStock: true },
      { id: "3-advanced", name: "Advanced 1.0%", type: "version", price: 72.0, inStock: true },
    ],
    customerReviews: [
      {
        id: "r6",
        rating: 5,
        title: "Visible results!",
        comment:
          "Fine lines around my eyes have diminished significantly after 6 weeks of use. My skin looks smoother and more youthful. No irritation at all!",
        author: "Karen H.",
        avatar: "/avatars/avatar-6.jpg",
        date: "2024-01-20",
        helpful: 91,
        verified: true,
        images: ["/retinol-cream-jar.jpg", "/retinol-cream-jar.jpg"],
      },
    ],
    qna: [
      {
        id: "q4",
        question: "Can beginners use this retinol cream?",
        answer: "Yes! Start with the Standard 0.5% version and use it 2-3 times per week initially.",
        askedBy: "Sophie M.",
        answeredBy: "YouthRevive Expert",
        helpful: 73,
        date: "2024-01-17",
      },
    ],
  },
  {
    id: "4",
    name: "Gentle Foaming Cleanser",
    brand: "PureClean",
    description: "pH-balanced cleanser that removes impurities without stripping skin",
    price: 24.99,
    category: "Cleansers",
    skinType: ["All", "Sensitive"],
    rating: 4.6,
    reviews: 445,
    image: "/facial-cleanser-bottle.jpg",
    tags: ["Free Home Return"],
    inStock: true,
  },
  {
    id: "5",
    name: "Niacinamide Pore Refining Serum",
    brand: "ClearSkin Pro",
    description: "Minimizes pores and controls oil production with 10% niacinamide",
    price: 32.0,
    category: "Serums",
    skinType: ["Oily", "Combination", "Acne-Prone"],
    rating: 4.8,
    reviews: 378,
    image: "/niacinamide-serum-dropper.jpg",
    badge: "New",
    tags: ["100k+ Orders in 90 Days"],
    inStock: true,
  },
  {
    id: "6",
    name: "SPF 50 Sunscreen",
    brand: "SunShield",
    description: "Broad-spectrum protection with lightweight, non-greasy formula",
    price: 28.5,
    category: "Sunscreen",
    skinType: ["All"],
    rating: 4.9,
    reviews: 621,
    image: "/sunscreen-bottle.jpg",
    badge: "Essential",
    tags: ["Home Replacement Service", "Gold List"],
    inStock: true,
  },
  {
    id: "7",
    name: "AHA/BHA Exfoliating Toner",
    brand: "ExfoliPro",
    description: "Dual-action toner that gently exfoliates and brightens skin",
    price: 29.99,
    category: "Toners",
    skinType: ["Oily", "Combination", "Acne-Prone"],
    rating: 4.7,
    reviews: 298,
    image: "/exfoliating-toner.jpg",
    tags: ["Free Home Return"],
    inStock: true,
  },
  {
    id: "8",
    name: "Peptide Eye Cream",
    brand: "EyeRevive",
    description: "Reduces dark circles and puffiness with peptide complex",
    price: 42.0,
    category: "Eye Care",
    skinType: ["All", "Aging"],
    rating: 4.6,
    reviews: 234,
    image: "/eye-cream-tube.jpg",
    tags: [],
    inStock: true,
  },
  {
    id: "9",
    name: "Hydrating Face Mask",
    brand: "MaskMagic",
    description: "Intensive hydration sheet mask with hyaluronic acid",
    price: 15.99,
    category: "Masks",
    skinType: ["Dry", "Normal"],
    rating: 4.8,
    reviews: 567,
    image: "/hydrating-mask.jpg",
    tags: ["100k+ Orders in 90 Days"],
    inStock: true,
  },
  {
    id: "10",
    name: "Vitamin E Night Oil",
    brand: "NightGlow",
    description: "Nourishing facial oil for overnight skin repair",
    price: 36.5,
    category: "Oils",
    skinType: ["Dry", "Normal", "Aging"],
    rating: 4.7,
    reviews: 189,
    image: "/vitamin-e-oil.jpg",
    tags: [],
    inStock: true,
  },
  {
    id: "11",
    name: "Salicylic Acid Acne Treatment",
    brand: "AcneClear",
    description: "Targeted treatment for acne and blemishes with 2% salicylic acid",
    price: 22.99,
    category: "Treatments",
    skinType: ["Oily", "Acne-Prone"],
    rating: 4.5,
    reviews: 412,
    image: "/acne-treatment.jpg",
    tags: ["Gold List"],
    inStock: true,
  },
  {
    id: "12",
    name: "Collagen Boosting Serum",
    brand: "CollagenPro",
    description: "Firms and plumps skin with marine collagen peptides",
    price: 48.0,
    category: "Serums",
    skinType: ["Aging", "Normal", "Dry"],
    rating: 4.8,
    reviews: 276,
    image: "/collagen-serum.jpg",
    badge: "Premium",
    tags: ["Home Replacement Service", "Free Home Return"],
    inStock: true,
  },
  {
    id: "13",
    name: "Micellar Cleansing Water",
    brand: "PureClean",
    description: "Gentle makeup remover and cleanser in one",
    price: 18.99,
    category: "Cleansers",
    skinType: ["All", "Sensitive"],
    rating: 4.7,
    reviews: 534,
    image: "/micellar-water.jpg",
    tags: [],
    inStock: true,
  },
  {
    id: "14",
    name: "Rose Water Toner",
    brand: "RoseGlow",
    description: "Soothing and hydrating toner with pure rose water",
    price: 21.5,
    category: "Toners",
    skinType: ["Dry", "Sensitive", "Normal"],
    rating: 4.6,
    reviews: 345,
    image: "/rose-toner.jpg",
    tags: [],
    inStock: true,
  },
  {
    id: "15",
    name: "Ceramide Barrier Cream",
    brand: "BarrierFix",
    description: "Strengthens skin barrier with ceramide complex",
    price: 44.99,
    category: "Moisturizers",
    skinType: ["Dry", "Sensitive"],
    rating: 4.9,
    reviews: 423,
    image: "/ceramide-cream.jpg",
    badge: "Dermatologist Recommended",
    tags: ["Gold List", "100k+ Orders in 90 Days"],
    inStock: true,
  },
  {
    id: "16",
    name: "Glycolic Acid Peel Pads",
    brand: "ExfoliPro",
    description: "Pre-soaked pads for gentle at-home chemical exfoliation",
    price: 34.0,
    category: "Treatments",
    skinType: ["Normal", "Oily", "Combination"],
    rating: 4.7,
    reviews: 267,
    image: "/peel-pads.jpg",
    tags: [],
    inStock: true,
  },
]

export const categories = [
  "All",
  "Cleansers",
  "Toners",
  "Serums",
  "Moisturizers",
  "Treatments",
  "Masks",
  "Eye Care",
  "Sunscreen",
  "Oils",
  "Essences",
  "Lip Care",
]

export const skinTypes = ["All", "Dry", "Oily", "Combination", "Sensitive", "Normal", "Aging", "Acne-Prone", "Dull"]
