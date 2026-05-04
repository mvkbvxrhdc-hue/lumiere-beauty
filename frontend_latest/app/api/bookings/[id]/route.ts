import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

// GET - Fetch single booking details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: booking, error } = await supabase
      .from("service_bookings")
      .select("*, booking_reminders(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Booking GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update booking (reschedule or modify)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify ownership
    const { data: existingBooking } = await supabase
      .from("service_bookings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if booking can be modified
    if (existingBooking.status === "cancelled" || existingBooking.status === "completed") {
      return NextResponse.json(
        { error: "Cannot modify a cancelled or completed booking" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { bookingDate, bookingTime, notes, notifyEmail, notifySms, phone } = body

    // If rescheduling, check if new time slot is available
    if (bookingDate && bookingTime) {
      const { data: conflictingBooking } = await supabase
        .from("service_bookings")
        .select("id")
        .eq("clinic_name", existingBooking.clinic_name)
        .eq("booking_date", bookingDate)
        .eq("booking_time", bookingTime)
        .neq("id", id)
        .in("status", ["pending", "confirmed"])
        .single()

      if (conflictingBooking) {
        return NextResponse.json(
          { error: "This time slot is no longer available" },
          { status: 409 }
        )
      }
    }

    // Build update object
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (bookingDate) updateData.booking_date = bookingDate
    if (bookingTime) updateData.booking_time = bookingTime
    if (notes !== undefined) updateData.notes = notes
    if (notifyEmail !== undefined) updateData.notification_email = notifyEmail
    if (notifySms !== undefined) updateData.notification_sms = notifySms
    if (phone !== undefined) updateData.phone_number = phone

    // If rescheduling, reset status to pending and track original booking
    if (bookingDate || bookingTime) {
      updateData.status = "pending"
      updateData.rescheduled_from = existingBooking.rescheduled_from || id
    }

    const { data: booking, error } = await supabase
      .from("service_bookings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating booking:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send reschedule notification
    if ((bookingDate || bookingTime) && existingBooking.notification_email) {
      await supabase.from("booking_reminders").insert({
        booking_id: id,
        reminder_type: "reschedule",
        delivery_status: "sent"
      })
    }

    return NextResponse.json({ 
      success: true, 
      booking,
      message: "Booking updated successfully" 
    })
  } catch (error) {
    console.error("Booking PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify ownership
    const { data: existingBooking } = await supabase
      .from("service_bookings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if booking can be cancelled
    if (existingBooking.status === "cancelled") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      )
    }

    if (existingBooking.status === "completed") {
      return NextResponse.json(
        { error: "Cannot cancel a completed booking" },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { reason } = body

    // Update booking status to cancelled
    const { data: booking, error } = await supabase
      .from("service_bookings")
      .update({
        status: "cancelled",
        cancellation_reason: reason || null,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error cancelling booking:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send cancellation notification
    if (existingBooking.notification_email) {
      await supabase.from("booking_reminders").insert({
        booking_id: id,
        reminder_type: "cancellation",
        delivery_status: "sent"
      })
    }

    return NextResponse.json({ 
      success: true, 
      booking,
      message: "Booking cancelled successfully" 
    })
  } catch (error) {
    console.error("Booking DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
