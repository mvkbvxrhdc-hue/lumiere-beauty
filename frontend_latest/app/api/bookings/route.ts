import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

// GET - Fetch user's bookings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const upcoming = searchParams.get("upcoming")

    let query = supabase
      .from("service_bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true })

    if (status) {
      query = query.eq("status", status)
    }

    if (upcoming === "true") {
      const today = new Date().toISOString().split("T")[0]
      query = query.gte("booking_date", today)
        .in("status", ["pending", "confirmed"])
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookings: data })
  } catch (error) {
    console.error("Bookings GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      serviceId,
      serviceName,
      serviceDuration,
      clinicName,
      bookingDate,
      bookingTime,
      email,
      phone,
      notes,
      notifyEmail,
      notifySms
    } = body

    // Validate required fields
    if (!serviceId || !bookingDate || !bookingTime || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if time slot is available
    const { data: existingBooking } = await supabase
      .from("service_bookings")
      .select("id")
      .eq("clinic_name", clinicName)
      .eq("booking_date", bookingDate)
      .eq("booking_time", bookingTime)
      .in("status", ["pending", "confirmed"])
      .single()

    if (existingBooking) {
      return NextResponse.json(
        { error: "This time slot is no longer available" },
        { status: 409 }
      )
    }

    // Create the booking
    const { data: booking, error } = await supabase
      .from("service_bookings")
      .insert({
        user_id: user.id,
        service_id: serviceId,
        service_name: serviceName,
        service_duration: serviceDuration,
        clinic_name: clinicName,
        booking_date: bookingDate,
        booking_time: bookingTime,
        email,
        phone_number: phone,
        notes,
        notification_email: notifyEmail,
        notification_sms: notifySms,
        status: "pending"
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send confirmation notification (in production, this would trigger email/SMS)
    if (notifyEmail) {
      await supabase.from("booking_reminders").insert({
        booking_id: booking.id,
        reminder_type: "confirmation",
        delivery_status: "sent"
      })
    }

    return NextResponse.json({ 
      success: true, 
      booking,
      message: "Booking created successfully" 
    })
  } catch (error) {
    console.error("Bookings POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
