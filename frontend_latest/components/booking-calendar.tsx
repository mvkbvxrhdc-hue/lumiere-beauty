"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Calendar as CalendarIcon, MapPin, Bell, Mail, Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays, isBefore, startOfDay, isToday } from "date-fns"

interface TimeSlot {
  time: string
  displayTime: string
  isAvailable: boolean
}

interface BookingCalendarProps {
  serviceId: string
  serviceName: string
  serviceDuration: string
  servicePrice: number
  clinicName: string
  clinicAddress?: string
  onBookingComplete?: (booking: BookingDetails) => void
}

interface BookingDetails {
  id?: string
  serviceId: string
  serviceName: string
  date: Date
  time: string
  clinicName: string
  email: string
  phone: string
  notes: string
  notifyEmail: boolean
  notifySms: boolean
}

function generateTimeSlots(date: Date, clinicName: string): TimeSlot[] {
  const dayOfWeek = date.getDay()
  const slots: TimeSlot[] = []

  let startHour = 9
  let endHour = 18
  let interval = 60

  if (clinicName.includes("Radiance")) {
    startHour = 8
    endHour = 17
    interval = 45
  } else if (clinicName.includes("Elite")) {
    startHour = 9
    endHour = 19
    interval = 50
  } else if (clinicName.includes("Premier")) {
    startHour = 10
    endHour = 20
    interval = 90
  }

  if (dayOfWeek === 0) {
    return []
  } else if (dayOfWeek === 6) {
    startHour = 10
    endHour = 16
  }

  const now = new Date()
  const isCurrentDay = isToday(date)

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      if (minute >= 60) continue

      const slotTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      const period = hour >= 12 ? "PM" : "AM"
      const displayTime = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`

      let isAvailable = true
      if (isCurrentDay) {
        const slotDateTime = new Date(date)
        slotDateTime.setHours(hour, minute, 0, 0)
        isAvailable = slotDateTime > now
      }

      if (Math.random() < 0.2) {
        isAvailable = false
      }

      slots.push({ time: slotTime, displayTime, isAvailable })
    }
  }

  return slots
}

export function BookingCalendar({
  serviceId,
  serviceName,
  serviceDuration,
  servicePrice,
  clinicName,
  clinicAddress,
  onBookingComplete,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true)
      setSelectedTime(null)
      setTimeout(() => {
        const slots = generateTimeSlots(selectedDate, clinicName)
        setTimeSlots(slots)
        setIsLoading(false)
      }, 300)
    }
  }, [selectedDate, clinicName])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const bookingDetails: BookingDetails = {
      id: `booking_${Date.now()}`,
      serviceId,
      serviceName,
      date: selectedDate,
      time: selectedTime,
      clinicName,
      email,
      phone,
      notes,
      notifyEmail,
      notifySms,
    }

    setIsLoading(false)
    setBookingSuccess(true)

    if (onBookingComplete) {
      onBookingComplete(bookingDetails)
    }
  }

  const disabledDays = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) || date.getDay() === 0
  }

  const resetBooking = () => {
    setSelectedDate(undefined)
    setSelectedTime(null)
    setEmail("")
    setPhone("")
    setNotes("")
    setShowConfirmDialog(false)
    setBookingSuccess(false)
  }

  return (
    <div className="space-y-6">
      {/* Service Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{serviceName}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {serviceDuration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {clinicName}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg font-semibold">
              ${servicePrice}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Select Date
            </CardTitle>
            <CardDescription>Choose your preferred appointment date</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              className="rounded-md border"
              fromDate={new Date()}
              toDate={addDays(new Date(), 60)}
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Select Time
            </CardTitle>
            <CardDescription>
              {selectedDate
                ? `Available slots on ${format(selectedDate, "MMMM d, yyyy")}`
                : "Please select a date first"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                <div className="text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a date on the left</p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-[280px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No available slots on this date</p>
                  <p className="text-sm">Please try another date</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[280px] pr-4">
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      disabled={!slot.isAvailable}
                      onClick={() => handleTimeSelect(slot.time)}
                      className={cn(
                        "h-10",
                        !slot.isAvailable && "opacity-50 line-through",
                        selectedTime === slot.time && "ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      {slot.displayTime}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact & Notifications */}
      {selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Contact & Reminder Settings
            </CardTitle>
            <CardDescription>
              Enter your contact details to receive booking confirmations and reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Let us know any special requirements or allergies..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium">Reminder Preferences</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-email">Email Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders 24 hours and 1 hour before your appointment
                  </p>
                </div>
                <Switch
                  id="notify-email"
                  checked={notifyEmail}
                  onCheckedChange={setNotifyEmail}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-sms">SMS Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a text message 24 hours before your appointment
                  </p>
                </div>
                <Switch
                  id="notify-sms"
                  checked={notifySms}
                  onCheckedChange={setNotifySms}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Summary */}
      {selectedDate && selectedTime && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Booking Summary</h3>
                <p className="text-muted-foreground">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {serviceName} · {clinicName}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setShowConfirmDialog(true)}
                disabled={!email || isLoading}
                className="min-w-[160px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          {!bookingSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Your Booking</DialogTitle>
                <DialogDescription>
                  Please review your booking details before confirming
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{serviceName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{serviceDuration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{clinicName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{email}</span>
                  </div>
                  {phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium">{phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Estimated Price</span>
                    <span className="font-semibold text-primary">${servicePrice}</span>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Go Back
                </Button>
                <Button onClick={handleBookingSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
                <DialogDescription className="text-center">
                  Your appointment has been successfully booked. A confirmation has been sent to your email.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-mono font-medium">BK{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Appointment</span>
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, "MMM d")} at {selectedTime}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  {notifyEmail && "We will send email reminders 24 hours and 1 hour before your appointment"}
                  {notifyEmail && notifySms && ", "}
                  {notifySms && "and an SMS reminder 24 hours before"}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={resetBooking} className="w-full">
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
