import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, MapPin, ArrowLeft, Check, Sparkles, TrendingUp, Calendar, Shield, Award } from "lucide-react"
import { beautyServices } from "@/lib/beauty-services-data"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookingButton } from "./booking-button"

export default async function BeautyServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = beautyServices.find((s) => s.id === id)

  if (!service) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Link href="/dashboard/beauty-services">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden">
            <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
            <div className="absolute top-4 right-4 flex gap-2">
              {service.popular && (
                <Badge className="bg-orange-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              {service.new && (
                <Badge className="bg-green-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  New
                </Badge>
              )}
            </div>
          </div>

          {/* Title and Rating */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground">{service.rating}</span>
                <span>({service.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{service.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{service.partnerClinic}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Treatment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{service.detailedDescription}</p>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Treatment Process */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {service.process.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {service.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews ({service.reviewCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {service.reviews.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                        <AvatarFallback>{review.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.userName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                    {review.id !== service.reviews[service.reviews.length - 1].id && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-6">
              {/* Price */}
              <div>
                <div className="text-3xl font-bold text-purple-600">${service.price}</div>
                {service.originalPrice && (
                  <div className="text-sm text-muted-foreground line-through">${service.originalPrice}</div>
                )}
              </div>

              <Separator />

              {/* What's Included */}
              <div>
                <h3 className="font-semibold mb-3">What's Included</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Certified Professionals</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span>Satisfaction Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Flexible Scheduling</span>
                </div>
              </div>

              <BookingButton service={service} />

              <p className="text-xs text-center text-muted-foreground">
                Free cancellation up to 24 hours before appointment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
