"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  TrendingUp,
  Zap,
  Droplets,
  Sun,
  Eye
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const userSkinProfile = {
  skinType: "combination",
  concerns: ["acne", "oiliness", "pores"],
  goals: ["clear skin", "oil control", "anti-aging"],
}

const recommendedProducts = [
  {
    id: "1",
    name: "Salicylic Acid Clarifying Serum",
    brand: "CeraVe",
    price: 28,
    originalPrice: 36,
    image: "/salicylic-acid-serum.jpg",
    rating: 4.8,
    reviews: 2341,
    reason: "For acne-prone skin",
    reasonIcon: "acne",
    badge: "Best Seller",
    tag: "Acne Control",
  },
  {
    id: "2",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    price: 12,
    image: "/niacinamide-serum.jpg",
    rating: 4.9,
    reviews: 5621,
    reason: "Minimizes pores",
    reasonIcon: "pores",
    badge: "Top Rated",
    tag: "Pore Care",
  },
  {
    id: "3",
    name: "Oil-Control Fluid SPF 50+",
    brand: "La Roche-Posay",
    price: 38,
    originalPrice: 46,
    image: "/oil-control-moisturizer.jpg",
    rating: 4.7,
    reviews: 1893,
    reason: "Combo-oily skin",
    reasonIcon: "oily",
    tag: "Oil Control",
  },
  {
    id: "4",
    name: "Gentle Skin Cleanser",
    brand: "Cetaphil",
    price: 18,
    image: "/gentle-cleanser.jpg",
    rating: 4.8,
    reviews: 3456,
    reason: "Gentle formula",
    reasonIcon: "gentle",
    tag: "Daily Cleanse",
  },
  {
    id: "5",
    name: "1% Retinol Booster",
    brand: "Paula's Choice",
    price: 52,
    originalPrice: 62,
    image: "/retinol-serum.jpg",
    rating: 4.9,
    reviews: 2187,
    reason: "Anti-aging must-have",
    reasonIcon: "aging",
    badge: "Editor's Pick",
    tag: "Anti-Aging",
  },
]

const recommendedCourses = [
  {
    id: "3",
    title: "Complete Acne Skin Care Guide",
    instructor: "Dr. Emily Zhang",
    image: "/acne-course-cover.jpg",
    duration: "3.5 hrs",
    rating: 4.9,
    students: 8934,
    reason: "Solve breakouts",
    level: "Intermediate",
    tag: "Acne Care",
  },
  {
    id: "1",
    title: "Skincare Foundations for Beginners",
    instructor: "Dr. Sarah Chen",
    image: "/skincare-basics-course.jpg",
    duration: "4 hrs",
    rating: 4.9,
    students: 12543,
    reason: "Build healthy habits",
    level: "Beginner",
    tag: "Basics",
    badge: "Free",
  },
  {
    id: "2",
    title: "Science of Anti-Aging Skincare",
    instructor: "Prof. Michael Lee",
    image: "/anti-aging-course-cover.jpg",
    duration: "5 hrs",
    rating: 4.8,
    students: 7821,
    reason: "Prevention first",
    level: "Advanced",
    tag: "Anti-Aging",
  },
]

const recommendedPosts = [
  {
    id: "1",
    title: "My Weekly Combo-Skin Routine — Fewer Breakouts After 2 Weeks!",
    author: "Bella Skincare Diary",
    authorAvatar: "/avatar-1.jpg",
    image: "/skincare-routine-post.jpg",
    likes: 2341,
    comments: 189,
    reason: "Same skin type",
    tag: "Routine",
  },
  {
    id: "2",
    title: "5 Oil-Control Products I Actually Repurchase",
    author: "Ingredient Lover",
    authorAvatar: "/avatar-2.jpg",
    image: "/oil-control-products-post.jpg",
    likes: 1876,
    comments: 234,
    reason: "Trending picks",
    tag: "Reviews",
  },
  {
    id: "3",
    title: "From Breakouts to Glass Skin — My 3-Month Transformation",
    author: "SkinNewbie",
    authorAvatar: "/avatar-3.jpg",
    image: "/before-after-post.jpg",
    likes: 5621,
    comments: 456,
    reason: "Real result",
    tag: "Journey",
    badge: "Featured",
  },
]

const getReasonIcon = (reason: string) => {
  switch (reason) {
    case "acne":
      return <Zap className="h-3 w-3" />
    case "pores":
      return <Eye className="h-3 w-3" />
    case "oily":
      return <Droplets className="h-3 w-3" />
    case "aging":
      return <Sun className="h-3 w-3" />
    default:
      return <Sparkles className="h-3 w-3" />
  }
}

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div className="relative group">
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-x-2"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: typeof recommendedProducts[0] }) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Link href={`/dashboard/products/${product.id}`}>
      <Card className="flex-shrink-0 w-[200px] overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-sm">
        <div className="relative aspect-square bg-muted/30">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-rose-500 text-white text-xs">
              {product.badge}
            </Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors"
          >
            <Heart className={cn("h-4 w-4", isLiked ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
          </button>
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur text-xs gap-1">
              {getReasonIcon(product.reasonIcon)}
              {product.reason}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3 space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
            <h4 className="font-medium text-sm line-clamp-2 leading-tight mt-0.5">{product.name}</h4>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CourseCard({ course }: { course: typeof recommendedCourses[0] }) {
  return (
    <Link href={`/dashboard/courses/${course.id}`}>
      <Card className="flex-shrink-0 w-[280px] overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-sm">
        <div className="relative aspect-video bg-muted/30">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {course.badge && (
            <Badge className="absolute top-2 left-2 bg-emerald-500 text-white text-xs">
              {course.badge}
            </Badge>
          )}
          <Badge variant="secondary" className="absolute top-2 right-2 bg-black/60 text-white text-xs border-0">
            {course.duration}
          </Badge>
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur text-xs gap-1">
              <TrendingUp className="h-3 w-3" />
              {course.reason}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3 space-y-2">
          <div>
            <Badge variant="outline" className="text-xs mb-1.5">{course.level}</Badge>
            <h4 className="font-medium text-sm line-clamp-2 leading-tight">{course.title}</h4>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{course.instructor}</p>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{course.rating}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function PostCard({ post }: { post: typeof recommendedPosts[0] }) {
  return (
    <Link href={`/dashboard/community`}>
      <Card className="flex-shrink-0 w-[260px] overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-sm">
        <div className="relative aspect-[4/3] bg-muted/30">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {post.badge && (
            <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-xs">
              {post.badge}
            </Badge>
          )}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur text-xs gap-1">
              <MessageSquare className="h-3 w-3" />
              {post.reason}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3 space-y-2">
          <h4 className="font-medium text-sm line-clamp-2 leading-tight">{post.title}</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-muted">
                <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" />
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">{post.author}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Heart className="h-3 w-3" />
                {post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function PersonalizedRecommendations() {
  return (
    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-muted/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Recommended for You</h2>
              <p className="text-sm text-muted-foreground">Based on your skin analysis and browsing history</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1 bg-primary/5 text-primary border-primary/20">
              <Droplets className="h-3 w-3" />
              Combination Skin
            </Badge>
            <Badge variant="outline" className="text-xs gap-1 bg-amber-50 text-amber-600 border-amber-200">
              <Zap className="h-3 w-3" />
              Acne Care
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-4 bg-muted/50">
            <TabsTrigger value="products" className="gap-1.5 data-[state=active]:bg-background">
              <ShoppingBag className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-1.5 data-[state=active]:bg-background">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="posts" className="gap-1.5 data-[state=active]:bg-background">
              <MessageSquare className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-0">
            <HorizontalScroll>
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </HorizontalScroll>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/products" className="gap-1.5">
                  View All Products
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="mt-0">
            <HorizontalScroll>
              {recommendedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </HorizontalScroll>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/courses" className="gap-1.5">
                  View All Courses
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="mt-0">
            <HorizontalScroll>
              {recommendedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </HorizontalScroll>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/community" className="gap-1.5">
                  Explore Community
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
