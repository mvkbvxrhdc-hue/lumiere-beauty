"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Check, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookingCalendar } from "@/components/booking-calendar"
import type { BeautyService } from "@/lib/beauty-services-data"

interface BookingButtonProps {
  service: BeautyService
}

export function BookingButton({ service }: BookingButtonProps) {
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)

    // Simulate a brief delay for better UX feedback
    await new Promise((resolve) => setTimeout(resolve, 300))

    addToCart(service, "service")

    toast.success("Added to cart!", {
      description: `${service.name} has been added to your cart.`,
      duration: 3000,
    })

    setIsLoading(false)
    setJustAdded(true)

    // Reset the success state after animation
    setTimeout(() => setJustAdded(false), 2000)
  }

  const handleBookingComplete = (booking: any) => {
    toast.success("Booking confirmed!", {
      description: `You have successfully booked ${service.name}. Confirmation has been sent to your email.`,
      duration: 5000,
    })
    setShowBookingDialog(false)
  }

  return (
    <div className="space-y-3">
      <Button
        className="w-full transition-all duration-200 active:scale-95"
        size="lg"
        onClick={() => setShowBookingDialog(true)}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Book Now
      </Button>
      
      <Button
        variant="outline"
        className="w-full transition-all duration-200 active:scale-95"
        size="lg"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : justAdded ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
          </DialogHeader>
          <BookingCalendar
            serviceId={service.id}
            serviceName={service.name}
            serviceDuration={service.duration}
            servicePrice={service.price}
            clinicName={service.clinic || "Glow Medical Spa"}
            clinicAddress={service.clinicAddress}
            onBookingComplete={handleBookingComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
