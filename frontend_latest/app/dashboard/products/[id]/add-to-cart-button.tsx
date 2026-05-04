"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
    } as any)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.in_stock}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      {product.in_stock ? "Add to Cart" : "Out of Stock"}
    </Button>
  )
}
