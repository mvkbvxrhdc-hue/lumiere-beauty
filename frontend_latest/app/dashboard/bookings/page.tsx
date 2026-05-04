'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Bell,
  ChevronRight,
  Loader2,
  History,
  CalendarDays,
  Phone,
  Mail
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { format, addDays, isBefore, isAfter, parseISO, startOfDay } from 'date-fns'

// Mock booking data
const mockBookings = [
  {
    id: 'bk_001',
    serviceName: 'HydraFacial Treatment',
    serviceId: 'svc_001',
    clinicName: 'Glow Medical Spa',
    clinicAddress: '123 Skin Care Ave, Beauty City, BC 12345',
    bookingDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    bookingTime: '10:00',
    duration: '60 mins',
    price: 129,
    status: 'confirmed',
    createdAt: format(addDays(new Date(), -2), 'yyyy-MM-dd HH:mm'),
    notifyEmail: true,
    notifySms: true,
    email: 'user@example.com',
    phone: '(555) 123-4567'
  },
  {
    id: 'bk_002',
    serviceName: 'IPL Photo Facial',
    serviceId: 'svc_002',
    clinicName: 'Radiance Skin Clinic',
    clinicAddress: '456 Beauty Blvd, Wellness Town, WT 67890',
    bookingDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    bookingTime: '14:30',
    duration: '45 mins',
    price: 98,
    status: 'pending',
    createdAt: format(addDays(new Date(), -1), 'yyyy-MM-dd HH:mm'),
    notifyEmail: true,
    notifySms: false,
    email: 'user@example.com',
    phone: ''
  },
  {
    id: 'bk_003',
    serviceName: 'Deep Facial Cleansing',
    serviceId: 'svc_003',
    clinicName: 'Elite Dermatology Center',
    clinicAddress: '789 Wellness Park, Health City, HC 11111',
    bookingDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    bookingTime: '16:00',
    duration: '50 mins',
    price: 68,
    status: 'completed',
    createdAt: format(addDays(new Date(), -10), 'yyyy-MM-dd HH:mm'),
    notifyEmail: true,
    notifySms: true,
    email: 'user@example.com',
    phone: '(555) 123-4567'
  },
  {
    id: 'bk_004',
    serviceName: 'Hyaluronic Acid Filler',
    serviceId: 'svc_004',
    clinicName: 'Premier Aesthetics Clinic',
    clinicAddress: '321 Luxury Lane, Elite City, EC 22222',
    bookingDate: format(addDays(new Date(), -10), 'yyyy-MM-dd'),
    bookingTime: '11:00',
    duration: '90 mins',
    price: 368,
    status: 'cancelled',
    cancellationReason: 'Unexpected schedule conflict',
    createdAt: format(addDays(new Date(), -15), 'yyyy-MM-dd HH:mm'),
    notifyEmail: true,
    notifySms: false,
    email: 'user@example.com',
    phone: ''
  },
  {
    id: 'bk_005',
    serviceName: 'Laser Spot Removal',
    serviceId: 'svc_005',
    clinicName: 'Glow Medical Spa',
    clinicAddress: '123 Skin Care Ave, Beauty City, BC 12345',
    bookingDate: format(addDays(new Date(), -20), 'yyyy-MM-dd'),
    bookingTime: '09:30',
    duration: '60 mins',
    price: 158,
    status: 'completed',
    createdAt: format(addDays(new Date(), -25), 'yyyy-MM-dd HH:mm'),
    notifyEmail: true,
    notifySms: true,
    email: 'user@example.com',
    phone: '(555) 123-4567'
  }
]

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

interface Booking {
  id: string
  serviceName: string
  serviceId: string
  clinicName: string
  clinicAddress: string
  bookingDate: string
  bookingTime: string
  duration: string
  price: number
  status: BookingStatus
  cancellationReason?: string
  createdAt: string
  notifyEmail: boolean
  notifySms: boolean
  email: string
  phone: string
}

const statusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  pending: { label: 'Pending', variant: 'secondary', icon: AlertCircle },
  confirmed: { label: 'Confirmed', variant: 'default', icon: CheckCircle2 },
  completed: { label: 'Completed', variant: 'outline', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
  no_show: { label: 'No Show', variant: 'destructive', icon: AlertCircle }
}

function BookingCard({ booking, onReschedule, onCancel }: {
  booking: Booking
  onReschedule: (booking: Booking) => void
  onCancel: (booking: Booking) => void
}) {
  const bookingDate = parseISO(booking.bookingDate)
  const isPast = isBefore(bookingDate, startOfDay(new Date()))
  const isUpcoming = isAfter(bookingDate, startOfDay(new Date())) ||
    (format(bookingDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
  const canModify = !isPast && booking.status !== 'cancelled' && booking.status !== 'completed'

  const StatusIcon = statusConfig[booking.status].icon

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      booking.status === 'cancelled' && 'opacity-60'
    )}>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                <p className="text-sm text-muted-foreground">{booking.clinicName}</p>
              </div>
              <Badge variant={statusConfig[booking.status].variant} className="flex items-center gap-1">
                <StatusIcon className="h-3 w-3" />
                {statusConfig[booking.status].label}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                {format(bookingDate, 'MMM d, yyyy EEEE')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {booking.bookingTime} ({booking.duration})
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {booking.clinicAddress}
            </div>

            {booking.cancellationReason && (
              <div className="p-3 rounded-lg bg-destructive/10 text-sm">
                <span className="font-medium text-destructive">Cancellation Reason: </span>
                <span className="text-muted-foreground">{booking.cancellationReason}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              {booking.notifyEmail && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  Email reminders
                </span>
              )}
              {booking.notifySms && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  SMS reminders
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <div className="text-lg font-semibold text-primary">${booking.price}</div>
              <div className="text-xs text-muted-foreground">
                Booking: {booking.id.toUpperCase()}
              </div>
            </div>

            {canModify && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onReschedule(booking)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onCancel(booking)}
                    className="text-destructive focus:text-destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings as Booking[])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Reschedule form state
  const [newDate, setNewDate] = useState<Date | undefined>(undefined)
  const [newTime, setNewTime] = useState<string>('')
  const [cancelReason, setCancelReason] = useState('')

  const upcomingBookings = bookings.filter(b => {
    const bookingDate = parseISO(b.bookingDate)
    return (isAfter(bookingDate, startOfDay(new Date())) ||
      format(bookingDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) &&
      b.status !== 'cancelled' && b.status !== 'completed'
  })

  const pastBookings = bookings.filter(b => {
    const bookingDate = parseISO(b.bookingDate)
    return isBefore(bookingDate, startOfDay(new Date())) ||
      b.status === 'cancelled' || b.status === 'completed'
  })

  const handleReschedule = (booking: Booking) => {
    setSelectedBooking(booking)
    setNewDate(undefined)
    setNewTime('')
    setShowRescheduleDialog(true)
  }

  const handleCancel = (booking: Booking) => {
    setSelectedBooking(booking)
    setCancelReason('')
    setShowCancelDialog(true)
  }

  const confirmReschedule = async () => {
    if (!selectedBooking || !newDate || !newTime) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setBookings(prev => prev.map(b => {
      if (b.id === selectedBooking.id) {
        return {
          ...b,
          bookingDate: format(newDate, 'yyyy-MM-dd'),
          bookingTime: newTime,
          status: 'pending' as BookingStatus
        }
      }
      return b
    }))

    setIsLoading(false)
    setShowRescheduleDialog(false)
    setSelectedBooking(null)
  }

  const confirmCancel = async () => {
    if (!selectedBooking) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setBookings(prev => prev.map(b => {
      if (b.id === selectedBooking.id) {
        return {
          ...b,
          status: 'cancelled' as BookingStatus,
          cancellationReason: cancelReason
        }
      }
      return b
    }))

    setIsLoading(false)
    setShowCancelDialog(false)
    setSelectedBooking(null)
  }

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">Manage and track your beauty service appointments</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Upcoming
            {upcomingBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {upcomingBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-1">No Bookings</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any upcoming appointments
                </p>
                <Button asChild>
                  <a href="/dashboard/beauty-services">
                    Browse Beauty Services
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-1">No History</h3>
                <p className="text-muted-foreground">
                  You don't have any booking history yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for your appointment
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{selectedBooking.serviceName}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.clinicName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Current: {format(parseISO(selectedBooking.bookingDate), 'MMM d')} at {selectedBooking.bookingTime}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Select New Date</Label>
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  disabled={(date) => isBefore(date, startOfDay(new Date())) || date.getDay() === 0}
                  className="rounded-md border"
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 60)}
                />
              </div>

              {newDate && (
                <div className="space-y-2">
                  <Label>Select New Time</Label>
                  <ScrollArea className="h-[120px]">
                    <div className="grid grid-cols-4 gap-2">
                      {availableTimes.map(time => (
                        <Button
                          key={time}
                          variant={newTime === time ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmReschedule}
              disabled={!newDate || !newTime || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Reschedule'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{selectedBooking.serviceName}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.clinicName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(parseISO(selectedBooking.bookingDate), 'MMM d, yyyy')} at {selectedBooking.bookingTime}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancel-reason">Cancellation Reason (Optional)</Label>
                <Textarea
                  id="cancel-reason"
                  placeholder="Please tell us why you're cancelling..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Cancellation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
