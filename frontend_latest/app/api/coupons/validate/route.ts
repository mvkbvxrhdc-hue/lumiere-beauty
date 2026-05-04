import { NextRequest, NextResponse } from "next/server"

// Mock coupon data
const mockCoupons: Record<string, {
  id: string
  code: string
  name: string
  description: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_purchase: number
  max_discount: number | null
  valid_from: string
  valid_until: string
  usage_limit: number | null
  used_count: number
  is_active: boolean
  is_new_user_only: boolean
  applicable_categories: string[] | null
  applicable_products: string[] | null
}> = {
  "WELCOME20": {
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
  "SPRING50": {
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
  "SKINCARE15": {
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
  "VIP100": {
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
  "BIRTHDAY30": {
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
  "FREE30": {
    id: "6",
    code: "FREE30",
    name: "Limited-Time Offer",
    description: "Free shipping + $30 off orders over $99",
    discount_type: "fixed",
    discount_value: 30,
    min_purchase: 99,
    max_discount: null,
    valid_from: "2024-01-01",
    valid_until: "2025-12-31",
    usage_limit: 2000,
    used_count: 567,
    is_active: true,
    is_new_user_only: false,
    applicable_categories: null,
    applicable_products: null,
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, cartTotal, userId, isNewUser = true } = body

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Please enter a coupon code" },
        { status: 400 }
      )
    }

    const upperCode = code.toUpperCase().trim()
    const coupon = mockCoupons[upperCode]

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon code" },
        { status: 400 }
      )
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return NextResponse.json(
        { success: false, error: "This coupon is no longer valid" },
        { status: 400 }
      )
    }

    // Check validity period
    const now = new Date()
    const validFrom = new Date(coupon.valid_from)
    const validUntil = new Date(coupon.valid_until)

    if (now < validFrom) {
      return NextResponse.json(
        { success: false, error: `This coupon is valid from ${coupon.valid_from}` },
        { status: 400 }
      )
    }

    if (now > validUntil) {
      return NextResponse.json(
        { success: false, error: "This coupon has expired" },
        { status: 400 }
      )
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json(
        { success: false, error: "This coupon has reached its usage limit" },
        { status: 400 }
      )
    }

    // Check new user restriction
    if (coupon.is_new_user_only && !isNewUser) {
      return NextResponse.json(
        { success: false, error: "This coupon is for new customers only" },
        { status: 400 }
      )
    }

    // Check minimum purchase
    if (cartTotal < coupon.min_purchase) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order of $${coupon.min_purchase} required. Your cart total is $${cartTotal.toFixed(2)}`
        },
        { status: 400 }
      )
    }

    // Calculate discount amount
    let discountAmount = 0
    if (coupon.discount_type === "percentage") {
      discountAmount = (cartTotal * coupon.discount_value) / 100
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount
      }
    } else {
      discountAmount = coupon.discount_value
    }

    // Cap discount at cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        max_discount: coupon.max_discount,
        min_purchase: coupon.min_purchase,
      },
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalTotal: Math.round((cartTotal - discountAmount) * 100) / 100,
    })
  } catch (error) {
    console.error("[v0] Error validating coupon:", error)
    return NextResponse.json(
      { success: false, error: "Error validating coupon" },
      { status: 500 }
    )
  }
}
