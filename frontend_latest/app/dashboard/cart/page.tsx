'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CouponInput, AppliedCoupon, CouponCard } from '@/components/coupon-input'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId)
    toast.success(`${productName} removed from cart`)
  }

  const handleCouponApplied = (coupon: AppliedCoupon | null, discount: number) => {
    setAppliedCoupon(coupon)
    setDiscountAmount(discount)
    if (coupon) {
      toast.success(`Coupon "${coupon.name}" applied - Save $${discount.toFixed(2)}`)
    }
  }

  const subtotal = totalPrice
  const shipping = subtotal >= 99 ? 0 : 10
  const tax = subtotal * 0.06
  const finalTotal = subtotal - discountAmount + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-lg text-muted-foreground">You haven't added any products yet</p>
          <Button asChild size="lg">
            <Link href="/dashboard/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">{totalItems} items</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            clearCart()
            setAppliedCoupon(null)
            setDiscountAmount(0)
            toast.success('Cart cleared')
          }}
        >
          Clear Cart
        </Button>
      </div>

      {/* New User Coupon Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">New User Special Offer</p>
            <p className="text-sm text-muted-foreground">
              Use code <span className="font-mono font-semibold text-primary">WELCOME20</span> for 20% off your first order
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText('WELCOME20')
              toast.success('Code copied to clipboard')
            }}
          >
            Copy
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/dashboard/products/${item.id}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id, item.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.price}/each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coupon Input */}
              <CouponInput
                cartTotal={subtotal}
                onCouponApplied={handleCouponApplied}
                appliedCoupon={appliedCoupon}
              />

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal < 99 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(99 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${finalTotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <p className="text-sm text-center text-green-600">
                  You saved ${discountAmount.toFixed(2)}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button asChild className="w-full" size="lg">
                <Link
                  href={{
                    pathname: '/dashboard/checkout',
                    query: appliedCoupon ? {
                      couponCode: appliedCoupon.code,
                      discount: discountAmount
                    } : {}
                  }}
                >
                  Proceed to Checkout
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/dashboard/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Recommended Coupons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recommended Coupons</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CouponCard
            code="SPRING50"
            name="Spring Sale"
            description="$50 off orders over $200"
            discountType="fixed"
            discountValue={50}
            minPurchase={200}
            validUntil="2025-05-31"
            onClaim={() => {
              navigator.clipboard.writeText('SPRING50')
              toast.success('Code SPRING50 copied to clipboard')
            }}
          />
          <CouponCard
            code="SKINCARE15"
            name="Skincare Special"
            description="15% off skincare products"
            discountType="percentage"
            discountValue={15}
            minPurchase={150}
            maxDiscount={100}
            validUntil="2025-12-31"
            onClaim={() => {
              navigator.clipboard.writeText('SKINCARE15')
              toast.success('Code SKINCARE15 copied to clipboard')
            }}
          />
        </div>
      </div>
    </div>
  )
}
