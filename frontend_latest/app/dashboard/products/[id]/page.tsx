import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, Share2, Check } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import AddToCartButton from "./add-to-cart-button"

export const dynamic = "force-dynamic"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const product = MOCK_PRODUCTS.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(
    0,
    4,
  )

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <Link href="/dashboard/products" className="hover:text-foreground">
          Products
        </Link>
        {" / "}
        <Link href={`/dashboard/products?category=${product.category}`} className="hover:text-foreground">
          {product.category}
        </Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center relative overflow-hidden">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <Badge className="absolute top-4 right-4 bg-purple-600 text-lg px-4 py-2">{product.badge}</Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.review_count} reviews)</span>
              </div>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <p className="text-lg text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-purple-600">${product.price}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">${product.original_price}</span>
                  <Badge variant="destructive">Save ${(product.original_price - product.price).toFixed(2)}</Badge>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="font-medium">Suitable for: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.skin_types &&
                  product.skin_types.map((type: string) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <AddToCartButton product={product} />
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {product.in_stock && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">In Stock - Ships within 2-3 business days</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.detailed_description || product.description}
            </p>
          </div>

          {product.highlights && product.highlights.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Highlights</h3>
              <ul className="space-y-2">
                {product.highlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/products/${relatedProduct.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-t-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={relatedProduct.image_url || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{relatedProduct.rating}</span>
                    </div>
                    <p className="text-lg font-bold text-purple-600">${relatedProduct.price}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
