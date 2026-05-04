"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Ticket, X, Check, Loader2, ChevronRight, Tag, Gift, Percent } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AppliedCoupon {
  id: string
  code: string
  name: string
  description: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  max_discount: number | null
  min_purchase: number
  discountAmount: number
}

interface CouponInputProps {
  cartTotal: number
  onCouponApplied: (coupon: AppliedCoupon | null, discountAmount: number) => void
  appliedCoupon: AppliedCoupon | null
  className?: string
}

const availableCoupons = [
  {
    id: "1",
    code: "WELCOME20",
    name: "New User Exclusive",
    description: "20% off your first order",
    discount_type: "percentage" as const,
    discount_value: 20,
    min_purchase: 100,
    max_discount: 50,
    valid_until: "2025-12-31",
    is_new_user_only: true,
  },
  {
    id: "2",
    code: "SPRING50",
    name: "Spring Sale",
    description: "$50 off orders over $200",
    discount_type: "fixed" as const,
    discount_value: 50,
    min_purchase: 200,
    max_discount: null,
    valid_until: "2025-05-31",
    is_new_user_only: false,
  },
  {
    id: "3",
    code: "SKINCARE15",
    name: "Skincare Special",
    description: "15% off all skincare products",
    discount_type: "percentage" as const,
    discount_value: 15,
    min_purchase: 150,
    max_discount: 100,
    valid_until: "2025-12-31",
    is_new_user_only: false,
  },
  {
    id: "6",
    code: "FREE30",
    name: "Limited-Time Offer",
    description: "Free shipping + $30 off orders over $99",
    discount_type: "fixed" as const,
    discount_value: 30,
    min_purchase: 99,
    max_discount: null,
    valid_until: "2025-12-31",
    is_new_user_only: false,
  },
]

export function CouponInput({
  cartTotal,
  onCouponApplied,
  appliedCoupon,
  className,
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const validateCoupon = async (code: string) => {
    if (!code.trim()) {
      setError("Please enter a coupon code")
      return
    }

    setIsValidating(true)
    setError(null)

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          cartTotal,
          isNewUser: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const appliedCouponData: AppliedCoupon = {
          ...data.coupon,
          discountAmount: data.discountAmount,
        }
        onCouponApplied(appliedCouponData, data.discountAmount)
        setCouponCode("")
        setIsDialogOpen(false)
      } else {
        setError(data.error || "Invalid coupon")
      }
    } catch (err) {
      setError("Error validating coupon. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const removeCoupon = () => {
    onCouponApplied(null, 0)
    setCouponCode("")
    setError(null)
  }

  const selectCoupon = (coupon: typeof availableCoupons[0]) => {
    setCouponCode(coupon.code)
    validateCoupon(coupon.code)
  }

  const isUsable = (coupon: typeof availableCoupons[0]) => {
    return cartTotal >= coupon.min_purchase
  }

  return (
    <div className={cn("space-y-3", className)}>
      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{appliedCoupon.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {appliedCoupon.code}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Saved ${appliedCoupon.discountAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeCoupon}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-dashed"
            >
              <span className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Apply Coupon
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Coupons
              </DialogTitle>
              <DialogDescription>
                Enter a coupon code or select from available offers
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase())
                    setError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      validateCoupon(couponCode)
                    }
                  }}
                  className="flex-1 uppercase"
                />
                <Button
                  onClick={() => validateCoupon(couponCode)}
                  disabled={isValidating || !couponCode.trim()}
                >
                  {isValidating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Available Coupons
                </p>
                <div className="max-h-[300px] space-y-2 overflow-y-auto">
                  {availableCoupons.map((coupon) => {
                    const usable = isUsable(coupon)
                    return (
                      <Card
                        key={coupon.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          usable
                            ? "hover:border-primary hover:shadow-sm"
                            : "opacity-60"
                        )}
                        onClick={() => usable && selectCoupon(coupon)}
                      >
                        <CardContent className="flex items-center gap-3 p-3">
                          <div
                            className={cn(
                              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg",
                              coupon.discount_type === "percentage"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {coupon.discount_type === "percentage" ? (
                              <Percent className="h-5 w-5" />
                            ) : (
                              <Tag className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">
                                {coupon.discount_type === "percentage"
                                  ? `${coupon.discount_value}% OFF`
                                  : `$${coupon.discount_value} OFF`}
                              </span>
                              {coupon.is_new_user_only && (
                                <Badge variant="secondary" className="text-xs">
                                  New Users
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {coupon.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {coupon.min_purchase > 0
                                ? `Min. order $${coupon.min_purchase}`
                                : "No minimum"}{" "}
                              · Expires {coupon.valid_until}
                            </p>
                          </div>
                          {usable ? (
                            <Button size="sm" variant="outline">
                              Use
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              ${(coupon.min_purchase - cartTotal).toFixed(0)} more needed
                            </span>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export function CouponCard({
  code,
  name,
  description,
  discountType,
  discountValue,
  minPurchase,
  maxDiscount,
  validUntil,
  isNewUserOnly,
  onClaim,
  isClaimed,
}: {
  code: string
  name: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minPurchase: number
  maxDiscount?: number | null
  validUntil: string
  isNewUserOnly?: boolean
  onClaim?: () => void
  isClaimed?: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary" />

      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around py-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-3 w-3 -mr-1.5 rounded-full bg-background"
          />
        ))}
      </div>

      <div className="flex items-center gap-4 p-4 pl-6">
        <div className="flex-shrink-0 text-center">
          <div className="flex items-baseline justify-center text-primary">
            {discountType === "percentage" ? (
              <>
                <span className="text-3xl font-bold">{discountValue}</span>
                <span className="text-lg font-medium">%</span>
              </>
            ) : (
              <>
                <span className="text-lg font-medium">$</span>
                <span className="text-3xl font-bold">{discountValue}</span>
              </>
            )}
          </div>
          {maxDiscount && discountType === "percentage" && (
            <p className="text-xs text-muted-foreground">Up to ${maxDiscount} off</p>
          )}
        </div>

        <div className="h-16 w-px bg-border" />

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{name}</h4>
            {isNewUserOnly && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                <Gift className="mr-1 h-3 w-3" />
                New Users
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground truncate">
            {description}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{minPurchase > 0 ? `Min. $${minPurchase}` : "No minimum"}</span>
            <span>·</span>
            <span>Expires {validUntil}</span>
          </div>
        </div>

        {onClaim && (
          <Button
            size="sm"
            variant={isClaimed ? "outline" : "default"}
            onClick={onClaim}
            disabled={isClaimed}
            className="flex-shrink-0"
          >
            {isClaimed ? "Claimed" : "Claim Now"}
          </Button>
        )}
      </div>

      <div className="border-t border-dashed bg-muted/30 px-4 py-2 pl-6">
        <p className="text-xs text-muted-foreground">
          Code: <span className="font-mono font-medium text-foreground">{code}</span>
        </p>
      </div>
    </div>
  )
}
