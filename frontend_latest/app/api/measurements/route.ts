import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000"

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("auth_email")?.value

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const url = new URL(`${BACKEND_API_BASE_URL}/api/v1/measurements`)
  url.searchParams.set("user_id", userId)
  url.searchParams.set("limit", "50")

  try {
    const response = await fetch(url, { cache: "no-store" })
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(data ?? { error: "Could not load measurements" }, { status: response.status })
    }

    return NextResponse.json({ userId, measurements: data })
  } catch (error) {
    console.error("[measurements] backend request failed", error)
    return NextResponse.json({ error: "Could not connect to backend" }, { status: 502 })
  }
}
