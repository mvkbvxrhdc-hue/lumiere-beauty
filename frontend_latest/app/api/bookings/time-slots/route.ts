import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

// GET - Fetch available time slots for a specific date and clinic
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const clinicName = searchParams.get("clinic")
    const serviceDuration = parseInt(searchParams.get("duration") || "60")

    if (!date || !clinicName) {
      return NextResponse.json(
        { error: "Date and clinic name are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const bookingDate = new Date(date)
    const dayOfWeek = bookingDate.getDay()

    // Check if date is blocked
    const { data: blockedDate } = await supabase
      .from("clinic_blocked_dates")
      .select("*")
      .eq("clinic_name", clinicName)
      .eq("blocked_date", date)
      .single()

    if (blockedDate) {
      return NextResponse.json({ 
        slots: [],
        message: blockedDate.reason || "This date is not available"
      })
    }

    // Get clinic schedule for this day
    const { data: schedule } = await supabase
      .from("clinic_time_slots")
      .select("*")
      .eq("clinic_name", clinicName)
      .eq("day_of_week", dayOfWeek)
      .eq("is_active", true)
      .single()

    // If no schedule found, use default hours
    const startHour = schedule?.start_time ? parseInt(schedule.start_time.split(":")[0]) : 9
    const endHour = schedule?.end_time ? parseInt(schedule.end_time.split(":")[0]) : 18
    const slotDuration = schedule?.slot_duration_minutes || 60

    // Get existing bookings for this date and clinic
    const { data: existingBookings } = await supabase
      .from("service_bookings")
      .select("booking_time")
      .eq("clinic_name", clinicName)
      .eq("booking_date", date)
      .in("status", ["pending", "confirmed"])

    const bookedTimes = new Set(existingBookings?.map(b => b.booking_time) || [])

    // Generate time slots
    const slots = []
    const now = new Date()
    const isToday = bookingDate.toDateString() === now.toDateString()

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        if (minute >= 60) continue

        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        
        // Skip past times for today
        let isAvailable = true
        if (isToday) {
          const slotDateTime = new Date(bookingDate)
          slotDateTime.setHours(hour, minute, 0, 0)
          if (slotDateTime <= now) {
            isAvailable = false
          }
        }

        // Check if slot is already booked
        if (bookedTimes.has(timeString)) {
          isAvailable = false
        }

        // Format display time
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
        const period = hour >= 12 ? "PM" : "AM"
        const displayTime = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`

        slots.push({
          time: timeString,
          displayTime,
          isAvailable
        })
      }
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("Time slots GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
