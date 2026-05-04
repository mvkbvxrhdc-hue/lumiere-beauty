import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

// This endpoint would be called by a cron job to send booking reminders
// In production, this would integrate with email/SMS services like SendGrid, Twilio, etc.

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (in production)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000)

    const results = {
      reminders24h: { sent: 0, failed: 0 },
      reminders1h: { sent: 0, failed: 0 }
    }

    // Find bookings that need 24-hour reminder
    const { data: bookings24h } = await supabase
      .from("service_bookings")
      .select("*")
      .eq("status", "confirmed")
      .eq("reminder_sent_24h", false)
      .eq("notification_email", true)
      .lte("booking_date", in24Hours.toISOString().split("T")[0])
      .gte("booking_date", now.toISOString().split("T")[0])

    if (bookings24h) {
      for (const booking of bookings24h) {
        const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`)
        const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

        if (hoursUntilBooking <= 24 && hoursUntilBooking > 1) {
          try {
            // In production: Send email reminder here
            // await sendEmailReminder(booking, "24h")
            
            // Record reminder sent
            await supabase.from("booking_reminders").insert({
              booking_id: booking.id,
              reminder_type: "email_24h",
              delivery_status: "sent"
            })

            // Update booking
            await supabase
              .from("service_bookings")
              .update({ reminder_sent_24h: true })
              .eq("id", booking.id)

            results.reminders24h.sent++

            // Send SMS if enabled
            if (booking.notification_sms && booking.phone_number) {
              // await sendSmsReminder(booking, "24h")
              await supabase.from("booking_reminders").insert({
                booking_id: booking.id,
                reminder_type: "sms_24h",
                delivery_status: "sent"
              })
            }
          } catch (error) {
            console.error(`Failed to send 24h reminder for booking ${booking.id}:`, error)
            results.reminders24h.failed++
            
            await supabase.from("booking_reminders").insert({
              booking_id: booking.id,
              reminder_type: "email_24h",
              delivery_status: "failed",
              error_message: error instanceof Error ? error.message : "Unknown error"
            })
          }
        }
      }
    }

    // Find bookings that need 1-hour reminder
    const { data: bookings1h } = await supabase
      .from("service_bookings")
      .select("*")
      .eq("status", "confirmed")
      .eq("reminder_sent_1h", false)
      .eq("notification_email", true)
      .eq("booking_date", now.toISOString().split("T")[0])

    if (bookings1h) {
      for (const booking of bookings1h) {
        const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`)
        const minutesUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60)

        if (minutesUntilBooking <= 60 && minutesUntilBooking > 0) {
          try {
            // In production: Send email reminder here
            // await sendEmailReminder(booking, "1h")
            
            await supabase.from("booking_reminders").insert({
              booking_id: booking.id,
              reminder_type: "email_1h",
              delivery_status: "sent"
            })

            await supabase
              .from("service_bookings")
              .update({ reminder_sent_1h: true })
              .eq("id", booking.id)

            results.reminders1h.sent++

            // Send SMS if enabled
            if (booking.notification_sms && booking.phone_number) {
              // await sendSmsReminder(booking, "1h")
              await supabase.from("booking_reminders").insert({
                booking_id: booking.id,
                reminder_type: "sms_1h",
                delivery_status: "sent"
              })
            }
          } catch (error) {
            console.error(`Failed to send 1h reminder for booking ${booking.id}:`, error)
            results.reminders1h.failed++
            
            await supabase.from("booking_reminders").insert({
              booking_id: booking.id,
              reminder_type: "email_1h",
              delivery_status: "failed",
              error_message: error instanceof Error ? error.message : "Unknown error"
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Sent ${results.reminders24h.sent} 24h reminders and ${results.reminders1h.sent} 1h reminders`
    })
  } catch (error) {
    console.error("Send reminders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Email template generator (placeholder for production implementation)
function generateEmailContent(booking: any, reminderType: string) {
  if (reminderType === "24h") {
    return {
      subject: `Reminder: Your appointment tomorrow at ${booking.booking_time}`,
      body: `Dear Customer,\n\nThis is a friendly reminder about your upcoming appointment:\n\nService: ${booking.service_name}\nDate: ${booking.booking_date}\nTime: ${booking.booking_time}\nLocation: ${booking.clinic_name}\n\nWe look forward to seeing you!\n\nBest regards,\nLumière Beauty Team`
    }
  }

  return {
    subject: `Reminder: Your appointment is in 1 hour`,
    body: `Dear Customer,\n\nYour appointment is starting in 1 hour:\n\nService: ${booking.service_name}\nTime: ${booking.booking_time}\nLocation: ${booking.clinic_name}\n\nPlease arrive 10 minutes early.\n\nSee you soon!\n\nBest regards,\nLumière Beauty Team`
  }
}
