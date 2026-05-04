"use client"

import { useCart } from "@/contexts/cart-context"
import { useUserActivity } from "@/contexts/user-activity-context"
import type { Product } from "@/lib/products-data"
import { products } from "@/lib/products-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VideoPlayer } from "@/components/video-player"
import { Star, Heart, ShoppingCart, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { favoriteProducts, toggleFavoriteProduct, addFootprint } = useUserActivity()
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviewFilter, setReviewFilter] = useState("most-helpful")
  const [starFilter, setStarFilter] = useState<number | null>(null)

  const isFavorite = product ? favoriteProducts.has(product.id) : false

  useEffect(() => {
    if (product) {
      addFootprint({
        id: product.id,
        type: "product",
        title: product.name,
        image: product.image,
      })
    }
  }, [product])

  const currentPrice = selectedVariant?.price || product.price
  const currentOriginalPrice = selectedVariant?.originalPrice || product.originalPrice
  const productImages = product.images || [product.image]

  const totalRatings = product.ratingBreakdown
    ? Object.values(product.ratingBreakdown).reduce((a, b) => a + b, 0)
    : product.reviews

  const getRatingPercentage = (star: number) => {
    if (!product.ratingBreakdown) return 0
    return (product.ratingBreakdown[star as keyof typeof product.ratingBreakdown] / totalRatings) * 100
  }

  const filteredReviews = product.customerReviews
    ? product.customerReviews.filter((review) => (starFilter ? review.rating === starFilter : true))
    : []

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (reviewFilter === "most-helpful") return b.helpful - a.helpful
    if (reviewFilter === "most-recent") return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (reviewFilter === "highest-rating") return b.rating - a.rating
    if (reviewFilter === "lowest-rating") return a.rating - b.rating
    return 0
  })

  const handleAddToCart = () => {
    addToCart({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      name: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name,
      price: currentPrice,
      image: product.image,
      quantity: quantity,
    })
    toast.success("Added to cart!")
  }

  const handleToggleFavorite = () => {
    toggleFavoriteProduct(product.id)
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites")
  }

  const similarProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/dashboard/shop" className="hover:text-foreground">
          Shop
        </Link>
        {" / "}
        <Link href={`/dashboard/shop?category=${product.category}`} className="hover:text-foreground">
          {product.category}
        </Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden relative">
            <Image
              src={productImages[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.badge && <Badge className="absolute top-4 right-4 bg-purple-600">{product.badge}</Badge>}
          </div>

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === idx ? "border-purple-600" : "border-transparent"
                  }`}
                >
                  <Image src={img || "/placeholder.svg"} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{product.brand}</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
              <Badge variant="outline">{product.category}</Badge>
            </div>

            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-purple-600">${currentPrice}</span>
              {currentOriginalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">${currentOriginalPrice}</span>
                  <Badge variant="destructive">Save ${(currentOriginalPrice - currentPrice).toFixed(2)}</Badge>
                </>
              )}
            </div>
          </div>

          {/* Skin Type */}
          <div className="space-y-3">
            <div>
              <span className="font-medium">Suitable for: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.skinType.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <span className="font-medium">Select Size:</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button size="lg" variant="outline" onClick={handleToggleFavorite}>
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current text-red-500" : ""}`} />
            </Button>
          </div>

          {product.inStock && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">In Stock - Ships within 2-3 business days</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Section */}
      {product.videoUrl && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Product Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoPlayer url={product.videoUrl} title={`${product.name} Demo`} />
          </CardContent>
        </Card>
      )}

      {/* Product Details */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {product.detailedDescription && (
            <div>
              <h3 className="text-xl font-semibold mb-3">About This Product</h3>
              <p className="text-muted-foreground leading-relaxed">{product.detailedDescription}</p>
            </div>
          )}

          {product.highlights && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {product.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.benefits && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.usage && (
            <div>
              <h3 className="text-xl font-semibold mb-3">How to Use</h3>
              <p className="text-muted-foreground">{product.usage}</p>
            </div>
          )}

          {product.ingredients && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {similarProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/shop/${relatedProduct.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-t-lg overflow-hidden relative">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
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
      {/* </CHANGE> */}
    </div>
  )
}
