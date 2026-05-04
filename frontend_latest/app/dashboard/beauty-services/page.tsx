"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, MapPin, Sparkles, TrendingUp, Check } from "lucide-react"
import { beautyServices, categories, type BeautyService } from "@/lib/beauty-services-data"

export default function BeautyServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedService, setSelectedService] = useState<BeautyService | null>(null)

  const filteredServices =
    selectedCategory === "all"
      ? beautyServices
      : beautyServices.filter((service) => service.category === selectedCategory)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Partner Clinics
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Beauty Services</h1>
            <p className="text-lg text-white/90 mb-6">
              Discover premium beauty treatments from our trusted partner clinics. From advanced facials to body
              contouring, find the perfect service for your beauty goals.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Certified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Premium Equipment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
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
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm shrink-0">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviewCount})</span>
                </div>
              </div>
              <CardDescription className="line-clamp-2">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{service.partnerClinic}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">${service.price}</div>
                    {service.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">${service.originalPrice}</div>
                    )}
                  </div>
                  <Link href={`/dashboard/beauty-services/${service.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services found in this category.</p>
        </div>
      )}
    </div>
  )
}
