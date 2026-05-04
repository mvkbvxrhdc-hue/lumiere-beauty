import { NextRequest, NextResponse } from "next/server"

// Mock coupon data
const mockCoupons = [
  {
    id: "1",
    code: "WELCOME20",
    name: "New User Exclusive",
    description: "20% off your first order",
    discount_type: "percentage",
    discount_value: 20,
    min_purchase: 100,
    max_discount: 50,
    valid_from: "2024-01-01",
    valid_until: "2025-12-31",
    usage_limit: 1000,
    used_count: 156,
    is_active: true,
    is_new_user_only: true,
    applicable_categories: null,
    applicable_products: null,
  },
  {
    id: "2",
    code: "SPRING50",
    name: "Spring Sale",
    description: "$50 off orders over $200",
    discount_type: "fixed",
    discount_value: 50,
    min_purchase: 200,
    max_discount: null,
    valid_from: "2024-03-01",
    valid_until: "2025-05-31",
    usage_limit: 500,
    used_count: 89,
    is_active: true,
    is_new_user_only: false,
    applicable_categories: null,
    applicable_products: null,
  },
  {
    id: "3",
    code: "SKINCARE15",
    name: "Skincare Special",
    description: "15% off all skincare products",
    discount_type: "percentage",
    discount_value: 15,
    min_purchase: 150,
    max_discount: 100,
    valid_from: "2024-01-01",
    valid_until: "2025-12-31",
    usage_limit: null,
    used_count: 234,
    is_active: true,
    is_new_user_only: false,
    applicable_categories: ["skincare", "serum", "moisturizer"],
    applicable_products: null,
  },
  {
    id: "4",
    code: "VIP100",
    name: "VIP Member Offer",
    description: "$100 off orders over $500",
    discount_type: "fixed",
    discount_value: 100,
    min_purchase: 500,
    max_discount: null,
    valid_from: "2024-01-01",
    valid_until: "2025-12-31",
    usage_limit: 100,
    used_count: 45,
    is_active: true,
    is_new_user_only: false,
    applicable_categories: null,
    applicable_products: null,
  },
  {
    id: "5",
    code: "BIRTHDAY30",
    name: "Birthday Special",
    description: "30% off during your birthday month",
    discount_type: "percentage",
    discount_value: 30,
    min_purchase: 0,
    max_discount: 200,
    valid_from: "2024-01-01",
    valid_until: "2025-12-31",
    usage_limit: null,
    used_count: 67,
    is_active: true,
    is_new_user_only: false,
    applicable_categories: null,
    applicable_products: null,
  },
]

// GET - Fetch available coupons
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      coupons: mockCoupons.filter((c) => c.is_active),
    })
  } catch (error) {
    console.error("[v0] Error fetching coupons:", error)
    return NextResponse.json({
      success: true,
      coupons: mockCoupons.filter((c) => c.is_active),
    })
  }
}
