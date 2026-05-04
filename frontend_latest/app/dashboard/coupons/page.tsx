'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Ticket,
  Gift,
  Percent,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Sparkles,
  ShoppingBag,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { CouponCard } from '@/components/coupon-input'
import Link from 'next/link'

// Mock user coupon data
const userCoupons = {
  available: [
    {
      id: '1',
      code: 'WELCOME20',
      name: 'New User Special',
      description: '20% off first order',
      discount_type: 'percentage' as const,
      discount_value: 20,
      min_purchase: 100,
      max_discount: 50,
      valid_from: '2024-01-01',
      valid_until: '2025-12-31',
      is_new_user_only: true,
      source: 'New User Registration',
    },
    {
      id: '2',
      code: 'SPRING50',
      name: 'Spring Sale',
      description: '$50 off orders over $200',
      discount_type: 'fixed' as const,
      discount_value: 50,
      min_purchase: 200,
      max_discount: null,
      valid_from: '2024-03-01',
      valid_until: '2025-05-31',
      is_new_user_only: false,
      source: 'Promotion',
    },
    {
      id: '3',
      code: 'SKINCARE15',
      name: 'Skincare Deal',
      description: '15% off skincare products',
      discount_type: 'percentage' as const,
      discount_value: 15,
      min_purchase: 150,
      max_discount: 100,
      valid_from: '2024-01-01',
      valid_until: '2025-12-31',
      is_new_user_only: false,
      source: 'Member Benefit',
    },
  ],
  used: [
    {
      id: 'u1',
      code: 'NEWYEAR100',
      name: 'New Year Special',
      description: '$100 off orders over $500',
      discount_type: 'fixed' as const,
      discount_value: 100,
      min_purchase: 500,
      max_discount: null,
      valid_from: '2024-01-01',
      valid_until: '2024-02-28',
      used_at: '2024-01-15',
      order_id: 'ORD20240115001',
    },
  ],
  expired: [
    {
      id: 'e1',
      code: 'DOUBLE11',
      name: 'Flash Sale',
      description: '$80 off orders over $300',
      discount_type: 'fixed' as const,
      discount_value: 80,
      min_purchase: 300,
      max_discount: null,
      valid_from: '2024-11-01',
      valid_until: '2024-11-11',
    },
  ],
}

// Claimable coupons
const claimableCoupons = [
  {
    id: 'c1',
    code: 'VIP100',
    name: 'VIP Exclusive',
    description: '$100 off for VIP members on orders over $500',
    discount_type: 'fixed' as const,
    discount_value: 100,
    min_purchase: 500,
    max_discount: null,
    valid_until: '2025-12-31',
    remaining: 55,
    total: 100,
  },
  {
    id: 'c2',
    code: 'BIRTHDAY30',
    name: 'Birthday Treat',
    description: '30% off during your birthday month',
    discount_type: 'percentage' as const,
    discount_value: 30,
    min_purchase: 0,
    max_discount: 200,
    valid_until: '2025-12-31',
    remaining: 100,
    total: 100,
  },
  {
    id: 'c3',
    code: 'FREE30',
    name: 'Limited Free Shipping',
    description: '$30 off + free shipping on orders over $99',
    discount_type: 'fixed' as const,
    discount_value: 30,
    min_purchase: 99,
    max_discount: null,
    valid_until: '2025-12-31',
    remaining: 1433,
    total: 2000,
  },
  {
    id: 'c4',
    code: 'SUMMER25',
    name: 'Summer Refresh',
    description: '25% off summer skincare products',
    discount_type: 'percentage' as const,
    discount_value: 25,
    min_purchase: 200,
    max_discount: 150,
    valid_until: '2025-08-31',
    remaining: 234,
    total: 500,
  },
]

export default function CouponsPage() {
  const [redeemCode, setRedeemCode] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [claimedCoupons, setClaimedCoupons] = useState<string[]>([])

  const handleRedeem = async () => {
    if (!redeemCode.trim()) {
      toast.error('Please enter a code')
      return
    }

    setIsRedeeming(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simulate validation
    if (redeemCode.toUpperCase() === 'GIFT2024') {
      toast.success('Successfully redeemed! You got $20 off coupon')
      setRedeemCode('')
    } else {
      toast.error('Invalid or expired code')
    }

    setIsRedeeming(false)
  }

  const handleClaim = (couponId: string, couponCode: string) => {
    if (claimedCoupons.includes(couponId)) {
      navigator.clipboard.writeText(couponCode)
      toast.success(`Code ${couponCode} copied`)
      return
    }

    setClaimedCoupons([...claimedCoupons, couponId])
    toast.success('Coupon claimed to your account')
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Code ${code} copied`)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="h-8 w-8 text-primary" />
            Coupon Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and redeem your coupons
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm py-1 px-3">
            <Ticket className="h-4 w-4 mr-1" />
            {userCoupons.available.length} Available
          </Badge>
        </div>
      </div>

      {/* Redeem Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Redeem Code
          </CardTitle>
          <CardDescription>
            Enter a code to unlock exclusive coupons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Enter coupon code"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
              className="uppercase"
            />
            <Button onClick={handleRedeem} disabled={isRedeeming}>
              {isRedeeming ? 'Redeeming...' : 'Redeem'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Try code: GIFT2024
          </p>
        </CardContent>
      </Card>

      {/* Claim Center */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Claim Coupons
          </h2>
          <p className="text-sm text-muted-foreground">Limited offers, claim before they're gone</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {claimableCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              code={coupon.code}
              name={coupon.name}
              description={coupon.description}
              discountType={coupon.discount_type}
              discountValue={coupon.discount_value}
              minPurchase={coupon.min_purchase}
              maxDiscount={coupon.max_discount}
              validUntil={coupon.valid_until}
              onClaim={() => handleClaim(coupon.id, coupon.code)}
              isClaimed={claimedCoupons.includes(coupon.id)}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* My Coupons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Coupons</h2>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="available" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Active ({userCoupons.available.length})
            </TabsTrigger>
            <TabsTrigger value="used" className="gap-2">
              <Clock className="h-4 w-4" />
              Used ({userCoupons.used.length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="gap-2">
              <XCircle className="h-4 w-4" />
              Expired ({userCoupons.expired.length})
            </TabsTrigger>
          </TabsList>

          {/* Available Coupons */}
          <TabsContent value="available" className="mt-6">
            {userCoupons.available.length === 0 ? (
              <Card className="p-8 text-center">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No available coupons</p>
                <Button asChild variant="link" className="mt-2">
                  <Link href="#claim">Browse coupon center</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userCoupons.available.map((coupon) => (
                  <Card key={coupon.id} className="overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {coupon.discount_type === 'percentage' ? (
                              <Percent className="h-5 w-5 text-orange-500" />
                            ) : (
                              <Tag className="h-5 w-5 text-rose-500" />
                            )}
                            <span className="font-bold text-2xl text-primary">
                              {coupon.discount_type === 'percentage'
                                ? `${coupon.discount_value}%`
                                : `$${coupon.discount_value}`}
                            </span>
                          </div>
                          <p className="font-medium mt-1">{coupon.name}</p>
                        </div>
                        {coupon.is_new_user_only && (
                          <Badge variant="secondary">
                            <Gift className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {coupon.description}
                      </p>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          {coupon.min_purchase > 0 ? `Min $${coupon.min_purchase}` : 'No minimum'}
                          {coupon.max_discount && ` · Max $${coupon.max_discount}`}
                        </p>
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Valid until {coupon.valid_until}
                        </p>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Code:</span>
                          <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono">
                            {coupon.code}
                          </code>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyCode(coupon.code)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>

                      <Button asChild className="w-full">
                        <Link href="/dashboard/products">Shop Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Used Coupons */}
          <TabsContent value="used" className="mt-6">
            {userCoupons.used.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No used coupons</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userCoupons.used.map((coupon) => (
                  <Card key={coupon.id} className="overflow-hidden opacity-70">
                    <div className="h-2 bg-muted" />
                    <CardContent className="p-4 space-y-3 relative">
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="text-muted-foreground">
                          Used
                        </Badge>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          {coupon.discount_type === 'percentage' ? (
                            <Percent className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Tag className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="font-bold text-2xl text-muted-foreground">
                            {coupon.discount_type === 'percentage'
                              ? `${coupon.discount_value}%`
                              : `$${coupon.discount_value}`}
                          </span>
                        </div>
                        <p className="font-medium mt-1 text-muted-foreground">{coupon.name}</p>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {coupon.description}
                      </p>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Used: {coupon.used_at}</p>
                        <p>Order: {coupon.order_id}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Expired Coupons */}
          <TabsContent value="expired" className="mt-6">
            {userCoupons.expired.length === 0 ? (
              <Card className="p-8 text-center">
                <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No expired coupons</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userCoupons.expired.map((coupon) => (
                  <Card key={coupon.id} className="overflow-hidden opacity-50">
                    <div className="h-2 bg-destructive/50" />
                    <CardContent className="p-4 space-y-3 relative">
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive">Expired</Badge>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          {coupon.discount_type === 'percentage' ? (
                            <Percent className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Tag className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="font-bold text-2xl text-muted-foreground line-through">
                            {coupon.discount_type === 'percentage'
                              ? `${coupon.discount_value}%`
                              : `$${coupon.discount_value}`}
                          </span>
                        </div>
                        <p className="font-medium mt-1 text-muted-foreground">{coupon.name}</p>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {coupon.description}
                      </p>

                      <div className="text-xs text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Expired on {coupon.valid_until}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Instructions */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">How to Use Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Coupons are valid until the expiration date shown</li>
            <li>• Some coupons have minimum purchase requirements</li>
            <li>• Only one coupon per order</li>
            <li>• Cannot be combined with other promotions (unless stated)</li>
            <li>• Coupons are non-transferable and cannot be redeemed for cash</li>
            <li>• Contact customer service for questions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
