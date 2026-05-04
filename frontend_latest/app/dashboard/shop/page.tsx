import { createClient } from "@/lib/supabase-server"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ShopPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from("products").select("*")

  const categories = ["All", "Serums", "Moisturizers", "Treatments", "Cleansers", "Sunscreen", "Masks", "Toners"]
  const skinTypes = ["All", "Dry", "Oily", "Combination", "Sensitive", "Normal", "Aging", "Dull"]

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-16 mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800 mb-4">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Premium Skincare Collection
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Your Perfect Skincare
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated collection of {products?.length || 0} premium products from trusted brands. Find the perfect match
              for your skin type and concerns.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Filters would go here - for now simplified for server component */}

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700"
              >
                <Link href={`/dashboard/shop/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
                        {product.badge}
                      </Badge>
                    )}
                    {product.original_price && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 shadow-lg">
                        Save ${(product.original_price - product.price).toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </Link>
                <CardContent className="p-5">
                  <Link href={`/dashboard/shop/${product.id}`}>
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wide">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.review_count})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 2).map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-md"
                    size="sm"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                We couldn't find any products matching your filters. Try adjusting your search criteria.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
