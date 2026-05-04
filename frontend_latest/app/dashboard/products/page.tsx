import { MOCK_PRODUCTS } from "@/lib/mock-data"
import ProductsClient from "./products-client"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const products = MOCK_PRODUCTS

  return <ProductsClient initialProducts={products || []} />
}
