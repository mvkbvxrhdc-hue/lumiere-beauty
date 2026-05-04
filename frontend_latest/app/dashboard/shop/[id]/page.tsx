import { createClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductDetailClient } from "./product-detail-client"

export const dynamic = "force-dynamic"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch product from database
  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mt-2">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/dashboard/shop">
          <Button className="mt-4">Back to Shop</Button>
        </Link>
      </div>
    )
  }

  // Transform database product to match the interface expected by ProductDetailClient
  // This ensures compatibility with the existing client component
  const transformedProduct = {
    ...product,
    image: product.image_url,
    reviews: product.review_count,
    skinType: product.skin_types,
    // Add other necessary transformations if needed
  }

  return <ProductDetailClient product={transformedProduct} />
}
