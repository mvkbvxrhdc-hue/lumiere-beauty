import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcryptjs from "bcryptjs"
import { getUser } from "@/lib/user-store"

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Virtual login mode: Allow any email/password combination
    // Check if user exists in store, if not create virtual user
    let user = getUser(email)

    if (!user) {
      // Virtual login: create temporary user object without storing
      user = {
        email: email.toLowerCase(),
        fullName: email.split("@")[0], // Use email prefix as name
        passwordHash: "", // Virtual users don't need password hashing
        createdAt: new Date().toISOString(),
      }
    } else {
      // If user exists, verify password
      const passwordMatch = await bcryptjs.compare(password, user.passwordHash)
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Incorrect email or password" },
          { status: 401 }
        )
      }
    }

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
        message: "Login successful",
        user: {
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("[Login API] Error:", error)
    return NextResponse.json(
      { error: error.message || "Login failed. Please try again." },
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
    console.warn("[Login API] Could not sync backend user profile", error)
  }
}
