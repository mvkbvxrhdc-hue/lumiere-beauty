"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, ShoppingCart, SlidersHorizontal, X, Sparkles, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  category: string
  skin_types: string[]
  rating: number
  review_count: number
  in_stock: boolean
  image_url?: string
  badge?: string
  brand: string
}

interface ProductsClientProps {
  initialProducts: Product[]
}

const categories = ["All", "Cleansers", "Toners", "Serums", "Moisturizers", "Sunscreen", "Masks", "Treatments"]
const skinTypes = ["All", "Normal", "Dry", "Oily", "Combination", "Sensitive", "Acne-Prone", "Aging"]

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSkinType, setSelectedSkinType] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const { addToCart } = useCart()

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSkinType =
      selectedSkinType === "All" || (product.skin_types && product.skin_types.includes(selectedSkinType))
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesSkinType && matchesPrice
  })

  const hasFilters = searchQuery || selectedCategory !== "All" || selectedSkinType !== "All"

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedSkinType("All")
    setPriceRange([0, 200])
  }

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image_url } as any)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-[#f5f4f8]">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1a1025] px-8 py-9">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 border border-violet-500/20 px-3.5 py-1.5">
                <Sparkles className="w-3 h-3 text-violet-300" />
                <span className="text-[11px] font-semibold text-violet-300 tracking-wide uppercase">Curated Collection</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Skincare Shop</h1>
              <p className="text-white/50 text-sm">
                {initialProducts.length}+ dermatologist-approved products — filtered for your skin type.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center">
                <div className="text-3xl font-black text-white leading-none">{initialProducts.length}+</div>
                <div className="mt-1 text-[10px] text-violet-300 uppercase tracking-widest font-semibold">Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm border-gray-200 bg-gray-50 focus-visible:ring-violet-500 rounded-xl"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 h-9 text-sm border-gray-200 rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedSkinType} onValueChange={setSelectedSkinType}>
              <SelectTrigger className="w-40 h-9 text-sm border-gray-200 rounded-xl">
                <SelectValue placeholder="Skin Type" />
              </SelectTrigger>
              <SelectContent>
                {skinTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 px-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl gap-1.5 text-xs"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {filteredProducts.length} of {initialProducts.length} shown
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
              {searchQuery && (
                <Badge variant="outline" className="text-[11px] bg-violet-50 border-violet-200 text-violet-700 gap-1">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")}><X className="w-2.5 h-2.5" /></button>
                </Badge>
              )}
              {selectedCategory !== "All" && (
                <Badge variant="outline" className="text-[11px] bg-violet-50 border-violet-200 text-violet-700 gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")}><X className="w-2.5 h-2.5" /></button>
                </Badge>
              )}
              {selectedSkinType !== "All" && (
                <Badge variant="outline" className="text-[11px] bg-violet-50 border-violet-200 text-violet-700 gap-1">
                  {selectedSkinType}
                  <button onClick={() => setSelectedSkinType("All")}><X className="w-2.5 h-2.5" /></button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-violet-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <Link href={`/dashboard/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {product.badge && (
                      <Badge className="absolute top-2.5 left-2.5 bg-violet-600 border-0 text-[10px] font-semibold">{product.badge}</Badge>
                    )}
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{product.brand}</p>
                  <Link href={`/dashboard/products/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mt-1 group-hover:text-violet-600 transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                    <span className="text-[11px] text-gray-400">({product.review_count})</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-violet-600">${product.price}</span>
                      {product.original_price && (
                        <span className="text-xs text-gray-400 line-through">${product.original_price}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="h-8 px-3 rounded-xl bg-[#1a1025] hover:bg-violet-700 text-white text-[11px] font-semibold"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.in_stock}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No products found</p>
            <p className="text-xs text-gray-400 mt-1 mb-5">Try adjusting your filters</p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-xl text-xs border-gray-200">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
