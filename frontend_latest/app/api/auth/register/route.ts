import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcryptjs from "bcryptjs"
import { getUser, setUser, hasUser } from "@/lib/user-store"

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, full_name } = body

    // Validate input
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if email already exists
    if (hasUser(email)) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10)

    // Save user to shared store
    const user = {
      email: email.toLowerCase(),
      passwordHash,
      fullName: full_name,
      createdAt: new Date().toISOString(),
    }

    setUser(email, user)

    // Set auth cookie
    const cookieStore = await cookies()
    cookieStore.set("auth_email", email.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    await syncUserProfile(user.email, user.fullName)

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: {
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[Register API] Error:", error)
    return NextResponse.json(
      { error: error.message || "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}

async function syncUserProfile(email: string, fullName: string) {
  try {
    await fetch(`${BACKEND_API_BASE_URL}/api/v1/users/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        full_name: fullName,
        main_concerns: [],
      }),
      cache: "no-store",
    })
  } catch (error) {
    console.warn("[Register API] Could not sync backend user profile", error)
  }
}
