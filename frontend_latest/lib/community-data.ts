export interface Post {
  id: string
  author: {
    name: string
    avatar: string
    role: string
    isProfessional?: boolean // Added professional flag for doctors/experts
  }
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: string
  videoUrl?: string
}

export interface Comment {
  id: string
  postId: string
  author: {
    name: string
    avatar: string
  }
  content: string
  likes: number
  createdAt: string
  parentId?: string
}

export const initialPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/avatar-1.jpg",
      role: "Skincare Expert",
    },
    title: "My Complete Morning Skincare Routine for Glowing Skin",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: `After years of trial and error, I've finally perfected my morning routine that gives me that radiant, healthy glow everyone asks about! Let me walk you through each step and explain why I chose these specific products.

**Step 1: Gentle Cleanser (CeraVe Hydrating Facial Cleanser)**
I start with a gentle, non-foaming cleanser because harsh cleansers stripped my skin's natural oils. This one contains ceramides and hyaluronic acid to maintain the skin barrier while cleansing. I massage it onto damp skin for 60 seconds, focusing on my T-zone where I tend to get oily.

**Step 2: Vitamin C Serum (Timeless 20% Vitamin C + E Ferulic Acid)**
This is my holy grail for brightening! I apply 3-4 drops to my face and neck immediately after cleansing while my skin is still slightly damp. Vitamin C helps fade dark spots, brightens overall complexion, and provides antioxidant protection. The key is to let it absorb for at least 2-3 minutes before moving to the next step.

**Step 3: Hyaluronic Acid Serum (The Ordinary Hyaluronic Acid 2% + B5)**
On top of the vitamin C, I layer hyaluronic acid to lock in moisture. I apply it to damp skin because HA draws moisture from the environment, so you want your skin slightly wet. This plumps up fine lines and gives that dewy look.

**Step 4: Eye Cream (CeraVe Eye Repair Cream)**
I gently pat (never rub!) eye cream around my orbital bone, starting from the inner corner and moving outward. This helps with dark circles and prevents fine lines. The caffeine in this formula also depuffs morning eye bags.

**Step 5: Moisturizer (Neutrogena Hydro Boost Water Gel)**
Even with oily skin, moisturizer is essential! This gel-cream texture hydrates without feeling heavy. I use about a nickel-sized amount and apply it in upward motions to prevent sagging.

**Step 6: Sunscreen (La Roche-Posay Anthelios Melt-in Milk SPF 60)**
This is THE most important step! I use a generous amount (about 1/4 teaspoon for face) and reapply every 2 hours if I'm outside. This sunscreen doesn't leave a white cast and works beautifully under makeup.

**Step 7: Lip Care (Aquaphor)**
Finally, I apply a thin layer of Aquaphor to my lips to keep them hydrated throughout the day.

**Key Tips:**
- Wait 1-2 minutes between each step for better absorption
- Apply products from thinnest to thickest consistency
- Don't forget your neck and décolletage!
- Consistency is key - I've been doing this routine for 3 months and the results are incredible

The total routine takes about 10 minutes, and my skin has never looked better. My dark spots have faded by about 60%, my skin texture is smoother, and I have that natural glow without makeup. Happy to answer any questions!`,
    excerpt:
      "Sharing my detailed 7-step morning routine that transformed my skin in 3 months with product recommendations",
    category: "Routines",
    tags: ["Morning Routine", "Glowing Skin", "Skincare Tips", "Product Reviews"],
    likes: 1234,
    comments: 187,
    views: 8903,
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    author: {
      name: "Emily Rodriguez",
      avatar: "/avatars/avatar-2.jpg",
      role: "Beauty Enthusiast",
    },
    title: "Retinol vs Bakuchiol: Which One Should You Choose?",
    content: `I've spent the last 6 months testing both retinol and bakuchiol extensively, and I want to share my comprehensive findings to help you decide which anti-aging ingredient is right for your skin!

**What is Retinol?**
Retinol is a derivative of Vitamin A and has been the gold standard in anti-aging skincare for decades. It works by increasing cell turnover, stimulating collagen production, and unclogging pores. Dermatologists love it because there's extensive research proving its effectiveness.

**Benefits of Retinol:**
- Proven to reduce fine lines and wrinkles (backed by 40+ years of research)
- Improves skin texture and tone
- Treats acne and prevents breakouts
- Fades hyperpigmentation and sun damage
- Increases collagen production
- Refines pores

**Drawbacks of Retinol:**
- Can cause irritation, redness, peeling (especially when starting)
- Makes skin more sensitive to sun (must wear SPF!)
- Not safe during pregnancy/breastfeeding
- Takes time to build tolerance (usually 6-8 weeks)
- Can cause "retinol purging" initially

**What is Bakuchiol?**
Bakuchiol is a plant-derived ingredient from the Psoralea corylifolia plant. It's been marketed as a "natural alternative to retinol" because studies show it provides similar benefits without the irritation.

**Benefits of Bakuchiol:**
- Gentle on sensitive skin - minimal irritation
- No photosensitivity (can use morning and night!)
- Safe during pregnancy and breastfeeding
- Antioxidant and anti-inflammatory properties
- No purging period
- Works well with other actives

**Drawbacks of Bakuchiol:**
- Less research compared to retinol (only studied since 2014)
- May be less potent for severe aging concerns
- More expensive per ounce
- Takes longer to see results (3-4 months vs 2-3 for retinol)
- Limited product options available

**My Personal Experience:**

*Retinol Journey (3 months):*
I used The Ordinary Retinol 0.5% in Squalane every other night. The first 2 weeks were rough - my skin was red, flaky, and sensitive. But I pushed through, and by week 6, my skin looked incredible! My acne scars faded significantly, pores looked smaller, and fine lines around my eyes improved. However, I had to be diligent about sunscreen.

*Bakuchiol Journey (3 months):*
I switched to Biossance Squalane + Phyto-Retinol Serum and used it nightly. No irritation at all! My skin felt soothed and looked brighter within 2 weeks. Results came more gradually, but by month 3, I noticed improved firmness and some reduction in fine lines. It's definitely gentler but maybe slightly less dramatic.

**Who Should Choose Retinol:**
- You have resilient skin that can handle actives
- You're dealing with significant aging concerns or acne
- You want faster, more dramatic results
- You're committed to strict sun protection
- You're not pregnant/breastfeeding

**Who Should Choose Bakuchiol:**
- You have sensitive, reactive, or rosacea-prone skin
- You're pregnant or breastfeeding
- You want anti-aging benefits without irritation
- You forget to wear sunscreen (though you still should!)
- You're new to anti-aging ingredients

**My Verdict:**
Both are excellent! I now use retinol 2x per week for its powerful effects and bakuchiol on other nights to maintain results without irritation. This combination gives me the best of both worlds!

What has been your experience with these ingredients? Drop your thoughts below!`,
    excerpt:
      "A comprehensive, science-backed comparison of retinol and bakuchiol with personal testing results and recommendations",
    category: "Ingredients",
    tags: ["Retinol", "Bakuchiol", "Anti-Aging", "Ingredient Comparison", "Sensitive Skin"],
    likes: 892,
    comments: 156,
    views: 6234,
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    author: {
      name: "Dr. Lisa Wang",
      avatar: "/avatars/avatar-3.jpg",
      role: "Dermatologist",
      isProfessional: true,
    },
    title: "The Truth About Chemical Peels: What You Need to Know",
    content: `As a board-certified dermatologist with 12 years of experience performing chemical peels, I want to demystify this popular treatment and provide you with accurate, medical information.

**What Are Chemical Peels?**
Chemical peels are professional treatments that use acids to exfoliate the skin at varying depths. They accelerate cell turnover, revealing fresher, younger-looking skin underneath. There are three main categories: superficial, medium, and deep peels.

**Types of Chemical Peels:**

1. **Superficial Peels (AHA/BHA - Glycolic, Salicylic, Lactic Acid)**
   - Penetration: Epidermis only (outermost layer)
   - Downtime: 1-3 days of mild flaking
   - Frequency: Every 2-4 weeks
   - Best for: Dull skin, mild acne, fine lines, uneven tone
   - Pain level: Mild tingling (2/10)
   
2. **Medium Peels (TCA 20-35%)**
   - Penetration: Upper dermis
   - Downtime: 7-14 days with significant peeling
   - Frequency: Every 6-12 months
   - Best for: Moderate sun damage, acne scars, pigmentation
   - Pain level: Moderate burning (5/10)
   
3. **Deep Peels (Phenol, TCA 50%+)**
   - Penetration: Mid-dermal layer
   - Downtime: 2-3 weeks with crusting and redness
   - Frequency: Once in a lifetime
   - Best for: Severe wrinkles, deep scars, precancerous growths
   - Pain level: Requires sedation (8/10)

**What Chemical Peels Can Treat:**
✓ Acne and acne scars
✓ Fine lines and wrinkles
✓ Sun damage and age spots
✓ Melasma and hyperpigmentation
✓ Uneven skin tone and texture
✓ Large pores
✓ Dullness

**What They Cannot Treat:**
✗ Deep wrinkles (need injectables)
✗ Severe skin laxity (need surgery)
✗ Active infections or open wounds
✗ Rosacea (may worsen it)

**The Procedure:**
Before the peel, I thoroughly cleanse and degrease the skin. Then I apply the chemical solution with precise timing - this is crucial! You'll feel tingling to burning depending on the peel strength. I neutralize or remove the solution at the exact right moment. The entire procedure takes 30-60 minutes.

**What to Expect After:**
- **Days 1-2:** Skin feels tight and looks slightly red
- **Days 3-5:** Peeling begins (looks like sunburn flaking)
- **Days 6-7:** Most visible peeling is complete
- **Week 2-4:** Continued improvement as new skin emerges

**Critical Aftercare Instructions:**
1. NO picking at peeling skin (can cause scarring!)
2. Gentle cleanser only - no harsh products
3. Heavy moisturizer and healing ointment
4. SPF 50+ religiously (skin is vulnerable to sun damage)
5. Avoid makeup for 24-48 hours
6. No gym/sweating for 48 hours
7. Sleep with head elevated to reduce swelling

**Who Should NOT Get Chemical Peels:**
- Pregnant or breastfeeding women
- Active cold sores or skin infections
- Recent Accutane use (wait 6-12 months)
- Keloid scarring tendency
- Very dark skin tones (risk of hyperpigmentation with deep peels)

**Results Timeline:**
- Superficial: Immediate glow, optimal at 1 week
- Medium: Visible results at 2 weeks, optimal at 6 weeks
- Deep: Dramatic results at 3-6 months

**Professional vs At-Home:**
At-home peels (like The Ordinary 30% AHA peel) are much milder and safer for unsupervised use. They provide gentle exfoliation but cannot achieve the dramatic results of professional peels. I recommend starting at-home and graduating to professional if you want stronger results.

**My Professional Recommendations:**
For most patients concerned about aging, I suggest starting with a series of 4-6 superficial peels spaced 3-4 weeks apart. This provides excellent results with minimal downtime. If you're still not satisfied, we can discuss a medium peel.

**Cost Expectations:**
- Superficial: $100-200 per session
- Medium: $500-1000 per session
- Deep: $2000-3000 (rarely performed now)

**Questions I Get Most:**
Q: Will it hurt?
A: Superficial peels are very tolerable. Medium peels can be uncomfortable but manageable. We can apply numbing cream if needed.

Q: How many do I need?
A: Superficial peels work best as a series. Medium peels often provide significant improvement in 1-2 sessions.

Q: Can I do it in summer?
A: It's better to avoid summer due to sun exposure, but if you're diligent with SPF and sun avoidance, it can be done year-round.

If you're considering a chemical peel, schedule a consultation with a board-certified dermatologist to discuss which type is right for your skin concerns and type. Happy to answer specific questions in the comments!`,
    excerpt:
      "Comprehensive medical guide to chemical peels including types, procedures, results, and aftercare from a dermatologist",
    category: "Treatments",
    tags: ["Chemical Peels", "Professional Treatment", "Dermatology", "Medical Advice", "Exfoliation"],
    likes: 2456,
    comments: 342,
    views: 15234,
    createdAt: "1 day ago",
  },
  {
    id: "4",
    author: {
      name: "Jessica Park",
      avatar: "/avatars/avatar-4.jpg",
      role: "K-Beauty Lover",
    },
    title: "10-Step Korean Skincare Routine Explained",
    content: "The famous Korean 10-step routine might seem overwhelming...",
    excerpt: "Breaking down each step of the K-beauty routine for beginners",
    category: "Routines",
    tags: ["K-Beauty", "Korean Skincare", "Routine Guide"],
    likes: 312,
    comments: 56,
    views: 1567,
    createdAt: "1 day ago",
  },
  {
    id: "5",
    author: {
      name: "Michael Thompson",
      avatar: "/avatars/avatar-5.jpg",
      role: "Skincare Blogger",
    },
    title: "Best Vitamin C Serums Under $50",
    content: "I've tested over 20 vitamin C serums in the past year...",
    excerpt: "My top 5 affordable vitamin C serums that actually work",
    category: "Reviews",
    tags: ["Vitamin C", "Product Reviews", "Budget Friendly"],
    likes: 278,
    comments: 41,
    views: 1089,
    createdAt: "2 days ago",
  },
  {
    id: "6",
    author: {
      name: "Amanda Foster",
      avatar: "/avatars/avatar-6.jpg",
      role: "Esthetician",
    },
    title: "How to Build a Skincare Routine for Sensitive Skin",
    content: "Sensitive skin requires extra care and attention. Here's my professional guide...",
    excerpt: "Essential tips for creating a gentle routine that won't irritate sensitive skin",
    category: "Routines",
    tags: ["Sensitive Skin", "Gentle Skincare", "Routine Building"],
    likes: 198,
    comments: 34,
    views: 876,
    createdAt: "3 hours ago",
  },
  {
    id: "7",
    author: {
      name: "David Kim",
      avatar: "/avatars/avatar-7.jpg",
      role: "Men's Grooming Expert",
    },
    title: "Skincare for Men: A Beginner's Guide",
    content: "Gentlemen, it's time to take care of your skin! Here's where to start...",
    excerpt: "Simple and effective skincare routine specifically designed for men",
    category: "Routines",
    tags: ["Men's Skincare", "Beginner Guide", "Simple Routine"],
    likes: 167,
    comments: 28,
    views: 654,
    createdAt: "6 hours ago",
  },
  {
    id: "8",
    author: {
      name: "Sophia Martinez",
      avatar: "/avatars/avatar-8.jpg",
      role: "Beauty Influencer",
    },
    title: "My Acne Journey: Before & After 6 Months",
    content: "Sharing my transformation and the products that helped clear my skin...",
    excerpt: "Real results from consistent skincare routine and lifestyle changes",
    category: "Before & After",
    tags: ["Acne Treatment", "Transformation", "Real Results"],
    likes: 523,
    comments: 89,
    views: 2876,
    createdAt: "8 hours ago",
  },
  {
    id: "9",
    author: {
      name: "Dr. James Anderson",
      avatar: "/avatars/avatar-9.jpg",
      role: "Dermatologist",
    },
    title: "Understanding Hyaluronic Acid: The Ultimate Hydrator",
    content: "Let me explain why hyaluronic acid is a must-have in your routine...",
    excerpt: "Scientific breakdown of how hyaluronic acid works and its benefits",
    category: "Ingredients",
    tags: ["Hyaluronic Acid", "Hydration", "Science"],
    likes: 401,
    comments: 67,
    views: 1789,
    createdAt: "12 hours ago",
  },
  {
    id: "10",
    author: {
      name: "Rachel Green",
      avatar: "/avatars/avatar-10.jpg",
      role: "Natural Beauty Advocate",
    },
    title: "DIY Face Masks Using Kitchen Ingredients",
    content: "You don't need expensive products! Try these natural face masks...",
    excerpt: "5 effective DIY face masks you can make at home with simple ingredients",
    category: "Treatments",
    tags: ["DIY", "Natural Skincare", "Home Remedies"],
    likes: 289,
    comments: 52,
    views: 1234,
    createdAt: "1 day ago",
  },
  {
    id: "11",
    author: {
      name: "Kevin Nguyen",
      avatar: "/avatars/avatar-11.jpg",
      role: "Product Reviewer",
    },
    title: "CeraVe vs Cetaphil: Which Drugstore Brand is Better?",
    content: "I've tested both brands extensively. Here's my honest comparison...",
    excerpt: "Detailed comparison of two popular affordable skincare brands",
    category: "Reviews",
    tags: ["CeraVe", "Cetaphil", "Drugstore Skincare"],
    likes: 345,
    comments: 61,
    views: 1567,
    createdAt: "1 day ago",
  },
  {
    id: "12",
    author: {
      name: "Isabella Santos",
      avatar: "/avatars/avatar-12.jpg",
      role: "Skincare Enthusiast",
    },
    title: "How I Faded My Dark Spots in 3 Months",
    content: "Hyperpigmentation was my biggest concern. Here's what worked for me...",
    excerpt: "My complete routine and products that helped fade dark spots",
    category: "Before & After",
    tags: ["Dark Spots", "Hyperpigmentation", "Brightening"],
    likes: 467,
    comments: 73,
    views: 2134,
    createdAt: "2 days ago",
  },
  {
    id: "13",
    author: {
      name: "Dr. Maya Patel",
      avatar: "/avatars/avatar-13.jpg",
      role: "Cosmetic Dermatologist",
      isProfessional: true,
    },
    title: "Microneedling: Is It Worth the Hype?",
    content: "As a dermatologist who performs microneedling, here's what you should know...",
    excerpt: "Professional insights on microneedling benefits, risks, and expectations",
    category: "Treatments",
    tags: ["Microneedling", "Professional Treatment", "Anti-Aging"],
    likes: 512,
    comments: 94,
    views: 2567,
    createdAt: "2 days ago",
  },
  {
    id: "14",
    author: {
      name: "Chris Taylor",
      avatar: "/avatars/avatar-14.jpg",
      role: "Skincare Blogger",
    },
    title: "The Best Sunscreens for Every Skin Type",
    content: "Sunscreen is non-negotiable! Here are my top picks for different skin types...",
    excerpt: "Comprehensive guide to finding the perfect sunscreen for your skin",
    category: "Reviews",
    tags: ["Sunscreen", "SPF", "Sun Protection"],
    likes: 378,
    comments: 58,
    views: 1678,
    createdAt: "2 days ago",
  },
  {
    id: "15",
    author: {
      name: "Nina Kowalski",
      avatar: "/avatars/avatar-15.jpg",
      role: "Beauty Editor",
    },
    title: "Niacinamide: The Multi-Tasking Ingredient Everyone Needs",
    content: "If you're not using niacinamide yet, here's why you should start...",
    excerpt: "Everything you need to know about this versatile skincare ingredient",
    category: "Ingredients",
    tags: ["Niacinamide", "Multi-Tasking", "Skincare Science"],
    likes: 423,
    comments: 69,
    views: 1923,
    createdAt: "3 days ago",
  },
  {
    id: "16",
    author: {
      name: "Alex Rivera",
      avatar: "/avatars/avatar-16.jpg",
      role: "Acne Specialist",
    },
    title: "How to Deal with Hormonal Acne: A Complete Guide",
    content: "Hormonal acne is different from regular acne. Here's how to treat it...",
    excerpt: "Understanding and treating hormonal acne with targeted solutions",
    category: "Treatments",
    tags: ["Hormonal Acne", "Acne Treatment", "Women's Health"],
    likes: 589,
    comments: 102,
    views: 3012,
    createdAt: "3 days ago",
  },
  {
    id: "17",
    author: {
      name: "Olivia Chen",
      avatar: "/avatars/avatar-17.jpg",
      role: "Clean Beauty Advocate",
    },
    title: "Transitioning to Clean Beauty: My Experience",
    content: "I switched to clean beauty products 6 months ago. Here's what happened...",
    excerpt: "Honest review of switching to clean and natural skincare products",
    category: "Reviews",
    tags: ["Clean Beauty", "Natural Products", "Sustainable"],
    likes: 267,
    comments: 45,
    views: 987,
    createdAt: "3 days ago",
  },
  {
    id: "18",
    author: {
      name: "Marcus Johnson",
      avatar: "/avatars/avatar-18.jpg",
      role: "Fitness & Skincare",
    },
    title: "How Exercise Transformed My Skin",
    content: "The connection between fitness and skin health is real. Here's my story...",
    excerpt: "How regular exercise improved my skin texture and overall glow",
    category: "Before & After",
    tags: ["Exercise", "Healthy Lifestyle", "Skin Health"],
    likes: 334,
    comments: 56,
    views: 1456,
    createdAt: "4 days ago",
  },
  {
    id: "19",
    author: {
      name: "Dr. Sarah Mitchell",
      avatar: "/avatars/avatar-19.jpg",
      role: "Dermatologist",
    },
    title: "The Science Behind Retinol: Why It Works",
    content: "Let me break down the science of retinol and why dermatologists love it...",
    excerpt: "Scientific explanation of retinol's anti-aging and skin-renewing properties",
    category: "Ingredients",
    tags: ["Retinol", "Anti-Aging", "Science"],
    likes: 678,
    comments: 112,
    views: 3456,
    createdAt: "4 days ago",
  },
  {
    id: "20",
    author: {
      name: "Lily Zhang",
      avatar: "/avatars/avatar-20.jpg",
      role: "Skincare Enthusiast",
    },
    title: "My Night Skincare Routine for Anti-Aging",
    content: "Nighttime is when your skin repairs itself. Here's my PM routine...",
    excerpt: "Detailed night routine focused on anti-aging and skin repair",
    category: "Routines",
    tags: ["Night Routine", "Anti-Aging", "Skin Repair"],
    likes: 412,
    comments: 68,
    views: 1834,
    createdAt: "5 days ago",
  },
  {
    id: "21",
    author: {
      name: "Daniel Park",
      avatar: "/avatars/avatar-21.jpg",
      role: "Product Formulator",
    },
    title: "What to Look for in Skincare Product Labels",
    content: "As a formulator, I'll teach you how to read ingredient lists like a pro...",
    excerpt: "Expert guide to understanding skincare ingredients and product labels",
    category: "Ingredients",
    tags: ["Product Labels", "Ingredients", "Education"],
    likes: 298,
    comments: 49,
    views: 1123,
    createdAt: "5 days ago",
  },
  {
    id: "22",
    author: {
      name: "Grace Williams",
      avatar: "/avatars/avatar-22.jpg",
      role: "Beauty Journalist",
    },
    title: "The Best Skincare Products of 2024",
    content: "I've tested hundreds of products this year. Here are the absolute best...",
    excerpt: "My top 10 skincare products that stood out in 2024",
    category: "Reviews",
    tags: ["Best Products", "2024", "Top Picks"],
    likes: 756,
    comments: 128,
    views: 4123,
    createdAt: "6 days ago",
  },
  {
    id: "23",
    author: {
      name: "Ryan Cooper",
      avatar: "/avatars/avatar-23.jpg",
      role: "Skincare Coach",
    },
    title: "Common Skincare Mistakes You're Probably Making",
    content: "Even skincare enthusiasts make these mistakes. Let me help you avoid them...",
    excerpt: "Top 10 skincare mistakes and how to fix them for better results",
    category: "Q&A",
    tags: ["Mistakes", "Tips", "Skincare Advice"],
    likes: 534,
    comments: 87,
    views: 2456,
    createdAt: "6 days ago",
  },
  {
    id: "24",
    author: {
      name: "Mia Anderson",
      avatar: "/avatars/avatar-24.jpg",
      role: "Esthetician",
    },
    title: "Professional Facials vs At-Home Treatments",
    content: "When should you see a professional and what can you do at home?...",
    excerpt: "Comparing professional treatments with at-home skincare options",
    category: "Treatments",
    tags: ["Facials", "Professional vs DIY", "Treatments"],
    likes: 389,
    comments: 64,
    views: 1678,
    createdAt: "1 week ago",
  },
  {
    id: "25",
    author: {
      name: "Jason Lee",
      avatar: "/avatars/avatar-25.jpg",
      role: "Skincare Scientist",
    },
    title: "Understanding pH Balance in Skincare",
    content: "pH matters more than you think! Here's the science behind it...",
    excerpt: "Why pH balance is crucial for healthy skin and how to maintain it",
    category: "Ingredients",
    tags: ["pH Balance", "Science", "Skin Health"],
    likes: 445,
    comments: 71,
    views: 1989,
    createdAt: "1 week ago",
  },
  {
    id: "26",
    author: {
      name: "Dr. Jennifer Kim",
      avatar: "/avatars/avatar-3.jpg",
      role: "Board-Certified Dermatologist",
      isProfessional: true,
    },
    title: "Understanding Acne: Causes, Types, and Treatment Options",
    content:
      "As a dermatologist with 15 years of experience, I want to share comprehensive information about acne. Acne is one of the most common skin conditions, affecting millions worldwide. In this post, I'll explain the different types of acne, what causes them, and the most effective treatment options available today. Understanding your acne type is crucial for effective treatment...",
    excerpt: "Professional medical guide to understanding and treating different types of acne",
    category: "Treatments",
    tags: ["Acne", "Medical Advice", "Professional", "Dermatology"],
    likes: 892,
    comments: 156,
    views: 5234,
    createdAt: "1 day ago",
  },
  {
    id: "27",
    author: {
      name: "Dr. Michael Chen",
      avatar: "/avatars/avatar-9.jpg",
      role: "Cosmetic Dermatologist",
      isProfessional: true,
    },
    title: "The Science of Anti-Aging: What Actually Works",
    content:
      "Let's talk about anti-aging from a medical perspective. There's so much misinformation out there, so I want to share evidence-based information about what truly works for preventing and treating signs of aging. I'll cover ingredients backed by scientific research, professional treatments, and lifestyle factors that impact skin aging...",
    excerpt: "Evidence-based guide to anti-aging skincare from a medical professional",
    category: "Ingredients",
    tags: ["Anti-Aging", "Medical Science", "Professional", "Evidence-Based"],
    likes: 1024,
    comments: 203,
    views: 6789,
    createdAt: "2 days ago",
  },
  {
    id: "28",
    author: {
      name: "Dr. Lisa Wang",
      avatar: "/avatars/avatar-13.jpg",
      role: "Dermatologist",
      isProfessional: true,
    },
    title: "How to Properly Apply Sunscreen: A Dermatologist's Guide",
    content:
      "Most people don't apply sunscreen correctly, which significantly reduces its effectiveness. In this video tutorial, I demonstrate the proper technique for applying sunscreen to ensure maximum protection. I'll also discuss how much to use, when to reapply, and common mistakes to avoid...",
    excerpt: "Video tutorial on proper sunscreen application technique from a dermatologist",
    category: "Treatments",
    tags: ["Sunscreen", "Tutorial", "Professional", "Sun Protection"],
    likes: 756,
    comments: 134,
    views: 4567,
    createdAt: "3 days ago",
  },
  {
    id: "29",
    author: {
      name: "Dr. Sarah Mitchell",
      avatar: "/avatars/avatar-19.jpg",
      role: "Dermatologist",
      isProfessional: true,
    },
    title: "Retinoids Explained: A Complete Medical Guide",
    content:
      "Retinoids are the gold standard in dermatology for treating acne and signs of aging. As a dermatologist, I want to provide you with comprehensive, medically accurate information about retinoids. I'll explain the different types (retinol, tretinoin, adapalene), how they work at a cellular level, proper usage, and how to minimize side effects...",
    excerpt: "Comprehensive medical guide to retinoids from a board-certified dermatologist",
    category: "Ingredients",
    tags: ["Retinoids", "Medical Guide", "Professional", "Prescription"],
    likes: 934,
    comments: 178,
    views: 5890,
    createdAt: "4 days ago",
  },
  {
    id: "30",
    author: {
      name: "Dr. Maya Patel",
      avatar: "/avatars/avatar-13.jpg",
      role: "Cosmetic Dermatologist",
      isProfessional: true,
    },
    title: "Rosacea: Diagnosis, Triggers, and Treatment Options",
    content:
      "Rosacea is a chronic inflammatory skin condition that affects millions of people. Many don't realize they have it or confuse it with other conditions. In this post, I'll help you understand rosacea, identify common triggers, and discuss both medical and lifestyle approaches to managing this condition effectively...",
    excerpt: "Medical guide to understanding and managing rosacea from a dermatologist",
    category: "Treatments",
    tags: ["Rosacea", "Skin Conditions", "Professional", "Medical"],
    likes: 678,
    comments: 145,
    views: 4123,
    createdAt: "5 days ago",
  },
]

export const initialComments: Comment[] = [
  {
    id: "c1",
    postId: "1",
    author: {
      name: "Anna Lee",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "This routine is amazing! I've been following it for 2 weeks and already see improvements in my skin texture. The vitamin C serum recommendation is spot on!",
    likes: 45,
    createdAt: "1 hour ago",
  },
  {
    id: "c2",
    postId: "1",
    author: {
      name: "Tom Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "What sunscreen do you recommend for oily skin? The one you mentioned sounds a bit heavy for my skin type.",
    likes: 23,
    createdAt: "30 minutes ago",
  },
  {
    id: "c3",
    postId: "1",
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/avatar-1.jpg",
    },
    content:
      "@Tom Wilson For oily skin, try the EltaMD UV Clear SPF 46! It's oil-free and actually helps control shine. Another great option is Supergoop Unseen Sunscreen which feels like a primer.",
    likes: 67,
    createdAt: "15 minutes ago",
  },
  {
    id: "c4",
    postId: "2",
    author: {
      name: "Jessica Park",
      avatar: "/avatars/avatar-4.jpg",
    },
    content:
      "Thank you for this detailed comparison! I have sensitive skin and was afraid to try retinol. I'm definitely going to start with bakuchiol first.",
    likes: 89,
    createdAt: "3 hours ago",
  },
  {
    id: "c5",
    postId: "2",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "I've been using retinol for 6 months and can confirm the results are worth the initial irritation! My advice: start slow with 0.25% and build up tolerance.",
    likes: 56,
    createdAt: "2 hours ago",
  },
  {
    id: "c6",
    postId: "3",
    author: {
      name: "Linda Martinez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "Dr. Wang, thank you for this comprehensive guide! I had a medium TCA peel done last month and wish I had read this beforehand. The information about aftercare is so important!",
    likes: 134,
    createdAt: "12 hours ago",
  },
  {
    id: "c7",
    postId: "3",
    author: {
      name: "Robert Kim",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "Question: I have melasma that won't budge with topicals. Would a medium peel help? I'm Asian with medium skin tone.",
    likes: 78,
    createdAt: "8 hours ago",
  },
  {
    id: "c8",
    postId: "3",
    author: {
      name: "Dr. Lisa Wang",
      avatar: "/avatars/avatar-3.jpg",
    },
    content:
      "@Robert Kim Melasma can be tricky! For medium to darker skin tones, I'd recommend starting with a series of superficial peels (glycolic or mandelic acid) combined with a good brightening regimen. Medium peels carry more risk of post-inflammatory hyperpigmentation in your case. Let's schedule a consultation to assess your specific situation!",
    likes: 156,
    createdAt: "6 hours ago",
  },
]

export const categories = ["All", "Routines", "Reviews", "Treatments", "Ingredients", "Q&A", "Before & After"]
